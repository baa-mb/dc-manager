
var mg_acc;

$(document).ready(function() {
    $("#navbar").html(htm);
    mg_acc=$('#navbar').mgaccordion();    
    
    $(".ues_lev0").last().parent().addClass("aLastRund")

});

make_menu();

function make_menu() {
    anz=0;
    
    const rechts = /\]R/g;
    const links= /L/g;
    const k_zu= /\]/g;
    
    let level=0,l=0;r=0;
    let last_db_ebene=0;
    let real_ebene=0;
    htm="";
    sam="";
    a_men_liste.forEach(function (a_wert) {
        anz++;
        level=(Number(a_wert['men_ues_level']) + 3) % 4;
        // console.log(anz,level,a_wert['men_id']);

        //console.error("%c=================== next ================="+a_wert['men_button'], 'background: green; color: #bada55');

        richt="nix";
        $info=`${anz}: ziellevel(${level})<>(${real_ebene})last real ${real_ebene} ${a_wert['men_button']} ${a_wert['men_ues_level']}`;
        //console.log($info);
        //console.log(last_db_ebene+"->"+level)
        if (level!=last_db_ebene) {
            if (level!=real_ebene) {
            //console.log($info);
            if (level>real_ebene) {
                real_ebene++;
                // level=real_ebene;
                sam+="R";
                richt="-->";
                r++;
            } else {
                if (level<real_ebene) {
                    let schiebe_links=Math.max(0,real_ebene-level);
                    // sam+="L";
                    sam+="L".repeat(schiebe_links) 
                    // real_ebene=Math.max(0,real_ebene-level);
                    real_ebene-=schiebe_links;
                    l++;
                    richt="<--";
                }   
            }
            //console.warn(sam)
        
        } else {
            richt="===";
            //console.log($info);
        }

        }
        //console.log("ausgang:");
        $info=`${anz}: ziellevel(${level})<>last(${real_ebene}) real ${real_ebene} ${a_wert['men_button']} ${a_wert['men_ues_level']} getan: ${richt} `;
        //console.warn($info);


        sam+="[]";
        // real_ebene=level;
        last_db_ebene=level;

        if (anz>15) return false;
    }) 
    //console.log(sam);
    sam=sam.replace(rechts,"<ul>")
    sam=sam.replace(links,"</ul></li>")
    sam=sam.replace(k_zu,"</li>")
   
// console.log(sam);
//console.log(r,l);
    a_parser=sam.split("[");
    a_men_liste.forEach(function (a_wert,index) {
        // let butt="\n<li><a href='#' onclick='call_link("+a_wert['men_id']+")'>"+a_wert['men_button']+"</a>";
        let butt="\n<li><a id='a"+index+"' href='#' onclick='call_link("+index+")'>"+a_wert['men_button']+"</a>";
        a_parser[index]+=butt;
        // console.log(index,a_parser[index]);

    })
    htm=a_parser.join("\n");
    // console.log(htm)
    

    if (l<r) {
        htm+="</ul></li>".repeat(r-l) 
    }

   
    // console.log(htm)
}


// a_adr=['https://tetris.baa.at','https://tangram.baa.at']

// function call_link(id) {
//     // a_men_liste[]
//     //$("#men_haupt").attr("src",a_adr[nr])
// }

