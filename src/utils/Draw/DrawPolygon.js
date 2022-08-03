var DrawPolygon = function(map){
    this.map = map;
};
DrawPolygon.prototype.startDraw = function(areaId,color,callback,endDrawBack){

    var points = [],geometry=[],polygonlayer = null;
    this.id = "CGFArea_"+areaId;
    var _this = this;
    var canDraw = true;
    // var lines = new PIE.MetoStyle.LineLayer({data:turf.featureCollection([]),id:"line_"+id})
    // var tempLines = new PIE.MetoStyle.LineLayer({data:turf.featureCollection([]),id:"line_"+id})
    function initPoint(){
        polygonlayer = _this.map.getLayer(_this.id);
        if(polygonlayer){
            points = polygonlayer.data.features[0].geometry.coordinates[0]
            console.log(polygonlayer);
        }
    }
    //initPoint()
    let _polyid = guid();
    this.map.on('click', onClick);    //点击地图
    this.map.on('dblclick', onDoubleClick);

    console.log("DRAWLINE")
    //map.off(....) 关闭该事件
    function draw(){

        let pointLayer = _this.map.getLayer('drawPoint'+_this.id);
        let lineLayer = _this.map.getLayer('drawLine'+_this.id);
        let polyLayer = _this.map.getLayer('drawPoly'+_polyid);

        let _featurepoint = [];
        for(let i=0;i<points.length;i++){
            let pointFeature = turf.point(points[i]);
            _featurepoint.push(pointFeature);
        }
        let _pointsFeature = turf.featureCollection(_featurepoint)
        if(pointLayer){
            pointLayer.setSource(_pointsFeature)
        }else{
            let _pointLayer = new PIE.MetoStyle.PointLayer({
                id:'drawPoint'+_this.id,
                data:_pointsFeature,
                color:"#000",
                size:5,
            });
            _this.map.add(_pointLayer);
        }
        if(points.length>=2){
            let _lineFeature = turf.featureCollection([turf.lineString(points)])
            if(lineLayer){
                lineLayer.setSource(_lineFeature)
            }else{
                let _lineLayer = new PIE.MetoStyle.LineLayer({
                    id:'drawLine'+_this.id,
                    data:_lineFeature,
                    dasharray:[2,4],
                    color:color,
                    width:2,
                });
                _this.map.add(_lineLayer);
            }
        }

        if(points.length>=3){
            let _points = [...points]
            let _polyFeature = turf.featureCollection([turf.lineStringToPolygon(turf.lineString(_points))])
            if(polyLayer){
                polyLayer.setSource(_polyFeature)
            }else{
                let _polyLayer = new PIE.MetoStyle.FillLayer({
                    id:'drawPoly'+_polyid,
                    data:_polyFeature,
                    color:"#00ff00",
                    opacity:0.5,
                });
                _this.map.add(_polyLayer);
            }
        }
        
        
    }
    function onClick(e) {
        if(!canDraw) return;
        let coord = e.coordinate;
        if(Math.abs(e.coordinate[0]>180)){
            coord =  turf.toWgs84(coord);
        }
        callback(coord);
        points.push(coord)
        draw();
        _this.map.on('mousemove', onMove)//双击地图

    }
    function onMove(e) {
        if(!canDraw) return;
        let coord = e.coordinate;
        if(Math.abs(e.coordinate[0]>180)){
            coord =  turf.toWgs84(coord);
        }
        if(points.length <= 1){
            points.push(coord);
        }else if (points.length > 1) {
            points[points.length - 1] = coord;
            //tempLines.setLatLngs(ls)
           
        }
        draw();
    }
    function clear(){
        let pointLayer = _this.map.getLayer('drawPoint'+_this.id);
        let lineLayer = _this.map.getLayer('drawLine'+_this.id);
        let polyLayer = _this.map.getLayer('drawPoly'+_polyid);
        if(pointLayer){
            _this.map.remove(pointLayer);
        }
        if(lineLayer){
            _this.map.remove(lineLayer);
        }
        // if(polyLayer){
        //     _this.map.remove(polyLayer);
        // }
    }
    function onDoubleClick(e) {
       if(canDraw){
            points = []
            _this.map.off('mousemove');
            _this.map.off('click');
            _this.map.off('dblclick');
            let polyLayer = _this.map.getLayer('drawPoly'+_polyid);
            clear();
            endDrawBack(polyLayer);
            canDraw = false;
       }else{
           return
       }
        
    }

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    
    }
};
export default DrawPolygon;