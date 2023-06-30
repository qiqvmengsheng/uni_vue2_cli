<template>
  <div class="ChangeName">
    <view class="form">
      <u-form :model="form" ref="uForm" labelWidth="100">
        <u-form-item label="设备昵称" prop="abbreviation" ref="item1">
          <u-input
            placeholder="请输入昵称"
            type="text"
            border="surround"
            v-model="form.abbreviation"
          >
          </u-input>
        </u-form-item>
      </u-form>
    </view>
    <view class="btn">
      <u-button
        text="修改昵称"
        type="primary"
        shape="circle"
        @click="setabbreviation"
      ></u-button>
    </view>
  </div>
</template>

<script>
import to from 'await-to-js';
import { mapGetters, mapActions } from 'vuex';
import { application, toast } from '@uni/apis';
import { modifyabbreviation } from '@/api/base';

export default {
  components: {},
  data() {
    return {
      dev: null,
      chartVm: null,
      form: { abbreviation: '' },
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
  },
  created() {
    const pages = application.getCurrentPages();
    const chartVm = pages[pages.length - 2].$vm;
    this.chartVm = chartVm;
    this.$AppReady.then(() => {
      // console.log('收到参数', this.$Route.query);
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      this.form.abbreviation = this.dev.abbreviation;
    });
  },
  methods: {
    ...mapActions('user', ['getInfo']),
    /**
     * 修改备注
     */
    async setabbreviation() {
      const [err, res] = await to(
        modifyabbreviation({
          abbreviation: this.form.abbreviation,
          deviceId: this.dev.deviceid,
        })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      if (res.data.code === 200) {
        await this.getInfo();
        [this.chartVm.dev] = this.devices.filter(
          (dev) => dev.deviceid === this.dev.deviceid
        );
        toast.showToast({
          content: `${this.dev.deviceserial}修改备注成功！`,
          // type: 'success',
        });
        // console.log(this.devices, this.dev);
      } else {
        toast.showToast(res.data.msg);
      }
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
.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
.form {
  width: 95%;
  margin: 30rpx auto;
}
</style>
