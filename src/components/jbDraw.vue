<template>
  <div id="jbDraw">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" @blur="getPlot1" @focus="getPlot1"> </el-input>
    <div class="tree_box">
      <el-scrollbar>
        <el-tree class="filter-tree" :data="tree_data" :props="defaultProps" :filter-node-method="filterNode" ref="tree"
          draggable @node-click="getItem" highlight-current>
        </el-tree>
      </el-scrollbar>
    </div>
    <ul class="item_box" v-if="itemList.length != 0">
      <!-- <el-scrollbar> -->
      <li class="item_style" v-for="(item, index) in itemList" :key="index" @click="setPlotCode(item, index)"
        :class="img_index === index ? 'select' : ''">
        <el-tooltip class="item" effect="light" :content="item.codeName.split('.')[0]" placement="top-start">
          <img :src="item.url" alt="" style="width: 32px; height: 32px" />
          <!-- <span>{{item.codeName.split(".")[0]}}</span> -->
        </el-tooltip>
      </li>
      <!-- </el-scrollbar> -->
    </ul>
    <ul class="JBLayer_box" v-if="$store.state.temp_JBLayer.length > 0">
      <li class="JBLayer_title">军标图层</li>
      <li class="JBLayer_list">
        <div v-for="(item, index) in $store.state.temp_JBLayer" :key="index" :title="item.name"
          @click="getPlot(item, index)">
          <div @click="selectJBLayer(item, index)">
            {{ item.name }}
          </div>
          <i class="el-icon-close" @click.stop="removeJBLayer(item, index)"></i>
        </div>
      </li>
    </ul>
    <div class="JB_edit_box" ref="box" @mousedown.stop="mouseDownHandleelse($event)"
      @mouseup="mouseUpHandleelse($event)" v-if="JB_edit_box">
      <div class="JB_edit_header">
        <span>标绘属性面板</span>
        <i class="el-icon-close" @click="JB_edit_box = false"></i>
      </div>
      <div>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="基础" name="first">
            <el-form label-position="left" label-width="100px" :model="basics">
              <el-form-item label="线类型">
                <el-select v-model="basics.lineType" placeholder="请选择" size="mini" style="width: 170px"
                  @change="setLineType">
                  <el-option v-for="item in lineType_list" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="线宽">
                <el-input-number v-model="basics.lineWidth" @change="setLineWidth" :min="1" :max="99" size="mini">
                </el-input-number>
              </el-form-item>
              <el-form-item label="常用线色">
                <div v-for="(item, index) in color_Btn" :key="index">
                  <el-button v-for="(item_ren, index_ren) in item" :key="index_ren" size="mini" @click="
  setLineColor(item_ren.color);
basics.lineColor = item_ren.color;
                  ">
                    {{ item_ren.label }}
                    <span :style="{
                      padding: '0px 7px',
                      'background-color': item_ren.color,
                      'margin-left': '5px',
                    }"></span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="自定义线色">
                <el-color-picker v-model="basics.lineColor" color-format="rgb" @change="setLineColor"></el-color-picker>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="填充" name="second" v-if="false"> </el-tab-pane>
          <el-tab-pane label="旗面文字" name="third" v-if="false">
            <el-form label-position="left" label-width="100px" :model="flagText">
              <el-form-item label="文本内容">
                <el-input v-model="flagText.content" size="mini" style="width: 170px" @change="setflagTextContent">
                </el-input>
              </el-form-item>
              <el-form-item label="字体颜色">
                <el-color-picker v-model="flagText.color" color-format="rgb" @change="setflagTextColor">
                </el-color-picker>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注记" name="fourth">
            <el-form label-position="left" label-width="100px" :model="other">
              <el-form-item label="注记内容" v-if="other.contentPosition == 8">
                <el-input type="textarea" :rows="1" v-model="other.flagText" size="mini" style="width: 170px"
                  @change="setflagTextContent" @focus="getChange('旗面文字')" resize="none">
                </el-input>
              </el-form-item>
              <el-form-item label="注记内容" v-else>
                <el-input v-model="other.content" size="mini" style="width: 170px" @change="setnoteContent"
                  @focus="getChange('注记')"></el-input>
              </el-form-item>
              <el-form-item label="注记位置">
                <el-select v-model="other.contentPosition" placeholder="请选择" size="mini" style="width: 170px"
                  @change="setnotePosition">
                  <el-option v-for="item in contentPosition_list" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="字体大小">
                <el-input-number v-model="other.size" @change="setNoteTextSize" :min="12" :max="99" size="mini">
                </el-input-number>
              </el-form-item>
              <el-form-item label="字体颜色">
                <el-color-picker v-model="other.color" color-format="rgb" @change="setflagTextColor">
                </el-color-picker>
              </el-form-item>
              <el-form-item label="模式">
                <el-select v-model="other.model" placeholder="请选择" size="mini" style="width: 170px"
                  @change="changeModel">
                  <el-option v-for="item in model_list" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog title="内容" :visible.sync="$store.state.JBtext_show" width="30%" :modal-append-to-body="false">
      <span>
        <el-input v-model="$store.state.JBtext_value" placeholder="请输入内容"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.state.JBtext_show = false">取 消</el-button>
        <el-button type="primary" @click="draw_text">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import armySing_list from "@/utils/Config";
import draw_JB from "@/utils/draw";
import data from "@/utils/deploy_data";
import DrawMetePlot from "@/utils/Draw/DrawMetePlot";
import tempPlotLayer from "@/utils/Layer/tempPlotLayer";
import { revoke_list, recovery_list } from "@/utils/Draw/operationRecord";

export default {
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      tree_data: armySing_list.config,
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      itemList: [],
      img_index: -1,
      selectMeteorology: false,
      drawMete: false,
      JB_edit_box: false,
      activeName: "first",
      basics: {
        lineType: 0,
        lineWidth: 1,
        lineColor: "rgb(0,0,0)",
      },
      flagText: {
        content: "",
        color: "rgb(0,0,0)",
      },
      other: {
        content: "",
        contentPosition: 0,
        model: "sizeByZoom",
        color: "rgb(0,0,0)",
        flagText: "",
        size: 12
      },
      lineType_list: [
        { label: "实线", value: 0 },
        { label: "长虚线", value: 1 },
        { label: "短虚线", value: 2 },
      ],
      contentPosition_list: [
        { label: "无", value: -1 },
        { label: "内部", value: 8 },
        { label: "下", value: 0 },
        { label: "右", value: 1 },
        // { label: "上", value: 2 },
        { label: "左", value: 3 },
        // { label: "左上", value: 4 },
        // { label: "右上", value: 5 },
        // { label: "右下", value: 6 },
        // { label: "左下", value: 7 },
      ],
      model_list: [
        { label: "不随地图放大或缩小", value: "not_sizeByZoom" },
        { label: "随地图放大或缩小", value: "sizeByZoom" },
      ],
      select_plot_item: "",
      select_plot_index: "",
      new_ID: 0,
      plotStyle: "",
      noteStyle: "",
      color_Btn: [
        [
          {
            label: "红色",
            color: "rgb(255,0,0)",
          },
          {
            label: "粉色",
            color: "rgb(255, 192, 203)",
          },
          {
            label: "黑色",
            color: "rgb(0,0,0)",
          },
        ],
        [
          {
            label: "蓝色",
            color: "rgb(0,0,255)",
          },
          {
            label: "绿色",
            color: "rgb(0,255,0)",
          },
          {
            label: "黄色",
            color: "rgb(255,255,0)",
          },
        ],
        [
          {
            label: "橙色",
            color: "rgb(255, 149, 0)",
          },
          {
            label: "青色",
            color: "rgb(0, 255, 255)",
          },
          {
            label: "紫色",
            color: "rgb(255, 0, 255)",
          },
        ],
      ],
      revokeStyle: true,
      changeFun: "setnoteContent",
      changeType: "content"

    };
  },
  destroyed() {
    document.onkeydown = null;
  },
  mounted() {
    // console.log(armySing_list);
    if (this.drawMete) {
    } else {
      this.drawMete = new DrawMetePlot(this.$map.map);
    }
    this.revoke();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getItem(item, node, vue) {
      this.itemList = [];
      if (item.childrens) {
        this.itemList = item.childrens;
      }
      if (this.selectMeteorology) {
        if (item.label != "气象符号" && node.level == 1) {
          this.selectMeteorology = false;
        }
      } else {
        if (item.label == "气象符号") {
          this.$map.DrawPlot.plotCode = "";
          this.selectMeteorology = true;
        }
      }
    },
    setPlotCode(item, index) {
      this.$map.DrawPlot.endDraw = true;
      if (this.selectMeteorology) {
        this.drawMete.plotCode = item.codeId;
        this.drawMete.iconUrl = item.url;
      } else {
        this.code = item.codeId;
        this.name = item.codeName.substring(0, item.codeName.length - 4);
        this.imageUrl = item.url;

        this.$map.DrawPlot.points = [];
        let _this = this;
        _this.$map.DrawPlot.plotCode = _this.code;
        _this.$map.DrawPlot.imageUrl = _this.imageUrl;
        _this.$map.DrawPlot.plotName = _this.name;
        this.$map.DrawTest.setNum(_this.code);
        this.$map.DrawTest.addInteraction();

        this.$map.DrawTest.callbackDraw = function (layer) {
          console.log(layer);
          if (layer) {
            layer.name = _this.name;
            _this.$store.state.temp_JBLayer.push(layer);
          }
        };
      }
    },
    backType() {
      setTimeout(() => {
        this.revokeStyle = true;
      }, 500);
    },
    selectJBLayer(item, index) {
      this.revokeStyle = false;
      this.backType();
      this.$map.DrawTest.removeInteraction();
      // this.$map.map.map.getView().fit(item.plotBbox,{padding:[0,-400,0,0]})
      let _this = this;
      this.$map.DrawPlot.selectLayer_ = item;
      // 获取编辑点
      this.$map.getHandle(item.nid);
      // 获取军标样式
      this.$map.DrawPlot.getPlotStyle(item.nid, function (res) {
        _this.plotStyle = res;
        _this.basics = {
          lineType: res.lineStyle,
          lineWidth: res.lineWidth,
          lineColor: _this.$map.DrawPlot.intToRgb(res.lineColor),
        };
        _this.other.color = _this.$map.DrawPlot.intToRgb(res.textColor);
      });
      // 获取旗面文字样式
      this.$map.DrawPlot.getLabelAndPos(item.nid, function (res) {
        _this.other.content = res.content;
        _this.other.contentPosition = res.pos;
      });
      // 获取注记样式
      this.$map.DrawPlot.getPlotTexts(item.nid, function (res) {
        _this.other.flagText = res.content;
      });
    },
    removeJBLayer(item, index) {
      this.$map.overlayLayer_.getSource().clear();
      if (item.name.indexOf("jb_Mete") != -1) {
        this.$map.map.map.removeLayer(item);
      } else {
        item.onRemove();
      }
      this.$store.state.temp_JBLayer.splice(index, 1);
      this.$map.DrawTest.geoPlots.splice(index, 1);

      this.select_plot_item = "";
      this.select_plot_index = "";
      this.JB_edit_box = false;
    },
    draw_text() {
      this.$map.DrawPlot.setLine(
        this.$store.state.JBtext_data,
        this.$store.state.JBtext_map
      );
      this.$store.state.JBtext_show = false;
      this.$store.state.JBtext_value = "";
    },
    getJB_image(item) {
      if (item.childrens) {
        for (let i = 0; i < item.childrens.length; i++) {
          const element = item.childrens[i];
          if (element.name.indexOf(this.filterText) > -1) {
            this.itemList.push(element);
          }
        }
      } else {
        for (let j = 0; j < item.children.length; j++) {
          const elements = item.children[j];
          this.getJB_image(elements);
        }
      }
    },
    getPlot(item, index) {
      this.JB_edit_box = true;
      this.select_plot_item = item;
      this.select_plot_index = index;
      this.basics.lineColor = this.select_plot_item.color;
      this.other.flagText = this.select_plot_item.flagTextContent;
      this.other.color = this.select_plot_item.flagTextColor;
      this.other.content = this.select_plot_item.noteContent;
      this.other.size = this.select_plot_item.fontSize;
    },
    setLineColor(color,callback) {
      this.changeFun = "setLineColor";
      this.changeType = "lineColor";
      // this.select_plot_item.setColor(color);
      this.$map.DrawPlot.selectLayer_.setColor(color);
      this.plotStyle.lineColor = this.$map.DrawPlot.RgbToint(color);
      this.plotStyle.fillBackColor = this.$map.DrawPlot.RgbToint(color);
      this.plotStyle.fillForeColor = this.$map.DrawPlot.RgbToint(color);
      this.$map.DrawPlot.setPlotStyle(
        this.$map.DrawPlot.selectLayer_.nid,
        this.plotStyle,
        callback
      );
    },
    setflagTextContent(value,callback) {
      this.changeFun = "setflagTextContent";
      this.changeType = "flagText";
      this.$map.DrawPlot.setPlotTexts(
        this.$map.DrawPlot.selectLayer_.nid,
        value,
        this.plotStyle,
        callback
      );
      this.$map.DrawPlot.selectLayer_.setText(value);
    },
    setflagTextColor(color,callback) {
      this.changeFun = "setflagTextColor";
      this.changeType = "color";
      this.plotStyle.textColor = this.$map.DrawPlot.RgbToint(color);
      this.$map.DrawPlot.setPlotStyle(
        this.$map.DrawPlot.selectLayer_.nid,
        this.plotStyle,
        callback
      );
      this.$map.DrawPlot.selectLayer_.setTextColor(color);
    },
    setNoteTextSize(size,callback) {
      this.changeFun = "setNoteTextSize";
      this.changeType = "size";
      this.plotStyle.fontSize = size;
      this.$map.DrawPlot.setPlotStyle(
        this.$map.DrawPlot.selectLayer_.nid,
        this.plotStyle,
        callback
      );
      this.$map.DrawPlot.selectLayer_.setNoteTextSize(size);
    },
    setnoteContent(value,callback) {
      this.changeFun = "setnoteContent";
      this.changeType = "content";
      this.$map.DrawPlot.setLabelAndPos(
        this.$map.DrawPlot.selectLayer_.nid,
        value,
        this.other.contentPosition,
        callback
      );
      this.$map.DrawPlot.selectLayer_.setNoteText(value);
    },
    setnotePosition(value,callback) {
      this.changeFun = "setnotePosition";
      this.changeType = "contentPosition";
      if (value == 8) return;
      this.$map.DrawPlot.setLabelAndPos(
        this.$map.DrawPlot.selectLayer_.nid,
        this.other.content,
        value,
        callback
      );
      this.$map.DrawPlot.selectLayer_.setNoteTextPosition(value);
    },
    handleClick() { },
    setLineWidth(num,callback) {
      this.changeFun = "setLineWidth";
      this.changeType = "lineWidth";
      this.$map.DrawPlot.selectLayer_.setWidth(num);
      this.plotStyle.lineWidth = num;
      this.$map.DrawPlot.setPlotStyle(
        this.$map.DrawPlot.selectLayer_.nid,
        this.plotStyle,
        callback
      );
    },
    setLineType(type,callback) {
      this.changeFun = "setLineType";
      this.changeType = "lineType";
      if (type == 0) {
        this.$map.DrawPlot.selectLayer_.setDasharray(false);
      } else if (type == 1) {
        this.$map.DrawPlot.selectLayer_.setDasharray([150, 10]);
      } else {
        this.$map.DrawPlot.selectLayer_.setDasharray([2, 4]);
      }
      this.plotStyle.lineStyle = type;
      this.$map.DrawPlot.setPlotStyle(
        this.$map.DrawPlot.selectLayer_.nid,
        this.plotStyle,
        callback
      );
    },

    changeModel() {
      console.log(this.other.model);
      // let nid = this.$map.DrawPlot.selectLayer_.nid;
      let map = this.$map.DrawPlot.selectLayer_.map;
      if (this.other.model == "sizeByZoom") {
        //随地图
        this.$map.DrawTest.onMap = false;
        for (let i = 0; i < this.$store.state.temp_JBLayer.length; i++) {
          let layer = this.$store.state.temp_JBLayer[i];
          let points = layer.startPoint;
          let codeId = layer.codeId;
          if (layer.type == 1) {
            this.$map.DrawTest.onMapToPlot(layer, points, codeId, map);
          }
        }
      } else {
        //不随地图
        this.$map.DrawTest.onMap = true;
        for (let i = 0; i < this.$store.state.temp_JBLayer.length; i++) {
          let layer = this.$store.state.temp_JBLayer[i];
          let points = layer.startPoint;
          let codeId = layer.codeId;
          if (layer.type == 1) {
            this.$map.DrawTest.onMapToPlot(layer, points, codeId, map);
          }
        }
      }
    },
    // 撤销
    revoke() {
      let self = this;
      document.onkeydown = KeyPress;
      function KeyPress(e) {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
          console.log(revoke_list);
          let revoke = revoke_list[revoke_list.length - 1];
          if (revoke.type == "layer") {
            revoke.data.onRemove();
            self.$store.state.temp_JBLayer.pop();
            self.$map.DrawTest.geoPlots.pop();
          } else if (revoke.type == "translate") {
            self.selectJBLayer(revoke.selectLayer);
            self.$map.DrawPlot.moveHandle(
              revoke.nid,
              revoke.nHandle,
              revoke.coordinate,
              revoke.map,
              revoke.plotHandleType
            );
          } else if (revoke.type == "style") {
            self.revokeStyle = false;
            self.selectJBLayer(revoke.selectLayer);
            let callback = () => {
              self.$set(self, revoke.key, revoke)
            }
            self[revoke.childrenFun](revoke[revoke.childrenType],callback);
            revoke.selectLayer = null
            self.backType();
          }
          recovery_list.push(revoke);
          revoke_list.pop();
        }
        if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
          let recovery = recovery_list[recovery_list.length - 1];
          if (recovery.type == "layer") {
            recovery.data.addLayer();
            revoke_list.push(recovery);
            recovery_list.pop();
            self.$store.state.temp_JBLayer.push(recovery);
            self.$map.DrawTest.geoPlots.push(recovery.geoPlot);
          }
        }
      }
    },
    getPlot1() {
      this.itemList = [];
      for (let i = 0; i < armySing_list.config.length; i++) {
        const element = armySing_list.config[i];
        this.getJB_image(element);
      }
    },
    getChange(type) {
      if (type == "注记") {
        this.changeFun = "setnoteContent";
        this.changeType = "content";
      } else {
        this.changeFun = "setflagTextContent";
        this.changeType = "flagText";
      }
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      if (event.target.localName == "input" || event.target.localName == "textarea") {
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
  },
  computed: {
    basicsNew() {
      return JSON.parse(JSON.stringify(this.basics));
    },
    otherNew() {
      return JSON.parse(JSON.stringify(this.other));
    },
  },
  watch: {
    filterText(val) {
      this.itemList = [];
      if (val == "") {
      } else {
        for (let i = 0; i < armySing_list.config.length; i++) {
          const element = armySing_list.config[i];
          this.getJB_image(element);
        }
        if (this.itemList.length < 1) {
          this.$message({
            message: "未搜索到结果",
            type: "error",
          });
        }
      }
    },
    basicsNew: {
      handler(val, oVal) {
        if (this.revokeStyle) {
          oVal.type = "style";
          oVal.childrenFun = this.changeFun;
          oVal.childrenType = this.changeType;
          oVal.key = "basics";
          oVal.selectLayer = this.$map.DrawPlot.selectLayer_;
          if (this.changeFun) {
            revoke_list.push(oVal);
          }
        }
      },
      deep: true,
    },
    otherNew: {
      handler(val, oVal) {
        // if(this.childrenType == "content" || this.childrenType == "flagText"){
        //   return
        // }
        if (this.revokeStyle) {
          oVal.type = "style";
          oVal.childrenFun = this.changeFun;
          oVal.childrenType = this.changeType;
          oVal.key = "other";
          oVal.selectLayer = this.$map.DrawPlot.selectLayer_;
          if (this.changeFun) {
            revoke_list.push(oVal);
            console.log(revoke_list);
          }
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#jbDraw {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  /* height: 400px; */
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
}

.tree_box {
  height: 350px;
  margin-top: 10px;
}

.item_box {
  height: 200px;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.item_style {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  margin: 5px;
}

.select {
  background-color: #00adff9e;
}

.JBLayer_box {
  position: absolute;
  top: 0;
  left: 100%;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  margin-left: 10px;
}

.JBLayer_box .JBLayer_list {
  height: 300px;
  overflow-y: auto;
}

.JBLayer_box li div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.JBLayer_box .JBLayer_list>div>div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
  text-align: left;
  padding: 10px;
  padding-bottom: 0;
}

.JBLayer_title {
  text-align: left;
  font-weight: bold;
  padding-bottom: 10px;
}

.JB_edit_box {
  position: fixed;
  left: 1500px;
  top: 200px;
  /* border: 1px solid #ccc; */
}

.JB_edit_header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>