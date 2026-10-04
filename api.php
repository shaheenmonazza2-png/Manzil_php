<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'manzil_db';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'get_hotels') {
    $location = trim($_GET['location'] ?? '');
    $category = trim($_GET['category'] ?? 'All');

    // Base query
    $sql = "SELECT * FROM hotels WHERE 1=1";

    // Flexible location search across city, region, or name
    if (!empty($location)) {
        $clean_loc = $conn->real_escape_string($location);
        $sql .= " AND (city LIKE '%$clean_loc%' OR region LIKE '%$clean_loc%' OR name LIKE '%$clean_loc%')";
    }

    // Filter by category if a specific one is chosen
    if (!empty($category) && $category !== 'All') {
        $clean_cat = $conn->real_escape_string($category);
        $sql .= " AND category = '$clean_cat'";
    }

    $sql .= " ORDER BY rating DESC";

    $result = $conn->query($sql);
    $hotels = [];
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $hotels[] = $row;
        }
    }
    
    echo json_encode($hotels);
    exit();
}

if ($action === 'book_hotel') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid request data"]);
        exit();
    }

    $full_name      = $conn->real_escape_string($data['fullName'] ?? '');
    $email          = $conn->real_escape_string($data['email'] ?? '');
    $phone          = $conn->real_escape_string($data['phone'] ?? '');
    $password       = password_hash($data['password'] ?? '123456', PASSWORD_BCRYPT);
    
    $hotel_id       = (int)($data['hotelId'] ?? 0);
    $check_in       = $conn->real_escape_string($data['checkIn'] ?? date('Y-m-d'));
    $check_out      = $conn->real_escape_string($data['checkOut'] ?? date('Y-m-d'));
    $adults         = (int)($data['adults'] ?? 2);
    $children       = (int)($data['children'] ?? 0);
    $payment_method = $conn->real_escape_string($data['paymentMethod'] ?? 'UPI');
    $payment_status = ($payment_method === 'Pay at Hotel') ? 'Pending' : 'Paid';
    $total_price    = (float)($data['totalPrice'] ?? 0);

    // Save or find customer
    $checkCust = $conn->query("SELECT id FROM customers WHERE email = '$email'");
    if ($checkCust && $checkCust->num_rows > 0) {
        $cust = $checkCust->fetch_assoc();
        $customer_id = $cust['id'];
    } else {
        $conn->query("INSERT INTO customers (full_name, email, phone, password) VALUES ('$full_name', '$email', '$phone', '$password')");
        $customer_id = $conn->insert_id;
    }

    // Save booking log
    $sqlBook = "INSERT INTO bookings (customer_id, hotel_id, check_in, check_out, adults, children, total_price, payment_method, payment_status) 
                VALUES ($customer_id, $hotel_id, '$check_in', '$check_out', $adults, $children, $total_price, '$payment_method', '$payment_status')";

    if ($conn->query($sqlBook) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Reservation confirmed successfully via $payment_method and saved to MySQL database!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save booking to database."]);
    }
    exit();
}
?>