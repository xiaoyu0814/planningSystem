import {String2XML,XML2String} from './utils';
import {NodeUnit,SideEnum} from './NodeConfig';
import NavPath from './NavPath';
import {navPathNum} from './NodeConfig';
var xmlStream = String2XML();

function NavPathList(element) {
    this.list = [];
    this.readXml(element)
}
NavPathList.prototype = Object.assign({
    getList: function () {
        return this.list;
    },

    getChildByNum: function (num) {
        let length = this.list.length;
        let result = null;
        for (let i = 0; i < length; i++) {
            if (this.list[i].getNum() == num) {
                result = this.list[i];
            }
        }
        return result;
    },
    getIndexByNum: function (num) {
        let length = this.list.length;
        let result = -1;
        for (let i = 0; i < length; i++) {
            if (this.list[i].getNum() == num) {
                result = i;
            }
        }
        return result;
    },
    addChild: function (navPath) {
        NodeUnit.navPathNum++;
        navPath.setNum(NodeUnit.navPathNum);
        this.list.push(navPath);
    },
    setChildByNum: function (num, navPath) {
        let _index = this.getIndexByNum(num);
        if (_index >= 0) {
            let child = this.list[_index];
            navPath.setNum(child.getNum())
            //navPath.setName(child.getName())
            this.list.splice(_index, 1, navPath);
        }
    },
    readNavPath: function (eleNavPath) {
        console.log(eleNavPath);
        if (eleNavPath) {
            let navPath = new NavPath();
            var strLoopIndex = eleNavPath.getAttribute("循环");
            var strName = eleNavPath.getAttribute("名称");
            var strNum = eleNavPath.getAttribute("标识");
            navPath.SetLoopIndex(Number(strLoopIndex));
            navPath.setName(strName);
            navPath.setNum(Number(strNum));
            if (Number(strNum) > NodeUnit.navPathNum) {
                NodeUnit.navPathNum = Number(strNum);
            }

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

                navPath.AddNavPoint(navPoint);
            }
            return navPath;
        } else {
            return null;
        }
    },
    readXml: function (element) {
        console.log(element);
        if (element.length == 0) {
            return;
        }
        let navPathElements = element[0].children;
        for (let i = 0; i < navPathElements.length; i++) {
            let navPath = this.readNavPath(navPathElements[i]);
            if (navPath) {
                this.list.push(navPath);
            }
        }
    },
    writeNavPath: function (node, navPath) {
        
        var navPointCount = navPath.getNavPointCount();
        if (navPointCount > 0) {

            var node_navPath = xmlStream.createElement("导航线");
            node.appendChild(node_navPath);
            node.append("\n\t");
            node_navPath.setAttribute("循环", navPath.getLoopIndex());
            node_navPath.setAttribute("名称", navPath.getName());
            node_navPath.setAttribute("标识", navPath.getNum());
            for (let k = 0; k < navPointCount; k++) {
                var navPoint = navPath.getNavPointByIndex(k);
                var node_navPoint = xmlStream.createElement("航路点");
                node_navPath.appendChild(node_navPoint);
                node_navPath.append("\n\t");
                node_navPoint.setAttribute("时间", navPoint.stamp);

                node_navPoint.setAttribute("经度", navPoint.position.x);
                node_navPoint.setAttribute("纬度", navPoint.position.y);
                node_navPoint.setAttribute("高度", navPoint.position.z);
            }
            console.log(node_navPath)
        }
    },
    writeXml: function (node) {
        
        for (let i = 0; i < this.list.length; i++) {
            this.writeNavPath(node, this.list[i]);
        }
    }
})
export default NavPathList;
