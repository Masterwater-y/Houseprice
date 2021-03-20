<template>
  <div id="nav-wrap">
    <h1 class="logo"><img src="@/assets/logo.png" alt="" /></h1>

    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      router
    >
      <template v-for="(item, index) in routers">
        <!-- v-for 和 v-if 分开, id属性要有具体的控件 -->
        <el-submenu v-if="item.hidden" :key="item.id" :index="index + ''">
          <template #title>
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span>{{ item.meta.name }}</span>
          </template>
          <!-- 子级菜单-->
          <el-menu-item
            v-for="(subItem, index) in item.children"
            :key="subItem.id"
            :index="subItem.path"
            >{{ subItem.meta.name }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "navMenu",
  setup(props) {
    //data
    const router = useRouter();
    const store = useStore();
    //const routers = reactive(router.options.routes);
    const routers = router.options.routes;
    console.log(routers);
    //function
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    //computed 监听isCollapse
    const isCollapse = computed(() => store.state.app.isCollapse);

    return {
      handleOpen,
      handleClose,
      routers,
      isCollapse,
    };
  },
};
</script>

<style lang="scss" scoped>
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #2c3e50;
  @include webkit(transition, all 0.3s ease 0s);

  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}

.logo {
  text-align: center;

  img {
    width: 92px;
  }
}

.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  img {
    width: 45px;
  }
}

.open {
  #nav-wrap {
    width: $navMenu;
    img {
      width: 92px;
    }
  }
}
</style>
