<?php
header("Access-Control-Allow-Origin: * ");
header('Content-Type: text/html; charset=utf-8');
// header('Content-Type: text/html; charset=utf-8');
include_once "php_dc_conn.php";  //mysqli_select_db($PHP_BAA_DC,$projekt_dbname);
$_POST = json_decode(file_get_contents('php://input'), true);

// $data_art=isset($_POST['data_art']) ? $_POST['data_art']:"";
$flag = isset($_POST["flag"]) ? $_POST["flag"]:0;
// file_put_contents("baa.txt",implode(",",$_POST["myArray"]));

if ($flag==0) {
	$flag=$_GET['flag'];
}

$a_ret=[];
switch ($flag) { 
	
	case "save_apps":
        $a_daten = $_POST["daten"];
		// echo $a_daten;
        // file_put_contents("baa.txt",implode(",",$a_daten));
        // file_put_contents("baa.txt",$a_daten);
        foreach($a_daten as $k => $a_wert) {
            // echo $a_wert[1];
            $sql = "INSERT IGNORE INTO lapps_apps (id,guid,title,task,changed,category,subcategory,levels,tags,author,language,sstufe) ";
            $sql .= "VALUES ($a_wert[0],'$a_wert[11]','".mysqli_real_escape_string($PHP_BAA_DC,$a_wert[1])."','".mysqli_real_escape_string($PHP_BAA_DC,$a_wert[2])."','$a_wert[3]','$a_wert[4]','$a_wert[5]','$a_wert[6]','$a_wert[7]','$a_wert[8]','$a_wert[9]',$a_wert[10]);";
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

		$sql="SELECT id,title, task, author,sstufe,max_pt FROM lapps_apps WHERE language='DE' AND category=2 AND (levels & $level)=$level $filter_str ORDER BY sstufe";
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

	case "make_analyse": 
		$a_found=[];
		// $sql="SELECT id,tool FROM lapps_apps WHERE category=2 AND (sstufe>0 AND sstufe<=9) ORDER BY sstufe";
		$sql="SELECT id,guid,tool FROM lapps_apps WHERE tool=0 AND category=2 AND (sstufe>0 AND sstufe<=9) ORDER BY zeit desc";
        $rs=mysqli_query($PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($PHP_BAA_DC);exit;}
		while ($row = mysqli_fetch_assoc($rs)) {
			array_push($a_found,$row);
		}	
		mysqli_free_result($rs);

		echo "Anzahl:".count($a_found)."<br>";
		$anz=count($a_found);
$beginn=0;
// $anz=10;
$a_found=array_slice($a_found,$beginn,$anz);

		// print_r($a_found);
		foreach ($a_found as $key => $a_row) {
			if ($a_row['tool']==0) {
				// echo $a_row['id']."<br>";
				if ($a_row['guid']>" ")  {
					$json_file="https://learningapps.org/data?id={$a_row['guid']}";	
				} else {
					$json_file="https://learningapps.org/data?app={$a_row['id']}";
				}
			 	$json=file_get_contents($json_file);
			 	$arr = json_decode($json,TRUE);
				// echo "<br>erg".$json_file;
				// echo "<br>erg".$arr['initparameters'];

	 		 	$init=$arr['initparameters'];
			 	$tool=$arr['tool'];
				$version=$arr['version'];
				// $path=$arr['path'];

				// $url=rawurldecode($init);
				// $a_var=[];
				// parse_str($url,$a_var);
				// p_r($a_var);							
				// exit;

				tool_switch($PHP_BAA_DC,$a_row['id'],$tool,$version,$init,$a_row['id']);

				// p_r ($arr);
			 	

			// 	// echo "<hr>";
			}
		}
		echo "<br>fertig";
	break;

	case "zerlegung": 




	break;


	default:
		if (is_array($_POST)) {
			echo "Fehler bei Switch: ".$data_art.implode(",",$_POST);
		} else {
			echo "Fehler bei Switch: -> keine Daten";
		};
}


function p_r($arr) {
	echo "<pre>";
	print_r($arr);
	echo "</pre>";

}

function tool_switch ($PHP_BAA_DC,$id,$tool,$version,$init) {
	echo "tool:".$tool." - ".$version." - $id<br>";
	$url=rawurldecode($init);
	$a_var=[];
	parse_str($url,$a_var);
	$max_anz=0;

	$a_apps_nr=[];
	if ($tool==111) { //sammlung aufspalten
		$i=0;
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			if (substr($key,0,3)=="app") {
				array_push($a_apps_nr,explode("=",$value)[1]);
				$i++;
			}
		}
		echo "<hr>";
		$max_anz=$i;
		if ($i>0) {
			sammlung_oeffnen ($PHP_BAA_DC,$a_apps_nr,$id);
		}

	}

	if ($tool==5) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>$key: ".$value."\n";
			$a_k=explode("_",$key);
			if ($key[0]=="v" && strlen($key)<6) {
				if ($value>" ") {
					$max_anz++;
				}
			}
		}
	}

	if ($tool==71) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>$key: ".$value."\n";
			$a_k=explode("_",$key);
			if ($a_k[0][0]=="v" && strlen($key)<6) {
				if ($value>" ") {
					$max_anz=$a_k[1];
				}
			}
		}
	}
	if ($tool==72) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>$key: ".$value."\n";
			$a_k=explode("_",$key);
			if ($a_k[0][0]=="v") {
				if ($value>" ") {
					if(count($a_k)==2) {
						$max_anz=intval(substr($a_k[0],1,2));
					}
					
				}
			}
		}
	}

	if ($tool==74) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>$key: ".$value."\n";
			// $a_k=explode("_",$key);
			if (substr($key,0,7)=="content") {
				if ($value>" ") {
						$max_anz=intval(substr($key,7,2));
					
				}
			}
		}
	}

	if (in_array($tool,[83])) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>>$key< >".$value."<\n";
			$a_k=explode("pos",$key);
			if (substr($key,-3)=="pos") {
				if ($value>" ") {
					$max_anz=intval(substr($a_k[0],1,2));
				}
			}
		}
	}



	if (in_array($tool,[103,77,143,105])) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>$key: ".$value."\n";
			$a_k=explode("_",$key);
			if (substr($a_k[0],0,6)=="answer") {
				if ($value>" ") {
					$max_anz=intval(substr($a_k[0],6,2));
				}
			}
		}
	}

	if ($tool==124) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>>$key< >".$value."<\n";
			$a_k=explode("_",$key);
			if ($a_k[0]=="content") {
				if ($value>" ") {
					$max_anz=intval(substr($a_k[1],1));
				}
			}
		}
							
	}

	if ($tool==270) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>>$key< >".$value."<\n";
			$a_k=explode("_",$key);
			if ($a_k[0]=="content") {
				if ($value>" ") {
					$max_anz=intval($a_k[1]);
				}
			}
		}
	}

	if (in_array($tool,[148,551])) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>>$key< >".$value."<\n";
			$a_k=explode("_",$key);
			if ($a_k[0]=="content") {
				if ($value>" ") {
					$max_anz=intval($a_k[1]);
				}
			}
		}
	}

	if (in_array($tool,[86])) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>>$key< >".$value."<\n";
			if (substr($key,0,7)=="cluster") {
				if ($value>" ") {
					$max_anz=intval(substr($key,7,2));
				}
			}
		}
	}

	if (in_array($tool,[808,809,109])) {
		$a_apps_nr=[$id];
		foreach ($a_var as $key => $value) {
			// echo "<pre>>$key< >".$value."<\n";
			if (substr($key,0,7)=="cluster") {
				if ($value>" ") {
					$max_anz=intval(substr($key,7,2));
				}
			}
		}
		$max_anz=-1;
	}

	if (in_array($tool,[1030,1042,1019,148,287])) {
		$a_apps_nr=[$id];
		$tool=-$tool;
		$max_anz=99;
	}


	echo "max: $max_anz <hr>";
	if ($max_anz<=0) {
		echo $init;
		echo $url;
		print_r ($a_var);

		foreach ($a_var as $key => $value) {
			echo "<pre>>$key< >".$value."<\n";
		}
		echo "<h2><a href='https://learningapps.org/view{$id}' target='_blank'>Aufruf {$tool}</a></h2>";
		// exit;
	} else {
		$sql="UPDATE lapps_apps SET tool=$tool,max_pt=$max_anz WHERE id=$id";
		// file_put_contents("baa.txt",$sql);
		$rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}

	}
	

}

function sammlung_oeffnen ($PHP_BAA_DC,$a_apps_nr,$id=0) {
	// $a_apps=[];
	p_r($a_apps_nr);
	// echo "id=".$id;exit;
	$a_neu_apps=[];
	foreach ($a_apps_nr as $key => $wert) {
		if (is_numeric($wert)) {
			$src = "https://learningapps.org/api.php?getappbyid=$wert";
		} else {
			$src = "https://learningapps.org/api.php?getappbyguid=$wert";
		}

		$xml = simplexml_load_file($src);
		// print_r ($xml);

		// echo strlen($xml);

		$json = json_encode($xml);
		$app = json_decode($json,TRUE);
		
		// echo "ergeb:<br>";
		// p_r ($app);

		$a_wert=$app['app']['@attributes'];
		// echo "eine app<br>";
		// p_r ($a_wert);
		// echo "<br>-------------<br>";

		if (($key==0) && ($id!=1)) {
			$category_0     =$a_wert['category'];
			$subcategory_0  =$a_wert['subcategory'];
			$levels_0       =$a_wert['levels'];
		} else {
			if ($id==1) { //einlagern von bischof
				$category_0     =$a_wert['category'];
				$subcategory_0  =$a_wert['subcategory'];
				$levels_0       =$a_wert['levels'];
			}

			$arr = [$a_wert['id'], $a_wert['title'], $a_wert['task'], $a_wert['changed'], $category_0, $subcategory_0, $levels_0, $a_wert['tags'], $a_wert['author'], $a_wert['language']];
			array_push($a_neu_apps,$arr);
			// p_r($arr);
			// echo "<hr>sammel: ==============================================================<hr>";
			// p_r($arr);
		}
	}

	foreach($a_neu_apps as $k => $a_wert) {
		$sql = "INSERT IGNORE INTO lapps_apps (id,title,task,changed,category,subcategory,levels,tags,author,language) ";
		$sql .= "VALUES ('$a_wert[0]','".mysqli_real_escape_string($PHP_BAA_DC,$a_wert[1])."','".mysqli_real_escape_string($PHP_BAA_DC,$a_wert[2])."','$a_wert[3]','$a_wert[4]','$a_wert[5]','$a_wert[6]','$a_wert[7]','$a_wert[8]','$a_wert[9]');";
		// echo $sql;
		$rs = mysqli_query($PHP_BAA_DC, $sql);	if (!$rs) { echo mysqli_error($PHP_BAA_DC).$sql;  exit;}
	}
	$sql="SELECT * FROM lapps_apps;";
	$rs=mysqli_query($PHP_BAA_DC,$sql);
	if (!$rs) {echo $sql . mysqli_error($PHP_BAA_DC);exit;}
		$anz=mysqli_num_rows($rs);
	mysqli_free_result($rs);
	echo "<br>Anzahl: ".$anz;

}




?>


