<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>

    <u-action-sheet :list="list" v-model="show"></u-action-sheet>

    <template>
      <u-form :model="form" ref="uForm">
        <u-form-item label="姓名">
          <u-input v-model="form.name" />
        </u-form-item>
        <u-form-item label="简介">
          <u-input v-model="form.intro" />
        </u-form-item>
        <u-form-item label="性别">
          <u-input v-model="form.sex" type="select" />
        </u-form-item>
        <u-form-item label="水果">
          <u-checkbox-group width="50%">
            <u-checkbox>苹果</u-checkbox>
            <u-checkbox>雪梨</u-checkbox>
            <u-checkbox>柠檬</u-checkbox>
            <u-checkbox>橘子</u-checkbox>
          </u-checkbox-group>
        </u-form-item>
        <u-form-item label="味道">
          <u-radio-group>
            <u-radio>鲜甜</u-radio>
            <u-radio>麻辣</u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item label="开关">
          <u-switch slot="right"></u-switch>
        </u-form-item>
      </u-form>
    </template>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: "",
          intro: "",
          sex: "",
        },
        title: "Hello",
        list: [
          {
            text: "点赞",
            color: "blue",
            fontSize: 28,
          },
          {
            text: "分享",
          },
          {
            text: "评论",
          },
        ],
        show: true,
      };
    },
    onLoad() {},
    methods: {},
  };
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin: 200rpx auto 50rpx auto;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
