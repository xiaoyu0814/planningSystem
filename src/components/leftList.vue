<template>
  <div class="leftList">
    <ul class="list_box">
      <li class="list" v-for="(item, index) in $store.state.teacher ? teacher_list : list" :key="index"
        @mouseenter="s_index = index" @mouseleave="s_index = -1" @click="selectItem(item)">
        <img :src="s_index === index ? item.s_img : item.img" />
        <span style="margin-top: 5px" :style="s_index === index ? 'color:rgb(0, 60, 255)' : ''">
          {{ item.name }}
        </span>
      </li>
    </ul>
    <div class="show_hidden" @click="show_hidden" v-if="!$store.state.teacher">
      {{ btn_text }}
    </div>
    <el-dialog title="选择想定" :visible.sync="changeEntity_show" width="300px" append-to-body>
      <span>想定：</span>
      <el-select v-model="entity_value" placeholder="请选择">
        <el-option v-for="(item, index) in entity_list" :label="item.label" :value="item.value" :key="index">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeEntity_show = false">取 消</el-button>
        <el-button type="primary" @click="changeEntity">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <soket1 @receiveData="startXD" /> -->
  </div>
</template>

<script>
// import soket1 from "@/components/soket1"; // 定位
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";

export default {
  // components: {
  //   soket1,
  // },
  data() {
    return {
      changeEntity_show: false,
      s_index: -1,
      hover_type: true,
      teacher_list: [
        {
          name: "图层管理",
          img: require("../assets/images/leftList/layer.png"),
          s_img: require("../assets/images/leftList/layer_s.png"),
          d_img: require("../assets/images/leftList/layer_d.png"),
        },
        {
          name: "要图标绘",
          img: require("../assets/images/leftList/draw.png"),
          s_img: require("../assets/images/leftList/draw_s.png"),
          d_img: require("../assets/images/leftList/draw_d.png"),
        },
        {
          name: "文书拟制",
          img: require("../assets/images/leftList/book.png"),
          s_img: require("../assets/images/leftList/book_s.png"),
          d_img: require("../assets/images/leftList/book_d.png"),
        },
        {
          name: "环境设置",
          img: require("../assets/images/leftList/fight.png"),
          s_img: require("../assets/images/leftList/fight_s.png"),
          d_img: require("../assets/images/leftList/fight_d.png"),
        },
        {
          name: "查看",
          img: require("../assets/images/leftList/see.png"),
          s_img: require("../assets/images/leftList/see_s.png"),
          d_img: require("../assets/images/leftList/see_d.png"),
        },
      ],
      list: [
        {
          name: "图层管理",
          img: require("../assets/images/leftList/layer.png"),
          s_img: require("../assets/images/leftList/layer_s.png"),
          d_img: require("../assets/images/leftList/layer_d.png"),
        },
        {
          name: "要图标绘",
          img: require("../assets/images/leftList/draw.png"),
          s_img: require("../assets/images/leftList/draw_s.png"),
          d_img: require("../assets/images/leftList/draw_d.png"),
        },
        {
          name: "文书拟制",
          img: require("../assets/images/leftList/book.png"),
          s_img: require("../assets/images/leftList/book_s.png"),
          d_img: require("../assets/images/leftList/book_d.png"),
        },
        {
          name: "作战计算",
          img: require("../assets/images/leftList/fight.png"),
          s_img: require("../assets/images/leftList/fight_s.png"),
          d_img: require("../assets/images/leftList/fight_d.png"),
        },
        // {
        //   name: "信息统计",
        //   img: require("../assets/images/leftList/message.png"),
        //   s_img: require("../assets/images/leftList/message_s.png"),
        //   d_img: require("../assets/images/leftList/message_d.png"),
        // },
        {
          name: "实例",
          img: require("../assets/images/leftList/entity.png"),
          s_img: require("../assets/images/leftList/entity_s.png"),
          d_img: require("../assets/images/leftList/entity_d.png"),
        },
        {
          name: "查看",
          img: require("../assets/images/leftList/see.png"),
          s_img: require("../assets/images/leftList/see_s.png"),
          d_img: require("../assets/images/leftList/see_d.png"),
        },
      ],
      entity_value: "",
      entity_list: [
        {
          label: "台湾",
          value: "/data/GenericScenario_old.xml",
        },
        {
          label: "台海",
          value: "/data/GenericScenario.xml",
        },
      ],
      btn_text: "隐藏",
    };
  },
  mounted() {
    // let path = "/data/student_09221032.xml";
    //   var datamodel = CGFListLoad.initEntity(path,this.$store.state.XDType);
    if (!this.$store.state.teacher) {
      // console.log(sessionStorage.getItem("courseType"));
      if (sessionStorage.getItem("courseType") == "0") {
        this.downloadTFile();
      } else {
        this.downloadSFile();
      }
    }
  },
  methods: {
    selectItem(item) {
      if (item.name === "图层管理") {
        this.$store.state.layerManagemen_show =
          !this.$store.state.layerManagemen_show;
        if (this.$store.state.layerManagemen_show) {
          this.$store.state.jbDraw_show = false;
        }
      } else if (item.name === "要图标绘") {
        this.$store.state.jbDraw_show = !this.$store.state.jbDraw_show;
        if (this.$store.state.jbDraw_show) {
          this.$store.state.layerManagemen_show = false;
        }
        this.$map.DrawPlot.plotCode = "";
      } else if (item.name === "文书拟制") {
        this.$store.state.documentation_show =
          !this.$store.state.documentation_show;
      } else if (item.name === "作战计算") {
        this.$store.state.operationalAnalysis_show =
          !this.$store.state.operationalAnalysis_show;
      } else if (item.name === "信息统计") {
      } else if (item.name === "实例") {
        // this.$store.state.setMarshalling_show =
        //   !this.$store.state.setMarshalling_show;
        // if (this.$store.state.setMarshalling_show) {
        //   // this.addEntity();
        // }
        this.$store.state.setMarshalling_show = true;
        // this.changeEntity_show = true;
      } else if (item.name === "查看") {
        this.$store.state.check_show = !this.$store.state.check_show;
        // this.$store.state.makeUpYourMind_show = !this.$store.state.makeUpYourMind_show;
      } else if (item.name === "环境设置") {
        this.$store.state.environmentSettings_show =
          !this.$store.state.environmentSettings_show;
      }
    },
    addEntity(path) {
      // console.log("想定加载");
      // var path = "/data/GenericScenario.xml";

      var datamodel = CGFListLoad.initEntity(path, this.$store.state.XDType);

      this.$store.state.CGFListData = datamodel.vecNodes;
      //var _CGFEntityLayer = new CGFEntityLayer(datamodel)
    },
    changeEntity() {
      this.$map.removeAllLayer();
      this.addEntity(this.entity_value);
      this.$store.state.setMarshalling_show = true;
      this.changeEntity_show = false;
    },
    startXD() {
      this.addEntity("/data/GenericScenario.xml");
      this.$store.state.setMarshalling_show = true;
    },
    downloadTFile() {
      let path = this.$path.xml.downloadTFile;
      let params = {
        xmlId: sessionStorage.getItem("xmlId"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data) {
          this.showCGF(res.data);
        }
      });
    },
    downloadSFile() {
      let path = this.$path.xml.downloadSFile;
      let params = {
        userId: sessionStorage.getItem("Uid"),
        courseId: sessionStorage.getItem("courseOldId"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data) {
          this.showCGF(res.data);
        }
      });
    },
    showCGF(data) {
      console.log(1);
      this.$store.state.setMarshalling_show = true;
      let datamodel = CGFListLoad.get(data, this.$store.state.XDType);
      this.$store.state.CGFListData = CGFListLoad.datamodel.vecNodes;
      this.$store.state.CGFEditListData = [datamodel.GetRootCGFEntity(1)];
      // this.$store.state.CGFEditListData0 = [datamodel.GetRootCGFEntity(0)];
      this.$store.state.navPathList_CGF = this.getCGFFirst(this.$store.state.CGFEditListData)
      console.log(CGFListLoad.datamodel.newsNodes);
      let newsList = CGFListLoad.datamodel.newsNodes.list;
      let newsCGF = [];
      for (let i = 0; i < newsList.length; i++) {
        const element = newsList[i];
        // if (element.side == 2) {
        // this.blueCGFList.push(element);
        const cgf = datamodel.getCGFEntityById(element);
        // if (i == 0) {
        //   this.$store.state.navPathList_CGF = cgf;
        // }
        newsCGF.push(cgf);
        CGFListLoad.updateSideLayer(cgf);
        // }

        // this.$store.state.CGFReadListData[0].chiledren.push(cgf);
      }
      console.log(newsCGF);
      this.$store.state.CGFReadListData = newsCGF;
    },
    show_hidden() {
      if (this.$store.state.transition) {
        this.btn_text = "显示";
      } else {
        this.btn_text = "隐藏";
      }
      this.$store.state.transition = !this.$store.state.transition;
    },
    getCGFFirst(data) {
      if (data[0].children.length > 0) {
        let resilt = this.getCGFFirst(data[0].children);
        if (resilt) {
          return resilt;
        }
      } else {
        return data[0];
      }
    },
  },
};
</script>

<style scoped>
.leftList {
  display: flex;
}

.show_hidden {
  padding: 5px;
  background-color: #2593ff;
  height: 30px;
  color: #fff;
  cursor: pointer;
}

.list_box {
  background-color: rgb(255, 255, 255);
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  padding: 5px 0;
  font-size: 14px;
  width: 120px;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  cursor: pointer;
}
</style>