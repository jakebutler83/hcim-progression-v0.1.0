const { getAdmin } = require('./firebase-admin');
const { json, hashSecret } = require('./companion-common');
const { enforceRateLimit } = require('./rate-limit');

const QUEST_IDS = {"Below Ice Mountain": "q001", "Black Knights' Fortress": "q002", "Cook's Assistant": "m019", "The Corsair Curse": "q004", "Demon Slayer": "q005", "Doric's Quest": "q006", "Dragon Slayer I": "q007", "Ernest the Chicken": "q008", "Goblin Diplomacy": "q009", "Imp Catcher": "q010", "The Knight's Sword": "q011", "Misthalin Mystery": "q012", "Pirate's Treasure": "q013", "Prince Ali Rescue": "q014", "The Restless Ghost": "q015", "Romeo & Juliet": "q016", "Rune Mysteries": "m021", "Sheep Shearer": "m020", "Shield of Arrav": "q019", "Vampyre Slayer": "q020", "Witch's Potion": "q021", "X Marks the Spot": "m022", "Animal Magnetism": "m102", "Another Slice of H.A.M.": "q024", "A Kingdom Divided": "q025", "A Night at the Theatre": "q026", "A Porcine of Interest": "q027", "A Soul's Bane": "q028", "A Tail of Two Cats": "q029", "A Taste of Hope": "q030", "At First Light": "q031", "Beneath Cursed Sands": "q032", "Between a Rock...": "q033", "Big Chompy Bird Hunting": "q034", "Biohazard": "q035", "Bone Voyage": "q036", "Cabin Fever": "q037", "Children of the Sun": "q038", "Client of Kourend": "m067", "Clock Tower": "q040", "Cold War": "q041", "Contact!": "q042", "Creature of Fenkenstrain": "q043", "Darkness of Hallowvale": "q044", "Death on the Isle": "q045", "Death Plateau": "q046", "Death to the Dorgeshuun": "q047", "Defender of Varrock": "q048", "Desert Treasure I": "q049", "Desert Treasure II - The Fallen Empire": "q050", "Devious Minds": "q051", "The Dig Site": "q052", "Dragon Slayer II": "q053", "Dream Mentor": "q054", "Druidic Ritual": "m066", "Dwarf Cannon": "q056", "Eadgar's Ruse": "q057", "Eagles' Peak": "q058", "Elemental Workshop I": "q059", "Elemental Workshop II": "q060", "Enakhra's Lament": "q061", "Enlightened Journey": "q062", "Ethically Acquired Antiquities": "q063", "The Eyes of Glouphrie": "q064", "Fairytale I - Growing Pains": "m073", "Fairytale II - Cure a Queen": "m074", "Family Crest": "q067", "The Feud": "q068", "Fight Arena": "m061", "Fishing Contest": "q070", "Forgettable Tale...": "q071", "The Fremennik Exiles": "q072", "The Fremennik Isles": "q073", "The Fremennik Trials": "q074", "The Garden of Death": "q075", "Garden of Tranquillity": "q076", "Gertrude's Cat": "q077", "Getting Ahead": "q078", "Ghosts Ahoy": "q079", "The Giant Dwarf": "q080", "The Golem": "q081", "The Grand Tree": "m084", "The Great Brain Robbery": "q083", "Grim Tales": "q084", "The Hand in the Sand": "q085", "Haunted Mine": "q086", "Hazeel Cult": "q087", "The Heart of Darkness": "q088", "Heroes' Quest": "q089", "Holy Grail": "q090", "Horror from the Deep": "q091", "Icthlarin's Little Helper": "q092", "In Aid of the Myreque": "q093", "In Search of the Myreque": "q094", "Jungle Potion": "q095", "King's Ransom": "q096", "Land of the Goblins": "q097", "Legends' Quest": "q098", "Lost City": "m072", "Lunar Diplomacy": "q100", "Making Friends with My Arm": "q101", "Making History": "q102", "Meat and Greet": "q103", "Merlin's Crystal": "q104", "Monk's Friend": "q105", "Monkey Madness I": "m088", "Monkey Madness II": "q107", "Mountain Daughter": "q108", "Mourning's End Part I": "q109", "Mourning's End Part II": "q110", "Murder Mystery": "q111", "My Arm's Big Adventure": "q112", "Nature Spirit": "q113", "Observatory Quest": "q114", "Olaf's Quest": "q115", "One Small Favour": "q116", "Perilous Moons": "q117", "Plague City": "q118", "Priest in Peril": "m071", "Rag and Bone Man I": "q120", "Rag and Bone Man II": "q121", "Ratcatchers": "q122", "Recipe for Disaster": "q123", "Recruitment Drive": "q124", "Regicide": "q125", "Roving Elves": "q126", "Royal Trouble": "q127", "Rum Deal": "q128", "Scorpion Catcher": "q129", "Sea Slug": "q130", "Secrets of the North": "q131", "Shades of Mort'ton": "q132", "Shadow of the Storm": "q133", "Sheep Herder": "q134", "Shilo Village": "q135", "The Slug Menace": "q136", "Sleeping Giants": "q137", "Sins of the Father": "q138", "Song of the Elves": "q139", "Spirits of the Elid": "q140", "Swan Song": "q141", "Tai Bwo Wannai Trio": "q142", "Tale of the Righteous": "q143", "Tears of Guthix": "q144", "Temple of Ikov": "q145", "Temple of the Eye": "q146", "The Depths of Despair": "q147", "The Final Dawn": "q148", "The Lost Tribe": "q149", "The Path of Glouphrie": "q150", "The Queen of Thieves": "q151", "The Ribbiting Tale of a Lily Pad Labour Dispute": "q152", "The Tourist Trap": "q153", "The Tower of Life": "q154", "Throne of Miscellania": "q155", "The Twilight's Promise": "q156", "Underground Pass": "m100", "Wanted!": "q158", "Watchtower": "q159", "Waterfall Quest": "m057", "What Lies Below": "q161", "While Guthix Sleeps": "q162", "Witch's House": "m059", "Zogre Flesh Eaters": "q164"};
const SKILL_RULES = [{"id": "m062", "skill": "Attack", "level": 30, "title": "Train to 30 Attack if short"}, {"id": "m063", "skill": "Strength", "level": 30, "title": "Train to 30 Strength"}, {"id": "m064", "skill": "Defence", "level": 20, "title": "Train to 20 Defence"}, {"id": "m086", "skill": "Prayer", "level": 43, "title": "Confirm 43 Prayer and food"}, {"id": "m090", "skill": "Attack", "level": 60, "title": "Train to 60 Attack"}, {"id": "m091", "skill": "Strength", "level": 60, "title": "Train to 60 Strength"}, {"id": "m092", "skill": "Defence", "level": 60, "title": "Train to 60 Defence"}, {"id": "m103", "skill": "Magic", "level": 50, "title": "Reach 50 Magic minimum"}, {"id": "m104", "skill": "Prayer", "level": 50, "title": "Reach 50 Prayer minimum"}, {"id": "p005", "skill": "Ranged", "level": 70, "title": "Reach 70 Ranged"}, {"id": "p006", "skill": "Defence", "level": 70, "title": "Reach 70 Defence"}, {"id": "p007", "skill": "Magic", "level": 70, "title": "Reach 70 Magic"}, {"id": "p008", "skill": "Prayer", "level": 70, "title": "Reach 70 Prayer long-term prep"}];

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token || token.length < 30) return json(401, { error: 'Companion is not linked.' });
    const admin = getAdmin();
    const db = admin.firestore();
    await enforceRateLimit(admin, db, 'companion-account-sync:' + hashSecret(token).slice(0, 20), 30, 3600);
    const tokenRef = db.collection('companionTokens').doc(hashSecret(token));
    const tokenSnap = await tokenRef.get();
    if (!tokenSnap.exists || tokenSnap.data().revoked) return json(401, { error: 'Companion link is invalid or revoked.' });
    const link = tokenSnap.data();
    const groupRef = db.collection('groups').doc(link.groupId);
    const groupSnap = await groupRef.get();
    if (!groupSnap.exists || !(groupSnap.data().memberUids || []).includes(link.uid)) return json(403, { error: 'Linked user is no longer in this group.' });
    const memberSnap = await groupRef.collection('members').doc(link.uid).get();
    const member = memberSnap.exists ? memberSnap.data() : {};
    const slot = String(member.slot || 'player1');
    const body = JSON.parse(event.body || '{}');
    const skills = body.skills && typeof body.skills === 'object' ? body.skills : {};
    const completedQuests = Array.isArray(body.completedQuests) ? body.completedQuests.map(String) : [];
    const progressRef = groupRef.collection('progress').doc('main');
    const snapshotRef = groupRef.collection('accountSnapshots').doc(link.uid);
    const result = await db.runTransaction(async tx => {
      const progressSnap = await tx.get(progressRef);
      const progress = progressSnap.exists ? progressSnap.data() : {};
      const done = { ...(progress.done || {}) };
      const playerDone = { ...(progress.playerDone || {}) };
      let questUpdates = 0, taskUpdates = 0;
      completedQuests.forEach(name => {
        const id = QUEST_IDS[name];
        if (!id) return;
        playerDone[id] = { ...(playerDone[id] || {}), [slot]: true };
        questUpdates++;
      });
      SKILL_RULES.forEach(rule => {
        const value = skills[rule.skill];
        const level = value && typeof value === 'object' ? Number(value.level) : Number(value);
        if (!Number.isFinite(level) || level < rule.level) return;
        playerDone[rule.id] = { ...(playerDone[rule.id] || {}), [slot]: true };
        taskUpdates++;
      });
      tx.set(progressRef, { done, playerDone, updatedAt: admin.firestore.FieldValue.serverTimestamp(), lastCompanionSyncAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      tx.set(snapshotRef, { uid: link.uid, slot, playerName: String(body.playerName || link.displayName || 'Player').slice(0,20), skills, completedQuests, questPoints: Number(body.questPoints || 0), source: 'hcim-companion', updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      tx.set(tokenRef, { lastUsedAt: admin.firestore.FieldValue.serverTimestamp(), lastAccountSyncAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return { questUpdates, taskUpdates };
    });
    await groupRef.collection('activity').add({ type:'account-sync', title:'RuneLite account synced', player:String(body.playerName || link.displayName || 'Player').slice(0,20), details:`${result.questUpdates} quests and ${result.taskUpdates} skill tasks updated`, source:'hcim-companion', createdAt:admin.firestore.FieldValue.serverTimestamp() });
    return json(200, { ok:true, slot, ...result, completedQuestCount:completedQuests.length });
  } catch (error) {
    console.error('companion-account-sync', error);
    return json(error.statusCode || 400, { error:error.message || 'Account sync failed.' });
  }
};
