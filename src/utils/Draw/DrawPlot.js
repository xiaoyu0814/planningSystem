const PlotIP = JB_PlotIP;
const Ridus = 6378137
const EARTH_CIRCUM = 2 * Math.PI * Ridus;
import PlotWebLayer from '../Layer/PlotWebLayer';
import {revoke_list,recovery_list} from './operationRecord';
import {getData} from '../SimDataModel/utils';
var DrawPlot_1 = function (map, overlayLayer_) {
    var source = new ol.source.Vector();
    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    let olmap = map.map;

    this.map = map;
    if (this.map.defaultSettings.type != 3) {
        vector.setMap(olmap);
    }
    this.codeMinNum = 0;
    this.codeMaxNum = 0;
    this.geoPlots = [];
    this.source = source;
    // this.addInteraction(olmap);
    let _this = this;
    this.onSelectPlot = null;
    _this.points = []
    this.endDraw = false;

    this.onMap = false;

    this.unitlength = 1024;

    this.nid = parseInt(Math.random() * 50000) + 1;
    this.draw = new ol.interaction.Draw({
        source: source,
        type: "Point"
    });
    if (this.map.defaultSettings.type != 3) {
        olmap.getViewport().oncontextmenu = function (e) {
            console.log("oncontextmenu");
            e.preventDefault();
            _this.endDraw = true;
            _this.removeInteraction();
            overlayLayer_.getSource().clear();
        }
    }
    
    this.draw.on('drawend', function (e) {
        let nid = parseInt(Math.random() * 50000) + 1;
        const geometry = e.feature.getGeometry();
        let pointArr = geometry.getCoordinates();
        if (_this.codeId) {
            _this.points.push(pointArr)
        }
        if (_this.points.length > 0) {
            if (_this.codeMinNum == _this.points.length) {
                _this.getCodeToLayer(nid, _this.points, _this.map)
            } else if (_this.points.length <= _this.codeMaxNum) {
                _this.getCodeToLayer(nid, _this.points, _this.map)
            }
        }
    })
}
DrawPlot_1.prototype.getCodeToLayer = function (nid, points, map) {
        let _this = this;

        function getR(map) {
            if (map.defaultSettings.type == 3) {
                return 0.001;
            } else {
                return EARTH_CIRCUM / ((1 << Math.floor(map.getZoom())) * 256)
            }
            // return EARTH_CIRCUM / ((1 << Math.floor(map.getView().getZoom())) * 256)
        }
        let unitlength = getR(map)
        if (this.onMap) {
            unitlength = this.unitlength
        }
        let urls = PlotIP + "/PathNative/service/analysis?nid=" + nid + "&code=" + _this.codeId + "&points=" + points.toString() + "&unitlength=" + unitlength;
        getData(urls, function (res) {
            _this.source.clear();
            if (_this.onSelectPlot) {
                _this.onSelectPlot.updataLayer(res);
                _this.onSelectPlot.nid = nid;
            } else {
                let type = _this.codeMaxNum > 1 ? 2 : 1;

                let plotWebLayer = new PlotWebLayer({
                    map: map,
                    datas: res,
                    codeId: _this.codeId,
                    nid: nid,
                    type: type
                })
                if (type == 1) {
                    plotWebLayer.startPoint = points.toString();
                }
                if (type == 1) {
                    if (!_this.endDraw) {
                        revoke_list.push({
                            data: plotWebLayer,
                            type: "layer",
                            geoPlot: res.geoPlot,
                        })
                        _this.onSelectPlot = plotWebLayer;
                        _this.geoPlots.push(res.geoPlot)
                        plotWebLayer.addLayer();
                    }
                } else {
                    revoke_list.push({
                        data: plotWebLayer,
                        type: "layer",
                        geoPlot: res.geoPlot,
                    })
                    _this.onSelectPlot = plotWebLayer;
                    _this.geoPlots.push(res.geoPlot)
                    plotWebLayer.addLayer();
                }


            }

            if (_this.endDraw || (points.length == _this.codeMaxNum)) {
                if (_this.callbackDraw) {
                    _this.callbackDraw(_this.onSelectPlot)
                }
                _this.points = [];
                _this.source.clear();
                _this.onSelectPlot = null;
                // _this.nid = parseInt(Math.random() * 50000) + 1;
            }
        })
    },
    DrawPlot_1.prototype.setNum = function (codeId) {
        let _url = PlotIP + "/PathNative/service/analysisMaxMin?nid=" + parseInt(Math.random() * 50000) + "&code=" + codeId;
        this.codeId = codeId;
        let _this = this;
        getData(_url, function (res) {
            console.log(res);
            _this.codeMinNum = res.min;
            _this.codeMaxNum = res.max;
            _this.points = [];
            _this.source.clear();
        })
    },

    DrawPlot_1.prototype.addInteraction = function () {
        let _this = this;
        let map = _this.map.map;
        _this.endDraw = false
        map.removeInteraction(this.draw);
        map.addInteraction(this.draw);
        // this.snap = new ol.interaction.Snap({source: source});
        // map.addInteraction( this.snap);  
    }

DrawPlot_1.prototype.removeInteraction = function () {
    let _this = this;
    let map = this.map.map;
    map.removeInteraction(this.draw);
    // map.removeInteraction( this.snap); 

}

DrawPlot_1.prototype.onMapToPlot = function (selectlayer, points, codeId, map) {
    let _this = this;

    function getR(map) {
        if (map.defaultSettings.type == 3) {
            return 0.001;
        } else {
            return EARTH_CIRCUM / ((1 << Math.floor(map.getZoom())) * 256)
        }
        // return EARTH_CIRCUM / ((1 << Math.floor(map.getView().getZoom())) * 256)
    }
    let unitLength = getR(map)
    if (this.onMap) {
        this.unitlength = unitLength;
    } else {

    }
    let nid = parseInt(Math.random() * 50000) + 1;
    let urls = PlotIP + "/PathNative/service/analysis?nid=" + nid + "&code=" + codeId + "&points=" + points + "&unitlength=" + unitLength;
    getData(urls, function (res) {
        selectlayer.updataLayer(res);
        selectlayer.nid = nid
    })
}


export default DrawPlot_1