<template>
  <view class="background">
    <view class="item">
      <view class="item_name">性别</view>
      <view class="radio">
        <label class="radio">
          男
          <radio
            value="男"
            :checked="gender === '男'"
            @click="select_gender('男')"
          />
        </label>
        <label >
          女
          <radio
            value="女"
            :checked="gender === '女'"
            @click="select_gender('女')"
          />
        </label>
      </view>
    </view>
    <view class="item">
      <view class="item_name">用户名</view>
      <view class="item_data">
        <input type="text" v-model="username">
      </view>
    </view>
    <view class="item">
      <view class="item_name"> 工作单位</view>
      <view class="item_data">
         <input type="text" v-model="workunit">
      </view>
    </view>
    <view class="item">
      <view class="item_name"> 工作地址</view>
      <view class="item_data">
         <input type="text" v-model="address">
      </view>
    </view>
    <view class="item">
      <view class="item_name"> 邮箱地址</view>
      <view class="item_data">
         <input type="text" v-model="email">
      </view>
    </view>
    <view class="item">
      <view class="item_name"> 企业性质</view>
      <view class="item_data">
         <input type="text" v-model="attribute">
      </view>
    </view>
    <button class="save_button" @click="save_data">保存</button>
  </view>
</template>

<script>
import { updateuserinfo } from '@/api/user';

export default {
  data() {
    return {
      username: '',
      workunit: '',
      address: '',
      email: '',
      gender: '',
      attribute: '',
    };
  },
  onLoad(option) {
    this.username = decodeURI(option.username);
    this.workunit = decodeURI(option.workunit);
    this.address = decodeURI(option.address);
    this.email = decodeURIComponent(option.email);
    this.gender = decodeURI(option.sex);
    this.attribute = decodeURI(option.attribute);
  },
  methods: {
    async select_gender(e) {
      this.gender = e;
    },
    async save_data() {
      updateuserinfo({
        address: this.address,
        attribute: this.attribute,
        sex: this.gender,
        useremail: this.email,
        userphone: this.userphone,
        workunit: this.workunit,
      }).then(
        (response) => {
          console.log(response);
          if (response.data.code === 200) {
            uni.showToast({
              title: '修改成功',
              duration: 1000,
            });
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            prevPage.$vm.getUserInfo();
            uni.navigateBack({
              delta: 1,
            });
          }
        },
        (error) => {
          console.log(error);
          uni.showToast({
            title: '修改失败',
            duration: 1000,
          });
        }
      );
    },
  },
};
</script>
<style scoped src="./fuctionstyle.css"></style>
<style scoped></style>
