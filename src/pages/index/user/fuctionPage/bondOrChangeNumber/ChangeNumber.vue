<template>
  <view class="background">
    <view class="bond_item">
      <view class="item_name">输入原手机号</view>
      <view class="input_code">
        <input type="text" v-model="inputNumber">
      </view>
    </view>
    <view class="bond_item">
      <view class="item_name">输入验证码</view>
      <view class="input_code">
        <input type="text" v-model="oldCode">
      </view>
      <button v-if="codeShow" class="phone_code" @click="getCode">
        获取验证码
      </button>
      <button v-if="!codeShow" class="phone_code">{{ count }}后重试</button>
    </view>
    <button class="save_button" @click="next">确认</button>
  </view>
</template>
<script>
import { sendsms } from '@/api/user';
import { vertifyCode } from '@/api/base';
import myNav from '../../my-nav';

export default {
  components: {
    myNav,
  },
  data() {
    return {
      timer: null,
      count: '',
      codeShow: true,
      oldPhoneNumber: '',
      oldCode: '',
      inputNumber: '',
    };
  },
  onLoad(options) {
    console.log(options);
    this.oldPhoneNumber = options.phoneNumber;
  },
  methods: {
    async toPage2(data) {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'changPhoneNumber2'
      )[0];
      console.log(index);
      this.$Router.push({
        name: 'changPhoneNumber2',
        params: {
          phoneNumber: this.inputNumber,
          passCode: data,
        },
      });
    },
    async getCode() {
      sendsms({
        phonenumber: this.oldPhoneNumber,
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
    async next() {
      let input = this.inputNumber;
      let old = this.oldPhoneNumber;
      if (input === old) {
        // 如果输入的原手机号是对的就请求服务器接口验证验证码是否正确，并返回PassCode
        vertifyCode({
          phoneNumber: this.inputNumber,
          code: this.oldCode,
        }).then(
          (response) => {
            console.log(response);
            if (response.data.code === 200) {
              console.log(response.data.data);
              this.toPage2(response.data.data);
            } else {
              uni.showToast({
                title: response.data.msg,
                duration: 1000,
              });
            }
          },
          (error) => {
            console.log(error);
            uni.showToast({
              title: '服务器错误',
              duration: 1000,
            });
          }
        );
      } else {
        uni.showToast({
          title: '原手号输入不正确',
          duration: 1000,
        });
      }
    },
  },
};
</script>
<style scoped src="../fuctionstyle.css"></style>

<style></style>
