export default {
  props: {
    getzoom: { type: Function, required: true },
    barUpdate: { type: Function, required: true },
    setTooltip: { type: Function, required: true },
  },
  data() {
    return {
      colors: ['#5470C6', '#91CC75', '#EE6666', '#f5c85c', '#7fc0dd'],
    };
  },
  methods: {
    /**
     * 生成图表框架
     * @param {String} name 图表类型
     * @param {Number} color 曲线颜色
     */
    initoption(name, color) {
      const option = {
        color: this.colors,
        title: {
          // text: "Rtm1688示例",
        },
        legend: {
          data: [
            {
              name,
              textStyle: {
                fontSize: 20,
              },
            },
          ],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        grid: {
          right: '10%',
          left: '15%',
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     // restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        xAxis: { data: [] },
        yAxis: [
          {
            type: 'value',
            name: '浓度',
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.colors[color],
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
            name,
            type: 'line',
            color: this.colors[color],
            smooth: true,
            data: [],
          },
        ],
      };
      return option;
    },
  },
};
