import {
  useEffect,
  useState,
} from "react";

import {
  getSoundSettings,
  setMusicVolume,
  setSfxVolume,
  subscribeSoundSettings,
  toggleMusic,
  toggleSfx,
  playSfx,
  unlockAudio,
} from "../utils/soundSystem";

/* =========================================================
   SOCCER CARDS WAR
   SOUND SETTINGS
========================================================= */

export default function SoundSettings() {
  const [
    settings,
    setSettings,
  ] = useState(
    getSoundSettings()
  );

  /* =======================================================
     SOUND SYSTEM DEĞİŞİKLİKLERİNİ DİNLE
  ======================================================= */

  useEffect(() => {
    return subscribeSoundSettings(
      (nextSettings) => {
        setSettings(
          nextSettings
        );
      }
    );
  }, []);

  /* =======================================================
     MUSIC TOGGLE
  ======================================================= */

  async function handleMusicToggle() {
    await unlockAudio();

    const next =
      toggleMusic();

    setSettings(
      next
    );

    playSfx(
      "button"
    );
  }

  /* =======================================================
     SFX TOGGLE
  ======================================================= */

  async function handleSfxToggle() {
    await unlockAudio();

    const wasEnabled =
      settings.sfxEnabled;

    const next =
      toggleSfx();

    setSettings(
      next
    );

    /*
      Ses efektleri yeni açıldıysa
      kullanıcıya anında geri bildirim ver.
    */

    if (!wasEnabled) {
      window.setTimeout(
        () => {
          playSfx(
            "button"
          );
        },
        40
      );
    }
  }

  /* =======================================================
     MUSIC VOLUME
  ======================================================= */

  function handleMusicVolume(
    event
  ) {
    const volume =
      Number(
        event.target.value
      ) / 100;

    const next =
      setMusicVolume(
        volume
      );

    setSettings(
      next
    );
  }

  /* =======================================================
     SFX VOLUME
  ======================================================= */

  function handleSfxVolume(
    event
  ) {
    const volume =
      Number(
        event.target.value
      ) / 100;

    const next =
      setSfxVolume(
        volume
      );

    setSettings(
      next
    );
  }

  function previewSfx() {
    unlockAudio();

    playSfx(
      "coin"
    );
  }

  /* =======================================================
     VALUES
  ======================================================= */

  const musicPercent =
    Math.round(
      settings.musicVolume *
        100
    );

  const sfxPercent =
    Math.round(
      settings.sfxVolume *
        100
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="scw-sound-settings">
      <div className="scw-sound-header">
        <div className="scw-sound-header-icon">
          🔊
        </div>

        <div>
          <h3>
            SES AYARLARI
          </h3>

          <p>
            Müzik ve oyun
            efektlerini ayarla.
          </p>
        </div>
      </div>

      {/* =================================================
          MUSIC
      ================================================== */}

      <div className="scw-sound-row">
        <div className="scw-sound-row-top">
          <div className="scw-sound-name">
            <span className="scw-sound-icon">
              🎵
            </span>

            <div>
              <strong>
                MÜZİK
              </strong>

              <small>
                Menü ve oyun
                müziği
              </small>
            </div>
          </div>

          <button
            type="button"
            className={
              settings.musicEnabled
                ? "scw-sound-toggle scw-sound-toggle-on"
                : "scw-sound-toggle"
            }
            onClick={
              handleMusicToggle
            }
          >
            <span />

            {settings.musicEnabled
              ? "AÇIK"
              : "KAPALI"}
          </button>
        </div>

        <div
          className={
            settings.musicEnabled
              ? "scw-volume-control"
              : "scw-volume-control scw-volume-disabled"
          }
        >
          <span>
            🔈
          </span>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={
              musicPercent
            }
            disabled={
              !settings.musicEnabled
            }
            onChange={
              handleMusicVolume
            }
          />

          <span>
            🔊
          </span>

          <strong>
            {musicPercent}%
          </strong>
        </div>
      </div>

      {/* =================================================
          SFX
      ================================================== */}

      <div className="scw-sound-row">
        <div className="scw-sound-row-top">
          <div className="scw-sound-name">
            <span className="scw-sound-icon">
              💥
            </span>

            <div>
              <strong>
                SES EFEKTLERİ
              </strong>

              <small>
                Kart, savaş,
                coin ve buton
                sesleri
              </small>
            </div>
          </div>

          <button
            type="button"
            className={
              settings.sfxEnabled
                ? "scw-sound-toggle scw-sound-toggle-on"
                : "scw-sound-toggle"
            }
            onClick={
              handleSfxToggle
            }
          >
            <span />

            {settings.sfxEnabled
              ? "AÇIK"
              : "KAPALI"}
          </button>
        </div>

        <div
          className={
            settings.sfxEnabled
              ? "scw-volume-control"
              : "scw-volume-control scw-volume-disabled"
          }
        >
          <span>
            🔈
          </span>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={
              sfxPercent
            }
            disabled={
              !settings.sfxEnabled
            }
            onChange={
              handleSfxVolume
            }
            onPointerUp={
              previewSfx
            }
          />

          <span>
            🔊
          </span>

          <strong>
            {sfxPercent}%
          </strong>
        </div>

        <button
          type="button"
          className="scw-sound-test"
          disabled={
            !settings.sfxEnabled
          }
          onClick={
            previewSfx
          }
        >
          🪙 SESİ TEST ET
        </button>
      </div>

      {/* =================================================
          CSS
      ================================================== */}

      <style>
        {`
          .scw-sound-settings {
            display: grid;
            gap: 12px;

            width: 100%;

            padding: 14px;

            border:
              1px solid
              #303b46;

            border-radius:
              14px;

            background:
              linear-gradient(
                145deg,
                #111820,
                #090e13
              );

            box-sizing:
              border-box;
          }

          .scw-sound-header {
            display: flex;

            align-items:
              center;

            gap: 11px;

            padding-bottom:
              11px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                .07
              );
          }

          .scw-sound-header-icon {
            display: grid;

            place-items:
              center;

            flex: 0 0 auto;

            width: 42px;
            height: 42px;

            border:
              1px solid
              #785c24;

            border-radius:
              11px;

            background:
              linear-gradient(
                145deg,
                #30230c,
                #171108
              );

            font-size:
              21px;
          }

          .scw-sound-header h3 {
            margin: 0;

            color:
              #f0c65f;

            font-size:
              12px;

            font-weight:
              1000;

            letter-spacing:
              .8px;
          }

          .scw-sound-header p {
            margin:
              3px 0 0;

            color:
              #77818b;

            font-size:
              9px;

            font-weight:
              700;
          }

          .scw-sound-row {
            display: grid;

            gap: 11px;

            padding: 12px;

            border:
              1px solid
              #29343e;

            border-radius:
              12px;

            background:
              #0a1016;
          }

          .scw-sound-row-top {
            display: flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap: 12px;
          }

          .scw-sound-name {
            display: flex;

            align-items:
              center;

            gap: 9px;

            min-width: 0;
          }

          .scw-sound-icon {
            display: grid;

            place-items:
              center;

            flex: 0 0 auto;

            width: 35px;
            height: 35px;

            border-radius:
              9px;

            background:
              #151d24;

            font-size:
              18px;
          }

          .scw-sound-name strong {
            display: block;

            color:
              #e7ebee;

            font-size:
              10px;

            font-weight:
              1000;

            letter-spacing:
              .4px;
          }

          .scw-sound-name small {
            display: block;

            margin-top:
              2px;

            color:
              #68737d;

            font-size:
              8px;

            font-weight:
              700;
          }

          .scw-sound-toggle {
            position:
              relative;

            display: flex;

            align-items:
              center;

            justify-content:
              flex-end;

            gap: 6px;

            flex: 0 0 auto;

            min-width:
              77px;

            min-height:
              31px;

            padding:
              0 9px;

            border:
              1px solid
              #39434d;

            border-radius:
              999px;

            background:
              #151b20;

            color:
              #747e87;

            font-family:
              inherit;

            font-size:
              8px;

            font-weight:
              1000;

            cursor:
              pointer;
          }

          .scw-sound-toggle span {
            width: 9px;
            height: 9px;

            border-radius:
              50%;

            background:
              #59616a;
          }

          .scw-sound-toggle-on {
            border-color:
              #7e6429;

            background:
              #2b220e;

            color:
              #efc65c;
          }

          .scw-sound-toggle-on span {
            background:
              #efc65c;

            box-shadow:
              0 0 9px
              rgba(
                239,
                198,
                92,
                .5
              );
          }

          .scw-volume-control {
            display: grid;

            grid-template-columns:
              20px
              minmax(
                0,
                1fr
              )
              20px
              42px;

            align-items:
              center;

            gap: 7px;
          }

          .scw-volume-control > span {
            text-align:
              center;

            font-size:
              12px;
          }

          .scw-volume-control strong {
            color:
              #d5a947;

            text-align:
              right;

            font-size:
              9px;

            font-weight:
              1000;
          }

          .scw-volume-control input {
            width: 100%;

            cursor:
              pointer;

            accent-color:
              #d5a947;
          }

          .scw-volume-disabled {
            opacity: .35;
          }

          .scw-volume-disabled input {
            cursor:
              default;
          }

          .scw-sound-test {
            min-height:
              34px;

            border:
              1px solid
              #3b4650;

            border-radius:
              9px;

            background:
              #141c23;

            color:
              #cbd3da;

            font-family:
              inherit;

            font-size:
              8px;

            font-weight:
              1000;

            letter-spacing:
              .4px;

            cursor:
              pointer;
          }

          .scw-sound-test:hover:not(
            :disabled
          ) {
            border-color:
              #81672c;

            color:
              #f1c65d;
          }

          .scw-sound-test:disabled {
            opacity: .3;

            cursor:
              default;
          }

          @media (
            max-width: 480px
          ) {
            .scw-sound-settings {
              padding: 11px;
            }

            .scw-sound-row {
              padding: 10px;
            }

            .scw-sound-toggle {
              min-width:
                68px;

              font-size:
                7px;
            }

            .scw-volume-control {
              grid-template-columns:
                17px
                minmax(
                  0,
                  1fr
                )
                17px
                36px;

              gap: 5px;
            }
          }
        `}
      </style>
    </section>
  );
}