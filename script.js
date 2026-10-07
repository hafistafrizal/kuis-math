let skor = 0        // Score Pemain
// let sisaWaktu = 0   // Waktu Pemain
let jawabanUser     // Jawaban dari user
let jawabanBenar    // Jawaban yang Benar
let mesinWaktu      
let alarmText
let modePapan = "result"


let waktuGlobal = 0
let waktuSoal = 5
let timerBerjalan = false
let sedangMengecek = false
let live = 3



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





if(document.getElementById("area-kuis")){
    inisialisasiGames() // Check Operasi dan Mode games
}


function inisialisasiGames() {
    if (window.location.search !== "") {
        localStorage.setItem("query_player_terakhir", window.location.search);
    }

    live = 3
    updateTampilanHealt()

    if (speedTimer == "slow") waktuGlobal = 120
    else if (speedTimer == "normal") waktuGlobal = 90
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

function selesaiGame() {
    clearInterval(mesinWaktu)
    
    localStorage.setItem("nama_terakhir", namaUser)
    localStorage.setItem("skor_terakhir", skor)
    localStorage.setItem("level_terakhir", batasAngka)
    localStorage.setItem("waktu_terakhir", speedTimer || "Normal")
    

    
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


// Timer per Detik
function mulaiTimer() {
    inisialisasiGames()

    papanWaktuGlobal.innerText = waktuGlobal
    
    mesinWaktu = setInterval(function() {
        if (sedangMengecek) return

        waktuGlobal--;
        waktuSoal--;

        papanWaktuGlobal.innerText = waktuGlobal
        papanWaktuSoal.innerText = waktuSoal + " Detik"
        
        if (waktuGlobal <= 0) {
            tampilkanGameOver()
        }
        else if (waktuSoal <= 0) {
            sedangMengecek = true

            live--
            updateTampilanHealt()

            areaSoal.style.display = "none"
            areaJawaban.style.display = "none"
            pesanTengah.innerText = "TIME OUT!"
            pesanTengah.style.display = "block"

            indikatorSkor.innerText = "MISS";
            indikatorSkor.classList.add("text-muncul");
            layarKuis.classList.add("layar-error");
            
            if (live <= 0) {
                tampilkanGameOver()
                return
            }

            setTimeout(function() {
                layarKuis.classList.remove("layar-error");
                waktuSoal = 5;
                papanWaktuSoal.innerText = waktuSoal + " Detik";
                
                sedangMengecek = false;
                generateKuis(); // Baru munculkan soal baru
            }, 800);
        }

    }, 1000)
}

if(layarResult) {
    tampilLeaderboard()
}



    




function inputJawaban() {
    if (sedangMengecek) return
    if(nilaiJawaban.value == "") return

    checkAnswer(nilaiJawaban.value)
    nilaiJawaban.value = ""
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
        pesanTengah.innerText = "SALAH!!"
        pesanTengah.style.display = "block";
        layarJawaban.innerText = "?"

        live--
        updateTampilanHealt()

        // skor -= 3
        // if (skor < 0) skor = 0
        // indikatorSkor.innerText = "-3"
        // indikatorSkor.classList.add("text-muncul")
        // papanSkor.innerText = skor + " Skor"
        
        indikatorSkor.innerText = "MISS"
        indikatorSkor.classList.add("text-muncul")
        layarKuis.classList.add("layar-error");

        if (live <= 0) {
            setTimeout(function() {
                tampilkanGameOver()
            }, 800)
            return
        }

        alarmText = setTimeout(function() {
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
    const layarResult = document.getElementById("layar-result");
    const layarLeaderboard = document.getElementById("layar-leaderboard");
    const buttonGantiPapan = document.getElementById("ganti-layar-papan");
    if (typeof kedipLayar === "function") kedipLayar();

    if(modePapan === "result") {
        layarResult.style.display = "none"
        layarLeaderboard.style.display = "flex"
        buttonGantiPapan.innerText = "Hasil"
        modePapan = "leaderboard"
    } else {
        layarResult.style.display = "flex"
        layarLeaderboard.style.display = "none"
        buttonGantiPapan.innerText = "Peringkat"
        modePapan = "result"
    }
}

// KIRIM LEADERBOARD
function tampilLeaderboard() {
    const namaPlayer = localStorage.getItem("nama_terakhir") || "NO NAME"
    const levelPlayer = localStorage.getItem("level_terakhir") || 1
    const skorPlayer = Number(localStorage.getItem("skor_terakhir") || 0)
    const waktuPlayer = localStorage.getItem("waktu_terakhir") || "Normal"

    const kunciRekor = "skor_tertinggi_" + namaPlayer
    const rekorSkor = Math.max(
        Number(localStorage.getItem(kunciRekor)) || 0,
        skorPlayer
    )

    document.getElementById("nama-user").innerText = namaPlayer
    document.getElementById("papan-skor").innerText = skorPlayer
    document.getElementById("papan-rekor").innerText = rekorSkor
    document.getElementById("level-game").innerText = levelPlayer
    document.getElementById("waktu-game").innerText = waktuPlayer.toUpperCase()

    const urlAPI = `database/api.php?level=${levelPlayer}&timer=${waktuPlayer.toLowerCase()}&nama=${encodeURIComponent(namaPlayer)}`;

    fetch(urlAPI) 
        .then(response => response.json())
        .then(data => {
            console.log("Hasil Juara dari Database: ", data)

            if (data.status === "error" || !data.top_10) {
                console.error("Gagal memuat leaderboard:", data.message);
                return;
            }

            const tbody = document.querySelector(".tabel-peringkat tbody")
            const tfoot = document.querySelector(".tabel-peringkat tfoot")
            tbody.innerHTML = ""
            tfoot.innerHTML = ""
            let masukTop10 = false
            let skorTerbaikDiTabel = 0

            data.top_10.forEach((item, index) => {
                const tr = document.createElement('tr')
                if (index === 0) tr.classList.add('juara')

                if (item.nama.toLowerCase() === namaPlayer.toLowerCase()) {
                    masukTop10 = true
                    skorTerbaikDiTabel = Number(item.score)
                    tr.classList.add('baris-pemain')
                }
                
                tr.innerHTML = `
                    <td>${index + 1}.</td>
                    <td>${item.nama}</td>
                    <td>${item.score}</td>
                `;

                tbody.appendChild(tr)
            });

            const tampilkanDiBawah = (masukTop10 === false) || (skorPlayer < skorTerbaikDiTabel)

            if (tampilkanDiBawah) {
                const trBawah = document.createElement('tr');
                trBawah.classList.add("baris-pemain")

                trBawah.innerHTML = `
                    <td>${data.rank_saya || '#'}</td>
                    <td>${namaPlayer} (latest)</td>
                    <td>${skorPlayer}</td>
                `;

                tfoot.appendChild(trBawah)
            }
        })
        .catch(err => console.error("Terjadi kesalahan: ", err))
}



function tampilkanGameOver() {
    clearInterval(mesinWaktu)

    areaSoal.style.display = "none"
    areaJawaban.style.display = "none"
    const groupAksi = document.getElementById("grub-aksi")
    if (groupAksi) groupAksi.style.display = "none"

    pesanTengah.innerText = "GAME OVER!!"
    pesanTengah.style.display = "block"
    document.getElementById("tombol-gameover").style.display = "grid"
    
    pesanTengah.classList.add("efek-game-over-raksasa")
    layarKuis.classList.add("layar-error")

    setTimeout(function() {
        // pesanTengah.classList.remove("efek-game-over-raksasa")
        pesanTengah.className = ""
        selesaiGame()
    }, 2000)
}


// =========================
// DARI INDEX HTML
// =========================









function gantiLayar(idTujuan, textNew) {
    document.getElementById(idTujuan).innerText = textNew
    kedipLayar()
}




function backHome() {
    window.location.href = "./index.html?status=selesai"
}

function backQuiz() {
    const queryLama = localStorage.getItem("query_player_terakhir") || ""
    window.location.href = "./quiz.html" + queryLama
}



const angkaKurang = document.getElementById("level-kurang");
const angkaTambah = document.getElementById("level-tambah");
const namaTersimpan = document.getElementById("simpan-nama");
const tutupModal = document.getElementById("tutup-modal");
const buttonBack = document.getElementById("btn-back-home");
const buttonResetForm = document.getElementById("btn-reset-form");
const buttonInputJawaban = document.getElementById("btn-input-jawaban");
const buttonBackKuis = document.getElementById("btn-back-kuis");
// const buttonGenerateKuis = document.getElementById("btn-generate-kuis");
const buttonGantiPapan = document.getElementById("ganti-layar-papan")

angkaKurang?.addEventListener('click', function() {
    kurangLevel();
});

angkaTambah?.addEventListener('click', function() {
    tambahLevel();
});

namaTersimpan?.addEventListener('click', function() {
    simpanNama();
});

tutupModal?.addEventListener('click', function() {
    tutupPeringatan();
});

buttonBack?.addEventListener('click', function() {
    backHome();
});

buttonGenerate?.addEventListener('click', function() {
    generateKuis();
});

buttonResetForm?.addEventListener('click', function() {
    formReset();
});

buttonInputJawaban?.addEventListener('click', function() {
    inputJawaban();
});

buttonBackKuis?.addEventListener('click', function() {
    backQuiz();
});

buttonGantiPapan?.addEventListener('click', function() {
    gantiPapan();
});
