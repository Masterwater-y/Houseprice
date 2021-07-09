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
      if (types == "x105") {
        return "套";
      } else {
        return "元/平米";
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

          seriesData.push({
            name: item + indexIdtoName[itemj],
            data: newData,

            type: "line",
          });
        }
      }
      //item.chart.clear();
      let option = {
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
/**      item.chart = echarts.init(Linechart.value);
      item.chart.clear();
      let option = {
        title:{
            // left:20,
            // top:10,
            padding:[10,0,5,20],
            textStyle:{
                color:'yellowgreen',
            },
            text:'营业额统计',
            subtext:'副标题'
        },
        legend: {
            top: 30,
            left:100
            // padding:[100,0,10,15]
        },
        tooltip:{//组件提示
            trigger:'axis',
            axisPointer:{
                type: 'cross'
            }
        },
        dataZoom:[
            {
                type:'slider',//slider表示有滑动块的，inside表示内置的
                show:true,
                xAxisIndex:[0],
                start:10,
                end:35
            }
        ],
        xAxis:{
            data:['23:00-8:00','8:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00']
        },

        yAxis:{},
        series:[
            {
                name:'销量',
                type: 'line',
                data:[100, 200, 150, 99, 43.3, 85.8, 93.7]
            },
            {
                name:'支付宝',
                type: 'line',
                data:[3.1, 258.4, 55.1, 0, 9, 50, 100,60]
            },
            {
                name:'会员卡',
                type: 'line',
                data:[0.4, 3.2, 82.5,30, 40, 300, 15, 10]
            }
        ]
    };**/
      item.chart.setOption(option);
    };
    onMounted(()=>{
      item.chart = echarts.init(Linechart.value, "macarons");
      console.log('finish onMounted')
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
