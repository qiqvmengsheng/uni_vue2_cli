<template>
  <view class="background">
    <myNav  leftText="我的" backgroundColor="#134376" leftColor="#ffffff" 
    barHeight="90"></myNav>
    <view class="radio"></view>
    <view  class="person-info">
        <view class="photo">
          <view class="t-icon t-icon-a-ziyuan112"></view>
        </view>
        <text class="user-name">周天</text>
        <text class="greet">下午好^_^</text>
      <view  class="bottom">
        <view class="event-item">
          <view class="t-icon t-icon-dianhua-yuankuang"></view>
          <text>：1596325768</text>
        </view>
        <view class="event-item">
          <view class="t-icon t-icon-youxiang"></view>
          <text>：1934283230@qq.com</text>
        </view>

        <!-- <view class="event-item">//头像下方应该要有性别的显示
          <text class="text">性别</text>
        </view> -->
        
        <view class="single">
          <view class="t-icon t-icon-dizhi"></view>
          <text>：江西省南昌市红谷滩区</text>
        </view>
        <view class="single">
          <view class="t-icon t-icon-commpany"></view>
          <text>： Microsoft Research China</text>
        </view>
      </view>
    </view>
    <view class="fuction_card" >
      <view class="fuction_style">
        <view class="t-icon t-icon-bianji1"></view>
        <view>编辑信息</view>
      </view>
      <view class="fuction_style">
        <view class="t-icon t-icon-bangdingshouji"></view>
        <view>绑定手机</view>
      </view>
    </view>
    <view class="fuction_card" >
      <view class="fuction_style">
        <view class="t-icon t-icon-zuixing-75"></view>
        <view>问题反馈</view>
      </view>
      <view class="fuction_style">
        <view class="t-icon t-icon-13-xitongxiaoxi-icon"></view>
        <view>系统消息</view>
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
.radio{
  background-color: rgb(19, 67, 118);
  height: 30%;
  border-radius: 0% 0% 20% 20%;
}
.background{        
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
 height: 35%;
 display: flex;
 margin-left: 6%;
 border-radius: 10% 10% 10% 10%;
 margin-top: -58%;
 flex-direction: column;
 box-shadow:  0px 0px 10px rgb(197, 197, 197);
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
.greet{
  color:  rgb(19, 67, 118);
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 25rpx;
  top: 30%;
}
.fuction_card {
 background-color: rgb(255, 255, 255);
 width: 88%;
 display: flex;
 margin-left: 6%;
 border-radius: 3%;
 margin-top: 5%;
 box-shadow:  0px 0px 10px rgb(197, 197, 197);
 flex-direction: row;
}
.bottom{
   align-items: center;
   position: relative;
   display: flex;
   justify-content: space-around;
   width: 100%;
   margin-bottom: 7%;
   
   flex-wrap: wrap;
   .single{
    margin-left: 5%;
    line-height: 230%;
    width: 100%;
    bottom: 20%;
    font-size: 28rpx;
   }
  .event-item{
    line-height: 230%;
    bottom: 20%;
    font-size: 28rpx;
    // padding: 10%;
   }
  }
.top{
height: 130rpx;
position: relative;
left: 2%;
margin-top: 2%;

top: 0%;
bottom: 40%;
display: flex;
flex-direction: column;
}
.photo{
  margin-left:38%;
  margin-right: auto;
  margin-top: 4%;
  display: flex;
  position: relative;
  width: 30%;
  height: 100%;
}
.user-name{
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 25rpx;
  top: 27%;
  font-size: 35rpx;
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
  flex-direction:column;
  height: 150rpx;
  width: 150rpx;
  padding: 50rpx;
  font-size: 25rpx;

}
.t-icon{ 
 
  &.t-icon-zuixing-75{
  width: 100rpx;
  height: 100rpx;
  }
  &.t-icon-13-xitongxiaoxi-icon{
  width: 100rpx;
  height: 100rpx;
  }
  &.t-icon-bangdingshouji{
  margin-bottom: 12%;
  width: 85rpx;
  height: 85rpx;
  }
  &.t-icon-bianji1{
  margin-bottom: 12%;
  width: 85rpx;
  height: 85rpx;
  }
  &.t-icon-a-ziyuan112{
  width: 150rpx;
  height: 150rpx;
  }
  }
</style>
