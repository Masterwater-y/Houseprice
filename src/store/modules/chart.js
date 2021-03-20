const state = {
  factor: "" || sessionStorage.getItem("factor"),
};
const getters = {
  factor: (state) => state.factor,
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
