<?php
    $uid=$_GET["u"];
    $open="https://baa.at/projekte/dc/lib/show_page.php?datei_url=../assets/user_img/u_".$uid.".txt&u_id=".$uid;
    header("Location: ".$open);
?>