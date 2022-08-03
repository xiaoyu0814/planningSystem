<template>
  <div id="fzfx">
    <header>
      <span>辅助分析</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="敌情分析" name="first" class="btn_box">
        <el-button type="primary" size="mini" @click="analyst">分析</el-button>
        <el-button type="danger" size="mini" @click="clearProfile">
          清除
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="我情分析" name="second">
        <div style="padding: 5px">
          <p>兵力</p>
          <el-table :data="redCGF" size="mini" height="100px" width="200px" highlight-current-row>
            <el-table-column prop="type" label="型号" align="center"></el-table-column>
            <el-table-column prop="number" label="数量" align="center">
            </el-table-column>
          </el-table>
        </div>
        <div style="padding: 5px">
          <p style="margin-top: 10px">武器</p>
          <el-table :data="redWQ" size="mini" height="100px" width="200px" highlight-current-row>
            <el-table-column prop="type" label="名称" align="center"></el-table-column>
            <el-table-column prop="number" label="弹药量" align="center">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="电磁判断" name="third" class="btn_box">
        <el-button type="primary" size="mini" @click="analyst">分析</el-button>
        <el-button type="danger" size="mini" @click="clearProfile">
          清除
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
export default {
  data() {
    return {
      radius: "",
      isPointArr: [],
      draw: false,
      input: "",
      value: false,
      value1: false,
      radio: "point",
      draw_point: false,
      draw_line: false,
      draw_fill: false,
      activeName: "first",
      blueCGFList: [],
      blueCGFLayers: [],
      redCGFList: [],
      redCGF: [],
      redWQ: [],
      allCGFList: [],
      dianciList: [],
      dianciLayer: [],
      CGFListData: this.$store.state.CGFListData,
    };
  },
  mounted() { },
  destroyed() {
    this.clearProfile();
  },
  methods: {
    onCancel() {
      this.$store.state.fuzhufenxi_show = false;
    },
    handleClick(tab) {
      this.clearProfile();
      if (tab.name == "second") {
        this.redCGF = [];
        this.redCGFList = [];
        if (this.$store.state.CGFEditListData.length > 0) {
          this.getCGF(this.$store.state.CGFEditListData[0], "redCGFList");
        }
        let temp = {};
        let temp2 = {};
        for (let i = 0; i < this.redCGFList.length; i++) {
          const element = this.redCGFList[i].modelId;
          if (temp[element]) {
            temp[element] += 1;
          } else {
            temp[element] = 1;
          }
          const hangingBullet = this.redCGFList[i].hangingBullet;
          for (let j = 0; j < hangingBullet.length; j++) {
            const ammunition = hangingBullet[j].ammunition;
            const name = hangingBullet[j].name;
            for (let k = 0; k < ammunition.length; k++) {
              const quantity_ammunition = ammunition[k].quantity_ammunition;
              if (temp2[name]) {
                temp2[name] += quantity_ammunition;
              } else {
                temp2[name] = quantity_ammunition;
              }
            }
          }
        }
        for (const key in temp) {
          let node = CGFListLoad.GenericGateway.GetEquipNode(key);
          if (node) {
            let temps = {
              type: node.name,
              number: temp[key],
            };
            this.redCGF.unshift(temps);
          }
        }
        for (const key in temp2) {
          let temps = {
            type: key,
            number: temp2[key],
          };
          this.redWQ.unshift(temps);
        }
      }
    },
    analyst() {
      this.clearProfile();
      if (this.activeName === "first") {
        this.blueCGFList = [];
        let CGFlist = this.$store.state.CGFReadListData;
        if (CGFlist.length < 1) {
          this.getCGF(this.$store.state.CGFListData[0], "blueCGFList");
        }
        for (let i = 0; i < CGFlist.length; i++) {
          if (CGFlist[i].side == 2) {
            this.blueCGFList.push(CGFlist[i]);
          }
        }
        for (let i = 0; i < this.blueCGFList.length; i++) {
          const element = this.blueCGFList[i];
          let radius
          if (element.typeId == 140102) {
            radius = 8
          } else if (element.typeId == 1050102011) {
            radius = 1.6
          } else if (element.typeId == 1050302021 || element.typeId == 111 ) {
            radius = 5
          }else{
            radius = 0.0000000000000000000000000001
          }
          var id = "blue" + i;
          this.drawCircle(element, id, radius);
          this.blueCGFLayers.push(id);
          if (i == 0) {
            let center = [
              this.blueCGFList[i].position.x,
              this.blueCGFList[i].position.y,
            ];
            this.$map.map.setCenter(center);
          }

        }
      } else if (this.activeName === "second") {
      } else if (this.activeName === "third") {
        this.allCGFList = [];
        if (this.$store.state.CGFReadListData.length > 0) {
          this.allCGFList = this.$store.state.CGFReadListData;
        }
        if (this.$store.state.CGFEditListData.length > 0) {
          this.getCGF(this.$store.state.CGFEditListData[0], "allCGFList");
        }
        let allCGFList = this.allCGFList

        for (let i = 0; i < allCGFList.length; i++) {
          const modelId = allCGFList[i].modelId;
          if (
            modelId == "111000001" ||
            modelId == "111000002" ||
            modelId == "111000003" ||
            modelId == "111000004" ||
            // modelId == "2139874358" ||
            // modelId == "111000000" ||
            // modelId == "2140198605"
            modelId == "111000005"
          ) {
            this.dianciList.push(allCGFList[i]);
          }
        }
        console.log(this.dianciList);
        if (this.dianciList.length > 0) {
          this.addDianciLayer(this.dianciList);
        } else {
          this.$message({
            message: "未检测到电磁设备",
            type: "error",
          });
        }
      }
    },
    //添加电磁分析图层
    addDianciLayer(dataList) {
      for (let i = 0; i < dataList.length; i++) {
        var id = "dianci" + i;
        let _data = dataList[i];
        this.drawCircle(_data, id, 5);
        this.dianciLayer.push(id);
        if (i == 0) {
          let center = [_data.position.x, _data.position.y];
          this.$map.map.setCenter(center);
        }
      }
    },
    clearProfile() {
      // if (this.activeName === "first") {
      if (this.blueCGFLayers.length > 1) {
        for (let i = 0; i < this.blueCGFLayers.length; i++) {
          var layer = this.$map.map.getLayer(this.blueCGFLayers[i]);
          this.$map.map.remove(layer);
        }
        this.blueCGFList = [];
        this.blueCGFLayers = [];
      }
      // } else if (this.activeName === "second") {
      // } else if (this.activeName === "third") {
      if (this.dianciLayer.length > 1) {
        for (let i = 0; i < this.dianciLayer.length; i++) {
          var layer = this.$map.map.getLayer(this.dianciLayer[i]);
          this.$map.map.remove(layer);
        }
        this.dianciList = [];
        this.dianciLayer = [];
      }
      // }
    },
    getCGF(data, key_type) {
      if (data.children == undefined || data.children.length < 1) {
        this[key_type].push(data);
      } else {
        for (let i = 0; i < data.children.length; i++) {
          const element = data.children[i];
          this.getCGF(element, key_type);
        }
      }
    },
    drawCircle(element, id, radius) {
      console.log(element);
      var center = [element.position.x, element.position.y];
      var options = {
        steps: 100,
        units: "kilometers",
        properties: { foo: "bar" },
      };
      var color = "#ff0000";
      if (element.side == 1) {
        color = "#ff0000";
      } else if (element.side == 2) {
        color = "#0000ff";
      } else {
        color = "#00ff00";
      }
      var circle = turf.circle(center, radius, options);
      this.$map.FillLayer({
        data: {
          type: "FeatureCollection",
          features: [circle],
        },
        id,
        color,
        opacity: 0.1,
      });
    },
  },
};
</script>

<style scoped>
#fzfx {
  width: 300px;
  background-color: #fff;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn_box {
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 10px;
}
</style>