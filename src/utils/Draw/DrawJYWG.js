import UTMCoord from '../Code/UTMCoord'

function DrawJYWG(map) {
    this.textLayer = false;
    this.map = map;
    this.canDraw = true;
    // this.StartDraw();
}
DrawJYWG.prototype.StartDraw = function () {
    let map = this.map;
    let _this = this;
    let init_bound = map.getBounds();
    _this.GetUTMCoord(...init_bound)
    map.on('zoomend', () => {
        if (_this.canDraw) {
            if (map.getLayer('jw_line')) {
                map.remove(map.getLayer('jw_line'))
            }
            if (_this.textLayer) {
                map.map.removeLayer(_this.textLayer)
                _this.textLayer = false;
            }
            if (map.getZoom() >= 12) {
                let bound = map.getBounds();
                _this.GetUTMCoord(...bound)
            } else {
                return
            }
        } else {
            return;
        }
    })

}
DrawJYWG.prototype.Clear = function () {
    if (this.map.getLayer('jw_line')) {
        this.map.remove(this.map.getLayer('jw_line'))
    }
    if (this.textLayer) {
        this.map.map.removeLayer(this.textLayer)
        this.textLayer = false;
    }
    this.map.off('zoomend', () => {})
    // this.map = null;
}
DrawJYWG.prototype.GetUTMCoord = function (slen, slat, elen, elat) {
    let _UTMCoord = new UTMCoord();

    let zone = _UTMCoord.UTMZone(slen)
    let showZone = Number(zone)
    if (slen > 0) {
        showZone = zone - 30;
    }
    let UTMxy = _UTMCoord.GeoToLocation({
        x: slen,
        y: slat
    }, zone);
    let sUTMx = Math.floor(UTMxy.x / 1000)
    let sUTMy = Math.floor(UTMxy.y / 1000)
    let showZonePoints = [];
    let showXPoints = [];
    let showX2Points = [];

    let xArray = [];
    let yArray = [];
    let utmXList = [];
    let utmYList = [];
    let xBoolean = true
    do {
        sUTMx = sUTMx + 1;
        let geo = _UTMCoord.LocationToGeo({
            x: sUTMx * 1000,
            y: UTMxy.y
        }, zone, false);
        if (geo.x > elen) {
            xBoolean = false
        }
        xArray.push(geo.x);
        utmXList.push(sUTMx)
    } while (xBoolean);
    let yBoolean = true;
    do {
        sUTMy = sUTMy + 1
        let geo = _UTMCoord.LocationToGeo({
            x: UTMxy.x,
            y: sUTMy * 1000
        }, zone, false);
        if (geo.y > elat) {
            yBoolean = false
        }
        yArray.push(geo.y);
        utmYList.push(sUTMy);

    } while (yBoolean)

    let lines = []

    //    let slonline = [[slen,slat],[elen,slat]]
    //    let slatline = [[slen,slat],[slen,elat]]
    let slonline = [
        [(slen + xArray[0]) / 2, (slat + yArray[0]) / 2],
        [elen, (slat + yArray[0]) / 2]
    ]
    let slatline = [
        [(slen + xArray[0]) / 2, (slat + yArray[0]) / 2],
        [(slen + xArray[0]) / 2, elat]
    ]
    lines.push(turf.lineString(slonline))
    lines.push(turf.lineString(slatline))
    //    let latlines = []
    for (let i = 0; i < xArray.length; i++) {
        for (let j = 0; j < yArray.length; j++) {
            // points.push(turf.point( [xArray[i],yArray[j]]))
            if (i == 0) {
                let latpoint = [xArray[0], yArray[j]]
                let showY = Math.floor(utmYList[j] / 100);
                let showY2 = Math.floor(utmYList[j] - showY * 100);
                let showXpoint = turf.point(latpoint, {
                    "value": showY,
                    "textSize": 12,
                    "offsetX": -8,
                    "offsetY": 10
                })
                let showX2point = turf.point(latpoint, {
                    "value": showY2,
                    "textSize": 16,
                    "offsetX": 8,
                    "offsetY": 10
                })
                showZonePoints.push(showXpoint);
                showZonePoints.push(showX2point);
            }

            let latline = [
                [xArray[0], yArray[j]],
                [xArray[xArray.length - 1], yArray[j]]
            ]

            lines.push(turf.lineString(latline))
        }
        let lonpoint = [xArray[i], yArray[0]]
        let showX = Math.floor(utmXList[i] / 100);
        let showX2 = Math.floor(utmXList[i] - showX * 100);
        let showZonePoint = turf.point(lonpoint, {
            "value": showZone,
            "textSize": 12,
            "offsetX": -18,
            "offsetY": 8
        })
        let showXpoint = turf.point(lonpoint, {
            "value": showX,
            "textSize": 12,
            "offsetX": -8,
            "offsetY": 10
        })
        let showX2point = turf.point(lonpoint, {
            "value": showX2,
            "textSize": 16,
            "offsetX": 8,
            "offsetY": 10
        })
        showZonePoints.push(showZonePoint);
        showZonePoints.push(showXpoint);
        showZonePoints.push(showX2point);
        let lonline = [
            [xArray[i], yArray[0]],
            [xArray[i], yArray[yArray.length - 1]]
        ];
        lines.push(turf.lineString(lonline))
    }

    let lineFeature = turf.featureCollection(lines);
    if (this.map.getLayer('jw_line')) {
        this.map.remove(this.map.getLayer('jw_line'))
    }
    let lineLayer = new PIE.MetoStyle.LineLayer({
        id: "jw_line",
        data: lineFeature
    })
    this.map.add(lineLayer);

    let text1Features = turf.featureCollection(showZonePoints);

    this.addTextLayer(text1Features)
}


DrawJYWG.prototype.addTextLayer = function (data) {
    let _this = this;
    var sourceTemp = new PIE.ol.source.Vector({
        features: (new PIE.ol.format.GeoJSON()).readFeatures(data, {
            featureProjection: "EPSG:3857"
        })
    });
    var vectorLayer = new PIE.ol.layer.Vector({
        source: sourceTemp,
        style: function (feature) {
            return _this.styleFormatByFeature(feature)
        },
    });
    vectorLayer.id = "jw_text";
    this.textLayer = vectorLayer;
    this.map.map.addLayer(vectorLayer)
}
DrawJYWG.prototype.styleFormatByFeature = function (feature) {
    var properties = feature.getProperties();
    let style = new PIE.ol.style.Style({
        text: new PIE.ol.style.Text({
            text: properties.value.toString(),
            font: properties.textSize + 'px sans-serif',
            overflow: true,
            offsetX: properties.offsetX,
            offsetY: properties.offsetY,
            fill: new PIE.ol.style.Fill({
                color: '#000'
            })
        }),
    })
    return style;
}
export default DrawJYWG