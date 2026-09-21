import {
  calculateFullTrainingPlan,
  getPositionGroup,
  positionGroups,
  squadRequirements,
} from "../data/players";

export const EVENT_MATCH_COOLDOWN_MS =
  30 * 1000;

export const DAILY_REWARD_COOLDOWN_MS =
  24 * 60 * 60 * 1000;

export const MAX_NORMAL_OVERALL = 99;

export const EL_TURCO_OVERALL = 100;

export function isPlayerSold(player) {
  return Boolean(player?.sold);
}

export function isPlayerTraining(
  player,
  game
) {
  if (!player || !game) {
    return false;
  }

  return (
    game.training?.playerId ===
    player.id
  );
}

export function isPlayerRented(
  player,
  game
) {
  if (!player || !game) {
    return false;
  }

  return Boolean(
    game.rentalCenter?.rentals?.some(
      (rental) =>
        rental.playerId ===
          player.id &&
        rental.endsAt >
          Date.now()
    )
  );
}

export function isPlayerWithCoach(
  player,
  game
) {
  if (!player || !game) {
    return false;
  }

  return Boolean(
    game.coaches?.activeSessions?.some(
      (session) =>
        session.playerIds?.includes(
          player.id
        ) &&
        session.endsAt >
          Date.now()
    )
  );
}

export function isPlayerBusy(
  player,
  game
) {
  return (
    isPlayerTraining(
      player,
      game
    ) ||
    isPlayerRented(
      player,
      game
    ) ||
    isPlayerWithCoach(
      player,
      game
    )
  );
}

export function isPlayerUsable(
  player,
  game,
  stageCap = 99
) {
  if (!player) {
    return false;
  }

  if (player.sold) {
    return false;
  }

  if (
    player.overall >
      stageCap &&
    player.overall !== 100
  ) {
    return false;
  }

  if (
    isPlayerBusy(
      player,
      game
    )
  ) {
    return false;
  }

  return true;
}

export function getActivePlayers(
  game,
  stageCap = 99
) {
  if (
    !Array.isArray(
      game?.collection
    )
  ) {
    return [];
  }

  return game.collection.filter(
    (player) =>
      isPlayerUsable(
        player,
        game,
        stageCap
      )
  );
}

export function countGroups(
  players
) {
  const counts = {
    goalkeeper: 0,
    defense: 0,
    midfield: 0,
    forward: 0,
    total: 0,
  };

  players.forEach((player) => {
    if (
      !player ||
      player.sold
    ) {
      return;
    }

    const group =
      player.positionGroup ||
      getPositionGroup(
        player.position
      );

    if (
      counts[group] !==
      undefined
    ) {
      counts[group] += 1;
    }

    counts.total += 1;
  });

  return counts;
}

export function getSquadProblems(
  players
) {
  const counts =
    countGroups(players);

  const problems = [];

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
        counts[group] <
        minimum
      ) {
        problems.push({
          group,
          name:
            positionGroups[
              group
            ]?.name ||
            group,
          current:
            counts[group],
          required:
            minimum,
        });
      }
    }
  );

  if (
    counts.total <
    squadRequirements.total
  ) {
    problems.push({
      group: "total",
      name: "TOPLAM",
      current:
        counts.total,
      required:
        squadRequirements.total,
    });
  }

  return {
    valid:
      problems.length === 0,
    counts,
    problems,
  };
}

export function canStartCareer(
  game,
  stageCap = 99
) {
  const active =
    getActivePlayers(
      game,
      stageCap
    );

  const formation =
    getSquadProblems(
      active
    );

  if (
    active.length <
    squadRequirements
      .careerMinimumActivePlayers
  ) {
    return {
      allowed: false,
      message:
        "Kariyer maçına girmek için en az 11 aktif oyuncuya ihtiyacın var.",
      activePlayers:
        active.length,
      formation,
    };
  }

  if (!formation.valid) {
    const first =
      formation.problems[0];

    return {
      allowed: false,
      message:
        first?.group ===
        "total"
          ? "Maç oynayabilmek için en az 10 kullanılabilir oyuncuya ihtiyacın var."
          : `Kadron eksik: En az ${first.required} ${first.name} oyuncusu gerekli.`,
      activePlayers:
        active.length,
      formation,
    };
  }

  return {
    allowed: true,
    message: "",
    activePlayers:
      active.length,
    formation,
  };
}

export function canStartEvent(
  game,
  stageCap = 99
) {
  const active =
    getActivePlayers(
      game,
      stageCap
    );

  const formation =
    getSquadProblems(
      active
    );

  if (!formation.valid) {
    const first =
      formation.problems[0];

    return {
      allowed: false,
      message:
        first?.group ===
        "total"
          ? "Etkinlik maçına girmek için 10 kullanılabilir oyuncu gerekli."
          : `Kadron eksik: En az ${first.required} ${first.name} oyuncusu gerekli.`,
      formation,
    };
  }

  return {
    allowed: true,
    message: "",
    formation,
  };
}

export function canTemporarilyRemovePlayer(
  game,
  playerId
) {
  const active =
    getActivePlayers(
      game,
      100
    );

  const remaining =
    active.filter(
      (player) =>
        player.id !==
        playerId
    );

  const result =
    getSquadProblems(
      remaining
    );

  if (!result.valid) {
    const first =
      result.problems[0];

    return {
      allowed: false,
      message:
        first?.group ===
        "total"
          ? "Bu işlemden sonra maç oynayacak yeterli oyuncun kalmıyor."
          : `Bu oyuncuyu kullanımdan çıkaramazsın. En az ${first.required} ${first.name} oyuncusu aktif kalmalı.`,
    };
  }

  return {
    allowed: true,
    message: "",
  };
}

/* =========================================================
   AKTİF 10 KİŞİLİK KADRO
========================================================= */

export function getActiveFormationIds(
  game = {}
) {
  const ids = [];

  const add = (value) => {
    if (!value) {
      return;
    }

    if (
      typeof value ===
      "string"
    ) {
      ids.push(value);
      return;
    }

    if (
      typeof value ===
        "object" &&
      value.id
    ) {
      ids.push(value.id);
    }
  };

  const formation =
    game.formation ||
    game.team?.formation ||
    game.activeFormation ||
    {};

  Object.values(
    formation
  ).forEach((value) => {
    if (
      Array.isArray(value)
    ) {
      value.forEach(add);
    } else {
      add(value);
    }
  });

  [
    game.squad,
    game.activeSquad,
    game.lineup,
    game.startingPlayers,
    game.startingXI,
    game.team?.squad,
    game.team?.startingXI,
  ].forEach((list) => {
    if (
      Array.isArray(list)
    ) {
      list.forEach(add);
    }
  });

  return [
    ...new Set(ids),
  ].slice(
    0,
    squadRequirements.total
  );
}

export function isPlayerInActiveFormation(
  player,
  game
) {
  if (!player) {
    return false;
  }

  return getActiveFormationIds(
    game
  ).includes(
    player.id
  );
}

/* =========================================================
   SATIŞ
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
    player.specialReward
  ) {
    return {
      allowed: false,
      message:
        "Bu özel ödül kartı satılamaz.",
    };
  }

  if (player.sold) {
    return {
      allowed: false,
      message:
        "Bu oyuncu zaten satılmış.",
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
        "Bu oyuncu şu anda antrenmanda, antrenörde veya kiralıkta.",
    };
  }

  return canTemporarilyRemovePlayer(
    game,
    player.id
  );
}

/* =========================================================
   ANTRENMAN
========================================================= */

export function canSendToTraining(
  game,
  player,
  stageCap = 99
) {
  if (!player) {
    return {
      allowed: false,
      message:
        "Oyuncu bulunamadı.",
    };
  }

  if (player.sold) {
    return {
      allowed: false,
      message:
        "Bu oyuncu satılmış.",
    };
  }

  if (
    player.overall >= 100
  ) {
    return {
      allowed: false,
      message:
        "MAX GEN",
    };
  }

  if (
    player.overall >=
    stageCap
  ) {
    return {
      allowed: false,
      message:
        `AŞAMA SINIRI: ${stageCap} GEN`,
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
        "🔒 KADRODA",
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
        "Bu oyuncu zaten başka bir görevde.",
    };
  }

  return canTemporarilyRemovePlayer(
    game,
    player.id
  );
}

/* =========================================================
   ANTRENÖR
========================================================= */

export function canSendToCoach(
  game,
  player,
  stageCap = 99
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

export function getFullTrainingForPlayer(
  game,
  player,
  stageCap = 99
) {
  const check =
    canSendToTraining(
      game,
      player,
      stageCap
    );

  if (!check.allowed) {
    return {
      allowed: false,
      message:
        check.message,
      gain: 0,
      hours: 0,
      milliseconds: 0,
      cost: 0,
      targetOverall:
        player?.overall || 0,
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
    player.unsellable &&
    player.overall === 100
  ) {
    return {
      allowed: false,
      message:
        "EL TURCO kiraya verilemez.",
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

  return canTemporarilyRemovePlayer(
    game,
    player.id
  );
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
        milliseconds
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
      (seconds % 3600) /
        60
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

export function formatPlayTime(
  totalSeconds
) {
  const seconds =
    Math.max(
      0,
      Math.floor(
        totalSeconds || 0
      )
    );

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) /
        60
    );

  if (hours > 0) {
    return `${hours} saat ${minutes} dakika`;
  }

  return `${minutes} dakika`;
}

/* =========================================================
   GÜNLÜK ÖDÜL
========================================================= */

export function getNextDailyRewardTime(
  game
) {
  const lastClaimAt =
    Number(
      game?.daily
        ?.lastClaimAt
    ) || 0;

  if (!lastClaimAt) {
    return 0;
  }

  return (
    lastClaimAt +
    DAILY_REWARD_COOLDOWN_MS
  );
}

export function getDailyRewardRemaining(
  game,
  now = Date.now()
) {
  const next =
    getNextDailyRewardTime(
      game
    );

  if (!next) {
    return 0;
  }

  return Math.max(
    0,
    next - now
  );
}

export function isDailyRewardReady(
  game,
  now = Date.now()
) {
  return (
    getDailyRewardRemaining(
      game,
      now
    ) === 0
  );
}

/* =========================================================
   EVENT COOLDOWN
========================================================= */

export function getEventCooldownRemaining(
  eventState,
  now = Date.now()
) {
  const availableAt =
    Number(
      eventState
        ?.nextMatchAt
    ) || 0;

  return Math.max(
    0,
    availableAt - now
  );
}

export function isEventMatchReady(
  eventState,
  now = Date.now()
) {
  return (
    getEventCooldownRemaining(
      eventState,
      now
    ) === 0
  );
}

/* =========================================================
   KİRALIK İLERLEMESİ
========================================================= */

export function getRentalProgress(
  rental,
  now = Date.now()
) {
  if (!rental) {
    return {
      finished: true,
      elapsed: 0,
      remaining: 0,
    };
  }

  const startedAt =
    Number(
      rental.startedAt
    ) || now;

  const endsAt =
    Number(
      rental.endsAt
    ) || now;

  return {
    finished:
      now >= endsAt,

    elapsed:
      Math.max(
        0,
        Math.min(
          now,
          endsAt
        ) - startedAt
      ),

    remaining:
      Math.max(
        0,
        endsAt - now
      ),
  };
}

/* =========================================================
   ANTRENÖR İLERLEMESİ
========================================================= */

export function getCoachSessionProgress(
  session,
  now = Date.now()
) {
  if (!session) {
    return {
      finished: true,
      remaining: 0,
    };
  }

  return {
    finished:
      now >=
      session.endsAt,

    remaining:
      Math.max(
        0,
        session.endsAt -
          now
      ),
  };
}