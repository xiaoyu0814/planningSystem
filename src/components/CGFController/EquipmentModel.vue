<template>
  <div>
    <el-dialog title="装备列表" :visible.sync="entityListStatus" width="30%" :modal="false" :close-on-click-modal="false"
      :modal-append-to-body="false">
      <div class="historyChart">
        <div class="tree_menu">
          <el-tree class="filter-tree" :data="data" :props="defaultProps" :expand-on-click-node="false"
            @node-click="clickEntity" ref="Etree" node-key="typeId" :default-expanded-keys="[1]" highlight-current>
          </el-tree>
        </div>
        <div class="selectNodeMenu">
          <p style="font-size: 18px; font-weight: bold">装备型号</p>
          <span :class="{ select: item.modelId == isCGFActive }" v-for="(item, index) in TKBList" v-bind:key="index"
            @click="selectTkb(item)">{{ item.name }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
export default {
  name: "EquipmentModel",
  props: {
    data: {
      type: Array,
      default: [],
    },
    entityListStatus: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isCGFActive: -1,
      selectCGF: false,
      TKBList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    }
  },
  mounted() {
    // console.log("EquipmentModel")
  },
  methods: {
    selectTkb(node) {
      this.selectCGF = node;
      this.isCGFActive = node.modelId;
    },
    clickEntity(data, node, element) {
      console.log(data, node, element);
      this.TKBList = CGFListLoad.GenericGateway.GetEquipNodes(data);

      console.log(this.TKBList);
    },
    ok() {
      if (this.entityListStatus && this.selectCGF) {
        this.$emit("selectAdd", this.selectCGF);
        this.selectCGF = false;
      }
    },
    cancel() {
      this.$emit("cancelAdd", "Equipment");
    }
  }
}
</script>
<style scoped>
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
</style>