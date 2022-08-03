export function XML2String(xmlObject) { //XML转字符串
    if (window.ActiveXObject) {
        return xmlObject.xml;
    } else {
        return (new XMLSerializer()).serializeToString(xmlObject);
    }
}
export function String2XML(xmlString) { //字符串转xml
    if (window.ActiveXObject) {
        var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
        xmlobject.async = "false";
        xmlobject.loadXML(xmlString);
        return xmlobject;
    } else {
        var parser = new DOMParser();
        var xmlobject = parser.parseFromString(xmlString, "text/xml");
        // console.log(xmlobject)
        return xmlobject;
    }
}
export function DownloadXML(data, filename) {
    var urlObject = window.URL || window.webkitURL || window;
    if (!data) {
        alert('data is null');
        return;
    }
    if (!filename) filename = 'xx.xml'
    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], {
        type: 'text/xml'
    });
    var dlLink = document.createElement('a');
    dlLink.download = filename;
    dlLink.href = urlObject.createObjectURL(blob);
    dlLink.dataset.downloadurl = ['text/xml', dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

}

export function SideTOColor(side) {
    let color = "#000";
    if (side == 1) {
        color = "#FF0000"
    } else if (side == 2) {
        color = "#0000FF"
    } else if (side == 3) {
        color = "#00FF00"
    } else if (side == 4) {
        color = "#FFA500"
    } else if (side == 5) {
        color = "#FFFF00"
    } else {
        color = "#880088"
    }
    return color;
};


export function GetDistance(fromArray,toArray){
    var from = turf.point(fromArray);
    var to = turf.point(toArray);

    var distance = turf.distance(from, to)*1000;
    return distance
}


export function getData(url,fn){
	var xhr = new XMLHttpRequest();         
	xhr.open("GET",url, true);
	xhr.onload = function () {
		if (xhr.status == 200 ) {
			var result = JSON.parse(xhr.response)
			if (result.length === 0) {
				console.log('数据读取失败');
				return false;
			}
			fn(result);
		
		} else {
			// reject(xhr.statusText);
		}
	};
	xhr.onerror = function () {
		// reject(xhr.statusText);
	};
	xhr.send(null);
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

}
export  function intToRgb(argb) {
    var rgb = [];
    rgb[0] = (argb & 0xff0000) >> 16;
    rgb[1] = (argb & 0xff00) >> 8;
    rgb[2] = (argb & 0xff);
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}