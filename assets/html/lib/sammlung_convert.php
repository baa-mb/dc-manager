<?php
// header("Access-Control-Allow-Origin: * ");
header('Content-type: text/plain; charset=utf-8');
if (!isset($_GET['id'])) {
    $id=0;
} else {
    $id=intval($_GET['id']);
}

$json_file="https://learningapps.org/data?app={$id}";
echo $json_file;
$json=file_get_contents($json_file);
// echo $json;


$array = json_decode($json,TRUE);
// echo "<pre>";

$init=$array['initparameters'];
$url=rawurldecode($init);
$a_var=[];
parse_str($url,$a_var);
// print_r (parse_url($url,PHP_URL_QUERY));

// print_r ($a_var);
$a_apps_nr=[$id];
foreach ($a_var as $key => $value) {
    if (substr($key,0,3)=="app") {
        array_push($a_apps_nr,explode("=",$value)[1]);
        // echo $value."\n";
    }
    # code...
}
echo "<hr>";

// print_r ($array);

// $xml = simplexml_load_file($xml_string);
if ($id==1) {
    //schulstufe 1
    $a_apps_nr=[34115651,34112136,34112242,34114248,34112763,34112796,34114266,34112886,34112921,34112991,34113058,34113079,34113250,34114412,34114441];
    //schulstufe 2
    $a_apps_nr=[34115989,34114514,34114754,34114818,34113207,34113250,34113319,34113355,34113397,34113446,34113564,34113660,34113702];
    $a_apps_nr=[34117435,34117414,34117432,34117426];

    $a_apps_nr=[34117435,34117414,34117432,34117426];


    

    $a_apps_nr=[34115168,34115256,34115280,34115318,34115738,34116116,34115963,34116016,34116058];
    


}
print_r($a_apps_nr);

$a_apps=[];
foreach ($a_apps_nr as $key => $wert) {
    if (is_numeric($wert)) {
        $src = "https://learningapps.org/api.php?getappbyid=$wert";
    } else {
        $src = "https://learningapps.org/api.php?getappbyguid=$wert";
    }

    $xml = simplexml_load_file($src);
    print_r ($xml);

    // echo strlen($xml);

    $json = json_encode($xml);
    $app = json_decode($json,TRUE);
    
    // echo "ergeb:<br>";
    // print_r ($array);

    $a_wert=$app['app']['@attributes'];
    echo "eine app\n";
    print_r ($a_wert);
    echo "-------------\n";

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
        print_r($arr);
        array_push($a_apps,$arr);
    }
}

include_once "php_dc_conn.php";
foreach($a_apps as $k => $a_wert) {
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
echo "Anzahl: ".$anz;

// print_r($a_apps);


?>