<?php 
include("../php_dc_conn.php");

// $_POST = json_decode(file_get_contents('php://input'), true);
// methode funktioniert mit javascript und mit JQ

// $ret=[];
$flag=0; //lesen
if (isset($_POST['flag'])) {
    $flag=$_POST['flag'];
}
$u_id=0;
if (isset($_POST['u_id'])) {
    $u_id=$_POST['u_id'];
} 

// print_r ($_POST);exit;
$ret="";
if ($flag=="0") {
    $sql = "SELECT uebung_html FROM digi_uebungen WHERE uebung_id=$u_id";
    $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
    if ($row = mysqli_fetch_row($rs)) {
        // $ret=$row['uebung_html'];
        $ret=$row[0];
    };
    mysqli_free_result($rs);
    // echo json_encode($ret);
    echo $ret;
} else {
    $html=$_POST['u_html'];

    // $re ='/(&nbsp;)+<\/p>/'; //auch doppelte 6nbsp; das funktioniert
    // $subst = "</p>";
    // $html=preg_replace($re, $subst, $html);
    // $re ='/([\D+(&nbsp;)*])(&nbsp;)+/'; //auch doppelte 6nbsp; das funktioniert


    $html=str_replace("\t","",$html);
    $html=str_replace("&nbsp;<table","<table",$html);
    
    $re = '/(&nbsp;)\n?\r?\t?(<table)/m';
    $subst = "$2";
    $html=preg_replace($re, $subst, $html);

    $re ='/([^\n^\r0-9])(&nbsp;)+/'; // weg mit dne Leerzeichen - auf apple not nicht probiert
    $subst = "$1 ";
    $html=preg_replace($re, $subst, $html);


    
    // $re ='/(<p>(&nbsp;)?<\/p>)+$/'; // auf apple not nicht probiert


    $re ='/(\n?<p><\/p>\n?)+$/';
    $subst = "";
    $html=preg_replace($re, $subst, $html);



    $sql = "UPDATE digi_uebungen SET uebung_html='".mysqli_real_escape_string ($PHP_BAA_DC,$html)."' WHERE uebung_id=$u_id";
    $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
    // echo json_encode($ret);
    echo "OK";
}
?>
