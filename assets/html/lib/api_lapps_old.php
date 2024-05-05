<?php
header("Access-Control-Allow-Origin: * ");

// header('Content-Type: text/html; charset=utf-8');
include_once "php_dc_conn.php";  //mysqli_select_db($PHP_BAA_DC,$projekt_dbname);
$_POST = json_decode(file_get_contents('php://input'), true);

// $data_art=isset($_POST['data_art']) ? $_POST['data_art']:"";
$flag = isset($_POST["flag"]) ? $_POST["flag"]:0;
// file_put_contents("baa.txt",implode(",",$_POST["myArray"]));

$a_ret=[];
switch ($flag) { 
	
	case "save_apps":
        $a_daten = $_POST["daten"];
        // file_put_contents("baa.txt",implode(",",$a_daten));
        foreach($a_daten as $k => $a_wert) {
            // echo $a_wert[1];
            $sql = "INSERT IGNORE INTO lapps_apps (id,title,task,changed,category,subcategory,levels,tags,author,language) ";
            $sql .= "VALUES ('$a_wert[0]','".mysqli_real_escape_string($PHP_BAA_DC,$a_wert[1])."','".mysqli_real_escape_string($PHP_BAA_DC,$a_wert[2])."','$a_wert[3]','$a_wert[4]','$a_wert[5]','$a_wert[6]','$a_wert[7]','$a_wert[8]','$a_wert[9]');";
            $rs = mysqli_query($PHP_BAA_DC, $sql);	if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
        }
		$sql="SELECT * FROM lapps_apps;";
        $rs=mysqli_query($PHP_BAA_DC,$sql);
        if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
            $anz=mysqli_num_rows($rs);
		mysqli_free_result($rs);
        echo $anz;
	break;

	case "get_vs": 
        $level= $_POST["level"];
		$filter_lapps= $_POST["filter_lapps"];

		$filter_str="AND (sstufe>'0' AND sstufe<'5')";

		if ($filter_lapps=="0") {
			$filter_str="";
		}

		$sql="SELECT id,title, task, author,sstufe FROM lapps_apps WHERE language='DE' AND category=2 AND (levels & $level)=$level $filter_str ORDER BY sstufe";
        $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}

		while ($row = mysqli_fetch_assoc($rs)) {
            array_push($a_ret,$row);
		}	
		mysqli_free_result($rs);
		echo json_encode($a_ret);
	break;

	case "set_sstufe": 
        $bst= $_POST["sstufe"];
		$apps_id=intval($_POST["apps_id"]);
	
		$sql="UPDATE lapps_apps SET sstufe='$bst' WHERE id=$apps_id";
		// file_put_contents("baa.txt",$sql);
		$rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
		// echo "saved";
	break;

	// case "set_quest_count": 
	// 	$a_found=[];
	// 	$sql="SELECT id,tool FROM lapps_apps WHERE category=2 AND (sstufe>0 AND sstufe<=9)";
    //     $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
	// 	while ($row = mysqli_fetch_assoc($rs)) {
	// 		array_push($a_found,$row)
	// 	}	
	// 	mysqli_free_result($rs);

	// 	foreach ($a_found as $key => $a_row) {
	// 		if ($a_row['tool']==0) {
	// 			$json_file="https://learningapps.org/data?app={$a_row[0]}";
	// 			$json=file_get_contents($json_file);
	// 			$arr = json_decode($json,TRUE);
				

	// 			if ($arr['Tool']==111) {

	// 			}


	// 			echo "<hr>";
	// 		}
	// 	}


	// break;

	case "zerlegung": 




	break;


	default:
		if (is_array($_POST)) {
			echo "Fehler bei Switch: ".$data_art.implode(",",$_POST);
		} else {
			echo "Fehler bei Switch: -> keine Daten";
		};
}






// function tool_switch ($PHP_BAA_DC,$tool) {
// 	switch ($tool) { 
// 		case 111: //sammlung
// 			$init=$arr['initparameters'];
// 			$urls=rawurldecode($init);
// 			$a_url_var=[];
// 			parse_str($urls,$a_urls_var);

// 			print_r ($a_url_var);
// 			$a_apps_nr=[$id];
// 			foreach ($a_var as $key => $value) {
// 				if (substr($key,0,3)=="app") {
// 					if ($value>" ") {
// 						array_push($a_apps_nr,explode("=",$value)[1]);
// 					}
// 				}
// 			}
	
// 		break;


// 		default:
// 			if (is_array($_POST)) {
// 				echo "Fehler bei Switch: ".$data_art.implode(",",$_POST);
// 			} else {
// 				echo "Fehler bei Switch: -> keine Daten";
// 			};
// 	}
// }




?>


