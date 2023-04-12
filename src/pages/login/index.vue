<template>
  <div class="login">
    <view class="btn">
      <u-button
        slot="confirmButton"
        text="微信用户一键登录"
        type="primary"
        shape="circle"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        @click="show = false"
      ></u-button>
    </view>
  </div>
</template>

<script>
import to from 'await-to-js';
import { getPnumber } from '@/api/user';
import { alert } from '@uni/apis';

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
        alert({
          title: '提示',
          content: '您以拒绝授权，请重新点击并授权！',
          buttonText: '确认',
        });
        console.log('用户点击了拒绝');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  position: relative;
}
.btn {
  position: relative;
  top: 70%;
  width: 95%;
  margin: 0 auto;
}
</style>
