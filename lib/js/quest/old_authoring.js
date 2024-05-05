// JavaScript Document

edit_mode = 1; // ist nicht der chkeditor_mode

//editor_mode="<?=$_GET['chkedit_mode'];?>"; //0: aus, 1: klein, 2: großß
var close_frage=false;


$(window).bind('beforeunload', function (Event) {
	if (close_frage) {
		return "Seite wirklich verlassen!";
	} else {

	}
});


var ctrlFlag = 0;
$(document)
	.keydown(function (event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == 17) {
			ctrlFlag = 1;
			//console.log("ein - ctrlFlag")
		} else if ((keycode == 83) && (ctrlFlag)) {
			event.preventDefault();
			parent.saveFromExtern();
		}
	}).keyup(function (event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == 17) {
			ctrlFlag = 0;
			//console.log("ctrlFlag 0")
		}
	})


function resizen_author() {
	ww = $(window).width();
	wh = $(window).height();
	resize_dynamo(1);
}


var frage_info = new Array();

function init_autor_bsp() {
	frage_info = [
		"Eindeutigen Begriff/Zahl eingeben",
		"Einfachauswahl: Richtige Antwort an oberster Position",
		"Mehrfachauswahl: Richtige Begriffe kennzeichnen",
		"Mehrfachauswahl: Richtige Begriffe kennzeichnen",
		"",
		"Sortierung: In der korrekten Sortierung eintragen",
		"Reihung: In der korrekten Reihenfolge eintragen",
		"",
		"Begriffpaare: Linke Begriffsspalte steht fest - die rechte wird vom Computer gemischt",
		"In der korrekte Reihenfolge eintragen - der Computer mischt wortmäßig",
		"Lückentext: Lücken mit Strg+Mausmarkierung bestimmen oder mit {} eingrenzen!",
		"Felder add./subtr.: +/-, Feld ändern/versch. -> Editorbutton EIN/AUS, Bewegung: Ctrl/Alt",
		""
	];

	$("body").sortable({
		handle: ".elem-mover-butt",
		cancel: ".elem-toggle",

		opacity: 0.8,
		placeholder: "elem-placeholder ui-corner-all",
		cursorAt: {
			left: 0,
			top: 0
		},
		start: function (e, ui) {
			ui.placeholder
				.width(ui.item.width() - 10)
				.height(ui.item.height());
		}
	});

	CKEDITOR.disableAutoInline = true; // muss hier bleiben, damit der editor nicht automatisch geöffnet wird

	make_elem_header_authoring($(".elem"));
	autor_on_off(true);
	paste_init();

}





function endMove($this) {
	// immer zuerst den event stilllegen
	$('.movable').off('mousemove');
	$this.removeClass('movable');
	move_flag = 0;
	resizen_author();
}

function startMove($ifr) {
	$('.movable').on('mousemove', function (event) {
		//var thisX = event.pageX - $(this).width() / 2,
		var thisY = event.pageY - 20;
		$('.movable').offset({
			top: thisY
		});
		tt = $('.movable').position();
		var ytop = $('.movable').position().top;
		$ifr.height(ytop - 36);
		move_flag = 1;
	});
}
/*
function get_adr_header_button_autor(bclass,bez,pnr) {
	return ("<div class='"+bclass+"' data-pnr='"+pnr+"'>"+bez+"</div>");
}
*/
/*
function get_adr_header_button_autor(bclass,bez,pnr) {
	return ("<button class='adrButton "+bclass+"' data-pnr='"+pnr+"'>"+bez+"</button>");
}
*/




function get_treffer($obj) {
	var $elem = $obj.closest(".elem");
	var treffer = -1;
	$(".elem").each(function (index) {
		if ($(this)[0] == $elem[0]) {
			treffer = index;
		}
	});
	return treffer;
}
/* 
function autor_on_off(flag) {
	if (flag == 9) { //wird derezit nicht verwendet
		edit_schalter = !edit_schalter;
	} else {
		edit_schalter = flag;
	}

	$(".elem-content,.elem-adr").attr("contenteditable", edit_schalter).toggleClass("hg1", edit_schalter);
	if (edit_schalter) {
		$(".elem-header-rechts").hide();
		$(".elem-header-links").hide();
		$(".elem-footer").hide();
		$(".elem").hover(
			function () {
				$(this).find(".elem-header-links").show(50);
				$(this).find(".elem-header-rechts").show(50);
				//$(this).find(".elem:after").show(50);
				$(this).find(".elem-footer").css("top", $(this).height() + 8).show(50);
				$(this).css("border", "1px solid #aaa").css("border-radius", "4px");
			},
			function () {
				$(this).find(".elem-header-links").hide();
				$(this).find(".elem-header-rechts").hide();
				//$(this).find(".elem.hidden:after").addClass("hidden");
				$(this).find(".elem-footer").hide();
				$(this).css("border", "1px dotted rgb(221,221,221)")
			}
		)
		$(".elem").css('border', "1px dotted #ddd");
		chkeditor_ein_aus(chkedit_mode);
	} else {
		$(".elem").off('mouseenter mouseleave');
		$(".elem").css('border', "none");
		//xxxeditor_instance_aus();

		// $(".elem-header-rechts").remove();
		// $(".elem-header-links").remove();

		chkeditor_ein_aus(0);


	}
	//fehler gross
	//	chkeditor_ein_aus(flag)
}


function autor_on_off_neu(flag) {
	if (flag == 9) { //wird derezit nicht verwendet
		edit_schalter = !edit_schalter;
	} else {
		edit_schalter = flag;
	}
	//let t=edit_schalter ? 1:0;
	// if (!edit_schalter) {

	// }


	$(".elem-content,.elem-adr").attr("contenteditable", edit_schalter).toggleClass("hg1", edit_schalter);
	if (edit_schalter) {
		$(".elem-header-rechts").hide();
		$(".elem-header-links").hide();
		$(".elem-footer").hide();
		$(".elem").hover(
			function () {
				$(this).find(".elem-header-links").show(50);
				$(this).find(".elem-header-rechts").show(50);
				//$(this).find(".elem:after").show(50);
				$(this).find(".elem-footer").css("top", $(this).height() + 8).show(50);
				$(this).css("border", "1px solid #aaa").css("border-radius", "4px");
			},
			function () {
				$(this).find(".elem-header-links").hide();
				$(this).find(".elem-header-rechts").hide();
				//$(this).find(".elem.hidden:after").addClass("hidden");
				$(this).find(".elem-footer").hide();
				$(this).css("border", "1px dotted rgb(221,221,221)")
			}
		)
		$(".elem").css('border', "1px dotted #ddd");
		chkeditor_ein_aus(chkedit_mode);

	} else {
		$(".elem").off('mouseenter mouseleave');
		$(".elem").css('border', "none");
		//xxxeditor_instance_aus();

		// $(".elem-header-rechts").remove();
		// $(".elem-header-links").remove();
		chkeditor_ein_aus(0);
	}


}






function chkeditor_ein_aus(editor_ein) {
	if (editor_ein > 0) {
		editor_instance_aus();
		var a_tmp = ["midi", "mini", "all"];

		var edElem = ".elem-content";
		if ($(".zuDropDyn").length > 0) {
			//alert($(".zuDropDyn").length);
			//edElem=".zuDropDyn";
			$(".zuDropDyn").closest(".elem-content").addClass("noedit").removeAttr("contenteditable");
		}


		$(edElem).each(function (nxr) {
			$eCont = $(this);
			analyse_nach_dem_laden($eCont, 1);
			if (!$eCont.hasClass("noedit")) {

				//console.log("Achtung in der Vollversion wieder weg!!! #############")
				//pruefe_img($eCont);

				$eCont.ckeditor(function () {
					resize_dynamo(1);

				}, {
					toolbar: a_tmp[editor_ein - 1]
				});
			}
		});



	} else {
		editor_instance_aus();
	}
	chkedit_mode = editor_ein;
	edit_dyn_drop(); //verschieben oder editieren der dropfelder bei dynamischem bild

}

function editor_instance_aus() {
	for (k in CKEDITOR.instances) {
		var instance = CKEDITOR.instances[k];
		instance.destroy();
	}
}
 */

var xalt = 0,
	yalt = 0;

function edit_dyn_drop() {
	if ($(".zuDropDyn").length > 0) {

		if (chkedit_mode > 0) {

			var $elem = $(".zuDropDyn").closest(".elem-content");
			if ($(".zuDropDyn").is(":ui-draggable")) {
				$(".zuDropDyn").draggable('destroy');
			}
			//console.log("1ein", $elem.html())
			$(".zuDropDyn")
				.css("cursor", "text")
				.attr("contenteditable", "true")
				.addClass("hg3");

			// $(".zuDropDyn")
			// 	.css("cursor", "text");


			$(".zuDropDyn").on('blur', function () {
				var dw = $drop.outerWidth(),
					dh = $drop.outerHeight();
				var lft = $(this).position().left;
				var mdif = parseInt($(this).css("margin-left")) - Math.round(-dw / 2);
				//console.log("mdif",mdif)
				$(this)
					.css("margin-left", -(Math.round(dw / 2)))
					.css("left", (lft + mdif) + "px");
			});
			//console.log("2ein", $elem.html())

		} else {

			var $elem = $(".zuDropDyn").closest(".elem-content");
			var ow = $elem.outerWidth();
			//console.log("aus:", $elem.html())
			$(".zuDropDyn")
				.css("cursor", "move")
				.removeAttr("contenteditable")
				.removeClass("hg3")
				.draggable({

					start: function (event, ui) {
						xalt = ui.position.left;
						yalt = ui.position.top;

					},
					drag: function (event, ui) {

						var xgrid = 2,
							// ygrid = 4, 
							ygrid = 16,
							flag = 0;

						if (event.ctrlKey) {
							xgrid = 1;
							flag = 1;
							// ui.position.left = Math.round(ui.position.left / xgrid) * xgrid;
							// //ui.position.top = yalt;
							// ui.position.top = Math.round(ui.position.top / ygrid) * ygrid;

						}
						if (event.altKey) {
							ygrid = 1;
							flag = 2;
							// ui.position.left = Math.round(ui.position.left / xgrid) * xgrid;
							// ui.position.top = Math.round(ui.position.top / ygrid) * ygrid;
							//ui.position.left = xalt;
						}

						// if (!flag) {
						ui.position.left = Math.round(ui.position.left / xgrid) * xgrid;
						ui.position.top = Math.round(ui.position.top / ygrid) * ygrid;
						// }

					},
					delay: 100,
					distance: 1,
					//				grid:[8,8],


					stop: function (event, ui) {
						var $drop = $(event.target);
						//var dw=$drop.outerWidth(), dh=$drop.outerHeight();
						$drop.data("baa-left", ($drop.position().left) / ow);
						$drop.data("baa-top", $drop.position().top / ow);
					}
				})
		}
	}
}


function init_click() {
	$(".b_adrOpen").off('click').on("click", function () {
		$el = $(this).closest(".elem");
		//alert("vorher: "+$el.find("iframe").length);
		iframe_on_off($el, 9);
		//alert("zurück");
	});

	$(".b_adrBsp").off('click').on("click", function () {
		$elem = $(this).closest(".elem");
		var pnr = $elem.data("baa-prgnr");
		var adrbsp = a_prgtyp[pnr][ADR_DEF];
		if ($elem.data("baa-fenst") == 1) {
			win_extra($elem, adrbsp);
		} else {
			$elem.find("iframe").attr("src", adrbsp);
		}
		$elem.find(".elem-adr").val(adrbsp);

		//window.open(adrhome,"home");
	});

	$(".b_adrHome").off('click').on("click", function () {
		var pnr = $(this).closest(".elem").data("baa-prgnr");
		var adrhome = a_prgtyp[pnr][ADR_HOME];

		if (adrhome > "") {
			window.open(adrhome, "home");
		}
	}).button({
		icons: {
			primary: "ui-icon-home"
		},
		text: false
	});

	$(".b_adrGo").off('click').on("click", function () {
		$el = $(this).closest(".elem");
		//alert(		$(this).closest(".elem-header-rechts").find(".elem-adr").val() );
		//elem_adr_verlassen($(this).closest(".elem-header-rechts").find(".elem-adr"),true);
		$el.find(".elem-adr").trigger("change");
	}).button({
		icons: {
			primary: "ui-icon-search"
		},
		text: false
	});

	$(".elem-artikel").change(function () {
		if ($(this).val() > "") {
			$el = $(this).closest(".elem");
			var suche = a_prgtyp[$el.data("baa-prgnr")][ADR_ARTIKEL];

			var artikel = $(this).val().trim();
			var adr = a_prgtyp[$el.data("baa-prgnr")][ADR_DEF];
			if (adr.indexOf("LearningApps") > -1) {
				if (artikel.substr(0, 4) != "view") {
					artikel = "view" + artikel;
				}
			}
			var neu_adr = adr.replace(suche, artikel);
			$el.find(".elem-adr").val(neu_adr).trigger("change");
		}
	});


	// events anfügen
	init_events();
}


function init_events() {
	$(".elem-adr").change(function () {
		//alert("change");
		elem_adr_verlassen($(this), true);
	})
		.blur(function () {
			//alert("blur");
			//msgbox ("kp:"+$(this).data("key_pressed"));
			//$(".b_adrGo").hide();
			if ($(this).data("key_pressed")) elem_adr_verlassen($(this), true);
		})
		.bind('keypress', function (e) {
			$(this).data("key_pressed", true);
			if (e.keyCode == 13) {
				e.preventDefault();
				elem_adr_verlassen($(this), true);

			}
		})
		.focus(function (event) {
			//$(".b_adrGo").show();
			if ($(this).text() == "Internet-Adresse eingeben") {
				//elem_adr_verlassen($(this),event);
			}
		})
}



function changeTo($elem, pnr) {
	$elem.attr("data-baa-prg", a_prgtyp[pnr][0]);
	$elem.attr("data-baa-prgnr", pnr);
	$elem.attr("data-baa-fenst", a_prgtyp[pnr][EXT_WIN]);
}

function is_def_breite(classe) {
	var ret = -1;
	$.each(a_proz_breite, function (index, wort) {
		if (classe.indexOf(wort) > -1) {
			ret = index;
		}
	})
	return ret;
}





function add_neues_elem(bobj, classBreite) {
	const erg_pfad = location.host.substr(0, 3) == "127" ? "http://127.0.0.1/ebook/" : "https://baa.at/projekte/ebook/";
	alert("erg_pfad" + erg_pfad)
	var dname = erg_pfad + "lib/leer/elem_" + $(bobj).data("leerdatei") + ".html?pseudo=" + Math.random();
	//	var dname="lib/leer/elem_"+$(bobj).data("leerdatei")+".html";
	pnr = $(bobj).data("pnr");
	var grup_pnr = pnr;

	$.get(dname, function (data) {
		if (pnr == 0) { // baustein
			if ($(".elem").length > 0) {
				antw = confirm("Es sind bereits Daten in diesem Beispiel - sollen diese überschrieben werden?");
				if (antw) {
					$("body").html(data);
				} else {
					$("body").append(data);
				}
				$all_elem = $(".elem");
			}
		} else {
			$("body").append(data);
			$all_elem = $(".elem:last");
			$all_elem = $(".elem");

		}
		$all_elem.each(function (index) {
			$elem = $(this);
			pnr = $elem.data("baa-prgnr");
			if (pnr == undefined) {
				if ($elem.data("baa-ftyp") != undefined) {
					pnr = 14;
				} else {
					pnr = grup_pnr;
				}
			}
			if (a_prgtyp[pnr][EXT_WIN] == 1) {
				$elem.data("baa-ifrextern", "1");
			}

			init_elem(pnr, $elem, classBreite);
			//frage_typ($elem,edit_mode); // 3.4. weggenommen - weil bei make_elem_header noch einmal
		});

		make_elem_header_authoring($all_elem);
		autor_on_off(true);

		if (a_prgtyp[pnr][0] == "ggb") { // muss hier am schluss stehen
			// 25.7.2015
			//			iframe_on_off($elem,1);
		}
	});
}


function init_elem(pnr, $elem, classBreite) {
	if (is_def_breite($elem.attr("class")) == -1) {
		$elem.addClass(classBreite);
	}

	$elem.addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.attr("data-baa-prg", a_prgtyp[pnr][0])
		.attr("data-baa-prgnr", pnr)
		.attr("data-baa-fenst", a_prgtyp[pnr][EXT_WIN]);

	if (a_prgtyp[pnr][0] == "ggb") {
		appletnr++;
		$elem.data("appletnr", appletnr);
	}
}


function elem_adr_refr($elem) {
	/*
		$elem.find(".elem-adressblock").each(function() {
			//$(this).find(".elem-adr").css("width","100%").css("width","-="+BUTT_REDUK+"px");
			//$(this).find(".elem-artikel").width($(this).width()-$(this).find(".b_adrOpen").width()*7);
		});
	*/
}

function make_elem_header_authoring($all_elem) {
	var anz_iframes = 0;

	//	$(".elem").each(function(index) {
	$all_elem.each(function (index) {
		if ($(this).find(".elem-header-links").length == 0) {
			$elem = $(this);
			var pnr = 0;
			if ($elem.data("baa-prgnr")) {
				pnr = $elem.data("baa-prgnr");
			}

			var adr_flag = "";
			if (pnr == 14) { //fragetypen
				frage_typ($elem, edit_mode);
			} else {
				var adr_teil = "";
				if (a_prgtyp[pnr][ADR_SHOW] == 1) {
					var alt_wert = a_prgtyp[pnr][ADR_DEF];
					if ($elem.data("baa-adr")) alt_wert = $elem.data("baa-adr");

					var chk = "";
					if ($elem.data("baa-ifrextern")) chk = "checked='true'";

					var fRnd = "c" + Math.random();
					var maxbox = "<div class='klammer ttd'><label for='" + fRnd + "' class='chkboxText'> Extern: </label>";
					maxbox += "<input class='b_chkbox toggle_extern' id='" + fRnd + "' type='checkbox' " + chk + " title='Diese Adresse in einem eigenen Fenster öffnen' /></div>";
					if (a_prgtyp[pnr][0] == "ggb") maxbox = ""; //bei GGB nicht


					var fRnd = "t" + Math.random();
					var artikel = "<div class='klammer ttd'><label for='" + fRnd + "' class='chkboxText' title='Name oder Nummer des Artikels' >Artikel/Detail: </label>";
					artikel += "<input class='elem-artikel' style='width:40%' id='" + fRnd + "' type='text' value='' title='Name oder Nummer des Artikels der in der oberen Adresse verwendet wird' /></div>";


					//adr_teil = "<div class='elem-adressblock'>";
					adr_teil = "<div class='elem-adressblock'>" + get_adr_header_button("b_adrOpen", "Open", 0) + "<div class='klammer'><input class='ttd elem-adr' title='WEB- oder Bildadresse' placeholder='" + a_prgtyp[pnr][ADR_TEXT] + "' value='" + alt_wert + "'/>" + "</div>" + maxbox + "</div>";
					var chkbox = "";
					if (a_prgtyp[pnr][0] == "ggb") {
						adr_teil += "<div class='elem-adressblock'><div class='ttd'>Schülerarbeitsfläche: </div>";

						var conv = 0;
						if ($elem.data("baa-ggbconfig")) conv = Number($elem.data("baa-ggbconfig"));
						var ggb_toolbar = ["Keine Toolbar", "Minimale Toolbar", "Mittlere Toolbar", "Gesamte Toolbar"];
						chkbox = "<select class='eAntw zuSel' onchange='changeGGBToolbar(this,-1)'>";
						$.each([0, 1, 2, 9], function (index, wert) {
							var sel = "";
							if (Math.floor(conv / 1000) == wert) sel = "selected";
							chkbox += "<option value='" + wert + "' " + sel + ">" + ggb_toolbar[index] + "</option>";
						});
						chkbox += "</select>";
						conv = conv % 1000;
						ggb_toolbar = ["Menüschalter", "3D-System", "Animationslauf", "Abgabe-Button"];
						$.each([0, 1, 2, 7], function (index, wert) {
							var sel = "";
							if ((conv & Math.pow(2, wert)) > 0) sel = "checked";
							chkbox += "<div class='klammer ttd' ><label for='chk_" + index + "' class='chkboxText'>" + ggb_toolbar[index] + ": </label>";
							chkbox += "<input class='b_chkbox toggle_ggbToolbar' id='chk_" + index + "' onchange='changeGGBToolbar(this," + wert + ")' type='checkbox' " + sel + " /></div>";
						})
						adr_teil += chkbox;
						adr_teil += "</div>";
					} else {
						adr_teil += "<div class='elem-adressblock'>" + get_adr_header_button("b_adrHome", "Home", 0) + artikel + get_adr_header_button("b_adrGo", "go", 0) + chkbox + "</div>";
					}
					//adr_teil+= "</div>";
					adr_flag = " ad"; //weiter unten fuer sizer
					anz_iframes++;
				}
			}

			/*
			if ($elem.find(".elem-corner").length==0) {
				$elem.append("<div class='elem-corner ui-state-default ui-icon ui-icon-triangle-1-w'>x</div>");
			}
			*/

			if ($elem.find(".elem-header-links").length == 0) {

				$elem.append("<div class='elem-header-links'></div>");
				$elem.find(".elem-header-links").addClass("ui-widget-header ui-corner-all");

				$eHeader = $elem.find(".elem-header-links");
				//<div class='elem-mover-butt ui-state-default ui-icon ui-icon-arrow-4'></div>
				if (a_prgtyp[pnr][CELEM_HEAD] > 0) {
					$.each([0, 3, 1, 2], function (index) {
						tool_button($elem, $eHeader, pnr, index);
					})
				}


				if ((adr_flag > "") || ($elem.data("baa-ftyp") == "11")) {
					var butt = "<button class='b_tool isizer nn'>Minimum</button><button class='b_tool isizer kk'>Kleiner</button>" + "<button class='b_tool isizer gg'>Größer</button>" + "<button class='b_tool isizer mm'>Max</button>";
					$eHeader.append("<div class='ifr_sizer" + adr_flag + "'>" + butt + "</div>");
					tool_sizer();
					$(".ifr_sizer.ad").hide();
				};

			}


			if ($elem.find(".elem-header-rechts").length == 0) {
				$elem.prepend("<div class='elem-header-rechts'></div>");
				$eHeader = $elem.find(".elem-header-rechts");
				if (a_prgtyp[pnr][CELEM_HEAD] > 0) {
					var st = 5;
					if (($elem.data("baa-prg") == "bau") || ($elem.data("baa-ftyp") == "11")) st = 4;

					for (var i = st; i < anz_tool_button; i++) {
						tool_button($elem, $eHeader, pnr, i);
					}
				}
				$eHeader.addClass("ui-widget-header ui-corner-all");
				if (adr_teil != "") {
					$eHeader.after(adr_teil);
					$(".chkextern").buttonset();
					//$(".b_adrGo").hide();
				}
			}
			if ($elem.find(".elem-footer").length == 0) {
				if (pnr == 14) { //fragetypen
					if ($elem.data("baa-ftyp") != undefined) {
						if (frage_info[Number($elem.data("baa-ftyp"))] > "") {
							$elem.append("<div class='elem-footer'>" + frage_info[$elem.data("baa-ftyp")] + "</div>");
						}

					}
				}
			}
			elem_adr_refr($elem);
		}
	});


	if ($(".elem").length) {
		$(".elem-header-rechts").hide();
		$(".b_tool").disableSelection();

		$('.toggle_extern').off("click").on("click", function () {
			//var $checkbox_obj=$(this).next(); // Checkbox als jQuery-Objekt
			var $checkbox_obj = $(this);
			$checkbox_obj.closest(".elem").data("baa-ifrextern", Number($checkbox_obj.prop('checked')))
		});

		/*
				$('.toggle_ggbToolbar').off("click").on("click",function(){
					//var $checkbox_obj=$(this).next(); // Checkbox als jQuery-Objekt
					var $checkbox_obj=$(this);
					$checkbox_obj.closest(".elem").data("baa-ifrextern",Number($checkbox_obj.prop('checked')))
				});
		*/
		//$(".adrButton").button();
		$(".normButton").button();
		$(".maxlink").button({
			icons: {
				primary: "ui-icon-extlink"
			},
			text: false
		});
		$(".b_adrOpen").button({
			icons: {
				primary: "ui-icon-arrowthickstop-1-s"
			},
			text: false
		});
		init_click();
	}

	if (anz_iframes == 1) {
		$(".b_adrOpen").trigger("click");
	}
}


function changeGGBToolbar(obj, nr) {
	var $elem = $(obj).closest(".elem");
	var $frame = $elem.find("iframe");

	var conv = 0;
	if ($elem.data("baa-ggbconfig")) conv = $elem.data("baa-ggbconfig");

	if ($frame.length > 0) {
		var gg = $frame[0].document || $frame[0].contentWindow;
		var ch_conv = conv % 1000;
		var tb_conv = Math.floor(conv / 1000);

		if (nr > -1) {

			var bt = Math.pow(2, nr);
			if ($(obj).prop("checked")) {
				//console.log(conv,nr," 2 ^ " + nr + "=" + Math.pow(2,nr),conv ^ Math.pow(2,nr),conv ^ Math.pow(2,nr) ^ Math.pow(2,nr));
				ch_conv = ch_conv | bt;
			} else {
				ch_conv = ch_conv & (~bt);
			}

		} else {
			tb_conv = $(obj).val();
		}
		$elem.data("baa-ggbconfig", 1000 * tb_conv + ch_conv);
		//alert($elem.data("baa-ggbconfig"));
	}
}

function tool_button($elem, $eHeader, pnr, i) {
	if (a_toolButton[i][2]) {
		if ($eHeader.find("." + a_toolButton[i][1]).length == 0) {

			if (i == 0) { // allererstes element verschiebe div
				$eHeader.append("<div class='b_tool " + a_toolButton[i][1] + "'>" + a_toolButton[i][0] + "</div>");
			} else {
				$eHeader.append("<button class='b_tool " + a_toolButton[i][1] + "'>" + a_toolButton[i][0] + "</button>");
			}
			//$eHeader.append("<button class='b_tool "+a_toolButton[i][1]+"'>");
			$butt = $eHeader.find(".b_tool:last");

			switch (i) {
				case B_MOVE:

					//wird von sortable bedient
					$butt.addClass("elem-mover-butt ui-icon ui-icon-arrow-4")
					//$butt.off("click").on("click",function () {
					//}).button({icons: {primary: "ui-icon-arrow-4"},text:false});;
					break;
				//,"ui-icon-arrowthickstop-1-e"
				case B_25:
				case B_50:
					//case B_75:
					//case B_100:
					var a_icons = ["ui-icon-caret-1-w", "ui-icon-caret-1-e"];
					$butt.off("click").on("click", function () {
						$elem = $(this).closest(".elem");
						//vis_breite($elem,9);
						chg_breite($elem, 2 * i - 3);
						if ($elem.data("baa-hgfakt") != undefined) {
							$eCont = $elem.find(".elem-content");
							$eCont.height($eCont.width() * Number($elem.data("baa-hgfakt")));
							resize_dynamo(1);
						}

					}).button({
						icons: {
							primary: a_icons[i - 1]
						},
						text: false
					})
					break;

				case B_KOPIE:
					$butt.off("click").on("click", function () {
						$elem = $(this).closest(".elem");
						//wenn iframe offen, dann zu
						if (a_prgtyp[$elem.data("baa-prgnr")][0] == "ggb") {
							if ($elem.find("iframe").length > 0) { // wenn offen
								iframe_on_off($elem, false)
							}
						}
						$elem.clone(true).insertAfter($elem);
						$nxtElem = $elem.next();

						autor_on_off(true);
					}).button({
						icons: {
							primary: "ui-icon-copy"
						},
						text: false
					});

					break;

				case B_LOESCH:
					$butt.off("click").on("click", function () {
						$elem = $(this).closest(".elem");
						$elem.remove();
					}).button({
						icons: {
							primary: "ui-icon-trash"
						},
						text: false
					});

					break;

				case B_ADD:

					var ft = $elem.data("baa-ftyp") == undefined ? -1 : $elem.data("baa-ftyp");
					if ((ft > -1 && ft < 9) || (ft == 11)) {
						$butt.off("click").on("click", function () {
							$elem = $(this).closest(".elem");
							$alleAntw = $elem.find(".eAntw");
							$eAntw = $alleAntw.last();
							$eAntw.clone().appendTo($eAntw.parent());

							if ($elem.data("baa-ftyp")) {
								if ($elem.data("baa-ftyp") == "8") {
									var $alleAntw = $elem.find(".r1");
									$eAntw = $alleAntw.last();
									$eAntw.clone().appendTo($eAntw.parent());
								}
								if ($elem.data("baa-ftyp") == "11") {
									var tanz = $elem.find(".eAntw").length;
									if (tanz > 0) {

										$last = $elem.find(".eAntw").last();
										var ow = $last.closest(".elem-content").outerWidth() - 2;

										$last
											.css("left", 50 + Math.floor(tanz / 20) * 70)
											.css("top", 20 + (tanz % 20) * 32);

										$last
											.data("baa-left", 50 / ow)
											.data("baa-top", $last.position().top / ow + 0.07);
									}
									edit_dyn_drop(chkedit_mode);
								}
							}
						}).text("Element anfügen").button({
							icons: {
								primary: "ui-icon-plus"
							},
							text: false
						});
					} else {
						$butt.remove();
					}
					break;

				case B_SUB:
					var ft = $elem.data("baa-ftyp") == undefined ? -1 : $elem.data("baa-ftyp");
					if ((ft > -1 && ft < 9) || (ft == 11)) {
						$butt.off("click").on("click", function () {
							$elem = $(this).closest(".elem");
							$alleAntw = $elem.find(".eAntw");

							if ($elem.data("baa-ftyp")) {
								var mind = 1;
								if ($elem.data("baa-ftyp") == "8") mind = 2;
								if ($alleAntw.length > mind) {
									$eAntw = $alleAntw.last();
									$merke = $eAntw;
									if ($elem.data("baa-ftyp") == "8") {
										var $alleAntw = $elem.find(".r1");
										$eAntw = $alleAntw.last();
										$eAntw.remove();
									}
									$merke.remove();

								} else {
									alert("Löschen der letzten Antwort nicht möglich!");
								}
							}
						}).text("Element löschen").button({
							icons: {
								primary: "ui-icon-minus"
							},
							text: false
						});
					} else {
						$butt.remove();
					}
					break;


				case B_CHK:
					var i = Number($eHeader.parent().hasClass("re"));
					//var a_txt=["Umschalter auf rechtsbündig - Modul ist derzeit linksbündig","Umschalter auf linksbündig - Modul ist derzeit rechtsbündig"];
					var a_icon = ["first", "end"];
					var a_info = ["links(-orientiert)", "rechts(-orientiert)"];

					$butt.off("click").on("click", function () {
						$elem = $(this).closest(".elem");
						var $bbb = $(this).find(".ui-icon");
						//var $ttt=$(this).find(".ui-button-text");
						if ($elem.hasClass("re")) {
							$elem.removeClass("re");
							$bbb.removeClass("ui-icon-seek-" + a_icon[1]).addClass("ui-icon-seek-" + a_icon[0]);
						} else {
							$elem.addClass("re");
							$bbb.removeClass("ui-icon-seek-" + a_icon[0]).addClass("ui-icon-seek-" + a_icon[1])
								.attr("title", "Umschalter zwischen Left-FLoat und Right-Float - derzeit " + a_info[0]);

						}
					}).button({
						icons: {
							primary: "ui-icon-seek-" + a_icon[i] + ""
						},
						text: false
					});
					//	.text("Umschalter zwischen Left-FLoat und Right-Float")
					break;


				case B_BHG:
					var ft = $elem.data("baa-ftyp") == undefined ? -1 : $elem.data("baa-ftyp");
					if (ft == -1) {
						if ($elem.find(".elem-content").find("img").length > 0) {
							ft = 1;
						}
					}

					if (ft == 11) {
						//nicht mehr anzeigen
						$butt.hide();
					}

					if ((ft == 1) || (ft == 11)) {

						$butt.off("click").on("click", function () {
							$eCont = $(this).closest(".elem").find(".elem-content");
							anz = $eCont.find(".eAntw").length;

							if (anz > 0) {
								return false;
							}
							var i = 0;

							$ht = "";
							$eCont.find(".eAntw").each(function (index) {
								var $obj = $(this);
								$ht += "<span class='eAntw zuDropDyn' data-baa-left='" + $obj.data("baa-left") + "' data-baa-top='" + $obj.data("baa-top") + "'>" + $obj.text() + "</span>";
								i++;
							});

							if (i == 0) {
								for (var j = 0; j < 6; j++) {
									$ht += "<span class='eAntw zuDropDyn' data-baa-left='0' data-baa-top='0' >Wort" + (j + 1) + "</span>";
								}
							}

							bild_holen($elem, 0); //setzen auch der baa_left ...

							// if ($eCont.find("img").length>0) {
							// 	bild_holen($elem,0);
							// } else {
							// 	bild_holen($elem,1);
							// }
							$eCont.html($ht);
						}).text("Dynamisches Bild gestalten").button({
							icons: {
								primary: "ui-icon-contact"
							},
							text: false
						});
					}
					break;

				default:
					alert("No Button " + i);
			}
		}
	}
}

function tool_sizer() {
	$(".isizer.kk").on('click', function () {
		var schr = 16;
		var $elem = $(this).closest(".elem");
		if ($elem.find("iframe").length == 1) {
			var obj = "iframe";
		} else {
			var obj = ".elem-content";
		}
		var $myIfr = $elem.find(obj);
		$myIfr.outerHeight($myIfr.outerHeight() - schr);
		if (obj == "iframe") {
			$elem.data("baa-ifrhoehe", $myIfr.outerHeight());
		} else {
			$elem.data("baa-hgfakt", $myIfr.outerHeight() / $myIfr.outerWidth());
		}
		resizen_author();

	}).button({
		icons: {
			primary: "ui-icon-arrowthick-1-n"
		},
		text: false
	});

	$(".isizer.gg").on('click', function () {
		var schr = 32;

		var $elem = $(this).closest(".elem");
		if ($elem.find("iframe").length == 1) {
			obj = "iframe";
		} else {
			obj = ".elem-content";
		}
		var $myIfr = $elem.find(obj);
		$myIfr.outerHeight($myIfr.outerHeight() + schr);
		if (obj == "iframe") {
			$elem.data("baa-ifrhoehe", $myIfr.outerHeight());
		} else {
			$elem.data("baa-hgfakt", $myIfr.outerHeight() / $myIfr.outerWidth());
		}

		resizen_author();
	}).button({
		icons: {
			primary: "ui-icon-arrowthick-1-s"
		},
		text: false
	});


	$(".isizer.mm").on('click', function () {

		var $elem = $(this).closest(".elem");
		if ($elem.find("iframe").length == 1) {
			obj = "iframe";
		} else {
			obj = ".elem-content";
		}
		var $myIfr = $elem.find(obj);

		var schr = wh - $myIfr.offset().top - 42 - 8;

		$myIfr.outerHeight(schr);
		if (obj == "iframe") {
			$elem.data("baa-ifrhoehe", 999);
		} else {
			$elem.data("baa-hgfakt", $myIfr.outerHeight() / $myIfr.outerWidth());
		}

		resizen_author();
	}).button({
		icons: {
			primary: "ui-icon-arrowthickstop-1-s"
		},
		text: false
	});

	$(".isizer.nn").on('click', function () {
		var $elem = $(this).closest(".elem");
		if ($elem.find("iframe").length == 1) {
			obj = "iframe";
		} else {
			obj = ".elem-content";
		}
		var $myIfr = $elem.find(obj);

		var schr = 200;
		$myIfr.outerHeight(schr);
		if (obj == "iframe") {
			$elem.data("baa-ifrhoehe", $myIfr.outerHeight());
		} else {
			$elem.data("baa-hgfakt", $myIfr.outerHeight() / $myIfr.outerWidth());
		}
		resizen_author();
	}).button({
		icons: {
			primary: "ui-icon-arrowthickstop-1-n"
		},
		text: false
	});
	//$(".isizer").hide();
}


var htm_obj = "";

function show_html(htm, vorspann) {
	var param = "left=0,top=0,width=" + Math.min(1024, ww) + ",height=" + Math.max(900, wh);
	param = param + ",location=1,toolbar=0,titlebar=0,menubar=0,status=0,resizable=1";
	adr = "99_html_viewer.php";
	//htm_obj="<h1>"+vorspann+"</h1>"+htm;
	htm_obj = htm;

	baa_win = window.open(adr, "wopen", param);
	baa_win.focus();
}


function iframe_close($elem) {
	var anz_ifr = chk_iframe_ggb_closed();
	if (anz_ifr > 0) {
		$elem.find(".elem-content").remove();
		//edit_on_off(false);
		alert("Zeichnung wurde eingefügt!");
	}
}

function elem_adr_verlassen($this) {

	$this.data("key_pressed", false);

	$elem = $this.closest(".elem");
	var prgnr = $elem.data("baa-prgnr");
	prgart = a_prgtyp[prgnr][0];
	switch (prgart) {
		case "ggb":

			if ($this.val().length > 200) {
				iframe_close($elem);
				var tmp = $this.val();
				p = tmp.indexOf("data-param-ggbbase64=");
				if (p > -1) {
					tmp = tmp.substr(p + 22, 99999);
					p1 = tmp.indexOf("\"");
					tmp = tmp.substr(0, p1)
				} else {
					tmp = $this.val();
				}

				$elem.data("baa-ggbdatei", tmp)

				if (!$elem.data("appletnr")) {
					appletnr++;
					$elem.data("appletnr", appletnr)
				}
			} else {
				var adr = a_prgtyp[prgnr][ADR_HOME];

				$elem.find("iframe").attr("src", adr);
				$elem.data("baa-adr", adr);
			}
			break;

		default:
			var adr = $this.val();

			if (adr > "") {
				$elem.data("baa-adr", adr);
				adr = get_adr($elem);

				if ($elem.data("baa-adr") != adr) {
					$elem.data("baa-adr", adr)
					$this.val(adr);
				}

				if (prgnr == "1") {
					var tag = "img"
				} else {
					var tag = "iframe"
				}
				if ($elem.find(".elem-content").length > 0) {
					$elem.find(tag).attr("src", adr);
				} else {
					$elem.append("<div class='elem-content'><" + tag + " class='elem-ifr' src='" + adr + "'></" + tag + "></div>");
				}

				if (a_prgtyp[prgnr][EXT_WIN] == 1) {
					win_extra($elem, adr);
				}
			} else {
				alert("Adresse eingeben!");
			}
	}
}



function info(bst, ele) {
	if (typeof ele === "undefined") {
		console.log("undef")
	} else {
		console.log(ele.baa())
	}
}



function paste_init() {
	window.addEventListener("paste", processEvent);
	//	$(window).bind("paste",processEvent);
}

function processEvent(e) {
	if (navigator.userAgent.indexOf("Firefox") != -1) {
		if (chkedit_mode > 0) {
			//alert("Editor bitte ausschalten");
		}
	}
	if (e.clipboardData.items) {
		var clipboardItem = e.clipboardData.items[0];
		var type = clipboardItem.type;
		if (type.indexOf("image") != -1) {
			var blob = clipboardItem.getAsFile();
			var blobUrl = window.webkitURL.createObjectURL(blob);
			//var urlCreator=(window.URL || window.webkitURL);
			//	var blobUrl=urlCreator.createObjectURL(blob);

			getBase64Image(e, blobUrl);
			//				$(".elem-content").append("<img src='"+blob+"'>");

			setTimeout(2, function () {
				urlCreator.revokeObjectURL(blobUrl);
			});
			//make_hg(blobUrl);
		} else {
			console.log(type, "Not supported: " + type);
		}
	} else {
		//setTimeout(checkInput, 10);
	}
}


// Code taken from MatthewCrumley (https://stackoverflow.com/a/934925/298479)
function getBase64Image(e, adr) {
	var imageObj = new Image();
	imageObj.onload = function () {
		var canvas = document.createElement("canvas");
		canvas.width = imageObj.width;
		canvas.height = imageObj.height;
		// Copy the image contents to the canvas
		var ctx = canvas.getContext("2d");
		ctx.drawImage(imageObj, 0, 0);
		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to guess the
		// original format, but be aware the using "image/jpg" will re-encode the image.
		var dataURL = canvas.toDataURL("image/png");
		ret_adr = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		//$(".elem-content").append("<img src='"+dataURL+"'>");

		//$("*").closest(".elem-content").append("<img src='"+dataURL+"'>");
		//e.insertHtml("<img src='"+dataURL+"'>");

		var sel = document.getSelection()
		var range = sel.getRangeAt(0);
		var el = document.createElement("img");
		el.setAttribute("src", dataURL);
		range.insertNode(el);
	};
	imageObj.src = adr;
}

function getCaretCharacterOffsetWithin(element) {
	var caretOffset = 0;
	var doc = element.ownerDocument || element.document;
	var win = doc.defaultView || doc.parentWindow;
	var sel;
	if (typeof win.getSelection != "undefined") {
		sel = win.getSelection();
		if (sel.rangeCount > 0) {
			var range = win.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		}
	} else if ((sel = doc.selection) && sel.type != "Control") {
		var textRange = sel.createRange();
		var preCaretTextRange = doc.body.createTextRange();
		preCaretTextRange.moveToElementText(element);
		preCaretTextRange.setEndPoint("EndToEnd", textRange);
		caretOffset = preCaretTextRange.text.length;
	}
	return caretOffset;
}

function showCaretPos() {
	var el = document.getElementById("test");
	var caretPosEl = document.getElementById("caretPos");
	caretPosEl.innerHTML = "Caret position: " + getCaretCharacterOffsetWithin(el);
}


function bild_holen($elem, flag) {
	function bildsize(adr) {
		var img = new Image();
		img.onload = function () {
			$elem
				.data("baa-hgfakt", (this.height / this.width * 1.1))
				.data("baa-hgimage", "url(" + adr + ")")
				.data("baa-ftyp", "11")

			$elem.find(".elem-content").css("background-image", "url('" + adr + "')");
			edit_dyn_drop();
			resize_dynamo(1);

			$elem.find(".eAntw").each(function (index) {
				$(this)
					.css("left", "50px")
					.css("top", 30 + (32 * index) + "px")
					.attr("data-baa-left", 0.1)
					.attr("data-baa-top", 0.025 * (index + 1));
			});
		}
		img.src = adr;
	}
	flag_ft11 = 1;
	if (flag) {
		alert("deprecated")
		window.KCFinder = {};
		window.KCFinder.callBack = function (url) {
			// Actions with url parameter here
			bildsize(url);
			window.KCFinder = null;
		};

		var param = "?type=images&lang=de&dir=/data/math_db/"
		window.open('/ckfinder/ckfinder.html?type=Images');
	} else {
		$eCont = $elem.find(".elem-content");
		if ($eCont.find("img").length > 0) {
			url = $eCont.find("img").attr("src");
			bildsize(url);
		}

		/*
		autor_on_off(true);
		*/
	}


}


function pruefe_img($elem) {
	$elem.each(function () {
		$(this).find("img").each(function () {
			$img = $(this);
			//console.log("src=",$img.attr("src"),$img,$img[0].currentSrc)
			get_img_src($img);
		})
	})
}

function get_img_src($img) {
	function file_exists(datei) {
		$.get(datei).done(function () {
			return true;
		}).fail(function () {
			return false;
		});
	}

	src = $img.attr("src");

	if (!file_exists(src)) {

		//        img_src= src.replace(/\.png/g, ".gif");
		//        $img.attr("src",img_src);
	}
}



function insertSpez(edi, prg) {
	var vor = "";
	var nach = "";
	var htm = "";
	var $img;

	function get_teile(txt) {
		var a_teile = txt.split("|");
		if (a_teile.length <= 1) {
			a_teile = txt.split("#");
		}
		return a_teile;
	}

	// console.log(edi)
	sel=window.getSelection()
	console.log("sel1",sel.anchorNode, sel.anchorOffset)
	console.log("sel2",edi.getSelection().getSelectedText())

	var selText = edi.getSelection().getSelectedText();

	if (selText == "") {
		// // alert("leer")
		// var range = window.getSelection().getRangeAt(0)
		// // now you get a copy of the nodes that been selected
		// var fragment = range.cloneContents()
		// // now you can do whatever you want with fragment, such as find img element
		// var $img = $(fragment).find('img');
		// if ($img) {
		// 	found = 2
		// }
		alert("Um eine Zuordnung zu definieren oder zu löschen, muss ein Begriff markiert sein!");
		return false
	} else {
		found = 1 //text
	}


	let loe=0;
	if (!found && (prg != 12)) {
		// alert("Um eine Zuordnung zu definieren, muss ein Begriff markiert sein!");
	} else {
		if (prg == 12) { //ort nach paar und zurück))
			let htm = edi.getData();

			$leer = $("<div></div>");
			$leer.append(htm);

			$leer.find("input").each(function () {
				$(this).replaceWith($(this).val())

			})
			edi.setData($leer.html());


		} else { //wort und paar))
			if (found == 2) { //image selected
				htm = "<span class='eAntw zuDrop' style='width:auto' data-baa-lsg='0'>" + $img[0].outerHTML + "</span>";

			} else {
				if ((selText.charCodeAt(0) == 160) || (selText.charCodeAt(0) == 32)) vor = "&nbsp;";
				if ((selText.charCodeAt(selText.length - 1) == 160) || selText.charCodeAt(selText.length - 1) == 32) nach = "&nbsp;";

				selText=selText.trim();
				var teile = get_teile(selText);

				if (teile.length > 1) {
					if (teile.length == 2) {
						htm = "<input type='checkbox' data-baa-input='1' data-baa-yesno='" + teile.join("|") + "' >";
					} else { //select
						htm = "<select class='eAntw zuSel'>";
						htm += "<option value='0'>???</option>";
						var i = 1;
						$.each(teile, function (index, wert) {
							htm += "<option value='" + i + "'>" + wert.trim() + "</option>";
							i++;
						});
						htm += "</select>";
					}

				} else {

					$leer=$("<div></div>");
					$leer.append(edi.getData());
					$($leer).find("span").each(function () {
						let $ele=$(this);
						if ($ele.text()==selText) {
							if ($ele.hasClass("eAntw")) {
								$(this).replaceWith(selText)
								loe=1;
							}
						}
					})
					if (loe) {
						edi.setData($leer.html());
					} else {
						let art=["inpText","zuDrop"];
						htm = `<span class='eAntw ${art[prg-1]}' data-baa-lsg='0'>${selText}</span>`;
					}

					// if (prg == 1) { //schreibtext
					// 	let zahl_str = selText;
					// 	let erg = "";

					// 	zahl_str = zahl_str.replace(/m2/, "m²")
					// 	zahl_str = zahl_str.replace(/m3/, "m³")
					// 	let last_char = zahl_str.substr(-1, 1);
					// 	if (".²³".indexOf(last_char) > -1) {
					// 		let a_tmp = zahl_str.replace(/\s/g, " ").split(" ");
					// 		zahl_str = a_tmp[0];
					// 		erg = a_tmp[1];
					// 		// erg=erg.replace(/2/,"²").replace(/3/,"³");
					// 		erg = "&nbsp;" + erg;
					// 	}
					// 	htm = "<input class='inpText' type='text' size='" + zahl_str.length + "' data-baa-input='" + zahl_str + "' value='" + zahl_str + "' placeholder='?'>" + erg;

					// 	htm = "<span class='eAntw inpText' data-baa-lsg='0'>" + selText + "</span>";

					// } else if (prg == 2) {
					// 	// console.log(selText)
					// 	// let htm = edi.getData();
					// 	$leer=$("<div></div>");
					// 	$leer.append(edi.getData());
					// 	$($leer).find("span").each(function () {
					// 		let $ele=$(this);
					// 		if ($ele.text()==selText) {
					// 			if ($ele.hasClass("eAntw")) {
					// 				$(this).replaceWith(selText)
					// 				loe=1;
					// 			}
					// 		}
					// 	})
					// 	if (loe) {
					// 		edi.setData($leer.html());
					// 	} else {
					// 		htm = "<span class='eAntw zuDrop' data-baa-lsg='0'>" + selText + "</span>";
					// 	}
						
					// }
				}

			}
		}
		if (!loe) {//gelöschter button, dann nicht
			edi.insertHtml(vor + htm + nach);
		}
		
	}
}
