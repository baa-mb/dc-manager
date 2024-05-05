// var akt_schueler_id = 1;akt_wplan_open
var akt_schueler_id = "";
var akt_schueler_nr = "";
var akt_klasse_id = "";
var akt_wplan_id = "";
// var akt_wplan_id = 0;
var akt_wplan_open = 0;
//var akt_wplan_save = 0; ist im dc_all.js definiert
var auto_wplan_id = 0; //wenn dummy aufgerufen werden
var anzahl_wp = 0;

// var akt_klasse = {};
// var akt_schueler = {};
// var akt_wplan = {};
var akt_klasse_code = ""; //wird benötigt für neustart-cookie

var akt_uebung_id = 0;
var akt_uebung_sgrad = 0;

// var win_h = 500;
// var win_w = 1000;
var acc_breite = "";
prg = "dc";

var ur_bk, ur_col;

var stand_color = "#333";

load_theme(prg);

var tabN = { "TI": 0, "TW": 1, "TK": 2, "TP": 3, "TL": 4, "AB": 5 };

var resizeId = 0;

var aktiver_tab = "";
var automat=0;
var is_landscape=true;

$(document).ready(function () {
    $("#tabs").tabs({
        // active: tabN.TL,
        disabled: [tabN.TW, tabN.TK, tabN.TP], //zählung beginn bei 0
        // heightStyle: "fill",
        heightStyle: "content",
        // disabled: [3],
        activate: function (evt, ui) {
            let targ = evt.currentTarget;
            aktiver_tab = ui.newTab[0].firstChild.id;
            if (["TW", "TK"].includes(aktiver_tab)) {
                //if ($(".ui-accordion").length == 0) {

                // info_hintergrund("#uebung_ifr_H","Wähle links aus einem Wochenplan Übungen aus.");
                // $("#uebung_ifr_H").attr("src",leer_adr);
                if (akt_klasse_id != "") {
                    // console.log("lesen",ui.newTab[0].firstChild.id)
                    // alert(aktiver_tab + " "+tabN.TW+ " "+tabN.TK)
                    if (aktiver_tab == "TW") {
                        setCookie("akt_wplan_tab", tabN.TW);
                        wplan_lesen(0);
                    } else {
                        setCookie("akt_wplan_tab", tabN.TK);
                        wplan_lesen(akt_klasse_id);
                    }

                    baa_resize(); //weil sketchrahmenanpassung;
                }
                //}
            } else {
                if (canvas_on) {
                    set_sketch(0);
                }
            }
            $("#stift_zch").hide();
        }
    });


    // baa_resize();
    // window.onresize = (event) => {
    //     setTimeout(function () {
    //         baa_resize();
    //     }, 3000);
    // };

    // $(window).one("resize", function() {
    //     setTimeout(function () {
    //         baa_resize();        
    //     }, 3500);
    // })

    baa_resize();
    $(window).resize(function () {
        clearTimeout(resizeId);
        resizeId = setTimeout(baa_resize, 500);
    });

    $("input[type=submit], .widget a, .widget button").button();
    $("button, input, a").on("click", function (event) {
        event.preventDefault();
    });

    $(".steuer_zeile").click(schloss_schalter);
    $("#p_haupt").css("padding-bottom", "4px");



    // anmelde_daten_zeigen();

    //dialog("Bachinger","das ist ein test")
    // $("#chg_theme").text("Farbe: " + getCookie(prg + "akt_theme"));
    // setTimeout(()=>{
    //     $("#tabs").tabs({ active: 4 });
    //     console.log("act")
    // },2000)


    add_theme();
    uebertragen_formate();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //urlParams.get('wp') != null) {
    let param_schueler_id = -1;

    let wp=0;
    let ub=0;

    // if (urlParams.get('nr') != null) {
    //     if (Number(urlParams.get('nr'))<0) {
    //         wp=Number(urlParams.get('nr'));
    //         param_schueler_id=0;
    //     }
    //     // param_schueler_id = Number(atob(decodeURIComponent(urlParams.get('s'))));
    //     // alert(urlParams.get('s')+" "+param_schueler_id); 
    // }
    //neu
    if (urlParams.get('wp') != null) {
        wp=Number(urlParams.get('wp'));

        if (wp>0) wp=wp*-1; //damit beim aufruf nur ein WP kommt (php)
        param_schueler_id=0;
    }
    if (urlParams.get('ub') != null) {
        //sollte nicht verwendet werden weil dcu.baa.at?u=2878 existiert
        automat=Number(urlParams.get('ub'));
    }

    // console.log(urlParams,urlParams.get('s'))
    // param_schueler_id=Number(urlParams.get('s'));

    // alert(urlParams.get('s')+" "+param_schueler_id+" "+urlParams.get('nr'))            
    // // console.log(param_schueler_id)
    // param_schueler_id=-1
    // if (automat) {
        
    //     $("#tabs").tabs({ active: tabN.TI});
    //     logged_IN(0);
    // } else {    


    //qr-code mit codierung s=codiert&nr=2 von der Klassenliste, nr wird unterhalb ausgelesen
    //wurde später angefügt, testen, ob es mit anderen bedingungen kollidiert.
    if (urlParams.get('s') != null) {
        param_schueler_id = Number(atob(decodeURIComponent(urlParams.get('s'))));
    }

    if (param_schueler_id >= 0) { // qr-code
        akt_schueler_nr = Number(urlParams.get('nr'));
        akt_schueler_id = param_schueler_id;

        //automatikschüler
        if (param_schueler_id == 0) {
            //nur wp-aufruf
            ein_bestimmer_wp(wp)
        } else {
            setCookie("akt_schueler_nr", akt_schueler_nr);
            get_set_data("get_klasse_id", "get_klasse_id", param_schueler_id);
        }
        // }
    } else {
        
        if (getCookie("akt_klasse_code") != "") {
            get_set_data("get_klasse_code", "get_klasse_code", getCookie("akt_klasse_code"));
            $("#tabs").tabs({ active: tabN.TL });
            // $("#AB").show();
            logged_IN(1);
        } else {
            $("#tabs").tabs({ active: tabN.TI });
            logged_IN(0);
            // alert("no")
            // $("#AB").hide();
        }
    }
    
    // make_screenshot("Test")

    $("#kl_feedback").css("color", stand_color);

    ur_bk = getStyle("#kl_feedback", "background-image");
    ur_col = getStyle("#kl_feedback", "color");
});

function anmeldungseite_einblenden() {
    $("#tabs").tabs({ active: tabN.TL });
}

function ohne_anmeldung() {
    akt_klasse_id = 0;
    console.log("schueler_id 0", akt_schueler_nr);
    $("#tabs").tabs( "enable", tabN.TW );
    $("#tabs").tabs({ active: tabN.TW });
    
    wplan_lesen(0);
}

function ein_bestimmer_wp(nr) {
    akt_klasse_id = nr;
    akt_schueler_id=0;
    // alert(akt_klasse_id)                
    $("#tabs").tabs( "enable", tabN.TK );
    $("#tabs").tabs({ active: tabN.TK });
}


function uebertragen_formate() {
    stand_color = getStyle("#TL", "color");
}

function testbaa() {
    const d = new Date();
    let time = d.getTime();
    if (window.navigator.standalone) {
        alert("fullscreen" + "istouch" + isTouch);
    }
    console.log("touch", window.navigator.standalone, time);

}

function zeige_fs_icon(win_w, win_h) {
    let zeige = 0;
    if (isTouch) {
        $("html").css("font-size", "1.2vw");

        a_screen = [screen.width, screen.height];
        if (window.navigator.standalone) {
            fs_mode = 3;
            $("#ul_top").css("padding-top", "8px");
        } else {
            zeige = 1;
            if (!a_screen.includes(win_h)) {
                fs_mode = 2;
                $("#ul_top").css("padding-top", "16px");
            }
        }
    } else {
        // if (screen.height!=win_h) {
        zeige = 1;
        // } 
    }
    if (zeige) {
        $("#fs_icon").show(1000);
    } else {
        $("#fs_icon").hide(1000);
    }

}

function baa_resize() {
    [win_w, win_h] = get_window_size();

    zeige_fs_icon(win_w, win_h);


    let padd = parseInt($("#tabs").css("padding"));

    let $wpanel = $("div#tabs-W.ui-tabs-panel");
    let offs = $wpanel.offset(); // offset ist immer eines weiter unter als position.
    let pos = $wpanel.position();

    let h_innen = win_h - offs.top;
    let h_innen_real = h_innen - 2 * padd;
    // let h_innen_real=h_innen-4*padd;
    // $("#cont_uebungen").width(win_w - 14).height(h_innen_real);




    acc_breite = "8%";
    $("#ueb_acc").css("flex", "0 0 " + acc_breite);

 


    $("#tabImg").width(acc_breite);

    $("#cont_uebungen").width(win_w - 14).height(h_innen_real);

// $("#cont_uebungen").width(win_w - 14).height(h_innen_real/2);


    if (fs_mode == 2) {
        if (fs_mode == 2) { //pad fullscreen-tab
            // alert(1)
            // $("html").css("position","fixed");
            // $("body").css("position","fixed")
        }
    }
}



function open_sketch() {
    if (["TW", "TK"].includes(aktiver_tab)) {
        // alert("stift="+$("#stift_zch").attr("art"))
        let art = Number($("#stift_zch").attr("art"));
        if (art == 1) { //foto apparatABMELDUNGAnmeldung
            hole_zuerst_protok_id("foto");
        }
        if (art >= 2) { //
            set_sketch(9);
        }
    }
}

function acc_init() {
    if ($(".ui-accordion").length == 0) {
        var icons = {
            header: "ui-icon-circle-arrow-e",
            activeHeader: "ui-icon-circle-arrow-s"
        };
        $("#ueb_acc").accordion({
            heightStyle: "content",
            collapsible: true,
            // icons: false,
            active: akt_wplan_open
        });

    } else {


        $("#ueb_acc")
            .accordion({ active: "none" })
            .accordion("refresh")
            .accordion("option", "active", akt_wplan_open);
    }
}




// #############################################################
// #####################   A N M E L D U N G   #################
// #############################################################


function ABMELDUNG() {
    if ($("#TL").text() == "Anmeldung") {
        anmeldungseite_einblenden();
    } else {
        del_cookies_und_var_string(["akt_klasse_code", "akt_klasse_id", "akt_schueler_id", "", ""]);

        $("#schueler_3,#passwort_3").css("visibility", "hidden");

        $("#kl_feedback").text("Derzeit ist keine Klasse angemeldet.");

        // anmelde_daten_zeigen(0); //
        neu = document.location.pathname;
        document.location.href = neu;
        // $("#tabs").tabs({ active: tabN.TI });
        // $("#kl_abmelden").addClass("hid");
        // $("#tabs").tabs({ active: 1});
        // document.location.reload(1);
    }
}

function logged_IN(bin_angemeldet = 0) {
    // if (bin_angemeldet) {
    //     $("#AB").show();

    // } else{
    //     $("#AB").hide();
    // }
    $("#TL").text(["Anmeldung", "ABMELDUNG"][bin_angemeldet]);

}



function anmelde_daten_zeigen(schalte_wp_tab = 0) {
    akt_klasse_id = getCookie("akt_klasse_id");
    akt_schueler_id = getCookie("akt_schueler_id");
    let $tab_info = $("#tab_info").children("span");
    $("#sch_feedback").html("---");
    if (akt_klasse_id == "") {
        $tab_info.text("");

        $("#tabs").tabs("disable", tabN.TW).tabs("disable", tabN.TK).tabs("disable", tabN.TP);

        $("#tab_info").find("a").text("Anmeldung");
        $("#sch_feedback").html("Niemand angemeldet!");
    } else {
        // $("#tabs").tabs("enable", tabN.TW);

        if (akt_klasse_id == 82) { //demoklasse
            $("#demo_info").html("<br><br><b>Wähle nun zu Demonstrationszwecken eine SchülerIn aus s1 bis s10 und arbeite in den Wochenplänen.</b>");
        } else {
            $("#demo_info").text("");
        }
        $tab_info[0].innerText = getCookie("akt_klasse_kzz");
        if (akt_schueler_id != "") {
            $("#tabs").tabs("enable", tabN.TW);
            if (anzahl_wp > 0) {
                $("#tabs").tabs("enable", tabN.TK);
            }
            $("#tabs").tabs("enable", tabN.TP);
            $tab_info[1].innerText = "s" + getCookie("akt_schueler_nr") + "/" + getCookie("akt_schueler_id");
            $("#sch_feedback").html("Du bist derzeit als Biber '" + "s" + getCookie("akt_schueler_nr") + "' angemeldet und kannst in den Wochenplänen üben!");
            logged_IN(1);
            // $("#AB").show();
        }
        $("#tab_info").find("a").text("ABMELDUNG");
    }
    let info = "";
    if ((akt_klasse_id != "") && (akt_schueler_id != "")) {
        // info = "Hallo Biber <b>'s" + getCookie("akt_schueler_nr") + "'</b>";
        info = "Hallo Biber s" + getCookie("akt_schueler_nr") + "!";
    } else {
        info = "Hallo Biber <b>Unbekannt - bitte Anmeldung wählen</b>!";
        schalte_wp_tab = 0;
    }
    $("#user_aktuell").html(info);

    if (schalte_wp_tab) {
        // $("#tabs").tabs("active", 3);
        // alert("vorher")
        let wplan_tab = tabN.TW; //1 oder 2
        if (getCookie("akt_wplan_tab") == tabN.TK) {
            wplan_tab = tabN.TK;
        }
        $("#tabs").tabs({ active: wplan_tab });
    }
}



function set_akt_wplan(id) {
    akt_wplan_id = id;

    setCookie("akt_wplan_id", akt_wplan_id);

    let $obj = $("h3#" + id);
    const dat = $obj.attr("datum");
    const bez = $obj.attr("bez");


    $("#uebung_ifr_H").attr("src", "../assets/html/hgbild_anim.html?ues=" + bez + "&datum=" + dat + "&wpid=" + id);

    // elem_mark("w", id);
    // $("#akt_wplan").text($("#w" + id).text());
    // $(".akt_wp").text($("#w" + id).text());
    // if (!wplan_edit_flag) {
    //     wplan_ruft_uebg(id);
    // }
}

function set_akt_wplan_protok(id) {
    let $obj = $("h3#" + id);
    const dat = $obj.attr("datum");
    const bez = $obj.attr("bez");
}


function set_akt_uebung(id) {
    akt_uebung_id = id;
    setCookie("akt_uebung_id", id);

    // elem_mark("w", id);
    // $("#akt_wplan").text($("#w" + id).text());
    // $(".akt_wp").text($("#w" + id).text());
    // if (!wplan_edit_flag) {
    //     wplan_ruft_uebg(id);
    // }
}


// #############################################################
// ##############   K L A S S E N ################
// #############################################################
function anmeldung_klasse_code() {
    del_cookies_und_var_string(["akt_klasse_code", "akt_klasse_id", "akt_schueler_id", "", ""]);

    $("#schueler_3,#passwort_3").css("visibility", "hidden");
    $("#tabs").tabs("disable", tabN.TP);

    akt_klasse_code = $("#code_zeile").text();
    get_set_data("get_klasse_code", "get_klasse_code", $("#code_zeile").text());

    // $("#kl_abmelden").removeClass("hid");
}

function auswertung_klasse_code(a_data) {
    // setCookie("akt_klasse_kzz", "");
    // setCookie("akt_schueler_id", "");
    // console.log(a_data[0].anzahl)

    anzahl_wp = a_data[0].anzahl_wp;
    // if (anzahl_wp==0) {
    //     $("#tabs").tabs("disable", tabN.TK);
    // }
    if (a_data[0][0] == "not found") {
        $("#kl_feedback").text("Leider - keine Klasse gefunden!");
        setCookie("akt_klasse_id", "");
        beep("no");
    } else {
        akt_klasse_code = a_data[0].klasse_code;
        setCookie("akt_klasse_code", akt_klasse_code);
        setCookie("akt_klasse_id", a_data[0].klasse_id);
        setCookie("akt_klasse_kzz", a_data[0].klasse_kzz);


        $("#code_zeile").children("span").each((idx, elem) => {
            $(elem).text(akt_klasse_code[idx]);
        });

        // $("#code_zeile").text(a_data[0].klasse_code);

        // console.log(a_data);
        $("#kl_feedback").text("Klasse: " + a_data[0].klasse_kzz);
        $("#cont_schueler_liste").text("");
        $("#schueler_3").css("visibility", "visible");
        a_data.forEach((data, idx) => {
            // erster satz ist die klassenbezeichnungm daher erst ab 1
            if (idx > 0) {
                $("#cont_schueler_liste").append("<a class='ui-button ui-widget ui-corner-all' href='#' id='" + data.schueler_id + "' nr='" + idx + "'>s" + idx + "</a>");
                // console.log(data.schueler_id,data.schueler_nr);
            }
            if (data.schueler_id == getCookie("akt_schueler_id")) {
                elem_mark("s", data.schueler_id);
            }
        });
        $("#cont_schueler_liste").click(function (evt) {
            elem = evt.target;
            // console.log(evt.target,evt.currentTarget)
            if (elem.tagName == "A") {
                akt_schueler_id = elem.id;
                setCookie("akt_schueler_id", elem.id);
                setCookie("akt_schueler_nr", elem.getAttribute("nr"));
                elem_mark("s", elem.id);

                anmelde_daten_zeigen(1);
            }

        });
    }
    anmelde_daten_zeigen(0);
}

// nach qr-codeanmeldung
function auswertung_klasse_id(a_data) {
    // setCookie("akt_klasse_kzz", "");
    // setCookie("akt_schueler_id", "");

    if (a_data.length == 0) {
        $("#kl_feedback").text("Leider - deine Klasse wurde nicht gefunden!");
        ABMELDUNG();
        // setCookie("akt_klasse_id", "");
        beep("no");
    } else {
        anzahl_wp = a_data[0].anzahl_wp;
        console.log("anzahl_wp", anzahl_wp);
        akt_klasse_code = a_data[0].klasse_code;
        akt_klasse_id = a_data[0].klasse_id;
        setCookie("akt_klasse_code", akt_klasse_code);
        setCookie("akt_klasse_id", a_data[0].klasse_id);
        setCookie("akt_klasse_kzz", a_data[0].klasse_kzz);
        setCookie("akt_schueler_id", akt_schueler_id);

        // console.log(a_data);
        $("#kl_feedback").text("Klasse: " + a_data[0].klasse_kzz);
        $("#cont_schueler_liste").text("");
        $("#tabs").tabs({ active: tabN.TW }).tabs({ active: tabN.TK });
        anmelde_daten_zeigen(1);
    }

}











// #############################################################
// ##############   W O C H E N P L A N Übungen ################
// #############################################################
function wplan_lesen(p_kl_id) {
    // alert(akt_klasse_id)
    // alert("lese_wp_up"+p_kl_id)
    get_set_data("kl_wp_ub", "load", p_kl_id);
    
    // get_set_data("uebungen","load", data, lehrerflag = 0) 
}


function player_show_uebungen(alle) {
    function umbruch(txt) {
        return txt.replace(/- /,"-<br>");
    }


    $("#ueb_acc").html("");
    let wplan_id_last = -1;
    // let elem = "<h3 id='0' onclick='set_akt_wplan(this)'>WP-1</h3>";
    let nachspann = "",
        vorspann = "<div>";
    let gesamt = "";
    let a_samm = [];
    let nachrichten = "";
    let anz = 0;
    // console.log(alle)
    alle.forEach((data) => {
        if (data.wplan_id != wplan_id_last) {
            let a_tmp = data.wplan_datum.split("-");
            let dat = a_tmp[2] + "." + a_tmp[1] + "." + a_tmp[0];
            let datum = "<span class='datum'>" + dat + "</span>";
            let bez = data.wplan_bez;

            // console.log(bez,datum)

            // let h3 = `${nachspann}<h3 id='${data.wplan_id}' onclick='set_akt_wplan(${data.wplan_id})' class='butt_acc_header' bez='${bez}' datum='${dat}'>${bez}${datum}</h3>${vorspann}`;
            let h3 = `${nachspann}<h3 id='${data.wplan_id}' onclick='set_akt_wplan(${data.wplan_id})' class='butt_acc_header' bez='${bez}' datum='${dat}'>${bez}</h3>${vorspann}`;
            gesamt += h3;
            nachspann = "</div>";
            a_samm.push(Number(data.wplan_id));
            anz++;
        }
        let externFlag = "";
        if (data.uebung_max == "1") {
            externFlag = " rot";
        }
        butt = `<button id='${data.uebung_id}' class='${externFlag} ui-button ui-corner-all wb_uebg_butt' onclick='wplan_app_aufruf(this,${data.uebung_max},${data.uebung_stift},${data.wplan_id})' uebung_link='${data.uebung_link}' uebung_titel='${data.uebung_titel}'>${umbruch(data.uebung_kzz)}</button>`;
        
        gesamt += butt;
        wplan_id_last = data.wplan_id;
        // console.log(data.uebung_id)
    });
    let gefunden = 0;
    if (anz > 0) {
        // console.log(a_samm,getCookie('akt_wplan_id'),a_samm.indexOf(getCookie('akt_wplan_id')),getCookie('akt_wplan_id'))

        let pos = Math.max(0, a_samm.indexOf(Number(getCookie('akt_wplan_id'))));
        let found_id = a_samm[pos];
        gefunden = found_id;
        // set_akt_wplan(found_id);

        akt_wplan_open = pos;
        nachricht = "Wähle deine Übungen aus einem Wochenplan aus (seitliche Leiste).";
    } else {
        gesamt = "<h3>Keine Klassen- Woche- pläne</h3>";
        nachricht = "Noch keine Wochenpläne freigegeben.";
    }
    info_hintergrund("#uebung_ifr_H", nachricht);
    // $("#tabs").tabs({ active: 1 });

    $("#ueb_acc").append(gesamt);
    // if (alois==0) 
    if (gefunden) {
        acc_init();
    }
    // acc_init();

    //andieser position, weil der DOM in der vorzeile geschaffen wird
    if (gefunden) set_akt_wplan(gefunden);

    if (automat) {
        setTimeout(function() {
            console.log("automat:",automat)
            $(`#${automat}`).trigger("click");
            automat=0;
        },1000)
    }
}

//aufruf von wplan-Haupt-schueler
function wplan_app_aufruf(obj, umax, ustift = 0, wplan) {
    if (canvas_on) {
        set_sketch(0);
    }

    // alert("ustift"+ustift)
    //wichtig damit der wplan mitgespeichert wird
    protok_wplan_id_save = wplan;

    akt_uebung_id = $(obj).attr('id'); //wichtig für die speicherung

    let adr = $(obj).attr("uebung_link");
    elem_mark("u", akt_uebung_id);

    // if ($(obj).attr("uebung_titel")>" " && $(obj).attr("uebung_titel") != "null") {
    //     zeige_hinweis($(obj).attr("uebung_titel"), adr, umax, "");
    // } else {
    //     prg_aufruf_zentral(adr, umax, "H", 0);
    // };

    aufruf_verteiler(adr, umax, ustift, fr_nr = "H", $(obj).attr("uebung_titel"), 0);
    // console.log(obj, adr);
    mark_uebung($(obj).attr("id"));
}

let infotext = "";

function aufruf_verteiler(adr, umax, ustift, ifr_nr = "H", dialog_hinweis, scroll_flag) {
    infotext = dialog_hinweis;
    if (dialog_hinweis > " " && dialog_hinweis != "null" && !adr.includes("leer_text")) {
        zeige_hinweis(dialog_hinweis, adr, umax, ustift, ifr_nr, scroll_flag);
    } else {
        prg_aufruf_zentral(adr, umax, ustift, ifr_nr, scroll_flag);
    }
}


function zeige_hinweis(info, adr, umax, ustift, ifr_nr = "H", scroll_flag = 0) {
    // dialog("H I N W E I S",info);
    $("#dialog_allgemein").dialog({
        title: "Ü B U N G S H I N W E I S",
        width: "40vw",
        modal: true,
        buttons: {
            Weiter: function () {
                // if (scroll_flag) {
                //     scroll_up("",2000);
                // }
                prg_aufruf_zentral(adr, umax, ustift, ifr_nr, scroll_flag);
                $(this).dialog("close");
            }
        }
        // position: { my: "center", at: "center" }
    }).find("#dialog_info").html("<span id='uebg_hinweis'>" + info + "</span>")
        .css("z-index", 1000);
}


function prg_aufruf_zentral(adr, umax = 0, ustift = 0, ifr_nr = "H", scroll_flag = 0) {
    function make_camera(flag) {
        $("#stift_zch").attr("src", `../assets/icons/${['pinsel', 'fotocam'][flag]}.png`);
        $("#stift_zch").attr("title", ['Zeichnung erstellen', 'Bildschirmfoto abgeben'][flag]);
    }
    // if (adr.indexOf("puzzle") > -1) {
    //     adr = adr + "&prgruf=dc";
    // }
    // if (adr.indexOf("robobee") > -1) {
    //     adr = adr + "&prgruf=dc";
    // }
    // if (adr.indexOf("/pdfs/") > -1) {
    //     if (adr.indexOf(".png") > -1) {
    //         adr=adr_korrektur(adr);
    //     }

    // }

    // console.log("aufruf - akt:", umax,akt_schueler_id, akt_uebung_id,adr);

    startzeit = new Date();
    user_sk_level = 0;

    $("#stift_zch").attr("art", ustift);

    if (ustift == 0) {
        $("#stift_zch").hide();

    } else if (ustift <= 2) { //camera
        if (ustift == 1)
            make_camera(1);
        else
            make_camera(0);

        $("#stift_zch").show();
    } else {
        user_sk_level = ustift - 3;
        if (ustift == 3) user_sk_level = 0; //alle werkzeuge auch beim direkteinstieg
        
        setTimeout(() => {
            set_sketch(1,"auto");
        }, 500);

        $("#stift_zch").show();
    }
    //console.log("baa - user_sk_level=",user_sk_level)

    adr = adr_korrektur(adr);
    // alert("neue: "+adr+" ifr_nr:" + ifr_nr);
    if (umax) {
        window.open(adr);
    } else {
        if (scroll_flag) {
            // alert("scroll")
            scroll_up("#tabs-P");
        }
        // console.log("ifr:", "umax=", umax, "ifrnr=", ifr_nr, "sch", akt_schueler_id, akt_uebung_id, adr);
        $ifr = $("#uebung_ifr_" + ifr_nr);
        $ifr.attr("src", adr).focus();

        if (adr.includes("leer_text")) {
            let reg = /\n/g;
            infotext = infotext.replace(reg, "<br>");

            $ifr.hide();

            // let doc=$ifr[0].contentWindow.document.body.innerHTML="";
            // $ifr[0].contentWindow.document.body.innerHTML=infotext;
            // $(doc).find("body").html(infotext);

            $ifr.slideDown(1000, function () {
                // Animation complete.
                $ifr[0].contentWindow.document.body.innerHTML = infotext;
            });




        }


        // container.tabIndex = 1;
        // focus it
        // also stage will be in focus on its click


        // console.error("************************************ hier");
        // console.log(document.getElementById("uebung_ifr_" + ifr_nr).contentWindow.document);
        // console.error("************************************ hier");
    }
}


function hole_wpl() {
    get_set_data("wplan", "load", akt_klasse_id, JSON.stringify([{ "akt_lehrer_id": "s", "akt_schueler_id":  akt_schueler_id }])); //nur lehrer id- hier nur flagfunktion - bei 100 (publiclehrer) nicht doppelte bekommt
}



function sch_protok_load(wp_id) {
    // alert(wp_id)
    protok_wplan_id_save = wp_id; //hier wird entschieden, ob das protokoll von der gesamtsammlung kommt (wplan_id=0) oder einer definierten Wplan
    get_set_data("sch_protok", "sch_protok", akt_schueler_id, JSON.stringify([{ "wplan_id": wp_id }]));
}


function uebung_liste(data) {
    console.log(data);
}




// ###################################################################
// ##############    WPLAN-Protokolle Meine Ergebnisse ###############
// ###################################################################
let last_wp_button="";
function wplan_show(data, len) {

    // console.log("data",data)


    function click_evt(evt) {
        // set_akt_wplan(evt.data.id, evt.data.bez, 1, 0);
        // console.log("evt",evt.target)
        last_wp_button=evt.target
        mark_wplan(evt.data.id);
        sch_protok_load(evt.data.id);
        // wplan_ruft_uebg(evt.data.id);
    }

    // let pub = " hid";
    // if (akt_lehrer.id == 100) {
    //     pub = " ext";
    // }


    $("#cont_protok").html("<hr>Mit einem Wochenplanbutton kannst du als angemeldete Person deine Ergebnisse abrufen.");

    let elem = "<div class='wp_input ui-button ui-widget ui-corner-all' title='Ergebnisse aller Übungen'></div>";
    const cont_elem = "<div id='wplan_mein'><span class='priv_pub'>Klassen WP:</span></div><hr>";
    const cont_elemx = "<div id='wplan_ext'><span class='priv_pub'>Externe WP:</span></div>";


    // $("#cont_wplan").html(cont_elem + cont_elemx);
    $("#cont_wplan").html(cont_elem + cont_elemx);

    {
        let a_bez = [];
        let a_samm = [];
        let anz = data.length;

        for (let i = 0; i < anz; i++) {
            // console.log(data[i].wplan_public)
            if (data[i].wplan_public == "0") {
                $("#wplan_mein").append(elem);
            } else {
                $("#wplan_ext").append(elem);
            }
            // console.log(data[i].wplan_public)
        }


        $("#cont_wplan").find(".wp_input").each(function (idx) {
            $elem = $(this);

            ein_satz = data[idx];
            $elem.attr("id", "w" + ein_satz.wplan_id);
            $elem.attr("wplan_id", ein_satz.wplan_id);
            // console.log(idx,ein_satz.wplan_frei)
            // if (ein_satz.wplan_public == "1") $elem.find("#wplan_public").prop('checked', true);

            $elem.text(ein_satz.wplan_bez);
            // $elem.find(".wp_datum").val(konvert_datum("e", ein_satz.wplan_datum));

            $elem.click({ id: ein_satz.wplan_id, bez: ein_satz.wplan_bez }, click_evt);

            a_samm.push(Number(ein_satz.wplan_id));
            a_bez.push(ein_satz.wplan_bez);

        });
        // $("#wplan_mein").prepend("<span> oder aus einzelnen: </span><br>");
        // $("#cont_wplan").append("<hr>" + elem);        
        $("#cont_wplan").prepend(elem+"<hr>");
        $(".wp_input").first()
            .text("Meine Ergebnisse aus allen Wochenplänen")
            .attr("id", "w" + 0).attr("wplan_id", 0)
            .click({ id: 0, bez: "Alle" }, click_evt);


        // if (anz > 0) {
        //     // $("#a3 .cont_ues #a_bez").text(a_bez.join(", "));
        //     // let pos = Math.max(0, a_samm.indexOf(Number(getACookie('akt_wplan')[0])));
        //     // let found_id = a_samm[pos];
        //     // set_akt_wplan(found_id, data[pos].wplan_bez, 0, 0);
        // }


        // if (akt_lehrer.id == 100) {
        //     $("input.ext:checked").parent().css({ "background-color": "blue", "padding": "4px" });
        // }


    }
    // $("#wplan_ext").css({ "background-color": "#ccc", "padding": "4px" });
    // $("#wplan_mein").css({ "background-image": ur_bk, "color": ur_col, "font-weight": "bold" });
}




// ##################################################
// ##############    D I V E R S E S ################
// ##################################################
const last_e_mark = [];
last_e_mark['s'] = -1;
last_e_mark['k'] = -1;
last_e_mark['w'] = -1;
last_e_mark['u'] = -1;

function elem_mark(art, id) {
    // console.log("marker:", art, id, "alt:", last_e_mark[art]);
    if (last_e_mark[art] != -1) {
        $("#" + last_e_mark[art]).removeClass("mark_elem");
    }
    $("#" + id).addClass("mark_elem");
    last_e_mark[art] = id;
}

function show_bild_passwort() {
    $("#passwort_3").css("visibility", "visible");
}

function input_field() {
    $('input:text, input:password')
        .button()
        .css({
            'font': '2.5em',
            'color': 'inherit',
            'text-align': 'left',
            'outline': 'none',
            'cursor': 'text',
            'padding': '4px'
        });
}


function schloss_schalter(evt) {
    function get_zahl(add) {
        // beep("butt");
        sndClick.play();
        if (butt_nr == 0) {
            let bst = "ABCDEFGHJKLMNPQRSTUVWXYZ";
            let ll = bst.length;
            let feld = $code_leiste.children()[butt_nr];
            pos = bst.indexOf($(feld).text());
            $(feld).text(bst[(pos + ll + add) % bst.length]);
        } else {
            let feld = $code_leiste.children()[butt_nr];

            $(feld).text((Number($(feld).text()) + 10 + add) % 10);
        }
    }
    let schalter_nr = evt.target;
    let rahmen = evt.currentTarget;

    if (schalter_nr.tagName == "SPAN") {
        x0 = $(rahmen).offset().left;
        x1 = ($(schalter_nr).offset().left);

        let teil = Math.round($(rahmen).width() / 4);
        butt_nr = Math.floor((x1 - x0) / teil);

        is_oben = $(rahmen).hasClass("s_ob");
        // console.log(butt_nr, teil, x0, x1, x1 - x0, (x1 - x0) / teil);
        $code_leiste = $("#code_zeile");

        if (is_oben) {
            get_zahl(1);
        } else {
            get_zahl(-1);
        }
    }
}




function zeige_login(teil = "u") {
    $("#kLogin").hide(500);
    $("#uLogin").show(1500);

}



function dialog(titel, info) {
    $("#dialog_allgemein").dialog({
        dialog_info: info,
        title: titel,
        modal: true,
        buttons: {
            Weiter: function () {
                $(this).dialog("close");
            }
        }
    }).find("#dialog_info").html(info);

};





function make_demo_menu() {
    let a_wp = ["Ü1", "HÜ2", "HÜ3", "HÜ4", "HÜ5"];
    a_wp.forEach(function (wert) {
        butt = "";
        for (let i = 0; i < 8; i++) {
            butt += "<button class='butt'>" + "Ü" + (i + 1) + "</button>";
        }
        let elem = `<h3>WP-${wert}<span class='datum'>24.12.23</span></h3>`;
        elem += "<div>" + butt + "</div>";

        $("#ueb_acc").append(elem);
    });

}


function baa_scroll() {
    $("#tabs-P").scrollTop(1000);
    // scroll_up();
}



var last_uebung_mark = "0";
function mark_uebung(ueb_id) {
    if ("#" + ueb_id != last_uebung_mark) {
        $("#" + last_uebung_mark).removeClass("ring_mark");
    }
    $("#" + ueb_id).addClass("ring_mark");
    last_uebung_mark = ueb_id;
    // console.log(ueb_id);
}


var last_wplan_mark = "0";
function mark_wplan(wp_id) {
    if ("#w" + wp_id != last_wplan_mark) {
        $("#w" + last_wplan_mark).removeClass("rot_mark");
    }
    $("#w" + wp_id).addClass("rot_mark");
    last_wplan_mark = wp_id;
    // console.log(ueb_id);
}



// #############################################################
// ###################### SCREENSHOT  ##########################
// #############################################################

function make_screenshot(upl_bildname = "screenshot") {
    document.getElementById("SS").addEventListener("click", function () {


        var canvas = document.getElementById("mathCanvas");
        var img = canvas.toDataURL("image/png");

        document.getElementById("img_sshot").setAttribute("src", img);
        document.getElementById("img_sshot").style.visibility = "visible";
        if (upl_bildname != "screenshot") {
            // document.getElementById("a_img_sshot").setAttribute("href", "temp/" + upl_bildname + ".png");
            // document.getElementById("img_sshot").style.backgroundColor = '#666666';
            img_to_server(img, upl_bildname);
        }
    });
}





function screenShotIcon_vis(flag) {
    if ((flag) && (!isMobile)) {
        document.getElementById("b_make_image").style.visibility = "visible";
    } else {
        document.getElementById("b_make_image").style.visibility = "hidden";
    }
}



is_landscape=window.matchMedia('(orientation: landscape)').matches;
if (!is_landscape) {
    alert("Diese Seite muss im Breitformat dargestellt werden - bitte Handy/Tablet drehen!");
}



function clipboard() {

    // document.onpaste = function(pasteEvent) {
    // consider the first item (can be easily extended for multiple items)
    // var item = window.clipboardData.items[0];
    // console.log(window.clipboardData.getData("image/png"));
    if (item.type.indexOf("image") === 0) {
        var blob = item.getAsFile();

        var reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById("container").src = event.target.result;
        };

        reader.readAsDataURL(blob);
    }
    // }

}


function comp_einstellungen(flag) {

    $("#app_fenster_3").attr("src", "../assets/html/ipad_einstellungen.html?" + flag + "&color=" + encodeURIComponent(stand_color));
    $("#dialog_benotung").dialog({
        title: "Tipps",
        modal: true,
        width: "80%",
        // height:"700px",
        // buttons: {
        //     Schließen: function () {
        //         $(this).dialog("close");
        //     }
        // }
    });

}


function pdf_viewer() {
}


function drucken() {
    document.getElementById("uebung_ifr_H").contentWindow.print();
//     window.frames["uebung_ifr_H"].focus();
//     window.frames["uebung_ifr_H"].print();

}