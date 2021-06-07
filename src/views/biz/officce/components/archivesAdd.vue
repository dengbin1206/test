<template>
    <div style="width:auto">
        <template>
            <el-button type="primary" size="small" @click="dalxShow" v-if="buttonList.biz_dajy_dalx.show">档案类型</el-button>
        </template>
        <template>
            <el-form :model="addList"  :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
                <el-row :gutter="20">
                    <h3>档案借阅</h3>
                    <el-col :span="12">
                        <el-form-item label="利用方式:" prop="useMethod" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','useMethod')">
                            <el-radio-group v-model="addList.useMethod" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','useMethod')">
                                <el-radio label="1">查看</el-radio>
                                <el-radio label="2">复印</el-radio>
                                <el-radio label="3">扫描</el-radio>
                                <el-radio label="4">借阅</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="档案所属公司:" prop="archivalOfCompany"  v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','archivalOfCompany')">
                            <el-select size="small" v-model="addList.archivalOfCompany" clearable  placeholder="请选择档案所属公司"  style="width:100%" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','archivalOfCompany')">
                                <el-option
                                    v-for="item in contractSigns"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="档案类型:" prop="archivalTypeId" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','archivalTypeId')">
                            <el-select size="small" v-model="addList.archivalTypeId" filterable remote  reserve-keyword placeholder="请输入关键词" :remote-method="getarchivalType"  style="width:100%" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','archivalTypeId')">
                                <el-option
                                    v-for="item in archivalTypes"
                                    :key="item.id"
                                    :label="item.archivalType"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预计归还日期:" prop="expectReturnDate" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','expectReturnDate')">
                            <el-date-picker
                                :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','expectReturnDate')"
                                v-model="addList.expectReturnDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择预计归还日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="实际归还日期:" prop="actualReturnDate" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','actualReturnDate')">
                            <el-date-picker
                                :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','actualReturnDate')"
                                v-model="addList.actualReturnDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择实际归还日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="盖章份数:" prop="stampNum" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','stampNum')">
                            <el-input size="small" v-model="addList.stampNum" type="number" placeholder="请输入盖章份数" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','stampNum')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单号:" prop="oddNum" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','oddNum')">
                            <el-input size="small" v-model="addList.oddNum" placeholder="自动生成" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','oddNum',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人:" prop="createUserName" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','createUserName')">
                            <el-input size="small" v-model="addList.createUserName" placeholder="自动获取" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','createUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人所在部门:" prop="createDeptName" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','createDeptName')">
                            <el-input size="small" v-model="addList.createDeptName" placeholder="自动获取" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','createDeptName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间:" prop="createTime" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','createTime')">
                            <el-input size="small" v-model="addList.createTime" placeholder="自动获取" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','createTime',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请状态:" prop="flowStatus" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','flowStatus')">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="自动获取"  style="width:100%" clearable  :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','flowStatus',0)">
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="借阅内容及用途:" prop="contentAndUse" v-if="this.dynamicFieldShow(fieldPower,'BIZ_DAJY','contentAndUse')">
                            <el-input size="small" type="textarea" rows="3" v-model="addList.contentAndUse" placeholder="请输入借阅内容及用途" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_DAJY','contentAndUse')"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;">
                    <el-button type="primary" @click="savebtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="buttonList.biz_dajy_save.show">保存</el-button>
                    <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check"  v-if="buttonList.biz_dajy_submit.show">保存并提交</el-button>
                    <el-button @click="close()" size="small" icon="el-icon-close"  v-if="buttonList.biz_dajy_cancel.show">取 消</el-button>
            </div>
            <el-dialog
              title="档案类型"
              :visible.sync="dalxDia"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="70%">
                  <el-button type="primary" @click="rowAdd" size="small" icon="el-icon-plus" style="margin-bottom:5px;">插入行</el-button>
                  <el-button type="primary" @click="rowSave" :loading="btnLoading" size="small" icon="el-icon-check" style="margin-bottom:5px;">保存</el-button>
                  <el-table :data="dalxData" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%">
                      <el-table-column
                        type='index'
                        width="55">
                      </el-table-column>
                      <el-table-column
                            prop="archivalCode"
                            label="档案编码">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.archivalCode" size="small" placeholder="请输入档案编码" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="archivalType"
                            label="档案类型">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.archivalType" size="small" placeholder="请输入档案类型" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="limitDays"
                            label="借阅限制天数">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.limitDays" type="number" size="small" placeholder="请输入借阅限制天数" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="updateTime"
                            label="变更日期">
                      </el-table-column>
                      <el-table-column label="操作"  width='80'>
                            <template slot-scope="scope">
                                <el-button icon='el-icon-delete' size="small" type="text"  @click="rowDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                            </template>
                    </el-table-column>
                  </el-table>
            </el-dialog>
        </template>
    </div>
</template>
<script>
import { addDefaultVaule } from "@/api/biz/crm/xmbd";
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import {archivalTypeBySearch,submit,detail,dalxList,dalxSub} from "@/api/biz/officce/archives"
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { modelByName } from "@/api/biz/sbgl";
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
      btnLoading:false,
      addList: {},
      statusOption:[],
      contractSigns:[],
      archivalTypes:[],
      dataId:'',
      dalxData:[],
      delArchivalTypeIds:[],
      dalxDia:false,
      fieldPower:{},
      buttonList:{biz_dajy_save:{show:true,action:[1,2,4]},biz_dajy_submit:{show:true,action:[1,2]},biz_dajy_cancel:{show:true,action:[1,2]},biz_dajy_dalx:{show:true,action:[1,2,4]}},
      rules:{
          useMethod: [
          { required: true, message: "请选择利用方式", trigger: "blur" }
        ],
        archivalTypeId: [
          { required: true, message: "请选择档案类型", trigger: "blur" }
        ],
        expectReturnDate: [
          { required: true, message: "请选择预计归还日期", trigger: "blur" }
        ],
        actualReturnDate: [
          { required: true, message: "请选择实际归还日期", trigger: "blur" }
        ],
        stampNum: [
          { required: true, message: "请输入盖章份数", trigger: "blur" }
        ],
        contentAndUse: [
          { required: true, message: "请输入借阅内容及用途", trigger: "blur" }
        ],
      },
    };
  },
  methods: {
    open(rowId, staType) {
      this.btnLoading=false
      this.addList = {
          createTime:'',
          createUserName:'',
          flowStatus:'',
          createDeptName:''
      };
      this.archivalTypes=[];
      // 读取字段权限和按钮权限
      this.viewInit(this.$route.fullPath,"BIZ_GLZD",this.functionId,this.proDefId,this.nodeCode).then(res=>{
        // 动态处理字段和按钮
        this.dynamicView(this,"BIZ_GLZD",null,this.buttonList,this.fieldPower,res.data.data);
        this.dynamicShow(this.fieldPower,staType,null,this.buttonList);
      });
      if (rowId == "") {
          this.$refs['ruleForm'].resetFields();
          this.getDefaultVal()
      } else {
          detail(rowId).then(res=>{
              this.addList=res.data.data
              this.archivalTypes.push({archivalType:res.data.data.archivalType,id:res.data.data.archivalTypeId})
          })
      }
    },
    getDefaultVal() {
      addDefaultVaule("BIZ_DAJY").then(res => {
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.createDeptName = res.data.data.CREATE_DEPT_NAME;
      });
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    //合同签约公司
    getContractSigns() {
      getDictBizByCode("crm_design_company").then(res => {
        this.contractSigns = res.data.data;
      });
    },
    getarchivalType(query){
        if(query!=''){
            archivalTypeBySearch(query).then(res=>{
                this.archivalTypes=res.data.data
            })
        }else{
            this.archivalTypes=[]
        }
    },
    savebtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.turnoff();
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
            submit(this.addList).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.getModel("BIZ_DAJY");
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
        flowKey: "BIZ_DAJY_DART",
        formType: "S",
        modelId: id,
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
          this.turnoff();
        }
      });
    },
    close() {
      this.turnoff();
    },
    dalxShow(){
      this.btnLoading=false
        this.dalxDia=true
        dalxList().then(res=>{
            this.dalxData=res.data.data
        })
    },
    rowAdd(){
        this.dalxData.push({})
    },
    rowDel(row,index){
        this.dalxData.splice(index,1)
        if(row.id){
            this.delArchivalTypeIds.push(row.id)
        }
    },
    rowSave(){
        this.btnLoading=true
        dalxSub({archivalTypeVOS:this.dalxData,delArchivalTypeIds:this.delArchivalTypeIds}).then(res=>{
            if(res.data.code==200){
                this.$message({
                    type: "success",
                    message: res.data.msg
                });
                this.dalxDia=false
                this.btnLoading=false
            }else{
                this.$message({
                    type: "error",
                    message: res.data.msg
                });
                this.btnLoading=false
            }
        })
    }
  },
  created () {
      this.getStatus();
      this.getContractSigns();
      if (this.detailId && this.detailId != "") {
      this.open(this.detailId, this.diaType);
    }
  }
};
</script>
<style scoped>
</style>
