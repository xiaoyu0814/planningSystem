import {
    String2XML,
    XML2String
} from './utils';
import {
    NodeUnit,
    SideEnum
} from './NodeConfig';
import NavPath from './NavPath';
import GeoData from './GeoData';

var xmlStream = String2XML();

var CGFEntity = function (parent, nodeType) {
    this.name = null;
    this.id = -1;
    this.typeId = -1;
    this.modelId = -1;
    this.doctrineId = -1;
    this.side = -1;
    this.speed = 0;
    this.heading = 0;
    this.targetId = -1;
    this.AOIId = -1;
    this.parent = parent;
    this.nodeType = nodeType;
    this.formationId = -1;

    this.carrier = -1; //载体
    this.base = -1; //基地

    this.hangingBullet = []; // 挂弹
    this.bait = []; // 诱饵
    this.sensor = [] // 传感器

    this.visible = true // 兵力是否可见

    // this.areaId = -1;
    this.children = [];
    if (parent) {
        parent.addChild(this);
    }
    this.position = {
        x: 0,
        y: 0,
        z: 0
    }

    this.geoData = null;
    this.navPath = new NavPath();
}
CGFEntity.prototype = Object.assign({
    getName: function () {
        return this.name;
    },
    setName: function (name) {
        this.name = name;
    },
    getId: function () {
        return this.id;
    },
    setId: function (id) {
        this.id = id;
    },
    getTypeId: function () {
        return this.typeId;
    },
    setTypeId: function (typeId) {
        this.typeId = typeId;
    },
    getModelId: function () {
        return this.modelId;
    },
    setModelId: function (modelId) {
        this.modelId = modelId;
    },
    getDoctrineId: function () {
        return this.doctrineId;
    },
    setDoctrineId: function (doctrineId) {
        this.doctrineId = doctrineId;
    },
    getSide: function () {
        return this.side;
    },
    setSide: function (side) {
        this.side = side;
    },
    getSpeed: function () {
        return this.speed;
    },
    setSpeed: function (speed) {
        this.speed = speed;
    },
    getHeading: function () {
        return this.heading;
    },
    setHeading: function (heading) {
        this.heading = heading;
    },
    getTargetId: function () {
        return this.targetId;
    },
    setTargetId: function (targetId) {
        this.targetId = targetId;
    },
    getAOIId: function () {
        return this.AOIId;
    },
    setAOIId: function (AOIId) {
        this.AOIId = AOIId;
    },
    getNodeType: function () {
        return this.nodeType;
    },
    setNodeType: function (nodeType) {
        this.nodeType = nodeType;
    },
    getFormationId: function () {
        return this.formationId;
    },
    setFormationId: function (formationId) {
        this.formationId = formationId;
    },
    getGeoData: function () {

        return this.geoData;
    },
    setGeoData: function (geoData) {
        this.geoData = geoData;
    },
    getPosition: function () {
        return this.position;
    },
    setPosition: function (position) {
        this.position = position;
    },
    getNavPath: function () {
        return this.navPath;
    },
    setNavPath: function (navPath) {
        this.navPath = navPath;
    },
    getCarrier: function () {
        return this.carrier;
    },
    setCarrier: function (carrier) {
        this.carrier = carrier;
    },
    getBase: function () {
        return this.base;
    },
    setBase: function (base) {
        this.base = base;
    },
    // getAreaId:function(){
    //     return this.areaId;
    // },
    // setAreaId:function(areaId){
    //     this.areaId = areaId;
    // },
    getChildren: function () {
        return this.children;
    },
    getParent: function () {
        return this.parent;
    },
    setParent: function (parent) {
        if (this.parent != null) {
            this.parent.takeChild(this);
        }

        if (parent != null) {
            parent.addChild(this);
        }
    },
    addHangingBullet(node) {
        this.hangingBullet.push(node)
    },
    getHangingBullet() {
        return this.hangingBullet
    },
    setBait(node) {
        this.bait.push(node)
    },
    getBait() {
        return this.bait
    },
    setSensor(node) {
        this.sensor.push(node)
    },
    getSensor() {
        return this.sensor
    },
}, {
    addChild: function (child) {
        if (child == null) {
            return;
        }

        child.parent = this;
        child.side = this.side;
        this.children.push(child);
    },
    addChildren: function (children) {
        for (let i = 0; i < children.length; i++) {
            children[i].parent = this;
            children[i].side = this.side;
        }
        this.children.concat(children);
    },
    insertChild: function (index, child) {
        child.parent = this;
        child.side = this.side;
        this.children.splice(index, 0, child);
    },
    insertChildren: function (index, children) {
        for (let i = 0; i < children.length; i++) {
            children[i].parent = this;
            children[i].side = this.side;
            this.children.splice(index + i, 0, children[i]);
        }
    },
    removeChild: function (child) {
        var i = this.children.indexOf(child);
        if (i >= 0) {
            this.removeChildrenPrivate(i, 1, true);
        }
    },
    removeAllChildren: function () {
        this.removeChildrenPrivate(0, this.children.length, false);
    },
    removeChildrenPrivate: function (from, count, destroy) {
        if (from < 0 || count <= 0) {
            return;
        }
        this.children.splice(from, count);

    },
    takeChild: function (index) {
        if (index < 0) {
            return null;
        }

        let n = children.length;

        if (index >= n) {
            return null;
        }

        var pChild = this.children[index];

        this.removeChildrenPrivate(index, 1, false);

        return pChild;
    },
    child: function (index) {
        if (index < 0) {
            return null;
        }

        let n = children.length;

        if (index >= n) {
            return null;
        }

        return this.children[index];
    },
    childCount: function () {
        return this.children.length;
    },
    indexOfChild: function (child) {
        return this.children.indexOf(child);
    },
    //初始地理数据
    initGeoData: function (geoData) {
        let _geoData = new GeoData();
        var interestArea = geoData.getAttribute("兴趣区") || -1;
        var operationArea = geoData.getAttribute("操作区") || -1;
        var operationRoute = geoData.getAttribute("操作路线") || -1;
        _geoData.setInterestAreaId(Number(interestArea));
        _geoData.setOperationAreaId(Number(operationArea));
        _geoData.setOperationRouteId(Number(operationRoute));

        var interestPoints = geoData.children;
        for (let interest_i = 0; interest_i < interestPoints.length; interest_i++) {
            var childElement = interestPoints[interest_i];
            var _strlon = childElement.getAttribute("经度");
            var _strlat = childElement.getAttribute("纬度");
            var _strhight = childElement.getAttribute("高度");
            _geoData.interestPoint.x = Number(_strlon);
            _geoData.interestPoint.y = Number(_strlat);
            _geoData.interestPoint.z = Number(_strhight);
        }
        this.setGeoData(_geoData);
    },
    readXml: function (element) {
        var nodeName = element.nodeName;
        if (nodeName == '指挥') {
            var strName = element.getAttribute('名称');
            var strId = Number(element.getAttribute("标识"));
            var strTypeId = element.getAttribute("类型");
            var strDoctrinelId = element.getAttribute("行为");
            var strFormationId = element.getAttribute("编队") || -1;
            var strCarrier = element.getAttribute("载体") || -1;
            // this.carrier = null; //载体
            // this.base = null;  //基地
            // var strAreaId = element.getAttribute("区域") || -1;
            this.setName(strName);
            this.setId(strId);
            if (strId > NodeUnit.nodeId) {
                NodeUnit.nodeId = strId;
            }
            this.setTypeId(strTypeId);
            this.setDoctrineId(strDoctrinelId);
            this.setFormationId(strFormationId);
            // this.setAreaId(Number(strAreaId));
            this.setNodeType(NodeUnit.NodeGroup);

            this.setCarrier(Number(strCarrier));

            var childElements = element.children;
            for (let i = 0; i < childElements.length; ++i) {
                var childElement = childElements[i];
                if (childElement.nodeName == "指挥" || childElement.nodeName == "兵力") {
                    var pCGFEntity = new CGFEntity(this, NodeUnit.NodeType.Unkown);
                    pCGFEntity.readXml(childElement);
                } else {
                    var geoData = childElement.getElementsByTagName("地理数据")[0];
                    if (geoData) {
                        this.initGeoData(geoData);
                    }
                }

            }

        } else if (nodeName == '兵力') {
            var strName = element.getAttribute('名称');
            var strId = Number(element.getAttribute("标识"));
            var strTypeId = element.getAttribute("类型");
            var strModelId = element.getAttribute("型号");
            var strDoctrinelId = element.getAttribute("行为");

            var strBase = element.getAttribute("基地") || -1;
            // var strAreaId = element.getAttribute("区域") || -1;
            if (strId > NodeUnit.nodeId) {
                NodeUnit.nodeId = strId;
            }
            this.setName(strName);
            this.setId(strId);
            this.setTypeId(Number(strTypeId));
            this.setModelId(Number(strModelId));
            this.setDoctrineId(Number(strDoctrinelId));
            // this.setAreaId(Number(strAreaId));

            this.setNodeType(NodeUnit.NodeCGF);

            this.setBase(Number(strBase));

            {
                var geoData = element.getElementsByTagName("地理数据")[0];
                if (geoData) {
                    this.initGeoData(geoData);
                }

            } {
                var eleMotion = element.getElementsByTagName("机动")[0]; //机动
                var strspeed = eleMotion.getAttribute("速度");
                var strheading = eleMotion.getAttribute("航向");

                this.setSpeed(Number(strspeed));
                this.setHeading(Number(strheading));
            }

            {
                var elePosition = element.getElementsByTagName("位置")[0];
                var strlon = elePosition.getAttribute("经度");
                var strlat = elePosition.getAttribute("纬度");
                var strhei = elePosition.getAttribute("高度");

                this.position.x = Number(strlon);
                this.position.y = Number(strlat);
                this.position.z = Number(strhei);
            }

            var eleNavPath = element.getElementsByTagName("导航线")[0];
            if (eleNavPath) {
                var strLoopIndex = eleNavPath.getAttribute("循环");
                this.navPath.SetLoopIndex(Number(strLoopIndex));

                var navPointElements = eleNavPath.children;
                for (let i = 0; i < navPointElements.length; i++) {
                    var childElement = navPointElements[i];
                    var strtime = childElement.getAttribute("时间");
                    var strlon = childElement.getAttribute("经度");
                    var strlat = childElement.getAttribute("纬度");
                    var strhei = childElement.getAttribute("高度");

                    var navPoint = {
                        position: {

                        }
                    };
                    navPoint.stamp = Number(strtime);
                    navPoint.position.x = Number(strlon);
                    navPoint.position.y = Number(strlat);
                    navPoint.position.z = Number(strhei);

                    this.navPath.AddNavPoint(navPoint);
                }
            } else {

            }

            var hangingBullet = element.getElementsByTagName("挂弹")[0];
            if (hangingBullet) {
                var arms = hangingBullet.getElementsByTagName("武器");
                for (let i = 0; i < arms.length; i++) {
                    var serialNumber = arms[i].getAttribute("序号");
                    var name = arms[i].getAttribute("名称");
                    var ammunition_node = arms[i].children;
                    var ammunition = []
                    for (let k = 0; k < ammunition_node.length; k++) {
                        var serialNumber_ammunition = ammunition_node[k].getAttribute("序号")
                        var name_ammunition = ammunition_node[k].getAttribute("名称")
                        var quantity_ammunition = Number(ammunition_node[k].getAttribute("数量"))
                        ammunition.push({
                            serialNumber_ammunition,
                            quantity_ammunition,
                            name_ammunition
                        })
                    }

                    var temp_arms = {
                        serialNumber,
                        ammunition,
                        name
                    }
                    this.addHangingBullet(temp_arms)
                }
            }

            var bait = element.getElementsByTagName("诱饵")[0];
            if (bait) {
                var load_element = bait.getElementsByTagName("装载");
                for (let i = 0; i < load_element.length; i++) {
                    var serialNumber = load_element[i].getAttribute("序号");
                    var name = load_element[i].getAttribute("名称");
                    var quantity = load_element[i].getAttribute("数量");
                    var load = {
                        serialNumber,
                        quantity,
                        name
                    }
                    this.setBait(load)
                }
            }
            var sensorPlan = element.getElementsByTagName("传感器计划")[0];
            if (sensorPlan) {
                var sensor_element = sensorPlan.getElementsByTagName("传感器");
                for (let i = 0; i < sensor_element.length; i++) {
                    var serialNumber = sensor_element[i].getAttribute("序号");
                    var name = sensor_element[i].getAttribute("名称");
                    var model = sensor_element[i].getAttribute("模式");
                    var scanningMode = sensor_element[i].getAttribute("扫描方式");
                    var startAngle = sensor_element[i].getAttribute("起始角");
                    var endangle = sensor_element[i].getAttribute("终止角");
                    var sensor = {
                        serialNumber,
                        model,
                        scanningMode,
                        startAngle,
                        endangle,
                        name
                    }
                    this.setSensor(sensor)
                }
            }
        }
    },
    writeXml: function (xmlObject, navPathNodes) {
        if (this.parent == null) {
            //stream.writeStartElement(this->getName());
            var node = xmlStream.createElement(this.getName());
            xmlObject.appendChild(node);
            xmlObject.append("\n\t");
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].writeXml(node, navPathNodes);
            }
            //stream.writeEndElement();
            return;
        }

        if (this.getNodeType() == NodeUnit.NodeGroup) {
            var node = xmlStream.createElement("指挥");
            xmlObject.append("\n\t");
            xmlObject.appendChild(node);
            xmlObject.append("\n\t");
            node.setAttribute("标识", this.getId());
            node.setAttribute("名称", this.getName());
            node.setAttribute("类型", this.getTypeId());
            if (this.getDoctrineId() > 0) {
                node.setAttribute("行为", this.getDoctrineId());
            }
            if (this.getFormationId() > 0) {
                node.setAttribute("编队", this.getFormationId());
            }
            if (this.getCarrier() > 0) {
                node.setAttribute("载体", this.getCarrier());
            }
            // node.setAttribute("区域", this.getAreaId());
            if (this.geoData) {
                this.geoData.writeXml(node);
            }
            for (let j = 0; j < this.children.length; j++) {
                let child = this.children[j];
                child.writeXml(node, navPathNodes);
            }

        } else {
            var node = xmlStream.createElement("兵力");
            xmlObject.append("\n\t");
            xmlObject.appendChild(node);
            xmlObject.append("\n\t");
            node.setAttribute("标识", this.getId());
            node.setAttribute("名称", this.getName());
            node.setAttribute("类型", this.getTypeId());
            node.setAttribute("型号", this.getModelId());
            if (this.getDoctrineId() > 0) {
                node.setAttribute("行为", this.getDoctrineId());
            }
            if (this.getFormationId() > 0) {
                node.setAttribute("编队", this.getFormationId());
            }
            if (this.getBase() > 0) {
                node.setAttribute("基地", this.getBase());
            }
            // node.setAttribute("区域", this.getAreaId());
            if (this.geoData) {
                this.geoData.writeXml(node);
            }
            var node_maneuver = xmlStream.createElement("机动");
            node.append("\n\t");
            node.appendChild(node_maneuver);
            node.append("\n\t");
            node_maneuver.setAttribute("速度", this.getSpeed());
            node_maneuver.setAttribute("航向", this.getHeading());

            var node_position = xmlStream.createElement("位置");
            node.appendChild(node_position);
            node.append("\n\t");
            node_position.setAttribute("经度", this.position.x);
            node_position.setAttribute("纬度", this.position.y);
            node_position.setAttribute("高度", this.position.z);
            if (window.navPath_value > 0) {
                if ((this.getModelId() == 2125770525 || this.getModelId() == 2118634858 || this.getModelId() == 2135514786) && this.side == 1) {
                    let navPathData = navPathNodes.getChildByNum(window.navPath_value)
                    console.log(navPathData);
                    var node_navPath = xmlStream.createElement("导航线");
                    node.appendChild(node_navPath);
                    node.append("\n\t");
                    node_navPath.setAttribute("循环", -1);
                    for (let k = 0; k < navPathData.NavPointlist.length; k++) {
                        const element = navPathData.NavPointlist[k]
                        var node_navPoint = xmlStream.createElement("航路点");
                        node_navPath.appendChild(node_navPoint);
                        node_navPath.append("\n\t");
                        node_navPoint.setAttribute("时间", element.stamp);
                        node_navPoint.setAttribute("经度", element.position.x);
                        node_navPoint.setAttribute("纬度", element.position.y);
                        node_navPoint.setAttribute("高度", element.position.z);
                    }
                } else {
                    var navPointCount = this.navPath.getNavPointCount();
                    if (navPointCount > 0) {
                        var node_navPath = xmlStream.createElement("导航线");
                        node.appendChild(node_navPath);
                        node.append("\n\t");
                        node_navPath.setAttribute("循环", this.navPath.getLoopIndex());
                        for (let k = 0; k < navPointCount; k++) {
                            var navPoint = this.navPath.getNavPointByIndex(k);
                            var node_navPoint = xmlStream.createElement("航路点");
                            node_navPath.appendChild(node_navPoint);
                            node_navPath.append("\n\t");
                            node_navPoint.setAttribute("时间", navPoint.stamp);
                            node_navPoint.setAttribute("经度", navPoint.position.x);
                            node_navPoint.setAttribute("纬度", navPoint.position.y);
                            node_navPoint.setAttribute("高度", navPoint.position.z);

                        }
                    }
                }
            } else {
                var navPointCount = this.navPath.getNavPointCount();
                if (navPointCount > 0) {
                    var node_navPath = xmlStream.createElement("导航线");
                    node.appendChild(node_navPath);
                    node.append("\n\t");
                    node_navPath.setAttribute("循环", this.navPath.getLoopIndex());
                    for (let k = 0; k < navPointCount; k++) {
                        var navPoint = this.navPath.getNavPointByIndex(k);
                        var node_navPoint = xmlStream.createElement("航路点");
                        node_navPath.appendChild(node_navPoint);
                        node_navPath.append("\n\t");
                        node_navPoint.setAttribute("时间", navPoint.stamp);
                        node_navPoint.setAttribute("经度", navPoint.position.x);
                        node_navPoint.setAttribute("纬度", navPoint.position.y);
                        node_navPoint.setAttribute("高度", navPoint.position.z);
                    }
                }
            }

            {
                var hangingBullet = this.getHangingBullet()
                if (hangingBullet.length > 0) {
                    var node_hangingBullet = xmlStream.createElement("挂弹");
                    node.appendChild(node_hangingBullet);
                    node.append("\n\t");
                    for (let i = 0; i < hangingBullet.length; i++) {
                        var node_arms = xmlStream.createElement("武器");
                        node_hangingBullet.appendChild(node_arms);
                        node_hangingBullet.append("\n\t");
                        node_arms.setAttribute("序号", hangingBullet[i].serialNumber);
                        node_arms.setAttribute("名称", hangingBullet[i].name);
                        var ammunition = hangingBullet[i].ammunition
                        for (let j = 0; j < ammunition.length; j++) {
                            var node_ammunition = xmlStream.createElement("弹药");
                            node_arms.appendChild(node_ammunition);
                            node_arms.append("\n\t");
                            node_ammunition.setAttribute("序号", ammunition[j].serialNumber_ammunition);
                            node_ammunition.setAttribute("名称", ammunition[j].name_ammunition);
                            node_ammunition.setAttribute("数量", ammunition[j].quantity_ammunition);
                        }
                    }
                }
            }

            {
                var bait = this.getBait()
                if (bait.length > 0) {
                    var node_bait = xmlStream.createElement("诱饵");
                    node.appendChild(node_bait);
                    node.append("\n\t");
                    for (let i = 0; i < bait.length; i++) {
                        var node_element = xmlStream.createElement("装载");
                        node_bait.appendChild(node_element);
                        node_bait.append("\n\t");
                        node_element.setAttribute("序号", bait[i].serialNumber);
                        node_element.setAttribute("名称", bait[i].name);
                        node_element.setAttribute("数量", bait[i].quantity);
                    }
                }
            }

            {
                var sensor = this.getSensor()
                if (sensor.length > 0) {
                    var node_bait = xmlStream.createElement("传感器计划");
                    node.appendChild(node_bait);
                    node.append("\n\t");
                    for (let i = 0; i < sensor.length; i++) {
                        var node_element = xmlStream.createElement("传感器");
                        node_bait.appendChild(node_element);
                        node_bait.append("\n\t");
                        node_element.setAttribute("序号", sensor[i].serialNumber);
                        node_element.setAttribute("模式", sensor[i].model);
                        node_element.setAttribute("扫描方式", sensor[i].scanningMode);
                        node_element.setAttribute("起始角", sensor[i].startAngle);
                        node_element.setAttribute("终止角", sensor[i].endangle);
                    }
                }
            }

            if (this.visible) {
                if (this.side == 2) {
                    var root = xmlObject.getRootNode().children[0];
                    var news = root.getElementsByTagName('情报列表');
                    if (news.length > 0) {
                        // 更新情报列表标签
                        var newsList = news[0];
                    } else {
                        // 创建情报列表标签
                        var newsList = xmlStream.createElement("情报列表");
                        root.appendChild(newsList);
                        root.append("\n\t");
                    }
                    // 判断是否存在重复兵力，存在赋值为false
                    let type = true;
                    for (let q = 0; q < newsList.children.length; q++) {
                        const element = newsList.children[q].getAttribute("序号");
                        if (element == this.id) {
                            type = false;
                        }
                    }
                    // 值为true说明不是重复兵力添加到情报列表内，否则不添加
                    if (type) {
                        var cgf = xmlStream.createElement("兵力");
                        cgf.setAttribute("序号", this.id);
                        newsList.appendChild(cgf);
                        newsList.append("\n\t");
                    }
                }
            }

            if (this.regionList) {
                console.Log(this.regionList)

            }

        }
    },
    copy: function (source) {
        let obj = Object.assign(source);

        this.name = obj.name;
        this.id = obj.id;
        this.typeId = obj.typeId;
        this.modelId = obj.modelId;
        this.doctrineId = obj.doctrineId;
        this.side = obj.side;
        this.speed = obj.speed;
        this.heading = obj.heading;
        this.targetId = obj.targetId;
        this.AOIId = obj.AOIId;
        this.parent = null;
        this.nodeType = obj.nodeType;
        this.formationId = obj.formationId;

        this.carrier = obj.carrier; //载体
        this.base = obj.base; //基地
        this.position = obj.position;
        this.hangingBullet = obj.hangingBullet; //武器
        this.bait = obj.bait; //诱饵
        this.sensor = obj.sensor; //传感器
        for (let i = 0; i < obj.children.length; i++) {
            this.addChild(obj.children[i].clone())
        }
        this.geoData = obj.geoData;
        this.navPath = obj.navPath;
        return this;
    },
    clone: function () {
        return new CGFEntity(null, this.nodeType).copy(this);
    }
});
export default CGFEntity