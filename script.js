// ======= Ambil elemen =======
const dollarInput = document.getElementById('dollar');
const convertBtn = document.getElementById('convert');
const resultSpan = document.getElementById('result');
const rateDiv = document.querySelector('.rate');
const lastUpdatedDiv = document.querySelector('.last-updated');

let currentRate = null; 

fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRIefvbp0yDlYWWzhw-gnVjKgyh0GvADomMb_0yqhXpArd-29mVfVNWdHACI8kJ9TtPd1LBTOVW7YEc/pub?output=csv')
  .then(res => res.text())
  .then(csvText => {
      const lines = csvText.trim().split('\n');
      if(lines.length < 2) throw new Error('CSV kosong atau tidak lengkap');

      const headers = lines[0].split(',');
      const values = lines[1].split(',');

      const rateIndex = headers.findIndex(h => h.toLowerCase().trim() === 'rate');
      const lastUpdatedIndex = headers.findIndex(h => h.toLowerCase().trim() === 'lastupdated');

      if(rateIndex === -1) throw new Error('Kolom RATE tidak ditemukan');
      if(lastUpdatedIndex === -1) throw new Error('Kolom LASTUPDATED tidak ditemukan');

      const rateValue = values[rateIndex]?.replace(/"/g,'').trim() || '0';
      const lastUpdatedValue = values[lastUpdatedIndex]?.replace(/"/g,'').trim() || '-';

      currentRate = parseFloat(rateValue.replace(/,/g,'')) || 0;

      rateDiv.textContent = `RATE : Rp${currentRate.toLocaleString('id-ID')}`;
      lastUpdatedDiv.textContent = `Last Updated : ${lastUpdatedValue}`;
  })
  .catch(err => {
      console.error('Gagal fetch Google Sheet CSV:', err);
      currentRate = 0;
      rateDiv.textContent = 'RATE : -';
      lastUpdatedDiv.textContent = 'Last Updated : -';
  });

convertBtn.addEventListener('click', () => {
    if(currentRate === null || currentRate === 0) {
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
