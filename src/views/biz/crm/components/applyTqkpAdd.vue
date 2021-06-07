<template>
    <basic-container style="height:100%">
         <div v-if="basicForm.flowStatus == '2'">
        <el-button type="primary" size="small" icon="el-icon-s-fold" @click="returnDialog" >回款登记</el-button>
      </div>
      <div class="dialog-body">
        <el-form :model="basicForm" :rules="rules" ref="ruleForm" label-width="170px" size="small" :disabled="editFlag !=undefined ? !editFlag : false">
            <h3>开票信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
           <el-form-item label="纸质合同号:" prop="contractId">
              <el-select
                v-model="basicForm.contractId"
                filterable
                remote
                reserve-keyword
                 
                :remote-method="searchContractCode"
                placeholder="请输入纸质合同号"
                :loading="contractCodeLoading"
                @change="getCodeId"
              >
                <el-option
                  v-for="item in contractCodeList"
                  :key="item.id"
                  :label="item.paperContractNo"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票单位:" prop="invoiceUnit">
               <el-select v-model="basicForm.invoiceUnit" clearable>
                  <el-option
                    v-for="item in company"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="合同总金额(元):">
                <el-input v-model="basicForm.contractTotalAmount" placeholder="自动汇总"  disabled></el-input>
              </el-form-item>
              <el-form-item label="预计发货日期:" prop="expectedDeliverDate">
                <el-date-picker v-model="basicForm.expectedDeliverDate" clearable type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="排单日期:" prop="listDate">
                <el-date-picker v-model="basicForm.listDate" type="date" clearable format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="发票种类:" prop="invoiceStatus">
                <el-radio-group v-model="basicForm.invoiceStatus">
                  <el-radio label="0">专用发票</el-radio>
                  <el-radio label="1">普通发票</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="申请开票金额(元):">
                <el-input v-model="basicForm.invoiceAmount" placeholder="自动汇总" disabled></el-input>
              </el-form-item>
              <el-form-item label="要求开票日期:" prop="invoiceDate">
                <el-date-picker v-model="basicForm.invoiceDate" type="date" clearable format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="预计回款金额(元):" prop="paymentAmount">
                <el-input v-model="basicForm.paymentAmount" placeholder="请输入预计回款金额" clearable></el-input>
              </el-form-item>
              <el-form-item label="预计回款日期:" prop="paymentDate">
                <el-date-picker v-model="basicForm.paymentDate" type="date" clearable format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="(金税)实际开票金额(元):" >
                <el-input v-model="basicForm.actualInvoiceAmount" placeholder="财务填写" :disabled="this.nodeAlias != '2'"></el-input>
              </el-form-item>
              <el-form-item label="实际税额:" >
                <el-input v-model="basicForm.actualTaxAmount" placeholder="财务填写" :disabled="this.nodeAlias != '2'"></el-input>
              </el-form-item>
              <el-form-item label="金税发票号:" >
                <el-input v-model="basicForm.goldenTaxCode" placeholder="财务填写" :disabled="this.nodeAlias != '2'"></el-input>
              </el-form-item>
              <el-form-item label="会计凭证号:" >
                <el-input v-model="basicForm.accountingVoucherCode" placeholder="财务填写" :disabled="this.nodeAlias != '2'"></el-input>
              </el-form-item>
              <el-form-item label="累计实际回款金额(元):" >
                <el-input v-model="basicForm.actualPaymentAmount" placeholder="财务填写" disabled></el-input>
              </el-form-item>
              <el-form-item label="实际回款日期:" >
                <el-date-picker v-model="basicForm.actualPaymentDate" type="date" disabled format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="财务填写"></el-date-picker>
              </el-form-item>
              <el-form-item label="收票联系人:" prop="ticketContacts">
                <el-input v-model="basicForm.ticketContacts" placeholder="请输入收票联系人" clearable ></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="contactNumber">
                <el-input v-model="basicForm.contactNumber" placeholder="请输入联系电话" clearable ></el-input>
              </el-form-item>
              <el-form-item label="收票详细地址:" prop="invoiceDetailedAddress">
                <el-input v-model="basicForm.invoiceDetailedAddress" placeholder="请输入详细地址" clearable ></el-input>
              </el-form-item>   
            </el-col>
            <el-col :span="12">
                  <el-form-item label="单号:">
              <el-input v-model="basicForm.guaranteeNumber" disabled></el-input>
            </el-form-item>
            <el-form-item prop="customerId" label="客户名称:">
                <el-select
                  v-model="basicForm.customerId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchCustomerName(query)"
                  placeholder="纸质合同号带出,可搜索修改"
                  :loading="customerNameloading"  
                >
                  <el-option
                    v-for="item in customerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.id"
                  ></el-option>
                </el-select>
                  </el-form-item>
                  <el-form-item label="纳税人识别号:" prop="taxpayerNumber">
              <el-input v-model="basicForm.taxpayerNumber"  placeholder="纸质合同号带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="详细地址:" prop="invoiceAddress">
              <el-input v-model="basicForm.invoiceAddress"  placeholder="纸质合同号带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="电话:" prop="invoicePhone">
              <el-input v-model="basicForm.invoicePhone"  placeholder="纸质合同号带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="开户行:" prop="bankName">
              <el-input v-model="basicForm.bankName"  placeholder="纸质合同号带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="银行账号:" prop="bankAccount">
              <el-input v-model="basicForm.bankAccount"  placeholder="纸质合同号带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="客户合同号:">
              <el-input v-model="basicForm.customerContractCode"  placeholder="纸质合同号带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="发票是否需要备注客户合同号:" prop="remarkContractCode">
                <el-radio-group v-model="basicForm.remarkContractCode">
                  <el-radio label="1">需要</el-radio>
                  <el-radio label="2">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
               <el-form-item label="负责员工:" prop="userId">
                <el-select
                  v-model="basicForm.userId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="selectPerson"
                  placeholder="请输入负责员工"
                  :loading="userLoading"
                  @change="getDeptId"
                >
                  <el-option
                    v-for="item in responsibleStaff"
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
                  v-model="basicForm.deptId"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in deptInfo"
                    :key="item.CREATE_DEPT"
                    :label="item.CREATE_DEPT_NAME"
                    :value="item.CREATE_DEPT"
                  ></el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="创建人:">
               <el-select
                  v-model="basicForm.createUser"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in createInfo"
                    :key="item.CREATE_USER"
                    :label="item.CREATE_USER_NAME"
                    :value="item.CREATE_USER"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间:">
                <el-date-picker
                  v-model="basicForm.createTime"
                  type="datetime"
                  placeholder="自动带入"
                  disabled
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="审批状态:">
               <el-select v-model="basicForm.flowStatus" disabled>
                  <el-option
                    v-for="item in flowStatus"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审批结束时间:">
                <el-date-picker
                  v-model="basicForm.flowCompletedTime"
                  type="datetime"
                  placeholder="自动带入"
                  disabled
                ></el-date-picker>
              </el-form-item>
             
            </el-col>
          </el-row>
          <el-row>
              <el-col :span="24">
              <el-form-item label="特殊说明:">
              <el-input type="textarea" :rows="5" placeholder="请输入特殊说明" v-model="basicForm.specialInstructions"></el-input>
            </el-form-item>
            </el-col> 
          </el-row>
          <h3>开票内容</h3>
          <el-button icon="el-icon-plus" type="primary" size="small" v-if="editFlag!=undefined ? editFlag : true" @click="addBill">添加一行</el-button>
          <el-table
            :data="basicForm.advanceInvoiceContentEntityList"
            border
            max-height="500px"
            ref="giftList"
            class="applyAdvanceBill"
            style="width: 100%;margin-bottom:30px;margin-top:10px"
          >
            <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
            <el-table-column prop="goodsName" label="货物名称" align="center" width="200px">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">货物名称</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'advanceInvoiceContentEntityList.' + scope.$index + '.goodsName'" :rules="rules.goodsName" label-width="0" >
                <el-input size="small" v-model="scope.row.goodsName" placeholder="请输入货物名称"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="specificationModel" label="规格型号" align="center">
              <template slot-scope="scope">
                  <el-form-item   label-width="0" >
                <el-input size="small" v-model="scope.row.specificationModel" placeholder="请输入规格型号"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="meteringUnit" label="计量单位" align="center">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">计量单位</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'advanceInvoiceContentEntityList.' + scope.$index + '.meteringUnit'" :rules="rules.meteringUnit" label-width="0" >
                <el-input size="small" v-model="scope.row.meteringUnit" placeholder="请输入计量单位"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNumber" label="开票数量" align="center">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">开票数量</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'advanceInvoiceContentEntityList.' + scope.$index + '.invoiceNumber'" :rules="rules.invoiceNumber" label-width="0" >
                <el-input size="small" v-model="scope.row.invoiceNumber" @change="handleEdit(scope.$index, scope.row)" placeholder="请输入开票数量"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="taxPrice" label="含税单价(元)" align="center">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">含税单价(元)</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'advanceInvoiceContentEntityList.' + scope.$index + '.taxPrice'" :rules="rules.taxPrice" label-width="0" >
                <el-input size="small" v-model="scope.row.taxPrice"  @change="handleEdit(scope.$index, scope.row)" placeholder="请输入含税单价"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceAmount" label="开票金额" align="center">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">开票金额</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'advanceInvoiceContentEntityList.' + scope.$index + '.invoiceAmount'"  label-width="0" >
                <el-input size="small" v-model="scope.row.invoiceAmount" disabled placeholder="自动计算"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80px" fixed="right" v-if="editFlag!=undefined ? editFlag : true">
              <template slot-scope="scope">
                <!-- <el-button
                  type="text"
                  size="small"
                  @click="handelDesign(scope.row, scope.index)"
                >编 辑</el-button>-->
                <el-button
                  type="text"
                  size="small"
                  style="color:red"
                  icon="el-icon-delete"
                  @click="handelDelete(scope.row, scope.$index)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
              <el-col :span="12">
          <el-form-item label="上传附件:" prop="affixList">
            <file-upload
              ref="fileUpload"
              :data.sync="AffixList"
              :disabled="editFlag !=undefined ? !editFlag : false"
              :mainId="mainDataId"
              modelName="CRM_TQKP"
              fieldName="CRM_TQKP#ANNEX"
            ></file-upload>
          </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </div>
      <div  style="margin-top:10px;text-align:right;margin-bottom:50px">
        <el-button
          type="primary"
          v-if="editFlag==undefined"
          size="small"
          icon="el-icon-document"
          @click="saveAndSubmit('ruleForm')"
          :loading="btnLoading"
        >保存并提交</el-button>
        <el-button
          type="primary"
         v-if="editFlag == true "
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="save('ruleForm')"
        >保 存</el-button>
        <el-button size="small" v-if="editFlag==undefined" @click="close()" icon="el-icon-circle-close">取 消</el-button>
      </div>

    <el-dialog 
       title="回款登记"
      :visible.sync="returnDialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="returnForm" :model="returnForm" label-width="140px" size="small">
       <el-form-item label="累计实际回款金额:">
              <el-input v-model="returnForm.actualPaymentAmount" placeholder="请输入累计实际回款金额"></el-input>
            </el-form-item>
            <el-form-item label="实际回款日期:">
              <el-date-picker v-model="returnForm.actualPaymentDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择实际回款日期"></el-date-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          @click="bondReturnSave"
        >确 定</el-button>
        <el-button size="small" @click="returnDialogVisible = false" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    </basic-container>
</template>

<script>
import fileUpload from "@/components/fileUpload";
import {
  getList,
  submit,
  getUserName,
  getProjectNumber,
  getFixedValue,
  getDetail,
  remove,
  advanceReturn,
  advanceReturnSubmit,
  getContractCode,
  getCustomerName
} from "@/api/biz/crm/applyAdvanceBill";
import { mapGetters } from "vuex";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
export default {
    components: {
    fileUpload,
  },
  props:{
     dialogVisible:{
        type: Boolean,
        default: false
     },
     nodeAlias:{
      type: String,
      default: ''
    },
    editFlag:{
      type: Boolean,
     default: undefined
    },
    detailId:{
      type: String,
      default: ''
    },
  },
  data(){
      return {
           btnLoading: false,
      contractCodeLoading:false, // 纸质合同号loading
      contractCodeList:[], // 纸质合同号option
      customerNameList:[], // 客户名称option
      customerNameloading:false, // 客户名称loading
      loading: false, // 表格loading
      userLoading:false, // 负责员工loading
      responsibleStaff:[], //负责员工option
      deptInfo:[], // 办事处信息
      createInfo:[], // 创建人信息
      returnDialogVisible:false, //归还弹框
      basicForm: {
        advanceInvoiceContentEntityList:[]
      },
      AffixList:[],// 保证金附件
      mainDataId: "", //主模型Id
      addDefaultValue:[], //新增默认值
      returnForm:{}, //归还表单
      company:[],// 投标单位（公司）
      flowStatus:[], // 审批状态
      rules:{
        contractId: [
          { required: true, message: "请输入纸质合同号" }
        ],
        invoiceUnit: [
          { required: true, message: "请选择开票单位" }
        ],
        expectedDeliverDate: [
          { required: true, message: "请选择预计发货日期"}
        ],
        listDate: [
          { required: true, message: "请选择排单日期" }
        ],
        invoiceStatus: [
          { required: true, message: "请选择发票种类"}
        ],
        invoiceDate: [
          { required: true, message: "请选择要求开票日期"}
        ],
        paymentAmount: [
          { required: true, message: "请输入预计回款金额"}
        ],
        paymentDate: [
          { required: true, message: "请选择预计回款日期"}
        ],
        ticketContacts: [
          { required: true, message: "请输入收票联系人"}
        ],
        contactNumber: [
          { required: true, message: "请输入联系电话"}
        ],
        invoiceDetailedAddress: [
          { required: true, message: "请输入收票详细地址" }
        ],
        customerId: [
          { required: true, message: "请输入客户名称" }
        ],
        taxpayerNumber: [
          { required: true, message: "请输入纳税人识别号"}
        ],
        invoiceAddress: [
          { required: true, message: "请输入详细地址" }
        ],
        invoicePhone: [
          { required: true, message: "请输入电话"}
        ],
        bankName: [
          { required: true, message: "请输入开户行" }
        ],
        bankAccount: [
          { required: true, message: "请输入银行账号" }
        ],
        remarkContractCode: [
          { required: true, message: "请选择是否需要备注"}
        ],
        goodsName: [
          { required: true, message: "请输入货物名称"}
        ],
        meteringUnit: [
          { required: true, message: "请输入计量单位" }
        ],
        invoiceNumber: [
          { required: true, message: "请输入开票数量"}
        ],
        taxPrice: [
          { required: true, message: "请输入含税单价" }
        ],
    },
      }
  },
  created(){
      this.getDicts("company").then(res => {
      this.company = res.data.data;
    });
   
    this.getmodels('flow_status').then(res => {
      this.flowStatus = res.data.data;
    });
    if(this.detailId){
        this.detail(this.detailId)
    }
  },
  methods:{
      add(){
           this.basicForm = {
          advanceInvoiceContentEntityList:[]
      };
      this.AffixList = [];
      this.mainDataId = "";
      this.responsibleStaff = [];
      this.contractCodeList = [];
      this.customerNameList = [];
      getFixedValue('CRM_TQKP').then(res => {
        this.addDefaultValue = res.data.data;
        this.responsibleStaff = [
          {
            realName: res.data.data.CREATE_USER_NAME,
            id: res.data.data.CREATE_USER,
            account:res.data.data.UPDATE_USER.account,
            deptName:res.data.data.CREATE_DEPT_NAME
          }
        ];
        this.deptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.CREATE_DEPT_NAME,
            CREATE_DEPT: res.data.data.CREATE_DEPT
          }
        ];
        this.createInfo = [
          {
            CREATE_USER_NAME: res.data.data.CREATE_USER_NAME,
            CREATE_USER: res.data.data.CREATE_USER
          }
        ];
        this.$set(this.basicForm, "createUser", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "createTime", res.data.data.CREATE_TIME);
         this.$set(this.basicForm, "userId", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "deptId", res.data.data.CREATE_DEPT);
        this.$set(this.basicForm, "flowStatus", res.data.data.FLOW_STATUS);
      });
      },
      close(){
         this.$emit("closeDialog")
      },
      closeValidate(){
         this.$refs.ruleForm.resetFields();
      },
      detail(id){
          getDetail(id).then(res => {
        
        this.responsibleStaff = [
          {
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account:res.data.data.account,
            deptName:res.data.data.deptName
          }
        ];
        this.deptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
          }
        ];
        this.createInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
         this.customerNameList = [
            {
              customerName: res.data.data.customerName,
              id: res.data.data.customerId
            }
          ];
        this.contractCodeList = [res.data.data.contractCodeInfo]
        this.basicForm = res.data.data;
        //  this.basicForm.userId = res.data.data.userId;
        // this.basicForm.deptId = res.data.data.deptName;
        // this.basicForm.createUser = res.data.data.createUser;
        this.mainDataId = res.data.data.id;
         this.$refs.fileUpload.init(this.mainDataId); 
      });
      },
       //添加开票
    addBill() {
      let newValue = {
        goodsName: "",
        specificationModel: "",
        meteringUnit: "",
        invoiceNumber: "",
        taxPrice: "",
        invoiceAmount: "",
      };
      this.basicForm.advanceInvoiceContentEntityList.push(newValue);
    },
    //开票行内删除
    handelDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.advanceInvoiceContentEntityList.splice(index, 1);
      });
    },
    // 保存
      save(formName){
         this.$refs[formName].validate(valid => {
        if (valid) {
          this.basicForm.affixList = this.affixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res => {
            if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.btnLoading = false;
                this.close();
            }
          });
        } else {
          return false;
        }
      });
      },
    // 保存并提交
    saveAndSubmit(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          this.basicForm.affixList = this.AffixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_TQKP").then(res1 => {
                let obj = {
                  flowKey: "CRM_WFHKP_DART",
                  formType: "S",
                  modelId: res1.data.data.id,
                  dataId: res.data.data.id,
                  variables: {functionPath:this.$route.fullPath}
                };
                startFlow(obj)
                  .then(res2 => {
                    if (res2.data.code == 200) {
                      this.$message.success(res2.data.msg);
                     this.btnLoading = false;
                      this.close();
                    }
                  })
                  .catch(error => {
                    this.btnLoading = false;
                  });
              });
            }
          });
        }
      })
    },
   // 搜索纸质合同号
   searchContractCode(query){
       if (query !== "") {
        this.contractCodeLoading = true;
        getContractCode(query).then(res => {
          this.contractCodeList = res.data.data;
          this.contractCodeLoading = false;
        });
      } else {
        this.contractCodeList = [];
      }
   },
   // 选择纸质合同号
   getCodeId(value){
    this.contractCodeList.forEach(ele=>{
        if(ele.id == value){
             this.responsibleStaff = [ele.chargePerson];
             this.$set(this.basicForm,'userId',ele.chargeStaff);
             this.deptInfo = [
          {
            CREATE_DEPT_NAME: ele.departmentName,
            CREATE_DEPT: ele.departmentId
          }
        ];
             this.$set(this.basicForm,'deptId',ele.departmentId);
             this.customerNameList = [ele.clientInfo];
             this.$set(this.basicForm,'customerId',ele.clientId);
             this.$set(this.basicForm,'customerContractCode',ele.clientContractNum);
             this.$set(this.basicForm,'taxpayerNumber',ele.taxNum);
             this.$set(this.basicForm,'invoiceAddress',ele.detailAddress);
             this.$set(this.basicForm,'invoicePhone',ele.telephone);
             this.$set(this.basicForm,'bankName',ele.bankName);
             this.$set(this.basicForm,'bankAccount',ele.bankAndAccount);  
        }
    })
   },
    //选择负责员工
    selectPerson(query) {
      if (query !== "") {
        this.userLoading = true;
        getUserName(query).then(res => {
          this.userOption = res.data.data;
          this.userLoading = false;
        });
      } else {
        this.userOption = [];
      }
    },
    // 获取部门
    getDeptId(value) {
      console.log(value);
      this.userOption.forEach(ele => {
        if (ele.id == value) {
          this.deptInfo = [
          {
            CREATE_DEPT_NAME: ele.deptName,
            CREATE_DEPT: ele.deptId
          }];
          this.basicForm.deptId = ele.deptId;
        }
      });
    },
    //搜索客户名称
    searchCustomerName(query){
        if (query !== "") {
        this.customerNameloading = true;
        getCustomerName(query).then(res => {
          this.customerNameList = res.data.data;
          this.customerNameloading = false;
        });
      } else {
        this.customerNameList = [];
      }
    },
    //回款登记
    returnDialog(){
      advanceReturn(this.mainDataId).then(res=>{
          this.returnForm = res.data.data;
           this.returnDialogVisible = true;
      })
    },
    //回款登记保存
    bondReturnSave(){
      advanceReturnSubmit(this.returnForm).then(res=>{
            this.basicForm.actualPaymentAmount = res.data.data.actualPaymentAmount;
            this.basicForm.actualPaymentDate = res.data.data.actualPaymentDate;
            this.returnDialogVisible = false;
      })
    },
    // 行内计算
    handleEdit(index, row) {
    if(row.invoiceNumber && row.taxPrice){
        row.invoiceAmount = (Number(row.invoiceNumber)*Number(row.taxPrice)).toFixed(2);
        let total = 0;
        this.basicForm.advanceInvoiceContentEntityList.forEach(ele=>{
          total += Number(ele.invoiceAmount);
        })
        this.$set(this.basicForm,"invoiceAmount",total)
    }else{
        row.invoiceAmount =null;
        this.$set(this.basicForm,"invoiceAmount",null)
    }

},
  }
}
</script>

<style scoped>
.star{
   color:#f56c6c;
   /* font-size: 14px; */
   margin-right:4px;
 }
 .applyAdvanceBill .el-form-item{
   margin:0;
 }
</style>