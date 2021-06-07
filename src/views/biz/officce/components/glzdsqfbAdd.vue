<template>
    <div style="width:auto">
        <!-- <template>
            <el-button type="primary" size="small" @click="wjpzShow" v-if="buttonList.biz_glzd_wjpz.show">文件配置</el-button>
        </template> -->
        <template>
            <el-form :model="addList"  :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
                <el-row :gutter="20">
                    <h3>管理制度文件发布</h3>
                    <el-col :span="12">
                        <el-form-item label="文件内容:" prop="wordContent" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','wordContent')">
                            <el-radio-group v-model="addList.wordContent" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','wordContent')" @change="wordContentChange">
                                <el-radio label="1">变更</el-radio>
                                <el-radio label="2">追加</el-radio>
                                <el-radio label="3">废弃</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="文件名称:" prop="fileName" v-if="addList.wordContent=='2'">
                            <el-input size="small" v-model="addList.fileName" placeholder="请输入文件名称" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','fileName')"></el-input>
                        </el-form-item>
                        <el-form-item label="文件名称:" prop="wordId" v-if="addList.wordContent=='1'||addList.wordContent=='3'">
                            <el-select size="small" v-model="addList.wordId" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getwordName"  style="width:100%" @change="wordNameChange" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','wordName')">
                                <el-option
                                    v-for="item in wordNames"
                                    :key="item.id"
                                    :label="item.wordName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文件编号:" prop="wordCode" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','wordCode')">
                            <el-input size="small" v-model="addList.wordCode" placeholder="默认带出" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','wordCode')"></el-input>
                        </el-form-item>
                        <el-form-item label="文件等级:" prop="wordRank" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','wordRank')">
                            <el-input size="small" v-model="addList.wordRank" type="number" placeholder="默认带出" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','wordRank')"></el-input>
                        </el-form-item>
                        <el-form-item label="变更后版本:" prop="updatedVer" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','updatedVer')">
                            <el-input size="small" v-model="addList.updatedVer" placeholder="默认带出" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','updatedVer')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单号:" prop="oddNum" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','oddNum')">
                            <el-input size="small" v-model="addList.oddNum" placeholder="自动生成" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','oddNum',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人:" prop="createUserName" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','createUserName')">
                            <el-input size="small" v-model="addList.createUserName" placeholder="自动获取" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','createUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人所在部门:" prop="createDeptName" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','createDeptName')">
                            <el-input size="small" v-model="addList.createDeptName" placeholder="自动获取" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','createDeptName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间:" prop="createTime" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','createTime')">
                            <el-input size="small" v-model="addList.createTime" placeholder="自动获取" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','createTime',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请状态:" prop="flowStatus" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','flowStatus')">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="自动获取"  style="width:100%" clearable  :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','flowStatus',0)">
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
                    <el-form-item label="原因描述:" prop="reasonRemark" v-if="this.dynamicFieldShow(fieldPower,'BIZ_GLZD','reasonRemark')">
                            <el-input size="small" type="textarea" rows="3" v-model="addList.reasonRemark" :disabled="this.dynamicFieldEdit(fieldPower,'BIZ_GLZD','reasonRemark')"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <h3>变更信息</h3>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="producAdd" style="margin-bottom:5px" v-if='buttonList.biz_glzd_rowAdd.show'>添加一行</el-button>
                    <el-table
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    :data="addList.manageUpdateInfoVOS"
                    border
                    max-height="370"
                    size='small'
                    style="width: 100%;">
                            <el-table-column
                                type='index'
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="updateChapter"
                                label="变更章节"
                                width="120">
                                <template  slot-scope="scope">
                                    <el-input v-model='scope.row.updateChapter' size='small' placeholder="请输入变更章节"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="beforeContent"
                                label="变更前内容">
                                    <template slot-scope="scope">
                                        <el-input v-model='scope.row.beforeContent' size='small' placeholder="请输入变更前内容"></el-input>
                                    </template>
                            </el-table-column>
                            <el-table-column
                                prop="afterContent"
                                label="变更后内容">
                                    <template slot-scope="scope">
                                        <el-input v-model='scope.row.afterContent' size='small' placeholder="请输入变更后内容"></el-input>
                                    </template>
                            </el-table-column>
                            <el-table-column label="操作"  width='80' v-if='buttonList.biz_glzd_rowDel.show'>
                            <template slot-scope="scope">
                                <el-button icon='el-icon-delete' size="small" type="text"  @click="manageDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                            </template>
                    </el-table-column>
                    </el-table>
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
                                    <el-button size="small" type="primary" v-if="buttonList.biz_glzd_upload.show">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                      </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;">
                    <el-button type="primary" @click="savebtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="buttonList.biz_glzd_save.show">保存</el-button>
                    <el-button type="primary" @click="addBtn('ruleForm')"  :loading="btnLoading" size="small" icon="el-icon-check"  v-if="buttonList.biz_glzd_submit.show">保存并提交</el-button>
                    <el-button @click="close()" size="small" icon="el-icon-close"  v-if="buttonList.biz_glzd_cancel.show">取 消</el-button>
            </div>
            <el-dialog
              title="文件配置"
              :visible.sync="wjpzDia"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="70%">
                  <el-button type="primary" @click="rowAdd" size="small" icon="el-icon-plus" style="margin-bottom:5px;">插入行</el-button>
                  <el-button type="primary" @click="rowSave"   :loading="btnLoading" size="small" icon="el-icon-check" style="margin-bottom:5px;">保存</el-button>
                  <el-table :data="fileConfigVOS" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%">
                      <el-table-column
                        type='index'
                        width="55">
                      </el-table-column>
                      <el-table-column
                            prop="wordCode"
                            label="文件编码">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.wordCode" size="small" placeholder="请输入文件编码" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="wordName"
                            label="文件名称">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.wordName" size="small" placeholder="请输入文件名称" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="wordRank"
                            label="文件等级"
                            width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.wordRank" size="small" type="number" placeholder="请输入文件等级" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="latelyVer"
                            label="最新版本"
                            width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.latelyVer" size="small"  placeholder="请输入最新版本" ></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="deptObject"
                            label="归口部门">
                            <template slot-scope="scope">
                              <el-select size="small" v-model="scope.row.departmentId" value-key="id"  filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="(query)=>{glbm(query,scope.row)}" style="width:100%">
                                <el-option
                                    v-for="item in scope.row.departmentIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                                </el-option>
                              </el-select>
                            </template>
                      </el-table-column>
                      <el-table-column
                            prop="alterDate"
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
import { modelByName } from "@/api/biz/sbgl";
import {submit,detail,fileConfigBySearch,wjpzList,wjpzSub,deptByLabel} from "@/api/biz/officce/glzd"
import { getDictByCode } from "@/api/system/dict";
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
      fileList: [],
      dataList: [],
      fieldPower: {},
      wordNames: [],
      fileConfigVOS:[],
      delFileConfigIds:[],
      departmentIds:[],
      wjpzDia:false,
      statusOption: [],
      buttonList: {
        biz_glzd_upload: { show: true, action: [1, 2,4] },
        biz_glzd_rowAdd: { show: true, action: [1, 2,4] },
        biz_glzd_rowDel: { show: true, action: [1, 2,4] },
        biz_glzd_save: { show: true, action: [1, 2,4] },
        biz_glzd_submit: { show: true, action: [1, 2] },
        biz_glzd_cancel: { show: true, action: [1, 2] },
        biz_glzd_wjpz: { show: true, action: [1, 2,4] },
      },
      dataSrcId: "BIZ_GLZD",
      affixType: "BIZ_GLZD#AFFIX_UPLOAD",
      mainId: "",
      rules: {
        wordContent: [
          { required: true, message: "请选择文件内容", trigger: "blur" }
        ],
        wordId: [
          { required: true, message: "请选择文件名称", trigger: "blur" }
        ],
        fileName: [
          { required: true, message: "请输入文件名称", trigger: "blur" }
        ],
        wordCode: [
          { required: true, message: "请输入文件编号", trigger: "blur" }
        ],
        wordRank: [
          { required: true, message: "请输入文件等级", trigger: "blur" }
        ],
        updatedVer: [
          { required: true, message: "请输入变更后版本", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    open(rowId, staType) {
      this.btnLoading=false
      this.addList = {
        createTime: "",
        createUserName: "",
        flowStatus: "",
        createDeptName: "",
        manageUpdateInfoVOS: []
      };
      this.fileList=[];
      this.dataList=[];
      this.wordNames=[];
      this.departmentIds=[];
      // 读取字段权限和按钮权限
      this.viewInit(this.$route.fullPath,"BIZ_GLZD",this.functionId,this.proDefId,this.nodeCode).then(res=>{
        // 动态处理字段和按钮
        this.dynamicView(this,"BIZ_GLZD",null,this.buttonList,this.fieldPower,res.data.data);
        this.dynamicShow(this.fieldPower,staType,null,this.buttonList);
      });
      if (rowId == "") {
        this.$refs['ruleForm'].resetFields();
        this.getDefaultVal();
      }else{
          detail(rowId).then(res=>{
              this.addList=res.data.data
              if(this.addList.wordContent=='1'||this.addList.wordContent=='3'){
                  this.wordNames.push({wordName:this.addList.wordName,id:this.addList.wordId})
              }
              this.mainId=rowId
              this.init()
          })
      }
    },
    getDefaultVal() {
      addDefaultVaule("BIZ_GLZD").then(res => {
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.createDeptName = res.data.data.CREATE_DEPT_NAME;
      });
    },
    producAdd() {
      this.addList.manageUpdateInfoVOS.push({});
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    savebtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.affixList = this.fileList;
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
          this.addList.affixList = this.fileList;
            submit(this.addList).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.getModel("BIZ_GLZD");
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
        flowKey: "BIZ_GLZD_DART",
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
    wordContentChange(){
        this.$set(this.addList,'fileName','')
        this.$set(this.addList,'wordName','')
        this.$set(this.addList,'wordId','')
        this.$set(this.addList,'wordCode','')
        this.$set(this.addList,'wordRank','')
        this.$set(this.addList,'updatedVer','')
    },
    wordNameChange(){
        this.wordNames.forEach(ele=>{
            if(ele.id==this.addList.wordId){
                this.addList.wordCode=ele.wordCode
                this.addList.wordRank=ele.wordRank
                this.addList.updatedVer=ele.latelyVer
            }
        })
    },
    getwordName(query){
        if(query!=''){
            fileConfigBySearch(query).then(res=>{
                this.wordNames=res.data.data
            })
        }else{
            this.wordNames=[]
        }
    },
    manageDel(row,index){
      this.addList.manageUpdateInfoVOS.splice(index,1)
      if(row.id){
        this.addList.delManageUpdateIds.push(row.id)
      }
    },
    // wjpzShow(){
    //   this.wjpzDia=true
    //   wjpzList().then(res=>{
    //     this.fileConfigVOS=res.data.data
    //     this.fileConfigVOS.forEach(item=>{
    //       if(item.departmentId!=''){
    //         this.$set(item,'departmentIds',[{label:item.departmentName,id:item.departmentId}])
    //       }
    //     })
    //   })
    // },
    rowAdd(){
      this.fileConfigVOS.push({})
    },
    rowDel(row,index){
      this.fileConfigVOS.splice(index,1)
      if(row.id){
        this.delFileConfigIds.push(row.id)
      }
    },
    rowSave(){
      this.btnLoading=true
      wjpzSub({fileConfigVOS:this.fileConfigVOS,delFileConfigIds:this.delFileConfigIds}).then(res=>{
         if(res.data.code==200){
           this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.wjpzDia=false
              this.btnLoading=false
         }else{
           this.$message({
                message: res.data.msg,
                type: "eroor"
              });
              this.btnLoading=false
         }
      })
    },
    glbm(query,row){
      if(query!=''){
        deptByLabel(query).then(res=>{
          this.$set(row,'departmentIds',res.data.data)
        })
      }else{
        this.$set(row,'departmentIds',[])
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
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    }
  },
  created() {
    this.getStatus();
    if (this.detailId && this.detailId != "") {
      this.open(this.detailId, this.diaType);
    }
  }
};
</script>
<style scoped>
</style>
