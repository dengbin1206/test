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
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;">
                <addDialog ref="addLog" :api='api' :turnoff='turnoff'/>
            </div>
        </el-dialog>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>
<script>
import diaVisLog from '../../work/dialog'
import addDialog from "./components/shhfAdd";
import { list,deletedById } from "@/api/biz/cs/shhf";
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
      this.bar='新增 售后回访'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,this.hfId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 售后回访'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,this.hfId,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 售后回访'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,this.hfId,3);
      }, 10);
    },
    turnoff(){
      this.dialogVisible=false
      this.api()
    },
    handleClose(){
      localStorage.removeItem('hfdj');
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
            field: "relateFormId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.relateFormId,
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
            field: "serviceEngineerId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.serviceEngineerId,
                upperValue: ""
              }
            ]
          },
          {
            field: "afterServiceResult",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.afterServiceResult,
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
            field: "createUser",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.createUser,
                upperValue: ""
              }
            ]
          },
          {
            field: "createTime",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.createTime,
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
  activated() {
    this.api();
    if(localStorage.getItem('hfdj')){
      this.hfId=JSON.parse(localStorage.getItem('hfdj')).hfId
      this.open()
    };
  },
  data() {
    return {
      hfId:'',
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
              queryType:'1',
              prop: "paperContractNo",
              label: "合同号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/contract/paperNumByLabel?search='
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "relateFormId",
              label: "关联单据:",
              placeholder: "请输入关键字",
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
              queryType:'1',
              prop: "serviceEngineerId",
              label: "服务工程师:",
              placeholder: "请输入关键字",
              url:'api/blade-user/getUserInfoBySearch?search='
            },
          ],
          [
            {
                type: "input",
                prop:'afterServiceResult',
                label:'售后服务结果',
                placeholder:'请输入售后服务结果'
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "oddNum",
              label: "申请号:",
              placeholder: "请输入关键字",
              url:'api/blade-cs/after-sale/oddNumByLabel?search='
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "createUser",
              label: "创建人:",
              placeholder: "请输入关键字",
              url:'api/blade-user/getUserInfoBySearch?search='
            },
            {
              type: "datetime",
              queryType: "1",
              prop: "createTime",
              label: "创建时间:",
              placeholder: "请选择创建时间"
            }
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
            label: "合同号",
            prop: "paperContractNo",
            width: 150
          },
          {
            label: "关联单据",
            prop: "relateForm",
            width: 150
          },
          {
            label: "客户名称",
            prop: "clientName",
            width: 150
          },
          {
            label: "服务工程师",
            prop: "serviceEngineer",
            width: 150
          },
          {
            label: "售后服务结果",
            prop: "afterServiceResult",
            width: 150
          },
          {
            label: "客户联系人",
            prop: "contactPersonName",
            width: 150
          },
          {
            label: "联系电话",
            prop: "telephone",
            width: 150
          },
          {
            label: "客户详细地址",
            prop: "detailAddress",
            width: 150
          },
          {
            label: "申请号",
            prop: "oddNum",
            width: 150
          },
          {
            label: "创建人",
            prop: "createUserName",
          },
          {
            label: "创建时间",
            prop: "createTime",
            width: 150
          },
          {
            label: "服务态度和质量",
            prop: "giveService",
            type: "select",
            width: 150,
            dicUrl: `/api/blade-system/dict-biz/dictionary?code=cs_fwtd`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "人员技能",
            prop: "personSkill",
            type: "select",
            width: 150,
            dicUrl: `/api/blade-system/dict-biz/dictionary?code=cs_fwtd`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "服务及时性",
            prop: "timelyService",
            type: "select",
            width: 150,
            dicUrl: `/api/blade-system/dict-biz/dictionary?code=cs_fwtd`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "综合得分",
            prop: "synthesizeScore",
            type: "select",
            width: 150,
            dicUrl: `/api/blade-system/dict-biz/dictionary?code=cs_fwtd`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
