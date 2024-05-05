<?php

$img=new Imagick();

echo $img;

$res=150; //300 ist zu viel; 72 ist zu wenig
$img->setResolution($res,$res);
// $img->setResolution(300,300);

// $pdf="https://baa.at/projekte/dc/assets/pdfs/5490-4-Algorithmisierung.docx.pdf[0]";


$path="./pdfs/";
$path="../../assets/pdfs/";
$files = array_diff(scandir($path), array('.', '..'));
echo "<pre>";
// print_r ($files);
$x=100; $y=100;
$w=1242-2*$x; $h=1754 - 2 * $y;
$i=0;
$pdf_files=[];
forEach($files as $file) {
    if ((strrpos($file,".pdf")>0) && ($i<=50)) {
      
        if ((substr($file,0,1)=="a") || (substr($file,0,1)=="5")) {
            if (strrpos($file,"sammelmappe")===false) {
                $img_file=str_replace(".pdf",".png",$file);
                if (!file_exists($path.$img_file)) {
                    
                    // array_push($pdf_files,$file);
                    $pdf=$path.$file."[0]";
                    // echo $pdf;
                    $img->readImage($pdf);
                    
                    // $img->writeImage("converted.jpg");
            
                    $img->cropImage($w, $h, $x, $y);
                    // $size=$img->getSize();
                    // echo $img->getImageWidth()."x".$img->getImageHeight();

                    $img->writeImage($path.$img_file);
                    echo "Erzeugt -> ".$img_file."<br>";
                    $i++;
                } else {
                    echo "Bereits vorhanden - $img_file <br>";
                }
            }
        } else {
            echo "Nicht im Namensschema - $file <br>";
        }
    }
}
echo "</pre>";
// echo "<br>Fertig: ".$pdf;

?>