import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

const SAVE_KEY =
  "soccer-cards-war-save-v4";

const ACHIEVEMENT_STATS_KEY =
  "scw-achievement-stats-v1";

/* =========================
   EVENT BİLGİLERİ
   ========================= */

const EVENT_META = [
  {
    id: "street",
    name: "Sokak Futbolu",
    matches: 25,
  },
  {
    id: "turf",
    name: "Halı Saha",
    matches: 25,
  },
  {
    id: "city",
    name: "Şehir Kupası",
    matches: 30,
  },
  {
    id: "stadium",
    name: "Amatör Stadyum",
    matches: 30,
  },
  {
    id: "pro",
    name: "Profesyonel Arena",
    matches: 35,
  },
  {
    id: "national",
    name: "Ulusal Kupa",
    matches: 35,
  },
  {
    id: "europe",
    name: "Avrupa Arenası",
    matches: 40,
  },
  {
    id: "champions",
    name: "Şampiyonlar Ligi",
    matches: 40,
  },
  {
    id: "world",
    name: "Dünya Şampiyonası",
    matches: 45,
  },
  {
    id: "legends",
    name: "Efsaneler Arenası",
    matches: 50,
  },
];

/* =========================
   BAŞARIM İSTATİSTİKLERİ
   ========================= */

function emptyAchievementStats() {
  return {
    trainingsCompleted: 0,
    marketPurchases: 0,
    customPlayersCreated: 0,
  };
}

function readAchievementStats() {
  try {
    const saved =
      localStorage.getItem(
        ACHIEVEMENT_STATS_KEY
      );

    if (!saved) {
      return emptyAchievementStats();
    }

    return {
      ...emptyAchievementStats(),
      ...JSON.parse(saved),
    };
  } catch {
    return emptyAchievementStats();
  }
}

function saveAchievementStats(
  stats
) {
  originalSetItem(
    ACHIEVEMENT_STATS_KEY,
    JSON.stringify(stats)
  );
}

function readGame() {
  try {
    const saved =
      localStorage.getItem(
        SAVE_KEY
      );

    return saved
      ? JSON.parse(saved)
      : null;
  } catch {
    return null;
  }
}

/* =========================
   LOCALSTORAGE TAKİBİ
   ========================= */

const originalSetItem =
  localStorage.setItem.bind(
    localStorage
  );

const originalRemoveItem =
  localStorage.removeItem.bind(
    localStorage
  );

localStorage.setItem =
  function (
    key,
    value
  ) {
    let oldGame = null;

    if (key === SAVE_KEY) {
      try {
        const oldValue =
          localStorage.getItem(
            SAVE_KEY
          );

        oldGame = oldValue
          ? JSON.parse(
              oldValue
            )
          : null;
      } catch {
        oldGame = null;
      }
    }

    originalSetItem(
      key,
      value
    );

    if (
      key !== SAVE_KEY
    ) {
      return;
    }

    let newGame = null;

    try {
      newGame =
        JSON.parse(value);
    } catch {
      return;
    }

    if (
      !oldGame ||
      !newGame
    ) {
      return;
    }

    const stats =
      readAchievementStats();

    /* ANTRENMAN TAMAMLANDI MI */

    if (
      oldGame.training &&
      !newGame.training
    ) {
      const oldPlayer =
        oldGame.collection?.find(
          (player) =>
            player.id ===
            oldGame.training
              .playerId
        );

      const newPlayer =
        newGame.collection?.find(
          (player) =>
            player.id ===
            oldGame.training
              .playerId
        );

      if (
        oldPlayer &&
        newPlayer &&
        newPlayer.overall >
          oldPlayer.overall
      ) {
        stats.trainingsCompleted +=
          1;
      }
    }

    /* TRANSFERDEN OYUNCU ALINDI MI */

    const oldMarket =
      oldGame.market || [];

    const newMarket =
      newGame.market || [];

    const oldCollection =
      oldGame.collection || [];

    const newCollection =
      newGame.collection || [];

    const newCollectionIds =
      new Set(
        newCollection.map(
          (player) =>
            player.id
        )
      );

    const newMarketIds =
      new Set(
        newMarket.map(
          (player) =>
            player.id
        )
      );

    const purchasedPlayers =
      oldMarket.filter(
        (player) =>
          !newMarketIds.has(
            player.id
          ) &&
          newCollectionIds.has(
            player.id
          )
      );

    if (
      purchasedPlayers.length >
      0
    ) {
      stats.marketPurchases +=
        purchasedPlayers.length;
    }

    /* ÖZEL OYUNCU OLUŞTURULDU MU */

    const oldCustomCount =
      oldCollection.filter(
        (player) =>
          player.custom
      ).length;

    const newCustomCount =
      newCollection.filter(
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

    saveAchievementStats(
      stats
    );

    refreshAchievementButton();
  };

localStorage.removeItem =
  function (key) {
    originalRemoveItem(key);

    if (
      key === SAVE_KEY
    ) {
      originalRemoveItem(
        ACHIEVEMENT_STATS_KEY
      );
    }
  };

/* =========================
   BAŞARIM HESAPLARI
   ========================= */

function getHighestOverall(
  game
) {
  if (
    !game?.collection
      ?.length
  ) {
    return 0;
  }

  return Math.max(
    ...game.collection.map(
      (player) =>
        Number(
          player.overall
        ) || 0
    )
  );
}

function getEventWins(
  game
) {
  if (!game?.events) {
    return 0;
  }

  return EVENT_META.reduce(
    (
      total,
      event
    ) => {
      const state =
        game.events[
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
          Number(
            state.match
          ) - 1
        )
      );
    },
    0
  );
}

function getCompletedEvents(
  game
) {
  return EVENT_META.filter(
    (event) =>
      game?.events?.[
        event.id
      ]?.completed
  ).length;
}

function eventCompleted(
  game,
  eventId
) {
  return game?.events?.[
    eventId
  ]?.completed
    ? 1
    : 0;
}

function getCareerWins(
  game
) {
  return Number(
    game?.career?.wins ||
      game?.trophies ||
      0
  );
}

function getCustomCreated(
  game,
  stats
) {
  const currentlyOwned =
    game?.collection?.filter(
      (player) =>
        player.custom
    ).length || 0;

  return Math.max(
    currentlyOwned,
    stats.customPlayersCreated
  );
}

/* =========================
   BAŞARIM LİSTESİ
   ========================= */

const ACHIEVEMENTS = [
  {
    category: "Antrenman",
    icon: "🏋️",
    title: "İlk Antrenman",
    description:
      "1 antrenmanı tamamla.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    category: "Antrenman",
    icon: "🏋️",
    title: "Isınmaya Başladık",
    description:
      "5 antrenman tamamla.",
    target: 5,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    category: "Antrenman",
    icon: "💪",
    title: "Çalışkan Takım",
    description:
      "25 antrenman tamamla.",
    target: 25,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    category: "Antrenman",
    icon: "🔥",
    title: "Antrenman Canavarı",
    description:
      "100 antrenman tamamla.",
    target: 100,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },

  {
    category: "Transfer",
    icon: "🤝",
    title: "İlk İmza",
    description:
      "Transfer pazarından 1 oyuncu al.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    category: "Transfer",
    icon: "🤝",
    title: "Menajer",
    description:
      "10 oyuncu satın al.",
    target: 10,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    category: "Transfer",
    icon: "💼",
    title: "Transfer Patronu",
    description:
      "25 oyuncu satın al.",
    target: 25,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    category: "Transfer",
    icon: "👑",
    title: "Pazarın Kralı",
    description:
      "100 oyuncu satın al.",
    target: 100,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },

  {
    category: "Koleksiyon",
    icon: "🎴",
    title: "Kart Avcısı",
    description:
      "15 karta sahip ol.",
    target: 15,
    value: (game) =>
      game?.collection
        ?.length || 0,
  },
  {
    category: "Koleksiyon",
    icon: "🎴",
    title: "Dolu Soyunma Odası",
    description:
      "25 karta sahip ol.",
    target: 25,
    value: (game) =>
      game?.collection
        ?.length || 0,
  },
  {
    category: "Koleksiyon",
    icon: "📚",
    title: "Kart Arşivi",
    description:
      "50 karta sahip ol.",
    target: 50,
    value: (game) =>
      game?.collection
        ?.length || 0,
  },
  {
    category: "Koleksiyon",
    icon: "🏛️",
    title: "Futbol Müzesi",
    description:
      "100 karta sahip ol.",
    target: 100,
    value: (game) =>
      game?.collection
        ?.length || 0,
  },

  {
    category: "Oyuncu Gelişimi",
    icon: "⭐",
    title: "30 Kulübü",
    description:
      "30 GEN bir oyuncuya sahip ol.",
    target: 30,
    value: (game) =>
      getHighestOverall(
        game
      ),
  },
  {
    category: "Oyuncu Gelişimi",
    icon: "🌟",
    title: "Yükselen Yıldız",
    description:
      "50 GEN bir oyuncuya sahip ol.",
    target: 50,
    value: (game) =>
      getHighestOverall(
        game
      ),
  },
  {
    category: "Oyuncu Gelişimi",
    icon: "💫",
    title: "Süperstar",
    description:
      "75 GEN bir oyuncuya sahip ol.",
    target: 75,
    value: (game) =>
      getHighestOverall(
        game
      ),
  },
  {
    category: "Oyuncu Gelişimi",
    icon: "👑",
    title: "Dünya Yıldızı",
    description:
      "90 GEN bir oyuncuya sahip ol.",
    target: 90,
    value: (game) =>
      getHighestOverall(
        game
      ),
  },
  {
    category: "Oyuncu Gelişimi",
    icon: "🐐",
    title: "GOAT",
    description:
      "99 GEN bir oyuncuya sahip ol.",
    target: 99,
    value: (game) =>
      getHighestOverall(
        game
      ),
  },

  {
    category: "Kendi Oyuncun",
    icon: "👤",
    title: "Ben Geldim",
    description:
      "Kendi futbolcunu oluştur.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      getCustomCreated(
        game,
        stats
      ),
  },

  {
    category: "Kariyer",
    icon: "⚔️",
    title: "İlk Zafer",
    description:
      "1 kariyer maçı kazan.",
    target: 1,
    value: (game) =>
      getCareerWins(
        game
      ),
  },
  {
    category: "Kariyer",
    icon: "⚔️",
    title: "Galibiyet Serisi",
    description:
      "10 kariyer maçı kazan.",
    target: 10,
    value: (game) =>
      getCareerWins(
        game
      ),
  },
  {
    category: "Kariyer",
    icon: "🗡️",
    title: "Savaşçı",
    description:
      "25 kariyer maçı kazan.",
    target: 25,
    value: (game) =>
      getCareerWins(
        game
      ),
  },
  {
    category: "Kariyer",
    icon: "🏆",
    title: "Kariyer Ustası",
    description:
      "50 kariyer maçı kazan.",
    target: 50,
    value: (game) =>
      getCareerWins(
        game
      ),
  },

  {
    category: "Etkinlik",
    icon: "🏚️",
    title: "Sokaktan Başladık",
    description:
      "1 etkinlik maçı kazan.",
    target: 1,
    value: (game) =>
      getEventWins(game),
  },
  {
    category: "Etkinlik",
    icon: "⚽",
    title: "Etkinlik Müdavimi",
    description:
      "25 etkinlik maçı kazan.",
    target: 25,
    value: (game) =>
      getEventWins(game),
  },
  {
    category: "Etkinlik",
    icon: "🔥",
    title: "Etkinlik Canavarı",
    description:
      "100 etkinlik maçı kazan.",
    target: 100,
    value: (game) =>
      getEventWins(game),
  },

  {
    category: "Etkinlik",
    icon: "🏚️",
    title: "Sokakların Kralı",
    description:
      "Sokak Futbolu etkinliğini bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "street"
      ),
  },
  {
    category: "Etkinlik",
    icon: "⚽",
    title: "Halı Saha Patronu",
    description:
      "Halı Saha etkinliğini bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "turf"
      ),
  },
  {
    category: "Etkinlik",
    icon: "🏆",
    title: "Ulusal Şampiyon",
    description:
      "Ulusal Kupa etkinliğini bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "national"
      ),
  },
  {
    category: "Etkinlik",
    icon: "⭐",
    title: "Avrupa Fatihi",
    description:
      "Şampiyonlar Ligi etkinliğini bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "champions"
      ),
  },
  {
    category: "Etkinlik",
    icon: "👑",
    title: "Efsanelerin Efendisi",
    description:
      "Efsaneler Arenası'nı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "legends"
      ),
  },
  {
    category: "Etkinlik",
    icon: "🌍",
    title: "Her Yerin Şampiyonu",
    description:
      "10 etkinliğin tamamını bitir.",
    target: 10,
    value: (game) =>
      getCompletedEvents(
        game
      ),
  },
];

/* =========================
   BAŞARIM UI
   ========================= */

function percentage(
  value,
  target
) {
  if (target <= 0) {
    return 100;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (value / target) *
          100
      )
    )
  );
}

function calculateAchievements() {
  const game =
    readGame();

  const stats =
    readAchievementStats();

  return ACHIEVEMENTS.map(
    (achievement) => {
      const rawValue =
        Number(
          achievement.value(
            game,
            stats
          )
        ) || 0;

      const progress =
        percentage(
          rawValue,
          achievement.target
        );

      return {
        ...achievement,
        current:
          rawValue,
        progress,
        complete:
          rawValue >=
          achievement.target,
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
      padding: 24px 0 60px;
    }

    .scw-achievement-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 20px;
    }

    .scw-achievement-back {
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid #343a44;
      border-radius: 9px;
      background: #11151b;
      color: #d7dce2;
      font-weight: 900;
      cursor: pointer;
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
      line-height: 1;
    }

    .scw-achievement-summary {
      padding: 18px;
      margin-bottom: 18px;
      border: 1px solid #5b4826;
      border-radius: 15px;
      background:
        linear-gradient(
          135deg,
          #17140d,
          #0d1014
        );
    }

    .scw-achievement-summary-row {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
    }

    .scw-achievement-summary strong {
      color: #e0b45a;
      font-size: 36px;
    }

    .scw-achievement-summary small {
      color: #737c88;
      font-size: 10px;
      font-weight: 800;
    }

    .scw-achievement-big-bar,
    .scw-achievement-bar {
      overflow: hidden;
      background: #22272f;
      border-radius: 999px;
    }

    .scw-achievement-big-bar {
      height: 9px;
      margin-top: 13px;
    }

    .scw-achievement-bar {
      height: 6px;
      margin-top: 10px;
    }

    .scw-achievement-big-bar > div,
    .scw-achievement-bar > div {
      height: 100%;
      border-radius: inherit;
      background:
        linear-gradient(
          90deg,
          #9d6a22,
          #e4b85a
        );
    }

    .scw-achievement-category {
      margin: 24px 0 9px;
      color: #888f99;
      font-size: 9px;
      font-weight: 950;
      letter-spacing: 1.8px;
    }

    .scw-achievement-list {
      display: grid;
      gap: 7px;
    }

    .scw-achievement-card {
      display: grid;
      grid-template-columns: 46px 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 13px;
      border: 1px solid #2b3139;
      border-radius: 12px;
      background:
        linear-gradient(
          145deg,
          #11151b,
          #0b0e12
        );
    }

    .scw-achievement-card.complete {
      border-color: #52612e;
      background:
        linear-gradient(
          145deg,
          #15180f,
          #0b0e0c
        );
    }

    .scw-achievement-icon {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      border-radius: 11px;
      background: #191e25;
      font-size: 23px;
    }

    .scw-achievement-card.complete
    .scw-achievement-icon {
      background: #202514;
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
    }

    .scw-achievement-progress-text {
      min-width: 54px;
      text-align: right;
    }

    .scw-achievement-progress-text strong {
      display: block;
      color: #dfb258;
      font-size: 13px;
    }

    .scw-achievement-progress-text small {
      display: block;
      margin-top: 2px;
      color: #6e7782;
      font-size: 7px;
      font-weight: 900;
    }

    .scw-achievement-complete-label {
      color: #a9c963 !important;
    }

    @media (max-width: 650px) {
      .scw-achievement-shell {
        width: 100%;
        padding:
          14px 10px
          calc(
            26px +
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
          38px 1fr 50px;
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
    }
  `;

  document.head.append(
    style
  );
}

function closeAchievements(
  useHistory = true
) {
  const overlay =
    document.getElementById(
      "scw-achievement-overlay"
    );

  if (overlay) {
    overlay.remove();
  }

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

  const achievements =
    calculateAchievements();

  const completed =
    achievements.filter(
      (item) =>
        item.complete
    ).length;

  const total =
    achievements.length;

  const totalPercent =
    percentage(
      completed,
      total
    );

  window.history.pushState(
    {
      scw: true,
      view: "achievements",
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
    <span>SOCCER CARDS WAR</span>
    <h1>🏅 BAŞARIMLAR</h1>
  `;

  const backButton =
    document.createElement(
      "button"
    );

  backButton.type =
    "button";

  backButton.className =
    "scw-achievement-back";

  backButton.textContent =
    "← ANA MENÜ";

  backButton.addEventListener(
    "click",
    () =>
      closeAchievements(
        true
      )
  );

  top.append(
    heading,
    backButton
  );

  const summary =
    document.createElement(
      "section"
    );

  summary.className =
    "scw-achievement-summary";

  summary.innerHTML = `
    <div class="scw-achievement-summary-row">
      <div>
        <small>TOPLAM TAMAMLAMA</small>
        <strong>${totalPercent}%</strong>
      </div>

      <small>
        ${completed} / ${total}
        BAŞARIM
      </small>
    </div>

    <div class="scw-achievement-big-bar">
      <div style="width:${totalPercent}%"></div>
    </div>
  `;

  shell.append(
    top,
    summary
  );

  const categories = [
    ...new Set(
      achievements.map(
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

      shell.append(
        categoryTitle
      );

      const list =
        document.createElement(
          "div"
        );

      list.className =
        "scw-achievement-list";

      achievements
        .filter(
          (item) =>
            item.category ===
            category
        )
        .forEach(
          (achievement) => {
            const card =
              document.createElement(
                "div"
              );

            card.className =
              `scw-achievement-card ${
                achievement.complete
                  ? "complete"
                  : ""
              }`;

            const shownCurrent =
              Math.min(
                achievement.current,
                achievement.target
              );

            card.innerHTML = `
              <div class="scw-achievement-icon">
                ${achievement.complete
                  ? "✅"
                  : achievement.icon}
              </div>

              <div class="scw-achievement-main">
                <h3>
                  ${achievement.title}
                </h3>

                <p>
                  ${achievement.description}
                </p>

                <div class="scw-achievement-bar">
                  <div style="width:${achievement.progress}%"></div>
                </div>
              </div>

              <div class="scw-achievement-progress-text">
                <strong class="${
                  achievement.complete
                    ? "scw-achievement-complete-label"
                    : ""
                }">
                  ${achievement.progress}%
                </strong>

                <small>
                  ${
                    achievement.complete
                      ? "TAMAM"
                      : `${shownCurrent}/${achievement.target}`
                  }
                </small>
              </div>
            `;

            list.append(
              card
            );
          }
        );

      shell.append(list);
    }
  );

  overlay.append(shell);

  document.body.append(
    overlay
  );
}

/* =========================
   ANA MENÜYE BUTON EKLE
   ========================= */

function refreshAchievementButton() {
  const menu =
    document.querySelector(
      ".menu-grid"
    );

  if (!menu) {
    return;
  }

  if (
    menu.querySelector(
      "[data-scw-achievements-button]"
    )
  ) {
    return;
  }

  const achievements =
    calculateAchievements();

  const completed =
    achievements.filter(
      (item) =>
        item.complete
    ).length;

  const total =
    achievements.length;

  const totalPercent =
    percentage(
      completed,
      total
    );

  const button =
    document.createElement(
      "button"
    );

  button.type =
    "button";

  button.className =
    "menu-card";

  button.dataset.scwAchievementsButton =
    "true";

  button.innerHTML = `
    <div class="menu-icon">
      🏅
    </div>

    <div>
      <span>
        ${totalPercent}% •
        ${completed}/${total}
      </span>

      <h2>
        BAŞARIMLAR
      </h2>
    </div>
  `;

  button.addEventListener(
    "click",
    showAchievements
  );

  menu.append(button);
}

const menuObserver =
  new MutationObserver(
    () => {
      refreshAchievementButton();
    }
  );

menuObserver.observe(
  document.documentElement,
  {
    childList: true,
    subtree: true,
  }
);

/* =========================
   ANDROID ÇIKIŞ KORUMASI
   ========================= */

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
  const currentState =
    window.history.state;

  if (
    !currentState
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
  const oldDialog =
    document.getElementById(
      "scw-exit-dialog"
    );

  if (oldDialog) {
    oldDialog.remove();
  }
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
      position: "fixed",
      inset: "0",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent:
        "center",
      padding: "24px",
      background:
        "rgba(0, 0, 0, 0.78)",
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
      width: "100%",
      maxWidth: "360px",
      padding:
        "26px 20px 20px",
      border:
        "1px solid #343a44",
      borderRadius:
        "18px",
      background:
        "linear-gradient(145deg, #15191f, #090b0f)",
      color: "#ffffff",
      textAlign: "center",
      boxShadow:
        "0 24px 70px rgba(0,0,0,0.55)",
    }
  );

  const icon =
    document.createElement(
      "div"
    );

  icon.textContent = "⚠️";

  Object.assign(
    icon.style,
    {
      fontSize: "36px",
      marginBottom:
        "10px",
    }
  );

  const title =
    document.createElement(
      "div"
    );

  title.textContent =
    "OYUNDAN ÇIK";

  Object.assign(
    title.style,
    {
      fontSize: "22px",
      fontWeight: "900",
      letterSpacing:
        "1px",
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
      marginTop: "9px",
      color: "#8c949f",
      fontSize: "14px",
      lineHeight: "1.5",
    }
  );

  const buttons =
    document.createElement(
      "div"
    );

  Object.assign(
    buttons.style,
    {
      display: "grid",
      gridTemplateColumns:
        "1fr 1fr",
      gap: "10px",
      marginTop: "24px",
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
      minHeight: "50px",
      border:
        "1px solid #9e3e39",
      borderRadius:
        "11px",
      background:
        "linear-gradient(135deg, #d4544b, #872d28)",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "900",
      cursor: "pointer",
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
      minHeight: "50px",
      border:
        "1px solid #3467a8",
      borderRadius:
        "11px",
      background:
        "linear-gradient(135deg, #4385d6, #235393)",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "900",
      cursor: "pointer",
    }
  );

  stayButton.addEventListener(
    "click",
    () => {
      removeExitDialog();
    }
  );

  exitButton.addEventListener(
    "click",
    () => {
      removeExitDialog();

      allowExit = true;

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

  overlay.append(panel);

  document.body.append(
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

    const achievementsOpen =
      document.getElementById(
        "scw-achievement-overlay"
      );

    if (
      achievementsOpen &&
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
        allowExit = false;

        setTimeout(() => {
          window.history.back();
        }, 0);

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

/* =========================
   REACT
   ========================= */

createRoot(
  document.getElementById(
    "root"
  )
).render(
  <StrictMode>
    <App />
  </StrictMode>
);

setTimeout(() => {
  refreshAchievementButton();
}, 100);

/* =========================
   SERVICE WORKER
   ========================= */

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
        .catch((error) => {
          console.error(
            "Service worker registration failed:",
            error
          );
        });
    }
  );
}