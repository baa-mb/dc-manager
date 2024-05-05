// JavaScript Document

var __slice = Array.prototype.slice;

(function ($) {
  var Sketch;

  // var a_img; 
  //aufruf
  $.fn.sketch = function () {
    var args, key, sketch;

    key = arguments[0];
    args = (2 <= arguments.length) ? __slice.call(arguments, 1) : [];

    if (this.length > 1) {
      $.error('Sketch.js can only be called on one element at a time.');
    }
    sketch = this.data('sketch');
    //console.error("Argumente:", args, key, sketch);

    if (typeof key === 'string' && sketch) {
      if (sketch[key]) {
        if (typeof sketch[key] === 'function') {
          return sketch[key].apply(sketch, args); //ruft sketch mit den argument auf
        } else if (args.length === 0) {
          return sketch[key];
        } else if (args.length === 1) {
          return sketch[key] = args[0];
        }
      } else {
        return $.error('Sketch.js did not recognize the given command.');
      }
    } else if (sketch) {
      return sketch;
    } else {
      // alert(1);
      this.data('sketch', new Sketch(this.get(0), key));
      // console.log("entsteht beim Aufruf von sketch() - ",this,key);
      //warscheinlich könnte man fertige zeichnungen hier aufrufen
      // alert(3);
      return this;
    }
  };


  Sketch = (function () {
    // alert(0)
    function Sketch(el, opts) {
      // console.log("el", el, opts);
      // alert("init innen")  
      this.loaded_baa = 1;
      this.el = el;
      this.canvas = $(el);
      this.context = el.getContext('2d');
      this.akt_img = 0;
      this.hFakt = 1;
      this.a_img = [];
      // this.old_color="";
      

      this.STIFT = 0, this.LINE = 1, this.RECHT = 2, this.RECTF = 3, this.KREIS = 4, this.KREISF = 5, this.SMILE = 6, this.TEXT = 7, this.RUBBER = 8, this.SISSOR = 9;
      this.SBILD = 10, this.SBILD = 11, this.SBILD = 12, this.SBILD = 13, this.SBILD = 14, this.SBILD = 15;

      this.options = $.extend({
        toolLinks: true,
        defaultTool: 'stift',
        defaultColor: '#FF0000',
        defaultOpa: 1,
        defaultSize: 10,
        defaultGrid: 0,
        defaultDir: 0,
        defaultText: "",
        defaultSmile: 0
      }, opts);

      this.otyp = 0;
      this.shadow = 1;
      this.painting = false;
      this.color = this.options.defaultColor;
      this.size = this.options.defaultSize;
      this.tool = this.options.defaultTool;
      this.opa = this.options.defaultOpa;
      this.grid = this.options.defaultGrid;
      this.dir = this.options.defaultDir;
      this.stext = this.options.defaultText;
      this.smileNr = this.options.defaultSmile;

      this.objStapel = [];
      this.grafObj = [];

      //sonder bei ios und android
      // var isTouch = (('ontouchstart' in window) || navigator.msMaxTouchPoints>0);

      if (isTouch) {
        this.canvas.bind('touchend', function (event) {
          event.preventDefault();
          $(this).trigger("touchcancel");
        });
      }
      this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);

      if (this.options.toolLinks) {
        // console.log("set",this.options.toolLinks)     

        // $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function (e) {
        $('body').on('click', "a[href=\"#" + (this.canvas.attr('id')) + "\"]", function (e) {
          var $canvas, $this, key, sketch, _i, _len, a_prop;
          $this = $(this);
          $canvas = $($this.attr('href'));
          sketch = $canvas.data('sketch');
          sndClick.play();
          // alert(1);
          a_prop = ['color', 'size', 'tool', 'opa', 'shadow', 'dir', 'grid', 'smileNr', 'stext'];
          for (_i = 0, _len = a_prop.length; _i < _len; _i++) {
            key = a_prop[_i];
            let a_sett;
            if ($this.attr("data-" + key) != undefined) {

              console.log(sketch.otyp, "key=", key);
              // console.log("------------------------");

              if (key === "tool") {
                sketch.set(key, "stift");
                sketch.otyp = $(this).attr("data-tool");

                if (sketch.otyp > 9) {//nur cut-bilder
                  akt_sissor = Number(sketch.otyp - 10);
                }

                console.log(sketch.otyp, "key=", key);
                a_sett = einstellungen(sketch.otyp);

                a_sett.forEach(function (paar) {
                  sketch.set(paar[0], paar[1]);
                  // console.log("setINsk:", sketch.otyp, paar[0], paar[1]);
                });
                set_rahmen_mark(sketch.otyp, a_sett, 0);



              } else { //einstellungen

                // sketch.set(key, $(this).attr("data-" + key));
                sketch.set(key, $this.attr("data-" + key));

                // set_rahmen_mark(key, $this.attr("data-" + key),1);

                //console.warn("key=",key,$(this).attr("data-" + key))
              }
              set_rahmen_mark(key, $this.attr("data-" + key), 1);

            }
          }

          if ($this.attr('data-grid')) {
            sketch.makeGrid($this);
            // var gd = $(this).attr('data-grid');
            // if (gd < 4) {
            //   $canvas.css("background-image", "none");
            // } else {
            //   $canvas.css("background-image", "url(icons/punkt" + gd + ".png)");
            // }
          }

          if ($this.attr('data-download')) {
            sketch.download($(this).attr('data-download'));
          }

          /*
              if ($(this).attr('data-stift')) {
                sketch.stift($(this).attr('data-stift'));
              }
          */
          if ($this.attr('data-clear')) {
            if ($(this).attr('data-clear') == "undo") {
              sketch.lastDelete();
            } else {
              sketch.clear();
            }
          }
          return false;
        });
      }
    }

    Sketch.prototype.makeGrid = function ($obj) {
      $canv = this.canvas;
      var gd = $obj.attr('data-grid');
      if (gd < 4) {
        $canv.css("background-image", "none");
      } else {
        $canv.css("background-image", "url(js/sketch/icons/punkt" + gd + "s.png)");
      }
    };

    Sketch.prototype.startPainting = function () {
      // console.log("otype", this.otyp);

      if (this.otyp != this.TEXT) { //keine speicherverschwendung bei stext
        this.stext = "";
      }
      if (this.otyp == this.SMILE) {
        this.a_img.push(new Image());
      }

      if (this.otyp > this.SISSOR) {

        if (a_sissor_img[akt_sissor].src != "") {
          let hFakt = a_sissor_img[akt_sissor].naturalWidth / a_sissor_img[akt_sissor].naturalHeight;
          //######### fremdverwendung der parameter
          this.size = hFakt;
          this.smileNr = akt_sissor;

          //console.log("akt_sissor",akt_sissor,a_sissor_img[akt_sissor],"src",a_sissor_img[akt_sissor].src=="")
        } else {
          return false;
        }
      }
      // this.old_color=grafObj.color;

      this.painting = true;
      return this.grafObj = {
        otyp: this.otyp,
        tool: this.tool,
        color: this.color,
        size: parseFloat(this.size),
        opa: parseFloat(this.opa),
        shadow: this.shadow,
        grid: this.grid,
        dir: this.dir,
        stext: this.stext,
        smileNr: this.smileNr,
        pktListe: []
      };
    };


    Sketch.prototype.stopPainting = function () { 
      if (this.grafObj) {
        if (this.grafObj.otyp != this.SISSOR) {
          this.objStapel.push(this.grafObj);
        } else {
          if (this.grafObj.pktListe.length>1) {
            let x0=0,y0=0;
            let x1=0,y1=0;
            [x0, x1] = [Math.min(this.grafObj.pktListe[0].x, this.grafObj.pktListe[1].x), Math.max(this.grafObj.pktListe[0].x, this.grafObj.pktListe[1].x)];
            [y0, y1] = [Math.min(this.grafObj.pktListe[0].y, this.grafObj.pktListe[1].y), Math.max(this.grafObj.pktListe[0].y, this.grafObj.pktListe[1].y)];
            // capture_image(3, "", x0+3, y0+3, x1-2, y1-2);
            capture_image(3, "", x0+2, y0+2, x1-2, y1-2);
          }
        }
        protokoll(this.objStapel, this.a_img);
      }
      this.painting = false;
      this.grafObj = null;
      return this.redraw();
    };


    Sketch.prototype.onEvent = function (e) {
      console.log()
      //touchüeberprüfung
      if (e.originalEvent && e.originalEvent.targetTouches) {
        if (e.originalEvent.targetTouches.length > 0) { //probleme beim ipad mit diesem event aber nur bei touchend
          e.pageX = e.originalEvent.targetTouches[0].pageX;
          e.pageY = e.originalEvent.targetTouches[0].pageY;
        }
        // e.pageX = e.originalEvent.targetTouches[0].pageX;
        // e.pageY = e.originalEvent.targetTouches[0].pageY;
      }
      $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
      e.preventDefault();
      return false;
    };

    Sketch.prototype.redraw = function () {
      var sketch;
      this.el.width = this.canvas.width();
      this.context = this.el.getContext('2d');

      sketch = this;
      $.each(this.objStapel, function (index) {
        //console.log(index)
        if (this.tool == "stift") {
          return $.sketch.tools[this.tool].draw.call(sketch, this);
        }
      });
      
      if (this.painting && this.grafObj) {
        // console.error("painting",this.grafObj.tool)        
        return $.sketch.tools[this.grafObj.tool].draw.call(sketch, this.grafObj);
      }
    };


    Sketch.prototype.clear = function () {
      delAnz = 0;
      this.objStapel = [];
      this.a_img = [];
      if (this.painting) {
        this.stopPainting();

      }
      //$ifr_sk.attr("src",leer_blatt);
      // this.akt_img=this.a_img.length-1;

      return this.redraw();
    };

    Sketch.prototype.lastDelete = function () {
      if (this.painting) {
        this.stopPainting();
      }
      let len = this.objStapel.length;
      if (len > 0) {
        if (this.objStapel[len - 1].otyp == this.SMILE) {
          if (this.a_img.length > 0) this.a_img.pop();
        }
        this.objStapel.pop();
      }
      // this.akt_img=this.a_img.length-1;
      console.error("###### LÖ ##########");
      protokoll(this.objStapel, this.a_img);
      return this.redraw();
    };

    Sketch.prototype.download = function (format) {
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      return $("#ifr_erg").attr("src", this.el.toDataURL(mime));
      // return window.open(this.el.toDataURL(mime));
    };

    Sketch.prototype.set = function (key, value) {
      this[key] = value;
      // console.log("Setze: key: change"+key,"value: ",value,"sketch.change: " + key);
      return this.canvas.trigger("sketch.change" + key, value);
    };



    return Sketch;
  })();


  $.sketch = {
    tools: {}
  };

  $.sketch.tools.stift = {
    onEvent: function (e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          drawHot = 1;
          raster = this.grid;
          if (raster == 1) raster = 0;
          richtung = this.dir;

          var x1 = e.pageX - this.canvas.offset().left;
          var y1 = e.pageY - this.canvas.offset().top;
          if (raster) {
            var x2 = Math.round(x1 / raster) * raster;
            var y2 = Math.round(y1 / raster) * raster;
          } else {
            if (richtung == 1) {
              c_start_y = y1;
            } else if (richtung == 2) {
              c_start_x = x1;
            }
          }

          // if (this.painting) {
          //   this.stopPainting();  
          // }
          this.startPainting();
          // console.log("sp",this.startPainting())
          break;


        case 'mouseup':
        //202305 weg wegen aussenbeendigung
        // case 'mouseout':
        // case 'mouseleave':
        case 'touchend':
        case 'touchcancel':
          this.stopPainting();

        //   break;
        // default:
        //   console.log("sonst", e.type);
      }
      // if (this.grafObj)
      // if (this.grafObj.pktListe) {
      //   console.log("dauereventüberwachung:", this.grafObj.pktListe.length);
      //   console.log(this.grafObj.otyp,this.grafObj.tool,this.grafObj.pktListe)
      // }

      //hier fährt es immer durch
      if (this.painting) {
        // console.log(e.pageX,"canv-left",this.canvas.offset().left)
        var x1 = e.pageX - this.canvas.offset().left;
        var y1 = e.pageY - this.canvas.offset().top;
        // console.log("move?", x1, y1);
        if (raster) {
          x1 = Math.round(x1 / raster) * raster;
          y1 = Math.round(y1 / raster) * raster;
          // console.log("x1",x1,this.canvas.width())
        } else {
          if (richtung == 1) {
            y1 = c_start_y;
          } else if (richtung == 2) {
            x1 = c_start_x;
          }
        }

        if ((this.grafObj.pktListe.length < 2) || (this.grafObj.otyp == 0)) {
          //Bleistift sammeln
          this.grafObj.pktListe.push({ //sammeln von pktListe
            x: x1,
            y: y1,
            event: e.type
          });
        } else {
          //Rechteck und andere zweiten punkte sammeln


          this.grafObj.pktListe[1].x = x1;
          this.grafObj.pktListe[1].y = y1;
          this.grafObj.pktListe[1].event = e.type;
        }
        // console.log(x1)
        return this.redraw();
      }
    },

    draw: function (grafObj) {
      var einPkt, vorPkt, _i, _len, a_evt_pkte;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";

      let set_save=1;
      if (grafObj.shadow == 1) {
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        this.context.shadowBlur = 2;
        //this.context.shadowColor   = "#666666";
        //this.context.shadowColor   = "#000";
        this.context.shadowColor = "#333";
      } else {
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 0;
        this.context.shadowColor = "transparent";

      }

      //ständiges neuzeichnen
      // this.context.lineWidth= Number(this.context.lineWidth)+10;
      // console.log(this.context.lineWidth)
      let radius = 0;
      this.context.beginPath();
      var m_otyp = grafObj.otyp;
      //auftrennung nach objekten zug, rechteck, ...
      // if ((m_otyp <= 2)) { //auch radierer sollte dabei sein, aber leider als linie
      // if ((m_otyp == this.STIFT) || (m_otyp == this.MARKER) || (m_otyp == this.LINE)) { //auch radierer sollte dabei sein, aber leider als linie
      if ((m_otyp == this.STIFT) || (m_otyp == this.LINE)) { //auch radierer sollte dabei sein, aber leider als linie
        //gehe zum ersten punkt

        this.context.moveTo(grafObj.pktListe[0].x, grafObj.pktListe[0].y);
        a_evt_pkte = grafObj.pktListe;
        for (_i = 0, _len = a_evt_pkte.length; _i < _len; _i++) {
          einPkt = a_evt_pkte[_i];
          this.context.lineTo(einPkt.x, einPkt.y);
        }
        this.context.lineTo(einPkt.x, einPkt.y);
        // ende bleistift

      } else if (m_otyp == this.RECHT) { // rechteck
        if (grafObj.pktListe.length > 1) {
          this.context.rect(grafObj.pktListe[0].x, grafObj.pktListe[0].y, (grafObj.pktListe[1].x - grafObj.pktListe[0].x), (grafObj.pktListe[1].y - grafObj.pktListe[0].y));
        }

      } else if (m_otyp == this.KREIS) { //kreis
        if (grafObj.pktListe.length > 1) {
          radius = Math.sqrt(Math.pow(grafObj.pktListe[0].x - grafObj.pktListe[1].x, 2) + Math.pow(grafObj.pktListe[0].y - grafObj.pktListe[1].y, 2));
          this.context.arc(grafObj.pktListe[0].x, grafObj.pktListe[0].y, radius, 0, 2 * Math.PI, false);
        }

      } else if (m_otyp == this.KREISF) { //kreisF
        if (grafObj.pktListe.length > 1) {
          this.context.fillStyle = grafObj.color;

          radius = Math.sqrt(Math.pow(grafObj.pktListe[0].x - grafObj.pktListe[1].x, 2) + Math.pow(grafObj.pktListe[0].y - grafObj.pktListe[1].y, 2));
          if (radius < 12) radius = 32;
          this.context.arc(grafObj.pktListe[0].x, grafObj.pktListe[0].y, radius, 0, 2 * Math.PI, false);
          this.context.fill();
        }

      } else if (m_otyp == this.RECTF) { // rechteck weiß
        if (grafObj.pktListe.length > 1) {
          this.context.globalAlpha = grafObj.opa;
          this.context.fillStyle = grafObj.color;
          this.context.fillRect(grafObj.pktListe[0].x, grafObj.pktListe[0].y, (grafObj.pktListe[1].x - grafObj.pktListe[0].x), (grafObj.pktListe[1].y - grafObj.pktListe[0].y));
        }

      } else if (m_otyp == this.RUBBER) { // rechteck weiß
        if (grafObj.pktListe.length > 1) {
          // this.context.globalAlpha = grafObj.opa;
          // this.context.fillStyle = grafObj.color;
          
          this.context.fillStyle = "white";
          this.context.fillRect(grafObj.pktListe[0].x, grafObj.pktListe[0].y, (grafObj.pktListe[1].x - grafObj.pktListe[0].x), (grafObj.pktListe[1].y - grafObj.pktListe[0].y));
        }

      } else if (m_otyp == this.TEXT) { //
        if (grafObj.pktListe.length > 1) {

          this.context.globalAlpha = grafObj.opa;
          this.context.fillStyle = grafObj.color;

          // this.context.fillText("Hello World",grafObj.pktListe[0].x, grafObj.pktListe[0].y);
          radius = Math.sqrt(Math.pow(grafObj.pktListe[0].x - grafObj.pktListe[1].x, 2) + Math.pow(grafObj.pktListe[0].y - grafObj.pktListe[1].y, 2));
          if (radius < 12) radius = 16;
          // this.context.font=radius+"px Comic Sans MS";
          this.context.font = "bold " + radius + "px Arial";
          const dist = grafObj.pktListe[0].x - grafObj.pktListe[1].x;
          this.context.textAlign = "center";
          // if (Math.abs(dist) < 64) {
          //   this.context.textAlign = "center";
          // } else if (dist > 64) {
          //   this.context.textAlign = "right";
          // } else if (dist < -64) {
          //   this.context.textAlign = "left";
          // }
          this.context.fillText(grafObj.stext, grafObj.pktListe[0].x, grafObj.pktListe[0].y);
        }

      } else if (m_otyp == this.SMILE) { //smiley
        if (grafObj.pktListe.length > 1) {
          this.context.globalAlpha = grafObj.opa;
          // console.log("neuZ len",this.a_img.length)
          if (this.a_img.length > 0) {
            let akti = this.a_img.length - 1;
            
            if (grafObj.smileNr==undefined) grafObj.smileNr=0;
            this.a_img[akti].src = "js/sketch/icons/smileys/smile" + grafObj.smileNr + ".png";
            radius = Math.sqrt(Math.pow(grafObj.pktListe[0].x - grafObj.pktListe[1].x, 2) + Math.pow(grafObj.pktListe[0].y - grafObj.pktListe[1].y, 2));
            if (radius < 12) radius = 32;
            this.context.drawImage(this.a_img[akti], grafObj.pktListe[0].x - radius / 2, grafObj.pktListe[0].y - radius / 2, radius, radius);
          }
        }

      } else if (m_otyp == this.SISSOR) { //schere
        //  console.log("noch einmal",this.context.lineWidth,grafObj.size)
        if (grafObj.pktListe.length > 1) {
          // grafObj.size=1;
          this.context.lineWidth = 1;
          this.context.strokeStyle="red"

          this.context.rect(grafObj.pktListe[0].x, grafObj.pktListe[0].y, (grafObj.pktListe[1].x - grafObj.pktListe[0].x), (grafObj.pktListe[1].y - grafObj.pktListe[0].y));
          set_save=0;
        }

      } else if (m_otyp > this.SISSOR) { //cut_bilder
        if (grafObj.pktListe.length > 1) {
          // console.log("sbild",akt_sissor,this.hFakt)
          this.context.globalAlpha = grafObj.opa;
          this.context.textAlign = "center";
          // if (this.a_img.length > 0) {
          // let akti = this.a_img.length - 1;

          // this.a_img[akti].src = "js/sketch/icons/smileys/smile" + grafObj.smileNr + ".png";

          // radius = Math.sqrt(Math.pow(grafObj.pktListe[0].x - grafObj.pktListe[1].x, 2) + Math.pow(grafObj.pktListe[0].y - grafObj.pktListe[1].y, 2));
          radius = Math.sqrt(Math.pow(grafObj.pktListe[0].x - grafObj.pktListe[1].x, 2) + Math.pow(grafObj.pktListe[0].y - grafObj.pktListe[1].y, 2));
          if (radius < 12) radius = 16;
          this.context.drawImage(a_sissor_img[grafObj.smileNr], grafObj.pktListe[0].x, grafObj.pktListe[0].y, radius, radius / grafObj.size);
          // }



        }
      }



      if (set_save) {
        this.context.strokeStyle = grafObj.color;
        this.context.lineWidth = grafObj.size;
        this.context.globalAlpha = grafObj.opa;
 
      }
      return this.context.stroke();
    }
  };


  return $.sketch.tools.radierer = {
    onEvent: function (e) {
      return $.sketch.tools.stift.onEvent.call(this, e);
    },
    draw: function (grafObj) {
      var oldcomposite;
      oldcomposite = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "copy";
      grafObj.color = "rgba(0,0,0,0)";

      $.sketch.tools.stift.draw.call(this, grafObj);
      return this.context.globalCompositeOperation = oldcomposite;
    }
  };
})(jQuery);


function baa_info(txt) {
  $("#baa_info").text($("#baa_info").text() + " " + txt);
}

var c_start_x = 0;
var c_start_y = 0;
var raster = 16;
var richtung = 0;
var delAnz = 0;


function protokoll(a_obj, a_bilder) {
  // console.clear()
  //console.log("obj-anz:", a_obj.length, "img-anz:", a_bilder.length);
  // a_obj.forEach((ein_obj, idx) => {
  //   console.log(`${idx}.Zobj :`, ein_obj.otyp, JSON.stringify(ein_obj));
  // });

}