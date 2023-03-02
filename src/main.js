import Vue from 'vue';
// 引入uView组件库
import uView from 'uview-ui';
import App from './App';
import store from './store';

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
app.$mount();
