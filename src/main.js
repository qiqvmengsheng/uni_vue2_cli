import Vue from 'vue';
// 引入uView组件库
import uView from 'uview-ui';
import App from './App';
import { router } from './router'; // 路径换成自己的
import store from './store';
Vue.use(router);
Vue.use(uView);

Vue.config.productionTip = false;

App.mpType = 'app';

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

uni.addInterceptor({
  returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise((resolve, reject) => {
      res.then((res1) => {
        if (res1[0]) {
          reject(res1[0]);
        } else {
          resolve(res1[1]);
        }
      });
    });
  },
});

const app = new Vue({
  store,
  ...App,
});

// v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
// RouterMount(app, router, '#app');
// #endif

// #ifndef H5
app.$mount(); // 为了兼容小程序及app端必须这样写才有效果
// #endif
