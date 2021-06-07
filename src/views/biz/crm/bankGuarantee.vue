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
      <template slot-scope="scope" slot="menuLeft">
        <el-button type="primary" icon="el-icon-plus" size="small" @click.stop="handleAdd()">新 增</el-button>
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain @click="handleDelete">删 除</el-button> -->
      </template>
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
        <el-button
          icon="el-icon-edit"
          size="small"
          type="text"
          :disabled="scope.row.flowStatus != '0' "
          @click="detail(scope.row)"
        >编 辑</el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          type="text"
          style="color:red"
           v-if="scope.row.flowStatus == '0' "
          @click="Delete(scope.row)"
        >删 除</el-button>
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
      <span class="el-dialog__title">{{ title }}</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
    <div style="height:75vh;overflow-y:auto;overflow-x: hidden;">
      <bankBH ref="bankBHAdd" @api="api" :dialogVisible="dialogVisible"  @open="open" @closeDialog="closeDialog"/>
    </div>
    </el-dialog>
    <diaVisLog ref="outSonV"></diaVisLog>
  </basic-container>
</template>

<script>
import {
  submit,
  getList,
  getDetail,
  getFixedValue,
  getUserName,
  remove,
  getCustomerName,
  getProjectNumber,
  getPaperContract,
  flowList
} from "@/api/biz/crm/guarantee";
import { mapGetters } from "vuex";
import fileUpload from "@/components/fileUpload";
import bankBH from "./components/bankGuaranteeAdd";
import diaVisLog from "../../work/dialog";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
export default {
  components: {
    fileUpload,
    bankBH,
    diaVisLog
  },
  data() {
    return {   
      loading: false,
      fullscren: false,
      clickquery: "",
      title: "",
      selectQuery: {}, //查询条件
      dialogVisible: false, //新增修改弹框
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      selectionList: [],
      data: [],
      searchOption: {
        rows: [
          [
            {
              type: "input",
              prop: "projectCode",
              label: "项目报登号:",
              placeholder: "请输入项目报登号",
              queryType: "1"
            },
            {
              type: "input",
              queryType: "1",
              prop: "guaranteeNumber",
              label: "单号:",
              placeholder: "请输入单号"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "contractCode",
              label: "纸质合同号:",
              placeholder: "请输入纸质合同号"
            },
            {
              type: "fuzzySearch",
              prop: "userId",
              queryType: "1",
              label: "申请员工:",
              placeholder: "请输入申请员工",
              url: "/api/blade-user/userBySearch?search=",
              data: []
            }
          ],
          [
            {
              type: "date",
              queryType: "1",
              prop: "createTime",
              label: "创建时间:",
              placeholder: "请输入创建时间"
            },
            {
              type: "select",
              queryType: "1",
              prop: "flowStatus",
              label: "审批状态:",
              placeholder: "请选择审批状态",
              list: []
            }
          ]
        ]
      },
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        tip: false,
        align: "center",
        border: true,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        viewBtn: false,
        selection: true,
        menuWidth: 220,
        dialogClickModal: false,
        column: [
          {
            label: "项目报登号",
            prop: "projectCode"
          },
          {
            label: "纸质合同号",
            prop: "contractCode",
            width:120
          },
          {
            label: "合同总金额",
            prop: "contractTotalAmount",
            width:100
          },
          {
            label: "保函性质",
            prop: "guaranteeQuality",
            type: "select",
            dicData: [
              {
                dictKey: "0",
                dictValue: "履约保函"
              },
              {
                dictKey: "1",
                dictValue: "预付款保函"
              },
              {
                dictKey: "2",
                dictValue: "质量保函"
              },
              {
                dictKey: "3",
                dictValue: "质保金保函"
              },
              {
                dictKey: "4",
                dictValue: "信用证"
              }
            ],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "受益方",
            prop: "customerName"
          },
          {
            label: "申请员工",
            prop: "userName"
          },
          {
            label: "部门",
            prop: "deptName"
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            slot: true
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  created() {
    this.api();
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
      this.searchOption.rows[2][1].list = res.data.data;
    });
  },
  mounted() {},
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    handleAdd() {
      this.dialogVisible = true;
      this.title = "新增 银行保函";
      this.$nextTick(()=>{
       this.$refs.bankBHAdd.add();
      })
    },
    //查看审批
    viewApproval(row){
      modelByName("CRM_YHBH").then(res => {
        if (res.data.code == 200) {
           flowList(res.data.data.id, row.id).then(res => {
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
        });
        }
      });
      
    },
    //关闭弹框
    close() {
      this.$refs.bankBHAdd.closeValidate();
      
    },
    closeDialog(){
     this.dialogVisible = false;
     this.api()
   },
   open(){
     this.dialogVisible = true;
   },
    //编 辑
    detail(row) {

       this.dialogVisible = true;
      this.title = "编辑 银行保函";

      this.$nextTick(()=>{
          this.$refs.bankBHAdd.detail(row.id)
      })
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
    //行删除
    Delete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.api();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    //批量删除
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.api();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
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
};
</script>
   
<style scoped>
</style>