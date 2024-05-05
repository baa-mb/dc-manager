<?php
session_start();
// Achtung ändern bei fertigen Produkt
//include("php_edumenu_conn.php");
include("../../lib/php_edumenu_conn.php");

$adr_flag=isset($_GET['adr_flag']) ? substr($_GET['adr_flag'],0,1) : 0;

//auch hier ändern
$sql = "SELECT men_button,men_link,men_id FROM menuezeilen WHERE men_user_id=130 AND men_hide=0 ORDER BY men_sort,men_id";
$rs = mysqli_query($PHP_BAA_DC, $sql);
if (!$rs) { echo mysqli_error($PHP_BAA_DC);  echo $sql;  exit;}

$a_sammlung=[];
$a_samm=[];
$alt_bst="x";
while ($row = mysqli_fetch_row($rs)) {
    $men_button = $row[0];
    $men_link = $row[1];
    $men_id= $row[2];
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
        array_push($a_samm,[$men_button,$men_link,$men_id]);
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
</script>


<style>

body {
  font-size: 1em;
  margin: 2% 4%;
  background-color: #fff;
  color: #fff;
  background-image: url("../assets/images/tafel_hg.jpg");
  
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
    justify-content: space-between; 
}

div {
    color: inherit;
    /* border:1px solid red; */
}

div.spalte {
 
    padding:4px;
    width:12.5vw
}
h1 {text-align:center}

a {color:white;   color: inherit;display:inline}
#druckIcon {
    position: fixed;
    width: 72px;
    right: 20px;
    top: 15px;
    z-index: 999;
    cursor: pointer;
}

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
    $bild="<img id='druckIcon' onclick='drucken()' src='../assets/images/drucken.png'>";

    echo "<h1>Ressourcenpool von digi.case</h1><hr>".$bild;
    $a_ues=["Flashcards","Arbeitsblätter","Biberaufgaben","Spiele","Rätsel","Coding"];
    echo "<div class='container'>";
    if ($adr_flag) {
        // foreach ($a_ues as $ind=>$ues_str) 
       // echo "<pre>";print_r($a_sammlung);echo "</pre>";
        {

            foreach ($a_sammlung as $index=>$wert) {
                //if ($adr_flag) print_r($wert);
                // echo "<pre>ä $index ";print_r($wert);echo "</pre>";
if ($index==2) {
                echo "<div class='spalte'>";
                
                echo "<h2>".$a_ues[$index]."</h2>";
                eine_spalte($wert,$adr_flag);
                echo "</div>";
                //$alt_neu_bst=$neu_bst;
            }                
            }
        }
    } else {
        foreach ($a_sammlung as $index=>$wert) {
            //if ($adr_flag) print_r($wert);
            
            if ($index!=44) echo "<div class='spalte'>";
            // if ($index==44) echo "<h1>Alois</h1>";
            echo "<h2>".$a_ues[$index]."</h2>";
            eine_spalte($wert);
            if ($index!=44) echo "</div>";
            //$alt_neu_bst=$neu_bst;
        }
    
    }
    echo  "</div>";


function eine_spalte($wert,$p_adr_flag=0) {
    echo "<table>";
    foreach ($wert as $index2=>$zeile) {
        //echo $zeile[0];
        $link=$zeile[0];
        $tmp_lnk="";
        if ($zeile[1]>"") {
            $tmp_lnk=$zeile[1];
            $link="<a href='".$zeile[1]."'>".$zeile[0]."</a>";
        } else {
            $tmp_lnk="make_html.php?m_id=".$zeile[2];
            $link="<a href='make_html.php?m_id=".$zeile[2]."'>".$zeile[0]."</a>";
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
        if ($p_adr_flag) {
            echo "<tr>";
            echo "<td>$lz.$link.$lze</td>";
            echo "<td>$tmp_lnk</td>";
            echo "</tr>";
        } else {
            echo $lz.$link.$lze;
        }
        // echo "<br>";
    }    
    echo "</table>";


}

?>
</body>
</html>
