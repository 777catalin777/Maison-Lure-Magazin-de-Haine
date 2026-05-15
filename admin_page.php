<?php
session_start();
require_once 'config.php';
require_once 'language_switcher.php';

if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= lang('site_title') ?> | Admin</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="box">
        <h1><?= lang('welcome') ?>, <span><?= htmlspecialchars($_SESSION['name']); ?></span>!</h1>
        <p><?= lang('admin_dashboard') ?></p>
        <button onclick="window.location.href='logout.php'"><?= lang('logout') ?></button>
    </div>
</body>
</html>