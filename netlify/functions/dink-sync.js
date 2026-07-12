const { getAdmin } = require('./firebase-admin');

const questMap = {
  "below ice mountain": "q001",
  "black knights' fortress": "q002",
  "cook's assistant": "m019",
  "the corsair curse": "q004",
  "demon slayer": "q005",
  "doric's quest": "q006",
  "dragon slayer i": "q007",
  "ernest the chicken": "q008",
  "goblin diplomacy": "q009",
  "imp catcher": "q010",
  "the knight's sword": "q011",
  "misthalin mystery": "q012",
  "pirate's treasure": "q013",
  "prince ali rescue": "q014",
  "the restless ghost": "q015",
  "romeo & juliet": "q016",
  "rune mysteries": "m021",
  "sheep shearer": "m020",
  "shield of arrav": "q019",
  "vampyre slayer": "q020",
  "witch's potion": "q021",
  "x marks the spot": "m022",
  "animal magnetism": "m102",
  "another slice of h.a.m.": "q024",
  "a kingdom divided": "q025",
  "a night at the theatre": "q026",
  "a porcine of interest": "q027",
  "a soul's bane": "q028",
  "a tail of two cats": "q029",
  "a taste of hope": "q030",
  "at first light": "q031",
  "beneath cursed sands": "q032",
  "between a rock...": "q033",
  "big chompy bird hunting": "q034",
  "biohazard": "q035",
  "bone voyage": "q036",
  "cabin fever": "q037",
  "children of the sun": "q038",
  "client of kourend": "m067",
  "clock tower": "q040",
  "cold war": "q041",
  "contact!": "q042",
  "creature of fenkenstrain": "q043",
  "darkness of hallowvale": "q044",
  "death on the isle": "q045",
  "death plateau": "q046",
  "death to the dorgeshuun": "q047",
  "defender of varrock": "q048",
  "desert treasure i": "q049",
  "desert treasure ii - the fallen empire": "q050",
  "devious minds": "q051",
  "the dig site": "q052",
  "dragon slayer ii": "q053",
  "dream mentor": "q054",
  "druidic ritual": "m066",
  "dwarf cannon": "q056",
  "eadgar's ruse": "q057",
  "eagles' peak": "q058",
  "elemental workshop i": "q059",
  "elemental workshop ii": "q060",
  "enakhra's lament": "q061",
  "enlightened journey": "q062",
  "ethically acquired antiquities": "q063",
  "the eyes of glouphrie": "q064",
  "fairytale i - growing pains": "m073",
  "fairytale ii - cure a queen": "m074",
  "family crest": "q067",
  "the feud": "q068",
  "fight arena": "m061",
  "fishing contest": "q070",
  "forgettable tale...": "q071",
  "the fremennik exiles": "q072",
  "the fremennik isles": "q073",
  "the fremennik trials": "q074",
  "the garden of death": "q075",
  "garden of tranquillity": "q076",
  "gertrude's cat": "q077",
  "getting ahead": "q078",
  "ghosts ahoy": "q079",
  "the giant dwarf": "q080",
  "the golem": "q081",
  "the grand tree": "m084",
  "the great brain robbery": "q083",
  "grim tales": "q084",
  "the hand in the sand": "q085",
  "haunted mine": "q086",
  "hazeel cult": "q087",
  "the heart of darkness": "q088",
  "heroes' quest": "q089",
  "holy grail": "q090",
  "horror from the deep": "q091",
  "icthlarin's little helper": "q092",
  "in aid of the myreque": "q093",
  "in search of the myreque": "q094",
  "jungle potion": "q095",
  "king's ransom": "q096",
  "land of the goblins": "q097",
  "legends' quest": "q098",
  "lost city": "m072",
  "lunar diplomacy": "q100",
  "making friends with my arm": "q101",
  "making history": "q102",
  "meat and greet": "q103",
  "merlin's crystal": "q104",
  "monk's friend": "q105",
  "monkey madness i": "m088",
  "monkey madness ii": "q107",
  "mountain daughter": "q108",
  "mourning's end part i": "q109",
  "mourning's end part ii": "q110",
  "murder mystery": "q111",
  "my arm's big adventure": "q112",
  "nature spirit": "q113",
  "observatory quest": "q114",
  "olaf's quest": "q115",
  "one small favour": "q116",
  "perilous moons": "q117",
  "plague city": "q118",
  "priest in peril": "m071",
  "rag and bone man i": "q120",
  "rag and bone man ii": "q121",
  "ratcatchers": "q122",
  "recipe for disaster": "q123",
  "recruitment drive": "q124",
  "regicide": "q125",
  "roving elves": "q126",
  "royal trouble": "q127",
  "rum deal": "q128",
  "scorpion catcher": "q129",
  "sea slug": "q130",
  "secrets of the north": "q131",
  "shades of mort'ton": "q132",
  "shadow of the storm": "q133",
  "sheep herder": "q134",
  "shilo village": "q135",
  "the slug menace": "q136",
  "sleeping giants": "q137",
  "sins of the father": "q138",
  "song of the elves": "q139",
  "spirits of the elid": "q140",
  "swan song": "q141",
  "tai bwo wannai trio": "q142",
  "tale of the righteous": "q143",
  "tears of guthix": "q144",
  "temple of ikov": "q145",
  "temple of the eye": "q146",
  "the depths of despair": "q147",
  "the final dawn": "q148",
  "the lost tribe": "q149",
  "the path of glouphrie": "q150",
  "the queen of thieves": "q151",
  "the ribbiting tale of a lily pad labour dispute": "q152",
  "the tourist trap": "q153",
  "the tower of life": "q154",
  "throne of miscellania": "q155",
  "the twilight's promise": "q156",
  "underground pass": "m100",
  "wanted!": "q158",
  "watchtower": "q159",
  "waterfall quest": "m057",
  "what lies below": "q161",
  "while guthix sleeps": "q162",
  "witch's house": "m059",
  "zogre flesh eaters": "q164",
  "fairy tale i - growing pains": "m073",
  "fairy tale part i": "m073",
  "fairytale i": "m073",
  "fairy tale ii - cure a queen": "m074",
  "fairy tale part ii": "m074",
  "fairytale ii": "m074"
};

const diaryMap = {
  'lumbridge & draynor easy': 'diary_lum_easy',
  'lumbridge and draynor easy': 'diary_lum_easy',
  'lumbridge & draynor medium': 'diary_lum_med',
  'lumbridge and draynor medium': 'diary_lum_med',
  'ardougne easy': 'diary_ardy_easy',
  'ardougne medium': 'diary_ardy_med',
  'varrock easy': 'diary_var_easy',
  'falador easy': 'diary_fal_easy',
  'kandarin easy': 'diary_kan_easy',
  'kandarin medium': 'diary_kan_med',
  'morytania easy': 'diary_mor_easy',
  'morytania medium': 'diary_mor_med',
  'kourend & kebos easy': 'diary_kou_easy',
  'kourend and kebos easy': 'diary_kou_easy',
  'western provinces easy': 'diary_west_easy'
};

// When Dink sees these level-ups, auto-check the matching route milestone for that player.
const levelMilestones = [
  { skill: 'Firemaking', level: 15, taskId: 'm010' },
  { skill: 'Prayer', level: 5, taskId: 'm013' },
  { skill: 'Prayer', level: 10, taskId: 'm016' },
  { skill: 'Prayer', level: 20, taskId: 'm078' },
  { skill: 'Prayer', level: 31, taskId: 'm079' },
  { skill: 'Prayer', level: 43, taskId: 'm080' },
  { skill: 'Prayer', level: 43, taskId: 'm081' },
  { skill: 'Prayer', level: 50, taskId: 'm104' },
  { skill: 'Thieving', level: 5, taskId: 'm034' },
  { skill: 'Thieving', level: 10, taskId: 'm036' },
  { skill: 'Thieving', level: 15, taskId: 'm038' },
  { skill: 'Thieving', level: 20, taskId: 'm040' },
  { skill: 'Fishing', level: 15, taskId: 'm049' },
  { skill: 'Magic', level: 13, taskId: 'm069' },
  { skill: 'Magic', level: 25, taskId: 'm070' },
  { skill: 'Magic', level: 50, taskId: 'm103' },
  { skill: 'Attack', level: 30, taskId: 'm062' },
  { skill: 'Attack', level: 60, taskId: 'm090' },
  { skill: 'Strength', level: 30, taskId: 'm063' },
  { skill: 'Strength', level: 60, taskId: 'm091' },
  { skill: 'Defence', level: 20, taskId: 'm064' },
  { skill: 'Defence', level: 60, taskId: 'm092' },
  { skill: 'Agility', level: 50, taskId: 'b003' }
];

function clean(s) {
  return String(s || '').replace(/[*_`~>|#]/g, ' ').replace(/\s+/g, ' ').trim();
}

function allText(payload) {
  const parts = [];
  const walk = (x) => {
    if (!x) return;
    if (typeof x === 'string' || typeof x === 'number') parts.push(String(x));
    else if (Array.isArray(x)) x.forEach(walk);
    else if (typeof x === 'object') Object.values(x).forEach(walk);
  };
  walk(payload);
  return clean(parts.join(' '));
}

function findQuest(text) {
  const low = text.toLowerCase();
  for (const [name, taskId] of Object.entries(questMap)) {
    if (low.includes(name) && /(quest|completed|complete|finished|done)/i.test(low)) return { name, taskId };
  }
  return null;
}

function findDiary(text) {
  const low = text.toLowerCase().replace(/diary/g, '').replace(/achievement/g, '').replace(/\s+/g, ' ');
  for (const [name, diaryId] of Object.entries(diaryMap)) {
    if (low.includes(name) && /(completed|complete|finished|done)/i.test(text)) return { name, diaryId };
  }
  return null;
}

function findLevelMilestones(text) {
  const hits = [];
  for (const m of levelMilestones) {
    const skill = m.skill.replace(/ /g, '\\s+');
    const patterns = [
      new RegExp(`${skill}\\D{0,20}(?:level\\s*)?${m.level}(?!\\d)`, 'i'),
      new RegExp(`(?:level\\s*)?${m.level}(?!\\d)\\D{0,20}${skill}`, 'i')
    ];
    if (patterns.some((r) => r.test(text))) hits.push(m);
  }
  return hits;
}

function playerKey(event) {
  const p = String(event.queryStringParameters?.player || event.queryStringParameters?.p || '').toLowerCase();
  const match = p.match(/(?:player|p)?([1-5])/);
  return match ? `player${match[1]}` : '';
}

function playerLabel(key) {
  const n = Number(String(key).replace('player', '')) || 1;
  return `Player ${n}`;
}

async function verifyDinkAccess(admin, groupId, player, token) {
  if (!groupId || !player || !token) throw new Error('Missing group, player, or token.');
  const db = admin.firestore();
  const groupRef = db.collection('groups').doc(groupId);
  const groupSnap = await groupRef.get();
  if (!groupSnap.exists) throw new Error('Group not found.');
  const memberQuery = await groupRef.collection('members').where('slot', '==', player).limit(1).get();
  if (memberQuery.empty) throw new Error('Player slot is not assigned in this group.');
  const member = memberQuery.docs[0].data();
  const userSnap = await db.collection('users').doc(member.uid).get();
  if (!userSnap.exists || userSnap.data().dinkToken !== token) throw new Error('Invalid Dink token.');
  return { db, groupRef, group: groupSnap.data(), member };
}

async function patchFirestore(db, groupId, fields) {
  const ref = db.collection('groups').doc(groupId).collection('progress').doc('main');
  const snap = await ref.get();
  if (!snap.exists) await ref.set({ done: {}, playerDone: {}, diaryDone: {}, diarySteps: {} }, { merge: true });
  await ref.update(fields);
}

async function postDiscord(message) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;
  const payload = {
    username: 'HCIM Dink Sync',
    avatar_url: 'https://oldschool.runescape.wiki/images/Hardcore_ironman_chat_badge.png',
    embeds: [{ title: message.title, description: message.description, color: 0xf0b429, timestamp: new Date().toISOString() }]
  };
  await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const groupId = String(event.queryStringParameters?.group || '');
    const player = playerKey(event);
    const token = String(event.queryStringParameters?.token || '');
    const admin = getAdmin();
    const access = await verifyDinkAccess(admin, groupId, player, token);

    const payload = JSON.parse(event.body || '{}');
    const text = allText(payload);
    const updates = {};
    const notes = [];

    const quest = findQuest(text);
    if (quest) {
      updates[`playerDone.${quest.taskId}.${player}`] = true;
      notes.push(`Quest matched: ${quest.name}`);
    }

    const diary = findDiary(text);
    if (diary) {
      updates[`diaryDone.${diary.diaryId}.${player}`] = true;
      notes.push(`Diary matched: ${diary.name}`);
    }

    const levels = findLevelMilestones(text);
    for (const m of levels) {
      updates[`playerDone.${m.taskId}.${player}`] = true;
      notes.push(`${m.skill} ${m.level} matched`);
    }

    if (!Object.keys(updates).length) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, matched: false, text: text.slice(0, 500) }) };
    }

    updates.lastDinkSync = {
      player,
      notes: notes.join(', '),
      at: new Date().toISOString(),
      preview: text.slice(0, 500)
    };

    await patchFirestore(access.db, groupId, updates);
    await access.db.collection('groups').doc(groupId).collection('activity').add({
      type: quest ? 'quest' : diary ? 'diary' : levels.length ? 'level' : 'dink',
      title: notes.join(' • '),
      player: access.member.runescapeName || playerLabel(player),
      details: text.slice(0, 180),
      source: 'dink',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await postDiscord({
      title: `🔗 ${access.member.runescapeName || playerLabel(player)} auto-synced from RuneLite`,
      description: notes.map((n) => `• ${n}`).join('\n')
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, matched: true, player, notes }) };
  } catch (err) {
    console.error(err);
    const statusCode = /Invalid Dink token|not assigned|Group not found|Missing group/.test(err.message || '') ? 403 : 400;
    return { statusCode, body: err.message || 'Bad Request' };
  }
};
