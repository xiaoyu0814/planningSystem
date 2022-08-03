<template>
  <div id="header" :class="$store.state.teacher ? 'teacher' : 'student'">
    <ul>
      <li>
        <span class="pointer" @click="drawLine" style="margin-right:10px"> 方里网格 </span>
        <span v-if="!$store.state.teacher" class="pointer" @click="$store.state.background_show = true">
          作战背景
        </span>
        <span v-if="$store.state.teacher" class="pointer" @click="changeEntity_show = true">
          上传想定
        </span>
      </li>
      <li class="user_box">
        <img class="userImg" src="../assets/images/user.png" alt="" />
        <span>
          <p>{{ username }}</p>
          <p style="margin-top: 10px">{{ roleName }}</p>
        </span>
      </li>
      <li class="user_out">
        <el-popover placement="bottom" trigger="click" class="pointer">
          <el-button @click="logout_show = true">退出登录</el-button>
          <img src="../assets/images/output.png" alt="" slot="reference" />
        </el-popover>
      </li>
    </ul>
    <el-dialog title="提示" :visible.sync="logout_show" width="300px" append-to-body>
      <span>确认退出当前登录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logout_show = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传想定 -->
    <el-dialog title="上传想定" :visible.sync="changeEntity_show" width="500px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>想定文件：</span>
          <el-upload
            :action="$path.xml.uploadTXml"
            :data="xml_Object"
            accept=".xml"
            ref="upload"
            :auto-upload="false"
            :show-file-list="false"
            :on-error="upload_error"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </li>
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
        <el-button type="primary" @click="updata_XML">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: sessionStorage.getItem("Username") || "未登录",
      roleName: sessionStorage.getItem("roleName") || "未定义",
      logout_show: false,
      JYWG_show: false,
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
      }
    };
  },
  mounted() { },
  destroyed() {
    location.reload(); // 刷新页面
  },
  methods: {
    logout() {
      let path = this.$path.user.exit;
      let params = {
        sessionid: sessionStorage.getItem("sessionid"),
        uid: sessionStorage.getItem("Uid"),
      };
      let _this = this;
      this.$http.get(path, params).then((res) => {
        // if (this.$store.state.teacher) {
        //   if (res.data.code == 0) {
        //     this.logoutOK();
        //   } else {
        //     this.$router.push("/");
        //   }
        // } else {
        //   this.logoutOK();
        // }
        this.logoutOK();
      });
    },
    logoutOK() {
      this.$message({
        message: "退出成功",
        type: "success",
      });
      window.clearInterval(this.$store.state.login_interval);
      this.removeAllSession();
      this.$router.push("/");
    },
    removeAllSession() {
      this.send_DK();
      sessionStorage.removeItem("sessionid");
      sessionStorage.removeItem("Uid");
      sessionStorage.removeItem("Appid");
      sessionStorage.removeItem("Username");
      sessionStorage.removeItem("Uid");
      sessionStorage.removeItem("gid");
      sessionStorage.removeItem("xmlId");
      sessionStorage.removeItem("courseId");
      sessionStorage.removeItem("roleId");
      sessionStorage.removeItem("roleName");
      sessionStorage.removeItem("courseType");
      sessionStorage.removeItem("toUid");
      sessionStorage.removeItem("teacherXmlId");
    },
    send_DK() {
      let json_DK = {
        Uid: sessionStorage.getItem("Uid"),
        Ip: "10.254.247.205",
        Username: sessionStorage.getItem("Username"),
        Role: sessionStorage.getItem("roleName"),
        Groupid: sessionStorage.getItem("gid"),
        State: 1,
        Flag: "PlanSeatSend",
      };

      let json = {
        text: JSON.stringify(json_DK),
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
        appid: Number(sessionStorage.getItem("Appid")),
        from: Number(sessionStorage.getItem("Uid")),
        content: content_to_str,
        tag: "1",
        time: parseInt(Number(new Date()) / 1000),
        to: Number(sessionStorage.getItem("gid")),
        tos: null,
        type: 2,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
        }
      });
    },
    drawLine() {
      if (this.$map.map.getZoom() >= 12) {
        if (this.JYWG_show) {
          this.$map.DrawJYWG.Clear();
          this.JYWG_show = false;
          this.$map.DrawJYWG.canDraw = false;
        } else {
          this.$map.DrawJYWG.StartDraw();
          this.JYWG_show = true;
          this.$map.DrawJYWG.canDraw = true;
        }
      } else {
        this.$message.error("当前地图层级太低，请放大后在绘制");
      }
    },
    updata_XML(){
      this.$refs.upload.submit()
      this.changeEntity_show = false;
    },
    upload_error(err,file,fileList){
      console.log(err);
      console.log(file);
      console.log(fileList);
    }
  },
};
</script>

<style scoped>
#header {
  height: 76px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.student {
  background-image: url("../assets/images/header_bg.jpg");
}

.teacher {
  background-image: url("../assets/images/header_teacher_bg.jpg");
}

#header ul,
#header li {
  height: 100%;
  display: flex;
}

#header li {
  align-items: center;
  color: #fff;
  margin: 0 20px;
}

#header ul img {
  height: 60%;
}

#header .user_box span {
  /* background-color: rgb(15, 0, 151); */
  padding: 2px;
}

#header .userImg {
  border: 1px solid rgb(20, 75, 255);
  border-radius: 1000px;
  margin-right: 10px;
}

#header .user_out img {
  background-color: rgb(15, 0, 151);
  padding: 5px;
  box-sizing: border-box;
  width: 40px;
}

.pointer {
  cursor: pointer;
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

<style>
body .el-popover {
  min-width: auto;
}
</style>