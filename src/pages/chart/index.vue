<template>
  <div class="chartView">
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="历史范围"
          :value="cellvalue"
          :label="isnumber ? '按数量' : '按时间'"
          isLink
          :disabled="!isOpen"
          @click="
            $Router.push({
              name: 'DataQuantity',
              params: {
                number: form.number,
                startTime: form.startTime,
                endTime: form.endTime,
                isnumber: isnumber ? 0 : 1,
              },
            })
          "
        ></u-cell>
      </u-cell-group>
    </view>

    <!-- <view class="card">
      <uni-card>
        <text>
          这是一个基础卡片示例，内容较少，此示例展示了一个没有任何属性不带阴影的卡片。</text
        >
      </uni-card>
    </view> -->
    <view class="card">
      <RadonChart
        class="echart"
        ref="radonchar"
        :barUpdate="barUpdate"
      ></RadonChart>
    </view>
    <!-- <view class="card" v-show="datastreams === 'Thoron'">
      <ThoronChart class="echart" ref="Thoronchar"></ThoronChart>
    </view>
    <view class="card" v-show="datastreams === 'temperature'">
      <TempChart class="echart" ref="TempChart"></TempChart>
    </view>
    <view class="card" v-show="datastreams === 'humidity'">
      <RHChart class="echart" ref="RHChart"></RHChart>
    </view>
    <view class="card" v-show="datastreams === 'Pressure'">
      <PressureChart class="echart" ref="PressureChart"></PressureChart>
    </view> -->

    <view>
      <view class="btn updown">
        <view class="udbtn">
          <u-button
            text="上一页"
            type="primary"
            class="upbtn"
            @click="$refs.radonchar.PreviousNextPage(false)"
            :disabled="!isOpen"
          >
            上一页
          </u-button>
        </view>
        <view class="udbtn">
          <u-button
            text="下一页"
            type="primary"
            class="downbtn"
            @click="$refs.radonchar.PreviousNextPage(true)"
            :disabled="!isOpen"
          >
            下一页
          </u-button>
        </view>
      </view>
    </view>

    <view class="subsection">
      <u-subsection
        :list="list"
        mode="subsection"
        :current="showBarChart"
        @change="change1"
      ></u-subsection>
    </view>

    <view class="cell" v-show="!showBarChart">
      <u-cell-group>
        <!--
          isLink
          @click="
            action();
            value = 'Radon';
          " -->
        <u-cell
          title="时间"
          :value="`${
            $u.timeFormat(dataPoint.RadonAt, 'yyyy年mm月dd日 hh时MM分ss秒') ||
            '0'
          }`"
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="氡浓度"
          :value="`${dataPoint.Radon || '0'} Bq/m³`"
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="钍浓度"
          :value="`${dataPoint.Thoron || '0'} Bq/m³`"
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="温度"
          :value="`${dataPoint.temperature || '0'} ℃`"
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="大气压"
          :value="`${dataPoint.Pressure || '0'} mbar`"
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="相对湿度"
          :value="`${dataPoint.humidity || '0'} %`"
          :disabled="!isOpen"
        ></u-cell>
      </u-cell-group>
    </view>

    <view class="card" v-show="!!showBarChart">
      <BarChart class="echart" ref="barchar"></BarChart>
    </view>

    <!-- <view v-show="!showBarChart">
      <view class="btn">
        <u-button
          text="显示能谱"
          type="primary"
          shape="circle"
          @click="
            showBarChart = 1;
            showrange();
          "
          :disabled="!isOpen"
        ></u-button>
      </view>
    </view>

    <view v-show="!!showBarChart">
      <view class="btn">
        <u-button
          text="隐藏能谱"
          type="primary"
          shape="circle"
          @click="showBarChart = 0"
          :disabled="!isOpen"
        ></u-button>
      </view>
    </view> -->

    <view class="cell">
      <u-cell-group>
        <u-cell
          title="设备昵称"
          :value="dev.abbreviation"
          isLink
          @click="
            $Router.push({
              name: 'ChangeName',
              params: {
                deviceid: dev.deviceid,
              },
            })
          "
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="下载数据"
          isLink
          @click="
            $Router.push({
              name: 'Download',
              params: {
                deviceid: dev.deviceid,
              },
            })
          "
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="触发告警"
          isLink
          @click="
            $Router.push({
              name: 'TriggerView',
              params: {
                deviceid: dev.deviceid,
              },
            })
          "
          :disabled="!isOpen"
        ></u-cell>
        <u-cell
          title="命令设置"
          isLink
          @click="
            $Router.push({
              name: 'Command',
              params: {
                deviceid: dev.deviceid,
              },
            })
          "
          :disabled="!isOpen"
        ></u-cell>
      </u-cell-group>
    </view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import to from 'await-to-js';
// eslint-disable-next-line import/no-extraneous-dependencies
// import XLSX from 'xlsx';
// import { jsonClone } from '@/utils/disposalData';
import { toast, loading } from '@uni/apis';
import { measuredGetdata, getlastDatas } from '@/api/devdata';
import { devSettingGetmark } from '@/api/devParamSetting';
import RadonChart from './RadonChart';
import BarChart from './BarChart';

export default {
  name: 'ChartView',
  components: {
    RadonChart,
    BarChart,
  },
  data() {
    return {
      list: ['详细数据', '能谱数据'],
      form: { number: 100, startTime: '', endTime: '' },
      isnumber: true,
      data: null,
      dataPoint: {
        RadonAt: '',
        Radon: '',
        Thoron: '',
        Pressure: '',
        temperature: '',
        humidity: '',
      },
      showBarChart: 0,
      isOpen: false,
      dev: null,
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
    cellvalue() {
      if (this.isnumber) {
        return `最新${this.form.number}个`;
      }
      return `${this.$u.timeFormat(
        this.form.startTime,
        'yy年mm月dd日 hh时MM分'
      )}\n${this.$u.timeFormat(this.form.endTime, 'yy年mm月dd日 hh时MM分')}`;
    },
  },
  created() {
    this.$AppReady.then(() => {
      // console.log('收到参数', this.$Route.query);
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      this.getdata();
      this.getmakings();
    });
  },
  methods: {
    init({ number, startTime, endTime, isnumber }) {
      this.isnumber = isnumber;
      this.form = { number, startTime, endTime };
      // console.log('图表页面初始化', { number, startTime, endTime, isnumber });
      if (isnumber) {
        this.getdata();
      } else {
        this.timegetdata();
      }
      this.getmakings();
    },

    change1(index) {
      this.showBarChart = !!index;
      if (index) this.showrange();
    },

    /**
     * 显示能谱
     */
    showrange() {
      this.barUpdate({
        zoomStart: this.$refs.radonchar.xIndex,
        zoomEnd: this.$refs.radonchar.xIndex,
        show: true,
      });
    },

    /**
     * 获取标线信息
     */
    async getmakings() {
      const [err, res] = await to(
        devSettingGetmark({ deviceid: this.dev.deviceid })
      );
      if (err) {
        console.log(err);
        return;
      }
      this.marks = [];
      [...res.data].forEach((item) => {
        this.marks.push({ ...item });
      });
      // console.log('标线信息', [...this.marks]);
    },

    /**
     * 按时间获取数据
     */
    async timegetdata() {
      this.isOpen = false;
      const [err, response] = await to(
        measuredGetdata({
          deviceid: this.dev.deviceid,
          starttime: this.$u.timeFormat(
            this.form.startTime,
            'yyyy-mm-ddThh:MM:ss'
          ),
          endtime: this.$u.timeFormat(this.form.endTime, 'yyyy-mm-ddThh:MM:ss'),
        })
      );
      if (err) {
        this.isOpen = true;
        console.log('获取服务器数据错误：\n', err);
        return Promise.reject(err);
      }
      loading.showLoading();
      const data = {};
      const { datastreams } = response.data.data;
      if (
        !datastreams ||
        !(datastreams.Radon && datastreams.Radon.length >= 1)
      ) {
        toast.showToast({
          content: '当前时间段没有数据！',
        });
        this.isOpen = true;
        return Promise.reject(new Error('当前时间段没有数据！'));
      }
      data.RadonAt = [];
      const keys = Object.keys(datastreams);
      keys.forEach((key) => {
        data[key] = [];
        datastreams[key].forEach((item) => {
          data[key].push(+item.value);
        });
      });
      datastreams.Radon.forEach((item) => {
        data.RadonAt.push(item.at);
      });
      this.data = data;
      this.update(this.data);
      this.isOpen = true;
      return data;
    },

    /**
     * 按数量获取数据
     */
    async getdata() {
      this.isOpen = false;
      const [err, res] = await to(
        getlastDatas({
          deviceid: this.dev.deviceid,
          numbers: this.form.number,
        })
      );
      if (err) {
        console.log('获取服务器数据错误：\n', err);
        this.isOpen = true;
        return Promise.reject(err);
      }
      // console.log('获取服务器数据：\n', res);
      loading.showLoading();
      const { datastreams } = res.data.data;
      const data = { RadonAt: [] };
      const keys = Object.keys(datastreams);
      for (let i = 0, len = keys.length; i < len; i += 1) {
        data[keys[i]] = [];
        datastreams[keys[i]].forEach((item) => {
          data[keys[i]].push(+item.value);
        });
        data[keys[i]].reverse();
      }
      datastreams.Radon.forEach((item) => {
        data.RadonAt.push(item.at);
      });
      data.RadonAt.reverse();

      if (this.data && this.data.Map) data.Map = this.data.Map;
      this.data = { ...this.data, ...data };
      // console.log(this.data);
      this.isOpen = true;
      this.update(this.data);
      return Promise.resolve(data);
    },

    setDataPoint(i) {
      this.dataPoint = {
        RadonAt: this.data.RadonAt[i],
        Radon: this.data.Radon[i],
        Thoron: this.data.Thoron[i],
        Pressure: this.data.Pressure[i],
        temperature: this.data.temperature[i],
        humidity: this.data.humidity[i],
      };
    },

    update(data) {
      // console.log(this.$refs);
      this.$refs.radonchar.update(data);
      // this.$refs.Thoronchar.update(data);
      // this.$refs.TempChart.update(data);
      // this.$refs.RHChart.update(data);
      // this.$refs.PressureChart.update(data);
      loading.hideLoading();
    },

    barUpdate({ zoomStart, zoomEnd }) {
      if (!this.data?.Radon?.length || this.data.Radon.length === 0) {
        console.log(this.data);
        return;
      }
      if (!this.showBarChart) return;
      this.$refs.barchar.update({
        datas: this.data,
        startValue: zoomStart,
        endValue: zoomEnd,
        marks: this.marks,
      });
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style scoped lang="scss">
.chartView {
  padding-bottom: 20px;
}
.cell {
  background-color: #fff;
  margin-bottom: 20rpx;
}
.card {
  background-color: #fff;
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  height: 320px;
  box-shadow: 0rpx 0rpx 3px 1px rgba(0, 0, 0, 0.08);
}

.updown {
  display: flex;
  /* 主轴空位分配方式justify-content */
  justify-content: center;
}

.udbtn {
  width: 50%;
}
.upbtn {
  color: #fff;
  background-color: #3c9cff;
  border-color: #3c9cff;
  border-width: 1px;
  border-style: solid;
  border-radius: 50px 0px 0px 50px;
}
.downbtn {
  color: #fff;
  background-color: #3c9cff;
  border-color: #3c9cff;
  border-width: 1px;
  border-style: solid;
  border-radius: 0px 50px 50px 0px;
}

.subsection {
  background-color: #fff;
  padding: 10px 5%;
}

.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
.tips {
  padding: 0 10px;
  margin-bottom: 10px;
  background-color: $uni-bg-color-grey;
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
