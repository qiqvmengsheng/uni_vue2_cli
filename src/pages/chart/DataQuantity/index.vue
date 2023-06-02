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
          :value="
            startTime
              ? $u.timeFormat(startTime, 'yyyy年mm月dd日 hh时MM分')
              : '点击选择时间'
          "
          @click="setstart"
          isLink
        ></u-cell>
        <u-cell
          title="结束时间"
          :value="
            endTime
              ? $u.timeFormat(endTime, 'yyyy年mm月dd日 hh时MM分')
              : '点击选择时间'
          "
          @click="setend"
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
      ref="datetimePicker"
      :show="show"
      v-model="value1"
      mode="datetime"
      closeOnClickOverlay
      @confirm="confirm"
      @cancel="cancel"
      @close="close"
      :formatter="formatter"
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
import to from 'await-to-js';
import { application, toast } from '@uni/apis';

export default {
  components: {},
  data() {
    return {
      list: ['按数量', '按时间'],
      current: 0,
      show: false,
      startEnd: false,
      value1: Number(new Date()),
      startTime: '',
      endTime: '',
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
      // console.log('收到参数', this.$Route.query);
      this.form.number = this.$Route.query.number;
      this.startTime = this.$Route.query.startTime;
      this.endTime = this.$Route.query.endTime;
      this.current = parseInt(this.$Route.query.isnumber, 10);
      // this.datastreams = this.$Route.query.datastreams;
      // const id = this.$Route.query.deviceid;
      // [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      // this.getdata();
      // this.getmakings();
    });
  },
  methods: {
    // 格式化时间选择器
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      if (type === 'hour') {
        return `${value}时`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },

    sectionChange(index) {
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
      if (e.value > Number(new Date())) {
        toast.showToast({
          content: '不能选择未来时间',
          mask: true,
        });
        return;
      }

      if (this.startEnd) {
        if (!!this.endTime && this.endTime <= e.value) {
          toast.showToast({
            content: '开始时间必须小于结束时间',
            mask: true,
          });
          return;
        }
        this.startTime = e.value;
      } else {
        if (!!this.startTime && this.startTime >= e.value) {
          toast.showToast({
            content: '结束时间必须大于开始时间',
            mask: true,
          });
          return;
        }
        this.endTime = e.value;
      }
      // this.result(e.value, e.mode);
    },

    setstart() {
      this.startEnd = true;
      this.show = true;
    },

    setend() {
      this.startEnd = false;
      this.show = true;
    },

    /**
     * 确认获取数据
     */
    async confirmform() {
      const isnumber = !this.current;
      if (isnumber) {
        const [err, res] = await to(this.$refs.uForm.validate());
        if (err) {
          console.log(err, res);
          toast.showToast({
            content: '请输入整数',
            mask: true,
          });
          return;
        }
        if (this.form.number > 500) {
          toast.showToast({
            content: '最多获取500个,更多数据请上官网查看',
            // mask: true,
          });
          return;
        }
      } else {
        if (!(this.startTime && this.endTime)) {
          toast.showToast({
            content: '请选择时间',
            mask: true,
          });
          return;
        }
        if ((this.endTime - 60000 - this.startTime) / 86400000 >= 7) {
          toast.showToast({
            content: '最多获取七天数据,更大时间段数据请上官网查看',
            // mask: true,
          });
          return;
        }
      }

      // console.log('传递数据', {
      //   number: this.form.number,
      //   isnumber,
      //   startTime: this.startTime,
      //   endTime: this.endTime,
      // });
      const pages = application.getCurrentPages();
      const chartVm = pages[pages.length - 2].$vm;
      chartVm.init({
        number: this.form.number,
        isnumber,
        startTime: this.startTime,
        endTime: this.endTime,
      });
      this.$Router.back(1, {
        // success: (...arg) => {
        //   loading.showLoading();
        //   // console.log(this, '跳转成功', arg);
        // },
      });
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    this.$refs.uForm.setRules(this.rules);
    this.$refs.datetimePicker.setFormatter(this.formatter);
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
