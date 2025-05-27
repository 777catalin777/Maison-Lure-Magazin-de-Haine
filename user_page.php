<?php
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}
if ($_SESSION['role'] !== 'user') {
    header("Location: admin_page.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maison Lure | User Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="box">
        <h1>Welcome, <span><?= htmlspecialchars($_SESSION['name']); ?></span>!</h1>
        <p>This is your <span>user</span> dashboard.</p>
        <button onclick="window.location.href='logout.php'">Logout</button>
    </div>
</body>
</html>
</html>