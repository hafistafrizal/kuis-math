let skor = 0        // Score Pemain
let sisaWaktu = 0   // Waktu Pemain
let jawabanUser     // Jawaban dari user
let jawabanBenar    // Jawaban yang Benar
let mesinWaktu      
let alarmText

// Tangkap Parameter dari URL
const querySring = window.location.search
const parameter = new URLSearchParams(querySring)

const jenisOperasi = parameter.get("jenis-operasi")
const speedTimer   = parameter.get("speed-timer")
const batasAngka   = Number(parameter.get("angka-level")) || 1
const namaUser     = String(parameter.get("nama-user"))
const modeKuis     = String(parameter.get("mode-kuis"))

const layarKuis     = document.getElementById("layar-kuis")     // layar-kuis
const layarJawaban  = document.getElementById("jawaban-layar")  // jawaban-layar
const areaSoal      = document.getElementById("area-soal")      // area-soal
const areaJawaban   = document.getElementById("area-jawaban")   // area-jawaban
const pesanTengah   = document.getElementById("pesan-tengah")   // pesan-tengah
const papanWaktu    = document.getElementById("papan-waktu")    // papan-waktu
const papanSkor     = document.getElementById("papan-skor")     // papan-skor
const indikatorSkor = document.getElementById("indikator-skor") // indikator-skor
const buttonGenerate = document.getElementById("generate-kuis") // generate-kuis
const buttonAksi    = document.getElementById("grub-aksi")      // grub-aksi
const nilaiJawaban  = document.getElementById("jawaban-user")

inisialisasiGames() // Check Operasi dan Mode games

function inisialisasiGames() {
    if (speedTimer == "slow") sisaWaktu = 15
    else if (speedTimer == "medium") sisaWaktu = 10
    else if (speedTimer == "fast") sisaWaktu = 5
    else sisaWaktu = 10

    papanWaktu.innerText = sisaWaktu + " Dtk"
    document.getElementById("nama-user").innerText = ">Nama: " + namaUser

    // CHECK OPERASI
    if (jenisOperasi == "penjumlahan"){
        document.getElementById("header-operasi").innerText = "Quiz Penjumlahan"
        document.getElementById("operasi").innerText = "+"
    } else if (jenisOperasi == "pengurangan") {
        document.getElementById("header-operasi").innerText = "Quiz Pengurangan"
        document.getElementById("operasi").innerText = "-"
    } else if (jenisOperasi == "perkalian") {
        document.getElementById("header-operasi").innerText = "Quiz Perkalian"
        document.getElementById("operasi").innerText = "x"
    } else if (jenisOperasi == "pembagian") {
        document.getElementById("header-operasi").innerText = "Quiz Pembagian"
        document.getElementById("operasi").innerText = "/"
    }

    // EVENT LISTENER
    nilaiJawaban.addEventListener('input', function(event) {
        layarJawaban.innerText = event.target.value
    })
}


// Timer per Detik
function mulaiTimer() {
    inisialisasiGames()
    papanWaktu.innerText = sisaWaktu + " Dtk"
    
    mesinWaktu = setInterval(function() {
    sisaWaktu = sisaWaktu - 1
        
    if (sisaWaktu < 0) {
        clearInterval(mesinWaktu)
        document.getElementById("nilai1").innerText = "0"
        document.getElementById("nilai2").innerText = "0"

        layarJawaban.innerText = ""
        buttonGenerate.style.display = "inline-block"
        buttonAksi.style.display = "none"

        setTimeout(function(){
            alert("waktu sudah habis")
        }, 50)
        } else {
        papanWaktu.innerText = sisaWaktu + " Dtk"
        }
    }, 1000)
}


function hitungJawaban() {
    let angkaKe1 = Number(document.getElementById("nilai1").innerText)
    let angkaKe2 = Number(document.getElementById("nilai2").innerText)

    if(jenisOperasi == "penjumlahan") jawabanBenar = angkaKe1 + angkaKe2
    else if(jenisOperasi == "pengurangan") jawabanBenar = angkaKe1 - angkaKe2
    else if(jenisOperasi == "perkalian") jawabanBenar = angkaKe1 * angkaKe2
    else if(jenisOperasi == "pembagian") jawabanBenar = angkaKe1 / angkaKe2
}
    

function pilihanGanda() {
    let pilihJawaban = []
    let angkaPalsu
    pilihJawaban.push(jawabanBenar) // Jawaban Benar masuk Array
        
    while(pilihJawaban.length < 4) {
        
        let selisihAngka = Math.floor(Math.random() * 7) - 3;
        angkaPalsu = jawabanBenar + selisihAngka
        
        if(angkaPalsu !== jawabanBenar && angkaPalsu > 0 && !pilihJawaban.includes(angkaPalsu)) {
            pilihJawaban.push(angkaPalsu)
        }
    } 
        
    // Mengacak index Array Jawaban Benar
    pilihJawaban.sort(() => Math.random() - 0.5);

    document.getElementById("aksi-1").innerText = pilihJawaban[0]
    document.getElementById("aksi-2").innerText = pilihJawaban[1]
    document.getElementById("aksi-3").innerText = pilihJawaban[2]
    document.getElementById("aksi-4").innerText = pilihJawaban[3]
}


function inputJawaban() {
    if(nilaiJawaban.value == "") return

    checkAnswer(nilaiJawaban.value)
    nilaiJawaban.value = ""
}


function buatAngkaSoal() {
    let numberRange = Math.floor(Math.random() * batasAngka) + 1    // Random Range Number
    let numberRandom = Math.floor(Math.random() * 9) + 1            // Random Number

    if(jenisOperasi == "penjumlahan") {
        if (Math.random() < 0.5) {
            document.getElementById("nilai1").innerText = numberRange
            document.getElementById("nilai2").innerText = numberRandom
        } else {
            document.getElementById("nilai1").innerText = numberRandom
            document.getElementById("nilai2").innerText = numberRange
        }

    } else if (jenisOperasi == "pengurangan") {
        if (numberRange < numberRandom) {
            document.getElementById("nilai1").innerText = numberRandom
            document.getElementById("nilai2").innerText = numberRange
        } else {
            document.getElementById("nilai1").innerText = numberRange
            document.getElementById("nilai2").innerText = numberRandom
        }

    } else if (jenisOperasi == "perkalian") {
        if (Math.random() < 0.5) {
            document.getElementById("nilai1").innerText = numberRange
            document.getElementById("nilai2").innerText = numberRandom
        } else {
            document.getElementById("nilai1").innerText = numberRandom
            document.getElementById("nilai2").innerText = numberRange
        }

    } else if (jenisOperasi == "pembagian") {
        let angkaX = numberRandom
        let angkaY = numberRange
        let hasilKali = angkaX * angkaY

        document.getElementById("nilai1").innerText = hasilKali
        document.getElementById("nilai2").innerText = angkaX
    }
}

// Generate Number
function generateKuis() {
    clearTimeout(alarmText)
    clearInterval(mesinWaktu)
    mulaiTimer()

    buttonGenerate.style.display = "none"
    areaSoal.style.display = "flex";
    areaJawaban.style.display = "block";
    pesanTengah.style.display = "none";
    
    indikatorSkor.innerText = ""
    indikatorSkor.classList.remove("text-muncul")
    buttonAksi.style.display = "block"
    
    buatAngkaSoal() // Function buat Angka Random Soal

    hitungJawaban() // Function Hitung Jawaban

    // CHECK MODE
    if(modeKuis === "pilih-jawaban") {
        document.getElementById("mode-pilihan").style.display = "block"
        document.getElementById("mode-input").style.display = "none"
        pilihanGanda()
        
    } else if(modeKuis === "input-jawaban") {
        document.getElementById("mode-input").style.display = "block"
        document.getElementById("mode-pilihan").style.display = "none"

        document.getElementById("jawaban-user").value = ""
        document.getElementById("jawaban-user").focus()

    }
}

// Layar Kuis Kedip
function kedipLayar() {
    layarKuis.style.backgroundColor = "#0f380f"
    layarKuis.style.color = "#8bac0f"

    setTimeout(function() {
        layarKuis.style.backgroundColor = ""
        layarKuis.style.color = ""
    }, 100) 
}

// Fungsi Cek Jawaban
function checkAnswer(pilihanUser) {
    let jawabanUser = Number(pilihanUser)
    layarJawaban.innerText = jawabanUser;

    // Cek Jawaban Benar atau Salah
    if(jawabanUser === jawabanBenar) {

        indikatorSkor.innerText = "+5"
        indikatorSkor.classList.add("text-muncul")

        skor += 5
        papanSkor.innerText = skor + " Skor"

        kedipLayar()

        setTimeout(function() {
            layarJawaban.innerText = ""
            generateKuis()
        }, 600);
            
    } else {
        areaSoal.style.display = "none";
        areaJawaban.style.display = "none";
        pesanTengah.style.display = "block";
        layarJawaban.innerText = ""

        skor -= 3
        if (skor < 0) skor = 0

        indikatorSkor.innerText = "-3"
        indikatorSkor.classList.add("text-muncul")
        papanSkor.innerText = skor + " Skor"
        layarKuis.classList.add("layar-error");

        alarmText = setTimeout(function(){
            layarKuis.classList.remove("layar-error")
            layarJawaban.innerText = ""
            generateKuis() // Fungsi Generate Kuis/Soal
        }, 800)
    }  
}

// Fungsi Reset Form
function formReset() {
    clearInterval(mesinWaktu)
    buttonGenerate.style.display = "inline-block"
    buttonAksi.style.display = "none"
    papanWaktu.innerText = sisaWaktu + " Dtk"
}

function backHome() {
    window.location.href = "./home.html"
}
