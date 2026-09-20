import { rarityNames } from "../data/players";

function PlayerCard({
  player,
  selected = false,
  onClick,
  compact = false,
  price = null,
  currency = "coin",
}) {
  return (
    <button
      type="button"
      className={`
        player-card
        rarity-${player.rarity}
        ${selected ? "player-selected" : ""}
        ${compact ? "player-card-compact" : ""}
      `}
      onClick={onClick}
    >
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

      <div className="player-figure">
        {player.custom ? "👤" : "⚽"}
      </div>

      <div className="player-name">
        {player.name}
      </div>

      <div className="player-rarity">
        {rarityNames[player.rarity]}
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
          {currency === "street" ? "🟠" : "🪙"}{" "}
          {price.toLocaleString()}
        </div>
      )}
    </button>
  );
}

export default PlayerCard;