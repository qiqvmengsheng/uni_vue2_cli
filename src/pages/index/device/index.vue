<template>
  <div class="device">
    <template>
      <u-sticky bgColor="rgba(0,0,0,0)">
        <view class="tabs">
          <view>
            <u-tabs
              :list="list1"
              @change="change1"
              :current="current"
              scrollable="false"
              :itemStyle="{ 'background-color': '#fff', padding: '0' }"
              :activeStyle="{
                color: '#fff',
                'background-color': '#2f5a84',
                padding: '0 15px',
                width: '60px',
                height: '30px',
                'line-height': '30px',
              }"
              :inactiveStyle="{
                color: '#c0c0c0',
                'background-color': '#17364f',
                padding: '0 15px',
                width: '60px',
                height: '30px',
                'line-height': '30px',
              }"
            ></u-tabs>
          </view>
        </view>
      </u-sticky>
    </template>
    <view class="head">
      <view class="bg"></view>
      <view class="">
        <text class="timetext">
          最新数据更新时间
          {{ data.update_at || '无' }}
        </text>
      </view>
    </view>

    <view class="dataview">
      <swiper class="swiper" @change="change2" :current="current">
        <swiper-item>
          <scroll-view class="swiper">
            <DataList ref="datalist" :dev="dev"> </DataList>
          </scroll-view>
        </swiper-item>
        <swiper-item>
          <scroll-view class="swiper" scroll-top="0" scroll-y="true">
            <CommandView ref="command" :getdata="up" :dev="dev"> </CommandView>
          </scroll-view>
        </swiper-item>
      </swiper>
      <!-- <view v-show="show">
      </view>
      <view v-show="!show">
      </view> -->
    </view>
  </div>
</template>

<script>
import to from 'await-to-js';
import { mapGetters } from 'vuex';
import { DataStreams } from '@/api/onenet';
import CommandView from './components/Command';
import DataList from './components/DataList';

let that = null;
export default {
  components: { CommandView, DataList },
  data() {
    return {
      dev: null,
      // dlist: null,
      data: null,
      // show: true,
      current: 0,
      list1: [
        { name: '数据展示', show: true },
        { name: '命令下发', show: false },
      ],
    };
  },
  computed: {
    ...mapGetters(['devices']),
    // datalist() {
    //   return [...this.data];
    // },
  },
  created() {
    that = this;
    this.$AppReady.then(() => {
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      // console.log('设备页面', this.dev);
      this.getdata();
    });
  },
  methods: {
    change1(item) {
      // this.show = item.show;
      this.current = item.index;
      // console.log(item);
    },
    change2(item) {
      // console.log(item.detail.current);
      this.current = item.detail.current;
      // console.log(item);
    },

    up() {
      // that.getdata();
      return that;
    },

    /**
     * 获取数据
     */
    async getdata() {
      // const a = ['Radon', 'Thoron', 'temperature', 'Pressure', 'humidity'];
      const [err, res] = await to(
        DataStreams({ deviceId: this.dev.deviceid, apikey: this.dev.apikey })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      // console.log(res.data);
      const data = {};
      // const arr = [];
      res.data.data.forEach((l) => {
        data[l.id] = l.current_value;
        // if (a.includes(l.id)) arr.push(l);
      });
      data.update_at = res.data.data.filter(
        (item) => item.id === 'Radon'
      )[0].update_at;
      this.data = data;
      // this.dlist = arr;
      // console.log('组件', this.$refs);
      // console.log(data);
      this.$refs.datalist.update(data);
      this.$refs.command.update(data);
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    // console.log('加载页面');
    // const { windowWidth, windowHeight } = uni.getSystemInfoSync();
    // const scrollHeight = px2rpx(windowHeight);
    // rpx与px单位之间的换算 : 750/windowWidth = 屏幕的高度（rpx）/windowHeight
    // console.log('获取窗口可用宽度', windowWidth, windowHeight);
    // console.log(px2rpx(windowHeight), (750 * windowHeight) / windowWidth);
  },
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

<style lang="scss" scoped>
@import '@/style/mixin.scss';
$swiper-height: 40vw;
.head {
  position: fixed;
  top: 0;
}
.bg {
  @include ArcBackground();
}
.tabs {
  display: flex;
  /* 主轴空位分配方式justify-content */
  position: relative;
  top: 10px;
  justify-content: center;
  margin: 0 auto 20rpx;
  & view {
    background-color: #17364f;
  }
}
.timetext {
  position: relative;
  top: 20vw;
  left: 10px;
  color: $uni-text-color-inverse;
}
.dataview {
  position: relative;
  top: $swiper-height;
}
.swiper {
  height: calc(100vh);
  // height: calc(100vh - 40px - $swiper-height);
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
