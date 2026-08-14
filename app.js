(function () {
  "use strict";

  /*
    BASMI PHISING
    app.js = fungsi tambahan saja.

    Tidak mengambil alih fungsi utama index.html.
    Index.html tetap menangani:
    - proses URL
    - validasi URL
    - daftar laporan
    - tombol buka laporan
    - statistik
  */

  const urlsInput = document.getElementById("urls");
  const detailInput = document.getElementById("detail");
  const queue = document.getElementById("queue");

  if (!urlsInput || !detailInput || !queue) {
    console.warn("BASMI PHISING: elemen dashboard tidak ditemukan.");
    return;
  }

  /*
    Menyalin detail laporan.
  */
  async function copyDetail(detail) {
    if (!detail) return;

    try {
      await navigator.clipboard.writeText(detail);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");

      textarea.value = detail;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
      } catch (e) {}

      textarea.remove();

      return true;
    }
  }

  /*
    Tambahkan fungsi SALIN DETAIL ke setiap laporan.
  */
  function updateReportButtons() {

    const detail = detailInput.value.trim();

    queue.querySelectorAll(".item").forEach(function (item) {

      /*
        Jangan mengubah tombol ALL.
      */
      if (item.classList.contains("bulk-item")) {
        return;
      }

      /*
        Cari area tombol.
        Versi index.html kita menggunakan tombol langsung
        di dalam item.
      */
      const buttons = item.querySelectorAll("button");

      if (!buttons.length) {
        return;
      }

      /*
        Cegah membuat tombol salin berkali-kali.
      */
      if (item.querySelector(".copy-detail-btn")) {
        return;
      }

      const copyButton = document.createElement("button");

      copyButton.type = "button";
      copyButton.className = "copy-detail-btn";
      copyButton.textContent = "SALIN DETAIL";

      copyButton.addEventListener("click", async function (event) {

        event.preventDefault();
        event.stopPropagation();

        const text = detailInput.value.trim();

        if (!text) {
          alert("Detail laporan masih kosong.");
          return;
        }

        const copied = await copyDetail(text);

        if (copied) {

          copyButton.textContent = "✓ TERSALIN";

          setTimeout(function () {
            copyButton.textContent = "SALIN DETAIL";
          }, 1200);

        }

      });

      /*
        Letakkan sebelum tombol BUKA LAPORAN.
      */
      const openButton = item.querySelector(".open");

      if (openButton) {
        openButton.parentNode.insertBefore(
          copyButton,
          openButton
        );
      } else {
        item.appendChild(copyButton);
      }

    });

  }

  /*
    Setelah PROSES URL selesai,
    index.html membuat daftar item.
  */
  const observer = new MutationObserver(function () {

    if (queue.children.length) {
      updateReportButtons();
    }

  });

  observer.observe(queue, {
    childList: true,
    subtree: true
  });

  /*
    Jika detail laporan diubah,
    tidak perlu mengubah fungsi utama.
  */
  detailInput.addEventListener("input", function () {

    /*
      Hanya memperbarui fungsi tambahan.
    */
    updateReportButtons();

  });

})();
