<template>
    <div style="width:100%;padding:0 20px;">
        <template>
            <el-button type="primary" size="small" @click='pgxxOpen' v-if="diaType==4&&nodeAlias=='1'">派工</el-button>
            <el-button type="primary" size="small" @click='bnfcOpen' v-if="diaType==4&&nodeAlias=='1'">保外返厂</el-button>
            <el-button type="primary" size="small" @click='hfdjOpen' v-if='btnShow'>回访登记</el-button>
        </template>
        <el-form :model="addList" :label-position="labelPosition" :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
            <el-row :gutter="20">
                <h3>调试申请</h3>
                <el-col :span="ispc">
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
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getClientId"  style="width:100%" @change="clientIdChange">
                                <el-option
                                    v-for="item in clientIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="客户要求到现场日期:" prop="arrivalDate">
                        <el-date-picker
                                v-model="addList.arrivalDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择客户要求到现场日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="协调后日期:" prop="coordinateDate">
                        <el-date-picker
                                v-model="addList.coordinateDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择协调后日期">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item label="现场条件:" prop="siteCondition">
                        <el-checkbox v-model="addList.siteCondition" :true-label="1" :false-label="0" style="margin:0;">符合条件</el-checkbox>
                        <el-button type="primary" size="small" style="margin-left:10px">条件明细</el-button>
                    </el-form-item>
                    <el-form-item label="客户联系人:" prop="contactPersonName">
                        <el-input size="small" v-model="addList.contactPersonName"></el-input>  
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="telephone">
                        <el-input size="small" v-model="addList.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="客户详细地址:" prop="detailAddress">
                        <el-input size="small" v-model="addList.detailAddress" placeholder="请输入客户详细地址" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='ispc'>
                    <el-form-item label="申请号:" prop="oddNum">
                        <el-input size="small" v-model="addList.oddNum" placeholder="自动生成" disabled></el-input>
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
                    <el-form-item label="特殊说明:" prop="specialRemark">
                        <el-input size="small" v-model="addList.specialRemark" placeholder="请输入特殊说明" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <h3>产品信息(<span style="color:red">合同</span>)</h3>
                <el-table
                    :data="addList.debugProductInfoVOS"
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    max-height="370"
                    border
                    size='small'
                    style="width: 100%">
                    <el-table-column type='index' width="55"></el-table-column>
                    <el-table-column  prop="rowNumber" label="行号" width="70"></el-table-column>
                    <el-table-column prop="contractNum" label="纸质合同号"></el-table-column>
                    <el-table-column  prop="startNum" label="出厂编号"></el-table-column>
                    <el-table-column  prop="productType" label="产品大类">
                         <template slot-scope="scope">
                            <el-select v-model="scope.row.productType" placeholder="请选择风机类型" size="small" style="width:100%" clearable disabled>
                                <el-option v-for="item in productTypes" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="materialCode" label="物料号"></el-table-column>
                    <el-table-column  prop="materialRemarks" label="物料描述"></el-table-column>
                    <el-table-column  prop="productNum" label="数量">
                        <template slot-scope="scope"><el-input v-model="scope.row.productNum" size="small" placeholder="请输入数量" type="number"></el-input></template>
                    </el-table-column>
                    <el-table-column  prop="finishNum" label="调试完成数量"></el-table-column>
                </el-table>
            </el-row>
            <el-row style="margin-top:20px">
                    <el-col :span="ispc">
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
                                    <el-button size="small" type="primary" v-if="btnList.upload_btn">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                      </el-form-item>
                    </el-col>
                </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;" v-if="ispc==12">
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
            <el-button type="primary" @click="rowsub('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.sub_btn">保存并提交</el-button>
            <el-button type="primary" @click="close()"  size="small" icon="el-icon-close"  v-if="btnList.close_btn">取消</el-button>
        </div>
        <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
                <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
        </div>
        <el-dialog
              title="派工"
              :visible.sync="pgxxDia"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="75%">
              <pgxx ref="pgxx"/>
        </el-dialog>
    </div>
</template>
<script>
import {getContractBySearch} from '@/api/biz/crm/xsdd'
import {blurrySelect,getUserInfoBySearch,addDefaultVaule} from '@/api/biz/crm/xmbd'
import { getDictByCode,getDictBizByCode } from "@/api/system/dict";
import {save,detail} from '@/api/biz/cs/debug'
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
import pgxx from './pgxxAdd'
export default {
  components:{
    pgxx
  },
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
        upload_btn:false,
        save_btn:false,
        sub_btn:false,
        close_btn:false
      },
      btnShow:false,
      pgxxDia:false,
      btnLoading:false,
      addList:{
          debugProductInfoVOS:[]
      },
      contractIds:[],
      clientIds:[],
      chargeStaffs:[],
      statusOption:[],
      productTypes:[],
      fileList:[],
      dataList: [],
      dataSrcId: "CS_TSSQ",
      affixType: "CS_TSSQ#AFFIX_UPLOAD",
      mainId: "",
      rules: {
        paperContractNo: [{ required: true, message: "请选择合同号" }],
        clientInfo: [{ required: true, message: "请选择客户名称" }],
        chargeStaff: [
          { required: true, message: "请选择负责员工" }
        ]
      }
    };
  },
  methods: {
    open(rowId,diaType){
        this.addList={
            debugProductInfoVOS:[]
        }
        this.contractIds=[]
        this.clientIds=[]
        this.chargeStaffs=[]
        this.dataList=[]
        this.fileList=[]
        if(diaType==1||diaType==2){
          this.btnShow=false
          this.btnList.upload_btn=true
          this.btnList.save_btn=true
          this.btnList.sub_btn=true
          this.btnList.close_btn=true
        }else if(diaType==3){
          this.btnShow=true
          this.btnList.upload_btn=false
          this.btnList.save_btn=false
          this.btnList.sub_btn=false
          this.btnList.close_btn=false
        }else if(diaType==4||diaType==5){
          this.btnShow=false
          this.btnList.upload_btn=false
          this.btnList.save_btn=false
          this.btnList.sub_btn=false
          this.btnList.close_btn=false
        }
        if(rowId==''){
            this.getDefaultVal()
        }else{
            detail(rowId).then(res=>{
                this.addList=res.data.data
                this.mainId=rowId
                this.init()
                this.contractIds.push({paperContractNo:this.addList.paperContractNo})
                this.clientIds.push(this.addList.clientInfo)
                this.clientIds.forEach(item=>{
                    item.label=item.customerName
                    item.value={customerName: item.customerName,id: item.id}
                })
                this.chargeStaffs.push(this.addList.chargePerson)
            })
        }
    },
    //合同号
    getContractId(query){
        if(query!=''){
            getContractBySearch(query).then(res=>{
                this.contractIds=res.data.data
            })
        }else{
            this.contractIds=[]
        }
    },
    contractIdChange(){
        this.clientIds=[]
        this.chargeStaffs=[]
        this.contractIds.forEach(item=>{
            if(item.paperContractNo==this.addList.paperContractNo){
                this.$set(this.addList,'clientInfo',item.clientInfo)
                this.clientIds.push(item.clientInfo)
                this.clientIds.forEach(item=>{
                    item.label=item.customerName
                    item.value={customerName: item.customerName,id: item.id}
                })
                this.$set(this.addList,'chargeStaff',item.chargeStaff)
                this.chargeStaffs.push(item.chargePerson)
                this.$set(this.addList,'departmentName',item.departmentName)
                this.$set(this.addList,'departmentId',item.departmentId)
                this.$set(this.addList,'debugProductInfoVOS',item.productContractInfoVOS)
                this.addList.debugProductInfoVOS.forEach((item,index)=>{
                    item.contractNum=this.addList.paperContractNo
                    item.productType=item.fanType
                    item.rowNumber=(index+1)*10
                })
            }
        })
    },
    //客户名称
    getClientId(query){
        if(query!=''){
            blurrySelect(query).then(res=>{
                this.clientIds=res.data.data
                this.clientIds.forEach(item=>{
                    let arr = {
                        customerName: item.customerName,
                        id: item.id
                    };
                    item.label = item.customerName;
                    item.value = arr;
                })
            })
        }else{
            this.clientIds=[]
        }
    },
    clientIdChange(){
        this.clientIds.forEach(item=>{
            if(this.addList.clientInfo.id==item.id){
                this.$set(this.addList,'contactPersonName',item.relation)
                this.$set(this.addList,'telephone',item.contactNumber)
            }
        })
    },
    //负责员工
    getChargeStaff(query){
        if(query!=''){
            getUserInfoBySearch(query).then(res=>{
                this.chargeStaffs=res.data.data
            })
        }
    },
    chargeStaffChange(){
        this.chargeStaffs.forEach(item => {
        if (item.id == this.addList.chargeStaff) {
            this.$set(this.addList,'departmentName',item.deptName)
            this.$set(this.addList,'departmentId',item.deptId)
        }
      });
    },
    getDefaultVal(){
        addDefaultVaule('CS_TSSQ').then(res=>{
            this.$set(this.addList,'createTime',res.data.data.CREATE_TIME)
            this.$set(this.addList,'createUserName',res.data.data.CREATE_USER_NAME)
            this.$set(this.addList,'flowStatus',res.data.data.FLOW_STATUS)
        })
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
          this.$set(this,'productTypes',res.data.data)
      });
    },
    //保存
    rowSave(formName){
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
    rowsub(formName){
        this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.addList.affixList = this.fileList;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getModel("CS_TSSQ");
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
        flowKey: "CS_TSSQ_DART",
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
    pgxxOpen(){
      this.pgxxDia=true
      setTimeout(() => {
        this.$refs.pgxx.confirmProcess(this.addList.id,1)
      }, 1000)
    },
    bnfcOpen(){
      this.turnoff()
      let bnfc = {
          fcId: this.addList.id,
          type:'tssq'
        };
      this.$router.push("/biz/cs/factory");
      localStorage.setItem("bnfc", JSON.stringify(bnfc));
    },
    hfdjOpen(){
      this.turnoff()
      let hfdj = {
          hfId: this.addList.id,
          type:'tssq'
        };
      this.$router.push("/biz/cs/shhf");
      localStorage.setItem("hfdj", JSON.stringify(hfdj));
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
    },
  },
  created() {
    this.getStatus()
    this.getFanTypes()
    if(this.detailId){
      this.open(this.detailId,this.diaType)
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

