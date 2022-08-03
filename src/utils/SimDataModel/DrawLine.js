var DrawLine = function (map) {
    this.map = map;
};
DrawLine.prototype.startDraw = function (id, color, callback, endDrawBack) {

    var points = [],
        geometry = [],
        linelayer = null,
        iconGrap = null;
    this.id = "navPathLine_" + id;
    var _this = this;
    var canDraw = true;
    // var lines = new PIE.MetoStyle.LineLayer({data:turf.featureCollection([]),id:"line_"+id})
    // var tempLines = new PIE.MetoStyle.LineLayer({data:turf.featureCollection([]),id:"line_"+id})
    function initPoint() {
        linelayer = _this.map.getLayer(_this.id);
        iconGrap = _this.map.getLayer(_this.id+"point");
        if (linelayer) {
            points = linelayer.data.features[0].geometry.coordinates
        }
    }
    initPoint()
    this.map.on('click', onClick); //点击地图
    this.map.on('dblclick', onDoubleClick);

    console.log("DRAWLINE")
    //map.off(....) 关闭该事件

    function onClick(e) {
        if (!canDraw) return;
        let coord = e.coordinate;
        if (Math.abs(e.coordinate[0] > 180)) {
            coord = turf.toWgs84(coord);
        }
        callback(coord);
        points.push(coord)
        //lines.addLatLng(e.latlng)
        if (points.length > 1) {
            if (linelayer) { // 如果图层存在，给图层新数据源生成新形状，否则添加新图层
                linelayer.setSource(turf.featureCollection([turf.lineString(points)]))
                iconGrap.setSource(turf.featureCollection([turf.multiPoint(points)]))
            } else {
                linelayer = new PIE.MetoStyle.LineLayer({
                    data: turf.featureCollection([turf.lineString(points)]),
                    id: _this.id,
                    color: color == "#FF0000" ? "#000000" : color,
                    // dasharray: [2, 4],
                    width: 1
                });
                _this.map.add(linelayer);
                iconGrap = new PIE.MetoStyle.IconLayer({
                    loadImageUrl: "img/navpath_point.png",
                    data: turf.featureCollection([turf.point(coord)]),
                    size: 0.5,
                    id: _this.id+"point",
                });
                _this.map.add(iconGrap);
            }
        }

        _this.map.on('mousemove', onMove) //双击地图

    }

    function onMove(e) {
        if (!canDraw) return;
        let coord = e.coordinate;
        if (Math.abs(e.coordinate[0] > 180)) {
            coord = turf.toWgs84(coord);
        }
        if (points.length <= 1) {
            points.push(coord);
        } else if (points.length > 1) {
            points[points.length - 1] = coord;
            //tempLines.setLatLngs(ls)

        } else {
            return
        }
        if (linelayer) { // 如果图层存在，给图层新数据源生成新形状，否则添加新图层
            linelayer.setSource(turf.featureCollection([turf.lineString(points)]))
            iconGrap.setSource(turf.featureCollection([turf.multiPoint(points)]))
        } else {
            console.log('addLineLayer');
            linelayer = new PIE.MetoStyle.LineLayer({
                data: turf.featureCollection([turf.lineString(points)]),
                id: _this.id,
                color: color == "#FF0000" ? "#000000" : color,
                // dasharray: [2, 4],
                width: 1
            });
            _this.map.add(linelayer);
            iconGrap = new PIE.MetoStyle.IconLayer({
                loadImageUrl: "img/navpath_point.png",
                data: turf.featureCollection([turf.point(coord)]),
                size: 0.5,
                id: _this.id+"point",
            });
            _this.map.add(iconGrap);
        }
    }

    function onDoubleClick(e) {
        if (canDraw) {
            points = []
            _this.map.off('mousemove');
            _this.map.off('click');
            _this.map.off('dblclick');
            endDrawBack(linelayer,iconGrap);
            canDraw = false;
        } else {
            return
        }

    }
};
export default DrawLine;