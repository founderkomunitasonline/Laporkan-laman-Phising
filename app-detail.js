(function () {
  "use strict";
  const detailInput = document.getElementById("detailInput");
  if (!detailInput) return;
  const STORAGE_KEY = "basmi_phising_detail";
  const DEFAULT_DETAIL = "URL ini diduga terkait aktivitas phishing yang berpotensi menipu pengguna atau mengumpulkan informasi sensitif secara tidak sah. Mohon dilakukan pemeriksaan lebih lanjut.";
  let savedDetail = "";
  try { savedDetail = localStorage.getItem(STORAGE_KEY) || ""; } catch (error) {}
  if (savedDetail.trim()) detailInput.value = savedDetail;
  else { detailInput.value = DEFAULT_DETAIL; try { localStorage.setItem(STORAGE_KEY, DEFAULT_DETAIL); } catch (error) {} }
  detailInput.dispatchEvent(new Event("input"));
  detailInput.addEventListener("input", function () { try { localStorage.setItem(STORAGE_KEY, detailInput.value); } catch (error) {} });
})();
