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
            <template slot-scope="scope" slot="fileNameForm">
                <span v-if="scope.row.wordContent=='1'||scope.row.wordContent=='3'">{{scope.row.wordName}}</span>
                <span v-if="scope.row.wordContent=='2'">{{scope.row.fileName}}</span>
            </template>
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
            :close-on-press-escape="false"
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
import addDialog from "./components/glzdsqfbAdd";
import { list,delManage } from "@/api/biz/officce/glzd";
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
      this.bar='新增 管理制度申请发布'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 管理制度申请发布'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 管理制度申请发布'
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
            field: "wordContent",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.wordContent,
                upperValue: ""
              }
            ]
          },
          {
            field: "wordName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.wordName,
                upperValue: ""
              }
            ]
          },
          {
            field: "wordRank",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.wordRank,
                upperValue: ""
              }
            ]
          },
          {
            field: "updatedVer",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.updatedVer,
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
          delManage(row.id).then(res => {
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
              type: "radio",
              prop: "wordContent",
              label: "文件内容:",
              placeholder: "请选择文件内容",
              list:[
                  {
                      label:'变更',value:'1'
                  },
                  {
                      label:'追加',value:'2'
                  },
                  {
                      label:'废弃',value:'3'
                  }
              ]
            },
            {
              type: "input",
              queryType: "1",
              prop: "wordName",
              label: "文件名称:",
              placeholder: "请输入文件名称"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "wordRank",
              label: "文件等级:",
              placeholder: "请输入文件等级"
            },
            {
              type: "input",
              queryType: "1",
              prop: "updatedVer",
              label: "变更后版本:",
              placeholder: "请输入变更后版本"
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "oddNum",
              label: "单号:",
              placeholder: "请输入关键字",
              url:'api/blade-system/dept/deptByLabel?search='
            },
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 170,
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
            label: "文件编号",
            prop: "wordCode",
            width: 200
          },
          {
            label: "文件内容",
            prop: "wordContent",
            type:'radio',
            dicData:[{
                      label:'变更',value:'1'
                  },
                  {
                      label:'追加',value:'2'
                  },
                  {
                      label:'废弃',value:'3'
                  }],
            width: 130
          },
          {
            label: "文件名称",
            prop: "fileName",
            width: 200,
            formslot:true
          },
          {
            label: "单号",
            prop: "oddNum",
          },
          {
            label: "文件等级",
            prop: "wordRank",
            width: 130
          },
          {
            label: "变更后版本",
            prop: "updatedVer"
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
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
