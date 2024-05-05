
<?php 
    include("../../lib/php_dc_conn.php");
    /*
    load passiert in authoring
    save passiert dc_allgeimein js

    u_id: kommt von bleistift
    biber_id: kommt von biberkarte
    fc_id: kommt von Flashcards

    */
    // echo "<script>alert(1)</script>";exit;

    $quelle= isset($_GET['quelle']) ? $_GET['quelle'] : "";
    if ($quelle=="") exit;

    
    // $quelle="fc";
    // $men_id=23993;

    $html="";
    if ($quelle=="bs") {
        $u_id = (isset($_GET['u_id'])) ? $_GET['u_id'] : 0;
        if ($u_id==0) {
            $html=get_html('0000');
        } else {
            $sql = "SELECT uebung_html FROM digi_uebungen WHERE uebung_id=$u_id";
            $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
            if ($row = mysqli_fetch_assoc($rs)) {
                $html=$row['uebung_html'];
            };
            mysqli_free_result($rs);
            //vielleicht noch Textspeicherung - aber nach dem Speichern dann DB
            if ($html=="") {
                $html=get_html($u_id);
            } else {
                $kommt_von='Datenbank';
            }
        }
        
    } 

    if ($quelle=="fc") {
        $men_id = (isset($_GET['men_id'])) ? $_GET['men_id'] : 0;
        if ($men_id==0) {
            $html=get_html('0000');
        } else {
            $sql = "SELECT men_html FROM menuezeilen WHERE men_id=$men_id";
            $rs = mysqli_query($PHP_BAA_DC, $sql);if (!$rs) { echo mysqli_error($PHP_BAA_DC);echo $sql; exit;}
            if ($row = mysqli_fetch_assoc($rs)) {
                $html=$row['men_html'];
            }
            mysqli_free_result($rs);
            $kommt_von='Flashcards';
        }
    }  

    // echo "<script>console.log('".$sql."')</script>";



function get_html($nr) {
    $ret="";
    $datei="../user_img/u_".$nr.".txt";
    if (file_exists($datei)) {
        $ret=file_get_contents($datei);
    }
    return $ret;    
}

?>



<!DOCTYPE html>
<html lang="en">

<head>
    <!-- wird nur für editor benötigt -->
    <base href="https://baa.at/projekte/dc/lib/">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script src="js/ckeditor4/ckeditor.js"></script>
    <script src="js/quest/authoring.js"></script>

<script>
    edit_mode = 1; // ist nicht der chkeditor_mode
    prg = "dcm";
    var close_frage = false;

    //wichtig
    var html = <?php echo json_encode($html); ?>;

    // window.parent.xxxshow_zuweis_gruen(0);
    $(document).ready(function () {
        // analyse_nach_dem_laden($("body"), 0);
        if (html.includes("mcard")) {
            html=nach_dem_laden_mcard(html);
        } else {
            html=nach_dem_laden(html);
        }   
        //init_antworten(edit_mode)
    });
    
    var editor = 0;
    window.onload = function() {
        CKEDITOR.replace('edit_area', {
            uiColor: '#9AB8F3'
        });
        CKEDITOR.on('instanceReady', function(evt) {
            editor = evt.editor;
            editor.execCommand('maximize');
            editor.setData(html);
            // hole_htm_php(editor);
            // editor.setMode( 'wysiwyg' );

            editor.on('fileUploadRequest', function(evt) {
                // console.log(result)
                
                let upload_name=evt.data.requestData['upload'].name;
                // console.log('uploadname:',upload_name)
                if (upload_name=='image.png') {
                    // alert("upload: "+evt.data.requestData['upload'].name);
                    let tmp=editor.getData();
                    let result = tmp.match(/<img/g);
                    let nr=0;
                    if (result!=null) {
                        nr=result.length ;
                    }
                    console.log('länge:',result,nr)
                    // Copy contents of 'upload' image field to a new field with 'new_name'
                    let uid = parent.akt_uebung_id;
                    // let ur_dname = prompt("Das zu speichernde Bild erhält den Namen:", "uebung_" + uid + "_" + nr);
                    upload_name="uebung_" + uid + "_" + nr*2;
                    evt.data.requestData['upload'].name = upload_name + ".png";
                } else {
                    upload_name=name_konvert_unix(upload_name);
                    evt.data.requestData['upload'].name = upload_name;
                }
                console.log('uploadname:',upload_name)
                // evt.data.requestData['upload'].name = "uebung_" + uid + ".png";
            });
        });
    };

    function name_konvert_unix(fname) {
      
        fname=fname.toLowerCase();

        const chars = {
            'ä': 'a',
            'ö': 'o',
            'ü': 'u',
            'ß': 's',
            '$': '_',
            '&': '_',
            '=': '_'
        };

        fname = fname.replace(/[äöüß$&=]/g, m => chars[m]);
        return (fname.replace(/\s+/gm,"_"));
    } 


    function send_von_aussen() {
        // window.parent.txt_to_server(editor);
        // document.getElementById("uebg_id").value = uid;
        // document.getElementById("edit_form").submit();
        // $("#uebg_id").val(uid);
        // editor.execCommand('save');
    }

    $(window).bind('beforeunload', function(Event) {
        if (close_frage) {
            return "Seite wirklich verlassen!";
        }
    });
</script>
    
<style>
    body {
        /* margin: 1%;
        margin-top: 8%; */
        /* background: white; */
        background: transparent;
        width: 100%;
        margin: 0;
        padding: 1% 5%;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        font-size: 1.5rem;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        display: flex;
        flex-direction: row;
    }
    
    hr {
        margin-top: 7em;
    }
</style>

</head>
<body>
    <form id="edit_form">
        <input type="hidden" name="uebg_id" id='uebg_id' value="4444">
        <textarea id="edit_area" name="edit_area">
        </textarea>
        <input type="submit" value="... loading ...">
    </form>

</body>

</html>



