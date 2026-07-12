const { getAdmin } = require('./firebase-admin');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return { statusCode: 500, body: 'Missing DISCORD_WEBHOOK_URL environment variable.' };

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) return { statusCode: 401, body: 'Missing authentication token.' };

    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const data = JSON.parse(event.body || '{}');
    const groupId = String(data.groupId || '');
    if (!groupId) return { statusCode: 400, body: 'Missing groupId.' };

    const groupSnap = await admin.firestore().collection('groups').doc(groupId).get();
    if (!groupSnap.exists || !(groupSnap.data().memberUids || []).includes(decoded.uid)) {
      return { statusCode: 403, body: 'You are not a member of this group.' };
    }

    const type = String(data.type || 'update').slice(0, 40);
    const title = String(data.title || 'HCIM Progression Update').slice(0, 180);
    const player = String(data.player || '').slice(0, 80);
    const progress = String(data.progress || '').slice(0, 80);
    const phase = String(data.phase || '').slice(0, 180);
    const groupName = String(groupSnap.data().name || data.groupName || 'HCIM Group').slice(0, 80);

    const emoji = type === 'group-complete' ? '🏆' : type === 'diary' ? '📔' : type === 'player-complete' ? '✅' : '📌';
    const description = [
      player ? `**Player:** ${player}` : '',
      progress ? `**Progress:** ${progress}` : '',
      phase ? `**Phase:** ${phase}` : ''
    ].filter(Boolean).join('\n');

    await admin.firestore().collection('groups').doc(groupId).collection('activity').add({
      type,
      title,
      player,
      details: progress,
      phase,
      source: 'tracker',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const payload = {
      username: 'HCIM Progression',
      avatar_url: 'https://oldschool.runescape.wiki/images/Hardcore_ironman_chat_badge.png',
      embeds: [{
        title: `${emoji} ${title}`,
        description: description || 'Progress updated.',
        color: type === 'group-complete' ? 0xf0b429 : 0x58a6ff,
        footer: { text: groupName },
        timestamp: new Date().toISOString()
      }]
    };

    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return { statusCode: res.status, body: await res.text() };
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error(err);
    return { statusCode: 400, body: err.message || 'Bad Request' };
  }
};
