<template>
  <div id="soket1">
    <!-- <input type="text" v-model="value" />
    <button @click="websocketOnOpen">发 送</button> -->
  </div>
</template>

<script>
// import Vue from "vue";

export default {
  data() {
    return {
      value: "",
      websocket: null,
      timeout: 1000, // 120000, //发送心跳，判断在线状态，两分钟一次
      timeoutObj: null, //心跳心跳倒计时
    };
  },
  created() {
    this.initWebSocket();
  },
  methods: {
    threadPoxi(agentData) {
      // 实际调用的方法
      //若是ws开启状态
      if (this.websocket.readyState === this.websocket.OPEN) {
        this.websocketSend(agentData);
      }
      // 若是 正在开启状态，则等待300毫秒
      else if (this.websocket.readyState === this.websocket.CONNECTING) {
        let that = this; //保存当前对象this
        setTimeout(function () {
          that.websocketSend(agentData);
        }, 300);
      }
      // 若未开启 ，则等待500毫秒
      else {
        this.initWebSocket();
        let that = this; //保存当前对象this
        setTimeout(function () {
          that.websocketSend(agentData);
        }, 500);
      }
    },
    initWebSocket() {
      //初始化weosocket
      //ws地址
      // const WS_URI = this.$url.WS_URI;
      const WS_URI = "ws://10.254.254.98:9078/ws";
      this.websocket = new WebSocket(WS_URI);
      this.websocket.onmessage = this.websocketOnMessage;
      this.websocket.onopen = this.websocketOnOpen;
      this.websocket.onerror = this.websocketOnError;
      this.websocket.onclose = this.websocketClose;
      // Vue.prototype.$websocket = this.websocket;
    },
    websocketOnOpen() {
      //连接建立之后执行send方法发送数据
      // var uuid = this.$store.state.user.id;
      //   var uuid = "111";
      // var uuid = this.$store.state.user.consultUid;
      // var agentData = '{"Type":101,"Appid":10,"From":' +
      //   uuid +
      //   ',"To":25550996977484320,"Connid":807202738667590,"ConnServerid":1000,"Gid":23059775386289363,"Text":"{\\"uid\\":' +
      //   uuid +
      //   ',\\"user\\":\\"xiaojiqun001\\",\\"passwd\\":\\"bd_agent_27\\",\\"key\\":\\"\\",\\"platform\\":2,\\"lastmsgid\\":0}","Time":1463035119,"Msgid":1,"Platform":2,"Payload":null,"Options":{"TimeLive":0,"StartTime":0,"ApnsProduction":false,"Command":null}}';
      var uuid = 67333476503552;
      var agentData =
        '{"Type":101,"Appid":' +
        sessionStorage.getItem("Appid") +
        ',"From":' +
        uuid +
        ',"To":25550996977484320,"Connid":807202738667590,"ConnServerid":1000,"Gid":23059775386289363,"Text":"{\\"uid\\":' +
        uuid +
        ',\\"user\\":\\"xiaojiqun001\\",\\"passwd\\":\\"bd_agent_10\\",\\"key\\":\\"\\",\\"platform\\":2,\\"lastmsgid\\":0}","Time":1463035119,"Msgid":1,"Platform":2,"Payload":null,"Options":{"TimeLive":0,"StartTime":0,"ApnsProduction":false,"Command":null}}';
      //this.websocketSend(agentData);
      this.threadPoxi(agentData);
    },
    websocketOnError() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketOnMessage(e) {
      // 数据接收
      // UserMsgTypeMT_USER_NONE                = 100 //未知
      // UserMsgTypeMT_USER_LOGIN_REQ           = 101 //请求登录
      // UserMsgTypeMT_USER_LOGIN_REP           = 102 //登录返回
      // UserMsgTypeMT_USER_LOGIN_FAILED_REP    = 103 //登录失败返回
      // UserMsgTypeMT_USER_LOGOUT_REQ          = 104 //退出登录请求
      // UserMsgTypeMT_USER_LOGOUT_REP          = 105 //退出登录返回
      // UserMsgTypeMT_USER_KICKUSER            = 106 //踢人
      // UserMsgTypeMT_USER_FRIEND_USERINFO_REQ = 107 //用户好友查询请求
      // UserMsgTypeMT_USER_FRIEND_USERINFO_REP = 108 //用户好友查询返回
      // UserMsgTypeMT_USER_FRIEND_ADD          = 109 //添加好友
      // UserMsgTypeMT_USER_FRIEND_DEL          = 110 //删除好友A
      // UserMsgTypeMT_USER_FRIEND_FORBIDEN     = 111 //好友禁止
      // UserMsgTypeMT_USER_FRIEND_UNFORBIDEN   = 112 //好友解禁
      // UserMsgTypeMT_USER_END                 = 199 //用户类型订阅范围100-199
      const data = JSON.parse(e.data);
      // console.log(data, "dataaaaaaaaaaaaaaaa");
      if (data.Text == "startCH") {
        this.$emit("receiveData", data);
      }

      if (data.Type == 102) {
        // console.log("接收数据,WebSocket连接成功！----login ok ");
      }
      if (data.Type == 1) {
        //单聊
        // let textData = JSON.parse(data.Text);
        if (textData) {
          if (textData.Type == 2) {
            // 4g通讯接受消息
            this.$emit("receiveData", data);
          } else if (textData.Type == 10) {
            //  推送路线
            this.$eventBus.$emit("RecordTrackPromise", textData);
          }
        }
      } else if (data.Type == 2) {
        //群聊
        let textData = JSON.parse(data.Text);
        if (textData) {
          if (textData.Type == 2) {
            // 4g通讯接受消息
            this.$emit("receiveData", data);
          }
        }
      } else if (data.Type == 10) {
        // 位置上报
        let pointData = JSON.parse(data.Text);
        if (pointData.Type == 1) {
          this.$eventBus.$emit("addPointBus", pointData.Data);
          this.$eventBus.$emit("updateOnlineOfflineStatus", pointData.Data.uid);
        }
        // 群组列表有变动 刷新任务列表
      } else if (data.Type == 5) {
        this.$eventBus.$emit("refreshTaskList", data);
      } else if (data.Type == 106) {
        this.$confirm("您已经被迫下线！", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning",
        })
          .then(() => {
            sessionStorage.setItem("userInfo", null);
            sessionStorage.clear();
            this.$router.push({
              path: "/", // 到登录页重新获取token
            });
          })
          .catch(() => {
            sessionStorage.setItem("userInfo", null);
            sessionStorage.clear();
            this.$router.push({
              path: "/", // 到登录页重新获取token
            });
          });
      } else if (data.Type == 4) {
        //删除好友 好友验证 解散任务群组
        let textData = JSON.parse(data.Text);
        if (textData) {
          // 306解散任务群组
          // 307 被踢出群聊
          // 303 被邀请进入群聊或者建群
          // 115 被删除好友
          // 113 被申请为好友
          // 114 对方同意好友申请
          if (
            textData.Type == 306 ||
            textData.Type == 307 ||
            textData.Type == 303
          ) {
            // 解散任务群组
            this.$eventBus.$emit("refreshTaskList", data);
          } else {
            this.$eventBus.$emit("refreshUserList", data);
          }
        }
      }
    },
    websocketSend(agentData) {
      //数据发送
      if (window["WebSocket"]) {
        // console.log("发送消息：", agentData);
        this.websocket.send(agentData);
        // this.heartbeatStart();
      } else {
        this.$message({
          type: "error",
          message: "Your browser does not support WebSockets！",
        });
      }
    },
    websocketClose(e) {
      //关闭
      if (this.websocket) {
        this.websocket.close();
      }
      if (e) {
        this.websocket = null;
        this.timeoutObj && clearInterval(this.timeoutObj);
      }
    },
    heartbeatStart() {
      //开启心跳
      var that = this;
      if (that.timeoutObj) {
        clearInterval(that.timeoutObj);
      }
      that.timeoutObj = setInterval(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (that.websocket.readyState == 1) {
          //如果连接正常
          var loginfo = '{"Type":401}';
          // console.log(loginfo);
          that.websocket.send(loginfo);
        } else {
          //否则重连
          that.websocketOnOpen();
        }
      }, that.timeout);
    },
  },
  beforeDestroy() {
    this.websocketClose();
  },
};
</script>
<style scoped>
#soket1 {
  position: absolute;
  left: 350px;
  top: 300px;
  z-index: 10;
}
</style>
