<template>
  <view class="content">
    <!-- <button
      type="default"
      size="mini"
      hover-class="none"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      获取手机号
    </button> -->
    <!-- <uni-tooltip :content="name">
      <button>被包裹的组件</button>
    </uni-tooltip> -->
    <!-- <image class="logo" src="/static/logo.png"></image> -->
    <template>
      <view>
        <u-grid :border="false" @click="click" col="2">
          <u-grid-item
            v-for="(item, baseListIndex) in devices"
            :key="baseListIndex"
          >
            <uni-card
              :title="`设备${item.devicename}`"
              :extra="item.deviceserial"
            >
              <!-- <input
                v-model="item.abbreviation"
                placeholder-class="input-placeholder"
                @blur="setabbreviation(item)"
              /> -->
              <u--input
                size="mini"
                type="text"
                placeholder="请输入备注"
                border="surround"
                v-model="item.abbreviation"
                @blur="setabbreviation(item)"
              ></u--input>
              <text class="grid-text">{{ item.abbreviation || '无' }}</text>
            </uni-card>
            <!-- <u-icon
              :customStyle="{ paddingTop: 20 + 'rpx' }"
              :name="item.name"
              :size="22"
            ></u-icon> -->
          </u-grid-item>
        </u-grid>
        <u-toast ref="uToast" />
      </view>
    </template>
    <u-toast ref="uToast"></u-toast>
    <view class="button_view">
      <GetPhoneNumberVue></GetPhoneNumberVue>
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
    <u-modal
      title="绑定手机"
      :show="show8"
      closeOnClickOverlay
      @confirm="() => (show8 = false)"
      @close="() => (show8 = false)"
      content="新用户请绑定手机号，如已有网页平台账号请绑定对应账号的手机号，用于获取账号数据。"
    >
      <!-- <button
      showCancelButton
      showConfirmButton
        slots="confirmButton"
        type="default"
        size="mini"
        hover-class="none"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        获取手机号
      </button> -->
      <u-button
        slot="confirmButton"
        text="确定"
        type="success"
        shape="circle"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        @click="show8 = false"
      ></u-button>
    </u-modal>
    <!-- <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <u-tabbar :value="value1" @change="change1">
      <u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
      <u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
    </u-tabbar> -->
  </view>
</template>

<script>
import to from 'await-to-js';
import { mapGetters, mapActions } from 'vuex';
import { toast } from '@uni/apis';
import GetPhoneNumberVue from '@/components/GetPhoneNumber';
import { login, wxlogin, wxgetUserInfo, getPnumber } from '@/api/user';
import { associate, modifyabbreviation } from '@/api/base';

export default {
  components: { GetPhoneNumberVue },
  data() {
    return {
      show8: true,
      show: true,
      showDevtype: false,
      dev: {
        deviceserial: '',
        devicename: '',
        accesscode: '',
        abbreviation: '',
      },
      value: true,
      form: {
        name: '',
        intro: '',
        sex: '',
      },
      actions: [
        {
          name: 'RTM1688',
        },
      ],
    };
  },
  onLoad() {},
  computed: { ...mapGetters(['name', 'devices']) },
  created() {
    // this.login();
  },
  mounted() {
    this.login();
  },
  methods: {
    ...mapActions('user', ['wxlogin', 'getInfo']),
    change(e) {
      console.log(`'当前模式：' + ${e.type} + ',状态：' + ${e.show}`);
    },
    change1(...e) {
      // console.log(ROUTES);
      // console.log(this.$Router.push(''));
      console.log(this.$Router.options.routes);
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
    devtype(e) {
      this.dev.devicename = e.name;
      console.log(e);
    },
    /**  */
    setabbreviation(row) {
      console.log(row);
      modifyabbreviation({
        abbreviation: row.abbreviation,
        deviceId: row.deviceid,
      }).then(
        (response) => {
          if (response.data.code === 200) {
            toast.showToast({
              content: `${row.deviceserial}修改设备备注成功！`,
              type: 'success',
            });
          } else {
            toast.showToast(response.data.msg);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    /** 用户添加设备 */
    doupdatedev() {
      const { deviceserial, ...a } = this.dev;
      this.$refs.setdevForm.validate((valid) => {
        if (valid) {
          associate({ deviceserial: `SN${deviceserial}`, ...a }).then(
            (response) => {
              console.log(response);
              if (response.data.code === 200) {
                this.$message.success(response.data.msg);
                // location.reload();
              } else {
                this.$message.error(response.data.msg);
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    },

    /**
     * 获取电话号码
     */
    async getPhoneNumber(e) {
      console.log(e);
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        console.log('用户点击了接受', e);
        const code =
          (e.detail && e.detail.code !== undefined && e.detail.code) || '123';
        const [err, res] = await to(getPnumber({ code }));
        if (err) {
          console.log('失败', err);
          return;
        }
        console.log('获取电话返回', res);
        // e.detail这里会有三个属性
        // encryptedData
        // errMsg
        // iv
      } else {
        console.log('用户点击了拒绝');
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
      // const [err, res] = await to(this.getInfo());
      // this.$refs.uToast.show({
      //   type: 'success',
      //   message: `欢迎${this.name}登录`,
      //   // duration: '2300',
      // });
    },
    async test() {
      // this.$refs.popup.open('bottom');
      this.show8 = true;
      // const index = this.$Router.options.routes.filter(
      //   (r) => r.name === 'addDevice'
      // )[0];
      // console.log(index);
      // this.$Router.push(index.path);
      // const [err, res] = await to(this.getInfo());
      console.log(this.devices);
      this.$refs.uToast.show({
        type: 'success',
        message: `欢迎${this.name}登录`,
        // duration: '2300',
      });
    },
    /**
     * 微信自动登录
     */
    async login() {
      const [err, res] = await to(this.wxlogin());
      if (err) {
        console.log(err);
        return;
      }
      console.log('微信登录返回信息：', res);
      this.getInfo();
    },
    /**
     * 登录获取信息
     */
    async getUserInfo() {
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
      const { nickName, gender, province, city } = userInfo;

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
.button_view {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.ubutton {
  margin: 0 15px 15px 0;
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
