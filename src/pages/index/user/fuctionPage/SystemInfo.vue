<template>
  <view>
    <view class="item_info" v-if="items.length === 0"> 暂时没有消息 </view>
    <view v-else>
     <view v-for="(item,index) in items" class="item">
        <view class="top">
          <view class="t-icon t-icon-13-xitongxiaoxi-icon"> </view>
        </view>
        <view class="item2">
          <view class="item_info">
            {{ item.notice }}
          </view>
          <view class="item_time"> {{ item.time }}</view>
        </view>

        <view class="line"></view>
      </view>
    </view>
  </view>
</template>

<script>
import { getNotice } from '@/api/base';

export default {
  data() {
    return {
      items: [
        {
          id: '',
          time: '',
          notice: '暂时没有消息',
          userId: '',
        },
      ],
    };
  },
  onLoad() {
    this.getNotices();
    console.log(this.items.length);
  },
  methods: {
    async getNotices() {
      getNotice({}).then(
        (response) => {
          console.log(response);
          this.items = response.data.data;
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};
</script>
<style scoped src="./fuctionstyle.css"></style>
<style scoped lang="scss">
.item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 5%;
  margin-right: 5%;
}
.item2 {
  width: 70%;
  display: flex;
  flex-direction: column;
}
.item_info {
  align-items: center;
  // background-color: #6f6f6f;
  color: #6f6f6f;
  display: flex;
  flex-direction: column;
  margin-top: 7%;
}
.item_time {
  margin-top: 2%;
  font-size: 22rpx;
  margin-bottom: 1%;
}
.top {
  height: 200%;
  width: 15%;
}

.t-icon {
  &.t-icon-13-xitongxiaoxi-icon {
    vertical-align: top;
    margin-top: 0%;
    width: 100rpx;
    height: 100rpx;
  }
}
</style>
