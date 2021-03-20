<template>
  <div id="layout" :class="menuStatus ? 'close' : 'open'">
    <LayoutHeader />
    <LayoutMain />
    <LayoutNav />
  </div>
</template>

<script>
import LayoutHeader from "./Components/Header";
import LayoutMain from "./Components/Main";
import LayoutNav from "./Components/Nav";
import { reactive, ref, computed } from "vue";
import {useStore} from "vuex"
export default {
  name: "layout",
  components: { LayoutHeader, LayoutMain, LayoutNav },
  setup(props) {
    const store=useStore()
    const menuStatus = computed(() => store.state.app.isCollapse);
    return {
      menuStatus
    };
  }
};
</script>

<style lang="scss" scoped>
#layout {
  background-color: #f7f7f7;
}
</style>
