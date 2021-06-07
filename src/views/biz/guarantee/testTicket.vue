<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud :option="option"
                :data="data"
                :page='page'
                @current-change="currentChange"
                @size-change="sizeChange"
                :cell-style="cellStyle"
                :row-style="rowStyle">
            <template slot-scope="scope" slot="menu">
                <el-button icon="el-icon-view" size="small" type="text"  @click="look(scope.row)">查看</el-button>
                <el-button icon="el-icon-s-flag" size="small" type="text"  @click="check(scope.row)"  v-if="scope.row.flowStatus!=='0'">查看审批</el-button>
            </template>
        </avue-crud>
        <el-dialog
            :title="bar"
            top='20px'
            :visible.sync="dialogVisible"
            append-to-body
            width="75%"
            :close-on-click-modal='false'>
              <addDialog ref="addLog"/>
        </el-dialog>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>
<script>
import diaVisLog from '../../work/dialog'
import addDialog from "./components/testTicketAdd";
import { list} from "@/api/biz/guarantee/orderTicket";
import { setTimeout } from "timers";
export default {
  components: {
    addDialog,
    diaVisLog
  },
  methods: {
    check(row){
      this.$refs.sonV.confirmProcess(true,row,0,'')
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 测试委托单'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,3);
      }, 10);
    },
    turnoff(){
      this.dialogVisible=false
      this.api()
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "entrustCode",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.entrustCode,
                upperValue: ""
              }
            ]
          },
          {
            field: "entrustDate",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.entrustDate,
                upperValue: ""
              }
            ]
          },
          {
            field: "entrustDeptId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.entrustDeptId,
                upperValue: ""
              }
            ]
          },
          {
            field: "entrustPersonId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.entrustPersonId,
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
  },
  created() {
    this.api();
  },
  data() {
    return {
      bar:'',
      rowId: "",
      dialogVisible: false,
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
      segmentIndustrys:[],
      searchOption: {
        rows: [
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "entrustCode",
              label: "委托单号:",
              placeholder: "请输入关键字",
              url:''
            },
            {
              type: "date",
              queryType:'1',
              prop: "entrustDate",
              label: "委托日期:",
              placeholder: "请选择委托日期"
            },
          ],
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "entrustDeptId",
              label: "委托部门:",
              placeholder: "请输入关键字",
              url:'api/blade-system/dept/deptByLabel?search='
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "entrustPersonId",
              label: "委托人:",
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
            label: '申请出具报告',
            prop: 'testType',
            width:150,
            },
            {
            label: '委托单号',
            prop: 'entrustCode',
            width:120,
            },
            {
            label: '委托部门',
            prop: 'entrustDeptName',
            width:180,
            },
            {
            label: '合同号',
            prop: 'contractNum',
            width:120,
            },
            {
            label: '委托人姓名',
            prop: 'entrustPersonName',
            width:100,
            },
            {
            label: '创建人姓名',
            prop: 'createUserName',
            width:100,
            },
            {
            label: '创建时间',
            prop: 'createTime',
            width:150
            },
            {
            label: "审批状态",
            prop: "flowStatus",
            type: "select",
            dicUrl: `/api/blade-system/dict/dictionary?code=flow_status`,
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            width:150
            },
            {
            label: '审批结束时间',
            prop: 'flowCompletedTime',
            width:150
            }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
