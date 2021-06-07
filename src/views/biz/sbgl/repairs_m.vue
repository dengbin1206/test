<template>
    <el-container style="background:rgb(235,235,235);width:100%;height:100%">
        <el-header style='padding:0;background:#fff;'>
             <el-row style="width:100%">
                    <el-col :span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col :span="22" style="text-align:center;line-height:60px">
                        <h4 style='margin:0;padding-right:8%;font-size:18px'>设备报修申请单</h4>
                    </el-col>
                </el-row>
        </el-header>
        <el-main style="background:rgb(235,235,235)">
            <!--<div style='width:100%;height:50px'>
                <el-button-group style='width:100%;margin:0;height:100%' class="sx_repairs_btns">
                    <el-button class='btn1 active' size='small' style='width:50%;border-top-left-radius:7px;border-bottom-left-radius:7px;height:100%;fonst-size:15px' @click="tabs(1)">报修信息</el-button>
                    <el-button class='btn2' size='small' style='width:50%;border-top-right-radius:7px;border-bottom-right-radius:7px;height:100%;fonst-size:15px' @click="tabs(2)">维修登记</el-button>
                </el-button-group>
            </div>-->
            <div style="width:100%" v-show="disvis==true">
                <el-row style="width:100%;margin:0;border-radius:5px;">
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">报修单号</span>
                        <span style="float:right">{{dataList.repairCode}}</span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;"><span style="font-size:15px;color:red">*</span>维修种类</span>
                        <span style="float:left;width:70%;">
                            <el-select size="small" v-model="dataList.repairType"  placeholder="请选择维修种类" style="width:100%;margin:0">
                                <el-option
                                   v-for="item in wxzlOption"
                                   :key="item.dictKey"
                                   :label="item.dictValue"
                                   :value="item.dictKey"
                                >
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" class="textare" >
                        <p><span style="font-size:15px;color:red">*</span>故障反应</p>
                        <p>
                            <el-input :disabled="disabled" type='textarea' rows='3' maxlength="100" show-word-limit v-model="dataList.failureResponse" placeholder="请输入内容" size='small'></el-input>
                        </p>
                    </el-col>
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left;">设备名称</span>
                        <span style="float:right">{{dataList.equipName}}</span>
                    </el-col>
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备型号</span>
                        <span style="float:right">{{dataList.modelNum}}</span>
                    </el-col>
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">设备编号</span>
                        <span style="float:right">{{dataList.equipNum}}</span>
                    </el-col>

                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">安装位置</span>
                        <span style="float:right">{{dataList.installPosition}}</span>
                    </el-col>
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">报修人</span>
                        <span style="float:right">{{dataList.repairPersonName}}</span>
                    </el-col>
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">报修时间</span>
                        <span style="float:right">{{dataList.repairTime}}</span>
                    </el-col>
                </el-row>
            </div>
          <!--
            <div style="width:100%" v-show="disvis==false">
                <el-row style="width:100%;margin:0;border-radius:5px;">
                    <el-col style="background:#fff;padding:10px 10px;margin-bottom:1px;">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;">维修方式</span>
                        <span style="float:left;width:70%;">
                            <el-select size="small" v-model="dataList.repairMode"  placeholder="请选择维修方式" style="width:100%" disabled>
                                <el-option
                                   v-for="item in typeOption"
                                   :key="item.dictKey"
                                   :label="item.dictValue"
                                   :value="item.dictKey"
                                >
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" class="textare">
                        <p>维修内容</p>
                        <p>
                            <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="dataList.repairContent" placeholder="请输入维修内容" size='small' disabled></el-input>
                        </p>
                    </el-col>
                    <el-col style="background:#fff;padding:10px 10px;margin-bottom:1px;"  class="textare">
                        <p>更换配件</p>
                        <p>
                            <el-input type='textarea' rows='3' maxlength="100" show-word-limit v-model="dataList.replacementParts" placeholder="请输入配件信息" size='small' disabled></el-input>
                        </p>
                    </el-col>
                </el-row>
            </div>
            -->
        </el-main>
        <el-footer style="height:50px;display:flex;font-size:12px;background:rgb(242, 242, 242);line-height:20px;">
                <div style="display:flex;flex-direction: column;height:100%;padding:5px 0;width:50%;text-align:center;"  @click='handleStartFlow'><i class="el-icon-s-promotion" style="font-size:17px;margin-top:5px;"></i><span style="height:20px">提交流程</span></div>
                <div style="display:flex;flex-direction: column;height:100%;padding:5px;width:50%;text-align:center"  @click="record"><i class="el-icon-s-order" style="font-size:17px;margin-top:5px;"></i><span  style="height:20px">历史维修记录</span></div>
        </el-footer>
    </el-container>
</template>
<script>
import fileUpload from "@/components/fileUpload";
import { detail, submit, modelByName, blurrySelect } from "@/api/biz/sbgl";
import { getDictBizByCode } from "@/api/system/dict";
import { getAll } from "@/api/flow/flow";
import { startFlow } from "@/api/tool/dynamic";
export default {
  components: {
    fileUpload
  },
  data() {
    return {
      disvis: true,
      checked: 1,
      type: "",
      checkId: "",
      equipId: "",
      dataList: {},
      wxzlOption: [],
      userList: [],
      typeOption: [
        {
          dictValue: "内部维修",
          dictKey: "1"
        }
      ],
      options: []
    };
  },
  methods: {
    tabs(old) {
      document.querySelector(".active").classList.remove("active");
      let btn = ".btn" + old;
      document.querySelector(btn).classList.add("active");
      if (old == 1) {
        this.disvis = true;
      } else if (old == 2) {
        this.disvis = false;
      }
    },
    //回退
    rollback() {
      let repaType = localStorage.getItem("repaType");
      if (repaType == 1) {
        this.$router.push({
          path: "/biz/sbgl/message",
          query: {
            asd: this.$route.query.asd
          }
        });
      }
      if (repaType == 2) {
        this.$router.push({
          path: "/biz/sbgl/spot",
          query: {
            equipNum: this.$route.query.equipNum,
            checkId: this.$route.query.id
          }
        });
      }
      if (repaType == 4) {
        this.$router.push({
          path: "/biz/sbgl/check",
          query: {
            equipNum: this.$route.query.equipNum
          }
        });
      }
    },
    remoteMethod(query) {
      if (query != "") {
        blurrySelect(query).then(res => {
          this.options = res.data.data;
        });
      }
    },
    getList(equipId) {
      let params = {
        equipId: equipId
      };
      detail(params).then(res => {
        this.dataList = res.data.data;
        this.options = [
          {
            errorMsg: res.data.data.errorMsg,
            errorCode: res.data.data.failureResponse
          }
        ];
      });
    },
    wxzl(type) {
      getDictBizByCode(type).then(res => {
        this.wxzlOption = res.data.data;
      });
    },
    wxtype(type) {
      getDictBizByCode(type).then(res => {
        this.typeOption = res.data.data;
        if (this.dataList.repairMode != "2") {
          this.dataList.repairMode = "1";
        }
      });
    },
    getUserList() {
      getAll().then(res => {
        this.userList = res.data.data;
        this.userList.forEach(ele => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    },
    //获取模型Id
    getModel(modelName) {
      modelByName(modelName).then(res => {
        if (res.data.code == 200) {
          this.startFlow(res.data.data.id);
        }
      });
    },
    //启动流程
    startFlow(a) {
      startFlow({
        flowKey: "SBGL_BX_DART",
        formType: "S",
        modelId: a,
        dataId: this.dataList.id,
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
    //保存并提交流程
    handleStartFlow() {
      if(this.dataList.repairType==""){
        this.$message({
          type: "error",
          message: "维修种类不能为空"
        })
        return;
      }
      if(this.dataList.failureResponse==""){
        this.$message({
          type: "error",
          message: "故障反应不能为空"
        });
        return;
      }
        submit(this.dataList).then(res => {
          if (res.data.code == 200) {
            this.dataList.id = res.data.data.id;
            if (this.dataList.repairMode != 2) {
              this.dataList.repairMode = 1;
              this.typeOption = [{dictKey: 1, dictValue: "内部维修"}];
            }
            this.options = [
              {
                errorMsg: res.data.data.errorMsg,
                errorCode: res.data.data.failureResponse
              }
            ];
            this.getModel("SBBX");
          }
        });
    },
    //维修历史记录
    record() {
      localStorage.setItem("recoType", 3);
      this.$router.push({
        path: "/biz/sbgl/record",
        query: {
          checkId: this.checkId,
          equipId: this.equipId,
          equipNum: this.$route.query.equipNum
        }
      });
    }
  },
  created() {
    localStorage.removeItem("recoType");
    this.checkId = this.$route.query.id;
    this.equipId = this.$route.query.equipId;
    this.getList(this.equipId);
    this.wxzl("sbgl_wxzl");
    this.wxtype("sbgl_wxfs");
    this.getUserList();
  }
};
</script>
<style lang="scss">
body {
  font-size: 15px;
  color: #000;
}
.sx_repairs_btns{
  .btn1 {
  color: #409eff;
  font-size: 15px !important;
}
.btn2 {
  color: #409eff;
  font-size: 15px !important;
}
.active {
  background: #409eff !important;
  color: #fff !important;
}
}

.textare .el-textarea__inner {
  border: none !important;
}
</style>
