
import {createStore} from "vuex";
import app from "./modules/app";
import chart from "./modules/chart"
export default createStore({
  modules: {
    app,
    chart
  }
});
//session storage 浏览器关闭后清除
//local storage 需要手动清除
