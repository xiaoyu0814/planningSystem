<template>
  <div id="makeUpYourMind" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>作战编成</span>
      <i class="el-icon-close" @click="$store.state.makeUpYourMind_show = false"></i>
    </header>
    <div class="content" v-if="true">
      <div class="tree_box">
        <el-tree :data="data" :props="defaultProps" ref="tree1" style="height: 100%" node-key="id" show-checkbox
          default-expand-all highlight-current check-strictly></el-tree>
      </div>
      <div class="btn_box">
        <el-button type="primary" icon="el-icon-arrow-right" circle @click="addCGFTO"></el-button>
        <!-- <el-button type="primary" icon="el-icon-arrow-left" circle></el-button> -->
      </div>
      <div class="tree_box">
        <el-tree :data="data2" ref="tree2" :props="defaultProps" @node-click="handleNodeClick" style="height: 100%"
          node-key="id" :default-checked-keys="[6125]" show-checkbox check-strictly default-expand-all highlight-current
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <div class="buttonBox">
              <span v-show="data.nodeType == '指挥' || data.parent == null">
                <el-button type="text" size="mini" @click="() => appCommand(data)">
                  增加指挥
                </el-button>
              </span>
              <span v-show="data.nodeType == '指挥' || data.parent == null">
                <el-button type="text" size="mini" @click="() => appCGF(data)">
                  增加兵力
                </el-button>
              </span>
              <span v-show="data.parent != null">
                <el-button type="text" size="mini" @click="() => remove(data)">
                  删除
                </el-button>
              </span>
              <span v-show="data.parent != null">
                <el-button type="text" size="mini" @click="() => edit(data)">
                  编辑
                </el-button>
              </span>
            </div>
          </span>
        </el-tree>
      </div>
    </div>
    <footer>
      <el-button type="primary" size="mini" @click="clickMakeMind">
        确 认
      </el-button>
      <el-button type="danger" size="mini" @click="$store.state.makeUpYourMind_show = false">
        取 消
      </el-button>
    </footer>
    <el-dialog title="新增子菜单" :visible.sync="addVisible" width="300px" :modal="false">
      <span class="childrenBox">
        <div style="margin-bottom: 10px; text-align: left; width: 100%">
          <span>类型：</span>
          <el-radio v-model="radio_type" label="指挥">指挥</el-radio>
          <el-radio v-model="radio_type" label="兵力">兵力</el-radio>
        </div>
        <div style="text-align: left; width: 100%">
          <span>名称：</span>
          <el-input v-model="addName" style="width: 80%" size="mini"></el-input>
        </div>
      </span>
      <span slot="footer">
        <el-button @click="(addVisible = false), (selectData = false)" size="mini">
          取 消
        </el-button>
        <el-button type="primary" @click="clickAdd" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑节点对话框-->
    <el-dialog title="编辑" :visible.sync="editVisible" width="300px" :modal="false">
      <span class="childrenBox">
        <div>
          <span>名称：</span>
          <el-input v-model="editName" style="width: 80%" size="mini"></el-input>
        </div>
      </span>
      <span slot="footer">
        <el-button @click="(editVisible = false), (selectData = false)" size="mini">取 消</el-button>
        <el-button type="primary" @click="clickEdit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <EquipmentModel :data="entityList_data" @selectAdd="addEquipment" @cancelAdd="cancel"
      :entityListStatus="entityListStatus"></EquipmentModel>
    <CommandModel :data="commandList_data" @selectAdd="addCommand" @cancelAdd="cancel"
      :commandListStatus="commandListStatus"></CommandModel>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import { NodeUnit, SideEnum } from "@/utils/SimDataModel/NodeConfig";
import UnitNode from "@/utils/UnitNodeModel/UnitNode";

import EquipmentModel from "@/components/CGFController/EquipmentModel.vue";
import CommandModel from "@/components/CGFController/CommandModel.vue";
export default {
  components: {
    EquipmentModel,
    CommandModel,
  },
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      cell_type: false,
      rowIndex: -1,
      columnIndex: -1,
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      data2: [],

      addVisible: false,
      editVisible: false,
      addName: "",
      editName: "",
      selectData: false,
      radio_type: "指挥",

      entityList_data: [],
      entityListStatus: false,
      commandList_data: [],
      commandListStatus: false,
    };
  },
  mounted() {
    if (this.$store.state.makeUpYourMind_num == 0) {
      let CGFRed = CGFListLoad.addSide("红方", SideEnum.SideRed);
      this.data2 = [CGFRed];
    } else {
      let CGFRed = [CGFListLoad.datamodel.GetRootCGFEntity(SideEnum.SideRed)];
      this.data2 = [...CGFRed];
    }
    console.log(this.data2);
    let _this = this;
    let redList = CGFListLoad.oldCGFList;
    _this.data = [...redList];
    _this.data[0].disabled = true;
    // console.log(_this.data);
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
      if (event.target.localName == "input") {
        return;
      }
      let moveLeft = event.pageX - this.moveDataelse.x + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      event.currentTarget.style.cursor = "move";
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
    // 移动弹窗方法 END
    getOldNode(id, data) {
      if (data.id == id) {
        return data;
      } else {
        for (let i = 0; i < data.children.length; i++) {
          let _node = this.getOldNode(id, data.children[i]);
          if (_node) {
            return _node;
          }
        }
      }
    },
    appCommand(data) {
      this.selectData = data;
      this.commandListStatus = true;
      let groupList = CGFListLoad.GenericGateway.GetEquipSchemaNode(9);
      this.commandList_data = [groupList];
      this.entityListStatus = false;
    },
    appCGF(data) {
      this.selectData = data;
      let entityList = CGFListLoad.GenericGateway.GetEquipSchemaNode(1);
      this.entityListStatus = true;
      this.entityList_data = [entityList];
      this.commandListStatus = false;
    },
    append(data) {
      // console.log("add", data);
      this.selectData = data;
      this.addVisible = true;
    },
    remove(data) {
      // console.log("remove", data);
      data.parent.removeChild(data);
      let ableData = this.getOldNode(data.id, this.data[0]);
      this.setTreeCheckAbled(ableData);
      let _data = this.data[0];
      this.$set(this.data, 0, _data);
    },

    edit(data) {
      // console.log("edit", data);
      this.selectData = data;
      this.editName = data.getName();
      this.editVisible = true;
    },
    clickAdd() {
      let newCGF = CGFListLoad.addSide(
        this.addName,
        SideEnum.SideRed,
        this.radio_type
      );
      this.selectData.addChild(newCGF);
      this.addVisible = false;
      this.selectData = false;
    },
    clickEdit() {
      this.selectData.setName(this.editName);
      this.editVisible = false;
      this.selectData = false;
    },
    handleNodeClick(data) {
      // console.log(data);
    },
    cellClick(row, column) {
      // console.log(row, "单条数据", column, "列信息");
      this.rowIndex = row.index;
      this.columnIndex = column.index;
      this.$refs["editInput"][0].focus();
    },
    inputBlur() {
      this.rowIndex = -1;
      this.columnIndex = -1;
    },
    addCGFTO() {
      let allCkeck = this.$refs.tree2
        .getCheckedKeys()
        .concat(this.$refs.tree2.getHalfCheckedKeys());
      // console.log(allCkeck)
      if (allCkeck.length < 1) {
        this.$message.error("未勾选要移动到的位置");
        return;
      }
      // console.log("add");
      let originData = this.$refs.tree1.getCheckedNodes();
      let newData = this.$refs.tree2.getCheckedNodes();
      let canAddData = newData[newData.length - 1];
      if (newData.length > 1) {
        canAddData = newData[0];
      }

      for (let i = 0; i < originData.length; i++) {
        if (originData[i].children.length > 0) {
          // canAddData.children.push(originData[i]);
          if (originData[i].disabled) {
            continue;
          }
          let newCgf = originData[i].clone();

          newCgf.setParent(canAddData);
          this.$refs.tree1.setCheckedNodes([]);
          this.setTreeCheckDisabled(originData[i]);

          if (originData[i].parent) {
            //originData[i].parent.removeChild(originData[i]);
          }
          // i = i + originData[i].children.length;
        } else {
          if (originData[i].disabled) {
            continue;
          }
          let newCgf = originData[i].clone();
          newCgf.setParent(canAddData);
          this.$refs.tree1.setCheckedNodes([]);
          this.setTreeCheckDisabled(originData[i]);
          // canAddData.children.push(originData[i]);
          if (originData[i].parent) {
            //originData[i].parent.removeChild(originData[i]);
          }
        }
      }
    },
    setTreeCheckAbled(originData) {
      let node = this.$refs.tree1.getNode(originData);
      this.$set(originData, "disabled", false);
      this.$refs.tree1.setChecked(node.data, true);
      this.$refs.tree1.setCheckedNodes([]);
      // originData.disabled = false;
      for (let i = 0; i < originData.children.length; i++) {
        this.setTreeCheckAbled(originData.children[i]);
      }
    },
    setTreeCheckDisabled(originData) {
      originData.disabled = true;
      for (let i = 0; i < originData.children.length; i++) {
        this.setTreeCheckDisabled(originData.children[i]);
      }
    },
    clickMakeMind() {
      CGFListLoad.replaceSide(SideEnum.SideRed, this.data2[0].clone());
      this.$store.state.makeUpYourMind_num++;
      let CGFEditRed = [
        CGFListLoad.datamodel.GetRootCGFEntity(SideEnum.SideRed),
      ];
      this.$store.state.CGFEditListData = [...this.data2];
      for (let i = 0; i < this.$store.state.CGFReadListData.length; i++) {
        let cgf = this.$store.state.CGFReadListData[i];
        CGFListLoad.updateSideLayer(cgf);
      }
      this.$store.state.navPathList_CGF = this.getCGFFirst(
        this.$store.state.CGFEditListData
      );
      console.log(this.$store.state.navPathList_CGF)
      this.$store.dispatch(
        "updateCGFSelectData",
        this.$store.state.navPathList_CGF
      );

      let self = this;
      let data = this.$store.state.navPathList_CGF;
      self.$store.state.addNavPath_data = data;
      let navPath = data.getNavPath().getList();
      this.$store.dispatch("updateNavPathList", navPath);

      this.$store.state.makeUpYourMind_show = false;
      this.$store.state.getSelent_show = true;
    },

    addCommand(node) {
      let child = CGFListLoad.addGroup(node, this.selectData);
      //this.$emit("addChild", child);
      // this.selectData.addChild(child);
      this.commandListStatus = false;
    },
    addEquipment(node) {
      // console.log(node);
      let child = CGFListLoad.addCGF(node, this.selectData);
      // this.selectData.addChild(child);
      //this.$emit("addChild", child);
      this.entityListStatus = false;
    },
    cancel() {
      this.entityListStatus = false;
      this.commandListStatus = false;
    },
    getCGFFirst(data) {
      if (data[0].children.length > 0) {
        let resilt = this.getCGFFirst(data[0].children);
        if (resilt) {
          return resilt;
        }
      } else {
        return data[0];
      }
    },
  },
};
</script>

<style scoped>
#makeUpYourMind {
  width: 700px;
  /* margin-left: -350px; */
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 14px 0 #2593ff;
  border-radius: 5px;
  overflow: hidden;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  padding: 20px 40px;
  padding-bottom: 0;
}

.tree_box {
  flex-grow: 1;
  overflow: auto;
  height: 400px;
}

.btn_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  width: 50px;
}

footer {
  padding: 10px;
  text-align: right;
  padding-top: 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.childrenBox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.buttonBox span {
  margin-right: 10px;
}
</style>
