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
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!-- <meta Set-Cookie: cookieName=cookieValue; SameSite=Strict; />> -->
<title id='men_titel'>DIGI.CASE.2.0</title>

<html>
<head>
<title id='men_titel'>EDU-Menü</title>
<meta name="robots" content="noindex" />

<link rel="apple-touch-startup-image" href="assets/images/icons/digi.case.apple.png">
<link rel="apple-touch-icon" href="assets/images/icons/digi.case.apple.png">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />

<meta name="robots" content="noindex" />

<script src="https://code.jquery.com/jquery-3.6.3.min.js"></script> 
<script src="index_men.js"></script> 


<style>


html {box-sizing: border-box;}
/* *, *:before, *:after {
  box-sizing: inherit;
} */

body {
	font-family:Arial;
	margin:0px;
	background-color: white;
	background-color: #333;
	display:flex;
}
iframe { 
	/* border:5px solid red;  */
	border:none;
	margin:0px;
	padding:0xp;
	width:100%;
	height:100vh;

	/* border:1px solid red;   */
}

#men_menue,#men_menue_re {
	width:20%;	
	/* width:50%;	 */
	/* margin-right:4px; */
	/* border-right:1px solid #aaa; */
	overflow: hidden;
	min-width:180px;
	max-width:350px;
	/* -webkit-overflow-scrolling:touch; */
	/* position:absolute; */
	/* width:100%; */
	
}

#men_menue_re {

}

#men_fcont {
	border:4px solid orange;
	overflow:scroll;
	/* -webkit-overflow-scrolling:touch; */
}

.scroll-ios {
	overflow:scroll;
	-webkit-overflow-scrolling:touch;
	overflow-x:hidden;
}


#men_dialog {
	position:absolute;
	top: 30vh;
	left:20vw;

	display:none;
	background:#ccc;
	
	width:70%;
	max-width:640px;
	border:4px solid orange;
	border-radius:8px;
	/* padding:1%; */
	/* opacity:0.93; */
	/* height:200px; */
	box-shadow: 0px 0px 50px #ccc;
	text-align:center;
}
/* #dialog_button {
	border-radius:8px;
	border:3px solid red;
	padding:10px;
	font-size:1.3em;
	cursor:pointer;
} */

#men_haupt {
	background:#333
}
.gotoPage {
	position:fixed;
	bottom: 2px;
	width:4vw;
	height:3vw;
	vertical-align:middle;
	/* aspect-ratio: 1 / 0.66; */
	border:2px solid red;
	border:2px solid #999;
	border-radius:6px;
	background:#ccc;
	cursor:pointer;
	font-size:2em;
	text-align:center;
	padding:0px;

	/* user-select: none; -webkit-user-select: none;  */
}
#pg_li {
	left: 0.2vw;
	display:none;
}
#pg_re {
	right: 0.2vw;
	display:none;
}
#men_sw {
	top: 1px;
	font-size:1em;
	opacity: 0.5;
	display:none;
}

</style>
</head>

<body onload="init()">
<!-- <iframe id="men_menue" src="lib/men_acc.php<?=$param;?>" name="men_menue"></iframe> -->
<!-- <div id="men_fcont scroll-ios" > -->
<iframe id="men_menue" src="lib/men_acc.php<?=$param;?>" name="men_menue"></iframe>
<!-- </div> -->
<!-- <object type="text/html" data="lib/men_acc.php<?=$param;?>"></object> -->
<iframe id="men_haupt" src="about:blank" name="men_haupt"></iframe>
<!-- <iframe id="men_menue_re" src="lib/men_acc.php<?=$param;?>" name="men_menue"></iframe> -->
<span id='men_sw' class="gotoPage">Menü</span>
<!-- <span id='pg_li' class="gotoPage"><img src='assets/icons/pg_li.png'></span> -->
<img id='pg_li' class="gotoPage" src='assets/icons/pg_li.png'/>
<img id='pg_re' class="gotoPage" src='assets/icons/pg_re.png' />
<?php
$ipadr=$_SERVER["REMOTE_ADDR"];
// echo $ipadr;exit;
// if ($ipadr=="91.141.47.150") {
	echo "<iframe id='men_dialog' src='about:blank' name='men_dialog'></iframe>";
// }	
?>
</body>
</html>


 