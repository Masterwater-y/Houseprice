<template>
  <!--这里不要加<div></div>-->
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import { reactive, ref, computed } from "vue"
export default {
  name: "svg-icon",
  props: {
    iconClass: {
      type: String,
      required: true,
      default: "" // 如果type是对象类型要用函数赋值 如tyoe=Array  default=()=>[]
    },
    className: {
      //方便统一做CSS
      type: String,
      default: ""
    }
  },
  setup(props) {
    const msg = ref("Test");
    const iconName = computed(() => `#icon-${props.iconClass}`);

    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`; // `${}`模板字符串
      } else {
        return `svg-icon`;
      }
    });
    return {
      msg,
      iconName,
      svgClass
    };
  }
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
