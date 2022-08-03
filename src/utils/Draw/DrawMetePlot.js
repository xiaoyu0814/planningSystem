import store from "@/store"
var DrawMetePlot = function(map){
    this.map = map;
    this.plotCode = "";
    this.endDraw = true;
    let _this = this;
    this.codeMinNum = 1;
    this.codeId = "";
    this.map.on("click", function (e) {
        console.log(e);
        _this.onClick(e)
    });
};
DrawMetePlot.prototype.onClick = function (e) {
    if (this.endDraw) return
    let points = e.coordinate;
    if (this.codeMinNum == 1) {     
        let point = turf.point(points)
        let feature = turf.featureCollection([point]);
        this.drawIcon(feature,this.iconUrl,this.plotCode)
    } else {
       
    }
}

DrawMetePlot.prototype.drawIcon = function(data,iconUrl,id){
    this.endDraw = true;
    var sourceTemp = new PIE.ol.source.Vector({
        features: (new PIE.ol.format.GeoJSON()).readFeatures(data)
    });
    var vectorLayer = new PIE.ol.layer.Vector({
        source: sourceTemp,
        style: new PIE.ol.style.Style({
            image: new PIE.ol.style.Icon({
                anchor: [0,0],
                offset: [0, 0],
                rotateWithView: true,
                rotation: 0 * Math.PI / 180,
                size: [32, 32],
                scale: 1,
                src: iconUrl
            }),
        })
    }); 
    vectorLayer.id = "jb_Mete"+id;
    vectorLayer.name = "jb_Mete"+id;

    store.state.temp_JBLayer.push(vectorLayer)
    this.map.map.addLayer(vectorLayer)
    
}
export default DrawMetePlot