<template>
  <basic-container style="height:100%">
        <el-form :model="basicForm" :rules="giftRules" ref="ruleForm" label-width="140px" size="small" :disabled="editFlag !=undefined ? !editFlag : false">
            <h4>基础信息</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              
              <el-form-item label="礼品到位日期:" prop="giftArrivalDate">
                <el-date-picker v-model="basicForm.giftArrivalDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="礼品费(元):">
                <el-input v-model="basicForm.giftCost" placeholder="自动汇总" disabled></el-input>
              </el-form-item>
              <el-form-item label="礼品申请单号:">
                <el-input v-model="basicForm.giftNumber" placeholder="自动带出" disabled></el-input>
              </el-form-item>
              
              <el-form-item label="申请员工:" prop="userId">
                <el-select
                  v-model="basicForm.userId"
                  filterable
                  remote
                  clearable
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
              <el-form-item label="费用承担:" prop="costBearing">
                <el-select v-model="basicForm.costBearing" clearable placeholder="请选择费用承担方式">
                  <el-option
                    v-for="item in costBear"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="承担人员:" prop="bearPerson" v-if="basicForm.costBearing == '0'">
                <el-select
                  v-model="basicForm.bearPerson"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  :remote-method="searchBearPerson"
                  placeholder="请输入承担人员"
                  :loading="bearPersonLoading"
                    
                >
                  <el-option
                    v-for="item in bearPerson"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="承担方式:" v-if="basicForm.costBearing == '0'">
                <el-select v-model="basicForm.bearMode" clearable placeholder="请选择承担方式">
                  <el-option
                    v-for="item in bearMode"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <!-- </el-form> -->
            </el-col>
            <el-col :span="12">
              <!-- <el-form ref="form" :model="systemForm" label-width="100px" size="small"> -->
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
               <el-form-item label="是否邮寄:" prop="giftMail">
                <el-radio-group v-model="basicForm.giftMail">
                  <el-radio label="0">不需要</el-radio>
                  <el-radio label="1">需要</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="收件人:" prop="addresseePerson" v-if="basicForm.giftMail == '1'">
                <el-input v-model="basicForm.addresseePerson" clearable placeholder="请输入收件人" ></el-input>
              </el-form-item>
              <el-form-item label="联系电话:" prop="addresseePhone" v-if="basicForm.giftMail == '1'">
                <el-input v-model="basicForm.addresseePhone" clearable placeholder="请输入联系电话" ></el-input>
              </el-form-item>
              <el-form-item label="详细地址:" prop="mailingAddress" v-if="basicForm.giftMail == '1'">
              <el-input type="textarea" :rows="8" placeholder="请输入详细地址" v-model="basicForm.mailingAddress"></el-input>
            </el-form-item>
            <el-form-item label="邮寄单号:" prop="mailNumber" v-if="basicForm.giftMail == '1'">
              <el-input  placeholder="请输入邮寄单号" clearable v-model="basicForm.mailNumber"></el-input>
            </el-form-item>
            <el-form-item label="选择产品线经理:" prop="productLineId" >
                            <el-select size="small" v-model="basicForm.productLineId"  filterable remote clearable  reserve-keyword placeholder="请输入产品线经理" :remote-method="getproductManager" style="width:100%">
                                <el-option
                                    v-for="item in productManagers"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
             </el-form-item>
            </el-col>
          </el-row>
          <h4>礼品清单</h4>
          <el-button icon="el-icon-plus" type="primary" size="small" v-if="editFlag!=undefined ? editFlag : true" @click="addGift">添加一行</el-button>
          <el-table
            :data="basicForm.giftInventoryEntityList"
            border
            max-height="500px"
            ref="giftList"
            class="giftApply"
            style="width: 100%;margin-bottom:30px;margin-top:10px"
          >
            <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
            <el-table-column prop="giftName" label="礼品名称" align="center" width="200">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">礼品名称</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.giftName'" :rules="giftRules.giftName" label-width="0" >
                <el-input size="small" clearable v-model="scope.row.giftName" placeholder="请输入礼品名称"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="giftNum" label="数量" align="center" width="140">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">数量</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.giftNum'" :rules="giftRules.giftNum" label-width="0" >
                <el-input size="small" oninput ="value=value.replace(/[^\d]/g,'')" clearable v-model="scope.row.giftNum" @change="handleEdit(scope.$index, scope.row)" placeholder="请输入数量"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="unitMeasurement" label="计量单位" align="center" width="160">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">计量单位</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.unitMeasurement'" :rules="giftRules.unitMeasurement" label-width="0" >
                <el-input size="small" clearable v-model="scope.row.unitMeasurement" placeholder="请输入计量单位"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="giftCompany" label="单价" align="center" width="140">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">单价</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.giftCompany'" :rules="giftRules.giftCompany" label-width="0" >
                <el-input size="small"  oninput ="value=value.replace(/[^0-9.]/g,'')" clearable v-model="scope.row.giftCompany" @change="handleEdit(scope.$index, scope.row)" placeholder="请输入单价"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额(元)" align="center" width="150">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">总金额(元)</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.totalAmount'" :rules="giftRules.totalAmount" label-width="0" >
                <el-input size="small" clearable v-model="scope.row.totalAmount" disabled placeholder="自动计算"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="customerName" label="客户名称" align="center" width="200">
              <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">客户名称</span>
              </template>
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.customerName'" :rules="giftRules.customerName" label-width="0" >
                <el-select
                  v-model="scope.row.customerName"
                  filterable
                  allow-create
                  clearable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchCustomerName(query,scope.row)"
                  placeholder="请输入客户名称"
                  :loading="customerNameloading"  
                >
                  <el-option
                    v-for="item in scope.row.customerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.customerName"
                  ></el-option>
                </el-select>
                  </el-form-item>
              </template>
            </el-table-column>
             <el-table-column prop="giftPurpose" label="礼品用途" align="center" width="240">
              <template slot-scope="scope">
                  <el-form-item :prop="'giftInventoryEntityList.' + scope.$index + '.giftPurpose'"  label-width="0" >
                <el-input size="small" clearable v-model="scope.row.giftPurpose" placeholder="请输入礼品用途"></el-input>
                  </el-form-item>
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
      <div  style="margin-top:10px;text-align:right;margin-bottom:50px">
        <el-button
          v-if="editFlag==undefined"
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="submit('ruleForm')"
        >保存并提交</el-button>
        <el-button
          v-if="editFlag == true "
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          @click="save('ruleForm')"
        >保 存</el-button>
        <el-button size="small" @click="close()" v-if="editFlag==undefined" icon="el-icon-circle-close">取 消</el-button>
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
  getUserName,
  remove,
  queryFormInfo,
  getCustomerName,
  flowList
} from "@/api/biz/crm/gift";
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
          { required: true, message: "请选择日期"}
        ],
        userId: [{ required: true, message: "请选择负责员工"}],
        bearPerson: [
          { required: true, message: "请输入承担人员" }
        ],
        giftMail: [
          { required: true, message: "请选择是否邮寄" }
        ],
        addresseePerson: [
          { required: true, message: "请输入收件人" }
        ],
        addresseePhone: [
          { required: true, message: "请输入联系电话" }
        ],
        mailingAddress: [
          { required: true, message: "请输入收件地址" }
        ],
        mailNumber:[
          {required: this.mailNumberIsAquire(), message: "请输入邮寄单号"}
        ],
        giftName: [
          { required: true, message: "请输入礼品名称"}
        ],
        giftNum: [
          { required: true, message: "请输入数量" }
        ],
        unitMeasurement: [
          { required: true, message: "请输入单位" }
        ],
        giftCompany: [
          { required: true, message: "请输入单价"}
        ],
        // totalAmount: [
        //   { required: true, message: "总金额必填", trigger: "blur" }
        // ],
        customerName: [
          { required: true, message: "请输入客户名称" }
        ],
        productLineId:[
          {required: false, message: "请输入产品线经理"}
        ]
      },
        }
    },
    watch:{
      'basicForm.giftCost':{
        handler(newValue,oldValue){
          if(newValue && newValue > 1200){
            this.giftRules.productLineId[0].required = true;
          }else{
            this.giftRules.productLineId[0].required = false;
          }
        }
      }
    },
    created(){
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
      mailNumberIsAquire(){
        if(this.nodeAlias =='4'){
          return true;
        }else{
          return false;
        }
      },
        add(){
          this.basicForm = {
           giftInventoryEntityList:[]
      };
    //   this.$refs.fileUpload.add();
      this.affixList = [];
      this.mainDataId = "";
      this.responsibleStaff = [];
      this.bearPerson = [];
      getFixedValue('CRM_LPSQ').then(res => {
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
        this.$set(this.basicForm, "giftMail", "0");
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
        this.bearPerson = [
          {
            realName: res.data.data.bearPersonName,
            id: res.data.data.bearPerson,
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
        this.productManagers = [
          {
            realName: res.data.data.productLine,
            id: res.data.data.productLineId,
          }
        ];
        res.data.data.giftInventoryEntityList.forEach(ele=>{
          ele.customerNameList = [
            {
              customerName:ele.customerName,
              id:ele.customerId
            }
          ]
        })
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
      //产品线经理
    getproductManager(query){
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.productManagers = res.data.data;
        });
      } else {
        this.productManagers = [];
      }
    },
        //保存
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
        customerName: "",
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
.star{
   color:#f56c6c;
   /* font-size: 14px; */
   margin-right:4px;
 }
 .giftApply .el-form-item{
    margin:0;
 }
</style>