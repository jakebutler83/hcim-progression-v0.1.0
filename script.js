const xpByLevel=(()=>{const xp=Array(100).fill(0);let points=0;for(let level=1;level<=99;level++){if(level>1)xp[level]=Math.floor(points/4);points+=Math.floor(level+300*Math.pow(2,level/7));}return xp;})();
const methodXp={Prayer:{"Regular bones — bury":4.5,"Big bones — bury":15,"Dragon bones — bury":72,"Big bones — ectofuntus":60,"Dragon bones — ectofuntus":288},Thieving:{"Pickpocket man/woman":8,"Steal cake stall":16,"Steal silk stall":24,"Pickpocket farmer":14.5},Fishing:{"Catch shrimp":10,"Catch anchovies":40,"Catch trout":50,"Catch salmon":70,"Catch lobster":90,"Tempoross reward XP estimate":60},Cooking:{"Cook shrimp":30,"Cook anchovies":30,"Cook trout":70,"Cook salmon":90,"Cook lobster":120},Firemaking:{"Burn normal logs":40,"Burn oak logs":60,"Burn willow logs":90,"Burn maple logs":135},Magic:{"Cast Wind Strike":5.5,"Cast Fire Strike":11.5,"Cast High Alchemy":65},Agility:{"Gnome course lap":86.5,"Draynor course lap":120,"Varrock course lap":238,"Canifis course lap":240,"Agility Pyramid lap estimate":1014}};
function needed(currentLevel,targetLevel,xpEach,currentXp){currentLevel=Math.max(1,Math.min(98,Number(currentLevel)||1));targetLevel=Math.max(currentLevel+1,Math.min(99,Number(targetLevel)||currentLevel+1));const start=currentXp!==''&&!isNaN(Number(currentXp))?Number(currentXp):xpByLevel[currentLevel];const xpNeeded=Math.max(0,xpByLevel[targetLevel]-start);return{xpNeeded,count:Math.ceil(xpNeeded/xpEach),targetLevel,currentLevel,start};}
function t(id,title,desc,role='All'){return{id,title,desc,role};}
function calc(id,verb,item,skill,from,to,xpEach,role='All'){const r=needed(from,to,xpEach,'');return t(id,`${verb} ${r.count.toLocaleString()} ${item} to reach ${skill} ${to}`,`Calculated from ${skill} ${from} to ${to}: ${r.xpNeeded.toLocaleString()} XP ÷ ${xpEach} XP each = ${r.count.toLocaleString()} actions.`,role);}
const route=[{phase:'Tier 0 — Tutorial Island + safe start',tasks:[
t('m001','Finish Tutorial Island','Pick Hardcore Group Ironman when prompted. Do not leave the Node until all 3 are ready.'),t('m002','Form your 3-man HC GIM','Invite only your 2 friends, verify the group, then leave together.'),t('m003','Open Group Storage','Every player opens it once so they know where team supplies go.'),t('m004','Create group bank tabs','Make tabs: GP, Food, Runes, Quest Items, Gear, Herbs/Seeds, Random Supplies.'),t('m005','Set your death rules','No Wilderness, no AFK combat, no risky quest without food + teleport.'),t('m006','Meet at Lumbridge Castle bank','Everyone should be at the same bank before splitting tasks.'),t('m007','Bank starter junk','Deposit anything you are not using right now.'),t('m008','Withdraw bronze axe and tinderbox','Needed for basic Firemaking starter XP.'),t('m009','Chop 25 normal logs','Cut regular trees around Lumbridge.'),calc('m010','Burn','normal logs','Firemaking',1,15,40),t('m011','Kill 25 chickens','Pick up feathers and bones. Do not AFK.'),t('m012','Bank 100 feathers total','Put feathers in Group Storage.'),calc('m013','Bury','regular bones','Prayer',1,5,4.5),t('m014','Kill 20 cows','Pick up cowhides and bones.'),t('m015','Bank 50 cowhides total','Use Group Storage gear/supply tab.'),calc('m016','Bury','regular bones','Prayer',5,10,4.5),t('m017','Cook any raw food you picked up','Bank successful cooked food. Burnt food does not count.'),t('m018','Safety check before leaving Lumbridge','Each player needs food and home teleport ready.') ]},{phase:'Tier 0 — Free quests + starter GP',tasks:[
t('m019',"Complete Cook's Assistant",'Get egg, milk, flour, then turn them in at Lumbridge Castle kitchen.'),t('m020','Complete Sheep Shearer','Shear sheep, spin wool, turn in balls of wool.'),t('m021','Complete Rune Mysteries','Talk to Duke Horacio, Wizard Tower, then deliver the package.'),t('m022','Complete X Marks the Spot','Follow the clue-style beginner quest around Lumbridge/Draynor.'),t('m023','Buy/collect basic tools','Hammer, chisel, rope, spade, knife, bucket, jug, shears, fishing net.'),t('m024','Prepare for Stronghold of Security','Bring food. Do not AFK. Be ready to run.'),t('m025','Complete Stronghold floor 1','Answer security doors and claim reward.'),t('m026','Complete Stronghold floor 2','Eat food if needed and claim reward.'),t('m027','Complete Stronghold floor 3','Keep run energy for dangerous rooms.'),t('m028','Complete Stronghold floor 4','Only finish if HP/food is safe.'),t('m029','Claim 10k GP each','Pick boots too.'),t('m030','Deposit at least 15k group GP','Put starter cash into Group Storage.'),t('m031','Buy emergency supplies','Buy food, runes, teleports, and tools with group GP.') ]},{phase:'Tier 1 — Cake stall food route',tasks:[
t('m032','Walk to Ardougne market','Money player should bring food and coins. Avoid guards.', 'Money'),t('m033',"Stand at Baker's Stall",'Find a tile where you can steal and escape guards safely.','Money'),calc('m034','Steal','cakes','Thieving',1,5,16,'Money'),t('m035','Bank at least 5 cakes','Keep 5 cakes on you as emergency food.','Money'),calc('m036','Steal','cakes','Thieving',5,10,16,'Money'),t('m037','Deposit 30 cakes into Group Storage','Cakes are excellent early HCIM food.','Money'),calc('m038','Steal','cakes','Thieving',10,15,16,'Money'),t('m039','Bank 75 cakes total','Do not let teammates waste them on safe skilling.','Money'),calc('m040','Steal','cakes','Thieving',15,20,16,'Money'),t('m041','Steal 100 silk after 20 Thieving','Bank it, then sell after the cooldown.','Money'),t('m042','Sell silk for GP','Deposit all GP into Group Storage.','Money'),t('m043','Group goal: 150 cakes banked','Everyone can use these for early quests.','All') ]},{phase:'Tier 1 — Food supplier route',tasks:[
t('m044','Get small fishing net','Use Lumbridge/Draynor fishing spots.','Supplier'),t('m045','Catch 100 shrimp','Bank raw shrimp if you cannot cook yet.','Supplier'),t('m046','Cook 100 shrimp','Bank cooked shrimp.','Supplier'),t('m047','Catch 100 anchovies','Same net spots.','Supplier'),t('m048','Cook 100 anchovies','Bank all successful food.','Supplier'),calc('m049','Catch','shrimp/anchovy actions','Fishing',1,15,10,'Supplier'),t('m050','Buy fly fishing rod','Use feathers from Group Storage.','Supplier'),t('m051','Catch 100 trout','Fish at Barbarian Village or safe fly fishing spot.','Supplier'),t('m052','Cook 100 trout','Bank all cooked trout.','Supplier'),t('m053','Catch 100 salmon','Continue fly fishing.','Supplier'),t('m054','Cook 100 salmon','Bank all cooked salmon.','Supplier'),t('m055','Group goal: 300 cooked food','Hit this before dangerous quests.','All') ]},{phase:'Tier 1 — Combat quest foundation',tasks:[
t('m056','Prepare for Waterfall Quest','Bring food, rope, games necklace/teleports if available. Read a guide while doing it.','Combat'),t('m057','Complete Waterfall Quest','Avoid combat. This gives huge Attack/Strength XP.','Combat'),t('m058','Equip best scimitar available','Use steel/black/mithril as levels allow.','Combat'),t('m059',"Complete Witch's House",'Bring food and be careful. Big HP XP reward.','Combat'),t('m060','Complete Tree Gnome Village','Safe spot where possible. Unlock spirit tree access.','Combat'),t('m061','Complete Fight Arena','Be careful and safe spot. Good combat XP.','Combat'),t('m062','Train to 30 Attack if short','Use cows, monks, or safe low-level monsters.','Combat'),t('m063','Train to 30 Strength','Do safe monsters only. No AFK.','Combat'),t('m064','Train to 20 Defence','Enough to wear better early armor.','Combat'),t('m065','Bank low-level loot','Cowhides, bones, runes, herbs, arrows go to Group Storage.','Combat') ]},{phase:'Tier 2 — Travel unlocks',tasks:[
t('m066','Complete Druidic Ritual','Unlock Herblore for future potions.'),t('m067','Complete Client of Kourend','Unlock Kourend favor-related access and book teleport.'),t('m068','Work toward 25 Magic','Splash/cast safely until Varrock teleport is unlocked.'),calc('m069','Cast','Wind Strike spells','Magic',1,13,5.5),t('m070','Unlock Varrock teleport','At 25 Magic, buy/craft runes for Varrock teleport.'),t('m071','Complete Priest in Peril','Unlock Morytania. Bring food and pay attention.'),t('m072','Complete Lost City','Unlock Zanaris. Be careful with Entrana item restrictions.'),t('m073','Complete Fairy Tale Part I','Unlocks the path toward fairy rings.'),t('m074','Start Fairy Tale Part II','You only need to start it for fairy rings.'),t('m075','Unlock fairy rings','Massive travel upgrade for the group.'),t('m076','Unlock Ardougne Cloak 1','Do easy diary tasks for free monastery teleport.') ]},{phase:'Tier 2 — Prayer safety milestone',tasks:[
t('m077','Choose prayer method','Safest is burying bones. Faster methods may add risk.'),calc('m078','Bury','regular bones','Prayer',10,20,4.5),calc('m079','Bury','big bones','Prayer',20,31,15),calc('m080','Bury','big bones','Prayer',31,43,15),t('m081','Confirm every player has 43 Prayer','Do not start dangerous combat milestones until all 3 have Protect from Melee.'),t('m082','Stock 30 emergency teleports total','Varrock/Falador/Ardy tabs/runes/Chronicle cards, whatever you can access.'),t('m083','Stock 500+ edible food','Cakes/trout/salmon/lobsters. More is better.') ]},{phase:'Tier 3 — Dragon Scimitar route',tasks:[
t('m084','Complete The Grand Tree','Bring food, teleports, and follow a guide.','Combat'),t('m085','Confirm Tree Gnome Village complete','Required for Monkey Madness I.','Combat'),t('m086','Confirm 43 Prayer and food','MM1 is not a place to be lazy on HCIM.','Combat'),t('m087','Start Monkey Madness I','Read guide steps carefully before each area.','Combat'),t('m088','Complete Monkey Madness I','Use protection prayers, food, and teleports.','Combat'),t('m089','Buy Dragon Scimitar','Purchase from Ape Atoll after MM1.','Combat'),t('m090','Train to 60 Attack','Use safe monsters; do not AFK.','Combat'),t('m091','Train to 60 Strength','Sand/Ammonite crabs if unlocked, otherwise safe alternatives.','Combat'),t('m092','Train to 60 Defence','Prepare for defender and Barrows later.','Combat') ]},{phase:'Tier 3 — Defender + torso prep',tasks:[
t('m093','Collect tokens for Warriors Guild','Get Attack + Strength total to 130.','Combat'),t('m094','Farm defenders safely','Start bronze and work up. Bring food and teleport.','Combat'),t('m095','Obtain Dragon Defender','Stop immediately if supplies are low.','Combat'),t('m096','Learn Barbarian Assault basics','Watch/read roles before joining teams.','Combat'),t('m097','Get Fighter Torso','Do not grief teams; learn calls and roles.','Combat'),t('m098','Group check: D scim + defender + torso','At least combat lead should have these first.') ]},{phase:'Tier 4 — Barrows starter prep',tasks:[
t('m099','Complete Underground Pass prep','Gather food, agility levels, teleports.','Combat'),t('m100',"Obtain Iban's Staff",'Useful for Barrows and questing.','Combat'),t('m101','Upgrade Iban staff if possible','More charges = less annoying Barrows prep.','Combat'),t('m102','Complete Animal Magnetism','Unlock Ava device for ranged.','All'),t('m103','Reach 50 Magic minimum','Needed for better teleports and magic utility.','All'),t('m104','Reach 50 Prayer minimum','Safer for Barrows trips.','All'),t('m105','Bank 200 lobsters/swordfish','Before repeated Barrows attempts.','Supplier'),t('m106','Bank prayer potions when available','Herblore/farming player should start herb runs.','Supplier'),t('m107','Do first safe Barrows test run','One trip only. Learn the flow before grinding.','Combat') ]}];


// Mid-game expansion added for Rock Smokers HCIM
route.push(
  {phase:'Tier 4.5 — Mid-game combat upgrades',tasks:[
    t('m200','Warriors’ Guild ready check','Each player should have Attack + Strength total of 130, food, armour, and a teleport before starting defenders.','Combat'),
    t('m201','Enter the Warriors’ Guild','Go to Burthorpe/Taverley area and enter the Warriors’ Guild. If someone cannot enter, train Attack or Strength first.','Combat'),
    t('m202','Collect 200 Warriors’ Guild tokens','Use the armour animator or safe guild activities. Bank extra food and do not AFK cyclopes.','Combat'),
    t('m203','Kill cyclopes until Bronze defender','Stay above safe HP, teleport/restock when low, and show the defender to Kamfreena before continuing.','Combat'),
    t('m204','Kill cyclopes until Iron defender','Keep the previous defender in inventory/equipped. Show the new defender to Kamfreena.','Combat'),
    t('m205','Kill cyclopes until Steel defender','Restock tokens if low. Do not stay in the room with low food.','Combat'),
    t('m206','Kill cyclopes until Black defender','Keep checking your token timer and HP.','Combat'),
    t('m207','Kill cyclopes until Mithril defender','Show the defender to Kamfreena before moving to the next tier.','Combat'),
    t('m208','Kill cyclopes until Adamant defender','Bank duplicate defenders if you want backups.','Combat'),
    t('m209','Kill cyclopes until Rune defender','Do not lose this. You need it to access the dragon defender grind.','Combat'),
    t('m210','Move to basement cyclopes','Bring rune defender, food, armour, and teleport. This is the dragon defender area.','Combat'),
    t('m211','Obtain Dragon defender','Each player should get their own dragon defender. Leave immediately if supplies get sketchy.','Combat'),
    t('m212','Bank backup defenders','Keep rune/dragon defender backups in case someone dies or loses one later.','Combat'),
    t('m213','Complete Fremennik Trials','Unlock Neitiznot path and strong midgame helm progression. Bring food and teleports.','Combat'),
    t('m214','Complete The Fremennik Isles','Unlock Helm of Neitiznot. Do this carefully and follow a guide.','Combat'),
    t('m215','Buy/equip Helm of Neitiznot','Great midgame melee helm. Each combat player should have one.','Combat'),
    t('m216','Complete Recipe for Disaster subquests started','Begin working through RFD subquests for better gloves. Do not rush dangerous parts undergeared.','All'),
    t('m217','Unlock Adamant gloves','Good early-mid glove milestone before Barrows gloves.','All'),
    t('m218','Unlock Barrows gloves','Long-term midgame goal. Check quest and stat requirements first.','All'),
    t('m219','Complete Desert Treasure I prep','Get food, prayer, teleports, magic gear, and antipoison before boss fights.','All'),
    t('m220','Complete Desert Treasure I','Unlock Ancient Magicks. Do bosses safely and one at a time.','All'),
    t('m221','Complete Royal Trouble / Miscellania setup','Unlock kingdom income once the group has stable GP.','All'),
    t('m222','Start Managing Miscellania','Put workers on herbs/teaks/mahogany/maples depending on current group goals.','All'),
    t('m223','Unlock broad bolts','Train Slayer and buy broader fletching when available. Huge ranged upgrade later.','Combat'),
    t('m224','Get Rune crossbow safely','Use a safe method your group agrees on. Avoid Wilderness methods unless everyone accepts the HC risk.','Combat'),
    t('m225','Prepare Fire Cape gear tab','Bank ranged gear, prayer potions, food, emergency teleports, and ammo.','Combat')
  ]},
  {phase:'Optional — Minigames and activity unlocks',tasks:[
    t('o001','Tempoross: unlock and learn basic mass worlds','Bring harpoon, rope, hammer, buckets, and food only if needed. Supplier should learn this first.','Supplier'),
    t('o002','Tempoross: complete 10 kills','Goal is safe Fishing XP, food supplies, and reward permits.','Supplier'),
    t('o003','Tempoross: save 25 reward permits','Open when the group wants supplies or hold for better fish rewards later.','Supplier'),
    t('o004','Tempoross: obtain fish barrel or tackle box if lucky','Optional reward goal. Do not hard-camp if the group has more important unlocks.','Supplier'),
    t('o005','Guardians of the Rift: complete Temple of the Eye','Unlock GOTR before committing to Runecrafting training.','Supplier'),
    t('o006','Guardians of the Rift: complete 10 searches','Learn the flow and bank early runes for the group.','Supplier'),
    t('o007','Guardians of the Rift: bank 250 law/cosmic/nature runes total','Use GOTR rewards and crafted runes to build the teleport/utility rune tab.','Supplier'),
    t('o008','Guardians of the Rift: buy first Raiments piece','Optional long-term Runecrafting outfit goal.','Supplier'),
    t('o009','Wintertodt: safe prep check','Only do this if HP/food setup is safe. Bring warm clothing and enough food.','Supplier'),
    t('o010','Wintertodt: complete 10 kills','Good early supplies, Firemaking XP, seeds, herbs, and logs.','Supplier'),
    t('o011','Wintertodt: bank crates or open for supplies','Decide as a group whether to open now or save for later skilling levels.','Supplier'),
    t('o012','Giants’ Foundry: complete Sleeping Giants','Unlock the Smithing minigame and learn sword hand-ins.','Money'),
    t('o013','Giants’ Foundry: complete 10 swords','Good Ironman Smithing XP and GP. Use bars/items the group can spare.','Money'),
    t('o014','Giants’ Foundry: buy useful mould upgrades','Prioritize moulds before cosmetic rewards.','Money'),
    t('o015','Tithe Farm: unlock and complete 20 points','Start when Farming level allows it. Use this for controlled Farming XP.','Supplier'),
    t('o016','Tithe Farm: buy seed box or herb sack goal','Choose based on Slayer/herb run needs.','Supplier'),
    t('o017','Mage Training Arena: complete Bones to Peaches grind','Useful for later PvM sustain. This is optional but very strong long-term.','All'),
    t('o018','Mage Training Arena: buy Infinity boots or Master wand if desired','Optional magic gear route. Only grind if the group agrees.','All'),
    t('o019','Pest Control: unlock novice boat','Requires enough combat level. Void is a strong long-term ranged/magic/melee set.','Combat'),
    t('o020','Pest Control: earn first 100 points','Learn games and save points toward Void pieces.','Combat'),
    t('o021','Pest Control: complete full Void set','Optional but strong for ranged/magic setups.','Combat'),
    t('o022','Barbarian Assault: finish Fighter Torso for all players','If not already done, make torso a group milestone instead of one-person-only.','Combat'),
    t('o023','Barbarian Assault: optional level 5 roles','Long-term diary/efficiency goal. Do not rush if your team hates BA.','Combat'),
    t('o024','Motherlode Mine: unlock and complete 100 pay-dirt','Good chill Mining route for ores and Prospector pieces.','Supplier'),
    t('o025','Motherlode Mine: buy first Prospector piece','Useful for diary/Mining progression later.','Supplier'),
    t('o026','Motherlode Mine: buy coal bag','Very useful for Blast Furnace and Smithing.','Supplier'),
    t('o027','Mahogany Homes: complete 10 contracts','Construction XP with less plank waste. Start when plank supply is stable.','Money'),
    t('o028','Mahogany Homes: buy plank sack','Great quality-of-life reward for Construction training.','Money'),
    t('o029','Blast Furnace: unlock Ice gloves or bucket method','Prepare for efficient bars. Make sure GP and coal/ore supply are ready.','Money'),
    t('o030','Blast Furnace: smith 500 steel/mithril bars','Use this for darts, bolts, alchs, and Smithing progression.','Money'),
    t('o031','Shades of Mort’ton: complete basic setup','Optional Prayer/Firemaking/activity route. Bring supplies and understand the minigame.','All'),
    t('o032','Pyramid Plunder: learn safe runs','Optional Thieving route. Bring antipoison/food and leave if low.','Money'),
    t('o033','Hallowed Sepulchre: unlock after Sins of the Father','Later Agility activity. Only add to active goals once the quest is complete.','All'),
    t('o034','Soul Wars / LMS warning','PvP minigames are optional and risky for HC mindset. Do not route them unless the group explicitly agrees.','All')
  ]},
  {phase:'Optional — Midgame boss readiness',tasks:[
    t('p001','Barrows readiness check','Each player: 43+ Prayer, Iban’s staff or better, teleport out, food, and prayer restore plan.','Combat'),
    t('p002','Complete 5 Barrows runs as a group test','Learn routes, tunnel safety, and supply usage before camping.','Combat'),
    t('p003','Complete 25 Barrows runs total','Start building tank legs/body, runes, and bolt racks if useful.','Combat'),
    t('p004','Unlock Slayer helm route','Get black mask, craft Slayer helm when points/quests allow, and imbue later.','Combat'),
    t('p005','Reach 70 Ranged','Prep for Fire Cape, quest bosses, and safer PvM.','Combat'),
    t('p006','Reach 70 Defence','Useful for Barrows tank gear and harder quest bosses.','Combat'),
    t('p007','Reach 70 Magic','Useful for teleports, Barrows, bursting later, and quest progression.','All'),
    t('p008','Reach 70 Prayer long-term prep','Work toward Piety/Rigour/Augury paths later, but do not force risky bone methods.','All')
  ]}
);

const teamRoute=[{phase:'Jake / Player 1 — Combat Captain',tasks:[t('c001','Lead dangerous quest calls','Before risky quests, ask: food, teleport, prayer, guide open?','Combat'),t('c002','Rush D scimitar path','Waterfall → Witch’s House → Gnome quests → MM1.','Combat'),t('c003','Maintain best tank gear','Use rune/dragon/barrows upgrades when unlocked.','Combat'),t('c004','Lead defender grind','Get dragon defender first, then help others.','Combat'),t('c005','Lead first Barrows test','Only do this after the group has supplies.','Combat')]},{phase:'Player 2 — Money Maker',tasks:[t('b001','Own cake stall grind','Keep food bank full early.','Money'),t('b002','Push 50 Agility','Unlock Agility Pyramid money.','Money'),calc('b003','Complete','Draynor/Varrock/Canifis agility laps','Agility',1,50,180,'Money'),t('b004','Run Agility Pyramid 10 times','Deposit all GP.','Money'),t('b005','Run Agility Pyramid until 500k group GP','This funds runes, kingdom later, and gear.','Money')]},{phase:'Player 3 — Supplier',tasks:[t('s001','Own food bank','Keep cooked food stocked before quests.','Supplier'),t('s002','Start farming early','Seeds/herbs matter later.','Supplier'),t('s003','Do birdhouse runs when unlocked','Passive nests/seeds.','Supplier'),t('s004','Train Runecrafting/GOTR','Supply laws, natures, cosmics when possible.','Supplier'),t('s005','Track potion supplies','Prayer potions, energy, antipoison, and later super sets.','Supplier')]}];
const storageRoute=[{phase:'Food tab goals',tasks:[t('g001','Bank 150 cakes','Starter quest food.','Group'),t('g002','Bank 300 trout/salmon','General training food.','Group'),t('g003','Bank 500 lobsters/swordfish','Before Barrows/quest chains.','Group'),t('g004','Bank 50 emergency high-heal food','Save for dangerous quests only.','Group')]},{phase:'Rune + teleport goals',tasks:[t('g005','Bank 500 elemental runes','Air/water/earth/fire basics.','Group'),t('g006','Bank 250 law runes','Teleports for everyone.','Group'),t('g007','Bank 250 nature runes','High alchemy and utility.','Group'),t('g008','Bank 30 emergency teleports','Tablets/runes/Chronicle/etc.','Group')]},{phase:'Money goals',tasks:[t('g009','Group GP: 100k','Starter supplies.','Group'),t('g010','Group GP: 250k','Early runes and gear.','Group'),t('g011','Group GP: 500k','Comfortable midgame setup.','Group'),t('g012','Group GP: 1M','Kingdom/gear/runes buffer.','Group')]}];

const osrsIconFiles={Prayer:'Prayer icon.png',Thieving:'Thieving icon.png',Fishing:'Fishing icon.png',Cooking:'Cooking icon.png',Firemaking:'Firemaking icon.png',Magic:'Magic icon.png',Agility:'Agility icon.png',Attack:'Attack icon.png',Strength:'Strength icon.png',Defence:'Defence icon.png',Hitpoints:'Hitpoints icon.png',Ranged:'Ranged icon.png',Runecrafting:'Runecraft icon.png',Herblore:'Herblore icon.png',Farming:'Farming icon.png',Woodcutting:'Woodcutting icon.png',Combat:'Combat icon.png',Quest:'Quest point icon.png',Food:'Cake.png',Money:'Coins 10000.png',Travel:'Fairy ring.png',Storage:'Bank icon.png',Diary:'Achievement Diary icon.png',Safety:'Hardcore ironman chat badge.png',Logs:'Logs.png',Bones:'Bones.png',Scimitar:'Dragon scimitar.png',Defender:'Dragon defender.png',Torso:'Fighter torso.png',Barrows:'Barrows chest.png'};
const emojiFallback={Prayer:'🙏',Thieving:'🧤',Fishing:'🎣',Cooking:'🍳',Firemaking:'🔥',Magic:'✨',Agility:'🏃',Attack:'⚔️',Strength:'💪',Defence:'🛡️',Hitpoints:'❤️',Ranged:'🏹',Runecrafting:'ᚱ',Herblore:'🧪',Farming:'🌿',Woodcutting:'🪓',Combat:'⚔️',Quest:'📜',Food:'🍰',Money:'🪙',Travel:'🧭',Storage:'🎒',Diary:'🏅',Safety:'☠️',Logs:'🪵',Bones:'🦴',Scimitar:'🗡️',Defender:'🛡️',Torso:'🥋',Barrows:'⚰️'};
function wikiFileUrl(file){return 'https://oldschool.runescape.wiki/w/Special:FilePath/'+encodeURIComponent(file);}
function osrsIcon(key,label){const file=osrsIconFiles[key];const fallback=emojiFallback[key]||'✦';if(!file)return fallback;return `<img class="osrs-icon" src="${wikiFileUrl(file)}" alt="${label||key}" title="${label||key}" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(document.createTextNode('${fallback}'))">`;}
const skillIconMap={};Object.keys(osrsIconFiles).forEach(k=>skillIconMap[k]=osrsIcon(k,k));
function wikiTitle(text){return String(text||'Old School RuneScape').replace(/[“”]/g,'').replace(/'/g,'%27').replace(/\s+/g,'_');}
function wikiUrl(text){return 'https://oldschool.runescape.wiki/w/'+wikiTitle(text);}
function wikiSearchUrl(text){return 'https://oldschool.runescape.wiki/?search='+encodeURIComponent(text||'Old School RuneScape');}
function inferIcon(task){const txt=((task.title||'')+' '+(task.desc||'')+' '+(task.phase||'')).toLowerCase();
  if(/quest|complete|fairy|monkey|waterfall|witch|gnome|arena|priest|lost city|druidic|kourend|animal magnetism|iban/.test(txt))return skillIconMap.Quest;
  if(/bury|prayer|bones/.test(txt))return skillIconMap.Prayer;
  if(/steal|thiev|silk|cake/.test(txt))return skillIconMap.Thieving;
  if(/fish|catch|shrimp|anchovies|trout|salmon|lobster|tempoross/.test(txt))return skillIconMap.Fishing;
  if(/cook|raw/.test(txt))return skillIconMap.Cooking;
  if(/guardians|gotr|runecraft|runecrafting|raiments/.test(txt))return skillIconMap.Runecrafting;
  if(/burn|firemaking|logs/.test(txt))return skillIconMap.Firemaking;
  if(/chop|tree|woodcut/.test(txt))return skillIconMap.Woodcutting;
  if(/cast|magic|teleport|runes|mage training|bones to peaches|mta/.test(txt))return skillIconMap.Magic;
  if(/agility|lap|pyramid|sepulchre/.test(txt))return skillIconMap.Agility;
  if(/kill|attack|strength|defence|combat|scimitar|defender|torso|barrows|warriors|cyclopes|void|pest control|slayer|boss/.test(txt))return skillIconMap.Combat;
  if(/bank|storage|deposit|group goal|stock/.test(txt))return skillIconMap.Storage;
  if(/gp|money|sell|cash|foundry|blast furnace|mahogany homes|pyramid plunder/.test(txt))return skillIconMap.Money;
  if(/food|cake|eat/.test(txt))return skillIconMap.Food;
  return '✦';
}
function questDifficulty(q){const txt=((q.tier||'')+' '+(q.name||'')).toLowerCase();if(/starter/.test(txt))return 'novice';if(/travel|skilling|unlock/.test(txt))return 'intermediate';if(/dragon|weapon|gear|combat rush/.test(txt))return 'experienced';if(/barrows|pvm|monkey|iban/.test(txt))return 'master';return 'intermediate';}
function questWikiName(name){return String(name||'').replace('Fairy Tale I','Fairytale I - Growing Pains').replace('Fairy Tale II Start','Fairytale II - Cure a Queen').replace('Fairy Rings Unlocked','Fairy ring').replace('Dragon Scimitar Bought','Dragon scimitar').replace('Dragon Defender','Dragon defender').replace('Fighter Torso','Fighter torso').replace('First Barrows Test Run','Barrows');}

let state={done:{},playerDone:{},diaryDone:{},diarySteps:{},players:{groupName:'',player1:'',player2:'',player3:''}};let db=null,docRef=null,remoteReady=false,saving=false;
const playerKeys=['player1','player2','player3'];
const personalTaskIds=new Set([
  // Everyone-specific setup/actions
  'm001','m003','m008','m009','m010','m011','m013','m014','m016','m017','m018',
  // Everyone-specific starter quests / Stronghold
  'm019','m020','m021','m022','m024','m025','m026','m027','m028','m029',
  // Everyone-specific travel/skilling milestones
  'm066','m067','m068','m069','m070','m071','m072','m073','m074','m075','m076',
  // Everyone-specific prayer/safety milestones
  'm078','m079','m080','m081',
  // Combat/quest unlocks that each player may need separately
  'm057','m059','m060','m061','m084','m088','m089','m090','m091','m092','m095','m097','m100','m102','m103','m104','m107'
]);
function allTasks(){return [...route,...teamRoute,...storageRoute].flatMap(p=>p.tasks.map(x=>({...x,phase:p.phase})))}

async function sendDiscordUpdate(payload){
  const body={
    groupName:(state.players&&state.players.groupName)||'HCIM Group',
    ...payload
  };
  try{
    const res=await fetch('/.netlify/functions/discord-notify',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const text=await res.text().catch(()=>'');
    if(!res.ok){
      console.warn('Discord notify failed:', res.status, text);
      return {ok:false,status:res.status,text};
    }
    return {ok:true,status:res.status,text};
  }catch(e){
    console.warn('Discord notify error:', e);
    return {ok:false,status:0,text:e.message||String(e)};
  }
}
function notifyTaskComplete(task,extra={}){
  if(!task)return;
  sendDiscordUpdate({
    type: extra.type || 'task-complete',
    title: extra.title || `${extra.player?extra.player+' completed ':''}${task.title}`,
    player: extra.player || '',
    progress: extra.progress || '',
    phase: task.phase || extra.phase || '',
  });
}


async function testDiscord(){
  const status=document.getElementById('discordTestStatus');
  if(status) status.textContent='Sending test...';
  const result=await sendDiscordUpdate({
    type:'test',
    title:'Discord test from HCIM Tracker',
    player:'System',
    progress:'If you see this, Discord is connected.',
    phase:'Setup Test'
  });
  if(status) status.textContent=result&&result.ok?'Sent ✅':'Failed ❌ — check Netlify Functions/Env variable';
}

function initFirebase(){const c=window.HCIM_FIREBASE_CONFIG||{};const groupId=window.HCIM_ACTIVE_GROUP_ID;if(!c.apiKey||String(c.apiKey).includes('PASTE')||!window.HCIM_CURRENT_USER||!groupId)return false;try{if(!firebase.apps.length)firebase.initializeApp(c);db=firebase.firestore();docRef=db.collection('groups').doc(groupId).collection('progress').doc('main');docRef.onSnapshot(s=>{if(s.exists){state={...state,...s.data(),done:{...(s.data().done||{})},playerDone:{...(s.data().playerDone||{})},diaryDone:{...(s.data().diaryDone||{})},diarySteps:{...(s.data().diarySteps||{})},players:{...(state.players||{}),...(s.data().players||{})}};normalizeState();renderAll();}else saveState();});remoteReady=true;return true;}catch(e){console.warn(e);return false;}}
function loadLocal(){try{const raw=localStorage.getItem('hcimV2State');if(raw)state={...state,...JSON.parse(raw)};normalizeState();}catch(e){}}
function saveState(){if(saving)return;saving=true;localStorage.setItem('hcimV2State',JSON.stringify(state));if(remoteReady&&docRef)docRef.set(state,{merge:true}).catch(console.warn).finally(()=>saving=false);else saving=false;updateSync();}
function updateSync(){const el=document.getElementById('syncStatus'),details=document.getElementById('syncDetails');if(remoteReady){el.textContent='Live Firebase sync ON';el.className='sync-status live';if(details)details.textContent='Firebase is connected. Checkmarks, names, and progress should sync for everyone using this same site.';}else{el.textContent='Local save mode';el.className='sync-status local';if(details)details.textContent='Firebase is not connected yet. The tracker saves in this browser only until you paste your Firebase config into firebase-config.js.';}}
function roleName(role){const p=state.players||{};if(role==='Combat')return p.player1||'Player 1 / Combat';if(role==='Money')return p.player2||'Player 2 / Money';if(role==='Supplier')return p.player3||'Player 3 / Supplier';if(role==='Group')return p.groupName||'Group Goal';return 'All Players'}
function playerLabel(key){const p=state.players||{};if(key==='player1')return p.player1||'P1';if(key==='player2')return p.player2||'P2';if(key==='player3')return p.player3||'P3';return key;}
function isPersonalTask(task){return personalTaskIds.has(task.id);}
function normalizeState(){state.done=state.done||{};state.playerDone=state.playerDone||{};state.diaryDone=state.diaryDone||{};state.diarySteps=state.diarySteps||{};state.players=state.players||{groupName:'',player1:'',player2:'',player3:''};allTasks().forEach(task=>{if(isPersonalTask(task)&&state.done[task.id]&&!state.playerDone[task.id]){state.playerDone[task.id]={player1:true,player2:true,player3:true};}});}
function personalCount(id){const d=(state.playerDone||{})[id]||{};return playerKeys.filter(k=>!!d[k]).length;}
function taskDone(task){if(isPersonalTask(task))return personalCount(task.id)===3;return !!state.done[task.id];}
function setPersonalDone(id,key,value){state.playerDone=state.playerDone||{};state.playerDone[id]=state.playerDone[id]||{};state.playerDone[id][key]=value;state.done[id]=personalCount(id)===3;}
function setTaskDone(task,value){if(isPersonalTask(task)){playerKeys.forEach(k=>setPersonalDone(task.id,k,value));}else{state.done[task.id]=value;}}
function taskWikiTarget(task){
  const title=String(task.title||'').replace(/^Complete\s+/,'').replace(/^Start\s+/,'').replace(/^Unlock\s+/,'').replace(/^Buy\s+/,'').replace(/^Obtain\s+/,'');
  if(/Waterfall Quest/i.test(task.title))return 'Waterfall Quest';
  if(/Witch/i.test(task.title))return "Witch's House";
  if(/Tree Gnome Village/i.test(task.title))return 'Tree Gnome Village';
  if(/Fight Arena/i.test(task.title))return 'Fight Arena';
  if(/Druidic Ritual/i.test(task.title))return 'Druidic Ritual';
  if(/Client of Kourend/i.test(task.title))return 'Client of Kourend';
  if(/Priest in Peril/i.test(task.title))return 'Priest in Peril';
  if(/Lost City/i.test(task.title))return 'Lost City';
  if(/Fairy Tale Part I/i.test(task.title))return 'Fairytale I - Growing Pains';
  if(/Fairy Tale Part II/i.test(task.title))return 'Fairytale II - Cure a Queen';
  if(/fairy rings/i.test(task.title))return 'Fairy ring';
  if(/Grand Tree/i.test(task.title))return 'The Grand Tree';
  if(/Monkey Madness I/i.test(task.title))return 'Monkey Madness I';
  if(/Dragon Scimitar/i.test(task.title))return 'Dragon scimitar';
  if(/Dragon Defender/i.test(task.title))return 'Dragon defender';
  if(/Fighter Torso/i.test(task.title))return 'Fighter torso';
  if(/Barrows/i.test(task.title))return 'Barrows';
  if(/Agility Pyramid/i.test(task.title))return 'Agility Pyramid';
  if(/cake|Baker/i.test(task.title))return 'Cake stall';
  if(/silk/i.test(task.title))return 'Silk stall';
  if(/bury|bones/i.test(task.title))return 'Prayer training';
  if(/fish|shrimp|trout|salmon|lobster|anchov/i.test(task.title))return 'Fishing training';
  if(/cook/i.test(task.title))return 'Cooking training';
  if(/logs|chop|burn|Firemaking/i.test(task.title))return 'Firemaking training';
  return title;
}
function wikiButton(label){return `<a class="wiki-link" href="${wikiUrl(label)}" target="_blank" rel="noopener">Wiki</a>`;}
function renderRoute(containerId,phases){const box=document.getElementById(containerId);box.innerHTML='';const filter=document.getElementById('phaseFilter')?.value||'all';phases.forEach(phase=>{if(containerId==='mainTasks'&&filter!=='all'&&phase.phase!==filter)return;const doneCount=phase.tasks.filter(x=>taskDone(x)).length;const wrap=document.createElement('div');wrap.className='phase';wrap.innerHTML=`<div class="phase-header"><h3>${phase.phase}</h3><span class="phase-count">${doneCount}/${phase.tasks.length}</span></div><div class="tasks"></div>`;const tasks=wrap.querySelector('.tasks');phase.tasks.forEach(task=>{task.phase=task.phase||phase.phase;const complete=taskDone(task);const row=document.createElement('div');row.className='task '+(complete?'done ':'')+(isPersonalTask(task)?' personal-task':'');row.id='task-'+task.id;const icon=`<span class="task-icon" title="${task.role}">${inferIcon(task)}</span>`;const wiki=wikiButton(taskWikiTarget(task));if(isPersonalTask(task)){const count=personalCount(task.id);row.innerHTML=`<div class="task-main-check">${complete?'✓':'◯'}</div>${icon}<div class="task-content"><div class="task-title-row"><div class="task-title">${task.title}</div>${wiki}</div><div class="task-desc">${task.desc}</div><div class="player-progress"><div class="segments"><span class="seg ${count>=1?'on':''}"></span><span class="seg ${count>=2?'on':''}"></span><span class="seg ${count>=3?'on':''}"></span></div><span class="progress-label">${count}/3 players done</span></div><div class="player-toggles"></div></div><span class="tag ${task.role}">${roleName(task.role)}</span>`;const toggles=row.querySelector('.player-toggles');playerKeys.forEach(k=>{const btn=document.createElement('button');btn.type='button';btn.className='player-pill '+(((state.playerDone||{})[task.id]||{})[k]?'checked':'');btn.textContent=(((state.playerDone||{})[task.id]||{})[k]?'✓ ':'')+playerLabel(k);btn.addEventListener('click',()=>{const current=!!(((state.playerDone||{})[task.id]||{})[k]);const nextVal=!current;setPersonalDone(task.id,k,nextVal);if(nextVal){const count=personalCount(task.id);notifyTaskComplete(task,{type:count===3?'group-complete':'player-complete',player:playerLabel(k),progress:`${count}/3 players done`,title:count===3?`Group completed ${task.title}`:`${playerLabel(k)} completed ${task.title}`});}saveState();renderAll();});toggles.appendChild(btn);});}else{row.innerHTML=`<input type="checkbox" ${complete?'checked':''}/>${icon}<div><div class="task-title-row"><div class="task-title">${task.title}</div>${wiki}</div><div class="task-desc">${task.desc}</div></div><span class="tag ${task.role}">${roleName(task.role)}</span>`;row.querySelector('input').addEventListener('change',e=>{setTaskDone(task,e.target.checked);if(e.target.checked)notifyTaskComplete(task,{type:'group-complete',title:`Completed ${task.title}`});saveState();renderAll();});}tasks.appendChild(row);});box.appendChild(wrap);});}
function renderDashboard(){const tasks=allTasks();const done=tasks.filter(x=>taskDone(x)).length;const partial=tasks.filter(x=>isPersonalTask(x)&&!taskDone(x)&&personalCount(x.id)>0).length;const pct=tasks.length?Math.round(done/tasks.length*100):0;document.getElementById('progressBar').style.width=pct+'%';document.getElementById('progressText').textContent=`${pct}% complete — ${done}/${tasks.length} tasks${partial?` • ${partial} partially done`:''}`;const next=tasks.find(x=>!taskDone(x));document.getElementById('nextStep').innerHTML=next?`<strong>${next.title}</strong><br><span>${next.desc}</span><br><small>${next.phase} • ${roleName(next.role)}${isPersonalTask(next)?` • ${personalCount(next.id)}/3 players done`:''}</small>`:'Everything in v2 is complete.';document.getElementById('milestoneText').textContent=next?next.phase:'All current milestones complete';document.getElementById('dangerText').textContent=next&&['Combat','All'].includes(next.role)?'Double-check food, teleports, and prayer before risky steps.':'This is mostly supply/account progression.';}
function populateFilter(){const sel=document.getElementById('phaseFilter');if(sel.options.length>1)return;route.forEach(p=>{const o=document.createElement('option');o.value=p.phase;o.textContent=p.phase;sel.appendChild(o);});}
function renderPlayers(){['groupName','player1','player2','player3'].forEach(id=>{const el=document.getElementById(id);if(document.activeElement!==el)el.value=(state.players||{})[id]||'';});}
function renderCalc(){const skill=document.getElementById('calcSkill'),method=document.getElementById('calcMethod');if(!skill.options.length){Object.keys(methodXp).forEach(s=>skill.add(new Option(s,s)));}const methods=methodXp[skill.value]||methodXp.Prayer;const old=method.value;method.innerHTML='';Object.keys(methods).forEach(m=>method.add(new Option(m,m)));if(old&&methods[old])method.value=old;const current=document.getElementById('calcCurrent').value,target=document.getElementById('calcTarget').value,currentXp=document.getElementById('calcCurrentXp').value;const xpEach=methods[method.value];const r=needed(current,target,xpEach,currentXp);document.getElementById('calcResult').innerHTML=`<strong>${r.count.toLocaleString()} actions needed</strong><br>${r.xpNeeded.toLocaleString()} XP needed to reach level ${r.targetLevel}.<br>${method.value} gives ${xpEach} XP each.`;}

const questData=[
  {
    "name": "Below Ice Mountain",
    "id": "q001",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Black Knights' Fortress",
    "id": "q002",
    "tier": "F2P",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Cook's Assistant",
    "id": "m019",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Corsair Curse",
    "id": "q004",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Demon Slayer",
    "id": "q005",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Doric's Quest",
    "id": "q006",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Dragon Slayer I",
    "id": "q007",
    "tier": "F2P",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Rune platebody and green d'hide body access."
  },
  {
    "name": "Ernest the Chicken",
    "id": "q008",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Goblin Diplomacy",
    "id": "q009",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Imp Catcher",
    "id": "q010",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Knight's Sword",
    "id": "q011",
    "tier": "F2P",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Massive early Smithing XP."
  },
  {
    "name": "Misthalin Mystery",
    "id": "q012",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Pirate's Treasure",
    "id": "q013",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Prince Ali Rescue",
    "id": "q014",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Restless Ghost",
    "id": "q015",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Romeo & Juliet",
    "id": "q016",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Rune Mysteries",
    "id": "m021",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Sheep Shearer",
    "id": "m020",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Shield of Arrav",
    "id": "q019",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Vampyre Slayer",
    "id": "q020",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Witch's Potion",
    "id": "q021",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "X Marks the Spot",
    "id": "m022",
    "tier": "F2P",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Animal Magnetism",
    "id": "m102",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Ava device for Ranged."
  },
  {
    "name": "Another Slice of H.A.M.",
    "id": "q024",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "A Kingdom Divided",
    "id": "q025",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Kourend spellbook upgrades."
  },
  {
    "name": "A Night at the Theatre",
    "id": "q026",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Theatre of Blood story completion."
  },
  {
    "name": "A Porcine of Interest",
    "id": "q027",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "A Soul's Bane",
    "id": "q028",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "A Tail of Two Cats",
    "id": "q029",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "A Taste of Hope",
    "id": "q030",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "At First Light",
    "id": "q031",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Beneath Cursed Sands",
    "id": "q032",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Tombs of Amascut access."
  },
  {
    "name": "Between a Rock...",
    "id": "q033",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Big Chompy Bird Hunting",
    "id": "q034",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Biohazard",
    "id": "q035",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Bone Voyage",
    "id": "q036",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Fossil Island access."
  },
  {
    "name": "Cabin Fever",
    "id": "q037",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Children of the Sun",
    "id": "q038",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Client of Kourend",
    "id": "m067",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Clock Tower",
    "id": "q040",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Cold War",
    "id": "q041",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Contact!",
    "id": "q042",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Creature of Fenkenstrain",
    "id": "q043",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Darkness of Hallowvale",
    "id": "q044",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Death on the Isle",
    "id": "q045",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Death Plateau",
    "id": "q046",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Death to the Dorgeshuun",
    "id": "q047",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Defender of Varrock",
    "id": "q048",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Desert Treasure I",
    "id": "q049",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Ancient Magicks unlock."
  },
  {
    "name": "Desert Treasure II - The Fallen Empire",
    "id": "q050",
    "tier": "Grandmaster",
    "difficulty": "Grandmaster",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "High-level boss quest line and Ancient Sceptre upgrades."
  },
  {
    "name": "Devious Minds",
    "id": "q051",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Dig Site",
    "id": "q052",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Dragon Slayer II",
    "id": "q053",
    "tier": "Grandmaster",
    "difficulty": "Grandmaster",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Vorkath and Myth's Guild unlock."
  },
  {
    "name": "Dream Mentor",
    "id": "q054",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Druidic Ritual",
    "id": "m066",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Unlocks Herblore."
  },
  {
    "name": "Dwarf Cannon",
    "id": "q056",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Eadgar's Ruse",
    "id": "q057",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Eagles' Peak",
    "id": "q058",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Elemental Workshop I",
    "id": "q059",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Elemental Workshop II",
    "id": "q060",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Enakhra's Lament",
    "id": "q061",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Enlightened Journey",
    "id": "q062",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Ethically Acquired Antiquities",
    "id": "q063",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Eyes of Glouphrie",
    "id": "q064",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Fairytale I - Growing Pains",
    "id": "m073",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Starts Fairy Ring unlock chain."
  },
  {
    "name": "Fairytale II - Cure a Queen",
    "id": "m074",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Fairy ring access path."
  },
  {
    "name": "Family Crest",
    "id": "q067",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Feud",
    "id": "q068",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Fight Arena",
    "id": "m061",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Fishing Contest",
    "id": "q070",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Forgettable Tale...",
    "id": "q071",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Fremennik Exiles",
    "id": "q072",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Fremennik Isles",
    "id": "q073",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Fremennik Trials",
    "id": "q074",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Garden of Death",
    "id": "q075",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Garden of Tranquillity",
    "id": "q076",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Gertrude's Cat",
    "id": "q077",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Getting Ahead",
    "id": "q078",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Ghosts Ahoy",
    "id": "q079",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Giant Dwarf",
    "id": "q080",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Golem",
    "id": "q081",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Grand Tree",
    "id": "m084",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "MM1 requirement and big combat XP."
  },
  {
    "name": "The Great Brain Robbery",
    "id": "q083",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Grim Tales",
    "id": "q084",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Hand in the Sand",
    "id": "q085",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Haunted Mine",
    "id": "q086",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Hazeel Cult",
    "id": "q087",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Heart of Darkness",
    "id": "q088",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Heroes' Quest",
    "id": "q089",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Holy Grail",
    "id": "q090",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Horror from the Deep",
    "id": "q091",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Icthlarin's Little Helper",
    "id": "q092",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "In Aid of the Myreque",
    "id": "q093",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "In Search of the Myreque",
    "id": "q094",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Jungle Potion",
    "id": "q095",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "King's Ransom",
    "id": "q096",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Land of the Goblins",
    "id": "q097",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Legends' Quest",
    "id": "q098",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Lost City",
    "id": "m072",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Unlocks Zanaris."
  },
  {
    "name": "Lunar Diplomacy",
    "id": "q100",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Making Friends with My Arm",
    "id": "q101",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Making History",
    "id": "q102",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Meat and Greet",
    "id": "q103",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Merlin's Crystal",
    "id": "q104",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Monk's Friend",
    "id": "q105",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Monkey Madness I",
    "id": "m088",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Dragon scimitar access."
  },
  {
    "name": "Monkey Madness II",
    "id": "q107",
    "tier": "Grandmaster",
    "difficulty": "Grandmaster",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Demonic gorillas and heavy ballista path."
  },
  {
    "name": "Mountain Daughter",
    "id": "q108",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Mourning's End Part I",
    "id": "q109",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Mourning's End Part II",
    "id": "q110",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Murder Mystery",
    "id": "q111",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "My Arm's Big Adventure",
    "id": "q112",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Nature Spirit",
    "id": "q113",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Observatory Quest",
    "id": "q114",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Olaf's Quest",
    "id": "q115",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "One Small Favour",
    "id": "q116",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Perilous Moons",
    "id": "q117",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Plague City",
    "id": "q118",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Priest in Peril",
    "id": "m071",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Unlocks Morytania."
  },
  {
    "name": "Rag and Bone Man I",
    "id": "q120",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Rag and Bone Man II",
    "id": "q121",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Ratcatchers",
    "id": "q122",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Recipe for Disaster",
    "id": "q123",
    "tier": "Special",
    "difficulty": "Special",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Barrows Gloves progression."
  },
  {
    "name": "Recruitment Drive",
    "id": "q124",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Regicide",
    "id": "q125",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Roving Elves",
    "id": "q126",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Royal Trouble",
    "id": "q127",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Rum Deal",
    "id": "q128",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Scorpion Catcher",
    "id": "q129",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Sea Slug",
    "id": "q130",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Secrets of the North",
    "id": "q131",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Shades of Mort'ton",
    "id": "q132",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Shadow of the Storm",
    "id": "q133",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Sheep Herder",
    "id": "q134",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Shilo Village",
    "id": "q135",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Slug Menace",
    "id": "q136",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Sleeping Giants",
    "id": "q137",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Giants' Foundry access."
  },
  {
    "name": "Sins of the Father",
    "id": "q138",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Darkmeyer access."
  },
  {
    "name": "Song of the Elves",
    "id": "q139",
    "tier": "Grandmaster",
    "difficulty": "Grandmaster",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Prifddinas unlock."
  },
  {
    "name": "Spirits of the Elid",
    "id": "q140",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Swan Song",
    "id": "q141",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Tai Bwo Wannai Trio",
    "id": "q142",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Tale of the Righteous",
    "id": "q143",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Tears of Guthix",
    "id": "q144",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Temple of Ikov",
    "id": "q145",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Temple of the Eye",
    "id": "q146",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Guardians of the Rift access."
  },
  {
    "name": "The Depths of Despair",
    "id": "q147",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Final Dawn",
    "id": "q148",
    "tier": "Master",
    "difficulty": "Master",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Lost Tribe",
    "id": "q149",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Path of Glouphrie",
    "id": "q150",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Queen of Thieves",
    "id": "q151",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Ribbiting Tale of a Lily Pad Labour Dispute",
    "id": "q152",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Tourist Trap",
    "id": "q153",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Tower of Life",
    "id": "q154",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Throne of Miscellania",
    "id": "q155",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "The Twilight's Promise",
    "id": "q156",
    "tier": "Novice",
    "difficulty": "Novice",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Underground Pass",
    "id": "m100",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Wanted!",
    "id": "q158",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Watchtower",
    "id": "q159",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Waterfall Quest",
    "id": "m057",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Huge early Attack/Strength XP."
  },
  {
    "name": "What Lies Below",
    "id": "q161",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "While Guthix Sleeps",
    "id": "q162",
    "tier": "Grandmaster",
    "difficulty": "Grandmaster",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Grandmaster progression and high-level unlocks."
  },
  {
    "name": "Witch's House",
    "id": "m059",
    "tier": "Intermediate",
    "difficulty": "Intermediate",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  },
  {
    "name": "Zogre Flesh Eaters",
    "id": "q164",
    "tier": "Experienced",
    "difficulty": "Experienced",
    "requires": [],
    "recommended": [
      "Check OSRS Wiki guide",
      "Bring food + teleport if combat is involved"
    ],
    "reward": "Quest Cape progression and quest points."
  }
];

const f2pQuestNames = new Set([
  "Below Ice Mountain","Black Knights' Fortress","Cook's Assistant","The Corsair Curse","Demon Slayer","Doric's Quest","Dragon Slayer I","Ernest the Chicken","Goblin Diplomacy","Imp Catcher","The Knight's Sword","Misthalin Mystery","Pirate's Treasure","Prince Ali Rescue","The Restless Ghost","Romeo & Juliet","Rune Mysteries","Sheep Shearer","Shield of Arrav","Vampire Slayer","Witch's Potion","X Marks the Spot"
]);
const miniquestNames = new Set([
  "Alfred Grimhand's Barcrawl","Bear Your Soul","Curse of the Empty Lord","Daddy's Home","Enchanted Key","Enter the Abyss","Family Pest","The Frozen Door","The General's Shadow","His Faithful Servants","Hopespear's Will","In Search of Knowledge","Into the Tombs","Lair of Tarn Razorlor","Mage Arena I","Mage Arena II","Skippy and the Mogres"
]);
const miniquestData = Array.from(miniquestNames).map((name,idx)=>({
  name,
  id:'mini_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''),
  tier:'Miniquest',
  difficulty:'Miniquest',
  type:'miniquest',
  requires:[],
  recommended:['Check OSRS Wiki guide','Manual tracker check or Dink bridge if supported'],
  reward:'Miniquest progression, unlocks, or account utility.'
}));
questData.push(...miniquestData.filter(m=>!questData.some(q=>q.name===m.name)));
function questType(q){
  if(q.type==='miniquest'||miniquestNames.has(q.name)||String(q.tier||'').toLowerCase()==='miniquest') return 'miniquest';
  if(f2pQuestNames.has(q.name)) return 'f2p';
  return 'members';
}
function questTypeLabel(q){const t=questType(q);return t==='f2p'?'Free-to-play':t==='miniquest'?'Miniquest':'Members';}

function questStatus(q){
  const qTask=allTasks().find(t=>t.id===q.id);
  if(qTask&&taskDone(qTask))return 'complete';
  if(!qTask && personalCount(q.id)===3)return 'complete';
  const missing=(q.requires||[]).filter(id=>{const t=allTasks().find(x=>x.id===id);return t?!taskDone(t):personalCount(id)<3&&!state.done[id];});
  return missing.length?'blocked':'ready';
}
function taskTitleById(id){const found=allTasks().find(t=>t.id===id);if(found)return found.title;const q=(typeof questData!=='undefined'?questData:[]).find(x=>x.id===id);return q?q.name:id;}

function questIcon(q){const name=(q.name||'').toLowerCase();const tier=(q.tier||'').toLowerCase();if(/dragon scimitar|scimitar/.test(name+tier))return osrsIcon('Scimitar','Dragon scimitar');if(/defender/.test(name))return osrsIcon('Defender','Dragon defender');if(/torso/.test(name))return osrsIcon('Torso','Fighter torso');if(/barrows|iban/.test(name+tier))return osrsIcon('Barrows','Barrows');if(/animal|ranged/.test(name+tier))return osrsIcon('Ranged','Ranged');if(/druidic|herblore/.test(name+tier))return osrsIcon('Herblore','Herblore');if(/rune|runecraft/.test(name+tier))return osrsIcon('Runecrafting','Runecraft');if(/cook/.test(name))return osrsIcon('Cooking','Cooking');if(/waterfall|fight|witch|monkey|gnome|grand tree/.test(name))return osrsIcon('Combat','Combat');if(/fairy|lost city|kourend|priest/.test(name+tier))return osrsIcon('Travel','Travel');return osrsIcon('Quest','Quest');}
function diaryIcon(d){const area=(d.area||'').toLowerCase();if(/ardougne/.test(area))return osrsIcon('Thieving','Ardougne Diary');if(/lumbridge/.test(area))return osrsIcon('Quest','Lumbridge Diary');if(/varrock/.test(area))return osrsIcon('Money','Varrock Diary');if(/falador/.test(area))return osrsIcon('Prayer','Falador Diary');if(/kandarin/.test(area))return osrsIcon('Woodcutting','Kandarin Diary');if(/kourend/.test(area))return osrsIcon('Travel','Kourend Diary');return osrsIcon('Diary','Achievement Diary');}
function renderQuestTracker(){
  const box=document.getElementById('questTracker'); if(!box)return; box.innerHTML='';
  const filter=document.getElementById('questFilter')?.value||'all';
  const typeFilter=document.getElementById('questTypeFilter')?.value||'all';
  const search=(document.getElementById('questSearch')?.value||'').toLowerCase().trim();
  let shown=0;
  questData.forEach(q=>{
    const status=questStatus(q); if(filter!=='all'&&filter!==status)return;
    const qType=questType(q); if(typeFilter!=='all'&&typeFilter!==qType)return;
    if(search && !(`${q.name} ${q.tier||''} ${q.difficulty||''} ${questTypeLabel(q)}`).toLowerCase().includes(search))return;
    shown++;
    const missing=(q.requires||[]).filter(id=>{const t=allTasks().find(x=>x.id===id);return t?!taskDone(t):personalCount(id)<3&&!state.done[id];});
    const card=document.createElement('article'); card.className='quest-card '+status+' '+questDifficulty(q)+' '+questType(q);
    const reqHtml=missing.length?missing.map(id=>`<li class="missing">✗ ${taskTitleById(id)}</li>`).join(''):'<li class="met">✓ Requirements met</li>';
    const recHtml=(q.recommended||[]).map(x=>`<span class="rec-chip">${x}</span>`).join('');
    const pc=personalCount(q.id);
    const pbar=`<div class="quest-player-progress"><div class="segments"><span class="seg ${pc>=1?'on':''}"></span><span class="seg ${pc>=2?'on':''}"></span><span class="seg ${pc>=3?'on':''}"></span></div><span>${pc}/3 players complete</span></div>`;
    card.innerHTML=`<div class="quest-top"><span class="quest-icon">${questIcon(q)}</span><div><h3>${q.name}</h3><p>${q.tier}</p></div><span class="quest-status ${status}">${status.toUpperCase()}</span></div><div class="difficulty-strip"><span>${questDifficulty(q)}</span><span class="type-chip ${questType(q)}">${questTypeLabel(q)}</span></div><div class="quest-body"><strong>Requirements</strong><ul>${reqHtml}</ul>${recHtml?`<div class="rec-row">${recHtml}</div>`:''}${pbar}<div class="player-toggles"></div><p class="quest-reward"><b>Unlock:</b> ${q.reward}</p><a class="wiki-link big" href="${wikiUrl(questWikiName(q.name))}" target="_blank" rel="noopener">Open OSRS Wiki</a></div>`;
    const toggles=card.querySelector('.player-toggles');
    playerKeys.forEach(k=>{const btn=document.createElement('button');btn.type='button';btn.className='player-pill '+(((state.playerDone||{})[q.id]||{})[k]?'checked':'');btn.textContent=(((state.playerDone||{})[q.id]||{})[k]?'✓ ':'')+playerLabel(k);btn.addEventListener('click',()=>{const current=!!(((state.playerDone||{})[q.id]||{})[k]);setPersonalDone(q.id,k,!current);if(!current){const count=personalCount(q.id);notifyTaskComplete({id:q.id,title:q.name,desc:q.reward,role:'All'},{type:count===3?'group-complete':'player-complete',player:playerLabel(k),progress:`${count}/3 players done`,title:count===3?`Group completed ${q.name}`:`${playerLabel(k)} completed ${q.name}`});}saveState();renderAll();});toggles.appendChild(btn);});
    box.appendChild(card);
  });
  if(!shown)box.innerHTML='<div class="empty-state">No quests match this filter.</div>';
}



const diaryData=[
 {
  "area": "Ardougne",
  "tier": "Easy",
  "id": "diary_ardy_easy",
  "icon": "🏅",
  "requires": [
   "m032"
  ],
  "wiki": "Ardougne Diary",
  "steps": [
   "Have Wizard Cromperty teleport you to the Rune essence mine",
   "Steal a cake from the Ardougne market stalls",
   "Sell silk to the Silk Trader in Ardougne for 60 coins",
   "Use the altar in East Ardougne church",
   "Go out fishing on the Fishing Trawler",
   "Enter the Combat Training Camp north of West Ardougne",
   "Have Tindel Marchant identify a rusty sword",
   "Use the Ardougne lever to teleport to the Wilderness",
   "View Aleck's Hunter Emporium in Yanille",
   "Check what pets you have insured with Probita"
  ]
 },
 {
  "area": "Ardougne",
  "tier": "Medium",
  "id": "diary_ardy_med",
  "icon": "🏅",
  "requires": [
   "m075",
   "m100"
  ],
  "wiki": "Ardougne Diary",
  "steps": [
   "Enter the unicorn pen in Ardougne Zoo using fairy rings",
   "Grapple over Yanille's south wall",
   "Harvest some strawberries from the Ardougne farming patch",
   "Cast the Ardougne Teleport spell",
   "Travel to Castle Wars by hot air balloon",
   "Claim buckets of sand from Bert in Yanille",
   "Catch any fish on the Fishing Platform",
   "Pickpocket the Master Farmer north of Ardougne",
   "Collect some nightshade from the Skavid caves",
   "Kill a swordchick in the Tower of Life",
   "Equip or upgrade Iban's staff",
   "Visit the island east of the Necromancer's Tower"
  ]
 },
 {
  "area": "Ardougne",
  "tier": "Hard",
  "id": "diary_ardy_hard",
  "icon": "🏅",
  "requires": [
   "m088"
  ],
  "wiki": "Ardougne Diary",
  "steps": [
   "Recharge some jewellery at the Totem Pole in the Legends' Guild",
   "Enter the Magic Guild",
   "Attempt to steal from King Lathas' chest",
   "Have a zookeeper put you in Ardougne Zoo's monkey cage",
   "Teleport to the Watchtower",
   "Catch a red salamander",
   "Check the health of a palm tree near Tree Gnome Village",
   "Pick some poison ivy berries south of East Ardougne",
   "Smith a mithril platebody near Ardougne",
   "Enter your player-owned house from Yanille",
   "Smith a dragon square shield in West Ardougne",
   "Craft some death runes"
  ]
 },
 {
  "area": "Ardougne",
  "tier": "Elite",
  "id": "diary_ardy_elite",
  "icon": "🏅",
  "requires": [
   "m088"
  ],
  "wiki": "Ardougne Diary",
  "steps": [
   "Attempt to picklock the door to the basement of Yanille Agility Dungeon",
   "Pickpocket a hero",
   "Make a rune crossbow yourself from scratch within Witchaven or Yanille",
   "Imbue a salve amulet or equip an imbued salve amulet",
   "Pick some torstol from the patch north of Ardougne",
   "Complete a lap of Ardougne Rooftop Agility Course",
   "Cast Ice Barrage on another player within Castle Wars"
  ]
 },
 {
  "area": "Lumbridge & Draynor",
  "tier": "Easy",
  "id": "diary_lum_easy",
  "icon": "🏅",
  "requires": [
   "m019",
   "m021"
  ],
  "wiki": "Lumbridge & Draynor Diary",
  "steps": [
   "Complete a lap of the Draynor Village Agility Course",
   "Slay a cave bug in the Lumbridge Swamp Caves",
   "Have Sedridor teleport you to the Rune essence mine",
   "Craft some water runes at the Water Altar",
   "Learn your age from Hans in Lumbridge Castle",
   "Pickpocket a man or woman in Lumbridge",
   "Chop and burn some oak logs in Lumbridge",
   "Catch some anchovies in Al Kharid",
   "Mine some iron ore at the Al Kharid mine",
   "Make soft clay in Barbarian Village",
   "Smith a steel longsword on the anvil in the Al Kharid mine",
   "Catch a raw pike east of Lumbridge Castle"
  ]
 },
 {
  "area": "Lumbridge & Draynor",
  "tier": "Medium",
  "id": "diary_lum_med",
  "icon": "🏅",
  "requires": [
   "m075",
   "m102"
  ],
  "wiki": "Lumbridge & Draynor Diary",
  "steps": [
   "Complete a lap of the Al Kharid Agility Course",
   "Grapple across the River Lum",
   "Purchase an upgraded device from Ava",
   "Travel to the Wizards' Tower by fairy ring",
   "Cast the Lumbridge Teleport spell",
   "Catch some salmon in Lumbridge",
   "Craft a coif in the Lumbridge cow pen",
   "Chop and burn willow logs in Draynor Village",
   "Catch an essence or eclectic impling in Puro-Puro",
   "Craft some lava runes at the Fire Altar in Al Kharid"
  ]
 },
 {
  "area": "Lumbridge & Draynor",
  "tier": "Hard",
  "id": "diary_lum_hard",
  "icon": "🏅",
  "requires": [
   "m075",
   "m081"
  ],
  "wiki": "Lumbridge & Draynor Diary",
  "steps": [
   "Cast Bones to Peaches in Al Kharid Palace",
   "Squeeze past the jutting wall on your way to the Cosmic Altar",
   "Craft 56 cosmic runes simultaneously",
   "Travel from Lumbridge to Edgeville on a waka canoe",
   "Collect at least 100 Tears of Guthix in one visit",
   "Take the train from Dorgesh-Kaan to Keldagrim",
   "Purchase Barrows gloves from the Culinaromancer's Chest",
   "Pick some belladonna from the farming patch at Draynor Manor",
   "Light your mining helmet in the Lumbridge Castle basement",
   "Craft, string, and enchant an amulet of power in Lumbridge"
  ]
 },
 {
  "area": "Lumbridge & Draynor",
  "tier": "Elite",
  "id": "diary_lum_elite",
  "icon": "🏅",
  "requires": [
   "m075",
   "m081"
  ],
  "wiki": "Lumbridge & Draynor Diary",
  "steps": [
   "Perform the Quest point cape emote in the Wise Old Man’s house",
   "Cast the spellbook-swap spell from the Lunar spellbook",
   "Pickpocket Movario on the Dorgesh-Kaan Agility Course",
   "Smith a rune platebody on the anvil in Draynor Sewers",
   "Craft 140 or more water runes at once",
   "Burn some magic logs in Lumbridge",
   "Bake a wild pie in Lumbridge Castle kitchen"
  ]
 },
 {
  "area": "Varrock",
  "tier": "Easy",
  "id": "diary_var_easy",
  "icon": "🏅",
  "requires": [
   "m021"
  ],
  "wiki": "Varrock Diary",
  "steps": [
   "Browse Thessalia’s Fine Clothes",
   "Have Aubury teleport you to the Rune essence mine",
   "Mine some iron ore in the Varrock south-east mine",
   "Make a normal plank at the sawmill",
   "Enter the second level of the Stronghold of Security",
   "Jump over the fence south of Varrock",
   "Chop down a dying tree in the Lumber Yard",
   "Have Elsie tell you a story",
   "Spin a bowl on the pottery wheel and fire it in Barbarian Village",
   "Catch some trout in the River Lum at Barbarian Village"
  ]
 },
 {
  "area": "Varrock",
  "tier": "Medium",
  "id": "diary_var_med",
  "icon": "🏅",
  "requires": [
   "m070"
  ],
  "wiki": "Varrock Diary",
  "steps": [
   "Have the Apothecary make you a strength potion",
   "Enter the Champions’ Guild",
   "Select a color for your kitten",
   "Use the Spirit Tree north of the Grand Exchange",
   "Complete a lap of the Varrock Rooftop Agility Course",
   "Browse Oziach’s armour shop",
   "Make a teleport tablet on a mahogany lectern",
   "Use the balloon to travel from Varrock",
   "Cast Varrock Teleport",
   "Mine some limestone near Paterdomus"
  ]
 },
 {
  "area": "Varrock",
  "tier": "Hard",
  "id": "diary_var_hard",
  "icon": "🏅",
  "requires": [
   "m070"
  ],
  "wiki": "Varrock Diary",
  "steps": [
   "Enter the Cooking Guild wearing a chef’s hat",
   "Squeeze through the obstacle pipe in Edgeville Dungeon",
   "Teleport to Paddewwa",
   "Teleport to the digsite using a digsite pendant",
   "Craft an earth battlestaff",
   "Have the Varrock estate agent decorate your house with Fancy Stone",
   "Smith and fletch 10 rune darts within Varrock",
   "Collect at least 2 yew roots from the Varrock Palace tree patch",
   "Chop yew logs in Varrock and burn them at the top of Varrock church",
   "Trade furs with the Fancy Dress Seller for a spottier cape and equip it"
  ]
 },
 {
  "area": "Varrock",
  "tier": "Elite",
  "id": "diary_var_elite",
  "icon": "🏅",
  "requires": [
   "m070"
  ],
  "wiki": "Varrock Diary",
  "steps": [
   "Smith and fletch 10 rune darts within Varrock",
   "Bake a summer pie in the Cooking Guild",
   "Create a super combat potion in Varrock west bank",
   "Use Lunar magic to cast Fertile Soil on the Varrock Palace tree patch",
   "Chop down a redwood tree in the Woodcutting Guild and burn the logs in Varrock",
   "Make a rune kiteshield in Varrock west bank",
   "Complete a high-level Varrock diary task requiring the Varrock elite checklist"
  ]
 },
 {
  "area": "Falador",
  "tier": "Easy",
  "id": "diary_fal_easy",
  "icon": "🏅",
  "requires": [
   "m021"
  ],
  "wiki": "Falador Diary",
  "steps": [
   "Climb over the western Falador wall",
   "Browse Sarah’s farming shop south of Falador",
   "Get a haircut from the Falador hairdresser",
   "Fill a bucket of water from the pump outside Falador west bank",
   "Kill a duck in Falador Park",
   "Make a mind tiara at the Mind Altar",
   "Take the boat to Entrana",
   "Repair a broken strut in Motherlode Mine",
   "Find out your family crest from Sir Renitee",
   "Smith a blurite limb on Doric’s anvil"
  ]
 },
 {
  "area": "Falador",
  "tier": "Medium",
  "id": "diary_fal_med",
  "icon": "🏅",
  "requires": [
   "m066",
   "m081"
  ],
  "wiki": "Falador Diary",
  "steps": [
   "Light a bullseye lantern at the Chemist’s in Rimmington",
   "Place a scarecrow in the Falador farm patch",
   "Craft a fruit basket on the Falador farm loom",
   "Squeeze through the crevice in the Dwarven Mine",
   "Mine gold ore at the Crafting Guild",
   "Pray at the Altar of Guthix in Taverley wearing full Initiate",
   "Telegrab Wine of Zamorak at the Chaos Temple",
   "Chop and burn willow logs in Taverley",
   "Kill a Mogre at Mudskipper Point",
   "Enter the Mining Guild"
  ]
 },
 {
  "area": "Falador",
  "tier": "Hard",
  "id": "diary_fal_hard",
  "icon": "🏅",
  "requires": [
   "m066",
   "m081"
  ],
  "wiki": "Falador Diary",
  "steps": [
   "Recharge your prayer in Port Sarim church wearing full Proselyte",
   "Enter the Warriors’ Guild",
   "Complete a lap of Falador Rooftop Agility Course",
   "Change your family crest to the Saradomin symbol",
   "Equip a dwarven helmet within the Dwarven mines",
   "Kill the Giant Mole beneath Falador Park",
   "Craft a black dragonhide body in Falador",
   "Pickpocket a Falador guard",
   "Use the Falador shield to restore prayer",
   "Mine adamantite ore in the Mining Guild resource dungeon"
  ]
 },
 {
  "area": "Falador",
  "tier": "Elite",
  "id": "diary_fal_elite",
  "icon": "🏅",
  "requires": [
   "m066",
   "m081"
  ],
  "wiki": "Falador Diary",
  "steps": [
   "Find at least 3 magic roots at once when digging up your magic tree in Falador",
   "Jump over the strange floor in Taverley Dungeon",
   "Mix a Saradomin brew in Falador east bank",
   "Kill the Giant Mole 10 times",
   "Use your Falador shield to locate the Giant Mole",
   "Equip a full prospector outfit in Motherlode Mine",
   "Complete a high-level Falador elite diary task"
  ]
 },
 {
  "area": "Karamja",
  "tier": "Easy",
  "id": "diary_kar_easy",
  "icon": "🏅",
  "requires": [],
  "wiki": "Karamja Diary",
  "steps": [
   "Pick 5 bananas from the plantation east of the volcano",
   "Use the rope swing to travel to Moss Giant Island",
   "Mine gold from the rocks on north-west Karamja",
   "Travel to Port Sarim by ship from Musa Point",
   "Enter the Brimhaven Dungeon",
   "Charter a ship from the Shipyard",
   "Catch a fish on Karamja",
   "Kill a jogre in the Pothole Dungeon",
   "Explore Cairn Isle west of Karamja",
   "Buy a snapdragon from Pirate Jackie the Fruit"
  ]
 },
 {
  "area": "Karamja",
  "tier": "Medium",
  "id": "diary_kar_med",
  "icon": "🏅",
  "requires": [],
  "wiki": "Karamja Diary",
  "steps": [
   "Claim a ticket from the Brimhaven Agility Arena",
   "Discover hidden wall in Brimhaven Dungeon",
   "Cross the lava stepping stones in Brimhaven Dungeon",
   "Trap a horned graahk",
   "Cut a teak log near Tai Bwo Wannai",
   "Cook a spider on a stick",
   "Catch a karambwan",
   "Grow a healthy fruit tree near Brimhaven",
   "Use the gnome glider to travel to Karamja",
   "Complete the Fight Caves wave 1 entry task"
  ]
 },
 {
  "area": "Karamja",
  "tier": "Hard",
  "id": "diary_kar_hard",
  "icon": "🏅",
  "requires": [],
  "wiki": "Karamja Diary",
  "steps": [
   "Cook a karambwan thoroughly",
   "Kill a deathwing under the Kharazi Jungle",
   "Successfully complete a hard Tai Bwo Wannai cleanup action",
   "Exchange gems for trading sticks",
   "Kill a metal dragon in Brimhaven Dungeon",
   "Cut a mahogany log on Karamja",
   "Catch a raw karambwanji",
   "Use the shortcut in Brimhaven Dungeon",
   "Earn 100% favor in Tai Bwo Wannai Cleanup",
   "Complete the Karamja hard diary task list"
  ]
 },
 {
  "area": "Karamja",
  "tier": "Elite",
  "id": "diary_kar_elite",
  "icon": "🏅",
  "requires": [],
  "wiki": "Karamja Diary",
  "steps": [
   "Check the health of a palm tree in Brimhaven",
   "Check the health of your calquat tree patch",
   "Create an anti-venom potion in the Horseshoe mine",
   "Craft nature runes at the Nature Altar",
   "Kill a TzHaar monster in the Fight Cave area",
   "Complete a full Fight Cave run",
   "Complete a high-level Karamja elite diary task"
  ]
 },
 {
  "area": "Kandarin",
  "tier": "Easy",
  "id": "diary_kan_easy",
  "icon": "🏅",
  "requires": [
   "m060"
  ],
  "wiki": "Kandarin Diary",
  "steps": [
   "Catch a mackerel at Catherby",
   "Buy a candle from the candle maker in Catherby",
   "Collect 5 flax from Seers’ Village",
   "Play the church organ in Seers’ Village",
   "Cross the Coal Trucks log balance",
   "Plant jute seeds north of McGrubor’s Wood",
   "Visit Sherlock",
   "Kill a fire giant in the Waterfall Dungeon",
   "Use the Sinclair Mansion fountain",
   "Complete an easy Kandarin diary task in Seers’ Village"
  ]
 },
 {
  "area": "Kandarin",
  "tier": "Medium",
  "id": "diary_kan_med",
  "icon": "🏅",
  "requires": [
   "m084"
  ],
  "wiki": "Kandarin Diary",
  "steps": [
   "Complete a lap of Barbarian Agility Course",
   "Catch and cook a bass in Catherby",
   "Pick limpwurt root from the Catherby farming patch",
   "Create a superantipoison from scratch in Seers/Catherby",
   "String a maple shortbow in Seers’ Village bank",
   "Use the fairy ring near McGrubor’s Wood",
   "Kill a Pyrefiend in the Fremennik Slayer Dungeon",
   "Complete a Castle Wars game",
   "Teleport to Camelot",
   "Claim noted flax from Geoffrey"
  ]
 },
 {
  "area": "Kandarin",
  "tier": "Hard",
  "id": "diary_kan_hard",
  "icon": "🏅",
  "requires": [
   "m084",
   "m088"
  ],
  "wiki": "Kandarin Diary",
  "steps": [
   "Complete a lap of Seers’ Village Rooftop Agility Course",
   "Catch a leaping sturgeon",
   "Create a yew longbow from scratch around Seers’ Village",
   "Burn maple logs with a bow in Seers’ Village",
   "Purchase and equip a granite body from Barbarian Assault",
   "Enter Seers’ Village courthouse with Piety turned on",
   "Have the Seers’ estate agent decorate your house with Fancy Stone",
   "Kill a fire giant in the Waterfall Dungeon",
   "Pickpocket a gnome",
   "Complete a hard Kandarin diary task"
  ]
 },
 {
  "area": "Kandarin",
  "tier": "Elite",
  "id": "diary_kan_elite",
  "icon": "🏅",
  "requires": [
   "m084",
   "m088"
  ],
  "wiki": "Kandarin Diary",
  "steps": [
   "Mix a stamina mix on top of Seers’ Village bank",
   "Fish and cook 5 sharks in Catherby using cooking gauntlets",
   "Pick dwarf weed from the Catherby herb patch",
   "Construct a pyre ship from magic logs",
   "Smith an adamant spear at Otto’s Grotto",
   "Complete Barbarian Assault queen kill requirement",
   "Complete a high-level Kandarin elite diary task"
  ]
 },
 {
  "area": "Morytania",
  "tier": "Easy",
  "id": "diary_mor_easy",
  "icon": "🏅",
  "requires": [
   "m071"
  ],
  "wiki": "Morytania Diary",
  "steps": [
   "Enter Morytania through the Paterdomus temple barrier",
   "Kill a ghoul",
   "Place a scarecrow in the Morytania flower patch",
   "Cook a thin snail on the Port Phasmatys range",
   "Craft any snelm from scratch in Morytania",
   "Use an ectophial to teleport to the Ectofuntus",
   "Kill a fever spider on Braindeath Island",
   "Enter the Slayer Tower",
   "Complete a Canifis rooftop agility action",
   "Use the bank in Port Phasmatys"
  ]
 },
 {
  "area": "Morytania",
  "tier": "Medium",
  "id": "diary_mor_med",
  "icon": "🏅",
  "requires": [
   "m071"
  ],
  "wiki": "Morytania Diary",
  "steps": [
   "Complete a lap of Canifis Rooftop Agility Course",
   "Catch a swamp lizard",
   "Mix a Guthix balance potion in Morytania",
   "Complete a game of Trouble Brewing",
   "Kill a Banshee in the Slayer Tower",
   "Use the ectofuntus to worship with bones",
   "Complete a Barrows chest attempt",
   "Travel to Mos Le’Harmless",
   "Buy a Slayer helmet unlock or check Slayer master",
   "Complete a medium Morytania diary task"
  ]
 },
 {
  "area": "Morytania",
  "tier": "Hard",
  "id": "diary_mor_hard",
  "icon": "🏅",
  "requires": [
   "m100"
  ],
  "wiki": "Morytania Diary",
  "steps": [
   "Use the shortcut to the bridge over the Salve",
   "Climb the advanced spike chain in the Slayer Tower",
   "Harvest watermelons on Harmony Island",
   "Harvest bittercap mushrooms from Canifis",
   "Chop and burn mahogany logs on Mos Le’Harmless",
   "Pray at the Altar of Nature with Piety activated",
   "Enter the Kharyrll portal in your POH",
   "Complete a Barrows run",
   "Kill a skeletal wyvern task if assigned",
   "Complete a hard Morytania diary task"
  ]
 },
 {
  "area": "Morytania",
  "tier": "Elite",
  "id": "diary_mor_elite",
  "icon": "🏅",
  "requires": [
   "m100"
  ],
  "wiki": "Morytania Diary",
  "steps": [
   "Cremate shade remains on a magic pyre",
   "Craft a black dragonhide body in Canifis bank",
   "Loot the Barrows chest while wearing any complete Barrows set",
   "Catch a shark in Burgh de Rott barehanded",
   "Kill an Abyssal demon in the Slayer Tower",
   "Complete Theatre of Blood entry requirement if applicable",
   "Complete a high-level Morytania elite diary task"
  ]
 },
 {
  "area": "Fremennik",
  "tier": "Easy",
  "id": "diary_frem_easy",
  "icon": "🏅",
  "requires": [],
  "wiki": "Fremennik Diary",
  "steps": [
   "Catch a cerulean twitch",
   "Chop and burn oak logs in the Fremennik Province",
   "Craft a tiara from scratch in Rellekka",
   "Kill a rock crab",
   "Browse Yrsa’s shoe store in Rellekka",
   "Collect a pet rock from Askeladden",
   "Mine some coal near Rellekka",
   "Enter the Fremennik Slayer Dungeon",
   "Use the fairy ring on Miscellania if unlocked",
   "Complete an easy Fremennik diary task"
  ]
 },
 {
  "area": "Fremennik",
  "tier": "Medium",
  "id": "diary_frem_med",
  "icon": "🏅",
  "requires": [],
  "wiki": "Fremennik Diary",
  "steps": [
   "Pick up your pet rock from your POH menagerie",
   "Catch a snowy knight",
   "Kill a brine rat",
   "Steal from a Fremennik citizen",
   "Complete a lap of the Rellekka rooftop course or related medium task",
   "Travel to Waterbirth Island",
   "Use the enchanted lyre to teleport to Rellekka",
   "Mine gold ore on Jatizso",
   "Complete a medium Fremennik diary task",
   "Claim Fremennik sea boots 2"
  ]
 },
 {
  "area": "Fremennik",
  "tier": "Hard",
  "id": "diary_frem_hard",
  "icon": "🏅",
  "requires": [],
  "wiki": "Fremennik Diary",
  "steps": [
   "Mix a super defence potion in the Fremennik Province",
   "Catch a sabre-toothed kyatt",
   "Kill a spiritual warrior in God Wars Dungeon",
   "Complete a hard Fremennik quest-area task",
   "Teleport to Trollheim",
   "Use the shortcut to enter the Fremennik Slayer Dungeon deeper area",
   "Kill a Dagannoth in Waterbirth Dungeon",
   "Complete a hard Fremennik diary task",
   "Claim Fremennik sea boots 3"
  ]
 },
 {
  "area": "Fremennik",
  "tier": "Elite",
  "id": "diary_frem_elite",
  "icon": "🏅",
  "requires": [],
  "wiki": "Fremennik Diary",
  "steps": [
   "Complete a lap of Rellekka Rooftop Agility Course",
   "Craft a dragonstone amulet in the Neitiznot furnace",
   "Kill each God Wars Dungeon general",
   "Kill the Dagannoth Kings",
   "Kill a spiritual mage if assigned or eligible",
   "Use high-level Fremennik diary completion methods",
   "Claim Fremennik sea boots 4"
  ]
 },
 {
  "area": "Desert",
  "tier": "Easy",
  "id": "diary_des_easy",
  "icon": "🏅",
  "requires": [],
  "wiki": "Desert Diary",
  "steps": [
   "Catch a golden warbler",
   "Mine some granite",
   "Kill a desert lizard",
   "Enter the Kalphite Lair",
   "Travel from Shantay Pass to Pollnivneach by magic carpet",
   "Cut a cactus for water",
   "Visit the Agility Pyramid area",
   "Use the Nardah bank",
   "Complete an easy Desert diary task",
   "Claim desert amulet 1"
  ]
 },
 {
  "area": "Desert",
  "tier": "Medium",
  "id": "diary_des_med",
  "icon": "🏅",
  "requires": [],
  "wiki": "Desert Diary",
  "steps": [
   "Climb to the summit of the Agility Pyramid",
   "Create a combat potion in the Desert",
   "Catch an orange salamander",
   "Teleport to Pollnivneach with a redirected house tablet or enter POH from Pollnivneach",
   "Kill a vulture",
   "Complete a medium Desert task near Nardah",
   "Use the carpet network for a diary task",
   "Complete medium Desert diary tasks",
   "Claim desert amulet 2"
  ]
 },
 {
  "area": "Desert",
  "tier": "Hard",
  "id": "diary_des_hard",
  "icon": "🏅",
  "requires": [],
  "wiki": "Desert Diary",
  "steps": [
   "Complete a lap of Pollnivneach Rooftop Agility Course",
   "Burn yew logs on the Nardah Mayor’s balcony",
   "Kill the Kalphite Queen or complete the required KQ diary action",
   "Charge a pharaoh’s sceptre or use Pyramid Plunder requirement",
   "Complete a hard Desert quest-area task",
   "Complete hard Desert diary tasks",
   "Claim desert amulet 3"
  ]
 },
 {
  "area": "Desert",
  "tier": "Elite",
  "id": "diary_des_elite",
  "icon": "🏅",
  "requires": [],
  "wiki": "Desert Diary",
  "steps": [
   "Speak to the Kq head in your POH",
   "Bake a wild pie at the Nardah clay oven",
   "Fletch dragon darts at the Bedabin Camp",
   "Kill Kalphite Queen for elite requirement",
   "Complete a high-level Desert diary task",
   "Complete remaining elite Desert diary tasks",
   "Claim desert amulet 4"
  ]
 },
 {
  "area": "Western Provinces",
  "tier": "Easy",
  "id": "diary_west_easy",
  "icon": "🏅",
  "requires": [
   "m060"
  ],
  "wiki": "Western Provinces Diary",
  "steps": [
   "Catch a copper longtail",
   "Fletch an oak shortbow in the Gnome Stronghold",
   "Kill a terrorbird in the Gnome Stronghold",
   "Use the spirit tree in the Gnome Stronghold",
   "Visit the Tree Gnome Stronghold bank",
   "Complete a beginner chompy bird task",
   "Complete an easy Western Provinces task",
   "Claim western banner 1"
  ]
 },
 {
  "area": "Western Provinces",
  "tier": "Medium",
  "id": "diary_west_med",
  "icon": "🏅",
  "requires": [
   "m088"
  ],
  "wiki": "Western Provinces Diary",
  "steps": [
   "Take the agility shortcut from the Grand Tree to Otto’s Grotto",
   "Make a chocolate bomb at the Grand Tree",
   "Trap a spined larupia",
   "Fish some bass on Ape Atoll",
   "Chop and burn teak logs on Ape Atoll",
   "Kill 125 chompy birds",
   "Complete a medium Western Provinces task",
   "Claim western banner 2"
  ]
 },
 {
  "area": "Western Provinces",
  "tier": "Hard",
  "id": "diary_west_hard",
  "icon": "🏅",
  "requires": [
   "m088"
  ],
  "wiki": "Western Provinces Diary",
  "steps": [
   "Complete a lap of Ape Atoll Agility Course",
   "Kill an elf with a crystal bow",
   "Catch and cook a monkfish in Piscatoris",
   "Build an Isafdar painting in your POH quest hall",
   "Catch a dashing kebbit",
   "Check the health of your palm tree in Lletya",
   "Kill 300 chompy birds",
   "Complete a hard Western Provinces task",
   "Claim western banner 3"
  ]
 },
 {
  "area": "Western Provinces",
  "tier": "Elite",
  "id": "diary_west_elite",
  "icon": "🏅",
  "requires": [
   "m088"
  ],
  "wiki": "Western Provinces Diary",
  "steps": [
   "Use the Elven Overpass advanced cliffside shortcut",
   "Fletch a magic longbow in the Elven lands",
   "Have Prissy Scilla protect your magic tree",
   "Kill 1,000 chompy birds",
   "Kill a Zulrah or high-level western boss task if required",
   "Complete remaining elite Western Provinces tasks",
   "Claim western banner 4"
  ]
 },
 {
  "area": "Wilderness",
  "tier": "Easy",
  "id": "diary_wild_easy",
  "icon": "🏅",
  "requires": [],
  "wiki": "Wilderness Diary",
  "steps": [
   "Cast Low Alchemy at the Fountain of Rune",
   "Kill an earth warrior beneath Edgeville",
   "Enter the Wilderness from Edgeville",
   "Mine iron ore in the Wilderness",
   "Bury bones in the Wilderness",
   "Use the lever to teleport to the Deserted Keep",
   "Open a muddy chest or Wilderness chest if required",
   "Complete an easy Wilderness diary task",
   "Claim wilderness sword 1"
  ]
 },
 {
  "area": "Wilderness",
  "tier": "Medium",
  "id": "diary_wild_med",
  "icon": "🏅",
  "requires": [],
  "wiki": "Wilderness Diary",
  "steps": [
   "Complete a lap of the Wilderness Agility Course",
   "Enter the Wilderness God Wars Dungeon",
   "Kill a green dragon",
   "Mine mithril ore in the Wilderness",
   "Catch a black salamander if applicable",
   "Use a Wilderness obelisk",
   "Complete a medium Wilderness diary task",
   "Claim wilderness sword 2"
  ]
 },
 {
  "area": "Wilderness",
  "tier": "Hard",
  "id": "diary_wild_hard",
  "icon": "🏅",
  "requires": [],
  "wiki": "Wilderness Diary",
  "steps": [
   "Take the agility shortcut from Trollheim into the Wilderness",
   "Catch a black salamander",
   "Fish raw lava eel in the Wilderness",
   "Kill a Lava dragon",
   "Kill the Crazy Archaeologist or Chaos Fanatic if required",
   "Complete a hard Wilderness diary task",
   "Claim wilderness sword 3"
  ]
 },
 {
  "area": "Wilderness",
  "tier": "Elite",
  "id": "diary_wild_elite",
  "icon": "🏅",
  "requires": [],
  "wiki": "Wilderness Diary",
  "steps": [
   "Cut and burn magic logs in the Resource Area",
   "Fish and cook a dark crab in the Resource Area",
   "Slay a spiritual mage within Wilderness God Wars Dungeon",
   "Cast a high-level Wilderness spell requirement",
   "Complete a high-level Wilderness boss task",
   "Complete remaining elite Wilderness diary tasks",
   "Claim wilderness sword 4"
  ]
 },
 {
  "area": "Kourend & Kebos",
  "tier": "Easy",
  "id": "diary_kou_easy",
  "icon": "🏅",
  "requires": [
   "m067"
  ],
  "wiki": "Kourend & Kebos Diary",
  "steps": [
   "Mine some volcanic sulphur",
   "Enter the Farming Guild",
   "Use the Kourend Castle teleport if unlocked",
   "Kill a sand crab",
   "Browse a shop in Hosidius",
   "Steal from a fruit stall",
   "Complete a beginner Kourend & Kebos task",
   "Claim Rada’s blessing 1"
  ]
 },
 {
  "area": "Kourend & Kebos",
  "tier": "Medium",
  "id": "diary_kou_med",
  "icon": "🏅",
  "requires": [
   "m067"
  ],
  "wiki": "Kourend & Kebos Diary",
  "steps": [
   "Complete a lap of the Shayzien Agility Course",
   "Enter the Woodcutting Guild",
   "Kill a lizardman",
   "Catch a chinchompa in Kebos if required",
   "Farm or harvest at a Kourend patch",
   "Complete a medium Kourend & Kebos task",
   "Claim Rada’s blessing 2"
  ]
 },
 {
  "area": "Kourend & Kebos",
  "tier": "Hard",
  "id": "diary_kou_hard",
  "icon": "🏅",
  "requires": [
   "m067"
  ],
  "wiki": "Kourend & Kebos Diary",
  "steps": [
   "Kill a Lizardman shaman",
   "Complete a raid-related or Kebos boss task if required",
   "Catch anglerfish in Piscarilius",
   "Use the mine cart network",
   "Complete a high-level farming guild task",
   "Complete a hard Kourend & Kebos task",
   "Claim Rada’s blessing 3"
  ]
 },
 {
  "area": "Kourend & Kebos",
  "tier": "Elite",
  "id": "diary_kou_elite",
  "icon": "🏅",
  "requires": [
   "m067"
  ],
  "wiki": "Kourend & Kebos Diary",
  "steps": [
   "Kill a hydra or high-level Kebos Slayer monster",
   "Complete Chambers of Xeric or raid-related elite requirement if applicable",
   "Catch and cook anglerfish/elite resource task",
   "Complete high-level farming guild requirement",
   "Complete remaining elite Kourend & Kebos tasks",
   "Claim Rada’s blessing 4"
  ]
 }
];
function diaryStepKey(d,idx){return `${d.id}_step_${idx}`;}
function getDiaryStepDone(d,idx,k){const key=diaryStepKey(d,idx);return !!(((state.diarySteps||{})[key]||{})[k]);}
function setDiaryStepDone(d,idx,k,value){state.diarySteps=state.diarySteps||{};const key=diaryStepKey(d,idx);state.diarySteps[key]=state.diarySteps[key]||{};state.diarySteps[key][k]=value;}
function setDiaryDone(id,key,value){state.diaryDone=state.diaryDone||{};state.diaryDone[id]=state.diaryDone[id]||{};state.diaryDone[id][key]=value;const d=diaryData.find(x=>x.id===id);if(d){(d.steps||[]).forEach((_,idx)=>setDiaryStepDone(d,idx,key,value));}}
function diaryPlayerComplete(d,k){if(!d)return false;if(((state.diaryDone||{})[d.id]||{})[k])return true;const steps=d.steps||[];return steps.length>0 && steps.every((_,idx)=>getDiaryStepDone(d,idx,k));}
function diaryReady(d){return (d.requires||[]).every(id=>{const t=allTasks().find(x=>x.id===id);return t?taskDone(t):!!state.done[id];});}
function diaryDifficultyClass(tier){return tier.toLowerCase();}
function diaryStepProgress(d){const total=(d.steps||[]).length*3;if(!total)return 0;let done=0;(d.steps||[]).forEach((_,idx)=>playerKeys.forEach(k=>{if(getDiaryStepDone(d,idx,k))done++;}));return Math.round(done/total*100);}
function tierSort(t){return {Easy:1,Medium:2,Hard:3,Elite:4}[t]||9;}
function renderDiaryTracker(){const box=document.getElementById('diaryTracker');if(!box)return;box.innerHTML='';const filter=document.getElementById('diaryFilter')?.value||'all';let shown=0;const grouped={};diaryData.slice().sort((a,b)=>a.area.localeCompare(b.area)||tierSort(a.tier)-tierSort(b.tier)).forEach(d=>{(grouped[d.area]=grouped[d.area]||[]).push(d);});Object.keys(grouped).forEach(area=>{const areaWrap=document.createElement('section');areaWrap.className='diary-area-panel';const areaTiers=grouped[area];const areaComplete=areaTiers.filter(d=>diaryComplete(d)).length;areaWrap.innerHTML=`<div class="diary-area-head"><h3>${diaryIcon(areaTiers[0])} ${area}</h3><span>${areaComplete}/${areaTiers.length} tiers complete</span></div><div class="diary-tier-list"></div>`;const list=areaWrap.querySelector('.diary-tier-list');let areaShown=false;areaTiers.forEach(d=>{const count=diaryCount(d.id);const complete=diaryComplete(d);const ready=diaryReady(d);if(filter==='complete'&&!complete)return;if(filter==='ready'&&(complete||!ready))return;areaShown=true;shown++;const missing=(d.requires||[]).filter(id=>{const t=allTasks().find(x=>x.id===id);return t?!taskDone(t):!state.done[id];});const reqHtml=missing.length?missing.map(id=>`<li class="missing">✗ ${taskTitleById(id)}</li>`).join(''):'<li class="met">✓ Route requirements met</li>';const stepPct=diaryStepProgress(d);const card=document.createElement('article');card.className=`diary-card diary-dropdown ${complete?'complete':ready?'ready':'blocked'} ${diaryDifficultyClass(d.tier)}`;card.innerHTML=`<details><summary><div class="diary-summary-main"><span class="diary-icon">${diaryIcon(d)}</span><div><h3>${d.tier} Diary</h3><p>${count}/3 players complete • ${stepPct}% step progress</p></div></div><span class="quest-status ${complete?'complete':ready?'ready':'blocked'}">${complete?'COMPLETE':ready?'READY':'BLOCKED'}</span></summary><div class="diary-body"><div class="difficulty-strip"><span>${d.tier}</span></div><div class="quest-player-progress"><div class="segments"><span class="seg ${count>=1?'on':''}"></span><span class="seg ${count>=2?'on':''}"></span><span class="seg ${count>=3?'on':''}"></span></div><span>${count}/3 players complete full tier</span></div><div class="player-toggles diary-toggles"></div><strong>Route checks</strong><ul>${reqHtml}</ul><div class="diary-step-list"></div><a class="wiki-link big" href="${wikiUrl(d.wiki)}" target="_blank" rel="noopener">Open OSRS Wiki</a></div></details>`;const toggles=card.querySelector('.player-toggles');playerKeys.forEach(k=>{const done=diaryPlayerComplete(d,k);const btn=document.createElement('button');btn.type='button';btn.className='player-pill '+(done?'checked':'');btn.textContent=(done?'✓ ':'')+playerLabel(k)+' full tier';btn.addEventListener('click',()=>{const nextVal=!diaryPlayerComplete(d,k);setDiaryDone(d.id,k,nextVal);if(nextVal){const countNow=diaryCount(d.id);sendDiscordUpdate({type:countNow===3?'group-complete':'diary',title:countNow===3?`Group completed ${d.area} ${d.tier} Diary`:`${playerLabel(k)} completed ${d.area} ${d.tier} Diary`,player:playerLabel(k),progress:`${countNow}/3 players done`,phase:'Achievement Diary'});}saveState();renderAll();});toggles.appendChild(btn);});const stepBox=card.querySelector('.diary-step-list');(d.steps||[]).forEach((step,idx)=>{const row=document.createElement('div');row.className='diary-step-row';const donePlayers=playerKeys.filter(k=>getDiaryStepDone(d,idx,k)).length;row.innerHTML=`<div class="diary-step-title"><span class="mini-step-count">${donePlayers}/3</span><span>${idx+1}. ${step}</span></div><div class="mini-player-toggles"></div>`;const mini=row.querySelector('.mini-player-toggles');playerKeys.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='mini-player '+(getDiaryStepDone(d,idx,k)?'checked':'');b.title=playerLabel(k);b.textContent=(getDiaryStepDone(d,idx,k)?'✓':playerLabel(k).slice(0,1).toUpperCase());b.addEventListener('click',()=>{const nv=!getDiaryStepDone(d,idx,k);setDiaryStepDone(d,idx,k,nv);if(nv && diaryPlayerComplete(d,k)){state.diaryDone=state.diaryDone||{};state.diaryDone[d.id]=state.diaryDone[d.id]||{};state.diaryDone[d.id][k]=true;}else if(!nv){state.diaryDone=state.diaryDone||{};state.diaryDone[d.id]=state.diaryDone[d.id]||{};state.diaryDone[d.id][k]=false;}saveState();renderAll();});mini.appendChild(b);});stepBox.appendChild(row);});list.appendChild(card);});if(areaShown)box.appendChild(areaWrap);});if(!shown)box.innerHTML='<div class="empty-state">No diary tiers match this filter.</div>';}
function safeRenderBlock(name,fn){try{return fn();}catch(e){console.error('HCIM render failed in '+name,e);const el=document.getElementById('syncStatus');if(el){el.textContent='Render issue: '+name;el.className='sync-status local';}return null;}}
function renderAll(){safeRenderBlock('normalize',normalizeState);safeRenderBlock('phase filter',populateFilter);safeRenderBlock('players',renderPlayers);safeRenderBlock('main route',()=>renderRoute('mainTasks',route));safeRenderBlock('player jobs',()=>renderRoute('teamTasks',teamRoute));safeRenderBlock('group storage',()=>renderRoute('storageTasks',storageRoute));safeRenderBlock('quest tracker',renderQuestTracker);safeRenderBlock('diary tracker',renderDiaryTracker);safeRenderBlock('dashboard',renderDashboard);safeRenderBlock('skill math',renderCalc);safeRenderBlock('sync status',updateSync);}
function jumpNext(complete=false){const next=allTasks().find(x=>!taskDone(x));if(!next)return;if(complete){setTaskDone(next,true);saveState();renderAll();return;}document.querySelector('.tab[data-route="main"]').click();document.getElementById('phaseFilter').value=route.some(p=>p.phase===next.phase)?next.phase:'all';renderAll();setTimeout(()=>document.getElementById('task-'+next.id)?.scrollIntoView({behavior:'smooth',block:'center'}),50);}

function importSaveFile(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const imported=JSON.parse(reader.result);
      if(!imported || typeof imported!=='object')throw new Error('Invalid save file');
      if(!confirm('Import this save and replace the current tracker progress?'))return;
      state={
        ...state,
        ...imported,
        done:{...(imported.done||{})},
        playerDone:{...(imported.playerDone||{})},
        diaryDone:{...(imported.diaryDone||{})},
        diarySteps:{...(imported.diarySteps||{})},
        players:{...(imported.players||state.players||{})}
      };
      saveState();
      renderAll();
      alert('Save imported successfully.');
    }catch(err){
      console.error(err);
      alert('Could not import this save. Make sure it is a valid hcim-tracker-save.json file.');
    }finally{
      const input=document.getElementById('importFile');
      if(input)input.value='';
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded',()=>{loadLocal();renderAll();window.addEventListener('hcim-group-ready',()=>{initFirebase();updateSync();},{once:true});document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.route').forEach(r=>r.classList.remove('active-route'));document.getElementById(btn.dataset.route).classList.add('active-route');}));['groupName','player1','player2','player3'].forEach(id=>document.getElementById(id).addEventListener('input',e=>{state.players=state.players||{};state.players[id]=e.target.value;saveState();renderAll();}));document.getElementById('phaseFilter').addEventListener('change',renderAll);document.getElementById('questFilter')?.addEventListener('change',renderAll);document.getElementById('questTypeFilter')?.addEventListener('change',renderAll);document.getElementById('questSearch')?.addEventListener('input',renderAll);document.getElementById('diaryFilter')?.addEventListener('change',renderAll);document.getElementById('nextBtn').addEventListener('click',()=>jumpNext(false));document.getElementById('completeNextBtn').addEventListener('click',()=>jumpNext(true));document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Reset all progress for this tracker?')){state.done={};state.playerDone={};state.diaryDone={};state.diarySteps={};saveState();renderAll();}});document.getElementById('discordTestBtn')?.addEventListener('click',testDiscord);document.getElementById('importBtn')?.addEventListener('click',()=>document.getElementById('importFile')?.click());document.getElementById('importFile')?.addEventListener('change',e=>importSaveFile(e.target.files&&e.target.files[0]));document.getElementById('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hcim-tracker-save.json';a.click();URL.revokeObjectURL(a.href);});['calcSkill','calcMethod','calcCurrent','calcTarget','calcCurrentXp'].forEach(id=>document.getElementById(id).addEventListener('input',renderCalc));});
