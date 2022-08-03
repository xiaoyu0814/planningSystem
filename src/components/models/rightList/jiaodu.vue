<template>
  <div id="watian">
    <header>
      <span>角度量算</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div style="padding:10px">
      <p>
        角度（°）：
        <span>{{ num }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      num: 0,
      drawStart: false,
      pointArr: [],
    };
  },
  computed: {
    isShowMeasureDistance() {
      return this.showMeasureDistance;
    },
  },
  mounted() {
    var self = this;
    this.drawStart = this.$store.state.jiaodu_show;
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
    }
  },
  methods: {
    getDistance(e) {
      if (!this.$map.map.getLayer("measureAngle")) {
        var graphicsLayer = new PIE.GraphicsLayer({
          id: "measureAngle",
          graphics: [],
          map: this.$map.map,
        });
        this.$map.map.add(graphicsLayer);
      }
      let coord = e.coordinate;
      if (Math.abs(e.coordinate[0] > 180)) {
        coord = turf.toWgs84(coord);
      }
      this.pointArr.push(coord);
      var point = new PIE.Point(coord[0], coord[1]);
      var pointGrap = new PIE.Graphics({
        geometry: point,
        symbol: new PIE.MarketSymbol({ color: "#47ff7a", size: 5 }),
      });

      //定义一组线的坐标
      var linePath = [this.pointArr];
      var line = new PIE.Line(linePath);
      var LineGrap = new PIE.Graphics({
        geometry: line,
        symbol: new PIE.LineSymbol({ color: "#47ff7a", width: 3 }),
      });
      this.$map.map.getLayer("measureAngle").add(pointGrap);
      this.$map.map.getLayer("measureAngle").add(LineGrap);
      var dis = PIE.getLength(this.pointArr);

      this.$store.state.distance = this.num;

      if (this.pointArr.length == 3) {
        let s_angle = turf.bearingToAzimuth(
          turf.bearing(
            this.pointArr[0],
            this.pointArr[1]
          )
        );
        let e_angle = turf.bearingToAzimuth(
          turf.bearing(
            this.pointArr[2],
            this.pointArr[1]
          )
        );
        // console.log(e_angle,s_angle)
        let angle = e_angle - s_angle
        if (angle < 0) {
          angle = 360 + angle
        }
        if (angle > 180) {
          angle = 360 - angle;
        }
        this.num = angle.toFixed(3);
        this.drawStart = false;
      }
    },
    onCancel() {
      this.drawStart = false;
      this.$store.state.jiaodu_show = false;
      this.$emit("closeMeasureAngle", "测角");
    },
  },
}
</script>

<style scoped>
#watian {
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