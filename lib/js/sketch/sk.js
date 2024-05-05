
var user_level = 0;

let bild = new Image();

var panel_open = 0;
var winH = 0,
	winW = 0;

sketch_loaded = false;
var mySketch;

var isIpad = 0;
var $iframe;
var schreibtext = "Mein Text";

var sndClick = new Audio("../assets/sounds/butt.mp3");
// let sissor_img=new Image();
let $ifr_sk;

var scroll_y_flag = 0;

let sk_br_ohne_scroll;

let akt_sissor = 0;
let a_sissor_img = [];
for (let i = 0; i < 6; i++) {
	a_sissor_img.push(new Image());
}

let is_zeichnung = false;
var snap_bname = "";
var extern_web=false;


function set_sketch(vis, is_automat = "") {
	extern_web=false;
	if (vis == 9) {
		canvas_on = !canvas_on;
	} else {
		canvas_on = vis;
	}
	canvas_prepare(is_automat);
	
}

function canvas_prepare(is_automat) {
	if (canvas_on) {
		console.log("user_sk_level=" + user_sk_level + "/canv:" + canvas_on);
		warte = 0;
		if (is_automat) warte = 700;
		setTimeout(() => {
			get_iframe_size("bleistift");
		}, warte);

		// if (user_sk_level > 0) {
		// 	make_canvas_tools_restrict(user_sk_level);
		// }
		// $(".class_tools_container").show(500);

	} else { //canvas aus
		// console.log("RÜCKSTELLUNG: user_sk_level=" + user_sk_level + "/canv:" + canvas_on);
		if (user_sk_level > 0) {
			make_canvas_tools_restrict(0); //alles wieder zeigen
			user_sk_level = 0;
		}
		if ($("body").find("#mathCanvas").length > 0) {
			$("#mathCanvas").hide();
			$(".class_tools_container").hide();
		}
		// $(".class_tools_container").hide();
	}
}



function get_iframe_size(arbeitsmodus) {

	if (prg == "dcm") {
		$ifr_sk = $("#app_fenster_1");
	} else {
		$ifr_sk = $("#uebung_ifr_H");
	}
	// if ($('#tools_container').length == 0) {
	// 	make_canvas_tools();
	// } else {
	// 	make_start_einstellung([".colorWahl", ".sizeWahl", ".opaWahl", ".gridWahl", ".markWahl", ".shadowWahl"], [0, 2, 0, 0, 0, 0], 1);
	// }
	let wartezeit = 0;
	let p = $ifr_sk.offset();

	let adr="";
	try {
		adr = $ifr_sk[0].contentWindow.document.location.href;
	
	} catch (error) {
		extern_web=true;
		console.log("Fremde Seite");
		// canvas_on=!canvas_on;
		// alert_dialog("H I N W E I S", "Auf fremden Seiten darf nicht gezeichnet und keine Screenshot erstellt werden!");
	}

	//console.log("adr=",adr);

	if (adr.includes("puzzle_v30") || adr.includes("edupuzzle")) {
		let a_tmp = adr.split("=");
		adr = "https://baa.at/mm-team/mobile/elearn/puzzle_v30.php?projekt_id=" + a_tmp[a_tmp.length - 1];

		let cont = $ifr_sk[0].contentWindow.document.querySelector("body");
		backcolor = $(cont).css("background-color");
		if ($(cont).find("iframe").length > 0) { //ist innerhalb des iframes noch ein iframe!!!

			if ($(cont).find("iframe").attr("src").indexOf("beebot") > 0) {
				$ifr_sk.attr("src", $(cont).find("iframe").attr("src"));
				wartezeit = 400;

				//warten bis geladen ist, weil die canvas-dimension berechnet wird
				// const base = $ifr_sk[0].contentWindow.document.querySelector("base");
				// console.error("base",$(base),"###########################")
				//$(base).attr("href", 'https://baa.at/projekte/beebot-dlpl4/lib/');
				// $(base).attr("href", 'https://baa.at/projekte/beebot-dlpl4/lib/');
			}
		}
	}
	// let scrollerY=document.getElementById("uebung_ifr_H").contentWindow.pageYOffset
	// let scrollerY=$ifr_sk.scrollTop();

	// positionieren des zeichenfensters mathCanvas
	sk_rnd = Math.random();
	sk_x0 = p.left;
	sk_y0 = p.top;

	setTimeout(() => {
		if (adr!="") {
			warte_auf_geladen(arbeitsmodus, $ifr_sk[0].contentWindow.document);
		} else {
			warten_auf_geladen_fremd(arbeitsmodus);
		}
		// console.log("adr2",$ifr_sk[0].contentWindow.document.location.href)
	}, wartezeit);
}


function warte_auf_geladen(arbeitsmodus, iframeDoc) {
	// console.error($ifr_sk[0].contentWindow.document.readyState);
	if (iframeDoc.readyState == 'complete') {
		scroll_y_flag = 0;
		if (iframeDoc.body.scrollHeight > iframeDoc.body.clientHeight) { //scrollbar
			if (!isTouch) {
				scroll_y_flag = 16;
			}
		}
		// alert("ja - geladen")
		sk_br = $ifr_sk.width();
		sk_ho = $ifr_sk.height();
		sk_br_ohne_scroll = sk_br - scroll_y_flag;

		is_zeichnung = false;
		if (arbeitsmodus == "bleistift") {//bleistift
			is_zeichnung = true;
			// console.log("scroll", scroll_y_flag);
			canvas_aufspannen();
		}
	} else {
		setTimeout(function () {
			warte_auf_geladen(arbeitsmodus, iframeDoc);
		}, 200);
	}
}


function warten_auf_geladen_fremd(arbeitsmodus) {
	scroll_y_flag = 0;
	// if (iframeDoc.body.scrollHeight > iframeDoc.body.clientHeight) { //scrollbar
	// 	if (!isTouch) {
	// 		scroll_y_flag = 16;
	// 	}
	// }
	// alert("ja - geladen")
	
	sk_br = $ifr_sk.width();
	sk_ho = $ifr_sk.height();
	console.log('sk_br',sk_br);
	sk_br_ohne_scroll = sk_br - scroll_y_flag;

	is_zeichnung = false;
	if (arbeitsmodus == "bleistift") {//bleistift
		is_zeichnung = true;

		// console.log("scroll", scroll_y_flag);
		canvas_aufspannen();
	}
}

function canvas_aufspannen() {
	if ($('#tools_container').length == 0) {
		make_canvas_tools();
	} else { 			
		make_start_einstellung([".colorWahl", ".sizeWahl", ".opaWahl", ".gridWahl", ".markWahl", ".shadowWahl"], [0, 2, 0, 0, 0, 0], 1);
	}

	if ($("body").find("#mathCanvas").length == 0) {
		$("body").append("<canvas id='mathCanvas' width='" + (sk_br_ohne_scroll) + "' height='" + (sk_ho) + "'></canvas>");
	}
	$("#mathCanvas").css("left", sk_x0).css("top", sk_y0).width(sk_br_ohne_scroll).height(sk_ho);
	$("#mathCanvas").attr("width", sk_br_ohne_scroll).attr("height", sk_ho).css("z-index", 10000);

	$("#mathCanvas").show(700);


	// $("#mathCanvas").css("background","transparent"); 

	// new Sketch($('#mathCanvas'));

	if (!sketch_loaded) {
		// $('#mathCanvas').sketch();
		// console.log(mySketch.lastDelete())
		sketch_loaded = true;
		// $('#mathCanvas').sketch("clear");
	}
	$('#mathCanvas').sketch("clear");
	// $('#mathCanvas')[0].setListening(false);


	// $('#mathCanvas').sketch("tool",2,1);
	// console.log("baa"+Sketch)		
	//tools_container positionieren von tools_container 

	let p = $ifr_sk.offset();
	let icon_br = 44;
	if (prg == "dcm") {
		let fakt = 1.5;
		wfakt = fakt;
		setTimeout(() => {
			let t = p.top - icon_br * 0.8;
			$("#tools_container").css("top", t).css("left", p.left - icon_br * 1.5);
			$("#tools_container_waag").css({ "top": t, "left": p.left + "px", "width": `${(sk_br + 4) / wfakt}px` });
		}, 10);

		$("#tools_container").css("transform", "scale(" + (fakt) + ")");
		
		// $("#tools_container_waag").css({transform: `scale(${fakt*0.85})`,left: `${icon_br*fakt}px`});
		$("#tools_container_waag").css({ "transform": `scale(${wfakt})`, left: `${icon_br * fakt}px` });
		// $("#tools_container_waag").css({transform: `scale(${wfakt})`,left: `${icon_br*fakt}px`,"font-size":`${icon_br*fakt*0.5}px`});
	} else {
		let fakt = Math.min(3.5, $(window).width() * 0.08 / icon_br * 1.05);
		let wfakt = fakt * 0.75;
		if (isTouch) {
			// wfakt=fakt*1.1;
			// wfakt = fakt * 0.9;
			wfakt = fakt;
		}

		$("#tools_container").css({ "transform": `scale(${fakt})`, "height": Math.min((sk_y0 + sk_ho) / fakt, $("#tools_container").height()) });
		// $("#tools_container_waag").css({transform: `scale(${fakt*0.85})`,left: `${icon_br*fakt}px`});
		$("#tools_container_waag").css({ transform: `scale(${wfakt})`, left: `${icon_br * fakt}px`, "font-size": `${icon_br * fakt * 0.5}px`, "width": `${(sk_br + 8) / wfakt}px` });
	}
	// setTimeout(()=> {
	// 	$('#tools_container_waag').width(Math.max(sk_br/wfakt-20,$('#tools_container_waag').width()));	
	// },1000)


	$(".class_tools_container").show(500);

	// if (user_sk_level > 0) {
	make_canvas_tools_restrict(user_sk_level);

	
	// }
}



function make_canvas_tools_restrict(zlevel) {
	function schere_zeigen(vis) {
		for (let j = 11; j < 18; j++) {
			if (vis) {
				$group.eq(0).children().eq(j).show();
			} else {
				$group.eq(0).children().eq(j).hide();
			}
		}
	}

	console.log("ulevel=", zlevel, "art", $("#stift_zch").attr("art"));

	if (extern_web) 
		$("#camera_save").hide()
	else 
		$("#camera_save").show();


	$("#farb_list").show();
	$("#schreibtext").hide();
	$("#smile_list").hide();
	$(".cut_box").hide();

	$group = $(".tools_group.senk");
	if (Number(zlevel) == 0) {
		$group.eq(0).children().show();
		$group.eq(1).show();
		$group.eq(2).show();
		$group.eq(3).show();
		$group.eq(4).show();

		if (prg == "dc") {
			schere_zeigen(false)
		}

		// $group.children().show();
		return false;
		// wichtig verlassen der funktion
	}
	//achtung hier ist zlevel>0
	if (prg == "dc") {
		schere_zeigen(false)
	}
	$group.eq(1).hide();
	$group.eq(2).hide();
	$group.eq(3).hide();
	$group.eq(4).hide();

	// const a_tool_level = [1, 1, 2, 2, 3, 3, 4, 4, 6, 7, 7, 9, 9, 9, 9, 9, 9, 9];
	//betrifft nur die werkzeugleiste
	const a_tool_level = [1, 1, 1, 1, 3, 3, 3, 3, 4, 4, 4, 6, 9, 9, 9, 9, 9, 9, 9, 9];
	$group.eq(0).children().hide();
	$group.eq(0).children().each(function (idx) {
		//console.log(zlevel,idx,$(this).attr("class"))
		if (a_tool_level[idx] <= zlevel) {
			$(this).show();
		}
	});

	if (zlevel >= 2) {
		$group.eq(1).show();
		// $(".sizeWahl").show();

		if (zlevel >= 3) {
			$group.eq(2).show();

			if (zlevel >= 5) {
				$group.eq(3).show();
				$group.eq(4).show();
				if (zlevel >= 6) {
					schere_zeigen(true)
				}
			}
		}

	}
}

// function f_save () {
// 	let b_save="hole_zuerst_protok_id(\"bleistift\")";
// 	if (extern_web) {
// 		b_save="alert(\"Speichern externer Seiten ist nicht erlaubt!\")";
// 	}
// 	return b_save;
// }


function make_canvas_tools() { 

	console.log("canvas:",$("#mathCanvas").css("transform:scale"));

	$("body").prepend("<div id='tools_container' class='class_tools_container'></div>");
	$("body").prepend("<div id='tools_container_waag' class='class_tools_container class_tools_container_waag'></div>");

	for (var i = 0; i <= 4; i++) {
		$('#tools_container').append("<div class='tools_group senk'></div>");
	}
	for (var i = 0; i <= 3; i++) {
		$('#tools_container_waag').append("<div class='tools_group waag'></div>");
	}
	// #####################################################
	// ############## waagrecht ############################
	// #####################################################
	$('#tools_container_waag').append("<div class='tools_group'></div>");
	$wgroup = $('#tools_container_waag').find(".tools_group");




	// $wgroup.eq(0).append("<a href='javascript:hole_zuerst_protok_id(\"bleistift\")' class='sk_bld sk_ui-btn sk_ui-icon-camera ui-btn-icon-left' style='width:auto; user-select: none;justify-content:end' data-bildadresse='png' title='Meine Lösung speichern'>&nbsp;</a>");
	// let b_save="hole_zuerst_protok_id(\"bleistift\")";
	// if (extern_web) {
	// 	b_save="alert(\"Speichern externer Seiten ist nicht erlaubt!\")";
	// }


	$wgroup.eq(0).append(`<a href='javascript:hole_zuerst_protok_id(\"bleistift\")' id='camera_save' class='sk_bld sk_ui-btn sk_ui-icon-camera sk_ui-btn-icon-notext' data-bildadresse='png' title='Meine Lösung speichern und schließen'>&nbsp;</a>`);

	
	$wgroup.eq(0).append("<a href='#mathCanvas' class='undoWahl sk_ui-btn sk_ui-icon-undo sk_ui-btn-icon-notext' data-clear='undo' title='Letztes Element löschen'>&nbsp;</a>");
	$wgroup.eq(0).append("<a href='#mathCanvas' class='clearWahl sk_ui-btn sk_ui-icon-trash-o sk_ui-btn-icon-notext' data-clear='all' title='Bild löschen'>&nbsp;</a>");
	$wgroup.eq(0).append("<a href='#' onclick='leer_seite()'  class='weiss sk_ui-btn sk_ui-icon-trash-w sk_ui-btn-icon-notext' data-clear='all' title='Leeres weißes Blatt' >&nbsp;</a>");


	$.each(['#f00', '#ff0', '#0f0', '#0ff', 'green', 'orange', 'brown', '#00f', '#f0f', '#fff', '#aaa', '#555', '#000'], function () {
		$wgroup.eq(1).append("<a href='#mathCanvas' class='colorWahl' data-color='" + this + "' style='background:" + this + "'>&nbsp;</a>");
	});
	$wgroup.eq(1).attr("id", "farb_list");

	$wgroup.eq(2).append("<input href='#mathCanvas' id='schreibtext' style='text-align:center' onkeyup='set_sel_smiley_extern(1)'  value='Mein Text' data-stext='" + schreibtext + "' />");
	// let smile_adr = "icons/smileys/smile";
	for (let i = 0; i < 24; i++) {
		// smile_samm+=`<a href='#mathCanvas' class='smileNr' data-color='${this}' style='background-image:url(\"js/sketch/icons/smileys/smile${i}.png\")'></a>`;
		$wgroup.eq(3).append(`<a href='#mathCanvas' class='smileNr'  onclick='set_sel_smiley_extern(0,${i})'  style='background-image:url(\"js/sketch/icons/smileys/smile${i}.png\")'></a>`);
		// sel_smileys += `<option value='${i}' data-class='smileNr' class='sk_ui-icon-smile1'>${i}</option>`;
	}
	$($wgroup.eq(3)).attr("id", 'smile_list');

	// sel_smileys = "<fieldset id='smile_box'>";
	// sel_smileys += "<label for='sel_smiley' style='user-select:none' >Smileys: </label>";
	// sel_smileys += "<select name='sel_smiley' id='sel_smiley' onchange='set_sel_smiley_extern(0)'>";

	// for (let i = 0; i < 24; i++) {
	// 	sel_smileys += `<option value='${i}' data-class='smileNr' class='sk_ui-icon-smile1'>${i}</option>`;
	// }
	// sel_smileys += "</select></fieldset>";
	// $wgroup.eq(0).append(sel_smileys);

	// let smile_samm="";

	// $wgroup.eq(0).append(smile_samm)


	// $wgroup.eq(0).append("<span style='display:flex;align-items: center;'> &nbsp;&nbsp;G r a f i k w e r k s t a t t</span>");


	// $wgroup.eq(0).append("<a href='javascript:hole_zuerst_protok_id()' class='sk_bld sk_ui-btn sk_ui-icon-fotocam ui-btn-icon-notext ui-btn-icon-left'  style='width:48px; user-select: none;' data-bildadresse='png' title='Meine Lösung speichern'>Speichern</a>");
	// sel_smileys+=`<option value='${i}' data-class='smile' xdata-style='background-image: url(&apos;${smile_adr}${i}.png&apos;)'><img class='smile_klein' src='${smile_adr}${i}.png'></option>`;



	// #####################################################
	// ############## senkrecht ############################
	// #####################################################

	// $group.eq(5).append("<a xxxhref='#mathCanvas' onclick='set_sketch(9)' class='sk_ui-btn sk_ui-icon-delete sk_ui-btn-icon-notext' datatitle='Schließen'>&nbsp;</a>");
	$group = $(".tools_group.senk");

	$group.eq(0).append("<a xxxhref='#mathCanvas' onclick='set_sketch(0)' class='sk_ui-btn sk_ui-icon-delete sk_ui-btn-icon-notext' style='width:100%;background-size:12px' title='Schließen'>&nbsp;</a>");
	$group.eq(0).append("<span></span");


	let edi = "";
	var a_bld = ["pencil", "minus", "square-o", "square-full", "circle-o", "circle-f", "smile", "text", "rubber", "sissor", "sbild", "sbild", "sbild", "sbild", "sbild", "sbild"];
	$.each(["Stift", "Linie", "Rechteck", "REchteck voll", "Kreis", "Kreis voll", "Smiley", "Text", "Rechteckiger Radierer", "Schere", "Bildspeicher 1", "Bildspeicher 2", "Bildspeicher 3", "Bildspeicher 4", "Bildspeicher 5", "Bildspeicher 6"], function (idx) {
		edi = ""; cutClass = "";
		if (idx > 9) {
			if (prg == "dcm") {
				edi = `contenteditable=true id='b${(idx - 10)}'`;
			}
			cutClass = "cut_box";
		}
		$group.eq(0).append("<a href='#mathCanvas' " + edi + " style='user-select:text' class='toolWahl sk_ui-btn sk_ui-icon-" + a_bld[idx] + " sk_ui-btn-icon-notext " + cutClass + "' title='" + this + "' data-tool='" + idx + "' >&nbsp;</a>");
	});


	$.each([3, 5, 10, 20, 30, 50], function (idx) {
		$group.eq(1).append("<a href='#mathCanvas' class='sizeWahl sk_ui-btn sk_ui-icon-l" + (idx + 1) + " sk_ui-btn-icon-notext' data-size='" + this + "' title='Stiftdicke' ></a>");
	});


	$.each([1, 8, 16, 32, 64, 96], function () {
		$group.eq(2).append("<a href='#mathCanvas' id='r" + this + "' class='gridWahl' data-grid='" + this + "' title='Raster " + this + "' >r" + this + "</a>");
	});


	$.each([1, 0.6, 0.3, 0.1], function (idx) {
		$group.eq(3).append("<a href='#mathCanvas' class='opaWahl sk_ui-btn sk_ui-icon-t" + (idx) + " sk_ui-btn-icon-notext' data-opa='" + this + "' title='Transparenz'>&nbsp;</a>");
	});


	a_bld = ["star-half-o", "star-o"];
	$.each([1, 0], function (i) {
		$group.eq(4).append("<a href='#mathCanvas' class='shadowWahl sk_ui-btn sk_ui-icon-" + a_bld[i] + " sk_ui-btn-icon-notext' data-shadow='" + this + "' title='Schatten " + ["aus", "ein"][this] + "'>&nbsp;</a>");
	});

	make_start_einstellung([".colorWahl", ".sizeWahl", ".opaWahl", ".gridWahl", ".markWahl", ".shadowWahl"], [0, 2, 0, 0, 0, 0, 0], 0);


}


function set_start_mark() {
	let a_sett = ["color", "blue"];
	set_rahmen_mark(0, a_sett);
}


function set_rahmen_mark(menu, a_sett, flag) {
	// console.log("set_rahm menu:",menu,"a_sett",a_sett)
	var a_farben = ["#777", "orangered"];
	let a_mark_css = [{ "border-color": a_farben[0], "border-width": "1px" }, { "border-color": a_farben[1], "border-width": "2px" },];
	if (flag) {
		$(`.${menu}Wahl`).css(a_mark_css[0]);

		let data = `[data-${menu}='${a_sett}']`;
		$("." + menu + "Wahl" + data).css(a_mark_css[1]);
	} else {
		// $(".colorWahl,.sizeWahl,.opaWahl,.gridWahl,.shadowWahl").css({"border-color": a_farben[0],"border-width":"1px"});
		a_sett.forEach(function (paar) {
			$(`.${paar[0]}Wahl`).css(a_mark_css[0]);

			let data = `[data-${paar[0]}='${paar[1]}']`;
			$("." + paar[0] + "Wahl" + data).css(a_mark_css[1]);
			if (paar[0] == "grid") {
				// $('#mathCanvas').sketch().makeGrid($(`#r${paar[1]}`));
				$('#mathCanvas').sketch("makeGrid", $(`#r${paar[1]}`));
			}
		});

	}
	// $("#myClick").trigger('play');
	// sndClick.play();

}


this.einstellungen = function (tool) {
	let a_settings = [
		// [["shadow",1],["opa",  1],["size",10],["grid",1]], //stift

		[["shadow", 0], ["opa", 1], ["size", 10], ["grid", 1]], //linie
		[["shadow", 0], ["opa", 1], ["grid", 32], ["size", 10]], //linie
		[["shadow", 1], ["opa", 1], ["grid", 32], ["size", 10]], //rechteck
		[["shadow", 1], ["opa", 1], ["grid", 32]], //Radierer
		[["shadow", 1], ["opa", 1], ["grid", 32], ["size", 10]], //kreis
		[["shadow", 0], ["opa", 1], ["grid", 32]], //kreisF
		[["opa", 1], ["grid", 32], ["smileNr", $("#sel_smiley").val()]], //smile
		[["shadow", 1], ["opa", 1], ["grid", 32], ["size", 3], ["stext", $("#schreibtext").val()]], //text
		// [["shadow", 1], ["opa", 0.4], ["grid", 32], ["size", 50]], //liner
		[["shadow", 0], ["opa", 1], ["grid", 1]], //rubber
		[["shadow", 0], ["grid", 1]], //schere
		[["shadow", 1]], //cut bild
		[["shadow", 1]], //cut bild
		[["shadow", 1]], //cut bild
		[["shadow", 1]], //cut bild
		[["shadow", 1]], //cut bild
		[["shadow", 1]] //cut bild
	];


	$("#smile_list").hide();
	$("#schreibtext").hide();
	if (tool == 6) {
		$("#smile_list").show();
		$("#farb_list").hide();
	} else {
		$("#farb_list").show();
	}
	if (tool == 7) {
		$("#schreibtext").show();
	}

	return a_settings[tool];
};


function set_sel_smiley_extern(flag, smNr = 0) {
	// console.log("blur",flag,$("#schreibtext").val())
	if (flag == 0) {
		$('#mathCanvas').sketch().set("smileNr", smNr);
	}
	if (flag == 1) {
		$('#mathCanvas').sketch().set("stext", $("#schreibtext").val().replace("xxx", "\r\n"));
	}

}





// function chg_sel_raster(obj) {
// 	$("#r" + $(obj).val()).trigger("click");
// }


// var a_farben = ["#777", "#eee"];
function make_start_einstellung(a_icons, a_default, reset_flag) {
	var a_farben = ["#777", "orangered"];
	// var a_farben = ["red","orangered"];
	if (reset_flag) {
		$.each(a_icons, function (index, wert) {
			$(wert).css("border-color", a_farben[0]);
		});
		// $(wert).css("border-color", a_farben[1]);

	}
	// $.each(a_icons, function (index, wert) {
	// 	$(wert).click(function () {

	// 		// console.log("in klick",wert,index)
	// 		$(wert).css("border-color", a_farben[0]);
	// 		$(this).css("border-color", a_farben[1]);
	// 	}).eq(a_default[index]).css("border-color", a_farben[1]);
	// });

}





//Schritt 1
//hier wird die protokoll_id geholt
function hole_zuerst_protok_id(foto_art = "bleistift") {
	// alert(reload_neu);
	if (prg == "dc") {
		ext_prot_save("img_save_flag", -1, 0);
	} else {
		capture_image(1, akt_uebung_id.toString());
		check_zuweisen(1);
	}
	if (foto_art == "bleistift") { //bleistift
		set_sketch(0); //ausschalten zeichenebene
	} else {//kamera
		//brauche nur die dimensionen für das foto (canvas)
		get_iframe_size("foto");
	}

}


//Schritt 2
//retour von Protok_id springt erst das grafische Speichern an
function zustellung_protok_id(data) {
	if (prg == "dc") {
		snap_bname = (10000000 + Number(data[0].protok_id)).toString().substring(1);
		capture_image(1, snap_bname);
	}
}


// bild = new Image();

//Schritt 3
function capture_image(flag, dateiname, cx0 = 0, cy0 = 0, cx1 = 0, cy1 = 0) {
	
	if (extern_web) return false;

	if (flag == 0) {
		upl_bildname = "screen";
		var canvas = document.getElementById("mathCanvas");
		var img = canvas.toDataURL("image/png");

		document.getElementById("img_sshot").setAttribute("src", img);
		document.getElementById("img_sshot").style.visibility = "visible";
		img_to_server(canvas, upl_bildname, false);
	} else {

		if (Number(akt_uebung_id) == 0) {
			alert_dialog("H I N W E I S", "Du musst zuerst eine Übung aus einem Wochenplan auswählen, erst dann kannst du zeichnen!");
		} else {
			
			beep("camera_low");


			let zch_bild;
			if (is_zeichnung) {
				zch_bild = new Image();
				zch_bild.src = document.getElementById("mathCanvas").toDataURL("image/png");
				// console.log("zch_bild.src ",zch_bild.src )						
			}

			if (prg == "dcm") {
				$ifr_sk = $("#app_fenster_1");
			} else {
				$ifr_sk = $("#uebung_ifr_H");
			}

			//iframebild erzeugen
			// let cont = document.getElementById("uebung_ifr_H").contentWindow.document.querySelector("body");
			let cont=$ifr_sk[0].contentWindow.document.querySelector("html");

			backcolor = $(cont).css("background-color");

			if ($(cont).find("video").length > 0) { //video-cameraaufnahme
				//alert("Videobild")
				cont = $ifr_sk[0].contentWindow.document.querySelector("video");
			}

			//beim bildlüberzeichnen müssen die buttons weg
			if ($ifr_sk.attr("src").includes("bilderpool")) {
				let elem = $ifr_sk[0].contentWindow.document.getElementById("cont_bbild");
				if (elem) {
					elem.style.visibility = "hidden";
				}
			}



			// console.error("scroller:",scroller,document.getElementById("uebung_ifr_H").contentWindow.pageXOffset)

			let scrl = 0;
			scrl=$ifr_sk[0].contentWindow.pageYOffset;
				

			if (!isTouch) {
				scrl = scrl * 1.01;
			}
			optionen = { width: sk_br, height: sk_ho, backgroundColor: backcolor, imageTimeout: 1500, scale: 1, scrollX: 0, scrollY: -scrl, logging: false };
			// optionen={width:sk_br,height:sk_ho,backgroundColor:transparent,imageTimeout:2500,scale:1,scrollX:0,scrollY:-scrl};


			if (flag == 3) { //teilbild nach img


				let fff = 1;
				if (scroll_y_flag) {
					fff = 1 + (scroll_y_flag / sk_br);
				}
				[x0, y0, x1, y1] = [0, 0, sk_br, sk_ho * fff];

				optionen = { width: sk_br, height: sk_ho, backgroundColor: backcolor, imageTimeout: 1500, scale: 1, scrollX: 0, scrollY: -scrl, logging: false };

				html2canvas(cont, optionen).then(function (canvas) {
					// upl_bildname=dateiname;

					let cut_w = Math.abs(cx1 - cx0);
					let cut_h = Math.abs(cy1 - cy0);
					if (scroll_y_flag) {
						// cut_w += 17; cut_h += 12;
						console.error("scroller ja");
						cut_w += 4;
						cut_h += 4;
					}
					var ctx = canvas.getContext("2d");
					// ctx.drawImage(zch_bild, Math.min(x0, x1),  Math.min(y0, y1), cut_w, cut_h);
					// ctx.drawImage(zch_bild, 0,0, cut_w, cut_h);
					// ctx.drawImage(zch_bild, x0, y0, x1, y1, Math.min(x0, x1),  Math.min(y0, y1), cut_w, cut_h);

					ctx.drawImage(zch_bild, x0, y0, x1, y1);
					let imageData = ctx.getImageData(Math.min(cx0, cx1), Math.min(cy0, cy1), cut_w, cut_h);

					var canvas2 = document.createElement("CANVAS");
					canvas2.width = cut_w; canvas2.height = cut_h;

					var ctx2 = canvas2.getContext("2d");
					ctx2.putImageData(imageData, 0, 0);


					// sissor_img.src=canvas2.toDataURL("image/png");
					// a_sissor_img[akt_sissor]=new Image();
					// a_sissor_img.push(sissor_img);

					bild.src = canvas2.toDataURL("image/png");;
					$(".sk_ui-icon-sbild").eq(akt_sissor).css("background-image", `url(${bild.src})`).show();
					a_sissor_img[akt_sissor].src = bild.src;

					// a_sissor_img.forEach( function (bild,idx) {
					// 	console.log(akt_sissor, typeof bild,typeof sissor_img, bild,idx)
					//  	document.body.appendChild(bild)
					// })
					akt_sissor = (akt_sissor + 1) % 6;
					// document.body.appendChild(bild)

				});
			} else {

				// console.log(cont.innerHTML);

				let fff = 1;
				if (scroll_y_flag) {
					fff = 1 + (scroll_y_flag / sk_br);
				}
				[x0, y0, x1, y1] = [0, 0, sk_br, sk_ho * fff];
				html2canvas(cont, optionen).then(function (canvas) {
					upl_bildname = dateiname;
					var ctx = canvas.getContext("2d");

					if (is_zeichnung) {
						// if (zch_bild.lengt>30) {
						ctx.drawImage(zch_bild, x0, y0, x1, y1);
						// }
					}
					// alert(upl_bildname)
					img_to_server(canvas, upl_bildname, $ifr_sk[0]);
				});
			}


		}
	};
}


function leer_seite() {
	$('#mathCanvas').sketch("clear");
	$ifr_sk.attr("src", leer_blatt);
	scroll_y_flag = 0;
}

document.onpaste = function (pasteEvent) {
	// pasteEvent.preventDefault();
	// pasteEvent.stopPropagation();
	// pasteEvent.stopImmediatePropagation()

	if (pasteEvent.target.id) {
		let id = pasteEvent.target.id;

		if (id >= "b0" && id <= "b5") {
			let nr = id[1];
			var item = pasteEvent.clipboardData.items[0];
			if (item.type.indexOf("image") === 0) {
				var blob = item.getAsFile();
				var reader = new FileReader();
				reader.onload = function (event) {
					// document.getElementById("container").src = event.target.result;
					bild.src = event.target.result;
					$(".sk_ui-icon-sbild").eq(nr).css("background-image", `url(${bild.src})`);
					a_sissor_img[nr].src = bild.src;
				};
				reader.readAsDataURL(blob);

				pasteEvent.preventDefault();
				pasteEvent.stopPropagation();

			}

		}

	}
	// Betrachte das erste Item (kann leicht für mehrere Items erweitert werden)
}

