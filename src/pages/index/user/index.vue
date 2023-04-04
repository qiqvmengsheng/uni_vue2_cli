<<<<<<< HEAD
=======
<template>
  <view class="background">
    <view  class="person-info">
      <view class="top">
        <view class="photo">
        照片
        </view>
        <view class="user-name">
          昵称
        </view>
      </view>
      <view  class="bottom">
        <view class="event-item">
          <text class="text">电话号码</text>
        </view>
        <view class="event-item">
          <text class="text">邮箱</text>
        </view>

        <!-- <view class="event-item">//头像下方应该要有性别的显示
          <text class="text">性别</text>
        </view> -->
        
        <view class="event-item">
          <text class="text">地址</text>
        </view>
        <view class="event-item">
          <text class="text">工作单位</text>
        </view>
      </view>
    </view>
    <view class="fuction_card" >
      <view class="fuction_style">
          注销账号
      </view>
      <view class="fuction_style">
        修改用户信息
      </view>
    </view>
    <view class="person-info">
      问题反馈和查看系统消息等功能
    </view>
  </view>
  
  
</template>
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2

<template>


  <view class="background">
    <myNav  leftText="我的" backgroundColor="#134376" leftColor="#ffffff" 
    barHeight="90"></myNav>

    <view  class="person-info">
      <view class="top">
        <view class="photo">
          <view class="t-icon t-icon-a-ziyuan87"></view>
        </view>
        <view class="user-name">
          昵称
        </view>
       
      </view>
      <view  class="bottom">
        <view class="event-item">
          <text class="iconfont">&#xe8be;</text>
          <text>:1596325768</text>
        </view>
        <view class="event-item">
          <text class="iconfont">&#xe698;</text>
          <text class="iconfont">&#xe626;</text>
          <text>：1934283230@qq.com</text>
        </view>

        <!-- <view class="event-item">//头像下方应该要有性别的显示
          <text class="text">性别</text>
        </view> -->
        
        <view class="event-item">
          <text class="iconfont">&#xe609;</text>
          <text>：江西省南昌市红谷滩区</text>
        </view>
        <view class="event-item">
          <text class="iconfont">&#xe611;</text>
          <text>：江西省南昌市红谷滩区</text>
        </view>
      </view>
    </view>
    <view class="fuction_card" >
      <view class="fuction_style">
          <text class="iconfont">&#xe602;</text>

      </view>
      <view class="fuction_style">
        <i class="iconfont icon-bianji"></i>
        <view class="iconfont icon-bianji"></view>
      </view>
    </view>
    <view class="fuction_card" >
      <view class="fuction_style">
        <text class="iconfont">&#xe6b7;</text>
      </view>
      <view class="fuction_style">
        <text class="iconfont">&#xe626;</text>
      </view>
    </view>
  </view>
  
</template>
<script>
import myNav from './my-nav.vue';
export default {
  components: {
    myNav
  },
  
  data() {
    return {};
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
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
<<<<<<< HEAD
.background{     
  background-color: rgb(19, 67, 118);
  border-radius: 0% 0% 10% 10%;
  position: absolute;
  left: 0%;
  right: 0%;
  bottom: 70%;
=======
.background{        
  background-color: rgb(19, 67, 118);
  position: absolute;
  left: 0%;
  right: 0%;
  bottom: 0;
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
  right: 0;
  top: 0%;
}
.person-info {
<<<<<<< HEAD
  background-color: rgb(255, 255, 255);
 width: 88%;
 display: flex;
 margin-left: 6%;
 border-radius: 10% 10% 10% 10%;
 margin-top: 0%;
 flex-direction: column;
 box-shadow:  0px 0px 10px rgb(197, 197, 197);
}
.fuction_card {
  background-color: rgb(255, 255, 255);
=======
  background-color: rgb(250, 250, 250);
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
 width: 88%;
 display: flex;
 margin-left: 6%;
 border-radius: 3%;
 margin-top: 5%;
<<<<<<< HEAD
 flex-direction: row;
 box-shadow:  0px 0px 10px rgb(197, 197, 197);
=======
 box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
 flex-direction: column;

}
.fuction_card {
  background-color: rgb(250, 250, 250);
 width: 88%;
 display: flex;
 margin-left: 6%;
 border-radius: 3%;
 margin-top: 5%;
 box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
 flex-direction: row;
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2

}
.bottom{
   align-items: center;
   position: relative;
   display: flex;
   justify-content: space-around;
   width: 100%;
   margin-bottom: 5%;
   margin-top: 5%;
   flex-wrap: wrap;
  .event-item{
    line-height: 230%;
<<<<<<< HEAD
    width: 50%;
=======
    width: 40%;
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
    bottom: 20%;
    font-size: 28rpx;
    // padding: 10%;
   }
  }
.top{
height: 130rpx;
position: relative;
<<<<<<< HEAD
left: 2%;
margin-top: 2%;
=======
top: 0%;
bottom: 40%;
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
display: flex;
flex-direction: row;
}
.photo{
  position: relative;
  width: 30%;
  height: 100%;
<<<<<<< HEAD
  background-color: rgb(255, 255, 255);
=======
  background-color: rgb(1, 16, 16);
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
}
.user-name{
  height: 100%;
  position: relative;
  width: 60%;
  left: 0%;
<<<<<<< HEAD
  background-color: #ffffff;
=======
  background-color: #500404;
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
}


.left
{
  position: relative;
  width: 50%;
  left: 0;
}
.right{
  position: relative;
  width: 50%;
  left: 50%;
}
.text {
        vertical-align: middle;
      }
.fuction_style{
  flex-direction: column;
  height: 150rpx;
  width: 150rpx;
  padding: 30rpx;
<<<<<<< HEAD
}
.t-icon{
  width: 100rpx;
  height: 100rpx;
  &.t-icon-a-ziyuan87{
    width: 160rpx;
    height: 160rpx;
  }
=======
  
>>>>>>> da7cbad230df01dbb5014562a424075371175ea2
}
</style>
