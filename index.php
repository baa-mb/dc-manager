<?php
    include_once "lib/sani.inc";
    $qry = $_SERVER['QUERY_STRING'];
    // if ($qry) {
    //     if (isset($_GET['nr'])) {
    //         if (intval($_GET['nr'])<0) {
    //             $qry="?nr=".$_GET['nr']."&s=MA%3D%3D";
    //         } else {
    //             $qry="?".$qry."&demo=1";
    //         }
    //     } else {
    //         $qry="?".$qry."&demo=1";
    //     }
    // } 
    if ($qry) {
        // $qry="?".$qry."&demo=1";
        $qry="?".$qry;
    }    
    header("Location: lib/player.html".$qry);
?>