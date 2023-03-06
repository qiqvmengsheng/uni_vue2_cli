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
    <view>
      <text class="title">{{ title }}</text>
    </view>

    <u-action-sheet :list="list" abbreviation-model="show"></u-action-sheet>

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
            abbreviation-model="dev.devicename"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择设备类型"
            border="none"
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="序列号">
          <u-input v-model="dev.devicename">
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
          <u-switch slot="right" abbreviation-model="value"></u-switch>
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
    <u-tag text="雪月夜" type="success" />
    <u-button type="primary" text="确定" @click="test"> 弹出提示</u-button>
    <u-icon name="home"></u-icon>
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
      title: 'Hello',
      list: [
        {
          text: '点赞',
          color: 'blue',
          fontSize: 28,
        },
        {
          text: '分享',
        },
        {
          text: '评论',
        },
      ],
      show: true,
    };
  },
  onLoad() {},
  computed: { ...mapGetters(['name']) },
  created() {
    // this.login();
  },
  mounted() {
    this.login();
  },
  methods: {
    ...mapActions('user', ['wxlogin', 'getInfo']),
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
        console.log('用户点击了接受');
        const [err, res] = await to(getPnumber({ code: e.detail.code }));
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
    test() {
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

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
