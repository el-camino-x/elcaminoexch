const dollarInput = document.getElementById('dollar');
const convertBtn = document.getElementById('convert');
const resultSpan = document.getElementById('result');
const rateDiv = document.querySelector('.rate');
const lastUpdatedDiv = document.querySelector('.last-updated');

let currentRate = null;

fetch(
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIefvbp0yDlYWWzhw-gnVjKgyh0GvADomMb_0yqhXpArd-29mVfVNWdHACI8kJ9TtPd1LBTOVW7YEc/pub?output=csv',
)
  .then((res) => res.text())
  .then((csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV kosong atau tidak lengkap');

    const headers = lines[0].split(',');
    const values = lines[1].split(',');

    const rateIndex = headers.findIndex(
      (h) => h.toLowerCase().trim() === 'rate',
    );
    const lastUpdatedIndex = headers.findIndex(
      (h) => h.toLowerCase().trim() === 'lastupdated',
    );

    if (rateIndex === -1) throw new Error('Kolom RATE tidak ditemukan');
    if (lastUpdatedIndex === -1)
      throw new Error('Kolom LASTUPDATED tidak ditemukan');

    const rateValue = values[rateIndex]?.replace(/"/g, '').trim() || '0';
    const lastUpdatedValue =
      values[lastUpdatedIndex]?.replace(/"/g, '').trim() || '-';

    currentRate = parseFloat(rateValue.replace(/,/g, '')) || 0;

    rateDiv.textContent = `RATE : Rp${currentRate.toLocaleString('id-ID')}`;
    lastUpdatedDiv.textContent = `Last Updated : ${lastUpdatedValue}`;
  })
  .catch((err) => {
    console.error('Gagal fetch Google Sheet CSV:', err);
    currentRate = 0;
    rateDiv.textContent = 'RATE : -';
    lastUpdatedDiv.textContent = 'Last Updated : -';
  });

convertBtn.addEventListener('click', () => {
  if (currentRate === null || currentRate === 0) {
    alert('Rate belum tersedia!');
    resultSpan.textContent = '-';
    return;
  }

  const dollar = parseFloat(dollarInput.value);
  if (isNaN(dollar)) {
    alert('Masukkan jumlah Dollar yang valid!');
    resultSpan.textContent = '-';
    return;
  }

  const hasil = currentRate * dollar;
  resultSpan.textContent = hasil.toLocaleString('id-ID');
});

/* ===========================
   ANTI INSPECT + POPUP MEWAH
   =========================== */

// Create popup
const overlay = document.createElement("div");
overlay.id = "inspectAlertOverlay";
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background: rgba(0,0,20,0.6);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`;
document.body.appendChild(overlay);

const box = document.createElement("div");
box.id = "inspectAlertBox";
box.style.cssText = `
  background: #0a0f1d;
  padding: 25px 35px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(0,150,255,0.4);
  box-shadow: 0 0 20px rgba(0,150,255,0.4);
  color: white;
  font-family: 'Poppins', sans-serif;
  width: 300px;
`;
box.innerHTML = `
  <h2 style="font-size:20px;margin-bottom:10px;color:#70c3ff;text-shadow:0 0 6px rgba(0,150,255,0.5);">⚠️ Warning!</h2>
  <p style="font-size:14px;opacity:.85;margin-bottom:18px;">Inspect element terdeteksi.<br>Mohon tutup DevTools.</p>
  <button id="closeInspectBtn" style="padding:10px 15px;background:rgba(0,150,255,0.3);border:none;border-radius:10px;color:white;cursor:pointer;font-weight:600;">Tutup</button>
`;
overlay.appendChild(box);

// Close button
document.addEventListener("click", (e) => {
  if (e.target.id === "closeInspectBtn") {
    overlay.style.display = "none";
  }
});

// Show popup
function showInspectWarning() {
  overlay.style.display = "flex";
}

// Block right click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showInspectWarning();
});

// Block combos
document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
    showInspectWarning();
  }
});

// Detect DevTools
(function() {
  const threshold = 160;
  setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      showInspectWarning();
    }
  }, 800);
})();
