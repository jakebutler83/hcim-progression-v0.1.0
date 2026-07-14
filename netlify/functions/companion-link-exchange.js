const { getAdmin } = require('./firebase-admin');
const { json, hashSecret, randomToken } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });

  try {
    const body = JSON.parse(event.body || '{}');
    const normalizedCode = String(body.code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (normalizedCode.length !== 8) return json(400, { error: 'Enter the 8-character link code.' });

    const admin = getAdmin();
    const db = admin.firestore();
    await enforceRateLimit(admin, db, 'companion-link-exchange:' + (event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'anonymous'), 20, 900);
    const codeRef = db.collection('companionLinkCodes').doc(hashSecret(normalizedCode));
    const token = randomToken();
    const tokenHash = hashSecret(token);
    let linked;

    await db.runTransaction(async transaction => {
      const snap = await transaction.get(codeRef);
      if (!snap.exists) throw new Error('Link code was not found.');
      const data = snap.data();
      const expiresAtMs = data.expiresAt && data.expiresAt.toMillis ? data.expiresAt.toMillis() : 0;
      if (data.used) throw new Error('This link code has already been used.');
      if (!expiresAtMs || expiresAtMs < Date.now()) throw new Error('This link code has expired.');

      const tokenRef = db.collection('companionTokens').doc(tokenHash);
      transaction.set(tokenRef, {
        uid: data.uid,
        groupId: data.groupId,
        displayName: data.displayName || 'Player',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
        revoked: false
      });
      transaction.update(codeRef, {
        used: true,
        usedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      linked = { uid: data.uid, groupId: data.groupId, displayName: data.displayName || 'Player' };
    });

    return json(200, {
      token,
      groupId: linked.groupId,
      displayName: linked.displayName
    });
  } catch (error) {
    console.error('companion-link-exchange', error);
    return json(error.statusCode || 400, { error: error.message || 'Could not link companion.' });
  }
};
