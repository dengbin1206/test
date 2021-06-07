<template>
    <el-container style="background:rgba(235, 235, 235);width:100%;height:100%" class=".sx_sbzl">
        <el-header style='padding:0;background:#fff;'>
             <el-row style="width:100%">
                    <el-col :span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col :span="22" style="text-align:center;line-height:60px">
                      <span> <h4 style='margin:0;padding-right:8%;font-size:18px'>设备资料</h4></span>
                    </el-col>
                </el-row>
        </el-header>
        <el-main>
            <div style="width:100%;height:100%;overflow:auto">
        <el-row style="width:100%;margin:0;border-radius:5px;">
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">资产编号</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.assetNum}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">设备名称</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.equipName}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">设备等级</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.equipGrade}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">设备种类</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.equipCate}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">型号</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.modelNum}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">规格</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.makeStandard}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">特种设备</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.specialEquip}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">设备编号</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.equipNum}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">出厂制造编号</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.makeNo}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">制造日期</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.makeDate}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">登记日期</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.registerDate}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">厂家</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.factory}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">安装位置</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.installPosition}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">点检周期(天)</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.checkCycle}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">维修次数</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.fixTimes}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">目前设备状态</span>
                        <span style="float:right;width:70%;text-align:right" v-if="dataList.nowStatus==1">未点检</span>
                        <span style="float:right;width:70%;text-align:right" v-if="dataList.nowStatus==2">已点检</span>
                        <span style="float:right;width:70%;text-align:right" v-if="dataList.nowStatus==3">异常</span>
                      <span style="float:right;width:70%;text-align:right" v-if="dataList.nowStatus==4">已报废</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">负责班组</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.chargeTeamName}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">班组负责人</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.chargeUserName}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">车间</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.workShop}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">报废日期</span>
                        <span style="float:right;width:70%;text-align:right">{{dataList.scrapDate}}</span>
                    </el-col>
                    <el-col style="padding:15px 10px;margin-bottom:1px;background:rgb(245,245,245)">
                        <span style="float:left;width:30%;text-align:left">设备详细资料</span>
                    </el-col>
                    <el-row  v-for="(file, index) in fileList" :key="index" class="file_list">
                        <el-col :span="24" class="files" style="padding:8px 10px;">
                            <li style="width:100%;height:100%"  @click="handlePreview(file)">
                                <i class="el-icon-document" style="color:#409eff;list-style:none;"></i>
                                {{ file.name }}
                            </li>
                        </el-col>
                    </el-row>
                </el-row>
            </div>
        </el-main>
    </el-container>

</template>
<script>
import { getNo } from "@/api/biz/sbgl";
import { asyncUploadAction, uploadList } from "@/api/tool/dynamic";
import { getToken } from "@/util/auth";
import website from "@/config/website";
export default {
  data() {
    return {
      dataList: {},
      asd: "",
      mainId:'',
      dataSrcId: "SBJC",
      affixType: "SBJC#DATA_UPLOAD",
      fileList:[]
    };
  },
  methods: {
    getData() {
      getNo(this.asd).then(res => {
        if (res.data.code == 200) {
          this.dataList = res.data.data;
          if(this.dataList.isStart==1){
            this.dataList.nowStatus=4;
          }
          this.mainId=res.data.data.id;
          this.init()
        } else {
          this.$message({
            type: "error",
            message: "获取数据失败"
          });
        }
      });
    },
    init() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId,
        affixType: this.affixType
      };
      this.fileList = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 1
            });
          });
        }
      });
    },
    rollback() {
      let datumType = localStorage.getItem("datumType");
      if (datumType == 1) {
        this.$router.push({
          path: "/biz/sbgl/message",
          query: { asd: this.$route.query.asd }
        });
      }
      if(datumType == 2){
          this.$router.push({
          path: "/biz/sbgl/spot",
          query: { equipNum: this.$route.query.asd,checkId:this.$route.query.checkId,time:this.$route.query.time,old:this.$route.query.old }
        });
      }
      if(datumType == 4){
          this.$router.push({
          path: "/biz/sbgl/check",
          query: {equipNum:this.$route.query.asd}
        });
      }
    },
    handlePreview(file){
        window.open(
                `/api/blade-resource/affix/singleDownload?${
                this.website.tokenHeader
                }=${getToken()}&affixId=${file.fileId || ""}`
            );
    }
  },
  created() {
    this.asd = this.$route.query.asd;
    this.getData();
  }
};
</script>
<style lang="scss">
body{
    list-style: none;
}
.sx_sbzl .file_list li {
    list-style: none !important;
    text-align: left;
    margin-top: 2px;
    a {
      color: #0079fe;
    }
  }
</style>
