var news = function () {
    this.news = [];
}
news.prototype = Object.assign({
    setList: function (id) {
        this.news.push(id)
    }
}, {
    copy: function (source) {
        let obj = Object.assign(source);
        this.id = obj.id;

        return this;

    },
    clone: function () {
        return new news().copy(this);
    },
});
export default news;