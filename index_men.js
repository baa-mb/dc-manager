var sw, sh, ww, wh,rand;
var is_dialog_open=0;

// $(document).ready(function () {
function init() {	
	sw=screen.width;sh=screen.height;
	$(window).resize(function() {
		resizen();
	})
	resizen();

	gotoPage_click() ;
};


function makePageTall(){
	$("body").height(4000);
}



function resizen() {
	ww=$(window).width();wh=$(window).height();
	rand=8;
	rand=4;
	men_w="20%";
	hpt_w = ww - men_w - rand - 0;

	// $("iframe").height(wh-2);
	// $("iframe").height("100vh");
	// $("iframe").height("99.9vh");
	// $("#men_menue").width(men_w);
	// $("#men_menue").css("margin-right",rand);
	// $("#men_dialog").hide();
	// $("#men_dialog").height("60vh");
	
}



// function dialog_open(htm) {
// 	$("#medialog_text").html(htm);	
// } 


function dialog_open(adr,wzeit=3) {
	is_dialog_open=1;
	$("#men_dialog").attr("src",adr);
	$("#men_dialog").show();
	let sw=$(window).width();
	let dw=$("#men_dialog").width()

	$("#men_dialog").css("left",(sw-dw)/2);
	if (wzeit>0) {
		setTimeout(function() {
			is_dialog_open=0;
			$("#men_dialog").hide();
		},wzeit*1000)
	}

	//$('#men_dialog').on('click', function(event) {dialog_close() });
}

function dialog_close() {
	is_dialog_open=0;
  	$("#men_dialog").hide();
}

// function gotoPage() {
// 	document.men_haupt.gotoPage(1);
// }
var blaettern=0
function blaettern_allow(flag) {
	if (flag!=blaettern) {
		
		if (flag==1) {
			$("#pg_li").show();
			$("#pg_re").show();
		} else {
			$("#pg_li").hide();
			$("#pg_re").hide();
		}
		blaettern=flag;
	}
}


function gotoPage_click() {
	blaettern_allow(0);

    $("#pg_li").css("left",$("#men_menue").width()+2);
	$(".gotoPage").click(function(evt) {
        let mc=evt.currentTarget;
        if (mc.id=="men_sw") { 
            $("#men_menue").show(500);
            $("#men_sw").hide(500);
            $(mc).hide();
            $("#pg_li").css("left",$("#men_menue").width()+2);
        } else {
            if ($("#men_menue").width()==220) {
                $("#men_menue").hide(300);
                $("#men_sw").show();
                $("#pg_li").css("left","2px");
            } 
            let richtg=1;
            if (mc.id=='pg_li') {
                richtg=-1;
            }
            if (mc.id=='pg_re') {
                richtg=1;
            }
            document.men_menue.gotoPage(richtg);
        }
	}); 
}

function clickhide() {
	$(".gotoPage").hide();
};


function check_breite() {
    console.log($("#men_menue").width())
}