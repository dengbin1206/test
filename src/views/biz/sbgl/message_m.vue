<template>
    <el-container style="background:rgba(235, 235, 235);width:100%;height:100%">
        <el-header style='padding:0;background:#fff;'>
             <el-row style="width:100%">
                    <el-col :span="3" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col :span="18" style="text-align:center;line-height:60px">
                      <span> <h4 style='margin:0;padding-right:8%;font-size:18px'>设备信息</h4></span>
                    </el-col>
                    <el-col :span="3" style="text-align:center;line-height:60px"><img src="img/bg/qcode.png"  @click="scan" width="40px" style="margin-top:10px"></img></el-col>
                </el-row>
        </el-header>
        <el-main>
            <div style="width:100%">
                <el-row style="width:100%;margin:0;">
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备名称</span>
                        <span style="float:right">{{formData.equipName}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备型号</span>
                        <span style="float:right">{{formData.modelNum}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备编号</span>
                        <span style="float:right">{{formData.equipNum}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">安装位置</span>
                        <span style="float:right">{{formData.installPosition}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">负责班组</span>
                        <span style="float:right">{{formData.chargeTeamName}}</span>
                    </el-col>
                  <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                    <span style="float:left">设备状态</span>
                    <span style="float:right" v-show="formData.nowStatus==1">未点检</span>
                    <span style="float:right" v-show="formData.nowStatus==2">已点检</span>
                    <span style="float:right" v-show="formData.nowStatus==3">异常</span>
                    <span style="float:right" v-show="formData.scrapFlag==1">已报废</span>
                  </el-col>
                </el-row>
            </div>
        </el-main>
        <el-footer style="height:50px;display:flex;font-size:12px;background:rgb(245, 245, 245);line-height:20px;">
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:33.3%;text-align:center" @click="record"><i class="el-icon-s-order" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px">历史维修记录</span></div>
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:33.3%;text-align:center"  @click="datum"><i class="el-icon-document" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px">设备资料</span></div>
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:25%;text-align:center"  @click="repairs" ><i class="el-icon-suitcase" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px">报修</span></div>
        </el-footer>
    </el-container>
</template>
<script>
  import * as dd from 'dingtalk-jsapi';
  import { qrCode } from "@/api/biz/sbgl";
  import func from "@/util/func";
export default {
    data() {
        return {
          isStart:0,
          formData:{
            id:"",
            assetNum:"",
            equipName:"",
            equipGrade:"",
            equipCate:"",
            modelNum:"",
            makeStandard:"",
            specialEquip:"",
            equipNum:"",
            makeNo:"",
            makeDate:"",
            registerDate:"",
            factory:"",
            installPosition:"",
            fixTimes:"",
            nowStatus:"",
            workShop:"",
            scrapDate:"",
            chargeTeam:"",
            chargeUser:"",
            checkCycle:"",
            latelyDate:""
          },
          asd:'',
          equipId:'',
          id:''
        }
    },
    methods: {
        rollback(){
            this.$router.push('/mobile/home')
        },
        //报修
        repairs(){
          if(this.isStart==1){
            this.$message({
              type: "error",
              message: "设备已经超过报废期，不能报修"
            });
            return;
          }
          let equipId = this.formData.id;
          if(equipId){
            localStorage.setItem("repaType",1)
            this.$router.push({
              path:'/biz/sbgl/repairs',
              query:{asd:this.asd,equipId:this.equipId,id:this.id}
            })
          }else{
            this.$message({
              type: "error",
              message: "请先扫描设备"
            });
          }
        },
        scan(){
          let that = this;
          dd.biz.util.scan({
            type: "all" ,
            onSuccess: function(data) {
              // 获取参数
              let params = func.getUrlParam(data.text);
              qrCode(params).then((res)=>{
                that.formData =res.data.data;
                that.asd=that.formData.equipNum;
                that.equipId=that.formData.id;
                that.id=that.formData.checkId;
                that.isStart = that.formData.isStart;
              });
            },
            onFail : function(err) {
            }
          });
        },
        //设备资料
        datum(){
          let equipId = this.formData.id;
          if(equipId){
            localStorage.setItem("datumType",1)
            this.$router.push({path:'/biz/sbgl/datum',query:{asd:this.asd}})
          }else{
            this.$message({
              type: "error",
              message: "请先扫描设备"
            });
          }
        },
        //历史
        record(){
          let equipId = this.formData.id;
          if(equipId){
            localStorage.setItem("recoType",1)
            this.$router.push({path:'/biz/sbgl/record',query:{asd:this.asd,equipId:this.equipId}})
          }else{
            this.$message({
              type: "error",
              message: "请先扫描设备"
            });
          }
        }
    },
    created () {
        localStorage.removeItem("repaType")
        localStorage.removeItem("datumType")
        localStorage.removeItem("recoType")
        if(this.$route.query.asd&&this.$route.query.asd!=''){
          let params={equipNum:this.$route.query.asd}
          qrCode(params).then((res)=>{
                this.formData =res.data.data;
                this.asd=this.formData.equipNum;
                this.equipId=this.formData.id
                this.id=this.formData.checkId
              });
        }
    }
}
</script>
<style lang="scss" scoped>
body{
    font-size: 15px;
}
</style>
