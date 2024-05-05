/* 
var s_1="LTE%3D%3D";
https://baa.at/projekte/dc/lib/player.html?s=LTE%3D
*/
var zch2 = "&#9662;";
var zch = "&#9656;";

var int_blink = 0;
var uebung_anz = 0;



var akt_lehrer = {};
var akt_klasse = { id: "", kzz: "" };

var akt_schueler = {};
var akt_wplan = { id: "", bez: "" };
var akt_uebung = { id: "", kzz: "" };


var klassen_edit_flag = 0;
var schueler_edit_flag = 0;
var wplan_edit_flag = 0;
var uebung_edit_flag = 0;
var akt_klasse_code = "";
var akt_modus = 0;
var schueler_zahl = 0;

var meine_klassen=[];

// var akt_uebung_id=0; kommt von allgemein
prg = "dcm";

load_theme(prg);

var ur_bk, ur_col;




$(document).ready(function () {
    // $("#navbar").html(htm);
    // $( "radio-1").checkboxradio();
    // $( "fieldset" ).controlgroup();

    // $(".widget").find("input").checkboxradio();
    // $(".widget").find("fieldset").controlgroup();

    $("#cont_butt_lapps").css("display","none");

    if (getCookie("akt_modus") != "") {
        set_modus(Number(getCookie("akt_modus")), 1);
    }


    // mg_acc = $('#navbar').mgaccordion({ theme: 2, leaveOpen: false });
    anzeige_schalter_login(0);
    $("#tabs").tabs({
        active: 0,
        heightStyle: "content",
        disabled: [1, 2, 3, 4, 5],
        width: 1024,

        activate: function (evt, ui) {

            // console.log("neu",ui.newTab[0],"old",ui.oldTab[0])
            //welche tabs wurde geschlossen
            if (ui.oldTab[0].id == "KL") {
                if (klassen_edit_flag) {
                    alert("Fehler:\nKlassenspeicherung wurden vergessen!");
                    set_klassen_edit(0);
                }
            }
            if (ui.oldTab[0].id == "WP") {
                if (wplan_edit_flag) {
                    // alert("Fehler:\nWochenplanspeicherung wurden vergessen!");
                    wplan_save();
                    set_wplan_edit(0);
                }
            }
            if (ui.oldTab[0].id == "UB") {
                // blink_schalter(0);
                if (uebung_edit_flag) {
                    // alert("Fehler:\nÜbungsspeicherung wurden vergessen - bitte noch einmal kontrollieren!");
                    uebungen_save();
                    set_uebung_edit(0,0);
                }
            }


            let targ = ui.newTab[0];
            if (targ.id == "SC") {
                if (Number(akt_klasse.id) > 0) {
                    // wplan_lesen(akt_klasse.id);
                    rufe_sch(akt_klasse.id);
                } else {
                    alert("Keine Klassen-ID bekannt!");
                }
            }
            // if (targ.id == "WP") { //wird mit der klasse schon aufgerufen
            //     if (akt_klasse.id != "") {
            //         rufe_wplan(akt_klasse.id);
            //     } else {
            //         alert("Keine Klassen-ID bekannt!");
            //     }
            // }
            if (targ.id == "UB") {
                // console.error("wochenplan id",akt_wplan.id,Number(akt_wplan.id))
                if (akt_wplan.id != "") {
                    // $("#tabs").tabs({ disabled: [] });
                    rufe_uebg(akt_wplan.id);
                } else {
                    alert("Kein Wochenplan gewählt!");
                    $("#tabs").tabs({ active: 3 });
                    // $("#tabs").tabs({ disabled: [4] });

                }
            }
        }
    });

    $("button").addClass("ui-button ui-widget ui-corner-all");
    // $(".eine_klasse").addClass("ui-widget-content")
    // $('.aussen').css("background", "var(--button_background)");

    add_theme();
    make_app_button();
    // console.log(document.cookie)
    if (getACookie("akt_lehrer")[0] != "") {
        login_lehrer("id", Number(getACookie("akt_lehrer")[0]));
        // init_anzeige(1);
    } else {
        init_anzeige(0);
    }

    // demo = 1;

    baa_resize();
    onresize = (event) => {
        setTimeout(function () {
            baa_resize();
        }, 500);
    };

    $("#cont_uebungen").sortable({
        items: '.eine_uebung',
        stop: function (event, ui) {
            $("#cont_uebungen").find(".eine_uebung").attr("chg", "1");
            $("#cont_uebungen").find(".eine_uebung").each(function (idx) {
                $(this).attr("sort", idx);
            });
        }
    });

    
    ur_bk = getStyle("#login_butt", "background-image");
    ur_col = getStyle("#login_butt", "color");


    //$("#chg_theme").text("Farbe: " + getCookie(prg + "akt_theme"));
});


function baa_resize() {

    // let padd = parseInt($("#tabs").css("padding"));
    // console.log(get_window_size())

    [win_w, win_h] = get_window_size();

    // console.log(win_w, win_h);
    // let $wpanel = $(".ui-tabs-panel");
    // let offs = $wpanel.offset();// offset ist immer eines weiter unter als position.
    // let pos =$wpanel.position();

    // let h_innen = win_h - offs.top;
    // let h_innen_real = h_innen - 2 * padd;
    // console.log(win_h+ "" + screen.height)

    if (win_h == screen.height) {
        $("#vb_info").hide();
    } else {
        $("#vb_info").show();
    }

    // p=$("#app_fenster_1").offset();
    $("#app_fenster_1").height(win_h*0.8);
    // console.log(p)

}


function open_lehrer() {
    $("#tabs").tabs({ disabled: [1, 2, 3, 4] });
}



// #############################################################
// ############################ L E H R E R L O G I N ##########
// #############################################################

function set_modus(flag, woher = 0) {
    akt_modus = flag;
    if (woher == 0) {
        setCookie("akt_modus", flag,7);
    }

    $("#m" + flag).css("border-width", "5px");
    $("#akt_modus").text(["Basis", "ExpertIn"][flag]);
    if (woher == 0) {
        $("#tabs").hide(400);
        setTimeout(() => {
            document.location.reload(1);
        }, 500);
    }
}

function anzeige_schalter_login(flag) {
    if (flag) {
        $("#lgON").show();
        $("#lgOFF").hide();
    } else {
        $("#lgON").hide();
        $("#lgOFF").show();

    }
}



function log_off() {
    tabs_hide([1, 2, 3, 4, 5]);
    $("#login_butt").text("Anmelden");
    del_cookies_und_var(["akt_lehrer", "akt_klasse", "akt_schueler", "akt_wplan", "akt_uebung"]);
    document.location.reload(0);
}

function info_lehrer() {
    let adr="https://dcm-learn.baa.at";
    window.open(adr,"Lehrer")
}

function login_lehrer(login_art, lid) {
    // zwei arten von Login PW oder cookie
    if (login_art == "pw") {

        let pw = $("#pw_e").val();
        $("#cont_email").hide();
        $("#pw_e").val("");

        del_cookies_und_var(["akt_lehrer", "akt_klasse", "akt_schueler", "akt_wplan", "akt_uebung"]);

        if ($("#login_butt").text() == "Abmelden") {
            log_off();
        } else {
            if (pw > "") {
                get_set_data("lehrer", "load", pw, [], "pw");
            }
        }
    } else { //über cookie
        $("#pw_e").val("");
        $("#cont_email").hide();

        get_set_data("lehrer", "load", lid, [], "id");
    }
}

function tabs_hide(arr) {
    $("#tabs").tabs({
        disabled: arr
    });
}


function lehrer_show(data, login_art) {
    // console.log("Datensätzeanzahl: ", data.length, "Lehrerdaten", data[0]);

    if (data[0].found == "not") {
        $("#akt_lehrer_name").html("Not found!");
        $("#cont_email").show(1000);
        tabs_hide([1, 2, 3, 4, 5]);

        alert_dialog("Achtung", "Kein User User mit diesen Daten vorhanden! Versuchen Sie es noch einmal.<br><br>Achtung - nach 4-maliger Falschanmeldung wird der Zugang gesperrt!");

        // $("#fehler").text("User unbekannt!");
        // $("#cont_email").show(1000);
    } else {
        $("#login_butt").text("Abmelden");
        $("#login_butt2").text("Abmelden");

        let lehrer = data[0];
        akt_lehrer.id = lehrer.lehrer_id;
        // console.log("ll",akt_lehrer.id)
        // akt_l_id=lehrer.lehrer_id;
        // $("#login_butt").text("Log off");
        $("#tabs").tabs({
            disabled: []
        });

        // setCookie("akt_lehrer_name",);
        setACookie("akt_lehrer", [data[0].lehrer_id, lehrer.lehrer_name]);
        localStorage.setItem("akt_lehrer_id",data[0].lehrer_id);
        localStorage.setItem("akt_lehrer_name",lehrer.lehrer_name);
        init_anzeige(1);

        klassen_show(data.slice(1));

        anzeige_schalter_login(1);



        let l_id=Number(lehrer.lehrer_id);
        if ((l_id==1) || (l_id==60)) {
            window.parent.filter_lapps=0;
        } else {
            window.parent.filter_lapps=1;
        }
    


        // alert(akt_l_id)
    }
}




function init_anzeige(loggedin) {
    if (loggedin) {

        $("#login_butt").text("Abmelden");

        $("#akt_lehrer_name").text(getACookie("akt_lehrer")[1]);
        $("#akt_user").text(getACookie("akt_lehrer")[1]);
        // $("#akt_klasse_txt").text("---");
        //$("#akt_schueler").text("---");
        // $("#akt_wplan").text("---");
        // $("#akt_uebung").text("---");
    } else {
        $("#login_butt").text("Anmelden");
        $("#login_butt2").text("-------------");
        $("#akt_lehrer_name").text("(Logged OFF");
        $("#akt_klasse_txt").text("---");
        $("#akt_schueler").text("---");
        $("#akt_wplan_txt").text("---");
        $("#akt_uebung").text("---");
        $("#akt_user").text("---");

    }
    // $("#akt_uebung").text("Keine Übung ausgewählt");
}


function dialog() {
    $("#dialog-message").dialog({
        modal: true,
        buttons: {
            Abbrechen: function () {
                $(this).dialog("close");
            },
            Speichern: function () {
                $(this).dialog("close");
            }
        }
    });
};



// ############### set editmodus allgemein
function switch_edit_farbe(flag, $auswahl, css_name) {
    let ed = $auswahl.first().hasClass(css_name);
    if (flag == -1) {
        ed = !ed;
    } else {
        ed = (flag ? true : false); //umdrehen
    }

    if (ed) {
        $auswahl.addClass(css_name);
    } else {
        $auswahl.removeClass(css_name);
    }
    return ed;
}

function set_klassen_edit(flag = -1) {
    let $alle_kl = $(".eine_klasse");

    const ed = switch_edit_farbe(flag, $alle_kl, "kl_edit");
    $alle_kl.find(".feldEd").attr("contenteditable", ed);

    // const tarn = $alle_kl.parent().parent().parent().find(".tarn");
    const elt = $alle_kl.parent().parent().parent();
    // const tarn = $alle_kl.parent().parent().closest(".tarn");
    if (ed) {
        elt.find(".tarn").removeClass("hid");
        elt.find(".notTarn").addClass("hid");
        // $("#alpha_txt").html("<b style='color:red'>Bitte größte Vorsicht, wenn man die Schülerzahl vermindert: Die dabei gelöschten SchülerInnen verlieren auch alle ihre erreichten Übungsziele (keine Rückgängigmachung möglich!!) Es können nur immer die SchülerInnen der hohen Nummern gelöscht.</b>");
        $("#alpha_txt").html("<b>Bitte die Schülerzahl genau angeben, keinen Überhang (Speicherplatzbedarf).</b>");

    } else {
        elt.find(".tarn").addClass("hid");
        elt.find(".notTarn").removeClass("hid");
        $("#alpha_txt").text("");
    }

    klassen_edit_flag = ed;
    // blinking_button_text(klassen_edit_flag, "#k_save");
}

function set_schueler_edit(flag = -1) {
    let $alle = $("#cont_schueler").find(".feldEd");

    const ed = switch_edit_farbe(flag, $alle, "edit");
    $alle.attr("contenteditable", ed);

    schueler_edit_flag = ed;
    // blinking_button_text(schueler_edit_flag, "#s_save");
}





function set_wplan_edit(flag = 0) {
    let $alle_wplan = $("#cont_wplan").find(".feldEd");

    const ed = switch_edit_farbe(flag, $alle_wplan, "edit");
    // $alle_wplan.attr("contenteditable", ed);
    // $alle_wplan.attr("disabled",[true,false][flag]);
    $alle_wplan.attr("readonly", [true, false][flag]);

    // const $schalter=$(".cont_butt_re_wplan");
    const $schalter = $(".cont_mitte.wplan");
    if (ed) {
        $schalter.find(".tarn").removeClass("hid");
        $schalter.find(".notTarn").addClass("hid");
        $schalter.find(".act").attr("disabled", false);
//console.log("s:",$schalter.find(".act"));
        $(".cont_butt_re_wplan>.info").html("<div style='text-align:center;color:red'><b>Nach dem Neuanlegen, Ändern oder Kopieren bitte Wochenplandaten speichern!</b></div>");

        $alle_wplan.find(".wp_datum").show();
        $("#cont_wplan").find(".wp_datum").removeClass("hid").css("font-weight", "normal");

        $alle_wplan.css("cursor", "text");
    } else {
        $schalter.find(".tarn").addClass("hid");
        $schalter.find(".notTarn").removeClass("hid");
        $schalter.find(".act").attr("disabled", true);

        $alle_wplan.css("cursor", "pointer");
        $(".cont_butt_re_wplan>.info").html("");

        $("#cont_wplan").find(".wp_datum").addClass("hid");
    }
    wplan_edit_flag = ed;
    // blinking_button_text(wplan_edit_flag, "#w_save");
}

let akt_edit_uebung_id="";

function set_uebung_edit(flag = -1, ev = 0) {

    let einzelflag = 0;
    // removeClass("b_ui-icon-bleist").addClass("b_ui-icon-disk");
    let $auswahl;
    if (ev == 0) { //alle übungen
        $auswahl = $(".eine_uebung"); 
        akt_edit_uebung_id="";
    } else {
        //einzelübungszeile übungszeile
        $auswahl = $(ev.target).parent().parent();
       
        // console.error("id=",$auswahl.attr("id"));
        akt_edit_uebung_id=$auswahl.attr("id");
        einzelflag = 1;
    }


    const ed = switch_edit_farbe(flag, $auswahl, "kl_edit");
    // $auswahl.find(".feldEd").attr("contenteditable", ed);
    $auswahl.find(".feldEd").attr("contenteditable", ed);
    $auswahl.find("input").attr("readonly", !ed);
    // $auswahl.find("input type='url'").attr("readonly", !ed);
    $auswahl.find("textarea").attr("readonly", !ed);
    $auswahl.find(".uebung_stift").first().attr("disabled", !ed);


    const $schalter = $("#tabs-UB");
    if (ed) {
        $auswahl.find(".uebung_titel").first().height(80);
        $auswahl.find(".b_ueb_edit").first().css("background-image", `url(${'../assets/icons/save.png'})`);
        set_uebungen_sortEA(1);
        // tarn_butt.removeClass("hid");
        $schalter.find(".tarn").removeClass("hid");
        $schalter.find(".notTarn").addClass("hid");

        if (ev==0) {
            uebung_edit_flag = 1; //bei globaledit
        } else {
            uebung_edit_flag = Number(akt_edit_uebung_id.substring(1));
        }
        
        // if (einzelflag) {
        //     $auswahl.attr("chg","1");
        // }

        // $( "#cont_uebungen").sortable("disable");
    } else {
        $auswahl.find(".b_ueb_edit").first().css("background-image", `url(${'../assets/icons/edit_bleist.png'})`);
        set_uebungen_sortEA(0);
        // tarn_butt.addClass("hid");
        $schalter.find(".tarn").addClass("hid");
        $schalter.find(".notTarn").removeClass("hid");
        // $( "#cont_uebungen").sortable("enable");

        // alert("einzelflag"+einzelflag)        
        uebung_edit_flag = 0;


        if (einzelflag) {
            if ($auswahl.attr("chg") == "1") {
                uebungen_save();
            }
        }


    }
    // uebung_edit_flag = ed;
    // blinking_button_text(uebung_edit_flag, "#u_save");
}



// #############################################################
// ############################ K L A S S E N ##################
// #############################################################
function set_akt_klasse(kid, kzz, akteur, sch_zahl = 0) {
    akt_klasse.id = kid;
    akt_klasse.kzz = kzz;

    // console.log(kid, kzz, akteur, sch_zahl, akt_klasse.id);
    elem_mark("k", kid);

    let kl_bez = $("#k" + kid).find(".klasse_kzz").first().text();
    $("#akt_klasse_txt").text(kl_bez + "/" + kid);
    akt_klasse_code = $("#k" + kid).find(".klasse_code").first().text();
    setACookie("akt_klasse", [kid, kl_bez]);

    $(".akt_kl").text(kl_bez);
    $("#cont_protok").text("");


    schueler_zahl = 0;
    if (!klassen_edit_flag) {
        if (akteur == "klick") {
            clean_last(["schueler", "wplan", "uebung"]);
        } else {
            $("#akt_wplan_txt").text("---");
            $("#akt_uebung").text("---");
        }

        klasse_ruft_sch_wplan(kid);
        $("#akt_schueler").text(sch_zahl);
    }

}


function klassen_show(data, len = 0) {
    let klasse_anz = 0;
    function click_evt(evt) {
        if ($(evt.target).parent().hasClass('trash')) {
            if (klasse_anz <= 1) {
                alert("Mindestens eine Klasse muss bestehen bleiben!");
            } else {
                klasse_del(evt.data.id, klasse_anz);
            }
        } else {
            set_akt_klasse(evt.data.id, evt.data.kzz, "klick", evt.data.sch_zahl);
        }
    }

    let kl_elem = "<div kl_id='0' class='eine_klasse' >";
        kl_elem += "Klasse:<span class='klasse_kzz feldEd cl'>Neu1A</span>";
        kl_elem += "Schüler:<span class='klasse_sch_zahl feldEd kl'>1</span>";
        kl_elem += "Klassencode:<span class='klasse_code feld'>xx</span>";
        kl_elem += "<span class='tarn trash hid' disabled><img src='../assets/icons/del.png' /></span>";
    kl_elem += "</div>";

    if (data == "neu") {//eine Klasse addieren
        // $k = $("#k_id0").clone().attr("id", "k" + vorh);
        $("#cont_klasse").append(kl_elem);
        $("#cont_klasse").find(".eine_klasse").last().addClass("wp_neu");
        //damit wird bei SCH neu eingelesen
        set_klassen_edit(klassen_edit_flag);
    } else {
        let a_bez = [];
        let a_samm = [];
        let anz = data.length;
        if (anz > 0) {
            if (data[anz - 1][0] == "fehler") {
                alert("Achtung Fehler: " + data[anz - 1][1]);
                tmp = data.pop();
                anz--;
            }
        }


        $("#cont_klasse").text("");
        for (i = 0; i < anz; i++) {
            $("#cont_klasse").append(kl_elem);
        }
        $("#cont_klasse").find(".eine_klasse").each(function (idx) {
            $zeile = $(this);
           
            ein_satz = data[idx];
            $zeile.attr("id", "k" + ein_satz.klasse_id);
            $zeile.attr("kl_id", ein_satz.klasse_id);
            $zeile.find(".klasse_kzz").first().text(ein_satz.klasse_kzz);
            // console.log(ein_satz.klasse_kzz);
            $zeile.find(".klasse_sch_zahl").first().text(ein_satz.klasse_sch_zahl);
            $zeile.find(".klasse_code").first().text(ein_satz.klasse_code);

            $zeile.click({ id: ein_satz.klasse_id, kzz: ein_satz.klasse_kzz, sch_zahl: ein_satz.klasse_sch_zahl }, click_evt);
            a_samm.push(Number(ein_satz.klasse_id));

            a_bez.push(ein_satz.klasse_kzz);
            meine_klassen.push([ein_satz.klasse_id,ein_satz.klasse_code,ein_satz.klasse_kzz]);
        });

   
        let found_id = 0;
        if (anz > 0) {
            let pos = Math.max(0, a_samm.indexOf(Number(getACookie('akt_klasse')[0])));
            let found_id = a_samm[pos];
            set_akt_klasse(found_id, data[pos].klasse_kzz, "auto", data[pos].klasse_sch_zahl);
        }
        klasse_anz = anz;

    }

    $(".eine_klasse").css({ "background-image": ur_bk, "color": ur_col, "font-weight": "bold" });
    $("#tabs").tabs({ active: 1 });

    if ($("#akt_lehrer_name").text()=="Demo") {
        setTimeout(()=> {
            console.log("bachinger - umschaltung")
            $("#tabs").tabs({ active: 3 });
        },300);
    }

}

function klassen_save() {
    set_klassen_edit(0);

    let vorh = $(".eine_klasse").length;
 
    if (vorh > 0) {
        let arr = [];
        $(".eine_klasse").each(function (idx) {
            $zeile = $(this);
            obj = {};
            obj.lehrer_id = akt_lehrer.id;
            obj.klasse_id = $zeile.attr("kl_id");
            obj.klasse_kzz = $zeile.find(".klasse_kzz").first().text();
            obj.klasse_sch_zahl = $zeile.find(".klasse_sch_zahl").first().text();
            arr.push(obj);
        });

        //console.log( JSON.stringify(arr))
        get_set_data("klassen", "save", akt_lehrer.id, JSON.stringify(arr));
    }
}

function klasse_del(nr) {

    $("#k" + nr).find(".klasse_kzz").text("LÖSCHEN").first();
    $("#k" + nr).hide(1000);


    // $("#u"+nr).attr("id",)
    // uebungen_save();
}

function clean_last(a_felder) {
    a_felder.forEach(function (feld) {
        $("#cont_" + feld).text("");
        $("#akt_" + feld).text("-");

        if (feld == "uebung") {
            $("#app_fenster_1").attr("src", leer_adr);
            // $("#app_hinweis").text("");
        }
    });
}


// #############################################################
// ########### S C H U E L E R #################################
// #############################################################
function rufe_sch(kl_id) {
    schueler_alle = [];
    akt_klasse.id = kl_id; //nur für den holprozess
    // clean_last(["schueler", "wplan", "uebung"]);
    clean_last(["schueler", "protok"]);
    get_set_data("schueler", "load", kl_id);
    // get_set_data("wplan", "load", []);
}


function klasse_ruft_sch_wplan(kl_id) {
    // schueler_alle = [];
    clean_last(["schueler", "wplan", "uebung"]);

    get_set_data("schueler", "load", kl_id, []);
    get_set_data("wplan", "load", kl_id, JSON.stringify([{ "akt_lehrer_id": akt_lehrer.id ,"akt_schueler_id": 0 }])); //akt_schueler_id wird nur mitgeliefert, damit keien fehler auf dc_api.php 760 entsteht
}

function sch_ruft_protok_load(sid) {
    // scroll_up();
    $("#cont_protok").text(""); //falls nichts gefunden wird
    get_set_data("sch_protok", "sch_protok", sid);

}



function set_akt_schueler(id, name, nachlade_flag = 1) {
    akt_schueler.id = id;
    akt_schueler.name = name;

    $("#akt_schueler").text($("#s" + id).text() + "/" + akt_schueler.id);


    setACookie("akt_schueler", [id, $("#s" + id).text()]);
    elem_mark("s", id);

    if (!schueler_edit_flag) {

        //hole ergebnisse
        if (nachlade_flag == 1) {
            $("#akt_sc").text($("#s" + id).text());
            sch_ruft_protok_load(id);
        }
    }
    // alert("akt-sch gesetzt"+id)
    console.log(`Ergebnisse für akt_SCH ${id} rufen`);
}


// var akt_schueler_liste=[];
function schueler_show(data, len) {
    function click_evt(evt) {
        akt_schueler_name = evt.data.name;
        set_akt_schueler(evt.data.id, evt.data.name);
    }

    akt_schueler_liste = [];
    let elem = "<button schueler_id='0' class='ui-button feld sch_butt'>.</button>";

    let anz = data.length;
    let a_samm = [];

    let i = 0;
    // console.log(data);

    // $("#cont_schueler").text(""); //wird mit clean_last erledigt
    for (i = 0; i < anz; i++) {
        $("#cont_schueler").append(elem);
    }
    i = 0;
    $("#cont_schueler").find(".feld").each(function (idx) {
        i++;
        $elem = $(this);
        ein_satz = data[idx];
        // console.log("ein_satz:",ein_satz)
        // if (ein_satz.schueler_nr == 0) { 
        ein_satz.schueler_nr = i;
        $elem.attr("id", "s" + ein_satz.schueler_id);
        akt_schueler_liste.push(ein_satz.schueler_id);
        $elem.attr("schueler_id", ein_satz.schueler_id);
        $elem.text("s" + i);
        $elem.click({ id: ein_satz.schueler_id, name: "s" + i }, click_evt);
        a_samm.push(Number(ein_satz.schueler_id));
    });
    if (anz > 0) {
        let pos = Math.max(0, a_samm.indexOf(Number(getACookie('akt_schueler')[0])));
        let found_id = a_samm[pos];
        set_akt_schueler(found_id, data[pos].schueler_nr, 0);
    }
    schueler_zahl = anz;
}


function get_schueler_qr_liste() {
    // $(document.activeElement).siblings().removeClass("hid");
    $("#cont_protok").html("<p class='nodata' >QR-Codes werden erzeugt - bitte warten ...</p>");
    $("#SL_druck").removeClass("hid");
    // $("#cont_protok").html("... bitte warten ...")
    setTimeout(() => {
        get_set_data("schueler", "schueler_liste", akt_klasse.id);
    }, 10);
}

function schueler_liste($data) {
    let qr_pfad = '../assets/qrcodes/';
    $aussen = $("#cont_protok");
    $aussen.html("<p class='nodata' style='color:unset'>Für den schnellen Funktionstest kann man auf einen QR-Code klicken und wechselt damit ins Schüler-Programm. Vorsicht: Wenn Sie dann Übungen durchführen, werden die Arbeitsergebnisse somit der SchülerIn gutgeschrieben!</p>");

    // $aussen.closest(".cont_haupt").find(".ues").text("");


    $aussen.append("<div id='druckbreite'></div>");
    $druckbereich = $("#druckbreite");
    let txt = "<div class='sch_druck_zeile'>";
    txt += "<h1>Schülerliste der Klasse " + akt_klasse.kzz + "<br>(Klassengeheimcode: " + akt_klasse_code + ")</h1><hr>";
    txt += "<h3>Programmzugang für SchülerInnen:<br>";
    txt += "Auswahl aus zwei Möglichkeiten:<br>";
    txt += "a) QR-Code scannen <br>oder<br>";
    txt += "b) WEB-Adresse <span style='color:#ff0000'>dc.baa.at</span> und <br>Anmeldung mit Klassencode</h3><hr>";
    txt += "(Hinweis: WEB-Adressen immer in der Adresszeile<br>eingeben, nicht in der Googlesuche)";
    txt += "</div>";
    $druckbereich.append(txt);
    // $("#druckbreite").append("<h2>Schülerliste der Klasse: " + akt_klasse.kzz + " (Klassengeheimcode: "+akt_klasse_code+")</h2><div id='druckbreite'></div>");
    $data.forEach((elem, idx) => {
        // let qr_code=qr_pfad+akt_klasse.id+"a"+elem.schueler_id+".png";
        let qr_code = qr_pfad + elem.schueler_id + ".png";
        let tmp = `<div class='qr_ues'><div>Schülername: </div><div>Klassencode: ${akt_klasse_code}</div></div>`;
        // elem.schueler_id=0;      
        tmp += `<div><img onclick='window.open(\"https://dc.baa.at/?s=${encodeURIComponent(btoa(elem.schueler_id))}&nr=${idx + 1}\","Schueler")' class='sch_qr_code' src='${qr_code}' style='width:100%' /></div>`;
        $druckbereich.append(`<div class='sch_druck_zeile'>${tmp}</div>`);

        // $("#cont_protok").append("<img src='../assets/qrcodes/ablauf.png' >");
        // $("#cont_protok").append("<img src='../assets/qrcodes/get_qr_code.php?"+Math.random()+"' >");
        // $("#cont_protok").append("<iframe src='"+qr+"' />");
    });




}


function uebungen_testen() {
    let adr=`https://dc.baa.at/?wp=${akt_wplan.id}`;
    window.open(adr,"Schueler")
    // tmp = `<div><img onclick='window.open(\"https://dc.baa.at/?s=${encodeURIComponent(btoa(elem.schueler_id))}&nr=${idx + 1}\","x")' class='sch_qr_code' src='${qr_code}' style='width:100%' /></div>`;
}

function schueler_print() {
    $("#druckbreite").printArea({ popup: "popup" });
}

function wplan_print() {
    $("#druckbreite_wp").printArea({ popup: "popup" });
}

function schueler_save() {
    set_schueler_edit(0);
    let vorh = $("#cont_schueler").find(".feld").length;
    if (vorh > 0) {
        arr = [];
        $("#cont_schueler").find(".feld").each(function (idx) {
            $elem = $(this);
            obj = {};
            obj.klasse_id = akt_klasse.id;
            obj.schueler_id = $elem.attr("schueler_id");
            obj.schueler_pw = $elem.text();
            arr.push(obj);
        });
        get_set_data("schueler", "save", akt_klasse.id, JSON.stringify(arr));
    }

}

//false keine schüler angezeigt werden, weil gerade angelegt
// function chk_schueler_zahl() {
//     // alert(schueler_zahl)
//     if (schueler_zahl == 0) {
//         // alert("neu einlesen")
//         get_set_data("schueler", "load", []);
//     }
// }




// #############################################################
// ##############   W O C H E N P L A N ########################
// #############################################################
// function rufe_wplan(kl_id) {
//     // wplan_alle=[];
//     // clean_last(["schueler", "wplan", "uebung"]);
//     clean_last(["wplan", "wp_protok"]);
//     get_set_data("wplan", "load", kl_id);
// }

function wplan_ruft_protok(wid, wplan_ext) { //spezial
    get_set_data("sch_protok", "wplan_protok", wid, JSON.stringify([{ "akt_klasse_id": akt_klasse.id, "wplan_ext": wplan_ext }]));
}


function set_akt_wplan(id, bez, flag_nachladen = 0, ext_wplan_flag = 0) {
    akt_wplan.id = id;
    akt_wplan.bez = bez;
    setACookie("akt_wplan", [id, bez]);

    elem_mark("w", id);
    $("#akt_wplan_txt").text(bez + "/" + id);
    $(".akt_wp").text(bez);
    if (!wplan_edit_flag) {
        if (flag_nachladen == 1) {
            clean_last(["uebung"]);
            wplan_ruft_protok(akt_wplan.id, ext_wplan_flag);
        }
    }
}


function ext_wplan_click(id, bez) {
    $("#tabs").tabs("disable", "#tabs-UB");
    set_akt_wplan(id, bez, 1, 1);
}


function wplan_show(data, len) {
    function click_evt(evt) {
        set_akt_wplan(evt.data.id, evt.data.bez, 1, 0);
        // wplan_ruft_uebg(evt.data.id);
    }

    let pub = " hid";
    if (akt_lehrer.id == 100) {
        pub = " ext";
    }


    let elem = "<div wplan_id='0' class='wplan_mein'>";
    // elem += "<button  class='ui-button wp_input feldEd'>WP-99</button>";

    elem += "<div><input name='x' class='ui-button wp_input feldEd' value='WP-NEU' readonly maxlength='20' title='WP-Bezeichnung' >";
    elem += `<br><input  name='x' class='ui-button wp_datum feldEd hid' value='${heute_datum}' readonly maxlength='10' title='WP-Datum'></div>`;
    elem += "<div>";
    elem += "<input class='wplan_frei act' type='checkbox' disabled title='Freischaltung' /><br>";
    elem += "<input class='wplan_public act" + pub + "' type='checkbox' disabled title='Public-Schaltung' />";
    elem += "</div>";

    elem += "</div>";

    let xelem = "<div wplan_id='0' class='wplan_ext'>";
    xelem += "<button class='ui-button ui-widget ui-corner-all' onclick='ext_wplan_click(ext_wplan_id,\"ext_btext\")' title='Externer Wochenplan'>ext_btext</button>";
    xelem += "</div>";


    if (data == "neu") {//eine Klasse addieren
        $el = $("#cont_wplan");
        $el.prepend(elem);
        let $tmp = $el.children(".feldEd");
        $tmp.first()
            .text("WP-" + $tmp.length)
            .attr("contenteditable", "true");

         $el.find(".wplan_mein").first().addClass("wp_neu");
        // set_wplan_edit(wplan_edit_flag);

        set_wplan_edit(1);

        // $tmp.last().addClass("wp_neu");

    } else {

        let a_bez = [];
        let a_samm = [];
        let anz = data.length;

        $("#cont_wplan").text("");
        for (let i = 0; i < anz; i++) {
            // console.log("sichtbar",akt_lehrer.id,data[i].wplan_public)
            if (data[i].wplan_public == "0" || akt_lehrer.id == 100) {

                $("#cont_wplan").append(elem);
            } else {
                const regex = /ext_btext/g;
                let yelem = xelem.replace(regex, data[i].wplan_bez).replace("ext_wplan_id", data[i].wplan_id);
                $("#cont_wplan").append(yelem);
            }

            // console.log(data[i].wplan_public)
        }

        $("#cont_wplan").find(".wplan_mein").each(function (idx) {
            $elem = $(this);
            ein_satz = data[idx];
            $elem.attr("id", "w" + ein_satz.wplan_id);
            $elem.attr("wplan_id", ein_satz.wplan_id);
            // console.log(idx,ein_satz.wplan_frei)
            if (ein_satz.wplan_frei == "1")   $elem.find(".wplan_frei").first().prop('checked', true);
            if (ein_satz.wplan_public == "1") $elem.find(".wplan_public").first().prop('checked', true);

            $elem.find(".wp_input").val(ein_satz.wplan_bez);
            $elem.find(".wp_datum").val(konvert_datum("e", ein_satz.wplan_datum));

            $elem.click({ id: ein_satz.wplan_id, bez: ein_satz.wplan_bez }, click_evt);

            if (ein_satz.wplan_bez=="WP-NEU") {
                $elem.addClass("wp_neu");
            }
            a_samm.push(Number(ein_satz.wplan_id));
            a_bez.push(ein_satz.wplan_bez);
        });
        if (anz > 0) {
            $("#a3 .cont_ues #a_bez").text(a_bez.join(", "));
            let pos = Math.max(0, a_samm.indexOf(Number(getACookie('akt_wplan')[0])));
            let found_id = a_samm[pos];
            set_akt_wplan(found_id, data[pos].wplan_bez, 0, 0);
        }

        if (akt_lehrer.id == 100) {
            $("input.ext:checked").parent().css({ "background-color": "blue", "padding": "4px" });
        }
    }
    $(".wplan_mein").css({ "background-image": ur_bk, "color": ur_col, "font-weight": "bold" });
}


function wplan_save() {
    set_wplan_edit(0);
    let vorh = $("#cont_wplan").find(".wplan_mein").length;
    if (vorh > 0) {
        arr = [];
        // $("#cont_wplan").find(".feldEd").each(function (idx) {
        $("#cont_wplan").find(".wplan_mein").each(function (idx) {
            $elem = $(this);
            obj = {};
            obj.klasse_id = akt_klasse.id;
            obj.wplan_id = $elem.attr("wplan_id");
            obj.wplan_bez = $elem.find(".wp_input").val();

            obj.wplan_frei = ($elem.find(".wplan_frei").first().prop('checked') ? "1" : "0");
            obj.wplan_public = ($elem.find(".wplan_public").first().prop('checked') ? "1" : "0");


            // $elem.find(".wp_input").val($elem.find(".wp_input").val());
            obj.wplan_datum = konvert_datum("d", $elem.find(".wp_datum").val());
            // $elem.find(".wp_datum").val(konvert_datum("d",$elem.find(".wp_datum").val()));

            arr.push(obj);
            console.log("wp_obj",obj);
        });
        get_set_data("wplan", "save", akt_klasse.id, JSON.stringify(arr));
    }
}


function wplan_kopie() {
    let inhalt=`<h3>Der aktuelle Wochenplan ist: <span style='color:red'>${akt_wplan.bez}</span></h3>`;

    inhalt+="<fieldset id='stift_funktionen'>";
    inhalt+="<legend><b>Auf welche Klasse</b> soll dieser Wochenplan kopiert werden: </legend>";
    meine_klassen.forEach((klasse,idx)=>{
        inhalt+="<div class='radio_bk'>";
        inhalt+=`<input type='radio' name='ziel_klasse' id='kl_${idx}' value='${klasse[0]}'>`;
        inhalt+=`<label for='kl_${idx}'><b>${klasse[2]}</b> (${klasse[1]})</label>`;
        inhalt+="</div>";
    
    })
    inhalt+="</fieldset>";
    inhalt+="Hinweis: Auch die derzeitige Klasse ist als Kopierziel möglich - zum Erstellen eines ähnlichen Wochenplans! <div id='spez_kl_id' contentEditable='plaintext-only'></div>";

    
    $("#dialog_allgemein").dialog({
        title: "Vorsicht beim Kopieren von Wochenplänen/Übungen",
        // position: { my: "center top", at: "center top", of: window },
        width: "30vw",
        modal: true,
        buttons: {
            Kopieren: function () {
                let kl_ziel_id=0;
                kl_ziel_id = $('input[name="ziel_klasse"]:checked').val();
                if ($('#spez_kl_id').text()>" ") {
                    kl_ziel_id=Number($('#spez_kl_id').text())
                } else {
                    if ((kl_ziel_id==undefined) ) {
                        kl_ziel_id=0;
                        alert("Keine Klasse gewählt!")
                    }    
                }
                if (kl_ziel_id>0) {
                    get_set_data("wplan", "kopie", akt_klasse.id, JSON.stringify([{ "wp_quell_id": akt_wplan.id, "kl_ziel_id": kl_ziel_id }]));
                }
               
                $(this).dialog("close");
            },
            Abbrechen: function () {
                $(this).dialog("close");
            }
        }
    }).find("#dialog_info").html(inhalt);
    // alert_dialog("System-Information", "<img src='../assets/icons/dc_schema.png'>");
}



// #############################################################
// #################  Ü B U N G E N  ###########################
// #############################################################
function rufe_uebg(wid) {
    // wplan_alle=[];
    // clean_last(["schueler", "wplan", "uebung"]);
    clean_last(["uebung"]);
    uebung_anz = 0;
    get_set_data("uebungen", "load", wid);
}


// function wplan_ruft_uebg(id) {
//     clean_last(["uebung"]);
//     uebung_anz = 0;
//     get_set_data("uebungen", "load", []);
// }


function set_akt_uebung(id, ifr_vorschau = 1) {

    akt_uebung_id = id;
    // $("#cont_zuweis_butt").addClass("hid");
    $elem = $("#u" + id);
    let ub_kzz = $elem.find(".uebung_kzz").first().val();
    $("#akt_uebung").text(ub_kzz);

    setACookie("akt_uebung_id", [id, ub_kzz]);

    elem_mark("u", id);

    if (uebung_edit_flag) {
        
        if (akt_edit_uebung_id != "") {
            console.log("vergleiche, ob anderer geklickt",akt_edit_uebung_id,id)
            if (Number(akt_edit_uebung_id.substring(1))!=id) {
                console.log("save angeordnet",akt_edit_uebung_id,id)
                uebungen_save();
            }
        }

    } else {    
        let link_adr = $elem.find(".uebung_link").first().val();
        let vorschau_art = "";
        if ((link_adr.substring(0, 4) == "http") || (link_adr.substring(0, 1) == ".")) {
            // console.log("adr", link_adr);

            if (ifr_vorschau) {

                let adr = adr_korrektur(link_adr);

                
                let umax = $elem.find(".uebung_max").first().prop("checked");
                if (umax) {
                    alert_dialog("Hinweis", "Dieses Fenster kann nicht im Iframe dargestellt werden, es wird immer in einem Extra-Browserfenster geöffnet: \n<h3>" + adr + "</h3>", "adr", adr);
                    // window.open(adr,"x");
                } else {

                    if (adr.includes("user_img/u_")) {
                        const reg = /(u_[0-9]+).([a-z]{3})/g;
                        const matches = adr.match(reg); //dateiname zurück gegeben

                        // const zch = (adr.includes("?")) ? "&" : "?";
                        //müsste man noch etwas entschärfen, weil jedes mal
                        if (matches[0].includes(".txt")) {
                            adr = "show_page.php?datei_url=../assets/user_img/"+matches[0]+"&u_id="+id ;
                            // if (akt_uebung_id!=get_txt_nr(matches[0])) {
                            //     reload_neu=true; //alte fremde datei wird bearbeitet
                            // }
                        } else {
                            adr = "show_page.php?datei_url=../assets/user_img/"+matches[0] + "?" + Math.random();
                        }
                        
                        vorschau_art = "g";
                        // alert("adr:"+adr)
                    } else {
                        if (adr.includes("vorlage_")) {
                            adr = "show_page.php?datei_url="+adr;
                        }
                    }
                    // console.log("reload_neu",reload_neu)
                    $("#app_fenster_1").attr("src", adr);
                }
                // show_zuweis_gruen(0);
                reload_neu=false; //muss bleiben, weil gewechselt werden kann
                console.log("reload_neu: schalte auf false")
            }

            show_zuweis_gruen(0);

            // if (vorschau_art == "g") { //wahrscheinlich wegnehmen
            //     $("#stift_zch2").show();
            // } else {
            //     $("#stift_zch2").hide();
            // }

            $("#stift_zch2").show();
        }


        //console.log("wieder einschalten");
    }
    //console.log(`Einsicht für ${id} aufrufen`);
}

function leave_evt(evt) { //nicht verwendet
    alert(evt.data.id);


    // let elem = evt.currentTarget;
    // if (uebung_edit_flag) {

    //     $(elem).attr("chg", "1");
    //     if ($(evt.target).parent().hasClass('trash')) {
    //         uebung_del(evt.data.id);
    //     } else if ($(evt.target).parent().hasClass('copy')) {
    //         uebung_copy(evt.data.id);
    //     } else {
    //         // set_akt_uebung(evt.data.id, show_iframe);
    //         set_akt_uebung(evt.data.id, 0);
    //     }
    //     console.log(alt_uebung_id_click+" / "+evt.data.id )

    //     alt_uebung_id_click=evt.data.id;

    // } else {
    //     show_iframe = 0;
    //     // if (evt.target.id == "uebung_kzz") {
    //     show_iframe = 1;
    //     // }
    //     set_akt_uebung(evt.data.id, show_iframe);
    // }
}



// let alt_uebung_id_click=0;
let uebg_neu_flag = 0;
function uebung_show(data, len) {
    let uebung_anz = 0;
    function click_evt(evt) {
        set_sketch(0);
        //uebungen_load(evt.data.id);
        // set_akt_uebung(evt.data.id);
        let elem = evt.currentTarget;


        // if ((uebung_edit_flag==1) || (uebung_edit_flag==evt.data.id)) {
console.error("uebung_edit_flag=",uebung_edit_flag)            
        // if ((uebung_edit_flag==1)) {
        if ((uebung_edit_flag)) {
            // console.log("allg_ueb_id ja",uebung_edit_flag,elem)
            $(elem).attr("chg", "1");
            if ($(evt.target).parent().hasClass('trash')) {
                if (confirm("Wollen Sie diese Übung wirklich löschen?")) {
                    uebung_del(evt.data.id);
                }
            } else if ($(evt.target).parent().hasClass('copy')) {
                uebung_copy(evt.data.id);
            } else {
                // set_akt_uebung(evt.data.id, show_iframe);
                set_akt_uebung(evt.data.id, 0);
            }
            // alt_uebung_id_click=evt.data.id;

        } else {
            show_iframe = 0;
            // if (evt.target.id == "uebung_kzz") {
            show_iframe = 1;
            // }
            set_akt_uebung(evt.data.id, show_iframe);
        }
    }

    let innen = "<div class='ubnr'>";
    // innen += "<button id='b_ueb_save' class='xuebg_butt ub_ui-icon-disk' title='Übung speichern'></button>";
 
    innen += "<button class='b_ueb_edit ub_ui-icon-bleist' onclick='set_uebung_edit(-1,event)' title='Übung ändern'></button>";

    innen += "<textarea class='uebung_kzz feldEd klickEd' maxlength='20' readonly style='width:100%;padding:2px' title='Eindeutiges Übungskurzbezeichnung, Zeilentrennung: Minus oder Leerplatz' autocomplete='off'></textarea>";
    innen += "<span class='ui-icon ui-icon-arrowthick-2-n-s tarn hid' style='scale:1.5' ></span>";
    innen += "<span class='uebung_kzz_ur'></span>";
    innen += "</div>";

    innen += "<div class='eine_uebung_zentral' >";
    innen += "<input class='uebung_link feldEd input_ed' type='url'  maxlength='80' value='https://' readonly maxlength='70' title='WEB-Adresse' autocomplete='off'>";
    innen += "<textarea class='uebung_titel feldEd' maxlength='164' readonly style='margin:0' title='Kurzinformation für die SchülerInnen'></textarea>";
    innen += "</div>";

    innen += "<div class='uebg_re'>";
    innen += "<button type='button' class='trash tarn hid' title='Übung löschen'><img src='../assets/icons/del.png'/></button>";
    innen += "<div><input class='uebung_stift' type='button' disabled title='Stiftfreigabe' value='0' onclick='stift_dialog(event)' title='Stiftfreigabe'  autocomplete='off'/></div>";
    innen += "<div><input type='checkbox' class='uebung_max tarn hid' title='Extra-Browserfenster'  autocomplete='off' /></div>";
    innen += "<button type='button' class='copy tarn hid' title='Übung kopieren'><img src='../assets/icons/copy.png'/></button>";
    innen += "</div>";

    let ub_elem = "<div uebung_id='-1' class='eine_uebung'>" + innen + "</div>";

    if (data == "neu") {//eine uebung addieren
        
        // $k = $("#k_id0").clone().attr("id", "k" + vorh);
        let $last_elem = $("#cont_uebungen").children(".eine_uebung").last();

        $("#cont_uebungen").append(ub_elem); 

        anz = $("#cont_uebungen").children(".eine_uebung").length;

        // let $elem = $("#cont_uebungen").children(".eine_uebung").last().addClass("wp_neu");
        let $elem =$("#cont_uebungen").children(".eine_uebung").last().addClass("wp_neu");

        // $elem.attr("chg", "1");
        $elem.attr("chg", "1").attr("sort", Number($last_elem.attr("sort")) + 1);

        $elem.find(".uebung_kzz").first().val("Ü-" + (anz).toString());
        // $ub_elem.find(".uebung_kzz").first().val("Ü-" + anz).click({ id: (anz * -1) }, click_evt);

        $elem.find(".uebung_kzz_ur").first().text("");
        $elem.attr("uebung_id", (anz * -1))
            .attr("id", "u" + (anz * -1).toString());


        uebg_neu_flag = 1;
        uebungen_save(1);
        return false;
        //set_uebung_edit(1);

        // scroll_up(0);

    } else {
        $("#uebg_erstinfo").hide(); 
        clean_last(["uebung"]);

        show_zuweis_gruen(0);

        let reg = /ccc/g;
        let a_bez = [];
        let a_samm = [];
        let anz = data.length;
    
        if (anz==5) {
            if (data[0].uebung_link == "https://") {
                $("#uebg_erstinfo").show(); 
            } 
        }



        $("#cont_uebungen").text("");
        for (i = 0; i < anz; i++) {
            $("#cont_uebungen").append(ub_elem);
        }

     
        // console.warn(data);
        $("#cont_uebungen").find(".eine_uebung").each(function (idx) {
            $elem = $(this);
            let ein_satz = data[idx];
     
            // $elem.children("#lfdnr").html((idx+1)+". ");
            $elem.attr("uebung_id", ein_satz.uebung_id);
            $elem.attr("id", "u" + ein_satz.uebung_id);

            $elem.find(".uebung_kzz").first().val(ein_satz.uebung_kzz);
            $elem.find(".b_ueb_edit").first().attr("title",`Übg. ändern: ${ein_satz.uebung_id}`);
            $elem.find(".uebung_kzz_ur").first().text(ein_satz.uebung_kzz_ur);
            // $elem.children("#uebung_link").text(decodeURIComponent(ein_satz.uebung_link.replace(reg,"'")));

            // $elem.find(".uebung_link").first().text(ein_satz.uebung_link);
            $elem.find(".uebung_link").first().val(ein_satz.uebung_link);
            $elem.find(".uebung_titel").first().val(ein_satz.uebung_titel);
            $elem.attr("chg", "0").attr("sort", ein_satz.uebung_sort);
            // $elem.attr({"chg":"0","sort":idx});

            if (ein_satz.uebung_max == "1") {
                $elem.find(".uebung_max").first().prop('checked', true);
            }

            let $stift=$elem.find(".uebung_stift").first();
            if (ein_satz.uebung_stift== "0") {
                $stift.css("background-image","none");
            } else {
                $stift.css("background-image","url('../assets/icons/edit.png')");
            }
            $stift.val(ein_satz.uebung_stift);

            $elem.click({ id: ein_satz.uebung_id }, click_evt);
            

            // $elem.find(".trash").click({ id: ein_satz.uebung_id }, click_evt);

            a_samm.push(Number(ein_satz.uebung_id));
            a_bez.push(ein_satz.uebung_kzz);
            //console.log(idx,ein_satz.uebung_link)
            // $elem.children("#uebung_link").$elem.click({ id: ein_satz.uebung_id }, uebung_del());

        });

        // $("#cont_uebungen").find(".eine_uebung").blur({ id: ein_satz.uebung_id }, leave_evt);

        if (anz > 0) {
            if (uebg_neu_flag) {
                goto_uebung_last();
                // set_akt_uebung(found_id, 0);    
            } else {
                let pos = Math.max(0, a_samm.indexOf(Number(getACookie('akt_uebung')[0])));
                let found_id = a_samm[pos];
                set_akt_uebung(found_id, 0);
            }
            uebung_anz = anz;
            uebg_neu_flag = 0;
        }

        // $(".eine_uebung").css({ "background-image": getStyle("#AL", "background-image"), "color": getStyle("#AL", "color"), "font-weight": "bold" });
        $(".eine_uebung").css({ "background-image": ur_bk, "color": ur_col, "font-weight": "bold" });
        if (anz > 0) {
            $("#cont_uebungen").sortable("disable");
        }

        // $(".eine_uebung").on("mousedown",function() {
        //     console.log("klicked")
        // });


    }

}
function uebungen_save(neu_flag = 0) {
    set_uebung_edit(0,0);

    //     let last_sort=0;
    //     if (neu_flag) {
    //         last_sort=$(".eine_uebung").last().attr("sort");
    //         // last_sort=$("#cont_uebungen").last(".eine_uebung").attr("sort")
    //         alert(last_sort);

    //     //     $("#akt_uebung").
    //     }
    // return false;

    let vorh = $("#cont_uebungen").find(".eine_uebung").length;
    if (vorh > 0) {
        arr = [];
        $("#cont_uebungen").find(".eine_uebung").each(function (idx) {
            $elem = $(this);
            if ($elem.attr("chg") == "1") {
                console.log("saved",$elem.attr("uebung_id"));
                $elem.attr("chg", "0"); // wenn nicht nachgeladen wird (update), dass beim nächsten mal nicht gespeichert wird.
                obj = {};
                obj.wplan_id = akt_wplan.id;
                obj.uebung_sort = $elem.attr("sort");
                // obj.uebung_sort = idx;
                obj.uebung_id = $elem.attr("uebung_id");
                obj.uebung_kzz = $elem.find(".uebung_kzz").first().val().trim();
// console.log("obj=",obj)               
                obj.uebung_kzz_ur = $elem.find(".uebung_kzz_ur").first().text().substr(0,8);
                // obj.uebung_link = encodeURIComponent($elem.children("#uebung_link").text().replace(/'/g,"ccc"));
                // obj.uebung_link = $elem.children("#uebung_link").text().replace(/'/g, "ccc");

                // obj.uebung_link = encodeURIComponent($elem.find(".uebung_link").first().text());
                obj.uebung_link = encodeURIComponent($elem.find(".uebung_link").first().val());
                obj.uebung_titel = $elem.find(".uebung_titel").first().val().replace(/'/g, "ccc").trim();
                
                // console.log(idx,$elem.children("#uebung_max").prop('checked'))
                obj.uebung_max = ($elem.find(".uebung_max").first().prop('checked') ? "1" : "0");
                obj.uebung_stift = $elem.find(".uebung_stift").first().val();
                // console.log(idx,obj)            
                arr.push(obj);

            }
        });

        // console.log("------------------------");
        // console.log(JSON.stringify(arr));
        if (arr.length > 0) {
            get_set_data("uebungen", "save", akt_wplan.id, JSON.stringify(arr));
        }

    }
    show_butt_u_save(0);
}

function uebung_del(nr) {
    $("#u" + nr).find(".uebung_kzz").first().val("LÖSCHEN");
    $("#cont_uebungen").find(".eine_uebung").each(function (idx) {
        $(this).attr("sort", idx*2).attr("chg", "1");
    });
    $("#u" + nr).hide(1000);
    // $("#u"+nr).attr("id",)
    // uebungen_save();
}

function uebung_copy(nr) {
    // $("#u" + nr).find(".uebung_kzz").first().val("LÖSCHEN");
    let $alt=$("#u" + nr);
    let $neu=$alt.clone();
    // let $neu=$("#u" + nr).clone().insertAfter("#u" + nr);
    $neu.attr("uebung_id","-"+nr); // flag für copy - negative nr, damit in der db die UrNr auffindbar ist
    $neu.attr("sort",Number($alt.attr("sort"))+1); // flag für copy
    
    $neu.find(".uebung_kzz").first().val("K"+$alt.find(".uebung_kzz").first().val())
    
    $neu.insertAfter($alt);
    
    $("#cont_uebungen").find(".eine_uebung").each(function (idx) {
        $(this).attr("sort", idx*2).attr("chg", "1");
    });
    uebungen_save(1);
    // $("#u" + nr).hide(1000);
    // $("#u"+nr).attr("id",)
    // uebungen_save();
}


function goto_uebung_last() {
    set_akt_uebung($("#cont_uebungen").children().last().attr("uebung_id"), 1);
}


function uebung_next() {
    let $next = $("#cont_uebungen").find("#u" + akt_uebung_id).next();
    let next_id = $next.attr("uebung_id");
    let last_id= $("#cont_uebungen").children().last().attr("uebung_id")

    // console.log($("#cont_uebungen").children());
    // console.log("info",akt_uebung_id,"/n",akt_uebung_id,next_id,last_id);
    // console.log("------------------------");

    if (akt_uebung_id != last_id) {
        if ($next.find(".uebung_link").first().val()=="https://") {
            $("#cont_uebungen").find("#u" + akt_uebung_id).children().next();
            set_akt_uebung(next_id, 1);
        }
    }
}


function set_uebungen_sortEA(flag = -1) {
    // console.log($("#cont_uebungen").sortable("option"))
    let zustand = "ein";
    $elem = $("#cont_uebungen");
    if (!$elem.sortable("option", "disabled") || (flag == 0)) {
        $elem.sortable("disable");

    } else {
        $elem.sortable("enable");
        zustand = "aus";
        // $elem.find(".eine_uebung").attr("chg", "1");
        // alert("aus");
    }
    // set_uebung_edit(1)
    show_butt_u_save(1);
    // $("#u_sort").html(`Sortierung ${zustand}schalten`);
    // alert("Sortiermöglichkeit ist nun "+zustand)
}

function show_butt_u_save(zeige) {
    if (zeige) {
        $("#u_save").removeClass("hid");
    } else {
        $("#u_save").addClass("hid");
    }
}
// ###### ÜBUNGEN ende ##########


// function wplan_ruft_uebg(id) {
//     console.log("uebungen laden: wplan_id ",id)
// }



// #############################################################
// ################## PROGRAMMZUWEISUNGEN bei Übungen ##########
// #############################################################
var app_wahl = -1;
var app_wahl_last = -2;
function show_zuweis_gruen(flag) {
    if (flag) {
        $("#cont_zuweis_butt").removeClass("hid");
    } else {
        $("#cont_zuweis_butt").addClass("hid");
    }
}



function app_butt_click(obj) {
    let id = Number($(obj).attr("nr"));
    reload_neu = false; //an drei stellen ausschalten: uebg-aufruf, neue app, getaner upload
    snap_bname = "";
    app_wahl = id;
    console.log("app_wahl=", app_wahl);
    
    if (app_wahl!=app_wahl_last) {
        sessionStorage.setItem("last_wahl_butt", "-1");
        window.parent.last_i=-1;
        app_wahl_last=app_wahl;
    }

    set_sketch(0);
    // $("#cont_zuweis_butt").removeClass("hid");

    const kz=a_apps[id][1];
    let adr = a_apps[id][3];
    if (["EP", "RB", "LB", "LZ", "LK", "CO", "EX", "CM"].includes(kz)) {
        show_zuweis_gruen(1);
    } else {
        show_zuweis_gruen(0);
    }

    if (kz=="LA") {
        if (window.parent.filter_lapps==0) {
            $("#cont_butt_lapps").css("display","flex");
        }
    
    } else {
        $("#cont_butt_lapps").css("display","none");
    }
        

    if (adr > "") {
        if (a_apps[id][0] == 0) {
            $("#app_fenster_1").attr("src", adr);
        } else {
            alert_dialog("Hinweis", "Dieses Fenster kann nicht im Iframe dargestellt werden, es wird immer in einem Extra-Browserfenster geöffnet: \n<h3>" + adr + "</h3>");
            $("#app_fenster_1")[0].contentWindow.document.body.innerHTML = `<h3 style='color:white;text-align:center'>Externadresse: ${adr}</h3>`;
        }
    }
    // $("#app_hinweis").html("Das ausgewählte Programm mit seinen Einstellungen der aktiven Übung zuweisen.");
}


var a_apps = [];

function make_app_button() {
    a_apps = [
        [0, "AB", "Arbeitsblätter", "../assets/html/ablattauswahl.html", "ablatt_id"],
        [0, "BA", "Biberrätsel", "../assets/html/biberauswahl.html", "ablatt_id"],
        [0, "RL", "Rätsel", "../assets/html/logikauswahl.html", "ablatt_id"],
        [0, "EP", "Edupuzzle", "https://edupuzzle.at", "projekt_nr"],
        [0, "LA", "LearningApps", "../assets/html/lapps_auswahl.html", "ablatt_id"],

        // [0, "BS", "Buchseiten", "../assets/html/buchseitenauswahl.html", "leer"],
        [0, "MA", "Math", "../assets/html/mathematik.html", "ep_id"],
        // [0, "LA", "LearningApps", "../assets/html/lapps_auswahl.html", "ep_id"],
        
        [0, "SP", "Spiele", "../assets/html/spielauswahl.html", "ablatt_id"],
        [0, "RB", "Robobee", "https://robobee.baa.at", "startwelt"],
        [0, "EX", "Externe Seite", "https://baa.at/projekte/dc/assets/html/externe_seite.html", "https"],

        // [0, "EX", "Deutsch", "https://de.wikipedia.org/wiki/", "leer"],
        // [0, "EX", "Sachunterricht", "https://de.wikipedia.org/wiki/", "leer"],


        [0, "LB", "Leeres Blatt", leer_blatt, "leer"],
        [0, "LZ", "Zeilenblatt", leer_zeilen, "leer"],
        [0, "LK", "Karoblatt", leer_karo, "leer"],
        [0, "LT", "Infoseite", leer_html, "leer"],
        [0, "FC", "Flashcards", "../assets/html/flashcardauswahl.html", "ablatt_id"],
        // [0, "BD", "Bilder", "../assets/html/bilderpool.php", "leer"],
        // [1, "CO", "Code.org", "https://studio.code.org/s/express-2021", "leer"],

        
        [0, "CM", "Kamerabild", "./js/camera/show_camera.html", "leer"]
    ];

    // console.log("#############",getACookie("akt_lehrer")[0])



    //hier wird auch das onclick zugeweisen
    a_apps.forEach((element, idx) => {
        if ((akt_modus == 1) || (idx < 8)) {
            let feldEd = "<button id='app_" + idx + "' nr='" + idx + "' class='ui-button app ui-widget ui-corner-all app_butt app' onclick='app_butt_click(this)'>" + element[2] + "</button>";
            $(".cont_butt_re.ifr").append(feldEd);
        }
    });
    $(".cont_butt_re.ifr").append("<button id='stift_zch2' class='ui-button ui-widget ui-corner-all' onclick='bleistift_schalter()'>&nbsp;</button>");
    if (akt_modus == 1) { $("#stift_zch").show(); }

}

function bleistift_schalter() {
    var ifr = document.getElementById('app_fenster_1');
    reload_neu=true;    
    // if (ifr_app)
    // console.log(ifr.src)
    if (ifr.src.includes(".txt") || ifr.src.includes("leer_html")) {
        // let ifr_doc = ifr.contentWindow.document;
        let nr=akt_uebung_id;
        if (!ifr.src.includes("leer_html")) { //schon vorhanden
            nr = get_txt_nr(ifr.src);
        }
        ifr.src = "../assets/html/leer_html.php?u_id=" + nr+ "&quelle=bs";
        // if (akt_uebung_id==nr) {
        //     reload_neu=false;
        // }

        console.log("schalte auf true",reload_neu)
        
    } else {
        set_sketch(9);
    }
}


function get_txt_nr(txt) {
    let ret=0;
    const regex = /(u_)([0-9]+)/gm;
    const str = txt;
    let m;
    if ((m = regex.exec(str)) !== null) {
        ret=m[2]
    }
    return ret;
}


function check_zuweisen(img_or_txt) {
    if (!$("#u" + akt_uebung_id).find(".uebung_link").first().val().includes("u_" + akt_uebung_id)) {
        //ist mit dateispeicherung verbunden
        button_uebg_nach_links(1, img_or_txt);
    }
}


function make_5stellen(z) {
    return z.toString().padStart(5,'0')
}



function button_uebg_nach_links(from_0_canv_txt = 0, img_or_txt = 1) {
// alert(from_0_canv_txt)
    function get_parameter(ifrWin, param, appBst) {
        let ret = [];
        switch (appBst) {
            case 'AB':
            case 'BS': //??
            case 'BD': //??
            case 'FC':

                ret = [ablatt_id, ablatt_kzz,ablatt_p3];
                // alert(ret[0] + "/" + ret[1]);
                break;


            case 'BA':
            case "RL":
            case "MA":
                ret = [ablatt_id, ablatt_kzz,ablatt_p3, "pnr=" + ablatt_id];
                break;

            case "LA":
                ret = [ablatt_id, ablatt_kzz,ablatt_p3];
                break;

            case 'EP':
                ret = [ifrWin.projekt_nr, ifrWin.projekt_nr,ablatt_p3, "pnr=" + ifrWin.projekt_nr];
                break;

            case 'RB':
                let rbee = ifrWin.exportRoot;
                if (rbee.currentFrame == 1) {
                    ret = ["", ""];
                } else {
                    //weil im grundsystem ein fehler ist
                    let curFrame = rbee.currentFrame;
                    if (curFrame == 2)
                        curFrame = 3;
                    else if (curFrame == 3)
                        curFrame = 2;
                    ret = ["startwelt=" + rbee.akt_spielwelt + "x" + Math.max(0, curFrame - 2) + "x" + ifrWin.spiel_sgrad, ifrWin.spiel_sgrad];
                }
                break;

            case 'SP':
                ret = [ablatt_id, ablatt_kzz,ablatt_p3, "sg_filter=" + ifrWin.m_sgrad];
                break;


            // if (["LB","LZ","LK"].includes(appBst)) 

            // case 'CM':
            //     ret = [ablatt_id,ablatt_kzz];
            //     alert_dialog("Hinweis","Damit stellen Sie den SchülerInnen den Camerazugang zur Verfügung (falls dieser vorhanden ist). Die SchülerInnen können Ihnen damit Bilder senden!");
            //     break;

            // case 'EX':
            //     ret = ["", "EX"];
            //     break;

            default:
                ret = ["", ""];
                console.log(`Keine Spezialbehandlung ${param}.`);
        }
        return ret;
    }


    // blink_schalter(0);
    var ifr_app = document.getElementById('app_fenster_1');
    let ifr_win = ifr_app.contentWindow;
    let ifrAdresse = "";
    try {
        ifrAdresse = ifr_win.document.location.href;
    } catch (error) {
        ifrAdresse = "https://";
    }

    let appStiftNr = 0;
    let ges_adr = "";
    let fehler = 0;
    console.warn("app_wahl=", app_wahl);

    // if ((from_0_canv_txt) || (snap_bname != "")) {
    if ((from_0_canv_txt==1)) {
        console.log("canvas aktualisierer")
        appStiftNr = 1;
        kzz = "Bild";

        //neuer versuch - auf der api wird die id als kzz_ur genommen
        kzz_ur = $("#u" + akt_uebung_id).find(".uebung_kzz_ur").first().text();

        let erw = ".png";
        // if (img_or_txt == 2) erw = ".txt";
        ges_adr = "../assets/user_img/u_" + akt_uebung_id + erw;

        //nur bei text, weil bei img kommt das nach dme canvas-speichern
        // if (img_or_txt==2)  {
        //     alert(ges_adr)
        //     ifr_app.src=ges_adr;
        // }    

        uebung_zuordnen(ges_adr, kzz, kzz_ur, false, 2);

    } else if ((from_0_canv_txt==2)) {
            console.log("textaktualisierer")
            appStiftNr = 0;
            kzz = "Text";
            kzz_ur = $("#u" + akt_uebung_id).find(".uebung_kzz_ur").first().text();
           //neuer versuch - auf der api wird die id als kzz_ur genommen
            

            let erw = ".txt";
            // if (img_or_txt == 2) erw = ".txt";
            ges_adr = "../assets/user_img/u_" + akt_uebung_id + erw;
    
            //nur bei text, weil bei img kommt das nach dme canvas-speichern
            // if (img_or_txt==2)  {
            //     alert(ges_adr)
            //     ifr_app.src=ges_adr;
            // }    
    
            uebung_zuordnen(ges_adr, kzz, kzz_ur, false, 0);

    } else {

        // wichtig
        let [appMax, appBst, pname, appAdr, appErg] = a_apps[app_wahl];
        let [winID, winAbst,winSpez, filter = ""] = get_parameter(ifr_win, appErg, appBst);

        console.log("param:",winID, winAbst, winSpez, filter)
        kzz = appBst + "-" + winID;
        kzz_ur = appBst + winID;

        if (app_wahl == -1) {
            alert("Achtung Fehler: app_wahl" + app_wahl);
            // darf es nicht geben
            fehler = 1;
            ges_adr = "";
            return false;
        } else {

            // kzz_ur = appBst + "-" + winAbst;
            if (appBst == "AB") {
                appAdr = "../assets/pdfs/";
                kzz = winAbst;
                kzz_ur = winAbst;
            }
            if (appBst == "BS") { //was ist BS
                appAdr = ifrAdresse.split("datei_url=")[1];
                kzz = appBst + winID;
                kzz_ur = kzz;
            }
            if (appBst == "BD") { //??
                appAdr = winID;
                kzz = "BD";
                kzz_ur = "x";
            }


            if (["BA", "RL", "MA"].includes(appBst)) {
                appAdr = "https://edupuzzle.at";
                kzz = winAbst;
                kzz_ur = winAbst;
            }

            if (appBst == "EP") {
                appAdr = "https://edupuzzle.at";
                kzz = "EP-" + winAbst;
                kzz_ur = "EP" + winAbst;
            }

            if (appBst == "LA") {
            
                appAdr = "./show_page.php?la_id="+winID;
                // kzz = "LA-" + winAbst;
                kzz = winAbst;
                kzz_ur = "L" + winID;
            }

            if (appBst == "RB") {
                let tmp = winID.substr(10);
                appAdr += "?" + winID;
                kzz = appBst + "-" + tmp.replaceAll("x", "");
                kzz_ur = kzz;
                if (kzz_ur == "") {
                    kzz_ur = "RB"; //bei keiner auswahl
                    kzz = "RB";
                }
            }

            if (appBst == "FC") {
                appAdr = "https://baa.at/dom/dlpl/dc/lib/make_html.php";
                appAdr += "?m_id="+winID;
                kzz = winAbst + "-" + winID;
                kzz_ur = kzz;
            }


            if (appBst == "SP") {
                appAdr = winID;
                kzz = winAbst + "-" + filter.charAt(filter.length - 1);
                kzz_ur = kzz;
            }



            if (appBst == "CM") {
                // appAdr = winID;
                alert_dialog("Hinweis", "Damit stellen Sie den SchülerInnen den Camerazugang zur Verfügung (falls eine Kamera am SchülerInnen-Gerät vorhanden ist).<br><b>Die SchülerInnen können damit Bilder als Arbeitsergebnis einreichen!</b>");
                kzz = "CM";
                kzz_ur = "CM";
            }

            if (appBst == "CO") {
                // appAdr = appAddr;
                kzz = "Code";
                kzz_ur = kzz;
            }

            if (appBst == "EX") {
                appAdr = "https://edupuzzle.at";
                appAdr = "https://de.wikipedia.org/wiki/rechteck";
                kzz = "EX";
                kzz_ur = "EX";
            }

            if (["LB", "LZ", "LK"].includes(appBst)) {
                //notwendig damit nicht die umständliche absolute adresse genommen wird
                kzz = appBst;
                kzz_ur = appBst;
                // kzz_ur = "x";
                appAdr = ".." + ifrAdresse.split("/dc")[1];
                // alert(appAdr)
            }

            // if ((appBst == "LT") || (img_or_txt == 1)) {
            if (appBst == "LT") {
                // ifr_win.send_save_click(akt_uebung_id);
                // ifr_win.send_von_aussen();
                // alert("erst speichern")
                kzz = "Text";
                kzz_ur = "txt";
                appAdr = "../assets/user_img/u_" + akt_uebung_id + ".txt";
            }


            //nun die Adresse
            if (appBst == "AB") {
                ges_adr = appAdr + winID;
                //wenn in der Ablatauswahl auf Grafik gesetzt wurde
                if (winSpez) {
                    ges_adr = appAdr + winID.replace(".pdf", ".png");
                }
                
                // ges_adr = appAdr + winID;
            } else { //falls filter sind
                // ges_adr = appAdr + ((winID == "") ? "" : "?" + winID);
                // ges_adr = appAdr + ((winAbst == "") ? "" : "?" + winAbst);
                ges_adr = appAdr + ((filter == "") ? "" : "?" + filter);
            }

            if (ges_adr.includes("empty")) {
                alert_dialog("Hinweis", "Bitte wählen Sie erst eine Programm aus!");
                return false;
            }
        }
        // console.log("zuornden:", app_wahl);
        uebung_zuordnen(ges_adr, kzz, kzz_ur, [false, true][appMax], 0); //und save
        
        
        show_zuweis_gruen(0)
        setTimeout(() => {
            // goto_uebung_last();
            uebung_next();
        }, 500);
    }
}



function uebung_zuordnen(adr, kzz, kzz_ur, ueb_max, ueb_stift) {
    // if (check_kein_unterschied(akt_uebung_id,adr)) {
        $("#u" + akt_uebung_id).find(".uebung_kzz").first().val(kzz);
        $("#u" + akt_uebung_id).find(".uebung_kzz_ur").first().text(kzz_ur);
        $("#u" + akt_uebung_id).find(".uebung_link").first().val(adr) + "?sss";
        $("#u" + akt_uebung_id).find(".uebung_max").first().prop("checked", ueb_max);
        $("#u" + akt_uebung_id).find(".uebung_stift").first().val(ueb_stift);
        $("#u" + akt_uebung_id).attr("chg", "1");
    // }
    
    // if (adr.includes("leer_text")) {
    //     let doc = $("#app_fenster_1")[0].contentWindow.document;
    //     htm = doc.getElementById("infotext").value;
    //     $("#u" + akt_uebung_id).find(".uebung_titel").first().val(htm);
    // }
    uebungen_save();
}



// #############################################################
// ##################  SONSTIGES  ##############################
// #############################################################
const last_e_mark = [];
last_e_mark['s'] = -1;
last_e_mark['k'] = -1;
last_e_mark['w'] = -1;
last_e_mark['u'] = -1;

function elem_mark(art, id) {
    //console.log("marker neu:", art, "id=", id, last_e_mark[art]);
    if (last_e_mark[art] != -1) {
        $("#" + art + last_e_mark[art]).removeClass("mark_elem");

    }
    $("#" + art + id).addClass("mark_elem");
    last_e_mark[art] = id;
}

function ext_prot_save(flag, p, z, sgrad = 0, div2 = 0, prg = "") {
    console.log("Kein Save vorgesehen!");
}


var last_mark = -1;
function marking(nr) {
    if (nr < 10) {
        if (last_mark != -1) {
            $("#a" + last_mark).parent().removeClass("mark_active");
            $("#a" + last_mark).removeClass("rund_li");
            $("#a" + last_mark + " .cont_ire").html(zch);
        }
        $("#a" + nr).parent().addClass("mark_active");
        $("#a" + nr).addClass("rund_li");
        if ($("#a" + nr).next().hasClass("offen")) {
            $("#a" + nr + " .cont_ire").html(zch);
        } else {
            $("#a" + nr + " .cont_ire").html(zch2);
        }
        last_mark = nr;

    }
    // beep("feldEd")
    // $("#a" + nr + " .cont_ire").html(zch2);
    beep("butt");
}


function call_link(nr) {
    // load_theme(0)
    console.log("link klick: ", nr);
    marking(nr);
}

function system_info() {
    let info = "<img width='100%' src='../assets/icons/dc_schema.png'>";
    $("#dialog_allgemein").dialog({
        title: "Informationen: Das Konzept von digi.case-Manager",
        position: { my: "center top", at: "center top", of: window },
        width: "60vw",
        modal: true,
        buttons: {
            Schließen: function () {
                $(this).dialog("close");
            }
        }
    }).find("#dialog_info").html(info);
    // alert_dialog("System-Information", "<img src='../assets/icons/dc_schema.png'>");
}

function stift_dialog(evt) {
    let ub = $(evt.target);

    let wert = ub.val();
    $("#st" + wert).prop("checked", true);

    $("#dialog_stift_befehle").dialog({
        title: "Wahl der Bleistiftfunktion",
        position: { my: "center", at: "center", of: window },
        width: "30vw",
        modal: true,
        buttons: {
            Schließen: function () {
                $("input[name=stiftRadio]").each(function (idx) {
                    // console.log($(this))
                    if ($(this).prop("checked")) {
                        ub.val($(this).attr("id").substr(2));
                        ub.attr("chg", "1");
                        // alert($(this).attr("id"))
                    }
                });
                $(this).dialog("close");
            }
        }

    });

    // alert_dialog("System-Information", "<img src='../assets/icons/dc_schema.png'>");
}

function check_user(event) {
    if (event.key === "Enter") {
        login_lehrer('pw');
    }
}

function lapps_chg(e) {
    // console.log($(e.target).text())   
    let bst=$(e.target).text()[0].toUpperCase();

    if (bst=="Z") {
        src = `../assets/html/lib/sammlung_convert.php?id=${ablatt_id}`;
        // sende = { "id": ablatt_id};
        // console.log(sende);    
        // alert(src)
        // fetch(src, {
        //     // data: "include",
        //   });
          
          fetch(src)
            .then(response => response.text())
            .then(result => {
                console.log('Nach der Serverspeicherung:', result);
                // alert(result)
            })
            .catch(error => {
                console.error('Fehler beim Senden der Daten:', error);
            });





    } else {
        src = "../assets/html/lib/api_lapps.php";
        sende = { "flag": 'set_sstufe', "sstufe": bst , "apps_id": ablatt_id };
        // console.log(sende);    
        fetch(src, {
            method: 'POST',
            body: JSON.stringify(sende)
        })
    
    }
}


//es gibt drei orte der Speicherung: 1 von img_to_server, 2 von txt_to_server und von button_uebg_nach_links (html-Datei)
