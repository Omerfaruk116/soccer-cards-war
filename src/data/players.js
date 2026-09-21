export const rarityNames = {
  common: "SIRADAN",
  rare: "NADİR",
  gold: "ALTIN",
  platinum: "PLATİN",
  epic: "EPİK",
  legendary: "EFSANEVİ",
  icon: "İKON",
  elturco: "EL TURCO",
};

export const positions = [
  "GK",
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "CDM",
  "CM",
  "CAM",
  "LM",
  "RM",
  "LW",
  "RW",
  "CF",
  "ST",
];

export const positionGroups = {
  goalkeeper: {
    id: "goalkeeper",
    name: "KALECİ",
    shortName: "KL",
    positions: ["GK"],
    minimumSquad: 1,
  },

  defense: {
    id: "defense",
    name: "DEFANS",
    shortName: "DEF",
    positions: ["CB", "LB", "RB", "LWB", "RWB"],
    minimumSquad: 4,
  },

  midfield: {
    id: "midfield",
    name: "ORTA SAHA",
    shortName: "OS",
    positions: ["CDM", "CM", "CAM", "LM", "RM"],
    minimumSquad: 3,
  },

  forward: {
    id: "forward",
    name: "FORVET",
    shortName: "FVT",
    positions: ["LW", "RW", "CF", "ST"],
    minimumSquad: 2,
  },
};

export const squadRequirements = {
  goalkeeper: 1,
  defense: 4,
  midfield: 3,
  forward: 2,
  total: 10,
  careerMinimumActivePlayers: 11,
};

/* =========================================================
   ANTRENMAN
========================================================= */

export const trainingPlans = [
  {
    id: "basic",
    title: "Temel Antrenman",
    duration: "1 Saat",
    hours: 1,
    gain: 1,
    baseCost: 180,
    packType: "gen1",
  },

  {
    id: "intense",
    title: "Yoğun Antrenman",
    duration: "3 Saat",
    hours: 3,
    gain: 2,
    baseCost: 420,
    packType: "gen2",
  },

  {
    id: "camp",
    title: "Gelişim Kampı",
    duration: "8 Saat",
    hours: 8,
    gain: 4,
    baseCost: 950,
    packType: "gen4",
  },
];

export const upgradePackTypes = {
  gen1: {
    id: "gen1",
    name: "+1 GEN Paketi",
    gain: 1,
    icon: "📦",
  },

  gen2: {
    id: "gen2",
    name: "+2 GEN Paketi",
    gain: 2,
    icon: "📦",
  },

  gen4: {
    id: "gen4",
    name: "+4 GEN Paketi",
    gain: 4,
    icon: "🎁",
  },
};

export const coachConfigs = [
  {
    stars: 1,
    name: "Yerel Antrenör",
    slots: 1,
    minutes: 120,
    price: 2500,
  },

  {
    stars: 2,
    name: "Kulüp Antrenörü",
    slots: 2,
    minutes: 120,
    price: 6500,
  },

  {
    stars: 3,
    name: "Profesyonel Antrenör",
    slots: 3,
    minutes: 90,
    price: 15000,
  },

  {
    stars: 4,
    name: "Elit Antrenör",
    slots: 4,
    minutes: 75,
    price: 35000,
  },

  {
    stars: 5,
    name: "Dünya Klası Antrenör",
    slots: 5,
    minutes: 60,
    price: 80000,
  },
];

/* =========================================================
   KİRALIK MERKEZİ
========================================================= */

export const rentalCenterConfig = {
  unlockPrice: 1000,
  maxHours: 8,
  slotPrices: [200, 500, 1000, 2000, 5000],
  maxSlots: 5,
};

/* =========================================================
   KARİYER
========================================================= */

export const careerLeagues = [
  {
    stage: 1,
    name: "Mahalle Ligi",
    min: 10,
    max: 30,
    playCap: 30,
    matches: 10,
  },

  {
    stage: 2,
    name: "Amatör Lig",
    min: 25,
    max: 40,
    playCap: 40,
    matches: 10,
  },

  {
    stage: 3,
    name: "Bölgesel Lig",
    min: 35,
    max: 50,
    playCap: 50,
    matches: 10,
  },

  {
    stage: 4,
    name: "Şehir Ligi",
    min: 45,
    max: 60,
    playCap: 60,
    matches: 10,
  },

  {
    stage: 5,
    name: "Profesyonel Lig",
    min: 55,
    max: 70,
    playCap: 70,
    matches: 10,
  },

  {
    stage: 6,
    name: "Ulusal Lig",
    min: 65,
    max: 80,
    playCap: 80,
    matches: 10,
  },

  {
    stage: 7,
    name: "Avrupa Arenası",
    min: 72,
    max: 85,
    playCap: 85,
    matches: 10,
  },

  {
    stage: 8,
    name: "Şampiyonlar Arenası",
    min: 80,
    max: 90,
    playCap: 90,
    matches: 10,
  },

  {
    stage: 9,
    name: "Dünya Ligi",
    min: 88,
    max: 95,
    playCap: 95,
    matches: 10,
  },

  {
    stage: 10,
    name: "Efsaneler Ligi",
    min: 93,
    max: 99,
    playCap: 99,
    matches: 10,
  },
];

/*
  Gerçek kulüplerden esinlenilmiştir fakat
  isimler ve armalar Soccer Cards War evrenine aittir.
*/

export const careerOpponentClubs = {
  1: [
    { name: "Clifton Town", short: "CLT", crest: "CT", primary: "#315f47", secondary: "#e8e8e8" },
    { name: "Newark Street FC", short: "NSF", crest: "NS", primary: "#7d3333", secondary: "#f0d5a2" },
    { name: "Paterson Athletic", short: "PAT", crest: "PA", primary: "#263b63", secondary: "#ffffff" },
    { name: "Passaic United", short: "PAS", crest: "PU", primary: "#653455", secondary: "#ffffff" },
    { name: "Hudson Rovers", short: "HUD", crest: "HR", primary: "#24536a", secondary: "#d9c77d" },
    { name: "Garden State FC", short: "GSF", crest: "GS", primary: "#2a664c", secondary: "#f1f1f1" },
    { name: "Liberty Eleven", short: "LIB", crest: "LE", primary: "#70452d", secondary: "#f1d8b0" },
    { name: "River Park FC", short: "RPF", crest: "RP", primary: "#4d5978", secondary: "#d7dde8" },
    { name: "North Jersey Boys", short: "NJB", crest: "NJ", primary: "#6a2b3d", secondary: "#e9c767" },
    { name: "Blue Bridge FC", short: "BBF", crest: "BB", primary: "#1d4f91", secondary: "#e8edf4" },
  ],

  2: [
    { name: "Istanbul Lions", short: "ISL", crest: "IL", primary: "#b42028", secondary: "#e9b84e" },
    { name: "Kadikoy Canaries", short: "KDC", crest: "KC", primary: "#173a70", secondary: "#f0d94d" },
    { name: "Bosphorus Eagles", short: "BSE", crest: "BE", primary: "#151515", secondary: "#ededed" },
    { name: "Trabzon Storm", short: "TRS", crest: "TS", primary: "#6d1f37", secondary: "#5ca3c7" },
    { name: "Ankara Republic", short: "ANK", crest: "AR", primary: "#8a2424", secondary: "#efcf70" },
    { name: "Izmir Coast", short: "IZC", crest: "IC", primary: "#213b66", secondary: "#d4d7db" },
    { name: "Bursa Green", short: "BUG", crest: "BG", primary: "#23784a", secondary: "#ffffff" },
    { name: "Adana Thunder", short: "ADT", crest: "AT", primary: "#173d72", secondary: "#70b6df" },
    { name: "Konya Crescent", short: "KNC", crest: "KC", primary: "#287557", secondary: "#f0f0f0" },
    { name: "Samsun Red", short: "SMR", crest: "SR", primary: "#a1222e", secondary: "#171717" },
  ],

  3: [
    { name: "Athens Olympus", short: "ATH", crest: "AO", primary: "#24598c", secondary: "#f0d464" },
    { name: "Sofia Crown", short: "SOF", crest: "SC", primary: "#b13232", secondary: "#ffffff" },
    { name: "Belgrade Stars", short: "BEL", crest: "BS", primary: "#9f252b", secondary: "#f0f0f0" },
    { name: "Zagreb Blue", short: "ZAG", crest: "ZB", primary: "#245395", secondary: "#eaeaea" },
    { name: "Bucharest Wolves", short: "BUC", crest: "BW", primary: "#263454", secondary: "#d9b35b" },
    { name: "Prague Sparta", short: "PRS", crest: "PS", primary: "#8b2929", secondary: "#e0c287" },
    { name: "Warsaw Eagles", short: "WAR", crest: "WE", primary: "#c1c1c1", secondary: "#28714e" },
    { name: "Budapest Royals", short: "BUD", crest: "BR", primary: "#6e2948", secondary: "#d9c26c" },
    { name: "Vienna Imperial", short: "VIE", crest: "VI", primary: "#8c2430", secondary: "#f5f5f5" },
    { name: "Bratislava Knights", short: "BRA", crest: "BK", primary: "#25497b", secondary: "#d8d8d8" },
  ],

  4: [
    { name: "Amsterdam Oranje", short: "AMO", crest: "AO", primary: "#d85c28", secondary: "#f3f3f3" },
    { name: "Lisbon Eagles", short: "LIE", crest: "LE", primary: "#a9212c", secondary: "#e1c063" },
    { name: "Porto Dragons", short: "POD", crest: "PD", primary: "#24519a", secondary: "#eeeeee" },
    { name: "Brussels Union", short: "BRU", crest: "BU", primary: "#b79234", secondary: "#283e65" },
    { name: "Copenhagen North", short: "CPH", crest: "CN", primary: "#285b82", secondary: "#eeeeee" },
    { name: "Stockholm Vikings", short: "STO", crest: "SV", primary: "#293b75", secondary: "#e0bb45" },
    { name: "Oslo Fjord", short: "OSL", crest: "OF", primary: "#284f72", secondary: "#d8dce2" },
    { name: "Helsinki Frost", short: "HEL", crest: "HF", primary: "#cadde7", secondary: "#264f80" },
    { name: "Dublin Clover", short: "DUB", crest: "DC", primary: "#26724c", secondary: "#e9e9e9" },
    { name: "Glasgow Thistle", short: "GLA", crest: "GT", primary: "#2b5d48", secondary: "#d5bd65" },
  ],

  5: [
    { name: "Milano Rosso", short: "MIR", crest: "MR", primary: "#9d2027", secondary: "#191919" },
    { name: "Milano Nerazzur", short: "MIN", crest: "MN", primary: "#163e79", secondary: "#161616" },
    { name: "Turin Zebras", short: "TUZ", crest: "TZ", primary: "#171717", secondary: "#eeeeee" },
    { name: "Napoli Azure", short: "NAP", crest: "NA", primary: "#4b9bd4", secondary: "#eeeeee" },
    { name: "Roma Empire", short: "ROM", crest: "RE", primary: "#7e2632", secondary: "#d8a943" },
    { name: "Lazio Sky", short: "LAZ", crest: "LS", primary: "#76a8d5", secondary: "#eeeeee" },
    { name: "Firenze Viola", short: "FIO", crest: "FV", primary: "#60408c", secondary: "#eeeeee" },
    { name: "Bergamo Blue", short: "BER", crest: "BB", primary: "#254b7d", secondary: "#181818" },
    { name: "Bologna Redblue", short: "BOL", crest: "BR", primary: "#8e2830", secondary: "#24436f" },
    { name: "Torino Bulls", short: "TOR", crest: "TB", primary: "#6c2631", secondary: "#e9e9e9" },
  ],

  6: [
    { name: "Manchester Red", short: "MNR", crest: "MR", primary: "#a91f2c", secondary: "#d6b861" },
    { name: "Manchester Sky", short: "MNS", crest: "MS", primary: "#70a8d2", secondary: "#f0f0f0" },
    { name: "Mersey Reds", short: "MER", crest: "MR", primary: "#a71e28", secondary: "#e7d0a4" },
    { name: "London Blues", short: "LOB", crest: "LB", primary: "#214b8a", secondary: "#eeeeee" },
    { name: "North London Lily", short: "NLL", crest: "NL", primary: "#eeeeee", secondary: "#23456d" },
    { name: "London Cannons", short: "LOC", crest: "LC", primary: "#b5232e", secondary: "#eeeeee" },
    { name: "Newcastle Magpies", short: "NEW", crest: "NM", primary: "#171717", secondary: "#eaeaea" },
    { name: "Birmingham Villans", short: "BIV", crest: "BV", primary: "#6b2942", secondary: "#7db2cd" },
    { name: "Brighton Seagulls", short: "BRI", crest: "BS", primary: "#2c6cad", secondary: "#eeeeee" },
    { name: "West London Bees", short: "WLB", crest: "WB", primary: "#bb3333", secondary: "#eeeeee" },
  ],

  7: [
    { name: "Bavaria München", short: "BAV", crest: "BM", primary: "#a72131", secondary: "#285c9b" },
    { name: "Dortmund Bees", short: "DOB", crest: "DB", primary: "#e1c92e", secondary: "#171717" },
    { name: "Leipzig Bulls", short: "LEI", crest: "LB", primary: "#eeeeee", secondary: "#ba2938" },
    { name: "Leverkusen Werk", short: "LEV", crest: "LW", primary: "#9d242d", secondary: "#191919" },
    { name: "Frankfurt Eagles", short: "FRA", crest: "FE", primary: "#b52b35", secondary: "#181818" },
    { name: "Stuttgart Reds", short: "STU", crest: "SR", primary: "#d5d5d5", secondary: "#ab2931" },
    { name: "Hamburg Towers", short: "HAM", crest: "HT", primary: "#285688", secondary: "#eeeeee" },
    { name: "Berlin Union", short: "BEU", crest: "BU", primary: "#a6222b", secondary: "#d8bd66" },
    { name: "Bremen Green", short: "BRE", crest: "BG", primary: "#287153", secondary: "#eeeeee" },
    { name: "Gladbach Foals", short: "GLA", crest: "GF", primary: "#171717", secondary: "#eeeeee" },
  ],

  8: [
    { name: "Paris Royale", short: "PAR", crest: "PR", primary: "#173c70", secondary: "#bd2b38" },
    { name: "Madrid Crown", short: "MDC", crest: "MC", primary: "#ededed", secondary: "#d4b957" },
    { name: "Catalonia Blau", short: "CAT", crest: "CB", primary: "#293f80", secondary: "#9f2637" },
    { name: "Madrid Rojos", short: "MDR", crest: "MR", primary: "#b52b39", secondary: "#ededed" },
    { name: "Sevilla Flame", short: "SEV", crest: "SF", primary: "#b72931", secondary: "#eeeeee" },
    { name: "San Sebastian Blue", short: "SSB", crest: "SB", primary: "#367ab2", secondary: "#eeeeee" },
    { name: "Bilbao Lions", short: "BIL", crest: "BL", primary: "#aa2931", secondary: "#eeeeee" },
    { name: "Valencia Bats", short: "VAL", crest: "VB", primary: "#222222", secondary: "#e1a844" },
    { name: "Villarreal Submarines", short: "VIL", crest: "VS", primary: "#dac740", secondary: "#28568b" },
    { name: "Girona Redwhite", short: "GIR", crest: "GR", primary: "#b02d35", secondary: "#eeeeee" },
  ],

  9: [
    { name: "Rio Cariocas", short: "RIO", crest: "RC", primary: "#b62d35", secondary: "#171717" },
    { name: "Sao Paulo Saints", short: "SPS", crest: "SS", primary: "#ededed", secondary: "#a4232e" },
    { name: "Buenos Aires Azul", short: "BAA", crest: "BA", primary: "#254e8c", secondary: "#e0bd52" },
    { name: "Buenos Aires Millonarios", short: "BAM", crest: "BM", primary: "#eeeeee", secondary: "#b62b35" },
    { name: "Montevideo Celeste", short: "MON", crest: "MC", primary: "#70a7d2", secondary: "#eeeeee" },
    { name: "Mexico Aguilas", short: "MEX", crest: "MA", primary: "#d2b12f", secondary: "#203c6a" },
    { name: "Los Angeles Stars", short: "LAS", crest: "LS", primary: "#d1b451", secondary: "#252525" },
    { name: "Miami Flamingos", short: "MIA", crest: "MF", primary: "#dc7193", secondary: "#1c4e59" },
    { name: "Tokyo Shogun", short: "TOK", crest: "TS", primary: "#b72736", secondary: "#eeeeee" },
    { name: "Seoul Tigers", short: "SEO", crest: "ST", primary: "#b82c35", secondary: "#263e72" },
  ],

  10: [
    { name: "World Legends XI", short: "WLX", crest: "WL", primary: "#c59e3b", secondary: "#171717" },
    { name: "Royal Icons", short: "ROI", crest: "RI", primary: "#e3d39d", secondary: "#262626" },
    { name: "Golden Generation", short: "GOG", crest: "GG", primary: "#c99f3a", secondary: "#eeeeee" },
    { name: "Eternal Eleven", short: "ETE", crest: "EE", primary: "#7c5cab", secondary: "#d8c170" },
    { name: "Hall of Fame FC", short: "HOF", crest: "HF", primary: "#eeeeee", secondary: "#c09b3a" },
    { name: "Immortals United", short: "IMU", crest: "IU", primary: "#902d38", secondary: "#d9ba55" },
    { name: "Century Stars", short: "CES", crest: "CS", primary: "#254b7e", secondary: "#d5b450" },
    { name: "Kings of Football", short: "KOF", crest: "KF", primary: "#492d67", secondary: "#d6b85e" },
    { name: "Ultimate XI", short: "ULX", crest: "UX", primary: "#171717", secondary: "#d4aa3d" },
    { name: "Final Boss FC", short: "FBF", crest: "FB", primary: "#81232b", secondary: "#d4a743" },
  ],
};

/* =========================================================
   ETKİNLİKLER
========================================================= */

export const eventConfigs = [
  {
    id: "street",
    stage: 1,
    name: "Sokak Futbolu",
    icon: "🏚️",
    matches: 25,
    min: 10,
    max: 30,
    playCap: 30,
    currencyName: "Street Coin",
    currencyIcon: "🟠",
    unlockCap: 40,
    shopLevels: [14, 18, 22, 26, 30],
    rewardBase: 70,
    rewardStep: 18,
  },

  {
    id: "turf",
    stage: 2,
    name: "Halı Saha",
    icon: "⚽",
    matches: 25,
    min: 25,
    max: 40,
    playCap: 40,
    currencyName: "Turf Coin",
    currencyIcon: "🟢",
    unlockCap: 50,
    shopLevels: [28, 32, 35, 38, 40],
    rewardBase: 100,
    rewardStep: 22,
  },

  {
    id: "city",
    stage: 3,
    name: "Şehir Kupası",
    icon: "🌆",
    matches: 30,
    min: 35,
    max: 50,
    playCap: 50,
    currencyName: "City Coin",
    currencyIcon: "🔵",
    unlockCap: 60,
    shopLevels: [38, 42, 45, 48, 50],
    rewardBase: 130,
    rewardStep: 25,
  },

  {
    id: "stadium",
    stage: 4,
    name: "Amatör Stadyum",
    icon: "🏟️",
    matches: 30,
    min: 45,
    max: 60,
    playCap: 60,
    currencyName: "Stadium Coin",
    currencyIcon: "🟣",
    unlockCap: 70,
    shopLevels: [48, 52, 55, 58, 60],
    rewardBase: 165,
    rewardStep: 28,
  },

  {
    id: "pro",
    stage: 5,
    name: "Profesyonel Arena",
    icon: "🥈",
    matches: 35,
    min: 55,
    max: 70,
    playCap: 70,
    currencyName: "Pro Coin",
    currencyIcon: "⚪",
    unlockCap: 80,
    shopLevels: [58, 62, 65, 68, 70],
    rewardBase: 205,
    rewardStep: 31,
  },

  {
    id: "national",
    stage: 6,
    name: "Ulusal Kupa",
    icon: "🏆",
    matches: 35,
    min: 65,
    max: 80,
    playCap: 80,
    currencyName: "National Coin",
    currencyIcon: "🟡",
    unlockCap: 85,
    shopLevels: [68, 72, 75, 78, 80],
    rewardBase: 250,
    rewardStep: 35,
  },

  {
    id: "europe",
    stage: 7,
    name: "Avrupa Arenası",
    icon: "🌍",
    matches: 40,
    min: 72,
    max: 86,
    playCap: 85,
    currencyName: "Euro Coin",
    currencyIcon: "🔷",
    unlockCap: 90,
    shopLevels: [75, 78, 81, 84, 86],
    rewardBase: 300,
    rewardStep: 38,
  },

  {
    id: "champions",
    stage: 8,
    name: "Şampiyonlar Ligi",
    icon: "⭐",
    matches: 40,
    min: 80,
    max: 92,
    playCap: 90,
    currencyName: "Champions Coin",
    currencyIcon: "✨",
    unlockCap: 95,
    shopLevels: [82, 85, 88, 90, 92],
    rewardBase: 360,
    rewardStep: 42,
  },

  {
    id: "world",
    stage: 9,
    name: "Dünya Şampiyonası",
    icon: "🌐",
    matches: 45,
    min: 88,
    max: 96,
    playCap: 95,
    currencyName: "World Coin",
    currencyIcon: "🌟",
    unlockCap: 99,
    shopLevels: [89, 91, 93, 95, 96],
    rewardBase: 430,
    rewardStep: 46,
  },

  {
    id: "legends",
    stage: 10,
    name: "Efsaneler Arenası",
    icon: "👑",
    matches: 50,
    min: 93,
    max: 99,
    playCap: 99,
    currencyName: "Legend Coin",
    currencyIcon: "🔥",
    unlockCap: 99,
    shopLevels: [94, 95, 96, 98, 99],
    rewardBase: 520,
    rewardStep: 50,
  },
];

/* =========================================================
   AŞAMA ÖZEL ÖDÜLLERİ

   Her ödül bir sonraki aşamada kullanılabilecek güçtedir.
========================================================= */

export const stageRewards = [
  {
    stage: 1,
    name: "Emir Kaya",
    country: "TR",
    position: "ST",
    overall: 40,
  },

  {
    stage: 2,
    name: "Diego Santos",
    country: "BR",
    position: "RW",
    overall: 50,
  },

  {
    stage: 3,
    name: "Luca Romano",
    country: "IT",
    position: "CM",
    overall: 60,
  },

  {
    stage: 4,
    name: "Mateo Alvarez",
    country: "ES",
    position: "CB",
    overall: 70,
  },

  {
    stage: 5,
    name: "Karim El Mansouri",
    country: "MA",
    position: "CAM",
    overall: 80,
  },

  {
    stage: 6,
    name: "Antoine Moreau",
    country: "FR",
    position: "CDM",
    overall: 85,
  },

  {
    stage: 7,
    name: "Rafael Costa",
    country: "PT",
    position: "LW",
    overall: 90,
  },

  {
    stage: 8,
    name: "Julian Becker",
    country: "DE",
    position: "CB",
    overall: 95,
  },

  {
    stage: 9,
    name: "Thiago Ferreira",
    country: "BR",
    position: "ST",
    overall: 99,
  },

  {
    stage: 10,
    name: "EL TURCO",
    country: "TR",
    position: "CAM",
    overall: 100,
    rarity: "elturco",
    unsellable: true,
  },
];

/* =========================================================
   ÜLKELER
========================================================= */

export const countries = [
  {
    code: "TR",
    name: "Türkiye",
    flag: "🇹🇷",
    firstNames: [
      "Arda",
      "Kerem",
      "Emir",
      "Mert",
      "Can",
      "Eren",
      "Yusuf",
      "Bora",
      "Kaan",
      "Yiğit",
    ],
    lastNames: [
      "Yılmaz",
      "Kaya",
      "Demir",
      "Şahin",
      "Çelik",
      "Acar",
      "Yıldız",
      "Öztürk",
      "Kılıç",
      "Arslan",
    ],
  },

  {
    code: "BR",
    name: "Brezilya",
    flag: "🇧🇷",
    firstNames: [
      "João",
      "Rafael",
      "Gabriel",
      "Lucas",
      "Thiago",
      "Matheus",
      "Bruno",
      "Diego",
    ],
    lastNames: [
      "Silva",
      "Santos",
      "Costa",
      "Oliveira",
      "Pereira",
      "Almeida",
      "Ferreira",
      "Souza",
    ],
  },

  {
    code: "AR",
    name: "Arjantin",
    flag: "🇦🇷",
    firstNames: [
      "Mateo",
      "Julián",
      "Nicolás",
      "Tomás",
      "Lautaro",
      "Franco",
      "Santiago",
      "Ángel",
    ],
    lastNames: [
      "Gómez",
      "Álvarez",
      "Romero",
      "Fernández",
      "Martínez",
      "Acosta",
      "Rojas",
      "Pérez",
    ],
  },

  {
    code: "FR",
    name: "Fransa",
    flag: "🇫🇷",
    firstNames: [
      "Antoine",
      "Hugo",
      "Lucas",
      "Theo",
      "Adrien",
      "Olivier",
      "Rayan",
      "Kylian",
    ],
    lastNames: [
      "Moreau",
      "Dubois",
      "Bernard",
      "Laurent",
      "Robert",
      "Petit",
      "Leroy",
      "Girard",
    ],
  },

  {
    code: "DE",
    name: "Almanya",
    flag: "🇩🇪",
    firstNames: [
      "Julian",
      "Leon",
      "Felix",
      "Lukas",
      "Jonas",
      "Florian",
      "Niklas",
      "Kai",
    ],
    lastNames: [
      "Becker",
      "Schmidt",
      "Wagner",
      "Hoffmann",
      "Fischer",
      "Weber",
      "Klein",
      "Neumann",
    ],
  },

  {
    code: "ES",
    name: "İspanya",
    flag: "🇪🇸",
    firstNames: [
      "Mateo",
      "Álvaro",
      "Sergio",
      "Dani",
      "Pablo",
      "Hugo",
      "Iker",
      "Marco",
    ],
    lastNames: [
      "Alvarez",
      "García",
      "Torres",
      "Navarro",
      "Moreno",
      "Vega",
      "Sanz",
      "Ramos",
    ],
  },

  {
    code: "PT",
    name: "Portekiz",
    flag: "🇵🇹",
    firstNames: [
      "Rafael",
      "Diogo",
      "Tiago",
      "João",
      "André",
      "Pedro",
      "Gonçalo",
      "Rúben",
    ],
    lastNames: [
      "Costa",
      "Silva",
      "Sousa",
      "Rocha",
      "Ferreira",
      "Dias",
      "Mendes",
      "Lopes",
    ],
  },

  {
    code: "GB",
    name: "İngiltere",
    flag: "🇬🇧",
    firstNames: [
      "Jack",
      "Harry",
      "James",
      "Oliver",
      "George",
      "Mason",
      "Ben",
      "Liam",
    ],
    lastNames: [
      "Smith",
      "Walker",
      "Wilson",
      "Taylor",
      "Brown",
      "Clark",
      "Baker",
      "Cooper",
    ],
  },

  {
    code: "IT",
    name: "İtalya",
    flag: "🇮🇹",
    firstNames: [
      "Luca",
      "Marco",
      "Matteo",
      "Lorenzo",
      "Andrea",
      "Davide",
      "Nicolo",
      "Fabio",
    ],
    lastNames: [
      "Romano",
      "Rossi",
      "Bianchi",
      "Conti",
      "Ricci",
      "Gallo",
      "Costa",
      "Ferrari",
    ],
  },

  {
    code: "NL",
    name: "Hollanda",
    flag: "🇳🇱",
    firstNames: [
      "Daan",
      "Luuk",
      "Jesse",
      "Sem",
      "Milan",
      "Noah",
      "Finn",
      "Teun",
    ],
    lastNames: [
      "De Jong",
      "Van Dijk",
      "Visser",
      "Smit",
      "Bakker",
      "Bos",
      "Vos",
      "Meijer",
    ],
  },

  {
    code: "HR",
    name: "Hırvatistan",
    flag: "🇭🇷",
    firstNames: [
      "Luka",
      "Ivan",
      "Mateo",
      "Ante",
      "Josip",
      "Marko",
      "Dario",
      "Nikola",
    ],
    lastNames: [
      "Kovac",
      "Horvat",
      "Maric",
      "Peric",
      "Babic",
      "Novak",
      "Juric",
      "Vukovic",
    ],
  },

  {
    code: "MA",
    name: "Fas",
    flag: "🇲🇦",
    firstNames: [
      "Karim",
      "Youssef",
      "Amine",
      "Hakim",
      "Sofiane",
      "Bilal",
      "Adil",
      "Rayan",
    ],
    lastNames: [
      "El Mansouri",
      "Amrabat",
      "Bennani",
      "Alaoui",
      "Idrissi",
      "Tahiri",
      "Berrada",
      "Naciri",
    ],
  },

  {
    code: "SN",
    name: "Senegal",
    flag: "🇸🇳",
    firstNames: [
      "Moussa",
      "Sadio",
      "Idrissa",
      "Cheikh",
      "Pape",
      "Ismaila",
      "Mamadou",
      "Abdou",
    ],
    lastNames: [
      "Diop",
      "Ndiaye",
      "Sarr",
      "Faye",
      "Ba",
      "Diallo",
      "Gueye",
      "Fall",
    ],
  },

  {
    code: "NG",
    name: "Nijerya",
    flag: "🇳🇬",
    firstNames: [
      "Victor",
      "Samuel",
      "Chinedu",
      "Kelechi",
      "Alex",
      "Ibrahim",
      "Emeka",
      "Moses",
    ],
    lastNames: [
      "Okafor",
      "Adebayo",
      "Iheanacho",
      "Musa",
      "Nwosu",
      "Balogun",
      "Eze",
      "Onuachu",
    ],
  },

  {
    code: "JP",
    name: "Japonya",
    flag: "🇯🇵",
    firstNames: [
      "Yuki",
      "Ren",
      "Haruto",
      "Kaito",
      "Riku",
      "Takumi",
      "Sota",
      "Daichi",
    ],
    lastNames: [
      "Sato",
      "Suzuki",
      "Tanaka",
      "Ito",
      "Watanabe",
      "Yamamoto",
      "Kobayashi",
      "Kato",
    ],
  },

  {
    code: "KR",
    name: "Güney Kore",
    flag: "🇰🇷",
    firstNames: [
      "Min-jun",
      "Ji-ho",
      "Hyun-woo",
      "Seo-jun",
      "Jun-ho",
      "Tae-min",
      "Jin-woo",
      "Sung-ho",
    ],
    lastNames: [
      "Kim",
      "Lee",
      "Park",
      "Choi",
      "Jung",
      "Kang",
      "Cho",
      "Yoon",
    ],
  },

  {
    code: "US",
    name: "ABD",
    flag: "🇺🇸",
    firstNames: [
      "Ethan",
      "Noah",
      "Liam",
      "Mason",
      "Logan",
      "Aiden",
      "Caleb",
      "Owen",
    ],
    lastNames: [
      "Johnson",
      "Williams",
      "Brown",
      "Miller",
      "Davis",
      "Moore",
      "Taylor",
      "Anderson",
    ],
  },

  {
    code: "MX",
    name: "Meksika",
    flag: "🇲🇽",
    firstNames: [
      "Santiago",
      "Diego",
      "Emiliano",
      "Mateo",
      "Luis",
      "Javier",
      "Carlos",
      "Raúl",
    ],
    lastNames: [
      "Hernández",
      "García",
      "Martínez",
      "López",
      "Ramírez",
      "Flores",
      "Reyes",
      "Cruz",
    ],
  },
];

/* =========================================================
   TEMEL YARDIMCILAR
========================================================= */

export function makeId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function randomBetween(min, max) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1)
    ) + min
  );
}

export function randomItem(array) {
  return array[
    Math.floor(
      Math.random() *
        array.length
    )
  ];
}

export function shuffle(array) {
  const result = [...array];

  for (
    let index =
      result.length - 1;
    index > 0;
    index -= 1
  ) {
    const other =
      Math.floor(
        Math.random() *
          (index + 1)
      );

    [
      result[index],
      result[other],
    ] = [
      result[other],
      result[index],
    ];
  }

  return result;
}

export function getPositionGroup(
  position
) {
  const entry =
    Object.values(
      positionGroups
    ).find((group) =>
      group.positions.includes(
        position
      )
    );

  return (
    entry?.id ||
    "midfield"
  );
}

export function getCountry(
  countryCode
) {
  return (
    countries.find(
      (country) =>
        country.code ===
        countryCode
    ) ||
    countries[0]
  );
}

export function getCountryFlag(
  countryCode
) {
  return getCountry(
    countryCode
  ).flag;
}

/* =========================================================
   NADİRLİK
========================================================= */

export function getRarity(
  overall
) {
  if (overall >= 100) {
    return "elturco";
  }

  if (overall >= 95) {
    return "icon";
  }

  if (overall >= 88) {
    return "legendary";
  }

  if (overall >= 75) {
    return "epic";
  }

  if (overall >= 60) {
    return "platinum";
  }

  if (overall >= 45) {
    return "gold";
  }

  if (overall >= 30) {
    return "rare";
  }

  return "common";
}

/* =========================================================
   FİYATLAR
========================================================= */

export function calculatePlayerPrice(
  overall
) {
  const base =
    180 +
    overall *
      overall *
      3.9 +
    Math.max(
      0,
      overall - 30
    ) *
      overall *
      2.1;

  return Math.max(
    250,
    Math.round(base)
  );
}

export function calculateEventPrice(
  overall,
  eventIndex = 0
) {
  const multiplier =
    1.25 +
    eventIndex * 0.08;

  return Math.max(
    200,
    Math.round(
      (70 +
        overall *
          overall *
          1.5) *
        multiplier
    )
  );
}

export function calculateTrainingCost(
  plan,
  overall
) {
  return Math.round(
    plan.baseCost +
      overall *
        plan.gain *
        10 +
      Math.max(
        0,
        overall - 30
      ) *
        plan.gain *
        5
  );
}

/*
  FULL ANTRENMAN

  - Oyuncuyu mevcut aşama sınırına kadar götürür.
  - Süre hiçbir zaman 24 saati geçmez.
  - Yüksek GEN seviyeleri daha pahalıdır.
*/

export function calculateFullTrainingPlan(
  currentOverall,
  cap
) {
  const start =
    Math.max(
      1,
      Number(
        currentOverall
      ) || 1
    );

  const maximum =
    Math.min(
      99,
      Math.max(
        start,
        Number(cap) ||
          start
      )
    );

  const gain =
    Math.max(
      0,
      maximum - start
    );

  if (!gain) {
    return {
      gain: 0,
      hours: 0,
      milliseconds: 0,
      cost: 0,
      targetOverall:
        maximum,
    };
  }

  /*
    Küçük gelişimler kısa;
    büyük gelişimler maksimum
    24 saate kadar çıkar.
  */

  const hours =
    Math.min(
      24,
      Math.max(
        1,
        Math.ceil(
          gain * 1.25
        )
      )
    );

  /*
    Her GEN yükseldikçe
    bir sonraki GEN daha pahalı.
  */

  let cost = 0;

  for (
    let level = start;
    level < maximum;
    level += 1
  ) {
    cost +=
      130 +
      level * 18;
  }

  return {
    gain,
    hours,
    milliseconds:
      hours *
      60 *
      60 *
      1000,
    cost: Math.round(cost),
    targetOverall:
      maximum,
  };
}

/* =========================================================
   KİRALIK GELİRİ
========================================================= */

export function calculateRentalEightHourIncome(
  overall
) {
  return Math.max(
    0,
    Math.round(
      overall * 80
    )
  );
}

export function calculateRentalIncome(
  overall,
  elapsedMilliseconds
) {
  const maxMilliseconds =
    rentalCenterConfig.maxHours *
    60 *
    60 *
    1000;

  const clampedTime =
    Math.max(
      0,
      Math.min(
        elapsedMilliseconds,
        maxMilliseconds
      )
    );

  return Math.floor(
    calculateRentalEightHourIncome(
      overall
    ) *
      (clampedTime /
        maxMilliseconds)
  );
}

/* =========================================================
   PAKET ÖDÜLLERİ
========================================================= */

export function getUpgradePackReward(
  matchNumber,
  totalMatches = 25
) {
  const match =
    Math.max(
      1,
      Number(
        matchNumber
      ) || 1
    );

  if (
    match ===
    totalMatches
  ) {
    return "gen4";
  }

  if (
    match % 10 ===
    0
  ) {
    return "gen4";
  }

  if (
    match % 5 ===
    0
  ) {
    return "gen2";
  }

  return "gen1";
}

/* =========================================================
   OYUNCU ÜRETİMİ
========================================================= */

export function generatePlayer(
  minOverall = 10,
  maxOverall = 30,
  extra = {}
) {
  const safeMax =
    Math.min(
      99,
      maxOverall
    );

  const safeMin =
    Math.min(
      safeMax,
      Math.max(
        1,
        minOverall
      )
    );

  const overall =
    randomBetween(
      safeMin,
      safeMax
    );

  const country =
    extra.country
      ? getCountry(
          extra.country
        )
      : randomItem(
          countries
        );

  const firstName =
    randomItem(
      country.firstNames
    );

  const lastName =
    randomItem(
      country.lastNames
    );

  const position =
    extra.position ||
    randomItem(
      positions
    );

  return {
    id: makeId(),
    name:
      extra.name ||
      `${firstName} ${lastName}`,
    position,
    positionGroup:
      getPositionGroup(
        position
      ),
    overall,
    rarity:
      getRarity(
        overall
      ),
    country:
      country.code,
    custom: false,
    sold: false,
    specialReward: false,
    unsellable: false,
    ...extra,
  };
}

export function generateStarterPlayers(
  count = 10
) {
  const requiredPositions = [
    "ST",
    "RW",

    "CM",
    "CAM",
    "CDM",

    "CB",
    "CB",
    "LB",
    "RB",

    "GK",
  ];

  const starters =
    requiredPositions.map(
      (position) =>
        generatePlayer(
          10,
          22,
          {
            position,
          }
        )
    );

  if (count <= 10) {
    return starters.slice(
      0,
      count
    );
  }

  return [
    ...starters,

    ...Array.from(
      {
        length:
          count - 10,
      },
      () =>
        generatePlayer(
          10,
          22
        )
    ),
  ];
}

/* =========================================================
   TRANSFER
========================================================= */

export function generateMarketPlayers(
  count = 6,
  cap = 25
) {
  const safeCap =
    Math.min(
      99,
      Math.max(
        10,
        cap
      )
    );

  const minimum =
    Math.max(
      10,
      safeCap - 15
    );

  return Array.from(
    {
      length: count,
    },
    () => {
      const player =
        generatePlayer(
          minimum,
          safeCap
        );

      return {
        ...player,
        price:
          calculatePlayerPrice(
            player.overall
          ),
      };
    }
  );
}

export function createCustomPlayer(
  name,
  position,
  countryCode = "TR"
) {
  const overall = 15;

  return {
    id: makeId(),
    name: name.trim(),
    position,
    positionGroup:
      getPositionGroup(
        position
      ),
    overall,
    rarity:
      getRarity(
        overall
      ),
    country:
      getCountry(
        countryCode
      ).code,
    custom: true,
    sold: false,
    specialReward: false,
    unsellable: false,
  };
}

/* =========================================================
   RAKİP ÜRETİMİ

   hardCap ile rakibin tek bir kartı bile
   aşama sınırını geçemez.
========================================================= */

export function generateOpponentDeck(
  targetOverall,
  count = 10,
  hardCap = 99
) {
  const cap =
    Math.min(
      99,
      Math.max(
        1,
        Number(
          hardCap
        ) || 99
      )
    );

  const target =
    Math.min(
      cap,
      Math.max(
        1,
        Number(
          targetOverall
        ) || 1
      )
    );

  const min =
    Math.max(
      5,
      Math.min(
        cap,
        target - 3
      )
    );

  const max =
    Math.max(
      min,
      Math.min(
        cap,
        target + 3
      )
    );

  const requiredPositions = [
    "ST",
    "RW",

    "CM",
    "CAM",
    "CDM",

    "CB",
    "CB",
    "LB",
    "RB",

    "GK",
  ];

  const base =
    requiredPositions.map(
      (position) =>
        generatePlayer(
          min,
          max,
          {
            position,
          }
        )
    );

  if (count <= 10) {
    return base.slice(
      0,
      count
    );
  }

  return [
    ...base,

    ...Array.from(
      {
        length:
          count - 10,
      },
      () =>
        generatePlayer(
          min,
          max
        )
    ),
  ];
}

/* =========================================================
   KARİYER RAKİBİ
========================================================= */

export function getCareerOpponent(
  stageNumber,
  matchNumber
) {
  const stage =
    Math.min(
      10,
      Math.max(
        1,
        Number(
          stageNumber
        ) || 1
      )
    );

  const opponents =
    careerOpponentClubs[
      stage
    ] ||
    careerOpponentClubs[1];

  const index =
    Math.min(
      opponents.length -
        1,
      Math.max(
        0,
        (Number(
          matchNumber
        ) || 1) - 1
      )
    );

  return opponents[
    index
  ];
}

export function getCareerLeague(
  stageNumber
) {
  const stage =
    Math.min(
      careerLeagues.length,
      Math.max(
        1,
        Number(
          stageNumber
        ) || 1
      )
    );

  return (
    careerLeagues[
      stage - 1
    ] ||
    careerLeagues[0]
  );
}

/* =========================================================
   ETKİNLİK MAĞAZASI / ÖDÜLLERİ
========================================================= */

export function generateEventShop(
  eventConfig,
  eventIndex = 0
) {
  return eventConfig.shopLevels.map(
    (overall) => {
      const player =
        generatePlayer(
          overall,
          overall
        );

      return {
        ...player,

        eventPrice:
          calculateEventPrice(
            overall,
            eventIndex
          ),
      };
    }
  );
}

export function generateRewardChoices(
  eventConfig,
  count = 3
) {
  return Array.from(
    {
      length: count,
    },
    () =>
      generatePlayer(
        eventConfig.min,
        Math.min(
          99,
          eventConfig.max
        )
      )
  );
}

/* =========================================================
   AŞAMA ÖDÜLÜ
========================================================= */

export function createStageRewardPlayer(
  stageNumber
) {
  const reward =
    stageRewards.find(
      (item) =>
        item.stage ===
        stageNumber
    );

  if (!reward) {
    return null;
  }

  return {
    id: makeId(),

    name:
      reward.name,

    position:
      reward.position,

    positionGroup:
      getPositionGroup(
        reward.position
      ),

    overall:
      reward.overall,

    rarity:
      reward.rarity ||
      getRarity(
        reward.overall
      ),

    country:
      reward.country,

    custom: false,
    sold: false,

    specialReward: true,

    stageReward:
      reward.stage,

    unsellable: true,
  };
}

export function getStageReward(
  stageNumber
) {
  return (
    stageRewards.find(
      (item) =>
        item.stage ===
        stageNumber
    ) || null
  );
}

/* =========================================================
   EVENT
========================================================= */

export function getEventConfig(
  eventId
) {
  return (
    eventConfigs.find(
      (event) =>
        event.id ===
        eventId
    ) ||
    eventConfigs[0]
  );
}

/* =========================================================
   KADRO KONTROLLERİ
========================================================= */

export function countPlayersByGroup(
  players = []
) {
  return players.reduce(
    (
      totals,
      player
    ) => {
      if (
        !player ||
        player.sold
      ) {
        return totals;
      }

      const group =
        player.positionGroup ||
        getPositionGroup(
          player.position
        );

      totals[group] =
        (totals[group] ||
          0) + 1;

      totals.total += 1;

      return totals;
    },
    {
      goalkeeper: 0,
      defense: 0,
      midfield: 0,
      forward: 0,
      total: 0,
    }
  );
}

export function validateTenPlayerCore(
  players = []
) {
  const totals =
    countPlayersByGroup(
      players
    );

  const missing = [];

  Object.entries(
    squadRequirements
  ).forEach(
    ([
      group,
      minimum,
    ]) => {
      if (
        group ===
          "total" ||
        group ===
          "careerMinimumActivePlayers"
      ) {
        return;
      }

      if (
        (totals[group] ||
          0) <
        minimum
      ) {
        missing.push({
          group,
          minimum,
          current:
            totals[group] ||
            0,

          name:
            positionGroups[
              group
            ]?.name ||
            group,
        });
      }
    }
  );

  return {
    valid:
      totals.total >=
        squadRequirements.total &&
      missing.length ===
        0,

    totals,
    missing,
  };
}