var myIntv=0;
$( document).ready(function() {

	let body_font_size = document.querySelector('body');
	let compStyles = window.getComputedStyle(body_font_size);
	let str=compStyles.getPropertyValue('font-size');
	let t=Number(str.substr(0,str.length-2));

	//console.log(str,$("body").css("font-size"),t);

	font_size_fakt=t/12;

	//setTimeout(init, 200);
	$(window).resize(function() {
		resize_baa();
	})
	$(window).on('beforeunload',function(){
		if (myIntv>0) {
			clearInterval(myIntv);
		}
	});
	//resize_baa();

	init();
});


function init() {
	var anz=$(".baaContainer").length;
	if (anz>0) {
		$("#baaContainer_edit_button").hide();
		var h=$(".baaContainer").outerHeight();

		resize_baa();
		/*
		hh=parseInt($(".baaContainer").css("height"));
		console.log(h1,h,hh)
		*/
		/*
				var wh=$(window).height()-rand*2;
				if (h<wh) {
					$("body").css("margin-top",(wh-h)/3+"px")
				}
		*/
	}

	var anz=$("#full").length;
	if (anz) {
		$("body").css("margin","0px")
	}

	if ($(".baaContainer").attr("druck")=="1") {
 		window.onbeforeprint=function (ev) {
			sgroessse=$(".baaContainer").css("font-size");
			// $(".baaContainer").css("font-size","0.7em");
		};
		window.onafterprint=function (ev) {
			$("body").css("color","1em");
		};
		var htm="<img id='druckIcon' onclick='drucken()' src='../assets/images/drucken.png' />";
		$("body").append(htm);
	}
	/*
		var anz=$("iframe").length;
		if (anz) {
			alert($("iframe").attr("height"));
	//		$("body").css("margin","0px")
		}
	*/
	//console.log("m_edit_id=",m_edit_id)
	if (m_edit_id !== 0) {
		$(".baaContainer").attr("contenteditable","true");
		baa_edit_allow();
	} //else {alert(0);}
}





function zeit_decr(dauer) {
	var z=Math.round(dauer);
	$("#zeitschleife").text("Warte: "+dauer);
	var i=0;
	myIntv=setInterval(function(){
		i++;
		$("#zeitschleife").text("Warte: "+(dauer-i));
	},
	1000);
}



function drucken() {
//	$('body').css("margin","0");

	if ($(".spielkarte_gross").length>0) {

		var txt=$(".spielkarte_gross").find("h2").text();

		$("head").append("<title>"+make_filename(txt)+"</title>");

	}

	$('#druckIcon').hide();

	$("body").css("color","#000")

	window.print();
}

function isIpadOS() {
  return navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform);
}

var fakt=0.64;
function resize_baa() {
	var cw=$(window).width()-16;
	var ch=Math.round(cw*fakt);

	//$("body").css("font-size",ch/schriftTeiler); // neues konzept mit % von breite
	// $("body").css("font-size",cw*0.03);
	// console.log($("body").css("font-size"),$("body").width(),$("body").width()*1.7,cw,font_size_fakt)

	//alert (location.search)
	//alert($(window).width() +" " +$(window).innerHeight());

	//$("body").css("font-size",cw/100*font_size_fakt); bis 2022
	let sfont="1.8vw";
	if (isIpadOS()) {
		sfont="2.5vw";
	}
	$("body").css("font-size",sfont);
	$("body").css("line-height","1.5"); //???
//console.log("lh:",$("body").css("line-height","1.5"))

	if ($(".vzent").length>0) {
		//console.log($(window).innerHeight(),$("h1").innerHeight());

		let vtop=($(window).innerHeight()-$("h1").innerHeight())/3;
		$(".vzent").css("margin-top",vtop);
	}
	if ($(".ablatt").length>0) {
		//console.log("ablatt",$(".ablatt").width(),$(window).innerWidth(),$(window).width())
		$(".ablatt").height(cw*1.4143*0.92);
		// alert(1);
	}

	if ($(".mcard").length>0) {
		$(".mcard")
		.css("height","auto")
		.css("width","100%")
		.css("max-width","100%")
		.css("font-size","inherit");

		if (window.parent.men_menue.ist_IOS) {
			$(".mcard").css("font-size","0.65em");
		}

	}

	// alert($(".mcard").css("font-family"))
	//$("table th").css("font-size",(ch/schriftTeiler)*1.3);
	//$(".mcard").css("font-size",(ww-100)*0.024);
	//$("body").outerWidth(cw).outerHeight(ch);
}

function make_filename(txt) {
  var t_txt=txt.replace(/\s|ä|ü|ö|\//gi,'_');
  //alert(t_txt);
  return t_txt;
}

function make_edit_aussen(nr) {
  window.parent.men_menue.open_direkt(nr);
}
