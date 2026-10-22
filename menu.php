<?php
header("Content-Type: application/json");
require "config.php";
$r=$conn->query("SELECT id,nama,kategori,harga,deskripsi,emoji FROM menu WHERE aktif=1 ORDER BY id DESC");
$data=[]; while($row=$r->fetch_assoc()) $data[]=$row;
echo json_encode(["success"=>true,"data"=>$data]);
?>
