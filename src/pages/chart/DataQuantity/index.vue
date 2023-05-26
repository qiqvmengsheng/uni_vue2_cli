<template>
  <div class="DataQuantity">
    <u-modal
      :show="formshow"
      title="显示数据量"
      closeOnClickOverlay
      @close="formshow = false"
      @confirm="confirmform()"
    >
      <view>
        <u-form :model="form" ref="uForm" :rules="rules" labelWidth="100">
          <u-form-item label="数据数量" prop="number" ref="item1">
            <u-input
              placeholder="请输入数量"
              type="number"
              border="surround"
              v-model.number="form.number"
            >
              <template slot="suffix">
                <u-text text="个" margin="0 3px 0 0" type="tips"></u-text>
              </template>
            </u-input>
          </u-form-item>
        </u-form>
      </view>
    </u-modal>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: { number: 100 },
      formshow: true,
      rules: [],
    };
  },
  computed: {},
  created() {
    this.$AppReady.then(() => {
      console.log('收到参数', this.$Route.query);
      // this.datastreams = this.$Route.query.datastreams;
      // const id = this.$Route.query.deviceid;
      // [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      // console.log('获得dev', this.dev);
      // this.getdata();
      // this.getmakings();
    });
  },
  methods: {
    /**
     * 确认获取数据
     */
    confirmform() {
      // this.$Router.replace({
      //   name: 'chartView',
      //   params: { number: this.number },
      // });
      this.$Router.back(1, {
        name: 'chartView',
        params: { number: this.number },
      });
      this.$route.params.user = '123';
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

<style lang="scss" scoped></style>
