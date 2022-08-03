<template>
  <div id="setMarshalling" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>{{ $store.state.progress > 8 ? "编组" : "编制" }}列表</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <div class="read_tree">
      <el-scrollbar>
        <el-tree class="filter-tree" :data="$store.state.CGFReadListData" :props="defaultProps" default-expand-all
          :expand-on-click-node="false" @node-click="clickNode" ref="treeblue" highlight-current>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="false">
              <el-popover placement="right" trigger="click" width="150">
                <nodesMenu :data="selectEntity" :selectNode="selectNode" @addChild="addnodeChild"
                  @removeChild="removenodeChild"></nodesMenu>
                <el-button type="text" size="mini" @click="() => show(node, data)" icon="el-icon-more" slot="reference">
                </el-button>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <hr />
    <div class="edit_tree">
      <el-scrollbar>
        <el-tree class="filter-tree" :data="$store.state.CGFEditListData" :props="defaultProps" default-expand-all
          :expand-on-click-node="false" @node-click="clickNode" ref="tree" highlight-current>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-popover placement="right" trigger="click" width="150">
                <nodesMenu :data="selectEntity" :selectNode="selectNode" @addChild="addnodeChild"
                  @removeChild="removenodeChild"></nodesMenu>
                <el-button type="text" size="mini" @click="() => show(node, data)" icon="el-icon-more" slot="reference">
                </el-button>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="saveDiv" @click="changeEntity_show = true" v-if="showType">
      提交想定
    </div>
    <div class="saveDiv" v-if="false">
      <el-upload class="upload-demo" action="http://10.254.254.202:8080/fileService/service/upload" :on-success="sccess"
        :show-file-list="false">
        提交想定
      </el-upload>
    </div>
    <el-dialog title="提交想定" :visible.sync="changeEntity_show" width="500px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>态势名称：</span>
          <el-input v-model="xml_Object.name" size="mini" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeEntity_show = false">取 消</el-button>
        <el-button type="primary" @click="updata_xml">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import nodesMenu from "@/components/mapEditor/nodesMenu.vue";

import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import EquipDataModel from "@/utils/EquipSchema/EquipDataModel";
export default {
  components: {
    nodesMenu,
  },
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      tree_data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectEntity: {},
      selectNode: {},
      nodeMenu: false,
      changeEntity_show: false,
      region_list: [
        {
          label: "南海中沙群岛地区",
          value: "南海中沙群岛地区",
        },
        {
          label: "台海地区",
          value: "台海地区",
        },
        {
          label: "中印方向西段（班公湖）",
          value: "中印方向西段（班公湖）",
        },
        {
          label: "中印方向东段（亚东县）",
          value: "中印方向东段（亚东县）",
        },
        {
          label: "中朝方向（天池）",
          value: "中朝方向（天池）",
        },
        {
          label: "中缅方向（南伞河）",
          value: "中缅方向（南伞河）",
        },
      ],
      xml_Object: {
        name: "",
        backgroud: "",
        region: "",
        creator: sessionStorage.getItem("Uid"),
        courseId: sessionStorage.getItem("courseId"),
      },
      showType: false,
    };
  },
  mounted() {
    CGFListLoad.initCGF();
    if (sessionStorage.getItem("modeType") == "1") {
      if (
        sessionStorage.getItem("roleName") == "营长" ||
        sessionStorage.getItem("roleName") == "训练参谋"
      ) {
        this.showType = true;
      } else {
        this.showType = false;
      }
    } else {
      this.showType = true;
    }
  },
  methods: {
    close() {
      this.$store.state.setMarshalling_show = false;
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
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
    show(node, data) {
      // console.log(node, data);
      this.nodeMenu = true;
      this.selectEntity = data;
      this.selectNode = node;
    },
    clickNode(data, node, element) {
      // console.log(data, node, element);
      if (data.nodeType == "兵力") {
        if (data.position.x == 0) return;
        this.$map.map.setCenter([data.position.x, data.position.y]);
        this.$map.map.setZoom(15);
      }
      this.$store.state.navPathId = data.id;
      // let type = true;
      // for (const key in this.$store.state.navPathData) {
      //   if (key == data.id) {
      //     type = false;
      //   }
      // }
      // if (type) {
      //   this.$set(this.$store.state.navPathData, data.id, []);
      //   this.$store.state.lineLayerId.push(data.id);
      // }
    },
    addnodeChild(node) {
      this.$refs.tree.append(node, this.selectNode);
    },
    removenodeChild() {
      this.$refs.tree.remove(this.selectNode);
    },
    save() {
      CGFListLoad.save();
    },
    sccess(res, fild, fileList) {
      // console.log(res);
      this.$message({
        message: "上传成功",
        type: "success",
      });
      this.send();
    },
    send() {
      let json = {
        text: "shyInfo",
        contentType: 3,
      };
      let json_to_STR = JSON.stringify(json);
      let content = {
        fromName: "3001",
        json: json_to_STR,
        toName: "13008",
      };
      let content_to_str = JSON.stringify(content);
      let path = this.$path.message.directsendmsg + `?type=2`;
      let params = {
        appid: 10,
        from: 67333476503552,
        content: content_to_str,
        tag: "1",
        time: parseInt(Number(new Date()) / 1000),
        to: 67484278607872,
        tos: null,
        type: 1,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          // setTimeout(() => {
          //   this.getHistoryMsgs(
          //     [Number(this.self_uid), Number(this.to_Uid)],
          //     1
          //   );
          // }, 1000);
          let msg = {
            appid: 10,
            from: Number(sessionStorage.getItem("Uid")),
            to: Number(this.to_Uid),
            content: {
              fromName: "3001",
              json: { text: this.textarea, contentType: 3 },
              toName: "13008",
            },
            timestamp: 1625670338,
            msgid: 67403750932480,
            Username: sessionStorage.getItem("Username"),
          };
          this.historyMsgs_list.push(msg);
          this.textarea = "";
        }
      });
    },

    updata_xml() {
      // console.log(CGFListLoad.upload());
      // let cgf = CGFListLoad.GenericGateway.GetEquipSchemaNode("104")
      // console.log(cgf)
      // return;
      let path =
        this.$path.xml.s_updata +
        `?courseId=${this.xml_Object.courseId}&txmlId=${sessionStorage.getItem(
          "xmlId"
        )}`;

      // CGFListLoad.replaceSide(1, this.$store.state.CGFEditListData[0]);
      let params = {
        xmlStr: CGFListLoad.upload(),
        name: this.xml_Object.name,
        backgroud: this.xml_Object.backgroud,
        creator: this.xml_Object.creator,
        region: this.xml_Object.region,
        tDocumentIds: [],
        process: this.$store.state.progress == 17 ? true : false,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.data.message || "提交成功");
          this.changeEntity_show = false;
        } else {
          this.$message.error(res.data.message || "提交失败");
        }
      });
    },
  },
};
</script>

<style scoped>
#setMarshalling {
  background-color: rgba(255, 255, 255, 0.9);
  height: 500px;
  width: 320px;
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header i {
  cursor: pointer;
}

.read_tree {
  padding: 10px;
  /* position:absolute;
  left:140px; */
  width: 300px;
  background-color: rgba(255, 255, 255, 0);
  height: calc(50% - 90px);
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
}

.edit_tree {
  padding: 10px;
  /* position:absolute;
  left:140px; */
  width: 300px;
  background-color: rgba(255, 255, 255, 0);
  height: calc(60% - 90px);
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
}

.tree_box {
  padding: 10px;
  /* position:absolute;
  left:140px; */
  width: 300px;
  background-color: #fff;
  height: calc(100% - 90px);
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  /* box-shadow: 0 2px 14px 0 #2593FF; */
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.saveDiv {
  padding: 4px;
  height: 26px;
  align-content: center;
  background-color: dodgerblue;
  box-shadow: 0 2px 14px 0 #2593ff;
  color: white;
  display: grid;
  text-align: center;
}

.contentValue li {
  display: flex;
  /* align-items: center; */
  padding: 10px;
}

.contentValue li span {
  width: 100px;
  margin-top: 5px;
}
</style>

