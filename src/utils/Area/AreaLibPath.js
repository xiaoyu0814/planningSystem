var AreaLibPath = function () {
    this.areaPointlist = [];
    this.name = null;
    this.num = null;
    this.type = -1; //类型
    this.ascription = null; //属方
}
AreaLibPath.prototype = Object.assign({
    init: function () {

    },
    getList: function () {
        return this.areaPointlist;
    },
    setName: function (name) {
        this.name = name;
    },
    getName: function () {
        return this.name;
    },
    setNum: function (num) {
        this.num = num;
    },
    getNum: function () {
        return this.num;
    },
    setType: function (type) {
        this.type = type;
    },
    getType: function () {
        return this.type;
    },
    setAscription: function (ascription) {
        this.ascription = ascription;
    },
    getAscription: function () {
        return this.ascription;
    },
    setAreaPointList: function (pointList) {
        this.areaPointlist = pointList;
    },
    getAreaPointCount: function () {
        return this.areaPointlist.length;
    },
    getAreaPointByIndex: function (nIndex) {
        var result;
        result = this.areaPointlist[nIndex];
        return result;
    },
    setAreaPointByIndex: function (nIndex, areaPoint) {
        this.areaPointlist[nIndex] = areaPoint;
    },
    removeAreaPointByIndex: function (nIndex) {
        if (this.areaPointlist.length < 1) {
            this.areaPointlist = []
        } else {
            this.areaPointlist.splice(nIndex, 1);
        }
    },
    insertAreaPointByIndex(nIndex, areaPoint) {
        this.areaPointlist.splice(nIndex, 0, areaPoint)
    },
}, {
    /**
     * 添加导航点 
     *{
     *   position:{
     *       x：,
     *       y: ,
     *       z:,
     *             }，
     *   stamp:
     * }
     * @param {Object} areaPoint 
     */
    AddAreaPoint: function (areaPoint) {
        this.areaPointlist.push(areaPoint);
    },
    copy: function (source) {
        let obj = Object.assign(source);
        this.name = obj.name;
        this.areaPointlist = [...obj.areaPointlist];
        this.num = obj.num;
        return this;

    },
    clone: function () {
        return new AreaLibPath().copy(this);
    },
});
export default AreaLibPath;