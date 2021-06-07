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
          :disabled="scope.row.flowStatus != '0'"
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
      v-if="dialogVisible"
      :fullscreen="fullscren" 
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
      <customerJdAdd ref="customerJdAdd" @api="api" :dialogVisible="dialogVisible"   @closeDialog="closeDialog"/>
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
  getContractCode,
  getCustomerName,
} from "@/api/biz/crm/customerReception";
import { mapGetters } from "vuex";
import {
  flowList
} from "@/api/tool/dynamic";
import fileUpload from "@/components/fileUpload";
import { startFlow } from "@/api/tool/dynamic";
import customerJdAdd from "./components/customerJDAdd";
import diaVisLog from "../../work/dialog";
import { modelByName } from "@/api/biz/sbgl";
import { setTimeout } from "timers";
export default {
  components: {
    fileUpload,
    customerJdAdd,
     diaVisLog
  },
  data() {
    return {
      fullscren: false,
      loading: false,  
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
              type: "select",
              queryType: "1",
              prop: "visitPurpose",
              label: "来访目的:",
              placeholder: "请选择来访目的",
              list:[]
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "contractCode",
              label: "纸质合同号:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/contract/paperNumByLabel?search='
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "customerName",
              label: "客户名称:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/customer/blurrySelect?search='
            },
            {
              type: "date",
              queryType: "1",
              prop: "plannedVisitDate",
              label: "计划来访日期:",
              placeholder: "请输入计划来访日期"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "visitCode",
              label: "来访单号:",
              placeholder: "请输入来访单号",
            },
            {
              type: "fuzzySearch",
              queryType:'1',
              prop: "userId",
              label: "负责员工:",
              placeholder: "请输入关键字",
              url:'api/blade-user/getUserInfoBySearch?search='
            }
          ],
           [
             {
              type: "fuzzySearch",
              queryType: "1",
              prop: "deptId",
              label: "部门:",
              placeholder: "请输入关键字",
              url:'api/blade-system/dept/deptByLabel?search='
            },
           {
              type: "date",
              queryType: "1",
              prop: "createTime",
              label: "创建时间:",
              placeholder: "请输入创建时间"
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
        menuWidth: 220,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "来访目的",
            prop: "visitPurpose",
            width:100,
            dicData:[],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "纸质合同号",
            prop: "contractCode",
            width:160
          },
          {
            label: "客户名称",
            prop: "customerName",
            width:160
          },
          {
            label: "计划来访日期",
            prop: "plannedVisitDate",
            width:140
          },
          {
            label: "计划结束日期",
            prop: "plannedEndDate",
            width:140
          },
          {
            label: "经理室人员陪同",
            prop: "managerReception",
            type: "radio",
            dicData: [
              {
                dictKey: "2",
                dictValue: "需要"
              },
              {
                dictKey: "1",
                dictValue: "不需要"
              }
            ],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
           {
            label: "创建时间",
            prop: "createTime",
            width:140
          },
           {
            label: "审批状态",
            prop: "flowStatus",
            slot: true,
            width:140
          },
          {
            label: "审批结束时间",
            prop: "flowEndDate",
            width:140
          },
          {
            label: "本次接待总费用",
            prop: "receptionTotalCost"
          },
          {
            label: "礼品费",
            prop: "actualGiftCost"
          },
          
        ]
      },
      
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
    this.getDicts("crm_visit_purpose").then(res => {
      this.visitPurpose = res.data.data;
      this.searchOption.rows[0][0].list = res.data.data;
      this.option.column[0].dicData = res.data.data;
    });
    
  },
  methods: {
     handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    handleAdd() {
         this.dialogVisible = true;
      this.title = "新增 客户接待";
      // this.$nextTick(()=>{
      //  this.$refs.customerJdAdd.add();
      // })
      setTimeout(() => {
        this.$refs.customerJdAdd.add();
      }, 10);
     },
    //查看审批
    viewApproval(row){
      modelByName("CRM_KHJD").then(res => {
        if (res.data.code == 200) {
           flowList(res.data.data.id, row.id).then(res => {
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
        });
        }
      });
      
    },
    //关闭弹框
    close() {
      this.$refs.customerJdAdd.closeValidate();
    },
    closeDialog(){
     this.dialogVisible = false;
     this.api()
   },
  
    //编 辑
    detail(row) {
      this.dialogVisible = true;
      this.title = "编辑 客户接待";
      this.$nextTick(()=>{
          this.$refs.customerJdAdd.detail(row.id)
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
    },
  }
};
</script>
<style scoped>
</style>