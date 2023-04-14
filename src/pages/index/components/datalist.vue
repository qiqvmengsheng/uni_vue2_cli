<template>
  <view>
    <u-cell-group>
      <u-cell
        title="泵运行模式"
        value=""
        isLink
        @click="PumpModeshow = true"
        :disabled="disabled"
      ></u-cell>
    </u-cell-group>
  </view>
</template>

<script>
export default {
  data() {
    return {
      disabled: false,
    };
  },
};
</script>

<style lang="scss" scope></style>
