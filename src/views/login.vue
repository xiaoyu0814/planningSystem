<template>
  <div id="login">
    <p class="title">直升机分队战斗行动模拟训练与推演系统</p>
    <p class="subtitle" v-if="!$store.state.teacher">战斗筹划系统</p>
    <p class="subtitle" v-else>态势配置系统</p>
    <div class="login_box">
      <img src="../assets/images/login/logo.png" alt="LOGO" />
      <ul>
        <li>
          <p>用户名</p>
          <el-input placeholder="请输入内容" prefix-icon="el-icon-user" v-model="username" style="flex-grow: 1"
            @keyup.enter.native="login">
          </el-input>
        </li>
        <li>
          <p>密码</p>
          <el-input placeholder="请输入内容" prefix-icon="el-icon-lock" v-model="password" show-password
            @keyup.enter.native="login">
          </el-input>
        </li>
        <li v-if="false">
          <p style="width: 70px">角色</p>
          <el-select v-model="role" placeholder="请选择" style="width: 255px">
            <el-option v-for="item in role_list" :key="item.roleKey" :label="item.roleName" :value="item.roleKey">
            </el-option>
          </el-select>
        </li>
        <li>
          <el-button type="primary" round style="width: 100%" @click="login">登 录</el-button>
          <!-- <el-button type="primary" plain round>取消</el-button> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      username: "",
      password: "",
      role: "",
      role_list: [
        {
          label: "营长",
          value: "营长",
        },
        {
          label: "情报参谋",
          value: "情报参谋",
        },
        {
          label: "作战参谋",
          value: "作战参谋",
        },
        {
          label: "领航参谋",
          value: "领航参谋",
        },
      ],
      xmlId: "",
    };
  },
  mounted() {
    // if (!this.$store.state.teacher) {
    //   this.queryBindXml();
    // }
    console.log(this.$route.path);
    console.log(this.$route.params);
    console.log(this.$route.query);
    if (this.$route.query.username) {
      this.username = this.$route.query.username;
      this.password = this.$route.query.password;
      this.login();
    }
  },
  methods: {
    login() {
      let path = this.$path.user.login;
      let params = {
        username: this.username,
        password: this.password,
        mac: "qqq",
        appid: 10,
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          sessionStorage.setItem("sessionid", res.data.data.sessionid);
          sessionStorage.setItem("Uid", res.data.data.User.Uid);
          sessionStorage.setItem("Appid", res.data.data.User.Appid);
          sessionStorage.setItem("Username", res.data.data.User.Username);
          if (!this.$store.state.teacher) {
            this.queryByIp();
          } else {
            if (res.data.data.User.Role == 8) {
              sessionStorage.setItem("roleName", "教员");
              this.$router.push("/Home");
            } else {
              this.$message.error("非教员用户禁止登录！");
            }
          }
        } else {
          this.$message.error(res.data.message || "用户名或密码错误！");
        }
      });
    },
    queryByIp() {
      let path = this.$path.user.queryById;
      let params = {
        id: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          sessionStorage.setItem("gid", res.data.data.groupId);
          sessionStorage.setItem("courseId", res.data.data.courseId);
          sessionStorage.setItem("roleId", res.data.data.roleId);
          sessionStorage.setItem("roleName", res.data.data.roleName);
          sessionStorage.setItem("courseType", res.data.data.courseType);
          sessionStorage.setItem("courseOldId", res.data.data.courseOldId);
          sessionStorage.setItem("xmlId", res.data.data.xmlId);
          sessionStorage.setItem("modeType", res.data.data.modeType);
          this.getTeacher();
          this.$router.push("/Home");
        } else {
          this.$message.error(res.data.message || "用户名或密码错误！");
        }
      });
    },
    queryBindXml() {
      let path = this.$path.xml.queryBindXml;
      this.$http.get(path).then((res) => {
        if (res.data.code == 0) {
          sessionStorage.setItem("xmlId", res.data.data.list[0].xmlId);
        }
      });
    },
    getTeacher() {
      let path = this.$path.group.getallmembers;
      let params = {
        sessionid: sessionStorage.getItem("sessionid"),
        gid: Number(sessionStorage.getItem("gid")),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          var userList = res.data.data;
          for (let i = 0; i < userList.length; i++) {
            if (sessionStorage.getItem("modeType") == "0") {
              console.log(userList[i].roleName);
              if (userList[i].roleName == "教员") {
                console.log("教员");
                sessionStorage.setItem("toUid", userList[i].Uid);
              }
            } else if (sessionStorage.getItem("modeType") == "1") {
              // debugger
              if (
                sessionStorage.getItem("roleName") == "营长" ||
                sessionStorage.getItem("roleName") == "副营长"
              ) {
                if (userList[i].roleName == "教员") {
                  sessionStorage.setItem("toUid", userList[i].Uid);
                }
              } else {
                if (userList[i].roleName == "营长") {
                  sessionStorage.setItem("toUid", userList[i].Uid);
                }
              }
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped>
#login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: url("../assets/images/login/bg.png");
}

.title,
.subtitle {
  margin-bottom: 50px;
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 4px;
}

.subtitle {
  font-size: 34px;
}

.login_box {
  padding: 30px;
  border-radius: 10px;
  display: flex;
  background-color: #fff;
  box-shadow: 0 0 10px #fff;
}

.login_box img {
  padding: 30px;
  padding-left: 0;
  width: 150px;
  height: 150px;
}

.login_box ul {
  padding: 0 30px;
  border-left: 1px dashed #ccc;
}

.login_box li {
  margin-top: 30px;
  display: flex;
}

.login_box li p {
  width: 90px;
  display: flex;
  align-items: center;
}
</style>