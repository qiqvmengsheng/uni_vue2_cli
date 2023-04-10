const getters = {
  // sidebar: (state) => state.app.sidebar,
  // device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  devices: (state) => state.user.devices,
  systemrole: (state) => state.user.systemrole,
  // device: (state) => state.user.device,
  name: (state) => state.user.name,
  userInfo: (state) => state.user.userInfo,
  // addRouters: (state) => state.permission.addRouters,
  // routers: (state) => state.permission.routers,
  // fileTree: (state) => state.fileTree.file_tree,
};
export default getters;
