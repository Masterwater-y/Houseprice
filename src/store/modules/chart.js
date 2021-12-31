const state = {
  factor: "" || sessionStorage.getItem("factor"),
  indexIdtoName: {
    x100: "最高价",
    x101: "最低价",
    x102: "中位数",
    x103: "平均数",
    x104: "众数",
    x105: "成交量",
    x106: "冷热指数"
  },
};
const getters = {
  factor: (state) => state.factor,
  indexIdtoName: (state) => state.indexIdtoName,
};
const mutations = {
  UPDATE_STATE_VALUE(state, params) {
    for (let key in params) {
      state[key] = params[key].value;
      if (params[key].session) {
        sessionStorage.setItem(key, JSON.stringify(params[key].value));
      }
    }
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
