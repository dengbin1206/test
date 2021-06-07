<template>
  <div>
      <div class="dialog-body">
        <el-form :model="basicForm" :rules="giftRules" ref="ruleForm" label-width="140px" size="small">
            <h4>基础信息</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              
              <el-form-item label="纸质合同号:" prop="contractCodeId">
            <el-select
              v-model="basicForm.contractCodeId"
              filterable
              remote
              reserve-keyword
              :remote-method="searchContractCode"
              placeholder="项目报登带出,可修改"
              :loading="contractCodeLoading"
            >
              <el-option
                v-for="item in contractCodeList"
                :key="item.id"
                :label="item.paperContractNo"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
              <el-form-item label="计划日期:">
                <el-date-picker
                  v-model="basicForm.planDate"
                  type="date"
                  placeholder="请选择计划日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="项目名称:">
                <el-input v-model="basicForm.projectName" placeholder="自动带出" disabled></el-input>
              </el-form-item>
              <el-form-item label="主合同交货期:">
                <el-date-picker
                  v-model="basicForm.mainContractDate"
                  type="date"
                  placeholder="请选择主合同交货期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="次合同交货期:">
                <el-date-picker
                  v-model="basicForm.orderContractDate"
                  type="date"
                  placeholder="请选择次合同交货期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="营销总成本:">
                <el-input v-model="basicForm.saleTotalAmount" placeholder="自动带出" disabled></el-input>
              </el-form-item>
              <el-form-item label="采购总成本:">
                <el-input v-model="basicForm.purchaseTotalAmount" placeholder="自动带出" disabled></el-input>
              </el-form-item>
              <el-form-item label="采购订单号:">
                <el-input v-model="basicForm.purchaseCode" placeholder="请输入采购订单号" ></el-input>
              </el-form-item>
             
              
              
              <!-- </el-form> -->
            </el-col>
            <el-col :span="12">
              <!-- <el-form ref="form" :model="systemForm" label-width="100px" size="small"> -->
                <el-form-item label="直发单号:">
                <el-input v-model="basicForm.oddNumbers" placeholder="自动带出" disabled></el-input>
              </el-form-item>
               <el-form-item label="申请人:" prop="userId">
                <el-select
                  v-model="basicForm.userId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="dropFuzzySearch"
                  placeholder="请输入申请员工"
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
              <el-form-item label="申请部门:">
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
            <el-col>
              <el-form-item label="说明:">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="请输入说明"
                  v-model="basicForm.purchaseRemark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <h3>礼品清单</h3>
          <el-button icon="el-icon-plus" type="primary" size="small" v-if="editFlag!=undefined ? editFlag : true" @click="addGift">添加一行</el-button>
          <el-table
            :data="basicForm.purchaseContractSubjectEntityList"
            border
            max-height="500px"
            ref="purchaseList"
            class="tableBox"
            style="width: 100%;"
          >
            <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
            <el-table-column prop="subjectName" label="标的名称" align="center" width="280">
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.subjectName" placeholder="请输入标的名称"></el-input>  
              </template>
            </el-table-column>
            <el-table-column prop="componentNumber" label="数量" align="center" >
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.componentNumber" placeholder="请输入数量"></el-input>  
              </template>
            </el-table-column>
            <el-table-column prop="componentUnit" label="计量单位" align="center" >
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.componentUnit" placeholder="请输入计量单位"></el-input>  
              </template>
            </el-table-column>
            <el-table-column prop="saleAmount" label="营销成本" align="center" >
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.saleAmount" placeholder="请输入计量单位"></el-input>  
              </template>
            </el-table-column>
            <el-table-column prop="supplierId" label="供应商" align="center" >
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.supplierId" placeholder="请输入供应商"></el-input>  
              </template>
            </el-table-column>
             <el-table-column prop="originalQuotation" label="原始报价" align="center" >
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.originalQuotation" placeholder="请输入原始报价"></el-input>  
              </template>
            </el-table-column>
            <el-table-column prop="finalTransactionPrice" label="最终成交价" align="center" width="120">
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.finalTransactionPrice" placeholder="请输入最终成交价"></el-input>  
              </template>
            </el-table-column>
             <el-table-column prop="paymentCondition" label="付款条件" align="center" >
              <template slot-scope="scope"> 
                <el-select v-model="scope.row.paymentCondition" size="small" placeholder="请选择付款条件">
                  <el-option
                    v-for="item in paymentCondition"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select> 
              </template>
            </el-table-column>
             <el-table-column prop="deliveryDate" label="交期(天)" align="center" >
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.deliveryDate" placeholder="请输入交期"></el-input>  
              </template>
            </el-table-column>
             <el-table-column prop="quotationRemark" label="备注" align="center" width="200">
              <template slot-scope="scope"> 
                <el-input size="small" v-model="scope.row.quotationRemark" placeholder="请输入备注"></el-input>  
              </template>
            </el-table-column> 
            <el-table-column label="操作" align="center" fixed="right" width="80" v-if="editFlag!=undefined ? editFlag : true">
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
              :disabled="editFlag !=undefined ? !editFlag : false"
              :data.sync="affixList"
              :mainId="mainDataId"
              modelName="CRM_LPSQ"
              fieldName="CRM_LPSQ#ANNEX"
            ></file-upload>
          </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:10px;text-align:right">
        <el-button
          v-if="editFlag!=undefined ? editFlag : true"
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="submit('ruleForm')"
        >保存并提交</el-button>
        <el-button
        v-if="editFlag!=undefined ? editFlag : true"
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="save('ruleForm')"
        >保 存</el-button>
        <el-button size="small" @click="close()" v-if="editFlag!=undefined ? editFlag : true" icon="el-icon-circle-close">取 消</el-button>
      </div>
  </div>
</template>

<script>
import {
    getContractCode,
    flowList
} from "@/api/supplier/purchaseContract";
import { mapGetters } from "vuex";
import {
  getUserInfoBySearch} from "@/api/biz/crm/xmbd";
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
      //     buttonList: {
      //   crm_lpsq_rowAdd: { show: true, action: [1, 2 ] },
      //   crm_lpsq_rowDel: { show: true, action: [1, 2] },
      //   crm_lpsq_save: { show: true, action: [1, 2, 4] },
      //   crm_lpsq_submit: { show: true, action: [1, 2] },
      //   crm_lpsq_cancel: { show: true, action: [1, 2] },
      //   crm_lpsq_upload: { show: true, action: [1, 2, 4] }
      // },
            btnLoading:false,
            productManagers:[],
      costBear:[], // 费用承担
      bearMode:[], // 承担方式
      flowStatus:[], //审批状态
      affixList: [], //附件
      mainDataId: "", //主模型Id
      responsibleStaff: [], //负责员工
       userLoading: false, //负责员工
      bearPersonLoading: false, // 承担人员loading
      bearPerson:[], // 承担人员
      customerNameloading:false, // 客户名称loading
      customerNameList:[], // 客户名称
      basicForm: {
          giftInventoryEntityList:[]
      },
      deptInfo:[], // 办事处信息
      createInfo:[] , // 创建人信息
      giftRules: {
        giftArrivalDate: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
        userId: [{ required: true, message: "请选择负责员工", trigger: "blur" }],
        bearPerson: [
          { required: true, message: "请输入承担人员", trigger: "blur" }
        ],
        giftMail: [
          { required: true, message: "请选择是否邮寄", trigger: "blur" }
        ],
        addresseePerson: [
          { required: true, message: "请输入收件人", trigger: "blur" }
        ],
        addresseePhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        mailingAddress: [
          { required: true, message: "请输入收件地址", trigger: "blur" }
        ],
        giftName: [
          { required: true, message: "请输入礼品名称", trigger: "blur" }
        ],
        giftNum: [
          { required: true, message: "请输入数量", trigger: "blur" }
        ],
        unitMeasurement: [
          { required: true, message: "请输入单位", trigger: "blur" }
        ],
        giftCompany: [
          { required: true, message: "请输入单价", trigger: "blur" }
        ],
        // totalAmount: [
        //   { required: true, message: "总金额必填", trigger: "blur" }
        // ],
        customerId: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
      },
        }
    },
    created(){
      console.log(this.editFlag)
        this.getDicts("crm_cost_bear").then(res => {
      this.costBear = res.data.data;
    });
     this.getDicts("crm_bear_mode").then(res => {
      this.bearMode = res.data.data;
    });
    this.getmodels('flow_status').then(res => {
      this.flowStatus = res.data.data;
    }); 
    if (this.detailId) {
      this.detail(this.detailId);
    }
    },
    methods:{
        add(){
          this.basicForm = {
           purchaseContractSubjectEntityList:[]
      };
    //   this.$refs.fileUpload.add();
      this.affixList = [];
      this.mainDataId = "";
      this.responsibleStaff = [];
      getFixedValue('CRM_CGHT').then(res => {
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
        this.$set(this.basicForm, "userId", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "deptId", res.data.data.CREATE_DEPT);    
        this.$set(this.basicForm, "createTime", res.data.data.CREATE_TIME);
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
        // res.data.data.giftInventoryEntityList.forEach(ele=>{
        //   ele.customerNameList = [
        //     {
        //       customerName:ele.customerName,
        //       id:ele.customerId
        //     }
        //   ]
        // })
        this.basicForm = res.data.data;
        // this.basicForm.deptId = res.data.data.deptId;
        // this.basicForm.bearPerson = res.data.data.bearPerson;
        // this.basicForm.createUser = res.data.data.createUser;
        this.mainDataId = res.data.data.id;
        this.$refs.fileUpload.init(this.mainDataId);
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
        //保存并提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        //   this.basicForm.createUser = this.addDefaultDate.CREATE_USER;
        //   this.basicForm.deptId = this.selectDeptId;
        //   this.basicForm.bearPerson = this.selectBearPersonId;
          this.basicForm.affixList = this.affixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_LPSQ").then(res1 => {
                let obj = {
                  flowKey: "CRM_LPSQ_DART",
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
        } else {
          return false;
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
    // 承担人员
    searchBearPerson(query) {
      if (query !== "") {
        this.bearPersonLoading = true;
        getUserName(query).then(res => {
          this.bearPerson = res.data.data;
          this.bearPersonLoading = false;
        });
      } else {
        this.bearPerson = [];
      }
    },
    // 承担人员名称
    getBearPersonName(value){
        this.bearPerson.forEach(ele => {
        if (ele.id == value) {
          this.basicForm.bearPersonName = ele.realName;
          this.selectBearPersonId = ele.id;
        }
      });
    },
    //搜索客户名称
    searchCustomerName(query,row){
        if (query !== "") {
        this.customerNameloading = true;
        getCustomerName(query).then(res => {
          row.customerNameList = res.data.data;
          this.customerNameloading = false;
        });
      } else {
        row.customerNameList = [];
      }
    },
     //添加礼品
    addGift() {
      let newValue = {
        giftName: "",
        giftNum: "",
        unitMeasurement: "",
        giftCompany: "",
        giftNum: "",
        totalAmount: "",
        customerId: "",
        customerNameList:[],
        giftPurpose: "",
      };
      this.basicForm.giftInventoryEntityList.push(newValue);
    },
    //礼品行内删除
    handelDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.giftInventoryEntityList.splice(index, 1);
      });
    },
   handleEdit(index, row) {
    if(row.giftNum && row.giftCompany){
        row.totalAmount = (Number(row.giftNum)*Number(row.giftCompany)).toFixed(2);
        let total = 0;
        this.basicForm.giftInventoryEntityList.forEach(ele=>{
          total += Number(ele.totalAmount);
        })
        this.$set(this.basicForm,"giftCost",total)
        // this.basicForm.giftCost = total;
    }else{
        row.totalAmount =null;
        this.$set(this.basicForm,"giftCost",null)
    }

},
    }
}
</script>

<style scoped>

</style>