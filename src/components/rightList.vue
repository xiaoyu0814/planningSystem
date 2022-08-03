<template>
  <div id="rightList">
    <ul>
      <li class="map_utils" v-for="(item, index) in list" :key="index" @mouseenter="s_index = index"
        @mouseleave="s_index = -1" @click="mapList_event(item)" :title="item.name">
        <img :src="s_index === index ? item.s_img : item.img" width="30" />
      </li>
    </ul>
    <ul class="chart_box" v-if="!$store.state.teacher">
      <li v-for="(item, index) in chart" :key="index" @mouseenter="s_index_chart = index"
        @mouseleave="s_index_chart = -1" @click="chart_event(item)">
        <img :src="s_index_chart === index ? item.s_img : item.img" width="30" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      s_index: -1,
      s_index_chart: -1,
      list: [
        {
          name: "二维",
          img: require("../assets/images/rightList/2D.png"),
          s_img: require("../assets/images/rightList/2D.png"),
          d_img: require("../assets/images/rightList/2D.png"),
        },
        {
          name: "三维",
          img: require("../assets/images/rightList/roam.png"),
          s_img: require("../assets/images/rightList/roam.png"),
          d_img: require("../assets/images/rightList/roam.png"),
        },
        {
          name: "放大",
          img: require("../assets/images/rightList/plus.png"),
          s_img: require("../assets/images/rightList/plus_s.png"),
          d_img: require("../assets/images/rightList/plus_d.png"),
        },
        {
          name: "缩小",
          img: require("../assets/images/rightList/reduce.png"),
          s_img: require("../assets/images/rightList/reduce_s.png"),
          d_img: require("../assets/images/rightList/reduce_d.png"),
        },
        {
          name: "锁定",
          img: require("../assets/images/rightList/move.png"),
          s_img: require("../assets/images/rightList/move_s.png"),
          d_img: require("../assets/images/rightList/move_d.png"),
        },
        // {
        //   name: "定位",
        //   img: require("../assets/images/rightList/position.png"),
        //   s_img: require("../assets/images/rightList/position_s.png"),
        //   d_img: require("../assets/images/rightList/position_d.png"),
        // },
        // {
        //   name: "fullScreen",
        //   img: require("../assets/images/rightList/fullScreen.png"),
        //   s_img: require("../assets/images/rightList/fullScreen_s.png"),
        //   d_img: require("../assets/images/rightList/fullScreen_d.png"),
        // },
        {
          name: "距离量算",
          img: require("../assets/images/rightList/ranging.png"),
          s_img: require("../assets/images/rightList/ranging_s.png"),
          d_img: require("../assets/images/rightList/ranging_d.png"),
        },
        {
          name: "面积量算",
          img: require("../assets/images/rightList/measuringSurface.png"),
          s_img: require("../assets/images/rightList/measuringSurface_s.png"),
          d_img: require("../assets/images/rightList/measuringSurface_d.png"),
        },
        {
          name: "角度量算",
          img: require("../assets/images/rightList/angleMeasurement.png"),
          s_img: require("../assets/images/rightList/angleMeasurement_s.png"),
          d_img: require("../assets/images/rightList/angleMeasurement_d.png"),
        },
        // {
        //   name: "作战背景",
        //   img: require("../assets/images/rightList/angleMeasurement.png"),
        //   s_img: require("../assets/images/rightList/angleMeasurement_s.png"),
        //   d_img: require("../assets/images/rightList/angleMeasurement_d.png"),
        // },
        {
          name: "坡向分析",
          img: require("../assets/images/rightList/19.png"),
          s_img: require("../assets/images/rightList/19_s.png"),
          d_img: require("../assets/images/rightList/19_d.png"),
        },
        {
          name: "坡度分析",
          img: require("../assets/images/rightList/18.png"),
          s_img: require("../assets/images/rightList/18_s.png"),
          d_img: require("../assets/images/rightList/18_d.png"),
        },
        {
          name: "通视分析",
          img: require("../assets/images/rightList/17.png"),
          s_img: require("../assets/images/rightList/17_s.png"),
          d_img: require("../assets/images/rightList/17_d.png"),
        },
        {
          name: "可见区域分析",
          img: require("../assets/images/rightList/16.png"),
          s_img: require("../assets/images/rightList/16_s.png"),
          d_img: require("../assets/images/rightList/16_d.png"),
        },
        {
          name: "辅助分析",
          img: require("../assets/images/rightList/辅助分析.png"),
          s_img: require("../assets/images/rightList/辅助分析_s.png"),
          d_img: require("../assets/images/rightList/辅助分析_d.png"),
        },
        {
          name: "拓扑分析",
          img: require("../assets/images/rightList/拓扑分析.png"),
          s_img: require("../assets/images/rightList/拓扑分析_s.png"),
          d_img: require("../assets/images/rightList/拓扑分析_d.png"),
        },
        {
          name: "淹没分析",
          img: require("../assets/images/rightList/淹没分析.png"),
          s_img: require("../assets/images/rightList/淹没分析_s.png"),
          d_img: require("../assets/images/rightList/淹没分析_d.png"),
        },
        {
          name: "环境分析",
          img: require("../assets/images/rightList/环境分析.png"),
          s_img: require("../assets/images/rightList/环境分析_s.png"),
          d_img: require("../assets/images/rightList/环境分析_d.png"),
        },
        {
          name: "挖填分析",
          img: require("../assets/images/rightList/挖填分析.png"),
          s_img: require("../assets/images/rightList/挖填分析_s.png"),
          d_img: require("../assets/images/rightList/挖填分析_d.png"),
        },
        {
          name: "地形剖面",
          img: require("../assets/images/rightList/地型剖面分析.png"),
          s_img: require("../assets/images/rightList/地型剖面分析_s.png"),
          d_img: require("../assets/images/rightList/地型剖面分析_d.png"),
        },
      ],
      chart: [
        // {
        //   name: "message",
        //   img: require("../assets/images/rightList/message.png"),
        //   s_img: require("../assets/images/rightList/message_s.png"),
        // },
        {
          name: "chart",
          img: require("../assets/images/rightList/chart.png"),
          s_img: require("../assets/images/rightList/chart_s.png"),
        },
      ],
      map_moveType: true,
      fullscreen: false,
      SlopeAspectTool1: false,
      analysisTool: false,
      viewsheld: false,
      analysisTool_class: null,
      viewsheld_class: null,
      SlopeAspectTool1_class: null,
    };
  },
  mounted() { },
  methods: {
    mapList_event(item) {
      if (this.viewsheld_class) {
        this.viewsheld_class.setEnable(false);
        this.analysisTool_class.setEnable(false);
        this.SlopeAspectTool1_class.setEnable(false);
      }
      if (item.name === "二维") {
        // 层级增加
        this.$map.changeMapType(2);
        this.$map.setDraw();
        this.viewsheld_class = null;
        this.analysisTool_class = null;
        this.SlopeAspectTool1_class = null;
      } else if (item.name === "三维") {
        // 层级增加
        this.$map.changeMapType(3);
        this.$map.addinTile({
          // url: "http://piecloud.piesat.cn/tilesets/test/",
          url: dem_ip + "/haikou_data/dem/taiwan/",
          requestWaterMask: true,
        });
        var viewer = this.$map.map.map._cesiumViewer;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        this.analysisTool_class = new AnalysisTool({
          viewer: viewer,
        });
        this.viewsheld_class = new ViewsheldTool({
          viewer: viewer,
        });
        this.SlopeAspectTool1_class = new SlopeAspectTool(
          viewer,
          viewer.terrainProvider
        );
        this.$map.setDraw();
      } else if (item.name === "放大") {
        this.$store.state.map_controller.plusZoom();
      } else if (item.name === "缩小") {
        this.$store.state.map_controller.reduceZoom();
      } else if (item.name === "锁定") {
        if (this.map_moveType) {
          this.$map.mapMoveEnable();
        } else {
          this.$map.mapMoveDisable();
        }
        this.map_moveType = !this.map_moveType;
      } else if (item.name === "定位") {
        this.$store.state.position_show = true;
      } else if (item.name === "fullScreen") {
        let element = document.getElementById("map_box"); //设置后就是   id==con_lf_top_div 的容器全屏
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.$store.state.map.map.resize();
        this.fullscreen = !this.fullscreen;
      } else if (item.name === "距离量算") {
        this.$store.state.measureDistance_show = true;
      } else if (item.name === "面积量算") {
        this.$store.state.measureArea_show = true;
      } else if (item.name === "坡向分析") {
        this.$store.state.slopeDirection_show = true;
      } else if (item.name === "坡度分析") {
        this.$store.state.slope_show = true;
      } else if (item.name === "通视分析") {
        this.$store.state.analysis_show = true;
      } else if (item.name === "可见区域分析") {
        this.$store.state.viewsheld_show = true;
      } else if (item.name === "拓扑分析") {
        this.$store.state.bufferAnalysis_show = true;
      } else if (item.name === "淹没分析") {
        this.$store.state.flood_show = true;
      } else if (item.name === "环境分析") {
        this.$store.state.flatAnalysis_show = true;
      } else if (item.name === "挖填分析") {
        this.$store.state.watian_show = true;
      } else if (item.name === "地形剖面") {
        this.$store.state.poumian_show = true;
      } else if (item.name === "角度量算") {
        this.$store.state.jiaodu_show = true;
      } else if (item.name === "辅助分析") {
        this.$store.state.fuzhufenxi_show = true;
      }
    },
    chart_event(item) {
      if (item.name === "message") {
        // 语音
        this.$store.state.message_show = true;
      } else {
        // 文字
        this.$store.state.chart_show = true;
      }
    },
  },
};
</script>

<style scoped>
#rightList {
  position: absolute;
}

.map_utils {
  margin-top: 5px;
  cursor: pointer;
}

.chart_box {
  margin-top: 10px;
  cursor: pointer;
}
</style>