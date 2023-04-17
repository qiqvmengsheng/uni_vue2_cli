<template>
  <view>
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="氡浓度"
          :value="`${data.Radon || '0'} Bq/m³`"
          isLink
          @click="PumpModeshow = true"
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="钍浓度"
          :value="`${data.Thoron || '0'} Bq/m³`"
          isLink
          @click="PumpModeshow = true"
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="温度"
          :value="`${data.temperature || '0'} ℃`"
          isLink
          @click="PumpModeshow = true"
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="大气压"
          :value="`${data.Pressure || '0'} mbar`"
          isLink
          @click="PumpModeshow = true"
          :disabled="disabled"
        ></u-cell>
        <u-cell
          title="相对湿度"
          :value="`${data.humidity || '0'} ％`"
          isLink
          @click="PumpModeshow = true"
          :disabled="disabled"
        ></u-cell>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
// const a = ['Radon', 'Thoron', 'temperature', 'Pressure', 'humidity'];
export default {
  components: {},
  props: { data: { required: true } },
  data() {
    return {
      disabled: false,
    };
  },
};
</script>

<style lang="scss" scope>
.cell {
  background-color: $uni-bg-color;
  margin-bottom: 20rpx;
}
</style>
