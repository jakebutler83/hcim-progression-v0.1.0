const { getAdmin } = require('./firebase-admin');
const { json, randomCode, hashSecret } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 40);
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
    await enforceRateLimit(admin, db, 'group-create:' + decoded.uid, 5, 3600);
    const body = JSON.parse(event.body || '{}');
    const name = cleanName(body.name);
    const groupSize = Number(body.groupSize);

    if (name.length < 2) return json(400, { error: 'Group name must be at least 2 characters.' });
    if (!Number.isInteger(groupSize) || groupSize < 2 || groupSize > 5) {
      return json(400, { error: 'Group size must be between 2 and 5.' });
    }

    const userRef = db.collection('users').doc(decoded.uid);
    const userSnap = await userRef.get();
    const profile = userSnap.exists ? userSnap.data() : {};
    if (profile.groupId) return json(409, { error: 'Your account already belongs to a group.' });

    const groupRef = db.collection('groups').doc();
    const inviteCode = randomCode().replace('-', '');
    const inviteHash = hashSecret(inviteCode);
    const inviteRef = db.collection('groupInvites').doc(inviteHash);
    const memberRef = groupRef.collection('members').doc(decoded.uid);
    const progressRef = groupRef.collection('progress').doc('main');
    const now = admin.firestore.FieldValue.serverTimestamp();
    const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + 72 * 60 * 60 * 1000);
    const displayName = String(profile.displayName || decoded.name || decoded.email || 'Player').slice(0, 80);
    const runescapeName = String(profile.runescapeName || '').slice(0, 12);

    const batch = db.batch();
    batch.set(groupRef, {
      name,
      ownerUid: decoded.uid,
      memberUids: [decoded.uid],
      memberCount: 1,
      groupSize,
      inviteCode,
      inviteVersion: 1,
      createdAt: now,
      updatedAt: now
    });
    batch.set(inviteRef, {
      code: inviteCode,
      groupId: groupRef.id,
      groupName: name,
      ownerUid: decoded.uid,
      active: true,
      uses: 0,
      maxUses: groupSize - 1,
      expiresAt,
      createdAt: now,
      updatedAt: now
    });
    batch.set(memberRef, {
      uid: decoded.uid,
      displayName,
      runescapeName,
      role: 'owner',
      slot: 'player1',
      joinedAt: now,
      updatedAt: now
    });
    batch.set(userRef, {
      groupId: groupRef.id,
      role: 'owner',
      slot: 'player1',
      updatedAt: now
    }, { merge: true });
    batch.set(progressRef, {
      done: {}, playerDone: {}, diaryDone: {}, diarySteps: {},
      players: {
        groupName: name,
        player1: runescapeName || displayName || 'Player 1',
        player2: '', player3: '', player4: '', player5: ''
      },
      createdAt: now,
      updatedAt: now
    });
    await batch.commit();

    return json(200, { groupId: groupRef.id, inviteCode, slot: 'player1' });
  } catch (error) {
    console.error('group-create', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not create the group.' });
  }
};
