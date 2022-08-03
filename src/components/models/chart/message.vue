<template>
  <div id="message">
    <header>
      <div class="title">
        <img src="../../../assets/images/chart/message_header.png" alt="语音通讯" />
        <span style="margin-left: 5px">语音通讯</span>
      </div>
      <i class="el-icon-close" @click="$store.state.message_show = false"></i>
    </header>
    <div class="body_start" v-if="conversation_type">
      <img src="../../../assets/images/chart/conference.png" alt="" @click="conversation_type = false" />
    </div>
    <div class="body_conversation" v-else>
      <ul class="user_list">
        <li class="userItem" v-for="(item, index) in user_list" :key="index">
          <img :src="item.userImg" alt="" />
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <div class="user_self">
        <img src="../../../assets/images/user.png" alt="" />
        <p style="margin-top: 10px">飞行编队002</p>
        <p style="margin-top: 10px">00:02</p>
        <div style="margin-top: 10px">
          <el-button icon="el-icon-phone" type="danger" @click="conversation_type = true" size="mini"
            style="width: 100%">结束通话</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conversation_type: true,
      user_list: [
        {
          name: "指挥员",
          userImg: require("../../../assets/images/user.png"),
        },
        {
          name: "作战参谋",
          userImg: require("../../../assets/images/user.png"),
        },
        {
          name: "情报参谋",
          userImg: require("../../../assets/images/user.png"),
        },
        {
          name: "导航参谋",
          userImg: require("../../../assets/images/user.png"),
        },
        {
          name: "飞行编队001",
          userImg: require("../../../assets/images/user.png"),
        },
        {
          name: "飞行编队002",
          userImg: require("../../../assets/images/user.png"),
        },
      ],
    };
  },
  mounted() { },
  methods: {},
};
</script>

<style scoped>
#message {
  background-color: #ffffffcc;
  box-shadow: 0 0 10px rgb(89, 147, 255);
  width: 250px;
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(180deg,
      rgba(84, 142, 243, 0.3) 0%,
      rgba(11, 86, 217, 0) 100%);
}

header .title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: rgb(0, 110, 255);
  text-shadow: 0 0 3px rgb(0, 110, 255);
}

.body_conversation {
  padding: 10px;
}

.user_list {
  height: 200px;
  overflow: auto;
}

.userItem {
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 5px;
  color: #666;
}

.userItem:nth-child(even) {
  background-color: rgba(51, 116, 231, 0.11);
}

.userItem img {
  width: 20px;
  margin-right: 10px;
}

.user_self {
  font-size: 12px;
  margin-top: 10px;
}

.user_self img {
  width: 20px;
  border-radius: 10000px;
}

.body_start {
  padding: 80px 0;
}
</style>