<?php session_start();
include_once("lib/sani.inc");
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
<link rel="apple-touch-startup-image" href="images/phdl.png">
<link rel="apple-touch-icon" href="images/phdl.png">

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

	//   if (screen.width < 1000) {
	//     $("body").css("font-size", "1em");
	//     //$(".ui-collapsible-content").css("background-color","#ccc");
	//   } else {
	//     //$(".ui-collapsible-content").css("background-color","#FC6");
	//   }
});

$(function(){
	if (/iPhone|iPod|iPad/.test(navigator.userAgent)) {
		$('iframe').wrap(function() {
			var $this = $(this);
			return $('<div />').css({width: $this.attr('width'),height: $this.attr('height'),overflow: 'auto','-webkit-overflow-scrolling': 'touch'});
		});
	}
})

function resizen() {
	ww=$(window).width();wh=$(window).height();
	rand=8;
	men_w=220;
	hpt_w = ww - men_w - rand - 0;

	$("iframe").height(wh-2);
	$("#ifr_men").width(320);
	$("#ifr_men").css("margin-right",rand);
	$("#ifr_hpt").width(hpt_w);

}
</script>

<style>
body {
	margin:0px;
	background-color: #ccc;
}
iframe {
	border:5px solid red;
	margin:0px;
	padding:0xp;
	/* border:none;
 */
	/* float:left; */
}


#ifr_men {
	width:200px;
	height:800px;
	margin-right:8px;

}
#ifr_hpt {
	width:800px;
	height:800px;
	/* border:1px solid red; */
}
</style>
</head>

<body style='display:flex;border:5px solid blue'>
<iframe id="ifr_men" src="lib/menue_2022.php<?=$param;?>" name="n_men"></iframe>
<iframe id="ifr_hpt" src="about:blank" name="n_hpt"></iframe>
<!-- <iframe id="ifr_hpt" src="about:blank" name="n_hpt"></iframe> -->
</body>
</html>


