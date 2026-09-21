import {
  getPositionGroup,
  positionGroups,
  randomBetween,
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

   Maç ilerledikçe hafif yükselir.
   Aşama sınırını ASLA geçmez.
========================================================= */

export function calculateCareerTargetOverall({
  squadAverage = 10,
  stage = 1,
  match = 1,
  stageMin = 10,
  stageCap = 30,
} = {}) {
  const safeAverage =
    Number(squadAverage) ||
    10;

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

  const minimum =
    Number(stageMin) ||
    10;

  const maximum =
    Number(stageCap) ||
    30;

  /*
    Maç ilerledikçe:
    yaklaşık +0 → +4 GEN

    Aşama yükseldikçe
    hafif zorluk artışı.
  */

  const matchProgress =
    Math.min(
      4,
      Math.floor(
        (safeMatch - 1) /
          2
      )
    );

  const stagePressure =
    Math.min(
      2,
      Math.floor(
        (safeStage - 1) /
          3
      )
    );

  const variance =
    randomBetween(
      -1,
      1
    );

  const target =
    Math.round(
      safeAverage +
        matchProgress +
        stagePressure +
        variance
    );

  return Math.max(
    minimum,
    Math.min(
      maximum,
      target
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
    Oyuncunun gücü de hesaba girer,
    fakat event sınırı geçilmez.
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

   ÖRNEK:
   SEN 30 GEN ⚔️ ~33 GEN RAKİP
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
      squadAverage,
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

   App.jsx tarafında kullanacağız.

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