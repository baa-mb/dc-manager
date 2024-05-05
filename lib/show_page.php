<?php
    echo "<html><head><meta charset='UTF-8'>";

    $art="htm";
    $a_f=array();

    $u_id=0; $la_id=0;
    $datei = isset($_GET['datei_url']) ? $_GET['datei_url']:"";
    
    if (isset($_GET['u_id'])) {
        $u_id=intval($_GET['u_id']);
    }
    
    if (isset($_GET['la_id'])) {
        $la_id=intval($_GET['la_id']);
        $art="lapps";
    }
    // $akt_nr=$u_id;
    // echo "<button onclick='drucken()'>Drucken</button>";
    
    if (str_contains($datei,".png")) {
        $art="img";

    // } else if (str_contains($datei,".pdf")) {
    //     $art="img";
    } elseif ($art=="lapps") {
        include("php_dc_conn.php");
        $sql = "SELECT max_pt,tool FROM lapps_apps WHERE id=$la_id";
        $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
        $anz=0;
        $tool=0;
        if ($row = mysqli_fetch_row($rs)) {
            $anz=$row[0];
            $tool=$row[1];
        }
        mysqli_free_result($rs);
        echo "<script>window.parent.max_pt=$anz;window.parent.tool=$tool;</script>";

        echo "<script>var pnr=$la_id</script>";

        $add_css="";
        if (in_array($tool,[74,270])) {
           $add_css="&cssString=".rawurlencode("#checkSolutionBtn{display:block !important}");
        }
        

        $css_adr = rawurlencode("https://baa.at/projekte/dc/lib/styles/lapps_edit_extern.css");
        // $css_adr = "https://baa.at/projekte/dc/lib/styles/lapps_edit_extern.css";
        $src = "https://learningapps.org/watch?app=$la_id&v=px3wnnzk516&css=$css_adr".$add_css;
        // echo "<script>console.log('$src')</script>";
        // $src = "https://learningapps.org/watch?app=$akt_nr";

    } else {
        //normaler u_...txt
        $re='/(.*u_([0-9]+))(\.txt)/';
        $subst = "$2";
        $u_id = intval(preg_replace($re, $subst, $datei));
               
        if ($u_id>0) {
            include("php_dc_conn.php");
            $html="";
            $sql = "SELECT uebung_html FROM digi_uebungen WHERE uebung_id=$u_id";
            $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
            if ($row = mysqli_fetch_row($rs)) {
                // echo $row[0]."<hr>".strlen($row[0]);
                $html=$row[0];
            }
            mysqli_free_result($rs);
            
            if (strlen($html)==0) {
                $html=file_get_contents($datei);
            } 
            if (strpos($html,"=[")>-1) {
                $html=formel_parser($html,$a_f,1);
            }
        }
    }   
    //nur für den container hier zuständig
    echo "<link rel='stylesheet' href='styles/rtime_".$art.".css'>";
    
?>     
    <script>
        function drucken() {
            window.print()
        }
    </script>
</head>

<?php

$base_baa="https://baa.at/projekte/dc";

echo "<body>";
    if ($art=="img") {
        echo "<img src='$datei'/>";
    } elseif ($art=="lapps") {
        echo "<div id='AppTitle' onclick='ues_hide(this)'></div>";
        echo "<iframe id='ifr_learningApps' src='$src'></iframe>";
        echo "<div id='AppResults' onclick='ues_hide(this)'></div>";
    } else {    
        echo $html;
    }
echo "</body>";

if ($art=='htm') {
    if (str_contains($html,"eAntw") || (str_contains($html,"keywort")) ) {
        echo "<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>";
        echo "<script src='https://code.jquery.com/ui/1.13.2/jquery-ui.min.js'></script>";
        echo "<script src='js/touch/jq_touch.js'></script>";
        echo "<script src='js/quest/runtime.js'></script>";
    }
}

if ($art=="lapps") {
    // echo "<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>";
    // $src = "https://learningapps.org/watch?app=$akt_nr";
    // echo "<script>document.getElementById('ifr_learningApp').setAttribute('src', '$src');</script>";
    echo "<script src='js/show_lapps.js'></script>";
}
?>
</html>


<?php


function formel_parser($txt,&$a_f,$a_f_samm) {
	$txt=preg_replace("@=(\[f\d+\])@", "=[\$1]", $txt); //
	$feldMask="\[(f\d+)\]"; //ersetze die eckigen klammern
	$txt=preg_replace("@".$feldMask."@", "{\$1}", $txt);

	$a_funkt=parser2($txt);

	$zahlMask="\-?\d+";
	$feldMask_neu="\{(f\d+)\}";
	$a_search=array(".",",",";",":");$a_replace=array("*",".",",","/");

	foreach ($a_funkt[1] as $ind=>$eine_funktion) {
		$funkt=$eine_funktion;

		if (preg_match_all("@".$feldMask_neu."@", $funkt, $a_felder)) {
			$a_ersatz=array();
			foreach ($a_felder[0] as $feld) {
				preg_match("@".$zahlMask."@", $feld, $a_nr);
				$funkt=str_replace("{f".$a_nr[0]."}",$a_f[$a_nr[0]-1],$funkt);
			}
		}
		$rechStr=str_replace($a_search,$a_replace,$funkt);

		try {
			$ev=eval("return ".$rechStr.";");
		} catch (ParseError $e) {
			$ev="return 1"; //fehelr
			file_put_contents("baa_error",$rechstr);
			exit;
		}


		$ev=str_replace(".",",",$ev);
		if ($a_f_samm) {
			array_push($a_f,$ev);
			// file_put_contents("baa.txt",implode(",",$a_f)."\n",FILE_APPEND);
		}

		// $ev=str_replace(".",",",$ev);
		// file_put_contents("baa.txt",$ev);

		//echo "<hr> ".$eine_funktion." ev=".$ev;
		$txt=str_replace_first("=[".$eine_funktion."]",$ev,$txt);
		//$txt=str_replace("=[".$eine_funktion."]",$ev,$txt);
		//echo " txt=".$txt;
	}
	return $txt;
}

function str_replace_first($from, $to, $content) {
    $from = '/'.preg_quote($from, '/').'/';
    return preg_replace($from, $to, $content, 1);
}

function str_replace_first_old($search,$replace,$subject) {
    $pos = mb_strpos($subject, $search);
    if ($pos !== false) {
        return substr_replace($subject, $replace, $pos, strlen($search));
    } else {
        return $subject;
    }
}

function parser2 ($txt) {
	preg_match_all("@=\[(.*?)\]@", $txt, $a_par);
	return ($a_par);
}

function sum() {
	$a_Args = func_get_args();
	$ret=0;
	foreach($a_Args as $arg){
		$ret=$ret+$arg;
	}
	return ($ret);
}
function add($a,$b) {
	$a_Args = func_get_args();
	$ret=0;
	foreach($a_Args as $arg){
		$ret=$ret+$arg;
	}
	return ($ret);
}
function diff($a,$b) {
	return ($a-$b);
}
function sub() {
	$a_Args = func_get_args();
	$ret=$a_Args[0];
	foreach($a_Args as $i=>$arg){
		if ($i>0) {
			$ret=$ret-$arg;
		}
	}
	return ($ret);
}
function mult() {
	$a_Args = func_get_args();
	$ret=1;
	foreach($a_Args as $arg){
		$ret=$ret*$arg;
	}
	return ($ret);
}
function div($a,$b) {
	if ($b==0) {
		return (0);
	} else {
		return ($a/$b);
	}
}
function zuf($a,$b) {
	if (func_num_args()>2) {
		$a_Args = func_get_args();
		return ($a_Args[rand(0,func_num_args()-1)]);
	} else {
		return (rand($a,$b));
	}
}
function rnd($a,$b) {
	if (func_num_args()>2) {
		$a_Args = func_get_args();
		$w=func_num_args()-1;
		return ($a_Args[rand(0,$w)]);
	} else {
		return (rand($a,$b));
	}
}
function pot($a,$b) {
	return (pow($a,$b));
}
function wurz($a,$b) {
	$w=1/$b;
	return (pow($a,$w));
}

function rest($a,$b) {
	return ($a % $b);
}

function format($a,$dez=0) {
	return (number_format($a,$dez,","," "));
}


function repl_bindestrich($txt) {
	//gefährlich
	// if (strpos($txt,"-")>-1) {
	// 	$search="/(?<=[a-z])-{1}(?=[a-z])/";
	// 	$txt=preg_replace($search,"",$txt);
	// }
	return $txt;
}
?>
