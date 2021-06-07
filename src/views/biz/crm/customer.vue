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
        <el-button
          type="primary"
          icon="el-icon-s-promotion"
          size="small"
          :disabled="selectionList.length!=1"
          @click.stop="Approval()"
        >转正审批</el-button>
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
          :disabled="scope.row.flowStatus != '0' && scope.row.flowStatus != '2' && scope.row.flowStatus != '5'" 
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
      :title="title"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
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
     <customerAdd ref="customerAdd" @api="api" :dialogVisible="dialogVisible"  @closeDialog="closeDialog"/>
    </div>
    </el-dialog>
    <el-dialog
  title="查看流程"
  :visible.sync="flowDialog"
  width="75%"
  append-to-body
  :close-on-click-modal="false"
  :close-on-press-escape="false">
  <avue-crud
  :data="flowData"
      :option="flowOption"
      ref="flowCrud"
      :table-loading="flowLoading" 
  >
   <template slot="flowStatus" slot-scope="scope">
        <el-tag :type="getFlowStatus(scope.row.flowStatus)">{{getLabel(scope.row.flowStatus)}}</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-edit"
          size="small"
          type="text"  
          @click="seeApproval(scope.row)"
        >查看审批</el-button>
      </template>
  </avue-crud>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="flowDialog = false" icon="el-icon-circle-close">取 消</el-button>
    <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
  </span>
  <diaVisLog ref="outSonV"></diaVisLog>
</el-dialog>
  </basic-container>
</template>
<script>
import {
  submit,
  getList,
  getDetail,
  getFixedValue,
  getArea,
  getIndustry,
  getUserName,
  remove,
  queryFormInfo,
  getFlowHistory
} from "@/api/biz/crm/customer";
import { mapGetters } from "vuex";
import {
  flowList
} from "@/api/tool/dynamic";
import customerAdd from "./components/customerAdd";
import fileUpload from "@/components/fileUpload";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
import diaVisLog from "../../work/dialog";
export default {
  components: {
    fileUpload,
    customerAdd,
    diaVisLog
  },
  data() {
    return {
      fullscren: false,
      flowData:[],
      flowLoading:false,
      loading: false,
      clickquery: "",
      title: "",
      selectQuery: {}, //查询条件
      dialogVisible: false, //新增修改弹框
      flowDialog:false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
     
      selectionList: [],
      khlx: [
        {
          label: "正式",
          value: "1"
        },
        {
          label: "潜在",
          value: "2"
        }
      ],
      khzt: [
        {
          label: "正常",
          value: "1"
        },
        {
          label: "冻结",
          value: "2"
        }
      ],
      data: [],
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "customerCode",
              label: "客户编码:",
              placeholder: "请输入客户编码"
            },
            {
              type: "input",
              queryType: "1",
              prop: "customerName",
              label: "客户名称:",
              placeholder: "请输入客户名称"
            }
          ],
          [
            {
              type: "fuzzySearch",
              prop: "userId",
              queryType: "1",
              label: "负责员工:",
              placeholder: "请输入负责员工",
              url: "/api/blade-user/userBySearch?search=",
              data: []
            },
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "创建日期:",
              placeholder: "请输入创建日期"
            }
          ],
          [
            {
              type: "select",
              queryType: "1",
              prop: "postName",
              label: "客户类型:",
              placeholder: "请输入客户类型",
              list: this.khlx
            },
            {
              type: "checkbox",
              prop: "customerStatus",
              label: "客户状态:",
              list: this.khzt
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
            label: "负责员工",
            prop: "userName"
          },
          {
            label: "客户编号",
            prop: "customerCode"
          },
          {
            label: "客户名称",
            prop: "customerName"
          },
          {
            label: "行业",
            prop: "industry",
            type: "select",
            dicData: [],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "客户状态",
            prop: "customerStatus",
            type: "radio",
            dicData: [
              {
                dictKey: "1",
                dictValue: "正常"
              },
              {
                dictKey: "2",
                dictValue: "冻结"
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
            slot: true
          },
        ]
      },
      flowOption: {
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
        menuWidth: 120,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "负责员工",
            prop: "userName"
          },
          {
            label: "客户编号",
            prop: "customerCode"
          },
          {
            label: "客户名称",
            prop: "customerName"
          },
          {
            label: "行业",
            prop: "industry",
            type: "select",
            dicData: [],
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "客户状态",
            prop: "customerStatus",
            type: "radio",
            dicData: [
              {
                dictKey: "1",
                dictValue: "正常"
              },
              {
                dictKey: "2",
                dictValue: "冻结"
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
            slot: true
          },
          {
            label: "审批结束时间",
            prop: "flowCompletedTime",
            width:120
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
    this.searchOption.rows[2][0].list = this.khlx;
    this.searchOption.rows[2][1].list = this.khzt;
    this.api();
    getIndustry("industry", "-1").then(res => {
      this.industry = res.data.data;
      this.option.column.find(item => item.prop == "industry").dicData =
        res.data.data;
    });
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    handleAdd() {
      this.dialogVisible = true;
      this.title = "新增 客户主数据";
      this.$nextTick(()=>{
       this.$refs.customerAdd.add();
      })
    },
    viewApproval(row){
      this.flowDialog = true;
      this.flowLoading = true;
      getFlowHistory(row.id).then(res=>{
        this.flowData = res.data.data;
        this.flowLoading = false;
      })
    },
      //查看审批
    seeApproval(row){
       modelByName("CRM_KHZSJ").then(res => {
        if (res.data.code == 200) {
           flowList(res.data.data.id, row.id).then(res => { 
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
        });
        }
      });
    },
    //关闭弹框
    close() {
      this.$refs.customerAdd.closeValidate();
    },
   closeDialog(){
     this.dialogVisible = false;
     this.api()
   },
    //编 辑
    detail(row) {
       this.dialogVisible = true;
      this.title = "编辑 客户主数据";
      this.$nextTick(()=>{
          this.$refs.customerAdd.detail(row.id)
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
    // 转正审批
    Approval() {
      if (this.selectionList[0].customerStatus == "1") {
        this.$message.warning("该客户为正式客户");
        return;
      }
      modelByName("CRM_KHZSJ").then(res => {
        if (res.data.code == 200) {
          let obj = {
            flowKey: "CRM_KHZ_DART",
            formType: "S",
            modelId: res.data.data.id,
            dataId: this.selectionList[0].id,
            variables: {functionPath:this.$route.fullPath}
          };
          startFlow(obj).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
          });
        }
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