const { getAdmin } = require('./firebase-admin');

const WEBHOOK_PATTERN = /^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+(?:\?.*)?$/;

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(typeof body === 'string' ? { error: body } : body)
  };
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return response(405, 'Method Not Allowed');

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) return response(401, 'Missing authentication token.');

    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const data = JSON.parse(event.body || '{}');
    const groupId = String(data.groupId || '').trim();
    if (!groupId) return response(400, 'Missing groupId.');

    const groupRef = admin.firestore().collection('groups').doc(groupId);
    const groupSnap = await groupRef.get();
    if (!groupSnap.exists || !(groupSnap.data().memberUids || []).includes(decoded.uid)) {
      return response(403, 'You are not a member of this group.');
    }

    const webhook = String(data.webhookUrl || process.env.DISCORD_WEBHOOK_URL || '').trim();
    if (!webhook) return response(400, 'No Discord webhook has been saved in this browser.');
    if (!WEBHOOK_PATTERN.test(webhook)) return response(400, 'The saved Discord webhook URL is invalid.');

    const clean = (value, max) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
    const type = clean(data.type || 'update', 40);
    const title = clean(data.title || 'HCIM Progression Update', 180);
    const player = clean(data.player, 80);
    const progress = clean(data.progress, 500);
    const phase = clean(data.phase, 180);
    const groupName = clean(groupSnap.data().name || data.groupName || 'HCIM Group', 80);

    const emoji = type === 'group-complete' ? '🏆' : type === 'diary' ? '📔' : type === 'player-complete' ? '✅' : type === 'test' ? '🔔' : '📌';
    const description = [
      type === 'test' ? 'Discord notifications are connected for this browser.' : '',
      player ? `**Player:** ${player}` : '',
      progress ? `**Progress:** ${progress}` : '',
      phase ? `**Phase:** ${phase}` : ''
    ].filter(Boolean).join('\n');

    if (type !== 'test') {
      await groupRef.collection('activity').add({
        type, title, player, details: progress, phase, source: 'tracker',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    const payload = {
      username: 'HCIM Progression',
      avatar_url: 'https://oldschool.runescape.wiki/images/Hardcore_ironman_chat_badge.png',
      allowed_mentions: { parse: [] },
      embeds: [{
        title: `${emoji} ${title}`,
        description: description || 'Progress updated.',
        color: type === 'group-complete' ? 0xf0b429 : 0x58a6ff,
        footer: { text: groupName },
        timestamp: new Date().toISOString()
      }]
    };

    const discordResponse = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const discordText = await discordResponse.text();
    if (!discordResponse.ok) {
      return response(discordResponse.status, { error: discordText || 'Discord rejected the webhook.' });
    }
    return response(200, { ok: true });
  } catch (err) {
    console.error('discord-notify error:', err);
    return response(400, err.message || 'Bad Request');
  }
};
