<template>
  <view class="background">
    <myNav
      leftText=""
      backgroundColor="#134376"
      leftColor="#ffffff"
      barHeight="90"
    ></myNav>
    <view class="radio"></view>
    <view class="person-info">
      <text class="user-name">{{ userInfo.username }}</text>
      <text class="greet">{{ time }}好^_^</text>
      <view class="bottom">
        <view class="single">
          <view class="t-icon t-icon-dianhua-yuankuang"></view>
          <text class="icon-text">{{ userInfo.userphone }}</text>
        </view>
        <view class="single">
          <view class="t-icon t-icon-youxiang"></view>
          <text class="icon-text">{{ userInfo.useremail }}</text>
        </view>
        <view class="single">
          <view class="t-icon t-icon-dizhi"></view>
          <text class="icon-text">{{ userInfo.address }}</text>
        </view>
        <view class="single">
          <view class="t-icon t-icon-commpany"></view>
          <text class="icon-text">{{ userInfo.workunit }}</text>
        </view>
      </view>
    </view>
    <view class="fuction_card">
      <view class="fuction_style" @click="editPersonInfo">
        <view class="t-icon t-icon-bianjixinxi"></view>
        <view>编辑信息</view>
      </view>
      <view
        class="fuction_style"
        v-if="userInfo.userphone === '' || userInfo.userphone === undefined"
        open-type="getPhoneNumber"
        bindgetphonenumber="getPhoneNumber"
        @click="$Router.push({ name: 'login' })"
      >
        <!-- <view class="t-icon t-icon-bangdingshouji"></view> -->
        <button class="t-icon t-icon-bangdingshouji2"></button>
        <view class="common-text">手机登录</view>
      </view>
      <view class="fuction_style" @click="bondPhoneNumber()" v-else>
        <button class="t-icon t-icon-bangdingshouji1"></button>
        <view class="common-text">换绑手机</view></view
      >
      <view class="fuction_style" @click="systemInfo">
        <view class="t-icon t-icon-xitongxiaoxi4"></view>
        <view class="common-text">系统消息</view>
      </view>
      <view class="fuction_style" @click="$Router.push({ name: 'HelpView' })">
        <view style="margin-bottom: 12%">
          <u-icon name="question-circle" color="#134376" size="100rpx"></u-icon>
        </view>
        <view class="common-text">帮助反馈</view>
      </view>
    </view>
  </view>
</template>
<script>
import { getuserinfo } from '@/api/base';
import to from 'await-to-js';
import { getPnumber } from '@/api/user';
import { alert } from '@uni/apis';
import myNav from './my-nav';

export default {
  components: {
    myNav,
  },
  data() {
    return {
      userInfo: {
        userphone: '',
        address: '',
        attribute: '',
        workunit: '',
        useremail: '',
        sex: '',
      },
      photo: '',
      time: '您',
    };
  },
  computed: {},
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    showModal() {
      this.show = true;
    },
    /**
     * 获取该用户的个人信息数据
     */
    async getUserInfo() {
      getuserinfo({}).then(
        (response) => {
          // 如果用户未绑定手机号码则个人信息不展示，为空
          if (
            response.data.userphone === null ||
            response.data.userphone === ''
          ) {
            this.photo = 't-icon t-icon-yonghutouxiang';
            return;
          }
          console.log(response);
          this.userInfo = response.data;
          if (this.userInfo.attribute === null) {
            this.userInfo.attribute = '';
          }
          if (this.userInfo.workunit === null) {
            this.userInfo.workunit = '';
          }
          switch (this.userInfo.sex) {
            case '男':
              this.photo = 't-icon t-icon-a-ziyuan112';
              break;
            case '女':
              this.photo = 't-icon t-icon-a-ziyuan97';
              break;
            default:
              this.photo = 't-icon t-icon-yonghutouxiang';
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    // 判断现在时间段
    async getTime() {
      const date = new Date();
      const hour = date.getHours();
      console.log(hour);
      if (hour >= 12 && hour <= 18) {
        this.time = '下午';
      } else if (hour < 12) {
        this.time = '上午';
      } else {
        this.time = '晚上';
      }
    },
    async systemInfo() {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'systemInfo'
      )[0];
      console.log(index);
      this.$Router.push({ name: 'systemInfo' });
    },
    /**
     * 跳转到问题反馈页面
     */
    async userFeedBack() {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'userFeedBack'
      )[0];
      console.log(index);
      this.$Router.push({ name: 'userFeedBack' });
    },
    /**
     * 跳转到个人信息编辑页面
     */
    async editPersonInfo() {
      if (this.userInfo.userphone === '' || this.userInfo.userphone === null) {
        uni.showToast({
          icon: 'none',
          title: '请先登录',
          duration: 1000,
        });
        return;
      }
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'userFeedBack'
      )[0];
      this.$Router.push({
        name: 'editPersonInfo',
        params: {
          email: this.userInfo.useremail,
          workunit: this.userInfo.workunit,
          username: this.userInfo.username,
          address: this.userInfo.address,
          sex: this.userInfo.sex,
          attribute: this.userInfo.attribute,
        },
      });
    },
    /**
     * 跳转到绑定手机号的页面
     *  */
    async bondPhoneNumber() {
      if (this.userInfo.userphone === null || this.userInfo.userphone === '') {
        const index = this.$Router.options.routes.filter(
          (r) => r.name === 'bondPhoneNumber'
        )[0];
        console.log(index);
        this.$Router.push({ name: 'bondPhoneNumber' });
      } else {
        const index = this.$Router.options.routes.filter(
          (r) => r.name === 'bondPhoneNumber'
        )[0];
        console.log(index);
        this.$Router.push({
          name: 'changPhoneNumber',
          params: {
            phoneNumber: this.userInfo.userphone,
          },
        });
      }
    },
    /**
     * 绑定手机号
     * */
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
        console.log('开始刷新');
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
      console.log('开始刷新');
      this.getUserInfo();
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    this.getUserInfo();
    this.getTime();
  },
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style scoped lang="scss">
.radio {
  background-color: rgb(19, 67, 118);
  height: 30%;
  border-radius: 0% 0% 20% 20%;
}
.background {
  background-color: rgb(255, 255, 255);
  position: absolute;
  left: 0%;
  right: 0%;
  bottom: 0;
  top: 0%;
}
.person-info {
  background-color: #ffffff;
  width: 88%;
  height: 550rpx;

  display: flex;
  margin-left: 6%;
  border-radius: 10% 10% 10% 10%;
  margin-top: -58%;
  flex-direction: column;
  box-shadow: 0px 0px 10px rgb(197, 197, 197);
}
// .fuction_card {
//  background-color: rgb(255, 255, 255);
//  width: 88%;
//  display: flex;
//  margin-left: 6%;
//  border-radius: 3%;
//  margin-top: 5%;

//  flex-direction: row;
//  box-shadow:  0px 0px 10px rgb(197, 197, 197);
//  flex-direction: column;

//
.greet {
  color: rgb(19, 67, 118);
  position: absolute;
  left: 49%;
  transform: translate(-50%, -50%);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 40rpx;
  top: 27%;
}
.fuction_card {
  background-color: rgb(255, 255, 255);
  width: 88%;
  display: flex;
  margin-left: 6%;
  border-radius: 3%;
  margin-top: 10%;
  box-shadow: 0px 0px 10px rgb(197, 197, 197);
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}
.bottom {
  margin-top: 36%;
  align-items: center;
  position: absolute;
  display: flex;
  justify-content: space-around;
  width: 100%;
  line-height: 170%;
  margin-bottom: 7%;
  margin-left: 5%;
  flex-wrap: wrap;
  .single {
    width: 100%;
    bottom: 20%;
    font-size: 25rpx;
  }
  .event-item1 {
    width: 37%;
    bottom: 20%;
    font-size: 25rpx;
    text-align: left;
    // padding: 10%;
  }
  .event-item2 {
    width: 63%;
    bottom: 20%;
    font-size: 28rpx;
    text-align: left;
    // padding: 10%;
  }
}
.top {
  height: 130rpx;
  position: relative;
  left: 2%;
  margin-top: 2%;

  top: 0%;
  bottom: 40%;
  display: flex;
  flex-direction: column;
}
.photo {
  margin-left: 38%;
  margin-right: auto;
  margin-top: 4%;
  display: flex;
  position: relative;
  width: 30%;
  height: 100%;
}
.user-name {
  font-size: 55rpx;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Arial, Helvetica, sans-serif;
  top: 20%;
}
.left {
  position: relative;
  width: 50%;
  left: 0;
}
.right {
  position: relative;
  width: 50%;
  left: 50%;
}
.text {
  vertical-align: middle;
}
.fuction_style {
  flex-direction: column;
  height: 150rpx;
  width: 150rpx;
  padding: 55rpx;
  font-size: 28rpx;
}
.icon-text {
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 10rpx;
  font-size: 35rpx;
}
.t-icon {
  &.t-icon-zuixing-75 {
    width: 100rpx;
    height: 100rpx;
  }
  &.t-icon-xitongxiaoxi4 {
    margin-bottom: 12%;
    width: 100rpx;
    height: 100rpx;
  }
  &.t-icon-bangdingshouji2 {
    margin-bottom: 12%;
    width: 100rpx;
    height: 100rpx;
  }
  &.t-icon-bangdingshouji1 {
    margin-bottom: 12%;
    width: 100rpx;
    height: 100rpx;
  }
  &.t-icon-bianjixinxi {
    margin-bottom: 12%;
    width: 100rpx;
    height: 100rpx;
  }
  &.t-icon-a-ziyuan112 {
    width: 150rpx;
    height: 150rpx;
  }
  &.t-icon-a-ziyuan97 {
    width: 150rpx;
    height: 150rpx;
  }
  &.t-icon-yonghutouxiang {
    width: 150rpx;
    height: 150rpx;
  }
  &.t-icon-dianhua-yuankuang {
    margin-bottom: 14rpx;
    vertical-align: bottom;
  }
  &.t-icon-youxiang {
    margin-bottom: 14rpx;
    vertical-align: bottom;
  }
  &.t-icon-dizhi {
    margin-bottom: 15rpx;
    vertical-align: bottom;
  }
  &.t-icon-commpany {
    margin-bottom: 15rpx;
    vertical-align: bottom;
  }
}
</style>
