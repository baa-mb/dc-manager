let ab_blatt_flag = 0;
var baa_root=this;
let akt_user_modus = window.parent.getCookie("akt_modus");


window.parent.ablatt_p3 = 0;


// console.log(sessionStorage.getItem("last_wahl_butt"));

baa_root.init = function (prg_art,spalten, splitter, hoehe = 0, edit = 0) {
// function init (spalten, splitter, hoehe = 0, edit = 0, prg = "") {
    // console.log("aw:",prg_art)

    let breite = (Math.round(100 / spalten) - 1) + "%";
    $("body").append(`<div id='page'><h3><span id='titel''>Bitte nun auswählen!</span></h3><div id='cont' class='cont'></div></div>`);    
   

    let css_zus = "background-image: url('../icons/edit_bleist.png')";
    let edit_comment = "Daten bearbeitbar";
    if (a_ablatt[0][0].includes("AB1")) {
        ab_blatt_flag = 1;
        edit_comment = "Einzelseite (S: Schülerseite, L: Lehrerseite)";
        css_zus = "background-image: none";
    }

    let trenn_nr=0;
    // $("#cont").append(`<div id='trenner0' class='sstufe_trenner'>Schulstufe ${trenn_nr+1}</div>`);    

    let last_sstufe="";
    for (var i = 0; i < a_ablatt.length; i++) {
        // alert(a_ablatt.length)        
        let css_border="";
        if ((i % spalten) == 0) {
            // document.write("<br>");
            $("#cont").append("<br>");    
        }

        if (a_ablatt[i][0][0] == ".") { //zeilenumbruch bei []
            let txt=`Schulstufe ${trenn_nr+1}`;
            if (a_ablatt[i][0].length>1) {
                txt=a_ablatt[i][0].substr(1);
            }
            $("#cont").append(`<div id='trenner${trenn_nr}' class='sstufe_trenner'>${txt}</div>`);    
            trenn_nr++;
           
            // $("#cont").append(strenner);    
        } else {

            let par3 = 0;
            if (a_ablatt[i].length == 3) {
                par3 = a_ablatt[i][2];
            }


            let klick_link = `wahl(event,"${prg_art}",${i},"${a_ablatt[i][1]}","${splitter}",${par3})`;

            // console.log(edit,akt_user_modus)
            let wahl_p3_butt = "";
            if ((edit == 1) && (akt_user_modus == 1)) {
                if (ab_blatt_flag) {
                    if (par3) { //nur wenn mehrere seiten sind, also array[2]> 0
                        wahl_p3_butt = `<button class='bleistift' id='stift' style='${css_zus}' title='${edit_comment}'>S</button>`;
                        wahl_p3_butt += `<button class='bleistift b2' id='stift' style='${css_zus}' title='${edit_comment}'>L</button>`;
                    }
                } else {
                    //biberaufgabe editorbleistift
                    wahl_p3_butt = `<button class='bleistift' id='stift' style='${css_zus}' title='${edit_comment}'></button>`;
                }
            } 
            
            let anzeige = "<b>" + a_ablatt[i][0].split(splitter)[0] + "</b><br>" + a_ablatt[i][0].split(splitter)[1];
            $("#cont").append(`<div class='kasten' onclick='${klick_link}'><button id='w${i}' sstufe='${trenn_nr-1}' class='f'>${anzeige}</button>${wahl_p3_butt}</div>`);
        }

    }

    //scrolling zur letzten Position    
    let last=sessionStorage.getItem("last_wahl_butt");
    if (last>0) {
        $("#w"+last).css("border-color","blue");
        if (Number(window.parent.last_sstufe)==trenn_nr-1) {
            $("html, body").animate({ scrollTop: $(document).height()*2 }, 1000);
        } else {
            $("#trenner"+window.parent.last_sstufe)[0].scrollIntoView();
        }
    }


    cont = document.querySelectorAll("div.kasten");
    // console.log(cont)
    cont.forEach(div => {
        div.style.width = breite;
        // if (hoehe > 0) {
            // div.style.height = breite*0.7 ;
        // }
    });

    if (!ab_blatt_flag) {
        let anz = document.querySelectorAll(".bleistift");
        for (i = 0; i < anz.length; i++) {
            anz[i].style.backgroundImage = "url('../assets/icons/edit_bleist.png')";
        }

    }
    // cont.each.style.width="15%";
  
};


function wahl(evt,prg_art, i, id, splitter, par3 = 0) {
    
    let last=sessionStorage.getItem("last_wahl_butt");
    if (last>-1) {
        $("#w"+last).css("border-color","orange");
    }
    $("#w"+i).css("border-color","blue");
    window.parent.last_sstufe=$("#w"+i).attr("sstufe");
    sessionStorage.setItem("last_wahl_butt",i);


    if (prg_art=="LA") {
        window.parent.max_pt=par3;
        if (evt.ctrlKey) {
            let src="https://learningapps.org/"+id;
            wlap=window.open(src,"0");
            wlap.focus();
            return false;
        }   
        if (evt.shiftKey) {
            
            let src="https://baa.at/projekte/versuche/learningApps/zeige_daten.php?id="+id;
            wlap1=window.open(src,"0");
            wlap1.focus();
            return false;
        }   
    }



    if (evt.target.id != "stift") par3 = 0;
    document.getElementById("titel").innerText = "Ausgewählt: " + a_ablatt[i][0];
    // projekt_nr = id;

    // if (ab_flag) {alert(1)}
    ablatt_id = a_ablatt[i][1];
    ablatt_kzz = a_ablatt[i][0].split(splitter)[0];
    



    //nur bei arbblatt
    let seite="";
    let bst=evt.target.innerText;
    if ((bst=="S") || (bst=="L")) {
        let a_tmp=a_ablatt[i][1].split(".pdf");
        seite=a_tmp[0]+"_s"+("SL".indexOf(bst)+1)+".pdf";
        ablatt_id = seite;
        par3=0; //keine nachbehandlung mehr nötig - nciht mehr auf grafik umwandeln
    }
    
    ablatt_p3 = par3;

    // console.log(window.parent)
    // console.log(ablatt_id + "- kzz: " + ablatt_kzz, "par3:", par3, "txt:", evt.target.innerText);

    

    window.parent.ablatt_id = ablatt_id;
    window.parent.ablatt_kzz = ablatt_kzz;
    window.parent.ablatt_p3 = par3;

    if ((par3 == 0) || (ab_blatt_flag)) {
        window.parent.show_zuweis_gruen(1);
    }

    show_ablatt(ablatt_kzz, ablatt_id, par3);
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

