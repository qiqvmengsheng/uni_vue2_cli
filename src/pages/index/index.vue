<template>
  <view class="content">
    <button
      type="default"
      size="mini"
      hover-class="none"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      获取手机号
    </button>
    <!-- <uni-tooltip :content="name">
      <button>被包裹的组件</button>
    </uni-tooltip> -->
    <!-- <image class="logo" src="/static/logo.png"></image> -->
    <template>
      <u-form :model="dev" ref="uForm" labelWidth="100">
        <u-form-item
          label="设备型号"
          prop="dev.devicename"
          borderBottom
          @click="showDevtype = true"
          ref="item1"
        >
          <u-input
            v-model="dev.devicename"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择设备类型"
            border="none"
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="序列号" labelWidth="100">
          <u-input v-model="dev.deviceserial">
            <u-text text="SN" slot="prefix" margin="0 3px 0 0" type="tips">
            </u-text>
          </u-input>
        </u-form-item>
        <u-form-item label="设备码">
          <u-input v-model="dev.accesscode" type="select" />
        </u-form-item>
        <u-form-item label="设备备注">
          <u-input v-model="dev.abbreviation" type="select" />
        </u-form-item>
        <u-form-item label="开关">
          <u-switch slot="right" v-model="value"></u-switch>
        </u-form-item>
      </u-form>
      <u-action-sheet
        :show="showDevtype"
        :actions="actions"
        title="请选择设备类型"
        description="目前类型只有一个"
        @close="showDevtype = false"
        @select="devtype"
      >
      </u-action-sheet>
      <u-toast ref="uToast"></u-toast>
    </template>
    <u-button type="primary" text="确定" @click="test"> 弹出提示</u-button>
    <!-- <u-icon name="home"></u-icon> -->
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
import { login, wxlogin, wxgetUserInfo, getPnumber } from '@/api/user';
import {
  associate,
  addpermission,
  disassociate,
  modifyabbreviation,
} from '@/api/base';

export default {
  data() {
    return {
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
  computed: { ...mapGetters(['name']) },
  created() {
    // this.login();
  },
  mounted() {
    // this.login();
  },
  methods: {
    ...mapActions('user', ['wxlogin', 'getInfo']),
    change1(...e) {
      // console.log(ROUTES);
      // console.log(this.$Router.push(''));
      console.log(this.$Router.options.routes);
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
    async test() {
      const index = this.$Router.options.routes.filter(
        (r) => r.name === 'getPhone'
      )[0];
      console.log(index);
      this.$Router.push(index.path);
      const [err, res] = await to(this.getInfo());
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
