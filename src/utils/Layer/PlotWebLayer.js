import {
    guid,
    intToRgb
} from '../SimDataModel/utils'
import tempPlotLayer from './tempPlotLayer';

function PlotWebLayer(options) {
    console.log(options);
    this.geoPlots = [];
    this.datas = options.datas;
    this.codeId = options.codeId;
    this.plotColor = options.plotColor || "#FF0000";
    this.featureData = null;
    this.pos = options.pos || 0;

    this.width = 2 || options.width;
    this.nid = options.nid;
    this.type = options.type || 1; //jb类型，1是点jb，2是线jb

    this.map = options.map;
    this._lineLayer = null;

    this.textShow = false;
    this.noteTextShow = false;
    this.textFeature = null;

    this.lineWidth = 1 || options.lineWidth
    this.textcolor = "#000000" || options.plotTextColor;
    this.textValue = options.textValue || ' ';
    this.noteText = options.noteText || ' ';
    this.plotName = 'plotLayerWebEdit';
    this.onMapZoom = true;
    this.rotateCenter = null;
    this.initLayer(options.datas)
}

PlotWebLayer.prototype = Object.assign({
    initLayer: function (datas) {
        let _lineFeatures = {
            type: "FeatureCollection",
            features: [],
        }
        if (datas.pathPlotStyle) {
            this.innerStyle(datas.pathPlotStyle);
        }
        let plotTexts = datas.plotTexts;
        if (plotTexts) {
            this.textValue = plotTexts
        }
        for (let i = 0; i < datas.paths.length; i++) {
            let bTextPath = datas.paths[i].bTextPath;
            let plotElements = datas.paths[i].plotElements;
            let baseBFill = datas.paths[i].baseBFill;
            let baseBLine = datas.paths[i].baseBLine;
            // let baseFillColor = datas.paths[i].baseFillColor == 0 ? (datas.pathPlotStyle ? intToRgb(datas.pathPlotStyle.fillBackColor) : 'rgb(255,0,0)') : intToRgb(datas.paths[i].baseFillColor);
            let baseFillColor = this.lineColor;
            let baseFillMode = datas.paths[i].baseFillMode;
            let baseLineColor = datas.paths[i].baseLineColor;

            if (bTextPath) {
                this.textShow = true;
                // let bbox = [[plotElements[0].posX,plotElements[0].posY],[plotElements[2].posX,plotElements[2].posY]];
                // 旗面文字
                let textFeature = this.innerTextFeature(plotElements)
                this.textFeature = [textFeature]
                // let lineFeatures = this.innerLineFeature(plotElements)
                // _lineFeatures.features = _lineFeatures.features.concat(lineFeatures);
            } else {
                // 军标
                let lineFeatures = this.innerLineFeature(plotElements)
                if (baseBFill) {
                    if (lineFeatures[0].geometry.type == 'LineString') {
                        if (lineFeatures[0].geometry.coordinates.length > 3) {
                            lineFeatures[0] = turf.lineToPolygon(lineFeatures[0]);
                        }
                    }
                    lineFeatures[0].properties.fillColor = baseFillColor;
                    lineFeatures[0].properties.baseBFill = baseBFill;
                }
                if (baseBLine) {
                    lineFeatures[0].properties.baseBLineColor = intToRgb(baseLineColor);
                }
                _lineFeatures.features = _lineFeatures.features.concat(lineFeatures);
            }

        }

        console.log(_lineFeatures);

        this.featureData = _lineFeatures;

        /* 注记文字 */
        this.noteTextShow = true;
        let bbox = turf.bbox(this.featureData);
        this.plotBbox = [bbox[0] - 100, bbox[1] - 100, bbox[2] + 100, bbox[3] + 100]

        let noteTextFeature = this.innerNoteTextFeature(this.plotBbox)
        this.noteTextFeature = {
            type: "FeatureCollection",
            features: [noteTextFeature],
        }
        //this.onAdd(this.map);
    },
    innerTextFeature: function (plotElements) {

        let posx = (plotElements[0].posX + plotElements[2].posX) / 2
        let posy = (plotElements[0].posY + plotElements[2].posY) / 2

        let textFeature = new ol.Feature({
            geometry: new ol.geom.Point([posx, posy]),
            color: this.textColor,
            value: this.textValue,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
        });

        // let textFeature = {
        //     'type': 'Feature',
        //     'properties': {
        //         'color':  this.textColor,
        //         'value':  this.textValue
        //     },
        //     'geometry': {
        //         'type': 'Point',
        //         'coordinates': [posx, posy]
        //     }
        // }

        return textFeature;
    },
    innerNoteTextFeature: function () {

        return {
            'type': 'Feature',
            'properties': {
                'valueColor': this.textcolor,
                'value': this.noteText,
                'fontSize': this.fontSize,
            },
            'geometry': {
                'type': 'Point',
                'coordinates': this.getNoteXY(this.pos)
            }
        }
    },
    innerLineFeature: function (plotElements) {
        let _linefeatures = [];
        let _lineFeature = {
            'type': 'Feature',
            'properties': {
                'valueColor': this.lineColor,
                'lineWidth': this.lineWidth,
                'dasharray': this.lineDash
            },
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        }
        for (let j = 0; j < plotElements.length; j++) {
            let lng = plotElements[j].posX;
            let lat = plotElements[j].posY;
            let type = plotElements[j].Type;
            if (type == 0) {
                if (_lineFeature.geometry.coordinates.length) {
                    _linefeatures.push(_lineFeature);
                    _lineFeature = {
                        'type': 'Feature',
                        'properties': {
                            'valueColor': this.lineColor,
                            'lineWidth': this.lineWidth,
                            'dasharray': this.lineDash
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': []
                        }
                    }
                } else {
                    let _coordinate = [lng, lat];
                    _lineFeature.geometry.coordinates.push(_coordinate)
                }


            } else if (type == 1) {
                let _coordinate = [lng, lat];
                _lineFeature.geometry.coordinates.push(_coordinate)
            } else if (type == 2) {
                let _point0 = [plotElements[j - 1].posX, plotElements[j - 1].posY]
                let _point1 = [plotElements[j].posX, plotElements[j].posY]
                let _point2 = [plotElements[j + 1].posX, plotElements[j + 1].posY]
                let _point3 = [plotElements[j + 2].posX, plotElements[j + 2].posY]
                let _line = [_point0, _point1, _point2, _point3]
                let curved = this.getCurved(_line);
                _lineFeature.geometry.coordinates = _lineFeature.geometry.coordinates.concat(curved)
                j = j + 2;
            }
        }
        if (_lineFeature.geometry.coordinates.length > 1 && (_lineFeature.geometry.coordinates[0].toString() == _lineFeature.geometry.coordinates[_lineFeature.geometry.coordinates.length - 1].toString())) {
            if (_lineFeature.geometry.coordinates.length > 3) {
                _lineFeature = turf.lineToPolygon(_lineFeature);
            }
        }
        _linefeatures.push(_lineFeature);
        return _linefeatures;
    },
    innerStyle: function (plotStyle) {
        console.log(plotStyle)

        let lineWidth = plotStyle.lineWidth;
        let lineColor = plotStyle.lineColor;
        let lineStyle = plotStyle.lineStyle;
        this.lineColor = intToRgb(lineColor);
        this.lineWidth = lineWidth;
        this.lineDash = lineStyle == 0 ? false : lineStyle == 1 ? [20, 5] : [100, 10];

        let fontSize = plotStyle.fontSize;
        let textColor = plotStyle.textColor;

        this.fontSize = fontSize;
        this.textColor = intToRgb(textColor);
        // this.textValue = ' '
    },
    innerSource: function () {

    },
    setStyle: function () {

    },
    getCurved: function (points) {
        let t = 0;
        let curved = [];
        for (let i = 0; i < 32; i++) {
            t += 1 / 32
            let p = this.threeBezier(t, points[0], points[1], points[2], points[3]);
            curved.push(p);
        }
        return curved
    },

    threeBezier: function (t, p1, cp1, cp2, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [cx1, cy1] = cp1;
        const [cx2, cy2] = cp2;
        let x =
            x1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cx1 * t * (1 - t) * (1 - t) +
            3 * cx2 * t * t * (1 - t) +
            x2 * t * t * t;
        let y =
            y1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cy1 * t * (1 - t) * (1 - t) +
            3 * cy2 * t * t * (1 - t) +
            y2 * t * t * t;
        return [x, y];
    },

    reset: function (datas) {
        this.initLayer(datas);

    },

    setRotateCenterPoint: function (center) {
        this.rotateCenter = center;

    },

    setOnZoom: function () {
        let _this = this;
        var x = new tempPlotLayer({
            id: 'tempPlotLayer_' + _this.nid++,
            data: turf.featureCollection([turf.point(e.coordinate)]),
            code: _this.plotCode,
            map: _this.map,
            imageUrl: _this.imageUrl,
            iconUrl: _this.imageUrl,
            store: store,
            name: _this.plotName,
            color: _this.plotColor
        })

        _this.map.add(_this.selfMap.tempPlotLayer)
    },

    setColor: function (color) {
        if (this._lineLayer) {
            for (let i = 0; i < this.featureData.features.length; i++) {
                this.featureData.features[i].properties.valueColor = color;
                this.featureData.features[i].properties.baseBLineColor = color;
                if (this.featureData.features[i].properties.baseBFill) {
                    this.featureData.features[i].properties.fillColor = color;
                }

            }
            this.lineColor = color;
            this._lineLayer.getSource().clear();
            this._lineLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.featureData));
            // this._lineLayer.setSource(this.featureData)
        }
    },
    setWidth: function (width) {
        if (this._lineLayer) {
            for (let i = 0; i < this.featureData.features.length; i++) {
                this.featureData.features[i].properties.lineWidth = width;
            }
            this.lineWidth = width;
            this._lineLayer.getSource().clear();
            this._lineLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.featureData));
        }
    },
    setDasharray: function (dasharray) {
        if (this._lineLayer) {
            for (let i = 0; i < this.featureData.features.length; i++) {
                this.featureData.features[i].properties.dasharray = dasharray;
            }
            this.lineDash = dasharray;
            this._lineLayer.getSource().clear();
            this._lineLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.featureData));
        }
    },


    setText: function (text) {
        if (this.textShow) {
            this.textValue = text;
            // this.textFeature.features[0].properties.value = text;
            if (this._textLayer) {
                let features = this._textLayer.getSource().getFeatures();
                if (features.length > 0) {
                    let properties = features[0].getProperties();
                    let nProperties = Object.assign(properties, {
                        value: text
                    });
                    features[0].setProperties(nProperties);
                }
            }
        }
    },
    setTextColor: function (color) {
        if (this._textLayer) {
            this.textColor = color;
            let features = this._textLayer.getSource().getFeatures();
            if (features.length > 0) {
                let properties = features[0].getProperties();
                let nProperties = Object.assign(properties, {
                    color: color
                });
                features[0].setProperties(nProperties);
            }
        }

        if (this._noteTextLayer) {
            this.noteTextFeature.features[0].properties.color = color;
            this.noteTextColor = color;
            this._noteTextLayer.getSource().clear();
            this._noteTextLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.noteTextFeature));
        }
    },
    setNoteText: function (noteText) {
        if (this.noteTextShow) {
            this.noteText = noteText;
            this.noteTextFeature.features[0].properties.value = noteText;
            this.noteTextFeature.features[0].geometry.coordinates = this.getNoteXY(this.pos);
            if (this._noteTextLayer) {
                this._noteTextLayer.getSource().clear();
                this._noteTextLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.noteTextFeature));
            }
        }
    },
    setNoteTextColor: function (color) {
        if (this._noteTextLayer) {
            this.noteTextFeature.features[0].properties.color = color;
            this.noteTextColor = color;
            this._noteTextLayer.getSource().clear();
            this._noteTextLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.noteTextFeature));
        }
    },
    setNoteTextPosition(pos) {
        this.pos = pos
        if (this.noteTextShow) {
            this.noteTextFeature.features[0].geometry.coordinates = this.getNoteXY(this.pos);
            if (this._noteTextLayer) {
                this._noteTextLayer.getSource().clear();
                this._noteTextLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.noteTextFeature));
            }
        }
    },
    setNoteTextSize(size) {
        this.fontSize = size
        if (this.noteTextShow) {
            this.noteTextFeature.features[0].properties.fontSize = size;
            if (this._noteTextLayer) {
                this._noteTextLayer.getSource().clear();
                this._noteTextLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(this.noteTextFeature));
            }
        }
        if (this.textShow) {
            if (this._textLayer) {
                let features = this._textLayer.getSource().getFeatures();
                if (features.length > 0) {
                    let properties = features[0].getProperties();
                    let nProperties = Object.assign(properties, {
                        fontSize: size
                    });
                    features[0].setProperties(nProperties);
                }
            }
        }

    },
    getNoteXY(position) {
        let x;
        let y;
        if (position == 0) {
            x = (this.plotBbox[0] + this.plotBbox[2]) / 2;
            y = this.plotBbox[1];
        } else if (position == 1) {
            x = this.plotBbox[2];
            y = (this.plotBbox[1] + this.plotBbox[3]) / 2;
        } else if (position == 2) {
            x = (this.plotBbox[0] + this.plotBbox[2]) / 2;
            y = this.plotBbox[3];
        } else if (position == 3) {
            x = this.plotBbox[0];
            y = (this.plotBbox[1] + this.plotBbox[3]) / 2;
        } else if (position == 4) {
            x = this.plotBbox[0];
            y = this.plotBbox[3];
        } else if (position == 5) {
            x = this.plotBbox[2];
            y = this.plotBbox[3];
        } else if (position == 6) {
            x = this.plotBbox[2];
            y = this.plotBbox[1];
        } else if (position == 7) {
            x = this.plotBbox[0];
            y = this.plotBbox[1];
        }
        return [x, y];
    },
    addLineLayer: function () {
        let _this = this;
        let lineLayer_ = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new PIE.ol.format.GeoJSON()).readFeatures(_this.featureData),
                useSpatialIndex: false,
                wrapX: false // For vector editing across the -180° and 180° meridians to work properly, this should be set to false
            }),
            name: _this.plotName,
            displayInLayerSwitcher: false,
            // Return the style according to the handle type
            style: function (feature) {
                return _this.lineLayerStyle(feature)
            },
        });
        _this.map.map.addLayer(lineLayer_);
        this._lineLayer = lineLayer_;
    },

    lineLayerStyle: function (feature) {
        var properties = feature.getProperties();
        let dasharray = properties.dasharray;
        let lineWidth = properties.lineWidth;
        let lineColor = properties.valueColor;
        let baseBLineColor = properties.baseBLineColor;
        lineColor = baseBLineColor ? baseBLineColor : lineColor;
        let fillColor = properties.fillColor ? properties.fillColor : 'rgba(0,0,0,0)';
        let style = new PIE.ol.style.Style({
            stroke: new PIE.ol.style.Stroke({
                color: lineColor,
                width: lineWidth,
                lineDash: dasharray
            }),
            fill: new PIE.ol.style.Fill({
                color: fillColor
            })
        });
        return style;
    },
    textLayerStyle: function (feature) {
        var properties = feature.getProperties();
        let value = properties.value;
        // let lineWidth = properties.lineWidth;
        let textColor = properties.color;
        let fontSize = properties.fontSize || 12;
        let fontFamily = properties.fontFamily || 'sans-serif';
        let style = new PIE.ol.style.Style({
            text: new PIE.ol.style.Text({
                text: value.toString(),
                font: `${fontSize}px ${fontFamily}`,
                overflow: true,
                fill: new PIE.ol.style.Fill({
                    color: textColor
                })
            })
        })
        return style;
    },
    addTextLayer: function () {
        if (this.textShow) {
            let _this = this;
            let textLayer_ = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: _this.textFeature,
                    useSpatialIndex: false,
                    wrapX: false // For vector editing across the -180° and 180° meridians to work properly, this should be set to false
                }),
                name: _this.plotName + "_text",
                displayInLayerSwitcher: false,
                // Return the style according to the handle type
                style: function (feature) {
                    return _this.textLayerStyle(feature)
                },
            });
            _this.map.map.addLayer(textLayer_);
            this._textLayer = textLayer_;
        }
    },
    addNoteTextLayer: function () {
        if (this.noteTextShow) {
            let _this = this;

            let noteTextLayer_ = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: (new PIE.ol.format.GeoJSON()).readFeatures(_this.noteTextFeature),
                    useSpatialIndex: false,
                    wrapX: false // For vector editing across the -180° and 180° meridians to work properly, this should be set to false
                }),
                name: _this.plotName + "_noteText",
                displayInLayerSwitcher: false,
                // Return the style according to the handle type
                style: function (feature) {
                    return _this.textLayerStyle(feature)
                },
            });
            _this.map.map.addLayer(noteTextLayer_);
            this._noteTextLayer = noteTextLayer_;
        }
    },
    updataLayer: function (datas) {

        let rotateAngle = datas.rotateAngle
        this.initLayer(datas);
        let _this = this;
        this._lineLayer.getSource().clear();
        this._lineLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(_this.featureData));
        if (this.textShow) {
            this._textLayer.getSource().clear();
            let geo = _this.textFeature[0].getGeometry();
            var rotateCenter = _this.rotateCenter ? _this.rotateCenter : _this.featureData.features[0].geometry.coordinates[0]
            geo.rotate(-Math.PI * ((360 - rotateAngle) / 180), rotateCenter);
            console.log(geo);
            this._textLayer.getSource().addFeatures(_this.textFeature);
        }
        if (this.noteTextShow) {
            console.log(_this.noteTextFeature)
            this._noteTextLayer.getSource().clear();
            this._noteTextLayer.getSource().addFeatures((new PIE.ol.format.GeoJSON()).readFeatures(_this.noteTextFeature));
        }
        // this._lineLayer.setSource(this.featureData)
    },
    addLayer: function () {
        this.addLineLayer();
        this.addTextLayer();
        this.addNoteTextLayer();

    },
    onAdd: function (map, type) {
        this._map = map;
        let vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(this.featureData)
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: this.plotColor,
                    width: this.width
                }),
                fill: new ol.style.Fill({
                    color: [255, 255, 255, 0.5]
                })
            })
        })
        vectorLayer.name = "PlotWebLayer" + this.codeId;

        this.map.addLayer(vectorLayer);


    },
    onRemove: function (map, type) {
        if (this._lineLayer) {
            this.map.map.removeLayer(this._lineLayer);
        }
        if (this._textLayer) {
            this.map.map.removeLayer(this._textLayer);
        }
        if (this._noteTextLayer) {
            this.map.map.removeLayer(this._noteTextLayer);
        }

    }
})

export default PlotWebLayer