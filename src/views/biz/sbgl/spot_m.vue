<template>
    <el-container style="background:rgba(249, 249, 249, 1);width:100%;height:100%">
        <el-header style='padding:0;background:#fff;'>
             <el-row style="width:100%">
                    <el-col :span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col :span="22" style="text-align:center;line-height:60px">
                        <h4 style='margin:0;padding-right:8%;font-size:18px'>设备点检</h4>
                    </el-col>
                </el-row>
        </el-header>
        <el-main>
            <div style='width:100%;height:50px;'>
                <el-button-group style='width:100%;margin:0;height:100%' class="sx_spot_btns">
                    <el-button class='btn1 active' size='small' style='width:50%;border-top-left-radius:7px;border-bottom-left-radius:7px;height:100%;font-size:15px;' @click="tabs(1)">设备信息</el-button>
                    <el-button class='btn2' size='small' style='width:50%;border-top-right-radius:7px;border-bottom-right-radius:7px;height:100%;font-size:15px;' @click="tabs(2)">点检登记</el-button>
                </el-button-group>
            </div>
            <div style="width:100%" v-show="disvis==true">
                <el-row style="width:98%;margin:0 1%;border:none;" v-show="disvis">
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;border-top-left-radius:7px;border-top-right-radius:7px;">
                        <span style="float:left">点检单号</span>
                        <span style="float:right">{{conData.checkOrderNo}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备名称</span>
                        <span style="float:right">{{conData.equipName}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备编号</span>
                        <span style="float:right">{{conData.equipNum}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备型号</span>
                        <span style="float:right">{{conData.modelNum}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">安装位置</span>
                        <span style="float:right">{{conData.installPosition}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">点检人</span>
                        <span style="float:right">{{conData.userNow}}
                        </span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">点检时间</span>
                        <span style="float:right">{{conData.checkNow}}</span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;">负责班组</span>
                        <span style="float:right">{{conData.chargeTeamName}}
                        </span>
                    </el-col>
                    <el-col style="background:rgb(245, 245, 245);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;">班组负责人</span>
                        <span style="float:right">{{conData.chargeUserName}}
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:12px 0px;margin-bottom:3px;">
                        <p style="border-left:3px solid rgb(55, 96, 149);padding:3px 0px;margin:0;font-weight:600">点检部位图示</p>
                        <span v-for="(item,index) in imgList" :key="index" style="margin:5px">
                            <img :src="'data:image/jpeg;base64,'+item" width="98%" alt=""  style="margin-top:5px">
                        </span>
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%" v-show="disvis==false">
                <div style="width:100%" v-for="(item,index) in rightList.checkRegisterVOList" :key="index">
                    <el-row style="width:100%;padding: 0 5px;background:#fff;margin-bottom:2px;"  class="sx_lis">
                        <el-col :span="15">
                            <p style="margin:6px;font-size:16px;white-space:nowrap;font-weight:600;">{{item.standard.changePosition}}</p>
                            <p style="margin:6px;font-size:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden; white-space:nowrap;">{{item.standard.judgeBasic}}</p>
                        </el-col>
                        <el-col :span="9">
                            <p style='text-align:right;padding-right:10px;margin:0 6px;'>{{item.standard.checkMethod}}</p>
                            <p style='text-align:right'><el-checkbox v-model="item.isNormal" :disabled="disabled">正常</el-checkbox></p>
                        </el-col>
                    </el-row>
                </div>
                <el-row style='margin-bottom:2px;padding: 0 5px;background:#fff;'>
                    <el-col :span="24" style='text-align:left'>
                        <p>上传附件</p>
                        <el-upload
                            class="upload-demo"
                            :http-request="uploadAction"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :before-upload="beforeUpload"
                            :on-success="uploadSuccessFile"
                            :file-list="fileList"
                            action="null"
                        >
                            <el-button size="small" type="primary" v-show="disabled==false">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip"></div>
                        </el-upload>
                    </el-col>
                </el-row>
                <el-row style="background:#fff;padding:5px 10px;" class="textare" >
                    <el-col :span="24">备注:</el-col>
                    <el-col :span='24'>
                        <el-input type="textarea" v-model='rightList.remarks' rows="3"></el-input>
                    </el-col>
                </el-row>
            </div>
        </el-main>
        <el-footer style="height:50px;display:flex;font-size:12px;line-height:20px;">
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:25%;text-align:center;"  @click='spotSub'><i class="el-icon-s-promotion" style="font-size:17px;margin-top:5px;"></i><span style="height:20px">点检完成</span></div>
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:25%;text-align:center"  @click="record"><i class="el-icon-s-order" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px" >历史维修记录</span></div>
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:25%;text-align:center"  @click="datum"><i class="el-icon-document" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px">设备资料</span></div>
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:25%;text-align:center"   @click="repairs"><i class="el-icon-suitcase" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px">报修</span></div>
        </el-footer>
    </el-container>
</template>
<script>
import fileUpload from "@/components/fileUpload";
import {
  detailSingle,
  getRegister,
  checkFinish,
  modelByName,
  singleDownloadByte
} from "@/api/biz/sbgl";
import { startFlow } from "@/api/tool/dynamic";
import { getAll } from "@/api/flow/flow";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList } from "@/api/tool/dynamic";
export default {
  components: {
    fileUpload
  },
  data() {
    return {
      disabled:false,
      old:'',
      disvis: true,
      checked: 1,
      fileItem1: [],
      fileItem2: [],
      equipNum: "",
      checkId: "",
      conData: {},
      rightList: {},
      num: 0,
      dataId: "",
      userList: [],
      fileList: [],
      dataList: [],
      dataSrcId: "DART_DJ",
      affixType: "DART_DJ#AFFIX_UPLOAD",
      imgList: []
    };
  },
  methods: {
    tabs(old) {
      document.querySelector(".active").classList.remove("active");
      let btn = ".btn" + old;
      document.querySelector(btn).classList.add("active");
      if (old == 1) {
        this.disvis = true;
        this.num = 0;
      } else if (old == 2) {
        this.disvis = false;
      }
    },
    rollback() {
      this.$router.push({path:"/biz/sbgl/point",query:{old:this.$route.query.old,time:this.$route.query.time}});
    },
    //报修
    repairs() {
      if(this.old==1){
        localStorage.setItem("repaType", 2);
      this.$router.push({
        path: "/biz/sbgl/repairs",
        query: {
          equipId: this.conData.equipId,
          equipNum: this.conData.equipNum,
          id: this.checkId
        }
      });
      }else if(this.old==2){
        this.$message({
              type: "warning",
              message: "已点检,不能再报修"
            });
      }

    },
    getData(a) {
      detailSingle(a).then(res => {
        if (res.data.code == "200") {
          this.conData = res.data.data;
          if (this.conData.fieldIds.length > 0) {
            this.conData.fieldIds.forEach(item => {
              this.getImg(item);
              //this.imgList.push("api/blade-resource/affix/singleDownload?affixId="+item);
            });
          }else{
            this.imgList=[]
          }
          this.getRight(this.equipNum, res.data.data.id);
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    getImg(a) {
      singleDownloadByte(a).then(res => {
        this.imgList.push(res.data.data);
      });
    },
    getRight(a, b) {
      getRegister(a, b).then(res => {
        if (res.data.code == "200") {
          this.rightList = res.data.data;
          if (this.rightList.checkRegisterVOList.length > 0) {
            this.rightList.checkRegisterVOList.forEach(item => {
              if (item.isNormal == 1) {
                item.isNormal = true;
              } else {
                item.isNormal = false;
              }
            });
          }
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    //获取模型Id
    getModel(a) {
      modelByName(a).then(res => {
        if (res.data.code == 200) {
          this.startFlow(res.data.data.id);
        }
      });
    },
    //启动流程
    startFlow(a) {
      startFlow({
        flowKey: "SBGL_DJ_DART",
        formType: "S",
        modelId: a,
        dataId: this.dataId,
        variables: {
          functionPath:this.$route.fullPath
        }
      }).then(res => {
        if ((res.data.code = 200)) {
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.rollback()
        }
      });
    },
    //历史维修记录
    record() {
      localStorage.setItem("recoType", 2);
      this.$router.push({
        path: "/biz/sbgl/record",
        query: {
          equipId: this.conData.equipId,
          equipNum: this.conData.equipNum,
          checkId: this.checkId,
          old:this.$route.query.old,
          time:this.$route.query.time
        }
      });
    },
    //设备资料
    datum() {
      localStorage.setItem("datumType", 2);
      this.$router.push({
        path: "/biz/sbgl/datum",
        query: { asd: this.conData.equipNum, checkId: this.checkId,old:this.$route.query.old,time:this.$route.query.time }
      });
    },
    spotSub() {
      if(this.old==1){
        this.num += 1;
      if (this.num == 1) {
        if (this.rightList.length > 0) {
          this.rightList.forEach((item, index) => {
            if (item.isNormal == false) {
              document
                .querySelectorAll(".sx_lis")
                [index].classList.add("bored");
            }
          });
        }
        this.$confirm("进行二次确认, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.rightList.checkRegisterVOList.forEach((item, index) => {
              if (item.isNormal == true) {
                item.isNormal = 1;
              } else {
                item.isNormal = 0;
              }
            });
            this.rightList.affixList = this.dataList;
            this.rightList.userNow = this.conData.userNow;
            checkFinish(this.rightList).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "点检完成!"
                });
                this.getModel("DART_DJ");
                this.dataId = res.data.data;
                this.getData(this.checkId);
                this.num = 0;
                let clas = document.querySelectorAll(".bored");
                if (clas.length > 0) {
                  clas.forEach(item => {
                    item.classList.remove("bored");
                  });
                }
                this.rightList.checkRegisterVOList.forEach(item => {
                  if (item.isNormal == 1) {
                    item.isNormal = true;
                  } else {
                    item.isNormal = false;
                  }
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消点检"
            });
            this.num = 0;
            let clas = document.querySelectorAll(".bored");
            if (clas.length > 0) {
              clas.forEach(item => {
                item.classList.remove("bored");
              });
            }
          });
      }
      }else if(this.old==2||this.old==3){
          this.$message({
              type: "warning",
              message: "已点检,不能再提交流程"
            });
      }
    },
    //报修班组
    getUserList() {
      getAll().then(res => {
        this.userList = res.data.data;
        this.userList.forEach(ele => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    },
    //上传附件
    init() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId,
        affixType: this.affixType
      };
      this.fileList = [];
      this.dataList = [];
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
            this.dataList.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadAction(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId);
      form.append("affixType", this.affixType);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId,
              fileName: res.data.data.originalFileName
            });
            this.dataList.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemove(file, fileList) {
      this.dataList.forEach(ele => {
        if (file.isEdit == 1) {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        } else {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        }
      });
    },
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
          file.raw.fileId}&dataSrcId=${file.dataSrcId ||
          ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemove(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload(file) {
      this.loading = true;
      const fileSize = file.size / 1024 / 1024 < 30;
      if (!fileSize) {
        this.loading = false;
        this.$message.error("上传文件大小不能超过 30MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    }
  },
  created() {
    localStorage.removeItem("recoType");
    localStorage.removeItem("datumType");
    localStorage.removeItem("repamType");
    this.old=this.$route.query.old
    this.equipNum = this.$route.query.equipNum;
    this.checkId = this.$route.query.checkId;
    this.mainId = this.$route.query.checkId;
    this.init();
    this.getData(this.checkId);
    localStorage.removeItem("type");
    this.getUserList();
    this.imgList=[];
    if(this.$route.query.old==2||this.$route.query.old==3){
      this.disabled=true
    }
  }
};
</script>
<style scoped lang="scss">
body {
  font-size: 15px;
}
.sx_spot_btns{
  .btn1 {
  color: #409eff;
}
.btn2 {
  color: #409eff;
}
.active {
  background: #409eff !important;
  color: #fff !important;
}
}

.textare .el-textarea__inner {
  border: none !important;
}
.bored {
  border: 1px solid red;
}
</style>
