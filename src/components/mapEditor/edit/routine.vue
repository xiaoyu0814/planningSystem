<template>
  <div id="routine">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template slot="title"><span class="title">基本的</span></template>
        <el-form ref="form" :model="getCGFSelectData" label-width="80px" size="mini">
          <el-form-item label="类型">
            {{ tyTest(getCGFSelectData.typeId) }}
          </el-form-item>
          <el-form-item label="型号">
            {{ equipmentNodes[getCGFSelectData.modelId] }}
          </el-form-item>
          <el-form-item label="所属方">
            {{
                getCGFSelectData.side == 1
                  ? "红方"
                  : getCGFSelectData.side == 2
                    ? "蓝方"
                    : getCGFSelectData.side == 3
                      ? "绿方"
                      : "橙方"
            }}
          </el-form-item>
          <el-form-item label="是否可见" v-if="visible">
            <el-radio-group v-model="getCGFSelectData.visible">
              <el-radio :label="true">可见</el-radio>
              <el-radio :label="false">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title"><span class="title">通用的</span></template>
        <el-form ref="form" :model="getCGFSelectData" label-width="80px" size="mini">
          <el-form-item label="名称">
            <div v-if="disabled">
              <el-input id="infoName" v-model="getCGFSelectData.name" style="width: 200px" @blur="rename"></el-input>
            </div>
            <div v-else>
              {{ getCGFSelectData.name }}
            </div>
          </el-form-item>
          <el-form-item label="后缀" v-if="false">
            {{ getCGFSelectData.suffix }}
          </el-form-item>
          <el-form-item label="载体平台" v-if="false">
            <el-switch v-model="getCGFSelectData.carrierPlatform"></el-switch>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title"><span class="title">机动</span></template>
        <el-form ref="form" :model="getCGFSelectData.position" label-width="80px" size="mini">
          <el-form-item label="经度">
            <div v-if="disabled">
              <el-input id="infoLng" v-model="getCGFSelectData.position.x" style="width: 200px" @input="changePosition">
              </el-input>
            </div>
            <div v-else>
              {{ getCGFSelectData.position.x }}
            </div>
          </el-form-item>
          <el-form-item label="纬度">
            <div v-if="disabled">
              <el-input id="infoLat" v-model="getCGFSelectData.position.y" style="width: 200px" @input="changePosition">
              </el-input>
            </div>
            <div v-else>
              {{ getCGFSelectData.position.y }}
            </div>
          </el-form-item>
          <el-form-item label="高度">
            <div v-if="disabled">
              <el-input id="infoHeight" v-model="getCGFSelectData.position.z" style="width: 200px"
                @input="changePosition"></el-input>
            </div>
            <div v-else>
              {{ getCGFSelectData.position.z }}
            </div>
          </el-form-item>
          <el-form-item label="方向">
            <div v-if="disabled">
              <el-input id="infoDirection" v-model="getCGFSelectData.heading" style="width: 200px"></el-input>
            </div>
            <div v-else>
              {{ getCGFSelectData.heading }}
            </div>
          </el-form-item>
          <el-form-item label="速度">
            <div v-if="disabled">
              <el-input id="infoSpeed" v-model="getCGFSelectData.speed" style="width: 200px"></el-input>
            </div>
            <div v-else>
              {{ getCGFSelectData.speed }}
            </div>
          </el-form-item>
          <el-form-item label="在区随机位置" v-if="false">
            <el-input v-model="getCGFSelectData.randomLocationInZone" style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="4" v-if="disabled">
        <template slot="title"><span class="title">行为</span></template>
        <el-form ref="form" :model="getCGFSelectData" label-width="80px" size="mini">
          <el-form-item label="行动">
            <el-select v-model="getCGFSelectData.doctrineId" placeholder="请选择" style="width: 200px"
              @change="changeDoctrine">
              <el-option v-for="(item, index) in doctrineList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="队形">
            <el-select v-model="getCGFSelectData.formationId" placeholder="请选择" style="width: 200px"
              @change="changeFormation">
              <el-option v-for="(item, index) in formationList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标" v-if="false">
            <el-switch v-model="getCGFSelectData.target"></el-switch>
          </el-form-item>
          <el-form-item label="指挥官" v-if="false">
            <el-switch v-model="getCGFSelectData.commander"></el-switch>
          </el-form-item>
          <el-form-item label="基地">
            <!-- <el-switch v-model="getCGFSelectData.base"></el-switch> -->
            <el-cascader v-model="base_value" :options="CGFListData" :props="{
              value: 'id',
              label: 'name',
            }" @change="setBase" style="width: 200px" :show-all-levels="false"></el-cascader>
          </el-form-item>
          <el-form-item label="食物分量" v-if="false">
            <el-input v-model="getCGFSelectData.foodWeight" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="水" v-if="false">
            {{ getCGFSelectData.water }}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="5" v-if="false">
        <template slot="title"><span class="title">地理数据</span></template>
        <el-form ref="form" :model="getCGFSelectData" label-width="80px" size="mini">
          <el-form-item label="兴趣点">
            <el-button type="primary" @click="open('兴趣点')" style="margin-left: 10px">拾取</el-button>
          </el-form-item>
          <el-form-item label="">
            经度：
            <el-input v-if="false" id="infoInterestPoint" v-model="getCGFSelectData.geoData.interestPoint.x"
              style="width: 200px"></el-input>
            <span>{{ info.geoData ? info.geoData.interestPoint.x : "" }}</span>
          </el-form-item>
          <el-form-item label="">
            纬度：
            <el-input v-if="false" id="infoInterestPoint" v-model="getCGFSelectData.geoData.interestPoint.y"
              style="width: 200px"></el-input>
            <span>{{ info.geoData ? info.geoData.interestPoint.y : "" }}</span>
          </el-form-item>
          <el-form-item label="兴趣区域">
            <el-select v-model="getCGFSelectData.interestArea" placeholder="请选择" style="width: 200px"
              @change="changeInterestArea">
              <el-option v-for="(item, index) in area_list" :key="index" :label="item.name" :value="item.num">
              </el-option>
            </el-select>
            <el-button type="primary" @click="open('兴趣区域')" style="margin-left: 10px">新建</el-button>
          </el-form-item>
          <el-form-item label="操作区域">
            <el-select v-model="getCGFSelectData.operationArea" placeholder="请选择" style="width: 200px"
              @change="changeOperationArea">
              <el-option v-for="(item, index) in area_list" :label="item.name" :value="item.num" :key="index">
              </el-option>
            </el-select>
            <el-button type="primary" @click="open('操作区域')" style="margin-left: 10px">新建</el-button>
          </el-form-item>
          <el-form-item label="操作路线">
            <el-select v-model="getCGFSelectData.operationRoute" placeholder="请选择" style="width: 200px"
              @change="changeRoutePath">
              <el-option v-for="(item, index) in operationRoute_list" :label="item.name" :value="item.id" :key="index">
              </el-option>
            </el-select>
            <el-button type="primary" @click="open('操作路线')" style="margin-left: 10px">新建</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import DoctrineNode from "@/utils/EquipSchema/DoctrineNode";
import { AreaTypes } from "@/utils/SimDataModel/NodeConfig";
import GeoData from "@/utils/SimDataModel/GeoData";
import DrawPoint from "@/utils/SimDataModel/DrawPoint";
import FormationNode from "@/utils/EquipSchema/FormationNode";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      radio: true,
      activeNames: ["1", "2", "3", "4", "5"],
      doctrineList: [],
      area_list: [],
      operationRoute_list: [],
      interestPoint: {
        x: "",
        y: "",
        z: "",
      },
      number: 0,
      formationList: "",
      base_value: [],
      equipmentNodes: "",
      typeArray: [],

      tyTest: this.getType,
      disabled: true,
      visible: false,
    };
  },
  computed: {
    ...mapGetters(["getCGFSelectData"]),
    info() {
      return this.$store.state.CGF_nodeData;
    },
  },
  created() {
    this.$root.$on("test", this.init);
  },
  mounted() {
    this.equipmentNodes = CGFListLoad.datamodel.equipmentNodes.list;
    this.CGFListData = this.$store.state.CGFListData;
    for (let i = 0; i < this.CGFListData.length; i++) {
      this.removeKEY_children(this.CGFListData[i]); // 获取基地
    }
    for (let i = 0; i < this.CGFListData.length; i++) {
      this.getCGF(this.$store.state.CGFListData[i]); // 获取兵力类型路径
    }
    if (!this.$store.state.teacher) {
      this.visible = false;
      if (this.getCGFSelectData.side == 2) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    } else {
      this.visible = true;
    }

    this.init();
  },

  methods: {
    getType(id) {
      let array = [];
      function getName(typeId) {
        let node = CGFListLoad.GenericGateway.GetEquipSchemaNode(typeId);
        array.unshift(node.name);
        if (node.parent) {
          getName(node.parent.typeId);
        } else {
          return;
        }
      }
      getName(id);
      return array.join(" > ");
    },
    getModel(id) {
      let text = "";
      function getName(typeId) {
        let node = CGFListLoad.GenericGateway.GetEquipSchemaNode(typeId);
        array.unshift(node.name);
      }
      getName(id);
      return text;
    },
    removeKEY_children(node) {
      if (node.children != undefined) {
        if (node.children.length < 1) {
          if (node.nodeType == "指挥") {
          } else {
            delete node["children"];
          }
        } else {
          for (let i = 0; i < node.children.length; i++) {
            this.removeKEY_children(node.children[i]);
          }
        }
      }
    },
    getCGF(node) {
      if (node.children != undefined) {
        for (let i = 0; i < node.children.length; i++) {
          this.getCGF(node.children[i]);
        }
      } else {
        if (node.id == this.info.base) {
          this.base_value = [node.id];
          let getBase = (node) => {
            this.base_value.unshift(node.id);
            if (node.parent) {
              getBase(node.parent);
            } else {
              return;
            }
          };
          getBase(node.parent);
        }
      }
    },

    changePosition(z) {
      let position = {
        x: Number(this.getCGFSelectData.position.x),
        y: Number(this.getCGFSelectData.position.y),
        z: Number(this.getCGFSelectData.position.z),
      };
      this.$set(this.getCGFSelectData, "position", position);
      CGFListLoad.addPosition(this.getCGFSelectData);
    },
    handleChange(val) {
      // console.log(val);
    },
    setBase(val) {
      // console.log(val);
      this.getCGFSelectData.base = val[val.length - 1];
    },
    open(type) {
      if (type == "兴趣点") {
        // this.$store.state.interestPosition_show = true;
        let _this = this;
        let data = this.getCGFSelectData;
        let drawPoint = new DrawPoint(this.$map.map);
        drawPoint.startDraw(data.id, function (point) {
          let pos = {
            x: point[0],
            y: point[1],
            z: 0,
          };
          // _this.savaInterestPos(data, pos);
          let geoData = data.getGeoData();
          if (geoData) {
            geoData.setInterestPoint(pos);
            _this.$set(_this.info.geoData, "geoData", geoData);
          } else {
            let _geoData = new GeoData();
            _geoData.setInterestPoint(pos);
            data.setGeoData(_geoData);
            _this.$set(_this.info.geoData, "geoData", _geoData);
          }
          CGFListLoad.addInterestPoint(pos, data.id);
        });
      } else if (type == "兴趣区域") {
        this.$store.state.interestAreaPath_show = true;
        console.log(this.getCGFSelectData);
      } else if (type == "操作区域") {
        this.$store.state.operationAreaPath_show = true;
      } else if (type == "操作路线") {
        this.$store.state.routePath_show = true;
      }
    },
    init() {
      let data = this.$store.state.CGF_nodeData;
      // 区域、兴趣库
      let interestAreaPath = CGFListLoad.datamodel.areaPathNodes;
      if (interestAreaPath) {
        this.area_list = [...interestAreaPath.getList()];
      }
      // 路线库
      let navPath = CGFListLoad.datamodel.routePathNodes;
      if (navPath) {
        this.operationRoute_list = [...navPath.getList()];
      }
      // 行为列表
      let initArray = [new DoctrineNode("无", -1, 0)];
      let doctrines = CGFListLoad.GenericGateway.GetDoctrineNodes(
        CGFListLoad.GenericGateway.GetEquipSchemaNode(data.getTypeId())
      );
      this.doctrineList = initArray.concat(doctrines);
      // 队形列表
      let initArray2 = [new FormationNode("无", -1, -1)];
      let formations = CGFListLoad.GenericGateway.GetFormationNodes(
        Number(data.getTypeId())
      );
      this.formationList = initArray2.concat(formations);
      // console.log(this.formationList);
    },
    rename() {
      this.getCGFSelectData.setName(this.getCGFSelectData.name);
      CGFListLoad.addPosition(this.getCGFSelectData); // 更新图层
      // console.log(this.getCGFSelectData);
    },
    changeDoctrine(id) {
      this.getCGFSelectData.setDoctrineId(id);
    },
    changeInterestArea() {
      this.navPath_list = [];
      let interestAreaPath = CGFListLoad.getAreaPath(
        this.getCGFSelectData.interestArea
      );
      this.selectAreaInfo = [
        {
          name: interestAreaPath.name,
          type: AreaTypes[interestAreaPath.type - 1].label,
          ascription: interestAreaPath.ascription,
        },
      ];
      let data = this.getCGFSelectData;
      let geoData = data.getGeoData();
      if (geoData) {
        geoData.setInterestAreaId(interestAreaPath.getNum());
      } else {
        let _geoData = new GeoData();
        _geoData.setInterestAreaId(interestAreaPath.getNum());
        data.setGeoData(_geoData);
      }
      debugger;
      let list = interestAreaPath.getList();
      this.$store.dispatch("updateAreaPathList", list);
      let aaa = CGFListLoad.datamodel.areaPathNodes;
      if (aaa) {
        this.area_list = [...aaa.getList()];
      }
    },
    changeOperationArea() {
      this.navPath_list = [];
      let operationAreaPath = CGFListLoad.getAreaPath(
        this.getCGFSelectData.operationArea
      );
      this.selectAreaInfo = [
        {
          name: operationAreaPath.name,
          type: AreaTypes[operationAreaPath.type - 1].label,
          ascription: operationAreaPath.ascription,
        },
      ];
      let data = this.getCGFSelectData;
      let geoData = data.getGeoData();
      if (geoData) {
        geoData.setOperationAreaId(operationAreaPath.getNum());
      } else {
        let _geoData = new GeoData();
        _geoData.setOperationAreaId(operationAreaPath.getNum());
        data.setGeoData(_geoData);
      }
      let list = operationAreaPath.getList();
      this.$store.dispatch("updateAreaPathList", list);
    },
    changeRoutePath() {
      let navPath = CGFListLoad.datamodel.routePathNodes.getChildById(
        this.getCGFSelectData.operationRoute
      );
      let data = this.getCGFSelectData;
      let geoData = data.getGeoData();
      if (geoData) {
        geoData.setOperationRouteId(navPath.getId());
      } else {
        let _geoData = new GeoData();
        _geoData.setOperationRouteId(navPath.getId());
        data.setGeoData(_geoData);
      }
      this.$store.dispatch("updateRoutePathList", navPath.getList());
    },
    changeFormation(value) {
      // console.log(value);
      // this.isFormationActive = node.getId();
      this.getCGFSelectData.setFormationId(value);
      // console.log(this.getCGFSelectData);
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: bold;
}
</style>