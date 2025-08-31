<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $service_name = $_POST['service_name'];
    $amount = $_POST['amount'];
    $billing_date = $_POST['billing_date'];
    $status = $_POST['status'];

    require_once 'db_connection.php';

    $stmt = $pdo->prepare("INSERT INTO subscriptions (user_id, service_name, amount, billing_date, status) 
                           VALUES (?, ?, ?, ?, ?)");
    
    if ($stmt->execute([$_SESSION['user_id'], $service_name, $amount, $billing_date, $status])) {
        header("Location: dashboard.php");
        exit();
    } else {
        print_r($stmt->errorInfo()); // debug if insert fails
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Subscription - Subscription Manager</title>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <h1>Add New Subscription</h1>
    <form action="add-subscription.php" method="POST">
        <label for="service_name">Service Name</label>
        <input type="text" id="service_name" name="service_name" required><br>

        <label for="amount">Amount</label>
        <input type="number" id="amount" name="amount" required><br>

        <label for="billing_date">Billing Date</label>
        <input type="date" id="billing_date" name="billing_date" required><br>
        
        <label for="status">Status</label>
        <select name="status" id="status">
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select><br>

        <button type="submit">Add Subscription</button>
    </form>
</body>
</html>
