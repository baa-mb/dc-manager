<?php
$m_icon = "lock";

$editor = 0;
if (isset($_GET['editor'])) {
    $editor = 1;
}

$gg = "https://drive.google.com/drive/u/0/recent";
if ($men_user_id==115) {
  $gg = "https://github.com";
} 


  $_COOKIE['loggedIN'] = 199;

  $men_liste = array(array(), array(), array(), array());
  //echo "<hr><pre>";print_r ($men_liste); // es werden immer gleich 4 lelemente initiert -> php
  $t = -1;
  $h = -1;
  $z = -1;
  $e = -1;
  $felder = "men_id,men_button,men_link,LEFT(men_html,1) AS men_html,men_ues_level,men_fenster,men_hoehe,men_breite,men_hoehe,men_hide,men_edit_erlaubt";
  //$sql = "SELECT $felder,1 as collap,0 as haupt_kinder FROM menuezeilen WHERE (men_user_id=$men_user_id AND men_sort>0 AND $ad_hide_filter $such_filter) ORDER BY men_sort,men_id";
  $sql = "SELECT $felder,1 as collap,0 as haupt_kinder FROM menuezeilen WHERE (men_user_id=$men_user_id AND $ad_hide_filter) ORDER BY men_sort,men_id";
  $rs = mysqli_query($PHP_BAA_DC, $sql);
  if (!$rs) {
      echo $sql . mysqli_error($PHP_BAA_DC);
      exit;
  }

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
  // if ($_SERVER['REMOTE_ADDR']=="77.119.160.139") {
  //   $such_filter="ABW1:";
  // };


  $men_button_found=false; //wir für such_filter benötigt
  $haupt_kinder=0;
  $last_open_nr=0;$last_open_json="";

  $baa_zzz=0;

  // while (($row = mysqli_fetch_assoc($rs)) && ($baa_zzz<400)) {
  while ($row = mysqli_fetch_assoc($rs)) {
    $baa_zzz++;
    //echo "<pre>";print_r ($row);
    //$sort=$row['men_sort'];

    if ($row['men_button'][0]=="<") {
      $tmp=$row['men_button'];
      if (strpos($tmp,"img")==1) {
        if (strpos($tmp,"src")==false) {
          $row['men_button']=str_replace("<img ","<img class='bmen' src=../assets/images/",$tmp);
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
          $men_button_found==true;
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
?>
