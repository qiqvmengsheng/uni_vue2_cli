<template>
  <div class="device">
    <view class="bg"></view>
    <template>
      <u-sticky bgColor="rgba(0,0,0,0)">
        <view class="tabs">
          <view>
            <u-tabs :list="list1" @change="change1" scrollable="false"></u-tabs>
          </view>
        </view>
      </u-sticky>
    </template>
    <view v-show="show"> <dataList :data="data"></dataList> </view>
    <view v-show="!show"><commandView></commandView></view>
  </div>
</template>

<script>
import to from 'await-to-js';
import { mapGetters } from 'vuex';
import { DataStreams } from '@/api/onenet';
import commandView from '../../commandView/index';
import dataList from '../components/datalist';

export default {
  components: { commandView, dataList },
  data() {
    return {
      dev: null,
      // dlist: null,
      data: null,
      show: true,
      list1: [
        { name: '数据展示', show: true },
        { name: '命令下发', show: false },
      ],
    };
  },
  computed: {
    ...mapGetters(['devices']),
    // datalist() {
    //   return [...this.data];
    // },
  },
  created() {
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      console.log('设备页面', this.dev);
      this.getwrodtobyts();
    });
  },
  methods: {
    change1(item) {
      this.show = item.show;
      console.log(item);
    },

    /**
     * 获取设置
     */
    async getwrodtobyts() {
      // const a = ['Radon', 'Thoron', 'temperature', 'Pressure', 'humidity'];
      const [err, res] = await to(
        DataStreams({ deviceId: this.dev.deviceid, apikey: this.dev.apikey })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      console.log(res.data);
      const data = {};
      // const arr = [];
      res.data.data.forEach((l) => {
        data[l.id] = l.current_value;
        // if (a.includes(l.id)) arr.push(l);
      });
      data.update_at = res.data.data.filter(
        (item) => item.id === 'Radon'
      )[0].update_at;
      this.data = data;
      // this.dlist = arr;
      console.log(data);
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

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.bg {
  @include ArcBackground();
}
.tabs {
  display: flex;
  /* 主轴空位分配方式justify-content */
  justify-content: center;
  margin: 0 auto 20rpx;
  & view {
    background-color: #fff;
  }
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
