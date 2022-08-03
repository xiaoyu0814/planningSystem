var environment = function () {
    this.cloud = {};
    this.weather = {};
    this.ocean = {};
    this.vision = {};
    this.infrared = {};
    this.sonar = {};
    this.radar = [];
    this.id = -1;
}
environment.prototype = Object.assign({
    getList: function () {
        return this.NavPointlist;
    },
    setId: function (id) {
        this.id = id;
    },
    getId: function () {
        return this.id;
    },
    setCloud: function (element) {
        this.cloud = element
    },
    getCloud: function () {
        return this.cloud
    },
    setWeather: function (element) {
        this.weather = element
    },
    getWeather: function () {
        return this.weather
    },
    setOcean: function (element) {
        this.ocean = element
    },
    getOcean: function () {
        return this.ocean
    },
    setVision: function (element) {
        this.vision = element
    },
    getVision: function () {
        return this.vision
    },
    setInfrared: function (element) {
        this.infrared = element
    },
    getInfrared: function () {
        return this.infrared
    },
    setSonar: function (element) {
        this.sonar = element
    },
    getSonar: function () {
        return this.sonar
    },
    addRadar: function (element) {
        this.radar.push(element)
    },
    getRadarCount: function () {
        return this.radar.length
    },
    getRadarByIndex: function (index) {
        var result;
        result = this.radar[index];
        return result;
    },
    removeNavPointByIndex: function (nIndex) {

    },
    insertNavPointByIndex(nIndex, navPoint) {

    }
}, {
    copy: function (source) {
        let obj = Object.assign(source);
        this.cloud = obj.cloud;
        this.weather = obj.weather;
        this.ocean = obj.ocean;
        this.vision = obj.vision;
        this.infrared = obj.infrared;
        this.sonar = obj.sonar;
        this.radar = obj.radar;
        this.id = obj.id;

        return this;

    },
    clone: function () {
        return new environment().copy(this);
    },
});
export default environment;