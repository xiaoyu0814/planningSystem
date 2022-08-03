var DrawLine = function (map, callback) {
  var map = map;
  var callback = callback;
  var drawtype = true;
  this.startDrawLine = function (_callback) {
    drawtype = false;
    callback = _callback;
    // map.map.dragPan.disable();
    // map.map.dragRotate.disable();
    mapMoveDisable()
    map.on("mousedown", mouseDown);
    map.on("mousemove", mouseMoveLine);
    map.on("mouseup", mouseUpLine);
  };

  this.startDrawRect = function (_callback) {
    callback = _callback;
    // map.map.dragPan.disable();
    // map.map.dragRotate.disable();
    mapMoveDisable()
    map.on("mousedown", mouseDown);
    map.on("mousemove", mouseMoveRect);
    map.on("mouseup", mouseUpRect);
  };

  this.startDrawPoint = function (_callback) {
    callback = _callback;
    // map.map.dragPan.disable();
    // map.map.dragRotate.disable();
    mapMoveDisable()
    map.on("mousedown", mouseDownPoint);
  };

  this.endDraw = function () {
    // map.map.dragPan.enable();
    // map.map.dragRotate.enable();
    drawtype = true;
    mapMoveEnable()
    map.off("mousedown", mouseDownPoint);
    if (map.getLayer("line_test")) map.remove(map.getLayer("line_test"));
    if (map.getLayer("point_test")) map.remove(map.getLayer("point_test"));
    if (map.getLayer("rect_test")) map.remove(map.getLayer("rect_test"));
    map.off("mousedown", mouseDown);
    map.off("mousemove", mouseMoveLine);
    map.off("mouseup", mouseUpLine);
    map.off("mousemove", mouseMoveRect);
    map.off("mouseup", mouseUpRect);
  };

  this.pauseDraw = function () {
    // map.map.dragPan.enable();
    // map.map.dragRotate.enable();
    map.off("mousedown", mouseDownPoint);
    // if (map.getLayer("line_test")) map.remove(map.getLayer("line_test"));
    // if (map.getLayer("point_test")) map.remove(map.getLayer("point_test"));
    // if (map.getLayer("rect_test")) map.remove(map.getLayer("rect_test"));
    map.off("mousedown", mouseDown);
    map.off("mousemove", mouseMoveLine);
    map.off("mouseup", mouseUpLine);
    map.off("mousemove", mouseMoveRect);
    map.off("mouseup", mouseUpRect);
  };

  var downDraw = false,
    startLng, startLat;

  this.setBounds = function (lines) {
    if (map.getLayer("line_test")) {
      map.getLayer("line_test").setSource(getLineData(lines));
    } else {
      let lines = new PIE.MetoStyle.LineLayer({
        data: getLineData(lines),
        id: "line_test",
        color: "#ff0000",
        width: 2
      });
      map.add(lines);
    }
  };

  function mouseDownPoint(e) {
    e.coordinate = turf.toWgs84(e.coordinate)
    e.lngLat = {
      lng: e.coordinate[0],
      lat: e.coordinate[1],
    }
    drawPoint(e.lngLat);
  }

  function mouseDown(e) {
    if (drawtype) return
    e.coordinate = turf.toWgs84(e.coordinate)
    e.lngLat = {
      lng: e.coordinate[0],
      lat: e.coordinate[1],
    }
    downDraw = true;
    startLng = e.lngLat.lng;
    startLat = e.lngLat.lat;
  }

  function mouseMoveRect(e) {
    e.coordinate = turf.toWgs84(e.coordinate)
    e.lngLat = {
      lng: e.coordinate[0],
      lat: e.coordinate[1],
    }
    if (downDraw) {
      drawRect(e.lngLat);
    }
  }

  function mouseMoveLine(e) {
    e.coordinate = turf.toWgs84(e.coordinate)
    e.lngLat = {
      lng: e.coordinate[0],
      lat: e.coordinate[1],
    }
    if (downDraw) {
      drawLine(e.lngLat);
    }
  }

  function mouseUpLine(e) {

    e.coordinate = turf.toWgs84(e.coordinate)
    e.lngLat = {
      lng: e.coordinate[0],
      lat: e.coordinate[1],
    }
    if (downDraw) {
      downDraw = false;
      var line = [
        [startLng, startLat],
        [e.lngLat.lng, e.lngLat.lat]
      ];
      if (callback && typeof callback === "function") {
        callback(line);
      }
    }
  }

  function mouseUpRect(e) {
    e.coordinate = turf.toWgs84(e.coordinate)
    e.lngLat = {
      lng: e.coordinate[0],
      lat: e.coordinate[1],
    }
    if (downDraw) {
      downDraw = false;
      let lnglat = e.lngLat;
      let rect = [
        [startLng, startLat],
        [startLng, lnglat.lat],
        [lnglat.lng, lnglat.lat],
        [lnglat.lng, startLat]
      ]
      if (callback && typeof callback === "function") {
        callback(rect);
      }
    }
  }

  function drawPoint(lnglat) {
    var point = [lnglat.lng, lnglat.lat];
    if (map.getLayer("point_test")) {
      map.getLayer("point_test").setSource(getPointData(point));
    } else {
      let lines = new PIE.MetoStyle.PointLayer({
        data: getPointData(point),
        id: "point_test",
        color: "#ff0000"
      });
      map.add(lines);
    }
    if (callback && typeof callback === "function") {
      callback(point);
    }
  }

  function drawLine(lnglat) {
    if (drawtype) return
    let line = [
      [startLng, startLat],
      [lnglat.lng, lnglat.lat]
    ];
    if (map.getLayer("line_test")) {
      map.getLayer("line_test").setSource(getLineData(line));
    } else {
      let lines = new PIE.MetoStyle.LineLayer({
        data: getLineData(line),
        id: "line_test",
        color: "#ff0000",
        width: 2
      });
      map.add(lines);
    }

  }

  function drawRect(lnglat) {

    let rect = [
      [startLng, startLat],
      [startLng, lnglat.lat],
      [lnglat.lng, lnglat.lat],
      [lnglat.lng, startLat],
      [startLng, startLat]
    ];
    if (map.getLayer("rect_test")) {
      map.getLayer("rect_test").setSource(getLineData(rect));
    } else {
      let lines = new PIE.MetoStyle.LineLayer({
        data: getLineData(rect),
        id: "rect_test",
        color: "#ff0000",
        width: 2
      });
      map.add(lines);
    }

  }

  function getPointData(line) {
    var dataLine = {
      "type": "FeatureCollection",
      "features": []
    };
    var dataLineset = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": line
      }
    };
    dataLine.features.push(dataLineset);
    return dataLine;
  }

  function getLineData(line) {

    var dataLine = {
      "type": "FeatureCollection",
      "features": []
    };
    var dataLineset = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": line
      }
    };
    dataLine.features.push(dataLineset);
    return dataLine;
  }

  function mapMoveEnable() {
    map.map.getInteractions().forEach((element, index, array) => {
      var DragPan = PIE.ol.interaction.DragPan
      if (element instanceof DragPan) {
        element.setActive(true)
      }
    })
  }

  function mapMoveDisable() {
    map.map.getInteractions().forEach((element, index, array) => {
      var DragPan = PIE.ol.interaction.DragPan
      if (element instanceof DragPan) {
        element.setActive(false)
      }
    })
  }
  
};
export default DrawLine