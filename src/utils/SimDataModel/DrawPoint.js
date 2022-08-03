var DrawPoint = function(map){
    this.map = map;
};
DrawPoint.prototype.startDraw = function(id,callback){
    var points = [],geometry=[]
    this.id = "line_"+id;
    var _this = this;
    var canDraw = true;
    //var lines = new PIE.MetoStyle.LineLayer({data:turf.featureCollection([]),id:"line_"+id})
    // var tempLines = new PIE.MetoStyle.LineLayer({data:turf.featureCollection([]),id:"line_"+id})
    this.map.on('click', onClick);    //点击地图

    function onClick(e) {
        if(!canDraw) return;
        let coord = e.coordinate;
        if(Math.abs(e.coordinate[0]>180)){
            coord =  turf.toWgs84(coord);
        }
        callback(coord);
        canDraw = false;
    }
}
export default DrawPoint;