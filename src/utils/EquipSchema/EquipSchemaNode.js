import {String2XML,XML2String} from '../SimDataModel/utils';
// var xmlStream = String2XML();
var EquipSchemaNode = function(parent,name,typeId){
		this.name = name;
		this.typeId = typeId;
		this.parent = parent;
		this.nodeType = null;
		this.children = [];
		if(parent){
			parent.addChild(this);
		}
	}
EquipSchemaNode.prototype = Object.assign({
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
        getNodeType:function(){
            return this.nodeType;
        },
        setNodeType:function(nodeType){
            this.nodeType = nodeType;
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
        child.setNodeType(this.getNodeType())
        this.children.push(child);
    },
    addChildren:function(children){
        for (let i = 0; i < children.length; i++)
        {
            children[i].parent = this;
            children[i].setNodeType(this.getNodeType());
        }
        this.children.concat(children);
    },
    insertChild:function(index,child){
        child.parent = this;
        child.setNodeType(this.getNodeType())
        this.children.splice(index,0, child);
    },
    insertChildren:function(index,children){
        for (let i = 0; i < children.length; i++)
        {
            children[i].parent = this;
            children[i].setNodeType(this.getNodeType());
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
    readXml:function(element){

        var strName =element.getAttribute('name');
        var strTypeId =element.getAttribute('id');
        this.setName(strName);
        this.setTypeId(Number(strTypeId));
        if(this.parent == null){
            this.setNodeType(this.getTypeId())
        }
        var childElements = element.children;
        for(let i=0;i<childElements.length;i++){
            var childElement = childElements[i];
            var nodeName = childElement.nodeName;
            if(nodeName == "node"){
                var pEquipSchemaNode = new EquipSchemaNode(this, "", 0);
                pEquipSchemaNode.readXml(childElement);
            }
        }
        
    },	
});
export default EquipSchemaNode;