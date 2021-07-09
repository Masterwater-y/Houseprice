import router from "@/router/index";
import { getToken, removeToken, removeUsername } from "@/utils/app";
import { ElMessage } from "element-plus";

const whiteRouter = ["/login","/Function/Chart","/Function/Listed","/Function/HotHouseType","/index"]; //indexOf方法，判断数组中存在某一个值,不存在返回-1
router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('factor'))
    sessionStorage.setItem("factor", null);
  if (from.path == "/Function/Chart"||from.path == "/Function/Listed") {

    sessionStorage.setItem("factor", null);

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
    console.log("不存在Token");
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      ElMessage.error({
        type:'error',
        message:'未登录或无权限'
      })
      next("/login"); //路由指向
    }
  }
});
