// JavaScript Document
var alt_nr = 0;
var top_abstand = 0;
var flag_kopie = 9;
var flag_loesch = 8;
var last_hsh = "";
var close_frage = false;
var alt_men_sort = 0;
var ruf_flag = 0;
var last_timeout = 0;
var erst_lauf=1; //neu 2022


$(document).ready(function() {
  var hpt_id = $("#hpt_id").val();
  $(".ues_butt").button();
  $("#message").hide();
  $(".b_move").button({ text: false });

  $(".kop").button({ icons: { primary: "ui-icon-copy" } });
  $(".del").button({ icons: { primary: "ui-icon-trash" } });
  $(".ues").button({ icons: { primary: "ui-icon-arrow-2-e-w" } });
  $(".mover").button({ icons: { primary: "ui-icon-arrow-4" } });

  $("table tbody").sortable({
    handle: ".mover",
    cancel: "",
    axis: "y",
    placeholder: "platzhalter",

    stop: function(event, ui) {
      var f_tr = ui.item.closest("tr");
      var p_tr = f_tr.prev().find(".bb");
      //achtung ausserhalb von tr darf nichts stehen
      //console.log(f_tr.attr("id"),f_tr.prev(),p_tr.attr("id"),p_tr.length,$(p_tr).val(),p_tr.val());
      if (p_tr.length) {
        f_tr.find(".bb").val(Number($(p_tr).val()) + 2);
        f_tr.find(".bb").trigger("change");
      }
      //$(this).enableSelection();
      //console.log(p_tr.length,p_tr.val());
    }
  });

  if ($("#chkx").prop("checked")) {
    zusatz_view(1);
  }

  if ($("#men_id").val()) {
    men_id = $("#men_id").val();
    make_edit(men_id);
    //$("#z"+men_id+" td").css("border","3px solid red");
  }

  /*
    CKEDITOR.on('instanceReady', function (evt) {
        var editor = evt.editor;
        editor.execCommand('maximize');

    })
*/

  CKEDITOR.on("instanceReady", function(evt) {
    var editor = evt.editor;
    //console.log(editor.name);
    var men_id = editor.name.substr(9);
    editor.on("resize", edit_resizen);
    editor.execCommand("maximize");

    //clearTimeout(last_timeout);
    //last_timeout=setTimeout(function() {
    //	alert(men_id);
    //	console.log("wer",evt);
    einlesen(men_id, evt);
    //},1000);


    //super wird der dirtyFlag zurückgesetzt
    clearTimeout(last_timeout);
    last_timeout=setTimeout(function() {
      editor.resetDirty();
    },200);
  });

  close_frage = true;
  $(window).bind("beforeunload", function(evt) {
    for (var k in CKEDITOR.instances) {
      //console.log(CKEDITOR.instances[k].checkDirty());
      var instance = CKEDITOR.instances[k];
      if (close_frage && CKEDITOR.instances[k].checkDirty()) {
        return "Achtung - Seite ist noch nicht gespeichert - bitte warten!";
      } else {
      }
    }
  });


  // edi.editor.resetDirty();
  // alert(edi.editor.checkDirty());


  /*
  setInterval(function() {
    console.log($("#men_user_id_baa").val(),getMinuten()-startTime);
  }, 5000);
  */

});

var ww = 0;
var ues_karte = "";
function edit_resizen(p_event) {
  //console.log(p_event);
  var editor = p_event.editor;
  //console.log(parent.fakt,parent.parent.fakt);
  //clearTimeout(last_timeout);
  //last_timeout=setTimeout(function() {
  $elem = $("<div></div>").html(editor.getData());
  var anz = $elem.find(".mcard").length;

  if (anz > 0) {
    var alt_check_dirty = check_is_dirty();
    //console.log(alt_check_dirty);
    var wbreite = p_event.data.outerWidth - 8 * 2 - 20;
    //wbreite = $(".header").width() - 24 * 2 - 20; 12.8.
    wbreite = $(".header").width() - 20 * 2;
    //var wbreite=$(window.parent).width()-24*2-20;

    var cw = wbreite * prozBreite;
    fakt = 0.7; // kommt von anderwo auch noch
    //fakt=0.6;
    var ch = cw * fakt;
    var zus = "";
    $elem.find(".mcard").each(function() {
      $(this)
        .css("font-size", ch / schriftTeiler)
        .width(cw)
        .height(ch);

      zus = "(Rückseite) ";
      zus = "";
    });

    editor.setData($elem.html());
    //.find("tr th").first().html(zus+"xxx");)
    if (erst_lauf)
      if (close_frage) {
        if (alt_check_dirty === 0) {
          close_frage = false;
        }
      }
    if (erst_lauf) close_frage = false;
    erst_lauf = 0;
  } else {
    //alert("leer");
  }
  //},200);
  //messe_zeit();
}

var startTime=getMinuten();
function messe_zeit() {
  setInterval(function() {
    console.log(m_id,getMinuten()-startTime);
  }, 5000);
}

function getMinuten() {
  var minutes = 1000 * 60;
  /*
  var hours = minutes * 60;
  var days = hours * 24;
  var years = days * 365;
  */
  var d = new Date();
  var t = d.getTime();
  return Math.round(t/minutes);
}


function einlesen(m_id, edi) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "get_html_seite.php",
    data: {
      m_id: m_id
    },
    success: function(phpData) {
      if (phpData > "") {
        var ues_karte = phpData.men_button;
        var $elem = $("<div></div>").html(phpData.men_html);
        var zus = "";
        $elem.find(".mcard").each(function(index) {
          erstes_zch = ues_karte.charAt(0);
          if (erstes_zch != "-") {
            if (
              $(this)
                .find("tr th")
                .first()
                .html() !==
              zus + ues_karte
            ) {
              //alert($(this).find("tr th").first().html());

              if (
                "Arbeitsvorlage Online-Übungen".indexOf(
                  $(this)
                    .find("tr th")
                    .first()
                    .text()
                ) == -1
              ) {
                $(this)
                  .find("tr th")
                  .first()
                  .html(zus + ues_karte);
              }
            }
            //zus = "(Rückseite) ";
            zus = "";
          }
          $(this).attr("id", "mc" + index);
          //console.log($(this));
          /*
                    $el_th=$(this).find("th").first();
                    console.log($el_th,$el_th.css("width"));
                    alert($el_th.width());
                    */
        });

        edi.editor.setData($elem.html());
        //alert(-1);

        //
        // clearTimeout(last_timeout);
        // last_timeout = setTimeout(function() {
        //   $(edi.editor).trigger("resize");
        // }, 200);


        //alert("data");
        //edit_resizen(edi);
        //setTimeout(init, 100);
      }
    }
  });
}

function editor_instance_aus() {
  //console.log("aus ob:"+Object.keys(CKEDITOR.instances).length);
  //var chk_anz=Object.keys(CKEDITOR.instances).length;

  for (var k in CKEDITOR.instances) {
    var instance = CKEDITOR.instances[k];
    instance.destroy();
  }
  //console.log("aus un:"+Object.keys(CKEDITOR.instances).length);
}

function switch_ues(obj, mid, men_flag) {
  a_ues_farben = ["#fff", "#ff9900", "#BCCFE5", "#E6EEAE", "#FCE5CD"];
  var men_ues_level = (Number($(obj).data("menues")) + 1) % 4;
  $("#z" + mid).css("background-color", a_ues_farben[men_ues_level]);
  $(obj).data("menues", men_ues_level);
  $.ajax({
    type: "POST",
    url: "menue_save.php",
    data: {
      men_user_id: $("#men_user_id").val(),
      men_flag: men_flag,
      men_ues_level: men_ues_level,
      men_id: mid
    },
    success: function(phpData) {
      if (phpData > "") {
        alert(phpData);
      }
    }
  });
}

function mld_saved() {
  alert("saved");
}

function get_breite() {
  mw = $(window).width();
  mh = $(window).height();
  alert(mw);
}

function refreshen() {
  //alert(alt_nr);
  setTimeout(function(){
    parent.men_menue.location.reload();
    win_reload(0);
  }, 100);
}

function win_reload(alle) {
  alle_flag = "";
  if (alle) {
    alle_flag = "&alle=1";
    setCookieHours("alle","1", 0.1); //6 minuten
  }

  if (top_abstand > 0) {
    var d = new Date();
    var n = d.getSeconds();
    //	var adr=window.location.pathname+"?pseudo="+n+"#t"+(alt_nr-3);
    //	var adr=window.location.pathname+"?pseudo="+n+"&baa_hash=t"+(top_abstand - 64)+"#t"+(top_abstand - 64);
    var adr =
      window.location.pathname +
      "?pseudo=" +
      n +
      "&baa_hash=t" +
      (top_abstand - 64) +
      "#t" +
      (top_abstand - 64);
    //		var adr=window.location.pathname+"#t"+(alt_nr-3);
    //		var adr="#t"+(alt_nr-3);

    //window.location.hash="editor.php?pseudo="+n+"#t"+(alt_nr-3);
    //window.location.reload(1);

    //alert("adr:"+adr);
    window.location.href = adr + alle_flag;
  } else {
    //window.location.reload();
    window.location.href = window.location.href + alle_flag;
  }
}

function admin_logout() {
  window.parent.location.href = window.parent.location.href + "&admin=0";
}


function view_pw() {
  if ($(".pass").attr("type") == "password") {
    $(".pass").attr("type", "text");
  } else {
    $(".pass").attr("type", "password");
  }
}

function men_zusatz(obj) {
  var vis = $(obj).prop("checked");
  zusatz_view(vis);
}

function zusatz_view(vis) {
  if (vis) {
    //$('.edi').ckeditor();

    $(".verstecke").show();
    $(".fein").width("50%");
    $(".hpt").addClass("linien");
    var tmp = "1";
  } else {
    //		editor_instance_aus();
    $(".verstecke").hide();
    $(".hpt").removeClass("linien");
    var tmp = "0";
  }
  setCookieHours("zusFelder", tmp, 1);
}

function men_test(obj) {
  //$(window).parent().
  console.log(window.parent.men_menue.innerWidth);
}

function setCookieHours(cname, cvalue, exhours) {
  var d = new Date();
  d.setTime(d.getTime() + exhours * 60 * 60 * 1000 );
  var expires = "expires=" + d.toGMTString();
  alert(expires);
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function open_editor(men_id, obj, hnd) {
  //alert($('#men_html_'+nr).html());
  //derzeit inaktiv
  men_save(men_id, obj, "sp", hnd);

  //alert($('#men_html_'+nr).ckeditor().getDate());
  //if (flag) {
  //editor_instance_aus();

  //		$('#men_html_'+nr).ckeditor();

  //alert($('#men_html_'+nr).ckeditor().getValue);

  /*
     $('#men_html_'+nr).ckeditor(
     function() {alert(4);},
     { uiColor : '#9AB8F3' }
     );
     //}
     */
}

var m_id = 0;
function make_edit(men_id) {
  if (window.event.ctrlKey) {
    link_extern(men_id);
  } else {
    m_id = men_id;
    $("#men_html_" + men_id).ckeditor();
  }
}

function editor_schliessen() {
  //editor.execCommand('maximize');
  editor_instance_aus();
  $("#men_html_" + m_id).hide();
}

function editor_schliessen() {
  //editor.execCommand('maximize');
  /*
    var zeit=0;
    if (navigator.userAgent.match(/firefox/i)) zeit=1000;
*/
  //    setTimeout(function() {
  editor_instance_aus();

  if (!ruf_flag) {
    $("#men_html_" + m_id).hide();
  } else {
    location.href = "make_html.php?m_id=" + m_id;
  }

  //    },zeit);

  //alert($("#men_html_" + m_id).html());
}

function doppel_klick(obj) {
  var feld = $(obj).attr("id");
  feld = feld.substr(0, feld.lastIndexOf("_"));
  if (feld == "men_sort") {
    //nr=($(obj).val().trim())+1;
    if (alt_men_sort > 0) {
      alt_men_sort++;
      $(obj).val(alt_men_sort);
      $(obj).trigger("change");
    } else {
      alt_men_sort = $(obj).val();
    }
  }
}
var ziel_men_user_id=0;
var nachher_close = 0;
function men_save(men_id, obj, men_flag, hnd,e) {
  var fehler = 0,
    riese = 0;
  var a_send = {};
  a_send["men_user_id"] = $("#men_user_id").val();
  a_send["men_flag"] = men_flag;
  a_send["men_id"] = men_id;
  a_send["ctrl_flag"] = "0";

  switch (men_flag) {
    case "kop":
      if ((event.ctrlKey) || (event.shiftKey) || event.metaKey) {
        //if (ziel_men_user_id==0) {
          var antw = prompt ("Geben Sie die Ziel_men_user_id an:",ziel_men_user_id);
          if (antw != null) {
            a_send["ctrl_flag"] = antw;
            if (a_send["ctrl_flag"]=="0") {fehler=1;}
            ziel_men_user_id=a_send["ctrl_flag"];
          } else {
            fehler=1;
          }

        //}
      }
      break;
    case "ren":
      a_send["schritt_fakt"] = hnd;
      
      $(document).css("cursor", "wait");
      break;

    case "del":
      if (confirm("Soll diese Zeile gelöscht werden?") == false) {
        return;
      }
      break;
    case "sp":
      var feld = $(obj).attr("id");
      feld = feld.substr(0, feld.lastIndexOf("_"));

      if (feld == "men_sort") {
        alt_men_sort = $(obj).val() * 1;
      }

      if (feld == "men_link") {
        if ($(obj).val().indexOf("://youtu.be/") > 0) {
          var p = $(obj).val().lastIndexOf("/") + 1;
          var tmp = $(obj).val().substr(p, 99);

          $(obj).val("https://www.youtube.com/embed/" + tmp + "?rel=0");
        }
        if ($(obj).val().indexOf("youtube.com/watch") > 0) {
          var a_tmp = $(obj).val().split("="); 
          $(obj).val("https://www.youtube.com/embed/" + a_tmp[1] + "?rel=0");
        }
        if (
          $(obj)
            .val()
            .indexOf("://makecode.microbit.org/_") > 0
        ) {
          if (
            $(obj)
              .val()
              .indexOf("#pub:") < 0
          ) {
            var p =
              $(obj)
                .val()
                .lastIndexOf("/") + 1;
            var tmp = $(obj)
              .val()
              .substr(p, 99);
            $(obj).val("https://makecode.microbit.org/#pub:" + tmp);
          }
        }
        /* wir nun bei renum gemacht
            if ($(obj).val().indexOf("menu.baa.at") > 0) {
            alert($("#men_button_"+men_id).val())
                if ($("#men_button_"+men_id).val().indexOf("M: ")!=0) {
                    alert(31);
                    $("#men_button_"+men_id).val("M: "+ $("#men_button_"+men_id).val());
                }
            }
            */
      }

      a_send["feld"] = feld.trim();
      if (feld == "men_fenster" || feld == "men_hide" || feld == "men_druck_button" || feld == "men_edit_erlaubt") {
        a_send[feld] = Number($(obj).prop("checked"));
        if (feld == "men_hide") {
          var farb;
          if ($(obj).prop("checked")) {
            farb="#bbb";
          } else {
            farb="#000";
          }
          $("#men_link_" + men_id).css("color", farb);
          $("#men_button_" + men_id).css("color", farb);
          $("#men_druck_button_" + men_id).css("color", farb);
          $("#men_edit_erlaubt_" + men_id).css("color", farb);

        }
      } else {
        if (feld == "xxxmen_html") {
          a_send[feld] = $(obj)
            .html()
            .trim();
        } else {
          a_send[feld] = $(obj)
            .val()
            .trim();
        }
        var ll = a_send[feld].length;
        if (ll > 1000000) {
          fehler = 1;
          alert("Achtung - zu groß: " + a_send[feld].length);
        } else if (ll > 200000) {
          close_frage = true;
          //alert("Bitte den Warten-Button abwarten!");
        }
      }
      break;

    default:
      if (hnd > 0) {
        top_abstand = Math.round($("#t" + hnd).offset().top);
      }
  }
  //console.log(a_send);
  if (!fehler) {

    $.ajax({
      type: "POST",
      url: "menue_save.php",
      data: a_send,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(
          "An error occurred",
          XMLHttpRequest,
          textStatus,
          errorThrown
        );
      },
      success: function(phpData) {
        //alert(phpData)
        if (nachher_close) {
          editor_schliessen();
        }

        //console.log(phpData);
        if (phpData > "") {
          //$("#infobaa").append(phpData)

          var neu_nr = phpData;
          if (close_frage) {
            close_frage = false;
            win_reload(0);
            //editor_schliessen();
          } else if (neu_nr == "ren") {
            //alert("reload");
            //if (window.console) console.log(time());
            parent.men_menue.location.href =
              parent.men_menue.location.href + "?editor=1";
            //parent.men_menue.location.reload(1);
            //window.location.reload(1);
            win_reload(0);
          } else if (neu_nr == "ren") {
            alert("Neunummerierung abgeschlossen");
            $(document).css("cursor", "default");
            win_reload(0);
          } else if (Number(neu_nr) > 0) {
            alert(phpData);
            //$("#men_id_"+nr).val(neu_nr);
          } else {
            alert(phpData);
          }
        }
        nachher_close = 0;
      }
    });
  }
}

function show_message() {
  $("#message").css("z-index",9999).show();

  setTimeout(function(){
      $("#message").hide();
  },000);
}

function zwischen_save(edi) {
  var a_send = {};
  //console.log(m_id,edi.getData());

  a_send["men_user_id"] = $("#men_user_id").val();
  a_send["men_flag"] = "sp";
  a_send["men_id"] = m_id;
  a_send["feld"] = "men_html";
  a_send["men_html"] = edi.getData();

  $.ajax({
    type: "POST",
    url: "menue_save.php",
    data: a_send,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("An error occurred", XMLHttpRequest, textStatus, errorThrown);
    },
    success: function(phpData) {
      if (phpData > "") {
        alert(phpData);
      } else {
        show_message();
        //alert("saved");
      }
    }
  });
}

function mark_ges(obj) {
  $(obj).select();
}


function link_extern(id) {
  txt=$("#men_link_"+id).val();
  if (txt.indexOf("baa.at")>-1) {
    if (txt.indexOf("m_id")>-1) {
      a_adr=txt.split("/lib/");
      if (a_adr.length>1) {
        adr=a_adr[0];
        nr=a_adr[1].split("m_id=")[1];
        link_adr=adr+"/?open="+nr+"&alle=1";
        //console.log(link_adr)
        popitup(link_adr)
      }

    }
    
  }

  function popitup(url) {
    newwindow=window.open(url,'extern','height=200,width=150');
    if (window.focus) {
        newwindow.focus()
    }

    if (!newwindow.closed) {
      newwindow.focus()
    }
    return false;
  }
}

function check_is_dirty() {
  var anz = 0;
  for (var k in CKEDITOR.instances) {
    if (CKEDITOR.instances[k].checkDirty()) {
      anz++;
    }
  }
  //alert("dirty:"+anz);
  return anz;
}
