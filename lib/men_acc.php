<?php
// header("Access-Control-Allow-Origin: *");
include("men_vorspann.php")
?>
<!DOCTYPE html>
<html>
<head>
    <title>BAA-MENU 2.0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <meta http-equiv="Cache-Control" content="must-revalidate">

    <!-- <link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css"> -->
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/4.3.1/materia/bootstrap.min.css"> -->
    <!-- <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous"> -->

    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/bahnschrift" rel="stylesheet">

    <link rel="stylesheet" type="text/css" href="men_acc.css" />

    <!-- <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> -->
    <script src="https://code.jquery.com/jquery-3.6.3.min.js"></script>
    <!-- <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script> -->

    
    <script type="text/javascript" src="men_acc.js"></script>
    <script type="text/javascript" src="men_opener.js"></script>



    <style type="text/css">
        /* * {box-sizing: border-box}   */
        ::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px grey;
            border-radius: 3px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: red;

            background: #ccc;


            border-radius: 3px;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: green;
        }


        body {
            /* background:#333; */
            background: var(--men_background);
            margin:0;padding:0;
            font-size:0.8em;
            /* font-family: Verdana, Geneva, Tahoma, sans-serif; */
            /* font-weight: bold; */
            font-family: "Roboto";
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            /* font-family: 'Bahnschrift', sans-serif;                       */
            overflow-x:hidden;
            overflow-y:scroll;
            width:99.0%;
            /* width:50%; */
            height:99vh;
            color:white;
        }
        
        .container {
            width:100%;
            height:100vh;
            /* border:4px solid blue;  */
        }

        header {
            cursor: pointer;
            width: 99%;
            text-align: center;
            /* border:1px solid green; */
            
        }
        
        header #header_icons {
            box-sizing:border-box;
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 8px 12px; 
             
            /* padding:8px 12px; */
            /* background: #aaa; */
            /* color:white; */
            /* border:1px solid white; */
        }
        header #header_icons img {
            /* margin:0 6px; */
            height:1.4em;
            width:1.4em;
            /* border:1px solid red; */
        }    
        
        header input {
            width: 80%;
            box-shadow: 0 0 8px #888;
            background: #333;
            color: white;
            text-align: center;
            padding: 4px;
            margin: 2px;
            border:none;
            border-radius:6px;
        }
        
        .hi {
            font-size: 1.2em;
        }

    </style>

    <script>
        var a_men_liste = <?php echo json_encode($men_liste); ?>;
    </script>    
    <script type="text/javascript" src="men_maker.js"></script>
</head>
<?php $ipfad="../assets/icons/";  ?>

<body>
    <div class="container">
        <!-- <div id="men_menue"> -->
            <header>
                <div id="header_icons">
                    <img src='<?=$ipfad;?>home_white.png' onclick='location.reload(1)'>
                    <!-- <img src='<?=$ipfad;?>cloud_white.png' onclick='location.reload(1)'> -->
                    <img src='<?=$ipfad;?>pg_li.png' onclick='set_theme(-1)'>
                    <img src='<?=$ipfad;?>pg_re.png' onclick='set_theme(-2)'>
                    <img src='<?=$ipfad;?>lock_white.png' onclick='last_open_id(3)'>
                    <img src='<?=$ipfad;?>terminal_white.png' onclick='last_open_id(126)'>

                    <img src='<?=$ipfad;?>videocam_white.png' onclick="set_theme(1)">
                    <img src='<?=$ipfad;?>edit_white.png'>

                    <!-- <div style="transform: rotate(180deg);" class="material-icons hi" onclick="set_theme(-1)">play_circle</div>
                    <div class="material-icons hi" onclick="set_theme(0)">play_circle</div>

                    <div class="material-icons hi" onclick="set_theme(1)">cloud</div>

                    <div class="material-icons hi">video_camera_front</div>
                    <div class="material-icons hi">edit</div> -->
                </div>
                <input id="such_ress" type="text" maxlength="3" placeholder="???">
                <img id="logo" src="<?=$ipfad;?>digi-case_b.png">
            </header>

            
            <!-- <nav class="my_menu"> -->
                <ul class="navbar" id="navbar">
                </ul>
            <!-- </nav> -->
        <!-- </div> -->
    </div>
    <input type="hidden" id='php_var' men_user_kzz='<?=$men_user_kzz;?>' >
</body>
</html>

