<template>
  <div id="position">
    <header>
      <span>定位点</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div style="border: 1px solid #ccc" id="inputBox">
      <div style="margin: 10px">
        <input type="text" id="Coordinates" placeholder="例如：110,35" />
        <button @click="search()">定位</button>
      </div>
      <!-- <div style="margin: 10px;">
          当前坐标：<input type="text" id="currentCoordinates" v-model="positionLonLat">
        </div>-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { pointGrap: null };
  },
  mounted() { },
  destroyed() {
    if (this.pointGrap) {
      this.$map.map.remove(this.pointGrap);
    }
  },
  methods: {
    search() {
      let _this = this;
      // var index = 0;
      var box = document.getElementById("inputBox");
      var err = document.createElement("P");
      var Coordinates = document.getElementById("Coordinates").value;
      if (Coordinates.indexOf(",") < 0) {
        err.innerHTML = "请输入正确的坐标信息,格式：lon,lat";
        err.style.color = "red";
        box.appendChild(err);
        setTimeout(function () {
          box.removeChild(err);
        }, 3000);
      } else {
        var lon = Number(Coordinates.split(",")[0]);
        var lat = Number(Coordinates.split(",")[1]);
        if (lon > 180 || lon < -180) {
          err.innerHTML = "经度坐标设置在-180至180之间";
          err.style.color = "red";
          box.appendChild(err);
          setTimeout(function () {
            box.removeChild(err);
          }, 3000);
          return;
        }
        if (lat > 85 || lat < -85) {
          err.innerHTML = "纬度坐标设置在-85至85之间";
          err.style.color = "red";
          box.appendChild(err);
          setTimeout(function () {
            box.removeChild(err);
          }, 3000);
          return;
        }
        var point = new PIE.Point(lon, lat);
        // var id = "point_"+index
        if (_this.pointGrap) {
          _this.$map.map.remove(_this.pointGrap);
        }
        // if (iconGrap) {
        //   _this.$map.map.remove(iconGrap);
        // }
        _this.pointGrap = new PIE.Graphics({
          geometry: point, // 绘制类型
          symbol: new PIE.MarketSymbol({ color: "#f00", size: 3 }), // 设置样式
        });
        _this.$map.map.add(_this.pointGrap); // 将定义的图层添加到底图上
        // var iconGrap = new PIE.MetoStyle.IconLayer({
        //   loadImageUrl: "static/images/position.png",
        //   data: {
        //     type: "FeatureCollection",
        //     features: [pointGrap.geometry.toJSON()],
        //   },
        //   anchor: "bottom",
        //   size: 0.15,
        // });
        // _this.$map.map.add(iconGrap);
        _this.$map.map.setCenter([lon, lat]);
        // index++;
      }
    },
    onCancel() {
      this.$store.state.position_show = false;
      this.$emit("closePosition", false);
    },
  },
};
</script>

<style scoped>
#position {
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

#Coordinates {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 5px;
  padding: 5px;
  outline: none;
}
</style>