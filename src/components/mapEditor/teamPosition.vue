<template>
  <div id="teamPosition">
    <header>
      <span>小队位置</span>
      <i class="el-icon-close" @click="$store.state.teamPosition_show = false"></i>
    </header>
    <el-table :data="getTeamPositionList" size="mini" height="200px">
      <el-table-column label="经度" prop="x" width="100px" align="center"></el-table-column>
      <el-table-column label="纬度" prop="y" width="100px" align="center"></el-table-column>
      <el-table-column label="时间" width="100px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.z" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="remove(scope.$index)" type="text" size="mini" style="color: #f00">删除</el-button>
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

export default {
  data() {
    return {};
  },
  mounted() { },
  destroyed() {
    this.reset();
  },
  computed: {
    getTeamPositionList() {
      return this.$store.state.teamPosition[this.$store.state.teamPositionId];
    },
  },
  methods: {
    remove(index) {
      this.$store.state.teamPosition[this.$store.state.teamPositionId].splice(
        index,
        1
      );
    },
    addNewPosition() {
      let self = this;
      let data = this.$store.state.teamPosition_data;
      let oldPos = this.getOldPos(data);
      // self.$store.state.teamPosition_show = true;
      self.$store.state.teamPositionId = data.id;
      let drawPoint = new DrawPoint(this.$map.map);
      drawPoint.startDraw(data.id, function (point) {
        let pos = {
          x: point[0],
          y: point[1],
          z: 0,
        };
        let _pos = {
          x: point[0].toFixed(6),
          y: point[1].toFixed(6),
          z: 0,
        };
        if (self.$store.state.teamPosition[self.$store.state.teamPositionId]) {
          self.$store.state.teamPosition[self.$store.state.teamPositionId].push(
            _pos
          );
        } else {
          self.$set(self.$store.state.teamPosition, data.id, [_pos]);
          self.$set(self.$store.state.teamPosition, data.id + "oldPos", oldPos);
        }

        CGFListLoad.setGroupPosition(data, pos);
        CGFListLoad.setMoveFalse();
      });
    },
    clearPosition() {
      let data = this.$store.state.teamPosition_data;
      this.$set(this.$store.state.teamPosition, data.id, []);
      this.reset();
    },
    getOldPos(data) {
      let new_data;
      if (data.children.length > 1) {
        return this.getOldPos(data.children[0]);
      } else {
        new_data = data.position;
      }
      return new_data;
    },
    reset() {
      let data = this.$store.state.teamPosition_data;
      let oldPos = this.$store.state.teamPosition[data.id + "oldPos"];
      CGFListLoad.setGroupPosition(data, oldPos);
      CGFListLoad.setMoveFalse();
    },
  },
};
</script>

<style scoped>
#teamPosition {
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