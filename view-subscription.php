<?php
session_start();
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $stmt = $pdo->prepare("SELECT * FROM subscriptions WHERE user_id=?");
    $stmt->execute([$user_id]);
    $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($subscriptions as $subscription) {
        echo "Service: {$subscription['service_name']}<br>";
        echo "Amount: {$subscription['amount']}<br>";
        echo "Billing Date: {$subscription['billing_date']}<br>";
        echo "Status: {$subscription['status']}<br>";
        echo "<hr>";
    }
} else {
    echo "You must be logged in to view subscriptions.";
}
?>