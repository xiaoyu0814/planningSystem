<template>
  <div id="navPath" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>航路线编辑</span>
      <i class="el-icon-close" @click="$store.state.navPath_show = false"></i>
    </header>
    <el-table :data="getNavPathList" size="mini" height="360px">
      <el-table-column label="时间（秒）">
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
      <el-table-column label="高度（米）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.position.z" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="insert(scope.$index)" type="text" size="mini">
            插入
          </el-button> -->
          <!-- <el-button
            @click="save(scope.$index, scope.row)"
            type="text"
            size="mini"
          >
            保存
          </el-button> -->
          <el-button @click="remove(scope.$index)" type="text" size="mini" style="color: #f00">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <el-button size="mini" type="primary" plain round @click="importPath">
        从航线组导入
      </el-button>
      <el-button size="mini" type="primary" plain round @click="addNewNav">
        编辑
      </el-button>
      <el-button size="mini" type="danger" plain round @click="clearNav">
        清除
      </el-button>
      <el-button size="mini" type="primary" plain round @click="exportPath">
        新增到航线组
      </el-button>
      <el-button size="mini" type="primary" plain round @click="uploadPath">
        提交航线
      </el-button>
    </footer>

    <el-dialog title="选择导航线" :visible.sync="changeNavPath_show" width="300px" append-to-body>
      <span>导航线：</span>
      <el-select v-model="navPath_value" placeholder="请选择" size="mini">
        <el-option v-for="(item, index) in navPath_list" :label="item.name" :value="item.num" :key="index"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeNavPath_show = false">取 消</el-button>
        <el-button type="primary" @click="changeNavPath">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导航线导入" :visible.sync="navPath_show" width="300px" append-to-body>
      <span>名称：</span>
      <el-input v-model="navPath_name" size="mini" style="width: 200px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPath_show = false">取 消</el-button>
        <el-button type="primary" @click="clickExport">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导航线更新" :visible.sync="navPathUpdate_show" width="300px" append-to-body>
      <span>已有航线：</span>
      <el-select v-model="navPath_value" placeholder="请选择" size="mini" style="width: 180px">
        <el-option v-for="(item, index) in navPath_list" :label="item.name" :value="item.num" :key="index"></el-option>
      </el-select>
      <div style="margin-top: 10px">
        <span>新名称：</span>
        <el-input v-model="navPath_name" size="mini" style="width: 200px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="navPathUpdate_show = false">取 消</el-button>
        <el-button type="primary" @click="clickUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";
import DrawLine from "@/utils/SimDataModel/DrawLine";
import { mapGetters } from "vuex";
import { GetDistance } from "@/utils/SimDataModel/utils";
export default {
  computed: {
    ...mapGetters(["getNavPathList"]),
    tableData() {
      let nav = this.$store.state.navPathList_CGF.getNavPath().getList();

      let list = JSON.parse(JSON.stringify(nav));
      return list; // this.$store.state.navPathData;
    },
    navPathId() {
      return this.$store.state.navPathId;
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
      navPath_value: "",
      navPath_list: [],
      navPath_name: "",
      navPath_show: false,
      navPathUpdate_show: false,
    };
  },
  mounted() {
    console.log(this.getNavPathList);
    this.$store.dispatch(
      "updateNavPathList",
      this.$store.state.navPathList_CGF.getNavPath().getList()
    );
  },
  methods: {
    insert(index) {
      // console.log("insert");
      let data = this.$store.state.navPathList_CGF;
      let nav = {
        stamp: 0,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      };
      data.getNavPath().insertNavPointByIndex(index, nav);
      //this.tableData.splice(index, 0, nav)
      CGFListLoad.updataNavPathLayer(this.$store.state.navPathList_CGF);
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
        this.$store.state.navPathList_CGF
          .getNavPath()
          .setNavPointByIndex(index, temp);
        CGFListLoad.updataNavPathLayer(this.$store.state.navPathList_CGF);
        this.insert_type = false;
      } else {
        this.$store.state.navPathList_CGF
          .getNavPath()
          .setNavPointByIndex(index, temp);
        CGFListLoad.updataNavPathLayer(this.$store.state.navPathList_CGF);
      }

      this.$store.dispatch(
        "updateNavPathList",
        this.$store.state.navPathList_CGF.getNavPath().getList()
      );
    },
    remove(index) {
      // console.log("remove");
      this.navPath_list = [];
      //this.tableData[this.navPathId].splice(index, 1);
      this.$store.state.navPathList_CGF
        .getNavPath()
        .removeNavPointByIndex(index);
      CGFListLoad.updataNavPathLayer(this.$store.state.navPathList_CGF);
    },
    clearNav() {
      // console.log("clear");
      this.navPath_list = [];
      let _this = this;
      let data = this.$store.state.navPathList_CGF;
      data.getNavPath().setNavPointList([]);
      CGFListLoad.removeNavPathLayer(data.id + "_nav_");
      CGFListLoad.removeNavPathLayer(data.id + "_nav_" + "point");
      this.$store.dispatch("updateNavPathList", []);
      //this.tableData[this.navPathId] = [];
    },
    addNewNav() {
      // console.log("add");
      let _this = this;
      this.navPath_list = [];
      let data = this.$store.state.navPathList_CGF;
      //let _navPath = new NavPath();
      let num = data.getNavPath().getNavPointCount();
      let color = CGFListLoad.getColorBySide(data.getSide());
      var drawLine = new DrawLine(this.$map.map);
      drawLine.startDraw(
        data.id + "_nav_",
        color,
        function (point) {
          let list = data.getNavPath().getList();
          let time = 0;
          if (list.length > 0) {
            let fromArray = [
              list[list.length - 1].position.x,
              list[list.length - 1].position.y,
            ];
            let toArray = point;
            let distance = GetDistance(fromArray, toArray);
            console.log(distance);
            console.log(data.getSpeed());
            time = Number(distance / data.getSpeed());
          }
          console.log(typeof time);

          var navPoint = {
            stamp: Number.isFinite(time) ? time : 0,
            position: {
              x: point[0],
              y: point[1],
              z: 100,
            },
          };
          data.getNavPath().AddNavPoint(navPoint);
          _this.$store.dispatch(
            "updateNavPathList",
            data.getNavPath().getList()
          );
          // _this.tableData.push(navPoint);
          num++;
        },
        function (linelayer, iconGrap) {
          CGFListLoad.addNavPathLayer(linelayer);
          CGFListLoad.addNavPathLayer(iconGrap);

          // _this.$set( _this, 'tableData',  data.getNavPath())
          //data.setNavPath(_navPath)
        }
      );
    },
    importPath() {
      this.changeNavPath_show = true;
      // if (navPath) {
      //   this.navPath_list = [...navPath.getList()];
      // }
      let path = this.$path.scenarioFile.getRoute;
      let params = {
        creator: Number(sessionStorage.getItem("Uid")),
        courseId: Number(sessionStorage.getItem("courseId")),
      };
      this.$http.get(path, params).then((res) => {
        if (res.data.code == 0) {
          console.log(res.data.data);
          let navPath = CGFListLoad.setNavPathElement(res.data.data);
          this.navPath_list = [...navPath.getList()];
        }
      });
    },
    exportPath() {
      this.navPath_show = true;
      let data = this.$store.state.navPathList_CGF;
      let _navPath = data.getNavPath();
      let nav = JSON.parse(JSON.stringify(_navPath));
      this.navPath_name = nav.name;
    },
    clickExport() {
      var navList = CGFListLoad.datamodel.navPathNodes.getList();
      for (let i = 0; i < navList.length; i++) {
        const element = navList[i];
        if (element.name == this.navPath_name) {
          this.$message({
            message: "存在同名航线！",
            type: "error",
          });
          return;
        }
      }
      this.navPath_show = false;
      let name = this.navPath_name;
      let data = this.$store.state.navPathList_CGF;
      let _navPath = data.getNavPath().clone();
      _navPath.setName(name);
      CGFListLoad.datamodel.navPathNodes.addChild(_navPath);
      this.navPath_show = false;
      this.saveImage();
    },
    changeNavPath() {
      this.changeNavPath_show = false;
      // this.tableData = [];
      this.navPath_list = [];
      let navPath = CGFListLoad.datamodel.navPathNodes.getChildByNum(
        this.navPath_value
      );
      // console.log(navPath, this.navPath_value);
      let _navPath = navPath.clone();
      let data = this.$store.state.navPathList_CGF;
      data.setNavPath(_navPath);
      window.navPath_value = this.navPath_value;
      // this.tableData = _navPath;
      CGFListLoad.updataNavPathLayer(data);
      this.$store.dispatch("updateNavPathList", _navPath.getList());
    },
    uploadPath() {
      let xml = CGFListLoad.getNavPathElement();
      console.log(xml);
      let path = this.$path.scenarioFile.uploadRoute;
      let params = {
        courseid: Number(sessionStorage.getItem("courseId")),
        creator: Number(sessionStorage.getItem("Uid")),
        name: "路线组",
        xmlStr: xml,
      };
      this.$http.post(path, params).then((res) => {
        if (res.data.code == 0) {
          this.$message.success("提交成功");
        }
      });
    },
    clickUpdate() {
      this.navPathUpdate_show = false;
      //this.tableData = [];
      this.navPath_list = [];
      let data = this.$store.state.navPathList_CGF;
      let _navPath = data.getNavPath().clone();
      _navPath.setName(this.navPath_name);
      CGFListLoad.datamodel.navPathNodes.setChildByNum(
        this.navPath_value,
        _navPath
      );
    },
    saveImage() {
      let c = document.getElementsByTagName("canvas")[0];
      let imgUrl = c.toDataURL("image/png", 0.1);
      // console.log(imgUrl);
      let path_saveImg =
        this.$path.upload.saveBase64 +
        `?sessionid=${sessionStorage.getItem(
          "sessionid"
        )}&courseId=${sessionStorage.getItem("courseId")}`;
      let params_saveImg = {
        base64: imgUrl,
        childId: this.$store.state.progress_temp,
        txmlId: sessionStorage.getItem("xmlId"),
        userId: sessionStorage.getItem("Uid"),
        name: this.navPath_name,
      };
      this.$http.post(path_saveImg, params_saveImg).then((res) => {
        this.navPath_name = "";
        this.$message.success("保存成功");
      });
    },
    // 移动弹窗方法 START
    mouseDownHandleelse(event) {
      this.moveDataelse.x = event.pageX - this.$refs.box.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.box.offsetTop;
      event.currentTarget.style.cursor = "move";
      window.onmousemove = this.mouseMoveHandleelse;
    },
    mouseMoveHandleelse(event) {
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