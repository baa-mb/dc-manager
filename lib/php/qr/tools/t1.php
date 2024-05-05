<?php
//https://phpqrcode.sourceforge.net/examples/index.php

include('../qrlib.php');
QRcode::png('https://orf.at',"../baa.png");


$ourParamId = 1234;
    
// echo '<img src="example_003_simple_png_output_param.php?id='.$ourParamId.'" />';



?>