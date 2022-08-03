import {String2XML,XML2String} from '../SimDataModel/utils';
import {NodeUnit,SideEnum} from '../SimDataModel/NodeConfig';
import AreaPath from './AreaPath';
var xmlStream = String2XML();
function AreaPathList(element){
    this.list =[];
    this.readXml(element)
}
AreaPathList.prototype = Object.assign({
    getList:function(){
        return this.list;
    },
    removeChildByNum:function(num){
        let index = this.getIndexByNum(num);
        if(index>=0){
            this.list.splice(index,1);
        }

    },
    getChildByNum:function(num){
        let length = this.list.length;
        let result = null;
        for(let i=0;i<length;i++){
            if(this.list[i].getNum() == num){
                result = this.list[i];
            }
        }
        return result;
    },
    getIndexByNum:function(num){
        let length = this.list.length;
        let result = -1;
        for(let i=0;i<length;i++){
            if(this.list[i].getNum() == num){
                result = i;
            }
        }
        return result;
    },
    addChild:function(navPath){
        NodeUnit.areaPathNum ++ ;
        navPath.setNum(NodeUnit.areaPathNum);
        this.list.push(navPath);
    },
    setChildByNum:function(num,navPath){
        let _index = this.getIndexByNum(num);
        if(_index>=0){
            let child = this.list[_index];
            navPath.setNum(child.getNum())
            //navPath.setName(child.getName())
            this.list.splice(_index,1,navPath);
        }   
    },
    readAreaPath:function(eleAreaPath){
        console.log(eleAreaPath);
        if(eleAreaPath){
            let areaPath = new AreaPath();
           // var strLoopIndex = eleNavPath.getAttribute("循环");
            var strName = eleAreaPath.getAttribute("名称");
            var strNum = eleAreaPath.getAttribute("标识");
           
            areaPath.setName(strName);
            areaPath.setNum(Number(strNum));
            if(Number(strNum) > NodeUnit.areaPathNum){
                NodeUnit.areaPathNum = Number(strNum);
            }
            
            var areaPointElements = eleAreaPath.children;
            for (let i = 0; i < areaPointElements.length; i++)
            {
                var childElement = areaPointElements[i];
               
                var strlon = childElement.getAttribute("经度");
                var strlat = childElement.getAttribute("纬度");
                var strhei = childElement.getAttribute("高度");

                let areaPoint = {
                    position:{

                    }
                };
                areaPoint.position.x = Number(strlon);
                areaPoint.position.y = Number(strlat);
                areaPoint.position.z = Number(strhei);

                areaPath.AddAreaPoint(areaPoint);
            }
            return areaPath;  
        }else {
            return null;
        }
        
    },
    readXml:function(element){
        console.log(element);
        if(element.length==0){
            return;
        }
        let areaPathElements = element[0].children;
        for(let i=0;i<areaPathElements.length;i++){
            let areaPath = this.readAreaPath(areaPathElements[i]);
            if(areaPath){
                this.list.push(areaPath);
            }  
        }  
    },
    writeNavPath:function(node,navPath){
        var navPointCount = navPath.getAreaPointCount();
        if (navPointCount > 0)
        {
            
            var node_navPath = xmlStream.createElement("区域");
            node.appendChild(node_navPath);
            node.append("\n\t");
            node_navPath.setAttribute("名称", navPath.getName());
            node_navPath.setAttribute("标识", navPath.getNum());
            for (let k = 0; k < navPointCount; k++)
            {
                var navPoint = navPath.getAreaPointByIndex(k);
                var node_navPoint = xmlStream.createElement("区域点");
                node_navPath.appendChild(node_navPoint);
                node_navPath.append("\n\t");

                node_navPoint.setAttribute("经度", navPoint.position.x);
                node_navPoint.setAttribute("纬度", navPoint.position.y);
                node_navPoint.setAttribute("高度", navPoint.position.z);
                
            }
            
        }
    },
    writeXml:function(node){
        for(let i=0;i<this.list.length;i++){
            this.writeNavPath(node,this.list[i]);
        }
    }
})
export default AreaPathList;
