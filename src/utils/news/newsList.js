import { String2XML } from '../SimDataModel/utils';
import { NodeUnit } from '../SimDataModel/NodeConfig';
import news from './news';
var xmlStream = String2XML();

function newsList(element) {
    this.list = {};
    this.news = new news()
    this.readXml(element)
}
newsList.prototype = Object.assign({
    getList: function () {
        return this.list;
    },
    readXml: function (element) {
        console.log(element)
        if (element.length == 0) {
            return;
        }
        let newsElements = element[0].children;
        for (let i = 0; i < newsElements.length; i++) {
            let _news = this.getElement(newsElements[i]);
            if (_news) {
                this.list = Object.assign(_news)
            }
        }
    },
    getElement: function (newsElements) {
        if (newsElements) {
            var modelId = newsElements.getAttribute("序号");
            this.news.setList(modelId)
            return this.news.news
        } else {
            return null;
        }

    },
    writeEnvironmentList: function (element, node) {},
    writeXml: function (element) {
        for (let i = 0; i < this.list.length; i++) {
            this.writeEnvironmentList(element, this.list[i]);
        }
    }
})
export default newsList;