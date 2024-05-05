<?php
include("php_apps_conn.php");  //mysqli_select_db($$PHP_BAA_DC,$projekt_dbname);

$flag=0;
if (isset($_GET["flag"])) {
    $flag=strtoupper(substr($_GET["flag"],0,1));
}

if ($flag=="B") {
    $filt="logo_text LIKE '$flag%'";
    $sort="CAST(SUBSTR(logo_text,2) as SIGNED INTEGER) ASC";
}

if ($flag=="D") {
    $filt="(logo_text LIKE 'RL%' OR ";
    $filt.="logo_text LIKE 'RT%' OR ";
    $filt.="logo_text LIKE 'SP%' OR ";
    $filt.="logo_text LIKE 'CO%' OR ";
    $filt.="logo_text LIKE 'PR%' OR ";
    $filt.="logo_text LIKE 'PC%' )";

    $sort="CAST(SUBSTR(logo_text,3) as SIGNED INTEGER) ASC";
    $sort="id";
}

$a_qr_codes=array();
$sql="SELECT id,beschreibung,adresse,fenst_flag FROM qr_codes WHERE $filt AND id>1000 ORDER BY $sort ;";
$rs=mysqli_query($$PHP_BAA_DC,$sql); if (!$rs) {echo $sql.mysqli_error($$PHP_BAA_DC);exit;}
while ($row=mysqli_fetch_row($rs)) {
    array_push($a_qr_codes,$row);
}
mysqli_free_result($rs);

?>
<html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>QR-Codes</title>
    <style>
        html {box-sizing: border-box} 
        body {
            font-family:Arial;  
            text-align:center;
            background-color:white;
        }
        h2 {
            margin:32px 0 -8px;
        }
        img {
            width:100%;
            padding:0;
            box-sizing: border-box;  
            /* border:1px solid red; */
        }
        .container {
            /* border:1px solid blue; */
            text-align:center;
            width:160px;
            height:180px;
            padding:32px;
            float:left;
        }
        .ank {
            display:block;
            /* height:2.5em; */
            /* border:1px solid red; */
        }
    </style>    
    </head>
<body>
<?php

    echo "<h2>Einzelne/mehrere QR-Codes kopieren und in Arbeitsblättern eingefügen!</h2>";
    foreach($a_qr_codes as $a_wert) {
        $targ="";
        if ($a_wert[3]==1) {$targ="target='_blank'";};
        echo "<div class='container'><img src='../../assets/images/qrcodes/".$a_wert[0].".png' />";
        echo "<br><a class='ank' href='$a_wert[2]' $targ >$a_wert[1]</a></div>";
    }
?>
</body>
</html>
