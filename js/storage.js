export function simpanQueryLama(query) {
    if (query !== "") {
        localStorage.setItem("query_player_terakhir", query);
    }
}


export function ambilQueryLama() {
    return localStorage.getItem("query_player_terakhir") || "";
}


export function simpanDataSelesai(nama, skor, level, timer, operasi) {
    localStorage.setItem("nama_terakhir", nama);
    localStorage.setItem("skor_terakhir", skor);
    localStorage.setItem("level_terakhir", level);
    localStorage.setItem("waktu_terakhir", timer || "normal");
    localStorage.setItem("operasi_terakhir", operasi || "penjumlahan");
}


export function ambilDataTerakhir() {
    return {
        nama: localStorage.getItem("nama_terakhir") || "",
        level: Number(localStorage.getItem("level_terakhir")) || 0,
        skor: Number(localStorage.getItem("skor_terakhir")) || 0,
        timer: localStorage.getItem("waktu_terakhir") || "normal",
        operasi: localStorage.getItem("operasi_terakhir") || "penjumlahan"
    };
}


export function updateAmbilRekor(nama, skorBaru, level, timer, operasi) {
    const namaValid = nama || "NO NAME";
    const kunciRekor = `skor_tertinggi_${namaValid}_${operasi}_lvl${level}_${timer}`;
    let skorLama = Number(localStorage.getItem(kunciRekor)) || 0

    if(skorBaru > skorLama) {
        localStorage.setItem(kunciRekor, skorBaru);
        return skorBaru;
    }

    return Math.max(skorLama, skorBaru);
}