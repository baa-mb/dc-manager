<?php 
$upload_dir = "../../assets/user_img/";  //implement this function yourself
$img = $_POST['imgData'];
$imgName = $_POST['imgName'];
// echo strlen($img);
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);

$file = $upload_dir.$imgName.".png";
$success = file_put_contents($file, $data);
echo $file."/".$success;
//header('Location: '.$_POST['return_url']); 
?>