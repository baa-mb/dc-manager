<?php
session_start();
include_once("php_edumenu_conn.php");  //mysqli_select_db($PHP_BAA_DC,$projekt_dbname);
extract($_POST);
// $men_user_id=$_SESSION['men_user_id']; // 3.5.2020
//print_r($_POST);wait(5000);;

if (empty($men_user_id)) {
	echo "user nicht bekannt!";
	exit;
}

if ($men_id<0) { // neue zeile anlegen
	$men_flag="add";
}

if (empty($schritt_fakt) || !isset($schritt_fakt)) {
	$schritt_fakt=1;
}
 

$ret="";
switch ($men_flag) {
	case "del":  // löschen
		$sql="DELETE FROM menuezeilen WHERE men_id=$men_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);
		$ret="r";
	break;

	case "ren":
		renumber($PHP_BAA_DC,$men_user_id,$schritt_fakt);
		$ret="ren";
	break;

	case "kop":
		$add_sort=2;
		$sql="SELECT men_button,men_breite,men_sort FROM menuezeilen WHERE men_id=$men_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);exit;}
		$row=mysqli_fetch_row($rs);
		$txt=$row[0];
		$br=$row[1];
		$ziel_men_sort=$row[2];
		mysqli_free_result($rs);


		$ziel_men_user_id=$men_user_id;

		$a_tmp=explode(" ",$txt);
		$anz=count($a_tmp);
		//if ($br>=0) { //bei einer normalen kopie

			if ($ctrl_flag>"0") {

				//kopie auf anderes Menüpunkt
				$add_sort=0;
				$a_ret=explode(",",$ctrl_flag);

				$ziel_men_user_id=$a_ret[0];
				if (count($a_ret)>1) {
					$ziel_men_sort=$a_ret[1];
				}

			} else {
				//echo "txt:".$txt; exit;
				if ($anz>1) {
					$nr=intval($a_tmp[$anz-1]);
					if ($nr>0) {
						$vorne="";
						$b_tmp=explode("<br>",$txt);
						if (count($b_tmp)>1) {
							$a_tmp=explode(" ",$b_tmp[count($b_tmp)-1]);
							$anz=count($a_tmp);
							$vorne=implode(" ",array_splice($b_tmp,0,$anz-1))."<br>";
						}


						// if (validateDate(date("d.m.Y H:m",$a_tmp[$anz-1]),'d.m.Y')) {
						// 	$t=strtotime($a_tmp[$anz-1])+3600*24*1;
						// 	$txt=$vorne.implode(" ",array_splice($a_tmp,0,$anz-1))."a ".date("d.m.Y",$t);
						// } else if (validateDate(date("d.m.Y H:i",$a_tmp[$anz-2]." ".$a_tmp[$anz-1]),'d.m.Y H:i')) {
						// 	$txt=$vorne.implode(" ",array_splice($a_tmp,0,$anz-2))."".date("d.m.Y H:i");
						// } else {
							$nr++;
							$txt=$vorne.implode(" ",array_splice($a_tmp,0,$anz-1))." ".$nr;
						// }
					} else {
						// $txt=$txt." kopie";
					}

					//$txt=$a_tmp[0]."x".intval($a_tmp[1])+1;
				} else {
					// $txt=$a_tmp[0]." Kopie";
					$txt=$a_tmp[0];
				}
			}
		//}

		//$txt=$txt." 2";


		/*
		if ($br<0) { //unsinn
			$sql= "UPDATE menuezeilen SET men_breite=0 WHERE men_id=$men_id;";
			$rs=mysqli_query($PHP_BAA_DC,$sql);
			$br=$br*-1;
			$sql="SELECT men_user_id FROM menuezeilen WHERE men_user_id=$br;";
			$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);exit;}
			if (!$row=mysqli_fetch_row($rs)) {
				$br=0;
			}
			mysqli_free_result($rs);
			if ($br) {
				$sql= "UPDATE menuezeilen SET men_breite=0 WHERE men_id=$men_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql);
			}
			$ziel_men_user_id=$br;
			$add_sort=90000;
		}
		*/
		//echo "<script>console.log(".$ziel_men_sort+$add_sort.")</script>";;exit;

		$sql="INSERT INTO menuezeilen (men_button,men_link,men_html,men_sort,men_passwort,men_user_id,men_ues_level,men_fenster,men_druck_button) ";
		$sql.="SELECT '{$txt}',men_link,men_html,".($ziel_men_sort+$add_sort).",men_passwort,$ziel_men_user_id,men_ues_level,men_fenster,men_druck_button FROM menuezeilen WHERE men_id=$men_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}

		if ($ziel_men_user_id===$men_user_id) {
			renumber($PHP_BAA_DC,$men_user_id,	$schritt_fakt);
			$ret="r";
		}
	break;

	case "ues":
		$sql= "UPDATE menuezeilen SET ";
		$sql.="men_ues_level=$men_ues_level ";
		$sql.=" WHERE men_id=$men_id;";

		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}

		if (!$rs) {
			echo mysqli_error($PHP_BAA_DC);
			echo "<hr>";
			echo $rs.$sql;
			exit;
		}
	break;

	case "sp":
		if (strpos($$feld,"data:image")>-1) {
			$$feld=save_data_img($men_id,$$feld);
			$ret="s";
		}
		if ($feld=="men_breite") {
				if ($$feld==-1) {

					$feld="men_hide";
					$men_hide="-1";
				} else if ($$feld==-2) {
					$feld="men_hide";
					$men_hide="0";
				}
		}

		$sql= "UPDATE menuezeilen SET ";
		$sql.="$feld='".$$feld."'";
		$sql.=" WHERE men_id=$men_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}

		if (!$rs) {
			echo mysqli_error($PHP_BAA_DC);
			echo "<hr>";
			echo $sql;
			exit;
		}

	break;

	case "add":
		$sql="INSERT INTO menuezeilen (men_button,men_link,men_sort) VALUES ('".$men_button."','".$men_link."',$men_sort);";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);exit;}

		$sql="SELECT max(men_id) FROM menuezeilen;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);exit;}
		$row=mysqli_fetch_row($rs);
		mysqli_free_result($rs);

		$ret=$row[0];
	break;

	default:
		echo "Fehler bei Switch ";

}
echo $ret;

function renumber($PHP_BAA_DC,$men_user_id,$schritt_fakt=1) {
	// if (empty($schritt_fakt)) {
	// 	$schritt_fakt=1;
	// }
	$arr = array();
	$sql="SELECT men_id,men_sort,men_ues_level FROM menuezeilen WHERE men_user_id=$men_user_id ORDER BY men_sort;";
	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}

	$nr=100;
	while ($row=mysqli_fetch_row($rs)) {
		//echo "row:".$row[0]."<br>";


		if ($row[2]==1) {
			$nr=(floor($nr/(1000*$schritt_fakt))+1)*(1000*$schritt_fakt);
		} elseif ($row[2]==2) {
			$nr=(floor($nr/(100*$schritt_fakt))+1)*(100*$schritt_fakt);
		} elseif ($row[2]==3) {
			$nr=(floor($nr/(100*$schritt_fakt))+1)*(100*$schritt_fakt) + (50*$schritt_fakt);
		} else {
			// if ($erstFlag) {
			// 	//$nr=999999;
			// } else {
				
			// }
			$nr=$nr+10*$schritt_fakt;
		}
		$arr[$row[0]]=$nr;


	}
	mysqli_free_result($rs);

	

	$next_zahl=0; $fakt=9;$starthunderter=200;
	$t=0;$h=0;$last_tausend=0;$abstand=0;$last_hundert=0;
	foreach ($arr as $index=>$wert) {
		$sql="UPDATE menuezeilen SET men_sort=".$wert." WHERE (men_id=".$index.");";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}
	}
	$ret="r";


	

	//fehlerfall, dass der erste kein hauptmenüpunkt ist
	$fnd=0;
	$sql="SELECT men_id,men_ues_level FROM menuezeilen WHERE men_user_id=$men_user_id ORDER BY men_sort LIMIT 1;";
	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo mysqli_error($PHP_BAA_DC);echo $sql;exit;}
	if ($row=mysqli_fetch_row($rs)) {
		if ($row[1]==0) {
			$fnd=$row[0];
		}
	}	
	mysqli_free_result($rs);
	if ($fnd) {
		$sql="UPDATE menuezeilen SET men_ues_level=1 WHERE (men_id=$fnd);";
		$rs=mysqli_query($PHP_BAA_DC,$sql);
	}

}


function save_data_img($men_id,$inhalt) {

//	$pfad="mm-team/mm-assist/ress/mathdb/images/user/";
//	$relPfad="../../".$pfad;
	$relPfad="kcfinder/upload/images/";
	$absPfad="kcfinder/upload/images/";

	$dom=new DOMDocument();
	$dom->loadHTML(mb_convert_encoding($inhalt, 'HTML-ENTITIES', "UTF-8"));
	//	$dom->loadHTML($inhalt);
	$links = $dom->getElementsByTagName ('img');
	$a_src=array();
	$bildcounter=0;
	$doflag2=0;
	foreach ($links as $link) {
		$bildcounter++;

		$adr=$link->getAttribute('src');
		if (strpos($adr,"data:image")===0) {
			$anr=substr($men_id+1000000,1);
//			$fname="b_".$anr."_".date("ymd_His").".png";
			$fname="b_".$anr."_".$bildcounter.".png";

			$img = str_replace('data:image/png;base64,', '', $adr);
			$img = str_replace(' ', '+', $img);
			$data = base64_decode($img);
			$bytes=file_put_contents($relPfad.$fname, $data);

			$link->setAttribute("src",$relPfad.$fname);
			$doflag2++;
		}
	}
	if ($doflag2) {
		return $dom->saveHTML();
	} else {
		return $doflag2;
	}
}

function validateDate($date, $format = 'Y-m-d H:i:s') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}


?>
