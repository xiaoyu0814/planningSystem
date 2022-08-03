<template>
  <div id="navPath" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>路线编辑</span>
      <i class="el-icon-close" @click="$store.state.routePath_show = false"></i>
    </header>
    <el-table :data="getRoutePathList" size="mini" height="200px">
      <el-table-column label="时间">
        <template slot-scope="scope">
          <el-input v-model="scope.row.stamp" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="经度" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.position.x" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.position.y" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="insert(scope.$index)" type="text" size="mini">插入</el-button>
          <el-button @click="save(scope.$index, scope.row)" type="text" size="mini">保存</el-button>
          <el-button @click="remove(scope.$index)" type="text" size="mini" style="color: #f00">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <el-button size="mini" type="primary" plain round @click="importPath">从路线组导入</el-button>
      <el-button size="mini" type="primary" plain round @click="exportPath">新增</el-button>
      <el-button size="mini" type="danger" plain round @click="clearNav">清除</el-button>
      <!-- <el-button size="mini" type="primary" plain round @click="exportPath"
        >新增到路线组</el-button
      > -->
      <!-- <el-button size="mini" type="primary" plain round @click="updatePath"
        >替换航线</el-button
      > -->
    </footer>

    <el-dialog title="选择路线" :visible.sync="changeNavPath_show" width="300px" append-to-body>
      <span>路线：</span>
      <el-select v-model="routePath_value" placeholder="请选择" size="mini">
        <el-option v-for="(item, index) in routePath_list" :label="item.name" :value="item.id" :key="index"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeNavPath_show = false">取 消</el-button>
        <el-button type="primary" @click="changeNavPath">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增路线" :visible.sync="navPath_show" width="300px" append-to-body>
      <el-form label-width="80px" :model="formRoute">
        <el-form-item label="路线名称">
          <el-input v-model="formRoute.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="路线编号">
          <el-input-number size="mini" v-model="formRoute.number"></el-input-number>
        </el-form-item>
        <el-form-item label="路线宽度">
          <el-input-number size="mini" v-model="formRoute.width"></el-input-number>
        </el-form-item>
        <el-form-item label="路线颜色">
          <el-color-picker v-model="formRoute.color"></el-color-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPath_show = false">取 消</el-button>
        <el-button type="primary" @click="clickExport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import DrawLine from "@/utils/SimDataModel/DrawLine";
import { mapGetters } from "vuex";
import RoutePath from "@/utils/Route/RoutePath";
import { NodeUnit, SideEnum } from "@/utils/SimDataModel/NodeConfig";

import GeoData from "@/utils/SimDataModel/GeoData";
export default {
  computed: {
    ...mapGetters(["getRoutePathList"]),

    navPathId() {
      return this.$store.state.routePathId;
    },
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
      routePath_value: "",
      routePath_list: [],
      routePath_name: "",
      navPath_show: false,
      routePathUpdate_show: false,

      newRoutePath: false,
      formRoute: {
        name: "",
        width: 1,
        num: -1,
        color: "#000000",
      },
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
    insert(index) {
      // console.log("insert");
      let data = this.$store.state.CGF_nodeData;
      let nav = {
        stamp: 0,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      };
      data.getRoutePath().insertNavPointByIndex(index, nav);
      //this.tableData.splice(index, 0, nav)
      CGFListLoad.updataNavPathLayer(this.$store.state.CGF_nodeData);
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
        this.$store.state.CGF_nodeData
          .getRoutePath()
          .setNavPointByIndex(index, temp);
        CGFListLoad.updataNavPathLayer(this.$store.state.CGF_nodeData);
        this.insert_type = false;
      } else {
        this.$store.state.CGF_nodeData
          .getRoutePath()
          .setNavPointByIndex(index, temp);
        // console.log(CGFListLoad);
        // console.log(this.routePath_list);
        CGFListLoad.updataNavPathLayer(this.$store.state.CGF_nodeData);
      }
    },
    remove(index) {
      // console.log("remove");
      this.routePath_list = [];
      //this.tableData[this.navPathId].splice(index, 1);
      this.$store.state.CGF_nodeData
        .getRoutePath()
        .removeNavPointByIndex(index);
      CGFListLoad.updataNavPathLayer(this.$store.state.CGF_nodeData);
    },
    setRoute(data, id) {
      let geoData = data.getGeoData();
      if (geoData) {
        geoData.setOperationRouteId(id);
      } else {
        let _geoData = new GeoData();
        _geoData.setOperationRouteId(id);
        data.setGeoData(_geoData);
      }
    },
    clearNav() {
      // console.log("clear");
      this.routePath_list = [];
      let _this = this;
      let data = this.$store.state.CGF_nodeData;
      this.setRoute(data, -1);
      // CGFListLoad.removeNavPathLayer(data.id);
      this.$store.dispatch("updateRoutePathList", []);
      //this.tableData[this.navPathId] = [];
      this.$root.$emit("test");
    },
    addNewNav(color) {
      // console.log("add");
      let _this = this;
      // this.routePath_list = [];
      let data = this.$store.state.CGF_nodeData;
      // console.log(data);
      //let _navPath = new NavPath();
      // let color = CGFListLoad.getColorBySide(data.getSide());
      var drawLine = new DrawLine(this.$map.map);
      drawLine.startDraw(
        _this.newRoutePath.getId() + "_route_",
        color,
        function (point) {
          var navPoint = {
            stamp: 0,
            position: {
              x: point[0],
              y: point[1],
              z: 0,
            },
          };
          _this.newRoutePath.AddNavPoint(navPoint);
          _this.$store.dispatch(
            "updateRoutePathList",
            _this.newRoutePath.getList()
          );
          // _this.tableData.push(navPoint);
          console.log(1414141)
        },
        function (linelayer) {
          // CGFListLoad.addNavPathLayer(linelayer);
          // _this.$set( _this, 'tableData',  data.getNavPath())
          //data.setNavPath(_navPath)
        }
      );
    },
    importPath() {
      let navPath = CGFListLoad.datamodel.routePathNodes;
      this.changeNavPath_show = true;
      if (navPath) {
        this.routePath_list = [...navPath.getList()];
      }
    },
    exportPath() {
      this.navPath_show = true;
      let data = this.$store.state.CGF_nodeData;

      this.routePath_name = nav.name;
    },
    clickExport() {
      let name = this.formRoute.name;
      let num = this.formRoute.number;
      let width = this.formRoute.width;
      let _routePath = new RoutePath();
      _routePath.setName(name);
      _routePath.setNum(Number(num));
      _routePath.setWidth(Number(width));
      CGFListLoad.datamodel.routePathNodes.addChild(_routePath);
      // _routePath.setId(name);

      this.newRoutePath = _routePath;
      // console.log(this.newRoutePath);
      this.$store.dispatch("updateRoutePathList", []);
      this.addNewNav(this.formRoute.color);

      this.$root.$emit("test")
      this.navPath_show = false;
    },
    changeNavPath() {
      this.changeNavPath_show = false;
      // this.tableData = [];
      this.routePath_list = [];
      let navPath = CGFListLoad.datamodel.routePathNodes.getChildById(
        this.routePath_value
      );
      // console.log(navPath, this.routePath_value);
      // let _navPath = navPath.clone();
      let data = this.$store.state.CGF_nodeData;

      this.setRoute(data, navPath.getId());
      // CGFListLoad.updataNavPathLayer(data);
      this.$store.dispatch("updateRoutePathList", navPath.getList());
    },
  },
};
</script>

<style>
#navPath {
  box-shadow: 0 0 10px rgb(89, 147, 255);
  background-color: #fff;
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  color: #fff;
}

footer {
  padding: 10px;
  background-color: #fff;
}
</style>