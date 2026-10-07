export function buatAngkaSoal(jenisOperasi, batasAngka) {
    let numberRange = Math.floor(Math.random() * batasAngka) + 1;    // Random Range Number
    let numberRandom = Math.floor(Math.random() * 9) + 1;            // Random Number
    let nilai1, nilai2;

    if(jenisOperasi == "penjumlahan") {
        if (Math.random() < 0.5) {
            nilai1 = numberRange;
            nilai2 = numberRandom;
        } else {
            nilai1 = numberRandom;
            nilai2 = numberRange;
        }

    } else if (jenisOperasi == "pengurangan") {
        if (numberRange < numberRandom) {
            nilai1 = numberRandom;
            nilai2 = numberRange;
        } else {
            nilai1 = numberRange;
            nilai2 = numberRandom;
        }

    } else if (jenisOperasi == "perkalian") {
        if (Math.random() < 0.5) {
            nilai1 = numberRange;
            nilai2 = numberRandom;
        } else {
            nilai1 = numberRandom;
            nilai2 = numberRange;
        }

    } else if (jenisOperasi == "pembagian") {
        let angkaX = numberRandom;
        let angkaY = numberRange;
        let hasilKali = angkaX * angkaY;

        nilai1 = hasilKali;
        nilai2 = angkaX;
    }

    return { nilai1, nilai2 };
}


export function hitungJawaban(nilai1, nilai2, jenisOperasi) {
    let jawabanBenar = 0;

    if(jenisOperasi == "penjumlahan") jawabanBenar = nilai1 + nilai2;
    else if(jenisOperasi == "pengurangan") jawabanBenar = nilai1 - nilai2;
    else if(jenisOperasi == "perkalian") jawabanBenar = nilai1 * nilai2;
    else if(jenisOperasi == "pembagian") jawabanBenar = nilai1 / nilai2;

    return jawabanBenar;
}


export function buatPilihanGanda(jawabanBenar) {
    let pilihJawaban = [];
    let angkaPalsu;
    pilihJawaban.push(jawabanBenar); // Jawaban Benar masuk Array
        
    while(pilihJawaban.length < 4) {
        
        let selisihAngka = Math.floor(Math.random() * 7) - 3;
        angkaPalsu = jawabanBenar + selisihAngka;
        
        if(angkaPalsu !== jawabanBenar && angkaPalsu > 0 && !pilihJawaban.includes(angkaPalsu)) {
            pilihJawaban.push(angkaPalsu);
        }
    } 
        
    // Mengacak index Array Jawaban Benar
    pilihJawaban.sort(() => Math.random() - 0.5);

    return pilihJawaban;
}