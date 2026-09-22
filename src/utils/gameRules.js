/* =========================================================
   SOCCER CARDS WAR
   GAME RULES
========================================================= */

/* =========================================================
   SABİTLER
========================================================= */

export const EVENT_MATCH_COOLDOWN_MS = 0;

const DEFAULT_STAGE_CAP = 99;

/* =========================================================
   GENEL YARDIMCILAR
========================================================= */

function safeArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function safeNumber(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function getPlayerId(player) {
  return player?.id ?? null;
}

/* =========================================================
   AKTİF FORMASYON
========================================================= */

export function getActiveFormationIds(
  game
) {
  const formation =
    game?.formation || {};

  const formationIds =
    Object.values(formation)
      .map((value) => {
        if (
          value &&
          typeof value === "object"
        ) {
          return value.id;
        }

        return value;
      })
      .filter(Boolean);

  /*
    Formation doluysa ana kaynak odur.
    Böylece eski squad verileri oyuncuları
    yanlışlıkla kilitlemez.
  */
  if (formationIds.length) {
    return [
      ...new Set(
        formationIds
      ),
    ];
  }

  const fallbackIds = [
    ...safeArray(
      game?.squadIds
    ),

    ...safeArray(
      game?.squad
    ).map((player) =>
      typeof player === "object"
        ? player?.id
        : player
    ),

    ...safeArray(
      game?.lineup
    ).map((player) =>
      typeof player === "object"
        ? player?.id
        : player
    ),
  ].filter(Boolean);

  return [
    ...new Set(
      fallbackIds
    ),
  ];
}

export function isPlayerInActiveFormation(
  player,
  game
) {
  const playerId =
    getPlayerId(player);

  if (!playerId) {
    return false;
  }

  return getActiveFormationIds(
    game
  ).includes(playerId);
}

/* =========================================================
   ANTRENMANLAR
========================================================= */

/*
  Eski save:
  training: null
  training: { ... }

  Yeni save:
  training: [ ... ]

  Hepsini destekler.
*/
export function getTrainingSessions(
  game
) {
  const training =
    game?.training;

  if (
    Array.isArray(training)
  ) {
    return training.filter(
      Boolean
    );
  }

  if (
    training &&
    typeof training === "object"
  ) {
    return [training];
  }

  /*
    İleride trainingSessions adı
    kullanılmış save varsa onu da oku.
  */
  if (
    Array.isArray(
      game?.trainingSessions
    )
  ) {
    return game.trainingSessions.filter(
      Boolean
    );
  }

  return [];
}

export function isPlayerTraining(
  player,
  game
) {
  const playerId =
    getPlayerId(player);

  if (!playerId) {
    return false;
  }

  return getTrainingSessions(
    game
  ).some(
    (session) =>
      session?.playerId ===
        playerId &&
      !session?.finished
  );
}

/* =========================================================
   ANTRENÖR SEANSLARI
========================================================= */

export function getCoachSessions(
  game
) {
  return safeArray(
    game?.coaches
      ?.activeSessions
  ).filter(Boolean);
}

export function isPlayerWithCoach(
  player,
  game
) {
  const playerId =
    getPlayerId(player);

  if (!playerId) {
    return false;
  }

  return getCoachSessions(
    game
  ).some(
    (session) =>
      !session?.finished &&
      safeArray(
        session?.playerIds
      ).includes(playerId)
  );
}

/* =========================================================
   KİRALIK OYUNCULAR
========================================================= */

export function getActiveRentals(
  game,
  now = Date.now()
) {
  return safeArray(
    game?.rentalCenter
      ?.rentals
  ).filter(
    (rental) =>
      rental &&
      !rental.finished &&
      safeNumber(
        rental.endsAt
      ) > now
  );
}

export function isPlayerRented(
  player,
  game
) {
  const playerId =
    getPlayerId(player);

  if (!playerId) {
    return false;
  }

  return safeArray(
    game?.rentalCenter
      ?.rentals
  ).some(
    (rental) =>
      rental?.playerId ===
        playerId &&
      !rental?.finished
  );
}

/* =========================================================
   OYUNCU MEŞGUL MÜ?
========================================================= */

export function isPlayerBusy(
  player,
  game
) {
  if (!player) {
    return false;
  }

  return (
    isPlayerTraining(
      player,
      game
    ) ||
    isPlayerWithCoach(
      player,
      game
    ) ||
    isPlayerRented(
      player,
      game
    )
  );
}

/* =========================================================
   GEÇİCİ OLARAK TAKIMDAN ÇIKARILABİLİR Mİ?
========================================================= */

export function canTemporarilyRemovePlayer(
  game,
  playerId
) {
  const collection =
    safeArray(
      game?.collection
    ).filter(
      (player) =>
        player &&
        !player.sold
    );

  const available =
    collection.filter(
      (player) =>
        !isPlayerBusy(
          player,
          game
        )
    );

  /*
    Oyunda kullanılabilir oyuncu
    kalmayacaksa izin verme.
  */
  if (
    available.length <= 1 &&
    available.some(
      (player) =>
        player.id ===
        playerId
    )
  ) {
    return {
      allowed: false,
      message:
        "Takımında kullanılabilir oyuncu kalmaz.",
    };
  }

  return {
    allowed: true,
    message: "",
  };
}

/* =========================================================
   SATIŞ KURALI
========================================================= */

export function canSellPlayer(
  game,
  player
) {
  if (!player) {
    return {
      allowed: false,
      message:
        "Oyuncu bulunamadı.",
    };
  }

  if (
    player.unsellable ||
    player.rarity ===
      "elturco"
  ) {
    return {
      allowed: false,
      message:
        "Bu oyuncu satılamaz.",
    };
  }

  if (
    isPlayerInActiveFormation(
      player,
      game
    )
  ) {
    return {
      allowed: false,
      message:
        "🔒 OYUNCU ŞU AN KADRODA",
    };
  }

  if (
    isPlayerBusy(
      player,
      game
    )
  ) {
    return {
      allowed: false,
      message:
        "Bu oyuncu şu anda kullanılamıyor.",
    };
  }

  return {
    allowed: true,
    message: "",
  };
}

/* =========================================================
   ANTRENMANA GÖNDERME
========================================================= */

export function canSendToTraining(
  game,
  player,
  stageCap = DEFAULT_STAGE_CAP
) {
  if (!player) {
    return {
      allowed: false,
      message:
        "Oyuncu bulunamadı.",
    };
  }

  if (
    isPlayerInActiveFormation(
      player,
      game
    )
  ) {
    return {
      allowed: false,
      message:
        "🔒 OYUNCU ŞU AN KADRODA",
    };
  }

  if (
    isPlayerBusy(
      player,
      game
    )
  ) {
    return {
      allowed: false,
      message:
        "Oyuncu zaten başka bir işlemde.",
    };
  }

  const cap =
    Math.max(
      1,
      safeNumber(
        stageCap,
        DEFAULT_STAGE_CAP
      )
    );

  if (
    safeNumber(
      player.overall
    ) >= cap
  ) {
    return {
      allowed: false,
      message:
        "Oyuncu mevcut aşamanın GEN sınırında.",
    };
  }

  const temporaryCheck =
    canTemporarilyRemovePlayer(
      game,
      player.id
    );

  if (
    !temporaryCheck.allowed
  ) {
    return temporaryCheck;
  }

  return {
    allowed: true,
    message: "",
  };
}

/* =========================================================
   ANTRENÖRE GÖNDERME
========================================================= */

export function canSendToCoach(
  game,
  player,
  stageCap = DEFAULT_STAGE_CAP
) {
  return canSendToTraining(
    game,
    player,
    stageCap
  );
}

/* =========================================================
   FULL ANTRENMAN
========================================================= */

function calculateFullTrainingPlan(
  currentOverall,
  stageCap
) {
  const current =
    Math.max(
      1,
      safeNumber(
        currentOverall,
        1
      )
    );

  const cap =
    Math.max(
      current,
      safeNumber(
        stageCap,
        DEFAULT_STAGE_CAP
      )
    );

  const gain =
    Math.max(
      0,
      cap - current
    );

  if (!gain) {
    return {
      gain: 0,
      hours: 0,
      milliseconds: 0,
      cost: 0,
      targetOverall:
        current,
    };
  }

  /*
    GEN farkına göre süre.
    En az 1 saat,
    en fazla 24 saat.
  */
  const hours =
    Math.max(
      1,
      Math.min(
        24,
        Math.ceil(
          gain * 1.5
        )
      )
    );

  /*
    GEN yükseldikçe maliyet artar.
  */
  const cost =
    Math.max(
      100,
      Math.round(
        gain *
          Math.max(
            100,
            current * 18
          )
      )
    );

  return {
    gain,
    hours,
    milliseconds:
      hours *
      60 *
      60 *
      1000,
    cost,
    targetOverall:
      cap,
  };
}

export function getFullTrainingForPlayer(
  game,
  player,
  stageCap = DEFAULT_STAGE_CAP
) {
  const check =
    canSendToTraining(
      game,
      player,
      stageCap
    );

  if (
    !check.allowed
  ) {
    return {
      allowed: false,
      message:
        check.message,
      gain: 0,
      hours: 0,
      milliseconds: 0,
      cost: 0,
      targetOverall:
        safeNumber(
          player?.overall
        ),
    };
  }

  const plan =
    calculateFullTrainingPlan(
      player.overall,
      stageCap
    );

  return {
    allowed:
      plan.gain > 0,

    message:
      plan.gain > 0
        ? ""
        : "Oyuncu zaten maksimum seviyede.",

    ...plan,
  };
}

/* =========================================================
   ANTRENMAN HIZLANDIRMA
========================================================= */

/*
  Hızlandır maliyeti kalan süreye göre hesaplanır.

  Her kalan saat yaklaşık 100 Coin.
  Minimum 50 Coin.

  Örnek:
  30 dk  -> 50 Coin
  2 saat -> 200 Coin
  8 saat -> 800 Coin
*/
export function getTrainingSpeedUpCost(
  session,
  now = Date.now()
) {
  if (!session) {
    return 0;
  }

  const remaining =
    Math.max(
      0,
      safeNumber(
        session.endsAt
      ) - now
    );

  if (!remaining) {
    return 0;
  }

  const remainingHours =
    remaining /
    (
      60 *
      60 *
      1000
    );

  return Math.max(
    50,
    Math.ceil(
      remainingHours * 100
    )
  );
}

/* =========================================================
   KİRALAMA
========================================================= */

export function canRentPlayer(
  game,
  player
) {
  if (!player) {
    return {
      allowed: false,
      message:
        "Oyuncu bulunamadı.",
    };
  }

  if (
    player.unsellable ||
    player.rarity ===
      "elturco"
  ) {
    return {
      allowed: false,
      message:
        "EL TURCO kiraya verilemez.",
    };
  }

  if (
    !game?.rentalCenter
      ?.unlocked
  ) {
    return {
      allowed: false,
      message:
        "Önce Kiralık Merkezi açmalısın.",
    };
  }

  if (
    isPlayerInActiveFormation(
      player,
      game
    )
  ) {
    return {
      allowed: false,
      message:
        "🔒 OYUNCU ŞU AN KADRODA",
    };
  }

  if (
    isPlayerBusy(
      player,
      game
    )
  ) {
    return {
      allowed: false,
      message:
        "Bu oyuncu şu anda kullanılamıyor.",
    };
  }

  const slots =
    Math.max(
      0,
      safeNumber(
        game?.rentalCenter
          ?.slots,
        0
      )
    );

  if (slots <= 0) {
    return {
      allowed: false,
      message:
        "Kiralık slotun yok.",
    };
  }

  const activeRentals =
    getActiveRentals(
      game
    );

  if (
    activeRentals.length >=
    slots
  ) {
    return {
      allowed: false,
      message:
        "Kiralık slotların dolu.",
    };
  }

  return canTemporarilyRemovePlayer(
    game,
    player.id
  );
}

/* =========================================================
   KİRALIK GERİ ÇAĞIRMA
========================================================= */

export function getRentalRecallRatio(
  rental,
  now = Date.now()
) {
  if (!rental) {
    return 0;
  }

  const startedAt =
    safeNumber(
      rental.startedAt
    );

  const endsAt =
    safeNumber(
      rental.endsAt
    );

  const total =
    Math.max(
      1,
      endsAt -
        startedAt
    );

  const elapsed =
    Math.max(
      0,
      Math.min(
        total,
        now -
          startedAt
      )
    );

  return Math.max(
    0,
    Math.min(
      1,
      elapsed / total
    )
  );
}

export function calculateRentalRecallIncome(
  rental,
  fullIncome,
  now = Date.now()
) {
  const ratio =
    getRentalRecallRatio(
      rental,
      now
    );

  return Math.max(
    0,
    Math.floor(
      Math.max(
        0,
        safeNumber(
          fullIncome
        )
      ) * ratio
    )
  );
}

/* =========================================================
   EVENT COOLDOWN
========================================================= */

export function getEventCooldownRemaining() {
  return 0;
}

export function isEventMatchReady() {
  return true;
}

/* =========================================================
   SAAT FORMATLARI
========================================================= */

export function millisecondsToClock(
  milliseconds
) {
  const safe =
    Math.max(
      0,
      Math.floor(
        safeNumber(
          milliseconds
        )
      )
    );

  const seconds =
    Math.floor(
      safe / 1000
    );

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (
        seconds %
        3600
      ) / 60
    );

  const remainingSeconds =
    seconds % 60;

  return [
    hours,
    minutes,
    remainingSeconds,
  ]
    .map((value) =>
      String(value).padStart(
        2,
        "0"
      )
    )
    .join(":");
}

/* =========================================================
   OYUNDA GEÇİRİLEN SÜRE
========================================================= */

export function formatPlayTime(
  totalSeconds
) {
  const seconds =
    Math.max(
      0,
      Math.floor(
        safeNumber(
          totalSeconds
        )
      )
    );

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (
        seconds %
        3600
      ) / 60
    );

  const remainingSeconds =
    seconds % 60;

  if (hours > 0) {
    return `${hours} sa ${minutes} dk`;
  }

  if (minutes > 0) {
    return `${minutes} dk ${remainingSeconds} sn`;
  }

  return `${remainingSeconds} sn`;
}