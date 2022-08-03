<template>
  <div id="measureDistance">
    <header>
      <span>测距</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div style="margin: 10px">
      <p>
        距离(km)：
        <span>{{ num }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showMeasureDistance: Boolean,
    pointArr: Array,
  },
  data: function () {
    return {
      num: 0,
      drawStart: false,
    };
  },
  computed: {
    isShowMeasureDistance() {
      return this.showMeasureDistance;
    },
    isPointArr() {
      return this.pointArr;
    },
  },
  mounted() {
    var self = this;
    this.drawStart = this.$store.state.measureDistance_show;
    var distance = function (e) {
      if (self.drawStart) {
        self.getDistance(e);
        // console.log("每次都进");
      } else {
        return;
      }
    };
    if (this.drawStart) {
      this.$map.map.on("click", distance);
    } else {
      this.$map.map.off("click", distance);
    }
  },
  watch: {
    isShowMeasureDistance(val) {
      var self = this;
      this.drawStart = val;
      var distance = function (e) {
        if (self.drawStart) {
          self.getDistance(e);
          // console.log("每次都进");
        } else {
          return;
        }
      };
      if (val) {
        this.$map.map.on("click", distance);
      } else {
        this.$map.map.off("click", distance);
      }
    },
    isPointArr(val) {
      if (val === []) {
        this.num = 0;
      }
    },
  },
  methods: {
    getDistance(e) {
      if (!this.$map.map.getLayer("measureDistance")) {
        var graphicsLayer = new PIE.GraphicsLayer({
          id: "measureDistance",
          graphics: [],
          map: this.$map.map,
        });
        this.$map.map.add(graphicsLayer);
      }
      let coord = e.coordinate;
      if (Math.abs(e.coordinate[0] > 180)) {
        coord = turf.toWgs84(coord);
      }
      this.isPointArr.push(coord);
      var point = new PIE.Point(coord[0], coord[1]);
      var pointGrap = new PIE.Graphics({
        geometry: point,
        symbol: new PIE.MarketSymbol({ color: "#47ff7a", size: 5 }),
      });

      //定义一组线的坐标
      var linePath = [this.isPointArr];
      var line = new PIE.Line(linePath);
      var LineGrap = new PIE.Graphics({
        geometry: line,
        symbol: new PIE.LineSymbol({ color: "#47ff7a", width: 3 }),
      });
      this.$map.map.getLayer("measureDistance").add(pointGrap);
      this.$map.map.getLayer("measureDistance").add(LineGrap);
      var dis = PIE.getLength(this.isPointArr);
      this.num = dis.toFixed(3);
      this.$store.state.distance = this.num;
    },
    onCancel() {
      this.drawStart = false;
      this.$store.state.measureDistance_show = false;
      this.$emit("closeMeasureDistance", "测距");
    },
  },
};
</script>

<style scoped>
#measureDistance {
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