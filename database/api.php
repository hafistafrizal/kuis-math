<?php

header("Content-Type: application/json");

// CHECK CONNECT JSON
// $test_array = ["pesan" => "API Siap Digunakan"];
// echo json_encode($test_array);
// echo "\n";


// KONEKSI DATABASE
$host       = "localhost";
$username   = "root";
$password   = "";
$database   = "db_math_quiz";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        'Status: ' => "error",
        'Massage: ' => "Connection Failed" . $conn->connect_error
    ]);
    exit;
}

// MEMBACA LEADERBOARD (GET)
if ($_SERVER['REQUEST_METHOD'] ===  'GET') {

    $skorPemain = $_GET['skorku'] ?? 0;

    $sql_top10 = "SELECT nama, score, level FROM leaderboard ORDER BY score DESC, id DESC LIMIT 10";
    $result = $conn->query($sql_top10);

    $leaderboard = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $leaderboard[] = $row;
        }
    }


    $sql_rank = "SELECT COUNT(*) as jumlah_tinggi FROM leaderboard WHERE score > $skorPemain";
    $result_rank = $conn->query($sql_rank);

    $real_rank = 1;

    if ($result_rank && $result_rank->num_rows > 0) {
        $row_rank = $result_rank->fetch_assoc();    

        $real_rank = $row_rank['jumlah_tinggi'] + 1;
    }


    $respon_data = [
        'top_10' => $leaderboard,
        'rank_saya' => $real_rank
    ];

    echo json_encode($respon_data);
    exit;
}

// MENYIMPAN SCORE BARU (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputRaw = file_get_contents('php://input');
    $data = json_decode($inputRaw, true);

    $nama = $data['nama'] ?? 'PLAYER';
    $scoreBaru = $data['score'] ?? 0;
    $level = $data['level'] ?? 0;

    $sql_cek = "SELECT score FROM leaderboard WHERE nama = '$nama'";
    $hasil_cek = $conn->query($sql_cek);

    if ($hasil_cek && $hasil_cek->num_rows > 0) {
        $baris = $hasil_cek->fetch_assoc();
        $scoreLama = $baris['score'];

        if ($scoreBaru > $scoreLama) {
            $sql_update = "UPDATE leaderboard SET score = '$scoreBaru', level = '$level' WHERE nama = '$nama'";
            $conn->query($sql_update);
        }

    } else {
        $sql_insert = "INSERT INTO leaderboard (nama, score, level) VALUES ('$nama', $scoreBaru, $level)";
        $conn->query($sql_insert);
    }

    echo json_encode(["status" => "success", "message" => "Skor berhasil disimpan"]);
    exit;
}

?>


