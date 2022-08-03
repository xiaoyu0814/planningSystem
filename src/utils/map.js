import DrawPlot from './draw';
// import app from './drag';
import store from "@/store"
import DrawLine from "./DrawLine"
import DrawJYWG from "./Draw/DrawJYWG"
// import tempPlotLayer from "./Layer/tempPlotLayer"


import Transform from './Code/Transform';

import pieApp from './Draw/olPointer';

import DrawPlot_1 from './Draw/DrawPlot';

import {
  revoke_list,
  recovery_list
} from "@/utils/Draw/operationRecord"


export default {
  data: null,
  map: null,
  controller: null,
  baseMap_layer: null,
  imageLayer: null,
  WFSFilterLayer: null,
  echartsLayerType: false,
  DrawLine: null,
  DrawJYWG: null,
  tempPlotLayer: null,
  weatherData: null,
  tiled: null,
  //初始化地图
  initMap: function (options) {

    // var _url = window.location.href.substr(0,window.location.href.lastIndexOf('#/'));
    // _url = _url.substr(0,_url.lastIndexOf('/'))
    var url = window.location.href.substr(0, window.location.href.indexOf(window.location.hash));
    url = url.substr(0, url.lastIndexOf("/")) + "public/sprite/Weather";
    if (!this.map) {
      this.map = new PIE.Map({
        type: options.type
      });
      var view = new PIE.MapView({
        map: this.map,
        container: options.id,
        zoom: options.zoom,
        center: options.center,
        // projection: 'EPSG:4326',
        // sprite: url,
        sprite: '@/../jb_sprite/jb_sprite'
        // glyphs: "public/fonts/{fontstack}/{range}.pbf",
      });
    }

    let self = this
    this.map.on("load", () => {
      if (!this.baseMap_layer) {
        this.baseMap_layer = new PIE.GridTileLayer({
          url: map_ip + "/service/v1/tile?map=GoogleTerrian&access_token=&x={x}&y={y}&z={z}",
          // url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          // url: "https://webst03.is.autonavi.com/appmaptile?style=6&z={z}&y={y}&x={x}",
          // url: "http://piecloud.piesat.cn/dataservices/service/v1/tile?map=mapbox_earth&access_token=&x={x}&y={y}&z={z}",
          // url: "http://piecloud.piesat.cn/dataservices/service/v1/tile?map=GFImage&access_token=&x={x}&y={y}&z={z}",
          // url: "/geoserver/test/wms?service=WMS&version=1.1.0&request=GetMap&layers=test:test-JB&styles=&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&TRANSPARENT=true",
          id: "baseMap"
        });
        this.map.add(this.baseMap_layer);
      }

      if (!this.mengban) {
        this.mengban = new PIE.GridTileLayer({
          url: "",
          // url: "/geoserver/test/wms?service=WMS&version=1.1.0&request=GetMap&layers=test:test-JB&styles=&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png&TRANSPARENT=true",
          id: "mengban"
        });
        this.map.add(this.mengban);
      }
      // 比例尺
      this.map.scaleControl()
      // 军用地图
      this.create_JY_map()


      this.map.mapMoveDisable();
      this.map.mapScrollZoomDisable();
      this.map.doubleClickZoomDisable();
      //this.initDrawController();
      this.DrawLine = new DrawLine(this.map);
      this.DrawJYWG = new DrawJYWG(this.map);
      if (self.map.defaultSettings.type != 3) {
        this.intiPieApp();
      }
      this.DrawTest = new DrawPlot_1(this.map, this.overlayLayer_);
      if (self.map.defaultSettings.type != 3) {
        this.map.map.getView().on('change:resolution', () => {
          // console.log(this)
        })
      }

      // this.initSelect();
      this.getData("js/sprite1/Weather@2x.json").then(res => {
        this.weatherData = res
      })
    });
  },
  create_JY_map() {
    this.tiled = null
    this.tiled = new ol.layer.Tile({
      visible: true,
      source: new ol.source.TileWMS({
        url: numberMap_ip,
        params: numberMap_params
      }),
      // projection:"EPSG:3857"
    });
  },
  //初始化控件
  initController: function (options) {
    options.map = this.map;
    this.controller = new PIE.controller(options);
    return this.controller;
  },

  setDefaultStyle() {
    // Style
    var stroke = new ol.style.Stroke({
      color: [255, 0, 0, 1],
      width: 1
    });
    var strokedash = new ol.style.Stroke({
      color: [255, 0, 0, 1],
      width: 1,
      lineDash: [4, 4]
    });
    var fill0 = new ol.style.Fill({
      color: [255, 0, 0, 0.01]
    });
    var fill = new ol.style.Fill({
      color: [255, 255, 255, 0.8]
    });
    var circle = new ol.style.RegularShape({
      fill: fill,
      stroke: stroke,
      radius: this.isTouch ? 12 : 6,
      points: 15
    });
    circle.getAnchor()[0] = this.isTouch ? -10 : -5;
    var bigpt = new ol.style.RegularShape({
      fill: fill,
      stroke: stroke,
      radius: this.isTouch ? 16 : 8,
      points: 4,
      angle: Math.PI / 4
    });
    var smallpt = new ol.style.RegularShape({
      fill: fill,
      stroke: stroke,
      radius: this.isTouch ? 12 : 6,
      points: 4,
      angle: Math.PI / 4
    });

    function createStyle(img, stroke, fill) {
      return [new ol.style.Style({
        image: img,
        stroke: stroke,
        fill: fill
      })];
    }
    /** Style for handles */
    this.style = {
      'default': createStyle(bigpt, strokedash, fill0),
      'translate': createStyle(bigpt, stroke, fill),
      'rotate': createStyle(circle, stroke, fill),
      'rotate0': createStyle(bigpt, stroke, fill),
      'scale': createStyle(bigpt, stroke, fill),
      'scale1': createStyle(bigpt, stroke, fill),
      'scale2': createStyle(bigpt, stroke, fill),
      'scale3': createStyle(bigpt, stroke, fill),
      'scalev': createStyle(smallpt, stroke, fill),
      'scaleh1': createStyle(smallpt, stroke, fill),
      'scalev2': createStyle(smallpt, stroke, fill),
      'scaleh3': createStyle(smallpt, stroke, fill),
    };
  },
  initSelect: function () {
    let map = this.map.map;
    let self = this;
    this.setDefaultStyle();
    this.handles_ = new ol.Collection();
    this.overlayLayer_ = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: this.handles_,
        useSpatialIndex: false,
        wrapX: false // For vector editing across the -180° and 180° meridians to work properly, this should be set to false
      }),
      name: 'Transform overlay',
      displayInLayerSwitcher: false,
      // Return the style according to the handle type
      style: function (feature) {
        // console.log(feature)
        // console.log((feature.get('handle') || 'default') + (feature.get('constraint') || '') + (feature.get('option') || ''))
        return (self.style[(feature.get('handle') || 'default') + (feature.get('constraint') || '') + (feature.get('option') || '')]);
      }
    });
    var modify = new ol.interaction.Modify({
      source: this.overlayLayer_.getSource()
    });
    map.addInteraction(modify);
    this.select = new ol.interaction.Select({
      layers: [this.overlayLayer_]
    });
    map.addInteraction(this.select);
    this.overlayLayer_.setMap(map);
    // var selectedFeatures = this.select.getFeatures();
    this.select.on(['select'], function (e) {
      console.log(e)
    });

  },

  intiPieApp: function () {
    let map = this.map.map;
    this.setDefaultStyle();
    let self = this;
    this.handles_ = new ol.Collection();

    this.overlayLayer_ = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: this.handles_,
        useSpatialIndex: false,
        wrapX: false // For vector editing across the -180° and 180° meridians to work properly, this should be set to false
      }),
      name: 'Transform-overlay',
      displayInLayerSwitcher: false,
      // Return the style according to the handle type
      style: function (feature) {
        // console.log(feature)
        // console.log((feature.get('handle')||'default')+(feature.get('constraint')||'')+(feature.get('option')||''))
        return (self.style[(feature.get('handle') || 'default') + (feature.get('constraint') || '') + (feature.get('option') || '')]);
      }
    });
    this.overlayLayer_.setMap(map);

    let pieAPPDrag = new pieApp.Drag(this.overlayLayer_.getSource())
    map.addInteraction(pieAPPDrag);
    pieAPPDrag.callback = function (e) {
      let nHandle = e.features.get('nHandle');
      let nid = e.features.get('nid');
      let plotHandleType = e.features.get('plotHandleType');
      if (nid) {
        revoke_list.push({
          type: 'translate',
          nid,
          nHandle,
          coordinate: e.startCoordinate,
          map,
          plotHandleType,
          selectLayer: self.DrawPlot.selectLayer_
        })
      }
      self.DrawPlot.moveHandle(nid, nHandle, e.coordinate, map, plotHandleType)
      self.overlayLayer_.getSource().clear();
      if (nid) {
        self.getHandle(nid)
      }
    }
  },

  getHandle(nid) {
    let self = this;
    this.DrawPlot.getHandle(nid, function (features, rotateCenter) {
      if (rotateCenter) {
        self.DrawPlot.selectLayer_.setRotateCenterPoint(rotateCenter)
      }
      self.overlayLayer_.getSource().clear();
      self.overlayLayer_.getSource().addFeatures(features);
    })
  },
  drawSelect: function (layer) {
    let map = this.map.map;
    this.overlayLayer_.getSource().clear();

    var features = [];

    let array_box = layer.olSource.getExtent();

    let geom = ol.geom.Polygon.fromExtent(array_box);
    let boxfeature = new ol.Feature(geom);

    features.push(boxfeature);
    var g = geom.getCoordinates()[0];
    for (let i = 0; i < g.length - 1; i++) {
      let f = new ol.Feature({
        geometry: new ol.geom.Point([(g[i][0] + g[i + 1][0]) / 2, (g[i][1] + g[i + 1][1]) / 2]),
        handle: 'scale',
        constraint: i % 2 ? "h" : "v",
        option: i
      });
      features.push(f);
    }
    let f = new ol.Feature({
      geometry: new ol.geom.Point([(g[0][0] + g[2][0]) / 2, (g[0][1] + g[2][1]) / 2]),
      handle: 'translate'
    });
    features.push(f);
    this.overlayLayer_.getSource().addFeatures(features);
  },

  //图形编辑
  initDrawController: function () {
    let interaction = new PIE.ol.interaction.Transform({
      enableRotatedTransform: false,
      /* Limit interaction inside bbox
      condition: function(e, features) {
        return ol.extent.containsXY([-465960, 5536486, 1001630, 6514880], e.coordinate[0], e.coordinate[1]);
      }, */
      addCondition: PIE.ol.events.condition.shiftKeyOnly,
      // filter: function(f,l) { return f.getGeometry().getType()==='Polygon'; },
      // layers: [vector],
      hitTolerance: 2,
      translateFeature: true,
      scale: true,
      rotate: true,
      keepAspectRatio: ol.events.condition.always, // undefined,
      translate: true,
      stretch: true
    });
    this.map.map.addInteraction(interaction);
    let _this = this;
    _this.interaction = interaction;
    var startangle = 0;
    var d = [0, 0];

    // Handle rotate on first point
    var firstPoint = false;
    _this.interaction.on(['select'], function (e) {
      if (firstPoint && e.features && e.features.getLength()) {
        _this.interaction.setCenter(e.features.getArray()[0].getGeometry().getFirstCoordinate());
      }
    });

    _this.interaction.on(['rotatestart', 'translatestart'], function (e) {
      // Rotation
      startangle = e.feature.get('angle') || 0;
      // Translation
      d = [0, 0];
    });
    _this.interaction.on('rotating', function (e) {
      //$('#info').text("rotate: "+((e.angle*180/Math.PI -180)%360+180).toFixed(2));
      // Set angle attribute to be used on style !
      e.feature.set('angle', startangle - e.angle);
    });
    _this.interaction.on('translating', function (e) {
      d[0] += e.delta[0];
      d[1] += e.delta[1];
      //$('#info').text("translate: "+d[0].toFixed(2)+","+d[1].toFixed(2));
      if (firstPoint) {
        _this.interaction.setCenter(e.features.getArray()[0].getGeometry().getFirstCoordinate());
      }
    });
    _this.interaction.on('scaling', function (e) {
      //$('#info').text("scale: "+e.scale[0].toFixed(2)+","+e.scale[1].toFixed(2));
      if (firstPoint) {
        _this.interaction.setCenter(e.features.getArray()[0].getGeometry().getFirstCoordinate());
      }
    });
    _this.interaction.on(['rotateend', 'translateend', 'scaleend'], function (e) {
      //$('#info').text("");
      console.log(e.feature.getGeometry().getCoordinates())
    });
  },
  cloudLayer: function (options) {

    // if(this.map.getLayer(options.id)){
    //   this.map.remove(this.imageLayer)
    //   this.imageLayer = null; 
    // }else{
    //   if (this.imageLayer) {
    //     this.map.remove(this.imageLayer)
    //     this.imageLayer = null;
    //   } 
    //   this.imageLayer = new PIE.ImageLayer(options);
    //   this.map.add(this.imageLayer);
    // }

    this.imageLayer = new PIE.ImageLayer(options);
    this.map.add(this.imageLayer);
    return this.imageLayer
  },

  query: function (options) {
    // if (this.WFSFilterLayer) {
    //   this.map.remove(this.WFSFilterLayer);
    //   this.WFSFilterLayer = null;
    // }
    // this.map.clear()
    this.WFSFilterLayer = new PIE.WFSFilterLayer(options);
    this.map.add(this.WFSFilterLayer);
    return this.WFSFilterLayer;
  },

  stationLayer(options) {
    var self = this;
    var stationLayer = new PIE.MetoStyle.StationLayer(options);
    stationLayer.addEventListener('load', function () {
      self.map.add(stationLayer);
    })
  },

  textLayer(options) {
    var testTextLayer = new PIE.MetoStyle.TextLayer(options);
    window.text = testTextLayer;
    window.map = this.map;
    this.map.add(testTextLayer);
  },

  IsoLineLayer(options) {
    var self = this;
    var isoLineLayer = new PIE.MetoStyle.IsoLineLayer(options)
    isoLineLayer.addEventListener("load", function () {
      self.map.add(isoLineLayer)
    })
  },

  GridTileLayer(options) {
    var GridTileLayer = new PIE.GridTileLayer(options);
    this.map.add(GridTileLayer);
  },

  PointLayer(options) {
    var PointLayer = new PIE.MetoStyle.PointLayer(options)
    this.map.add(PointLayer);
  },
  LineLayer(options) {
    var LineLayer = new PIE.MetoStyle.LineLayer(options);
    this.map.add(LineLayer);
  },

  FillLayer(options) {
    var FillLayer = new PIE.MetoStyle.FillLayer(options);
    this.map.add(FillLayer);
  },

  addinTile(options) {
    var terrainProvider = new Cesium.CesiumTerrainProvider(options)
    this.map.map._cesiumViewer.terrainProvider = terrainProvider
  },

  altimetry() {
    var handler = new Cesium.ScreenSpaceEventHandler(this.map.map._cesiumViewer.canvas);
    var measure = new measureHelper({
      viewer: this.map.map._cesiumViewer,
      handler: handler,
      toolTipId: "toolTip"
    });
    return measure
  },

  echartsLayer: function (options) {
    if (!this.echartsLayerType) {
      var color = ['#ff0000', '#ffa022', '#46bee9'];
      var series = [];
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = [options.geoCoordMap[dataItem[0].name][0], options.geoCoordMap[dataItem[0].name][1]];
          var toCoord = [options.geoCoordMap[dataItem[1].name][0], options.geoCoordMap[dataItem[1].name][1]];
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord]
            });
          }
        }
        return res;
      };
      options.echartsData.forEach(function (item, i) {
        series.push({
          name: item.name + ' Top10',
          coordinateSystem: 'GLMap',
          type: 'lines',
          zlevel: 1,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: color[i],
              width: 0,
              curveness: 0.2
            }
          },
          data: convertData(item.data)
        }, {
          name: item.name + ' Top10',
          coordinateSystem: 'GLMap',
          type: 'lines',
          zlevel: 2,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: options.planePath,
            symbolSize: 15
          },
          lineStyle: {
            normal: {
              color: color[i],
              width: 1,
              opacity: 0.4,
              curveness: 0.2
            }
          },
          data: convertData(item.data)
        }, {
          name: item.name + ' Top10',
          type: 'effectScatter',
          coordinateSystem: 'GLMap',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{b}'
            }
          },
          symbolSize: function (val) {
            return val[2] / 8;
          },
          itemStyle: {
            normal: {
              color: color[i]
            }
          },
          data: item.data.map(function (dataItem) {
            return {
              name: dataItem[1].name,
              value: options.geoCoordMap[dataItem[1].name].concat([
                dataItem[1].value
              ])
            };
          })
        });
      });
      var option = {
        GLMap: {
          roam: true
        },
        coordinateSystem: 'GLMap',
        title: {
          // text: '模拟迁徙',
          // subtext: '数据纯属虚构',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          bottom: 10,
          right: 250,
          data: ['北京 Top10', '上海 Top10', '广州 Top10'],
          textStyle: {
            color: '#fff'
          },
          selectedMode: 'single'
        },
        geo: {
          map: 'GLMap',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#404a59'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: series
      };

      this.echartslayer = new EchartsLayer(this.map.map);
      this.echartslayer.chart.setOption(option);
      this.echartsLayerType = true;
    } else {
      this.echartslayer.remove();
      this.echartsLayerType = false;
    }
  },

  ajax(url) {
    this.data = null;
    var xhr;
    if (window.XMLHttpRequest) {
      //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xhr = new XMLHttpRequest();
    } else {
      // IE6, IE5 浏览器执行代码
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 给methods 一个默认值
    var methods = methods || 'get';
    xhr.open(methods, url, true);
    // 如果是get请求，直接调用send方法发送请求
    if (methods == 'get') {
      xhr.send();
    }
    // 如果是post请求，则可配置请求参数
    if (methods == 'post') {
      xhr.send(text);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          // 请求成功之后调用回调函数
          console.log(xhr.responseText)
          // self.data = xhr.responseText
          // callBack(xhr.responseText);
        } else {
          let error = '错误码' + xhr.status
          callBack(error);
        }
      }
    }
  },

  setDraw: function (map) {
    if (map) {
      this.DrawPlot = new DrawPlot(this[map])
    } else {
      this.DrawPlot = new DrawPlot(this.map, this)
    }
  },

  removeAllLayer: function () {
    console.log(store.state.lineLayerId)
    return;
    if (this.map.getLayer("CGFPoint"))
      this.map.remove(this.map.getLayer("CGFPoint"));
    if (this.map.getLayer("CGFName"))
      this.map.remove(this.map.getLayer("CGFName"));
    if (this.map.getLayer("line_" + store.state.lineLayerId[0])) {
      for (let i = 0; i < store.state.lineLayerId.length; i++) {
        this.map.remove(
          this.map.getLayer("line_" + store.state.lineLayerId[i])
        );
      }
    }

    store.state.lineLayerId = [];
    store.state.navPathId = "test";
    store.state.navPathData = {
      test: [],
    };

  },

  clearMeasureLayer: function () {
    let _graphicsPoint = this.map.getLayer('graphicsLayer_point');
    let _graphicsMeasure = this.map.getLayer('measureDistance');
    let _graphicsAngle = this.map.getLayer('measureAngle');
    if (_graphicsPoint) {
      this.map.remove(_graphicsPoint)
    }
    if (_graphicsMeasure) {
      this.map.remove(_graphicsMeasure)
    }
    if (_graphicsAngle) {
      this.map.remove(_graphicsAngle)
    }
  },
  mapMoveEnable() {
    this.map.map.getInteractions().forEach((element, index, array) => {
      var DragPan = PIE.ol.interaction.DragPan
      if (element instanceof DragPan) {
        element.setActive(false)
      }
    })
  },
  mapMoveDisable() {
    this.map.map.getInteractions().forEach((element, index, array) => {
      var DragPan = PIE.ol.interaction.DragPan
      if (element instanceof DragPan) {
        element.setActive(true)
      }
    })
  },
  changeMapType(type) {
    console.log(this.map.defaultSettings.type)
    this.controller.container = "mapView";
    if (type == 1 || type == "1") {
      if (this.map.defaultSettings.type == 1) {
        return
      } else {
        this.controller.change2D(Number(type))
      }
    } else if (type == 2 || type == "2") {
      if (this.map.defaultSettings.type == 2) {
        return
      } else {
        this.controller.change2D(Number(type))
      }
    } else {
      if (this.map.defaultSettings.type == 3) {
        return
      } else {
        this.controller.change3D()
      }
    }
  },
  getData(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      //xhr.open("GET","http://"+url, true);
      xhr.open("GET", url, true);
      xhr.onload = () => {
        if (xhr.status == 200) {
          if (xhr.response) {
            var result = JSON.parse(xhr.response)
            if (result.length === 0) {
              var temp = null;
              resolve(temp);
              return false;
            }
            resolve(result);
          } else {
            reject(result);
          }

        } else {
          reject(xhr.statusText);
        }

      };
      xhr.onerror = function () {
        reject(xhr.statusText);
      };
      xhr.send(null);
    })
  },

  // 军图地图
  JY_map(type) {
    if (type) {
      this.map.map.addLayer(this.tiled);
    } else {
      this.map.map.removeLayer(this.tiled);
    }
  },
}


// 监听刷新

window.addEventListener("beforeunload", function (e) {
  //不是所有浏览器都支持提示信息的修改
  console.log('beforeunload')
  this.DrawLine = null;
  this.DrawJYWG = null;
  this.DrawTest = null;
  return;
});