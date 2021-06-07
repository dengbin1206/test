<template>
     <basic-container>
       <!-- <div v-if="wtbServiceForm.flowStatus == '2'">
       <el-button type="primary" size="small" icon="el-icon-s-fold" v-if="editFlag!=undefined ? editFlag : true"  @click="invoiceBack">发票收回</el-button>
       </div> -->
          <el-form ref="serviceForm" :model="wtbServiceForm" :rules="wtbServiceRules" label-width="150px" size="small" :disabled="editFlag !=undefined ? !editFlag : false">
        <h4>中标服务费信息</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目报登号:" prop="projectCode">
              <el-input v-model="wtbServiceForm.projectCode" placeholder="请输入项目报登号" clearable></el-input>
               <!-- <el-select v-model="wtbServiceForm.projectCode"  filterable remote reserve-keyword placeholder="请输入项目报登号" :remote-method="getwtbServiceProjectNewspaper" @change="getwtbServiceProjectInfo" :loading="wtbServiceNewspaperLoading">
              <el-option v-for="item in wtbServiceFormNewspaper" :key="item.projectReportNum" :label="item.projectReportNum" :value="item.projectReportNum"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="投标保证金单位:">
              <el-input v-model="wtbServiceForm.bidBondCode" placeholder="请输入投标保证金单位" clearable></el-input>
            </el-form-item>
           <el-form-item label="纸质合同号:"  prop="contractCode">
             <el-input v-model="wtbServiceForm.contractCode" placeholder="请输入纸质合同号" clearable></el-input>
              <!-- <el-select
                v-model="wtbServiceForm.contractCodeId"
                filterable
                remote
                reserve-keyword
                :remote-method="searchZBContractCode"
                placeholder="项目报登带出,可修改"
                :loading="ZBContractCodeloading"
               
              >
                <el-option
                  v-for="item in ZBContractCodeList"
                  :key="item.id"
                  :label="item.paperContractNo"
                  :value="item.id"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <!-- <el-form-item label="保证金申请金额(元):">
              <el-input v-model="wtbServiceForm.applicationAmount" placeholder="自动带出" disabled></el-input>
            </el-form-item> -->
            <el-form-item label="未归还保证金:">
              <el-input v-model="wtbServiceForm.bondNotReturnedAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入未归还保证金" ></el-input>
            </el-form-item>
             <el-form-item label="计划归还日期:">
              <el-date-picker v-model="wtbServiceForm.plannedReturnDate"  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择计划归还日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="合同总金额(元):">
              <el-input v-model="wtbServiceForm.contractAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入合同总金额" ></el-input>
            </el-form-item>
            <el-form-item label="新增中标服务费(元):" prop="bidServiceAmount">
              <el-input v-model="wtbServiceForm.bidServiceAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入中标服务费"></el-input>
            </el-form-item>
            <!-- <el-form-item label="财务支付(元):">
              <el-input v-model="wtbServiceForm.financialPayment" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入财务支付" ></el-input>
            </el-form-item>
            <el-form-item label="财务支付日期:">
              <el-date-picker v-model="wtbServiceForm.financialPaymentDate"  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择财务支付日期"></el-date-picker>
            </el-form-item> -->
             <el-form-item label="发票收回日期:">
              <el-date-picker v-model="wtbServiceForm.invoiceRecoveryDate"  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请输入发票收回日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="特殊说明:">
              <el-input type="textarea" :rows="8" placeholder="请输入特殊说明" v-model="wtbServiceForm.specialInstructions"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
           
            <!-- <el-form-item label="实际归还日期:">
              <el-date-picker v-model="wtbServiceForm.actualReturnAmount" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item> -->
            <el-form-item label="单号:">
              <el-input v-model="wtbServiceForm.bidServiceChargeCode" placeholder="自动带出" disabled></el-input>
            </el-form-item>
             <el-form-item label="招标单位:" prop="biddingUnit">
               <el-input v-model="wtbServiceForm.biddingUnit" placeholder="请输入招标单位" clearable></el-input>
                  <!-- <el-select
                  v-model="wtbServiceForm.biddingUnitId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchZBCustomerName(query)"
                  placeholder="项目报登带出可修改"
                  :loading="zbcustomerNameloading"
                  
                >
                  <el-option
                    v-for="item in zbcustomerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
              <!-- <el-input v-model="wtbServiceForm.biddingUnit" placeholder="项目报登带出,可修改"></el-input> -->
            </el-form-item>
            <el-form-item label="汇入单位或户名:" prop="remittanceUnit">
              <el-input v-model="wtbServiceForm.remittanceUnit" placeholder="项目报登带出,可修改"></el-input>
            </el-form-item>
             <!-- <el-form-item label="币种:">
              <el-select v-model="wtbServiceForm.currency" size="small" placeholder="请选择币种">
                <el-option
                  v-for="item in currency"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="开户银行:" prop="bankName">
              <el-input v-model="wtbServiceForm.bankName" placeholder="项目报登带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="银行账号:" prop="bankAccount">
              <el-input v-model="wtbServiceForm.bankAccount" placeholder="项目报登带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="付款方式:" prop="paymentMethod">
              <el-select v-model="wtbServiceForm.paymentMethod" >
                <el-option v-for="item in paymentMethod" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责员工:" prop="userId">
              <el-select
                v-model="wtbServiceForm.userId"
                filterable
                remote
                reserve-keyword
                :remote-method="wtbServiceSelectPerson"
                placeholder="请输入负责员工"
                :loading="wtbServiceUserLoading"
                @change="getwtbServiceDeptId"
              >
                <el-option
                  v-for="item in wtbServiceUserList"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门:">
                 <el-select
                  v-model="wtbServiceForm.deptId"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in wtbServiceDeptInfo"
                    :key="item.CREATE_DEPT"
                    :label="item.CREATE_DEPT_NAME"
                    :value="item.CREATE_DEPT"
                  ></el-option>
                </el-select>
              <!-- <el-input v-model="wtbServiceForm.deptId" placeholder="选择员工自动带入" disabled></el-input> -->
            </el-form-item>
            <el-form-item label="创建人:">
                <el-select
                  v-model="wtbServiceForm.createUser"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in wtbServiceCreateInfo"
                    :key="item.CREATE_USER"
                    :label="item.CREATE_USER_NAME"
                    :value="item.CREATE_USER"
                  ></el-option>
                </el-select>
              <!-- <el-input v-model="wtbServiceForm.createUser" placeholder="请输入创建人" disabled></el-input> -->
            </el-form-item>
             <el-form-item label="创建时间:">
              <el-input v-model="wtbServiceForm.createTime" placeholder="自动带出" disabled></el-input>
            </el-form-item>
            
            <el-form-item label="审批状态:">
              <el-select
                v-model="wtbServiceForm.flowStatus"
                size="small"
                disabled
                placeholder="审批状态"
              >
                <el-option
                  v-for="item in flowStatus"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审批结束时间:">
              <el-date-picker v-model="wtbServiceForm.flowCompletedTime" type="datetime" disabled placeholder="自动带出"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="相关文件上传:" prop="affixList">
          <file-upload
           ref="fileUpload"
            :data.sync="wtbServiceAffixList"
            :mainId="wtbServiceMainDataId"
             :disabled="editFlag !=undefined ? !editFlag : false"
            modelName="CRM_ZBFW"
            fieldName="CRM_ZBFW#ANNEX"
          ></file-upload>
        </el-form-item>
      </el-form>
      <div  style="margin-top:10px;text-align:right" >
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="wtbServiceBtnLoading"
           v-if="editFlag==undefined"
          @click="serviceSaveAndSubmit('serviceForm')"
        >保存并提交</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="wtbServiceBtnLoading"
           v-if="editFlag == true "
          @click="serviceSave('serviceForm')"
        >保 存</el-button>
        <el-button size="small"  v-if="editFlag==undefined" @click="close()" icon="el-icon-circle-close">取 消</el-button>
      </div>
     </basic-container>
</template>

<script>
import {
    getDetail,
    serviceSubmit,
    getCustomerName,
    getContractCode,
    getProjectNumber,
    getUserName
} from "@/api/biz/crm/turnZb";
import {
  getFixedValue 
} from "@/api/biz/crm/bond";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
import fileUpload from "@/components/fileUpload";
export default {
components: {
    fileUpload
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    nodeAlias: {
      type: String,
      default: ""
    },
    editFlag: {
      type: Boolean,
      default: undefined
    },
    detailId: {
      type: String,
      default: ""
    }
  },
  data(){
      return {
          currency:[],
          paymentMethod:[],  
          wtbServiceNewspaperLoading:false,
          wtbServiceFormNewspaper:[],
          zbcustomerNameloading:false,
          zbcustomerNameList:[],
          ZBContractCodeloading:false,
          ZBContractCodeList:[],
          flowStatus:[],
          wtbServiceBtnLoading:false,
          wtbServiceUserLoading:false,
          wtbServiceUserList:[],
          wtbServiceDeptInfo:[],
          wtbServiceCreateInfo:[],
          wtbServiceMainDataId:'',
          wtbServiceAffixList:[],
          wtbServiceForm:{},
          wtbServiceRules:{
         projectCode: [
          { required: true, message: "请输入项目报登号"}
        ],
        contractCode: [
          { required: true, message: "请输入纸质合同号" }
        ],
        bidServiceAmount: [
          { required: true, message: "请输入中标服务费"}
        ],
        biddingUnit: [
          { required: true, message: "请输入招标单位"}
        ],
        remittanceUnit: [
          { required: true, message: "请输入汇入单位"}
        ],
        bankName: [
          { required: true, message: "请输入开户行" }
        ],
        bankAccount: [
          { required: true, message: "请输入银行账号"}
        ],
        paymentMethod: [
          { required: true, message: "请选择付款方式" }
        ],
        userId: [
          { required: true, message: "请输入负责员工" }
        ],
    }
      }
  },
  created(){
      this.getDicts("bill-coin").then(res => {
      this.currency = res.data.data;
    });
    this.getDicts("crm_payment_method").then(res => {
      this.paymentMethod = res.data.data;
    });
      this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
    if (this.detailId) {
      this.detail(this.detailId);
    }
  },
  methods:{
    add(){
      this.wtbServiceForm = {};
      this.wtbServiceAffixList = [];
      this.wtbServiceMainDataId = "";
       this.wtbServiceUserList = [];
       this.wtbServiceForm.paymentMethod = '1';
      getFixedValue('CRM_ZBFW').then(res=>{
           this.wtbServiceUserList = [
          {
            realName: res.data.data.CREATE_USER_NAME,
            id: res.data.data.CREATE_USER,
            account:res.data.data.UPDATE_USER.account,
            deptName:res.data.data.CREATE_DEPT_NAME
          }
        ]; 
        this.wtbServiceDeptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.CREATE_DEPT_NAME,
            CREATE_DEPT: res.data.data.CREATE_DEPT
          }
        ];
        this.wtbServiceCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.CREATE_USER_NAME,
            CREATE_USER: res.data.data.CREATE_USER
          }
        ];
        this.$set(this.wtbServiceForm, "createUser", res.data.data.CREATE_USER);
        this.$set(this.wtbServiceForm, "userId", res.data.data.CREATE_USER);
        this.$set(this.wtbServiceForm, "deptId", res.data.data.CREATE_DEPT);
        this.$set(this.wtbServiceForm, "createTime", res.data.data.CREATE_TIME);
        this.$set(this.wtbServiceForm, "flowStatus", res.data.data.FLOW_STATUS);
      })
    },
        detail(id) {
      getDetail(id).then(res => {
        this.wtbServiceUserList = [
          {
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account: res.data.data.account,
            deptName: res.data.data.deptName
          }
        ];
        this.wtbServiceDeptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
          }
        ];
        this.wtbServiceCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
        this.ZBContractCodeList = [
          {
            paperContractNo: res.data.data.contractCode,
            id: res.data.data.contractCodeId
          }
        ];
        this.zbcustomerNameList = [{
           customerName:res.data.data.biddingUnit,
           id:res.data.data.biddingUnitId
       }]
        this.wtbServiceForm = res.data.data;
        this.wtbServiceMainDataId = res.data.data.id;
        this.$refs.fileUpload.init(this.wtbServiceMainDataId);
      });
    },
    close(){
         this.$emit("closeDialog")
      },
      closeValidate(){
         this.$refs.serviceForm.resetFields();
      },
     //中标保存
    serviceSave(formName){
         this.$refs[formName].validate(valid=>{
        if(valid){
          this.wtbServiceForm.affixList = this.wtbServiceAffixList;
         this.wtbServiceBtnLoading = true; 
          serviceSubmit(this.wtbServiceForm).then(res=>{
              if (res.data.code == 200) {
                this.$message.success("操作成功");
              this.wtbServiceBtnLoading = false;
              }
          })
        }else {
          return false;
        }
      })
    },
    // 中标保存并提交
    serviceSaveAndSubmit(formName){
         this.$refs[formName].validate(valid=>{
        if(valid){
           this.wtbServiceForm.affixList = this.wtbServiceAffixList;
          this.wtbServiceBtnLoading = true;
          serviceSubmit(this.wtbServiceForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_ZBFW").then(res1 => {
                let obj = {
                  flowKey: "CRM_ZBFWFF_DART",
                  formType: "S",
                  modelId: res1.data.data.id,
                  dataId: res.data.data.id,
                  variables: {functionPath:this.$route.fullPath}
                };
                startFlow(obj)
                  .then(res2 => {
                    if (res2.data.code == 200) {
                      this.$message.success(res2.data.msg);
                      this.wtbServiceBtnLoading = false;
                      this.close()
                    }
                  })
                  .catch(error => {
                    this.wtbServiceBtnLoading = false;
                  });
              });
            }
          });
        }else {
          return false;
        }
      })
    },
    //搜索招标单位
    searchZBCustomerName(query){
        if (query !== "") {
        this.zbcustomerNameloading = true;
        getCustomerName(query).then(res => {
          this.zbcustomerNameList = res.data.data;
          this.zbcustomerNameloading = false;
        });
      } else {
        this.zbcustomerNameList = [];
      }
    },
    // 中标纸质合同号
   searchZBContractCode(query){
      if (query !== "") {
        this.ZBContractCodeloading = true;
        getContractCode(query).then(res => {
          this.ZBContractCodeList = res.data.data;
          this.ZBContractCodeloading = false;
        });
      } else {
        this.ZBContractCodeList = [];
      }
   },
    // 获取中标项目报登号
    getwtbServiceProjectNewspaper(query){
       if(query !== ""){
          this.wtbServiceNewspaperLoading = true;
           getProjectNumber(query).then(res=>{
             this.wtbServiceFormNewspaper = res.data.data;
             this.wtbServiceNewspaperLoading = false;
           })
        }else{
          this.wtbServiceFormNewspaper = [];
        }
    },
    //获取中标报登号下的信息
    getwtbServiceProjectInfo(value){
       this.wtbServiceFormNewspaper.forEach(ele => {
        if (ele.projectReportNum == value) {
          // this.basicForm.biddingUnit = ele.clientName;
          // this.basicForm.projectName = ele.projectName
          this.wtbServiceUserList = [ele.chargePerson]
            this.$set(this.wtbServiceForm, "userId", ele.chargeStaff);
            this.wtbServiceDeptInfo = [{
                CREATE_DEPT_NAME: ele.departmentName,
            CREATE_DEPT: ele.departmentId
            }]
            this.$set(this.wtbServiceForm, "deptId", ele.departmentId);
             this.ZBContractCodeList = [
            {
              paperContractNo: ele.paperContractNo,
              id: ele.contractId
            }
          ];
          this.$set(
            this.wtbServiceForm,
            "contractCodeId",
            ele.paperContractNo
          );
            this.zbcustomerNameList = [ele.clientInfo];
            this.$set(this.wtbServiceForm, "biddingUnitId", ele.clientId);
        }
      });
    },
    //选择中标负责员工
    wtbServiceSelectPerson(query) {
      if (query !== "") {
        this.wtbServiceUserLoading = true;
        getUserName(query).then(res => {
          this.wtbServiceUserList = res.data.data;
          this.wtbServiceUserLoading = false;
        });
      } else {
        this.wtbServiceUserList = [];
      }
    },
    //获取中标部门
    getwtbServiceDeptId(value) {
      console.log(value);
      this.wtbServiceUserList.forEach(ele => {
        if (ele.id == value) {
           this.wtbServiceDeptInfo = [
          {
            CREATE_DEPT_NAME: ele.deptName,
            CREATE_DEPT: ele.deptId
          }];
          this.wtbServiceForm.deptId = ele.deptId;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>