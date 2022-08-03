/**
 * Define a namespace for the application.
 */
var pieApp = {};

/**
 * @constructor
 * @extends {ol.interaction.Pointer}
 */
pieApp.Drag = function (source) {

  ol.interaction.Pointer.call(this, {
    source: source,
    handleDownEvent: pieApp.Drag.prototype.handleDownEvent,
    handleDragEvent: pieApp.Drag.prototype.handleDragEvent,
    handleMoveEvent: pieApp.Drag.prototype.handleMoveEvent,
    handleUpEvent: pieApp.Drag.prototype.handleUpEvent
  });

  this.mode = null;

  /**
   * @type {ol.Pixel}
   * @private
   */
  this.coordinate_ = null;

  /**
   * @type {string|undefined}
   * @private
   */
  this.cursor_ = 'pointer';

  /**
   * @type {ol.Feature}
   * @private
   */
  this.feature_ = null;

  /**
   * @type {string|undefined}
   * @private
   */
  this.previousCursor_ = undefined;

  /**
   * @type {Array|null}
   * @private
   */
  this.startCoordinate = null;

};
ol.inherits(pieApp.Drag, ol.interaction.Pointer);


/**
 * @param {ol.MapBrowserEvent} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
pieApp.Drag.prototype.handleDownEvent = function (evt) {
  var map = evt.map;

  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function (feature, layer) {
      //  console.log(layer);
      //  if(layer){
      //    let properties = layer.getProperties();
      //    if(properties.name == "plotLayerWebEdit"){
      //     return feature;
      //    }
      //  }
      return feature;
    });
  console.log(feature)
  if (feature) {
    this.coordinate_ = evt.coordinate;
    this.startCoordinate = JSON.parse(JSON.stringify(evt.coordinate));
    this.feature_ = feature;
    this.mode = feature.get('handle');
    console.log(this.mode);
    console.log(feature)
    console.log(evt.coordinate)
    // revoke_list.push({
    //   type: 'translate',
    //   features: feature,
    //   coordinate: evt.coordinate
    // })
  }

  return !!feature;
};


/**
 * @param {ol.MapBrowserEvent} evt Map browser event.
 */
pieApp.Drag.prototype.handleDragEvent = function (evt) {
  if (this.mode) {
    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];

    var geometry = this.feature_.getGeometry();
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
  } else {

  }
  // if(this.callback){
  //   this.callback({ type:'translate', features: this.feature_,coordinate:this.coordinate_ })
  // }
};


/**
 * @param {ol.MapBrowserEvent} evt Event.
 */
pieApp.Drag.prototype.handleMoveEvent = function (evt) {
  if (this.cursor_) {
    var map = evt.map;
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function (feature) {
        return feature;
      });
    var element = evt.map.getTargetElement();
    if (feature) {
      if (element.style.cursor != this.cursor_) {
        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
      element.style.cursor = this.previousCursor_;
      this.previousCursor_ = undefined;
    }
  }
};


/**
 * @return {boolean} `false` to stop the drag sequence.
 */
pieApp.Drag.prototype.handleUpEvent = function () {
  //    this.dispatchEvent({ type:'translate', features: this.feature_,coordinate:this.coordinate_ });
  if (this.callback) {
    this.callback({
      type: 'translate',
      features: this.feature_,
      coordinate: this.coordinate_,
      startCoordinate: this.startCoordinate
    })
  }
  this.coordinate_ = null;
  this.feature_ = null;
  this.mode = null;
  return false;
};

export default pieApp