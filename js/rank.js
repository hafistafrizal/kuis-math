import { kedipLayar } from "./ui.js";
import { ambilDataTerakhir, ambilQueryLama } from "./storage.js";
import { ambilDataLeaderboard } from "./api.js";

let modePapan = "result";

// RECORD AND LEADERBOARD
function gantiPapan() {
    const layarResult = document.getElementById("layar-result");
    const layarLeaderboard = document.getElementById("layar-leaderboard");
    const buttonGantiPapan = document.getElementById("ganti-layar-papan");
    
    kedipLayar(document.getElementById("layar-kuis"));

    if(modePapan === "result") {
        if (layarResult) layarResult.style.display = "none";
        if (layarLeaderboard) layarLeaderboard.style.display = "flex";
        if (buttonGantiPapan) buttonGantiPapan.innerText = "Hasil";
        modePapan = "leaderboard";
    } else {
        if (layarResult) layarResult.style.display = "flex";
        if (layarLeaderboard) layarLeaderboard.style.display = "none";
        if (buttonGantiPapan) buttonGantiPapan.innerText = "Peringkat";
        modePapan = "result";
    }
}


// KIRIM LEADERBOARD
async function tampilLeaderboard() {
    const dataTeakhir = ambilDataTerakhir();
    const namaPlayer = dataTeakhir.nama || "PLAYER";
    const levelPlayer = dataTeakhir.level || 1;
    const skorPlayer = dataTeakhir.skor || 0;
    const waktuPlayer = dataTeakhir.timer || "Normal";

    const kunciRekor = "skor_tertinggi_" + namaPlayer;
    const rekorSkor = Math.max(
        Number(localStorage.getItem(kunciRekor)) || 0,
        skorPlayer
    );

    const elementNama  = document.getElementById("nama-user");
    const elementSkor  = document.getElementById("papan-skor");
    const elementRekor = document.getElementById("papan-rekor");
    const elementLevel = document.getElementById("level-game");
    const elementTimer = document.getElementById("waktu-game");

    if (elementNama) elementNama.innerText = namaPlayer;
    if (elementSkor) elementSkor.innerText = skorPlayer;
    if (elementRekor) elementRekor.innerText = rekorSkor;
    if (elementLevel) elementLevel.innerText = levelPlayer;
    if (elementTimer) elementTimer.innerText = waktuPlayer.toUpperCase();

    const dataAPI = await ambilDataLeaderboard(levelPlayer, waktuPlayer, namaPlayer);

    if (!dataAPI || dataAPI.status === "error" || !dataAPI.top_10) {
        console.error("Gagal memuat Leaderboard");
        return;
    }

    const tbody = document.querySelector(".tabel-peringkat tbody");
    const tfoot = document.querySelector(".tabel-peringkat tfoot");
    if (!tbody || !tfoot) return;

    tbody.innerHTML = "";
    tfoot.innerHTML = "";
    
    let masukTop10 = false;
    let skorTerbaikDiTabel = 0;

    dataAPI.top_10.forEach((item, index) => {
        const tr = document.createElement('tr');
        if (index === 0) tr.classList.add('juara');

        if (item.nama.toLowerCase() === namaPlayer.toLowerCase()) {
            masukTop10 = true;
            skorTerbaikDiTabel = Number(item.score);
            tr.classList.add('baris-pemain');
        }
        
        tr.innerHTML = `
            <td>${index + 1}.</td>
            <td>${item.nama}</td>
            <td>${item.score}</td>
        `;

        tbody.appendChild(tr);
    });

    const tampilkanDiBawah = (masukTop10 === false) || (skorPlayer < skorTerbaikDiTabel);
    
    if (tampilkanDiBawah) {
        const trBawah = document.createElement('tr');
        trBawah.classList.add("baris-pemain");

        trBawah.innerHTML = `
            <td>${dataAPI.rank_saya || '#'}</td>
            <td>${namaPlayer} (latest)</td>
            <td>${skorPlayer}</td>
        `;

        tfoot.appendChild(trBawah)
    }
}


function backQuiz() {
    const queryLama = ambilQueryLama();
    window.location.href = "./quiz.html" + queryLama;
}


function backHome() {
    window.location.href = "./index.html?status=selesai";
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("layar-result")) {
        tampilLeaderboard();
    }

    document.getElementById("ganti-layar-papan")?.addEventListener('click', gantiPapan);
    document.getElementById("btn-back-kuis")?.addEventListener('click', backQuiz);
    document.getElementById("btn-back-home")?.addEventListener('click', backHome);
})