<template>
  <div
    :class="className"
    ref="Linechart"
    :style="{ width: width, height: '600px' }"
  ></div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
require("echarts/theme/macarons"); // echarts 主题
import * as echarts from "echarts";


import { useStore } from "vuex";


export default {
  name: "LineChart",
  setup(props) {
    const item = reactive({
      chart: null,
    });
    const store = useStore();
    const Linechart = ref(null);
    const toolTipText = (types) => {
      if (types === "x105") {
        return "套";
      } else if (types=="x106") {
        return "";
      }else{
        return "元/平米"
      }
    };
    const initChart = (data) => {
      console.log('start init')
      let dateList = data.dateList;
      let dataList = data.dataList;
      let indexIdtoName = store.getters["chart/indexIdtoName"];

      let legendList = [];
      let seriesData = [];

      for (let item in dataList) {
        for (let itemj in dataList[item]) {
          legendList.push(item + indexIdtoName[itemj]);

          let now = dataList[item];
          let head = now[itemj][0];
          let maxdata = Math.max(...now[itemj]);
          let newData = now[itemj].map((item) => {
            return {
              value: item / maxdata,
              price: item,
              type: itemj,
              incRate: (item / head - 1) * 100,
            };
          });
          if (itemj=="x106"){
            seriesData.push({
              name: item + indexIdtoName[itemj],
              data: newData,
              type: "bar",
            });
          }
          seriesData.push({
            name: item + indexIdtoName[itemj],
            data: newData,
            type: "line",
          });
        }
      }

      let option={}

      //item.chart.clear();
      option = {
        xAxis: {
          type: "category",
          data: dateList,
        },
        yAxis: {
          type: "value",
        },
        toolbox: {
          // feature 各工具配置项: dataZoom 数据区域缩放;restore 配置项还原;saveAsImage下载为图片;
          feature: {
            dataZoom: {
             // yAxisIndex: "none", // y轴不缩放，Index默认为0
            },
            saveAsImage: {},
          },
        },
       dataZoom: [{
          type: 'slider',
          show: true,
          height: 20,
          left: '10%',
          right: '10%',
          bottom: '2%',
          realtime:true,
          start: 0,
          end: 100,
          textStyle: {
            color: '#d4ffff',
            fontSize: 11
          }
        }, {
          type: 'inside'
        }],
        legend: {
          data: legendList,
        },
        series: seriesData,
        title: {
          text: "房价走势",
          textStyle: {
            fontStyle: "normal",
            color: "black",
            fontWeight: "bolder",
            fontSize: 32,
          },
          textAlign: "auto",
        },
        tooltip: {
          trigger: "item",
          formatter: function (a, b) {
            return `<span style="color:white">${a.seriesName} <br/> ${
              a.name
            }：${a.data.price}${toolTipText(
              a.data.type
            )} <br/> <span style="color:#ff0000">涨幅：${a.data.incRate.toFixed(
              2
            )}%</span></span> `;
          },
        },
      };

      item.chart.setOption(option);//true不合并配置
    };
    onMounted(()=>{
      if (!echarts.getInstanceByDom(Linechart.value)) item.chart = echarts.init(Linechart.value, "macarons");
      else item.chart = echarts.getInstanceByDom(Linechart.value)



    })
    return {
      initChart,
      Linechart,
    };
  },
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
  },
};
</script>
<style lang="scss" scoped>
div {
  margin-top: 40px;
}
</style>
