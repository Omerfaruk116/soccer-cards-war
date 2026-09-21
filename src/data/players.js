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
    positions: [
      "CB",
      "LB",
      "RB",
      "LWB",
      "RWB",
    ],
    minimumSquad: 4,
  },

  midfield: {
    id: "midfield",
    name: "ORTA SAHA",
    shortName: "OS",
    positions: [
      "CDM",
      "CM",
      "CAM",
      "LM",
      "RM",
    ],
    minimumSquad: 3,
  },

  forward: {
    id: "forward",
    name: "FORVET",
    shortName: "FVT",
    positions: [
      "LW",
      "RW",
      "CF",
      "ST",
    ],
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

export const rentalCenterConfig = {
  unlockPrice: 1000,
  maxHours: 8,

  slotPrices: [
    200,
    500,
    1000,
    2000,
    5000,
  ],

  maxSlots: 5,
};

export const careerLeagues = [
  {
    name: "Mahalle Ligi",
    min: 10,
    max: 30,
    matches: 10,
  },

  {
    name: "Amatör Lig",
    min: 25,
    max: 40,
    matches: 10,
  },

  {
    name: "Bölgesel Lig",
    min: 35,
    max: 50,
    matches: 10,
  },

  {
    name: "Şehir Ligi",
    min: 45,
    max: 60,
    matches: 10,
  },

  {
    name: "Profesyonel Lig",
    min: 55,
    max: 70,
    matches: 10,
  },

  {
    name: "Ulusal Lig",
    min: 65,
    max: 80,
    matches: 10,
  },

  {
    name: "Şampiyonlar Ligi",
    min: 78,
    max: 92,
    matches: 10,
  },

  {
    name: "Efsaneler Ligi",
    min: 90,
    max: 99,
    matches: 10,
  },
];

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

    currencyName:
      "Street Coin",

    currencyIcon: "🟠",

    unlockCap: 40,

    shopLevels: [
      14,
      18,
      22,
      26,
      30,
    ],

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

    currencyName:
      "Turf Coin",

    currencyIcon: "🟢",

    unlockCap: 50,

    shopLevels: [
      28,
      32,
      35,
      38,
      40,
    ],

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

    currencyName:
      "City Coin",

    currencyIcon: "🔵",

    unlockCap: 60,

    shopLevels: [
      38,
      42,
      45,
      48,
      50,
    ],

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

    currencyName:
      "Stadium Coin",

    currencyIcon: "🟣",

    unlockCap: 70,

    shopLevels: [
      48,
      52,
      55,
      58,
      60,
    ],

    rewardBase: 165,
    rewardStep: 28,
  },

  {
    id: "pro",
    stage: 5,
    name:
      "Profesyonel Arena",

    icon: "🥈",
    matches: 35,

    min: 55,
    max: 70,
    playCap: 70,

    currencyName:
      "Pro Coin",

    currencyIcon: "⚪",

    unlockCap: 80,

    shopLevels: [
      58,
      62,
      65,
      68,
      70,
    ],

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

    currencyName:
      "National Coin",

    currencyIcon: "🟡",

    unlockCap: 85,

    shopLevels: [
      68,
      72,
      75,
      78,
      80,
    ],

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

    currencyName:
      "Euro Coin",

    currencyIcon: "🔷",

    unlockCap: 90,

    shopLevels: [
      75,
      78,
      81,
      84,
      86,
    ],

    rewardBase: 300,
    rewardStep: 38,
  },

  {
    id: "champions",
    stage: 8,
    name:
      "Şampiyonlar Ligi",

    icon: "⭐",
    matches: 40,

    min: 80,
    max: 92,
    playCap: 90,

    currencyName:
      "Champions Coin",

    currencyIcon: "✨",

    unlockCap: 95,

    shopLevels: [
      82,
      85,
      88,
      90,
      92,
    ],

    rewardBase: 360,
    rewardStep: 42,
  },

  {
    id: "world",
    stage: 9,
    name:
      "Dünya Şampiyonası",

    icon: "🌐",
    matches: 45,

    min: 88,
    max: 96,
    playCap: 95,

    currencyName:
      "World Coin",

    currencyIcon: "🌟",

    unlockCap: 98,

    shopLevels: [
      89,
      91,
      93,
      95,
      96,
    ],

    rewardBase: 430,
    rewardStep: 46,
  },

  {
    id: "legends",
    stage: 10,
    name:
      "Efsaneler Arenası",

    icon: "👑",
    matches: 50,

    min: 93,
    max: 99,
    playCap: 99,

    currencyName:
      "Legend Coin",

    currencyIcon: "🔥",

    unlockCap: 99,

    shopLevels: [
      94,
      95,
      96,
      98,
      99,
    ],

    rewardBase: 520,
    rewardStep: 50,
  },
];

export const stageRewards = [
  {
    stage: 1,
    name: "Emir Kaya",
    country: "TR",
    position: "ST",
    overall: 30,
  },

  {
    stage: 2,
    name: "Diego Santos",
    country: "BR",
    position: "RW",
    overall: 40,
  },

  {
    stage: 3,
    name: "Luca Romano",
    country: "IT",
    position: "CM",
    overall: 50,
  },

  {
    stage: 4,
    name: "Mateo Alvarez",
    country: "ES",
    position: "CB",
    overall: 60,
  },

  {
    stage: 5,
    name:
      "Karim El Mansouri",

    country: "MA",
    position: "CAM",
    overall: 70,
  },

  {
    stage: 6,
    name: "Antoine Moreau",
    country: "FR",
    position: "CDM",
    overall: 80,
  },

  {
    stage: 7,
    name: "Rafael Costa",
    country: "PT",
    position: "LW",
    overall: 85,
  },

  {
    stage: 8,
    name: "Julian Becker",
    country: "DE",
    position: "CB",
    overall: 90,
  },

  {
    stage: 9,
    name:
      "Thiago Ferreira",

    country: "BR",
    position: "ST",
    overall: 95,
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

export function makeId() {
  if (
    typeof crypto !==
      "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function randomBetween(
  min,
  max
) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1)
    ) + min
  );
}

export function randomItem(
  array
) {
  return array[
    Math.floor(
      Math.random() *
        array.length
    )
  ];
}

export function shuffle(
  array
) {
  const result = [
    ...array,
  ];

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
    ) || countries[0]
  );
}

export function getCountryFlag(
  countryCode
) {
  return getCountry(
    countryCode
  ).flag;
}

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

    name:
      name.trim(),

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

export function generateOpponentDeck(
  targetOverall,
  count = 10
) {
  const min =
    Math.max(
      5,
      targetOverall - 3
    );

  const max =
    Math.min(
      99,
      targetOverall + 3
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
    ([group, minimum]) => {
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
          0) < minimum
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
      missing.length === 0,

    totals,

    missing,
  };
}