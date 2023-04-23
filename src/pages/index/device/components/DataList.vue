<template>
  <view>
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="氡浓度"
          :value="`${data.Radon || '0'} Bq/m³`"
          isLink
          @click="
            action();
            value = 'Radon';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="钍浓度"
          :value="`${data.Thoron || '0'} Bq/m³`"
          isLink
          @click="
            action();
            value = 'Thoron';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="温度"
          :value="`${data.temperature || '0'} ℃`"
          isLink
          @click="
            action();
            value = 'temperature';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="大气压"
          :value="`${data.Pressure || '0'} mbar`"
          isLink
          @click="
            action();
            value = 'Pressure';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="相对湿度"
          :value="`${data.humidity || '0'} ％`"
          isLink
          @click="
            action();
            value = 'humidity';
          "
          :disabled="disabled"
        ></u-cell>
      </u-cell-group>
    </view>
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="设备昵称"
          :value="form.abbreviation"
          isLink
          @click="ncshow = true"
          :disabled="disabled"
        ></u-cell>
      </u-cell-group>
    </view>

    <u-action-sheet
      :actions="actionsList"
      cancelText="取消"
      @select="selectClick"
      @close="show = false"
      :show="show"
    ></u-action-sheet>

    <u-modal
      :show="ncshow"
      title="设备昵称"
      closeOnClickOverlay
      @close="modalclose"
      @confirm="
        setabbreviation();
        ncshow = false;
      "
    >
      <view>
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
    </u-modal>
  </view>
</template>

<script>
import to from 'await-to-js';
import { mapGetters, mapActions } from 'vuex';
import { actionSheet, toast } from '@uni/apis';
import { modifyabbreviation } from '@/api/base';
// const a = ['Radon', 'Thoron', 'temperature', 'Pressure', 'humidity'];
export default {
  components: {},
  props: { dev: { required: true } },
  computed: { ...mapGetters(['devices']) },
  data() {
    return {
      data: null,
      disabled: false,
      show: false,
      ncshow: false,
      form: { abbreviation: '' },
      value: '',
      actionsList: [
        { name: '历史数据', route: 'chartView' },
        { name: '添加触发告警值', route: 'TriggerView' },
      ],
      rules: {
        abbreviation: [
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
  methods: {
    ...mapActions('user', ['getInfo']),
    /**
     * 更新数据
     */
    update(data) {
      this.data = data;
      console.log('更新数据', data);
    },
    /**
     * 弹出选项，点击跳转对应页面
     */
    action() {
      const route = ['chartView', 'TriggerView'];
      actionSheet({
        itemList: ['历史数据', '添加触发警告值'],
      }).then((res) => {
        console.log(res, route[res.tapIndex]);
        if (res.tapIndex !== -1)
          this.$Router.push({
            name: route[res.tapIndex],
            params: { deviceid: this.dev.deviceid, datastreams: this.value },
          });
      });
    },
    /**
     * 跳转页面
     */
    selectClick(item) {
      console.log(item, this.value, this.dev);
      this.$Router.push({
        name: item.route,
        params: { deviceid: this.dev.deviceid, datastreams: this.value },
      });
    },

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
        toast.showToast({
          content: `${this.dev.deviceserial}修改备注成功！`,
          // type: 'success',
        });
        console.log(this.devices, this.dev);
      } else {
        toast.showToast(res.data.msg);
      }
    },

    modalclose() {
      const id = this.dev.deviceid;
      this.form.abbreviation = this.devices.filter(
        (dev) => dev.deviceid === id
      )[0].abbreviation;
      this.ncshow = false;
    },
  },

  watch: {
    dev: {
      handler(newValue) {
        // store里devices被整个替换了，导致filter出的dev不能同步与devices变化。
        console.log('dev被改变', newValue);
        this.modalclose();
        // this.form.abbreviation = newValue.abbreviation;
      },
      deep: true,
    },
  },

  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    // this.$refs.uForm.setRules(this.rules);
  },
};
</script>

<style lang="scss" scope>
.cell {
  background-color: $uni-bg-color;
  margin-bottom: 20rpx;
}
</style>
