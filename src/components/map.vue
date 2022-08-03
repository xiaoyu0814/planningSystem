<template>
  <div id="map_box" :style="$store.state.teacher ? 'top:0px' : ''">
    <div id="mapView"></div>

    <!-- <CGFList></CGFList> -->

    <div class="getCenter_box">
      <span>经度：{{ lon }}</span>
      <span style="margin-left: 5px">纬度：{{ lat }}</span>
    </div>
  </div>
</template>

<script>
import CGFList from "@/components/mapEditor/CGFList";
import DrawLine from "@/utils/SimDataModel/DrawLine";
export default {
  components: {
    CGFList,
  },
  data() {
    return {
      lon: 116.4,
      lat: 39.88,
      // lon: -68.80737,
      // lat: -29.91577,
      controller: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      var mapOptions = {
        type: 2,
        id: "mapView",
        zoom: 4.5,
        center: [this.lon, this.lat],
      };
      this.$map.initMap(mapOptions);
      this.$map.setDraw();
      let controllerOptions = {
        container: "mapView",
        change2D3D: {
          type_2D: "openlayer",
        },
      };
      this.controller = this.$map.initController(controllerOptions);
      this.$store.state.map_controller = this.controller;
      this.$store.state.map = this.$map.map;

      this.$map.map.on("mousemove", (e) => {
        var lnglat = turf.toWgs84(e.coordinate);
        this.lon = lnglat[0].toFixed(6); // this.$map.map.getCenter()[0].toFixed(6);
        this.lat = lnglat[1].toFixed(6); // this.$map.map.getCenter()[1].toFixed(6);
      });
    },

    addNavPath() {
      let data = this.selectEntity;
      var drawLine = new DrawLine(this.$map.map);
      drawLine.startDraw(data.id, function (point) {
        var navPoint = {
          stamp: 0,
          position: {
            x: point[0],
            y: point[1],
            z: 0,
          },
        };
        data.getNavPath().AddNavPoint(navPoint);
      });
    },
    addDoctrine() {
      let data = this.selectEntity;
      let doctrines = this.TKBmodel.GetDoctrineNodes(
        this.TKBmodel.GetEquipSchemaNode(data.getTypeId())
      );
      // console.log(doctrines);
    },
    clickNode(data, node, element) {
      // console.log(data, node, element);
      if (data.nodeType == "兵力") {
        if (data.position.x == 0) {
          return;
        }
        this.$map.map.setCenter([data.position.x, data.position.y]);
      }
    },
  },
};
</script>

<style scoped>
#map_box {
  position: absolute;
  top: 120px;
  bottom: 0;
  width: 100%;
}

#map_box #mapView {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 0;
}

.getCenter_box {
  position: absolute;
  right: 200px;
  bottom: 0px;
  z-index: 1;
  background-color: #b9b9b980;
  padding: 10px 20px;
  font-size: 14px;
  text-align: left;
}

.tree_box {
  position: absolute;
  left: 350px;
  height: 350px;
  overflow: auto;
  margin-top: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.menu_node {
  position: absolute;
  left: 593px;
  /* height: 350px; */
  /* overflow: auto; */
  /* width: 102px; */
  margin-top: 10px;
  align-content: space-between;
  /* justify-content: space-between; */
  display: grid;
}
</style>

<style>
#mapView {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 0;
}
</style>