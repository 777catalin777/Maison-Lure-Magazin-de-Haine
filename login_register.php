<?php
session_start();
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['register'])) {
        $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $role = 'user';

        try {
            $stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->rowCount() > 0) {
                $_SESSION['register_error'] = 'Email is already registered';
                $_SESSION['active_form'] = 'register';
            } else {
                $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $password, $role]);
                header("Location: login.php");
                exit();
            }
        } catch (PDOException $e) {
            $_SESSION['register_error'] = 'Registration failed: ' . $e->getMessage();
            $_SESSION['active_form'] = 'register';
        }
    } elseif (isset($_POST['login'])) {
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $password = $_POST['password'];

        try {
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['name'] = $user['name'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['role'] = $user['role'];
                if ($user['role'] === 'user') {
                    header("Location: user_page.php");
                } else {
                    header("Location: admin_page.php");
                }
                exit();
            } else {
                $_SESSION['login_error'] = 'Incorrect email or password';
                $_SESSION['active_form'] = 'login';
            }
        } catch (PDOException $e) {
            $_SESSION['login_error'] = 'Login failed: ' . $e->getMessage();
            $_SESSION['active_form'] = 'login';
        }
    }
    header("Location: login.php");
    exit();
}
?>