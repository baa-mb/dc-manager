<?php
// header("Access-Control-Allow-Origin:*");
header('Content-Type: text/html; charset=utf-8');
error_reporting(E_ALL);
// include_once("sani.inc");
include_once "php_dc_conn.php";  //mysqli_select_db($PHP_BAA_DC,$projekt_dbname);
include_once 'php/qr/qrlib.php';
// extract($_GET);
// extract($_POST);
$_POST = json_decode(file_get_contents('php://input'), true);
// mehtode funktioniert mit javascript und mit JQ

// file_put_contents('baa.txt',$data['flag']);	

// file_put_contents('baa.txt',"alois".file_get_contents('php://input')); 
// echo "test";exit;
// $flag=$_POST['flag'];
$data_art=isset($_POST['data_art']) ? $_POST['data_art']:"";
$flag = isset($_POST["flag"]) ? $_POST["flag"]:0;
$akt_lehrer_id = isset($_POST["akt_lehrer_id"]) ? $_POST["akt_lehrer_id"]:0;
$akt_lehrer_pw = isset($_POST["akt_lehrer_pw"]) ? $_POST["akt_lehrer_pw"]:"";
$akt_klasse_id = isset($_POST["akt_klasse_id"]) ? $_POST["akt_klasse_id"]:0;
$akt_klasse_code = isset($_POST["akt_klasse_code"]) ? $_POST["akt_klasse_code"]:"";
$akt_wplan_id  = isset($_POST["akt_wplan_id"]) ? $_POST["akt_wplan_id"]:0;
$akt_schueler_id  = isset($_POST["akt_schueler_id"]) ? $_POST["akt_schueler_id"]:0;

$lehrer_daten = isset($_POST["lehrer_daten"]) ? $_POST["lehrer_daten"]:"";
$klassen_daten = isset($_POST["klassen_daten"]) ? $_POST["klassen_daten"]:"";
$schueler_daten= isset($_POST["schueler_daten"]) ? $_POST["schueler_daten"]:"";
$wplan_daten   = isset($_POST["wplan_daten"]) ? $_POST["wplan_daten"]:"";
$protok_daten  = isset($_POST["protok_daten"]) ? $_POST["protok_daten"]:"";

$uebungen_daten   = isset($_POST["uebungen_daten"]) ? $_POST["uebungen_daten"]:"";



	
// file_put_contents('baa.txt',"xxx".implode(",",$_POST));	


// if (empty($pw)) {
// 	echo "Schule nicht angegeben!";
// 	exit;
// }
// $men_flag="skz";

// echo $klassen_daten;
// get_schueler($PHP_BAA_DC,$akt_klasse_id);
// exit;

// print_r ($_POST) ;

switch ($data_art) { 
	case "schule":  // löschen
		$sql="SELECT * FROM digi_schulen WHERE skz=$skz;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);
		if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		$a_ret=[];
		// if (mysqli_num_rows($rs) == 0) {
		if ($row = mysqli_fetch_assoc($rs)) {
		// if (mysqli_num_assoc($rs) == 0) {
			$a_ret=$row;
		}
		mysqli_free_result($rs);
		echo json_encode($a_ret);
	break;

	case "lehrer":
		if ($akt_lehrer_id>0) {
			$sql="SELECT * FROM digi_lehrer WHERE lehrer_id=$akt_lehrer_id;";
		} else {
			$sql="SELECT * FROM digi_lehrer WHERE lehrer_pw='$akt_lehrer_pw';";
		}
		
		$rs=mysqli_query($PHP_BAA_DC,$sql);
		if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		$l_id=0;
		$a_ret=array();
		if ($row = mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
			$l_id=$row['lehrer_id'];
		}
		mysqli_free_result($rs);

		$ip=substr($_SERVER["REMOTE_ADDR"],-15);
		if ($l_id>100) {
			$sql = "INSERT INTO men_logbuch (prgart,user_nr,ipadresse) ";
			$sql .= "VALUES ('dcm',$l_id,'".substr($row['lehrer_email'],0,15)."');";
			$rs = mysqli_query($PHP_BAA_DC, $sql);	if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
		}


		if ($l_id>0) { //lehrer gefunden
			$sql="SELECT * FROM digi_klassen WHERE lehrer_id=$l_id ORDER BY klasse_kzz;";
			$rs=mysqli_query($PHP_BAA_DC,$sql);
			if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			// $a_ret=["fehler"=>1];

			$kl_anz=0;
			while ($row = mysqli_fetch_assoc($rs)) {
				$a_ret[]=$row;
				$kl_anz++;
			}
			if ($kl_anz==0) {
				$neu_sch_anz=3;
				$sql = "INSERT INTO digi_klassen ";
				$sql .= "(lehrer_id,klasse_kzz,klasse_sch_zahl,klasse_code) VALUES ";
				$sql .= "($l_id,'NEU',$neu_sch_anz,'".klasse_code_erz($PHP_BAA_DC,$l_id)."'); ";
				$rsx = mysqli_query($PHP_BAA_DC, $sql);	if (!$rsx) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
				
				// $sql = "INSERT INTO digi_klassen ";
				// $sql .= "(lehrer_id,klasse_kzz,klasse_sch_zahl,klasse_code) VALUES ";
				// $sql .= "($l_id,'Spielwiese',1,'".klasse_code_erz($PHP_BAA_DC,$l_id)."'); ";
				// $rsx = mysqli_query($PHP_BAA_DC, $sql);	if (!$rsx) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}

				$sql="SELECT * FROM digi_klassen WHERE lehrer_id=$l_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				//nur eine lesbar
				while ($row = mysqli_fetch_assoc($rs)) {
					$a_ret[]=$row;
					$kl_anz++;
					$kl_id=$row['klasse_id'];
				}
				$sql = "INSERT INTO digi_schueler (klasse_id) VALUES ($kl_id); ";
				for ($i=0;$i<$neu_sch_anz;$i++) {
					$rsx = mysqli_query($PHP_BAA_DC, $sql);if (!$rsx) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
				}
				
				$sql = "INSERT INTO digi_wplan (klasse_id,wplan_bez,wplan_datum) VALUES ($kl_id,'WP-1','".date('Y-m-d H:i:s')."');";	
				$rsx = mysqli_query($PHP_BAA_DC, $sql);if (!$rsx) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
				// file_put_contents('baa.txt',$i,FILE_APPEND);
			}
			mysqli_free_result($rs);
			// array_push($a_ret,["klassen_anz"=>$kl_anz]);
		} else {
			$a_ret[]=["found"=>"not"];
		}
		echo json_encode($a_ret);
	break;

    case "klassen":  
		$alle=set_get_klasse($PHP_BAA_DC,$flag,$akt_lehrer_id,$klassen_daten);
		echo json_encode($alle);
	break;

	case "get_klasse_code":  
		$alle=set_get_klasse($PHP_BAA_DC,$flag,$akt_klasse_code,$klassen_daten);
		// file_put_contents('baa.txt',json_encode($alle));	
		echo json_encode($alle);
	break;

	case "get_klasse_id":  
		$alle=set_get_klasse($PHP_BAA_DC,$flag,$akt_schueler_id,$klassen_daten);
		// file_put_contents('baa.txt',json_encode($alle));	
		echo json_encode($alle);
	break;

	case "schueler":  
		$alle=set_get_schueler($PHP_BAA_DC,$flag,$akt_klasse_id,$schueler_daten);
		// file_put_contents('baa.txt',$alle);	
		echo json_encode($alle);
	break;

	case "wplan":  
		$alle=set_get_wplan($PHP_BAA_DC,$flag, $akt_klasse_id,$wplan_daten);
		echo json_encode($alle);
	break;

	case "uebungen":  
		$alle=set_get_uebungen($PHP_BAA_DC,$flag, $akt_wplan_id,$uebungen_daten);
		echo json_encode($alle);
	break;

	case "kl_wp_ub":  
		$alle=get_kl_wp_ub($PHP_BAA_DC,$flag, $akt_klasse_id,$klassen_daten);
		echo json_encode($alle);
	break;

	case "protok":  
		$alle=set_get_protok($PHP_BAA_DC,$flag, $akt_schueler_id,$protok_daten);
		echo json_encode($alle);
	break;

	case "sch_protok":  
		if ($flag=="wplan_protok") {
			$alle=set_get_protok($PHP_BAA_DC,$flag, $akt_wplan_id,$protok_daten);
		} else {
			$alle=set_get_protok($PHP_BAA_DC,$flag, $akt_schueler_id,$protok_daten);
		}
		echo json_encode($alle);
	break;

	case "demo_loeschen":  
		$alle=demo_loeschen($PHP_BAA_DC,$flag);
	break;

	// case "wplan_protok":  
	// 	$alle=set_get_protok($PHP_BAA_DC,$flag, $akt_schueler_id,$protok_daten);
	// 	echo json_encode($alle);
	// break;

	default:
		if (is_array($_POST)) {echo "Fehler bei Switch: ".$data_art.implode(",",$_POST);};
}


function get_kl_wp_ub($PHP_BAA_DC,$flag,$kl_id,$klassen_daten) {
	$a_ret=[];

	// $sql="SELECT lehrer_id,klasse_kzz,klasse_code FROM digi_klassen WHERE klasse_id='$kl_id';";

	// $sql="SELECT digi_lehrer.lehrer_wp_public ";
	// $sql.="FROM digi_klassen INNER JOIN digi_lehrer ON digi_klassen.lehrer_id = digi_lehrer.lehrer_id ";
	// $sql.="WHERE ((digi_klassen.klasse_id)=$kl_id);";
	// $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	// $wp_public=1;
	// $filter_zusatz="";
	// if ($row=mysqli_fetch_row($rs)) {
	// 	$wp_public=$row[0];
	// }	
	// mysqli_free_result($rs);

	// if ($wp_public==1) {
	// 	$filter_zusatz="OR (digi_wplan.wplan_public=$wp_public)";
	// }

	if ($kl_id<0) {
		$kl_id=abs($kl_id);
		$filter_zusatz="(digi_wplan.wplan_id=$kl_id)";
	} else {
		if ($kl_id==0) {
			$filter_zusatz="(digi_wplan.wplan_frei=1) AND (digi_wplan.wplan_public=1)";
		} else {
			$filter_zusatz="(digi_wplan.wplan_frei=1) AND (digi_klassen.klasse_id=$kl_id)";
		}
	}	

	$sql ="SELECT digi_klassen.klasse_id, digi_wplan.wplan_bez, digi_wplan.wplan_datum, digi_uebungen.* ";
	// $sql ="SELECT digi_klassen.klasse_id, digi_wplan.wplan_bez, digi_wplan.wplan_datum, digi_uebungen.uebung_id, digi_uebungen.uebung_max, digi_uebungen.uebung_stift , digi_uebungen.uebung_link";
	$sql.="FROM (digi_klassen INNER JOIN digi_wplan ON digi_klassen.klasse_id = digi_wplan.klasse_id) INNER JOIN digi_uebungen ON digi_wplan.wplan_id = digi_uebungen.wplan_id ";
	$sql.="WHERE ($filter_zusatz) ORDER BY digi_wplan.wplan_datum DESC,digi_wplan.wplan_bez,digi_uebungen.uebung_sort,digi_uebungen.uebung_id;";
	
	// $sql.="WHERE ((digi_klassen.klasse_id=$kl_id) AND (digi_wplan.wplan_frei=1)) $filter_zusatz ORDER BY digi_wplan.wplan_datum DESC,digi_wplan.wplan_bez,digi_uebungen.uebung_sort;";
	// file_put_contents('baa.txt',$sql);

	$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	while ($row=mysqli_fetch_assoc($rs)) {
		if ($row['uebung_freigabe']=="0000-00-00") {
			$a_ret[]=$row;
		} else {
			if (date("Y-m-d")>=$row['uebung_freigabe']) {
				$a_ret[]=$row;
			}
		}
	}	
	mysqli_free_result($rs);
	return $a_ret;
}	



function set_get_schueler($PHP_BAA_DC,$flag,$kl_id,$schueler_daten) {
	$a_ret=[];
	$neu_flag=0;
	if ($flag=="schueler_liste") { //nur zum qr-code erzeugen
		
		$sql="SELECT schueler_id FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		$i=0;
		while ($row=mysqli_fetch_assoc($rs)) {
			check_qr_code($i,$kl_id,$row['schueler_id'],1);
			$a_ret[]=$row;
			$i++;
		}	
		mysqli_free_result($rs);
	
	} elseif ($flag=="load") {
		$sql="SELECT * FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		$i=0;
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
			$i++;
		}	
		mysqli_free_result($rs);

		$sql="SELECT klasse_sch_zahl FROM digi_klassen WHERE klasse_id=$kl_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		$klasse_sch_zahl=0;
		if ($row=mysqli_fetch_assoc($rs)) {
			$klasse_sch_zahl=$row['klasse_sch_zahl'];
		}
		mysqli_free_result($rs);

		if ($i<$klasse_sch_zahl) {
			make_neu_schueler($PHP_BAA_DC,$kl_id,$klasse_sch_zahl);
			$neu_flag=1;
		}


	} elseif ($flag=="save") { //########## save


		$a_ret=[];
		$a_daten=json_decode($schueler_daten,true);

		
		$schueler_id=0;
		$kl_id=0;
		
		foreach($a_daten as $idx=>$a_satz) {
			$kl_id = $a_satz['klasse_id'];
			$schueler_id  = $a_satz['schueler_id'];	
			$schueler_pw= $a_satz['schueler_pw'];

			if ($schueler_pw=="") {
				$sql="DELETE FROM digi_schueler WHERE schueler_id=$schueler_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				$neu_flag=1;
			} else {
				$sql="SELECT * FROM digi_schueler WHERE schueler_id=$schueler_id;";
			
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				$sql2="";
				// file_put_contents('baa1.txt',"druch");
				if ($row=mysqli_fetch_assoc($rs)) {
					$sql2="UPDATE digi_schueler SET schueler_pw='{$schueler_pw}' WHERE schueler_id=$schueler_id";
				} else {
					if ($kl_id>0) {
						$sql2="INSERT INTO digi_schueler (klasse_id,schueler_pw) VALUES ($kl_id,'$schueler_pw');";
						$neu_flag=1;
					}	
				}
				// file_put_contents('baa2.txt',$sql2);			
				$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
	

				mysqli_free_result($rs);
			}
		}
		
		
	} //ende save

	if ($neu_flag==1) { //wenn geändern, muss es hinaus gehen mit a_ret
		$a_ret=[];
		$sql="SELECT * FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row = mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
		}
		mysqli_free_result($rs);
	}
	return $a_ret;

}

function klasse_code_erz($PHP_BAA_DC,$l_id) {
	$vorh=false;
	// file_put_contents('baa.txt',"start");	
	do {
		$kl_code=make_klasse_code($l_id);
		$vorh=kl_code_vorhanden($PHP_BAA_DC,$kl_code);
	} while ($vorh);
	return $kl_code;
}

	
function make_klasse_code($l_id) {
	$ret="";
	$a="ABCDEFGHJKLMNPQRSTUVWXYZ";

	$bst=$a[random_int(0,strlen($a)-1)];
	$zahl=random_int(100,999);

	$ret=$bst.$zahl;

	// if ($l_id/2 == floor($l_id/2)) {
	// 	$ret=$bst.$zahl;
	// } else {
	// 	$ret=$zahl.$bst;
	// }
	return $ret;
}


function kl_code_vorhanden($PHP_BAA_DC,$kl_code) {
	$sql="SELECT klasse_code FROM digi_klassen WHERE klasse_code='$kl_code';";
	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	$ret=false;
	if ($row = mysqli_fetch_assoc($rs)) {
		$ret=true;
	}
	mysqli_free_result($rs);
	return $ret;
}

function del_weiterer_daten_von_klassen($PHP_BAA_DC,$kl_id,$was_loe,$sch_filter_spez="") {
	// file_put_contents('baa.txt',"x");		
	$ok=true;	
	if (strpos("x".$was_loe,"s")>0) {
		$s_list=[];

		$sql="SELECT schueler_id FROM digi_schueler WHERE klasse_id=$kl_id $sch_filter_spez";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			array_push($s_list,$row['schueler_id']);
		}	
		mysqli_free_result($rs);

		// file_put_contents('baa2.txt',$sql."/".implode(",",$s_list));		

		$tmp=implode(",",$s_list);
		$s_list=[];
		$sql="SELECT schueler_id FROM digi_protok WHERE schueler_id IN ($tmp);";
		//file_put_contents('baa2.txt',$sql."/".implode(",",$s_list));		
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			array_push($s_list,$row['schueler_id']);
		}	
		mysqli_free_result($rs);
		
		// file_put_contents('baa2.txt',$sql." ".implode(",",$s_list));		
		// file_put_contents('baa.txt',implode(",",$s_list));	

		if (count($s_list)>0) {
			//alarm - es gibt hier daten
			$ok=false;

		} else {
			$s_list=[];
			//qr-codes löschen
			$sql="SELECT schueler_id as id FROM digi_schueler WHERE klasse_id=$kl_id $sch_filter_spez";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
			while ($row=mysqli_fetch_assoc($rs)) {
				$sid=$row['id'];
				array_push($s_list,$sid);
				$dname="../assets/qrcodes/".$sid.".png";
				if (file_exists($dname)) {
					unlink($dname);
				}
			}	
			mysqli_free_result($rs);

					

			if (count($s_list)>0) {
				//bilder löschen
				$a_p_list=[];
				$sql2="SELECT protok_id FROM digi_protok WHERE schueler_id IN (".implode(",",$s_list).");";
				$rs2=mysqli_query($PHP_BAA_DC,$sql2); if (!$rs2) {echo $sql2 . mysqli_error($PHP_BAA_DC);exit;}
				while ($row2=mysqli_fetch_assoc($rs2)) {
					array_push($a_p_list,$row2['protok_id']);
				}
				mysqli_free_result($rs2);	
				foreach($a_p_list as $pid) {
					$dname=get_bildname($pid);
					if (file_exists($dname)) {
						unlink($dname);
					}
				}	
				$sql2="DELETE FROM digi_protok WHERE schueler_id IN (".implode(",",$s_list).");";
				$rs2=mysqli_query($PHP_BAA_DC,$sql2); if (!$rs2) {echo $sql2 . mysqli_error($PHP_BAA_DC);exit;}
				// file_put_contents('baa.txt',"\r".$sql2,FILE_APPEND);
			}
			$sql="DELETE FROM digi_schueler WHERE klasse_id=$kl_id $sch_filter_spez;";
			$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			// file_put_contents('baa.txt',"\r".$sql,FILE_APPEND);
		}
	}

	if ((strpos("x".$was_loe,"w")>0) && $ok) {
		//übungen, die nie verwendet wurden,d arf man löschen
		$sql="SELECT wplan_id FROM digi_wplan WHERE klasse_id=$kl_id";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$wp_id=$row['wplan_id'];
	
			$a_u_list=[];
			//ddenkfehler: keine übungen aufbehalten, die einem gelöschten wplan und gelöschten schüler gehören
			// $sql2 ="SELECT digi_uebungen.uebung_id as uid ";
			// $sql2.="FROM digi_uebungen LEFT JOIN digi_protok ON digi_uebungen.uebung_id = digi_protok.uebung_id ";
			// $sql2.="WHERE ((digi_protok.protok_id Is Null) AND (digi_uebungen.wplan_id=$wp_id));";

			$sql2 ="SELECT uebung_id as uid FROM digi_uebungen WHERE wplan_id=$wp_id;";
			$rs2=mysqli_query($PHP_BAA_DC,$sql2); if (!$rs2) {echo $sql2 . mysqli_error($PHP_BAA_DC);exit;}
			while ($row2=mysqli_fetch_assoc($rs2)) {
				array_push($a_u_list,$row2['uid']);
			}
			mysqli_free_result($rs2);	
			if (count($a_u_list)>0) {

				//auch die protokolle und bilder gehören weg
				$a_p_list=[];
				$sql2="SELECT protok_id FROM digi_protok WHERE uebung_id IN (".implode(",",$a_u_list).");";
				$rs2=mysqli_query($PHP_BAA_DC,$sql2); if (!$rs2) {echo $sql2 . mysqli_error($PHP_BAA_DC);exit;}
				while ($row2=mysqli_fetch_assoc($rs2)) {
					array_push($a_p_list,$row2['protok_id']);
				}
				mysqli_free_result($rs2);	
				foreach($a_p_list as $pid) {
					$dname=get_bildname($pid);
					if (file_exists($dname)) {
						unlink($dname);
					}
				}	

				$sql2="DELETE FROM digi_protok WHERE uebung_id IN (".implode(",",$a_u_list).");";
				$rs2=mysqli_query($PHP_BAA_DC,$sql2); if (!$rs2) {echo $sql2 . mysqli_error($PHP_BAA_DC);exit;}


				foreach($a_u_list as $pid) {
					$dname=get_bildname($pid,1);
					// file_put_contents('../assets/user_img/baa.txt',$dname."\n",FILE_APPEND);
					if (file_exists($dname)) {
						unlink($dname);
					}
				}
				$sql2="DELETE FROM digi_uebungen WHERE uebung_id IN (".implode(",",$a_u_list).");";
				$rs2=mysqli_query($PHP_BAA_DC,$sql2); if (!$rs2) {echo $sql2 . mysqli_error($PHP_BAA_DC);exit;}
			}
		}	
		mysqli_free_result($rs);

		$sql="DELETE FROM digi_wplan WHERE klasse_id=$kl_id;";
		// file_put_contents('baa.txt',"\r".$sql,FILE_APPEND);
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		//übungen drüfen bleiben, weil sie protokoll haben
	}

	if ((strpos("x".$was_loe,"k")>0) && $ok) {
		$sql="DELETE FROM digi_klassen WHERE klasse_id=$kl_id;";
		// file_put_contents('baa.txt',"\r".$sql,FILE_APPEND);
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	}
	return $ok;
}

function del_weitere_basis_wplan_id($PHP_BAA_DC,$wp_id,$was_loe) {
	if (strpos("x".$was_loe,"w")>0) {
		$sql="DELETE FROM digi_wplan WHERE wplan_id=$wp_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	}

	// if (strpos("x".$was_loe,"p")>0) { // nicht löschen weil sonst beim user die ergebnisse fehlen
	// 	$sql="DELETE FROM digi_uebungen WHERE klasse_id=$kl_id;";
	// 	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	// }
}



function set_get_klasse($PHP_BAA_DC,$flag,$filter_id,$klassen_daten) {


	// file_put_contents('baa.txt',$flag);

	$a_ret=[];
	$fehler="";
	if ($flag=="get_klasse_code") { //klssencode wird mitgeteilt und die Schülerdaten werden geholt
		$kl_code=$filter_id;
		$kl_id=0;
		
		$sql="SELECT klasse_id,klasse_kzz,klasse_code, 0 as anzahl_wp FROM digi_klassen WHERE klasse_code='$kl_code';";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		if ($row=mysqli_fetch_assoc($rs)) {
			$kl_id=$row['klasse_id'];
			$a_ret[]=$row;
		}	
		mysqli_free_result($rs);

		if ($kl_id) {
			
			$sql ="SELECT wplan_id FROM digi_wplan WHERE (wplan_frei=1) AND (klasse_id=$kl_id);";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			$anzahl=mysqli_num_rows($rs);
			mysqli_free_result($rs);
			//anzahl der wochenpläne dieser klasse
			$a_ret[0]['anzahl_wp']=$anzahl; 

			$sql="SELECT * FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
			$i=0;
			while ($row=mysqli_fetch_assoc($rs)) {
				$a_ret[]=$row;
				$i++;
			}	
			mysqli_free_result($rs);
		} else {
			$a_ret[]=["not found"];
		}
		
		// file_put_contents('baa.txt',implode(",",$a_ret));	

	} else if ($flag=="get_klasse_id") {

		$found_kid=-1; //weil es auch einen schueler 0 gibt
		$sql="SELECT klasse_id FROM digi_schueler WHERE schueler_id=$filter_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		if ($row=mysqli_fetch_assoc($rs)) {
			$found_kid=$row['klasse_id'];
		}	

		// file_put_contents('baa.txt',$found_kid);	

		mysqli_free_result($rs);
		if ($found_kid>=0) {
			$sql="SELECT klasse_id,klasse_kzz,klasse_code, 0 as anzahl_wp  FROM digi_klassen WHERE klasse_id=$found_kid;";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
			if ($row=mysqli_fetch_assoc($rs)) {
				$a_ret[]=$row;
			}	
			mysqli_free_result($rs);

			$sql ="SELECT wplan_id FROM digi_wplan WHERE (wplan_frei=1) AND (klasse_id=$found_kid);";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			$anzahl=mysqli_num_rows($rs);
			mysqli_free_result($rs);
			//anzahl der wochenpläne dieser klasse
			$a_ret[0]['anzahl_wp']=$anzahl; 
		}



	} else if ($flag=="load") {
		$sql="SELECT * FROM digi_klassen WHERE lehrer_id=$filter_id ORDER BY klasse_kzz;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
		}	
		mysqli_free_result($rs);


	} else { //save klassendaten
		// file_put_contents('baa.txt',"da",FILE_APPEND);									
		$a_daten=json_decode($klassen_daten,true);
		$filter_id=0;
		$kl_id=0;
		$neu_flag=0;
		
		// file_put_contents('baa.txt',"");
		foreach($a_daten as $idx=>$a_satz) {
			$filter_id   = $a_satz['lehrer_id'];	
			$kl_id  = $a_satz['klasse_id'];
			$kl_kzz = $a_satz['klasse_kzz'];
	
			if ($kl_kzz=="LÖSCHEN") {

				if (!del_weiterer_daten_von_klassen($PHP_BAA_DC,$kl_id,"swk")) {
					$fehler=["fehler","Es existieren noch Protokolle der Schüler - Löschen ist somit nicht möglich!"];
				}
				$neu_flag=1;

				
			} else { //ändern und erweitern
				$kl_code="";

				$sql="SELECT * FROM digi_klassen WHERE klasse_id=$kl_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				$sql2="";

				if ($row=mysqli_fetch_assoc($rs)) {
					if ($a_satz['klasse_sch_zahl']<$row['klasse_sch_zahl']) {
						
						$loe_list=[];
						$sql3="SELECT schueler_id FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
						$rs3=mysqli_query($PHP_BAA_DC,$sql3);if (!$rs3) {echo $sql3.mysqli_error($PHP_BAA_DC);exit;}
						$i=0;
						while ($row3=mysqli_fetch_assoc($rs3)) {
							$i++;
							if ($i>$a_satz['klasse_sch_zahl']) {
								$loe_list[]=$row3['schueler_id'];
							}
						}	
						mysqli_free_result($rs3);
						//file_put_contents('baa.txt',implode(",",$loe_list));
						if (count($loe_list)>0) { //überschüssige schüler
							// $fehler=["fehler","alarm".implode(",",$loe_list)];
							if (!del_weiterer_daten_von_klassen($PHP_BAA_DC,$kl_id,"s"," AND schueler_id IN (".implode(",",$loe_list).")")) {
							 	$fehler=["fehler","Es existieren noch Protokolle der Schüler - Löschen ist somit nicht möglich!"];
							}
			
						}

					}


					$sql2="UPDATE digi_klassen SET klasse_kzz='{$a_satz['klasse_kzz']}', klasse_sch_zahl={$a_satz['klasse_sch_zahl']} WHERE klasse_id=$kl_id";
					$neu_flag=2;
				} else {
					//insert neue klassen
					if ($filter_id>0) {
						$vorh=false;
						// file_put_contents('baa.txt',$sql);	
						do {
							$kl_code=make_klasse_code($filter_id);
							$vorh=kl_code_vorhanden($PHP_BAA_DC,$kl_code);
						} while ($vorh);
						// file_put_contents('baa.txt',$kl_code."=".$vorh." ",FILE_APPEND);

						$sql2="INSERT INTO digi_klassen (lehrer_id,klasse_kzz,klasse_code,klasse_sch_zahl) VALUES ($filter_id,'$kl_kzz','$kl_code',{$a_satz['klasse_sch_zahl']});";
						$neu_flag=3;
					}
				}
			
				$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
				mysqli_free_result($rs);
				
				if ($neu_flag==3) {
					$sql="SELECT klasse_id FROM digi_klassen WHERE klasse_code='$kl_code';";
					$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
					if ($row=mysqli_fetch_row($rs)) {
						$kl_id=$row[0];
					} 
					mysqli_free_result($rs);		
					// file_put_contents('baa.txt',$sql." ".$kl_id);	
				}
				$sql="SELECT wplan_id FROM digi_wplan WHERE klasse_id=$kl_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				
				if (mysqli_num_rows($rs)==0) {
					$sql2="INSERT INTO digi_wplan (klasse_id,wplan_bez,wplan_datum) VALUES ($kl_id,'WP-1','".date('Y-m-d H:i:s')."');";	
					$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
					// file_put_contents('baa.txt',$sql2,FILE_APPEND);	
				}	
				mysqli_free_result($rs);
			}	
		}
		
		if ($neu_flag>0) {
			$sql="SELECT * FROM digi_klassen WHERE lehrer_id=$filter_id ORDER BY klasse_kzz;";
			$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			while ($row = mysqli_fetch_assoc($rs)) {
				$a_ret[]=$row;
			}
			mysqli_free_result($rs);
		}
		if ($fehler!="") {
			$a_ret[]=$fehler;
		}
	}

	return $a_ret;

}



function set_get_wplan($PHP_BAA_DC,$flag,$kl_id,$wplan_daten) {
	
	$neu_flag=0;
	$a_ret=[];
	if ($flag=="load") {
		
		$l_id="0";
		if ($wplan_daten) { //wird immer mitgeliefert
			$a_daten=json_decode($wplan_daten,true);
			$a_satz=$a_daten[0]; // nur ein satz wird geliefert
			$l_id=$a_satz['akt_lehrer_id'];
			$s_id=$a_satz['akt_schueler_id']; //wird nur einmal gebraucht - siehe unten
		}

		if ($l_id=="100") {
			// ist der lehrer Public, dann würden ihm bei jeder klasse auch die public eingespielt, das stört etwas, allerdings sonst müssen bei jeder klasse auch die pbulci angezeigt werden
			$sql="SELECT * FROM digi_wplan WHERE (klasse_id=$kl_id) ORDER BY wplan_public,wplan_bez;";
		} else if ($l_id=="s") { //reihenfolge der ifs ist wichitg
			$sql="SELECT * FROM digi_wplan WHERE ((klasse_id=$kl_id) OR (wplan_public=1)) AND (wplan_frei=1) ORDER BY wplan_bez;";
		} else { 
			$sql="SELECT * FROM digi_wplan WHERE (klasse_id=$kl_id) OR (wplan_public=1) ORDER BY wplan_public,wplan_datum DESC,wplan_bez;";
		}
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
		}	
		mysqli_free_result($rs);

		if ($l_id=="s") {
			// file_put_contents('baa2.txt',$a_satz['akt_schueler_id']);
			$sql="SELECT wplan_id FROM digi_protok WHERE schueler_id=$s_id LIMIT 1;";
			$sql="SELECT DISTINCT wplan_id FROM digi_protok WHERE schueler_id=$s_id";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			$a_ok=array();
			while ($row=mysqli_fetch_row($rs)) {
				array_push($a_ok,$row[0]);
			}	
			mysqli_free_result($rs);
			// file_put_contents('baa2.txt',implode(",",$a_ok)." ".implode(",",$a_ret));

			$a_tmp=[]; //nur jene, die auch in protok etwas beinhaltet haben
			foreach ($a_ret as $a_werte) {
				if (in_array($a_werte['wplan_id'],$a_ok)) {
					$a_tmp[]=$a_werte;
				}
			}	
			$a_ret=$a_tmp;
		}

		// file_put_contents('baa2.txt',$sql);
	
	} else if ($flag=="kopie") {

		$a_daten=json_decode($wplan_daten,true);
		$a_satz=$a_daten[0]; // nur ein satz wird geliefert
		$wp_quell_id=$a_satz['wp_quell_id'];
		$kl_ziel_id=$a_satz['kl_ziel_id'];

		$sql="SELECT klasse_id FROM digi_klassen WHERE klasse_id=$kl_ziel_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		$anz=mysqli_num_rows($rs);
		mysqli_free_result($rs);

		//klasse existiert
		if ($anz==0) {
			//break out
			// file_put_contents('baa.txt',"vor");
			return $a_ret;
		}
		// file_put_contents('baa1.txt',"nach");

		$sql="INSERT INTO digi_wplan (klasse_id,wplan_bez,wplan_datum,wplan_frei,wplan_public) ";
		// $sql.="SELECT $kl_ziel_id, CONCAT('K-',wplan_bez),'".date('Y-m-d')."',0,0 ";
		$sql.="SELECT $kl_ziel_id, CONCAT('K-',SUBSTRING(wplan_bez,1,18)),'".date('Y-m-d')."',0,0 ";
		$sql.="FROM digi_wplan ";
		$sql.="WHERE wplan_id=$wp_quell_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}

		$sql="SELECT LAST_INSERT_ID() FROM digi_wplan;";
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		$row=mysqli_fetch_row($rs);
		$last_id=$row[0]; //höchste nummer finden
		mysqli_free_result($rs);

		//übung kopieren
		$sql="INSERT INTO digi_uebungen (wplan_id,uebung_sort,uebung_kzz,uebung_kzz_ur,uebung_link,uebung_titel,uebung_html,uebung_max,uebung_stift) ";
		$sql.="SELECT $last_id,uebung_sort,uebung_kzz,uebung_kzz_ur,uebung_link,uebung_titel,uebung_html,uebung_max,uebung_stift ";
		$sql.="FROM digi_uebungen ";
		$sql.="WHERE wplan_id=$wp_quell_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}


		//copy von html von früher - sehr defizil
		$sql="SELECT uebung_id,uebung_link FROM digi_uebungen WHERE wplan_id=$last_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		$i=0;
		while ($row=mysqli_fetch_assoc($rs)) {
			if (str_contains($row['uebung_link'],"user_img/u_")) {
				$akt_id=$row['uebung_id'];
				$lnk=$row['uebung_link'];

				if (str_contains($row['uebung_link'],".txt")) {
					$re = '/u_[0-9]{4,7}/m';
					preg_match($re, $lnk, $matches);
					// file_put_contents('baa2.txt',implode($matches)." ".$i." ".count($matches)." ".$matches[0]." ".$matches[0][0]);
					$ur_nr=substr($matches[0],2);
					
					if ($row['uebung_id']!=intval($ur_nr)) {
						//keine eckigen klammern
						$sql2="UPDATE digi_uebungen AS T1,";
						$sql2.="(SELECT uebung_html FROM digi_uebungen WHERE digi_uebungen.uebung_id = $ur_nr) AS T2 ";
						$sql2.="SET T1.uebung_html=T2.uebung_html,T1.uebung_link='../assets/user_img/u_".$akt_id.".txt' WHERE T1.uebung_id = $akt_id;";
						$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
						// file_put_contents('baa2.txt',$sql2." ".$i);
					}
				} elseif (str_contains($row['uebung_link'],".png")) {
					$old=urldecode($a_satz['uebung_link']);
					$arr_neu_png_name=copy_text_grafik($akt_id,$lnk);
					if ($arr_neu_png_name[0]=="png") {
						if ($arr_neu_png_name[1]>"") {
							$sql2="UPDATE digi_uebungen SET uebung_link='".$arr_neu_png_name[1]."' WHERE uebung_id=$akt_id";
							$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
						}
					}	
				}
			}	
			$i++;
		}	
		mysqli_free_result($rs);





		//txt und png-dateien kopieren
		// $sql="SELECT uebung_link,uebung_id WHERE wplan_id=$last_id";
		// $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		// while ($row=mysqli_fetch_row($rs)) {
		// 	$lnk=$row[0];$neu_uid=$row[1];

		// 	if (str_contains($lnk,"../assets/user_img/u_")) {
		// 		$re = '/(u_)([0-9]{4,6})(\.txt|\.png)/m';
		// 		// $str = '../assets/user_img/u_2110.txt';
				
		// 		// $neu_uid=str_pad($uid, 5, '0', STR_PAD_LEFT);
		// 		$subst = "${1}".$neu_uid."$3";
		// 		$neu_lnk = preg_replace($re, $subst, $lnk);
		// 		copy($lnk,$neu_lnk);
		// 	}
		// }	
		// mysqli_free_result($rs);

		$neu_flag=1;

	} else { // ändernm

		// file_put_contents('baa2.txt',"");

		$a_daten=json_decode($wplan_daten,true);
		
		$wplan_id=0;
		$kl_id=0;
		
		foreach($a_daten as $idx=>$a_satz) {
			$kl_id     = $a_satz['klasse_id'];
			$wplan_id  = $a_satz['wplan_id'];	
			$wplan_bez = $a_satz['wplan_bez'];
			$wplan_datum = $a_satz['wplan_datum'];
			$wplan_frei = $a_satz['wplan_frei'];
			$wplan_public = $a_satz['wplan_public'];
			if ($wplan_bez=="LÖSCHEN") {

				$sql="DELETE FROM digi_uebungen WHERE wplan_id=$wplan_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}

				$sql="DELETE FROM digi_wplan WHERE wplan_id=$wplan_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				$neu_flag=1;
			} else {							
				$sql="SELECT * FROM digi_wplan WHERE wplan_id=$wplan_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				$sql2="";
				// file_put_contents('baa2.txt',$sql,FILE_APPEND);		
				if ($row=mysqli_fetch_assoc($rs)) {
					$sql2="UPDATE digi_wplan SET wplan_bez='{$a_satz['wplan_bez']}',wplan_datum='{$a_satz['wplan_datum']}',wplan_frei={$a_satz['wplan_frei']},wplan_public={$a_satz['wplan_public']} WHERE wplan_id=$wplan_id";
					
					// file_put_contents('baa.txt',$wplan_datum,FILE_APPEND);
				} else {
					if ($kl_id>0) {
						$sql2="INSERT INTO digi_wplan (klasse_id,wplan_bez,wplan_datum,wplan_frei,wplan_public) VALUES ($kl_id,'$wplan_bez','".date('Y-m-d H:i:s')."',0,0);";
						$neu_flag=1;
					}
				}
			
				// file_put_contents('baa2.txt',$sql2,FILE_APPEND);			
				$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
				mysqli_free_result($rs);
			}
		}
		
	}
	if ($neu_flag==1) {
		$a_ret=[];
		$sql="SELECT * FROM digi_wplan WHERE (klasse_id=$kl_id) OR (wplan_public=1) ORDER BY wplan_bez,wplan_datum;";

		// $sql="SELECT * FROM digi_wplan WHERE (klasse_id=$kl_id OR wplan_public=1) ORDER BY wplan_datum DESC,wplan_bez;";
		// file_put_contents('baa.txt',$sql);			
		$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		while ($row = mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
		}
		mysqli_free_result($rs);
	}

	return $a_ret;
}


function grafik_text_loeschen($u_id) {
	$name="../assets/user_img/u_".$u_id.".png";
	if (file_exists($name)) {
		unlink($name);
	}
	// $name="../assets/user_img/u_".$u_id.".txt";
	// if (file_exists($name)) {
	// 	unlink($name);
	// }
}

//copytext_grafik($uebung_id,$a_satz['uebung_link']);
function copy_text_grafik($neu_u_id,$link) {
	$ret=["",""];
	$alt_name  = $link;
	$neu_name = "../assets/user_img/u_".$neu_u_id;
	if (str_contains($link,".png")) {
		if (file_exists($link)) {
			copy ($link,$neu_name.".png");
			$ret=["png",$neu_name.".png"];
		}
	}

	if (str_contains($link,".txt")) {
		$ret=["txt",$neu_name.".txt"];
	}

	// file_put_contents('baa.txt',$neu_u_id .",".$link);	
	//bei txt muss der DB-Inhalt kopiert werden.
	// if (str_contains($link,".txt")) {
	// 	if (file_exists($link)) {
	// 		copy ($link,$neu_name.".txt");
	// 		$ret=$neu_name.".txt";
	// 	}
	// }
	return $ret;
}

function set_get_uebungen($PHP_BAA_DC,$flag,$wp_id,$uebungen_daten) {
	$a_ret=[];
	if ($flag=="load") {
		//file_put_contents('baa.txt',count($uebungen_daten).$uebungen_daten);
		// if (count($uebungen_daten)>0) { //nachladen der übungsdaten für die Anziege im player
		// 	$a_daten=$uebungen_daten;
		// 	$sql="SELECT * FROM digi_uebungen WHERE uebung_id IN (".implode(",",$a_daten).");";
		// } else {
		// 	$sql="SELECT * FROM digi_uebungen WHERE wplan_id=$wp_id ORDER BY uebung_id;";
		// }
		$i=0;
		do {
			$neu_flag=0;
			$a_ret=[];
			// $sql="SELECT * FROM digi_uebungen WHERE wplan_id=$wp_id ORDER BY uebung_sort,uebung_kzz;";
			$sql="SELECT * FROM digi_uebungen WHERE wplan_id=$wp_id ORDER BY uebung_sort,uebung_id;";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			$i=0;
			while ($row=mysqli_fetch_assoc($rs)) {
				$a_ret[]=$row;
				$i++;
			}	
			mysqli_free_result($rs);
			if ($i==0) {
				for ($u=0;$u<5;$u++) {

					$sql2="INSERT INTO digi_uebungen (wplan_id,uebung_kzz,uebung_link) VALUES ($wp_id,'Ü-".($u+1)."','https://');";
					$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
				}
				$neu_flag=1;
			}
		} while ($neu_flag==1);
		
	
	// } elseif ($flag=="img_ren_flag") { //nicht mehr aktuell

	// 	$a_daten=json_decode($uebungen_daten,true);
	// 	$a_satz=$a_daten[0]; // nur ein satz wird geliefert
	// 	$l_id=$a_satz['akt_lehrer_id'];
	// 	$u_id=$wp_id;
		
	// 	$dname="../assets/user_img/".$l_id.".png";
	// 	$name="../assets/user_img/u_".$u_id.".png";
	// 	// file_put_contents('baa.txt',"");			
	// 	if (file_exists($dname)) {
	// 		// if (file_exists($name)) {
	// 		// 	unlink($name)
	// 		// }
	// 		rename($dname,$name);
	// 	}

	} else { //save und andere
		$a_daten=json_decode($uebungen_daten,true);
		$uebung_id=0;
		$kl_id=0;
		$neu_flag=0;
		$wplan_id=0;

		// file_put_contents('baa.txt',"");			
		foreach($a_daten as $idx=>$a_satz) {
			$wplan_id    = $a_satz['wplan_id'];	
			$uebung_id   = $a_satz['uebung_id'];
			$uebung_kzz  = $a_satz['uebung_kzz'];
			$uebung_kzz_ur  = $a_satz['uebung_kzz_ur'];
			// $uebung_link = $a_satz['uebung_link'];
			// $uebung_titel= $a_satz['uebung_titel'];

			$alt_uebung_id=$uebung_id; //beim kopieren ist hier die negative quell_nr enthalten
			if ($uebung_kzz=="LÖSCHEN") {
				$sql="DELETE FROM digi_uebungen WHERE uebung_id=$uebung_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				$neu_flag=1;
				grafik_text_loeschen($uebung_id);
				// file_put_contents('baa.txt',"\r$idx:".$sql,FILE_APPEND);				
			} else {							
				$sql="SELECT * FROM digi_uebungen WHERE uebung_id=$uebung_id;";
				// file_put_contents('baa.txt',$sql,FILE_APPEND);		
				$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				// file_put_contents('baa.txt',"\r$idx:".$sql,FILE_APPEND);		


				$sql2="";
				if (!$row=mysqli_fetch_assoc($rs)) {
					if ($wp_id>0) {
						$sql2="INSERT INTO digi_uebungen (wplan_id) VALUES ($wplan_id);";
						$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
						$neu_flag=1;
						
						
						$sql="SELECT LAST_INSERT_ID() FROM digi_uebungen;";
						$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
						$row=mysqli_fetch_row($rs);
						$uebung_id=$row[0];

						// file_put_contents('baa.txt',$sql." ".$row[0]);	
					}
				}
				mysqli_free_result($rs);

				if ($wp_id>0) {
					// if ($uebung_kzz_ur=="x") {
					// 	$uebung_kzz_ur=$uebung_id;
					// }
					//nun muessen aber alle felder vorkommen
					$a_satz['uebung_kzz']=substr($a_satz['uebung_kzz'],0,20);

					//achtung ab 202403	

					$url=urldecode($a_satz['uebung_link']);
					if (str_contains($url,".png") || str_contains($url,".txt")) {
						$uebung_kzz_ur=$uebung_id;
					}	
					// file_put_contents('baa.txt',$uebung_kzz_ur);	
					

					$sql2="UPDATE digi_uebungen SET uebung_kzz='{$a_satz['uebung_kzz']}',uebung_kzz_ur='{$uebung_kzz_ur}',uebung_sort={$a_satz['uebung_sort']},uebung_link='".urldecode($a_satz['uebung_link'])."',uebung_titel='{$a_satz['uebung_titel']}',uebung_max={$a_satz['uebung_max']},uebung_stift={$a_satz['uebung_stift']} WHERE uebung_id=$uebung_id";
					$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
					
					// eventuell Grafik löschen, wenn NUN keine mehr im update ist
					if (str_contains($a_satz['uebung_link'],"u_".$uebung_id.".")==false) { 
						grafik_text_loeschen($uebung_id);
					}
					if ($uebung_id != $alt_uebung_id) {
						$old=urldecode($a_satz['uebung_link']);
						if (str_contains($old,"u_")) {
							$arr_neu_png_name=copy_text_grafik($uebung_id,$old);
							if ($arr_neu_png_name[0]=="png") {
								if ($arr_neu_png_name[1]>"") {
									$sql2="UPDATE digi_uebungen SET uebung_link='".$arr_neu_png_name[1]."'  WHERE uebung_id=$uebung_id";
									$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
								}
							}	

							if ($arr_neu_png_name[0]=="txt") {
								$sql2="UPDATE digi_uebungen AS T1,";
								$sql2.="(SELECT uebung_html FROM digi_uebungen WHERE digi_uebungen.uebung_id = ".abs($alt_uebung_id).") AS T2 ";
								$sql2.="SET T1.uebung_html=T2.uebung_html,T1.uebung_link='../assets/user_img/u_".$uebung_id.".txt' WHERE T1.uebung_id = $uebung_id;";
								$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
								// file_put_contents('baa.txt',$sql2);	
							}	
						}
					}

				}
				// file_put_contents('baa.txt',$sql2);	



				// $sql2="";
				// if ($row=mysqli_fetch_assoc($rs)) {
				// 	if ($uebung_kzz_ur=="x") {
				// 		$uebung_kzz_ur="x".$uebung_id;
				// 	}
				// 	$sql2="UPDATE digi_uebungen SET uebung_kzz='{$a_satz['uebung_kzz']}',uebung_kzz_ur='{$uebung_kzz_ur}',uebung_sort={$a_satz['uebung_sort']},uebung_link='".urldecode($a_satz['uebung_link'])."',uebung_titel='{$a_satz['uebung_titel']}',uebung_max={$a_satz['uebung_max']},uebung_stift={$a_satz['uebung_stift']} WHERE uebung_id=$uebung_id";
				// 	$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
				// 	// file_put_contents('baa.txt',$sql2);	
				// } else {
				// 	if ($wp_id>0) {
				// 		$sql2="INSERT INTO digi_uebungen (wplan_id,uebung_sort,uebung_kzz,uebung_kzz_ur,uebung_link,uebung_titel,uebung_max,uebung_stift) VALUES ($wplan_id,{$a_satz['uebung_sort']},'{$a_satz['uebung_kzz']}','{$a_satz['uebung_kzz_ur']}','".urldecode($a_satz['uebung_link'])."','{$a_satz['uebung_titel']}',{$a_satz['uebung_max']},{$a_satz['uebung_stift']});";
				// 		$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
				// 		$neu_flag=1;
				// 	}
				// }
				// file_put_contents('baa.txt',"\r$idx:".$sql2,FILE_APPEND);		
				// mysqli_free_result($rs);
			}
		}
		
		if ($neu_flag==1) {
			$a_ret=[];
			$sql="SELECT * FROM digi_uebungen WHERE wplan_id=$wplan_id ORDER BY uebung_sort;";
			$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			while ($row = mysqli_fetch_assoc($rs)) {
				$a_ret[]=$row;
			}
			mysqli_free_result($rs);
		}
	}
	return $a_ret;
}



function set_get_protok($PHP_BAA_DC,$flag,$filter_id,$protok_daten) {
	// file_put_contents("baa1.txt",$flag);
	$a_ret=[];
	if ($flag=="load") { //??? wer ruft das?

		$sql="SELECT * FROM digi_protok WHERE schueler_id=$filter_id ORDER BY protok_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
		}	
		mysqli_free_result($rs);
	
		//lesen prot	

	} elseif ($flag=="sch_protok") { //schüler wollen die protokolle pro wplan aufrufen (juni 23)
		// $sql="SELECT uebung_id,protok_proz,protok_sek,DATE_FORMAT(zeit, '%d.%m.%y') as datum FROM digi_protok WHERE schueler_id=$filter_id AND uebung_id=1 ORDER BY uebung_id,protok_id;";
		$a_u_list=[];
		$a_ret_p_list=[];
		$alt_uebung_id=-1;
		
		$wplan_id=0;
		if ($protok_daten) { //strukturiert nach wplaenen schüler nach wplan
			$a_daten=json_decode($protok_daten,true);
			$a_satz=$a_daten[0]; // nur ein satz wird geliefert
			$wplan_id=$a_satz['wplan_id'];
		}

		$sort="uebung_id,zeit";
		$filter="schueler_id=$filter_id";
		if ($wplan_id!=0) {// nicht gesamt sondern strukturiert
			$filter.=" AND wplan_id=$wplan_id";
			$sort="protok_id,zeit";
			// $sort="zeit";

		}
		//hole alle protokdaten
		$sql="SELECT protok_id,uebung_id,uebung_sgrad,protok_proz,protok_sek,DATE_FORMAT(zeit, '%d.%m.%y') as datum,UNIX_TIMESTAMP(zeit) as time_stamp FROM digi_protok WHERE $filter ORDER BY $sort;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret_p_list[]=$row;
			if ($row['uebung_id']!=$alt_uebung_id) {
				$a_u_list[]=$row['uebung_id'];
			}
		}	
		mysqli_free_result($rs);




		if ($wplan_id!=0) {//sch meine ergebnisse wplan 
			//sortierung holen für reihefolgeanzeige, egal ob oberhalb was gefunden wurde 
			$a_ret_u_list=[];
			$sql="SELECT * FROM digi_uebungen WHERE wplan_id=$wplan_id ORDER BY uebung_sort;";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			while ($row=mysqli_fetch_assoc($rs)) {
				$a_ret_u_list[]=$row;
			}	
			mysqli_free_result($rs);
		} else {
			//Übungdaten für den player, wenn alle WP geladen werden
			$a_ret_u_list=[];
			if (count($a_u_list)>0) { //nachladen der übungsdaten für die Anzeige im player
				$sql="SELECT * FROM digi_uebungen WHERE uebung_id IN (".implode(",",$a_u_list).") ORDER BY uebung_kzz_ur,uebung_id;";
				$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				while ($row=mysqli_fetch_assoc($rs)) {
					$a_ret_u_list[]=$row;
				}	
				mysqli_free_result($rs);
			}
		}
		$a_ret=[$a_ret_p_list,$a_ret_u_list];

		// if (count($a_uebung_list)>0) {
		// 	$sql="SELECT * FROM digi_uebungen WHERE uebung_id IN (".implode(",",$a_uebung_list).");";
		// 	$rs=mysqli_query($PHP_BAA_DC,$sql); if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		// 	while ($row = mysqli_fetch_assoc($rs)) {
		// 		$a_ret[]=$row;
		// 	}
		// 	mysqli_free_result($rs);

		// }



	} elseif ($flag=="wplan_protok") {
		// $sql="SELECT uebung_id,protok_proz,protok_sek,DATE_FORMAT(zeit, '%d.%m.%y') as datum FROM digi_protok WHERE schueler_id=$filter_id AND uebung_id=1 ORDER BY uebung_id,protok_id;";
		$a_u_list=[];
		$a_ret_p_list=[];
		$alt_uebung_id=-1;

		$a_daten=json_decode($protok_daten,true);
		$a_satz=$a_daten[0];
		$kl_id=$a_satz['akt_klasse_id'];
		$wplan_ext=$a_satz['wplan_ext'];
		// file_put_contents('baa.txt',$kl_id);

		$wplan_klasse_id=0;
		$sql="SELECT klasse_id FROM digi_wplan WHERE wplan_id=$filter_id";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		if ($row=mysqli_fetch_assoc($rs)) {
			$wplan_klasse_id=$row['klasse_id'];
		}	
		mysqli_free_result($rs);



		$a_ret_s_list=[];
		$a_s_tmp=[]; //notwendig
		$sql ="SELECT schueler_id FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret_s_list[]=$row;
			$a_s_tmp[]=$row['schueler_id'];
		}	
		mysqli_free_result($rs);

		//file_put_contents('baa.txt',implode(",",$a_s_tmp));

		$sql="SELECT protok_id,uebung_id,schueler_id,uebung_sgrad,protok_proz,protok_sek,DATE_FORMAT(zeit,'%d.%m.%y') as datum,UNIX_TIMESTAMP(zeit) as time_stamp FROM digi_protok WHERE wplan_id=$filter_id ORDER BY uebung_id,zeit;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		if ($wplan_klasse_id==$kl_id) { // wplan des lehrers
			while ($row=mysqli_fetch_assoc($rs)) {
				$a_ret_p_list[]=$row;
				if ($row['uebung_id']!=$alt_uebung_id) {
					$a_u_list[]=$row['uebung_id'];
				}
			}	
		} else { //externer wplan - prüfe, nur für meine klassen-schüler
			while ($row=mysqli_fetch_assoc($rs)) {
				if (in_array($row['schueler_id'],$a_s_tmp)) {
					$a_ret_p_list[]=$row;
					if ($row['uebung_id']!=$alt_uebung_id) {
						$a_u_list[]=$row['uebung_id'];
					}
				} 
			}	
		}
		mysqli_free_result($rs);

		//welche übungen kommen im wplan vor
		$a_ret_u_list=[];
		$sql="SELECT * FROM digi_uebungen WHERE wplan_id=$filter_id  ORDER BY uebung_sort;";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			$a_ret_u_list[]=$row;
		}	
		mysqli_free_result($rs);
		

		// $a_ret_s_list=[]; //schülerliste aus dem wplan geholt - besser aus der klasse
		// $sql ="SELECT digi_schueler.schueler_id ";
		// $sql.="FROM digi_wplan INNER JOIN digi_schueler ON digi_wplan.klasse_id = digi_schueler.klasse_id ";
		// $sql.="WHERE (digi_wplan.wplan_id=$filter_id) ";
		// $sql.="ORDER BY digi_schueler.schueler_id;";
		// $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		// while ($row=mysqli_fetch_assoc($rs)) {
		// 	$a_ret_s_list[]=$row;
		// }	
		// mysqli_free_result($rs);
		
		$a_ret=[$a_ret_p_list,$a_ret_u_list,$a_ret_s_list,$wplan_ext];


	} elseif ($flag=="img_save_flag") {

		$a_daten=json_decode($protok_daten,true);
		$a_satz=$a_daten[0]; // nur ein satz wird geliefert

		$sql="SELECT protok_id FROM digi_protok WHERE (schueler_id=$filter_id AND wplan_id={$a_satz['wplan_id']} AND uebung_id={$a_satz['uebung_id']} AND protok_proz=-1);";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		$found_id=0;
		if ($row=mysqli_fetch_assoc($rs)) {
			$a_ret[]=$row;
			$found_id=$row['protok_id'];
		}	
		mysqli_free_result($rs);

		

		if ($found_id==0) {
			$sql="INSERT INTO digi_protok (schueler_id,wplan_id,uebung_id,uebung_sgrad,protok_proz,protok_sek) VALUES ($filter_id,{$a_satz['wplan_id']},{$a_satz['uebung_id']},{$a_satz['uebung_sgrad']},{$a_satz['protok_proz']},{$a_satz['protok_sek']});";
			$rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}

			if ($a_satz['protok_proz']==-1) {
				$sql="SELECT protok_id FROM digi_protok WHERE protok_proz=-1 ORDER BY protok_id DESC LIMIT 1;";
				$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				if ($row=mysqli_fetch_assoc($rs)) {
					$a_ret[]=$row;
				}	
				mysqli_free_result($rs);
			}
		} else {
			//serh unschön - wenn der schüler zeichnung speichert
			$sql2="UPDATE digi_protok SET protok_proz=0 WHERE protok_id=$found_id";
			$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}
			$sql2="UPDATE digi_protok SET protok_proz=-1 WHERE protok_id=$found_id";
			$rs2 = mysqli_query($PHP_BAA_DC, $sql2);if (!$rs2) { echo mysqli_error($PHP_BAA_DC).$sql2;  exit;}

		}
		// file_put_contents('baa.txt',$sql);

	} elseif ($flag=="savelehrer") {
		$a_daten=json_decode($protok_daten,true);
		$a_satz=$a_daten[0]; // nur ein satz wird geliefert
		if ($a_satz['protok_proz']=="-1") {
			$sql="DELETE FROM digi_protok WHERE protok_id=$filter_id";
		} else {
			$sql="UPDATE digi_protok SET protok_proz={$a_satz['protok_proz']} WHERE protok_id=$filter_id";

		}
		// file_put_contents('baa.txt',$sql);
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		


	} elseif ($flag=="img_del_flag") {
		$sql="DELETE FROM digi_protok WHERE (protok_id=$filter_id);";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		$bild=get_bildname($filter_id);
		if (file_exists($bild)) {
			unlink ($bild);
		}
	} else { //alles andere, wie save, EP oder RB, .... !!!
		$a_daten=json_decode($protok_daten,true);
		$a_satz=$a_daten[0]; // nur ein satz wird geliefert

		$fnd=0;
		if ($a_satz['protok_ftyp']=="1") {
			if ($a_satz['protok_proz']=="100") { //war einmal eine sperre, damit nicht 100 punkte gesammelt werden.
				$datum=date("Y-m-d");
				// file_put_contents('baa.txt',$datum);
				$sql="SELECT protok_id FROM digi_protok WHERE (schueler_id=$filter_id) AND uebung_id={$a_satz['uebung_id']} AND (protok_proz=100) AND (zeit LIKE '".$datum."%')";
				// file_put_contents('baa.txt',$sql);				
				$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				if ($row=mysqli_fetch_assoc($rs)) {
					$fnd=1;
				}	
				mysqli_free_result($rs);
				// file_put_contents('baa.txt',$row['protok_id']."\n",FILE_APPEND);	
			}
		}
		if ($fnd==0) {
			$sql="INSERT INTO digi_protok (schueler_id,wplan_id,uebung_id,uebung_sgrad,protok_proz,protok_sek) VALUES ($filter_id,{$a_satz['wplan_id']},{$a_satz['uebung_id']},{$a_satz['uebung_sgrad']},{$a_satz['protok_proz']},{$a_satz['protok_sek']});";
			$rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
		}
	}
	return $a_ret;
}


function get_bildname($nr,$u_flag=0) {
	if ($u_flag) {
		return "../assets/user_img/u_".$nr.".png";
	} else {
		return "../assets/user_img/".substr((10000000+$nr),1).".png";
	}
}


function get_tiere($PHP_BAA_DC) {
	$a_tiere=[];
	$sql="SELECT bee_tier_id,bee_tier_name,bee_tier_sex FROM digi_tiere WHERE LENGTH(bee_tier_name)<10 AND bee_tier_aktiv=1;";
	$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	mysqli_free_result($rs);
	while ($row = mysqli_fetch_assoc($rs)) {
		$a_tiere[]=$row['bee_tier_name'];
	}
	return $a_tiere;
}

function make_neu_schueler($PHP_BAA_DC,$kl_id,$klasse_sch_zahl)  {
	$sql="SELECT * FROM digi_schueler WHERE klasse_id=$kl_id;";
	$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	$ist_zahl=mysqli_num_rows($rs);
	// mysqli_free_result($rs);
	if ($ist_zahl<$klasse_sch_zahl) {
		// file_put_contents('baa.txt',$klasse_sch_zahl-$ist_zahl);	
		
		for ($i=0;$i<($klasse_sch_zahl-$ist_zahl);$i++) {
			$nr = $ist_zahl + $i + 1;
			$sql="INSERT INTO digi_schueler (klasse_id,schueler_nr) VALUES ($kl_id,$nr);";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}
	}
	
	
	// $a_ret=[];
	// $sql="SELECT * FROM digi_schueler WHERE klasse_id=$kl_id ORDER BY schueler_id;";
	// $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
	// while ($row=mysqli_fetch_assoc($rs)) {
	// 	$a_ret[]=$row;
	// }	
	// mysqli_free_result($rs);
	// return $a_ret
}

function make_neu_schueler_tiere($PHP_BAA_DC,$kl_id,$klasse_sch_zahl)  {
	$sql="SELECT * FROM digi_schueler WHERE klasse_id=$kl_id;";
	$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	$ist_zahl=mysqli_num_rows($rs);
	// mysqli_free_result($rs); fehler
	if ($ist_zahl<$klasse_sch_zahl) {
		$a_tiere= get_tiere($PHP_BAA_DC);
		// file_put_contents('baa.txt',count($a_tiere));	
		for ($i=0;$i<($klasse_sch_zahl-$ist_zahl);$i++) {
			$t_anz=count($a_tiere);
			$tier=$a_tiere[rand(0,$t_anz-1)];
			$neu_pw="";
			// file_put_contents('baa.txt',$tier);	
			do {
				$neu_pw=get_neu_pw($kl_id,$tier);
				
				$sql="SELECT schueler_id FROM digi_schueler WHERE schueler_pw='$neu_pw';";
				$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
				
				$pw_vorh=false;
				if ($row=mysqli_fetch_assoc($rs)) {
					$pw_vorh=true;
				}
			} while ($pw_vorh);
			mysqli_free_result($rs);

			$sql="INSERT INTO digi_schueler (klasse_id,schueler_pw) VALUES ($kl_id,'$neu_pw');";
			// file_put_contents('baa.txt',$sql);	
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}
	}
}


function get_neu_pw($kl_id,$tier) {
	// $rnd=rand(0,$t_anz-1);
	// return rand(1,9).$tier.rand(10,99);
	return $kl_id.$tier.rand(10,99);
}



function get_mittel_logo($p_text) {
	header('Content-type: image/png');
	// Create the image
	if (strlen($p_text)<3) {
		$text="  ".$p_text;
	} else {
		$text=" ".$p_text;
	}

	// $bb=60;$hh=40;
	// file_put_contents('baa.txt',"test:".$text."\r\n",FILE_APPEND);	
	$bb=76; $hh=42;

	$im = imagecreatetruecolor($bb,$hh);
	// Create some colors
	$white = imagecolorallocate($im, 255, 255, 255);
	$red = imagecolorallocate($im, 255, 0, 0);
	$grey =  imagecolorallocate($im, 128, 128, 128);
	$black = imagecolorallocate($im, 0, 0, 0);
	imagefilledrectangle($im, 0, 0, $bb-1,$hh-1, $white);
	
	// imagefilledrectangle($im, 0, 0, $bb-1,$hh-1, $red);

	$font = 'font/arialbd.ttf'; //schrift muss impfad liegen
	// $font = 'arial.ttf';
	// imagettftext($im, 20, 0, 6, 34, $red, $font, $text);
	imagettftext($im, 20, 0, 6, 34, $red, $font, $text);
	// imagettftext($im, 20, 0, 6, 34, $black, $font, $text);

	// Using imagepng() results in clearer text compared with imagejpeg()
	// imagepng($im);
	//imagepng($im,"../assets/qrcodes/sch".$i.".png");
	return ($im);
	imagedestroy($im);
}



function check_qr_code($i,$kid,$sid,$has_logo=1) {

	$qr_speicherpfad='../assets/qrcodes/';
	// $qr_dname=$kid."a".$sid; 
	$qr_dname=$sid; 
	$tmp_file="tmp/".$kid.".png";

	if (!file_exists($qr_speicherpfad.$qr_dname.".png")) {
		$qr_server_dyn="https://dc.baa.at/";

		$data = $qr_server_dyn.'?s='.base64_encode($qr_dname)."&nr=".($i+1); //dlpl oder baa
		$logo_text="s".($i+1);
		$size="400x400";
		
		if ($has_logo==0) { //kein logo
			// $gformat="svg";
			$gformat="png";
			// $margin="40";
			$margin="10";
			$format="&format=".$gformat;
			//alles mit google
			// $adr='https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs='.$size.'&chl='.rawurlencode($data);

			$qrCodeUrl=rawurlencode($data);
			$qrCodeUrl=$data;
			QRcode::png($qrCodeUrl,$tmp_file, QR_ECLEVEL_Q, 8, 2);
			$QR = imagecreatefrompng($tmp_file);

			// $QR = imagecreatefrompng($adr);
		} else {
			// header('Content-type: image/png');
			// http://code.google.com/apis/chart/infographics/docs/qr_codes.html
			
			$qrCodeUrl=rawurlencode($data);
			$qrCodeUrl=$data;
			QRcode::png($qrCodeUrl, $tmp_file, QR_ECLEVEL_Q, 8, 2);			
			$QR = imagecreatefrompng($tmp_file);


			// $QR=imagecreatefrompng(QRcode::png($qrCodeUrl, false, QR_ECLEVEL_Q, 10, 2));
				

			// file_put_contents('baa.txt',$xr);


			// ob_start();
			// QRcode::png($qrCodeUrl, null, QR_ECLEVEL_M, 10, 2);	
			// $QR = ob_get_contents();
			// ob_end_clean();
			// $QR = imagecreatefrompng('https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs='.$size.'&chl='.rawurlencode($data));

			
			if ($logo_text!="") {
				
				$logo=get_mittel_logo($logo_text);

				$QR_width = imagesx($QR); $QR_height = imagesy($QR);
				$logo_width = imagesx($logo); $logo_height = imagesy($logo);
	
				//echo $logo;
				//$logo = imagecreatefromstring(file_get_contents($logo));

				// Scale logo to fit in the QR Code
				$logo_qr_width = $QR_width/3;
				$scale = $logo_width/$logo_qr_width;
				$logo_qr_height = $logo_height/$scale;

				// imagecopyresampled($QR, $logo, $QR_width/3, $QR_height/3, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
				imagecopyresampled($QR, $logo, $QR_width/3, $QR_height/3, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
			}
		}
		imagepng($QR,$qr_speicherpfad.$qr_dname.".png");
		// imagepng($QR);
		imagedestroy($QR);
	}
}

function demo_loeschen($PHP_BAA_DC,$del_flag) {
	// echo "abc";
	$a_kl=[]; 
	$a_sch=[];
	$a_prot=[];
	$a_wplan=[];
	$a_uebg=[];


	$a_ges=[];
	$sql="SELECT lehrer_id,klasse_id FROM digi_klassen WHERE (lehrer_id>10 AND lehrer_id<60)";
	$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	// echo "ja";
	// array_push($a_ges,"lehrer_id xx");
	while ($row=mysqli_fetch_assoc($rs)) {
		$filt_klasse_id=$row['klasse_id'];

		array_push($a_kl,$row['klasse_id']);

		$sql="SELECT schueler_id FROM digi_schueler WHERE (klasse_id=$filt_klasse_id)";
		$rss=mysqli_query($PHP_BAA_DC,$sql);if (!$rss) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rss)) {
			array_push($a_sch,$row['schueler_id']);
		}	
		mysqli_free_result($rss);		

		$sql="SELECT wplan_id FROM digi_wplan WHERE (klasse_id=$filt_klasse_id);";
		$rss=mysqli_query($PHP_BAA_DC,$sql);if (!$rss) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rss)) {
			$filt_wplan_id=$row['wplan_id'];
			array_push($a_wplan,$row['wplan_id']);

			$sql="SELECT uebung_id FROM digi_uebungen WHERE (wplan_id=$filt_wplan_id)";
			$rsu=mysqli_query($PHP_BAA_DC,$sql);if (!$rsu) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
			while ($row=mysqli_fetch_assoc($rsu)) {
				array_push($a_uebg,$row['uebung_id']);
			}	
			mysqli_free_result($rsu);		
		}	
		mysqli_free_result($rss);		
	}	
	mysqli_free_result($rs);

	//löschen aud der DB
	if (count($a_sch)>0) {
		$in_sch=implode(",",$a_sch);
		$sql="SELECT protok_id FROM digi_protok WHERE (schueler_id IN ($in_sch))";
		$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		while ($row=mysqli_fetch_assoc($rs)) {
			array_push($a_prot,$row['protok_id']);
		}	
		mysqli_free_result($rs);
	}

	$a_ges=[];

	array_push($a_ges,"<br>Klassen: ");
	array_push($a_ges,$a_kl);
	array_push($a_ges,"<br>Schüler: ");
	array_push($a_ges,$a_sch);
	array_push($a_ges,"<br>Protokolle: ");
	array_push($a_ges,$a_prot);
	array_push($a_ges,"<br>Wpläne: ");
	array_push($a_ges,$a_wplan);
	array_push($a_ges,"<br>Übungen: ");
	array_push($a_ges,$a_uebg);


	// $del_flag=0;
	if ($del_flag) {
		foreach ($a_sch as $key => $nr) {
			$fname="../assets/qrcodes/$nr.png";
			if (file_exists($fname)) {
				unlink ($fname);
			}
		}

		// bilder löschen
		$pfad="../assets/uploads/images/";
		$a_tmp=[];
		foreach ($a_uebg as $key => $nr) {
			for ($i = 0; $i<=20; $i++) {
				$fname= $pfad."uebung_{$nr}_{$i}.png";
				if (file_exists($fname)) {
					array_push($a_tmp,$fname);
					unlink ($fname);
				}
			}
		}

		foreach($a_uebg as $key => $pid) {
			$dname=get_bildname($pid,1);
			// file_put_contents('../assets/user_img/baa.txt',$dname."\n",FILE_APPEND);
			if (file_exists($dname)) {
				unlink($dname);
			}
		}



		if (count($a_uebg)>0) {
			$in_list=implode(",",$a_uebg);
			$sql="DELETE FROM digi_uebungen WHERE (uebung_id IN ($in_list))";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}	
	
		if (count($a_wplan)>0) {
			$in_list=implode(",",$a_wplan);
			$sql="DELETE FROM digi_wplan WHERE (wplan_id IN ($in_list))";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}

		if (count($a_kl)>0) {
			$in_list=implode(",",$a_kl);
			$sql="DELETE FROM digi_klassen WHERE (klasse_id IN ($in_list))";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}
		
		if (count($a_sch)>0) {
			$in_list=implode(",",$a_sch);
			$sql="DELETE FROM digi_schueler WHERE (schueler_id IN ($in_list))";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}

		if (count($a_prot)>0) {
			$in_list=implode(",",$a_prot);
			$sql="DELETE FROM digi_protok WHERE (protok_id IN ($in_list))";
			$rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		}
		$a_ges=["ali",count($a_ges),"gelöscht!"];
	} else {
		array_push($a_ges,"<br>Zum Löschen del_flag angeben.");
	}
	echo json_encode($a_ges);
}

?>


