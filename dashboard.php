<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

require_once 'db_connection.php';
$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT * FROM subscriptions WHERE user_id = ?");
$stmt->execute([$user_id]);
$subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Subscription Manager</title>
  <link rel="stylesheet" href="styles/style.css">
</head>
<body>
  <h1>Welcome</h1>
  <h2>Your Subscriptions</h2>
  <table>
    <thead>
      <tr>
        <th>Service</th><th>Amount</th><th>Status</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($subscriptions as $sub): ?>
        <tr>
          <td><?= $sub['service_name'] ?></td>
          <td><?= $sub['amount'] ?></td>
          <td><?= $sub['status'] ?></td>
          <td>
            <a href="update-subscription.php?id=<?= $sub['id'] ?>">Edit</a>
            <a href="delete-subscription.php?id=<?= $sub['id'] ?>">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
  <a href="add-subscription.php">Add New Subscription</a>
  <a href="logout.php">Logout</a>
</body>
</html>
