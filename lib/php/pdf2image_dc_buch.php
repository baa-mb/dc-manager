<?php

$img=new Imagick();

echo $img;

$res=150; //300 ist zu viel; 72 ist zu wenig
$img->setResolution($res,$res);
// $img->setResolution(300,300);

// $pdf="https://baa.at/projekte/dc/assets/pdfs/5490-4-Algorithmisierung.docx.pdf[0]";


$path="./pdfs/";
$path="../../assets/pdfs/";
$path="../../../assets/test/";

// $files = array_diff(scandir($path), array('.', '..'));
echo "<pre>";
// print_r ($files);
$x=100; $y=100;
$w=1242-2*$x; $h=1754 - 2 * $y;

$x=0;$y=0;
$w=1754;$h=1180;




// $img_file=str_replace(".pdf",".png",$file);


$pdf="//dom/dlpl/dc/assets/pdfs/digi.case/digi.case.dlpl.buch.pdf";

$pdf="../../../../dom/dlpl/dc/assets/pdfs/digi.case/digi.case.dlpl.test.pdf";

$path="../../../../dom/dlpl/dc/assets/test/";


// echo "vorhanden:".file_exists($pdf);

echo "Zu große serverbeanspruchung";


// for ($s=0;$s<151;$s++) {
for ($s=0;$s<151;$s++) {
    $img_file="bs_".($s-1).".png";
    // echo "<br>".$img_file;
    $i=0;
    if (!file_exists($path.$img_file) && ($i<7)) {
    // if (1==1) {    
        $i++;
        echo "<br>not: ".$path.$img_file;
        
        // $pdf="../../../../dom/dlpl/dc/assets/pdfs/digi.case/digi.case.dlpl.buch_s122ff.pdf[".($s)."]";

        $pdf="../../../../dom/dlpl/dc/assets/pdfs/digi.case/digi.case.dlpl.buch_no_qrcodes.pdf[".($s)."]";

        $img->readImage($pdf);
        sleep(5);
        $img->setResolution($res,$res);
        $size=$img->getSize();
        echo "<br>",$img->getImageWidth()."x".$img->getImageHeight();

        $dd=60;
        $img->cropImage($w-$dd*2+1, $h-$dd-24, $x+$dd, $y+$dd-7);
        $size=$img->getSize();
        echo $img->getImageWidth()."x".$img->getImageHeight();

        echo"<br>Cropped:".$path.$img_file;
        $img->writeImage($path.$img_file);
        // $img->writeImage($img_file);
        echo "<br>Erzeugt -> ".$img_file."<br>";
    
    } else {
        echo "Bereits vorhanden oder noch unter 10 - $img_file <br>";
    }
}

echo "</pre>";
// echo "<br>Fertig: ".$pdf;

// for ($s=120;$s>=0;$s--) {
//     $alt="bs_".($s).".png";
//     $neu="bs_".($s+1).".png";
//     rename ($path.$alt,$path.$neu);
// }    
// exit;
?>