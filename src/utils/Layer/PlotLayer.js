var plotLayer = 1;
import config from '../Config';
import { SideTOColor } from '../SimDataModel/utils';
function PlotLayer(options) {
    PIE.Layer.call(this);
    options = options || {};
    this.type = "PlotLayer";
    this.data = options.data !== undefined ? options.data : "";

    this.id = options.id !== undefined ? options.id : "plotLayer" + plotLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection = options.projection !== undefined ? options.projection : "EPSG:3857";
    this.iconUrl = false;
    this.code = options.code !== undefined ? options.code : "";
    this.side = options.side !== undefined ? options.side : 1;
    this.map = options.map;
    this.imageUrl = false;
    this.drawCanvas();
}

PlotLayer.prototype = Object.assign(Object.create(PIE.Layer.prototype), {
    handleData: function () {
        this.source = {
            "id": this.id,
            "source": {
                "type": "geojson",
                "data": this.data
            }
        };
        this.sourceId = this.id;
    },
    drawCanvas: function () {
        let codes = {
            childrens: config.config
        };
        this.initConfig(codes);
        if (this.iconUrl) {
            let side = this.side;
            let image = new Image();
            let _this = this;
            image.src = this.iconUrl;
            image.onload = function () {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                let imageData = ctx.getImageData(0, 0, image.width, image.height);
                let data = imageData.data;
                for (let i = 0; i < data.length; i = i + 4) {
                    let r = data[i];
                    // let g = data[i+1];
                    // let b = data[i+2];
                    // let a = data[i+3];
                    if (r >= 200) {
                        if (side == 1) {
                        } else if (side == 2) {
                            data[i] = 0;
                            data[i + 2] = 255;
                        } else if (side == 3) {
                            data[i] = 0;
                            data[i + 1] = 255;
                        } else if (point.properties.side == 4) {
                            data[i] = 255;
                            data[i + 1] = 165;
                        } else if (point.properties.side == 5) {
                            data[i] = 255;
                            data[i + 1] = 255;
                        } else {
                            data[i] = 128;
                            data[i + 2] = 128;
                        }
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                _this.imageUrl = canvas.toDataURL("image/png");
                // debugger
                _this.map.add(_this);
            }


        }
    },
    initConfig: function (child) {
        if (child.childrens) {
            for (let i = 0; i < child.childrens.length; i++) {
                let have = this.initConfig(child.childrens[i]);
                if (have) {
                    return true;
                }
            }
        } else {
            let children = child.children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    let have = this.initConfig(children[i])
                    if (have) {
                        return true;
                    }
                }
            } else {
                if (Number(child.codeId) == this.code) {
                    this.iconUrl = child.url
                    return true
                }
            }

        }
    },
    innerSource: function (type) {
        if (type == 1) {
        } else if (type == 2) {
            this.data.features[0].properties.imageUrl = this.imageUrl
            this.olSource = new PIE.ol.source.Vector({
                features: (new PIE.ol.format.GeoJSON()).readFeatures(this.data, {
                    featureProjection: this.projection
                })
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
                billboard:{
                    image:this.imageUrl,
                    verticalOrigin:Cesium.VerticalOrigin.BOTTOM
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
                map.removeLayer(this.olLayer);
            }
        } else if (type == 3) {
            map.entities.removeById(this.id);
        }
    }
});

export default PlotLayer