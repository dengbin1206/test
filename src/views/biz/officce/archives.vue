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
            <template slot-scope="scope" slot="menuLeft">
                <el-button icon="el-icon-plus" size="small" type="primary"  @click="open()">新增</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
                <el-button icon="el-icon-view" size="small" type="text"  @click="look(scope.row)"  v-if="scope.row.flowStatus!=='0'">查看</el-button>
                <el-button icon="el-icon-edit" size="small" type="text"  @click="edit(scope.row)" v-if="scope.row.flowStatus==='0'">编辑</el-button>
                <el-button icon="el-icon-s-flag" size="small" type="text"  @click="check(scope.row)"  v-if="scope.row.flowStatus!=='0'">查看审批</el-button>
                <el-button icon="el-icon-delete" size="small" type="text"  @click="del(scope.row)" style="color:red" v-if="scope.row.flowStatus==='0'">删除</el-button>
            </template>
        </avue-crud>
        <el-dialog
            :title="bar"
            top='20px'
            :visible.sync="dialogVisible"
            append-to-body
            width="75%"
            :close-on-click-modal='false'>
              <addDialog ref="addLog" :api='api' :turnoff='turnoff'/>
        </el-dialog>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>
<script>
import diaVisLog from '../../work/dialog'
import addDialog from "./components/archivesAdd";
import { list,delArchival} from "@/api/biz/officce/archives";
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
    open() {
      this.dialogVisible=true
      this.bar='新增 档案借阅'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 档案借阅'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 档案借阅'
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
            field: "useMethod",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.useMethod,
                upperValue: ""
              }
            ]
          },
          {
            field: "archivalTypeId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.archivalTypeId,
                upperValue: ""
              }
            ]
          },
          {
            field: "actualReturnDate",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.actualReturnDate,
                upperValue: ""
              }
            ]
          },
          {
            field: "oddNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.oddNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "stampNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.stampNum,
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
          delArchival(row.id).then(res => {
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
              type: "radio",
              prop: "useMethod",
              label: "利用方式:",
              placeholder: "请选择利用方式",
              list:[
                  {
                      label:'查看',value:'1'
                  },
                  {
                      label:'复印',value:'2'
                  },
                  {
                      label:'扫描',value:'3'
                  },
                  {
                      label:'借阅',value:'4'
                  },
              ]
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "archivalTypeId",
              label: "档案类型:",
              placeholder: "请输入关键字",
              url:'api/blade-biz/archival-type/archivalTypeBySearch?search='
            }
          ],
          [
            {
              type: "date",
              queryType:'1',
              prop: "actualReturnDate",
              label: "实际归还日期:",
              placeholder: "请选择实际归还日期"
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "oddNum",
              label: "单号:",
              placeholder: "请输入关键字",
              url:'api/blade-system/dept/deptByLabel?search='
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "stampNum",
              label: "盖章份数:",
              placeholder: "请输入盖章份数"
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
            label: "利用方式",
            prop: "useMethod",
            type:'redio',
            dicData:[
              {
                label: "档案类型",
                prop: "archivalType",
                width: 150
              },
              {
                      label:'查看',value:'1'
                  },
                  {
                      label:'复印',value:'2'
                  },
                  {
                      label:'扫描',value:'3'
                  },
                  {
                      label:'借阅',value:'4'
                  },
            ],
            width: 150
          },
          {
            label: "单号",
            prop: "oddNum",
          },
          {
            label: "盖章份数",
            prop: "stampNum",
            width: 150
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
            label: "预计归还日期",
            prop: "expectReturnDate",
            width: 150
          },
          {
            label: "实际归还日期",
            prop: "actualReturnDate",
            width: 150
          },
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
