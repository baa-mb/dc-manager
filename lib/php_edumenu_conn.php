<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"

$hostname_PHP_BAA = "localhost";
$username_PHP_BAA = "db10956965-men";
$password_PHP_BAA = "baa4menue";
$projekt_dbname="db10956965-menue";
include_once("sani.inc");
$PHP_BAA = mysqli_connect($hostname_PHP_BAA,$username_PHP_BAA,$password_PHP_BAA,$projekt_dbname);

mysqli_query($PHP_BAA,"SET NAMES 'utf8'");
mysqli_query($PHP_BAA,"SET CHARACTER SET utf8");
?>
