<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu_tab">
        <li
          v-for="item in menuTab"
          :class="{ current: item.current }"
          @click="ToggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username">
          <label>邮箱</label>
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
              <el-input v-model.number="ruleForm.checkcode"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="block"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { stripscript, validateEmail, validatePwd } from "@/utils/validate";

export default {
  name: "login",
  data() {
    let checkcode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
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
      this.ruleForm.password = stripscript(value);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePwd(value)) {
        callback(new Error("请输入6-20位字母数字组合"));
      } else {
        callback();
      }
    };
    let checkpwds = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: "登录", current: true, type: "login" },
        { txt: "注册", current: false, type: "register" }
      ],
      model: "login",
      ruleForm: {
        username: "",
        password: "",
        checkcode: "",
        passwords: ""
      },
      rules: {
        username: [{ validator: checkusername, trigger: "blur" }],
        password: [{ validator: checkpwd, trigger: "blur" }],
        passwords: [{ validator: checkpwds, trigger: "blur" }],
        checkcode: [{ validator: checkcode, trigger: "blur" }]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    ToggleMenu(data) {
      this.menuTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      this.model = data.type;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  props: {},
  watch: {}
};
</script>

<style scoped lang="scss">
#login {
  height: 100vh;
  background-color: #2c3e50;
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
