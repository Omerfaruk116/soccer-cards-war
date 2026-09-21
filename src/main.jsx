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

const EVENT_WIN_TARGETS = [
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
    (target) =>
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
        `Koleksiyonunda ${target} kart gör.`,
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

  ...EVENT_WIN_TARGETS.map(
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

  makeAchievement(
    "rental-center",
    "Kiralık Merkezi",
    "Kiralık Oyuncu Merkezi'ni aç.",
    "KİRALAMA",
    (stats) =>
      stats.rentalUnlocked
  ),

  makeAchievement(
    "rental-slot-1",
    "İlk Slot",
    "1 kiralama slotu aç.",
    "KİRALAMA",
    (stats) =>
      stats.rentalSlots >= 1
  ),

  makeAchievement(
    "rental-slot-2",
    "İkinci Slot",
    "2 kiralama slotu aç.",
    "KİRALAMA",
    (stats) =>
      stats.rentalSlots >= 2
  ),

  makeAchievement(
    "rental-slot-3",
    "Üçlü Sistem",
    "3 kiralama slotu aç.",
    "KİRALAMA",
    (stats) =>
      stats.rentalSlots >= 3
  ),

  makeAchievement(
    "rental-slot-5",
    "Kiralama Patronu",
    "Tüm kiralama slotlarını aç.",
    "KİRALAMA",
    (stats) =>
      stats.rentalSlots >= 5
  ),

  makeAchievement(
    "rental-income-1000",
    "İlk Pasif Gelir",
    "Kiralamadan toplam 1.000 Coin kazan.",
    "KİRALAMA",
    (stats) =>
      stats.rentalCoins >= 1000
  ),

  makeAchievement(
    "rental-income-5000",
    "Yan Gelir",
    "Kiralamadan toplam 5.000 Coin kazan.",
    "KİRALAMA",
    (stats) =>
      stats.rentalCoins >= 5000
  ),

  makeAchievement(
    "rental-income-25000",
    "Kiralama İmparatorluğu",
    "Kiralamadan toplam 25.000 Coin kazan.",
    "KİRALAMA",
    (stats) =>
      stats.rentalCoins >= 25000
  ),

  makeAchievement(
    "coach-first",
    "İlk Antrenör",
    "İlk antrenörünü satın al.",
    "ANTRENÖR",
    (stats) =>
      stats.coachCount >= 1
  ),

  makeAchievement(
    "coach-2-star",
    "İki Yıldız",
    "2 yıldızlı antrenörü satın al.",
    "ANTRENÖR",
    (stats) =>
      stats.coachStars.includes(
        2
      )
  ),

  makeAchievement(
    "coach-3-star",
    "Profesyonel Ekip",
    "3 yıldızlı antrenörü satın al.",
    "ANTRENÖR",
    (stats) =>
      stats.coachStars.includes(
        3
      )
  ),

  makeAchievement(
    "coach-5-star",
    "Dünya Klası",
    "5 yıldızlı antrenörü satın al.",
    "ANTRENÖR",
    (stats) =>
      stats.coachStars.includes(
        5
      )
  ),

  makeAchievement(
    "coach-gain-25",
    "Gelişim Ustası",
    "Antrenörlerle toplam 25 GEN kazandır.",
    "ANTRENÖR",
    (stats) =>
      stats.coachGains >= 25
  ),

  makeAchievement(
    "coach-gain-100",
    "Futbol Fabrikası",
    "Antrenörlerle toplam 100 GEN kazandır.",
    "ANTRENÖR",
    (stats) =>
      stats.coachGains >= 100
  ),

  makeAchievement(
    "stage-2",
    "İkinci Aşama",
    "Aşama 2'yi aç.",
    "AŞAMA",
    (stats) =>
      stats.maxStage >= 2
  ),

  makeAchievement(
    "stage-5",
    "Yolun Yarısı",
    "Aşama 5'i aç.",
    "AŞAMA",
    (stats) =>
      stats.maxStage >= 5
  ),

  makeAchievement(
    "stage-8",
    "Elit Seviye",
    "Aşama 8'i aç.",
    "AŞAMA",
    (stats) =>
      stats.maxStage >= 8
  ),

  makeAchievement(
    "stage-10",
    "Son Aşama",
    "Aşama 10'u aç.",
    "AŞAMA",
    (stats) =>
      stats.maxStage >= 10
  ),

  makeAchievement(
    "el-turco-legend",
    "EL TURCO EFSANESİ",
    "EL TURCO kartını kazan.",
    "EFSANE",
    (stats) =>
      stats.hasElTurco
  ),
];

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
        game.daily
          ?.streak
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

let lastGame =
  readGame();

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

  updateAchievementButton();
}

function ensureStyles() {
  if (
    document.getElementById(
      "scw-main-extra-styles"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "scw-main-extra-styles";

  style.textContent = `
    #scw-achievement-dock {
      width: min(100%, 980px);
      margin: -36px auto 48px;
      padding: 0 12px;
      position: relative;
      z-index: 5;
    }

    .scw-achievement-button {
      width: 100%;
      min-height: 105px;
      padding: 16px;
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
      font-size: 17px;
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
      width: min(
        100%,
        900px
      );
      margin: 0 auto;
    }

    .scw-achievement-top {
      display: flex;
      align-items: center;
      justify-content:
        space-between;
      gap: 12px;
      margin-bottom: 16px;
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
      margin-bottom: 18px;
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
      margin: 4px 0;
    }

    .scw-achievement-card small {
      color: #78838e;
      font-size: 9px;
    }

    .scw-achievement-card p {
      margin: 5px 0 0;
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
      width: min(
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

function createAchievementDock() {
  let dock =
    document.getElementById(
      "scw-achievement-dock"
    );

  if (!dock) {
    dock =
      document.createElement(
        "div"
      );

    dock.id =
      "scw-achievement-dock";

    document.body.appendChild(
      dock
    );
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

    dock.appendChild(
      button
    );
  }

  updateAchievementButton();
}

function updateAchievementButton() {
  const button =
    document.getElementById(
      "scw-achievement-button"
    );

  if (!button) {
    return;
  }

  button.innerHTML = `
    <span>🏆</span>
    <strong>BAŞARIMLAR</strong>
    <small>
      ${
        achievementStats
          .unlocked.length
      } / ${
        ACHIEVEMENTS.length
      }
    </small>
  `;
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

ensureStyles();

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

setTimeout(() => {
  setupExitGuard();
  createAchievementDock();
}, 300);

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