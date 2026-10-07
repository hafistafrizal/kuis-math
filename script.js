// let sisaWaktu = 0   // Waktu Pemain
let jawabanUser     // Jawaban dari user
let modePapan = "result"







const layarResult = document.getElementById("layar-result")
const layarLeaderboard = document.getElementById("layar-leaderboard")


// console.log(layarResult















if(layarResult) {
    tampilLeaderboard()
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
