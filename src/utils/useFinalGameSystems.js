import {
  useEffect,
  useMemo,
} from "react";

import {
  FINAL_SAVE_KEY,
  PREVIOUS_SAVE_KEYS,
  advanceStageIfReady,
  createToast,
  getCareerScreenData,
  getEventScreenData,
  getHomeFinalData,
  getMarketScreenData,
  getMissionScreenData,
  getStageProgressStatus,
  normalizeFinalSystems,
  shouldRemoveToast,
  updateMarketSystem,
} from "./finalGameSystems";

/* =========================================================
   SAVE OKU
========================================================= */

export function readFinalSave() {
  const keys = [
    FINAL_SAVE_KEY,
    ...PREVIOUS_SAVE_KEYS,
  ];

  for (const key of keys) {
    try {
      const raw =
        localStorage.getItem(
          key
        );

      if (!raw) {
        continue;
      }

      const parsed =
        JSON.parse(raw);

      if (
        parsed &&
        typeof parsed ===
          "object"
      ) {
        return parsed;
      }
    } catch {
      // Bozuk save atlanır.
    }
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
    return false;
  }

  try {
    localStorage.setItem(
      FINAL_SAVE_KEY,
      JSON.stringify({
        ...game,
        saveVersion: 6,
      })
    );

    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   EKRANI MAIN.JSX'E BİLDİR
========================================================= */

export function publishCurrentScreen(
  screen,
  battle = null
) {
  const value =
    battle
      ? "battle"
      : screen || "home";

  document.body.dataset.scwScreen =
    value;

  window.dispatchEvent(
    new CustomEvent(
      "scw-screen-change",
      {
        detail: {
          screen: value,
        },
      }
    )
  );
}

/* =========================================================
   FINAL SİSTEM HOOK'U
========================================================= */

export function useFinalGameSystems({
  game,
  setGame,
  now = Date.now(),
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
     OYUNDA GEÇİRİLEN SÜRE
  ======================================================= */

  useEffect(() => {
    let lastTick =
      Date.now();

    function tickPlayTime() {
      const current =
        Date.now();

      if (
        document.visibilityState !==
        "visible"
      ) {
        lastTick = current;
        return;
      }

      const elapsedSeconds =
        Math.floor(
          (current - lastTick) /
            1000
        );

      if (
        elapsedSeconds < 1
      ) {
        return;
      }

      lastTick +=
        elapsedSeconds * 1000;

      setGame(
        (previous) => {
          if (!previous) {
            return previous;
          }

          const oldValue =
            Number(
              previous.playTimeSeconds ??
                previous.playTime ??
                previous.stats
                  ?.playTimeSeconds ??
                previous.stats
                  ?.playTime ??
                0
            ) || 0;

          return {
            ...previous,

            playTimeSeconds:
              oldValue +
              elapsedSeconds,
          };
        }
      );
    }

    function handleVisibilityChange() {
      lastTick =
        Date.now();
    }

    const timer =
      window.setInterval(
        tickPlayTime,
        1000
      );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(
        timer
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [setGame]);

  /* =======================================================
     ESKİ SAVE'DEKİ PLAYTIME'I YENİ ALANA TAŞI
  ======================================================= */

  useEffect(() => {
    setGame(
      (previous) => {
        if (!previous) {
          return previous;
        }

        if (
          Number.isFinite(
            Number(
              previous.playTimeSeconds
            )
          )
        ) {
          return previous;
        }

        const legacy =
          Number(
            previous.playTime ??
              previous.stats
                ?.playTimeSeconds ??
              previous.stats
                ?.playTime ??
              0
          ) || 0;

        return {
          ...previous,
          playTimeSeconds:
            Math.max(
              0,
              Math.floor(
                legacy
              )
            ),
        };
      }
    );
  }, [setGame]);

  /* =======================================================
     MARKET OTOMATİK YENİLEME
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

    if (
      result.refreshed
    ) {
      setGame(
        result.game
      );
    }
  }, [
    now,
    game?.marketSystem
      ?.nextRefreshAt,
  ]);

  /* =======================================================
     AŞAMA OTOMATİK İLERLEME
  ======================================================= */

  useEffect(() => {
    if (!game) {
      return;
    }

    const result =
      advanceStageIfReady(
        game
      );

    if (
      result.advanced
    ) {
      setGame(
        result.game
      );
    }
  }, [
    game?.activeStage,
    game?.careerFixtures,
    game?.career
      ?.completedStages,
    game?.events,
  ]);

  /* =======================================================
     TOAST
  ======================================================= */

  useEffect(() => {
    if (!toast) {
      return;
    }

    const remaining =
      Math.max(
        0,
        Number(
          toast.duration ||
            1800
        ) -
          (Date.now() -
            Number(
              toast.createdAt ||
                Date.now()
            ))
      );

    const timer =
      window.setTimeout(
        () => {
          setToast(
            (current) => {
              if (
                !current ||
                current.id !==
                  toast.id
              ) {
                return current;
              }

              return null;
            }
          );
        },
        remaining
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    toast,
    setToast,
  ]);

  useEffect(() => {
    if (
      toast &&
      shouldRemoveToast(
        toast,
        now
      )
    ) {
      setToast(null);
    }
  }, [
    now,
    toast,
    setToast,
  ]);

  function showToast(
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
  }

  /* =======================================================
     TÜRETİLEN EKRAN VERİLERİ
  ======================================================= */

  const normalizedGame =
    useMemo(
      () =>
        normalizeFinalSystems(
          game || {},
          now
        ),
      [game, now]
    );

  const homeData =
    useMemo(
      () =>
        getHomeFinalData(
          normalizedGame,
          now
        ),
      [normalizedGame, now]
    );

  const careerData =
    useMemo(
      () =>
        getCareerScreenData(
          normalizedGame
        ),
      [normalizedGame]
    );

  const eventData =
    useMemo(
      () =>
        getEventScreenData(
          normalizedGame,
          activeEventId
        ),
      [
        normalizedGame,
        activeEventId,
      ]
    );

  const marketData =
    useMemo(
      () =>
        getMarketScreenData(
          normalizedGame,
          now
        ),
      [normalizedGame, now]
    );

  const missionData =
    useMemo(
      () =>
        getMissionScreenData(
          normalizedGame
        ),
      [normalizedGame]
    );

  const stageStatus =
    useMemo(
      () =>
        getStageProgressStatus(
          normalizedGame
        ),
      [normalizedGame]
    );

  return {
    game:
      normalizedGame,

    homeData,
    careerData,
    eventData,
    marketData,
    missionData,
    stageStatus,

    showToast,
  };
}