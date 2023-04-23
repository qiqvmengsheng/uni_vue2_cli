<template>
  <div class="chartView">
    <view class="chart">
      <RadonChart
        class="echart"
        ref="radonchar"
        :getzoom="getzoom"
        :barUpdate="barUpdate"
        :setTooltip="setTooltip"
      ></RadonChart>
    </view>
    <view class="chart">
      <ThoronChart
        class="echart"
        ref="Thoronchar"
        :getzoom="getzoom"
        :barUpdate="barUpdate"
        :setTooltip="setTooltip"
      ></ThoronChart>
    </view>
    <view class="chart">
      <Tempera
        class="echart"
        ref="AmbientChart"
        :getzoom="getzoom"
        :barUpdate="barUpdate"
        :setTooltip="setTooltip"
      ></Tempera>
    </view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import to from 'await-to-js';
import { toast, confirm } from '@uni/apis';
import { measuredGetdata, getlastDatas } from '@/api/devdata';
import RadonChart from './RadonChart';
import ThoronChart from './ThoronChart';
import Tempera from './temperature';

export default {
  components: { RadonChart, ThoronChart, Tempera },
  data() {
    return {
      data: null,
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
  },
  created() {
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      console.log('获得dev', this.dev);
      this.getdata();
    });
  },
  methods: {
    async getdata() {
      const [err, res] = await to(
        getlastDatas({
          deviceid: this.dev.deviceid,
          numbers: 100,
        })
      );
      if (err) {
        console.log('获取服务器数据错误：\n', err);
        return Promise.reject(err);
      }
      // console.log('获取服务器数据：\n', res);
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
      console.log(this.data);
      this.update(this.data);
      return Promise.resolve(data);
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

    update(data) {
      console.log(this.$refs);
      // this.$refs.qhradonchar.update(data);
      // this.$refs.qhThoronchar.update(data);
      // this.$refs.qhAmbientChart.update(data);
      this.$refs.radonchar.update(data);
      this.$refs.Thoronchar.update(data);
      this.$refs.AmbientChart.update(data);
    },

    barUpdate({ zoomStart, zoomEnd }) {
      // if (this.qh) {
      //   this.$refs.qhbarchar.update({
      //     datas: this.data,
      //     startValue: zoomStart,
      //     endValue: zoomEnd,
      //   });
      // } else {
      //   this.$refs.barchar.update({
      //     datas: this.data,
      //     startValue: zoomStart,
      //     endValue: zoomEnd,
      //   });
      // }
    },
    getzoom({ zoomStart, zoomEnd, source }) {
      // this.zoomStart = zoomStart;
      // this.zoomEnd = zoomEnd;
      // this.setzoom({ zoomStart, zoomEnd, source });
    },
    setzoom({ zoomStart, zoomEnd, source }) {
      this.barUpdate({ zoomStart, zoomEnd });
      const { radonchar, Thoronchar, AmbientChart } = this.getchartRef();
      if (source !== 'radonchar') radonchar.setzoom({ zoomStart, zoomEnd });
      if (source !== 'Thoronchar') Thoronchar.setzoom({ zoomStart, zoomEnd });
      if (source !== 'AmbientChart')
        AmbientChart.setzoom({ zoomStart, zoomEnd });

      // radonchar.setzoom({ zoomStart, zoomEnd });
      // Thoronchar.setzoom({ zoomStart, zoomEnd });
      // AmbientChart.setzoom({ zoomStart, zoomEnd });
    },

    setTooltip({ type, dataIndex, source }) {
      // const { radonchar, Thoronchar, AmbientChart } = this.getchartRef();
      // if (source !== 'radonchar')
      //   radonchar.chart.dispatchAction({
      //     type,
      //     seriesIndex: 0,
      //     dataIndex,
      //   });
      // if (source !== 'Thoronchar')
      //   Thoronchar.chart.dispatchAction({
      //     type,
      //     seriesIndex: 0,
      //     dataIndex,
      //   });
      // if (source !== 'AmbientChart')
      //   AmbientChart.chart.dispatchAction({
      //     type,
      //     seriesIndex: 0,
      //     dataIndex,
      //   });
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
