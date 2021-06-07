<template>
   <basic-container>
       <div class="dialog-body">
        <el-form :model="basicForm" :rules="rules" ref="ruleForm" label-width="140px" size="small" :disabled="editFlag !=undefined ? !editFlag : false">
          <h3>办理银行保函</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目报登号:" prop="projectCode">
                <el-select
                  v-model="basicForm.projectCode"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入项目报登号"
                  :remote-method="getPerformanceProjectNewspaper"
                  @change="getPerfonmanceProjectInfo"
                  :loading="performanceNewspaperLoading"
                >
                  <el-option
                    v-for="item in performanceFormNewspaper"
                    :key="item.projectReportNum"
                    :label="item.projectReportNum"
                    :value="item.projectReportNum"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="纸质合同号:" prop="contractCode">
                <el-select
                  v-model="basicForm.contractCode"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchPaperContract"
                  placeholder="项目报登带出,可修改"
                  :loading="paperContractLoading"
                >
                  <el-option
                    v-for="item in paperContract"
                    :key="item.id"
                    :label="item.paperContractNo"
                    :value="item.paperContractNo"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合同总金额(元):">
                <el-input v-model="basicForm.contractTotalAmount" placeholder="项目报登带出" disabled></el-input>
              </el-form-item>
              <el-form-item label="保函性质:" prop="guaranteeQuality">
                <el-select v-model="basicForm.guaranteeQuality">
                  <el-option
                    v-for="item in guaranteeNature"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="受益方:" prop="customerId">
                <el-select
                  v-model="basicForm.customerId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchCustomerName(query)"
                  placeholder="项目报登带出"
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
              <el-form-item label="保函金额(元):" prop="guaranteeAmount">
                <el-input v-model="basicForm.guaranteeAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入保函金额"></el-input>
              </el-form-item>
              <el-form-item label="保函有效截止日期:" prop="guaranteeDeadlineDate">
                <el-date-picker
                  v-model="basicForm.guaranteeDeadlineDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单号:">
                <el-input v-model="basicForm.guaranteeNumber" disabled></el-input>
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
              <el-form-item label="申请员工:" prop="userId">
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="特殊说明:">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="请输入特殊说明"
                  v-model="basicForm.specialInstructions"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span="12">
          <el-form-item label="上传保函格式内容:" ref="menuFile"  prop="affixList" class="bank_fileUpload">
            <file-upload
            ref="fileUpload"
              :data.sync="affixList"
              :mainId="mainDataId"
              @clearValidate="clearValidate"
              :disabled="editFlag !=undefined ? !editFlag : false"
              modelName="CRM_YHBH"
              fieldName="CRM_YHBH#ANNEX"
            ></file-upload>
          </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="margin-top:10px;text-align:right;margin-bottom:50px">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          :loading="btnLoading"
          v-if="editFlag==undefined"
          @click="submit('ruleForm')"
        >保存并提交</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="editFlag == true "
          icon="el-icon-document"
          :loading="btnLoading"
          @click="save('ruleForm')"
        >保 存</el-button>
        <el-button size="small" v-if="editFlag==undefined" @click="close()" icon="el-icon-circle-close">取 消</el-button>
      </div>
   </basic-container>
</template>

<script>
import {
  submit,
  getList,
  getDetail,
  getFixedValue,
  getUserName,
  remove,
  getCustomerName,
  getProjectNumber,
  getPaperContract
} from "@/api/biz/crm/guarantee";
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
  },
  data(){
    var fileValidate = (rule, value, callback) => {
      if (this.affixList.length > 0) {
        callback();
      } else {
        callback(new Error('请上传附件'));
      }
    };
      return {
           btnLoading: false,
      guaranteeNature: [], // 保函性质
      flowStatus: [], //审批状态
      affixList: [], //附件
      mainDataId: "", //主模型Id
      responsibleStaff: [], //负责员工
      userLoading: false, //负责员工loading
      performanceFormNewspaper: [], // 项目报登号option
      performanceNewspaperLoading: false, // 项目报登loading
      paperContractLoading: false, //  纸质合同号loading
      paperContract: [], // 纸质合同号
      customerNameloading: false, // 客户名称loading
      customerNameList: [], // 客户名称
       basicForm: {},
       deptInfo:[], // 办事处信息
      createInfo:[] , // 创建人信息
       rules: {
        projectCode: [
          { required: true, message: "请输入项目报登号"}
        ],
        contractCode: [
          { required: true, message: "请输入纸质合同号" }
        ],
        guaranteeQuality: [
          { required: true, message: "请选择保函性质" }
        ],
        customerName: [
          { required: true, message: "请输入受益方"}
        ],
        guaranteeAmount: [
          { required: true, message: "请输入保函金额" }
        ],
        guaranteeDeadlineDate: [
          { required: true, message: "请输入保函有效截止日期" }
        ],
        affixList:[
          { required: true, validator: fileValidate}
        ]
      },
      }
  },
  created(){
    this.getDicts("crm_guarantee_quality").then(res => {
      this.guaranteeNature = res.data.data;
    });
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    //   this.searchOption.rows[2][1].list = res.data.data;
    });
    if(this.detailId){
        this.detail(this.detailId)
    }
  },
  methods:{
    clearValidate(){
      this.$refs.menuFile.clearValidate();
    },
      add(){
      this.basicForm = {};
    //   this.$refs.fileUpload.add();
      this.affixList = [];
      this.mainDataId = "";
    //   this.$set(this,"mainDataId","")
      this.responsibleStaff = [];
      this.performanceFormNewspaper = [];
      this.paperContract = [];
      this.customerNameList = []; 
      getFixedValue("CRM_YHBH").then(res => {
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
    //获取项目报登号
    getPerformanceProjectNewspaper(query) {
      if (query !== "") {
        this.performanceNewspaperLoading = true;
        getProjectNumber(query).then(res => {
          this.performanceFormNewspaper = res.data.data;
          this.performanceNewspaperLoading = false;
        });
      } else {
        this.performanceFormNewspaper = [];
      }
    },
    //获取报登号下的信息
    getPerfonmanceProjectInfo(value) {
      this.performanceFormNewspaper.forEach(ele => {
        if (ele.projectReportNum == value) {
          this.paperContract = [
            {
              id: ele.id,
              paperContractNo: ele.paperContractNo
            }
          ];
          this.$set(this.basicForm, "contractCode", ele.paperContractNo);
          this.$set(this.basicForm, "contractTotalAmount", ele.totalAmount);
          this.customerNameList = [
            {
              customerName: ele.clientName,
              id: ele.clientId
            }
          ];
          this.$set(this.basicForm, "customerId", ele.clientId);
        }
      });
    },
    //搜索纸质合同号
    searchPaperContract(query) {
      if (query !== "") {
        this.paperContractLoading = true;
        getPaperContract(query, this.basicForm.projectCode).then(res => {
          this.paperContract = res.data.data;
          this.paperContractLoading = false;
        });
      } else {
        this.paperContract = [];
      }
    },
    //搜索客户名称
    searchCustomerName(query) {
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
        this.basicForm = res.data.data;
        // this.basicForm.deptId = res.data.data.deptId;
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
          this.basicForm.affixList = this.affixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_YHBH").then(res1 => {
                let obj = {
                  flowKey: "CRM_YHBH_DART",
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
  }
}
</script>

<style scoped>

</style>