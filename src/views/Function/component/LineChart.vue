<template>
  <div
    :class="className"
    ref="Linechart"
    :style="{ width: width, height: '600px' }"
  ></div>
</template>

<script>

import { ref, reactive } from "vue";
require("echarts/theme/macarons"); // echarts 主题
import * as echarts from 'echarts'
export default {
  name: "LineChart",
  setup(props) {
    const item = reactive({
      chart: null
    });
    const Linechart=ref(null)
    const initChart = data => {
      let dateList = data.dateList;
      let dataList = data.dataList;
      let legendList = [];
      let seriesData = [];

      for (let item in dataList) {
        legendList.push(item);
        seriesData.push({
          name: item,
          data: dataList[item],
          type: "line"
        });
      }

      item.chart = echarts.init(Linechart.value, "macarons");
      let option = {
        xAxis: {
          type: "category",
          data: dateList
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: legendList
        },
        series: seriesData,
        title: {
          text: "房价走势",
          textStyle: {
            fontStyle: "normal",
            color: "black",
            fontWeight: "bolder",
            fontSize: 32
          },
          textAlign: "auto"
        },
        tooltip: {
          trigger: "axis"
        }
      };
      item.chart.setOption(option);
    };
    return {
      initChart,
      Linechart
    };
  },
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  margin-top: 40px;
}
</style>
