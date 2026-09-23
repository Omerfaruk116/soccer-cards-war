/* =========================================================
   SOCCER CARDS WAR
   SOUND SYSTEM

   - Müzik aç/kapat
   - Efekt aç/kapat
   - Ses seviyeleri
   - localStorage kayıt
   - MP3 olmadan Web Audio efektleri
   - İleride gerçek ses dosyaları da bağlanabilir
========================================================= */

const SOUND_SETTINGS_KEY =
  "scw-sound-settings-v1";

const DEFAULT_SETTINGS = {
  musicEnabled: true,
  sfxEnabled: true,

  musicVolume: 0.35,
  sfxVolume: 0.65,
};

/* =========================================================
   STATE
========================================================= */

let settings =
  loadSoundSettings();

let audioContext = null;

let musicAudio = null;

let currentMusicName = null;

const listeners =
  new Set();

/* =========================================================
   SETTINGS
========================================================= */

function clampVolume(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0.5;
  }

  return Math.max(
    0,
    Math.min(
      1,
      number
    )
  );
}

function normalizeSettings(
  value
) {
  return {
    musicEnabled:
      value?.musicEnabled !==
      false,

    sfxEnabled:
      value?.sfxEnabled !==
      false,

    musicVolume:
      clampVolume(
        value?.musicVolume ??
          DEFAULT_SETTINGS.musicVolume
      ),

    sfxVolume:
      clampVolume(
        value?.sfxVolume ??
          DEFAULT_SETTINGS.sfxVolume
      ),
  };
}

function loadSoundSettings() {
  try {
    const raw =
      localStorage.getItem(
        SOUND_SETTINGS_KEY
      );

    if (!raw) {
      return {
        ...DEFAULT_SETTINGS,
      };
    }

    return normalizeSettings(
      JSON.parse(raw)
    );
  } catch {
    return {
      ...DEFAULT_SETTINGS,
    };
  }
}

function saveSoundSettings() {
  try {
    localStorage.setItem(
      SOUND_SETTINGS_KEY,
      JSON.stringify(
        settings
      )
    );
  } catch {
    // localStorage hatası
    // oyunu bozmaz.
  }
}

function notifyListeners() {
  listeners.forEach(
    (listener) => {
      try {
        listener({
          ...settings,
        });
      } catch {
        // Bir listener hata verirse
        // diğerlerini bozmasın.
      }
    }
  );
}

/* =========================================================
   PUBLIC SETTINGS API
========================================================= */

export function getSoundSettings() {
  return {
    ...settings,
  };
}

export function setSoundSettings(
  next
) {
  settings =
    normalizeSettings({
      ...settings,
      ...next,
    });

  saveSoundSettings();

  updateMusicVolume();

  if (
    !settings.musicEnabled
  ) {
    pauseMusic();
  } else if (
    musicAudio
  ) {
    resumeMusic();
  }

  notifyListeners();

  return {
    ...settings,
  };
}

export function toggleMusic() {
  return setSoundSettings({
    musicEnabled:
      !settings.musicEnabled,
  });
}

export function toggleSfx() {
  return setSoundSettings({
    sfxEnabled:
      !settings.sfxEnabled,
  });
}

export function setMusicVolume(
  volume
) {
  return setSoundSettings({
    musicVolume:
      clampVolume(volume),
  });
}

export function setSfxVolume(
  volume
) {
  return setSoundSettings({
    sfxVolume:
      clampVolume(volume),
  });
}

export function subscribeSoundSettings(
  listener
) {
  if (
    typeof listener !==
    "function"
  ) {
    return () => {};
  }

  listeners.add(
    listener
  );

  return () => {
    listeners.delete(
      listener
    );
  };
}

/* =========================================================
   AUDIO CONTEXT
========================================================= */

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  try {
    audioContext =
      new AudioContextClass();

    return audioContext;
  } catch {
    return null;
  }
}

export async function unlockAudio() {
  const context =
    getAudioContext();

  if (!context) {
    return false;
  }

  try {
    if (
      context.state ===
      "suspended"
    ) {
      await context.resume();
    }

    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   BASIC TONE
========================================================= */

function createTone({
  frequency = 440,
  duration = 0.1,
  volume = 0.2,
  type = "sine",
  delay = 0,
  endFrequency = null,
}) {
  if (
    !settings.sfxEnabled
  ) {
    return;
  }

  const context =
    getAudioContext();

  if (!context) {
    return;
  }

  try {
    if (
      context.state ===
      "suspended"
    ) {
      context.resume();
    }

    const start =
      context.currentTime +
      delay;

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    oscillator.type =
      type;

    oscillator.frequency.setValueAtTime(
      frequency,
      start
    );

    if (
      endFrequency !== null
    ) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(
          1,
          endFrequency
        ),
        start + duration
      );
    }

    const finalVolume =
      Math.max(
        0.0001,
        volume *
          settings.sfxVolume
      );

    gain.gain.setValueAtTime(
      0.0001,
      start
    );

    gain.gain.exponentialRampToValueAtTime(
      finalVolume,
      start + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + duration
    );

    oscillator.connect(
      gain
    );

    gain.connect(
      context.destination
    );

    oscillator.start(
      start
    );

    oscillator.stop(
      start +
        duration +
        0.03
    );
  } catch {
    // Ses hatası oyunu bozmaz.
  }
}

/* =========================================================
   NOISE

   Çarpışma / patlama / kart yok olma gibi
   efektlerde kullanılır.
========================================================= */

function createNoise({
  duration = 0.15,
  volume = 0.15,
  delay = 0,
}) {
  if (
    !settings.sfxEnabled
  ) {
    return;
  }

  const context =
    getAudioContext();

  if (!context) {
    return;
  }

  try {
    const length =
      Math.max(
        1,
        Math.floor(
          context.sampleRate *
            duration
        )
      );

    const buffer =
      context.createBuffer(
        1,
        length,
        context.sampleRate
      );

    const data =
      buffer.getChannelData(0);

    for (
      let i = 0;
      i < length;
      i += 1
    ) {
      data[i] =
        Math.random() *
          2 -
        1;
    }

    const source =
      context.createBufferSource();

    source.buffer =
      buffer;

    const gain =
      context.createGain();

    const start =
      context.currentTime +
      delay;

    gain.gain.setValueAtTime(
      volume *
        settings.sfxVolume,
      start
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + duration
    );

    source.connect(
      gain
    );

    gain.connect(
      context.destination
    );

    source.start(
      start
    );
  } catch {
    // Sessiz devam et.
  }
}

/* =========================================================
   SFX
========================================================= */

function buttonSound() {
  createTone({
    frequency: 430,
    endFrequency: 560,
    duration: 0.055,
    volume: 0.08,
    type: "sine",
  });
}

function cardSound() {
  createNoise({
    duration: 0.07,
    volume: 0.08,
  });

  createTone({
    frequency: 380,
    endFrequency: 700,
    duration: 0.1,
    volume: 0.09,
    type: "triangle",
  });
}

function coinSound() {
  createTone({
    frequency: 880,
    duration: 0.07,
    volume: 0.12,
    type: "sine",
  });

  createTone({
    frequency: 1320,
    duration: 0.1,
    volume: 0.1,
    type: "sine",
    delay: 0.065,
  });
}

function successSound() {
  createTone({
    frequency: 523,
    duration: 0.12,
    volume: 0.13,
    type: "triangle",
  });

  createTone({
    frequency: 659,
    duration: 0.12,
    volume: 0.13,
    type: "triangle",
    delay: 0.11,
  });

  createTone({
    frequency: 784,
    duration: 0.22,
    volume: 0.16,
    type: "triangle",
    delay: 0.22,
  });
}

function lossSound() {
  createTone({
    frequency: 330,
    endFrequency: 220,
    duration: 0.22,
    volume: 0.15,
    type: "sawtooth",
  });

  createTone({
    frequency: 220,
    endFrequency: 120,
    duration: 0.3,
    volume: 0.12,
    type: "triangle",
    delay: 0.17,
  });
}

function battleImpactSound() {
  createNoise({
    duration: 0.22,
    volume: 0.2,
  });

  createTone({
    frequency: 120,
    endFrequency: 55,
    duration: 0.28,
    volume: 0.22,
    type: "sawtooth",
  });

  createTone({
    frequency: 700,
    endFrequency: 180,
    duration: 0.12,
    volume: 0.09,
    type: "square",
  });
}

function burnSound() {
  createNoise({
    duration: 0.55,
    volume: 0.11,
  });

  createTone({
    frequency: 160,
    endFrequency: 60,
    duration: 0.5,
    volume: 0.08,
    type: "sawtooth",
  });
}

function whistleSound() {
  createTone({
    frequency: 1500,
    duration: 0.13,
    volume: 0.11,
    type: "sine",
  });

  createTone({
    frequency: 1750,
    duration: 0.18,
    volume: 0.1,
    type: "sine",
    delay: 0.11,
  });
}

function transferSound() {
  createTone({
    frequency: 350,
    endFrequency: 650,
    duration: 0.12,
    volume: 0.1,
    type: "triangle",
  });

  createTone({
    frequency: 650,
    endFrequency: 900,
    duration: 0.16,
    volume: 0.11,
    type: "triangle",
    delay: 0.1,
  });
}

function trainingCompleteSound() {
  createTone({
    frequency: 440,
    duration: 0.1,
    volume: 0.1,
    type: "triangle",
  });

  createTone({
    frequency: 660,
    duration: 0.1,
    volume: 0.11,
    type: "triangle",
    delay: 0.09,
  });

  createTone({
    frequency: 880,
    duration: 0.18,
    volume: 0.13,
    type: "triangle",
    delay: 0.18,
  });
}

function rareSound() {
  createTone({
    frequency: 440,
    duration: 0.15,
    volume: 0.09,
    type: "sine",
  });

  createTone({
    frequency: 660,
    duration: 0.15,
    volume: 0.1,
    type: "sine",
    delay: 0.12,
  });

  createTone({
    frequency: 990,
    duration: 0.3,
    volume: 0.14,
    type: "sine",
    delay: 0.24,
  });
}

function legendarySound() {
  createNoise({
    duration: 0.25,
    volume: 0.07,
  });

  createTone({
    frequency: 220,
    endFrequency: 440,
    duration: 0.3,
    volume: 0.12,
    type: "sawtooth",
  });

  createTone({
    frequency: 440,
    endFrequency: 880,
    duration: 0.35,
    volume: 0.14,
    type: "triangle",
    delay: 0.25,
  });

  createTone({
    frequency: 1320,
    duration: 0.5,
    volume: 0.16,
    type: "sine",
    delay: 0.55,
  });
}

/* =========================================================
   PLAY SFX

   Kullanım:
   playSfx("coin")
   playSfx("win")
   playSfx("battle-impact")
========================================================= */

export function playSfx(
  name
) {
  if (
    !settings.sfxEnabled
  ) {
    return;
  }

  switch (name) {
    case "button":
    case "click":
      buttonSound();
      break;

    case "card":
    case "card-open":
    case "card-select":
      cardSound();
      break;

    case "coin":
      coinSound();
      break;

    case "success":
    case "win":
      successSound();
      break;

    case "loss":
    case "lose":
      lossSound();
      break;

    case "battle":
    case "battle-impact":
    case "impact":
      battleImpactSound();
      break;

    case "burn":
    case "destroy":
      burnSound();
      break;

    case "whistle":
    case "match-start":
      whistleSound();
      break;

    case "transfer":
    case "purchase":
      transferSound();
      break;

    case "training":
    case "training-complete":
      trainingCompleteSound();
      break;

    case "rare":
    case "special-card":
      rareSound();
      break;

    case "legendary":
    case "icon":
      legendarySound();
      break;

    default:
      buttonSound();
      break;
  }
}

/* =========================================================
   REAL AUDIO FILE SUPPORT

   İleride:
   public/audio/menu.mp3
   public/audio/stadium.mp3

   eklenirse direkt çalışır.
========================================================= */

function getAudioPath(
  name
) {
  return (
    `${import.meta.env.BASE_URL}` +
    `audio/${name}.mp3`
  );
}

export function playMusic(
  name = "menu"
) {
  currentMusicName =
    name;

  if (
    !settings.musicEnabled
  ) {
    return;
  }

  try {
    if (
      musicAudio &&
      musicAudio.dataset
        ?.scwMusicName ===
        name
    ) {
      resumeMusic();
      return;
    }

    stopMusic();

    musicAudio =
      new Audio(
        getAudioPath(name)
      );

    musicAudio.dataset.scwMusicName =
      name;

    musicAudio.loop =
      true;

    musicAudio.preload =
      "auto";

    musicAudio.volume =
      settings.musicVolume;

    const promise =
      musicAudio.play();

    if (
      promise &&
      typeof promise.catch ===
        "function"
    ) {
      promise.catch(() => {
        /*
          Tarayıcı autoplay'i engellerse
          ilk kullanıcı dokunuşunda
          resumeMusic() çağrılabilir.
        */
      });
    }
  } catch {
    musicAudio = null;
  }
}

export function stopMusic() {
  if (!musicAudio) {
    return;
  }

  try {
    musicAudio.pause();
    musicAudio.currentTime =
      0;
  } catch {
    // önemli değil
  }

  musicAudio = null;
}

export function pauseMusic() {
  if (!musicAudio) {
    return;
  }

  try {
    musicAudio.pause();
  } catch {
    // önemli değil
  }
}

export function resumeMusic() {
  if (
    !settings.musicEnabled
  ) {
    return;
  }

  if (!musicAudio) {
    if (
      currentMusicName
    ) {
      playMusic(
        currentMusicName
      );
    }

    return;
  }

  try {
    musicAudio.volume =
      settings.musicVolume;

    const promise =
      musicAudio.play();

    if (
      promise &&
      typeof promise.catch ===
        "function"
    ) {
      promise.catch(
        () => {}
      );
    }
  } catch {
    // önemli değil
  }
}

function updateMusicVolume() {
  if (!musicAudio) {
    return;
  }

  try {
    musicAudio.volume =
      settings.musicVolume;
  } catch {
    // önemli değil
  }
}

/* =========================================================
   VISIBILITY

   Oyun arka plana atılırsa müzik durur.
   Geri gelince devam eder.
========================================================= */

function handleVisibilityChange() {
  if (
    document.hidden
  ) {
    pauseMusic();
    return;
  }

  if (
    settings.musicEnabled &&
    currentMusicName
  ) {
    resumeMusic();
  }
}

if (
  typeof document !==
  "undefined"
) {
  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );
}

/* =========================================================
   FIRST INTERACTION

   Mobil tarayıcıların AudioContext kilidini açar.
========================================================= */

function handleFirstInteraction() {
  unlockAudio();

  window.removeEventListener(
    "pointerdown",
    handleFirstInteraction
  );

  window.removeEventListener(
    "keydown",
    handleFirstInteraction
  );
}

if (
  typeof window !==
  "undefined"
) {
  window.addEventListener(
    "pointerdown",
    handleFirstInteraction,
    {
      once: true,
    }
  );

  window.addEventListener(
    "keydown",
    handleFirstInteraction,
    {
      once: true,
    }
  );
}

/* =========================================================
   RESET
========================================================= */

export function resetSoundSettings() {
  settings = {
    ...DEFAULT_SETTINGS,
  };

  saveSoundSettings();

  updateMusicVolume();

  notifyListeners();

  return {
    ...settings,
  };
}