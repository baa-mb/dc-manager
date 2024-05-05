var prg_pfad="//baa.at/projekte/dc/";
var isTouch = (('ontouchstart' in window) || navigator.msMaxTouchPoints > 0);
var akt_wplan_save = 0;
var user_sk_level=0;

var reload_neu=false;

var canvas_on = false;

//dient zur speicherung der parameter aus den Auswahlsammlungen
var ablatt_id = "empty";
var ablatt_kzz ="";
var ablatt_p3=0;

var filter_lapps=1;

var baa_test=999;
var fs_mode=0;

// var a_snd = ["butt", "tiny", "jodel", "laser", "trash", "no", "szip", "upload"];
// function beep(snd) {
//     let i = a_snd.indexOff(snd);
//     var audio = new Audio("../assets/sounds/" + a_snd[i] + ".mp3");
//     audio.play();
// }
var sndClick = new Audio("../assets/sounds/click.mp3");  
function beep(snd_datei) {
    var snd = new Audio("../assets/sounds/" + snd_datei + ".mp3");    
    snd.play();
}

var isFullscreen = false;

function toogleFullscreen() {

	if (!isFullscreen) {
		enterFullscreen(document.documentElement)
		// if (fs_mode==2) { //pad fullscreen-tab
		// 	$("html").css("position","fixed");
		// 	$("body").css("position","fixed")
		// }
	} else {
		exitFullscreen();
	}
	isFullscreen = !isFullscreen;

	// setTimeout(()=>{
	// 	info_screen();
	// },1000)
	

}

function enterFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
}

//enterFullscreen(document.documentElement); // ganze Seite
//enterFullscreen(document.getElementById("videoPlayer")); // ein bestimmtes Element

function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}


function info_screen() {
	let win = window,
	doc = document,
	docElem = doc.documentElement,
	body = doc.getElementsByTagName('body')[0],
	br = win.innerWidth || docElem.clientWidth || body.clientWidth,
	ho = win.innerHeight || docElem.clientHeight || body.clientHeight;

	console.log("------------------------------");
	a_screen=[screen.width,screen.height];
	console.log("Screen:",screen.width,screen.height);
	console.log("Win:",$(window).height());
	console.log("docElem:",$(docElem).height());
	console.log("body:",$(body).height());
	console.log("ho:",ho);
	console.log(win.innerHeight , docElem.clientHeight , body.clientHeight,a_screen.includes(ho))
	console.log("standlone:",window.navigator.standalone);
	console.log("------------------------------");
}



// function gesonderte_anzeige(img_or_txt,ifr) {
	
//     const src=ifr.src, zch=(src.includes("?")) ? "&":"?";
	
// 	setTimeout(()=>{
		
// 		ifr.src=src + zch + getRandomInt(1000);
// 		console.log(src,ifr.src)
// 	},1500)
    
// }
