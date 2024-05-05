let AppTask_flag=true;
let falsche=0;
let richtige=0;

let tool=window.parent.tool;
let max_pt=window.parent.max_pt;

let checked=0;
console.clear();;
console.log("tool:",tool,"max_pt:",max_pt,"pid=",pnr)





window.addEventListener("message",function onMessage(e) {
    // console.log("e.data",e.data);

    // return false;    
    if (e.data && e.data.split) {
        var msg = e.data.split("|");
        console.log("baa-Message", msg);
        
        var cmd = msg[0];
        if (cmd=="AppTask") {
            if (msg[1]=='') {
                AppTask_flag=false;
            }
        }
        if (cmd=="AppTitle") {
            if (!AppTask_flag) {
                let feld=document.getElementById("AppTitle");
                feld.textContent=msg[1]
                feld.style.display="block";
                // feld.style.display="block";
            }
        }
        if (cmd=="AppCompleted") {
            var learningAppIFrame = document.getElementById("ifr_learningApps");
            // send this specific message to the iframe and trigger a checkSolution
            learningAppIFrame.contentWindow.postMessage("checkSolution", "*");
        }

        if (cmd === "AppChecked") {
            // alert("App was checked, show results and feedback")
            
            var appId = msg[1];
            var timeNeededInSeconds = msg[2];
            var results = msg[3];

            if (tool==5) {
                if (msg[3].length==1) {
                    richtige=max_pt-falsche;
                } else {
                    falsche++;
                }
            }

            if ([86,71,74,270].includes(tool)) { //nur einmal hinein - am schluss
                if (asumme(msg[3])==max_pt) {
                    richtige=max_pt-falsche;
                } else {
                    // falsche++;
                    falsche=max_pt-asumme(msg[3]);
                }
            }
            
            if (tool==103) {
                richtige+=Number(msg[3]);
            }


            // if (tool==74) {
            //     if (!checked) {
            //         richtige=asumme(results);
            //     }
            // }



            checked=1;
            console.log("AppChecked - r:",richtige," - f:",falsche)
            return

            //////////////////////////////////////////
            // for further processing of the results
            //////////////////////////////////////////
            results = results.split(";");
            // console.log("res:", results);
            var correctAnswers = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i] == 1) {
                    correctAnswers++;
                }
            }
            falsche++;
            console.error("fehler:",falsche,tool);

            console.log("correctAnswers",correctAnswers,window.parent.max_pt)
            var correctAnswersInPercent = (correctAnswers * 100) / results.length;
            // document.getElementById("AppResults").style.display = "block";
            // document.getElementById("AppResults").innerHTML = Math.round(correctAnswersInPercent) + " % ist richtig";
            /////////////////////////////////////////

            return;
        }

        // is send, when each element has a solution (app ends)
        // AppSolved|AppId|timeNeededinSeconds|WrongAndCorrectAnswers
        // AppChecked|1207658|20|1;0;1;1;0;0
        if (cmd === "AppSolved") {
            // show our custom feedback panel

            // richtige=richtige-falsche;
            console.log("AppChecked - r:",richtige," - f:",falsche)

            document.getElementById("AppResults").style.display = "block";
            document.getElementById("AppResults").innerHTML = Math.round(richtige*100/max_pt) + " % ist richtig";

            console.error("AppSolved-ENDE:",max_pt,richtige,tool);
            console.error("AppSolved-ENDE: ,max_pt,richtige,tool ",max_pt,richtige,tool);
return

            // alert("fehleranz:"+falsche);
            // var correctAnswersInPercent = (correctAnswers * 100) / results.length;
            document.getElementById("AppResults").style.display = "block";
            document.getElementById("AppResults").innerHTML = Math.round(correctAnswersInPercent) + " % ist richtig";

            console.error("AppSolved-ENDE:",window.parent.max_pt,window.parent.tool,falsche);

            // document.getElementById('custom-feedback-panel').style.display = "block";
            return;
        }






    }
    return;
},false);

function asumme(results) {
    let a_results = results.split(";");
    var correctAnswers = 0;
    for (var i = 0; i < a_results.length; i++) {
        if (a_results[i] == 1) {
            correctAnswers++;
        }
    }
    return correctAnswers
}


function ues_hide (obj) {
    // obj.style.display="none";
}
