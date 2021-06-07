<template>
   <basic-container>
     <Search :option="searchOption" @search="search"></Search>
     <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               @current-change="currentChange"
               @size-change="sizeChange"
               :cell-style="cellStyle"
               :row-style="rowStyle">
        <template slot="menuLeft">
          <el-button type="primary"
                    size="small"
                    icon="el-icon-plus"
                    @click="dyewm">新建报修申请
          </el-button>
        </template>
       <template slot-scope="scope" slot="checkConclusion">
         <el-tag type="warning" v-if="scope.row.repairMode === 1">内部维修</el-tag>
         <el-tag type="success" v-if="scope.row.repairMode === 2">委外</el-tag>
       </template>
    </avue-crud>
    <el-dialog
      v-dialog
      :fullscreen="fullscren"
      title="报修"
      v-if="printize"
      :visible.sync="printize"
      class='avue-dialog'
      width="75%"
      top='8vh'
      ref="dialog"
      append-to-body
      :close-on-click-modal='false'
      :close-on-press-escape="false"
    >
      <div slot="title" class="avue-crud__dialog__header">
            <span class="el-dialog__title">报修</span>
            <div class="avue-crud__dialog__menu">
                <i
                  @click="handleFullScreen"
                  class="el-dialog__close el-icon-full-screen"
                ></i>
            </div>
      </div>
      <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
          <el-form  label-width="130px"  :model='wxForm' :rules="rules" ref="ruleForm" class="sx_formItem">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="设备编号:" prop='equipNum'>
              <selectSearchWithFull :key="selectWithFullConfig.id" :config="selectWithFullConfig" :formData.sync="wxForm" ></selectSearchWithFull>
            </el-form-item>
          </el-col>
            <el-col :span='12'>
              <el-form-item label="报修单号:" prop='repairCode'>
                  <el-input v-model="wxForm.repairCode" placeholder="自动生成"  size="small" disabled/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="维修种类:" prop='repairType'>
              <el-select size="small" style="width:100%" v-model='wxForm.repairType' clearable>
                <el-option
                  v-for="item in repairType"
                  :key="item.value"
                  :label="item.dictValue"
                  :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="报修时间:" prop='repairTime'>
              <el-input v-model="wxForm.repairTime"  size="small" disabled/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="设备名称:" prop='equipName'>
              <el-input v-model="wxForm.equipName"  size="small" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="设备型号:" prop='modelNum'>
              <el-input v-model="wxForm.modelNum"  size="small" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="安装位置:" >
              <el-input v-model="wxForm.installPosition"  size="small" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="报修人:" >
              <el-input v-model="wxForm.repairPersonName"  size="small" disabled/>
              <el-input v-model="wxForm.repairPerson"  size="small" style="display: none"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item label="故障反应:" prop='failureResponse'>
              <el-input type="textarea" v-model="wxForm.failureResponse" placeholder="请输入故障反应"  size="small"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--
        <span>以下维修人员填写</span>
        <el-divider></el-divider>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="维修方式:" prop='repairMode'>
              <el-select size="small" style="width:100%" v-model='wxForm.repairMode' clearable>
                <el-option
                  v-for="item in repairMode"
                  :key="item.value"
                  :label="item.dictValue"
                  :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="维修内容:" prop='repairContent'>
              <el-input type="textarea" v-model="wxForm.repairContent" placeholder="请输入维修内容"  size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="更换配件:" prop='replacementParts'>
              <el-input type="textarea" v-model="wxForm.replacementParts" placeholder="请输入更换配件"  size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        -->
      </el-form>
      <span slot="footer" class="dialog-footer" style="float:right">
          <el-button type="primary" @click="bxSubmit('ruleForm')" size="small" icon="el-icon-check">提交流程</el-button>
          <el-button @click="bxClose('ruleForm')" size="small" icon="el-icon-close">取 消</el-button>
      </span>
      </div>
    </el-dialog>
   </basic-container>
</template>
<script>
import { repairList,submit ,equipDetail} from "@/api/biz/sbgl";
import { getAll } from "@/api/flow/flow";
import { getDictBizByCode } from "@/api/system/dict";
import fileUpload from "@/components/fileUpload";
import selectSearchWithFull from "@/components/selectSearchWithFull";
import {getSystemFixedValue,startFlowByModelName} from "@/api/assistant";
import {dateFormat} from "@/util/date";
export default {
  components: {
    fileUpload,
    selectSearchWithFull
  },
  data() {
    return {
      rules:{
        equipNum:[
          { required: true, message: '请选择报修设备', trigger: 'blur' }
        ],
        failureResponse:[
          { required: true, message: '请输入故障反应', trigger: 'blur' }
        ],
        repairType:[
          { required: true, message: '请输入维修类型', trigger: 'blur' }
        ]
      },
      selectWithFullConfig:{
        //id:"123",
        placeholder:"请输入设备编号",
        size:"small",
        // 组件自身name字段名
        name:"equipNum",
        // 查询的模型名
        modelName:"SBJC",
        // 搜索的字段名
        searchField:["SBJC#equipNum","SBJC#equipName"],
        // 查询的字段名
        findField:["SBJC#id","SBJC#equipNum","SBJC#equipName","SBJC#modelNum","SBJC#installPosition"],
        // F表单，M模型，S自定义
        findType:"S",
        // select的label字段名
        label:"SBJC#equipNum",
        // select的value字段名
        value:"SBJC#equipNum",
        // 填充字段名映射
        fullField:[{equipId:"SBJC#id"},{equipName:"SBJC#equipName"},{modelNum:"SBJC#modelNum"},{installPosition:"SBJC#installPosition"}],
        initValue:''
      },
      fullscren:false,
      repairMode:[],
      wxfsOption:[],
      hk:false,
      repairType:[],
      dataId:'',
      num: 0,
      rightList: {},
      djForm: {},
      userList: [],
      //查询参数
      djdj: false,
      printize: false,
      fieldPower:{},
      wxForm: {
        equipId:"",
        equipName:"",
        equipNum:"",
        modelNum:"",
        installPosition:"",
        repairPerson:"",
        repairPersonName:"",
        repairTime:"",
        repairMode:[]
      },
      selectQuery: {},
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "repairCode",
              label: "报修单号:",
              placeholder: "报修单号"
            },
            {
              type: "input",
              queryType: "1",
              prop: "equipName",
              label: "设备名称:",
              placeholder: "请输入设备名称"
            }
          ],
          [
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "报修时间:",
              placeholder: "请选择报修时间"
            }
          ]
        ]
      },
      clickquery: "",
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      data: [],
      option: {
        excelBtn:true,
        menu:false,
        editBtn:false,
        delBtn:false,
        addBtn:false,
        menuWidth:120,
        tip: false,
        page: true,
        index: true,
        refreshBtn: false,
        border: true,
        columnBtn: false,
        cancelBtn: false,
        selection: true,
        searchBtn: false,
        deleteBtn:false,
        stripe: true,
        selectClearBtn: false,
        reserveSelection: true,
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        labelWidth: 120,
        column: [
          {
            label: "报修单号",
            prop: "repairCode",
            width:120,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "维修种类",
            prop: "repairType",
            type:'select',
            dicUrl:`/api/blade-system/dict-biz/dictionary?code=sbgl_wxzl`,
            props:{
              label:'dictValue',
              value:'dictKey'
            },
            width:70,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "故障反应",
            prop: "failureResponse",
            addDisplay:false,
            editDisplay:false,
            width:300
          },
          {
            label: "设备名称",
            prop: "equipName",
            width:150,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "设备型号",
            prop: "equipNum",
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "设备编号",
            prop: "modelNum",
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "安装位置",
            prop: "installPosition",
            width:200,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label:'报修人',
            prop:'repairPersonName'
          },
          {
            label:'报修时间',
            prop:'createTime',
            width:200,
            type: "datetime",
            valueFormat: "yyyy-MM-dd HH:MM:SS"
          },
          {
            label:'维护开始时间',
            prop:'repairStartTime',
            width:200,
            type: "date",
            format:"yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label:'维修结束时间',
            prop:'repairEndTime',
            width:200,
            type: "date",
            format:"yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label:'维修方式',
            prop:'repairMode',
            type: "select",
            dicUrl:`/api/blade-system/dict-biz/dictionary?code=sbgl_wxfs`,
            props:{
              label:'dictValue',
              value:'dictKey'
            },
          },
          {
            label:'维修内容',
            prop:'repairContent',
            width:300
          },
          {
            label:'更换配件',
            prop:'replacementParts',
            width:200
          },
          {
            label:'审批状态',
            prop:'flowStatus',
            type: "select",
            dicUrl:`/api/blade-system/dict/dictionary?code=flow_status`,
            props:{
              label:'dictValue',
              value:'dictKey'
            },
          },
        ]
      }
    };
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "equipName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.equipName,
                upperValue: ""
              }
            ]
          },
          {
            field: "repairCode",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.repairCode,
                upperValue: ""
              }
            ]
          },
          {
            field: "createTime",
            expressionList: [
              {
                operator: "BT",
                lowerValue: val.createTime[0],
                upperValue: val.createTime[1]
              }
            ]
          }
        ]
      };
      repairList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },
    api() {
      this.loading = true;
      let obj = {
        extQueryList: []
      };
      repairList(obj).then(res => {
        this.data = res.data.data.records;
        this.data.forEach(item=>{
            item.chargeTeam=item.chargeTeamName
            item.chargeUser=item.chargeUserName
          })
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },


    selectionChange(list) {
      this.selectionList = list;
    },
    //当前页
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //当前条数
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //报修
    dyewm() {
      this.printize = true;
      this.wxForm.repairMode='1';
      getSystemFixedValue().then(res => {
          this.wxForm.repairPersonName = res.data.data.createUserName;
          this.wxForm.repairPerson = res.data.data.createUser;
          this.wxForm.repairTime = res.data.data.createTime;
      });
    },
    clearForm(){
      for(let prop in this.wxForm){
          if(typeof(this.wxForm[prop])=="object"){
            this.wxForm[prop]={};
          }else{
            this.wxForm[prop]='';
          }
      }
      this.selectWithFullConfig.id=new Date().getTime();
      this.wxForm.equipNum = '';
    },
    getRight(a, b) {
      getRegister(a, b).then(res => {
        if (res.data.code == "200") {
          this.rightList = res.data.data;
          this.rightList.standardList.forEach(item => {
            if (item.isNormal == 1) {
              item.isNormal = true;
            } else {
              item.isNormal = false;
            }
          });
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    rowStyle(){
      return 'height: 35px'
    },
    cellStyle(){
      return 'padding: 0'
    },
    //报修提交流程
    bxSubmit(formName){
      this.$refs[formName].validate((valid) =>{
        if (valid) {
          // 验证设备是否报废
          equipDetail(this.wxForm.equipId).then((res) => {
            if ((res.data.code = 200)) {
              let scrapDate = res.data.data.scrapDate;
              if(scrapDate){
                let now = dateFormat(new Date(),'yyyy-MM-dd');
                if(now>scrapDate){
                  this.$message({
                    type: "error",
                    message: "设备已经超过报废期，不能报修"
                  });
                  return;
                }
              }
              submit(this.wxForm).then(res => {
                if ((res.data.code = 200)) {
                  this.clearForm();
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  let dataId = res.data.data.id;
                  startFlowByModelName("SBBX","SBGL_BX_DART","S",dataId,this.$route.fullPath).then(res => {
                    if ((res.data.code = 200)) {
                      this.$message({
                        type: "success",
                        message: res.data.msg
                      });
                      this.printize = false;
                      this.api();
                    }
                  });
                }else{
                  this.$message({
                    type: "error",
                    message: "保存失败"
                  });
                }
              });
            }else{
              this.$message({
                type: "error",
                message: "验证失败"
              });
            }
          });
        }else{
          return false
        }
      })

    },
    bxClose(formName){
      this.printize = false
      this.$refs[formName].resetFields();
    },

    //提示行
    tableRowClassName({ row, rowIndex }) {
      if (!row.isNormal && this.num == 1) {
        return "danger-row";
      }
    },
    //报修班组
    getUserList() {
      getAll().then(res => {
        this.userList = res.data.data;
        this.userList.forEach(ele => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    },
    //维修方式
    wxtype(a) {
      getDictBizByCode(a).then(res => {
        this.repairMode = res.data.data;
      });
    },
    //维修种类
    wxzl(a) {
      getDictBizByCode(a).then(res => {
        this.repairType = res.data.data;
      });
    },
  },
  computed: {
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.client_add),
        viewBtn: this.vaildData(this.permission.client_view),
        delBtn: this.vaildData(this.permission.client_delete),
        editBtn: this.vaildData(this.permission.client_edit)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  created() {
    this.api();
    this.wxzl('sbgl_wxzl')
    this.wxtype('sbgl_wxfs')
  }
};
</script>

<style lang="scss">
.el-table .danger-row {
  background: rgb(245, 108, 108);
}
</style>
