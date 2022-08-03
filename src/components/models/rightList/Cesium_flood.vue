<template>
  <div id="flood">
    <header>
      <span>淹没分析</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div class="buttom_box">
      <ul>
        <li style="margin-top:3px">
          <span>水量 （吨） ：</span>
          <el-input v-model="waterVolume" placeholder="请输入内容" size="mini" style="width:120px"></el-input>
        </li>
        <li style="margin-top:3px">
          <span>流速（m/s）：</span>
          <el-input v-model="currentSpeed" placeholder="请输入内容" size="mini" style="width:120px"></el-input>
        </li>
      </ul>
      <el-button type="primary" @click="boxSelectionRange" size="small" class="btn_style" style="margin-left: 0">
        添加矩形
      </el-button>
      <el-button type="primary" @click="outletPosition" size="small" class="btn_style">
        设置出水点
      </el-button>
      <el-button type="primary" @click="startAnalysis" size="small" class="btn_style" style="margin-left: 0">
        开始分析
      </el-button>
      <el-button type="danger" @click="clear" size="small" class="btn_style">
        清除
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawTool: null,
      outlet_lon: "",
      outlet_lat: "",
      vlevel: 0,
      sT: "",
      layers: [],
      waterVolume: "",
      currentSpeed: "",
    };
  },
  mounted() {
    this.$map.changeMapType(3);
    // this.$map.map.map._cesiumViewer.camera.flyTo({
    //   destination: Cesium.Rectangle.fromDegrees(
    //     111.74796817897013,
    //     37.229679752922,
    //     112.1971258210299,
    //     37.586457478636426
    //   ),
    // });

    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2YwN2Q4ZS1iODA0LTRkZDQtYmMxNC0yNDBkNWNkMDc4MDAiLCJpZCI6NjI2NCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NTc5MTY5Nn0.ki6CLrIJtYbR2RpOoV9PDhxHcHXsQhoU69mFi8bY9Mg";
    // this.$map.map.map._cesiumViewer.terrainProvider =
    //   new Cesium.CesiumTerrainProvider({
    //     url: PIE.path.PIEterrain.test,
    //     requestWaterMask: true,
    //   });
    this.drawTool = new drawHelper.init({
      viewer: this.$map.map.map._cesiumViewer,
    });
    // setTimeout(() => {
    //   this.getFlood();
    // }, 1000);
  },
  destroyed() {
    this.clear();
  },
  methods: {
    clear() {
      drawHelper.clearAll();
      // this.$map.map.clear();
      
      for (let i = 0; i < this.layers.length; i++) {
        const element = this.layers[i];
        this.$map.map.remove(element);
      }
      window.clearInterval(this.sT); //停止出水请求
    },
    boxSelectionRange() {
      var options = {
        //默认设置
      };
      var callback = (params) => {
        console.log(params);
        this.leftbottom_lon = Cesium.Math.toDegrees(params.west);
        this.leftBottom_lat = Cesium.Math.toDegrees(params.south);
        this.rightTop_lat = Cesium.Math.toDegrees(params.north);
        this.rightTop_lon = Cesium.Math.toDegrees(params.east);
        console.log("左下角经度：" + this.leftbottom_lon);
        console.log("左下角纬度：" + this.leftBottom_lat);
        console.log("右上角经度：" + this.rightTop_lon);
        console.log("右上角纬度：" + this.rightTop_lat);
      };
      var a = drawHelper.createRectangle(options, callback);
    },
    outletPosition() {
      var options = {
        //默认设置
        iconUrl: require("../../../assets/dingwei.png"),
      };
      var callback = (params) => {
        if (drawHelper.defaults.billboardGroup) {
          if (drawHelper.defaults.billboardGroup.length > 1) {
            drawHelper.defaults._viewer.scene.primitives.remove(
              drawHelper.defaults.billboardGroup[0]
            );
          }
        }
        this.outlet_lon = params.lon.toFixed(6);

        this.outlet_lat = params.lat.toFixed(6);
      };
      drawHelper.createMarker(options, callback);
    },
    startAnalysis() {
      if (this.sT) {
        window.clearInterval(this.sT)
      }
      this.vlevel = 0
      this.floodlevel = 140;
      this.sT = window.setInterval(() => {
        this.vlevel += Number(this.currentSpeed);
        this.getFlood(
          this.leftbottom_lon,
          this.leftBottom_lat,
          this.rightTop_lon,
          this.rightTop_lat,
          this.outlet_lon,
          this.outlet_lat,
          this.floodlevel,
          this.vlevel
        );
      }, 1000);
    },
    getFlood(
      leftbottom_lon,
      leftBottom_lat,
      rightTop_lon,
      rightTop_lat,
      outlet_lon,
      outlet_lat,
      floodlevel,
      vlevel
    ) {
      if (
        !leftbottom_lon ||
        !leftBottom_lat ||
        !rightTop_lon ||
        !rightTop_lat ||
        !outlet_lon ||
        !outlet_lat
      ) {
        this.$Message.error("缺少参数");
        return;
      }
      let path = this.$path.geoTileAnalysis.getTifTileByBounds;
      let params = {
        zoom: 14,
        sLon: leftbottom_lon,
        sLat: leftBottom_lat,
        eLon: rightTop_lon,
        eLat: rightTop_lat,
        floodLon: outlet_lon,
        floodLat: outlet_lat,
        floodlevel: floodlevel,
        floodvelocity: vlevel,
        floodvolume: this.waterVolume // 立方米
      };
      this.$http.get(path, params).then((res) => {
        if (res.status == 200) {
          // console.log("data:image/png;base64," + res.value.img);
          // console.log(res.value.bbox);
          this.old_Beas64 = "data:image/png;base64," + res.data.data.img;
          this.img_box = [
            res.data.data.bbox[0],
            res.data.data.bbox[3],
            res.data.data.bbox[2],
            res.data.data.bbox[1],
          ];
          this.handle(vlevel);
          // var cloud = this.$map.cloudLayer({
          //   url: "data:image/png;base64," + res.data.data.img,
          //   projection: "EPSG:4326",
          //   isLngLat: true,
          //   region: this.img_box, // [60, -10, 150, 60],
          //   id: "floodImage"+vlevel,
          // });
          // this.layers.push(cloud);
          // if (this.layers.length > 2) {
          //   this.$map.map.remove(this.layers[0]);
          //   this.layers.shift();
          // }

          // var redRectangle = this.$map.map.map._cesiumViewer.entities.add({
          //   name: "Red translucent rectangle",
          //   rectangle: {
          //     coordinates: Cesium.Rectangle.fromDegrees(
          //       res.data.data.bbox[0],
          //       res.data.data.bbox[3],
          //       res.data.data.bbox[2],
          //       res.data.data.bbox[1]
          //     ),
          //     fill: false,
          //     outline: true,
          //     outlineColor: Cesium.Color.WHITE,
          //   },
          // });
          // this.handle(vlevel);
          // this.$map.cloudLayer({
          //   url: "data:image/png;base64," + res.value.img,
          //   projection: "EPSG:4326",
          //   isLngLat: true,
          //   region: this.img_box, // [60, -10, 150, 60],
          //   id: "floodImage",
          // });
        }
      });
    },
    handle(vlevel) {
      // this.$map.map.clear();
      var img = new Image();
      img.src = this.old_Beas64;
      // console.log(this.old_Beas64)
      var self = this;
      img.onload = function () {
        var canvas = document.createElement("canvas"); //用来创建图形的容器
        var ctx = canvas.getContext("2d"); //返回一个提供了用于在画布上绘图的方法和属性， getContext("2d")对象的属性和方法，可用于在画布上绘制文本、线条、矩形、圆形等等
        var imgWidth = img.width;
        var imgHeight = img.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
          var r = imageData.data[i];
          var g = imageData.data[i + 1];
          var b = imageData.data[i + 2];
          var a = imageData.data[i + 3];
          if (r <= 120 && g <= 120 && b <= 120) {
            imageData.data[i + 3] = 0;
          } else {
            imageData.data[i] = 0;
            imageData.data[i + 1] = 116;
            imageData.data[i + 2] = 216;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        var dataUrl = canvas.toDataURL("image/PNG");
        var cloud = self.$map.cloudLayer({
          url: dataUrl,
          projection: "EPSG:4326",
          isLngLat: true,
          region: self.img_box, // [60, -10, 150, 60],
          id: "floodImage" + vlevel,
        });
        self.layers.push(cloud);
        if (self.layers.length > 2) {
          self.$map.map.remove(self.layers[0]);
          self.layers.shift();
        }
      };
    },
    onCancel() {
      this.$store.state.flood_show = false;
    },
  },
};
</script>

<style scoped>
#flood {
  background: #fff;
  width: 220px;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttom_box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.btn_style {
  margin: 2px;
  width: 90px;
}
</style>