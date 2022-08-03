<template>
  <div id="edit" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>设置</span>
      <i class="el-icon-close" @click="$store.state.edit_show = false"></i>
    </header>
    <div class="content">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="常规" name="routine" style="height: 400px">
          <el-scrollbar>
            <routine />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="武器" name="arms">
          <arms />
        </el-tab-pane>
        <el-tab-pane label="诱饵" name="bait">
          <bait />
        </el-tab-pane>
        <el-tab-pane label="传感器计划" name="sensorPlan">
          <sensorPlan />
        </el-tab-pane>
        <el-tab-pane label="导航计划" name="navPlan" v-if="$store.state.teacher">
          <navPath />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import routine from "@/components/mapEditor/edit/routine";
import arms from "@/components/mapEditor/edit/arms";
import bait from "@/components/mapEditor/edit/bait";
import sensorPlan from "@/components/mapEditor/edit/sensorPlan";
import navPath from "@/components/mapEditor/navPath copy";
import { mapGetters } from "vuex";
export default {
  components: {
    routine,
    arms,
    bait,
    sensorPlan,
    navPath,
  },
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      activeName: "routine",
      disabled: true,
    };
  },
  computed: {
    ...mapGetters(["getCGFSelectData"]),
  },
  mounted() {
    if (!this.$store.state.teacher) {
      if (this.getCGFSelectData.side == 2) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  },
  methods: {
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      if (
        event.target.id == "infoName" ||
        event.target.id == "infoLng" ||
        event.target.id == "infoLat" ||
        event.target.id == "infoHeight" ||
        event.target.id == "infoDirection" ||
        event.target.id == "infoSpeed" ||
        event.target.id == "infoInterestPoint"
      ) {
        return;
      }
      let moveLeft = event.pageX - this.moveDataelse.x + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      if (event.currentTarget.style) {
        event.currentTarget.style.cursor = "move";
      }
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
    // 移动弹窗方法 END
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>

<style scoped>
#edit {
  box-shadow: 0 0 10px rgb(89, 147, 255);
  background-color: #fff;
  width: 700px;
  height: 500px;
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  color: #fff;
}

.content {
  padding: 10px;
  padding-top: 0;
}
</style>