<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#main-wrap {
  height: 100vh;
  //position: fixed;
  //padding: 30px;
  //border: 30px solid bisque;
  // border-bottom: none;
  //left:$navMenu;
  //top: 75px;
  // width: 100%;
  //height: 100vh;
  //-webkit-box-sizing: border-box;
}
.main-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  box-sizing: border-box;
  @include webkit(transition, all 0.3s ease 0s);
  @include webkit(box-sizing, border-box);
}
.content {
  width: 100%;
  height: 100%;

  padding-top: 30px;
  padding-left: 30px;

  box-sizing: border-box;
  background-color: #ffffff;
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
</style>
