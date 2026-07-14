const { getAdmin } = require('./firebase-admin');
const { json, hashSecret } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

function normalizeCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
}

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
    await enforceRateLimit(admin, db, 'invite-accept:' + decoded.uid, 20, 900);
    const body = JSON.parse(event.body || '{}');
    const code = normalizeCode(body.code);
    if (code.length < 6) return json(400, { error: 'Enter a valid invite code.' });

    const hashedInviteRef = db.collection('groupInvites').doc(hashSecret(code));
    const legacyInviteRef = db.collection('groupInvites').doc(code);
    const userRef = db.collection('users').doc(decoded.uid);
    let result = null;

    await db.runTransaction(async transaction => {
      const userSnap = await transaction.get(userRef);
      const profile = userSnap.exists ? userSnap.data() : {};
      if (profile.groupId) throw new Error('Your account already belongs to a group.');

      let inviteRef = hashedInviteRef;
      let inviteSnap = await transaction.get(inviteRef);
      if (!inviteSnap.exists) {
        inviteRef = legacyInviteRef;
        inviteSnap = await transaction.get(inviteRef);
      }
      if (!inviteSnap.exists) throw new Error('That invite code is invalid.');
      const invite = inviteSnap.data();
      if (invite.active === false) throw new Error('That invite code has been revoked.');
      if (invite.expiresAt && invite.expiresAt.toMillis() <= Date.now()) throw new Error('That invite code has expired.');

      const groupRef = db.collection('groups').doc(String(invite.groupId || ''));
      const groupSnap = await transaction.get(groupRef);
      if (!groupSnap.exists) throw new Error('That group no longer exists.');
      const group = groupSnap.data();
      const members = Array.isArray(group.memberUids) ? group.memberUids : [];
      if (members.includes(decoded.uid)) throw new Error('You are already a member of this group.');
      const memberCount = Number(group.memberCount || members.length || 0);
      const groupSize = Number(group.groupSize || 3);
      if (memberCount >= groupSize) throw new Error('That group is already full.');

      const uses = Number(invite.uses || 0);
      const maxUses = Number(invite.maxUses || Math.max(1, groupSize - 1));
      if (uses >= maxUses) throw new Error('That invite code has no uses remaining.');

      const slotNumber = memberCount + 1;
      const slot = `player${slotNumber}`;
      const memberRef = groupRef.collection('members').doc(decoded.uid);
      const progressRef = groupRef.collection('progress').doc('main');
      const now = admin.firestore.FieldValue.serverTimestamp();
      const displayName = String(profile.displayName || decoded.name || decoded.email || 'Player').slice(0, 80);
      const runescapeName = String(profile.runescapeName || '').slice(0, 12);
      const playerName = runescapeName || displayName || `Player ${slotNumber}`;

      transaction.update(groupRef, {
        memberUids: admin.firestore.FieldValue.arrayUnion(decoded.uid),
        memberCount: memberCount + 1,
        updatedAt: now
      });
      transaction.set(memberRef, {
        uid: decoded.uid,
        displayName,
        runescapeName,
        role: 'member',
        slot,
        joinedAt: now,
        updatedAt: now
      });
      transaction.set(userRef, {
        groupId: groupRef.id,
        role: 'member',
        slot,
        updatedAt: now
      }, { merge: true });
      transaction.set(progressRef, {
        players: { [slot]: playerName },
        updatedAt: now
      }, { merge: true });
      transaction.update(inviteRef, {
        uses: uses + 1,
        active: uses + 1 < maxUses && memberCount + 1 < groupSize,
        updatedAt: now
      });
      result = { groupId: groupRef.id, slot };
    });

    return json(200, result);
  } catch (error) {
    console.error('group-invite-accept', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not join the group.' });
  }
};
