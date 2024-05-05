<?php session_start();
include_once("/lib/sani.inc");
if (isset($_GET['aufruf_prg'])) {
	$_SESSION['aufruf_prg']=$_GET['aufruf_prg'];
}
$param="";
if (count($_GET)>0) {
	$param="?".http_build_query($_GET,'', '&');
}

?>
<html>
<head>
<title id='men_titel'>EDU-Menü</title>
<meta name="robots" content="noindex" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="apple-touch-startup-image" href="images/digi.case.apple.png">
<link rel="apple-touch-icon" href="images/digi.case.apple.png">

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<?php
$jqv = "2.1.0";
$jqmvers = "1.4.4";
?>

<script src="https://code.jquery.com/jquery-<?= $jqv ?>.min.js"></script>

<script>
var sw, sh, ww, wh,rand;

$(document).ready(function () {
	sw=screen.width;sh=screen.height;
	$(window).resize(function() {
		resizen(); 
	})
	resizen();
});

// $(function(){
// 	if (/iPhone|iPod|iPad/.test(navigator.userAgent)) {
// 		$('iframe').wrap(function() {
// 			var $this = $(this);
// 			return $('<div />').css({width: $this.attr('width'),height: $this.attr('height'),overflow: 'auto','-webkit-overflow-scrolling': 'touch'});
// 		});
// 	}
// })

function resizen() {
	ww=$(window).width();wh=$(window).height();
	rand=8;
	rand=2;
	men_w=320;
	men_w="17%";
	hpt_w = ww - men_w - rand - 0;

	// $("iframe").height(wh-2);
	$("iframe").height("100vh");
	// $("iframe").height("99.9vh");
	$("#men_menue").width(men_w);
	
	// $("#men_haupt").width(hpt_w);
	// $("#men_haupt").css("margin-left",rand);
	// alert(wh)
	// $("#men_ablatt").width(men_w);

	//$("#men_haupt").height("90vh");
	

}

// function set_menue_breite(ww) {
// 	$("#men_menue").width(ww);
// 	wh=$(window).height();
// 	$("iframe").height(wh-2);
// }


</script>

<style>
html {box-sizing: border-box;}	
body {
	margin:0px;
	background-color: white;
	display:flex;

	/* background-color:#333; */
}
iframe {
	/* border:5px solid red;  */
	border:none;
	margin:0px;
	padding:0xp;
	width:100%;
	/* border:1px solid red;   */
}

#men_menue {
	border-right:3px solid #ccc;
}

#men_ablatt {
	border-left:3px solid #ccc;
	background-color:#333;
}

#men_senk {
	display:flex;
}

</style>
</head>

<body>
<iframe id="men_menue" src="lib/menue.php<?=$param;?>" name="men_menue"></iframe>
<iframe id="men_haupt" src="lib/menue.php<?=$param;?>" name="men_haupt"></iframe>
<!-- <iframe id="men_haupt" src="about:blank" name="men_haupt"></iframe> -->
<!-- <iframe id="men_ablatt" src="about:blank" name="men_ablatt"></iframe> -->

</body>
</html>


 