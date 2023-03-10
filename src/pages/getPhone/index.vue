<template>
  <view>
    <u-button type="primary" text="确定" @click="test"> 跳转</u-button>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'getPhone',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: { ...mapGetters(['token']) },
  methods: {
    ...mapActions('user', ['wxlogin']),
    async test() {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'index'
      )[0];
      console.log(index);
      this.$Router.pushTab(index.path);
    },
    getPhoneNumber(e) {
      console.log('errMsg', e.detail.errMsg);
      const that = this;

      if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
        console.log('用户拒绝提供手机号');
      } else {
        console.log('用户同意提供手机号');
        console.log('iv', e.detail.iv);
        console.log('encryptedData', e.detail.encryptedData);
        const { encryptedData } = e.detail;
        const { iv } = e.detail;

        // 检查登录
        uni.checkSession({
          success: (res) => {
            console.log('checkSession--success---res', res);
            if (res.errMsg === 'checkSession:ok') {
              console.log(res);
              console.log('登录暂未过期');
              if (encryptedData !== undefined && iv !== undefined) {
                that.getPhone(that.loginResCode, encryptedData, iv);
              }
            }
          },
          fail: (res) => {
            console.log('checkSession---fail---res', res);
            console.log('登录已过期');
            // 再执行一次login
            uni.login({
              provider: 'weixin',
              success(loginRes) {
                console.log('loginRes.code', loginRes.code);
                that.loginResCode = loginRes.code;

                if (encryptedData !== undefined && iv !== undefined) {
                  that.getPhone(that.loginResCode, encryptedData, iv);
                }
              },
            });
          },
        });
      }
      // e.detail.errMsg == 'getPhoneNumber:fail Error: 用户未绑定手机，请先在微信客户端进行绑定后重试'  微信会自动引导用户去绑定手机
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
button {
  /* width: calc(100% - 100rpx); */
  position: relative;
  left: -168rpx;
  font-size: 34rpx;
  font-weight: 400;
  display: block;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
  color: #999999;
  background-color: #fff;
  /* #ifdef MP-ALIPAY */
  background-color: #f7f7f7;
  /* #endif */
}
</style>
