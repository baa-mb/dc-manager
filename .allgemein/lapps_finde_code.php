<?php




// $a='//learningapps.org/show.php?id=pbc1axopt24';





// $json_file="https://learningapps.org/data?jsonp=1&id={$id}&version=21";
// $json_file="https://learningapps.org/data?jsonp=1&id=pbc1axopt24&version=21";

$app_liste=explode(",",$_GET['aliste']);
// [34316874,34317074,34317157,34317237,34318558];

$a_sammel=[];
foreach ($app_liste as $key => $value) {
    $json_file="https://learningapps.org/view".$value;
    $htm=file_get_contents($json_file);
    
    $re = '/\'\/\/learningapps\.org\/show\.php\?id=(.{11})\'/m';
    // $str = '\'//learningapps.org/show.php?id=pbc1axopt24\'';
    preg_match_all($re, $htm, $matches, PREG_SET_ORDER, 0);

    // echo "<pre>";
    // print_r($matches[1]);
    // echo $matches[0][1];
    array_push($a_sammel,$matches[0][1]);
}
echo implode(",",$a_sammel);
?>