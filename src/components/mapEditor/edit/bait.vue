<template>
  <div id="arms">
    <el-table :data="info.bait" style="width: 100%" height="400px">
      <!-- <el-table-column type="index" width="50"> </el-table-column> -->
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="quantity" label="负载" width="100px">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    info() {
      return this.$store.state.CGF_nodeData;
    },
  },
  mounted() {},
  methods: {},
};
</script>

