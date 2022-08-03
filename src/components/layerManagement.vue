<template>
  <div id="layerManagement">
    <ul class="utils_box">
      <li class="utils_item">
        <el-tooltip class="item" effect="light" content="上传" placement="top-start">
          <el-upload class="upload-demo" :action="$path.LayerManagement.uploadShp" :data="{
            userId: self_uid,
          }" :on-success="upload_success" :show-file-list="false">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-tooltip>
      </li>
      <li class="utils_item" v-for="(item, index) in utils_list" :key="index" @click="utils_fun(item.name)">
        <el-tooltip class="item" effect="light" :content="item.name" placement="top-start">
          <i :class="item.icon"></i>
        </el-tooltip>
      </li>
    </ul>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <div class="tree_box">
      <el-scrollbar>
        <el-tree class="filter-tree" :data="tree_data" :props="defaultProps" default-expand-all
          :filter-node-method="filterNode" ref="tree" show-checkbox node-key="id" :default-checked-keys="checkList"
          draggable @node-click="getNode" @check-change="getCheckNode" @node-drop="moveLayer">
        </el-tree>
      </el-scrollbar>
    </div>
    <el-dialog title="新建文件夹" :visible.sync="createFolder_show" width="500px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>名称：</span>
          <el-input v-model="folderDame" size="mini" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createFolder_show = false">取 消</el-button>
        <el-button type="primary" @click="createFolder_fun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="removeDialog" width="300px" append-to-body>
      <span>确认删除选中文件吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeDialog = false">取 消</el-button>
        <el-button type="primary" @click="removeLayer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      self_uid: sessionStorage.getItem("Uid"),
      utils_list: [
        {
          name: "新建文件夹",
          icon: "el-icon-folder-add",
        },
        // {
        //   name: "全选",
        //   icon: "el-icon-document-checked",
        // },
        // {
        //   name: "取消全选",
        //   icon: "el-icon-document-delete",
        // },
        {
          name: "删除",
          icon: "el-icon-delete",
        },
        // {
        //   name: "上移",
        //   icon: "el-icon-top",
        // },
        // {
        //   name: "下移",
        //   icon: "el-icon-bottom",
        // },
        // {
        //   name: "置顶",
        //   icon: "el-icon-sort-up",
        // },
        // {
        //   name: "置底",
        //   icon: "el-icon-sort-down",
        // },
      ],
      filterText: "",
      tree_data: [
        {
          label: "数字地图",
          id: 1,
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      uploadPath: "",
      selectData: "",
      createFolder_show: false,
      folderDame: "",
      removeDialog: false,
      GridTileLayer: {},
      checkList: [],
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getDataList() {
      let path;
      if (this.$store.state.teacher) {
        path = this.$path.LayerManagement.showLayerToT;
      } else {
        path = this.$path.LayerManagement.showLayer;
      }
      let params = {
        creatorId: sessionStorage.getItem("Uid"),
      };
      let _this = this;
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          let temp = {
            label: "数字地图",
            id: 1,
            children: [],
          };
          let a = {
            children: [],
            content:
              "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",
            id: 1759,
            label: "敌情图",
            path: "/data/export/doc/layer/xunliancanmoutest/敌情图.txt",
            type: 2,
          };
          _this.tree_data = res.data.data.children;
          _this.tree_data.push(temp);
          _this.initCheck(res.data.data.children);
          _this.uploadPath = res.data.data.path;
        }
      });
    },
    initCheck(data) {
      let _this = this;
      for (let i = 0; i < data.length; i++) {
        let child = data[i].children;
        if (child.length > 0) {
          this.initCheck(child);
        }
        let id = data[i].id;
        let label = data[i].label;
        let Glabel = _this.$store.state.mapLevelList[label];
        if (Glabel) {
          _this.checkList.push(id);
        }
        let JLabel = _this.$store.state.JBLayer[label];
        if (JLabel) {
          _this.checkList.push(id);
        }
      }
    },
    upload_success(res) {
      console.log(res);
      if (res.code == 0) {
        this.drawshp(res.data);
      } else {
        this.$message({
          message: res.message,
          type: "error",
        });
      }
    },
    drawshp(data) {
      if (this.$map.map.getLayer("updataLayer")) {
        this.$map.map.remove(this.$map.map.getLayer("updataLayer"));
      }
      this.$map.LineLayer({
        data,
        id: "updataLayer",
      });
    },
    utils_fun(name) {
      // console.log(name);
      if (name == "新建文件夹") {
        this.createFolder_show = true;
      } else if (name == "删除") {
        this.removeDialog = true;
      }
    },
    getNode(data) {
      // console.log(data);
      this.uploadPath = data.path;
      // console.log(this.uploadPath);
    },
    addLayer(data) {
      if (data.type) {
        this.drawJB(data.content, data.label);
        for (let item in this.GridTileLayer) {
          this.$map.map.moveLayer(
            this.GridTileLayer[item],
            this.$map.map.getLayer("mengban")
          );
        }
      } else {
        this.GridTileLayer[data.label] = new PIE.GridTileLayer({
          url: data.content,
          id: data.label,
        });
        this.$map.map.add(this.GridTileLayer[data.label]);
        this.$map.map.moveLayer(
          this.GridTileLayer[data.label],
          this.$map.map.getLayer("mengban")
        );
        this.$store.state.mapLevelList[data.label] =
          this.GridTileLayer[data.label];
        this.$store.state.mapLevelCheck.push(data.id);
      }
    },
    clearLayer(data) {
      if (data.type) {
        let length = this.$store.state.JBLayer[data.label].length;
        for (let i = 0; i < length; i++) {
          // this.$map.map.remove(this.$store.state.JBLayer[data.label][i]);
          this.$store.state.JBLayer[data.label][i].onRemove();
        }
        this.$store.state.JBLayer[data.label] = [];
        delete this.$store.state.JBLayer[data.label];
        this.$map.DrawPlot.geoPlots = [];
      } else {
        this.$map.map.remove(this.$store.state.mapLevelList[data.label]);
        delete this.$store.state.mapLevelList[data.label];
      }
    },
    getCheckNode(data, checkType) {
      if (data.label == "数字地图") {
        this.$map.JY_map(checkType);
        return;
      }
      if (checkType) {
        this.addLayer(data);
        this.uploadPath = data.path;
        this.selectData = data;
      } else {
        console.log(data);
        this.clearLayer(data);
      }
    },
    drawJB(byteArr, label) {
      let _this = this;
      let path = JB_PlotIP + "/PathNative/service/makeFromBuffer";
      let params = { byteArr };
      this.$http.post(path, params).then((res) => {
        if (res.status == 200) {
          console.log(this.$store.state.JBLayer);
          this.$store.state.JBLayer[label] = [];
          let draw = (layer) => {
            console.log(layer);
            _this.$store.state.JBLayer[label].push(layer);
            layer.addLayer();
            var features = [];
            var aa = _this.$store.state.JBLayer[label];
            for (let i = 0; i < aa.length; i++) {
              const element = aa[i].plotBbox;
              var bb = turf.bboxPolygon(element);
              features.push(bb);
            }
            var bbox;
            if (features.length > 1) {
              var union = turf.union(...features);
              bbox = turf.bbox(union);
            } else {
              bbox = layer.plotBbox;
            }
            // for (let i = 0; i < aa.length; i++) {
            //   const element = aa[i].featureData.features;
            //   for (let j = 0; j < element.length; j++) {
            //     const element_children = element[j];
            //     features.push(element_children)
            //   }
            // }
            // var bbox = turf.bbox(...features)
            _this.$map.map.map
              .getView()
              .fit(bbox, { padding: [0, -400, 0, 0] });
          };
          for (let i = 0; i < res.data.length; i++) {
            let style = {
              pathPlotStyle: res.data[i].pathPlotStyle,
              plotTexts: res.data[i].plotTexts,
              symbolLabelContent: res.data[i].symbolLabelContent,
              symbolLabelPos: res.data[i].symbolLabelPos,
              symbolType: res.data[i].symbolType,
            };
            this.$map.DrawPlot.getPlotData(res.data[i], style, draw);
          }
        }
      });
    },
    getNoteXY() {
      let x;
      let y;
      if (this.symbolLabelPos == 0) {
        x = (this.bbox[0] + this.bbox[2]) / 2;
        y = this.bbox[1];
      } else if (this.symbolLabelPos == 1) {
        x = this.bbox[2];
        y = (this.bbox[1] + this.bbox[3]) / 2;
      } else if (this.symbolLabelPos == 2) {
        x = (this.bbox[0] + this.bbox[2]) / 2;
        y = this.bbox[3];
      } else if (this.symbolLabelPos == 3) {
        x = this.bbox[0];
        y = (this.bbox[1] + this.bbox[3]) / 2;
      } else if (this.symbolLabelPos == 4) {
        x = this.bbox[0];
        y = this.bbox[3];
      } else if (this.symbolLabelPos == 5) {
        x = this.bbox[2];
        y = this.bbox[3];
      } else if (this.symbolLabelPos == 6) {
        x = this.bbox[2];
        y = this.bbox[1];
      } else if (this.symbolLabelPos == 7) {
        x = this.bbox[0];
        y = this.bbox[1];
      }
      return [x, y];
    },
    createFolder_fun() {
      let path =
        this.$path.LayerManagement.newFolder +
        `?userId=${sessionStorage.getItem("Uid")}`;
      let params = {
        parentPath: this.uploadPath,
        fileName: this.folderDame,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.message,
            type: "success",
          });
          this.getDataList();
          this.folderDame = "";
          this.createFolder_show = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
    createFolder() {
      let path = "";
      let params = {};
    },
    removeLayer() {
      let path = this.$path.LayerManagement.deleteLayer;
      let params = {
        path: this.uploadPath,
        userId: sessionStorage.getItem("Uid"),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.message,
            type: "success",
          });
          this.getDataList();
          this.clearLayer(this.selectData);
          this.removeDialog = false;
        } else {
          this.$message.error(res.data.message || "提交失败");
        }
      });
    },
    moveLayer(before, after, inner) {
      // console.log(before);
      // console.log(after);
      // console.log(inner);
      if (inner == "inner") {
        // console.log("移入");
      } else if (inner == "before") {
        // console.log("移上或移出");
      } else if (inner == "after") {
        // console.log("移下");
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style scoped>
#layerManagement {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  height: 400px;
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
}

.tree_box {
  height: 320px;
  margin-top: 10px;
}

.utils_box {
  display: flex;
  margin-bottom: 10px;
  /* justify-content: space-between; */
}

.utils_item {
  border: 1px solid #333;
  margin: 1px;
  padding: 1px;
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