var EquipNode = function(name,typeId,modelId){
    this.name = name;
    this.typeId = typeId;
    this.modelId = modelId;
    this.speed = 0;
    this.hangingBullet = []; // 挂弹
    this.bait = []; // 诱饵
    this.sensor = [] // 传感器
    this.communication = [] // 通讯设备
}
EquipNode.prototype = Object.assign({
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
    setHangingBullet(node){
        this.hangingBullet.push(node)
    },
    getHangingBullet(){
        return this.hangingBullet
    },
    setBait(node){
        this.bait.push(node)
    },
    getBait(){
        return this.bait
    },
    setSensor(node){
        this.sensor.push(node)
    },
    getSensor(){
        return this.sensor
    },
    setSpeed(speed){
        this.speed = Number(speed)
    },
    getSpeed(){
        return this.speed
    },
    setCommunication(communication){
        this.communication.push(communication)
    },
    getCommunication(){
        return this.communication
    }
});
export default EquipNode;