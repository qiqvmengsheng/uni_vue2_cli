<template>
  <view class="background">
    <view class="bond_item">
      <view class="item_name">输入原手机号</view>
      <view class="input_code">
        <!-- <text class="font_1" v-if="inputNumber == ''">请输入电话号码</text> -->
        <input type="text" v-model="inputNumber" placeholder="请输入电话号码">
      </view>
    </view>
    <view class="bond_item">
      <view class="item_name">输入验证码</view>
      <view class="input_code">
        <input type="text" v-model="oldCode" placeholder="请输入验证码">
      </view>
      <button v-if="codeShow" class="phone_code" @click="getCode">
        获取验证码
      </button>
      <button v-if="!codeShow" class="phone_code">{{ count }}后重试</button>
    </view>
    <button class="save_button" @click="toPage2">确认</button>
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
      console.log(this.data);
      wx.navigateTo({
        url: `/pages/index/user/fuctionPage/bondOrChangeNumber/ChangeNumber2?phoneNumber=${encodeURIComponent(
          this.inputNumber
        )}&passCode=${encodeURIComponent(this.oldCode)}`,
      });
      // this.$Router.push({
      //   name: 'changPhoneNumber2',
      //   params: {
      //     phoneNumber: this.inputNumber,
      //     passCode: data,
      //   },
      // });
    },
    async getCode() {
      if (this.inputNumber === '') {
        uni.showToast({
          title: '请输入电话号码',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      console.log(this.inputNumber.length);
      if (this.inputNumber.length !== 11) {
        uni.showToast({
          title: '您输入的电话号码不正确',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      sendsms({
        phonenumber: this.inputNumber,
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
      console.log(this.inputNumber.length);
      const input = this.inputNumber;
      const old = this.oldPhoneNumber;
      if (input === old) {
        if (this.oldCode === '') {
          uni.showToast({
            title: '请输入验证码',
            icon: 'none',
            duration: 2000,
          });
          return;
        }
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
          title: '原手机号输入不正确',
          icon: 'none',
          duration: 1000,
        });
      }
    },
  },
};
</script>
<style scoped src="../fuctionstyle.css"></style>

<style></style>
