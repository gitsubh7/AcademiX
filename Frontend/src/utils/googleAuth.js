// utils/googleAuth.js
// src/utils/googleAuth.js
// -----------------------------------------------------------------------------
//  src/utils/googleAuth.js
//  Launches Google‑OAuth popup via your backend and resolves with the tokens
// -----------------------------------------------------------------------------

export function startGoogleLogin() {
  /* 1️⃣  The backend route that builds the Google‑Auth URL
         – update if your route prefix changes */
  const popupURL = "http://localhost:3000/api/v1/student/google";

  /* 2️⃣  Centre the popup window */
  const w = 500, h = 600;
  const left = (window.screen.width  - w) / 2;
  const top  = (window.screen.height - h) / 2;

  const authWin = window.open(
    popupURL,
    "googleLogin",
    `width=${w},height=${h},left=${left},top=${top}`
  );

  if (!authWin) {
    return Promise.reject(new Error("Popup was blocked"));
  }

  /* 3️⃣  Listen for the tokens sent from redirectGoogleAuth */
  return new Promise((resolve, reject) => {
    const expectedOrigin = "http://localhost:3000";   // ← must match backend

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Google login timed out"));
    }, 120_000);

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      if (authWin && !authWin.closed) authWin.close();
    }

    function handler(e) {
  if (e.origin !== expectedOrigin) return;   // security check

  const payload =
    typeof e.data === "string" ? JSON.parse(e.data) : e.data;

  const { access_token, refresh_token, expires_in } = payload || {};

  if (access_token) {
    localStorage.setItem("gAccess", access_token);
    localStorage.setItem("gRefresh", refresh_token || "");
    if (expires_in)
      localStorage.setItem("gExpires", Date.now() + expires_in * 1000);

    cleanup();
    resolve(payload);
  } else {
    cleanup();
    reject(new Error("No access token received"));
  }
}

    window.addEventListener("message", handler);
  });
}
