import {
  useMemo,
  useState,
} from "react";

import PlayerAvatar from "./PlayerAvatar";

import {
  AVATAR_ASSETS,
  HAIR_COLORS,
  SHIRT_COLORS,
  SKIN_TONES,
  normalizePlayerAvatar,
} from "../utils/avatarSystem";

/* =========================================================
   SOCCER CARDS WAR
   AVATAR PREVIEW / EDITOR

   Bu component:
   - Oyuncunun mevcut avatarını gösterir
   - Yüz değiştirir
   - Saç değiştirir
   - Saç rengi değiştirir
   - Sakal değiştirir
   - Bıyık değiştirir
   - Kaş değiştirir
   - Ten tonu değiştirir
   - Forma rengini değiştirir
   - Kaydetmeden önce canlı önizleme verir

   onSave(playerWithAvatar)
   çağrısı ile güncellenmiş oyuncuyu dışarı verir.
========================================================= */

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      Number(value) || 0
    )
  );
}

function cycleValue(
  current,
  min,
  max,
  direction
) {
  let next =
    Number(current) +
    direction;

  if (next > max) {
    next = min;
  }

  if (next < min) {
    next = max;
  }

  return next;
}

export default function AvatarPreview({
  player,
  onSave,
  onClose,
}) {
  const originalAvatar =
    useMemo(
      () =>
        normalizePlayerAvatar(
          player
        ),
      [player]
    );

  const [
    avatar,
    setAvatar,
  ] = useState(
    () => ({
      ...originalAvatar,
    })
  );

  const [
    savedFlash,
    setSavedFlash,
  ] = useState(false);

  /* =======================================================
     PREVIEW PLAYER

     PlayerAvatar mevcut player.avatar yerine
     buradaki canlı düzenlemeyi kullanacak.
  ======================================================= */

  const previewPlayer =
    useMemo(
      () => ({
        ...player,

        avatar: {
          ...avatar,
        },
      }),
      [
        player,
        avatar,
      ]
    );

  /* =======================================================
     UPDATE
  ======================================================= */

  function updateAvatar(
    key,
    value
  ) {
    setAvatar(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  /* =======================================================
     RANDOMIZE

     Sadece editörde yeni kombinasyon oluşturur.
     Oyuncunun ID'sini değiştirmez.
  ======================================================= */

  function randomizeAvatar() {
    const hair =
      Math.random() <
      0.08
        ? 0
        : Math.floor(
            Math.random() *
              AVATAR_ASSETS.hairs
          ) + 1;

    const beard =
      Math.random() <
      0.43
        ? 0
        : Math.floor(
            Math.random() *
              AVATAR_ASSETS.beards
          ) + 1;

    let moustache =
      0;

    if (
      Math.random() <
      (beard ? 0.7 : 0.12)
    ) {
      moustache =
        Math.floor(
          Math.random() *
            AVATAR_ASSETS.moustaches
        ) + 1;
    }

    updateWholeAvatar({
      ...avatar,

      face:
        Math.floor(
          Math.random() *
            AVATAR_ASSETS.faces
        ) + 1,

      skin:
        Math.floor(
          Math.random() *
            SKIN_TONES.length
        ),

      hair,

      bald:
        hair === 0,

      hairColor:
        Math.floor(
          Math.random() *
            HAIR_COLORS.length
        ),

      beard,

      moustache,

      eyebrows:
        Math.floor(
          Math.random() *
            AVATAR_ASSETS.eyebrows
        ) + 1,

      shirtColor:
        SHIRT_COLORS[
          Math.floor(
            Math.random() *
              SHIRT_COLORS.length
          )
        ],
    });
  }

  function updateWholeAvatar(
    next
  ) {
    setAvatar({
      ...next,
    });
  }

  /* =======================================================
     RESET
  ======================================================= */

  function resetAvatar() {
    setAvatar({
      ...originalAvatar,
    });
  }

  /* =======================================================
     SAVE
  ======================================================= */

  function saveAvatar() {
    const updatedPlayer = {
      ...player,

      avatar: {
        ...avatar,

        face:
          clamp(
            avatar.face,
            1,
            AVATAR_ASSETS.faces
          ),

        skin:
          clamp(
            avatar.skin,
            0,
            SKIN_TONES.length -
              1
          ),

        hair:
          clamp(
            avatar.hair,
            0,
            AVATAR_ASSETS.hairs
          ),

        beard:
          clamp(
            avatar.beard,
            0,
            AVATAR_ASSETS.beards
          ),

        moustache:
          clamp(
            avatar.moustache,
            0,
            AVATAR_ASSETS.moustaches
          ),

        eyebrows:
          clamp(
            avatar.eyebrows,
            1,
            AVATAR_ASSETS.eyebrows
          ),

        hairColor:
          clamp(
            avatar.hairColor,
            0,
            HAIR_COLORS.length -
              1
          ),

        bald:
          Number(
            avatar.hair
          ) === 0,
      },
    };

    onSave?.(
      updatedPlayer
    );

    setSavedFlash(
      true
    );

    window.setTimeout(
      () => {
        setSavedFlash(
          false
        );
      },
      900
    );
  }

  /* =======================================================
     CONTROL ROW
  ======================================================= */

  function ControlRow({
    title,
    value,
    displayValue,
    min,
    max,
    onChange,
  }) {
    function previous() {
      onChange(
        cycleValue(
          value,
          min,
          max,
          -1
        )
      );
    }

    function next() {
      onChange(
        cycleValue(
          value,
          min,
          max,
          1
        )
      );
    }

    return (
      <div className="scw-avatar-control">
        <div className="scw-avatar-control-title">
          {title}
        </div>

        <div className="scw-avatar-control-buttons">
          <button
            type="button"
            onClick={
              previous
            }
          >
            ‹
          </button>

          <div className="scw-avatar-control-value">
            {displayValue ??
              value}
          </div>

          <button
            type="button"
            onClick={
              next
            }
          >
            ›
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="scw-avatar-editor">
      <div className="scw-avatar-editor-header">
        <div>
          <div className="scw-avatar-editor-kicker">
            SCW PLAYER
          </div>

          <h3>
            OYUNCU GÖRÜNÜMÜ
          </h3>
        </div>

        {onClose && (
          <button
            type="button"
            className="scw-avatar-editor-close"
            onClick={
              onClose
            }
            aria-label="Kapat"
          >
            ×
          </button>
        )}
      </div>

      {/* =================================================
          BIG PREVIEW
      ================================================== */}

      <div className="scw-avatar-preview-area">
        <div className="scw-avatar-preview-glow" />

        <PlayerAvatar
          player={
            previewPlayer
          }
          size={190}
          showRating
          showPosition
        />

        <div className="scw-avatar-player-name">
          {player?.name ||
            "SCW PLAYER"}
        </div>

        <div className="scw-avatar-player-meta">
          {player?.country ||
            "SCW"}

          {player?.position
            ? ` • ${player.position}`
            : ""}
        </div>
      </div>

      {/* =================================================
          CONTROLS
      ================================================== */}

      <div className="scw-avatar-controls">
        <ControlRow
          title="YÜZ"
          value={
            avatar.face
          }
          displayValue={
            `${avatar.face} / ${AVATAR_ASSETS.faces}`
          }
          min={1}
          max={
            AVATAR_ASSETS.faces
          }
          onChange={(
            value
          ) =>
            updateAvatar(
              "face",
              value
            )
          }
        />

        <ControlRow
          title="TEN TONU"
          value={
            avatar.skin
          }
          displayValue={
            `${
              Number(
                avatar.skin
              ) + 1
            } / ${SKIN_TONES.length}`
          }
          min={0}
          max={
            SKIN_TONES.length -
            1
          }
          onChange={(
            value
          ) =>
            updateAvatar(
              "skin",
              value
            )
          }
        />

        <ControlRow
          title="SAÇ"
          value={
            avatar.hair
          }
          displayValue={
            Number(
              avatar.hair
            ) === 0
              ? "KEL"
              : `${avatar.hair} / ${AVATAR_ASSETS.hairs}`
          }
          min={0}
          max={
            AVATAR_ASSETS.hairs
          }
          onChange={(
            value
          ) => {
            updateWholeAvatar({
              ...avatar,

              hair:
                value,

              bald:
                value ===
                0,
            });
          }}
        />

        <ControlRow
          title="SAÇ RENGİ"
          value={
            avatar.hairColor
          }
          displayValue={
            HAIR_COLORS[
              avatar.hairColor
            ]?.id?.toUpperCase() ||
            "BLACK"
          }
          min={0}
          max={
            HAIR_COLORS.length -
            1
          }
          onChange={(
            value
          ) =>
            updateAvatar(
              "hairColor",
              value
            )
          }
        />

        <ControlRow
          title="SAKAL"
          value={
            avatar.beard
          }
          displayValue={
            Number(
              avatar.beard
            ) === 0
              ? "YOK"
              : `${avatar.beard} / ${AVATAR_ASSETS.beards}`
          }
          min={0}
          max={
            AVATAR_ASSETS.beards
          }
          onChange={(
            value
          ) =>
            updateAvatar(
              "beard",
              value
            )
          }
        />

        <ControlRow
          title="BIYIK"
          value={
            avatar.moustache
          }
          displayValue={
            Number(
              avatar.moustache
            ) === 0
              ? "YOK"
              : `${avatar.moustache} / ${AVATAR_ASSETS.moustaches}`
          }
          min={0}
          max={
            AVATAR_ASSETS.moustaches
          }
          onChange={(
            value
          ) =>
            updateAvatar(
              "moustache",
              value
            )
          }
        />

        <ControlRow
          title="KAŞ"
          value={
            avatar.eyebrows
          }
          displayValue={
            `${avatar.eyebrows} / ${AVATAR_ASSETS.eyebrows}`
          }
          min={1}
          max={
            AVATAR_ASSETS.eyebrows
          }
          onChange={(
            value
          ) =>
            updateAvatar(
              "eyebrows",
              value
            )
          }
        />

        {/* =================================================
            SHIRT COLORS
        ================================================== */}

        <div className="scw-avatar-color-section">
          <div className="scw-avatar-control-title">
            FORMA
          </div>

          <div className="scw-avatar-color-grid">
            {SHIRT_COLORS.map(
              (
                color
              ) => (
                <button
                  key={
                    color
                  }
                  type="button"
                  className={
                    avatar.shirtColor ===
                    color
                      ? "scw-avatar-color scw-avatar-color-active"
                      : "scw-avatar-color"
                  }
                  style={{
                    background:
                      color,
                  }}
                  onClick={() =>
                    updateAvatar(
                      "shirtColor",
                      color
                    )
                  }
                  aria-label={
                    `Forma ${color}`
                  }
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          ACTIONS
      ================================================== */}

      <div className="scw-avatar-editor-actions">
        <button
          type="button"
          className="scw-avatar-action-secondary"
          onClick={
            randomizeAvatar
          }
        >
          🎲 RASTGELE
        </button>

        <button
          type="button"
          className="scw-avatar-action-secondary"
          onClick={
            resetAvatar
          }
        >
          ↺ SIFIRLA
        </button>

        <button
          type="button"
          className="scw-avatar-action-save"
          onClick={
            saveAvatar
          }
        >
          {savedFlash
            ? "✓ KAYDEDİLDİ"
            : "✓ KAYDET"}
        </button>
      </div>

      {/* =================================================
          CSS
      ================================================== */}

      <style>
        {`
          .scw-avatar-editor {
            width: 100%;

            max-width: 520px;

            margin:
              0 auto;

            overflow: hidden;

            border:
              1px solid
              #34404a;

            border-radius:
              16px;

            background:
              linear-gradient(
                150deg,
                #121a21,
                #080d11
              );

            color: white;

            box-sizing:
              border-box;

            box-shadow:
              0 18px 45px
              rgba(
                0,
                0,
                0,
                .32
              );
          }

          .scw-avatar-editor-header {
            display: flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap: 12px;

            padding:
              15px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                .07
              );
          }

          .scw-avatar-editor-kicker {
            margin-bottom:
              3px;

            color:
              #826b35;

            font-size:
              7px;

            font-weight:
              1000;

            letter-spacing:
              2px;
          }

          .scw-avatar-editor-header h3 {
            margin: 0;

            color:
              #efc45b;

            font-size:
              12px;

            font-weight:
              1000;

            letter-spacing:
              .6px;
          }

          .scw-avatar-editor-close {
            display: grid;

            place-items:
              center;

            width: 34px;
            height: 34px;

            padding: 0;

            border:
              1px solid
              #38434d;

            border-radius:
              9px;

            background:
              #121920;

            color:
              #9da6ad;

            font-family:
              inherit;

            font-size:
              22px;

            cursor:
              pointer;
          }

          /* =============================================
             PREVIEW
          ============================================= */

          .scw-avatar-preview-area {
            position:
              relative;

            display: flex;

            flex-direction:
              column;

            align-items:
              center;

            justify-content:
              center;

            min-height:
              270px;

            padding:
              22px 15px 18px;

            overflow:
              hidden;

            background:
              radial-gradient(
                circle
                at
                50%
                38%,
                rgba(
                  206,
                  163,
                  62,
                  .11
                ),
                transparent
                40%
              ),
              linear-gradient(
                180deg,
                #111921,
                #090e13
              );
          }

          .scw-avatar-preview-glow {
            position:
              absolute;

            left: 50%;
            top: 45%;

            width: 220px;
            height: 220px;

            transform:
              translate(
                -50%,
                -50%
              );

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  234,
                  187,
                  76,
                  .15
                ),
                transparent
                68%
              );

            filter:
              blur(15px);

            pointer-events:
              none;
          }

          .scw-avatar-player-name {
            position:
              relative;

            z-index: 5;

            margin-top:
              13px;

            color:
              #f0f2f3;

            font-size:
              13px;

            font-weight:
              1000;

            letter-spacing:
              .4px;
          }

          .scw-avatar-player-meta {
            position:
              relative;

            z-index: 5;

            margin-top:
              4px;

            color:
              #697680;

            font-size:
              8px;

            font-weight:
              900;

            letter-spacing:
              1px;
          }

          /* =============================================
             CONTROLS
          ============================================= */

          .scw-avatar-controls {
            display: grid;

            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );

            gap: 8px;

            padding: 12px;
          }

          .scw-avatar-control {
            padding: 9px;

            border:
              1px solid
              #29343d;

            border-radius:
              10px;

            background:
              #0b1116;
          }

          .scw-avatar-control-title {
            margin-bottom:
              7px;

            color:
              #707c86;

            font-size:
              7px;

            font-weight:
              1000;

            letter-spacing:
              .8px;
          }

          .scw-avatar-control-buttons {
            display: grid;

            grid-template-columns:
              31px
              minmax(
                0,
                1fr
              )
              31px;

            align-items:
              center;

            gap: 5px;
          }

          .scw-avatar-control-buttons button {
            display: grid;

            place-items:
              center;

            height: 31px;

            padding: 0;

            border:
              1px solid
              #36414a;

            border-radius:
              8px;

            background:
              #151d23;

            color:
              #d5ab4d;

            font-family:
              inherit;

            font-size:
              20px;

            font-weight:
              900;

            cursor:
              pointer;
          }

          .scw-avatar-control-buttons button:active {
            transform:
              scale(.94);
          }

          .scw-avatar-control-value {
            overflow:
              hidden;

            color:
              #d9dee2;

            text-align:
              center;

            text-overflow:
              ellipsis;

            white-space:
              nowrap;

            font-size:
              8px;

            font-weight:
              1000;
          }

          /* =============================================
             SHIRT
          ============================================= */

          .scw-avatar-color-section {
            grid-column:
              1 / -1;

            padding: 10px;

            border:
              1px solid
              #29343d;

            border-radius:
              10px;

            background:
              #0b1116;
          }

          .scw-avatar-color-grid {
            display: flex;

            flex-wrap:
              wrap;

            gap: 7px;
          }

          .scw-avatar-color {
            width: 29px;
            height: 29px;

            padding: 0;

            border:
              2px solid
              transparent;

            border-radius:
              50%;

            cursor:
              pointer;

            box-shadow:
              inset
              0 0 0
              1px
              rgba(
                255,
                255,
                255,
                .15
              );
          }

          .scw-avatar-color-active {
            border-color:
              #e7ba50;

            box-shadow:
              0 0 10px
              rgba(
                231,
                186,
                80,
                .35
              );
          }

          /* =============================================
             ACTIONS
          ============================================= */

          .scw-avatar-editor-actions {
            display: grid;

            grid-template-columns:
              1fr
              1fr
              1.35fr;

            gap: 7px;

            padding:
              0 12px 12px;
          }

          .scw-avatar-editor-actions button {
            min-height:
              40px;

            padding:
              7px;

            border-radius:
              9px;

            font-family:
              inherit;

            font-size:
              8px;

            font-weight:
              1000;

            letter-spacing:
              .3px;

            cursor:
              pointer;
          }

          .scw-avatar-action-secondary {
            border:
              1px solid
              #36414a;

            background:
              #121a20;

            color:
              #aab3ba;
          }

          .scw-avatar-action-save {
            border:
              1px solid
              #aa7e26;

            background:
              linear-gradient(
                135deg,
                #e0ad45,
                #9f6819
              );

            color:
              #171006;
          }

          @media (
            max-width: 430px
          ) {
            .scw-avatar-controls {
              grid-template-columns:
                1fr;
            }

            .scw-avatar-color-section {
              grid-column:
                auto;
            }

            .scw-avatar-editor-actions {
              grid-template-columns:
                1fr 1fr;
            }

            .scw-avatar-action-save {
              grid-column:
                1 / -1;
            }
          }
        `}
      </style>
    </div>
  );
}