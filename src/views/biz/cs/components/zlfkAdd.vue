<template>
    <div style="width:100%;padding:0 20px;">
        <template>
               <el-button type="primary" size="small" @click='pgxxOpen' v-if="diaType==4&&nodeAlias=='1'">派工</el-button>
               <el-button type="primary" size="small" @click="shxsddOpen" v-if="btnList.sqpj_btn">申请配件</el-button>
               <el-button type="primary" size="small" @click="zrrdOpen" v-if="diaType==4&&nodeAlias=='2'">责任认定</el-button>
               <el-button type="primary" size="small" @click="bnfcOpen" v-if="diaType==4&&nodeAlias=='1'">保内返厂</el-button>
               <el-button type="primary" size="small" @click='gfclOpen' v-if="diaType==4&&nodeAlias=='1'">供方处理</el-button>
               <el-button type="primary" size="small" @click='fkxxOpen'>重大反馈</el-button>
               <el-button type="primary" size="small" @click="hfdjOpen" v-if="addList.flowStatus!='0'">回访登记</el-button>
        </template>
        <el-form :model="addList"  :label-position='labelPosition' :rules="rules" ref="ruleForm" label-width="170px"   class="sx_formItem">
            <el-row :gutter="20">
                <h3>质量反馈基本信息</h3>
                <el-col :span="ispc">
                    <el-form-item label="业务类型:" prop="serviceType">
                            <el-radio-group v-model="addList.serviceType" size="small">
                                <el-radio label="1">保内</el-radio>
                                <el-radio label="2">保外</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="计划期:" prop="planDate">
                        <el-date-picker
                                v-model="addList.planDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择计划期">
                            </el-date-picker>
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
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getClientId"  style="width:100%" @change="clientIdChange">
                                <el-option
                                    v-for="item in clientIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="客户级别:" prop="clientClazz">
                            <el-select size="small" v-model="addList.clientClazz"  placeholder="请选择客户级别"  style="width:100%"  disabled>
                                <el-option
                                    v-for="item in clientClazzs"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    <el-form-item label="客户联系人:" prop="contactPersonName">
                        <el-input size="small" v-model="addList.contactPersonName"></el-input>  
                    </el-form-item>
                    <el-form-item label="客户联系电话:" prop="telephone">
                        <el-input size="small" v-model="addList.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="客户要求处理完成日期:" prop="finishDate">
                        <el-date-picker
                                v-model="addList.finishDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择客户要求处理完成日期">
                            </el-date-picker>
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
                </el-col>
                <el-col :span='ispc'>
                    <el-form-item label="申请号:" prop="oddNum">
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
                    <el-form-item label="紧急程度:" prop="urgencyDegree">
                            <el-select size="small" v-model="addList.urgencyDegree"   placeholder="请选择紧急程度"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in urgencyDegrees"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="收费分类:" prop="chargeType">
                            <el-select size="small" v-model="addList.chargeType"   placeholder="请选择收费分类"  style="width:100%" clearable>
                                <el-option label="不收费" value="1"></el-option>
                                <el-option label="客户责任不收费" value="2"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="预计损失金额(元):" prop="lossAmount">
                            <el-input size="small" v-model="addList.lossAmount" placeholder='请输入预计损失金额' type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="部门:" prop="departmentName">
                            <el-input size="small" v-model="addList.departmentName" placeholder="自动带出" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="客户详细地址:" prop="detailAddress">
                        <el-input size="small" v-model="addList.detailAddress" placeholder="请输入客户详细地址" type="textarea" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="故障简要描述:" prop="easyRemark">
                        <el-input size="small" v-model="addList.easyRemark" placeholder="请输入故障简要描述" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <h3>产品信息</h3>
                <el-table
                    :data="addList.feedbackProductInfoVOS"
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    max-height="370"
                    border
                    size='small'
                    style="width: 100%">
                    <el-table-column type='index' width="55"></el-table-column>
                    <el-table-column  prop="rowNumber" label="行号" width="70"></el-table-column>
                    <el-table-column prop="markerNum" label="合同标的"></el-table-column>
                    <el-table-column  prop="startNum" label="出厂编号"></el-table-column>
                    <el-table-column  prop="deliveryDate" label="发货日期"></el-table-column>
                    <el-table-column  prop="fanType" label="风机类型">
                         <template slot-scope="scope">
                            <el-select v-model="scope.row.fanType" placeholder="请选择风机类型" size="small" style="width:100%" clearable disabled>
                                <el-option v-for="item in fanTypes" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="modelNum" label="型号"></el-table-column>
                    <el-table-column  prop="faultParts" label="故障部件">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.faultParts"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="goodsNum" label="数量">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.goodsNum" type="number"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
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
                                    <el-button size="small" type="primary"  v-if="btnList.upload_btn">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                      </el-form-item>
                </el-col>
                <el-col :span="ispc">
                    <el-form-item label="特批报告上传:">
                          <el-upload
                                    class="upload-demo"
                                    action="bbb"
                                    :http-request="uploadAction2"
                                    :on-preview="handlePreview2"
                                    :on-remove="handleRemove2"
                                    :before-remove="beforeRemove2"
                                    :before-upload="beforeUpload2"
                                    :on-success="uploadSuccessFile2"
                                    :file-list="fileList2"
                                >
                                    <el-button size="small" type="primary" v-if="btnList.upload_btn">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                      </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;"  v-if='ispc==12'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
            <el-button type="primary" @click="rowsub('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.sub_btn">保存并提交</el-button>
            <el-button type="primary" @click="close()"  size="small" icon="el-icon-close" v-if="btnList.close_btn">取消</el-button>
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
              <pgxx ref="pgxx" :turnoff='turnoff'/>
        </el-dialog>
        <el-dialog
              title="重大反馈"
              :visible.sync="fkxxDia"
              append-to-body
              :close-on-click-modal='false'
              width="75%">
              <div style="width:100%;height:300px;">
                <el-row>
                <el-col :span="3" style='line-height:32px;text-align:center;'>选择人员:</el-col>
                <el-col :span="10">
                  <el-select size="small" v-model="fkry" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getChargeStaff" style="width:100%" @change="chargeStaffChange">
                          <el-option
                              v-for="item in chargeStaffs"
                              :key="item.id"
                              :label="item.realName"
                              :value="item.id">
                              <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                          </el-option>
                  </el-select>
                </el-col>
                <el-col :span="11"><el-button type="primary" size="small" style='margin-left:15px;'>发送</el-button></el-col>
              </el-row>
              </div>
        </el-dialog>
    </div>
</template>
<script>
import {getContractBySearch} from '@/api/biz/crm/xsdd'
import {blurrySelect,getUserInfoBySearch,addDefaultVaule} from '@/api/biz/crm/xmbd'
import { getDictByCode,getDictBizByCode } from "@/api/system/dict";
import {save,detail} from '@/api/biz/cs/zlfk'
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
        pg_btn:false,
        sqpj_btn:false,
        zrrd_btn:false,
        bnfc_btn:false,
        gfcl_btn:false,
        zdfk_btn:false,
        hfdj_btn:false,
        upload_btn:false,
        save_btn:false,
        sub_btn:false,
        close_btn:false
      },
      fkry:'',
      fkxxDia:false,
      pgxxDia:false,
      btnLoading:false,
      addList:{
          feedbackProductInfoVOS:[]
      },
      contractIds:[],
      clientIds:[],
      chargeStaffs:[],
      statusOption:[],
      fanTypes:[],
      clientClazzs:[],
      urgencyDegrees:[],
      fileList:[],
      dataList: [],
      dataSrcId: "CS_ZLFK",
      affixType: "CS_ZLFK#AFFIX_UPLOAD",
      mainId: "",
      fileList2:[],
      dataList2: [],
      dataSrcId2: "CS_ZLFK",
      affixType2: "CS_ZLFK#SPECIAL_REPORT",
      mainId2: "",
      rules: {
        serviceType: [{ required: true, message: "请选择业务类型" }],
        paperContractNo: [{ required: true, message: "请选择合同号" }],
        clientInfo: [{ required: true, message: "请选择客户名称" }],
        chargeStaff: [
          { required: true, message: "请选择负责员工"}
        ]
      }
    };
  },
  methods: {
    open(rowId,diaType){
        this.addList={
            feedbackProductInfoVOS:[]
        }
        this.contractIds=[]
        this.clientIds=[]
        this.chargeStaffs=[]
        this.fileList=[]
        this.dataList= []
        this.fileList2=[]
        this.dataList2= []
        if(diaType==1||diaType==2){
          this.btnList={
            upload_btn:true,
            save_btn:true,
            sub_btn:true,
            close_btn:true
          }
        }else if(diaType==3||diaType==4||diaType==5){
          this.btnList={
            upload_btn:false,
            save_btn:false,
            sub_btn:false,
            close_btn:false
          }
        }
        if(rowId==''){
            this.getDefaultVal()
        }else{
            detail(rowId).then(res=>{
                this.addList=res.data.data
                this.mainId=rowId
                this.mainId2=rowId
                this.init()
                this.init2()
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
                blurrySelect(this.addList.clientInfo.id).then(res=>{
                    if(res.data.data.length>0){
                        this.$set(this.addList,'contactPersonName',res.data.data[0].relation)
                        this.$set(this.addList,'telephone',res.data.data[0].contactNumber)
                        this.$set(this.addList,'clientClazz',res.data.data[0].customerLevel)
                    }else{
                        this.$set(this.addList,'contactPersonName','')
                        this.$set(this.addList,'telephone','')
                        this.$set(this.addList,'clientClazz','')
                    }
                })
                this.$set(this.addList,'feedbackProductInfoVOS',item.productContractInfoVOS)
                if(this.addList.feedbackProductInfoVOS.length>0){
                    this.addList.feedbackProductInfoVOS.forEach((item,index)=>{
                        item.rowNumber=(index+1)*10
                        item.id=''
                    })
                }
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
                this.$set(this.addList,'clientClazz',item.customerLevel)
            }
        })
    },
    //负责员工
    getChargeStaff(query){
        if(query!=''){
            getUserInfoBySearch(query).then(res=>{
                this.chargeStaffs=res.data.data
            })
        }else{
          this.chargeStaffs=[]
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
        addDefaultVaule('CS_ZRRD').then(res=>{
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
          this.$set(this,'fanTypes',res.data.data)
      });
    },
    //客户等级
    getclientClazzs() {
      getDictBizByCode("crm_client-grade").then(res => {
        this.clientClazzs = res.data.data;
      });
    },
    //紧急程度
    geturgencyDegrees(){
        getDictBizByCode("cs_urgency_degree").then(res => {
            this.urgencyDegrees = res.data.data;
      });
    },
    //保存
    rowSave(formName){
        this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.addList.affixList=this.fileList
          this.addList.specialReportList=this.fileList2
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
          this.addList.affixList=this.fileList
          this.addList.specialReportList=this.fileList2
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getModel("CS_ZLFK");
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
        flowKey: "CS_ZLFK_DART",
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
    //派工
    pgxxOpen(){
      this.pgxxDia=true
      setTimeout(() => {
        this.$refs.pgxx.confirmProcess(this.addList.id,0)
      }, 1000)
    },
    //售后销售订单
    shxsddOpen(){
      this.turnoff()
      let htcp = {
          htId: this.addList.id,
        };
      this.$router.push("/biz/cs/shxsdd");
      localStorage.setItem("htcp", JSON.stringify(htcp));
    },
    //责任认定
    zrrdOpen(){
      this.turnoff()
      let zrrd = {
          zrId: this.addList.id,
        };
      this.$router.push("/biz/cs/duty");
      localStorage.setItem("zrrd", JSON.stringify(zrrd));
    },
    //保内返厂
    bnfcOpen(){
      this.turnoff()
      let bnfc = {
          fcId: this.addList.id,
          type:'zlfk'
        };
      this.$router.push("/biz/cs/factory");
      localStorage.setItem("bnfc", JSON.stringify(bnfc));
    },
    //供方处理
    gfclOpen(){
      this.turnoff()
      let gfcl = {
          gfId: this.addList.id,
        };
      this.$router.push("/biz/cs/supplier");
      localStorage.setItem("gfcl", JSON.stringify(gfcl));
    },
    //回访登记
    hfdjOpen(){
      this.turnoff()
      let hfdj = {
          hfId: this.addList.id,
          type:'zlfk'
        };
      this.$router.push("/biz/cs/shhf");
      localStorage.setItem("hfdj", JSON.stringify(hfdj));
    },
    //重大反馈
    fkxxOpen(){
      this.fkxxDia=true
      this.fkry=''
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


    //上传附件
    init2() {
      let obj = {
        dataId: this.mainId2,
        dataSrcId: this.dataSrcId2,
        affixType: this.affixType2
      };
      this.fileList2 = [];
      this.dataList2 = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList2.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId2,
              isEdit: 1
            });
            this.dataList2.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadAction2(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId2);
      form.append("affixType", this.affixType2);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList2.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType2,
              dataSrcId: this.dataSrcId2,
              fileName: res.data.data.originalFileName
            });
            this.dataList2.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType2,
              dataSrcId: this.dataSrcId2
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemove2(file, fileList) {
      this.fileList2.forEach(ele => {
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
    handlePreview2(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
          file.raw.fileId}&dataSrcId=${file.dataSrcId ||
          ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemove2(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload2(file) {
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile2(response, file, fileList) {
      console.log(response);
    },
  },
  created() {
    this.getStatus()
    this.getFanTypes()
    this.getclientClazzs()
    this.geturgencyDegrees()
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

