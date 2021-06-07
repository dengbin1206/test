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
                <el-button icon="el-icon-s-flag" size="small" type="text"  @click="check(scope.row)" v-if="scope.row.flowStatus!=='0'">查看审批</el-button>
                <el-button icon="el-icon-edit" size="small" type="text"  @click="edit(scope.row)" v-if="scope.row.flowStatus==='2'||scope.row.flowStatus==='0'">编辑</el-button>
                <el-button icon="el-icon-delete" size="small" type="text"  @click="del(scope.row)" style="color:red"  v-if="scope.row.flowStatus==='0'">删除</el-button>
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
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>
<script>
import diaVisLog from '../../work/dialog'
import addDialog from "./components/fhsqAdd";
import { list,deleteByIds } from "@/api/biz/crm/fhsq"; 
import { setTimeout } from "timers";
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
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
      this.bar='新增 发货申请'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,this.xsddId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 发货申请'
      setTimeout(() => {
        this.$refs.addLog.open(row.id, this.xsddId,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 发货申请'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,this.xsddId,3);
      }, 10);
    },
    check(row){
      this.$refs.sonV.confirmProcess(true,row,0,'')
    },
    saveAdd(){
      this.rowId=''
      this.xsddId=''
      this.open()
    },
    turnoff(){
      this.dialogVisible=false
      this.api()
    },
    handleClose(){
      localStorage.removeItem('xsdd');
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
            field: "deliveryType",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.deliveryType,
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
            field: "deliveryNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.deliveryNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "actualDeliveryDate",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.actualDeliveryDate,
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
    getDeliveryTypes(){
        getDictBizByCode('crm_delivery_type').then(res=>{
            this.deliveryTypes=res.data.data
            this.searchOption.rows[0][0].list = this.deliveryTypes;
        })
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
          deleteByIds(row.id).then(res => {
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
    this.getDeliveryTypes();
    if(localStorage.getItem('xsdd')!=''&&localStorage.getItem('xsdd')!=undefined){
      this.xsddId=JSON.parse(localStorage.getItem('xsdd')).rowId
      this.open();
    }
  },
  data() {
    return {
      fullscren:false,
      rowId: "",
      xsddId:'',
      bar:'',
      dialogVisible: false,
      title: "",
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      deliveryTypes:[],
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
              prop: "deliveryType",
              label: "发货类型:",
              placeholder: "请选择发货类型",
              list:this.deliveryTypes
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "paperContractNo",
              label: "纸质合同号:",
              placeholder: "请输入纸质合同号",
              url:'api/blade-crm/contract/paperNumByLabel?search='
            },
          ],
          [
              {
              type: "fuzzySearch",
              queryType:'1',
              prop: "clientId",
              label: "客户名称:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/customer/blurrySelect?search='
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "signNum",
              label: "申请号:",
              placeholder: "请输入申请号",
              url:''
            },
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "deliveryNum",
              label: "ERP交货单:",
              placeholder: "请输入ERP交货单"
            },
            {
              type: "date",
              queryType: "1",
              prop: "actualDeliveryDate",
              label: "实际发货日期:",
              placeholder: "请选择实际发货日期"
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
              label: "部门:",
              placeholder: "请输入关键字",
              url:'api/blade-system/dept/deptByLabel?search='
            }
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 200,
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
            label: "申请号",
            prop: "signNum",
            width:120
          },
          {
            label: "发货类型",
            prop: "deliveryType",
            type: "select",
            width: 100,
            dicUrl: '/api/blade-system/dict-biz/dictionary?code=crm_delivery_type',
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
            label: "ERP交货单",
            prop: "deliveryNum",
            width:150
          },
          {
              label:"客户名称",
              prop:'clientName',
              width:120
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            width:150,
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
            label: "装运地点",
            prop: "shippingLocation",
            width:150,
            type: "select",
            dicUrl: `/api/blade-system/dict-biz/dictionary?code=crm_shipping_Location`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "收货联系人",
            prop: "receiveContact",
            width:100
          },
          {
            label: "联系电话",
            prop: "telephone",
            width: 120
          },
          {
            label: "详细地址",
            prop: "detailAddress",
            width:200
          },
          {
            label: "实际发货日期",
            prop: "actualDeliveryDate",
            width:150
          },
          {
            label: "负责员工",
            prop: "chargeStaffName",
          },
          {
            label: "部门",
            prop: "departmentName",
            width:100
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
