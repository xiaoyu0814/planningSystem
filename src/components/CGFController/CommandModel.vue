<template>
  <el-dialog title="建制单位列表" :visible.sync="commandListStatus" width="300px" :modal="false" :close-on-click-modal="false"
    :modal-append-to-body="false">
    <div class="tree_menu">
      <el-tree class="filter-tree" :data="data" :props="defaultProps" highlight-current :expand-on-click-node="false"
        @node-click="clickGroup" ref="Gtree" default-expand-all>
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "CommandModel",
  props: {
    data: {
      type: Array,
      default: [],
    },
    commandListStatus: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      groupList_data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectGroup: false
    }
  },
  methods: {
    clickGroup(data, node, element) {
      // console.log(data, node, element);
      this.selectGroup = data;
    },
    ok() {
      if (this.commandListStatus && this.selectGroup) {
        this.$emit("selectAdd", this.selectGroup);
        this.selectGroup = false;
      }
    },
    cancel() {
      this.$emit("cancelAdd", "Command");
    }
  }
}
</script>
<style scoped>
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