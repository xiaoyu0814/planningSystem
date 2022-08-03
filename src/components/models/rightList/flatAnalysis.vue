<template>
  <div id="flatAnalysis">
    <header>
      <span>环境分析</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="航路气象分析" name="first">
        <planingAnalysis />
      </el-tab-pane>
      <el-tab-pane label="净空分析" name="second" class="diejia_style">
        <div class="content_box">
          <el-button class="btn_style" type="primary" size="mini" @click="drawModel">
            {{ draw ? "停止" : "开始" }}绘制
          </el-button>
          <div class="content_box">
            <el-button class="btn_style" type="primary" size="mini" @click="getData(0, 'approach', '#c20200')">
              进近面分析
            </el-button>
            <el-button class="btn_style" type="primary" size="mini" @click="getData(1, 'transition1', '#742ea5')">
              左过渡面分析
            </el-button>
            <el-button class="btn_style" type="primary" size="mini" @click="getData(2, 'transition2', '#742ea5')">
              右过渡面分析
            </el-button>
            <el-button class="btn_style" type="primary" size="mini" @click="getData(3, 'climbing', '#c20200')">
              爬升面分析
            </el-button>
            <el-button class="btn_style" type="primary" size="mini" @click="getData(4, 'level', '#fdfc07')">
              内水平面分析
            </el-button>
            <el-button class="btn_style" type="primary" size="mini" @click="getData(5, 'cone', '#00b350')">
              锥形面分析
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import planingAnalysis from "./windShear_planingAnalysis";
export default {
  components: {
    planingAnalysis,
  },
  data() {
    return {
      draw: false,
      pointData: [],
      level_layer: null,
      cone_layer: null,
      drawTool: null,
      activeName: "first",
    };
  },
  mounted() {
    this.$map.changeMapType(2);
  },
  destroyed() {
    this.draw = false;
    drawHelper.clearAll();
  },
  methods: {
    handleClick(tab) {
      if (tab.name == "first") {
        this.$map.changeMapType(2);
      } else {
        this.$map.changeMapType(3);
      
        this.drawTool = new drawHelper.init({
          // 三维绘制工具
          viewer: this.$map.map.map._cesiumViewer,
        });
        console.log(this.drawTool);
      }
    },
    drawModel() {
      // 二维绘制
      this.draw = !this.draw;
      if (!this.draw) {
        // this.$map.map.clear();
        this.pointData = [];
        drawHelper.clearAll();
        if (this.approach_layer) {
          this.$map.map.map._cesiumViewer.entities.remove(this.approach_layer);
          this.approach_layer = null;
        }
        if (this.transition1_layer) {
          this.$map.map.map._cesiumViewer.entities.remove(
            this.transition1_layer
          );
          this.transition1_layer = null;
        }
        if (this.transition2_layer) {
          this.$map.map.map._cesiumViewer.entities.remove(
            this.transition2_layer
          );
          this.transition2_layer = null;
        }
        if (this.climbing_layer) {
          this.$map.map.map._cesiumViewer.entities.remove(this.climbing_layer);
          this.climbing_layer = null;
        }
        if (this.level_layer) {
          this.$map.map.map._cesiumViewer.entities.remove(this.level_layer);
          this.level_layer = null;
        }
        if (this.cone_layer) {
          this.$map.map.map._cesiumViewer.entities.remove(this.cone_layer);
          this.cone_layer = null;
        }
      }

      // 三维绘制
      var options = {
        //默认设置
      };
      var callback = (params) => {
        console.log(params);
        for (let i = 0; i < params.length; i++) {
          let temp = [];
          var c3 = new Cesium.Cartesian3(params[i].x, params[i].y, params[i].z);
          var c = Cesium.Cartographic.fromCartesian(c3);
          temp.push(Cesium.Math.toDegrees(c.longitude));
          temp.push(Cesium.Math.toDegrees(c.latitude));
          this.pointData.push(temp);
        }
      };
      if (this.draw) {
        drawHelper.createPolygon(options, callback);
      }
    },

    getDistance(e) {
      if (!this.draw) return;
      e.coordinate = turf.toWgs84(e.coordinate);
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
    },

    getParams() {
      console.log(this.pointData);
      let params = {
        lon0: 117.33737468719482,
        lat0: 39.14064569640427,
        lon1: 117.33591556549072,
        lat1: 39.140046562236535,
        lon2: 117.35063552856444,
        lat2: 39.11574404693392,
        lon3: 117.35218048095705,
        lat3: 39.11631009128362,
      };
      for (let i = 0; i < 4; i++) {
        if (i == 0) {
          params.lon0 = this.pointData[i][0];
          params.lat0 = this.pointData[i][1];
        } else if (i == 1) {
          params.lon1 = this.pointData[i][0];
          params.lat1 = this.pointData[i][1];
        } else if (i == 2) {
          params.lon2 = this.pointData[i][0];
          params.lat2 = this.pointData[i][1];
        } else if (i == 3) {
          params.lon3 = this.pointData[i][0];
          params.lat3 = this.pointData[i][1];
        }
      }
      return params;
    },

    getFeature(data) {
      data.properties.extrudedHeight = 1000;
      return {
        type: "FeatureCollection",
        features: [data],
      };
    },

    getData(index, id, color) {
      // this.cesiumPolygon()
      // return
      let path = [
        this.$path.airportAnalysis.approachSurfaceCal3D, // 进近面
        this.$path.airportAnalysis.transitionSurfaceCal13D, // 左过渡面
        this.$path.airportAnalysis.transitionSurfaceCal23D, // 右过渡面
        this.$path.airportAnalysis.takeoffClimbingSurfaceCal3D, // 爬升面
        this.$path.airportAnalysis.innerHorizontalSurfaceCal3D, // 内水平面
        this.$path.airportAnalysis.taperedSurfaceCal3D, // 锥形面
      ];
      let params = this.getParams();
      if (index == 5) {
        this.$http.get(path[4], params).then((res2) => {
          this.$http.get(path[5], params).then((res) => {
            // console.log(JSON.stringify(this.getFeature(res)));
            // this.addPolygonLayer(this.getFeature(res), id, color);
            console.log(res);
            if (res.data.code == 0) {
              this.cesiumPolygon(res.data.data, res2.data.data, id, color);
            }
          });
        });
      } else {
        let params = this.getParams();
        this.$http.get(path[index], params).then((res) => {
          // console.log(JSON.stringify(this.getFeature(res)));
          // this.addPolygonLayer(this.getFeature(res), id, color);
          console.log(res);
          if (res.data.code == 0) {
            this.cesiumPolygon(res.data.data, null, id, color);
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },

    airportClearanceAnalysis() {
      // 全部面
      let path = airportClearanceAnalysis_interface;
      let params = this.getParams();
      this.$http.get(path, params).then((res) => {
        this.addPolygonLayer(res, "airportClearanceAnalysis");
      });
    },

    addPolygonLayer(data, id, color) {
      if (this.$map.map.getLayer(this[id + "_layer"])) {
        this.$map.map.remove(this[id + "_layer"]);
      }
      this[id + "_layer"] = new PIE.MetoStyle.FillLayer({
        data,
        id,
        color,
        opacity: 0.5,
        strokeWidth: 2,
        strokeColor: "#ffffff",
      });
      this.$map.map.add(this[id + "_layer"]);
    },

    cesiumPolygon(data, data2, id, color) {
      console.log(Cesium.Cartesian3.fromDegreesArrayHeights(data));
      debugger
      this[id + "_layer"] = this.$map.map.map._cesiumViewer.entities.add({
        name: "airportClearanceAnalysis",
        polygon: {
          hierarchy: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(data),
            // positions: {
            //   cartographicDegrees:data
            // },
            holes: [
              {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                  data2 ? data2 : []
                ),
              },
            ],
          },
          extrudedHeight: 0,
          perPositionHeight: false,
          material: Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(color),
            0.5
          ),
          outline: false,
          outlineColor: Cesium.Color.BLACK,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    },
    onCancel() {
      this.$store.state.flatAnalysis_show = false;
    },
  },
};
</script>

<style scoped>
#flatAnalysis {
  background-color: #fff;
  width: 230px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

#flatAnalysis .btn_style {
  width: 100px;
  margin-left: 0;
  margin: 2px 0;
}
</style>