<template>
  <basic-container>
    <el-form ref="form" :inline="true" label-width="80px" class="sx_search-form">
      <el-row>
        <el-col :span="11">
          <el-form-item label="部件选择:">
            <el-select
              v-model="componentCode"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
              placeholder="请选择部件"
              style="width:100%"
              @change="getSelectComponent"
            >
              <el-option
                v-for="item in componentCodeList"
                :key="item.componentCode"
                :label="item.componentName"
                :value="item.componentCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="11">
          <el-form-item label="工序选择:">
            <el-select
              v-model="procedureCode"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
              placeholder="请选择工序"
              style="width:100%"
              @change="getSelectProcedure"
            >
              <el-option
                v-for="item in procedureCodeList"
                :key="item.procedureCode"
                :label="item.procedureRemark"
                :value="item.procedureCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- <div class="sx_search-right">
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery()">查询</el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="primary" size="small">
                <i class="el-icon-arrow-down"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="clear">清空</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div> -->
      </el-row>
    </el-form>
    <avue-crud
      ref="crud"
      @row-dblclick="dbclick"
      :data="data"
      :option="option"
      :table-loading="loading"
      @current-change="currentChange"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      @refresh-change="refreshChange"
      :page.sync="page"
    >
      <template slot="menuLeft">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="newArr">插入行</el-button>
        <el-button type="danger" size="small" icon="el-icon-circle-close" @click="deleteData">删 除</el-button>
        <el-button type="primary" size="small" icon="el-icon-document" @click="savePart">保 存</el-button>
        <el-button type="primary" size="small" icon="el-icon-download" @click="jyImport">导 入</el-button>
        <el-button type="primary" size="small" icon="el-icon-upload2" @click="derive">导 出</el-button>
        <!-- 上传 -->
      </template>
      <template slot="deleteFlag" slot-scope="scope">
        <el-checkbox v-model="scope.row.deleteFlag" :true-label="1" :false-label="0"></el-checkbox>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  submit,
  remove,
  getParts,
  getProcedure
} from "@/api/quality/test";
export default {
  data() {
    return {
      componentCode: "",
      procedureCode: "",
      componentCodeList: [],
      procedureCodeList: [],
      data: [],
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      selectionList: [], //表格多选数据
      selectQuery: {}, //查询条件
      clickquery: "",
      // searchOption: {
      //   rows: [
      //     [
      //       {
      //         type: "select",
      //         queryType: "1",
      //         prop: "impowerUserName",
      //         label: "部件选择:",
      //         placeholder: "请选择部件",
      //         list: []
      //       },
      //       {
      //         type: "select",
      //         queryType: "1",
      //         prop: "createTime",
      //         label: "工序选择:",
      //         placeholder: "请选择工序",
      //         list: []
      //       }
      //     ]
      //   ]
      // },
      option: {
        border: true,
        menu: false,
        addBtn: false,
        columnBtn: false,
        refreshBtn: true,
        tip: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        height: "57vh",
        selection: true,
        column: [
          {
            prop: "testProjectCode",
            label: "项目编号",
            width: 170,
            cell: true,
            slot: true
          },
          {
            prop: "testProjectName",
            label: "检验项目",
            width: 210,
            cell: true
          },
          {
            prop: "projectEnglishRemark",
            label: "检验项目英文描述",
            width: 240,
            cell: true
          },
          {
            prop: "testRequire",
            label: "标准要求",
            width: 210,
            cell: true
          },
          {
            prop: "requireEnglishRemark",
            label: "标准要求英文描述",
            width: 240,
            cell: true
          },
          {
            prop: "testMethod",
            label: "检验方法",
            width: 210,
            cell: true
          },
          {
            prop: "methodEnglishRemark",
            label: "检验方法英文描述",
            width: 240,
            cell: true
          },
          {
            prop: "deleteFlag",
            label: "删除标记",
            slot: true,
            width: 80
          },
          {
            prop: "updateTime",
            type: "date",
            label: "变更日期",
            width: 160
          }
        ]
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
  created() {
    getParts().then(res => {
      this.componentCodeList = res.data.data;
    });
    // getProcedure().then(res => {
    //   this.procedureCodeList = res.data.data;
    // });
    this.api();
  },
  methods: {
    dropdownMenu(command) {
      //搜索下拉菜单
      switch (command) {
        case "clear":
          this.$refs["form"].resetFields();
          break;
      }
    },
    // 增加
    newArr() {
      var newArr = {
        testProjectCode: "",
        testProjectName: "",
        projectEnglishRemark: "",
        testRequire: "",
        requireEnglishRemark: "",
        testMethod: "",
        methodEnglishRemark: "",
        deleteFlag: "0",
        updateTime: ""
      };
      this.data.unshift(newArr);
      this.$refs.crud.rowCell(this.data[0], 0);
      //   this.newData.unshift(newArr);
    },
    //保存
    savePart() {
      if(!this.componentCode){
        this.$message.warning('请选择部件')
        return;
      }
      let obj = {
        qualityTestProjectEntityList: this.data,
        componentCode:this.componentCode,
        // procedureCode:this.procedureCode
      };
      submit(obj).then(res => {
        this.$message.success(res.data.msg);
        this.api();
      });
    },
    getSelectComponent(value){
        this.handleQuery()
    },
    getSelectProcedure(value){

    },
    //表格刷新
    refreshChange(){
      this.api();
    },
    //删除
    deleteData() {
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
    // 双击触发编辑框
    dbclick(row) {
      this.$refs.crud.rowCell(row, row.$index);
    },
    //搜索
    handleQuery() {
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
              field: "componentCode",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.componentCode,
                  upperValue: ""
                }
              ]
            },
            // {
            //   field: "procedureCode",
            //   expressionList: [
            //     {
            //       operator: "EQ",
            //       lowerValue: this.procedureCode,
            //       upperValue: ""
            //     }
            //   ]
            // },
        ]
      };
      getList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    jyImport() {},
    derive() {},
    selectionChange(list) {
      this.selectionList = list;
    },
    //修改页码
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.handleQuery();
    },
    //修改页面数量
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.handleQuery();
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
        this.componentCode = '';
        // this.procedureCode = '';
      });
    }
  }
};
</script>

<style scoped>
</style>