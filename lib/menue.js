// JavaScript Document
"use strict";
var m_breite = 0;
// var m_hoehe = 0;
var m_fenster = 0;
var m_id = 0;
var win_orient = 0;
var men_par_id = 0;
var m_admin = 0;
var ctrlFlag = false; //eigentlich weg
var shiftFlag = false;//eigentlich weg
var altK=0;
var sw, sh;
var m_isMobile = false;
//var prot = "http:";
var elt_men_id = 0;
//var men_20=false;
var edit_inline = 0;
var http_prot = location.protocol;
var make_html_flag="";

// alert(men_20);
function get_browser() {
  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;
}
// es wird nur isSafari verwendet
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
  return p.toString() === "[object SafariRemoteNotification]";
})(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

$(document).ready(function () {
  //prot = window.location.protocol;
  if (men_20) {
    // $("body").css("background-color","red");
    console.log("NEU")
  }

  if ($("input#prglg").length === 1) {
    $("#passwort").popup();
    //		$("#passwort").popup("open");
    $("#pw").focus();
  } else {
    $("#passwort").popup();
    $('#pw').val(getCookie("passw"));
  }

  $("#such_filter").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      starte_suche()
    }
  });

  //if (is_touch_device()) {
  // if (screen.width < 1000) {
  //   $("body").css("font-size", "1em");
  //   //$(".ui-collapsible-content").css("background-color","#ccc");
  // } else {
  //   //$(".ui-collapsible-content").css("background-color","#FC6");
  // }


  if ($("#last_open").val() > 0) {
    elt_men_id = $("#last_open").val();
   
  }
  if ($("#men_user_name").val() > "") {
    window.parent.document.getElementById("men_titel").text = $("#men_user_name").val();
  }

  if ($("#men_umbruch").val() === "1") {
    $(".butti.ui-btn").css({
      "white-space": "normal",
      "text-overflow": "clip"
    });
    $(".ui-collapsible-heading-toggle.ui-btn").css({
      "white-space": "normal",
      "text-overflow": "clip"
    });
  }
  $("#dialog").dialog({
    autoOpen: false
  });

  m_admin = $("#is_admin").val();

  win_orient = 0; //landscape
  $(window).on("orientationchange", function (event) {
    if (window.orientation != undefined) {
      win_orient = (Math.abs(window.orientation % 180) == 0);
      // console.log("schalter set ",win_orient)
      // if (win_orient == 0) { // Portrait
      //   console.log("schalter auf 1")
      //   win_orient = 1;
      //   menue_hide(win_orient);
      // } else {
      //   console.log("schalter auf -1")
      //   win_orient = -1;
      //   menue_hide(win_orient);
      // }
    }
  });

  let mob=getMobileOS()
  m_isMobile = ((mob=="Android") || (mob=="iOS"))
  // if (m_isMobile) {
  //   set_breite_ur();
  // }

  // $(window).resize(function () {
  //   resize_baa();
  // })
  // resize_baa();

  if (m_admin==1) {
//       $(".ui-page-theme-a").css({ 'background-color' : ''});
// console.log($(".ui-page-theme-a").css('background-color'));
      $("#such_filter").addClass("sonderhoch");
    edit_inline = Number(getCookie("edit_inline"));
    //alert("Admin-Modus: (bin beim PRG-Ändern - Team - bitte einfach weiterarbeiten) " + m_admin)
    edit_yes_no(0);
  }

  if ($("#last_open").val() > 0) {
    //console.warn("open oder lastopen:",$("#last_open_json").val())
    if ($("#last_open_json").val() > "") {
      let obj = JSON.parse($("#last_open_json").val());
      //ausfiltern, wann könnte es problem geben bei der anzeige der letzten seite
      let is_html = Number(obj.men_html);
      let is_editor = $("#editor").val() + 0;
      if ((is_html) || (obj.men_link > "")) {
        //if ((obj.men_breite==0) && (Number(obj.men_fenster)==0)) {
        if ((Number(obj.men_fenster) == 0) && (is_editor == 0)) {
          set_cook(obj.men_id, is_html, obj.men_breite, obj.men_hoehe, obj.men_link, Number(obj.men_fenster), 0);
        }
      }
    }
  }

});

function set_breite_ur() {
  if (!men_20) {
    var ff = parent.document.getElementById("fset_waag");
    var arr = ff.cols.split(",");
    arr[0] = "15%";
    arr[2] = "0";
    ff.cols = arr.join();
  } else {
    //alles wird unterhalb gemacht
  }  
}

var myWin;

function open_app(men_id, adr, p_breite, p_hoehe, fensterMax, eltern_men_id, is_htm, x_flag, nr,ev=0) {
  var rueck_adr = "";
  var htm_flag = 0;

  make_html_flag=(p_hoehe==1) ? "_s":"";
  
  if (adr.indexOf("timer=1") > 0) {
    var dt = new Date();
    adr = adr.replace(/timer=1/, "timer=" + dt.getSeconds())
  }

  akt_bild = nr;
  // if (shiftFlag) {
  //   fensterMax = 1;
  //   shiftFlag = false;
  // }
  altK=0;
  if (ev!=0) {
    if (ev.shiftKey) {
      fensterMax=1;
    }
    if (ev.altKey) {
        navigator.clipboard.writeText("https://men.baa.at/?men=digi.case.dlpl&open="+men_id);
    }  
  }

  //console.log("ctrl", ctrlFlag);
  //alert(eltern_men_id);
  // m_id = men_id;
  // = eltern_men_id;

  //verzweigung
  var flagExit = false;
  switch (adr) {
    case "editor.php":
      //alert(elt_men_id);
      var men_id_sel = $("#last_open").val();
      // alert(men_id_sel);
      if (elt_men_id) {
        adr = "editor.php?" + Math.random() + "&hpt_id=" + elt_men_id + "&men_user_id=" + $("#mid").val() + "&men_id_sel=" + men_id_sel;
      } else {
        adr = "editor.php?" + Math.random() + "#" + elt_men_id + "&men_user_id=" + $("#mid").val() + "&men_id_sel=" + men_id_sel;
      }

      // set_hoehe(0, "100%");
      show_haupt(adr, false,"editor");
      flagExit = true;
      break;

    case "https://baa.at":
      window.parent.document.location.href = adr;
      flagExit = true;
      break;

    case "pass":
      //m_breite = p_breite;
      //m_hoehe = p_hoehe;
      m_fenster = fensterMax;

      $("#passwort").popup("open");
      $("#pw").focus();
      flagExit = true;
      break;

    case "":
      if (is_htm) {
        
        let ruf_adr  = "make_html"+make_html_flag+".php?m_id=" + men_id; //geädnert von m_id auf men_id
        if (fensterMax) {
          myWin = window.open(ruf_adr, "_blank");
          myWin.focus();
        } else {
          console.log("einmal:",make_html_flag )
          show_haupt(ruf_adr, 0,"open_app case");
        }
      }
      break;

    default:
      m_id = men_id;
      elt_men_id = eltern_men_id;

      m_breite = p_breite;

      if (men_id === -9) { // menü zurück button
        men_id = 0;
        rueck_adr = $("#aufruf_prg").val();
        if (rueck_adr > " ") {
          adr = rueck_adr;
          window.parent.close(1);
          flagExit = true;
          // return -1
          break;
        }
      }
      adr = get_http(adr);
  }
  if (flagExit) {
    return
  } else {
    
    if (adr > " ") {
      if ((adr.indexOf("menu.baa.at") > -1)) {
        if (adr.indexOf("?") > -1) {
          adr = adr + "&ret=1";
        } else {
          adr = adr + "?ret=1";
        }
      }

      if (fensterMax) {
        var chg = 1;
        if (p_breite == -1) { //info dass man zum neuen menü kommt
          if (!confirm("Dieser Link führt zu einer neuen Informationseite, möchten Sie das Menü wechseln?")) {
            chg = 0;
          }
        }
        if (adr.indexOf("?rnd") > -1) {
          adr = adr + "=" + Math.random();
        }
        
        if (chg) {
          open_max(adr);
        }

        if (myWin) {
          myWin.focus();
        }

      } else { //fensterMin
          if ((http_prot == "https:") && (adr.substr(0, 5) == "http:")) {
            // console.log("open_max 0") 
            open_max(adr);
          } else {
            if (adr.indexOf("?rnd") > -1) {
              adr = adr + "=" + Math.random();

            }
            // console.error("von open_app:",adr,is_htm)
            show_haupt(adr, is_htm,"open_app fenstermax");
          }
        //}
      }
    } else { //adr>" "

    }
  }
}
let last_href="";
function open_max(adr) {
  if (adr.indexOf("ret=1") > -1) {
    show_haupt("make_html"+make_html_flag+".php?m_id=20554&edit_sperre=1&men_adr=" + encodeURIComponent(adr), 0,"openmax1");

    if (isSafari) {
      myWin = window.open(adr);
      show_haupt("make_html"+make_html_flag+".php?m_id=20555", 0,"openmax safari");
    } 

  } else {
    //nicht immer neue reiter öffnen?
    
    let altWin=true;
    if (myWin) {
      if (myWin.closed) {
        altWin=false;
      }
      if (adr.split("?")[0]!=last_href) {
        altWin=false;
      }
    } else {
      altWin=false;
    } 
    
    if (altWin) {
      myWin.location.href = adr;
      myWin.focus();
    } else {
      myWin = window.open(adr);
    }
    last_href=adr.split("?")[0];
    
  }
}



var myIntv = 999;
function show_haupt(adr, is_htm,infoflag="") {
  if (!men_20) {
    var wzeit = 0;
    if (is_htm) {
      //      console.log("000");
      wzeit = 0;
      if (m_breite > 0) {
        if (adr > " ") {
          wzeit = m_breite;
        }
      }

      var xadr = "make_html"+make_html_flag+".php?m_id=" + m_id + "&wzeit=" + wzeit;
      parent.frames['men_haupt'].location.href = xadr;
      //document.getElementById('men_haupt').src = adr;
    }
    if (adr > " ") {
      setTimeout(function () {
        open_chk_error(adr, 0);
        parent.frames['men_haupt'].focus();

      }, wzeit * 1000);
    }
    if (m_isMobile) {
      parent.window.scrollTo(0, 0);
      //parent.window.frames['men_haupt'].scrollTo(0, 0);
    }
  } else { //achtung men_20
    // document.getElementById('men_haupt').src = adr;
    //muss noch korrigiert werden 

    if (is_htm) {
 
      adr="make_html"+make_html_flag+".php?m_id=" + m_id;
    }
    
    if ((adr.substring(0,4)!="http") && (adr>"")) {
      adr="lib/"+adr;
    }
    //console.error(parent.document.getElementById('men_haupt').src,"von wo kommt der: ",adr);
    // console.log(infoflag);
    
    if (adr!="") {
      parent.document.getElementById('men_haupt').src = adr;
      //alert(adr);
    }
    
    // open_chk_error(adr, 1);
  }
}

function open_chk_error(adr, neu) {
  try {
    if (!neu) {
      // console.log("adr:",adr)
      // console.log("adr:",decodeURIComponent(adr))
      parent.frames['men_haupt'].location.href = adr;
    } else {
      alert(adr)
      document.getElementById('men_haupt').src = adr;
    }

  } catch (e) {
    if (e instanceof TypeError) {
      console.error("Fehler:", e);
      alert("Fehler: Nicht im Browserfenster darstellbar und neu starten!", e);
      myWin = window.open(adr);
    }
  }
}




// function chk_ctrl_shift(ev, flag) {
//   //console.log(ev.keyCode,flag,ctrlFlag)
//   //if (ev.ctrlKey) {
//   if (ev.keyCode == 91) {
//     ctrlFlag = flag;
//     console.log("Ctrl", flag)
//   }
//   // if (ev.shiftKey) {
//   //   console.log("shift-flag", flag)
//   //   shiftFlag = flag;
//   // }
// }



var bild;
var alt_htm = "";
var a_blaettern = [];

function menue_hide(hide_flag) {
  if (!men_20) {
    var ff = parent.document.getElementById("fset_waag");
    var arr = ff.cols.split(",");
    //console.log(hide_flag,Number(arr[0]));

    var minimiere = 0;
    if (hide_flag == 1) {
      minimiere = 1;
    } else if (hide_flag == -1) {
      minimiere = 0;
    } else {
      if (Number(arr[0]) > 130) {
        minimiere = 1;
      } else {
        minimiere = 0;
      }
    }

    //alert(Number(arr[0])+ " " + minimiere);
    if (minimiere) {
      arr[0] = 120;
      alt_htm = location.href;
      /*
      			bild=$("#logo_bild").val();
      			var htm="<button class='navi' onclick='menue_hide(0)'  ><img src='../assets/images/"+bild+"'/></button><br><br>";
      			a_blaettern=[];

      			var anz=0;
      			if (men_par_id>0) {
      				var obj=$("div[data-par="+men_par_id+"]");
      				jQuery.each( obj, function(index) {
      					if ($(this).html()=="") {
      						a_blaettern[anz]="make_html.php?m_id="+$(this).data("id");
      					} else {
      						a_blaettern[anz]=get_http($(this).html());
      					}
      					//console.log(index,a_blaettern[anz]);
      					anz++;
      				});
      				if (anz>1) {
      					htm+="<button class='navi' onclick='go_page(0)'  ><img id='im_0' src='../assets/images/chevron-anfang.png'/></button>";
      					htm+="<button class='navi' onclick='go_page(-1)' ><img id='im_1' src='../assets/images/chevron-left.png'/></button>";
      					htm+="<button class='navi' onclick='go_page(-1)' ><span id='akt_nr' >"+(akt_bild+1)+"</span></button>";
      					htm+="<button class='navi' onclick='go_page(1)'  ><img id='im_2' src='../assets/images/chevron-right.png'/></button>";
      					htm+="<button class='navi' onclick='go_page(999)'><img id='im_3' src='../assets/images/chevron-ende.png'/></button>";
      				}
      			}

      			$("#content").html(htm);

      			$("body").html(htm);
      			$("body").css("overflow-y","hidden")
      			$("body").css("background-color","#333");
      */
    } else {

      arr[0] = breite_ur();
      //alert(breite_ur())
      //$("body").hide();
      //location.href = alt_htm;
    }
    ff.cols = arr.join();
  }
}

function ismobile() {
  
  alert(navigator.platform.toLowerCase());
  if (/android|webos|iphone|ipad|ipod|blackberry|opera mini|Windows Phone|iemobile|WPDesktop|XBLWP7/i.test(navigator.userAgent.toLowerCase())) {
    return true;
  } else
    return false;
}

function is_iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

const getMobileOS = () => {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) {
    return "Android"
  } else if ((/iPad|iPhone|iPod/.test(ua)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return "iOS"
  }
  return "Other"
}


function breite_ur() {
  var t = "15%";
//  if (m_isMobile) t = 200;
  return t;
}


var akt_bild = 0;

function go_page(flag) {
  var anz = a_blaettern.length;
  $("#im_0").show();
  $("#im_1").show();
  $("#im_2").show();
  $("#im_3").show();

  if (flag == 0) {
    $("#im_0").hide();
    $("#im_1").hide();
    akt_bild = 0;
  } else if (flag == 999) {
    $("#im_2").hide();
    $("#im_3").hide();
    akt_bild = anz - 1;
  } else if (flag == -1) {
    if (akt_bild > 0) {
      akt_bild = (akt_bild + flag) % anz;
    }
    if (akt_bild == 0) {
      $("#im_0").hide();
      $("#im_1").hide();
    }
  } else {
    akt_bild = (akt_bild + flag) % anz;
    if (akt_bild == anz - 1) {
      $("#im_2").hide();
      $("#im_3").hide();
    }

  }
  //var adr="http://"+a_blaettern[akt_bild];
  var adr = a_blaettern[akt_bild];
  parent.men_haupt.location.href = adr;
  $("#akt_nr").text(akt_bild + 1);
  /*
  	} else {
  		alert("Keine weitere Seite vorhanden!")
  	}
  */
}


function is_touch_device() {
  return (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}





function open_direkt(men_id, adr, p_breite, p_hoehe, fensterMax, eltern_men_id, is_htm) {
  //var txt=$("#ed_"+men_id).html();
  //$("#ed_"+men_id).html(txt + " !!!Sperre!!!")
  show_haupt("editor_direkt.php?" + Math.random() + "&men_id=" + men_id, 0,"open_direkt");
}

function ent_sperren(men_id) {
  var txt = $("#ed_" + men_id).html();
  //$("#ed_"+m_id).html(txt.substr(0,txt.length-13));
  $("#ed_" + m_id).text("test");
  alert(txt);
}


function aktiviere() {
  myWin.focus();
  //(1);
}

function set_breite(ind, p_br) {
  //console.log(window.name,window.parent);

  if (!men_20) {
    var ff = parent.document.getElementById("fset_waag");
    var arr = ff.cols.split(",");
    arr[ind] = p_br;
    arr[2] = "*";
    ff.cols = arr.join();
    //alert(ff.cols);
  }
}
/*
function set_hoehe(ind, ho) {
  
  if (!men_20) {
    var ff = parent.document.getElementById("fset_haupt");
    var arr = ff.rows.split(",");
    //arr[ind] = ho+"%";
    arr[ind] = ho;
    arr[1] = "*";
    //console.log(arr,ff.rows);
    ff.rows = arr.join();
  }
  
}
*/
/*
function get_breite() {
    var ww = screen.availWidth;
    var ww = screen.width;
    var ww = parent.frames['men_haupt'].document.body.offsetWidth;
}
*/
function get_breite() {
  // var ww = screen.availWidth;
  // var ww = screen.width;
  return parent.frames['men_haupt'].document.body.offsetWidth;
}

function get_hoehe() {
  // var ww = screen.availWidth;
  // var ww = screen.width;
  return parent.frames['men_haupt'].document.body.offsetHeight;
}

var last_click = 0;

function set_kekse(nr) {
  //setCookie("last_open", nr, 100)
  //alert($("#men_name").val() + "last_open")
  var nn = $("#men_name").val().replace(".", "_");
  setCookie(nn + "last_open", nr, 100);
  $("#li" + nr).css("border", "2px solid blue");
  if (last_click > 0) {
    $("#li" + last_click).css("border", "none");
  }
  last_click = nr;
  $("#last_open").val(nr);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
  //alert(document.cookie);
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0)
      return c.substring(name.length, c.length);
  }
  return "";
}

function chk_pw(flag) {
  $("#passwort").popup("close");
  //alert(m_id + " " + $("#pw").val());
  //parent.frames['men_haupt'].document.location.href="warte.html";
  var muid = $("#muid").data("muid");

  $.ajax({
    type: "POST",
    url: "pw_check.php",
    data: {
      flag_pw_art: flag,
      men_id: muid,
      pw: $("#pw").val()
    },
    success: function (phpData) {
      if (phpData > "") {
        //alert(">"+phpData+"<");
        if (phpData === "1") {
          if (flag === 0) {

          }
          if (flag === 1) {
            //adr = phpData;
            var adr = "editor.php";
            open_app(muid, adr, 0, 0,0, 0, 0, 0, 0,0,0);
          }
        } else {
          alert("Falsches oder kein Passwort angegeben!");
        }
      }
    }
  });
}

function html_anzeige() {
  show_haupt(adr, 0),"htmlanzeige";
}


function set_cook(p_id, is_htm, men_breite,men_hoehe, men_link, max_fenster, ev) {
  //console.log(p_id, is_htm, men_breite, men_link, max_fenster, ev)
    
  make_html_flag=(men_hoehe==1) ? "_s":"";

  m_breite = men_breite;
  m_id = p_id;
  let weiter_flag = 1;
  
  if (m_admin == 1) {
    if (((ev.metaKey) || (ev.ctrlKey)) && (is_htm)) {
      //console.log(m_id,"",0,0,2,m_id,is_htm,1,0);
      set_kekse(m_id);
      open_direkt(m_id, "", 0, 0, 2, m_id, is_htm, 1, 0);
      weiter_flag = 0;
    }
    if ((ev.altKey) && (is_htm)) {
      navigator.clipboard.writeText("https://men.baa.at/?men=digi.case.dlpl&open="+p_id);
    }
  }

  if (weiter_flag) { //kein opendirekt
    men_par_id = Math.abs(m_id);
    akt_bild = -1;
    //console.log("men_par_id: ",men_par_id)
    // if (!win_orient) {
      if (m_id > 0) {
  
        elt_men_id = m_id;
        set_kekse(m_id);
      } else {
        m_id = Math.abs(m_id);
      }
      if (men_link) {
          men_link = get_http(men_link);
      }

      if (is_htm) {
       
        show_haupt(men_link, 1,"setcookie 1"); 
      } else {
        if (ev.shiftKey) {
          max_fenster=1;
        }
        if (max_fenster) {
          //myWin = window.open(men_link, "_blank");
          //myWin.focus();
          open_max(men_link);
        } else {
          show_haupt(men_link, 0,"setcookie 2");
        }
      }
      //console.log("xxx",weiter_flag,p_id, is_htm, men_breite,"men_link:",men_link,"win_orient:",win_orient);
    // } else {

    //   console.log("yyy",weiter_flag,p_id, is_htm, men_breite,"men_link:",men_link,"win_orient:",win_orient);

    //   show_haupt("about:blank", 0,"nicht normflag");
    //}

  }
}


var tmp = "";

function show_db_dialog(m_id) {
  $.ajax({
    type: "GET",
    url: "make_html"+make_html_flag+".php",
    data: {
      m_id: m_id,
      dialog_flag: 1
    },
    success: function (phpData) {
      if (phpData > "") {
        tmp = phpData;
        //setTimeout("alert(tmp);", 1000);
        //alert(phpData);
      }
    }
  });
}

function go_app(prg) {
  window.open(prg);

}

/*
function runScript(e, id) {
	//console.log(e.keyCode)
	var kk = 17
	if (e.which === kk || e.keyCode === kk) {
		event.preventDefault();
		var adr = "http://baa.menu.baa.at/lib/page.php?p=" + id;
		prompt("Diese Adresse kann als Link auf diesen Menüpunkt verwendet werden", adr);
		return false;
	} else {

	}
}
*/
function get_http(adresse) {
  /*
  if ((adr.indexOf("www") === -1) && (adr.indexOf("htt") === -1)) {
    adr = prot+"//" + adr;
  }
  */
  var ret = adresse;
  if (adresse > " ") {
    var anfang = adresse.substr(0, 3);
    // if (anfang != "../")  {
    if (anfang.indexOf("./")==-1)  {
      if ((anfang != "htt")) {
        if ((anfang == "/kc") || (anfang == "/do"))  {
           ret = ".." + adresse;
        } else {
          ret = "https://" + adresse;
        }
      }
    }
  }

// console.log(adresse)
//     if ((anfang !== "docs") && (anfang !== "/kcf") && (anfang !== "http")) {
//       ret = http_prot + "//" + adresse;
//     } else {
//       if (anfang == "docs") {
//         ret = "../" + adresse
//       }
//     }
//     if (anfang == "../k") {
//       console.log(location.host)    
//     }
    
//   }

  return ret;
}





function menue_hide_versuch(hide_flag) {
  if (!men_20) {
    var ff = parent.document.getElementById("fset_waag");
    var arr = ff.cols.split(",");

    //console.log(hide_flag, Number(arr[0]));

    var minimiere = 0;
    if (hide_flag == 1) {
      minimiere = 1;
    } else if (hide_flag == -1) {
      minimiere = 0;

    } else {

      if (Number(arr[0]) > 50) {
        minimiere = 1;
      } else {
        minimiere = 0;
      }
    }

    //alert(Number(arr[0])+ " " + minimiere);
    if (minimiere) {
      arr[0] = 32;
      alt_htm = location.href;

      bild = $("#logo_bild").val();
      var htm = "<button class='navi' onclick='menue_hide(0)'  ><img src='../assets/images/" + bild + "'/></button><br><br>";
      a_blaettern = [];

      var anz = 0;
      if (men_par_id > 0) {
        var obj = $("div[data-par=" + men_par_id + "]");
        jQuery.each(obj, function (index) {
          if ($(this).html() == "") {
            a_blaettern[anz] = "make_html"+make_html_flag+".php?m_id=" + $(this).data("id");
          } else {
            a_blaettern[anz] = get_http($(this).html());
          }
          //console.log(index,a_blaettern[anz]);
          anz++;
        });
        if (anz > 1) {
          htm += "<button class='navi' onclick='go_page(0)'  ><img id='im_0' src='../assets/images/chevron-anfang.png'/></button>";
          htm += "<button class='navi' onclick='go_page(-1)' ><img id='im_1' src='../assets/images/chevron-left.png'/></button>";
          htm += "<button class='navi' onclick='go_page(-1)' ><span id='akt_nr' >" + (akt_bild + 1) + "</span></button>";
          htm += "<button class='navi' onclick='go_page(1)'  ><img id='im_2' src='../assets/images/chevron-right.png'/></button>";
          htm += "<button class='navi' onclick='go_page(999)'><img id='im_3' src='../assets/images/chevron-ende.png'/></button>";
        }
      }

      $("#content").html(htm);
      $("body").html(htm);
      $("body").css("overflow-y", "hidden")
      $("body").css("background-color", "#333");

    } else {
      arr[0] = breite_ur();
      $("body").hide();
      location.href = alt_htm;
    }
    ff.cols = arr.join();
  }
}


function resize_baa() {
  var ww = $(window).width();
  //var wh = $(window).parent().height();
  //console.log(window.parent.innerHeight);
  //wh=window.innerHeight-20;
  var ww = window.parent.innerWidth;
  var wh = window.parent.innerHeight;



  wh = wh - 20;
  var rand = 8;
  var men_w = 320;
  
  var linien_add = 80;

  var hpt_w = ww - men_w - rand - linien_add;

  // var men_w = 120;

  //$("iframe").height(wh-2);
  console.log(men_20,ww,men_w,$(window).width(120))
  if (men_20) {
    alert(111)
    window.parent.set_menue_breite("17%");
    // $("#men_menue")
    //   .height(wh - 2)
    //   .width(men_w)
    //   .css("margin-right", rand * 5);

      //$("#seite").height(wh-2-80);

    //$("#men_haupt").height(wh - 2)
      // .width(Math.min(1024, hpt_w));

  } else {
    if (wh > ww) { //hochformat
      // b_men_hide();
      $("#mensmall").show();
      //console.log("ja")
    }
  }
}

function same_origin () {
  var sameOrigin;
  try {
    sameOrigin = parent.frames['men_haupt'].document;
  }
  catch (e) {
    sameOrigin = false;
  }
  return sameOrigin;
}

function set_edit_yes_no(flag, bg,fb) {
	//console.log("schalter ---- ",flag)
	$("#ea").text("Editable is " + flag)
		.css("background", bg)
		.css("color", fb);
}

function edit_yes_no(chg) {
	if (chg) {
		edit_inline = (Number(edit_inline) + 1) % 2;
		setCookie("edit_inline", edit_inline, 1);
	}
  if (same_origin()) { //teste, damit kein fehler bei fremdseiten auftaucht
    var elem = $(".baaContainer", parent.frames['men_haupt'].document);
    if ($(elem)) {
      var sperre = parent.frames['men_haupt'].edit_sperre;
      console.log("sperre",sperre)   
      if (sperre == "1") {
        alert("Editieren nicht erlaubt!");
        edit_inline = 0;
      }
      var bg = "none";
      console.log("edityesno: chg:",chg,"vor",edit_inline, "(edit_inline)");
      setTimeout(() => {

        var fb = "#888";
        var t_ed = (edit_inline ? "true" : "false");
        if (edit_inline) {
          $("#baaContainer_edit_button", parent.frames['men_haupt'].document).show();
          bg = "green";
          fb = "#fff";
        } else {
          try {
            $("#baaContainer_edit_button", parent.frames['men_haupt'].document).hide();
          }
          catch (e) {
            console.log("Leider ein Fehler");
          }
          
          
        }
        $(elem).attr("contentEditable", t_ed);
        set_edit_yes_no(t_ed, bg,fb);
        //console.log($(elem), $(elem).attr("contentEditable"));
        if (chg) {
          parent.frames['men_haupt'].document.location.reload();
        }
      }, 100);
    } else {
      set_edit_yes_no(false, "none");
    }
  }
}

function show_camera() {
  var windowObjectReference;
  //3264 x 2448
  // var windowFeatures = "width=408,height=314,menubar=no,location=no,resizable=no,scrollbars=no,status=no,toolbar=no";
  // var windowFeatures = "width=816,height=628,menubar=no,location=no,resizable=yes,scrollbars=no,status=no,toolbar=no";
  const param = ",toolbar=No,location=No,scrollbars=no,status=No,resizable=No,fullscreen=no";

  let x_add = 8
  let w_breite = 640 + x_add;
  let w_hoehe = w_breite * 0.58 + 5;
  var windowFeatures = "width=" + w_breite + ",height=" + w_hoehe + param;
  //",menubar=no,location=no,resizable=yes,scrollbars=no,status=no,toolbar=no";
  // var windowFeatures = "popup" 
  // console.log(windowFeatures)
  //windowObjectReference = window.open("js/show_camera.html", "Videofenster", windowFeatures).focus();
  windowObjectReference = window.open("js/obs_baa.html", "Videofenster", windowFeatures).focus();
}

function show_camera2() {
  var windowObjectReference;
  //3264 x 2448
  // var windowFeatures = "width=408,height=314,menubar=no,location=no,resizable=no,scrollbars=no,status=no,toolbar=no";
  // var windowFeatures = "width=816,height=628,menubar=no,location=no,resizable=yes,scrollbars=no,status=no,toolbar=no";
  const param = ",toolbar=No,location=No,scrollbars=no,status=No,resizable=No,fullscreen=no";

  let x_add = 8
  let w_breite = 640 + x_add;
  let w_hoehe = w_breite * 0.58 + 5;
  var windowFeatures = "width=" + w_breite + ",height=" + w_hoehe + param;
  //",menubar=no,location=no,resizable=yes,scrollbars=no,status=no,toolbar=no";
  // var windowFeatures = "popup" 
  // console.log(windowFeatures)
  //windowObjectReference = window.open("js/show_camera.html", "Videofenster", windowFeatures).focus();
  windowObjectReference = window.open("js/show_camera.html", "Videofenster", windowFeatures).focus();
}


function b_men_hide() {
  var ff = parent.document.getElementById("fset_waag");
  let men = parent.document.getElementById("men_menue");
  var arr = ff.cols.split(",");
  if (Number(arr[0]) > 100) {

    //console.log($(men).attr("scrolling"));
    $(men).attr("scrolling", "no")
    arr[0] = 36;
    arr[0] = 12;
  } else {
    $(men).attr("scrolling", "yes")
    arr[0] = 232;
  }
  ff.cols = arr.join();
}

function starte_suche() {
  let txt=$("#such_filter").val().toUpperCase();
  if (txt>"") {
    txt=txt.trim();
    if (txt.charAt(0)=="B") {
      txt=txt+")";
    }

    //window.location.search += '&such_text='+txt.substr(0,30);
    let stxt=window.location.search;
    let a_tmp=stxt.split("&");
    //console.log("bevor:",a_tmp[0]+'&such_text='+txt.substr(0,5))
    window.location.search = a_tmp[0]+'&such_text='+txt.substr(0,5);
  }
}


function get_fc_ress(obj) {


}