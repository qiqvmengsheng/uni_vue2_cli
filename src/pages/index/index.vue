<template>
  <view class="content">
	
    <view>
      <text class="title">{{ title }}</text>
    </view>

    <u-action-sheet :list="list" v-model="show"></u-action-sheet>

    <template>
      

    </template>
  </view>
</template>

<script>
import to from 'await-to-js';
import { login, wxlogin, wxgetUserInfo } from '@/api/user';

export default {
  data() {
    return {
      form: {
        name: '',
        intro: '',
        sex: '',
      },
      title: 'Hello',
      list: [
        {
          text: '点赞',
          color: 'blue',
          fontSize: 28,
        },
        {
          text: '分享',
        },
        {
          text: '评论',
        },
      ],
      show: true,
    };
  },
 
  onLoad() {},
 
  created() {
    this.getUserInfo();
  },
  methods: {  
	  
	  async getUserInfo() {
		  uni.navigateTo({
		  	url: '/main/main.vue'
		  });
		  		
      const [err, res] = await to(wxlogin());
      if (err) {
        console.log(err);
        return;
      }
      console.log('微信登录返回信息：', res);
      const { code } = res;
	
      const [err2, res2] = await to(wxgetUserInfo());
      if (err2) {
        console.log(err2);
        return;
      }
      console.log('用户信息：', res2);
      const { userInfo } = res2;
      const { nickName, avatarUrl, gender, province, city, country } = userInfo;

      const [err1, res1] = await to(
        login({ code, nickName, gender, address: province + city })
      );
      if (err1) {
        console.log(err1);
        return;
      }
      console.log('登录自己网站成功：', res1);
	 
    },

  },
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
