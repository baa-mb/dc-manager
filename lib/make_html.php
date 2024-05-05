<?php
session_start();
include("php_dc_conn.php");  mysqli_select_db($PHP_BAA_DC,$projekt_dbname);
$m_id=$_GET['m_id'];


$baa=0;
$men_adr="";
if ($_GET['men_adr']) {
	$men_adr=$_GET['men_adr'];
	$men_grafik="";
	$a_t=preg_split("/men_grafik=/",$men_adr);
	if (count($a_t)>1) {
		$men_grafik=$a_t[1];
	}
}

$edit_sperre=0;
if ($_GET['edit_sperre']) {
	$edit_sperre=$_GET['edit_sperre'];
}

$multi_doc_flag=0;
$a_akt_men_user=array();

if (strpos($m_id,";")>1) { //mehrere dokumente anzeigen
	$multi_doc_flag=1;
	$where="men_id IN (".str_replace(";",",",$m_id).") ORDER BY men_sort";

} else {
	$m_id=substr($m_id,0,9);
	$where="men_id=$m_id";
}
$men_css_nr=0;
$men_html="";
$sql="SELECT men_html,men_user_id,men_druck_button,men_css_nr FROM menuezeilen WHERE $where;";
$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}

while ($row=mysqli_fetch_row($rs)) {
	$men_html.=$row[0];
	$men_user_id=$row[1];
	$men_druck_button=$row[2];
	$men_css_nr=$row[3];
}
mysqli_free_result($rs);


if ($multi_doc_flag) {
	$men_html=str_replace("\"/kcfinder", "\"../kcfinder", $men_html);
}
$men_html=str_replace("\"/kcfinder", "\"../kcfinder", $men_html);
//echo $men_html;exit;
if ($men_adr>"") {
	$men_html=str_replace("men_adr", html_entity_decode($men_adr), $men_html);
}

if ($men_css_nr==0) { // keine spezielle für diese seite
	$sql="SELECT men_css_nr FROM menue_user WHERE men_user_id=$men_user_id;";
	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
	if ($row=mysqli_fetch_row($rs)) {
		$men_css_nr=$row[0];
	}
	mysqli_free_result($rs);

	
} 
$css="make_html_".$men_css_nr.".css";

?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<!-- <link rel="stylesheet" href="styles/make_htmlsbbb.css" /> -->
<link rel="stylesheet" href="styles/<?=$css;?>" />
<?php
echo '<link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">';
echo '<link href="https://fonts.googleapis.com/css?family=Roboto:100,300&display=swap" rel="stylesheet">';
?>
<script src="https://code.jquery.com/jquery-3.6.3.min.js"></script> 
<!-- <script src="https://code.jquery.com/jquery-2.1.0.min.js"></script> -->


<?php
	if (intval($_COOKIE["edit_inline"])==1) { //editieren eingeschaltet
		//echo "techCheck: ja";
		echo "<script>var m_edit_id=".$m_id."</script>";
		echo "<script src='make_html_edit_erlaubt.js'></script>";
	} else {
		echo "<script>var m_edit_id=0;</script>";
	}
	
?>

<script>
var edit_sperre="<?=$edit_sperre;?>";
var schriftTeiler=36; //standard altes system
var font_size_fakt=1.8;
//var edit_ein_aus=false;
</script>

<script src="make_html.js"></script>
<style>
	body {
		width:98vw;
		height:98vh;
		txt-align:center;
		/* margin:0px;
		padding:0px; */
		/* overflow-x:hidden; */
	}

</style>


</head>
<body class="mcardBody">
<button id='baaContainer_edit_button' title='Editieren' onclick='make_edit_aussen(<?=$m_id;?>)'><img id='baaContainer_edit_img' src='../assets/images/bleistift-links.png'></button>
<div class='baaContainer' druck='<?=$men_druck_button;?>'>
<?=$men_html;?>
</div>
<?php
	if (isset($_GET['wzeit'])) {
		if ($_GET['wzeit']>0) {
			echo "<div id='zeitschleife'>
				_
			</div>
			<script>zeit_decr(".$_GET['wzeit'].")</script>";
		}
	}
?>
</body>
</html>
