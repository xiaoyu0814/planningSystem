import {
    String2XML,
    XML2String
} from '../SimDataModel/utils';
import {
    NodeUnit,
    SideEnum
} from '../SimDataModel/NodeConfig';
import RoutePath from './RoutePath';
var xmlStream = String2XML();

function RoutePathList(element) {
    this.list = [];
    this.readXml(element)
}
RoutePathList.prototype = Object.assign({
    getList: function () {
        return this.list;
    },

    getChildById: function (id) {
        let length = this.list.length;
        let result = null;
        for (let i = 0; i < length; i++) {
            if (this.list[i].getId() == id) {
                result = this.list[i];
            }
        }
        return result;
    },
    getIndexById: function (id) {
        let length = this.list.length;
        let result = -1;
        for (let i = 0; i < length; i++) {
            if (this.list[i].getId() == id) {
                result = i;
            }
        }
        return result;
    },
    addChild: function (navPath) {
        NodeUnit.routePathNum++;
        navPath.setId(NodeUnit.routePathNum);
        this.list.push(navPath);
    },
    setChildById: function (id, navPath) {
        let _index = this.getIndexById(id);
        if (_index >= 0) {
            let child = this.list[_index];
            navPath.setNum(child.getNum())
            //navPath.setName(child.getName())
            this.list.splice(_index, 1, navPath);
        }
    },
    readRoutePath: function (eleNavPath) {
        if (eleNavPath) {
            let routePath = new RoutePath();
            var strWidth = eleNavPath.getAttribute("宽度");
            var strName = eleNavPath.getAttribute("名称");
            var strId = eleNavPath.getAttribute("标识");
            var strNum = eleNavPath.getAttribute("编号");

            routePath.setWidth(Number(strWidth));
            routePath.setName(strName);
            routePath.setNum(Number(strNum));
            routePath.setId(Number(strId));
            if (Number(strId) > NodeUnit.routePathNum) {
                NodeUnit.routePathNum = Number(strId);
            }

            var navPointElements = eleNavPath.children[0].children;
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

                routePath.AddNavPoint(navPoint);
            }
            return routePath;
        } else {
            return null;
        }

    },
    readXml: function (element) {
        if (element.length == 0) {
            return;
        }
        let navPathElements = element[0].children;
        for (let i = 0; i < navPathElements.length; i++) {
            let routePath = this.readRoutePath(navPathElements[i]);
            if (routePath) {
                this.list.push(routePath);
            }
        }
    },
    writeNavPath: function (node, navPath) {
        var navPointCount = navPath.getNavPointCount();
        if (navPointCount > 0) {

            var node_navPath = xmlStream.createElement("路线");
            node.appendChild(node_navPath);
            node.append("\n\t");
            node_navPath.setAttribute("标识", navPath.getId());
            node_navPath.setAttribute("名称", navPath.getName());
            node_navPath.setAttribute("编号", navPath.getNum());
            node_navPath.setAttribute("宽度", navPath.getWidth());
            var points_ele = xmlStream.createElement("点集");
            node_navPoint.appendChild(points_ele);
            for (let k = 0; k < navPointCount; k++) {
                var navPoint = navPath.getNavPointByIndex(k);
                var node_navPoint = xmlStream.createElement("路点");
                points_ele.appendChild(node_navPoint);
                points_ele.append("\n\t");
                node_navPoint.setAttribute("时间", navPoint.stamp);
                node_navPoint.setAttribute("经度", navPoint.position.x);
                node_navPoint.setAttribute("纬度", navPoint.position.y);
                node_navPoint.setAttribute("高度", navPoint.position.z);

            }

        }
    },
    writeXml: function (node) {
        for (let i = 0; i < this.list.length; i++) {
            this.writeNavPath(node, this.list[i]);
        }
    }
})
export default RoutePathList;