
import {NodeUnit} from '@/utils/SimDataModel/NodeConfig'
import PIE_Map from '@/utils/map';
var CGFEntityLayer = function(datamodel){
    this.pointList = [];
    this.lineList = [];
    this.childCGFList = [];
    this.pointLayer = [];
    this.pointListLayer = [];
    this.CGFNameListLayer = [];

    this.navPathLayers = [];
    this.initLayer(datamodel)
}
CGFEntityLayer.prototype.initLayer = function(datamodel){
    for (let i = 0; i < datamodel.vecNodes.length; i++)
    {
        var pCGFEntity = datamodel.vecNodes[i];
        this.readData(pCGFEntity);
        
    }
    for(let j=0;j<this.pointList.length;j++){
        let feature = this.pointList[j];
        this.addIconLayer(feature);
        this.addNameLayer(feature);
    }
  
};
CGFEntityLayer.prototype.addNameLayer = function(feature){
    let features = turf.featureCollection([feature]);
    let _CGFNameLayer = new PIE.MetoStyle.TextLayer({ 
        data:features,
        id:"CGFName_"+ feature.properties.id,
        text:"name",
        offset:[0,0.5],
        color:feature.properties.color,
        overlap:true,
        visible: true
    });
    PIE_Map.map.add(_CGFNameLayer);
    this.CGFNameListLayer.push(_CGFNameLayer);
};

CGFEntityLayer.prototype.addIconLayer = function(feature){
    let features = turf.featureCollection([feature]);
    let _iconLayer = new PIE.MetoStyle.PointLayer({
        id:"CGFPoint_" +feature.properties.id,
        data:features,
        color: feature.properties.color
    });
    PIE_Map.map.add(_iconLayer);
    this.pointListLayer.push(_iconLayer);
};

CGFEntityLayer.prototype.removeRenderLayer = function(pCGFEntity){
    for(let i=0;i<this.pointList.length;i++){
        if(pCGFEntity.id == this.pointList[i].properties.id){
            this.pointList.splice(i,1)
            this.updataLayer();
          return
        }
      }
     
     
};
CGFEntityLayer.prototype.render = function(datamodel){
    this.pointList = [];
    this.lineList = [];
    for (let i = 0; i < datamodel.vecNodes.length; i++)
    {
        var pCGFEntity = datamodel.vecNodes[i];
        this.readData(pCGFEntity);
        
    }
    this.updataLayer();


};

CGFEntityLayer.prototype.readData = function(pCGFEntity){
    
    if (pCGFEntity.parent == null)
        {
            for (let i = 0; i < pCGFEntity.children.length; i++)
            {
                this.readData(pCGFEntity.children[i]);
            }
            return;
        }

    if (pCGFEntity.getNodeType() == NodeUnit.NodeGroup)
    {
        
        for (let j = 0; j < pCGFEntity.children.length; j++)
        {
            let child = pCGFEntity.children[j];
            this.readData(child);
        }
    }
    else
    {
        var lng = pCGFEntity.position.x;
        var lat = pCGFEntity.position.y;
        var h = pCGFEntity.position.z;
        var point = turf.point([lng,lat],Object.assign({},pCGFEntity));
        point.properties.color = point.properties.side == 1 ? "#F00":"#00F";
        delete  point.properties.parent;
        delete  point.properties.children;
        delete  point.properties.position;
        delete  point.properties.navPath
        this.pointList.push(point);
        var navPointCount = pCGFEntity.navPath.getNavPointCount();
        if (navPointCount > 0)
        {
            var points = [];
            for (let k = 0; k < navPointCount; k++)
            {
                var navPoint = pCGFEntity.navPath.getNavPointByIndex(k);
                var time = navPoint.stamp;
                var lng = navPoint.position.x;
                var lat = navPoint.position.y;
                var h = navPoint.position.z;
                var _point = [lng,lat];
                points.push(_point);
                        
            }
            var line = turf.lineString(points);
            this.lineList.push(line);
        }
    }
};

CGFEntityLayer.prototype.updataLayer = function(){
    var feature = turf.featureCollection(this.pointList);
    if(PIE_Map.map.getLayer("CGFPoint")){
        this.pointListLayer.setSource(feature)
    }
    if(PIE_Map.map.getLayer("CGFName")){
        this.CGFNameListLayer.setSource(feature)
    }

    for(let j=0;j<this.pointList.length;j++){
        let feature = this.pointList[j];
        let features = turf.featureCollection([feature]);
        let _iconlayer = PIE_Map.map.getLayer("CGFPoint_"+feature.properties.id);
        if(_iconlayer){
            _iconlayer.setSource(features)
        }else{

        }
        let _CGFNameLayer = PIE_Map.map.getLayer("CGFName_"+feature.properties.id);
        if(_CGFNameLayer){
            _CGFNameLayer.setSource(features)
        }else{

        }

        
    }
}
CGFEntityLayer.prototype.addPoint = function(pCGFEntity){
    var lng = pCGFEntity.position.x;
    var lat = pCGFEntity.position.y;
    var h = pCGFEntity.position.z;
    var point = turf.point([lng,lat],Object.assign({},pCGFEntity));
    point.properties.color = point.properties.side == 1 ? "#F00":"#00F";
    delete  point.properties.parent;
    delete  point.properties.children;
    delete  point.properties.position;
    delete  point.properties.navPath;
    console.log(this.pointList);
    for(let i=0;i<this.pointList.length;i++){
      if(pCGFEntity.id == this.pointList[i].properties.id){
        this.pointList[i] = point;
        this.updataLayer();
        return
      }
    }
    this.pointList.push(point);
    this.updataLayer();
}

export default CGFEntityLayer;