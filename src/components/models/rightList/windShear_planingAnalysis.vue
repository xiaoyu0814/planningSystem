<template>
  <div class="menu_body_">
    <el-button type="primary" size="mini" @click="DrawLine">
      {{ draw ? "停止" : "开始" }}绘制
    </el-button>
    <el-button type="primary" size="mini" @click="search"> 分析 </el-button>
    <!-- <el-button type="primary" size="mini" @click="union"> 结合 </el-button> -->
    <ul class="menu_top" v-if="false">
      <li>
        <RadioGroup v-model="animal" class="radio_" @on-change="getRadio">
          <Radio label="绘制两点"></Radio>
          <Radio label="自定义两点"></Radio>
        </RadioGroup>
      </li>
      <li>
        <div class="position">
          <!-- <img src="../assets/dingweiImg.png" /> -->
          <span>1号点定位</span>
        </div>
      </li>
      <li>
        <span>X坐标轴</span
        ><Input v-model="lon_Num1" style="width: 120px" size="small" />
      </li>

      <li>
        <span>Y坐标轴</span
        ><Input v-model="lat_Num1" style="width: 120px" size="small" />
      </li>
      <li v-if="false">
        <span>Z坐标轴</span
        ><Input v-model="value2" style="width: 120px" size="small" />
      </li>
      <li>
        <div class="position">
          <!-- <img src="../assets/dingweiImg.png" /> -->
          <span>2号点定位</span>
        </div>
      </li>
      <li>
        <span>X坐标轴</span
        ><Input v-model="lon_Num2" style="width: 120px" size="small" />
      </li>

      <li>
        <span>Y坐标轴</span
        ><Input v-model="lat_Num2" style="width: 120px" size="small" />
      </li>
      <li v-if="false">
        <span>Z坐标轴</span
        ><Input v-model="value2" style="width: 120px" size="small" />
      </li>
      <Button type="primary" size="small" class="btn_mune" @click="search"
        >查询</Button
      >
    </ul>
    <!--画板-->
    <div class="planingDrawing" v-if="planingDrawing_show">
      <div class="header">
        <!-- <img
          class="header_img"
          src="../assets/guanbi.png"
          @click="closeChart"
        /> -->
        风切变剖面分析图
        <i class="el-icon-close" @click="planingDrawing_show = false"></i>
      </div>
      <div class="canvasBody">
        <div id="canvasBody"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value2: "",
      animal: "",
      planingDrawing_show: false,
      lon_Num1: "",
      lat_Num1: "",
      lon_Num2: "",
      lat_Num2: " ",
      spinShow: false,
      yPixel: [],
      xPixel: [],
      windCor: [],
      coordinates: "",
      WindSpeed: "",
      WindDirection: "",
      seriesData: [],
      ypixel: [],
      xpixel: [],
      moveDataelse: {
        x: null,
        y: null,
      },
      a: -0.1,
      draw: false,
    };
  },
  methods: {
    closeChart() {
      this.clare();
    },
    clare() {
      this.draw = false;
      this.planingDrawing_show = false;
      this.$map.DrawLine.endDraw();
      this.lon_Num1 = "";
      this.lon_Num2 = "";
      this.lat_Num1 = "";
      this.lat_Num2 = "";
    },
    getRadio() {
      // 开始画线
      if (this.animal == "绘制两点") {
        this.$map.DrawLine.startDrawLine(this.getData);
        this.animal = "";
      } else {
        this.$map.DrawLine.endDraw();
        this.animal = "绘制两点";
      }
    },
    DrawLine() {
      if (this.draw) {
        this.$map.DrawLine.endDraw();
        this.draw = false;
      } else {
        this.$map.DrawLine.startDrawLine(this.getData);
        this.draw = true;
      }
    },
    getData(data) {
      this.lon_Num1 = data[0][0];
      this.lon_Num2 = data[1][0];
      this.lat_Num1 = data[0][1];
      this.lat_Num2 = data[1][1];
      console.log("1号点经度", data[0][0]);
      console.log("1号点纬度", data[0][1]);
      console.log("2号点经度", data[1][0]);
      console.log("2号点纬度", data[1][1]);
    },
    search() {
      this.seriesData = [];
      this.ypixel = [];
      // this.spinShow = true;
      //显示底部窗口
      this.planingDrawing_show = true;
      let path = this.$path.synAnalysis.getWindyChangeFaceData;
      let params = {
        // coordinate: data[0].toString() + "," + data[1].toString(),
        coordinate:
          this.lon_Num1.toString() +
          "," +
          this.lat_Num1.toString() +
          "," +
          this.lon_Num2.toString() +
          "," +
          this.lat_Num2.toString(),
        forecastDate: "2021-08-19",
        forecastTimeHour: 12,
        forecastHour: 24,
        // modelType: "ECMWF_HR_C1D",
      };
      this.$http.get(path, params).then((res) => {
        // this.spinShow = false;
        console.log("风向杆", res);

        if (res.data.code == 0) {
          this.yPixel = res.data.data.yPixel;
          // .map((obj) => {
          //   this.ypixel.push(obj.value);
          // });
          this.xPixel = res.data.data.xPixel;
          // .map((obj) => {
          //   // this.xpixel.push(Number(obj.unit.split(",")[0]));
          //   this.xpixel.push(obj.value);
          // });
          console.log("返回新的", this.ypixel);
          console.log("返回新的x", this.xpixel);
          let wind = JSON.parse(res.data.data.wind);
          console.log("风", wind);
          for (let i = 0; i < wind.features.length; i++) {
            this.getWindImg(
              wind.features[i].properties.WindSpeed,
              wind.features[i].properties.WindDirection,
              wind.features[i].geometry.coordinates
            );
          }
        }
        // 绘制风切变风向杆
        // this.$map.drawCanvas(document.getElementById("canvasBody"), res.value);
      });
    },
    getWindImg(WindSpeed, WindDirection, coordinates) {
      var wea = this.$map.weatherData["WIND" + WindSpeed];
      var imgUrl;
      if (wea) {
        var c = document.createElement("canvas");
        // var c = document.getElementById("qqwwee");
        c.width = wea.width;
        c.height = wea.height;
        var context = c.getContext("2d");
        context.globalAlpha = 1;
        var iconimage = new Image();
        iconimage.src = "js/sprite1/Weather@2x.png";
        iconimage.onload = () => {
          context.translate(16, 16);
          context.rotate((WindDirection * Math.PI) / 180);
          context.translate(-16, -16);
          context.drawImage(
            iconimage,
            wea.x,
            wea.y,
            wea.width,
            wea.height,
            0,
            0,
            wea.width,
            wea.height
          );
          // ctx.drawImage(c, w, h - 32);
          // ctx.globalAlpha = 1;
          imgUrl = c.toDataURL("image/png");
          // coordinates[1] *= 10;
          // coordinates[0] *= 9;
          let temp = {
            value: coordinates,
            symbol: "image://" + imgUrl,
            symbolSize: 20,
          };
          this.seriesData.push(temp);

          this.initChart();
        };
      }
      return imgUrl;
    },

    initChart() {
      let that = this;
      let option = (option = {
        // backgroundColor: "#12cf96",
        // backgroundColor: '#12cf9696',
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return params[0].name + ": " + params[0].value;
          },
        },
        xAxis: {
          data: this.xPixel,
          type: "value",
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              type: "solid",
              // color: "#FFFFFF",
            },
          },
          splitLine: {
            show: false, //是否显示网格（分裂线）
          },
          axisLabel: {
            // color: "#e54035",
            formatter: (value) => {
              var text = [];
              console.log(value);
              if (value < 0.1) {
                text.push(this.xPixel[0].value);
              } else if (value >= 0.1 && value < 0.2) {
                text.push(this.xPixel[1].value);
              } else if (value >= 0.2 && value < 0.3) {
                text.push(this.xPixel[2].value);
              } else if (value >= 0.3 && value < 0.4) {
                text.push(this.xPixel[3].value);
              } else if (value >= 0.4 && value < 0.5) {
                text.push(this.xPixel[4].value);
              } else if (value >= 0.5 && value < 0.6) {
                text.push(this.xPixel[5].value);
              } else if (value >= 0.6 && value < 0.7) {
                text.push(this.xPixel[6].value);
              } else if (value >= 0.7 && value < 0.8) {
                text.push(this.xPixel[7].value);
              } else if (value >= 0.8 && value < 0.9) {
                text.push(this.xPixel[8].value);
              } else if (value >= 0.9) {
                text.push(this.xPixel[9].value);
              }
              return text;
            },
            show: true,
            textStyle: {
              fontSize: "12px",
              fontFamily: "Source Han Sans CN",
              fontWeight: 400,
              // color: "FFFFFF", //坐标值得具体的颜色
            },
          },
        },
        yAxis: {
          data: this.yPixel,
          type: "value",
          splitLine: {
            show: false, //是否显示网格（分裂线）
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: {
            // show: false,
            lineStyle: {
              type: "solid",
              // color: "#FFFFFF",
            },
          },
          axisLabel: {
            // formatter: "{value} (pha)",
            formatter: (value) => {
              var text = [];
              if (value < 0.1) {
                text.push("1000(pha)");
              } else if (value >= 0.1 && value < 0.2) {
                text.push("900(pha)");
              } else if (value >= 0.2 && value < 0.3) {
                text.push("800(pha)");
              } else if (value >= 0.3 && value < 0.4) {
                text.push("700(pha)");
              } else if (value >= 0.4 && value < 0.5) {
                text.push("600(pha)");
              } else if (value >= 0.5 && value < 0.6) {
                text.push("500(pha)");
              } else if (value >= 0.6 && value < 0.7) {
                text.push("400(pha)");
              } else if (value >= 0.7 && value < 0.8) {
                text.push("300(pha)");
              } else if (value >= 0.8 && value < 0.9) {
                text.push("200(pha)");
              } else if (value >= 0.9) {
                text.push("100(pha)");
              }
              console.log(text);
              return text;
            },
            // color: "#e54035",
            textStyle: {
              fontSize: "12px",
              fontFamily: "Source Han Sans CN",
              fontWeight: 400,
              // color: "#FFFFFF", //坐标值得具体的颜色
            },
            interval: 1,
          },
        },
        color: ["#e54035"],
        series: [
          {
            name: "glyph",
            type: "scatter",
            // barGap: "40%",
            symbolPosition: "end",
            // symbolSize: 100,
            symbolOffset: [20, 0],
            data: this.seriesData,
          },
        ],
      });
      // debugger
      this.chart = echarts.init(document.getElementById("canvasBody"));
      this.chart.setOption(option);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    //移动窗口
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      let moveLeft = event.pageX - this.moveDataelse.x + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      event.currentTarget.style.cursor = "move";
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
  },
  destroyed() {
    this.$map.DrawLine.endDraw();
    this.draw = false;
  },
};
</script>
<style scoped>
.menu_body_ {
  width: 230px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #b1d9ff;
  /* background: rgba(0, 31, 73, 0.7); */
  /* box-shadow: inset 0px 0px 10px 0px #55a5ff; */
  padding: 15px 15px;
}

.menu_body_ ul li {
  padding: 5px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu_top {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.radio_ {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.check_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.position {
  display: flex;
  justify-content: space-around;
  align-content: center;
  width: 100px;
  background: #0075b8;
  border-radius: 10px;
  padding: 5px 15px 5px 5px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
}

.btn_mune {
  width: 80%;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  margin-top: 10px;
}

.planingDrawing {
  width: 1200px;
  height: 600px;
  /* background-image: url("../assets/剖面图展示.png"); */
  background-size: 100% 100%;
  position: fixed;
  bottom: 50px;
  left: 50%;
  margin-left: -480px;
  background-color: #ffffff;
  z-index: 2;
}

.planingDrawing .header {
  height: 45px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  color: #fff;
  box-sizing: border-box;
}

.header_img {
  padding-right: 15px;
}

.planingDrawing .canvasBody {
  position: relative;
  height: calc(100% - 60px);
  width: 100%;
  /* padding-top: 10px; */
  box-sizing: border-box;
}

#canvasBody {
  height: 100%;
  width: 100%;
}
</style>
<style>
.ivu-collapse {
  width: 100%;
}

.ivu-collapse-header {
  padding-left: 0 !important;
}

.ivu-collapse-simple {
  border-left: none !important;
  background-color: #a8c1f4a4 !important;
  /* opacity: 0.5 !important; */
  border-radius: 4px !important;
}

.ivu-collapse-content {
  background: #00000000 !important;
  padding: 0 !important;
}
</style>