<template>
  <div class="FeedbackView">
    <view class="textarea">
      <view class="text"> 反馈内容：</view>
      <u--textarea v-model="value1" placeholder="请输入内容" count>
      </u--textarea>
    </view>
    <view class="form">
      <u-form :model="dev" ref="uForm" labelWidth="100">
        <u-form-item label="邮箱" prop="devicename" borderBottom ref="item1">
          <u-input v-model="dev.accesscode" type="select" />
          <u-input
            v-model="dev.devicename"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择设备类型"
            border="none"
          ></u-input>
        </u-form-item>
      </u-form>
    </view>
    <view class="btn">
      <u-button
        text="提交反馈"
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
    return {
      value1: '',
    };
  },
  computed: {},
  methods: {},
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
.text {
  padding-bottom: 10rpx;
}
.textarea {
  margin: 20rpx;
}
.form {
  margin: 20rpx;
}
.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
</style>
