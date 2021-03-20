<template>
  <div :class="className" ref="asd" :style="{ width: width, height: '400px' }"></div>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts 主题

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(radius, pieDataName, pieData) {
      this.chart = echarts.init(this.$refs['asd'], "macarons");
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 20,
          top: 80,
          data: pieDataName
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: [radius, "60%"],
            center: ["45%", "53%"],
            data: pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>
