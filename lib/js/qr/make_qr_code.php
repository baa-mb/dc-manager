<?php
//wird derezit von niemand aufgerufen, weil altes google-plugin

$nr="1"; // ID-Nummer aus der QR-Datenbank
$nr=$_GET['nr'];
$has_logo=0;
if (isset($_GET['has_logo'])) {
	$has_logo=$_GET['has_logo']; //0 oder 1
}

$qr_server_dyn="https://qr.baa.at/";
if ($_GET['qr_server_dyn']>" ") {
	$qr_server_dyn=$_GET['qr_server_dyn'];
}


$qr_speicherpfad=$_GET['qr_speicherpfad'];
if ($qr_speicherpfad<" ") {
	echo "Fehler: Kein Speicherpfad in der DB!";
	exit;
}


$size="400x400";
$data = $qr_server_dyn.'?qr='.$nr; //dlpl oder baa

if (!file_exists($qr_speicherpfad.$nr.".png")) {
	if (isset($_GET['nr'])) {
		if ($has_logo==0) { //kein logo
			// $gformat="svg";
			$gformat="png";
			// $margin="40";
			$margin="10";
			$format="&format=".$gformat;
			//alles mit google
			$adr='https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs='.$size.'&chl='.rawurlencode($data);
			$QR = imagecreatefrompng($adr);
		} else {

			header('Content-type: image/png');
			// http://code.google.com/apis/chart/infographics/docs/qr_codes.html
			$QR = imagecreatefrompng('https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs='.$size.'&chl='.rawurlencode($data));
			if ($_GET['logo_text']>" "){
				$logo=get_mittel_logo($_GET['logo_text']);
				//echo $logo;
				//$logo = imagecreatefromstring(file_get_contents($logo));
				$QR_width = imagesx($QR);
				$QR_height = imagesy($QR);

				$logo_width = imagesx($logo);
				$logo_height = imagesy($logo);

				// Scale logo to fit in the QR Code
				$logo_qr_width = $QR_width/3;
				$scale = $logo_width/$logo_qr_width;
				$logo_qr_height = $logo_height/$scale;

				imagecopyresampled($QR, $logo, $QR_width/3, $QR_height/3, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
			}
		}
		imagepng($QR,$qr_speicherpfad.$nr.".png");
		imagepng($QR);
		imagedestroy($QR);
	}
}


function get_mittel_logo($p_text) {
	//header('Content-type: image/png');
	// Create the image
	if (strlen($p_text)<4) {
		$text=" ".$p_text;
	} else {
		$text=$p_text;
	}

	$bb=60;$hh=40;

	$bb=76;
	$hh=42;
	$im = imagecreatetruecolor($bb,$hh);
	// Create some colors
	$white = imagecolorallocate($im, 255, 255, 255);
	$grey = imagecolorallocate($im, 128, 128, 128);
	$black = imagecolorallocate($im, 0, 0, 0);
	imagefilledrectangle($im, 0, 0, $bb-1,$hh-1, $white);
	// The text to draw
	//$text = 'A02';
	//$text=$_GET['text'];
	// Replace path by your own font path
	$font = 'arialbd.ttf';
	// Add some shadow to the text
	//imagettftext($im, 20, 0, 11, 21, $grey, $font, $text);
	// Add the text
	//imagettftext($im, 20, 0, 6, 32, $black, $font, $text);
	imagettftext($im, 20, 0, 6, 34, $black, $font, $text);
	// Using imagepng() results in clearer text compared with imagejpeg()
	//imagepng($im);
	return ($im);
	imagedestroy($im);
}

?>
