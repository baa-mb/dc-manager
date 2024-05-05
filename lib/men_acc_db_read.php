<?php

function get_menu_data($PHP_BAA_DC,$men_user_id,$admin=0) {

  $ad_hide_filter="men_hide=0";
  if ($admin) {
    $ad_hide_filter="men_hide<=0";
    $_SESSION["ed"]=1;
  } else {
    $_SESSION["ed"]=0;
  }


  $men_liste = array(array(), array(), array(), array());
  //echo "<hr><pre>";print_r ($men_liste); // es werden immer gleich 4 lelemente initiert -> php
  $t = -1; $h = -1; $z = -1; $e = -1;

  //$sql = "SELECT $felder,1 as collap,0 as haupt_kinder FROM menuezeilen WHERE (men_user_id=$men_user_id AND men_sort>0 AND $ad_hide_filter $such_filter) ORDER BY men_sort,men_id";
  // $ad_hide_filter="men_hide=1";     
  $felder = "men_id,men_ues_level,men_button,men_level,LEFT(men_html,1) AS men_html,men_link,men_fenster,men_css_nr,men_blaettern";
  $sql = "SELECT $felder FROM menuezeilen WHERE (men_user_id=$men_user_id AND $ad_hide_filter) ORDER BY men_sort,men_id";
  $rs = mysqli_query($PHP_BAA_DC, $sql);  if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}

  // echo "<h1 style='color:white'>Anzahl:".mysqli_num_rows($rs)."</h1>";
  if (mysqli_num_rows($rs)==0) {
    echo "Ist leer";exit;
    add_4leer($PHP_BAA_DC,$men_user_id);
    $rs = mysqli_query($PHP_BAA_DC, $sql);  if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  }
   

  $a_liste=[];
  $last_men_ues_level_23=0; $level_korrektur=0;
  $men_button_found=false; //wird für such_filter benötigt
  $haupt_kinder=0;
  $last_open_nr=0;$last_open_json="";
  // while ($row = mysqli_fetch_row($rs)) {
  while ($row = mysqli_fetch_assoc($rs)) {

    $bild="";
    $icon_links="leer.png";
    $icon_links="w_quad.png";
    $btn=$row['men_button'];
    $men_id=$row['men_id'];

    if ($btn[0]=="<") {
      if (strpos($btn,"i ")==1) {
        $rg='/(<i ([0-9a-z_]*)>)/m';
        $icon_links = preg_replace($rg,"$2.png",$btn);
        $btn=substr($btn,strpos($btn,">")+1,99);
      } elseif (strpos($btn,"img")==1) {
        $rg='/<img ([0-9a-z_\.]*)>/';
        if (preg_match($rg, $btn, $matches)) {
          $icon_links=$matches[1];  
          $btn=substr($btn,strpos($btn,">")+1,99);
        }
        
      } else {  
        if (strpos($btn,"end show")==1) { //abbrechen, wenn es um reduzierte daten geht
          break;
        }
      }
      $xxxbild="<div class='ili'><img src='../assets/icons/$icon_links'/></div>";
    }  
    // $row['men_button']="<span class='material-icons li'>$icon_links</span><div>".$row['men_button']."</div><span class='material-icons re'>x</span>";
    
    $men_ues_level_23=($row['men_ues_level'] + 3) % 4;
    
    
    
    
    if ($men_ues_level_23==3) {
      if ($men_ues_level_23-$last_men_ues_level_23>1) {
        $men_ues_level_23=($men_ues_level_23-$last_men_ues_level_23);
      }  
    } else {
      $last_men_ues_level_23=$men_ues_level_23;
    }
    
    
    
    
    
    
    
    
    // $mur=$men_ues_level_23;
      
    // // if ($men_ues_level_23-$last_men_ues_level_23<=0) {
    // //   $level_korrektur=0;
    // // } else if ($men_ues_level_23-$last_men_ues_level_23>1) {
    // //   $level_korrektur=($men_ues_level_23-$last_men_ues_level_23)-1;
    // //   // $men_ues_level_23=$last_men_ues_level_23+1;
    // // }  

    // $vergl=$men_ues_level_23.">".$last_men_ues_level_23."<br>";
    // if ($men_ues_level_23-$last_men_ues_level_23>1) {
    //     // $level_korrektur=$men_ues_level_23-$last_men_ues_level_23+1;
    //     $men_ues_level_23=($men_ues_level_23-$last_men_ues_level_23);
    //     // $last_men_ues_level_23=$mur;
    //     $koor="ja";
    // } else {
    //   $koor="no";
    //   $level_korrektur=0;
    //   $last_men_ues_level_23=$mur;
    // } 


    // // $men_ues_level_23=$men_ues_level_23 - $level_korrektur;

    // // $btn=$btn."<br>$mur neu:".$men_ues_level_23."-".$level_korrektur;
    // $btn=$vergl.$btn."<br>$mur neu:".$men_ues_level_23."-".$koor;
    
    $sg="sg".$row['men_level'];
    $ues_lev="ues_lev".$men_ues_level_23;



    $row['men_button']="<div class='ili $ues_lev'><img class='ibild $sg' src='../assets/icons/$icon_links'/></div><div class='atxt'>$btn</div><div class='ire'></div>";
    // $row['men_button']="<div class='$ues_lev'><div class='ili'><img class='ibild $sg' src='../assets/icons/$icon_links'/></div><div class='atxt'>$btn</div><div class='ire'></div></div>";


    // $row['men_button']="<div class='atxt $sg $ues_lev'>$btn</div><div class='ire'></div>";
    
    // $row['men_button']="<div class='ili'><img class='ibild' src='../assets/icons/$icon_links'/></div><div class='atxt $sg $ues_lev'>$btn</div><div class='ire'></div>";
    // $row['men_button']=$bild."<div class='atxt $sg $ues_lev'>$btn</div><div class='ire'></div>";

    array_push($a_liste,$row);
    
  }
  mysqli_free_result($rs);
  // zeige_arr($men_liste);
  // return $men_liste;
  return $a_liste;
}



function add_4leer($PHP_BAA_DC,$men_user_id) {
  // $sql = "SELECT $felder,1 as collap,0 as haupt_kinder FROM menuezeilen WHERE (men_user_id=$men_user_id AND $ad_hide_filter) ORDER BY men_sort,men_id";
  // $rs = mysqli_query($PHP_BAA_DC, $sql);  if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
  // echo "treffer:".mysqli_num_rows($rs);
  // if (mysqli_num_rows($rs) == 0) {
    for ($i = 0; $i < 3; $i++) {
      $men_hide=0;
      if ($i>2) {
          $men_hide=1;
      }
      $sql = "INSERT INTO menuezeilen ";
      $sql .= "(men_user_id,men_button,men_sort,men_ues_level,men_hide) VALUES ";
      $sql .= "($men_user_id,'Menühauptpunkt'," . (($i + 1) * 10) . ",1,$men_hide); ";
      $rs = mysqli_query($PHP_BAA_DC, $sql);
      if (!$rs) { echo mysqli_error($PHP_BAA_DC); echo $sql; exit;}
    }
    
    //$sql = "SELECT $felder,1 as collap  FROM menuezeilen WHERE men_user_id=$men_user_id AND men_sort>0 AND LEFT(men_button,1)<>'@' ORDER BY men_sort,men_id";
    // $sql = "SELECT $felder,1 as collap  FROM menuezeilen WHERE men_user_id=$men_user_id ORDER BY men_sort,men_id";
    // $rs = mysqli_query($PHP_BAA_DC, $sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}
  // } 
  // mysqli_free_result($rs); 
}




function chk_admin() {
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
        echo "nacharbeiten nacharbeiten nacharbeiten nacharbeiten nacharbeiten nacharbeiten nacharbeiten ";
        //setcookie("admin", "0", time() - 10);
      }
    }
  } else {
    if ($_COOKIE['admin'] == "1") {
        $admin = 1;
    }
  }
  return $admin;        
}




function zeige_arr($arr,$flag=2) {
  if ($flag==1) {
    $startMemory = memory_get_usage();
    echo "<pre>";
    print_r($arr);
    $ttt=$arr;
    echo "Elem: ".sizeof($arr)." Recursive ".sizeof($arr,1)." Mem: ",(memory_get_usage() - $startMemory)," Bytes ";
    echo "</pre>";
  }

  if ($flag==2) {
      echo "<pre>";
      
      echo "<h2>Array-Menue</h2>";

      // $arr=str_replace("<br>","",$arr );
      print_r($arr);

      foreach($arr as $index => $a_arr1) {
          echo "<hr>eb 1".$index.$a_arr1;
          
          foreach($a_arr1 as $index2 => $a_wert) {
              echo "<br>eb1".$index2;
              foreach($a_wert as $index3=>$wert) {
                  foreach($wert as $index4=>$xwert) {
                      echo " $index4:".$xwert;
                  }    
                      echo " $index3:".$wert;
              }    
              echo "<hr>";
          }
      }    
  }    
}

function save_logbuch($PHP_BAA_DC,$men_user_kzz) {
    $ipadr=$_SERVER["REMOTE_ADDR"];
    if ($ipadr>"") {
        $sql="INSERT INTO men_logbuch (prgart,ipadresse,browser) ";
        $sql.="VALUES ('{$men_user_kzz}','{$ipadr}','x');";
        $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
        $_SESSION["last_ipadr"]=$ipadr;
    }
}


?>