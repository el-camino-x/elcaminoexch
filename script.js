// ======= Ambil elemen =======
const dollarInput = document.getElementById('dollar');
const convertBtn = document.getElementById('convert');
const resultSpan = document.getElementById('result');
const rateDiv = document.querySelector('.rate');
const lastUpdatedDiv = document.querySelector('.last-updated');

let currentRate = null; // akan diupdate dari Google Sheet

// ======= Fetch RATE & LAST UPDATED dari Google Sheet CSV =======
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRIefvbp0yDlYWWzhw-gnVjKgyh0GvADomMb_0yqhXpArd-29mVfVNWdHACI8kJ9TtPd1LBTOVW7YEc/pub?output=csv')
  .then(res => res.text())
  .then(csvText => {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');
      const values = lines[1].split(',');

      // cari index kolom Rate & LastUpdated
      const rateIndex = headers.findIndex(h => h.toLowerCase() === 'rate');
      const lastUpdatedIndex = headers.findIndex(h => h.toLowerCase() === 'lastupdated');

      // ambil langsung isi cell (hilangkan tanda kutip, trim spasi)
      const rateValue = values[rateIndex]?.replace(/"/g,'').trim() || '-';
      const lastUpdatedValue = values[lastUpdatedIndex]?.replace(/"/g,'').trim() || '-';

      rateDiv.textContent = `RATE : Rp${parseFloat(rateValue).toLocaleString('id-ID')}`;
      lastUpdatedDiv.textContent = `Last Updated : ${lastUpdatedValue}`;
  })
  .catch(err => {
      console.error('Gagal fetch Google Sheet CSV:', err);
      rateDiv.textContent = 'RATE : -';
      lastUpdatedDiv.textContent = 'Last Updated : -';
  });



// ======= Kalkulator =======
convertBtn.addEventListener('click', () => {
    if(currentRate === null) {
        alert('Rate belum tersedia!');
        resultSpan.textContent = '-';
        return;
    }

    const dollar = parseFloat(dollarInput.value);
    if(isNaN(dollar)) {
        alert('Masukkan jumlah Dollar yang valid!');
        resultSpan.textContent = '-';
        return;
    }

    const hasil = currentRate * dollar;
    resultSpan.textContent = hasil.toLocaleString('id-ID');
});
