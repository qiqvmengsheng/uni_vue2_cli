<template>
  <div class="chartView">
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="显示数据量"
          :value="form.number"
          isLink
          :disabled="disabled"
        ></u-cell>
      </u-cell-group>
    </view>

    <!-- <view class="card">
          @click="
            $Router.push({
              name: 'DataQuantity',
              params: { number: form.number },
            })
          "
      <uni-card>
        <text>
          这是一个基础卡片示例，内容较少，此示例展示了一个没有任何属性不带阴影的卡片。</text
        >
      </uni-card>
    </view> -->
    <view class="card" v-show="datastreams === 'Radon'">
      <RadonChart
        class="echart"
        ref="radonchar"
        :barUpdate="barUpdate"
      ></RadonChart>
    </view>
    <view class="card" v-show="showBarChart && datastreams === 'Radon'">
      <BarChart class="echart" ref="barchar"></BarChart>
    </view>
    <view class="card" v-show="datastreams === 'Thoron'">
      <ThoronChart class="echart" ref="Thoronchar"></ThoronChart>
    </view>
    <view class="card" v-show="datastreams === 'temperature'">
      <TempChart class="echart" ref="TempChart"></TempChart>
    </view>
    <view class="card" v-show="datastreams === 'humidity'">
      <RHChart class="echart" ref="RHChart"></RHChart>
    </view>
    <view class="card" v-show="datastreams === 'Pressure'">
      <PressureChart class="echart" ref="PressureChart"></PressureChart>
    </view>

    <view v-show="showBarChart">
      <view class="btn">
        <u-button
          text="隐藏能谱"
          type="primary"
          shape="circle"
          @click="showBarChart = false"
          :disabled="!isOpen"
        ></u-button>
      </view>
    </view>
    <view v-show="datastreams === 'Radon'" class="tips">
      <text>
        点击图表内显示对应数据点能谱，缩放图表显示范围内能谱，点击图表外隐藏能谱。
      </text>
    </view>
    <view>
      <view class="btn">
        <u-button
          text="下载数据"
          type="primary"
          shape="circle"
          @click="download"
          :disabled="!isOpen"
        ></u-button>
      </view>
      <view class="tips">
        <text>
          点击下载数据会打开微信自带的文件预览页面，在文件预览页面点击右上角三个点，即可转发或保存到手机。
        </text>
      </view>
    </view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import to from 'await-to-js';
// eslint-disable-next-line import/no-extraneous-dependencies
import XLSX from 'xlsx';
import { jsonClone } from '@/utils/disposalData';
import { toast, file } from '@uni/apis';
import { measuredGetdata, getlastDatas } from '@/api/devdata';
import { devSettingGetmark } from '@/api/devParamSetting';
import RadonChart from './RadonChart';
import ThoronChart from './ThoronChart';
// import Tempera from './temperature';
import TempChart from './TempChart';
import RHChart from './RHChart';
import PressureChart from './PressureChart';
import BarChart from './BarChart';

let that = null;
export default {
  components: {
    RadonChart,
    ThoronChart,
    TempChart,
    RHChart,
    PressureChart,
    BarChart,
  },
  data() {
    return {
      form: { number: 100 },
      data: null,
      datastreams: '',
      showBarChart: false,
      isOpen: false,
      dev: null,
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
  },
  beforeRouteEnter(toa, from, next) {
    console.log('回跳转', toa, from);
    // previousRouterName = from.name;
    // if (from.name === "transportationTransferList") {
    //   selectUser = from.params.user;
    // }
    next();
  },
  created() {
    that = this;
    this.$AppReady.then(() => {
      console.log('收到参数', this.$Route.query);
      this.datastreams = this.$Route.query.datastreams;
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
      console.log('获得dev', this.dev);
      this.getdata();
      this.getmakings();
    });
  },
  methods: {
    /**
     * 获取标线信息
     */
    async getmakings() {
      const [err, res] = await to(
        devSettingGetmark({ deviceid: this.dev.deviceid })
      );
      if (err) {
        console.log(err);
        return;
      }
      // console.log(res);
      this.marks = [];
      [...res.data].forEach((item) => {
        this.marks.push({ ...item });
      });
      console.log('标线信息', [...this.marks]);
      // if (
      //   this.systemrole === 'superadmin' ||
      //   this.systemrole === 'normaladmin'
      // ) {
      //   // console.log(this.$refs.paramsetting);
      //   this.$refs.paramsetting.updateMark(this.marks);
      // }
    },

    /**
     * 下载数据
     */
    async download() {
      const data = jsonClone(this.data);
      for (let i = 0, len = data.RadonAt.length; i < len; i += 1) {
        data.RadonAt[i] = ` ${data.RadonAt[i].toString()}`;
      }
      // 表头
      const header = {
        Data_ID: 'Data_ID',
        RadonAt: 'time',
        Radon: 'Radon',
        FastRadon: 'Radon',
        Thoron: 'Thoron',
        temperature: 'temperature',
        Pressure: 'Pressure',
        humidity: 'humidity',
        Sample_Interval: 'Sample_Interval',
        RadonError: 'RadonError',
        ThoronError: 'ThoronError',
      };
      for (let i = 1; i <= 38; i += 1) {
        header[`Plot_${i}`] = `Plot_${i}`;
      }
      const keys = Object.keys(header).filter((item) =>
        Object.prototype.hasOwnProperty.call(data, item)
      );
      const xlsxjson = [];
      // let csvString = '';
      // keys.forEach((item) => {
      //   csvString += `${header[item]},`;
      // });
      // csvString += '\r\n';
      for (let i = data.RadonAt.length - 1; i >= 0; i -= 1) {
        const xlsxobj = {};
        // eslint-disable-next-line no-loop-func
        keys.forEach((item) => {
          // csvString += `${data[item][i]},`;
          if (item === 'RadonAt') {
            xlsxobj.time = data[item][i];
          } else {
            xlsxobj[item] = data[item][i];
          }
        });
        xlsxjson.push(xlsxobj);
        // csvString += '\r\n';
      }

      // let i = data.RadonAt.length - 1;
      // while (i >= 0) {
      //   keys.forEach((item) => {
      //     csvString += `${data[item][i]},`;
      //   });
      //   csvString += '\r\n';
      //   i -= 1;
      // }
      // csvString = `data:application/csv;charset=utf-8,\ufeff${encodeURIComponent(
      //   csvString
      // )}`;

      const xlsx = XLSX.utils.json_to_sheet(xlsxjson);
      // console.log(xlsxjson, '生成数据', xlsx);

      /* 新建空workbook */
      const wb = XLSX.utils.book_new();
      /* 添加worksheet，当然你可以添加多个，这里我只添加一个 */
      XLSX.utils.book_append_sheet(wb, xlsx, 'result');

      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array',
      });

      // 新建个文档，并写入数据
      const fs = wx.getFileSystemManager();
      console.log('对象file', { ...file });
      const name = `${this.dev.devicename}-${
        this.dev.deviceserial
      }-${uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh：MM：ss')}`;
      // console.log(uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'));
      fs.writeFile({
        filePath: `${wx.env.USER_DATA_PATH}/${name}.xlsx`,
        data: wbout,
        success(res) {
          console.log('写入成功->', res);
          // 打开新建的对应的文档
          wx.openDocument({
            filePath: `${wx.env.USER_DATA_PATH}/${name}.xlsx`,
            fileType: 'xlsx',
            showMenu: true,
            success(r) {
              console.log('打开文档成功', r);
            },
            fail(r) {
              toast.showToast({
                type: 'fail',
                content: '失败',
                mask: true,
              });
              console.log('打开文档失败->', r);
            },
          });
        },
        fail(res) {
          toast.showToast({
            type: 'fail',
            content: '失败',
            mask: true,
          });
          console.log('写入失败->', res);
        },
      });
    },

    /**
     * 获取数据
     */
    async getdata() {
      this.isOpen = false;
      const [err, res] = await to(
        getlastDatas({
          deviceid: this.dev.deviceid,
          numbers: 100,
        })
      );
      if (err) {
        console.log('获取服务器数据错误：\n', err);
        this.isOpen = true;
        return Promise.reject(err);
      }
      // console.log('获取服务器数据：\n', res);
      const { datastreams } = res.data.data;
      const data = { RadonAt: [] };
      const keys = Object.keys(datastreams);
      for (let i = 0, len = keys.length; i < len; i += 1) {
        data[keys[i]] = [];
        datastreams[keys[i]].forEach((item) => {
          data[keys[i]].push(+item.value);
        });
        data[keys[i]].reverse();
      }
      datastreams.Radon.forEach((item) => {
        data.RadonAt.push(item.at);
      });
      data.RadonAt.reverse();

      if (this.data && this.data.Map) data.Map = this.data.Map;
      this.data = { ...this.data, ...data };
      console.log(this.data);
      this.update(this.data);
      this.isOpen = true;
      return Promise.resolve(data);
    },
    async getdevdata() {
      const [err, res] = await to(
        measuredGetdata({
          deviceId: this.dev.deviceid,
          apikey: this.dev.apikey,
        })
      );
      if (err) {
        console.log(err, res);
        return;
      }
      console.log(res);
    },

    update(data) {
      console.log(this.$refs);
      this.$refs.radonchar.update(data);
      this.$refs.Thoronchar.update(data);
      this.$refs.TempChart.update(data);
      this.$refs.RHChart.update(data);
      this.$refs.PressureChart.update(data);
    },

    barUpdate({ zoomStart, zoomEnd, show }) {
      // console.log('标线', that.data?.Radon?.length);
      if (!that.data?.Radon?.length || that.data.Radon.length === 0) {
        console.log(that.data);
        return;
      }
      that.showBarChart = show;
      if (!show) return;
      that.$refs.barchar.update({
        datas: that.data,
        startValue: zoomStart,
        endValue: zoomEnd,
        marks: that.marks,
      });
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
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

<style scoped lang="scss">
.cell {
  background-color: #fff;
  margin-bottom: 20rpx;
}
.chart {
  width: 730rpx;
  height: 700rpx;
}
.card {
  background-color: #fff;
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  height: 300px;
  box-shadow: 0rpx 0rpx 3px 1px rgba(0, 0, 0, 0.08);
}

.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
.tips {
  padding: 0 10px;
  margin-bottom: 10px;
  background-color: $uni-bg-color-grey;
}
</style>

<style lang="scss">
page {
  background: $uni-bg-color-grey;
}
</style>
