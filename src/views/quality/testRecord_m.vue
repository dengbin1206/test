<template>
  <el-container style="width:100%;height:100%">
    <h4 style="width:100%;text-align:center;margin:0">检验单</h4>
    <el-header>
      <div
        style="width:100%;height:100%;display:flex;align-items:center;justify-content: space-between;"
      >
        <i
          class="el-icon-arrow-left"
          style="font-size:20px;"
          v-if="editFlag==undefined"
          @click="testRecordBack"
        ></i>
        <span
          style="color:#409EFF"
          v-if="basicForm.flowStatus =='0'"
          @click="submitFlow('basicForm')"
        >提交流程</span>
      </div>
    </el-header>
    <el-main>
      <el-form
        ref="basicForm"
        class="sx_quality_testRecord"
        :model="basicForm"
        size="small"
        label-width="90px"
        :rules="rules"
        label-position="left"
        style="height:650px;padding:0 20px;margin-top:10px"
      >
        <van-tabs type="card" color="#409EFF">
          <van-tab title="基本信息">
            <el-form-item label="检验单号:" style="margin-top:10px">
              <el-input v-model="basicForm.testListCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="销售订单号:">
              <!-- <el-select
                v-model="basicForm.saleCode"
                filterable
                remote
                reserve-keyword
                :remote-method="searchSaleOrder"
                placeholder="请输入销售订单号"
                :loading="saleOrderLoading"
              >
                <el-option
                  v-for="item in saleOrderNumber"
                  :key="item.salesOrderNum"
                  :label="item.salesOrderNum"
                  :value="item.salesOrderNum"
                ></el-option>
              </el-select>-->
              <el-input v-model="basicForm.saleCode" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入销售订单号"></el-input>
            </el-form-item>
            <el-form-item label="行号:">
              <el-input v-model="basicForm.lineNumber" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入行号"></el-input>
            </el-form-item>
            <el-form-item label="计划期:" prop="planDate">
              <el-date-picker v-model="basicForm.planDate" :disabled="basicForm.flowStatus == '0' ? false : true" type="date" placeholder="选择计划期"></el-date-picker>
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
                  :key="item.paperContractNo"
                  :label="item.paperContractNo"
                  :value="item.paperContractNo"
                ></el-option>
              </el-select>-->
              <el-input v-model="basicForm.contractCode" placeholder="请输入合同号" :disabled="basicForm.flowStatus == '0' ? false : true"></el-input>
            </el-form-item>
            <el-form-item label="产品名称:">
              <!-- <el-select
                  v-model="basicForm.produceName"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchProductName"
                  placeholder="请输入合同号"
                  :loading="productNameLoading"
                >
                  <el-option
                    v-for="item in productName"
                    :key="item.id"
                    :label="item.componentName"
                    :value="item.componentCode"
                  >
                  </el-option>
              </el-select>-->
              <el-input v-model="basicForm.produceName" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="报检工序:" prop="componentCode">
              <el-select
              :disabled="basicForm.flowStatus == '0' ? false : true"
                v-model="basicForm.componentCode"
                filterable
                remote
                reserve-keyword
                :remote-method="searchInspection"
                placeholder="请输入报检工序"
                :loading="inspectionLoadig"
                @change="getSelectInspection"
              >
                <el-option
                  v-for="item in inspectionList"
                  :key="item.componentCode"
                  :label="item.componentName"
                  :value="item.componentCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="型号规格">
              <el-input v-model="basicForm.produceModel" :disabled="basicForm.flowStatus == '0' ? false : true" placeholder="请输入型号规格"></el-input>
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
            <el-form-item label="检验日期:">
              <el-date-picker v-model="basicForm.testDate" type="date" placeholder="自动带入" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="申请人:">
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
              <el-select v-model="basicForm.flowStatus" size="small" disabled placeholder="审批状态">
                <el-option
                  v-for="item in flowStatus"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请数量:" prop="testNum">
              <el-input-number
              :disabled="basicForm.flowStatus == '0' ? false : true"
                style="width:100%"
                :min="0"
                v-model="basicForm.testNum"
                placeholder="请输入申请数量"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="合格数量:">
              <el-input-number
                style="width:100%"
                :min="0"
                v-model="basicForm.testStandardNum"
                :disabled="nodeAlias !=2"
                placeholder="请输入合格数量"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="其他原因:">
              <el-input
              :disabled="basicForm.flowStatus == '0' ? false : true"
                type="textarea"
                :rows="4"
                placeholder="请输入其他原因"
                v-model="basicForm.specialInstructions"
              ></el-input>
            </el-form-item>
            <el-form-item label="上传附件:" prop="affixList">
              <file-upload
              v-if="flag"
                ref="fileUpload"
                :data.sync="affixList"
                :mainId="mainDataId"
                :disabled="this.getDisabled()"
                modelName="CRM_QUALITY_JYD"
                fieldName="CRM_QUALITY_JYD#ANNEX"
              ></file-upload>
            </el-form-item>
            <el-button
              type="primary"
              style="width:100%;margin-top:10px;margin-bottom:10px"
              v-if="editFlag === undefined"
              @click="launchReview"
            >发起不合格品评审</el-button>
          </van-tab>
          <van-tab title="检验内容">
            <div style="width:100%;text-align:center;margin-top:5px;">
              <el-select
                v-model="basicForm.componentCode"
                size="small"
                style="width:80% !important;"
                disabled
                placeholder="报检工序带入"
              >
                <el-option
                  v-for="item in inspectionOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div style="width:100%;text-align:center;margin-top:5px;">
              <el-select
                v-model="basicForm.testNumber"
                size="small"
                style="width:80% !important;"
                placeholder="请选择"
                @change="selectWhichOne"
                @click.native="nodeAlias == '2' ? clickSelect : false"
              >
                <el-option
                  v-for="item in numberOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div style="width:100%;height:100%;margin-bottom:30px">
              <div v-for="(item,index) in basicForm.qualityTestListContentEntityList" :key="index">
                <div style="display:flex;margin-top:20px">
                  <div class="testContent_item" style="background:#0000FF">{{index+1}}</div>
                  <div style="margin-left:10px;width:100%;font-size: 14px;">
                    <div style="display:flex">
                      <div style="font-weight:bold;width:70px">检测项目</div>
                      <div style="margin-left:5px;color:#0000FF;">{{item.testProjectName}}</div>
                    </div>
                    <div class="test_item" style="display:flex;align-items:center">
                      <div style="font-weight:bold;width:70px">标准要求</div>
                      <el-input size="small" style="width:70%" :disabled="nodeAlias!=2" v-model="item.testRequire"></el-input>
                    </div>
                    <div class="test_item" style="display:flex">
                      <div style="font-weight:bold;width:70px">检测方法</div>
                      <div style="margin-left:5px;color:#0000FF">{{item.testMethod}}</div>
                    </div>
                    <div class="test_item" style="display:flex">
                      <div style="font-weight:bold;width:70px">实测结果</div>
                      <el-input
                        size="small"
                        type="textarea"
                        rows="3"
                        :disabled="nodeAlias!=2" 
                        style="width:70%"
                        v-model="item.realityResult"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
        <el-button
          v-if="editFlag==true && nodeAlias =='2'"
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
import {
  getData,
  getSaleOrderNumber,
  getContractCode,
  getInspection,
  getTestContent,
  submit,
  getUserName
} from "@/api/quality/testRecord_m";
import { getFixedValue } from "@/api/quality/test_m";
import fileUpload from "@/components/fileUpload";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
import { mapState, mapMutations } from "vuex";
import { setStore } from "@/util/store";
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
      basicForm: {
        qualityTestListContentEntityList:[]
      },
      qualityTestListContentEntityList:[],
      affixList: [],
      mainDataId: "",
      saleOrderLoading: false,
      saleOrderNumber: [],
      contractLoading: false,
      contractList: [],
      inspectionLoadig: false,
      inspectionList: [],
      createInfo: [],
      inspectionOption: [],
      numberOption: [],
      flowStatus: [],
      testPersonLoading:false,
      testPersonList:[],
      rules: {
        planDate: [{ required: true, message: "请选择计划期" }],
        contractCode: [{ required: true, message: "请输入合同号" }],
        testNum: [{ required: true, message: "请输入申请数量" }],
        componentCode:[{required: true, message: "请选择报检工序"}]
      }
    };
  },
  watch: {
    "basicForm.testStandardNum": {
      handler(newValue, oldValue) {
        let arr = [];
        for (let i = 0; i < newValue; i++) {
          arr.push({
            label: `第${i + 1}件`,
            value: i + 1
          });
          // this.qualityTestListContentEntityList.push({
             
          // })
        }
        this.numberOption = arr;
        this.$set(this.basicForm, "testNumber", "");
      }
    },
    "basicForm.componentCode": {
      handler(newValue, oldValue) {
        if (newValue && this.basicForm.testNumber) {
          getTestContent(newValue, this.basicForm.testNumber).then(res => {
            this.basicForm.qualityTestListContentEntityList = res.data.data;
          });
        }
      }
    },
  },
  computed: {
    ...mapState("quality", ["path", "query"])
  },
  created() {
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
    if (this.$route.query.id) {
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
    ...mapMutations("quality", ["SET_UNQUALITYROUTE", "SET_QUERYID"]),
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
        this.basicForm.testNum = 0;
        this.basicForm.testStandardNum = 0;
        this.affixList=[];
        this.flag=true;
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
        this.testPersonList = [
          {
            id: res.data.data.testPersonId,
            realName: res.data.data.testPersonName
          }
        ];
        this.basicForm = res.data.data;
        this.flag =true;
        this.$nextTick(()=>{
          this.mainDataId = res.data.data.id;
            this.$refs.fileUpload.init(this.mainDataId);
        })
      });
    },
    testRecordBack() {
      //  this.$router.push("/quality/test");
      if (this.query.id) {
        this.$router.push({
          path: this.path,
          query: { id: this.query.id }
        });
      } else {
        this.$router.push({
          path: this.path
        });
      }
    },
    getbackground(item) {
      if (item.type == "1") {
        return "background:#0000FF";
      } else {
        return "background:green";
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
    searchSaleOrder(query) {
      if (query !== "") {
        this.saleOrderLoading = true;
        getSaleOrderNumber(query).then(res => {
          this.saleOrderNumber = res.data.data;
          this.saleOrderLoading = false;
        });
      } else {
        this.saleOrderNumber = [];
      }
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
    searchInspection(query) {
      if (query !== "") {
        this.inspectionLoadig = true;
        getInspection(query).then(res => {
          this.inspectionList = res.data.data;
          this.inspectionLoadig = false;
        });
      } else {
        this.inspectionList = [];
      }
    },
    getSelectInspection(value) {
      this.inspectionList.forEach(ele => {
        if (ele.componentCode == value) {
          this.$set(this, "inspectionOption", [
            {
              label: ele.componentName,
              value: ele.componentCode
            }
          ]);
        }
      });
    },
    selectWhichOne(value) {
      if (value && this.basicForm.componentCode) {
        getTestContent(this.basicForm.componentCode, value , this.mainDataId).then(res => {
          this.basicForm.qualityTestListContentEntityList = res.data.data;
        });
      }
    },
    clickSelect(){
       if(this.basicForm.testNumber){
         this.basicForm.affixList = this.affixList;
          submit(this.basicForm).then(res => {
            if (res.data.code === 200) {
              for(let i = 0 ; i<this.qualityTestListContentEntityList.length;i++){
                  if(this.qualityTestListContentEntityList[i].type == this.basicForm.testNumber){
                    this.qualityTestListContentEntityList.splice(i,1)
                  }
              }
              this.qualityTestListContentEntityList.push({
                type:this.basicForm.testNumber,
                data:this.basicForm.qualityTestListContentEntityList
              })
            }

          });
       }
    },
    async launchReview() {
      this.basicForm.affixList = this.affixList;
      const data = await submit(this.basicForm);
      this.SET_UNQUALITYROUTE(this.$route.path);
      this.SET_QUERYID(this.$route.query);
      setStore({
        name: "unQualityPath",
        content: this.$route.path
      });
      setStore({
        name: "query",
        content: this.$route.query
      });
      this.$router.push({
        path: "/quality/unqualified",
        query: { testId: data.data.data.id }
      });
    },
    //提交流程
    submitFlow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.basicForm.testStandardNum < this.basicForm.testNum) {
          //   this.$message.warning("请发起不合格品评审");
          //   return;
          // }
          this.basicForm.affixList = this.affixList;
          this.show = true;
          submit(this.basicForm).then(res => {
            if (res.data.code === 200) {
              modelByName("CRM_QUALITY_JYD").then(res1 => {
                let obj = {
                  flowKey: "CRM_QUALITY_JYD_HG_DART",
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
                      this.testRecordBack();
                    }
                  })
                  .catch(error => {
                    this.show = false;
                  });
              });
            }
          });
        }
      });
    },
    save(formName) {
      this.clickSelect();
      let arr = [];
      let arrOption = [];
      let arrData = [];
      this.qualityTestListContentEntityList.forEach(ele=>{
         arr.push(ele.type)
      })
      this.numberOption.forEach(ele=>{
        arrOption.push(ele.value)
      })
      if(arr.sort().toString() != arrOption.sort().toString()){
          this.$message.warning('请填写每一件检验内容')
          return
      }
      this.qualityTestListContentEntityList.forEach(ele=>{
          ele.data.forEach(el=>{
            if(el.realityResult){
               arrData.push(ele.type)
            }
          })
      })
     arrData = [...new Set(arrData)]
     if(arrData.sort().toString() != arrOption.sort().toString()){
       this.$message.warning('请填写实测结果')
       return
     }
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
/* .sx_quality_testRecord .el-form-item {
  margin-bottom: 5px;
} */
.testContent_item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 20px;
}
.test_item {
  margin-top: 5px;
}
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