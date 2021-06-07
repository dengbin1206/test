<template>
  <basic-container>
    <Search v-if="flag" ref="query" :option="searchOption" @search="search" ></Search>
    <avue-crud
      :data="data"
      class="sx_avue_crud"
      ref="crud"
      v-model="form"
      :option="option"
      :table-loading="loading"
      :before-open="beforeOpen"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @current-change="currentChange"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      :page.sync="page"
      v-if="option.column.length > 0"
    >
      <template slot="menuLeft">
        <template v-for="(buttonItem,index) in this.buttonList">
          <el-button
            v-if="buttonItem.btnShowInterface.includes('query_interface_btn')"
            :key="index"
            :type="getType(buttonItem)"
            size="small"
            :icon="getIcon(buttonItem)"
            @click="buttonClick(buttonItem)"
          >{{buttonItem.name}}</el-button>
        </template>
        <!-- <el-button type="primary" size="small" icon="el-icon-download" @click="leadIn">导 入</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-upload2" @click="exportExcel">导 出</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <template v-for="(buttonItem,index) in buttonList">
          <el-button
            v-if="isShowLineBtn(buttonItem,scope.row,scope.index)"
            :key="index"
            type="text"
            size="small"
            :style="getColor(buttonItem)"
            :icon="getIcon(buttonItem)"
            @click="lineClick(buttonItem,scope.row,scope.index)"
          >{{buttonItem.name}}</el-button>
        </template>
      </template>
      <template :slot="flowStatus" slot-scope="scope">
        <el-tag :type="getFlowStatus(scope.row[flowStatus])">{{getLabel(scope.row[flowStatus])}}</el-tag>
      </template>
      <template
        v-for="(checkboxitem,index) in this.singleCheckbox"
        :slot="checkboxitem.prop"
        slot-scope="scope"
      >
        <el-checkbox
          disabled
          :value="scope.row[checkboxitem.prop]"
          :true-label="1"
          :false-label="0"
          :key="index"
        ></el-checkbox>
      </template>
      <template
        v-for="(switchitem,index) in this.switchList"
        :slot="switchitem.prop"
        slot-scope="scope"
      >
        <el-switch
          disabled
          :value="scope.row[switchitem.prop]"
          :active-value="1"
          :inactive-value="0"
          :key="index"
        ></el-switch>
      </template>
      <template v-for="(Timeitem,index) in this.timeList" :slot="Timeitem.prop" slot-scope="scope">
        <span :key="index">{{scope.row[Timeitem.prop]}}</span>
      </template>
      <template
        :slot="Tableitem.group+'Form'"
        slot-scope="scope"
        v-for="(Tableitem,index) in this.dynamicTable"
      >
        <el-tabs type="border-card" :key="index" v-if="Tableitem.group !=''">
          <el-tab-pane :label="item.modelTitle" v-for="(item,i) in Tableitem.groupModel" :key="i">
            <dynamic-table
              ref="dynamicTable"
              :data.sync="item.infoData"
              :delId.sync="item.delId"
              :id="id"
              :type="type"
              :fieldData="item.modelFields"
              :addEditView="addEditView"
              :modelName="item.modelName"
              :mainId="mainDataId"
            ></dynamic-table>
          </el-tab-pane>
        </el-tabs>
        <dynamic-table
          v-else
          v-for="(item,i) in Tableitem.groupModel"
          :key="i"
          ref="dynamicTable"
          :data.sync="item.infoData"
          :delId.sync="item.delId"
          :addEditView="addEditView"
          :id="id"
          :type="type"
          :modelTitle="item.modelTitle"
          :fieldData="item.modelFields"
          :modelName="item.modelName"
          :mainId="mainDataId"
        ></dynamic-table>
      </template>
      <template v-for="(item,index) in this.userSelect" :slot="item.prop+'Form'">
        <el-select
          :key="index"
          :disabled="item.disabled"
          v-model="form[item.prop]"
          value-key="id"
          filterable
          remote
          reserve-keyword
          :remote-method="(query)=>{userSelectSearch(query,item.prop)}"
          placeholder="请输入"
          :loading="userSelectLoading"
        >
          <el-option v-for="ele in item.data" :key="ele.id" :label="ele.realName" :value="ele.id"></el-option>
        </el-select>
      </template>
      <template v-for="(fileItem,index) in this.fileUpload" :slot="fileItem.prop+'Form'">
        <file-upload
          :key="index"
          :prop="fileItem.prop"
          :disabled="fileItem.disabled"
          :modelName="fileItem.modelName"
          :fieldName="fileItem.prop"
          :data.sync="fileItem.data"
          :mainId="mainDataId"
        ></file-upload>
      </template>
      <template v-for="(imgItem,index) in this.imgUpload" :slot="imgItem.prop+'Form'">
        <img-upload
          :key="index"
          :prop="imgItem.prop"
          :disabled="imgItem.disabled"
          :modelName="imgItem.modelName"
          :fieldName="imgItem.prop"
          :data.sync="imgItem.data"
          :mainId="mainDataId"
        ></img-upload>
      </template>
      <template slot-scope="scope" slot="menuForm">
        <template v-for="(buttonItem,index) in buttonList">
          <el-button
            v-if="buttonItem.btnShowInterface.includes('add_interface') && buttonItem.things == 1 && addEditView == 'add'"
            :key="index"
            type="primary"
            size="small"
            :style="getColor(buttonItem)"
            :icon="getIcon(buttonItem)"
            :loading="buttonItem.loading"
            :disabled="buttonItem.loading"
            @click.stop="formClick(buttonItem,$refs.crud)"
          >{{buttonItem.name}}</el-button>
        </template>
        <template v-for="(buttonItem,index) in buttonList">
          <el-button
            v-if="buttonItem.btnShowInterface.includes('update_interface') && buttonItem.things == 1 && addEditView == 'edit'"
            :key="index"
            type="primary"
            size="small"
            :style="getColor(buttonItem)"
            :icon="getIcon(buttonItem)"
            :loading="buttonItem.loading"
            :disabled="buttonItem.loading"
            @click.stop="formClick(buttonItem,$refs.crud)"
          >{{buttonItem.name}}</el-button>
        </template>
        <el-button icon="el-icon-circle-close" size="small" @click="$refs.crud.closeDialog()">取消</el-button>
      </template>
    </avue-crud>
    <el-dialog
      title="表单新增"
      :visible.sync="formDialog"
      width="60%"
      append-to-body
      class="sx_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <form-view ref="formview" :data="itemOption"></form-view>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="formSubmit()" size="small" icon="el-icon-circle-check">确 定</el-button>
        <el-button @click="formDialog = false" size="small" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="表单自定义"
      :visible.sync="formCustomize"
      width="60%"
      append-to-body
      class="sx_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <component :is="getComponent" :data="data"></component>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="formCustSubmit()"
          size="small"
          icon="el-icon-circle-check"
        >确 定</el-button>
        <el-button @click="formCustomize = false" size="small" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="二维码"
      :visible.sync="printize"
      width="30%"
      append-to-body
      class="sx_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <img :src="imgSrc" alt style="width:100%;" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="download" size="small" icon="el-icon-circle-check">下载</el-button>
        <el-button @click="printize = false" size="small" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="流程历史审批记录"
      append-to-body
      :visible.sync="versionVis"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table :data="versionData" border max-height="500px" style="width: 100%;">
        <el-table-column prop="instId" label="事务编号" width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180" align="center"></el-table-column>
        <el-table-column prop="title" label="事务标题" align="center"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handelDesign(scope.row, scope.index)">查看审批</el-button>
          </template>
        </el-table-column>
      </el-table>
      <diaVisLog ref="sonV"></diaVisLog>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" versionVis= false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <diaVisLog ref="outSonV"></diaVisLog>
    <arrImg ref='aImg'></arrImg>
  </basic-container>
</template>
<script>
import formView from "@/components/formView/formView";
import formCustomize from "./formCustomize";
import dynamicTable from "@/components/dynamicTable";
import fileUpload from "@/components/fileUpload";
import imgUpload from "@/components/imgUpload";
import diaVisLog from "../work/dialog";
import { processFormula, getFormula } from "@/util/formula";
import globalVar from "@/utils/global_var";
import arrImg from '../work/arrImg'
import {
  queryMainFields,
  add,
  update,
  remove,
  getList,
  findById,
  startFlow,
  leadOut,
  leadIn,
  generateUrl,
  addDefaultValue,
  flowList,
  getUserName
} from "@/api/tool/dynamic";
import iconList from "@/config/iconList";
import { getBtnByFunctionPath } from "@/api/system/function";

export default {
  components: {
    dynamicTable,
    fileUpload,
    imgUpload,
    formView,
    formCustomize,
    arrImg,
    diaVisLog
  },
  data() {
    let fileValidate = (rule, value, callback) => {
      let list = [];
      let label = "";
      this.fileUpload.forEach(ele => {
        if (rule.field == ele.prop) {
          list = ele.data;
          label = ele.label;
        }
      });
      if (list.length > 0) {
        callback();
      } else {
        callback(new Error(label + "必填"));
      }
    };
    let imgValidate = (rule, value, callback) => {
      let list = [];
      let label = "";
      this.imgUpload.forEach(ele => {
        if (rule.field == ele.prop) {
          list = ele.data;
          label = ele.label;
        }
      });
      if (list.length > 0) {
        callback();
      } else {
        callback(new Error(label + "必填"));
      }
    };
    return {
      userSelect: [], //用户选择器
      userSelectLoading: false,
      fileValidate: fileValidate,
      imgValidate: imgValidate,
      showDia: false,
      flowStatus: "", //流程状态
      dialog: true, // 查看审批只选中一条
      versionVis: false, //查看审批弹框
      versionData: [], // 查看审批表格
      printize: false, //二维码弹框
      imgSrc: "", //二维码
      activeName: "", //默认点击选项卡
      formDialog: false, //表单新增弹框
      formCustomize: false, //表单自定义弹框
      itemOption: "",
      routePath:"",
      obj: {},
      form: {},
      flag: false,
      loading: false,
      type: "", //获取url参数
      id: "", //获取url参数
      clickquery: "", // 点击页码改变当前页
      selectQuery: [], //查询条件
      searchOption: {
        // 搜索栏配置信息
        rows: []
      },
      data: [],
      mainDataId: "", //主模型Id
      mainModelName: "", //主模型Name
      addEditView: "", //新增修改显示
      buttonList: [], //按钮
      columnList: [], //表格列配置信息
      singleCheckbox: [], //表格中单个复选框
      switchList: [], //表格中开关
      timeList: [], //表格中时间
      fileUpload: [], //文件上传
      imgUpload: [], //图片上传
      dynamicTable: [{ group: "", groupModel: [] }], // 动态子表
      childModel: [], //动态子表后台返回数据
      selectionList: [], //表格多选的数据
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      option: {
        menu: false,
        menuWidth: 260,
        addBtn: false,
        saveBtn: false,
        editBtn: false,
        updateBtn: false,
        viewBtn: false,
        cancelBtn: false,
        addTitle: "",
        editTitle: "",
        viewTitle: "",
        // excelBtn: true,
        delBtn: false,
        menuAlign: "center",
        border: true,
        tip: false,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        selection: true,
        labelWidth: 150,
        loading: false,
        // align: "center",
        headerAlign:'center',
        //align: "left",

        dialogClickModal: false,
        column: []
      },
      addObject: {},
      formula: "",
      btnLoading: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.routePath = this.$route.path;
        if (this.$route.path.indexOf("tool/dynamic") != -1) {
          this.type = "M";
          if(this.$route.path.indexOf("tool/dynamic/M/") != -1){
            // 获取模型id
            let arr = []
            arr = this.$route.path.split("/");
            arr.forEach(f => {
              this.id = f;
            })
          }else{
            // 获取模型名
            let arr = []
            arr = this.$route.path.split("/");
            arr.forEach(f => {
              this.mainModelName = f;
            })
          }
          this.initData();
        }
      },
      deep: true,
      immediate: true
    },
    form: {
      handler(newVal, oldVal) {
        this.option.column.forEach(ele => {
          if (ele.formula) {
            let formula = ele.formula;
            for (let key in this.form) {
              if (formula.includes(key) && this.form[key]) {
                formula = formula.replace(new RegExp(key, "g"), this.form[key]);
                if (formula && formula.indexOf("#") == -1) {
                  this.$set(this.form, ele.prop, eval(formula));
                }
              }
            }
          }
        });
      },
      deep: true
    }
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.ID);
      });
      return ids.join(",");
    }
  },
  methods: {
    // 页面初始化 加载数据
    initData() {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        target: ".el-card__body",
        background: "#fff"
      });
      // 清空数据
      this.userSelect = []; //用户选择器
      this.userSelectLoading =  false;
      this.selectQuery = []; //查询条件
      this.searchOption.rows = [];
      this.data = [];
      this.buttonList = []; //按钮
      this.columnList = []; //表格列配置信息
      this.singleCheckbox = []; //表格中单个复选框
      this.switchList = []; //表格中开关
      this.timeList = []; //表格中时间
      this.fileUpload = []; //文件上传
      this.imgUpload = []; //图片上传
      this.dynamicTable = []; // 动态子表
      this.childModel = []; //动态子表后台返回数据
      this.selectionList = []; //表格多选的数据
      this.option.column = [];
      // 获取按钮
      getBtnByFunctionPath(this.routePath).then(res => {
        this.buttonList = res.data.data;
      })
      queryMainFields({
        paramType: this.type,
        paramId: this.id,
        modelName: this.mainModelName
      })
        .then(res => {
          this.addObject = res.data.data;
          (this.addObject.queryFields || []).forEach(el=>{
            delete el.controlOtherField;
          });
          (this.addObject.mainModel || []).forEach(el=>{
            delete el.controlOtherField;
          });
          (this.addObject.childModel || []).forEach(el=>{
            delete el.controlOtherField;
          });
          let arr = [];
          let row = [];
          this.option.addTitle = "新 增 " + res.data.data.modelTitle; //新增title
          this.option.editTitle = "编 辑 " + res.data.data.modelTitle; //新增title
          this.option.viewTitle = "查 看 " + res.data.data.modelTitle;
          this.id = res.data.data.id;
          this.mainModelName = res.data.data.tableName;
          this.api();
          //this.buttonList = res.data.data.buttonList;
          this.option.menu = false;
          let menuNum = 0;
          this.buttonList.forEach(ele => {
            if (ele.btnShowInterface.includes("query_opera_column")) {
              this.option.menu = true;
              menuNum = menuNum + 1;
            }
            ele.loading = false;
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
          //生成搜索栏控件
          for (
            let index = 0;
            index < res.data.data.queryFields.length;
            index++
          ) {
            let data = res.data.data.queryFields[index];
            //获取控件
            let widget = this.getWidget(data);
            widget.list = data.dicData;
            arr.push(widget);
          }
          // 一行两个
          for (let i = 0; i < arr.length; i += 2) {
            if (i == arr.length - 1) {
              row.push([arr[i]]);
            } else {
              row.push([arr[i], arr[i + 1]]);
            }
          }
          this.searchOption.rows = row;
          this.flag = true;
          // 生成表格控件
          for (let i = 0; i < res.data.data.mainModel.length; i++) {
            let data = res.data.data.mainModel[i];
            let column = this.getColumnList(data);
            if (column.prop.includes("#FLOW_STATUS")) {
              this.flowStatus = column.prop;
              column.slot = true;
            }
            column.addDisabled = data.addDisabled;
            column.editDisabled = data.editDisabled;
            column.addDisplay = data.addDisplay;
            column.editDisplay = data.editDisplay;
            column.hide = data.hide;
            column.dicData = data.dicData;
            column.fixed = data.fixed;
            column.addRequired = data.addRequired;
            column.editRequired = data.editRequired;
            column.viewDisplay = data.viewDisplay;
            column.placeholder = data.formPlaceholder;
            column.align = data.columnAlign;
            if (data.columnLength) {
              column.width = data.columnLength;
            }
            column.span = parseInt(data.formSpan);
            column.align = data.columnAlign;
            let columnList = this.deepClone(column);
            this.columnList.push(columnList);
            // 多选复选框配置
            if (column.type == "checkbox") {
              this.$set(column, "dataType", "string");
            }
            //用户选择
            if (column.type == "userSelect") {
              this.userSelect.push({
                type: "select",
                prop: column.prop,
                addDisabled: column.addDisabled,
                editDisabled: column.editDisabled,
                url: "/api/blade-user/getUserInfoBySearch",
                data: []
              });
              this.$set(column, "formslot", true);
              this.$set(column, "type", "select");
            }
            // 单个复选框配置
            if (column.type == "singlecheckbox") {
              this.$set(column, "dicData", [
                {
                  value: 1
                }
              ]);
              this.singleCheckbox.push({
                prop: column.prop,
                type: "singlecheckbox"
              }); //单个复选框slot 列显示
              this.$set(column, "slot", true);
              this.$set(column, "type", "checkbox");
            }
            // 开关配置
            if (column.type == "switch") {
              this.switchList.push({
                prop: column.prop,
                type: "switch"
              });
              this.$set(column, "dicData", [
                {
                  value: 1
                }
              ]);
              this.$set(column, "slot", true);
            }
            // 单选框配置
            if (column.type == "radio") {
              this.$set(column, "dataType", "string");
            }
            // 图标配置
            if (column.type == "icon") {
              this.$set(column, "type", "icon");
              this.$set(column, "iconList", iconList);
            }
            // 下拉多选配置
            if (column.type == "multipleSelect") {
              this.$set(column, "dataType", "string");
              this.$set(column, "multiple", true);
              this.$set(column, "type", "select");
            }
            // 日期配置
            if (column.type == "date") {
              this.$set(column, "format", "yyyy-MM-dd");
              this.$set(column, "valueFormat", "yyyy-MM-dd");
            }
            // 日期时间配置
            if (column.type == "datetime") {
              this.$set(column, "format", "yyyy-MM-dd HH:mm:ss");
              this.$set(column, "valueFormat", "yyyy-MM-dd HH:mm:ss");
              this.$set(column, "show-overflow-tooltip", true);
            }
            // 时间配置
            if (column.type == "time") {
              this.timeList.push({
                prop: column.prop,
                type: "time"
              });
              this.$set(column, "format", "HH:mm:ss");
              this.$set(column, "valueFormat", "HH:mm:ss");
              this.$set(column, "slot", true);
            }
            // 下拉模糊搜索配置
            if (column.type == "fuzzySearch") {
              this.$set(column, "type", "select");
              this.$set(column, "remote", true);
              this.$set(
                column,
                "dicUrl",
                `/api/blade-dynamic/dynamicConfig/selectSearch?fieldDictField=${data.fieldDictField}&fieldDictRemark=${data.fieldDictRemark}&fieldDictTable=${data.fieldDictTable}&search={{key}}`
              );
              this.$set(column, "props", {
                label: "label",
                value: "value"
              });
            }
            if (column.type == "fileUpload") {
              this.fileUpload.push({
                prop: column.prop,
                type: "fileUpload",
                addDisabled: column.addDisabled,
                editDisabled: column.editDisabled,
                label: column.label,
                modelName: this.mainModelName,
                data: []
              });

              //this.$set(column, "span", 24);
              this.$set(column, "hide", true);
              this.$set(column, "formslot", true);
            }
            if (column.type == "imgUpload") {
              this.imgUpload.push({
                prop: column.prop,
                type: "imgUpload",
                label: column.label,
                addDisabled: column.addDisabled,
                editDisabled: column.editDisabled,
                modelName: this.mainModelName,
                data: []
              });
              //this.$set(column, "span", 24);
              this.$set(column, "hide", true);
              this.$set(column, "formslot", true);
            }
            let that = this;
            this.option.column.push(column);
          }
          this.dynamicTable = [{ group: "", groupModel: [] }];
          this.childModel = res.data.data.childModel;
          if (this.childModel.length > 0) {
            let tab = []; //{group:"",groupModel:[]}
            this.childModel.forEach(ele => {
              let groupId = ele.modelGroup;
              let isExist = false;
              let index = 0;
              for (let i = 0; i < tab.length; i++) {
                // 判断分组相同,找到对应的index,找到分组相同的
                if (groupId == tab[i].group) {
                  isExist = true; //找到了分组相同的
                  index = i;
                }
              }
              if (!isExist || groupId == "") {
                tab[tab.length] = {
                  group: groupId,
                  groupModel: [
                    {
                      modelName: ele.relatedTableName,
                      modelFields: ele.modelFieldQueryVOList,
                      infoData: [],
                      delId: [],
                      type: "table",
                      prop: ele.relatedTableName,
                      modelTitle: ele.relatedModelTitle
                    }
                  ]
                };
              } else {
                let groupModel = tab[index].groupModel;
                groupModel[groupModel.length] = {
                  modelName: ele.relatedTableName,
                  modelFields: ele.modelFieldQueryVOList,
                  infoData: [],
                  delId: [],
                  type: "table",
                  prop: ele.relatedTableName,
                  modelTitle: ele.relatedModelTitle
                }; //相当于添加同一个分组的modelGroup
              }
              this.dynamicTable = tab;
            });
            this.dynamicTable.forEach(ele => {
              let obj = {};
              obj.labelWidth = 0;
              obj.label = "";
              obj.prop = ele.group;
              obj.span = 24;
              obj.hide = true;
              obj.formslot = true;
              this.option.column.push(obj);
            });
          }
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    },
    //导出excel
    exportExcel() {
      if (this.selectionList.length == 0) {
        this.$message.warning("请勾选要导出的数据");
        return;
      }
      this.$refs.crud.rowExcel(this.selectionList);
    },
    // 用户选择
    userSelectSearch(query, field) {
      if (query !== "") {
        this.userSelectLoading = true;
        getUserName(query).then(res => {
          this.userSelect.forEach(ele => {
            if (ele.prop == field) {
              ele.data = res.data.data;
            }
          });
          this.userSelectLoading = false;
        });
      } else {
        this.userSelect.forEach(ele => {
          if (ele.prop == field) {
            ele.data = [];
          }
        });
      }
    },
    //查询
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let arr = this.getExtQueryList(val);
      console.log(arr)
      arr.forEach(ele=>{
        if(ele.expressionList.length != 0 && ele.expressionList[0].lowerValue){
          this.searchOption.rows.forEach(el=>{
           el.forEach(e=>{
             if(e.prop != ele.field){
                return;
             }
             if(e.type == "date" ){
               ele.dataFormat=e.format||'yyyy-MM-dd';
             }
             if(e.type == "datetime" ){
               ele.dataFormat=e.format||'yyyy-MM-dd hh:mm:ss';
             }
             if(e.type == "time" ){
               ele.dataFormat=e.format||'hh:mm:ss';
             }
             if(e.queryType == "2"){
               if(e.type == "date" || e.type == "datetime" || e.type == "time" && ele.expressionList){
                     ele.expressionList[0].operator ='BT';
                let expressionList = this.deepClone(ele.expressionList[0].lowerValue);
                ele.expressionList[0].lowerValue = expressionList[0];
                ele.expressionList[0].upperValue = expressionList[1];
               }
             }
           })
        })
        }
      })
      let obj = {
        modelId: this.id,
        modelType: this.type,
        queryPage: {
          current: this.clickquery == 1 ? this.page.currentPage : 1,
          size: this.page.pageSize,
          extQueryList: arr
        },
        mainModel: this.addObject.mainModel
      };
      getList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    //是否显示审批
    isShowLineBtn(item, row, index) {
      if (item.btnShowInterface.includes("query_opera_column")) {
        if (item.things == 1 &&
          (item.triggerConditions == 1 || item.triggerConditions == 3 || item.triggerConditions == 9)) {
          return true;
        }
        if (item.things == 1 && item.triggerConditions == 2) {
          if (row.FLOW_STATUS) {
            if (row.FLOW_STATUS == 0 || row.FLOW_STATUS == "") {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (item.things == 1 && item.triggerConditions == 4) {
          if (row.FLOW_STATUS) {
            if (row.FLOW_STATUS == 0 || row.FLOW_STATUS == "") {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (item.things == 1 && item.triggerConditions == 5) {
          if (row.FLOW_STATUS) {
            if (row.FLOW_STATUS == 0 || row.FLOW_STATUS == "") {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
        if (item.things == 1 && item.triggerConditions == 8) {
          if (row.FLOW_STATUS) {
            if (row.FLOW_STATUS == 0 || row.FLOW_STATUS == "") {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        }
      }
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
    //行内删除颜色
    getColor(item) {
      if (item.things == 1 && item.triggerConditions == 4) {
        return "color:red";
      }
    },
    //行内点击
    lineClick(item, row, index) {
      if (item.things == 1 && item.triggerConditions == 1) {
        this.$refs.crud.rowAdd();
      }
      if (item.things == 1 && item.triggerConditions == 2) {
        this.$refs.crud.rowEdit(row);
      }
      if (item.things == 1 && item.triggerConditions == 3) {
        this.$refs.crud.rowView(row);
      }
      if (item.things == 1 && item.triggerConditions == 4) {
        this.rowDel(row);
      }
      if (item.things == 1 && item.triggerConditions == 5) {
        startFlow({
          flowKey: item.flowKey,
          dataId: row.ID,
          formType: "M",
          modelId: this.id,
          variables: {
            functionPath:this.$route.fullPath
          }
        }).then(
          res => {
            this.$message({
              type: "success",
              message: res.data.msg
            });
            // 刷新表格数据
            this.api();
            // that.closeDialog();
          },
          () => {
            window.console.log(error);
          }
        );
      }
      if (item.things == 1 && item.triggerConditions == 8) {
        flowList(this.id, row.ID).then(res => {
          if (res.data.data.length == 1) {
            let row = res.data.data[0];
            this.$refs.outSonV.confirmProcess(this.dialog, row, 0, "");
          } else {
            this.versionVis = true;
            this.versionData = res.data.data;
          }
        });
      }
      if (item.things == 1 && item.triggerConditions == 9) {
        // 查看流程图
        let param={proInstId:row.PRO_INST_ID};
        // 查看流程图
        this.$refs.aImg.open(true,param);
      }
    },
    //按钮点击
    buttonClick(item) {
      if (item.things == 1 && item.triggerConditions == 1) {
        console.log(this.$refs.crud);
        this.$refs.crud.rowAdd();
      }
      if (item.things == 1 && item.triggerConditions == 2) {
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
          return false;
        } else {
          this.$refs.crud.rowEdit(this.selectionList[0]);
          this.$refs.crud.toggleSelection();
        }
      }
      if (item.things == 1 && item.triggerConditions == 3) {
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
          return false;
        } else {
          this.$refs.crud.rowView(this.selectionList[0]);
          this.$refs.crud.toggleSelection();
          // this.$refs.crud.rowView(this.selectionList[0]);
        }
      }
      if (item.things == 1 && item.triggerConditions == 4) {
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
          return false;
        } else {
          this.batchDelete();
        }
      }
      if (item.things == 1 && item.triggerConditions == 5) {
        if (this.selectionList.length == 0) {
          this.$message.warning("请选中至少一条数据");
          return false;
        } else {
          this.selectionList.forEach(ele => {
            startFlow({
              flowKey: item.flowKey,
              dataId: ele.ID,
              formType: "M",
              modelId: this.id,
              variables: {
                functionPath:this.$route.fullPath
              }
            }).then(
              res => {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                // 刷新表格数据
                this.api();
              },
              () => {
                window.console.log(error);
              }
            );
          });
        }
      }
      if (item.things == 1 && item.triggerConditions == 8) {
        if (this.selectionList.length != 1) {
          this.$message.warning("请只选中一条数据");
          return false;
        } else {
          flowList(this.id, this.selectionList[0].ID).then(res => {
            if (res.data.data.length == 1) {
              let row = res.data.data[0];
              this.$refs.outSonV.confirmProcess(this.dialog, row, 0, "");
            } else {
              this.versionVis = true;
              this.versionData = res.data.data;
            }
          });
        }
      }
      if (item.things == 1 && item.triggerConditions == 9) {
        // 查看流程图
        PRO_INST_ID
      }
      if (item.things == 2 && item.triggerConditions == 1) {
        this.itemOption = {
          id: item.resourceId
        };
        this.formDialog = true;
      }
      if (item.things == 4 && item.triggerConditions == 1) {
        this.formCustomize = true;
      }
    },
    handelDesign(row) {
      this.$refs.sonV.confirmProcess(this.dialog, row, 0, "");
    },
    getType(item) {
      if (item.triggerConditions == 4) {
        return "danger";
      } else {
        return "primary";
      }
    },
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
    getComponent() {
      console.log(
        "config-getComponent:" + this.data.type + "" + this.data.title
      ); //JSON.stringify(this.data.title)+'=>')
      //(item.type, item.component)
      const prefix = "config-";
      const { type } = this.data;
      // console.log(this.$parent)
      let result = "input";
      if ([undefined, "input", "password", "url"].includes(type))
        result = "input";
      else if (
        ["primary", "danger", "success", "warning", "info"].includes(type)
      )
        result = "button";
      else if (dateArr.includes(type)) result = "date";
      else if (["array", "img"].includes(type)) result = "array";
      else result = type;
      return prefix + result;
      console.log("...................");
    },
    formSubmit() {
      this.$refs.formview.save();
    },
    //导出
    leadOut() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      let arr;
      if (this.selectQuery.length > 0) {
        arr = this.getExtQueryList(this.selectQuery);
      } else {
        arr = [];
      }
      let obj = {
        dataId: this.id,
        dataType: this.type,
        ids: this.ids,
        queryPage: {
          current: this.clickquery == 1 ? this.page.currentPage : 1,
          size: this.page.pageSize,
          extQueryList: arr
        }
      };
      leadOut(obj).then(res => {});
    },
    //打印二维码
    print() {
      let dynamicSingleDTO = {
        formId: this.id,
        formType: this.type,
        dataId: this.selectionList[0].id
      };
      generateUrl(dynamicSingleDTO).then(res => {
        if (res.data.code == 200) {
          this.imgSrc = "data:image/jpeg;base64," + res.data.data;
          this.printize = true;
        }
      });
    },
    //二维码下载
    download() {
      var link = document.createElement("a");
      link.href = this.imgSrc;
      link.download = "qrCode.jpg";
      link.click();
      document.body.removeChild(link);
    },
    /*
    //清空验证
    clearValidate() {
      this.$refs.crud.clearValidate();
    },
    //验证某个字段
    validateField(val) {
      this.$refs.crud.validateField(val);
    },*/
    //弹框打开之前
    beforeOpen(done, type) {
      console.log(this);
      this.addEditView = type;
      if (type == "add") {
        let columnFields = this.columnList;
        this.fileUpload.forEach(ele => {
          ele.data = [];
          ele.disabled = ele.addDisabled;

        });
        this.imgUpload.forEach(ele => {
          ele.data = [];
          ele.disabled = ele.addDisabled;

        });
        this.userSelect.forEach(ele => {
          ele.data = [];
          ele.disabled = ele.addDisabled;

        });
        this.option.column.forEach(ele => {
          if (ele.addRequired == true) {
            if (ele.type == "fileUpload") {
              ele.rules = [
                {
                  required: true,
                  validator: this.fileValidate,
                  trigger: "blur"
                }
              ];
            } else if (ele.type == "imgUpload") {
              ele.rules = [
                {
                  required: true,
                  validator: this.imgValidate,
                  trigger: "blur"
                }
              ];
            } else if (ele.type == "number") {
              delete ele.change;
              ele.rules = [
                {
                  required: true,
                  message: `${ele.label}必填`,
                  trigger: "blur"
                }
              ];
            } else {
              ele.rules = [
                {
                  required: true,
                  message: `${ele.label}必填`,
                  trigger: "blur"
                }
              ];
            }
          } else {
            ele.rules = [
              {
                required: false,
                message: `${ele.label}必填`,
                trigger: "blur"
              }
            ];
          }
        });
        console.log(this.option.column);
        addDefaultValue(this.addObject).then(res => {
          setTimeout(() => {
            this.form = res.data.data;
          }, 0);
        });
        columnFields.forEach(ele => {
          if (ele.type == "switch") {
            //this.form[ele.prop] = false;
            this.$set(this.form, ele.prop, false);
          }
        });
        this.mainDataId = "";
        done();
      }
      if (type == "edit" || type == "view") {
        if (type == "edit") {
          this.fileUpload.forEach(ele => {
            ele.data = [];
            ele.disabled = ele.editDisabled;

          });
          this.imgUpload.forEach(ele => {
            ele.data = [];
            ele.disabled = ele.editDisabled;

          });
          this.userSelect.forEach(ele => {
          ele.data = [];
          ele.disabled = ele.editDisabled;

        });
        }
        if (type == "view") {
          this.fileUpload.forEach(ele => {
            ele.data = [];
            ele.disabled = true;
          });
          this.imgUpload.forEach(ele => {
            ele.data = [];
            ele.disabled = true;
          });
          this.userSelect.forEach(ele => {
          ele.data = [];
          ele.disabled = true;
        });
        }
        let dynamicSingleDTO = {
          modelId: this.id,
          modelType: this.type,
          dataId: this.form.ID,
          mainModel: this.addObject.mainModel,
          dbTableName: this.addObject.dbTableName
        };

        const editLoading = this.$loading({
          lock: true,
          spinner: "el-icon-loading",
          target: ".el-card__body",
          background: "rgba(255, 255, 255, 0.5)"
        });
        this.option.column.forEach(ele => {
          if (ele.editRequired == true) {
            delete ele.change;
            if (ele.type == "fileUpload") {
              ele.rules = [
                {
                  required: true,
                  validator: this.fileValidate,
                  trigger: "blur"
                }
              ];
            } else if (ele.type == "imgUpload") {
              ele.rules = [
                {
                  required: true,
                  validator: this.imgValidate,
                  trigger: "blur"
                }
              ];
            } else {
              ele.rules = [
                {
                  required: true,
                  message: `${ele.label}必填`,
                  trigger: "blur"
                }
              ];
            }
          } else {
            ele.rules = [
              {
                required: false,
                message: `${ele.label}必填`,
                trigger: "blur"
              }
            ];
          }
        });
        findById(dynamicSingleDTO).then(res => {
          let columnFields = this.columnList;
          // 特殊控件值的初始化
          for (let i = 0; i < columnFields.length; i++) {
            if (columnFields[i].type == "singlecheckbox") {
              if (res.data.data[columnFields[i].prop] == 0) {
                res.data.data[columnFields[i].prop] == [];
              } else {
                res.data.data[columnFields[i].prop] ==
                  [res.data.data[columnFields[i].prop]];
              }
            } else if (columnFields[i].type == "switch") {
              if (res.data.data[columnFields[i].prop] == 1) {
                res.data.data[columnFields[i].prop] = true;
              } else {
                res.data.data[columnFields[i].prop] = false;
              }
            } else if (columnFields[i].type == "number") {
              if (res.data.data[columnFields[i].prop] == "") {
                res.data.data[columnFields[i].prop] = undefined;
              }
            } else if (columnFields[i].type == "userSelect") {
              let feild = "$" + columnFields[i].prop;
              let arr = [];
              arr.push({
                id: res.data.data[columnFields[i].prop],
                realName: res.data.data[feild]
              });
              this.userSelect.forEach(ele => {
                if (ele.prop == columnFields[i].prop) {
                  ele.data = arr;
                }
              });
            } else {
            }
          }
          this.form = res.data.data;
          this.mainDataId = this.form.ID;
          editLoading.close();
          done();
        });
      }
    },
    addSave(formDTO, that, item, done) {
      // 新增保存
      item.loading = true;
      add(formDTO)
        .then(res => {
          this.$message({
            type: "success",
            message: "新增成功!"
          });
          done();
          item.loading = false;
          this.api();
          that.closeDialog();
        })
        .catch(error => {
          done();
          item.loading = false;
          window.console.log(error);
        });
    },
    addSaveFlow(formDTO, that, flowKey, item, done) {
      if (flowKey.length == 0) {
        this.$message.warning("没有配置对应的流程");
        return false;
      }
      item.loading = true;
      // 新增保存并提交流程
      add(formDTO)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            // 启动流程
            startFlow({
              flowKey: flowKey,
              dataId: res.data.data.id,
              formType: "M",
              modelId: this.id,
              variables: {
                functionPath:this.$route.fullPath
              }
            })
              .then(res1 => {
                this.$message({
                  type: "success",
                  message: res1.data.msg
                });
                done();
                item.loading = false;
                this.api();
                that.closeDialog();
              })
              .catch(error => {
                done();
                item.loading = false;
                window.console.log(error);
              });
          }
        })
        .catch(error => {
          done();
          item.loading = false;
          window.console.log(error);
        });
    },
    editSave(formDTO, that, item, done) {
      // 编辑保存
      item.loading = true;
      update(formDTO)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dynamicTable.forEach(ele => {
            ele.groupModel.forEach(el => {
              el.delId = [];
            });
          }); //修改后，将delId数组清空
          done();
          item.loading = false;
          // this.api();
          this.search(this.selectQuery)
          that.closeDialog();
        })
        .catch(error => {
          done();
          item.loading = false;
          window.console.log(error);
        });
    },
    editSaveFlow(formDTO, that, flowKey, item, done) {
      if (flowKey.length == 0) {
        this.$message.warning("没有配置对应的流程");
        return false;
      }
      item.loading = true;
      // 编辑保存并提交流程
      update(formDTO)
        .then(res => {
          if (res.data.code == 200) {
            this.dynamicTable.forEach(ele => {
              ele.groupModel.forEach(el => {
                el.delId = [];
              });
            }); //修改后，将delId数组清空
            // 启动流程
            startFlow({
              flowKey: flowKey,
              dataId: formDTO.mainModel.ID,
              formType: "M",
              modelId: this.id,
              variables: {
                functionPath:this.$route.fullPath
              }
            })
              .then(res1 => {
                this.$message({
                  type: "success",
                  message: res1.data.msg
                });
                done();
                item.loading = false;
                // this.api();
          this.search(this.selectQuery)
                that.closeDialog();
              })
              .catch(error => {
                done();
                item.loading = false;
                window.console.log(error);
              });
          }
        })
        .catch(error => {
          done();
          item.loading = false;
          window.console.log(error);
        });
    },
    handleStartFlow(that, id, flowKey, item, done) {
      if (flowKey.length == 0) {
        this.$message.warning("没有配置对应的流程");
        return;
      }
      item.loading = true;
      // 启动流程
      startFlow({
        flowKey: flowKey,
        dataId: id,
        formType: "M",
        modelId: this.id,
        variables: {
          functionPath:this.$route.fullPath
        }
      })
        .then(res1 => {
          this.$message({
            type: "success",
            message: res1.data.msg
          });
          done();
          item.loading = false;
          this.api();
          that.closeDialog();
        })
        .catch(error => {
          done();
          item.loading = false;
          window.console.log(error);
        });
    },
    formClick(item, that) {
      that.validate((valid, done) => {
        if (valid) {
          console.log(valid);
          let row = that.tableForm;
          let formDTO = this.getFormData(row);
          if (item.things == 1 && item.triggerConditions == 6) {
            // 保存
            if (formDTO.mainModel.ID) {
              this.editSave(formDTO, that, item, done);
            } else {
              this.addSave(formDTO, that, item, done);
            }
          }
          if (item.things == 1 && item.triggerConditions == 5) {
            // 提交流程
            if (formDTO.mainModel.ID) {
              this.handleStartFlow(
                that,
                formDTO.mainModel.ID,
                item.flowKey,
                item,
                done
              );
            } else {
              this.addSaveFlow(formDTO, that, item.flowKey, item, done);
            }
          }
          if (item.things == 1 && item.triggerConditions == 7) {
            // 保存提交流程
            if (formDTO.mainModel.ID) {
              this.editSaveFlow(formDTO, that, item.flowKey, item, done);
            } else {
              this.addSaveFlow(formDTO, that, item.flowKey, item, done);
            }
          }
        } else {
          return false;
        }
        if (item.things == 1 && item.triggerConditions == 9) {

        }
      });
    },
    getFormData(row) {
      let columnFields = this.columnList;
      // 点击保存之前需要特殊处理的控件值
      columnFields.forEach(ele => {
        if (ele.type == "number") {
          if (row[ele.prop] === undefined) {
            row[ele.prop] = null;
          }
        }
        if (ele.type == "switch") {
          console.log(row[ele.prop]);
          if (row[ele.prop] == false) {
            row[ele.prop] = 0;
          } else {
            row[ele.prop] = 1;
          }
        }
      });
      let arr = [];
      let deleteId = [];
      this.fileUpload.forEach(ele => {
        row[ele.prop] = ele.data;
      });
      this.imgUpload.forEach(ele => {
        row[ele.prop] = ele.data;
      });
      this.dynamicTable.forEach(ele => {
        ele.groupModel.forEach(el => {
          row[el.modelName] = el.infoData;
          /*
          let obj = {};
          obj.modelName = el.modelName;
          obj.modelFields = el.infoData;
          arr.push(obj);
           */
          if (!el.delId || el.delId.length == 0) {
            return;
          }
          deleteId.push(el.delId);
        });
      });
      let formDTO = {
        dataId: this.id,
        dataType: this.type,
        mainModel: row,
        childModel: arr,
        deleteList: deleteId
      };
      return formDTO;
    },
    //新增保存
    rowSave(row, done, loading) {
      let formDTO = this.getFormData(row);
      add(formDTO).then(
        () => {
          this.$message({
            type: "success",
            message: "新增成功!"
          });
          this.api();

          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    //行修改
    rowUpdate(row, done, loading) {
      let formDTO = this.getFormData(row);
      update(formDTO).then(
        () => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dynamicTable.forEach(ele => {
            ele.groupModel.forEach(el => {
              el.delId = [];
            });
          }); //修改后，将delId数组清空
          // this.api();
          this.search(this.selectQuery)
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    //行删除
    rowDel(row) {
      let formDTO = {
        dataId: this.id,
        dataType: this.type,
        ids: row.ID
      };
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(formDTO);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // this.api();
          this.search(this.selectQuery)
        });
    },
    //批量删除
    batchDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      let formDTO = {
        dataId: this.id,
        dataType: this.type,
        ids: this.ids
      };
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(formDTO);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
          // this.api();
          this.search(this.selectQuery)
        });
    },
    //表格多选事件
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
    // 动态列表接口，获取数据
    api() {
      this.loading = true;
      var obj = {
        modelId: this.id,
        modelType: this.type,
        queryPage: {
          current: this.page.currentPage,
          size: 10,
          extQueryList: []
        },
        mainModel: this.addObject.mainModel
      };
      getList(obj).then(res => {
        let arr = res.data.data.records;
        if(!arr){
          this.loading = false;
          return;
        }
        arr.forEach(ele => {
          this.columnList.forEach(el => {
            if (el.type == "multipleSelect") {
              if (ele[el.prop]) {
                ele[el.prop] = ele[el.prop].toString().split(",");
              } else {
                ele[el.prop] = [];
              }
            }
          });
          this.columnList.forEach(el => {
            if (el.type == "userSelect") {
              if (ele[el.prop]) {
                ele[el.prop] = ele["$" + el.prop];
              }
            }
          });
        });
        this.data = arr;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },

    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 40px'
    }
  }
};
</script>
<style  scoped>
@import '../../styles/tool/dynamic.css';
</style>>
