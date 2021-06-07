<template>
  <basic-container>
    <!--  查询组件  -->
    <sxSearch
      v-if="showQuery"
      ref="query"
      :searchOption="searchOption"
      @search="search"
    ></sxSearch>
    <!--  列表  -->
    <avue-crud
      :data="dataList"
      class="sx_avue_crud"
      ref="crud"
      :option="option"
      @current-change="currentChange"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      :page.sync="page"
      v-if="option.column.length > 0"
    >
      <!--  表格上按钮  -->
      <template slot="menuLeft">
        <template v-for="(buttonItem, index) in this.buttonList">
          <el-button
            v-if="buttonItem.btnShowInterface.includes('query_interface_btn')"
            :key="index"
            :type="buttonItem.triggerConditions == 4 ? 'danger' : 'primary'"
            size="small"
            :icon="getIcon(buttonItem)"
            @click="buttonClick(buttonItem)"
            >{{ buttonItem.name }}
          </el-button>
        </template>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload2"
          @click="exportExcel"
          >导 出
        </el-button>
      </template>
      <!--  表格操作栏  -->
      <template slot-scope="scope" slot="menu">
        <template v-for="(buttonItem, index) in buttonList">
          <el-button
            v-if="isShowLineBtn(buttonItem, scope.row)"
            :key="index"
            type="text"
            size="small"
            :style="buttonItem.triggerConditions == 4 ? 'color:red' : null"
            :icon="getIcon(buttonItem)"
            @click="lineClick(buttonItem, scope.row)"
            >{{ buttonItem.name }}
          </el-button>
        </template>
      </template>
      <!--  流程状态  -->
      <template :slot="flowStatusProp" slot-scope="scope">
        <el-tag :type="flowStatusType[scope.row[flowStatusProp]]"
          >{{ flowStatusText[scope.row[flowStatusProp]] }}
        </el-tag>
      </template>
    </avue-crud>
    <!--  流程历史审批记录  -->
    <el-dialog
      title="流程历史审批记录"
      append-to-body
      :visible.sync="flowListShow"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table
        :data="flowListData"
        border
        max-height="500px"
        style="width: 100%"
      >
        <el-table-column
          prop="instId"
          label="事务编号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="事务标题"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handelDesign(scope.row, scope.index)"
              >查看审批
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <diaVisLog ref="sonV"></diaVisLog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flowListShow = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <diaVisLog ref="outSonV"></diaVisLog>
    <!--  弹出表单  -->
    <vxe-modal
      v-model="sxFormVisible"
      :title="dialogTitle"
      show-zoom
      resize
      width="75%"
    >
      <div style="height: 75vh">
        <sxForm
          v-if="sxFormVisible"
          :params="params"
          @onCancel="handleClose"
          ref="sxForm"
        ></sxForm>
      </div>
    </vxe-modal>
    <!--  弹出模型  -->

    <!-- 按钮导入 -->

    <vxe-modal v-model="sxImport" title="导入" show-zoom resize width="50%">
      <el-form
        label-position="right"
        label-width="100px"
        :model="formImport"
        size="mini"
        label-suffix=":"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="导入规则">
              <el-radio v-model="radio" label="1">清空历史数据</el-radio>
              <el-radio v-model="radio" label="2">追加</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导入类型">
              <el-radio v-model="radio" label="1">按列序号导入</el-radio>
              <el-radio v-model="radio" label="2">按列名称导入</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="唯一项重复时">
              <el-radio v-model="radio" label="1">跳过</el-radio>
              <el-radio v-model="radio" label="2">更新</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择导入文件">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
              >
                <el-button size="mini" type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </vxe-modal>
  </basic-container>
</template>
<script>
import {
  queryMainFields,
  getList,
  remove,
  startFlow,
  flowList,
} from "@/api/tool/dynamic";
import { getBtnByFunctionPath } from "@/api/system/function";
import diaVisLog from "../work/dialog";
import dialogComponent from "@/components/dialogComponent";
import sxForm from "./sxForm";

export default {
  components: {
    diaVisLog,
    dialogComponent,
    sxForm,
  },
  data() {
    return {
      // 1、表格按钮
      buttonList: [],
      // 2、是否显示查询组件
      showQuery: false,
      // 3、查询组件
      searchOption: [],
      // 4、返回的查询条件：
      extQueryList: [],
      // 5、查询分页
      page: {},
      // 6、主模型id
      mainModelId: "",
      // 7、主模型名
      mainModelName: "",
      // 7.1、主模型描述
      mainModelRemark: "",
      // 8、主模型配置数据
      mainModelConfig: {},
      // 9、AVUE属性
      option: {
        column: [],
      },
      // 10、列表数据
      dataList: [],
      // 11、选中行数据
      selectionList: [],
      // 12、流程状态颜色
      flowStatusType: [
        "info",
        "warning",
        "success",
        "danger",
        "warning",
        "success",
        "danger",
        "info",
      ],
      // 13、流程状态文字
      flowStatusText: [
        "未提交审批",
        "审批中",
        "审批通过",
        "审批作废",
        "变更审批中",
        "变更审批通过",
        "变更审批作废",
        "待提交变更审批",
      ],
      // 14、流程状态Prop名
      flowStatusProp: "",
      // 15、查看审批弹框
      flowListShow: false,
      // 16、查看审批表格
      flowListData: [],
      // 17、表单弹出属性
      sxFormVisible: false,
      // 18、表单弹出标题
      dialogTitle: "新增",
      // 19、表单CODE
      formCode: "",
      // 20、触发事件
      actionType: "",
      // 21、数据ID
      dataId: "",
      // 22、路由地址
      thisRoutePath: "",
      // 23、字段排序
      orderList: [],
      // 24、表单参数
      params: {},
      // 25、导入
      sxImport: false,
      formImport: {},
      radio: ""
    };
  },
  watch: {
    // 监听路由变化
    $route: {
      handler(newVal, oldVal) {
        let arr = [];
        arr = this.$route.path.split("/");
        if (this.$route.path.indexOf("tool/dynamic/M/") != -1) {
          // 初始化数据
          this.clearData();
          // 路由地址
          this.thisRoutePath = this.$route.path;
          // 获取模型名
          arr.forEach((f) => {
            this.mainModelId = f;
          });
          // 初始化查询模型配置
          this.initData();
        } else if (
          this.$route.path.indexOf("tool/dynamic") != -1 ||
          this.$route.path.indexOf("modelAnalysis/modelList") != -1
        ) {
          // 初始化数据
          this.clearData();
          // 路由地址
          this.thisRoutePath = this.$route.path;
          // 获取模型名
          arr.forEach((f) => {
            this.mainModelName = f;
          });
          // 初始化查询模型配置
          this.initData();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 初始化并清空数据
    clearData() {
      // 1、表格按钮
      this.buttonList = [];
      // 2、是否显示查询组件
      this.showQuery = false;
      // 3、查询组件
      this.searchOption = [];
      // 4、查询条件
      this.extQueryList = [];
      // 5、查询分页
      this.page = {
        currentPage: 1,
        pageSize: 10,
        total: null,
      };
      // 6、主模型id
      this.mainModelId = "";
      // 7、主模型名
      this.mainModelName = "";
      // 7.1、主模型描述
      this.mainModelRemark = "";
      // 8、主模型配置数据
      this.mainModelConfig = {};
      // 9、AVUE属性
      this.option = {
        addBtn: false,
        saveBtn: false,
        editBtn: false,
        updateBtn: false,
        viewBtn: false,
        cancelBtn: false,
        delBtn: false,
        refreshBtn: false,
        //columnBtn: false,
        selection: true,
        menu: false,
        menuWidth: 260,
        menuAlign: "center",
        border: true,
        tip: false,
        index: true,
        headerAlign: "center",
        dialogClickModal: false,
        column: [],
      };
      // 10、列表数据
      this.dataList = [];
      // 11、选中行数据
      this.selectionList = [];
      // 14、流程状态Prop名
      this.flowStatusProp = "";
      // 15、查看审批弹框
      this.flowListShow = false;
      // 16、查看审批表格
      this.flowListData = [];
      // 17、表单弹出属性
      this.sxFormVisible = false;
      // 18、表单弹出标题
      this.dialogTitle = "新增";
      // 19、表单CODE
      this.formCode = "";
      // 20、触发事件
      this.actionType = "";
      // 21、数据ID
      this.dataId = "";
      // 23、字段排序
      this.orderList = [];
    },
    // 初始化查询模型配置以及查询数据
    initData() {
      // 按钮
      getBtnByFunctionPath(this.thisRoutePath).then((res) => {
        this.buttonList = res.data.data;
        // 操作栏按钮大小调整
        let menuNum = 0;
        this.buttonList.forEach((ele) => {
          if (ele.btnShowInterface.includes("query_opera_column")) {
            this.option.menu = true;
            menuNum = menuNum + 1;
          }
        });
        if (menuNum == 1) {
          this.option.menuWidth = 80;
        } else if (menuNum == 2) {
          this.option.menuWidth = 150;
        } else if (menuNum == 3) {
          this.option.menuWidth = 220;
        } else {
          this.option.menuWidth = 260;
        }
      });
      // 查询模型配置
      queryMainFields({
        paramType: "M",
        paramId: this.mainModelId,
        modelName: this.mainModelName,
      }).then((res) => {
        this.mainModelConfig = res.data.data;
        (this.mainModelConfig.mainModel || []).forEach((el) => {
          delete el.controlOtherField;
        });
        this.mainModelId = res.data.data.id;
        this.mainModelName = res.data.data.tableName;
        this.mainModelRemark = res.data.data.tableRemark;
        // 搜索栏控件显示处理
        this.showQueryOption();
        // 列表字段处理
        this.columnProcess();
        // 查询列表数据
        this.queryList();
      });
    },
    // 搜索栏控件显示处理
    showQueryOption() {
      if (
        this.mainModelConfig &&
        this.mainModelConfig.queryFields &&
        this.mainModelConfig.queryFields.length > 0
      ) {
        let queryFields = this.mainModelConfig.queryFields;
        //生成搜索栏控件
        for (let index = 0; index < queryFields.length; index++) {
          let data = queryFields[index];
          //获取控件
          let widget = {
            prop: data.modelAndField,
            type: data.queryControlType,
            queryType: data.queryType,
            dbType: data.dbType,
            label: data.queryDbFieldRemark,
            placeholder: data.queryPlaceholder,
            dicData: data.dicData,
            dicUrl:
              "/api/blade-modelform/model/selectSearch?fieldDictField=" +
              data.fieldDictField +
              "&fieldDictRemark=" +
              data.fieldDictRemark +
              "&fieldDictTable=" +
              data.fieldDictTable +
              "&search=",
          };
          this.searchOption.push(widget);
        }
      }
      this.showQuery = true;
    },
    // 查询条件值处理
    search(val) {
      this.extQueryList = val;
      // 查询数据
      this.queryList();
    },
    // 表格字段显示
    columnProcess() {
      let columnFields = this.mainModelConfig.mainModel;
      if (columnFields) {
        // 根据字段排序
        columnFields = this._.sortBy(columnFields, ["queryOrderNum", "id"]);
      }
      for (let i = 0; i < columnFields.length; i++) {
        let data = columnFields[i];
        let column = {};
        column.key = data.id;
        column.prop = data.modelAndField;
        column.label = data.dbFieldRemark;
        column.type = data.formInputType;
        column.fixed = data.fixed;
        column.hide = data.hide;
        column.align = data.columnAlign;
        column.width = parseInt(data.columnLength);
        column.span = parseInt(data.formSpan);
        column.dicData = data.dicData;

        if (column.type == "date") {
          // 日期配置
          column.format = "yyyy-MM-dd";
          column.valueFormat = "yyyy-MM-dd";
        } else if (column.type == "datetime") {
          // 日期时间配置
          column.format = "yyyy-MM-dd HH:mm:ss";
          column.valueFormat = "yyyy-MM-dd HH:mm:ss";
        } else if (["switch", "singlecheckbox"].includes(column.type)) {
          column.type = "select";
          column.dicData = [
            {
              label: "是",
              value: "1",
            },
            {
              label: "否",
              value: "0",
            },
          ];
        } else if (
          [
            "deptSelect",
            "userSelect",
            "fuzzySearch",
            "multipleSelect",
          ].includes(column.type)
        ) {
          column.prop = "$" + data.modelAndField;
        }
        // 流程状态处理
        if (column.prop.includes("#FLOW_STATUS")) {
          this.flowStatusProp = column.prop;
          column.slot = true;
        }
        this.option.column.push(column);
      }
    },
    // 查询数据
    queryList() {
      let obj = {
        modelId: this.mainModelId,
        modelType: "M",
        queryPage: {
          current: this.page.currentPage,
          size: this.page.pageSize,
          extQueryList: this.extQueryList,
        },
        mainModel: this.mainModelConfig.mainModel,
        orderList: this.orderList,
      };
      getList(obj).then((res) => {
        this.dataList = res.data.data.records;
        this.page.total = res.data.data.total;
      });
    },
    // 修改页码
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.queryList();
    },
    // 修改页面数量
    sizeChange(pageSize) {
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.queryList();
    },
    // 选中行
    selectionChange(list) {
      this.selectionList = list;
    },
    // 排序
    sortChange(column, prop, order) {
      this.orderList = [];
      this.orderList.push({
        prop: prop,
        order: order,
      });
      this.queryList();
    },
    // 默认按钮图标
    getIcon(item) {
      if (item.source) {
        return item.source;
      } else if (item.triggerConditions == 1) {
        return "el-icon-plus";
      } else if (item.triggerConditions == 2) {
        return "el-icon-edit";
      } else if (item.triggerConditions == 3) {
        return "el-icon-view";
      } else if (item.triggerConditions == 4) {
        return "el-icon-delete";
      } else if (item.triggerConditions == 5) {
        return "el-icon-s-promotion";
      } else if (item.triggerConditions == 6) {
        return "el-icon-tickets";
      } else if (item.triggerConditions == 7) {
        return "el-icon-s-promotion";
      } else if (item.triggerConditions == 8) {
        return "el-icon-s-flag";
      } else if (item.triggerConditions == 9) {
        return "el-icon-picture-outline";
      }
    },
    // 表格上面按钮点击事件
    buttonClick(item) {
      if (item.things == 1 && item.triggerConditions == 1) {
        // 模型内新建按钮
        this.sxFormOpen("M", "add", "", "");
      } else if (item.things == 1 && item.triggerConditions == 2) {
        // 模型内编辑按钮
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
        } else {
          // 模型内编辑按钮
          this.sxFormOpen("M", "edit", this.selectionList[0].ID, "");
        }
      } else if (item.things == 1 && item.triggerConditions == 3) {
        // 模型内显示按钮
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
        } else {
          // 模型内显示按钮
          this.sxFormOpen("M", "view", this.selectionList[0].ID, "");
        }
      } else if (item.things == 1 && item.triggerConditions == 4) {
        // 模型内删除
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
        } else {
          this.batchDelete();
        }
      } else if (item.triggerConditions == 5) {
        // 发起流程
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
        } else {
          this.selectionList.forEach((ele) => {
            this.beginFlow(item.flowKey, ele.ID);
          });
        }
      } else if (item.things == 1 && item.triggerConditions == 8) {
        // 查看审批（如果只有1条直接进入查看审批界面，如果有多条，先弹出表格再进入）
        if (this.selectionList.length != 1) {
          this.$message.warning("请只选中一条数据");
        } else {
          flowList(this.mainModelId, this.selectionList[0].ID).then((res) => {
            if (res.data.data.length == 1) {
              let row = res.data.data[0];
              this.$refs.outSonV.confirmProcess(true, row, 0, "");
            } else {
              this.flowListShow = true;
              this.flowListData = res.data.data;
            }
          });
        }
      } else if (item.things == 1 && item.triggerConditions == 9) {
        // 查看流程图
      } else if (item.things == 2 && item.triggerConditions == 1) {
        // 表单新增按钮
        this.sxFormOpen("F", "add", "", item.modelFormName);
      } else if (item.things == 2 && item.triggerConditions == 2) {
        // 表单编辑按钮
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
        } else {
          // 表单设计器编辑
          this.sxFormOpen(
            "F",
            "edit",
            this.selectionList[0].ID,
            item.modelFormName
          );
        }
      } else if (item.things == 2 && item.triggerConditions == 3) {
        // 表单显示按钮
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
        } else {
          // 表单设计器显示
          this.sxFormOpen(
            "F",
            "view",
            this.selectionList[0].ID,
            item.modelFormName
          );
        }
      } else if (item.triggerConditions == 10) {
        this.sxImport = true;
      }
    },
    // 操作栏按钮显示逻辑处理
    isShowLineBtn(item, row) {
      if (item.btnShowInterface.includes("query_opera_column")) {
        if (
          ["1", "2"].includes(item.things) &&
          ["1", "3", "9"].includes(item.triggerConditions)
        ) {
          // 1：本功能, '1','3','9'：新增、显示、流程图
          return true;
        } else if (
          ["1", "2"].includes(item.things) &&
          item.triggerConditions == 2
        ) {
          // 1: 本功能，2：编辑
          if (row.FLOW_STATUS) {
            if (row.FLOW_STATUS == 0 || row.FLOW_STATUS == "") {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else if (
          ["1", "2"].includes(item.things) &&
          ["4", "5"].includes(item.triggerConditions)
        ) {
          // 1: 本功能，'4','5'：删除、发起流程
          if (row.FLOW_STATUS) {
            if (row.FLOW_STATUS == 0 || row.FLOW_STATUS == "") {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else if (item.triggerConditions == 8) {
          // 1: 本功能， 8：查看审批
          if (row.FLOW_STATUS && row.FLOW_STATUS > 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    // 操作栏按钮点击事件
    lineClick(item, row) {
      if (item.things == 1 && item.triggerConditions == 1) {
        // 模型内新建按钮
        this.sxFormOpen("M", "add", "", "");
      } else if (item.things == 1 && item.triggerConditions == 2) {
        // 模型内编辑按钮
        this.sxFormOpen("M", "edit", row.ID, "");
      } else if (item.things == 1 && item.triggerConditions == 3) {
        // 模型内显示按钮
        this.sxFormOpen("M", "view", row.ID, "");
      } else if (item.things == 1 && item.triggerConditions == 4) {
        // 模型内删除按钮
        this.deleteData(row.ID);
      } else if (item.triggerConditions == 5) {
        // 发起流程
        this.beginFlow(item.flowKey, row.ID);
      } else if (item.things == 1 && item.triggerConditions == 8) {
        // 查看审批（如果只有1条直接进入查看审批界面，如果有多条，先弹出表格再进入）
        flowList(this.mainModelId, row.ID).then((res) => {
          if (res.data.data.length == 1) {
            let row = res.data.data[0];
            this.$refs.outSonV.confirmProcess(true, row, 0, "");
          } else {
            this.flowListShow = true;
            this.flowListData = res.data.data;
          }
        });
      } else if (item.things == 1 && item.triggerConditions == 9) {
        // 查看流程图
      } else if (item.things == 2 && item.triggerConditions == 1) {
        // 表单新增按钮
        this.sxFormOpen("F", "add", "", item.modelFormName);
      } else if (item.things == 2 && item.triggerConditions == 2) {
        // 表单设计器编辑
        this.sxFormOpen("F", "edit", row.ID, item.modelFormName);
      } else if (item.things == 2 && item.triggerConditions == 3) {
        // 表单设计器显示
        this.sxFormOpen("F", "view", row.ID, item.modelFormName);
      }
    },
    // 打开表单
    sxFormOpen(formType, actionType, dataId, formCode) {
      if (actionType === "add") {
        this.dialogTitle = "新增 " + this.mainModelRemark;
      } else if (actionType === "edit") {
        this.dialogTitle = "编辑 " + this.mainModelRemark;
      } else if (actionType === "view") {
        this.dialogTitle = "显示 " + this.mainModelRemark;
      }
      this.params = {};
      this.params.actionType = actionType;
      this.params.formType = formType;
      this.params.mainModelId = this.mainModelId;
      this.params.formCode = formCode;
      this.params.dataId = dataId;
      this.params.routePath = this.thisRoutePath;
      this.sxFormVisible = true;
    },
    // 批量删除数据
    batchDelete() {
      let ids = this.selectionList
        .map((sel) => {
          return sel.ID;
        })
        .join(",");
      this.deleteData(ids);
    },
    // 删除数据
    deleteData(ids) {
      let formDTO = {
        dataId: this.mainModelId,
        dataType: "M",
        ids: ids,
      };
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(formDTO);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.queryList();
        });
    },
    // 发起流程
    beginFlow(flowKey, dataId) {
      startFlow({
        flowKey: flowKey,
        formType: "M",
        dataId: dataId,
        modelId: this.mainModelId,
        variables: {
          functionPath: this.thisRoutePath,
        },
      }).then((res) => {
        this.$message({
          type: "success",
          message: res.data.msg,
        });
        // 刷新表格数据
        this.queryList();
      });
    },
    // 打开流程审批
    handelDesign(row) {
      this.$refs.sonV.confirmProcess(true, row, 0, "");
    },
    //导出excel
    exportExcel() {
      if (this.selectionList.length == 0) {
        this.$message.warning("请勾选要导出的数据");
        return;
      } else {
        this.$refs.crud.rowExcel(this.selectionList);
      }
    },
    // 关闭弹框
    handleClose() {
      this.sxFormVisible = false;
      this.queryList();
    },
  },
};
</script>
<style scoped>
@import "../../styles/tool/dynamic.css";
</style>>
