<template>
    <div style="width:100%;padding:20px;">
        <el-form :model="addList"  :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem" style='width:100%;'>
            <el-row :gutter="20" style="width:100%">
                <h3>合格供方认定</h3>
                <el-col :span="12">
                    <el-form-item label="供应商名称:" prop="supplierId">
                        <el-select size="small" v-model="addList.supplierId" clearable  filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getSupplierId"  style="width:100%" @change='supplierIdChange'>
                            <el-option
                                v-for="item in supplierIds"
                                :key="item.id"
                                :label="item.supplierName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应标的:" prop="supplierMarks">
                            <el-input size="small" v-model="addList.supplierMarks" placeholder="请输入供应标的"></el-input>
                    </el-form-item>
                    <el-form-item label="供应物资分类:" prop="materialClassify">
                            <el-select v-model="addList.materialClassify" size="small" placeholder="请选择供应物资分类" @change="materialChange">
                                    <el-option
                                        v-for="item in materialClassifys"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                    <el-form-item label="评审类型:" prop="contractType">
                            <el-select v-model="addList.contractType" size="small" placeholder="请选择评审类型">
                                    <el-option
                                        v-for="item in contractTypes"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                    <el-form-item label="有效开始日期:" prop="startValid">
                            <el-date-picker
                                v-model="addList.startValid"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择有效开始日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="有效截至日期:" prop="untilValid">
                            <el-date-picker
                                v-model="addList.untilValid"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择有效截至日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结果认定:" prop="resultRight" :rules="{ required:true, message: '请选择结果认定'}" v-if="resShow">
                            <el-select v-model="addList.resultRight" size="small" placeholder="请选择结果认定">
                                    <el-option
                                        v-for="item in resultRights"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="企业性质:" prop="natureOfEnterprise">
                            <el-select v-model="addList.natureOfEnterprise" size="small" placeholder="请选择企业性质">
                                    <el-option
                                        v-for="item in natureOfEnterprises"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                    <el-form-item label="认定申请号:" prop="oddNum">
                            <el-input size="small" v-model="addList.oddNum"  placeholder="自动生成" disabled></el-input>
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
                </el-col>
            </el-row>
            <el-row>
                <h3>评审详情</h3>
                <el-table
                    :data="assignDetailList"
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    border
                    max-height="370"
                    style="width:100%"
                    size='small'>
                    <el-table-column
                        type='index'
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="chargeDept"
                        label="负责评价部门"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="contractProject"
                        label="评审项目"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="contractContent"
                        label="评审内容">
                    </el-table-column>
                    <el-table-column
                        prop="isRequired"
                        label="必选"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="consoleResult"
                        label="结论"
                        width="120">
                        <template slot-scope="scope">
                            <el-select size="small" v-model="scope.row.consoleResult"placeholder="请选择结论" style="width:100%" clearable :disabled="conDisabled">
                                <el-option label="符合" value="1"></el-option>
                                <el-option label="不符合" value="2"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;">
            <el-button type="primary" @click="savebtn('ruleForm')" :loading="btnLoading" v-show="btn_save" size="small" icon="el-icon-check">保存</el-button>
            <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" v-show="btn_sub" size="small" icon="el-icon-check">保存并提交</el-button>
            <el-button @click="close()" size="small" v-show="btn_close" icon="el-icon-close">取 消</el-button>
        </div>
    </div>
</template>
<script>
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import {
  detail,
  getContentDefinitionBySearch,
  getSupplierBySearch,
  save
} from "@/api/biz/guarantee/gyshgrd";
import { addDefaultVaule } from "@/api/biz/crm/xmbd";
import { modelByName } from "@/api/biz/sbgl";
import { startFlow } from "@/api/tool/dynamic";
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
    proDefId:{type: String, default: null},
    functionId:{type: String, default: null},
    nodeCode:{type: String, default: null},
    diaType:{type: Number, default: null}
  },
  data() {
    return {
      conDisabled:true,
      resShow:false,
      addList: {
        createUserName: "",
        createTime: "",
        flowStatus: ""
      },
      assignDetailList: [],
      supplierIds: [],
      materialClassifys: [],
      contractTypes: [],
      natureOfEnterprises: [],
      statusOption: [],
      resultRights: [],
      dataId:'',
      btnLoading: false,
      btn_save: false,
      btn_sub: false,
      btn_close: false,
      rules: {
          supplierId:[
          { required: true, message: "请选择供应商名称", trigger: "blur" }
        ],
        supplierMarks:[
          { required: true, message: "请输入供应商标的", trigger: "blur" }
        ],
        materialClassify:[
          { required: true, message: "请选择供应物资分类", trigger: "blur" }
        ],
        contractType:[
          { required: true, message: "请选择评审类型", trigger: "blur" }
        ],
        natureOfEnterprise:[
          { required: true, message: "请选择企业性质", trigger: "blur" }
        ],
        startValid:[
          { required: true, message: "请选择有效开始日期", trigger: "blur" }
        ],
        untilValid:[
          { required: true, message: "请选择有效截止日期", trigger: "blur" }
        ]
      }
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
      } else if (diaType == 3 ) {
        this.tjcs = false;
        this.djsc = false;
        this.btn_save = false;
        this.btn_sub = false;
        this.btn_close = false;
      } else if (diaType == 4|| diaType == 5) {
        this.tjcs = false;
        this.djsc = false;
        this.btn_sub = false;
        this.btn_close = false;
        if(this.editFlag){
          this.btn_save = true;
        }else{
          this.btn_save = false;
        }
      }
      this.btnLoading = false;
      this.addList = {
        createUserName: "",
        createTime: "",
        flowStatus: ""
      };
      this.assignDetailList = [];
      this.supplierIds = [];
      if (rowId == "") {
        this.getDefaultVal();
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.assignDetailList = res.data.data.assignDetailList;
          this.supplierIds.push({supplierName:res.data.data.supplierName,id:res.data.data.supplierId})
        });
      }
    },
    getDefaultVal() {
      addDefaultVaule("CRM_GFHGRD").then(res => {
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
      });
    },
    materialChange() {
      getContentDefinitionBySearch(this.addList.materialClassify).then(res => {
        this.assignDetailList = res.data.data;
        if(this.assignDetailList.length>0){
          this.assignDetailList.forEach(item=>{
            item.id=''
          })
        }
      });
    },
    getSupplierId(query) {
      if (query != "") {
        getSupplierBySearch(query).then(res => {
          this.supplierIds = res.data.data;
        });
      } else {
        this.supplierIds = [];
      }
    },
    supplierIdChange() {
        this.supplierIds.forEach(item=>{
            if(item.id==this.addList.supplierId){
                this.$set(this.addList,'supplierMarks',item.supplierMarker)
                this.$set(this.addList,'materialClassify',item.materialCategory)
                this.materialChange()
            }
        })
    },
    savebtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.addList.assignDetailList = this.assignDetailList;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              if(!this.detailId){
                this.turnoff();
              }
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.btnLoading = false;
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
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.addList.assignDetailList = this.assignDetailList;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getModel("CRM_GFHGRD");
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
        flowKey: "CRM_QUALITY_GFHGRD_DART",
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
    },
    getmaterialClassify() {
      getDictBizByCode("material_category").then(res => {
        this.materialClassifys = res.data.data;
      });
    },
    getcontractType() {
      getDictBizByCode("assign_type").then(res => {
        this.contractTypes = res.data.data;
      });
    },
    getnatureOfEnterprise() {
      getDictBizByCode("enterprise_nature").then(res => {
        this.natureOfEnterprises = res.data.data;
      });
    },
    getflowStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    getresultRight() {
      getDictBizByCode("result_cognizance").then(res => {
        this.resultRights = res.data.data;
      });
    }
  },
  created() {
    this.getmaterialClassify();
    this.getcontractType();
    this.getnatureOfEnterprise();
    this.getflowStatus();
    this.getresultRight();
    if(this.detailId){
        this.open(this.detailId,this.diaType)
    }
    if(this.nodeAlias=='2'){
      this.conDisabled=false
    }else{
      this.conDisabled=true
    }
    if(this.nodeAlias=='5'){
      this.resShow=true
    }else{
      this.resShow=false
    }
  }
};
</script>


