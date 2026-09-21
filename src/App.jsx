import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PlayerCard from "./components/PlayerCard";

import {
  calculatePlayerPrice,
  calculateRentalIncome,
  calculateTrainingCost,
  careerLeagues,
  countries,
  createCustomPlayer,
  createStageRewardPlayer,
  eventConfigs,
  generateEventShop,
  generateMarketPlayers,
  generateOpponentDeck,
  generatePlayer,
  generateStarterPlayers,
  getCountryFlag,
  getEventConfig,
  getPositionGroup,
  getRarity,
  getStageReward,
  getUpgradePackReward,
  positions,
  randomItem,
  shuffle,
  trainingPlans,
} from "./data/players";

import {
  canRentPlayer,
  canSellPlayer,
  canSendToCoach,
  canSendToTraining,
  EVENT_MATCH_COOLDOWN_MS,
  getFullTrainingForPlayer,
  isPlayerBusy,
  isPlayerInActiveFormation,
  millisecondsToClock,
} from "./utils/gameRules";

import {
  calculateAverageOverall,
  calculateEventCurrencyReward,
  calculateRoundResult,
  chooseOpponentForRound,
  clampOpponentDeck,
  createRandomFiveRounds,
  getAvailablePlayersForRound,
  getRoundLabel,
} from "./utils/battleEngine";

import {
  buildBestLineup,
} from "./utils/autoLineup";

import {
  ensureCareerFixtures,
  getCareerFixtureRows,
  getCareerFixtureSummary,
  getNextCareerMatch,
  recordCareerWin,
} from "./utils/careerFixtures";

import {
  getMarketStatus,
  manuallyRefreshMarket,
  markDealPurchased,
  removePurchasedMarketPlayer,
} from "./utils/marketEngine";

import {
  claimMissionSetReward,
  getMissionSetStatus,
  incrementMissionStat,
} from "./utils/missionSystem";

import {
  createToast,
  getAvailableStageReward,
  getCareerScreenData,
  getCurrentStageCap,
  getEventScreenData,
  getStageProgressStatus,
  markStageRewardClaimed,
  normalizeFinalSystems,
} from "./utils/finalGameSystems";

import {
  publishCurrentScreen,
  readFinalSave,
  useFinalGameSystems,
} from "./utils/useFinalGameSystems";

/* =========================================================
   SABİTLER
========================================================= */

const STORE_TEST_MODE = true;

const MANUAL_MARKET_REFRESH_COST = 100;
const CUSTOM_PLAYER_COST = 750;

const RENTAL_UNLOCK_COST = 1000;

const RENTAL_SLOT_PRICES = [
  200,
  500,
  1000,
  2000,
  5000,
];

const MAX_RENTAL_SLOTS = 5;

const RENTAL_MAX_HOURS = 8;

const COACHES = [
  {
    id: "coach-1",
    stars: 1,
    name: "Yerel Antrenör",
    slots: 1,
    minutes: 120,
    price: 2500,
  },
  {
    id: "coach-2",
    stars: 2,
    name: "Bölgesel Antrenör",
    slots: 2,
    minutes: 120,
    price: 6500,
  },
  {
    id: "coach-3",
    stars: 3,
    name: "Profesyonel Antrenör",
    slots: 3,
    minutes: 90,
    price: 15000,
  },
  {
    id: "coach-4",
    stars: 4,
    name: "Elit Antrenör",
    slots: 4,
    minutes: 75,
    price: 35000,
  },
  {
    id: "coach-5",
    stars: 5,
    name: "Dünya Klası",
    slots: 5,
    minutes: 60,
    price: 80000,
  },
];

const COIN_PACKAGES = [
  {
    id: "coins-3000",
    coins: 3000,
    price: "$1.00",
  },
  {
    id: "coins-5000",
    coins: 5000,
    price: "$1.50",
  },
  {
    id: "coins-12000",
    coins: 12000,
    price: "$3.00",
  },
  {
    id: "coins-30000",
    coins: 30000,
    price: "$6.00",
  },
  {
    id: "coins-75000",
    coins: 75000,
    price: "$12.00",
  },
];

const FORMATION_SLOTS = [
  {
    id: "fw1",
    label: "F",
    group: "forward",
  },
  {
    id: "fw2",
    label: "F",
    group: "forward",
  },

  {
    id: "mid1",
    label: "OS",
    group: "midfield",
  },
  {
    id: "mid2",
    label: "OS",
    group: "midfield",
  },
  {
    id: "mid3",
    label: "OS",
    group: "midfield",
  },

  {
    id: "def1",
    label: "D",
    group: "defense",
  },
  {
    id: "def2",
    label: "D",
    group: "defense",
  },
  {
    id: "def3",
    label: "D",
    group: "defense",
  },
  {
    id: "def4",
    label: "D",
    group: "defense",
  },

  {
    id: "gk",
    label: "GK",
    group: "goalkeeper",
  },
];

/* =========================================================
   YENİ OYUN
========================================================= */

function createEventStates() {
  return Object.fromEntries(
    eventConfigs.map(
      (event, index) => [
        event.id,
        {
          stage: event.stage,
          match: 1,
          currency: 0,
          completed: false,
          nextMatchAt: 0,
          shop:
            generateEventShop(
              event,
              index
            ),
        },
      ]
    )
  );
}

function createNewGame() {
  const starters =
    generateStarterPlayers(11);

  const marketPlayers =
    generateMarketPlayers(
      6,
      25
    );

  const initial = {
    saveVersion: 6,

    clubName: "",

    coins: 1500,

    gems: 0,

    trophies: 0,

    activeStage: 1,

    collection:
      starters,

    squad:
      starters
        .slice(0, 10)
        .map(
          (player) =>
            player.id
        ),

    formation: {},

    market:
      marketPlayers,

    marketCap: 25,

    trainingCap: 30,

    training: null,

    fullTraining: false,

    packs: {
      gen1: 0,
      gen2: 0,
      gen4: 0,
    },

    career: {
      match: 1,
      wins: 0,
      completedStages: [],
    },

    careerFixtures:
      ensureCareerFixtures(
        {}
      ),

    events:
      createEventStates(),

    daily: {
      lastClaimAt: 0,
      streak: 0,
    },

    rentalCenter: {
      unlocked: false,
      slots: 1,
      rentals: [],
      pendingCoins: 0,
    },

    coaches: {
      owned: [],
      activeSessions: [],
    },

    redeemedCoupons: [],

    storePurchases: [],

    progression: {
      stageRewardClaimed: [],
    },

    missions: null,
  };

  return normalizeFinalSystems(
    initial
  );
}

/* =========================================================
   GENEL YARDIMCILAR
========================================================= */

function money(value) {
  return Number(
    value || 0
  ).toLocaleString();
}

function getPlayerById(
  game,
  id
) {
  return game.collection.find(
    (player) =>
      player.id === id
  );
}

function getSquadPlayers(
  game
) {
  return (
    game.squad || []
  )
    .map((id) =>
      getPlayerById(
        game,
        id
      )
    )
    .filter(Boolean);
}

function calculateSellPrice(
  player
) {
  return Math.max(
    50,
    Math.floor(
      calculatePlayerPrice(
        player.overall
      ) * 0.6
    )
  );
}

function getPlayerStatus(
  player,
  game
) {
  if (
    isPlayerInActiveFormation(
      player,
      game
    )
  ) {
    return "🔒 KADRODA";
  }

  if (
    game.training
      ?.playerId ===
    player.id
  ) {
    return "ANTRENMANDA";
  }

  if (
    game.coaches
      ?.activeSessions
      ?.some(
        (session) =>
          session.playerIds
            ?.includes(
              player.id
            )
      )
  ) {
    return "ANTRENÖRDE";
  }

  if (
    game.rentalCenter
      ?.rentals
      ?.some(
        (rental) =>
          rental.playerId ===
            player.id &&
          rental.endsAt >
            Date.now()
      )
  ) {
    return "KİRALIKTA";
  }

  if (player.sold) {
    return "SATILDI";
  }

  return "";
}

function StatChip({
  children,
}) {
  return (
    <div className="stat-chip">
      {children}
    </div>
  );
}

function BackButton({
  onClick,
}) {
  return (
    <button
      type="button"
      className="back-button"
      onClick={onClick}
    >
      ← GERİ
    </button>
  );
}

function SectionHeader({
  eyebrow,
  title,
  right,
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && (
          <div className="section-eyebrow">
            {eyebrow}
          </div>
        )}

        <h1>{title}</h1>
      </div>

      {right}
    </div>
  );
}

/* =========================================================
   KULÜP LOGOSU
========================================================= */

function ClubCrest({
  club,
  small = false,
}) {
  return (
    <div
      className={`club-crest ${
        small
          ? "club-crest-small"
          : ""
      }`}
      style={{
        background:
          `linear-gradient(145deg, ${club?.primary || "#28384f"}, ${club?.secondary || "#ddd"})`,
      }}
    >
      <span>
        {club?.crest ||
          club?.short ||
          "SC"}
      </span>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [
    screen,
    setScreen,
  ] = useState("home");

  const [
    battle,
    setBattle,
  ] = useState(null);

  const [
    toast,
    setToast,
  ] = useState(null);

  const [
    now,
    setNow,
  ] = useState(
    Date.now()
  );

  const [
    game,
    setGame,
  ] = useState(() => {
    const loaded =
      readFinalSave();

    return loaded
      ? normalizeFinalSystems(
          loaded
        )
      : createNewGame();
  });

  const [
    activeEventId,
    setActiveEventId,
  ] = useState(
    eventConfigs[0]?.id ||
      "street"
  );

  const [
    clubInput,
    setClubInput,
  ] = useState("");

  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState(null);

  const [
    trainingPlayerId,
    setTrainingPlayerId,
  ] = useState(null);

  const [
    coachPlayerIds,
    setCoachPlayerIds,
  ] = useState([]);

  const [
    selectedCoachId,
    setSelectedCoachId,
  ] = useState(null);

  const [
    customName,
    setCustomName,
  ] = useState("");

  const [
    customPosition,
    setCustomPosition,
  ] = useState("ST");

  const [
    customCountry,
    setCustomCountry,
  ] = useState("TR");

  const [
    couponInput,
    setCouponInput,
  ] = useState("");

  const [
    installPrompt,
    setInstallPrompt,
  ] = useState(null);

  const finalSystems =
    useFinalGameSystems({
      game,
      setGame,
      now,
      activeEventId,
      toast,
      setToast,
    });

  const {
    homeData,
    careerData,
    eventData,
    marketData,
    missionData,
    stageStatus,
    showToast,
  } = finalSystems;

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setNow(
            Date.now()
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);

  /* =======================================================
     SCREEN → MAIN.JSX
  ======================================================= */

  useEffect(() => {
    publishCurrentScreen(
      screen,
      battle
    );
  }, [
    screen,
    battle,
  ]);

  /* =======================================================
     PWA
  ======================================================= */

  useEffect(() => {
    const handler =
      (event) => {
        event.preventDefault();

        setInstallPrompt(
          event
        );
      };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
  }, []);

  /* =======================================================
     ANTRENMAN BİTİŞİ
  ======================================================= */

  useEffect(() => {
    if (
      !game.training ||
      now <
        game.training.endsAt
    ) {
      return;
    }

    const training =
      game.training;

    setGame(
      (previous) => {
        const player =
          previous.collection.find(
            (item) =>
              item.id ===
              training.playerId
          );

        if (!player) {
          return {
            ...previous,
            training: null,
          };
        }

        const cap =
          getCurrentStageCap(
            previous
          );

        const overall =
          Math.min(
            cap,
            player.overall +
              training.gain
          );

        return {
          ...previous,

          collection:
            previous.collection.map(
              (item) =>
                item.id ===
                player.id
                  ? {
                      ...item,
                      overall,
                      rarity:
                        getRarity(
                          overall
                        ),
                    }
                  : item
            ),

          training: null,

          missions:
            incrementMissionStat(
              previous.missions,
              "trainingCompleted"
            ),
        };
      }
    );

    showToast(
      "✅ Antrenman tamamlandı.",
      "success"
    );
  }, [
    now,
    game.training,
  ]);

  /* =======================================================
     ANTRENÖR SEANSLARI
  ======================================================= */

  useEffect(() => {
    const finished =
      game.coaches
        ?.activeSessions
        ?.filter(
          (session) =>
            now >=
            session.endsAt
        ) || [];

    if (!finished.length) {
      return;
    }

    setGame(
      (previous) => {
        let collection = [
          ...previous.collection,
        ];

        finished.forEach(
          (session) => {
            collection =
              collection.map(
                (player) => {
                  if (
                    !session.playerIds
                      .includes(
                        player.id
                      )
                  ) {
                    return player;
                  }

                  const cap =
                    getCurrentStageCap(
                      previous
                    );

                  const overall =
                    Math.min(
                      cap,
                      player.overall +
                        1
                    );

                  return {
                    ...player,
                    overall,
                    rarity:
                      getRarity(
                        overall
                      ),
                  };
                }
              );
          }
        );

        return {
          ...previous,

          collection,

          coaches: {
            ...previous.coaches,

            activeSessions:
              previous.coaches
                .activeSessions
                .filter(
                  (session) =>
                    now <
                    session.endsAt
                ),
          },

          missions:
            incrementMissionStat(
              previous.missions,
              "coachSessionsCompleted",
              finished.length
            ),
        };
      }
    );

    showToast(
      "⭐ Antrenör çalışması tamamlandı.",
      "success"
    );
  }, [
    now,
    game.coaches
      ?.activeSessions,
  ]);

  /* =======================================================
     KİRALIK BİTİŞLERİ
  ======================================================= */

  useEffect(() => {
    const finished =
      game.rentalCenter
        ?.rentals
        ?.filter(
          (rental) =>
            now >=
              rental.endsAt &&
            !rental.finished
        ) || [];

    if (!finished.length) {
      return;
    }

    setGame(
      (previous) => {
        let income = 0;

        const rentals =
          previous.rentalCenter
            .rentals.map(
              (rental) => {
                if (
                  now <
                    rental.endsAt ||
                  rental.finished
                ) {
                  return rental;
                }

                const player =
                  previous.collection.find(
                    (item) =>
                      item.id ===
                      rental.playerId
                  );

                const earned =
                  player
                    ? Math.round(
                        player.overall *
                          80
                      )
                    : 0;

                income +=
                  earned;

                return {
                  ...rental,
                  finished: true,
                  earned,
                };
              }
            );

        return {
          ...previous,

          rentalCenter: {
            ...previous.rentalCenter,
            rentals,
            pendingCoins:
              Number(
                previous
                  .rentalCenter
                  .pendingCoins ||
                  0
              ) + income,
          },
        };
      }
    );

    showToast(
      "💼 Kiralık oyuncu geri döndü.",
      "info"
    );
  }, [
    now,
    game.rentalCenter
      ?.rentals,
  ]);

  /* =======================================================
     TÜRETİLENLER
  ======================================================= */

  const squadPlayers =
    useMemo(
      () =>
        getSquadPlayers(
          game
        ),
      [game]
    );

  const squadAverage =
    useMemo(
      () =>
        calculateAverageOverall(
          squadPlayers
        ),
      [squadPlayers]
    );

  const stageCap =
    getCurrentStageCap(
      game
    );

  const ownedPlayers =
    game.collection.filter(
      (player) =>
        !player.sold
    );

  const activeLeague =
    careerLeagues.find(
      (league) =>
        league.stage ===
        game.activeStage
    ) ||
    careerLeagues[0];

  const activeEvent =
    eventConfigs.find(
      (event) =>
        event.stage ===
        game.activeStage
    ) ||
    getEventConfig(
      activeEventId
    ) ||
    eventConfigs[0];

  /* =======================================================
     NAV
  ======================================================= */

  function openScreen(
    next
  ) {
    setSelectedSlot(null);
    setScreen(next);
  }

  function goHome() {
    setBattle(null);
    setSelectedSlot(null);
    setScreen("home");
  }

  /* =======================================================
     KULÜP BAŞLAT
  ======================================================= */

  function createClub() {
    const name =
      clubInput.trim();

    if (!name) {
      showToast(
        "Kulüp adı yaz.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,
        clubName: name,
      })
    );

    showToast(
      "⚽ Kulüp kuruldu!",
      "success"
    );
  }

  /* =======================================================
     AUTO LINEUP
  ======================================================= */

  function autoBestSquad() {
    const result =
      buildBestLineup(
        game.collection,
        game,
        stageCap
      );

    const ids =
      result?.squadIds ||
      result?.squad ||
      [];

    if (
      ids.length < 10
    ) {
      showToast(
        "Uygun 10 oyuncu bulunamadı.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        squad:
          ids.slice(
            0,
            10
          ),

        formation:
          result.formation ||
          previous.formation,

        missions:
          incrementMissionStat(
            previous.missions,
            "autoLineupUsed"
          ),
      })
    );

    showToast(
      `✅ En iyi kadro otomatik kuruldu. Ortalama GEN: ${
        result.averageOverall ||
        result.average ||
        "?"
      }`,
      "success"
    );
  }

  /* =======================================================
     SLOT PLAYER
  ======================================================= */

  function playerFitsSlot(
    player,
    slot
  ) {
    return (
      getPositionGroup(
        player.position
      ) === slot.group
    );
  }

  function putPlayerInSlot(
    player
  ) {
    if (!selectedSlot) {
      return;
    }

    const existingId =
      game.formation?.[
        selectedSlot.id
      ];

    let nextSquad = [
      ...(game.squad || []),
    ].filter(
      (id) =>
        id !== player.id
    );

    if (existingId) {
      nextSquad =
        nextSquad.filter(
          (id) =>
            id !== existingId
        );
    }

    nextSquad.push(
      player.id
    );

    setGame(
      (previous) => ({
        ...previous,

        squad:
          nextSquad.slice(
            0,
            10
          ),

        formation: {
          ...(previous.formation ||
            {}),

          [selectedSlot.id]:
            player.id,
        },
      })
    );

    setSelectedSlot(null);

    showToast(
      "✅ Kadro güncellendi.",
      "success"
    );
  }

  /* =======================================================
     ANTRENMAN
  ======================================================= */

  function startTraining(
    player,
    plan
  ) {
    const check =
      canSendToTraining(
        game,
        player,
        stageCap
      );

    if (!check.allowed) {
      showToast(
        check.message,
        "error"
      );
      return;
    }

    if (game.training) {
      showToast(
        "Zaten devam eden bir antrenman var.",
        "error"
      );
      return;
    }

    const cost =
      calculateTrainingCost(
        plan,
        player.overall
      );

    if (
      game.coins <
      cost
    ) {
      showToast(
        "Yeterli Coin yok.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          cost,

        training: {
          playerId:
            player.id,
          gain:
            plan.gain,
          startedAt:
            Date.now(),
          endsAt:
            Date.now() +
            plan.hours *
              60 *
              60 *
              1000,
        },

        missions:
          incrementMissionStat(
            previous.missions,
            "trainingStarted"
          ),
      })
    );

    setTrainingPlayerId(
      null
    );

    showToast(
      `🏋️ ${player.name} antrenmana başladı.`,
      "success"
    );
  }

  function startFullTraining(
    player
  ) {
    const plan =
      getFullTrainingForPlayer(
        game,
        player,
        stageCap
      );

    if (!plan.allowed) {
      showToast(
        plan.message,
        "error"
      );
      return;
    }

    if (game.training) {
      showToast(
        "Zaten devam eden bir antrenman var.",
        "error"
      );
      return;
    }

    if (
      game.coins <
      plan.cost
    ) {
      showToast(
        `FULL ANTRENMAN için ${money(
          plan.cost
        )} Coin gerekiyor.`,
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          plan.cost,

        training: {
          playerId:
            player.id,
          gain:
            plan.gain,
          full: true,
          startedAt:
            Date.now(),
          endsAt:
            Date.now() +
            plan.milliseconds,
        },

        missions:
          incrementMissionStat(
            previous.missions,
            "trainingStarted"
          ),
      })
    );

    setTrainingPlayerId(
      null
    );

    showToast(
      `🔥 FULL ANTRENMAN başladı: +${plan.gain} GEN`,
      "success"
    );
  }

  /* =======================================================
     TRANSFER
  ======================================================= */

  function buyMarketPlayer(
    player,
    deal = false
  ) {
    const price =
      Number(
        player.price ||
          calculatePlayerPrice(
            player.overall
          )
      );

    if (
      game.coins <
      price
    ) {
      showToast(
        "Yeterli Coin yok.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => {
        const marketSystem =
          deal
            ? markDealPurchased(
                previous
                  .marketSystem
              )
            : removePurchasedMarketPlayer(
                previous
                  .marketSystem,
                player.id
              );

        return {
          ...previous,

          coins:
            previous.coins -
            price,

          collection: [
            ...previous.collection,
            {
              ...player,
              price:
                undefined,
              normalPrice:
                undefined,
              deal:
                undefined,
            },
          ],

          marketSystem,

          missions:
            incrementMissionStat(
              previous.missions,
              "marketBuys"
            ),
        };
      }
    );

    showToast(
      `✅ ${player.name} transfer edildi.`,
      "success"
    );
  }

  function manualRefresh() {
    if (
      game.coins <
      MANUAL_MARKET_REFRESH_COST
    ) {
      showToast(
        "Yeterli Coin yok.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          MANUAL_MARKET_REFRESH_COST,

        marketSystem:
          manuallyRefreshMarket(
            previous.marketCap ||
              stageCap
          ),
      })
    );

    showToast(
      "🔄 Transfer pazarı yenilendi.",
      "info"
    );
  }

  function sellPlayer(
    player
  ) {
    const check =
      canSellPlayer(
        game,
        player
      );

    if (!check.allowed) {
      showToast(
        check.message,
        "error"
      );
      return;
    }

    const price =
      calculateSellPrice(
        player
      );

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          price,

        collection:
          previous.collection.map(
            (item) =>
              item.id ===
              player.id
                ? {
                    ...item,
                    sold: true,
                  }
                : item
          ),

        squad:
          previous.squad.filter(
            (id) =>
              id !==
              player.id
          ),
      })
    );

    showToast(
      `🪙 ${money(
        price
      )} Coin kazandın.`,
      "success"
    );
  }

  function createPlayer() {
    const name =
      customName.trim();

    if (!name) {
      showToast(
        "Oyuncu adı yaz.",
        "error"
      );
      return;
    }

    if (
      game.coins <
      CUSTOM_PLAYER_COST
    ) {
      showToast(
        "750 Coin gerekiyor.",
        "error"
      );
      return;
    }

    const player =
      createCustomPlayer(
        name,
        customPosition,
        customCountry
      );

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          CUSTOM_PLAYER_COST,

        collection: [
          ...previous.collection,
          player,
        ],
      })
    );

    setCustomName("");

    showToast(
      `✨ ${player.name} oluşturuldu.`,
      "success"
    );
  }

  /* =======================================================
     RENTAL
  ======================================================= */

  function unlockRental() {
    if (
      game.rentalCenter
        .unlocked
    ) {
      return;
    }

    if (
      game.coins <
      RENTAL_UNLOCK_COST
    ) {
      showToast(
        "1000 Coin gerekiyor.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          RENTAL_UNLOCK_COST,

        rentalCenter: {
          ...previous.rentalCenter,
          unlocked: true,
        },
      })
    );

    showToast(
      "🔓 Kiralık Merkezi açıldı.",
      "success"
    );
  }

  function buyRentalSlot() {
    const current =
      game.rentalCenter
        .slots;

    if (
      current >=
      MAX_RENTAL_SLOTS
    ) {
      return;
    }

    const price =
      RENTAL_SLOT_PRICES[
        current
      ];

    if (
      game.coins <
      price
    ) {
      showToast(
        "Yeterli Coin yok.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          price,

        rentalCenter: {
          ...previous.rentalCenter,
          slots:
            previous
              .rentalCenter
              .slots + 1,
        },
      })
    );

    showToast(
      "➕ Kiralık slot açıldı.",
      "success"
    );
  }

  function rentPlayer(
    player
  ) {
    const check =
      canRentPlayer(
        game,
        player
      );

    if (!check.allowed) {
      showToast(
        check.message,
        "error"
      );
      return;
    }

    const activeCount =
      game.rentalCenter
        .rentals.filter(
          (rental) =>
            !rental.finished &&
            rental.endsAt >
              now
        ).length;

    if (
      activeCount >=
      game.rentalCenter
        .slots
    ) {
      showToast(
        "Kiralık slotların dolu.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        rentalCenter: {
          ...previous.rentalCenter,

          rentals: [
            ...previous
              .rentalCenter
              .rentals,

            {
              id:
                `${Date.now()}-${player.id}`,

              playerId:
                player.id,

              startedAt:
                Date.now(),

              endsAt:
                Date.now() +
                RENTAL_MAX_HOURS *
                  60 *
                  60 *
                  1000,

              finished: false,
            },
          ],
        },

        missions:
          incrementMissionStat(
            previous.missions,
            "rentalsStarted"
          ),
      })
    );

    showToast(
      `💼 ${player.name} kiraya verildi.`,
      "success"
    );
  }

  function collectRentalIncome() {
    const amount =
      Number(
        game.rentalCenter
          .pendingCoins ||
          0
      );

    if (!amount) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          amount,

        rentalCenter: {
          ...previous.rentalCenter,

          pendingCoins: 0,

          rentals:
            previous
              .rentalCenter
              .rentals.filter(
                (rental) =>
                  !rental.finished
              ),
        },

        missions:
          incrementMissionStat(
            previous.missions,
            "rentalIncomeClaimed"
          ),
      })
    );

    showToast(
      `🪙 ${money(
        amount
      )} Coin toplandı.`,
      "success"
    );
  }

  /* =======================================================
     COACH
  ======================================================= */

  function buyCoach(
    coach
  ) {
    if (
      game.coaches.owned
        .includes(
          coach.id
        )
    ) {
      return;
    }

    if (
      game.coins <
      coach.price
    ) {
      showToast(
        "Yeterli Coin yok.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          coach.price,

        coaches: {
          ...previous.coaches,

          owned: [
            ...previous
              .coaches.owned,
            coach.id,
          ],
        },
      })
    );

    showToast(
      `⭐ ${coach.stars}★ antrenör alındı.`,
      "success"
    );
  }

  function startCoachSession() {
    const coach =
      COACHES.find(
        (item) =>
          item.id ===
          selectedCoachId
      );

    if (!coach) {
      showToast(
        "Antrenör seç.",
        "error"
      );
      return;
    }

    if (
      !game.coaches.owned
        .includes(
          coach.id
        )
    ) {
      return;
    }

    if (
      !coachPlayerIds.length
    ) {
      showToast(
        "Oyuncu seç.",
        "error"
      );
      return;
    }

    const selected =
      coachPlayerIds
        .map((id) =>
          getPlayerById(
            game,
            id
          )
        )
        .filter(Boolean);

    const invalid =
      selected.find(
        (player) =>
          !canSendToCoach(
            game,
            player,
            stageCap
          ).allowed
      );

    if (invalid) {
      showToast(
        `${invalid.name} kullanılamıyor.`,
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coaches: {
          ...previous.coaches,

          activeSessions: [
            ...previous
              .coaches
              .activeSessions,

            {
              id:
                `${Date.now()}-${coach.id}`,

              coachId:
                coach.id,

              playerIds:
                selected
                  .slice(
                    0,
                    coach.slots
                  )
                  .map(
                    (player) =>
                      player.id
                  ),

              startedAt:
                Date.now(),

              endsAt:
                Date.now() +
                coach.minutes *
                  60 *
                  1000,
            },
          ],
        },
      })
    );

    setCoachPlayerIds(
      []
    );

    showToast(
      "⭐ Antrenör çalışması başladı.",
      "success"
    );
  }

  /* =======================================================
     DAILY
  ======================================================= */

  function claimDaily() {
    const last =
      Number(
        game.daily
          ?.lastClaimAt ||
          0
      );

    const ready =
      !last ||
      Date.now() -
        last >=
        24 *
          60 *
          60 *
          1000;

    if (!ready) {
      showToast(
        "Günlük ödül henüz hazır değil.",
        "error"
      );
      return;
    }

    const streak =
      Math.min(
        7,
        Number(
          game.daily
            ?.streak ||
            0
        ) + 1
      );

    const coins =
      200 +
      streak * 75;

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          coins,

        daily: {
          lastClaimAt:
            Date.now(),

          streak,
        },
      })
    );

    showToast(
      `🎁 Günlük ödül: ${coins} Coin`,
      "success"
    );
  }

  /* =======================================================
     STORE
  ======================================================= */

  function buyCoinPack(
    pack
  ) {
    if (
      !STORE_TEST_MODE
    ) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          pack.coins,

        storePurchases: [
          ...(previous
            .storePurchases ||
            []),

          {
            id:
              pack.id,
            at:
              Date.now(),
          },
        ],
      })
    );

    showToast(
      `TEST: +${money(
        pack.coins
      )} Coin`,
      "success"
    );
  }

  function redeemCoupon() {
    const code =
      couponInput
        .trim()
        .toUpperCase();

    if (
      code !== "SAMSUN"
    ) {
      showToast(
        "Geçersiz kod.",
        "error"
      );
      return;
    }

    if (
      game.redeemedCoupons
        .includes(
          code
        )
    ) {
      showToast(
        "Bu kod daha önce kullanıldı.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          500000,

        redeemedCoupons: [
          ...previous
            .redeemedCoupons,
          code,
        ],
      })
    );

    setCouponInput("");

    showToast(
      "🧪 TEST kuponu uygulandı.",
      "success"
    );
  }

  /* =======================================================
     MISSION
  ======================================================= */

  function claimMissions() {
    const status =
      getMissionSetStatus(
        game,
        game.missions
      );

    if (
      !status.rewardReady
    ) {
      return;
    }

    const result =
      claimMissionSetReward(
        game.missions
      );

    if (!result.success) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          result.reward,

        missions:
          result.state,
      })
    );

    showToast(
      `📋 +${result.reward} Coin görev ödülü`,
      "success"
    );
  }

  /* =======================================================
     STAGE REWARD
  ======================================================= */

  function claimStageReward() {
    const reward =
      getAvailableStageReward(
        game
      );

    if (!reward) {
      return;
    }

    const player =
      createStageRewardPlayer(
        reward.stage
      );

    if (!player) {
      return;
    }

    setGame(
      (previous) => {
        const marked =
          markStageRewardClaimed(
            previous,
            reward.stage
          );

        return {
          ...marked,

          collection: [
            ...marked.collection,
            player,
          ],
        };
      }
    );

    showToast(
      `🏆 ${player.name} • ${player.overall} GEN kazandın!`,
      "success",
      2600
    );
  }

  /* =======================================================
     EVENT SHOP
  ======================================================= */

  function buyEventShopPlayer(
    player
  ) {
    const state =
      game.events?.[
        activeEvent.id
      ];

    const price =
      Number(
        player.eventPrice ||
          0
      );

    if (
      !state ||
      state.currency <
        price
    ) {
      showToast(
        "Yeterli etkinlik parası yok.",
        "error"
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        collection: [
          ...previous.collection,
          {
            ...player,
            eventPrice:
              undefined,
          },
        ],

        events: {
          ...previous.events,

          [activeEvent.id]: {
            ...previous
              .events[
              activeEvent.id
            ],

            currency:
              previous
                .events[
                activeEvent.id
              ].currency -
              price,

            shop:
              previous
                .events[
                activeEvent.id
              ].shop.filter(
                (item) =>
                  item.id !==
                  player.id
              ),
          },
        },

        missions:
          incrementMissionStat(
            previous.missions,
            "eventShopBuys"
          ),
      })
    );

    showToast(
      "✅ Etkinlik oyuncusu alındı.",
      "success"
    );
  }

  /* =======================================================
     BATTLE CREATE
  ======================================================= */

  function createBattle(
    mode
  ) {
    if (
      game.squad.length !==
      10
    ) {
      showToast(
        "Önce 10 kişilik ana kadroyu tamamla.",
        "error"
      );
      return;
    }

    if (
      mode === "career" &&
      ownedPlayers.filter(
        (player) =>
          !isPlayerBusy(
            player,
            game
          )
      ).length < 11
    ) {
      showToast(
        "Kariyer için en az 11 aktif oyuncu gerekli.",
        "error"
      );
      return;
    }

    let cap =
      stageCap;

    let target =
      Math.round(
        squadAverage
      );

    let opponentClub =
      null;

    let matchNumber = 1;

    if (
      mode === "career"
    ) {
      if (
        careerData
          ?.completed
      ) {
        showToast(
          "✅ Bu Kariyer aşaması tamamlandı.",
          "info"
        );
        return;
      }

      target =
        careerData
          ?.opponentAverage ||
        target;

      opponentClub =
        careerData
          ?.opponent;

      matchNumber =
        careerData
          ?.nextMatch
          ?.match ||
        1;
    }

    if (
      mode === "event"
    ) {
      const state =
        game.events?.[
          activeEvent.id
        ];

      if (
        state?.completed
      ) {
        showToast(
          "✅ Bu Etkinlik aşaması tamamlandı.",
          "info"
        );
        return;
      }

      if (
        Number(
          state?.nextMatchAt ||
            0
        ) >
        Date.now()
      ) {
        showToast(
          `⏳ ${millisecondsToClock(
            state.nextMatchAt -
              Date.now()
          )}`,
          "error"
        );
        return;
      }

      cap =
        activeEvent.playCap;

      target =
        eventData
          ?.opponentAverage ||
        target;

      matchNumber =
        state?.match || 1;
    }

    let opponentDeck =
      generateOpponentDeck(
        target,
        10,
        cap
      );

    opponentDeck =
      clampOpponentDeck(
        opponentDeck,
        cap
      );

    const rounds =
      createRandomFiveRounds();

    setBattle({
      mode,

      phase: "choose",

      roundIndex: 0,

      rounds,

      usedPlayerIds: [],

      usedOpponentIds: [],

      results: [],

      playerScore: 0,

      opponentScore: 0,

      opponentDeck,

      opponentClub,

      target,

      cap,

      matchNumber,

      reveal: null,
    });

    setGame(
      (previous) => ({
        ...previous,

        missions:
          incrementMissionStat(
            previous.missions,
            mode ===
              "career"
              ? "careerPlayed"
              : "eventPlayed"
          ),
      })
    );
  }

  /* =======================================================
     BATTLE ROUND
  ======================================================= */

  function playBattleCard(
    player
  ) {
    if (
      !battle ||
      battle.phase !==
        "choose"
    ) {
      return;
    }

    const group =
      battle.rounds[
        battle.roundIndex
      ];

    const opponent =
      chooseOpponentForRound(
        battle.opponentDeck,
        group,
        battle.usedOpponentIds
      );

    if (!opponent) {
      return;
    }

    const result =
      calculateRoundResult(
        player,
        opponent
      );

    setBattle(
      (previous) => ({
        ...previous,

        phase:
          "reveal",

        reveal: {
          player,
          opponent,
          result,
        },
      })
    );

    window.setTimeout(
      () => {
        setBattle(
          (previous) => {
            if (
              !previous ||
              !previous.reveal
            ) {
              return previous;
            }

            const result =
              previous.reveal
                .result;

            const newPlayerScore =
              previous.playerScore +
              (result.winner ===
              "player"
                ? 1
                : 0);

            const newOpponentScore =
              previous.opponentScore +
              (result.winner ===
              "opponent"
                ? 1
                : 0);

            const nextIndex =
              previous.roundIndex +
              1;

            const done =
              nextIndex >=
              previous.rounds
                .length;

            const next = {
              ...previous,

              playerScore:
                newPlayerScore,

              opponentScore:
                newOpponentScore,

              results: [
                ...previous.results,
                previous.reveal,
              ],

              usedPlayerIds: [
                ...previous
                  .usedPlayerIds,
                previous.reveal
                  .player.id,
              ],

              usedOpponentIds: [
                ...previous
                  .usedOpponentIds,
                previous.reveal
                  .opponent.id,
              ],

              roundIndex:
                nextIndex,

              reveal: null,

              phase:
                done
                  ? "finished"
                  : "choose",
            };

            if (done) {
              window.setTimeout(
                () =>
                  finishBattle(
                    next
                  ),
                50
              );
            }

            return next;
          }
        );
      },
      1500
    );
  }

  /* =======================================================
     BATTLE FINISH
  ======================================================= */

  function finishBattle(
    finalBattle
  ) {
    const won =
      finalBattle.playerScore >
      finalBattle.opponentScore;

    const draw =
      finalBattle.playerScore ===
      finalBattle.opponentScore;

    if (
      finalBattle.mode ===
      "career"
    ) {
      finishCareerBattle(
        finalBattle,
        won,
        draw
      );

      return;
    }

    finishEventBattle(
      finalBattle,
      won,
      draw
    );
  }

  function finishCareerBattle(
    finalBattle,
    won,
    draw
  ) {
    if (!won) {
      setBattle(
        (previous) => ({
          ...previous,
          phase: "result",
          finalResult:
            draw
              ? "draw"
              : "loss",
        })
      );

      return;
    }

    const rewardChoices =
      Array.from(
        {
          length: 3,
        },
        () =>
          generatePlayer(
            Math.max(
              10,
              finalBattle.target -
                4
            ),
            Math.min(
              finalBattle.cap,
              finalBattle.target +
                2
            )
          )
      );

    setBattle(
      (previous) => ({
        ...previous,

        phase:
          "reward-choice",

        finalResult: "win",

        rewardChoices,
      })
    );
  }

  function chooseCareerReward(
    player
  ) {
    const stage =
      game.activeStage;

    const match =
      battle.matchNumber;

    setGame(
      (previous) => {
        const fixtures =
          recordCareerWin(
            previous
              .careerFixtures,
            stage,
            match,
            player
          );

        const summary =
          getCareerFixtureSummary(
            fixtures,
            stage
          );

        const completedStages =
          summary.finished &&
          !previous.career
            .completedStages
            .includes(
              stage
            )
            ? [
                ...previous
                  .career
                  .completedStages,
                stage,
              ]
            : previous.career
                .completedStages;

        return {
          ...previous,

          coins:
            previous.coins +
            150 +
            stage * 50,

          collection: [
            ...previous.collection,
            player,
          ],

          careerFixtures:
            fixtures,

          career: {
            ...previous.career,

            wins:
              previous.career
                .wins + 1,

            completedStages,
          },

          missions:
            incrementMissionStat(
              incrementMissionStat(
                previous.missions,
                "careerWins"
              ),
              "totalWins"
            ),
        };
      }
    );

    setBattle(
      (previous) => ({
        ...previous,

        phase: "result",

        rewardPlayer:
          player,
      })
    );
  }

  function finishEventBattle(
    finalBattle,
    won,
    draw
  ) {
    const event =
      activeEvent;

    const currentState =
      game.events?.[
        event.id
      ];

    if (!won) {
      setGame(
        (previous) => ({
          ...previous,

          events: {
            ...previous.events,

            [event.id]: {
              ...previous
                .events[
                event.id
              ],

              nextMatchAt:
                Date.now() +
                EVENT_MATCH_COOLDOWN_MS,
            },
          },
        })
      );

      setBattle(
        (previous) => ({
          ...previous,

          phase: "result",

          finalResult:
            draw
              ? "draw"
              : "loss",
        })
      );

      return;
    }

    const currency =
      calculateEventCurrencyReward(
        event,
        currentState?.match ||
          1
      );

    const pack =
      getUpgradePackReward(
        currentState?.match ||
          1,
        event.matches
      );

    const rewardChoices =
      Array.from(
        {
          length: 3,
        },
        () =>
          generatePlayer(
            event.min,
            Math.min(
              event.playCap,
              event.max
            )
          )
      );

    setBattle(
      (previous) => ({
        ...previous,

        phase:
          "reward-choice-event",

        finalResult: "win",

        eventCurrencyReward:
          currency,

        packReward:
          pack,

        rewardChoices,
      })
    );
  }

  function chooseEventReward(
    player
  ) {
    const event =
      activeEvent;

    const state =
      game.events?.[
        event.id
      ];

    const currentMatch =
      state?.match || 1;

    const completed =
      currentMatch >=
      event.matches;

    const nextMatch =
      completed
        ? currentMatch
        : currentMatch + 1;

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          100 +
          game.activeStage *
            35,

        collection: [
          ...previous.collection,
          player,
        ],

        packs: {
          ...previous.packs,

          [battle.packReward]:
            Number(
              previous.packs?.[
                battle
                  .packReward
              ] || 0
            ) + 1,
        },

        events: {
          ...previous.events,

          [event.id]: {
            ...previous
              .events[
                event.id
              ],

            match:
              nextMatch,

            completed,

            currency:
              Number(
                previous
                  .events[
                  event.id
                ].currency ||
                  0
              ) +
              Number(
                battle
                  .eventCurrencyReward ||
                  0
              ),

            nextMatchAt:
              Date.now() +
              EVENT_MATCH_COOLDOWN_MS,
          },
        },

        missions:
          incrementMissionStat(
            incrementMissionStat(
              previous.missions,
              "eventWins"
            ),
            "totalWins"
          ),
      })
    );

    setBattle(
      (previous) => ({
        ...previous,

        phase: "result",

        rewardPlayer:
          player,
      })
    );
  }

  /* =======================================================
     BATTLE AVAILABLE
  ======================================================= */

  function availableRoundPlayers() {
    if (!battle) {
      return [];
    }

    const group =
      battle.rounds[
        battle.roundIndex
      ];

    return getAvailablePlayersForRound(
      squadPlayers,
      group,
      battle.usedPlayerIds
    );
  }

  /* =======================================================
     CSS
  ======================================================= */

  const APP_CSS = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background:
        radial-gradient(circle at top, #162535, #070a0e 48%, #030405);
      color: #f4f6f8;
      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    button,
    input,
    select {
      font: inherit;
    }

    button {
      -webkit-tap-highlight-color: transparent;
    }

    .scw-app {
      min-height: 100vh;
      padding: 18px;
    }

    .app-shell {
      width: min(1180px, 100%);
      margin: 0 auto;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0 14px;
      background:
        linear-gradient(
          180deg,
          rgba(7,10,14,.96),
          rgba(7,10,14,.8),
          transparent
        );
      backdrop-filter: blur(8px);
    }

    .brand {
      font-weight: 1000;
      letter-spacing: -.5px;
      font-size: 18px;
    }

    .brand span {
      color: #53d486;
    }

    .top-stats {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 7px;
    }

    .stat-chip {
      border: 1px solid #2c3641;
      background: #0e141b;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 900;
      white-space: nowrap;
    }

    .profile-chip {
      cursor: pointer;
    }

    .screen {
      padding-bottom: 60px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      margin: 12px 0 20px;
    }

    .section-header h1 {
      margin: 3px 0 0;
      font-size: clamp(24px, 4vw, 38px);
      line-height: 1;
    }

    .section-eyebrow {
      color: #708195;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 1.4px;
    }

    .back-button,
    .secondary-button,
    .primary-button,
    .danger-button,
    .gold-button {
      border-radius: 10px;
      min-height: 42px;
      padding: 0 14px;
      font-weight: 950;
      cursor: pointer;
    }

    .back-button,
    .secondary-button {
      border: 1px solid #34404c;
      background: #101720;
      color: #d9e0e8;
    }

    .primary-button {
      border: 1px solid #378c5b;
      background:
        linear-gradient(135deg, #1b743f, #0e4225);
      color: #eafff1;
    }

    .gold-button {
      border: 1px solid #987429;
      background:
        linear-gradient(135deg, #725418, #35250b);
      color: #ffe291;
    }

    .danger-button {
      border: 1px solid #783e39;
      background:
        linear-gradient(135deg, #542522, #281110);
      color: #ffb3ad;
    }

    button:disabled {
      opacity: .42;
      cursor: not-allowed;
    }

    .home-hero {
      position: relative;
      overflow: hidden;
      border: 1px solid #26313b;
      border-radius: 22px;
      min-height: 200px;
      padding: 25px;
      background:
        radial-gradient(circle at 80% 20%, rgba(54,212,125,.18), transparent 35%),
        linear-gradient(145deg, #101821, #080c11);
    }

    .home-hero h1 {
      margin: 4px 0;
      font-size: clamp(30px, 7vw, 62px);
      line-height: .95;
    }

    .home-hero p {
      color: #82909f;
      font-size: 12px;
      max-width: 500px;
    }

    .menu-grid {
      display: grid;
      grid-template-columns:
        repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 16px;
    }

    .menu-folder {
      border: 1px solid #26313b;
      border-radius: 17px;
      padding: 16px;
      background:
        linear-gradient(145deg, #10161d, #080b0f);
    }

    .menu-folder h2 {
      margin: 0 0 12px;
      font-size: 16px;
    }

    .folder-buttons {
      display: grid;
      gap: 7px;
    }

    .folder-buttons button {
      width: 100%;
      text-align: left;
      min-height: 42px;
      padding: 0 12px;
      border: 1px solid #28333e;
      border-radius: 10px;
      background: #0b1117;
      color: #dfe5eb;
      font-weight: 850;
      cursor: pointer;
    }

    .mission-card {
      margin-top: 16px;
      border: 1px solid #334354;
      border-radius: 16px;
      padding: 16px;
      background:
        linear-gradient(145deg, #121b25, #0a0f15);
    }

    .progress-track {
      height: 7px;
      overflow: hidden;
      background: #202933;
      border-radius: 99px;
    }

    .progress-fill {
      height: 100%;
      border-radius: inherit;
      background:
        linear-gradient(90deg, #2ec875, #73e5a3);
    }

    .card-grid {
      display: grid;
      grid-template-columns:
        repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .two-col {
      display: grid;
      grid-template-columns:
        1fr 1fr;
      gap: 14px;
    }

    .panel {
      border: 1px solid #27333e;
      border-radius: 17px;
      padding: 16px;
      background:
        linear-gradient(145deg, #10161d, #080b0f);
    }

    .panel h2,
    .panel h3 {
      margin-top: 0;
    }

    .muted {
      color: #7b8997;
      font-size: 11px;
      line-height: 1.55;
    }

    .formation-board {
      min-height: 630px;
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      border: 2px solid #294c36;
      background:
        linear-gradient(
          90deg,
          transparent 49.7%,
          rgba(255,255,255,.12) 50%,
          transparent 50.3%
        ),
        repeating-linear-gradient(
          0deg,
          #103c22 0,
          #103c22 55px,
          #123f24 55px,
          #123f24 110px
        );
    }

    .formation-board:before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 130px;
      height: 130px;
      border: 2px solid rgba(255,255,255,.14);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    .formation-row {
      position: relative;
      z-index: 2;
      display: grid;
      justify-content: center;
      gap: 12px;
    }

    .formation-row-fw {
      grid-template-columns:
        repeat(2, 118px);
      padding-top: 36px;
    }

    .formation-row-mid {
      grid-template-columns:
        repeat(3, 105px);
      margin-top: 48px;
    }

    .formation-row-def {
      grid-template-columns:
        repeat(4, 92px);
      margin-top: 48px;
    }

    .formation-row-gk {
      grid-template-columns: 105px;
      margin-top: 45px;
    }

    .formation-slot {
      min-width: 0;
      min-height: 98px;
      border: 1px dashed rgba(255,255,255,.38);
      border-radius: 14px;
      padding: 8px;
      background: rgba(0,0,0,.24);
      color: white;
      cursor: pointer;
    }

    .formation-slot strong {
      display: block;
      font-size: 10px;
    }

    .formation-slot span {
      display: block;
      margin-top: 5px;
      font-size: 9px;
      color: #c8d5cd;
    }

    .slot-sheet {
      position: fixed;
      z-index: 60;
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 70vh;
      overflow: auto;
      padding: 18px;
      border-top: 1px solid #34414e;
      border-radius: 22px 22px 0 0;
      background: #080d12;
      box-shadow: 0 -20px 60px rgba(0,0,0,.55);
    }

    .fixture-list,
    .mission-list {
      display: grid;
      gap: 8px;
    }

    .fixture-row,
    .mission-row {
      display: grid;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border: 1px solid #28333d;
      border-radius: 10px;
      background: #0b1015;
    }

    .fixture-row {
      grid-template-columns:
        40px 42px 1fr auto;
    }

    .club-crest {
      width: 74px;
      height: 84px;
      display: grid;
      place-items: center;
      clip-path:
        polygon(
          50% 0,
          92% 16%,
          84% 76%,
          50% 100%,
          16% 76%,
          8% 16%
        );
      color: white;
      text-shadow: 0 2px 5px rgba(0,0,0,.8);
      font-weight: 1000;
      letter-spacing: .5px;
    }

    .club-crest-small {
      width: 36px;
      height: 42px;
      font-size: 8px;
    }

    .versus-card {
      display: grid;
      grid-template-columns:
        1fr auto 1fr;
      gap: 14px;
      align-items: center;
      text-align: center;
      padding: 18px;
      border-radius: 17px;
      border: 1px solid #2b3743;
      background: #0c1218;
    }

    .versus {
      font-size: 24px;
      font-weight: 1000;
      color: #e2b653;
    }

    .battle-screen {
      min-height: calc(100vh - 90px);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .battle-score {
      text-align: center;
      font-size: 28px;
      font-weight: 1000;
      margin: 10px 0 18px;
    }

    .battle-grid {
      display: grid;
      grid-template-columns:
        repeat(5, minmax(0,1fr));
      gap: 10px;
    }

    .battle-reveal {
      display: grid;
      grid-template-columns:
        minmax(0, 220px)
        60px
        minmax(0, 220px);
      justify-content: center;
      align-items: center;
      gap: 18px;
    }

    .battle-vs {
      font-size: 28px;
      font-weight: 1000;
      text-align: center;
    }

    .round-win {
      color: #50dc8b;
    }

    .round-loss {
      color: #ff756d;
    }

    .round-draw {
      color: #e4bd58;
    }

    .training-running {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }

    .market-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .deal-panel {
      border: 1px solid #9b6c26;
      box-shadow: 0 0 20px rgba(218,155,47,.12);
    }

    .input,
    .select {
      width: 100%;
      min-height: 43px;
      padding: 0 11px;
      border: 1px solid #303b46;
      border-radius: 10px;
      background: #0a0f14;
      color: #fff;
      outline: none;
    }

    .form-grid {
      display: grid;
      gap: 9px;
    }

    .coach-grid {
      display: grid;
      grid-template-columns:
        repeat(5, minmax(0,1fr));
      gap: 10px;
    }

    .coach-card {
      padding: 13px;
      border: 1px solid #34404b;
      border-radius: 13px;
      background: #0d1319;
    }

    .toast {
      position: fixed;
      z-index: 200;
      left: 50%;
      top: 18px;
      transform: translateX(-50%);
      min-width: 240px;
      max-width: min(92vw, 520px);
      padding: 12px 16px;
      border-radius: 12px;
      text-align: center;
      font-size: 12px;
      font-weight: 950;
      box-shadow: 0 12px 40px rgba(0,0,0,.5);
      animation: toast-in .16s ease;
    }

    .toast-info {
      border: 1px solid #3f607c;
      background: #102438;
      color: #cce8ff;
    }

    .toast-success {
      border: 1px solid #347451;
      background: #103221;
      color: #cffff0;
    }

    .toast-error {
      border: 1px solid #79443d;
      background: #371816;
      color: #ffd0ca;
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform:
          translate(-50%, -10px)
          scale(.96);
      }

      to {
        opacity: 1;
        transform:
          translate(-50%, 0)
          scale(1);
      }
    }

    .reward-grid {
      display: grid;
      grid-template-columns:
        repeat(3, minmax(0,1fr));
      gap: 12px;
    }

    .status-box {
      display: grid;
      gap: 6px;
      border: 1px solid #293541;
      border-radius: 12px;
      padding: 12px;
      background: #0a1016;
      font-size: 11px;
    }

    @media (max-width: 800px) {
      .menu-grid {
        grid-template-columns: 1fr;
      }

      .card-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
      }

      .two-col {
        grid-template-columns: 1fr;
      }

      .coach-grid {
        grid-template-columns:
          repeat(2, minmax(0,1fr));
      }

      .battle-grid {
        grid-template-columns:
          repeat(2, minmax(0,1fr));
      }

      .formation-board {
        min-height: 560px;
      }

      .formation-row-fw {
        grid-template-columns:
          repeat(2, 94px);
      }

      .formation-row-mid {
        grid-template-columns:
          repeat(3, 88px);
      }

      .formation-row-def {
        grid-template-columns:
          repeat(4, 68px);
      }

      .formation-row-gk {
        grid-template-columns: 88px;
      }

      .formation-slot {
        min-height: 82px;
        padding: 6px;
      }

      .battle-reveal {
        grid-template-columns:
          minmax(0,1fr)
          34px
          minmax(0,1fr);
        gap: 8px;
      }
    }

    @media (max-width: 420px) {
      .scw-app {
        padding: 11px;
      }

      .topbar {
        align-items: flex-start;
      }

      .brand {
        font-size: 14px;
      }

      .stat-chip {
        padding: 5px 7px;
        font-size: 9px;
      }

      .card-grid {
        gap: 8px;
      }

      .formation-row-mid {
        gap: 5px;
      }

      .formation-row-def {
        gap: 4px;
      }

      .reward-grid {
        gap: 6px;
      }
    }
  `;

  /* =======================================================
     CLUB CREATION
  ======================================================= */

  if (!game.clubName) {
    return (
      <>
        <style>
          {APP_CSS}
        </style>

        <main className="scw-app">
          <div
            className="app-shell"
            style={{
              maxWidth: 520,
              paddingTop:
                "14vh",
            }}
          >
            <div className="panel">
              <div className="section-eyebrow">
                SOCCER CARDS WAR
              </div>

              <h1>
                KULÜBÜNÜ KUR
              </h1>

              <p className="muted">
                Kulübünün adını
                yaz ve kart
                savaşına başla.
              </p>

              <div className="form-grid">
                <input
                  className="input"
                  value={
                    clubInput
                  }
                  onChange={(
                    event
                  ) =>
                    setClubInput(
                      event.target
                        .value
                    )
                  }
                  placeholder="Kulüp adı"
                  maxLength={30}
                />

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    createClub
                  }
                >
                  KULÜBÜ KUR
                </button>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div
            className={`toast toast-${toast.type}`}
          >
            {toast.message}
          </div>
        )}
      </>
    );
  }

  /* =======================================================
     BATTLE SCREEN
  ======================================================= */

  if (battle) {
    const available =
      availableRoundPlayers();

    const group =
      battle.rounds[
        Math.min(
          battle.roundIndex,
          battle.rounds
            .length - 1
        )
      ];

    return (
      <>
        <style>
          {APP_CSS}
        </style>

        <main className="scw-app">
          <div className="app-shell battle-screen">
            <div className="battle-score">
              {battle.playerScore}
              {" — "}
              {battle.opponentScore}
            </div>

            {battle.opponentClub && (
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: 10,
                  marginBottom:
                    18,
                }}
              >
                <ClubCrest
                  club={
                    battle.opponentClub
                  }
                  small
                />

                <strong>
                  {
                    battle
                      .opponentClub
                      .name
                  }
                </strong>
              </div>
            )}

            {battle.phase ===
              "choose" && (
              <>
                <div
                  className="section-eyebrow"
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  TUR{" "}
                  {battle.roundIndex +
                    1}
                  /5
                </div>

                <h2
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  {getRoundLabel(
                    group
                  )}{" "}
                  SEÇ
                </h2>

                <div className="battle-grid">
                  {available.map(
                    (player) => (
                      <PlayerCard
                        key={
                          player.id
                        }
                        player={
                          player
                        }
                        compact
                        onClick={() =>
                          playBattleCard(
                            player
                          )
                        }
                      />
                    )
                  )}
                </div>
              </>
            )}

            {battle.phase ===
              "reveal" &&
              battle.reveal && (
                <>
                  <div className="battle-reveal">
                    <PlayerCard
                      player={
                        battle
                          .reveal
                          .player
                      }
                    />

                    <div className="battle-vs">
                      VS
                    </div>

                    <PlayerCard
                      player={
                        battle
                          .reveal
                          .opponent
                      }
                    />
                  </div>

                  <div
                    className={`battle-score ${
                      battle.reveal
                        .result
                        .winner ===
                      "player"
                        ? "round-win"
                        : battle
                              .reveal
                              .result
                              .winner ===
                            "opponent"
                          ? "round-loss"
                          : "round-draw"
                    }`}
                  >
                    {battle.reveal
                      .result
                      .winner ===
                    "player"
                      ? "SEN KAZANDIN"
                      : battle
                            .reveal
                            .result
                            .winner ===
                          "opponent"
                        ? "RAKİP KAZANDI"
                        : "BERABERE"}
                  </div>
                </>
              )}

            {(battle.phase ===
              "reward-choice" ||
              battle.phase ===
                "reward-choice-event") && (
              <>
                <div
                  className="section-eyebrow"
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  MAÇI KAZANDIN
                </div>

                <h2
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  3 KARTTAN 1'İNİ
                  SEÇ
                </h2>

                {battle.phase ===
                  "reward-choice-event" && (
                  <div
                    className="status-box"
                    style={{
                      marginBottom:
                        14,
                      textAlign:
                        "center",
                    }}
                  >
                    <strong>
                      🪙 Etkinlik
                      Parası +
                      {
                        battle.eventCurrencyReward
                      }
                    </strong>

                    <strong>
                      📦{" "}
                      {
                        battle.packReward
                      }{" "}
                      Paketi
                    </strong>
                  </div>
                )}

                <div className="reward-grid">
                  {battle.rewardChoices.map(
                    (player) => (
                      <PlayerCard
                        key={
                          player.id
                        }
                        player={
                          player
                        }
                        onClick={() =>
                          battle.phase ===
                          "reward-choice"
                            ? chooseCareerReward(
                                player
                              )
                            : chooseEventReward(
                                player
                              )
                        }
                      />
                    )
                  )}
                </div>
              </>
            )}

            {battle.phase ===
              "result" && (
              <div
                className="panel"
                style={{
                  textAlign:
                    "center",
                  maxWidth: 520,
                  margin:
                    "0 auto",
                }}
              >
                <div
                  style={{
                    fontSize: 50,
                  }}
                >
                  {battle.finalResult ===
                  "win"
                    ? "🏆"
                    : battle.finalResult ===
                        "draw"
                      ? "🤝"
                      : "❌"}
                </div>

                <h1>
                  {battle.finalResult ===
                  "win"
                    ? "GALİBİYET"
                    : battle.finalResult ===
                        "draw"
                      ? "BERABERE"
                      : "MAĞLUBİYET"}
                </h1>

                {battle.rewardPlayer && (
                  <p className="muted">
                    Kazandığın kart:{" "}
                    <strong>
                      {
                        battle
                          .rewardPlayer
                          .name
                      }{" "}
                      •{" "}
                      {
                        battle
                          .rewardPlayer
                          .overall
                      }{" "}
                      GEN
                    </strong>
                  </p>
                )}

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setBattle(
                      null
                    )
                  }
                >
                  DEVAM ET
                </button>
              </div>
            )}
          </div>
        </main>

        {toast && (
          <div
            className={`toast toast-${toast.type}`}
          >
            {toast.message}
          </div>
        )}
      </>
    );
  }

  /* =======================================================
     SCREEN CONTENT
  ======================================================= */

  let content = null;

  /* ---------------- HOME ---------------- */

  if (
    screen === "home"
  ) {
    const missions =
      missionData?.active;

    const stageReward =
      getAvailableStageReward(
        game
      );

    content = (
      <section className="screen">
        <div className="home-hero">
          <div className="section-eyebrow">
            AŞAMA{" "}
            {game.activeStage} •
            SINIR {stageCap} GEN
          </div>

          <h1>
            {game.clubName}
          </h1>

          <p>
            Kadro ortalaması{" "}
            <strong>
              {Math.round(
                squadAverage
              )}{" "}
              GEN
            </strong>
            . Kariyer ve
            Etkinlik aşamalarını
            birlikte tamamlayarak
            ilerle.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginTop: 15,
            }}
          >
            <StatChip>
              👥{" "}
              {ownedPlayers.length}{" "}
              Oyuncu
            </StatChip>

            <StatChip>
              ⚽{" "}
              {game.squad.length}
              /10
            </StatChip>

            <StatChip>
              🏆 Aşama{" "}
              {game.activeStage}
            </StatChip>
          </div>
        </div>

        {stageStatus && (
          <div className="mission-card">
            <strong>
              AŞAMA{" "}
              {stageStatus.stage +
                (stageStatus.stage <
                10
                  ? 1
                  : 0)}{" "}
              İÇİN
            </strong>

            <div
              className="status-box"
              style={{
                marginTop: 9,
              }}
            >
              <div>
                {
                  stageStatus.careerText
                }
              </div>

              <div>
                {
                  stageStatus.eventText
                }
              </div>
            </div>
          </div>
        )}

        {stageReward && (
          <div className="mission-card">
            <div className="section-eyebrow">
              AŞAMA ÖDÜLÜ HAZIR
            </div>

            <h2>
              {
                stageReward.name
              }{" "}
              •{" "}
              {
                stageReward.overall
              }{" "}
              GEN
            </h2>

            <button
              type="button"
              className="gold-button"
              onClick={
                claimStageReward
              }
            >
              🏆 ÖDÜLÜ AL
            </button>
          </div>
        )}

        {missions && (
          <div
            className="mission-card"
            onClick={() =>
              openScreen(
                "missions"
              )
            }
            style={{
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 10,
              }}
            >
              <strong>
                {missions.label}
              </strong>

              <span className="muted">
                +500 Coin
              </span>
            </div>

            <div
              className="progress-track"
              style={{
                marginTop: 9,
              }}
            >
              <div
                className="progress-fill"
                style={{
                  width:
                    `${missions.percentage}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="menu-grid">
          <div className="menu-folder">
            <h2>
              ⚽ MAÇ
            </h2>

            <div className="folder-buttons">
              <button
                onClick={() =>
                  openScreen(
                    "career"
                  )
                }
              >
                Kariyer Maçı
              </button>

              <button
                onClick={() =>
                  openScreen(
                    "event"
                  )
                }
              >
                Etkinlik Maçı
              </button>
            </div>
          </div>

          <div className="menu-folder">
            <h2>
              👥 TAKIMIM
            </h2>

            <div className="folder-buttons">
              <button
                onClick={() =>
                  openScreen(
                    "squad"
                  )
                }
              >
                Kadro
              </button>

              <button
                onClick={() =>
                  openScreen(
                    "training"
                  )
                }
              >
                Antrenman
              </button>

              <button
                onClick={() =>
                  openScreen(
                    "collection"
                  )
                }
              >
                Koleksiyon
              </button>

              <button
                onClick={() =>
                  openScreen(
                    "coaches"
                  )
                }
              >
                Antrenörler
              </button>
            </div>
          </div>

          <div className="menu-folder">
            <h2>
              🛒 ALIŞVERİŞ
            </h2>

            <div className="folder-buttons">
              <button
                onClick={() =>
                  openScreen(
                    "store"
                  )
                }
              >
                Mağaza
              </button>

              <button
                onClick={() =>
                  openScreen(
                    "transfer"
                  )
                }
              >
                Transfer
              </button>

              <button
                onClick={() =>
                  openScreen(
                    "rental"
                  )
                }
              >
                Kiralık Merkezi
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- SQUAD ---------------- */

  if (
    screen === "squad"
  ) {
    const rows = [
      {
        cls:
          "formation-row-fw",
        ids: [
          "fw1",
          "fw2",
        ],
      },
      {
        cls:
          "formation-row-mid",
        ids: [
          "mid1",
          "mid2",
          "mid3",
        ],
      },
      {
        cls:
          "formation-row-def",
        ids: [
          "def1",
          "def2",
          "def3",
          "def4",
        ],
      },
      {
        cls:
          "formation-row-gk",
        ids: ["gk"],
      },
    ];

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="TAKIMIM"
          title="KADRO"
          right={
            <button
              className="primary-button"
              onClick={
                autoBestSquad
              }
            >
              ⚡ EN İYİ KADRO
            </button>
          }
        />

        <div className="formation-board">
          {rows.map(
            (row) => (
              <div
                key={
                  row.cls
                }
                className={`formation-row ${row.cls}`}
              >
                {row.ids.map(
                  (slotId) => {
                    const slot =
                      FORMATION_SLOTS.find(
                        (item) =>
                          item.id ===
                          slotId
                      );

                    const player =
                      getPlayerById(
                        game,
                        game.formation?.[
                          slotId
                        ]
                      );

                    return (
                      <button
                        key={
                          slotId
                        }
                        type="button"
                        className="formation-slot"
                        onClick={() =>
                          setSelectedSlot(
                            slot
                          )
                        }
                      >
                        <strong>
                          {slot.label}
                        </strong>

                        {player ? (
                          <>
                            <span>
                              {
                                player.name
                              }
                            </span>

                            <span>
                              {
                                player.overall
                              }{" "}
                              GEN
                            </span>
                          </>
                        ) : (
                          <span>
                            + Oyuncu
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )
          )}
        </div>

        {selectedSlot && (
          <div className="slot-sheet">
            <div className="section-header">
              <div>
                <div className="section-eyebrow">
                  {
                    selectedSlot.label
                  }
                </div>

                <h2>
                  OYUNCU SEÇ
                </h2>
              </div>

              <button
                className="secondary-button"
                onClick={() =>
                  setSelectedSlot(
                    null
                  )
                }
              >
                KAPAT
              </button>
            </div>

            <div className="card-grid">
              {ownedPlayers
                .filter(
                  (player) =>
                    playerFitsSlot(
                      player,
                      selectedSlot
                    ) &&
                    !isPlayerBusy(
                      player,
                      game
                    )
                )
                .map(
                  (player) => (
                    <PlayerCard
                      key={
                        player.id
                      }
                      player={
                        player
                      }
                      compact
                      status={
                        isPlayerInActiveFormation(
                          player,
                          game
                        )
                          ? "KADRODA"
                          : ""
                      }
                      onClick={() =>
                        putPlayerInSlot(
                          player
                        )
                      }
                    />
                  )
                )}
            </div>
          </div>
        )}
      </section>
    );
  }

  /* ---------------- TRAINING ---------------- */

  if (
    screen === "training"
  ) {
    const trainingPlayer =
      game.training
        ? getPlayerById(
            game,
            game.training
              .playerId
          )
        : null;

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="TAKIMIM"
          title="ANTRENMAN"
        />

        {game.training &&
        trainingPlayer ? (
          <div className="panel">
            <div className="training-running">
              <div>
                <div className="section-eyebrow">
                  ANTRENMAN DEVAM EDİYOR
                </div>

                <h2>
                  {
                    trainingPlayer.name
                  }
                </h2>

                <div className="muted">
                  +
                  {
                    game.training
                      .gain
                  }{" "}
                  GEN
                </div>
              </div>

              <strong>
                {millisecondsToClock(
                  Math.max(
                    0,
                    game.training
                      .endsAt -
                      now
                  )
                )}
              </strong>
            </div>
          </div>
        ) : (
          <>
            <div className="panel">
              <h3>
                OYUNCU SEÇ
              </h3>

              <p className="muted">
                Aktif 10 kişilik
                kadrodaki oyuncular
                antrenmana gönderilemez.
              </p>
            </div>

            <div className="card-grid">
              {ownedPlayers.map(
                (player) => {
                  const check =
                    canSendToTraining(
                      game,
                      player,
                      stageCap
                    );

                  return (
                    <div
                      key={
                        player.id
                      }
                    >
                      <PlayerCard
                        player={
                          player
                        }
                        compact
                        selected={
                          trainingPlayerId ===
                          player.id
                        }
                        status={
                          check.allowed
                            ? ""
                            : check.message
                        }
                        onClick={
                          check.allowed
                            ? () =>
                                setTrainingPlayerId(
                                  player.id
                                )
                            : undefined
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>

            {trainingPlayerId &&
              (() => {
                const player =
                  getPlayerById(
                    game,
                    trainingPlayerId
                  );

                const full =
                  getFullTrainingForPlayer(
                    game,
                    player,
                    stageCap
                  );

                return (
                  <div
                    className="panel"
                    style={{
                      marginTop:
                        16,
                    }}
                  >
                    <h2>
                      {player.name}
                    </h2>

                    <div className="two-col">
                      <div>
                        <h3>
                          NORMAL
                        </h3>

                        <div className="form-grid">
                          {trainingPlans.map(
                            (
                              plan
                            ) => {
                              const cost =
                                calculateTrainingCost(
                                  plan,
                                  player.overall
                                );

                              return (
                                <button
                                  key={
                                    plan.id ||
                                    plan.gain
                                  }
                                  className="secondary-button"
                                  onClick={() =>
                                    startTraining(
                                      player,
                                      plan
                                    )
                                  }
                                >
                                  +
                                  {
                                    plan.gain
                                  }{" "}
                                  GEN •{" "}
                                  {
                                    plan.hours
                                  }{" "}
                                  SAAT • 🪙{" "}
                                  {money(
                                    cost
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div>
                        <h3>
                          🔥 FULL ANTRENMAN
                        </h3>

                        <p className="muted">
                          Oyuncuyu mevcut
                          aşama sınırına
                          kadar tek seferde
                          geliştirir. Süre
                          maksimum 24 saat.
                        </p>

                        <button
                          className="gold-button"
                          disabled={
                            !full.allowed
                          }
                          onClick={() =>
                            startFullTraining(
                              player
                            )
                          }
                        >
                          {full.allowed
                            ? `+${full.gain} GEN • ${full.hours} SAAT • 🪙 ${money(
                                full.cost
                              )}`
                            : full.message}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </>
        )}
      </section>
    );
  }

  /* ---------------- COLLECTION ---------------- */

  if (
    screen ===
    "collection"
  ) {
    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="TAKIMIM"
          title={`KOLEKSİYON • ${game.collection.length}`}
        />

        <div className="card-grid">
          {[...game.collection]
            .sort(
              (a, b) =>
                b.overall -
                a.overall
            )
            .map(
              (player) => (
                <PlayerCard
                  key={
                    player.id
                  }
                  player={
                    player
                  }
                  status={
                    getPlayerStatus(
                      player,
                      game
                    )
                  }
                />
              )
            )}
        </div>
      </section>
    );
  }

  /* ---------------- COACHES ---------------- */

  if (
    screen === "coaches"
  ) {
    const selectedCoach =
      COACHES.find(
        (coach) =>
          coach.id ===
          selectedCoachId
      );

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="TAKIMIM"
          title="ANTRENÖRLER"
        />

        <div className="coach-grid">
          {COACHES.map(
            (coach) => {
              const owned =
                game.coaches
                  .owned
                  .includes(
                    coach.id
                  );

              return (
                <div
                  className="coach-card"
                  key={
                    coach.id
                  }
                >
                  <div
                    style={{
                      fontSize:
                        22,
                    }}
                  >
                    {"⭐".repeat(
                      coach.stars
                    )}
                  </div>

                  <h3>
                    {coach.name}
                  </h3>

                  <p className="muted">
                    {
                      coach.slots
                    }{" "}
                    oyuncu •{" "}
                    {
                      coach.minutes
                    }{" "}
                    dk
                  </p>

                  {owned ? (
                    <button
                      className="primary-button"
                      onClick={() =>
                        setSelectedCoachId(
                          coach.id
                        )
                      }
                    >
                      SEÇ
                    </button>
                  ) : (
                    <button
                      className="gold-button"
                      onClick={() =>
                        buyCoach(
                          coach
                        )
                      }
                    >
                      🪙{" "}
                      {money(
                        coach.price
                      )}
                    </button>
                  )}
                </div>
              );
            }
          )}
        </div>

        {selectedCoach && (
          <div
            className="panel"
            style={{
              marginTop: 16,
            }}
          >
            <h2>
              {
                selectedCoach.name
              }
            </h2>

            <p className="muted">
              En fazla{" "}
              {
                selectedCoach.slots
              }{" "}
              oyuncu seç.
              Kadrodaki oyuncular
              kilitlidir.
            </p>

            <div className="card-grid">
              {ownedPlayers.map(
                (player) => {
                  const check =
                    canSendToCoach(
                      game,
                      player,
                      stageCap
                    );

                  const selected =
                    coachPlayerIds.includes(
                      player.id
                    );

                  return (
                    <PlayerCard
                      key={
                        player.id
                      }
                      player={
                        player
                      }
                      compact
                      selected={
                        selected
                      }
                      status={
                        check.allowed
                          ? ""
                          : check.message
                      }
                      onClick={
                        !check.allowed
                          ? undefined
                          : () => {
                              setCoachPlayerIds(
                                (
                                  old
                                ) => {
                                  if (
                                    old.includes(
                                      player.id
                                    )
                                  ) {
                                    return old.filter(
                                      (
                                        id
                                      ) =>
                                        id !==
                                        player.id
                                    );
                                  }

                                  if (
                                    old.length >=
                                    selectedCoach.slots
                                  ) {
                                    return old;
                                  }

                                  return [
                                    ...old,
                                    player.id,
                                  ];
                                }
                              );
                            }
                      }
                    />
                  );
                }
              )}
            </div>

            <button
              className="primary-button"
              style={{
                marginTop: 14,
              }}
              onClick={
                startCoachSession
              }
            >
              ANTRENÖR ÇALIŞMASINI
              BAŞLAT
            </button>
          </div>
        )}
      </section>
    );
  }

  /* ---------------- TRANSFER ---------------- */

  if (
    screen === "transfer"
  ) {
    const status =
      getMarketStatus(
        game.marketSystem,
        now
      );

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="ALIŞVERİŞ"
          title="TRANSFER"
        />

        <div className="market-toolbar">
          <strong>
            {status.label}
          </strong>

          <button
            className="secondary-button"
            onClick={
              manualRefresh
            }
          >
            🔄 YENİLE • 🪙
            100
          </button>
        </div>

        {game.marketSystem
          ?.deal && (
          <div className="panel deal-panel">
            <div className="section-eyebrow">
              🔥 GÜNÜN FIRSATI
              • %50
            </div>

            <div
              style={{
                maxWidth: 240,
                marginTop: 12,
              }}
            >
              <PlayerCard
                player={
                  game
                    .marketSystem
                    .deal
                }
                showPrice
                price={
                  game
                    .marketSystem
                    .deal.price
                }
              />

              <div
                style={{
                  textAlign:
                    "center",
                  marginTop: 6,
                }}
              >
                <span
                  className="muted"
                  style={{
                    textDecoration:
                      "line-through",
                  }}
                >
                  🪙{" "}
                  {money(
                    game
                      .marketSystem
                      .deal
                      .normalPrice
                  )}
                </span>
              </div>

              <button
                className="gold-button"
                style={{
                  width: "100%",
                  marginTop: 8,
                }}
                onClick={() =>
                  buyMarketPlayer(
                    game
                      .marketSystem
                      .deal,
                    true
                  )
                }
              >
                SATIN AL
              </button>
            </div>
          </div>
        )}

        <div
          className="card-grid"
          style={{
            marginTop: 16,
          }}
        >
          {(game.marketSystem
            ?.players ||
            []).map(
            (player) => (
              <div
                key={
                  player.id
                }
              >
                <PlayerCard
                  player={
                    player
                  }
                  showPrice
                  price={
                    player.price
                  }
                />

                <button
                  className="primary-button"
                  style={{
                    width: "100%",
                    marginTop: 6,
                  }}
                  onClick={() =>
                    buyMarketPlayer(
                      player
                    )
                  }
                >
                  SATIN AL
                </button>
              </div>
            )
          )}
        </div>

        <div
          className="panel"
          style={{
            marginTop: 22,
          }}
        >
          <div className="section-eyebrow">
            OYUNCU OLUŞTUR
          </div>

          <h2>
            KENDİ OYUNCUN
          </h2>

          <p className="muted">
            750 Coin • Başlangıç
            15 GEN
          </p>

          <div className="form-grid">
            <input
              className="input"
              value={
                customName
              }
              onChange={(
                event
              ) =>
                setCustomName(
                  event.target
                    .value
                )
              }
              placeholder="Oyuncu adı"
            />

            <select
              className="select"
              value={
                customPosition
              }
              onChange={(
                event
              ) =>
                setCustomPosition(
                  event.target
                    .value
                )
              }
            >
              {positions.map(
                (position) => (
                  <option
                    key={
                      position
                    }
                    value={
                      position
                    }
                  >
                    {position}
                  </option>
                )
              )}
            </select>

            <select
              className="select"
              value={
                customCountry
              }
              onChange={(
                event
              ) =>
                setCustomCountry(
                  event.target
                    .value
                )
              }
            >
              {countries.map(
                (country) => (
                  <option
                    key={
                      country.code
                    }
                    value={
                      country.code
                    }
                  >
                    {
                      country.flag
                    }{" "}
                    {
                      country.name
                    }
                  </option>
                )
              )}
            </select>

            <button
              className="gold-button"
              onClick={
                createPlayer
              }
            >
              OLUŞTUR • 🪙750
            </button>
          </div>
        </div>

        <div
          className="panel"
          style={{
            marginTop: 22,
          }}
        >
          <h2>
            OYUNCU SAT
          </h2>

          <div className="card-grid">
            {ownedPlayers.map(
              (player) => {
                const check =
                  canSellPlayer(
                    game,
                    player
                  );

                return (
                  <div
                    key={
                      player.id
                    }
                  >
                    <PlayerCard
                      player={
                        player
                      }
                      compact
                      status={
                        check.allowed
                          ? ""
                          : check.message
                      }
                    />

                    {check.allowed ? (
                      <button
                        className="danger-button"
                        style={{
                          width:
                            "100%",
                          marginTop:
                            6,
                        }}
                        onClick={() =>
                          sellPlayer(
                            player
                          )
                        }
                      >
                        SAT • 🪙
                        {money(
                          calculateSellPrice(
                            player
                          )
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="secondary-button"
                        style={{
                          width:
                            "100%",
                          marginTop:
                            6,
                        }}
                      >
                        {
                          check.message
                        }
                      </button>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- RENTAL ---------------- */

  if (
    screen === "rental"
  ) {
    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="ALIŞVERİŞ"
          title="KİRALIK MERKEZİ"
        />

        {!game.rentalCenter
          .unlocked ? (
          <div className="panel">
            <h2>
              KİRALIK MERKEZİNİ AÇ
            </h2>

            <p className="muted">
              Kullanmadığın
              oyuncuları maksimum
              8 saat kiraya ver ve
              Coin kazan.
            </p>

            <button
              className="gold-button"
              onClick={
                unlockRental
              }
            >
              AÇ • 🪙1,000
            </button>
          </div>
        ) : (
          <>
            <div className="two-col">
              <div className="panel">
                <h3>
                  SLOTLAR
                </h3>

                <strong>
                  {
                    game
                      .rentalCenter
                      .slots
                  }
                  /
                  {
                    MAX_RENTAL_SLOTS
                  }
                </strong>

                {game
                  .rentalCenter
                  .slots <
                  MAX_RENTAL_SLOTS && (
                  <button
                    className="secondary-button"
                    style={{
                      display:
                        "block",
                      marginTop:
                        10,
                    }}
                    onClick={
                      buyRentalSlot
                    }
                  >
                    + SLOT • 🪙
                    {money(
                      RENTAL_SLOT_PRICES[
                        game
                          .rentalCenter
                          .slots
                      ]
                    )}
                  </button>
                )}
              </div>

              <div className="panel">
                <h3>
                  BEKLEYEN GELİR
                </h3>

                <strong>
                  🪙{" "}
                  {money(
                    game
                      .rentalCenter
                      .pendingCoins
                  )}
                </strong>

                <button
                  className="primary-button"
                  style={{
                    display:
                      "block",
                    marginTop: 10,
                  }}
                  disabled={
                    !game
                      .rentalCenter
                      .pendingCoins
                  }
                  onClick={
                    collectRentalIncome
                  }
                >
                  TOPLA
                </button>
              </div>
            </div>

            <div
              className="card-grid"
              style={{
                marginTop: 16,
              }}
            >
              {ownedPlayers.map(
                (player) => {
                  const check =
                    canRentPlayer(
                      game,
                      player
                    );

                  const rental =
                    game
                      .rentalCenter
                      .rentals.find(
                        (item) =>
                          item.playerId ===
                            player.id &&
                          !item.finished
                      );

                  return (
                    <div
                      key={
                        player.id
                      }
                    >
                      <PlayerCard
                        player={
                          player
                        }
                        compact
                        status={
                          rental
                            ? `KİRALIK • ${millisecondsToClock(
                                Math.max(
                                  0,
                                  rental.endsAt -
                                    now
                                )
                              )}`
                            : check.allowed
                              ? ""
                              : check.message
                        }
                      />

                      {!rental &&
                        check.allowed && (
                          <button
                            className="secondary-button"
                            style={{
                              width:
                                "100%",
                              marginTop:
                                6,
                            }}
                            onClick={() =>
                              rentPlayer(
                                player
                              )
                            }
                          >
                            8 SAAT KİRALA
                          </button>
                        )}
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>
    );
  }

  /* ---------------- CAREER ---------------- */

  if (
    screen === "career"
  ) {
    const rows =
      getCareerFixtureRows(
        game.careerFixtures,
        game.activeStage
      );

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow={`AŞAMA ${game.activeStage}`}
          title={
            activeLeague.name
          }
        />

        <div className="versus-card">
          <div>
            <div className="section-eyebrow">
              SEN
            </div>

            <strong>
              {Math.round(
                careerData
                  ?.squadAverage ||
                  0
              )}{" "}
              GEN
            </strong>
          </div>

          <div className="versus">
            VS
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginBottom: 5,
              }}
            >
              <ClubCrest
                club={
                  careerData
                    ?.opponent
                }
                small
              />
            </div>

            <strong>
              {
                careerData
                  ?.opponent
                  ?.name
              }
            </strong>

            <div className="muted">
              ~
              {Math.round(
                careerData
                  ?.opponentAverage ||
                  0
              )}{" "}
              GEN
            </div>
          </div>
        </div>

        <button
          className="primary-button"
          style={{
            width: "100%",
            marginTop: 12,
          }}
          disabled={
            careerData
              ?.completed
          }
          onClick={() =>
            createBattle(
              "career"
            )
          }
        >
          {careerData?.completed
            ? "✅ KARİYER AŞAMASI TAMAMLANDI"
            : `⚔️ MAÇA GİR • MAÇ ${careerData?.nextMatch?.match || 1}/10`}
        </button>

        <div
          className="panel"
          style={{
            marginTop: 18,
          }}
        >
          <h2>
            FİKSTÜR
          </h2>

          <div className="fixture-list">
            {rows.map(
              (row) => (
                <div
                  key={
                    row.match
                  }
                  className="fixture-row"
                >
                  <strong>
                    {
                      row.match
                    }
                  </strong>

                  <ClubCrest
                    club={
                      row.opponent
                    }
                    small
                  />

                  <div>
                    <strong>
                      {
                        row
                          .opponent
                          .name
                      }
                    </strong>

                    {row.rewardPlayer && (
                      <div className="muted">
                        Kazandın:{" "}
                        {
                          row
                            .rewardPlayer
                            .name
                        }{" "}
                        •{" "}
                        {
                          row
                            .rewardPlayer
                            .overall
                        }{" "}
                        GEN
                      </div>
                    )}
                  </div>

                  <span className="muted">
                    {
                      row.statusText
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- EVENT ---------------- */

  if (
    screen === "event"
  ) {
    const state =
      game.events?.[
        activeEvent.id
      ];

    const cooldown =
      Math.max(
        0,
        Number(
          state?.nextMatchAt ||
            0
        ) - now
      );

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow={`AŞAMA ${game.activeStage}`}
          title="ETKİNLİK"
          right={
            <StatChip>
              🎟️{" "}
              {state?.currency ||
                0}
            </StatChip>
          }
        />

        <div className="panel">
          <div className="section-eyebrow">
            {
              activeEvent.name
            }
          </div>

          <h2>
            MAÇ{" "}
            {state?.match ||
              1}
            /
            {
              activeEvent.matches
            }
          </h2>

          <div className="status-box">
            <div>
              SEN{" "}
              {Math.round(
                eventData
                  ?.squadAverage ||
                  0
              )}{" "}
              GEN ⚔️ ~
              {Math.round(
                eventData
                  ?.opponentAverage ||
                  0
              )}{" "}
              GEN RAKİP
            </div>

            <div>
              Aşama kart sınırı:{" "}
              {
                activeEvent.playCap
              }{" "}
              GEN
            </div>
          </div>

          <button
            className="primary-button"
            style={{
              width: "100%",
              marginTop: 12,
            }}
            disabled={
              state?.completed ||
              cooldown > 0
            }
            onClick={() =>
              createBattle(
                "event"
              )
            }
          >
            {state?.completed
              ? "✅ ETKİNLİK AŞAMASI TAMAMLANDI"
              : cooldown > 0
                ? `⏳ ${millisecondsToClock(
                    cooldown
                  )}`
                : "⚔️ MAÇA GİR"}
          </button>
        </div>

        <div
          className="panel"
          style={{
            marginTop: 16,
          }}
        >
          <h2>
            ETKİNLİK MAĞAZASI
          </h2>

          <div className="card-grid">
            {(state?.shop ||
              []).map(
              (player) => (
                <div
                  key={
                    player.id
                  }
                >
                  <PlayerCard
                    player={
                      player
                    }
                    compact
                  />

                  <button
                    className="gold-button"
                    style={{
                      width:
                        "100%",
                      marginTop:
                        6,
                    }}
                    onClick={() =>
                      buyEventShopPlayer(
                        player
                      )
                    }
                  >
                    🎟️{" "}
                    {
                      player.eventPrice
                    }
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- MISSIONS ---------------- */

  if (
    screen === "missions"
  ) {
    const status =
      getMissionSetStatus(
        game,
        game.missions
      );

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="ANA YOL"
          title={
            status.set.title
          }
        />

        <p className="muted">
          {
            status.set
              .description
          }
        </p>

        <div className="mission-list">
          {status.missions.map(
            (mission) => (
              <div
                key={
                  mission.id
                }
                className="mission-row"
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap: 8,
                  }}
                >
                  <strong>
                    {mission
                      .progress
                      .completed
                      ? "✅"
                      : "⏳"}{" "}
                    {
                      mission.title
                    }
                  </strong>

                  <span className="muted">
                    {
                      mission
                        .progress
                        .current
                    }
                    /
                    {
                      mission
                        .progress
                        .target
                    }
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${mission.progress.percentage}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>

        <button
          className="gold-button"
          style={{
            width: "100%",
            marginTop: 14,
          }}
          disabled={
            !status.rewardReady
          }
          onClick={
            claimMissions
          }
        >
          {status.rewardReady
            ? "🪙 500 ÖDÜLÜ AL"
            : `${status.completed}/${status.total} TAMAMLANDI`}
        </button>
      </section>
    );
  }

  /* ---------------- STORE ---------------- */

  if (
    screen === "store"
  ) {
    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="ALIŞVERİŞ"
          title="MAĞAZA"
        />

        {STORE_TEST_MODE && (
          <div className="panel">
            <strong>
              🧪 TEST PAYMENT
              MODE
            </strong>

            <p className="muted">
              Gerçek para
              çekilmez.
            </p>
          </div>
        )}

        <div
          className="card-grid"
          style={{
            marginTop: 16,
          }}
        >
          {COIN_PACKAGES.map(
            (pack) => (
              <div
                className="panel"
                key={
                  pack.id
                }
                style={{
                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                  }}
                >
                  🪙
                </div>

                <h2>
                  {money(
                    pack.coins
                  )}
                </h2>

                <p className="muted">
                  {pack.price}
                </p>

                <button
                  className="gold-button"
                  onClick={() =>
                    buyCoinPack(
                      pack
                    )
                  }
                >
                  TEST SATIN AL
                </button>
              </div>
            )
          )}
        </div>

        <div
          className="panel"
          style={{
            marginTop: 16,
          }}
        >
          <h2>
            TEST KUPONU
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr auto",
              gap: 8,
            }}
          >
            <input
              className="input"
              value={
                couponInput
              }
              onChange={(
                event
              ) =>
                setCouponInput(
                  event.target
                    .value
                )
              }
              placeholder="Kod"
            />

            <button
              className="secondary-button"
              onClick={
                redeemCoupon
              }
            >
              UYGULA
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- PROFILE ---------------- */

  if (
    screen === "profile"
  ) {
    const dailyRemaining =
      game.daily
        ?.lastClaimAt
        ? Math.max(
            0,
            game.daily
              .lastClaimAt +
              24 *
                60 *
                60 *
                1000 -
              now
          )
        : 0;

    content = (
      <section className="screen">
        <BackButton
          onClick={goHome}
        />

        <SectionHeader
          eyebrow="KULÜP"
          title="PROFİL"
        />

        <div className="two-col">
          <div className="panel">
            <h2>
              {game.clubName}
            </h2>

            <div className="status-box">
              <div>
                Aşama:{" "}
                {
                  game.activeStage
                }
              </div>

              <div>
                Coin:{" "}
                {money(
                  game.coins
                )}
              </div>

              <div>
                Oyuncu:{" "}
                {
                  ownedPlayers.length
                }
              </div>

              <div>
                Kadro Ort.:{" "}
                {Math.round(
                  squadAverage
                )}{" "}
                GEN
              </div>
            </div>
          </div>

          <div className="panel">
            <h2>
              🎁 GÜNLÜK ÖDÜL
            </h2>

            <p className="muted">
              Seri:{" "}
              {game.daily
                ?.streak ||
                0}
              /7
            </p>

            <button
              className="gold-button"
              disabled={
                dailyRemaining >
                0
              }
              onClick={
                claimDaily
              }
            >
              {dailyRemaining >
              0
                ? millisecondsToClock(
                    dailyRemaining
                  )
                : "ÖDÜLÜ AL"}
            </button>
          </div>
        </div>

        {installPrompt && (
          <div
            className="panel"
            style={{
              marginTop: 16,
            }}
          >
            <h2>
              📱 UYGULAMAYI
              KUR
            </h2>

            <button
              className="primary-button"
              onClick={async () => {
                await installPrompt.prompt();

                setInstallPrompt(
                  null
                );
              }}
            >
              TELEFONA KUR
            </button>
          </div>
        )}
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <style>
        {APP_CSS}
      </style>

      <main className="scw-app">
        <div className="app-shell">
          <header className="topbar">
            <button
              type="button"
              onClick={goHome}
              style={{
                padding: 0,
                border: 0,
                background:
                  "transparent",
                color:
                  "inherit",
                cursor:
                  "pointer",
                textAlign:
                  "left",
              }}
            >
              <div className="brand">
                SOCCER{" "}
                <span>
                  CARDS WAR
                </span>
              </div>
            </button>

            <div className="top-stats">
              <StatChip>
                🪙{" "}
                {money(
                  game.coins
                )}
              </StatChip>

              <StatChip>
                AŞAMA{" "}
                {
                  game.activeStage
                }
              </StatChip>

              <button
                type="button"
                className="stat-chip profile-chip"
                onClick={() =>
                  openScreen(
                    "profile"
                  )
                }
              >
                👤 PROFİL
              </button>
            </div>
          </header>

          {content}
        </div>
      </main>

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}

export default App;