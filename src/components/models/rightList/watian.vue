<template>
  <div id="watian">
    <header>
      <span>挖填分析</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div class="btn_box">
      <el-button type="primary" size="mini" @click="analyst">绘制</el-button>
      <el-button type="danger" size="mini" @click="clearProfile">
        清除
      </el-button>
    </div>
    <div id="info">
      <div class="input_box">
        <label class="title">最大高程</label>
        <input class="input_style" v-model="info.maxDom" type="text" id="max" disabled />
        <label>m</label>
      </div>
      <div class="input_box">
        <label class="title">最小高程</label>
        <input class="input_style" v-model="info.minDom" type="text" id="min" disabled />
        <label>m</label>
      </div>
      <div class="input_box">
        <label class="title">填方量</label>
        <input class="input_style" v-model="info.fillDom" type="text" id="fill" disabled />
        <label>km³</label>
      </div>
      <div class="input_box">
        <label class="title">挖方量</label>
        <input class="input_style" v-model="info.cutDom" type="text" id="cut" disabled />
        <label>km³</label>
      </div>
      <div class="input_box">
        <label class="title">总体积</label>
        <input class="input_style" v-model="info.totalDom" type="text" id="total" disabled />
        <label>km³</label>
      </div>
      <div class="input_box">
        <label class="title">总面积</label>
        <input class="input_style" v-model="info.areaDom" type="text" id="area" disabled />
        <label>k㎡</label>
      </div>
      <div class="input_box">
        <label class="title">基准面高程</label>
        <input class="input_style" v-model="info.baseDom" type="number" id="base" @change="onchange" />
        <label>m</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backfillAnalysis: null,
      info: {
        maxDom: "",
        minDom: "",
        fillDom: "",
        cutDom: "",
        totalDom: "",
        areaDom: "",
        baseDom: "",
      },
      num: 0,
    };
  },
  mounted() {
    this.$map.changeMapType(3);
    this.$map.addinTile({
      // url: "http://piecloud.piesat.cn/tilesets/test/",
      url: dem_ip + "/haikou_data/dem/taiwan/",
      requestWaterMask: true,
    });
    var viewer = this.$map.map.map._cesiumViewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    this.backfillAnalysis = new BackfillAnalysisTool(
      this.$map.map.map._cesiumViewer
    );
  },
  destroyed() {
    this.backfillAnalysis.setEnable(false);
  },
  methods: {
    onCancel() {
      this.$store.state.watian_show = false;
    },
    analyst() {
      // console.log("起始",Number(new Date()));
      this.backfillAnalysis.setEnable(true, this.callBack);
    },
    clearProfile() {
      this.backfillAnalysis.setEnable(false);
    },
    formatNumber(number, index) {
      let startNumber = Math.pow(10, index);
      let rootNumber = startNumber * startNumber;
      let result = Number(number / rootNumber).toFixed(4);
      return result;
    },
    callBack() {
      this.info.maxDom = this.formatNumber(
        this.backfillAnalysis.heightExtent.maxHeight,
        0
      ); //最大高程
      this.info.minDom = this.formatNumber(
        this.backfillAnalysis.heightExtent.minHeight,
        0
      ); //最小高程
      this.info.fillDom = this.formatNumber(
        this.backfillAnalysis.fillVolume,
        3
      ); //填方量
      this.info.cutDom = this.formatNumber(this.backfillAnalysis.cutVolume, 3); //挖方量
      this.info.totalDom = this.formatNumber(
        this.backfillAnalysis.allVolume,
        3
      ); //总体积
      this.info.areaDom = this.formatNumber(this.backfillAnalysis.area, 2); //总面积
      this.info.baseDom = this.formatNumber(
        this.backfillAnalysis.averageHeight,
        0
      ); //基准面高程

      // console.log("结束",Number(new Date()));
    },
    onchange() {
      var baseHe = info.baseDom;
      backfillAnalysis.fillShape.polygon.extrudedHeight =
        new Cesium.CallbackProperty(function (e) {
          return Number(baseHe);
        }, false);
      this.info.fillDom = Number(baseHe) * backfillAnalysis.area;
      this.info.cutDom = backfillAnalysis.allVolume - this.info.fillDom;
    },
  },
};
</script>

<style scoped>
#watian {
  background-color: #fff;
  width: 210px;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn_box {
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
}

.input_box {
  display: flex;
  padding: 5px;
}

.title {
  width: 80px;
}

.input_style {
  width: 90px;
}
</style>