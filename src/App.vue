<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';
</style>
<script>
import to from 'await-to-js';
import { mapActions } from 'vuex';

export default {
  created() {
    // console.log('开始登录');
    this.login();
  },
  mounted() {
    // console.log('程序页面挂载');
    this.$nextTick(() => {
      // 仅在整个视图都被渲染之后才会运行的代码
    });
  },
  onLaunch() {
    // 初始化完成时触发（全局只触发一次）
    // console.log('App Launch');
  },
  onShow() {
    // 启动，或从后台进入前台显示
    // console.log('App Show');
  },
  onHide() {
    // 从前台进入后台
    // console.log('App Hide');
  },
  watch: {},
  methods: {
    ...mapActions('user', ['wxlogin', 'getInfo']),
    /**
     * 微信自动登录
     */
    async login() {
      const [err, res] = await to(this.wxlogin());
      if (err) {
        console.log(err, res);
        return;
      }
      // console.log('登录返回信息：', res);
      this.getInfo();
    },
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
page {
  background: $uni-bg-color-grey;
}
</style>
