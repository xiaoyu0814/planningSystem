var environment = function () {
    this.equipment = {};
}
environment.prototype = Object.assign({
    setList: function (key, value) {
        this.equipment[key] = value
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