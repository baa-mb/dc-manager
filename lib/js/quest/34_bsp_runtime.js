// JavaScript Document

//window.parent.schulstufe.editmodus=1; 

var intGrenze = 200,
	globSpeed = 400;

var schueler_flag = 0,
	arb_bsp_lfdnr = 0;
var ww = 640;
var wh = 600;
var vw = 600;
var iconRand = 4;
var hBody = 200;
var web_vis_flag = false;
var intVar = 0;
var zzz = 0;
var extWind = 0;
var close_frage = false;
var bsp_lfdnr = 0;
//var BUTT_REDUK=58;
var BUTT_REDUK = 64;

var edit_mode = 0;
var is_bsp = 1;
var ifr_hoehe = 600;
var ifr_refreshen = 0;
var move_flag = 0;
var chkedit_mode = 0;

var a_proz_breite = ["p25", "p50", "p75", "p100"];
var punkte = 0;
var sum_ab_punkte = 0; //arbeitsblätter

var frage_max_punkte = []; //frage
var frage_sammel_punkte = []; //frage
var frage_antw_runden = []; //frage
var frage_fertig_flag = []; //beispiel
var frage_proz = [];

var frage_sum_fehler = [];
var frage_sum_richtige = [];

var bsp_anz_fragen = 0;

var snd_stern_plus, snd_stern_minus, snd_stern_fertig;
var platz_genug = 0;
var elem_anz = 0;


//var falsch, richtig, neutral
var a_chk_vgfarbe = ["#ffffff", "#000000", "#ffffff"];
var a_chk_hgfarbe = ["#E56877", "#98fd98", "#3D597F"];



var leerz = String.fromCharCode(160);
//var druckFlag=0;
var a_toolButton = new Array();
//a_toolButton[4]=["HTML-Clean","b_h_clean"];
i = -1;
i++;
var B_MOVE = i;
a_toolButton[i] = ["Verschiebe Block", "b_h_move", 1];
i++;
var B_25 = i;
a_toolButton[i] = ["Block schmäler", "b_h_25", 1];
i++;
var B_50 = i;
a_toolButton[i] = ["Block breiter", "b_h_50", 1];
/*
i++; var B_75=i;    a_toolButton[i]=["Block 75%",  "b_h_75"];
i++; var B_100=i;   a_toolButton[i]=["Block 100%", "b_h_100"];
*/

//i++; var B_BHG=i;	  a_toolButton[i]=["Rechts ausrichten", "b_h_rechts"];


i++;
var B_CHK = i;
a_toolButton[i] = ["Rechtsbündig", "b_h_chk", 1];

i++;
var B_BHG = i;
a_toolButton[i] = ["Interaktive Grafik", "b_h_bild", 1];
i++;
var B_SUB = i;
a_toolButton[i] = ["Letzte Antwort löschen", "b_h_sub", 1];
i++;
var B_ADD = i;
a_toolButton[i] = ["Eine Antwort ergänzen", "b_h_add", 1];
i++;
var B_KOPIE = i;
a_toolButton[i] = ["Block kopieren", "b_h_kop", 1];
i++;
var B_LOESCH = i;
a_toolButton[i] = ["Block löschen", "b_h_del", 1];

var anz_tool_button = i + 1;
var a_fragehilfe = [
	"Frage und Lösung eingeben",
	"Richtige Antwort als erste eingeben",
	"Richtige Antworten hervorheben",
	"Richtige Antworten hervorheben",
	"Eintragen und dann richtige Befriffe hervorheben",
	"Sortierung in richtigen Reihenfolge eintragen",
	"Quadratsortierung in der richtigen Reihenfolge eintragen",
	"Bilderreihenfolge eintragen",
	"Beide Zuordnungspaare eintragen",
	"Den Satz in der richtigen Reihenfolge eintragen",
	"Die Lueckenwoerter mit Doppelklick markieren"
];

$(document).ready(function () {

	ww = $(window).width();
	wh = $(window).height();
	hBody = $("body").height();

	if (edit_mode) { // edit des Beispiels

		chkedit_mode = window.parent.chkedit_mode;
		init_autor_bsp();
		//breiten();

		$("body").prepend("<div id='editor-place' disabled ></div>");
		if (chkedit_mode > 0) {
			//chkeditor macht die analyse_tags...
		} else {
			$(".elem-content").each(function () {
				$(this).css("visibility", "visible");
				analyse_nach_dem_laden($(this), 1);
			});
		}
		$(window).resize(function () {
			resizen_author();
		});
		resizen_author();

	} else { // runtime

		if (getQueryVariable("schueler_flag")) {
			schueler_flag = getQueryVariable("schueler_flag");
		}
		bsp_lfdnr = Number(getQueryVariable("b_lfdnr"));

		if (getQueryVariable("arb_bsp_lfdnr")) {
			arb_bsp_lfdnr = getQueryVariable("arb_bsp_lfdnr");
		}

		// $(".elem-content").each(function () {
		// 	$(this).hide();
		// });



		var puzzle_flag = 0;
		var a_tmp = make_elem_header_runtime();

		if (a_tmp[0] > 0) {
			//sind iframes verwendet
			if (a_tmp[1].indexOf("edupuzzle") > -1) {
				puzzle_flag = 1;
			}
		};

		$(".elem-content").each(function () {
			$(this).css("visibility", "visible");
			analyse_nach_dem_laden($(this), 0);

		});

		//bsp_anz_fragen=$(".elem[data-baa-ftyp]").length+$(".elem[data-baa-ftypspez]").length;
		bsp_anz_fragen = (fragenAnz);
		if ((bsp_anz_fragen == 0) && (puzzle_flag == 0)) {
			tmp = "<span>Einschätzung:</span> ";
			var a_lsg = ["nicht", "nicht", ""];
			for (i = 0; i < 3; i++) {
				tmp = tmp + "<img class='ges_kl' src='images/f_" + i + ".png' onclick='erg_speichern(1," + Math.round(i * 100 / 2) + ")' align=absMiddle title='Schätze realistisch ein: \"Kann ich diese Aufgabe " + a_lsg[i] + " lösen/verstehen?\"'>";
			}
			//tmp=tmp+" <img class='ges_kl' src='images/diskette.gif' onclick='schaetze("+i+","+bsp_lfdnr+")' title='Lösungsbild speichern'>";
		} else {
			tmp = "Punkte";
		}
		if (schueler_flag > 0) {
			$("body").append("<div class='elem-punkte' >" + tmp + "</div>");
		}
		$(window).resize(function () {
			resizen_runtime_bsp();
		});
		resizen_runtime_bsp();

		// // falls ausdruck
		// if ($(".bsp_iframe_rahmen").length > 0) {
		// 	var int1 = setTimeout(iframe_preview_hoehe, 500)
		// }

		lade_sounds();


		body_h = $("body").height();
		win_h = $(window).height();
		//console.log(win_h,body_h)
		if (body_h - win_h > 0) {
			$("body").css("margin-top", (body_h - win_h) * 0.4 + "px");
			platz_genug = 1;

		}
		// console.log(win_h,body_h);
		// $("body").css("border","1px solid red")
		if (elem_anz > 1) {
			if (platz_genug) {
				$(".elem").first().find(".elem-content").addClass("fett");
			}
		}

		butt_schalter = "<td><button id='butt_rechner' onclick='show_rechner()'>Rechner</button></td>";
		rechner = "<div id='rechner_holder' class='hid'>";
		rechner += "<table id='tb_rechner'><tr>";
		rechner += butt_schalter;
		rechner += "<td><input id='z1' type='text' value='' onblur='chg_op()' onkeypress='chk_13(event)' ></td>";
		rechner += "<td><button id='op1' onclick='chg_op(event)' tabindex=-1 title='<- linke Rechnung berechnen ->'>=</button></td>";
		rechner += "<td><input id='erg' type='text' value='' ></td>";
		rechner += "<td><input id='rest' style='display:none' type='text' value=''></td>";
		rechner += "<td><button id='butt_ergebnis' onclick='put_ergebnis()' title='Lösung in die Beispieleingabe hinauf \"beamen\"!'>LSG⇑</button></td></tr></table>";
		rechner += "</div>";


		if (rechner_erlaubt()) {
			if (ist_druckFlag() === false) {
				$("body").append(rechner);
			}
		}

	}
	//alle	
	//init_antworten(edit_mode)
});

function chk_13(ev) {
	if (ev.keyCode == 13) {
		chg_op();
	}
}

function put_ergebnis() {
	if ($("#erg").val() == "") {
		alert("Noch kein Rechnungsergebnis vorhanden!");
	} else {
		var found = 0;
		var done = false;
		$(".elem-content").each(function () {
			$a_inp = $(this).find("input[type=text]");
			if ($a_inp.length > 0) {
				$a_inp.each(function () {
					$inp = $(this);
					if ((!done) && ($inp.val() == "")) {
						$inp.val($("#erg").val());
						$inp.blur();
						done = true;
					}
				});
				found++;
			}
		});
		if (!found) {
			alert("Kein Eingabefeld im Beispiel vorhanden!");
		}

	}
}

function chg_op() {
	function convert_u2c(txt, flag) {
		if (flag == 0) {
			txt = txt.replace(/\s*/g, "");
			txt = txt.replace(/\./g, "*");
			txt = txt.replace(/x/g, "*");
			txt = txt.replace(/\,/g, ".");
			txt = txt.replace(/\:/g, "/");
			txt = txt.replace(/[^-()\d/*+.]/g, '');
		} else if (flag == 1) {
			txt = txt.replace(/\./g, ",");
			txt = txt.replace(/\*/g, " . ");
			txt = txt.replace(/\//g, " : ");
			txt = txt.replace(/\+/g, " + ");
			txt = txt.replace(/\-/g, " - ");
		} else {
			txt = txt.replace(/\./g, ",");
		}
		return txt;
	}

	txt = $("#z1").val();
	txt_c = convert_u2c(txt, 0);

	fehler = 0;
	try {
		erg = eval(txt_c);
	} catch (e) {
		if (e instanceof SyntaxError) {
			erg = " Fehler ";
			//alert("Fehler im Rechenausdruck");
			fehler = 1;
		}
	}
	//console.log(txt_c,"=",erg);
	if (!fehler) {
		$("#z1").val(convert_u2c(txt_c, 1));
	}
	$("#erg").val(convert_u2c(erg + "", 2));
}

function show_rechner() {
	$("#rechner_holder").toggleClass("hid");
	$("#butt_rechner").show();
}

function lade_sounds() {
	snd_stern_plus = new Howl({
		src: ['sounds/stern_plus.aac']
	});
	snd_stern_minus = new Howl({
		src: ['sounds/stern_minus.aac']
	});
	snd_stern_fertig = new Howl({
		src: ['sounds/stern_fertig.mp3']
	});

}


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

function rechner_erlaubt() {
	var txt = window.location.href;
	return (txt.indexOf("is_bsp=1") > -1) || (txt.indexOf("schueler_flag"));
}

function ist_druckFlag() {
	var txt = window.location.href;
	//console.log("druckFlag=",txt.indexOf("druckFlag=1") > -1);
	return (txt.indexOf("druckFlag=1") > -1);
}

// resize
function resizen_runtime_bsp() {
	//console.log(druckFlag);
	//if (druckFlag) iframe_preview_hoehe();
	zzz++;
	//console.log("runtimeresize");
	resize_dynamo(0);
	if (ifr_refreshen == 1) { //beim erstem mal nicht
		if ($("iframe").length > 0) {
			if (!isIpad()) {
				clearTimeout(intVar);
				intVar = setTimeout("iframe_refresh()", 2000);
			}
		}
	}
	ifr_refreshen = 1;
	//iframe_preview_hoehe();
	//iframe_preview_hoehe();
}

function iframe_refresh() {
	$("iframe").each(function (index, wert) {
		var $elem = $(this).closest(".elem");
		if ($elem.data("baa-fenst") == "0") {
			var pnr = $elem.data("baa-prgnr");

			if (a_prgtyp[pnr][0] == "ggb") {
				com_ggb($elem, "get");
			} else {
				$(this).attr("src", $(this).attr("src"));
			}

			if (a_prgtyp[pnr][0] == "ggb") {
				com_ggb($elem, "set");
			}
		}
	});
}



var flag_ft11 = 0;
var dyn_norm_breite = 700;

function resize_dynamo(ed_flag) {
	if (flag_ft11) {
		$(".elem").each(function () {
			if ($(this).data("baa-ftyp") == '11') {
				$elem = $(this);
				$eCont = $elem.find(".elem-content");

				var ow = $eCont.outerWidth();

				//var bf = ow / dyn_norm_breite;


				var ret = 3;
				if (!$elem.hasClass("p100")) {
					$.each(a_proz_breite, function (index, wort) {
						if ($elem.hasClass(wort)) {
							ret = index;
						}
					});
				}


				// 1.3.2021 geändert
				// var pr = (100 + (3 - ret) * 33) / 100;
				//console.log(ret,pr);		
				// muss noch korrigiert werden
				// if (edit_mode) {
				// 	$eCont.css("font-size", (bf * 100 * pr) + "%");
				// } else {
				// 	$eCont.css("font-size", (bf * 100 * pr) + "%");
				// }


				//console.log(ow,dyn_norm_breite,bf,bf*80,"%");	
				var hgfakt = Number($elem.data("baa-hgfakt"));
				$eCont.outerHeight(ow * hgfakt);
				//var anzBst=$eCont.data("baa-width");

				//var flag = Number(!ed_flag);
				$eCont.find(".zuDropDyn").each(function (index) {
					$drop = $(this);
					$drop
						.css("width", "auto")
						.css("height", "auto");

					var dw = $drop.outerWidth(),
						dh = $drop.outerHeight();

					//nur wenn noch nie gesetzt
					if (($drop.data("baa-left") <= 0) || ($drop.data("baa-left") >= 1)) {
						$drop
							.data("baa-left", 0.1)
							.data("baa-top", 0.03 * (index + 1));

					}

					var rel_x = Number($drop.data("baa-left")),
						rel_y = Number($drop.data("baa-top"));

					//console.log(index,edit_mode,"zhgfakt:",hgfakt,"rel_x:",rel_x,"rel_y:",rel_y,"ow=",ow,"ow*hgfakt=",ow*hgfakt,$eCont.outerHeight());
					$drop.css({
						"left": (rel_x * ow),
						"top": (rel_y * ow),
						"margin-left": -dw / 2 + "px",
						"margin-top": -dh / 2 + "px"
					});


				});
			};
		});

	} // else {alert("no")}
}



function isIpad() {
	return navigator.platform == "iPad";
}



function chg_breite($elem, flag) {
	var ret = 0;
	$.each(a_proz_breite, function (index, wort) {
		if ($elem.hasClass(wort)) {
			ret = index;
		}
	});
	$elem.removeClass("p25 p50 p75 p100");
	$elem.addClass(a_proz_breite[(4 + ret + flag) % 4]);
	elem_adr_refr($elem);
}


var edit_farbe1 = "#F7FFC2";
var edit_farbe2 = "#EEFFDA";

function tastatur_ein_aus(flag) {
	//var edit=$($("div")[0]).attr("contenteditable");
	if (flag == 9) {
		chkedit_mode = !chkedit_mode;
	} else {
		chkedit_mode = flag;
	}
	if (chkedit_mode) {
		$(".elem").attr("contenteditable", "true").css("cursor", "pointer").css("background-color", edit_farbe1);
	} else {
		// $(".elem").removeAttr("contenteditable").css("cursor", "default").css("background-color", "transparent");
		$(".elem").removeAttr("contenteditable").css("cursor", "default").css("background-color", edit_farbe1);

	}
}

function h_scroller(flag) {
	alert("h-scroll");
	parent.window.document.getElementById('senk3_id').cols = "210,1012,*";
}


function com_ggb($elem, modus) {

	console.log("braucht man das?");
	/*	 19.7.15 - bracuht man das?
		if (modus=='get') { // holen
			var $frame=$elem.find("iframe");
			var gg=$frame[0].document || $frame[0].contentWindow;
			$elem.data("baa-ggbdatei",gg.ggbApplet.getBase64());
		} else { //setzen
			data64[appletnr]=$elem.data("baa-ggbdatei")+"";
		}
	*/
}


// zentraler öffner
function make_elem_header_runtime() {
	var anz_iframes = 0;
	var adr = "";
	var verbot_direkt_show = 0;

	$(".elem").each(function (index) {
		elem_anz++;
		//$daten=$(this).data(); zuvielspeicher

		var pnr = 0;
		if ($(this).data("baa-prgnr")) {
			pnr = $(this).data("baa-prgnr");
		}

		if (pnr == 14) { //fragetypen	
			frage_typ($(this), 0);
		} else {

			if (a_prgtyp[pnr][ADR_SHOW] == 1) { // adressleiste und internet
				var alt_wert = "";
				var button_abgabe = "";
				if (a_prgtyp[pnr][PRG_KZZ].substr(0, 2) == "gg") {
					alt_wert = "Geogebra-Zeichnung";

					var conv = 0;
					if ($(this).data("baa-ggbconfig")) conv = $(this).data("baa-ggbconfig");
					if ((conv & 128) > 0) {
						//						button_abgabe=get_adr_header_button("b_abgabe","Abgabe",0);			
					}

				} else {
					alt_wert = a_prgtyp[pnr][ADR_DEF];
					if ($(this).data("baa-adr")) {
						alt_wert = $(this).data("baa-adr");
						adr = $(this).data("baa-adr");
					}
				}

				//				$(this).append("<div class='elem-adressblock'>"+get_adr_header_button("b_adrOpen","Öffnen des Beispiels",0)+"<span class='elem-adr'>"+alt_wert+"</span></div>");
				//				$(this).append("<div class='elem-adressblock'>"+get_adr_header_button("b_adrOpen","Öffnen des Beispiels",0)+"<span class='ttd elem-adr'>"+alt_wert+"</span>"+get_adr_header_button("b_abgabe","Abgabe",0)+"</div>"); 
				$(this).append("<div class='elem-adressblock'>" + get_adr_header_button("b_adrOpen", "Öffnen des Beispiels", 0) + "<div class='klammer'><input class='ttd elem-adr' style='background-color:transparent;border:none' readonly value='" + alt_wert + "' /></div>" + button_abgabe + "</div>");

				anz_iframes++;
				if ($(this).data("baa-ifrextern")) {
					verbot_direkt_show = Number($(this).data("baa-ifrextern"));
				}
			}
		}
	});

	// if (elem_anz>1) {
	// 	if (platz_genug) {
	// 		$(".elem").first().find(".elem-content").addClass("fett");
	// 	}
	// }

	/*
	if ($(".elem-adr").length) {
		$(".elem-adr").css("width","100%").css("width","-="+BUTT_REDUK+"px");
	}
	*/

	//$(".adrButton").button({icons: {primary: "ui-icon-arrowthickstop-1-s"},text:false});
	$(".b_abgabe").button({
		icons: {
			primary: "ui-icon-disk"
		},
		text: false
	});

	if (anz_iframes > 0) {
		$(".b_adrOpen").off("click").on("click", function () {
			$el = $(this).closest(".elem");
			var vflag = 0;
			vflag = Number(iframe_on_off($el, 9));
			$(this).find("span").text(["Öffnen des Beispiels", "Beispiel schließen"][vflag]);
		}).button({
			icons: {
				primary: "ui-icon-arrowthickstop-1-s"
			},
			text: false
		});

		if (anz_iframes == 1) {
			if (!verbot_direkt_show) {
				$(".b_adrOpen").trigger("click");
			} else {
				$(".elem-adressblock").css("display", "table");
			}
		}
	}
	return [anz_iframes, adr];
}

function get_adr_header_button(bclass, bez, pnr) {
	return ("<button class='ttd b_adr " + bclass + "' data-pnr='" + pnr + "'>" + bez + "</button>");
}


function chk_iframe_ggb_closed() {
	var anz = 0;
	$(".elem").each(function (index) {
		$elem = $(this);
		//console.log($elem.data()+"<br>pnr: "+$elem.data("baa-prgnr"));
		if ($elem.data("baa-prgnr")) {
			if (a_prgtyp[$elem.data("baa-prgnr")][0] == "ggb") {
				if ($elem.find("iframe").length > 0) { // wenn offen
					iframe_on_off($elem, false);
					anz++;
				}
			}
		}
	});
	return anz;
}

function chk_all_iframe_closed() {
	var anz = 0;
	$(".elem").each(function (index) {
		$elem = $(this);
		//console.log($elem.data()+"<br>pnr: "+$elem.data("baa-prgnr"));
		if ($elem.data("baa-prgnr")) {
			if ($elem.find("iframe").length > 0) { // wenn offen
				iframe_on_off($elem, false);
				anz++;
			}
		}
	});
	return anz;
}









var appletnr = 0;
var data64 = ["", "", "", "", "", "", ""];

function iframe_on_off($elem, flag) {

	function is_ggb() {
		zeit = 0;
		if ($elem.data("appletnr")) {
			appletnr = $elem.data("appletnr");
		} else {
			appletnr++;
		}
		var zus = "&";
		if (adr.indexOf("?") == -1) zus = "?";
		adr = adr + zus + "appletnr=" + appletnr + "&ed=" + edit_mode;

		var conf = 0;
		if ($elem.data("baa-ggbconfig")) {
			conf = Number($elem.data("baa-ggbconfig"));
		}
		adr = adr + "&config=" + conf;

		if ($elem.data("baa-ggbdatei")) {
			data64[appletnr] = $elem.data("baa-ggbdatei") + "";
		}
		$elem.data("appletnr", appletnr);
	}


	var prgnr = $elem.data("baa-prgnr");

	//var extern=(a_prgtyp[prgnr][EXT_WIN]==1);
	var extern = ($elem.data("baa-ifrextern") == "1");


	if (flag == 9) {
		if (extern) {
			var vis_flag = !(extWind && !extWind.closed);
		} else {
			var vis_flag = ($elem.find(".elem-content").length == 0);
		}
	} else {
		var vis_flag = flag;
	}
	if (vis_flag) { //zeigen

		var zeit = 600;
		var adr = get_adr($elem);
		if (extern && !edit_mode) { //externes fenster
			is_ggb();
			win_extra($elem, adr);
			//$(".elem-adressblock").show();

		} else {

			var hh = 600; //vorher 600
			if ($elem.data("baa-ifrhoehe")) {
				hh = $elem.data("baa-ifrhoehe");
			}
			if (a_prgtyp[prgnr][0] == "ggb") {
				is_ggb();
			}

			if (adr.indexOf("prgruf=ebook") > -1) {
				//adr+="&m_user_nr="+schueler_flag+"&bsp_lfdnr=" +bsp_lfdnr+"&arb_bsp_lfdnr="+arb_bsp_lfdnr
				adr += "&m_user_nr=" + schueler_flag + "&arb_bsp_lfdnr=" + arb_bsp_lfdnr;
				//alert(adr);
			}



			$elem.append("<div class='elem-content noedit' style='padding:0px'><iframe class='elem-ifr' src='" + adr + "'></iframe></div>");
			$elem.find(".elem-ifr").height(32);
			if (hh == 999) {
				var ifr = $elem.find(".elem-ifr");
				hh = (wh - ifr.offset().top - 20);
			}
			//			$elem.find(".elem-ifr").height(hh);
			//$(".elem-content:has(.elem-ifr)").css("padding",0);

			$elem.find(".elem-ifr").height(hh);
			//$elem.find(".elem-ifr").fadeIn(200);					
			//$elem.find(".elem-ifr").animate({height: hh},zeit);			

			if (edit_mode) {
				$(".ifr_sizer.ad").show();
			}

		}

	} else { //ausblenden
		if (extern) { //externes fenster
			if (extWind) {
				extWind.close();
			}
		} else {
			if (edit_mode) {
				$(".ifr_sizer.ad").hide();
			}

			if (a_prgtyp[prgnr][0] == "ggb") {
				//alert($elem.data("appletnr")+" " +appletnr);
				if (!$elem.data("appletnr")) {
					$elem.data("appletnr", appletnr);
					alert("appletnr fehlerhaft: " + $elem.data("appletnr") + " " + $elem.attr("data-appletnr"));
				}
				var $web = $elem.find("iframe");
				var gg = $web[0].document || $web[0].contentWindow;

				console.log(gg);

				//alert(gg.ggbApplet.getBase64().length);

				//console.log("len:",gg.ggbApplet.getBase64().length);
				var sp_flag = true;
				if (($elem.data("baa-ggbdatei")) && (gg.ggbApplet.getBase64())) {
					if (gg.ggbApplet.getBase64().length == $elem.data("baa-ggbdatei").length) {
						if (gg.ggbApplet.getBase64() == $elem.data("baa-ggbdatei")) {
							sp_flag = false;
						}
					}
				}
				//alert("Änderungs_flag " + sp_flag);
				if (sp_flag) {
					if (gg.ggbApplet.getBase64().length > 0) {
						if (gg.ggbApplet.getBase64().length > 500000) {
							alert("Sie haben ein sehr großes Bild verwendet, dieses Beispiel wird extrem langsam auf Tablets - bitte das Bild vor dem Hochladen verkleinern und dann erst in Geogebra einfügen!");
						}
						$elem.data("baa-ggbdatei", gg.ggbApplet.getBase64()); // nicht löschen
					}
				}

				if (edit_mode) {
					if ($elem.data("baa-ggbconfig") == undefined) {
						$elem.data("baa-ggbconfig", 0);
					}
					//					$elem.data("baa-ggbconfig",gg.get_schalter()[0]);
					//					$elem.data("baa-ggbversion",gg.get_schalter()[1]);

					//console.log("get:"+gg.get_schalter());
				}
			}
			$elem.find(".elem-content").remove();
			//$elem.find("iframe").remove();
		}
	}
	return vis_flag;
}

function vis_breite($elem) {
	$elem.toggleClass("p50 p100");
	elem_adr_refr($elem);
}


function win_extra($elem, adr) {
	frame_open = 0; //weil auch die anzeige geschlossen wird
	if (adr.indexOf("?") > 0) {
		adr += "&ext=1";
	} else {
		adr += "?ext=1";
	}

	var sw = screen.width;
	var sh = screen.height - 170;
	var ww = Math.min(sw, 1024);
	var wh = sh - 64;
	var param = "left=0,top=0,width=" + Math.min(ww, 1024) + ",height=" + Math.max(wh, 400);
	param = param + ",location=1,toolbar=0,titlebar=0,menubar=0,status=0,resizable=1,scrollbars=1";
	if (extWind && !extWind.closed) {
		alert("focus");
		extWind.focus();
	} else {
		extWind = window.open(adr, "wopen", param);
		extWind.focus();
	}
}

function get_adr($elem) {
	var a_prg = a_prgtyp[$elem.data("baa-prgnr")];
	if ($elem.data("baa-adr")) {
		adr = $elem.data("baa-adr");
	} else {
		var adr = a_prg[ADR_DEF];
	}
	if (adr.substr(0, 4) != "http") {
		if (adr.charCodeAt(0) != 47) {
			if (adr.substr(0, 4) != "lib/") {
				adr = "https:\/\/" + adr;
			}
		}
	}

	if (adr.indexOf("youtube") > 0) {
		if (adr.indexOf("?rel=0") == -1) {
			adr = adr + "?rel";
		}
	}

	if (a_prg[0] == "ggm") { // nur bei geogebra
		if (adr.indexOf("?mobile=true") == -1) {
			adr = adr + "?mobile=true";
		}
	}
	return adr;
}

var htm_obj = "";

function show_html(htm, vorspann) {
	ww = 1000;
	wh = 700;
	var param = "left=0,top=0,width=" + Math.min(1024, ww) + ",height=" + Math.max(900, wh);
	param = param + ",location=1,toolbar=0,titlebar=0,menubar=0,status=0,resizable=1";
	adr = "99_html_viewer.php";
	//htm_obj="<h1>"+vorspann+"</h1>"+htm;
	htm_obj = htm;

	baa_win = window.open(adr, "wopen", param);
	baa_win.focus();
}

 


// Fragetypen

//var edit_mode=0;

var a_befehle = ["add", "sub", "kop", "Modus", "BreiteM", "BreiteP", "test"];



function zeige_farbe_richtig($el, richtig,is_f_korrekt=false) {
	if (is_f_korrekt) {

		if (richtig) {
			$el.removeClass("f_falsch");
			$el.addClass("f_korrekt");
		} else {
			$el.removeClass("f_korrekt");
			$el.addClass("f_falsch");
		}
		



	} else {
		$el.css({
			"background": "none",
			"background-color": a_chk_hgfarbe[richtig],
			"color": a_chk_vgfarbe[richtig],
			"border": "none"
		});
	
	}
}



function nbsp2space(txt) {
	var re = new RegExp(String.fromCharCode(160), "g");
	return txt.replace(re, " ");
}


function make_edit($bsp, tag_edit) {
	/*
		$bsp.find("button").each (function(index) {
			$(this).button().removeAttr("contenteditable");
		});
	*/
	$bsp.find(tag_edit).css("cursor", "text").attr("contenteditable", "true");
}

function frage_typ($bsp, aend_mode) { //wann angesprungen???
alert("Multi Choice")
	//console.log("ftyp:",$bsp.data("baa-ftyp"),"aend-mode:",aend_mode,"ankommen",$bsp.data());
	if ($bsp.data("baa-ftyp") != undefined) {
		//console.log("mode:",aend_mode,"ftyp:",$bsp.data("baa-ftyp"),"ankommen",$bsp.data());
		console.log("ftyp:",$bsp.data("baa-ftyp"),"ed-mode",aend_mode);
		var lsg_m = "",
			lsg_r = "";
		ftyp = Number($bsp.data("baa-ftyp"));
		switch (ftyp) {
			case 0:
				$eAntw = $bsp.find(".eAntw");
				if (!aend_mode) {
					var my_ftyp = ftyp;
					var myFrageNr = add_punkte(-1, -1, $eAntw.length, 0);

					$bsp.find(".eAntw input").each(function (index) {
						if ($(this).attr("size")) {
							$(this).width($(this).attr("size") * 16);
						}
						$(this).blur(function () {

							var pkt = 0;
							lsg_m = $(this).val().trim();
							lsg_r = $(this).parent().data("baa-lsg");

							if (lsg_m == lsg_r) {
								zeige_farbe_richtig($(this), 1);
								pkt = 1;
							} else {
								zeige_farbe_richtig($(this), 0);
								pkt = -1;
							}
							$eA = $(this).parent();
							if ($eA.data("baa-solved") != "1") {
								$eA.data("baa-solved", "1");
							}
							add_punkte(myFrageNr, my_ftyp, pkt, 0); //chk
							//}
						});
					});

				} else if (aend_mode == 1) {

					make_edit($bsp, "div");

					//$bsp.find(".eAntw div").enableSelection();
					$bsp.find(".eAntw").each(function (index) {
						$(this).children("input").val($(this).data("baa-lsg"));
						$(this).children("div").css({
							"border": "1px dotted #ddd",
							"margin-right": "4px"
						});
					});


				} else if (aend_mode == 3) {

					var aufgaben_anz = $bsp.find(".eAntw input").length;
					var ges = "";
					$bsp.find(".eAntw").each(function (index) {
						var a_childs = $(this).children();
						var antw = $(a_childs[1]).val();
						var frage = $(a_childs[0]).html();
						var a_zeilen = ["", "", "", ""];
						if (frage != undefined) {
							var frage = replaceNbsp(frage).trim();
							a_zeilen[2] = "<div class='edi'>" + frage + "</div>";
						}
						if (antw != undefined) {
							var antw = replaceNbsp(antw).trim();
							a_zeilen[3] = "<input size='" + antw.length + "' class='ui-state-default edi' value='' />";
						} else {
							antw = "";
						}
						a_zeilen[1] = "<div class='t_wort eAntw' data-baa-lsg='" + antw + "'>";
						a_zeilen[4] = "</div>";
						ges += a_zeilen.join("");
					});
					$bsp.html(ges).data("baa-korrekt", '"+antw+"');
				}
				break;

			case 1: // button
				$eAntw = $bsp.find(".eAntw");

				if (!aend_mode) {
					var my_ftyp = ftyp;
					var a_satz = $bsp.find("button.eAntw").toArray();
					$bsp.text("").append(shuffle(a_satz));
					var myFrageNr = add_punkte(-1, -1, 1, 0);

					$bsp.find("button.eAntw").button().each(function (index) {
						$(this).click(function (index) {
							var pkt = 0;
							if ($(this).data("baa-order") == "0") {
								pkt = 1;
								//$eA.data("baa-solved","1");
							} else {
								pkt = -1;
							}

							zeige_farbe_richtig($(this), Number(pkt > 0));

							$eA = $(this).parent();
							add_punkte(myFrageNr, my_ftyp, pkt, 1);
							//alert(frage_max_punkte);

							/*
							if ($eA.data("baa-solved")!="1") {
								$eA.data("baa-solved","1");
							}
							*/
							$(this).attr("disabled", "true");
						});
					});


					//$bsp.find("button.eAntw").button();
					//$bsp.find("span").enableSelection();
				} else if (aend_mode == 1) {
					var htm = $bsp.html();
					$bsp.html(htm.replace(/button/gi, "div"));
					$bsp.find("div").css({
						"text-align": "center",
						"padding": "0.4em 1em"
					});
					//.addClass("ui-state-default ");

					make_edit($bsp, "div");
					//make_edit($bsp,"button")

				} else if (aend_mode == 3) { //save


					var zeilen = "";
					$bsp.find(".eAntw").each(function (index) {
						//console.log(index,$(this).text())
						zeilen += "\n<button class='t_mult eAntw edi ui-state-default' data-baa-order='" + index + "'>" + $(this).text() + "</button>";

					});
					$bsp.html(zeilen).data("baa-korrekt", '1');
					//save array to data, lsg to array-lsg
				}

				break;

			case 2:
			case 3:
				//checkboxes edit
				$eAntw = $bsp.find(".eAntw");
				if (!aend_mode) {
					var my_ftyp = ftyp;

					var a_satz = $bsp.find(".t_check .eAntw").toArray();
					$bsp.find(".t_check").text("").append(shuffle(a_satz));

					/*
					console.log($bsp.html());
					console.log($bsp.find(".t_check").length,$bsp.find(".t_check").html());
					$bsp.find(".t_check").buttonset();
					alert(1);
					schwerer fehler in buttonset bei 2 gleichen
					*/

					$bsp.find(".t_check").buttonset().disableSelection();

					var ranz = $bsp.find(".t_check .eAntw[data-baa-lsg=1]").length;
					var myFrageNr = add_punkte(-1, -1, ranz, 0);


					var anz = a_satz.length;
					//$bsp.find(".t_check .eAntw.horiz label").css("width", (100 / anz) + "%");

					$bsp.find(".t_check input").each(function (index) {
						$(this).click(function (index) {
							var pkt = 0;
							$eA = $(this).closest(".eAntw");
							var lsg_m = Number($(this).prop("checked"));
							var lsg_r = $eA.data("baa-lsg");
							if (lsg_m) {
								if (lsg_r == 1) {
									//if ($eA.data("baa-solved")!="1") {
									pkt = 1;
									//}
								} else {
									pkt = -1;

									// zeige_farbe_richtig($eA.parent(), 0);
									$eA.find("label").css({
										"color": "#000000",
										"background-color": a_chk_hgfarbe[0]
									});

									$(this).attr("disabled", "true");
									$(this).prop("checked", "");
									//$eA.css({"background":"none","background-color":"#FFBF55"});
									$bsp.find(".t_check").buttonset("refresh");

								}
								add_punkte(myFrageNr, my_ftyp, pkt, 0); //chk
							};
						});
					});




				} else if (aend_mode == 1) {
					//$bsp.find(".t_check").buttonset("destroy");

					//				$bsp.find(".eAntw").css("font-size","inherit").css("padding","inherit");
					//				$bsp.find("label").css("padding","inherit");

					$bsp.find(".t_check").buttonset();
					$bsp.find(".t_check .horiz label").addClass("ui-corner-all");

					$bsp.find(".eAntw").each(function (index) {
						if ($(this).data("baa-lsg") == "1") {
							$(this).find("input").attr("checked", "checked");
							$(this).find("label").toggleClass("ui-state-active").attr("contenteditable", "true").css("cursor", "text");
						} else {
							$(this).find("label").attr("contenteditable", "true").css("cursor", "text");
						}

						$(this).find("input").attr("title", "Zutreffend oder nicht zutreffend");
					});
					// nicht als label sondern als div behandeln
					make_edit($bsp, "span.ui-button-text");
					$bsp.find("input").toggleClass("ui-helper-hidden-accessible");

					$bsp.find(".eAntw").each(function (index) {
						var htm = $(this).html();
						$(this).html(htm.replace(/label/gi, "div"));
					});

				} else if (aend_mode == 3) {
					var tmp = "";
					if (ftyp == 3) tmp = " horiz";

					var anz = 0;
					var zeilen = "<div class='t_check'>";
					$bsp.find(".eAntw").each(function (index) {
						//console.log(index,$(this).text())
						var inp = $(this).find("input")[0];
						if ($(inp).prop("checked")) anz++;
						zeilen += "\n<div class='eAntw" + tmp + "' data-baa-lsg='" + Number($(inp).prop("checked")) + "'>";
						zeilen += "<input data-baa-order='" + index + "' type='checkbox' id='ch" + ftyp + "eck" + index + "'><label class='edi' for='ch" + ftyp + "eck" + index + "'>" + $(this).text() + "</label>";
						zeilen += "</div>";
					});
					zeilen += "</div>";
					$bsp.html(zeilen).data("baa-korrekt", '1');

					//console.log("zeilen:",zeilen);
				}
				break;


			case 5: //sortieren
			case 6: //grid
			case 7: //gridbild
				//$eAntw=$bsp.find(".eAntw");
				if (!aend_mode) {
					var my_ftyp = ftyp;
					var a_satz = $bsp.find(".t_sort .eAntw").toArray();
					var myFrageNr = add_punkte(-1, -1, a_satz.length, 0);

					$bsp.find(".t_sort").text("").append(shuffle(a_satz));
					if (ftyp == 6) {
						var breite = $bsp.width();
						var anz = $bsp.find(".t_grid li").length;

						$bsp.find(".t_grid li").css("width", "calc(" + 100 / anz + "% - 4px)");
						//$bsp.find(".t_grid li").css("width","calc("+(90/anz)+"%)");

						//$bsp.find(".t_grid li").css("width","calc("+100/anz+"% - "+(4*(anz-1)/anz)+"px)");
						//$bsp.find(".t_grid li").last().css("margin-right",0);
					}
					$bsp.find(".t_sort").sortable({
						cursor: "move",
						items: "[data-baa-solved='0']",
						/*				
							placeholder: "ui-state-highlight",
							start: function(e, ui){
								ui.placeholder
								.width(ui.item.width()-8)
								.height(ui.item.height());
							},
						*/
						/*
						xxaxis: 'y',
						*/
						opacity: 0.8,

						update: function (event, ui) {
							var orderNr = ui.item.data("baa-order");
							var zielNr = ui.item.index();

							if (zielNr == orderNr) {
								pkt = 1;
							} else {
								pkt = -1;
							}
							var anz = 0;
							r = 0;
							// muss neu sein 
							$bsp = $(this).parent();
							$bsp.find(".t_sort .eAntw").each(function (index) {
								if (Number($(this).data("baa-order")) == index) {
									if ($bsp.data("baa-ftyp") == 7) {
										$(this).css("border", "2px solid #B8DE6F");
									} else {
										$(this).css({
											"background": "none",
											"background-color": "#B8DE6F"
										});
										//									zeige_farbe_richtig($(this),1);
									}
									$(this).data("baa-solved", "1");
									r++;
								} else {
									//								zeige_farbe_richtig($(this),0);
									$(this).css("background-color", "#eee");

									//$(this).css("background-color","#eee");
									//$(this).css("border","1px solid #ccc");
								}
								anz++;
							});
							add_punkte(myFrageNr, my_ftyp, pkt, Number(anz == r));
						}


					}).disableSelection();

				} else if (aend_mode == 1) {
					$bsp.find(".t_sort").sortable({
						disabled: true
					}).enableSelection();
					//$bsp.find(".t_sort li").css("cursor","text");

					if (ftyp == 6) {
						var breite = $bsp.width();
						var anz = $bsp.find(".t_grid li").length;

						//$bsp.find(".t_grid li").width(Math.floor((breite-(anz*10))/anz));
						$bsp.find(".t_grid li").css("width", Math.floor(91 / anz) + "%");
					}

					make_edit($bsp, "li");
					// sorter edit
					//$bsp.find(".t_sort").sortable("destroy").enableSelection();
					//$bsp.find(".t_sort").enableSelection();
					//$bsp.find("#id_sduo1,#id_sduo2").sortable("destroy").enableSelection();

				} else if (aend_mode == 3) {
					var zusatz = "";
					if (ftyp > 5) zusatz = " t_grid";

					var zeilen = "";
					$bsp.find(".eAntw").each(function (index) {
						//					zeilen+="<li class='eAntw edi ui-state-default edi' data-baa-order='"+index+"' data-baa-solved='0' >"+$(this).text().trim()+"</li>";
						zeilen += "<li class='eAntw edi ui-state-default edi' data-baa-order='" + index + "' data-baa-solved='0' >" + $(this).html().trim() + "</li>";
					});
					$bsp.html("<ul class='t_sort " + zusatz + "'>" + zeilen + "</ul>").data("baa-korrekt", '1');
					if (ftyp == 7) {
						$bsp.find("li").attr("style", "background-image:url(bilder/bild_372.png)");
					}


				}
				break;

			case 8: //doppelsort
				if (!aend_mode) {
					var my_ftyp = ftyp;


					var a_satz = $bsp.find("#id_sduo2 .eAntw").toArray();

					var myFrageNr = add_punkte(-1, -1, a_satz.length, 0);

					$bsp.find("#id_sduo2").text("").append(shuffle(a_satz));

					$bsp.find("#id_sduo2 .eAntw").each(function () {
						$(this).data("richtig", $(this).text())
							.append("<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>");
					});
					//console.log($bsp.find("#id_sduo1").outerWidth());
					var tbr = $bsp.find("#id_sduo1").outerWidth() + 16;
					$bsp.find("#id_sduo2").css("width", "calc(100% - " + tbr + "px)");





					$bsp.find("#id_sduo1, #id_sduo2").sortable({
						connectWith: ".connectedSortable",
						opacity: 0.8,

						update: function (event, ui) {
							var orderNr = ui.item.data("baa-order");
							var zielNr = ui.item.index();
							//console.log("ord:",orderNr,"zl:",zielNr);
							//console.log("richt:",ui.item.data("richtig"),ui.item.parent().children("[data-baa-order='"+zielNr+"']").data("richtig"));							

							var wort_r = ui.item.parent().children("[data-baa-order='" + zielNr + "']").data("richtig");
							var wort_m = ui.item.data("richtig");


							var pkt = -1;
							if ((zielNr == orderNr) || (wort_r == wort_m)) {
								pkt = 1;
							}
							var anz = 0;
							r = 0;
							$bsp.find("#id_sduo2 .eAntw").each(function (index) {
								var chk_ind = (index == Number($(this).data("baa-order")));
								var chk_wort = ($(this).data("richtig") == $(this).parent().children("[data-baa-order='" + index + "']").data("richtig"));
								//console.log("order:",index,$(this).data("baa-order"),"wort:",index,$(this).data("richtig"),"=?",$(this).parent().children("[data-baa-order='"+index+"']").data("richtig"));
								if (chk_ind || chk_wort) {
									zeige_farbe_richtig($(this), 1);
									$(this).data("baa-solved", "1");
									r++;
								} else {
									$(this).css("background-color", "#eee");
								}
								anz++;
							});
							add_punkte(myFrageNr, my_ftyp, pkt, Number(anz == r)); //alle durchgeführt
						}
					}).disableSelection();
					$bsp.find("li.ui-state-default").css("cursor", "move");

					$bsp.find("#id_sduo1").sortable("disable").disableSelection();
					$bsp.find("#id_sduo1 li").css("cursor", "default");


				} else if (aend_mode == 1) {
					$bsp.find("#id_sduo1, #id_sduo2").sortable({
						connectWith: ".connectedSortable",
						disabled: true
					});
					make_edit($bsp, "li");

				} else if (aend_mode == 3) {

					$bsp.find("#id_sduo1 .eAntw").each(function (index) {
						$(this).data("baa-order", index);
						$(this).html($(this).text());
					});
					$bsp.find("#id_sduo2 .eAntw").each(function (index) {
						//$(this).data("baa-order",index); // data wird nicht gespeicher6t
						$(this).attr("data-baa-order", index);
						var htm = $(this).html();
						//htm=htm.replace(/(\<br\>)\+\$/g,"");						
						if (htm.indexOf("img") == -1) {
							htm = $(this).text();
						}
						$(this).html(htm);
					});
				}
				break;

			case 9: //wortreihe
				if (!aend_mode) {
					var my_ftyp = ftyp;
					$bsp.text("").append("\n<ul class='t_wreihe'></ul>");
					$elem = $bsp.find(".t_wreihe");
					var a_satz = $bsp.data("baa-satz").split(" ");
					a_tmp = [];
					for (var i = 0; i < a_satz.length; i++) {
						a_tmp.push(i);
					}

					var myFrageNr = add_punkte(-1, -1, a_satz.length, 0);

					a_tmp = shuffle(a_tmp);
					$.each(a_satz, function (index) {
						var j = a_tmp[index];
						$elem.append("\n<li data-baa-order='" + j + "' class='eAntw ui-state-default'>" + a_satz[j].replace(/_/g, " ") + "</li>");
					});

					//$bsp.find(".t_wreihe").text("").append(shuffle(a_satz));

					$bsp.find(".t_wreihe").sortable({
						//placeholder: "sortable-placeholder",
						opacity: 0.7,

						update: function (event, ui) {
							var orderNr = ui.item.data("baa-order");
							var zielNr = ui.item.index();
							var pkt = -1;
							if (zielNr == orderNr) {
								pkt = 1;
							}


							var anz = 0;
							r = 0;
							$bsp.find(".t_wreihe .eAntw").each(function (index) {
								$liMoved = $(this);
								if ((Number($(this).data("baa-order")) == index) || (a_satz[Number($(this).data("baa-order"))] == a_satz[index])) {

									//$(this).css("border","2px solid #B8DE6F");
									zeige_farbe_richtig($liMoved, 1);
									//$(this).data("baa-solved","1");
									r++;
								} else {
									//$(this).css("border","1px solid #eee");
									$liMoved.css("background-color", "#eee");
								}
								anz++;
							});
							add_punkte(myFrageNr, my_ftyp, pkt, Number(anz == r)); //alle durchgeführt
						}
					});


				} else if (aend_mode == 1) {
					$bsp.text("").append("<div class='eAntw edi ui-state-default' style='font-size:1.5em;padding:4px' contenteditable='true'>" + $bsp.data("baa-satz") + "</div>");

				} else if (aend_mode == 3) {

					var satz = $bsp.find("div.eAntw").text().trim();
					satz = satz.replace(/\ /g, ' ');
					satz = nbsp2space(satz);

					var a_satz = satz.split(" ");
					a_satz = array_empty_remove(a_satz);
					//console.log(a_satz);
					$bsp.data("baa-satz", a_satz.join(" "));
				}
				break;

			case 10: //luecken
				if (!aend_mode) {
					function ein_li($elem, w_pos, dropp, wort) {
						$elem.append("\n<li data-baa-order='" + w_pos + "' class='ui-state-default" + dropp + "'>" + wort + "</li>");
					}
					var my_ftyp = ftyp;
					//t_luecke spielmodus

					var a_wort = new Array();
					$bsp.text("").append("<ul class='t_luecke'></ul>");
					var satz = $bsp.data("baa-satz");

					satz = satz.replace(/{/g, "#{").replace(/}/g, "}#");

					$elem = $bsp.find(".t_luecke");
					var a_satz = satz.split(/#/g);
					var a_antw = [];
					var dropp = "";
					var anz = 0;
					var len = 1;
					var leer = "_____________________________";
					var w_pos = 0;

					$.each(a_satz, function (index) {
						var wort = a_satz[index];
						dropp = "";

						if (wort.charAt(0) == "{") {
							len = Math.max(len, wort.length / 3 * 2); //am 1.8.21 auf /2

							a_antw[w_pos] = wort.substr(1, wort.length - 2);
							wort = leer.substr(0, len + 1);
							dropp = " drop";
							anz++;
							ein_li($elem, w_pos, dropp, wort);
							w_pos++;

						} else {
							var a_wort = wort.trim().split(" ");
							for (k in a_wort) {
								if (a_wort[k].trim() > "") {
									txt = a_wort[k];

									var a_txt = txt.split("_");
									if (a_txt.length > 1) {
										for (k in a_txt) {
											if (a_txt[k] > "") {
												ein_li($elem, w_pos, dropp, a_txt[k]);
												w_pos++;
											}
											if (k < a_txt.length - 1) {
												$elem.append("\n<li class='lueckLeerz'></li>");
											}
										}
									} else {
										ein_li($elem, w_pos, dropp, txt);
										w_pos++;
									}
								}
							}
						}
					});



					var myFrageNr = add_punkte(-1, -1, anz, 0);

					$bsp.append("<br style='clear:both'>");
					$bsp.append("<div class='t_luecke_antw'></div>");
					$elem = $bsp.find(".t_luecke_antw");
					$.each(a_antw, function (index) {
						if (typeof a_antw[index] != "undefined") {
							var m_li = "<div data-baa-order='" + index + "' class='ui-state-default dragButt'>" + a_antw[index] + "</div>";
							if (Math.random() < 0.5) {
								$elem.prepend(m_li);
							} else {
								$elem.append(m_li);
							}
						}
					});

					//$(".t_luecke_antw button").button();

					$(".t_luecke_antw .dragButt").draggable({
						revert: true
					});


					$(".drop").droppable({
						drop: function (event, ui) {
							var ziel = $(this);
							var quell = ui.draggable;
							var pkt = -1;
							if ((ziel.data("baa-order") === quell.data("baa-order")) || (a_antw[ziel.data("baa-order")] === quell.text())) {
								$(this).html(quell.html());
								quell.hide();
								pkt = 1;
							} else {
								//quell.revert();
							}
							add_punkte(myFrageNr, my_ftyp, pkt, 0); //alle durchgeführt						
						}
					}).css("width", "auto");
					$(".t_luecke li").unbind('mouseup');


				} else if (aend_mode == 1) {
					//luecke edit
					$bsp.html("<ul class='t_luecke'></ul>");
					$bsp.find(".t_luecke").append("<li class='edi lft ui-state-default' style='padding:4px' contenteditable='true'>" + $bsp.data("baa-satz").trim().replace(/_/g, "<br>") + "</li>");
					$bsp.find(".t_luecke li").css("cursor", "text");
					init_lueck($bsp); // doppelklick


				} else if (aend_mode == 3) {
					var $htm = $bsp.find("li");

					var txt = $htm.html();
					txt = txt.replace(/ /g, " ");
					txt = txt.replace(/\u0020\u0020/g, " ");
					txt = txt.replace(/<br>/g, "_").replace(/<br\/>/g, "_").replace(/<div>/g, "_<div>");
					$htm.html(txt);
					$bsp.data("baa-satz", $htm.text());
				}
				break;

			case 11: //Interaktives bild
				//alert("11"+ " "+aend_mode+" "+chkedit_mode);
				flag_ft11 = 1;

				if (!aend_mode) {
					var my_ftyp = ftyp;

					var hgsrc = $bsp.data("baa-hgimage");
					var hgfakt = Number($bsp.data("baa-hgfakt"));
					$eCont = $bsp.find(".elem-content");
					$eCont.css("background-image", hgsrc).height(($eCont.width() * hgfakt));
					//var drop_anz=0; len=2;
					var drop_anz = $eCont.find(".zuDropDyn").length;
					/*
								$eCont.find(".zuDropDyn").each(function(index){
									len=Math.max(len,$(this).text().length+1);	
									drop_anz++;
								});
					*/
					var myFrageNr = add_punkte(-1, -1, drop_anz, 0);

					var el_w = $eCont.outerWidth();
					var len = $eCont.data("baa-width");
					$eCont.find(".zuDropDyn").each(function (index) {

						var $drop = $(this);
						var w_anz = 1;
						if ($drop.text().indexOf(";") > -1) {
							var a_wort = $drop.text().split(";");
							var wort = a_wort[0];
							w_anz = a_wort.length;
						} else {
							var wort = $drop.text().trim();
						}
						var htmlWort = $drop.html();


						ind = index;
						if ($drop.data("baa-lsg") != undefined) {
							ind = $drop.data("baa-lsg");
						}

						$drop.data("richtig", wort);
						$drop.text(leerz);
						//$drop.html(leerz.substr(0,len+3)); 

						if ($eCont.find(".rahmen_antworten").length == 0) {
							//					$eCont.append("\n<br style='clear:both' />");
							$eCont.append("<div class='rahmen_antworten'></div>");
						}

						var htm = "?";
						if (wort.charAt(0) == "#") {
							htm = wort.substr(1);
							frage_max_punkte[fragenAnz - 1] = frage_max_punkte[fragenAnz - 1] - 1; //gar nicht schön!!!
							//add_punkte(myFrageNr,14,1,0); //diesen als gelöst angeben, weil gesetzt
						} else {
							$rahm = $eCont.find(".rahmen_antworten");

							if (w_anz == 1) {
								$rahm.append("<div class='zuDragDyn ui-state-default' data-baa-lsg='" + ind + "' >" + htmlWort + "</div>");
							} else {
								a_wort.forEach(function (auswahl_wort, indx) {
									if (indx == 0) {
										$rahm.append("<div class='zuDragDyn ui-state-default' data-baa-lsg='" + ind + "' >" + wort + "</div>");
									} else {
										$rahm.append("<div class='zuDragDyn ui-state-default'>" + auswahl_wort + "</div>");
										//console.log("indx",indx)
									}
								});
							}

							var a_tmp = $rahm.find(".zuDragDyn").toArray();
							$rahm.html(shuffle(a_tmp));
							$rahm.find(".zuDragDyn").draggable({
								cursor: "move",
								delay: 100,
								distance: 5,
								snapTolerance: 16,
								revert: true
							}).css("width", "auto");
							$eCont.find(".rahmen_antworten").addClass("t_zu_abs");
						}


						$drop.droppable({
							tolerance: "touch",
							drop: function (event, ui) {
								var pkt = -1;
								var odrop = $(this);
								var odrag = ui.draggable;
								//if (odrop.data("baa-lsg")===odrag.data("baa-lsg") || (odrag.text()===odrop.data("richtig"))) {
								if (odrag.text().trim() === odrop.data("richtig")) { // geht auch mit text 
									odrop.html(odrag.html());

									odrop.css("width", "auto");
									odrag.hide();
									pkt = 1;

									odrop.css({
										"margin-left": -odrop.outerWidth() / 2,
										"margin-top": -(odrop.outerHeight() / 2)
									}); // muss mitte sein


								} else {
									odrag.revert;
									pkt = -1;
								}
								zeige_farbe_richtig(odrop, Number(pkt > 0));
								add_punkte(myFrageNr, 14, pkt, 0);

							}
							//				}).width(len*12).html("?");
						}).html(htm);
					});

				} else if (aend_mode == 1) {

					var hgsrc = $bsp.data("baa-hgimage"),
						hgfakt = Number($bsp.data("baa-hgfakt"));

					$eCont = $bsp.find(".elem-content");
					$eCont.css("background-image", hgsrc).height(($eCont.width() * hgfakt));

					$eCont.find(".zuDropDyn").each(function (index) {
						var $drop = $(this);
						if (($drop.data("baa-left") <= 0) || ($drop.data("baa-left") >= 1) || ($drop.data("baa-top") <= 0)) {
							$drop.data("baa-left", "0.1"); //nur wenn noch nicht gesetzt
							$drop.data("baa-top", 0.03 * (index + 1));
						}
					});

					//edit_dyn_drop();				

				} else if (aend_mode == 3) { //speichern
					$eCont = $bsp.find(".elem-content");

					var ow = $eCont.outerWidth() - 2; // etwas ungewiss warum minus 2 evt. wegen padding
					var oh = $eCont.outerHeight();
					var hgfakt = oh / ow;

					if ($eCont.css("background-image") != "none") {

						$bsp.data("baa-hgimage", $eCont.css("background-image"))
							.data("baa-hgfakt", hgfakt)
							.data("baa-ftyp", "11")
							.data("baa-prgnr", "14")
							.data("baa-prg", "frg");

						//var anzBst=1;
						$eCont.find(".zuDropDyn").each(function (index) {
							$drop = $(this);


							//var dw=$drop.outerWidth(); //, dh=$drop.outerHeight();

							//console.log(dw,$drop.css("margin-left"),$drop.position().left);

							var rel_x = $drop.position().left / ow;
							var rel_y = $drop.position().top / ow;

							$drop.attr("data-baa-left", rel_x).attr("data-baa-top", rel_y)
								// .draggable('destroy') //24.2.2021 entf.
								.removeAttr("contenteditable")
								.html($drop.text().trim());
						});
					}
				}
				break;

			default:
				console.log("Kein Fragetyp: " + ftyp);
		}
	}
}


var erst_13 = 0;

function init_lueck($bsp) {
	var fkt = function (e, $bsp) {
		var selection;
		if (window.getSelection) {
			var selObj = window.getSelection();
			if (selObj.toString().length > 0) {

				var selRange = selObj.getRangeAt(0);
				var documentFragment = selRange.extractContents();
				//console.log(documentFragment,$(documentFragment).text());	
				var txt = $(documentFragment).text();
				if ((txt.charAt(0) == "{") && (txt.charAt(txt.length - 1) == "}")) {
					var neuText = txt.substr(1, txt.length - 2);
				} else {
					txt = txt.replace(/{+/g, "").replace(/}+/g, "");
					var neuText = "{" + txt + "}";
				}

				selRange.insertNode(document.createTextNode(neuText));
				selObj.removeAllRanges();
				luecke_prfg(0, $bsp);
			}
		} else if (document.selection && document.selection.createRange && document.selection.type != "None") {
			// IE case
			var range = document.selection.createRange();
			var selectedText = range.htmlText;
			if (seletedText.length > 0) {
				var newText = '{' + selectedText + '}';
				document.selection.createRange().pasteHTML(newText);
			}
		}
	};


	$bsp.find(".t_luecke li").on('keypress', function (e, $bsp) {
		if ((!e.shiftKey) && (e.which == 13)) {
			e.preventDefault();
			if (!erst_13) {
				erst_13 = 1;
				alert("Enter-Taste nicht erlaubt - Shift-Enter verwenden!");
			}
		}
	});


	$bsp.find(".t_luecke li").on('mouseup', function (e, $bsp) {
		if (e.ctrlKey) {
			fkt(e, $(this).parent().parent());
		}
	});
}


function replaceNbsps(str) {
	var re = new RegExp(String.fromCharCode(160), "g");
	return str.replace(re, " ");
}

function replaceNbsp(str) {
	if (str != undefined) {
		return str.replace(/ /g, '');
	}
}

function array_empty_remove(a_satz) {
	a_tmp = new Array();
	$.each(a_satz, function (index, wert) {
		if (wert.trim() > "") {
			if (wert == "</b>") {
				a_tmp[a_tmp.length - 1] += wert;
			} else if (wert == "<b>") {
				index++;
				a_tmp.push(wert + a_satz[index]);
			} else {
				//console.log(index,"add",wert);
				a_tmp.push(wert);
			}
		}
	});
	return a_tmp;
}


var t = 0;

function luecke_prfg(flag, $bsp) {
	var txt = "";
	if (flag == 1) {

		$bsp.find(".t_luecke li").html($(".t_luecke li").text());
		$bsp.find(".t_luecke_antw").html("");
	} else {

		//		var htm=$bsp.find(".t_luecke li").html().replace(/{ /g, " {").replace(/ }/g, "} ").replace(/{+/g, "{").replace(/}+/g, "}");

		//	$bsp=$(".t_luecke li").parent().parent();
		//	$bsp.find(".t_luecke li").parent().parent();

		//		var htm=$bsp.find(".t_luecke li").html().replace(/{ /g, " {").replace(/ }/g, "} ").replace(/{+/g, "{").replace(/}+/g, "}");
		var htm = $bsp.find(".t_luecke li").html().replace(/{ /g, " {").replace(/ }/g, "} ").replace(/{+/g, "{").replace(/}+/g, "}");

		$bsp.find(".t_luecke li").html(htm);

		// prüfen
		txt = $bsp.find(".t_luecke li").text();
		var re = /\{([^{}]+)\}/g;

		var re = /{([^}]+){/g;
		var m = txt.match(re);
		for (key in m) {
			//console.log(key,m[key]);	
			alert("Fehler bei Lücken-Markierung: " + m[key]);
		};

		var re = /}([^{]+)}/g;
		var m = txt.match(re);
		for (key in m) {
			alert("Fehler bei Lücken-Markierung: " + m[key]);
			//console.log(key,m[key]);	
		};
	}
}


function xxxrestart() {
	var adr = document.location.search;
	nr = 1;
	if (adr.indexOf("edit_mode=1") > -1) nr = 0;
	document.location.href = document.location.pathname + "?edit_mode=" + nr;
}

/*
function make_antwort_header() {
	// header-ttolbar anlegen
	if ($(".elem").find(".frage-header").length==0) {		
		$(".elem").each(function(index) {
			$("<div class='frage-header'></div>").prependTo($(this));
			$eHeader=$(this).find(".frage-header");
			$.each (a_befehle,function (index,wort) {
				$eHeader.append("<button class='b_tbar ui-state-default b_"+wort+"' data-name='b_"+wort+"'>"+wort+"</button>");
			});
		});
		$(".b_tbar").each(function(index) {
			//console.log(index); 
			$(this).on("click",function () {
				b_tbar_event($(this));
			});
		});

	} else {
		$(".b_tbar").show();
	}
}
*/
function shuffle(o) {
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function space_remove(txt) {
	txt = txt.toString().replace(/ /g, "");
	//txt.replace(/\s+/g, "")
	return txt.replace(/\s+/g, "");
}












//leerz+=leerz;leerz+=leerz;leerz+=leerz;leerz+=leerz;

function analyse_nach_dem_laden($eCont, edit) {
	//$(".elem-content").each (function (index) {
	//		var $eCont=$(this);
	$a_inp = $eCont.find("input[type=text]");
	if ($a_inp.length > 0) {

		$eCont.parent().data("baa-ftypspez", 1);

		var len = 1;
		$a_inp.each(function (index) {
			if ($(this).data("baa-input")) {
				// len = Math.max(len, ($(this).data("baa-input").toString().length + 1));
				len = Math.max(len, ($(this).data("baa-input").length + 1));
			}
		});

		$a_inp.each(function () {

			var $eInp = $(this);
			if (!edit) {
				var myFrageNr = add_punkte(-1, -1, 1, 0);

				$eInp.keypress(function (event) {
					var pkt = 0;
					if (event.which == 13) {
						event.preventDefault();
						var chk_richtig = (($(this).val() == $(this).data("baa-input")) || (space_remove($(this).val()) == space_remove($(this).data("baa-input"))));
						if (chk_richtig) {
							$(this).attr("disabled", "true");
							pkt = 1;
						} else {
							pkt = -1;
						}
						zeige_farbe_richtig($(this), Number(pkt > 0));
						add_punkte(myFrageNr, 14, pkt, Number(pkt > 0));
					}
				}).width(len * 12);

				$eInp.blur(function () {
					if ($(this).val() != "") {
						var chk_richtig = (($(this).val() == $(this).data("baa-input")) || (space_remove($(this).val()) == space_remove($(this).data("baa-input"))));
						if (chk_richtig) {
							$(this).attr("disabled", "true");
							pkt = 1;
						} else {
							pkt = -1;
						}
						zeige_farbe_richtig($(this), Number(pkt == 1));
						add_punkte(myFrageNr, 14, pkt, Number(pkt > 0));
					}
				});
			} else {
				$eInp.attr("value", $eInp.data("baa-input"));

				//$eInp.val($eInp.data("baa-input"));
			}
			// console.log($eInp.data("baa-input")); 
		});
	}
	// select
	$a_sel = $eCont.find("select");
	if ($a_sel.length > 0) {

		$eCont.parent().data("baa-ftypspez", 1);

		$a_sel.each(function () {
			var $elem = $(this);
			if (!edit) {
				var myFrageNr = add_punkte(-1, -1, 1, 0);
				var a_satz = $elem.find("option").toArray();
				//				$elem.text("").append(shuffle(a_satz)); // dafür startzahl z wird randomisiert
				var len = 2;
				var anz = 0;
				$elem.find("option").each(function (index) {
					if ($(this).text() == "???") {
						$(this).remove();
					} else {
						$(this).data("baa-lsg", $(this).val());
						$(this).removeAttr("value");
						$(this).parent().data("wort" + anz, $(this).text());
						anz++;
						len = Math.max(len, $(this).text().length + 1);
					}
					//console.log(index,$(this).data("baa-lsg"),$(this).val());
				});
				$elem.data("anz", anz);

				//bewegung
				var sWidth = len * 12;
				$seli = $("<span> </span>");
				$seli.addClass("selwort").width(sWidth);

				var $box = $('<div />');
				$box.addClass('iToggle')
					.attr("title", "Im richtigen Augenblick das Richtige (Lesbare) klicken!")
					.css({
						position: 'relative',
						overflow: 'hidden',
						'-webkit-box-sizing': 'border-box',
						'-moz-box-sizing': 'border-box',
						'-ms-box-sizing': 'border-box',
						'-o-box-sizing': 'border-box',
						'box-sizing': 'border-box'
					});

				var $slider = $('<div />');
				$slider.addClass('slider')
					.css({
						position: 'absolute',
						top: 0,
						left: 0
					});
				$box.append($seli);
				$box.append($slider);

				$elem.after($box);
				$elem.hide();

				$newElem = $elem.next();
				$slider.width($box.innerWidth()).height($box.innerHeight());
				var z = getRandomInt(1, anz);

				function auto($el) {
					z++;
					var wort = $el.data("wort" + (z % Number(anz)));
					anz = $el.data("anz");

					$elem.next().find(".selwort").text(String.fromCharCode(160));
					zeige_farbe_richtig($elem.next().find(".selwort"), 2);
					//$elem.next().find(".slider").data("wort",wort).animate({left: (z/2==Math.round(z/2)) ? sWidth-4:-sWidth+2}, globSpeed,function() {
					$elem.next().find(".slider").data("wort", wort).animate({
						left: (z / 2 == Math.round(z / 2)) ? sWidth : -sWidth - 1
					}, globSpeed, function () {
						$(this).prev().text($(this).data("wort"));
					});
					if (z > intGrenze) {
						clearInterval(inter_sel);
					}
				}
				//var inter_sel=setInterval(auto,2500+getRandomInt(0, 1000)  ,$elem);
				var inter_sel = setInterval(auto, 2500, $elem);
				auto($elem);

				$newElem.click(function () {
					var chk_richtig = ($(this).first().text() == $(this).prev().data("wort0"));
					if (chk_richtig) {
						clearInterval(inter_sel);
						pkt = 1;
						$(this).find(".slider").hide();
					} else {
						pkt = -1;
					}
					zeige_farbe_richtig($(this).find(".selwort"), Number(pkt > 0));
					add_punkte(myFrageNr, 14, pkt, 0);
				});
			}
		});
	}
	/*
		// original baa-original
		$a_sel=$eCont.find("ORIG-select");
		if ($a_sel.length>0) {
			$eCont.parent().data("baa-ftypspez",1);

			$a_sel.each(function() {
				var $elem=$(this);
				if (!edit) {
					var myFrageNr=add_punkte(-1,-1,1,0);
					var a_satz=$elem.find("option").toArray();
					$elem.text("").append(shuffle(a_satz));
		
					$elem.find("option").each(function(index) {
						$(this).data("baa-lsg",$(this).val());
						$(this).removeAttr("value");
					});

					$elem.change(function() {
						sel=$(this)[0];
						var chk_richtig=($(this).find("option:selected").data("baa-lsg")==1);
						if (chk_richtig) {
							pkt=1;
						} else {
							pkt=-1
						}
						zeige_farbe_richtig($(this),Number(pkt>0));
						add_punkte(myFrageNr,14,pkt,0);
					});
				} else {
					// nichts
				}
			})
		}
	*/
	//$eCont.find("input[type='checkbox']").iToggle();

	// checkbox
	$a_inp = $eCont.find("input[type='checkbox']");

	if ($a_inp.length > 0) {
		$eCont.parent().data("baa-ftypspez", 1);
		$a_inp.each(function () {
			var $chk = $(this);
			if (!edit) {

				var myFrageNr = add_punkte(-1, -1, 1, 0);
				var param = "";
				var a_yesno = ["ja", "nein"];
				if ($chk.data("baa-yesno") != undefined) {
					a_yesno = $chk.data("baa-yesno").split("|");
				}
				var zweites = getRandomInt(0, 1);
				param = {
					defaultOnLabel: a_yesno[(0 + zweites) % 2],
					defaultOffLabel: a_yesno[(1 + zweites) % 2]
				};

				$chk.attr("data-geloest", "0");
				$chk.iToggle(param);

				$chk.next(".iToggle").click(function (index) {

					function aus($obj, zweites, richtig) {
						var a_lart = ["off", "on"];
						var result = (richtig ^ zweites);
						if (richtig) {
							$obj.find(".label-" + a_lart[Number(!result)]).hide();
							zeige_farbe_richtig($obj.find(".label-" + a_lart[Number(result)]), 1);
							$chk.attr("data-geloest", "1");
							$obj.find(".slider").hide();
						} else {
							zeige_farbe_richtig($obj.find(".label-" + a_lart[Number(result)]), 0);
						}
					}


					//richtig=(Number($chk.prop("checked"))==$chk.data("baa-input"));
					richtig = (Number($chk.prop("checked")) != zweites);
					if (richtig) {
						pkt = 1;
					} else {
						pkt = -1;
					}
					aus($(this), zweites, Number(pkt > 0));
					add_punkte(myFrageNr, 14, pkt, 1); // ohnen bedingung
				});

			} else { // edit=1 
				var a_yesno = ["ja", "nein"];
				if ($chk.data("baa-yesno") != undefined) {
					a_yesno = $chk.data("baa-yesno").split("|");
				}
				/*
				if ($chk.data("baa-input")=="1") { //vertauscht
					a_yesno=[a_yesno[1],a_yesno[0]];
				}
				*/
				$chk.replaceWith("[" + a_yesno.join("|") + "]");

				/*
								if ($chk.attr("data-baa-input")=="0") {	
									$chk.removeAttr("checked");	
								} else {
									$chk.attr("checked","checked");	
								}
				*/
			}
		});
	}

	//zuordnung laenge button
	if ($eCont.find(".zuDrop").length > 0) {
		//console.log("innen",$a_inp.length);			
		$eCont.parent().data("baa-ftypspez", 1);
		var drop_anz = 0;
		len = 0;
		$eCont.find(".zuDrop").each(function (index) {
			str = $(this).text().split(";")[0];
			len += str.length;
			//console.log("len",drop_anz,len,str)	
			//len = Math.max(len, $(this).html().length + 1);
			//len = Math.max(len, $(this).text().length + 1);
			drop_anz++;
		});
		len = Math.min(ww / 100, len / drop_anz); //baa
		//console.log("len",drop_anz,len)	

		//console.log("ww=",ww,"len=",len,"ww/100=",ww/100,Math.min(ww/100,len))		

		var myFrageNr = add_punkte(-1, -1, drop_anz, 0);

		$eCont.find(".zuDrop").each(function () {
			var $drop = $(this);
			if (!edit) {

				//$drop.draggable("destroy");
				// var wort = $drop.text();
				let a_wort = [];
				htm = $drop.html();

				ind = $drop.data("baa-lsg"); //fraglich, ob noch verwendet???
				if (htm.indexOf("<img") > -1) { //formel oder grafik

					if ($(htm).attr("alt") > "") { //formel
						$drop.data("richtig", $(htm).attr("alt"));
					} else {
						$img = $drop.find("img");

						// if ($(htm).width()>0) {
						if ($(htm).css("width") != "0px") {
							$img.attr("ur_width", $(htm).css("width"));
						} else {
							$img.attr("ur_width", "");
						}
						$img.width(50).attr("align", "absMiddle");
						htm = $drop.html();
						$drop.data("richtig", htm);
					}
					a_wort = [htm];
					$drop.css("padding", "6px");
					len = 4;

				} else {
					a_wort = $drop.text().split(";");
					wort_richtig = a_wort[0];
					//console.log("wort=",$drop.text(),"xlen=",len)					
					$drop.data("richtig", wort_richtig);
					$drop.text(leerz);
					//$drop.html(leerz.substr(0,len+3)); 

					//console.log("xlen=",a_wort.length)
					// if (a_wort.length>1) {
					// 	len=Math.min(ww/100,a_wort[0].length+1);
					// 	//console.log("neu len=",len)
					// }	

				}
				if ($eCont.find(".rahmen_antworten").length == 0) {
					$eCont.append("\n<br style='clear:both' />");
					$eCont.append("<div class='rahmen_antworten'></div>");
				}
				$rahm = $eCont.find(".rahmen_antworten");
				a_wort.forEach(function (auswahl_wort) {
					//console.log(ind,auswahl_wort)
					$rahm.append("<div class='zuDrag ui-state-default' data-baa-lsg='" + ind + "' >" + auswahl_wort + "</div>");
				});



				var a_tmp = $rahm.find(".zuDrag").toArray();
				$rahm.html(shuffle(a_tmp));

				$rahm.find(".zuDrag").draggable({
					cursor: "move",
					delay: 100,
					distance: 20,
					revert: true
				}).css("width", "auto");


				$drop.droppable({
					drop: function (event, ui) {
						var pkt = -1;
						var odrop = $(this);
						var odrag = ui.draggable;
						//if (odrop.data("baa-lsg")===odrag.data("baa-lsg") || (odrag.text()===odrop.data("richtig"))) {
						//if (odrag.text() === odrop.data("richtig")) { // geht auch mit text 

						let bild_flag = 0;
						let vergleich = odrag.text();
						if (odrag.html().indexOf("<img") > -1) { //spezial für bilder, bei formeln auf alt-tag zurückgreifen
							bild_flag = 1;
							htm = odrag.html();
							if ($(htm).attr("alt") > "") { //formel
								vergleich = $(htm).attr("alt");
							} else {
								bild_flag = 2;
								vergleich = htm;
							}

							odrop.css("padding", "6px");
						}

						if (vergleich === odrop.data("richtig")) {
							odrop.html(odrag.html());
							odrop.css("width", "auto");
							if (bild_flag == 2) {
								$img = odrop.find("img");
								// $img.css("width",$img.attr("ur_width"));
								if ($img.attr("ur_width") != "") {
									$img.css("width", $img.attr("ur_width"));
								} else {
									$img.removeAttr("style");
								}
							}

							odrag.hide();
							pkt = 1;
						} else {
							odrag.revert;
							pkt = -1;
						}
						zeige_farbe_richtig(odrop, Number(pkt > 0),true);
						add_punkte(myFrageNr, 14, pkt, 0);
					}
				}).width(len * 6).html("&nbsp;");

			} else {
				//$elem.css("width",(len*2)+"em");

				$drop.css("width", "auto");
			}
		});


	}


	//	});
}


var lz_lfdnr = 0;
var fragenAnz = 0;

function add_punkte(fnr, ft, pkt, frage_abschluss) {

	if (fnr == -1) { //reset erstaufruf
		//console.log("fnr:",fragenAnz,"reset: ",pkt);		
		frage_fertig_flag[fragenAnz] = 0;

		frage_max_punkte[fragenAnz] = pkt;
		frage_sammel_punkte[fragenAnz] = 0;

		frage_sum_fehler[fragenAnz] = 0;
		frage_sum_richtige[fragenAnz] = 0;
		frage_antw_runden[fragenAnz] = 0;

		frage_proz[fragenAnz] = 0;
		$(".elem-punkte").css("background-color", "none");

		fragenAnz++;


	} else { //liefert punkte
		alt = frage_sammel_punkte[fnr];


		if (!frage_fertig_flag[fnr]) {

			if (pkt > 0) frage_sum_richtige[fnr]++;
			if (pkt < 0) frage_sum_fehler[fnr]++;

			frage_antw_runden[fnr]++;
			if ((frage_sammel_punkte[fnr] + pkt) <= frage_max_punkte[fnr]) {
				frage_sammel_punkte[fnr] += pkt;
			}
			if (pkt > 0) { //ckeck, ob der letzte
				switch (ft) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 10:
					case 14:

						if (frage_abschluss) {
							frage_fertig_flag[fnr] = 1;
						} else { //wenn die anzahl der richtigen erreicht ist
							if (frage_sum_richtige[fnr] >= frage_max_punkte[fnr]) {
								frage_fertig_flag[fnr] = 1;
							}
						}

						break;

					/*					
					case 8:
						if (frage_abschluss) {
							frage_sammel_punkte[fnr]=frage_max_punkte[fnr]-Math.min(frage_max_punkte[fnr],frage_sum_fehler[fnr]);
							frage_fertig_flag[fnr]=1;		
						}
					break
					*/

					case 5:
					case 6:
					case 7:
					case 8:

					case 9:
						if (frage_abschluss) {
							frage_sammel_punkte[fnr] = Math.max(frage_max_punkte[fnr] - frage_sum_fehler[fnr], 0);
							frage_fertig_flag[fnr] = 1;
						}
						break;
					default:
						alert("Fehler-Punkte-Berechnung");
				}


			}

			if (frage_fertig_flag[fnr]) {
				frage_antw_runden[fnr] = frage_max_punkte[fnr];
				$(".elem-punkte").css("background-color", "#00ff00");
			} else {
				$(".elem-punkte").css("background-color", "#FFF");
			}

			frage_proz[fnr] = Math.round(100 * (Math.max(0, frage_sammel_punkte[fnr]) * 100 / frage_max_punkte[fnr])) / 100;

			var gesicht = Math.round(Math.max(0, frage_sammel_punkte[fnr]) / frage_max_punkte[fnr] * 2 * 10) / 10;
			var opa = Math.round(frage_antw_runden[fnr] / frage_max_punkte[fnr] * 10) / 10;


			$(".elem-punkte").html("Frage: " + (fnr + 1) + "/" + (fragenAnz) + " Pkt.: " + frage_sammel_punkte[fnr] + "/" + frage_max_punkte[fnr] + " " + "<img src='images/f_" + Math.round(gesicht) + ".png' align=absMiddle style='width:15px;opacity:" + opa + "'>");

			var fertige_fragen = 0,
				sum_proz = 0;
			for (var key in frage_fertig_flag) {
				//console.log(key,frage_fertig_flag[key],frage_proz[key]);
				if (frage_fertig_flag[key] == 1) {
					fertige_fragen++;
					sum_proz += frage_proz[key];
				}
			}

			let teufel_nr = bsp_lfdnr % 400;
			if (teufel_nr == 0) {
				var d = new Date();
				teufel_nr = d.getMilliseconds() % 400;
			}

			stern = "stern_plus";
			if (pkt == -1) {
				teufel_nr = "-" + (bsp_lfdnr % 2);
				stern = "stern_minus";
				snd_stern_minus.play();

			} else {
				snd_stern_plus.play();
			};

			//<img src='/data/math_db/animbsp/anim"+teufel_nr+".gif' width='100%'/>
			lohn = "<div id='teufel'></div>";
			// const $last=$(".elem").first();
			const $last = $("body");
			if ($last.find("#teufel").length > 0) {
				//$last.find("#teufel").replaceWith(lohn);
			} else {
				$last.append(lohn);
			}
			$("#teufel").append("<span class='" + stern + "'>*</span>");
			//console.log($last.html());


			if (fertige_fragen == fragenAnz) {
				if ($("#prg_ext").length) {
					var a_txt = $("#prg_ext").val().split(",");

					if (a_txt[0] == "puzzle") {
						bsp_lfdnr = a_txt[1];
						lz_lfdnr = a_txt[2];
						schueler_flag = a_txt[3];
						arb_bsp_lfdnr = a_txt[4];
						if (schueler_flag < 0) { //nur wenn schüler 
							var ges_proz = Math.round((10 * sum_proz) / fragenAnz) / 10;
							erg_speichern(11717, ges_proz);
						}
					}

				} else {
					if (schueler_flag > 0) {
						var ges_proz = Math.round((10 * sum_proz) / fragenAnz) / 10;
						lz_lfdnr = 0;
						erg_speichern(0, ges_proz);
					}
				}
				$("#teufel").html("<img src='/data/math_db/animbsp/anim" + teufel_nr + ".gif' width='120px'/>");
				snd_stern_fertig.play();
				// setTimeout(function () {
				// 	next(bsp_lfdnr);
				// },5000)

			}
		}
	}
	return (fragenAnz - 1);
}


function erg_speichern(art, proz) {
	var pkt = Math.round(proz * 2 / 100);
	var s_lfdnr = schueler_flag;

	$.ajax({
		type: "POST",
		url: "v44_einzel_erg_save.php",
		data: {
			e_art: art,
			b_lfdnr: bsp_lfdnr,
			s_lfdnr: s_lfdnr,
			arb_bsp_lfdnr: arb_bsp_lfdnr,
			lz_lfdnr: lz_lfdnr,
			pkt: pkt,
			proz: proz
		},

		success: function (phpData) {
			if (art == 1) { //einschätzung
				$(".elem-punkte").hide();
			}
			if (phpData > "") {
				alert(phpData);
			}
		}
	});
}




function bild_upload_lsg() {
	alert("alois");
}

function baa_test() {
	$web = $(".elem-ifr");
	//	nnn=$obj[0];
	//var $web=$elem.find("iframe");
	var gg = $web[0].document || $web[0].contentWindow;
	alert(gg.document);
}



function baa_test1() {
	alert(1);
}