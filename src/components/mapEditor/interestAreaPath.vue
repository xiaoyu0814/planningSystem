<template>
  <div id="interestAreaPath" ref="box" @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>兴趣区域</span>
      <i class="el-icon-close" @click="$store.state.interestAreaPath_show = false"></i>
    </header>
    <el-table :data="selectAreaInfo" size="mini" height="80px">
      <el-table-column label="名字" width="100px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="区域" width="100px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.type" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="属方" width="100px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ascription" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="save(scope.row, scope.$index)" type="text" size="mini">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="getAreaPathList" size="mini" height="200px">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="经度" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.position.x" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.position.y" size="mini"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <el-button size="mini" type="primary" plain round @click="importPath">从区域组导入</el-button>
      <el-button size="mini" type="primary" plain round @click="addNewNav">新增区域</el-button>
      <el-button size="mini" type="danger" plain round @click="clearNav">移除区域</el-button>
    </footer>

    <el-dialog title="选择区域" :visible.sync="changeNavPath_show" width="300px" append-to-body>
      <span>区域：</span>
      <el-select v-model="areaPath_value" placeholder="请选择" size="mini">
        <el-option v-for="(item, index) in navPath_list" :label="item.name" :value="item.num" :key="index"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeNavPath_show = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="changeNavPath" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="区域导入" :visible.sync="navPath_show" width="300px" append-to-body>
      <span>名称：</span>
      <el-input v-model="navPath_name" size="mini"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPath_show = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="clickExport" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="区域更新" :visible.sync="navPathUpdate_show" width="300px" append-to-body>
      <span>已有区域：</span>
      <el-select v-model="areaPath_value" placeholder="请选择" size="mini">
        <el-option v-for="(item, index) in navPath_list" :label="item.name" :value="item.num" :key="index"></el-option>
      </el-select>
      <span>新名称：</span>
      <el-input v-model="navPath_name" size="mini"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPathUpdate_show = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="clickUpdate" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增区域" :visible.sync="newAreaPath_show" width="300px" append-to-body>
      <el-form label-width="80px" :model="fromAreaPath">
        <el-form-item label="区域名称">
          <el-input v-model="fromAreaPath.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="区域类型">
          <el-select v-model="fromAreaPath.type" placeholder="请选择" size="mini">
            <el-option v-for="(item, index) in areaTypes" :label="item.label" :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属方">
          <el-select v-model="fromAreaPath.ascription" placeholder="请选择" size="mini">
            <el-option v-for="(item, index) in areaAscriptions" :label="item.label" :value="item.label" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newAreaPath_show = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="startDraw" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import {
  NodeUnit,
  SideEnum,
  AreaTypes,
  AreaAscriptions,
} from "@/utils/SimDataModel/NodeConfig";
import DrawPolygon from "@/utils/Draw/DrawPolygon";
import { mapGetters } from "vuex";
import AreaLibPath from "@/utils/Area/AreaLibPath";
import GeoData from "@/utils/SimDataModel/GeoData";
export default {
  computed: {
    ...mapGetters(["getAreaPath", "getAreaPathList"]),
  },
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      insert_type: false,
      changeNavPath_show: false,
      areaPath_value: "",
      navPath_list: [],
      navPath_name: "",
      navPath_show: false,
      navPathUpdate_show: false,

      areaTypes: AreaTypes,
      areaAscriptions: AreaAscriptions,
      newAreaPath_show: false,
      fromAreaPath: {
        name: "",
        type: -1,
        ascription: "无",
      },
      selectAreaInfo: [
        {
          name: "",
          type: "",
          ascription: "",
        },
      ],
    };
  },
  mounted() { },
  methods: {
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
      if (event.target.id == "infoName") {
        return;
      }
      let moveLeft = event.pageX - this.moveDataelse.x + "px";
      let moveTop = event.pageY - this.moveDataelse.y + "px";
      this.$refs.box.style.left = moveLeft;
      this.$refs.box.style.top = moveTop;
      this.$refs.box.style.right = "auto";
      if (event.currentTarget.style) {
        event.currentTarget.style.cursor = "move";
      }
    },
    mouseUpHandleelse(event) {
      window.onmousemove = null;
      event.currentTarget.style.cursor = "default";
    },
    // 移动弹窗方法 END
    clearNav() {
      // console.log("clear");
      this.navPath_list = [];
      let data = this.$store.state.CGF_nodeData;
      let geoData = data.getGeoData();
      if (geoData) {
        let areaId = geoData.getInterestAreaId();
        CGFListLoad.datamodel.areaPathNodes.removeChildByNum(areaId);
        CGFListLoad._cgfEntityLayer.removeRenderCGFAreaByAreaId(areaId);
        geoData.setInterestAreaId(-1);
      }
      this.$store.dispatch("updateAreaPathList", []);
      this.$root.$emit("test");
    },
    startDraw() {
      let _this = this;
      this.newAreaPath_show = false;
      // console.log(this.fromAreaPath);
      this.navPath_list = [];
      this.$store.dispatch("updateAreaPathList", []);
      let data = this.$store.state.CGF_nodeData;

      let _areaPath = new AreaLibPath();
      NodeUnit.areaPathNum++;
      let num = NodeUnit.areaPathNum;
      _areaPath.setNum(num);
      _areaPath.setName(this.fromAreaPath.name);
      _areaPath.setType(this.fromAreaPath.type);
      _areaPath.setAscription(this.fromAreaPath.ascription);
      // console.log(this.fromAreaPath.type);
      this.selectAreaInfo = [
        {
          name: this.fromAreaPath.name,
          type: AreaTypes[this.fromAreaPath.type + 1].label,
          ascription: this.fromAreaPath.ascription,
        },
      ];
      var drawLine = new DrawPolygon(this.$map.map);
      drawLine.startDraw(
        _areaPath.getNum(),
        "#00ff00",
        function (point) {
          var navPoint = {
            position: {
              x: point[0],
              y: point[1],
              z: 0,
            },
          };
          _areaPath.AddAreaPoint(navPoint);
          _this.$store.dispatch("updateAreaPathList", _areaPath.getList());
        },
        function (polylayer) {
          CGFListLoad.datamodel.areaPathNodes.addChild(_areaPath);
          let geoData = data.getGeoData();
          if (geoData) {
            geoData.setInterestAreaId(_areaPath.getNum());
          } else {
            let _geoData = new GeoData();
            _geoData.setInterestAreaId(_areaPath.getNum());
            data.setGeoData(_geoData);
          }
          // data.setAreaId(_areaPath.getNum());
          polylayer.areaId = _areaPath.getNum();
          CGFListLoad._cgfEntityLayer.CGFAreaListLayers.addChild(polylayer);

          _this.$root.$emit("test");
        }
      );
    },
    addNewNav() {
      // console.log("add");
      this.newAreaPath_show = true;
      //this.clearNav();
    },
    importPath() {
      let interestAreaPath = CGFListLoad.datamodel.areaPathNodes;
      // console.log(interestAreaPath);
      this.changeNavPath_show = true;
      if (interestAreaPath) {
        this.navPath_list = [...interestAreaPath.getList()];
      }
      // console.log(this.navPath_list);
    },
    exportPath() {
      this.navPath_show = true;
      let data = this.$store.state.CGF_nodeData;

      //this.navPath_name = nav.name;
    },
    clickExport() {
      this.navPath_show = false;
      let name = this.navPath_name;
      let data = this.$store.state.CGF_nodeData;
      let _areaPath = new AreaLibPath();
      _areaPath.setAreaPointList(this.getAreaPathList);
      _areaPath.setName(name);
      CGFListLoad.datamodel.areaPathNodes.addChild(_areaPath);
      this.navPath_show = false;
    },
    changeNavPath() {
      this.changeNavPath_show = false;
      // this.tableData = [];
      this.navPath_list = [];
      let interestAreaPath = CGFListLoad.getAreaPath(this.areaPath_value);
      // console.log(interestAreaPath);
      // console.log(AreaTypes);
      this.selectAreaInfo = [
        {
          name: interestAreaPath.name,
          type: AreaTypes[interestAreaPath.type - 1].label,
          ascription: interestAreaPath.ascription,
        },
      ];
      let data = this.$store.state.CGF_nodeData;
      let geoData = data.getGeoData();
      if (geoData) {
        geoData.setInterestAreaId(interestAreaPath.getNum());
      } else {
        let _geoData = new GeoData();
        _geoData.setInterestAreaId(interestAreaPath.getNum());
        data.setGeoData(_geoData);
      }
      let list = interestAreaPath.getList();
      this.$store.dispatch("updateAreaPathList", list);
    },
    updatePath() {
      let navPath = CGFListLoad.datamodel.navPathNodes;
      this.navPathUpdate_show = true;
      if (navPath) {
        this.navPath_list = [...navPath.getList()];
      }
    },
    clickUpdate() {
      this.navPathUpdate_show = false;
      //this.tableData = [];
      this.areaPath_list = [];
      let data = this.$store.state.CGF_nodeData;
      let _navPath = data.getNavPath().clone();
      _navPath.setName(this.navPath_name);
      CGFListLoad.datamodel.navPathNodes.setChildByNum(
        this.areaPath_value,
        _navPath
      );
    },
    save(row, index) {
      this.$root.$emit("test");
    },
  },
};
</script>

<style>
#interestAreaPath {
  box-shadow: 0 0 10px rgb(89, 147, 255);
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  color: #fff;
}
</style>