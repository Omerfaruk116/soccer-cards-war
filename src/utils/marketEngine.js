import {
  calculatePlayerPrice,
  generateMarketPlayers,
  generatePlayer,
  randomBetween,
} from "../data/players";

/* =========================================================
   TRANSFER PAZARI

   - Otomatik yenilenme: 8 saat
   - Uygulama kapalıyken de süre akar
   - Zaman dolduğunda açınca otomatik yenilenir
   - Bazen %50 indirimli Günün Fırsatı gelir
========================================================= */

export const MARKET_REFRESH_MS =
  8 * 60 * 60 * 1000;

export const MARKET_PLAYER_COUNT = 6;

/*
  %40 ihtimalle fırsat oyuncusu.
  Sonradan istersek kolayca değiştiririz.
*/

export const MARKET_DEAL_CHANCE =
  0.4;

export const MARKET_DEAL_DISCOUNT =
  0.5;

/* =========================================================
   ZAMAN
========================================================= */

export function getNextMarketRefreshTime(
  now = Date.now()
) {
  return (
    Number(now) +
    MARKET_REFRESH_MS
  );
}

export function getMarketRefreshRemaining(
  nextRefreshAt,
  now = Date.now()
) {
  const target =
    Number(nextRefreshAt) ||
    0;

  if (!target) {
    return 0;
  }

  return Math.max(
    0,
    target - Number(now)
  );
}

export function isMarketRefreshReady(
  nextRefreshAt,
  now = Date.now()
) {
  return (
    getMarketRefreshRemaining(
      nextRefreshAt,
      now
    ) === 0
  );
}

/* =========================================================
   GERİ SAYIM

   ÖRNEK:
   07:42:18
========================================================= */

export function formatMarketCountdown(
  milliseconds
) {
  const safe =
    Math.max(
      0,
      Number(milliseconds) ||
        0
    );

  const totalSeconds =
    Math.floor(
      safe / 1000
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
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
      String(value).padStart(
        2,
        "0"
      )
    )
    .join(":");
}

/* =========================================================
   GÜNÜN FIRSATI

   Her market yenilenmesinde yeniden hesaplanır.

   - Her güç seviyesinden çıkabilir
   - Normal fiyatının %50'si
   - Satın alınınca boş kalır
   - Yeni market yenilenince yeni fırsat şansı oluşur
========================================================= */

export function shouldCreateMarketDeal() {
  return (
    Math.random() <
    MARKET_DEAL_CHANCE
  );
}

export function createMarketDeal(
  cap = 25
) {
  if (
    !shouldCreateMarketDeal()
  ) {
    return null;
  }

  const safeCap =
    Math.min(
      99,
      Math.max(
        10,
        Number(cap) || 25
      )
    );

  /*
    Fırsat oyuncusu normal marketten
    biraz daha geniş aralıkta çıkabilir.

    Yani illa güçlü oyuncu olmak zorunda değil.
  */

  const minimum =
    Math.max(
      10,
      safeCap - 20
    );

  const overall =
    randomBetween(
      minimum,
      safeCap
    );

  const player =
    generatePlayer(
      overall,
      overall
    );

  const normalPrice =
    calculatePlayerPrice(
      player.overall
    );

  const dealPrice =
    Math.max(
      1,
      Math.round(
        normalPrice *
          MARKET_DEAL_DISCOUNT
      )
    );

  return {
    ...player,

    deal: true,

    normalPrice,

    price:
      dealPrice,

    discountPercent:
      Math.round(
        (1 -
          MARKET_DEAL_DISCOUNT) *
          100
      ),

    purchased: false,
  };
}

/* =========================================================
   YENİ PAZAR OLUŞTUR
========================================================= */

export function createMarketState({
  cap = 25,
  now = Date.now(),
} = {}) {
  const players =
    generateMarketPlayers(
      MARKET_PLAYER_COUNT,
      cap
    );

  const deal =
    createMarketDeal(
      cap
    );

  return {
    players,

    deal,

    generatedAt:
      Number(now),

    nextRefreshAt:
      getNextMarketRefreshTime(
        now
      ),
  };
}

/* =========================================================
   SAVE UYUMLULUĞU

   Eski save'de market alanları eksikse
   otomatik tamamlar.
========================================================= */

export function ensureMarketState(
  market,
  {
    cap = 25,
    now = Date.now(),
  } = {}
) {
  if (!market) {
    return createMarketState({
      cap,
      now,
    });
  }

  const players =
    Array.isArray(
      market.players
    ) &&
    market.players.length
      ? market.players
      : generateMarketPlayers(
          MARKET_PLAYER_COUNT,
          cap
        );

  const generatedAt =
    Number(
      market.generatedAt
    ) ||
    Number(now);

  const nextRefreshAt =
    Number(
      market.nextRefreshAt
    ) ||
    generatedAt +
      MARKET_REFRESH_MS;

  return {
    ...market,

    players,

    deal:
      market.deal ??
      null,

    generatedAt,

    nextRefreshAt,
  };
}

/* =========================================================
   OTOMATİK YENİLEME KONTROLÜ

   Uygulama 2 gün kapalı kalsa bile
   açıldığında eski market kalmaz.

   En az bir 8 saatlik dönem geçtiyse
   yeni market üretilir.
========================================================= */

export function refreshMarketIfNeeded(
  market,
  {
    cap = 25,
    now = Date.now(),
  } = {}
) {
  const safeMarket =
    ensureMarketState(
      market,
      {
        cap,
        now,
      }
    );

  if (
    !isMarketRefreshReady(
      safeMarket.nextRefreshAt,
      now
    )
  ) {
    return {
      refreshed: false,
      market:
        safeMarket,
    };
  }

  return {
    refreshed: true,

    market:
      createMarketState({
        cap,
        now,
      }),
  };
}

/* =========================================================
   MANUEL YENİLEME

   App.jsx parayı kontrol edecek.
   Burada yalnızca yeni market üretiyoruz.
========================================================= */

export function manuallyRefreshMarket(
  cap = 25,
  now = Date.now()
) {
  return createMarketState({
    cap,
    now,
  });
}

/* =========================================================
   NORMAL MARKETTEN OYUNCU SATIN ALINDI
========================================================= */

export function removePurchasedMarketPlayer(
  market,
  playerId
) {
  if (!market) {
    return market;
  }

  return {
    ...market,

    players:
      (market.players || []).filter(
        (player) =>
          player.id !==
          playerId
      ),
  };
}

/* =========================================================
   GÜNÜN FIRSATI SATIN ALINDI

   Yenisi hemen gelmez.
   Bir sonraki 8 saatlik yenilenmeyi bekler.
========================================================= */

export function markDealPurchased(
  market
) {
  if (!market) {
    return market;
  }

  return {
    ...market,
    deal: null,
  };
}

/* =========================================================
   MARKET EKRANI İÇİN ÖZET
========================================================= */

export function getMarketStatus(
  market,
  now = Date.now()
) {
  if (!market) {
    return {
      remaining: 0,
      countdown:
        "00:00:00",
      ready: true,
      hasDeal: false,
    };
  }

  const remaining =
    getMarketRefreshRemaining(
      market.nextRefreshAt,
      now
    );

  return {
    remaining,

    countdown:
      formatMarketCountdown(
        remaining
      ),

    ready:
      remaining === 0,

    hasDeal:
      Boolean(
        market.deal
      ),

    label:
      remaining === 0
        ? "YENİLENİYOR..."
        : `Yeni oyunculara: ${formatMarketCountdown(
            remaining
          )}`,
  };
}