// utils/googleAuth.js
// src/utils/googleAuth.js
export function startGoogleLogin() {
  const scope = encodeURIComponent("https://www.googleapis.com/auth/calendar");

  const popupURL = "http://localhost:3000/api/v1/student/google?prompt=consent&access_type=offline&scope=${scope";
  const w = 500, h = 600;
  const left = (screen.width - w) / 2;
  const top = (screen.height - h) / 2;

  const authWin = window.open(
    popupURL,
    "googleLogin",
    `width=${w},height=${h},left=${left},top=${top}`
  );

  if (!authWin) {
    return Promise.reject(new Error("Popup was blocked"));
  }

  return new Promise((resolve, reject) => {
    const failTimer = setTimeout(() => {
      reject(new Error("Google login timed out"));
      cleanup();
    }, 120000);

    function cleanup() {
      clearTimeout(failTimer);
      window.removeEventListener("message", messageHandler);
      if (authWin && !authWin.closed) authWin.close();
    }

    function messageHandler(e) {
      // NOTE: Replace this with your backend origin
      const expectedOrigin = "http://localhost:3000";
      if (e.origin !== expectedOrigin) return;

      const { access_token, refresh_token, expires_in } = e.data || {};
      if (access_token) {
        localStorage.setItem("gAccess", access_token);
        localStorage.setItem("gRefresh", refresh_token || "");
        localStorage.setItem("gExpires", Date.now() + (expires_in || 0) * 1000);
        resolve(e.data);
      } else {
        reject(new Error("No access token received"));
      }
      cleanup();
    }

    window.addEventListener("message", messageHandler);
  });
}
