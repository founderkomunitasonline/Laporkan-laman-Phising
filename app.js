const REPORT_BASE = "https://safebrowsing.google.com/safebrowsing/report_phish/?hl=id&url=";

const $ = (id) => document.getElementById(id);
// ===============================
// MEMORI DETAIL LAPORAN
// ===============================
const DETAIL_MEMORY_KEY = "basmi_phising_detail";

const DEFAULT_DETAIL =
  "URL ini diduga terkait aktivitas phishing yang berpotensi menipu pengguna atau mengumpulkan informasi sensitif secara tidak sah. Mohon dilakukan pemeriksaan lebih lanjut.";

// Ambil detail yang tersimpan
try {
  const savedDetail = localStorage.getItem(DETAIL_MEMORY_KEY);

  if (savedDetail && savedDetail.trim()) {
    detailTextarea.value = savedDetail;
  } else {
    detailTextarea.value = DEFAULT_DETAIL;
    localStorage.setItem(DETAIL_MEMORY_KEY, DEFAULT_DETAIL);
  }
} catch (e) {
  detailTextarea.value = DEFAULT_DETAIL;
}

// Simpan otomatis setiap kali detail diubah
detailTextarea.addEventListener("input", function () {
  try {
    localStorage.setItem(
      DETAIL_MEMORY_KEY,
      detailTextarea.value
    );
  } catch (e) {
    // Abaikan jika browser tidak mengizinkan localStorage
  }
});
const urlInput = $("urlInput");
const detailInput = $("detailInput");
const queue = $("queue");

let reports = [];

function cleanUrls(text){
  const lines = text.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  const unique = [...new Set(lines)];
  return unique.slice(0,100);
}

function validUrl(value){
  try{
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  }catch{
    return false;
  }
}

function reportUrl(url){
  return REPORT_BASE + encodeURIComponent(url);
}

function updateStats(){
  $("totalUrl").textContent = reports.length;
  $("validUrl").textContent = reports.filter(x => x.valid).length;
  $("invalidUrl").textContent = reports.filter(x => !x.valid).length;
  $("openedUrl").textContent = reports.filter(x => x.opened).length;
  $("allCount").textContent = `${reports.length} URL`;
}

function render(){
  queue.innerHTML = "";

  reports.forEach((item,index)=>{
    const row = document.createElement("div");
    row.className = "item";

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = index + 1;

    const info = document.createElement("div");
    const url = document.createElement("div");
    url.className = "url";
    url.textContent = item.url;
    const detail = document.createElement("div");
    detail.className = "detail-line";
    detail.textContent = `Detail: ${item.detail || "-"}`;
    info.append(url,detail);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const copy = document.createElement("button");
    copy.className = "copy";
    copy.textContent = "SALIN DETAIL";
    copy.onclick = async () => {
      await navigator.clipboard.writeText(item.detail || "");
      copy.textContent = "TERSALIN";
      setTimeout(()=>copy.textContent="SALIN DETAIL",1200);
    };

    const open = document.createElement("button");
    open.className = item.opened ? "opened" : "open";
    open.textContent = item.opened ? "✓ SUDAH DIBUKA" : "BUKA LAPORAN";
    open.onclick = () => {
      window.open(reportUrl(item.url), "_blank", "noopener,noreferrer");
      item.opened = true;
      render();
      updateStats();
    };

    actions.append(copy,open);
    row.append(num,info,actions);
    queue.appendChild(row);
  });

  $("openAllBtn").disabled = reports.length === 0;
  $("openAllBtn").textContent = reports.length ? "↗ BUKA SEMUA" : "↗ BUKA SEMUA";
  updateStats();
}

$("processBtn").onclick = () => {
  const urls = cleanUrls(urlInput.value);
  const detail = detailInput.value.trim();

  reports = urls.map(url => ({
    url,
    detail,
    valid: validUrl(url),
    opened:false
  }));

  render();
};

$("clearBtn").onclick = () => {
  urlInput.value = "";
  detailInput.value = "";
  reports = [];
  $("detailCount").textContent = "0";
  render();
};

detailInput.addEventListener("input",()=>{
  $("detailCount").textContent = detailInput.value.length;
});

$("openAllBtn").onclick = () => {
  // Browser dapat memblokir sebagian popup jika terlalu banyak tab dibuka.
  // Tombol satu-per-satu tetap tersedia sebagai cara yang paling stabil.
  reports.forEach((item,index)=>{
    setTimeout(()=>{
      const win = window.open(reportUrl(item.url), "_blank");
      if(win) item.opened = true;
      if(index === reports.length - 1){
        render();
      }
    }, index * 180);
  });
};

render();
