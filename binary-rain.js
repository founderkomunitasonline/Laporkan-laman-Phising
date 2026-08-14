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
