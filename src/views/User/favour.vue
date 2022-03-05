<template>
  <el-table :data="data.tableData" border style="width: 100%">
    <el-table-column
      prop="s_date"
      align="center"
      label="开始日期"
      :formatter="dateFormatter"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="e_date"
      align="center"
      :formatter="dateFormatter"
      label="结束日期"
      width="100"
    >
    </el-table-column>
    <el-table-column prop="cityname" align="center" label="区" width="100">
    </el-table-column>
    <el-table-column prop="townname" align="center" label="村" width="100">
    </el-table-column>
    <el-table-column prop="blockname" align="center" label="小区" width="120">
    </el-table-column>
    <el-table-column
      prop="cycletype"
      :formatter="cycleFormatter"
      align="center"
      label="周期"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="ftype"
      :formatter="ftypeFormatter"
      align="center"
      label="房价类型"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="indextype"
      :formatter="indextypeFormatter"
      align="center"
      label="房价指数"
      width="100"
    >
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button size="mini" @click="handleSearch(scope.row)">查看</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="clickDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <DialogVue
    v-if="data.dialogVisible"
    @operation="handleDelete"
    @updateDialogVisible="data.dialogVisible = false"
    :msg="data.dialogMsg"
  />
</template>

<script>
import { reactive, onMounted } from "vue";
import { GetFavour, DeleteFavour } from "@/api/favour";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import DialogVue from "@/components/Dialog/Dialog";
import {getUid} from "../../utils/app";
export default {
  name: "index",
  components: {
    DialogVue,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const data = reactive({
      tableData: [],
      indexOptions: [
        {
          label: "x100",
          name: "最高价",
        },
        {
          label: "x101",
          name: "最低价",
        },
        {
          label: "x102",
          name: "中位数",
        },
        {
          label: "x103",
          name: "平均数",
        },
        {
          label: "x104",
          name: "众数",
        },
        {
          label: "x105",
          name: "成交量",
        },
      ],
      dialogVisible: false,
      dialogFavourid: "",
      dialogIndex: "",
      dialogMsg: "",
    });
    const getFavour = () => {
      GetFavour({
        uid: getUid(),
      })
        .then((response) => {
          data.tableData = response.data.data;
          console.log(response.data.data);
        })
        .catch((error) => {});
    };

    const dateFormatter = (row, column, cellValue) => {
      let datetime = cellValue;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        return y + mon + d;
      }
      return "";
    };
    const cycleFormatter = (row, column, cellValue) => {
      if (cellValue == "week") {
        return "周";
      } else if (cellValue == "month") {
        return "月";
      }
    };
    const ftypeFormatter = (row, column, cellValue) => {
      if (cellValue == "listed") {
        return "挂牌价";
      } else if (cellValue == "history") {
        return "成交价";
      }
    };
    const indextypeFormatter = (row, column, cellValue) => {
      let res = data.indexOptions.filter((val) => val.label == cellValue)
      console.log(res)
      return res[0].name;
    };
    const handleSearch = (row) => {
      store.commit("chart/UPDATE_STATE_VALUE", {
        factor: {
          value: row,
          session: true,
        },
      });
      let url = router.resolve({ path: `/Function/Chart` });
      window.open(url.href, "_blank");
    };
    const clickDelete = (index, row) => {
      data.dialogVisible = true;
      data.dialogFavourid = row.favourid;
      data.dialogIndex = index;
      data.dialogMsg = "删除后将无法恢复，确认删除该收藏?";
    };
    const handleDelete = () => {
      DeleteFavour({ favourid: data.dialogFavourid })
        .then((response) => {
          ElMessage.success({
            type: "success",
            message: "删除成功",
          });
          data.tableData.splice(data.dialogIndex, 1);
        })
        .catch((error) => {});
    };
    onMounted(() => {
      getFavour();
    });
    return {
      data,
      dateFormatter,
      cycleFormatter,
      ftypeFormatter,
      indextypeFormatter,
      handleSearch,
      handleDelete,
      clickDelete,
    };
  },
};
</script>

<style scoped></style>
