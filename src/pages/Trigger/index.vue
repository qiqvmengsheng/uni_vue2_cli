<template>
  <div class="Trigger">
    <view class="tips">
      触发告警是当设备测量的数据满足了设定的条件时就会发邮件提醒。本功能必须填了邮箱才能使用。
    </view>
    <view class="title">
      <view>触发条件</view>
    </view>
    <view class="cell">
      <u-cell-group>
        <template v-for="(item, index) in triggers">
          <u-cell
            :key="index"
            :title="title[item.datastreamsid].text"
            :value="`${item.threshold} ${title[item.datastreamsid].unit}`"
            isLink
            :label="`${item.type} ${label[item.type]}`"
            @click="handleDelete(index, item)"
          ></u-cell>
        </template>
      </u-cell-group>
    </view>

    <view v-if="triggers.length === 0">
      <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
      </u-empty>
    </view>

    <view class="btn">
      <u-button
        text="添加触发"
        type="primary"
        shape="circle"
        @click="show = true"
      ></u-button>
    </view>

    <u-modal
      :show="show"
      :title="`添加触发`"
      closeOnClickOverlay
      @close="this.show = false"
      @confirm="handleAdd"
    >
      <view>
        <u-form :model="trigger" ref="uForm" :rules="rules" labelWidth="100">
          <u-form-item
            label="数据类型"
            prop="ds_id"
            borderBottom
            @click="actionDsId"
            ref="ds_id"
          >
            <u-input
              v-model="title[trigger.ds_id].text"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择类型"
              border="none"
            ></u-input>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item
            label="触发类型"
            prop="type"
            borderBottom
            @click="action"
            ref="type"
          >
            <u-input
              v-model="trigger.type"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择类型"
              border="none"
            ></u-input>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item
            label="触发值"
            prop="threshold"
            @click="showDevtype = true"
            ref="threshold"
          >
            <u-input
              placeholder="请输入触发值"
              type="number"
              border="surround"
              v-model.number="trigger.threshold"
            >
              <template slot="suffix">
                <u-text
                  :text="title[datastreams].unit"
                  margin="0 3px 0 0"
                  type="tips"
                ></u-text>
              </template>
            </u-input>
          </u-form-item>
        </u-form>
      </view>
    </u-modal>
  </div>
</template>

<script>
// datastreamsid: "Radon"
// deviceId: "900407231"
// id: 55
// threshold: "50000"
// triggerid: "lzq900407231Radon>50000"
// type: ">"
import to from 'await-to-js';
import { mapGetters } from 'vuex';
import { actionSheet, confirm, toast } from '@uni/apis';
import { querytrigger, addtrigger, deletetrigger } from '@/api/trigger';

export default {
  components: {},
  data() {
    return {
      show: false,
      deviceid: '',
      dev: null,
      triggers: [],
      datastreams: '',
      trigger: {
        dev_ids: '',
        ds_id: '',
        threshold: '',
        type: '',
      },
      label: {
        '<': '数据小于时触发',
        '=': '数据等于时触发',
        '>': '数据大于时触发',
        '<=': '数据小于等于时触发',
        '>=': '数据大于等于时触发',
      },
      title: {
        Radon: { text: '氡浓度', unit: 'Bq/m³' },
        Thoron: { text: '钍浓度', unit: 'Bq/m³' },
        temperature: { text: '温度', unit: '℃' },
        Pressure: { text: '大气压', unit: 'mbar' },
        humidity: { text: '相对湿度', unit: '％' },
      },
      rules: {
        threshold: [
          {
            // type: 'number',
            required: true,
            pattern: /^[\d]+$/,
            message: '必须填整数',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['devices']),
  },
  created() {
    this.$AppReady.then(() => {
      this.deviceid = this.$Route.query.deviceid;
      this.trigger.dev_ids = this.deviceid;
      this.datastreams = this.$Route.query.datastreams;
      this.trigger.ds_id = this.datastreams;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === this.deviceid);
      // console.log('设备页面', this.dev);
      this.gettrigger();
    });
  },
  methods: {
    async gettrigger() {
      const [err, res] = await to(
        querytrigger({ deviceId: this.dev.deviceid })
      );
      if (err) {
        console.log(err);
        return;
      }
      // console.log(res);
      if (res.data.code === 200) {
        this.triggers = res.data.data;
        // res.data.data.filter((i) => i.datastreamsid === this.datastreams);
        // console.log(res.data.data);
      }
    },

    /**
     * 选择触发类型
     */
    action() {
      // console.log(e);
      const types = ['<', '=', '>', '<=', '>='];
      actionSheet({
        itemList: types,
      }).then((res) => {
        if (res.tapIndex !== -1) this.trigger.type = types[res.tapIndex];
        // this.$Router.push({
        //   name: route[res.tapIndex],
        //   params: { deviceid: this.dev.deviceid, datastreams: this.value },
        // });
      });
    },

    /**
     * 选择数据类型
     */
    actionDsId() {
      // console.log(e);
      const label = ['Radon', 'Thoron', 'temperature', 'Pressure', 'humidity'];
      const types = ['氡浓度', '钍浓度', '温度', '大气压', '相对湿度'];
      actionSheet({
        itemList: types,
      }).then((res) => {
        if (res.tapIndex !== -1) this.trigger.ds_id = label[res.tapIndex];
        // this.$Router.push({
        //   name: route[res.tapIndex],
        //   params: { deviceid: this.dev.deviceid, datastreams: this.value },
        // });
      });
    },

    /**
     * 校验并且添加触发器
     */
    async handleAdd() {
      const [e, r] = await to(this.$refs.uForm.validate());
      if (e) {
        console.log(e, r);
        return;
      }
      // console.log(this.trigger);
      const [err, res] = await to(addtrigger({ ...this.trigger }));
      if (err) {
        console.log(err, res);
        return;
      }
      // console.log(res);
      if (res.data.code === 200) {
        await this.gettrigger();
        toast.showToast({
          content: '添加成功！',
          type: 'success',
        });
        this.show = false;
      } else {
        toast.showToast(res.data.msg);
      }
    },

    /**
     * 删除触发器
     */
    async handleDelete(index, item) {
      // console.log(item);
      const r = await confirm({
        title: '提示',
        content: `确认删除${this.title[item.datastreamsid].text} ${item.type} ${
          item.threshold
        }时的触发条件？`,
      });
      if (r.cancel) {
        return;
      }
      const [err, res] = await to(deletetrigger({ triggerid: item.triggerid }));
      if (err) {
        console.log(err, res);
        return;
      }
      if (res.data.code === 200) {
        await this.gettrigger();
        toast.showToast({
          content: '删除成功！',
          type: 'success',
        });
      } else {
        toast.showToast(res.data.msg);
      }
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
.title {
  margin: 10rpx 0;
  font-size: 20px;
  display: flex;
  /* 主轴空位分配方式justify-content */
  justify-content: center;
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

.tips {
  padding: 10px;
  margin: 0 10px 10px;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 4rpx 4rpx 10rpx 6rpx rgba(0, 0, 0, 0.1);
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
