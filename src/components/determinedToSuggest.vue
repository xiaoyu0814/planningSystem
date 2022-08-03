<template>
  <div id="determinedToSuggest">
    <header>
      <span>拟定决心建议</span>
      <i class="el-icon-close" @click="$store.state.determinedToSuggest_show = false"></i>
    </header>
    <div class="content">
      <ul class="firstNav_box">
        <li class="firstNav_item" :class="firstNav_index === index ? 'firstNav_select' : ''"
          v-for="(item, index) in firstNav_list" :key="index" @click="getChildren(item, index)">
          {{ item.label }}
        </li>
      </ul>
      <ul class="secondNav_box" v-if="secondNav_list">
        <li class="secondNav_item" :class="secondNav_index === index ? 'secondNav_select' : ''"
          v-for="(item, index) in secondNav_list" :key="index" @click="setContent(item, index)">
          {{ item.label }}
        </li>
      </ul>
      <div class="right_content">
        <el-input v-model="content" type="textarea" :rows="20" @input="getContent"></el-input>
      </div>
    </div>
    <footer>
      <el-button type="primary" size="mini" @click="changeEntity_show = true">确 认</el-button>
      <el-button type="danger" size="mini" @click="$store.state.determinedToSuggest_show = false">取 消</el-button>
    </footer>
    <el-dialog title="设置文件名" :visible.sync="changeEntity_show" width="500px" append-to-body>
      <ul class="contentValue">
        <li>
          <span>文书名称：</span>
          <el-input v-model="documentName" size="mini" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeEntity_show = false">取 消</el-button>
        <el-button type="primary" @click="send">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeEntity_show: false,
      firstNav_index: 0,
      firstNav_list: [
        {
          label: "战斗企图",
          content: `
20ＸＸ年７月１日，为维护国家统一，红军展开联合登岛作战。8月1日红军第１登陆集群第一梯队夺占桃园机场（75，21）、新屋乡（64，08）、新竹市（46，94）一线以西地区，建立了登陆场。
1.蓝军情况
蓝军中坜分区反登陆失利后，迅速调整兵力部署，以中坜市为核心，依托城市外围野战工事，固守中坜地区，确保台岛南北通道畅通，挫败红军分割T岛的战役企图。其第17守备旅、第18守备旅担任中坜市外围防御任务。第17守备旅配置在太平山（55，12）、山东（69，15）、长安二村（62，17）地域，旅指挥所在台湾中央大学（63，17）附近地域。第18守备旅配置在大坪（48，22）、太平山（55，12）、金台桥（54，21）地域，旅指挥所在乌树林（54，19）。战斗中，可能得到第三战区陆航旅武装直升机、电子战、炮兵等力量的支援。中坜分区指挥部设在新明中学（62，19）。
2.红军情况
8月6日12时00分，红军第１登陆集群指挥部按战役作战计划，投入登陆集群第二梯队第7集团军向纵深发展进攻。直前火力准备后，第7集团军合成第701旅作为主攻力量，沿新屋乡（64，08）、富源（63，13）方向，向中坜市（62，19）实施主要攻击。合成第702旅实施辅助攻击，主力沿上四湖（56，07）、杨梅市（57，12），向中坜市（62，19）发展攻击；部分力量向新埔镇（48，05）、关西镇（44，15）方向进攻，然后向龙潭乡（52，19）发展进攻；以夺取中坜市外围阵地，控制交通要点要道，保障集团军后续梯队向纵深发展进攻。第七集团军特种作战第7旅１营加强第1连、加强第2连，已先期潜入新埔镇、关西镇及其周边地域，配合此方向的进攻行动。
集团军左与陆军第6集团军战斗分界线为：草漯新村（74，11）、山东（69，15）、兴南中学（64，21）相连之线，线上各点除山东外均属第6集团军，接合部由第6集团军负责保障。右与第８集团军战斗分界线为：草纳（43，89）、宝山乡（39，01）、油罗山（33，14）相连之线，线上各点除草纳、竹东镇（37，06）属第７集团军，接合部由第８集团军负责保障。
陆军航空兵第7旅在第7集团军编成内遂行作战任务，配置在新竹机场（47、91）附近。决心采取“联合破网突防、空地一体突击、纵深连续作战、高效及时保障”的基本战法，以积极行动支援集团军作战。
`,
        },
        {
          label: "战法",
          content: `（一）作战任务
陆航旅攻击直升机１营，担负纵深攻击任务，打击敌装甲第612旅增援之敌，配合集团军正面立体攻击行动。
（二）作战编组
空中侦察组：由加强的勤务直升机４营10连3架直－19武装侦察直升机组成，10连连长任指挥员。任务：先于主力编队行动，沿１号航线进入预定攻击地区，查明航线周边敌情，重点侦察监控羊稠子（61，30）至霄里桥（59，25）公路一线作战地区的敌机步旅情况，引导主力编队展开攻击。挂载空地导弹、火箭弹、航炮。
对地攻击群：由攻击直升机１营1连、2连、3连3架直－10攻击直升机编成，区分为攻击1队、2队、3队，共15架直－10攻击直升机，担负对地攻击任务，副营长负责指挥。任务，压制敌地面火力、打击敌机动的装甲车辆编队，阻止敌增援中坜分区。挂载空地导弹、火箭弹、航炮。
对空警戒组：由3连3架直－10攻击直升机编成，3连长负责指挥。任务：实施空中警戒，拦阻、牵制敌可能来袭的攻击直升机，保障我对地攻击编队的安全，保障主要攻击行动顺利实施。挂载空空导弹、火箭弹和航炮。
（三）主要作战行动
1.空中侦察行动
受领纵深攻击任务后，直升机营派出空中侦察组沿１号航线进入预定攻击区域，查明航线周边敌情，重点侦察监控羊稠子（61，30）至霄里桥（59，25）公路一线，敌机步旅情况，引导主力编队展开攻击。
2.空中突防行动
侦察组在沿航线侦察时，发现淮子埔（51，22）周边有敌防空高炮、便携式防空导弹阵地。对地攻击群提高做好突防准备，选择规避航线，相互掩护突破，快速进入预定作战空域。
3.对地突击行动
在预定攻击区域，对地攻击群在侦察组引导下，对机动中的敌地面装甲编队实施打击，对地攻击群指挥员划分打击区域、明确打击任务，采取“拦头截尾”，多段割裂打击的战法，大量摧毁敌坦克、装甲运输车，阻断敌机动增援行动。
4.空中警戒行动
战斗中，空中预警指控中心通报，新北方向发现敌向前机动的AH-64直升机３架，空中警戒组迅速前出，做好空中拦截准备，使用空空导弹拦截敌机。
`,
        },
        {
          label: "选择打击目标",
          children: [
            {
              label: "一类目标",
              content: "敌机动防空车",
            },
            {
              label: "二类目标",
              content: "坦克",
            },
            {
              label: "三类目标",
              content: "指挥车、装甲输送车",
            },
            {
              label: "毁伤程度分析",
              content: "歼灭全部地方单位",
            },
            {
              label: "打击顺序",
              content: "敌机动防空车>坦克>指挥车>装甲输送车",
            },
          ],
        },
        {
          label: "兵力编组与任务区分",
          children: [
            {
              label: "兵力编组",
              content: `空中侦察组：由加强的勤务直升机４营10连3架直－19武装侦察直升机组成，10连连长任指挥员。
对地攻击群：由攻击直升机１营1连、2连、3连3架直－10攻击直升机编成，区分为攻击1队、2队、3队，共15架直－10攻击直升机，担负对地攻击任务，副营长负责指挥。
对空警戒组：由3连3架直－10攻击直升机编成，3连长负责指挥。`,
            },
            {
              label: "任务区分",
              content: `空中侦察组：先于主力编队行动，沿１号航线进入预定攻击地区，查明航线周边敌情，重点侦察监控羊稠子（61，30）至霄里桥（59，25）公路一线作战地区的敌机步旅情况，引导主力编队展开攻击。
对地攻击群：压制敌地面火力、打击敌机动的装甲车辆编队，阻止敌增援中坜分区。
对空警戒组：实施空中警戒，拦阻、牵制敌可能来袭的攻击直升机，保障我对地攻击编队的安全，保障主要攻击行动顺利实施。`,
            },
            {
              label: "武器配载方案",
              content: `空中侦察组：挂载空地导弹、火箭弹、航炮。
对地攻击群：挂载空地导弹、火箭弹、航炮。
对空警戒组：挂载空空导弹、火箭弹、航炮。`,
            },
          ],
        },
        {
          label: "飞行航线",
          children: [
            {
              label: "主航线",
              content: "溪州大桥（48，95）-新铺镇-关西镇-石门水库西（46，22）－三块厝（55，24）一线。",
            },
            {
              label: "备用航线",
              content: "溪州大桥（48，95）-新铺镇（48，05）-中正中学（53，99）-头重溪桥（57，15）－三块厝（55，24）一线。",
            },
          ],
        },
        {
          label: "指挥与保障",
          content: "当编队遭敌防空火力威胁时，向反方向机动规避，遭敌便携式防空导弹攻击地，要释放红外诱饵弹干扰。直升机有机械故障时，经编队指挥员同意，可立即返航；无法返航时，应在航线附近就近迫降，隐蔽待援。",
        },
      ],
      secondNav_index: 0,
      secondNav_list: [],
      content: "",
      allContent: "",
      oldLabel: "战斗企图",
      documentName: "",
    };
  },
  mounted() {
    this.getChildren(this.firstNav_list[0], 0);
  },
  methods: {
    getChildren(item, index) {
      this.secondNav_list = item.children;
      this.firstNav_index = index;
      this.content = item.content;
      if (item.label == "选择打击目标") {
        this.secondNav_index = 0;
        this.setContent(item.children[0], 0);
      } else if (item.label == "兵力编组与任务区分") {
        this.secondNav_index = 0;
        this.setContent(item.children[0], 0);
      } else if (item.label == "飞行航线") {
        this.secondNav_index = 0;
        this.setContent(item.children[0], 0);
      }
    },
    setContent(item, index) {
      this.secondNav_index = index;
      this.content = item.content;
    },
    getContent(value) {
      if (this.secondNav_list) {
        this.secondNav_list[this.secondNav_index].content = value;
      } else {
        this.firstNav_list[this.firstNav_index].content = value;
      }
    },
    send() {
      let xuhao = ["一", "二", "三", "四", "五", "六", "七", "八"];
      let content = "";
      for (let i = 0; i < this.firstNav_list.length; i++) {
        if (this.firstNav_list[i].children) {
          let title = `<p style="font-size: 18px;"><strong>${xuhao[i]}. ${this.firstNav_list[i].label}</strong></p>`;
          content += title;
          for (let j = 0; j < this.firstNav_list[i].children.length; j++) {
            let model_children = `
              <p style="font-size: 16px;">${j + 1}.${this.firstNav_list[i].children[j].label
              }</p>
              <p style="text-indent:20px">${this.firstNav_list[i].children[j].content
              }</p>
            `;
            content += model_children;
          }
        } else {
          let model = `
            <p style="font-size: 18px;"><strong>${xuhao[i]}. ${this.firstNav_list[i].label}</strong></p>
            <p style="text-indent:20px">${this.firstNav_list[i].content}</p>
            `;
          content += model;
        }
      }
      let path =
        this.$path.document.addDetermine +
        `?sessionid=${sessionStorage.getItem("sessionid")}`;
      let params = {
        content,
        userId: sessionStorage.getItem("Uid"),
        courseId: sessionStorage.getItem("courseId"),
        documentName: this.documentName,
        childId: this.$store.state.progress,
        txmlId: sessionStorage.getItem("xmlId"),
      };
      this.$http.post(path, params, true).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.data.message || "提交成功");
          this.documentName = "";
        } else {
          this.$message.error(res.data.message || "提交失败");
        }
        this.changeEntity_show = false;
      });
      this.$store.state.determinedToSuggest_show = false;
    },
  },
};
</script>

<style scoped>
#determinedToSuggest {
  width: 1000px;
  margin-left: -500px;
  background: rgba(255, 255, 255, 0.9);
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
  padding: 10px;
  display: flex;
}

.firstNav_item {
  width: 126px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  margin: 5px;
  border: 1px solid #fff0;
  background: #f7f8f9;
  color: #89898a;
  text-align: left;
  font-size: 16;
  letter-spacing: 0.98px;
}

.secondNav_box {
  border-left: 1px solid #c4c4c4;
  background-color: #f3f7ff;
  padding: 10px;
  border-right: 1px dashed #72c0f2;
}

.secondNav_item {
  padding: 10px 20px;
  border-bottom: 1px solid #c4c4c4;
  font-size: 14px;
  text-align: left;
  color: #89898a;
  letter-spacing: 0.98px;
  border-left: 2px solid #fff0;
  width: 150px;
}

.right_content {
  flex-grow: 1;
  padding: 10px;
  margin: 0 10px;
  background-color: #fff;
  box-shadow: 0 0 16px 2px rgba(81, 131, 215, 0.3);
  text-align: left;
}

.firstNav_select {
  border: 1px solid #064dc6;
  background-color: rgba(51, 116, 231, 0.11);
  color: #064dc6;
}

.secondNav_select {
  border-left: 2px solid #064dc6;
  color: #064dc6;
}

footer {
  padding: 10px;
}

.contentValue li {
  display: flex;
  /* align-items: center; */
  padding: 10px;
}

.contentValue li span {
  width: 100px;
  margin-top: 5px;
}
</style>
