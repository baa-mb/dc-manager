<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');
error_reporting(E_ALL);


$data = json_decode(file_get_contents('php://input'), true);
// $_POST=$data;
$data_art=$_POST['data_art'];
echo $data_art;
echo "<pre>";

print_r($_POST);
echo "<br>=====================";
print_r($data);
file_put_contents('baa.txt',"xx");		

?>