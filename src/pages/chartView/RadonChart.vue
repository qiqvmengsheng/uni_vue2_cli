<template>
  <view>
    <view class="chart">
      <l-echart ref="chart" @finished="init"></l-echart>
    </view>
  </view>
</template>

<script>
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
  name: 'RadonChart',
  components: { LEchart },
  data() {
    return {
      chart: null,
      data: null,
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
          axisPointer: {
            type: 'cross',
          },
        },
        grid: {
          right: '10%',
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            // restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: { data: [] },
        yAxis: [
          {
            max(value) {
              const len = 10 ** ((+value.max).toString().length - 1);
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
            start: 0,
            end: 50,
          },
          {
            start: 80,
            end: 100,
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
  props: {
    getzoom: { type: Function, required: true },
    barUpdate: { type: Function, required: true },
    setTooltip: { type: Function, required: true },
  },
  methods: {
    /**
     * 更新数据
     */
    update(data) {
      this.data = data.Radon;
      this.$refs.chart.setOption({
        xAxis: {
          data: data.RadonAt,
        },
        series: [{ name: '氡浓度(Bq/m³)', data: data.Radon }],
      });
      this.barUpdate({ zoomStart: 0, zoomEnd: 100 });
      this.zoomdata(0, 100, data.Radon);
    },

    /**
     * 设置缩放图表
     */
    setzoom({ zoomStart, zoomEnd }) {
      this.zoomdata(zoomStart, zoomEnd, this.data);
    },

    init() {
      // 2.初始化
      this.$refs.chart.init(echarts, (chart) => {
        // 3.配置数据
        chart.setOption(this.option);
        // 4.传入数据
        chart.on('datazoom', () => {
          // // console.log(chart.getOption().dataZoom);
          const { endValue } = chart.getOption().dataZoom[1];
          const { startValue } = chart.getOption().dataZoom[1];
          this.getzoom({
            zoomStart: startValue,
            zoomEnd: endValue,
            source: 'radonchar',
          });
          this.zoomdata(startValue, endValue, this.data);
        });
        chart.on('mouseover', (params) => {
          let dataIndex;
          if (params.componentType === 'series') {
            dataIndex = params.dataIndex;

            this.barUpdate({ zoomStart: dataIndex, zoomEnd: dataIndex });
            // this.$bus.$emit("chartzoom", this.data, dataIndex, dataIndex + 1);
          }
        });
        chart.getZr().on('mousemove', (params) => {
          const pointInPixel = [params.offsetX, params.offsetY];
          // 判断当前鼠标移动的位置是否在图表中
          if (chart.containPixel('grid', pointInPixel)) {
            // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引值
            const pointInGrid = chart.convertFromPixel(
              { seriesIndex: 0 },
              pointInPixel
            );
            // console.log(pointInGrid);
            // x轴数据的索引值
            const xIndex = pointInGrid[0];
            // 调用方法传递x轴索引设定tooltip
            this.setTooltip({
              type: 'showTip',
              dataIndex: xIndex,
              source: 'radonchar',
            });

            // // 使用getOption() 获取图表的option
            // const op = chart.getOption();
            // // 获取当前点击位置要的数据
            // const xDate = op.xAxis[0].data[xIndex];
            // console.log(pointInPixel, "x索引" + xIndex, "x值" + xDate);
            // // 这里不直接用params.dataIndex是因为可能两个图表X轴的月份数据点不一致
            // // const dataIndex = chart.charts.data.xAxis.findIndex(
            // //   (x) => x === xDate
            // // );
            // // console.log(chart);
            // chart.dispatchAction({
            //   type: "showTip",
            //   seriesIndex: 0,
            //   // 我用的echarts版本是4.8.0，用name而不用dataIndex时，不知道为什么tooltip不显示，所以这里用dataIndex
            //   // name: params.name
            //   dataIndex: xIndex,
            // });
          } else {
            // 隐藏tooltip
            this.setTooltip({
              type: 'hideTip',
              dataIndex: 0,
              source: 'radonchar',
            });
          }
        });
      });
    },

    /**
     * 缩放图表计算数据
     * @param {Number} startValue 图表区域起始下标
     * @param {Number} endValue 图表区域结束下标
     */
    zoomdata(startValue, endValue, datas1) {
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
                  yAxis: hezhi(datas1, startValue, endValue, 1, 1).toFixed(2),
                  label: {
                    show: true,
                    formatter: '{b} : {c}\n\n',
                  },
                },
                {
                  name: '\n\nX\u0305-1xσ',
                  yAxis: hezhi(datas1, startValue, endValue, 0, 1),
                },
                {
                  name: 'X\u0305+2xσ',
                  yAxis: hezhi(datas1, startValue, endValue, 1, 2).toFixed(2),
                  label: {
                    show: true,
                    formatter: '{b} : {c}\n\n\n\n',
                  },
                },
                {
                  name: '\n\n\n\nX\u0305-2xσ',
                  yAxis: hezhi(datas1, startValue, endValue, 0, 2),
                },
              ],
            },
          },
        ],
      });
      // if (Plot_Chart !== undefined && Plot_Chart !== null) {
      //   Plot_Chart.setOption(Plotupoption(datas1, startValue, endValue));
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
