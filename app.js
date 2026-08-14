/*
  BASMI PHISING — app-detail.js
  Fungsi tambahan untuk menampilkan detail laporan.
*/

(function () {
  "use strict";

  const detailInput = document.getElementById("detailInput");
  const processBtn = document.getElementById("processBtn");
  const queue = document.getElementById("queue");

  if (!detailInput || !processBtn || !queue) {
    console.warn("app-detail.js: elemen dashboard tidak ditemukan.");
    return;
  }

  function getDetail() {
    return detailInput.value.trim();
  }

  function makeDetailLine(text) {
    const line = document.createElement("div");

    line.className = "detail-line app-detail-extra";
    line.textContent = "Detail: " + (text || "-");

    return line;
  }

  function makeCopyButton(text) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "copy app-detail-copy";
    button.textContent = "SALIN DETAIL";

    button.addEventListener("click", async function (event) {
      event.stopPropagation();

      try {
        await navigator.clipboard.writeText(text || "");

        button.textContent = "TERSALIN ✓";

        setTimeout(function () {
          button.textContent = "SALIN DETAIL";
        }, 1200);

      } catch (error) {
        const area = document.createElement("textarea");

        area.value = text || "";
        document.body.appendChild(area);

        area.select();
        document.execCommand("copy");

        area.remove();

        button.textContent = "TERSALIN ✓";

        setTimeout(function () {
          button.textContent = "SALIN DETAIL";
        }, 1200);
      }
    });

    return button;
  }

  function updateRows() {
    const detail = getDetail();
    const rows = queue.querySelectorAll(".item");

    rows.forEach(function (row) {

      const info = row.children[1];
      const actions = row.querySelector(".item-actions");

      if (!info) return;

      /*
       * Hapus detail lama supaya tidak menggandakan
       * ketika daftar URL diperbarui.
       */

      const oldDetail = info.querySelector(".app-detail-extra");

      if (oldDetail) {
        oldDetail.remove();
      }

      /*
       * Tambahkan detail laporan.
       */

      info.appendChild(
        makeDetailLine(detail)
      );

      /*
       * Tambahkan tombol salin detail
       * jika bagian tombol tersedia.
       */

      if (actions) {

        const oldCopy =
          actions.querySelector(".app-detail-copy");

        if (oldCopy) {
          oldCopy.remove();
        }

        actions.insertBefore(
          makeCopyButton(detail),
          actions.firstChild
        );
      }
    });
  }

  /*
   * Setelah tombol PROSES URL ditekan,
   * tunggu app.js selesai membuat daftar URL.
   */

  processBtn.addEventListener("click", function () {

    setTimeout(function () {
      updateRows();
    }, 100);

    setTimeout(function () {
      updateRows();
    }, 500);

  });

  /*
   * Pantau perubahan daftar URL.
   * Ini membuat detail tetap muncul walaupun
   * app.js menggambar ulang daftar.
   */

  const observer = new MutationObserver(function () {

    if (queue.children.length > 0) {

      setTimeout(function () {
        updateRows();
      }, 0);

    }

  });

  observer.observe(queue, {
    childList: true,
    subtree: true
  });

  /*
   * Kalau detail laporan diubah,
   * semua item ikut diperbarui.
   */

  detailInput.addEventListener("input", function () {

    setTimeout(function () {
      updateRows();
    }, 0);

  });

})();
