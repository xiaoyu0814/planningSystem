<template>
  <div class="CGFList">
    <div style="z-index: 1000; position: absolute" @click="addEntity">
      测试想定加载
    </div>
    <div class="tree_box" v-show="showCGF">
      <el-tree class="filter-tree" :data="tree_data" :props="defaultProps" default-expand-all
        :expand-on-click-node="false" @node-click="clickNode" ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => show(node, data)">
              ...
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <nodesMenu v-show="nodeMenu" :data="selectEntity" :selectNode="selectNode" @addChild="addnodeChild"></nodesMenu>
  </div>
</template>
<script>
import nodesMenu from "./nodesMenu.vue";
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import CGFEntityLayer from "@/utils/SimDataModel/CGFEntityLayer";
export default {
  components: {
    nodesMenu,
  },
  data() {
    return {
      tree_data: [],
      nodeMenu: false,
      selectEntity: {},
      TKBmodel: null,
      selectNode: {},
      showCGF: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    addEntity() {
      // console.log("想定加载");
      var path = "/data/GenericScenario.xml";

      var datamodel = CGFListLoad.initEntity(path, this.$store.state.XDType);
      this.showCGF = true;
      this.tree_data = datamodel.vecNodes;
      // console.log(datamodel);
      var _CGFEntityLayer = new CGFEntityLayer(datamodel);
    },
    show(node, data) {
      // console.log(node, data);
      this.nodeMenu = true;
      this.selectEntity = data;
      this.selectNode = node;
    },
    clickNode(data, node, element) {
      // console.log(data, node, element);
      if (data.nodeType == "兵力") {
        this.$map.map.setCenter([data.position.x, data.position.y]);
        this.$map.map.setZoom(15);
      }
    },
    addnodeChild(node) {
      this.$refs.tree.append(node, this.selectNode);
    },
  },
  mounted() {
    CGFListLoad.initCGF();
  },
};
</script>
<style scoped>
.tree_box {
  position: absolute;
  left: 140px;
  width: 300px;
  overflow: auto;
  margin-top: 10px;
  background-color: #fff;
  height: 400px;
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>