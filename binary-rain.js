(function () {
  "use strict";

  const rain = document.createElement("div");
  rain.id = "binary-rain";

  document.body.appendChild(rain);

  const chars = "01";

  for (let i = 0; i < 42; i++) {
    const stream = document.createElement("span");

    stream.className = "binary-stream";

    let text = "";

    for (let j = 0; j < 16; j++) {
      text += chars[Math.floor(Math.random() * chars.length)] + "\n";
    }

    stream.textContent = text;

    stream.style.left =
      Math.random() * 100 + "%";

    stream.style.animationDuration =
      (4 + Math.random() * 5) + "s";

    stream.style.animationDelay =
      (-Math.random() * 8) + "s";

    stream.style.opacity =
      (0.15 + Math.random() * 0.35).toFixed(2);

    rain.appendChild(stream);
  }
})();
