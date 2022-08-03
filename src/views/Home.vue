<template>
  <div class="home">
    <headers class="z_index" />
    <navs class="z_index" />
    <maps />
    <leftList class="z_index2 left" :class="$store.state.transition ? 'show' : 'hidden'"
      :style="$store.state.teacher ? { left: '330px' } : ''" v-if="$store.state.showorhidden" />
    <rightList class="z_index2 right" v-if="!$store.state.teacher" />
    <layerManagement class="z_index2 layerManagement" v-if="$store.state.layerManagemen_show"
      :style="$store.state.teacher ? { left: '430px' } : ''" />
    <jbDraw class="z_index2 right_dialog" v-if="$store.state.jbDraw_show"
      :style="$store.state.teacher ? { left: '430px' } : ''" />
    <documentation class="z_index2 documentation" style="z-index: 2" v-if="$store.state.documentation_show" />
    <check class="z_index2 check" v-if="this.$store.state.check_show"
      :style="$store.state.teacher ? { left: '430px' } : ''" />
    <setMarshalling class="z_index2 nav_dialog" v-if="$store.state.setMarshalling_show" />

    <chart class="chart" v-show="$store.state.chart_show" />
    <message class="chart" v-if="$store.state.message_show" />
    <determinedToSuggest class="z_index2 center" v-if="$store.state.determinedToSuggest_show" />
    <makeUpYourMind class="z_index2 makeUpYourMind" v-if="$store.state.makeUpYourMind_show" />
    <!-- 测距 -->
    <measureDistance class="z_index2 measureDistance" ref="measureDistance"
      :showMeasureDistance="$store.state.measureDistance_show" :pointArr="distance_pointArr"
      @closeMeasureDistance="closeMeasureDistance" v-if="$store.state.measureDistance_show"></measureDistance>
    <!-- 测面 -->
    <measureArea class="z_index2 measureArea" ref="measureArea" :showMeasureArea="$store.state.measureArea_show"
      :isLinePath="area_linePath" @closeMeasureArea="closeMeasureDistance" v-if="$store.state.measureArea_show">
    </measureArea>
    <slopeDirection class="z_index2 slopeDirection" v-if="$store.state.slopeDirection_show"></slopeDirection>
    <slope class="z_index2 slope" v-if="$store.state.slope_show"></slope>
    <analysis class="z_index2 analysis" v-if="$store.state.analysis_show"></analysis>
    <viewsheld class="z_index2 viewsheld" v-if="$store.state.viewsheld_show"></viewsheld>
    <position class="z_index2 position" @closePosition="closeMeasureDistance" v-if="$store.state.position_show" />
    <navPathBox class="navPathBox" v-if="$store.state.navPath_show" />
    <areaPathBox class="areaPathBox" v-if="$store.state.areaPath_show" />
    <interestAreaPathBox class="areaPathBox" v-if="$store.state.interestAreaPath_show" />
    <operationAreaPathBox class="areaPathBox" v-if="$store.state.operationAreaPath_show" />
    <teamPosition class="teamPosition" v-if="$store.state.teamPosition_show" />
    <interestPosition class="teamPosition" v-if="$store.state.interestPosition_show" />
    <routePathBox class="navPathBox" v-if="$store.state.routePath_show" />
    <background class="z_index2 background" v-if="$store.state.background_show" />
    <operationalAnalysis class="z_index2 operationalAnalysis" v-if="$store.state.operationalAnalysis_show" />
    <editBox class="editBox" v-if="$store.state.edit_show" />
    <bufferAnalysis class="z_index2 bufferAnalysis" v-if="$store.state.bufferAnalysis_show" />
    <Cesium_flood class="z_index2 Cesium_flood" v-if="$store.state.flood_show" />
    <flatAnalysis class="z_index2 measureArea" v-if="$store.state.flatAnalysis_show" />
    <watian class="z_index2 measureArea" v-if="$store.state.watian_show" />
    <poumian class="z_index2 measureArea" v-if="$store.state.poumian_show" />
    <jiaodu class="z_index2 jiaodu" @closeMeasureAngle="closeMeasureDistance" v-if="$store.state.jiaodu_show" />
    <fuzhufenxi class="z_index2 fuzhufenxi" v-if="$store.state.fuzhufenxi_show" />
    <!-- 老师端 stare -->
    <createList class="createList" v-if="$store.state.teacher" />
    <sendingAndReceivingOfDocuments class="z_index2 center" v-if="$store.state.sendingAndReceivingOfDocuments_show" />
    <environmentSettings class="z_index2 environmentSettings" v-if="$store.state.environmentSettings_show" />
    <!-- 老师端 end -->
  </div>
</template>

<script>
// @ is an alias to /src
import headers from "@/components/header"; // 标题栏
import navs from "@/components/nav"; // 导航栏
import maps from "@/components/map"; // 地图
import leftList from "@/components/leftList"; // 左侧工具
import layerManagement from "@/components/layerManagement"; // 图层管理
import jbDraw from "@/components/jbDraw"; // 军标绘制
import documentation from "@/components/documentation"; // 文书拟制
import check from "@/components/check"; // 查看
import rightList from "@/components/rightList"; // 右侧工具
import setMarshalling from "@/components/setMarshalling"; // 编组编成
import chart from "@/components/models/chart/chart"; // 文字聊天
import message from "@/components/models/chart/message"; // 语音聊天
import determinedToSuggest from "@/components/determinedToSuggest"; // 决心建议
import makeUpYourMind from "@/components/makeUpYourMind"; // 定下决心
import measureDistance from "@/components/models/rightList/measureDistance"; // 测距
import measureArea from "@/components/models/rightList/measureArea"; // 测面
import position from "@/components/models/rightList/position"; // 定位
// import soket from "@/components/soket"; // 通讯
import navPathBox from "@/components/mapEditor/navPath"; // 航路线编辑
import areaPathBox from "@/components/mapEditor/areaPath"; // 区域编辑
import interestAreaPathBox from "@/components/mapEditor/interestAreaPath"; // 兴趣区域编辑
import operationAreaPathBox from "@/components/mapEditor/operationAreaPath"; // 操作区域编辑
import interestPosition from "@/components/mapEditor/interestPoint"; // 兴趣点编辑
import teamPosition from "@/components/mapEditor/teamPosition"; // 区域编辑
import background from "@/components/background"; // 作战背景
import slopeDirection from "@/components/models/rightList/slopeDirection"; // 坡向分析
import slope from "@/components/models/rightList/slope"; // 坡度分析
import analysis from "@/components/models/rightList/analysis"; // 通识分析
import viewsheld from "@/components/models/rightList/viewsheld"; // 可见区域分析
import operationalAnalysis from "@/components/operationalAnalysis"; // 可见区域分析
import routePathBox from "@/components/mapEditor/routePath"; // 航路线编辑
import editBox from "@/components/mapEditor/edit"; // 航路线编辑
import bufferAnalysis from "@/components/models/rightList/bufferAnalysis"; // 缓冲区分析
import Cesium_flood from "@/components/models/rightList/Cesium_flood"; // 淹没分析
import flatAnalysis from "@/components/models/rightList/flatAnalysis"; // 净空分析
import watian from "@/components/models/rightList/watian"; // 挖填分析
import poumian from "@/components/models/rightList/poumian"; // 地形剖面
import jiaodu from "@/components/models/rightList/jiaodu"; // 角度量算
import fuzhufenxi from "@/components/models/rightList/fuzhufenxi"; // 辅助分析

// 老师端 stare
import createList from "@/components/createList"; // 建立列表
import sendingAndReceivingOfDocuments from "@/components/sendingAndReceivingOfDocuments"; // 文书收发
import environmentSettings from "@/components/environmentSettings"; // 环境设置
// 老师端 end
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";

import { polygon, line } from "../assets/data/HYXD";

export default {
  name: "Home",
  components: {
    headers,
    navs,
    maps,
    leftList,
    layerManagement,
    jbDraw,
    rightList,
    setMarshalling,
    chart,
    message,
    determinedToSuggest,
    makeUpYourMind,
    documentation,
    check,
    measureDistance,
    measureArea,
    position,
    // soket,
    navPathBox,
    areaPathBox,
    createList,
    sendingAndReceivingOfDocuments,
    environmentSettings,
    background,
    slopeDirection,
    slope,
    analysis,
    viewsheld,
    operationalAnalysis,
    teamPosition,
    interestAreaPathBox,
    operationAreaPathBox,
    interestPosition,
    routePathBox,
    editBox,
    bufferAnalysis,
    Cesium_flood,
    flatAnalysis,
    watian,
    poumian,
    jiaodu,
    fuzhufenxi,
  },
  data() {
    return { distance_pointArr: [], area_linePath: [], background: "" };
  },
  mounted() {
    this.$store.state.vue = this;
    if (this.$store.state.teacher) {
      // this.addEntity("/data/GenericScenario.xml");
      // let path = "./data/直升机分队作战想定.xml";
      // let path = "./data/GenericScenario_old.xml";
      // let path = "./data/test.xml";
      // let path = "./data/GenericScenario.xml";
      // let path = "./data/student_09221032.xml";
      // let path = "./data/ImportScenario.xml";
      let path = "./data/MAXSimScenario.xml";
      // let path = "./data/对地攻击20220622.xml";
      var datamodel = CGFListLoad.initEntity(path);
      // console.log(datamodel);
      this.$store.state.CGFListData = datamodel.vecNodes;
      //1是红方
      // debugger
      this.$store.state.CGFEditListData = [datamodel.GetRootCGFEntity(1)];

      // console.log(datamodel.GetRootCGFEntity(1));
      // console.time("getid");
      // console.log(datamodel.getCGFEntityById(6078));
      // let cgf = datamodel.getCGFEntityById(6078);
      // console.timeEnd("getid");
      // this.$store.state.CGFReadListData = datamodel.GetRootCGFEntitynSide(1);
      // this.$store.state.CGFReadListData = [cgf];

      //CGFListLoad.updateSideLayer(cgf)
      // this.$store.state.CGFReadListData[0].chiledren.push(cgf)
    }
    if (sessionStorage.getItem("courseType") == "0") {
      this.$store.state.background_show = true;
    }
    // setTimeout(()=>{
    //   this.$store.state.makeUpYourMind_show = true
    // },1000)
  },
  methods: {
    closeMeasureDistance(value) {
      this.clear_layer(value);
    },
    clear_layer(value) {
      if (value == "测距") {
        this.distance_pointArr = [];
        this.$refs.measureDistance.num = 0;
      } else if (value == "测面") {
        this.area_linePath = [];
        this.$refs.measureArea.num = 0;
        this.$refs.measureArea.pointData = [];
      } else if (value == "测角") {
      }

      // this.startDrawPoint = false;
      // this.startDrawLine = false;
      // this.startDrawPolygon = false;

      // this.lineData = [];
      // this.polygonData = [];
      this.$map.clearMeasureLayer(); // 可接收不想移除的图层ID (string || array)
    },
  },
};
</script>

<style scoped>
.z_index {
  position: relative;
  z-index: 1;
}

.z_index2 {
  position: absolute;
  z-index: 1;
}

.left {
  top: 250px;
  left: 50px;
  width: 100px;
  transition: left 1s;
}

.show {
  left: 50px;
}

.hidden {
  left: -75px;
}

.right {
  top: 200px;
  right: 10px;
}

.center {
  top: 250px;
  left: 50%;
}

.layerManagement {
  top: 250px;
  left: 140px;
  width: 200px;
}

.right_dialog {
  top: 250px;
  left: 140px;
  width: 200px;
}

.nav_dialog {
  top: 260px;
  left: 240px;
  width: 200px;
}

.chart {
  position: absolute;
  z-index: 1;
  right: 80px;
  bottom: 10px;
}

.check {
  left: 140px;
  top: 520px;
}

.measureDistance {
  right: 50px;
  top: 391px;
}

.measureArea {
  right: 50px;
  top: 428px;
}

.jiaodu {
  right: 50px;
  top: 465px;
}

.slopeDirection {
  right: 50px;
  top: 502px;
}

.position {
  right: 50px;
  top: 446px;
}

.slope {
  right: 50px;
  top: 539px;
}

.analysis {
  right: 50px;
  top: 576px;
}

.viewsheld {
  right: 50px;
  top: 613px;
}

.fuzhufenxi {
  bottom: 10px;
  right: 50px;
}

.bufferAnalysis {
  right: 50px;
  top: 686px;
}

.Cesium_flood {
  right: 50px;
  top: 686px;
}

.navPathBox {
  position: fixed;
  top: 200px;
  left: 1000px;
  z-index: 1;
}

.areaPathBox {
  position: fixed;
  top: 200px;
  right: 100px;
  z-index: 1;
}

.editBox {
  position: fixed;
  top: 200px;
  left: 1000px;
  z-index: 1;
}

.teamPosition {
  position: fixed;
  top: 200px;
  right: 100px;
  z-index: 1;
}

.createList {
  position: fixed;
  left: 0;
  z-index: 1;
}

.background {
  top: 250px;
  left: 35%;
}

.operationalAnalysis {
  top: 200px;
  left: 20%;
}
</style>
<style>
#app .el-scrollbar {
  height: 100%;
}

#app .el-scrollbar__wrap {
  height: calc(100% + 18px);
}

.documentation {
  top: 250px;
  left: 520px;
}

.environmentSettings {
  top: 250px;
  left: 520px;
}

.makeUpYourMind {
  top: 250px;
  left: 650px;
}

.environmentSettings {
  top: 250px;
  left: 650px;
}
</style>