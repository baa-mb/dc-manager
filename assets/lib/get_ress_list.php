<?php
session_start();
include("../../lib/php_dc_conn.php");

$sql = "SELECT men_button,men_link,men_id,men_hoehe FROM menuezeilen WHERE men_user_id=130 AND men_hide=0 ORDER BY men_sort,men_id";
$rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo "Fehler: ".mysqli_error($PHP_BAA_DC);  echo $sql;  exit;}

$a_sammlung=[];
$a_samm=[];
$alt_bst="x";
while ($row = mysqli_fetch_row($rs)) {
    $men_button = $row[0];
    $men_link = $row[1];
    $men_id= $row[2];
    $men_hoehe= $row[3];
    $found=1;
    $pos=strpos($men_button,": ");
    if ($pos===false) {
        $pos=strpos($men_button,") ");
    } 
    if (($pos!==false) && ($pos<5)) {
        $code=substr($men_button,0,$pos);
        // echo $code."$pos<hr>";
        $bst=$code[0];
        if (($bst!=$alt_bst) && ($alt_bst!="x")) {
            array_push($a_sammlung,$a_samm);
            $a_samm=[];
        }
        array_push($a_samm,[$men_button,$men_link,$men_id,$men_hoehe]);
        $alt_bst=$bst;
    }
    

    //echo $men_button."<br>";
}
array_push($a_sammlung,$a_samm);

mysqli_free_result($rs);
// echo "<pre>";
// print_r($a_sammlung);
// echo "</pre>";

?>
<html>
<head>
	<title>Digi.case-Ressourcen</title>									
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex" />

<script>
    function drucken() {
        //	$('body').css("margin","0");

        document.getElementById("druckIcon").style.display="none";
        // $('#druckIcon').hide();
        document.body.style.color="#000";
        document.body.style.backgroundColor="#fff";
        window.print();
    }

    function clip_copy(adr) {
        navigator.clipboard.writeText(adr);
        // let info=document.getElementById("info")
        // info.style.visible="visible";
        // settimeout(function () {
        //     info.style.visible="hidden";
        // },2000)
        // alert("Adresse wurde in den Zwischenspeicher gelegt!")
    }

</script>

<style>

body {
  font-size: 1em;
  margin: 2% 2%;
  background-color: #fff;
  color: #fff;
  background-image: url("../../assets/images/tafel_hg.jpg");
  
  background-size: cover;
  background-position: center top;
  background-repeat: repeat-y;
  /* font-family: 'Comic Neue', cursive; */
  font-family: 'Arial';
  box-sizing: border-box;
  line-height:1.5;
}    

.container {
    display: flex; 
    /* justify-content: space-between;  */
    /* border:1px solid #ccc; */
    padding:0;
}

div {
    color: inherit;
    /* border:1px solid red; */
    /* display:inline; */
}

div.innen {
    padding:4px;
    padding-left:8px;
    width:18.5vw;
    border-right:1px solid #ccc;
}
div.innen:nth-child(4) {
    width:14vw;
}

div.innen:nth-child(5) {
    width:12vw;
}
div.innen:nth-child(6)  {
    width:10vw;
    border:none;
}

h1 {
    text-align:center;
    margin-bottom:4px;
}

h2 {
    margin-top:0px;
    margin-bottom:8px;
}

a {
    color:white;   
    color: inherit;
    cursor: pointer;
}

#druckIcon {
    position: fixed;
    width: 72px;
    right: 20px;
    top: 15px;
    z-index: 999;
    cursor: pointer;
}

.star {
    cursor: copy;
    margin-right:4px;
}

/* #info {
    position:absolute;
    color:black;
    top:25vh;
    background-color:yellow;
    border:3px solid #666;
    border-radius: 4px;
    width:30%;
    padding:1%;
} */


@media print {
  body {
    margin: 0;
    padding: 0;
    background-image:none;
    color:black;
  }
}

</style>
</head>

<body>
<?php
    $alt_bst="x";
    $index=-1;
    $bild="<img id='druckIcon' onclick='drucken()' src='../images/drucken.png'>";

    // echo "<center><div id='info'>Die Adresse dieser Ressource wurde in den Zwischenspeicher kopiert, mit Bearbeiten-Einfügen kann man die WEB-Adresse dann in die Lernplattform oder in die Klassenpinwand eingefügt werden.</div></center>";
    echo "<h1>Ressourcenpool von digi.case</h1><hr>".$bild;
    echo "<div style='color:orange'>Klickt man auf einen Link, wird die Ressource (Arbeitsblatt, Spiel, ...) aufgerufen, <b>gleichzeitig</b> landet die Adresse dabei im Zwischenspeicher des Computers und kann mit <b>Bearbeiten-Einfügen</b> in der Lernplattform oder der <b>Klassenpinnwand</b> eingefügt werden. Über diesen Link hat man nun auch technischen Zugriff auf JEDES dargestellte Projektmaterial.</div><br>";
    
    // und die  den Text der Ressource, wird diese geöffnet - klickt man genau auf das Symbol &#128310;, dann wird die Adresse in den Zwischenspeicher kopiert.".$bild;
    $a_ues=["Flashcards","Arbeitsblätter","Biberaufgaben","Spiele","Rätsel","Coding"];



    echo "<div class='container'>";
    foreach ($a_sammlung as $index=>$wert) {
        //print_r($wert);
        if ($index!=44) echo "<div class='innen'>";
      

        echo "<h2>".$a_ues[$index]."</h2>";
        foreach ($wert as $index2=>$zeile) {
            
            // echo "<pre>";
            // print_r($zeile);
            // echo "</pre>";

            $tmp_link="";
            $link=$zeile[0];
            if ($zeile[1]>"") { //direktaufruf mit adresse
                $tmp_link=$zeile[1];
                if (substr($zeile[1],0,1)==".") {
                    $tmp_link="../{$tmp_link}";
                }

                $link="<a href='{$tmp_link}' onclick='clip_copy(\"../{$tmp_link}\")'>".$zeile[0]."</a>";
            } else {
                $php_make_html_flag=($zeile[3]==1) ? "_s":"";
                $tmp_link="../../lib/make_html{$php_make_html_flag}.php?m_id=".$zeile[2];
                $link="<a href='../../lib/make_html{$php_make_html_flag}.php?m_id=".$zeile[2]."' onclick='clip_copy(\"$tmp_link\")'>".$zeile[0]."</a>";
            }
            $lz="";$lze="";
            $a_tmp=explode(":",$zeile[0]);
            if (strlen($a_tmp[0])==2) {
                $lz="<b>";
                $lze="</b>";
                if ($index2==0) {
                    $lze="</b>";
                } else {
                    $lz="<br>".$lz;
                    $lze="</b>";
                }
            }
            echo $lz.$link.$lze;
            echo "<br>\n";
        }    
        
        if ($index!=44) echo "</div>";
        $alt_neu_bst=$neu_bst;
    }
    echo  "</div>";
?>
</body>
</html>
