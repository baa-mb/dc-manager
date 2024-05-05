<?php
include '../qrlib.php';

// QR-Code-Parameter
$qrCodeData = 'Ihr Text hier';
$qrCodeUrl = 'https://dc.baa.at?s=21';
$qrCodeSize = 8;
$qrCodeMargin = 2;
// header('Content-type: image/png');
// Logo-Parameter
// $logoPath = get_mittel_logo("s12");
$logo = get_mittel_logo("s12");
$logoSize = 100;


// // QR-Code generieren
$qrCode=QRcode::png($qrCodeUrl, false, QR_ECLEVEL_M, $qrCodeSize, $qrCodeMargin);
// imagepng($img);
// exit;
// // $qrCode = ob_get_contents();
// // ob_end_clean();

// ob_start();
// QRcode::png($qrCodeUrl, null, QR_ECLEVEL_Q, $qrCodeSize, $qrCodeMargin);
// $qrCode = ob_get_contents();
// ob_end_clean();



// QR-Code mit Logo überlagern
// $qrCode = imagecreatefrompng('qrcode.png');
// $logo = imagecreatefrompng($logoPath);
$logoWidth = imagesx($logo);
$logoHeight = imagesy($logo);
echo $logoWidth;
$logoX = ($qrCodeSize * $logoSize / 100) / 2;
$logoY = $logoX;
imagecopyresampled($qrCode, $logo, $logoX, $logoY, 0, 0, $qrCodeSize * $logoSize / 100, $qrCodeSize * $logoSize / 100, $logoWidth, $logoHeight);
// imagepng($qrCode, 'qrcode_with_logo.png');

// imagepng($logo);

// QR-Code anzeigen
// echo '<img src="qrcode_with_logo.png" alt="QR-Code mit Logo">';


function get_mittel_logo($p_text) {
	header('Content-type: image/png');
	// Create the image
	if (strlen($p_text)<3) {
		$text="  ".$p_text;
	} else {
		$text=" ".$p_text;
	}

	// $bb=60;$hh=40;
	// file_put_contents('baa.txt',"test:".$text."\r\n",FILE_APPEND);	
	$bb=76; $hh=42;

	$im = imagecreatetruecolor($bb,$hh);
	// Create some colors
	$white = imagecolorallocate($im, 255, 255, 255);
	$red = imagecolorallocate($im, 255, 0, 0);
	$grey =  imagecolorallocate($im, 128, 128, 128);
	$black = imagecolorallocate($im, 0, 0, 0);
	imagefilledrectangle($im, 0, 0, $bb-1,$hh-1, $white);
	
	// imagefilledrectangle($im, 0, 0, $bb-1,$hh-1, $red);

	$font = 'arialbd.ttf'; //schrift muss impfad liegen
	// $font = 'arial.ttf';
	// imagettftext($im, 20, 0, 6, 34, $red, $font, $text);
	imagettftext($im, 20, 0, 6, 34, $red, $font, $text);
	// imagettftext($im, 20, 0, 6, 34, $black, $font, $text);

	// Using imagepng() results in clearer text compared with imagejpeg()

	//imagepng($im,"../assets/qrcodes/sch".$i.".png");
	return ($im);
	imagedestroy($im);
}


?>