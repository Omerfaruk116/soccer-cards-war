import {
  careerLeagues,
  eventConfigs,
  getCareerOpponent,
  getEventConfig,
  getStageReward,
} from "../data/players";

import {
  createCareerFixtureBook,
  ensureCareerFixtures,
  getCareerFixtureSummary,
  getNextCareerMatch,
  getStageFixture,
  isCareerStageCompleted,
} from "./careerFixtures";

import {
  createMarketState,
  ensureMarketState,
  getMarketStatus,
  refreshMarketIfNeeded,
} from "./marketEngine";

import {
  createMissionState,
  ensureMissionState,
  getMainPathProgress,
  getMissionSetStatus,
} from "./missionSystem";

import {
  calculateAverageOverall,
  calculateCareerTargetOverall,
  calculateEventTargetOverall,
} from "./battleEngine";

import {
  getActiveFormationIds,
  getFullTrainingForPlayer,
  getStageCap,
  isPlayerInActiveFormation,
} from "./gameRules";

/* =========================================================
   FINAL SAVE SÜRÜMÜ
========================================================= */

export const FINAL_SAVE_VERSION = 6;

export const FINAL_SAVE_KEY =
  "soccer-cards-war-save-v6";

export const PREVIOUS_SAVE_KEYS = [
  "soccer-cards-war-save-v5",
  "soccer-cards-war-save-v4",
  "soccer-cards-war-save-v3",
  "soccer-cards-war-save-v2",
];

/* =========================================================
   GENEL FINAL STATE
========================================================= */

export function createFinalSystemsState({
  marketCap = 25,
  now = Date.now(),
} = {}) {
  return {
    saveVersion:
      FINAL_SAVE_VERSION,

    activeStage: 1,

    careerFixtures:
      createCareerFixtureBook(),

    marketSystem:
      createMarketState({
        cap: marketCap,
        now,
      }),

    missions:
      createMissionState(),

    toast: null,

    progression: {
      stageRewardClaimed: [],
    },
  };
}

/* =========================================================
   ESKİ SAVE → FINAL SİSTEMLER
========================================================= */

export function normalizeFinalSystems(
  game = {},
  now = Date.now()
) {
  const marketCap =
    Number(
      game.marketCap ||
        game.trainingCap ||
        25
    ) || 25;

  const careerFixtures =
    ensureCareerFixtures({
      career: {
        fixtures:
          game.careerFixtures ||
          game.career?.fixtures ||
          {},
      },
    });

  const existingMarket =
    game.marketSystem ||
    (
      Array.isArray(
        game.market
      )
        ? {
            players:
              game.market,

            deal:
              game.marketDeal ||
              null,

            generatedAt:
              game.marketGeneratedAt ||
              now,

            nextRefreshAt:
              game.marketNextRefreshAt ||
              0,
          }
        : game.market
    );

  const marketSystem =
    ensureMarketState(
      existingMarket,
      {
        cap: marketCap,
        now,
      }
    );

  const missions =
    ensureMissionState(
      game.missions
    );

  const activeStage =
    Math.min(
      10,
      Math.max(
        1,
        Number(
          game.activeStage ||
            game.stage ||
            game.career
              ?.leagueIndex +
              1 ||
            1
        ) || 1
      )
    );

  return {
    ...game,

    saveVersion:
      FINAL_SAVE_VERSION,

    activeStage,

    careerFixtures,

    marketSystem,

    missions,

    progression: {
      stageRewardClaimed:
        Array.isArray(
          game.progression
            ?.stageRewardClaimed
        )
          ? game.progression
              .stageRewardClaimed
          : [],
    },
  };
}

/* =========================================================
   OYUNCULAR
========================================================= */

export function getOwnedPlayers(
  game
) {
  return (
    game?.collection || []
  ).filter(
    (player) =>
      player &&
      !player.sold
  );
}

export function getFormationPlayers(
  game
) {
  const ids =
    getActiveFormationIds(
      game
    );

  const owned =
    getOwnedPlayers(game);

  return ids
    .map((id) =>
      owned.find(
        (player) =>
          player.id === id
      )
    )
    .filter(Boolean);
}

export function getFormationAverage(
  game
) {
  return calculateAverageOverall(
    getFormationPlayers(
      game
    )
  );
}

/* =========================================================
   AŞAMA
========================================================= */

export function getCurrentStage(
  game
) {
  return Math.min(
    10,
    Math.max(
      1,
      Number(
        game?.activeStage
      ) || 1
    )
  );
}

export function getCurrentLeague(
  game
) {
  const stage =
    getCurrentStage(game);

  return (
    careerLeagues.find(
      (league) =>
        league.stage ===
        stage
    ) ||
    careerLeagues[0]
  );
}

export function getCurrentStageCap(
  game
) {
  return getStageCap(
    getCurrentStage(
      game
    )
  );
}

/* =========================================================
   CAREER FİKSTÜR BİLGİSİ
========================================================= */

export function getCareerScreenData(
  game
) {
  const stage =
    getCurrentStage(game);

  const league =
    getCurrentLeague(game);

  const fixtures =
    game.careerFixtures ||
    createCareerFixtureBook();

  const fixture =
    getStageFixture(
      fixtures,
      stage
    );

  const summary =
    getCareerFixtureSummary(
      fixtures,
      stage
    );

  const nextMatch =
    getNextCareerMatch(
      fixtures,
      stage
    );

  const opponent =
    nextMatch?.opponent ||
    getCareerOpponent(
      stage,
      summary.completed + 1
    );

  const squadAverage =
    getFormationAverage(
      game
    );

  const opponentAverage =
    calculateCareerTargetOverall({
      squadAverage,
      stage,
      match:
        nextMatch?.match ||
        summary.completed + 1,
      stageMin:
        league.min,
      stageCap:
        league.playCap,
    });

  return {
    stage,

    league,

    fixture,

    summary,

    nextMatch,

    opponent,

    squadAverage,

    opponentAverage,

    completed:
      isCareerStageCompleted(
        fixtures,
        stage
      ),

    previewText:
      `SEN ${Math.round(
        squadAverage
      )} GEN ⚔️ ~${Math.round(
        opponentAverage
      )} GEN RAKİP`,
  };
}

/* =========================================================
   EVENT EKRAN BİLGİSİ
========================================================= */

export function getEventScreenData(
  game,
  eventId
) {
  const stage =
    getCurrentStage(game);

  const fallback =
    eventConfigs.find(
      (item) =>
        item.stage ===
        stage
    ) ||
    eventConfigs[0];

  const event =
    eventId
      ? getEventConfig(
          eventId
        )
      : fallback;

  const eventState =
    game.events?.[
      event.id
    ] || {
      match: 1,
      currency: 0,
      completed: false,
    };

  const squadAverage =
    getFormationAverage(
      game
    );

  const opponentAverage =
    calculateEventTargetOverall({
      event,
      match:
        eventState.match,
      squadAverage,
    });

  return {
    event,

    eventState,

    squadAverage,

    opponentAverage,

    previewText:
      `SEN ${Math.round(
        squadAverage
      )} GEN ⚔️ ~${Math.round(
        opponentAverage
      )} GEN RAKİP`,
  };
}

/* =========================================================
   ORTAK AŞAMA İLERLEMESİ

   Yeni aşama yalnızca:
   CAREER ✅
   EVENT ✅

   ikisi de bittiyse açılır.
========================================================= */

export function getStageProgressStatus(
  game
) {
  const stage =
    getCurrentStage(game);

  const fixtures =
    game.careerFixtures ||
    createCareerFixtureBook();

  const careerDone =
    isCareerStageCompleted(
      fixtures,
      stage
    ) ||
    Boolean(
      game.career
        ?.completedStages
        ?.includes(stage)
    );

  const stageEvent =
    eventConfigs.find(
      (event) =>
        event.stage ===
        stage
    );

  const eventDone =
    stageEvent
      ? Boolean(
          game.events?.[
            stageEvent.id
          ]?.completed
        )
      : false;

  const bothDone =
    careerDone &&
    eventDone;

  return {
    stage,

    careerDone,

    eventDone,

    bothDone,

    nextStage:
      stage < 10
        ? stage + 1
        : null,

    careerText:
      careerDone
        ? `✅ Kariyer Aşama ${stage} tamamlandı`
        : `⏳ Kariyer Aşama ${stage} tamamlanmalı`,

    eventText:
      eventDone
        ? `✅ Etkinlik Aşama ${stage} tamamlandı`
        : `⏳ Etkinlik Aşama ${stage} tamamlanmalı`,
  };
}

/* =========================================================
   AŞAMA YÜKSELT
========================================================= */

export function advanceStageIfReady(
  game
) {
  const status =
    getStageProgressStatus(
      game
    );

  if (
    !status.bothDone ||
    status.stage >= 10
  ) {
    return {
      advanced: false,
      game,
      status,
    };
  }

  const nextStage =
    status.stage + 1;

  return {
    advanced: true,

    game: {
      ...game,

      activeStage:
        nextStage,

      trainingCap:
        getStageCap(
          nextStage
        ),

      marketCap:
        getStageCap(
          nextStage
        ),
    },

    status: {
      ...status,
      nextStage,
    },
  };
}

/* =========================================================
   AŞAMA ÖDÜLÜ

   Final mantık:
   özel aşama oyuncusu ancak
   Career + Event ikisi bittikten sonra alınabilir.
========================================================= */

export function getAvailableStageReward(
  game
) {
  const status =
    getStageProgressStatus(
      game
    );

  if (!status.bothDone) {
    return null;
  }

  const claimed =
    game.progression
      ?.stageRewardClaimed ||
    [];

  if (
    claimed.includes(
      status.stage
    )
  ) {
    return null;
  }

  return getStageReward(
    status.stage
  );
}

export function markStageRewardClaimed(
  game,
  stage
) {
  const old =
    game.progression
      ?.stageRewardClaimed ||
    [];

  if (
    old.includes(stage)
  ) {
    return game;
  }

  return {
    ...game,

    progression: {
      ...(game.progression ||
        {}),

      stageRewardClaimed: [
        ...old,
        stage,
      ],
    },
  };
}

/* =========================================================
   MARKET OTOMATİK YENİLE
========================================================= */

export function updateMarketSystem(
  game,
  now = Date.now()
) {
  const cap =
    Number(
      game.marketCap ||
        getCurrentStageCap(
          game
        )
    );

  const result =
    refreshMarketIfNeeded(
      game.marketSystem,
      {
        cap,
        now,
      }
    );

  if (!result.refreshed) {
    return {
      refreshed: false,
      game,
    };
  }

  return {
    refreshed: true,

    game: {
      ...game,
      marketSystem:
        result.market,
    },
  };
}

export function getMarketScreenData(
  game,
  now = Date.now()
) {
  const status =
    getMarketStatus(
      game.marketSystem,
      now
    );

  return {
    ...status,

    players:
      game.marketSystem
        ?.players || [],

    deal:
      game.marketSystem
        ?.deal || null,
  };
}

/* =========================================================
   GÖREV EKRANI
========================================================= */

export function getMissionScreenData(
  game
) {
  return {
    active:
      getMissionSetStatus(
        game,
        game.missions
      ),

    mainPath:
      getMainPathProgress(
        game,
        game.missions
      ),
  };
}

/* =========================================================
   FULL ANTRENMAN
========================================================= */

export function getFullTrainingData(
  game,
  player
) {
  const cap =
    getCurrentStageCap(
      game
    );

  const inFormation =
    isPlayerInActiveFormation(
      player,
      game
    );

  const training =
    getFullTrainingForPlayer(
      game,
      player,
      cap
    );

  return {
    ...training,

    inFormation,

    cap,

    buttonText:
      inFormation
        ? "🔒 KADRODA"
        : training.allowed
          ? `FULL ANTRENMAN • +${training.gain} GEN`
          : training.message,
  };
}

/* =========================================================
   TOAST

   Kalıcı sarı Notice yerine kullanılacak.
========================================================= */

export function createToast(
  message,
  type = "info",
  duration = 1800
) {
  if (!message) {
    return null;
  }

  return {
    id:
      `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,

    message,

    type,

    createdAt:
      Date.now(),

    duration,
  };
}

export function shouldRemoveToast(
  toast,
  now = Date.now()
) {
  if (!toast) {
    return true;
  }

  return (
    now -
      Number(
        toast.createdAt
      ) >=
    Number(
      toast.duration ||
        1800
    )
  );
}

/* =========================================================
   HOME ÖZETİ
========================================================= */

export function getHomeFinalData(
  game,
  now = Date.now()
) {
  const missions =
    getMissionScreenData(
      game
    );

  const market =
    getMarketScreenData(
      game,
      now
    );

  const stage =
    getStageProgressStatus(
      game
    );

  return {
    missions,
    market,
    stage,

    stageNumber:
      getCurrentStage(
        game
      ),

    stageCap:
      getCurrentStageCap(
        game
      ),

    squadAverage:
      getFormationAverage(
        game
      ),
  };
}