
var NavPath = function () {
    this.LoopIndex = -1;
    this.NavPointlist = [];
    this.name = null;
    this.num = null;
}
NavPath.prototype = Object.assign({
    getList:function(){
        return this.NavPointlist;
    },
    getLoopIndex: function () {
        return this.LoopIndex;
    },
    SetLoopIndex: function (loopIndex) {
        this.LoopIndex = loopIndex;
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
		this.LoopIndex = obj.LoopIndex;
		this.num = obj.num;
		return this;

	},
    clone: function () {
		return new NavPath().copy( this );
	},
});
export default NavPath;