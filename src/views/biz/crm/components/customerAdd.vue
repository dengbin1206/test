<template>
   <basic-container style="height:100%">
       <div class="dialog-body">
        <el-form :model="basicForm" :rules="rules" ref="ruleForm" label-width="140px" size="small" :disabled="editFlag !=undefined ? !editFlag : false">
          <el-row :gutter="20">
            <el-col :span="12">
              <h4>基础信息</h4>
              <el-form-item label="客户编码:">
                <el-input v-model="basicForm.customerCode" placeholder="自动生成" disabled></el-input>
              </el-form-item>
              <el-form-item label="ERP客户编码:">
                <el-input v-model="basicForm.erpCustomerCode" placeholder="正式客户审批通过后生成" disabled></el-input>
              </el-form-item>
              <el-form-item label="客户名称:" prop="customerName">
                <el-input v-model="basicForm.customerName" placeholder="请输入客户名称" ></el-input>
                 <!-- <el-select
                  v-model="basicForm.customerId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchCustomerName(query)"
                  placeholder="请输入客户名称搜索"
                  :loading="customerNameloading"  
                >
                  <el-option
                    v-for="item in customerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="客户组:" prop="customerGroup">
                <el-select v-model="basicForm.customerGroup" placeholder="请选择客户组">
                  <el-option
                    v-for="item in customerGroup"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="行业:" prop="industry">
                <el-select
                  v-model="basicForm.industry"
                  placeholder="请选择行业"
                  @change="selectIndustry"
                >
                  <el-option
                    v-for="item in industry"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="细分行业:" prop="segmentIndustry">
                <el-select v-model="basicForm.segmentIndustry" placeholder="请选择细分行业">
                  <el-option
                    v-for="item in segmentIndustry"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户状态:" prop="customerStatus">
                <el-radio-group v-model="basicForm.customerStatus" disabled>
                  <el-radio label="1">正式</el-radio>
                  <el-radio label="2">潜在</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="客户级别:">
                <el-radio-group v-model="basicForm.customerLevel">
                  <el-radio label="1">一般客户</el-radio>
                  <el-radio label="2">大客户</el-radio>
                  <el-radio label="3">战略客户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="客户所属国家:" prop="area">
                <el-select v-model="basicForm.area">
                  <el-option
                    v-for="item in area"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="负责员工:" prop="userId">
                <el-select
                  v-model="basicForm.userId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="dropFuzzySearch"
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
              <el-form-item label="办事处:">
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
            </el-col>
            <el-col :span="12">
              <h4>系统信息</h4>
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
                <!-- <el-input v-model="basicForm.createUser" placeholder="自动带入" disabled></el-input> -->
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
              <h4>其他负责员工</h4>
              <el-form-item label="其他负责员工:">
                <el-select
                  v-model="basicForm.customerOtherUserEntityList"
                  value-key="id"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="otherFuzzyStaff"
                  placeholder="请输入其他负责员工"
                  :loading="otherStaffLoading"
                >
                  <el-option
                    v-for="item in otherStaff"
                    :key="item.id"
                    :label="item.realName"
                    :value="item"
                  >
                  <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <h3>客户联系人</h3>
          <el-button icon="el-icon-plus" type="primary" size="small" @click="addCustomer" v-if="editFlag!=undefined ? editFlag : true">添加一行</el-button>
          <el-table
            :data="basicForm.customerUserList"
            border
            max-height="500px"
            class="customerMainData"
            style="width: 100%;margin-top:10px"
          >
            <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
            <el-table-column prop="customerUserName" label="姓名" align="center">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">姓名</span>
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="'customerUserList.' + scope.$index + '.customerUserName'" :rules="rules.customerUserName" label-width="0" >
                <el-input size="small" v-model="scope.row.customerUserName" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="telephone" label="联系电话" align="center">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">联系电话</span>
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="'customerUserList.' + scope.$index + '.telephone'" :rules="rules.telephone" label-width="0" >
                <el-input size="small" v-model="scope.row.telephone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="customerPostName" label="职务" align="center">
              <template slot-scope="scope">
                 <el-form-item :prop="'customerUserList.' + scope.$index + '.customerPostName'"  label-width="0" >
                <el-input size="small" v-model="scope.row.customerPostName" placeholder="请输入职务"></el-input>
                 </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80px" fixed="right" v-if="editFlag!=undefined ? editFlag : true">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color:red"
                  icon="el-icon-delete"
                  @click="handelCustomerDelete(scope.row, scope.$index)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <h3>财务信息 (潜在客户不必填)</h3>
          <el-button icon="el-icon-plus" type="primary" size="small" @click="addFinancial" v-if="editFlag!=undefined ? editFlag : true">添加一行</el-button>
          <el-table :data="basicForm.customerFinancialEntityList" class="customerMainData" border style="width:100%;margin-top:10px">
            <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
            <el-table-column prop="company" label="销售公司" align="center" width="240">
              <template slot-scope="scope">
                <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.company'"  label-width="0" >
                <el-select v-model="scope.row.company" size="small" placeholder="请选择公司">
                  <el-option
                    v-for="item in company"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="accountStatus" label="应收账款类型" align="center" width="240">
              <template slot-scope="scope">
                 <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.accountStatus'"  label-width="0" >
                <el-select v-model="scope.row.accountStatus" size="small" placeholder="请选择应收账款">
                  <el-option
                    v-for="item in accountStatus"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
                 </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="taxpayer" label="客户纳税人识别号" align="center" width="240">
              <template slot-scope="scope">
                <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.taxpayer'"  label-width="0" >
                <el-input size="small" v-model="scope.row.taxpayer" placeholder="请输入纳税人识别号"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="客户地址" align="center" width="240">
              <template slot-scope="scope">
                 <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.address'"  label-width="0" >
                <el-input size="small" v-model="scope.row.address" placeholder="请输入地址"></el-input>
                 </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="客户电话" align="center" width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.phone'"  label-width="0" >
                <el-input size="small" v-model="scope.row.phone" placeholder="请输入电话"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="bankName" label="客户开户行" align="center" width="220">
              <template slot-scope="scope">
                <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.bankName'"  label-width="0" >
                <el-input size="small" v-model="scope.row.bankName" placeholder="请输入开户行"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="bankAccount" label="客户银行账号" align="center" width="240">
              <template slot-scope="scope">
                <el-form-item :prop="'customerFinancialEntityList.' + scope.$index + '.bankAccount'"  label-width="0" >
                <el-input size="small" v-model="scope.row.bankAccount" placeholder="请输入银行账号"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80px" fixed="right" v-if="editFlag!=undefined ? editFlag : true">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color:red"
                  icon="el-icon-delete"
                  @click="handelFinancialDelete(scope.row, scope.$index)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <h3>销售区域 (潜在客户不必填)</h3>
          <el-button icon="el-icon-plus" type="primary" size="small" v-if="editFlag!=undefined ? editFlag : true" @click="addSale">添加一行</el-button>
          <el-table
            :data="basicForm.customerSalesAreaEntityList"
            border
            max-height="500px"
            class="customerMainData"
            style="width: 100%;margin-bottom:30px;margin-top:10px"
          >
            <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
            <el-table-column prop="salesDeptId" label="销售组织" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'customerSalesAreaEntityList.' + scope.$index + '.salesDeptId'"  label-width="0" >
                <el-select v-model="scope.row.salesDeptId" size="small" placeholder="请选择销售组织">
                  <el-option
                    v-for="item in salesDeptId"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="incomeStatus" label="收入类型" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'customerSalesAreaEntityList.' + scope.$index + '.incomeStatus'"  label-width="0" >
                <el-select v-model="scope.row.incomeStatus" size="small" placeholder="请选择收入类型">
                  <el-option
                    v-for="item in incomeStatus"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="invoicingCurrency" label="开票货币" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'customerSalesAreaEntityList.' + scope.$index + '.invoicingCurrency'"  label-width="0" >
                <el-select v-model="scope.row.invoicingCurrency" size="small" placeholder="请选择开票货币">
                  <el-option
                    v-for="item in invoicingCurrency"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select> 
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="containTax" label="是否含税" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'customerSalesAreaEntityList.' + scope.$index + '.containTax'"  label-width="0" >
                <el-select v-model="scope.row.containTax" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in containTax"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80px" fixed="right" v-if="editFlag!=undefined ? editFlag : true">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color:red"
                  icon="el-icon-delete"
                  @click="handleSaleDelete(scope.row, scope.$index)"
                >删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
             <el-col :span="12">
             <el-form-item label="上传附件:" prop="affixList">
             <file-upload
             ref="fileUpload"
              :data.sync="affixList"
              :mainId="mainDataId"
              :disabled="editFlag !=undefined ? !editFlag : false"
              modelName="CRM_KHZSJ"
              fieldName="CRM_KHZSJ#ANNEX"
            ></file-upload>
          </el-form-item>
          </el-col>
          </el-row>
          </el-form>
      </div>
      <div  style="margin-top:10px;display:flex;justify-content:flex-end;margin-bottom:50px;" v-if="editFlag==undefined">
        <div v-if="basicForm.flowStatus !='1' && basicForm.flowStatus !='4'">
        <el-button
          v-if=" basicForm.customerStatus =='1'"
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="submit('ruleForm',2)"
        >发起变更流程</el-button>
        <el-button
          v-if=" basicForm.customerStatus =='2'"
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="submit('ruleForm',3)"
        >发起转正流程</el-button>
        <el-button
          v-if="basicForm.customerStatus =='2' "
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="submit('ruleForm',0)"
        >保 存</el-button>
        </div>
        <div style="margin-left:10px">
        <el-button size="small" @click="close()" icon="el-icon-circle-close">取 消</el-button>
        </div>
      </div>
   </basic-container>
</template>
<script>
import {
  submit,
  getList,
  getDetail,
  getFixedValue,
  getArea,
  getIndustry,
  getUserName,
  remove,
  queryFormInfo,
  getCustomerName
} from "@/api/biz/crm/customer";
import { mapGetters } from "vuex";
import fileUpload from "@/components/fileUpload";
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
    proDefId: { type: String, default: null },
    functionId: { type: String, default: null },
    nodeCode: { type: String, default: null },
    diaType: { type: Number, default: null }
  },
   data(){
      return {
      btnLoading: false,
      industry: [],
      segmentIndustry: [],
      area: [],
      affixList: [], //附件
      mainDataId: "", //主模型Id
      customerNameList:[], // 客户名称
      customerNameloading:false,  // 客户名称loading
      responsibleStaff: [], //负责员工
      selectDeptId: "", //选中的负责员工
      formData: {}, //后台返回表单数据
      otherStaff: [], //其他负责员工
      loading: false,
      userLoading: false, //负责员工
      otherStaffLoading: false, // 其他负责员工
      clickquery: "",
      title: "",
      selectQuery: {}, //查询条件
      // dialogVisible: this.dialogVisible, //新增修改弹框
      basicForm: {
        customerUserList:[],
        customerFinancialEntityList: [],
        customerSalesAreaEntityList: [],
      },
      customerUserList: [],
      customerFinancialEntityList: [],
      customerSalesAreaEntityList: [],
      rules: {
        customerName: [
          { required: true, message: "请输入客户名称"}
        ],
        customerGroup: [
          { required: true, message: "请选择客户组" }
        ],
        relation: [
          { required: true, message: "请输入联系人"}
        ],
        contactNumber: [
          { required: true, message: "请输入联系电话"}
        ],
        industry: [
          { required: true, message: "请选择行业" }
        ],
        segmentIndustry: [
          { required: true, message: "请选择细分行业"}
        ],
        customerStatus: [
          { required: true, message: "请选择客户状态"}
        ],
        area: [{ required: true, message: "请选择国家"}],
        userId: [
          { required: true, message: "请选择负责员工" }
        ],
        customerUserName:[{
           required: true, message: "请输入姓名"
        }],
        telephone:[{
          required: true, message: "请输入联系电话"
        }]
      },
      company: [], //公司
      accountStatus: [], //应收账款类型
      salesDeptId: [], // 销售组织
      incomeStatus: [], //收入类型
      invoicingCurrency: [], //开票货币
      containTax: [], //是否含税
      flowStatus: [], //审批状态,
      customerGroup: [],
      addDataId: "", // 保存并提交需要的Id
      deptInfo:[], // 办事处信息
      createInfo:[] // 创建人信息
      }
   },
   created(){
      this.getDicts("company").then(res => {
      this.company = res.data.data;
    });
    this.getDicts("receivables-type").then(res => {
      this.accountStatus = res.data.data;
    });
    this.getDicts("crm_sale_group").then(res => {
      this.salesDeptId = res.data.data;
    });
    this.getDicts("crm_income_type").then(res => {
      this.incomeStatus = res.data.data;
    });
    this.getDicts("bill-coin").then(res => {
      this.invoicingCurrency = res.data.data;
    });
    this.getDicts("crm_tax_included").then(res => {
      this.containTax = res.data.data;
    });
    this.getDicts("KTOKD").then(res => {
      this.customerGroup = res.data.data;
    });
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
    this.getDicts("country").then(res => {
      this.area = res.data.data;
    });
    getIndustry("industry", "-1").then(res => {
      this.industry = res.data.data;
      // this.option.column.find(item => item.prop == "industry").dicData =
      //   res.data.data;
    });
    console.log(this.detailId)
    if(this.detailId){
        this.detail(this.detailId)
    }
   },
   methods:{
      add(){
      this.basicForm = {
        customerUserList:[],
        customerFinancialEntityList: [],
        customerSalesAreaEntityList: [],
      };
      // this.$refs.fileUpload.add();
      this.affixList = [];
      this.mainDataId = "";
      this.responsibleStaff = [];
      this.customerNameList = [];
      this.otherStaff = [];
      this.segmentIndustry = [];
      this.$set(this.basicForm, "customerStatus", "2");
      this.$set(this.basicForm, "customerLevel", "1");
      this.$set(this.basicForm, "customerGroup", "Z001");
      this.$set(this.basicForm, "area", "1001");
      getFixedValue("CRM_KHZSJ").then(res => {
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
      //   this.$set(this.basicForm, "userName", res.data.data.CREATE_USER_NAME);
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
      //   this.title = "编辑 客户主数据";
        getIndustry("industry", res.data.data.industry).then(res => {
          this.segmentIndustry = res.data.data;
        });
        
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
        //  this.basicForm.userId = res.data.data.userId;
        //  this.basicForm.deptId = res.data.data.deptId;
         this.basicForm = res.data.data;
        this.otherStaff = res.data.data.customerOtherUserEntityList;
        // this.basicForm.createUser = res.data.data.createUser;
        // this.customerUserList = res.data.data.customerUserList;
        // this.customerFinancialEntityList =
        //   res.data.data.customerFinancialEntityList;
        // this.customerSalesAreaEntityList =
        //   res.data.data.customerSalesAreaEntityList;
        this.mainDataId = res.data.data.id;
        this.$refs.fileUpload.init(this.mainDataId);
      //   this.dialogVisible = true;
      });
      },
       // 选中行业
    selectIndustry(value) {
      this.industry.forEach(ele => {
        if (ele.dictKey == value) {
          getIndustry("industry", ele.dictKey).then(res => {
            this.segmentIndustry = res.data.data;
          });
        }
      });
    },
    //负责员工
    dropFuzzySearch(query) {
      if (query !== "") {
        this.userLoading = true;
        getUserName(query).then(res => {
          this.responsibleStaff = res.data.data;
          this.userLoading = false;
        });
      } else {
        this.responsibleStaff = [];
      }
    },
    // 获取办事处
    getDeptId(value) {
      console.log(value);
      this.responsibleStaff.forEach(ele => {
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
    // 其他负责员工
    otherFuzzyStaff(query) {
      if (query !== "") {
        this.otherStaffLoading = true;
        getUserName(query).then(res => {
          this.otherStaff = res.data.data;
          this.otherStaffLoading = false;
        });
      } else {
        this.otherStaff = [];
      }
    },
    //保存
    submit(formName, type) {
      if (type == "1" || type == "2" || type == "3") { 
        if (
          this.basicForm.customerUserList.length == 0 ||
          this.basicForm.customerFinancialEntityList.length == 0 ||
          this.basicForm.customerSalesAreaEntityList.length == 0
        ) {
          this.$message.warning("请填写所有表格信息");
          return;
        }
      }
      if (type == "0") {
        if (this.basicForm.customerUserList.length == 0) {
          this.$message.warning("请填写客户联系人");
          return;
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
         //  this.basicForm.createUser = this.addDefaultDate.CREATE_USER;
         //  this.basicForm.deptId = this.selectDeptId;
          this.basicForm.affixList = this.affixList;
          // this.basicForm.customerUserList = this.customerUserList;
          // this.basicForm.customerFinancialEntityList = this.customerFinancialEntityList;
          // this.basicForm.customerSalesAreaEntityList = this.customerSalesAreaEntityList;
          if (type == 0) {
            this.btnLoading = true;
            submit(this.basicForm)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success("操作成功");
                  this.btnLoading = false;
                  this.close()
                  
                  // this.api();
                }
              })
              .catch(error => {
                this.btnLoading = false;
              });
          }
          if (type == 1) {
            this.basicForm.process="Y" ;
            this.btnLoading = true;
            submit(this.basicForm)
              .then(res => {
                if (res.data.code == 200) {
                  this.addDataId = res.data.data.id;
                  this.submitFlow();
                }
              })
              .catch(error => {
                this.btnLoading = false;
              });
          }
          if (type == 2) {
            this.basicForm.process="Y" ;
            this.btnLoading = true;
            submit(this.basicForm)
              .then(res => {
                if (res.data.code == 200) {
                  modelByName("CRM_KHZSJ").then(res0 => {
                    if (res0.data.code == 200) {
                      let obj = {
                        flowKey: "CRM_KHZSJ_CHANGE_DART",
                        formType: "S",
                        modelId: res0.data.data.id,
                        dataId: res.data.data.id,
                        variables: {functionPath:this.$route.fullPath}
                      };
                      startFlow(obj)
                        .then(res1 => {
                          if (res1.data.code == 200) {
                            this.$message.success(res1.data.msg);
                            this.btnLoading = false;
                            this.close()
                            
                           //  this.api();
                          }
                        })
                        .catch(error => {
                          this.btnLoading = false;
                        });
                    }
                  });
                }
              })
              .catch(error => {
                this.btnLoading = false;
              });
          }
          if (type == 3) {
            this.basicForm.process="Y" ;
            this.btnLoading = true;
            submit(this.basicForm)
              .then(res => {
                if (res.data.code == 200) {
                  modelByName("CRM_KHZSJ").then(res0 => {
                    if (res0.data.code == 200) {
                      let obj = {
                        flowKey: "CRM_KHZ_DART",
                        formType: "S",
                        modelId: res0.data.data.id,
                        dataId: res.data.data.id,
                        variables: {functionPath:this.$route.fullPath}
                      };
                      startFlow(obj)
                        .then(res1 => {
                          if (res1.data.code == 200) {
                            this.$message.success(res1.data.msg);
                            this.btnLoading = false;
                            this.close()
                            
                           //  this.api();
                          }
                        })
                        .catch(error => {
                          this.btnLoading = false;
                        });
                    }
                  });
                }
              })
              .catch(error => {
                this.btnLoading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    //提交流程
    submitFlow() {
      modelByName("CRM_KHZSJ").then(res => {
        if (res.data.code == 200) {
          let obj = {
            flowKey: "CRM_KHZ_DART",
            formType: "S",
            modelId: res.data.data.id,
            dataId: this.addDataId,
            variables: {functionPath:this.$route.fullPath}
          };
          startFlow(obj)
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                 this.btnLoading = false;
                this.close()
               //  this.api();
              }
            })
            .catch(error => {
              this.btnLoading = false;
            });
        }
      });
    },
    //添加客户
    addCustomer() {
      let newValue = {
        customerUserName: "",
        telephone: "",
        customerPostName: ""
      };
      this.basicForm.customerUserList.push(newValue);
    },
    //客户联系人行内删除
    handelCustomerDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerUserList.splice(index, 1);
      });
    },
    //添加财务信息
    addFinancial() {
      let newValue = {
        company: "datongbaofu",
        accountStatus: "rece-out",
        taxpayer: "",
        address: "",
        phone: "",
        bankName: "",
        bankAccount: ""
      };
      this.basicForm.customerFinancialEntityList.push(newValue);
    },
    //财务信息行内删除
    handelFinancialDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerFinancialEntityList.splice(index, 1);
      });
    },
    //添加销售区域
    addSale() {
      let newValue = {
        salesDeptId: "1",
        incomeStatus: "1",
        invoicingCurrency: "RMB",
        containTax: "1"
      };
      this.basicForm.customerSalesAreaEntityList.push(newValue);
    },
    //销售区域行删除
    handleSaleDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerSalesAreaEntityList.splice(index, 1);
      });
    }
   }
}
</script>

<style scoped>
 .star{
   color:#f56c6c;
   /* font-size: 14px; */
   margin-right:4px;
 }
 /* .starName{
   font-size: 14px;
   font-weight: bold;
 } */
 .customerMainData .el-form-item {
  margin:0;
}
</style>