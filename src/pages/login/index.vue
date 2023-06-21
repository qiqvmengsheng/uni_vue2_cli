<template>
  <div class="login">
    <view class="bg"> </view>
    <Lottie width="150" height="150" class="lottie"></Lottie>
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
import { alert, toast, application } from '@uni/apis';
import Lottie from '@/components/lottie';

export default {
  data() {
    return {
      show: false,
    };
  },
  components: { Lottie },
  mounted() {
    const app = application.getApp();
    console.log(app);
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
          (e.detail && e.detail.code !== undefined && e.detail.code) || '';
        const [err, res] = await to(getPnumber({ code }));
        if (err) {
          console.log('失败', err);
          return;
        }
        if (res.data.code !== 200) {
          console.log(res);
          toast.showToast({
            content: '登录失败请重试',
            mask: true,
          });
          return;
        }
        const app = application.getApp();
        app.$vm.login().then(() => {
          toast
            .showToast({
              content: '登录成功',
              type: 'success',
              mask: true,
              duration: 1000,
            })
            .then(() => {
              this.$Router.pushTab({ name: 'index' });
            });
        });
        console.log('获取电话返回', res);
        // e.detail这里会有三个属性
        // encryptedData
        // errMsg
        // iv
        // '123' ||
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
@import '@/style/mixin.scss';
.bg {
  // @include ArcBackground();
  position: fixed;
  top: -65vw;
  right: -40vw;
  z-index: -10;
  width: 150vw;
  height: 150vw;
  background-color: #184677;
  // border-radius: 0px 0px 25vw 100vw / 0px 0px 5vh 25vh;
  border-radius: 75vw;
}

.lottie {
  position: fixed;
  top: 10vw;
  right: 10vw;
}

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
