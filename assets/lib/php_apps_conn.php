<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"

$hostname="localhost";
$username="dbu10956965";
$password="baa4root";
$projekt_dbname="db10956965-apps";

include_once("sani.inc");
$$PHP_BAA_DC = mysqli_connect($hostname,$username,$password,$projekt_dbname) or die(mysqli_error($$PHP_BAA_DC));
mysqli_set_charset($$PHP_BAA_DC,"utf8");

//mysqli_query($$PHP_BAA_DC,"SET NAMES 'utf8'");
//mysqli_query($$PHP_BAA_DC,"SET CHARACTER SET 'utf8'");
?>
