<template>
    <div style="width:100%;padding:0 20px;">
        <el-form :model="addList" :label-position='labelPosition' :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
            <el-row :gutter="20">
                <h3>售后回访</h3>
                <el-col :span="ispc">
                    <el-form-item label="合同号:" prop="paperContractNo">
                        <el-select size="small" v-model="addList.paperContractNo" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getContractId" @change="contractIdChange">
                                <el-option
                                    v-for="item in contractIds"
                                    :key="item.paperContractNo"
                                    :label="item.paperContractNo"
                                    :value="item.paperContractNo">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="关联单号:" prop="relateFormName">
                            <el-input size="small" v-model="addList.relateFormName"></el-input>
                    </el-form-item>
                    <el-form-item label="客户名称:" prop="clientInfo">
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getClientId"  style="width:100%" @change="clientIdChange">
                                <el-option
                                    v-for="item in clientIds"
                                    :key="item.value.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="客户联系人:" prop="contactPersonName">
                        <el-input size="small" v-model="addList.contactPersonName"></el-input>  
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="telephone">
                        <el-input size="small" v-model="addList.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="服务工程师:" prop="engineerIds">
                            <el-select size="small" v-model="addList.engineerIds" value-key="id" filterable multiple remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getChargeStaff" style="width:100%">
                                <el-option
                                    v-for="item in chargeStaffs"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="售后服务结果:" prop="afterServiceResult">
                        <el-input size="small" v-model="addList.afterServiceResult" placeholder="请输入售后服务结果" type="textarea" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="服务态度和质量:" prop="giveService">
                            <el-select size="small" v-model="addList.giveService"   placeholder="请选择服务态度和质量"  style="width:100%" clearable @clear='scoreClear(addList.giveService)' @change="score">
                                <el-option
                                    v-for="item in giveServices"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="人员技能:" prop="personSkill">
                            <el-select size="small" v-model="addList.personSkill"   placeholder="请选择人员技能"  style="width:100%" clearable @clear='scoreClear(addList.personSkill)' @change="score">
                                <el-option
                                    v-for="(item,index) in renyjneng"
                                    :key="index"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='ispc'>
                    <el-form-item label="回访单号:" prop="oddNum">
                        <el-input size="small" v-model="addList.oddNum" placeholder="自动生成" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间:" prop="createTime">
                            <el-input size="small" v-model="addList.createTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="审批状态:" prop="flowStatus">
                            <el-select size="small" v-model="addList.flowStatus" disabled  placeholder="请选择审批状态"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="审批结束时间:" prop="flowCompletedTime">
                            <el-input size="small" v-model="addList.flowCompletedTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客户详细地址:" prop="detailAddress">
                        <el-input size="small" v-model="addList.detailAddress" placeholder="请输入客户详细地址" type="textarea" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="服务及时性:" prop="timelyService">
                            <el-select size="small" v-model="addList.timelyService"   placeholder="请选择服务及时性"  style="width:100%" clearable @clear='scoreClear(addList.timelyService)' @change="score">
                                <el-option
                                    v-for="item in timelyServices"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="综合得分:" prop="synthesizeScore">
                            <el-input size="small" placeholder="自动生成" v-model="addList.synthesizeScore" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;" v-if='ispc==12'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
            <el-button type="primary" @click="close()"  size="small" icon="el-icon-close">取消</el-button>
        </div>
        <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
        </div>
    </div>
</template>
<script>
import { getContractBySearch } from "@/api/biz/crm/xsdd";
import {
  blurrySelect,
  getUserInfoBySearch,
  addDefaultVaule
} from "@/api/biz/crm/xmbd";
import { getDictByCode, getDictBizByCode } from "@/api/system/dict";
import { save, detail } from "@/api/biz/cs/shhf";
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
import { getData } from "@/api/biz/cs/shxsdd";
import { azsqData, tssqData, wbsqData } from "@/api/biz/cs/factory";
export default {
  props: {
    api: {
      type: Function,
      default: null
    },
    turnoff: {
      type: Function,
      default: null
    },
    detailId: {
      type: String,
      default: null
    },
    nodeAlias: {
      type: String,
      default: null
    },
    editFlag: {
      type: Boolean,
      default: null
    },
    proDefId: { type: String, default: null },
    functionId: { type: String, default: null },
    nodeCode: { type: String, default: null },
    diaType: { type: Number, default: null }
  },
  data() {
    return {
      btnLoading: false,
      addList: {
        installProductInfoVOS: []
      },
      contractIds: [],
      clientIds: [],
      chargeStaffs: [],
      statusOption: [],
      giveServices: [],
      renyjneng: [],
      timelyServices: [],
      rules: {
        paperContractNo: [{ required: true, message: "请选择合同号" }],
        clientInfo: [{ required: true, message: "请选择客户名称" }],
        engineerIds: [
          { required: true, message: "请选择服务工程师", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    open(rowId, hfId, diaType) {
      this.addList = {
        installProductInfoVOS: []
      };
      this.contractIds = [];
      this.clientIds = [];
      this.chargeStaffs = [];
      this.dataList = [];
      this.fileList = [];
      if (rowId == "") {
        this.getDefaultVal();
        if (hfId != "") {
          if (JSON.parse(localStorage.getItem("hfdj")).type == "zlfk") {
            getData(hfId).then(res => {
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            });
          } else if (JSON.parse(localStorage.getItem("hfdj")).type == "azsq") {
            azsqData(hfId).then(res => {
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            });
          } else if (JSON.parse(localStorage.getItem("hfdj")).type == "tssq") {
            tssqData(hfId).then(res => {
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            });
          } else if (JSON.parse(localStorage.getItem("hfdj")).type == "wbsq") {
            wbsqData(hfId).then(res => {
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            });
          }
        }
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.contractIds.push({
            paperContractNo: this.addList.paperContractNo
          });
          this.clientIds.push(this.addList.clientInfo);
          this.clientIds.forEach(item => {
            item.label = item.customerName;
            item.value = { customerName: item.customerName, id: item.id };
          });
          this.chargeStaffs = this.addList.engineerObjs;
        });
      }
    },
    //合同号
    getContractId(query) {
      if (query != "") {
        getContractBySearch(query).then(res => {
          this.contractIds = res.data.data;
        });
      } else {
        this.contractIds = [];
      }
    },
    contractIdChange() {
      this.clientIds = [];
      this.chargeStaffs = [];
      this.contractIds.forEach(item => {
        if (item.paperContractNo == this.addList.paperContractNo) {
          this.$set(this.addList, "clientInfo", item.clientInfo);
          this.clientIds.push(item.clientInfo);
          this.clientIds.forEach(item => {
            item.label = item.customerName;
            item.value = { customerName: item.customerName, id: item.id };
          });
        }
      });
    },
    //客户名称
    getClientId(query) {
      if (query != "") {
        blurrySelect(query).then(res => {
          this.clientIds = res.data.data;
          this.clientIds.forEach(item => {
            let arr = {
              customerName: item.customerName,
              id: item.id
            };
            item.label = item.customerName;
            item.value = arr;
          });
        });
      } else {
        this.clientIds = [];
      }
    },
    clientIdChange() {
      this.clientIds.forEach(item => {
        if (this.addList.clientInfo.id == item.id) {
          this.$set(this.addList, "contactPersonName", item.relation);
          this.$set(this.addList, "telephone", item.contactNumber);
        }
      });
    },
    //服务工程师
    getChargeStaff(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.chargeStaffs = res.data.data;
        });
      }
    },
    getDefaultVal() {
      addDefaultVaule("CS_SHHF").then(res => {
        this.$set(this.addList, "createTime", res.data.data.CREATE_TIME);
        this.$set(
          this.addList,
          "createUserName",
          res.data.data.CREATE_USER_NAME
        );
        this.$set(this.addList, "flowStatus", res.data.data.FLOW_STATUS);
      });
    },
    //综合得分
    score() {
      if (this.addList.giveService && this.addList.giveService != "") {
        if (this.addList.personSkill && this.addList.personSkill != "") {
          if (this.addList.timelyService && this.addList.timelyService != "") {
            this.addList.synthesizeScore = (
              (Number(this.addList.giveService) +
                Number(this.addList.personSkill) +
                Number(this.addList.timelyService)) /
              3
            ).toFixed(2);
          }
        }
      }
    },
    scoreClear(gpts) {
      (gpts = ""), (this.addList.synthesizeScore = "");
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    //服务态度
    getFanTypes() {
      getDictBizByCode("cs_fwtd").then(res => {
        this.$set(this, "giveServices", res.data.data);
      });
    },
    //人员技能
    getRenyjneng() {
      getDictBizByCode("cs_ryjn").then(res => {
        this.$set(this, "renyjneng", res.data.data);
      });
    },
    //服务及时性
    getTimelyServices() {
      getDictBizByCode("cs_fwjsx").then(res => {
        this.$set(this, "timelyServices", res.data.data);
      });
    },
    //保存
    rowSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.addList.affixList = this.fileList;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.turnoff();
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("hfdj");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    close() {
      this.turnoff();
      localStorage.removeItem("hfdj");
    }
  },
  created() {
    this.getStatus();
    this.getFanTypes();
    this.getRenyjneng();
    this.getTimelyServices();
    if (this.detailId) {
      this.open(this.detailId, "", this.diaType);
    }
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.ispc = 24;
            this.labelPosition='left'
    } else {
            this.ispc = 12;
            this.labelPosition='right'
    }
  }
};
</script>
<style>
</style>

