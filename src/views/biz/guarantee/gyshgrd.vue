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
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
                <addDialog ref="addLog" :api='api' :turnoff='turnoff'/>
            </div>
        </el-dialog>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>
<script>
import { getDictBizByCode} from "@/api/system/dict";
import diaVisLog from '../../work/dialog'
import addDialog from "./components/gyshgrdAdd";
import { list,deletedById} from "@/api/biz/guarantee/gyshgrd";
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
      this.bar='新增 供应商合格认定'
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId,1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible=true
      this.bar='编辑 供应商合格认定'
      setTimeout(() => {
        this.$refs.addLog.open(row.id,2);
      }, 10);
    },
    look(row) {
      this.dialogVisible=true
      this.bar='查看 供应商合格认定'
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
            field: "supplierName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.supplierName,
                upperValue: ""
              }
            ]
          },
          {
            field: "natureOfEnterprise",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.natureOfEnterprise,
                upperValue: ""
              }
            ]
          },
          {
            field: "materialClassify",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.materialClassify,
                upperValue: ""
              }
            ]
          },
          {
            field: "contractType",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.contractType,
                upperValue: ""
              }
            ]
          },
          {
            field: "resultRight",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.resultRight,
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
    },
    getmaterialClassify() {
      getDictBizByCode("material_category").then(res => {
        this.materialClassifys = res.data.data;
        this.searchOption.rows[1][0].list = this.materialClassifys;
      });
    },
    getcontractType() {
      getDictBizByCode("assign_type").then(res => {
        this.contractTypes = res.data.data;
        this.searchOption.rows[1][1].list = this.contractTypes;
      });
    },
    getnatureOfEnterprise() {
      getDictBizByCode("enterprise_nature").then(res => {
        this.natureOfEnterprises = res.data.data;
        this.searchOption.rows[0][1].list = this.natureOfEnterprises;
      });
    },
    getresultRight() {
      getDictBizByCode("result_cognizance").then(res => {
        this.resultRights = res.data.data;
        this.searchOption.rows[2][0].list = this.resultRights;
      });
    }
  },
  created() {
    this.api();
    this.getmaterialClassify()
    this.getcontractType()
    this.getnatureOfEnterprise()
    this.getresultRight()
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
      data: [],
      materialClassifys:[],
      contractTypes:[],
      natureOfEnterprises:[],
      resultRights:[],
      selectQuery: "",
      clickquery: "",
      searchOption: {
        rows: [
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "supplierName",
              label: "供应商名称:",
              placeholder: "请输入关键字",
              url:'/api/blade-crm/confirm/supplierNameByLabel?search='
            },
            {
              type: "select",
              queryType:'1',
              prop: "natureOfEnterprise",
              label: "供应商类别:",
              placeholder: "请选择供应商类别",
              list:this.natureOfEnterprises
            },
          ],
          [
            {
              type: "select",
              queryType: "1",
              prop: "materialClassify",
              label: "供应物资分类:",
              placeholder: "请选择供应物资分类",
              list:this.materialClassifys
            },
            {
              type: "select",
              queryType: "1",
              prop: "contractType",
              label: "评审类型:",
              placeholder: "请选择评审类型",
              list:this.contractTypes
            }
          ],
          [
            {
              type: "select",
              queryType: "1",
              prop: "resultRight",
              label: "结果认定:",
              placeholder: "请选择结果认定",
              list:this.resultRights
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "oddNum",
              label: "认定申请号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/confirm/oddNumByLabel?search='
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
            label: '供应商名称',
            prop: 'supplierName',
            width:220,
            },
            {
            label: '供应商类别',
            type:'select',
            prop: 'natureOfEnterprise',
            width:120,
            dicUrl:'/api/blade-system/dict-biz/dictionary?code=enterprise_nature',
            props:{
                label:'dictValue',
                value:'dictKey'
            }
            },
            {
            label: '供应商标的',
            prop: 'supplierMarks',
            width:180,
            },
            {
            label: '供应物资分类',
            prop: 'materialClassify',
            width:120,
            dicUrl:'/api/blade-system/dict-biz/dictionary?code=enterprise_nature',
            props:{
                label:'dictValue',
                value:'dictKey'
            }
            },
            {
            label: '评审类型',
            prop: 'contractType',
            width:100,
            dicUrl:'/api/blade-system/dict-biz/dictionary?code=assign_type',
            props:{
                label:'dictValue',
                value:'dictKey'
            }
            },
            {
            label: '有效开始日期',
            prop: 'startValid',
            width:150
            },
            {
            label: '有效截至日期',
            prop: 'untilValid',
            width:150
            },
            {
            label: '结果认定',
            prop: 'resultRight',
            width:150,
            type:'select',
            dicData:[{
                label:'合格',
                value:'1'
            },{
                label:'不合格',
                value:'2'
            }]
            },
            {
            label: '认定申请号',
            prop: 'oddNum',
            width:150
            },
            {
            label: '创建人',
            prop: 'createUserName',
            width:150
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
