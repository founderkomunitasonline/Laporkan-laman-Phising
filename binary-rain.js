(function () {
  "use strict";

  const rain = document.createElement("div");
  rain.id = "binary-rain";

  document.body.appendChild(rain);

  const totalStreams = 38;

  for (let i = 0; i < totalStreams; i++) {
    const stream = document.createElement("div");

    stream.className = "binary-stream";

    const length = 12 + Math.floor(Math.random() * 12);

    for (let j = 0; j < length; j++) {
      const digit = document.createElement("span");

      digit.textContent = Math.random() > 0.5 ? "1" : "0";

      stream.appendChild(digit);
    }

    stream.style.left = Math.random() * 100 + "vw";

    stream.style.animationDuration =
      (3.5 + Math.random() * 4) + "s";

    stream.style.animationDelay =
      (-Math.random() * 7) + "s";

    stream.style.opacity =
      (0.12 + Math.random() * 0.28).toFixed(2);

    stream.style.fontSize =
      (10 + Math.random() * 5) + "px";

    rain.appendChild(stream);
  }
})();
/* =========================================
   BINARY RAIN — FULL SCREEN BACKGROUND
   ========================================= */

html,
body {
  min-height: 100%;
  margin: 0;
}

body {
  position: relative;
  overflow-x: hidden;
}

/* Binary rain TIDAK ikut ukuran halaman */
#binary-rain {
  position: fixed !important;

  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;

  width: 100vw !important;
  height: 100vh !important;

  margin: 0 !important;
  padding: 0 !important;

  overflow: hidden !important;

  pointer-events: none;

  z-index: 0;
}

/* Semua tampilan utama tetap di depan */
body > *:not(#binary-rain) {
  position: relative;
  z-index: 1;
}

/* Pastikan binary tidak membuat scrollbar tambahan */
.binary-stream {
  position: absolute !important;
  margin: 0 !important;
}

/* Saat halaman panjang, rain tetap memenuhi layar */
@media (min-height: 600px) {
  #binary-rain {
    min-height: 100vh;
  }
}
