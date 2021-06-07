<template>
    <el-container style="background:rgb(235, 235, 235);width:100%;height:100%">
        <el-header style="background:#fff">
                <el-row style="width:100%">
                    <el-col span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col span="22" style="text-align:center;line-height:60px;">
                        <h4 style='margin:0;padding-right:8%;font-size:18px'>历史维修记录</h4>
                    </el-col>
                </el-row>
        </el-header>
        <el-main>
            <ul class="list" style="width:100%;overflow:auto" v-for="(item,index) in dataList" :key="index">
                <el-row style="width:100%;margin:0;;margin-bottom:12px;">
                    <el-col style="background:rgb(245,245,245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;width:40%;text-align:left;">维修开始时间</span>
                        <span style="float:left;width:60%;text-align:right">{{item.repairStartTime}}
                        </span>
                    </el-col>
                    <el-col style="background:rgb(245,245,245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;width:40%;text-align:left;">维修结束时间</span>
                        <span style="float:left;width:60%;text-align:right">{{item.repairEndTime}}
                        </span>
                    </el-col>
                    <el-col style="background:rgb(245,245,245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;width:40%;text-align:left;">维修人员</span>
                        <span style="float:left;width:60%;text-align:right">{{item.repairUserName}}
                        </span>
                    </el-col>
                    <el-col style="background:rgb(245,245,245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;width:40%;text-align:left;">维修负责人</span>
                        <span style="float:left;width:60%;text-align:right">{{item.repairChargeName}}
                        </span>
                    </el-col>
                    <el-col style="background:rgb(245,245,245);padding:15px 10px;margin-bottom:1px;" class="textare">
                        <p style="margin:0;">维修内容:</p>
                        <p style="margin:0;padding:0 15px;">
                          {{item.repairContent}}
                        </p>
                    </el-col>
                    <el-col style="background:rgb(245,245,245);padding:15px 10px;margin-bottom:1px;" class="textare">
                        <p   style="margin:0">更换配件:</p>
                        <p style="margin:0;padding:0 15px;">
                            {{item.replacementParts}}
                        </p>
                    </el-col>
                </el-row>
            </ul>
        </el-main>
    </el-container>
</template>
<script>
import { list } from "@/api/biz/sbgl";
import { getAll } from "@/api/flow/flow";
export default {
  data() {
    return {
      dataList: [],
      userList: [],
      arr: [],
      disabled: true,
      type: "",
      equipId: ""
    };
  },
  methods: {
    getList() {
      let obj = {
        current: 1,
        size: 5,
        extQueryList: [
          {
            field: "equipId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: this.equipId,
                upperValue: ""
              }
            ]
          }
        ]
      };
      list(obj).then(res => {
        this.dataList = res.data.data.records;
      });
    },
    rollback() {
      let recoType = localStorage.getItem("recoType");
      if (recoType == 1) {
        this.$router.push({
          path: "/biz/sbgl/message",
          query: { asd: this.$route.query.asd }
        });
      }
      if (recoType == 2) {
        this.$router.push({
          path: "/biz/sbgl/spot",
          query: {
            equipNum: this.$route.query.equipNum,
            checkId: this.$route.query.checkId,
            time:this.$route.query.time,
            old:this.$route.query.old
          }
        });
      }
      if (recoType == 3) {
        this.$router.push({
          path: "/biz/sbgl/repairs",
          query: {
            equipNum: this.$route.query.equipNum,
            id: this.$route.query.checkId,
            equipId: this.$route.query.equipId,
            checkId: this.$route.query.checkId
          }
        });
      }
      if (recoType == 4) {
        this.$router.push({
          path: "/biz/sbgl/check",
          query: {
            equipNum: this.$route.query.equipNum,
          }
        });
      }
    },
    getUserList() {
      getAll().then(res => {
        this.userList = res.data.data;
        this.userList.forEach(ele => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    }
  },
  created() {
    this.equipId = this.$route.query.equipId;
    this.getList();
    this.getUserList();
  }
};
</script>
<style scoped>
html,
body {
  font-size: 15px;
  list-style: none;
  width: 100%;
  height: 100%;
}
.textare .el-textarea__inner {
  border: none !important;
}
.el-header,
.el-footer {
  text-align: center;
  line-height: 60px;
  padding: 0;
}
</style>
