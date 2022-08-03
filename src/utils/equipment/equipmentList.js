import { String2XML } from '../SimDataModel/utils';
import { NodeUnit } from '../SimDataModel/NodeConfig';
import equipment from './equipment';
var xmlStream = String2XML();

function equipmentList(element) {
    this.list = {};
    this._equipment = new equipment()
    this.readXml(element)
}
equipmentList.prototype = Object.assign({
    getList: function () {
        return this.list;
    },
    readXml: function (element) {
        if (element.length == 0) {
            return;
        }
        let equipmentElements = element[0].children;
        for (let i = 0; i < equipmentElements.length; i++) {
            let _environment = this.getElement(equipmentElements[i]);
            if (_environment) {
                // this.list.push(_environment);
                this.list = Object.assign(_environment)
            }
        }
    },
    getElement: function (eleequipment) {
        if (eleequipment) {
            var modelId = eleequipment.getAttribute("标识");
            var name = eleequipment.getAttribute("名称");
            this._equipment.setList(modelId,name)
            return this._equipment.equipment
        } else {
            return null;
        }

    },
    writeEnvironmentList: function (element, node) {},
    writeXml: function (element) {
        for (let i = 0; i < this.list.length; i++) {
            this.writeEnvironmentList(element, this.list[i]);
        }
    }
})
export default equipmentList;