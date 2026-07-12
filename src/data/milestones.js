export const milestones = [
  {
    id: "130_attack_strength",
    name: "Reach 130 Combined Attack and Strength",
    stage: "Mid Game",
    category: "Combat",
    priority: 80,
    estimatedMinutes: 180,
    optional: false,
    groupRecommended: true,
    wiki: "https://oldschool.runescape.wiki/w/Warriors%27_Guild",
    requires: [],
    unlocks: ["warriors_guild"]
  },
  {
    id: "warriors_guild",
    name: "Enter the Warriors' Guild",
    stage: "Mid Game",
    category: "Combat",
    priority: 90,
    estimatedMinutes: 5,
    optional: false,
    groupRecommended: true,
    wiki: "https://oldschool.runescape.wiki/w/Warriors%27_Guild",
    requires: ["130_attack_strength"],
    unlocks: ["dragon_defender"]
  },
  {
    id: "dragon_defender",
    name: "Obtain a Dragon Defender",
    stage: "Mid Game",
    category: "Combat",
    priority: 100,
    estimatedMinutes: 60,
    optional: false,
    groupRecommended: true,
    wiki: "https://oldschool.runescape.wiki/w/Dragon_defender",
    requires: ["warriors_guild"],
    unlocks: ["slayer_efficiency"]
  }
];