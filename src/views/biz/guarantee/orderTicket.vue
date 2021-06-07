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
            :close-on-press-escape="false">
            <div slot="title" class="avue-crud__dialog__header">
              <span class="el-dialog__title">{{ bar }}</span>
              <div class="avue-crud__dialog__menu">
                <i
                  @click="handleFullScreen"
                  class="el-dialog__close el-icon-full-screen"
                ></i>
              </div>
            </div>
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;">
                <addDialog ref="addLog" :api='api' :turnoff='turnoff'/>
            </div>
        </el-dialog>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>
<script>
import diaVisLog from '../../work/dialog'
import addDialog from "./components/orderTicketAdd";
import { list,deletedById} from "@/api/biz/guarantee/orderTicket";
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
      this.$refs.sonV.confirmProcess(true,row,0,'')
    },
    open() {
      this.dialogVisible=true
      this.bar='新增 委托单'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 委托单'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 委托单'
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
                operator: "BT",
                lowerValue: val.entrustDate?val.entrustDate[0]:'',
                upperValue: val.entrustDate?val.entrustDate[1]:''
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
    del(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletedById(row.id).then(res => {
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
      fullscren:false,
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
              queryType:'2',
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
            label: '委托单号',
            prop: 'entrustCode',
            width:120,
            },
            {
            label: '委托人姓名',
            prop: 'createUserName',
            width:100,
            },
            {
            label: '委托部门',
            prop: 'createDeptName',
            width:200,
            },
            {
            label: '委托时间',
            prop: 'createTime',
            width:150
            },
            {
            label: '试验名称',
            prop: 'testType',
            width:150
            },
            {
              label:'样品信息',
              prop:'templateInfo',
              width:300
            },
            {
              label:'样品数量',
              prop:'fanTotal',
              width:120
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
