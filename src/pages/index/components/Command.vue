<template>
  <div class="commandView">
    <view></view>
    <view class="cell">
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
      </u-cell-group>
    </view>
    <view class="btnView">
      <view class="ubutton">
        <u-button
          :disabled="disabled"
          @click="sendBytes()"
          text="确认修改设置"
          size="normal"
          type="primary"
        ></u-button>
      </view>
    </view>

    <view class="cell">
      <u-cell-group>
        <u-cell
          title="设备周期"
          :value="form.SampleInterval"
          isLink
          @click="Intervalshow = true"
          :disabled="disabled"
        ></u-cell>
      </u-cell-group>
    </view>
    <view class="btnView">
      <view class="ubutton">
        <u-button
          :disabled="disabled"
          @click="setSampleInterval()"
          text="确认修改周期"
          size="normal"
          type="primary"
        ></u-button>
      </view>
    </view>

    <view class="tips">
      <text>
        注释：请务必用以下顺序来修改设置和周期，首先停止测量，随后修改，最后重新开始测量。最新数据会在开始测量一周期后出现，请耐心等待。
      </text>
    </view>

    <view class="btnView">
      <view class="ubutton" v-if="disabled">
        <u-button
          @click="disabled = false"
          text="修改设置"
          size="normal"
          type="primary"
        ></u-button>
      </view>
      <view class="ubutton" v-if="!disabled">
        <u-button
          @click="qx"
          text="取消修改"
          size="normal"
          type="info"
          plain
        ></u-button>
      </view>
      <view class="ubutton">
        <u-button
          @click="SendCommand('CMD:STOP', '停止测量')"
          text="停止测量"
          size="normal"
          type="warning"
          plain
        ></u-button>
      </view>
      <view class="ubutton">
        <u-button
          @click="SendCommand('CMD:CLEAR', '清除设备数据')"
          text="清除数据"
          size="normal"
          type="error"
          plain
        ></u-button>
      </view>
      <view class="ubutton">
        <u-button
          @click="SendCommand('CMD:START', '开始测量')"
          text="开始测量"
          size="normal"
          type="primary"
          plain
          hairline
        ></u-button>
      </view>
    </view>

    <!-- <u-popup :show="Intervalshow" mode="bottom" @close="Intervalshow = false">

    </u-popup> -->

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

    <u-modal
      :show="Intervalshow"
      title="周期"
      closeOnClickOverlay
      @close="cheekInterval()"
      @confirm="cheekInterval()"
    >
      <view>
        <u-form :model="form" ref="uForm" labelWidth="100">
          <u-form-item
            label="设备周期"
            prop="SampleInterval"
            @click="showDevtype = true"
            ref="item1"
          >
            <u-input
              placeholder="请输入周期"
              type="number"
              border="surround"
              v-model.number="form.SampleInterval"
            >
              <template slot="suffix">
                <u-text text="分钟" margin="0 3px 0 0" type="tips"></u-text>
              </template>
            </u-input>
          </u-form-item>
        </u-form>
      </view>
    </u-modal>
  </div>
</template>

<script>
import {
  datapoints,
  devsdatapoints,
  DataStreams,
  onenetcmds,
} from '@/api/onenet';
import to from 'await-to-js';
import { toast, confirm } from '@uni/apis';

export default {
  props: {
    dev: { required: true },
    getdata: { required: true },
  },
  data() {
    return {
      data: null,
      lastDataTime: '',
      lastSettingTime: '',
      wrodtobyts: '',
      bits: '',
      form: {
        SampleInterval: 0,
      },
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
      rules: {
        SampleInterval: [
          {
            // type: 'number',
            required: true,
            pattern: /^[\d]+$/,
            min: 1,
            max: 255,
            message: '必须是1到255的整数',
            trigger: 'blur',
          },
          {
            type: 'number',
            asyncValidator(rule, value, callback) {
              if (value >= 1 && value <= 255) {
                callback();
              } else {
                callback(rule.message);
              }
            },
            message: '必须是在1到255之间',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    Buzzertext() {
      let text = '';
      if (this.Buzzer === '00') text = '关闭';
      if (this.Buzzer === '01') text = '开启';
      if (this.Buzzer === '10') text = 'Po216探测阈值';
      if (this.Buzzer === '11') text = 'Po218探测阈值';
      return text;
    },
  },
  created() {},
  mounted() {},
  methods: {
    qx() {
      const that = this.getdata();
      that.getdata();
      this.disabled = true;
      console.log('方法传', that);
    },
    /**
     * 获取数据
     */
    update(data) {
      this.data = data;
    },
    /**
     * 获取设置
     */
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
      const [Radon] = res.data.data.filter((item) => item.id === 'Radon');
      this.lastDataTime = Radon.update_at;
      this.lastSettingTime = wrodtobyts0.update_at;
      this.form.SampleInterval = SampleInterval.current_value;
      this.wrodtobyts =
        wrodtobyts1.current_value.toString(16).padStart(2, '0') +
        wrodtobyts0.current_value.toString(16).padStart(2, '0');
      // this.codeSetting(this.wrodtobyts);
      console.log(Radon, this.wrodtobyts, this.form.SampleInterval);
    },
    selectClick(index) {
      this[index.type] = index.value;
      // console.log(index);
    },

    /**
     * 校验周期
     */
    async cheekInterval() {
      const [err, res] = await to(this.$refs.uForm.validate());
      if (err) {
        console.log(err, res);
        return;
      }
      this.Intervalshow = false;
    },

    /**
     * 修改周期方法
     */
    async setSampleInterval() {
      const [err, res] = await to(this.$refs.uForm.validate());
      if (err) {
        console.log(err, res);
        return;
      }
      this.SendCommand(
        `CMD:TIME+${this.form.SampleInterval}`,
        `修改设备周期为${this.form.SampleInterval} 分钟`
      );
      this.Intervalshow = false;
    },

    /**
     * 发送修改wrodtobyts命令
     */
    async sendBytes() {
      if (
        this.PumpMode !== '' &&
        this.RadonMode !== '' &&
        this.Units !== '' &&
        this.Buzzer !== ''
      ) {
        const b =
          (this.bits.slice(0, 11) || '00000000011') +
          this.Units +
          this.PumpMode +
          this.RadonMode +
          this.Buzzer;
        let c = '';
        let d = '';
        let cs = '';
        c += parseInt(b, 2).toString(16).padStart(4, '0').slice(2, 4);
        c += parseInt(b, 2).toString(16).padStart(4, '0').slice(0, 2);
        d += String.fromCharCode(parseInt(c.slice(0, 2), 16));
        d += String.fromCharCode(parseInt(c.slice(2, 4), 16));
        cs = `CMD:WordTo2Bytes+${d}`;
        console.log(b, c, d, cs);

        const res = await confirm({
          title: '提示',
          content: `确认修改设置! \r\n
          命令二进制数：${b} \r\n
          命令两个16进制bytes：${c} \r\n
          命令bytes转Unicode符： ${d} \r\n
          最终下发的命令：${cs}`,
        });
        if (res.cancel) {
          return;
        }
        this.wrodtobyts = c;
        this.SendCommand(cs, '修改设置');
      } else {
        toast('请选好设置');
      }
    },

    /**
     * 提示下发修改命令
     */
    async SendCommand(sms, text) {
      const r = await confirm({
        title: '提示',
        content: `确认${text}？`,
      });
      if (r.cancel) {
        return;
      }
      const [err, res] = await to(
        onenetcmds({
          deviceid: this.dev.deviceid,
          apikey: this.dev.apikey,
          sms,
        })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      console.log(res);
      if (res.data.errno !== 0) {
        toast.showToast({ type: 'fail', content: '失败', mask: true });
        return;
      }
      toast.showToast({
        type: 'success',
        content: '成功',
        mask: true,
      });
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

    /**
     * 根据wrodtobyts显示设置
     */
    codeSetting(newValue) {
      const b = parseInt(newValue.slice(2, 4) + newValue.slice(0, 2), 16)
        .toString(2)
        .padStart(16, '0');
      this.bits = b;
      // console.log(b);
      this.PumpMode = b.slice(12, 13);
      this.RadonMode = b.slice(13, 14);
      this.Units = b.slice(11, 12);
      this.Buzzer = b.slice(14, 16);
      this.disabled = true;
      console.log('更改选项');
    },
  },
  watch: {
    wrodtobyts: {
      /**
       * 根据新的值更改显示的设置
       * @param {String} newValue
       */
      handler(newValue) {
        this.codeSetting(newValue);
      },
    },
    data: {
      handler(newValue) {
        console.log('命令下发页面收到', { ...newValue });
        this.form.SampleInterval = newValue.Sample_Interval;
        this.wrodtobyts =
          newValue['WordTo2Bytes[1]'].toString(16).padStart(2, '0') +
          newValue['WordTo2Bytes[0]'].toString(16).padStart(2, '0');
        this.codeSetting(this.wrodtobyts);
      },
    },
  },
};
</script>

<style scoped lang="scss">
// .commandView {
//   background: $uni-bg-color-grey;
// }
.cell {
  background-color: $uni-bg-color;
  margin-bottom: 20rpx;
}
.btnView {
  margin-bottom: 40rpx;
  // background: $uni-bg-color-grey;
  display: flex;
  // flex轴横向，溢出换行。 flex-direction: row;  flex-wrap: wrap; 简写 flex-flow
  flex-flow: row wrap;
  // 副轴对齐方式align-items  上下居中
  align-items: center;
  /* 主轴对齐方式justify-content */
  justify-content: space-around;
}
.ubutton {
  width: 90%;
  margin: 0 15rpx 15rpx 0;
}
.tips {
  padding: 0 10px;
  margin-bottom: 10px;
  background-color: $uni-bg-color-grey;
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
