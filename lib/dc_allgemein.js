
var akt_theme = 0;
var prg = "";
let a_themes = ['sunny', 'black-tie', 'blitzer', 'cupertino', 'dark-hive', 'dot-luv', 'eggplant', 'excite-bike', 'flick', 'hot-sneaks', 'humanity', 'le-frog', 'mint-choc', 'overcast', 'pepper-grinder', 'smoothness', 'south-street', 'start', 'base', 'swanky-purse', 'trontastic', 'ui-darkness', 'ui-lightness', 'vader'];
let a_theme_ausnahmen = [1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
function load_theme(prg) {

    if (getCookie(prg + "akt_theme") != "") {
        let tmp = getCookie(prg + "akt_theme");
        // console.log(tmp, a_theme_ausnahmen);
        if (!a_theme_ausnahmen.includes(Number(tmp))) {
            // console.log(tmp, a_themes[tmp]);
            document.write("<link id='t_theme' rel='stylesheet' href='//code.jquery.com/ui/1.13.2/themes/" + a_themes[tmp] + "/jquery-ui.css'>");
        } else {
            document.write("<link id='t_theme' rel='stylesheet' href='//code.jquery.com/ui/1.13.2/themes/sunny/jquery-ui.css'>");
        }
    } else {
        document.write("<link id='t_theme' rel='stylesheet' href='//code.jquery.com/ui/1.13.2/themes/sunny/jquery-ui.css'>");
    }
}

var sk_x0, sk_y0, sk_br, sk_ho, sk_men_br;
var sk_rnd = 0;
var win_w, win_h;
const heute = new Date();
const heute_datum = heute.toLocaleDateString();

function change_theme(nr = -1) {
    if (nr == -1) {
        if (getCookie(prg + "akt_theme") != "") {
            akt_theme = getCookie(prg + "akt_theme");
        }
        akt_theme = (Number(akt_theme) + 1) % a_themes.length;
    } else {
        akt_theme = nr;
    }
    setCookie(prg + "akt_theme", akt_theme);
    location.reload(0);
}


var akt_lehrer_id = 0;
var akt_klasse_id = 0;

var akt_schueler_id = 0;
var akt_wplan_id = 0;
var akt_uebung_id = 0;
var akt_schueler_name = "";

var protok_wplan_id_save = 0;
// var protok_save_flag = false;

var startzeit = 0;

// var akt_l_id=0; //weil akt_lehrer.id=333 nicht funktioniert


// var schueler_alle = [];
// var uebungen_alle = [];


[win_w, win_h] = get_window_size();

const leer_adr = "../assets/html/hgbild.html";

const leer_blatt = "../assets/html/leer_blatt.html";
const leer_zeilen = "../assets/html/leer_zeilen.html";
const leer_karo = "../assets/html/leer_karo.html";
const leer_text = "../assets/html/leer_text.html";
const leer_html = "../assets/html/leer_html.php?u_id=0&quelle=bs";

function add_theme() {
    let $platz = $("#cont_theme");
    $platz.append("<p>Wähle deine Programmfarbe (Empfehlung: 0 oder 11 oder probiere aus, was dir gefällt):</p>");
    for (let i = 0; i < 24; i++) {
        if (!a_theme_ausnahmen.includes(i)) {
            $platz.append(`<button class='farb_butt ui-button' style='background-image:url(../assets/icons/${i}.png)' onclick='change_theme(${i})'>${i}</button>`);
        }
    }
    // if (prg == "dcm") {
    $platz.append("<p>Projektteam digi.case (2024): Technik: Alois Bachinger, PHDL; Didaktische Analyse und Beratung: Inge Bischof, VS Treffling.</p>");
    // }
}





function getRandomInt(max) { /* inkl */
    return Math.floor(Math.random() * max);
}


var last_blinker = "";
function blinking_button_text(starte, elem = "#u_save") {

    if (elem != last_blinker) {
        if (int_blink != 0) {
            clearInterval(int_blink);
            int_blink = 0;
        }
    }


    if (starte) {
        if (int_blink == 0) {
            $(elem).fadeOut(500).fadeIn(500);
            int_blink = setInterval(function () {
                console.log("ja - blink:", elem, int_blink);
                $(elem).fadeOut(500).fadeIn(500);
            }, 1000);
            last_blinker = elem;
        }
    } else {
        clearInterval(int_blink);
        int_blink = 0;
    }
}

function get_window_size() {
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        br = win.innerWidth || docElem.clientWidth || body.clientWidth,
        ho = win.innerHeight || docElem.clientHeight || body.clientHeight;
    return [br, ho];
}

function getStyle(el, styleProp) {

    if (el.charAt(0) == ".") {
        var x = document.getElementsByClassName(el)[0];
    } else if (el.charAt(0) == "#") {
        var x = document.getElementById(el.substr(1));
    } else {
        var x = document.getElementsByTagName(el)[0];
    }
    // var x = document.getElementById(el);
    if (x.currentStyle)
        var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
    return y;
}



function setCookie(cname, cvalue, exdays = 1) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    //alert(document.cookie);
}




function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}






function get_cook_val(varx) {
    let ret = 0;
    // console.log("un",getCookie("xvarx"));
    if ((getCookie(varx) != "undefined") && (getCookie(varx) != "")) {
        ret = Number(getCookie(varx));
    }
    return ret;
}


function setACookie(cname, arr, exdays = 1) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    //console.log("set", arr);
    document.cookie = cname + "=" + arr.join("|") + "; " + expires;
    //alert(document.cookie);
}
function getACookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    //console.log("Alle K:", document.cookie);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length).split("|");
    }
    return [0, 0];
}

function del_cookies_und_var(a_cook) {
    a_cook.forEach(function (varName) {
        // console.log(varName);
        setCookie(varName, "", -1);
        // console.log("LÖ",varName,typeof varName)
        window[varName] = {}; //auch akt_schueler.id wird gelöscht
        // s$("#"+feld).text("xxx");
    });

}

function del_cookies_und_var_string(a_cook) {
    a_cook.forEach(function (varName) {
        // console.log(varName);
        setCookie(varName, "", -1);
        // console.log("LÖ",varName,typeof varName)
        window[varName] = ""; //auch akt_schueler.id wird gelöscht
        // s$("#"+feld).text("xxx");
    });

}



// function fehler_no_user() {
//     $("#dialog_no_user").dialog({
//         resizable: false,
//         height: "auto",
//         width: "60%",
//         modal: true,
//         buttons: {
//             Ok: function () {
//                 $(this).dialog("close");
//             }
//         }
//     });
// }



function scroll_up(obj = "", zeit = 500) {
    if (obj == "") {
        $("html, body").animate({
            scrollTop: $(document).height()
        }, zeit);
    } else {
        $("html, body").scrollTop($(document).height());
        $(obj).animate({
            scrollTop: $(obj).height() * 3
        }, zeit);
    }
}



function get_set_data(data_art, flag, filter, daten = [], lehrer_spez_flag = "") {
    const adr = "dc_api.php";
    // adr="https://baa.at/projekte/dc/lib/p2.php";
    let params;
    if (data_art == "lehrer") {
        if (lehrer_spez_flag == "id") {
            params = { data_art: data_art, flag: flag, akt_lehrer_id: filter, lehrer_daten: daten };
        } else { //pw anfragen
            params = { data_art: data_art, flag: flag, akt_lehrer_pw: filter, lehrer_daten: daten };
        }
    } else if (data_art == "klassen") {
        params = { data_art: data_art, flag: flag, akt_lehrer_id: filter, klassen_daten: daten };
    } else if (data_art == "get_klasse_code") {
        params = { data_art: data_art, flag: flag, akt_klasse_code: filter, klassen_daten: daten };
    } else if (data_art == "get_klasse_id") {
        params = { data_art: data_art, flag: flag, akt_schueler_id: filter, klassen_daten: daten };
    } else if (data_art == "schueler") {
        params = { data_art: data_art, flag: flag, akt_klasse_id: filter, schueler_daten: daten };
    } else if (data_art == "wplan") {
        params = { data_art: data_art, flag: flag, akt_klasse_id: filter, wplan_daten: daten };
    } else if (data_art == "uebungen") {
        params = { data_art: data_art, flag: flag, akt_wplan_id: filter, uebungen_daten: daten };
        // console.log("aaaaaaaaaaaaaaaaaa")
        // console.error(JSON.stringify(params));
    } else if (data_art == "kl_wp_ub") {
        params = { data_art: data_art, flag: flag, akt_klasse_id: filter, uebungen_daten: daten };
    } else if (data_art == "protok") {
        params = { data_art: data_art, flag: flag, akt_schueler_id: filter, protok_daten: daten };
    } else if (data_art == "sch_protok") {
        if (flag == "wplan_protok") {
            params = { data_art: data_art, flag: flag, akt_wplan_id: filter, protok_daten: daten };
        } else { //sch_protok
            params = { data_art: data_art, flag: flag, akt_schueler_id: filter, protok_daten: daten };
        }

    } else {
        alert("unbekannt");
    }


    // console.error("data_art: ", data_art);
    // var ser_data = jQuery.param( params );
    // ser_data=JSON.stringify(params);
    // console.log("Anfrage:");
    $debug = 0;
    if ($debug) {
        $.ajax({
            type: "POST",
            url: adr,
            data: JSON.stringify(params),
            // dataType: "json",
            // contentType: "application/json",
            //nicht wegnehmen, sonst kann ich auf javascript nicht mehr senden
            success: function (data) {
                // JSON-Code empfangen und parsen
                // console.log("Rückdata: ",data)
                if (data) {
                    // console.warn("------------------------\ndata_art:", data_art, data.length, "\n========================\n");
                    // console.log("retour: ", data);
                    // console.warn("========================\n");
                    // if (data.length > 0) {
                    verteile(data_art, data, flag), lehrer_spez_flag;
                    // }

                }
                // $(body).addClass("done");
            }
        });

    } else {
        $.ajax({
            type: "POST",
            url: adr,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json",
            //nicht wegnehmen, sonst kann ich auf javascript nicht mehr senden
            success: function (data) {
                // JSON-Code empfangen und parsen
                // console.log("Rückdata: ",data)
                if (data) {
                    // console.warn("------------------------\ndata_art:", data_art, data.length, "\n========================\n");
                    // console.log("retour: ", data);
                    // console.warn("========================\n");
                    // if (data.length > 0) {
                    verteile(data_art, data, flag), lehrer_spez_flag;
                    // }

                }
                // $(body).addClass("done");
            }
        });

    }

}


function verteile(data_art, data, flag = "", lehrer_spez_flag = "") {
    let data_len = data.length;

    if (data_art == "lehrer") {
        lehrer_show(data, lehrer_spez_flag);
    }
    if (data_art == "klassen") {
        klassen_show(data, data_len);
    }
    if (data_art == "get_klasse_code") {
        auswertung_klasse_code(data, data_len);
    }

    if (data_art == "get_klasse_id") { //einloggen mit qrcode
        auswertung_klasse_id(data, data_len);
    }

    if (data_art == "schueler") {

        if (flag == "schueler_liste") {
            schueler_liste(data);
        } else {
            schueler_show(data, data_len);
        }

    }
    if (data_art == "wplan") {
        if (data_len > 0) {
            // console.log("daten bekommen:",data)
            wplan_show(data, data_len);
        }

        // if (flag != "save") {
        // wplan_show(data, data_len);
        // }

    }
    if (data_art == "uebungen") {
        // if (flag != "save") { //muss zeigen - sonst hat man abfall im bestand
        // alert("back"+data_len)
        if (data_len > 0) {
            uebung_show(data, data_len);
        }

        // }
    }
    if (data_art == "kl_wp_ub") {
        player_show_uebungen(data, data_len);
    }
    if (data_art == "protok") {

        if (flag == "img_save_flag") {
            zustellung_protok_id(data);
            // } else if (flag == "img_ren_flag") {
            //     // nichts
        } else if (flag == "img_del_flag") {
            // nichts
        } else if (flag == "savelehrer") {
            // document.getElementById('YOUR IFRAME').contentDocument.location.reload(true);
            // nichts
        } else if (flag != "save") { //alle möglichen protok-speicherungen
            // alert(flag)
            protok_show(data, data_len);
        }
    }
    if (data_art == "sch_protok") {
        if (flag == "wplan_protok") { //dcm
            // console.log("rück", data, "LEN:", data_len);
            //fragt bei der funktion nach    
            if (data[3] == "1" && akt_lehrer_id != 100) { //uebg zeigen?
                $("#tabs").tabs("disable", "#tabs-UB");
            } else {
                $("#tabs").tabs("enable", "#tabs-UB");
            }

            if (wplan_protok_show(data, data_len) == 0) {
                //eingentlich kommt das eh nur von dcm
                if (prg == "dcm") {
                    if (data[3] == "0") { //uebg zeigen?
                        $("#tabs").tabs({ active: 3 });
                    }
                }
            }
        } else {
            schueler_protok_show(data, data_len);
        }

    }

}

// #############################################################
// ########### P R O T O K O L L   SCHÜLER  ####################
// #############################################################
function schueler_protok_show(data, len) {
    $("#uebung_ifr_S").attr("src", leer_adr);
    if (data[1].length == 0) {
        $("#cont_protok").html("<p class='nodata' >Noch keine Arbeitsdaten vorhanden!</p>");
        return false;
    }
    const a_uebg_data = data[1];
    const a_prot_data = data[0];
    // console.log(data[1])
    // console.log(data);
    function click_evt(evt) {
        // protok_save_flag = false;  //deaktiviert

        // protok_wplan_id_save = 0; //wichtig, das ist eine freie übung und nicht an einen wplan gebunden, wenn alle übungen eingeschaltet sind, bei wplan_protokoll schon auch die wplan_id speichern
        // wird nun geseitzt beim wp_protokaufruf durch den schüler
        let butt = evt.target;
        nr = butt.getAttribute("nr");
        let adr = a_uebg_data[nr].uebung_link;
        let titel = a_uebg_data[nr].uebung_titel;
        let umax = Number(a_uebg_data[nr].uebung_max);

        akt_uebung_id = butt.id;
        rufe_iframe_dialog(adr, umax, 1);
    }

    // $("#cont_protok").text("");
    let htm = "<b>Arbeitsergebnisse: </b>";

    if (prg == "dc") {
        // htm += "Mit dem Beispielbutton kannst du die Übungen noch einmal machen. Willst du allerdings, dass deine Ergebnisse auch im Wochenplan erscheinen - musst du den Reiter <b>Wochenpläne</b> verwenden, dann sieht auch deine Lehrkraft die Ergebnisse. Zeichnungen werden immer nur in der letzten Version gespeichert.<br><br>";
        htm += "Mit dem linken Beispielbutton kannst du jede Übungen noch einmal machen.";
    }
    $("#cont_protok").html("<hr><p class='nodata'>" + htm + "</p>");

    let last_uebung_kzz_ur = '';
    let last_uebung_id = '';
    let erst = true;
    a_uebg_data.forEach((uebg) => {
        // console.log(uebg.uebung_kzz_ur,"fragt",last_uebung_kzz_ur);
        if (uebg.uebung_kzz_ur == last_uebung_kzz_ur) {
            if (!erst) {
                a_prot_data.filter(function (elem, idx, arr) {
                    if (elem.uebung_id == uebg.uebung_id) {
                        // console.log("treffer:",elem.uebung_id , last_uebung_id)
                        elem.uebung_id = last_uebung_id;
                    }
                });
            }
        } else {
            last_uebung_kzz_ur = uebg.uebung_kzz_ur;
            last_uebung_id = uebg.uebung_id;
        }
        erst = false;
    });

    let super_flag = 0;
    let nr = 0;
    a_uebg_data.forEach((uebg) => {
        let a_tmp = [];
        let sum_pkte = 0;
        let sum_proz = 0;
        let sum_sek = 0;
        let anz = 0;
        const a_prot = a_prot_data.filter(({ uebung_id }) => uebung_id == uebg.uebung_id);
        if (a_prot.length > 0) {
            let prot_html = "";
            a_prot.forEach((prot) => {
                //console.error(prot.protok_proz, prot.protok_sek, prot.datum, prot.protok_id, prot.time_stamp)
                a_tmp = get_ges_smiley(prot.protok_proz, prot.protok_sek, prot.datum, prot.protok_id, 0, prot.time_stamp);
                prot_html += a_tmp[0];
                // console.log("w",a_tmp[1])

                if (Number(prot.protok_proz) > -1) {
                    // sum_pkte += [-4, -2, 2][a_tmp[1]];
                    sum_pkte += [-2, -2, 2][a_tmp[1]];
                    sum_proz += Number(prot.protok_proz);
                    sum_sek += Number(prot.protok_sek);
                    anz++;
                }
            });
            externFlag = "";
            if (sum_pkte >= 6) {
                super_flag = 1;
                let proz = Math.round(sum_proz / anz);
                let sek = Math.round(sum_sek / anz);

                let today = new Date();
                let now = today.toLocaleDateString('de');
                let datum = now;
                prot_html += get_ges_smiley(proz, sek, datum, -1, 0)[0];
            }

            let zeile = `<div class='protok_zeile'>`;
            // zeile += "<button class='ui-button ui-widget ui-corner-all prot_uebg_butt' id='" + uebg.uebung_id + "' nr='" + nr + "' uebg.uebung_max  xxxonclick='rufe_xxxiframe_dialog(\"" + uebg.uebung_link + "\"," + uebg.uebung_max + ",1)' >" + uebg.uebung_kzz + "</button>&nbsp;";
            zeile += `<button class='prot_uebg_butt ui-button ui-widget ui-corner-all' id='${uebg.uebung_id}' + "' nr='${nr}'>${uebg.uebung_kzz}</button>&nbsp;`;

            zeile += `<div class='cont_erg' onclick='rufe_dialog_bewertung_aendern(event)'>${prot_html}</div>`;
            zeile += `</div>`;
            $("#cont_protok").append(zeile);
        }

        nr++; //vorsicht so lassen
    });
    if (super_flag) {
        $("#cont_protok").append("<h3>Findet heraus, was der vielfärbige Supersmiley bedeuten könnte!</h3>");
    } else {
        $("#cont_protok").append("<h3>Tipp: Toll wäre, am Schluss drei grüne Smileys zu haben!</h3>");
    }


    // $("button").addClass("ui-button ui-widget ui-corner-all").click(click_evt);
    $(".protok_zeile").find("button").click(click_evt);


    // $(".protok_zeile")[0].scrollBy({
    //     top: 1000,
    //     left: 0,
    //     behavior: "smooth",
    //   });
}

// function teste(evt) {
//     console.log(evt.target.id);
//     let elem = evt.target;
//     if (elem.id == "smile") {
//         console.log(elem);
//         // alert("image-test"+elem.attr("werte"))
//     }
//     console.log(evt);
// }



function get_ges_smiley(proz, sek, datum, prot_id = 0, waagrecht = 0, time_stamp = 0) {
    let pkte = 0;
    let htm = "";
    if (proz == -1) {

        upl_bildname = (10000000 + Number(prot_id)).toString().substring(1);
        //console.log(upl_bildname,time_stamp)                
        htm = "<span class='ein_erg_img'>";
        htm += `<img class='cont_prot_img' src='../assets/user_img/${upl_bildname}.png?${time_stamp}' onclick='rufe_dialog_benotung(\"${upl_bildname}.png\",${prot_id})' />`;
        htm += "</span>";
        pkte = 0;
    } else if (waagrecht) {
        // let wert = Math.floor(Math.min(2,Math.max(0, (proz - 25)) / 25));
        let wert = Math.floor(Math.min(2, Math.max(0, (proz - 20)) / 30));
        // console.log(proz,wert)

        let w = wert; if (prot_id == -1) w = "d";
        htm = "<span class='ein_erg_smiley' style='flex-direction:row;justify-content:center'>";
        // htm += `<div><img class='cont_smiley_img' src='../assets/icons/sm_${w}.png' onclick='rufe_dialog_benotung(\"${upl_bildname}.png\",${prot_id})' /></div>`;
        // htm += `<div><img class='cont_smiley_img' src='../assets/icons/sm_${w}.png' onclick='rufe_dialog_bewertung_aendern(${prot_id},${proz},${sek})' /></div>`;
        htm += `<div><img class='cont_smiley_img' src='../assets/icons/sm_${w}.png' /></div>`;
        htm += `<div style='margin-left:2px;width:4rem'><span>${proz}%/${sek}s</span><br><span>${datum}</span></div>`;
        // htm += `<span>${datum}</span>`;
        htm += "</span>";
        pkte = wert;

    } else { //schülersmiley
        // let wert = Math.floor(Math.min(2,Math.max(0, (proz - 25)) / 25));
        let wert = Math.floor(Math.min(2, Math.max(0, (proz - 20)) / 30));
        // console.log(proz,wert)
        htm = "<span class='ein_erg_smiley'>";
        htm += `<span>${proz}%/${sek}s</span>`;
        let w = wert;
        if (prot_id == -1) {
            w = "d";
        }
        // htm += `<div><img class='cont_smiley_img' src='../assets/icons/sm_${w}.png' onclick='rufe_dialog_benotung(\"${upl_bildname}.png\",${prot_id})' /></div>`;
        // htm += `<div><img class='cont_smiley_img' src='../assets/icons/sm_${w}.png' onclick='rufe_dialog_bewertung_aendern(${prot_id},${proz},${sek})'  /></div>`;
        let tmp = `${prot_id},${proz},${sek}`;

        htm += `<div><img id='smile' werte='${tmp}\' class='cont_smiley_img' src='../assets/icons/sm_${w}.png' /></div>`;
        htm += `<span>${datum}</span>`;
        htm += "</span>";
        pkte = wert;
    }
    return [htm, pkte];
}





































// #############################################################
// ########### P R O T O K O L L   WPLAN  ######################
// #############################################################
function wplan_protok_show(data, len) {
    if (data[0].length == 0) {
        // if (len==0) {
        $("#cont_wp_protok").html("<p class='nodata' >Noch keine Arbeitsdaten vorhanden!</p>");
        return 0;
    }
    const a_prot_data = data[0];
    const a_uebg_data = data[1];
    const a_sch_data = data[2];

    $("#cont_wp_protok").text("");
    let nr = 0;

    // let p_seite=`<div>s${s}</div>`;
    let u_anz = a_uebg_data.length;
    let s_anz = a_sch_data.length;

    // console.log(a_uebg_data);

    let seite = "<div id='druckbreite_wp' class='table_bk printArea'>";
    seite += `<div class='wpl_druck_ues'><span>Protokoll '${akt_wplan.bez}' </span><button onclick='alert(\"Noch in Arbeit!\")'>Drucken des Protokolls</button>${heute.toLocaleString()}</div>`;

    seite += "<table class='t_protok'>";
    seite += "<tr class='wp_protok_seite'><th><span class='ui-corner-all'>SCH.</span></th>";
    a_uebg_data.forEach((uebg) => {
        seite += "<th><button  class='ui-button ui-corner-all tab_uebg_butt' onclick='rufe_iframe_dialog(\"" + uebg.uebung_link + "\"," + uebg.uebung_max + ",0)' id='" + uebg.uebung_id + "' nr='" + nr + "'>" + uebg.uebung_kzz + "</button></th>";
    });
    seite += "<th><span class=''>Schnitt</span></th></tr>";


    for (s = 0; s < s_anz; s++) {
        let sch_proz_sum = 0, sch_proz_anz = 0;
        let a_tmp = [];
        let s_id = a_sch_data[s].schueler_id;
        let pkte_summe = 0;

        seite += `<tr class='wp_protok_seite'><th>s${s + 1}</th>`;
        a_uebg_data.forEach((uebg) => {
            // let u_id=uebg.uebung_id;
            let uebg_anzeige_proz = 0;
            pkte_summe = 0;
            let proz = 0;
            let a_prot = a_prot_data.filter(({ uebung_id, schueler_id }) => (uebung_id == uebg.uebung_id) && (schueler_id == s_id));
            if (a_prot.length > 0) {

                let p_anz = 0;
                let bild_flag = 0;
                let sek = 0;
                let time_stamp = 0;
                let anz = 0; let datum = a_prot[0].datum; let prot_id = a_prot[0].protok_id;


                a_prot.forEach((prot) => {

                    prot_id = prot.protok_id;
                    if (prot.protok_proz > -1) {
                        proz += Number(prot.protok_proz);
                        sek += Number(prot.protok_sek);
                        p_anz++;
                        // console.log(uebg.uebung_id,"plus","sch_proz_anz=",sch_proz_anz,"sum-proz=",proz,"akt-proz=",prot.protok_proz);
                    } else {
                        bild_flag = 1;
                        time_stamp = Number(prot.time_stamp);
                        // console.log(uebg.uebung_id,"minus","sch_proz_anz=",sch_proz_anz,"sum-proz=",proz,"akt-proz=",prot.protok_proz);
                    }
                    // console.log(uebg.uebung_id,"sch_proz_anz",sch_proz_anz,proz,prot.protok_proz)    
                });

                let ergebnis_string = "";
                if (p_anz > 0) { //mind. ein echtes proz-ergebnis - div durch 0
                    uebg_anzeige_proz = Math.round(proz / p_anz); sek = Math.round(sek / p_anz);
                    sch_proz_anz++;
                    if (p_anz > 1) {
                        datum = p_anz;
                    }
                    ergebnis_string = get_ges_smiley(uebg_anzeige_proz, sek, datum, prot_id, 1, 0)[0];
                }
                if (bild_flag) { //dann vielleicht ein bild
                    // uebg_anzeige_proz=0;
                    ergebnis_string += get_ges_smiley(-1, 0, datum, prot_id, 1, time_stamp)[0];
                }
                seite += "<td>" + ergebnis_string + "</td>";
                // pkte_summe+=a_tmp[1];
            } else {
                seite += "<td>&nbsp;</td>"; // noch nicht gemacht
            }
            sch_proz_sum += uebg_anzeige_proz;
        });

        // a_tmp[0]
        // seite += `<td>${a_tmp[1]}</td>`;

        let tmp = "&nbsp;";
        if (sch_proz_anz > 0) {
            tmp = Math.round(sch_proz_sum / sch_proz_anz) + "%";
        }
        seite += "<th>" + tmp + "</th></tr>";
    }

    seite += "</table></div>";
    $("#cont_wp_protok").append(seite);
    return 1;
}



function rufe_iframe_dialog(adr, umax, scroll_flag) {
    // alert(adr)
    startzeit = new Date();
    if (umax) {
        window.open(adr);
    } else {
        let $ifr = $("#app_fenster_2");
        let titel = "";
        if (adr.includes("user_img") || adr.includes("leer_")) {
            titel = "Du kannst diese Zeichnung nur im Wochenplanmodus neu zeichnen!";
        } else {
            titel = "Beispielanzeige: Du kannst auch hier das Beispiel lösen.";
        }



        if (prg == "dcm") {
            titel = "Die Lehrkraft kann hier das Beispiel aufrufen, evtl. erzeugte Ergebnisse werden natürlich nicht gespeichert!";
        }
        $("#dialog_iframe_uebg").dialog({
            title: titel,
            modal: true,
            width: "70%",

            position: { my: "center", at: "center", of: window },
            // position: { my: "center", at: "center", of: window },
            // buttons: {
            //     Schließen: function () {
            //         $ifr.attr("src", leer_adr);
            //         $(this).dialog("close");
            //     }
            // }
            close: function (event, ui) {
                // alert(last_wp_button)
                if (prg == "dc") {
                    $(last_wp_button).trigger("click");
                }
            }
            // buttons: {
            //     "Schließen": function () {
            //         alert("222")
            //         $(this).dialog("close");
            //     }
            // }

        });
        console.log("adresse:", adr);
        $ifr.attr("src", adr_korrektur(adr));
        $ifr.show();
    }
}

function set_wertung(bildname, proz, ur_protok_id_save = 0) {
    if (bildname != "smiley") {
        $("#app_fenster_3").attr("src", leer_adr);
        ur_protok_id_save = Number(bildname.split(".")[0]);
    }
    save_lehrer_protok("savelehrer", ur_protok_id_save, proz); // keine zeit angebbar, daher 0
}


function rufe_dialog_benotung(bildname, prot_id) {
    let mtitel = "SchülerInnenlösung";
    $("#app_fenster_3").attr("src", "about:blank");
    let buttons = {};
    if (prg == "dcm") {
        mtitel += ": Nach der Bewertung wird die Abgabe gelöscht!";
        buttons = {
            "Lösung ohne Bewertung löschen": function () {
                rufe_img_loeschen(prot_id);
                $(this).dialog("close");
            },
            "Smiley GRÜN": function () {
                //auch hier muss prot_id eingegeben werden, weil der bildname eh nur zu einem protok gehören kann.
                set_wertung(bildname, 100, prot_id);
                $(this).dialog("close");
            },
            "Smiley GRAU": function () {
                set_wertung(bildname, 70, prot_id);
                $(this).dialog("close");
            },

            "Smiley ROT": function () {
                set_wertung(bildname, 40, prot_id);
                $(this).dialog("close");
            },

            "Weiter ohne Bewertung": function () {
                $("#app_fenster_3").attr("src", leer_adr);
                $(this).dialog("close");
            }
        };
    } else {
        buttons = {
            "Schließen": function () {
                $("#app_fenster_3").attr("src", leer_adr);
                $(this).dialog("close");
            }
        };
    }

    $("#dialog_benotung").dialog({

        title: mtitel,
        resizable: false,
        height: "auto",
        width: "80%",
        // height: hh,
        modal: true,
        buttons: buttons
    });


    adr = "../assets/user_img/" + bildname;
    $("#app_fenster_3").attr("src", adr_korrektur(adr));
}



function rufe_dialog_bewertung_aendern(evt) {
    if (prg == "dcm") {
        let elem = evt.target;
        if (elem.id == "smile") {

            let a_tmp = $(elem).attr("werte").split(",");
            let prot_id = a_tmp[0];
            let proz = a_tmp[1];
            let sek = a_tmp[2];

            let info = `<h3>Hier können Bewertungen, die aus irgendwelchen Gründen falsch sind, aus dem System entfernt oder verändert werden: Mit einem Smiley GRÜN, GRAU oder ROT wird eine neue Bewertung eingetragen!<br>`;
            info += `<div class='achtung_mann'>`;
            info += `<img src='../assets/icons/anim35.gif' height='30%'>`;
            info += `<div><br><br><b>SchülerIn: ${akt_schueler_name} </b>`;
            info += `<br><br><b>Prozentwert derzeit:</b> ${proz}% <br><span style='font-weight:normal'>(Schwellenwerte: unter 80% grauer - unter 50% roter Smiley)</span>`;
            info += `<br><br><b>Zeitangabe:</b> ${sek} Sek.</div>`;
            info += `</div>`;
            info += `<br>Achtung: <span style='color:red'>Diese Funktion lässt keine spätere Wiederherstellung zu - daher bitte mit größter Behutsamkeit verwenden!</span></h3>`;


            if (prot_id == -1) {
                alert("Supersmileys werden berechnet - diese kann man nicht löschen!");
            } else {
                $("#dialog_bewertung_aendern").dialog({
                    title: "Nur für die Lehrkraft: Änderung der Beurteilung/Bewertung.",
                    modal: true,
                    width: "60%",
                    // position: { my: "center center", at: "center center"},

                    buttons: {
                        "Bewertung löschen": function () {
                            set_wertung("smiley", -1, prot_id);
                            $(this).dialog("close");
                        },
                        "Smiley GRÜN": function () {
                            set_wertung("smiley", 100, prot_id);
                            $(this).dialog("close");
                        },
                        "Smiley GRAU": function () {
                            set_wertung("smiley", 70, prot_id);
                            $(this).dialog("close");
                        },

                        "Smiley ROT": function () {
                            set_wertung("smiley", 40, prot_id);
                            $(this).dialog("close");
                        },

                        "Weiter ohne Änderung": function () {
                            $(this).dialog("close");
                        }
                    }
                }).find("#info_text").html(info);

            }
        }

    }
}


function make_iframe_adresse(padr) {
    return "show_page.php?datei_url=" + padr;
}


function adr_korrektur(padr) {

    let ret = padr;
    if (padr.includes("/pdfs/")) {
        if (padr.includes(".png")) {
            ret = "show_page.php?datei_url=" + padr;
        } else {
            ret = padr + "#toolbar=0&view=FitH";
        }
    }

    if (padr.includes("/user_img/")) { //wegen aktualisieren - neueste version
        // let rnd=Math.random();
        // console.log("adresseingang:"+padr)
        let reg = /(u_[0-9]+).([a-z]{3})/g;
        let matches = padr.match(reg); //dateiname zurück gegeben

        if (matches) {
            ret = "show_page.php?datei_url=../assets/user_img/" + matches[0];
        } else {
            reg = /([0-9]{7}).([a-z]{3})/g;
            matches = padr.match(reg); //7 ziffern der schüerlabgabe
            if (matches) {
                ret = "show_page.php?datei_url=../assets/user_img/" + matches[0];
            }
        }
    }

    if (padr.indexOf("puzzle") > -1) {
        //doppelte oder dreifache nummernauswahl mit beistrich
        if (padr.includes(",")) {
            let a_tmp = padr.split("pnr=");
            a_tmp = a_tmp[1].split(",");
            let rnd = getRandomInt(a_tmp.length);
            ret = "https://edupuzzle.at?pnr=" + a_tmp[rnd];
        }
    }

    if (prg == "dc") {
        if (padr.indexOf("puzzle") > -1) {
            ret = padr + "&prgruf=dc";
        }
        if (padr.indexOf("robobee") > -1) {
            ret = padr + "&prgruf=dc";
        }
    }
    // console.log("adressausgang:",ret)
    return ret;
}

function rufe_img_loeschen(prot_id) {
    get_set_data("protok", "img_del_flag", prot_id, []);
}


function prg_aufruf_zentral(adr, umax, ustift = 0, ifr_nr = "H", scroll_flag = 0) {
    startzeit = new Date();
    if (adr.indexOf("puzzle") > -1) {
        adr = adr + "&prgruf=dc";
    }
    if (adr.indexOf("robobee") > -1) {
        adr = adr + "&prgruf=dc";
    }
    // console.log("aufruf - akt:", umax,akt_schueler_id, akt_uebung_id,adr);
    if (umax) {
        window.open(adr);
    } else {
        if (scroll_flag) {
            // if (prg=="dc") {
            scroll_up("#tabs-P");
            // }
        }
        // console.log("ifr:", "umax=", umax, "ifrnr=", ifr_nr, "sch", akt_schueler_id, akt_uebung_id, adr);
        $("#uebung_ifr_" + ifr_nr).attr("src", adr);
    }
}
//##################################################################
//######################   wertung speichern  ######################
//###################### auch von lehrermodul ######################
//robobee:
//window.parent.ext_prot_save("RB",m_ges_punkte,Math.round((baa_hpt.getTimer() - startZeit) / 1000),0,m_ges_schritte)
//6 parameter           save        p  z  sgrad      speichern    RB  oder Lwertung
function ext_prot_save(flag = "save", p, z, sgrad = 0, diverses = 0, urPrg = "") {

    // alert("wpid: "+protok_wplan_id_save)

    let dauer = Math.round((new Date() - startzeit) / 1000);
    save_protok(flag, p, dauer, sgrad, diverses, urPrg);
    // alert("save"+ urPrg)
}

function save_protok(flag, proz, zeit, sgrad = 0, diverses = 0, urPrg = "") {

    console.log(`Speicherung: flag: ${flag} proz: ${proz} zeit: ${zeit} akt_schueler_id: ${akt_schueler_id} diverses: ${diverses} urPrg: ${urPrg}`);

    // let spez_prot_id=0;
    // if (urPrg=="Lwertung") {
    //     spez_prot_id=diverses;
    // }    


    // if (akt_schueler_id != "") {
    let dialog_info="";
    if (prg == "dc") {
        // alert("speichern")
        if (Number(akt_schueler_id) > 0) {
            let arr = [];
            let obj = {};

            // obj.ur_protok_id = spez_prot_id;

            obj.akt_schueler_id = akt_schueler_id;
            obj.wplan_id = protok_wplan_id_save;
            obj.uebung_id = akt_uebung_id;
            obj.uebung_sgrad = akt_uebung_sgrad;
            obj.protok_sek = zeit;
            obj.protok_proz = proz;
            obj.protok_urprg = urPrg;
            obj.protok_ftyp = diverses;
            arr.push(obj);

            get_set_data("protok", flag, akt_schueler_id, JSON.stringify(arr));
        } else {
            dialog_info="Keine Ergebnis-Speicherung - es ist kein Schüler angemeldet!";
        }
    } else {
        dialog_info="Keine Ergebnis-Speicherung - Lehrerprogramm";
    }
    if (dialog_info!="") {
        alert_dialog("Information",dialog_info,"AJ");
    }

}

function save_lehrer_protok(flag, save_prot_id, proz) {

    console.log("Speicherung: lehrer", flag, save_prot_id, proz);
    let arr = [];
    let obj = {};
    obj.save_protok_id = save_prot_id;
    obj.protok_proz = proz;
    arr.push(obj);

    get_set_data("protok", flag, save_prot_id, JSON.stringify(arr));
}



function alert_dialog(ues, info, flag = "", adr = "") {
    let buttons = {};

    if (flag == "AJ") {//allgemeiner dialog
        buttons = {
            // Abbrechen: function () {
            //     $(this).dialog("close");
            // },
            Weiter: function () {
                $(this).dialog("close");
            },
        };

    } else {
        buttons = {
            Weiter: function () {
                if (flag == "adr") {
                    window.open(adr, "x");
                }
                if (flag == "sk") {
                    set_sketch(9);
                }
                $(this).dialog("close");
            }
        };

    }

    $("#dialog_allgemein").dialog({
        title: ues,
        width: "40vw",
        modal: true,
        buttons: buttons
    }).find("#dialog_info").html(info);
}

var flag_sketch_hinweis_erst = 1;
function show_zeichnen() {
    flag_sketch_hinweis_erst = 0;
    if (flag_sketch_hinweis_erst) {
        alert_dialog("Hinweis", "Mit dieser Funktion können Sie Fensterinhalte mit Zeichenstift bearbeiten, sie dann als Zeichnung speichern und diese Inhalte werden den SchülerInnen dann als Zeichnung zur Verfügung gestellt.<br><b>Somit ist diese Aufgabe nur mehr grafisch mit dem Zeichenstift für die SchülerInnen zu barbeiten!</b>", "sk", "");
        flag_sketch_hinweis_erst = 0;
    } else {
        set_sketch(9);
    }
    reload_neu = true;
    // alert("stift ein")
}

// let int_zuweis=0;
// function blink_schalter(flag=1) {

//     if (prg == "dcm") {
//         if (flag==0) {
//             clearInterval(int_zuweis);
//             $(".ibild").css("opacity", 1);
//         } else {
//             clearInterval(int_zuweis);
//             int_anz = 0;
//             int_zuweis = setInterval(() => {
//                 $(".ibild").css("opacity", [0.5, 1][int_anz % 2]);
//                 int_anz++;
//                 if (int_anz > 100) {
//                     clearInterval(int_zuweis);
//                     // $hinweis.text("Beim ausgewählten Programm die entsprechenden Einstellungen festlegen - dann einen der beiden Zuweisungsbuttons (1) oder (2) klicken!");
//                 }
//             }, 300);

//         }
//     }

// }


function img_to_server(canvas, bildname, ifr) {
    // var canvasData = canvas.toDataURL("image/png");
    // console.error(baa, "save to server bildname: " + bildname, "u_id", akt_uebung_id);
    if (prg == "dcm") {
        if (bildname.substring(0, 2) != "u_") {
            // button_uebg_nach_links(1);
            // blink_schalter(1);
            bildname = "u_" + akt_uebung_id;
        }

        let neue_adr = `../assets/user_img/u_${akt_uebung_id}.png`;
        if (check_kein_unterschied(akt_uebung_id, neue_adr)) {


            ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // console.log("response:", ajax.responseText);
                    // console.log("src:", ifr.src);
                    if (reload_neu) {
                        console.log("reloaded: " + akt_uebung_id);

                        // const src = adr_korrektur(`../assets/user_img/u_${akt_uebung_id}.png`) + "?" + Math.random();
                        // const src = `../assets/user_img/u_${akt_uebung_id}.png` + "?" + Math.random();
                        const src = make_iframe_adresse(neue_adr);
                        ifr.src = src + "?" + Math.random();

                        console.log("neu-src:", ifr.src);
                        reload_neu = false;
    show_zuweis_gruen(false); // neu am 1.5.24
  
                        if (!src.includes($("#u" + akt_uebung_id).find(".uebung_link").val())) {
                            // console.log("update notwendig", $("#u" + akt_uebung_id).find(".uebung_link").val(), src);
                            button_uebg_nach_links(1, 0);
                        };
                    }
                }
            };
            ajax.open("POST", "php/save_img.php", true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.send("imgName=" + bildname + "&imgData=" + canvas.toDataURL("image/png"));

        } else {
            return false;
        }
    } else { //schüler speichert bild als protokoll - die obere procedure ist nur für lehrerbilder
        ajax = new XMLHttpRequest();

        ajax.open("POST", "php/save_img.php", true);
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.send("imgName=" + bildname + "&imgData=" + canvas.toDataURL("image/png"));
    }

}


function txt_to_server(edi = "") {
    daten = edi.getData();

    daten = vor_dem_speichern(daten);

    if (daten.includes("data:image/png")) {
        const d = new Date();
        let a_tmp = d.toISOString().substring(0, 10);
        let ur_dname = prompt("Das zu speichernde Bild benötigt einen Namen (Vorschlag akzeptieren mit 'OK'):", "foto_" + a_tmp + "_" + getRandomInt(100));
        let bilder_found = [];
        // $ana=$("<div id='cont'>"+daten+"</div>");
        let anz_bilder = $(daten).find("img").length;
        let anz_spez_bilder = 0;
        if (anz_bilder > 0) {

            let a_name_post = ["", "_a", "_b", "_c", "_d", "_e", "_f"];
            let zz = 0;
            $(daten).find("img").each(function (idx) {
                saved = false;
                $bild = $(this);
                const bild_data = $bild.attr("src");
                if (bild_data.substring(0, 5) == "data:") {
                    anz_spez_bilder++;
                    dname = `a_${ur_dname}${a_name_post[zz]}`;

                    ajax1 = new XMLHttpRequest();
                    ajax1.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            saved = true;
                            anz_spez_bilder--;
                            // console.log("saved:",dname)
                            // console.log("response:", ajax1.responseText);
                        }
                    };

                    ajax1.open("POST", "php/save_img.php", true);
                    ajax1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    ajax1.send("imgName=" + dname + "&imgData=" + bild_data);
                    bilder_found.push(`//baa.at/projekte/dc/assets/user_img/${dname}.png`);
                    zz++;
                    //leider absoluter path notwendig
                }
            });
        }

        let sich_zzz = 0;
        let wait_save = setInterval(function () {
            if ((anz_spez_bilder <= 0) || (sich_zzz > 200)) {
                clearInterval(wait_save);

                let nr = 0;
                let $leer = $("<div id='tt'></div>");
                $leer.append(daten);
                $leer.find("img").each(function (idx) {
                    $bild = $(this);
                    const bild_data = $bild.attr("src");
                    if (bild_data.substring(0, 5) == "data:") {
                        dname = bilder_found[nr];
                        $bild.attr("src", dname);
                        // console.log("dname:",dname);
                        // console.log("daten innen:",$leer.html());
                        nr++;
                    }
                });
                // console.log("daten:",$leer.html())
                alert("data-image");
                txt_to_server_teil2($leer.html());
            }
            sich_zzz++;
            // console.log("warte",anz_spez_bilder,sich_zzz)
        }, 100);
    } else {
        txt_to_server_teil2(daten);
    }

}

function txt_to_server_teil2(daten) {
    const ifr = document.getElementById("app_fenster_1");
    let neue_adr = `../assets/user_img/u_${akt_uebung_id}.txt`;
    if (check_kein_unterschied(akt_uebung_id, neue_adr)) {
        let adr1 = "php/get_save_html.php";
        var data = { flag: "1", u_id: akt_uebung_id, u_html: daten };
        $.ajax({
            type: "POST",
            url: adr1,
            data: data,
            // data: JSON.stringify(data),
            // dataType: "json",
            // contentType: "application/json",
            //nicht wegnehmen, sonst kann ich auf javascript nicht mehr senden
            success: function (phpData) {
                if (phpData) {
                    // const src = adr_korrektur(`../assets/user_img/u_${akt_uebung_id}.txt`);
                    //anzeige aktualisieren

                    let src = make_iframe_adresse(neue_adr);
                    ifr.src = src;
                    // console.log(phpData);

                    console.log("PHP-Speicherung:", phpData);

                    if (!src.includes($("#u" + akt_uebung_id).find(".uebung_link").val())) {
                        // console.log("update notwendig", $("#u" + akt_uebung_id).find(".uebung_link").val(), src);
                        button_uebg_nach_links(2, 1);
                    };
                }
            }
        });

    } else {
        return false;
    }
}


function check_kein_unterschied(id, neue_adr) {
    let antw = true;
    let alte_adr = $("#u" + id).find(".uebung_link").first().val();
    if ((alte_adr != neue_adr) && (alte_adr != "https://")) {
        antw = confirm("Die neue Übungsinformation ersetzt die alte - OK oder  Abbrechen");
    };
    return antw;
}


// function xxxtxt_to_server() {
//     const ifr = document.getElementById("app_fenster_1");
//     const ifr_doc = ifr.contentWindow.document;

//     ifr_doc.getElementById("uebg_id").value = akt_uebung_id;
//     ifr_doc.getElementById("edit_form").submit();
//     setTimeout(() => {
//         ifr.src = `show_page.php?datei_url=../assets/user_img/u_${akt_uebung_id}.txt`;
//     }, 500);

// }


function konvert_datum(flag, datum) {
    if (flag == "e") {
        const a_dat = datum.split("-");
        return a_dat[2] + "." + a_dat[1] + "." + a_dat[0];
    } else {
        const a_dat = datum.split(".");
        console.error(datum);
        return a_dat[2] + "-" + a_dat[1] + "-" + a_dat[0];
    }
}

function info_hintergrund(ifr, txt) {
    // const ifr=document.getElementById("uebung_ifr_1");
    $(ifr).attr("src", "../assets/html/info_hg.html?txt=" + txt);
}



// const getGeneratedPageURL = ({ html, css, js }) => {
//     const getBlobURL = (code, type) => {
//       const blob = new Blob([code], { type })
//       return URL.createObjectURL(blob)
//     }

//     const cssURL = getBlobURL(css, 'text/css')
//     const jsURL = getBlobURL(js, 'text/javascript')

//     const source = `
//       <html>
//         <head>
//           ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
//           ${js && `<script src="${jsURL}"></script>`}
//         </head>
//         <body>
//           ${html || ''}
//         </body>
//       </html>
//     `

//     return getBlobURL(source, 'text/html')
//   }

//   const url = getGeneratedPageURL({
//     html: '<p>Hello, world!</p>',
//     css: 'p { color: blue; }',
//     js: 'console.log("hi")'
//   })

//   const iframe = document.querySelector('#iframe')
//   iframe.src = url



// ##################### test ###################
function test_open2() {
    url = "https://baa.at";
    fetch(url)
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            var iframe = document.createElement('iframe');
            iframe.onload = function () {
                alert('Webseite erfolgreich geladen!');
            };
            iframe.onerror = function () {
                alert('Fehler beim Laden der Webseite!');
            };
            iframe.srcdoc = html;
            document.body.appendChild(iframe);
        })
        .catch(function () {
            alert('Fehler beim Abrufen der Webseite!');
        });
}



function testfragen(adr) {

    // let txt=$("#dialog-zuweisen").children("div").text();
    $("#dialog-zuweisen").show();
    $("#dialog-zuweisen").find("#adr").text("\n" + adr);
    $("#dialog-zuweisen").dialog({
        buttons: {
            Abbrechen: function () {
                $(this).dialog("close");
                test_open2();
            },
            Überschreiben: function () {
                test_open();
                $(this).dialog("close");

            },
            "nur close": () => {
                $(this).dialog("close");
            }
        }
    });

}



function vor_dem_speichern(htm) {
    // $("table").width("100%");

    // $data.find("table").each(function (idx) {
    //     const tableWidth = $(this).width();
    //     $(this).find("tr").children().each(function (index) {
    //         const w = Math.round(100 * $(this).width() / tableWidth) + "%";
    //         console.log(index, $(this).css("width"), w);
    //         $(this).css("width", w);
    //     });
    // });
    let $data = $("<div id='ttt'>" + htm + "</div>");
    $data.find("li,td,th").each(function (idx) {
        let $td = $(this);
        if ($td.find("p").length > 0) {
            $td.find("p").each(function () {
                
                // if ($(this).text().trim() == $td.text().trim()) {
                if ($(this).text().trim() == $td.text().trim()) {
                    // if ($(this).find("img").length==0) {
                    //console.log("p innerhalb li, ...",$td.prop("tagName"),$(this).text())
                    
                    if (!$(this).hasClass("rahmen_text")) {
                        
                        if ($(this).find("img").length) {
                            $(this).replaceWith($(this).html());
                        }
                    }
                } else {

                    if ($(this).find("img").length) {
                        $(this).replaceWith($(this).html());
                    }
                }
            });
        }



        //kann nur li, td oder th sein
        if ($td.hasClass("rahmen_text")) {
            $td.removeClass("rahmen_text");
            $td.html("<p class='rahmen_text'>" + $td.html() + "</p>");
        }

        $td.find("table").each(function () {
            $table = $(this);
            if ($table.find("td").length == 1) {
                // alert($table.find("td").html())
                $td.html($table.find("td").html());
            }
        });

    });

    $data.find("div").each(function (idx) {
        if ($(this).css("page-break-after") > "") {
            console.log("leer", $(this).html());
            if ($(this).hasClass("seitenumbruch") && ($(this).text().trim() == "")) {
                $(this).remove();
            } else {
                $(this).html("&nbsp;");
            }
        }
    });



    return $data.html();
}

