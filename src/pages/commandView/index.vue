<template>
  <div class="commandView">commandView</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { datapoints } from '@/api/onenet';
import to from 'await-to-js';

export default {
  components: {},
  data() {
    return {
      dev: null,
    };
  },
  computed: { ...mapGetters(['name', 'devices']) },
  created() {
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      this.getwrodtobyts();
    });
  },
  mounted() {},
  methods: {
    async getwrodtobyts() {
      const [err, res] = await to(
        datapoints({ deviceId: this.dev.deviceid, apikey: this.dev.apikey })
      );
      if (err) {
        return;
      }
      console.log(err, res);
      const wrodtobyts = res.data.data.datastreams.filter(
        (item) => item.id === 'WordTo2Bytes[0]'
      );
      console.log(wrodtobyts);
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

<style scoped></style>
