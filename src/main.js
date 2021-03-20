import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

import * as echarts from "echarts";
//svg解析
import "./assets/icon/index";
//svg全局组件
import SvgIcon from "@/assets/icon/Svg-icon";
import "./router/token";
const app = createApp(App);
app.use(store).use(router).use(ElementUI);
app.component("svg-icon", SvgIcon);
app.echarts = echarts;
app.mount("#app");
