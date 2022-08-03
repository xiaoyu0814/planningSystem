<template>
  <div id="bufferAnalysis">
    <header>
      <span>拓扑分析</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="缓冲区分析" name="first">
        <div class="content_box">
          <div>
            <el-radio-group v-model="radio" @change="value = false">
              <el-radio label="point">点</el-radio>
              <el-radio label="line">线</el-radio>
              <!-- <el-radio label="fill">面</el-radio> -->
            </el-radio-group>
          </div>
          <ul class="bufferAnalysis_style">
            <li class="bufferAnalysis_switch">
              <el-switch v-model="value" active-color="#409eff" inactive-color="#dcdfe6" @change="stareDraw">
              </el-switch>
              <span>开始绘制</span>
            </li>
            <li>
              <el-switch v-model="value1" active-color="#409eff" inactive-color="#dcdfe6" @change="analysis">
              </el-switch>
              <span>开始分析</span>
            </li>
          </ul>
          <div class="bufferAnalysis_input">
            <span style="margin-right: 10px">缓冲距离(m)</span>
            <el-input placeholder="请输入内容" v-model="radius" clearable size="mini" style="width: 130px"></el-input>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="叠加分析" name="second" class="diejia_style">
        <el-button type="primary" size="mini" @click="drawPolygon">
          绘制
        </el-button>
        <el-button type="primary" size="mini" @click="union"> 结合 </el-button>
        <el-button type="primary" size="mini" @click="clearPolygon">
          清除
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radius: "",
      isPointArr: [],
      draw: false,
      input: "",
      value: false,
      value1: false,
      radio: "point",
      draw_point: false,
      draw_line: false,
      draw_fill: false,
      activeName: "first",
      pointDatas: [],
      fillId: 0,
      polygonLayers: [],
      stareDraw_type: false,
    };
  },
  mounted() {
    this.$map.changeMapType(2);
  },
  destroyed() {
    this.draw_point = false;
    this.draw_line = false;
    this.draw_fill = false;
    this.onCancel();
  },
  methods: {
    handleClick(tab) {
      // if (tab.name == "second") {
      this.draw_point = false;
      this.draw_line = false;
      this.draw_fill = false;
      this.clearHCQLayer();
      // }s
    },
    stareDraw() {
      this.draw_point = false;
      this.draw_line = false;
      this.draw_fill = false;
      if (this.radio == "point") {
        this.draw_point = this.value;
        this.path = this.$path.geoTileAnalysis.getPointShapeBuffer;
        this.$map.map.on("click", this.drawPoint);
        console.log("point-");
      } else if (this.radio == "line") {
        this.draw_line = this.value;
        this.path = this.$path.geoTileAnalysis.getLineShapeBuffer;
        this.$map.map.on("click", this.drawLine);
        console.log("line-");
      } else {
        this.draw_fill = this.value;
        this.$map.map.on("click", this.drawFill);
        console.log("-");
      }
    },

    clearHCQLayer() {
      this.isPointArr = [];
      this.$map.clearMeasureLayer();
      if (this.$map.map.getLayer("HCQ_FillLayer")) {
        this.$map.map.remove(this.$map.map.getLayer("HCQ_FillLayer"));
      }
    },

    drawPoint(e) {
      if (!this.draw_point) return;
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
        symbol: new PIE.MarketSymbol({ color: "#f00", size: 5 }),
      });
      this.$map.map.getLayer("measureDistance").add(pointGrap);
      console.log(this.isPointArr);
    },

    drawLine(e) {
      if (!this.draw_line) return;
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
        symbol: new PIE.MarketSymbol({ color: "#f00", size: 5 }),
      });

      //定义一组线的坐标
      var linePath = [this.isPointArr];
      var line = new PIE.Line(linePath);
      var LineGrap = new PIE.Graphics({
        geometry: line,
        symbol: new PIE.LineSymbol({ color: "#47ff7a", width: 2 }),
      });
      this.$map.map.getLayer("measureDistance").add(pointGrap);
      this.$map.map.getLayer("measureDistance").add(LineGrap);
      console.log(linePath);
    },

    drawFill(e) { },

    analysis() {
      if (this.value1 == false) {
        this.clearHCQLayer();
      } else {
        let params = {
          points: this.isPointArr.join(";"),
          radius: this.radius,
        };
        this.$http.get(this.path, params).then((res) => {
          console.log("186--res", res);
          if (res.status == 200) {
            console.log(res.data);
            var data;
            // if (this.radio == "point") {
            if (res.data.data.indexOf("(((") > -1) {
              data = {
                features: [],
                type: "FeatureCollection",
              };
              let str = res.data.data.split("(((")[1];
              let str2 = str.split(")))")[0];
              let arr = str2.split(")), ((");
              for (let i = 0; i < arr.length; i++) {
                var str3 = arr[i].replace(/, /g, ";");
                var str4 = str3.replace(/ /g, ",");
                var pointData = str4.split(";");
                for (let j = 0; j < pointData.length; j++) {
                  let temp = pointData[j].split(",");
                  pointData[j] = [];
                  pointData[j].push(Number(temp[0]));
                  pointData[j].push(Number(temp[1]));
                }
                var temp = {
                  type: "Feature",
                  geometry: {
                    coordinates: [pointData],
                    type: "Polygon",
                  },
                };
                data.features.push(temp);
              }
            } else {
              console.log("isLine--218");
              let str = res.data.data.split("((")[1];
              let str2 = str.split("))")[0];
              let str3 = str2.replace(/, /g, ";");
              let str4 = str3.replace(/ /g, ",");
              let arr = str4.split(";");
              for (let i = 0; i < arr.length; i++) {
                let temp = arr[i].split(",");
                arr[i] = [];
                arr[i].push(Number(temp[0]));
                arr[i].push(Number(temp[1]));
              }
              data = {
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      coordinates: [arr],
                      type: "Polygon",
                    },
                  },
                ],
                type: "FeatureCollection",
              };
            }
            this.$map.FillLayer({
              data: data,
              id: "HCQ_FillLayer",
              color: "#ffbd02",
              opacity: 0.5,
              // strokeWidth: 1,
              // strokeColor: "#ffffff",
            });
          }
        });
      }
    },
    onCancel() {
      this.$store.state.bufferAnalysis_show = false;
    },
    drawPolygon() {
      this.stareDraw_type = true;
      this.$map.map.on("click", this.draw_Polygon);
      this.$map.map.on("dblclick", () => {
        this.stareDraw_type = false;
        this.polygonLayers.push("fill" + this.fillId);
        this.fillId++;
        this.pointDatas = [];
      });
    },
    clearPolygon() {
      for (let i = 0; i < this.polygonLayers.length; i++) {
        const element = this.polygonLayers[i];
        this.$map.map.remove(this.$map.map.getLayer(element));
      }
      this.removeDrawingLayer();
      this.polygonLayers = [];
    },
    removeDrawingLayer() {
      if (this.$map.map.getLayer("point_asdasd")) {
        this.$map.map.remove(this.$map.map.getLayer("point_asdasd"));
      }
      if (this.$map.map.getLayer("line_asdasd")) {
        this.$map.map.remove(this.$map.map.getLayer("line_asdasd"));
      }
      if (this.$map.map.getLayer("fill" + this.fillId)) {
        this.$map.map.remove(this.$map.map.getLayer("fill" + this.fillId));
      }
      this.stareDraw_type = false;
      this.pointDatas = [];
    },
    draw_Polygon(e) {
      if (!this.stareDraw_type) {
        return;
      }
      if (this.$map.map.getLayer("point_asdasd")) {
        this.$map.map.remove(this.$map.map.getLayer("point_asdasd"));
      }
      if (this.$map.map.getLayer("line_asdasd")) {
        this.$map.map.remove(this.$map.map.getLayer("line_asdasd"));
      }
      if (this.$map.map.getLayer("fill" + this.fillId)) {
        this.$map.map.remove(this.$map.map.getLayer("fill" + this.fillId));
      }

      if (this.pointDatas.length == 2) {
        this.pointDatas.push(this.pointDatas[0]);
        this.pointDatas.splice(
          this.pointDatas.length - 1,
          0,
          turf.toWgs84(e.coordinate)
        );
      } else if (this.pointDatas.length >= 2) {
        this.pointDatas.splice(
          this.pointDatas.length - 1,
          0,
          turf.toWgs84(e.coordinate)
        );
      } else {
        this.pointDatas.push(turf.toWgs84(e.coordinate));
      }
      if (this.pointDatas.length == 1) {
        this.$map.PointLayer({
          data: turf.featureCollection([turf.point(this.pointDatas[0])]),
          id: "point_asdasd",
          size: 1,
          color: "#00ff00",
        });
      } else if (this.pointDatas.length == 2) {
        this.$map.LineLayer({
          data: turf.featureCollection([turf.lineString(this.pointDatas)]),
          id: "line_asdasd",
          color: "#00ff00",
        });
      } else {
        this.$map.FillLayer({
          data: turf.featureCollection([turf.polygon([this.pointDatas])]),
          id: "fill" + this.fillId,
          color: "#00ff00",
          opacity: 0.5,
        });
      }
    },
    union() {
      var data = [];
      for (let i = 0; i < this.polygonLayers.length; i++) {
        const element = this.polygonLayers[i];
        if (this.$map.map.getLayer(element)) {
          var layer = this.$map.map.getLayer(element);
          data.push(layer.data.features[0]);
          this.$map.map.remove(layer);
        }
      }
      this.polygonLayers = [];
      var pol = turf.union(...data);
      this.$map.FillLayer({
        data: turf.featureCollection([pol]),
        id: "fill" + this.fillId,
        color: "#00ff00",
        opacity: 0.5,
      });
      this.polygonLayers.push("fill" + this.fillId);
    },
  },
};
</script>

<style scoped>
#bufferAnalysis {
  width: 250px;
  background-color: #fff;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content_box {
  padding: 10px;
}

.bufferAnalysis_style {
  width: 100%;
  font-size: 14px;
  font-family: Source Han Sans CN;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.bufferAnalysis_style li {
  width: 100%;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bufferAnalysis_input {
  display: flex;
  align-items: center;
  justify-content: space-around !important;
  font-size: 14px;
  font-family: Source Han Sans CN;
}

.bufferAnalysis_switch {
  display: flex;
  align-items: center;
}

.diejia_style {
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 10px;
}
</style>