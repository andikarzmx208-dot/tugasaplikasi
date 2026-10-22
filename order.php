<?php
header("Content-Type: application/json");
require "config.php";
$input=json_decode(file_get_contents("php://input"),true);
$user_id=(int)($input["user_id"]??0);
$items=$input["items"]??[];
if(!$user_id||!count($items)){echo json_encode(["success"=>false,"message"=>"Data pesanan tidak lengkap"]);exit;}
$total=0;
foreach($items as $it){$id=(int)$it["menu_id"];$qty=max(1,(int)$it["qty"]);$q=$conn->query("SELECT harga FROM menu WHERE id=$id");$m=$q->fetch_assoc();if($m)$total += $m["harga"]*$qty;}
$conn->begin_transaction();
try{
 $s=$conn->prepare("INSERT INTO orders(user_id,total,status) VALUES(?,?, 'Diproses')");
 $s->bind_param("id",$user_id,$total);$s->execute();$order_id=$conn->insert_id;
 foreach($items as $it){
  $id=(int)$it["menu_id"];$qty=max(1,(int)$it["qty"]);$q=$conn->query("SELECT harga FROM menu WHERE id=$id");$m=$q->fetch_assoc();
  $harga=$m["harga"]; $s2=$conn->prepare("INSERT INTO order_items(order_id,menu_id,qty,harga) VALUES(?,?,?,?)");
  $s2->bind_param("iiid",$order_id,$id,$qty,$harga);$s2->execute();
 }
 $conn->commit();echo json_encode(["success"=>true,"order_id"=>$order_id,"total"=>$total]);
}catch(Exception $e){$conn->rollback();echo json_encode(["success"=>false,"message"=>$e->getMessage()]);}
?>
