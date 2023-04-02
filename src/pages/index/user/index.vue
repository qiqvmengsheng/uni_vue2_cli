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

<script>
export default {
  components: {},
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
.background{        
  background-color: rgb(19, 67, 118);
  position: absolute;
  left: 0%;
  right: 0%;
  bottom: 0;
  right: 0;
  top: 0%;
}
.person-info {
  background-color: rgb(250, 250, 250);
 width: 88%;
 display: flex;
 margin-left: 6%;
 border-radius: 3%;
 margin-top: 5%;
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
    width: 40%;
    bottom: 20%;
    font-size: 28rpx;
    // padding: 10%;
   }
  }
.top{
height: 130rpx;
position: relative;
top: 0%;
bottom: 40%;
display: flex;
flex-direction: row;
}
.photo{
  position: relative;
  width: 30%;
  height: 100%;
  background-color: rgb(1, 16, 16);
}
.user-name{
  height: 100%;
  position: relative;
  width: 60%;
  left: 0%;
  background-color: #500404;
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
  
}
</style>
