<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"

$hostname_PHP_BAA = "localhost";
$username_PHP_BAA = "db10956965-dc";
$password_PHP_BAA = "baa4mendc";
$projekt_dbname="db10956965-menue4digicase";
// include_once("sani.inc");
$PHP_BAA_DC = mysqli_connect($hostname_PHP_BAA,$username_PHP_BAA,$password_PHP_BAA,$projekt_dbname);

mysqli_query($PHP_BAA_DC,"SET NAMES 'utf8'");
mysqli_query($PHP_BAA_DC,"SET CHARACTER SET utf8");
?>
