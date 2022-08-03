import {String2XML} from './utils';
var xmlStream = String2XML();
var GeoData = function () {
    this.interestAreaId = -1;
    this.operationAreaId = -1;
    this.operationRouteId = -1;
    this.interestPoint = {
        x:0,
        y:0,
        z:0
    }
}
GeoData.prototype = Object.assign({
    getInterestAreaId:function(){
        return this.interestAreaId;
    },
    setInterestAreaId:function(interestAreaId){
        this.interestAreaId = interestAreaId;
    },
    getOperationAreaId:function(){
        return this.operationAreaId;
    },
    setOperationAreaId:function(operationAreaId){
        this.operationAreaId = operationAreaId;
    },
    getOperationRouteId:function(){
        return this.operationRouteId;
    },
    setOperationRouteId:function(operationRouteId){
        this.operationRouteId = operationRouteId;
    },
    getInterestPoint:function(){
        return this.interestPoint;
    },
    setInterestPoint:function(interestPoint){
        this.interestPoint = interestPoint;
    },
    getInterestPointIsHave:function(){
        if((this.interestPoint.x==0&&this.interestPoint.y==0)||this.interestPoint == null){
            return false;
        }else{
            return true;
        }
    }
},{
    writeXml:function(element){
        var geoDataNode = xmlStream.createElement("地理数据");
        if(this.getInterestAreaId()>0){
            geoDataNode.setAttribute("兴趣区",this.getInterestAreaId());
        }
        if(this.getOperationAreaId()>0){
            geoDataNode.setAttribute("操作区",this.getOperationAreaId());
        }
        if(this.getOperationRouteId()>0){
            geoDataNode.setAttribute("操作路线",this.getOperationRouteId());
        }
        if(this.getInterestPointIsHave()){
            var interestPointele = xmlStream.createElement("兴趣点"); 
            interestPointele.setAttribute("经度",this.interestPoint.x);
            interestPointele.setAttribute("纬度",this.interestPoint.y);
            interestPointele.setAttribute("高度",this.interestPoint.z);
            geoDataNode.appendChild(interestPointele);
        }
        element.append("\n\t");
        element.appendChild(geoDataNode);
    }
})

export default GeoData;