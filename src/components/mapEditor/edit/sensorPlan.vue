<template>
  <div id="arms">
    <el-table :data="info.sensor" style="width: 100%" height="400px">
      <!-- <el-table-column type="index" width="50"> </el-table-column> -->
      <el-table-column prop="serialNumber" label="序号"> </el-table-column>
      <el-table-column prop="model" label="操作模式" width="100px">
      </el-table-column>
      <!-- <el-table-column prop="open" label="开启" width="100px">
      </el-table-column>
      <el-table-column prop="close" label="关闭" width="100px">
      </el-table-column> -->
      <el-table-column prop="scanningMode" label="扫描模式" width="100px">
      </el-table-column>
      <el-table-column prop="startAngle" label="起始角" width="100px">
      </el-table-column>
      <el-table-column prop="endangle" label="终止角" width="100px">
      </el-table-column>
      <!-- <el-table-column prop="scanningFrequency" label="扫描频率" width="100px">
      </el-table-column>
      <el-table-column prop="scanningSpeed" label="扫描速度" width="100px">
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: "毒刺导弹",
          operationMode: "16",
          open: "",
          close: "",
          scanMode: "",
          startingAngle: "",
          terminationAngle: "",
          scanningFrequency: "",
          scanningSpeed: "",
        },
      ],
    };
  },
  computed: {
    info() {
      return this.$store.state.CGF_nodeData;
    },
  },
  mounted() { },
  methods: {},
};
</script>
