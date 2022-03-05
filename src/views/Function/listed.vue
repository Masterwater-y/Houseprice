<template>
  <div>
    <div class="main-filter">
      <div class="period">
        <h3>周期</h3>
        <el-select
          v-model="data.period_type"
          placeholder="请选择"
          @change="getListedData"
        >
          <el-option
            v-for="(item, index) in data.period_options"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="block" @change="getListedData">
        <h3>小区</h3>
        <el-checkbox-group v-model="data.block_box_group" size="mini">
          <el-checkbox-button
            v-for="items in data.blockOptions"
            :label="items.blockId"
            :key="items.blockId"
            >{{ items.blockname }}</el-checkbox-button
          >
        </el-checkbox-group>
      </div>
      <div class="time">
        <h3>时间范围</h3>
        <el-date-picker
          v-model="data.time_start_value"
          type="date"
          :format="time_input_format"
          :placeholder="time_input_placeholder"
          @change="getListedData"
        >
        </el-date-picker>
        ~
        <el-date-picker
          v-model="data.time_end_value"
          type="date"
          :format="time_input_format"
          :placeholder="time_input_placeholder"
          @change="getListedData"
        >
        </el-date-picker>
      </div>
      <div class="index">
        <h3>房价指标</h3>
        <el-radio-group v-model="data.index_value" @change="getListedData">
          <el-radio-button label="x100">最高价</el-radio-button>
          <el-radio-button label="x101">最低价</el-radio-button>
          <el-radio-button label="x102">中位数</el-radio-button>
          <el-radio-button label="x103">平均数</el-radio-button>
          <el-radio-button label="x104">众数</el-radio-button>
          <el-radio-button label="x105">成交量</el-radio-button>
        </el-radio-group>
      </div>
      <div class="more" @click="click_more" v-if="!data.filter_more_flag">
        更多选项
        <span class="arrow down"></span>
      </div>
      <div class="filter-more" v-if="data.filter_more_flag">
        <div class="toward">
          <h3>朝向</h3>
          <el-checkbox-group
            v-model="data.toward_box_group"
            size="mini"
            @change="getListedData"
          >
            <el-checkbox-button
              v-for="city in data.towardOptions"
              :label="city"
              :key="city"
              >{{ city }}</el-checkbox-button
            >
          </el-checkbox-group>
        </div>
        <div class="floor toward">
          <h3>楼层</h3>
          <el-checkbox-group
            v-model="data.floor_box_group"
            size="mini"
            @change="getListedData"
          >
            <el-checkbox-button
              v-for="city in data.floorOptions"
              :label="city"
              :key="city"
              >{{ city }}</el-checkbox-button
            >
          </el-checkbox-group>
        </div>
        <div class="area">
          <h3>面积</h3>
          <el-input v-model="data.area_input_min" :inline="true"></el-input>
          ~
          <el-input v-model="data.area_input_max"></el-input>
          平方米
          <el-button
            class="area-btn"
            type="info"
            size="mini"
            @click="getChartData"
          >
            确定</el-button
          >
        </div>
        <div class="more" @click="click_more">
          更多选项
          <span class="arrow up"></span>
        </div>
      </div>
    </div>
    <div class="main-chart" v-loading="data.loading">
      <LineChart ref="echartsRef"></LineChart>
    </div>
  </div>
</template>
<script>
import { reactive, ref, computed, onMounted, watchEffect } from "vue";import { ElMessage } from "element-plus";
import { GetListedBlock, GetListedData } from "@/api/chart";
import LineChart from "@/views/Function/component/LineChart";
export default {
  name: "Listed",
  components: {
    LineChart,
  },
  setup(props) {
    const data = reactive({
      filter_more_flag: false,
      date_min_limit: new Date("2021-02-28"),
      area_input_min: "0",
      area_input_max: "999",
      period_type: "week",
      time_start_value: "2021-03-07 T",
      time_end_value: "",
      index_value: "",
      city_value: "",
      town_value: "",
      block_box_group: [],
      groupData: [],
      toward_box_group: [],
      floor_box_group: [],
      blockOptions: [],
      towardOptions: ["东", "南", "西", "北", "东南", "东北", "西南", "西北"],
      floorOptions: ["高", "中", "低"],
      period_options: [
        {
          value: "month",
          label: "月",
        },
        {
          value: "week",
          label: "周",
        },
      ],
      chart_data: {
        dateList: ["2019-01-07", "2019-01-14", "2019-01-21"],
        dataList: {
          广弘天琪: [12312, 23232, 33322],
          御花苑: [22312, 24232, 30022],
        },
      },
      loading:false,
    });
    const echartsRef = ref(null);
    const time_input_placeholder = computed(() => {
      if (data.period_type === "month") {
        return "选择月";
      }
      if (data.period_type === "week") {
        return "选择周";
      }
    });
    const time_input_format = computed(() => {
      if (data.period_type === "month") {
        return "gggg 第 MM 月";
      }
      if (data.period_type === "week") {
        return "gggg 第 ww 周";
      }
    });
    const getListedBlock = () => {
      GetListedBlock()
        .then((response) => {
          data.blockOptions = response.data.data;
        })
        .catch((error) => {});
    };
    const transName = (block) => {
      let newData = [];
      for (let item of block) {
        console.log("here:");
        console.log(data.blockOptions.filter((val) => val.blockId === item)[0]);
        newData.push(
          data.blockOptions.filter((val) => val.blockId === item)[0].blockname
        );
      }
      return newData;
    };
    const getListedData = () => {
      if (!validateChart()) {
        return false;
      }
      let requestData = {
        block_list: data.block_box_group,
        start_date: data.time_start_value,
        end_date: data.time_end_value,
        period: data.period_type,
        index_type: data.index_value,
        toward_list: data.toward_box_group,
        floor_list: data.floor_box_group,
        area_min: data.area_input_min,
        area_max: data.area_input_max,
        name: transName(data.block_box_group),
      };
      data.loading=true;
      GetListedData(requestData)
        .then((response) => {
          data.loading=false;
          data.chart_data = response.data.data;          echartsRef.value.initChart(data.chart_data);
          echartsRef.value.initChart(data.chart_data);
        })
        .catch((error) => {});
    };
    const validateChart = () => {
      if (!(data.time_start_value && data.time_end_value)) {
        ElMessage.error({
          type: "error",
          message: "时间段不能为空",
        });
        return false;
      }
      if (!data.index_value) {
        ElMessage.error({
          type: "error",
          message: "房价指标不能为空",
        });
        return false;
      }
      if (data.time_start_value > data.time_end_value) {
        ElMessage.error({
          type: "error",
          message: "时间范围有误",
        });
        return false;
      }
      if (data.time_start_value < data.date_min_limit) {
        ElMessage.error({
          type: "error",
          message:
            "暂无" + data.date_min_limit.toLocaleDateString() + "前挂牌价数据",
        });
        return false;
      }      if (data.area_input_min > data.area_input_max) {
        ElMessage.error({
          type: "error",
          message: "面积范围有误",
        });
        return false;
      }
      return true;
    };
    onMounted(() => {
      getListedBlock();
    });
    const click_more = () => {
      data.filter_more_flag = !data.filter_more_flag;
    };
    return {
      data,
      click_more,
      time_input_placeholder,
      time_input_format,
      echartsRef,
      getListedData,
    };
  },
};
</script>
<style lang="scss" scoped>
.main-filter {
  h3 {
    display: inline-block;
    text-align: center;
    line-height: 40px;
    margin: 15px 0;
  }
  background-color: #fbfbfb;
  .city {
    display: inline-block;
    height: 40px;
    margin-bottom: 10px;
    .el-select {
      margin-left: 20px;
    }
  }
  .period {
    display: inline-block;    height: 40px;
    margin-bottom: 10px;
    .el-select {
      margin-left: 20px;
    }
  }
  .block {
    h3 {
      margin-bottom: 5px;
    }
    .el-checkbox-group {
      margin-left: 5px;
    }
  }  .time {
    .el-date-editor {
      margin: 0 20px;
      width: 150px;
    }
    h3 {
      margin-right: 20px;
    }
  }  .index {
    .el-radio-group {
      margin: 0 20px;
    }
  }  .toward {
    margin-top: -15px;
    position: relative;
    .el-checkbox-group {
      position: absolute;
      display: inline-block;
      top: 25px;
      left: 50px;
    }
  }
  .floor {
    margin-top: -25px;
  }
  .area {
    position: relative;
    margin-top: -25px;
    &:hover {
      .area-btn {
        display: inline;
      }
    }
    h3 {
      margin-bottom: 5px;
      margin-right: 5px;
      display: inline-block;
    }
    .el-input {
      width: 50px;
      margin: 10px;      ::v-deep .el-input__inner {
        padding: 0 5px;
      }
    }
    .area-btn {
      display: none;
    }
  }
  .more {
    text-align: center;
    color: #a7a8a9;
    cursor: pointer;
  }
  .arrow {
    border: solid #a7a8a9;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 3px;    &.down {
      margin-bottom: 3px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    }
    &.up {
      margin-bottom: 1px;
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
    }
  }
}
</style>
