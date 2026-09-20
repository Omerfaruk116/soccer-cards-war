import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PlayerCard from "./components/PlayerCard";

import {
  calculateTrainingCost,
  careerLeagues,
  createCustomPlayer,
  eventConfigs,
  generateEventShop,
  generateMarketPlayers,
  generateOpponentDeck,
  generatePlayer,
  generateStarterPlayers,
  getEventConfig,
  getRarity,
  positions,
  randomItem,
  shuffle,
  trainingPlans,
} from "./data/players";

const SAVE_KEY =
  "soccer-cards-war-save-v4";

const SAVE_VERSION = 4;

const HOME_HISTORY = {
  scw: true,
  view: "home",
};

function createEventStates(
  withShops = false
) {
  return Object.fromEntries(
    eventConfigs.map(
      (event, index) => [
        event.id,
        {
          match: 1,
          currency: 0,
          completed: false,

          shop: withShops
            ? generateEventShop(
                event,
                index
              )
            : [],
        },
      ]
    )
  );
}

function createBlankGame() {
  return {
    saveVersion:
      SAVE_VERSION,

    clubName: "",

    coins: 2500,

    gems: 25,

    trophies: 0,

    collection: [],

    squad: [],

    market: [],

    marketCap: 30,

    training: null,

    trainingCap: 30,

    events:
      createEventStates(
        false
      ),

    career: {
      leagueIndex: 0,

      match: 1,

      wins: 0,

      completed: false,
    },

    daily: {
      lastClaim: "",

      streak: 0,
    },
  };
}

function normalizeGame(saved) {
  const blank =
    createBlankGame();

  if (
    !saved ||
    typeof saved !== "object"
  ) {
    return blank;
  }

  const normalizedEvents =
    createEventStates(false);

  eventConfigs.forEach(
    (event, index) => {
      const oldEvent =
        saved.events?.[
          event.id
        ];

      normalizedEvents[
        event.id
      ] = {
        match: Math.max(
          1,

          oldEvent?.match ??
            (event.id ===
            "street"
              ? saved.street
                  ?.match
              : 1) ??
            1
        ),

        currency:
          Math.max(
            0,

            oldEvent
              ?.currency ??
              (event.id ===
              "street"
                ? saved.street
                    ?.streetCoins
                : 0) ??
              0
          ),

        completed:
          Boolean(
            oldEvent
              ?.completed ??
              (event.id ===
              "street"
                ? saved.street
                    ?.completed
                : false)
          ),

        shop:
          Array.isArray(
            oldEvent?.shop
          ) &&
          oldEvent.shop
            .length
            ? oldEvent.shop
            : event.id ===
                  "street" &&
                Array.isArray(
                  saved.streetShop
                ) &&
                saved
                  .streetShop
                  .length
              ? saved.streetShop
              : generateEventShop(
                  event,
                  index
                ),
      };
    }
  );

  return {
    ...blank,

    ...saved,

    saveVersion:
      SAVE_VERSION,

    collection:
      Array.isArray(
        saved.collection
      )
        ? saved.collection
        : [],

    squad:
      Array.isArray(
        saved.squad
      )
        ? saved.squad
        : [],

    market:
      Array.isArray(
        saved.market
      )
        ? saved.market
        : [],

    marketCap:
      Number(
        saved.marketCap
      ) ||
      Number(
        saved.trainingCap
      ) ||
      30,

    trainingCap:
      Number(
        saved.trainingCap
      ) || 30,

    events:
      normalizedEvents,

    career: {
      ...blank.career,

      ...(saved.career ||
        {}),
    },

    daily: {
      ...blank.daily,

      ...(saved.daily ||
        {}),

      lastClaim:
        saved.daily
          ?.lastClaim ||
        saved
          .lastDailyReward ||
        "",
    },
  };
}

function averageOverall(
  players
) {
  if (!players.length) {
    return 0;
  }

  return Math.round(
    players.reduce(
      (
        sum,
        player
      ) =>
        sum +
        player.overall,

      0
    ) / players.length
  );
}

function randomFive(
  players
) {
  return shuffle(
    players
  ).slice(0, 5);
}

function formatTime(
  milliseconds
) {
  if (
    milliseconds <= 0
  ) {
    return "00:00:00";
  }

  const totalSeconds =
    Math.floor(
      milliseconds /
        1000
    );

  const hours =
    Math.floor(
      totalSeconds /
        3600
    );

  const minutes =
    Math.floor(
      (totalSeconds %
        3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((value) =>
      String(
        value
      ).padStart(
        2,
        "0"
      )
    )
    .join(":");
}

function localDateKey(
  date = new Date()
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
        1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateKeyToNumber(
  key
) {
  if (!key) {
    return null;
  }

  const [
    year,
    month,
    day,
  ] = key
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  return Math.floor(
    Date.UTC(
      year,
      month - 1,
      day
    ) / 86400000
  );
}

function App() {
  const [
    started,
    setStarted,
  ] = useState(false);

  const [
    screen,
    setScreen,
  ] = useState("home");

  const [
    notice,
    setNotice,
  ] = useState("");

  const [
    now,
    setNow,
  ] = useState(
    Date.now()
  );

  const [
    battle,
    setBattle,
  ] = useState(null);

  const [
    activeEventId,
    setActiveEventId,
  ] = useState("street");

  const [
    clubNameInput,
    setClubNameInput,
  ] = useState("");

  const [
    customName,
    setCustomName,
  ] = useState("");

  const [
    customPosition,
    setCustomPosition,
  ] = useState("ST");

  const [
    trainingPlayerId,
    setTrainingPlayerId,
  ] = useState(null);

  const [
    installPrompt,
    setInstallPrompt,
  ] = useState(null);

  const [
    installed,
    setInstalled,
  ] = useState(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return false;
    }

    return (
      window.matchMedia?.(
        "(display-mode: standalone)"
      )?.matches ||
      window.navigator
        .standalone ===
        true
    );
  });

  const [
    game,
    setGame,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          SAVE_KEY
        );

      if (saved) {
        return normalizeGame(
          JSON.parse(saved)
        );
      }

      const older =
        localStorage.getItem(
          "soccer-cards-war-save-v2"
        );

      if (older) {
        return normalizeGame(
          JSON.parse(older)
        );
      }
    } catch {
      // Bozuk kayıt varsa
      // yeni oyun açılır.
    }

    return createBlankGame();
  });

  useEffect(() => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(game)
    );
  }, [game]);

  /*
    ANDROID / PWA GERİ TUŞU

    Ana menü uygulamanın temel
    history noktasıdır.

    Bir bölüme girildiğinde yeni
    history kaydı eklenir.

    Maça girildiğinde bir history
    kaydı daha eklenir.

    Böylece Android geri tuşu:
    battle -> bölüm -> home -> exit
    şeklinde çalışır.
  */
  useEffect(() => {
    const currentState =
      window.history.state;

    if (
      !currentState?.scw
    ) {
      window.history.replaceState(
        HOME_HISTORY,
        "",
        window.location.href
      );
    }

    function handlePopState(
      event
    ) {
      const state =
        event.state;

      setBattle(null);

      if (
        state?.scw &&
        state.view ===
          "screen" &&
        state.screen
      ) {
        setScreen(
          state.screen
        );

        return;
      }

      if (
        state?.scw &&
        state.view ===
          "home"
      ) {
        setScreen("home");
      }
    }

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  useEffect(() => {
    const timer =
      setInterval(() => {
        setNow(
          Date.now()
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleInstallPrompt =
      (event) => {
        event.preventDefault();

        setInstallPrompt(
          event
        );
      };

    const handleInstalled =
      () => {
        setInstallPrompt(
          null
        );

        setInstalled(true);

        setNotice(
          "Soccer Cards War telefona kuruldu."
        );
      };

    window.addEventListener(
      "beforeinstallprompt",
      handleInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  useEffect(() => {
    if (
      !game.training ||
      now <
        game.training
          .endsAt
    ) {
      return;
    }

    const training =
      game.training;

    const currentPlayer =
      game.collection.find(
        (player) =>
          player.id ===
          training.playerId
      );

    if (!currentPlayer) {
      setGame(
        (previous) => ({
          ...previous,

          training: null,
        })
      );

      return;
    }

    const availableGain =
      Math.max(
        0,

        game.trainingCap -
          currentPlayer
            .overall
      );

    const actualGain =
      Math.min(
        training.gain,
        availableGain
      );

    setGame(
      (previous) => ({
        ...previous,

        collection:
          previous.collection.map(
            (player) => {
              if (
                player.id !==
                training.playerId
              ) {
                return player;
              }

              const overall =
                player.overall +
                actualGain;

              return {
                ...player,

                overall,

                rarity:
                  getRarity(
                    overall
                  ),
              };
            }
          ),

        training: null,
      })
    );

    setNotice(
      actualGain > 0
        ? `${currentPlayer.name} antrenmanı tamamladı. +${actualGain} GEN`
        : `${currentPlayer.name} mevcut gelişim sınırına ulaştı.`
    );
  }, [
    now,
    game.training,
    game.collection,
    game.trainingCap,
  ]);

  const squadPlayers =
    useMemo(
      () =>
        game.squad
          .map((id) =>
            game.collection.find(
              (player) =>
                player.id ===
                id
            )
          )
          .filter(Boolean),

      [
        game.squad,
        game.collection,
      ]
    );

  const teamOverall =
    useMemo(
      () =>
        averageOverall(
          squadPlayers
        ),

      [squadPlayers]
    );

  const trainingPlayer =
    game.collection.find(
      (player) =>
        player.id ===
        trainingPlayerId
    );

  const activeEvent =
    getEventConfig(
      activeEventId
    );

  const activeEventIndex =
    eventConfigs.findIndex(
      (event) =>
        event.id ===
        activeEventId
    );

  const activeEventState =
    game.events[
      activeEventId
    ] || {
      match: 1,
      currency: 0,
      completed: false,
      shop: [],
    };

  function showNotice(
    message
  ) {
    setNotice(message);
  }

  function openScreen(
    nextScreen
  ) {
    setBattle(null);

    setScreen(
      nextScreen
    );

    window.history.pushState(
      {
        scw: true,

        view:
          "screen",

        screen:
          nextScreen,
      },

      "",

      window.location.href
    );
  }

  function pushBattleHistory(
    parentScreen
  ) {
    window.history.pushState(
      {
        scw: true,

        view:
          "battle",

        parent:
          parentScreen,
      },

      "",

      window.location.href
    );
  }

  function goHome() {
    if (battle) {
      const state =
        window.history.state;

      if (
        state?.scw &&
        state.view ===
          "battle"
      ) {
        window.history.go(
          -2
        );

        return;
      }
    }

    if (
      screen !== "home"
    ) {
      const state =
        window.history.state;

      if (
        state?.scw &&
        state.view ===
          "screen"
      ) {
        window.history.back();

        return;
      }
    }

    setBattle(null);

    setScreen("home");

    window.history.replaceState(
      HOME_HISTORY,
      "",
      window.location.href
    );
  }

  function isEventUnlocked(
    eventIndex
  ) {
    if (
      eventIndex === 0
    ) {
      return true;
    }

    return Boolean(
      game.events[
        eventConfigs[
          eventIndex - 1
        ].id
      ]?.completed
    );
  }

  function resetGame() {
    const confirmed =
      window.confirm(
        "Tüm Soccer Cards War ilerlemen silinecek. Emin misin?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      SAVE_KEY
    );

    localStorage.removeItem(
      "soccer-cards-war-save-v2"
    );

    setGame(
      createBlankGame()
    );

    setStarted(false);

    setScreen("home");

    setBattle(null);

    setClubNameInput("");

    setCustomName("");

    setCustomPosition(
      "ST"
    );

    setTrainingPlayerId(
      null
    );

    setActiveEventId(
      "street"
    );

    setNotice("");

    window.history.replaceState(
      HOME_HISTORY,
      "",
      window.location.href
    );
  }

  function createClub() {
    const cleanName =
      clubNameInput.trim();

    if (!cleanName) {
      showNotice(
        "Önce kulübüne bir isim ver."
      );

      return;
    }

    const starters =
      generateStarterPlayers(
        10
      );

    const events =
      createEventStates(
        true
      );

    setGame({
      ...createBlankGame(),

      clubName:
        cleanName,

      collection:
        starters,

      squad:
        starters.map(
          (player) =>
            player.id
        ),

      market:
        generateMarketPlayers(
          6,
          30
        ),

      events,
    });

    setScreen("home");

    window.history.replaceState(
      HOME_HISTORY,
      "",
      window.location.href
    );

    showNotice(
      `${cleanName} kuruldu. İlk 10 futbolcun hazır.`
    );
  }

  function toggleSquadPlayer(
    playerId
  ) {
    setGame(
      (previous) => {
        if (
          previous.squad.includes(
            playerId
          )
        ) {
          return {
            ...previous,

            squad:
              previous.squad.filter(
                (id) =>
                  id !==
                  playerId
              ),
          };
        }

        if (
          previous.squad
            .length >= 10
        ) {
          showNotice(
            "Maç desten dolu. Önce bir futbolcuyu çıkar."
          );

          return previous;
        }

        return {
          ...previous,

          squad: [
            ...previous.squad,

            playerId,
          ],
        };
      }
    );
  }

  async function installApp() {
    if (installed) {
      showNotice(
        "Uygulama zaten kurulu."
      );

      return;
    }

    if (!installPrompt) {
      showNotice(
        "Yükle seçeneği henüz hazır değil. Sayfada biraz kaldıktan sonra tekrar dene veya tarayıcı menüsündeki Yükle seçeneğini kullan."
      );

      return;
    }

    await installPrompt.prompt();

    const choice =
      await installPrompt
        .userChoice;

    if (
      choice.outcome ===
      "accepted"
    ) {
      setInstallPrompt(
        null
      );
    }
  }

  function collectDailyReward() {
    const today =
      localDateKey();

    if (
      game.daily
        .lastClaim ===
      today
    ) {
      showNotice(
        "Bugünkü günlük ödülünü zaten aldın."
      );

      return;
    }

    const todayNumber =
      dateKeyToNumber(
        today
      );

    const previousNumber =
      dateKeyToNumber(
        game.daily
          .lastClaim
      );

    const consecutive =
      previousNumber !==
        null &&
      todayNumber -
        previousNumber ===
        1;

    const newStreak =
      consecutive
        ? (game.daily
            .streak %
            7) +
          1
        : 1;

    const coinRewards = [
      300,
      400,
      500,
      650,
      800,
      1000,
      0,
    ];

    const coinReward =
      coinRewards[
        newStreak - 1
      ];

    let playerReward =
      null;

    if (
      newStreak === 7
    ) {
      const max =
        Math.min(
          99,

          Math.max(
            22,
            game.marketCap
          )
        );

      const min =
        Math.max(
          15,
          max - 8
        );

      playerReward =
        generatePlayer(
          min,
          max
        );
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          coinReward,

        collection:
          playerReward
            ? [
                ...previous.collection,
                playerReward,
              ]
            : previous.collection,

        daily: {
          lastClaim:
            today,

          streak:
            newStreak,
        },
      })
    );

    showNotice(
      playerReward
        ? `7. gün ödülü: ${playerReward.overall} GEN ${playerReward.name}`
        : `Günlük ödül: +${coinReward} Coin • Seri ${newStreak}/7`
    );
  }

  function refreshMarket() {
    if (
      game.coins < 100
    ) {
      showNotice(
        "Transfer listesini yenilemek için 100 Coin gerekiyor."
      );

      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          100,

        market:
          generateMarketPlayers(
            6,
            previous.marketCap
          ),
      })
    );

    showNotice(
      "Transfer listesi yenilendi."
    );
  }

  function buyMarketPlayer(
    playerId
  ) {
    const player =
      game.market.find(
        (item) =>
          item.id ===
          playerId
      );

    if (!player) {
      return;
    }

    if (
      game.coins <
      player.price
    ) {
      showNotice(
        "Bu futbolcu için yeterli Coin yok."
      );

      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          player.price,

        collection: [
          ...previous.collection,

          {
            ...player,

            price:
              undefined,
          },
        ],

        market:
          previous.market.filter(
            (item) =>
              item.id !==
              playerId
          ),
      })
    );

    showNotice(
      `${player.name} kulübüne katıldı.`
    );
  }

  function createMyPlayer() {
    const name =
      customName.trim();

    if (!name) {
      showNotice(
        "Oyuncunun adını yaz."
      );

      return;
    }

    if (
      game.coins < 750
    ) {
      showNotice(
        "Kendi futbolcunu oluşturmak için 750 Coin gerekiyor."
      );

      return;
    }

    const player =
      createCustomPlayer(
        name,
        customPosition
      );

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          750,

        collection: [
          ...previous.collection,

          player,
        ],
      })
    );

    setCustomName("");

    showNotice(
      `${player.name} oluşturuldu. 15 GEN'den başlıyor.`
    );
  }

  function startTraining(
    plan
  ) {
    if (!trainingPlayer) {
      showNotice(
        "Önce antrenman yapacak futbolcuyu seç."
      );

      return;
    }

    if (game.training) {
      showNotice(
        "Şu anda başka bir antrenman devam ediyor."
      );

      return;
    }

    if (
      trainingPlayer
        .overall >=
      game.trainingCap
    ) {
      showNotice(
        `${trainingPlayer.name} şu anki ${game.trainingCap} GEN gelişim sınırına ulaştı.`
      );

      return;
    }

    const cost =
      calculateTrainingCost(
        plan,
        trainingPlayer
          .overall
      );

    if (
      game.coins < cost
    ) {
      showNotice(
        "Bu antrenman için yeterli Coin yok."
      );

      return;
    }

    const startedAt =
      Date.now();

    const endsAt =
      startedAt +
      plan.hours *
        60 *
        60 *
        1000;

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          cost,

        training: {
          playerId:
            trainingPlayer.id,

          playerName:
            trainingPlayer.name,

          startedAt,

          endsAt,

          gain:
            plan.gain,

          planName:
            plan.title,
        },
      })
    );

    showNotice(
      `${trainingPlayer.name}: ${plan.title} başladı.`
    );
  }

  function eventOpponentStrength(
    event,
    eventState
  ) {
    const progress =
      event.matches <= 1
        ? 1
        : (eventState.match -
            1) /
          (event.matches -
            1);

    return Math.round(
      event.min +
        (event.max -
          event.min) *
          progress
    );
  }

  function careerOpponentStrength() {
    const league =
      careerLeagues[
        Math.min(
          game.career
            .leagueIndex,

          careerLeagues.length -
            1
        )
      ];

    const progress =
      league.matches <= 1
        ? 1
        : (game.career
              .match -
            1) /
          (league.matches -
            1);

    return Math.round(
      league.min +
        (league.max -
          league.min) *
          progress
    );
  }

  function buildBattle({
    mode,
    match,
    target,
    eventId = null,
    leagueIndex = null,
  }) {
    const opponentDeck =
      generateOpponentDeck(
        target,
        10
      );

    const playerHand =
      randomFive(
        squadPlayers
      );

    const opponentHand =
      randomFive(
        opponentDeck
      );

    const playerHandIds =
      playerHand.map(
        (player) =>
          player.id
      );

    const opponentHandIds =
      opponentHand.map(
        (player) =>
          player.id
      );

    return {
      mode,

      eventId,

      leagueIndex,

      phase:
        "playing",

      match,

      round: 0,

      playerScore: 0,

      opponentScore: 0,

      playerDeck: [
        ...squadPlayers,
      ],

      opponentDeck,

      playerHand,

      opponentHand,

      playerReserve:
        squadPlayers.filter(
          (player) =>
            !playerHandIds.includes(
              player.id
            )
        ),

      opponentReserve:
        opponentDeck.filter(
          (player) =>
            !opponentHandIds.includes(
              player.id
            )
        ),

      usedPlayerIds: [],

      history: [],

      reveal: null,

      suddenChoices: [],

      suddenOpponent: null,

      result: null,
    };
  }

  function startEventBattle(
    eventId
  ) {
    const eventIndex =
      eventConfigs.findIndex(
        (event) =>
          event.id ===
          eventId
      );

    const event =
      eventConfigs[
        eventIndex
      ];

    const eventState =
      game.events[
        eventId
      ];

    if (
      !isEventUnlocked(
        eventIndex
      )
    ) {
      showNotice(
        "Bu etkinlik henüz kilitli."
      );

      return;
    }

    if (
      eventState.completed
    ) {
      showNotice(
        `${event.name} tamamlandı.`
      );

      return;
    }

    if (
      squadPlayers.length !==
      10
    ) {
      showNotice(
        "Maça girmek için destende tam 10 kart olmalı."
      );

      return;
    }

    setBattle(
      buildBattle({
        mode: "event",

        eventId,

        match:
          eventState.match,

        target:
          eventOpponentStrength(
            event,
            eventState
          ),
      })
    );

    pushBattleHistory(
      "events"
    );

    setNotice("");
  }

  function startCareerBattle() {
    if (
      game.career
        .completed
    ) {
      showNotice(
        "Kariyer liglerinin tamamını bitirdin."
      );

      return;
    }

    if (
      squadPlayers.length !==
      10
    ) {
      showNotice(
        "Kariyer maçına girmek için destende tam 10 kart olmalı."
      );

      return;
    }

    setBattle(
      buildBattle({
        mode: "career",

        match:
          game.career
            .match,

        target:
          careerOpponentStrength(),

        leagueIndex:
          game.career
            .leagueIndex,
      })
    );

    pushBattleHistory(
      "career"
    );

    setNotice("");
  }

  function playBattleCard(
    player
  ) {
    if (
      !battle ||
      battle.phase !==
        "playing" ||
      battle.reveal
    ) {
      return;
    }

    if (
      battle.usedPlayerIds.includes(
        player.id
      )
    ) {
      return;
    }

    const opponentCard =
      battle.opponentHand[
        battle.round
      ];

    let result = "draw";

    if (
      player.overall >
      opponentCard.overall
    ) {
      result = "win";
    }

    if (
      player.overall <
      opponentCard.overall
    ) {
      result = "loss";
    }

    setBattle(
      (previous) => ({
        ...previous,

        playerScore:
          previous.playerScore +
          (result === "win"
            ? 1
            : 0),

        opponentScore:
          previous.opponentScore +
          (result === "loss"
            ? 1
            : 0),

        usedPlayerIds: [
          ...previous.usedPlayerIds,

          player.id,
        ],

        reveal: {
          player,

          opponent:
            opponentCard,

          result,
        },

        history: [
          ...previous.history,

          {
            round:
              previous.round +
              1,

            player,

            opponent:
              opponentCard,

            result,
          },
        ],
      })
    );
  }

  function nextBattleRound() {
    if (
      !battle ||
      !battle.reveal
    ) {
      return;
    }

    if (
      battle.round < 4
    ) {
      setBattle(
        (previous) => ({
          ...previous,

          round:
            previous.round +
            1,

          reveal: null,
        })
      );

      return;
    }

    if (
      battle.playerScore ===
      battle.opponentScore
    ) {
      startSuddenDeath();

      return;
    }

    finishBattle(
      battle.playerScore >
        battle.opponentScore,

      false
    );
  }

  function startSuddenDeath() {
    setBattle(
      (previous) => ({
        ...previous,

        phase: "sudden",

        reveal: null,

        suddenChoices:
          shuffle(
            previous.playerReserve
          ).slice(0, 2),

        suddenOpponent:
          randomItem(
            previous.opponentReserve
          ),
      })
    );
  }

  function playSuddenCard(
    player
  ) {
    if (
      !battle ||
      battle.phase !==
        "sudden" ||
      battle.reveal
    ) {
      return;
    }

    const opponent =
      battle.suddenOpponent;

    let won;

    if (
      player.overall >
      opponent.overall
    ) {
      won = true;
    } else if (
      player.overall <
      opponent.overall
    ) {
      won = false;
    } else {
      const playerAverage =
        averageOverall(
          battle.playerDeck
        );

      const opponentAverage =
        averageOverall(
          battle.opponentDeck
        );

      won =
        playerAverage ===
        opponentAverage
          ? Math.random() >=
            0.5
          : playerAverage >
            opponentAverage;
    }

    setBattle(
      (previous) => ({
        ...previous,

        reveal: {
          player,

          opponent,

          result:
            won
              ? "win"
              : "loss",
        },

        result: {
          sudden: true,

          won,
        },
      })
    );
  }

  function finishSuddenDeath() {
    if (
      !battle?.result
    ) {
      return;
    }

    finishBattle(
      battle.result.won,

      true
    );
  }

  function advanceCareer(
    previous
  ) {
    const league =
      careerLeagues[
        previous.career
          .leagueIndex
      ];

    const lastMatch =
      previous.career
        .match >=
      league.matches;

    const lastLeague =
      previous.career
        .leagueIndex >=
      careerLeagues.length -
        1;

    if (
      lastMatch &&
      lastLeague
    ) {
      return {
        ...previous.career,

        wins:
          previous.career
            .wins + 1,

        completed: true,
      };
    }

    if (lastMatch) {
      return {
        ...previous.career,

        leagueIndex:
          previous.career
            .leagueIndex +
          1,

        match: 1,

        wins:
          previous.career
            .wins + 1,
      };
    }

    return {
      ...previous.career,

      match:
        previous.career
          .match + 1,

      wins:
        previous.career
          .wins + 1,
    };
  }

  function finishBattle(
    won,
    sudden = false
  ) {
    if (!battle) {
      return;
    }

    if (
      battle.mode ===
      "event"
    ) {
      const eventIndex =
        eventConfigs.findIndex(
          (event) =>
            event.id ===
            battle.eventId
        );

      const event =
        eventConfigs[
          eventIndex
        ];

      const match =
        battle.match;

      if (!won) {
        setBattle(
          (previous) => ({
            ...previous,

            phase:
              "finished",

            result: {
              won: false,

              sudden,

              currencyReward:
                0,

              rewardPlayer:
                null,
            },
          })
        );

        return;
      }

      const currencyReward =
        event.rewardBase +
        match *
          event.rewardStep;

      const rewardPlayer =
        match % 5 === 0
          ? generatePlayer(
              Math.min(
                event.max,

                Math.max(
                  event.min,

                  event.min +
                    Math.floor(
                      (match /
                        event.matches) *
                        (event.max -
                          event.min)
                    ) -
                    1
                )
              ),

              Math.min(
                event.max,

                Math.max(
                  event.min,

                  event.min +
                    Math.floor(
                      (match /
                        event.matches) *
                        (event.max -
                          event.min)
                    ) +
                    1
                )
              )
            )
          : null;

      const finalMatch =
        match >=
        event.matches;

      setGame(
        (previous) => {
          const current =
            previous.events[
              event.id
            ];

          return {
            ...previous,

            collection:
              rewardPlayer
                ? [
                    ...previous.collection,

                    rewardPlayer,
                  ]
                : previous.collection,

            trainingCap:
              finalMatch
                ? Math.max(
                    previous.trainingCap,

                    event.unlockCap
                  )
                : previous.trainingCap,

            marketCap:
              finalMatch
                ? Math.max(
                    previous.marketCap,

                    event.unlockCap
                  )
                : previous.marketCap,

            events: {
              ...previous.events,

              [event.id]: {
                ...current,

                currency:
                  current.currency +
                  currencyReward,

                match:
                  finalMatch
                    ? event.matches
                    : match + 1,

                completed:
                  finalMatch,
              },
            },
          };
        }
      );

      setBattle(
        (previous) => ({
          ...previous,

          phase:
            "finished",

          result: {
            won: true,

            sudden,

            currencyReward,

            rewardPlayer,

            eventCompleted:
              finalMatch,
          },
        })
      );

      return;
    }

    if (
      battle.mode ===
      "career"
    ) {
      if (!won) {
        setBattle(
          (previous) => ({
            ...previous,

            phase:
              "loss-select",

            result: {
              won: false,

              sudden,

              lostPlayer:
                null,
            },
          })
        );

        return;
      }

      const rewardPlayer = {
        ...randomItem(
          battle.opponentDeck
        ),
      };

      const coinReward =
        120 +
        battle.leagueIndex *
          100 +
        battle.match *
          15;

      setGame(
        (previous) => ({
          ...previous,

          coins:
            previous.coins +
            coinReward,

          trophies:
            previous.trophies +
            1,

          collection: [
            ...previous.collection,

            rewardPlayer,
          ],

          career:
            advanceCareer(
              previous
            ),
        })
      );

      setBattle(
        (previous) => ({
          ...previous,

          phase:
            "finished",

          result: {
            won: true,

            sudden,

            rewardPlayer,

            coinReward,
          },
        })
      );
    }
  }

  function giveCareerCard(
    player
  ) {
    if (
      !battle ||
      battle.mode !==
        "career" ||
      battle.phase !==
        "loss-select"
    ) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        collection:
          previous.collection.filter(
            (item) =>
              item.id !==
              player.id
          ),

        squad:
          previous.squad.filter(
            (id) =>
              id !==
              player.id
          ),

        training:
          previous.training
            ?.playerId ===
          player.id
            ? null
            : previous.training,
      })
    );

    setBattle(
      (previous) => ({
        ...previous,

        phase:
          "finished",

        result: {
          ...previous.result,

          lostPlayer:
            player,
        },
      })
    );
  }

  function closeBattle() {
    const state =
      window.history.state;

    if (
      state?.scw &&
      state.view ===
        "battle"
    ) {
      window.history.back();

      return;
    }

    setBattle(null);
  }

  function buyEventPlayer(
    eventId,
    playerId
  ) {
    const event =
      getEventConfig(
        eventId
      );

    const eventState =
      game.events[
        eventId
      ];

    const player =
      eventState.shop.find(
        (item) =>
          item.id ===
          playerId
      );

    if (!player) {
      return;
    }

    if (
      eventState.currency <
      player.eventPrice
    ) {
      showNotice(
        `Yeterli ${event.currencyName} yok.`
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

          [eventId]: {
            ...previous.events[
              eventId
            ],

            currency:
              previous.events[
                eventId
              ].currency -
              player.eventPrice,

            shop:
              previous.events[
                eventId
              ].shop.filter(
                (item) =>
                  item.id !==
                  playerId
              ),
          },
        },
      })
    );

    showNotice(
      `${player.name}, ${event.name} mağazasından alındı.`
    );
  }

  function TopBar() {
    return (
      <header className="top-bar">
        <button
          type="button"
          className="club-button"
          onClick={goHome}
        >
          <img
            className="mini-logo-image"
            src={`${
              import.meta.env
                .BASE_URL
            }icons/icon.svg`}
            alt="SCW"
          />

          <div className="club-text">
            <div className="club-name">
              {game.clubName}
            </div>

            <div className="club-level">
              SOCCER CARDS WAR
            </div>
          </div>
        </button>

        <div className="currencies">
          <div className="currency">
            🪙{" "}
            <b>
              {game.coins.toLocaleString()}
            </b>
          </div>

          <div className="currency">
            💎{" "}
            <b>
              {game.gems}
            </b>
          </div>

          <div className="currency">
            🏆{" "}
            <b>
              {
                game.trophies
              }
            </b>
          </div>

          <button
            type="button"
            className="icon-button danger-button"
            onClick={resetGame}
            title="Oyunu sıfırla"
          >
            ↻
          </button>
        </div>
      </header>
    );
  }

  function Notice() {
    if (!notice) {
      return null;
    }

    return (
      <button
        type="button"
        className="notice"
        onClick={() =>
          setNotice("")
        }
      >
        {notice}
      </button>
    );
  }

  function CardBack() {
    return (
      <div className="card-back">
        <div className="card-back-inner">
          <img
            src={`${
              import.meta.env
                .BASE_URL
            }icons/icon.svg`}
            alt=""
            className="card-back-logo"
          />

          <div className="card-back-label">
            GİZLİ KART
          </div>
        </div>
      </div>
    );
  }

  function BattleScore({
    battle:
      currentBattle,
  }) {
    return (
      <div className="battle-score">
        <div>
          <span>SEN</span>

          <strong>
            {
              currentBattle.playerScore
            }
          </strong>
        </div>

        <b>:</b>

        <div>
          <span>RAKİP</span>

          <strong>
            {
              currentBattle.opponentScore
            }
          </strong>
        </div>
      </div>
    );
  }

  function RevealArena({
    reveal,
  }) {
    return (
      <div className="reveal-arena">
        <div>
          <span className="reveal-label">
            SEN
          </span>

          <PlayerCard
            player={
              reveal.player
            }
            compact
          />
        </div>

        <div className="versus-result">
          <strong>
            {
              reveal.player
                .overall
            }
          </strong>

          <span>VS</span>

          <strong>
            {
              reveal.opponent
                .overall
            }
          </strong>
        </div>

        <div>
          <span className="reveal-label">
            RAKİP
          </span>

          <PlayerCard
            player={
              reveal.opponent
            }
            compact
          />
        </div>
      </div>
    );
  }

  function BattleScreen() {
    if (!battle) {
      return null;
    }

    const remainingCards =
      battle.playerHand.filter(
        (player) =>
          !battle.usedPlayerIds.includes(
            player.id
          )
      );

    const isCareer =
      battle.mode ===
      "career";

    const event =
      battle.eventId
        ? getEventConfig(
            battle.eventId
          )
        : null;

    const league =
      isCareer
        ? careerLeagues[
            battle.leagueIndex
          ]
        : null;

    const battleTitle =
      isCareer
        ? `${league.name} • MAÇ ${battle.match}`
        : `${event.icon} ${event.name} • MAÇ ${battle.match}`;

    if (
      battle.phase ===
      "loss-select"
    ) {
      return (
        <section className="battle-screen loss-screen">
          <div className="section-label">
            KARİYER CEZASI
          </div>

          <h1>
            1 KARTINI VER
          </h1>

          <p>
            Maçı kaybettin.
            Bu maça getirdiğin
            10 karttan birini
            rakip kulübe vermek
            zorundasın.
          </p>

          <div className="loss-grid">
            {battle.playerDeck.map(
              (player) => (
                <PlayerCard
                  key={
                    player.id
                  }
                  player={player}
                  compact
                  onClick={() =>
                    giveCareerCard(
                      player
                    )
                  }
                />
              )
            )}
          </div>
        </section>
      );
    }

    if (
      battle.phase ===
      "finished"
    ) {
      return (
        <section className="battle-screen battle-finished">
          <div className="section-label">
            MAÇ SONU
          </div>

          <h1
            className={
              battle.result
                .won
                ? "victory-text"
                : "defeat-text"
            }
          >
            {battle.result
              .won
              ? "GALİBİYET"
              : "MAĞLUBİYET"}
          </h1>

          <div className="final-score">
            {
              battle.playerScore
            }

            <span>-</span>

            {
              battle.opponentScore
            }
          </div>

          {battle.result
            .sudden && (
            <div className="result-note">
              SUDDEN DEATH
            </div>
          )}

          {battle.mode ===
            "event" &&
            battle.result
              .won && (
              <>
                <div className="reward-banner">
                  {
                    event.currencyIcon
                  }{" "}
                  +
                  {
                    battle.result
                      .currencyReward
                  }{" "}
                  {
                    event.currencyName
                  }
                </div>

                {battle.result
                  .rewardPlayer && (
                  <div className="reward-player">
                    <div className="section-label">
                      FUTBOLCU
                      ÖDÜLÜ
                    </div>

                    <PlayerCard
                      player={
                        battle.result
                          .rewardPlayer
                      }
                    />
                  </div>
                )}

                {battle.result
                  .eventCompleted && (
                  <div className="unlock-banner">
                    ETKİNLİK
                    TAMAMLANDI •
                    GELİŞİM SINIRI{" "}
                    {
                      event.unlockCap
                    }{" "}
                    GEN
                  </div>
                )}
              </>
            )}

          {battle.mode ===
            "event" &&
            !battle.result
              .won && (
              <p className="result-copy">
                Etkinlikte kart
                kaybetmezsin.
                Aynı maçı tekrar
                deneyebilirsin.
              </p>
            )}

          {battle.mode ===
            "career" &&
            battle.result
              .won && (
              <>
                <div className="reward-banner">
                  🪙 +
                  {
                    battle.result
                      .coinReward
                  }{" "}
                  COIN
                </div>

                <div className="reward-player">
                  <div className="section-label">
                    RAKİPTEN
                    KAZANDIĞIN KART
                  </div>

                  <PlayerCard
                    player={
                      battle.result
                        .rewardPlayer
                    }
                  />
                </div>
              </>
            )}

          {battle.mode ===
            "career" &&
            !battle.result
              .won &&
            battle.result
              .lostPlayer && (
              <div className="reward-player lost-player">
                <div className="section-label">
                  RAKİBE GİDEN
                  KART
                </div>

                <PlayerCard
                  player={
                    battle.result
                      .lostPlayer
                  }
                />
              </div>
            )}

          <button
            type="button"
            className="primary-wide-button"
            onClick={closeBattle}
          >
            DEVAM ET
          </button>
        </section>
      );
    }

    if (
      battle.phase ===
      "sudden"
    ) {
      return (
        <section className="battle-screen">
          <div className="battle-heading-row">
            <div>
              <div className="section-label">
                {battleTitle}
              </div>

              <h1>
                SUDDEN DEATH
              </h1>
            </div>

            <BattleScore
              battle={battle}
            />
          </div>

          {!battle.reveal ? (
            <>
              <div className="opponent-zone">
                <CardBack />
              </div>

              <div className="battle-message">
                İki yedek
                kartından birini
                seç.
              </div>

              <div className="sudden-grid">
                {battle.suddenChoices.map(
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
                        playSuddenCard(
                          player
                        )
                      }
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <>
              <RevealArena
                reveal={
                  battle.reveal
                }
              />

              <div
                className={`round-result ${
                  battle.result
                    .won
                    ? "round-win"
                    : "round-loss"
                }`}
              >
                {battle.result
                  .won
                  ? "MAÇ SENİN"
                  : "RAKİP KAZANDI"}
              </div>

              <button
                type="button"
                className="primary-wide-button"
                onClick={
                  finishSuddenDeath
                }
              >
                MAÇ SONUCUNU GÖR
              </button>
            </>
          )}
        </section>
      );
    }

    return (
      <section className="battle-screen">
        <div className="battle-heading-row">
          <div>
            <div className="section-label">
              {battleTitle}
            </div>

            <h1>
              RAUND{" "}
              {battle.round +
                1}
              /5
            </h1>
          </div>

          <BattleScore
            battle={battle}
          />
        </div>

        <div className="opponent-zone">
          <div className="zone-title">
            RAKİBİN KARTI
          </div>

          {!battle.reveal ? (
            <CardBack />
          ) : (
            <PlayerCard
              player={
                battle.reveal
                  .opponent
              }
              compact
            />
          )}
        </div>

        {!battle.reveal ? (
          <>
            <div className="battle-message">
              Rakip kartını
              attı.{" "}

              <strong>
                Şimdi kartını
                seç.
              </strong>
            </div>

            <div className="battle-hand">
              {remainingCards.map(
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
        ) : (
          <>
            <RevealArena
              reveal={
                battle.reveal
              }
            />

            <div
              className={`round-result ${
                battle.reveal
                  .result ===
                "win"
                  ? "round-win"
                  : battle.reveal
                        .result ===
                      "loss"
                    ? "round-loss"
                    : "round-draw"
              }`}
            >
              {battle.reveal
                .result ===
              "win"
                ? "RAUND SENİN"
                : battle.reveal
                      .result ===
                    "loss"
                  ? "RAKİP RAUNDU ALDI"
                  : "BERABERE"}
            </div>

            <button
              type="button"
              className="primary-wide-button"
              onClick={
                nextBattleRound
              }
            >
              {battle.round ===
              4
                ? "MAÇI TAMAMLA"
                : "SONRAKİ RAUND"}
            </button>
          </>
        )}

        {battle.history
          .length > 0 && (
          <div className="round-history">
            {battle.history.map(
              (round) => (
                <div
                  className="history-pill"
                  key={
                    round.round
                  }
                >
                  R{round.round}
                  {" • "}
                  {
                    round.player
                      .overall
                  }
                  -
                  {
                    round.opponent
                      .overall
                  }
                  {" • "}
                  {round.result ===
                  "win"
                    ? "W"
                    : round.result ===
                        "loss"
                      ? "L"
                      : "D"}
                </div>
              )
            )}
          </div>
        )}
      </section>
    );
  }

  if (!started) {
    return (
      <div className="intro-screen">
        <div className="intro-content">
          <img
            src={`${
              import.meta.env
                .BASE_URL
            }icons/icon.svg`}
            alt="Soccer Cards War"
            className="intro-logo"
          />

          <div className="publisher">
            EL TURCO
          </div>

          <div className="presents">
            PRESENTS
          </div>

          <h1 className="game-logo-title">
            SOCCER{" "}

            <span>
              CARDS WAR
            </span>
          </h1>

          <div className="gold-line" />

          <p className="intro-text">
            Kartlarını topla.
            Kulübünü kur.
            Kendi yıldızını
            geliştir. Kart
            savaşlarını kazan.
          </p>

          <button
            type="button"
            className="main-button"
            onClick={() =>
              setStarted(true)
            }
          >
            OYUNA GİR
          </button>

          <div className="version">
            EL TURCO • v1.0
            BUILD
          </div>
        </div>
      </div>
    );
  }

  if (!game.clubName) {
    return (
      <div className="setup-screen">
        <Notice />

        <div className="setup-box">
          <div className="section-label">
            YENİ KULÜP
          </div>

          <h1>
            KULÜBÜNÜ KUR
          </h1>

          <p>
            Takımının adını
            sen belirle.
            Başlangıçta 10 adet
            10–22 GEN futbolcu
            alırsın.
          </p>

          <input
            value={
              clubNameInput
            }
            onChange={(event) =>
              setClubNameInput(
                event.target
                  .value
              )
            }
            maxLength={24}
            placeholder="Kulüp adı"
          />

          <button
            type="button"
            className="primary-wide-button"
            onClick={
              createClub
            }
          >
            KULÜBÜ OLUŞTUR
          </button>
        </div>
      </div>
    );
  }

  if (screen === "squad") {
    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <BackButton
            onClick={goHome}
          />

          <PageHeading
            label="10 KARTLIK DESTE"
            title="TAKIMIM"
            text="Maçta bu 10 karttan rastgele 5 tanesi eline gelir."
            stat={`${teamOverall} GEN`}
          />

          <div className="squad-counter">
            {
              game.squad
                .length
            }
            /10
          </div>

          <div className="collection-grid">
            {game.collection
              .slice()
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
                    selected={
                      game.squad.includes(
                        player.id
                      )
                    }
                    onClick={() =>
                      toggleSquadPlayer(
                        player.id
                      )
                    }
                  />
                )
              )}
          </div>
        </main>
      </div>
    );
  }

  if (
    screen ===
    "collection"
  ) {
    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <BackButton
            onClick={goHome}
          />

          <PageHeading
            label="FUTBOLCULARIM"
            title="KOLEKSİYON"
            text={`Toplam ${game.collection.length} kartın var.`}
            stat={`${game.collection.length} KART`}
          />

          <div className="collection-grid">
            {game.collection
              .slice()
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
                    selected={
                      game.squad.includes(
                        player.id
                      )
                    }
                  />
                )
              )}
          </div>
        </main>
      </div>
    );
  }

  if (
    screen === "training"
  ) {
    const remaining =
      game.training
        ? game.training
            .endsAt -
          now
        : 0;

    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <BackButton
            onClick={goHome}
          />

          <PageHeading
            label="GELİŞİM MERKEZİ"
            title="ANTRENMAN"
            text="Coin harca, gerçek zamanlı çalıştır ve futbolcularını geliştir."
            stat={`${game.trainingCap} MAX`}
          />

          {game.training && (
            <div className="training-running">
              <div>
                <span>
                  ANTRENMAN DEVAM
                  EDİYOR
                </span>

                <h2>
                  {
                    game.training
                      .playerName
                  }
                </h2>

                <p>
                  {
                    game.training
                      .planName
                  }
                </p>
              </div>

              <div className="training-time">
                {formatTime(
                  remaining
                )}
              </div>
            </div>
          )}

          <h2 className="screen-subtitle">
            1. FUTBOLCUYU SEÇ
          </h2>

          <div className="collection-grid">
            {game.collection
              .slice()
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
                    selected={
                      trainingPlayerId ===
                      player.id
                    }
                    onClick={() =>
                      setTrainingPlayerId(
                        player.id
                      )
                    }
                  />
                )
              )}
          </div>

          <h2 className="screen-subtitle program-heading">
            2. PROGRAMI SEÇ
          </h2>

          <div className="training-plans">
            {trainingPlans.map(
              (plan) => {
                const cost =
                  calculateTrainingCost(
                    plan,

                    trainingPlayer
                      ?.overall ||
                      15
                  );

                return (
                  <button
                    type="button"
                    key={
                      plan.id
                    }
                    className="training-plan"
                    onClick={() =>
                      startTraining(
                        plan
                      )
                    }
                  >
                    <span>
                      {
                        plan.duration
                      }
                    </span>

                    <h3>
                      {
                        plan.title
                      }
                    </h3>

                    <strong>
                      +
                      {
                        plan.gain
                      }{" "}
                      GEN
                    </strong>

                    <small>
                      🪙{" "}
                      {cost.toLocaleString()}
                    </small>
                  </button>
                );
              }
            )}
          </div>
        </main>
      </div>
    );
  }

  if (
    screen ===
    "transfers"
  ) {
    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <BackButton
            onClick={goHome}
          />

          <PageHeading
            label="KULÜP YÖNETİMİ"
            title="TRANSFERLER"
            text="GEN yükseldikçe fiyat yükselir. İlerledikçe pazarda daha güçlü kartlar açılır."
            stat={`MAX ${game.marketCap}`}
          />

          <div className="custom-player-box">
            <div>
              <div className="section-label">
                KENDİ YILDIZINI
                YARAT
              </div>

              <h2>
                FUTBOLCU
                OLUŞTUR
              </h2>

              <p>
                15 GEN başlar.
                Onu antrenmanlarla
                oyunun sonuna kadar
                geliştirebilirsin.
              </p>
            </div>

            <div className="custom-player-form">
              <input
                value={
                  customName
                }
                onChange={(event) =>
                  setCustomName(
                    event.target
                      .value
                  )
                }
                placeholder="Oyuncu adı"
                maxLength={24}
              />

              <select
                value={
                  customPosition
                }
                onChange={(event) =>
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
                      {
                        position
                      }
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                className="primary-button"
                onClick={
                  createMyPlayer
                }
              >
                OLUŞTUR • 🪙
                750
              </button>
            </div>
          </div>

          <div className="section-toolbar">
            <h2 className="screen-subtitle">
              TRANSFER PAZARI
            </h2>

            <button
              type="button"
              className="secondary-button"
              onClick={
                refreshMarket
              }
            >
              YENİLE • 🪙 100
            </button>
          </div>

          <div className="collection-grid">
            {game.market.map(
              (player) => (
                <PlayerCard
                  key={
                    player.id
                  }
                  player={player}
                  price={
                    player.price
                  }
                  onClick={() =>
                    buyMarketPlayer(
                      player.id
                    )
                  }
                />
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  if (screen === "events") {
    if (battle) {
      return (
        <div className="game-screen">
          <TopBar />

          <main className="page-content battle-page">
            <BattleScreen />
          </main>
        </div>
      );
    }

    const opponentStrength =
      eventOpponentStrength(
        activeEvent,

        activeEventState
      );

    const unlocked =
      isEventUnlocked(
        activeEventIndex
      );

    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <BackButton
            onClick={goHome}
          />

          <PageHeading
            label="ETKİNLİK YOLU"
            title="ETKİNLİKLER"
            text="Kart kaybı yok. Etkinlik parası kazan, özel mağazadan oyuncu al ve bir sonraki sahayı aç."
            stat={`${eventConfigs.filter(
              (_, index) =>
                isEventUnlocked(
                  index
                )
            ).length}/${eventConfigs.length}`}
          />

          <div className="event-selector">
            {eventConfigs.map(
              (
                event,
                index
              ) => {
                const eventState =
                  game.events[
                    event.id
                  ];

                const eventUnlocked =
                  isEventUnlocked(
                    index
                  );

                return (
                  <button
                    type="button"
                    key={
                      event.id
                    }
                    className={`event-selector-card ${
                      activeEventId ===
                      event.id
                        ? "active"
                        : ""
                    }`}
                    disabled={
                      !eventUnlocked
                    }
                    onClick={() =>
                      setActiveEventId(
                        event.id
                      )
                    }
                  >
                    <span>
                      {
                        event.icon
                      }
                    </span>

                    <div>
                      <b>
                        {
                          event.name
                        }
                      </b>

                      <small>
                        {eventUnlocked
                          ? eventState.completed
                            ? "✓ TAMAMLANDI"
                            : `${eventState.match}/${event.matches} MAÇ`
                          : "🔒 KİLİTLİ"}
                      </small>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <section
            className={`event-hero ${
              unlocked
                ? ""
                : "locked-panel"
            }`}
          >
            <div>
              <div className="section-label">
                ETKİNLİK{" "}
                {activeEventIndex +
                  1}
              </div>

              <h1>
                {
                  activeEvent.icon
                }{" "}
                {
                  activeEvent.name
                }
              </h1>

              <p>
                {
                  activeEvent.matches
                }{" "}
                maç •{" "}
                {
                  activeEvent.min
                }
                –
                {
                  activeEvent.max
                }{" "}
                GEN • Kart kaybı
                yok.
              </p>
            </div>

            <div className="event-currency">
              {
                activeEvent.currencyIcon
              }{" "}
              {activeEventState.currency.toLocaleString()}
            </div>
          </section>

          <div className="event-stats">
            <div>
              <span>
                İLERLEME
              </span>

              <strong>
                {
                  activeEventState.match
                }
                /
                {
                  activeEvent.matches
                }
              </strong>
            </div>

            <div>
              <span>RAKİP</span>

              <strong>
                ~
                {
                  opponentStrength
                }{" "}
                GEN
              </strong>
            </div>

            <div>
              <span>DESTE</span>

              <strong>
                {
                  game.squad
                    .length
                }
                /10
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="primary-wide-button"
            disabled={
              !unlocked ||
              activeEventState.completed
            }
            onClick={() =>
              startEventBattle(
                activeEvent.id
              )
            }
          >
            {activeEventState.completed
              ? "ETKİNLİK TAMAMLANDI"
              : unlocked
                ? `MAÇ ${activeEventState.match}'E GİR`
                : "ÖNCEKİ ETKİNLİĞİ TAMAMLA"}
          </button>

          <div className="event-shop-heading">
            <div>
              <div className="section-label">
                ETKİNLİK MAĞAZASI
              </div>

              <h2>
                {activeEvent.name.toUpperCase()}{" "}
                PAZARI
              </h2>
            </div>

            <div className="event-currency small">
              {
                activeEvent.currencyIcon
              }{" "}
              {activeEventState.currency.toLocaleString()}
            </div>
          </div>

          <div className="collection-grid">
            {activeEventState.shop.map(
              (player) => (
                <PlayerCard
                  key={
                    player.id
                  }
                  player={player}
                  price={
                    player.eventPrice
                  }
                  currencyIcon={
                    activeEvent.currencyIcon
                  }
                  onClick={() =>
                    buyEventPlayer(
                      activeEvent.id,

                      player.id
                    )
                  }
                />
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  if (screen === "career") {
    if (battle) {
      return (
        <div className="game-screen">
          <TopBar />

          <main className="page-content battle-page">
            <BattleScreen />
          </main>
        </div>
      );
    }

    const leagueIndex =
      Math.min(
        game.career
          .leagueIndex,

        careerLeagues.length -
          1
      );

    const league =
      careerLeagues[
        leagueIndex
      ];

    const opponentStrength =
      careerOpponentStrength();

    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <BackButton
            onClick={goHome}
          />

          <section className="career-hero">
            <div>
              <div className="section-label">
                RİSK MODU
              </div>

              <h1>
                {game.career
                  .completed
                  ? "KARİYER TAMAMLANDI"
                  : league.name}
              </h1>

              <p>
                Kazanırsan
                rakipten rastgele
                bir kart ve Coin
                alırsın.
                Kaybedersen kendi
                10 kartından birini
                vermek zorundasın.
              </p>
            </div>

            <div className="risk-badge">
              ⚠️ KART KAYBI
              AÇIK
            </div>
          </section>

          <div className="career-stats">
            <div>
              <span>LİG</span>

              <strong>
                {leagueIndex + 1}
                /
                {
                  careerLeagues.length
                }
              </strong>
            </div>

            <div>
              <span>MAÇ</span>

              <strong>
                {
                  game.career
                    .match
                }
                /
                {
                  league.matches
                }
              </strong>
            </div>

            <div>
              <span>RAKİP</span>

              <strong>
                ~
                {
                  opponentStrength
                }
              </strong>
            </div>

            <div>
              <span>
                GALİBİYET
              </span>

              <strong>
                {
                  game.career
                    .wins
                }
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="career-play-button"
            disabled={
              game.career
                .completed
            }
            onClick={
              startCareerBattle
            }
          >
            {game.career.completed
              ? "KARİYER TAMAMLANDI"
              : `⚔️ MAÇ ${game.career.match}'E GİR`}
          </button>

          <div className="career-road-heading">
            <div className="section-label">
              KARİYER YOLU
            </div>

            <h2>LİGLER</h2>
          </div>

          <div className="career-road">
            {careerLeagues.map(
              (
                item,
                index
              ) => {
                const completed =
                  game.career.completed ||
                  index <
                    game.career
                      .leagueIndex;

                const current =
                  !game.career.completed &&
                  index ===
                    game.career
                      .leagueIndex;

                return (
                  <div
                    key={
                      item.name
                    }
                    className={`league-card ${
                      completed
                        ? "complete"
                        : ""
                    } ${
                      current
                        ? "current"
                        : ""
                    }`}
                  >
                    <span>
                      {completed
                        ? "✓ TAMAM"
                        : current
                          ? "● ŞU AN"
                          : "KİLİTLİ"}
                    </span>

                    <h3>
                      {
                        item.name
                      }
                    </h3>

                    <p>
                      {item.min}–
                      {item.max} GEN
                      •{" "}
                      {
                        item.matches
                      }{" "}
                      maç
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <TopBar />
      <Notice />

      <main className="home-content mobile-home">
        <section className="welcome-area">
          <div className="section-label">
            SOCCER CARDS WAR
          </div>

          <h1>
            {game.clubName}
          </h1>

          <p>
            Kulübünü büyüt,
            kendi yıldızını
            geliştir ve kart
            savaşlarının zirvesine
            çık.
          </p>
        </section>

        <section className="club-overview">
          <div>
            <strong>
              {teamOverall}
            </strong>

            <span>
              DESTE GEN
            </span>
          </div>

          <div>
            <strong>
              {
                game.squad
                  .length
              }
              /10
            </strong>

            <span>
              MAÇ DESTESİ
            </span>
          </div>

          <div>
            <strong>
              {
                game.collection
                  .length
              }
            </strong>

            <span>KART</span>
          </div>

          <div>
            <strong>
              {
                game.trainingCap
              }
            </strong>

            <span>
              GELİŞİM MAX
            </span>
          </div>
        </section>

        <section className="menu-grid">
          <MenuCard
            icon="⚔️"
            label="RİSK MODU"
            title="KARİYER"
            onClick={() =>
              openScreen(
                "career"
              )
            }
          />

          <MenuCard
            icon="🏚️"
            label="10 AŞAMA"
            title="ETKİNLİKLER"
            onClick={() =>
              openScreen(
                "events"
              )
            }
          />

          <MenuCard
            icon="🛡️"
            label={`${game.squad.length}/10`}
            title="TAKIMIM"
            onClick={() =>
              openScreen(
                "squad"
              )
            }
          />

          <MenuCard
            icon="🎴"
            label={`${game.collection.length} KART`}
            title="KOLEKSİYON"
            onClick={() =>
              openScreen(
                "collection"
              )
            }
          />

          <MenuCard
            icon="🏋️"
            label="GERÇEK ZAMAN"
            title="ANTRENMAN"
            onClick={() =>
              openScreen(
                "training"
              )
            }
          />

          <MenuCard
            icon="🤝"
            label={`MAX ${game.marketCap} GEN`}
            title="TRANSFER"
            onClick={() =>
              openScreen(
                "transfers"
              )
            }
          />

          <MenuCard
            icon="🎁"
            label={`SERİ ${game.daily.streak}/7`}
            title="GÜNLÜK ÖDÜL"
            onClick={
              collectDailyReward
            }
          />

          <MenuCard
            icon={
              installed
                ? "✅"
                : "📲"
            }
            label={
              installed
                ? "KURULU"
                : "PWA"
            }
            title={
              installed
                ? "UYGULAMA"
                : "YÜKLE"
            }
            onClick={
              installApp
            }
          />
        </section>
      </main>
    </div>
  );
}

function MenuCard({
  icon,
  label,
  title,
  onClick,
}) {
  return (
    <button
      type="button"
      className="menu-card"
      onClick={onClick}
    >
      <div className="menu-icon">
        {icon}
      </div>

      <div>
        <span>
          {label}
        </span>

        <h2>
          {title}
        </h2>
      </div>
    </button>
  );
}

function BackButton({
  onClick,
}) {
  return (
    <button
      type="button"
      className="back-link"
      onClick={onClick}
    >
      ← ANA MENÜ
    </button>
  );
}

function PageHeading({
  label,
  title,
  text,
  stat,
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="section-label">
          {label}
        </div>

        <h1>
          {title}
        </h1>

        <p>
          {text}
        </p>
      </div>

      <div className="heading-stat">
        {stat}
      </div>
    </div>
  );
}

export default App;