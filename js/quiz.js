import { NYAWA_DEFAULT, WAKTU_SOAL_DETIK, SCORE_JAWAB_BENAR, DURASI_TIMER } from "./config.js";
import { updateTampilanHealt, kedipLayar } from "./ui.js";
import { buatAngkaSoal, hitungJawaban, buatPilihanGanda } from "./soal.js";
import { simpanQueryLama, simpanDataSelesai, updateAmbilRekor } from "./storage.js";

let skor = 0;
let jawabanBenar;
let mesinWaktu;      
let alarmText;

let waktuGlobal = 0;
let waktuSoal = WAKTU_SOAL_DETIK;
let timerBerjalan = false;
let sedangMengecek = false;
let live = NYAWA_DEFAULT;

const queryString   = window.location.search;
const parameter     = new URLSearchParams(queryString);

const jenisOperasi  = parameter.get("jenis-operasi");
const speedTimer    = parameter.get("speed-timer");
const batasAngka    = Number(parameter.get("angka-level")) || 1;
const namaUser      = String(parameter.get("nama-user"));
const modeKuis      = String(parameter.get("mode-kuis"));

const layarKuis     = document.getElementById("layar-kuis");    
const layarJawaban  = document.getElementById("jawaban-layar");
const areaSoal      = document.getElementById("area-soal");    
const areaJawaban   = document.getElementById("area-jawaban");  
const pesanTengah   = document.getElementById("pesan-tengah");
const papanWaktuGlobal  = document.getElementById("waktu-global");
const papanWaktuSoal    = document.getElementById("waktu-soal");
const papanSkor         = document.getElementById("papan-skor");  
const indikatorSkor     = document.getElementById("indikator-skor");
const buttonGenerate    = document.getElementById("generate-kuis");
const buttonAksi        = document.getElementById("grub-aksi"); 
const nilaiJawaban      = document.getElementById("jawaban-user");


if(document.getElementById("area-kuis")){
    inisialisasiGames() // Check Operasi dan Mode games
}

function inisialisasiGames() {
    simpanQueryLama(window.location.search);

    live = NYAWA_DEFAULT;
    updateTampilanHealt(live);

    waktuGlobal = DURASI_TIMER[speedTimer] || 90;

    document.getElementById("level-game").innerText = batasAngka;
    document.getElementById("nama-user").innerText = namaUser;
    papanWaktuGlobal.innerText = waktuGlobal;
    papanWaktuSoal.innerText = waktuSoal + " Detik";

    // CHECK OPERASI
    if (jenisOperasi == "penjumlahan"){
        document.getElementById("operasi").innerText = "+";
    } else if (jenisOperasi == "pengurangan") {
        document.getElementById("operasi").innerText = "-";
    } else if (jenisOperasi == "perkalian") {
        document.getElementById("operasi").innerText = "x";
    } else if (jenisOperasi == "pembagian") {
        document.getElementById("operasi").innerText = "/";
    }

    // EVENT LISTENER
    if(document.getElementById("area-jawaban") &&  nilaiJawaban) {
        nilaiJawaban.addEventListener('input', function(event) {
            layarJawaban.innerText = event.target.value;
        })
    }
}


// Timer per Detik
function mulaiTimer() {
    inisialisasiGames();
    papanWaktuGlobal.innerText = waktuGlobal;
    
    mesinWaktu = setInterval(function() {
        if (sedangMengecek) return;

        waktuGlobal--;
        waktuSoal--;

        papanWaktuGlobal.innerText = waktuGlobal;
        papanWaktuSoal.innerText = waktuSoal + " Detik";
        
        if (waktuGlobal <= 0) {
            tampilkanGameOver();
        }
        else if (waktuSoal <= 0) {
            sedangMengecek = true;

            live--;
            updateTampilanHealt(live);

            areaSoal.style.display = "none";
            areaJawaban.style.display = "none";
            pesanTengah.innerText = "TIME OUT!";
            pesanTengah.style.display = "block";

            indikatorSkor.innerText = "MISS";
            indikatorSkor.classList.add("text-muncul");
            layarKuis.classList.add("layar-error");
            
            if (live <= 0) {
                tampilkanGameOver();
                return;
            }

            setTimeout(function() {
                layarKuis.classList.remove("layar-error");
                waktuSoal = WAKTU_SOAL_DETIK;
                papanWaktuSoal.innerText = waktuSoal + " Detik";
                
                sedangMengecek = false;
                generateKuis(); // Baru munculkan soal baru
            }, 800);
        }
    }, 1000)
}


function selesaiGame() {
    clearInterval(mesinWaktu)
    
    simpanDataSelesai(namaUser, skor, batasAngka, speedTimer);
    updateAmbilRekor(namaUser, skor);
    
    fetch("database/api.php", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            nama: namaUser || "PLAYER",
            score: skor,
            level: batasAngka,
            timer: speedTimer || 'normal'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respon dari PHP:", data);
        window.location.href = "./rank.html";
    })
    .catch(error => {
        console.error("Gagal mengirim ke database:", error);
        window.location.href = "./rank.html";
    });
}


function tampilkanGameOver() {
    clearInterval(mesinWaktu);

    areaSoal.style.display = "none";
    areaJawaban.style.display = "none";
    const groupAksi = document.getElementById("grub-aksi");
    if (groupAksi) groupAksi.style.display = "none";

    pesanTengah.innerText = "GAME OVER!!";
    pesanTengah.style.display = "block";

    const tombolGameover = document.getElementById("tombol-gameover");
    if (tombolGameover) tombolGameover.style.display = "grid";
    
    pesanTengah.classList.add("efek-game-over-raksasa");
    layarKuis.classList.add("layar-error");

    setTimeout(function() {
        pesanTengah.className = "";
        selesaiGame();
    }, 2000)
}


// Generate Number
function generateKuis() {
    if (timerBerjalan === false) {
        mulaiTimer();
        timerBerjalan = true;
    }

    buttonGenerate.style.display = "none";
    areaSoal.style.display = "flex";
    areaJawaban.style.display = "block";
    pesanTengah.style.display = "none";
    
    indikatorSkor.innerText = "";
    indikatorSkor.classList.remove("text-muncul");
    buttonAksi.style.display = "block";
    
    const angkaBaru = buatAngkaSoal(jenisOperasi, batasAngka);
    document.getElementById("nilai1").innerHTML = angkaBaru.nilai1;
    document.getElementById("nilai2").innerHTML = angkaBaru.nilai2;
    jawabanBenar = hitungJawaban(angkaBaru.nilai1, angkaBaru.nilai2, jenisOperasi);

    // CHECK MODE
    if(modeKuis === "pilih-jawaban") {
        document.getElementById("mode-pilihan").style.display = "block";
        document.getElementById("mode-input").style.display = "none";

        const pilihanRandom = buatPilihanGanda(jawabanBenar);
        document.getElementById("aksi-1").innerText = pilihanRandom[0];
        document.getElementById("aksi-2").innerText = pilihanRandom[1];
        document.getElementById("aksi-3").innerText = pilihanRandom[2];
        document.getElementById("aksi-4").innerText = pilihanRandom[3];
        
    } else if(modeKuis === "input-jawaban") {
        document.getElementById("mode-input").style.display = "block";
        document.getElementById("mode-pilihan").style.display = "none";

        nilaiJawaban.value = "";
        nilaiJawaban.focus();
    }
}


// Fungsi Cek Jawaban
function checkAnswer(pilihanUser) {
    if (sedangMengecek) return;
    sedangMengecek = true;

    let jawabanUser = Number(pilihanUser);
    layarJawaban.innerText = jawabanUser;

    // Cek Jawaban Benar atau Salah
    if(jawabanUser === jawabanBenar) {
        indikatorSkor.innerText = "+" + SCORE_JAWAB_BENAR;
        indikatorSkor.classList.add("text-muncul");

        skor += SCORE_JAWAB_BENAR;
        papanSkor.innerText = skor + " Skor";

        kedipLayar(layarKuis)

        setTimeout(function() {
            layarJawaban.innerText = "?";
            waktuSoal = WAKTU_SOAL_DETIK;
            papanWaktuSoal.innerText = waktuSoal + " Detik";

            generateKuis();
            sedangMengecek = false;
        }, 600);
            
    } else {
        areaSoal.style.display = "none";
        areaJawaban.style.display = "none";
        pesanTengah.innerText = "SALAH!!";
        pesanTengah.style.display = "block";
        layarJawaban.innerText = "?";

        live--;
        updateTampilanHealt(live);
        
        indikatorSkor.innerText = "MISS"
        indikatorSkor.classList.add("text-muncul")
        layarKuis.classList.add("layar-error");

        if (live <= 0) {
            setTimeout(function() {
                tampilkanGameOver();
            }, 800);
            return;
        }

        alarmText = setTimeout(function() {
            layarKuis.classList.remove("layar-error");
            layarJawaban.innerText = "?";
            waktuSoal = WAKTU_SOAL_DETIK;
            papanWaktuSoal.innerText = waktuSoal + " Detik";

            generateKuis();
            sedangMengecek = false;
        }, 800);
    }
}


function inputJawaban() {
    if (sedangMengecek) return;
    if(nilaiJawaban.value == "") return;

    checkAnswer(nilaiJawaban.value);
    nilaiJawaban.value = "";
}


// Fungsi Reset Form
function formReset() {
    layarJawaban.innerText = "?";
    nilaiJawaban.value = "";
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("generate-kuis")?.addEventListener('click', generateKuis);
    document.getElementById("btn-reset-form")?.addEventListener('click', formReset);
    document.getElementById("btn-input-jawaban")?.addEventListener('click', inputJawaban);

    document.querySelectorAll("#mode-pilihan button").forEach(btn => {
        btn.addEventListener('click', (e) => {
            checkAnswer(e.target.innerText);
        });
    });

    document.getElementById("btn-back-home")?.addEventListener('click', () => {
        window.location.href = "./index.html?status=selesai";
    });
});
