<template>
  <view class="content">
    <GetPhoneNumberVue ref="getpnumber"></GetPhoneNumberVue>
    <view class="button_view">
      <view class="ubutton">
        <u-button
          type="primary"
          :plain="true"
          text="确定"
          @click="$refs.getpnumber.showModal()"
        >
          弹出提示
        </u-button>
      </view>
      <!-- <view class="ubutton">
        <u-button type="primary" :plain="true" text="确定" @click="test">
          弹出提示
        </u-button>
      </view> -->
      <view class="ubutton">
        <u-button type="primary" :plain="true" text="确定" @click="addDevice">
          添加设备
        </u-button>
      </view>
    </view>
    <!-- <uni-tooltip :content="name">
      <button>被包裹的组件</button>
			@scrolltolower="scrolltolower"
    </uni-tooltip> -->
    <!-- <image class="logo" src="/static/logo.png"></image> -->

    <view>
      <u-list class="u-page" height="600rpx">
        <u-list-item
          v-for="(item, index) in devices"
          :key="index"
          class="list-item"
        >
          <uni-card
            title="设备"
            :isFull="true"
            :sub-title="item.devicename"
            :extra="item.deviceserial"
            class="list-card"
          >
            <view>
              <u-input
                size="mini"
                type="text"
                placeholder="请输入备注"
                border="bottom"
                v-model="item.abbreviation"
                @blur="setabbreviation(item)"
              >
                <u--text
                  text="备注"
                  slot="prefix"
                  margin="0 3px 0 0"
                  type="tips"
                ></u--text>
              </u-input>
              <view class="viewflex">
                <text>普通用户设置权限:</text>
                <!-- <u-tooltip text="普通用户设置权限:" overlay> </u-tooltip> -->
                <view @click="handleEdit(index, item)">
                  <u-switch
                    size="20"
                    :value="item.devuserpermission"
                    :loading="loading"
                  ></u-switch>
                </view>
              </view>
              <!-- <u-icon
                slot="icon"
                name="arrow-right"
                @click="test"
                class="right-icon"
              ></u-icon>
              <text class="uni-body"
                >这是一个通栏卡片 ，通栏没有外边距，左右会贴合父元素。
              </text> -->
            </view>
            <template v-slot:actions>
              <view class="card-actions">
                <view class="card-actions-item" @click="actionsClick('分享')">
                  <uni-icons
                    type="pengyouquan"
                    size="18"
                    color="#999"
                  ></uni-icons>
                  <text class="card-actions-item-text">分享</text>
                </view>
                <view class="card-actions-item" @click="actionsClick('点赞')">
                  <uni-icons
                    type="settings-filled"
                    size="18"
                    color="#999"
                  ></uni-icons>
                  <text class="card-actions-item-text">设置</text>
                </view>
                <view class="card-actions-item" @click="actionsClick('评论')">
                  <uni-icons
                    type="trash-filled"
                    size="18"
                    color="#999"
                  ></uni-icons>
                  <text class="card-actions-item-text">删除</text>
                </view>
              </view>
            </template>
          </uni-card>
        </u-list-item>
      </u-list>
    </view>
    <template>
      <view class="grid">
        <u-grid :border="false" col="2">
          <u-grid-item
            v-for="(item, baseListIndex) in devices"
            :key="baseListIndex"
          >
            <uni-card
              title="设备"
              :extra="item.deviceserial"
              isFull
              class="item-card"
            >
              <!-- <input
                v-model="item.abbreviation"
                placeholder-class="input-placeholder"
                @blur="setabbreviation(item)"
              /> -->
              <view style="display: flax">
                <u-input
                  size="mini"
                  type="text"
                  placeholder="请输入备注"
                  border="bottom"
                  v-model="item.abbreviation"
                  @blur="setabbreviation(item)"
                >
                  <u--text
                    text="备注"
                    slot="prefix"
                    margin="0 3px 0 0"
                    type="tips"
                  ></u--text>
                </u-input>
              </view>
              <text class="grid-text">{{ item.abbreviation || '无' }}</text>
            </uni-card>
            <!-- <u-icon
              :customStyle="{ paddingTop: 20 + 'rpx' }"
              :name="item.name"
              :size="22"
            ></u-icon> -->
          </u-grid-item>
        </u-grid>
      </view>
    </template>
    <u-toast ref="uToast"></u-toast>
    <!--<u-tabbar :value="value1" @change="change1">
      <u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
      <u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
    </u-tabbar> -->
  </view>
</template>

<script>
import to from 'await-to-js';
import { mapGetters, mapActions } from 'vuex';
import { toast, confirm } from '@uni/apis';
import GetPhoneNumberVue from '@/components/GetPhoneNumber';
import { modifyabbreviation, addpermission } from '@/api/base';

export default {
  components: { GetPhoneNumberVue },
  data() {
    return {
      show: true,
    };
  },
  computed: { ...mapGetters(['name', 'devices']) },
  // 页面周期函数--监听页面加载
  created() {},
  onLoad() {},
  mounted() {
    this.$refs.getpnumber.showModal();
  },
  methods: {
    ...mapActions('user', ['getInfo']),
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
    actionsClick(e) {},

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
          content: `${row.deviceserial}修改设备备注成功！`,
          type: 'success',
        });
      } else {
        toast.showToast(res.data.msg);
      }
    },

    /**
     * 跳转到添加设备页面
     */
    async addDevice() {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'addDevice'
      )[0];
      console.log(index);
      this.$Router.push({ name: 'addDevice' });
    },
    async test() {
      // const index = this.$Router.options.routes.filter(
      //   (r) => r.name === 'addDevice'
      // )[0];
      // console.log(index);
      // this.$Router.push(index.path);
      console.log(this.devices);
      this.$refs.uToast.show({
        type: 'success',
        message: `欢迎${this.name}登录`,
        // duration: '2300',
      });
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

<style scoped>
.right-icon {
  float: right;
}
.grid {
  margin: 5px;
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
  height: 100rpx;
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
  justify-content: space-evenly;
}
.button_view {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
</style>
