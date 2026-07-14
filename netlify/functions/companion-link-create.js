const { getAdmin } = require('./firebase-admin');
const { json, hashSecret, randomCode } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) return json(401, { error: 'Missing website authentication.' });

    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const db = admin.firestore();
    await enforceRateLimit(admin, db, 'companion-link-create:' + decoded.uid, 10, 3600);

    const userSnap = await db.collection('users').doc(decoded.uid).get();
    const profile = userSnap.exists ? userSnap.data() : {};
    const groupId = String(profile.groupId || '');
    if (!groupId) return json(400, { error: 'Join or create a group first.' });

    const groupSnap = await db.collection('groups').doc(groupId).get();
    const group = groupSnap.exists ? groupSnap.data() : null;
    if (!group || !(group.memberUids || []).includes(decoded.uid)) {
      return json(403, { error: 'You are not an active member of this group.' });
    }

    const code = randomCode();
    const codeHash = hashSecret(code.replace('-', '').toUpperCase());
    const now = Date.now();
    const expiresAtMs = now + (10 * 60 * 1000);

    await db.collection('companionLinkCodes').doc(codeHash).set({
      uid: decoded.uid,
      groupId,
      displayName: String(profile.displayName || decoded.name || decoded.email || 'Player').slice(0, 80),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromMillis(expiresAtMs),
      used: false
    });

    return json(200, { code, expiresAtMs, expiresInSeconds: 600 });
  } catch (error) {
    console.error('companion-link-create', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not create link code.' });
  }
};
