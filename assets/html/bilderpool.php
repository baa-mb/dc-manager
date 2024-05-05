<?php //include("lib/php_class.php"); 
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <base href="https://baa.at/projekte/dc/lib/">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biberbeispiele</title>
    <!-- <link rel="stylesheet" href="../assets/html/sammlung.css"> -->
    <script type="text/javascript" src="../assets/html/sammlung.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <style>
        body {
            font-size:1em;
            font-family:Arial;
            display:flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items:center;
            background-color:white;
            background-repeat: no-repeat;
            background-position:top;
            background-size:50%;
            height:100vh;
            /* width:100%; */
        }
        .einzelbild {
            border:2px solid #ccc;
            width: 15%;
            /* margin:2px; */
            border-radius:8px;
            padding:0;
            margin:8px;
            background-color: #333;
            /* background-color: red; */

        }
        img {
            width:100%;
            border-radius:8px;
            padding:0;
            margin:0;
        }
        button {
            font-size:1em;
        }
        #cont_bbild {
            position:absolute;
            top:4px;
            right:4px;
        }
    </style>


    <script>

        window.parent.ablatt_id="";
        window.parent.ablatt_kzz="";

        function set_wahl(i) {

            // projekt_nr = id;
            b_adr=document.getElementById(i).getAttribute("src").replace("/thumb","");

            htm="<div id='cont_bbild'><button onclick='sizer(0)'>kleiner</button><button onclick='sizer(1)'>größer</button>";
            htm+="<button onclick='sizer(2)'>Position</button></div>"
            document.body.innerHTML=htm;
            // document.body.style.backgroundImage="<img id='pict' src='"+b_adr.replace("/thumb","")+"'>";
            document.body.style.backgroundImage="url("+b_adr+")";
            document.body.style.backgroundSize="50%";
            document.body.style.backgroundPosition="center center";


            window.parent.show_zuweis_gruen(1);

            window.parent.ablatt_id=b_adr;
            window.parent.ablatt_kzz="BD";


    
        }

        function sizer(flag) {
            let bki=document.body.style;
            let size=bki.backgroundSize.split("%")[0];
            let s=Number(size);
            let posit=["left top","center top","right top","left center","center center","right center","left bottom","center bottom","right bottom"];
            // console.log(bki)
            if (flag==1)  {
                s*=1.1;
                bki.backgroundSize=s+"%";
            } else if (flag==0)  {
                s*=0.9;
                bki.backgroundSize=s+"%";
            } else {
                let p=bki.backgroundPosition;
                console.log("now",p)
                if (p>"") {
                    pp=posit[(posit.indexOf(p)+1) % 9]
                    bki.backgroundPosition=pp;
                }
            }
            
        }

    </script>

    
</head>

<body>
<h1>Das gewünschte<br>Bild auswählen</h1>
<?php
    $bildPfad="../image_pool";
    $a_bilder=scandir($bildPfad);
    // print_r($a_bilder);

    $umlaute = array("ä", "ü", "ö", "ß", "\'", " ");
    $neulaute = array("a", "u", "o", "ss", "_", "_");
    $i=0;
    $datei="rb000.png";
    $b_quell="{$bildPfad}/{$datei}";
    foreach ($a_bilder as $datei) { // Ausgabeschleife 
        if (!is_dir($datei) && $datei!="thumb")  {
            $oldName=$datei;
            $neuName=str_replace($umlaute, $neulaute, strtolower($oldName));
            if ($oldName!=$neuName) {
                rename ("{$bildPfad}/{$oldName}","{$bildPfad}/{$neuName}");
                // echo "<br>{$bildPfad}/{$oldName}","<br>{$bildPfad}/{$neuName}";
            }
          
            $b_quell="{$bildPfad}/{$neuName}";
            $b_ziel="{$bildPfad}/thumb/{$neuName}";
            // echo "<br>Zieldatei".$b_ziel;
            if (!file_exists($b_ziel)) {
                echo "<br>$i: $neuName"; 
                thumbnail($b_quell);
                
            } else {
                $i++;
                echo "<div class='einzelbild' onclick='set_wahl($i)'><img id='$i' src='../assets/image_pool/thumb/{$neuName}'></div>";
            }
        }
    }; 
?>


</body>
</html>

<?php 

// function thumbnail($imgfile, $thumb_dir="./image_pool/thumb/", $filenameOnly=true) {
function thumbnail($imgfile, $filenameOnly=true) {
    //Max. Größe des Thumbnail (Höhe und Breite)
    $thumbsize = 128;

    //Dateiname erzeugen
    $filename = basename($imgfile);
    $dirname = dirname($imgfile); 
    $thumb_dir=$dirname."/thumb/";
    echo "<br>pfad: >$thumb_dir< - filename: >$filename<";

    //Fügt den Pfad zur Datei dem Dateinamen hinzu
    //Aus ordner/bilder/bild1.jpg wird dann ordner_bilder_bild1.jpg
    if(!$filenameOnly) {
        $replace = array("/","\\",".");
        $filename = str_replace($replace,"_",dirname($imgfile))."_".$filename;
    }
    //Schreibarbeit sparen
  

    //thumb_dir vorhanden
    if(!is_dir($thumb_dir)) {
        echo "<br>kein ordner: $thumb_dir";
        return false;
        // echo "Kein Zielordner: $thumb_dir";
    }
        


    //Wenn Datei schon vorhanden, kein Thumbnail erstellen
    if (file_exists($thumb_dir.$filename)) {
       echo "Thumb existiert bereits";
        // return $thumb_dir.$filename;
    }
        
    echo "<br>imgfile:".$imgfile;
    //Ausgansdatei vorhanden? Wenn nicht, false zurückgeben
    if(!file_exists($imgfile)) {
        echo "Datei nicht gefunden: $thumb_dir.$filename";
        return false;
    }


    //Infos über das Bild
    $endung = strrchr($imgfile,".");

    list($width, $height) = getimagesize($imgfile);

    // echo "$width ja".$imgfile;

    $imgratio=$width/$height;

    //Ist das Bild höher als breit?
    if($imgratio>1) {
        $newwidth = $thumbsize;
        $newheight = round($thumbsize/$imgratio);
    } else {
        $newheight = $thumbsize;
        $newwidth = round($thumbsize*$imgratio);
    }

    //Bild erstellen
    //Achtung: imagecreatetruecolor funktioniert nur bei bestimmten GD Versionen
    //Falls ein Fehler auftritt, imagecreate nutzen
    if(function_exists("imagecreatetruecolor")) {
        $thumb = imagecreatetruecolor($newwidth,$newheight); 
    } else {
        $thumb = imagecreate ($newwidth,$newheight);
    }        

    if($endung == ".jpg") {
        // imagejpeg($thumb,$thumb_dir."temp.jpg");
        // $thumb = imagecreatefromjpeg($thumb_dir."temp.jpg");
        $source = imagecreatefromjpeg($imgfile);

    } else if ($endung == ".gif") {
        // imagegif($thumb,$thumb_dir."temp.gif");
        // $thumb = imagecreatefromgif($thumb_dir."temp.gif");
        $source = imagecreatefromgif($imgfile);

    } else if ($endung == ".png") {
        // imagepng($thumb,$thumb_dir."temp.png");
        // $thumb = imagecreatefrompng($thumb_dir."temp.png");
        $source = imagecreatefrompng($imgfile);
        echo "<h1>$imgfile</h1>";
    }

    // echo  "0, 0, 0, 0, $newwidth, $newheight, $width, $height,$thumb_dir.$filename";

    
    imagecopyresized($thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    // echo "<h1>vorbei</h1>"; //bei manchen bildern bleibrt es hier hängen
    //Bild speichern
    if($endung == ".png")
        imagepng($thumb,$thumb_dir.$filename);
    else if($endung == ".gif")
        imagegif($thumb,$thumb_dir.$filename);
    else
        imagejpeg($thumb,$thumb_dir.$filename,100);

    //Speicherplatz wieder freigeben
    ImageDestroy($thumb);
    ImageDestroy($source);

    // echo "<br>$ergebnis".$thumb_dir.$filename;
    //Pfad zu dem Bild zurückgeben
    return ;
}
    /* Beispiel */
    // $datei="../image_pool/rb000.png";
    // $thumb=thumbnail($datei);
    // echo "<br><img src='{$thumb}' >";
    /* Beispiel */
?>




