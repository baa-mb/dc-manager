// JavaScript Document

edit_mode = 1; // ist nicht der chkeditor_mode
prg = "dcm";
//editor_mode="<?=$_GET['chkedit_mode'];?>"; //0: aus, 1: klein, 2: großß
var close_frage = false;




base_baa = "https://baa.at/projekte/dc";


function nach_dem_laden_mcard(htm_txt) {

	let $a_samm_qr = [];
	let ues_h2 = "Überschrift";

	htm_txt = htm_txt.replace(/\t/g, "");

	regex = /\.\.\/assets/g;
	htm_txt = htm_txt.replace(regex, base_baa + "/assets");


	regex = /fc_qr_re/g;
	htm_txt = htm_txt.replace(regex, "fc_qr");


	let $htm = $("<div>" + htm_txt + "</div>");
	let qr_anz = 0;
	let $ret = $("<div></div>");
	regex = "";
	$htm.find(".mcard").each(function () {
		$mc = $(this);
		// console.log($mc)
		$mc.find("table").each(function (ind_t) {
			$table = $(this);
			if (ind_t == 0) {
				$mc.find("tr").each(function (ind_tr) {
					$tr = $(this);
					if (ind_tr == 0) {
						ues_h2 = $tr.text();
						$tr.remove();

					} else {

						// if ($tr.find(".fc_qr").length > 0) {
						// 	$tr.find(".fc_qr").each(function () {
						// 		console.log($(this))
						// 		$a_samm_qr.push($(this));
						// 	});
						// }




						$tr.find("td").each(function (ind_td) {
							$td = $(this);
							// console.log($td.attr("style"), $td.width(), $td.css("width"));
							if (parseInt($td.css("width"), 10) > 0) {
								$td.attr("width", $td.css("width"));
								$td.css("width", "");
								if ($td.attr("style") == "") {
									$td.removeAttr("style");
								}
							}

							$tr.find("h1").each(function () {
								$(this).replaceWith("<p class='fett'>" + $(this).html() + "</p>");
							});
							$tr.find("h3").each(function () {
								$(this).replaceWith("<p class='fett'>" + $(this).html() + "</p>");
							});



							$tr.find("ul").each(function () {
								$(this).removeAttr("style");

							});

							$tr.find("li").each(function () {
								// console.log($(this).html())
								let tmp = $(this).html();
								// regex = /\n&nbsp;<\/li>/g;
								regex = /\n&nbsp;/g;
								tmp = tmp.replace(regex, "");
								$(this).html(tmp);
							});



							$tr.find(".flexi").each(function () {
								let $flexi = $(this);
								if ($flexi.find(".fc_qr").length > 0) {
									$flexi.find(".fc_qr,.fc_qr_re").each(function () {
										$a_samm_qr.push($(this));
										$(this).replaceWith("");
									});

								}
							});

							$tr.find(".flexi").each(function () {
								$flexi = $(this);
								$flexi.find("div").each(function () {
									$flexi.html($(this).html());
								});

								// console.log($flexi.html());
								$flexi.parent().html($flexi.html());
							});


							if (ind_td == 1) {
								// $td.find("br").each(function () {
								// 	$(this).remove();
								// });

								let ht = $td.html();
								if (ht.includes("<br")) {
									$td.html(ht.replace(/(<br\s?\/?>)*/g, ""));
								}

								qr_anz = $a_samm_qr.length;
								if ((qr_anz > 0) && (qr_anz < 3)) {
									$td.append("<br><br>");
									// $td.append("<div class='cont_fc_qr'></div>");
									// $cont = $td.find(".cont_fc_qr");
									$a_samm_qr.forEach(function (qr) {
										$td.append(qr);
										console.log(qr);
										// $cont.append(" "); 
										// $td.append(" ");
									});
									$td.css({ "vertical-align": "bottom", "text-align": "center" });
									$td.find(".fc_qr").css("width", (98 / qr_anz + "%"));
									// $td.find(".fc_qr").width((98/qr_anz+"%"));

								}

							}

						});
					}

				});
			}
			$table.removeAttr("border").removeAttr("cellpadding").removeAttr("cellspacing");
		});



		$ret.append("<h2 style='text-align:center'>" + ues_h2.trim() + "</h2>");
		$ret.append($mc.html());

		if ($a_samm_qr.length > 2) {
			// $ret.append("<div class='cont_fc_qr'></div>");
			// $cont = $ret.find(".cont_fc_qr");
			$a_samm_qr.forEach(function (qr) {
				$ret.append(qr);
				$ret.append(" ");
			});
			$ret.find(".fc_qr").css("width", (98 / qr_anz + "%"));
			// $ret.find(".fc_qr").width(98/qr_anz+"%");
			// $(".fc_qr").css("width","25%");
			// $td.css({ "vertical-align": "bottom", "text-align": "center" });
		}


		// console.log($ret.html());
	});
	return $ret.html();
}

function nach_dem_laden(htm_txt) {
	let $htm = $("<div>" + htm_txt + "</div>");
	if (htm_txt.includes("page-break-after")) {
		$htm.find("div").each(function (idx) {
			if ($(this).css("page-break-after") > "") {
				$(this).addClass("seitenumbruch");
				$(this).html("Seiten===umbruch");
			}
		});

	}
	return $htm.html();
}

function insertSpez(edi, prg_flag = "b") {
	let vor = "";
	let nach = "";
	let htm = "";
	let $img;
	let found = "";

	function get_teile(txt) {
		var a_teile = txt.split("|");
		if (a_teile.length <= 1) {
			a_teile = txt.split("#");
		}
		return a_teile;
	}

	// console.clear();
	sel = window.getSelection();
	// Siehe editor.getSelection();
	// esel.getSelectedText() und esel.getStartElement() sind wichtig;
	// esel=edi.getSelection();
	// console.log("sel2", esel);
	// console.log("txt=",esel.getSelectedText());
	// console.log("sel-element", esel.getSelectedElement());
	// console.log("ranges", esel.getRanges());
	// console.log("type", esel.getType());
	// console.log("startelem", esel.getStartElement());
	// console.log("getnative", esel.getNative().getRangeAt(0))	;

	// sel_elem=esel.getStartElement();	
	// console.log("sel=",sel_elem);
	// console.log("se=",sel_elem.$.className="border");
	// console.log("sena=",sel_elem.getName());




	let selText = edi.getSelection().getSelectedText();
	let selElem = edi.getSelection().getStartElement();
	// console.log(selElem);

	if (selText == "") {
		if (selElem.getName() == "img") {
			found = "i";
		}
		// alert("Um eine Zuordnung zu definieren oder zu löschen, muss ein Begriff markiert sein!");
		// return false;
	} else {
		found = "t"; //text
	}


	if (found == "" && (prg_flag != 12)) {
		alert("Um eine Zuordnung zu definieren oder zu löschen, muss ein Begriff markiert sein!");
	} else {
		if (prg_flag == "12") { //ort nach paar und zurück))
			htm = edi.getData();

			$leer = $("<div></div>");
			$leer.append(htm);

			$leer.find("input").each(function () {
				$(this).replaceWith($(this).val());

			});
			edi.setData($leer.html());

		} else if (prg_flag == "class") { //rand/rahmen

			console.log(selElem);
			console.log(selElem.$.attributes);

			selElem.$.className = "";
			selElem.$.attributes = {};


		} else if (prg_flag == "r") { //rand/rahmen

			let cl_name = "rahmen_text";
			if (found == "i") {
				cl_name = "rahmen_bild";
			}

						// console.log(selElem)
						// console.log(selElem.$.className)
			// console.log(selElem.getName(),selElem.getText())

			// 			if ((selElem.getName()=="td") && (cl_name=="rahmen_text")) {
			// 				//sollte ein p-tag eingefügt werden
			// 				vor="<p class='rahmen_text'>";
			// 				nach="</p>";
			// 				htm=selElem.getText();
			// 			} else {

			// console.log("p:",selElem.getName())
				
			if (selElem.$.className == cl_name) {
				selElem.$.className = "";
			} else {
				if (selElem.getName()=="td") {
					selElem.$.style="";	
				} else if (selElem.getName()=="a") {
					selElem.$.style="";	
				} else {
					selElem.$.className = cl_name;
				} 
			}
			htm = ""; //kein ersatz
			// }

			

		} else { //wort und paar))
			if (found == "i") { //image selected
				// htm = "<span class='eAntw zuDrop' style='width:auto' data-baa-lsg='0'>" + $img[0].outerHTML + "</span>";
				return false;
			} else {
				if ((selText.charCodeAt(0) == 160) || (selText.charCodeAt(0) == 32)) vor = "&nbsp;";
				if ((selText.charCodeAt(selText.length - 1) == 160) || selText.charCodeAt(selText.length - 1) == 32) nach = "&nbsp;";

				selText = selText.trim();
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
					if (prg_flag == "l") {  //Link
						let fehler = 0;
						if (selText.length > 5) fehler = 1;
						if (selText.length < 2) fehler = 2;
						if (selText.length == 3) {


						}
						// base_baa="https://baa.at/dom/dlpl/dc/assets";
						if (!fehler) {
							keywort = selText.toUpperCase();
							// win_open = window.open('', '_blank');
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
										let men_adr = phpData.men_link;

										if (men_adr == 'not found') {
											alert(`Kein Ressourcenlink zu >${keywort}< gefunden!`);
										} else {
											// htm = `<a class='ablink' href=${art[prg_nr]}' data-baa-lsg='0'>${selText}</span>`;
											htm = `<a class='ablink' href='javascript:void(0)' keywort='${selText}' onclick='linkAufruf(this)'>${selText}</a>`;
										}
										//achtung unten wird nicht mehr erreicht!	
										edi.insertHtml(vor + htm + nach);
										return false;
									} else {
										alert("Nicht gefunden");
									}
								}
							});
						}
					} else { //schreibfeld oder drop
						let art = ["inpText", "zuDrop"];
						let prg_nr = "tb".indexOf(prg_flag); //ttext oder button
						htm = `<span class='eAntw ${art[prg_nr]}' data-baa-lsg='0'>${selText}</span>`;

					}


				}

			}
		}
		if (htm != "") {
			edi.insertHtml(vor + htm + nach);
		}


	}
}


var ctrlFlag = 0;
// $(document).keydown(function (event) {
// 		var keycode = (event.keyCode ? event.keyCode : event.which);
// 		if (keycode == 17) {
// 			ctrlFlag = 1;
// 			//console.log("ein - ctrlFlag")
// 		} else if ((keycode == 83) && (ctrlFlag)) {
// 			event.preventDefault();
// 			// parent.saveFromExtern();
// 			// send_von_aussen();
// 		}
// 	}).keyup(function (event) {
// 		var keycode = (event.keyCode ? event.keyCode : event.which);
// 		if (keycode == 17) {
// 			ctrlFlag = 0;
// 			//console.log("ctrlFlag 0")
// 		}
// 	});
