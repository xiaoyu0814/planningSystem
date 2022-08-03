<template>
  <div id="interestPosition" ref="box" @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>兴趣点</span>
      <i class="el-icon-close" @click="$store.state.interestPosition_show = false"></i>
    </header>
    <el-table :data="interestPoint" size="mini" height="200px">
      <el-table-column label="经度" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.x" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.y" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="高度">
        <template slot-scope="scope">
          <el-input v-model="scope.row.z" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="save(scope.$index, scope.row)" type="text" size="mini">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <el-button size="mini" type="primary" plain round @click="addNewPosition">编辑</el-button>
      <el-button size="mini" type="danger" plain round @click="clearPosition">清除</el-button>
    </footer>
  </div>
</template>

<script>
import DrawPoint from "@/utils/SimDataModel/DrawPoint";
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import GeoData from "@/utils/SimDataModel/GeoData";
export default {
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      interestPoint: [],
    };
  },
  mounted() {
    this.interestPoint = this.getInterestPos(this.$store.state.CGF_nodeData);
  },
  computed: {},
  methods: {
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      if (event.target.id == "infoName") {
        return;
      }
      let moveLeft = event.pageX - this.moveDataelse.x + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      this.$refs.box.style.right = "auto";
      if (event.currentTarget.style) {
        event.currentTarget.style.cursor = "move";
      }
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
    // 移动弹窗方法 END
    save(index, pos) {
      // console.log(index, pos);
      this.savaInterestPos(this.$store.state.CGF_nodeData, pos);
    },
    getInterestPos(data) {
      let geoData = data.getGeoData();
      if (geoData) {
        if (geoData.getInterestPointIsHave()) {
          return [geoData.getInterestPoint()];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    savaInterestPos(data, pos) {
      let geoData = data.getGeoData();
      if (geoData) {
        geoData.setInterestPoint(pos);
      } else {
        let _geoData = new GeoData();
        _geoData.setInterestPoint(pos);
        data.setGeoData(_geoData);
      }
    },
    addNewPosition() {
      let _this = this;
      let data = this.$store.state.CGF_nodeData;
      let drawPoint = new DrawPoint(this.$map.map);
      drawPoint.startDraw(data.id, function (point) {
        let pos = {
          x: point[0],
          y: point[1],
          z: 0,
        };
        _this.savaInterestPos(data, pos);
        _this.interestPoint.splice(0, 1, pos);
        CGFListLoad.addInterestPoint(pos);
      });
    },
    clearPosition() {
      let inpoint = {
        x: 0,
        y: 0,
        z: 0,
      };
      this.savaInterestPos(this.$store.state.CGF_nodeData, inpoint);
      this.interestPoint = [];
    },
  },
};
</script>

<style scoped>
#interestPosition {
  box-shadow: 0 0 10px rgb(89, 147, 255);
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  color: #fff;
}
</style>