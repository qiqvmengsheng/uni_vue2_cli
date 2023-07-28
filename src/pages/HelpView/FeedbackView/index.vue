<template>
  <div class="FeedbackView">
    <view class="textarea">
      <view class="text"> 反馈内容：</view>
      <u--textarea v-model="feedback.value" placeholder="请输入内容" count>
      </u--textarea>
    </view>
    <view class="form">
      <u-form :model="feedback" ref="uForm" :rules="rules" labelWidth="100">
        <u-form-item label="邮箱:" prop="email" borderBottom ref="item1">
          <u-input
            v-model="feedback.email"
            placeholder="请输入邮箱"
            type="text"
          >
          </u-input>
        </u-form-item>
      </u-form>
    </view>
    <view class="btn">
      <u-button
        text="使用账号绑定邮箱"
        type="primary"
        shape="circle"
        @click="getemail"
      ></u-button>
    </view>
    <view class="btn">
      <u-button
        text="提交反馈"
        type="primary"
        shape="circle"
        @click="fankui"
      ></u-button>
    </view>
  </div>
</template>

<script>
import to from 'await-to-js';
import { mapGetters } from 'vuex';
import { toast } from '@uni/apis';

export default {
  components: {},
  data() {
    return {
      feedback: {
        value: '',
        email: '',
      },
      rules: {
        email: [
          {
            // type: 'string',
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => uni.$u.test.email(value),
            // 上面有说，返回true表示校验通过，返回false表示不通过
            // uni.$u.test.mobile()就是返回true或者false的,
            message: '邮箱不正确',
            // 触发器可以同时用blur和change
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: { ...mapGetters(['userInfo']) },
  methods: {
    async fankui() {
      const [err, res] = await to(this.$refs.uForm.validate());
      if (err) {
        toast.showToast({
          content: err[0].message,
          mask: true,
        });
        console.log(err, res);
        return;
      }
      toast.showToast({
        content: '功能未开放',
        mask: true,
      });
      console.log(res, err);
    },
    getemail() {
      if (this.userInfo.useremail?.length <= 3) {
        toast.showToast({
          content: '用户未绑定邮箱',
          mask: true,
        });
        return;
      }
      if (!uni.$u.test.email(this.userInfo?.useremail)) {
        toast.showToast({
          content: '用户绑定邮箱格式错误',
          mask: true,
        });
        return;
      }
      // console.log(this.userInfo);
      this.feedback.email = this.userInfo.useremail;
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

<style lang="scss" scoped>
.text {
  padding-bottom: 10rpx;
}
.textarea {
  margin: 20rpx;
}
.form {
  background-color: #fff;
  margin: 20rpx;
}
.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
</style>
