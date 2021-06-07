<template>
  <el-container style="width:100%;height:100%">
    <h4 style="width:100%;text-align:center;margin:0">不合格品处理流程</h4>
    <el-header>
      <div
        style="width:100%;height:100%;display:flex;align-items:center;justify-content: space-between;"
      >
        <i
          class="el-icon-arrow-left"
          v-if="editFlag==undefined"
          style="font-size:20px;"
          @click="unqualityBack"
        ></i>
        <span
          style="color:#409EFF"
          v-if="basicForm.flowStatus =='0'"
          @click="unqualitySubmit('basicForm')"
        >提交流程</span>
      </div>
    </el-header>
    <el-main>
      <el-form
        ref="basicForm"
        class="sx_quality_testRecord"
        :disabled="editFlag !=undefined ? !editFlag : false"
        :rules="rules"
        :model="basicForm"
        size="small"
        label-width="130px"
        label-position="left"
        style="height:650px;padding:0 20px;margin-top:10px"
      >
        <van-tabs type="card" color="#409EFF">
          <van-tab title="基本信息">
            <el-form-item label="处理单号:" style="margin-top:10px">
              <el-input v-model="basicForm.unqualifiedCode" placeholder="自动带出" disabled></el-input>
            </el-form-item>
            <el-form-item label="检验单号:" prop="testListCode">
              <el-input v-model="basicForm.testListCode"  :disabled="basicForm.flowStatus == '0' ? false : true" ></el-input>
            </el-form-item>
            <el-form-item label="计划期:" prop="planDate">
              <el-date-picker v-model="basicForm.planDate" type="date" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="选择计划期"></el-date-picker>
            </el-form-item>
            <el-form-item label="合同号:" prop="contractCode">
              <!-- <el-select
                  v-model="basicForm.contractId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchContract"
                  placeholder="请输入合同号"
                  :loading="contractLoading"
                >
                  <el-option
                    v-for="item in contractList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  >
                  </el-option>
              </el-select>-->
              <el-input v-model="basicForm.contractCode" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入合同号"></el-input>
            </el-form-item>
            <el-form-item label="型号规格:" prop="produceModel">
              <el-input v-model="basicForm.produceModel" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入型号规格"></el-input>
            </el-form-item>
            <el-form-item label="检验日期:" prop="testDate">
              <el-date-picker v-model="basicForm.testDate" type="date" :disabled="basicForm.flowStatus == '0' ? false : true"   placeholder="自动带入"></el-date-picker>
            </el-form-item>
            <el-form-item label="检验员:" prop="testPersonId">
              <el-select
              :disabled="basicForm.flowStatus == '0' ? false : true"
                v-model="basicForm.testPersonId"
               filterable
                  remote
                  reserve-keyword
                  :remote-method="searchTestPerson"
                  placeholder="请输入搜索关键词"
                  :loading="testPersonLoading"
                >
                  <el-option
                    v-for="item in testPersonList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
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
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
            <el-form-item label="上传附件:" prop="affixList">
              <file-upload
              v-if="flag"
                ref="fileUpload"
                :data.sync="affixList"
                :mainId="mainDataId"
                :disabled="this.getDisabled()"
                modelName="CRM_QUALITY_BHG"
                fieldName="CRM_QUALITY_BHG#ANNEX"
              ></file-upload>
            </el-form-item>
          </van-tab>
          <van-tab title="分析">
            <div style="margin-top:10px">
              <el-form-item label="产品名称:" prop="produceName">
                <el-input v-model="basicForm.produceName" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入产品名称"></el-input>
              </el-form-item>
              <el-form-item label="发生场所:" prop="happenAddress">
                <el-select v-model="basicForm.happenAddress" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请选择">
                  <el-option
                    v-for="item in happenPlace"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发现日期:" prop="happenDate">
                <el-date-picker
                :disabled="basicForm.flowStatus == '0' ? false : true"
                  v-model="basicForm.happenDate"
                  type="datetime"
                  placeholder="请选择发现日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="总数量:" prop="totalNumber">
                <el-input
                :disabled="basicForm.flowStatus == '0' ? false : true"
                  v-model="basicForm.totalNumber"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入总数量"
                ></el-input>
              </el-form-item>
              <el-form-item label="发现数量:" prop="happenNumber">
                <el-input
                :disabled="basicForm.flowStatus == '0' ? false : true"
                  v-model="basicForm.happenNumber"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入发现数量"
                ></el-input>
              </el-form-item>
              <el-form-item label="直接责任人:">
                <el-select
                :disabled="basicForm.flowStatus == '0' ? false : true"
                  v-model="basicForm.personUserId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchPerson"
                  placeholder="请输入搜索关键词"
                  :loading="chargePersonloading"
                >
                  <el-option
                    v-for="item in chargePersonList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班组长:">
                <el-select
                :disabled="basicForm.flowStatus == '0' ? false : true"
                  v-model="basicForm.teamUserId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchForeman"
                  placeholder="请输入搜索关键词"
                  :loading="foremanLoading"
                >
                  <el-option
                    v-for="item in foremanList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="责任单位:" prop="personUnit">
                <el-input v-model="basicForm.personUnit" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入责任单位"></el-input>
              </el-form-item>
              <el-form-item label="责任单位负责人:" prop="personUnitLeadId">
                <el-select
                :disabled="basicForm.flowStatus == '0' ? false : true"
                  v-model="basicForm.personUnitLeadId"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchChargePerson"
                  placeholder="请输入搜索关键词"
                  :loading="chargePartLoading"
                >
                  <el-option
                    v-for="item in chargePartList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="次数(一周):">
                <el-select v-model="basicForm.aa" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
                </el-select>
                <el-input
                  v-model="basicForm.numbers"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入次数"
                ></el-input>
              </el-form-item> -->
              <el-form-item label="不合格类别:">
                <el-select v-model="basicForm.unqualifiedType" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请选择不合格类别">
                  <el-option
                    v-for="item in unqualityCate"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="是否入库:">
                <el-select v-model="basicForm.inStorage" placeholder="请选择是否入库">
                  <el-option
                    v-for="item in inStorageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item label="不合格内容描述:">
              <el-input
              :disabled="basicForm.flowStatus == '0' ? false : true"
                style="margin-top:5px"
                type="textarea"
                rows="5"
                v-model="basicForm.unqualifiedRemark"
                placeholder="不合格内容描述(不符合项目实际状态描述、不符合标准描述)"
              ></el-input>
              </el-form-item>
              <el-form-item label="责任部门原因:" prop="causeAnalysis">
              <el-input
                style="margin-top:5px"
                type="textarea"
                rows="5"
                v-model="basicForm.causeAnalysis"
                placeholder="责任部门：原因分析"
              ></el-input>
              </el-form-item>
              <el-form-item label="责任部门对策:" prop="countermeasure">
              <el-input
                style="margin-top:5px;margin-bottom:20px"
                type="textarea"
                rows="5"
                v-model="basicForm.countermeasure"
                placeholder="责任部门：对策制定"
              ></el-input>
              </el-form-item>
            </div>
          </van-tab>
          <van-tab title="处理意见">
            <div style="margin-top:10px">
              <el-form-item label="责任单位:">
                <el-select v-model="basicForm.zrDept" :disabled="nodeAlias!=1" placeholder="请选择">
                  <el-option
                    v-for="item in decisionOption"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="依据:">
                <el-input v-model="basicForm.zrDeptBasis" :disabled="nodeAlias!=1" placeholder="请输入依据"></el-input>
              </el-form-item>
              <el-form-item label="技术部门:">
                <el-select v-model="basicForm.jsDept" :disabled="nodeAlias!=3" placeholder="请选择">
                  <el-option
                    v-for="item in decisionOption"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="依据:">
                <el-input v-model="basicForm.jsDeptBasis" :disabled="nodeAlias!=3" placeholder="请输入依据"></el-input>
              </el-form-item>
              <el-form-item label="工艺部门:">
                <el-select v-model="basicForm.gyDept" :disabled="nodeAlias!=6" placeholder="请选择">
                  <el-option
                    v-for="item in decisionOption"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="依据:">
                <el-input v-model="basicForm.gyDeptBasis" :disabled="nodeAlias!=6" placeholder="请输入依据"></el-input>
              </el-form-item>
              <el-form-item label="质量部门:">
                <el-select v-model="basicForm.qualityDept" :disabled="nodeAlias!=4" placeholder="请选择">
                  <el-option
                    v-for="item in decisionOption"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="依据:">
                <el-input v-model="basicForm.qualityDeptBasis" :disabled="nodeAlias!=4" placeholder="请输入依据"></el-input>
              </el-form-item>
              <el-form-item label="最终决策(品保):">
                <el-select v-model="basicForm.jcDept" :disabled="nodeAlias!=5" placeholder="请选择">
                  <el-option
                    v-for="item in decisionOption"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="依据:">
                <el-input v-model="basicForm.jcDeptBasis" :disabled="nodeAlias!=5" placeholder="请输入依据"></el-input>
              </el-form-item>
              <el-form-item label="技术负责人:">
                <el-select
                  v-model="basicForm.technologyUser"
                  filterable
                  remote
                  
                  reserve-keyword
                  :disabled="nodeAlias!=2"
                  :remote-method="searchCounterSign"
                  placeholder="请输入关键字搜索"
                  :loading="countersignLoading"
                >
                  <el-option
                    v-for="item in countersignList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="工艺负责人:">
                <el-select
                  v-model="basicForm.craftUser"
                  filterable
                  remote
                  
                  reserve-keyword
                  :disabled="nodeAlias!=2"
                  :remote-method="searchCraft"
                  placeholder="请输入关键字搜索"
                  :loading="craftLoading"
                >
                  <el-option
                    v-for="item in craftList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预计损失金额(元):">
                <el-input
                  v-model="basicForm.lossAmount"
                  :disabled="nodeAlias!=6"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  placeholder="请输入预计损失金额"
                ></el-input>
              </el-form-item>
            </div>
          </van-tab>
        </van-tabs>
        <el-button
          v-if="editFlag==true"
          style="width:100%;margin-bottom:10px"
          type="primary"
          @click="save('basicForm')"
        >保存</el-button>
      </el-form>
    </el-main>
    <van-overlay :show="show" :custom-style="{background: 'rgb(0, 0, 0, 0.8)',}">
      <div class="wrapper" @click.stop>
        <van-loading size="24px" color="#409eff">
          <span style="color:#409eff">提交流程中,请稍后···</span>
        </van-loading>
      </div>
    </van-overlay>
  </el-container>
</template>
<script>
import { mapState } from "vuex";
import {
  getData,
  getTestData,
  submit,
  getUserName
} from "@/api/quality/unquality";
import { getFixedValue } from "@/api/quality/test_m";
import fileUpload from "@/components/fileUpload";
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
      flag:false,
      show: false,
      basicForm: {},
      createInfo: [],
      flowStatus: [],
      affixList: [],
      mainDataId: "",
      contractLoading: false,
      contractList: [],
      happenPlace: [],
      unqualityCate: [],
      decisionOption: [],
      chargePersonloading: false,
      chargePersonList: [],
      foremanLoading: false,
      foremanList: [],
      chargePartLoading:false,
      chargePartList:[],
      countersignLoading: false,
      countersignList: [],
      craftLoading:false,
      craftList:[],
      testPersonLoading:false,
      testPersonList:[],
      // inStorageList:[{
      //   label:"是",
      //   value:"1"
      // },{
      //   label:"否",
      //   value:"0"
      // }
      // ]
      rules:{
        causeAnalysis: [{ required: this.nodeAlias == 1 ? true :false , message: "请输入责任部门原因" }],
        countermeasure:[{ required: this.nodeAlias == 1 ? true :false , message: "请输入责任部门对策" }],
        testListCode:[{required:true,message:'请输入检验单号'}],
        planDate:[{required:true,message:'请选择计划期'}],
        contractCode:[{required:true,message:'请输入合同号'}],
        produceModel:[{required:true,message:'请输入型号规格'}],
        testDate:[{required:true,message:'请选择检验日期'}],
        testPersonId:[{required:true,message:'请输入关键词搜索'}],
        produceName:[{required:true,message:'请输入产品名称'}],
        happenAddress:[{required:true,message:'请输入发生场所'}],
        happenDate:[{required:true,message:'请选择发现日期'}],
        totalNumber:[{required:true,message:'请输入总数量'}],
        happenNumber:[{required:true,message:'请输入发现数量'}],
        personUnit:[{required:true,message:'请输入责任单位'}],
        personUnitLeadId:[{required:true,message:'请输入关键词搜索'}]
      }
    };
  },
  computed: {
    ...mapState("quality", ["unpath", "query"]),
  },
  created() {
    console.log(this.$route)
    this.getDicts("crm_fscs").then(res => {
      this.happenPlace = res.data.data;
    });
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
    this.getDicts("crm_unqualified").then(res => {
      this.unqualityCate = res.data.data;
    });
    this.getDicts("crm_quality_pd").then(res => {
      this.decisionOption = res.data.data;
    });
    if (this.$route.query.testId) {
      this.testDetail(this.$route.query.testId);
    } else if (this.$route.query.id) {
      this.init(this.$route.query.id);
    } else if (this.detailId) {
      this.init(this.detailId);
    } else {
      this.addDefault();
    }
  },
  mounted(){
     this.$nextTick(()=>{
      this.getDisabled()
     })
  },
  methods: {
    getDisabled(){
        if(this.basicForm.flowStatus =='0'){
               return false;
            }else{
              return true;
            }
    },
    addDefault() {
      getFixedValue("CRM_QUALITY_JYD").then(res => {
        this.createInfo = [
          {
            label: res.data.data.CREATE_USER_NAME,
            value: res.data.data.CREATE_USER
          }
        ];
        this.basicForm.createUser = res.data.data.CREATE_USER;
        this.basicForm.createTime = res.data.data.CREATE_TIME;
        this.basicForm.flowStatus = res.data.data.FLOW_STATUS;
        this.affixList=[];
        this.flag=true;
      });
    },
    testDetail(id) {
      getTestData(id).then(res => {
        this.$set(this.basicForm,'testListCode',res.data.data.testListCode);
        this.$set(this.basicForm,'planDate',res.data.data.planDate);
        this.$set(this.basicForm,'contractCode',res.data.data.contractCode);
        this.$set(this.basicForm,'produceModel',res.data.data.produceModel);
        this.$set(this.basicForm,'produceName',res.data.data.produceName);
        this.addDefault()
      });
    },
    init(id) {
      getData(id).then(res => {
        this.createInfo = [
          {
            label: res.data.data.createUserName,
            value: res.data.data.createUser
          }
        ];
        if (res.data.data.componentCode) {
          this.inspectionList = [
            {
              componentCode: res.data.data.componentCode,
              componentName: res.data.data.componentName
            }
          ];
        }
        this.inspectionOption = [
          {
            label: res.data.data.componentName,
            value: res.data.data.componentCode
          }
        ];
        this.chargePersonList = [
          {
            id: res.data.data.personUserId,
            realName: res.data.data.personUserName
          }
        ];
        this.foremanList = [
          {
            id: res.data.data.teamUserId,
            realName: res.data.data.teamUserName
          }
        ];
        this.testPersonList = [
          {
            id: res.data.data.testPersonId,
            realName: res.data.data.testPersonName
          }
        ];
        this.chargePartList = [
          {
            id: res.data.data.personUnitLeadId,
            realName: res.data.data.personUnitLeadName
          }
        ]
        this.countersignList = [{
          id:res.data.data.technologyUser,
          realName:res.data.data.technologyUserName
        }]
        this.craftList = [{
          id:res.data.data.craftUser,
          realName:res.data.data.craftUserName
        }]
        this.basicForm = res.data.data;
        this.flag =true;  
        this.$nextTick(()=>{
          this.mainDataId = res.data.data.id;
            this.$refs.fileUpload.init(this.mainDataId);
        })
      });
    },
    searchContract(query) {
      if (query !== "") {
        this.contractLoading = true;
        getContractCode(query).then(res => {
          this.contractList = res.data.data;
          this.contractLoading = false;
        });
      } else {
        this.contractList = [];
      }
    },
    searchTestPerson(query){
       if (query !== "") {
        this.testPersonLoading = true;
        getUserName(query).then(res => {
          this.testPersonList = res.data.data;
          this.testPersonLoading = false;
        });
      } else {
        this.testPersonList = [];
      }
    },
    searchPerson(query) {
      if (query !== "") {
        this.chargePersonloading = true;
        getUserName(query).then(res => {
          this.chargePersonList = res.data.data;
          this.chargePersonloading = false;
        });
      } else {
        this.chargePersonList = [];
      }
    },
    searchForeman(query) {
      if (query !== "") {
        this.foremanLoading = true;
        getUserName(query).then(res => {
          this.foremanList = res.data.data;
          this.foremanLoading = false;
        });
      } else {
        this.foremanList = [];
      }
    },
    searchChargePerson(query){
       if (query !== "") {
        this.chargePartLoading = true;
        getUserName(query).then(res => {
          this.chargePartList = res.data.data;
          this.chargePartLoading = false;
        });
      } else {
        this.chargePartList = [];
      }
    },
    searchCounterSign(query) {
      if (query !== "") {
        this.countersignLoading = true;
        getUserName(query).then(res => {
          this.countersignList = res.data.data;
          this.countersignLoading = false;
        });
      } else {
        this.countersignList = [];
      }
    },
    searchCraft(query){
       if (query !== "") {
        this.craftLoading = true;
        getUserName(query).then(res => {
          this.craftList = res.data.data;
          this.craftLoading = false;
        });
      } else {
        this.craftList = [];
      }
    },
    unqualityBack() {
      if (this.query.id) {
        this.$router.push({
          path: this.unpath,
          query: { id: this.query.id }
        });
      } else {
        this.$router.push({
          path: this.unpath
        });
      }
    },
    unqualitySubmit(formName) {
      this.$refs[formName].validate(valid => {
        if(valid){
           this.basicForm.affixList = this.affixList;
           this.show = true;
      submit(this.basicForm).then(res => {
        if (res.data.code === 200) {
          modelByName("CRM_QUALITY_BHG").then(res1 => {
            let obj = {
              flowKey: "CRM_QUALITY_JYD_DART",
              formType: "S",
              modelId: res1.data.data.id,
              dataId: res.data.data.id,
              variables: { functionPath: this.$route.fullPath }
            };
            startFlow(obj)
              .then(res2 => {
                if (res2.data.code == 200) {
                  this.$message.success(res2.data.msg);
                  this.show = false;
                  this.unqualityBack();
                }
              })
              .catch(error => {
                this.show = false;
              });
          });
        }
      });
        }
      })
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.basicForm.affixList = this.affixList;
          submit(this.basicForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.init(res.data.data.id);
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
/* .sx_quality_testRecord .el-form-item{
    margin-bottom:5px;
} */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  color: #fff;
}
</style>