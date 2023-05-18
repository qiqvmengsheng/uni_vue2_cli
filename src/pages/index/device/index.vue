<template>
  <div class="device">
    <template>
      <u-sticky bgColor="rgba(0,0,0,0)">
        <view class="tabs">
          <view>
            <u-tabs
              :list="list1"
              @change="change1"
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
      <view v-show="show">
        <DataList ref="datalist" :dev="dev"> </DataList>
      </view>
      <view v-show="!show">
        <CommandView ref="command" :getdata="up" :dev="dev"> </CommandView>
      </view>
    </view>
  </div>
</template>

<script>
import to from 'await-to-js';
import { mapGetters } from 'vuex';
import { DataStreams } from '@/api/onenet';
import { getlastDatas } from '@/api/devdata';
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
      show: true,
      list1: [
        { name: '\t\t数据展示\t\t', show: true },
        { name: '\t\t命令下发\t\t', show: false },
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
      this.show = item.show;
      console.log(item);
    },

    up() {
      // that.getdata();
      return that;
    },

    /**
     * 新版最新数据
     */
    async newdevdata() {
      const [err, res] = await to(
        getlastDatas({ deviceid: this.dev.deviceid, numbers: 1 })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      // console.log(res);

      const data = {};
      const keys = Object.keys(res.data.data.datastreams);
      keys.forEach((key) => {
        data[key] = res.data.data.datastreams[key][0]?.value;
      });
      data.update_at = res.data.data.datastreams.Radon[0]?.at;
      this.data = data;
      this.$refs.datalist.update(data);
      // if (/^\d*$/.test(this.dev.deviceid)) {
      //   console.log('新版数据', data);
      //   // this.$refs.datalist.update(data);
      // }
    },

    /**
     * 获取数据
     */
    async getdata() {
      // this.newdevdata();
      console.log(this.dev.deviceid, !/^\d*$/.test(this.dev.deviceid));
      if (!/^\d*$/.test(this.dev.deviceid)) {
        this.newdevdata();
        return;
      }
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
      // console.log('老版数据', data);
      this.$refs.datalist.update(data);
      this.$refs.command.update(data);
    },
  },
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

<style lang="scss" scoped>
@import '@/style/mixin.scss';
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
  top: 40vw;
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
