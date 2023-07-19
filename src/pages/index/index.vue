<template>
  <view class="content">
    <view class="bg"></view>
    <view class="head1">
      <text>选择您的设备</text>
    </view>
    <view class="grid">
      <u-grid :border="false" col="2">
        <template v-if="!loginbtnshow">
          <u-grid-item
            v-for="(item, baseListIndex) in devices"
            :key="baseListIndex"
          >
            <view
              class="dev-view"
              @longpress="handleDelete(index, item)"
              @click="tocommandView(index, item)"
            >
              <view class="devname">
                <text
                  class="nichen"
                  :style="item.abbreviation ? '' : 'color: #999;'"
                  >{{ item.abbreviation || '无昵称' }}
                </text>
              </view>
              <view class="devname">
                <text class="ziti">{{ item.devicename || 'RTM1688' }}</text>
                <text class="ziti"> {{ item.deviceserial }}</text>
              </view>
              <!-- <view>
                <view class="devname">
                  <text class="iconfont icon-dianziyiqi"></text>
                </view>
              </view> -->
              <text
                class="textRight ziti"
                :style="item.RadonAt ? '' : 'color: #999;'"
              >
                {{ item.RadonAt || '无' }}
              </text>
              <view class="devname" style="line-height: 21px">
                <text>氡浓度: </text>
                <text class="ziti" :style="item.Radon ? '' : 'color: #999;'">{{
                  item.Radon || '无'
                }}</text>
              </view>
            </view>
          </u-grid-item>
        </template>
        <u-grid-item v-if="loginbtnshow || devices.length === 0">
          <view class="dev-view" @click="tocommandView('test')">
            <view class="devname">
              <text class="nichen"> 示例设备 </text>
            </view>
            <view class="devname">
              <text class="ziti">{{ 'RTM1688' }}</text>
              <text class="ziti"> SN000 </text>
            </view>
            <text class="textRight ziti">
              {{ $u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss') }}
            </text>
            <view class="devname" style="line-height: 21px">
              <text>氡浓度: </text>
              <text class="ziti"> 0.0 </text>
            </view>
          </view>
        </u-grid-item>
        <u-grid-item>
          <view
            class="dev-view"
            style="align-content: center"
            @click="addDevice"
          >
            <u-icon name="plus" color="#2979ff" size="45"> </u-icon>
          </view>
        </u-grid-item>
      </u-grid>
    </view>

    <view class="login-prompt" v-if="loginbtnshow" @touchmove.stop.prevent="">
      <text>登录后查看设备</text>
      <view class="loginbtn">
        <u-button
          text="去登录"
          size="small"
          shape="circle"
          type="primary"
          @click="$Router.push({ name: 'login' })"
        ></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import to from 'await-to-js';
import { mapGetters, mapActions } from 'vuex';
import { toast, confirm } from '@uni/apis';
import { getlastDatas } from '@/api/devdata';
import { modifyabbreviation, addpermission, disassociate } from '@/api/base';

export default {
  components: {},
  data() {
    return {
      loginbtnshow: false,
      show: true,
      isLastdata: false,
    };
  },
  computed: { ...mapGetters(['name', 'devices', 'systemrole', 'userInfo']) },
  watch: {
    userInfo(newValue) {
      // console.log(
      //   this.systemrole,
      //   newValue.userphone,
      //   uni.$u.test.mobile(newValue.userphone)
      // );
      // console.log('参数', newValue.userphone);
      if (
        this.systemrole === 'user' &&
        !uni.$u.test.mobile(newValue.userphone)
      ) {
        this.loginbtnshow = true;
        // this.$refs.getpnumber.showModal();
      } else {
        this.loginbtnshow = false;
      }
    },
    devices() {
      if (!this.isLastdata && !this.loginbtnshow) {
        console.log(this.devices);
        this.isLastdata = true;
        this.lastData();
      }
    },
  },
  // 页面周期函数--监听页面加载
  created() {},
  onLoad() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    if (!this.loginbtnshow) this.lastData();
  },
  async mounted() {
    // this.$Router.push({ name: 'commandView' });
    // const [err, res] = await to(this.getInfo());
    // if (err) {
    //   console.log(err, res);
    //   return;
    // }
  },
  methods: {
    ...mapActions('user', ['getInfo']),

    lastData() {
      [...this.devices].forEach((dev) => {
        // console.log(dev);
        if (dev.RadonAt !== undefined) return;
        getlastDatas({
          deviceid: dev.deviceid,
          numbers: 1,
          isloading: false,
        }).then((r) => {
          const { datastreams } = r.data.data;
          // console.log(r);
          this.$set(dev, 'Radon', datastreams.Radon[0].value);
          this.$set(dev, 'RadonAt', datastreams.Radon[0].at);
          // this.$set()
        });
      });
    },

    change(e) {
      console.log(`'当前模式：' + ${e.type} + ',状态：' + ${e.show}`);
    },
    change1(...e) {
      // console.log(ROUTES);
      // console.log(this.$Router.push(''));
      console.log(e, this.$Router.options.routes);
    },
    click(e) {
      console.log(e);
    },
    click1(e) {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'index'
      )[0];
      console.log(e, index);
      this.$Router.push(index.children[e].path);
    },
    actionsClick() {},

    /**
     * 跳转图表页面
     */
    tochartView(index, row) {
      this.$Router.push({
        name: 'chartView',
        params: { deviceid: row.deviceid },
      });
    },

    /**
     * 跳转设备页面
     */
    tocommandView(index, row) {
      if (index === 'test') {
        this.$Router.push({
          name: 'chartView',
          params: { test: 'test' },
        });
        return;
      }
      this.$Router.push({
        name: 'chartView',
        params: { deviceid: row.deviceid },
      });
    },

    /**
     * 删除名下设备
     */
    async handleDelete(index, row) {
      console.log(row);
      const res = await confirm({
        title: '提示',
        content: `是否删除用户名下${row.deviceserial}设备`,
      });
      if (res.cancel) {
        return;
      }
      disassociate({
        deviceId: row.deviceid,
      }).then(
        (response) => {
          console.log(response);
          let type = '';

          let content = '';
          if (response.data.code === 200) {
            type = 'success';
            content = `${row.deviceserial}设备删除成功！`;
            this.getInfo();
          } else {
            type = 'fail';
            content = '删除失败';
          }
          toast.showToast({
            content,
            type,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    },

    /**
     * 修改备注
     */
    async setabbreviation(row) {
      console.log(row);
      const [err, res] = await to(
        modifyabbreviation({
          abbreviation: row.abbreviation,
          deviceId: row.deviceid,
        })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      if (res.data.code === 200) {
        toast.showToast({
          content: `${row.deviceserial}修改备注成功！`,
          // type: 'success',
        });
      } else {
        toast.showToast(res.data.msg);
      }
    },

    /**
     * 跳转到添加设备页面
     */
    async addDevice() {
      // const index = this.$Router.options.routes.filter(
      //   (r) => r.name === 'addDevice'
      // )[0];
      // console.log(index);
      if (this.loginbtnshow) {
        toast.showToast('请登录后添加设备');
        return;
      }
      this.$Router.push({ name: 'addDevice' });
    },
    /**
     * 修改权限
     */
    async handleEdit(index, row) {
      console.log(row);
      const res = await confirm({
        title: '提示',
        content: `是否${row.devuserpermission ? '关闭' : '打开'}设备${
          row.deviceserial
        }的普通用户设置权限`,
      });
      if (res.cancel) {
        return;
      }
      addpermission({
        deviceId: row.deviceid,
        status: row.devuserpermission ? 0 : 1,
      }).then(
        (response) => {
          console.log(response);
          if (response.data.code === 200) {
            console.log('修改成功');
            this.getInfo().then(() => {});
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/static/icon/iconfont.css';
@import '@/style/mixin.scss';
.iconfont {
  color: #999;
  font-size: 30px;
}
.bg {
  @include ArcBackground();
  // position: fixed;
  // top: 0;
  // z-index: -10;
  // width: 100vw;
  // height: 50vh;
  // background-color: #184677;
  // border-radius: 0px 0px 25vw 100vw / 0px 0px 5vh 25vh;
}
.head1 {
  color: #fff;
  margin: 10vh auto 20rpx;
}
.grid {
  width: 90vw;
  margin: 1vw 5vw;
}
.devname {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
}
.textLeft {
  text-align: left;
}
.textRight {
  font-size: 14px;
  text-align: right;
}
.nichen {
  width: 100%;
  text-align: center;
  color: #184677;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 20px;
}
.ziti {
  font-family: Arial, Helvetica, sans-serif;
}
.dev-view {
  background-color: #fff;
  width: calc(40vw - 40rpx);
  height: calc(260rpx - 40rpx);
  margin: 2.5vw;
  padding: 20rpx;
  border-radius: 20rpx;
  box-shadow: 4rpx 4rpx 10rpx 6rpx rgba(0, 0, 0, 0.1);
  display: flex;
  // flex轴横向，溢出换行。 flex-direction: row;  flex-wrap: wrap; 简写 flex-flow
  flex-flow: row wrap;
  // 副轴对齐方式align-items  平均分配
  align-content: space-between;
  /* 主轴对齐方式justify-content */
  justify-content: center;
}
.card-actions-item {
  // flex: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  font-size: 14px;
}
.card-actions-item-text {
  margin-left: 5px;
  line-height: 30px;
  color: #666;
  text-align: center;
}
.right-icon {
  float: right;
}
.list-card {
  width: 710rpx;
  margin: 10rpx 20rpx;
}
.item-card {
  margin: 5rpx 5rpx;
}
.u-page {
  width: 700rpx;
  margin: 0 auto 10rpx;
}
.viewflex {
  display: flex;
  /* flex轴横向，溢出换行。
  flex-direction: row;
  flex-wrap: wrap;
  简写 flex-flow
   */
  flex-flow: row wrap;
  /* 副轴对齐方式align-items */
  align-items: center;
  /* 主轴对齐方式justify-content */
  justify-content: space-between;
}
.card-actions {
  border-top: 1rpx solid #ebeef5;
  height: 45px;
  display: flex;
  /* flex轴横向，溢出换行。
  flex-direction: row;
  flex-wrap: wrap;
  简写 flex-flow
   */
  flex-flow: row wrap;
  /* 副轴对齐方式align-items  上下居中*/
  align-items: center;
  /* 主轴空位分配方式justify-content */
  justify-content: space-evenly;
}
.button_view {
  display: flex;
  // flex轴横向，溢出换行。 flex-direction: row;  flex-wrap: wrap; 简写 flex-flow
  flex-flow: row wrap;
  // 副轴对齐方式align-items  上下居中
  align-items: center;
}
.ubutton {
  margin: 0 15rpx 15rpx 0;
}
.popup {
  height: 200rpx;
}
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

.login-prompt {
  z-index: 50;
  height: 80rpx;
  width: 90%;
  margin: 0 auto;
  border-radius: 40rpx;
  position: fixed;
  bottom: 30rpx;
  background-color: rgba($color: #000000, $alpha: 0.7);
  color: #fff;
  display: flex;
  // 副轴对齐方式align-items  上下居中
  align-items: center;
  /* 主轴空位分配方式justify-content */
  justify-content: space-between;
  & text {
    // position: relative;
    // left: 40rpx;
    margin-left: 40rpx;
    // border: blue solid 1px;
    line-height: 80rpx;
  }
  & .loginbtn {
    font-size: 13px;
    margin-right: 10rpx;
  }
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
