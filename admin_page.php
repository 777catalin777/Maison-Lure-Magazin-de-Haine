<?php
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maison Lure | Admin Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="box">
        <h1>Welcome, <span><?= htmlspecialchars($_SESSION['name']); ?></span>!</h1>
        <p>This is your <span>admin</span> dashboard.</p>
        <button onclick="window.location.href='logout.php'">Logout</button>
    </div>
</body>
</html>