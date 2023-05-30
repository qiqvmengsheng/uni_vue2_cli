<template name="uni-custom-navbar">
  <!-- toolBar -->
  <view :class="fixed?'uni-navbar-fixed':'uni-navbar'"
      :style="'width: 100%; height:'+'180'+'rpx; background-color:'+backgroundColor">
      <!--  导航栏 左侧 -->
      <view class="bar-left">
          <image class="left_icon" @click="onClickLeft" v-if="leftIcon.length > 0" :src="leftIcon" mode="scaleToFill">
          </image>
          <text class="txt-left" @click="onClickLeft" v-else :style="'color: '+leftColor+';'">{{leftText}}</text>
      </view>
      <!--  导航栏 中间标题 -->
      <text class="bar-center" :style="'color: '+titleColor+';'">{{title}}</text>
      <!--  导航栏 右侧 -->
      <view class="bar-right">
          <image class="right_icon" @click="onClickRight" v-if="rightIcon.length > 0" :src="rightIcon"
              mode="scaleToFill"></image>
          <text class="txt-right" @click="onClickRight" v-else :style="'color: '+rightColor+';'">{{rightText}}</text>
      </view>
  </view>

</template>

<script>
  export default {
      name: "uni-custom-navbar",
      data() {
          return {
              // fixed: false, //是否固定顶部
              // backgroundColor: "#FFFFFF", //默认设置状态栏背景颜色
              // barHeight: "90", //默认设置状态栏高度,
              // title: "标题文字", //标题
              // titleColor: "#000000", //标题文字的颜色
              // leftText: "返回", //左侧按钮文本
              // leftColor: "#000000", //左侧按钮文本颜色
              // rightText: "我的", //右侧按钮文本
              // rightColor: "#000000", //右侧按钮文本颜色
              // leftIcon: "../../static/nav_back.png", //左侧按钮图标
              // rightIcon: "../../static/nav_mine.png", //右侧按钮图标
          };
      },
      props: {
          title: {
              type: String,
              default: ""
          },
          leftText: {
              type: String,
              default: ""
          },
          rightText: {
              type: String,
              default: ""
          },
          leftIcon: {
              type: String,
              default: ""
          },
          rightIcon: {
              type: String,
              default: ""
          },
          fixed: {
              type: [Boolean, String],
              default: false
          },
          titleColor: {
              type: String,
              default: "#000000"
          },
          rightColor: {
              type: String,
              default: "#000000"
          },
          leftColor: {
              type: String,
              default: "#000000"
          },
          backgroundColor: {
              type: String,
              default: "#FFFFFF"
          },
          barHeight: {
              type: String,
              default: "200"
          }
      },
      methods: {
          onClickLeft() {
              this.$emit("clickLeft");
          },
          onClickRight() {
              this.$emit("clickRight");
          },
      }
  }
</script>

<style>
  .right_icon {
      width: 44rpx;
      height: 44rpx;
      margin-right: 20rpx;
  }

  .left_icon {
      width: 44rpx;
      height: 44rpx;
      margin-left: 20rpx;
  }

  .bar-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      font-size: 36rpx;
  }

  .txt-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 10rpx;
      padding: 20rpx;
      font-size: 32rpx;
      min-width: 65rpx;
  }

  .txt-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 12rpx;
      padding: 20rpx;
      font-size: 35rpx;
      min-width: 65rpx;
  }

  .bar-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
  }

  .bar-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
  }

  .uni-navbar-fixed {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      position: fixed;
      top: 0;
  }

  .uni-navbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
  }
</style>
