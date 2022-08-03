<template>
  <div id="check">
    <ul>
      <li class="title" v-if="visibe">
        <div style="">
          <span>查询条件：</span>
          <el-select
            v-model="search_key"
            placeholder="请选择"
            size="mini"
            style="width: 50%"
            @change="searchChange"
          >
            <el-option
              v-for="item in search_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <br />
        <span>关键字：</span>
        <el-input
          v-model="search_value"
          style="width: 60%"
          size="mini"
          @input="getDocumentList"
        ></el-input>
      </li>
      <li class="title" v-if="$store.state.teacher">想定文件</li>
      <li class="title" v-else>历史文档</li>
      <li class="historyDocument_title">
        <span>名称</span>
        <span v-if="!$store.state.teacher">发送者</span>
      </li>
      <el-scrollbar
        class="aaa"
        :style="
          $store.state.teacher
            ? { height: 'calc(100% - 80px)' }
            : { height: 'calc(100% - 170px)' }
        "
      >
        <li
          v-for="(item, index) in list"
          :key="index"
          @mouseenter="list_index = index"
          @mouseleave="list_index = -1"
          :class="list_index === index ? 'select' : ''"
          @click="showDocument(item)"
          class="historyDocument"
        >
          <span
            :title="item.documentName"
            :style="{
              width: $store.state.teacher ? 'auto' : '100px',
              overflow: 'hidden',
              'text-overflow': 'ellipsis',
              'white-space': 'nowrap',
            }"
          >
            {{ $store.state.teacher ? item.name : item.documentName }}
          </span>
          <span
            v-if="!$store.state.teacher"
            :title="item.sendUsername"
            style="
              width: 100px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ $store.state.teacher ? "" : item.sendUsername }}
          </span>
        </li>
      </el-scrollbar>
    </ul>
    <ul v-show="children_show">
      <li class="title">相关文档</li>
      <el-scrollbar v-if="children_list.length > 0">
        <li
          v-for="(item, index) in children_list"
          :key="index"
          @mouseenter="children_list_index = index"
          @mouseleave="children_list_index = -1"
          :class="children_list_index === index ? 'select' : ''"
          @click="showChildrenDocument(item)"
          style="margin-left: 10px; cursor: pointer; padding: 10px"
        >
          {{ item.documentName }}
        </li>
      </el-scrollbar>
      <li v-else style="margin-left: 10px">无相关文档</li>
    </ul>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
export default {
  data() {
    return {
      list_index: -1,
      list: [],
      children_show: false,
      children_list: [],
      children_list_index: -1,
      search_value: "",
      search_key: "documentname",
      search_list: [
        {
          label: "文件名",
          value: "documentname",
        },
        {
          label: "发送人",
          value: "sendname",
        },
        {
          label: "时间",
          value: "stime",
        },
      ],
      visibe: false,
    };
  },
  mounted() {
    if (!this.$store.state.teacher) {
      this.visibe = true;
    } else {
      this.visibe = false;
    }
    this.getList();
  },
  methods: {
    getDocumentList() {
      if (this.search_value == "") {
        this.getList();
        return;
      }
      let path = this.$path.document.viewFileByCondition;
      let params = {
        documentname: "",
        sendname: "",
        stime: "",
        etime: "",
        userId: sessionStorage.getItem("Uid"),
      };
      if (this.search_key == "stime") {
        params[this.search_key] = this.search_value;
        params.etime = this.plusOneDay(this.search_value);
      } else {
        params[this.search_key] = this.search_value;
      }

      this.$http.get(path, params).then((res) => {
        if (res.status == 200) {
          this.list = res.data.data;
        }
      });
    },
    plusOneDay(time) {
      let date = Number(new Date(time)) + 86400000;
      let newTime = new Date(date);
      var year = newTime.getFullYear();
      var month =
        newTime.getMonth() + 1 < 10
          ? "0" + (newTime.getMonth() + 1)
          : newTime.getMonth() + 1;
      var day = newTime.getDate();
      return year + "-" + month + "-" + day;
    },
    getList() {
      let path;
      let params;
      if (this.$store.state.teacher) {
        path = this.$path.xml.queryAllTFile;
        params = { creator: sessionStorage.getItem("Uid") };
      } else {
        path = this.$path.document.viewFileInfo;
        params = {
          userId: sessionStorage.getItem("Uid"),
        };
      }
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          if (this.$store.state.teacher) {
            this.list = res.data.data.list;
          } else {
            this.list = res.data.data;
          }
        }
      });
    },
    showDocument(item) {
      console.log(115599);
      let path;
      let params;
      if (this.$store.state.teacher) {
        path = this.$path.document.getTDocumentByXmlId;
        params = {
          xmlId: item.id,
        };
        if (this.$store.state.teacherXmlId == item.id) {
        } else {
          this.$http.get(this.$path.xml.downloadTFile, params).then((res) => {
            if (res.data.code == 1) {
              this.$message.error(res.data.message);
            } else {
              this.$store.state.teacherXmlId = item.id;
              this.$map.map.clear();
              // CGFListLoad.get(res.data);
              // this.$store.state.CGFListData = CGFListLoad.datamodel.vecNodes;
              let datamodel = CGFListLoad.get(
                res.data,
                this.$store.state.XDType
              );
              this.$store.state.CGFListData = CGFListLoad.datamodel.vecNodes;
              this.$store.state.CGFEditListData = [
                datamodel.GetRootCGFEntity(1),
              ];
              // let newsList = CGFListLoad.datamodel.newsNodes.list;
              // let newsCGF = [];
              // for (let i = 0; i < newsList.length; i++) {

              //   const element = newsList[i];
              //   const cgf = datamodel.getCGFEntityById(element);
              //   newsCGF.push(cgf);
              //   CGFListLoad.updateSideLayer(cgf);
              //   // this.$store.state.CGFReadListData[0].chiledren.push(cgf);
              // }
              // this.$store.state.CGFReadListData = newsCGF;
            }
          });
        }
      } else {
        // console.log(item)
        // debugger
        if (item.sendType == 1) {
          this.showChildrenDocument(item);
          return;
        } else {
          path = this.$path.document.readFileByPath;
          params = {
            path: item.path,
          };
        }
      }
      console.log(112233);
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          if (this.$store.state.teacher) {
            this.children_list = res.data.data;
            this.children_show = true;
          } else {
            this.$store.state.documentContent = res.data.data;
            this.$store.state.documentation_fromList = true;
            this.$store.state.documentation_show = true;
            console.log(this.$store.state.documentation_fromList);
          }
        }
      });
    },
    showChildrenDocument(item) {
      let path = this.$path.document.readWordOfTeacher;
      let params = {
        path: item.path,
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          sessionStorage.setItem("documentId", item.id);
          this.$store.state.documentContent = res.data.data;
          this.$store.state.documentation_fromList = true;
          this.$store.state.documentation_show = true;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
    searchChange() {
      if (this.search_key == "stime") {
        this.search_value = "2020-01-01";
      } else {
        this.search_value = "";
      }
    },
  },
};
</script>

<style scoped>
#check {
  height: 400px;
  /* border: 1px solid rgb(0, 60, 255); */

  display: flex;
}

ul {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  overflow-y: auto;
  padding: 5px;
  margin-right: 10px;
}

#check > ul > li {
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

.select {
  background-color: #2593ffaa;
  color: rgb(0, 60, 255);
}

.title {
  font-weight: bold;
}

#app #check .el-scrollbar {
  height: calc(100% - 40px);
}

.historyDocument_title {
  display: flex;
  justify-content: space-around;
}

.historyDocument {
  padding: 10px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
</style>