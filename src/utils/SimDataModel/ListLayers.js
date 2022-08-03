var ListLayers = function(){
    this.list  = [];
};
ListLayers.prototype = Object.assign(
    {
        getList:function(){
            return this.list;
        },
        haveChild:function(child){
            for(let index = 0; index<this.list.length;index++){
                if(this.list[index].id == child.id){
                    return index;
                }
            }
            return -1;
        },
        getIndex:function(id){
            for(let index = 0; index<this.list.length;index++){
                if(this.list[index].id == id){
                    return index;
                }
            }
            return -1;
        },
        getChildByAreaId:function(areaId){
            for(let index = 0; index<this.list.length;index++){
                if(this.list[index].areaId == areaId){
                    return this.list[index];
                }
            }
            return null;
        }
    },

    {
        getChild:function(id){
            for(let index = 0; index<this.list.length;index++){
                if(this.list[index].id == id){
                    return this.list[index];
                }
            }
            return null;

        },
        addChild:function(child){
            if (child == null || this.haveChild(child)>-1)
            {
                return;
            }
            this.list.push(child);

        },
        addChildren:function(children){
            for (let i = 0; i < children.length; i++)
            {
            this.addChild(children[i]);
            }

        },
        insertChild:function(index,child){
            if (child == null || this.haveChild(child)>-1)
            {
                return;
            }
            this.list.splice(index,0, child);
        },
        insertChildren:function(index,children){
            for (let i = 0; i < children.length; i++)
            {
                this.insertChild(index + i, children[i]);
            }
        },
        removeChild:function(child){
            var i = this.list.indexOf(child);
            if (i >= 0)
            {
                this.removeChildrenPrivate(i, 1, true);
            }
        },
        removeChildById:function(id){
            let i= this.getIndex(id);
            if (i >= 0)
            {
                this.removeChildrenPrivate(i, 1, true);
            }
        },
        removeAllChildren:function(){
            this.removeChildrenPrivate(0, this.list.length, false);
        },
        removeChildrenPrivate:function(from,count,destroy){
            if (from < 0 || count <= 0)
            {
                return;
            }
            this.list.splice(from,count);

        }
});
export default ListLayers;