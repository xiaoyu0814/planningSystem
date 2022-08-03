import CGFDataModel from '@/utils/SimDataModel/CGFDataModel';
import EquipDataModel from '@/utils/EquipSchema/EquipDataModel';
import UnitDataModel from '@/utils/UnitNodeModel/UnitDataModel';
import CGFEntity from '@/utils/SimDataModel/CGFEntity';
import { NodeUnit, SideEnum } from '@/utils/SimDataModel/NodeConfig';
import CGFEntityLayer from '@/utils/SimDataModel/CGFEntityLayer';
import { SideTOColor } from './utils';
import AreaPath from '../Area/AreaPath';
import {String2XML,XML2String} from './utils';
import NavPathList from './NavPathList';
export default {
    GenericGateway: '',
    datamodel: new CGFDataModel(),
    UnitModel: '',
    _cgfEntityLayer: '',
    moveX: false,
    moveY: false,
    oldCGFList: [],
    environmentData:'',
    //初始tkb，bkb
    initCGF: function () {
        //加载tkb、bkb
        // var GenericGateway_path = '/data/GenericGateway.xml'
        var GenericGateway_path = './data/MAXSimDB.xml'

        this.GenericGateway = new EquipDataModel();
        this.GenericGateway.LoadXml(GenericGateway_path);

    },
    //初始想定文件
    initEntity: function (path,type) {

        //加载想定文件
        // //var path = '/data/GenericScenario.xml'
        // var datamodel = new CGFDataModel();
        this.datamodel.LoadXml(path);
        // this.datamodel = datamodel;

        if (this._cgfEntityLayer) {
            this._cgfEntityLayer.removeAllLayers()
        }
        var _CGFLayer = new CGFEntityLayer(this.datamodel,type);
        this._cgfEntityLayer = _CGFLayer;

        let redList = [this.datamodel.GetRootCGFEntity(SideEnum.SideRed)];
        this.oldCGFList = [...redList];
        return this.datamodel

        // this.tree_data = datamodel.vecNodes
        // console.log(datamodel);

    },
    //初始编制树
    initUnitData: function (path) {
        var unitModel = new UnitDataModel();
        unitModel.LoadXml(path);
        this.UnitModel = unitModel;
        return this.UnitModel;

    },


    //替换红方兵力
    replaceSide: function (side, pCGFEntity) {
        for (let i = 0; i < this.datamodel.vecNodes.length; i++) {
            if (this.datamodel.vecNodes[i].getSide() == side) {
                this.datamodel.vecNodes.splice(i, 1, pCGFEntity)
                break;
            }
        }
        this._cgfEntityLayer.updateByStatus(this.datamodel);
    },
    //添加新的 红方 或 蓝方等
    addSide: function (name, side,NodeType) {
        let cgf = new CGFEntity(null, NodeType);
        cgf.setName(name);
        cgf.setSide(side);
        NodeUnit.nodeId++;
        cgf.setId(NodeUnit.nodeId);
        return cgf;
    },

    //添加兵力
    addCGF: function (EquipNode, parent) {
        let cgf = new CGFEntity(parent, NodeUnit.NodeCGF);
        cgf.setName(EquipNode.name);
        cgf.setModelId(EquipNode.modelId);
        cgf.setTypeId(EquipNode.typeId);
        if(EquipNode.hangingBullet.length>0){
            cgf.hangingBullet = EquipNode.hangingBullet;
        }
        if(EquipNode.bait.length>0){
            cgf.bait = EquipNode.bait;
        }
        if(EquipNode.sensor.length>0){
            cgf.sensor = EquipNode.sensor;
        }
        if(EquipNode.speed>0){
            cgf.setSpeed(EquipNode.speed/2);
        }
        if(EquipNode.communication.length>0){
            cgf.communication = EquipNode.communication;
        }
        NodeUnit.nodeId++;
        cgf.setId(NodeUnit.nodeId);
        return cgf;

    },
    //添加指挥
    addGroup: function (EquipNode, parent) {
        let cgf = new CGFEntity(parent, NodeUnit.NodeGroup);
        cgf.setName(EquipNode.name);
        // cgf.setModelId(EquipNode.modelId);
        cgf.setTypeId(EquipNode.typeId);
        NodeUnit.nodeId = NodeUnit.nodeId + 1;
        cgf.setId( NodeUnit.nodeId);
        return cgf;
    },
    //添加位置
    addPosition: function (CGFEntity, position) {
        this._cgfEntityLayer.addPoint(CGFEntity);
    },
    //添加组位置
    setGroupPosition: function (CGFEntity, position) {
        let children = CGFEntity.getChildren();
        let _this = this;
        for (let i = 0; i < children.length; i++) {
            let _cgf = children[i];
            if (_cgf.getNodeType() == '兵力') {
                let oldPos = JSON.parse(JSON.stringify(_cgf.getPosition()));
                if (oldPos.x == 0 && oldPos.y == 0) {
                    _cgf.setPosition(position);
                    this.addPosition(_cgf);
                    //  continue;
                } else {
                    if (_this.moveX || _this.moveY) {
                        let newPos = {
                            x: oldPos.x - _this.moveX,
                            y: oldPos.y - _this.moveY,
                            z: 0,
                        }
                        _cgf.setPosition(newPos);
                        this.addPosition(_cgf);
                    } else {
                        _this.moveX = oldPos.x - position.x;
                        _this.moveY = oldPos.y - position.y;
                        _cgf.setPosition(position);
                        this.addPosition(_cgf);
                    }
                }
            } else if (_cgf.getNodeType() == '指挥') {
                this.setGroupPosition(_cgf, position)
            }
        }
    },

    setMoveFalse: function () {
        this.moveY = false;
        this.moveX = false;
    },

    //添加行为
    addDoctrine: function () {

    },

    //获取区域点信息
    getAreaPath: function (areaId) {
        let areaList = this.datamodel.areaPathNodes.getList();
        for (let i = 0; i < areaList.length; i++) {
            if (areaList[i].getNum() == areaId) {
                return areaList[i];
            }
        }
        return new AreaPath();
    },

    //添加导航线
    addNavPath: function () {

    },

    rename: function (pCGFEntity) {
        if (pCGFEntity.getNodeType() == NodeUnit.NodeCGF) {//兵力修改名称
            this._cgfEntityLayer.updateLayer(pCGFEntity);
        } else {//指挥修改名称
            return;
        }

    },

    //获取颜色值
    getColorBySide: function (side) {
        return SideTOColor(side);
    },

    //移除行为
    removeDoctrine: function () {

    },

    //移除CGF
    removeRenderCGF: function (pCGFEntity) {

        if (pCGFEntity.getNodeType() == NodeUnit.NodeCGF) {

            this._cgfEntityLayer.removeRenderCGF(pCGFEntity.getId());
            let parent = pCGFEntity.getParent();
            if (parent) {
                parent.removeChild(pCGFEntity);
            }
            //this.GetSimSituationDataModel(0).removeCGF(pCGFEntity.getId());
            return;
        }

        let children = pCGFEntity.getChildren();
        for (let i = children.length - 1; i >= 0; i--) {
            this.removeRenderCGF(children[i]);
        }
    },

    //移除导航线
    removeNavPathLayer: function (id) {
        this._cgfEntityLayer.removeNavPathLayer(id)
    },
    //获取导航线
    getNavPathLayer: function (id) {
        this._cgfEntityLayer.getNavPathLayer(id)
    },
    //添加导航线
    addNavPathLayer: function (layer) {
        this._cgfEntityLayer.addNavPathLayer(layer);
    },
    // 更新导航线
    updataNavPathLayer: function (pCGFEntity) {
        this._cgfEntityLayer.updateNavPathLayer(pCGFEntity)
    },
    //更新蓝方显示
    updateSideLayer:function(pCGFEntity){
        this._cgfEntityLayer.updateSideLayer(pCGFEntity)
    },
    //添加兴趣点
    addInterestPoint(pos,id) {
        var point = turf.point([pos.x, pos.y], Object.assign({}));
        this._cgfEntityLayer.addInterestPoint(point,id)
    },
    save() {//保存本地
        this.datamodel.save()
    },
    upload() {//上传
        return this.datamodel.upload();
    },
    get(xmlString,type) {
        this.datamodel.loadXmlString(xmlString)
        var _CGFLayer = new CGFEntityLayer(this.datamodel,type);
        this._cgfEntityLayer = _CGFLayer;

        let redList = [this.datamodel.GetRootCGFEntity(SideEnum.SideRed)];
        this.oldCGFList = [...redList];
        return this.datamodel
    },
    getNavPathElement(){
        this.upload()
        console.log(this.datamodel.file);
        let file = this.datamodel.file
        let TYXD = file.getElementsByTagName("通用想定")[0]
        let DHXZ = TYXD.getElementsByTagName("导航线组")[0]
        return XML2String(DHXZ)
    },
    setNavPathElement(string){
        this.datamodel.navPathNodes.list = []
        console.log(this.datamodel)
        let xml = String2XML(string)
        console.log(xml)
        let navPathNodes = new NavPathList(xml.childNodes).list;
        for(let i = 0; i < navPathNodes.length; i++){
            this.datamodel.navPathNodes.addChild(navPathNodes[i])
        }
        console.log(this.datamodel.navPathNodes)
        return this.datamodel.navPathNodes
    },
}