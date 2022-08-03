<template>
  <div id="poumian">
    <header>
      <span>地形剖面</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div class="btn_box">
      <el-button type="primary" size="mini" @click="analyst">绘制</el-button>
      <el-button type="danger" size="mini" @click="clearProfile">清除</el-button>
    </div>
    <div id="sectionChars" class="infoview sectionChars">
      <div id="echartsView1" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileAnalyst: null,
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
    this.profileAnalyst = new ProfileAnalystTool({
      viewer: this.$map.map.map._cesiumViewer,
      sectionChars: $("#sectionChars"),
      echartsView1: document.getElementById("echartsView1"),
      drawingMode: "line",
    });
  },
  destroyed() {
    this.profileAnalyst.setEnable(false);
  },
  methods: {
    analyst() {
      this.profileAnalyst.setEnable(true);
    },
    clearProfile() {
      this.profileAnalyst.setEnable(false);
    },
    onCancel() {
      this.$store.state.poumian_show = false;
    },
  },
};
</script>

<style scoped>
#poumian {
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

.btn_box {
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
}
</style>