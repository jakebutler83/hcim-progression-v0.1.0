const { getAdmin } = require('./firebase-admin');
const { json } = require('./companion-common');
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
    await enforceRateLimit(admin, db, 'companion-link-revoke:' + decoded.uid, 20, 3600);
    const snaps = await db.collection('companionTokens').where('uid', '==', decoded.uid).get();
    const batch = db.batch();
    snaps.docs.forEach(doc => batch.set(doc.ref, {
      revoked: true,
      revokedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true }));
    await batch.commit();

    const profileSnap = await db.collection('users').doc(decoded.uid).get();
    const groupId = profileSnap.exists ? String(profileSnap.data().groupId || '') : '';
    if (groupId) {
      await db.collection('groups').doc(groupId).collection('locations').doc(decoded.uid).set({
        online: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    return json(200, { ok: true, revoked: snaps.size });
  } catch (error) {
    console.error('companion-link-revoke', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not disconnect companion.' });
  }
};
