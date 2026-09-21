import {
  useEffect,
  useMemo,
} from "react";

import {
  advanceStageIfReady,
  createToast,
  FINAL_SAVE_KEY,
  FINAL_SAVE_VERSION,
  getCareerScreenData,
  getEventScreenData,
  getHomeFinalData,
  getMarketScreenData,
  getMissionScreenData,
  getStageProgressStatus,
  normalizeFinalSystems,
  PREVIOUS_SAVE_KEYS,
  shouldRemoveToast,
  updateMarketSystem,
} from "./finalGameSystems";

/* =========================================================
   SAVE OKU

   Önce v6 aranır.
   Yoksa v5 → v4 → v3 → v2 sırasıyla aranır.
========================================================= */

export function readFinalSave() {
  try {
    const current =
      localStorage.getItem(
        FINAL_SAVE_KEY
      );

    if (current) {
      return normalizeFinalSystems(
        JSON.parse(current)
      );
    }

    for (
      const key of
        PREVIOUS_SAVE_KEYS
    ) {
      const old =
        localStorage.getItem(
          key
        );

      if (!old) {
        continue;
      }

      return normalizeFinalSystems(
        JSON.parse(old)
      );
    }
  } catch {
    return null;
  }

  return null;
}

/* =========================================================
   SAVE YAZ
========================================================= */

export function writeFinalSave(
  game
) {
  if (!game) {
    return;
  }

  try {
    localStorage.setItem(
      FINAL_SAVE_KEY,
      JSON.stringify({
        ...game,

        saveVersion:
          FINAL_SAVE_VERSION,
      })
    );
  } catch {
    // localStorage dolu/kapalıysa
    // oyun çökmeyecek.
  }
}

/* =========================================================
   ANA HOOK

   App.jsx şunları otomatik kazanacak:

   - v6 save
   - market auto refresh
   - shared stage advance
   - toast auto hide
   - Home mission data
   - Career fixture data
   - Event preview data
========================================================= */

export function useFinalGameSystems({
  game,
  setGame,
  now,
  activeEventId,
  toast,
  setToast,
}) {
  /* =======================================================
     SAVE
  ======================================================= */

  useEffect(() => {
    if (!game) {
      return;
    }

    writeFinalSave(
      game
    );
  }, [game]);

  /* =======================================================
     MARKET AUTO REFRESH

     Her saniye render olsa bile state
     yalnızca gerçekten market zamanı dolunca değişir.
  ======================================================= */

  useEffect(() => {
    if (!game) {
      return;
    }

    const result =
      updateMarketSystem(
        game,
        now
      );

    if (!result.refreshed) {
      return;
    }

    setGame(
      result.game
    );

    setToast(
      createToast(
        "🔄 Transfer pazarı yenilendi.",
        "info"
      )
    );
  }, [
    now,
    game,
    setGame,
    setToast,
  ]);

  /* =======================================================
     CAREER + EVENT = YENİ AŞAMA

     İkisi de bitmeden stage ilerlemez.
  ======================================================= */

  useEffect(() => {
    if (!game) {
      return;
    }

    const result =
      advanceStageIfReady(
        game
      );

    if (!result.advanced) {
      return;
    }

    setGame(
      result.game
    );

    setToast(
      createToast(
        `🏆 AŞAMA ${result.game.activeStage} AÇILDI!`,
        "success",
        2400
      )
    );
  }, [
    game,
    setGame,
    setToast,
  ]);

  /* =======================================================
     TOAST OTOMATİK KAPANIR
  ======================================================= */

  useEffect(() => {
    if (!toast) {
      return;
    }

    const elapsed =
      Date.now() -
      Number(
        toast.createdAt ||
          0
      );

    const remaining =
      Math.max(
        0,
        Number(
          toast.duration ||
            1800
        ) - elapsed
      );

    const timer =
      window.setTimeout(
        () => {
          setToast(null);
        },
        remaining
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    toast,
    setToast,
  ]);

  /* =======================================================
     TÜRETİLEN VERİLER
  ======================================================= */

  const homeData =
    useMemo(
      () =>
        game
          ? getHomeFinalData(
              game,
              now
            )
          : null,
      [
        game,
        now,
      ]
    );

  const careerData =
    useMemo(
      () =>
        game
          ? getCareerScreenData(
              game
            )
          : null,
      [game]
    );

  const eventData =
    useMemo(
      () =>
        game
          ? getEventScreenData(
              game,
              activeEventId
            )
          : null,
      [
        game,
        activeEventId,
      ]
    );

  const marketData =
    useMemo(
      () =>
        game
          ? getMarketScreenData(
              game,
              now
            )
          : null,
      [
        game,
        now,
      ]
    );

  const missionData =
    useMemo(
      () =>
        game
          ? getMissionScreenData(
              game
            )
          : null,
      [game]
    );

  const stageStatus =
    useMemo(
      () =>
        game
          ? getStageProgressStatus(
              game
            )
          : null,
      [game]
    );

  return {
    homeData,
    careerData,
    eventData,
    marketData,
    missionData,
    stageStatus,

    showToast(
      message,
      type = "info",
      duration = 1800
    ) {
      setToast(
        createToast(
          message,
          type,
          duration
        )
      );
    },

    clearToast() {
      setToast(null);
    },

    isToastExpired() {
      return shouldRemoveToast(
        toast
      );
    },
  };
}

/* =========================================================
   EKRAN BRIDGE

   main.jsx içindeki BAŞARIMLAR kartının
   yalnızca HOME'da görünmesi için.

   App her ekran değişiminde bunu çağıracak.
========================================================= */

export function publishCurrentScreen(
  screen,
  battle = null
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  const actualScreen =
    battle
      ? "battle"
      : screen || "home";

  document.body.dataset.scwScreen =
    actualScreen;

  window.dispatchEvent(
    new CustomEvent(
      "scw-screen-change",
      {
        detail: {
          screen:
            actualScreen,
        },
      }
    )
  );
}