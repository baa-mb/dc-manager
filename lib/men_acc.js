var sd_callback_flag = 0;
var nr = 0;
var bfarbe = 1;

var cook_vorspann = "x";

function setCookie(cname, cvalue, exdays = 7) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = ";expires=" + d.toGMTString();
	let ssite = ";SameSite=Strict";
	document.cookie = cook_vorspann + "_" + cname + "=" + cvalue + expires + ssite;
	//alert(document.cookie);
}

function getCookie(cname) {
	let name = cook_vorspann + "_" + cname + "=";
	let ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}




function set_theme(flag = 0) {
	const a_farben = [
//sfarb,  h1butt  ,    h2    ,  frei    ,  mark old, h2 sfarb,
['#000', '#ffc700', '#ffe380', '#b38b00', '#fff1bf', '#000'],//0

['#000', '#ffe380', '#fff1bf',  '#ffc700','#b38b00', '#000'],//1
['#fff', '#b38b00', '#ffc700', '#fff1bf', '#ffe380', '#000'],
['#000', '#ffc700', '#fff1bf', '#ffe380', '#b38b00', '#000'],
['#fff', '#598059', '#72a372', '#60bf60', '#cfe6cf', '#fff'],
['#fff', '#598059', '#72a372', '#60bf60', '#cfe6cf', '#000'],//3

['#fff', '#596f80', '#cfdce6', '#647d8f', '#6096bf', '#000'],
['#fff', '#596f80', '#6096bf', '#647d8f', '#cfdce6', '#fff'],

['#000', '#cc8f8f', '#e6cfcf', '#bf6060', '#805959', '#000'],//8
['#fff', '#805959', '#cc8f8f', '#bf6060', '#e6cfcf', '#000'],


['#fff', '#bf6060', '#cc8f8f', '#805959', '#e6cfcf', '#000'],//10
['#fff', '#b30000', '#ffbfbf', '#ff8080', '#ff0000', '#000'],

['#fff', '#360000', '#750000', '#ff8080', '#b50000', '#fff'],//12

['#fff', '#008f00', '#bfffbf', '#80ff80', '#00cc00', '#000'],//13
['#fff', '#008f00', '#00cc00', '#80ff80', '#bfffbf', '#fff'],

['#fff', '#0066b3', '#bfe4ff', '#80c9ff', '#00487d', '#000'],//15
['#fff', '#00487d', '#bfe4ff', '#80c9ff', '#0066b3', '#000'],
['#fff', '#0066b3', '#80c9ff', '#00487d', '#bfe4ff', '#000'],

['#fff', '#b35a00', '#ffdfbf', '#ffc080', '#ff8000', '#000'],//18
['#fff', '#b35a00', '#ff8000', '#ffc080', '#ffdfbf', '#000'],
['#fff', '#b35a00', '#ffdfbf', '#ffc080', '#ff8000', '#000'],
['#000', '#ff8700', '#ffe1bf', '#ffc380', '#b35f00', '#000'],

['#fff', '#003e82', '#0059ba', '#bfdeff', '#80bcff', '#fff'],//22

['#fff', '#003e82', '#80bcff', '#0059ba', '#bfdeff', '#000'],//23
['#fff', '#0059ba', '#bfdeff', '#80bcff', '#003e82', '#000'],
['#fff', '#003e82', '#0059ba', '#bfdeff', '#80bcff', '#fff'],
['#fff', '#0059ba', '#80bcff', '#bfdeff', '#003e82', '#000'],
		

['#fff', '#360099', '#d6bfff', '#ad80ff', '#26006b', '#000'],//27
['#fff', '#26006b', '#360099', '#d6bfff', '#ad80ff', '#fff'],
['#fff', '#26006b', '#ad80ff', '#360099', '#d6bfff', '#fff'],
['#000', '#ad80ff', '#d6bfff', '#26006b', '#360099', '#000'], //30
['#fff', '#360099', '#d6bfff', '#26006b', '#ad80ff', '#000'],
['#fff', '#360099', '#d6bfff', '#ad80ff', '#26006b', '#000'],


['#000', '#ad80ff', '#360099', '#26006b', '#d6bfff', '#000']

	];

	if (flag > -1) {
		nr = flag;
		bfarbe = 1;
		console.log("---- buttfarbe", bfarbe);
		// $("li a").css({
		// 	"--button_background": a_farben[nr][1],
		// 	"--button_color": a_farben[nr][0]	
		// });

		$(":root").css({
			"--button_background": a_farben[nr][1],
			"--button_background_h2": a_farben[nr][2],
			"--button_color": a_farben[nr][0],
			"--button_mark": a_farben[nr][4],
			"--button_mark_color": a_farben[nr][5]
		});



		// root.style.setProperty("--button_background", a_farben[nr][bfarbe])
		
	// $("ul.submenu").css({
	// 	"--button_background_h2": a_farben[nr][3],
	// });


/*		
		"--button_background_h2": a_farben[nr][3],
		"--button_color": a_farben[nr][0],
		"--button_mark": a_farben[nr][2],
		"--button_mark_color": a_farben[nr][5],
*/


		$("#such_ress").val(nr);
		setCookie("theme_nr", nr);

		$(".my_nav").css({
			// "--button_background": a_farben[nr][bfarbe],
		});

	} else if ((flag == -1) || (flag==-2)) {
		
		nr = getCookie("theme_nr") ? Number(getCookie("theme_nr")) : 0;
		if (flag==-1) nr = (nr + a_farben.length - 1) % a_farben.length;
		if (flag==-2) nr = (nr + 1) % a_farben.length;

		console.log("system", nr);
		bfarbe = 1;
		$(":root").css({
			"--button_background": a_farben[nr][1],
			"--button_background_h2": a_farben[nr][2],
			"--button_color": a_farben[nr][0],
			"--button_mark": a_farben[nr][4],
			"--button_mark_color": a_farben[nr][5]
		});

		$("#such_ress").val(nr);
		setCookie("theme_nr", nr);

	} else if (flag == -3) {
		bfarbe = ((bfarbe) % 4) + 1;
		console.log("---- buttfarbe", bfarbe);
		$("li a").css({
			"--button_background": a_farben[nr][bfarbe],
		});
	}

	// "--button_background": a_farben[nr][bfarbe],
	// "--button_background_h2": a_farben[nr][3],
	// "--button_color": a_farben[nr][0],
	// "--button_mark": a_farben[nr][2],
	// "--button_mark_color": a_farben[nr][5],

	// $("#men_menue").css("--men_background","#eee")
	$("#such_ress").val(nr);
	setCookie("theme_nr", nr);
}


function beep(snd_datei) {
	var snd = new Audio("../assets/sounds/" + snd_datei + ".mp3");
	snd.play();
}


(function ($) {

	$.fn.mgaccordion = function (options) {
		var defaults = {
			theme: -1,
			leaveOpen: false
		};
		var settings = $.extend({}, defaults, options);

		var $oldButton;
		this.baa_test = function (feld) {
			alert("baa_test");
			//	console.log($(feld).addClass('openItem'));
		};


		this.initialize = function () {
			// console.warn(Date())

			// console.log(dstr[0] % 17			)
			let theme_nr = settings.theme;
			if (theme_nr == -1) {
				let dstr = new Date().toLocaleDateString().split(".");
				theme_nr = (dstr[0] % 17);
				theme_nr=getCookie("theme_nr");
				
			}
			set_theme(theme_nr);

			/* silently exit if passed element is not a list */
			if (!this.is('ul') && !this.is('ol')) {
				// console.log('Element is not a list');
				return;
			}
			//console.error("init");
			// icon_left='<span class="material-icons li">more_vert</span>'
			icon_right = "<img src='../assets/icons/arrow_thin.png' />";

			// this.addClass('mg-accordion');

			var leaveOpen = settings.leaveOpen;
			this.addClass('mg-acc');

			$.each(this.find('li'), function () {
				var $li = $(this);

				if ($li.children('ul').length) {
					$li.addClass('dropdown')
						.children('a').bind('click', function (e) {
							butt_click_event(e, true, $(this));
						});
					$li.find('ul').addClass('submenu');
					$li.children('a').find(".ire").html(icon_right);
				} else { //keine untermenus
					$li.children('a').bind('click', function (e) {
						butt_click_event(e, false, $(this));
					});
				}
			});
			return this;
		};

		function butt_click_event(evt, droppMen, $butt) {
			evt.preventDefault();
			// evt.stopPropagation();
			// console.log($(this).text());
			// $butt = $(this);
			// console.log(droppMen, "click: evt.target", evt.target);
			// console.log("currentTarget", evt.currentTarget);
			closeOther($butt);
			if (droppMen) {
				$butt.siblings('ul.submenu').each(function () {
					// console.log("Wer 0 bin ich:", $(this).attr("id"), "offen", $(this).hasClass("offen"));
					if ($(this).is(':visible')) {
						$(this).removeClass('offen');
						$(this).slideUp();
					} else {
						$(this).addClass('offen');
						$(this).slideDown("slow");
						// $(this).slideDown("slow",function() {
						// 	if (sd_callback_flag==1) {
						// 		alert(33)
						// 		slide_down_callback($(this).attr("id"));
						// 		// sd_callback_flag=0;
						// 	}
						// })
						// .complete (function() {alert(3)});
					}
					// $(this).toggleClass('offen', !$(this).is(':visible'));
					// console.log("Wer 0 bin ich:", $(this).attr("id"), "offen", $(this).hasClass("offen"));
					// $butt.addClass('openItem');

					// }).slideToggle("slow", function () {
					// 	console.log("slideToggle",$(this).attr("class") );
				});
				// console.log("Wer 2 bin ich:",$(this).attr("id"),"offen",$(this).hasClass("offen"))
			}
			updateIcons($butt);
			$oldButton = $butt;
		}



		// var setIcons = function () {
		// 	openIcon = '<span class="material-icons-round">view_headline</span>';
		// 	closeIcon = '<span class="toggler"><i class="fa fa-minus-circle"></i> </span>';
		// 	// 	openIcon = '<span class="toggler"><i class="fa fa-arrow-circle-down"></i> </span>';
		// 	// 	closeIcon = '<span class="toggler"> <i class="fa fa-arrow-circle-up"></i></span>';
		// };
		// setIcons();
		var closeOther = function ($butt) {
			var $uls = $butt.parent().siblings().find('ul.submenu');

			$uls.each(function () {
				$uls = $(this);
				if ($uls.hasClass('offen')) {
					$uls.removeClass('offen').slideUp('slow');
					// $uls.parent().find('a').removeClass('openItem');
				}
				$uls.parent().find('a').removeClass('openItem');
				// beep("z");
			});
		};

		var updateIcons = function ($butt) {
			if (($oldButton) && (!$oldButton.is($butt))) {
				$oldButton.removeClass("sel_rahmen");
				if ($oldButton.siblings('.submenu').length == 0) { //gibt es kein untermenüs
					$oldButton.removeClass('openItem');
				}
				$butt.addClass('openItem');
				$butt.addClass("sel_rahmen");
			} else {
				if ($butt.siblings().length > 0) {
					if ($butt.next().hasClass("offen")) {
						$butt.addClass('openItem');
					} else {
						$butt.removeClass('openItem');

					}

				}

			}


			// $butt.addClass("sel_rahmen");
			// $butt.addClass('openItem');

			// if ($butt.siblings('.submenu').length == 0) {
			// 	// $butt.addClass('openItem');
			// }

			// function upd ($b) {
			// 	if (!$b.siblings('.submenu').hasClass('offen')) {
			// 		console.log("ist offen")
			// 		$b.removeClass('openItem');
			// 	} else {
			// 		$b.addClass('openItem');
			// 		console.log("NEU")
			// 	}
			// }
		};

		this.open_struktur = function (feld) {
			$such_ul = $(feld).parent().parent();
			// console.log((feld), $such_ul[0].tagName, $such_ul[0].id, $such_ul.attr("id"), $such_ul.attr("class"));

			while ($such_ul.attr("id") != "navbar") {
				// console.log("innen", $such_ul[0].tagName, '=', $such_ul.attr("id"), "=", $such_ul.attr("class"), $such_ul,);
				if ($such_ul[0].tagName == "UL") {
					$such_ul.slideDown("slow", function () {
						$(this).addClass('offen').siblings("a").addClass('openItem');
					});
				}
				$such_ul = $such_ul.parent().parent();
			}

			// console.warn("aus der whilescheife:", $such_ul.attr("id"));
			// console.log("DURCH");
		};


		this.open = function (feld) {
			$butt = $(feld);
			this.open_struktur(feld);
			$butt.trigger("click");
		};

		return this.initialize();

	};




}(jQuery));
