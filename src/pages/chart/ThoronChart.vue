<template>
  <view>
    <view class="chart">
      <l-echart ref="chart" @finished="init"></l-echart>
    </view>
  </view>
</template>

<script>
import linechart from '@/mixin/linechart';
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
  name: 'ThoronChart',
  components: { LEchart },
  data() {
    return {
      data: null,
      RadonAt: null,
      isfinished: false,
    };
  },
  mixins: [linechart],
  methods: {
    /**
     * 更新数据
     */
    update(data) {
      // console.log('更新数据');
      this.data = data.Thoron;
      this.RadonAt = data.RadonAt;
      if (this.isfinished) {
        this.setdata();
      }
    },

    setdata() {
      this.$refs.chart.setOption({
        xAxis: {
          data: this.RadonAt,
        },
        series: [{ name: '钍浓度(Bq/m³)', data: this.data }],
      });
      // this.zoomdata(0, 100, this.data);
    },

    /**
     * 设置缩放图表
     */
    setzoom({ zoomStart, zoomEnd }) {
      this.zoomdata(zoomStart, zoomEnd, this.data);
    },

    init() {
      // console.log('开始初始化图表');
      // 2.初始化
      this.$refs.chart.init(echarts, (chart) => {
        // 3.配置数据
        chart.setOption(this.initoption('钍浓度(Bq/m³)', 1));
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
      console.log('添加标线');
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
            name: '钍浓度(Bq/m³)',
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
