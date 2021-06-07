<template>
  <basic-container>
    <div style="margin:0;border-left:3px solid #028FFF">{{modelTitle}}</div>
    <avue-crud
      :data="dataList"
      class="sx_dynamic_Table"
      ref="crud"
      v-model="form"
      :option="option"
      :table-loading="loading"
      @row-update="rowUpdate"
      @selection-change="selectionChange"
      :page.sync="page"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      @on-load="onLoad"
      v-if="option.column.length > 0"
    >
      <template slot-scope="{row,index}" slot="menu">
        <el-button
          type="text"
          icon="el-icon-delete"
          style="color:red"
          size="small"
          @click="rowDel(row,index)"
        >删除</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import iconList from "@/config/iconList";
import { getChildModel } from "@/api/tool/dynamic";
export default {
  //  props:{
  //    fieldData:{
  //      type:Object,
  //      default:()=>(
  //           {}
  //      )
  //    },
  //    modelName:{
  //      type:String,
  //      default:''
  //    },
  //  data:{
  //    type:Array,
  //    default:()=>{
  //      []
  //    }
  //  },
  //  delId:{
  //   type:Array,
  //    default:()=>{
  //      []
  //    }
  //  },
  //  mainId:{
  //    type:String,
  //    default:''
  //  }
  //  },
  props: [
    "fieldData",
    "modelName",
    "data",
    "mainId",
    "delId",
    "modelTitle",
    "addEditView",
    "id",
    "type"
  ],
  data() {
    return {
      obj: {},
      form: {},
      loading: false,
      clickquery: "", // 点击页码改变当前页
      dataList: this.data,
      columnList: [], //表格列配置信息
      singleCheckbox: [], //表格中单个复选框
      switchList: [], //表格中开关
      timeList: [], //表格中时间
      selectionList: [], //表格多选的数据
      delListId: this.delId, //删除的行Id
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      option: {
        menu:false,
        height: 350,
        addBtn: false,
        editBtn: false,
        cellBtn: false,
        addRowBtn: false,
        menuWidth: 70,
        delBtn: false,
        cancelBtn: false,
        menuAlign: "center",
        border: true,
        tip: false,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        selection: true,
        labelWidth: 120,
        loading: false,
        headerAlign:"center",
        //align: "left",
        dialogClickModal: false,
        column: []
      }
    };
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  watch: {
    dataList: {
      handler(val) {
        this.$emit("update:data", val);
      },
      deep: true
    },
    delListId: {
      handler(val) {
        this.$emit("update:delId", {
          modelName: this.modelName,
          idList: val
        });
      },
      deep: true
    }
  },
  created() {
    // this.getType()
  },
  mounted() {
    this.init();
    this.option.addRowBtn= false;
    this.option.selection = false;
    this.option.menu = false;
    if (this.addEditView == "view") {
      this.$nextTick(() => {
        let list = document.querySelectorAll(".sx_dynamic_Table .avue-crud__menu");
        list.forEach(ele=>{
            ele.style.display = "none";
        })
      });
    }
    if(this.addEditView == 'edit' || this.addEditView == 'add'){
      // 新增行按钮
      this.option.addRowBtn= true;
      // 选中行
      //this.option.selection = true;
      // 操作列
      this.option.menu = true;
    }
  },
  methods: {
    init() {
      // 生成表格控件
      for (let i = 0; i < this.fieldData.length; i++) {
        let data = this.fieldData[i];
        let column = this.getColumnList(data);
        column.addDisabled = data.addDisabled;
        column.editDisabled = data.editDisabled;
        column.addDisplay = data.addDisplay;
        column.fixed = data.fixed;
        column.placeholder = data.formPlaceholder;
        if (data.columnLength) {
          column.width = data.columnLength;
        }
        column.dicData = data.dicData;
        column.hide = true;
        column.cell = false;
        if (this.addEditView == "add") {
          column.hide = !data.addDisplay;
          column.cell = !data.addDisabled;
        }
        if (this.addEditView == "edit") {
          column.hide = !data.editDisplay;
          column.cell = !data.editDisabled;
        }
        if (this.addEditView == "view") {
          column.hide = !data.viewDisplay;
        }
        column.editDisplay = data.editDisplay;
        column.addRequired = data.addRequired;
        column.editRequired = data.editRequired;
        column.viewDisplay = data.viewDisplay;
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
        }
        // 日期配置
        if (column.type == "date") {
          //this.$set(column, "type", "daterange");
          this.$set(column, "format", "yyyy-MM-dd");
          this.$set(column, "valueFormat", "yyyy-MM-dd");
        }
        // 日期时间配置
        if (column.type == "datetime") {
          // this.$set(column, "type", "datetimerange");
          this.$set(column, "format", "yyyy-MM-dd HH:mm:ss");
          this.$set(column, "valueFormat", "yyyy-MM-dd HH:mm:ss");
          this.$set(column, "width", 100);
          this.$set(column, "show-overflow-tooltip", true);
        }
        // 时间配置
        if (column.type == "time") {
          this.timeList.push({
            prop: column.prop,
            type: "time"
          });
          // this.$set(column, "type", "timerange");
          this.$set(column, "format", "HH:mm:ss");
          this.$set(column, "valueFormat", "HH:mm:ss");
          this.$set(column, "slot", true);
        }
        // 下拉模糊搜索配置
        if (column.type == "fuzzySearch") {
          this.$set(column, "type", "select");
          this.$set(column, "remote", true);
          this.$set(column, "multiple", true);
          this.$set(
            column,
            "dicUrl",
            `/api/blade-dynamic/dynamicConfig/selectSearch?fieldDictField=${data.fieldDictField}&fieldDictRemark=${data.fieldDictRemark}&fieldDictTable=${data.fieldDictTable}&search={{key}}`
          );
          this.$set(column, "props", {
            label: "role_name",
            value: "role_alias"
          });
        }
        delete column["isShowColumn"];
        this.option.column.push(column);
      }
      console.log(this.option.column)
    },
    //表格多选事件
    selectionChange(list) {
      this.selectionList = list;
    },
    //行删除
    rowDel(row, index) {
      this.$confirm("确定删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dataList.splice(index, 1);
        if (row.ID) {
          this.delListId.push(row.ID);
        }
      });
    },
    onLoad() {
      let obj = {
        childModelName: this.modelName,
        mainDataId: this.mainId,
        dataId: this.id,
        dataType: this.type,
        modelFieldQueryVOList: this.fieldData,
        query: {
          current: 0,
          size: 0
        }
      };
      this.loading = true;
      getChildModel(obj).then(res => {
        if (res.data.code == 200) {
          let arr = res.data.data.modelData;
          arr.forEach(ele => {
            ele.$cellEdit = true;
          });
          this.dataList = arr;
          this.loading = false;
        }
      });
    },

    rowUpdate(form, index, done) {
      done();
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
</style>
