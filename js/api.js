export async function kirimSkorDatabase(nama, score, level, timer) {
    try {
        const response = await fetch("database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "applications/json"
            },
            body: JSON.stringify({
                nama: nama || "PLAYER",
                score: score,
                level: level,
                timer: timer || "normal"
            })
        });

        return await response.json();
    } catch (error) {
        console.log("Gagal mengirim ke Database", error);
        return null;
    }
}


export async function ambilDataLeaderboard(level, timer, nama) {
    const urlAPI = `database/api.php?level=${level}&timer=${timer.toLowerCase()}&nama=${encodeURIComponent(nama || 'NO NAME')}`;
    
    try {
        const response = fetch(urlAPI);
        return await response.json();
    } catch (error) {
        console.log("Gagal memual Leaderboard", error);
        return null;
    }
}