<template>
  <view>
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="氡浓度"
          :value="`${data.Radon || '0'} Bq/m³`"
          isLink
          @click="
            show = true;
            value = 'Radon';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="钍浓度"
          :value="`${data.Thoron || '0'} Bq/m³`"
          isLink
          @click="
            show = true;
            value = 'Thoron';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="温度"
          :value="`${data.temperature || '0'} ℃`"
          isLink
          @click="
            show = true;
            value = 'temperature';
          "
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="大气压"
          :value="`${data.Pressure || '0'} mbar`"
          isLink
          @click="
            show = true;
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
    <u-action-sheet
      :actions="actionsList"
      cancelText="取消"
      @select="selectClick"
      @close="show = false"
      :show="show"
    ></u-action-sheet>
  </view>
</template>

<script>
import { actionSheet } from '@uni/apis';
// const a = ['Radon', 'Thoron', 'temperature', 'Pressure', 'humidity'];
export default {
  components: {},
  props: { data: { required: true }, dev: { required: true } },
  data() {
    return {
      disabled: false,
      show: false,
      value: '',
      actionsList: [
        { name: '历史数据', route: 'chartView' },
        { name: '添加触发告警值', route: 'user' },
      ],
    };
  },
  methods: {
    action() {
      const route = ['chartView', 'user'];
      actionSheet({
        itemList: ['历史数据', '添加触发告警值'],
      }).then((res) => {
        console.log(res, route[res.tapIndex]);
        if (res.tapIndex !== -1)
          this.$Router.push({
            name: route[res.tapIndex],
            params: { deviceid: this.dev.deviceid, datastreams: this.value },
          });
      });
    },
    selectClick(item) {
      console.log(item, this.value, this.dev);
      this.$Router.push({
        name: item.route,
        params: { deviceid: this.dev.deviceid, datastreams: this.value },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.cell {
  background-color: $uni-bg-color;
  margin-bottom: 20rpx;
}
</style>
