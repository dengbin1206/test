<template>
    <div style="width:100%;padding:0 20px;">
        <el-form :model="addList" :label-position='labelPosition' :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
            <el-row :gutter="20">
                <h3>责任认定基本信息</h3>
                <el-col :span="ispc">
                    <el-form-item label="业务类型:" prop="serviceType">
                            <el-radio-group v-model="addList.serviceType" size="small">
                                <el-radio label="1">保内</el-radio>
                                <el-radio label="2">保外</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="合同号:" prop="paperContractNo">
                        <el-select size="small" v-model="addList.paperContractNo" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getContractId" @change="contractIdChange">
                                <el-option
                                    v-for="item in contractIds"
                                    :key="item.id"
                                    :label="item.paperContractNo"
                                    :value="item.paperContractNo">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="客户名称:" prop="clientInfo">
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getClientId"  style="width:100%">
                                <el-option
                                    v-for="item in clientIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="负责员工:" prop="chargeStaff">
                            <el-select size="small" v-model="addList.chargeStaff" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getChargeStaff" style="width:100%" @change="chargeStaffChange">
                                <el-option
                                    v-for="item in chargeStaffs"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="部门:" prop="departmentName">
                            <el-input size="small" v-model="addList.departmentName" placeholder="自动带出" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='ispc'>
                    <el-form-item label="责任单号:" prop="oddNum">
                        <el-input size="small" v-model="addList.oddNum" placeholder="自动生成" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="关联单号:" prop="relateFormName">
                        <el-input size="small" v-model="addList.relateFormName" placeholder="自动生成" disabled></el-input>
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
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处理结果描述:" prop="resultRemark">
                        <el-input size="small" v-model="addList.resultRemark" placeholder="来源质量反馈单" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-table
                    :data="addList.blameProductInfoVOS"
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    max-height="370"
                    border
                    size='small'
                    style="width: 100%">
                    <el-table-column type='index' width="55"></el-table-column>
                    <el-table-column  prop="rowNumber" label="行号" width="70"></el-table-column>
                    <el-table-column prop="markerNum" label="合同标的" width="150"></el-table-column>
                    <el-table-column  prop="fanType" label="风机类型" width="150">
                         <template slot-scope="scope">
                            <el-select v-model="scope.row.fanType" placeholder="请选择风机类型" size="small" style="width:100%" clearable disabled>
                                <el-option v-for="item in fanTypes" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="factoryNum" label="出厂编号" width="150"></el-table-column>
                    <el-table-column  prop="faultParts" label="故障部件" width="150"></el-table-column>
                    <el-table-column  prop="goodsNum" label="数量" width="150"></el-table-column>
                    <el-table-column  prop="directDuty" label="直接责任承担(共同承担则为多个)" width="200">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.directDuty"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="remarks" label="备注(费用承担比例等)" width="150">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.remarks"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="followPerson" label="后续跟进人" width="150">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.followPerson"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="isFinish" label="是否落实完成" width="150">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.isFinish"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;" v-if='ispc==12'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
            <el-button type="primary" @click="rowsub('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.sub_btn">保存并提交</el-button>
            <el-button type="primary" @click="close()"  size="small" icon="el-icon-close" v-if="btnList.close_btn">取消</el-button>
        </div>
        <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
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
import { save, detail } from "@/api/biz/cs/duty";
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
import { getData } from "@/api/biz/cs/shxsdd";
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
      ispc:12,
      labelPosition:'right',
      btnList:{
        save_btn:false,
        sub_btn:false,
        close_btn:false
      },
      btnLoading: false,
      addList: {
        blameProductInfoVOS: []
      },
      contractIds: [],
      clientIds: [],
      chargeStaffs: [],
      statusOption: [],
      fanTypes: [],
      rules: {
        serviceType: [{ required: true, message: "请选择业务类型" }],
        paperContractNo: [{ required: true, message: "请选择合同号" }],
        clientInfo: [{ required: true, message: "请选择客户名称" }],
        chargeStaff: [{ required: true, message: "请选择负责员工" }]
      }
    };
  },
  methods: {
    open(rowId, zrId, diaType) {
      this.addList = {
        blameProductInfoVOS: []
      };
      this.contractIds = [];
      this.clientIds = [];
      this.chargeStaffs = [];
      if(diaType==1||diaType==2){
        this.btnList.save_btn=true
        this.btnList.sub_btn=true
        this.btnList.close_btn=true
      }else{
        this.btnList.save_btn=false
        this.btnList.sub_btn=false
        this.btnList.close_btn=false
      }
      if (rowId == "") {
        this.getDefaultVal();
        if (zrId != "") {
          getData(zrId).then(res => {
            this.addList.relateFormName=res.data.data.relateFormName;
            this.addList.relateFormId=res.data.data.relateFormId;
            this.addList.clientInfo = res.data.data.clientInfo;
            this.addList.chargeStaff = res.data.data.chargeStaff;
            this.addList.departmentName = res.data.data.departmentName;
            this.addList.departmentId = res.data.data.departmentId;
            this.addList.clientClazz = res.data.data.clientClazz;
            this.addList.paperContractNo = res.data.data.paperContractNo;
            this.addList.blameProductInfoVOS=res.data.data.feedbackProductInfoVOS
            this.chargeStaffs.push(res.data.data.chargePerson)
            this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
            });
            this.clientIds.push(res.data.data.clientInfo)
            this.clientIds.forEach(item => {
              item.label = item.customerName;
              item.value = { customerName: item.customerName, id: item.id };
            });
            if (this.addList.blameProductInfoVOS.length > 0) {
              this.addList.blameProductInfoVOS.forEach((item, index) => {
                item.fanType = item.productType
                item.id=''
              });
            }
          });
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
          this.chargeStaffs.push(this.addList.chargePerson);
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
          this.$set(this.addList, "chargeStaff", item.chargeStaff);
          this.chargeStaffs.push(item.chargePerson);
          this.$set(this.addList, "departmentName", item.departmentName);
          this.$set(this.addList, "departmentId", item.departmentId);
          this.$set(
            this.addList,
            "blameProductInfoVOS",
            item.productContractInfoVOS
          );
          if (this.addList.blameProductInfoVOS.length > 0) {
            this.addList.blameProductInfoVOS.forEach((item, index) => {
              item.rowNumber = (index + 1) * 10;
              item.id = "";
            });
          }
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
    //负责员工
    getChargeStaff(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.chargeStaffs = res.data.data;
        });
      }
    },
    chargeStaffChange() {
      this.chargeStaffs.forEach(item => {
        if (item.id == this.addList.chargeStaff) {
          this.$set(this.addList, "departmentName", item.deptName);
          this.$set(this.addList, "departmentId", item.deptId);
        }
      });
    },
    getDefaultVal() {
      addDefaultVaule("CS_ZRRD").then(res => {
        this.$set(this.addList, "createTime", res.data.data.CREATE_TIME);
        this.$set(
          this.addList,
          "createUserName",
          res.data.data.CREATE_USER_NAME
        );
        this.$set(this.addList, "flowStatus", res.data.data.FLOW_STATUS);
      });
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    //风机类型
    getFanTypes() {
      getDictBizByCode("crm_product_type").then(res => {
        this.$set(this, "fanTypes", res.data.data);
      });
    },
    //保存
    rowSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.turnoff();
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("zrrd");
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
    //保存并提交
    rowsub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("zrrd");
              this.getModel("CS_ZRRD");
              this.dataId = res.data.data;
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
    //获取模型Id
    getModel(modelName) {
      modelByName(modelName).then(res => {
        if (res.data.code == 200) {
          this.startFlow(res.data.data.id);
        }
      });
    },
    //启动流程
    startFlow(id) {
      startFlow({
        flowKey: "CS_ZRRD_DART",
        formType: "S",
        modelId: id,
        dataId: this.dataId,
        variables: {
          functionPath: this.$route.fullPath
        }
      }).then(res => {
        if ((res.data.code = 200)) {
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.turnoff();
        }
      });
    },
    close() {
      this.turnoff();
      localStorage.removeItem("zrrd");
    }
  },
  created() {
    this.getStatus();
    this.getFanTypes();
    if(this.detailId){
      this.open(this.detailId,'',this.diaType)
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

