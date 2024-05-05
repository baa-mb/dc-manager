<?php include("sani.inc");?>

<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Editor</title>
  <style>
    body {
      font-size:1.0em;
      font-family: Arial;
    }

    img {
      display:block;
      width:200px;

    }
    .block {
      float:left;
      margin:24px;width: 200px;
      text-align:center;
      height:250px;
    }
    .lsg {
      background-color:#ccc;
      padding:4px;
      margin-top:0px;

    }
    .ifr {

      width: 300px;height:200px;
      width: 100%;height:80%;
      border:0px;
      overflow-y:hidden;
    }

  </style>
</head>

<body>
<?php

//Könnte man einmal umstellen auf datanbank
$a_karten=array(

  [1027,22323,"B1) Der bunte Turm"],
  [1028,22324,"B2) In der Wäscherei"],
  [1029,22325,"B3) Wer war es?"],
  [1030,22326,"B4) Fallender Roboter"],
  [1031,22327,"B5) Sortiere die Knöpfe"],
  [1032,22328,"B6) Außerirdische Bewohner"],
  [1033,22329,"B7) Die Schuhe und ihre Schnüre"],
  [1034,22330,"B8) Ein Bild aus Stickern"],
  [1035,22331,"B9) Die vielfältigen Sticker"],
  [1036,22332,"B10) Armbänder"],
  [1037,22333,"B11) Ballone"],
  [1038,22334,"B12) Suche aufmerksam"],
  [1039,22335,"B13) Kleine Flaggen"],
  [1040,22336,"B14) Das Band"],
  [1041,22337,"B15) Bewässerung"],
  [1042,22338,"B16) Eiscreme-Kugeln"],
  [1043,22339,"B17) Vogelhaus"],
  [1044,22340,"B18) Der Biber-Schamane"],
  [1045,22341,"B19) Das Biber-Geld"],
  [1046,22342,"B20) Kreuzungen"],
  [1047,22343,"B21) Wasserversorgung"],
  [1048,22344,"B22) Klebebildchen"],
  [1049,22345,"B23) Welches Foto?"],
  [1050,22346,"B24) Suche und analysiere"],
  [1051,22347,"B25) Links um"],
  [1052,22348,"B26) Biber-Bilder"],
  [1053,22349,"B27) Schleusen"],
  [1054,22350,"B28) Puzzlesteine"],
  [1055,22351,"B29) Traumkleid 1"],
  [1056,22352,"B30) Käsegänge"],
  [1061,22353,"B31) Schulausflug"],
  [1062,22354,"B32) Der Schmuck am Tannenbaum 1"],
  [1063,22359,"B33) Ein kurzes Programm"],
  [1064,22360,"B34) Halskette"],
  [1065,22361,"B35) Buchstabenbaum 1"],
  [1066,22363,"B36) Der schwimmende Roboter"],
  [1067,22365,"B37) Froschhüpfen"],
  [1068,22366,"B38) Traumkleid 2"],
  [1069,22367,"B39) Morsecode"],
  [1070,22368,"B40) Vegetarische Schnitzeljagd"],
  [1071,22369,"B41) Nach der Schule"],
  [1072,22370,"B42) Das Roboterauto"],
  [1073,22371,"B43) Der Biber und die Waage"],
  [1074,22372,"B44) Der falsche Hut"],
  [1075,22373,"B45) Farbmuster"],
  [1076,22374,"B46) Total geheim"],
  [1077,22375,"B47) Münzen verdienen"],
  [1078,22376,"B48) Schnellwäscherei"],
  [1079,22377,"B49) Datenübertragung"],
  [1080,22378,"B50) Navigation"],
  [1081,22379,"B51) Tuwas"],
  [1082,22380,"B52) Falsche Armbänder"],
  [1083,22381,"B53) Zahnbürsten"],
  [1084,22382,"B54) Flussaufwärts"],
  [1085,22383,"B55) Viele Freunde"],
  [1086,22384,"B56) Pilze finden"],
  [1087,22385,"B57) 3D-Labyrinth"],
  [1088,22386,"B58) Laut oder leise"],
  [1089,22387,"B59) Flaggen am Strand"],
  [1090,22388,"B60) Arten"],
  [1091,22389,"B61) Zugleich"],
  [1092,22390,"B62) Nachrichtendienst"],
  [1093,22391,"B63) Parkplätze"],
  [1094,22392,"B64) Hunde - klein und groß"],
  [1095,22393,"B65) Stock und Schild"],
  [1096,22394,"B66) Biberschulvirus"],
  [1097,22395,"B67) Schatzkarte"],
  [1098,22396,"B68) Schwarzweißbilder"],
  [1099,22397,"B69) Wer gewinnt?"],
  [1100,22398,"B70) Treppauf"],
  [1101,22399,"B71) ... und du bist raus!"],
  [1144,22364,"B72) Der schwimmende Roboter"],
  [1103,22401,"B73) Nur neun Tasten"],
  [1104,22402,"B74) Richtige Richtung"],
  [1105,22403,"B75) Schwimmwettbewerb"],
  [1106,22404,"B76) Sparsames Bewässern 1"],
  [1107,22405,"B77) Sparsames Bewässern 2"],
  [1108,22406,"B78) Blumen und Sonnen"],
  [1109,22407,"B79) Blumenfarben"],
  [1110,22408,"B80) Regel-Regal"],
  [1111,22409,"B81) Geburtstagskerzen"],
  [1143,22362,"B82) Buchstabenbaum 2"],
  [1113,22411,"B83) Bitte lächeln!"],
  [1114,22412,"B84) Gartentor"],
  [1115,22413,"B85) Kreiselstadt"],
  [1116,22414,"B86) Wie raus?"],
  [1142,22704,"B87) Bunte Straße"],
  [1118,22416,"B88) Stempelmaschine"],
  [1119,22417,"B89) Verlorene _nf_rmat_on"],
  [1120,22418,"B90) Biber-Ausweis"],
  [1121,22419,"B91) Funknetz im Dorf"],
  [1122,22420,"B92) Gefäße"],
  [1123,22421,"B93) QB-Code"],
  [1124,22422,"B94) Spiegelei"],
  [1125,22423,"B95) Geheime Nachrichten"],
  [1126,22424,"B96) Mittagspause"],
  [1127,22425,"B97) Fünf Hölzchen"],
  [1128,22426,"B98) Klammerschmuck"],
  [1141,22707,"B99) Teddybär"],
  [1130,22428,"B100) Suanpan"],
  [1131,22676,"B101) Aufräumen"],
  [1132,22677,"B102) Bibertaler"],
  [1133,22678,"B103) Kratzbilder"],
  [1134,22679,"B104) Eis am Stiel"],
  [1135,22681,"B105) Zum Strand"],
  [1136,22695,"B106) Stempel"],
  [1137,22702,"B107) Teller-Ordnung"],
  [1138,22703,"B108) Am schwersten"],
  [1139,22705,"B109) Rasensprenger"],
  [1140,22706,"B110) Rundgang"]
  
);

if ($_GET['baa']!=1) {
  if ((substr($_GET['erlaubt'],0,20)=="digi.case.dlpl.at.23") ||  (substr($_GET['erlaubt'],0,4)=="1604"))  {
    if ($_GET['baa']!="1") {
      echo "<h2>Lösungen Biberaufgaben: Bitte unter Verschluss halten und das Passwort nicht weitergeben.</h2>";
      foreach ($a_karten as $key => $a_wert) {
        $lsg=get_lsg($a_wert[1]);
        echo "<div class='txt'>
          $a_wert[2]: <span class='lsg'>$lsg</span>
        </div>";
      }

    } else {
      foreach ($a_karten as $key => $a_wert) {
        //echo $key." ".$a_wert[0];
        if ($key<1000) {
exit;
          $lsg=get_lsg($a_wert[1]);
          echo "<div class='block' style='width:300px;height:280px'>$a_wert[2]
            <iframe class='ifr' scrolling=no src='http://dlpl4.baa.at/lib/make_html.php?m_id=".$a_wert[1]."'></iframe>
          <p class='lsg'>$lsg</p>
          </div>";
        }
      }
    }

  /*
    foreach ($a_karten as $key => $a_wert) {
      $lsg=file_get_contents("../images/qrcodes/x".$a_wert[0].".txt");
      echo "<div class='block'>$a_wert[1]
      <img src='../images/qrcodes/".$a_wert[0].".png' />
      <p class='lsg'>$lsg</p>
      </div>";
    }
  */
  } else {
    echo "
      <script>
        antw=prompt ('Wie heißt das Zugriffspasswort?','digi.case.dlpl.at');
        if (antw != null) {
          location.href='liste_loesungen.php?erlaubt='+antw;
        }
      </script>
    ";
    //echo "Kein Zugriff";
  }
}

echo "<h2>>> QR-Codes zu den Biber-Aufgaben (jede Woche eine Denksport-Aufgabe!)</h2>";
foreach ($a_karten as $key => $a_wert) {
  $lsg=get_lsg($a_wert[1]);
  echo "<div class='block' style='page-break-inside: avoid'>$a_wert[2]
  <img src='../../assets/images/qrcodes/".$a_wert[0].".png' />
  </div>";
}

//ende


function get_lsg($nr) {
  $dname="../../assets/images/qrcodes/x".$nr.".txt";
  $lsq="???";
  if (file_exists($dname)) {
    $lsg=file_get_contents($dname);
  }
  return $lsg;
}

?>
</body>
</html>
