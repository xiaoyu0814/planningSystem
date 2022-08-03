<template>
  <div id="documentation" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>文书拟制</span>
      <i class="el-icon-close" @click="$store.state.documentation_show = false"></i>
    </header>
    <div class="utils">
      <div>
        <span>选择模板：</span>
        <el-select v-model="value" placeholder="请选择" size="mini" @change="changeDocument">
          <el-option v-for="item in options" :key="item.id" :label="item.documentName" :value="item.id">
          </el-option>
        </el-select>
        <span style="margin-left: 20px">草稿列表：</span>
        <el-select v-model="keptToSentRecord_value" placeholder="请选择" size="mini" @change="changeDocument_kept">
          <el-option v-for="item in keptToSentRecord_list" :key="item.id" :label="item.documentName" :value="item.id">
          </el-option>
        </el-select>
        <el-button size="mini" style="margin-left: 10px" v-if="false">
          新建
        </el-button>
      </div>
      <div>
        <el-button type="danger" size="mini" @click="removeDialog = true">
          删除
        </el-button>
        <el-button type="primary" size="mini" @click="openDailog(1)">
          发送
        </el-button>
        <el-button type="primary" size="mini" @click="openDailog(4)">
          更新
        </el-button>
        <el-button size="mini" @click="openDailog(2)">保存待发</el-button>
        <el-button size="mini" @click="openDailog(3)">存为模板</el-button>
      </div>
    </div>
    <div v-loading="spinShow" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 1000px; margin: 20px">
      <vue-tinymce id="tinymce" v-model="content" :setup="setup" :setting="setting" />
    </div>
    <el-dialog title="提示
      " :visible.sync="changeEntity_show" width="300px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>文档名称：</span>
          <el-input v-model="documentName" size="mini" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeEntity_show = false">取 消</el-button>
        <el-button type="primary" @click="selectSend">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="removeDialog" width="300px" append-to-body>
      <span>确认删除当前文档吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeDialog = false">取 消</el-button>
        <el-button type="primary" @click="removeWord">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      value: "",
      options: [],
      spinShow: true,
      content: this.$store.state.documentContent,
      changeEntity_show: false,
      documentName: "",
      keptToSentRecord_value: "",
      keptToSentRecord_list: [],
      saveType: "",
      removeDialog: false,
      setting: {
        statusbar: false, // 隐藏底部状态栏
        branding: false,
        elementpath: false,
        height: 350,
        language: "zh_CN.GB2312",
        menubar: "edit insert view format table tools",
        plugins: [
          "advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools",
          "searchreplace visualblocks visualchars code fullpage",
          "insertdatetime media nonbreaking save table contextmenu directionality",
          "emoticons paste textcolor colorpicker textpattern imagetools codesample",
        ],
        toolbar:
          "undo redo | fontselect fontsizeselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image emoticons media codesample",
        autosave_interval: "20s",
        fontsize_formats: "初号=56px 小初=48px 一号=34px 小一=32px 二号=29px 小二=24px 三号=21px 小三=20px 四号=18px 小四=16px 五号=14px 小五=12px 六号=10px",
        font_formats: "宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;楷体=KaiTi",
        content_style: "body {font-size:21px;font-family:simsun,serif;}",
        // image_advtab: true,
        table_default_styles: {
          width: "100%",
          height: "100%",
          borderCollapse: "collapse",
        },
        // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
        images_upload_handler: (blobInfo, success, failure) => {
          // let formdata = new FormData();
          // formdata.append("file", blobInfo.blob());
          // 上传图片接口，跟后端同事协调上传图片
          // http://hh.xxxx.cn/admin/upload为上传图片接口
          let path = this.$path.document.uploadPic;
          let params = {
            file: blobInfo.blob(),
          };
          this.$http
            .form(path, params)
            .then((res) => {
              success(res.data);
            })
            .catch((res) => {
              failure("error");
            });
        },
      },
      editorModel: {
        content: "dfsd",
      },
      content2: "sdds",
      editorRules: {
        content: [
          {
            type: "string",
            min: 5,
            message: "the username size shall be no less than 5 chars ",
            trigger: "blur",
          },
        ],
      },
      customEditor: null,
    };
  },
  mounted() {
    console.log(this.$store.state.documentation_fromList)
    if (!this.$store.state.documentation_fromList) {
      this.getTemplateList();
    }
    this.keptToSentRecord();
  },
  destroyed() {
    this.$store.state.documentContent = "";
    this.$store.state.documentation_fromList = false;
  },
  methods: {
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      console.log(event);
      console.log(event.target);
      if (event.target.localName == "input") {
        return;
      }
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
    setup(editor) {
      // 富文本编辑器设置
      let self = this;
      editor.on("init", function (e) {
        self.spinShow = false;
        if (localStorage.editorContent) {
          tinymce.get("tinymce").setContent(localStorage.editorContent);
        }
      });
    },
    openDailog(value) {
      // 添加文件名弹窗
      this.changeEntity_show = true;
      this.saveType = value;
    },
    selectSend() {
      // 1:直接发送；2:保存草稿；3：保存模板；
      if (this.saveType == "2") {
        this.sendKept();
      } else if (this.saveType == "3") {
        this.saveToTemplate();
      } else {
        this.sendWord(this.saveType);
      }
    },
    getTemplateList() {
      // 获取模板列表
      let path = this.$path.document.templateList;
      let params = {
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.options = res.data.data;
          if (this.$store.state.documentation_name != "") {
            for (let i = 0; i < this.options.length; i++) {
              if (
                this.$store.state.documentation_name == "拟制工作计划" &&
                this.options[i].documentName == "战斗准备阶段工作计划"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "敌情分析" &&
                this.options[i].documentName == "敌情分析判断情况"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "我情分析" &&
                this.options[i].documentName == "我情分析判断情况"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "环境分析" &&
                this.options[i].documentName == "环境分析判断情况"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "综合分析" &&
                this.options[i].documentName == "综合分析判断情况"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "生成战斗命令" &&
                this.options[i].documentName == "战斗命令"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "战斗决心" &&
                this.options[i].documentName == "战斗决心"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "协同计划" &&
                this.options[i].documentName == "协同动作计划"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              } else if (
                this.$store.state.documentation_name == "分支计划" &&
                this.options[i].documentName == "战斗分支计划"
              ) {
                this.value = this.options[i].id;
                this.changeDocument(this.options[i].id);
              }
            }
          }
        }
      });
    },
    keptToSentRecord() {
      // 获取草稿列表
      let path = this.$path.document.keptToSentRecord;
      let params = {
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.keptToSentRecord_list = res.data.data;
        }
      });
    },
    changeDocument(value) {
      // 切换模板列表展示内容
      this.removeType = "1";
      this.keptToSentRecord_value = "";
      let path = this.$path.document.openDocumentTemplate;
      let params = {
        userId: sessionStorage.getItem("Uid"),
        documentId: value,
        type: "1",
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.content = res.data.data;
        } else {
          this.$message.error(res.data.message || "加载失败");
        }
      });
    },
    changeDocument_kept(value) {
      // 切换草稿列表展示内容
      this.removeType = "2";
      this.value = "";
      let path = this.$path.document.openDocumentTemplate;
      let params = {
        userId: sessionStorage.getItem("Uid"),
        documentId: value,
        type: "2",
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.content = res.data.data;
        } else {
          this.$message.error(res.data.message || "加载失败");
        }
      });
    },
    sendWord(type) {
      // 直接发送
      let path;
      let params;
      if (this.$store.state.teacher) {
        path =
          this.$path.document.sendTeacherDocument +
          `?rootId=${sessionStorage.getItem("Uid")}`;
        params = {
          content: this.content,
          xmlId: this.$store.state.teacherXmlId,
          name: this.documentName,
        };
        if (type == 4) {
          params.id = sessionStorage.getItem("documentId");
        }
      } else {
        path =
          this.$path.document.sendStudentDocument +
          `?rootId=${sessionStorage.getItem(
            "Uid"
          )}&receiveUid=${sessionStorage.getItem("toUid")}`;
        params = {
          childId: this.$store.state.progress_temp,
          content: this.content,
          name: this.documentName,
          course: sessionStorage.getItem("courseId"),
          txmlId: sessionStorage.getItem("xmlId"),
          sessionid: sessionStorage.getItem("sessionid"),
        };
      }

      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.data.message || "提交成功");
          this.$store.state.document_IdArray.push(res.data.data);
          this.content = "";
          this.value = "";
          this.documentName = '';
        } else {
          this.$message.error(res.data.message || "提交失败");
        }
      });
      this.changeEntity_show = false;
    },

    sendKept() {
      // 保存草稿
      let path =
        this.$path.document.saveToTemplate +
        `?userId=${Number(sessionStorage.getItem("Uid"))}&type=2`;
      let params = {
        content: this.content,
        course: sessionStorage.getItem("courseId")
          ? sessionStorage.getItem("courseId")
          : 1,
        name: this.documentName,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.data.message || "提交成功");
          this.keptToSentRecord();
          this.content = "";
          this.changeEntity_show = false;
        }
      });
    },
    saveToTemplate() {
      // 保存模板
      let path =
        this.$path.document.saveToTemplate +
        `?userId=${Number(sessionStorage.getItem("Uid"))}&type=1`;
      let params = {
        content: this.content,
        course: sessionStorage.getItem("courseId")
          ? sessionStorage.getItem("courseId")
          : 1,
        name: this.documentName,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.data.message || "提交成功");
          this.getTemplateList();
          this.content = "";
          this.documentName = "";
          this.changeEntity_show = false;
        }
      });
    },
    removeWord() {
      // 保存模板
      var value;
      if (this.removeType == "1") {
        value = this.value;
      } else {
        value = this.keptToSentRecord_value;
      }
      let path = this.$path.document.deleteDocument;
      let params = {
        userId: sessionStorage.getItem("Uid"),
        documentId: value,
        type: this.removeType,
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.data.message || "删除成功");
          if (this.removeType == "1") {
            this.getTemplateList();
          } else {
            this.keptToSentRecord();
          }
          this.keptToSentRecord_value = "";
          this.value = "";
        } else {
          this.$message.error(res.data.message || "删除失败");
        }
        this.removeDialog = false;
      });
    },
  },
};
</script>

<style scoped>
#documentation {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  /* width: 1000px; */
  /* margin-left: -520px; */
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.utils {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  padding-bottom: 0;
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