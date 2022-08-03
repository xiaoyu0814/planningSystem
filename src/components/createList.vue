<template>
  <div id="createList" :style="$store.state.showorhidden ? 'height:calc(100% - 76px)' : 'height:0vh'">
    <header>
      <span>编制列表</span>

      <div>
        <i class="el-icon-minus" @click="$store.state.showorhidden = false" style="margin-right: 5px"></i>
        <i class="el-icon-copy-document" @click="$store.state.showorhidden = true"></i>
      </div>
    </header>
    <div class="tree_box">
      <el-scrollbar>
        <el-tree class="filter-tree" :data="$store.state.CGFListData" :props="defaultProps" default-expand-all
          :expand-on-click-node="false" @node-click="clickNode" ref="tree" highlight-current>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-popover placement="right" width="200" trigger="click">
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
    <div class="btn_box">
      <!-- <div class="saveDiv">
        保存想定
      </div>
      <div class="saveDiv">另存想定</div> -->
      <el-button type="primary" class="saveDiv" :disabled="btn_type" @click="updata_xml(1)">保存想定</el-button>
      <el-button type="primary" class="saveDiv" @click="uploadXML">另存想定</el-button>
    </div>
    <el-dialog title="提交想定" :visible.sync="changeEntity_show" width="500px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>态势名称：</span>
          <el-input v-model="xml_Object.name" size="mini" />
        </li>
        <li>
          <span>作战区域：</span>
          <el-select v-model="xml_Object.region" placeholder="请选择" style="width: 450px" size="mini">
            <el-option v-for="item in region_list" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          <span>作战背景：</span>
          <el-input v-model="xml_Object.backgroud" type="textarea" :rows="5" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeEntity_show = false">取 消</el-button>
        <el-button type="primary" @click="updata_xml(0)">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import nodesMenu from "@/components/mapEditor/nodesMenu.vue";

import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";

import { XML2String } from "@/utils/SimDataModel/utils";
export default {
  components: {
    nodesMenu,
  },
  data() {
    return {
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
      ],
      xml_Object: {
        name: "",
        backgroud: "",
        region: "",
        creator: sessionStorage.getItem("Uid"),
      },
      btn_type: false,
    };
  },
  mounted() {
    CGFListLoad.initCGF();
  },
  computed: {
    teacherXmlId() {
      return this.$store.state.teacherXmlId
    }
  },
  watch: {
    teacherXmlId() {
      this.btn_type = false;
    }
  },
  methods: {
    uploadXML() {
      // if (sessionStorage.getItem("teacherXmlId")) {
      //   this.btn_type = false;
      // } else {
      //   this.btn_type = true;
      // }
      this.changeEntity_show = true;
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
        if (data.position.x == 0) return;
        this.$map.map.setCenter([
          Number(data.position.x),
          Number(data.position.y),
        ]);
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
      // console.log(node, this.selectNode);
      // this.$set(this.selectNode,'')
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
    updata_xml(type) {
      // console.log(CGFListLoad.upload())
      // return
      let path = this.$path.xml.teacher_updata;
      let params = {
        backgroud: this.xml_Object.backgroud,
        creator: this.xml_Object.creator,
        name: this.xml_Object.name,
        region: this.xml_Object.region,
        tDocumentIds: this.$store.state.document_IdArray,
        xmlStr: CGFListLoad.upload(),
      };
      if (type) {
        params.id = this.$store.state.teacherXmlId;
        params.name = "12";
      }
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.btn_type = false;
          this.$store.state.document_IdArray = [];
          // sessionStorage.setItem("teacherXmlId", res.data.data);
          this.$store.state.teacherXmlId = res.data.data
          this.$message.success(res.data.msg || "提交成功");
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
#createList {
  background-color: rgba(255, 255, 255, 0);
  height: calc(100% - 76px);
  width: 300px;
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

.tree_box {
  /* padding: 10px; */
  /* position:absolute;
  left:140px; */
  /* width: 300px; */
  overflow: auto;
  /* margin-top: 10px; */
  background-color: rgba(255, 255, 255, 0.9);
  height: calc(100% - 36px - 34px);
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
  height: 36px;
  align-content: center;
  /* background-color: dodgerblue; */
  /* box-shadow: 0 2px 14px 0 #2593ff; */
  color: white;
  display: grid;
  text-align: center;
  width: 50%;
  border: 1px solid #fffa;
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

.btn_box {
  display: flex;
}
</style>

<style>
.btn_box>.el-button+.el-button {
  margin: 0;
}
</style>