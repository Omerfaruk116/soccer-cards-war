import {
  StrictMode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import "./mobile.css";

/* =========================================================
   SAVE
========================================================= */

const SAVE_KEYS = [
  "soccer-cards-war-save-v6",
  "soccer-cards-war-save-v5",
  "soccer-cards-war-save-v4",
  "soccer-cards-war-save-v3",
  "soccer-cards-war-save-v2",
];

/* =========================================================
   SAVE OKU
========================================================= */

function readGameSave() {
  for (const key of SAVE_KEYS) {
    try {
      const raw =
        localStorage.getItem(
          key
        );

      if (!raw) {
        continue;
      }

      return JSON.parse(raw);
    } catch {
      // Bozuk save atlanır.
    }
  }

  return null;
}

/* =========================================================
   GENEL YARDIMCILAR
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
          player.overall ||
            0
        )
      ),
    0
  );
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

function getRarityCount(
  game,
  rarity
) {
  return getOwnedPlayers(
    game
  ).filter(
    (player) =>
      player.rarity ===
      rarity
  ).length;
}

function getCustomPlayerCount(
  game
) {
  return getOwnedPlayers(
    game
  ).filter(
    (player) =>
      player.custom ||
      player.isCustom
  ).length;
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
      Number(
        player.overall
      ) === 100
  );
}

function getEventWins(
  game
) {
  return Number(
    game?.missions
      ?.stats
      ?.eventWins ||
      0
  );
}

function getCareerWins(
  game
) {
  return Number(
    game?.career?.wins ||
      game?.missions
        ?.stats
        ?.careerWins ||
      0
  );
}

function getTotalWins(
  game
) {
  return Number(
    game?.missions
      ?.stats
      ?.totalWins ||
      getCareerWins(game) +
        getEventWins(game)
  );
}

function getCompletedEventStages(
  game
) {
  return Object.values(
    game?.events || {}
  ).filter(
    (event) =>
      event?.completed
  ).length;
}

function getCompletedCareerStages(
  game
) {
  return (
    game?.career
      ?.completedStages ||
    []
  ).length;
}

function getCoachCount(
  game
) {
  return (
    game?.coaches?.owned
      ?.length ||
    0
  );
}

function getRentalCount(
  game
) {
  return Number(
    game?.missions
      ?.stats
      ?.rentalsStarted ||
      0
  );
}

function getTrainingCount(
  game
) {
  return Number(
    game?.missions
      ?.stats
      ?.trainingCompleted ||
      0
  );
}

function getMarketBuyCount(
  game
) {
  return Number(
    game?.missions
      ?.stats
      ?.marketBuys ||
      0
  );
}

/* =========================================================
   BAŞARIM ÜRETİCİ
========================================================= */

function achievement(
  id,
  category,
  title,
  description,
  completed
) {
  return {
    id,
    category,
    title,
    description,
    completed:
      Boolean(completed),
  };
}

/* =========================================================
   100 BAŞARIM

   10 Training
   10 Transfer
   10 Collection
   10 Overall
   6 Custom
   12 Career
   14 Event
   6 Coin
   3 Daily
   8 Rental
   6 Coach
   4 Stage
   1 EL TURCO

   TOPLAM = 100
========================================================= */

function buildAchievements(
  game
) {
  if (!game) {
    return [];
  }

  const players =
    getOwnedPlayers(
      game
    );

  const collection =
    players.length;

  const highest =
    getHighestOverall(
      game
    );

  const countries =
    getCountryCount(
      game
    );

  const customCount =
    getCustomPlayerCount(
      game
    );

  const trainingCount =
    getTrainingCount(
      game
    );

  const marketBuys =
    getMarketBuyCount(
      game
    );

  const careerWins =
    getCareerWins(
      game
    );

  const eventWins =
    getEventWins(
      game
    );

  const totalWins =
    getTotalWins(
      game
    );

  const careerStages =
    getCompletedCareerStages(
      game
    );

  const eventStages =
    getCompletedEventStages(
      game
    );

  const coins =
    Number(
      game?.coins || 0
    );

  const dailyStreak =
    Number(
      game?.daily
        ?.streak ||
        0
    );

  const rentals =
    getRentalCount(
      game
    );

  const rentalIncome =
    Number(
      game?.missions
        ?.stats
        ?.rentalIncomeClaimed ||
        0
    );

  const coaches =
    getCoachCount(
      game
    );

  const coachSessions =
    Number(
      game?.missions
        ?.stats
        ?.coachSessionsCompleted ||
        0
    );

  const activeStage =
    Number(
      game?.activeStage ||
        1
    );

  const achievements = [];

  /* =======================================================
     TRAINING — 10
  ======================================================= */

  [
    1,
    2,
    3,
    5,
    10,
    15,
    20,
    30,
    40,
    50,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `training-${index + 1}`,
          "ANTRENMAN",
          `${target} Antrenman`,
          `${target} antrenmanı tamamla.`,
          trainingCount >=
            target
        )
      );
    }
  );

  /* =======================================================
     TRANSFER — 10
  ======================================================= */

  [
    1,
    2,
    3,
    5,
    10,
    15,
    20,
    30,
    40,
    50,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `transfer-${index + 1}`,
          "TRANSFER",
          `${target} Transfer`,
          `Transfer pazarından ${target} oyuncu al.`,
          marketBuys >=
            target
        )
      );
    }
  );

  /* =======================================================
     COLLECTION — 10
  ======================================================= */

  [
    10,
    12,
    15,
    20,
    25,
    30,
    40,
    50,
    75,
    100,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `collection-${index + 1}`,
          "KOLEKSİYON",
          `${target} Oyuncu`,
          `Koleksiyonunda ${target} oyuncuya ulaş.`,
          collection >=
            target
        )
      );
    }
  );

  /* =======================================================
     OVERALL — 10
  ======================================================= */

  [
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    95,
    99,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `overall-${index + 1}`,
          "GEN",
          `${target} GEN`,
          `${target} GEN oyuncuya sahip ol.`,
          highest >=
            target
        )
      );
    }
  );

  /* =======================================================
     CUSTOM — 6
  ======================================================= */

  [
    1,
    2,
    3,
    5,
    10,
    15,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `custom-${index + 1}`,
          "OYUNCU OLUŞTUR",
          `${target} Özel Oyuncu`,
          `${target} kendi oyuncunu oluştur.`,
          customCount >=
            target
        )
      );
    }
  );

  /* =======================================================
     CAREER — 12
  ======================================================= */

  const careerTargets = [
    {
      value: 1,
      text:
        "İlk kariyer galibiyetini al.",
    },
    {
      value: 3,
      text:
        "3 kariyer maçı kazan.",
    },
    {
      value: 5,
      text:
        "5 kariyer maçı kazan.",
    },
    {
      value: 10,
      text:
        "10 kariyer maçı kazan.",
    },
    {
      value: 20,
      text:
        "20 kariyer maçı kazan.",
    },
    {
      value: 30,
      text:
        "30 kariyer maçı kazan.",
    },
    {
      value: 40,
      text:
        "40 kariyer maçı kazan.",
    },
    {
      value: 50,
      text:
        "50 kariyer maçı kazan.",
    },
    {
      value: 60,
      text:
        "60 kariyer maçı kazan.",
    },
    {
      value: 75,
      text:
        "75 kariyer maçı kazan.",
    },
    {
      value: 90,
      text:
        "90 kariyer maçı kazan.",
    },
    {
      value: 100,
      text:
        "100 kariyer maçı kazan.",
    },
  ];

  careerTargets.forEach(
    (item, index) => {
      achievements.push(
        achievement(
          `career-${index + 1}`,
          "KARİYER",
          `${item.value} Galibiyet`,
          item.text,
          careerWins >=
            item.value
        )
      );
    }
  );

  /* =======================================================
     EVENT — 14
  ======================================================= */

  const eventTargets = [
    1,
    3,
    5,
    10,
    15,
    20,
    25,
    30,
    40,
    50,
    60,
    75,
    90,
    100,
  ];

  eventTargets.forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `event-${index + 1}`,
          "ETKİNLİK",
          `${target} Event Galibiyeti`,
          `${target} etkinlik maçı kazan.`,
          eventWins >=
            target
        )
      );
    }
  );

  /* =======================================================
     COIN — 6
  ======================================================= */

  [
    1000,
    5000,
    10000,
    25000,
    100000,
    500000,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `coin-${index + 1}`,
          "COIN",
          `${target.toLocaleString()} Coin`,
          `${target.toLocaleString()} Coin bakiyesine ulaş.`,
          coins >= target
        )
      );
    }
  );

  /* =======================================================
     DAILY — 3
  ======================================================= */

  [
    1,
    3,
    7,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `daily-${index + 1}`,
          "GÜNLÜK",
          `${target} Günlük Seri`,
          `${target} günlük ödül serisine ulaş.`,
          dailyStreak >=
            target
        )
      );
    }
  );

  /* =======================================================
     RENTAL — 8
  ======================================================= */

  [
    1,
    2,
    5,
    10,
    20,
    30,
    40,
    50,
  ].forEach(
    (target, index) => {
      achievements.push(
        achievement(
          `rental-${index + 1}`,
          "KİRALIK",
          `${target} Kiralama`,
          `${target} oyuncu kirala.`,
          rentals >=
            target
        )
      );
    }
  );

  /* =======================================================
     COACH — 6
  ======================================================= */

  achievements.push(
    achievement(
      "coach-1",
      "ANTRENÖR",
      "İlk Antrenör",
      "İlk antrenörünü satın al.",
      coaches >= 1
    ),

    achievement(
      "coach-2",
      "ANTRENÖR",
      "3 Antrenör",
      "3 antrenöre sahip ol.",
      coaches >= 3
    ),

    achievement(
      "coach-3",
      "ANTRENÖR",
      "Tüm Antrenörler",
      "5 antrenörün tamamına sahip ol.",
      coaches >= 5
    ),

    achievement(
      "coach-4",
      "ANTRENÖR",
      "İlk Seans",
      "Bir antrenör seansını tamamla.",
      coachSessions >= 1
    ),

    achievement(
      "coach-5",
      "ANTRENÖR",
      "10 Seans",
      "10 antrenör seansı tamamla.",
      coachSessions >= 10
    ),

    achievement(
      "coach-6",
      "ANTRENÖR",
      "50 Seans",
      "50 antrenör seansı tamamla.",
      coachSessions >= 50
    )
  );

  /* =======================================================
     STAGE — 4
  ======================================================= */

  achievements.push(
    achievement(
      "stage-1",
      "AŞAMA",
      "Aşama 2",
      "Aşama 2'ye ulaş.",
      activeStage >= 2
    ),

    achievement(
      "stage-2",
      "AŞAMA",
      "Aşama 5",
      "Aşama 5'e ulaş.",
      activeStage >= 5
    ),

    achievement(
      "stage-3",
      "AŞAMA",
      "Aşama 8",
      "Aşama 8'e ulaş.",
      activeStage >= 8
    ),

    achievement(
      "stage-4",
      "AŞAMA",
      "Son Aşama",
      "Aşama 10'a ulaş.",
      activeStage >= 10
    )
  );

  /* =======================================================
     EL TURCO — 1
  ======================================================= */

  achievements.push(
    achievement(
      "el-turco",
      "EL TURCO",
      "EL TURCO",
      "100 GEN EL TURCO kartını koleksiyonuna kat.",
      hasElTurco(game)
    )
  );

  /*
    Güvenlik kontrolü:
    Burada tam olarak 100 başarı olmalı.
  */

  return achievements.slice(
    0,
    100
  );
}

/* =========================================================
   ACHIEVEMENT PANEL
========================================================= */

function AchievementPanel({
  open,
  onClose,
  achievements,
}) {
  if (!open) {
    return null;
  }

  const completed =
    achievements.filter(
      (item) =>
        item.completed
    ).length;

  return (
    <div className="achievement-overlay">
      <div className="achievement-modal">
        <div className="achievement-modal-header">
          <div>
            <div className="achievement-eyebrow">
              SOCCER CARDS WAR
            </div>

            <h2>
              🏆 BAŞARIMLAR
            </h2>

            <p>
              {completed}/
              {achievements.length}{" "}
              tamamlandı
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="achievement-close"
          >
            ✕
          </button>
        </div>

        <div className="achievement-progress">
          <div
            className="achievement-progress-fill"
            style={{
              width:
                `${
                  achievements.length
                    ? Math.round(
                        (completed /
                          achievements.length) *
                          100
                      )
                    : 0
                }%`,
            }}
          />
        </div>

        <div className="achievement-grid">
          {achievements.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className={`achievement-item ${
                  item.completed
                    ? "achievement-completed"
                    : ""
                }`}
              >
                <div className="achievement-icon">
                  {item.completed
                    ? "🏆"
                    : "🔒"}
                </div>

                <div>
                  <div className="achievement-category">
                    {
                      item.category
                    }
                  </div>

                  <strong>
                    {item.title}
                  </strong>

                  <p>
                    {
                      item.description
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HOME BAŞARIM KARTI
========================================================= */

function AchievementDock({
  achievements,
  onOpen,
}) {
  const completed =
    achievements.filter(
      (item) =>
        item.completed
    ).length;

  const percentage =
    achievements.length
      ? Math.round(
          (completed /
            achievements.length) *
            100
        )
      : 0;

  return (
    <button
      id="scw-achievement-dock"
      type="button"
      onClick={onOpen}
      className="achievement-dock"
    >
      <div className="achievement-dock-icon">
        🏆
      </div>

      <div className="achievement-dock-copy">
        <strong>
          BAŞARIMLAR
        </strong>

        <span>
          {completed}/100
        </span>

        <div className="achievement-dock-progress">
          <div
            style={{
              width:
                `${percentage}%`,
            }}
          />
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   WRAPPER
========================================================= */

function Root() {
  const [
    currentScreen,
    setCurrentScreen,
  ] = useState(() => {
    return (
      document.body.dataset
        .scwScreen ||
      "home"
    );
  });

  const [
    achievementsOpen,
    setAchievementsOpen,
  ] = useState(false);

  const [
    game,
    setGame,
  ] = useState(
    readGameSave
  );

  /* =======================================================
     APP SCREEN DEĞİŞİMİNİ DİNLE

     App.jsx publishCurrentScreen() çağırıyor.
  ======================================================= */

  useEffect(() => {
    function updateScreen(
      event
    ) {
      const next =
        event?.detail
          ?.screen ||
        document.body.dataset
          .scwScreen ||
        "home";

      setCurrentScreen(
        next
      );

      if (
        next !== "home"
      ) {
        setAchievementsOpen(
          false
        );
      }
    }

    window.addEventListener(
      "scw-screen-change",
      updateScreen
    );

    updateScreen();

    return () => {
      window.removeEventListener(
        "scw-screen-change",
        updateScreen
      );
    };
  }, []);

  /* =======================================================
     SAVE DEĞİŞİMİNİ TAKİP ET

     Aynı tabdaki localStorage değişimi
     storage event üretmediği için aralıklı okuyoruz.
  ======================================================= */

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          const latest =
            readGameSave();

          if (!latest) {
            return;
          }

          setGame(
            latest
          );
        },
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, []);

  /* =======================================================
     BAŞARIM HESABI
  ======================================================= */

  const achievements =
    useMemo(
      () =>
        buildAchievements(
          game
        ),
      [game]
    );

  const showAchievementDock =
    currentScreen ===
      "home" &&
    Boolean(
      game?.clubName
    );

  return (
    <>
      <App />

      {showAchievementDock && (
        <AchievementDock
          achievements={
            achievements
          }
          onOpen={() =>
            setAchievementsOpen(
              true
            )
          }
        />
      )}

      <AchievementPanel
        open={
          achievementsOpen &&
          currentScreen ===
            "home"
        }
        achievements={
          achievements
        }
        onClose={() =>
          setAchievementsOpen(
            false
          )
        }
      />
    </>
  );
}

/* =========================================================
   ACHIEVEMENT CSS
========================================================= */

const achievementStyles =
  document.createElement(
    "style"
  );

achievementStyles.id =
  "scw-achievement-styles";

achievementStyles.textContent = `
  .achievement-dock {
    position: fixed;
    z-index: 90;
    right: 16px;
    bottom: 18px;

    display: flex;
    align-items: center;
    gap: 10px;

    min-width: 165px;
    padding: 10px 12px;

    border: 1px solid #8b6927;
    border-radius: 15px;

    background:
      linear-gradient(
        145deg,
        #38270c,
        #151008
      );

    color: #ffe49b;

    box-shadow:
      0 12px 35px
      rgba(0,0,0,.48),
      0 0 18px
      rgba(220,166,51,.16);

    cursor: pointer;
  }

  .achievement-dock-icon {
    display: grid;
    place-items: center;

    width: 38px;
    height: 38px;

    border-radius: 50%;

    background:
      rgba(
        255,
        211,
        90,
        .13
      );

    font-size: 21px;
  }

  .achievement-dock-copy {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .achievement-dock-copy strong {
    display: block;
    font-size: 11px;
    letter-spacing: .5px;
  }

  .achievement-dock-copy span {
    display: block;
    margin-top: 2px;

    color: #baaa82;
    font-size: 9px;
  }

  .achievement-dock-progress {
    height: 4px;
    overflow: hidden;

    margin-top: 5px;

    border-radius: 99px;
    background: #31291a;
  }

  .achievement-dock-progress div {
    height: 100%;

    border-radius: inherit;

    background:
      linear-gradient(
        90deg,
        #bb8c29,
        #ffe18a
      );
  }

  .achievement-overlay {
    position: fixed;
    z-index: 300;
    inset: 0;

    display: grid;
    place-items: center;

    padding: 16px;

    background:
      rgba(
        0,
        0,
        0,
        .76
      );

    backdrop-filter:
      blur(8px);
  }

  .achievement-modal {
    width:
      min(
        900px,
        100%
      );

    max-height: 88vh;
    overflow: auto;

    padding: 18px;

    border:
      1px solid #554520;

    border-radius: 20px;

    background:
      linear-gradient(
        145deg,
        #121419,
        #080a0d
      );

    box-shadow:
      0 30px 90px
      rgba(0,0,0,.72);
  }

  .achievement-modal-header {
    display: flex;
    justify-content:
      space-between;
    align-items:
      flex-start;
    gap: 15px;
  }

  .achievement-modal-header h2 {
    margin: 3px 0 2px;
  }

  .achievement-modal-header p {
    margin: 0;
    color: #929aa4;
    font-size: 11px;
  }

  .achievement-eyebrow {
    color: #bf9947;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .achievement-close {
    width: 38px;
    height: 38px;

    border:
      1px solid #353a41;

    border-radius: 10px;

    background: #101317;
    color: #fff;

    cursor: pointer;
  }

  .achievement-progress {
    height: 7px;
    overflow: hidden;

    margin:
      16px 0;

    border-radius: 99px;

    background: #24272c;
  }

  .achievement-progress-fill {
    height: 100%;

    border-radius:
      inherit;

    background:
      linear-gradient(
        90deg,
        #b88729,
        #ffd96b
      );
  }

  .achievement-grid {
    display: grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );

    gap: 9px;
  }

  .achievement-item {
    display: grid;

    grid-template-columns:
      34px 1fr;

    gap: 9px;

    min-width: 0;

    padding: 10px;

    border:
      1px solid #2b3138;

    border-radius: 11px;

    background: #0c1015;

    opacity: .58;
  }

  .achievement-completed {
    border-color:
      #806628;

    background:
      linear-gradient(
        145deg,
        #211a0d,
        #0e0d09
      );

    opacity: 1;
  }

  .achievement-icon {
    display: grid;
    place-items: center;

    width: 32px;
    height: 32px;

    border-radius: 9px;

    background: #181d23;
  }

  .achievement-completed
  .achievement-icon {
    background:
      rgba(
        218,
        173,
        66,
        .14
      );
  }

  .achievement-category {
    margin-bottom: 2px;

    color: #947b45;

    font-size: 7px;
    font-weight: 950;
    letter-spacing: .7px;
  }

  .achievement-item strong {
    display: block;

    overflow: hidden;
    text-overflow:
      ellipsis;
    white-space: nowrap;

    font-size: 10px;
  }

  .achievement-item p {
    margin: 3px 0 0;

    color: #7e8791;

    font-size: 8px;
    line-height: 1.35;
  }

  @media (
    max-width: 720px
  ) {
    .achievement-grid {
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }

    .achievement-dock {
      right: 10px;
      bottom: 10px;

      min-width: 145px;

      padding: 8px 10px;
    }
  }

  @media (
    max-width: 390px
  ) {
    .achievement-grid {
      grid-template-columns:
        1fr;
    }

    .achievement-modal {
      padding: 13px;
    }
  }
`;

if (
  !document.getElementById(
    "scw-achievement-styles"
  )
) {
  document.head.appendChild(
    achievementStyles
  );
}

/* =========================================================
   SERVICE WORKER
========================================================= */

if (
  "serviceWorker" in
  navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register(
          `${import.meta.env.BASE_URL}sw.js`
        )
        .catch(() => {
          // SW hatası oyunu bozmaz.
        });
    }
  );
}

/* =========================================================
   RENDER
========================================================= */

createRoot(
  document.getElementById(
    "root"
  )
).render(
  <StrictMode>
    <Root />
  </StrictMode>
);