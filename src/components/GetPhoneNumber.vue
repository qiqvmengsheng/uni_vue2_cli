<template>
  <view>
    <u-modal
      title="绑定手机"
      :show="show"
      closeOnClickOverlay
      @confirm="() => (show = false)"
      @close="() => (show = false)"
      content="新用户请绑定手机号，如已有网页平台账号请绑定对应账号的手机号，用于关联账号数据。"
    >
      <!-- <button
      showCancelButton
      showConfirmButton
        slots="confirmButton"
        type="default"
        size="mini"
        hover-class="none"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        获取手机号
      </button> -->
      <u-button
        slot="confirmButton"
        text="确定"
        type="success"
        shape="circle"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        @click="show = false"
      ></u-button>
    </u-modal>
  </view>
</template>

<script>
import to from 'await-to-js';
import { getPnumber } from '@/api/user';

export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    /**
     * 显示
     */
    showModal() {
      this.show = true;
    },
    /**
     * 获取电话号码
     */
    async getPhoneNumber(e) {
      console.log(e);
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        console.log('用户点击了接受', e);
        const code =
          (e.detail && e.detail.code !== undefined && e.detail.code) || '123';
        const [err, res] = await to(getPnumber({ code }));
        if (err) {
          console.log('失败', err);
          return;
        }
        console.log('获取电话返回', res);
        // e.detail这里会有三个属性
        // encryptedData
        // errMsg
        // iv
      } else {
        console.log('用户点击了拒绝');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ubutton {
  margin: 0 15rpx 15rpx 0;
}
</style>
