const leerz = String.fromCharCode(160);

let frage_fertig_flag=[];
let fragenAnz=0;
let frage_max_punkte=0;
let frage_sammel_punkte=0;
let frage_sum_fehler=0;
let frage_sum_richtige=0;
let frage_antw_runden=0;
let frage_proz=0;

edit = 0;
$(document).ready(function () {
	ww = $(window).width();
	wh = $(window).height();
	body_h = $("body").height();
	// analyse_nach_dem_laden($(this), 0);
	analyse_nach_dem_laden($("body"), 0);
	//alle	
	//init_antworten(edit_mode)
});

function chk_13(ev) {
	if (ev.keyCode == 13) {
		chg_op();
	}
}



function analyse_nach_dem_laden($eCont, edit) {

	function inp_auswertung($feld) {
		// alert($feld.data('baa-input'))
		let chk_richtig = ist_gleich($feld.val(), $feld.data("baa-input"));
		if (chk_richtig) {
			$feld.attr("disabled", "true");
			pkt = 1;
		} else {
			pkt = -1;
		}
		zeige_farbe_richtig($feld, Number(pkt > 0), true);
		add_punkte(myFrageNr, 14, pkt, Number(pkt > 0));
	}

	// console.clear();

	//$(".elem-content").each (function (index) {
	//		var $eCont=$(this);
	$a_inp = $eCont.find(".inpText");
	if ($a_inp.length > 0) {

		// $eCont.parent().data("baa-ftypspez", 1);

		var len_max = 1;
		let a_inp_texte = [];
		$a_inp.each(function () {
			console.log(($(this).text() + "").length);
			len_max = Math.max(len_max, (($(this).text() + "").length + 1));
		});


		$a_inp.each(function (index) {
			let txt = $(this).text();
			// console.log("txt:",index,txt)
			// a_inp_texte.push(txt);
			// let inp=`<input class='eAntw inpText' style='width:${len_max/7}em' style='text' data-baa-lsg='0' data-baa-input='${txt}' value='' placeholder='?' xxxsize='${len_max}'>`;
			let inp = `<input class='eAntw inpText' style='width:${len_max}ch' type='text' data-baa-lsg='0' data-baa-input='${txt}' value='' placeholder='?'>`;
			$(this).replaceWith(inp);
		});

		$a_inp = $eCont.find(".inpText"); // neu einlesen, weil jetzt input statt span ist
		$a_inp.each(function () {

			var $eInp = $(this);
			// console.log($eInp);
			if (!edit) {
				// var myFrageNr = add_punkte(-1, -1, 1, 0);

				$eInp.keypress(function (event) {
					var pkt = 0;
					if (event.which == 13) {
						event.preventDefault();
						console.log("13er", $(this));
						// inp_auswertung($(this));
						$(this).trigger("blur");
					}
				});
				// .width(len_max * 12);
				$eInp.blur(function () {
					if ($(this).val() != "") {
						console.log("blur", $(this));
						inp_auswertung($(this));
					}
				});
			} else {
				$eInp.attr("value", $eInp.data("baa-input"));
				//$eInp.val($eInp.data("baa-input"));
			}
			// console.log($eInp.data("baa-input")); 
		});
	}

	//zuordnung laenge button
	if ($eCont.find(".zuDrop").length > 0) {
		//console.log("innen",$a_inp.length);			
		// $eCont.parent().data("baa-ftypspez", 1);
		var drop_anz = 0;
		len = 0;
		$eCont.find(".zuDrop").each(function (index) {
			str = $(this).text().split(";")[0];
			len += str.length;
			drop_anz++;
		});
		len = Math.round(Math.min(ww / 100, len / drop_anz)); //baa
		//console.log("len",drop_anz,len)	

		//console.log("ww=",ww,"len=",len,"ww/100=",ww/100,Math.min(ww/100,len))		

		var myFrageNr = add_punkte(-1, -1, drop_anz, 0);

		$eCont.find(".zuDrop").each(function () {
			let $drop = $(this);
			if (!edit) {
				//$drop.draggable("destroy");
				// var wort = $drop.text();
				let a_wort = [];
				htm = $drop.html();

				ind = $drop.data("baa-lsg"); //für die lösung
				// alert(ind)
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
					let wort_richtig = a_wort[0];
					// console.log("wort=",$drop.text(),a_wort,"xlen=",len,wort_richtig );

					$drop.data("richtig", wort_richtig);
					$drop.text(leerz);


				}
				if ($eCont.find(".rahmen_antworten").length == 0) {
					// $eCont.append("\n<br style='clear:both' />");
					$eCont.append("<div class='rahmen_antworten'></div>");
				}
				$rahm = $eCont.find(".rahmen_antworten");
				a_wort.forEach(function (auswahl_wort) {
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
						zeige_farbe_richtig(odrop, Number(pkt > 0), true);
						add_punkte(myFrageNr, 14, pkt, 0);
					}
				}).width(1.5 * len + "ch").html("&nbsp;");
				// .width(len * 6).html("&nbsp;");

			} else {
				//$elem.css("width",(w_anz*2)+"em");

				$drop.css("width", "auto");
			}
		});


	}














	return false;

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
						zeige_farbe_richtig(odrop, Number(pkt > 0), true);
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


function space_remove(txt) {
	txt = txt.toString().replace(/ /g, "");
	//txt.replace(/\s+/g, "")
	return txt.replace(/\s+/g, "");
}


function zeige_farbe_richtig($el, richtig, is_f_korrekt = false) {
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




function add_punkte(fnr, ft, pkt, frage_abschluss=false) {
	// return 1;
	console.log(fragenAnz,frage_max_punkte,frage_sammel_punkte,frage_sum_fehler,frage_sum_richtige,frage_antw_runden,frage_proz);
	

	if (fnr == -1) { //reset erstaufruf
		//console.log("fnr:",fragenAnz,"reset: ",pkt);		
		frage_fertig_flag[fragenAnz] = 0;

		frage_max_punkte[fragenAnz] = pkt;
		frage_sammel_punkte[fragenAnz] = 0;

		frage_sum_fehler[fragenAnz] = 0;
		frage_sum_richtige[fragenAnz] = 0;
		frage_antw_runden[fragenAnz] = 0;

		frage_proz[fragenAnz] = 0;
		// $(".elem-punkte").css("background-color", "none");

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
				// $(".elem-punkte").css("background-color", "#00ff00");
			} else {
				// $(".elem-punkte").css("background-color", "#FFF");
			}

			frage_proz[fnr] = Math.round(100 * (Math.max(0, frage_sammel_punkte[fnr]) * 100 / frage_max_punkte[fnr])) / 100;

			var gesicht = Math.round(Math.max(0, frage_sammel_punkte[fnr]) / frage_max_punkte[fnr] * 2 * 10) / 10;
			var opa = Math.round(frage_antw_runden[fnr] / frage_max_punkte[fnr] * 10) / 10;


			// $(".elem-punkte").html("Frage: " + (fnr + 1) + "/" + (fragenAnz) + " Pkt.: " + frage_sammel_punkte[fnr] + "/" + frage_max_punkte[fnr] + " " + "<img src='images/f_" + Math.round(gesicht) + ".png' align=absMiddle style='width:15px;opacity:" + opa + "'>");

			var fertige_fragen = 0,
				sum_proz = 0;
			for (var key in frage_fertig_flag) {
				//console.log(key,frage_fertig_flag[key],frage_proz[key]);
				if (frage_fertig_flag[key] == 1) {
					fertige_fragen++;
					sum_proz += frage_proz[key];
				}
			}

			// let teufel_nr = bsp_lfdnr % 400;
			// if (teufel_nr == 0) {
			// 	var d = new Date();
			// 	teufel_nr = d.getMilliseconds() % 400;
			// }

			// stern = "stern_plus";
			// if (pkt == -1) {
			// 	teufel_nr = "-" + (bsp_lfdnr % 2);
			// 	stern = "stern_minus";
			// 	snd_stern_minus.play();

			// } else {
			// 	snd_stern_plus.play();
			// };

			//<img src='/data/math_db/animbsp/anim"+teufel_nr+".gif' width='100%'/>
			// lohn = "<div id='teufel'></div>";
			// // const $last=$(".elem").first();
			// const $last = $("body");
			// if ($last.find("#teufel").length > 0) {
			// 	//$last.find("#teufel").replaceWith(lohn);
			// } else {
			// 	$last.append(lohn);
			// }
			// $("#teufel").append("<span class='" + stern + "'>*</span>");
			//console.log($last.html());

console.log(fertige_fragen ,"==", fragenAnz);
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
				// $("#teufel").html("<img src='/data/math_db/animbsp/anim" + teufel_nr + ".gif' width='120px'/>");
				// snd_stern_fertig.play();
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


function ist_gleich(txt1 = "", txt2 = "") {
	const regex = /\s+/g;
	return (txt1.toString().replace(/\s+/g, "") === txt2.toString().replace(/\s+/g, ""));
}

function shuffle(o) {
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


let win_open;
function linkAufruf(obj,sg=-1) {
	console.log("obj",obj,"\n",window.parent.akt_schueler_id)
	console.warn("rufer",window.opener,window.parent)
	let keywort = $(obj).attr("keywort");
	// alert("keyword: "+keywort)
	let keywort_klein = keywort.toLowerCase();
	if (keywort < " ") {
		return false;
	}



	keywort = keywort.trim();
	win_open = window.open('', '_blank');
	// alert(keywort);


	if (keywort.length > 6) {
		win_open.location = keywort;
		win_open.focus();

	} else {

		$.ajax({
			type: "POST",
			dataType: "json",
			url: "php/get_fc_mcard_link.php",
			data: { fc_wort: keywort },
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log("An error occurred", XMLHttpRequest, textStatus, errorThrown);
			},
			success: function (phpData) {
				if (phpData > "") {
					console.log("link:",phpData);
					// alert(phpData.men_link)
					let men_adr = phpData.men_link;

					win_open.location = men_adr;
					win_open.focus();
				} else {
					alert("Nicht gefunden");
				}
			},
		});
	}
}

