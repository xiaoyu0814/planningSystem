<template>
  <div id="threeLine">
    <p class="title">三线计算分析</p>
    <div class="buttom_top">
      <Button @click="boxSelectionRange('敌方')" size="small" class="button_style" type="primary">
        <img class="buttom_small" src="../assets/add.png" />
        <span class="buttom_span">选取敌方位置</span>
      </Button>
      <Button @click="boxSelectionRange('我方')" size="small" class="button_style" type="primary">
        <img class="buttom_small" src="../assets/add.png" />
        <span class="buttom_span">选取我方位置</span>
      </Button>
    </div>
    <Form :model="formRight" label-position="right" :label-width="120">
      <FormItem label="目标经度">
        <Input v-model="formRight.targetLon" size="small"></Input>
      </FormItem>
      <FormItem label="目标纬度">
        <Input v-model="formRight.targetLat" size="small"></Input>
      </FormItem>
      <FormItem label="目标角度">
        <Input v-model="formRight.targetAngle" size="small"></Input>
      </FormItem>
      <FormItem label="机场经度">
        <Input v-model="formRight.airportLon" size="small"></Input>
      </FormItem>
      <FormItem label="机场纬度">
        <Input v-model="formRight.airportLat" size="small"></Input>
      </FormItem>
      <FormItem label="机场安保距离 m">
        <Input v-model="formRight.securityDistance" size="small"></Input>
      </FormItem>
      <FormItem label="我方飞机速度 m/s">
        <Input v-model="formRight.ourPlaneSpeed" size="small"></Input>
      </FormItem>
      <FormItem label="敌方飞机速度 m/s">
        <Input v-model="formRight.enemyPlaneSpeed" size="small"></Input>
      </FormItem>
      <FormItem label="下令一等线时间 s">
        <Input v-model="formRight.timeFirstLine" size="small"></Input>
      </FormItem>
      <FormItem label="下令起飞线时间 s">
        <Input v-model="formRight.timeTakeOffLine" size="small"></Input>
      </FormItem>
    </Form>
    <div class="buttom_bottom">
      <Button type="primary" class="analysis" style="width: 150px" @click="startAnalysis">
        <img class="buttom_style" src="../assets/fenxi.png" />
        开始分析
      </Button>
    </div>
  </div>
</template>

<script>
import elements_legendVue from "../components/elements_legend.vue";
export default {
  data() {
    return {
      formRight: {
        targetLon: "111",
        targetLat: "31",
        targetAngle: "30",
        airportLon: "112",
        airportLat: "32",
        securityDistance: "5000",
        ourPlaneSpeed: "83",
        enemyPlaneSpeed: "100",
        timeFirstLine: "1",
        timeTakeOffLine: "1",
      },
      gitPoint_type: true,
      enemy_type: false,
      we_type: false,
      item: "",
    };
  },
  mounted() {
    this.$map.changeMapType(2);
  },
  destroyed() {
    this.$map.map.clear();
  },
  methods: {
    boxSelectionRange(item) {
      this.item = item;
      this.gitPoint_type = false;
      this.$map.map.on("click", (e) => {
        if (this.gitPoint_type) {
          return;
        }
        var point = turf.toWgs84(e.coordinate);
        console.log(point)
        if (this.item == "敌方") {
          this.formRight.targetLon = point[0];
          this.formRight.targetLat = point[1];
        } else {
          this.formRight.airportLon = point[0];
          this.formRight.airportLat = point[1];
        }
        this.formRight.targetAngle = turf.bearingToAzimuth(
          turf.bearing(
            [this.formRight.airportLon, this.formRight.airportLat],
            [this.formRight.targetLon, this.formRight.targetLat]
          )
        );
      });
    },
    startAnalysis() {
      this.$map.map.clear();
      // let path = "http://172.16.40.232:8999/api/env/geo/ThreeLinesAnalysis/ThreeLinesAnalysis";
      let path =
        "http://10.1.30.50:8999/api/env/geo/ThreeLinesAnalysis/ThreeLinesAnalysis";

      this.$api.GET(path, this.formRight).then((res) => {
        if (res.result) {
          var coor;
          for (let i = 0; i < res.value.length; i++) {
            this.gitPoint_type = true;
            let points = res.value[i];
            let lonlat = turf.toMercator([points[0], points[1]]);
            var sPs = this.createRegularPolygonCurve(
              lonlat,
              points[2],
              100,
              points[3],
              points[4]
            );
            var data = [];
            for (let i = 0; i < sPs.A.length; i += 2) {
              let point = turf.toWgs84([sPs.A[i], sPs.A[i + 1]]);
              data.push(point);
            }
            data.push(data[0]);
            var color;
            var text;
            if (i == 0) {
              color = "#00ff00";
              text = "下令一等线";
            } else if (i == 1) {
              color = "#ff8900";
              text = "下令起飞线";
            } else {
              color = "#ff0000";
              text = "截击线";
            }
            this.$map.LineLayer({
              data: turf.featureCollection([turf.lineString(data)]),
              color,
              id: "LineLayer" + i,
            });
            this.$map.textLayer({
              data: turf.featureCollection([
                turf.point(data[parseInt(data.length / 2)], {
                  text: text,
                  color: color,
                }),
              ]),
              color,
              id: "textLayer" + i,
              text: "text",
            });
            // return;
            // coor = [
            //   [points[0], points[1]],
            //   [points[2], points[3]],
            //   [points[4], points[5]],
            // ];
            // let y = coor[1][1] - coor[0][1];
            // let y1 = coor[2][1] - coor[0][1];
            // let x = coor[1][0] - coor[0][0];
            // let x1 = coor[2][0] - coor[0][0];
            // let r = Math.sqrt(x * x + y * y);
            // let s_angle = turf.bearingToAzimuth(turf.bearing(coor[0], coor[1]));
            // let e_angle = turf.bearingToAzimuth(turf.bearing(coor[0], coor[2]));
            // // if (s_angle < 0) {
            // //   s_angle = 360 + s_angle;
            // //   e_angle = 360 + e_angle;
            // // }
            // // let sP = this.getPoints(r, s_angle, e_angle, 100, coor[0]);
            // let sP = this.createRegularPolygonCurve(
            //   [this.formRight.airportLon, this.formRight.airportLat],
            //   1000000,
            //   100,
            //   30,
            //   90
            // );
            // console.log(sP);
            // console.log(s_angle, e_angle);
            // // sP.push(coor[2])
            // sP.push(coor[0]);
            // sP.unshift(coor[0]);
            // let feature = turf.featureCollection([turf.lineString(sP)]);
            // var color;
            // var text;
            // if (i == 0) {
            //   color = "#00ff00";
            //   text = "下令一等线";
            // } else if (i == 1) {
            //   color = "#ff8900";
            //   text = "下令起飞线";
            // } else {
            //   color = "#ff0000";
            //   text = "截击线";
            // }
            // this.$map.LineLayer({
            //   data: feature,
            //   color,
            //   id: "LineLayer" + i,
            // });
            // console.log(
            //   turf.featureCollection([
            //     turf.point(sP[parseInt(sP.length / 2)], {
            //       text: text,
            //       color: color,
            //     }),
            //   ])
            // );
          }
          // this.$map.map.setCenter(coor[0]);
          // this.$map.map.setZoom(13);
        }
      });
    },
    // getPoints(r, s, e, num, offest) {
    //   let points = [];
    //   for (let i = 0; i < num; i++) {
    //     let angle = s + (i * (e - s)) / (num - 1);
    //     let lng = offest[0] + r * Math.sin((angle * Math.PI) / 180);
    //     let lat = offest[1] + r * Math.cos((angle * Math.PI) / 180);
    //     let point = [lng, lat];
    //     points.push(point);
    //   }

    //   return points;
    // },
    createRegularPolygonCurve(origin, radius, sides, r, angel) {
      var rotation = 360 - r;
      var angle = Math.PI * (1 / sides - 1 / 2);
      if (rotation) {
        angle += (rotation / 180) * Math.PI;
      }
      var rotatedAngle, x, y;
      var points = [];
      for (var i = 0; i < sides; ++i) {
        var an = i * ((360 - rotation) / 360);
        rotatedAngle = angle + (an * 2 * Math.PI) / sides;
        x = origin[0] + radius * Math.cos(rotatedAngle);
        y = origin[1] + radius * Math.sin(rotatedAngle);
        points.push([x, y]);
      }
      if (rotation != 0) {
        points.push(origin);
      }
      var ring = new PIE.ol.geom.LinearRing(points);
      ring.rotate(Math.PI - ((angel - r / 2) / 180) * Math.PI, origin);
      var poy = new PIE.ol.geom.Polygon([points]);
      var a = ring.A;
      poy.A = a;

      return poy;
    },
  },
};
</script>

<style scoped>
#threeLine {
  position: fixed;
  top: 150px;
  right: 10px;
  padding: 20px 15px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #b1d9ff;
  background: rgba(0, 31, 73, 0.7);
  box-shadow: inset 0px 0px 10px 0px #55a5ff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* height: 124px; */
  /* width: 200px; */
}

.title {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}

.buttom_bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}

.analysis {
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
}

.button_style {
  border: none;
}

.buttom_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}

.buttom_small {
  padding-right: 10px;
}

.buttom_rightSpan {
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: #092b59 !important;
}

.buttom_span {
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  /* color: #bedfff; */
}
</style>

<style>
#threeLine .ivu-form .ivu-form-item-label {
  color: #fff;
}

#threeLine .ivu-btn:hover {
  border: none !important;
  font-size: 12px !important;
}
</style>