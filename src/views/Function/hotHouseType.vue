<template>
  <div>
    <div class="main-filter">
      <div class="city">
        <h3>区</h3>
        <el-select
          v-model="data.city_value"
          placeholder="请选择"
          @change="getTownList(data.city_value)"
        >
          <el-option
            v-for="(item, index) in data.city_options"
            :key="index"
            :label="item.city_name"
            :value="item.city_id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="period">
        <h3>村</h3>
        <el-select
          v-model="data.town_value"
          placeholder="请选择"
          @change="getBlockList(data.town_value)"
        >
          <el-option
            v-for="(item, index) in data.town_options"
            :key="index"
            :label="item.town_name"
            :value="item.town_id"
          >
          </el-option>
        </el-select>
      </div>      <div class="block">
        <h3>小区</h3>
        <el-checkbox-group v-model="data.block_box_group" size="mini" :max="1">
          <el-checkbox-button
            v-for="item in data.blockOptions"
            :label="item.block_id"
            :key="item.block_id"
            >{{ item.block_name }}</el-checkbox-button
          >
        </el-checkbox-group>
      </div>
      <div class="time">
        <h3>时间范围</h3>
        <el-date-picker
          v-model="data.time_start_value"
          :type="data.period_type"
          :format="time_input_format"
          :placeholder="time_input_placeholder"
        >
        </el-date-picker>
        ~
        <el-date-picker
          v-model="data.time_end_value"
          :type="data.period_type"
          :format="time_input_format"
          :placeholder="time_input_placeholder"
        >
        </el-date-picker>
      </div>
      <div class="confirm-btn">
        <el-button type="primary" @click="getHotType">确认</el-button>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        :data="data.tableData"
        border
        height="500"
        style="width: 100%"
        v-loading="data.loading"
      >
        <el-table-column type="index" label="排名" width="100">
        </el-table-column>
        <el-table-column
          prop="s_date"
          align="center"
          label="开始日期"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="e_date"
          align="center"
          label="结束日期"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="cityname" align="center" label="区" width="100">
        </el-table-column>
        <el-table-column prop="townname" align="center" label="村" width="100">
        </el-table-column>
        <el-table-column
          prop="blockname"
          align="center"
          label="小区"        >
        </el-table-column>
        <el-table-column prop="floor" align="center" label="楼层" width="100">
        </el-table-column>
        <el-table-column prop="toward" align="center" label="朝向" width="100">
        </el-table-column>
        <el-table-column
          prop="housetype"
          align="center"
          label="房型"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="price" align="center" label="单价(元/平米)" width="150">
        </el-table-column>
        <el-table-column
          prop="dealnum"
          align="center"
          label="成交量"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="dealcycle"
          align="center"
          label="成交周期/天"
          width="100"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template><script>
import { reactive, ref, computed, onMounted } from "vue";import { ElMessage } from "element-plus";
import { GetCityList, GetTownList, GetBlockList } from "@/api/chart";
import { getToken } from "@/utils/app";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { GetHotType } from "@/api/hottype";export default {
  name: "hotHouseType",
  components: {},
  setup(props) {
    const data = reactive({
      filter_more_flag: false,
      time_start_value: "2021-03-11",
      time_end_value: "",
      block_value: "",
      city_value: "",
      town_value: "",
      block_box_group: [],
      toward_box_group: [],
      floor_box_group: [],
      blockOptions: [],
      towardOptions: ["东", "南", "西", "北", "东南", "东北", "西南", "西北"],
      floorOptions: ["高", "中", "低"],
      factorData: [],
      city_options: [],
      town_options: [],
      chart_data: {
        dateList: ["2019-01-07", "2019-01-14", "2019-01-21"],
        dataList: {
          广弘天琪: [12312, 23232, 33322],
          御花苑: [22312, 24232, 30022],
        },
      },
      dialogVisible: false,
      dialogMsg: "",
      tableData: [],
      loading: false,
    });
    const route = useRoute();
    const store = useStore();
    const echartsRef = ref(null);
    const time_input_placeholder = computed(() => {
      return "选择日期";
    });    const time_input_format = computed(() => {
      return "YYYY 年 MM 月 DD 日";
    });
    const getCityList = () => {
      GetCityList({})
        .then((response) => {
          data.city_options = response.data.data;
        })
        .catch((error) => {});
    };
    const getTownList = (val) => {
      data.town_value = "";
      GetTownList({ city_id: val })
        .then((response) => {
          data.town_options = response.data.data;
        })
        .catch((error) => {});
    };
    const getBlockList = (val) => {
      data.blockOptions = [];
      data.block_box_group = [];
      if (val == "") {
        return;
      }
      GetBlockList({ town_id: val })
        .then((response) => {
          data.blockOptions = response.data.data;
        })
        .catch((error) => {});
    };
    const hotTypeSortCmp = (a, b) => b.dealnum - a.dealnum;    const getHotType = () => {
      if (!validateChart()) {
        return;
      }
      let requestData = {
        city_id: data.city_value,
        town_id: data.town_value,
        block_id: data.block_box_group[0] || "",
        s_date: data.time_start_value,
        e_date: data.time_end_value,
      };
      data.loading = true;
      GetHotType(requestData)
        .then((response) => {
          let res = response.data.data;
          res.sort(hotTypeSortCmp);
          data.tableData = res;
          data.loading = false;        })
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
      if (data.time_start_value > data.time_end_value) {
        ElMessage.error({
          type: "error",
          message: "时间范围有误",
        });
        return false;
      }
      return true;
    };
    onMounted(() => {
      getCityList();
    });
    const click_more = () => {
      data.filter_more_flag = !data.filter_more_flag;
    };
    return {
      data,
      click_more,
      time_input_placeholder,
      time_input_format,      getTownList,
      getBlockList,
      getHotType,
    };
  },
};
</script>
<style lang="scss" scoped>
.confirm-btn {
  text-align: center;
}
.table-wrap {
  margin-top: 20px;
}
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
    display: inline-block;
    margin-left: 20px;
    height: 40px;
    margin-bottom: 10px;
    .el-select {
      margin-left: 20px;
    }
  }
  .block {
    h3 {
      margin-bottom: 5px;
    }
    .el-radio-group {
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
      margin: 10px;      /deep/ .el-input__inner {
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
    .favorite {
      margin-bottom: 10px;
    }
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
