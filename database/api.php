<?php

header("Content-Type: application/json");

// require 'config.php';


// $host       = "localhost";
// $username   = "root";
// $password   = "";
// $database   = "db_math_quiz";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        'Status: ' => "error",
        'Massage: ' => "Connection Failed" . $conn->connect_error
    ]);
    exit;
}

$daftar_timer = ['slow', 'normal', 'fast'];

// MENYIMPAN SCORE BARU (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputRaw = file_get_contents('php://input');
    $data = json_decode($inputRaw, true);

    $nama = trim($data['nama'] ?? 'PLAYER');
    $scoreBaru = (int)($data['score'] ?? 0);
    $level = (int)($data['level'] ?? 0);
    $timer = strtolower(trim($data['timer'] ?? 'normal'));

    if (!in_array($timer, $daftar_timer, true) || $level < 0 || $level > 10 || empty($nama)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "data tidak valid"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO leaderboard (nama, score, level, timer) 
                            VALUES (?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE score = GREATEST(score, VALUES(score))");
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("siis", $nama, $scoreBaru, $level, $timer);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Skor berhasil disimpan"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Execute failed: " . $stmt->error]);
    }
    exit;
}


// MEMBACA LEADERBOARD (GET)
if ($_SERVER['REQUEST_METHOD'] ===  'GET') {

    $level = $_GET['level'] ?? "";
    $timer = strtolower(trim($_GET['timer'] ?? ""));
    $nama = trim($_GET['nama'] ?? "");

    if (!in_array($timer, $daftar_timer, true) || !is_numeric($level) || (int)$level < 0 || (int)$level > 10) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'massage' => 'level/timer tidak valid']);
        exit;
    }
    $level = (int)$level;

    $stmt = $conn->prepare("SELECT nama, score FROM leaderboard 
                            WHERE level = ? AND timer = ?
                            ORDER BY score DESC, id DESC
                            LIMIT 10");

    $stmt->bind_param("is", $level, $timer);
    $stmt->execute();
    $top10 = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $scoreSaya = null;
    $rank = null;

    if ($nama !== "") {
        $stmt = $conn->prepare("SELECT score FROM leaderboard 
                                WHERE nama = ? AND level = ? AND timer = ?");
        $stmt->bind_param("sis", $nama, $level, $timer);
        $stmt->execute();
        $baris = $stmt->get_result()->fetch_assoc();

        if ($baris) {
            $scoreSaya = (int)$baris['score'];

            $stmt = $conn->prepare("SELECT COUNT(*) AS lebih_tinggi FROM leaderboard 
                                    WHERE level = ? AND timer = ? AND score > ?");
            $stmt->bind_param("isi", $level, $timer, $scoreSaya);
            $stmt->execute();
            $rank = (int)$stmt->get_result()->fetch_assoc()['lebih_tinggi'] + 1;
        }
    }

    $respon_data = [
        "top_10" => $top10,
        "skor_saya" => $scoreSaya,
        "rank_saya" => $rank
    ];

    echo json_encode($respon_data);
    exit;
}

?>


