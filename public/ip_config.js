var one = true // 线上：true，线下：false
var IP = {
    online: one ? "http://10.254.247.231:31800/api/v1/business" : "http://10.254.247.232:8300/api/v1/business",
    offline: "http://10.254.247.222:8300/api/v1/business"
}

var map_ip = one ? "http://10.254.247.231:30010" : "http://10.254.247.232:30010"; // 地图
var dem_ip = one ? "http://10.254.247.231:31808" : "http://10.254.247.232:31808"; // 高程
var numberMap_ip = one ? "http://10.254.247.231:8080/geoserver/xiexiaoyu/wms" : "http://10.254.247.232:8080/geoserver/xiexiaoyu/wms"; // 数字地图
var pusher_webSoket = one ? "ws://10.254.247.231:9078" : "ws://10.254.247.232:9078";
var self_websoket = one ? "ws://10.254.247.231:31800/api/v1/business" : "ws://10.254.247.232:8300/api/v1/business";
var flood_ip = one ? "http://10.254.247.231:8301/api/v1/business" : "http://10.254.247.232:8301/api/v1/business"
var numberMap_params = {
    'FORMAT': 'image/png',
    'VERSION': '1.1.1',
    tiled: true,
    "STYLES": '',
    "LAYERS": 'xiexiaoyu:XXY',
    // "exceptions": 'application/vnd.ogc.se_inimage',
    tilesOrigin: -72 + "," + -32,
}

var JB_PlotIP = "http://10.254.247.104:8188" // 甲方
// var JB_PlotIP = "http://10.1.30.111:8188" // 王月
// var JB_PlotIP = "http://10.1.30.40:8188" // 强强
// var JB_PlotIP = "http://127.0.0.1:8188" // 自己
var flag = true