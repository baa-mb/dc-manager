<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

<style>
  body {font-family: Courier}
  h1,h2,h3,h4 {
    margin:0;
  }
  h1 { color:red; }
  h2 { color:orange; }
  h3 {color:green}
  
  h0 {
    background-color: #0000ff;
    font-weight:bold;
    color:white;
    padding:8px;
    
    display:block;
    margin:4px 0px;
  }
  .inv {
    background-color:#ddd;
  }
</style>

  </head>
<body>
<?php
include_once("php_dc_conn.php");
include("php_edumenu_conn.php");

$import=0;
if ($import) {
  echo "Achtung";
  achtung_gesamtuebernahme($PHP_BAA,$PHP_BAA_DC);
  tranfer_html_nach_130($PHP_BAA_DC,"men_link");
}

if (isset($_GET["qrcopy"])) {
  $fl=substr($_GET["qrcopy"],0,1);
  copy_qrcodes_all($fl);

} else {
  $s="../kcfinder/upload/images/digi-case/";
  suche_pfad_ersetze($PHP_BAA_DC,"men_html",$s,"../assets/images/");
  
  $s="../images/qrcodes/";
  suche_pfad_ersetze($PHP_BAA_DC,"men_html",$s,"../assets/images/qrcodes/");
  
  
  $s="https://baa.at/projekte/beebot-dlpl4/kcfinder/upload/images/";
  suche_pfad_ersetze($PHP_BAA_DC,"men_html",$s,"../assets/images/");
  
  $s="../images/";
  suche_pfad_ersetze($PHP_BAA_DC,"men_html",$s,"../assets/images/");
  
  
  $s="../kcfinder/upload/images/";
  suche_pfad_ersetze($PHP_BAA_DC,"men_html",$s,"../assets/images/");
  
  alle_DOM_bilder_zeigen($PHP_BAA_DC,"men_html","img ");
  
  
  alle_ckeck_kopiere($PHP_BAA_DC,"men_link",".pdf","pdfs/"); //pdfs im men_link
  einzeldatei_ersatz($PHP_BAA_DC,"men_link");
  anzeige_dateilink_exists($PHP_BAA_DC,"men_link",$s); // was existiert nicht
  
  bilder_im_DOM($PHP_BAA_DC,"http","men_html","img ","images/"); // bilder, die vorkommen, kopieren
  
  alle_DOM_bilder_zeigen($PHP_BAA_DC,"men_html","img ");
  
  
}


exit;




  
//   anzeige_dateilink_exists($PHP_BAA_DC,"men_link",$s); // was existiert nicht

// }



// funktionen
function einzeldatei_ersatz($PHP_BAA_DC,$feld) {
  echo "<h0>Besondere Dateien Pfad ändern (PHP-dateien)</h0>";
  $a_ers=[
    ["https://baa.at/projekte/beebot-dlpl4/lib/list_qr_codes.php","../assets/lib/list_qr_codes.php"],
    ["https://baa.at/projekte/beebot-dlpl4/lib/liste_loesungen.php","../assets/lib/liste_loesungen.php"],
    ["https://baa.at/projekte/dc/lib/get_ress_list.php","../assets/lib/get_ress_list.php"],
    ["https://men.baa.at/lib/js/logbuch.php","../assets/lib/logbuch.php"]
    
  ];

  foreach($a_ers as $ers) {
    $filter=$feld." LIKE '%".$ers[0]."%'";

    echo "Suche nach: ".$ers[0]."<br>";
    $sql ="UPDATE menuezeilen ";
    $sql .="SET $feld = REPLACE($feld,'".$ers[0]."','".$ers[1]."') ";
    $sql .="WHERE $filter";
    $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
    echo "<h3>Durchgeführt: ".mysqli_affected_rows($PHP_BAA_DC)."</h3>";
  }
}

function suche_pfad_ersetze($PHP_BAA_DC,$feld,$s,$ers) {
  echo "<h0>Pfad in den bildern ersetzen</h0>";
    $filter=$feld." LIKE '%".$s."%'";

    echo "Suche nach: ".$s."<br>";
    $sql ="UPDATE menuezeilen ";
    $sql .="SET $feld = REPLACE($feld,'".$s."','".$ers."') ";
    $sql .="WHERE $filter";
    $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
    //echo $sql;
    
    echo "<h3>Durchgeführt: ".mysqli_affected_rows($PHP_BAA_DC)."</h3>";
  
}


function tranfer_html_nach_130($PHP_BAA_DC,$feld) {
  echo "<h0>Daten aus 120 nach 130</h0>";
 
  $filter="men_link LIKE 'https://baa.at/projekte/beebot-dlpl4/go.php%'";
  $sql = "SELECT men_user_id,men_id,men_sort,men_button,men_html,men_link FROM menuezeilen WHERE ($filter) ORDER BY men_sort";
  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  
  echo "<br>Anzahl suche nach men_link: ".mysqli_num_rows($rs).": ".$sql."<hr>".$info;

  $a_saetze_120=[];
  while ($row = mysqli_fetch_assoc($rs)) {
    $datei_link=$row['men_link'];
    $a_tmp=explode("?",$datei_link);
    $a_tmp=explode("&",$a_tmp[1]);
    $a_tmp=explode("=",$a_tmp[0]);
    // echo "<br>",$a_tmp[1];
    array_push($a_saetze_120,[$row['men_id'],$a_tmp[1]]);
  }  
  mysqli_free_result($rs);
  
  echo "<pre>";
  print_r ($a_saetze_120);
  echo "</pre>";

  foreach($a_saetze_120 as $ind=>$a_satz) {
    $sql = "SELECT men_html FROM menuezeilen WHERE (men_id={$a_satz[1]})";
    $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
    $htm="";
    if ($row = mysqli_fetch_assoc($rs)) {
      $htm=$row['men_html'];
    }  
    mysqli_free_result($rs);

    if ($htm>"") {
      $sql ="UPDATE menuezeilen SET men_html='{$htm}',men_link=null, men_hoehe=1 ";
      $sql.="WHERE men_id={$a_satz[0]};";

      $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
      echo "<br>index: $ind ";
      echo "{$a_satz[1]} >> erledigt >> {$a_satz[0]}";

      $sql ="DELETE FROM menuezeilen WHERE men_id={$a_satz[1]};";
      $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
    }
    echo "next";
  }
  echo "<h3>Tranfer Durchgeführt: ".mysqli_affected_rows($PHP_BAA_DC)."</h3>";
}



function anzeige_dateilink_exists($PHP_BAA_DC,$feld) {
  echo "<h0>$feld: Externe Verlinkungen prüfen</h0>";

  $a_ausnahmen=
  ["https://code.org",
  "https://docs.google",
  "https://www.tinkercad",
  "https://baa.at/mm-team/mobile/elearn/",
  "https://www.youtube.com",
  "https://studio.code",
  "../assets/",
  "https://bilder.baa.at",
  "https://www.meine-forscherwelt.",
  "https://baa.at/projekte/digi-case/spiele/",
  "https://baa.at/projekte/robobee",
  "yy",
  "yy",
  "yy",
  "yy",
  "yy"
  ];


  
  $filter=$feld." > ' '";
  
  $sql = "SELECT men_id,men_sort,men_button,men_html,men_link FROM menuezeilen WHERE ($filter)";
  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  echo "<br>Anzahl suche nach men_link: ".mysqli_num_rows($rs).": ".$sql."<hr>".$info;

  while ($row = mysqli_fetch_assoc($rs)) {
    $dateiLink=$row['men_link'];
    // echo "<br>".$datei;	
    if (file_exists($datei)) {
    } else {

      $jumpOver=0;
      foreach($a_ausnahmen as $teilname) {
        if (!$jumpOver) {
          // echo "$dateiLink ### $teilname: ".strpos($dateiLink,$teilname)."<br>";
          if (strpos($dateiLink,$teilname)!==false) {
            // echo $teilname.$dateiLink."<hr>";
            $jumpOver=1;
            
          }  
        }
      }

      if (!$jumpOver) {
        $anz++;
        echo "<br>Nicht zu prüfen: ".$row['men_sort']." <span class='inv'> ".$dateiLink." </span> (".$row['men_button'].")";
        $such_liste[0]="../../edumenu";
        $such_liste[1]="../../edumenu/kcfinder/upload";
        $such_liste[2]="../../beebot-dlpl4";
        $such_liste[3]="../../beebot-dlpl4/kcfinder/upload";
        
        // foreach($such_liste as $suche) {
        //   $pict=$suche.$dateiLink;
        //   //echo "<br>SUCHE: ".$pict;
        //   if (file_exists($pict)) {
        //     echo "<h3>Gefunden: ".$pict."</h3>";
        //     if (!copy($pict, $src_bild)) {
        //       echo "<h1>fehler: $src_bild</h1>";
        //     }
        //     // exit;
        //   } else {
        //     echo "<br>Not found:".$row['men_id']." ".$dateiLink;
        //   }

      }

    }  
  }
  mysqli_free_result($rs);
}



function achtung_gesamtuebernahme($PHP_BAA,$PHP_BAA_DC) {
  echo "<h1>Achtung Gesamtübernahme</h1>";

  $sql="select * from information_schema.schemata;";
  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  $dbname="";
  while ($row = mysqli_fetch_assoc($rs)) {
    // echo "<br>x".$row['SCHEMA_NAME'];
    $dbname=$row['SCHEMA_NAME'];
  }  
  echo "<br>Datenbankname: ".$dbname;
  mysqli_free_result($rs);
  
  // L Ö S C H E N
  if ($dbname!="db10956965-menue4digicase") {
    echo "<br>ACHTUNG - Falsche Datenbank";
    exit;
  } else {
    $sql ="DELETE FROM menuezeilen WHERE men_user_id=120 OR men_user_id=130 ;";
    $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
    
  }

 
  $felder="men_user_id,men_id, men_sort,men_ues_level,men_button,men_tipp,men_link,men_html,men_fenster,men_hide,men_druck_button";
  $filter="(men_user_id=120 AND men_hoehe>0) OR (men_user_id=130) ";

  $filter="(men_user_id=120 AND men_hoehe>0) OR (men_user_id=130) AND men_id<>24837 ";
  
  // $sql0 = "SELECT $felder FROM menuezeilen WHERE ($filter) ORDER BY men_user_id,men_sort limit 10";
  
  $sql0 = "SELECT $felder FROM menuezeilen WHERE ($filter) ORDER BY men_user_id,men_sort";
  $rs0 = mysqli_query($PHP_BAA, $sql0); if (!$rs0) {echo $sql0.mysqli_error($PHP_BAA);exit;}
  echo "<br>Anzahl: ".mysqli_num_rows($rs0).": ".$sql0;
  $i=0;
  while ($row = mysqli_fetch_assoc($rs0)) {
    echo "<br>$i ".$row['men_id']." ".$row['men_button'];
    $sql1 ="INSERT IGNORE INTO menuezeilen ($felder) ";
    $sql1 .="VALUES (";
    $sql1 .="{$row['men_user_id']},";
    $sql1 .="{$row['men_id']},";
    $sql1 .="{$row['men_sort']},"; 
    $sql1 .="{$row['men_ues_level']}, ";
  
    $sql1 .="'{$row['men_button']}',";
    $sql1 .="'{$row['men_tipp']}',";
    $sql1 .="'{$row['men_link']}',";
    $sql1 .="'{$row['men_html']}',";
  
    $sql1 .="{$row['men_fenster']},"; 
    $sql1 .="{$row['men_hide']},";
    $sql1 .="{$row['men_druck_button']}";
    $sql1 .=")";

    //echo str_len($row['men_html']);

    $rs1 = mysqli_query($PHP_BAA_DC, $sql1); if (!$rs1) {echo $sql1.mysqli_error($PHP_BAA);exit;}
    $i++;
    // echo "<br>$i ".$row['men_id']." ".$row['men_button'];
    
  }  
  mysqli_free_result($rs0);
  echo "<h3>fertig</h3>";
}


function alle_ckeck_kopiere($PHP_BAA_DC,$feld,$endung,$zielUnterOrdner) {
  echo "<h0>PDFs Testen und Pfad ändern und kopieren</h0>";
  
  $filter="(".$feld." LIKE '%http%' AND ".$feld." LIKE '%{$endung}%') OR (".$feld." LIKE '../kcfinder%' AND ".$feld." LIKE '%{$endung}%') ";
  
  $sql = "SELECT men_id,men_button,men_link,men_html FROM menuezeilen WHERE ($filter) ORDER BY men_link";
  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  echo "Anzahl: ".mysqli_num_rows($rs).": ".$sql;
  
  while ($row = mysqli_fetch_assoc($rs)) {
    $link=$row[$feld];
    //echo $link." ### ".$row['men_button']." <br>";
    $erg=checke_und_kopiere($link,$link,$zielUnterOrdner);

    if ($erg!="no")  {
      $sql2="UPDATE menuezeilen SET men_link='{$erg}' WHERE men_id={$row['men_id']}";
      $rs2 = mysqli_query($PHP_BAA_DC, $sql2); if (!$rs2) {echo $sql2.mysqli_error($PHP_BAA_DC);exit;}
    }
  } 
  mysqli_free_result($rs);
}


function checke_und_kopiere($uid,$gesDatei,$zielUnterOrdner) {
  $ret="no";
  
  if (strpos($gesDatei,"https://baa.at/projekte/")!==false) {
    $pruefeTeil="https://baa.at/projekte/";
    $relativExists="../../";
    // $pruefeTeil,$relativExists,
  }

  if (strpos($gesDatei,"../kcfinder/upload/")!==false) {
    // if ($uid==120) {
      $pruefeTeil="../kcfinder/upload/";
      $relativExists="../../beebot-dlpl4/kcfinder/upload/";
      $relativExists="../../edumenu/kcfinder/upload/";
  
    // }
    // $pruefeTeil,$relativExists,
  }



  echo "ges: ".$gesDatei."<br>PruefTeil: ".$pruefeTeil."<br>RelativErsatz: ".$relativExists."<br>ZielUnterOrdner: ".$zielUnterOrdner."<br>";

  if (strpos($gesDatei,$pruefeTeil)===0) {
    $quellDatei=str_replace($pruefeTeil,$relativExists,$gesDatei);
    echo "relativPfad: ".$quellDatei;
    if (file_exists($quellDatei)) {
      echo "<hr>Urdatei ist vorhanden: ".$quellDatei;

      $a_tmp=explode("/",$gesDatei);
      $dname=$a_tmp[count($a_tmp)-1];
      
      $zielGesDatei="../assets/".$zielUnterOrdner.$dname;

      if (file_exists($zielGesDatei)) {
        echo " ###### Zieldatei ist vorhanden: ".$zielGesDatei."<br>";
        $ret=$zielGesDatei;
      } else {  
        echo "<h2>Achtung fehlt noch: ".$zielGesDatei."</h2>";
        if (copy($quellDatei, $zielGesDatei)) {
          echo "<h3>Kopiert: $zielGesDatei</h3>";
          $ret=$zielGesDatei;
        } else {
          echo "<h2>Fehler: $zielGesDatei</h2>";
        }
      }  
    } else {
      echo "<h1 style='color:red'>Achtung fehlt überhaupt: ".$quellDatei."</h1>";
    }
  }
  return $ret;
}


// function checke_und_kopiere_img($gesDatei,"https://baa.at/projekte/",$zielUnterOrdner) {

// }  




function bilder_im_DOM($PHP_BAA_DC,$filt,$feld,$s,$zielUnterOrdner) {
  echo "<h3>Bilder aus DOM: Prüfe auf vorhandensein</h3>";
  $filter=$feld." LIKE '%".$s."%'";
 
  
  $sql = "SELECT men_user_id,men_button,men_id,men_html,men_link,men_sort FROM menuezeilen WHERE ($filter) ORDER BY men_user_id,men_sort";
  // $sql = "SELECT men_user_id,men_button,men_id,men_html,men_link FROM menuezeilen WHERE ($filter) limit 50";

  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  echo "<br>Anzahl: ".mysqli_num_rows($rs).": ".$sql."<br>";
  
  $dom = new DOMDocument('1.0', 'utf-8');

  $anz=0;
  $such_liste=[];
  while ($row = mysqli_fetch_assoc($rs)) {
    $html=$row['men_html'];
    $uid=$row['men_user_id'];
    $dom->loadHTML($html);
  
    $picts = $dom->getElementsByTagName('img');
    echo "<hr><h3>===========>".$row['men_button']." ".$row['men_id']." ".$row['men_user_id']." ".$row['men_sort']."</h3>";
    $update_flag=0;  
    foreach ($picts as $ind=>$a) {
      $src_bild=$a->getAttribute('src');
      echo "<b>$anz $ind</b> src=",$a->getAttribute('src')."<br>";
      // $a_tmp=explode("/",$src_bild);
      // $dname=$a_tmp[count($a_tmp)-1];

      // $erg=checke_und_kopiere($uid,$src_bild,$zielUnterOrdner);
      $ret=nur_copy($uid,$src_bild,$zielUnterOrdner);

      //beebot-dlpl4/kcfinder/upload/"

      if ($ret==1) {
        // $update_flag=1;  
        // $a->setAttribute('src',$erg);
        // $dom->saveHTML();
        echo "<h2>ja - alles ok</h2>";
      
      }
    }
    $anz++;
  }  
  mysqli_free_result($rs);
  // echo "<br>Anzahl der gefundenen: ",$anz;
  $sql = "SELECT men_user_id,men_button FROM menuezeilen WHERE (LEFT(men_button,1)='<')";
  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  echo "<br>Anzahl: ".mysqli_num_rows($rs).": ".$sql."<br>";
  while ($row = mysqli_fetch_assoc($rs)) {
    if (strpos($row['men_button'],"img")!==false) {
      $uid=$row['men_user_id'];
      $t=$row['men_button'];
      $a_tmp=explode(">",$t);
      $name=substr($a_tmp[0],5,25);
      echo "<b>$name</b><br>";
      $ret=nur_copy($uid,"_icon_".$name,$zielUnterOrdner);
    }
  }
  mysqli_free_result($rs);
}




function nur_copy($uid,$gesDatei,$zielordner) {

  // if (strpos($gesDatei,"https://baa.at/projekte/")===true) {
  //   $pruefeTeil="https://baa.at/projekte/";
  //   $relativExists="../../";
  //   // $pruefeTeil,$relativExists,
  // }
  // echo "gesDatei: ".$gesDatei;
  $ret=0;

  $p1="kcfinder";
  $p2="../images/qrcodes/";
  $p3="../images/";
  $p4="https://baa.at/projekte/";
  $p5="_icon_";

  


  $a_tmp=explode("/",$gesDatei);
  $dname=$a_tmp[count($a_tmp)-1];

  $quellDatei=$gesDatei;
  $zielDatei="../assets/images/".$dname;
  
  if (substr($gesDatei,0,6)=="_icon_") {
      $zielDatei="../assets/images/icon/".substr($gesDatei,6,25);
  }
  if (strpos($gesDatei,$p2)!==false) {
      $zielDatei="../assets/images/qrcodes/".$dname;
  }
  
  if (file_exists($zielDatei)) return 1;
   

  echo "gesdatei: ".$gesDatei;
  echo "<br>enth: $p1 ".strpos($gesDatei,$p1);
  echo "<br>enth: $p2 ".strpos($gesDatei,$p2);
  echo "<br>enth: $p3 ".strpos($gesDatei,$p3);
  echo "<br>enth: $p4 ".strpos($gesDatei,$p4);
  echo "<br>enth: $p5 ".strpos($gesDatei,$p5);
  
  $a_quellDateien=[$gesDatei];
  if (strpos($gesDatei,$p1)!==false) {
    echo "<h1>p1 ".strpos($gesDatei,$p1)."</h1>";
    $a_quellDateien[0]        ="../../beebot-dlpl4/kcfinder/upload/images/".$dname;
    array_push($a_quellDateien,"../../beebot-dlpl4/kcfinder/upload/images/digi-case/".$dname);
    array_push($a_quellDateien,"../../edumenu/kcfinder/upload/images/".$dname);
    array_push($a_quellDateien,"../../edumenu/kcfinder/upload/images/digi-case/".$dname);
    array_push($a_quellDateien,"../../edumenu/images/".$dname);

  } else if (strpos($gesDatei,$p2)!==false) {
      $zielDatei="../assets/images/qrcodes/".$dname;
      echo "<h1>p2 ".strpos($gesDatei,$p2)."</h1>";
      array_push($a_quellDateien,"../../beebot-dlpl4/images/qrcodes/".$dname);

  } else if (strpos($gesDatei,$p3)!==false) {
      echo "<h1>p3 ".strpos($gesDatei,$p3)."</h1>";
  
      $a_quellDateien[0]        ="../../edumenu/images/".$dname;
      array_push($a_quellDateien,"../../beebot-dlpl4/images/".$dname);

  } else if (strpos($gesDatei,$p4)!==false) {
      echo "<h1>p4 ".strpos($gesDatei,$p4)."</h1>";exit;

      $a_quellDateien[0]        ="../../beebot-dlpl4/kcfinder/upload/images/".$dname;
      
      array_push($a_quellDateien,"../../edumenu/kcfinder/upload/images/".$dname);
      array_push($a_quellDateien,"../../edumenu/kcfinder/upload/images/digi-case/".$dname);
      array_push($a_quellDateien,"../../edumenu/images/".$dname);

  } else if (strpos($gesDatei,$p5)!==false) {
      $dname=substr($dname,6,25); 
      echo "<h1>p5 ".strpos($gesDatei,$p5)." $dname $zielDatei </h1>";
      $a_quellDateien[0]        ="../../edumenu/images/".$dname;
  }


  echo "<pre>";
  print_r($a_quellDateien);
  echo "</pre>";

  // echo "<h3>copy ".$quellDatei." nach ".$zielDatei."</h3>".file_Exists($quellDatei);
  $ok=0;
  $i=0;
  $anz=count($a_quellDateien);
  do {
    $quelle=$a_quellDateien[$i];
    $i++;
    if (file_exists($zielDatei)) {
      echo "<h3>Schon vorhanden: $zielDatei</h3>";
      $ok=99;
      break; 

    } else {
      if (file_exists($quelle)) {
        echo "<h3>copy ".$quelle." nach ".$zielDatei."</h3>";
      
        if (copy($quelle, $zielDatei)) {
          echo "<h3>Kopiert: $zielDatei</h3>";
          $ok=99;
          break;
        } else {
          $ok=-1;
          echo "<h2>Fehler: $zielDatei</h2>";
        }
     } else {
        $ok=-1;
        //break;
     } 
    }   
  } while ($i<$anz);
  // echo "<h2>AUSSTIEG</h2>";

  if ($ok==-1) {
    echo "<h1>$quelle <br>Datei NOTFOUND: $zielDatei</h1>";
    exit; 
  }

  return $ok;
}

function alle_DOM_bilder_zeigen($PHP_BAA_DC,$feld,$s) {
  echo "<h3>Bilder aus DOM: Prüfe auf vorhandensein</h3>";
  $filter=$feld." LIKE '%".$s."%'";

  $sql = "SELECT men_user_id,men_button,men_id,men_html,men_link,men_sort FROM menuezeilen WHERE ($filter) ORDER BY men_user_id,men_sort";
  // $sql = "SELECT men_user_id,men_button,men_id,men_html,men_link FROM menuezeilen WHERE ($filter) limit 50";

  $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  echo "<br>Anzahl: ".mysqli_num_rows($rs).": ".$sql."<br>";
  
  $dom = new DOMDocument('1.0', 'utf-8');
  $anz=0;
  $such_liste=[];
  while ($row = mysqli_fetch_assoc($rs)) {
    
    $html=$row['men_html'];
    $uid=$row['men_user_id'];
    $dom->loadHTML($html);
  
    $picts = $dom->getElementsByTagName('img');
    //echo "<hr><h3>===========>".$row['men_button']." ".$row['men_id']." ".$row['men_user_id']." ".$row['men_sort']."</h3>";
    $update_flag=0;  
    foreach ($picts as $ind=>$a) {
      $src_bild=$a->getAttribute('src');
      if (substr($src_bild,0,9)!="../assets" ) {
        $anz++;
        echo "<b>$anz $ind</b> src=",$a->getAttribute('src')."<br>";
      }
      
    }
    
  }  
  mysqli_free_result($rs);
  echo "<h3>(1045)Anzahl Bilder: $anz</h3>";
}

function copy_qrcodes_all($flag) {
  
  if ($flag==1) {
    $a_picts=["bleistift-links.png",
    "coffee2.png",
    "drucken.png",
    "digi.case.dlpl.png",
    "auge.png",
    "bee_birg_bullet.png",
    "bee_birg_bullet_k.png",
    "dlpl_bg.png",
    "A9R18xw3dl_4z3phv_pj4.png",
    "robotbiber-c.png",
    
    
    "bee_birg_bullet_quer.png"];
    foreach ($a_picts as $d) {
      echo "<br>Kopiert: $d ".copy("../../edumenu/images/{$d}", "../assets/images/{$d}"); 
      echo "<br>Kopiert: $d ".copy("../../beebot-dlpl4/images/{$d}", "../assets/images/{$d}"); 
      echo "<br>Kopiert: $d ".copy("../../beebot-dlpl4/kcfinder/upload/images/{$d}", "../assets/images/{$d}"); 
    }
  }
  if ($flag==2) { 
    $src = "/is/htdocs/wp10956965_I1DMAXW6A4/www/projekte/beebot-dlpl4/images/qrcodes/*.*";  // source folder or file
    $dest = "/is/htdocs/wp10956965_I1DMAXW6A4/www/projekte/dc/assets/images/qrcodes/";   // destination folder or file        
    // shell_exec("cp -r $src $dest");
    shell_exec("cp $src $dest");
    echo "<H3>QR-Codes von <br><b>$src</b> nach <br><b>$dest</b> kopieren!</H3>"; //output when done
  
  }
}



?>
</body>
</html>

<?php


?>