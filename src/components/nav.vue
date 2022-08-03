<template>
  <div id="nav">
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" mode="horizontal" @select="handleSelect"
      background-color="#ffffff" text-color="#303133" active-text-color="#409EFF" v-if="!$store.state.teacher">
      <el-submenu index="1" :disabled="
        role == '情报参谋' ||
        role == '领航参谋' ||
        role == '飞行员' ||
        role == '教导员' ||
        role == '副教导员'
      ">
        <template slot="title">
          <i class="el-icon-s-claim"></i>
          拟制工作计划
          <!-- {{ typeof $store.state.progress }}
          {{ $store.state.progress }} -->
        </template>
        <el-menu-item index="1-1" :disabled="!($store.state.progress > 0)">
          计划安排工作
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2" :disabled="
        role == '作战参谋' ||
        role == '领航参谋' ||
        role == '飞行员' ||
        role == '教导员' ||
        role == '副教导员'
      ">
        <template slot="title">
          <i class="el-icon-s-cooperation"></i>
          分析判断情况
        </template>
        <el-menu-item index="2-1" :disabled="!($store.state.progress > 1)">
          敌情分析
        </el-menu-item>
        <el-menu-item index="2-2" :disabled="!($store.state.progress > 2)">
          我情分析
        </el-menu-item>
        <el-menu-item index="2-3" :disabled="!($store.state.progress > 3)">
          环境分析
        </el-menu-item>
        <el-menu-item index="2-4" :disabled="!($store.state.progress > 4)">
          综合分析
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3" :disabled="
        role == '情报参谋' ||
        role == '领航参谋' ||
        role == '飞行员' ||
        role == '教导员' ||
        role == '副教导员'
      ">
        <template slot="title">
          <i class="el-icon-share"></i>
          定下决心
        </template>
        <el-menu-item index="3-1" :disabled="!($store.state.progress > 5)">
          拟制决心建议
        </el-menu-item>
        <el-menu-item index="3-2" :disabled="!($store.state.progress > 6)">
          评估方案
        </el-menu-item>
        <el-menu-item index="3-3" :disabled="!($store.state.progress > 7)">
          定下决心
        </el-menu-item>
        <el-menu-item index="3-4" :disabled="!($store.state.progress > 8)">
          生成战斗命令
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4" :disabled="
        role == '情报参谋' ||
        role == '领航参谋' ||
        role == '飞行员' ||
        role == '教导员' ||
        role == '副教导员'
      ">
        <template slot="title">
          <i class="el-icon-s-management"></i>
          拟制战斗计划
        </template>
        <el-menu-item index="4-1" :disabled="!($store.state.progress > 9)">
          协同计划
        </el-menu-item>
        <el-menu-item index="4-2" :disabled="!($store.state.progress > 10)">
          火力计划
        </el-menu-item>
        <el-menu-item index="4-3" :disabled="!($store.state.progress > 11)">
          机降计划
        </el-menu-item>
        <el-menu-item index="4-4" :disabled="!($store.state.progress > 12)">
          侦察计划
        </el-menu-item>
        <el-menu-item index="4-5" :disabled="!($store.state.progress > 13)">
          领航计划
        </el-menu-item>
        <el-menu-item index="4-6" :disabled="!($store.state.progress > 14)">
          其他计划
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5" :disabled="
        role == '情报参谋' ||
        role == '作战参谋' ||
        role == '飞行员' ||
        role == '教导员' ||
        role == '副教导员'
      ">
        <template slot="title">
          <i class="el-icon-s-operation"></i>
          组织战斗准备
        </template>
        <el-menu-item index="5-1" :disabled="!($store.state.progress > 15) || role == '领航参谋'">
          组织战斗协同
        </el-menu-item>
        <el-menu-item index="6-1" :disabled="!($store.state.progress > 16)">组织领航准备</el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-pie-chart"></i>
          领航准备
        </template>
      </el-submenu> -->
    </el-menu>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" mode="horizontal" @select="handleSelect"
      background-color="#ffffff" text-color="#303133" active-text-color="#409EFF" v-if="false">
      <!-- <el-menu-item index="1">导调文书</el-menu-item> -->
      <el-menu-item index="2">环境设置</el-menu-item>
      <!-- <el-menu-item index="3">兵力编成</el-menu-item> -->
    </el-menu>

    <div class="navList_box" v-if="!$store.state.teacher">
      <div class="navList_box_left">
        <span style="font-size: 14px; margin-right: 10px">当前阶段: </span>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <span style="font-size: 14px; font-weight: bold; color: #666">
              {{ firstLevelMenu }}
            </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span style="font-size: 14px; font-weight: bold; color: #419bf9">{{
                submenu
            }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div v-show="role !== '飞行员' && role !== '教导员' && role !== '副教导员'">
        <el-button icon="el-icon-s-flag" size="mini" @click="save">
          保存
        </el-button>
        <el-button icon="el-icon-s-promotion" size="mini" @click="dialogVisible_submit = true">
          提交
        </el-button>
        <span class="goto">跳转至：</span>
        <el-select v-model="goto_value" clearable placeholder="请选择" size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
            :disabled="$store.state.progress >= item.value">
          </el-option>
        </el-select>
        <el-button icon="el-icon-guide" size="mini" @click="dialogVisible_goto_submit = true" style="margin-left: 5px">
          确定
        </el-button>
      </div>
    </div>
    <el-button class="saveJBLayer_btn" v-if="$store.state.teacher" icon="el-icon-s-flag" size="mini" @click="save">保存
    </el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible_submit" width="350px" append-to-body>
      <span>确定要提交当前阶段，进入下一阶段吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_submit = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible_goto_submit" width="350px" append-to-body>
      <span>确定要提交当前阶段，进入所选阶段吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_goto_submit = false">取 消</el-button>
        <el-button type="primary" @click="goto_submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="layerName_show" width="300px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>图层名称：</span>
          <el-input v-model="layerName" size="mini" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="layerName_show = false">取 消</el-button>
        <el-button type="primary" @click="saveLayer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "-1",
      firstLevelMenu: "",
      submenu: "",
      dialogVisible_submit: false,
      dialogVisible_goto_submit: false,
      role: sessionStorage.getItem("roleName"),
      layerName: "",
      layerName_show: false,
      geoPlots: "",
      options: [
        {
          label: "拟制工作计划",
          value: 1,
        },
        {
          label: "敌情分析",
          value: 2,
        },
        {
          label: "我情分析",
          value: 3,
        },
        {
          label: "环境分析",
          value: 4,
        },
        {
          label: "综合分析",
          value: 5,
        },
        {
          label: "拟制决心建议",
          value: 6,
        },
        {
          label: "评估方案",
          value: 7,
        },
        {
          label: "定下决心",
          value: 8,
        },
        {
          label: "生成战斗命令",
          value: 9,
        },
        {
          label: "协同计划",
          value: 10,
        },
        {
          label: "火力计划",
          value: 11,
        },
        {
          label: "机降计划",
          value: 12,
        },
        {
          label: "侦察计划",
          value: 13,
        },
        {
          label: "领航计划",
          value: 14,
        },
        {
          label: "其他计划",
          value: 15,
        },
        {
          label: "组织战斗协同",
          value: 16,
        },
        {
          label: "组织领航准备",
          value: 17,
        },
      ],
      goto_value: "",
    };
  },
  mounted() {
    this.getFindStage();
    this.initSocket();
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(this.activeIndex);
      // console.log(key, keyPath);
      if (key == "1-1") {
        this.firstLevelMenu = "拟制工作计划";
        this.submenu = "计划安排工作";
        this.$store.state.documentation_name = this.firstLevelMenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 1;
      } else if (key == "2-1") {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "敌情分析";
        this.$store.state.documentation_name = this.submenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 2;
      } else if (key == "2-2") {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "我情分析";
        this.$store.state.documentation_name = this.submenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 3;
      } else if (key == "2-3") {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "环境分析";
        this.$store.state.documentation_name = this.submenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 4;
      } else if (key == "2-4") {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "综合分析";
        this.$store.state.documentation_name = this.submenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 5;
      } else if (key == "3-1") {
        this.firstLevelMenu = "定下决心";
        this.submenu = "拟制决心建议";
        this.$store.state.determinedToSuggest_show = true;
        this.$store.state.progress_temp = 6;
        this.$store.state.documentation_name = "";
      } else if (key == "3-2") {
        this.firstLevelMenu = "定下决心";
        this.submenu = "评估方案";
        this.$store.state.documentation_name = this.firstLevelMenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 7;
      } else if (key == "3-3") {
        this.firstLevelMenu = "定下决心";
        this.submenu = "定下决心";
        this.$store.state.makeUpYourMind_show = true;
        this.$store.state.documentation_name = "战斗决心";
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 8;
      } else if (key == "3-4") {
        this.firstLevelMenu = "定下决心";
        this.submenu = "生成战斗命令";
        this.$store.state.documentation_name = this.submenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 9;
      } else if (key == "4-1") {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "协同计划";
        this.$store.state.documentation_name = this.submenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 10;
      } else if (key == "4-2") {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "火力计划";
        this.$store.state.documentation_name = "分支计划";
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 11;
      } else if (key == "4-3") {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "机降计划";
        this.$store.state.documentation_name = "分支计划";
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 12;
      } else if (key == "4-4") {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "侦察计划";
        this.$store.state.documentation_name = "分支计划";
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 13;
      } else if (key == "4-5") {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "领航计划";
        this.$store.state.documentation_name = "分支计划";
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 14;
      } else if (key == "4-6") {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "其他计划";
        this.$store.state.documentation_name = "分支计划";
        // this.$store.state.documentation_show = true;
        this.$store.state.progress_temp = 15;
      } else if (key == "5-1") {
        this.firstLevelMenu = "组织战斗准备";
        this.submenu = "组织战斗协同";
        this.$store.state.setMarshalling_show = true;
        this.$store.state.progress_temp = 16;
        this.$store.state.documentation_name = "";
      } else if (key == "6-1") {
        this.firstLevelMenu = "组织战斗准备";
        this.submenu = "组织领航准备";
        this.$store.state.documentation_name = this.firstLevelMenu;
        // this.$store.state.documentation_show = true;
        this.$store.state.navPath_show = true;
        this.$store.state.progress_temp = 17;
      } else if (key == "1") {
        this.$store.state.sendingAndReceivingOfDocuments_show = true;
      } else if (key == "2") {
        this.$store.state.environmentSettings_show = true;
      } else if (key == "3") {
        this.$store.state.makeUpYourMind_show = true;
      }
    },
    saveImage() {
      let c = document.getElementsByTagName("canvas")[0];
      let imgUrl = c.toDataURL("image/png", 0.1);
      // console.log(imgUrl);
      let path_saveImg =
        this.$path.upload.saveBase64 +
        `?sessionid=${sessionStorage.getItem(
          "sessionid"
        )}&courseId=${sessionStorage.getItem("courseId")}`;
      let params_saveImg = {
        base64: imgUrl,
        childId: this.$store.state.progress_temp,
        txmlId: sessionStorage.getItem("xmlId"),
        userId: sessionStorage.getItem("Uid"),
        name: this.layerName,
      };
      this.$http.post(path_saveImg, params_saveImg).then((res) => {
        this.layerName = "";
        // if (res.data.code == 0) {
        // } else {
        //   // this.$message({
        //   //   message: res.data.message,
        //   //   type: "error",
        //   // });
        // }
      });
    },
    save() {
      let path = JB_PlotIP + "/PathNative/service/getBufferToPC";
      let params = { geoPlot: this.$map.DrawTest.geoPlots.join() };
      this.$http.get(path, params).then((res) => {
        if (res.status == 200) {
          this.geoPlots = res.data.join();
          this.layerName_show = true;
        }
      });
      // this.layerName_show = true;
      // console.log(this.$map.DrawPlot.geoPlots)
      // return
    },
    saveLayer() {
      let path =
        this.$path.LayerManagement.saveLayer +
        `?userId=${sessionStorage.getItem("Uid")}`;
      let params = {
        content: this.geoPlots,
        name: this.layerName,
      };
      console.log(this.$store.state.temp_JBLayer);
      this.$store.state.JBLayer[this.layerName] =
        this.$store.state.temp_JBLayer;
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.layerName_show = false;
          this.$store.state.temp_JBLayer = [];
          this.$map.DrawTest.geoPlots = [];
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.saveImage();
          this.$map.overlayLayer_.getSource().clear();
        } else {
          this.$message.error(res.data.message || "提交失败");
        }
      });
    },
    submit() {
      this.$store.state.progress++;
      this.dialogVisible_submit = false;
      if (this.$store.state.progress > 17) {
        this.$message({
          message: "已到最后一步",
          type: "error",
        });
        return;
      }
      this.$store.state.progress_temp = this.$store.state.progress;
      let path = this.$path.nav.saveStage;
      let params = {
        childId: this.$store.state.progress,
        courseId: sessionStorage.getItem("courseId"),
        sessionId: sessionStorage.getItem("sessionid"),
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.firstLevelMenu = "";
          this.submenu = "";
          // this.activeIndex = "-1";
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.getStage(this.$store.state.progress);
        } else {
          this.$message({
            message: "提交失败",
            type: "error",
          });
        }
      });
    },
    goto_submit() {
      this.dialogVisible_goto_submit = false;
      this.$store.state.progress = this.goto_value;
      let path = this.$path.nav.saveStage;
      let params = {
        childId: this.$store.state.progress,
        courseId: sessionStorage.getItem("courseId"),
        sessionId: sessionStorage.getItem("sessionid"),
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        this.dialogVisible_submit = false;
        if (res.data.code == 0) {
          this.firstLevelMenu = "";
          this.submenu = "";
          // this.activeIndex = "-1";
          this.$message({
            message: "提交成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "提交失败",
            type: "error",
          });
        }
      });
    },
    getFindStage() {
      let path = this.$path.nav.findStage;
      let params = {
        courseId: sessionStorage.getItem("courseId"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.firstLevelMenu = res.data.data.fatherName;
          this.submenu = res.data.data.childName;
          this.$store.state.progress = res.data.data.id;
          this.$store.state.progress_temp = this.$store.state.progress;
          if (this.$store.state.progress >= 8) {
            this.$store.state.getSelent_show = true;
          }
          this.getStage(res.data.data.id);
        } else {
          this.$store.state.progress = 1;
        }
      });
    },
    initSocket() {
      let path = self_websoket + `/websocket/${sessionStorage.getItem("Uid")}`;
      this.socket = new WebSocket(path);
      this.socket.onmessage = this.socketOnMessage;
    },
    socketOnMessage(e) {
      if (sessionStorage.getItem("roleName") == "训练参谋") {
      } else {
        if (e.data.indexOf("连接") == -1) {
          this.$store.state.progress = e.data;
          this.getStage(e.data);
        }
      }
    },
    getStage(key) {
      console.log(key);
      if (key == 1) {
        this.firstLevelMenu = "拟制工作计划";
        this.submenu = "计划安排工作";
        this.activeIndex = "1-1";
        this.$store.state.documentation_name = this.firstLevelMenu;
      } else if (key == 2) {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "敌情分析";
        this.activeIndex = "2-1";
        this.$store.state.documentation_name = this.submenu;
      } else if (key == 3) {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "我情分析";
        this.activeIndex = "2-2";
        this.$store.state.documentation_name = this.submenu;
      } else if (key == 4) {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "环境分析";
        this.activeIndex = "2-3";
        this.$store.state.documentation_name = this.submenu;
      } else if (key == 5) {
        this.firstLevelMenu = "分析判断情况";
        this.submenu = "综合分析";
        this.activeIndex = "2-4";
        this.$store.state.documentation_name = this.submenu;
      } else if (key == 6) {
        this.firstLevelMenu = "定下决心";
        this.submenu = "拟制决心建议";
        this.activeIndex = "3-1";
        this.$store.state.documentation_name = "";
      } else if (key == 7) {
        this.firstLevelMenu = "定下决心";
        this.submenu = "方案优选";
        this.activeIndex = "3-2";
        this.$store.state.documentation_name = this.firstLevelMenu;
      } else if (key == 8) {
        this.firstLevelMenu = "定下决心";
        this.submenu = "定下决心";
        this.activeIndex = "3-3";
        this.$store.state.documentation_name = "战斗决心";
      } else if (key == 9) {
        this.firstLevelMenu = "定下决心";
        this.submenu = "生成战斗命令";
        this.activeIndex = "3-4";
        this.$store.state.documentation_name = this.submenu;
      } else if (key == 10) {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "协同计划";
        this.activeIndex = "4-1";
        this.$store.state.documentation_name = this.submenu;
      } else if (key == 11) {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "火力计划";
        this.activeIndex = "4-2";
        this.$store.state.documentation_name = "分支计划";
      } else if (key == 12) {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "机降计划";
        this.activeIndex = "4-3";
        this.$store.state.documentation_name = "分支计划";
      } else if (key == 13) {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "侦察计划";
        this.activeIndex = "4-4";
        this.$store.state.documentation_name = "分支计划";
      } else if (key == 14) {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "领航计划";
        this.activeIndex = "4-5";
        this.$store.state.documentation_name = "分支计划";
      } else if (key == 15) {
        this.firstLevelMenu = "拟制战斗计划";
        this.submenu = "其他计划";
        this.activeIndex = "4-6";
        this.$store.state.documentation_name = "分支计划";
      } else if (key == 16) {
        this.firstLevelMenu = "组织战斗准备";
        this.submenu = "组织战斗协同";
        this.activeIndex = "5-1";
        this.$store.state.documentation_name = "";
      } else if (key == 17) {
        this.firstLevelMenu = "组织战斗准备";
        this.submenu = "组织领航准备";
        this.activeIndex = "6-1";
        this.$store.state.documentation_name = this.firstLevelMenu;
      }
    },
  },
};
</script>

<style scoped>
#nav .navList_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-image: linear-gradient(0deg,
      rgba(199, 220, 254, 0.3) 0%,
      #8ba6d5 100%);
}

#nav .navList_box .navList_box_left {
  display: flex;
  align-items: center;
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

.saveJBLayer_btn {
  position: fixed;
  right: 50px;
  top: 100px;
}

.goto {
  font-size: 12px;
  margin-left: 5px;
}
</style>

<style>
#app .el-submenu__title {
  font-size: 18px;
}

#app #nav .el-tree,
.el-input__inner {
  background-color: rgba(255, 255, 255, 1);
}
</style>