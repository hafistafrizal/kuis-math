let skor = 0        // Score Pemain
// let sisaWaktu = 0   // Waktu Pemain
let jawabanUser     // Jawaban dari user
let jawabanBenar    // Jawaban yang Benar
let mesinWaktu      
let alarmText
let modePapan = "result"
let levelSekarang = 1

let waktuGlobal = 0
let waktuSoal = 5
let timerBerjalan = false
let sedangMengecek = false


// Tangkap Parameter dari URL
const querySring = window.location.search
const parameter = new URLSearchParams(querySring)

const jenisOperasi = parameter.get("jenis-operasi")
const speedTimer   = parameter.get("speed-timer")
const batasAngka   = Number(parameter.get("angka-level")) || 1
const namaUser     = String(parameter.get("nama-user"))
const modeKuis     = String(parameter.get("mode-kuis"))

const layarKuis     = document.getElementById("layar-kuis")     
const layarJawaban  = document.getElementById("jawaban-layar")  
const areaSoal      = document.getElementById("area-soal")      
const areaJawaban   = document.getElementById("area-jawaban")   
const pesanTengah   = document.getElementById("pesan-tengah")  
// const papanWaktu    = document.getElementById("papan-waktu")

const papanWaktuGlobal = document.getElementById("waktu-global")
const papanWaktuSoal = document.getElementById("waktu-soal")

const papanSkor     = document.getElementById("papan-skor")     
const indikatorSkor = document.getElementById("indikator-skor") 
const buttonGenerate = document.getElementById("generate-kuis") 
const buttonAksi    = document.getElementById("grub-aksi")      
const nilaiJawaban  = document.getElementById("jawaban-user")

const layarResult = document.getElementById("layar-result")
const layarLeaderboard = document.getElementById("layar-leaderboard")

// console.log(layarResult

const modalNamaPlayer = document.getElementById('modal-nama')
if (modalNamaPlayer) {
    
    const namaTersimpan = localStorage.getItem("nama_terakhir")
    const btnEditNama = document.getElementById("btn-edit-nama")
    const statusPemain = parameter.get("status")


    if (statusPemain === 'selesai' && namaTersimpan) {
        document.getElementById("modal-nama").style.display = "none"
        document.getElementById("nama-user").innerText = namaTersimpan
        document.getElementById("hidden-nama").value = namaTersimpan
    } else if (namaTersimpan) {
        document.getElementById("input-nama").value = namaTersimpan
    }

    if (btnEditNama) {
        btnEditNama.addEventListener('click', () => {
            document.getElementById("modal-nama").style.display = "flex"
            
            const inputNama = localStorage.getItem("nama_terakhir")
            if (inputNama) document.getElementById("input-nama").value = inputNama
        })
    }
}



if(document.getElementById("area-kuis")){
    inisialisasiGames() // Check Operasi dan Mode games
}


function inisialisasiGames() {
    if (window.location.search !== "") {
        localStorage.setItem("query_player_terakhir", window.location.search);
    }

    if (speedTimer == "slow") waktuGlobal = 120
    else if (speedTimer == "medium") waktuGlobal = 90
    else if (speedTimer == "fast") waktuGlobal = 60
    else waktuGlobal = 90

    document.getElementById("level-game").innerText = batasAngka 
    document.getElementById("nama-user").innerText = namaUser
    papanWaktuGlobal.innerText = waktuGlobal
    papanWaktuSoal.innerText = waktuSoal + " Detik"

    // CHECK OPERASI
    if (jenisOperasi == "penjumlahan"){
        document.getElementById("operasi").innerText = "+"
    } else if (jenisOperasi == "pengurangan") {
        document.getElementById("operasi").innerText = "-"
    } else if (jenisOperasi == "perkalian") {
        document.getElementById("operasi").innerText = "x"
    } else if (jenisOperasi == "pembagian") {
        document.getElementById("operasi").innerText = "/"
    }

    // EVENT LISTENER
    if(document.getElementById("area-jawaban")) {
        nilaiJawaban.addEventListener('input', function(event) {
            layarJawaban.innerText = event.target.value
        })
    }
}


// Timer per Detik
function mulaiTimer() {
    inisialisasiGames()

    papanWaktuGlobal.innerText = waktuGlobal
    
    mesinWaktu = setInterval(function() {
    waktuGlobal--;
    waktuSoal--;

    papanWaktuGlobal.innerText = waktuGlobal
    papanWaktuSoal.innerText = waktuSoal + " Detik"
        
        if (waktuGlobal <= 0) {
            clearInterval(mesinWaktu)
            
            localStorage.setItem("nama_terakhir", namaUser)
            localStorage.setItem("skor_terakhir", skor)
            localStorage.setItem("level_terakhir", batasAngka)

            let skorLama = Number(localStorage.getItem("skor_tertinggi")) || 0
            if(skor > skorLama) {
                localStorage.setItem("skor_tertinggi", skor)
            }

            fetch("database/api.php", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    nama: namaUser || "PLAYER",
                    score: skor,
                    level: batasAngka
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
        else if (waktuSoal <= 0) {
            skor -= 3
            if (skor < 0) skor = 0
            papanSkor.innerText = skor + " Score"

            kedipLayar()
            waktuSoal = 5
            papanWaktuSoal.innerText = waktuSoal + " Detik"

            sedangMengecek = false
            generateKuis()
        }

    }, 1000)
}

if(document.getElementById("layar-result")) {
    tampilLeaderboard()
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
    if (sedangMengecek) return
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
    // clearTimeout(alarmText)
    // clearInterval(mesinWaktu)
    if (timerBerjalan === false) {
        mulaiTimer()
        timerBerjalan = true
    }

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
    if (sedangMengecek) return
    sedangMengecek = true

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
            layarJawaban.innerText = "?"
            waktuSoal = 5
            papanWaktuSoal.innerText = waktuSoal + " Detik"

            generateKuis()
            sedangMengecek = false
        }, 600);
            
    } else {
        areaSoal.style.display = "none";
        areaJawaban.style.display = "none";
        pesanTengah.style.display = "block";
        layarJawaban.innerText = "?"

        skor -= 3
        if (skor < 0) skor = 0

        indikatorSkor.innerText = "-3"
        indikatorSkor.classList.add("text-muncul")
        papanSkor.innerText = skor + " Skor"
        layarKuis.classList.add("layar-error");

        alarmText = setTimeout(function(){
            layarKuis.classList.remove("layar-error")
            layarJawaban.innerText = "?"
            waktuSoal = 5
            papanWaktuSoal.innerText = waktuSoal + " Detik"

            generateKuis() 
            sedangMengecek = false
        }, 800)
    }  
}

// Fungsi Reset Form
function formReset() {
    layarJawaban.innerText = "?"
    nilaiJawaban.value = ""
}

// RECORD AND LEADERBOARD
function gantiPapan() {
    const tombol = document.getElementById("ganti-layar-papan")
    kedipLayar()

    if(modePapan === "result") {
        layarResult.style.display = "none"
        layarLeaderboard.style.display = "block"
        tombol.innerText = "Hasil"
        modePapan = "leaderboard"
    } else {
        layarResult.style.display = "block"
        layarLeaderboard.style.display = "none"
        tombol.innerText = "Peringkat"
        modePapan = "result"
    }
}

// KIRIM LEADERBOARD
function tampilLeaderboard() {
    const namaPlayer = localStorage.getItem("nama_terakhir") || "NO NAME"
    const rekorSkor  = localStorage.getItem("skor_tertinggi") || 0
    const levelPlayer = localStorage.getItem("level_terakhir") || 1
    const skorPlayer = localStorage.getItem("skor_terakhir") || 0

    document.getElementById("nama-user").innerText = namaPlayer
    document.getElementById("papan-skor").innerText = skorPlayer
    document.getElementById("papan-rekor").innerText = rekorSkor
    document.getElementById("level-game").innerText = levelPlayer

    fetch(`database/api.php?skorku=${skorPlayer}`) 
        .then(response => response.json())
        .then(data => {
            console.log("Hasil Juara dari Database: ", data)

            const tbody = document.querySelector(".tabel-peringkat tbody")
            tbody.innerHTML = ""

            let masukTop10 = false

            data.top_10.forEach((item, index) => {
                const tr = document.createElement('tr')
                if (index === 0) tr.classList.add('juara')

                if (item.nama === namaPlayer && item.score === skorPlayer) {
                    masukTop10 = true
                    tr.classList.add('baris-pemain')
                }
                
                tr.innerHTML = `
                    <td>${index + 1}.</td>
                    <td>${item.nama}</td>
                    <td>${item.score}</td>
                `;

                tbody.appendChild(tr)
            });

            if (masukTop10 === false) {
                const trBawah = document.createElement('tr');
                trBawah.classList.add("baris-pemain")

                trBawah.innerHTML = `
                    <td>${data.rank_saya}.</td>
                    <td>${namaPlayer} (Me)</td>
                    <td>${skorPlayer}</td>
                `;

                const tfoot = document.querySelector('.tabel-peringkat tfoot')

                tfoot.appendChild(trBawah)
            }
            

        })
        .catch(err => console.error("Terjadi kesalahan: ", err))

    // console.log(skorPlayer)
    // console.log(namaPlayer)
    // console.log(rekorSkor)
    // console.log(levelPlayer)

}



// Fungsi Check halaman Beranda
function validasiFormKuis() {
    const operasiKuis   = document.querySelector('input[name="jenis-operasi"]:checked')
    const speedTimer    = document.querySelector('input[name="speed-timer"]:checked')
    const modeKuis      = document.querySelector('input[name="mode-kuis"]:checked')
    
    let textPeringatan = ""
    
    if (!operasiKuis) {
        textPeringatan = "PILIH OPERASI MATEMATIKA"
    } else if(!speedTimer) {
        textPeringatan = "PILIH WAKTU PENGERJAAN"
    } else if(!modeKuis) {
        textPeringatan = "PILIH MODE KUIS"
    } 
    
    if(textPeringatan !== "") {
        document.getElementById("text-peringatan").innerText = textPeringatan
        document.getElementById("modal-peringatan").style.display = "flex"
        return false
    }
    
    return true
}


function tutupPeringatan() {
    document.getElementById("modal-peringatan").style.display = "none"
}

function kedipLayar() {
    const layar = document.getElementById("layar-kuis")

    layar.style.backgroundColor = "#0f380f"
    layar.style.color = "#8bac0f"

    setTimeout(function() {
        layar.style.backgroundColor = ""
        layar.style.color = ""
    }, 100) 
}



function tambahLevel() {
    if(levelSekarang < 10) {
        levelSekarang++
    }

    document.getElementById("angka-slider").innerText = levelSekarang
    document.getElementById("angka-level").innerText = levelSekarang
    document.getElementById("hidden-level").value = levelSekarang
    kedipLayar()
}

function kurangLevel() {
    if(levelSekarang > 1) {
        levelSekarang--
    }
    
    document.getElementById("angka-slider").innerText = levelSekarang
    document.getElementById("angka-level").innerText = levelSekarang
    document.getElementById("hidden-level").value = levelSekarang
    kedipLayar()
}

function gantiLayar(idTujuan, textNew) {
    document.getElementById(idTujuan).innerText = textNew
    kedipLayar()
}

// MODAL NAMA
function simpanNama() {
    const nama = document.getElementById("input-nama").value
    let textPeringatan = ""

    if(nama === "") {
        textPeringatan = "MASUKKAN NAMA ANDA"
    }

    if(textPeringatan !== "") {
        document.getElementById("text-peringatan").innerText = textPeringatan
        document.getElementById("modal-peringatan").style.display = "flex"
        return false
    }
    
    document.getElementById("nama-user").innerText = nama
    document.getElementById("hidden-nama").value = nama
    
    // Menghilangkan Modal
    document.getElementById("modal-nama").style.display = "none"
    return true
}


function backHome() {
    window.location.href = "./index.html?status=selesai"
}

function backQuiz() {
    const queryLama = localStorage.getItem("query_player_terakhir") || ""
    window.location.href = "./quiz.html" + queryLama
}
