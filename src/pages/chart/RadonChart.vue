<template>
  <view>
    <view class="chart">
      <l-echart
        ref="chart"
        @finished="init"
        custom-style="height: 320px;"
      ></l-echart>
    </view>
  </view>
</template>

<script>
import { application } from '@uni/apis';
import { hezhi } from '@/utils/disposalData';
import LEchart from '@/components/l-echart/l-echart';
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
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
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
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent,
]);
// -------------按需引入结束------------------------

export default {
  name: 'RadonChart',
  components: { LEchart },
  data() {
    return {
      data: null,
      chartVm: null,
      xIndex: 0,
      startValue: 0,
      endValue: 0,
      Range: 20,
      RadonAt: null,
      isfinished: false,
      option: {
        color: ['#5470C6', '#91CC75', '#EE6666', '#f5c85c', '#7fc0dd'],
        title: {
          // text: "Rtm1688示例",
        },
        legend: {
          data: ['氡浓度(Bq/m³)'],
          textStyle: {
            // 图例字体大小
            fontSize: 20,
          },
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'none', // 不响应事件
          // alwaysShowContent: true, // tooltip一直显示
          axisPointer: {
            type: 'cross',
          },
          // formatter(params) {
          //   // alert(JSON.stringify(params));
          //   console.log(params);
          //   return params[0].value;
          // },
        },
        grid: {
          // right: '20%',
          left: '15%',
          bottom: '120px',
          // containLabel: true,
        },
        xAxis: {
          data: [],
          // , throttle: 16
          axisPointer: { snap: true, handle: { show: true } },
        },
        yAxis: [
          {
            max(value) {
              const len = 10 ** (parseInt(value.max, 10).toString().length - 1);
              // 取最大值向上取整为最大刻度
              return Math.ceil((value.max * 1.3) / len) * len;
            },
            type: 'value',
            name: '浓度',
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#5470C6',
              },
            },
            axisLabel: {
              formatter: '{value}',
            },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            zoomLock: true,
            startValue: 0,
            endValue: 20,
            moveOnMouseMove: false,
          },
          {
            type: 'slider',
            zoomLock: true,
            handleSize: 0,
            brushSelect: false,
            startValue: 0,
            endValue: 20,
            realtime: false,
          },
        ],
        series: [
          {
            // 根据名字对应到相应的系列
            name: '氡浓度(Bq/m³)',
            type: 'line',
            // symbolSize: 10, //设定点的大小
            color: '#5470C6',
            smooth: true,
            data: [],
          },
          {
            // 根据名字对应到相应的系列
            name: '氡浓度(Bq/m³)',
            type: 'line',
            color: '#ff0000',
            smooth: true,
            data: [],
          },
        ],
      },
    };
  },
  created() {
    const pages = application.getCurrentPages();
    const chartVm = pages[pages.length - 1].$vm;
    this.chartVm = chartVm;
  },
  methods: {
    /**
     * 更新数据
     */
    update(data) {
      // console.log('更新数据');
      this.data = data.Radon;
      this.RadonAt = data.RadonAt;
      this.endValue = this.RadonAt.length - 1;
      this.xIndex = this.endValue;
      if (this.isfinished) {
        this.setdata();
      }
    },

    /**
     * 调整提示上下一个
     */
    setTip(i) {
      this.xIndex += i;
      // console.log(this.xIndex, this.startValue, this.endValue);
      if (this.xIndex > this.endValue || this.xIndex < this.startValue) {
        this.startValue += i;
        this.endValue += i;
        if (this.xIndex >= this.RadonAt.length) {
          this.xIndex = 0;
          this.startValue = 0;
          this.endValue = this.Range - 1;
        }
        if (this.xIndex < 0) {
          this.xIndex = this.RadonAt.length - 1;
          this.startValue = this.RadonAt.length - this.Range - 1;
          this.endValue = this.RadonAt.length - 1;
        }
        this.setzoom({ zoomStart: this.startValue, zoomEnd: this.endValue });
      }
      this.$refs.chart.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: this.xIndex,
      });
      this.chartVm.barUpdate({
        zoomStart: this.xIndex,
        zoomEnd: this.xIndex,
        show: true,
      });
      this.chartVm.setDataPoint(this.xIndex);
    },

    /**
     * 设置图表数据
     */
    setdata() {
      this.$refs.chart.setOption({
        xAxis: {
          data: this.RadonAt,
        },
        series: [{ name: '氡浓度(Bq/m³)', data: this.data }],
        dataZoom: [
          {
            type: 'inside',
            zoomLock: true,
            startValue: this.RadonAt.length - this.Range - 1,
            endValue: this.RadonAt.length - 1,
          },
        ],
      });
      this.setTip(0);
      // this.chartVm.barUpdate({ zoomStart: 0, zoomEnd: this.endValue, show: true });
      // this.zoomdata(0, 100, this.data);
    },

    /**
     * 设置缩放图表
     */
    setzoom({ zoomStart, zoomEnd }) {
      // console.log('范围', zoomStart, zoomEnd);
      this.$refs.chart.setOption({
        dataZoom: [
          {
            type: 'inside',
            startValue: zoomStart,
            endValue: zoomEnd,
          },
        ],
      });
    },

    init() {
      // console.log('开始初始化图表');
      // 2.初始化
      this.$refs.chart.init(echarts, (chart) => {
        // 3.配置数据
        chart.setOption(this.option);
        // 4.传入数据
        // 缩放图表添加能谱数据和平均值标线
        chart.on('datazoom', () => {
          const { startValue, endValue } = chart.getOption().dataZoom[1];
          this.startValue = startValue;
          this.endValue = endValue;
          this.xIndex = endValue;
          this.setTip(0);
          // this.chartVm.showBarChart = false;
          // console.log(startValue, endValue);
        });

        chart.on('showTip', (params) => {
          this.xIndex = params.dataIndex;
          // console.log('显示提示', params.dataIndex);
        });

        // chart.on('hideTip', (params) => {
        //   console.log('隐藏提示', params);
        // });
        chart.getZr().on('mouseup', (params) => {
          console.log(
            '鼠标松开',
            params
            // params.target,
            // params.target?.cursor === 'move',
            // params.target === params.topTarget
          );
          if (this.data[this.xIndex] !== this.chartVm.dataPoint.Radon) {
            this.setTip(0);
            // console.log(this.data[this.xIndex], this.chartVm.dataPoint.Radon);
          }
          // if (params.target?.cursor === 'move') {
          //   console.log('结束移动');
          //   // const pointInPixel = [params.offsetX, params.offsetY];
          //   // // 判断点击的是数据点选择器
          //   // console.log(params);
          //   // // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引值
          //   // const pointInGrid = chart.convertFromPixel(
          //   //   { seriesIndex: 0 },
          //   //   pointInPixel
          //   // );
          //   // const xIndex = pointInGrid[0];
          //   // console.log('x轴点：', xIndex, chart);
          //   this.setTip(0);
          // }
        });

        /**

        // chart.on('mousedown', (params) => {
        //   // 要点中数据线
        //   console.log('鼠标按下', params);
        // });

        // chart.on('mousemove', (params) => {
        //   // 要点中数据线
        //   console.log('鼠标移动', params);
        // });

        // chart.on('mouseup', (params) => {
        //   // 要点中数据线
        //   console.log('鼠标松开', params);
        // });

        // chart.on('mouseout', (params) => {
        //   // 要点中数据线
        //   console.log('鼠标移出', params);
        // });

        // chart.on('globalout', (params) => {
        //   this.chartVm.barUpdate({ show: false });
        //   console.log('鼠标移出图表', params);
        // });
        */

        chart.getZr().on('click', (params) => {
          const pointInPixel = [params.offsetX, params.offsetY];
          if (chart.containPixel('grid', pointInPixel)) {
            // console.log('鼠标点击空白', params);
            // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引值
            const pointInGrid = chart.convertFromPixel(
              { seriesIndex: 0 },
              pointInPixel
            );
            const xIndex = pointInGrid[0];
            this.xIndex = xIndex;
            // console.log('鼠标点击图表内空白', xIndex);
            this.setTip(0);
          } else {
            // console.log('点击图表外', params);
            // this.$refs.chart.chart.dispatchAction({
            //   type: 'hideTip',
            //   seriesIndex: 0,
            // });
          }
        });

        this.isfinished = true;
        if (this.data) {
          this.setdata();
        }
      });
    },

    /**
     * 缩放图表计算数据
     * @param {Number} startValue 图表区域起始下标
     * @param {Number} endValue 图表区域结束下标
     */
    zoomdata(startValue, endValue) {
      // console.log('添加标线');
      this.$refs.chart.setOption({
        dataZoom: [
          {
            type: 'inside',
            startValue,
            endValue,
          },
        ],
        series: [
          {
            // 根据名字对应到相应的系列
            name: '氡浓度(Bq/m³)',
            markLine: {
              silent: true,
              label: { show: true, formatter: '{b} : {c}' },
              data: [
                { type: 'average', name: 'X\u0305' },
                {
                  name: 'X\u0305+1xσ',
                  yAxis: hezhi(this.data, startValue, endValue, 1, 1).toFixed(
                    2
                  ),
                  label: {
                    show: true,
                    formatter: '{b} : {c}\n\n',
                  },
                },
                {
                  name: '\n\nX\u0305-1xσ',
                  yAxis: hezhi(this.data, startValue, endValue, 0, 1),
                },
                {
                  name: 'X\u0305+2xσ',
                  yAxis: hezhi(this.data, startValue, endValue, 1, 2).toFixed(
                    2
                  ),
                  label: {
                    show: true,
                    formatter: '{b} : {c}\n\n\n\n',
                  },
                },
                {
                  name: '\n\n\n\nX\u0305-2xσ',
                  yAxis: hezhi(this.data, startValue, endValue, 0, 2),
                },
              ],
            },
          },
        ],
      });
      // if (Plot_Chart !== undefined && Plot_Chart !== null) {
      //   Plot_Chart.setOption(Plotupoption(this.data, startValue, endValue));
      // }
    },
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
