<?php
include("php_dc_conn.php");  //mysqli_select_db($PHP_BAA,$projekt_dbname);
$m_id=$_POST['m_id'];

$a_akt_men_user=array();
$sql="SELECT men_button,men_html,men_passwort,men_passwort FROM menuezeilen WHERE men_id=$m_id;";
$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
if ($row=mysqli_fetch_assoc($rs)) {
	//$men_html=$row['men_html'];
	$row['men_button']=str_replace("<br>", " ", $row['men_button']);
}
mysqli_free_result($rs);
//echo $men_html;
echo json_encode($row);
?>
