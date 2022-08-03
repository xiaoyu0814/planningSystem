var DoctrineNode = function(name,id,typeId){
    this.name = name;
    this.typeId = typeId;
    this.id = id;
}
DoctrineNode.prototype = Object.assign({
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
    getId:function(){
        return this.id;
    },
    setId:function(id){
        this.id = id;
    },
});
export default DoctrineNode;