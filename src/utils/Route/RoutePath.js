
var RoutePath = function () {
    this.NavPointlist = [];
    this.name=null;
    this.num = null;
    this.id = -1;
    this.width = 1;
}
RoutePath.prototype = Object.assign({
    getList:function(){
        return this.NavPointlist;
    },
    setWidth:function(width){
        this.width = width;
    },
    getWidth: function () {
        return this.width;
    },   
    setId: function (id) {
        this.id = id;
    },
    getId:function(){
        return this.id;
    },
    setName:function(name){
        this.name = name;
    },
    getName:function(){
        return this.name;
    },
    setNum:function(num){
        this.num = num;
    },
    getNum:function(){
        return this.num;
    },
    setNavPointList:function(pointList){
        this.NavPointlist = pointList;
    },
    getNavPointCount: function () {
        return this.NavPointlist.length;
    },
    getNavPointByIndex: function (nIndex) {
        var result;
        result = this.NavPointlist[nIndex];
        return result;
    },
    setNavPointByIndex: function (nIndex, navPoint) {
        this.NavPointlist[nIndex] = navPoint;
    },
    removeNavPointByIndex: function (nIndex) {
        if (this.NavPointlist.length < 1) {
            this.NavPointlist = []
        } else {
            this.NavPointlist.splice(nIndex, 1);
        }
    },
    insertNavPointByIndex(nIndex, navPoint) {
        this.NavPointlist.splice(nIndex, 0, navPoint)
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
     * @param {Object} NavPoint 
     */
    AddNavPoint: function (NavPoint) {
        this.NavPointlist.push(NavPoint);
    },
    copy: function ( source ) {
        let obj = Object.assign(source);
		this.name = obj.name;
		this.NavPointlist = [...obj.NavPointlist];
		this.id = obj.id;
		this.width = obj.width;
		this.num = obj.num;
		return this;

	},
    clone: function () {
		return new RoutePath().copy( this );
	},
});
export default RoutePath;