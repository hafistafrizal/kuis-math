export function simpanQueryLama(query) {
    if (query !== "") {
        localStorage.setItem("query_player_terakhir", query);
    }
}


export function ambilQueryLama() {
    return localStorage.getItem("query_player_terakhir") || "";
}


export function simpanDataSelesai(nama, skor, level, timer) {
    localStorage.setItem("nama_terakhir", nama);
    localStorage.setItem("skor_terakhir", skor);
    localStorage.setItem("level_terakhir", level);
    localStorage.setItem("waktu_terakhir", timer || "normal");
}


export function ambilDataTerakhir() {
    return {
        nama: localStorage.getItem("nama_terakhir") || "",
        level: Number(localStorage.getItem("level_terakhir")) || 0,
        skor: Number(localStorage.getItem("skor_terakhir")) || 0,
        timer: localStorage.getItem("waktu_terakhir") || "normal"
    };
}


export function updateAmbilRekor(nama, skorBaru) {
    const namaValid = nama || "NO NAME";
    const kunciRekor = "skor_tertinggi_" + namaValid;
    let skorLama = Number(localStorage.getItem(kunciRekor)) || 0

    if(skorBaru > skorLama) {
        localStorage.setItem(kunciRekor, skorBaru);
        return skorBaru;
    }

    return Math.max(skorLama, skorBaru);
}