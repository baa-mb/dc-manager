var ist_IOS = 0;

var akt_satznr=-1;

$(document).ready(function () {

  cook_vorspann=$("#php_var").attr("men_user_kzz").replace(/\./g, "_");
 

  $("#such_filter").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      starte_suche();
    }
  });

  // if ($("#last_open").val() > 0) {
  //   elt_men_id = $("#last_open").val();
  // }
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
  // $("#dialog").dialog({
  //   autoOpen: false
  // });

  m_admin = $("#is_admin").val();

  win_orient = 0; //landscape
  $(window).on("orientationchange", function (event) {
    if (window.orientation != undefined) {
      win_orient = (Math.abs(window.orientation % 180) == 0);
    }
  });


  if (m_admin == 1) {
    // $("#such_filter").addClass("sonderhoch");
    edit_inline = Number(getCookie("edit_inline")); //set from cookie
    //alert("Admin-Modus: (bin beim PRG-Ändern - Team - bitte einfach weiterarbeiten) " + m_admin)
    edit_yes_no(0);
  }


  if (getCookie("last_open")) {
    let t_nr = getCookie("last_open");
    let satz = a_men_liste[t_nr];
    //###########################
    if (Number(satz.men_fenster)==1) {
      t_nr = "0";
    }
    console.log("t-nr",t_nr, "fenst:",satz.men_fenster,getCookie("last_open"));
t_nr=2;
    setTimeout(function () {
      last_open_id(t_nr);
    }, 100);
  }



});


// ist_IOS = !!(navigator.userAgent.match(/(iPad)/) || (navigator.platform === "MacIntel" && typeof navigator.standalone !== "undefined"));

ist_IOS = (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
);




var max_restrict = false;
function last_open_id(o_satznr) {
  max_restrict = true;
  // alert("#a"+o_satznr);
  mg_acc.open("#a" + o_satznr);
}

// var last_satznr=-1;
function call_link(satznr) {

  // console.error("ÖFFNE Seite", satznr, max_restrict);
  
  //console.log(satznr, akt_satznr);
  if (satznr==akt_satznr) {
    console.error("Gleich")
    return false; //doppelt ist flackern
  }


  let satz = a_men_liste[satznr];
  //###########################
  let men_id = satz.men_id;
  let adr = satz.men_link;
  let fenster_max = Number(satz.men_fenster);
  let htm = satz.men_html;

  // if (satz.men_blaettern) {
    console.log("men_blaettern",satz.men_blaettern)
    window.parent.blaettern_allow(satz.men_blaettern) 
  // }

  akt_satznr=satznr;

  if (adr > "") {
    if (ist_IOS) {
      if (adr.indexOf(".pdf") > -1) {
        fenster_max = 1;
      }
    }
    anzeige(adr, fenster_max);
  }

  if (htm > "") {
    adr = "lib/make_html.php?m_id=" + men_id;
    anzeige(adr, fenster_max);
  }
  if (!max_restrict) {
    setCookie("last_open", satznr);
  };
  
  max_restrict = false;
}

function anzeige(adr, fenster_max) {
  if (fenster_max) {
    if (!max_restrict) {
      window.open(adr);
    } else {
      //alert("vollbild")
    }
  } else {
    if (adr[0] == ".") { // ../ muss auf ./ umgewandelt werden
      adr = adr.substring(1);
    }
    window.parent.document.getElementById('men_haupt').src = adr;
  }
}


const getMobileOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return "Android";
  } else if ((/iPad|iPhone|iPod/.test(ua)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return "iOS";
  }
  return "Other";
};

function gotoPage(flag) {
  max_restrict=true;
	akt_satznr=akt_satznr+flag;
  call_link(akt_satznr);
}



