/* =========================================================
   SOCCER CARDS WAR
   DYNAMIC AVATAR SYSTEM

   Amaç:
   - Her oyuncuya kalıcı görünüş
   - Base yüz
   - Saç
   - Sakal
   - Bıyık
   - Kaş
   - Ten tonu
   - Forma rengi

   Görsel katmanları daha sonra:
   public/avatars/...
   klasöründen okunacak.

   Aynı player.id her zaman
   aynı kombinasyonu üretir.
========================================================= */

/* =========================================================
   VERSION

   İleride avatar sistemini değiştirirsek
   eski oyuncuların görünüşünü korumak için.
========================================================= */

export const AVATAR_VERSION = 1;

/* =========================================================
   ASSET COUNTS

   İlk paket için plan:

   faces:
   face-01.png ...
   face-08.png

   hair:
   hair-01.png ...
   hair-18.png

   beard:
   beard-01.png ...
   beard-10.png

   moustache:
   moustache-01.png ...
   moustache-06.png

   eyebrows:
   eyebrows-01.png ...
   eyebrows-08.png
========================================================= */

export const AVATAR_ASSETS = {
  faces: 8,
  hairs: 18,
  beards: 10,
  moustaches: 6,
  eyebrows: 8,
};

/* =========================================================
   TEN TONLARI

   Base görseller ileride istersek
   CSS filter yerine ayrı asset
   olarak da üretilebilir.
========================================================= */

export const SKIN_TONES = [
  {
    id: "skin-1",
    filter:
      "brightness(1.13) saturate(.88)",
  },

  {
    id: "skin-2",
    filter:
      "brightness(1.04) saturate(.94)",
  },

  {
    id: "skin-3",
    filter:
      "brightness(.96) saturate(1)",
  },

  {
    id: "skin-4",
    filter:
      "brightness(.84) saturate(1.05)",
  },

  {
    id: "skin-5",
    filter:
      "brightness(.72) saturate(1.08)",
  },

  {
    id: "skin-6",
    filter:
      "brightness(.6) saturate(1.04)",
  },
];

/* =========================================================
   SAÇ RENKLERİ
========================================================= */

export const HAIR_COLORS = [
  {
    id: "black",
    filter:
      "brightness(.42) saturate(.8)",
  },

  {
    id: "dark-brown",
    filter:
      "sepia(.25) brightness(.52) saturate(1.2)",
  },

  {
    id: "brown",
    filter:
      "sepia(.45) brightness(.7) saturate(1.25)",
  },

  {
    id: "light-brown",
    filter:
      "sepia(.5) brightness(.9) saturate(1.1)",
  },

  {
    id: "blonde",
    filter:
      "sepia(.7) brightness(1.15) saturate(.8)",
  },

  {
    id: "ginger",
    filter:
      "sepia(.7) hue-rotate(330deg) brightness(.9) saturate(1.7)",
  },

  {
    id: "grey",
    filter:
      "grayscale(.8) brightness(.9)",
  },
];

/* =========================================================
   FORMA RENKLERİ
========================================================= */

export const SHIRT_COLORS = [
  "#c72f35",
  "#174a8b",
  "#151515",
  "#eeeeee",
  "#167246",
  "#d0a62d",
  "#682b88",
  "#b84b1c",
  "#244f62",
  "#7b1628",
];

/* =========================================================
   HASH

   String -> deterministic integer

   Böylece aynı oyuncu
   aynı avatarı alır.
========================================================= */

export function hashAvatarSeed(
  value
) {
  const string =
    String(
      value ??
        "scw-player"
    );

  let hash =
    2166136261;

  for (
    let index = 0;
    index < string.length;
    index += 1
  ) {
    hash ^=
      string.charCodeAt(
        index
      );

    hash =
      Math.imul(
        hash,
        16777619
      );
  }

  return (
    hash >>> 0
  );
}

/* =========================================================
   SEEDED RANDOM
========================================================= */

function createSeededRandom(
  seed
) {
  let state =
    seed >>> 0;

  return function random() {
    state +=
      0x6d2b79f5;

    let value =
      state;

    value =
      Math.imul(
        value ^
          (value >>> 15),
        value | 1
      );

    value ^=
      value +
      Math.imul(
        value ^
          (value >>> 7),
        value | 61
      );

    return (
      (
        value ^
        (value >>> 14)
      ) >>>
      0
    ) /
      4294967296;
  };
}

/* =========================================================
   HELPERS
========================================================= */

function randomInteger(
  random,
  min,
  max
) {
  return Math.floor(
    random() *
      (
        max -
        min +
        1
      )
  ) + min;
}

function randomItem(
  random,
  array
) {
  if (
    !Array.isArray(array) ||
    !array.length
  ) {
    return null;
  }

  return array[
    Math.floor(
      random() *
        array.length
    )
  ];
}

function padNumber(
  value
) {
  return String(
    value
  ).padStart(
    2,
    "0"
  );
}

/* =========================================================
   COUNTRY INFLUENCE

   Zorunlu değil.
   Sadece hafif görsel çeşitlilik.

   Oyuncunun ülkesi görünüşünü
   tamamen belirlemez.
========================================================= */

function getCountrySkinBias(
  country
) {
  const code =
    String(
      country || ""
    ).toUpperCase();

  const groups = {
    light: [
      "SE",
      "NO",
      "DK",
      "FI",
      "IS",
      "IE",
      "GB",
      "DE",
      "NL",
      "BE",
      "PL",
    ],

    medium: [
      "TR",
      "IT",
      "ES",
      "PT",
      "GR",
      "FR",
      "HR",
      "RS",
      "AL",
      "AR",
      "UY",
      "MX",
    ],

    warm: [
      "BR",
      "CO",
      "EC",
      "MA",
      "DZ",
      "TN",
      "EG",
    ],

    dark: [
      "NG",
      "GH",
      "SN",
      "CM",
      "CI",
      "ML",
      "GN",
      "KE",
    ],
  };

  if (
    groups.light.includes(
      code
    )
  ) {
    return [
      0,
      0,
      1,
      1,
      2,
      2,
      3,
    ];
  }

  if (
    groups.medium.includes(
      code
    )
  ) {
    return [
      1,
      1,
      2,
      2,
      3,
      3,
      4,
    ];
  }

  if (
    groups.warm.includes(
      code
    )
  ) {
    return [
      1,
      2,
      2,
      3,
      3,
      4,
      4,
    ];
  }

  if (
    groups.dark.includes(
      code
    )
  ) {
    return [
      3,
      3,
      4,
      4,
      5,
      5,
      2,
    ];
  }

  return [
    0,
    1,
    2,
    3,
    4,
    5,
  ];
}

/* =========================================================
   AVATAR SEED

   ID en önemli parça.

   ID yoksa:
   isim + ülke + pozisyon kullanılır.
========================================================= */

export function getPlayerAvatarSeed(
  player
) {
  if (!player) {
    return "scw-player";
  }

  return String(
    player.id ||
      [
        player.name,
        player.country,
        player.position,
        player.overall,
      ]
        .filter(Boolean)
        .join("-") ||
      "scw-player"
  );
}

/* =========================================================
   CREATE AVATAR

   Deterministic olduğu için:
   oyuncuyu bugün aç
   yarın tekrar aç
   aynı görünür.
========================================================= */

export function createPlayerAvatar(
  player
) {
  const seedString =
    getPlayerAvatarSeed(
      player
    );

  const seed =
    hashAvatarSeed(
      seedString
    );

  const random =
    createSeededRandom(
      seed
    );

  /* -------------------------------------------------------
     FACE
  ------------------------------------------------------- */

  const face =
    randomInteger(
      random,
      1,
      AVATAR_ASSETS.faces
    );

  /* -------------------------------------------------------
     SKIN
  ------------------------------------------------------- */

  const skinOptions =
    getCountrySkinBias(
      player?.country
    );

  const skinIndex =
    randomItem(
      random,
      skinOptions
    ) ?? 2;

  /* -------------------------------------------------------
     HAIR

     Yaklaşık %8 kel.
  ------------------------------------------------------- */

  const bald =
    random() <
    0.08;

  const hair =
    bald
      ? 0
      : randomInteger(
          random,
          1,
          AVATAR_ASSETS.hairs
        );

  const hairColorIndex =
    randomInteger(
      random,
      0,
      HAIR_COLORS.length -
        1
    );

  /* -------------------------------------------------------
     FACIAL HAIR

     %43 sakalsız
     %57 sakal ihtimali.

     Sakal ve bıyık bağımsız
     ama doğal dağılım korunuyor.
  ------------------------------------------------------- */

  const hasBeard =
    random() <
    0.57;

  const beard =
    hasBeard
      ? randomInteger(
          random,
          1,
          AVATAR_ASSETS.beards
        )
      : 0;

  let moustache =
    0;

  if (hasBeard) {
    /*
      Sakallı oyuncuların çoğunda
      bıyık da bulunabilir.
    */

    if (
      random() <
      0.72
    ) {
      moustache =
        randomInteger(
          random,
          1,
          AVATAR_ASSETS.moustaches
        );
    }
  } else if (
    random() <
    0.12
  ) {
    /*
      Sadece bıyık ihtimali.
    */

    moustache =
      randomInteger(
        random,
        1,
        AVATAR_ASSETS.moustaches
      );
  }

  /* -------------------------------------------------------
     EYEBROWS
  ------------------------------------------------------- */

  const eyebrows =
    randomInteger(
      random,
      1,
      AVATAR_ASSETS.eyebrows
    );

  /* -------------------------------------------------------
     SHIRT
  ------------------------------------------------------- */

  const shirtColor =
    randomItem(
      random,
      SHIRT_COLORS
    );

  /* -------------------------------------------------------
     RESULT
  ------------------------------------------------------- */

  return {
    version:
      AVATAR_VERSION,

    seed:
      seedString,

    face,

    skin:
      skinIndex,

    bald,

    hair,

    hairColor:
      hairColorIndex,

    beard,

    moustache,

    eyebrows,

    shirtColor,
  };
}

/* =========================================================
   NORMALIZE

   Eğer oyuncunun kayıtlı avatarı
   varsa onu korur.

   Eksik/eski avatar varsa
   deterministik şekilde tamamlar.
========================================================= */

export function normalizePlayerAvatar(
  player
) {
  const generated =
    createPlayerAvatar(
      player
    );

  const existing =
    player?.avatar;

  if (
    !existing ||
    typeof existing !==
      "object"
  ) {
    return generated;
  }

  return {
    ...generated,
    ...existing,

    version:
      existing.version ??
      AVATAR_VERSION,

    seed:
      existing.seed ||
      generated.seed,
  };
}

/* =========================================================
   APPLY TO PLAYER

   Oyuncu oluşturulurken:

   const player =
     attachAvatarToPlayer(newPlayer)
========================================================= */

export function attachAvatarToPlayer(
  player
) {
  if (!player) {
    return player;
  }

  return {
    ...player,

    avatar:
      normalizePlayerAvatar(
        player
      ),
  };
}

/* =========================================================
   APPLY TO MANY PLAYERS
========================================================= */

export function attachAvatarsToPlayers(
  players
) {
  if (
    !Array.isArray(players)
  ) {
    return [];
  }

  return players.map(
    attachAvatarToPlayer
  );
}

/* =========================================================
   ASSET PATHS
========================================================= */

function basePath() {
  return (
    import.meta.env.BASE_URL ||
    "/"
  );
}

export function getFacePath(
  avatar
) {
  const face =
    Number(
      avatar?.face || 1
    );

  return (
    `${basePath()}` +
    "avatars/faces/" +
    `face-${padNumber(face)}.png`
  );
}

export function getHairPath(
  avatar
) {
  const hair =
    Number(
      avatar?.hair || 0
    );

  if (!hair) {
    return null;
  }

  return (
    `${basePath()}` +
    "avatars/hair/" +
    `hair-${padNumber(hair)}.png`
  );
}

export function getBeardPath(
  avatar
) {
  const beard =
    Number(
      avatar?.beard || 0
    );

  if (!beard) {
    return null;
  }

  return (
    `${basePath()}` +
    "avatars/beards/" +
    `beard-${padNumber(beard)}.png`
  );
}

export function getMoustachePath(
  avatar
) {
  const moustache =
    Number(
      avatar?.moustache || 0
    );

  if (!moustache) {
    return null;
  }

  return (
    `${basePath()}` +
    "avatars/moustaches/" +
    `moustache-${padNumber(
      moustache
    )}.png`
  );
}

export function getEyebrowsPath(
  avatar
) {
  const eyebrows =
    Number(
      avatar?.eyebrows || 1
    );

  return (
    `${basePath()}` +
    "avatars/eyebrows/" +
    `eyebrows-${padNumber(
      eyebrows
    )}.png`
  );
}

/* =========================================================
   FILTER HELPERS
========================================================= */

export function getSkinFilter(
  avatar
) {
  const index =
    Math.max(
      0,
      Math.min(
        SKIN_TONES.length -
          1,
        Number(
          avatar?.skin || 0
        )
      )
    );

  return (
    SKIN_TONES[index]
      ?.filter ||
    "none"
  );
}

export function getHairFilter(
  avatar
) {
  const index =
    Math.max(
      0,
      Math.min(
        HAIR_COLORS.length -
          1,
        Number(
          avatar?.hairColor ||
            0
        )
      )
    );

  return (
    HAIR_COLORS[index]
      ?.filter ||
    "none"
  );
}

/* =========================================================
   AVATAR DESCRIPTION

   Debug sırasında faydalı.
========================================================= */

export function getAvatarDescription(
  player
) {
  const avatar =
    normalizePlayerAvatar(
      player
    );

  return {
    seed:
      avatar.seed,

    face:
      `Face ${avatar.face}`,

    skin:
      `Skin ${
        avatar.skin + 1
      }`,

    hair:
      avatar.bald
        ? "Bald"
        : `Hair ${avatar.hair}`,

    beard:
      avatar.beard
        ? `Beard ${avatar.beard}`
        : "No beard",

    moustache:
      avatar.moustache
        ? `Moustache ${avatar.moustache}`
        : "No moustache",

    eyebrows:
      `Eyebrows ${avatar.eyebrows}`,

    shirtColor:
      avatar.shirtColor,
  };
}