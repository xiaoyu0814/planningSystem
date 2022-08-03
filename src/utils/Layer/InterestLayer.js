var interestLayer = 1;
import config from '../Config';
import { SideTOColor } from '../SimDataModel/utils';

function InterestLayer(options) {
    PIE.Layer.call(this);
    options = options || {};
    this.type = "InterestLayer";
    this.data = options.data !== undefined ? options.data : "";

    this.id = options.id !== undefined ? options.id : "interestLayer" + interestLayer++;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.projection = options.projection !== undefined ? options.projection : "EPSG:3857";
    this.iconUrl = false;

    this.side = options.side !== undefined ? options.side : 1;
    this.map = options.map;
    this.imageUrl = require("@/assets/images/map/position.png");

}

InterestLayer.prototype = Object.assign(Object.create(PIE.Layer.prototype), {
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
    innerSource: function (type) {
        if (type == 1) {} else if (type == 2) {
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
                        scale: 0.2,
                        anchor: [0.5, 1]
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
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.fromCssColorString(color),
                },
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

export default InterestLayer