const { getAdmin } = require('./firebase-admin');
const { json, randomCode, hashSecret } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

const MAX_EXPIRY_HOURS = 168;

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : fallback;
}

async function requireOwner(db, uid, groupId) {
  const groupRef = db.collection('groups').doc(String(groupId || ''));
  const snap = await groupRef.get();
  if (!snap.exists) throw new Error('Group not found.');
  const group = snap.data();
  if (group.ownerUid !== uid) throw new Error('Only the group owner can manage invitations.');
  return { groupRef, group };
}

function serializeInvite(doc) {
  const d = doc.data();
  const millis = value => value && typeof value.toMillis === 'function' ? value.toMillis() : null;
  return {
    id: doc.id,
    code: d.code || '',
    active: d.active !== false,
    uses: Number(d.uses || 0),
    maxUses: Number(d.maxUses || 1),
    createdAt: millis(d.createdAt),
    expiresAt: millis(d.expiresAt),
    revokedAt: millis(d.revokedAt)
  };
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  try {
    const header = event.headers.authorization || event.headers.Authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return json(401, { error: 'Missing website authentication.' });
    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    const db = admin.firestore();
    await enforceRateLimit(admin, db, 'invite-manage:' + decoded.uid, 20, 3600);
    const body = JSON.parse(event.body || '{}');
    const action = String(body.action || 'list');
    const { groupRef, group } = await requireOwner(db, decoded.uid, body.groupId);
    const invites = db.collection('groupInvites');

    if (action === 'list') {
      // Migrate the original v4.4.0 invitation so it can be managed in the UI.
      if (group.inviteCode) {
        const legacyCode = String(group.inviteCode).toUpperCase().replace(/[^A-Z0-9]/g, '');
        const legacyRef = invites.doc(hashSecret(legacyCode));
        const legacySnap = await legacyRef.get();
        if (legacySnap.exists && !legacySnap.data().code) await legacyRef.set({ code: legacyCode }, { merge: true });
      }
      const snap = await invites.where('groupId', '==', groupRef.id).get();
      const rows = snap.docs.map(serializeInvite).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return json(200, { invites: rows });
    }

    if (action === 'create') {
      const remainingSlots = Math.max(0, Number(group.groupSize || 3) - Number(group.memberCount || 1));
      if (!remainingSlots) return json(409, { error: 'This group is already full.' });
      const maxUses = clampInt(body.maxUses, 1, remainingSlots, 1);
      const expiryHours = clampInt(body.expiryHours, 1, MAX_EXPIRY_HOURS, 72);
      const code = randomCode().replace('-', '');
      const ref = invites.doc(hashSecret(code));
      const now = admin.firestore.Timestamp.now();
      const expiresAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + expiryHours * 60 * 60 * 1000);
      await ref.set({
        code,
        groupId: groupRef.id,
        groupName: group.name || 'HCIM Group',
        ownerUid: decoded.uid,
        active: true,
        uses: 0,
        maxUses,
        expiresAt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return json(200, { invite: { id: ref.id, code, active: true, uses: 0, maxUses, expiresAt: expiresAt.toMillis() } });
    }

    if (action === 'revoke') {
      const inviteId = String(body.inviteId || '');
      if (!inviteId) return json(400, { error: 'Missing invitation.' });
      const ref = invites.doc(inviteId);
      const snap = await ref.get();
      if (!snap.exists || snap.data().groupId !== groupRef.id) return json(404, { error: 'Invitation not found.' });
      await ref.set({ active: false, revokedAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return json(200, { revoked: true });
    }

    return json(400, { error: 'Unknown invite action.' });
  } catch (error) {
    console.error('group-invite-manage', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not manage invitations.' });
  }
};
