var FormationNode = function(name,typeId,id){
    this.name = name;
    this.typeId = typeId;
    this.id = id;
}
FormationNode.prototype = Object.assign({
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
export default FormationNode;