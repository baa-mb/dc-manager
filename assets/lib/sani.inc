<?php
foreach($_GET as &$wert) {
	$wert = filter_var($wert, FILTER_SANITIZE_SPECIAL_CHARS,FILTER_FLAG_STRIP_LOW);
}
foreach($_POST as $key => &$wert) {
	if ($key!="men_html") {
		$wert = filter_var($wert, FILTER_SANITIZE_SPECIAL_CHARS,FILTER_FLAG_STRIP_LOW);
	}
}
?>
