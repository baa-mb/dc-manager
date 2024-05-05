<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"

$hostname="localhost";
$username="dbu10956965";
$password="baa4root";

// include_once("sani.inc");
$PHP_BAA_BB4 = mysqli_connect($hostname,$username,$password,"db10956965-menue");
$PHP_BAA_DC = mysqli_connect($hostname,$username,$password,"db10956965-menue4digicase");
$PHP_BAA_DOM = mysqli_connect($hostname,$username,$password,"db10956965-dcbm");


// mysqli_query($PHP_BAA,"SET NAMES 'utf8'");
// mysqli_query($PHP_BAA,"SET CHARACTER SET utf8");
?>
