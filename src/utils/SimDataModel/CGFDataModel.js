import {
    String2XML,
    XML2String,
    DownloadXML
} from './utils';
import {
    NodeUnit,
    SideEnum
} from './NodeConfig';
import NavPathList from './NavPathList';
import AreaPathList from '../Area/AreaPathList';
import AreaLibPathList from '../Area/AreaLibPathList';
import RoutePathList from '../Route/RoutePathList';
import environmentList from '../environment/environmentList';
import equipmentList from '../equipment/equipmentList';
import newsList from '../news/newsList';
import CGFEntity from './CGFEntity';

var CGFDataModel = function () {
    this.vecNodes = [];
    this.file = null;
    this.navPathNodes = null;
    this.areaPathNodes = null;

    this.routePathNodes = null;

    this.environmentNodes = null;

    this.areaLibPathNodes = null;

    this.Init();
}
CGFDataModel.prototype.Init = function () {
    var pRootCGFEntity = new CGFEntity(null, NodeUnit.NodeType.NodeGroup);
    pRootCGFEntity.setName("红方");
    pRootCGFEntity.setSide(SideEnum.SideRed);
    this.vecNodes.push(pRootCGFEntity);

    var pRootCGFEntity = new CGFEntity(null, NodeUnit.NodeType.NodeGroup);
    pRootCGFEntity.setName("蓝方");
    pRootCGFEntity.setSide(SideEnum.SideBlue);
    this.vecNodes.push(pRootCGFEntity);
}

CGFDataModel.prototype.getCGFEntityById = function (id) {

    let pResult = null;
    for (let i = 0; i < this.vecNodes.length; i++) {
        var pCGFEntity = this.vecNodes[i];
        if (pResult) {
            return pResult
        } else {
            getCGFEntity(pCGFEntity);
        }

    }

    function getCGFEntity(pCGFEntity) {
        if (pCGFEntity.parent == null) {
            for (let i = 0; i < pCGFEntity.children.length; i++) {
                getCGFEntity(pCGFEntity.children[i]);
            }
            return;
        }
        if (pCGFEntity.getNodeType() == NodeUnit.NodeGroup) {

            for (let j = 0; j < pCGFEntity.children.length; j++) {
                let child = pCGFEntity.children[j];
                getCGFEntity(child);
            }
        } else {
            if (pCGFEntity.getId() == id) {
                pResult = pCGFEntity
                return
            }

        }
    }

    return pResult;
}
CGFDataModel.prototype.GetRootCGFEntity = function (nSide) {
    var pResult = null;
    for (let i = 0; i < this.vecNodes.length; i++) {
        if (this.vecNodes[i].getSide() == nSide) {
            pResult = this.vecNodes[i];
            break;
        }
    }
    return pResult;
}

CGFDataModel.prototype.GetRootCGFEntitynSide = function (nSide) {
    var pResult = [];
    for (let i = 0; i < this.vecNodes.length; i++) {
        if (this.vecNodes[i].getSide() != nSide) {
            pResult = pResult.concat(this.vecNodes[i]);
            break;
        }
    }
    return pResult;
}
CGFDataModel.prototype.GetRootCGFEntitys = function () {
    return this.vecNodes;
}
CGFDataModel.prototype.Clear = function () {
    this.vecNodes = [];
    this.file = null;
    this.navPathNodes = null;
    this.areaPathNodes = null;
    this.routePathNodes = null;
    this.environmentNodes = null;
    this.equipmentNodes = null;

    this.areaLibPathNodes = null;
}

CGFDataModel.prototype.LoadXml = function (filePath) {
    this.Clear();
    let _this = this;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, false);
    xhr.onload = () => {
        _this.loadXmlString(xhr.responseText)
    }
    xhr.onerror = () => {
        console.log(xhr.statusText)
    };
    xhr.send();
}
CGFDataModel.prototype.loadXmlString = function (xmlString) {
    this.Clear();
    var _this = this;
    this.file = String2XML(xmlString);
    var cgfRootNode = _this.file.getElementsByTagName('作战兵力');
    if (cgfRootNode == null) {
        return false;
    }
    var childElements = cgfRootNode[0].children;
    for (var i = 0; i < childElements.length; i++) {
        var childElement = childElements[i];
        var nodeName = childElement.nodeName;
        var pRootCGFEntity = new CGFEntity(null, NodeUnit.NodeType.NodeGroup);
        pRootCGFEntity.setName(nodeName);
        if (nodeName == "红方") {
            pRootCGFEntity.setSide(SideEnum.SideRed);
        } else if (nodeName == "蓝方") {
            pRootCGFEntity.setSide(SideEnum.SideBlue);
        } else if (nodeName == "绿方") {
            pRootCGFEntity.setSide(SideEnum.SideGreen);
        } else if (nodeName == "橙方") {
            pRootCGFEntity.setSide(SideEnum.SideOrange);
        } else if (nodeName == "黄方") {
            pRootCGFEntity.setSide(SideEnum.SideYellow);
        } else if (nodeName == "紫方") {
            pRootCGFEntity.setSide(SideEnum.SidePurple);
        }

        var eleCGFList = childElement.children;
        for (var j = 0; j < eleCGFList.length; j++) {
            var eleCGF = eleCGFList[j];
            var pCGFEntity = new CGFEntity(pRootCGFEntity, NodeUnit.NodeType.Unkown);
            pCGFEntity.readXml(eleCGF);
        }
        this.vecNodes.push(pRootCGFEntity);
    }

    let navPaths = _this.file.getElementsByTagName('导航线组')
    //let navPathElements = navPaths[0].children;
    this.navPathNodes = new NavPathList(navPaths);

    //let areaPaths = _this.file.getElementsByTagName('区域组');

    //this.areaPathNodes = new AreaPathList(areaPaths);

    let areaLibPaths = _this.file.getElementsByTagName('区域库');

    this.areaPathNodes = new AreaLibPathList(areaLibPaths);

    let routePaths = _this.file.getElementsByTagName('路线库');

    this.routePathNodes = new RoutePathList(routePaths);

    let environment = _this.file.getElementsByTagName('环境库');

    this.environmentNodes = new environmentList(environment);

    let equipment = _this.file.getElementsByTagName('装备列表');

    this.equipmentNodes = new equipmentList(equipment);

    let news = _this.file.getElementsByTagName('情报列表');

    this.newsNodes = new newsList(news);
}
CGFDataModel.prototype.save = function () {
    this.writeXml();
    DownloadXML(XML2String(this.file), "XD")
}
CGFDataModel.prototype.upload = function () {
    this.writeXml();
    return XML2String(this.file)
}
CGFDataModel.prototype.writeXml = function () {
    var CGFGroup = this.file.getElementsByTagName("作战兵力")[0];
    for (let node_i = CGFGroup.children.length - 1; node_i >= 0; node_i--) {
        let node = CGFGroup.children[node_i];
        node.remove();
    }
    for (let i = 0; i < this.vecNodes.length; i++) {
        var pCGFEntity = this.vecNodes[i];
        pCGFEntity.writeXml(CGFGroup,this.navPathNodes);
    }
    let navPathNode = this.file.getElementsByTagName("导航线组");
    if (navPathNode) {
        if (navPathNode.length < 1) {
            let navPathelement = this.file.createElement("导航线组");
            this.file.getElementsByTagName("通用想定")[0].appendChild(navPathelement)
            
            this.navPathNodes.writeXml(navPathelement)
        } else {
            let navPathList = navPathNode[0];
            for (let node_i = navPathList.children.length - 1; node_i >= 0; node_i--) {
                let node = navPathList.children[node_i];
                node.remove();
            }
            this.navPathNodes.writeXml(navPathList)
        }
    }

    let areaPathNode = this.file.getElementsByTagName("区域组");
    if (areaPathNode) {
        if (areaPathNode.length < 1) {

        } else {
            let areaPathList = areaPathNode[0];
            for (let areanode_i = areaPathList.children.length - 1; areanode_i >= 0; areanode_i--) {
                let node = areaPathList.children[areanode_i];
                node.remove();
            }
            this.areaPathNodes.writeXml(areaPathList)
        }
    }
    // 环境库 this.environmentNodes
    let environmentNode = this.file.getElementsByTagName("环境库");
    if (environmentNode) {
        if (environmentNode.length < 1) {

        } else {
            let environmentList = environmentNode[0];
            for (let environment_i = environmentList.children.length - 1; environment_i >= 0; environment_i--) {
                let node = environmentList.children[environment_i];
                node.remove();
            }
            this.environmentNodes.writeXml(environmentList)
        }
    }
}
export default CGFDataModel