/* eslint no-shadow: [1, { "allow": ["state"] }] */
import to from 'await-to-js';
import { login, wxlogin, wxgetUserInfo, getdata } from '@/api/user';
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
});

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
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
    const [err, res] = await to(wxlogin());
    if (err) {
      console.log(err);
      return Promise.reject(err);
    }
    console.log('微信登录返回信息：', res);
    const { code } = res;

    const [err1, res1] = await to(wxgetUserInfo());
    if (err1) {
      console.log(err1);
      return Promise.reject(err1);
    }
    console.log('用户信息：', res1);
    const { userInfo } = res1;
    const { nickName, avatarUrl, gender, province, city, country } = userInfo;

    const [err2, res2] = await to(
      login({ code, nickName, gender, address: province + city })
    );
    if (err2) {
      console.log(err2);
      return Promise.reject(err2);
    }
    console.log('登录自己网站成功：', res2);
    const { token, username } = res2.data.data;
    commit('SET_TOKEN', token);
    commit('SET_NAME', username);
    try {
      setToken(token);
      setName(username);
    } catch (e) {
      console.log(e);
    }
    return Promise.resolve({
      token,
      username,
      nickName,
      avatarUrl,
      gender,
      province,
      city,
      country,
    });
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
    const [err, res] = await to(getdata());
    if (err) {
      console.log('获取用户信息出错', err);
      return Promise.reject(err);
    }
    console.log('获取用户信息：', res);
    const { data } = res.data;
    const { username, device, systemrole } = data;
    commit('SET_NAME', username);
    commit('SET_DEVICES', device);
    commit('SET_SYSTEMROLR', systemrole);
    return Promise.resolve(data);
    // return new Promise((resolve, reject) => {
    //   // console.log(state.token, "\n", getToken());
    //   getdata(state.token)
    //     .then((response) => {
    //       // console.log("store/getInfo", data);
    //       if (!data) {
    //         return reject(
    //           new Error('Verification failed, please Login again.')
    //         );
    //       }

    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
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
