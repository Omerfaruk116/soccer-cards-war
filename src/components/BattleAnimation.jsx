import {
  useEffect,
  useRef,
  useState,
} from "react";

import PlayerCard from "./PlayerCard";

import {
  playSfx,
  unlockAudio,
} from "../utils/soundSystem";

/* =========================================================
   SCW BATTLE ANIMATION

   AKIŞ:
   1. İki kart sahaya girer
   2. Kartlar birbirine fırlar
   3. Çarpışma + ekran sarsıntısı
   4. Sonuç belirir
   5. Kaybeden yanar / parçalanır
   6. Kazanan ortada kalır
   7. Animasyon tamamlanır

   winner:
   "player"
   "opponent"
   "draw"
========================================================= */

const ENTER_TIME = 650;
const IMPACT_TIME = 1250;
const RESULT_TIME = 1750;
const DESTROY_TIME = 2200;
const COMPLETE_TIME = 3000;

/* =========================================================
   PARTICLES
========================================================= */

const PARTICLES = Array.from(
  {
    length: 28,
  },
  (_, index) => {
    const angle =
      (360 / 28) *
      index;

    const distance =
      70 +
      ((index * 17) % 90);

    const size =
      3 +
      ((index * 7) % 6);

    const delay =
      (index % 7) *
      0.025;

    return {
      id: index,
      angle,
      distance,
      size,
      delay,
    };
  }
);

/* =========================================================
   COMPONENT
========================================================= */

export default function BattleAnimation({
  player,
  opponent,
  winner,
  onComplete,
}) {
  const [phase, setPhase] =
    useState("prepare");

  const [impact, setImpact] =
    useState(false);

  const [destroying, setDestroying] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const soundPlayed =
    useRef({
      whistle: false,
      impact: false,
      result: false,
      burn: false,
    });

  const completeCalled =
    useRef(false);

  /* =======================================================
     ANIMATION TIMELINE
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    unlockAudio();

    if (
      !soundPlayed.current
        .whistle
    ) {
      soundPlayed.current.whistle =
        true;

      playSfx(
        "match-start"
      );
    }

    const enterTimer =
      window.setTimeout(
        () => {
          if (!mounted) {
            return;
          }

          setPhase(
            "enter"
          );
        },
        80
      );

    const impactTimer =
      window.setTimeout(
        () => {
          if (!mounted) {
            return;
          }

          setPhase(
            "impact"
          );

          setImpact(
            true
          );

          if (
            !soundPlayed.current
              .impact
          ) {
            soundPlayed.current.impact =
              true;

            playSfx(
              "battle-impact"
            );
          }
        },
        IMPACT_TIME
      );

    const resultTimer =
      window.setTimeout(
        () => {
          if (!mounted) {
            return;
          }

          setPhase(
            "result"
          );

          if (
            !soundPlayed.current
              .result
          ) {
            soundPlayed.current.result =
              true;

            if (
              winner ===
              "player"
            ) {
              playSfx(
                "win"
              );
            } else if (
              winner ===
              "opponent"
            ) {
              playSfx(
                "loss"
              );
            } else {
              playSfx(
                "card"
              );
            }
          }
        },
        RESULT_TIME
      );

    const destroyTimer =
      window.setTimeout(
        () => {
          if (!mounted) {
            return;
          }

          setPhase(
            "destroy"
          );

          if (
            winner !==
            "draw"
          ) {
            setDestroying(
              true
            );

            if (
              !soundPlayed.current
                .burn
            ) {
              soundPlayed.current.burn =
                true;

              playSfx(
                "burn"
              );
            }
          }
        },
        DESTROY_TIME
      );

    const finishTimer =
      window.setTimeout(
        () => {
          if (!mounted) {
            return;
          }

          setPhase(
            "complete"
          );

          setFinished(
            true
          );

          if (
            !completeCalled.current
          ) {
            completeCalled.current =
              true;

            onComplete?.();
          }
        },
        COMPLETE_TIME
      );

    return () => {
      mounted = false;

      window.clearTimeout(
        enterTimer
      );

      window.clearTimeout(
        impactTimer
      );

      window.clearTimeout(
        resultTimer
      );

      window.clearTimeout(
        destroyTimer
      );

      window.clearTimeout(
        finishTimer
      );
    };
  }, [
    winner,
    onComplete,
  ]);

  /* =======================================================
     WINNER STATE
  ======================================================= */

  const playerWon =
    winner ===
    "player";

  const opponentWon =
    winner ===
    "opponent";

  const draw =
    winner ===
    "draw";

  const playerLoses =
    destroying &&
    opponentWon;

  const opponentLoses =
    destroying &&
    playerWon;

  /* =======================================================
     RESULT TEXT
  ======================================================= */

  let resultTitle =
    "BERABERE";

  let resultClass =
    "scw-battle-draw";

  if (playerWon) {
    resultTitle =
      "KAZANDIN";

    resultClass =
      "scw-battle-win";
  }

  if (opponentWon) {
    resultTitle =
      "KAYBETTİN";

    resultClass =
      "scw-battle-loss";
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={[
        "scw-battle-animation",
        `scw-battle-phase-${phase}`,
        impact
          ? "scw-battle-impact-active"
          : "",
        finished
          ? "scw-battle-finished"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ================================================
          BACKGROUND
      ================================================= */}

      <div className="scw-battle-backdrop" />

      <div className="scw-battle-glow scw-battle-glow-left" />

      <div className="scw-battle-glow scw-battle-glow-right" />

      {/* ================================================
          TITLE
      ================================================= */}

      <div className="scw-battle-top">
        <span>
          KART SAVAŞI
        </span>
      </div>

      {/* ================================================
          CARDS
      ================================================= */}

      <div className="scw-battle-arena">
        <div
          className={[
            "scw-battle-card",
            "scw-battle-player-card",

            playerWon &&
            phase ===
              "destroy"
              ? "scw-battle-winner-card"
              : "",

            playerLoses
              ? "scw-battle-loser-card"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="scw-battle-card-owner">
            SEN
          </div>

          <PlayerCard
            player={
              player
            }
          />

          {playerLoses && (
            <>
              <div className="scw-card-fire" />

              <div className="scw-card-ash" />
            </>
          )}
        </div>

        {/* ==============================================
            CENTER IMPACT
        =============================================== */}

        <div className="scw-battle-center">
          <div className="scw-battle-vs-mark">
            VS
          </div>

          {impact && (
            <>
              <div className="scw-impact-flash" />

              <div className="scw-impact-ring" />

              <div className="scw-impact-ring scw-impact-ring-two" />

              <div className="scw-impact-core">
                💥
              </div>

              <div className="scw-particles">
                {PARTICLES.map(
                  (
                    particle
                  ) => (
                    <span
                      key={
                        particle.id
                      }
                      className="scw-particle"
                      style={{
                        "--particle-angle":
                          `${particle.angle}deg`,

                        "--particle-distance":
                          `${particle.distance}px`,

                        "--particle-size":
                          `${particle.size}px`,

                        "--particle-delay":
                          `${particle.delay}s`,
                      }}
                    />
                  )
                )}
              </div>
            </>
          )}
        </div>

        <div
          className={[
            "scw-battle-card",
            "scw-battle-opponent-card",

            opponentWon &&
            phase ===
              "destroy"
              ? "scw-battle-winner-card"
              : "",

            opponentLoses
              ? "scw-battle-loser-card"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="scw-battle-card-owner">
            RAKİP
          </div>

          <PlayerCard
            player={
              opponent
            }
          />

          {opponentLoses && (
            <>
              <div className="scw-card-fire" />

              <div className="scw-card-ash" />
            </>
          )}
        </div>
      </div>

      {/* ================================================
          RESULT
      ================================================= */}

      {(phase ===
        "result" ||
        phase ===
          "destroy" ||
        phase ===
          "complete") && (
        <div
          className={[
            "scw-battle-result",
            resultClass,
          ].join(" ")}
        >
          <div className="scw-battle-result-small">
            {draw
              ? "GÜÇLER EŞİT"
              : playerWon
                ? "RAKİP KART YOK EDİLDİ"
                : "KARTIN YOK EDİLDİ"}
          </div>

          <div className="scw-battle-result-title">
            {resultTitle}
          </div>

          {!draw && (
            <div className="scw-battle-result-fire">
              🔥
            </div>
          )}
        </div>
      )}

      {/* ================================================
          INLINE CSS
      ================================================= */}

      <style>
        {`
          .scw-battle-animation {
            position: fixed;
            inset: 0;

            z-index: 99990;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            overflow: hidden;

            background: #05080b;

            color: #fff;

            isolation: isolate;
          }

          .scw-battle-backdrop {
            position: absolute;
            inset: 0;

            z-index: -10;

            background:
              radial-gradient(
                circle at center,
                rgba(218,165,55,.11),
                transparent 35%
              ),
              linear-gradient(
                145deg,
                #11171d,
                #050708 65%
              );
          }

          .scw-battle-glow {
            position: absolute;

            z-index: -8;

            top: 50%;

            width: 420px;
            height: 420px;

            border-radius: 50%;

            filter: blur(70px);

            opacity: .16;
          }

          .scw-battle-glow-left {
            left: -250px;

            background:
              #e4b34d;
          }

          .scw-battle-glow-right {
            right: -250px;

            background:
              #d65336;
          }

          .scw-battle-top {
            position: absolute;

            top:
              max(
                20px,
                env(
                  safe-area-inset-top
                )
              );

            left: 50%;

            transform:
              translateX(-50%);

            color:
              rgba(
                255,
                255,
                255,
                .5
              );

            font-size: 10px;
            font-weight: 1000;

            letter-spacing: 4px;
          }

          .scw-battle-arena {
            position: relative;

            display: grid;

            grid-template-columns:
              minmax(0, 220px)
              80px
              minmax(0, 220px);

            align-items: center;

            gap: 15px;

            width:
              min(
                94vw,
                650px
              );
          }

          .scw-battle-card {
            position: relative;

            opacity: 0;

            transition:
              filter .35s ease;
          }

          .scw-battle-player-card {
            transform:
              translateX(-120vw)
              rotate(-18deg);
          }

          .scw-battle-opponent-card {
            transform:
              translateX(120vw)
              rotate(18deg);
          }

          .scw-battle-phase-enter
          .scw-battle-player-card,
          .scw-battle-phase-impact
          .scw-battle-player-card,
          .scw-battle-phase-result
          .scw-battle-player-card,
          .scw-battle-phase-destroy
          .scw-battle-player-card {
            opacity: 1;

            animation:
              scw-player-enter
              ${ENTER_TIME}ms
              cubic-bezier(
                .2,
                .9,
                .3,
                1
              )
              forwards;
          }

          .scw-battle-phase-enter
          .scw-battle-opponent-card,
          .scw-battle-phase-impact
          .scw-battle-opponent-card,
          .scw-battle-phase-result
          .scw-battle-opponent-card,
          .scw-battle-phase-destroy
          .scw-battle-opponent-card {
            opacity: 1;

            animation:
              scw-opponent-enter
              ${ENTER_TIME}ms
              cubic-bezier(
                .2,
                .9,
                .3,
                1
              )
              forwards;
          }

          .scw-battle-phase-impact
          .scw-battle-player-card {
            animation:
              scw-player-impact
              .25s
              ease-out
              forwards;
          }

          .scw-battle-phase-impact
          .scw-battle-opponent-card {
            animation:
              scw-opponent-impact
              .25s
              ease-out
              forwards;
          }

          .scw-battle-card-owner {
            margin-bottom: 7px;

            text-align: center;

            color:
              rgba(
                255,
                255,
                255,
                .5
              );

            font-size: 9px;
            font-weight: 1000;

            letter-spacing: 2px;
          }

          .scw-battle-center {
            position: relative;

            display: grid;
            place-items: center;

            width: 80px;
            height: 120px;
          }

          .scw-battle-vs-mark {
            position: relative;

            z-index: 2;

            color: #d9aa46;

            font-size: 22px;
            font-weight: 1000;

            font-style: italic;

            text-shadow:
              0 0 18px
              rgba(
                218,
                169,
                70,
                .35
              );
          }

          .scw-battle-phase-impact
          .scw-battle-vs-mark,
          .scw-battle-phase-result
          .scw-battle-vs-mark,
          .scw-battle-phase-destroy
          .scw-battle-vs-mark {
            opacity: 0;
          }

          .scw-impact-flash {
            position: absolute;

            z-index: 20;

            width: 25px;
            height: 25px;

            border-radius: 50%;

            background: #fff;

            box-shadow:
              0 0 20px #fff,
              0 0 45px #ffcc57,
              0 0 90px #ff7628;

            animation:
              scw-impact-flash
              .45s
              ease-out
              forwards;
          }

          .scw-impact-core {
            position: absolute;

            z-index: 22;

            font-size: 46px;

            animation:
              scw-impact-core
              .55s
              ease-out
              forwards;
          }

          .scw-impact-ring {
            position: absolute;

            z-index: 18;

            width: 30px;
            height: 30px;

            border:
              3px solid
              rgba(
                255,
                200,
                77,
                .95
              );

            border-radius: 50%;

            animation:
              scw-impact-ring
              .7s
              ease-out
              forwards;
          }

          .scw-impact-ring-two {
            animation-delay:
              .08s;
          }

          .scw-particles {
            position: absolute;

            z-index: 25;

            left: 50%;
            top: 50%;

            width: 1px;
            height: 1px;
          }

          .scw-particle {
            position: absolute;

            left: 0;
            top: 0;

            width:
              var(
                --particle-size
              );

            height:
              var(
                --particle-size
              );

            border-radius:
              50%;

            background:
              #ffc44c;

            box-shadow:
              0 0 8px
              #ff7b28;

            opacity: 0;

            transform:
              rotate(
                var(
                  --particle-angle
                )
              )
              translateX(0);

            animation:
              scw-particle-fly
              .75s
              var(
                --particle-delay
              )
              ease-out
              forwards;
          }

          .scw-battle-impact-active {
            animation:
              scw-screen-shake
              .34s
              ease-out;
          }

          .scw-battle-result {
            position: absolute;

            left: 50%;
            bottom:
              max(
                42px,
                env(
                  safe-area-inset-bottom
                )
              );

            z-index: 100;

            width:
              min(
                90vw,
                430px
              );

            transform:
              translateX(-50%);

            text-align: center;

            animation:
              scw-result-in
              .38s
              cubic-bezier(
                .2,
                1.2,
                .3,
                1
              );
          }

          .scw-battle-result-small {
            margin-bottom: 5px;

            color:
              rgba(
                255,
                255,
                255,
                .55
              );

            font-size: 8px;
            font-weight: 1000;

            letter-spacing: 2px;
          }

          .scw-battle-result-title {
            font-size:
              clamp(
                31px,
                8vw,
                54px
              );

            font-weight: 1000;

            line-height: 1;

            letter-spacing: 1px;

            text-shadow:
              0 5px 30px
              rgba(
                0,
                0,
                0,
                .7
              );
          }

          .scw-battle-win
          .scw-battle-result-title {
            color: #59e99b;
          }

          .scw-battle-loss
          .scw-battle-result-title {
            color: #ff6e64;
          }

          .scw-battle-draw
          .scw-battle-result-title {
            color: #e6bb57;
          }

          .scw-battle-result-fire {
            margin-top: 5px;

            font-size: 23px;
          }

          .scw-battle-winner-card {
            z-index: 30;

            animation:
              scw-winner
              .55s
              ease
              forwards !important;
          }

          .scw-battle-loser-card {
            z-index: 10;

            animation:
              scw-loser
              .8s
              ease-in
              forwards !important;
          }

          .scw-card-fire {
            position: absolute;

            z-index: 40;

            inset: 5%;

            pointer-events: none;

            border-radius: 16px;

            background:
              radial-gradient(
                ellipse at bottom,
                rgba(
                  255,
                  220,
                  70,
                  .95
                ),
                rgba(
                  255,
                  94,
                  20,
                  .8
                ) 28%,
                rgba(
                  180,
                  25,
                  0,
                  .35
                ) 53%,
                transparent 70%
              );

            mix-blend-mode:
              screen;

            animation:
              scw-fire-burn
              .75s
              ease-in
              forwards;
          }

          .scw-card-ash {
            position: absolute;

            z-index: 45;

            inset: 0;

            pointer-events: none;

            background:
              repeating-linear-gradient(
                115deg,
                transparent 0 8px,
                rgba(
                  0,
                  0,
                  0,
                  .72
                ) 9px 13px
              );

            opacity: 0;

            animation:
              scw-ash
              .75s
              ease-in
              forwards;
          }

          @keyframes scw-player-enter {
            from {
              opacity: 0;

              transform:
                translateX(
                  -120vw
                )
                rotate(-18deg)
                scale(.85);
            }

            to {
              opacity: 1;

              transform:
                translateX(0)
                rotate(0)
                scale(1);
            }
          }

          @keyframes scw-opponent-enter {
            from {
              opacity: 0;

              transform:
                translateX(
                  120vw
                )
                rotate(18deg)
                scale(.85);
            }

            to {
              opacity: 1;

              transform:
                translateX(0)
                rotate(0)
                scale(1);
            }
          }

          @keyframes scw-player-impact {
            0% {
              opacity: 1;

              transform:
                translateX(0);
            }

            55% {
              opacity: 1;

              transform:
                translateX(42px)
                scale(1.04);
            }

            100% {
              opacity: 1;

              transform:
                translateX(0);
            }
          }

          @keyframes scw-opponent-impact {
            0% {
              opacity: 1;

              transform:
                translateX(0);
            }

            55% {
              opacity: 1;

              transform:
                translateX(-42px)
                scale(1.04);
            }

            100% {
              opacity: 1;

              transform:
                translateX(0);
            }
          }

          @keyframes scw-impact-flash {
            0% {
              opacity: 1;

              transform:
                scale(.3);
            }

            100% {
              opacity: 0;

              transform:
                scale(8);
            }
          }

          @keyframes scw-impact-core {
            0% {
              opacity: 0;

              transform:
                scale(.2);
            }

            35% {
              opacity: 1;

              transform:
                scale(1.35);
            }

            100% {
              opacity: 0;

              transform:
                scale(2.2);
            }
          }

          @keyframes scw-impact-ring {
            from {
              opacity: 1;

              transform:
                scale(.2);
            }

            to {
              opacity: 0;

              transform:
                scale(7);
            }
          }

          @keyframes scw-particle-fly {
            0% {
              opacity: 1;

              transform:
                rotate(
                  var(
                    --particle-angle
                  )
                )
                translateX(0)
                scale(1);
            }

            100% {
              opacity: 0;

              transform:
                rotate(
                  var(
                    --particle-angle
                  )
                )
                translateX(
                  var(
                    --particle-distance
                  )
                )
                scale(.1);
            }
          }

          @keyframes scw-screen-shake {
            0% {
              transform:
                translate(0);
            }

            15% {
              transform:
                translate(
                  -8px,
                  5px
                );
            }

            30% {
              transform:
                translate(
                  8px,
                  -5px
                );
            }

            45% {
              transform:
                translate(
                  -6px,
                  -3px
                );
            }

            60% {
              transform:
                translate(
                  6px,
                  4px
                );
            }

            75% {
              transform:
                translate(
                  -3px,
                  2px
                );
            }

            100% {
              transform:
                translate(0);
            }
          }

          @keyframes scw-result-in {
            from {
              opacity: 0;

              transform:
                translateX(-50%)
                translateY(20px)
                scale(.75);
            }

            to {
              opacity: 1;

              transform:
                translateX(-50%)
                translateY(0)
                scale(1);
            }
          }

          @keyframes scw-loser {
            0% {
              opacity: 1;

              filter:
                brightness(1);
            }

            25% {
              opacity: 1;

              filter:
                brightness(1.7)
                sepia(1);
            }

            65% {
              opacity: .6;

              transform:
                scale(.94)
                rotate(3deg);

              filter:
                brightness(.55)
                grayscale(.8);
            }

            100% {
              opacity: 0;

              transform:
                scale(.68)
                translateY(50px)
                rotate(8deg);

              filter:
                brightness(.1)
                grayscale(1)
                blur(4px);
            }
          }

          @keyframes scw-winner {
            0% {
              transform:
                scale(1);
            }

            100% {
              transform:
                scale(1.09);

              filter:
                drop-shadow(
                  0 0 22px
                  rgba(
                    237,
                    190,
                    79,
                    .45
                  )
                );
            }
          }

          @keyframes scw-fire-burn {
            0% {
              opacity: 0;

              transform:
                scaleY(.2)
                translateY(50%);
            }

            35% {
              opacity: 1;
            }

            100% {
              opacity: 0;

              transform:
                scaleY(1.25)
                translateY(-20%);
            }
          }

          @keyframes scw-ash {
            0% {
              opacity: 0;
            }

            35% {
              opacity: .35;
            }

            100% {
              opacity: 0;
            }
          }

          @media (
            max-width: 600px
          ) {
            .scw-battle-arena {
              grid-template-columns:
                minmax(0, 1fr)
                42px
                minmax(0, 1fr);

              gap: 5px;

              width: 96vw;
            }

            .scw-battle-center {
              width: 42px;
            }

            .scw-battle-vs-mark {
              font-size: 17px;
            }

            .scw-battle-card-owner {
              font-size: 7px;

              letter-spacing: 1px;
            }

            .scw-impact-core {
              font-size: 34px;
            }
          }

          @media (
            max-height: 620px
          ) {
            .scw-battle-arena {
              transform:
                scale(.82);
            }

            .scw-battle-result {
              bottom: 15px;
            }
          }
        `}
      </style>
    </div>
  );
}