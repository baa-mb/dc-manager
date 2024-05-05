<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sende Email</title>

	<style>
		* {
			padding:4px;
			margin:4px;
		}
		body {
			font-family:Arial;
		}
		textarea {
			width: 30%;
			height: 68px;
			padding:4px;
		} 
	</style>
	<script>
		function restart(flag) {
			// alert(location.pathname)
			location.href=location.pathname+"?send="+flag;
		}

		async function send_json(data) {
			//alert(data);
			try {
				let adr="https://baa.at/mm-team/mobile/elearn/lib/api_ep.php";
				const response = await fetch(adr, {
					method: "POST", // or 'PUT'
					headers: {
						"Content-Type": "application/json",
						// "Content-Type": "text/html",
					},
					body: JSON.stringify(data),
				});

				// const jsonData = await response.json();
				const txtData = await response.text();

				// console.log(jsonData);
				alert(txtData);

				// alert(response.ok);

			} catch (error) {
				console.error("Error:", error);
			}
		}

	</script>

</head>
<body>
	<h3>Überprüfe vorher die Sendegrenzen in <a href='https://kis.hosteurope.de/administration/webhosting/admin.php?menu=7&mode=scriptsettings&wp_id=10956965' target="_blank">KIS!</a></h3>
	<span>Rohdaten in beistrichgetrennter Liste mit Name, Email:</span><br><textarea>noch nicht fertig</textarea><br>
	<button onclick='restart(1)'>Zeige die Kandidaten (div_flag=1)</button>
	<button onclick='restart(2)'>Sende einer Mailserie (dauert 20 Sek.)</button><br><br>
	
<?php
//<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
$flag=$_GET['send'];
if ($flag>0) {
	include_once("../php_dc_conn.php");  

	// $sql="SELECT * FROM digi_lehrer WHERE (lehrer_pw REGEXP '^-?[0-9]+$' OR div_flag=1) AND lehrer_email IS NOT NULL ORDER BY lehrer_id desc ;";
	$sql="SELECT * FROM digi_lehrer WHERE (lehrer_pw IS NULL) OR (lehrer_pw = '') OR (div_flag=1) ORDER BY lehrer_id desc ;";
	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	$a_ret=array();


	while ($row = mysqli_fetch_assoc($rs)) {
		$l_id   = $row['lehrer_id'];
		$l_name = $row['lehrer_name'];
		$l_email= $row['lehrer_email'];
		$l_pw     = $row['lehrer_pw'];
		$div_flag=$row['div_flag'];
		
	
		//problmebehbung
		// if ($div_flag==0) { //nur wenn noch nie gelaufen
		// 	if ($row['divers']>"")  {
		// 		$l_pw=$row['divers'];
		// 	} else {
		// 		$l_pw=make_password($l_name);
		// 	}
		// }

		echo "<br><b>$l_name - $l_pw - ";
		if (empty($l_pw)) {
			$l_pw=make_password($l_name);
			$sql2="UPDATE digi_lehrer SET lehrer_pw='{$l_pw}', div_flag=1 WHERE lehrer_id=$l_id";
			$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;}
			echo "Passwort erzeugt!<br>";
		}
	
			
		if ($flag==2) {		
			$fehler=0;
			sleep(1);
			$fehler = sende_mail($l_email,$l_pw,$l_name,$flag);
			if ($fehler==0) {
				$sql2="UPDATE digi_lehrer SET div_flag=0 WHERE lehrer_id=$l_id";
				$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;}

				$data=array(
					'flag'  => 'usp',
					'a_name'  => $l_name,
					'a_email' => $l_email,
					'a_password'  => $l_pw,
					'a_descr' => 'digi.case',
					'a_type'=> 4);

				$dat=json_encode($data);

				// echo "<script>send_json('".$dat."')</script>";
				echo "<a href='javascript:send_json($dat)'>Send to Edupuzzle</a>";
			}
		}	
		// sleep(1);
		// if ($fehler==0) {
		// 	if ($flag==2) {		
		// 		$sql2="UPDATE digi_lehrer SET lehrer_pw='{$l_pw}', div_flag=1 WHERE lehrer_id=$l_id";
		// 		$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;}
		// 	}
		// }

		
	}
	mysqli_free_result($rs);
	
}


function make_password($name) {
	$a_tmp=explode(" ",$name);
	$pw="";
	if (count($a_tmp)==2) {
		$pw=strtoupper($a_tmp[0][0]).strtolower($a_tmp[1][0]).rand(1100,9999);
	} else {
		$pw=strtoupper($a_tmp[0][0]).strtolower($a_tmp[0][1]).rand(1100,9999);
	}
	return $pw;
}

function sende_mail($email,$passwort,$name,$flag) {
	$fehler=0;
	$ziel_email=$email;
	
	// $ziel_email="baa@ph-linz.at";
	// $ziel_email="peter.walchshofer@ph-linz.at";
	// $ziel_email="alois.bachinger@ph-linz.at";
	// $ziel_email="irene.bachinger.fr@gmail.com";
	
	
	
	$subject="Zugangscode: digi.case-Manager";
	$body="Sehr geehrte Frau Kollegin, sehr geehrter Herr Kollege!";
	$body.="<br>\r\n<br>\r\nIhr Zugangscode für den digi.case-Manager lautet <b>".$passwort."</b> ";
	$body.="(Kontrolle: Der Code besteht aus einem Großbuchstaben, einem Kleinbuchstaben und einer vierstelligen Zahl)";

	$body.="<br>\r\n<br>\r\nFalls Sie noch Fragen zum digi.case-Manager haben, so empfehlen wir die Seite <a href='https://dcm-learn.baa.at'>https://dcm-learn.baa.at</a> - bitte Ihren SchülerInnen nur dc.baa.at bekanntgeben.";
	$body.="<br>\r\n<br>\r\nViel Erfolg beim Arbeiten mit dem digi.case-Manager.";
	$body.="<br>\r\nHG Alois Bachinger";
	$body.="<br>\r\n<br>\r\n(Bitte bestätigen Sie kurz, ob diese Mail bei Ihnen angekommen ist und nicht durch diverse Filter aussortiert wurde - Antwort an alois.bachinger@ph-linz.at)";

	// $bod<="nur test";

	//	$body=utf8_encode($body);

	// $header = "From: baa@ixbach.at\r\nReply-To: baa@ph-linz.at\r\nX-Mailer: PHP/'". phpversion()."\r\nContent-Type: text/html; charset=UTF-8"; 	
	// hier geht xixbach.at und baa.at aber auch ph-linz.at geht jetzt 1.2023
	// $header = "From: bachinger@baa.at\r\nReply-To: baa@ph-linz.at\r\nX-Mailer: PHP/'". phpversion()."\r\nContent-Type: text/html; charset=UTF-8";
	// $header = "From:bachinger@baa.at\r\nReply-To:bachinger@baa.at\r\nX-Mailer: PHP/'". phpversion()."\r\nContent-Type: text/html; charset=UTF-8";
	// $header = "From: bachinger@baa.at\r\nReply-To: alois.bachinger@ph-linz.at\r\nX-Mailer: PHP/'". phpversion()."\r\nContent-Type: text/html; charset=UTF-8";
	

	$header="From: alois.bachinger@ph-linz.at\r\nX-Mailer: PHP/'".phpversion()."\r\nContent-Type: text/html; charset=UTF-8";

	//funktioniert
	$header="From: alois.bachinger@ph-linz.at\r\nX-Mailer: PHP/'".phpversion()."\r\nContent-Type: text/html; charset=UTF-8";
	$header = "From: bachinger@baa.at\r\nReply-To: alois.bachinger@ph-linz.at\r\nX-Mailer: PHP/'". phpversion()."\r\nContent-Type: text/html; charset=UTF-8";
	$header = "From: bachinger@baa.at\r\nContent-Type: text/html; charset=UTF-8";

	echo $ziel_email."<br><br>";
	echo $subject."<br><br></b>";
	echo $body;
	echo "<Hr>";

	if ($flag==2) {
		if (strpos($ziel_email,"@")<2) {
			echo("Mailadresse nicht korrekt!");
			$fehler=1;
		} else if (!mail($ziel_email, $subject, $body,$header)) {
			echo("Message delivery failed...");
			$fehler=1;
		} else {
			echo("Passwort wurde zugestellt - bitte im Postfach nachsehen!");
		}

	}
	return $fehler;
}

?>

</body>
</html>
