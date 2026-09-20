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

const STATS_KEY =
  "scw-achievement-stats-v2";

const originalSetItem =
  localStorage.setItem.bind(
    localStorage
  );

const originalRemoveItem =
  localStorage.removeItem.bind(
    localStorage
  );

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
   YARDIMCI HESAPLAR
   ========================= */

function getCollection(
  game
) {
  return Array.isArray(
    game?.collection
  )
    ? game.collection
    : [];
}

function getSquadPlayers(
  game
) {
  const collection =
    getCollection(game);

  const ids =
    Array.isArray(
      game?.squad
    )
      ? game.squad
      : [];

  return ids
    .map((id) =>
      collection.find(
        (player) =>
          player.id === id
      )
    )
    .filter(Boolean);
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
        total,
        player
      ) =>
        total +
        Number(
          player.overall ||
            0
        ),
      0
    ) / players.length
  );
}

function getHighestOverall(
  game
) {
  const collection =
    getCollection(game);

  if (!collection.length) {
    return 0;
  }

  return Math.max(
    ...collection.map(
      (player) =>
        Number(
          player.overall ||
            0
        )
    )
  );
}

function getHighestCustomOverall(
  game
) {
  const customPlayers =
    getCollection(
      game
    ).filter(
      (player) =>
        player.custom
    );

  if (
    !customPlayers.length
  ) {
    return 0;
  }

  return Math.max(
    ...customPlayers.map(
      (player) =>
        Number(
          player.overall ||
            0
        )
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
            state.match ||
              1
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

function getCareerLeague(
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
    Number(
      game?.career
        ?.leagueIndex ||
        0
    ) + 1
  );
}

/* =========================
   STATS
   ========================= */

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

function readStats() {
  try {
    const raw =
      localStorage.getItem(
        STATS_KEY
      );

    if (!raw) {
      return emptyStats();
    }

    const parsed =
      JSON.parse(raw);

    return {
      ...emptyStats(),
      ...parsed,

      unlocked:
        Array.isArray(
          parsed.unlocked
        )
          ? parsed.unlocked
          : [],
    };
  } catch {
    return emptyStats();
  }
}

function writeStats(
  stats
) {
  originalSetItem(
    STATS_KEY,
    JSON.stringify(stats)
  );
}

function readGame() {
  try {
    const raw =
      localStorage.getItem(
        SAVE_KEY
      );

    return raw
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}

function syncMaxStats(
  game,
  stats
) {
  if (!game) {
    return stats;
  }

  const next = {
    ...stats,
  };

  next.maxCollection =
    Math.max(
      next.maxCollection,
      getCollection(game)
        .length
    );

  next.maxOverall =
    Math.max(
      next.maxOverall,
      getHighestOverall(
        game
      )
    );

  next.maxCustomOverall =
    Math.max(
      next.maxCustomOverall,
      getHighestCustomOverall(
        game
      )
    );

  next.maxSquadAverage =
    Math.max(
      next.maxSquadAverage,
      averageOverall(
        getSquadPlayers(
          game
        )
      )
    );

  next.maxCareerWins =
    Math.max(
      next.maxCareerWins,
      getCareerWins(game)
    );

  next.maxCareerLeague =
    Math.max(
      next.maxCareerLeague,
      getCareerLeague(
        game
      )
    );

  next.maxEventWins =
    Math.max(
      next.maxEventWins,
      getEventWins(game)
    );

  next.maxCompletedEvents =
    Math.max(
      next.maxCompletedEvents,
      getCompletedEvents(
        game
      )
    );

  next.maxCoins =
    Math.max(
      next.maxCoins,
      Number(
        game.coins || 0
      )
    );

  next.bestDailyStreak =
    Math.max(
      next.bestDailyStreak,
      Number(
        game.daily
          ?.streak || 0
      )
    );

  return next;
}

/* =========================
   100 BAŞARIM
   ========================= */

const ACHIEVEMENTS = [
  /* 1-12 ANTRENMAN */

  {
    id: "train-1",
    category:
      "Antrenman",
    icon: "🏋️",
    title:
      "İlk Ter",
    description:
      "1 antrenman tamamla.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-3",
    category:
      "Antrenman",
    icon: "🏋️",
    title:
      "Isınmaya Başladık",
    description:
      "3 antrenman tamamla.",
    target: 3,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-5",
    category:
      "Antrenman",
    icon: "💪",
    title:
      "Disiplin",
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
    id: "train-10",
    category:
      "Antrenman",
    icon: "💪",
    title:
      "Çalışkan",
    description:
      "10 antrenman tamamla.",
    target: 10,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-20",
    category:
      "Antrenman",
    icon: "🔥",
    title:
      "Ter Döküyoruz",
    description:
      "20 antrenman tamamla.",
    target: 20,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-35",
    category:
      "Antrenman",
    icon: "🔥",
    title:
      "Gelişim Kampı",
    description:
      "35 antrenman tamamla.",
    target: 35,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-50",
    category:
      "Antrenman",
    icon: "⚡",
    title:
      "50 Seans",
    description:
      "50 antrenman tamamla.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-75",
    category:
      "Antrenman",
    icon: "⚡",
    title:
      "Durmak Yok",
    description:
      "75 antrenman tamamla.",
    target: 75,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-100",
    category:
      "Antrenman",
    icon: "🥇",
    title:
      "Antrenman Canavarı",
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
    id: "train-150",
    category:
      "Antrenman",
    icon: "🥇",
    title:
      "Profesyonel Disiplin",
    description:
      "150 antrenman tamamla.",
    target: 150,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-250",
    category:
      "Antrenman",
    icon: "🏆",
    title:
      "250 Seans",
    description:
      "250 antrenman tamamla.",
    target: 250,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },
  {
    id: "train-500",
    category:
      "Antrenman",
    icon: "👑",
    title:
      "Demir İrade",
    description:
      "500 antrenman tamamla.",
    target: 500,
    value: (
      game,
      stats
    ) =>
      stats.trainingsCompleted,
  },

  /* 13-24 TRANSFER */

  {
    id: "buy-1",
    category:
      "Transfer",
    icon: "🤝",
    title:
      "İlk İmza",
    description:
      "1 oyuncu satın al.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-3",
    category:
      "Transfer",
    icon: "🤝",
    title:
      "Pazara Girdik",
    description:
      "3 oyuncu satın al.",
    target: 3,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-5",
    category:
      "Transfer",
    icon: "💼",
    title:
      "Menajer Adayı",
    description:
      "5 oyuncu satın al.",
    target: 5,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-10",
    category:
      "Transfer",
    icon: "💼",
    title:
      "Menajer",
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
    id: "buy-15",
    category:
      "Transfer",
    icon: "📋",
    title:
      "Scout Ekibi",
    description:
      "15 oyuncu satın al.",
    target: 15,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-25",
    category:
      "Transfer",
    icon: "📋",
    title:
      "Transfer Uzmanı",
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
    id: "buy-40",
    category:
      "Transfer",
    icon: "💰",
    title:
      "Büyük Alıcı",
    description:
      "40 oyuncu satın al.",
    target: 40,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-60",
    category:
      "Transfer",
    icon: "💰",
    title:
      "Pazar Hakimi",
    description:
      "60 oyuncu satın al.",
    target: 60,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-100",
    category:
      "Transfer",
    icon: "💎",
    title:
      "100 Transfer",
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
    id: "buy-150",
    category:
      "Transfer",
    icon: "💎",
    title:
      "Transfer Baronluğu",
    description:
      "150 oyuncu satın al.",
    target: 150,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-250",
    category:
      "Transfer",
    icon: "🏆",
    title:
      "Pazarın Kralı",
    description:
      "250 oyuncu satın al.",
    target: 250,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },
  {
    id: "buy-500",
    category:
      "Transfer",
    icon: "👑",
    title:
      "Transfer İmparatoru",
    description:
      "500 oyuncu satın al.",
    target: 500,
    value: (
      game,
      stats
    ) =>
      stats.marketPurchases,
  },

  /* 25-36 KOLEKSİYON */

  {
    id: "cards-12",
    category:
      "Koleksiyon",
    icon: "🎴",
    title:
      "İlk Takviyeler",
    description:
      "12 karta ulaş.",
    target: 12,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-15",
    category:
      "Koleksiyon",
    icon: "🎴",
    title:
      "Kart Avcısı",
    description:
      "15 karta ulaş.",
    target: 15,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-20",
    category:
      "Koleksiyon",
    icon: "📚",
    title:
      "20 Kart",
    description:
      "20 karta ulaş.",
    target: 20,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-25",
    category:
      "Koleksiyon",
    icon: "📚",
    title:
      "Dolu Soyunma Odası",
    description:
      "25 karta ulaş.",
    target: 25,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-30",
    category:
      "Koleksiyon",
    icon: "🗃️",
    title:
      "Kart Deposu",
    description:
      "30 karta ulaş.",
    target: 30,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-40",
    category:
      "Koleksiyon",
    icon: "🗃️",
    title:
      "40 Kart",
    description:
      "40 karta ulaş.",
    target: 40,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-50",
    category:
      "Koleksiyon",
    icon: "🏛️",
    title:
      "Kart Arşivi",
    description:
      "50 karta ulaş.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-60",
    category:
      "Koleksiyon",
    icon: "🏛️",
    title:
      "60 Kart",
    description:
      "60 karta ulaş.",
    target: 60,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-75",
    category:
      "Koleksiyon",
    icon: "💫",
    title:
      "Büyük Koleksiyon",
    description:
      "75 karta ulaş.",
    target: 75,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-100",
    category:
      "Koleksiyon",
    icon: "💯",
    title:
      "100 Kart Kulübü",
    description:
      "100 karta ulaş.",
    target: 100,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-150",
    category:
      "Koleksiyon",
    icon: "🏆",
    title:
      "Kart Müzesi",
    description:
      "150 karta ulaş.",
    target: 150,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },
  {
    id: "cards-200",
    category:
      "Koleksiyon",
    icon: "👑",
    title:
      "Koleksiyon İmparatoru",
    description:
      "200 karta ulaş.",
    target: 200,
    value: (
      game,
      stats
    ) =>
      stats.maxCollection,
  },

  /* 37-48 OYUNCU GELİŞİMİ */

  {
    id: "overall-25",
    category:
      "Oyuncu Gelişimi",
    icon: "⭐",
    title:
      "25 GEN",
    description:
      "25 GEN oyuncuya sahip ol.",
    target: 25,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-30",
    category:
      "Oyuncu Gelişimi",
    icon: "⭐",
    title:
      "30 Kulübü",
    description:
      "30 GEN oyuncuya sahip ol.",
    target: 30,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-40",
    category:
      "Oyuncu Gelişimi",
    icon: "🌟",
    title:
      "40 GEN",
    description:
      "40 GEN oyuncuya sahip ol.",
    target: 40,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-50",
    category:
      "Oyuncu Gelişimi",
    icon: "🌟",
    title:
      "Yükselen Yıldız",
    description:
      "50 GEN oyuncuya sahip ol.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-60",
    category:
      "Oyuncu Gelişimi",
    icon: "💫",
    title:
      "60 GEN",
    description:
      "60 GEN oyuncuya sahip ol.",
    target: 60,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-70",
    category:
      "Oyuncu Gelişimi",
    icon: "💫",
    title:
      "Elite",
    description:
      "70 GEN oyuncuya sahip ol.",
    target: 70,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-80",
    category:
      "Oyuncu Gelişimi",
    icon: "🔥",
    title:
      "Dünya Klası",
    description:
      "80 GEN oyuncuya sahip ol.",
    target: 80,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-90",
    category:
      "Oyuncu Gelişimi",
    icon: "👑",
    title:
      "Dünya Yıldızı",
    description:
      "90 GEN oyuncuya sahip ol.",
    target: 90,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-95",
    category:
      "Oyuncu Gelişimi",
    icon: "👑",
    title:
      "Efsane",
    description:
      "95 GEN oyuncuya sahip ol.",
    target: 95,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "overall-99",
    category:
      "Oyuncu Gelişimi",
    icon: "🐐",
    title:
      "GOAT",
    description:
      "99 GEN oyuncuya sahip ol.",
    target: 99,
    value: (
      game,
      stats
    ) =>
      stats.maxOverall,
  },
  {
    id: "team-25",
    category:
      "Oyuncu Gelişimi",
    icon: "🛡️",
    title:
      "Güçlü Onlu",
    description:
      "Maç destesi ortalamasını 25 GEN yap.",
    target: 25,
    value: (
      game,
      stats
    ) =>
      stats.maxSquadAverage,
  },
  {
    id: "team-50",
    category:
      "Oyuncu Gelişimi",
    icon: "🛡️",
    title:
      "Süper Takım",
    description:
      "Maç destesi ortalamasını 50 GEN yap.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.maxSquadAverage,
  },

  /* 49-56 KENDİ OYUNCUN */

  {
    id: "custom-create",
    category:
      "Kendi Oyuncun",
    icon: "👤",
    title:
      "Ben Geldim",
    description:
      "Kendi futbolcunu oluştur.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.customPlayersCreated,
  },
  {
    id: "custom-20",
    category:
      "Kendi Oyuncun",
    icon: "👤",
    title:
      "İlk Gelişim",
    description:
      "Kendi oyuncunu 20 GEN yap.",
    target: 20,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },
  {
    id: "custom-30",
    category:
      "Kendi Oyuncun",
    icon: "⭐",
    title:
      "Mahalle Yıldızı",
    description:
      "Kendi oyuncunu 30 GEN yap.",
    target: 30,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },
  {
    id: "custom-40",
    category:
      "Kendi Oyuncun",
    icon: "⭐",
    title:
      "Profesyonelliğe Doğru",
    description:
      "Kendi oyuncunu 40 GEN yap.",
    target: 40,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },
  {
    id: "custom-50",
    category:
      "Kendi Oyuncun",
    icon: "🌟",
    title:
      "Kendi Süperstarım",
    description:
      "Kendi oyuncunu 50 GEN yap.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },
  {
    id: "custom-70",
    category:
      "Kendi Oyuncun",
    icon: "🔥",
    title:
      "Yıldızdan Fazlası",
    description:
      "Kendi oyuncunu 70 GEN yap.",
    target: 70,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },
  {
    id: "custom-90",
    category:
      "Kendi Oyuncun",
    icon: "👑",
    title:
      "Ben Bir Efsaneyim",
    description:
      "Kendi oyuncunu 90 GEN yap.",
    target: 90,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },
  {
    id: "custom-99",
    category:
      "Kendi Oyuncun",
    icon: "🐐",
    title:
      "Kendi GOAT'ım",
    description:
      "Kendi oyuncunu 99 GEN yap.",
    target: 99,
    value: (
      game,
      stats
    ) =>
      stats.maxCustomOverall,
  },

  /* 57-71 KARİYER */

  {
    id: "career-1",
    category:
      "Kariyer",
    icon: "⚔️",
    title:
      "İlk Zafer",
    description:
      "1 kariyer maçı kazan.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-3",
    category:
      "Kariyer",
    icon: "⚔️",
    title:
      "3 Zafer",
    description:
      "3 kariyer maçı kazan.",
    target: 3,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-5",
    category:
      "Kariyer",
    icon: "🗡️",
    title:
      "Seri Başlıyor",
    description:
      "5 kariyer maçı kazan.",
    target: 5,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-10",
    category:
      "Kariyer",
    icon: "🗡️",
    title:
      "10 Zafer",
    description:
      "10 kariyer maçı kazan.",
    target: 10,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-15",
    category:
      "Kariyer",
    icon: "🔥",
    title:
      "Risk Ustası",
    description:
      "15 kariyer maçı kazan.",
    target: 15,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-20",
    category:
      "Kariyer",
    icon: "🔥",
    title:
      "20 Zafer",
    description:
      "20 kariyer maçı kazan.",
    target: 20,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-30",
    category:
      "Kariyer",
    icon: "🥉",
    title:
      "Kariyer Savaşçısı",
    description:
      "30 kariyer maçı kazan.",
    target: 30,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-40",
    category:
      "Kariyer",
    icon: "🥈",
    title:
      "40 Zafer",
    description:
      "40 kariyer maçı kazan.",
    target: 40,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-50",
    category:
      "Kariyer",
    icon: "🥇",
    title:
      "50 Zafer",
    description:
      "50 kariyer maçı kazan.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-60",
    category:
      "Kariyer",
    icon: "🏆",
    title:
      "Kariyer Ustası",
    description:
      "60 kariyer maçı kazan.",
    target: 60,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-70",
    category:
      "Kariyer",
    icon: "🏆",
    title:
      "70 Zafer",
    description:
      "70 kariyer maçı kazan.",
    target: 70,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "career-80",
    category:
      "Kariyer",
    icon: "👑",
    title:
      "Kariyer Fatihi",
    description:
      "80 kariyer maçı kazan.",
    target: 80,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerWins,
  },
  {
    id: "league-4",
    category:
      "Kariyer",
    icon: "🏟️",
    title:
      "Yarı Yol",
    description:
      "4. kariyer ligine ulaş.",
    target: 4,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerLeague,
  },
  {
    id: "league-8",
    category:
      "Kariyer",
    icon: "🌟",
    title:
      "Efsaneler Kapısı",
    description:
      "8. kariyer ligine ulaş.",
    target: 8,
    value: (
      game,
      stats
    ) =>
      stats.maxCareerLeague,
  },
  {
    id: "career-finish",
    category:
      "Kariyer",
    icon: "👑",
    title:
      "Kariyer Şampiyonu",
    description:
      "Kariyer modunu tamamen bitir.",
    target: 1,
    value: (game) =>
      game?.career
        ?.completed
        ? 1
        : 0,
  },

  /* 72-89 ETKİNLİKLER */

  {
    id: "event-win-1",
    category:
      "Etkinlikler",
    icon: "🏚️",
    title:
      "İlk Etkinlik Zaferi",
    description:
      "1 etkinlik maçı kazan.",
    target: 1,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-10",
    category:
      "Etkinlikler",
    icon: "⚽",
    title:
      "Etkinlik Müdavimi",
    description:
      "10 etkinlik maçı kazan.",
    target: 10,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-25",
    category:
      "Etkinlikler",
    icon: "⚽",
    title:
      "25 Etkinlik Zaferi",
    description:
      "25 etkinlik maçı kazan.",
    target: 25,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-50",
    category:
      "Etkinlikler",
    icon: "🔥",
    title:
      "Etkinlik Savaşçısı",
    description:
      "50 etkinlik maçı kazan.",
    target: 50,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-100",
    category:
      "Etkinlikler",
    icon: "🔥",
    title:
      "100 Etkinlik Zaferi",
    description:
      "100 etkinlik maçı kazan.",
    target: 100,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-150",
    category:
      "Etkinlikler",
    icon: "🏆",
    title:
      "Etkinlik Uzmanı",
    description:
      "150 etkinlik maçı kazan.",
    target: 150,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-250",
    category:
      "Etkinlikler",
    icon: "👑",
    title:
      "250 Etkinlik Zaferi",
    description:
      "250 etkinlik maçı kazan.",
    target: 250,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },
  {
    id: "event-win-355",
    category:
      "Etkinlikler",
    icon: "🐐",
    title:
      "Her Maçı Aldım",
    description:
      "355 etkinlik zaferine ulaş.",
    target: 355,
    value: (
      game,
      stats
    ) =>
      stats.maxEventWins,
  },

  {
    id: "finish-street",
    category:
      "Etkinlikler",
    icon: "🏚️",
    title:
      "Sokakların Kralı",
    description:
      "Sokak Futbolu'nu bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "street"
      ),
  },
  {
    id: "finish-turf",
    category:
      "Etkinlikler",
    icon: "⚽",
    title:
      "Halı Saha Patronu",
    description:
      "Halı Saha'yı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "turf"
      ),
  },
  {
    id: "finish-city",
    category:
      "Etkinlikler",
    icon: "🌆",
    title:
      "Şehrin Şampiyonu",
    description:
      "Şehir Kupası'nı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "city"
      ),
  },
  {
    id: "finish-stadium",
    category:
      "Etkinlikler",
    icon: "🏟️",
    title:
      "Stadyum Fatihi",
    description:
      "Amatör Stadyum'u bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "stadium"
      ),
  },
  {
    id: "finish-pro",
    category:
      "Etkinlikler",
    icon: "🥈",
    title:
      "Profesyonel",
    description:
      "Profesyonel Arena'yı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "pro"
      ),
  },
  {
    id: "finish-national",
    category:
      "Etkinlikler",
    icon: "🏆",
    title:
      "Ulusal Şampiyon",
    description:
      "Ulusal Kupa'yı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "national"
      ),
  },
  {
    id: "finish-europe",
    category:
      "Etkinlikler",
    icon: "🌍",
    title:
      "Avrupa Fatihi",
    description:
      "Avrupa Arenası'nı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "europe"
      ),
  },
  {
    id: "finish-champions",
    category:
      "Etkinlikler",
    icon: "⭐",
    title:
      "Şampiyonların Şampiyonu",
    description:
      "Şampiyonlar Ligi'ni bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "champions"
      ),
  },
  {
    id: "finish-world",
    category:
      "Etkinlikler",
    icon: "🌐",
    title:
      "Dünya Şampiyonu",
    description:
      "Dünya Şampiyonası'nı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "world"
      ),
  },
  {
    id: "finish-legends",
    category:
      "Etkinlikler",
    icon: "👑",
    title:
      "Efsanelerin Efendisi",
    description:
      "Efsaneler Arenası'nı bitir.",
    target: 1,
    value: (game) =>
      eventCompleted(
        game,
        "legends"
      ),
  },

  /* 90-95 EKONOMİ */

  {
    id: "coins-5000",
    category:
      "Ekonomi",
    icon: "🪙",
    title:
      "Cep Dolmaya Başladı",
    description:
      "Aynı anda 5.000 Coin'e sahip ol.",
    target: 5000,
    value: (
      game,
      stats
    ) =>
      stats.maxCoins,
  },
  {
    id: "coins-10000",
    category:
      "Ekonomi",
    icon: "🪙",
    title:
      "10 Binlik",
    description:
      "Aynı anda 10.000 Coin'e sahip ol.",
    target: 10000,
    value: (
      game,
      stats
    ) =>
      stats.maxCoins,
  },
  {
    id: "coins-25000",
    category:
      "Ekonomi",
    icon: "💰",
    title:
      "Kulüp Kasası",
    description:
      "Aynı anda 25.000 Coin'e sahip ol.",
    target: 25000,
    value: (
      game,
      stats
    ) =>
      stats.maxCoins,
  },
  {
    id: "coins-50000",
    category:
      "Ekonomi",
    icon: "💰",
    title:
      "Zengin Kulüp",
    description:
      "Aynı anda 50.000 Coin'e sahip ol.",
    target: 50000,
    value: (
      game,
      stats
    ) =>
      stats.maxCoins,
  },
  {
    id: "coins-100000",
    category:
      "Ekonomi",
    icon: "💎",
    title:
      "100 Bin Coin",
    description:
      "Aynı anda 100.000 Coin'e sahip ol.",
    target: 100000,
    value: (
      game,
      stats
    ) =>
      stats.maxCoins,
  },
  {
    id: "coins-250000",
    category:
      "Ekonomi",
    icon: "👑",
    title:
      "Kulüp Milyoneri",
    description:
      "Aynı anda 250.000 Coin'e sahip ol.",
    target: 250000,
    value: (
      game,
      stats
    ) =>
      stats.maxCoins,
  },

  /* 96-98 GÜNLÜK */

  {
    id: "daily-3",
    category:
      "Günlük",
    icon: "📅",
    title:
      "Üç Gün Üst Üste",
    description:
      "3 günlük giriş serisine ulaş.",
    target: 3,
    value: (
      game,
      stats
    ) =>
      stats.bestDailyStreak,
  },
  {
    id: "daily-5",
    category:
      "Günlük",
    icon: "📅",
    title:
      "Sadık Oyuncu",
    description:
      "5 günlük giriş serisine ulaş.",
    target: 5,
    value: (
      game,
      stats
    ) =>
      stats.bestDailyStreak,
  },
  {
    id: "daily-7",
    category:
      "Günlük",
    icon: "🎁",
    title:
      "Haftayı Kapattık",
    description:
      "7 günlük giriş serisine ulaş.",
    target: 7,
    value: (
      game,
      stats
    ) =>
      stats.bestDailyStreak,
  },

  /* 99-100 ÖZEL */

  {
    id: "all-events",
    category:
      "Özel",
    icon: "🌍",
    title:
      "Her Arenanın Şampiyonu",
    description:
      "10 etkinliğin tamamını bitir.",
    target: 10,
    value: (
      game,
      stats
    ) =>
      stats.maxCompletedEvents,
  },
  {
    id: "el-turco-legend",
    category:
      "Özel",
    icon: "👑",
    title:
      "EL TURCO EFSANESİ",
    description:
      "Kariyeri bitir, 10 etkinliği tamamla, 99 GEN oyuncuya ve 99 GEN kendi oyuncuna sahip ol.",
    target: 4,
    value: (
      game,
      stats
    ) => {
      let count = 0;

      if (
        game?.career
          ?.completed
      ) {
        count += 1;
      }

      if (
        stats.maxCompletedEvents >=
        10
      ) {
        count += 1;
      }

      if (
        stats.maxOverall >=
        99
      ) {
        count += 1;
      }

      if (
        stats.maxCustomOverall >=
        99
      ) {
        count += 1;
      }

      return count;
    },
  },
];

/* =========================
   BAŞARIM DURUMU
   ========================= */

function percentage(
  current,
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
        (current /
          target) *
          100
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
    (achievement) => {
      const current =
        Number(
          achievement.value(
            game,
            stats
          )
        ) || 0;

      if (
        current >=
        achievement.target
      ) {
        unlocked.add(
          achievement.id
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

function syncAndSaveStats(
  game
) {
  let stats =
    readStats();

  stats =
    syncMaxStats(
      game,
      stats
    );

  stats =
    unlockAchievements(
      game,
      stats
    );

  writeStats(stats);

  return stats;
}

function calculateAchievements() {
  const game =
    readGame();

  const stats =
    syncAndSaveStats(
      game
    );

  const unlocked =
    new Set(
      stats.unlocked ||
        []
    );

  return ACHIEVEMENTS.map(
    (achievement) => {
      const current =
        Number(
          achievement.value(
            game,
            stats
          )
        ) || 0;

      const complete =
        unlocked.has(
          achievement.id
        ) ||
        current >=
          achievement.target;

      return {
        ...achievement,

        current,

        progress:
          complete
            ? 100
            : percentage(
                current,
                achievement.target
              ),

        complete,
      };
    }
  );
}

/* =========================
   SAVE DEĞİŞİKLİK TAKİBİ
   ========================= */

localStorage.setItem =
  function (
    key,
    value
  ) {
    let oldGame = null;

    if (
      key === SAVE_KEY
    ) {
      try {
        const oldRaw =
          localStorage.getItem(
            SAVE_KEY
          );

        oldGame = oldRaw
          ? JSON.parse(
              oldRaw
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

    let stats =
      readStats();

    if (
      oldGame &&
      newGame
    ) {
      /* ANTRENMAN */

      if (
        oldGame.training &&
        !newGame.training
      ) {
        const oldPlayer =
          getCollection(
            oldGame
          ).find(
            (player) =>
              player.id ===
              oldGame.training
                .playerId
          );

        const newPlayer =
          getCollection(
            newGame
          ).find(
            (player) =>
              player.id ===
              oldGame.training
                .playerId
          );

        if (
          oldPlayer &&
          newPlayer &&
          Number(
            newPlayer.overall
          ) >
            Number(
              oldPlayer.overall
            )
        ) {
          stats.trainingsCompleted +=
            1;
        }
      }

      /* TRANSFER */

      const oldMarket =
        Array.isArray(
          oldGame.market
        )
          ? oldGame.market
          : [];

      const newMarket =
        Array.isArray(
          newGame.market
        )
          ? newGame.market
          : [];

      const newCollectionIds =
        new Set(
          getCollection(
            newGame
          ).map(
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

      const purchases =
        oldMarket.filter(
          (player) =>
            !newMarketIds.has(
              player.id
            ) &&
            newCollectionIds.has(
              player.id
            )
        );

      stats.marketPurchases +=
        purchases.length;

      /* KENDİ OYUNCUN */

      const oldCustom =
        getCollection(
          oldGame
        ).filter(
          (player) =>
            player.custom
        ).length;

      const newCustom =
        getCollection(
          newGame
        ).filter(
          (player) =>
            player.custom
        ).length;

      if (
        newCustom >
        oldCustom
      ) {
        stats.customPlayersCreated +=
          newCustom -
          oldCustom;
      }
    }

    stats =
      syncMaxStats(
        newGame,
        stats
      );

    stats =
      unlockAchievements(
        newGame,
        stats
      );

    writeStats(stats);

    refreshAchievementButton();
  };

localStorage.removeItem =
  function (key) {
    originalRemoveItem(
      key
    );

    if (
      key === SAVE_KEY
    ) {
      originalRemoveItem(
        STATS_KEY
      );
    }
  };

/* =========================
   BAŞARIM CSS
   ========================= */

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
      background: linear-gradient(
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
      background: linear-gradient(
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
      grid-template-columns: 48px 1fr 60px;
      gap: 12px;
      align-items: center;
      padding: 13px;
      border: 1px solid #2c323a;
      border-radius: 12px;
      background: linear-gradient(
        145deg,
        #11151b,
        #0b0e12
      );
    }

    .scw-achievement-card.complete {
      border-color: #59672e;
      background: linear-gradient(
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

    @media (max-width: 650px) {
      .scw-achievement-shell {
        width: 100%;
        padding:
          14px 10px
          calc(
            28px +
            env(safe-area-inset-bottom)
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

  document.head.append(
    style
  );
}

/* =========================
   BAŞARIM EKRANI
   ========================= */

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
      (achievement) =>
        achievement.complete
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
        (achievement) =>
          achievement.category
      )
    ),
  ];

  categories.forEach(
    (category) => {
      const title =
        document.createElement(
          "div"
        );

      title.className =
        "scw-achievement-category";

      title.textContent =
        category.toUpperCase();

      shell.append(title);

      const list =
        document.createElement(
          "div"
        );

      list.className =
        "scw-achievement-list";

      achievements
        .filter(
          (achievement) =>
            achievement.category ===
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

            const shown =
              Math.min(
                achievement.current,
                achievement.target
              );

            card.innerHTML = `
              <div class="scw-achievement-icon">
                ${
                  achievement.complete
                    ? "✅"
                    : achievement.icon
                }
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
                      : `${Number(
                          shown
                        ).toLocaleString()}/${Number(
                          achievement.target
                        ).toLocaleString()}`
                  }
                </small>
              </div>
            `;

            list.append(card);
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
   ANA MENÜ BAŞARIM BUTONU
   ========================= */

function refreshAchievementButton() {
  const menu =
    document.querySelector(
      ".menu-grid"
    );

  if (!menu) {
    return;
  }

  const achievements =
    calculateAchievements();

  const completed =
    achievements.filter(
      (achievement) =>
        achievement.complete
    ).length;

  const total =
    achievements.length;

  const percent =
    percentage(
      completed,
      total
    );

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

    button.addEventListener(
      "click",
      showAchievements
    );

    menu.append(button);
  }

  button.innerHTML = `
    <div class="menu-icon">
      🏅
    </div>

    <div>
      <span>
        ${percent}% • ${completed}/${total}
      </span>

      <h2>
        BAŞARIMLAR
      </h2>
    </div>
  `;
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
   ÇIKIŞ KORUMASI
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
  const dialog =
    document.getElementById(
      "scw-exit-dialog"
    );

  if (dialog) {
    dialog.remove();
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

      alignItems:
        "center",

      justifyContent:
        "center",

      padding: "24px",

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
      width: "100%",
      maxWidth: "360px",

      padding:
        "26px 20px 20px",

      border:
        "1px solid #343a44",

      borderRadius:
        "18px",

      background:
        "linear-gradient(145deg,#15191f,#090b0f)",

      color: "#fff",

      textAlign:
        "center",
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
      marginTop: "8px",
      fontSize: "22px",
      fontWeight: "900",
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
        "linear-gradient(135deg,#d4544b,#872d28)",

      color: "#fff",

      fontWeight:
        "900",

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
        "linear-gradient(135deg,#4385d6,#235393)",

      color: "#fff",

      fontWeight:
        "900",

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
   İLK STAT SENKRONU
   ========================= */

syncAndSaveStats(
  readGame()
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
}, 150);

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