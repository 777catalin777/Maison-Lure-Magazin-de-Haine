<?php
session_start();
require_once 'config.php';
require_once 'language_switcher.php';

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
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= lang('site_title') ?> | User</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon/favicon-16x16.png">
    <link rel="manifest" href="images/favicon/site.webmanifest">
</head>
<body>
    <div class="box">
        <h1><?= lang('welcome') ?>, <span><?= htmlspecialchars($_SESSION['name']); ?></span>!</h1>
        <p><?= lang('user_dashboard') ?></p>
        <button onclick="window.location.href='logout.php'"><?= lang('logout') ?></button>
    </div>
</body>
</html>