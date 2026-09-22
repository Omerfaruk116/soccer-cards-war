import {
  getPositionGroup,
  positionGroups,
  randomItem,
  shuffle,
} from "../data/players";

/* =========================================================
   10 KİŞİLİK KADRODAN 5 RASTGELE DÜELLO

   Tam kadro:
   2 Forvet
   3 Orta Saha
   4 Defans
   1 Kaleci

   Bir maçta 5 tanesi rastgele seçilir.
========================================================= */

export const POSITION_POOL = [
  "forward",
  "forward",

  "midfield",
  "midfield",
  "midfield",

  "defense",
  "defense",
  "defense",
  "defense",

  "goalkeeper",
];

export const ROUND_COUNT = 5;

export function createRandomFiveRounds() {
  return shuffle(POSITION_POOL).slice(
    0,
    ROUND_COUNT
  );
}

/* =========================================================
   TUR İSİMLERİ
========================================================= */

export function getRoundLabel(group) {
  return (
    positionGroups[group]?.name ||
    group?.toUpperCase?.() ||
    "OYUNCU"
  );
}

/* =========================================================
   TUR İÇİN KULLANILABİLİR OYUNCULAR
========================================================= */

export function getAvailablePlayersForRound(
  players = [],
  group,
  usedIds = []
) {
  return players.filter((player) => {
    if (!player) {
      return false;
    }

    if (player.sold) {
      return false;
    }

    if (usedIds.includes(player.id)) {
      return false;
    }

    const playerGroup =
      player.positionGroup ||
      getPositionGroup(
        player.position
      );

    return (
      playerGroup === group
    );
  });
}

/* =========================================================
   RAKİPTEN O TURUN KARTINI SEÇ

   Rakip de oyuncuyla aynı grup üzerinden gelir.
========================================================= */

export function chooseOpponentForRound(
  opponentDeck = [],
  group,
  usedIds = []
) {
  const available =
    getAvailablePlayersForRound(
      opponentDeck,
      group,
      usedIds
    );

  if (!available.length) {
    return null;
  }

  return randomItem(available);
}

/* =========================================================
   DÜELLO SONUCU
========================================================= */

export function calculateRoundResult(
  player,
  opponent
) {
  if (!player || !opponent) {
    return {
      winner: "draw",
      playerScore: 0,
      opponentScore: 0,
    };
  }

  const playerScore =
    Number(player.overall) || 0;

  const opponentScore =
    Number(opponent.overall) || 0;

  if (
    playerScore >
    opponentScore
  ) {
    return {
      winner: "player",
      playerScore,
      opponentScore,
    };
  }

  if (
    opponentScore >
    playerScore
  ) {
    return {
      winner: "opponent",
      playerScore,
      opponentScore,
    };
  }

  return {
    winner: "draw",
    playerScore,
    opponentScore,
  };
}

/* =========================================================
   5 TUR SONRASI MAÇ SONUCU
========================================================= */

export function calculateBattleResult(
  rounds = []
) {
  const playerWins =
    rounds.filter(
      (round) =>
        round.result
          ?.winner ===
        "player"
    ).length;

  const opponentWins =
    rounds.filter(
      (round) =>
        round.result
          ?.winner ===
        "opponent"
    ).length;

  const draws =
    rounds.filter(
      (round) =>
        round.result
          ?.winner ===
        "draw"
    ).length;

  return {
    playerWins,
    opponentWins,
    draws,

    won:
      playerWins >
      opponentWins,

    lost:
      opponentWins >
      playerWins,

    draw:
      playerWins ===
      opponentWins,
  };
}

/* =========================================================
   EVENT ÖZEL PARA
========================================================= */

export function calculateEventCurrencyReward(
  event,
  matchNumber = 1
) {
  if (!event) {
    return 0;
  }

  const match =
    Math.max(
      1,
      Number(matchNumber) ||
        1
    );

  const base =
    Number(
      event.rewardBase
    ) || 1;

  const step =
    Number(
      event.rewardStep
    ) || 0;

  return Math.max(
    1,
    Math.round(
      base +
        (match - 1) *
          step
    )
  );
}

/* =========================================================
   COIN ÖDÜLÜ

   Kariyer ve Event tarafında kullanılabilecek
   basit yükselen ödül.
========================================================= */

export function calculateCoinReward(
  stage = 1,
  match = 1
) {
  const safeStage =
    Math.max(
      1,
      Number(stage) || 1
    );

  const safeMatch =
    Math.max(
      1,
      Number(match) || 1
    );

  return Math.round(
    80 +
      safeStage * 55 +
      safeMatch * 12
  );
}

/* =========================================================
   KADRO ORTALAMA GEN
========================================================= */

export function calculateAverageOverall(
  players = []
) {
  if (!players.length) {
    return 0;
  }

  const total =
    players.reduce(
      (sum, player) =>
        sum +
        (Number(
          player?.overall
        ) || 0),
      0
    );

  return Math.round(
    (total /
      players.length) *
      10
  ) / 10;
}

/* =========================================================
   KARİYER RAKİP HEDEF GEN

   Oyuncunun kadro ortalamasına bağlı değildir.
   Sadece aşama + maç numarasına göre sabittir.
========================================================= */

export function calculateCareerTargetOverall({
  stage = 1,
  match = 1,
  stageMin = 10,
  stageCap = 30,
} = {}) {
  const safeStage =
    Math.max(
      1,
      Math.min(
        10,
        Number(stage) || 1
      )
    );

  const safeMatch =
    Math.max(
      1,
      Math.min(
        10,
        Number(match) || 1
      )
    );

  const fixedRanges = {
    1: {
      min: 20,
      max: 30,
    },

    2: {
      min: 30,
      max: 40,
    },

    3: {
      min: 40,
      max: 50,
    },

    4: {
      min: 50,
      max: 60,
    },

    5: {
      min: 60,
      max: 70,
    },

    6: {
      min: 70,
      max: 80,
    },

    7: {
      min: 75,
      max: 85,
    },

    8: {
      min: 80,
      max: 90,
    },

    9: {
      min: 85,
      max: 95,
    },

    10: {
      min: 90,
      max: 99,
    },
  };

  const range =
    fixedRanges[
      safeStage
    ];

  const minimum =
    Math.max(
      Number(stageMin) || 1,
      range.min
    );

  const maximum =
    Math.min(
      Number(stageCap) || 99,
      range.max
    );

  if (
    maximum <= minimum
  ) {
    return Math.round(
      maximum
    );
  }

  const progress =
    (safeMatch - 1) / 9;

  const target =
    minimum +
    (maximum - minimum) *
      progress;

  return Math.max(
    minimum,
    Math.min(
      maximum,
      Math.round(target)
    )
  );
}

/* =========================================================
   EVENT RAKİP HEDEF GEN

   Event maç ilerleyişine göre yükselir.
   Tek tek rakip kartlarının da hard cap
   altında üretilmesi gerekir.
========================================================= */

export function calculateEventTargetOverall({
  event,
  match = 1,
  squadAverage = 10,
} = {}) {
  if (!event) {
    return Math.round(
      squadAverage
    );
  }

  const minimum =
    Number(event.min) ||
    10;

  const maximum =
    Number(
      event.playCap
    ) ||
    Number(event.max) ||
    30;

  const totalMatches =
    Math.max(
      1,
      Number(
        event.matches
      ) || 1
    );

  const currentMatch =
    Math.max(
      1,
      Math.min(
        totalMatches,
        Number(match) || 1
      )
    );

  const progress =
    totalMatches <= 1
      ? 1
      : (currentMatch - 1) /
        (totalMatches - 1);

  const eventCurve =
    minimum +
    (maximum - minimum) *
      progress;

  /*
    Event tarafında oyuncunun gücü
    hâlâ hesaba giriyor.
  */

  const mixed =
    eventCurve * 0.65 +
    Number(
      squadAverage || minimum
    ) *
      0.35;

  return Math.max(
    minimum,
    Math.min(
      maximum,
      Math.round(mixed)
    )
  );
}

/* =========================================================
   RAKİP DESTEĞİNDE HARD CAP KONTROLÜ

   Stage 1 = 30 ise:
   31, 32, 33 gibi kart ASLA kalamaz.
========================================================= */

export function clampOpponentDeck(
  opponentDeck = [],
  hardCap = 99
) {
  const cap =
    Math.min(
      99,
      Math.max(
        1,
        Number(hardCap) ||
          99
      )
    );

  return opponentDeck.map(
    (player) => {
      if (!player) {
        return player;
      }

      const overall =
        Math.min(
          cap,
          Math.max(
            1,
            Number(
              player.overall
            ) || 1
          )
        );

      return {
        ...player,
        overall,
      };
    }
  );
}

/* =========================================================
   MAÇ ÖNCESİ GÖSTERİM
========================================================= */

export function getCareerPreview({
  squadPlayers = [],
  stage = 1,
  match = 1,
  stageMin = 10,
  stageCap = 30,
} = {}) {
  const squadAverage =
    calculateAverageOverall(
      squadPlayers
    );

  const opponentAverage =
    calculateCareerTargetOverall({
      stage,
      match,
      stageMin,
      stageCap,
    });

  return {
    squadAverage:
      Math.round(
        squadAverage
      ),

    opponentAverage:
      Math.round(
        opponentAverage
      ),

    label: `SEN ${Math.round(
      squadAverage
    )} GEN ⚔️ ~${Math.round(
      opponentAverage
    )} GEN RAKİP`,
  };
}

/* =========================================================
   ANİMASYON AŞAMALARI

   choosing
   collapsing
   versus
   result
   next
========================================================= */

export const BATTLE_PHASES = {
  CHOOSING:
    "choosing",

  COLLAPSING:
    "collapsing",

  VERSUS:
    "versus",

  RESULT:
    "result",

  NEXT:
    "next",
};

export const BATTLE_TIMINGS = {
  collapse: 250,
  versus: 450,
  result: 700,
  nextRound: 1600,
};

/* =========================================================
   TEK TUR NESNESİ OLUŞTUR
========================================================= */

export function createRoundRecord({
  roundIndex,
  group,
  player,
  opponent,
} = {}) {
  const result =
    calculateRoundResult(
      player,
      opponent
    );

  return {
    round:
      Number(roundIndex) +
      1,

    group,

    player,

    opponent,

    result,
  };
}