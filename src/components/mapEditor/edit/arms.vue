<template>
  <div id="arms">
    <el-table :data="info.hangingBullet" style="width: 100%" height="400px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" v-for="(item, index) in props.row.ammunition"
            :key="index">
            <el-form-item label="是否挂载" v-if="disabled" style="margin-right: 10px;">
              <el-checkbox v-model="item.type" @change="mount(item)"></el-checkbox>
            </el-form-item>
            <el-form-item label="弹药名称" style="margin-right: 10px;">
              <span>{{ item.name_ammunition }}</span>
            </el-form-item>
            <el-form-item label="弹药负载">
              <!-- <span>{{ item.quantity_ammunition }}</span> -->
              <div v-if="disabled">
                <!-- <el-input v-model="item.quantity_ammunition" style="width: 70px" :disabled="disabled_type"></el-input> -->
                <el-input-number v-model="item.quantity_ammunition" :disabled="!item.type" :min="0" :max="1000"
                  style="width: 140px"></el-input-number>
              </div>
              <div v-else>
                {{ item.quantity_ammunition }}
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="武器名称"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return { disabled_type: false, disabled: true };
  },
  computed: {
    ...mapGetters(["getCGFSelectData"]),
    info() {
      return this.$store.state.CGF_nodeData;
    },
  },
  mounted() {
    for (let i = 0; i < this.info.hangingBullet.length; i++) {
      var ammunition = this.info.hangingBullet[i].ammunition;
      for (let j = 0; j < ammunition.length; j++) {
        // ammunition[j].type = true;
        this.$set(ammunition[j], "type", true)
      }
    }
    if (!this.$store.state.teacher) {
      if (this.getCGFSelectData.side == 2) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  },
  methods: {
    mount(item) {
      item.quantity_ammunition = 0;
      // if (!item.type) {
      //   this.disabled_type = true;
      // } else {
      //   this.disabled_type = false;
      // }
    },
  },
};
</script>



<style>
.demo-table-expand {
  font-size: 0;
  padding-left: 50px;
}

.demo-table-expand label {
  /* width: 90px; */
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  /* width: 30%; */
}
</style>