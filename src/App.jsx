import { useEffect, useMemo, useState } from "react";
import PlayerCard from "./components/PlayerCard";

import "./career.css";
import "./mobile.css";

import {
  positions,
  generateStarterPlayers,
  generateMarketPlayers,
  createCustomPlayer,
  generateStreetShop,
  generateOpponentDeck,
  generatePlayer,
  getRarity,
} from "./data/players";

const SAVE_KEY = "soccer-cards-war-save-v2";

const trainingPlans = [
  {
    id: "basic",
    title: "Temel Antrenman",
    duration: "1 Saat",
    hours: 1,
    gain: 1,
    cost: 200,
  },
  {
    id: "intense",
    title: "Yoğun Antrenman",
    duration: "3 Saat",
    hours: 3,
    gain: 2,
    cost: 500,
  },
  {
    id: "camp",
    title: "Gelişim Kampı",
    duration: "8 Saat",
    hours: 8,
    gain: 4,
    cost: 1200,
  },
];

const careerLeagues = [
  {
    name: "Mahalle Ligi",
    min: 10,
    max: 30,
    matches: 10,
  },
  {
    name: "Amatör Lig",
    min: 25,
    max: 40,
    matches: 10,
  },
  {
    name: "Bölgesel Lig",
    min: 35,
    max: 50,
    matches: 10,
  },
  {
    name: "Şehir Ligi",
    min: 45,
    max: 60,
    matches: 10,
  },
  {
    name: "Profesyonel Lig",
    min: 55,
    max: 70,
    matches: 10,
  },
  {
    name: "Ulusal Lig",
    min: 65,
    max: 80,
    matches: 10,
  },
  {
    name: "Şampiyonlar Ligi",
    min: 78,
    max: 92,
    matches: 10,
  },
  {
    name: "Efsaneler Ligi",
    min: 90,
    max: 99,
    matches: 10,
  },
];

function createBlankGame() {
  return {
    clubName: "",

    coins: 5000,
    gems: 25,
    trophies: 0,

    collection: [],
    squad: [],

    market: [],
    streetShop: [],

    training: null,
    trainingCap: 30,

    street: {
      match: 1,
      streetCoins: 0,
      completed: false,
    },

    career: {
      leagueIndex: 0,
      match: 1,
      wins: 0,
      completed: false,
    },

    lastDailyReward: "",
  };
}

function normalizeGame(saved) {
  const blank = createBlankGame();

  if (!saved || typeof saved !== "object") {
    return blank;
  }

  return {
    ...blank,
    ...saved,

    collection: Array.isArray(saved.collection)
      ? saved.collection
      : [],

    squad: Array.isArray(saved.squad)
      ? saved.squad
      : [],

    market: Array.isArray(saved.market)
      ? saved.market
      : [],

    streetShop: Array.isArray(saved.streetShop)
      ? saved.streetShop
      : [],

    street: {
      ...blank.street,
      ...(saved.street || {}),
    },

    career: {
      ...blank.career,
      ...(saved.career || {}),
    },
  };
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function randomFive(players) {
  return shuffle(players).slice(0, 5);
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function averageOverall(players) {
  if (!players.length) {
    return 0;
  }

  const total = players.reduce(
    (sum, player) => sum + player.overall,
    0
  );

  return Math.round(total / players.length);
}

function formatTime(milliseconds) {
  if (milliseconds <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) =>
      String(value).padStart(2, "0")
    )
    .join(":");
}

function App() {
  const [started, setStarted] = useState(false);

  const [screen, setScreen] = useState("home");

  const [game, setGame] = useState(() => {
    try {
      const saved =
        localStorage.getItem(SAVE_KEY);

      if (saved) {
        return normalizeGame(
          JSON.parse(saved)
        );
      }
    } catch {
      // Yeni oyun.
    }

    return createBlankGame();
  });

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

  const [notice, setNotice] =
    useState("");

  const [now, setNow] =
    useState(Date.now());

  const [battle, setBattle] =
    useState(null);

  useEffect(() => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(game)
    );
  }, [game]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!game.training) {
      return;
    }

    if (now < game.training.endsAt) {
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
      setGame((previous) => ({
        ...previous,
        training: null,
      }));

      return;
    }

    const availableGain =
      Math.max(
        0,
        game.trainingCap -
          currentPlayer.overall
      );

    const actualGain =
      Math.min(
        training.gain,
        availableGain
      );

    setGame((previous) => ({
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

            const newOverall =
              player.overall +
              actualGain;

            return {
              ...player,

              overall:
                newOverall,

              rarity:
                getRarity(newOverall),
            };
          }
        ),

      training: null,
    }));

    setNotice(
      actualGain > 0
        ? `${currentPlayer.name} antrenmanı tamamladı. +${actualGain} GEN`
        : `${currentPlayer.name} gelişim sınırına ulaştı.`
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
                player.id === id
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

  function goHome() {
    setBattle(null);
    setScreen("home");
  }

  function resetGame() {
    const confirmed =
      window.confirm(
        "Tüm Soccer Cards War ilerlemen silinecek. Kulübün, kartların, paran, antrenmanların, etkinlik ve kariyer ilerlemen sıfırlanacak. Emin misin?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      SAVE_KEY
    );

    setGame(
      createBlankGame()
    );

    setStarted(false);

    setScreen("home");

    setBattle(null);

    setClubNameInput("");

    setCustomName("");

    setCustomPosition("ST");

    setTrainingPlayerId(null);

    setNotice("");
  }

  function createClub() {
    const name =
      clubNameInput.trim();

    if (!name) {
      setNotice(
        "Önce kulübüne bir isim ver."
      );

      return;
    }

    const starters =
      generateStarterPlayers(10);

    setGame({
      ...createBlankGame(),

      clubName: name,

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

      streetShop:
        generateStreetShop(),
    });

    setScreen("home");

    setNotice(
      `${name} kuruldu. İlk 10 futbolcun hazır.`
    );
  }

  function toggleSquadPlayer(
    playerId
  ) {
    setGame((previous) => {
      const selected =
        previous.squad.includes(
          playerId
        );

      if (selected) {
        return {
          ...previous,

          squad:
            previous.squad.filter(
              (id) =>
                id !== playerId
            ),
        };
      }

      if (
        previous.squad.length >= 10
      ) {
        setNotice(
          "Maç desten dolu. Önce bir oyuncuyu çıkar."
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
    });
  }

  function collectDailyReward() {
    const today =
      new Date().toDateString();

    if (
      game.lastDailyReward ===
      today
    ) {
      setNotice(
        "Bugünkü günlük ödülünü zaten aldın."
      );

      return;
    }

    setGame((previous) => ({
      ...previous,

      coins:
        previous.coins + 300,

      lastDailyReward:
        today,
    }));

    setNotice(
      "Günlük ödül: +300 Coin"
    );
  }

  function refreshMarket() {
    if (game.coins < 100) {
      setNotice(
        "Transfer listesini yenilemek için 100 Coin gerekiyor."
      );

      return;
    }

    setGame((previous) => ({
      ...previous,

      coins:
        previous.coins - 100,

      market:
        generateMarketPlayers(
          6,
          previous.trainingCap
        ),
    }));

    setNotice(
      "Transfer listesi yenilendi."
    );
  }

  function buyMarketPlayer(
    playerId
  ) {
    const player =
      game.market.find(
        (item) =>
          item.id === playerId
      );

    if (!player) {
      return;
    }

    if (
      game.coins <
      player.price
    ) {
      setNotice(
        "Yeterli Coin yok."
      );

      return;
    }

    setGame((previous) => ({
      ...previous,

      coins:
        previous.coins -
        player.price,

      collection: [
        ...previous.collection,

        {
          ...player,
          price: undefined,
        },
      ],

      market:
        previous.market.filter(
          (item) =>
            item.id !==
            playerId
        ),
    }));

    setNotice(
      `${player.name} kulübüne katıldı.`
    );
  }

  function createMyPlayer() {
    const name =
      customName.trim();

    if (!name) {
      setNotice(
        "Oyuncunun adını yaz."
      );

      return;
    }

    if (game.coins < 750) {
      setNotice(
        "Oyuncu oluşturmak için 750 Coin gerekiyor."
      );

      return;
    }

    const player =
      createCustomPlayer(
        name,
        customPosition
      );

    setGame((previous) => ({
      ...previous,

      coins:
        previous.coins - 750,

      collection: [
        ...previous.collection,
        player,
      ],
    }));

    setCustomName("");

    setNotice(
      `${player.name} oluşturuldu. 15 GEN'den başlıyor.`
    );
  }

  function startTraining(
    plan
  ) {
    if (!trainingPlayer) {
      setNotice(
        "Önce futbolcu seç."
      );

      return;
    }

    if (game.training) {
      setNotice(
        "Şu anda bir antrenman devam ediyor."
      );

      return;
    }

    if (
      trainingPlayer.overall >=
      game.trainingCap
    ) {
      setNotice(
        `${trainingPlayer.name} şu anki gelişim sınırına ulaştı.`
      );

      return;
    }

    if (
      game.coins <
      plan.cost
    ) {
      setNotice(
        "Yeterli Coin yok."
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

    setGame((previous) => ({
      ...previous,

      coins:
        previous.coins -
        plan.cost,

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
    }));

    setNotice(
      `${trainingPlayer.name} antrenmana başladı.`
    );
  }

  function streetOpponentStrength(
    match
  ) {
    const progress =
      (match - 1) / 24;

    return Math.round(
      10 +
        progress * 20
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
        : (game.career.match -
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

      phase:
        "playing",

      match,

      leagueIndex,

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

  function startStreetBattle() {
    if (
      game.street.completed
    ) {
      setNotice(
        "Sokak Futbolu tamamlandı."
      );

      return;
    }

    if (
      squadPlayers.length !== 10
    ) {
      setNotice(
        "Maça girmek için destende tam 10 kart olmalı."
      );

      return;
    }

    setBattle(
      buildBattle({
        mode: "street",

        match:
          game.street.match,

        target:
          streetOpponentStrength(
            game.street.match
          ),
      })
    );

    setNotice("");
  }

  function startCareerBattle() {
    if (
      game.career.completed
    ) {
      setNotice(
        "Kariyer liglerinin tamamını bitirdin."
      );

      return;
    }

    if (
      squadPlayers.length !== 10
    ) {
      setNotice(
        "Kariyer maçına girmek için destende tam 10 kart olmalı."
      );

      return;
    }

    setBattle(
      buildBattle({
        mode: "career",

        match:
          game.career.match,

        target:
          careerOpponentStrength(),

        leagueIndex:
          game.career
            .leagueIndex,
      })
    );

    setNotice("");
  }

  function playBattleCard(
    player
  ) {
    if (!battle) {
      return;
    }

    if (
      battle.phase !==
      "playing"
    ) {
      return;
    }

    if (battle.reveal) {
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

    setBattle((previous) => ({
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
            previous.round + 1,

          player,

          opponent:
            opponentCard,

          result,
        },
      ],
    }));
  }

  function nextBattleRound() {
    if (
      !battle ||
      !battle.reveal
    ) {
      return;
    }

    if (battle.round < 4) {
      setBattle(
        (previous) => ({
          ...previous,

          round:
            previous.round + 1,

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
        "sudden"
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

      if (
        playerAverage ===
        opponentAverage
      ) {
        won =
          Math.random() >= 0.5;
      } else {
        won =
          playerAverage >
          opponentAverage;
      }
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
    if (!battle?.result) {
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

    const isLastMatch =
      previous.career.match >=
      league.matches;

    const isLastLeague =
      previous.career
        .leagueIndex >=
      careerLeagues.length -
        1;

    if (
      isLastMatch &&
      isLastLeague
    ) {
      return {
        ...previous.career,

        wins:
          previous.career
            .wins + 1,

        completed: true,
      };
    }

    if (isLastMatch) {
      return {
        ...previous.career,

        leagueIndex:
          previous.career
            .leagueIndex + 1,

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
      "street"
    ) {
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

              streetCoins: 0,

              rewardPlayer:
                null,
            },
          })
        );

        return;
      }

      const streetCoins =
        70 +
        match * 18;

      let rewardPlayer =
        null;

      if (
        match % 5 === 0
      ) {
        const rewardOverall =
          Math.min(
            30,

            12 +
              Math.floor(
                match / 5
              ) *
                4
          );

        rewardPlayer =
          generatePlayer(
            rewardOverall,
            rewardOverall
          );
      }

      const finalMatch =
        match === 25;

      setGame(
        (previous) => ({
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
                  40,
                  previous.trainingCap
                )
              : previous.trainingCap,

          street: {
            ...previous.street,

            streetCoins:
              previous.street
                .streetCoins +
              streetCoins,

            match:
              finalMatch
                ? 25
                : match + 1,

            completed:
              finalMatch,
          },
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

            streetCoins,

            rewardPlayer,
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

      setGame(
        (previous) => ({
          ...previous,

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
          },
        })
      );
    }
  }

  function giveCareerCard(
    player
  ) {
    if (!battle) {
      return;
    }

    if (
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

          won: false,

          lostPlayer:
            player,
        },
      })
    );
  }

  function closeBattle() {
    setBattle(null);
  }

  function buyStreetPlayer(
    playerId
  ) {
    const player =
      game.streetShop.find(
        (item) =>
          item.id ===
          playerId
      );

    if (!player) {
      return;
    }

    if (
      game.street.streetCoins <
      player.eventPrice
    ) {
      setNotice(
        "Yeterli Street Coin yok."
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

        street: {
          ...previous.street,

          streetCoins:
            previous.street
              .streetCoins -
            player.eventPrice,
        },

        streetShop:
          previous.streetShop.filter(
            (item) =>
              item.id !==
              playerId
          ),
      })
    );

    setNotice(
      `${player.name} transfer edildi.`
    );
  }

  function TopBar() {
    return (
      <header className="top-bar">
        <button
          type="button"
          className="club-info club-button"
          onClick={goHome}
        >
          <div className="mini-logo">
            SCW
          </div>

          <div>
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
              {game.trophies}
            </b>
          </div>

          <button
            type="button"
            className="secondary-button reset-button"
            onClick={resetGame}
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

  function CardBack({
    label = "GİZLİ KART",
  }) {
    return (
      <div className="card-back">
        <div className="card-back-border">
          <div className="card-back-logo">
            SCW
          </div>

          <div className="card-back-ball">
            ⚽
          </div>

          <div className="card-back-label">
            {label}
          </div>
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

    const league =
      isCareer
        ? careerLeagues[
            battle.leagueIndex
          ]
        : null;

    const battleTitle =
      isCareer
        ? `${league.name} • MAÇ ${battle.match}`
        : `SOKAK FUTBOLU • MAÇ ${battle.match}`;

    if (
      battle.phase ===
      "loss-select"
    ) {
      return (
        <div className="battle-screen career-loss-screen">
          <div className="section-label">
            KARİYER CEZASI
          </div>

          <h1>
            1 KARTINI VER
          </h1>

          <p>
            Maçı kaybettin. Bu
            maça getirdiğin 10
            karttan bir futbolcuyu
            rakip kulübe vermek
            zorundasın.
          </p>

          <div className="career-loss-grid">
            {battle.playerDeck.map(
              (player) => (
                <PlayerCard
                  key={player.id}
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
        </div>
      );
    }

    if (
      battle.phase ===
      "finished"
    ) {
      return (
        <div className="battle-screen">
          <div className="battle-finished">
            <div className="section-label">
              MAÇ SONU
            </div>

            <h1
              className={
                battle.result.won
                  ? "victory-text"
                  : "defeat-text"
              }
            >
              {battle.result.won
                ? "GALİBİYET"
                : "MAĞLUBİYET"}
            </h1>

            <div className="final-score">
              {battle.playerScore}

              <span>
                -
              </span>

              {battle.opponentScore}
            </div>

            {battle.result.sudden && (
              <div className="career-sudden-note">
                SUDDEN DEATH
              </div>
            )}

            {battle.mode ===
              "street" &&
              battle.result.won && (
                <>
                  <div className="battle-reward">
                    🟠 +
                    {
                      battle.result
                        .streetCoins
                    }{" "}
                    STREET COIN
                  </div>

                  {battle.result
                    .rewardPlayer && (
                    <div className="reward-player">
                      <div className="section-label">
                        FUTBOLCU ÖDÜLÜ
                      </div>

                      <PlayerCard
                        player={
                          battle.result
                            .rewardPlayer
                        }
                      />
                    </div>
                  )}
                </>
              )}

            {battle.mode ===
              "street" &&
              !battle.result.won && (
                <p className="battle-loss-note">
                  Etkinlik maçında
                  kart kaybetmezsin.
                  Aynı maçı tekrar
                  deneyebilirsin.
                </p>
              )}

            {battle.mode ===
              "career" &&
              battle.result.won && (
                <>
                  <div className="career-transfer-title">
                    RAKİPTEN KART
                    KAZANDIN
                  </div>

                  <div className="reward-player">
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
              !battle.result.won &&
              battle.result
                .lostPlayer && (
                <>
                  <div className="career-lost-title">
                    RAKİBE GİDEN
                    OYUNCU
                  </div>

                  <div className="reward-player">
                    <PlayerCard
                      player={
                        battle.result
                          .lostPlayer
                      }
                    />
                  </div>
                </>
              )}

            <button
              type="button"
              className="event-play-button"
              onClick={closeBattle}
            >
              DEVAM ET
            </button>
          </div>
        </div>
      );
    }

    if (
      battle.phase ===
      "sudden"
    ) {
      return (
        <div className="battle-screen">
          <div className="battle-top">
            <div>
              <div className="section-label">
                {battleTitle}
              </div>

              <h1>
                SUDDEN DEATH
              </h1>
            </div>

            <div className="battle-score">
              <div>
                <span>
                  SEN
                </span>

                <strong>
                  {battle.playerScore}
                </strong>
              </div>

              <b>:</b>

              <div>
                <span>
                  RAKİP
                </span>

                <strong>
                  {battle.opponentScore}
                </strong>
              </div>
            </div>
          </div>

          {!battle.reveal ? (
            <>
              <div className="opponent-zone">
                <CardBack />
              </div>

              <div className="battle-message">
                İki yedek kartından
                birini seç.
              </div>

              <div className="battle-hand sudden-hand">
                {battle.suddenChoices.map(
                  (player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
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
              <div className="reveal-arena">
                <div>
                  <span className="reveal-side">
                    SEN
                  </span>

                  <PlayerCard
                    player={
                      battle.reveal
                        .player
                    }
                  />
                </div>

                <div className="versus-result">
                  <strong>
                    {
                      battle.reveal
                        .player
                        .overall
                    }
                  </strong>

                  <span>
                    VS
                  </span>

                  <strong>
                    {
                      battle.reveal
                        .opponent
                        .overall
                    }
                  </strong>
                </div>

                <div>
                  <span className="reveal-side">
                    RAKİP
                  </span>

                  <PlayerCard
                    player={
                      battle.reveal
                        .opponent
                    }
                  />
                </div>
              </div>

              <div
                className={
                  battle.result.won
                    ? "round-result round-win"
                    : "round-result round-loss"
                }
              >
                {battle.result.won
                  ? "MAÇ SENİN!"
                  : "RAKİP KAZANDI"}
              </div>

              <button
                type="button"
                className="event-play-button"
                onClick={
                  finishSuddenDeath
                }
              >
                SONUCU GÖR
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="battle-screen">
        <div className="battle-top">
          <div>
            <div className="section-label">
              {battleTitle}
            </div>

            <h1>
              RAUND{" "}
              {battle.round + 1}/5
            </h1>
          </div>

          <div className="battle-score">
            <div>
              <span>
                SEN
              </span>

              <strong>
                {battle.playerScore}
              </strong>
            </div>

            <b>:</b>

            <div>
              <span>
                RAKİP
              </span>

              <strong>
                {battle.opponentScore}
              </strong>
            </div>
          </div>
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
            />
          )}
        </div>

        {!battle.reveal ? (
          <>
            <div className="battle-message">
              Rakip kartını attı.
              <strong>
                {" "}
                Kartını seç.
              </strong>
            </div>

            <div className="battle-hand">
              {remainingCards.map(
                (player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
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
            <div className="reveal-arena">
              <div>
                <span className="reveal-side">
                  SEN
                </span>

                <PlayerCard
                  player={
                    battle.reveal
                      .player
                  }
                />
              </div>

              <div className="versus-result">
                <strong>
                  {
                    battle.reveal
                      .player
                      .overall
                  }
                </strong>

                <span>
                  VS
                </span>

                <strong>
                  {
                    battle.reveal
                      .opponent
                      .overall
                  }
                </strong>
              </div>

              <div>
                <span className="reveal-side">
                  RAKİP
                </span>

                <PlayerCard
                  player={
                    battle.reveal
                      .opponent
                  }
                />
              </div>
            </div>

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
                  ? "RAKİP ALDI"
                  : "BERABERE"}
            </div>

            <button
              type="button"
              className="event-play-button"
              onClick={
                nextBattleRound
              }
            >
              {battle.round === 4
                ? "MAÇI TAMAMLA"
                : "SONRAKİ RAUND"}
            </button>
          </>
        )}

        {battle.history.length >
          0 && (
          <div className="round-history">
            {battle.history.map(
              (round) => (
                <div
                  key={
                    round.round
                  }
                  className="history-item"
                >
                  <span>
                    R{round.round}
                  </span>

                  <strong>
                    {
                      round.player
                        .overall
                    }
                    -
                    {
                      round.opponent
                        .overall
                    }
                  </strong>

                  <b
                    className={
                      round.result ===
                      "win"
                        ? "history-win"
                        : round.result ===
                            "loss"
                          ? "history-loss"
                          : "history-draw"
                    }
                  >
                    {round.result ===
                    "win"
                      ? "W"
                      : round.result ===
                          "loss"
                        ? "L"
                        : "D"}
                  </b>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  if (!started) {
    return (
      <div className="intro-screen">
        <div className="intro-content">
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
            Oyuncularını geliştir.
            Zirveye çık.
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
            EL TURCO • EARLY ACCESS
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
            YENİ KARİYER
          </div>

          <h1>
            KULÜBÜNÜ KUR
          </h1>

          <p>
            Takımının adını sen belirle.
          </p>

          <input
            value={
              clubNameInput
            }
            onChange={(event) =>
              setClubNameInput(
                event.target.value
              )
            }
            maxLength={24}
            placeholder="Kulüp adı"
          />

          <button
            type="button"
            className="primary-button setup-create"
            onClick={createClub}
          >
            KULÜBÜ OLUŞTUR
          </button>

          <small>
            Başlangıçta 10 futbolcu verilir.
          </small>
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
          <button
            className="back-link"
            onClick={goHome}
          >
            ← ANA MENÜ
          </button>

          <div className="page-heading">
            <div>
              <div className="section-label">
                10 KARTLIK DESTE
              </div>

              <h1>
                TAKIMIM
              </h1>

              <p>
                Maçta 10 kartından rastgele 5'i eline gelir.
              </p>
            </div>

            <div className="overall-box">
              <strong>
                {teamOverall}
              </strong>

              <span>
                DESTE GEN
              </span>
            </div>
          </div>

          <div className="squad-counter">
            {game.squad.length}/10
          </div>

          <div className="collection-grid">
            {game.collection
              .slice()
              .sort(
                (a, b) =>
                  b.overall -
                  a.overall
              )
              .map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
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
              ))}
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
          <button
            className="back-link"
            onClick={goHome}
          >
            ← ANA MENÜ
          </button>

          <div className="page-heading">
            <div>
              <div className="section-label">
                FUTBOLCULARIM
              </div>

              <h1>
                KOLEKSİYON
              </h1>

              <p>
                Toplam{" "}
                {game.collection.length} kart.
              </p>
            </div>
          </div>

          <div className="collection-grid">
            {game.collection
              .slice()
              .sort(
                (a, b) =>
                  b.overall -
                  a.overall
              )
              .map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  selected={
                    game.squad.includes(
                      player.id
                    )
                  }
                />
              ))}
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
        ? game.training.endsAt -
          now
        : 0;

    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <button
            className="back-link"
            onClick={goHome}
          >
            ← ANA MENÜ
          </button>

          <div className="page-heading">
            <div>
              <div className="section-label">
                GELİŞİM MERKEZİ
              </div>

              <h1>
                ANTRENMAN
              </h1>

              <p>
                Futbolcularını gerçek zamanlı geliştir.
              </p>
            </div>

            <div className="overall-box">
              <strong>
                {game.trainingCap}
              </strong>

              <span>
                GELİŞİM SINIRI
              </span>
            </div>
          </div>

          {game.training && (
            <div className="training-running">
              <div>
                <span>
                  ANTRENMAN DEVAM EDİYOR
                </span>

                <h2>
                  {game.training.playerName}
                </h2>

                <p>
                  {game.training.planName}
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
            FUTBOLCUYU SEÇ
          </h2>

          <div className="collection-grid">
            {game.collection
              .slice()
              .sort(
                (a, b) =>
                  b.overall -
                  a.overall
              )
              .map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
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
              ))}
          </div>

          <h2 className="screen-subtitle training-program-title">
            PROGRAM SEÇ
          </h2>

          <div className="training-plans">
            {trainingPlans.map(
              (plan) => (
                <button
                  type="button"
                  key={plan.id}
                  className="training-plan"
                  onClick={() =>
                    startTraining(
                      plan
                    )
                  }
                >
                  <span>
                    {plan.duration}
                  </span>

                  <h3>
                    {plan.title}
                  </h3>

                  <strong>
                    +{plan.gain} GEN
                  </strong>

                  <small>
                    🪙 {plan.cost}
                  </small>
                </button>
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  if (
    screen === "transfers"
  ) {
    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <button
            className="back-link"
            onClick={goHome}
          >
            ← ANA MENÜ
          </button>

          <div className="page-heading">
            <div>
              <div className="section-label">
                KULÜP YÖNETİMİ
              </div>

              <h1>
                TRANSFERLER
              </h1>

              <p>
                Güçlü futbolcu daha pahalıdır.
              </p>
            </div>

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

          <div className="custom-player-box">
            <div>
              <div className="section-label">
                KENDİ FUTBOLCUN
              </div>

              <h2>
                OYUNCU OLUŞTUR
              </h2>

              <p>
                15 GEN başlar. Antrenmanlarla kendi yıldızını geliştir.
              </p>
            </div>

            <div className="custom-player-form">
              <input
                value={customName}
                onChange={(event) =>
                  setCustomName(
                    event.target.value
                  )
                }
                placeholder="Oyuncu adı"
              />

              <select
                value={
                  customPosition
                }
                onChange={(event) =>
                  setCustomPosition(
                    event.target.value
                  )
                }
              >
                {positions.map(
                  (position) => (
                    <option
                      key={position}
                    >
                      {position}
                    </option>
                  )
                )}
              </select>

              <button
                className="primary-button"
                type="button"
                onClick={
                  createMyPlayer
                }
              >
                OLUŞTUR • 🪙 750
              </button>
            </div>
          </div>

          <h2 className="screen-subtitle">
            TRANSFER PAZARI
          </h2>

          <div className="collection-grid">
            {game.market.map(
              (player) => (
                <PlayerCard
                  key={player.id}
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

  if (
    screen === "events"
  ) {
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
      streetOpponentStrength(
        game.street.match
      );

    return (
      <div className="game-screen">
        <TopBar />
        <Notice />

        <main className="page-content">
          <button
            className="back-link"
            onClick={goHome}
          >
            ← ANA MENÜ
          </button>

          <div className="street-hero">
            <div>
              <div className="section-label">
                ETKİNLİK 01
              </div>

              <h1>
                🏚️ SOKAK FUTBOLU
              </h1>

              <p>
                25 maç. Kart kaybı yok.
              </p>
            </div>

            <div className="street-currency">
              🟠{" "}
              {game.street.streetCoins}
            </div>
          </div>

          <div className="event-progress">
            <div>
              <span>
                İLERLEME
              </span>

              <strong>
                {game.street.completed
                  ? "25 / 25"
                  : `${game.street.match} / 25`}
              </strong>
            </div>

            <div>
              <span>
                RAKİP
              </span>

              <strong>
                ~{opponentStrength} GEN
              </strong>
            </div>

            <div>
              <span>
                DESTE
              </span>

              <strong>
                {game.squad.length}/10
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="event-play-button"
            disabled={
              game.street.completed
            }
            onClick={
              startStreetBattle
            }
          >
            {game.street.completed
              ? "ETKİNLİK TAMAMLANDI"
              : `MAÇ ${game.street.match}'E GİR`}
          </button>

          <div className="event-shop-heading">
            <div>
              <div className="section-label">
                ETKİNLİK MAĞAZASI
              </div>

              <h2>
                SOKAK PAZARI
              </h2>
            </div>
          </div>

          <div className="collection-grid">
            {game.streetShop.map(
              (player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  price={
                    player.eventPrice
                  }
                  currency="street"
                  onClick={() =>
                    buyStreetPlayer(
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
    screen === "career"
  ) {
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
        game.career.leagueIndex,
        careerLeagues.length - 1
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
          <button
            className="back-link"
            onClick={goHome}
          >
            ← ANA MENÜ
          </button>

          <div className="career-hero">
            <div>
              <div className="section-label">
                KARİYER MODU
              </div>

              <h1>
                {game.career.completed
                  ? "KARİYER TAMAMLANDI"
                  : league.name}
              </h1>

              <p>
                Kazanırsan rakipten kart alırsın. Kaybedersen kendi 10 kartından birini verirsin.
              </p>
            </div>

            <div className="career-risk-badge">
              ⚠️ KART KAYBI
            </div>
          </div>

          <div className="career-stats">
            <div>
              <span>
                LİG
              </span>

              <strong>
                {leagueIndex + 1}/
                {careerLeagues.length}
              </strong>
            </div>

            <div>
              <span>
                MAÇ
              </span>

              <strong>
                {game.career.match}/
                {league.matches}
              </strong>
            </div>

            <div>
              <span>
                RAKİP
              </span>

              <strong>
                ~{opponentStrength}
              </strong>
            </div>

            <div>
              <span>
                GALİBİYET
              </span>

              <strong>
                {game.career.wins}
              </strong>
            </div>
          </div>

          {!game.career.completed && (
            <button
              type="button"
              className="career-play-button"
              onClick={
                startCareerBattle
              }
            >
              ⚔️ MAÇ{" "}
              {game.career.match}
              'E GİR
            </button>
          )}

          <div className="career-road-title">
            <div className="section-label">
              KARİYER YOLU
            </div>

            <h2>
              LİGLER
            </h2>
          </div>

          <div className="career-road">
            {careerLeagues.map(
              (item, index) => {
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
                    key={item.name}
                    className={`career-league-card ${
                      completed
                        ? "career-league-complete"
                        : ""
                    } ${
                      current
                        ? "career-league-current"
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
                      {item.name}
                    </h3>

                    <p>
                      {item.min}–
                      {item.max} GEN
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
              {game.squad.length}/10
            </strong>

            <span>
              DESTE
            </span>
          </div>

          <div>
            <strong>
              {game.collection.length}
            </strong>

            <span>
              KART
            </span>
          </div>

          <div>
            <strong>
              {game.trainingCap}
            </strong>

            <span>
              ANTRENMAN
            </span>
          </div>
        </section>

        <section className="menu-grid">
          <button
            className="menu-card career-card"
            onClick={() =>
              setScreen("career")
            }
          >
            <div className="menu-icon">
              ⚔️
            </div>

            <div>
              <span>
                RİSK MODU
              </span>

              <h2>
                KARİYER
              </h2>
            </div>
          </button>

          <button
            className="menu-card event-card"
            onClick={() =>
              setScreen("events")
            }
          >
            <div className="menu-icon">
              🏚️
            </div>

            <div>
              <span>
                TURNUVA
              </span>

              <h2>
                ETKİNLİK
              </h2>
            </div>
          </button>

          <button
            className="menu-card"
            onClick={() =>
              setScreen("squad")
            }
          >
            <div className="menu-icon">
              🛡️
            </div>

            <div>
              <span>
                10 KART
              </span>

              <h2>
                TAKIM
              </h2>
            </div>
          </button>

          <button
            className="menu-card"
            onClick={() =>
              setScreen(
                "collection"
              )
            }
          >
            <div className="menu-icon">
              🎴
            </div>

            <div>
              <span>
                KARTLAR
              </span>

              <h2>
                KOLEKSİYON
              </h2>
            </div>
          </button>

          <button
            className="menu-card training-card"
            onClick={() =>
              setScreen(
                "training"
              )
            }
          >
            <div className="menu-icon">
              🏋️
            </div>

            <div>
              <span>
                GELİŞİM
              </span>

              <h2>
                ANTRENMAN
              </h2>
            </div>
          </button>

          <button
            className="menu-card transfer-card"
            onClick={() =>
              setScreen(
                "transfers"
              )
            }
          >
            <div className="menu-icon">
              🤝
            </div>

            <div>
              <span>
                PAZAR
              </span>

              <h2>
                TRANSFER
              </h2>
            </div>
          </button>

          <button
            className="daily-card mobile-daily"
            type="button"
            onClick={
              collectDailyReward
            }
          >
            <div className="menu-icon">
              🎁
            </div>

            <div>
              <span>
                +300 COIN
              </span>

              <h2>
                GÜNLÜK ÖDÜL
              </h2>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;