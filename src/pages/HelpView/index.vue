<template>
  <div class="HelpView">
    <view class="collapse">
      <u-collapse>
        <u-collapse-item title="如何删除设备？">
          <text class="u-collapse-content"
            >长按要删除的设备即可弹出删除设备对话框，点击确认即可删除。</text
          >
        </u-collapse-item>
        <u-collapse-item title="如何删除设备？">
          <text class="u-collapse-content"
            >长按要删除的设备即可弹出删除设备对话框，点击确认即可删除。</text
          >
        </u-collapse-item>
      </u-collapse>
    </view>
    <view class="button">
      <u-button
        text="反馈"
        type="primary"
        shape="circle"
        @click="$Router.push({ name: 'FeedbackView' })"
      ></u-button>
    </view>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    intn() {
      this.$Router.push({ name: 'FeedbackView' });
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
.collapse {
  background-color: #fff;
}
.button {
  z-index: 50;
  height: 80rpx;
  width: 90%;
  margin-left: 5%;
  position: fixed;
  bottom: 40rpx;
}
</style>
