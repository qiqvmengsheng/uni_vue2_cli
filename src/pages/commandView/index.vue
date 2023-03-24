<template>
  <div class="commandView">
    <view class="btnView">
      <view class="ubutton">
        <u-button text="镂空按钮" size="normal" type="warning" plain></u-button>
      </view>
      <view class="ubutton">
        <u-button text="停止测量" size="normal" type="warning" plain></u-button>
      </view>
      <view class="ubutton">
        <u-button text="清除数据" size="normal" type="error" plain></u-button>
      </view>
      <view class="ubutton">
        <u-button
          text="开始测量"
          size="normal"
          type="primary"
          plain
          hairline
        ></u-button>
      </view>
    </view>

    <u-cell-group>
      <u-cell
        title="泵运行模式"
        :value="PumpMode === '0' ? '连续' : PumpMode === '1' ? '间隔' : ''"
        isLink
        @click="PumpModeshow = true"
        :disabled="disabled"
      ></u-cell>
      <u-cell
        title="氡计算模式"
        :value="
          RadonMode === '0' ? '慢速氡' : RadonMode === '1' ? '快速氡' : ''
        "
        isLink
        @click="RadonModeshow = true"
        :disabled="disabled"
      ></u-cell>
      <u-cell
        title="显示单位"
        :value="Units === '0' ? 'SI公制' : Units === '1' ? 'US英制' : ''"
        isLink
        @click="Unitsshow = true"
        :disabled="disabled"
      ></u-cell>
      <u-cell
        title="蜂鸣器"
        :value="Buzzertext"
        isLink
        @click="Buzzershow = true"
        :disabled="disabled"
      ></u-cell>
      <u-cell
        title="设备周期"
        :value="SampleInterval"
        isLink
        @click="Intervalshow = true"
        :disabled="disabled"
      ></u-cell>
    </u-cell-group>

    <u-popup :show="Intervalshow" mode="bottom" @close="Intervalshow = false">
      <view>
        <u--input
          placeholder="请输入周期"
          border="surround"
          v-model="SampleInterval"
          type="number"
        ></u--input>
      </view>
    </u-popup>

    <u-action-sheet
      :actions="PumpModelist"
      title="泵运行模式"
      @select="selectClick"
      @close="PumpModeshow = false"
      :show="PumpModeshow"
    ></u-action-sheet>
    <u-action-sheet
      :actions="RadonModelist"
      title="氡计算模式"
      @select="selectClick"
      @close="RadonModeshow = false"
      :show="RadonModeshow"
    ></u-action-sheet>
    <u-action-sheet
      :actions="Unitslist"
      title="显示单位"
      @select="selectClick"
      @close="Unitsshow = false"
      :show="Unitsshow"
    ></u-action-sheet>
    <u-action-sheet
      :actions="Buzzerlist"
      title="蜂鸣器"
      @select="selectClick"
      @close="Buzzershow = false"
      :show="Buzzershow"
    ></u-action-sheet>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { datapoints, devsdatapoints, DataStreams } from '@/api/onenet';
import to from 'await-to-js';

export default {
  components: {},
  data() {
    return {
      dev: null,
      wrodtobyts: '',
      SampleInterval: 0,
      Intervalshow: false,
      disabled: true,
      PumpMode: '',
      PumpModeshow: false,
      PumpModelist: [
        { name: '连续', value: '0', type: 'PumpMode' },
        { name: '间隔', value: '1', type: 'PumpMode' },
      ],
      RadonMode: '',
      RadonModeshow: false,
      RadonModelist: [
        { name: '慢速氡', value: '0', type: 'RadonMode' },
        { name: '快速氡', value: '1', type: 'RadonMode' },
      ],
      Units: '',
      Unitsshow: false,
      Unitslist: [
        { name: 'SI公制', value: '0', type: 'Units' },
        { name: 'US英制', value: '1', type: 'Units' },
      ],
      Buzzer: '',
      Buzzershow: false,
      Buzzerlist: [
        { name: '关闭', value: '00', type: 'Buzzer' },
        { name: '开启', value: '01', type: 'Buzzer' },
        { name: 'Po216探测阈值', value: '10', type: 'Buzzer' },
        { name: 'Po218探测阈值', value: '11', type: 'Buzzer' },
      ],
      list: [],
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
    Buzzertext() {
      let text = '';
      if (this.Buzzer === '00') text = '关闭';
      if (this.Buzzer === '01') text = '开启';
      if (this.Buzzer === '10') text = 'Po216探测阈值';
      if (this.Buzzer === '11') text = 'Po218探测阈值';
      return text;
    },
  },
  created() {
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      console.log(this.dev);
      this.getwrodtobyts();
    });
  },
  mounted() {},
  methods: {
    async getwrodtobyts() {
      const [err, res] = await to(
        DataStreams({ deviceId: this.dev.deviceid, apikey: this.dev.apikey })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      const [wrodtobyts0] = res.data.data.filter(
        (item) => item.id === 'WordTo2Bytes[0]'
      );
      const [wrodtobyts1] = res.data.data.filter(
        (item) => item.id === 'WordTo2Bytes[1]'
      );
      const [SampleInterval] = res.data.data.filter(
        (item) => item.id === 'Sample_Interval'
      );
      this.SampleInterval = SampleInterval.current_value;
      this.wrodtobyts =
        wrodtobyts1.current_value.toString(16).padStart(2, '0') +
        wrodtobyts0.current_value.toString(16).padStart(2, '0');
      console.log(this.wrodtobyts, this.SampleInterval);
    },
    selectClick(index) {
      this[index.type] = index.value;
      console.log(index);
    },
    async test() {
      const [e, r] = await to(
        devsdatapoints({
          devIds: this.dev.deviceid,
          auth: this.dev.authorization,
        })
      );
      console.log('devsdatapoints', e, r);
      const [e1, r1] = await to(
        datapoints({ deviceId: this.dev.deviceid, apikey: this.dev.apikey })
      );
      console.log('DataStreams', e1, r1);
      const wrodtobyts = r1.data.data.filter(
        (item) => item.id === 'WordTo2Bytes[0]'
      );
      console.log(wrodtobyts);
    },
  },
  watch: {
    wrodtobyts: {
      /**
       * 根据新的值更改显示的设置
       * @param {String} newValue
       */
      handler(newValue) {
        const b = parseInt(newValue.slice(2, 4) + newValue.slice(0, 2), 16)
          .toString(2)
          .padStart(16, '0');
        this.bits = b;
        // console.log(b);
        this.PumpMode = b.slice(12, 13);
        this.RadonMode = b.slice(13, 14);
        this.Units = b.slice(11, 12);
        this.Buzzer = b.slice(14, 16);
        this.disabled = false;
      },
    },
  },

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
.btnView {
  display: flex;
  // flex轴横向，溢出换行。 flex-direction: row;  flex-wrap: wrap; 简写 flex-flow
  flex-flow: row wrap;
  // 副轴对齐方式align-items  上下居中
  align-items: center;
}
.ubutton {
  margin: 0 15rpx 15rpx 0;
}
</style>
