<template>
  <div id="measureArea">
    <header>
      <span>测面</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div style="margin: 10px">
      <p>
        面积(km²)：
        <span>{{ num }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showMeasureArea: Boolean,
    isLinePath: Array,
  },
  data: function () {
    return {
      num: 0,
      drawStart: false,
      _Points: null,
      _Lines: null,
      _Fills: null,
      pointData: [],
    };
  },
  computed: {
    isShowMeasureArea() {
      return this.showMeasureArea;
    },
    linePath() {
      return this.isLinePath;
    },
  },
  mounted() {
    var self = this;
    this.drawStart = this.$store.state.measureArea_show;
    var area = function (e) {
      if (self.drawStart) {
        self.drawElementAndArea(e);
        self.draw(e);
      } else {
        return;
      }
    };
    if (self.drawStart) {
      this.$map.map.on("click", area);
    } else {
      this.$map.map.off("click", area);
    }
  },
  watch: {
    isShowMeasureArea(val) {
      var self = this;
      this.drawStart = val;
      var area = function (e) {
        if (self.drawStart) {
          self.drawElementAndArea(e);
          self.draw(e);
        } else {
          return;
        }
      };
      if (val) {
        this.$map.map.on("click", area);
      } else {
        this.$map.map.off("click", area);
      }
    },
    linePath(val) {
      if (val === []) {
        this.num = 0;
        this.pointData = [];
      }
    },
  },
  methods: {
    drawElementAndArea(e) {
      let coord = e.coordinate;
      if (Math.abs(e.coordinate[0] > 180)) {
        e.coordinate = turf.toWgs84(coord);
      }
      var newPoint = e.coordinate;
      if (this.linePath.length == 2) {
        this.linePath.unshift(this.linePath[this.linePath.length - 1]);
      }
      if (this.linePath.length < 2) {
        this.linePath.unshift(newPoint);
      } else {
        this.linePath.splice(1, 0, newPoint);
      }
      // this.draw();
    },
    draw(e) {
      if (this.$map.map.getLayer("measureDistance")) {
        var a = this.$map.map.getLayer("measureDistance");
        this.$map.map.remove(a);
      }
      var graphicsLayer_point;
      if (!this.$map.map.getLayer("graphicsLayer_point")) {
        graphicsLayer_point = new PIE.GraphicsLayer({
          id: "graphicsLayer_point",
          graphics: [],
          map: this.$map.map,
        });
        this.$map.map.add(graphicsLayer_point);
      }

      var graphicsLayer = new PIE.GraphicsLayer({
        id: "measureDistance",
        graphics: [],
        map: this.$map.map,
      });
      this.$map.map.add(graphicsLayer);
      if (this.pointData.length > 3) {
        this.pointData.splice(this.pointData.length - 1, 0, e.coordinate);
      } else {
        this.pointData.push(e.coordinate);
      }
      var point = new PIE.Point(e.coordinate[0], e.coordinate[1]);
      var pointGrap = new PIE.Graphics({
        geometry: point,
        symbol: new PIE.MarketSymbol({ color: "#f00", size: 5 }),
      });
      var line = new PIE.Line(this.pointData);
      var LineGrap = new PIE.Graphics({
        geometry: line,
        symbol: new PIE.LineSymbol({ color: "#47ff7a", width: 3 }),
      });
      if (this.pointData.length === 3) {
        this.pointData.push(this.pointData[0]);
      }
      // console.log(this.pointData);
      var polygon = new PIE.Polygon([this.pointData]);
      var polygonGrap = new PIE.Graphics({
        geometry: polygon,
        symbol: new PIE.FillSymbol({ color: "#ff0", opacity: 0.5 }),
      });
      // if (this.$map.map.getLayer("graphicsLayer_point")) {
      this.$map.map.getLayer("graphicsLayer_point").add(pointGrap);
      // } else {
      //   graphicsLayer_point.add(pointGrap);
      // }
      graphicsLayer.add(LineGrap);
      graphicsLayer.add(polygonGrap);
      var strPath = JSON.stringify(this.linePath);
      var arrPath = JSON.parse(strPath);
      this.num = (PIE.getArea(arrPath) / 1000000).toFixed(3);
    },
    onCancel() {
      this.drawStart = false;
      this.$store.state.measureArea_show = false;
      this.$emit("closeMeasureArea", "测面");
    },
  },
};
</script>

<style scoped>
#measureArea {
  background-color: #fff;
  width: 200px;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>