<template>
  <div id="operationalAnalysis" ref="box" @mousedown.stop="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)">
    <header>
      <span>作战计算</span>
      <i class="el-icon-close" @click="onCancel"></i>
    </header>
    <div id="table_box">
      <table border="1">
        <tr>
          <td colspan="7">应到时刻计算</td>
        </tr>
        <tr>
          <td style="width: 200px">当前时刻</td>
          <td style="width: 200px">航线剩余距离（千米）</td>
          <td style="width: 250px">飞机飞行速度（千米/时）</td>
          <td style="width: 200px"></td>
          <td style="width: 200px"></td>
          <td style="width: 200px">应到时刻</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <!-- <el-input v-model="dueTime.nowTime" size="mini"></el-input> -->
            <el-date-picker v-model="dueTime.nowTime" type="datetime" placeholder="选择日期时间" size="mini">
            </el-date-picker>
          </td>
          <td>
            <!-- <el-input v-model="dueTime.distance" size="mini"></el-input> -->
            {{ dueTime.distance }}
          </td>
          <td>
            <el-input v-model="dueTime.speed" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="dueTime.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ dueTime.result }}</td>
          <td>
            <el-button type="primary" @click="dueTime_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">弹药计算</td>
        </tr>
        <tr>
          <td>基数标准（发）</td>
          <td>基数数量（个）</td>
          <td>武器数量（个）</td>
          <td></td>
          <td></td>
          <td>弹药发数（发）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="rounds.standard" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="rounds.quantity" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="rounds.arms" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="rounds.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ rounds.result }}</td>
          <td>
            <el-button type="primary" @click="rounds_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">空运所需架次计算</td>
        </tr>
        <tr>
          <td>承载员额（人）</td>
          <td>伴随火器占座位</td>
          <td>飞机承载标准（座）</td>
          <td></td>
          <td></td>
          <td style="width: 250px">空运所需架次（次）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="airTransport.people" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="airTransport.seizeASeat" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="airTransport.aircraftLoad" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="airTransport.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ airTransport.result }}
          </td>
          <td>
            <el-button type="primary" @click="airTransport_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">空运所需波次计算</td>
        </tr>
        <tr>
          <td>空运所需架次（次）</td>
          <td>起飞机场一次容量</td>
          <td></td>
          <td></td>
          <td></td>
          <td style="width: 250px">空运所需波次（次）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="wave.Sorties" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="wave.capacity" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="wave.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ wave.result }}
          </td>
          <td>
            <el-button type="primary" @click="wave_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">空运持续时间计算</td>
        </tr>
        <tr>
          <td>空运所需波次（次）</td>
          <td>起飞机场昼夜可飞时间（小时）</td>
          <td>起飞机场一次容量的飞机全部降落、乘载完毕时间（小时）</td>
          <td colspan="2">起飞(降落)机场一次容量的飞机全部降落、乘载(卸载)、起飞完毕需要时间（小时）</td>
          <td style="width: 250px">空运持续时间</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="duration.wave" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="duration.canFly_time" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="duration.complete_time" size="mini"></el-input>
          </td>
          <td colspan="2">
            <el-input v-model="duration.need_time" size="mini"></el-input>
          </td>
          <td :style="duration.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">
            {{ duration.result }}
          </td>
          <td>
            <el-button type="primary" @click="duration_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr v-if="false">
          <td colspan="7">空运持续时间计算</td>
        </tr>
        <tr v-if="false">
          <td>起飞机场持续时间</td>
          <td>编队飞行续航时间</td>
          <td></td>
          <td></td>
          <td></td>
          <td>空运持续时间</td>
          <td>操作</td>
        </tr>
        <tr v-if="false">
          <td>
            <div style="
                display: flex;
                justify-content: space-evenly;
                align-items: center;
              ">
              <el-input v-model="airTransportTime.takeoffDuration.d" size="mini" style="width: 20%"></el-input>
              <span>天</span>
              <el-input v-model="airTransportTime.takeoffDuration.h" size="mini" style="width: 20%" @input="
                numberFormat(
                  airTransportTime.takeoffDuration.h,
                  24,
                  'takeoffDuration',
                  'h'
                )
              "></el-input>
              <span>时</span>
              <el-input v-model="airTransportTime.takeoffDuration.m" size="mini" style="width: 20%" @input="
                numberFormat(
                  airTransportTime.takeoffDuration.m,
                  60,
                  'takeoffDuration',
                  'm'
                )
              "></el-input>
              <span>分</span>
            </div>
          </td>
          <td>
            <div style="
                display: flex;
                justify-content: space-evenly;
                align-items: center;
              ">
              <el-input v-model="airTransportTime.flightDuration.d" size="mini" style="width: 20%"></el-input>
              天
              <el-input v-model="airTransportTime.flightDuration.h" size="mini" style="width: 20%" @input="
                numberFormat(
                  airTransportTime.flightDuration.h,
                  24,
                  'flightDuration',
                  'h'
                )
              "></el-input>
              时
              <el-input v-model="airTransportTime.flightDuration.m" size="mini" @input="
                numberFormat(
                  airTransportTime.flightDuration.m,
                  60,
                  'flightDuration',
                  'm'
                )
              " style="width: 20%"></el-input>
              分
            </div>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="airTransportTime.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">
            {{ airTransportTime.result }}
          </td>
          <td>
            <el-button type="primary" @click="airTransportTime_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">空运能力计算</td>
        </tr>
        <tr>
          <td>单机载重量(人)</td>
          <td>编队内的飞机数量（架）</td>
          <td>空运波次（次）</td>
          <td></td>
          <td></td>
          <td>空运能力（人）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="airTransportCapacity.people" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="airTransportCapacity.quantity" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="airTransportCapacity.waveNumber" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="airTransportCapacity.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{
              airTransportCapacity.result
          }}</td>
          <td>
            <el-button type="primary" @click="airTransportCapacity_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">组织战斗时间计算</td>
        </tr>
        <tr>
          <td>受领战斗任务日</td>
          <td>完成战斗准备日</td>
          <td></td>
          <td></td>
          <td></td>
          <td>总时间</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-date-picker v-model="totalTime.taskDay" type="datetime" placeholder="选择日期时间" size="mini">
            </el-date-picker>
          </td>
          <td>
            <el-date-picker v-model="totalTime.preparationDay" type="datetime" placeholder="选择日期时间" size="mini">
            </el-date-picker>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="totalTime.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ totalTime.result }}</td>
          <td>
            <el-button type="primary" @click="totalTime_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">航向计算</td>
        </tr>
        <tr>
          <td style="width: 200px">真航向</td>
          <td style="width: 200px">磁差</td>
          <td></td>
          <td></td>
          <td></td>
          <td>航向</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="hangxiang.zhenhangxiang" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="hangxiang.cicha" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="hangxiang.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ hangxiang.result }}</td>
          <td>
            <el-button type="primary" @click="hangxiang_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">速度计算</td>
        </tr>
        <tr>
          <td style="width: 200px">表速</td>
          <td style="width: 200px">海拔</td>
          <td></td>
          <td></td>
          <td></td>
          <td>速度</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="speed.clock" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="speed.height" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="speed.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ speed.result }}</td>
          <td>
            <el-button type="primary" @click="speed_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">起飞时间计算</td>
        </tr>
        <tr>
          <td style="width: 200px">预定到达时刻</td>
          <td style="width: 200px">起飞集合时间(分)</td>
          <td>飞向起点时间(分)</td>
          <td>飞向目标时间(分)</td>
          <td>飞机开车时间(分)</td>
          <td style="width: 260px">起飞时间</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <!-- <el-input v-model="time.arrival" size="mini"></el-input> -->
            <el-date-picker v-model="time.arrival" type="datetime" placeholder="选择日期时间" size="mini">
            </el-date-picker>
          </td>
          <td>
            <el-input v-model="time.aggergate" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="time.starting" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="time.ending" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="time.takeoff" size="mini"></el-input>
          </td>
          <td :style="time.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ time.result }}</td>
          <td>
            <el-button type="primary" @click="time_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">油耗计算</td>
        </tr>
        <tr>
          <td>油料基数数量</td>
          <td>主辅油箱容量 (公斤)</td>
          <td>主油比重</td>
          <td></td>
          <td></td>
          <td>油料重量</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="fuel.num" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="fuel.liang" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="fuel.zhong" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="fuel.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ fuel.result }}</td>
          <td>
            <el-button type="primary" @click="fuel_fun" size="mini">计算</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">反装甲能力计算</td>
        </tr>
        <tr>
          <td style="width: 200px">直升机总数</td>
          <td style="width: 200px">携弹量</td>
          <td style="width: 200px">出动率命中概率</td>
          <td style="width: 200px">出动强度</td>
          <td>毁伤概率</td>
          <td style="width: 200px">反装甲</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="antiarmor.planeNum" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="antiarmor.ammunition" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="antiarmor.hitRate" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="antiarmor.sortieRate" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="antiarmor.damageRate" size="mini"></el-input>
          </td>
          <td :style="antiarmor.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ antiarmor.result }}</td>
          <td>
            <el-button type="primary" @click="antiarmor_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">着陆地幅面积计算</td>
        </tr>
        <tr>
          <td style="width: 200px">飞机旋翼宽</td>
          <td style="width: 200px">飞机机身长</td>
          <td style="width: 200px">横向飞机架数</td>
          <td style="width: 200px">纵向飞机架数</td>
          <td></td>
          <td>面积</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="area.width" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="area.long" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="area.transverse" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="area.vertival" size="mini"></el-input>
          </td>
          <td></td>
          <td :style="area.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ area.result }}</td>
          <td>
            <el-button type="primary" @click="area_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">设置雷障计算</td>
        </tr>
        <tr>
          <td>雷障掩护的正面宽度 (千米)</td>
          <td>雷障密度 (每千米雷区长度)</td>
          <td>布雷密度（枚/千米）</td>
          <td></td>
          <td></td>
          <td>地雷数量（枚）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="mine.width" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="mine.leizhang" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="mine.bulei" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="mine.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ mine.result }}</td>
          <td>
            <el-button type="primary" @click="mine_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">兵力兵器对比计算</td>
        </tr>
        <tr>
          <td style="width: 200px">我方兵器兵力数量</td>
          <td style="width: 200px">敌方兵器兵力数量</td>
          <td style="width: 200px"></td>
          <td style="width: 200px"></td>
          <td></td>
          <td>兵器兵力对比</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="contrast.we" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="contrast.enemy" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="contrast.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ contrast.result }}</td>
          <td>
            <el-button type="primary" @click="contrast_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">兵力兵器密度计算</td>
        </tr>
        <tr>
          <td style="width: 200px">兵器兵力数量</td>
          <td style="width: 200px">攻防作战任务的正面宽度（千米）</td>
          <td style="width: 200px"></td>
          <td style="width: 200px"></td>
          <td></td>
          <td>兵力兵器密度</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="density.num" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="density.width" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="density.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{ density.result }}</td>
          <td>
            <el-button type="primary" @click="density_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">防御前沿前轻武器火力密度计算</td>
        </tr>
        <tr>
          <td style="width: 200px">发射弹数（发）</td>
          <td style="width: 200px">防御正面宽度（米）</td>
          <td style="width: 200px"></td>
          <td style="width: 200px"></td>
          <td></td>
          <td>轻武器火力密度</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="lightWeapons_density.num" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="lightWeapons_density.width" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td :style="lightWeapons_density.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{
              lightWeapons_density.result
          }}</td>
          <td>
            <el-button type="primary" @click="lightWeapons_density_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">防御前沿前反坦克火力密度计算</td>
        </tr>
        <tr>
          <td style="width: 200px">反坦克火力件数</td>
          <td style="width: 200px">敌坦克冲击速度（分/米）</td>
          <td style="width: 200px">直射距离（米）</td>
          <td style="width: 200px">战斗射速</td>
          <td>防御正面宽度（千米）</td>
          <td>反坦克火力密度（发/千米）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="Antitank_density.num" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="Antitank_density.speed" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="Antitank_density.distance" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="Antitank_density.ratOfFire" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="Antitank_density.width" size="mini"></el-input>
          </td>
          <td :style="Antitank_density.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{
              Antitank_density.result
          }}</td>
          <td>
            <el-button type="primary" @click="Antitank_density_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">杀伤面积计算</td>
        </tr>
        <tr>
          <td style="width: 200px">火炮数量</td>
          <td style="width: 200px">火炮发射数量（分/发）</td>
          <td style="width: 200px">每公顷弹药消耗量</td>
          <td style="width: 200px"></td>
          <td></td>
          <td>杀伤面积（公顷）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="lethality_area.num" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="lethality_area.time_num" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="lethality_area.area_num" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="lethality_area.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">{{
              lethality_area.result
          }}</td>
          <td>
            <el-button type="primary" @click="lethality_area_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">追击需要时间计算</td>
        </tr>
        <tr>
          <td style="width: 200px">敌我距离（千米）</td>
          <td style="width: 200px">我方速度（千米）</td>
          <td style="width: 200px">敌方速度（千米）</td>
          <td style="width: 200px"></td>
          <td></td>
          <td>所需时间</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="pursuit_time.distance" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="pursuit_time.me_speed" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="pursuit_time.enemy_speed" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="pursuit_time.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">
            {{ pursuit_time.result }}
          </td>
          <td>
            <el-button type="primary" @click="pursuit_time_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
        <tr>
          <td colspan="7">追击需要速度计算</td>
        </tr>
        <tr>
          <td style="width: 200px">敌我距离（千米）</td>
          <td style="width: 200px">时限(小时)</td>
          <td style="width: 200px">敌方速度（千米）</td>
          <td style="width: 200px"></td>
          <td></td>
          <td>所需速度（千米/小时）</td>
          <td>操作</td>
        </tr>
        <tr>
          <td>
            <el-input v-model="pursuit_speed.distance" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="pursuit_speed.time_limit" size="mini"></el-input>
          </td>
          <td>
            <el-input v-model="pursuit_speed.enemy_speed" size="mini"></el-input>
          </td>
          <td></td>
          <td></td>
          <td :style="pursuit_speed.result == '参数错误' ? { color: '#f00' } : { color: '#000' }">
            {{ pursuit_speed.result }}
          </td>
          <td>
            <el-button type="primary" @click="pursuit_speed_fun" size="mini">
              计算
            </el-button>
          </td>
        </tr>
      </table>
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
      time: "",
      dueTime: {
        nowTime: new Date(),
        distance: "使用右侧测距工具",
        speed: "",
        result: "",
      },
      rounds: {
        standard: "",
        quantity: "",
        arms: "",
        result: "",
      },
      airTransport: {
        people: "",
        seizeASeat: "",
        aircraftLoad: "",
        result: "",
      },
      wave: {
        Sorties: "",
        capacity: "",
        result: "",
      },
      duration: {
        wave: "",
        canFly_time: "",
        complete_time: "",
        need_time: "",
        result: "",
      },
      airTransportTime: {
        takeoffDuration: {
          d: "",
          h: "",
          m: "",
        },
        flightDuration: {
          d: "",
          h: "",
          m: "",
        },
        result: "",
      },
      airTransportCapacity: {
        people: "",
        quantity: "",
        waveNumber: "",
        result: "",
      },
      totalTime: {
        preparationDay: new Date(),
        taskDay: new Date(),
        result: "",
      },
      hangxiang: {
        zhenhangxiang: "",
        cicha: "",
        result: "",
      },
      speed: {
        clock: "",
        height: "",
        result: "",
      },
      time: {
        arrival: "",
        aggergate: "",
        starting: "",
        ending: "",
        takeoff: "",
        result: "",
      },
      fuel: {
        num: "",
        liang: "",
        zhong: "",
        result: "",
      },
      antiarmor: {
        planeNum: "",
        ammunition: "",
        hitRate: "",
        sortieRate: "",
        damageRate: "",
        result: "",
      },
      area: {
        width: "",
        long: "",
        transverse: "",
        vertival: "",
        result: "",
      },
      mine: {
        width: "",
        leizhang: "",
        bulei: "",
        result: "",
      },
      contrast: {
        we: "",
        enemy: "",
        result: "",
      },
      density: {
        num: "",
        width: "",
        result: "",
      },
      lightWeapons_density: {
        num: "",
        width: "",
        result: "",
      },
      Antitank_density: {
        num: "",
        speed: "",
        distance: "",
        ratOfFire: "",
        width: "",
        result: "",
      },
      lethality_area: {
        num: "",
        time_num: "",
        area_num: "",
        result: "",
      },
      pursuit_time: {
        distance: "",
        me_speed: "",
        enemy_speed: "",
        result: "",
      },
      pursuit_speed: {
        distance: "",
        time_limit: "",
        enemy_speed: "",
        result: "",
      }
    };
  },
  computed: {
    distance() {
      // console.log(this.$store.state.distance);
      return this.$store.state.distance;
    },
  },
  watch: {
    distance(newV, oldV) {
      this.dueTime.distance = newV;
    },
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
      if (event.target.localName == "input") {
        return;
      }
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
    onCancel() {
      this.$store.state.operationalAnalysis_show = false;
    },
    dueTime_fun() {
      // dueTime: {
      //   nowTime: "",现在时刻
      //   distance: "",航线剩余距离
      //   speed: "",飞机飞行速度
      //   result: "",结果
      // },
      // 结果 = 现在时刻 + 航线剩余距离 / 飞机飞行速度
      var a = this.getTime(
        Number(this.dueTime.nowTime) +
        Number(this.dueTime.distance) /
        (Number(this.dueTime.speed) / 60 / 60 / 1000)
      );
      var result;
      if (a.indexOf("NaN") > -1) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.dueTime.result = result;
    },
    rounds_fun() {
      // rounds: {
      //   standard: "",基数标准
      //   quantity: "",基数数量
      //   arms: "",武器数量
      //   result: "",结果
      // },
      // 结果 = 基数标准 * 基数数量 * 武器数量
      var a =
        Number(this.rounds.standard) *
        Number(this.rounds.quantity) *
        Number(this.rounds.arms);
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.rounds.result = result;
    },
    airTransport_fun() {
      // airTransport: {
      //   people: "",
      //   seizeASeat:"",
      //   aircraftLoad: "",
      //   result: "",
      // },
      // (承载员额 * 2 + 伴随火器占座位) / 飞机承载标准 * (1+10%)
      var people = Number(this.airTransport.people)
      var seizeASeat = Number(this.airTransport.seizeASeat)
      var aircraftLoad = Number(this.airTransport.aircraftLoad)
      var a = Math.ceil((people * 2 + seizeASeat) / aircraftLoad * 1.1);
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.airTransport.result = result;
      this.wave.Sorties = result;
    },
    wave_fun() {
      // wave: {
      //   Sorties: "",
      //   capacity: "",
      //   result: "",
      // },
      // 架次 / 容量
      var Sorties = Number(this.wave.Sorties)
      var capacity = Number(this.wave.capacity)
      var a = Math.ceil(Sorties / capacity);
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.wave.result = result;
      this.duration.wave = result;
      this.airTransportCapacity.waveNumber = result;
    },
    duration_fun() {
      // duration: {
      //   wave: "",
      //   canFly_time: "",
      //   complete_time: "",
      //   need_time: "",
      //   result: "",
      // },
      // 空运波次 / ((起昼夜可飞 + 起完毕时间 ) / 起（落）需要时间 )
      var wave = Number(this.duration.wave)
      var canFly_time = Number(this.duration.canFly_time)
      var complete_time = Number(this.duration.complete_time)
      var need_time = Number(this.duration.need_time)
      var a = Math.ceil(wave / ((canFly_time + complete_time) / need_time));
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.duration.result = result;
    },
    airTransportTime_fun() {
      // airTransportTime: {
      //   takeoffDuration: "",
      //   flightDuration: "",
      //   result: "",
      // },
      // 起飞机场持续时间 + 编队飞行续航时间
      // this.airTransportTime.result =
      //   Number(this.airTransportTime.takeoffDuration) +
      //   Number(this.airTransportTime.flightDuration);
      // Number(this.airTransportTime.takeoffDuration.d);
      // Number(this.airTransportTime.takeoffDuration.h);
      // Number(this.airTransportTime.takeoffDuration.m);
      // Number(this.airTransportTime.flightDuration.d);
      // Number(this.airTransportTime.flightDuration.h);
      // Number(this.airTransportTime.flightDuration.m);
      var m =
        Number(this.airTransportTime.takeoffDuration.m) +
        Number(this.airTransportTime.flightDuration.m);
      var h =
        Number(this.airTransportTime.takeoffDuration.h) +
        Number(this.airTransportTime.flightDuration.h);
      var d =
        Number(this.airTransportTime.takeoffDuration.d) +
        Number(this.airTransportTime.flightDuration.d);
      if (m > 60) {
        m = m - 60;
        h = h + 1;
      }
      if (h > 24) {
        h = h - 24;
        d = d + 1;
      }
      if (isNaN(d) || isNaN(h) || isNaN(m)) {
        this.airTransportTime.result = "参数错误";
      } else {
        this.airTransportTime.result = `${d}天${h}时${m}分`;
      }
    },
    airTransportCapacity_fun() {
      // airTransportCapacity: {
      //   people: "",
      //   quantity: "",
      //   waveNumber: "",
      //   result: "",
      // },

      // 单机载重(人)量 * 编队内的飞机数量 * 空运波次
      var people = Number(this.airTransportCapacity.people)
      var quantity = Number(this.airTransportCapacity.quantity)
      var waveNumber = Number(this.airTransportCapacity.waveNumber)
      var a = people * quantity * waveNumber;
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.airTransportCapacity.result = result;
    },
    totalTime_fun() {
      // totalTime: {
      //   preparationDay: "",
      //   taskDay: "",
      //   whenPreparing: "",
      //   taskTime: "",
      //   result: "",
      // },
      // (完成战斗准备日 - 受领战斗任务日) * 24 + 完成战斗准备时 - 受领战斗任务时
      this.totalTime.result = this.GetDateDiff(
        Number(this.totalTime.taskDay),
        Number(this.totalTime.preparationDay)
      );
    },
    hangxiang_fun() {
      // hangxiang: {
      //   zhenhangxiang: "",
      //   cicha: "",
      //   result: "",
      // },
      var a =
        Number(this.hangxiang.zhenhangxiang) + Number(this.hangxiang.cicha);
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      // 真航向+磁差
      this.hangxiang.result = result;
    },
    speed_fun() {
      // speed: {
      //   clock: "",
      //   height: "",
      //   result: "",
      // },
      var a =
        Number(this.speed.clock) +
        0.000066 * Number(this.speed.height) * Number(this.speed.clock);
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      // 真空速：u=v+A*h*v 其中u是真空速，v是表速，h是海拔。对应不同的单位，在公制单位中，A=0.000066
      this.speed.result = result;
    },

    antiarmor_fun() {
      // antiarmor: {
      //   planeNum: "",
      //   ammunition: "",
      //   hitRate: "",
      //   sortieRate: "",
      //   damageRate: "",
      //   result: "",
      // },
      var a =
        this.antiarmor.planeNum *
        this.antiarmor.ammunition *
        this.antiarmor.hitRate *
        this.antiarmor.sortieRate *
        this.antiarmor.damageRate;
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      // 反装甲 = 飞机数量 * 弹药数量 * 命中率 * 出动强度 * 毁伤率
      this.antiarmor.result = result;
    },

    time_fun() {
      // time: {
      //   arrival: "",
      //   aggergate: "",
      //   starting: "",
      //   ending: "",
      //   takeoff: "",
      //   result: "",
      // },
      // 耗油 = 预计到达时间 - (集合时间 + 飞向起点 + 飞向目标 + 起飞时间)
      var aggergate = this.time.aggergate * 60 * 1000;
      var starting = this.time.starting * 60 * 1000;
      var ending = this.time.ending * 60 * 1000;
      var takeoff = this.time.takeoff * 60 * 1000;
      var a = this.getTime(
        Number(this.time.arrival) - (aggergate + starting + ending + takeoff)
      );
      var result;
      // if (isNaN(a)) {
      //   result = "参数错误";
      // } else {
        result = a;
      // }
      this.time.result = result;
    },

    fuel_fun() {
      // fuel: {
      //   num: "",
      //   liang: "",
      //   zhong: "",
      //   result: "",
      // }
      // 油料基数数量 * 主辅邮箱容量 * 主油比重
      var num = Number(this.fuel.num)
      var liang = Number(this.fuel.liang)
      var zhong = Number(this.fuel.zhong)
      var a = num * liang * zhong;
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.fuel.result = result;
    },

    area_fun() {
      // area: {
      //   width: "",
      //   long: "",
      //   transverse: "",
      //   vertival: "",
      //   result: "",
      // },
      // 面积 = (宽度 * 长度) * (横向数量 * 纵向数量)
      var a =
        this.area.width *
        this.area.long *
        (this.area.transverse * this.area.vertival);
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.area.result = result;
    },

    mine_fun() {
      // mine: {
      //   width: "",
      //   leizhang: "",
      //   bulei: "",
      //   result: "",
      // },
      // 地雷数量 = 雷障掩护的正面宽度 * 雷障密度 * 布雷密度
      var width = Number(this.mine.width)
      var leizhang = Number(this.mine.leizhang)
      var bulei = Number(this.mine.bulei)
      var a = width * leizhang * bulei;
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = a;
      }
      this.mine.result = result;
    },
    contrast_fun() {
      // contrast: {
      //   we: "",
      //   enemy: "",
      //   result: "",
      // }
      // 比值 = 优势一方 * 劣势一方
      var we = Number(this.contrast.we)
      var enemy = Number(this.contrast.enemy)
      var b = we > enemy
      var a
      if (b) {
        a = we / enemy
      } else {
        a = enemy / we
      }
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        var aa = Number(a.toFixed(1))
        result = b ? (aa + ' / ' + 1) : (1 + ' / ' + aa);
      }
      this.contrast.result = result
    },
    density_fun() {
      // density: {
      //   num: "",
      //   width: "",
      //   result: "",
      // },
      // 密度 = 数量 / 攻防的正面宽度
      var num = Number(this.density.num)
      var width = Number(this.density.width)
      var a = num / width
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = Number(a.toFixed(1));
      }
      this.density.result = result
    },
    lightWeapons_density_fun() {
      // lightWeapons_density: {
      //   num: "",
      //   width: "",
      //   result: "",
      // },
      // 密度 = 发射弹数 / 防御正面宽度
      var num = Number(this.lightWeapons_density.num)
      var width = Number(this.lightWeapons_density.width)
      var a = num / width
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = Number(a.toFixed(1));
      }
      this.lightWeapons_density.result = result
    },
    Antitank_density_fun() {
      //  Antitank_density: {
      //   num: "",
      //   speed: "",
      //   distance: "",
      //   ratOfFire: "",
      //   width: "",
      //   result: "",
      // }
      // 密度 = 反坦克火器件数 * 战斗射速 * 直射距离 / 敌坦克冲击速度 / 防御正面宽度
      var num = Number(this.Antitank_density.num)
      var speed = Number(this.Antitank_density.speed)
      var distance = Number(this.Antitank_density.distance)
      var ratOfFire = Number(this.Antitank_density.ratOfFire)
      var width = Number(this.Antitank_density.width)
      var a = num * ratOfFire * distance / speed / width
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = Number(a.toFixed(1));
      }
      this.Antitank_density.result = result
    },
    lethality_area_fun() {
      //  lethality_area: {
      //   num: "",
      //   time_num: "",
      //   area_num: "",
      //   result: "",
      // }
      // 杀伤面积 = 火炮数量 * 每门火炮在规定时限内能发射的炮弹数量 / 杀伤 1 公顷目标面积的弹药消耗量
      var num = Number(this.lethality_area.num)
      var time_num = Number(this.lethality_area.time_num)
      var area_num = Number(this.lethality_area.area_num)
      var a = num * time_num / area_num
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        result = Number(a.toFixed(1));
      }
      this.lethality_area.result = result
    },
    pursuit_time_fun() {
      // pursuit_time: {
      //   distance: "",
      //   me_speed: "",
      //   enemy_speed: "",
      //   result: "",
      // },
      // 追击所需时间 = 敌我之间的现实距离 / (我方追击速度 - 敌方追击速度)
      var distance = Number(this.pursuit_time.distance)
      var me_speed = Number(this.pursuit_time.me_speed)
      var enemy_speed = Number(this.pursuit_time.enemy_speed)
      var a = distance / (me_speed - enemy_speed)
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        var y = String(a).indexOf(".") + 1
        var arr = String(a).split('.')
        if (y > 0) {
          result = arr[0] + "小时" + arr[1] / 10 * 60 + "分钟"
        } else {
          result = a
        }

      }
      this.pursuit_time.result = result
    },
    pursuit_speed_fun() {
      // pursuit_speed:{
      //   distance: "",
      //   time_limit: "",
      //   enemy_speed: "",
      //   result: "",
      // }
      // 追击所需速度 = 敌我之间的现实距离 / (我方追击速度 - 敌方追击速度)
      var distance = Number(this.pursuit_speed.distance)
      var time_limit = Number(this.pursuit_speed.time_limit)
      var enemy_speed = Number(this.pursuit_speed.enemy_speed)
      var a = (distance + time_limit * enemy_speed) / time_limit
      var result;
      if (isNaN(a)) {
        result = "参数错误";
      } else {
        var y = String(a).indexOf(".") + 1
        var arr = String(a).split('.')
        if (y > 0) {
          result = arr[0] + "小时" + arr[1] / 10 * 60 + "分钟"
        } else {
          result = a
        }
      }
      this.pursuit_speed.result = result
    },
    getTime(date) {
      let time = new Date(date);
      let Y = time.getFullYear(); //年
      let M = time.getMonth() + 1; //月份
      let d = time.getDate(); //日
      let h = time.getHours(); //小时
      let m = time.getMinutes(); //分
      let s = time.getSeconds(); //秒
      let value;
      if (
        isNaN(Y) ||
        isNaN(M) ||
        isNaN(d) ||
        isNaN(h) ||
        isNaN(m) ||
        isNaN(s)
      ) {
        value = "参数错误";
      } else {
        value = `${Y}年${M}月${d}日${h}时${m}分${s}秒`;
      }
      console.log(value);
      return value;
    },
    GetDateDiff(startTime, endTime) {
      //将计算间隔类性字符转换为小写
      var sTime = Number(new Date(startTime)); //开始时间
      var eTime = Number(new Date(endTime)); //结束时间

      var difftime = (eTime - sTime) / 1000; //计算时间差,并把毫秒转换成秒
      // var Y = parseInt(difftime / 1036800000) // 月 12*24*60*60*1000
      // var M = parseInt(difftime / 1036800000)
      var d = parseInt(difftime / 86400); // 天  24*60*60*1000
      var h = parseInt(difftime / 3600) - 24 * d; // 小时 60*60 总小时数-过去的小时数=现在的小时数
      var m = parseInt((difftime % 3600) / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
      var s = Math.ceil(difftime % 60); // 以60秒为一整份 取余 剩下秒数
      var time;
      if (d < 0 || h < 0 || m < 0 || s < 0) {
        time = "参数错误";
      } else {
        time = `${d}天${h}时${m}分${s}秒`;
      }
      return time;
    },

    numberFormat(num, max, type, info) {
      console.log(num, max);
      if (num >= max) {
        this.$message("输入错误，输入值不能大于" + max);
        this.airTransportTime[type][info] = max - 1;
      }
    },
  },
};
</script>

<style scoped>
#operationalAnalysis {
  background-color: rgba(255, 255, 255, 0.9);
  width: 1350px;
  border-radius: 5px;
  box-shadow: 0 2px 14px 0 #2593ff;
  overflow: hidden;
  text-align: center;
}

header {
  background-image: linear-gradient(179deg, #548ef3 0%, #0b56d9 100%);
  padding: 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#table_box {
  padding: 5px;
  font-size: 12px;
  height: 600px;
  overflow-y: auto;
}

#table_box table {
  width: 100%;
}

#table_box td {
  border: 1px solid #ccc;
  padding: 5px 10px;
}

#table_box table tr:nth-child(3n + 1) td {
  font-weight: bold;
  font-size: 16px;
  padding: 10px 0;
}

#table_box table tr:nth-child(3n + 2) td {
  font-size: 14px;
}
</style>