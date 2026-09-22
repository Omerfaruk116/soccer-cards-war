import {
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEY =
  "scw-welcome-seen-v1";

export default function WelcomeScreen({
  onEnter,
}) {
  const [leaving, setLeaving] =
    useState(false);

  const enteredRef =
    useRef(false);

  useEffect(() => {
    document.body.classList.add(
      "scw-welcome-active"
    );

    return () => {
      document.body.classList.remove(
        "scw-welcome-active"
      );
    };
  }, []);

  async function enterGame() {
    if (
      leaving ||
      enteredRef.current
    ) {
      return;
    }

    enteredRef.current = true;
    setLeaving(true);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        "1"
      );
    } catch {
      // localStorage çalışmasa da
      // oyuna giriş engellenmez.
    }

    /*
      ÖNEMLİ:
      onEnter gerçek kullanıcı tıklaması
      sırasında çağrılıyor.

      Böylece telefon / PWA tarafında
      Web Audio kilidi açılabilir.
    */
    try {
      await onEnter?.();
    } catch {
      /*
        Ses sistemi hata verse bile
        giriş ekranı kilitlenmez.
      */
    }
  }

  return (
    <div
      className={
        leaving
          ? "scw-welcome scw-welcome-leaving"
          : "scw-welcome"
      }
    >
      <div className="scw-welcome-bg" />

      <div className="scw-welcome-vignette" />

      <div className="scw-welcome-fire scw-fire-left" />
      <div className="scw-welcome-fire scw-fire-right" />

      <div className="scw-welcome-content">
        <div className="scw-welcome-logo">
          <div className="scw-welcome-logo-small">
            SCW
          </div>

          <h1>
            SOCCER
            <span>CARDS WAR</span>
          </h1>
        </div>

        <div className="scw-welcome-line" />

        <p className="scw-welcome-subtitle">
          KADRONU KUR • KARTLARINI GÜÇLENDİR •
          SAHAYA ÇIK
        </p>

        <button
          type="button"
          className="scw-enter-button"
          onClick={enterGame}
          disabled={leaving}
        >
          <span className="scw-enter-shine" />

          <span className="scw-enter-icon">
            ⚽
          </span>

          <span>
            OYUNA GİR
          </span>

          <span className="scw-enter-arrow">
            ›
          </span>
        </button>

        <div className="scw-welcome-hint">
          SOCCER CARDS WAR
        </div>
      </div>

      <style>
        {`
          body.scw-welcome-active {
            overflow: hidden;
          }

          .scw-welcome {
            position: fixed;
            inset: 0;
            z-index: 99999;

            display: flex;
            align-items: flex-end;
            justify-content: center;

            overflow: hidden;

            background:
              #050708;

            color: white;

            isolation: isolate;
          }

          .scw-welcome-bg {
            position: absolute;
            inset: -3%;

            z-index: -5;

            background-image:
              url("/soccer-cards-war/welcome-scw.webp");

            background-position:
              center center;

            background-repeat:
              no-repeat;

            background-size:
              cover;

            transform:
              scale(1.04);

            animation:
              scw-welcome-zoom
              8s
              ease-out
              forwards;
          }

          .scw-welcome-vignette {
            position: absolute;
            inset: 0;

            z-index: -4;

            background:
              linear-gradient(
                to bottom,
                rgba(0,0,0,.08) 0%,
                rgba(0,0,0,.03) 32%,
                rgba(0,0,0,.28) 62%,
                rgba(0,0,0,.88) 100%
              ),
              radial-gradient(
                circle at center,
                transparent 25%,
                rgba(0,0,0,.55) 100%
              );
          }

          .scw-welcome-content {
            width:
              min(
                92vw,
                560px
              );

            padding:
              24px
              18px
              max(
                38px,
                env(
                  safe-area-inset-bottom
                )
              );

            text-align: center;

            animation:
              scw-content-in
              .85s
              cubic-bezier(
                .2,
                .8,
                .2,
                1
              );
          }

          .scw-welcome-logo {
            text-shadow:
              0 4px 22px
              rgba(0,0,0,.9);
          }

          .scw-welcome-logo-small {
            display: inline-flex;
            align-items: center;
            justify-content: center;

            min-width: 58px;
            height: 27px;

            margin-bottom:
              7px;

            padding:
              0 10px;

            border:
              1px solid
              rgba(
                255,
                190,
                70,
                .75
              );

            border-radius:
              5px;

            background:
              rgba(
                10,
                10,
                10,
                .72
              );

            color:
              #f4c257;

            font-size:
              12px;

            font-weight:
              1000;

            letter-spacing:
              3px;

            box-shadow:
              0 0 20px
              rgba(
                235,
                158,
                35,
                .2
              );
          }

          .scw-welcome-logo h1 {
            margin: 0;

            font-size:
              clamp(
                31px,
                9vw,
                58px
              );

            font-weight:
              1000;

            line-height:
              .86;

            letter-spacing:
              -1.8px;
          }

          .scw-welcome-logo h1 span {
            display: block;

            margin-top:
              7px;

            color:
              #e8b94f;

            font-size:
              .72em;

            letter-spacing:
              3px;
          }

          .scw-welcome-line {
            width: 110px;
            height: 2px;

            margin:
              17px auto 12px;

            background:
              linear-gradient(
                90deg,
                transparent,
                #e6b54a,
                transparent
              );

            box-shadow:
              0 0 12px
              rgba(
                230,
                181,
                74,
                .7
              );
          }

          .scw-welcome-subtitle {
            margin:
              0 auto 20px;

            color:
              rgba(
                255,
                255,
                255,
                .68
              );

            font-size:
              9px;

            font-weight:
              900;

            letter-spacing:
              1.6px;
          }

          .scw-enter-button {
            position: relative;

            display: grid;

            grid-template-columns:
              30px
              1fr
              24px;

            align-items: center;

            width: 100%;

            min-height:
              58px;

            padding:
              0 17px;

            overflow: hidden;

            border:
              1px solid
              #c99230;

            border-radius:
              14px;

            background:
              linear-gradient(
                135deg,
                #e5b34b,
                #b87818
              );

            color:
              #171006;

            font-family:
              inherit;

            font-size:
              13px;

            font-weight:
              1000;

            letter-spacing:
              1.1px;

            cursor: pointer;

            box-shadow:
              0 12px 35px
              rgba(
                0,
                0,
                0,
                .45
              ),
              0 0 25px
              rgba(
                229,
                179,
                75,
                .22
              );

            transition:
              transform .15s ease,
              filter .15s ease;
          }

          .scw-enter-button:active {
            transform:
              scale(.975);
          }

          .scw-enter-button:hover {
            filter:
              brightness(1.08);
          }

          .scw-enter-button:disabled {
            cursor:
              default;
          }

          .scw-enter-icon {
            font-size:
              20px;
          }

          .scw-enter-arrow {
            font-size:
              28px;

            line-height:
              1;
          }

          .scw-enter-shine {
            position: absolute;

            top: -60%;
            left: -35%;

            width: 30%;
            height: 220%;

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(
                  255,
                  255,
                  255,
                  .42
                ),
                transparent
              );

            transform:
              rotate(18deg);

            animation:
              scw-button-shine
              3.2s
              ease-in-out
              infinite;
          }

          .scw-welcome-hint {
            margin-top:
              13px;

            color:
              rgba(
                255,
                255,
                255,
                .28
              );

            font-size:
              8px;

            font-weight:
              900;

            letter-spacing:
              3px;
          }

          .scw-welcome-fire {
            position: absolute;

            z-index: -3;

            bottom: -90px;

            width: 260px;
            height: 260px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  255,
                  153,
                  25,
                  .25
                ),
                rgba(
                  255,
                  80,
                  0,
                  .08
                ) 45%,
                transparent 70%
              );

            filter:
              blur(20px);

            animation:
              scw-fire-pulse
              2.5s
              ease-in-out
              infinite alternate;
          }

          .scw-fire-left {
            left: -100px;
          }

          .scw-fire-right {
            right: -100px;

            animation-delay:
              -1.2s;
          }

          .scw-welcome-leaving {
            animation:
              scw-welcome-out
              .7s
              ease
              forwards;

            pointer-events:
              none;
          }

          .scw-welcome-leaving
          .scw-welcome-bg {
            transform:
              scale(1.12);
          }

          @keyframes
          scw-content-in {
            from {
              opacity: 0;

              transform:
                translateY(
                  35px
                );
            }

            to {
              opacity: 1;

              transform:
                translateY(0);
            }
          }

          @keyframes
          scw-welcome-zoom {
            from {
              transform:
                scale(1.08);
            }

            to {
              transform:
                scale(1.02);
            }
          }

          @keyframes
          scw-button-shine {
            0%,
            60% {
              left: -40%;
            }

            100% {
              left: 125%;
            }
          }

          @keyframes
          scw-fire-pulse {
            from {
              opacity: .45;

              transform:
                scale(.85);
            }

            to {
              opacity: .95;

              transform:
                scale(1.15);
            }
          }

          @keyframes
          scw-welcome-out {
            0% {
              opacity: 1;
            }

            100% {
              opacity: 0;

              transform:
                scale(1.035);

              visibility:
                hidden;
            }
          }

          @media (
            min-width: 800px
          ) {
            .scw-welcome-content {
              padding-bottom:
                55px;
            }

            .scw-enter-button {
              min-height:
                62px;
            }
          }

          @media (
            max-height: 650px
          ) {
            .scw-welcome-content {
              padding-bottom:
                20px;
            }

            .scw-welcome-logo h1 {
              font-size:
                32px;
            }

            .scw-welcome-subtitle {
              margin-bottom:
                12px;
            }

            .scw-enter-button {
              min-height:
                50px;
            }
          }
        `}
      </style>
    </div>
  );
}

export function hasSeenWelcome() {
  try {
    return (
      localStorage.getItem(
        STORAGE_KEY
      ) === "1"
    );
  } catch {
    return false;
  }
}

export function resetWelcomeScreen() {
  try {
    localStorage.removeItem(
      STORAGE_KEY
    );
  } catch {
    // önemli değil
  }
}