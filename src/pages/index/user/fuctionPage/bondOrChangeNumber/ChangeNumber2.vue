<template>
  <view class="background">
    <view class="bond_item">
      <view class="item_name">输入新手机号</view>
      <view class="input_code">
        <input
          type="text"
          v-model="newPhoneNumber"
          placeholder="请输入新手机号"
        />
     </view>
    </view>
    <view class="bond_item">
      <view class="item_name">输入验证码</view>
      <view class="input_code">
        <input type="text" v-model="newCode" placeholder="请输入验证码">
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
    this.oldPhoneNumber = decodeURIComponent(options.phoneNumber);
    this.passCode = decodeURIComponent(options.passCode);
    console.log(this.oldPhoneNumber);
    console.log(this.passCode);
    console.log(options);
  },
  methods: {
    async getCode() {
      if (this.newPhoneNumber === '') {
        uni.showToast({
          title: '请输入电话号码',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      console.log(this.newPhoneNumber.length);
      if (this.newPhoneNumber.length !== 11) {
        uni.showToast({
          title: '您输入的电话号码不正确',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      if (this.newPhoneNumber === this.oldPhoneNumber) {
        console.log('手机号相同');
        uni.showToast({
          title: '新旧手机号相同，请重新输入',
          icon: 'none',
          duration: 1000,
        });
        return;
      }
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
    async bondPhone() {
      if (this.newCode === '') {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      console.log(this.newPhoneNumber);
      console.log(this.oldPhoneNumber);
      if (this.newPhoneNumber === this.oldPhoneNumber) {
        console.log('手机号相同');
        uni.showToast({
          title: '新旧手机号相同，请重新输入',
          icon: 'none',
          duration: 1000,
        });
        return;
        // const pages = getCurrentPages();
        // const prevPage = pages[pages.length - 2];
        // uni.navigateBack({
        //   delta: 2,
        // });
        // return;
      }
      console.log(this.oldPhoneNumber);
      bondPhone({
        code: this.newCode,
        phoneNumber: this.newPhoneNumber,
        passCode: this.passCode,
        olderNumber: this.oldPhoneNumber,
      }).then(
        (response) => {
          if (response.data.code === 200) {
            console.log('绑定成功');
            uni.showToast({
              title: '绑定成功',
              duration: 1000,
            });
            setTimeout(function () {
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 2];
              uni.navigateBack({
                delta: 2,
              });
            }, 1000);
          }
        },
        (error) => {
          uni.showToast({
            title: '绑定失败',
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
