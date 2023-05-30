<template>
  <div class="DataQuantity">
    <view class="subsection">
      <u-subsection
        mode="subsection"
        :list="list"
        :current="current"
        @change="sectionChange"
      ></u-subsection>
    </view>
    <view class="form" v-show="current === 0">
      <u-form :model="form" ref="uForm" :rules="rules" labelWidth="100">
        <u-form-item
          label="数量"
          prop="number"
          borderBottom
          @click="showDevtype = true"
          ref="item1"
        >
          <u-input
            placeholder="请输入周期"
            type="number"
            border="surround"
            v-model="form.number"
          >
          </u-input>
          <!-- <u-icon slot="right" name="arrow-right"></u-icon> -->
        </u-form-item>
      </u-form>
    </view>

    <view class="cell" v-show="current === 1">
      <u-cell-group>
        <u-cell
          title="开始时间"
          :value="$u.timeFormat(startTime, 'yyyy年mm月dd日 hh时MM分ss秒')"
          @click="startshow = true"
          isLink
        ></u-cell>
        <u-cell
          title="结束时间"
          :value="$u.timeFormat(endTime, 'yyyy年mm月dd日 hh时MM分ss秒')"
          @click="endshow = true"
          isLink
        ></u-cell>
      </u-cell-group>
    </view>

    <view class="btn">
      <u-button
        text="确认"
        type="primary"
        shape="circle"
        @click="confirmform"
      ></u-button>
    </view>

    <u-datetime-picker
      :show="startshow"
      v-model="startTime"
      mode="datetime"
      closeOnClickOverlay
      @confirm="confirm"
      @cancel="cancel"
      @change="change"
      @close="close"
    ></u-datetime-picker>
    <u-datetime-picker
      :show="endshow"
      v-model="value1"
      mode="datetime"
      closeOnClickOverlay
      @confirm="confirm"
      @cancel="cancel"
      @change="change"
      @close="close"
    ></u-datetime-picker>
    <!-- <u-modal
      :show="formshow"
      title="显示数据量"
      closeOnClickOverlay
      @close="formshow = false"
      @confirm="confirmform()"
    >
      <view>
        <u-form :model="form" ref="uForm" :rules="rules" labelWidth="100">
          <u-form-item label="数据数量" prop="number" ref="item1">
            <u-input
              placeholder="请输入数量"
              type="number"
              border="surround"
              v-model.number="form.number"
            >
              <template slot="suffix">
                <u-text text="个" margin="0 3px 0 0" type="tips"></u-text>
              </template>
            </u-input>
          </u-form-item>
        </u-form>
      </view>
    </u-modal> -->
  </div>
</template>

<script>
import { application } from '@uni/apis';

export default {
  components: {},
  data() {
    return {
      list: ['按数量', '按时间'],
      current: 0,
      startshow: false,
      endshow: false,
      value1: Number(new Date()),
      startTime: Number(new Date()),
      endTime: Number(new Date()),
      form: { number: 200 },
      formshow: false,
      rules: {
        number: [
          {
            // type: 'string',
            required: true,
            pattern: /^[\d]+$/,
            message: '必须是整数',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {},
  created() {
    this.$AppReady.then(() => {
      console.log('收到参数', this.$Route.query);
      // this.datastreams = this.$Route.query.datastreams;
      // const id = this.$Route.query.deviceid;
      // [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      // console.log('获得dev', this.dev);
      // this.getdata();
      // this.getmakings();
    });
  },
  methods: {
    sectionChange(index) {
      // console.log(index);
      this.current = index;
    },

    close() {
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
    confirm(e) {
      this.show = false;
      // this.result(e.value, e.mode);
    },
    change(e) {
      // console.log('change', e);
    },
    /**
     * 确认获取数据
     */
    confirmform() {
      // this.$Router.replace({
      //   name: 'chartView',
      //   params: { number: this.number },
      // });
      const pages = application.getCurrentPages();
      const chartVm = pages[pages.length - 2].$vm;
      console.log('上一页数据', pages[pages.length - 2], chartVm);
      this.$Router.back(1, {
        success: (...arg) => {
          console.log(this, '跳转成功', arg);
          chartVm.init({ number: this.form.number });
        },
      });
      // this.$route.params.user = '123';
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
.DataQuantity {
  margin-top: 10px;
}
.subsection {
  padding: 10px 30px;
  background-color: #fff;
}
.form {
  background-color: #fff;
  padding: 0 15px;
}
.cell {
  background-color: #fff;
}

.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
</style>
