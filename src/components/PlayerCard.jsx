import {
  getCountryFlag,
  getPositionGroup,
  positionGroups,
  rarityNames,
} from "../data/players";

function PlayerCard({
  player,
  selected = false,
  onClick,
  compact = false,
  price = null,
  currencyIcon = "🪙",
  disabled = false,

  sold = false,
  locked = false,
  training = false,
  rented = false,
  coachTraining = false,

  showGroup = true,
}) {
  if (!player) {
    return null;
  }

  const initials = String(
    player.name || "?"
  )
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase()
    )
    .join("");

  const rarity =
    player.rarity ||
    "common";

  const countryFlag =
    getCountryFlag(
      player.country || "TR"
    );

  const groupId =
    player.positionGroup ||
    getPositionGroup(
      player.position
    );

  const group =
    positionGroups[groupId];

  const isSold =
    sold ||
    Boolean(player.sold);

  const isLocked =
    locked ||
    Boolean(player.locked);

  const isTraining =
    training ||
    Boolean(player.training);

  const isRented =
    rented ||
    Boolean(player.rented);

  const isCoachTraining =
    coachTraining ||
    Boolean(
      player.coachTraining
    );

  const isElTurco =
    player.overall === 100 ||
    rarity === "elturco";

  const isDisabled =
    disabled ||
    isSold ||
    isLocked;

  const statusText = (() => {
    if (isSold) {
      return "SATILDI";
    }

    if (isLocked) {
      return "KİLİTLİ";
    }

    if (isRented) {
      return "KİRALIKTA";
    }

    if (isCoachTraining) {
      return "ANTRENÖRDE";
    }

    if (isTraining) {
      return "ANTRENMANDA";
    }

    return "";
  })();

  return (
    <button
      type="button"
      className={`
        player-card
        rarity-${rarity}

        ${
          selected
            ? "player-selected"
            : ""
        }

        ${
          compact
            ? "player-card-compact"
            : ""
        }

        ${
          isSold
            ? "player-card-sold"
            : ""
        }

        ${
          isLocked
            ? "player-card-locked"
            : ""
        }

        ${
          isTraining
            ? "player-card-training"
            : ""
        }

        ${
          isRented
            ? "player-card-rented"
            : ""
        }

        ${
          isCoachTraining
            ? "player-card-coach"
            : ""
        }

        ${
          isElTurco
            ? "player-card-elturco"
            : ""
        }
      `}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="player-card-shine" />

      {isElTurco && (
        <>
          <div
            className="elturco-fire elturco-fire-left"
            aria-hidden="true"
          >
            🔥
          </div>

          <div
            className="elturco-fire elturco-fire-right"
            aria-hidden="true"
          >
            🔥
          </div>
        </>
      )}

      <div className="player-card-top">
        <div>
          <div className="player-overall">
            {player.overall}
          </div>

          <div className="player-position">
            {player.position}
          </div>
        </div>

        <div
          className="player-flag"
          title={player.country}
        >
          {countryFlag}
        </div>
      </div>

      {showGroup &&
        group && (
          <div className="player-group-label">
            {group.name}
          </div>
        )}

      <div
        className="player-portrait"
        aria-hidden="true"
      >
        <span>
          {isElTurco
            ? "🔥"
            : player.custom
              ? "★"
              : initials}
        </span>
      </div>

      <div className="player-name">
        {player.name}
      </div>

      <div className="player-rarity">
        {rarityNames[rarity] ||
          rarityNames.common}
      </div>

      {player.specialReward && (
        <div className="stage-reward-label">
          👑 AŞAMA ÖDÜLÜ
        </div>
      )}

      {player.custom && (
        <div className="custom-player-label">
          ★ SENİN OYUNCUN
        </div>
      )}

      {selected && (
        <div className="selected-player-label">
          ✓ MAÇ KADROSUNDA
        </div>
      )}

      {statusText && (
        <div className="player-status-label">
          {isLocked && "🔒 "}
          {isTraining && "🏋️ "}
          {isRented && "🤝 "}
          {isCoachTraining && "⭐ "}
          {statusText}
        </div>
      )}

      {price !== null && (
        <div className="player-price">
          {currencyIcon}{" "}
          {Number(
            price
          ).toLocaleString()}
        </div>
      )}
    </button>
  );
}

export default PlayerCard;