<template>
  <div id="areaPath">
    <header>
      <span>区域编辑</span>
      <i class="el-icon-close" @click="$store.state.areaPath_show = false"></i>
    </header>
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
      <el-select v-model="areaPath_value" placeholder="请选择">
        <el-option v-for="(item, index) in navPath_list" :label="item.name" :value="item.num" :key="index"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeNavPath_show = false">取 消</el-button>
        <el-button type="primary" @click="changeNavPath">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="区域导入" :visible.sync="navPath_show" width="300px" append-to-body>
      <span>名称：</span>
      <el-input v-model="navPath_name" size="mini"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPath_show = false">取 消</el-button>
        <el-button type="primary" @click="clickExport">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="区域更新" :visible.sync="navPathUpdate_show" width="300px" append-to-body>
      <span>已有区域：</span>
      <el-select v-model="areaPath_value" placeholder="请选择">
        <el-option v-for="(item, index) in navPath_list" :label="item.name" :value="item.num" :key="index"></el-option>
      </el-select>
      <span>新名称：</span>
      <el-input v-model="navPath_name" size="mini"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPathUpdate_show = false">取 消</el-button>
        <el-button type="primary" @click="clickUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import { NodeUnit, SideEnum } from "@/utils/SimDataModel/NodeConfig";
import DrawPolygon from "@/utils/Draw/DrawPolygon";
import { mapGetters } from "vuex";
import AreaPath from "@/utils/Area/AreaPath";
export default {
  computed: {
    ...mapGetters(["getAreaPath", "getAreaPathList"]),
  },
  data() {
    return {
      insert_type: false,
      changeNavPath_show: false,
      areaPath_value: "",
      navPath_list: [],
      navPath_name: "",
      navPath_show: false,
      navPathUpdate_show: false,
    };
  },
  mounted() { },
  methods: {
    insert(index) {
      // console.log("insert");
      let data = this.$store.state.addNavPath_data;
      let _areaPath = CGFListLoad.getAreaPath(data.getAreaId());
      let nav = {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      };
      _areaPath.insertAreaPointByIndex(index, nav);

      CGFListLoad.updataNavPathLayer(this.$store.state.addNavPath_data);
      this.insert_type = true;
    },
    save(index, row) {
      // console.log("save");
      let temp = {
        position: {
          x: Number(row.position.x),
          y: Number(row.position.y),
          z: Number(row.position.z),
        },
        stamp: Number(row.stamp),
      };
      if (this.insert_type) {
        this.$store.state.addNavPath_data
          .getNavPath()
          .setNavPointByIndex(index, temp);
        CGFListLoad.updataNavPathLayer(this.$store.state.addNavPath_data);
        this.insert_type = false;
      } else {
        this.$store.state.addNavPath_data
          .getNavPath()
          .setNavPointByIndex(index, temp);
        // console.log(CGFListLoad);
        // console.log(this.navPath_list);
        CGFListLoad.updataNavPathLayer(this.$store.state.addNavPath_data);
      }
    },
    remove(index) {
      // console.log("remove");
      this.navPath_list = [];
      this.$store.state.addNavPath_data
        .getNavPath()
        .removeNavPointByIndex(index);
      CGFListLoad.updataNavPathLayer(this.$store.state.addNavPath_data);
    },
    clearNav() {
      // console.log("clear");
      this.navPath_list = [];
      let data = this.$store.state.addNavPath_data;
      CGFListLoad.datamodel.areaPathNodes.removeChildByNum(data.getAreaId());
      CGFListLoad._cgfEntityLayer.removeRenderCGFAreaByAreaId(data.getAreaId());
      data.setAreaId(-1);
      this.$store.dispatch("updateAreaPathList", []);
    },
    addNewNav() {
      // console.log("add");
      //this.clearNav();
      let _this = this;
      this.navPath_list = [];
      this.$store.dispatch("updateAreaPathList", []);
      let data = this.$store.state.addNavPath_data;
      //let _navPath = new NavPath();
      let _areaPath = new AreaPath();
      var drawLine = new DrawPolygon(this.$map.map);
      drawLine.startDraw(
        data.getAreaId(),
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
          data.setAreaId(_areaPath.getNum());
          polylayer.areaId = _areaPath.getNum();
          CGFListLoad._cgfEntityLayer.CGFAreaListLayers.addChild(polylayer);
        }
      );
    },
    importPath() {
      let areaPath = CGFListLoad.datamodel.areaPathNodes;
      this.changeNavPath_show = true;
      if (areaPath) {
        this.navPath_list = [...areaPath.getList()];
      }
    },
    exportPath() {
      this.navPath_show = true;
      let data = this.$store.state.addNavPath_data;

      //this.navPath_name = nav.name;
    },
    clickExport() {
      this.navPath_show = false;
      let name = this.navPath_name;
      let data = this.$store.state.addNavPath_data;
      let _areaPath = new AreaPath();
      _areaPath.setAreaPointList(this.getAreaPathList);
      _areaPath.setName(name);
      CGFListLoad.datamodel.areaPathNodes.addChild(_areaPath);
      this.navPath_show = false;
    },
    changeNavPath() {
      this.changeNavPath_show = false;
      // this.tableData = [];
      this.navPath_list = [];
      let areaPath = CGFListLoad.getAreaPath(this.areaPath_value);
      // console.log(navPath,this.areaPath_value);
      let data = this.$store.state.addNavPath_data;
      data.setAreaId(areaPath.getNum());
      let list = areaPath.getList();
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
      let data = this.$store.state.addNavPath_data;
      let _navPath = data.getNavPath().clone();
      _navPath.setName(this.navPath_name);
      CGFListLoad.datamodel.navPathNodes.setChildByNum(
        this.areaPath_value,
        _navPath
      );
    },
  },
};
</script>

<style>
#areaPath {
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