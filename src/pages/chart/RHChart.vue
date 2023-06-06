<template>
  <view>
    <view class="chart">
      <l-echart ref="chart" @finished="init"></l-echart>
    </view>
  </view>
</template>

<script>
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
  name: 'RHChart',
  components: { LEchart },
  data() {
    return {
      colors: ['#5470C6', '#91CC75', '#EE6666', '#f5c85c', '#7fc0dd'],
      data: null,
      RadonAt: null,
      isfinished: false,
    };
  },
  props: {
    // getzoom: { type: Function, required: true },
    // setTooltip: { type: Function, required: true },
  },
  methods: {
    /**
     * 更新数据
     */
    update(data) {
      // console.log('更新数据');
      this.data = data;
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
        series: [
          {
            // 根据名字对应到相应的系列
            name: '相对湿度(%)',
            data: this.data.humidity,
          },
        ],
      });
      this.zoomdata(0, 100, this.data);
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
        chart.setOption(this.stoption());
        // 4.传入数据
        // console.log('结束初始化图表', this.data);
        this.isfinished = true;
        if (this.data) {
          this.setdata();
        }
      });
    },

    /**
     * 缩放图表
     * @param {Number} startValue 图表区域起始下标
     * @param {Number} endValue 图表区域结束下标
     */
    zoomdata(startValue, endValue) {
      this.$refs.chart.setOption({
        dataZoom: [
          {
            type: 'inside',
            startValue,
            endValue,
          },
        ],
      });
    },

    /**
     * 生成图表框架
     */
    stoption() {
      const option = {
        color: this.colors,
        title: {
          // text: "Rtm1688示例",
        },
        legend: {
          data: [
            {
              name: '相对湿度(%)',
              textStyle: {
                fontSize: 20,
              },
            },
          ],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
        },
        grid: {
          right: '10%',
          left: '15%',
        },
        xAxis: { data: [] },
        yAxis: [
          {
            min: 0, // 最小刻度
            max: 100, // 最大刻度
            type: 'value',
            name: '相对湿度',
            // offset: 50,
            // offset: 130,
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.colors[4],
              },
            },
            axisLabel: {
              formatter: '{value} %',
            },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 80,
            end: 100,
          },
          {
            start: 80,
            end: 100,
          },
        ],
        series: [
          {
            // 根据名字对应到相应的系列
            name: '相对湿度(%)',
            type: 'line',
            color: this.colors[3],
            smooth: true,
            data: [],
          },
        ],
      };

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
