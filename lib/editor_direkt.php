<?php
	session_start(); $_SESSION['user_baa_name']="ali01";
	$_SESSION['IsBachinger']=1;
	$men_user_id=$_SESSION['men_user_id'];
	if (empty($men_user_id)) {
		echo "<h1>Linkes Fenster - neu starten!</h1>";
		echo "<script>window.parent.men_menue.location.reload();</script>";
		exit;
	}
?>
<html><head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Editor</title>


<!-- <script src="//code.jquery.com/jquery-1.10.2.min.js"></script> -->
<script src="https://code.jquery.com/jquery-3.6.3.min.js"></script> 
<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">

<script src="../ckeditor/ckeditor.js"></script>
<script src="../ckeditor/adapters/jquery.js"></script>

<link rel="stylesheet" href="styles/editor.css" />
<!-- script src="var_init.js"></script -->
<script src="editor_men.js"></script>

<script>
	ruf_flag=1;
</script>

</head>
<?php
	$men_id=$_GET['men_id'];
?>

<body>
<div class="header">
	<button onclick="refreshen()" class="b_move">Aktualisieren und Save</button>
	<span class='hues'> >>> Editor - bitte nichts ändern <<< </span>
	<button onclick="men_save(0,0,'ren',0)" class="b_move">Renum</button>
<!--
	<label for="chkx">Zusatzfelder:</label><input type="checkbox" id="chkx" name='chkx' class="gross" style='width:36px' <?=$chk;?> onchange="men_zusatz(this)">
	<button onclick="men_test(this)" class="b_move">Test</button>
-->
</div>
<?php
//echo "<script>alert('xxx:'+$men_id);</script>";
echo "<textarea id='men_html_$men_id' onchange='men_save($men_id,this,\"sp\",$hnd)' tabindex=0 ></textarea>";
?>
<input type='hidden' id='men_id' value='<?=$men_id;?>'>
<input type="hidden" id="men_user_id" value="<?=$men_user_id;?>" />
</body>
</html>
