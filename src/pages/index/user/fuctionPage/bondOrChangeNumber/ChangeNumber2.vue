<template>
  <view class="background">
    <view class="bond_item">
      <view class="item_name">输入新手机号</view>
      <view class="input_code">
        <input type="text" v-model="newPhoneNumber">
      </view>
    </view>
    <view class="bond_item">
      <view class="item_name">输入验证码</view>
      <view class="input_code">
        <input type="text" v-model="newCode">
      </view>
      <button v-if="codeShow" class="phone_code" @click="getCode">
        获取验证码
      </button>
      <button v-if="!codeShow" class="phone_code">{{ count }}后重试</button>
    </view>
    <button class="save_button" @click="bondPhone">确认</button>
  </view>
</template>
<script>
import { sendsms } from '@/api/user';
import { bondPhone } from '@/api/base';

export default {
  data() {
    return {
      timer: null,
      count: '',
      codeShow: true,
      oldPhoneNumber: '',
      passCode: '',
      newPhoneNumber: '',
      newCode: '',
    };
  },
  onLoad(options) {
    this.oldPhoneNumber = options.phoneNumber;
    this.passCode = options.passCode;
    console.log(this.oldPhoneNumber);
    console.log(this.passCode);
  },
  methods: {
    async getCode() {
      sendsms({
        phonenumber: this.newPhoneNumber,
      }).then(
        (response) => {
          console.log(response);
          if (response.data === true) {
            console.log(response.data);
            // 计时器
            const TIME_COUNT = 60;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.codeShow = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.codeShow = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
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
    // async getCode() {
    //   sendsms({
    //     phonenumber: this.inputNumber,
    //   }).then(
    //     (response) => {
    //       console.log(response);
    //       if (response.data === true) {
    //         console.log('获取验证码成功');
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //       uni.showToast({
    //         title: '发送失败，请检查您填写的电话号码是否正确',
    //         duration: 1000,
    //       });
    //     }
    //   );
    // },
    async bondPhone() {
      console.log(this.oldPhoneNumber);
      bondPhone({
        code: this.newCode,
        phoneNumber: this.newPhoneNumber,
        passCode: this.passCode,
        olderNumber: this.oldPhoneNumber,
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
  },
};
</script>
<style scoped src="../fuctionstyle.css"></style>

<style></style>
