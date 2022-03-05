<template>
  <div id="login">
    <div class="sfName">
      二手房量化投资助手系统
    </div>
    <div class="login-wrap">
      <ul class="menu_tab">
        <li
          v-for="item in menuTab"
          :class="{ current: item.current }"
          @click="ToggleMenu(item)"
          :key="item.id"
        >
          {{ item.txt }}
        </li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rule="rules"
        ref="ruleForms"
        class="login-form"
        size="medium"
      >
        <!--ref不能和model重名 -->
        <el-form-item prop="username">
          <label>账号</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" v-if="model == 'register'">
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkcode">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.checkcode"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
                >{{ codeButtonStatus.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm(ruleForms)"
            class="block"
            v-bind:disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { stripscript, validateEmail, validatePwd } from "@/utils/validate";
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GetSms, Register } from "@/api/login";
import sha1 from "js-sha1";
import { ElMessage } from "element-plus";

export default {
  name: "login",
  //context解构
  setup(props, content) {
    console.log(content);
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" },
    ]);
    const model = ref("login");
    //登录按钮禁用状态
    const loginButtonStatus = ref(true);
    //获取验证码禁用状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码",
    });
    //倒计时
    const timer = ref(null);
    //表单绑定数据
    const ruleForm = reactive({
      username: "",
      password: "",
      checkcode: "",
      passwords: "",
    });
    const ruleForms = ref(null);
    const router = useRouter();
    const store = useStore();
    const rules = reactive({
      username: [{ validator: checkusername, trigger: "blur" }],
      password: [{ validator: checkpwd, trigger: "blur" }],
      passwords: [{ validator: checkpwds, trigger: "blur" }],
      checkcode: [{ validator: checkcode, trigger: "blur" }],
    });
    let checkcode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("验证码不能为空"));
      } else {
        callback();
      }
    };
    let checkusername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback();
      }
    };
    let checkpwd = (rule, value, callback) => {
      value = stripscript(value);
      ruleForm.password = stripscript(value);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePwd(value)) {
        callback(new Error("请输入6-20位字母数字组合"));
      } else {
        callback();
      }
    };
    let checkpwds = (rule, value, callback) => {
      if (value !== ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };

    /*
     *声明函数****************************************************************************
     */
    const ToggleMenu = (data) => {
      menuTab.forEach((elem) => {
        elem.current = false;
      });
      data.current = true;
      model.value = data.type;
      //refs["ruleForm"].resetFields();
      clearCountDown();
    };

    //表单提交
    const submitForm = (formName) => {
      //context.refs[formName].validate((valid) => {

      formName.validate((valid) => {
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    //登录
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.checkcode,
        module: "login",
      };
      store
        .dispatch("app/login", requestData)
        .then((response) => {

          ElMessage.success({
            message: "登录成功",
            type: "success",
          });
          router.push({
            name: "Console",
            params: {},
          });
        })
        .catch((error) => {});
    };
    //
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.checkcode,
        module: "register",
      };
      Register(requestData)
        .then((response) => {
          ElMessage.success({
            message: "注册成功",
            type: "success",
          });
          ToggleMenu(menuTab[0]);
        })
        .catch((error) => {});
    };
    //倒计时
    const countDown = (number) => {
      //setTimeout 执行一次
      //setInterval 一直执行
      // 60 和 0 没显示
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          codeButtonStatus.status = false;
          codeButtonStatus.text = "再次获取";
          return false;
        }
        codeButtonStatus.text = `倒计时${time}秒`; // ES6 写法 波浪号(1左边的点) ``  ES5写法 单引号‘倒计时’+time+‘秒’
      }, 1000);
    };
    //清除倒计时
    const clearCountDown = () => {
      codeButtonStatus.status = false;
      codeButtonStatus.text = "获取验证码";
      clearInterval(timer.value);
    };
    /*
     * 获取验证码
     */
    const getSms = () => {
      let data = {
        username: ruleForm.username,
        module: model,
      };
      codeButtonStatus.status = true;
      codeButtonStatus.text = "发送中";
      setTimeout(() => {
        GetSms(data)
          .then((response) => {
            let data = response.data;
            let mes = data.message;
            ElMessage.success({
              message: mes,
              type: "success",
            });
            loginButtonStatus.value = false;
            countDown(5);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 2000);
    };
    return {
      menuTab,
      model,
      ToggleMenu,
      ruleForm,
      submitForm,
      getSms,
      loginButtonStatus,
      codeButtonStatus,
      rules,
      ruleForms,
    };
  },
  props: {},
  watch: {},
};
</script>

<style scoped lang="scss">
#login {
  height: 100vh;
  background-color: #2c3e50;
}
.sfName{
  font-size: 20px;
  color: white;
  text-align: center;
}

.login-wrap {
  width: 330px;
  margin: auto;
}
.menu_tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
}
.current {
  background-color: rgba(0, 0, 0, 0.1);
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
}
.block {
  width: 100%;
  display: block;
}
</style>
