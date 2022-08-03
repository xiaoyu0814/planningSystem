// import {getData} from "./utils"
import store from "@/store"
import {
    req
} from '@/api/index'

import PlotWebLayer from "./Layer/PlotWebLayer";
import tempPlotLayer from "./Layer/tempPlotLayer"
var PlotIP = JB_PlotIP
// var PlotIP = "http://10.1.30.50:8188"
var DrawPlot = function (map, selfMap) {
    this.code = 12; //12,21509,13,30213,40203,40202,4010601
    this.pointNum = 1;
    this.nid = 1;
    this.geoPlots = [];
    this.color = "#ff0000"
    this.map = map;
    this.selfMap = selfMap;
    this.plotCode = "";
    this.plotName = "";
    this.plotColor = "rgb(255,0,0)"
    let _this = this;
    this.codeMinNum = 2;
    this.codeMaxNum = 255;
    this.points = [];
    this.callback = "";
    this.endDraw = false;
    this.drawTypeToEnd = true;
    this.imageUrl = "";
    this.numUrl = PlotIP + "/PathNative/service/analysisMaxMin?nid=" + parseInt(Math.random() * 50000) + "&code="
    this.map.on("click", function (e) {
        // console.log(e);
        // e.preventDefault();
        if (_this.endDraw) {
            _this.onClick(e, _this.plotCode)
        }

        // console.log(turf.point(e.coordinate))
        // _this.selfMap.tempPlotLayer.data = turf.point(e.coordinate)

        // var x = new tempPlotLayer({
        //     id: 'tempPlotLayer_' + _this.nid++,
        //     data: turf.featureCollection([turf.point(e.coordinate)]),
        //     code: _this.plotCode,
        //     map: _this.map,
        //     imageUrl: _this.imageUrl,
        //     iconUrl: _this.imageUrl,
        //     store: store,
        //     name: _this.plotName,
        //     color: _this.plotColor
        // })

        // _this.map.add(_this.selfMap.tempPlotLayer)
    })
    // $(this.map.getViewport())
    // this.map.map.getViewport().oncontextmenu = function (e) {
    //     console.log("oncontextmenu");
    //     e.preventDefault();
    //     // let coordinate = _this.map.map.getEventCoordinate(e);
    //     // let temp = {
    //     //     map: _this.map.map,
    //     //     coordinate: coordinate
    //     // }
    //     // _this.drawEnd(temp, _this.plotCode)
    //     // console.log("结束绘制", coordinate)
    //     _this.endDraw = false

    // }
    // this.map.getViewport().on("contextmenu", function (e) {
    //     console.log("contextmenu")
    //     e.preventDefault();
    //     let coordinate = _this.map.getEventCoordinate(e);
    //     let temp = {
    //         map: _this.map,
    //         coordinate: coordinate
    //     }
    //     _this.drawEnd(temp, _this.plotCode)
    //     console.log("结束绘制", coordinate)
    // })
};
const Ridus = 6378137
const EARTH_CIRCUM = 2 * Math.PI * Ridus;


var plotColor = "#ff0000"
DrawPlot.prototype.drawEnd = function (e, plotCode) {
    return
    let points = e.coordinate;
    if (this.codeMinNum == 1) {

    } else {
        this.points.push(points);
        let _this = this;
        if (this.points.length >= this.codeMinNum) {
            let urls = PlotIP + "/PathNative/service/analysis?nid=" + parseInt(Math.random() * 50000) + "&code=" + plotCode + "&points=" + this.points.toString() + "&unitlength=" + getR(this.map)
            req.get(urls).then(res => {
                console.log(res);
                _this.setLine(res.data, e.map)

                if (_this.callback) {
                    _this.callback(plotCode, this.points)
                }
            });
        }
    }
}
DrawPlot.prototype.onClick = function (e, plotCode) {
    return
    let points = e.coordinate;
    if (this.codeMinNum == 1) {
        this.points.push(points);
        let _this = this;
        let nid = parseInt(Math.random() * 50000) + 1;
        let urls = PlotIP + "/PathNative/service/analysis?nid=" + nid + "&code=" + plotCode + "&points=" + points + "&unitlength=" + getR(this.map)
        req.get(urls).then(res => {
            if (plotCode == 7 || plotCode == 9) {
                store.state.JBtext_data = res.data
                store.state.JBtext_map = e.map
                store.state.JBtext_show = true
            } else {
                let plotWebLayer = new PlotWebLayer({
                    map: e.map,
                    datas: res.data,
                    codeId: plotCode,
                    nid: nid
                })
                _this.geoPlots.push(res.data.geoPlot)
                console.log(plotWebLayer);
                if (this.callbackDraw) {
                    this.callbackDraw(plotWebLayer.featureData, guid(), nid);
                }

                // _this.setLine(res.data, e.map)
            }
            if (_this.callback) {
                _this.callback(plotCode, points)
            }
        })
    } else {
        this.points.push(points);
        let _this = this;
        let nid = parseInt(Math.random() * 50000) + 1;
        if (this.points.length == this.codeMinNum || (e.originalEvent.button == 2)) {
            let urls = PlotIP + "/PathNative/service/analysis?nid=" + nid + "&code=" + plotCode + "&points=" + this.points.toString() + "&unitlength=" + getR(this.map)
            req.get(urls).then(res => {
                if (plotCode == 7 || plotCode == 9) {
                    store.state.JBtext_data = res.data
                    store.state.JBtext_map = e.map
                    store.state.JBtext_show = true
                } else {
                    // _this.setLine(res.data, e.map)
                    let plotWebLayer = new PlotWebLayer({
                        map: e.map,
                        datas: res.data,
                        codeId: plotCode,
                        nid: nid
                    })
                    _this.geoPlots.push(res.data.geoPlot)
                    console.log(plotWebLayer);
                    if (this.callbackDraw) {
                        this.callbackDraw(plotWebLayer.featureData, guid(), nid);
                    }
                }
                if (_this.callback) {
                    _this.callback(plotCode)
                }
            });
        }
    }
}

function getR(map) {
    if (map.defaultSettings.type == 3) {
        return 0.001;
    } else {
        return EARTH_CIRCUM / ((1 << Math.floor(map.getZoom())) * 256)
    }
    // return EARTH_CIRCUM / ((1 << Math.floor(map.getView().getZoom())) * 256)
}


DrawPlot.prototype.drawLine = function (lines, map, label) {
    console.log(lines)
    console.log(map)
    console.log(label)
    // console.log(this.points[0])
    // console.log(JSON.stringify(lines));
    let _this = this;
    // var sourceTemp = new ol.source.Vector({
    //     features: (new ol.format.GeoJSON()).readFeatures(lines)
    // });
    // var vectorLayer = new ol.layer.Vector({
    //     source: sourceTemp,
    //     style: new ol.style.Style({
    //         stroke: new ol.style.Stroke({
    //             color: plotColor,
    //             width: 2
    //         })
    //     }),
    // });
    // vectorLayer.name = this.plotName;
    // map.addLayer(vectorLayer);

    // let _line = new PIE.MetoStyle.LineLayer({
    //     data: lines,
    //     id: guid(),
    //     color: plotColor
    // });
    // _line.name = this.plotName;
    console.log(this);

    if (this.callbackDraw) {
        this.callbackDraw(lines, guid());
    }
    if (this.plotCode == 7) {
        var feature = turf.point(this.points[0]);
        let vectorLayer_text = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures({
                    features: [feature],
                    type: "FeatureCollection"
                })
            }),
            style: new ol.style.Style({
                text: new ol.style.Text({
                    font: '15px Microsoft YaHei',
                    text: store.state.JBtext_value,
                    fill: new ol.style.Fill({
                        color: '#222'
                    })
                })
            })
        })
        vectorLayer.name = this.plotName + 'text'
        // map.addLayer(vectorLayer_text)
        // var temp = {
        //     layer: [vectorLayer, vectorLayer_text],
        //     name: this.plotName + 'text'
        // }
        // store.state.JBLayer.push(temp)
    } else if (this.plotCode == 9) {
        var point_1 = turf.toWgs84(turf.point(this.points[0]))
        var point_2 = turf.toWgs84(turf.point(this.points[1]))
        var center = turf.toMercator(turf.midpoint(point_1, point_2))
        // var feature = turf.point(center.geometry.coordinates)
        let vectorLayer_text = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures({
                    features: [center],
                    type: "FeatureCollection"
                })
            }),
            style: new ol.style.Style({
                text: new ol.style.Text({
                    font: '15px Microsoft YaHei',
                    text: store.state.JBtext_value,
                    fill: new ol.style.Fill({
                        color: '#222'
                    })
                })
            })
        })
        vectorLayer.name = this.plotName + 'text'
        // map.addLayer(vectorLayer_text)
        // var temp = {
        //     layer: [vectorLayer, vectorLayer_text],
        //     name: this.plotName + 'text'
        // }
        // store.state.JBLayer.push(temp)
    } else {
        if (label) {
            // store.state.JBLayer[label].push(vectorLayer)
        } else {
            // store.state.temp_JBLayer.push(vectorLayer)
        }
    }
    this.points = [];
    return;
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

}

function getParenthesesStr(str) {
    // 获取（）内的字符串
    var reg = /\((.+?)\)/g;
    var tmp = str.match(reg);
    if (tmp) {
        for (var i = 0; i < tmp.length; i++) {
            return tmp[i].replace(reg, "$1")
        }
    } else {
        alert("no match.");
    }
}

DrawPlot.prototype.intToRgb = function (argb) {
    var rgb = [];
    rgb[0] = (argb & 0xff0000) >> 16;
    rgb[1] = (argb & 0xff00) >> 8;
    rgb[2] = (argb & 0xff);
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}

DrawPlot.prototype.RgbToint = function (rgba) {
    var result = getParenthesesStr(rgba);
    var rgbArr = result.split(",")
    var color = ((0xFF << 24) | (rgbArr[0] << 16) | (rgbArr[1] << 8) | rgbArr[2]);
    return color;
}

DrawPlot.prototype.getHandleCount = function (nid) {
    let urls = PlotIP + "/PathNative/service/getHandleCount?nid=" + nid;
    req.get(urls).then((res) => {
        console.log(res);
    })
}

/**
 * UnKnown   = -1,  
 * NormalHandle = 1,
 * LittleHandle = 2,
 * ControlHandle = 3,
 * ScaleHandle  = 4,
 * LeadLineHandle = 5,
 * RotateHandle = 6,
 * MoveHandle  = 7
 */

DrawPlot.prototype.getHandle = function (nid, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/getHandle?nid=" + nid;
    req.get(urls).then((res) => {
        console.log(res);
        let data = res.data;
        let features = [];
        let rotateCenter = null;
        for (let key in data) {
            console.log(key);
            // if (key == 10 || key == 11 || key == 12) {
            let item = data[key];
            console.log(item.plotHandleType);
            if(item.plotHandleType == 1){
                let geo = new ol.geom.Point([item.plotHandleX, item.plotHandleY]);
                rotateCenter = [item.plotHandleX, item.plotHandleY];
            }
            let f = new ol.Feature({
                geometry: new ol.geom.Point([item.plotHandleX, item.plotHandleY]),
                handle: 'translate',
                plotHandleType:item.plotHandleType,
                nid: nid,
                nHandle: key
            });

            features.push(f);
            // }
        }
        if (callback) {
            callback(features,rotateCenter)
        }
    })
}

DrawPlot.prototype.moveHandle = function (nid, nHandle, points, map, plotType) {
    let _this = this;
    if(nid){
        let urls = PlotIP + "/PathNative/service/moveHandle?nid=" + nid + "&points=" + points.toString() + "&nHandle=" + nHandle;
        req.get(urls).then((res) => {
            console.log(res);
            if(plotType == 1){
                _this.selectLayer_.setRotateCenterPoint(points)
            }
            _this.selectLayer_.updataLayer(res.data)
        })

    }else{
        return
    }
    
}

DrawPlot.prototype.getPlotStyle = function (nid, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/getPlotStyle?nid=" + nid;
    req.post(urls).then((res) => {
        console.log(res);
        callback(res.data.plotStyle)
    })
}

DrawPlot.prototype.setPlotStyle = function (nid, params, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/setPlotStyle?nid=" + nid;
    req.post(urls, params).then((res) => {
        console.log(res);
        callback()
    })
}

DrawPlot.prototype.getLabelAndPos = function (nid, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/getDotSymbolLabelContentAndPos?nid=" + nid;
    req.post(urls).then((res) => {
        console.log(res);
        callback(res.data)
    })
}

DrawPlot.prototype.setLabelAndPos = function (nid, text, pos, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/setDotSymbolLabelContentAndPos?nid=" + nid + "&text=" + text + "&pos=" + pos;
    req.get(urls).then((res) => {
        console.log(res);
        callback()
    })
}

DrawPlot.prototype.getPlotTexts = function (nid, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/getPlotTexts?nid=" + nid;
    req.post(urls).then((res) => {
        console.log(res);
        callback(res.data)
    })
}

DrawPlot.prototype.setPlotTexts = function (nid, text, params, callback) {
    let _this = this;
    let urls = PlotIP + "/PathNative/service/setPlotTexts?nid=" + nid + "&text=" + text;
    req.post(urls, params).then((res) => {
        console.log(res);
        callback()
    })
}

DrawPlot.prototype.getPlotData = function (data, style, callback) {
    // style.pathPlotStyle.lineColor = this.intToRgb(style.pathPlotStyle.lineColor)
    // style.pathPlotStyle.textColor = this.intToRgb(style.pathPlotStyle.textColor)
    data.pathPlotStyle = style.pathPlotStyle
    let plotWebLayer = new PlotWebLayer({
        map: this.map,
        datas: data,
        codeId: "",
        nid: "",
        type: style.symbolType,
        textValue:style.plotTexts,
        noteText:style.symbolLabelContent,
        pos:style.symbolLabelPos,
    })
    // _this.onSelectPlot =  plotWebLayer;
    // _this.geoPlots.push(res.geoPlot)
    // plotWebLayer.addLayer();
    // let plotWebLayer = new PlotWebLayer({
    //     map: "",
    //     datas: data,
    //     codeId: "",
    //     nid: ""
    // })
    callback(plotWebLayer)
}
export default DrawPlot