/* =========================================================
   SOCCER CARDS WAR - ANA GÖREV SİSTEMİ

   Mantık:
   - Görevler oyuncuyu oyunun sonuna doğru yönlendirir
   - Kilitli sistemleri erkenden istemez
   - Her bölümde 5 görev
   - 5/5 tamamlanınca 500 Coin
   - Ödül alındıktan sonra sonraki görev seti açılır
========================================================= */

export const MISSION_SET_REWARD = 500;

/* =========================================================
   GÖREV SETLERİ
========================================================= */

export const missionSets = [
  {
    id: 1,
    title: "İLK ADIMLAR",
    description:
      "Kulübünü kur ve ilk maçlarına hazırlan.",

    missions: [
      {
        id: "set1-lineup",
        title:
          "10 kişilik ana kadronu kur",
        type: "formation-ready",
        target: 1,
      },

      {
        id: "set1-auto-lineup",
        title:
          "En İyi Kadro butonunu kullan",
        type: "auto-lineup-used",
        target: 1,
      },

      {
        id: "set1-career-play",
        title:
          "1 Kariyer maçı oyna",
        type: "career-played",
        target: 1,
      },

      {
        id: "set1-event-play",
        title:
          "1 Etkinlik maçı oyna",
        type: "event-played",
        target: 1,
      },

      {
        id: "set1-win",
        title:
          "Herhangi bir maç kazan",
        type: "total-wins",
        target: 1,
      },
    ],
  },

  {
    id: 2,
    title: "KADRONU GELİŞTİR",
    description:
      "Yeni oyuncular al ve takımını güçlendir.",

    missions: [
      {
        id: "set2-transfer-buy",
        title:
          "Transferden 1 oyuncu satın al",
        type: "market-buys",
        target: 1,
      },

      {
        id: "set2-collection",
        title:
          "Koleksiyonunda 12 oyuncuya ulaş",
        type: "collection-count",
        target: 12,
      },

      {
        id: "set2-training-start",
        title:
          "1 oyuncuyu antrenmana gönder",
        type: "training-started",
        target: 1,
      },

      {
        id: "set2-training-finish",
        title:
          "1 antrenmanı tamamla",
        type: "training-completed",
        target: 1,
      },

      {
        id: "set2-career-wins",
        title:
          "3 Kariyer maçı kazan",
        type: "career-wins",
        target: 3,
      },
    ],
  },

  {
    id: 3,
    title: "KULÜBÜ BÜYÜT",
    description:
      "Kadronu derinleştir ve etkinliklerde ilerle.",

    missions: [
      {
        id: "set3-event-wins",
        title:
          "5 Etkinlik maçı kazan",
        type: "event-wins",
        target: 5,
      },

      {
        id: "set3-collection-15",
        title:
          "Koleksiyonunda 15 oyuncuya ulaş",
        type: "collection-count",
        target: 15,
      },

      {
        id: "set3-countries",
        title:
          "5 farklı ülkeden oyuncuya sahip ol",
        type: "country-count",
        target: 5,
      },

      {
        id: "set3-overall",
        title:
          "Ana kadro ortalamanı 25 GEN yap",
        type: "squad-average",
        target: 25,
      },

      {
        id: "set3-career-stage",
        title:
          "Kariyer Aşama 1'i tamamla",
        type: "career-stage-complete",
        target: 1,
      },
    ],
  },

  {
    id: 4,
    title: "YENİ AŞAMA",
    description:
      "İlk aşamayı tamamen geç ve yeni sistemleri aç.",

    missions: [
      {
        id: "set4-event-stage",
        title:
          "Etkinlik Aşama 1'i tamamla",
        type: "event-stage-complete",
        target: 1,
      },

      {
        id: "set4-stage2",
        title:
          "Aşama 2'ye ulaş",
        type: "active-stage",
        target: 2,
      },

      {
        id: "set4-overall30",
        title:
          "30 GEN veya üstü bir oyuncuya sahip ol",
        type: "highest-overall",
        target: 30,
      },

      {
        id: "set4-career-wins",
        title:
          "Toplam 10 Kariyer galibiyetine ulaş",
        type: "career-wins",
        target: 10,
      },

      {
        id: "set4-event-shop",
        title:
          "Etkinlik mağazasından 1 oyuncu al",
        type: "event-shop-buys",
        target: 1,
      },
    ],
  },

  {
    id: 5,
    title: "KİRALIK MERKEZİ",
    description:
      "Kulübün için yeni gelir yolları oluştur.",

    missions: [
      {
        id: "set5-rental-unlock",
        title:
          "Kiralık Merkezi'ni aç",
        type: "rental-unlocked",
        target: 1,
      },

      {
        id: "set5-rent-player",
        title:
          "1 oyuncuyu kiraya ver",
        type: "rentals-started",
        target: 1,
      },

      {
        id: "set5-rental-income",
        title:
          "Kiralıktan Coin kazan",
        type: "rental-income-claimed",
        target: 1,
      },

      {
        id: "set5-collection20",
        title:
          "20 oyuncuya sahip ol",
        type: "collection-count",
        target: 20,
      },

      {
        id: "set5-squad35",
        title:
          "Ana kadro ortalamanı 35 GEN yap",
        type: "squad-average",
        target: 35,
      },
    ],
  },

  {
    id: 6,
    title: "ANTRENÖRLER",
    description:
      "Profesyonel gelişim sistemini kullan.",

    missions: [
      {
        id: "set6-coach-buy",
        title:
          "İlk antrenörünü satın al",
        type: "coaches-owned",
        target: 1,
      },

      {
        id: "set6-coach-session",
        title:
          "Antrenör ile 1 oyuncu geliştir",
        type: "coach-sessions-completed",
        target: 1,
      },

      {
        id: "set6-player50",
        title:
          "50 GEN oyuncuya sahip ol",
        type: "highest-overall",
        target: 50,
      },

      {
        id: "set6-stage3",
        title:
          "Aşama 3'e ulaş",
        type: "active-stage",
        target: 3,
      },

      {
        id: "set6-totalwins",
        title:
          "Toplam 25 maç kazan",
        type: "total-wins",
        target: 25,
      },
    ],
  },

  {
    id: 7,
    title: "PROFESYONEL KULÜP",
    description:
      "Takımını üst seviyelere çıkar.",

    missions: [
      {
        id: "set7-squad50",
        title:
          "Ana kadro ortalamanı 50 GEN yap",
        type: "squad-average",
        target: 50,
      },

      {
        id: "set7-collection30",
        title:
          "30 oyuncuya sahip ol",
        type: "collection-count",
        target: 30,
      },

      {
        id: "set7-countries10",
        title:
          "10 farklı ülkeden oyuncuya sahip ol",
        type: "country-count",
        target: 10,
      },

      {
        id: "set7-stage5",
        title:
          "Aşama 5'e ulaş",
        type: "active-stage",
        target: 5,
      },

      {
        id: "set7-career30",
        title:
          "30 Kariyer maçı kazan",
        type: "career-wins",
        target: 30,
      },
    ],
  },

  {
    id: 8,
    title: "ELİT SEVİYE",
    description:
      "Oyunun üst seviyelerine ulaş.",

    missions: [
      {
        id: "set8-player80",
        title:
          "80 GEN oyuncuya sahip ol",
        type: "highest-overall",
        target: 80,
      },

      {
        id: "set8-squad70",
        title:
          "Ana kadro ortalamanı 70 GEN yap",
        type: "squad-average",
        target: 70,
      },

      {
        id: "set8-stage7",
        title:
          "Aşama 7'ye ulaş",
        type: "active-stage",
        target: 7,
      },

      {
        id: "set8-event40",
        title:
          "40 Etkinlik maçı kazan",
        type: "event-wins",
        target: 40,
      },

      {
        id: "set8-coach3",
        title:
          "3 farklı antrenöre sahip ol",
        type: "coaches-owned",
        target: 3,
      },
    ],
  },

  {
    id: 9,
    title: "DÜNYA KLASI",
    description:
      "Final aşamalarına hazırlan.",

    missions: [
      {
        id: "set9-player95",
        title:
          "95 GEN oyuncuya sahip ol",
        type: "highest-overall",
        target: 95,
      },

      {
        id: "set9-squad85",
        title:
          "Ana kadro ortalamanı 85 GEN yap",
        type: "squad-average",
        target: 85,
      },

      {
        id: "set9-stage9",
        title:
          "Aşama 9'a ulaş",
        type: "active-stage",
        target: 9,
      },

      {
        id: "set9-career80",
        title:
          "80 Kariyer maçı kazan",
        type: "career-wins",
        target: 80,
      },

      {
        id: "set9-total100",
        title:
          "Toplam 100 maç kazan",
        type: "total-wins",
        target: 100,
      },
    ],
  },

  {
    id: 10,
    title: "SON YOL",
    description:
      "EL TURCO'ya ulaş ve ana yolu tamamla.",

    missions: [
      {
        id: "set10-stage10",
        title:
          "Aşama 10'a ulaş",
        type: "active-stage",
        target: 10,
      },

      {
        id: "set10-career10",
        title:
          "Kariyer Aşama 10'u tamamla",
        type: "career-stage-complete",
        target: 10,
      },

      {
        id: "set10-event10",
        title:
          "Etkinlik Aşama 10'u tamamla",
        type: "event-stage-complete",
        target: 10,
      },

      {
        id: "set10-player99",
        title:
          "99 GEN oyuncuya sahip ol",
        type: "highest-overall",
        target: 99,
      },

      {
        id: "set10-elturco",
        title:
          "EL TURCO'yu koleksiyonuna kat",
        type: "elturco-owned",
        target: 1,
      },
    ],
  },
];

/* =========================================================
   DEFAULT MISSION SAVE
========================================================= */

export function createMissionState() {
  return {
    activeSet: 1,

    claimedSets: [],

    stats: {
      autoLineupUsed: 0,

      careerPlayed: 0,
      eventPlayed: 0,

      careerWins: 0,
      eventWins: 0,
      totalWins: 0,

      marketBuys: 0,
      eventShopBuys: 0,

      trainingStarted: 0,
      trainingCompleted: 0,

      rentalsStarted: 0,
      rentalIncomeClaimed: 0,

      coachSessionsCompleted: 0,
    },

    mainPathCompleted: false,
  };
}

/* =========================================================
   SAVE MIGRATION
========================================================= */

export function ensureMissionState(
  missions
) {
  const fresh =
    createMissionState();

  if (!missions) {
    return fresh;
  }

  return {
    ...fresh,
    ...missions,

    claimedSets:
      Array.isArray(
        missions.claimedSets
      )
        ? missions.claimedSets
        : [],

    stats: {
      ...fresh.stats,
      ...(missions.stats ||
        {}),
    },
  };
}

/* =========================================================
   BASİT STAT ARTTIR
========================================================= */

export function incrementMissionStat(
  missions,
  stat,
  amount = 1
) {
  const safe =
    ensureMissionState(
      missions
    );

  return {
    ...safe,

    stats: {
      ...safe.stats,

      [stat]:
        Number(
          safe.stats[
            stat
          ] || 0
        ) +
        Number(amount || 0),
    },
  };
}

/* =========================================================
   KOLEKSİYON YARDIMCILARI
========================================================= */

function getOwnedPlayers(
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

function getCollectionCount(
  game
) {
  return getOwnedPlayers(
    game
  ).length;
}

function getCountryCount(
  game
) {
  return new Set(
    getOwnedPlayers(
      game
    )
      .map(
        (player) =>
          player.country
      )
      .filter(Boolean)
  ).size;
}

function getHighestOverall(
  game
) {
  return getOwnedPlayers(
    game
  ).reduce(
    (highest, player) =>
      Math.max(
        highest,
        Number(
          player.overall
        ) || 0
      ),
    0
  );
}

function hasElTurco(
  game
) {
  return getOwnedPlayers(
    game
  ).some(
    (player) =>
      player.rarity ===
        "elturco" ||
      player.overall ===
        100 ||
      player.name
        ?.toUpperCase()
        .includes(
          "EL TURCO"
        )
  );
}

/* =========================================================
   ANA KADRO ORTALAMA GEN

   Farklı save yapılarını destekler.
========================================================= */

function getFormationIds(
  game
) {
  const ids = [];

  const add = (value) => {
    if (!value) return;

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
    game?.formation ||
    game?.team
      ?.formation ||
    {};

  Object.values(
    formation
  ).forEach(
    (value) => {
      if (
        Array.isArray(
          value
        )
      ) {
        value.forEach(
          add
        );
      } else {
        add(value);
      }
    }
  );

  [
    game?.squad,
    game?.activeSquad,
    game?.lineup,
    game?.startingXI,
  ].forEach(
    (list) => {
      if (
        Array.isArray(
          list
        )
      ) {
        list.forEach(
          add
        );
      }
    }
  );

  return [
    ...new Set(ids),
  ].slice(0, 10);
}

function getSquadAverage(
  game
) {
  const ids =
    getFormationIds(game);

  const players =
    getOwnedPlayers(game);

  const squad =
    ids
      .map((id) =>
        players.find(
          (player) =>
            player.id === id
        )
      )
      .filter(Boolean);

  if (!squad.length) {
    return 0;
  }

  return Math.round(
    squad.reduce(
      (sum, player) =>
        sum +
        Number(
          player.overall ||
            0
        ),
      0
    ) /
      squad.length
  );
}

/* =========================================================
   KADRO HAZIR MI?
========================================================= */

function isFormationReady(
  game
) {
  return (
    getFormationIds(
      game
    ).length >= 10
  );
}

/* =========================================================
   TAMAMLANAN KARİYER AŞAMALARI
========================================================= */

function isCareerStageComplete(
  game,
  stage
) {
  const completed =
    game?.career
      ?.completedStages ||
    game?.completedCareerStages ||
    [];

  return completed.includes(
    stage
  );
}

/* =========================================================
   TAMAMLANAN EVENT AŞAMALARI
========================================================= */

function isEventStageComplete(
  game,
  stage
) {
  const completed =
    game?.events
      ?.completedStages ||
    game
      ?.completedEventStages ||
    [];

  if (
    completed.includes(
      stage
    )
  ) {
    return true;
  }

  const eventStates =
    game?.events || {};

  return Object.values(
    eventStates
  ).some(
    (event) =>
      Number(
        event?.stage
      ) === Number(stage) &&
      event?.completed
  );
}

/* =========================================================
   MISSION PROGRESS
========================================================= */

export function getMissionProgress(
  mission,
  game,
  missionState
) {
  const state =
    ensureMissionState(
      missionState
    );

  const stats =
    state.stats;

  let current = 0;

  switch (
    mission.type
  ) {
    case "formation-ready":
      current =
        isFormationReady(
          game
        )
          ? 1
          : 0;
      break;

    case "auto-lineup-used":
      current =
        stats.autoLineupUsed;
      break;

    case "career-played":
      current =
        stats.careerPlayed;
      break;

    case "event-played":
      current =
        stats.eventPlayed;
      break;

    case "career-wins":
      current =
        stats.careerWins;
      break;

    case "event-wins":
      current =
        stats.eventWins;
      break;

    case "total-wins":
      current =
        stats.totalWins;
      break;

    case "market-buys":
      current =
        stats.marketBuys;
      break;

    case "event-shop-buys":
      current =
        stats.eventShopBuys;
      break;

    case "training-started":
      current =
        stats.trainingStarted;
      break;

    case "training-completed":
      current =
        stats.trainingCompleted;
      break;

    case "collection-count":
      current =
        getCollectionCount(
          game
        );
      break;

    case "country-count":
      current =
        getCountryCount(
          game
        );
      break;

    case "squad-average":
      current =
        getSquadAverage(
          game
        );
      break;

    case "highest-overall":
      current =
        getHighestOverall(
          game
        );
      break;

    case "active-stage":
      current =
        Number(
          game?.activeStage ||
            1
        );
      break;

    case "career-stage-complete":
      current =
        isCareerStageComplete(
          game,
          mission.target
        )
          ? mission.target
          : 0;
      break;

    case "event-stage-complete":
      current =
        isEventStageComplete(
          game,
          mission.target
        )
          ? mission.target
          : 0;
      break;

    case "rental-unlocked":
      current =
        game?.rentalCenter
          ?.unlocked ||
        game?.rentalUnlocked
          ? 1
          : 0;
      break;

    case "rentals-started":
      current =
        stats.rentalsStarted;
      break;

    case "rental-income-claimed":
      current =
        stats.rentalIncomeClaimed;
      break;

    case "coaches-owned":
      current =
        game?.coaches
          ?.owned?.length ||
        game?.ownedCoaches
          ?.length ||
        0;
      break;

    case "coach-sessions-completed":
      current =
        stats
          .coachSessionsCompleted;
      break;

    case "elturco-owned":
      current =
        hasElTurco(
          game
        )
          ? 1
          : 0;
      break;

    default:
      current = 0;
      break;
  }

  const target =
    Number(
      mission.target
    ) || 1;

  return {
    current:
      Math.min(
        target,
        Math.max(
          0,
          Number(current) ||
            0
        )
      ),

    target,

    completed:
      Number(current) >=
      target,

    percentage:
      Math.min(
        100,
        Math.round(
          (Number(
            current
          ) /
            target) *
            100
        )
      ),
  };
}

/* =========================================================
   AKTİF SET
========================================================= */

export function getActiveMissionSet(
  missionState
) {
  const state =
    ensureMissionState(
      missionState
    );

  return (
    missionSets.find(
      (set) =>
        set.id ===
        state.activeSet
    ) ||
    missionSets[
      missionSets.length -
        1
    ]
  );
}

/* =========================================================
   SET ÖZETİ
========================================================= */

export function getMissionSetStatus(
  game,
  missionState
) {
  const state =
    ensureMissionState(
      missionState
    );

  const set =
    getActiveMissionSet(
      state
    );

  const missions =
    set.missions.map(
      (mission) => ({
        ...mission,

        progress:
          getMissionProgress(
            mission,
            game,
            state
          ),
      })
    );

  const completed =
    missions.filter(
      (mission) =>
        mission.progress
          .completed
    ).length;

  const total =
    missions.length;

  const rewardClaimed =
    state.claimedSets.includes(
      set.id
    );

  return {
    set,
    missions,
    completed,
    total,

    allCompleted:
      completed >= total,

    rewardClaimed,

    rewardReady:
      completed >= total &&
      !rewardClaimed,

    percentage:
      Math.round(
        (completed /
          total) *
          100
      ),

    label:
      `📋 GÖREVLER ${completed}/${total}`,
  };
}

/* =========================================================
   500 COIN ÖDÜLÜNÜ AL

   Coin'i App.jsx ekleyecek.
   Bu fonksiyon mission state'i ilerletir.
========================================================= */

export function claimMissionSetReward(
  missionState
) {
  const state =
    ensureMissionState(
      missionState
    );

  if (
    state.claimedSets.includes(
      state.activeSet
    )
  ) {
    return {
      success: false,
      state,
      reward: 0,
    };
  }

  const finalSet =
    state.activeSet >=
    missionSets.length;

  const next = {
    ...state,

    claimedSets: [
      ...state.claimedSets,
      state.activeSet,
    ],

    activeSet:
      finalSet
        ? state.activeSet
        : state.activeSet +
          1,

    mainPathCompleted:
      finalSet
        ? true
        : state.mainPathCompleted,
  };

  return {
    success: true,
    state: next,
    reward:
      MISSION_SET_REWARD,

    finished:
      finalSet,
  };
}

/* =========================================================
   ANA YOL GENEL İLERLEME
========================================================= */

export function getMainPathProgress(
  game,
  missionState
) {
  const state =
    ensureMissionState(
      missionState
    );

  let completed = 0;

  let total = 0;

  missionSets.forEach(
    (set) => {
      set.missions.forEach(
        (mission) => {
          total += 1;

          if (
            getMissionProgress(
              mission,
              game,
              state
            ).completed
          ) {
            completed += 1;
          }
        }
      );
    }
  );

  return {
    completed,
    total,

    percentage:
      Math.min(
        100,
        Math.round(
          (completed /
            total) *
            100
        )
      ),

    finished:
      state
        .mainPathCompleted,

    text:
      state
        .mainPathCompleted
        ? "🏆 ANA YOL TAMAMLANDI"
        : `ANA YOL %${Math.min(
            100,
            Math.round(
              (completed /
                total) *
                100
            )
          )}`,
  };
}