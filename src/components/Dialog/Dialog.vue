<template>
  <el-dialog
    title="提示"
    width="30%"
    v-model="data.dialogVisible"
    @close="closeDialog"
  >
    <span>{{ data.msg }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="clickTrue">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "Dialog",
  emits: ["operation", "updateDialogVisible"],
  props: {
    msg: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      dialogVisible: true,
      msg: props.msg,
    });
    const clickTrue = () => {
      closeDialog();
      emit("operation");
    };
    const closeDialog = () => {
      emit("updateDialogVisible");
    };

    return {
      data,
      clickTrue,
      closeDialog,
    };
  },
};
</script>

<style scoped></style>
