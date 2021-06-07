<template>
    <div class="sx_home_box">
        <div class="sx_home_header">
            <div style="margin-left:20px;padding-top:10px;height:100%;margin-right:15px;float:left">
                <el-avatar :src="src"></el-avatar>
            </div>
            <div style="height:100%;line-height:60px;float:left;">
                <span>您好！{{name}}</span>
            </div>
            <div style="width:20%;line-height:60px;float:right;text-align:center">
               <el-button type="danger" size="small" @click="logout">注销</el-button>
            </div>
        </div>
        <div class="sx_home_main">
            <div class="sx_main_workbench" >
                <el-badge :value="todoCount" class="sx_workbench_db" :hidden="hide" style="text-align:center">
                    <router-link style="width:100%;text-align:center;" to="/mobile/backlog">
                        <i class="el-icon-edit-outline" style="font-size:50px;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">我的待办</p>
                    </router-link>
                </el-badge>
                <div class="sx_workbench_db" style="text-align:center">
                    <router-link style="width:100%;text-align:center;background:#fff;" to="/mobile/done">
                        <i class="el-icon-s-claim" style="font-size:50px;background:#ccc;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">我的已办</p>
                    </router-link>
                </div>
                <div class="sx_workbench_db" style="text-align:center">
                    <router-link style="width:100%;text-align:center;" to="/mobile/affair">
                        <i class="el-icon-s-order" style="font-size:50px;background:#ccc;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">我的事务</p>
                    </router-link>
                </div>
                <el-badge :value="copyCount" class="sx_workbench_db" :hidden='hidn' style="text-align:center">
                    <router-link style="width:100%;text-align:center;background:#fff;" to="/mobile/copy">
                        <i class="el-icon-s-comment" style="font-size:50px;background:#ccc;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">抄送回复</p>
                    </router-link>
                </el-badge>
            </div>
            <div class="sx_main_workbench" >
              <div class="sx_workbench_db" style="text-align:center">
                    <router-link style="width:100%;text-align:center;" to="/mobile/index">
                        <i class="el-icon-notebook-2" style="font-size:50px;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">设备管理</p>
                    </router-link>
              </div>

            </div>
        </div>
        <div class="sx_home_footer">
        </div>
    </div>
</template>
<script>
import { myToDoCount, instCopyMeCount } from "@/api/mobile";
import { getUserInfo } from "@/api/system/user.js";
import { mapGetters } from "vuex";
import { resetRouter } from "@/router/router";
import { Button } from 'vant';

export default {
  data() {
    return {
      name: "",
      src: "",
      todoCount: "",
      copyCount: "",
      hidn: false,
      hide: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    ...mapGetters(["tagWel"])
  },
  methods: {
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
            resetRouter()
          this.$router.push({ path: "/login" });
        });
      });
    }
  },
  created () {
    getUserInfo().then(res => {
      this.name = res.data.data.name;
      this.src = res.data.data.avatar;
    });
    myToDoCount().then(res => {
      this.todoCount = res.data.data;
      if (this.todoCount == 0) {
        this.hide = true;
      }
    });
    instCopyMeCount().then(res => {
      this.copyCount = res.data.data;
      if (this.copyCount == 0) {
        this.hidn = true;
      }
    });
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.$router.push({ path: "/mobile/index" });
    } else {
      this.$router.push({ path: this.tagWel.value });
    }
  }
};
</script>
<style scoped lang="scss">
  @import "../../styles/mobile/index.scss";
</style>
