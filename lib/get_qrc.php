<?php 
header("Content-Type: image/png");
include_once 'php/qr/qrlib.php';

$flag= isset($_GET['flag']) ? $_GET['flag'] : "fehlt";
$nr  = isset($_GET['nr']) ? $_GET['nr'] : 0;


$ziel="https://orf.at";

switch ($flag) {

    case "wp": //bin in 
        $pfad="../assets/qrcodes/";
        $filename = "{$pfad}{$flag}_{$nr}.png"; 
        $ziel="https://dc.baa.at/?wp={$nr}";
        break;

    case "fehlt":
        $filename = "../assets/icons/fehlerland.png"; 
        break;

    case "future":
        echo "i ist gleich 2";
        break;

    default:    
        exit;
}

$vorh=file_exists($filename);
if (!$vorh) {
    // $size="300x300";
    // $adr='https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs='.$size.'&chl='.rawurlencode($ziel);
    // $QR = imagecreatefrompng($adr);

    // $tmp_file="tmp/{$flag}_{$nr}.png";
    $qrCodeUrl=$ziel;
    QRcode::png($qrCodeUrl,$filename, QR_ECLEVEL_Q, 8, 2);
}
imagepng(imagecreatefrompng($filename));

?>