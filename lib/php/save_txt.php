<?php 
$upload_dir = "../../assets/user_img/";  //implement this function yourself
// print_r ($_POST);

$_POST = json_decode(file_get_contents("php://input"), true);

$data = $_POST['edit_area'];
$dname = $_POST['dname'];
$file = $upload_dir.$dname;

// $re = '/\D*(&nbsp;)/m';
$re ='/(\D+)(&nbsp;)+/m';
$subst = "$1 ";
$data=preg_replace($re, $subst, $data);

// $re = '/([\D])(&nbsp;)/m';
// $subst = "$1 ";
// $data=preg_replace($re, $subst, $data);

// $re = '/(&nbsp;)(\<\/p\>)/m';
// $subst = "$2";
// $data=preg_replace($re, $subst, $data);

$success = file_put_contents($file, $data);

?>