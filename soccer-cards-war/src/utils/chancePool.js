import { generatePlayer } from "../data/players";

/* =========================================================
   ŞANS HAVUZU AYARLARI
========================================================= */

export const CHANCE_POOL_SIZE = 400;
export const CHANCE_DRAW_COST = 500;
export const CHANCE_LEVEL_COST = 10000;

export const CHANCE_POOL_DURATION_MS =
  3 * 24 * 60 * 60 * 1000;

/*
  TOPLAM 400 OYUNCU

  300 Sıradan
   85 Nadir
    5 Altın
    4 Platin
    3 Epik
    2 Efsanevi
    1 İkon
*/

export const CHANCE_POOL_COUNTS = {
  common: 300,
  rare: 85,
  gold: 5,
  platinum: 4,
  epic: 3,
  legendary: 2,
  icon: 1,
};

export const CHANCE_RARITY_ORDER = [
  "common",
  "rare",
  "gold",
  "platinum",
  "epic",
  "legendary",
  "icon",
];

export const CHANCE_RARITY_NAMES = {
  common: "SIRADAN",
  rare: "NADİR",
  gold: "ALTIN",
  platinum: "PLATİN",
  epic: "EPİK",
  legendary: "EFSANEVİ",
  icon: "İKON",
};

export const CHANCE_RARITY_ICONS = {
  common: "⚪",
  rare: "🔵",
  gold: "🟨",
  platinum: "💎",
  epic: "💜",
  legendary: "🔥",
  icon: "👑",
};

/* =========================================================
   GEN ARALIKLARI
========================================================= */

const RARITY_OVERALL_RANGES = {
  common: {
    min: 10,
    max: 29,
  },

  rare: {
    min: 30,
    max: 44,
  },

  gold: {
    min: 45,
    max: 59,
  },

  platinum: {
    min: 60,
    max: 74,
  },

  epic: {
    min: 75,
    max: 87,
  },

  legendary: {
    min: 88,
    max: 94,
  },

  icon: {
    min: 95,
    max: 99,
  },
};

/* =========================================================
   ID
========================================================= */

function createChancePoolId() {
  return `chance-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* =========================================================
   YENİ HAVUZ
========================================================= */

export function createChancePool(now = Date.now()) {
  return {
    id: createChancePoolId(),

    createdAt: now,

    resetsAt:
      now + CHANCE_POOL_DURATION_MS,

    totalSpent: 0,

    spentTowardsNextLevel: 0,

    chanceLevel: 0,

    totalDraws: 0,

    remaining: {
      ...CHANCE_POOL_COUNTS,
    },

    history: [],
  };
}

/* =========================================================
   SAVE NORMALİZASYONU
========================================================= */

export function normalizeChancePool(
  chancePool,
  now = Date.now()
) {
  if (
    !chancePool ||
    typeof chancePool !== "object"
  ) {
    return createChancePool(now);
  }

  /*
    3 günlük süre bittiyse
    tamamen yeni havuz oluştur.
  */

  if (
    Number(chancePool.resetsAt || 0) <= now
  ) {
    return createChancePool(now);
  }

  const remaining = {};

  CHANCE_RARITY_ORDER.forEach((rarity) => {
    const maximum =
      CHANCE_POOL_COUNTS[rarity];

    const saved = Number(
      chancePool.remaining?.[rarity]
    );

    remaining[rarity] =
      Number.isFinite(saved)
        ? Math.max(
            0,
            Math.min(
              maximum,
              Math.floor(saved)
            )
          )
        : maximum;
  });

  /*
    Kaç kart çekilmiş olduğunu
    havuzdaki eksilen kartlardan da
    hesaplayabiliyoruz.
  */

  const totalDraws =
    CHANCE_RARITY_ORDER.reduce(
      (sum, rarity) =>
        sum +
        (CHANCE_POOL_COUNTS[rarity] -
          remaining[rarity]),
      0
    );

  const totalSpent = Math.max(
    Number(chancePool.totalSpent) || 0,

    totalDraws * CHANCE_DRAW_COST
  );

  return {
    ...chancePool,

    id:
      chancePool.id ||
      createChancePoolId(),

    createdAt:
      Number(chancePool.createdAt) ||
      now,

    resetsAt:
      Number(chancePool.resetsAt) ||
      now + CHANCE_POOL_DURATION_MS,

    totalSpent,

    spentTowardsNextLevel:
      totalSpent % CHANCE_LEVEL_COST,

    chanceLevel: Math.floor(
      totalSpent / CHANCE_LEVEL_COST
    ),

    totalDraws,

    remaining,

    history: Array.isArray(
      chancePool.history
    )
      ? chancePool.history
      : [],
  };
}

/* =========================================================
   HAVUZDA KAÇ OYUNCU KALDI?
========================================================= */

export function getChancePoolRemainingCount(
  chancePool
) {
  const pool =
    normalizeChancePool(chancePool);

  return CHANCE_RARITY_ORDER.reduce(
    (sum, rarity) =>
      sum +
      Number(
        pool.remaining[rarity] || 0
      ),
    0
  );
}

/* =========================================================
   ŞANS SEVİYESİ
========================================================= */

export function getChanceLevel(
  chancePool
) {
  const pool =
    normalizeChancePool(chancePool);

  return Math.floor(
    Number(pool.totalSpent || 0) /
      CHANCE_LEVEL_COST
  );
}

/* =========================================================
   ŞANS SEVİYESİ İLERLEMESİ

   10.000 Coin = +1 Şans Seviyesi
========================================================= */

export function getChanceLevelProgress(
  chancePool
) {
  const pool =
    normalizeChancePool(chancePool);

  const spent =
    Number(pool.totalSpent || 0);

  const current =
    spent % CHANCE_LEVEL_COST;

  return {
    level: Math.floor(
      spent / CHANCE_LEVEL_COST
    ),

    current,

    required:
      CHANCE_LEVEL_COST,

    percentage: Math.floor(
      (current / CHANCE_LEVEL_COST) *
        100
    ),
  };
}

/* =========================================================
   ŞANS / PITY SİSTEMİ

   ÖNEMLİ:

   Burada hiçbir kart zorla verilmez.

   Şans seviyesi yükseldikçe
   özel kartların çekilme AĞIRLIĞI artar.

   Kart çıktıktan sonra havuzdan eksilir.

   Bu nedenle İkon teorik olarak
   son karta kadar havuzda kalabilir.
========================================================= */

function getLuckMultiplier(
  rarity,
  chanceLevel
) {
  const level = Math.max(
    0,
    Number(chanceLevel) || 0
  );

  switch (rarity) {
    case "common":
      return 1;

    case "rare":
      return 1 + level * 0.025;

    /*
      İlk 20 çekimden sonra
      Altın ağırlığı artmaya başlar.
    */

    case "gold":
      return 1 + level * 0.18;

    /*
      40 çekim civarından sonra
      Platin daha fazla destek alır.
    */

    case "platinum":
      return (
        1 +
        Math.max(0, level - 1) *
          0.25
      );

    /*
      60 çekim civarından sonra
      Epik desteği.
    */

    case "epic":
      return (
        1 +
        Math.max(0, level - 2) *
          0.32
      );

    /*
      80 çekim civarından sonra
      Efsanevi desteği.
    */

    case "legendary":
      return (
        1 +
        Math.max(0, level - 3) *
          0.42
      );

    /*
      Daha ileri seviyelerde
      İkon ağırlığı giderek artar.

      Fakat GARANTİ YOK.
    */

    case "icon":
      return (
        1 +
        Math.max(0, level - 4) *
          0.55
      );

    default:
      return 1;
  }
}

/* =========================================================
   HAVUZ AĞIRLIKLARI
========================================================= */

export function getChancePoolWeights(
  chancePool
) {
  const pool =
    normalizeChancePool(chancePool);

  const level =
    getChanceLevel(pool);

  const weights = {};

  let totalWeight = 0;

  CHANCE_RARITY_ORDER.forEach(
    (rarity) => {
      const remaining = Number(
        pool.remaining[rarity] || 0
      );

      if (remaining <= 0) {
        weights[rarity] = 0;
        return;
      }

      const multiplier =
        getLuckMultiplier(
          rarity,
          level
        );

      const weight =
        remaining * multiplier;

      weights[rarity] = weight;

      totalWeight += weight;
    }
  );

  return {
    weights,
    totalWeight,
    level,
  };
}

/* =========================================================
   RARITY ÇEK
========================================================= */

function selectRarity(chancePool) {
  const {
    weights,
    totalWeight,
  } = getChancePoolWeights(
    chancePool
  );

  if (totalWeight <= 0) {
    return null;
  }

  let roll =
    Math.random() * totalWeight;

  for (
    const rarity of
    CHANCE_RARITY_ORDER
  ) {
    const weight =
      weights[rarity] || 0;

    if (weight <= 0) {
      continue;
    }

    if (roll < weight) {
      return rarity;
    }

    roll -= weight;
  }

  /*
    Floating point güvenliği.
  */

  return (
    [...CHANCE_RARITY_ORDER]
      .reverse()
      .find(
        (rarity) =>
          Number(
            chancePool.remaining?.[
              rarity
            ] || 0
          ) > 0
      ) || null
  );
}

/* =========================================================
   HAVUZ OYUNCUSU ÜRET
========================================================= */

function generateChancePlayer(
  rarity
) {
  const range =
    RARITY_OVERALL_RANGES[rarity];

  if (!range) {
    return null;
  }

  const player = generatePlayer(
    range.min,
    range.max
  );

  return {
    ...player,

    rarity,

    chancePoolReward: true,

    chancePoolRarity:
      rarity,
  };
}

/* =========================================================
   TEK ÇEKİLİŞ
========================================================= */

export function drawChancePool(
  chancePool,
  now = Date.now()
) {
  const pool =
    normalizeChancePool(
      chancePool,
      now
    );

  const remainingCount =
    getChancePoolRemainingCount(
      pool
    );

  if (remainingCount <= 0) {
    return {
      success: false,

      reason: "empty",

      message:
        "Şans Havuzu boşaldı.",

      pool,

      player: null,
    };
  }

  const rarity =
    selectRarity(pool);

  if (!rarity) {
    return {
      success: false,

      reason: "empty",

      message:
        "Şans Havuzu boşaldı.",

      pool,

      player: null,
    };
  }

  const player =
    generateChancePlayer(
      rarity
    );

  if (!player) {
    return {
      success: false,

      reason:
        "generation-error",

      message:
        "Oyuncu oluşturulamadı.",

      pool,

      player: null,
    };
  }

  /*
    Çıkan kart havuzdan kalıcı olarak
    eksiliyor.
  */

  const nextRemaining = {
    ...pool.remaining,

    [rarity]: Math.max(
      0,
      Number(
        pool.remaining[rarity] || 0
      ) - 1
    ),
  };

  const nextSpent =
    Number(pool.totalSpent || 0) +
    CHANCE_DRAW_COST;

  const nextPool = {
    ...pool,

    remaining:
      nextRemaining,

    totalSpent:
      nextSpent,

    spentTowardsNextLevel:
      nextSpent %
      CHANCE_LEVEL_COST,

    chanceLevel: Math.floor(
      nextSpent /
        CHANCE_LEVEL_COST
    ),

    totalDraws:
      Number(pool.totalDraws || 0) +
      1,

    /*
      Son 50 çekilişi tutuyoruz.
      Save gereksiz büyümesin.
    */

    history: [
      {
        id: player.id,

        rarity,

        overall:
          player.overall,

        name:
          player.name,

        drawnAt: now,
      },

      ...(pool.history || []),
    ].slice(0, 50),
  };

  return {
    success: true,

    rarity,

    player,

    pool: nextPool,

    remaining:
      getChancePoolRemainingCount(
        nextPool
      ),

    level:
      nextPool.chanceLevel,
  };
}

/* =========================================================
   ALTIN VEYA ÜSTÜ?
========================================================= */

export function isGoldOrBetter(
  playerOrRarity
) {
  const rarity =
    typeof playerOrRarity ===
    "string"
      ? playerOrRarity
      : playerOrRarity?.rarity;

  return [
    "gold",
    "platinum",
    "epic",
    "legendary",
    "icon",
  ].includes(rarity);
}

/* =========================================================
   OTOMATİK ÇEKİLİŞ

   MODLAR:

   until-empty-coins
   = Para bitene kadar

   until-gold
   = Altın veya üstü çıkınca dur
========================================================= */

export function autoDrawChancePool({
  chancePool,
  coins,
  mode = "until-empty-coins",
  now = Date.now(),
}) {
  let pool =
    normalizeChancePool(
      chancePool,
      now
    );

  let balance = Math.max(
    0,
    Number(coins) || 0
  );

  const players = [];

  let spent = 0;

  while (
    balance >= CHANCE_DRAW_COST &&
    getChancePoolRemainingCount(
      pool
    ) > 0
  ) {
    const result =
      drawChancePool(
        pool,
        now
      );

    if (!result.success) {
      break;
    }

    pool = result.pool;

    balance -=
      CHANCE_DRAW_COST;

    spent +=
      CHANCE_DRAW_COST;

    players.push(
      result.player
    );

    /*
      Altın veya üstü çıkınca
      otomatik çekimi kes.
    */

    if (
      mode === "until-gold" &&
      isGoldOrBetter(
        result.player
      )
    ) {
      break;
    }
  }

  return {
    pool,

    players,

    coins: balance,

    spent,

    draws:
      players.length,

    stoppedByGold:
      mode === "until-gold" &&
      players.some(
        (player) =>
          isGoldOrBetter(
            player
          )
      ),
  };
}

/* =========================================================
   HAVUZ ÖZETİ

   App.jsx ekranında kullanacağız.
========================================================= */

export function getChancePoolSummary(
  chancePool,
  now = Date.now()
) {
  const pool =
    normalizeChancePool(
      chancePool,
      now
    );

  const progress =
    getChanceLevelProgress(
      pool
    );

  return {
    pool,

    remaining:
      getChancePoolRemainingCount(
        pool
      ),

    total:
      CHANCE_POOL_SIZE,

    resetsAt:
      pool.resetsAt,

    level:
      progress.level,

    levelCurrent:
      progress.current,

    levelRequired:
      progress.required,

    levelPercentage:
      progress.percentage,

    rarities: {
      ...pool.remaining,
    },
  };
}