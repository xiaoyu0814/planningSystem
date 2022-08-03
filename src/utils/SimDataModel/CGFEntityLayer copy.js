import {
    NodeUnit
} from '@/utils/SimDataModel/NodeConfig'
import PIE_Map from '@/utils/map';
import store from "@/store";

var CGFEntityLayer = function (datamodel) {
    this.pointList = [];
    this.lineList = [];
    this.childCGFList = [];
    this.pointLayer = [];
    this.pointListLayer = null;
    this.CGFNameListLayer = null;
    this.navPathLayers = [];

    this.initLayer(datamodel)
}
CGFEntityLayer.prototype.initLayer = function (datamodel) {
    for (let i = 0; i < datamodel.vecNodes.length; i++) {
        var pCGFEntity = datamodel.vecNodes[i];
        this.readData(pCGFEntity);
    }
    var feature = turf.featureCollection(this.pointList);
    this.pointListLayer = new PIE.MetoStyle.PointLayer({
        id: "CGFPoint",
        data: feature,
        color: {
            "type": "identity",
            "property": "color"
        }
    });
    this.CGFNameListLayer = new PIE.MetoStyle.TextLayer({
        data: feature,
        id: "CGFName",
        text: "name",
        offset: [0, 0.5],
        color: {
            "type": "identity",
            "property": "color"
        },
        overlap: true,
        visible: true
    });
    for (var i = 0; i < this.lineList.length; i++) {
        var lineListLayer = new PIE.MetoStyle.LineLayer({
            data: {
                "type": "FeatureCollection",
                "features": this.lineList[i].data
            },
            id: this.lineList[i].id,
            color: "#ff0000",
            width: 2
        });
        this.navPathLayers.push(lineListLayer)
        PIE_Map.map.add(lineListLayer);
    }

    // Test(feature,"test.json");
    PIE_Map.map.add(this.pointListLayer);
    PIE_Map.map.add(this.CGFNameListLayer);
};
CGFEntityLayer.prototype.removeRenderLayer = function (pCGFEntity) {
    for (let i = 0; i < this.pointList.length; i++) {
        if (pCGFEntity.id == this.pointList[i].properties.id) {
            this.pointList.splice(i, 1)
            this.updataLayer();
            return
        }
    }
};
CGFEntityLayer.prototype.render = function (datamodel, navPathlayerIdToBeRemoved) {
    this.pointList = [];
    if (navPathlayerIdToBeRemoved || navPathlayerIdToBeRemoved == 0) {
        for (let i = 0; i < this.lineList.length; i++) {
            if (this.lineList[i].id == ("line_" + navPathlayerIdToBeRemoved)) {
                this.lineList[i].data = []
            }
        }
    } else {
        this.lineList = [];
    }
    for (let i = 0; i < datamodel.vecNodes.length; i++) {
        var pCGFEntity = datamodel.vecNodes[i];
        this.readData(pCGFEntity);
    }
    this.updataLayer();
};

CGFEntityLayer.prototype.readData = function (pCGFEntity) {

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
        var lng = pCGFEntity.position.x;
        var lat = pCGFEntity.position.y;
        var h = pCGFEntity.position.z;
        var point = turf.point([lng, lat], Object.assign({}, pCGFEntity));
        // point.properties.color = point.properties.side == 1 ? "#F00" : "#00F";
        if (point.properties.side == 1) {
            point.properties.color = "#F00"
        } else if (point.properties.side == 2) {
            point.properties.color = "#00F"
        } else if (point.properties.side == 3) {
            point.properties.color = "#0F0"
        } else if (point.properties.side == 4) {
            point.properties.color = "#00F"
        } else if (point.properties.side == 5) {
            point.properties.color = "#FF0"
        } else {
            point.properties.color = "#000"
        }

        delete point.properties.parent;
        delete point.properties.children;
        delete point.properties.position;
        delete point.properties.navPath
        this.pointList.push(point);
        var navPointCount = pCGFEntity.navPath.getNavPointCount();
        if (navPointCount > 0) {
            var points = [];
            store.state.vue.$set(store.state.navPathData, pCGFEntity.id, []);
            if (store.state.lineLayerId.indexOf(pCGFEntity.id) == -1) {
                store.state.lineLayerId.push(pCGFEntity.id);
            }
            // store.state.navPathId = pCGFEntity.id
            for (let k = 0; k < navPointCount; k++) {
                var navPoint = pCGFEntity.navPath.getNavPointByIndex(k);
                var time = navPoint.stamp;
                var lng = navPoint.position.x;
                var lat = navPoint.position.y;
                var h = navPoint.position.z;
                var _point = [lng, lat];
                points.push(_point);
                // 航路线表格回显
                var navTableData = {
                    stamp: time,
                    x: lng,
                    y: lat,
                    z: h
                }
                store.state.navPathData[pCGFEntity.id].push(navTableData)
            }
            var line
            if (points.length < 2) {
                line = []
                store.state.navPathData[pCGFEntity.id] = []
            } else {
                line = [turf.lineString(points)];
            }

            var temp = {
                data: line,
                id: "line_" + pCGFEntity.id
            }
            this.lineList.push(temp);
        }
    }
};

CGFEntityLayer.prototype.updataLayer = function () {
    var feature = turf.featureCollection(this.pointList);
    if (PIE_Map.map.getLayer("CGFPoint")) {
        this.pointListLayer.setSource(feature)
    }
    if (PIE_Map.map.getLayer("CGFName")) {
        this.CGFNameListLayer.setSource(feature)
    }
    for (let i = 0; i < this.lineList.length; i++) {
        var linelayer = PIE_Map.map.getLayer(this.lineList[i].id)
        if (linelayer) {
            linelayer.setSource({
                "type": "FeatureCollection",
                "features": this.lineList[i].data
            })
        }
    }
}
CGFEntityLayer.prototype.addPoint = function (pCGFEntity) {
    var lng = pCGFEntity.position.x;
    var lat = pCGFEntity.position.y;
    var h = pCGFEntity.position.z;
    var point = turf.point([lng, lat], Object.assign({}, pCGFEntity));
    // point.properties.color = point.properties.side == 1 ? "#F00" : "#00F";
    console.log(point.properties.side)
    if (point.properties.side == 1) {
        point.properties.color = "#F00"
    } else if (point.properties.side == 2) {
        point.properties.color = "#00F"
    } else if (point.properties.side == 3) {
        point.properties.color = "#0F0"
    } else if (point.properties.side == 4) {
        point.properties.color = "#00F"
    } else if (point.properties.side == 5) {
        point.properties.color = "#FF0"
    } else {
        point.properties.color = "#000"
    }

    delete point.properties.parent;
    delete point.properties.children;
    delete point.properties.position;
    delete point.properties.navPath;
    console.log(this.pointList);
    for (let i = 0; i < this.pointList.length; i++) {
        if (pCGFEntity.id == this.pointList[i].properties.id) {
            this.pointList[i] = point;
            this.updataLayer();
            return
        }
    }
    this.pointList.push(point);
    this.updataLayer();
}

export default CGFEntityLayer;