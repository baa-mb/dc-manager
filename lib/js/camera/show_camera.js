
var my_cam_list = [
    ["0fd9:0078", "Elga"],
    ["0bc8:5880", "OH"],
    ["2e1a:4c01", "Cam360"],
    ["32e4:8830", "MaxZoom"],
    ["0bda:58fe", "Screen"],
    ["OBS", "OBS"]
];

var wBreite = 320; // We will scale the photo width to this
// var wHoehe = 180; // This will be computed based on the input stream
var wHoehe = 240; // This will be computed based on the input stream
var fakt = 1;
var butt_add = 0;

var streaming = false;
var video = null;
var canvas = null;
var photo = null;
var cam_id = [];
var cam_label = [];
var cam_nr = 0;
let audioTrack = null;
let videoTrack = null;

var m_stream = null;
var alt_cam_nr = 0;

// 3264	0,75	2448
// 1680	0,75	1260
// {width: 160, height:120},

video = document.getElementById("video");
video_list();




//window.onbeforeunload = function(){alert(555)};


// window.onbeforeunload = function(){
//     //alert(1);
//     console.warn("ssss")
//     video_stop(-1);

// };


function init() {
    //beschriftung richtig setzen
    cam_label.forEach(function (label, idx) {
        //console.error("gefundene",idx,label)
        for (let i = 0; i < my_cam_list.length; i++) {
            // console.warn(label,my_cam_list[i][0])
            if (label.indexOf(my_cam_list[i][0]) > -1) {
                // console.log("ja",idx,i,label)
                document.getElementById("c" + idx).textContent = my_cam_list[i][1];
                // console.log(document.getElementById("c" + idx).getAttribute("onclick"));
            }
        }
    });

    let queryParams = new URLSearchParams(window.location.search);
    let fnd_nr = -1;
    if (queryParams.get("cam_nr")) {
        nr = queryParams.get("cam_nr");
        let suche_kennung = my_cam_list[nr][0];

        cam_label.every(function (label, idx) {
            console.log(label, idx);
            fnd_nr = idx;
            if (label.indexOf(suche_kennung) > -1) {
                return false;
            }
            //wenn nicht gefunden - kommt die höcshte NR. von OBS
            return true;
        });

    } else {
        fnd_nr = 0;
    }
    //cam_nr = fnd_nr;

    set_cam_nr(fnd_nr);
}

function set_width() {
    // wBreite = $(window).width();
    // console.log(window.innerWidth,wBreite);
    wBreite = window.innerWidth;
    wHoehe = video.videoHeight / (video.videoWidth / wBreite);
    video.setAttribute("width", wBreite);
    video.setAttribute("height", wHoehe * 2);
    // video.style.transform.scale=1;
    // alert(wbreite+ "/" + wHoehe)
}

window.addEventListener("resize", set_width);
set_width();

function ende() { video_stop(-9); }
function pause() { pausieren(-2); }

function video_list() {
    function ruf_cam(nr) {
        return function () {
            set_cam_nr(nr);
        };
    }

    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            var idx = 0;
            let b_cont = document.getElementById("b_container");
            devices.forEach(function (device) {
                //console.log("art:", device.kind + ": " + device.label + " deviceId = " + device.deviceId);
                if (device.kind == "videoinput") {
                    cam_id[idx] = device.deviceId;
                    cam_label[idx] = device.label;
                    console.log("cam:", idx, device.label, device.deviceId);
                    let butt = document.createElement("button");
                    butt.setAttribute("id", "c" + idx);
                    butt.setAttribute("cam_id", device.deviceId);
                    butt.setAttribute("class", "butti");
                    // butt.textContent = device.label.substring(0, 8);
                    butt.textContent = device.label;
                    butt.addEventListener("click", ruf_cam(idx));
                    b_cont.appendChild(butt);
                    idx++;
                }
            });
            let b_close = document.createElement("button");
            b_close.addEventListener("click", ende);
            b_close.textContent = "K. aus";
            b_cont.appendChild(b_close);

            // let b_pause = document.createElement("button");
            // b_pause.addEventListener("click", pause);
            // b_pause.textContent = "Pause";
            // b_cont.appendChild(b_pause);
            init();
        });

    // .catch(function(err) {
    //     console.log(err.name + ": " + err.message);
    // });
}


function set_cam_nr(nr) {

    cam_nr = nr;
    document.getElementById("c" + alt_cam_nr).style.color = "black";
    document.getElementById("c" + cam_nr).style.color = "red";
    console.log("cam: klick: ", cam_nr);
    video_stop(cam_nr);

    alt_cam_nr = nr;
    //show_camera();
}

//({ audio: false, video: { width: { ideal: 3264 }, height: { ideal: 2448 } ,pan: true, tilt: true, zoom: true } });

function show_camera() {
    var constraints;
    // if (location.search == "?res=max") {
    //     constraints = {
    //         audio: false,
    //         video: {
    //             deviceId: {
    //                 exact: cam_id[cam_nr]
    //             },
    //             width: {
    //                 ideal: 3264
    //             },
    //             height: {
    //                 ideal: 2448
    //             },
    //         },
    //     };
    // } else {
        constraints = {
            audio: false,
            video: {
                deviceId: {
                    exact: cam_id[cam_nr]
                },
                width: {
                    ideal: 3840
                },
                height: {
                    ideal: 2448
                },
                pan: true, tilt: true, zoom: true
            },
        };
    // }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        navigator.mediaDevices.getUserMedia(constraints).then(
            function (stream) {
                video.srcObject = stream;
                m_stream = stream;
                // video.play();

                // Show loading animation.
                var playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        fakt = video.videoHeight / video.videoWidth;
                        // console.log(video.videoWidth, video.videoHeight);
                    })
                        .catch(error => {
                            console.log(error);
                            // Auto-play was prevented
                            // Show paused UI.
                        });
                }

                //console.log(video.getCapabilities());
                //fakt=video.videoWidth/video.videoHeight;
                // setTimeout(() => {
                //     fakt = video.videoHeight / video.videoWidth;
                //     //console.log(video.videoWidth,video.videoHeight,fakt );
                // }, 300);
            },
            function (reason) {
                console.log("Videokamera eventuell bereits offen? " + cam_nr + "\r" + reason);
            }
        );
    }
}

function vergroesserung(flag) {
    // wBreite = $(window).width() * 2;
    wBreite = window.innerWidth * 2;
    // console.log(wBreite)
    window.resizeTo(wBreite * 2, wBreite / fakt + butt_add);
    alert(wBreite);
    set_width();
    //window.resizeBy(-50, 0);
    //baa_resize();
}

var bs_breite = window.screen.width;

function set_size(f) {
    if (f == 0) {
        location.href = "show_camera.html?res=max&cam_nr=" + cam_nr;
    } else {
        const a_win = [360, 960, 1450, 1650, 1650];
        // let br = 480 * f;
        let br = a_win[f - 1];

        window.resizeTo(br, br / 1.7 + 32);
        bs_breite = window.screen.width;
        moveTo(bs_breite - br + 20, 0);

        // let video_container=document.getElementById("video");
        // video_container.style.top="-500px";
    }
}


function video_stop(p_cam_nr) {
    let zeit_nach_stopped=0;
    const stream = video.srcObject;
    m_stream = stream;
    if (stream) {
        stopped=true;
        stream.getTracks().forEach(function (track, idx) {
            // console.log(idx, "vor:", track.readyState, track.readyState == "live");
            if (track.readyState == "live" && track.kind === "video") {
                track.stop();
                // alert("video gestoppt")
            }
            // console.log(idx, "nach:", track.readyState, track.readyState == "live", track);
        });
        video.srcObject = null;
        console.log("Stream geschlossen");
        // setTimeout(function () {
        //     if (p_cam_nr > -1) {
        //         show_camera();
        //     }
        // }, 1800);
        zeit_nach_stopped=1500;
    }
    video.srcObject = null;
    // console.log("Kein Stream zu schließen!" + p_cam_nr);
    
    if (p_cam_nr > -1) {
        setTimeout(()=> {
            show_camera();
        },zeit_nach_stopped)
    }

    if (p_cam_nr == -9) {
        window.close();
    }
}

function pausieren(p_cam_nr) {
    if (m_stream) {
        console.log("pausieren", m_stream);
        m_stream.getTracks().forEach(function (track, idx) {
            console.log(idx, "vor:", track.readyState, track.readyState == "live");
            if (track.readyState == "live" && track.kind === "video") {
                track.stop();
            }
            console.log(idx, "nach:", track.readyState, track.readyState == "live", track);
        });
        video.srcObject = null;
    }
}



function open_from_video(adr) {
    window.parent.show_zeichnen(1);

}


function vtest() {
    // video.pause();
    // video.currentTime = 0;

    const stream = video.srcObject;
    stream.getTracks().forEach(function (track) {
        console.log(track.readyState == "live", track.kind === "video");
        // if (track.readyState == "live" && track.kind === "video") {
        //   track.stop();
        // }
        console.log("test", track);
    });
}

function ccc() {
    alert(99);
    console.warn("ssss");
    video_stop(-1);
};
