<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    if (empty($username) || empty($email) || empty($password)) {
        $error = "All fields are required.";
    } else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $error = "Username or email already exists.";
        } else {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            if ($stmt->execute([$username, $email, $hashedPassword])) {
                header("Location: /Subscription_Management_System/login.html");
                exit();
            } else {
                $error = "An error occurred during registration.";
            }
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Subscription Manager</title>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <h1>Register</h1>
    <?php if (isset($error)): ?>
        <p class="error"><?= $error ?></p>
    <?php endif; ?>
    <form action="register.php" method="POST">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required><br>

        <label for="email">Email</label>
        <input type="email" id="email" name="email" required><br>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="6"><br>

        <button type="submit">Register</button>
    </form>
    <p>Already have an account? <a href="login.php">Login</a></p>
</body>
</html>
