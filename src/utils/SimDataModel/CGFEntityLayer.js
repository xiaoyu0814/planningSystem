import {
    NodeUnit,
    SideEnum
} from '@/utils/SimDataModel/NodeConfig'
import PIE_Map from '@/utils/map';
import ListLayers from './ListLayers';

import PlotLayer from '../Layer/PlotLayer';
import InterestLayer from '../Layer/InterestLayer';
import {
    EntityDirt
} from './EntityDict';
import {
    SideTOColor,getData
} from './utils';

import PlotWebLayer from '../Layer/PlotWebLayer';

var CGFEntityLayer = function (datamodel,type) {
    this.pointList = [];
    this.lineList = [];
    this.polygonList = [];
    this.childCGFList = [];
    this.pointLayer = [];
    this.pointListLayer = null;
    this.CGFNameListLayer = null;

    this.pointListLayers = new ListLayers();
    this.CGFNameListLayers = new ListLayers();

    this.navPathLayers = new ListLayers();

    this.CGFAreaListLayers = new ListLayers();

    this.areaPaths = datamodel.areaPathNodes;

    this.type = type;

    this.initLayer(datamodel)

    this.interestLayer = null;
}
CGFEntityLayer.prototype = Object.assign({
    getPointListLayers: function () {
        return this.pointListLayers
    },
    getCGFNameListLayers: function () {
        return this.CGFNameListLayers;
    },
    getNavPathLayers: function () {
        return this.navPathLayers;
    },
    getPointLayer: function (id) {
        let result = this.pointListLayers.getChild(id);
        return result;

    },
    getCGFNameLayer: function (id) {
        let result = this.CGFNameListLayers.getChild(id);
        return result;

    },
    getNavPathLayer: function (id) {
        let result = this.navPathLayers.getChild(id);
        return result;
    },
    addNavPathLayer: function (layer) {
        this.navPathLayers.addChild(layer);
    },
    removeNavPathLayer: function (id) {
        let layerId = 'navPathLine_' + id;
        let layer = this.navPathLayers.getChild(layerId);
        PIE_Map.map.remove(layer);
        this.navPathLayers.removeChildById(layerId);
    }

})
CGFEntityLayer.prototype.initLayer = function (datamodel) {
    for (let i = 0; i < datamodel.vecNodes.length; i++) {
        var pCGFEntity = datamodel.vecNodes[i];
        this.readData(pCGFEntity);
    }
    //var feature = turf.featureCollection(this.pointList);
    for (let i = 0; i < this.pointList.length; i++) {
        this.createRenderCGF(this.pointList[i]);
    }

    for (var i = 0; i < this.lineList.length; i++) {

        this.updateRenderCGFNav(this.lineList[i],true)

    }

    for (let pi = 0; pi < this.polygonList.length; pi++) {
        this.createRenderCGFArea(this.polygonList[pi]);
    }

    // Test(feature,"test.json");
};

CGFEntityLayer.prototype.removeRenderCGFAreaByAreaId = function (areaId) {
    let layer = this.CGFAreaListLayers.getChildByAreaId(areaId);
    if (layer) {
        PIE_Map.map.remove(layer);
    }
};

CGFEntityLayer.prototype.createRenderCGFArea = function (polygon) {
    let _id = polygon.properties.areaId;
    let _feature = turf.featureCollection([polygon]);
    let areaLayer = new PIE.MetoStyle.FillLayer({
        data: _feature,
        id: "CGFArea_" + _id,
        color: "#00ff00",
        opacity: 0.5
    });
    areaLayer.areaId = _id;
    PIE_Map.map.add(areaLayer);
    this.CGFAreaListLayers.addChild(areaLayer);
};

CGFEntityLayer.prototype.createRenderCGF = function (point, addStatus) {
    console.log(addStatus)
    let _id = point.properties.id;
    let _feature = turf.featureCollection([point]);
    let entity = EntityDirt[point.properties.modelId];
    let code = 62 //默认为无
    if (entity) {
        code = entity.code;
    }
    if (addStatus) {

    } else {
        if (this.type == 1 && point.properties.side == SideEnum.SideBlue) {
            return
        }
    }
    // console.log( JB_PlotIP + "/PathNative/service/analysis?nid=" + parseInt(_id) + "&code=" + code + "&points=" +  turf.toMercator(point.geometry.coordinates) + "&unitlength=" + 153)
    // let urls = JB_PlotIP + "/PathNative/service/analysis?nid=" + parseInt(_id) + "&code=" + code + "&points=" +   turf.toMercator(point.geometry.coordinates) + "&unitlength=" + 153;
    // getData(urls,function(res){
    //     let plotWebLayer = new PlotWebLayer({
    //         map: PIE_Map.map.map,
    //         datas:res.data,
    //         codeId:code
    //     })
    // });

    //添加Canvas
    let iconLayer = new PlotLayer({
        id: 'CGFIcon_' + _id,
        data: _feature,
        side: point.properties.side,
        code: code,
        map: PIE_Map.map,
    })
    this.pointListLayers.addChild(iconLayer)




    //PIE_Map.map.add(iconLayer);
    // debugger
    //this.pointListLayers.addChild(pLayer);
    // let pLayer = new PIE.MetoStyle.PointLayer({
    //     id: "CGFPoint_"+_id,
    //     data: _feature,
    //     color: {
    //         "type": "identity",
    //         "property": "color"
    //     }
    // });
    // PIE_Map.map.add(pLayer);
    // this.pointListLayers.addChild(pLayer);

    let nLayer = new PIE.MetoStyle.TextLayer({
        data: _feature,
        id: "CGFName_" + _id,
        text: "name",
        offset: [0, 1.5],
        color: point.properties.color,
        overlap: true,
        visible: true
    });
    PIE_Map.map.add(nLayer);
    this.CGFNameListLayers.addChild(nLayer);
};

CGFEntityLayer.prototype.updateRenderCGF = function (point) {
    let _id = point.properties.id;
    let _feature = turf.featureCollection([point]);
    if (PIE_Map.map.getLayer("CGFIcon_" + _id)) {
        PIE_Map.map.getLayer("CGFIcon_" + _id).setSource(_feature)
    }
    // if(PIE_Map.map.getLayer("CGFPoint_"+_id)){
    //     PIE_Map.map.getLayer("CGFPoint_"+_id).setSource(_feature)
    // }
    if (PIE_Map.map.getLayer("CGFName_" + _id)) {
        PIE_Map.map.getLayer("CGFName_" + _id).setSource(_feature)
    }

};
CGFEntityLayer.prototype.updateRenderCGFNav = function (line, addStatus) {

    let _id = line.properties.id + "_nav_";
    let _feature = turf.featureCollection([line]);
    if (addStatus) {

    } else {
        if (this.type == 1 && line.properties.side == SideEnum.SideBlue) {
            return
        }
    }
    if (PIE_Map.map.getLayer("navPathLine_" + _id)) {
        PIE_Map.map.getLayer("navPathLine_" + _id).setSource(_feature)
        PIE_Map.map.getLayer("navPathLine_" + _id + "point").setSource(turf.featureCollection([turf.multiPoint(line.geometry.coordinates)]))
    } else {

        var lineListLayer = new PIE.MetoStyle.LineLayer({
            data: _feature,
            id: "navPathLine_" + _id,
            color: line.properties.color == "#FF0000" ? "#000000" : line.properties.color,
            // dasharray: line.properties.color == "#FF0000" ? [0, 0] : [2, 4],
            width: 1
        });
        PIE_Map.map.add(lineListLayer);
        this.navPathLayers.addChild(lineListLayer);
        if (line.properties.color == "#FF0000") {
            var iconGrap = new PIE.MetoStyle.IconLayer({
                loadImageUrl: "img/navpath_point.png",
                data: turf.featureCollection([turf.multiPoint(line.geometry.coordinates)]),
                size: 0.5,
                id: "navPathLine_" + _id + "point",
            });
            PIE_Map.map.add(iconGrap);
            this.navPathLayers.addChild(iconGrap);
            // var iconGrap = new PIE.MetoStyle.IconLayer({
            //   loadImageUrl: "img/navpath_point.png",
            //   data: {
            //     type: "FeatureCollection",
            //     features: [pointGrap.geometry.toJSON()],
            //   },
            //   size: 0.5,
            // });
            // _this.$map.map.add(iconGrap);
        }

    }
};

CGFEntityLayer.prototype.removeRenderCGF = function (id) {

    // for (let i = 0; i < this.pointListLayers.list.length; i++) {
    //     if ("CGFPoint_" + id == this.pointListLayers.list[i].id) {
    //         PIE_Map.map.remove(this.pointListLayers.list[i])
    //         this.pointListLayers.list.splice(i, 1);
    //     }
    // }

    for (let i = 0; i < this.pointListLayers.list.length; i++) {
        if ("CGFIcon_" + id == this.pointListLayers.list[i].id) {
            PIE_Map.map.remove(this.pointListLayers.list[i])
            this.pointListLayers.list.splice(i, 1);
        }
    }

    for (let i = 0; i < this.navPathLayers.list.length; i++) {
        if ("navPathLine_" + id == this.navPathLayers.list[i].id) {
            PIE_Map.map.remove(this.navPathLayers.list[i])
            this.navPathLayers.list.splice(i, 1);

        }
    }

    for (let i = 0; i < this.CGFNameListLayers.list.length; i++) {
        if ("CGFName_" + id == this.CGFNameListLayers.list[i].id) {
            PIE_Map.map.remove(this.CGFNameListLayers.list[i])
            this.CGFNameListLayers.list.splice(i, 1);
            return
        }
    }

};

CGFEntityLayer.prototype.updateLayer = function (pCGFEntity) {
    let point = this.CGFTOPoint(pCGFEntity);
    this.updateRenderCGF(point);
    let line = this.NavPathTOLine(pCGFEntity);
    if (line.length > 0) {
        this.updateRenderCGFNav(line);
    }

};
CGFEntityLayer.prototype.updateNavPathLayer = function (pCGFEntity) {
    let line = this.NavPathTOLine(pCGFEntity);
    this.updateRenderCGFNav(line);
};

CGFEntityLayer.prototype.CGFTOPoint = function (pCGFEntity) {
    var lng = pCGFEntity.position.x;
    var lat = pCGFEntity.position.y;
    var h = pCGFEntity.position.z;
    if (lng == 0 && lat == 0) {
        return null;
    }
    var point = turf.point([lng, lat], Object.assign({}, pCGFEntity));
    let color = SideTOColor(pCGFEntity.getSide());
    point.properties.color = color;
    delete point.properties.parent;
    delete point.properties.children;
    delete point.properties.position;
    delete point.properties.navPath;
    return point;
};
CGFEntityLayer.prototype.NavPathTOLine = function (pCGFEntity) {
    var line = [];
    if (pCGFEntity.getNodeType() == NodeUnit.NodeCGF) {
        var navPointCount = pCGFEntity.navPath.getNavPointCount();
        if (navPointCount > 0) {
            var points = [];
            for (let k = 0; k < navPointCount; k++) {
                var navPoint = pCGFEntity.navPath.getNavPointByIndex(k);
                var time = navPoint.stamp;
                var lng = Number(navPoint.position.x);
                var lat = Number(navPoint.position.y);
                var h = Number(navPoint.position.z);
                var _point = [lng, lat];
                points.push(_point);
            }

            if (points.length < 2) {
                line = [];
            } else {
                line = turf.lineString(points, Object.assign({}, pCGFEntity));
                let color = SideTOColor(pCGFEntity.getSide());
                line.properties.color = color;
                delete line.properties.parent;
                delete line.properties.children;
                delete line.properties.position;
                delete line.properties.navPath;
            }

        }

    };
    return line;
};

CGFEntityLayer.prototype.AreaPathTOPolygon = function (pCGFEntity) {
    let polygon = [];
    let areaId = pCGFEntity.getAreaId();
    let list = this.areaPaths.getList();
    for (let i = 0; i < list.length; i++) {
        let _areaPath = list[i];
        if (_areaPath.getNum() == areaId && _areaPath.getAreaPointCount() >= 4) {
            var points = [];
            for (let k = 0; k < _areaPath.getAreaPointCount(); k++) {
                var areaPoint = _areaPath.getAreaPointByIndex(k);
                var lng = Number(areaPoint.position.x);
                var lat = Number(areaPoint.position.y);
                var h = Number(areaPoint.position.z);
                var _point = [lng, lat];
                points.push(_point);
            }
            polygon = turf.polygon([points], Object.assign({}, pCGFEntity));
            // let color = SideTOColor(pCGFEntity.getSide());
            // polygon.properties.color = color;
            delete polygon.properties.parent;
            delete polygon.properties.children;
            delete polygon.properties.position;
            delete polygon.properties.navPath;
            return polygon;
        }
    }
};
CGFEntityLayer.prototype.readData = function (pCGFEntity) {
    // console.log('CGFLayer readData')
    if (pCGFEntity.parent == null) {
        for (let i = 0; i < pCGFEntity.children.length; i++) {
            this.readData(pCGFEntity.children[i]);
        }
        return;
    }
    if (pCGFEntity.getNodeType() == NodeUnit.NodeGroup) {

        for (let j = 0; j < pCGFEntity.children.length; j++) {
            let child = pCGFEntity.children[j];
            this.readData(child);
        }
    } else {
        let point = this.CGFTOPoint(pCGFEntity);
        if (point) {
            this.pointList.push(point);
        }
        var navPointCount = pCGFEntity.navPath.getNavPointCount();
        if (navPointCount > 0) {
            let line = this.NavPathTOLine(pCGFEntity);
            this.lineList.push(line);
        }
        // let areaId = pCGFEntity.getAreaId();
        // if(areaId>0){
        //     let polygon = this.AreaPathTOPolygon(pCGFEntity);
        //     this.polygonList.push(polygon);
        // }
    }
};

CGFEntityLayer.prototype.clear = function () {
    this.pointList = [];
    this.lineList = [];
    this.childCGFList = [];
    this.pointLayer = [];
    this.pointListLayer = null;
    this.CGFNameListLayer = null;

    this.pointListLayers = new ListLayers();
    this.CGFNameListLayers = new ListLayers();
    this.navPathLayers = new ListLayers();

    this.type = null;
}

CGFEntityLayer.prototype.removeAllLayers = function () {

    let pList = this.pointListLayers.getList();
    for (let p_i = 0; p_i < pList.length; p_i++) {
        PIE_Map.map.remove(pList[p_i]);
    }
    let nList = this.CGFNameListLayers.getList();
    for (let n_i = 0; n_i < nList.length; n_i++) {
        PIE_Map.map.remove(nList[n_i]);
    }

    let lList = this.navPathLayers.getList();
    for (let l_i = 0; l_i < lList.length; l_i++) {
        PIE_Map.map.remove(lList[l_i]);
    }
    this.clear();

}

CGFEntityLayer.prototype.addPoint = function (pCGFEntity) {
    let point = this.CGFTOPoint(pCGFEntity);
    // console.log(this.pointList);
    for (let i = 0; i < this.pointList.length; i++) {
        if (pCGFEntity.id == this.pointList[i].properties.id) {
            this.pointList[i] = point;
            this.updateRenderCGF(point);
            return
        }
    }
    this.createRenderCGF(point);
    this.pointList.push(point);
};
CGFEntityLayer.prototype.update = function (datamodel) {
    this.removeAllLayers();
    this.initLayer(datamodel)
};
CGFEntityLayer.prototype.updateByStatus = function (datamodel, addStatus) {
    this.removeAllLayers();
    this.type = 1;
    this.initLayer(datamodel)
};
CGFEntityLayer.prototype.addInterestPoint = function (_feature, id) {
    if (PIE_Map.map.getLayer('CGFInterest_' + id)) {
        PIE_Map.map.remove(PIE_Map.map.getLayer('CGFInterest_' + id))
    }
    var interestLayer = new InterestLayer({
        id: 'CGFInterest_' + id,
        data: _feature,
        map: PIE_Map.map,
    })
    PIE_Map.map.add(interestLayer);
    //this.pointListLayers.addChild(iconLayer)
}

CGFEntityLayer.prototype.updateSideLayer = function (pCGFEntity) {
    let point = this.CGFTOPoint(pCGFEntity);
    this.createRenderCGF(point, true);
    this.pointList.push(point);
    // let line = this.NavPathTOLine(pCGFEntity);
    // if (line.length > 0) {
    //     this.updateRenderCGFNav(line,true);
    // }
}

export default CGFEntityLayer;