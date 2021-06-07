<template>
    <div style="width:100%;padding:0 20px;">
        <el-form :model="addList"   ref="ruleForm" label-width="150px"   class="sx_formItem" style='width:100%;'>
            <el-row :gutter="20" style="width:100%">
                <h3>基本信息</h3>
                <el-col :span="12">
                    <el-form-item label="试验种类:" prop="testTypeId" :rules="{ required:true, message: '请选择实验种类'}">
                        <el-select size="small" v-model="addList.testTypeId"  filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getTestType"  style="width:100%" @change='testTypeChange'>
                            <el-option
                                v-for="item in testOption"
                                :key="item.id"
                                :label="item.reportName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计划期:" prop="planPeriod"  :rules="{ required:requiredA?true:false, message: '请选择计划期'}">
                            <el-date-picker
                                v-model="addList.planPeriod"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择计划期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="合同号:" prop="contractNum" :rules="{ required:requiredA?true:false, message: '请输入合同号'}">
                            <!-- <el-select size="small" v-model="addList.contractId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getContract" style="width:100%">
                                <el-option
                                    v-for="item in contractIdOption"
                                    :key="item.id"
                                    :label="item.paperContractNo"
                                    :value="item.id">
                                </el-option>
                            </el-select> -->
                            <el-input size="small" v-model="addList.contractNum"  placeholder="请输入合同号"></el-input>
                    </el-form-item>
                    <el-form-item label="风机类型:" prop="fanType" :rules="{ required:requiredA?true:false, message: '请选择风机类型'}">
                            <el-select v-model="addList.fanType" size="small" placeholder="请选择风机类型">
                                    <el-option
                                        v-for="item in fanTypeOption"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                    <el-form-item label="风机型号:" prop="fanModel" :rules="{ required:requiredA?true:false, message: '请输入风机型号'}">
                            <el-input size="small" v-model="addList.fanModel" placeholder="请输入风机型号"></el-input>
                    </el-form-item>
                    <el-form-item label="样品数量:" prop="fanTotal" :rules="{ required:requiredA?true:false, message: '请输入样品数量'}">
                            <el-input size="small" v-model="addList.fanTotal" type="number" placeholder="请输入样品数量"></el-input>
                    </el-form-item>
                    <el-form-item label="产品编号:" prop="productCode" :rules="{ required:requiredA?true:false, message: '请输入产品编号'}">
                            <el-input size="small" v-model="addList.productCode"  placeholder="请输入产品编号"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商:" prop="supplier">
                            <el-input size="small" v-model="addList.supplier"  placeholder="请输入供应商"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂家:" prop="factoryName" v-if="requiredB" :rules="{ required:requiredB?true:false, message: '请输入生产厂家'}">
                            <el-input size="small" v-model="addList.factoryName"  placeholder="请输入生产厂家"></el-input>
                    </el-form-item>
                    <el-form-item label="炉号:" prop="heatNumber" v-if="requiredB" :rules="{ required:requiredB?true:false, message: '请输入炉号'}">
                            <el-input size="small" v-model="addList.heatNumber"  placeholder="请输入炉号"></el-input>
                    </el-form-item>
                    <el-form-item label="样品名称:" prop="templateName" v-if="requiredB" :rules="{ required:requiredB?true:false, message: '请输入样品名称'}">
                            <el-input size="small" v-model="addList.templateName"  placeholder="请输入样品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="规格型号:" prop="modelNum" v-if="requiredB" :rules="{ required:requiredB?true:false, message: '请输入规格型号'}">
                            <el-input size="small" v-model="addList.modelNum"  placeholder="请输入规格型号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="委托单号:" prop="entrustCode">
                            <el-input size="small" v-model="addList.entrustCode"  placeholder="自动生成" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="委托人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="委托部门:" prop="createDeptName">
                            <el-input size="small" v-model="addList.createDeptName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="委托时间:" prop="createTime">
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
                </el-col>
            </el-row>
            <el-row>
              <h3>设计参数</h3>
                <el-col :span="24" style="margin-bottom:10px;" v-show="tjcs">
                  <el-button type="primary" @click="spanAdd"  size="small">添加参数</el-button>
                </el-col>
                <el-col style="margin-bottom:10px" :span='8' v-for='(item,index) in addList.designParamVOList' :key='index'>
                     <span class='paramName' v-if="!item.isAdd">{{item.paramName}}:</span>
                     <span class='paramName' v-if="item.isAdd"><el-input style="width:95%" size="small" v-model='item.paramName' placeholder="输入参数"></el-input>:</span>
                     <span class="paramValue" v-if="!item.isAdd">
                       <el-input size="small" v-model='item.paramValue' style="width:70%"></el-input>
                     </span>
                     <span class="paramValue" v-if="item.isAdd">
                       <el-input size="small" v-model='item.paramValue' style="width:70%"></el-input><i class="el-icon-close" @click='delParam(index,item)'></i>
                     </span>
                </el-col>
            </el-row>
            <el-row>
                <h3>检测目的</h3>
                <el-input size="small" type="textarea" rows="3" v-model="addList.testPurpose" placeholder="请输入检测目的"></el-input>
            </el-row>
            <el-row>
                <h3>试验要求</h3>
                <el-input size="small" type="textarea" rows="3" v-model="addList.testRequire" placeholder="请输入试验要求"></el-input>
            </el-row>
            <el-row>
                <h3>判断依据<span style="color:red">(必填)</span></h3>
                <el-col :span="6">
                    <el-checkbox v-model="addList.judgeBasic" :true-label="1" :false-label="0" style="margin:0;">按试验大纲执行</el-checkbox>
                </el-col>
                <el-col :span="2">
                    <el-checkbox v-model="addList.specialRequire" :true-label="1" :false-label="0" @change='specialRequireChange' style="margin:0;">特殊要求</el-checkbox>
                </el-col>
                <el-col :span="16">
                    <el-input size="small" type="textarea" rows="3" v-model="addList.requireContent" placeholder="请输入特殊要求" :disabled='addList.specialRequire!=1'></el-input>
                </el-col>
            </el-row>
            <el-row>
                <h3>试验设施</h3>
                <el-select size="small" v-model="addList.testFacilityIds" filterable  multiple remote reserve-keyword placeholder="请输入关键词" :remote-method="getTestFacility" style="width:100%">
                                <el-option
                                    v-for="item in testFacilitys"
                                    :key="item.id"
                                    :label="item.facilityName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
            </el-row>
            <el-row>
                <h3>备注</h3>
                <el-input size="small" type="textarea" rows="3"  v-model="addList.otherRequire" placeholder="请输入"></el-input>
            </el-row>
            <el-row style="margin-top:20px">
                <el-col :span="12">
                    <el-form-item label="上传附件:">
                            <el-upload
                                    class="upload-demo"
                                    action="aaa"
                                    :http-request="uploadAction"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-remove="beforeRemove"
                                    :before-upload="beforeUpload"
                                    :on-success="uploadSuccessFile"
                                    :file-list="fileList"
                                >
                                <el-button size="small" type="primary" v-show="djsc">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip"></div>
                            </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;">
                    <el-button type="primary" @click="savebtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-show="btn_save">保存</el-button>
                    <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-show="btn_sub">保存并提交</el-button>
                    <el-button @click="close()" size="small" icon="el-icon-close" v-show="btn_close">取 消</el-button>
            </div>
    </div>
</template>
<script>
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import {
  reportTypeBySearch,
  save,
  detail,
  designByTypeId,
  selectBySearch
} from "@/api/biz/guarantee/orderTicket";
import { getContractBySearch } from "@/api/biz/crm/xsdd";
import { getUserInfoBySearch } from "@/api/biz/crm/xmbd";
import { addDefaultVaule } from "@/api/biz/crm/xmbd";
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
export default {
  props: {
    api: {
      type: Function,
      default: null
    },
    turnoff: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      requiredA: false,
      requiredB: false,
      tjcs: false,
      djsc: false,
      btn_save: false,
      btn_sub: false,
      btn_close: false,
      btnLoading: false,
      dataId: "",
      addList: {},
      testOption: [],
      testFacilitys: [],
      contractIdOption: [],
      fanTypeOption: [],
      personOption: [],
      statusOption: [],
      fileList: [],
      dataList: [],
      dataSrcId: "CRM_CSWT",
      affixType: "CRM_CSWT#AFFIX_UPLOAD",
      mainId: ""
    };
  },
  methods: {
    open(rowId, diaType) {
      if (diaType == 1 || diaType == 2) {
        this.tjcs = true;
        this.djsc = true;
        this.btn_save = true;
        this.btn_sub = true;
        this.btn_close = true;
      } else if (diaType == 3 || diaType == 5) {
        this.tjcs = false;
        this.djsc = false;
        this.btn_save = false;
        this.btn_sub = false;
        this.btn_close = false;
      } else if (diaType == 4) {
        this.tjcs = false;
        this.djsc = false;
        this.btn_save = true;
        this.btn_sub = false;
        this.btn_close = false;
      }
      this.btnLoading = false;
      this.addList = {
        entrustPersonId: "",
        entrustDate: "",
        entrustDeptId: "",
        entrustDeptName: "",
        createUserName: "",
        createTime: "",
        flowCompletedTime: "",
        flowStatus: "",
        designParamVOList: [],
        delDesignParamIds: []
      };
      this.testOption = [];
      this.contractIdOption = [];
      this.personOption = [];
      this.fileList = [];
      this.dataList = [];
      this.testFacilitys = [];
      if (rowId == "") {
        this.$refs["ruleForm"].resetFields();
        this.getDefaultVal();
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.mainId = rowId;
          this.init();
          this.personOption.push(res.data.data.entrustPerson);
          this.contractIdOption.push({
            paperContractNo: res.data.data.contractNum,
            id: res.data.data.contractId
          });
          this.testOption.push({
            reportName: res.data.data.testType,
            id: res.data.data.testTypeId
          });
          if (this.addList.testFacilityIds.length > 0) {
            this.testFacilitys = this.addList.testFacilityObjs;
          }
          if(this.addList.testCode=='A'){
            this.requiredA = true;
            this.requiredB = false;
          }else if(this.addList.testCode=='B'){
            this.requiredA = false;
            this.requiredB = true;
          }
        });
      }
    },
    getDefaultVal() {
      addDefaultVaule("CRM_CSWT").then(res => {
        this.addList.entrustDate = res.data.data.CREATE_TIME;
        this.addList.entrustPersonId = res.data.data.CREATE_USER;
        this.addList.entrustPersonName = res.data.data.CREATE_USER_NAME;
        this.addList.entrustDeptName = res.data.data.CREATE_DEPT_NAME;
        this.addList.createDeptName=res.data.data.CREATE_DEPT_NAME;
        this.addList.entrustDeptId = res.data.data.CREATE_DEPT;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.personOption.push({
          realName: this.addList.entrustPersonName,
          id: this.addList.entrustPersonId,
          deptName: this.addList.entrustDeptName,
          account: res.data.data.UPDATE_USER.account
        });
      });
    },
    getTestType(query) {
      if (query != "") {
        reportTypeBySearch(query).then(res => {
          this.testOption = res.data.data;
        });
      } else {
        this.testOption = [];
      }
    },
    getContract(query) {
      if (query != "") {
        getContractBySearch(query).then(res => {
          this.contractIdOption = res.data.data;
        });
      } else {
        this.contractIdOption = [];
      }
    },
    getTestFacility(query) {
      if (query != "") {
        selectBySearch(query).then(res => {
          this.testFacilitys = res.data.data;
        });
      } else {
        this.testFacilitys = [];
      }
    },
    getPerson(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.personOption = res.data.data;
        });
      } else {
        this.personOption = [];
      }
    },
    personChange() {
      this.personOption.forEach(item => {
        if (this.addList.entrustPersonId == item.id) {
          this.addList.entrustDeptName = item.deptName;
          this.addList.entrustDeptId = item.deptId;
        }
      });
    },
    getFanType() {
      getDictBizByCode("crm_product_type").then(res => {
        this.fanTypeOption = res.data.data;
      });
    },
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    specialRequireChange() {
      if (this.addList.specialRequire == 0) {
        delete this.addList.requireContent;
      }
    },
    testTypeChange() {
      designByTypeId(this.addList.testTypeId).then(res => {
        this.$set(this.addList, "designParamVOList", res.data.data);
        this.$forceUpdate();
      });
      this.testOption.forEach(item => {
        if (item.id == this.addList.testTypeId) {
          if (item.typeCode == "A") {
            this.requiredA = true;
            this.requiredB = false;
            delete this.addList.factoryName
            delete this.addList.heatNumber
            delete this.addList.templateName
            delete this.addList.modelNum
          } else if (item.typeCode == "B") {
            this.requiredA = false;
            this.requiredB = true;
            delete this.addList.factoryName
            delete this.addList.heatNumber
            delete this.addList.templateName
            delete this.addList.modelNum
          }
        }
      });
    },
    spanAdd() {
      this.addList.designParamVOList.push({
        paramName: "",
        paramValue: "",
        isAdd: 1
      });
      this.$forceUpdate();
    },
    delParam(index, item) {
      this.addList.designParamVOList.splice(index, 1);
      if (item.id) {
        this.addList.delDesignParamIds.push(item.id);
      }
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
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    },
    close() {
      this.turnoff();
    },
    savebtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addList.judgeBasic != 1) {
            if (this.addList.specialRequire != 1) {
              this.$message({
                message: "请填写判断依据",
                type: "warning"
              });
            } else {
              this.btnLoading = true;
              this.addList.uploadFiles = this.dataList;
              save(this.addList).then(res => {
                if (res.data.code == 200) {
                  this.turnoff();
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                  this.btnLoading = false;
                }
              });
            }
          } else {
            this.btnLoading = true;
            this.addList.uploadFiles = this.dataList;
            save(this.addList).then(res => {
              if (res.data.code == 200) {
                this.turnoff();
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
                this.btnLoading = false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addList.judgeBasic != 1) {
            if (this.addList.specialRequire != 1) {
              this.$message({
                message: "请填写判断依据",
                type: "warning"
              });
            } else {
              this.btnLoading = true;
              this.addList.uploadFiles = this.dataList;
              save(this.addList).then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.getModel("CRM_CSWT");
                  this.dataId = res.data.data;
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                  this.btnLoading = false;
                }
              });
            }
          } else {
            this.btnLoading = true;
            this.addList.uploadFiles = this.dataList;
            save(this.addList).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.getModel("CRM_CSWT");
                this.dataId = res.data.data;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
                this.btnLoading = false;
              }
            });
          }
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
        flowKey: "CRM_CSWT_DART",
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
    }
  },
  created() {
    this.getFanType();
    this.getStatus();
  }
};
</script>
<style lang='scss' scoped>
.spanList {
  height: 32px;
  line-height: 32px;
  width: 33.3%;
  display: flex;
  float: left;
  margin-bottom: 10px;
}
.paramName {
  float: left;
  width: 30%;
  text-align: right;
  padding-right: 10px;
  line-height: 32px;
}
.paramValue {
  width: 70%;
  float: left;
}
</style>

