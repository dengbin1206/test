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
                <el-button icon="el-icon-view" size="small" type="text"  @click="look(scope.row)">查看</el-button>
            </template>
        </avue-crud>
        <addDialog ref="addLog"/>
    </basic-container>
</template>
<script>
import addDialog from "./components/zzfAdd";
import { zfList} from "@/api/biz/crm/fhsq"; 
import { setTimeout } from "timers";
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
export default {
  components: {
    addDialog
  },
  methods: {
    look(row) {
      this.dialogVisible=true
      setTimeout(() => {
        this.$refs.addLog.open(this.dialogVisible,{},[],row.id);
      }, 10);
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "deliveryFormNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.deliveryFormNum,
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
          }
        ]
      };
      zfList(obj).then(res => {
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
      zfList(obj).then(res => {
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
    }
  },
  activated() {
    this.api();
  },
  data() {
    return {
      rowId: "",
      dialogVisible:true,
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
              type: "input",
              queryType: "1",
              prop: "deliveryFormNum",
              label: "直发单号:",
              placeholder: "请输入直发单号"
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "paperContractNo",
              label: "纸质合同号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/contract/paperNumByLabel?search='
            }
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 150,
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
            label: "直发单号",
            prop: "deliveryFormNum",
          },
          {
            label: "纸质合同号",
            prop: "paperContractNo",
          },
          {
            label: "创建人",
            prop: "createUserName",
          },
          {
              label:"创建时间",
              prop:'createTime'
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
