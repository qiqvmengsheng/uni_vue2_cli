<template>
  <div class="Download">
    <view class="cell">
      <u-cell-group>
        <u-cell
          title="历史范围"
          :value="cellvalue"
          :label="isnumber ? '按数量' : '按时间'"
        ></u-cell>
      </u-cell-group>
    </view>
    <view>
      <view class="tips">
        <text>
          点击下载数据会打开微信自带的文件预览页面，在文件预览页面点击右上角三个点，即可转发或保存到手机。
        </text>
      </view>
      <view class="btn">
        <u-button
          text="下载数据"
          type="primary"
          shape="circle"
          @click="download"
        ></u-button>
      </view>
    </view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import XLSX from 'xlsx';
import { application, toast } from '@uni/apis';
import { jsonClone } from '@/utils/disposalData';

export default {
  components: {},
  data() {
    return {
      dev: null,
      cellvalue: '',
      isNumber: false,
      chartVm: null,
    };
  },
  computed: {
    ...mapGetters(['name', 'devices']),
  },

  created() {
    const pages = application.getCurrentPages();
    const chartVm = pages[pages.length - 2].$vm;
    this.chartVm = chartVm;
    this.cellvalue = chartVm.cellvalue;
    this.isNumber = chartVm.isNumber;
    console.log(chartVm);
    this.$AppReady.then(() => {
      // console.log('收到参数', this.$Route.query);
      const id = this.$Route.query.deviceid;
      [this.dev] = this.devices.filter((dev) => dev.deviceid === id);
    });
  },
  methods: {
    /**
     * 下载数据
     */
    async download() {
      const data = jsonClone(this.chartVm.data);
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
      const name = `${this.dev.devicename}-${
        this.dev.deviceserial
      }-${uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh：MM：ss')}`;
      fs.writeFile({
        filePath: `${wx.env.USER_DATA_PATH}/${name}.xlsx`,
        data: wbout,
        success() {
          // console.log('写入成功->', res);
          // 打开新建的对应的文档
          wx.openDocument({
            filePath: `${wx.env.USER_DATA_PATH}/${name}.xlsx`,
            fileType: 'xlsx',
            showMenu: true,
            success() {
              // console.log('打开文档成功', r);
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

<style lang="scss" scoped>
.cell {
  background-color: #fff;
  margin-bottom: 20rpx;
}
// .Download {
// }
.btn {
  // position: relative;
  // top: 70%;
  width: 95%;
  margin: 30rpx auto;
}
.tips {
  padding: 10px;
  margin: 50px 10px 50px;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 4rpx 4rpx 10rpx 6rpx rgba(0, 0, 0, 0.1);
}
</style>
