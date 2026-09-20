export const rarityNames = {
  common: "SIRADAN",
  rare: "NADİR",
  gold: "ALTIN",
  platinum: "PLATİN",
  epic: "EPİK",
  legendary: "EFSANEVİ",
  icon: "İKON",
};

export const positions = [
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LW",
  "RW",
  "ST",
];

export const trainingPlans = [
  {
    id: "basic",
    title: "Temel Antrenman",
    duration: "1 Saat",
    hours: 1,
    gain: 1,
    baseCost: 180,
  },
  {
    id: "intense",
    title: "Yoğun Antrenman",
    duration: "3 Saat",
    hours: 3,
    gain: 2,
    baseCost: 420,
  },
  {
    id: "camp",
    title: "Gelişim Kampı",
    duration: "8 Saat",
    hours: 8,
    gain: 4,
    baseCost: 950,
  },
];

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
    name: "Sokak Futbolu",
    icon: "🏚️",
    matches: 25,
    min: 10,
    max: 30,
    currencyName: "Street Coin",
    currencyIcon: "🟠",
    unlockCap: 40,
    shopLevels: [14, 18, 22, 26, 30],
    rewardBase: 70,
    rewardStep: 18,
  },
  {
    id: "turf",
    name: "Halı Saha",
    icon: "⚽",
    matches: 25,
    min: 25,
    max: 40,
    currencyName: "Turf Coin",
    currencyIcon: "🟢",
    unlockCap: 50,
    shopLevels: [28, 32, 35, 38, 40],
    rewardBase: 100,
    rewardStep: 22,
  },
  {
    id: "city",
    name: "Şehir Kupası",
    icon: "🌆",
    matches: 30,
    min: 35,
    max: 50,
    currencyName: "City Coin",
    currencyIcon: "🔵",
    unlockCap: 60,
    shopLevels: [38, 42, 45, 48, 50],
    rewardBase: 130,
    rewardStep: 25,
  },
  {
    id: "stadium",
    name: "Amatör Stadyum",
    icon: "🏟️",
    matches: 30,
    min: 45,
    max: 60,
    currencyName: "Stadium Coin",
    currencyIcon: "🟣",
    unlockCap: 70,
    shopLevels: [48, 52, 55, 58, 60],
    rewardBase: 165,
    rewardStep: 28,
  },
  {
    id: "pro",
    name: "Profesyonel Arena",
    icon: "🥈",
    matches: 35,
    min: 55,
    max: 70,
    currencyName: "Pro Coin",
    currencyIcon: "⚪",
    unlockCap: 80,
    shopLevels: [58, 62, 65, 68, 70],
    rewardBase: 205,
    rewardStep: 31,
  },
  {
    id: "national",
    name: "Ulusal Kupa",
    icon: "🏆",
    matches: 35,
    min: 65,
    max: 80,
    currencyName: "National Coin",
    currencyIcon: "🟡",
    unlockCap: 85,
    shopLevels: [68, 72, 75, 78, 80],
    rewardBase: 250,
    rewardStep: 35,
  },
  {
    id: "europe",
    name: "Avrupa Arenası",
    icon: "🌍",
    matches: 40,
    min: 72,
    max: 86,
    currencyName: "Euro Coin",
    currencyIcon: "🔷",
    unlockCap: 90,
    shopLevels: [75, 78, 81, 84, 86],
    rewardBase: 300,
    rewardStep: 38,
  },
  {
    id: "champions",
    name: "Şampiyonlar Ligi",
    icon: "⭐",
    matches: 40,
    min: 80,
    max: 92,
    currencyName: "Champions Coin",
    currencyIcon: "✨",
    unlockCap: 95,
    shopLevels: [82, 85, 88, 90, 92],
    rewardBase: 360,
    rewardStep: 42,
  },
  {
    id: "world",
    name: "Dünya Şampiyonası",
    icon: "🌐",
    matches: 45,
    min: 88,
    max: 96,
    currencyName: "World Coin",
    currencyIcon: "🌟",
    unlockCap: 98,
    shopLevels: [89, 91, 93, 95, 96],
    rewardBase: 430,
    rewardStep: 46,
  },
  {
    id: "legends",
    name: "Efsaneler Arenası",
    icon: "👑",
    matches: 50,
    min: 93,
    max: 99,
    currencyName: "Legend Coin",
    currencyIcon: "🔥",
    unlockCap: 99,
    shopLevels: [94, 95, 96, 98, 99],
    rewardBase: 520,
    rewardStep: 50,
  },
];

const firstNames = [
  "Arda",
  "Kerem",
  "Emir",
  "Mert",
  "Can",
  "Eren",
  "Yusuf",
  "Bora",
  "Deniz",
  "Kaan",
  "Baran",
  "Tuna",
  "Ozan",
  "Sarp",
  "Alp",
  "Altay",
  "Göktuğ",
  "Yiğit",
  "Berk",
  "Efe",
  "Mete",
  "Umut",
  "Oğuz",
  "Doruk",
  "Atlas",
  "Ayaz",
];

const lastNames = [
  "Yılmaz",
  "Kaya",
  "Demir",
  "Aslan",
  "Şahin",
  "Çelik",
  "Kartal",
  "Kurt",
  "Acar",
  "Koç",
  "Yıldız",
  "Akın",
  "Erdem",
  "Tekin",
  "Arslan",
  "Öztürk",
  "Güneş",
  "Kaplan",
  "Bulut",
  "Bozkurt",
  "Kılıç",
  "Sancak",
];

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

export function getRarity(
  overall
) {
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
  return Math.max(
    250,
    Math.round(
      150 +
        overall *
          overall *
          3.4
    )
  );
}

export function calculateEventPrice(
  overall,
  eventIndex = 0
) {
  const multiplier =
    1.25 +
    eventIndex *
      0.08;

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
        8
  );
}

export function generatePlayer(
  minOverall = 10,
  maxOverall = 30,
  extra = {}
) {
  const overall =
    randomBetween(
      minOverall,
      maxOverall
    );

  return {
    id: makeId(),

    name: `${randomItem(
      firstNames
    )} ${randomItem(
      lastNames
    )}`,

    position:
      randomItem(positions),

    overall,

    rarity:
      getRarity(overall),

    country: "TR",

    custom: false,

    ...extra,
  };
}

export function generateStarterPlayers(
  count = 10
) {
  return Array.from(
    { length: count },
    () =>
      generatePlayer(
        10,
        22
      )
  );
}

export function generateMarketPlayers(
  count = 6,
  cap = 30
) {
  const minimum =
    Math.max(
      10,
      cap - 18
    );

  return Array.from(
    { length: count },
    () => {
      const player =
        generatePlayer(
          minimum,
          cap
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
  position
) {
  const overall = 15;

  return {
    id: makeId(),

    name: name.trim(),

    position,

    overall,

    rarity:
      getRarity(overall),

    country: "TR",

    custom: true,
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

  return Array.from(
    { length: count },
    () =>
      generatePlayer(
        min,
        max
      )
  );
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

export function getEventConfig(
  eventId
) {
  return (
    eventConfigs.find(
      (event) =>
        event.id === eventId
    ) ||
    eventConfigs[0]
  );
}