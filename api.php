<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Your Live InfinityFree Database Credentials
$servername = "sql106.infinityfree.com";
$username = "if0_43086529";
$password = "niBsKx12883Ho";
$dbname = "if0_43086529_manzil_db";

// Create database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if connection failed
if ($conn->connect_error) {
    echo json_encode(array("success" => false, "message" => "Connection failed: " . $conn->connect_error));
    exit();
}

// Fetch all hotels from your database 
// (Note: If your table name is different from 'hotels', change it below)
$sql = "SELECT * FROM hotels";
$result = $conn->query($sql);

$hotels = array();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $hotels[] = $row;
    }
}

// Output the results as JSON so your React frontend can read them
echo json_encode($hotels);

// Close connection
$conn->close();
?>