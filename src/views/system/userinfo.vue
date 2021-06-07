<template>
  <div>
    <basic-container>
      <div class="content_container">
        <el-tabs
          tab-position="left"
          style="height: 450px"
          stretch
          v-model="type"
        >
          <el-tab-pane name="info">
            <span slot="label"
              ><i class="iconfont iconfont-setting" style="font-size: 14px"></i>
              基本设置</span
            >
            <div class="from-inner">
              <div class="inner">
                <el-form :model="form" size="mini" label-suffix=":" ref="form">
                  <el-form-item>
                    <div class="title">个人资料</div>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model="form.name" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="用户名">
                    <el-input v-model="form.realName" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="form.phone" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="form.email" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('form')"
                      >提交</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="password">
            <span slot="label"
              ><i class="iconfont iconfont-user" style="font-size: 14px"></i>
              账号设置</span
            >
            <div class="from-inner">
              <div class="inner">
                <el-form
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  label-suffix=":"
                  ref="ruleForm"
                  size="mini"
                >
                  <el-form-item>
                    <div class="title">修改密码</div>
                  </el-form-item>
                  <el-form-item label="原密码" prop="oldPassword">
                    <el-input
                      v-model="ruleForm.oldPassword"
                      type="password"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input
                      type="password"
                      v-model="ruleForm.newPassword"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="newPassword1">
                    <el-input
                      type="password"
                      v-model="ruleForm.newPassword1"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')"
                      >提交</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getUserInfo, updateInfo, updatePassword } from "@/api/system/user";
import md5 from "js-md5";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.newPassword1 !== "") {
          this.$refs.ruleForm.validateField("newPassword1");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      type: "info",
      form: {},
      ruleForm: {
        newPassword: "",
        newPassword1: "",
        oldPassword: "",
      },
      rules: {
        newPassword: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        newPassword1: [
          { validator: validatePass2, trigger: "blur", required: true },
        ],
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.handleWitch();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (formName === "ruleForm") {
            try {
              const { data } = await updatePassword(
                md5(this.ruleForm.oldPassword),
                md5(this.ruleForm.newPassword),
                md5(this.ruleForm.newPassword1)
              );
              if (data.success) {
                this.$message.success("修改密码成功");
              } else {
                this.$message.error(data.msg);
              }
            } catch (error) {
              console.log(error);
            }
          } else {
            const { data: res } = await updateInfo(this.form);
            if (res.success) {
              this.$message.success("修改信息成功");
            } else {
              this.$message.error(res.msg);
            }
          }
        } else {
          return false;
        }
      });
    },

    handleWitch() {
      getUserInfo().then((res) => {
        const user = res.data.data;
        this.form = {
          id: user.id,
          avatar: user.avatar,
          name: user.name,
          realName: user.realName,
          phone: user.phone,
          email: user.email,
        };
      });
    },
  },
};
</script>

<style scoped  lang="scss">
.content_container {
  padding: 10px;

  .from-inner {
    display: flex;
    justify-content: space-between;
    padding: 2px 10px;

    .inner {
      padding: 10px;
      padding-right: 50px;
      width: 49%;
      .title {
        color: rgba(0, 0, 0, 0.85);
        font-size: 15px;
        font-weight: 500;
      }
    }
  }

  /deep/.is-active {
    background-color: #ecf5ff;
  }
}
</style>
