<?php
header("Content-Type: application/json");
require "config.php";
$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? "";
$stmt = $conn->prepare("SELECT id,nama,email,password FROM users WHERE email=? LIMIT 1");
$stmt->bind_param("s",$email); $stmt->execute();
$result=$stmt->get_result(); $user=$result->fetch_assoc();
if($user && password_verify($password,$user["password"])){
  unset($user["password"]); echo json_encode(["success"=>true,"user"=>$user]);
}else echo json_encode(["success"=>false,"message"=>"Email atau password salah"]);
?>
