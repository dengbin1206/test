<template>
    <div>
            <el-form :model="addList" :label-position="labelPosition"  :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem sx_xmbd">
                <el-row :gutter="20">
                    <h4>报价基本信息</h4>
                    <el-col :span="ispc">
                        <el-form-item label="报价范围:" prop="quotationScope" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','quotationScope')">
                            <el-radio-group v-model="addList.quotationScope" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','quotationScope')">
                                <el-radio label="1">整机</el-radio>
                                <el-radio label="2">配件</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="报价类型:" prop="quotationType" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','quotationType')">
                            <el-radio-group v-model="addList.quotationType" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','quotationType')">
                                <el-radio label="1">正式报价</el-radio>
                                <el-radio label="2">项目预算</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="创建人:" prop="createUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','createUserName')">
                            <el-input size="small" v-model="addList.createUserName" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','createUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="createTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','createTime')">
                            <el-date-picker
                                :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','createTime',0)"
                                v-model="addList.createTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择审创建时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="项目报登号:" prop="projectReportNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','projectReportNum')">
                            <el-select size="small" v-model="addList.projectReportNum" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','projectReportNum')" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="proNum"  style="width:100%" @change="numChange">
                                <el-option
                                    v-for="item in numOption"
                                    :key="item.projectReportNum"
                                    :label="item.projectReportNum"
                                    :value="item.projectReportNum">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目名称:" prop="projectName" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','projectName')">
                            <el-input size="small" v-model="addList.projectName" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','projectName')"></el-input>
                        </el-form-item>
                        <el-form-item label="客户名称:" prop="clientInfo" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','clientInfo')">
                            <el-select size="small" v-model="addList.clientInfo" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','clientInfo')" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="khName" style="width:100%" @change="clientChange">
                                <el-option
                                    v-for="item in khOption"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户联系人:" prop="contactPersonName" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','contactPersonName')">
                            <el-input size="small" v-model="addList.contactPersonName" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','contactPersonName')"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话:" prop="telephone" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','telephone')">
                            <el-input size="small" v-model="addList.telephone" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','telephone')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="更改人员:" prop="updateUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','updateUserName')">
                            <el-input size="small" v-model="addList.updateUserName" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','updateUserName',0)" ></el-input>
                        </el-form-item>
                        <el-form-item label="更改时间:" prop="updateTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','updateTime')">
                            <el-date-picker
                                v-model="addList.updateTime"
                                :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','updateTime',0)"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择更改时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="审批状态:" prop="flowStatus" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','flowStatus')">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="请选择审批状态"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','flowStatus',0)">
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批结束时间:" prop="flowCompletedTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','flowCompletedTime')">
                            <el-date-picker
                                v-model="addList.flowCompletedTime"
                                :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','flowCompletedTime',0)"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="审批通过自动生成" >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="报价单号:" prop="quotationNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','quotationNum')">
                            <el-input size="small" v-model="addList.quotationNum" placeholder="自动生成" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','quotationNum',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="负责员工:" prop="chargePerson" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','chargePerson')">
                            <el-select size="small" v-model="addList.chargePerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词"
                                       :remote-method="charge" style="width:100%" @change="chargeChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','chargePerson')" >
                                <el-option
                                    v-for="item in charges"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门:" prop="departmentName">
                            <el-input size="small" v-model="addList.departmentName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="报价类别:" prop="quotationCategory" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','quotationCategory')">
                            <el-select size="small" v-model="addList.quotationCategory" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','quotationCategory')"  placeholder="请选择报价类别"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in quotation"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报价总金额(万元):" prop="totalAmount" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','totalAmount')" >
                            <span style="width:70%;float:left">
                                <el-input size="small" v-model="addList.totalAmount" disabled placeholder="自动汇总"></el-input>
                            </span>
                            <span style="width:26%;float:left;margin-left:4%">
                                <el-select v-model="addList.coinCategory" size="small" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','coinCategory')" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','coinCategory')">
                                    <el-option
                                        v-for="item in coinOption"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
              <el-row>
                <el-form-item label="详情说明:" prop="detailRemarks" style='margin-top:5px;' v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJ','detailRemarks')" >
                  <el-input type="textarea" rows="3" size="small" v-model="addList.detailRemarks" placeholder="客户情况及产品分析等详细描述" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJ','detailRemarks')"></el-input>
                </el-form-item>
              </el-row>
                <el-row v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJQD')" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJQD')">
                    <h4>产品报价清单(<span style='color:red'>报价员填写</span>)</h4>
                    <el-col :span="24">
                                <el-row v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJQD')" >
                                  <el-col :span='quoteWidth'>
                                    <el-form-item label="报价类别:" prop="quoteCategory" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJQD','quoteCategory')">
                                        <el-select size="small" v-model="tabData.quoteCategory"  placeholder="请选择报价类别"  style="width:100%" clearable @change="tegoryChange" @click.native="tegoryFocus" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJQD','quoteCategory')">
                                            <el-option
                                                v-for="item in quotation"
                                                :key="item.dictKey"
                                                :label="item.dictValue"
                                                :value="item.dictKey">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :span='quoteWidth'>
                                    <el-form-item label="报价次数:" prop="quotationTimes" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJQD','quotationTimes')">
                                    <el-select v-model="tabData.quotationTimes" placeholder="请选择产品类型" size="small" style="width:20%" clearable  @change="tegoryChange" @click.native="tegoryFocus" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJQD','quotationTimes')">
                                      <el-option v-for="item in quotaTime" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                                    </el-select>
                                  </el-form-item>
                                  </el-col>
                                  <el-col :span='quoteWidth'>
                                    <el-form-item label="本次运费(元):" prop="freight" v-if="this.dynamicFieldShow(fieldPower,'CRM_CPBJQD','freight')" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_CPBJQD','freight')">
                                    <el-input size="small" v-model="tabData.freight" placeholder="请输入本次运费(元)"></el-input>
                                  </el-form-item>
                                  </el-col>
                                </el-row>
                                <div v-if="this.dynamicFieldShow(fieldPower,'CRM_BJQDLB')" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_BJQDLB')">
                                    <el-button type="primary" size="small" icon="el-icon-plus" @click="producAdd" style="margin-bottom:5px;" :disabled="disabled" v-if="buttonList.crm_cpbj_rowAdd.show">插入行</el-button>
                                    <el-table
                                        :data="tabData.quotationList"
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        border
                                        max-height="370"
                                        size='small'
                                        style="width: 100%">
                                        <el-table-column type='index' width="55"> </el-table-column>
                                        <el-table-column prop="fanType" label="风机类型" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','fanType')">
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.fanType" placeholder="请选择风机类型" size="small" style="width:100%" clearable :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','fanType')">
                                                    <el-option v-for="item in produceOption" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productModel"
                                        label="部件型号" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','productModel')">
                                            <template slot-scope="scope">
                                                <el-input v-model='scope.row.productModel' size='small' placeholder="请输入部件型号" :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','productModel')"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productNum"
                                        label="数量" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','productNum')">
                                            <template slot-scope="scope">
                                              <el-input v-model='scope.row.productNum' size='small' placeholder="请输入数量" type="number" @blur="productChange" :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','productNum')"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productPrice"
                                        label="单价(元)" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','productPrice')">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.productPrice"  placeholder="请输入单价(元)" size="small" type="number" @blur="productChange" :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','productPrice')"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="balance"
                                        label="金额(元)" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','balance')">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.productNum*scope.row.productPrice}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="businessHours"
                                        label="商务工时(H)" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','businessHours')">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.businessHours"  placeholder="请输入商务工时"  size="small" :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','businessHours')"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="technologyHours"
                                        label="技术工时(H)" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','technologyHours')">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.technologyHours"  placeholder="请输入技术工时(H)"  size="small" :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','technologyHours')"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="specialRemarks"
                                        label="特殊说明" v-if="dynamicFieldShow(fieldPower,'CRM_BJQDLB','specialRemarks')">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.specialRemarks"  placeholder="请输入特殊说明"  size="small" :disabled="dynamicFieldEdit(fieldPower,'CRM_BJQDLB','specialRemarks')"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80' fixed="right" v-if="buttonList.crm_cpbj_rowDel.show">
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="producDel(scope.row,scope.$index)" style="color:red" >删除</el-button>
                                                </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <el-col :span="ispc">
                                    <el-form-item label="上传附件:" >
                                        <el-upload
                                                class="upload-demo"
                                                :http-request="uploadAction"
                                                action="upLoadUrl"
                                                :on-preview="handlePreview"
                                                :on-remove="handleRemove"
                                                :before-remove="beforeRemove"
                                                :before-upload="beforeUpload"
                                                :on-success="uploadSuccessFile"
                                                :file-list="fileList"
                                            >
                                                <el-button size="small" type="primary" v-if="buttonList.crm_cpbj_upload.show">点击上传</el-button>
                                                <div slot="tip" class="el-upload__tip"></div>
                                            </el-upload>
                                    </el-form-item>
                                </el-col>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="margin-top:10px;text-align:right" v-if='ispc==12'>
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="buttonList.crm_cpbj_save.show" >保存</el-button>
                <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="buttonList.crm_cpbj_submit.show" >保存并提交</el-button>
                <el-button @click="close()" size="small" icon="el-icon-close" v-if="buttonList.crm_cpbj_cancel.show">取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
                    <el-button style='width:100%' type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small"  v-if="buttonList.crm_cpbj_save.show">保存</el-button>
            </div>
        </div>
</template>
<script>
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import {
  getUserInfoBySearch,
  blurrySelect,
  addDefaultVaule
} from "@/api/biz/crm/xmbd";
import { detail, submit, getProjectInfo, product } from "@/api/biz/crm/quote";
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
import { getData } from "@/api/biz/crm/htps";
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
      quoteWidth:8,
      labelPosition:'right',
      fullPath:this.$route.fullPath,
      btnLoading:false,
      rowId: "",
      disabled: true,
      fileList: [],
      dataId: "",
      dataList: [],
      addList: {},
      tabData: {},
      dataSrcId: "CRM_CPBJ",
      affixType: "CRM_CPBJ#AFFIX_UPLOAD",
      mainId: "",
      fieldPower: {},
      charges: [],
      khOption: [],
      arrList: [],
      statusOption: [],
      quotation: [],
      coinOption: [],
      quotaTime: [],
      produceOption: [],
      numOption: [],
      createTime: "",
      buttonList: {
        crm_cpbj_rowAdd: { show: true, action: [1, 2, 4] },
        crm_cpbj_rowDel: { show: true, action: [1, 2, 4] },
        crm_cpbj_save: { show: true, action: [4] },
        crm_cpbj_submit: { show: true, action: [1, 2] },
        crm_cpbj_cancel: { show: true, action: [1, 2] },
        crm_cpbj_upload: { show: true, action: [1, 2, 4] }
      },
      createUserName: "",
      rules: {
        quotationScope: [
          { required: true, message: "请选择报价范围", trigger: "blur" }
        ],
        quotationType: [
          { required: true, message: "请选择报价类型", trigger: "blur" }
        ],
        chargePerson: [
          { required: true, message: "请选择负责员工", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        clientInfo: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        contactPersonName: [
          { required: true, message: "请输入客户联系人", trigger: "blur" }
        ],
        quotationCategory: [{ required: true, message: "请选择报价类别" }]
      }
    };
  },
  methods: {
    open(rowId, getId, diaType) {
      this.btnLoading=false
      this.addList = {
        quotationScope: "",
        quotationType: "",
        coinCategory: "",
        contactPersonName: "",
        telephone: "",
        quotationDetailVOS: []
      };
      this.tabData={};
      this.arrList=[];
      this.deptOneOption = [];
      this.deptTwoOption = [];
      this.khOption = [];
      this.charges = [];
      this.cityOption = [];
      this.countyOption = [];
      this.fileList = [];
      this.dataList = [];
      this.numOption = [];
      this.rowId = rowId;
      // 读取字段权限和按钮权限
      this.viewInit(
        this.fullPath,
        "CRM_CPBJ",
        this.functionId,
        this.proDefId,
        this.nodeCode
      ).then(res => {
        // 动态处理字段和按钮
        this.dynamicView(
          this,
          "CRM_CPBJ",
          null,
          this.buttonList,
          this.fieldPower,
          res.data.data
        );
        this.dynamicShow(this.fieldPower, diaType, null, this.buttonList);
      });
      if (rowId == "") {
        this.$refs["ruleForm"].resetFields();
        this.getDefaultVal();
        if (getId != "") {
          getData(getId).then(res => {
            this.addList.projectReportNum = res.data.data.projectReportNum;
            this.addList.projectName = res.data.data.projectName;
            this.addList.clientInfo = res.data.data.clientInfo;
            this.addList.contactPersonName = res.data.data.contactPersonName;
            this.addList.telephone = res.data.data.telephone;
            this.addList.chargePerson = res.data.data.chargePerson;
            this.addList.departmentName = res.data.data.departmentName;
            //项目报登号
            if (this.addList.projectReportNum != {}) {
              this.numOption = [
                { projectReportNum: this.addList.projectReportNum }
              ];
            }
            //客户名称
            if (this.addList.clientInfo != {}) {
              this.khOption.push(this.addList.clientInfo);
            }
            if (this.khOption.length > 0) {
              this.khOption.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            }
            //负责员工
            if (this.addList.chargePerson != {}) {
              this.charges.push(this.addList.chargePerson);
            }
            if (this.charges.length > 0) {
              this.charges.forEach(item => {
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              });
            }
          });
        }
        this.tabData = {
          quoteCategory: "",
          quotationTimes: "",
          freight: "",
          quotationList: []
        };
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.arrList = this.addList.quotationDetailVOS;
          // if (this.arrList.length > 0) {
          //   let arr=Object.assign({},this.arrList[0])
          //   this.tabData.quotationTimes= arr.quotationTimes;
          //   this.tabData.quoteCategory= arr.quoteCategory;
          //   this.tabData.quotationList= arr.quotationList;
          //   this.tabData.freight= arr.freight;
          //   this.disabled=false
          // }else{
          this.tabData = {
            quotationList: [],
            quotationTimes: "",
            quoteCategory: "",
            freight: ""
          };
          // }
          this.mainId = this.addList.id;
          this.init();
          //客户名称
          if (this.addList.clientInfo != {}) {
            this.khOption.push(this.addList.clientInfo);
          }
          if (this.khOption.length > 0) {
            this.khOption.forEach(item => {
              item.label = item.customerName;
              item.value = { customerName: item.customerName, id: item.id };
            });
          }
          //负责员工
          if (this.addList.chargePerson != {}) {
            this.charges.push(this.addList.chargePerson);
          }
          if (this.charges.length > 0) {
            this.charges.forEach(item => {
              item.label = item.realName;
              item.value = {
                realName: item.realName,
                id: item.id
              };
            });
          }
          //项目报登号
          if (this.addList.projectReportNum != {}) {
            this.numOption = [
              { projectReportNum: this.addList.projectReportNum }
            ];
          }
        });
      }
    },
    getDefaultVal() {
      addDefaultVaule("CRM_CPBJ").then(res => {
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.updateUserName = res.data.data.UPDATE_USER_NAME;
        this.addList.updateTime = res.data.data.UPDATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.quotationScope = res.data.data.QUOTATION_SCOPE;
        this.addList.quotationType = res.data.data.QUOTATION_TYPE;
        this.addList.coinCategory = res.data.data.COIN_CATEGORY;
      });
    },
    subBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.tegoryFocus();
          this.addList.uploadFiles = this.fileList;
          this.addList.quotationDetailVOS = this.arrList;
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
                this.turnoff();
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                localStorage.removeItem("getId");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
            }
          });
        } else {
          return false;
        }
      });
    },
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.tegoryFocus();
          this.addList.uploadFiles = this.fileList;
          this.addList.quotationDetailVOS = this.arrList;
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                localStorage.removeItem("getId");
                this.getModel("CRM_CPBJ");
                this.dataId = res.data.data;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
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
        flowKey: "CRM_CPBJ_DART",
        formType: "S",
        modelId: id,
        dataId: this.dataId,
        variables: {
          functionPath: this.$route.fullPath
        }
      }).then(res => {
        if ((res.data.code = 200)) {
          this.turnoff();
          this.$message({
            type: "success",
            message: res.data.msg
          });
        }
      });
    },
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    getquotation() {
      getDictBizByCode("crm_quotation_category").then(res => {
        this.quotation = res.data.data;
      });
    },
    getCoin() {
      getDictBizByCode("bill-coin").then(res => {
        this.coinOption = res.data.data;
      });
    },
    getTime() {
      getDictBizByCode("crm_quotation_times").then(res => {
        this.quotaTime = res.data.data;
      });
    },
    getProduce() {
      getDictBizByCode("crm_product_type").then(res => {
        this.produceOption = res.data.data;
      });
    },
    producAdd() {
      this.tabData.quotationList.push({
        productNum: 0,
        productPrice: 0,
        balance: 0
      });
    },
    productChange() {
      let num = 0;
      if (this.arrList.length > 0) {
        for (var i = 0; i < this.arrList.length; i++) {
          if (this.arrList[i].quotationList.length > 0) {
            for (var p = 0; p < this.arrList[i].quotationList.length; p++) {
              this.arrList[i].quotationList[p].balance = (
                Number(this.arrList[i].quotationList[p].productNum) *
                Number(this.arrList[i].quotationList[p].productPrice)
              ).toFixed(2);
              num += Number(this.arrList[i].quotationList[p].balance);
            }
          }
        }
      }
      this.$set(this.addList, "totalAmount", (num * 0.0001).toFixed(6));
    },
    tegoryFocus() {
      this.productChange();
      if (this.tabData.quotationTimes == "") {
        delete this.tabData.quotationTimes;
      }
      if (this.tabData.quoteCategory == "") {
        delete this.tabData.quoteCategory;
      }
      if (
        this.tabData.quotationTimes == undefined ||
        this.tabData.quoteCategory == undefined
      ) {
        return false;
      } else {
        if (this.arrList.length > 0) {
          let num = "";
          this.arrList.forEach((item, index) => {
            if (
              item.quotationTimes == this.tabData.quotationTimes &&
              item.quoteCategory == this.tabData.quoteCategory
            ) {
              num = index;
            }
          });
          if (num != "") {
            let arr = Object.assign({}, this.tabData);
            this.arrList[num].quotationList = arr.quotationList;
            this.arrList[num].freight = arr.freight;
          } else if (num === "") {
            let arr = Object.assign({}, this.tabData);
            this.arrList.push(arr);
          }
        } else if (this.arrList.length < 1) {
          let arr = Object.assign({}, this.tabData);
          this.arrList.push(arr);
        }
      }
    },
    tegoryChange() {
      this.tabData.freight = "";
      if (this.tabData.quotationTimes == undefined) {
        this.tabData.quotationTimes = "";
      }
      if (this.tabData.quoteCategory == undefined) {
        this.tabData.quoteCategory = "";
      }
      if (
        this.tabData.quoteCategory === "" ||
        this.tabData.quotationTimes === ""
      ) {
        this.disabled = true;
        return false;
      } else {
        this.disabled = false;
        if (this.arrList.length > 0) {
          let num = "";
          this.arrList.forEach((item, index) => {
            if (
              item.quotationTimes == this.tabData.quotationTimes &&
              item.quoteCategory == this.tabData.quoteCategory
            ) {
              num = index;
            }
          });
          if (num !== "") {
            this.tabData.quotationList = this.arrList[num].quotationList;
            this.tabData.freight = this.arrList[num].freight;
          } else if (num === "") {
            if (this.addList.id) {
              let params = {
                quoteCategory: this.tabData.quoteCategory,
                quotationTimes: this.tabData.quotationTimes,
                quotationId: this.addList.id
              };
              product(params).then(res => {
                this.tabData.freight = res.data.data.freight;
                this.tabData.quotationList = res.data.data.quotationList;
              });
            } else {
              this.tabData.quotationList = [];
            }
          }
        } else if (this.arrList.length < 1) {
          this.tabData.quotationList = [];
        }
      }
    },
    producDel(row, index) {
      this.$confirm('确定是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tabData.quotationList.splice(index, 1);
          if (row.id) {
            this.addList.quotationListIds.push(row.id);
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    khName(query) {
      if (query != "") {
        blurrySelect(query).then(res => {
          this.khOption = res.data.data;
          this.khOption.forEach(item => {
            let arr = {
              customerName: item.customerName,
              id: item.id
            };
            item.label = item.customerName;
            item.value = arr;
          });
        });
      }
    },
    clientChange() {
      this.khOption.forEach(item => {
        if (item.id == this.addList.clientInfo.id) {
          this.addList.contactPersonName = item.relation;
          this.addList.telephone = item.contactNumber;
        }
      });
    },
    proNum(query) {
      if (query != "") {
        getProjectInfo(query).then(res => {
          this.numOption = res.data.data;
        });
      }
    },
    numChange() {
      if (this.rowId == "") {
        this.khOption = [];
        this.charges = [];
        this.numOption.forEach(item => {
          if (item.projectReportNum == this.addList.projectReportNum) {
            this.addList.chargePerson = item.chargePerson;
            this.addList.departmentName = item.departmentName;
            this.addList.projectName = item.projectName;
            this.addList.clientInfo = item.clientInfo;
            this.addList.contactPersonName = item.contactPersonName;
            this.addList.telephone = item.telephone;
            this.addList.departmentId = item.deptId;
          }
        });
        //客户名称
        if (this.addList.clientInfo != {}) {
          this.khOption.push(this.addList.clientInfo);
        }
        if (this.khOption.length > 0) {
          this.khOption.forEach(item => {
            item.label = item.customerName;
            item.value = { customerName: item.customerName, id: item.id };
          });
        }
        //负责员工
        if (this.addList.chargePerson != {}) {
          this.charges.push(this.addList.chargePerson);
        }
        if (this.charges.length > 0) {
          this.charges.forEach(item => {
            item.label = item.realName;
            item.value = {
              realName: item.realName,
              id: item.id
            };
          });
        }
      }
    },
    charge(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.charges = res.data.data;
          this.charges.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
        });
      } else {
        this.charges = [];
      }
    },
    chargeChange() {
      this.charges.forEach(item => {
        if (item.id == this.addList.chargePerson.id) {
          this.addList.departmentName = item.deptName;
          this.addList.departmentId = item.deptId;
        }
      });
    },
    close() {
      this.turnoff();
      localStorage.removeItem("getId");
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
      this.fileList.forEach(ele => {
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
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.loading = false;
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {}
  },
  created() {
    this.getStatus();
    this.getquotation();
    this.getCoin();
    this.getTime();
    this.getProduce();
    if (this.detailId && this.detailId != "") {
      this.fullPath='/work/donec'
      this.open(this.detailId, "", this.diaType);
    }
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.quoteWidth=24;
            this.ispc = 24;
            this.labelPosition='left'
    } else {
            this.quoteWidth=8;
            this.ispc = 12;
            this.labelPosition='right'
    }
  }
};
</script>
<style scoped>
@import "./xmbdStyle/htps.scss";
</style>
