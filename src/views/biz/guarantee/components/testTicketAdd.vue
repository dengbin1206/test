<template>
    <div style="width:100%;padding:20px;">
        <el-form :model="arrList"  ref="ruleForm" label-width="150px"   class="sx_formItem">
            <el-row :gutter="20">
                <h3>委托信息</h3>
                <el-col :span="12">
                    <el-form-item label="委托单号:" prop="entrustCode">
                        <el-input size="small" v-model="addList.entrustCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="委托人:" prop="entrustPersonId">
                        <el-input size="small" v-model="addList.entrustPersonName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="计划期:" prop="planPeriod">
                        <el-input size="small" v-model="addList.planPeriod" disabled></el-input>  
                    </el-form-item>
                    <el-form-item label="合同号:" prop="contractNum">
                        <el-input size="small" v-model="addList.contractNum" disabled></el-input>  
                    </el-form-item>
                    <el-form-item label="风机型号:" prop="fanModel">
                        <el-input size="small" v-model="addList.fanModel" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="风机数量(台):" prop="fanTotal">
                        <el-input size="small" v-model="addList.fanTotal" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="产品编号:" prop="productCode">
                        <el-input size="small" v-model="addList.productCode"  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="供应商:" prop="supplier">
                            <el-input size="small" v-model="addList.supplier"  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂家:" prop="factoryName" v-if="requiredB" >
                            <el-input size="small" v-model="addList.factoryName"  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="炉号:" prop="heatNumber" v-if="requiredB">
                            <el-input size="small" v-model="addList.heatNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="是否需要委外:" :required='true' v-if="weiy">
                        <el-select v-model="addList.isOutSource" size="small" placeholder="请选择是否需要委外" @change="isOutSourceChange" :disabled="sourceDis">
                            <el-option label="需要" value="1"></el-option>
                            <el-option label="不需要" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="测试人员:"  v-if="cesren" :required="nodeAlias=='3'">
                        <el-select size="small" v-model="addList.testPeopleId"  filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="gettestPeopleId"   style="width:100%" :disabled="csDis">
                            <el-option
                                v-for="item in testPeopleIdOption"
                                :key="item.id"
                                :label="item.realName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="申请出具报告:" prop="testType">
                        <el-input size="small" v-model="addList.testType" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="委托部门:" prop="entrustDeptName">
                        <el-input size="small" v-model="addList.entrustDeptName" disabled></el-input>  
                    </el-form-item>
                    <el-form-item label="委托人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
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
                    <el-form-item label="风机类型:" prop="fanType">
                        <el-select v-model="addList.fanType" size="small" placeholder="请选择风机类型" disabled>
                            <el-option
                                v-for="item in fanTypeOption"
                                :key="item.dictKey"
                                :label="item.dictValue"
                                :value="item.dictKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="样品名称:" prop="templateName" v-if="requiredB">
                            <el-input size="small" v-model="addList.templateName"  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="规格型号:" prop="modelNum" v-if="requiredB">
                            <el-input size="small" v-model="addList.modelNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="计划实验日期:" :required="nodeAlias=='3'" v-if="jhsyrq">
                            <el-date-picker
                                v-model="addList.planTestDate"
                                :disabled='jhDis'
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择计划实验日期">
                            </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <h3>设计参数</h3>
                <el-col style="margin-bottom:10px" :span='8' v-for='(item,index) in addList.designParamVOList' :key='index'>
                     <span class='paramName'>{{item.paramName}}:</span>
                     <span class="paramValue">
                       {{item.paramValue}}
                     </span>
                </el-col>
            </el-row>
            <el-row>
              <h3>检测目的</h3>
              <el-input size="small" type="textarea" rows="3" v-model="addList.testPurpose" disabled></el-input>
            </el-row>
            <el-row>
              <h3>检测目的</h3>
              <el-input size="small" type="textarea" rows="3" v-model="addList.testRequire" disabled></el-input>
            </el-row>
            <el-row>
              <h3>判断依据</h3>
              <el-input size="small" type="textarea" rows="3" v-model="addList.pdyjArea" disabled></el-input>
            </el-row>
            <el-row>
              <h3>试验设施</h3>
              <el-select size="small" v-model="addList.testFacilityIds"  filterable multiple remote reserve-keyword style="width:100%" disabled>
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
              <el-input size="small" type="textarea" rows="3" v-model="addList.otherRequire" disabled></el-input>
            </el-row>
            <el-row>
                <el-col :span='12'>
                    <el-form-item label="附件:">
                        <p class="files" v-for="(file, index) in fileList" :key="index" @click="handlePreview(file)" style="color:#409eff;margin:5px 0;">
                            <i class="el-icon-document" style="color:#409eff"></i>{{ file.name }}
                        </p>
                    </el-form-item>
                </el-col>
            </el-row>
            <div  v-if="csShow">
              <el-row :gutter="20">
                <h3>测试记录</h3>  
                <el-col :span='12'>
                    <el-form-item label="测试项目:">
                        <el-select size="small" v-model="addList.checkRecordVO.checkItemIdList" multiple @change='testChange(0)'>
                            <el-checkbox v-model="checked"
                              :indeterminate="isIndeterminate"
                              @change='selectAll'>全选
                            </el-checkbox>
                            <el-option
                                v-for="item in checkOption"
                                :key="item.id"
                                :label="item.checkProject"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="试验次数:" prop='testTimes'>
                        <el-select v-model="arrList.testTimes" size="small" placeholder="请选择试验次数" @change="testChange(1)">
                            <el-option
                                v-for="item in sycsOption"
                                :key="item.dictKey"
                                :label="item.dictValue"
                                :value="item.dictKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="记录时间:" prop="recordDate">
                            <el-date-picker
                                v-model="arrList.recordDate"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择记录时间">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="合格确认:" prop='isStandard'>
                        <el-select size="small" v-model="arrList.isStandard">
                            <el-option label="合格" value="1"></el-option>
                            <el-option label="不合格" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="试验记录人:" prop="checkPerson">
                            <el-input size="small" v-model="addList.checkRecordVO.checkPerson" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="记录序号:" prop='recordTimes'>
                        <el-select v-model="arrList.recordTimes" size="small" placeholder="请选择记录序号" @change="testChange(2)">
                            <el-option
                                v-for="item in jlcsOption"
                                :key="item.dictKey"
                                :label="item.dictValue"
                                :value="item.dictKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注:" prop="remarks">
                        <el-input size="small" type="textarea" rows="4" v-model="arrList.remarks" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-for="(item,index) in arrList.itemDetailVOS" :key='index'>
                <h4 style="padding-left:20px;">{{item.testTitle}}</h4>
                <el-col :span="12" v-for="(ele,inded) in item.checkItemDetailVOS" :key='inded'>
                    <el-form-item :label="ele.itemParam" prop="itemParam">
                        <el-input size="small"  v-model="ele.itemParamValue" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;" v-if="editFlag">
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
        </div>
    </div>
</template>
<script>
import {
  detail,
  standardByReportId,
  selectCheck,
  save
} from "@/api/biz/guarantee/orderTicket";
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import { uploadList } from "@/api/tool/dynamic";
import { getUserInfoBySearch } from "@/api/biz/crm/xmbd";
import { getToken } from "@/util/auth";
import website from "@/config/website";
import { addDefaultVaule } from "@/api/biz/crm/xmbd";
export default {
  props: {
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
      isIndeterminate: false,
      checked: false,
      jhDis: true,
      csDis: true,
      sourceDis: false,
      csShow: false,
      requiredA: true,
      requiredB: false,
      btnLoading: false,
      headShow: true,
      subShow: true,
      addList: {
        checkRecordVO: {
          checkItemIdList: []
        }
      },
      disvis: true,
      weiy: false,
      cesren: false,
      jhsyrq: false,
      testOption: [],
      testFacilitys: [],
      fanTypeOption: [],
      fileList: [],
      sycsOption: [],
      jlcsOption: [],
      checkOption: [],
      statusOption: [],
      testPeopleIdOption: [],
      dataSrcId: "CRM_CSWT",
      affixType: "CRM_CSWT#AFFIX_UPLOAD",
      mainId: "",
      arrList: {
        recordTimes: "1",
        testTimes: "1",
        isStandard: ""
      }
    };
  },
  methods: {
    open(rowId, diaType) {
      this.mainId = rowId;
      this.init();
      this.testPeopleIdOption = [];
      detail(rowId).then(res => {
        this.addList = res.data.data;
        if (this.addList.judgeBasic == 1) {
          this.addList.pdyjArea = "按试验大纲执行";
          if (this.addList.specialRequire == 1) {
            this.addList.pdyjArea =
              "按试验大纲执行;          " + this.addList.requireContent;
          }
        } else {
          this.addList.pdyjArea = this.addList.requireContent;
        }
        if (
          this.addList.checkRecordVO.checkTimeVOS &&
          JSON.stringify(this.addList.checkRecordVO.checkTimeVOS) != "{}"
        ) {
          this.arrList = this.addList.checkRecordVO.checkTimeVOS;
        }
        this.checkSearch();
        if (res.data.data.testPeopleId != "") {
          this.testPeopleIdOption.push({
            realName: res.data.data.testPeopleName,
            id: res.data.data.testPeopleId
          });
        }
        addDefaultVaule("CRM_CSWT").then(res => {
          if (
            !this.addList.checkRecordVO.checkPerson ||
            this.addList.checkRecordVO.checkPerson == ""
          ) {
            this.$set(
              this.addList.checkRecordVO,
              "checkPerson",
              res.data.data.CREATE_USER_NAME
            );
          }
        });
        if (this.addList.testFacilityIds.length > 0) {
          this.testFacilitys = this.addList.testFacilityObjs;
        }
        if (this.addList.testCode == "B") {
          this.requiredB = true;
        } else {
          this.requiredB = false;
        }
        if (this.nodeAlias != "1") {
          if (this.addList.isOutSource && this.addList.isOutSource == "2") {
            this.cesren = true;
          }
        }
      });
    },
    selectAll() {
      this.addList.checkRecordVO.checkItemIdList = [];
      if (this.checked) {
        this.checkOption.map(item => {
          this.addList.checkRecordVO.checkItemIdList.push(item.id);
        });
        this.isIndeterminate = false;
        this.testChange(0);
      } else {
        this.addList.checkRecordVO.checkItemIdList = [];
        this.isIndeterminate = false;
        this.arrList.itemDetailVOS = [];
        this.$message({
          message: "请选择检测项目",
          type: "warning"
        });
      }
    },
    testChange(i) {
      if (
        this.addList.checkRecordVO.checkItemIdList.length ===
        this.checkOption.length
      ) {
        this.checked = true;
        this.isIndeterminate = false;
      } else if (
        this.addList.checkRecordVO.checkItemIdList.length &&
        this.addList.checkRecordVO.checkItemIdList.length <
          this.checkOption.length
      ) {
        this.checked = false;
        this.isIndeterminate = true;
      } else {
        this.checked = false;
        this.isIndeterminate = false;
      }
      if (
        this.addList.checkRecordVO.checkItemIdList &&
        this.addList.checkRecordVO.checkItemIdList.length > 0
      ) {
        selectCheck({
          testTimes: this.arrList.testTimes,
          recordTimes: this.arrList.recordTimes,
          checkRecordId: this.addList.checkRecordVO.id,
          entrustId: this.addList.id,
          checkItemIdList: this.addList.checkRecordVO.checkItemIdList,
          alterTime: i,
          rightFlag: this.arrList.isStandard
        }).then(res => {
          this.arrList = res.data.data;
          if (this.arrList.recordDate == "") {
            addDefaultVaule("CRM_CSWT").then(res => {
              this.$set(this.arrList, "recordDate", res.data.data.CREATE_TIME);
            });
          }
        });
      } else {
        this.arrList.itemDetailVOS = [];
        this.$message({
          message: "请选择检测项目",
          type: "warning"
        });
      }
    },
    isOutSourceChange() {
      this.addList.testPeopleId = "";
      if (this.addList.isOutSource == "2") {
        this.cesren = true;
      } else {
        this.cesren = false;
      }
    },
    gettestPeopleId(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.testPeopleIdOption = res.data.data;
        });
      } else {
        this.testPeopleIdOption = [];
      }
    },
    rowSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      this.addList.checkRecordVO.checkTimeVOS = this.arrList;
      save(this.addList).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.open(this.detailId, this.diaType);
        }
      });
    },
    getFanType() {
      getDictBizByCode("crm_product_type").then(res => {
        this.fanTypeOption = res.data.data;
      });
    },
    getSycs() {
      getDictBizByCode("crm_test_time").then(res => {
        this.sycsOption = res.data.data;
      });
    },
    getJlcs() {
      getDictBizByCode("crm_record_times").then(res => {
        this.jlcsOption = res.data.data;
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
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&affixId=${file.fileId || ""}`
      );
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
    checkSearch() {
      standardByReportId(this.addList.testTypeId).then(res => {
        this.checkOption = res.data.data;
        if (this.addList.checkRecordVO.checkItemIdList) {
          if (
            this.addList.checkRecordVO.checkItemIdList.length ===
            this.checkOption.length
          ) {
            this.checked = true;
            this.isIndeterminate = false;
          } else if (
            this.addList.checkRecordVO.checkItemIdList.length &&
            this.addList.checkRecordVO.checkItemIdList.length <
              this.checkOption.length
          ) {
            this.checked = false;
            this.isIndeterminate = true;
          } else {
            this.checked = false;
            this.isIndeterminate = false;
          }
        }
      });
    },
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    }
  },
  created() {
    this.getFanType();
    this.getSycs();
    this.getJlcs();
    this.getStatus();
    if (this.detailId) {
      this.open(this.detailId, this.diaType);
    }
    if (this.nodeAlias == "2") {
      this.weiy = true;
      this.csDis = false;
      this.jhsyrq = true;
    }
    if (this.nodeAlias == "3") {
      this.weiy = true;
      this.jhsyrq = true;
      this.sourceDis = true;
      this.csDis = false;
      this.jhDis = false;
    }
    if (this.nodeAlias == "4") {
      this.weiy = true;
      this.csShow = true;
      this.sourceDis = true;
      this.jhsyrq = true;
    }
    if (this.nodeAlias == "9") {
      this.jhsyrq = true;
      this.weiy = true;
      this.sourceDis = true;
      this.csShow = true;
    }
    if (this.nodeAlias == "8") {
      this.jhsyrq = true;
      this.weiy = true;
      this.sourceDis = true;
    }
    if (!this.nodeAlias) {
      this.jhsyrq = true;
      this.weiy = true;
      this.sourceDis = true;
      this.csShow = true;
    }
  }
};
</script>
<style>
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
  text-align: left;
  line-height: 32px;
}
</style>

