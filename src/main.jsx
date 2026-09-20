import {
  StrictMode,
  createElement,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

const SAVE_KEY =
  "soccer-cards-war-save-v4";

const STATS_KEY =
  "scw-achievement-stats-v3";

const EVENT_META = [
  [
    "street",
    "Sokak Futbolu",
    25,
    "🏚️",
  ],
  [
    "turf",
    "Halı Saha",
    25,
    "⚽",
  ],
  [
    "city",
    "Şehir Kupası",
    30,
    "🌆",
  ],
  [
    "stadium",
    "Amatör Stadyum",
    30,
    "🏟️",
  ],
  [
    "pro",
    "Profesyonel Arena",
    35,
    "🥈",
  ],
  [
    "national",
    "Ulusal Kupa",
    35,
    "🏆",
  ],
  [
    "europe",
    "Avrupa Arenası",
    40,
    "🌍",
  ],
  [
    "champions",
    "Şampiyonlar Ligi",
    40,
    "⭐",
  ],
  [
    "world",
    "Dünya Şampiyonası",
    45,
    "🌐",
  ],
  [
    "legends",
    "Efsaneler Arenası",
    50,
    "👑",
  ],
].map(
  ([
    id,
    name,
    matches,
    icon,
  ]) => ({
    id,
    name,
    matches,
    icon,
  })
);

function emptyStats() {
  return {
    trainingsCompleted:
      0,

    marketPurchases:
      0,

    customPlayersCreated:
      0,

    maxCollection:
      0,

    maxOverall:
      0,

    maxCustomOverall:
      0,

    maxSquadAverage:
      0,

    maxCareerWins:
      0,

    maxCareerLeague:
      1,

    maxEventWins:
      0,

    maxCompletedEvents:
      0,

    maxCoins:
      0,

    bestDailyStreak:
      0,

    unlocked: [],
  };
}

function readJson(
  key,
  fallback = null
) {
  try {
    const raw =
      localStorage.getItem(
        key
      );

    return raw
      ? JSON.parse(raw)
      : fallback;
  } catch {
    return fallback;
  }
}

function readGame() {
  return readJson(
    SAVE_KEY,
    null
  );
}

function readStats() {
  const saved =
    readJson(
      STATS_KEY,
      null
    );

  if (!saved) {
    return emptyStats();
  }

  return {
    ...emptyStats(),

    ...saved,

    unlocked:
      Array.isArray(
        saved.unlocked
      )
        ? saved.unlocked
        : [],
  };
}

function writeStats(
  stats
) {
  localStorage.setItem(
    STATS_KEY,
    JSON.stringify(
      stats
    )
  );
}

function collection(
  game
) {
  return Array.isArray(
    game?.collection
  )
    ? game.collection
    : [];
}

function squadPlayers(
  game
) {
  const players =
    collection(game);

  const ids =
    Array.isArray(
      game?.squad
    )
      ? game.squad
      : [];

  return ids
    .map((id) =>
      players.find(
        (player) =>
          player.id === id
      )
    )
    .filter(Boolean);
}

function highestOverall(
  game
) {
  const players =
    collection(game);

  return players.length
    ? Math.max(
        ...players.map(
          (player) =>
            Number(
              player.overall
            ) || 0
        )
      )
    : 0;
}

function highestCustomOverall(
  game
) {
  const players =
    collection(
      game
    ).filter(
      (player) =>
        player.custom
    );

  return players.length
    ? Math.max(
        ...players.map(
          (player) =>
            Number(
              player.overall
            ) || 0
        )
      )
    : 0;
}

function squadAverage(
  game
) {
  const players =
    squadPlayers(game);

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
        (Number(
          player.overall
        ) || 0),

      0
    ) / players.length
  );
}

function eventWins(
  game
) {
  return EVENT_META.reduce(
    (
      total,
      event
    ) => {
      const state =
        game?.events?.[
          event.id
        ];

      if (!state) {
        return total;
      }

      if (
        state.completed
      ) {
        return (
          total +
          event.matches
        );
      }

      return (
        total +
        Math.max(
          0,

          (Number(
            state.match
          ) || 1) - 1
        )
      );
    },

    0
  );
}

function completedEvents(
  game
) {
  return EVENT_META.filter(
    (event) =>
      game?.events?.[
        event.id
      ]?.completed
  ).length;
}

function eventDone(
  game,
  id
) {
  return game?.events?.[
    id
  ]?.completed
    ? 1
    : 0;
}

function careerWins(
  game
) {
  return (
    Number(
      game?.career?.wins ??
        game?.trophies ??
        0
    ) || 0
  );
}

function careerLeague(
  game
) {
  if (
    game?.career
      ?.completed
  ) {
    return 8;
  }

  return Math.min(
    8,

    (Number(
      game?.career
        ?.leagueIndex
    ) || 0) + 1
  );
}

function syncMaxStats(
  game,
  stats
) {
  if (!game) {
    return stats;
  }

  return {
    ...stats,

    maxCollection:
      Math.max(
        stats.maxCollection,

        collection(game)
          .length
      ),

    maxOverall:
      Math.max(
        stats.maxOverall,

        highestOverall(
          game
        )
      ),

    maxCustomOverall:
      Math.max(
        stats.maxCustomOverall,

        highestCustomOverall(
          game
        )
      ),

    maxSquadAverage:
      Math.max(
        stats.maxSquadAverage,

        squadAverage(game)
      ),

    maxCareerWins:
      Math.max(
        stats.maxCareerWins,

        careerWins(game)
      ),

    maxCareerLeague:
      Math.max(
        stats.maxCareerLeague,

        careerLeague(game)
      ),

    maxEventWins:
      Math.max(
        stats.maxEventWins,

        eventWins(game)
      ),

    maxCompletedEvents:
      Math.max(
        stats.maxCompletedEvents,

        completedEvents(
          game
        )
      ),

    maxCoins:
      Math.max(
        stats.maxCoins,

        Number(
          game.coins
        ) || 0
      ),

    bestDailyStreak:
      Math.max(
        stats.bestDailyStreak,

        Number(
          game?.daily
            ?.streak
        ) || 0
      ),
  };
}

const achievement = (
  id,
  category,
  icon,
  title,
  description,
  target,
  value
) => ({
  id,
  category,
  icon,
  title,
  description,
  target,
  value,
});

const milestoneAchievements =
  (
    prefix,
    category,
    icon,
    milestones,
    value,
    title,
    description
  ) =>
    milestones.map(
      (target) =>
        achievement(
          `${prefix}-${target}`,

          category,

          icon,

          title(target),

          description(
            target
          ),

          target,

          value
        )
    );

const ACHIEVEMENTS = [
  ...milestoneAchievements(
    "train",

    "Antrenman",

    "🏋️",

    [
      1,
      3,
      5,
      10,
      20,
      35,
      50,
      75,
      100,
      150,
      250,
      500,
    ],

    (
      _game,
      stats
    ) =>
      stats.trainingsCompleted,

    (n) =>
      n === 1
        ? "İlk Ter"
        : `${n} Antrenman`,

    (n) =>
      `${n} antrenman tamamla.`
  ),

  ...milestoneAchievements(
    "buy",

    "Transfer",

    "🤝",

    [
      1,
      3,
      5,
      10,
      15,
      25,
      40,
      60,
      100,
      150,
      250,
      500,
    ],

    (
      _game,
      stats
    ) =>
      stats.marketPurchases,

    (n) =>
      n === 1
        ? "İlk İmza"
        : `${n} Transfer`,

    (n) =>
      `Transfer pazarından ${n} oyuncu satın al.`
  ),

  ...milestoneAchievements(
    "cards",

    "Koleksiyon",

    "🎴",

    [
      12,
      15,
      20,
      25,
      30,
      40,
      50,
      60,
      75,
      100,
      150,
      200,
    ],

    (
      _game,
      stats
    ) =>
      stats.maxCollection,

    (n) =>
      `${n} Kart Kulübü`,

    (n) =>
      `Koleksiyonunda aynı anda ${n} karta ulaş.`
  ),

  ...milestoneAchievements(
    "overall",

    "Oyuncu Gelişimi",

    "⭐",

    [
      25,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      95,
      99,
    ],

    (
      _game,
      stats
    ) =>
      stats.maxOverall,

    (n) =>
      n === 99
        ? "GOAT"
        : `${n} GEN`,

    (n) =>
      `${n} GEN bir oyuncuya sahip ol.`
  ),

  achievement(
    "team-25",

    "Oyuncu Gelişimi",

    "🛡️",

    "Güçlü Onlu",

    "10 kartlık maç destesi ortalamanı 25 GEN yap.",

    25,

    (
      _game,
      stats
    ) =>
      stats.maxSquadAverage
  ),

  achievement(
    "team-50",

    "Oyuncu Gelişimi",

    "🛡️",

    "Süper Takım",

    "10 kartlık maç destesi ortalamanı 50 GEN yap.",

    50,

    (
      _game,
      stats
    ) =>
      stats.maxSquadAverage
  ),

  achievement(
    "custom-create",

    "Kendi Oyuncun",

    "👤",

    "Ben Geldim",

    "Kendi futbolcunu oluştur.",

    1,

    (
      _game,
      stats
    ) =>
      stats.customPlayersCreated
  ),

  ...milestoneAchievements(
    "custom",

    "Kendi Oyuncun",

    "👤",

    [
      20,
      30,
      40,
      50,
      70,
      90,
      99,
    ],

    (
      _game,
      stats
    ) =>
      stats.maxCustomOverall,

    (n) =>
      n === 99
        ? "Kendi GOAT'ım"
        : `Benim Oyuncum ${n}`,

    (n) =>
      `Kendi oluşturduğun oyuncuyu ${n} GEN yap.`
  ),

  ...milestoneAchievements(
    "career",

    "Kariyer",

    "⚔️",

    [
      1,
      3,
      5,
      10,
      15,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
    ],

    (
      _game,
      stats
    ) =>
      stats.maxCareerWins,

    (n) =>
      n === 1
        ? "İlk Zafer"
        : `${n} Kariyer Zaferi`,

    (n) =>
      `${n} kariyer maçı kazan.`
  ),

  achievement(
    "league-4",

    "Kariyer",

    "🏟️",

    "Yarı Yol",

    "4. kariyer ligine ulaş.",

    4,

    (
      _game,
      stats
    ) =>
      stats.maxCareerLeague
  ),

  achievement(
    "league-8",

    "Kariyer",

    "🌟",

    "Efsaneler Kapısı",

    "8. kariyer ligine ulaş.",

    8,

    (
      _game,
      stats
    ) =>
      stats.maxCareerLeague
  ),

  achievement(
    "career-finish",

    "Kariyer",

    "👑",

    "Kariyer Şampiyonu",

    "Kariyer modunu tamamen bitir.",

    1,

    (game) =>
      game?.career
        ?.completed
        ? 1
        : 0
  ),

  ...milestoneAchievements(
    "event-wins",

    "Etkinlikler",

    "🔥",

    [
      1,
      10,
      25,
      50,
      100,
      150,
      250,
      355,
    ],

    (
      _game,
      stats
    ) =>
      stats.maxEventWins,

    (n) =>
      n === 1
        ? "İlk Etkinlik Zaferi"
        : `${n} Etkinlik Zaferi`,

    (n) =>
      `${n} etkinlik maçı kazan.`
  ),

  ...EVENT_META.map(
    (event) =>
      achievement(
        `finish-${event.id}`,

        "Etkinlikler",

        event.icon,

        `${event.name} Tamam`,

        `${event.name} etkinliğini bitir.`,

        1,

        (game) =>
          eventDone(
            game,
            event.id
          )
      )
  ),

  ...milestoneAchievements(
    "coins",

    "Ekonomi",

    "🪙",

    [
      5000,
      10000,
      25000,
      50000,
      100000,
      250000,
    ],

    (
      _game,
      stats
    ) =>
      stats.maxCoins,

    (n) =>
      `${n.toLocaleString(
        "tr-TR"
      )} Coin`,

    (n) =>
      `Aynı anda ${n.toLocaleString(
        "tr-TR"
      )} Coin'e sahip ol.`
  ),

  ...milestoneAchievements(
    "daily",

    "Günlük",

    "📅",

    [
      3,
      5,
      7,
    ],

    (
      _game,
      stats
    ) =>
      stats.bestDailyStreak,

    (n) =>
      `${n} Günlük Seri`,

    (n) =>
      `${n} günlük giriş serisine ulaş.`
  ),

  achievement(
    "all-events",

    "Özel",

    "🌍",

    "Her Arenanın Şampiyonu",

    "10 etkinliğin tamamını bitir.",

    10,

    (
      _game,
      stats
    ) =>
      stats.maxCompletedEvents
  ),

  achievement(
    "el-turco-legend",

    "Özel",

    "👑",

    "EL TURCO EFSANESİ",

    "Kariyeri bitir, 10 etkinliği tamamla, 99 GEN oyuncuya ve 99 GEN kendi oyuncuna ulaş.",

    4,

    (
      game,
      stats
    ) =>
      (
        game?.career
          ?.completed
          ? 1
          : 0
      ) +
      (
        stats.maxCompletedEvents >=
        10
          ? 1
          : 0
      ) +
      (
        stats.maxOverall >=
        99
          ? 1
          : 0
      ) +
      (
        stats.maxCustomOverall >=
        99
          ? 1
          : 0
      )
  ),
];

if (
  ACHIEVEMENTS.length !==
  100
) {
  console.error(
    `SCW achievement count error: ${ACHIEVEMENTS.length}`
  );
}

function percent(
  current,
  target
) {
  if (
    target <= 0
  ) {
    return 100;
  }

  return Math.max(
    0,

    Math.min(
      100,

      Math.round(
        (
          current /
          target
        ) * 100
      )
    )
  );
}

function unlockAchievements(
  game,
  stats
) {
  const unlocked =
    new Set(
      stats.unlocked ||
        []
    );

  ACHIEVEMENTS.forEach(
    (item) => {
      const current =
        Number(
          item.value(
            game,
            stats
          )
        ) || 0;

      if (
        current >=
        item.target
      ) {
        unlocked.add(
          item.id
        );
      }
    }
  );

  return {
    ...stats,

    unlocked:
      [...unlocked],
  };
}

function processGameChange(
  previousGame,
  nextGame,
  existingStats =
    readStats()
) {
  let stats = {
    ...existingStats,
  };

  if (
    previousGame?.clubName &&
    !nextGame?.clubName
  ) {
    stats =
      emptyStats();
  }

  if (
    previousGame &&
    nextGame
  ) {
    if (
      previousGame.training &&
      !nextGame.training
    ) {
      const oldPlayer =
        collection(
          previousGame
        ).find(
          (player) =>
            player.id ===
            previousGame
              .training
              .playerId
        );

      const newPlayer =
        collection(
          nextGame
        ).find(
          (player) =>
            player.id ===
            previousGame
              .training
              .playerId
        );

      if (
        oldPlayer &&
        newPlayer &&
        (
          Number(
            newPlayer.overall
          ) || 0
        ) >
          (
            Number(
              oldPlayer.overall
            ) || 0
          )
      ) {
        stats.trainingsCompleted +=
          1;
      }
    }

    const oldMarket =
      Array.isArray(
        previousGame.market
      )
        ? previousGame.market
        : [];

    const newMarket =
      Array.isArray(
        nextGame.market
      )
        ? nextGame.market
        : [];

    const newMarketIds =
      new Set(
        newMarket.map(
          (player) =>
            player.id
        )
      );

    const newCollectionIds =
      new Set(
        collection(
          nextGame
        ).map(
          (player) =>
            player.id
        )
      );

    const purchased =
      oldMarket.filter(
        (player) =>
          !newMarketIds.has(
            player.id
          ) &&
          newCollectionIds.has(
            player.id
          )
      ).length;

    stats.marketPurchases +=
      purchased;

    const oldCustomCount =
      collection(
        previousGame
      ).filter(
        (player) =>
          player.custom
      ).length;

    const newCustomCount =
      collection(
        nextGame
      ).filter(
        (player) =>
          player.custom
      ).length;

    if (
      newCustomCount >
      oldCustomCount
    ) {
      stats.customPlayersCreated +=
        newCustomCount -
        oldCustomCount;
    }
  }

  stats =
    syncMaxStats(
      nextGame,
      stats
    );

  stats =
    unlockAchievements(
      nextGame,
      stats
    );

  writeStats(stats);

  return stats;
}

let lastGame =
  readGame();

let lastGameText =
  JSON.stringify(
    lastGame
  );

processGameChange(
  null,
  lastGame
);

setInterval(() => {
  const nextGame =
    readGame();

  const nextText =
    JSON.stringify(
      nextGame
    );

  if (
    nextText !==
    lastGameText
  ) {
    processGameChange(
      lastGame,
      nextGame
    );

    lastGame =
      nextGame;

    lastGameText =
      nextText;

    refreshAchievementButton();
  }
}, 700);

function calculatedAchievements() {
  const game =
    readGame();

  let stats =
    syncMaxStats(
      game,
      readStats()
    );

  stats =
    unlockAchievements(
      game,
      stats
    );

  const unlocked =
    new Set(
      stats.unlocked ||
        []
    );

  return ACHIEVEMENTS.map(
    (item) => {
      const current =
        Number(
          item.value(
            game,
            stats
          )
        ) || 0;

      const complete =
        unlocked.has(
          item.id
        ) ||
        current >=
          item.target;

      return {
        ...item,

        current,

        complete,

        progress:
          complete
            ? 100
            : percent(
                current,
                item.target
              ),
      };
    }
  );
}

function injectAchievementStyles() {
  if (
    document.getElementById(
      "scw-achievement-styles"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "scw-achievement-styles";

  style.textContent = `
    #scw-achievement-overlay {
      position: fixed;
      inset: 0;
      z-index: 999990;
      overflow-y: auto;
      background: #080a0e;
      color: #f4f6f8;
      font-family: Inter, system-ui, sans-serif;
    }

    .scw-achievement-shell {
      width: min(900px, 94%);
      margin: 0 auto;
      padding: 24px 0 70px;
    }

    .scw-achievement-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }

    .scw-achievement-heading span {
      display: block;
      color: #b98c39;
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 2px;
    }

    .scw-achievement-heading h1 {
      margin: 4px 0 0;
      font-size: 34px;
    }

    .scw-achievement-back {
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid #343a44;
      border-radius: 9px;
      background: #11151b;
      color: #fff;
      font-weight: 900;
      cursor: pointer;
    }

    .scw-achievement-summary {
      padding: 18px;
      border: 1px solid #604b24;
      border-radius: 15px;
      background:
        linear-gradient(
          135deg,
          #18140c,
          #0c0f13
        );
      margin-bottom: 22px;
    }

    .scw-achievement-summary-row {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
    }

    .scw-achievement-summary strong {
      display: block;
      color: #e4b65c;
      font-size: 38px;
    }

    .scw-achievement-summary small {
      color: #7a838f;
      font-size: 10px;
      font-weight: 900;
    }

    .scw-achievement-big-bar,
    .scw-achievement-bar {
      overflow: hidden;
      border-radius: 999px;
      background: #252a31;
    }

    .scw-achievement-big-bar {
      height: 10px;
      margin-top: 14px;
    }

    .scw-achievement-bar {
      height: 6px;
      margin-top: 9px;
    }

    .scw-achievement-big-bar > div,
    .scw-achievement-bar > div {
      height: 100%;
      border-radius: inherit;
      background:
        linear-gradient(
          90deg,
          #96631f,
          #e2b45a
        );
    }

    .scw-achievement-category {
      margin: 25px 0 9px;
      color: #9098a2;
      font-size: 9px;
      font-weight: 950;
      letter-spacing: 2px;
    }

    .scw-achievement-list {
      display: grid;
      gap: 7px;
    }

    .scw-achievement-card {
      display: grid;
      grid-template-columns:
        48px 1fr 60px;
      gap: 12px;
      align-items: center;
      padding: 13px;
      border: 1px solid #2c323a;
      border-radius: 12px;
      background:
        linear-gradient(
          145deg,
          #11151b,
          #0b0e12
        );
    }

    .scw-achievement-card.complete {
      border-color: #59672e;
      background:
        linear-gradient(
          145deg,
          #171a10,
          #0b0e0c
        );
    }

    .scw-achievement-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border-radius: 11px;
      background: #191e25;
      font-size: 23px;
    }

    .scw-achievement-main {
      min-width: 0;
    }

    .scw-achievement-main h3 {
      margin: 0;
      font-size: 13px;
    }

    .scw-achievement-main p {
      margin: 3px 0 0;
      color: #737c87;
      font-size: 9px;
      line-height: 1.35;
    }

    .scw-achievement-progress-text {
      text-align: right;
    }

    .scw-achievement-progress-text strong {
      display: block;
      color: #dfb258;
      font-size: 13px;
    }

    .scw-achievement-progress-text small {
      display: block;
      margin-top: 3px;
      color: #707984;
      font-size: 7px;
      font-weight: 900;
    }

    .scw-achievement-complete-label {
      color: #9fc55a !important;
    }

    @media (
      max-width: 650px
    ) {
      .scw-achievement-shell {
        width: 100%;
        padding:
          14px 10px
          calc(
            28px +
            env(
              safe-area-inset-bottom
            )
          );
      }

      .scw-achievement-heading h1 {
        font-size: 25px;
      }

      .scw-achievement-summary {
        padding: 13px;
      }

      .scw-achievement-summary strong {
        font-size: 28px;
      }

      .scw-achievement-card {
        grid-template-columns:
          38px 1fr 48px;
        gap: 8px;
        padding: 9px;
      }

      .scw-achievement-icon {
        width: 38px;
        height: 38px;
        font-size: 18px;
      }

      .scw-achievement-main h3 {
        font-size: 10px;
      }

      .scw-achievement-main p {
        font-size: 7px;
      }

      .scw-achievement-progress-text strong {
        font-size: 10px;
      }

      .scw-achievement-progress-text small {
        font-size: 6px;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}

function closeAchievements(
  useHistory = true
) {
  document
    .getElementById(
      "scw-achievement-overlay"
    )
    ?.remove();

  if (
    useHistory &&
    window.history.state
      ?.view ===
      "achievements"
  ) {
    window.history.back();
  }
}

function showAchievements() {
  if (
    document.getElementById(
      "scw-achievement-overlay"
    )
  ) {
    return;
  }

  injectAchievementStyles();

  const items =
    calculatedAchievements();

  const completed =
    items.filter(
      (item) =>
        item.complete
    ).length;

  const total =
    items.length;

  const totalPercent =
    percent(
      completed,
      total
    );

  window.history.pushState(
    {
      scw: true,
      view:
        "achievements",
    },

    "",

    window.location.href
  );

  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "scw-achievement-overlay";

  const shell =
    document.createElement(
      "div"
    );

  shell.className =
    "scw-achievement-shell";

  const top =
    document.createElement(
      "div"
    );

  top.className =
    "scw-achievement-top";

  const heading =
    document.createElement(
      "div"
    );

  heading.className =
    "scw-achievement-heading";

  heading.innerHTML = `
    <span>
      SOCCER CARDS WAR
    </span>

    <h1>
      🏅 BAŞARIMLAR
    </h1>
  `;

  const back =
    document.createElement(
      "button"
    );

  back.type =
    "button";

  back.className =
    "scw-achievement-back";

  back.textContent =
    "← ANA MENÜ";

  back.addEventListener(
    "click",

    () =>
      closeAchievements(
        true
      )
  );

  top.append(
    heading,
    back
  );

  const summary =
    document.createElement(
      "section"
    );

  summary.className =
    "scw-achievement-summary";

  summary.innerHTML = `
    <div
      class="scw-achievement-summary-row"
    >
      <div>
        <small>
          TOPLAM TAMAMLAMA
        </small>

        <strong>
          ${totalPercent}%
        </strong>
      </div>

      <small>
        ${completed} / ${total}
        BAŞARIM
      </small>
    </div>

    <div
      class="scw-achievement-big-bar"
    >
      <div
        style="width:${totalPercent}%"
      ></div>
    </div>
  `;

  shell.append(
    top,
    summary
  );

  const categories = [
    ...new Set(
      items.map(
        (item) =>
          item.category
      )
    ),
  ];

  categories.forEach(
    (category) => {
      const categoryTitle =
        document.createElement(
          "div"
        );

      categoryTitle.className =
        "scw-achievement-category";

      categoryTitle.textContent =
        category.toUpperCase();

      shell.appendChild(
        categoryTitle
      );

      const list =
        document.createElement(
          "div"
        );

      list.className =
        "scw-achievement-list";

      items
        .filter(
          (item) =>
            item.category ===
            category
        )
        .forEach(
          (item) => {
            const card =
              document.createElement(
                "div"
              );

            card.className =
              `scw-achievement-card${
                item.complete
                  ? " complete"
                  : ""
              }`;

            const icon =
              document.createElement(
                "div"
              );

            icon.className =
              "scw-achievement-icon";

            icon.textContent =
              item.complete
                ? "✅"
                : item.icon;

            const main =
              document.createElement(
                "div"
              );

            main.className =
              "scw-achievement-main";

            const h3 =
              document.createElement(
                "h3"
              );

            h3.textContent =
              item.title;

            const p =
              document.createElement(
                "p"
              );

            p.textContent =
              item.description;

            const bar =
              document.createElement(
                "div"
              );

            bar.className =
              "scw-achievement-bar";

            const fill =
              document.createElement(
                "div"
              );

            fill.style.width =
              `${item.progress}%`;

            bar.appendChild(
              fill
            );

            main.append(
              h3,
              p,
              bar
            );

            const progress =
              document.createElement(
                "div"
              );

            progress.className =
              "scw-achievement-progress-text";

            const strong =
              document.createElement(
                "strong"
              );

            if (
              item.complete
            ) {
              strong.className =
                "scw-achievement-complete-label";
            }

            strong.textContent =
              `${item.progress}%`;

            const small =
              document.createElement(
                "small"
              );

            small.textContent =
              item.complete
                ? "TAMAM"
                : `${Math.min(
                    item.current,
                    item.target
                  ).toLocaleString(
                    "tr-TR"
                  )}/${item.target.toLocaleString(
                    "tr-TR"
                  )}`;

            progress.append(
              strong,
              small
            );

            card.append(
              icon,
              main,
              progress
            );

            list.appendChild(
              card
            );
          }
        );

      shell.appendChild(
        list
      );
    }
  );

  overlay.appendChild(
    shell
  );

  document.body.appendChild(
    overlay
  );
}

function refreshAchievementButton() {
  const menu =
    document.querySelector(
      ".menu-grid"
    );

  if (!menu) {
    return;
  }

  const items =
    calculatedAchievements();

  const completed =
    items.filter(
      (item) =>
        item.complete
    ).length;

  const label =
    `${percent(
      completed,
      items.length
    )}% • ${completed}/${items.length}`;

  let button =
    menu.querySelector(
      "[data-scw-achievements-button]"
    );

  if (!button) {
    button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "menu-card";

    button.dataset.scwAchievementsButton =
      "true";

    const icon =
      document.createElement(
        "div"
      );

    icon.className =
      "menu-icon";

    icon.textContent =
      "🏅";

    const copy =
      document.createElement(
        "div"
      );

    const span =
      document.createElement(
        "span"
      );

    span.dataset.scwAchievementLabel =
      "true";

    const h2 =
      document.createElement(
        "h2"
      );

    h2.textContent =
      "BAŞARIMLAR";

    copy.append(
      span,
      h2
    );

    button.append(
      icon,
      copy
    );

    button.addEventListener(
      "click",
      showAchievements
    );

    menu.appendChild(
      button
    );
  }

  const span =
    button.querySelector(
      "[data-scw-achievement-label]"
    );

  if (
    span &&
    span.textContent !==
      label
  ) {
    span.textContent =
      label;
  }
}

setInterval(
  refreshAchievementButton,
  700
);

const EXIT_BASE_STATE = {
  scw: true,

  scwExitGuard: true,

  view: "exit-base",
};

const HOME_GUARD_STATE = {
  scw: true,

  scwExitGuard: true,

  view: "home",
};

let allowExit = false;

function prepareExitGuard() {
  if (
    !window.history.state
      ?.scwExitGuard
  ) {
    window.history.replaceState(
      EXIT_BASE_STATE,

      "",

      window.location.href
    );

    window.history.pushState(
      HOME_GUARD_STATE,

      "",

      window.location.href
    );
  }
}

function removeExitDialog() {
  document
    .getElementById(
      "scw-exit-dialog"
    )
    ?.remove();
}

function showExitDialog() {
  if (
    document.getElementById(
      "scw-exit-dialog"
    )
  ) {
    return;
  }

  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "scw-exit-dialog";

  Object.assign(
    overlay.style,
    {
      position:
        "fixed",

      inset: "0",

      zIndex:
        "999999",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      padding:
        "24px",

      background:
        "rgba(0,0,0,0.78)",

      backdropFilter:
        "blur(8px)",

      WebkitBackdropFilter:
        "blur(8px)",
    }
  );

  const panel =
    document.createElement(
      "div"
    );

  Object.assign(
    panel.style,
    {
      width:
        "100%",

      maxWidth:
        "360px",

      padding:
        "26px 20px 20px",

      border:
        "1px solid #343a44",

      borderRadius:
        "18px",

      background:
        "linear-gradient(145deg,#15191f,#090b0f)",

      color:
        "#fff",

      textAlign:
        "center",

      boxShadow:
        "0 24px 70px rgba(0,0,0,.55)",
    }
  );

  const icon =
    document.createElement(
      "div"
    );

  icon.textContent =
    "⚠️";

  icon.style.fontSize =
    "36px";

  const title =
    document.createElement(
      "div"
    );

  title.textContent =
    "OYUNDAN ÇIK";

  Object.assign(
    title.style,
    {
      marginTop:
        "8px",

      fontSize:
        "22px",

      fontWeight:
        "900",
    }
  );

  const message =
    document.createElement(
      "div"
    );

  message.textContent =
    "Çıkmak istediğinize emin misiniz?";

  Object.assign(
    message.style,
    {
      marginTop:
        "9px",

      color:
        "#8c949f",

      fontSize:
        "14px",
    }
  );

  const buttons =
    document.createElement(
      "div"
    );

  Object.assign(
    buttons.style,
    {
      display:
        "grid",

      gridTemplateColumns:
        "1fr 1fr",

      gap:
        "10px",

      marginTop:
        "24px",
    }
  );

  const exitButton =
    document.createElement(
      "button"
    );

  exitButton.type =
    "button";

  exitButton.textContent =
    "ÇIK";

  Object.assign(
    exitButton.style,
    {
      minHeight:
        "50px",

      border:
        "1px solid #9e3e39",

      borderRadius:
        "11px",

      background:
        "linear-gradient(135deg,#d4544b,#872d28)",

      color:
        "#fff",

      fontWeight:
        "900",

      cursor:
        "pointer",
    }
  );

  const stayButton =
    document.createElement(
      "button"
    );

  stayButton.type =
    "button";

  stayButton.textContent =
    "KAL";

  Object.assign(
    stayButton.style,
    {
      minHeight:
        "50px",

      border:
        "1px solid #3467a8",

      borderRadius:
        "11px",

      background:
        "linear-gradient(135deg,#4385d6,#235393)",

      color:
        "#fff",

      fontWeight:
        "900",

      cursor:
        "pointer",
    }
  );

  stayButton.addEventListener(
    "click",

    removeExitDialog
  );

  exitButton.addEventListener(
    "click",

    () => {
      removeExitDialog();

      allowExit =
        true;

      window.history.back();
    }
  );

  buttons.append(
    exitButton,
    stayButton
  );

  panel.append(
    icon,
    title,
    message,
    buttons
  );

  overlay.appendChild(
    panel
  );

  document.body.appendChild(
    overlay
  );

  stayButton.focus();
}

prepareExitGuard();

window.addEventListener(
  "popstate",

  (event) => {
    const state =
      event.state;

    if (
      document.getElementById(
        "scw-achievement-overlay"
      ) &&
      state?.view !==
        "achievements"
    ) {
      closeAchievements(
        false
      );
    }

    if (
      state?.scw &&
      state.view ===
        "exit-base"
    ) {
      if (allowExit) {
        allowExit =
          false;

        setTimeout(
          () =>
            window.history.back(),

          0
        );

        return;
      }

      window.history.pushState(
        HOME_GUARD_STATE,

        "",

        window.location.href
      );

      showExitDialog();
    }
  }
);

createRoot(
  document.getElementById(
    "root"
  )
).render(
  createElement(
    StrictMode,

    null,

    createElement(
      App
    )
  )
);

if (
  import.meta.env.PROD &&
  "serviceWorker" in
    navigator
) {
  window.addEventListener(
    "load",

    () => {
      navigator.serviceWorker
        .register(
          `${
            import.meta.env
              .BASE_URL
          }sw.js`
        )
        .catch(
          (error) =>
            console.error(
              "Service worker registration failed:",
              error
            )
        );
    }
  );
}