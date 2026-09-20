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
];

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRarity(overall) {
  if (overall >= 95) return "icon";
  if (overall >= 88) return "legendary";
  if (overall >= 75) return "epic";
  if (overall >= 60) return "platinum";
  if (overall >= 45) return "gold";
  if (overall >= 30) return "rare";

  return "common";
}

export function calculatePlayerPrice(overall) {
  return Math.round(100 + overall * overall * 3);
}

export function calculateEventPrice(overall) {
  return Math.round(50 + overall * overall * 1.45);
}

export function generatePlayer(
  minOverall = 10,
  maxOverall = 30,
  extra = {}
) {
  const overall = randomBetween(minOverall, maxOverall);

  return {
    id: makeId(),
    name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    position: randomItem(positions),
    overall,
    rarity: getRarity(overall),
    country: "TR",
    custom: false,
    ...extra,
  };
}

export function generateStarterPlayers(count = 10) {
  return Array.from({ length: count }, () =>
    generatePlayer(10, 22)
  );
}

export function generateMarketPlayers(count = 6, cap = 30) {
  const minimum = Math.max(10, cap - 18);

  return Array.from({ length: count }, () => {
    const player = generatePlayer(minimum, cap);

    return {
      ...player,
      price: calculatePlayerPrice(player.overall),
    };
  });
}

export function createCustomPlayer(name, position) {
  const overall = 15;

  return {
    id: makeId(),
    name: name.trim(),
    position,
    overall,
    rarity: getRarity(overall),
    country: "TR",
    custom: true,
  };
}

export function generateStreetShop() {
  const levels = [14, 18, 22, 26, 30];

  return levels.map((overall) => {
    const player = generatePlayer(overall, overall);

    return {
      ...player,
      eventPrice: calculateEventPrice(overall),
    };
  });
}

export function generateOpponentDeck(targetOverall, count = 10) {
  const min = Math.max(5, targetOverall - 3);
  const max = Math.min(99, targetOverall + 3);

  return Array.from({ length: count }, () =>
    generatePlayer(min, max)
  );
}