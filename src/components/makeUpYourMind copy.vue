<template>
  <div id="makeUpYourMind">
    <header>
      <span>兵力编成编组</span>
      <i class="el-icon-close" @click="$store.state.makeUpYourMind_show = false"></i>
    </header>
    <div class="content" v-if="true">
      <div class="tree_box">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :row-class-name="tableRowClassName"
          :cell-class-name="tableCellClassName" style="height: 100%" node-key="id" :default-expanded-keys="[1]">
        </el-tree>
      </div>
      <div class="btn_box">
        <el-button type="primary" icon="el-icon-arrow-right" circle></el-button>
        <el-button type="primary" icon="el-icon-arrow-left" circle></el-button>
      </div>
      <div class="table_box">
        <el-table :data="tableData" style="margin-bottom: 20px" height="400" row-key="id" border default-expand-all
          @cell-click="cellClick" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="编组" width="300">
            <template slot-scope="scope">
              <el-input v-show="
                scope.row.index === rowIndex &&
                scope.column.index === columnIndex
              " v-model="scope.row.date" ref="editInput" size="mini" @blur="inputBlur(scope)" />
              <span v-show="
                !(
                  scope.row.index === rowIndex &&
                  scope.column.index === columnIndex
                )
              ">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <footer>
      <el-button type="primary" size="mini" @click="$store.state.makeUpYourMind_show = false">确 认</el-button>
      <el-button type="danger" size="mini" @click="$store.state.makeUpYourMind_show = false">取 消</el-button>
    </footer>
  </div>
</template>

<script>
import CGFListLoad from "@/utils/SimDataModel/CGFListLoad";

export default {
  data() {
    return {
      cell_type: false,
      rowIndex: -1,
      columnIndex: -1,
      data: [
        {
          id: 1,
          label: "一营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
        {
          label: "xx营",
          children: [
            {
              label: "一连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "二连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
            {
              label: "三连",
              children: [
                {
                  label: "xx排",
                  children: [{ label: "xx班" }],
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [
        {
          id: 1,
          date: "先遣队",
          children: [
            {
              id: 11,
              date: "一号先遣队",
            },
            {
              id: 12,
              date: "二号先遣队",
            },
          ],
        },
        {
          id: 2,
          date: "第一梯队",
          children: [
            {
              id: 21,
              date: "猎鹰突击队",
            },
            {
              id: 22,
              date: "火山突击队",
            },
          ],
        },
        {
          id: 3,
          date: "火力队",
          children: [
            {
              id: 31,
              date: "空中火力支援分队",
            },
            {
              id: 32,
              date: "地面火力支援分队",
            },
          ],
        },
        {
          id: 4,
          date: "战勤队",
          children: [
            {
              id: 41,
              date: "一号战勤队",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    let path = "/data/编制树.xml"
    var unitData = CGFListLoad.initUnitData(path);
    this.data = unitData.GetRootUnitNodes();
  },
  methods: {
    handleNodeClick(data) {
      // console.log(data);
    },
    cellClick(row, column) {
      // console.log(row, "单条数据", column, "列信息");
      this.rowIndex = row.index;
      this.columnIndex = column.index;
      this.$refs["editInput"][0].focus();
    },
    inputBlur() {
      this.rowIndex = -1;
      this.columnIndex = -1;
    },
  },
};
</script>

<style scoped>
#makeUpYourMind {
  width: 700px;
  margin-left: -350px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 14px 0 #2593ff;
  border-radius: 5px;
  overflow: hidden;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  padding: 20px 40px;
  padding-bottom: 0;
}

.tree_box {
  flex-grow: 1;
  overflow: auto;
  height: 400px;
}

.btn_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  width: 50px;
}

footer {
  padding: 10px;
  text-align: right;
  padding-top: 0;
}
</style>
