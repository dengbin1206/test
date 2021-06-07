<template>
    <div style="width:100%;height:auto">
        <div  style="width:100%;height:auto" v-show="pc==true">
            <el-form  label-width="130px"  :model='wxForm' :rules="rules" ref="ruleForm" class="sx_formItem">
                <el-row>
                    <el-col :span='12'>
                    <el-form-item label="报修单号:" prop='repairCode'>
                        <el-input v-model="wxForm.repairCode" placeholder="请输入报修单号"  size="small" disabled/>
                    </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="报修人:" prop='repairPersonName'>
                        <el-input v-model="wxForm.repairPersonName" placeholder="请输入报修人"  size="small" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="设备名称:" prop='equipName'>
                            <el-input v-model="wxForm.equipName" placeholder="请输入设备名称"  size="small" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="设备型号:" prop='modelNum'>
                        <el-input v-model="wxForm.modelNum" placeholder="请输入设备型号"  size="small" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="设备编号:" prop='equipNum'>
                            <el-input v-model="wxForm.equipNum" placeholder="请输入设备编号"  size="small" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="安装位置:" prop='installPosition'>
                            <el-input v-model="wxForm.installPosition" placeholder="请输入安装位置"  size="small" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="报修时间:" prop='repairTime'>
                            <el-input v-model="wxForm.repairTime" placeholder="请输入报修时间"  size="small" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="维修种类:" prop='repairType'>
                        <el-select size="small" style="width:100%" v-model='wxForm.repairType' clearable :disabled="!editFlag">
                                        <el-option
                                            v-for="item in wxzlOption"
                                            :key="item.value"
                                            :label="item.dictValue"
                                            :value="item.dictKey">
                                        </el-option>
                                    </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="故障反应:" prop='failureResponse' >
                            <el-input type="textarea" v-model="wxForm.failureResponse"  :disabled="!editFlag" placeholder="请输入故障反应"  size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <span>以下维修人员填写</span>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="维修开始时间:" prop='repairStartTime' >
                        <el-date-picker  :disabled="!editFlag"
                                        v-model="wxForm.repairStartTime"
                                        type="datetime"
                                        size='small'
                                        format='yyyy-MM-dd HH:mm:ss'
                                        value-format='yyyy-MM-dd HH:mm:ss'
                                        style='width:100%'
                                        placeholder="选择日期时间">
                        </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="维修结束时间:" prop='repairEndTime' >
                        <el-date-picker :disabled="!editFlag"
                                        v-model="wxForm.repairEndTime"
                                        type="datetime"
                                        size='small'
                                        format='yyyy-MM-dd HH:mm:ss'
                                        value-format='yyyy-MM-dd HH:mm:ss'
                                        style='width:100%'
                                        placeholder="选择日期时间">
                        </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="更换配件:" prop='replacementParts' >
                            <el-input v-model="wxForm.replacementParts" placeholder="请输入更换配件" :disabled="!editFlag"  size="small" />
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="维修内容:" prop='repairContent' >
                            <el-input v-model="wxForm.repairContent" placeholder="请输入维修内容" :disabled="!editFlag"  size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="维修方式:" prop='repairMode' >
                        <el-select size="small" style="width:100%" v-model='wxForm.repairMode' :disabled="!editFlag">
                            <el-option
                            v-for="item in wxfsOption"
                            :key="item.dictKey"
                            :label="item.dictValue"
                            :value="item.dictKey">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'  v-show="repairChange" >
                        <el-form-item label="维修负责人:" prop='repairChange'>
                        <el-select :disabled="!editFlag"
                                v-model="wxForm.repairChange"
                                filterable
                                remote
                                reserve-keyword
                                size="small"
                                placeholder="请输入关键词"
                                value-key="userId"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                v-for="item in userList"
                                :key="item.userId"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12' v-show="repairUserList">
                        <el-form-item label="维修人员:" prop='repairUserList'>
                        <el-select :disabled="!editFlag"
                                v-model="wxForm.repairUserList"
                                filterable
                                remote
                                multiple
                                reserve-keyword
                                size="small"
                                placeholder="请输入关键词"
                                value-key="userId"
                                :remote-method="repairSearch"
                                :loading="loading">
                                <el-option
                                v-for="item in userOption"
                                :key="item.userId"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom:20px;">
                    <el-col :span='24' style="text-align:right">
                        <el-button type="primary" size="small" style="font-size:15px;" v-show="editFlag" @click="sub('1')">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div  style="width:100%;height:auto" v-show="pc==false" class="sx_sj">
            <div style='width:100%;height:50px'>
                <el-button-group style='width:100%;margin:0;height:100%' class="sx_equip_btns">
                    <el-button class='btn1 active' size='small' style='width:50%;border-top-left-radius:7px;border-bottom-left-radius:7px;height:100%;fonst-size:15px' @click="tabs(1)">报修信息</el-button>
                    <el-button class='btn2' size='small' style='width:50%;border-top-right-radius:7px;border-bottom-right-radius:7px;height:100%;fonst-size:15px' @click="tabs(2)">维修登记</el-button>
                </el-button-group>
            </div>
            <div style="width:100%" v-show="disvis==true">
                <el-row style="width:100%;margin:0;border-radius:5px;">
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">报修单号</span>
                        <span style="float:right">{{dataList.repairCode}}</span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;"><span style="font-size:15px;color:red">*</span>维修种类</span>
                        <span style="float:left;width:70%;">
                            <el-select size="small" v-model="dataList.repairType"  placeholder="请选择设备种类" style="width:100%;margin:0">
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
                        <span style="float:right">{{dataList.createTime}}</span>
                    </el-col>
                    <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                        <span style="float:left">报修班组</span>
                        <span style="float:right">{{dataList.chargeTeam}}</span>
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%" v-show="disvis==false">
                <el-row style="width:100%;margin:0;border-radius:5px;">
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;border-top-left-radius:7px;border-top-right-radius:7px;">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;">维修开始时间</span>
                        <span style="float:left;width:70%;">
                            <el-date-picker
                                v-model="dataList.repairStartTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style='width:100%'
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;">维修结束时间</span>
                        <span style="float:left;width:70%;">
                            <el-date-picker
                                v-model="dataList.repairEndTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style='width:100%'
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" v-show='repairChange'>
                        <span style="float:left;width:30%;text-align:left;line-height:32px;">维修负责人</span>
                        <span style="float:left;width:70%;">
                            <el-select
                                v-model="dataList.repairChange"
                                filterable
                                remote
                                reserve-keyword
                                size="small"
                                placeholder="请输入关键词"
                                value-key="userId"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                v-for="item in userList"
                                :key="item.userId"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" v-show="repairUserList">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;">维修人员</span>
                        <span style="float:left;width:70%;">
                            <el-select
                                v-model="dataList.repairUserList"
                                filterable
                                remote
                                multiple
                                reserve-keyword
                                size="small"
                                value-key="userId"
                                placeholder="请输入关键词"
                                :remote-method="repairSearch"
                                :loading="loading">
                                <el-option
                                v-for="item in userOption"
                                :key="item.userId"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <el-col style="background:#fff;padding:10px 10px;margin-bottom:1px;">
                        <span style="float:left;width:30%;text-align:left;line-height:32px;">维修方式</span>
                        <span style="float:left;width:70%;">
                            <el-select size="small" v-model="dataList.repairMode"  placeholder="请选择维修方式" style="width:100%">
                                <el-option
                                   v-for="item in wxfsOption"
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
                            <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="dataList.repairContent" placeholder="请输入维修内容" size='small'></el-input>
                        </p>
                    </el-col>
                    <el-col style="background:#fff;padding:10px 10px;margin-bottom:1px;"  class="textare">
                        <p>更换配件</p>
                        <p>
                            <el-input type='textarea' rows='3' maxlength="100" show-word-limit v-model="dataList.replacementParts" placeholder="请输入配件信息" size='small'></el-input>
                        </p>
                    </el-col>
                </el-row>
            </div>
            <el-row style="margin:10px 0">
                <el-col>
                    <el-button type="primary" size="small" style="width:100%;height:50px;font-size:15px;" @click="sub('2')" v-show="editFlag">保存</el-button>
                </el-col>
            </el-row>
        </div>
    </div>

</template>
<script>
import { getDictBizByCode } from "@/api/system/dict";
import { getAll } from "@/api/flow/flow";
import { submit, flows, searchDetail } from "@/api/biz/sbgl";
export default {
  props: ["nodeAlias", "dataId", "editFlag"],
  data() {
    return {
      pc: true,
      wxzlOption: [],
      userOption: [],
      wxForm: {},
      userList: [],
      wxfsOption: [],
      disvis: true,
      dataList: {},
      repairChange: true,
      repairUserList: true
    };
  },
  methods: {
    getData() {
      flows(this.dataId).then(res => {
        if (res.data.code == "200") {
          this.wxForm = res.data.data;
          this.dataList = res.data.data;
          this.userOption = res.data.data.repairUserList;
          if (this.userOption.length > 0) {
            this.userOption.forEach(item => {
              item.label = item.name;
              item.value = { name: item.name, userId: item.userId };
            });
          }
          if (res.data.data.repairChange != {}) {
            this.userList.push(res.data.data.repairChange);
            this.userList.forEach(item => {
              item.label = item.name;
              item.value = { name: item.name, userId: item.userId };
            });
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
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
    sub(a) {
      if (a == "1") {
          if (this.wxForm.repairChange.value) {
            this.wxForm.repairChange = this.wxForm.repairChange.value;
          }
        submit(this.wxForm).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message.error("保存失败");
          }
        });
      } else {
        if (this.dataList.repairChange.value) {
          this.dataList.repairChange = this.dataList.repairChange.value;
        }
        submit(this.dataList).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message.error("保存失败");
          }
        });
      }
      console.log(a);
    },
    //维修方式
    wxtype(a) {
      getDictBizByCode(a).then(res => {
        this.wxfsOption = res.data.data;
      });
    },
    //维修种类
    wxzl(a) {
      getDictBizByCode(a).then(res => {
        this.wxzlOption = res.data.data;
      });
    },
    //维修负责人
    remoteMethod(query) {
      if (query != "") {
        searchDetail("LCGW-REPAIR_CHARGE", query).then(res => {
          this.userList = res.data.data;
          this.userList.forEach(item => {
            let arr = {
              name: item.name,
              userId: item.userId
            };
            item.label = item.name;
            item.value = arr;
          });
          console.log(this.userList);
        });
      } else {
        this.userList = [];
      }
    },
    //维修人员
    repairSearch(query) {
      if (query != "") {
        searchDetail("LCGW-REPAIR_PERSON", query).then(res => {
          this.userOption = res.data.data;
          this.userOption.forEach(item => {
            let arr = {
              name: item.name,
              userId: item.userId
            };
            item.label = item.name;
            item.value = arr;
          });
        });
      } else {
        this.userOption = [];
      }
    }
  },
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.pc = false;
    } else {
      this.pc = true;
    }
    this.wxzl("sbgl_wxzl");
    this.wxtype("sbgl_wxfs");
    /*if (this.nodeAlias == "1" || this.nodeAlias == "") {
      this.repairChange = false;
      this.repairUserList = false;
    } else {*/
      this.repairChange = true;
      this.repairUserList = true;
    //}
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.sx_sj {
  font-size: 15px;
  color: #000;
  background: rgb(235, 235, 235);
}
.sx_equip_btns {
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
