/* eslint no-shadow: [1, { "allow": ["state"] }] */
import to from 'await-to-js';
import { login, getdata, finduderinfo } from '@/api/user';
import {
  getToken,
  setToken,
  removeToken,
  setName,
  getName,
  removeName,
} from '@/utils/uniStorsge';

const getDefaultState = () => ({
  token: getToken(),
  name: getName(),
  devices: [],
  avatar: '',
  systemrole: '',
  userInfo: {},
});

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
    // state = { ...state, ...getDefaultState() };
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_DEVICES: (state, devices) => {
    state.devices = devices;
  },
  SET_SYSTEMROLR: (state, systemrole) => {
    state.systemrole = systemrole;
  },
};

const state = getDefaultState();

const actions = {
  /**
   * 获取微信code登录
   */
  async wxlogin({ commit }) {
    // const [err1, res1] = await to(
    //   uni.getProvider({
    //     service: 'oauth',
    //   })
    // );
    // console.log(err1, res1);
    const [err, res] = await to(
      uni.login({
        provider: 'weixin',
      })
    );
    if (err) {
      console.log(err);
      return Promise.reject(err);
    }
    // console.log('微信登录返回信息：', res);, nickName: '', gender: 1, address: ''
    const { code } = res;
    const [err2, res2] = await to(login({ code }));
    if (err2) {
      console.log(err2);
      return Promise.reject(err2);
    }
    const { token, username } = res2.data.data;
    commit('SET_TOKEN', token);
    commit('SET_NAME', username);
    try {
      setToken(token);
      setName(username);
    } catch (e) {
      console.log(e);
    }
    return Promise.resolve({ token, username });
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then((response) => {
          if (response.data.code !== 200) {
            return Promise.reject(response);
          }
          // console.log(response.data);
          const { data } = response.data;
          commit('SET_TOKEN', data.token);
          setToken(data.token);
          commit('SET_NAME', data.username);
          setName(data.username);
          resolve(response);
          return Promise.resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  async getInfo({ commit }) {
    const [err, res] = await to(Promise.all([getdata(), finduderinfo()]));
    if (err) {
      console.log('获取用户信息出错', err);
      return Promise.reject(err);
    }
    // console.log('获取用户设备：', res);
    const { data } = res[0].data;
    const { username, device, systemrole } = data;
    commit('SET_INFO', res[1].data);
    commit('SET_NAME', username);
    commit('SET_DEVICES', device);
    commit('SET_SYSTEMROLR', systemrole);
    return Promise.resolve(data);
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      removeName();
      commit('RESET_STATE');
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      removeName();
      commit('RESET_STATE');
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
