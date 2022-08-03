<template>
  <div>
    <div class="menu_node" style="display: grid" v-show="data.nodeType == '指挥' || data.nodeType == 1">
      <el-row v-if="$store.state.progress < 8">
        <span @click="addGroup" class="menu_node_select">添加建制单位</span>
      </el-row>
      <el-row v-if="$store.state.progress < 8">
        <span @click="addEntityNode" class="menu_node_select">添加兵力</span>
      </el-row>
      <el-row v-show="data.nodeType == '指挥'">
        <span @click="addFormationNode" class="menu_node_select">
          设置队形
        </span>
      </el-row>
      <el-row v-show="data.nodeType == '指挥'">
        <span @click="remove" class="menu_node_select"> 删除节点 </span>
      </el-row>
      <el-row v-show="data.nodeType == '指挥'">
        <span @click="rename" class="menu_node_select"> 重命名节点 </span>
      </el-row>
      <el-row v-show="data.nodeType == '指挥'">
        <span @click="addDoctrine" class="menu_node_select"> 设置行动 </span>
      </el-row>
      <el-row v-show="data.nodeType == '指挥'">
        <span @click="setGroupPosition" class="menu_node_select">
          设置组位置
        </span>
      </el-row>
      <el-row v-show="data.nodeType == '指挥'">
        <span @click="openEditBox" class="menu_node_select"> 编辑 </span>
      </el-row>

      <!-- <span
        v-show="data.nodeType == '指挥'"
        @click="addAreaPath"
        class="menu_node_select"
      >
        设置区域
      </span> -->
      <!-- <span
        v-show="data.nodeType == '指挥'"
        @click="addDoctrine"
        class="menu_node_select"
        >设置行为</span
      > -->
    </div>
    <div class="menu_node" v-show="data.nodeType == '兵力'" style="display: grid">
      <el-row>
        <span @click="remove" class="menu_node_select">删除节点</span>
      </el-row>
      <el-row>
        <span @click="rename" class="menu_node_select">重命名节点</span>
      </el-row>

      <!-- <span @click="addAOI" class="menu_node_select">设置兴趣点</span> -->
      <!-- <span @click="addNavPath" class="menu_node_select">添加导航路线</span> -->
      <!-- <span @click="addAreaPath" class="menu_node_select">设置区域</span> -->
      <!-- <span @click="addInterestAreaPath" class="menu_node_select">
        设置兴趣区域
      </span> -->
      <!-- <span @click="addInterestPosition" class="menu_node_select">
        设置兴趣点
      </span> -->
      <!-- <span @click="addOperationAreaPath" class="menu_node_select">
        设置操作区域
      </span> -->
      <!-- <span @click="addRoutePath" class="menu_node_select">添加路线</span> -->
      <el-row>
        <span @click="addDoctrine" class="menu_node_select">设置行动</span>
      </el-row>
      <el-row>
        <span @click="addPosition" class="menu_node_select">设置位置</span>
      </el-row>
      <el-row>
        <span @click="openEditBox" class="menu_node_select">编辑</span>
      </el-row>
    </div>
    <el-dialog title="重命名" :visible.sync="renameShow" width="30%" :modal="false" :close-on-click-modal="false"
      :modal-append-to-body="false">
      <el-input v-model="oldName" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加行为" :visible.sync="doctrineShow" width="300px" :modal="false" :close-on-click-modal="false"
      :modal-append-to-body="false">
      <div class="selectDoctrineMenu">
        <span :class="{ select: item.id == isDoctrineActive }" v-for="(item, index) in doctrineList" v-bind:key="index"
          @click="selectDoctrine(item, index)">
          {{ item.name }}
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加队形" :visible.sync="formationShow" width="300px" :modal="false" :close-on-click-modal="false"
      :modal-append-to-body="false">
      <div class="selectDoctrineMenu">
        <span :class="{ select: item.id == isFormationActive }" v-for="(item, index) in formationList"
          v-bind:key="index" @click="selectFormation(item, index)">
          {{ item.name }}
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog>
      <el-tree class="filter-tree" :data="$store.state.selectAddCGF" :props="defaultProps" default-expand-all
        :expand-on-click-node="false" highlight-current>
      </el-tree>
    </el-dialog>

    <EquipmentModel :data="entityList_data" @selectAdd="addEquipment" @cancelAdd="cancel"
      :entityListStatus="entityListStatus"></EquipmentModel>
    <CommandModel :data="commandList_data" @selectAdd="addCommand" @cancelAdd="cancel"
      :commandListStatus="commandListStatus"></CommandModel>
  </div>
</template>
<script>
import DrawLine from "@/utils/SimDataModel/DrawLine";
import DrawPoint from "@/utils/SimDataModel/DrawPoint";
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import DoctrineNode from "@/utils/EquipSchema/DoctrineNode";
import FormationNode from "@/utils/EquipSchema/FormationNode";

import EquipmentModel from "../CGFController/EquipmentModel.vue";
import CommandModel from "../CGFController/CommandModel.vue";
import Vue from "vue";
export default {
  components: {
    EquipmentModel,
    CommandModel,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
    selectNode: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      formationShow: false,
      formationList: [],
      entityList_data: [],
      entityListStatus: false,
      TKBList: [],
      renameShow: false,
      oldName: "",
      doctrineShow: false,
      doctrineList: [],
      commandListStatus: false,
      commandList_data: [],
      selectGroup: false,
      selectCGF: false,
      isDoctrineActive: -1,
      isFormationActive: -1,
      isCGFActive: -1,

      showNodeMenu: [],
    };
  },
  methods: {
    addGroup() {
      //添加指挥
      this.commandListStatus = true;
      let groupList = CGFListLoad.GenericGateway.GetEquipSchemaNode(9);
      this.commandList_data = [groupList];
      this.entityListStatus = false;
    },
    addEntityNode() {
      this.entityListStatus = true;
      let entityList = CGFListLoad.GenericGateway.GetEquipSchemaNode(1);
      this.entityList_data = [entityList];
      this.commandListStatus = false;
    },
    remove() {
      // console.log("remove", this.data);
      // CGFListLoad.updataNavPathLayer();
      CGFListLoad.removeRenderCGF(this.data);
      this.$emit("removeChild");
      //this.$store.state.navPathData[this.data.id] = [];
      // console.log(this.$store.state.navPathData);
    },
    rename() {
      // console.log("rename", this.data);
      this.oldName = this.data.getName();
      this.renameShow = true;

      this.showNodeMenu = document.getElementsByClassName("menu_node");

      console.log(this.showNodeMenu);
    },
    addAOI() {
      // console.log("addAOI", this.data);
    },
    addNavPath() {
      // console.log("NavPath", this.data);
      let self = this;
      let data = this.data;

      self.$store.state.addNavPath_data = data;
      let navPath = data.getNavPath().getList();
      this.$store.dispatch("updateNavPathList", navPath);
      this.$store.state.navPath_show = true;
    },
    addAreaPath() {
      let self = this;
      let data = this.data;

      self.$store.state.addNavPath_data = data;
      // let areaPath = CGFListLoad.getAreaPath(data.getAreaId()).getList();
      let areaPath = [];
      this.$store.dispatch("updateAreaPathList", areaPath);
      self.$store.state.areaPath_show = true;
    },
    addInterestAreaPath() {
      let self = this;
      let data = this.data;
      self.$store.state.addNavPath_data = data;
      // let areaPath = CGFListLoad.getAreaPath(data.getAreaId()).getList();
      let areaPath = [];
      this.$store.dispatch("updateAreaPathList", areaPath);
      self.$store.state.interestAreaPath_show = true;
    },
    addInterestPosition() {
      let _this = this;
      _this.$store.state.selectCGF_data = this.data;
      _this.$store.state.interestPosition_show = true;
    },
    addOperationAreaPath() {
      let self = this;
      let data = this.data;

      self.$store.state.addNavPath_data = data;
      // let areaPath = CGFListLoad.getAreaPath(data.getAreaId()).getList();
      let areaPath = [];
      this.$store.dispatch("updateAreaPathList", areaPath);
      self.$store.state.operationAreaPath_show = true;
    },
    addDoctrine() {
      // console.log("Doctrine", this.data);
      this.doctrineShow = true;
      let data = this.data;
      let initArray = [new DoctrineNode("无", -1, 0)];
      this.isDoctrineActive = data.getDoctrineId() || -1;
      let doctrines = CGFListLoad.GenericGateway.GetDoctrineNodes(
        CGFListLoad.GenericGateway.GetEquipSchemaNode(data.getTypeId())
      );
      this.doctrineList = initArray.concat(doctrines);
      // console.log(doctrines);
    },
    addPosition() {
      let data = this.data;
      var drawPoint = new DrawPoint(this.$map.map);
      drawPoint.startDraw(data.id, function (point) {
        var position = {
          x: point[0],
          y: point[1],
          z: 0,
        };
        data.setPosition(position);
        CGFListLoad.addPosition(data);
      });
    },

    setGroupPosition() {
      let self = this;
      self.$store.state.teamPosition_show = true;
      self.$store.state.teamPositionId = this.data.id;
      self.$store.state.teamPosition_data = this.data;
    },

    cancel() {
      this.entityListStatus = false;
      this.renameShow = false;
      this.commandListStatus = false;
      this.doctrineShow = false;
      this.formationShow = false;
    },
    // 编辑弹窗确定按钮调用方法
    ok() {
      if (this.renameShow) {
        this.data.setName(this.oldName);
        CGFListLoad.rename(this.data);
        this.$message({
          message: "修改完成",
          type: "success",
        });
      }
      this.renameShow = false;
      if (this.doctrineShow) {
      }
      this.doctrineShow = false;
      this.formationShow = false;
    },
    addCommand(node) {
      let child = CGFListLoad.addGroup(node, this.data);
      this.$emit("addChild", child);
      this.commandListStatus = false;
    },
    addEquipment(node) {
      console.log(node);
      let child = CGFListLoad.addCGF(node, this.data);
      // console.log(child);
      this.$store.state.selectAddCGF[0] = child;
      // console.log(this.$store.state.selectAddCGF);
      Vue.util.defineReactive(child, "position");
      Vue.util.defineReactive(child, "geoData");
      this.$emit("addChild", child);
      this.entityListStatus = false;
    },

    selectDoctrine(node, index) {
      // console.log(node);
      this.isDoctrineActive = node.getId();
      // console.log(this.isDoctrineActive);
      this.data.setDoctrineId(node.getId());
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },

    //队形操作
    addFormationNode() {
      // console.log("formation");
      this.formationShow = true;
      let data = this.data;
      let initArray = [new FormationNode("无", -1, -1)];
      this.isFormationActive = data.getFormationId() || -1;
      let formations = CGFListLoad.GenericGateway.GetFormationNodes(
        Number(data.getTypeId())
      );
      this.formationList = initArray.concat(formations);
      // console.log(formations);
      this.commandListStatus = false;
      this.entityListStatus = false;
    },
    selectFormation(node, index) {
      // console.log(node);
      this.isFormationActive = node.getId();
      this.data.setFormationId(node.getId());
    },
    addRoutePath() {
      // console.log("RoutePath", this.data);
      let self = this;
      let data = this.data;
      // console.log(data);
      self.$store.state.addRoutePath_data = data;
      // let routePath = data.getNavPath().getList();
      let geoData = data.getGeoData();
      let routePath = [];
      if (geoData) {
        let routeId = geoData.getOperationRouteId();
        if (routeId) {
          let routeNode =
            CGFListLoad.datamodel.routePathNodes.getChildById(routeId);
          routePath = routeNode.getList() || [];
        }
      }
      this.$store.dispatch("updateRoutePathList", routePath);
      this.$store.state.routePath_show = true;
    },
    openEditBox() {
      // this.$store.state.addNavPath_data = this.data; // 航路线、兴趣区、操作区
      // this.$store.state.selectCGF_data = this.data; // 兴趣点
      this.$store.state.CGF_nodeData = this.data;
      this.$store.state.edit_show = true;
      this.$store.dispatch("updateCGFSelectData", this.data);

      // console.log("NavPath", this.data);
      let self = this;
      let data = this.data;

      self.$store.state.addNavPath_data = data;
      let navPath = data.getNavPath().getList();
      this.$store.dispatch("updateNavPathList", navPath);
    },
  },
  mounted() {
    //CGFListLoad.initCGF();
  },
};
</script>
<style scoped>
.el-row {
  margin-bottom: 5px;
}

.menu_node {
  /* position: absolute;
    left: 442px;
    height: 170px; */
  /* overflow: auto; */
  /* width: 102px; */
  /* margin-top: 10px;
    padding: 10px;
    align-content: space-between;*/

  /* justify-content: space-between; */
  display: grid;
  /* background-color: dodgerblue;  */
}

.menu_node span {
  padding: 5px;
}

.historyChart {
  /* height: 500px; */
  /* width: 400px; */
  /* position: absolute; */
  /* left: 570px; */
  /* margin-left: 570px;
    margin-top: 10px;
    overflow:auto; */
  background-color: #fff;
  border-radius: 5px;
  /* box-shadow: 0 2px 14px 0 #2593ff; */
  display: flex;
  justify-content: space-between;
}

.tree_menu {
  width: 250px;
  height: 500px;
  background-color: #fff;
  /* height: 600px; */
  overflow: auto;
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  /* box-shadow: 0 2px 14px 0 #2593ff; */
}

.selectNodeMenu {
  z-index: 100;
  width: 200px;
  height: 500px;
  display: flex;
  /* justify-content: space-between; */
  /* align-content: space-between; */
  flex-direction: column;
  /* width: 136px; */
  /* height: fit-content; */
  background-color: #fff;
  border-radius: 5px;
  /* box-shadow: 0 2px 14px 0 #2593ff; */
  overflow: auto;
}

.selectNodeMenu span {
  /* margin: 2px; */
  padding: 10px;
  padding-left: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}

.selectNodeMenu span:hover {
  border: 1px solid #1e0064;
  background: #7fb6fd;
}

.selectDoctrineMenu {
  display: flex;
  /* align-content: space-between; */
  flex-direction: column;
  background-color: #fff;
  height: 500px;
  border-radius: 5px;
  overflow: auto;
  padding: 10px;
  /* box-shadow: 0 2px 14px 0 #2593ff; */
}

.selectDoctrineMenu span {
  padding: 5px;
}

.selectDoctrineMenu span:hover {
  border: 1px solid #1e0064;
  background: #7fb6fd;
}

.select {
  background-color: #7fb6fd;
}

.menu_node_select {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}

.menu_node_select:hover {
  background-color: #7fb6fd;
}
</style>