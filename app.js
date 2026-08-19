const REPORT_BASE = "https://safebrowsing.google.com/safebrowsing/report_phish/?hl=id&url=";
const REPORT_STORAGE_KEY = "basmi_phising_reports";
const $ = (id) => document.getElementById(id);
const urlInput = $("urlInput");
const detailInput = $("detailInput");
const queue = $("queue");
let reports = [];
function cleanUrls(text){const lines=text.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);return [...new Set(lines)].slice(0,100)}
function validUrl(value){try{const u=new URL(value);return u.protocol==="http:"||u.protocol==="https:"}catch{return false}}
function reportUrl(url){return REPORT_BASE+encodeURIComponent(url)}
function saveReports(){try{localStorage.setItem(REPORT_STORAGE_KEY,JSON.stringify(reports))}catch(error){}}
function updateStats(){$("totalUrl").textContent=reports.length;$('validUrl').textContent=reports.filter(x=>x.valid).length;$('invalidUrl').textContent=reports.filter(x=>!x.valid).length;$('openedUrl').textContent=reports.filter(x=>x.opened).length;$('allCount').textContent=`${reports.length} URL`}
function render(){queue.innerHTML="";reports.forEach((item,index)=>{const row=document.createElement("div");row.className="item";const num=document.createElement("div");num.className="num";num.textContent=index+1;const info=document.createElement("div");const url=document.createElement("div");url.className="url";url.textContent=item.url;const detail=document.createElement("div");detail.className="detail-line";detail.textContent=`Detail: ${item.detail||"-"}`;info.append(url,detail);const actions=document.createElement("div");actions.className="item-actions";const copy=document.createElement("button");copy.className="copy";copy.textContent="SALIN DETAIL";copy.onclick=async()=>{try{await navigator.clipboard.writeText(item.detail||"");copy.textContent="TERSALIN";setTimeout(()=>copy.textContent="SALIN DETAIL",1200)}catch{copy.textContent="GAGAL";setTimeout(()=>copy.textContent="SALIN DETAIL",1200)}};const open=document.createElement("button");open.className=item.opened?"opened":"open";open.textContent=item.opened?"✓ SUDAH DIBUKA":"BUKA LAPORAN";open.onclick=()=>{window.open(reportUrl(item.url),"_blank","noopener,noreferrer");item.opened=true;saveReports();render();updateStats()};actions.append(copy,open);row.append(num,info,actions);queue.appendChild(row)});$("openAllBtn").disabled=reports.length===0;$("openAllBtn").textContent="↗ BUKA SEMUA";updateStats()}
$("processBtn").onclick=()=>{const urls=cleanUrls(urlInput.value);const detail=detailInput.value.trim();reports=urls.map(url=>({url,detail,valid:validUrl(url),opened:false}));saveReports();render()};
$("clearBtn").onclick=()=>{urlInput.value="";detailInput.value="";reports=[];$("detailCount").textContent="0";saveReports();render()};
detailInput.addEventListener("input",()=>{$("detailCount").textContent=detailInput.value.length});
$("openAllBtn").onclick=()=>{reports.forEach((item,index)=>{setTimeout(()=>{const win=window.open(reportUrl(item.url),"_blank");if(win)item.opened=true;if(index===reports.length-1){saveReports();render()}},index*180)})};
try{const saved=JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY)||"[]");if(Array.isArray(saved))reports=saved}catch(error){reports=[]}
render();
// ===== TRIGGER ANIMASI SAAT LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard dengan animasi siap!');
    
    // Tambah class buat trigger animasi ke elemen utama
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
        dashboard.style.animation = 'fadeIn 1s ease-out';
    }
});
showToast('✅ URL berhasil diproses!', 'success');
showToast('⚠️ URL tidak valid!', 'error');
showToast('🔍 Memproses URL...', 'info');
