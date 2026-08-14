/*
  BASMI PHISING — app-detail.js
  PATCH TAMBAHAN — tidak mengganti app.js

  Fungsi:
  1. Menggunakan ID yang benar dari index.html:
     #detail dan #process
  2. Menampilkan detail pada setiap item URL.
  3. Saat "BUKA LAPORAN" diklik, detail otomatis disalin ke clipboard.
  4. Tombol tetap membuka URL laporan milik app.js.
*/

(function () {
  "use strict";

  const detailInput = document.getElementById("detail");
  const processBtn = document.getElementById("process");
  const queue = document.getElementById("queue");

  if (!detailInput || !processBtn || !queue) {
    console.warn(
      "app-detail.js: #detail, #process, atau #queue tidak ditemukan."
    );
    return;
  }

  function getDetail() {
    return detailInput.value.trim();
  }

  async function copyDetail(detail) {
    if (!detail) return false;

    try {
      await navigator.clipboard.writeText(detail);
      return true;
    } catch (err) {
      try {
        const temp = document.createElement("textarea");

        temp.value = detail;
        temp.style.position = "fixed";
        temp.style.opacity = "0";

        document.body.appendChild(temp);

        temp.focus();
        temp.select();

        const ok = document.execCommand("copy");

        temp.remove();

        return ok;
      } catch (fallbackErr) {
        return false;
      }
    }
  }

  function refreshDetails() {
    const detail = getDetail();

    queue.querySelectorAll(".item").forEach(function (item) {

      // Item "BUKA SEMUA" tidak perlu detail per URL.
      if (item.classList.contains("bulk-item")) return;

      const content = item.querySelector(".item-content");

      if (!content) return;

      let detailEl = content.querySelector(".app-detail-preview");

      if (!detailEl) {
        detailEl = document.createElement("div");

        detailEl.className =
          "detail-preview app-detail-preview";

        content.appendChild(detailEl);
      }

      detailEl.textContent =
        "Detail: " + (detail || "-");

      detailEl.title = detail || "";
    });
  }

  /*
   * Setelah tombol PROSES URL ditekan,
   * app.js membuat daftar URL.
   */
  processBtn.addEventListener("click", function () {

    setTimeout(refreshDetails, 50);
    setTimeout(refreshDetails, 300);
    setTimeout(refreshDetails, 800);

  });

  /*
   * Pantau perubahan daftar URL.
   */
  const observer = new MutationObserver(function () {
    refreshDetails();
  });

  observer.observe(queue, {
    childList: true,
    subtree: true
  });

  /*
   * Jika detail laporan diubah,
   * semua preview ikut diperbarui.
   */
  detailInput.addEventListener("input", function () {
    refreshDetails();
  });

  /*
   * Tombol BUKA LAPORAN.
   *
   * Detail akan disalin ke clipboard terlebih dahulu.
   *
   * Karena halaman Google Safe Browsing berada
   * pada domain berbeda, dashboard tidak dapat
   * mengisi textarea Google secara otomatis.
   */
  queue.addEventListener("click", async function (event) {

    const button =
      event.target.closest(".open:not(.open-all)");

    if (!button) return;

    const detail = getDetail();

    if (!detail) return;

    const copied = await copyDetail(detail);

    if (copied) {

      const oldText = button.textContent;

      button.textContent = "✓ DETAIL DISALIN";

      setTimeout(function () {

        /*
         * Jangan mengganggu status SUDAH DIBUKA
         * milik app.js.
         */
        if (!button.classList.contains("opened")) {
          button.textContent =
            oldText || "BUKA LAPORAN";
        }

      }, 1000);
    }
  });

  /*
   * Jalankan pertama kali.
   */
  refreshDetails();

})();
