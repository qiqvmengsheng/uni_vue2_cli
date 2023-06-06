<template>
  <view>
    <view class="chart">
      <l-echart ref="chart" @finished="init"></l-echart>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { PlotData } from '@/utils/disposalData';
import LEchart from '@/components/l-echart/l-echart';
import * as echarts from 'echarts';
// 按需引入 开始
// import * as echarts from 'echarts/core';
// import { LineChart, BarChart } from 'echarts/charts';
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   DatasetComponent,
//   TransformComponent,
//   LegendComponent,
//   ToolboxComponent,
//   DataZoomComponent,
//   MarkLineComponent,
// } from 'echarts/components';
// // 标签自动布局，全局过渡动画等特性
// import { LabelLayout, UniversalTransition } from 'echarts/features';
// // 引入 Canvas 渲染器，注意引入 CanvasRenderer 是必须的一步
// import { CanvasRenderer } from 'echarts/renderers';
// // 注册必须的组件
// echarts.use([
//   LegendComponent,
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   DatasetComponent,
//   TransformComponent,
//   LineChart,
//   BarChart,
//   LabelLayout,
//   UniversalTransition,
//   CanvasRenderer,
//   ToolboxComponent,
//   DataZoomComponent,
//   MarkLineComponent,
// ]);
// -------------按需引入结束------------------------

export default {
  name: 'BarChart',
  components: { LEchart },
  data() {
    return {
      dev: null,
      data: null,
      isfinished: false,
      marks: null,
      startValue: 0,
      endValue: 100,
    };
  },
  props: {
    // getzoom: { type: Function, required: true },
    // setTooltip: { type: Function, required: true },
  },
  computed: {
    ...mapGetters(['name', 'devices']),
  },
  created() {
    this.$AppReady.then(() => {
      // console.log('bar收到参数', this.$Route.query);
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      // console.log('bar获得dev', this.dev);
    });
  },
  mounted() {
    // console.log('bar完成挂载');
    // this.$nextTick(() => {
    //   console.log('bar子元素完成挂载');
    // });
  },
  methods: {
    /**
     * 更新数据
     */
    update({ datas, startValue, endValue, marks }) {
      // console.log('bar获取到数据', { datas, startValue, endValue, marks });
      this.data = datas;
      this.startValue = startValue;
      this.endValue = endValue;
      this.marks = marks;
      if (this.isfinished) {
        this.setdata({ datas, startValue, endValue, marks });
      }
    },

    setdata({ datas, startValue, endValue, marks }) {
      // console.log('收到数据', datas, startValue, endValue, marks);
      this.marks = marks;
      if (startValue === endValue && datas.RadonAt.length > startValue) {
        const RadonAt = new Date(datas.RadonAt[startValue]);
        const fmark = marks.filter((mark) => RadonAt >= new Date(mark.time));
        fmark.sort((a, b) => new Date(b.time) - new Date(a.time));
        if (fmark.length <= 0) {
          this.$refs.chart.setOption(
            this.Plotupoption(datas, startValue, endValue)
          );
          return;
        }
        const { po212, po214, po216, po218 } = fmark[0];
        const keys = Object.keys({ po212, po214, po216, po218 });
        const markLine = [];
        keys.forEach((key) => {
          if (fmark[0][key]) markLine.push({ name: key, value: fmark[0][key] });
        });
        // console.log(this.dev.markings, markLine, fmark[0]);
        this.$refs.chart.setOption(
          this.markLineOption(datas, startValue, endValue, markLine)
        );
        return;
      }
      this.$refs.chart.setOption(
        this.Plotupoption(datas, startValue, endValue)
      );
    },

    init() {
      // console.log('开始初始化bar图表');
      // 2.初始化
      this.$refs.chart.init(echarts, (chart) => {
        // 3.配置数据
        chart.setOption(this.barOption());
        // 4.传入数据
        // console.log('结束初始化图表', this.data);
        this.isfinished = true;
        if (this.data) {
          this.setdata({
            datas: this.data,
            startValue: this.startValue,
            endValue: this.endValue,
            marks: this.marks,
          });
        }
      });
    },

    /**
     * 柱状图表框架
     */
    barOption() {
      const PlotNames = [];
      for (let i = 1; i <= 38; i += 1) {
        PlotNames.push(`Plot_${i}`);
      }
      const option = {
        // title: {
        //   text: '能谱',
        // },
        // legend: {
        //   data: ['能谱'],
        //   textStyle: {
        //     // 图例字体大小
        //     fontSize: 16,
        //   },
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          // left: '8%',
          // right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: PlotNames,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'cts',
            type: 'bar',
            barWidth: '80%',
            data: [],
          },
          {
            type: 'bar',
            barGap: '5%',
            markLine: {
              silent: true, // 不响应鼠标事件
              symbol: ['none', 'none'], // 去掉箭头
              position: 'start',
              label: {
                show: true,
                // padding: "15px",
                position: 'end',
                // distance: ["20px", "2px"],
                // nameRotate: "-90",
              },
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    // color: "",
                  },
                },
              },
              data: [],
            },
          },
        ],
      };
      option.series[1].markLine.data = [];
      this.dev?.markings?.forEach((item) => {
        option.series[1].markLine.data.push({
          label: {
            formatter: `${'\t '.repeat(5)}{b}`,
          },
          name: item.name,
          xAxis: `Plot_${item.value}`,
        });
        // console.log(item);
      });
      return option;
    },

    /**
     * 根据缩放计算范围内能谱
     * @param {*} datas1 数据数组
     * @param {*} startValue 截取数据起始点
     * @param {*} endValue 截取数据结束点
     * @returns
     */
    Plotupoption(datas1, startValue, endValue) {
      return {
        series: [
          {
            name: 'cts',
            data: PlotData(datas1, startValue, endValue),
          },
        ],
      };
    },

    /**
     * 显示单个点的能谱添加对应标线
     * @param {*} datas1 数据数组
     * @param {*} startValue 截取数据起始点
     * @param {*} endValue 截取数据结束点
     * @returns
     */
    markLineOption(datas1, startValue, endValue, markLine) {
      const option = {
        series: [
          {
            name: 'cts',
            data: PlotData(datas1, startValue, endValue),
          },
          {
            type: 'bar',
            barGap: '5%',
            markLine: {
              silent: true, // 不响应鼠标事件
              symbol: ['none', 'none'], // 去掉箭头
              position: 'start',
              label: {
                show: true,
                // padding: "15px",
                position: 'end',
                // distance: ["20px", "2px"],
                // nameRotate: "-90",
              },
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    // color: "",
                  },
                },
              },
              data: [],
            },
          },
        ],
      };
      markLine?.forEach((item) => {
        option.series[1].markLine.data.push({
          label: {
            formatter: `${'\t '.repeat(5)}{b}`,
          },
          name: item.name,
          xAxis: `Plot_${item.value}`,
        });
        // console.log(item);
      });
      return option;
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
