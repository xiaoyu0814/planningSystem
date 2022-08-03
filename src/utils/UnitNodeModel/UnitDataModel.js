import {String2XML,XML2String,DownloadXML} from '../SimDataModel/utils';
import {NodeUnit,SideEnum} from '../SimDataModel/NodeConfig';
import UnitNode from './UnitNode';
var UnitDataModel = function(){
    this.vecNodes = [];
    this.file =  null;
    // this.Init();

}
UnitDataModel.prototype.GetRootUnitNodes = function(){
    return this.vecNodes;
}
UnitDataModel.prototype.Clear=function()
{
    
    this.vecNodes = [];
    this.file = null;
}

UnitDataModel.prototype.LoadXml = function(filePath)
{
    this.Clear();
    let _this = this;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, true);
    xhr.onload = () =>{
        _this.file = String2XML(xhr.responseText);
        var cgfRootNode = _this.file.getElementsByTagName('编制');
        if (cgfRootNode == null)
        {
            return false;
        }
        var childElements = cgfRootNode[0].children;
        for (var i = 0; i < childElements.length; i++)
        {
            var childElement = childElements[i];
            //var nodeName = childElement.nodeName;
            var pUnitNode = new UnitNode(null, NodeUnit.NodeType.NodeGroup);
            pUnitNode.readXml(childElement);
        
            this.vecNodes.push(pUnitNode);
        }


    } 
    xhr.onerror = () => {console.log(xhr.statusText)};
    xhr.send();
    
}
UnitDataModel.prototype.save = function(){
    var CGFGroup = this.file.getElementsByTagName("编制")[0];
    for(let node_i = CGFGroup.children.length-1;node_i>=0;node_i--){
        let node = CGFGroup.children[node_i];
        node.remove();
    }
    for (let i = 0; i < this.vecNodes.length; i++){
        var pUnitNode = this.vecNodes[i];
        pUnitNode.writeXml(CGFGroup);
    }
    //Test(XML2String(xmlobject))
    console.log( XML2String(this.file))
}

export default UnitDataModel;