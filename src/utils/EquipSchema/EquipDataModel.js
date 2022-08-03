import { String2XML, XML2String } from '../SimDataModel/utils';
import EquipSchemaNode from './EquipSchemaNode';
import EquipNode from './EquipNode';
import DoctrineNode from './DoctrineNode';
import FormationNode from './FormationNode';
var EquipDataModel = function () {
    this.mapEquipSchemaNodes = [];

    this.mapEquipments = [];

    this.mapDoctrines = [];

    this.mapFormations = [];

    this.file = null;

}
EquipDataModel.prototype.GettRootEquipSchemaNodes = function () {
    return this.mapEquipSchemaNodes;
}
EquipDataModel.prototype.GetRootEquipSchemaNode = function (nodeType) {
    var pResult = null;

    for (let i = 0; i < this.mapEquipSchemaNodes.length; i++) {
        let pEquipSchemaNode = this.mapEquipSchemaNodes[i];
        if (pEquipSchemaNode.getNodeType() == nodeType) {
            pResult = pEquipSchemaNode;
            break;
        }
    }
    return pResult;
}
EquipDataModel.prototype.findEquipSchemaNode = function (pEquipSchemaNode, typeId) {
    if (pEquipSchemaNode.getTypeId() == typeId) {
        return pEquipSchemaNode;
    }

    let pResult = null;
    let childs = pEquipSchemaNode.getChildren();
    for (let i = 0; i < childs.length; i++) {
        pResult = this.findEquipSchemaNode(childs[i], typeId);
        if (pResult != null) {
            break;
        }
    }
    return pResult;
}
EquipDataModel.prototype.GetEquipSchemaNode = function (typeId) {
    let pResult = null;

    for (let i = 0; i < this.mapEquipSchemaNodes.length; i++) {
        let pEquipSchemaNode = this.mapEquipSchemaNodes[i];
        pResult = this.findEquipSchemaNode(pEquipSchemaNode, typeId);
        if (pResult != null) {
            break;
        }
    }
    return pResult;
}
EquipDataModel.prototype.GetRootEquipNodes = function () {
    return this.mapEquipments;
}
EquipDataModel.prototype.GetEquipNodes = function (pEquipSchemaNode) {
    let results = [];

    for (let i = 0; i < this.mapEquipments.length; i++) {
        let pEquipNode = this.mapEquipments[i];
        if (pEquipNode.getTypeId() == pEquipSchemaNode.getTypeId()) {
            // results[pEquipNode.getModelId()] = pEquipNode;	
            results.push(pEquipNode)
        }
    }
    return results;
}
//获取tkb 
EquipDataModel.prototype.GetEquipNode = function (modelId) {
    let pResult = null;

    for (let i = 0; i < this.mapEquipments.length; i++) {
        let pEquipNode = this.mapEquipments[i];
        if (pEquipNode.getModelId() == modelId) {
            pResult = pEquipNode;
            break
        }
    }
    return pResult;
}
//获取所有实体行为
EquipDataModel.prototype.GetRootDoctrineNodes = function () {
    return this.mapDoctrines;
}
// 获取行为列表
EquipDataModel.prototype.GetDoctrineNodes = function (pEquipSchemaNode) {
    let results = [];

    let pTemp = pEquipSchemaNode;
    while (pTemp != null) {

        for (let i = 0; i < this.mapDoctrines.length; i++) {
            let pDoctrineNode = this.mapDoctrines[i];
            if (pDoctrineNode.getTypeId() == pTemp.getTypeId()) {
                // results[pEquipNode.getModelId()] = pEquipNode;
                results.push(pDoctrineNode)
            }
        }
        pTemp = pTemp.parent;
    }

    return results;
}
//获取队形
EquipDataModel.prototype.GetFormationNodes = function (id) {
    let results = [];
    for (let i = 0; i < this.mapFormations.length; i++) {
        let formationNode = this.mapFormations[i];
        if (id == formationNode.getTypeId()) {
            results.push(formationNode);
        }
    }
    return results;
}


EquipDataModel.prototype.Clear = function () {

    this.mapEquipSchemaNodes = [];
    this.mapEquipments = [];
    this.mapDoctrines = [];
    this.mapFormations = [];
    this.file = null;
}

EquipDataModel.prototype.LoadXml = function (filePath) {
    console.log("EquipDataModelLoadXml");
    this.Clear();
    let _this = this;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, false);
    xhr.onload = () => {
        // console.log(xhr.responseText)
        _this.file = String2XML(xhr.responseText);

        var TKBSchemaNode = _this.file.getElementsByTagName('TKBSchema');
        if (TKBSchemaNode == null) {
            return false;
        }
        var childElements = TKBSchemaNode[0].children;
        for (let i = 0; i < childElements.length; i++) {
            var childElement = childElements[i];
            //var nodeName = childElement.nodeName;
            var pEquipSchemaNode = new EquipSchemaNode(null, "", 0);
            pEquipSchemaNode.readXml(childElement);
            // _this.mapEquipSchemaNodes[pEquipSchemaNode.getTypeId()] = pEquipSchemaNode;
            _this.mapEquipSchemaNodes.push(pEquipSchemaNode);
        }
        console.log(_this.mapEquipSchemaNodes)
        //tkb
        var node = _this.file.getElementsByTagName('TKB')[0].getElementsByTagName("node");
        for (let node_t = 0; node_t < node.length; node_t++) {
            var model = Number(node[node_t].getAttribute("model"));
            var type = Number(node[node_t].getAttribute("type"));
            var name = node[node_t].getAttribute("name");
            var pEquipNode = new EquipNode(name, type, model);

            var speed = node[node_t].getAttribute("motionMaxVel");
            if (speed) {
                pEquipNode.setSpeed(Number(speed));
            }

            let weaponChildNode = node[node_t].getElementsByTagName('weapon')
            if (weaponChildNode.length > 0) {
                for (let weapon_i = 0; weapon_i < weaponChildNode.length; weapon_i++) {
                    let weaponName = weaponChildNode[weapon_i].getAttribute('name');
                    let weaponIndex = weaponChildNode[weapon_i].getAttribute('index');
                    let ammunition = [];

                    let weaponChildren = weaponChildNode[weapon_i].children

                    for (let munition_i = 0; munition_i < weaponChildren.length; munition_i++) {
                        let munitionIndex = weaponChildren[munition_i].getAttribute('index')
                        let munitionName = weaponChildren[munition_i].getAttribute('name')
                        let munitionLoads = weaponChildren[munition_i].getAttribute('loads')
                        let temp = {
                            "serialNumber_ammunition": munitionIndex,
                            "quantity_ammunition": munitionLoads,
                            "name_ammunition": munitionName,
                        }
                        ammunition.push(temp)
                    }
                    let weaponJson = {
                        "serialNumber": weaponIndex,
                        "name": weaponName,
                        "ammunition": ammunition
                    }
                    pEquipNode.setHangingBullet(weaponJson)
                }
            }
            let sensorChildNode = node[node_t].getElementsByTagName('sensor')
            if (sensorChildNode.length > 0) {
                for (let sensor_i = 0; sensor_i < sensorChildNode.length; sensor_i++) {
                    let sensorIndex = sensorChildNode[sensor_i].getAttribute('index')
                    let sensorName = sensorChildNode[sensor_i].getAttribute('name')
                    let sensorJson = {
                        "serialNumber": sensorIndex,
                        "name": sensorName,
                        "model": "",
                        "scanningMode": "",
                        "startAngle": "",
                        "endangle": "",
                    }
                    pEquipNode.setSensor(sensorJson)
                }
            }
            let decoyChildNode = node[node_t].getElementsByTagName('decoy')
            if (decoyChildNode.length > 0) {
                for (let decoy_i = 0; decoy_i < decoyChildNode.length; decoy_i++) {
                    let decoyIndex = decoyChildNode[decoy_i].getAttribute('index')
                    let decoyName = decoyChildNode[decoy_i].getAttribute('name')
                    let decoyNumber = 10;
                    let tempBait = {
                        "serialNumber": decoyIndex,
                        "name": decoyName,
                        "quantity": decoyNumber,
                    }
                    pEquipNode.setBait(tempBait)
                }
            }
            let communicationChildNode = node[node_t].getElementsByTagName('communication')
            if (communicationChildNode.length > 0) {
                for (let communication_i = 0; communication_i < communicationChildNode.length; communication_i++) {
                    let communicationIndex = communicationChildNode[communication_i].getAttribute('index')
                    let communicationName = communicationChildNode[communication_i].getAttribute('name')
                    let communicationType = communicationChildNode[communication_i].getAttribute('type')
                    let communicationJson = {
                        "serialNumber": communicationIndex,
                        "name": communicationName,
                        "type": communicationType,
                    }
                    pEquipNode.setCommunication(communicationJson)
                }
            }
            // _this.mapEquipments[pEquipNode.getModelId()] = pEquipNode;
            _this.mapEquipments.push(pEquipNode);
        }
        //bkb
        // console.log(_this.file)
        // console.log(_this.file.getElementsByTagName("BKB"))
        var nodeBKB = _this.file.getElementsByTagName("BKB")[0].getElementsByTagName("node");
        for (let node_b = 0; node_b < nodeBKB.length; node_b++) {
            var id = Number(nodeBKB[node_b].getAttribute("id"));
            var type = Number(nodeBKB[node_b].getAttribute("type"));
            var name = nodeBKB[node_b].getAttribute("name");
            var pDoctrineNode = new DoctrineNode(name, id, type);
            // _this.mapDoctrines[pDoctrineNode.getId()] = pDoctrineNode;
            _this.mapDoctrines.push(pDoctrineNode);
        }

        //Formation

        var nodeFormations = _this.file.getElementsByTagName('Formations')[0].getElementsByTagName("CGF");

        for (let node_f = 0; node_f < nodeFormations.length; node_f++) {
            let type = Number(nodeFormations[node_f].getAttribute("type"));
            let _formations = nodeFormations[node_f].children;
            for (let i = 0; i < _formations.length; i++) {
                let id = Number(_formations[i].getAttribute("id"));
                let name = _formations[i].getAttribute("name");
                let pFormationNode = new FormationNode(name, type, id);
                _this.mapFormations.push(pFormationNode);
            }
        }
    }
    xhr.onerror = () => { console.log(xhr.statusText) };
    xhr.send();

}
// EquipDataModel.prototype.save = function(){
//     var CGFGroup = this.file.getElementsByTagName("TKBSchema")[0];
//     for(let node_i = CGFGroup.children.length-1;node_i>=0;node_i--){
//         let node = CGFGroup.children[node_i];
//         node.remove();
//     }
//     for (let i = 0; i < this.vecNodes.length; i++)
//     {
//         var pUnitNode = this.vecNodes[i];
//         pUnitNode.writeXml(CGFGroup);
//     }
//     //Test(XML2String(xmlobject))
//     console.log( XML2String(this.file))
// }
export default EquipDataModel