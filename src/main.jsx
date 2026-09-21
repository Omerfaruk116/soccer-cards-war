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
  "soccer-cards-war-save-v5";

const STATS_KEY =
  "scw-achievement-stats-v4";

const EXIT_HOME_STATE = {
  scw: true,
  view: "home",
};

const EXIT_GUARD_STATE = {
  scw: true,
  view: "home-guard",
};

const TRAINING_TARGETS = [
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
];

const TRANSFER_TARGETS = [
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
];

const COLLECTION_TARGETS = [
  10,
  12,
  15,
  20,
  30,
  40,
  50,
  75,
  100,
  150,
];

const OVERALL_TARGETS = [
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
];

const CUSTOM_TARGETS = [
  1,
  20,
  30,
  50,
  70,
  99,
];

const CAREER_TARGETS = [
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
  75,
  100,
];

const EVENT_TARGETS = [
  1,
  5,
  10,
  25,
  50,
  75,
  100,
  150,
  200,
  250,
  300,
  355,
  5,
  10,
];

const COIN_TARGETS = [
  5000,
  10000,
  25000,
  50000,
  100000,
  250000,
];

const DAILY_TARGETS = [
  3,
  5,
  7,
];

const RENTAL_ACHIEVEMENTS = [
  {
    id: "rental-center",
    title: "Kiralık Merkezi",
    text:
      "Kiralık Oyuncu Merkezi'ni aç.",
  },

  {
    id: "rental-slot-1",
    title: "İlk Slot",
    text:
      "1 kiralama slotu aç.",
  },

  {
    id: "rental-slot-2",
    title: "İkinci Slot",
    text:
      "2 kiralama slotu aç.",
  },

  {
    id: "rental-slot-3",
    title: "Üçlü Sistem",
    text:
      "3 kiralama slotu aç.",
  },

  {
    id: "rental-slot-5",
    title: "Kiralama Patronu",
    text:
      "Tüm kiralama slotlarını aç.",
  },

  {
    id: "rental-income-1000",
    title: "İlk Pasif Gelir",
    text:
      "Kiralamadan toplam 1.000 Coin kazan.",
  },

  {
    id: "rental-income-5000",
    title: "Yan Gelir",
    text:
      "Kiralamadan toplam 5.000 Coin kazan.",
  },

  {
    id: "rental-income-25000",
    title: "Kiralama İmparatorluğu",
    text:
      "Kiralamadan toplam 25.000 Coin kazan.",
  },
];

const COACH_ACHIEVEMENTS = [
  {
    id: "coach-first",
    title: "İlk Antrenör",
    text:
      "İlk antrenörünü satın al.",
  },

  {
    id: "coach-2-star",
    title: "İki Yıldız",
    text:
      "2 yıldızlı antrenörü satın al.",
  },

  {
    id: "coach-3-star",
    title: "Profesyonel Ekip",
    text:
      "3 yıldızlı antrenörü satın al.",
  },

  {
    id: "coach-5-star",
    title: "Dünya Klası",
    text:
      "5 yıldızlı antrenörü satın al.",
  },

  {
    id: "coach-gain-25",
    title: "Gelişim Ustası",
    text:
      "Antrenörlerle toplam 25 GEN kazandır.",
  },

  {
    id: "coach-gain-100",
    title: "Futbol Fabrikası",
    text:
      "Antrenörlerle toplam 100 GEN kazandır.",
  },
];

const STAGE_ACHIEVEMENTS = [
  {
    id: "stage-2",
    title: "İkinci Aşama",
    text:
      "Aşama 2'yi aç.",
  },

  {
    id: "stage-5",
    title: "Yolun Yarısı",
    text:
      "Aşama 5'i aç.",
  },

  {
    id: "stage-8",
    title: "Elit Seviye",
    text:
      "Aşama 8'i aç.",
  },

  {
    id: "stage-10",
    title: "Son Aşama",
    text:
      "Aşama 10'u aç.",
  },
];

function makeAchievement(
  id,
  title,
  text,
  category,
  check
) {
  return {
    id,
    title,
    text,
    category,
    check,
  };
}

const ACHIEVEMENTS = [
  ...TRAINING_TARGETS.map(
    (target, index) =>
      makeAchievement(
        `training-${target}`,
        `Antrenman ${target}`,
        `${target} antrenman tamamla.`,
        "ANTRENMAN",
        (stats) =>
          stats.trainingsCompleted >=
          target
      )
  ),

  ...TRANSFER_TARGETS.map(
    (target) =>
      makeAchievement(
        `transfer-${target}`,
        `Transfer ${target}`,
        `${target} oyuncu satın al.`,
        "TRANSFER",
        (stats) =>
          stats.transfersBought >=
          target
      )
  ),

  ...COLLECTION_TARGETS.map(
    (target) =>
      makeAchievement(
        `collection-${target}`,
        `Koleksiyon ${target}`,
        `Koleksiyonunda ${target} farklı kart gör.`,
        "KOLEKSİYON",
        (stats) =>
          stats.collectionMax >=
          target
      )
  ),

  ...OVERALL_TARGETS.map(
    (target) =>
      makeAchievement(
        `overall-${target}`,
        `${target} GEN`,
        `${target} GEN seviyesinde bir oyuncuya ulaş.`,
        "OYUNCU GELİŞİMİ",
        (stats) =>
          stats.maxOverall >=
          target
      )
  ),

  makeAchievement(
    "custom-create",
    "Kendi Oyuncun",
    "Kendi oyuncunu oluştur.",
    "ÖZEL OYUNCU",
    (stats) =>
      stats.customPlayers >= 1
  ),

  ...CUSTOM_TARGETS.slice(
    1
  ).map(
    (target) =>
      makeAchievement(
        `custom-${target}`,
        `Benim Oyuncum ${target}`,
        `Kendi oyuncunu ${target} GEN seviyesine çıkar.`,
        "ÖZEL OYUNCU",
        (stats) =>
          stats.maxCustomOverall >=
          target
      )
  ),

  ...CAREER_TARGETS.map(
    (target) =>
      makeAchievement(
        `career-${target}`,
        `Kariyer ${target}`,
        `${target} kariyer galibiyeti kazan.`,
        "KARİYER",
        (stats) =>
          stats.careerWins >=
          target
      )
  ),

  ...EVENT_TARGETS.slice(
    0,
    12
  ).map(
    (target) =>
      makeAchievement(
        `events-win-${target}`,
        `Etkinlik ${target}`,
        `Etkinliklerde toplam ${target} maç kazan.`,
        "ETKİNLİK",
        (stats) =>
          stats.eventWins >=
          target
      )
  ),

  makeAchievement(
    "events-five-complete",
    "5 Etkinlik",
    "5 etkinliği tamamen bitir.",
    "ETKİNLİK",
    (stats) =>
      stats.completedEvents >= 5
  ),

  makeAchievement(
    "events-all-complete",
    "Tüm Etkinlikler",
    "10 etkinliğin tamamını bitir.",
    "ETKİNLİK",
    (stats) =>
      stats.completedEvents >= 10
  ),

  ...COIN_TARGETS.map(
    (target) =>
      makeAchievement(
        `coins-${target}`,
        `${target.toLocaleString()} Coin`,
        `Bir noktada ${target.toLocaleString()} Coin'e sahip ol.`,
        "EKONOMİ",
        (stats) =>
          stats.maxCoins >=
          target
      )
  ),

  ...DAILY_TARGETS.map(
    (target) =>
      makeAchievement(
        `daily-${target}`,
        `${target} Günlük Seri`,
        `${target} günlük ödül serisine ulaş.`,
        "GÜNLÜK",
        (stats) =>
          stats.maxDailyStreak >=
          target
      )
  ),

  ...RENTAL_ACHIEVEMENTS.map(
    (item) =>
      makeAchievement(
        item.id,
        item.title,
        item.text,
        "KİRALAMA",
        (stats) => {
          if (
            item.id ===
            "rental-center"
          ) {
            return (
              stats.rentalUnlocked
            );
          }

          if (
            item.id ===
            "rental-slot-1"
          ) {
            return (
              stats.rentalSlots >=
              1
            );
          }

          if (
            item.id ===
            "rental-slot-2"
          ) {
            return (
              stats.rentalSlots >=
              2
            );
          }

          if (
            item.id ===
            "rental-slot-3"
          ) {
            return (
              stats.rentalSlots >=
              3
            );
          }

          if (
            item.id ===
            "rental-slot-5"
          ) {
            return (
              stats.rentalSlots >=
              5
            );
          }

          if (
            item.id ===
            "rental-income-1000"
          ) {
            return (
              stats.rentalCoins >=
              1000
            );
          }

          if (
            item.id ===
            "rental-income-5000"
          ) {
            return (
              stats.rentalCoins >=
              5000
            );
          }

          return (
            stats.rentalCoins >=
            25000
          );
        }
      )
  ),

  ...COACH_ACHIEVEMENTS.map(
    (item) =>
      makeAchievement(
        item.id,
        item.title,
        item.text,
        "ANTRENÖR",
        (stats) => {
          if (
            item.id ===
            "coach-first"
          ) {
            return (
              stats.coachCount >=
              1
            );
          }

          if (
            item.id ===
            "coach-2-star"
          ) {
            return stats.coachStars.includes(
              2
            );
          }

          if (
            item.id ===
            "coach-3-star"
          ) {
            return stats.coachStars.includes(
              3
            );
          }

          if (
            item.id ===
            "coach-5-star"
          ) {
            return stats.coachStars.includes(
              5
            );
          }

          if (
            item.id ===
            "coach-gain-25"
          ) {
            return (
              stats.coachGains >=
              25
            );
          }

          return (
            stats.coachGains >=
            100
          );
        }
      )
  ),

  ...STAGE_ACHIEVEMENTS.map(
    (item) =>
      makeAchievement(
        item.id,
        item.title,
        item.text,
        "AŞAMA",
        (stats) => {
          const target =
            Number(
              item.id.split(
                "-"
              )[1]
            );

          return (
            stats.maxStage >=
            target
          );
        }
      )
  ),

  makeAchievement(
    "el-turco-legend",
    "EL TURCO EFSANESİ",
    "Son aşamaya ulaş, tüm etkinlikleri bitir ve EL TURCO kartını kazan.",
    "EFSANE",
    (stats) =>
      stats.maxStage >= 10 &&
      stats.completedEvents >=
        10 &&
      stats.hasElTurco
  ),
];

if (
  ACHIEVEMENTS.length !==
  100
) {
  console.warn(
    "SCW achievement count:",
    ACHIEVEMENTS.length
  );
}

function defaultStats() {
  return {
    trainingsCompleted: 0,
    transfersBought: 0,

    collectionMax: 0,

    maxOverall: 0,

    customPlayers: 0,

    maxCustomOverall: 0,

    careerWins: 0,

    eventWins: 0,

    completedEvents: 0,

    maxCoins: 0,

    maxDailyStreak: 0,

    maxStage: 1,

    rentalUnlocked: false,

    rentalSlots: 0,

    rentalCoins: 0,

    rentalCompleted: 0,

    coachCount: 0,

    coachStars: [],

    coachGains: 0,

    hasElTurco: false,

    unlocked: [],
  };
}

function readGame() {
  try {
    const raw =
      localStorage.getItem(
        SAVE_KEY
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readStats() {
  try {
    const raw =
      localStorage.getItem(
        STATS_KEY
      );

    if (!raw) {
      return defaultStats();
    }

    return {
      ...defaultStats(),
      ...JSON.parse(raw),
    };
  } catch {
    return defaultStats();
  }
}

function saveStats(stats) {
  localStorage.setItem(
    STATS_KEY,
    JSON.stringify(stats)
  );
}

function getCurrentMetrics(
  game
) {
  if (!game) {
    return null;
  }

  const collection =
    Array.isArray(
      game.collection
    )
      ? game.collection
      : [];

  const activeCollection =
    collection.filter(
      (player) =>
        !player.sold
    );

  const maxOverall =
    collection.reduce(
      (max, player) =>
        Math.max(
          max,
          Number(
            player.overall
          ) || 0
        ),
      0
    );

  const customPlayers =
    collection.filter(
      (player) =>
        player.custom
    );

  const maxCustomOverall =
    customPlayers.reduce(
      (max, player) =>
        Math.max(
          max,
          Number(
            player.overall
          ) || 0
        ),
      0
    );

  const events =
    Object.values(
      game.events || {}
    );

  const eventWins =
    events.reduce(
      (sum, event) =>
        sum +
        (Number(
          event?.wins
        ) || 0),
      0
    );

  const completedEvents =
    events.filter(
      (event) =>
        Boolean(
          event?.completed
        )
    ).length;

  const coachStars =
    Array.isArray(
      game.coaches
        ?.ownedStars
    )
      ? game.coaches
          .ownedStars
      : [];

  return {
    collectionCount:
      collection.length,

    activeCollection:
      activeCollection.length,

    maxOverall,

    customPlayers:
      customPlayers.length,

    maxCustomOverall,

    careerWins:
      Number(
        game.career
          ?.totalWins
      ) || 0,

    eventWins,

    completedEvents,

    coins:
      Number(
        game.coins
      ) || 0,

    dailyStreak:
      Number(
        game.daily?.streak
      ) || 0,

    stage:
      Number(
        game.activeStage
      ) || 1,

    transfersBought:
      Number(
        game.stats
          ?.transfersBought
      ) || 0,

    rentalUnlocked:
      Boolean(
        game.rentalCenter
          ?.unlocked
      ),

    rentalSlots:
      Number(
        game.rentalCenter
          ?.slotsUnlocked
      ) || 0,

    rentalCoins:
      Number(
        game.rentalCenter
          ?.lifetimeCoins
      ) || 0,

    rentalCompleted:
      Number(
        game.rentalCenter
          ?.completedRentals
      ) || 0,

    coachCount:
      coachStars.length,

    coachStars,

    coachGains:
      Number(
        game.coaches
          ?.totalGains
      ) || 0,

    hasElTurco:
      collection.some(
        (player) =>
          player.name ===
            "EL TURCO" &&
          Number(
            player.overall
          ) === 100
      ),
  };
}

let lastGame = readGame();

let achievementStats =
  readStats();

function processGameChange(
  previousGame,
  nextGame
) {
  if (!nextGame) {
    return;
  }

  const metrics =
    getCurrentMetrics(
      nextGame
    );

  if (!metrics) {
    return;
  }

  if (
    previousGame?.training &&
    !nextGame.training
  ) {
    achievementStats.trainingsCompleted +=
      1;
  }

  achievementStats.transfersBought =
    Math.max(
      achievementStats.transfersBought,
      metrics.transfersBought
    );

  achievementStats.collectionMax =
    Math.max(
      achievementStats.collectionMax,
      metrics.collectionCount
    );

  achievementStats.maxOverall =
    Math.max(
      achievementStats.maxOverall,
      metrics.maxOverall
    );

  achievementStats.customPlayers =
    Math.max(
      achievementStats.customPlayers,
      metrics.customPlayers
    );

  achievementStats.maxCustomOverall =
    Math.max(
      achievementStats.maxCustomOverall,
      metrics.maxCustomOverall
    );

  achievementStats.careerWins =
    Math.max(
      achievementStats.careerWins,
      metrics.careerWins
    );

  achievementStats.eventWins =
    Math.max(
      achievementStats.eventWins,
      metrics.eventWins
    );

  achievementStats.completedEvents =
    Math.max(
      achievementStats.completedEvents,
      metrics.completedEvents
    );

  achievementStats.maxCoins =
    Math.max(
      achievementStats.maxCoins,
      metrics.coins
    );

  achievementStats.maxDailyStreak =
    Math.max(
      achievementStats.maxDailyStreak,
      metrics.dailyStreak
    );

  achievementStats.maxStage =
    Math.max(
      achievementStats.maxStage,
      metrics.stage
    );

  achievementStats.rentalUnlocked =
    achievementStats.rentalUnlocked ||
    metrics.rentalUnlocked;

  achievementStats.rentalSlots =
    Math.max(
      achievementStats.rentalSlots,
      metrics.rentalSlots
    );

  achievementStats.rentalCoins =
    Math.max(
      achievementStats.rentalCoins,
      metrics.rentalCoins
    );

  achievementStats.rentalCompleted =
    Math.max(
      achievementStats.rentalCompleted,
      metrics.rentalCompleted
    );

  achievementStats.coachCount =
    Math.max(
      achievementStats.coachCount,
      metrics.coachCount
    );

  achievementStats.coachStars =
    Array.from(
      new Set([
        ...achievementStats.coachStars,
        ...metrics.coachStars,
      ])
    );

  achievementStats.coachGains =
    Math.max(
      achievementStats.coachGains,
      metrics.coachGains
    );

  achievementStats.hasElTurco =
    achievementStats.hasElTurco ||
    metrics.hasElTurco;

  const unlockedSet =
    new Set(
      achievementStats.unlocked
    );

  ACHIEVEMENTS.forEach(
    (achievement) => {
      if (
        unlockedSet.has(
          achievement.id
        )
      ) {
        return;
      }

      if (
        achievement.check(
          achievementStats
        )
      ) {
        unlockedSet.add(
          achievement.id
        );
      }
    }
  );

  achievementStats.unlocked =
    Array.from(
      unlockedSet
    );

  saveStats(
    achievementStats
  );
}

function ensureAchievementStyles() {
  if (
    document.getElementById(
      "scw-achievement-style"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "scw-achievement-style";

  style.textContent = `
    .scw-achievement-button {
      min-height: 125px;
      padding: 12px;
      border: 1px solid #695528;
      border-radius: 17px;
      background:
        linear-gradient(
          145deg,
          #352b14,
          #151108
        );
      color: white;
      text-align: left;
    }

    .scw-achievement-button span {
      display: block;
      font-size: 30px;
    }

    .scw-achievement-button strong {
      display: block;
      margin-top: 7px;
      font-size: 15px;
    }

    .scw-achievement-button small {
      display: block;
      margin-top: 4px;
      color: #c0a86c;
      font-size: 10px;
    }

    .scw-achievement-overlay {
      position: fixed;
      z-index: 9998;
      inset: 0;
      overflow: auto;
      padding: 18px;
      background:
        rgba(
          5,
          7,
          10,
          .97
        );
      color: white;
    }

    .scw-achievement-wrap {
      width:
        min(
          100%,
          900px
        );
      margin:
        0 auto;
    }

    .scw-achievement-top {
      display: flex;
      align-items: center;
      justify-content:
        space-between;
      gap: 12px;
      margin-bottom:
        16px;
    }

    .scw-achievement-close {
      min-height: 44px;
      padding: 0 14px;
      border: 1px solid #343c46;
      border-radius: 11px;
      background: #11161c;
      color: white;
      font-weight: 900;
    }

    .scw-achievement-progress {
      margin-bottom:
        18px;
      padding: 14px;
      border: 1px solid #665024;
      border-radius: 14px;
      background: #1d170b;
    }

    .scw-achievement-grid {
      display: grid;
      grid-template-columns:
        repeat(
          2,
          minmax(
            0,
            1fr
          )
        );
      gap: 9px;
    }

    .scw-achievement-card {
      padding: 13px;
      border: 1px solid #2c343d;
      border-radius: 13px;
      background: #0d1218;
    }

    .scw-achievement-card.locked {
      opacity: .42;
      filter: grayscale(1);
    }

    .scw-achievement-card strong {
      display: block;
      margin:
        4px 0;
    }

    .scw-achievement-card small {
      color: #78838e;
      font-size: 9px;
    }

    .scw-achievement-card p {
      margin:
        5px 0 0;
      color: #a7afb8;
      font-size: 10px;
      line-height: 1.4;
    }

    .scw-exit-overlay {
      position: fixed;
      z-index: 10000;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 20px;
      background:
        rgba(
          0,
          0,
          0,
          .78
        );
    }

    .scw-exit-box {
      width:
        min(
          100%,
          380px
        );
      padding: 20px;
      border: 1px solid #353d46;
      border-radius: 17px;
      background: #11161c;
      color: white;
      text-align: center;
    }

    .scw-exit-actions {
      display: grid;
      grid-template-columns:
        1fr 1fr;
      gap: 10px;
      margin-top: 16px;
    }

    .scw-exit-leave,
    .scw-exit-stay {
      min-height: 46px;
      border-radius: 11px;
      font-weight: 950;
    }

    .scw-exit-leave {
      border: 1px solid #832d2d;
      background: #521a1a;
      color: #ffc1b9;
    }

    .scw-exit-stay {
      border: 1px solid #275d9b;
      background: #16365b;
      color: #b4dcff;
    }

    @media (
      max-width: 500px
    ) {
      .scw-achievement-grid {
        grid-template-columns:
          1fr;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}

function closeAchievements() {
  document
    .getElementById(
      "scw-achievement-overlay"
    )
    ?.remove();
}

function openAchievements() {
  closeAchievements();

  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "scw-achievement-overlay";

  overlay.className =
    "scw-achievement-overlay";

  const unlocked =
    new Set(
      achievementStats.unlocked
    );

  const cards =
    ACHIEVEMENTS.map(
      (achievement) => {
        const done =
          unlocked.has(
            achievement.id
          );

        return `
          <div class="scw-achievement-card ${
            done
              ? ""
              : "locked"
          }">
            <small>
              ${
                achievement.category
              }
            </small>

            <strong>
              ${
                done
                  ? "🏆"
                  : "🔒"
              }
              ${
                achievement.title
              }
            </strong>

            <p>
              ${
                achievement.text
              }
            </p>
          </div>
        `;
      }
    ).join("");

  overlay.innerHTML = `
    <div class="scw-achievement-wrap">
      <div class="scw-achievement-top">
        <div>
          <h1 style="margin:0">
            BAŞARIMLAR
          </h1>

          <small style="color:#89939e">
            Soccer Cards War
          </small>
        </div>

        <button
          type="button"
          id="scw-achievement-close"
          class="scw-achievement-close"
        >
          GERİ
        </button>
      </div>

      <div class="scw-achievement-progress">
        <strong>
          ${
            unlocked.size
          } / ${
            ACHIEVEMENTS.length
          } TAMAMLANDI
        </strong>

        <div
          style="
            height:8px;
            margin-top:10px;
            border-radius:20px;
            overflow:hidden;
            background:#0d1014;
          "
        >
          <div
            style="
              width:${
                (
                  unlocked.size /
                  ACHIEVEMENTS.length
                ) * 100
              }%;
              height:100%;
              background:#c79b44;
            "
          ></div>
        </div>
      </div>

      <div class="scw-achievement-grid">
        ${cards}
      </div>
    </div>
  `;

  document.body.appendChild(
    overlay
  );

  document
    .getElementById(
      "scw-achievement-close"
    )
    ?.addEventListener(
      "click",
      closeAchievements
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

  let button =
    document.getElementById(
      "scw-achievement-button"
    );

  if (!button) {
    button =
      document.createElement(
        "button"
      );

    button.id =
      "scw-achievement-button";

    button.type =
      "button";

    button.className =
      "scw-achievement-button";

    button.addEventListener(
      "click",
      openAchievements
    );

    menu.appendChild(
      button
    );
  }

  const unlockedCount =
    achievementStats
      .unlocked.length;

  const label = `
    <span>🏆</span>
    <strong>BAŞARIMLAR</strong>
    <small>
      ${unlockedCount} / ${ACHIEVEMENTS.length}
    </small>
  `;

  if (
    button.innerHTML !==
    label
  ) {
    button.innerHTML =
      label;
  }
}

function showExitConfirmation() {
  if (
    document.getElementById(
      "scw-exit-overlay"
    )
  ) {
    return;
  }

  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "scw-exit-overlay";

  overlay.className =
    "scw-exit-overlay";

  overlay.innerHTML = `
    <div class="scw-exit-box">
      <h2>
        Oyundan çıkılsın mı?
      </h2>

      <p
        style="
          color:#8c96a1;
          font-size:12px;
        "
      >
        Çıkmak istediğine emin misin?
      </p>

      <div class="scw-exit-actions">
        <button
          type="button"
          id="scw-exit-leave"
          class="scw-exit-leave"
        >
          ÇIK
        </button>

        <button
          type="button"
          id="scw-exit-stay"
          class="scw-exit-stay"
        >
          KAL
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(
    overlay
  );

  document
    .getElementById(
      "scw-exit-stay"
    )
    ?.addEventListener(
      "click",
      () => {
        overlay.remove();

        window.history.pushState(
          EXIT_GUARD_STATE,
          "",
          window.location.href
        );
      }
    );

  document
    .getElementById(
      "scw-exit-leave"
    )
    ?.addEventListener(
      "click",
      () => {
        overlay.remove();

        window.history.back();
      }
    );
}

function setupExitGuard() {
  const current =
    window.history.state;

  if (
    !current?.scw
  ) {
    window.history.replaceState(
      EXIT_HOME_STATE,
      "",
      window.location.href
    );
  }

  if (
    window.history.state
      ?.view !==
    "home-guard"
  ) {
    window.history.pushState(
      EXIT_GUARD_STATE,
      "",
      window.location.href
    );
  }

  window.addEventListener(
    "popstate",
    (event) => {
      if (
        event.state?.scw &&
        event.state.view ===
          "home"
      ) {
        showExitConfirmation();
      }
    }
  );
}

ensureAchievementStyles();

const root =
  createRoot(
    document.getElementById(
      "root"
    )
  );

root.render(
  createElement(
    StrictMode,
    null,
    createElement(App)
  )
);

setTimeout(
  setupExitGuard,
  300
);

setInterval(() => {
  const currentGame =
    readGame();

  const previousString =
    JSON.stringify(
      lastGame
    );

  const currentString =
    JSON.stringify(
      currentGame
    );

  if (
    previousString !==
    currentString
  ) {
    processGameChange(
      lastGame,
      currentGame
    );

    lastGame =
      currentGame;
  }

  refreshAchievementButton();
}, 800);

if (
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
          (error) => {
            console.error(
              "Service worker registration failed:",
              error
            );
          }
        );
    }
  );
}