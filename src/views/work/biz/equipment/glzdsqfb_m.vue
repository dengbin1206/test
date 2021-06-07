<template>
    <div style="width:auto">
        <template>
            <el-form :model="addList" label-position='left'  :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
                <el-row>
                    <h3>管理制度文件发布</h3>
                        <el-form-item label="文件内容:" prop="wordContent">
                            <el-radio-group v-model="addList.wordContent" size="small">
                                <el-radio label="1">变更</el-radio>
                                <el-radio label="2">追加</el-radio>
                                <el-radio label="3">废弃</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="文件名称:" prop="fileName" v-if="addList.wordContent=='2'">
                            <el-input size="small" v-model="addList.fileName" placeholder="请输入文件名称"></el-input>
                        </el-form-item>
                        <el-form-item label="文件名称:" prop="wordId" v-if="addList.wordContent=='1'||addList.wordContent=='3'">
                            <el-select size="small" v-model="addList.wordId" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getwordName"  style="width:100%" @change="wordNameChange">
                                <el-option
                                    v-for="item in wordNames"
                                    :key="item.id"
                                    :label="item.wordName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文件编号:" prop="wordCode">
                            <el-input size="small" v-model="addList.wordCode" placeholder="默认带出"></el-input>
                        </el-form-item>
                        <el-form-item label="文件等级:" prop="wordRank">
                            <el-input size="small" v-model="addList.wordRank" type="number" placeholder="默认带出"></el-input>
                        </el-form-item>
                        <el-form-item label="变更后版本:" prop="updatedVer">
                            <el-input size="small" v-model="addList.updatedVer" placeholder="默认带出"></el-input>
                        </el-form-item>
                        <el-form-item label="单号:" prop="oddNum">
                            <el-input size="small" v-model="addList.oddNum" placeholder="自动生成" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="申请人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" placeholder="自动获取" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="申请人所在部门:" prop="createDeptName">
                            <el-input size="small" v-model="addList.createDeptName" placeholder="自动获取" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间:" prop="createTime">
                            <el-input size="small" v-model="addList.createTime" placeholder="自动获取" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="申请状态:" prop="flowStatus">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="自动获取"  style="width:100%" clearable disabled>
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    <el-form-item label="原因描述:" prop="reasonRemark">
                            <el-input size="small" type="textarea" rows="3" v-model="addList.reasonRemark"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <h3>变更信息</h3>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="producAdd" style="margin-bottom:5px" v-if='editFlag'>添加一行</el-button>
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
                                label="变更前内容"
                                width="150">
                                    <template slot-scope="scope">
                                        <el-input v-model='scope.row.beforeContent' size='small' placeholder="请输入变更前内容"></el-input>
                                    </template>
                            </el-table-column>
                            <el-table-column
                                prop="afterContent"
                                label="变更后内容"
                                width="150">
                                    <template slot-scope="scope">
                                        <el-input v-model='scope.row.afterContent' size='small' placeholder="请输入变更后内容"></el-input>
                                    </template>
                            </el-table-column>
                            <el-table-column label="操作"  width='80' v-if='editFlag'>
                            <template slot-scope="scope">
                                <el-button icon='el-icon-delete' size="small" type="text"  @click="manageDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                            </template>
                    </el-table-column>
                    </el-table>
                </el-row>
                <el-row style="margin-top:20px">
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
                                    <el-button size="small" type="primary" v-if="editFlag">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                      </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="width:100%">
                    <el-button type="primary" @click="savebtn('ruleForm')" style='width:100%' :loading="btnLoading" size="small" icon="el-icon-check" v-if="editFlag">保存</el-button>
            </div>
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
              this.btnLoading=false
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
