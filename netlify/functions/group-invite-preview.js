const { getAdmin } = require('./firebase-admin');
const { json, hashSecret } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');
function normalize(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16); }
exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  try {
    const header = event.headers.authorization || event.headers.Authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return json(401, { error: 'Please log in first.' });
    const admin = getAdmin();
    await admin.auth().verifyIdToken(token);
    const db = admin.firestore();
    await enforceRateLimit(admin, db, 'invite-preview:' + (event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'anonymous'), 30, 900);
    const body = JSON.parse(event.body || '{}');
    const code = normalize(body.code);
    if (code.length < 6) return json(400, { error: 'Enter a valid invite code.' });
    let snap = await db.collection('groupInvites').doc(hashSecret(code)).get();
    if (!snap.exists) snap = await db.collection('groupInvites').doc(code).get();
    if (!snap.exists) return json(404, { error: 'That invite code is invalid.' });
    const invite = snap.data();
    const expired = !!(invite.expiresAt && invite.expiresAt.toMillis() <= Date.now());
    const remainingUses = Math.max(0, Number(invite.maxUses || 1) - Number(invite.uses || 0));
    if (invite.active === false) return json(410, { error: 'That invite has been revoked.' });
    if (expired) return json(410, { error: 'That invite has expired.' });
    if (!remainingUses) return json(410, { error: 'That invite has no uses remaining.' });
    const groupSnap = await db.collection('groups').doc(String(invite.groupId || '')).get();
    if (!groupSnap.exists) return json(404, { error: 'That group no longer exists.' });
    const group = groupSnap.data();
    if (Number(group.memberCount || 0) >= Number(group.groupSize || 3)) return json(409, { error: 'That group is already full.' });
    return json(200, {
      groupName: invite.groupName || group.name || 'HCIM Group',
      memberCount: Number(group.memberCount || 0),
      groupSize: Number(group.groupSize || 3),
      remainingUses,
      expiresAt: invite.expiresAt?.toMillis?.() || null
    });
  } catch (error) {
    console.error('group-invite-preview', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not preview invitation.' });
  }
};
