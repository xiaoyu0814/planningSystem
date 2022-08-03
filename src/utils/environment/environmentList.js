import { String2XML } from '../SimDataModel/utils';
import { NodeUnit } from '../SimDataModel/NodeConfig';
import environment from './environment';
var xmlStream = String2XML();

function environmentList(element) {
    this.list = [];
    this.readXml(element)
}
environmentList.prototype = Object.assign({
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
            // navPath.setNum(child.getNum())
            //navPath.setName(child.getName())
            this.list.splice(_index, 1, navPath);
        }
    },
    getElement: function (eleNavPath) {
        if (eleNavPath) {
            let _environment = new environment();
            var areaId = eleNavPath.getAttribute("区域标识");

            _environment.setId(Number(areaId));
            if (Number(areaId) > NodeUnit.routePathNum) {
                NodeUnit.routePathNum = Number(areaId);
            }

            var navPointElements = eleNavPath.children;

            for (let i = 0; i < navPointElements.length; i++) {
                let childElement = navPointElements[i];
                if (childElement.localName == "云层") {
                    var height = Number(childElement.getAttribute("高度"));
                    var maxHeight = Number(childElement.getAttribute("最大高度"));
                    var concentration = Number(childElement.getAttribute("浓度"));
                    var element = { height, maxHeight, concentration };
                    _environment.setCloud(element);
                } else if (childElement.localName == "天气") {
                    var temp = Number(childElement.getAttribute("温度"));
                    var humidity = Number(childElement.getAttribute("湿度"));
                    var pressure = Number(childElement.getAttribute("气压"));
                    var rainfall = Number(childElement.getAttribute("雨量"));
                    let weather = { wind: [], temp, humidity, pressure, rainfall };
                    var wind = childElement.children[0].children;
                    for (let i = 0; i < wind.length; i++) {
                        let childElement = wind[i];
                        let height = Number(childElement.getAttribute("高度"));
                        let wind_d = Number(childElement.getAttribute("风向"));
                        let wind_s = Number(childElement.getAttribute("风速"));
                        let element = { height, wind_d, wind_s };
                        weather.wind.push(element);
                    }
                    _environment.setWeather(weather);
                } else if (childElement.localName == "海洋") {
                    var seaState = Number(childElement.getAttribute("海况"));
                    var wave_d = Number(childElement.getAttribute("浪向"));
                    var wave_h = Number(childElement.getAttribute("浪高"));
                    let ocean = { flow: [], seaState, wave_d, wave_h };
                    var flow = childElement.children[0].children;
                    for (let i = 0; i < flow.length; i++) {
                        let childElement = flow[i];
                        let depth = Number(childElement.getAttribute("深度"));
                        let flow_d = Number(childElement.getAttribute("流向"));
                        let flow_s = Number(childElement.getAttribute("速度"));
                        let element = { depth, flow_d, flow_s };
                        ocean.flow.push(element);
                    }
                    _environment.setOcean(ocean)
                } else if (childElement.localName == "视觉") {
                    var maximumRange = Number(childElement.getAttribute("最大范围"));
                    var identificationRange = Number(childElement.getAttribute("识别范围"));
                    var element = { maximumRange, identificationRange };
                    _environment.setVision(element);
                } else if (childElement.localName == "红外") {
                    var maximumRange = Number(childElement.getAttribute("最大范围"));
                    var identificationRange = Number(childElement.getAttribute("识别范围"));
                    var element = { maximumRange, identificationRange };
                    _environment.setInfrared(element);
                } else if (childElement.localName == "声呐") {
                    var maximumRange = Number(childElement.getAttribute("最大范围"));
                    var sonar = { thermocline: [], maximumRange };
                    var thermocline = childElement.children[0].children;
                    for (let i = 0; i < thermocline.length; i++) {
                        let childElement = thermocline[i];
                        let depth = Number(childElement.getAttribute("深度"));
                        let temp = Number(childElement.getAttribute("温度"));
                        let element = { depth, temp };
                        sonar.thermocline.push(element);
                    }
                    _environment.setSonar(sonar);
                } else if (childElement.localName == "雷达探测范围") {
                    let radar = childElement.children
                    for (let i = 0; i < radar.length; i++) {
                        let childElement = radar[i];
                        let frequency = Number(childElement.getAttribute("频率"));
                        let range = Number(childElement.getAttribute("范围"));
                        let element = { frequency, range };
                        _environment.addRadar(element);
                    }
                }
            }
            return _environment;
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
            let _environment = this.getElement(navPathElements[i]);
            if (_environment) {
                this.list.push(_environment);
            }
        }
    },
    writeEnvironmentList: function (element, node) {
        if (typeof node == "string") {
            console.log(node)
            var root = element.getRootNode().children[0]
            var createNode = xmlStream.createElement("环境列表");
            root.appendChild(createNode);
            root.append("\n\t");
            var weather = xmlStream.createElement("天气");
            weather.setAttribute("类型", node);
            createNode.appendChild(weather);
            createNode.append("\n\t");

        } else {
            var createNode = xmlStream.createElement("环境");
            
            createNode.setAttribute("区域标识", node.getId());
            for (const key in node) {
                switch (key) {
                    case "cloud":
                        var element_cloud = xmlStream.createElement("云层");
                        createNode.appendChild(element_cloud);
                        createNode.append("\n\t");
                        element_cloud.setAttribute("高度", node[key].height);
                        element_cloud.setAttribute("最大高度", node[key].maxHeight);
                        element_cloud.setAttribute("浓度", node[key].concentration);
                        break;
                    case "weather":
                        var element_weather = xmlStream.createElement("天气");
                        createNode.appendChild(element_weather);
                        createNode.append("\n\t");
                        element_weather.setAttribute("温度", node[key].temp);
                        element_weather.setAttribute("湿度", node[key].humidity);
                        element_weather.setAttribute("气压", node[key].pressure);
                        element_weather.setAttribute("雨量", node[key].rainfall);
                        var element_wind = xmlStream.createElement("风速表");
                        element_weather.appendChild(element_wind);
                        var windNode = node[key].wind;
                        for (let i = 0; i < windNode.length; i++) {
                            var element_wind_s = xmlStream.createElement("风速");
                            element_wind.appendChild(element_wind_s);
                            element_wind.append("\n\t");
                            element_wind_s.setAttribute("高度", windNode[i].height);
                            element_wind_s.setAttribute("风向", windNode[i].wind_d);
                            element_wind_s.setAttribute("速度", windNode[i].wind_s);
                        }
                        break;
                    case "ocean":
                        var element_ocean = xmlStream.createElement("海洋");
                        createNode.appendChild(element_ocean);
                        createNode.append("\n\t");
                        element_ocean.setAttribute("海况", node[key].seaState);
                        element_ocean.setAttribute("浪向", node[key].wave_d);
                        element_ocean.setAttribute("浪高", node[key].wave_h);
                        var element_flow = xmlStream.createElement("洋流表");
                        element_ocean.appendChild(element_flow)
                        var flowNode = node[key].flow;
                        for (let i = 0; i < flowNode.length; i++) {
                            var element_flow_s = xmlStream.createElement("流速");
                            element_flow.appendChild(element_flow_s);
                            element_flow.append("\n\t");
                            element_flow_s.setAttribute("深度", flowNode[i].depth);
                            element_flow_s.setAttribute("流向", flowNode[i].flow_d);
                            element_flow_s.setAttribute("速度", flowNode[i].flow_s);
                        }
                        break;
                    case "vision":
                        var element_vision = xmlStream.createElement("视觉");
                        createNode.appendChild(element_vision);
                        createNode.append("\n\t");
                        element_vision.setAttribute("最大范围", node[key].maximumRange);
                        element_vision.setAttribute("识别范围", node[key].identificationRange);
                        break;
                    case "infrared":
                        var element_infrared = xmlStream.createElement("红外");
                        createNode.appendChild(element_infrared);
                        createNode.append("\n\t");
                        element_infrared.setAttribute("最大范围", node[key].maximumRange);
                        element_infrared.setAttribute("识别范围", node[key].identificationRange);
                        break;
                    case "sonar":
                        var element_sonar = xmlStream.createElement("声呐");
                        createNode.appendChild(element_sonar);
                        createNode.append("\n\t");
                        element_sonar.setAttribute("最大范围", node[key].maximumRange);
                        var element_thermocline = xmlStream.createElement("温跃层");
                        element_sonar.appendChild(element_thermocline);
                        var thermoclineNode = node[key].thermocline;
                        for (let i = 0; i < thermoclineNode.length; i++) {
                            var element_temp = xmlStream.createElement("测温");
                            element_thermocline.appendChild(element_temp);
                            element_thermocline.append("\n\t");
                            element_temp.setAttribute("深度", thermoclineNode[i].depth);
                            element_temp.setAttribute("温度", thermoclineNode[i].temp);
                        }
                        break;
                    case "radar":
                        var element_radar = xmlStream.createElement("雷达探测范围");
                        element_sonar.appendChild(element_radar);
                        var radarNode = node[key];
                        for (let i = 0; i < radarNode.length; i++) {
                            var element_temp = xmlStream.createElement("探测");
                            element_radar.appendChild(element_temp);
                            element_radar.append("\n\t");
                            element_temp.setAttribute("频率", radarNode[i].frequency);
                            element_temp.setAttribute("范围", radarNode[i].range);
                        }
                        break;

                    default:
                        break;
                }
            }
        }


        // }
    },
    writeXml: function (element) {
        for (let i = 0; i < this.list.length; i++) {
            this.writeEnvironmentList(element, this.list[i]);
        }
    }
})
export default environmentList;