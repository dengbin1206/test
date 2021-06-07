<template>
  <div class="login-container">
    <div class="login-wrapper animated swing">
      <div class="login-box">
        <div class="login-content">
          <div class="logo">
            <img :src="logo" alt="" />
          </div>
          <div class="form">
            <van-form
              @submit="onSubmit"
              @failed="onFaile"
              label-width="3rem"
              :show-error-message="false"
            >
              <van-field
                v-model="loginForm.tenantId"
                name="tenantId"
                placeholder="租户"
                icon-prefix="iconfont"
                left-icon="key"
                :rules="[{ required: true, message: '请填写租户' }]"
              />
              <van-field
                v-model="loginForm.username"
                name="username"
                placeholder="用户名"
                icon-prefix="iconfont"
                left-icon="user"
                :rules="[{ required: true, message: '请填写用户名' }]"
              />
              <van-field
                v-model="loginForm.password"
                type="password"
                name="password"
                placeholder="密码"
                icon-prefix="iconfont"
                left-icon="lock"
                :rules="[{ required: true, message: '请填写密码' }]"
              />
              <van-field
                v-model="loginForm.code"
                name="code"
                placeholder="验证码"
                icon-prefix="iconfont"
                left-icon="verified"
                center
                :rules="[{ required: true, message: '请填写验证码' }]"
              >
                <template #button>
                  <div class="login-code">
                    <img :src="loginForm.image" @click="refreshCode" />
                  </div>
                </template>
              </van-field>
              <div style="margin: 16px">
                <van-button block type="info" native-type="submit"
                  >登陆</van-button
                >
              </div>
            </van-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaptcha } from "@/api/user";
import { Toast } from "vant";
export default {
  data() {
    return {
      logo: require("../../MobileAssets/image/logo.png"),
      loginForm: {
        //租户ID
        tenantId: "DART",
        //用户名
        username: "admin",
        //密码
        password: "123456",
        //账号类型
        type: "account",
        //验证码的值
        code: "",
        //验证码的索引
        key: "",
        //预加载白色背景
        image:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      },
    };
  },
  created() {
    this.refreshCode();
  },
  methods: {
    onSubmit(values) {
      this.$store.dispatch("MobileLoginByUserName", this.loginForm).then(() => {
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
        ) {
          this.$router.push({ path: "/mobile/index" });
        }
      });
    },

    onFaile(errorInfo) {
      const { errors } = errorInfo;
      if (errors) {
        Toast({
          message: errors[0].message,
          position: "top",
        });
      }
    },

    refreshCode() {
      getCaptcha().then((res) => {
        const data = res.data;
        this.loginForm.key = data.key;
        this.loginForm.image = data.image;
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-size: 100% 100%;
  background-color: #517296;
}

.login-wrapper {
  margin: 0 auto;
  width: 1200px;
  width: 96% !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-box {
  position: relative;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
}

.login-content {
  padding: 10px;

  .logo{
    height: 100px;
    // background-color: #0079fe;

    img{
      width: 100%;
      height: 100%;
      color: #0079fe;
    }
  }
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .form {
    margin-top: 20px;

    .login-code {
      img {
        height: 100%;
      }
    }
  }
}
</style>

