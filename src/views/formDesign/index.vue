<template>
  <basic-container>
    <Search :option="searchOption" @search="search"></Search>
    <div class="sx_post_table-space" id="sx_post_table">
      <avue-crud
        :option="option"
        :table-loading="loading"
        :data="data"
        :page="page"
        ref="crud"
        :height="tableHeight"
        @row-update="rowUpdate"
        @row-save="rowSave"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
        <template slot="menuLeft">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            plain
            @click="handleDelete"
          >删 除</el-button
          >
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-setting"
            size="small"
            @click="formDesignerSetting(scope.row, scope.index)"
          >表单设计</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="formDelete(scope.row, scope.index)"
          >删 除</el-button
          >
          <el-button
            type="text"
            icon="el-icon-monitor"
            size="small"
            @click="funTest(scope.row, scope.index)"
          >功能测试</el-button
          >
        </template>
      </avue-crud>
    </div>

    <el-dialog
      fullscreen
      :visible.sync="dialogVisible"
      :show-close="false"
      append-to-body
      v-if="dialogVisible"
      custom-class="customDialog"
    >
      <sx-form-design
        style="height: 95vh"
        :options="options"
        storage
        @handleClose="handleClose"
        :currentRow="currentRow"
      ></sx-form-design>
    </el-dialog>

    <vxe-modal
      v-model="formTranslateVisible"
      :title="funTestTitle"
      show-zoom
      resize
      width="75%"
    >
      <div style="height: 75vh">
        <sxForm
          v-if="formTranslateVisible"
          :params="params"
          @onCancel="handleClose"
          ref="sxForm"
        ></sxForm>
      </div>
    </vxe-modal>
  </basic-container>
</template>

<script>
  import {
    queryList,
    saveOrUpdate,
    remove,
    rollModelInfo,
  } from "@/api/tool/formDesigner";
  import dialogComponent from "@/components/dialogComponent";
  import sxForm from "../modelAnalysis/sxForm";

  export default {
    components: {
      sxForm,
      dialogComponent,
    },
    data() {
      return {
        formTranslateVisible: false,
        funTestTitle: "新增",
        params:{},
        formCode: "",
        actionType: "",
        dialogVisible: false,
        options: { column: [] },
        //查询参数
        searchOption: {
          rows: [
            [
              {
                type: "input",
                queryType: "1",
                prop: "formCode",
                label: "表单编码:",
                placeholder: "请输入表单编码",
              },
              {
                type: "input",
                queryType: "1",
                prop: "formName",
                label: "表单名称:",
                placeholder: "请输入表单名称",
              },
            ],
            [
              {
                type: "multipleSelect",
                queryType: "1",
                prop: "formCategory",
                label: "表单分类:",
                placeholder: "请选择表单分类",
                list: this.formCategoryList,
              },
              {
                type: "input",
                queryType: "1",
                prop: "mainModelRemark",
                label: "主模型名称:",
                placeholder: "请输入主模型名称",
              },
            ],
          ],
        },
        tableHeight: 200,
        extQueryList: [], // 查询条件
        formCategoryList: [],
        mainModelList: [],
        data: [], //表格数据
        loading: true, //表格加载
        selectionList: [],
        currentRow: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: null,
        },
        option: {
          //printBtn:true,
          addBtn: true,
          delBtn: false,
          viewBtn: false,
          //height: "auto",
          //calcHeight: 30,
          tip: false,
          align: "center",
          addTitle: "新增表单",
          editTitle: "编辑表单",
          viewTitle: "显示表单",
          //searchShow: true,
          //searchMenuSpan: 6,
          border: true,
          refreshBtn: false,
          columnBtn: false,
          index: true,
          selection: true,
          dialogClickModal: false,
          menuWidth: 300,
          column: [
            {
              label: "id",
              prop: "id",
              width: 100,
              hide: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
            },
            {
              label: "表单编码",
              prop: "formCode",
              width: 150,
              rules: [
                {
                  required: true,
                  message: "请输入表单编码",
                  trigger: "blur",
                },
              ],
            },
            {
              label: "表单名称",
              prop: "formName",
              width: 200,
              rules: [
                {
                  required: true,
                  message: "请输入表单名称",
                  trigger: "blur",
                },
              ],
            },
            {
              label: "表单描述",
              prop: "formRemark",
            },
            {
              label: "表单分类",
              prop: "formCategory",
              type: "select",
              filterable: true,
              span: 12,
              dicData: [],
            },
            {
              label: "主模型",
              prop: "mainModel",
              type: "select",
              filterable: true,
              span: 12,
              dicData: [],
              rules: [
                {
                  required: true,
                  message: "请选择主模型",
                  trigger: "blur",
                },
              ],
            },
          ],
        },
      };
    },

    created() {
      // 表单分类
      this.getDicts("form_category").then((res) => {
        this.formCategoryList = [];
        if(res.data.data instanceof Array){
          this.formCategoryList = res.data.data;
        }
        this.searchOption.rows[1][0].list = this.formCategoryList;
        this.option.column.forEach((column) => {
          if (column.prop === "formCategory") {
            column.dicData = this.formCategoryList.map((item) => {
              return {
                label: item.dictValue,
                value: item.dictKey,
              };
            });
          }
        });
      });
      // 模型
      rollModelInfo().then((res) => {
        this.mainModelList = res.data.data;
        this.option.column.forEach((column) => {
          if (column.prop === "mainModel") {
            column.dicData = this.mainModelList.map((item) => {
              return {
                label: item.tableRemark,
                value: item.tableName,
              };
            });
          }
        });
      });
      this.api();
    },
    computed: {
      ids() {
        let ids = [];
        this.selectionList.forEach((ele) => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    mounted() {
      document.querySelector(".el-table").setAttribute("ref", "table");
    },
    methods: {
      //查询
      search(val) {
        this.extQueryList = [
          {
            field: "formCode",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.formCode,
                upperValue: "",
              },
            ],
          },
          {
            field: "formName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.formName,
                upperValue: "",
              },
            ],
          },
          {
            field: "formCategory",
            expressionList: val.formCategory,
          },
          {
            field: "mainModelRemark",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.mainModelRemark,
                upperValue: "",
              },
            ],
          },
        ];
        this.api();
      },
      //新增保存
      rowSave(row, done, loading) {
        saveOrUpdate(row).then(
          () => {
            this.api();
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            done();
          },
          (error) => {
            loading();
          }
        );
      },
      //编辑保存
      rowUpdate(row, index, done, loading) {
        saveOrUpdate(row).then(
          () => {
            this.api();
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            done();
          },
          (error) => {
            loading();
          }
        );
      },
      //行删除
      formDelete(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.api();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
      },
      // 表单设计
      formDesignerSetting(row) {
        // // this.visible = true;
        // this.dialogVisible = true;
        // this.currentRow = row;

        this.$router.push({
          path: "/formDesign",
          query: {
            id: row.id,
          },
        });
      },
      //批量删除
      handleDelete() {
        if (this.selectionList && this.selectionList.length > 0) {
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              return remove(this.ids);
            })
            .then(() => {
              this.api();
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.$refs.crud.toggleSelection();
            });
        } else {
          this.$message.warning("请选择至少一条数据");
          return;
        }
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      //修改页码
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
        this.api();
      },
      //修改页面数量
      sizeChange(pageSize) {
        this.page.currentPage = 1;
        this.page.pageSize = pageSize;
        this.api();
      },
      // 表单列表接口，获取数据
      api() {
        this.loading = true;
        var obj = {
          current: this.page.currentPage,
          size: this.page.pageSize,
          extQueryList: this.extQueryList,
        };
        queryList(obj).then((res) => {
          this.data = res.data.data.records;
          this.loading = false;
          this.page.total = res.data.data.total;
        });
      },

      handleClose() {
        this.dialogVisible = false;
        this.formTranslateVisible = false;
      },

      funTest(row) {
        this.params.actionType = "add";
        this.params.formCode = row.formCode;
        this.funTestTitle = "新增" + row.formName;
        this.formTranslateVisible = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  // /deep/.el-dialog__header {
  //   border-bottom: none;
  //   display: none;
  // }

  /deep/.customDialog {
    background-color: #606266 !important;
  }
</style>
