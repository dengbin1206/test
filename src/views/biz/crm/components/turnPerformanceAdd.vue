<template>
  <basic-container>
    <el-form
      ref="performanceForm"
      :rules="performanceRules"
      :model="performanceForm"
      label-width="160px"
      size="small"
      :disabled="editFlag !=undefined ? !editFlag : false"
    >
    <div v-if="performanceForm.flowStatus == '2'">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-s-fold"
        v-if="editFlag!=undefined ? editFlag : true"
        @click="performanceReturnDialog"
      >归还</el-button>
    </div>
      <h4>转履约保证金信息</h4>
      <el-row :gutter="20">
        <el-col :span="12">
         
         
          <el-form-item label="项目报登号:" prop="projectCode">
             <el-input v-model="performanceForm.projectCode" placeholder="请输入项目报登号" disabled clearable></el-input>
            <!-- <el-select
              v-model="performanceForm.projectCode"
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
            </el-select> -->
          </el-form-item>
          <el-form-item label="投标保证金单号:" prop="bidBondCode">
            <el-input v-model="performanceForm.bidBondCode" placeholder="自动带出" disabled></el-input>
          </el-form-item>
          <el-form-item label="纸质合同号:" prop="contractCode">
            <el-input v-model="performanceForm.contractCode" placeholder="请输入纸质合同号" clearable></el-input>
            <!-- <el-select
              v-model="performanceForm.contractCodeId"
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
            </el-select> -->
          </el-form-item>
          <el-form-item label="保证金金额(元):">
            <el-input v-model="performanceForm.bidBondAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="未归还投标保证金(元):">
            <el-input v-model="performanceForm.bondNotReturned" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="合同总金额(元):">
            <el-input v-model="performanceForm.contractAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="转履约金额(元):" prop="performanceAmount">
            <el-input v-model="performanceForm.performanceAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入转履约金额"></el-input>
          </el-form-item>
           <el-form-item label="计划归还日期:" prop="plannedReturnDate">
            <el-date-picker
              v-model="performanceForm.plannedReturnDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="特殊说明:">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入特殊说明"
              v-model="performanceForm.specialInstructions"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
         
         
          <el-form-item label="单号:">
            <el-input v-model="performanceForm.performanceBondCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="招标单位:">
             <el-input v-model="performanceForm.biddingUnit" placeholder="请输入招标单位" clearable></el-input>
            <!-- <el-select
              v-model="performanceForm.biddingUnitId"
              filterable
              remote
              size="small"
              reserve-keyword
              :remote-method="(query)=>searchNyCustomerName(query)"
              placeholder="项目报登带出可修改"
              :loading="nycustomerNameloading"
            >
              <el-option
                v-for="item in nycustomerNameList"
                :key="item.id"
                :label="item.customerName"
                :value="item.id"
              ></el-option>
            </el-select> -->
            <!-- <el-input v-model="performanceForm.biddingUnit" placeholder="自动带出" disabled></el-input> -->
          </el-form-item>
          <el-form-item label="汇入单位或户名:" prop="remittanceUnit">
            <el-input v-model="performanceForm.remittanceUnit" placeholder="自动带出" ></el-input>
          </el-form-item>
          <el-form-item label="币种:">
            <el-select v-model="performanceForm.currency" size="small" placeholder="请选择币种">
              <el-option
                v-for="item in currency"
                :key="item.dictKey ? item.dictKey : item.value"
                :label="item.dictValue? item.dictValue : item.label"
                :value="item.dictKey ? item.dictKey : item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实际归还金额(元):" disabled>
            <el-input v-model="performanceForm.actualReturnAmount" placeholder="自动带出" disabled></el-input>
          </el-form-item>
           <el-form-item label="实际归还日期:">
            <el-date-picker
              v-model="performanceForm.actualReturnDate"
              type="date"
              placeholder="自动带出"
              disabled
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="负责员工:" prop="userId">
            <el-select
              v-model="performanceForm.userId"
              filterable
              remote
              reserve-keyword
              :remote-method="performanceSelectPerson"
              placeholder="请输入负责员工"
              :loading="performanceUserLoading"
              @change="getPerformanceDeptId"
            >
              <el-option
                v-for="item in performanceUserList"
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
              v-model="performanceForm.deptId"
              filterable
              remote
              disabled
              reserve-keyword
              placeholder="自动带入"
            >
              <el-option
                v-for="item in performanceDeptInfo"
                :key="item.CREATE_DEPT"
                :label="item.CREATE_DEPT_NAME"
                :value="item.CREATE_DEPT"
              ></el-option>
            </el-select>
            <!-- <el-input v-model="performanceForm.deptId" placeholder="选择员工自动带入" disabled></el-input> -->
          </el-form-item>
           <el-form-item label="创建人:">
            <el-select
              v-model="performanceForm.createUser"
              filterable
              remote
              disabled
              reserve-keyword
              placeholder="自动带入"
            >
              <el-option
                v-for="item in performanceCreateInfo"
                :key="item.CREATE_USER"
                :label="item.CREATE_USER_NAME"
                :value="item.CREATE_USER"
              ></el-option>
            </el-select>
            <!-- <el-input v-model="performanceForm.createUser" placeholder="自动带出" disabled></el-input> -->
          </el-form-item>
           <el-form-item label="创建时间:">
            <el-input v-model="performanceForm.createTime" placeholder="自动带出" disabled></el-input>
          </el-form-item>
          <el-form-item label="审批状态:">
            <el-select
              v-model="performanceForm.flowStatus"
              size="small"
              disabled
              placeholder="自动带出"
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
            <el-date-picker
              v-model="performanceForm.flowCompletedTime"
              type="datetime"
              placeholder="自动带出"
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="相关文件上传:" prop="affixList">
        <file-upload
          ref="fileUpload"
          :data.sync="performanceAffixList"
          :mainId="performanceMainDataId"
           :disabled="editFlag !=undefined ? !editFlag : false"
          modelName="CRM_ZLYBZJ"
          fieldName="CRM_ZLYBZJ#ANNEX"
        ></file-upload>
      </el-form-item>
    </el-form>
    <div  style="margin-top:10px;text-align:right;margin-bottom:30px" >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-document"
        :loading="performanceBtnLoading"
        v-if="editFlag==undefined"
        @click="performanceSaveAndSubmit('performanceForm')"
      >保存并提交</el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-document"
         v-if="editFlag==true"
        :loading="performanceBtnLoading"
        @click="performanceSave('performanceForm')"
      >保 存</el-button>
      <el-button size="small" v-if="editFlag==undefined" @click="close()" icon="el-icon-circle-close">取 消</el-button>
    </div>
    <el-dialog
      title="归还"
      :visible.sync="performanceReturnDialogVisible"
      width="30%"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="performanceReturnForm"
        :model="performanceReturnForm"
        label-width="140px"
        size="small"
      >
        <el-form-item label="累计实际归还金额:">
          <el-input v-model="performanceReturnForm.actualReturnAmount" placeholder="请输入累计实际归还金额"></el-input>
        </el-form-item>
        <el-form-item label="实际归还日期:">
          <el-date-picker
            v-model="performanceReturnForm.actualReturnDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          @click="performanceReturnSave"
        >确 定</el-button>
        <el-button
          size="small"
          @click="performanceReturnDialogVisible = false"
          icon="el-icon-circle-close"
        >取 消</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import fileUpload from "@/components/fileUpload";
import {
  getDetail,
  getProjectNumber,
  getCustomerName,
  getContractCode,
  performanceSubmit,
  performanceReturn,
  performanceReturnSubmit,
  getUserName
} from "@/api/biz/crm/turnPerformance";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
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
  data() {
    return {
      performanceForm: {},
      performanceMainDataId: "",
      currency: [],
      flowStatus: [],
      performanceCreateInfo: [],
      contractCodeLoading: false,
      contractCodeList: [],
      performanceUserLoading: false,
      performanceUserList: [],
      performanceDeptInfo: [],
      nycustomerNameloading: false,
      nycustomerNameList: [],
      performanceNewspaperLoading: false,
      performanceFormNewspaper: [],
      performanceAffixList: [],
      performanceReturnDialogVisible: false,
      performanceReturnForm: {},
      performanceBtnLoading: false,
      performanceRules: {
        projectCode: [
          { required: true, message: "请输入项目报登号"}
        ],
        bidBondCode: [
          { required: true, message: "请输入投标保证金单号"}
        ],
        performanceAmount: [
          { required: true,message: "请输入转履约金额"}
        ],
        plannedReturnDate: [
          { required: true, message: "请选择计划归还日期" }
        ],
        remittanceUnit: [
          { required: true, message: "请输入汇入单位" }
        ],
        userId: [{ required: true, message: "请输入负责员工" }]
      }
    };
  },
  created() {
    this.getDicts("bill-coin").then(res => {
      this.currency = res.data.data;
    });
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
    if (this.detailId) {
      this.detail(this.detailId);
    }
  },
  methods: {
    detail(id) {
      getDetail(id).then(res => {
        this.performanceUserList = [
          {
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account: res.data.data.account,
            deptName: res.data.data.deptName
          }
        ];
        this.performanceDeptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
          }
        ];
        this.performanceCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
        this.contractCodeList = [
          {
            paperContractNo: res.data.data.contractCode,
            id: res.data.data.contractCodeId
          }
        ];
        this.nycustomerNameList = [
          {
              customerName:res.data.data.biddingUnit,
              id:res.data.data.biddingUnitId
          }
        ]
        this.performanceForm = res.data.data;
        this.performanceMainDataId = res.data.data.id;
        this.$refs.fileUpload.init(this.performanceMainDataId);
      });
    },
    close() {
      this.$emit("closeDialog");
    },
    closeValidate() {
      this.$refs.performanceForm.resetFields();
    },
    //选择转履约保证金负责员工
    performanceSelectPerson(query) {
      if (query !== "") {
        this.performanceUserLoading = true;
        getUserName(query).then(res => {
          this.performanceUserList = res.data.data;
          this.performanceUserLoading = false;
        });
      } else {
        this.performanceUserList = [];
      }
    },
    //获取转履约保证金部门
    getPerformanceDeptId(value) {
      console.log(value);
      this.performanceUserList.forEach(ele => {
        if (ele.id == value) {
          this.performanceDeptInfo = [
            {
              CREATE_DEPT_NAME: ele.deptName,
              CREATE_DEPT: ele.deptId
            }
          ];
          this.performanceForm.deptId = ele.deptId;
        }
      });
    },
    //搜索招标单位
    searchNyCustomerName(query) {
      if (query !== "") {
        this.nycustomerNameloading = true;
        getCustomerName(query).then(res => {
          this.nycustomerNameList = res.data.data;
          this.nycustomerNameloading = false;
        });
      } else {
        this.nycustomerNameList = [];
      }
    },
    //获取履约保证金项目报登号
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
    //获取履约保证金报登号下的信息
    getPerfonmanceProjectInfo(value) {
      this.performanceFormNewspaper.forEach(ele => {
        if (ele.projectReportNum == value) {
          // this.basicForm.biddingUnit = ele.clientName;
          // this.basicForm.projectName = ele.projectName
          this.performanceUserList = [ele.chargePerson];
          this.$set(this.performanceForm, "userId", ele.chargeStaff);
          this.performanceDeptInfo = [
            {
              CREATE_DEPT_NAME: ele.departmentName,
              CREATE_DEPT: ele.departmentId
            }
          ];
          this.$set(this.performanceForm, "deptId", ele.departmentId);
          this.contractCodeList = [
            {
              paperContractNo: ele.paperContractNo,
              id: ele.contractId
            }
          ];
          this.$set(
            this.performanceForm,
            "contractCodeId",
            ele.paperContractNo
          );
          this.nycustomerNameList = [ele.clientInfo];
          this.$set(this.performanceForm, "biddingUnitId", ele.clientId);
          //   this.$set(this.basicForm, "projectName", ele.projectName);
        }
      });
    },
    // 搜索纸质合同号
    searchContractCode(query) {
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
    //转履约保存
    performanceSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   this.performanceForm.createUser = this.performanceData.createUser;
          //   this.performanceForm.deptId = this.performanceSelectDeptId;
          this.performanceForm.affixList = this.performanceAffixList;
          this.performanceBtnLoading = true;
          performanceSubmit(this.performanceForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success("操作成功");
              this.performance = false;
              this.performanceBtnLoading = false;
            }
          });
        }
      });
    },
    //转履约保存并提交
    performanceSaveAndSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.performanceForm.affixList = this.bondAffixList;
          this.performanceBtnLoading = true;
          performanceSubmit(this.performanceForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_ZLYBZJ").then(res1 => {
                let obj = {
                  flowKey: "CRM_ZBFW_DART",
                  formType: "S",
                  modelId: res1.data.data.id,
                  dataId: res.data.data.id,
                  variables: { functionPath: this.$route.fullPath }
                };
                startFlow(obj)
                  .then(res2 => {
                    if (res2.data.code == 200) {
                      this.$message.success(res2.data.msg);
                      this.performanceBtnLoading = false;
                      this.performance = false;
                    }
                  })
                  .catch(error => {
                    this.performanceBtnLoading = false;
                  });
              });
            }
          });
        }
      });
    },
    // 履约归还
    performanceReturnDialog() {
      performanceReturn(this.performanceMainDataId).then(res => {
        this.performanceReturnForm = res.data.data;
        this.performanceReturnDialogVisible = true;
      });
    },
    //履约归还保存
    performanceReturnSave() {
      performanceReturnSubmit(this.performanceReturnForm).then(res => {
        this.performanceForm.actualReturnAmount =
          res.data.data.actualReturnAmount;
        this.performanceForm.actualReturnDate = res.data.data.actualReturnDate;
        this.performanceReturnDialogVisible = false;
      });
    }
  }
};
</script>

<style scoped>
</style>