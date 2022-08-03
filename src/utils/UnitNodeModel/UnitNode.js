import {String2XML,XML2String} from '../SimDataModel/utils';
import {NodeUnit,SideEnum} from '../SimDataModel/NodeConfig';
import CGFEntity from '../SimDataModel/CGFEntity';
var xmlStream = String2XML();

var UnitNode = function(parent,nodeType){
    this.name = null;
    this.typeId = -1;
    this.modelId = -1;

    this.parent = parent;
    this.nodeType = nodeType;
    this.children = [];
    if(parent){
        parent.addChild(this);
    }
}
UnitNode.prototype = Object.assign({
    getName:function(){
        return this.name;
    },
    setName:function(name){
        this.name = name;
    },

    getTypeId:function(){
        return this.typeId;
    },
    setTypeId:function(typeId){
        this.typeId = typeId;
    },
    getModelId:function(){
        return this.modelId;
    },
    setModelId:function(modelId){
        this.modelId = modelId;
    },


    getNodeType:function(){
        return this.nodeType;
    },
    setNodeType:function(nodeType){
        this.nodeType = nodeType;
    },
    getPosition:function(){
        return this.position;
    },
    setPosition:function(position){
        this.position = position;
    },
    getNavPath:function()
    {
        return this.navPath;
    },
    getChildren:function(){
        return this.children;
    },
    getParent:function(){
        return this.parent;
    },
    setParent:function(parent){
        if (this.parent != null)
        {
            this.parent.takeChild(this);
        }

        if (parent != null)
        {
            parent.addChild(this);
        }
    }
},  
{
    
    addChild:function(child){
        if (child == null)
        {
            return;
        }

        child.parent = this;
        this.children.push(child);
    },
    addChildren:function(children){
        for (let i = 0; i < children.length; i++)
        {
            children[i].parent = this;
        }
        this.children.concat(children);
    },
    insertChild:function(index,child){
        child.parent = this;
        this.children.splice(index,0, child);
    },
    insertChildren:function(index,children){
        for (let i = 0; i < children.length; i++)
        {
            children[i].parent = this;
            this.children.splice(index + i,0, children[i]);
        }
    },
    removeChild:function(child){
        var i = this.children.indexOf(child);
        if (i >= 0)
        {
            removeChildrenPrivate(i, 1, true);
        }
    },
    removeAllChildren:function(){
        this.removeChildrenPrivate(0, this.children.length, false);
    },
    removeChildrenPrivate:function(from,count,destroy){
        if (from < 0 || count <= 0)
        {
            return;
        }
        this.children.splice(from,count);

    },
    takeChild:function(index){
        if (index < 0)
        {
            return null;
        }

        let n = children.length;

        if (index >= n)
        {
            return null;
        }

        var pChild = this.children[index];

        this.removeChildrenPrivate(index, 1, false);

        return pChild;
    },
    child:function(index){
        if (index < 0)
        {
            return null;
        }

        let n = children.length;

        if (index >= n)
        {
            return null;
        }

        return this.children[index];
    },
    childCount:function(){
        return this.children.length;
    },
    indexOfChild:function(child){
        return this.children.indexOf(child);
    },
    TOCGFDataModel:function(side){
        if(this.children.length>0){
            let rootPCGF = new CGFEntity(null,NodeUnit.NodeGroup);
            rootPCGF.setName(this.getName());
            //rootPCGF.setModelId(this.getModelId());
            rootPCGF.setTypeId(this.getTypeId());
            rootPCGF.setSide(side);
            for(let i=0;i<this.children.length;i++){
                let _pUnitNode  = this.children[i];
                _pUnitNode.toCGF(rootPCGF);
            }
            return rootPCGF

        }else{
            let pCGF = new CGFEntity(null,NodeUnit.NodeCGF);
            pCGF.setName(this.getName());
            pCGF.setModelId(this.getModelId());
            pCGF.setTypeId(this.getTypeId());
            pCGF.setSide(side);
            return pCGF;
        }
       
    },

    toCGF:function(rootPCGF){
        if(this.nodeType==NodeUnit.NodeGroup){
            var pCGFEntity = new CGFEntity(rootPCGF, NodeUnit.NodeGroup);
            pCGFEntity.setName(this.getName());
            //pCGFEntity.setModelId()
            pCGFEntity.setTypeId(this.getTypeId());
            let _children = this.getChildren();
            for(let j=0;j<_children.length;j++){
                _children[j].toCGF(pCGFEntity);
            }
            //pCGFEntity.setName()

        }else if(this.nodeType==NodeUnit.NodeCGF){
            var pCGFEntity = new CGFEntity(rootPCGF, NodeUnit.NodeCGF);
            pCGFEntity.setName(this.getName());
            pCGFEntity.setModelId(this.getModelId());
            pCGFEntity.setTypeId(this.getTypeId());
        }
    },
    readXml:function(element){
        var nodeName = element.nodeName;
        if(nodeName == '指挥'){
            var strName = element.getAttribute('名称');
            var strTypeId = element.getAttribute("类型");

            this.setName(strName);
            this.setTypeId(Number(strTypeId));
            this.setNodeType(NodeUnit.NodeGroup);

            var childElements = element.children;
            for (let i = 0; i < childElements.length; ++i)
            {
                var childElement = childElements[i];
                var pUnitNode = new UnitNode(this, NodeUnit.NodeType.Unkown);
                pUnitNode.readXml(childElement);
            }

        }else if(nodeName == '兵力'){
            var strName = element.getAttribute('名称');
            var strTypeId = element.getAttribute("类型");
            var strModelId = element.getAttribute("型号");
            

            this.setName(strName);
            this.setTypeId(Number(strTypeId));
            this.setModelId(Number(strModelId));
            this.setNodeType(NodeUnit.NodeCGF);

            
            

        }
    },
    writeXml:function(xmlObject){

        if (this.parent == null)
        {
            //stream.writeStartElement(this->getName());
            // var node = xmlStream.createElement(this.getName());
            // xmlObject.appendChild(node);
            // xmlObject.append("\n\t");
            for (let i = 0; i < this.children.length; i++)
            {
                this.children[i].writeXml(xmlObject);
            }
            //stream.writeEndElement();
            return;
        }

        if (this.getNodeType() == NodeUnit.NodeGroup)
        {
            var node = xmlStream.createElement("指挥");
            xmlObject.append("\n\t");
            xmlObject.appendChild(node);
            xmlObject.append("\n\t");
            node.setAttribute("名称", this.getName());
            node.setAttribute("类型", this.getTypeId().toString());

            for (let j = 0; j < this.children.length; j++)
            {
                let child = this.children[j];
                child.writeXml(node);
            }

        
        }
        else
        {
            
            var node = xmlStream.createElement("兵力");
            xmlObject.append("\n\t");
            xmlObject.appendChild(node);
            xmlObject.append("\n\t");
            node.setAttribute("名称", this.getName());
            node.setAttribute("类型", this.getTypeId().toString());
            node.setAttribute("型号", this.getModelId().toString());	
        }
    }	
});

export default UnitNode;