<template>
  <!-- 继承父元素body的盒子 -->
  <div class="login_container">
    <!-- 白色盒子 -->
    <div class="login_box">
      <!-- vue图片 -->
      <div class="avater_box">
        <img src="../assets/images/logo.png" alt="" />
      </div>

      <!-- loginformRef是组件的实例对象 -->
      <el-form
        ref="loginformRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="login_rules"
      >
        <!-- 用户名 -->
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登陆,重置 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //登陆表单数据验证对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则对象
      login_rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },

  //点击重置登陆表单
  methods: {
    resetLoginForm() {
      //this可以访问$refs
      //console.log(this)
      this.$refs.loginformRef.resetFields();
    },
    //表单预验证，返回布尔值
    login() {
      this.$refs.loginformRef.validate(async (valid) => {
        //console.log(valid);
        if (!valid) return;
        const result = await this.$http.post("login", this.loginForm);
        console.log(result);
        if (result.data.meta.status !== 200) {
          return this.$message.error("登陆失败");
        } else {
          this.$message.success("登陆成功");
          //1.将登陆成功之后的token保存到客户端的sessionStrage中
          //1.1项目中除了登陆之外的其他API接口，必须在登陆之后才能访问；
          //1.2token只应在当前网站打开期间有效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem("token", result.data.data.token);
          //2.通过路由跳转到后台主页，路由地址为/home
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    top: -50%;
    transform: translate(-50%;50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>