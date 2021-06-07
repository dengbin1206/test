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
        <el-button icon="el-icon-edit" size="small"  :disabled="scope.row.flowStatus != '0'"  type="text" @click="detail(scope.row)">编 辑</el-button>
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
    <div style="height:75vh;overflow-y:auto;overflow-x: hidden; ">
     <giftAdd ref="giftAdd" @api="api" :dialogVisible="dialogVisible"   @closeDialog="closeDialog"/>
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
  getArea,
  getUserName,
  remove,
  queryFormInfo,
  getCustomerName,
} from "@/api/biz/crm/gift";
import { mapGetters } from "vuex";
import {
  flowList
} from "@/api/tool/dynamic";
import fileUpload from "@/components/fileUpload";
import { startFlow } from "@/api/tool/dynamic";
import giftAdd from "./components/giftAdd";
import diaVisLog from "../../work/dialog";
import { modelByName } from "@/api/biz/sbgl";
export default {
  components: {
    fileUpload,
    giftAdd,
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
              type: "fuzzySearch",
              prop: "userId",
              label: "申请员工:",
              queryType: "1",
              placeholder: "请输入申请员工",
              url: "/api/blade-user/userBySearch?search=",
              data: []
            },
            {
              type: "input",
              queryType: "1",
              prop: "deptId",
              label: "部门:",
              placeholder: "请输入部门"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "giftNumber",
              label: "礼品申请号:",
              placeholder: "请输入礼品申请号"
            },
            {
              type: "input",
              queryType: "1",
              prop: "createUser",
              label: "创建人:",
              placeholder: "请输入创建人"
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
        menuWidth: 220,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "礼品到位日期",
            prop: "giftArrivalDate"
          },
          {
            label: "礼品费",
            prop: "giftCost"
          },
          {
            label: "礼品申请单号",
            width:160,
            prop: "giftNumber"
          },
          {
            label: "申请员工",
            prop: "userName"
          },
          {
            label: "部门",
            prop: "deptName",
             width:180,
          },
           {
            label: "费用承担",
            prop: "costBearing",
            type: "select",
            dicData: [
              {
                dictKey: "0",
                dictValue: "个人"
              },
              {
                dictKey: "1",
                dictValue: "部门"
              }
            ],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
            {
            label: "是否邮寄",
            prop: "giftMail",
            type: "radio",
            dicData: [
              {
                dictKey: "0",
                dictValue: "不需要"
              },
              {
                dictKey: "1",
                dictValue: "需要"
              }
            ],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
           {
            label: "审批状态",
            prop: "flowStatus",
            slot:true
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
    },
  },
  created() {
    this.api(); 
    this.getmodels('flow_status').then(res => {
      this.flowStatus = res.data.data;
      this.searchOption.rows[2][1].list = res.data.data;
    }); 
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    handleAdd() {
      this.dialogVisible = true;
      this.title = "新增 礼品申请";
      this.$nextTick(()=>{
       this.$refs.giftAdd.add();
      })
    },
    //查看审批
    viewApproval(row){
      modelByName("CRM_LPSQ").then(res => {
        if (res.data.code == 200) {
           flowList(res.data.data.id, row.id).then(res => {
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
        });
        }
      });  
    },
    //关闭弹框
    close() {
      this.$refs.giftAdd.closeValidate();
    },
    closeDialog(){
     this.dialogVisible = false;
     this.api()
   },
    //编 辑
    detail(row) { 
      this.dialogVisible = true;
       this.title = "编辑 礼品申请";
      this.$nextTick(()=>{
          this.$refs.giftAdd.detail(row.id)
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