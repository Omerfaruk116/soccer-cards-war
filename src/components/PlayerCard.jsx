import {
  getCountry,
  getPositionGroup,
  rarityNames,
} from "../data/players";

const RARITY_STYLE = {
  common: {
    background:
      "linear-gradient(145deg, #20252b 0%, #101419 55%, #080b0e 100%)",
    border: "#515963",
    glow: "0 8px 20px rgba(0,0,0,.38)",
    accent: "#aeb6bf",
    text: "#f1f3f5",
    ring: "#626b75",
    shine:
      "linear-gradient(115deg, transparent 25%, rgba(255,255,255,.04) 48%, transparent 68%)",
  },

  rare: {
    background:
      "radial-gradient(circle at 50% 18%, rgba(52,145,255,.40), transparent 35%), linear-gradient(145deg, #123f7a 0%, #082452 52%, #061225 100%)",
    border: "#3f9cff",
    glow:
      "0 0 10px rgba(40,137,255,.7), 0 10px 24px rgba(0,75,180,.45)",
    accent: "#78bdff",
    text: "#f3f9ff",
    ring: "#42a5ff",
    shine:
      "linear-gradient(115deg, transparent 20%, rgba(120,200,255,.18) 48%, transparent 70%)",
  },

  gold: {
    background:
      "radial-gradient(circle at 50% 15%, rgba(255,220,100,.40), transparent 36%), linear-gradient(145deg, #735813 0%, #392b08 52%, #171103 100%)",
    border: "#f0c747",
    glow:
      "0 0 11px rgba(240,199,71,.58), 0 10px 25px rgba(130,91,0,.38)",
    accent: "#ffe17a",
    text: "#fff8d7",
    ring: "#f1c94c",
    shine:
      "linear-gradient(115deg, transparent 18%, rgba(255,239,159,.25) 48%, transparent 72%)",
  },

  platinum: {
    background:
      "radial-gradient(circle at 50% 15%, rgba(218,246,255,.50), transparent 34%), linear-gradient(145deg, #697c88 0%, #31414b 47%, #142129 100%)",
    border: "#d9f5ff",
    glow:
      "0 0 12px rgba(191,235,255,.65), 0 10px 27px rgba(80,145,170,.35)",
    accent: "#dff8ff",
    text: "#ffffff",
    ring: "#c9eefb",
    shine:
      "linear-gradient(115deg, transparent 16%, rgba(255,255,255,.36) 48%, transparent 72%)",
  },

  epic: {
    background:
      "radial-gradient(circle at 50% 15%, rgba(195,85,255,.46), transparent 36%), linear-gradient(145deg, #542075 0%, #29103e 48%, #12071d 100%)",
    border: "#c65cff",
    glow:
      "0 0 13px rgba(190,73,255,.72), 0 11px 28px rgba(103,23,150,.42)",
    accent: "#dc8cff",
    text: "#fcf5ff",
    ring: "#ce6cff",
    shine:
      "linear-gradient(115deg, transparent 18%, rgba(228,150,255,.22) 48%, transparent 72%)",
  },

  legendary: {
    background:
      "radial-gradient(circle at 50% 14%, rgba(255,126,49,.56), transparent 35%), linear-gradient(145deg, #8f2716 0%, #4d130a 48%, #1b0704 100%)",
    border: "#ff742f",
    glow:
      "0 0 14px rgba(255,93,35,.84), 0 11px 30px rgba(180,43,9,.52)",
    accent: "#ffae62",
    text: "#fff5eb",
    ring: "#ff7b35",
    shine:
      "linear-gradient(115deg, transparent 16%, rgba(255,191,113,.28) 48%, transparent 72%)",
  },

  icon: {
    background:
      "radial-gradient(circle at 50% 15%, rgba(255,255,238,.82), transparent 34%), linear-gradient(145deg, #f3e9c8 0%, #cdbb83 48%, #7b693d 100%)",
    border: "#fff4ca",
    glow:
      "0 0 15px rgba(255,241,187,.82), 0 12px 32px rgba(180,150,75,.48)",
    accent: "#fff8d9",
    text: "#2f291b",
    ring: "#fff0ad",
    shine:
      "linear-gradient(115deg, transparent 15%, rgba(255,255,255,.58) 48%, transparent 73%)",
  },

  elturco: {
    background:
      "radial-gradient(circle at 50% 10%, rgba(255,205,68,.68), transparent 30%), radial-gradient(circle at 15% 70%, rgba(255,42,24,.42), transparent 35%), linear-gradient(145deg, #8f120c 0%, #3c0805 44%, #150300 100%)",
    border: "#ffd34f",
    glow:
      "0 0 8px rgba(255,214,73,.95), 0 0 22px rgba(255,63,23,.86), 0 14px 35px rgba(150,20,0,.62)",
    accent: "#ffe56e",
    text: "#fff7d4",
    ring: "#ffd84d",
    shine:
      "linear-gradient(115deg, transparent 12%, rgba(255,223,88,.40) 46%, transparent 68%)",
  },
};

const GROUP_LABELS = {
  goalkeeper: "KALECİ",
  defense: "DEFANS",
  midfield: "ORTA SAHA",
  forward: "FORVET",
};

function PlayerCard({
  player,
  compact = false,
  onClick,
  selected = false,
  disabled = false,
  className = "",
  style = {},
  status = "",
  statusText = "",
  footer = null,
  price = null,
  showPrice = false,
}) {
  if (!player) {
    return null;
  }

  const rarity =
    player.rarity ||
    (player.overall >= 100
      ? "elturco"
      : "common");

  const theme =
    RARITY_STYLE[rarity] ||
    RARITY_STYLE.common;

  const country =
    getCountry(player.country);

  const group =
    player.positionGroup ||
    getPositionGroup(
      player.position
    );

  const rarityLabel =
    rarityNames[rarity] ||
    rarity.toUpperCase();

  const isSold =
    Boolean(player.sold);

  const finalStatus =
    statusText ||
    status ||
    (isSold
      ? "SATILDI"
      : player.rentedUntil &&
          player.rentedUntil >
            Date.now()
        ? "KİRALIKTA"
        : player.trainingUntil &&
            player.trainingUntil >
              Date.now()
          ? "ANTRENMANDA"
          : "");

  const cardHeight =
    compact ? 178 : 226;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`player-card rarity-${rarity} ${compact ? "player-card-compact" : ""} ${selected ? "player-card-selected" : ""} ${className}`}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        minWidth: 0,
        height: cardHeight,
        padding: 0,
        overflow: "hidden",
        borderRadius: compact
          ? 15
          : 18,
        border: `2px solid ${theme.border}`,
        background:
          theme.background,
        boxShadow: selected
          ? `${theme.glow}, 0 0 0 3px rgba(255,255,255,.45)`
          : theme.glow,
        color: theme.text,
        textAlign: "left",
        cursor:
          disabled
            ? "not-allowed"
            : onClick
              ? "pointer"
              : "default",
        opacity:
          disabled || isSold
            ? 0.55
            : 1,
        transition:
          "transform .16s ease, box-shadow .16s ease, opacity .16s ease",
        fontFamily: "inherit",
        WebkitTapHighlightColor:
          "transparent",
        ...style,
      }}
    >
      {/* Parlama katmanı */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme.shine,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Üst dekor */}
      <div
        style={{
          position: "absolute",
          top: -35,
          left: "50%",
          width: 150,
          height: 90,
          transform:
            "translateX(-50%)",
          borderRadius: "50%",
          border: `1px solid ${theme.ring}`,
          opacity: 0.22,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: compact
            ? "10px"
            : "12px",
        }}
      >
        {/* ÜST SATIR */}
        <div
          style={{
            display: "flex",
            alignItems:
              "flex-start",
            justifyContent:
              "space-between",
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: compact
                  ? 8
                  : 9,
                fontWeight: 900,
                letterSpacing:
                  "1.15px",
                color:
                  theme.accent,
                textShadow:
                  rarity ===
                    "icon"
                    ? "none"
                    : "0 1px 5px rgba(0,0,0,.55)",
              }}
            >
              {rarityLabel}
            </div>

            {player.specialReward && (
              <div
                style={{
                  marginTop: 3,
                  fontSize: 8,
                  fontWeight: 900,
                  color:
                    theme.accent,
                }}
              >
                ★ ÖZEL ÖDÜL
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 5,
              padding:
                "3px 6px",
              borderRadius: 999,
              background:
                "rgba(0,0,0,.24)",
              border:
                "1px solid rgba(255,255,255,.13)",
              fontSize: compact
                ? 11
                : 13,
            }}
          >
            <span>
              {country?.flag ||
                "🌍"}
            </span>
          </div>
        </div>

        {/* GEN DAİRESİ */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: compact
                ? 67
                : 84,
              height: compact
                ? 67
                : 84,
              borderRadius: "50%",
              display: "flex",
              flexDirection:
                "column",
              alignItems: "center",
              justifyContent:
                "center",
              border: `3px solid ${theme.ring}`,
              background:
                rarity === "icon"
                  ? "rgba(255,255,255,.34)"
                  : "rgba(0,0,0,.28)",
              boxShadow: `inset 0 0 16px rgba(0,0,0,.27), 0 0 13px ${theme.ring}55`,
            }}
          >
            <strong
              style={{
                lineHeight: 1,
                fontSize: compact
                  ? 27
                  : 34,
                fontWeight: 1000,
                letterSpacing:
                  "-1.5px",
                color:
                  theme.text,
                textShadow:
                  rarity === "icon"
                    ? "0 1px 1px rgba(255,255,255,.5)"
                    : "0 2px 8px rgba(0,0,0,.55)",
              }}
            >
              {player.overall}
            </strong>

            <span
              style={{
                marginTop: 3,
                fontSize: 8,
                fontWeight: 900,
                letterSpacing:
                  "1px",
                color:
                  theme.accent,
              }}
            >
              GEN
            </span>
          </div>
        </div>

        {/* OYUNCU BİLGİSİ */}
        <div
          style={{
            borderTop:
              "1px solid rgba(255,255,255,.13)",
            paddingTop: compact
              ? 7
              : 9,
          }}
        >
          <div
            style={{
              fontSize: compact
                ? 12
                : 14,
              lineHeight: 1.1,
              fontWeight: 950,
              whiteSpace:
                "nowrap",
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              color:
                theme.text,
            }}
          >
            {player.name}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 6,
              marginTop: 6,
              fontSize: compact
                ? 8
                : 9,
              fontWeight: 900,
              letterSpacing:
                ".6px",
            }}
          >
            <span
              style={{
                padding:
                  "3px 6px",
                borderRadius: 6,
                background:
                  "rgba(0,0,0,.25)",
                border:
                  "1px solid rgba(255,255,255,.12)",
                color:
                  theme.accent,
              }}
            >
              {player.position}
            </span>

            <span
              style={{
                color:
                  rarity ===
                  "icon"
                    ? "#3b3320"
                    : "rgba(255,255,255,.72)",
              }}
            >
              {GROUP_LABELS[
                group
              ] || group}
            </span>
          </div>

          {showPrice &&
            price !== null && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  fontWeight: 900,
                  color:
                    theme.accent,
                }}
              >
                🪙{" "}
                {Number(
                  price
                ).toLocaleString()}
              </div>
            )}

          {finalStatus && (
            <div
              style={{
                marginTop: 6,
                padding:
                  "4px 6px",
                borderRadius: 7,
                textAlign:
                  "center",
                fontSize: 8,
                fontWeight: 950,
                letterSpacing:
                  ".5px",
                background:
                  isSold
                    ? "rgba(70,70,70,.85)"
                    : "rgba(0,0,0,.46)",
                border:
                  "1px solid rgba(255,255,255,.12)",
                color:
                  isSold
                    ? "#d1d1d1"
                    : theme.accent,
              }}
            >
              {finalStatus}
            </div>
          )}

          {footer && (
            <div
              style={{
                marginTop: 6,
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* EL TURCO ALT ŞERİDİ */}
      {rarity ===
        "elturco" && (
        <div
          style={{
            position:
              "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background:
              "linear-gradient(90deg,#b5160c,#ffd84d,#ff4b20,#ffd84d,#b5160c)",
            boxShadow:
              "0 0 9px #ff6a1f",
            zIndex: 4,
          }}
        />
      )}
    </button>
  );
}

export default PlayerCard;