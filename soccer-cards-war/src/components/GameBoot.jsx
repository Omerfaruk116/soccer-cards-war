import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import WelcomeScreen from "./WelcomeScreen";

import {
  playMusic,
  playSfx,
  stopMusic,
  unlockAudio,
} from "../utils/soundSystem";

const WELCOME_EXIT_TIME = 650;

export default function GameBoot({
  children,
}) {
  const [entered, setEntered] =
    useState(false);

  const enteringRef =
    useRef(false);

  const timerRef =
    useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(
          timerRef.current
        );
      }

      stopMusic();
    };
  }, []);

  useEffect(() => {
    if (!entered) {
      return undefined;
    }

    const handleButtonClick =
      (event) => {
        const target =
          event.target;

        if (
          !(
            target instanceof
            Element
          )
        ) {
          return;
        }

        const button =
          target.closest(
            "button"
          );

        if (
          !button ||
          button.disabled
        ) {
          return;
        }

        playSfx("button");
      };

    document.addEventListener(
      "click",
      handleButtonClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleButtonClick
      );
    };
  }, [entered]);

  const enterGame =
    useCallback(async () => {
      if (
        enteringRef.current
      ) {
        return;
      }

      enteringRef.current = true;

      /*
        SES BURADA, GERÇEK TIKLAMA
        ANINDA AÇILIYOR.

        Telefon / PWA için önemli.
      */
      try {
        await unlockAudio();

        playSfx("button");

        playMusic("menu");
      } catch {
        /*
          Ses çalışmasa bile
          oyun açılmaya devam eder.
        */
      }

      /*
        WelcomeScreen bu sırada
        scw-welcome-leaving animasyonunu
        oynatmaya devam ediyor.

        650 ms sonra gerçek oyun açılıyor.
      */
      timerRef.current =
        window.setTimeout(
          () => {
            setEntered(true);
          },
          WELCOME_EXIT_TIME
        );
    }, []);

  if (!entered) {
    return (
      <WelcomeScreen
        onEnter={
          enterGame
        }
      />
    );
  }

  return (
    <>
      {children}
    </>
  );
}