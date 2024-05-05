<?php
session_start();
include("php_dc_conn.php");
//phpinfo();exit;

$alt_aktiv=isset($_GET['alt_aktiv']) ? $_GET['alt_aktiv']:0;

if (isset($_GET["men"])) {
  //echo $_SERVER["HTTP_REFERER"];
  //exit;
  $men_user_kzz = $_GET["men"];
  $men_name=$men_user_kzz;
} else {
  $men_name="";
  //$men = str_split(".",$_SERVER["HTTP_HOST"]);
  $men_user_kzz = explode(".",$_SERVER["HTTP_HOST"])[0];

  echo "No Access (Menu) - ".
  "<br>server: ".$_SERVER['SERVER_NAME']. 
  "<br>host: ".$_SERVER['HTTP_HOST']."<hr>"; 
  //include("../get_server_array.php");
  exit;
  //echo $men_user_kzz;exit; //genialer schachzug - dann ist alles https
}
$men_user_kzz="digi.case.dlpl";

if ($alt_aktiv) {
  $men_20=0;
  $_SESSION["s_men_20"]=0;
}  else {
  $men_20=1;
  $_SESSION["s_men_20"]=1;
}


$such_filter="";
if (isset($_GET["such_text"])) {
  $such_filter=$_GET["such_text"].substr(0,5);
}  

$https_aktueller_aufruf= $_SERVER['HTTPS']>"" ? 1 : 0; 

// einlesen von menuparametern
$men_ret_adr="https://baa.at";
// $makecode="https://makecode.microbit.org/stable#";
$makecode="https://makecode.microbit.org/";
$python  ="https://python.microbit.org";
$scratch ="https://scratch.mit.edu/";
$codeorg ="https://studio.code.org/courses";
$robobee ="http://robobee.at";

$bild_adr=$_SERVER["HTTP_REFERER"];



//$men_user_kzz="baa";
$a_ret_desc=array("HauptMenü","","","");
$a_akt_men_user = array();
$sql = "SELECT * FROM menue_user WHERE men_user_kzz='$men_user_kzz';";
$rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {
    echo $sql . mysqli_error($PHP_BAA_DC);
    exit;
}
$men_alte_version=0;
$men_umbruch = 0;
$men_user_id = -1;
$men_fremd_adr=0;
if ($row = mysqli_fetch_assoc($rs)) {
  $men_user_id = $row['men_user_id'];
  $a_akt_men_user_name = $row['men_user_name'];
  $men_ret_baa_button = $row['men_ret_baa_button'];
  $men_umbruch = $row['men_umbruch'];
  $men_last_open = $row['men_last_open'];
  $men_alte_version = $row['men_alt'];

  $men_editor_passwort = $row['men_editor_passwort'];

  if ($row['men_ret_adr']) {
    $a_ret_adr=explode(";",$row['men_ret_adr']);
    $a_ret_desc=explode(";",$row['men_ret_desc']);
    //print_r ($a_ret_adr);exit;
    $a_adr=["men_ret_adr","makecode","python","scratch","codeorg","bild_adr"];
    $i=0;
    foreach ($a_ret_adr as $adr)  {
      $men_fremd_adr=1; //???
      if ($adr>"") {
        $m1=$a_adr[$i];
        $$m1=$adr;
      }
      $i++;
    }
  }
}
mysqli_free_result($rs);

if ($men_user_id == -1) {
  echo "User nicht vorhanden!";
  exit;
}

if ($men_alte_version) {
  if ($alt_aktiv==0) {
    $param="";
    if (count($_GET)>0) {
      $zch="?";
      if ($param>"") {$zch="&";}
      $param=$zch.http_build_query($_GET,'', '&');
    }
    header("Location: ..\index_old.php?$param");
    exit;
  }
}




$ipadr=$_SERVER["REMOTE_ADDR"];
//echo "<h1>$ipadr</h1>";
if ($ipadr!=$_SESSION["last_ipadr"]) {
  $sql="INSERT INTO men_logbuch (prgart,ipadresse,browser) ";
  $sql.="VALUES ('{$men_user_kzz}','{$ipadr}','x');";
  $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
  $_SESSION["last_ipadr"]=$ipadr;
}


$adr = $_SERVER["HTTP_REFERER"];
$a_adr = explode("?", $adr);
$admin = 0;
if (strpos($a_adr[1], "admin") > -1) {
  $ad=$_GET["admin"];
  if ($ad=="0") {
    $men_editor_passwort="-1";
  }

  $baa_ad=date("m")+date("d")+100;
  $tmp=str_split($men_user_id+1000);
  $nr=substr($men_user_kzz,0,1).$tmp[3].$tmp[2].$tmp[1];
  if ((substr($ad,0,4)==$nr) || ($ad==$baa_ad)) {
    $admin = 1;
    if ($ad==$baa_ad) {
      setcookie("admin", "1", time() + 3600 * 24 * 31);
    } else {
      setcookie("admin", "1", time()-10);
    }
  } else {
    if (!empty($men_editor_passwort) && ($men_editor_passwort==$ad)) {
      $admin = 1;
      setcookie("admin", "1", time() + 3600 * 12);
    } else {
      $nachricht=$_SERVER['REMOTE_ADDR']."/".$_SERVER['HTTP_X_FORWARDED_FOR']."/pw:".$ad."/".$nr."/m + d + 100";
      if ($ad!="0") {
        mail('baa@ph-linz.at', 'Menue-Login-Versuch', $nachricht);
      }
      $admin=0;
      $_COOKIE['loggedIN'] = 0;
      setcookie("admin", "0", time() - 10);
    }
  }
} else {
  if ($_COOKIE['admin'] == "1") {
      $admin = 1;
  }
}

$ad_hide_filter="men_hide=0";
if ($admin) {
  $ad_hide_filter="men_hide<=0";
  $_SESSION["ed"]=1;
} else {
  $_SESSION["ed"]=0;
}

// //$ll_test="";
// if (isset($_GET['last_open'])) { //definitiv letzt geöffneter Menüpunkt
//   $last_open = $_GET['last_open'];

if (isset($_GET['open'])) { //definitiv letzt geöffneter Menüpunkt
    $last_open = $_GET['open'];
} else {
  if (($men_last_open!=0) && (!$admin)) {
      $last_open=$men_last_open;
    // echo "<script>alert($last_open)</script>";
  } else {
    
    $last_open = -1; //immer erster menühauptpunkt
    $coo_last_open=str_replace(".","_",$men_name)."last_open";
    //echo $coo_last_open."/".$_COOKIE[$coo_last_open];exit;
    if (isset($_COOKIE[$coo_last_open])) {
        $last_open = $_COOKIE[$coo_last_open];
    }
  }
}

// if ($men_user_kzz == "m") {
//     $men_user_kzz = "baa54";
// }

$_SESSION['men_user_id'] = $men_user_id;
// if ($_SESSION["s_men_20"]==1) {
//     echo "<script>
//       var men_20=true;
//     </script>";
// } else {
//   echo "<script>
//     var men_20=$men_20;
//   </script>";
// }

?>

<html>
<head>
	<title id="men_titel">Baa-Menue</title>	<title id="men_titel">Baa-Menue</title>									
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex" />


<?php
  $jqv = "2.1.0";
  $jqmvers = "1.4.5";
?>

<link href="https://code.jquery.com/mobile/<?= $jqmvers ?>/jquery.mobile-<?= $jqmvers ?>.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-<?=$jqv;?>.min.js"></script>
<script src="https://code.jquery.com/mobile/<?= $jqmvers ?>/jquery.mobile-<?= $jqmvers ?>.min.js"></script>

<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles/menue.css" />


<script>var men_20 = <?php echo $men_20;?></script>
<script src="menue.js"></script>


<title>baa-men</title>
</head>

<body>
<?php
$m_icon = "lock";

$editor = 0;
if (isset($_GET['editor'])) {
    $editor = 1;
}

$gg = "https://drive.google.com/drive/u/0/recent";
if ($men_user_id==115) {
  $gg = "https://github.com";
} elseif ($men_user_id==130) {
  $men_ret_adr="https://www.bmbwf.gv.at/Themen/schule/zrp/dibi/dgb/dlpl.html";
  $gg = "https://eeducation.at/";
  $python="https://men.baa.at/lib/js/digi.case/get_ress_list.php";
}


if ($a_akt_men_user['men_user_restrict'] != 0) {
  //app_aufruf
  echo "<div class='seite' data-role='page' data-theme='a'>";
    echo "<input type='hidden' id='prglg' />";
    $lg_flag = 1;
    echo "<div data-role='content' id='content'>
		  <p>Zugang nur mit Passwort:</p>
		  <div style='padding:10px 10px;'>
			  <label for='pw' xxclass='ui-hidden-accessible' >Password (.nn.):</label>
			  <input id='pw' value='' placeholder='password' data-theme='a' type='text' onchange='chk_pw(1)' autofocus >
			  <button data-theme='b' onclick='chk_pw(1)'  tabindex=2>Send</button>
		  </div>
	  </div>
  </div>";
  exit;
} else {
  $_COOKIE['loggedIN'] = 199;

  $men_liste = array(array(), array(), array(), array());
  //echo "<hr><pre>";print_r ($men_liste); // es werden immer gleich 4 lelemente initiert -> php
  $t = -1;
  $h = -1;
  $z = -1;
  $e = -1;


  $felder = "men_id,men_button,men_link,LEFT(men_html,1) AS men_html,men_ues_level,men_fenster,men_hoehe,men_breite,men_hide,men_edit_erlaubt";
  //$sql = "SELECT $felder,1 as collap,0 as haupt_kinder FROM menuezeilen WHERE (men_user_id=$men_user_id AND men_sort>0 AND $ad_hide_filter $such_filter) ORDER BY men_sort,men_id";
  $sql = "SELECT $felder,1 as collap,0 as haupt_kinder FROM menuezeilen WHERE (men_user_id=$men_user_id AND $ad_hide_filter) ORDER BY men_sort,men_id";
  $rs = mysqli_query($PHP_BAA_DC, $sql);
  if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}

  if (mysqli_num_rows($rs) == 0) {
    for ($i = 0; $i < 3; $i++) {
      $men_hide=0;
      if ($i>2) {
          $men_hide=1;
      }

      $sql = "INSERT INTO menuezeilen ";
      $sql .= "(men_user_id,men_button,men_sort,men_ues_level,men_hide) VALUES ";
      $sql .= "($men_user_id,'Menühauptpunkt'," . (($i + 1) * 10) . ",1,$men_hide); ";
      $rs = mysqli_query($PHP_BAA_DC, $sql);
      if (!$rs) {
        echo mysqli_error($PHP_BAA_DC);
        echo $sql;
        exit;
      }

      $sql = "INSERT INTO menuezeilen ";
      $sql .= "(men_user_id,men_button,men_sort,men_ues_level,men_hide) VALUES ";
      $sql .= "($men_user_id,'Menüeintrag'," . (($i + 1) * 10) . ",0,$men_hide); ";
      $rs = mysqli_query($PHP_BAA_DC, $sql);
      if (!$rs) {
        echo mysqli_error($PHP_BAA_DC);
          echo $sql;
          exit;
      }
    }

    //$sql = "SELECT $felder,1 as collap  FROM menuezeilen WHERE men_user_id=$men_user_id AND men_sort>0 AND LEFT(men_button,1)<>'@' ORDER BY men_sort,men_id";
    $sql = "SELECT $felder,1 as collap  FROM menuezeilen WHERE men_user_id=$men_user_id ORDER BY men_sort,men_id";
    
    $rs = mysqli_query($PHP_BAA_DC, $sql);
    if (!$rs) {
      echo mysqli_error($PHP_BAA_DC);
      echo $sql;
      exit;
    }
  }


  // $baa_sammel="";

  // $such_filter="";
  // if ($_SERVER['REMOTE_ADDR']=="178.115.67.181") {
  //   $query = $_SERVER["QUERY_STRING"];
  //   echo $query;
  // };
  $query = $_SERVER["QUERY_STRING"];
  




  $men_button_found=false; //wir für such_filter benötigt
  $haupt_kinder=0;
  $last_open_nr=0;$last_open_json="";
  while ($row = mysqli_fetch_assoc($rs)) {
    //echo "<pre>";print_r ($row);
    //$sort=$row['men_sort'];
    
    if ($row['men_button'][0]=="<") {
      $tmp=$row['men_button'];
      if (strpos($tmp,"img")==1) {
        if (strpos($tmp,"src")===false) {
          $row['men_button']=str_replace("<img ","<img class='bmen' src=../assets/images/icon/",$tmp);
        } else {
          $row['men_button']=str_replace("<img ","<img class='bmen' ",$tmp);
        }
      } else {
        if (strpos($tmp,"end show")==1) {
          break;
        }
      }
    }

    if ($such_filter!="") {
      if ($men_button_found==false) {
        if (strpos($row['men_button'],$such_filter)!==false) {
          $last_open=$row['men_id'];
          $men_button_found=true;
        }
  
      }
    }

    $ues_flag = $row['men_ues_level'];

    if ($ues_flag == 0) {
      $haupt_kinder=3;
      $e++;
    } elseif ($ues_flag == 1) {
      $haupt_kinder=0;
      $t++;
      $h = 0;
      $z = 0;
      $e = 0;
      if ($last_open==-1) { //immer der erste
        $last_open=$row['men_id'];
      }
    } elseif ($ues_flag == 2) {
      $haupt_kinder=1;
      $h++;
      $z = 0;
      $e = 0;
    } elseif ($ues_flag == 3) {
      $haupt_kinder=2;
      $z++;
      $e = 0;
    } else {
      //nichts
    }
   
    // $baa_sammel.="[$t][$h][$z][$e]<br>";
    $men_liste[$t][$h][$z][$e] = $row;
    if ($haupt_kinder) {
      $men_liste[$t][0][0][0]['haupt_kinder'] = $haupt_kinder;
      if ($haupt_kinder==2) {
        $men_liste[$t][$h][0][0]['haupt_kinder'] = $haupt_kinder;
      };
      if ($haupt_kinder==3) {
        $men_liste[$t][$h][$z][0]['haupt_kinder'] = $haupt_kinder;
      };
    };

    //echo "<script>alert('".getcwd()."')</script>";

    // letztes offenes
    if ($row['men_id'] == $last_open) {

        $men_liste[$t][0][0][0]['collap'] = 0;
        $men_liste[$t][$h][0][0]['collap'] = 0;
        $men_liste[$t][$h][$z][0]['collap'] = 0;
        $last_open_nr = $t;
        
        //damit nicht zeichen sichtbar werden
        $row['men_button']="";
        $row['men_html']= ($row['men_html']>" " ? "1":"0");
        $last_open_json=json_encode($row);
    }
  }
  mysqli_free_result($rs);
  //baa_info: Der erste Datensatz in der db darf nicht men_ues_level=0 haben sonst ist eine leerzeile irgendow undefiniert drinnen +leer - es muss mit einer Überschrift beginnen. Wrid nun in renum korrigiert

  // echo "<pre>";
  // print_r ($men_liste);
  // echo "</pre>";
// exit;

  echo "<div class='seite' data-role='page' data-theme='a'>";
    echo "<div class='edhead' data-role='header' data-theme='b' data-position='fixed'>";
    $editor_adr = "pass";
    if ($_COOKIE['loggedIN'] == 199) {
        $editor_adr = "editor.php";
    }
    echo "<div class='head-icons'  data-role='controlgroup' data-type='horizontal'>";
    if (isset($_GET["ret"])) {
        echo "<a class='iconklein' style='width:100%;margin-top:-8px;xxmargin-bottom:4px' href='javascript:window.parent.close()' data-role='button' data-icon='arrow-l'>Zurück zum Hauptmenü</a>";
    }

    echo "<a id='mensmall' class='iconklein' href='javascript:b_men_hide()' data-role='button' data-icon='arrow-l'></a>";

    echo "<a class='iconklein' href='javascript:open_app(9,\"".$men_ret_adr."\",1260,0,2,0,0,0,-1)' data-role='button' data-icon='home' title='$a_ret_desc[0]'></a>";
    //echo "<a class='iconklein' href='javascript:window.location.reload()' data-role='button' data-icon='refresh'></a>";

    if ($men_fremd_adr!=0) {
      //echo "<a class='iconklein' href='javascript:menue_hide(0)' data-role='button' data-icon='search'></a>";
    }
    //sollte der men_ret_button zu baa gehen oder ph
    /*
    echo "<a class='iconklein' href='javascript:make_shot(1)' data-role='button' data-icon='home'></a>";
    */
    //if ($men_user_kzz != "ixbach") {
    if ($men_fremd_adr==0) {
        echo "<a class='iconklein' href='javascript:open_app(0,\"baa.at\",0,0,2,0,0,0,-1)' data-role='button' data-icon='bullets' title='baa'></a>";
    }
  
    //echo "<a class='iconklein' href='javascript:open_app(0,'http://www.google.at',0,0,0,0)' data-role='button' data-icon='search'></a>";
    echo "<a class='iconklein' href='javascript:open_app(0,\"$gg\",0,0,2,0,0,0,-1)' data-role='button' data-icon='cloud' xxtitle='Cloud'></a>";
    //echo "<a class='iconklein' href='javascript:open_app(0,\"https://onedrive.live.com\",0,0,1,0,0,0,-1)' data-role='button' data-icon='cloud' title='MS-Cloud'></a>";
    echo "<a class='iconklein' href='javascript:show_camera()' data-role='button' data-icon='video' title='Open Video Window'></a>";
    /*
    <a class='iconklein' href='javascript:open_app(0,\"http://www.wisemapping.com/c/maps/\",0,0,1,0,0,0)' data-role='button' data-icon='star' title='wise' ></a-->
    */



    echo "<a class='iconklein' href='javascript:open_app(0,\"$makecode\",0,0,1,0,0,0,-1)' data-role='button' data-icon='grid' title='$a_ret_desc[1]'></a>";
    echo "<a class='iconklein' href='javascript:open_app(0,\"$scratch\",0,0,1,0,0,0,-1)' data-role='button' data-icon='heart' title='$a_ret_desc[3]'></a>";
    echo "<a class='iconklein' href='javascript:open_app(0,\"$codeorg\",0,0,1,0,0,0,-1)' data-role='button' data-icon='star' xxxtitle='Code.org'></a>";

    /*
    if ($men_fremd_adr==0) {
    } else {
    }
    */
    if ($admin==1) {
      if ($men_user_id == 7) {
        echo "<a class='iconklein' href='javascript:show_camera2()' data-role='button' data-icon='video' title='Facebook'></a>";
      } else {
        //echo "<a class='iconklein' href='javascript:open_app(0,\"$codeorg\",0,0,1,0,0,0,-1)' data-role='button' data-icon='user' title='Code.org'></a>";
        echo "<a class='iconklein' href='javascript:open_app(0,\"$python\",0,0,1,0,0,0,-1)' data-role='button' data-icon='bars' title='$a_ret_desc[2]'></a>";
      }
      $m_icon = "edit";
      $editor_adr = "editor.php";
      echo "<a class='iconklein' href='javascript:open_app(0,\"$editor_adr\",0,0,0,0,0,0,-1)' data-role='button' data-icon='$m_icon'></a>";
      echo "<a class='iconklein' id='ea' href='javascript:edit_yes_no(1)' data-role='button'>-</a>";
    } else {
      // echo "<a class='iconklein' href='javascript:open_app(0,\"$codeorg\",0,0,1,0,0,0,-1)' data-role='button' data-icon='user' title='Code.org'></a>";
      echo "<a class='iconklein' href='javascript:open_app(0,\"$robobee\",0,0,1,0,0,0,-1)' data-role='button' data-icon='navigation' title='$a_ret_desc[2]'></a>";
      echo "<a class='iconklein' href='javascript:open_app(0,\"$python\",0,0,1,0,0,0,-1)' data-role='button' data-icon='bars' title='$a_ret_desc[2]'></a>";
      
      //$editor_adr = "pass";
    }
    // echo "<input class='xiconklein' type='text' id='such_filter' data-type='search' placeholder='Suchtext' value=''  onblur='starte_suche()'/>"; 

    echo "</div>";
    echo "<input id='such_filter' class='xiconklein' type='text' data-type='search' placeholder='Suchtext' value='' onblur='starte_suche()'/>"; 
    //echo "<a class='iconklein' href='javascript:starte_suche()' data-role='button' data-icon='search' title='Suche starten'></a>";

    echo "</div><!-- /header ende -->";


    echo "<div data-role='content' id='content'>";
    if ($men_user_kzz != "baa54") {
      // $logo="ph-logo-grau.png";
      // if (file_exists("../assets/images/".$men_user_kzz.".png")) {
          $logo=$men_user_kzz.".png";
          $logo="laempel.png";

      // }
      echo "<div style='width:100%;text-align:center;padding-bottom:12px'>"
          ."<img id='img_logo' alt='' src='../assets/images/$logo' width='80%' xxxonclick='open_app(-9,\"".$bild_adr."\",1260,0,2,0,0,0,-1)' onclick='window.location.reload(1)' title='$bild_adr' />"
          ."</div>";
    }

    akkorde($men_liste,  $last_open_nr, $admin);

    echo "</div><!-- /content ende-->";
    $lg_flag = 0;
}

if ($men_user_kzz=="123") {
  show_struc($men_liste);
}

//echo "</div><!-- /???page -->";
echo "</div><!-- /seite ende -->";


$str = $_SESSION['aufruf_prg'];
/*
echo "<a href='#popupBasic' data-rel='popup'  data-position-to='window'>Open Popup</a>
<div data-role='popup' id='popupBasic'>
    <p>This is a completely basic popup, no options set.<p>
</div>";
*/



echo "\n\n<input type='hidden' value='$last_open' id='last_open' />";
echo "<input type='hidden' value='$last_open_json' id='last_open_json' />";
echo "<input type='hidden' value='$editor' id='editor' />";

echo "<input type='hidden' value='$a_akt_men_user_name' id='men_user_name' />";
echo "<input type='hidden' value='$str' id='aufruf_prg' />";
echo "<input type='hidden' value='$men_umbruch' id='men_umbruch' />";
echo "<input type='hidden' value='$men_name' id='men_name' />";

echo "<input type='hidden' value='$logo' id='logo_bild' />";
echo "<input type='hidden' value='$admin' id='is_admin' />";


echo "\n<input type='hidden' value='$men_user_id' id='mid' />";
echo "\n<input type='hidden' value='{$_SERVER["REMOTE_ADDR"]}' id='ipadresse' />";




/*
echo "<iframe id='ibaa' style='left:100px;width:500px;height:500px;' src='about:blank'></iframe>";
*/
//echo $ll_test;

//echo "<div id='menu_wechsel'>Test sasdf asdfa</div>";

//echo "lastopen: ".$last_open." co:".$_COOKIE[$coo_last_open];

//echo "<br>coo_last_open: ".$coo_last_open;
//echo "<br>cookie coo_last_open: ".$_COOKIE[$coo_last_open];
//print_r (explode("&",$query));

echo "</body>";
echo "</html>";
//############# ende

//echo getcwd();



function akkorde($men_liste,$last_open_nr, $admin) {
  $a_innen=array();

  $a_coll = array("false", "true");
  //set beginn
  echo "<div data-role='collapsible-set' data-mini='true'>";
    $coll_id = 0;
    $coll_htm = "";
    $coll_link = "";

    $coll_open = "";
    foreach ($men_liste as $t_ind => $a_twerte) {
      //$coll="true";	if ($last_open==$t_ind) $coll="false";
      //ein_akkord($a_twerte,$t_ind);
      //$merk_flag=$arr[0][0][0]['men_id'];
      $tg = "h3"; //if ($coll=="false") $tg="h5";
      $ues = $a_twerte[0][0][0]['men_button'];


      $hpt_men_id = $a_twerte[0][0][0]['men_id'];
      $coll = $a_coll[$a_twerte[0][0][0]['collap']];

      $htm = $a_twerte[0][0][0]['men_html'];
      $l_htm = ($htm > " ") + 0;
      $anz_str = $a_twerte[0][0][0]['men_link'];
      $men_breite=$a_twerte[0][0][0]['men_breite'];
      $men_hoehe=$a_twerte[0][0][0]['men_hoehe'];
      $fen = $a_twerte[0][0][0]['men_fenster'];
      if (!$fen) {
        $fen = 0;
      }

      if (($coll == "false")) {
        $coll_id = $hpt_men_id;
        $coll_htm = $l_htm;
        $coll_link = $anz_str;
        $coll_fenst = $fen;
        $coll_men_breite = $men_breite;
        // echo "<script>console.log(\"e1\",$hpt_men_id);</script>";       
        //$ttt="AA ".$coll_id."/".$coll_htm."/".$coll_link."/".$fen;;
      }
      //ebene 1
      $leer="";
      if ($a_twerte[0][0][0]['haupt_kinder']==0) {
        $leer="accord_leer";
      };
      //$baa=$t_ind.":".count($a_twerte[$t_ind]) ."/".count($a_twerte[$t_ind][0]) ."/".count($a_twerte[$t_ind][0][0]) ; ;
      echo "\n\n<div class='accord $leer' data-role='collapsible' data-collapsed='$coll'  data-mini='true'>
  		  <h3 class='lnk' onclick='set_cook($hpt_men_id," . $l_htm . ",".$men_breite.",".$men_hoehe.",\"" . $anz_str . "\",$fen,event)'>$ues</h3>";

        foreach ($a_twerte as $h_ind => $a_hwerte) {
          if ($h_ind > 0) {
            $hpt_men_id = $a_hwerte[0][0]['men_id'];
            $coll = $a_coll[$a_hwerte[0][0]['collap']];


            $htm = $a_hwerte[0][0]['men_html'];
            $l_htm = ($htm > " ") + 0;
            $anz_str =  $a_hwerte[0][0]['men_link'];
            $men_breite=$a_hwerte[0][0]['men_breite'];
            $men_hoehe=$a_hwerte[0][0]['men_hoehe'];
            $fen = $a_hwerte[0][0]['men_fenster'];
            if (!$fen) {
              $fen = 0;
            }

            if ($coll == "false") {
              $coll_id = $hpt_men_id;
              $coll_htm = $l_htm;
              $coll_link = $anz_str;
              $coll_fenst = $fen;
              $coll_men_breite = $men_breite;

              //echo "<script>console.log(\"e2\",$hpt_men_id);</script>";                
              //$ttt="BB ".$coll_id."/".$coll_htm."/".$coll_link."/".$fen;;
            }
            // wird unten ausgeglichen
            //ebene 2

            $leer="";
            if ($a_hwerte[0][0]['haupt_kinder']==0) {
              $leer="accord_leer";
            };            
            echo "\n<div data-role='collapsible-set' data-mini='true' xxxclass='coll_set'>";
            echo "<div class='accord $leer' data-role='collapsible' data-collapsed='$coll'>
  				  <h4 onclick='set_cook($hpt_men_id," . $l_htm . ",".$men_breite.",".$men_hoehe.",\"" . $anz_str . "\",$fen,event)' >". $a_hwerte[0][0]['men_button'] . "</h4>";
          }

          foreach ($a_hwerte as $z_ind => $a_zwerte) {
            if ($z_ind > 0) {
              $hpt_men_id = $a_zwerte[0]['men_id'];
              $coll = $a_coll[$a_zwerte[0]['collap']];

              //echo "<script>console.log(".$hpt_men_id.",".$coll.")</script>";


              $htm = $a_zwerte[0]['men_html'];
              $l_htm = ($htm > " ") + 0;
              $anz_str = $a_zwerte[0]['men_link'];

              $fen = $a_zwerte[0]['men_fenster'];
              $men_breite=$a_zwerte[0]['men_breite'];
              $men_hoehe =$a_zwerte[0]['men_hoehe'];
              $men_edit_erlaubt=$a_zwerte[0]['men_edit_erlaubt'];
              if (!$fen) {
                  $fen = 0;
              }
              if ($coll == "false") {
                $coll_id = $hpt_men_id;
                $coll_htm = $l_htm;
                $coll_link = $anz_str;
                $coll_fenst = $fen;
                $coll_men_breite = $men_breite;

                //$ttt="CC ".$coll_id."/".$coll_htm."/".$coll_link."/".$fen;
              }
              //wird unten ausgeglichen

              $leer="";
              if ($a_zwerte[0]['haupt_kinder']==0) {
                  $leer="accord_leer";
              };   


              echo "\n<div data-role='collapsible-set' data-mini='true' xxxclass='coll_set' >";
              echo "<div class='accord $leer' data-role='collapsible' data-collapsed='$coll'>
  				    <h5 onclick='set_cook($hpt_men_id," . $l_htm . ",".$men_breite.",".$men_hoehe.",\"" . $anz_str . "\",$fen,event)' >".$a_zwerte[0]['men_button']."</h5>";
            }
            echo "<ul id='men_ul' data-role='listview' data-inset='true'>";
              $a_innen=array();
              $i=0;
              foreach ($a_zwerte as $e_ind => $a_werte) {
                if ($e_ind>0) {
                  extract($a_werte);
                  echo "<li id='li{$a_werte['men_id']}' data-mini='true' onclick='set_kekse(".$a_werte['men_id'].")'>";
                    if ($_COOKIE['loggedIN'] == 199) {
                      if (strlen(trim($men_passwort)) <= 8) {
                        $bef = $men_link;
                        $l_htm = ($men_html > " ") + 0;
                      } else {
                        $bef = "pass";
                      }
                    }
                    //echo "<a id='ed_$men_id' href='javascript:open_app($men_id,\"$bef\",$men_breite,$men_hoehe,$men_fenster,$hpt_men_id,$l_htm,100,$i,event)' class='butti lnk' >".$a_werte['men_button']."</a>";
                    
                    echo "<a id='ed_$men_id' href='#' onclick='open_app($men_id,\"$bef\",$men_breite,$men_hoehe,$men_fenster,$hpt_men_id,$l_htm,100,$i,event)' class='butti lnk' >".$a_werte['men_button']."</a>";
                    /*
                    if (($admin==1) || ($men_edit_erlaubt)) {
                      if ($l_htm) echo "<a href='javascript:open_direkt($men_id,\"$bef\",$men_breite,$men_hoehe,2,$hpt_men_id,$l_htm,1,$i)' class='butti' data-icon='edit' title='Editor'></a>";
                    }
                    */
                    echo "<div class='hid' data-par='$hpt_men_id' data-id='$men_id'>$bef</div>";
                  echo "</li>";
                  $i++;
                }
              } //for ende zw
            echo "</ul>";

            if ($z_ind > 0) { //schuldig von oben
              echo "</div></div>";
            }
          } //for end hw
          if ($h_ind > 0) { //schuldig von oben
            echo "</div></div>";
          }
        } //for ende tw
      echo "</div><!-- ehd accord div -->\n\n";
    } //for end menlist
  echo "</div><!-- /collapxxxxs -->";
}



function server_vars() {
  foreach($_SERVER as $key_name => $key_value) {
    print $key_name . " = " . $key_value . "<br>";
  }
  exit;
 
}


function show_struc($men_liste) {
  echo "<pre style='color:white'>";
  foreach ($men_liste as $t_ind => $a_twerte) {  
    echo "t_ind=".$t_ind." ";
    print_r ($a_twerte);

    echo "<hr>t=".count($a_twerte)."<br>";

    foreach ($a_twerte as $h_ind => $a_hwerte) {
      echo "<hr>h=".count($a_hwerte)."<br>";

      foreach ($a_hwerte as $z_ind => $a_zwerte) {
        echo "<hr>z=".count($a_zwerte)."<br>";

        foreach ($a_zwerte as $e_ind => $a_werte) {
          echo "<hr>e=".count($a_werte)."<br>";
        }
      }
    }
  }  
  echo "<hr>ges=".count($men_liste)."<hr>";
  print_r ($men_liste);

  echo $GLOBALS["baa_sammel"];
  echo "</pre>";

}


?>


