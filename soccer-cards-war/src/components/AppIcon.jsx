import {
  useState,
} from "react";

/* =========================================================
   SOCCER CARDS WAR
   APP ICON / LOGO

   Kullanım:

   <AppIcon />

   <AppIcon
     size={80}
   />

   Gerçek ikon:
   public/icons/icon-512.png

   Dosya henüz yoksa oyun kırılmaz;
   SCW fallback logosu gösterilir.
========================================================= */

export default function AppIcon({
  size = 64,
  className = "",
  showGlow = true,
}) {
  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);

  const numericSize =
    Math.max(
      32,
      Number(size) || 64
    );

  const iconPath =
    `${import.meta.env.BASE_URL}` +
    "icons/icon-512.png";

  return (
    <div
      className={[
        "scw-app-icon",
        showGlow
          ? "scw-app-icon-glow"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--scw-icon-size":
          `${numericSize}px`,
      }}
    >
      {!imageFailed ? (
        <img
          src={iconPath}
          alt="Soccer Cards War"
          draggable="false"
          onError={() =>
            setImageFailed(
              true
            )
          }
        />
      ) : (
        <div className="scw-icon-fallback">
          <div className="scw-icon-fire">
            🔥
          </div>

          <div className="scw-icon-card">
            <div className="scw-icon-ball">
              ⚽
            </div>

            <div className="scw-icon-letters">
              SCW
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .scw-app-icon {
            position: relative;

            display: grid;
            place-items: center;

            width:
              var(
                --scw-icon-size
              );

            height:
              var(
                --scw-icon-size
              );

            flex:
              0 0 auto;

            border-radius:
              22%;

            overflow: visible;

            isolation: isolate;
          }

          .scw-app-icon img {
            position: relative;

            z-index: 3;

            display: block;

            width: 100%;
            height: 100%;

            object-fit: cover;

            border-radius:
              22%;

            user-select: none;

            -webkit-user-drag:
              none;
          }

          .scw-app-icon-glow::before {
            content: "";

            position: absolute;

            z-index: -1;

            left: 8%;
            right: 8%;
            top: 12%;
            bottom: -5%;

            border-radius:
              30%;

            background:
              radial-gradient(
                circle,
                rgba(
                  255,
                  171,
                  43,
                  .36
                ),
                rgba(
                  255,
                  77,
                  18,
                  .13
                ) 45%,
                transparent 72%
              );

            filter:
              blur(
                calc(
                  var(
                    --scw-icon-size
                  ) * .13
                )
              );
          }

          /* =============================================
             FALLBACK
          ============================================= */

          .scw-icon-fallback {
            position: relative;

            display: grid;
            place-items: center;

            width: 100%;
            height: 100%;

            overflow: hidden;

            border:
              calc(
                var(
                  --scw-icon-size
                ) * .025
              )
              solid
              #9e7226;

            border-radius:
              22%;

            background:
              radial-gradient(
                circle
                at
                50%
                28%,
                #26323a,
                #0c1217 55%,
                #040608
              );

            box-sizing:
              border-box;

            box-shadow:
              inset
              0 0
              calc(
                var(
                  --scw-icon-size
                ) * .16
              )
              rgba(
                255,
                255,
                255,
                .06
              );
          }

          .scw-icon-fire {
            position: absolute;

            z-index: 1;

            top: -3%;

            left: 50%;

            transform:
              translateX(-50%);

            font-size:
              calc(
                var(
                  --scw-icon-size
                ) * .54
              );

            filter:
              saturate(1.3);

            opacity: .92;
          }

          .scw-icon-card {
            position: relative;

            z-index: 3;

            display: flex;

            flex-direction:
              column;

            align-items: center;

            justify-content:
              center;

            width: 61%;
            height: 70%;

            margin-top: 9%;

            border:
              calc(
                var(
                  --scw-icon-size
                ) * .022
              )
              solid
              #e1b34c;

            border-radius:
              13%;

            background:
              linear-gradient(
                145deg,
                #1b242a,
                #080c0f
              );

            box-shadow:
              0 0
              calc(
                var(
                  --scw-icon-size
                ) * .15
              )
              rgba(
                228,
                177,
                67,
                .3
              );
          }

          .scw-icon-ball {
            font-size:
              calc(
                var(
                  --scw-icon-size
                ) * .25
              );

            line-height: 1;
          }

          .scw-icon-letters {
            margin-top:
              calc(
                var(
                  --scw-icon-size
                ) * .045
              );

            color: #e8b94f;

            font-size:
              calc(
                var(
                  --scw-icon-size
                ) * .13
              );

            font-weight: 1000;

            letter-spacing:
              calc(
                var(
                  --scw-icon-size
                ) * .012
              );

            text-shadow:
              0 0
              calc(
                var(
                  --scw-icon-size
                ) * .08
              )
              rgba(
                232,
                185,
                79,
                .45
              );
          }
        `}
      </style>
    </div>
  );
}