<template>
  <div id="sendingAndReceivingOfDocuments">
    <header>
      <span>文书收发</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <div class="content">
      <ul class="userList_box">
        <li class="userItem" v-for="(item, index) in userList" :key="index" @click="selectUser(item, index)"
          :class="s_userList == index ? 'shadow' : ''">
          <img src="../assets/images/user.png" />
          <div :style="s_userList == index ? 'border-color:#fff0' : ''">
            <p>{{ item.Username }}{{ item.Uid == self_uid ? "(自己)" : "" }}</p>
          </div>
        </li>
      </ul>
      <div class="documentList_box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="收件箱" name="first">
            <el-table :data="accept_tableData" size="mini" height="250px" width="600px" highlight-current-row
              @row-click="getRowData">
              <el-table-column prop="sendUsername" label="发件人" width="100" align="center"></el-table-column>
              <el-table-column prop="documentName" label="邮件名称" align="center">
              </el-table-column>
              <el-table-column prop="sendTime" label="发送时间" width="150" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center" v-if="false">
                <template slot-scope="scope">
                  <el-button @click="insert(scope.$index)" type="text" size="mini">查看</el-button>
                  <el-button @click="remove(scope.$index)" type="text" size="mini" style="color: #f00">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="发件箱" name="second">
            <el-table :data="send_tableData" size="mini" height="250px" width="600px" highlight-current-row>
              <el-table-column prop="reciveUsername" label="收件人" width="100" align="center"></el-table-column>
              <el-table-column prop="documentName" label="邮件名称" align="center">
              </el-table-column>
              <el-table-column prop="sendTime" label="发送时间" width="150" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center" v-if="false">
                <template slot-scope="scope">
                  <el-button @click="insert(scope.$index)" type="text" size="mini">查看</el-button>
                  <el-button @click="remove(scope.$index)" type="text" size="mini" style="color: #f00">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <footer>
          <el-button type="primary" size="mini" @click="createDocument">新建文书</el-button>
          <el-button type="primary" size="mini" @click="openDocument">打开文书</el-button>
          <el-button type="danger" size="mini" @click="removeDocument">删除文书</el-button>
          <el-button type="primary" size="mini" @click="sendnDocument">发送文书</el-button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      self_uid: sessionStorage.getItem("Uid"),
      s_userList: -1,
      userList: [
        { Username: "xiexiaoyu", Uid: "123456" },
        { Username: "xiexiaoyuyu", Uid: "654321" },
      ],
      activeName: "first",
      accept_tableData: [],
      send_tableData: [],
    };
  },
  mounted() {
    this.acceptRecord();
    this.sendRecord();
  },
  methods: {
    close() {
      this.$store.state.sendingAndReceivingOfDocuments_show = false;
    },
    selectUser(item, index) {
      this.to_Uid = item.Uid;
      this.s_userList = index;
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    getRowData(row) {
      // console.log(row);
      this.selectDocumentId = row.id;
    },
    createDocument() {
      this.$store.state.documentation_show = true;
    },
    openDocument() {
      let path = this.$path.document.openDocumentTemplate;
      let params = {
        documentId: this.selectDocumentId,
        type: "1",
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$store.state.documentContent = res.data.data;
          this.$store.state.documentation_show = true;
        }
      });
    },
    acceptRecord() {
      let path = this.$path.document.acceptRecord;
      let params = {
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.accept_tableData = res.data.data;
        }
      });
    },
    sendRecord() {
      let path = this.$path.document.sendRecord;
      let params = {
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.send_tableData = res.data.data;
        }
      });
    },
    sendnDocument() { },
    removeDocument() { },
  },
};
</script>

<style scoped>
#sendingAndReceivingOfDocuments {
  background-color: #fff;
  height: 400px;
  width: 700px;
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  margin-left: -300px;
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

header i {
  cursor: pointer;
}

.content {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  height: calc(100% - 36px - 20px);
}

.userList_box {
  padding-right: 10px;
  border: 1px solid #ccc;
  height: 100%;
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

.documentList_box {
  padding-left: 10px;
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.documentList_box footer {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>