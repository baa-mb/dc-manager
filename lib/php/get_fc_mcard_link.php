<?php 

include("../php_dc_conn.php");
$ctrl_ok=0;
$ret=[];

$fc_wort="";
if (isset($_POST['fc_wort'])) {
    $fc_wort=$_POST['fc_wort'];
    if (strlen($fc_wort)<7) {
        $ctrl_ok=1;
    }
    // echo $fc_wort;exit;
} 

if ($ctrl_ok) {
    $found=1;
    $sql = "SELECT men_id,men_link FROM menuezeilen WHERE men_hide=0 AND (men_button LIKE '$fc_wort:%' OR men_button LIKE '$fc_wort)%') LIMIT 1";
    $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
    if ($row = mysqli_fetch_assoc($rs)) {
        $ret=$row;
    } else {
        $ret=['men_link'=>"not found"];
        $found=0;
    };
    mysqli_free_result($rs);
    // if (substr($fc_wort,0,2)=="PC") {
    // if (substr($fc_wort,0,3)=="B34") {        

    if ($found) {
        //daten werdengleich vom dom/dc geholt und nicht mehr von db10956965-menue:menuezeilen
        if ($row['men_link']<" ") {    
            // $ret["men_link"]="https://dlpl.at/dc/lib/make_html.php?m_id=".$row["men_id"];
            
            $ret["men_link"]="https://dlpl.at/dc/lib/make_html.php?m_id=".$row["men_id"];
            // $row["men_link"]="make_html.php?m_id=".$row["men_id"];
        } else {
            if (str_contains($row['men_link'],"spiele/")) {
                // $ret['men_link'].="&sg_filter=1";
                // $ret["men_link"]="https://dlpl.at/dc/lib/".$ret["men_link"];
            } else {
                if (substr($row['men_link'],0,4)!="http") {
                    $ret["men_link"]="https://dlpl.at/dc/lib/".$ret["men_link"];
                }
                
            }
            
        }
    }
    echo json_encode($ret);
} else {
    exit;
}
?>