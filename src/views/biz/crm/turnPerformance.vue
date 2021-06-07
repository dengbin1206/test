<template>
     <basic-container>
          <Search ref="query" :option="searchOption" @search="search"></Search>
          <avue-crud
      :data="data"
      :option="option"
      ref="crud"
      :table-loading="loading"
      @current-change="currentChange"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      :page.sync="page"
    >
      <template slot="flowStatus" slot-scope="scope">
        <el-tag :type="getFlowStatus(scope.row.flowStatus)">{{getLabel(scope.row.flowStatus)}}</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-edit"
          size="small"
          type="text"  
          @click="viewApproval(scope.row)"
        >查看审批</el-button>
        <el-button icon="el-icon-edit" size="small" type="text" :disabled="scope.row.flowStatus != '0'" @click="performanceDetail(scope.row)">编 辑</el-button>
      </template>
    </avue-crud>
     <el-dialog
      v-dialog
       :fullscreen="fullscren"  
       v-if="dialogVisible"
      :visible.sync="dialogVisible"
     modal-append-to-body
      class="avue-dialog"
      width="75%"
      top="8vh"
      ref="dialog" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
      >
      <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">转履约保证金</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
    <div style="height:75vh;overflow-y:auto;overflow-x: hidden;">
      <PerformanceAdd ref="PerformanceAdd" @api="api" :dialogVisible="dialogVisible"  @closeDialog="closeDialog"/>
    </div>
    </el-dialog>
    <diaVisLog ref="outSonV"></diaVisLog>
     </basic-container>
</template>
<script>
import {
  getList,
} from "@/api/biz/crm/turnPerformance";
import PerformanceAdd from "./components/turnPerformanceAdd";
import { startFlow } from "@/api/tool/dynamic";
import {
  flowList
} from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
import diaVisLog from "../../work/dialog";
export default {
    components:{
        PerformanceAdd,
        diaVisLog
    },
     data(){
         return {
           fullscren: false,
             dialogVisible:false,
             data:[],
             loading:false,
             page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      selectionList: [], //表格多选数据
      selectQuery: {}, //查询条件
      clickquery: "", 
             searchOption: {
        rows: [
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "projectCode",
              label: "项目报登号:",
              placeholder: "请输入项目报登号",
              url:'api/blade-crm/project/reportNumByLabel?search='
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "biddingUnit",
              label: "招标单位:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/customer/blurrySelect?search='
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "remittanceUnit",
              label: "汇入单位或户名:",
              placeholder: "请输入汇入单位或户名"
            },
            
          ]
        ]
      },
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        tip: false,
        align: "center",
        border: true,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        selection: true,
        menuWidth:160,
        dialogClickModal: false,
        column: [
            {
            label: "投标保证金单号",
            prop: "bidBondCode",
            width:120
          },
          {
            label: "项目报登号",
            prop: "projectCode",
            width:120
          },
          {
            label: "招标单位",
            prop: "biddingUnit"
          },
          {
            label: "汇入单位或户名",
            prop: "remittanceUnit",
            width:120
          },
          {
            label: "保证金金额",
            prop: "bidBondAmount",
            width:100
          },
          {
            label: "币种",
            prop: "currency",
            dicData:[],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "转履约金额",
            prop: "performanceAmount",
             width:100
          },
          {
            label: "计划归还日期",
            prop: "plannedReturnDate",
             width:120
          },
          {
            label: "实际归还金额",
            prop: "actualReturnAmount",
            width:120
          },
          {
            label: "实际归还日期",
            prop: "actualReturnDate",
            width:120
          },
          {
            label: "负责员工",
            prop: "userName"
          },
          {
            label: "部门",
            prop: "DeptName"
          },
          {
            label: "创建人",
            prop: "createUserName"
          },
          {
            label: "创建时间",
            prop: "createTime",
            width:160
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            width:120,
            slot: true
          },
        ]
      },
         }
     },
     created(){
        this.api()
     },
     methods:{
       handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
         //关闭弹框
    close() {
      this.$refs.PerformanceAdd.closeValidate();
    },
   closeDialog(){
     this.dialogVisible = false;
     this.api()
   },
   //查看审批
    viewApproval(row){
      modelByName("CRM_ZLYBZJ").then(res => {
        if (res.data.code == 200) {
           flowList(res.data.data.id, row.id).then(res => {
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
        });
        }
      });  
    },
    //编辑
    performanceDetail(row){
      this.dialogVisible = true;
       this.$nextTick(()=>{
          this.$refs.PerformanceAdd.detail(row.id)
      })
    },
   //搜索
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let arr = this.getExtQueryList(val);
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: arr
      };
      getList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
         // 流程状态
    getFlowStatus(number) {
      if (number == 0) {
        return "info";
      }
      if (number == 1) {
        return "warning";
      }
      if (number == 2) {
        return "success";
      }
      if (number == 3) {
        return "danger";
      }
      if (number == 4) {
        return "warning";
      }
      if (number == 5) {
        return "success";
      }
      if (number == 6) {
        return "danger";
      }
      if(number == 7){
        return "warning"
      }
    },
    getLabel(number) {
      if (number == 0) {
        return "未提交审批";
      }
      if (number == 1) {
        return "审批中";
      }
      if (number == 2) {
        return "审批通过";
      }
      if (number == 3) {
        return "审批作废";
      }
      if (number == 4) {
        return "变更审批中";
      }
      if (number == 5) {
        return "变更审批通过";
      }
      if (number == 6) {
        return "变更审批作废";
      }
      if(number == 7){
        return "待提交变更审批"
      }
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    //修改页码
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //修改页面数量
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.search(this.selectQuery);
    },
    // 列表接口，获取数据
    api() {
      this.loading = true;
      var obj = {
        current: 1,
        size: 10,
        extQueryList: []
      };
      getList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    }
     }
}
</script>

<style scoped>

</style>