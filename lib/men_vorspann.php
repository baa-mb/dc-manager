<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
//vars
$bpfad="../assets/images/";

include("php_dc_conn.php");
include("men_acc_db_read.php");

if (isset($_GET["men"])) {
  $men_user_kzz = $_GET["men"];
  $men_name=$men_user_kzz;
} else {
  $men_name="";
  $men_user_kzz = explode(".",$_SERVER["HTTP_HOST"])[0];
  echo "No Access (Menu) - ".
  "<br>server: ".$_SERVER['SERVER_NAME']. 
  "<br>host: ".$_SERVER['HTTP_HOST']."<hr>";exit;
}
$men_user_kzz="digi.case.dlpl";

$such_filter= isset($_GET["such_text"]) ? $_GET["such_text"].substr(0,5) :"";  
$https_aktueller_aufruf= $_SERVER['HTTPS']>"" ? 1 : 0; 

$a_akt_men_user = array();
$sql = "SELECT * FROM menue_user WHERE men_user_kzz='$men_user_kzz';";
$rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC); exit;}
if ($row = mysqli_fetch_assoc($rs)) {
  $a_akt_men_user=$row;  //alle men_User_daten
  
}
mysqli_free_result($rs);

if (count($a_akt_men_user) == -1) {
  echo "User nicht vorhanden!";
  exit;
}

$admin=chk_admin();
// echo "yyyy$admin";

if ($_SERVER["REMOTE_ADDR"]!=$_SESSION["last_ipadr"]) save_logbuch($PHP_BAA_DC,$men_user_kzz); 
//zeige_arr($row);

// get_menu_data($PHP_BAA_DC,$a_akt_men_user['men_user_id'],0);
$men_liste = get_menu_data($PHP_BAA_DC,$a_akt_men_user['men_user_id'],0);

?>