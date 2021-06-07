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
        <el-button type="primary" icon="el-icon-plus" size="small" @click.stop="handleAdd()">新增</el-button>
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
          :disabled="scope.row.flowStatus != '0' "
          type="text"
          @click="bondDetail(scope.row)"
        >编 辑</el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          type="text"
          style="color:red"
          v-if="scope.row.flowStatus == '0' "
          @click="bondDelete(scope.row)"
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
      <applyTqkpAdd
        ref="applyTqkpAdd"
        @api="api"
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
      />
    </div>
    </el-dialog>
    <diaVisLog ref="outSonV"></diaVisLog>
  </basic-container>
</template>
<script>
import fileUpload from "@/components/fileUpload";
import {
  getList,
  submit,
  getUserName,
  getProjectNumber,
  getFixedValue,
  getDetail,
  remove,
  advanceReturn,
  advanceReturnSubmit,
  getContractCode,
  getCustomerName,
  flowList
} from "@/api/biz/crm/applyAdvanceBill";
import { mapGetters } from "vuex";
import { startFlow } from "@/api/tool/dynamic";
import applyTqkpAdd from "./components/applyTqkpAdd";
import diaVisLog from "../../work/dialog";
import { modelByName } from "@/api/biz/sbgl";
export default {
  components: {
    fileUpload,
    applyTqkpAdd,
    diaVisLog
  },
  data() {
    return {
      title: "",
      fullscren: false,
      dialogVisible: false, //新增修改弹框
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      selectionList: [], //表格多选数据
      selectQuery: {}, //查询条件
      clickquery: "",
      data: [], // 表格数据
      searchOption: {
        rows: [
          [
            {
              type: "fuzzySearch",
              prop: "contractCode",
              queryType: "1",
              label: "纸质合同号:",
              placeholder: "请输入纸质合同号",
              url: "/api/blade-crm/contract/paperNumByLabel?search=",
              data: []
            },
            {
              type: "select",
              queryType: "1",
              prop: "bidder",
              label: "开票单位:",
              placeholder: "请选择开票单位",
              list: []
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "invoiceCode",
              label: "单号:",
              placeholder: "请输入单号"
            }
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
        menuWidth: 220,
        index: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "纸质合同号",
            prop: "contractCode",
            width: 120
          },
          {
            label: "开票单位",
            prop: "invoiceUnit",
            width: 120,
            dicData: [],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "单号",
            prop: "invoiceCode",
            width: 100
          },
          {
            label: "预计发货日期",
            prop: "expectedDeliverDate",
            width: 100
          },
          {
            label: "排单日期",
            prop: "listDate",
            width: 100
          },
          {
            label: "发票种类",
            prop: "invoiceStatus"
          },
          {
            label: "申请开票金额",
            prop: "invoiceAmount",
            width: 100
          },
          {
            label: "要求开票日期",
            prop: "invoiceDate",
            width: 100
          },
          {
            label: "预计回款金额",
            prop: "paymentAmount",
            width: 100
          },
          {
            label: "预计回款日期",
            prop: "paymentDate",
            width: 100
          },
          {
            label: "(金税)实际开票金额",
            prop: "actualInvoiceAmount"
          },
          {
            label: "实际税额",
            prop: "actualTaxAmount"
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            slot: true,
            width: 120
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
    // this.searchOption.rows[2][1].list = this.djzt;
    this.api();
    this.getDicts("company").then(res => {
      this.company = res.data.data;
      this.searchOption.rows[0][1].list = res.data.data;
      this.option.column[1].dicData = res.data.data;
    });

    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    //新增弹框打开
    handleAdd() {
      this.dialogVisible = true;
      this.title = "新增 申请提前开票";
      this.$nextTick(() => {
        this.$refs.applyTqkpAdd.add();
      });
    },
    //查看审批
    viewApproval(row) {
      modelByName("CRM_TQKP").then(res => {
        if (res.data.code == 200) {
          flowList(res.data.data.id, row.id).then(res => {
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
          });
        }
      });
    },
    //关闭弹框
    close() {
      this.$refs.applyTqkpAdd.closeValidate();
    },
    closeDialog() {
      this.dialogVisible = false;
      this.api();
    },
    //编辑
    bondDetail(row) {
      this.dialogVisible = true;
      this.title = "编辑 申请提前开票";
      this.$nextTick(() => {
        this.$refs.applyTqkpAdd.detail(row.id);
      });
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
      if (number == 7) {
        return "warning";
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
      if (number == 7) {
        return "待提交变更审批";
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
    bondDelete(row) {
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
@import url("../../../styles/biz/crm/gift.css");
</style>