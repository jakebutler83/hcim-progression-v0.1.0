const { getAdmin } = require('./firebase-admin');
const { json, hashSecret } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

function integer(value, min, max, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`Invalid ${name}.`);
  }
  return number;
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token || token.length < 30) return json(401, { error: 'Companion is not linked.' });

    const admin = getAdmin();
    const db = admin.firestore();
    await enforceRateLimit(admin, db, 'companion-location-sync:' + (event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'anonymous'), 1800, 3600);
    const tokenRef = db.collection('companionTokens').doc(hashSecret(token));
    const tokenSnap = await tokenRef.get();
    if (!tokenSnap.exists || tokenSnap.data().revoked) {
      return json(401, { error: 'Companion link is invalid or revoked.' });
    }

    const link = tokenSnap.data();
    const groupSnap = await db.collection('groups').doc(link.groupId).get();
    if (!groupSnap.exists || !(groupSnap.data().memberUids || []).includes(link.uid)) {
      return json(403, { error: 'Linked user is no longer in this group.' });
    }

    const body = JSON.parse(event.body || '{}');
    const playerName = String(body.playerName || link.displayName || 'Player').trim().slice(0, 20);
    const world = integer(body.world, 300, 999, 'world');
    const regionId = integer(body.regionId, 0, 65535, 'region');
    const x = integer(body.x, 0, 20000, 'x coordinate');
    const y = integer(body.y, 0, 20000, 'y coordinate');
    const plane = integer(body.plane, 0, 3, 'plane');

    const locationRef = db.collection('groups').doc(link.groupId).collection('locations').doc(link.uid);
    await locationRef.set({
      uid: link.uid,
      playerName,
      world,
      regionId,
      x,
      y,
      plane,
      source: 'hcim-companion',
      online: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await tokenRef.set({
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastPlayerName: playerName
    }, { merge: true });

    return json(200, { ok: true, groupId: link.groupId });
  } catch (error) {
    console.error('companion-location-sync', error);
    return json(error.statusCode || 400, { error: error.message || 'Location sync failed.' });
  }
};
