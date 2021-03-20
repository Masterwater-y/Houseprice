import cookie from "cookie_js";
import { Login } from "@/api/login";
import {
  setToken,
  setUsername,
  getUsername,
  getToken,
  removeUsername,
  removeToken
} from "@/utils/app";

const app = {
  namespaced: true, //加命名空间解耦，如果不加只有state是局部变量,加了时候其他调用方式为 dispatch('app/setMenuStatus')
  state: {
    //调用： root.$store.state.count
    isCollapse:
      typeof cookie.get("iscollapse") == "boolean"
        ? cookie.get("iscollapse") === "boolean"
        : false, //json.parse将字符串转换为对象
    token: getToken() || "",
    username: getUsername() || ""
    //isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false //左边如果取不到就默认取false
  },
  getters: {
    //调用： root.$store.getters.count
    isCollapse: state => state.isCollapse,
    username: state => state.username
  },
  mutations: {
    SET_COLLAPSE(state) {
      state.isCollapse = !state.isCollapse;
      cookie.set("iscollapse", JSON.stringify(state.isCollapse));
      //sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse)) //html5本地存储
    },
    SET_TOKEN(state, value) {
      state.token = value;
    },
    SET_USERNAME(state, value) {
      state.username = value;
    },
    SET_COUNT(state, value) {
      //调用： root.$store.commit('SET_COUNT',200)
      state.count = value;
    }
  },
  actions: {
    setMenuStatus(content, data) {
      //content.state/getters/commit/rootGetters,data是外面传入的值
      content.commit("SET_COLLAPSE");
    },
    login(content, requestData) {
      return new Promise((resolve, reject) => {
        //接口放在这里
        Login(requestData)
          .then(response => {
            let res = response.data;
            console.log(res)
            content.commit("SET_TOKEN", res.token);
            content.commit("SET_USERNAME", res.username);
            setToken(res.token);
            setUsername(res.username);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    },
    exit() {
      return new Promise((resolve, reject) => {
        removeUsername();
        removeToken();
        resolve();
      });
    }
  }
};

export default app;
//session storage 浏览器关闭后清除
//local storage 需要手动清除
