<!DOCTYPE html>
<html lang="en">
<head>
    <!-- <meta charset="UTF-8"> -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        img {width:50px}
    </style>
</head>
<body>
    

<?php 

class Diff {
 
    public static function diffArray($old, $new){
        $matrix = array();
        $maxlen = 0;
        foreach($old as $oindex => $ovalue){
            $nkeys = array_keys($new, $ovalue);
            foreach($nkeys as $nindex){
                $matrix[$oindex][$nindex] = isset($matrix[$oindex - 1][$nindex - 1]) ? $matrix[$oindex - 1][$nindex - 1] + 1 : 1;
                if($matrix[$oindex][$nindex] > $maxlen){
                    $maxlen = $matrix[$oindex][$nindex];
                    $omax = $oindex + 1 - $maxlen;
                    $nmax = $nindex + 1 - $maxlen;
                }
            }
        }
        if($maxlen == 0) return array(array('d'=>$old, 'i'=>$new));
        return array_merge(
            self::diffArray(array_slice($old, 0, $omax), array_slice($new, 0, $nmax)),
            array_slice($new, $nmax, $maxlen),
            self::diffArray(array_slice($old, $omax + $maxlen), array_slice($new, $nmax + $maxlen)));
    }
 
    public static function htmlDiff($old, $new){
        $ret = '';
        $diff = self::diffArray(explode(' ', $old), explode(' ', $new));
        foreach($diff as $k){
            if(is_array($k)){
                $ret .= (!empty($k['d'])?'<del>'.implode(' ',$k['d']).'</del> ':'').(!empty($k['i'])?'<ins>'.implode(' ',$k['i']).'</ins> ':'');
            }else{
                $ret .= $k . ' ';
            }
        }
        return $ret;
    }
 
}







include("php_baa_conn.php");

// $db1=mysqli_select_db($PHP_BAA,"db10956965-menue4digicase");

$mode_flag="u";
// if (isset($_POST['mode_flag'])) {
//     $mode_flag= $_POST['mode_flag'];
// } else {

//     exit;
// }


//1) lesen

// $found=0;
// $sql = "SELECT men_id,men_button,men_link,men_html FROM menuezeilen WHERE men_hide=0 AND men_id=23700";
// $conn=$PHP_BAA_BB4;
// $rs = mysqli_query($conn, $sql);if (!$rs) { echo mysqli_error($conn);echo $sql; exit;}
// if ($row = mysqli_fetch_assoc($rs)) {
//     echo $row['men_button'];
//     $found=1;
// };
// mysqli_free_result($rs);

// echo "<hr>";

    // $sql = "SELECT men_id,men_button,men_link,men_html FROM dc_menuezeilen WHERE men_hide=0 AND men_id=23700";
    // // $rs = mysqli_query($PHP_BAA, $sql);if (!$rs) { echo mysqli_error($PHP_BAA);echo $sql; exit;}
    // $conn=$PHP_BAA_DOM;
    // $rs = mysqli_query($conn, $sql);if (!$rs) { echo mysqli_error($conn);echo $sql; exit;}
    // if ($row = mysqli_fetch_assoc($rs)) {
    //     echo $row['men_button'];
    //     $found=1;
    // };
    // mysqli_free_result($rs);

    // echo "<hr>".$sql;

    $men_id=24885;
    check($PHP_BAA_BB4,$PHP_BAA_DC,$PHP_BAA_DOM,$men_id);

    // check($PHP_BAA_BB4,$PHP_BAA_DOM,$men_id,"dc_");

function check($quell_conn,$conn,$conn2,$men_id,$flag="") {
    $html_quell="";
    $found=0;
    $sql = "SELECT men_id,men_button,men_link,men_html,men_dc_export FROM menuezeilen WHERE men_id=$men_id";
    echo "<h3>$sql</h3>";
    $rs = mysqli_query($quell_conn, $sql);if (!$rs) { echo mysqli_error($quell_conn);echo $sql; exit;}
    if ($row = mysqli_fetch_assoc($rs)) {
        $html_quell=$row['men_html'];
        $found=1;
        echo "<br>gelesen: ".$row["men_id"]." ".$row["men_button"];
        echo "<br>men_link: <b>".$row["men_link"]."</b>";
        echo "<br>men_html: ".strlen($row["men_html"]);
        $men_id=$row["men_dc_export"];
    };
    mysqli_free_result($rs);
    echo "<hr>html: <textarea>".($html_quell)."</textarea><br>";



    $suchmuster = '/\.\.\/images\//';
    $ersetzung = '../assets/images/';
    $html_quell =preg_replace($suchmuster, $ersetzung, $html_quell);

    // echo $html_quell;

    $suchmuster = '/\.\.\/kcfinder\/upload\/images\//';
    $ersetzung = '../assets/images/';
    $html_quell =preg_replace($suchmuster, $ersetzung, $html_quell);

    // echo $html_quell;

    if ($html_quell!="") {
        $html_ziel="";
        $tabelle_vorspann=""; if ($flag!="") {$tabelle_vorspann=$flag;}
    
        $found=0;
        $sql = "SELECT men_id,men_button,men_link,men_html FROM ".$tabelle_vorspann."menuezeilen WHERE men_hide=0 AND men_id=$men_id";
        $rs = mysqli_query($conn, $sql);if (!$rs) { echo mysqli_error($conn);echo $sql; exit;}
        if ($row = mysqli_fetch_assoc($rs)) {
            // echo $row['men_button'];
            $html_ziel=$row['men_html'];
            $found=1;
        };
        mysqli_free_result($rs);
        // echo "ziel: $sql<hr>";
    
        if (!$found) {
            echo "<h1>not found</h1>";
        } else {
            echo "<h2>found</h2>";
            if ($html_quell==$html_ziel) {
                echo "<h1>gleich</h1>";
            } else {
                echo "<h1>ungleich</h1>";
                echo "<hr>html1: <textarea>".($html_ziel)."</textarea><br>";
                // echo "<pre>".substr($html_quell,0,50)."</pre>";
                // echo "<pre>".substr($html_ziel,0,50)."</pre>";
	
                // echo Diff::htmlDiff($html_quell, $html_ziel);
                echo "<hr>";
                echo Diff::htmlDiff($html_quell, $html_ziel);
                // $diff = xdiff_string_diff($html_quell, $html_ziel,1,true);
                // echo ":".$diff.":";
                echo "<hr>";
                echo "<hr>html1: <textarea>".($diff)."</textarea><br>";
            }
        }
    }

exit;
    if ($html_quell!="") {
        $html_ziel="";
        $tabelle_vorspann="dc_"; 
        // if ($flag!="") {$tabelle_vorspann=$flag;}
    
        $found=0;
        $sql = "SELECT men_id,men_button,men_link,men_html FROM ".$tabelle_vorspann."menuezeilen WHERE men_hide=0 AND men_id=$men_id";
        $rs = mysqli_query($conn2, $sql);if (!$rs) { echo mysqli_error($conn2);echo $sql; exit;}
        if ($row = mysqli_fetch_assoc($rs)) {
            // echo $row['men_button'];
            $html_ziel=$row['men_html'];
            $found=1;
        };
        mysqli_free_result($rs);
        echo "ziel: $sql: <hr>";
    
        if (!$found) {
            echo "<h1>not found</h1>";
        } else {
            echo "<h2>found</h2>";
            if ($html_quell==$html_ziel) {
                echo "<h1>gleich</h1>";
            } else {
                echo "<h1>ungleich</h1>";
                echo "<hr>html: <textarea>".($html_ziel)."</textarea><br>";
                // echo "<pre>".substr($html_quell,0,50)."</pre>";
                // echo "<pre>".substr($html_ziel,0,50)."</pre>";


            }
        }
    }




}

?>



</body>
</html>
