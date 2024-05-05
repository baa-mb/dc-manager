<?php session_start();
include_once("/lib/sani.inc");
if (isset($_GET['aufruf_prg'])) {
	$_SESSION['aufruf_prg']=$_GET['aufruf_prg'];
}
$param="";
if (count($_GET)>0) {
	$param="?".http_build_query($_GET,'', '&');
}

header("location:lib/men_acc.php".$param);
