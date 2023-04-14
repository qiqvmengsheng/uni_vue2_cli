<template>
  <div class="device">
    <template>
      <view class="tabs">
        <u-sticky bgColor="#fff">
          <u-tabs :list="list1" @change="change1" scrollable="false"></u-tabs>
        </u-sticky>
      </view>
    </template>
    <view v-show="show"></view>
    <view v-show="!show"><commandView></commandView></view>
  </div>
</template>

<script>
import commandView from '../../commandView/index';

export default {
  components: { commandView },
  data() {
    return {
      show: true,
      list1: [
        { name: '数据展示', show: true },
        { name: '命令下发', show: false },
      ],
    };
  },
  computed: {},
  created() {
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      // console.log(this.dev);
      this.getwrodtobyts();
    });
  },
  methods: {
    change1(item) {
      this.show = item.show;
      console.log(item);
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
.tabs {
  display: flex;
  /* 主轴空位分配方式justify-content */
  justify-content: center;
  margin: 0 auto 20rpx;
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
