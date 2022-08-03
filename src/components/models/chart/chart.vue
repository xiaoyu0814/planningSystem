<template>
  <div id="chart">
    <header>
      <div class="title">
        <img src="../../../assets/images/chart/chart_header.png" alt="自由电文" width="15" />
        <span style="margin-left: 5px">自由文电</span>
      </div>
      <i class="el-icon-close" @click="$store.state.chart_show = false"></i>
    </header>
    <div class="search_box">
      <div>
        <!-- <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="search_value"
          size="mini"
          style="width: 200px"
        >
        </el-input> -->
      </div>
      <ul>
        <li v-for="(item, index) in s_chartType" :key="index" @click="select_chartType(item, index)">
          <img :src="s_chartType_index === index ? item.s_img : item.img" />
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="content_type" v-show="s_chartType_index === 0">
        <ul class="userlist">
          <li class="userItem" v-for="(item, index) in userList" :key="index" @click="selectUser(item, index)"
            :class="s_userList == index ? 'shadow' : ''">
            <img src="../../../assets/images/user.png" />
            <div :style="s_userList == index ? 'border-color:#fff0' : ''">
              <p>
                {{ item.chinaName }}{{ item.Uid == self_uid ? "(自己)" : "" }}
              </p>
              <!-- <p>
                <span>{{ item.text }}</span>
                <span>{{ item.time }}</span>
              </p> -->
            </div>
          </li>
        </ul>
        <div class="chart_box">
          <div class="header"></div>
          <div class="content_text" ref="message_list">
            <ul v-show="historyMsgs_list.length != 0" v-for="(item, index) in historyMsgs_list" :key="index">
              <div v-if="item.content.json.text.indexOf('State') == -1">
                <li class="others" v-if="item.from != self_uid">
                  <div class="username">{{ item.Username }}</div>
                  <div class="row_style">
                    <img class="userImg" src="../../../assets/images/user.png" alt="" />
                    <div class="userText" v-html="item.content.json.text"></div>
                  </div>
                </li>
                <li class="self" v-else>
                  <div class="username">{{ item.Username }}</div>
                  <div class="row_style">
                    <div class="userText" v-html="item.content.json.text"></div>
                    <img class="userImg" src="../../../assets/images/user.png" alt="" />
                  </div>
                </li>
              </div>
            </ul>
          </div>
          <div class="content_foot">
            <ul>
              <!-- <li v-for="(item, index) in chartUtils" :key="index">
                <img :src="item.img" />
              </li> -->
              <li>
                <el-upload class="updata-demo" :action="uploadUrl" :on-success="successUpload" :show-file-list="false"
                  v-if="false">
                  <img src="../../../assets/images/chart/collection.png" />
                </el-upload>
              </li>
            </ul>

            <div>
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" resize="none">
              </el-input>
            </div>
            <div style="text-align: right; margin-top: 5px">
              <el-button @click="send" size="mini">发 送</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content_type" v-show="s_chartType_index === 1">
        <ul class="userlist">
          <li class="userItem" v-for="(item, index) in userList" :key="index"
            :class="s_userList == index ? 'shadow' : ''">
            <img src="../../../assets/images/user.png" />
            <div :style="s_userList == index ? 'border-color:#fff0' : ''">
              <p>
                {{ item.chinaName }}{{ item.Uid == self_uid ? "(自己)" : "" }}
              </p>
              <!-- <p>
                <span>{{ item.text }}</span>
                <span>{{ item.time }}</span>
              </p> -->
            </div>
          </li>
        </ul>
        <div class="chart_box">
          <div class="header"></div>
          <div class="content_text" ref="message_list_g">
            <ul v-show="historyMsgs_list.length != 0" v-for="(item, index) in historyMsgs_list" :key="index">
              <div v-if="item.content.json.text.indexOf('State') == -1">
                <li class="others" v-if="item.from != self_uid">
                  <div class="username">{{ item.Username }}</div>
                  <div class="row_style">
                    <img class="userImg" src="../../../assets/images/user.png" alt="" />
                    <div class="userText" v-html="item.content.json.text"></div>
                  </div>
                </li>
                <li class="self" v-else>
                  <div class="username">{{ item.Username }}</div>
                  <div class="row_style">
                    <div class="userText" v-html="item.content.json.text"></div>
                    <img class="userImg" src="../../../assets/images/user.png" alt="" />
                  </div>
                </li>
              </div>
            </ul>
          </div>
          <div class="content_foot">
            <ul>
              <!-- <li
                v-for="(item, index) in chartUtils"
                :key="index"
                @click="Utils_fun"
              >
                <img :src="item.img" />
              </li> -->

              <li>
                <el-upload class="updata-demo" :action="uploadUrl" :on-success="successUpload" :show-file-list="false"
                  v-if="false">
                  <img src="../../../assets/images/chart/collection.png" />
                </el-upload>
              </li>
            </ul>
            <div>
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" resize="none">
              </el-input>
            </div>
            <div style="text-align: right; margin-top: 5px">
              <el-button @click="send" size="mini">发 送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <soket @receiveData="getMessage" v-if="!$store.state.teacher" />
  </div>
</template>

<script>
import soket from "@/components/soket"; // 定位
export default {
  components: {
    soket,
  },
  data() {
    return {
      self_uid: sessionStorage.getItem("Uid"),
      to_Uid: "",
      select_to_Uid: "",
      get_from_uid: "",
      search_value: "",
      s_chartType_index: 0,
      s_chartType: [
        {
          name: "chart",
          img: require("../../../assets/images/chart/chart.png"),
          s_img: require("../../../assets/images/chart/chart_s.png"),
        },
        {
          name: "charts",
          img: require("../../../assets/images/chart/charts.png"),
          s_img: require("../../../assets/images/chart/charts_s.png"),
        },
      ],
      s_userList: -1,
      userList: [],
      chartUtils: [
        {
          name: "updata",
          img: require("../../../assets/images/chart/collection.png"),
        },
        {
          name: "plane",
          img: require("../../../assets/images/chart/plane.png"),
        },
        {
          name: "ship",
          img: require("../../../assets/images/chart/ship.png"),
        },
      ],
      textarea: "",
      historyMsgs_list: [],
      send_type: 1,
      uploadUrl: this.$path.chart_file.upload,
    };
  },
  mounted() {
    setTimeout(() => {
      console.log("获取历史记录");
      this.getGroupInfo(Number(sessionStorage.getItem("gid")));
      // this.getUploadUrl();
    }, 100);
    if (!this.$store.state.teacher) {
      this.send_DK();
      this.$store.state.login_interval = window.setInterval(() => {
        this.send_DK();
      }, 60000);
    }
  },
  updated() {
    let listContainer = this.$refs["message_list"];
    listContainer.scrollTop = listContainer.scrollHeight;
    let listContainer_g = this.$refs["message_list_g"];
    listContainer_g.scrollTop = listContainer_g.scrollHeight;
  },
  methods: {
    selectUser(item, index) {
      this.select_to_Uid = item.Uid;
      this.getHistoryMsgs([Number(this.self_uid), item.Uid], 1);
      this.s_userList = index;
    },
    select_chartType(item, index) {
      this.s_chartType_index = index;
      if (index == 0) {
        this.send_type = 1;
        this.to_Uid = this.select_to_Uid;
        this.getHistoryMsgs([Number(this.self_uid), Number(this.to_Uid)], 1);
      } else {
        this.send_type = 2;
        this.to_Uid = parseInt(sessionStorage.getItem("gid"));
        this.getHistoryMsgs([parseInt(sessionStorage.getItem("gid"))], 4);
      }
    },
    send() {
      let json = {
        text: this.textarea,
        contentType: 3,
      };
      let json_to_STR = JSON.stringify(json);
      let content = {
        fromName: "3001",
        json: json_to_STR,
        toName: "13008",
      };
      let content_to_str = JSON.stringify(content);
      let path = this.$path.message.directsendmsg + `?type=5`;
      let params = {
        appid: Number(sessionStorage.getItem("Appid")),
        from: Number(sessionStorage.getItem("Uid")),
        content: content_to_str,
        tag: "1",
        time: parseInt(Number(new Date()) / 1000),
        to: Number(this.to_Uid),
        tos: null,
        type: 2 // Number(this.send_type),
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
          // console.log(msg);
          this.historyMsgs_list.push(msg);
          this.textarea = "";
        }
      });
    },
    send_DK() {
      let json_DK = {
        Uid: sessionStorage.getItem("Uid"),
        Ip: "10.254.247.205",
        Username: sessionStorage.getItem("Username"),
        Role: sessionStorage.getItem("roleName"),
        Groupid: sessionStorage.getItem("gid"),
        State: 0,
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
    getMessage(res) {
      let text = JSON.parse(res.Text);
      text.content = JSON.parse(text.Data);
      text.content.json = JSON.parse(text.content.json);
      for (let i = 0; i < this.userList.length; i++) {
        if (this.userList[i].Uid == res.From) {
          text.Username = this.userList[i].Username;
        }
      }
      this.historyMsgs_list.push(text);
    },
    getHistoryMsgs(ids, type) {
      let path =
        this.$path.message.gethistorymsgs +
        `?sessionid=${sessionStorage.getItem("sessionid")}`;
      let params = {
        gids: ids,
        limit: 10000,
        type: type, // 1:单聊; 4:群聊;
        uids: ids,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.historyMsgs_list = [];
          for (let i = 0; i < res.data.data.length; i++) {
            // console.log(res.data.data[i].type);
            if (res.data.data[i].type != 5) {
              res.data.data[i].content = JSON.parse(res.data.data[i].content);
              if (res.data.data[i].content.json) {
                res.data.data[i].content.json = JSON.parse(
                  res.data.data[i].content.json
                );
                this.historyMsgs_list.unshift(res.data.data[i]);
              }
            }
            for (let j = 0; j < this.userList.length; j++) {
              if (this.userList[j].Uid == res.data.data[i].from) {
                res.data.data[i].Username = this.userList[j].Username;
              }
            }
          }
        }
      });
    },
    getGroupInfo(gid) {
      let path = this.$path.group.getallmembers;
      let params = {
        sessionid: sessionStorage.getItem("sessionid"),
        gid: Number(gid),
      };
      this.$http.get(path, params).then((res) => {
        // console.log(res);
        if (res.data.code == 0) {
          this.userList = res.data.data;
          this.select_to_Uid =
            this.userList[0].Uid == this.self_uid
              ? this.userList[1].Uid
              : this.userList[0].Uid;
          this.to_Uid = this.select_to_Uid;
          this.getHistoryMsgs([Number(this.self_uid), Number(this.to_Uid)], 1);
          // for (let i = 0; i < this.historyMsgs_list.length; i++) {
          //   for (let j = 0; j < this.userList.length; j++) {
          //     if (this.historyMsgs_list[i].from == this.userList[j].Uid) {
          //       this.historyMsgs_list[i].Username = this.userList[j].Username;
          //     }
          //   }
          // }
        }
      });
    },
    getUploadUrl() {
      let path = "http://127.0.0.1:8088/dir/assign";
      this.$http.get(path, {}).then((res) => {
        if (res.data.code == 0) {
          if (res.data.publicUrl.indexOf("9001") != -1) {
            this.uploadUrl = "http://127.0.0.1:8088/upload_a/";
          } else {
            this.uploadUrl = "http://127.0.0.1:8088/upload_b/";
          }

          this.uploadUrl += res.data.fid;
          // console.log(this.uploadUrl);
        }
      });
    },
    successUpload(res) {
      if (res.message == "success") {
        this.textarea = `<a href="${res.data.fileUrl}?response-conent=application/octet-stream" download target="view_window" >${res.data.fileName}</a>`;
        this.send();
      } else {
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }

      // this.getUploadUrl()
    },
  },
};
</script>

<style scoped>
#chart {
  background-color: #ffffffcc;
  box-shadow: 0 0 10px rgb(89, 147, 255);
  width: 500px;
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header .title {
  display: flex;
  align-items: center;
  font-size: 14px;
  /* color: rgb(0, 110, 255); */
  text-shadow: 0 0 3px rgb(0, 110, 255);
}

.search_box {
  background-color: #0a53d02d;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search_box ul {
  width: 50%;
  display: flex;
  justify-content: space-evenly;
}

.content {
  height: 430px;
}

.userlist {
  width: 150px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userItem {
  padding: 0 5px;
  display: flex;
  align-items: center;
  font-size: 12px;
  width: 90%;
}

.userItem img {
  width: 30px;
  height: 30px;
  margin: 5px;
  border-radius: 10000;
}

.userItem div {
  padding: 10px 0;
  flex-grow: 1;
  border-bottom: 1px dashed #ccc;
}

.userItem:list-child div {
  border: none;
}

.userItem div p {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

.shadow {
  box-shadow: 0 2px 4px 0 #ccddf9;
}

.userlist::-webkit-scrollbar {
  width: 0 !important;
}

.chart_box {
  position: relative;
}

.content_type {
  height: 100%;
  display: flex;
}

.chart_box {
  height: 100%;
  flex-grow: 1;
  margin: 2px;
}

.chart_box .header {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  text-align: left;
  font-size: 14px;
  padding: 5px;
  background-image: linear-gradient(180deg,
      rgba(84, 142, 243, 0.3) 0%,
      rgba(11, 86, 217, 0) 100%);
}

.chart_box .content_text {
  position: absolute;
  bottom: 120px;
  top: 0;
  width: calc(100% - 20px);
  padding: 10px;
  overflow: auto;
}

.chart_box .content_foot {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  border-top: 1px solid #ccc;
}

.chart_box .content_foot ul {
  display: flex;
  padding: 5px;
}

.chart_box .content_foot ul li {
  margin-left: 10px;
  cursor: pointer;
}

.others {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
}

.self {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
}

.username {
  margin: 0 10px;
  font-size: 12px;
}

.userImg {
  width: 30px;
  margin: 10px;
  border-radius: 100000px;
}

.row_style {
  display: flex;
  align-items: flex-start;
}

.userText {
  margin-top: 8px;
  padding: 10px;
  background-color: #fffef8;
  border-radius: 5px;
  font-size: 12px;
  max-width: 120px;
  word-wrap: break-word;
  border: 1px solid;
  text-align: left;
}
</style>