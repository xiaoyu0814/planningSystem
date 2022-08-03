<template>
  <div id="viewsheld">
    <header>
      <span>可见区域分析</span>
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
      viewsheld: null,
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.remove();
  },
  methods: {
    init() {
      var viewer = this.$map.map.map._cesiumViewer;
      this.viewsheld = new ViewsheldTool({ viewer });
    },
    onCancel() {
      this.$store.state.viewsheld_show = false;
    },
    draw() {
      this.viewsheld.setEnable(true);
    },
    remove() {
      this.viewsheld.setEnable(false);
    },
  },
};
</script>

<style scoped>
#viewsheld {
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