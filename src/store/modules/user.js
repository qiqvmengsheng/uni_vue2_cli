import to from "await-to-js";
import { login, wxlogin, wxgetUserInfo } from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  setName,
  getName,
  removeName,
} from "@/utils/uniStorsge";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getName(),
    devices: [],
    avatar: "",
    systemrole: "",
  };
};

const state = getDefaultState();

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

const actions = {
  async wxlogin({ commit }, code) {
    const [err, response] = await to(apiwxlogin({ code }));
    if (err) {
      return Promise.reject(err);
    }
    if (response.data.code !== 200) {
      return Promise.reject(response);
    }
    // console.log(response.data);
    const { data } = response.data;
    commit("SET_TOKEN", data.token);
    setToken(data.token);
    commit("SET_NAME", data.name);
    setName(data.name);
    return Promise.resolve(response);
  },

  async login1({ commit }) {
    const [err, res] = await to(wxlogin());
    if (err) {
      console.log(err);
      return;
    }
    console.log("微信登录返回信息：", res);
    const code = res.code;

    const [err2, res2] = await to(wxgetUserInfo());
    if (err2) {
      console.log(err2);
      return;
    }
    console.log("用户信息：", res2);
    const userInfo = res2.userInfo;
    const { nickName, avatarUrl, gender, province, city, country } = userInfo;

    const [err1, res1] = await to(
      login({ code, nickName, gender, address: province + city })
    );
    if (err1) {
      console.log(err1);
      return;
    }
    console.log("登录自己网站成功：", res1);
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          if (response.data.code !== 200) {
            return Promise.reject(response);
          }
          // console.log(response.data);
          const { data } = response.data;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          commit("SET_NAME", data.username);
          setName(data.username);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // console.log(state.token, "\n", getToken());
      getdata(state.token)
        .then((response) => {
          const { data } = response.data;
          // console.log("store/getInfo", data);
          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { username, device, systemrole } = data;

          commit("SET_NAME", username);
          commit("SET_DEVICES", device);
          commit("SET_DEVICE", device[0]);
          commit("SET_SYSTEMROLR", systemrole);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      removeName();
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      removeName();
      commit("RESET_STATE");
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
