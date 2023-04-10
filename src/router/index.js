/* global ROUTES:writable */
import { RouterMount, createRouter } from 'uni-simple-router';

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  applet: {
    animationDuration: 300, // 默认 300ms  v2.0.6+
  },
  routes: [...ROUTES],
});

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  next();
});

// 全局路由后置守卫
router.afterEach((to, from) => {
  // console.log('跳转结束', from);
});

export { router, RouterMount };
