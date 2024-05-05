<html>
<head>
	<style>

		body {
			font-family:Courier;
		}
	</style>
</head>


<?php
include_once("../../php_edumenu_conn.php");  //mysqli_select_db($$PHP_BAA_DC,$projekt_dbname);

$flag="digi.case.dlpl";

//echo $_SERVER["REMOTE_ADDR"]."<br>";



$sql="SELECT EXTRACT(YEAR  FROM zeit) year, EXTRACT(MONTH FROM zeit) month , EXTRACT(DAY FROM zeit) day , Count(lfdnr) anz ";

$sql="SELECT prgart,left(zeit,10) datum , Count(lfdnr) anz, zeit ";
$sql.="FROM men_logbuch ";
$sql.="WHERE (prgart='digi.case.dlpl') ";

$sql.="GROUP BY EXTRACT(YEAR  FROM zeit), EXTRACT(MONTH FROM zeit), EXTRACT(DAY FROM zeit) ";
$sql.="ORDER BY lfdnr DESC  ";



echo "<h2>Zugriffe: digi.case.dlpl.at</h2>";
// $sql="SELECT lfdnr,prgart,ipadresse,zeit FROM men_logbuch WHERE prgart='$flag' ORDER BY lfdnr DESC LIMIT 3000";
$rs=mysqli_query($$PHP_BAA_DC,$sql);if (!$rs) {echo $sql.mysqli_error($$PHP_BAA_DC);exit;}
while ($row = mysqli_fetch_row($rs) ) {
	if ($row[1]!="baa54") {
		//printf ("%'".chr(160)."16s | %05d  | %'".chr(160)."16s | %'+15s",$row[3],$row[0],$row[1],$row[2]);
		//print_r ($row);

		$d=strtotime($row[1]);
		$bold=""; $unbold="";
		if (date("w",$d)=="0") {
			$bold="<br><b>";
			$unbold="</b>";
		}
		echo $bold.$row[0].".at  ".date("D M-d-Y",$d).": ".str_repeat("#",round($row[2]/10))." ".$row[2].$unbold ;
		echo "<br>";
	}
	
};
mysqli_free_result($rs);

?>

</html>