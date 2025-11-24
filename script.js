const dollarInput = document.getElementById('dollar');
const convertBtn = document.getElementById('convert');
const resultSpan = document.getElementById('result');
const rateDiv = document.querySelector('.rate');
 
convertBtn.addEventListener('click', () => {
    // Ambil text dari <p class="rate"> misal "RATE : 15000"
    let rateText = rateDiv.textContent;
    let rateMatch = rateText.match(/[\d,.]+/); // ambil angka
    if(!rateMatch) {
        alert('Rate belum tersedia!');
        resultSpan.textContent = '-';
        return;
    }
 
    let rate = parseFloat(rateMatch[0].replace(/,/g, '')); // hapus koma
    let dollar = parseFloat(dollarInput.value);
 
    if(isNaN(dollar)) {
        resultSpan.textContent = '-';
        alert('Masukkan jumlah Dollar yang valid!');
        return;
    }
 
    const hasil = rate * dollar;
    resultSpan.textContent = hasil.toLocaleString('id-ID');
});
