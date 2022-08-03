<template>
  <div id="slope">
    <header>
      <span>坡度分析</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div style="border: 1px solid #ccc" id="inputBox">
      <div style="margin: 10px">
        <el-button type="primary" size="mini" @click="draw">绘制</el-button>
        <el-button type="danger" size="mini" @click="remove">移除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      altimetry: null,
    };
  },
  mounted() {
    this.$map.changeMapType(3);
    this.$map.addinTile({
      // url: "http://piecloud.piesat.cn/tilesets/test/",
      url: dem_ip + "/haikou_data/dem/taiwan/",
      requestWaterMask: true,
    });
    this.init();
  },
  destroyed() {
    this.remove();
  },
  methods: {
    init() {
      this.altimetry = this.$map.altimetry();
    },
    onCancel() {
      this.$store.state.slope_show = false;
    },
    draw() {
      this.altimetry.measureHeight();
    },
    remove() {
      this.altimetry.clearAll();
    },
  },
};
</script>

<style scoped>
#slope {
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