import {
  useMemo,
  useState,
} from "react";

import {
  getBeardPath,
  getEyebrowsPath,
  getFacePath,
  getHairFilter,
  getHairPath,
  getMoustachePath,
  getSkinFilter,
  normalizePlayerAvatar,
} from "../utils/avatarSystem";

/* =========================================================
   SOCCER CARDS WAR
   PLAYER AVATAR

   Katman sırası:

   1. Arka plan
   2. Forma / omuz
   3. Base yüz
   4. Kaş
   5. Saç
   6. Sakal
   7. Bıyık
   8. Işık / gölge

   Görsel dosyalardan biri henüz yoksa
   component patlamaz.

   Assetler eklendikçe otomatik görünür.
========================================================= */

export default function PlayerAvatar({
  player,
  size = 96,
  className = "",
  showRating = false,
  showPosition = false,
}) {
  const avatar = useMemo(
    () =>
      normalizePlayerAvatar(
        player
      ),
    [
      player?.id,
      player?.avatar,
      player?.name,
      player?.country,
      player?.position,
    ]
  );

  const [failedLayers, setFailedLayers] =
    useState({});

  /* =======================================================
     PATHS
  ======================================================= */

  const paths = useMemo(
    () => ({
      face:
        getFacePath(
          avatar
        ),

      hair:
        getHairPath(
          avatar
        ),

      beard:
        getBeardPath(
          avatar
        ),

      moustache:
        getMoustachePath(
          avatar
        ),

      eyebrows:
        getEyebrowsPath(
          avatar
        ),
    }),
    [avatar]
  );

  const skinFilter =
    getSkinFilter(
      avatar
    );

  const hairFilter =
    getHairFilter(
      avatar
    );

  /* =======================================================
     PLAYER DATA
  ======================================================= */

  const playerName =
    player?.name ||
    "SCW Player";

  const position =
    player?.position ||
    player?.pos ||
    "";

  const overall =
    Number(
      player?.overall ??
        player?.rating ??
        player?.gen ??
        0
    );

  /* =======================================================
     IMAGE ERROR

     Henüz asset yoksa katmanı gizler.
     Böylece oyun kırılmaz.
  ======================================================= */

  function failLayer(
    layer
  ) {
    setFailedLayers(
      (current) => ({
        ...current,
        [layer]: true,
      })
    );
  }

  /* =======================================================
     FALLBACK FACE

     Base yüz görseli henüz eklenmediyse
     emoji kullanmıyoruz.

     SCW tarzında sade insan silüeti
     CSS ile çiziliyor.
  ======================================================= */

  const faceFailed =
    failedLayers.face;

  /* =======================================================
     SIZE
  ======================================================= */

  const numericSize =
    Math.max(
      40,
      Number(size) ||
        96
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={[
        "scw-player-avatar",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--scw-avatar-size":
          `${numericSize}px`,

        "--scw-shirt-color":
          avatar.shirtColor ||
          "#174a8b",
      }}
      title={
        playerName
      }
    >
      {/* ================================================
          BACKGROUND
      ================================================= */}

      <div className="scw-avatar-background">
        <div className="scw-avatar-background-glow" />
      </div>

      {/* ================================================
          SHOULDERS / SHIRT
      ================================================= */}

      <div className="scw-avatar-body">
        <div className="scw-avatar-neck" />

        <div className="scw-avatar-shirt">
          <div className="scw-avatar-shirt-light" />

          <div className="scw-avatar-shirt-collar" />
        </div>
      </div>

      {/* ================================================
          FACE
      ================================================= */}

      {!faceFailed ? (
        <img
          className="scw-avatar-layer scw-avatar-face"
          src={
            paths.face
          }
          alt=""
          draggable="false"
          onError={() =>
            failLayer(
              "face"
            )
          }
          style={{
            filter:
              skinFilter,
          }}
        />
      ) : (
        <div className="scw-avatar-fallback-head">
          <div className="scw-avatar-fallback-ear scw-avatar-fallback-ear-left" />

          <div className="scw-avatar-fallback-ear scw-avatar-fallback-ear-right" />

          <div className="scw-avatar-fallback-face">
            <div className="scw-avatar-fallback-brow scw-avatar-fallback-brow-left" />

            <div className="scw-avatar-fallback-brow scw-avatar-fallback-brow-right" />

            <div className="scw-avatar-fallback-eye scw-avatar-fallback-eye-left" />

            <div className="scw-avatar-fallback-eye scw-avatar-fallback-eye-right" />

            <div className="scw-avatar-fallback-nose" />

            <div className="scw-avatar-fallback-mouth" />
          </div>
        </div>
      )}

      {/* ================================================
          EYEBROWS
      ================================================= */}

      {paths.eyebrows &&
        !failedLayers.eyebrows &&
        !faceFailed && (
          <img
            className="scw-avatar-layer scw-avatar-eyebrows"
            src={
              paths.eyebrows
            }
            alt=""
            draggable="false"
            onError={() =>
              failLayer(
                "eyebrows"
              )
            }
            style={{
              filter:
                hairFilter,
            }}
          />
        )}

      {/* ================================================
          HAIR
      ================================================= */}

      {paths.hair &&
        !failedLayers.hair &&
        !faceFailed && (
          <img
            className="scw-avatar-layer scw-avatar-hair"
            src={
              paths.hair
            }
            alt=""
            draggable="false"
            onError={() =>
              failLayer(
                "hair"
              )
            }
            style={{
              filter:
                hairFilter,
            }}
          />
        )}

      {/* ================================================
          BEARD
      ================================================= */}

      {paths.beard &&
        !failedLayers.beard &&
        !faceFailed && (
          <img
            className="scw-avatar-layer scw-avatar-beard"
            src={
              paths.beard
            }
            alt=""
            draggable="false"
            onError={() =>
              failLayer(
                "beard"
              )
            }
            style={{
              filter:
                hairFilter,
            }}
          />
        )}

      {/* ================================================
          MOUSTACHE
      ================================================= */}

      {paths.moustache &&
        !failedLayers.moustache &&
        !faceFailed && (
          <img
            className="scw-avatar-layer scw-avatar-moustache"
            src={
              paths.moustache
            }
            alt=""
            draggable="false"
            onError={() =>
              failLayer(
                "moustache"
              )
            }
            style={{
              filter:
                hairFilter,
            }}
          />
        )}

      {/* ================================================
          CINEMATIC LIGHT
      ================================================= */}

      <div className="scw-avatar-light" />

      <div className="scw-avatar-vignette" />

      {/* ================================================
          OPTIONAL POSITION
      ================================================= */}

      {showPosition &&
        position && (
          <div className="scw-avatar-position">
            {position}
          </div>
        )}

      {/* ================================================
          OPTIONAL RATING
      ================================================= */}

      {showRating &&
        overall >
          0 && (
          <div className="scw-avatar-rating">
            {overall}
          </div>
        )}

      {/* ================================================
          CSS
      ================================================= */}

      <style>
        {`
          .scw-player-avatar {
            position: relative;

            width:
              var(
                --scw-avatar-size
              );

            height:
              var(
                --scw-avatar-size
              );

            flex:
              0 0 auto;

            overflow: hidden;

            border:
              calc(
                var(
                  --scw-avatar-size
                ) * .025
              )
              solid
              rgba(
                210,
                169,
                74,
                .72
              );

            border-radius:
              50%;

            background:
              #111820;

            box-sizing:
              border-box;

            box-shadow:
              inset
              0 0
              calc(
                var(
                  --scw-avatar-size
                ) * .15
              )
              rgba(
                255,
                255,
                255,
                .05
              ),
              0
              calc(
                var(
                  --scw-avatar-size
                ) * .05
              )
              calc(
                var(
                  --scw-avatar-size
                ) * .14
              )
              rgba(
                0,
                0,
                0,
                .35
              );

            isolation:
              isolate;

            user-select:
              none;
          }

          .scw-avatar-background {
            position: absolute;
            inset: 0;

            z-index: 0;

            background:
              radial-gradient(
                circle
                at
                50%
                33%,
                #344552
                0%,
                #18232b
                42%,
                #080d11
                100%
              );
          }

          .scw-avatar-background-glow {
            position: absolute;

            left: 50%;
            top: 15%;

            width: 75%;
            height: 75%;

            transform:
              translateX(-50%);

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  229,
                  183,
                  76,
                  .13
                ),
                transparent
                68%
              );
          }

          /* =================================================
             BODY
          ================================================= */

          .scw-avatar-body {
            position: absolute;

            z-index: 1;

            left: 0;
            right: 0;
            bottom: 0;

            height: 48%;
          }

          .scw-avatar-neck {
            position: absolute;

            z-index: 1;

            left: 50%;
            top: -14%;

            width: 23%;
            height: 45%;

            transform:
              translateX(-50%);

            border-radius:
              20% 20% 35% 35%;

            background:
              linear-gradient(
                90deg,
                #9d6a4d,
                #d79c77 48%,
                #9c684c
              );
          }

          .scw-avatar-shirt {
            position: absolute;

            z-index: 2;

            left: 50%;
            bottom: -18%;

            width: 105%;
            height: 92%;

            transform:
              translateX(-50%);

            border-radius:
              50%
              50%
              18%
              18%;

            background:
              linear-gradient(
                120deg,
                rgba(
                  0,
                  0,
                  0,
                  .35
                ),
                transparent
                35%
              ),
              var(
                --scw-shirt-color
              );
          }

          .scw-avatar-shirt-light {
            position: absolute;

            left: 15%;
            top: 8%;

            width: 28%;
            height: 60%;

            transform:
              rotate(-12deg);

            background:
              linear-gradient(
                90deg,
                rgba(
                  255,
                  255,
                  255,
                  .14
                ),
                transparent
              );

            filter:
              blur(
                calc(
                  var(
                    --scw-avatar-size
                  ) * .02
                )
              );
          }

          .scw-avatar-shirt-collar {
            position: absolute;

            left: 50%;
            top: -1%;

            width: 31%;
            height: 20%;

            transform:
              translateX(-50%);

            border:
              calc(
                var(
                  --scw-avatar-size
                ) * .025
              )
              solid
              rgba(
                10,
                10,
                10,
                .55
              );

            border-top:
              0;

            border-radius:
              0
              0
              50%
              50%;
          }

          /* =================================================
             IMAGE LAYERS
          ================================================= */

          .scw-avatar-layer {
            position: absolute;

            z-index: 10;

            left: 0;
            top: 0;

            width: 100%;
            height: 100%;

            object-fit:
              contain;

            pointer-events:
              none;

            user-select:
              none;
          }

          .scw-avatar-face {
            z-index: 10;
          }

          .scw-avatar-eyebrows {
            z-index: 13;
          }

          .scw-avatar-hair {
            z-index: 15;
          }

          .scw-avatar-beard {
            z-index: 16;
          }

          .scw-avatar-moustache {
            z-index: 17;
          }

          /* =================================================
             FALLBACK HEAD
          ================================================= */

          .scw-avatar-fallback-head {
            position: absolute;

            z-index: 10;

            left: 50%;
            top: 11%;

            width: 52%;
            height: 61%;

            transform:
              translateX(-50%);
          }

          .scw-avatar-fallback-face {
            position: absolute;

            z-index: 2;

            inset: 0;

            border-radius:
              46%
              46%
              43%
              43%
              /
              40%
              40%
              56%
              56%;

            background:
              linear-gradient(
                105deg,
                #9e684b
                0%,
                #d79b75
                33%,
                #e0a780
                55%,
                #a76e50
                100%
              );

            box-shadow:
              inset
              calc(
                var(
                  --scw-avatar-size
                ) * -.04
              )
              0
              calc(
                var(
                  --scw-avatar-size
                ) * .08
              )
              rgba(
                0,
                0,
                0,
                .18
              );
          }

          .scw-avatar-fallback-ear {
            position: absolute;

            z-index: 1;

            top: 41%;

            width: 15%;
            height: 22%;

            border-radius:
              50%;

            background:
              #bb7d5d;
          }

          .scw-avatar-fallback-ear-left {
            left: -8%;
          }

          .scw-avatar-fallback-ear-right {
            right: -8%;
          }

          .scw-avatar-fallback-eye {
            position: absolute;

            top: 41%;

            width: 8%;
            height: 5%;

            border-radius:
              50%;

            background:
              #1c1715;

            box-shadow:
              0
              0
              calc(
                var(
                  --scw-avatar-size
                ) * .012
              )
              rgba(
                255,
                255,
                255,
                .35
              );
          }

          .scw-avatar-fallback-eye-left {
            left: 25%;
          }

          .scw-avatar-fallback-eye-right {
            right: 25%;
          }

          .scw-avatar-fallback-brow {
            position: absolute;

            top: 33%;

            width: 22%;
            height: 5%;

            border-radius:
              999px;

            background:
              #3d2b22;
          }

          .scw-avatar-fallback-brow-left {
            left: 18%;

            transform:
              rotate(-5deg);
          }

          .scw-avatar-fallback-brow-right {
            right: 18%;

            transform:
              rotate(5deg);
          }

          .scw-avatar-fallback-nose {
            position: absolute;

            left: 50%;
            top: 44%;

            width: 10%;
            height: 24%;

            transform:
              translateX(-50%);

            border-right:
              calc(
                var(
                  --scw-avatar-size
                ) * .012
              )
              solid
              rgba(
                92,
                53,
                39,
                .5
              );

            border-bottom:
              calc(
                var(
                  --scw-avatar-size
                ) * .012
              )
              solid
              rgba(
                92,
                53,
                39,
                .4
              );

            border-radius:
              0 0 60% 0;
          }

          .scw-avatar-fallback-mouth {
            position: absolute;

            left: 50%;
            bottom: 17%;

            width: 27%;
            height: 5%;

            transform:
              translateX(-50%);

            border-bottom:
              calc(
                var(
                  --scw-avatar-size
                ) * .012
              )
              solid
              rgba(
                95,
                44,
                38,
                .72
              );

            border-radius:
              50%;
          }

          /* =================================================
             CINEMATIC LIGHTING
          ================================================= */

          .scw-avatar-light {
            position: absolute;

            z-index: 30;

            inset: 0;

            pointer-events:
              none;

            border-radius:
              50%;

            background:
              linear-gradient(
                125deg,
                rgba(
                  255,
                  255,
                  255,
                  .12
                ),
                transparent
                28%,
                transparent
                72%,
                rgba(
                  0,
                  0,
                  0,
                  .28
                )
              );
          }

          .scw-avatar-vignette {
            position: absolute;

            z-index: 31;

            inset: 0;

            pointer-events:
              none;

            border-radius:
              50%;

            box-shadow:
              inset
              0
              0
              calc(
                var(
                  --scw-avatar-size
                ) * .18
              )
              rgba(
                0,
                0,
                0,
                .58
              );
          }

          /* =================================================
             POSITION
          ================================================= */

          .scw-avatar-position {
            position: absolute;

            z-index: 50;

            left: 6%;
            bottom: 7%;

            display: grid;

            place-items:
              center;

            min-width: 22%;

            height: 18%;

            padding:
              0 4%;

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                .2
              );

            border-radius:
              999px;

            background:
              rgba(
                5,
                8,
                11,
                .82
              );

            color:
              #e8edf0;

            box-sizing:
              border-box;

            font-size:
              calc(
                var(
                  --scw-avatar-size
                ) * .085
              );

            font-weight:
              1000;
          }

          /* =================================================
             RATING
          ================================================= */

          .scw-avatar-rating {
            position: absolute;

            z-index: 50;

            right: 5%;
            top: 6%;

            display: grid;

            place-items:
              center;

            width: 27%;
            aspect-ratio: 1;

            border:
              1px solid
              rgba(
                239,
                194,
                84,
                .65
              );

            border-radius:
              50%;

            background:
              linear-gradient(
                145deg,
                #2b210b,
                #0e0c08
              );

            color:
              #efc254;

            box-shadow:
              0 2px 8px
              rgba(
                0,
                0,
                0,
                .5
              );

            font-size:
              calc(
                var(
                  --scw-avatar-size
                ) * .105
              );

            font-weight:
              1000;
          }
        `}
      </style>
    </div>
  );
}