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
        console.log(e);
        // e.preventDefault();
        _this.onClick(e, _this.plotCode)
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
    // $(this.map.getViewport()).on("contextmenu", function (e) {
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
    let points = e.coordinate;
    if (this.endDraw) return
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
    if (this.endDraw) return
    let points = e.coordinate;
    if (this.codeMinNum == 1) {
        this.points.push(points);
        let _this = this;
        let nid = parseInt(Math.random() * 50000) + 1;
        let urls = PlotIP + "/PathNative/service/analysis?nid=" +nid + "&code=" + plotCode + "&points=" + points + "&unitlength=" + getR(this.map)
        req.get(urls).then(res => {
            if (plotCode == 7 || plotCode == 9) {
                store.state.JBtext_data = res.data
                store.state.JBtext_map = e.map
                store.state.JBtext_show = true
            } else {
                let plotWebLayer = new PlotWebLayer({
                    map:e.map,
                    datas:res.data,
                    codeId:plotCode,
                    nid:nid
                })
                _this.geoPlots.push(res.data.geoPlot)
                console.log(plotWebLayer);
                _this.endDraw = true;
                if (this.callbackDraw) {
                    this.callbackDraw(plotWebLayer.featureData, guid(),nid);
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
                        map:e.map,
                        datas:res.data,
                        codeId:plotCode,
                        nid:nid
                    })
                    _this.geoPlots.push(res.data.geoPlot)
                    console.log(plotWebLayer);
                    _this.endDraw = true;
                    if (this.callbackDraw) {
                        this.callbackDraw(plotWebLayer.featureData, guid(),nid);
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

DrawPlot.prototype.setLine = function (datas, map, label) {
    this.geoPlots.push(datas.geoPlot)
    let _lineFeatures = {
        type: "FeatureCollection",
        features: [],
    }
    for (let i = 0; i < datas.paths.length; i++) {
        let plotElements = datas.paths[i].plotElements;
        let _lineFeature = {
            'type': 'Feature',
            'properties': {
                'color': plotColor,
            },
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        }
        for (let j = 0; j < plotElements.length; j++) {
            let lng = plotElements[j].posX;
            let lat = plotElements[j].posY;
            if (plotElements[j].Type == 2) {
                let _point0 = [plotElements[j - 1].posX, plotElements[j - 1].posY]
                let _point1 = [plotElements[j].posX, plotElements[j].posY]
                let _point2 = [plotElements[j + 1].posX, plotElements[j + 1].posY]
                let _point3 = [plotElements[j + 2].posX, plotElements[j + 2].posY]
                let _line = [_point0, _point1, _point2, _point3]
                let curved = getCurved(_line);
                //let coords = turf.getCoords(curved)
                _lineFeature.geometry.coordinates = _lineFeature.geometry.coordinates.concat(curved)
                j = j + 2;
            } else if (plotElements[j].Type == 0) {
                if (_lineFeature.geometry.coordinates.length > -1) {
                    _lineFeatures.features.push(_lineFeature);
                    _lineFeature = {
                        'type': 'Feature',
                        'properties': {
                            'color': plotColor,
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': []
                        }
                    }
                    let _coordinate = [lng, lat];
                    _lineFeature.geometry.coordinates.push(_coordinate)
                }
            } else {
                let _coordinate = [lng, lat];
                _lineFeature.geometry.coordinates.push(_coordinate)
            }
        }
        _lineFeatures.features.push(_lineFeature);
    }
    this.drawLine(_lineFeatures, map, label)
}

function getCurved(points) {
    let t = 0;
    let curved = [];
    for (let i = 0; i < 100; i++) {
        t += 0.01
        let p = threeBezier(t, points[0], points[1], points[2], points[3]);
        curved.push(p);
    }
    return curved
}

function threeBezier(t, p1, cp1, cp2, p2) {
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
}

DrawPlot.prototype.drawLine = function (lines, map, label) {
    console.log(lines)
    console.log(map)
    console.log(label)
    // console.log(this.points[0])
    // console.log(JSON.stringify(lines));
    this.drawTypeToEnd = true;
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

DrawPlot.prototype.getHandleCount = function(nid){
    let urls = PlotIP + "/PathNative/service/getHandleCount?nid=" + nid;
    req.get(urls).then((res)=>{
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

DrawPlot.prototype.getHandle = function(nid,callback){
    let _this = this;
    let urls = PlotIP + "/PathNative/service/getHandle?nid=" + nid;
    req.get(urls).then((res)=>{
        console.log(res);
        let data = res.data;
        let features = [];
        for(let key in data){
            console.log(key);
            let item = data[key];
            console.log(item);
            let f = new ol.Feature( { geometry: new ol.geom.Point([item.x,item.y]) ,handle:'translate',nid:nid,nHandle:key});
            features.push(f);
        }
        if(callback){
            callback(features)
        }
    })
}

DrawPlot.prototype.moveHandle = function(nid,nHandle,points,map){
    let _this = this;
    let urls = PlotIP + "/PathNative/service/moveHandle?nid=" + nid + "&points="+points.toString() + "&nHandle=" + nHandle ;
    req.get(urls).then((res)=>{
      console.log(res);

        let plotWebLayer = new PlotWebLayer({
            map:map,
            datas:res.data,
            codeId:_this.plotCode,
            nid:nid
        })
        console.log(plotWebLayer);
        _this.selectLayer_.setSource( turf.toWgs84(plotWebLayer.featureData)); 
    })
}
export default DrawPlot