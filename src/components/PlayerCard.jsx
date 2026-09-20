import {
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
}) {
  const initials =
    player.name
      .split(" ")
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
      )
      .join("")
      .toUpperCase();

  return (
    <button
      type="button"
      className={`
        player-card
        rarity-${player.rarity}
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
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="player-card-shine" />

      <div className="player-card-top">
        <div>
          <div className="player-overall">
            {player.overall}
          </div>

          <div className="player-position">
            {player.position}
          </div>
        </div>

        <div className="player-flag">
          🇹🇷
        </div>
      </div>

      <div
        className="player-portrait"
        aria-hidden="true"
      >
        <span>
          {player.custom
            ? "★"
            : initials}
        </span>
      </div>

      <div className="player-name">
        {player.name}
      </div>

      <div className="player-rarity">
        {
          rarityNames[
            player.rarity
          ]
        }
      </div>

      {player.custom && (
        <div className="custom-player-label">
          ★ SENİN OYUNCUN
        </div>
      )}

      {selected && (
        <div className="selected-player-label">
          ✓ MAÇ DESTESİNDE
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