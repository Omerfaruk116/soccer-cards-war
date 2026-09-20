import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

/*
  ============================
  ANDROID / PWA ÇIKIŞ KORUMASI
  ============================

  Ana menüde telefonun geri
  tuşuna basıldığında uygulama
  direkt kapanmaz.

  Önce:
  "Çıkmak istediğinize emin misiniz?"
  penceresi açılır.

  ÇIK = kırmızı
  KAL = mavi
*/

const EXIT_BASE_STATE = {
  scw: true,
  scwExitGuard: true,
  view: "exit-base",
};

const HOME_GUARD_STATE = {
  scw: true,
  scwExitGuard: true,
  view: "home",
};

let allowExit = false;

function prepareExitGuard() {
  const currentState =
    window.history.state;

  if (
    !currentState
      ?.scwExitGuard
  ) {
    window.history.replaceState(
      EXIT_BASE_STATE,
      "",
      window.location.href
    );

    window.history.pushState(
      HOME_GUARD_STATE,
      "",
      window.location.href
    );
  }
}

function removeExitDialog() {
  const oldDialog =
    document.getElementById(
      "scw-exit-dialog"
    );

  if (oldDialog) {
    oldDialog.remove();
  }
}

function showExitDialog() {
  if (
    document.getElementById(
      "scw-exit-dialog"
    )
  ) {
    return;
  }

  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "scw-exit-dialog";

  Object.assign(
    overlay.style,
    {
      position: "fixed",
      inset: "0",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent:
        "center",
      padding: "24px",

      background:
        "rgba(0, 0, 0, 0.78)",

      backdropFilter:
        "blur(8px)",

      WebkitBackdropFilter:
        "blur(8px)",
    }
  );

  const panel =
    document.createElement(
      "div"
    );

  Object.assign(
    panel.style,
    {
      width: "100%",
      maxWidth: "360px",

      padding:
        "26px 20px 20px",

      border:
        "1px solid #343a44",

      borderRadius:
        "18px",

      background:
        "linear-gradient(145deg, #15191f, #090b0f)",

      color: "#ffffff",

      textAlign: "center",

      boxShadow:
        "0 24px 70px rgba(0,0,0,0.55)",
    }
  );

  const icon =
    document.createElement(
      "div"
    );

  icon.textContent = "⚠️";

  Object.assign(
    icon.style,
    {
      fontSize: "36px",
      marginBottom:
        "10px",
    }
  );

  const title =
    document.createElement(
      "div"
    );

  title.textContent =
    "OYUNDAN ÇIK";

  Object.assign(
    title.style,
    {
      fontSize: "22px",
      fontWeight: "900",
      letterSpacing:
        "1px",
    }
  );

  const message =
    document.createElement(
      "div"
    );

  message.textContent =
    "Çıkmak istediğinize emin misiniz?";

  Object.assign(
    message.style,
    {
      marginTop: "9px",

      color: "#8c949f",

      fontSize: "14px",

      lineHeight: "1.5",
    }
  );

  const buttons =
    document.createElement(
      "div"
    );

  Object.assign(
    buttons.style,
    {
      display: "grid",

      gridTemplateColumns:
        "1fr 1fr",

      gap: "10px",

      marginTop: "24px",
    }
  );

  const exitButton =
    document.createElement(
      "button"
    );

  exitButton.type =
    "button";

  exitButton.textContent =
    "ÇIK";

  Object.assign(
    exitButton.style,
    {
      minHeight: "50px",

      border:
        "1px solid #9e3e39",

      borderRadius:
        "11px",

      background:
        "linear-gradient(135deg, #d4544b, #872d28)",

      color: "#ffffff",

      fontSize: "14px",

      fontWeight: "900",

      cursor: "pointer",
    }
  );

  const stayButton =
    document.createElement(
      "button"
    );

  stayButton.type =
    "button";

  stayButton.textContent =
    "KAL";

  Object.assign(
    stayButton.style,
    {
      minHeight: "50px",

      border:
        "1px solid #3467a8",

      borderRadius:
        "11px",

      background:
        "linear-gradient(135deg, #4385d6, #235393)",

      color: "#ffffff",

      fontSize: "14px",

      fontWeight: "900",

      cursor: "pointer",
    }
  );

  stayButton.addEventListener(
    "click",
    () => {
      removeExitDialog();
    }
  );

  exitButton.addEventListener(
    "click",
    () => {
      removeExitDialog();

      allowExit = true;

      /*
        Şu anda HOME guard
        history kaydındayız.

        Önce exit-base'e dön,
        ardından popstate
        gerçek çıkışı yapacak.
      */
      window.history.back();
    }
  );

  buttons.append(
    exitButton,
    stayButton
  );

  panel.append(
    icon,
    title,
    message,
    buttons
  );

  overlay.append(panel);

  document.body.append(
    overlay
  );

  /*
    KAL butonunu varsayılan
    odak yapıyoruz.
  */
  stayButton.focus();
}

prepareExitGuard();

window.addEventListener(
  "popstate",
  (event) => {
    const state =
      event.state;

    if (
      state?.scw &&
      state.view ===
        "exit-base"
    ) {
      /*
        Kullanıcı ÇIK
        butonuna bastıysa
        bir kez daha geri gidip
        PWA'dan çıkıyoruz.
      */
      if (allowExit) {
        allowExit = false;

        setTimeout(() => {
          window.history.back();
        }, 0);

        return;
      }

      /*
        Normal Android geri
        tuşu ise çıkışı
        durduruyoruz.

        Önce HOME guard'ı
        tekrar ekle, sonra
        onay penceresini aç.
      */
      window.history.pushState(
        HOME_GUARD_STATE,
        "",
        window.location.href
      );

      showExitDialog();
    }
  }
);

createRoot(
  document.getElementById(
    "root"
  )
).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (
  import.meta.env.PROD &&
  "serviceWorker" in
    navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register(
          `${
            import.meta.env
              .BASE_URL
          }sw.js`
        )
        .catch((error) => {
          console.error(
            "Service worker registration failed:",
            error
          );
        });
    }
  );
}