<template>
  <div id="background" ref="box" @mousedown.stop="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>作战背景</span>
      <i class="el-icon-close" @click="close"></i>
    </header>
    <div class="content">
      <el-scrollbar>
        <div style="white-space: pre-line" v-html="content"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 移动弹窗全局变量 START
      moveDataelse: {
        x: null,
        y: null,
      },
      // 移动弹窗全局变量 END
      content: ``,
      // 20ＸＸ年７月１日，为维护国家统一，红军展开联合登岛作战。8月1日红军第１登陆集群第一梯队夺占桃园机场（75，21）、新屋乡（64，08）、新竹市（46，94）一线以西地区，建立了登陆场。

      // 1.蓝军情况

      // 蓝军中坜分区反登陆失利后，迅速调整兵力部署，以中坜市为核心，依托城市外围野战工事，固守中坜地区，确保台岛南北通道畅通，挫败红军分割T岛的战役企图。其第17守备旅、第18守备旅担任中坜市外围防御任务。第17守备旅配置在太平山（55，12）、山东（69，15）、长安二村（62，17）地域，旅指挥所在台湾中央大学（63，17）附近地域。第18守备旅配置在大坪（48，22）、太平山（55，12）、金台桥（54，21）地域，旅指挥所在乌树林（54，19）。战斗中，可能得到第三战区陆航旅武装直升机、电子战、炮兵等力量的支援。中坜分区指挥部设在新明中学（62，19）。

      // 2.红军情况

      // 8月6日12时00分，红军第１登陆集群指挥部按战役作战计划，投入登陆集群第二梯队第7集团军向纵深发展进攻。直前火力准备后，第7集团军合成第701旅作为主攻力量，沿新屋乡（64，08）、富源 （63，13）方向，向中坜市（62，19）实施主要攻击。合成第702旅实施辅助攻击，主力沿上四湖 （56，07）、杨梅市（57，12），向中坜市（62，19）发展攻击；部分力量向新埔镇（48，05）、关西镇（44，15）方向进攻，然后向龙潭乡（52，19）发展进攻；以夺取中坜市外围阵地，控制交通要点要道，保障集团军后续梯队向纵深发展进攻。第七集团军特种作战第7旅１营加强第1连、加强第2连，已先期潜入新埔镇、关西镇及其周边地域，配合此方向的进攻行动。

      // 集团军左与陆军第6集团军战斗分界线为：草漯新村（74，11）、山东（69，15）、兴南中学（64，21）相连之线，线上各点除山东外均属第6集团军，接合部由第6集团军负责保障。右与第８集团军战斗分界线为：草纳（43，89）、宝山乡（39，01）、油罗山（33，14）相连之线，线上各点除草纳、竹东镇（37，06）属第７集团军，接合部由第８集团军负责保障。

      // 陆军航空兵第7旅在第7集团军编成内遂行作战任务，配置在新竹机场（47、91）附近。决心采取“联合破网突防、空地一体突击、纵深连续作战、高效及时保障”的基本战法，以积极行动支援集团军作战。
    };
  },
  mounted() {
    this.downloadTFileBackgroud();
  },
  methods: {
    close() {
      this.$store.state.background_show = false;
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
    downloadTFileBackgroud() {
      let path = this.$path.xml.downloadTFileBackgroud;
      let params = {
        xmlId: sessionStorage.getItem("xmlId"),
      };
      this.$http.get(path, params).then((res) => {
        // console.log(res);
        if (res.data.code == 0) {
          this.content = res.data.data;
        }
      });
    },
  },
};
</script>

<style scoped>
#background {
  background-color: rgba(255, 255, 255, 0.9);
  height: 500px;
  width: 670px;
  /* border: 1px solid rgb(0, 60, 255); */
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  /* margin-left: -150px;
  margin-top: 100px; */
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

header i {
  cursor: pointer;
}

.content {
  height: calc(100% - 56px);
  padding: 10px;
  text-align: left;
}
</style>

