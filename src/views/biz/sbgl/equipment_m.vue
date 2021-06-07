<template>
    <div class="sx_home_box">
        <div class="sx_home_header">
            <el-row style="width:100%">
                    <el-col :span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col :span="22" style="text-align:center;line-height:60px">
                      <span> <h4 style='margin:0;padding-right:8%;font-size:18px'>设备管理</h4></span>
                    </el-col>
                </el-row>
        </div>
        <div class="sx_home_main">
            <div class="sx_main_workbench" >
                <div class="sx_workbench_db" style="text-align:center">
                    <router-link style="width:100%;text-align:center;" to="/biz/sbgl/point">
                        <i class="el-icon-notebook-2" style="font-size:50px;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">点检记录</p>
                    </router-link>
                </div>
                <div class="sx_workbench_db" style="text-align:center">
                    <router-link style="width:100%;text-align:center;background:#fff;" to="/biz/sbgl/message">
                        <i class="el-icon-tickets" style="font-size:50px;background:#ccc;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">设备信息</p>
                    </router-link>
                </div>
                <div class="sx_workbench_db" style="text-align:center">
                    <router-link style="width:100%;text-align:center;background:#fff;" to="/biz/sbgl/check">
                        <i class="el-icon-data-line" style="font-size:50px;background:#ccc;border-radius:5px;padding:5px;"></i>
                        <p style="padding-bottom:10px">设备点检</p>
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
    rollback(){
        this.$router.push('/mobile/index')
    }
  },
  created() {
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
  }
};
</script>
<style scoped lang="scss">
  @import "../../../styles/mobile/index.scss";
</style>
