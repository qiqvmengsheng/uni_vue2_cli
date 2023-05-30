<template>
  <view class="background_bondphone">
    <view class="message">
      绑定手机号后,设备列表将更新为手机号所绑定的设备列表</view
    >
    <view class="input_phonenumber">
      <input type="text" v-model="phoneNumber"  placeholder="输入您本人的手机号"/>
      <view class="line"></view>
    </view>
    <button class="save_button" @click="fillCode">获取短信验证码</button>
  </view>
</template>

<script>
import { sendsms } from '@/api/user';

export default {
  data() {
    return {
      phoneNumber: '',
    };
  },
  created() {},
  methods: {
    async fillCode() {
      console.log(this.phoneNumber);
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'fillCode'
      )[0];
      console.log(index);
      this.$Router.push({
        name: 'fillCode',
        params: {
          phoneNumber: this.phoneNumber,
        },
      });
    },
    async getCode() {
      sendsms({
        phonenumber: this.phoneNumber,
      }).then(
        (response) => {
          console.log(response);
          if (response.data === true) {
            console.log(response.data);
            // 跳转到填写验证码页面
            this.fillCode();
          }
        },
        (error) => {
          console.log(error);
          uni.showToast({
            title: '发送失败，请检查您填写的电话号码是否正确',
            duration: 1000,
          });
        }
      );
    },
  },
};
</script>
<style scoped src="../fuctionstyle.css"></style>

<style></style>
