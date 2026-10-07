export async function kirimSkorDatabase(nama, score, level, timer, operasi) {
    try {
        const response = await fetch("database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nama: nama || "PLAYER",
                score: score,
                level: level,
                timer: timer || "normal",
                operasi: operasi || 'penjumlahan'
            })
        });

        return await response.json();
    } catch (error) {
        console.log("Gagal mengirim ke Database", error);
        return null;
    }
}


export async function ambilDataLeaderboard(level, timer, nama, operasi) {
    const urlAPI = `database/api.php?level=${level}&timer=${timer.toLowerCase()}&nama=${encodeURIComponent(nama || 'NO NAME')}&operasi=${operasi.toLowerCase()}`;
    
    try {
        const response = await fetch(urlAPI);
        return await response.json();
    } catch (error) {
        console.log("Gagal memual Leaderboard", error);
        return null;
    }
}