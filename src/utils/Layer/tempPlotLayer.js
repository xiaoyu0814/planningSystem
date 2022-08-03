var tempPlotLayerNum = 0;

function tempPlotLayer(options) {
  PIE.Layer.call(this);
  options = options || {};
  this.type = "PlotLayer";
  this.data = options.data !== undefined ? options.data : "";

  this.id = options.id !== undefined ? options.id : "tempPlotLayer" + tempPlotLayerNum++;
  this.opacity = options.opacity !== undefined ? options.opacity : 1;
  this.projection = options.projection !== undefined ? options.projection : "EPSG:3857";
  this.iconUrl = options.imageUrl;
  this.code = options.code !== undefined ? options.code : "";
  this.side = options.side !== undefined ? options.side : 1;
  this.map = options.map;
  this.imageUrl = options.imageUrl;
  this.name = options.name;
  this.store = options.store;
  this.color = options.color !== undefined ? options.color : "rgb(255,0,0)"
  this.width = options.width !== undefined ? options.width : 30;
  this.height = options.height !== undefined ? options.height : 30;
  this.flagTextSize = options.flagTextSize !== undefined ? options.flagTextSize : 5;
  this.flagTextColor = options.flagTextColor !== undefined ? options.flagTextColor : "rgb(0,0,0)";
  this.flagTextContent = options.flagTextContent !== undefined ? options.flagTextContent : "";
  this.noteContent = options.noteContent !== undefined ? options.noteContent : "";
  this.notePosition = options.notePosition !== undefined ? options.notePosition : "下";
  this.getLayerData()
}

tempPlotLayer.prototype = Object.assign(Object.create(PIE.Layer.prototype), {
  getLayerData: function () {
    let side = this.side;
    let image = new Image();
    let _this = this;
    let fontX = 8;
    let fontY = 10;
    image.src = this.iconUrl;
    image.width = this.width;
    image.height = this.height;
    image.onload = function () {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      let imageData = ctx.getImageData(0, 0, image.width, image.height);
      let data = imageData.data;
      let color = _this.getRGBvalue(_this.color)
      for (let i = 0; i < data.length; i = i + 4) {
        data[i] = color[0]
        data[i + 1] = color[1]
        data[i + 2] = color[2]
      }
      ctx.putImageData(imageData, 0, 0);
      ctx.beginPath();
      ctx.font = _this.flagTextSize + "px Arial";
      ctx.fillStyle = _this.flagTextColor;
      ctx.fillText(_this.flagTextContent, fontX, fontY);
      ctx.closePath();
      let insetImage = canvas.toDataURL("image/png");
      let canvasImage = new Image();
      canvasImage.src = insetImage;
      canvasImage.onload = function () {
        let outset_canvas = document.createElement('canvas');
        outset_canvas.width = canvasImage.width + 20;
        outset_canvas.height = canvasImage.height + 20;
        let offsetLeft = outset_canvas.width / 2 - canvasImage.width / 2
        let offsetHeight = outset_canvas.height / 2 - canvasImage.height / 2
        let outset_ctx = outset_canvas.getContext('2d');
        outset_ctx.drawImage(canvasImage, offsetLeft, offsetHeight, canvasImage.width, canvasImage.height);
        outset_ctx.beginPath();
        outset_ctx.font = "5px Arial";
        outset_ctx.fillStyle = "rgb(0,0,0)";
        let position = _this.getPosition(outset_canvas.width, outset_canvas.height, _this.noteContent.length)
        outset_ctx.fillText(_this.noteContent, position.x, position.y);
        outset_ctx.closePath();
        _this.imageUrl = outset_canvas.toDataURL("image/png");
        _this.map.add(_this);
        _this.store.state.temp_JBLayer.push(_this)

      }
    }
  },
  getPosition(width, height, fontlenght) {
    let position = {
      x: "",
      y: ""
    }
    if (this.notePosition == "下") {
      position.x = (width / 2) - ((fontlenght * 5) / 2)
      position.y = height - 5
    } else if (this.notePosition == "上") {
      position.x = (width / 2) - ((fontlenght * 5) / 2)
      position.y = 5
    } else if (this.notePosition == "左") {
      position.x = 0
      position.y = (height / 2) - (5 / 2)
    } else if (this.notePosition == "右") {
      position.x = width - (fontlenght * 5)
      position.y = (height / 2) - (5 / 2)
    } else if (this.notePosition == "左上") {
      position.x = 0
      position.y = 5
    } else if (this.notePosition == "左下") {
      position.x = 0
      position.y = height - 5
    } else if (this.notePosition == "右上") {
      position.x = width - (fontlenght * 5)
      position.y = 5
    } else if (this.notePosition == "右下") {
      position.x = width - (fontlenght * 5)
      position.y = height - 5
    }
    return position
  },
  getRGBvalue: function (text) {
    var color = text.split(/[(]|[)]/)[1];
    var result = color.split(",")
    return result
  },
  initConfig: function (child, code) {
    // let tempcode = code
    if (child.childrens) {
      for (let i = 0; i < child.childrens.length; i++) {
        let have = this.initConfig(child.childrens[i], code);
        if (have) {
          return true;
        }
      }
    } else {
      let children = child.children;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let have = this.initConfig(children[i], code)
          if (have) {
            return true;
          }
        }
      } else {
        if (Number(child.codeId) == code) {
          this.iconUrl = child.url
          return true
        }
      }

    }
  },
  innerSource: function (type) {
    if (type == 1) {} else if (type == 2) {
      this.olSource = new PIE.ol.source.Vector({
        features: (new PIE.ol.format.GeoJSON()).readFeatures(this.data)
      });
      this.olSource.id = this.id;
      return this.olSource;
    } else if (type == 3) {

    }
  },
  innerLayer: function (type) {
    if (type == 1) {

    } else if (type == 2) {
      this.olLayer = new PIE.ol.layer.Vector({
        source: this.olSource,
        style: new PIE.ol.style.Style({
          image: new PIE.ol.style.Icon({ //矢量图层填充颜色，以及透明度
            src: this.imageUrl,
            // scale: 0.2
          }),
        })
      });
      this.olLayer.id = this.id;
      return this.olLayer;

    } else if (type == 3) {

    }
  },
  onAdd: function (map, type) {
    this._map = map;
    let _this = this;
    if (type == 1) {
      map.addLayer(this.layer);
    } else if (type == 2) {
      if (this.imageUrl) {
        map.addLayer(this.olLayer);
      }
    } else if (type == 3) {
      let lng = this.data.features[0].geometry.coordinates[0];
      let lat = this.data.features[0].geometry.coordinates[1];
      let color = SideTOColor(this.side);
      map.entities.add({
        id: this.id,
        position: Cesium.Cartesian3.fromDegrees(lng, lat),
        // point: {
        //     pixelSize: 10,
        //     color: Cesium.Color.fromCssColorString(color),
        // },
        billboard: {
          image: this.imageUrl,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      });
      let _layer = {
        id: this.id,
      }
      return _layer;
    }
  },
  onRemove: function (map, type) {
    this._map = map;
    let _this = this;
    if (type == 1) {
      map.removeLayer(this.layer);
    } else if (type == 2) {
      if (this.imageUrl) {
        console.log(this.olLayer)
        map.removeLayer(this.olLayer);
      }
    } else if (type == 3) {
      map.entities.removeById(this.id);
    }
  },
  setColor: function (color) {
    this.color = color;
    this.onRemove(this.map.map, 2);
    this.getLayerData();
  },
  setSize: function (options) {
    this.width = options.width;
    this.height = options.height;
    this.onRemove(this.map.map, 2);
    this.getLayerData();
  },
  setFlagTextContent(text) {
    this.flagTextContent = text;
    this.onRemove(this.map.map, 2);
    this.getLayerData();
  },
  setFlagTextColor: function (color) {
    this.flagTextColor = color;
    this.onRemove(this.map.map, 2);
    this.getLayerData();
  },
  setNoteContent(text) {
    this.noteContent = text;
    this.onRemove(this.map.map, 2);
    this.getLayerData();
  },
  setnotePOsition(position) {
    this.notePosition = position;
    this.onRemove(this.map.map, 2);
    this.getLayerData();
  }
});

export default tempPlotLayer