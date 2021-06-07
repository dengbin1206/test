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
                <el-button icon="el-icon-delete" size="small" type="text"  @click="del(scope.row)" style="color:red" v-if="scope.row.flowStatus==='0'">删除</el-button>
            </template>
            <template slot-scope="scope" slot="menuLeft">
                <el-button icon="el-icon-plus" size="small" type="primary"  @click="saveAdd(scope.row)">新增</el-button>
            </template>
            <template slot-scope="scope" slot="contractType">
                <span  v-if="scope.row.contractType == 1">正式</span>
                <span  v-if="scope.row.contractType == 2">特批</span>
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
              <span class="el-dialog__title">{{bar}}</span>
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
            class='avue-dialog'
            title="查看审批"
            top='8vh'
            :visible.sync="dialogApprove"
            append-to-body
            width="75%"
            :close-on-click-modal='false'>
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
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
                  prop="orderType"
                  label="销售订单类型"
                  width="150">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.orderType" size="small" placeholder="请选择订单类型" disabled>
                                    <el-option
                                        v-for="item in orderTypes"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="saleGroup"
                  label="销售组织"
                  width="180">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.saleGroup" size="small" placeholder="请选择销售组织" disabled>
                                    <el-option
                                        v-for="item in saleGroups"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="paperContractNo"
                  label="纸质合同号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="salesOrderNum"
                  label="销售订单号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="contractType"
                  label="合同类型"
                  width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.contractType=='1'">正式</span>
                    <span v-if="scope.row.contractType=='2'">特批</span>
                  </template>
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
                  prop="requestDeliveryDate"
                  label="请求交货日期"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="netWorth"
                  label="净值(万元)"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="taxAmount"
                  label="税额(万元)"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="includeTaxAmount"
                  label="含税金额(万元)"
                  width="110">
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
                <el-table-column
                  prop="createUserName"
                  label="创建人">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="updateUserName"
                  label="变更人">
                </el-table-column>
                <el-table-column
                  prop="updateTime"
                  label="变更时间"
                  width="150">
                </el-table-column>
                <el-table-column label="操作"  width='80' fixed="right">
                    <template slot-scope="scope">
                      <el-button icon='el-icon-view' size="small" type="text"  @click="looking(scope.row,scope.$index)">查看</el-button> 
                    </template>
                </el-table-column>
            </el-table>
            <diaVisLog ref="sonV"></diaVisLog>
            </div>
        </el-dialog>
    </basic-container>
</template>
<script>
import { getDictBizByCode} from "@/api/system/dict";
import diaVisLog from '../../work/dialog'
import addDialog from "./components/xsddAdd";
import { list,deletedByIds,showVersion } from "@/api/biz/crm/xsdd"; 
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
    open() {
      this.dialogVisible=true
      this.bar='新增 销售订单'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,this.htId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 销售订单'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,this.htId,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 销售订单'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,this.htId,3);
      }, 10);
    },
    check(row){
      this.dialogApprove=true
      showVersion(row.id).then(res=>{
        this.productInfoVOList=res.data.data
      })
      getDictBizByCode("crm_order_type").then(res => {
        this.orderTypes = res.data.data;
      });
    },
    looking(row){
      this.$refs.sonV.confirmProcess(true,row,0,'')
    },
    saveAdd(){
      this.rowId=''
      this.htId=''
      this.open()
    },
    turnoff(){
      this.dialogVisible=false
      this.api()
    },
    handleClose(){
      localStorage.removeItem('htcp');
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
            field: "saleGroup",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.saleGroup,
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
            field: "salesOrderNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.salesOrderNum,
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
          },
          {
            field: "departmentId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.departmentId,
                upperValue: ""
              }
            ]
          },
          {
            field: "requestDeliveryDate",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.requestDeliveryDate,
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
          deletedByIds(row.id).then(res => {
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
    },
  },
  activated() {
    this.api();
    if(localStorage.getItem('htcp')){
      this.htId=JSON.parse(localStorage.getItem('htcp')).htId
      this.open()
    };
    getDictBizByCode("crm_sale_group").then(res => {
        this.saleGroups = res.data.data;
        this.searchOption.rows[0][0].list = this.saleGroups;
      });
  },
  data() {
    return {
      fullscren:false,
      htId:'',
      rowId: "",
      saleGroups:[],
      dialogVisible: false,
      dialogApprove:false,
      productInfoVOList:[],
      orderTypes:[],
      title: "",
      loading: true,
      bar:'',
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
              type: "select",
              queryType: "1",
              prop: "saleGroup",
              label: "销售组织:",
              placeholder: "请选择销售组织",
              list:this.saleGroups
            },
            {
              type: "fuzzySearch",
              queryType: "1",
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
              prop: "salesOrderNum",
              label: "销售订单号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/sale/getSaleOrderByLabel?search='
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
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "departmentId",
              label: "办事处:",
              placeholder: "请输入关键字",
              url:'api/blade-system/dept/deptByLabel?search='
            }
          ],
          [
            {
              type: "date",
              queryType: "1",
              prop: "requestDeliveryDate",
              label: "请求交货日期:",
              placeholder: "请选择请求交货日期"
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
            label: "销售订单类型",
            prop: "orderType",
            type: "select",
            width: 100,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=crm_order_type",
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "销售组织",
            prop: "saleGroup",
            type: "select",
            width: 130,
            dicUrl: "/api/blade-system/dict-biz/dictionary?code=crm_sale_group",
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "纸质合同号",
            prop: "paperContractNo",
            width: 130
          },
          {
            label: "销售订单号",
            prop: "salesOrderNum",
            width: 130
          },
          {
            label: "合同类型",
            prop: "contractType",
            slot:true
          },
          {
              label:"客户名称",
              prop:'clientName',
              width:120
          },
          {
            label: "负责员工",
            prop: "chargeStaffName"
          },
          {
            label: "办事处",
            prop: "departmentName",
            width: 120
          },
          {
            label: "请求交货日期",
            prop: "requestDeliveryDate",
            width: 120
          },
          {
            label: "净值(万元)",
            prop: "netWorth",
            width:100
          },
          {
            label: "税额(万元)",
            prop: "taxAmount",
            width:100
          },
          {
            label: "含税金额(万元)",
            prop: "includeTaxAmount",
            width:100
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            width:130,
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
          },
          {
            label: "创建人",
            prop: "createUserName"
          },
          {
            label: "创建时间",
            prop: "createTime",
            width:150
          },
          {
            label: "变更人",
            prop: "updateUserName"
          },
          {
            label: "变更时间",
            prop: "updateTime",
            width:150
          },
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
