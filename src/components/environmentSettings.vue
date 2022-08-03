<template>
  <div id="environmentSettings" ref="box" @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>环境设置</span>
      <i class="el-icon-close" @click="$store.state.environmentSettings_show = false"></i>
    </header>
    <div class="content">
      <ul class="settingsList_box">
        <li v-for="(item, index) in settingsList" :key="index" @click="settings_index = index"
          :class="settings_index == index ? 'select' : ''">
          {{ item.label }}
        </li>
      </ul>
      <ul class="settings_box">
        <li class="electromagnetism" v-if="settings_index == 0">
          <ul class="content_box" v-if="false">
            <li>
              <span>类型</span>
              <el-select v-model="electromagnetismTypeValue" placeholder="请选择" size="mini" style="width: 160px">
                <el-option v-for="item in electromagnetismTypeList" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              <span>电压</span>
              <el-input v-model="voltage" placeholder="请输入内容" size="mini" style="width: 160px"></el-input>
              <span>kv</span>
            </li>
            <li>
              <el-button type="primary" size="mini" @click="addRow">增加列 +
              </el-button>
            </li>
            <div class="pointList_box">
              <el-scrollbar>
                <li v-for="(item, index) in positionList" :key="index">
                  <span>经度</span>
                  <el-input v-model="item.lng" placeholder="请输入内容" size="mini" style="width: 160px"></el-input>
                  <span>纬度</span>
                  <el-input v-model="item.lat" placeholder="请输入内容" size="mini" style="width: 160px"></el-input>
                  <el-button type="primary" size="mini" @click="getPoint(index)" style="margin-left: 10px">地图选点
                  </el-button>
                  <el-button type="danger" size="mini" @click="removeRow(index)" style="margin-left: 10px">删除
                  </el-button>
                </li>
              </el-scrollbar>
            </div>
          </ul>
          <table style="width: 100%" v-if="false">
            <tr>
              <td>名称</td>
              <td>经度</td>
              <td>纬度</td>
            </tr>
            <tr v-for="(item, index) in radioStation" :key="index">
              <td>{{ item.label }}</td>
              <td>{{ item.position.lng }}</td>
              <td>{{ item.position.lat }}</td>
            </tr>
          </table>
          <el-table :data="radioStation" size="mini" height="400px">
            <el-table-column label="名称" prop="name" align="center"></el-table-column>
            <el-table-column label="经度" align="center">
              <template slot-scope="scope">
                {{ scope.row.position.x }}
              </template>
            </el-table-column>
            <el-table-column label="纬度" prop="lat" align="center">
              <template slot-scope="scope">
                {{ scope.row.position.y }}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="lat" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="getPoint(scope.row, scope.$index)"
                  style="margin-left: 10px">
                  地图选点
                </el-button>
                <el-button type="danger" size="mini" @click="removeRowData(scope.$index)" style="margin-left: 10px">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding: 10px; text-align: right">
            <el-select v-model="entityList_value" placeholder="请选择" size="mini">
              <el-option v-for="(item, index) in entityList_data" :key="item.modelId" :label="item.name" :value="index">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="addCGF(2)" style="margin-left: 10px">
              新增至蓝方
            </el-button>
            <el-button type="primary" size="mini" @click="addCGF(1)" style="margin-left: 10px">
              新增至红方
            </el-button>
          </div>
        </li>
        <li class="weather" v-if="settings_index == 1">
          <table>
            <tr>
              <td>天气类型</td>
              <td>
                <el-select v-model="weatherValue" placeholder="请选择" size="mini" style="width: 160px"
                  @change="addWeather">
                  <el-option v-for="item in weatherList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>区域</td>
              <td>
                <el-select v-model="regionValue" placeholder="请选择" size="mini" @change="changeRegion">
                  <el-option v-for="(item, index) in regionList" :key="item.id" :label="item.id" :value="index">
                  </el-option>
                </el-select>
              </td>
              <td></td>
              <td></td>
            </tr>
          </table>
          <el-scrollbar>
            <div style="height: 360px">
              <el-descriptions title="云层" size="mini">
                <el-descriptions-item label="高度">
                  <el-input v-model="formLabelAlign.cloud.height" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="最大高度">
                  <el-input v-model="formLabelAlign.cloud.maxHeight" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="浓度">
                  <el-input v-model="formLabelAlign.cloud.concentration" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="天气" size="mini" :column="4">
                <el-descriptions-item label="温度">
                  <el-input v-model="formLabelAlign.weather.temp" style="width: 70px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="湿度">
                  <el-input v-model="formLabelAlign.weather.humidity" style="width: 70px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="气压">
                  <el-input v-model="formLabelAlign.weather.pressure" style="width: 70px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="雨量">
                  <el-input v-model="formLabelAlign.weather.rainfall" style="width: 70px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="风速表">
                  <el-table :data="formLabelAlign.weather.wind" style="width: 450px" size="mini">
                    <el-table-column prop="height" label="高度">
                    </el-table-column>
                    <el-table-column label="风向">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.wind_d" style="width: 70px" size="mini"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="风速">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.wind_s" style="width: 70px" size="mini"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="海洋" size="mini">
                <el-descriptions-item label="海况">
                  <el-input v-model="formLabelAlign.ocean.seaState" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="浪向">
                  <el-input v-model="formLabelAlign.ocean.wave_d" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="浪高">
                  <el-input v-model="formLabelAlign.ocean.wave_h" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="洋流表">
                  <el-table :data="formLabelAlign.ocean.flow" style="width: 450px" size="mini">
                    <el-table-column prop="depth" label="深度">
                    </el-table-column>
                    <el-table-column label="流向">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.flow_d" style="width: 70px" size="mini">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="速度">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.flow_s" style="width: 70px" size="mini">
                        </el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="视觉" size="mini">
                <el-descriptions-item label="最大范围">
                  <el-input v-model="formLabelAlign.vision.maximumRange" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="识别范围">
                  <el-input v-model="formLabelAlign.vision.identificationRange" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="红外" size="mini">
                <el-descriptions-item label="最大范围">
                  <el-input v-model="formLabelAlign.infrared.maximumRange" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="识别范围">
                  <el-input v-model="formLabelAlign.infrared.identificationRange" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="声呐" size="mini" :column="1">
                <el-descriptions-item label="最大范围">
                  <el-input v-model="formLabelAlign.sonar.maximumRange" style="width: 80px" size="mini">
                  </el-input>
                </el-descriptions-item>
                <el-descriptions-item label="洋流表">
                  <el-table :data="formLabelAlign.sonar.thermocline" style="width: 450px" size="mini">
                    <el-table-column prop="depth" label="深度">
                    </el-table-column>
                    <el-table-column label="温度">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.temp" style="width: 70px" size="mini"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions title="雷达" size="mini">
                <el-descriptions-item label="雷达探测范围">
                  <el-table :data="formLabelAlign.radar" style="width: 450px" size="mini">
                    <el-table-column prop="frequency" label="频率">
                    </el-table-column>
                    <el-table-column label="范围">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.range" style="width: 70px" size="mini"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-scrollbar>
        </li>
      </ul>
    </div>
    <footer>
      <el-button type="primary" size="mini" @click="sendnDocument">确定</el-button>
      <el-button type="danger" size="mini" @click="removeDocument">取消</el-button>
    </footer>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
export default {
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      settings_index: 0,
      settingsList: [
        {
          label: "电磁环境设置",
        },
        {
          label: "气象环境设置",
        },
      ],
      electromagnetismTypeValue: "",
      electromagnetismTypeList: [{ label: "电台", value: "电台" }],
      voltage: "",
      positionList: [
        { lng: "", lat: "", high: "" },
        { lng: "", lat: "", high: "" },
      ],
      regionValue: "",
      regionList: [],
      weatherValue: "",
      weatherList: [
        {
          label: "晴",
          value: "0",
        },
        {
          label: "多云",
          value: "1",
        },
        {
          label: "雾",
          value: "2",
        },
        {
          label: "雾霾",
          value: "3",
        },
        {
          label: "大雨",
          value: "4",
        },
        {
          label: "中雨",
          value: "5",
        },
        {
          label: "小雨",
          value: "6",
        },
        {
          label: "大雪",
          value: "7",
        },
        {
          label: "中雪",
          value: "8",
        },
        {
          label: "小雪",
          value: "9",
        },
      ],
      wd: "",
      ws: "",
      temp: "",
      humidity: "",
      cloudBaseHeight: "",
      visibility: "",
      pressure: "",
      index: "",
      clickType: "off",
      amountOfRainAndSnow_value: "",
      amountOfRainAndSnow_list: [
        {
          label: "无",
          value: 3,
        },
        {
          label: "小",
          value: 2,
        },
        {
          label: "中",
          value: 1,
        },
        {
          label: "大",
          value: 0,
        },
      ],
      radioStation: [
        {
          name: "电台",
          value: "电台",
          lng: "110",
          lat: "30",
        },
      ],
      formLabelAlign: {
        cloud: { height: "", maxHeight: "", concentration: "" },
        weather: {
          wind: [],
          temp: "",
          humidity: "",
          pressure: "",
          rainfall: "",
        },
        ocean: {
          flow: [],
          seaState: "",
          wave_d: "",
          wave_h: "",
        },
        vision: { maximumRange: "", identificationRange: "" },
        infrared: { maximumRange: "", identificationRange: "" },
        sonar: {
          thermocline: [],
          maximumRange: "",
        },
        radar: [],
        id: "",
      },
      entityList_value: [],
      entityList_data: [],
    };
  },
  mounted() {
    this.getRadioStation();

    this.regionList = CGFListLoad.datamodel.environmentNodes.list;
    this.length = CGFListLoad.datamodel.environmentNodes.list.length;
    console.log(this.regionList);

    let rootList = CGFListLoad.GenericGateway.GetEquipSchemaNode(1);
    let entityList = CGFListLoad.GenericGateway.GetEquipNodes(
      rootList.children[8]
    );
    for (let i = 0; i < entityList.length; i++) {
      const element = entityList[i].modelId;
      if (element == "111000001" || element == "111000002" || element == "111000003" || element == "111000004" || element == "111000005") {
        this.entityList_data.push(entityList[i])
      }
    }
    if (CGFListLoad.environmentData) {
      this.weatherValue = CGFListLoad.environmentData.weatherType;
      this.regionValue = CGFListLoad.environmentData.regionValue;
      this.formLabelAlign = JSON.parse(JSON.stringify(CGFListLoad.environmentData))
    }
    // this.entityList_data = entityList;
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
    getRadioStation() {
      this.radioStation = [];
      for (let i = 0; i < this.$store.state.CGFListData.length; i++) {
        const element = this.$store.state.CGFListData[i];
        this.getElectromagnetism(element);
      }
    },
    getElectromagnetism(node) {
      if (node.children != undefined) {
        if (node.children.length < 1) {
          if (node.typeId == 111) {
            this.radioStation.push(node);
          }
        } else {
          for (let i = 0; i < node.children.length; i++) {
            this.getElectromagnetism(node.children[i]);
          }
        }
      } else {
        if (node.typeId == 111) {
          this.radioStation.push(node);
        }
      }
    },
    addRow() {
      let data = {
        lng: "",
        lat: "",
        high: "",
      };
      this.positionList.push(data);
    },
    removeRow(index) {
      this.positionList.splice(index, 1);
    },
    getPoint(row, index) {
      let div = document.getElementById("environmentSettings");
      div.style.left = "-1000px";
      this.clickType = "on";
      this.$map.map.on("click", this.getLngLat);
      this.index = index;
      this.rowData = row;
      console.log(row);
      console.log(index);
    },
    getLngLat(e) {
      if (this.clickType == "off") {
        return;
      }
      let lnglat = turf.toWgs84(e.coordinate);
      this.rowData.position.x = Number(lnglat[0]);
      this.rowData.position.y = Number(lnglat[1]);
      let div = document.getElementById("environmentSettings");
      div.style.left = "50%";
      this.clickType = "off";
      console.log(this.rowData)
      this.rowData.position.x = Number(this.rowData.position.x)
      this.rowData.position.y = Number(this.rowData.position.y)
      CGFListLoad.addPosition(this.rowData);
      this.getRadioStation();
    },
    removeRowData(index) {
      console.log(this.radioStation[index])
      CGFListLoad.removeRenderCGF(this.radioStation[index])
      this.getRadioStation();
    },
    sendnDocument() {
      // console.log(this.formLabelAlign);
      CGFListLoad.environmentData = JSON.parse(JSON.stringify(this.formLabelAlign))
      CGFListLoad.environmentData.weatherType = this.weatherValue;
      CGFListLoad.environmentData.regionValue = this.regionValue;
      this.$store.state.environmentSettings_show = false;
    },
    removeDocument() {
      this.$store.state.environmentSettings_show = false;
    },
    changeRegion(index) {
      this.formLabelAlign = this.regionList[index];
    },
    addCGF(model) {
      var node = this.entityList_data[this.entityList_value];
      var parentData = CGFListLoad.datamodel.GetRootCGFEntity(model);
      console.log(node);
      console.log(parentData);
      CGFListLoad.addCGF(node, parentData);
      this.getRadioStation();
    },
    addWeather(weatherValue) {
      this.regionList[this.length] = weatherValue;
      console.log(this.regionList);
    },
  },
};
</script>

<style scoped>
#environmentSettings {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  width: 750px;
  /* margin-left: -375px; */
  overflow: hidden;
  height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  font-size: 12px;
  flex-grow: 1;
  display: flex;
  padding: 10px;
}

.settingsList_box {
  border-right: 1px solid #ccc;
}

.settingsList_box li {
  width: 100px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.settingsList_box .select {
  background-color: #2593ffaa;
}

.settings_box {
  padding-left: 10px;
  flex-grow: 1;
}

.settings_box table tr td {
  padding: 10px;
}

footer {
  text-align: right;
  padding: 0 10px 10px 0;
}

.electromagnetism {
  height: 250px;
}

.content_box li {
  display: flex;
  padding: 10px 0;
  align-items: center;
  margin-right: 10px;
}

.content_box li span {
  display: inline-block;
  /* width: 50px; */
  padding: 0 10px;
}

.pointList_box {
  height: 100px;
}

a {
  position: fixed;
}
</style>