import { tampilkanPeringatan, tutupPeringatan, kedipLayar } from "./ui.js";

let levelSekarang = 1;
const layarKuis = document.getElementById("layar-kuis");
const modalNamaPlayer = document.getElementById('modal-nama')

if (modalNamaPlayer) {
    const namaTersimpan = localStorage.getItem("nama_terakhir")
    const btnEditNama = document.getElementById("btn-edit-nama")

    // Tangkap Parameter dari URL
    const querySring = window.location.search
    const parameter = new URLSearchParams(querySring)
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



function perbaruiStatusLayar() {
    const status = document.getElementById("layar-status")
    if (!status) return

    let teks = "SIAP MAIN"

    if (!document.getElementById("hidden-nama").value) teks = "ISI NAMA"
    else if (!document.querySelector('input[name="jenis-operasi"]:checked')) teks = "PILIH OPERASI"
    else if (!document.querySelector('input[name="speed-timer"]:checked')) teks = "PILIH WAKTU"
    else if (!document.querySelector('input[name="mode-kuis"]:checked')) teks = "PILIH MODE"

    status.innerText = teks
    status.classList.toggle("siap", teks === "SIAP MAIN")

    // slot pilihan menyala kalau sudah terisi
    document.querySelectorAll(".menu-slot").forEach(slot => {
        const nilai = slot.querySelector(".menu-nilai")
        slot.classList.toggle("terisi", nilai.textContent.trim() !== "")
    })

    // bar level (1-10)
    const bar = document.getElementById("bar-level")
    if (bar) {
        const lv = Number(document.getElementById("hidden-level").value) || 1
        bar.innerHTML = '<i class="on"></i>'.repeat(lv) + "<i></i>".repeat(10 - lv)
    }
}

if (document.getElementById("layar-status")) {
    document.addEventListener("change", (event) => {
        
        if (event.target.type === 'radio') {
            const idTujuan = event.target.getAttribute('data-target');
            const teksBaru = event.target.getAttribute('data-text');
            if (idTujuan && teksBaru) {
                document.getElementById(idTujuan).innerText = teksBaru;
                kedipLayar(layarKuis);
            }
        }
        perbaruiStatusLayar();
    });
    
    document.addEventListener("click", perbaruiStatusLayar);
    perbaruiStatusLayar();
}


// MODAL NAMA
function simpanNama() {
    const nama = document.getElementById("input-nama").value;
    let textPeringatan = "";

    if(nama === "") {
        textPeringatan = "MASUKKAN NAMA ANDA";
    }

    if(textPeringatan !== "") {
        tampilkanPeringatan(textPeringatan);
        return false;
    }
    
    document.getElementById("nama-user").innerText = nama;
    document.getElementById("hidden-nama").value = nama;
    document.getElementById("modal-nama").style.display = "none";
    perbaruiStatusLayar();
    return true;
}


function tambahLevel() {
    if(levelSekarang < 10) {
        levelSekarang++;
    }

    document.getElementById("angka-slider").innerText = levelSekarang;
    document.getElementById("angka-level").innerText = levelSekarang;
    document.getElementById("hidden-level").value = levelSekarang;
    kedipLayar(layarKuis);
    perbaruiStatusLayar();
}

function kurangLevel() {
    if(levelSekarang > 1) {
        levelSekarang--;
    }
    
    document.getElementById("angka-slider").innerText = levelSekarang;
    document.getElementById("angka-level").innerText = levelSekarang;
    document.getElementById("hidden-level").value = levelSekarang;
    kedipLayar(layarKuis);
    perbaruiStatusLayar();
}


// Fungsi Check halaman Beranda
function validasiFormKuis(event) {
    const operasiKuis   = document.querySelector('input[name="jenis-operasi"]:checked');
    const speedTimer    = document.querySelector('input[name="speed-timer"]:checked');
    const modeKuis      = document.querySelector('input[name="mode-kuis"]:checked');
    
    let textPeringatan = "";
    
    if (!operasiKuis) {
        textPeringatan = "PILIH OPERASI MATEMATIKA";
    } else if(!speedTimer) {
        textPeringatan = "PILIH WAKTU PENGERJAAN";
    } else if(!modeKuis) {
        textPeringatan = "PILIH MODE KUIS";
    } 
    
    if(textPeringatan !== "") {
        event.preventDefault();
        tampilkanPeringatan(textPeringatan);
        return false;
    }
    
    return true;
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("level-kurang")?.addEventListener('click', kurangLevel);
    document.getElementById("level-tambah")?.addEventListener('click', tambahLevel);
    
    document.getElementById("simpan-nama")?.addEventListener('click', simpanNama);
    document.getElementById("tutup-modal")?.addEventListener('click', tutupPeringatan);

    const formMulai = document.getElementById("form-kuis");
    if (formMulai) {
        formMulai.addEventListener('submit', validasiFormKuis)
    }
}) 