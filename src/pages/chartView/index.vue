<template>
  <div class="chartView">
    <!-- <view class="chart">
      <mpvue-echarts
        :echarts="echarts"
        :onInit="onInit"
        ref="chart"
        canvasId="chart-canvas"
      />
    </view> -->
    <view class="chart">
      <l-echart ref="chart" @finished="init"></l-echart>
    </view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import to from 'await-to-js';
import { toast, confirm } from '@uni/apis';
import LEchart from '@/components/l-echart/l-echart';
import { measuredGetdata, getlastDatas } from '@/api/devdata';

// import * as echarts from 'echarts';
// 按需引入 开始
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
// -------------按需引入结束------------------------

export default {
  components: { LEchart },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          confine: true,
        },
        legend: {
          data: ['热度', '正面', '负面'],
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 15,
          top: 40,
          containLabel: true,
        },
        xAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#999999',
              },
            },
            axisLabel: {
              color: '#666666',
            },
          },
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: [
              '汽车之家',
              '今日头条',
              '百度贴吧',
              '一点资讯',
              '微信',
              '微博',
              '知乎',
            ],
            axisLine: {
              lineStyle: {
                color: '#999999',
              },
            },
            axisLabel: {
              color: '#666666',
            },
          },
        ],
        series: [
          {
            name: '热度',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'inside',
              },
            },
            data: [300, 270, 340, 344, 300, 320, 310],
          },
          {
            name: '正面',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
              },
            },
            data: [120, 102, 141, 174, 190, 250, 220],
          },
          {
            name: '负面',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'left',
              },
            },
            data: [-20, -32, -21, -34, -90, -130, -110],
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
  },
  created() {
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      console.log(this.dev);
      this.getdata();
    });
  },
  methods: {
    async getdata() {
      const [err, res] = await to(
        getlastDatas({
          deviceId: this.dev.deviceid,
          numbers: 20,
        })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      console.log(res);
    },
    async getdevdata() {
      const [err, res] = await to(
        measuredGetdata({
          deviceId: this.dev.deviceid,
          apikey: this.dev.apikey,
        })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      console.log(res);
    },
    init() {
      this.$refs.chart.init(echarts, (chart) => {
        chart.setOption(this.option);
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
.chart {
  width: 730rpx;
  height: 600rpx;
}
</style>
