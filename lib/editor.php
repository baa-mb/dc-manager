<?php
session_start();
$_SESSION['IsBachinger'] = 1;
if (!isset($_COOKIE['admin'])) {
    setcookie("admin", "1", time() + 3600);
}

/*
if ($_SERVER['HTTP_REFERER']=="http://baa.menu.baa.at/menue.php") {
$_SESSION['loggedIN']=199;
}
echo ini_get("session.gc_maxlifetime")."<br />".ini_get("session.cookie_lifetime");exit;
$timeout=5;
// Set the max lifetime
ini_set("session.gc_maxlifetime", $timeout);

// Set the session cookie to timout
ini_set("session.cookie_lifetime", $timeout);

$timeout=5;
// Set the max lifetime
ini_set("session.gc_maxlifetime", $timeout);

 */

//$men_user_id = $_SESSION['men_user_id'];
$men_user_id = $_GET['men_user_id']; //wird mit editor als param mitgegeben
//echo "men_user_id <br /> <br />sess: <h1>".$men_user_id;"</h1><hr />";
if (empty($men_user_id)) {
    echo "<h1>Linkes Fenster - neu starten!</h1>";
    echo "<script>window.parent.men_menue.location.reload();</script>";
    exit;
}

$hpt_id = 0;
if (!empty($_GET['hpt_id'])) {
    $hpt_id = $_GET['hpt_id'];
}

$men_id_sel= empty($_GET['men_id_sel']) ? 0 : $_GET['men_id_sel'];
// $men_kzz= empty($_GET['men_kzz']) ? "" : $_GET['men_kzz'];
// $men_id_sel=getcookie($men_kzz."last_open");

/*
else {

if ($_SESSION['last_hsh']) {
echo "last_hsh='".$_SESSION['last_hsh']."';";
}
// nicht vorher setzen
if ($_GET['baa_hash']) {
$_SESSION['last_hsh']="#".$_GET['baa_hash'];
}
}
 */

//$pw = preg_replace('/[^A-Za-z0-9\-]/', '', $_POST["pw"]);

include "php_dc_conn.php";
//mysqli_select_db($PHP_BAA_DC,$projekt_dbname);
?>

<html><head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="robots" content="noindex">
	<title>Editor</title>


	<!-- <script src="//code.jquery.com/jquery-1.10.2.min.js"></script> -->
  <script src="https://code.jquery.com/jquery-3.6.3.min.js"></script> 
	<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">

	<script src="../ckeditor/ckeditor.js"></script>
	<script src="../ckeditor/adapters/jquery.js"></script>

	<link rel="stylesheet" href="styles/editor.css" />
	<script src="editor_men.js"></script>


<script>


var ctrl_ein=0;
function tastaus (evt) {
  ctrl_ein=0;
}


 function save_chk (evt) {
   if ((evt.key=="Control") && (!ctrl_ein)) {
     ctrl_ein=1;
   } else {
     if (ctrl_ein) {
      if (evt.which==83) {
        $("#id_refr").focus();
        setTimeout(function () {
          refreshen();
        }, 100);
        evt.cancelBubble = true;
        evt.returnValue = false;
      }
     }
   }
   /*
    console.log("Taste gedrückt: \n"
     + "key: " + evt.key + "\n"
     + "keyCode: " + evt.keyCode + "\n"
     + "which: " + evt.which + "\n"
     + "charCode: " + evt.charCode + "\n"
     + "Zeichen : " + String.fromCharCode(evt.charCode) + "\n"
    );
    */
 }

 var elem = document;
   elem.addEventListener("keydown", save_chk );
   elem.addEventListener("keyup", tastaus );

</script>
</head>

<body>

<?php
$zus_filter = "";
if ($hpt_id) {
    $sql = "SELECT men_sort FROM menuezeilen WHERE (men_id=$hpt_id)";
    $rs = mysqli_query($PHP_BAA_DC, $sql);
    $row = mysqli_fetch_row($rs);
    mysqli_free_result($rs);
    $row[0] = floor($row[0] / 100) * 100;
    $zus_filter = "AND men_sort>=" . $row[0];
    // echo "<h1>haupt_id: $sql</h1>";exit;
}

//$sql2=$sql;
$limit = "LIMIT 100";
if (($_GET['alle'] == "1") || isset($_COOKIE['alle'])) {
    echo "Maximum ist 500";
    $limit = "LIMIT 500";
}

$a_liste = array();
$sql = "SELECT * FROM menuezeilen WHERE (men_user_id=$men_user_id $zus_filter) ORDER BY men_sort $limit;";
$rs = mysqli_query($PHP_BAA_DC, $sql);

$mini = "data-role='none'";
//echo $sql2."<hr>".$sql; exit;

$zusFelder = 0;
$chk = "";
if ($_COOKIE['zusFelder'] == "1") {
    $chk = "checked";
    $zusFelder = 1;
}
?>
	<div class="header">
	    <button id='id_refr' onclick="refreshen()" class="b_move">Aktualisieren und Save</button>
	    <span class='hues'> >>> Editor - bitte nichts ändern <<< </span>
	    <button onclick="men_save(0, 0, 'ren', 1)" class="b_move">Renum</button>
      <button onclick="men_save(0, 0, 'ren', 10)" class="b_move">Renum 1000</button>
		<button onclick="win_reload(1)" class="b_move">Alle Zeilen</button>
    <button onclick="admin_logout()" class="b_move">Admin logout</button>
	    <!--
		    <label for="chkx">Zusatzfelder:</label><input type="checkbox" id="chkx" name='chkx' class="gross" style='width:36px' <?=$chk;?> onchange="men_zusatz(this)">
		    <button onclick="men_test(this)" class="b_move">Test</button>
	    -->
	</div>

	<div data-role="page" data-theme="a">

	    <div data-role="content">

		<table id='daten_table' width="100%">
		    <thead>
			<tr><th>&nbsp;</th><th style='width:60px;min-width:60px'>nr</th><th style='width:30%;min-width:250px'>Titel</th><th>IT</th><th width="50%">W E B - A d r e s s e</th><th width='24px'>LK</th><th width='16px' >F.</th><th width='24px'><img src='../assets/images/auge.png'></th><th width='28px'><a href="javascript:view_pw()">Passwd.</a></th><th width='24px'>Br</th><th width='24px'>Hö</th><th>Ed</th><th>Dr</th><th>Lö</th></tr>
		    </thead>
		    <tbody>
<?php
$a_ues_farben = array("#fff", "#ff9900", "#BCCFE5", "#E6EEAE");
$nr = 0;
$z = 0;
$hnd = -1;
while (($row = mysqli_fetch_assoc($rs))) {

    extract($row);
    if ($men_ues_level == 1) {
        $hnd++;
        $anker = "<a name='t$hnd' id='t$hnd'></a>";
    }
    $bbck = "";
    $m_title = "Informationstext eingeben";
    if (strlen($men_html) > 10) {
        $bbck = "gruen";
        $m_title = "Informationstext ändern($men_id)!";
    }
    $hg_farbe = $a_ues_farben[$men_ues_level];
    
	$mark="";
	$hchk = "";
    $geist = "";
    if ($men_hide) {
        $hchk = "checked";
        if ($men_hide == -1) {
            $geist = "color:red";
        } else {
            $geist = "color:#ccc";
        }

    } else {
		if ($men_id_sel==$men_id) {
			$mark="marker";
		}
	}

    //array_push($a_liste,$row);
    echo "<tr style='background-color: $hg_farbe' id='z$men_id'>";
    echo "<td align=center>
	<button id='$nr' class='b_move mover'  style='padding:0px' tabindex=0>K</button>
		</td>";

    echo "<td align=center >$anker
			<!-- button class='finput' data-menues='$men_ues_level' onclick='switch_ues(this,$men_id,\"ues\")' >" . ($men_sort) . "</button -->
			<input type='text' class='finput bb $mark' id='men_sort_$men_id' ondblclick='doppel_klick(this)'	value='$men_sort' $mini onchange='men_save($men_id,this,\"sp\",$hnd)' style='font-weight:bold' tabindex=1 />
		</td>";

    echo "<td>
			<input type='text' class='finput $mark' id='men_button_$men_id' style='$geist' value='$men_button' xondblclick='mark_ges(this)'    	$mini onchange='men_save($men_id,this,\"sp\",$hnd)' style='font-weight:bold' tabindex=1 />
		</td>";
    echo "<td>
			<input type='button' class='binput $bbck' onclick='make_edit($men_id)' title='$m_title (" . $men_id . ")' tabindex=0 />
			<textarea style='display:none' id='men_html_$men_id' xondblclick='mark_ges(this)' onchange='men_save($men_id,this,\"sp\",$hnd)' tabindex=0 >" . htmlentities($men_html, ENT_QUOTES, "UTF-8") . "</textarea>
		</td>";

    echo "<td>
			<!--
			<textarea class='finput txta' id='men_link_$men_id' $mini onchange='men_save($men_id,this,\"sp\",$hnd)' >" . htmlentities($men_link, ENT_QUOTES, "UTF-8") . "</textarea>
			<span class='verstecke'>Tooltipp: </span><input type='text' class='finput fein verstecke' id='men_tipp_$men_id' value='$men_tipp' title='Tooltipp'	$mini onchange='men_save($men_id,this,\"sp\",$hnd)' tabindex='-1' />
			<div contenteditable='true'  class='edi finput txta verstecke' onblur='open_editor($men_id,this,$hnd)' id='men_html_$men_id' $mini>" . htmlentities($men_html, ENT_QUOTES, "UTF-8") . "</div>
			-->
			<input type='text' class='finput hpt $mark' style='$geist'  id='men_link_$men_id' value='$men_link' title='Befehl' $mini onchange='men_save($men_id,this,\"sp\",$hnd)' tabindex=1 />
		</td>";

    echo "<td style='white-space:nowrap'>
			<button class='b_move sm kop' onclick='men_save($men_id,this,\"kop\",$hnd,event)' title='Kopieren der Menüzeile'>K</button>
			<button class='b_move sm ues' data-menues='$men_ues_level' onclick='switch_ues(this,$men_id,\"ues\")' title='Überschrifthierarchie'>Ü</button>
		</td>";

    $chk = "";
    if ($men_fenster) {
        $chk = "checked";
    }

    echo "<td style='font-size: 0.8em'>
			<input type='checkbox' class='finput cent' id='men_fenster_$men_id' $chk $mini onchange='men_save($men_id,this,\"sp\",$hnd)'  title='Maximalfenster'/>
		</td>";

    echo "<td style='font-size: 0.8em'>
			<input type='checkbox' class='finput cent' id='men_hide_$men_id' $hchk $mini onchange='men_save($men_id,this,\"sp\",$hnd)'  title='Verstecken'/>
			<input type='hidden' class='finput' id='men_hide_$men_id' 	value='$men_hide'   $mini onchange='men_save($men_id,this,\"sp\",$hnd)' />
			<input type='hidden' id='men_id_$men_id' 	value='$men_id' />
		</td>";
    if (empty($men_passwort)) {
        echo "<td>
				<input type='txt' class='finput pass cent' id='men_passwort_$men_id' 	value='$men_id'  $mini xxxonchange='men_save($men_id,this,\"sp\",$hnd)' />
			</td>";
    } else {
        echo "<td style='width:64px'>
				<input type='password' class='finput pass cent' id='men_passwort_$men_id' 	value='$men_passwort'  $mini onchange='men_save($men_id,this,\"sp\",$hnd)' />
			</td>";
    }

    echo "<td>
			<input type='text' class='finput cent noR' id='men_breite_$men_id' 	value='$men_breite'  $mini onchange='men_save($men_id,this,\"sp\",$hnd)' />
		</td>";
    echo "<td>
			<input type='text' class='finput cent noR' id='men_hoehe_$men_id' 	value='$men_hoehe'  $mini onchange='men_save($men_id,this,\"sp\",$hnd)' />
		</td>";

    $chk = "";
    if ($men_edit_erlaubt) {
        $chk = "checked";
    }

    echo "<td style='font-size: 0.8em'>
			<input type='checkbox' class='finput cent' id='men_edit_erlaubt_$men_id' $chk $mini onchange='men_save($men_id,this,\"sp\",$hnd)'  title='Editieren erlaubt'/>
		</td>";

    $chk = "";
    if ($men_druck_button) {
        $chk = "checked";
    }

    echo "<td style='font-size: 0.8em'>
			<input type='checkbox' class='finput cent' id='men_druck_button_$men_id' $chk $mini onchange='men_save($men_id,this,\"sp\",$hnd)'  title='Druckbutton'/>
		</td>";

    echo "<td style='white-space:nowrap'>
			<button class='b_move sm del' onclick='men_save($men_id,this,\"del\",$hnd)' title='Löschen der Menüzeile'>L</button>
		</td>";

    echo "</tr>";

    $nr++;
}
mysqli_free_result($rs);
?>
		    </tbody>
		</table>
		<a name='ende'>baa(2018)</a>
		 Wenn kein Informationstext (IT) eingetragen ist, wird die eingetragene WEB-Adresse angezeigt!
		<input id="hpt_id" type="hidden" value="<?=$hpt_id;?>" />

	    </div><!-- /content -->
	    <!--
		    <div data-role="footer" data-position="fixed">
		      <div data-role="navbar">
			     <ul>
				    <li><a href="javascript:get_breite()" target='men_haupt'>breite</a></li>
				    <li><a href="javascript:men_save(0,0,7)">Renum</a></li>
				    <li><a href="#anylink">Search</a></li>
			     </ul>
			    </div>
		    </div>
	    -->
	</div><!-- /page -->
	<input type='hidden' id='men_user_id' value="<?=$men_user_id;?>">
<?php
/*
foreach ($a_liste as $ind=>$wert) {
echo "<input type='text' value='$wert['men_button']' onclick='save($ind,\"t\")'>";
echo "<input type='text' value='$wert['men_link']' onclick='save($ind,\"b\")'>";
echo "<br>";
}
 */
echo "<div id='message'><h1>Gespeichert!</h1></div>";
?>

	<!-- script>$("label").width(300);</script -->


</body>
</html>
