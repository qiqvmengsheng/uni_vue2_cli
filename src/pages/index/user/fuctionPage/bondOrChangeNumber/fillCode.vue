<template>
  <view class="background_fillCode">
    <view class="message"> 验证码已发送至{{ phoneNumber }}</view>
    <view>请输入验证码</view>
    <view class="input_phonenumber">
      <input type="text" v-model="code"  placeholder="输入验证码"/>
      <view class="line"></view>
    </view>
    <view @click="reGet">重新获取</view>
    <button class="save_button" @click="bondPhone">绑定手机</button>
  </view>
</template>
<script>
import { sendsms } from '@/api/user';
import { bondPhone } from '@/api/base';

export default {
  data() {
    return {
      code: '',
      phoneNumber: '',
    };
  },
  onLoad(option) {
    this.phoneNumber = decodeURI(option.phoneNumber);
  },
  methods: {
    async bondPhone() {
      bondPhone({
        code: this.code,
        phoneNumber: this.phoneNumber,
      }).then(
        (response) => {
          if (response.data.code === 200) {
            uni.showToast({
              title: '绑定成功',
            });
          }
        },
        (error) => {
          uni.showToast({
            title: '绑定失败',
          });
        }
      );
    },
    async reGet() {
      sendsms({
        phonenumber: this.phoneNumber,
      }).then(
        (response) => {
          uni.showToast({
            title: '发送成功',
          });
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
<style>
.put_code {
  margin-top: 20%;
  font-size: 30rpx;
}

</style>
