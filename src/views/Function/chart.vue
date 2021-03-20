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
            v-for="(item,index) in data.city_options"
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
            v-for="(item,index) in data.town_options"
            :key="index"
            :label="item.town_name"
            :value="item.town_id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="period">
        <h3>周期</h3>
        <el-select v-model="data.period_type" placeholder="请选择" @change="getChartData">
          <el-option
            v-for="(item,index) in data.period_options"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="block" @change="getChartData">
        <h3>小区</h3>
        <el-checkbox-group v-model="data.block_box_group" size="mini">
          <el-checkbox-button
            v-for="item in data.blockOptions"
            :checked="item.block_id===data.block_value"
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
          @change="getChartData"
        >
        </el-date-picker>
        ~
        <el-date-picker
          v-model="data.time_end_value"
          :type="data.period_type"
          :format="time_input_format"
          :placeholder="time_input_placeholder"
          @change="getChartData"
        >
        </el-date-picker>
      </div>
      <div class="index">
        <h3>房价指标</h3>
        <el-radio-group v-model="data.index_value" @change="getChartData">
          <el-radio-button v-for="item in data.indexOptions"  :label=item.label>{{ item.name }}</el-radio-button>

        </el-radio-group>
      </div>
      <div class="more" @click="click_more" v-if="!data.filter_more_flag">
        <div class="favorite">
          <el-button type="primary" @click="clickAddFavour">收藏</el-button>
        </div>
        更多选项
        <span class="arrow down"></span>
      </div>
      <div class="filter-more" v-if="data.filter_more_flag">
        <div class="toward" >
          <h3>朝向</h3>
          <el-checkbox-group v-model="data.toward_box_group" size="mini" @change="getChartData">
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
          <el-checkbox-group v-model="data.floor_box_group" size="mini" @change="getChartData">
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
          <el-button class="area-btn" type="info" size="mini" @click="getChartData"> 确定</el-button>
        </div>
        <div class="more" @click="click_more">
          <div class="favorite">
            <el-button type="primary" @click="clickAddFavour">收藏</el-button>
          </div>
          更多选项
          <span class="arrow up"></span>
        </div>
      </div>
    </div>
    <div class="main-chart">
      <LineChart ref="echartsRef"></LineChart>
    </div>
    <DialogVue
        v-if="data.dialogVisible"
        @operation="addFavour"
        @updateDialogVisible="data.dialogVisible=false"
        :msg="data.dialogMsg"
    />
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from "vue";

import {ElMessage} from 'element-plus'
import {
  GetCityList,
  GetTownList,
  GetBlockList,
  GetChartData
} from "@/api/chart";
import {getToken} from "@/utils/app";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {AddFavour} from "@/api/favour";
import DialogVue from "@/components/Dialog/Dialog"
import LineChart from "@/views/Function/component/LineChart";
export default {
  name: "Chart",
  components: {
    LineChart,
    DialogVue
  },
  setup(props) {
    const data = reactive({
      filter_more_flag: false,
      area_input_min: "0",
      area_input_max: "999",
      period_type: "week",
      time_start_value: "",
      time_end_value: "",
      index_value: "",
      block_value:"",
      city_value: "",
      town_value: "",
      block_box_group: [],
      toward_box_group: [],
      floor_box_group: [],
      blockOptions: [],
      towardOptions: ["东", "南", "西", "北", "东南", "东北", "西南", "西北"],
      floorOptions: ["高", "中", "低"],
      indexOptions:[
          {
        label:'x100',
        name:'最高价'
          },
          {
            label:'x101',
            name:'最低价'
          },
          {
            label:'x102',
            name:'中位数'
          },
          {
            label:'x103',
            name:'平均数'
          },
          {
            label:'x104',
            name:'众数'
          },
          {
            label:'x105',
            name:'成交量'
          }
      ],
      factorData:[],
      period_options: [
        {
          value: "month",
          label: "月"
        },
        {
          value: "week",
          label: "周"
        }
      ],
      city_options: [],
      town_options: [
        {
          town_id: "9001",
          town_name: "珠江新城"
        }
      ],
      chart_data: {
        dateList: ["2019-01-07", "2019-01-14", "2019-01-21"],
        dataList: {
          广弘天琪: [12312, 23232, 33322],
          御花苑: [22312, 24232, 30022]
        }
      },
      dialogVisible:false,
      dialogMsg:''
    });
    const route=useRoute();
    const store=useStore()
    const echartsRef=ref(null)
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
        return "";
      }
      if (data.period_type === "week") {
        return "gggg 第 ww 周";
      }
    });
    const getCityList = () => {

      GetCityList({})
        .then(response => {
          data.city_options = response.data.data;
        })
        .catch(error => {});
    };

    const getTownList = val => {
      data.town_value=''
      GetTownList({ city_id: val })
        .then(response => {
          data.town_options = response.data.data;
          getChartData()
        })
        .catch(error => {});
    };

    const getBlockList = val => {
      data.blockOptions=[]
      data.block_box_group=[]
      if (val==''){

        getChartData()
        return
      }
      GetBlockList({ town_id: val })
        .then(response => {
          data.blockOptions = response.data.data;
          getChartData()
        })
        .catch(error => {});
    };

    const transName = (city, town,block) => {
      let type=''
      if (town){
        if (block.length!=0){type='block'}
        else{type='town'}
      }
      else{ type='city'}
      console.log(type)
      if (type === "city") {
          let newData = data.city_options.filter(val => (val.city_id === city))[0];
          return newData.city_name;
      }
      if (type=="town"){
          let newData = data.town_options.filter(val => (val.town_id === town))[0];
          return newData.town_name;
      }
      if (type=="block"){
          let newData=[]
          for (let item of block){
            console.log('here:')
            console.log(data.blockOptions.filter(val => (val.block_id === item))[0])
            newData.push(data.blockOptions.filter(val => (val.block_id === item))[0].block_name)
          }
          return newData;
      }
    };

    const getChartData = () => {

      if (!validateChart()) {
        return false;
      }
      let requestData = {
        block_list: data.block_box_group,
        city_id: data.city_value,
        town_id: data.town_value,
        start_date: data.time_start_value,
        end_date: data.time_end_value,
        period: data.period_type,
        index_type: data.index_value,
        toward_list:data.toward_box_group,
        floor_list:data.floor_box_group,
        area_min:data.area_input_min,
        area_max:data.area_input_max,
        name: transName(data.city_value, data.town_value,data.block_box_group)
      };
      GetChartData(requestData)
        .then(response => {
          data.chart_data = response.data.data;
          echartsRef.value.initChart(data.chart_data);
        })
        .catch(error => {});
    };

    const validateChart = () => {
      if (!(data.time_start_value && data.time_end_value)) {
        ElMessage.error({
          type: "error",
          message: "时间段不能为空"
        });
        return false;
      }
      if (!data.index_value) {
        ElMessage.error({
          type: "error",
          message: "房价指标不能为空"
        });
        return false;
      }

      if (data.time_start_value>data.time_end_value){

        ElMessage.error({
          type: "error",
          message: "时间范围有误"
        });
        return false
      }

      if (data.area_input_min>data.area_input_max){
        ElMessage.error({
          type: "error",
          message: "面积范围有误"
        });
        return false
      }
      return true;
    };

    const clickAddFavour=()=>{
      console.log('clickAdd')
      console.log(data.dialogVisible)
      if (!validateChart()){
        ElMessage.error({
          type:"error",
          message:'收藏失败，条件不足，请继续选择'
        })
        return
      }
      if (!getToken()){
        ElMessage.error({
          type:"error",
          message:'收藏失败，未登录'
        })
        return
      }
      data.dialogVisible=true
      data.dialogMsg='确认收藏当前条件下的房价走势？'

    }

    const addFavour=()=>{

      let requestData={
        uid:2,
        s_date:data.time_start_value,
        e_date:data.time_end_value,
        block_id:data.block_box_group[0] || -1,
        town_id:data.town_value || -1,
        city_id:data.city_value,
        cycletype:data.period_type,
        ftype:'history',
        indextype:data.index_value
      }
      AddFavour(requestData).then(response=>{
        ElMessage.success({
          type:"success",
          message:'收藏成功'
        })
      }).catch(error=>{

      })


    }
    const loadStorage=()=>{
      let res=store.getters['chart/factor']
      res=JSON.parse(res)
      console.log(res)
      if (res==null){
        return
      }

      data.period_type=res.cycletype
      data.time_start_value=new Date(res.s_date)
      data.time_end_value=new Date(res.e_date)
      data.index_value=res.indextype
      data.city_value=res.city_id
      data.block_value=res.block_id
      if (data.city_value){
        getTownList(data.city_value)

      }
      data.town_value=res.town_id
      if (data.town_value){
        getBlockList(data.town_value)
      }


    }


    onMounted(() => {
      getCityList();
      loadStorage()


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
      getTownList,
      getBlockList,
      getChartData,
      addFavour,
      clickAddFavour

    };
  }
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
    .el-checkbox-group {
      margin-left: 5px;
    }
  }

  .time {
    .el-date-editor {
      margin: 0 20px;
      width: 150px;
    }
    h3{
      margin-right: 20px;
    }

  }

  .index {
    .el-radio-group {
      margin: 0 20px;
    }
  }

  .toward {
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
      margin: 10px;

      /deep/ .el-input__inner {
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
    .favorite{
      margin-bottom: 10px;
    }
  }
  .arrow {
    border: solid #a7a8a9;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 3px;

    &.down {
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
