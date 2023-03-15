<template>
  <view class="addDevice">
    <template>
      <u-form :model="dev" ref="uForm" labelWidth="100">
        <u-form-item
          label="设备型号"
          prop="devicename"
          borderBottom
          @click="showAddDev = true"
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
        <u-form-item label="序列号" labelWidth="100" prop="deviceserial">
          <u-input v-model="dev.deviceserial">
            <u-text text="SN" slot="prefix" margin="0 3px 0 0" type="tips">
            </u-text>
          </u-input>
        </u-form-item>
        <u-form-item label="设备码" prop="accesscode">
          <u-input v-model="dev.accesscode" type="select" />
        </u-form-item>
        <u-form-item label="设备备注" prop="abbreviation">
          <u-input v-model="dev.abbreviation" type="select" />
        </u-form-item>
        <u-form-item label="开关">
          <u-switch slot="right" v-model="value"></u-switch>
        </u-form-item>
        <u-form-item>
          <view class="btn-view">
            <view class="btn">
              <u-button type="primary" plain text="确定" @click="doupdatedev">
                添加设备
              </u-button>
            </view>
            <view class="btn">
              <u-button type="primary" plain text="确定" @click="test">
                测试
              </u-button>
            </view>
          </view>
        </u-form-item>
      </u-form>
      <u-action-sheet
        :show="showAddDev"
        :actions="actions"
        title="请选择设备类型"
        description="目前类型只有一个"
        @close="showAddDev = false"
        @select="devtype"
      >
      </u-action-sheet>
    </template>
  </view>
</template>

<script>
import to from 'await-to-js';
import { toast } from '@uni/apis';
import { associate } from '@/api/base';

export default {
  components: {},
  data() {
    return {
      showAddDev: false,
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
      rules: {
        devicename: [
          {
            // type: 'string',
            required: true,
            message: '请选择设备类型',
            trigger: 'blur',
          },
        ],
        deviceserial: [
          {
            // type: 'string',
            required: true,
            message: '请输入序列号',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[\d]{1,}$/,
            message: '请输入纯数字序列号',
            trigger: 'blur',
          },
        ],
        accesscode: [
          {
            type: 'string',
            required: true,
            message: '请输入设备码',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[A-Za-z0-9]{4}$/,
            message: '请输入正确的设备码',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    test() {
      // tabBar.showTabBar();
    },
    /** 用户添加设备 */
    async doupdatedev() {
      const { deviceserial, ...params } = this.dev;
      const [err, res] = await to(this.$refs.uForm.validate());
      if (err) {
        console.log(err, res);
        return;
      }
      const [e, r] = await to(
        associate({ deviceserial: `SN${deviceserial}`, ...params })
      );
      if (e) {
        console.log(e, r);
        return;
      }
      toast
        .showToast({
          content: r.data.msg,
          type: 'success',
          duration: 1000,
        })
        .then(() => {});
      // this.$refs.uForm.validate((valid) => {
      //   if (valid) {
      //     associate({ deviceserial: `SN${deviceserial}`, ...params }).then(
      //       (response) => {
      //         console.log(response);
      //         if (response.data.code === 200) {
      //           this.$message.success(response.data.msg);
      //           // location.reload();
      //         } else {
      //           this.$message.error(response.data.msg);
      //         }
      //       },
      //       (error) => {
      //         console.log(error);
      //       }
      //     );
      //   }
      // });
    },
    devtype(e) {
      this.dev.devicename = e.name;
      console.log(e);
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
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

<style scoped>
.addDevice {
  margin: 10rpx;
}
.btn-view {
  display: flex;
  justify-content: space-around;
}
.btn {
  margin: 0 15rpx 15rpx 0;
}
</style>
