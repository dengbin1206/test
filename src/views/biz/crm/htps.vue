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
            <template slot-scope="scope" slot="menu">
                <el-button icon="el-icon-view" size="small" type="text"  @click="look(scope.row)" v-if="scope.row.flowStatus!=='0'">查看</el-button>
                <el-button icon="el-icon-edit" size="small" type="text"  @click="edit(scope.row)" v-if="scope.row.flowStatus==='2'||scope.row.flowStatus==='0'||scope.row.flowStatus==='5'">编辑</el-button>
                <el-button icon="el-icon-s-flag" size="small" type="text"  @click="check(scope.row)" v-if="scope.row.flowStatus!=='0'">查看审批</el-button>
                <el-button icon="el-icon-delete" size="small" type="text"  @click="del(scope.row)" style="color:red"  v-if="scope.row.flowStatus==='0'">删除</el-button>
            </template>
            <template slot-scope="scope" slot="menuLeft">
                <el-button icon="el-icon-plus" size="small" type="primary"  @click="saveAdd(scope.row)">新增</el-button>
            </template>
        </avue-crud>
        <el-dialog
            v-dialog
            :fullscreen="fullscren"
            :title="bar"
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            class='avue-dialog'
            width="75%"
            top='8vh'
            ref="dialog"
            append-to-body
            :close-on-click-modal='false'
            :close-on-press-escape="false"
            :before-close="handleClose"
            >
            <div slot="title" class="avue-crud__dialog__header">
              <span class="el-dialog__title">{{ bar }}</span>
              <div class="avue-crud__dialog__menu">
                <i
                  @click="handleFullScreen"
                  class="el-dialog__close el-icon-full-screen"
                ></i>
              </div>
            </div>
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
                <addDialog ref="addLog" :api='api' :turnoff='turnoff'/>
            </div>
        </el-dialog>
        <el-dialog
            v-dialog
            class="sx_xsdd"
            title="查看审批"
            top='20px'
            :visible.sync="dialogApprove"
            append-to-body
            width="75%"
            :close-on-click-modal='false'>
            <el-table
                :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                :data="productInfoVOList"
                border
                height="500"
                size='small'
                style="width: 100%;">
                <el-table-column
                  type='index'
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="signNum"
                  label="合同评审号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="paperContractNo"
                  label="纸质合同号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="clientContractNum"
                  label="客户合同号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="projectReportNum"
                  label="项目报登号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="clientName"
                  label="客户名称"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="chargeStaffName"
                  label="负责员工">
                </el-table-column>
                <el-table-column
                  prop="departmentName"
                  label="办事处"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="contractStart"
                  label="合同有效开始日期"
                  width="150">
                </el-table-column>           
                <el-table-column
                  prop="flowStatus"
                  label="审批状态"
                  width="150">
                    <template slot-scope="scope">
                      <span v-if="scope.row.flowStatus=='0'">未提交审批</span>
                      <span v-if="scope.row.flowStatus=='1'">审批中</span>
                      <span v-if="scope.row.flowStatus=='2'">审批通过</span>
                      <span v-if="scope.row.flowStatus=='3'">审批作废</span>
                      <span v-if="scope.row.flowStatus=='4'">变更审批中</span>
                      <span v-if="scope.row.flowStatus=='5'">变更审批通过</span>
                      <span v-if="scope.row.flowStatus=='6'">变更审批作废</span>
                      <span v-if="scope.row.flowStatus=='7'">待提交变更审批</span>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="flowCompletedTime"
                  label="审批结束时间"
                  width="150">
                </el-table-column>
                <el-table-column label="操作"  width='80' fixed="right">
                    <template slot-scope="scope">
                      <el-button icon='el-icon-view' size="small" type="text"  @click="looking(scope.row,scope.$index)">查看</el-button> 
                    </template>
                </el-table-column>
            </el-table>
            <diaVisLog ref="sonV"></diaVisLog>
        </el-dialog>
    </basic-container>
</template>
<script>
import diaVisLog from '../../work/dialog'
import addDialog from "./components/htpsAdd";
import { list,delet,showVersion} from "@/api/biz/crm/htps";
import { setTimeout } from "timers";
export default {
  components: {
    addDialog,
    diaVisLog
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    check(row){
      this.dialogApprove=true
      showVersion(row.id).then(res=>{
        this.productInfoVOList=res.data.data
      })
    },
    looking(row){
      this.$refs.sonV.confirmProcess(true,row,0,'')
    },
    saveAdd(){
      this.rowId=''
      this.getId=''
      this.open()
    },
    open() {
      this.dialogVisible=true
      this.bar = "新增 合同评审";
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,this.getId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar = "编辑 合同评审";
      setTimeout(() => {
        this.$refs.addLog.open(row.id, this.getId,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar = "查看 合同评审";
      setTimeout(() => {
        this.$refs.addLog.open(row.id, this.getId,3);
      }, 10);
    },
    turnoff(){
      this.dialogVisible=false
      this.api()
    },
    handleClose(){
      localStorage.removeItem('getId');
      this.dialogVisible = false;
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "signNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.signNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "paperContractNo",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.paperContractNo,
                upperValue: ""
              }
            ]
          },
          {
            field: "projectReportNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.projectReportNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "clientId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.clientId,
                upperValue: ""
              }
            ]
          },
          {
            field: "chargeStaff",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.chargeStaff,
                upperValue: ""
              }
            ]
          }
        ]
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    api() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: []
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
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
    rowStyle(){
      return 'height: 35px'
    },
    cellStyle(){
      return 'padding: 0'
    },
    del(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delet(row.id).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.api();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  activated() {
    this.api();
    if(localStorage.getItem('getId')!=''&&localStorage.getItem('getId')!=undefined){
      this.getId=localStorage.getItem('getId')
      this.open()
    }
  },
  data() {
    return {
      fullscren:false,
      getId:'',
      rowId: "",
      bar:'',
      dialogVisible: false,
      dialogApprove:false,
      productInfoVOList:[],
      title: "",
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      data: [],
      selectQuery: "",
      clickquery: "",
      searchOption: {
        rows: [
          [
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "signNum",
              label: "合同评审单号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/contract/signNumByLabel?search='
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "paperContractNo",
              label: "纸质合同号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/contract/paperNumByLabel?search='
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "projectReportNum",
              label: "项目报登号:",
              placeholder: "请输入项目报登号",
              url:'api/blade-crm/project/reportNumByLabel?search='
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "clientId",
              label: "客户名称:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/customer/blurrySelect?search='
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "chargeStaff",
              label: "负责员工:",
              placeholder: "请输入关键字",
              url:'api/blade-user/getUserInfoBySearch?search='
            }
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        tip: false,
        page: true,
        index: true,
        refreshBtn: false,
        border: true,
        columnBtn: false,
        cancelBtn: false,
        selection: true,
        searchBtn: false,
        deleteBtn: false,
        stripe: true,
        selectClearBtn: false,
        reserveSelection: true,
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        labelWidth: 120,
        column: [
          {
            label: "合同评审单号",
            prop: "signNum",
            width:120,
          },
          {
            label: "纸质合同号",
            prop: "paperContractNo",
            width:120,
          },
          {
            label: "客户合同号",
            prop: "clientContractNum",
            width:120,
          },
          {
            label: "项目报登号",
            prop: "projectReportNum",
            width:120,
          },
          {
            label: "客户名称",
            prop: "clientName",
            width:120
          },
          {
            label: "负责员工",
            prop: "chargeStaffName"
          },
          {
            label: "办事处",
            prop: "departmentName",
            width:200,
          },
          {
            label: "合同有效开始日期",
            prop: "contractStart",
            width:150,
          },
          {
            label: "计划交货开始日期",
            prop: "deliveryDate",
            width:150,
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            width:120,
            type: "select",
            dicUrl: `/api/blade-system/dict/dictionary?code=flow_status`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "审批结束时间",
            prop: "flowCompletedTime",
            width: 150
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
