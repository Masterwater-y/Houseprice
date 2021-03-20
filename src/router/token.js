import router from "@/router/index";
import { getToken, removeToken, removeUsername } from "@/utils/app";
const whiteRouter = ["/login"]; //indexOf方法，判断数组中存在某一个值,不存在返回-1
router.beforeEach((to, from, next) => {
  if (from.path == "/Function/Chart") {
    console.log("here");
    sessionStorage.setItem("factor", null);
    next();
  }
  if (getToken()) {
    //路由动态添加，每个角色分配不同菜单
    if (to.path === "/login") {
      removeToken();
      removeUsername();
      //next("/index");
      next();
    } else {
      next();
    }
    console.log("存在Token");
  } else {
    console.log("存在不Token");
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login"); //路由指向
    }
  }
});
