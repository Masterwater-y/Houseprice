import { createRouter, createWebHashHistory } from "vue-router";

import Layout from "@/views/Layout/index"; // 可以用 @/views/Layout/  默认找index

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "index",
    hidden: false,
    meta: {
      name: "首页",
    },
  },

  {
    path: "/login",
    name: "Login",
    hidden: false,
    meta: {
      name: "登录",
    },
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "主页",
      icon: "console",
    },
    hidden: true,
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "主页",
          icon: "console",
        },
        component: () => import("../views/Console/index.vue"),
      },
    ],
  },
  {
    path: "/Function",
    name: "Function",
    meta: {
      name: "工具箱",
      icon: "info",
    },
    hidden: true,
    component: Layout,
    children: [
      {
        path: "/Function/Chart",
        name: "Chart",
        meta: {
          name: "房价走势",
          icon: "info",
        },
        component: () => import("../views/Function/chart.vue"),
      },
      {
        path: "/Function/Listed",
        name: "Listed",
        meta: {
          name: "挂牌价跟踪",
        },
        component: () => import("../views/Function/listed.vue"),
      },
      {
        path: "/Function/HotHouseType",
        name: "HotHouseType",
        meta: {
          name: "热门房型",
        },
        component: () => import("../views/Function/hotHouseType.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "User",
    meta: {
      name: "个人中心",
      icon: "user",
    },
    redirect: "user",
    hidden: true,
    component: Layout,
    children: [
      {
        path: "/userFavour",
        name: "UserFavour",
        meta: {
          name: "关注走势",
        },
        component: () => import("../views/User/favour.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
