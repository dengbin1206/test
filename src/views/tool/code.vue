<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :page="page"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.code_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-refresh"
                   @click="handleBuild">代码生成
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   icon="el-icon-document-copy"
                   v-if="permission.code_edit"
                   plain
                   class="none-border"
                   @click.stop="handleCopy(scope.row)">复制
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getCode, build, remove, add, update, copy} from "@/api/tool/code";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        loading: true,
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          height: 'auto',
          calcHeight: 30,
          dialogWidth: 900,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          selection: true,
          labelWidth: 120,
          viewBtn: true,
          dialogClickModal: false,
          column: [
            {
              label: "数据源",
              prop: "datasourceId",
              search: true,
              span: 24,
              type: "select",
              dicUrl: "/api/blade-develop/datasource/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择数据源",
                trigger: "blur"
              }]
            },
            {
              label: "模块名",
              prop: "codeName",
              search: true,
              rules: [{
                required: true,
                message: "请输入模块名",
                trigger: "blur"
              }]
            },
            {
              label: "服务名",
              prop: "serviceName",
              search: true,
              rules: [{
                required: true,
                message: "请输入服务名",
                trigger: "blur"
              }]
            },
            {
              label: "表名",
              prop: "tableName",
              rules: [{
                required: true,
                message: "请输入表名",
                trigger: "blur"
              }]
            },
            {
              label: "表前缀",
              prop: "tablePrefix",
              hide: true,
              rules: [{
                required: true,
                message: "请输入表前缀",
                trigger: "blur"
              }]
            },
            {
              label: "主键名",
              prop: "pkName",
              hide: true,
              rules: [{
                required: true,
                message: "请输入主键名",
                trigger: "blur"
              }]
            },
            {
              label: "包名",
              prop: "packageName",
              overHidden: true,
              rules: [{
                required: true,
                message: "请输入包名",
                trigger: "blur"
              }]
            },
            {
              label: "基础业务",
              prop: "baseMode",
              type: 'radio',
              dicUrl: "/api/blade-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dataType: "number",
              hide: true,
              rules: [{
                required: true,
                message: "请选择基础业务",
                trigger: "blur"
              }]
            },
            {
              label: "包装器",
              prop: "wrapMode",
              type: 'radio',
              dicUrl: "/api/blade-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dataType: "number",
              hide: true,
              rules: [{
                required: true,
                message: "请选择包装器",
                trigger: "blur"
              }]
            },
            {
              label: "后端生成路径",
              prop: "apiPath",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: "请输入后端生成路径",
                trigger: "blur"
              }]
            },
            {
              label: "前端生成路径",
              prop: "webPath",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: "请输入前端生成路径",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.code_add, false),
          viewBtn: this.vaildData(this.permission.code_view, false),
          delBtn: this.vaildData(this.permission.code_delete, false),
          editBtn: this.vaildData(this.permission.code_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      //新增数据后点击确定触发该事件
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);//从新加载
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      //编辑数据后确定触发该事件
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);//重新加载
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      //行数据删除时触发该事件
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      //清空搜索回调方法
      searchReset() {
        this.query = {};
        this.onLoad(this.page);//重新加载
      },
      //点击搜索后触发该事件
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);//重新加载
        done();
      },
      //当选择项发生变化时会触发该事件
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      //删除数据
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
            this.onLoad(this.page);//重新加载
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      //代码生成
      handleBuild() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("是否生成选中模块的代码?", {
          title: "代码生成确认",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return build(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);//重新加载
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      //复制
      handleCopy(row) {
        copy(row.id).then(() => {
          this.onLoad(this.page);//重新加载
          this.$message({
            type: "success",
            message: "复制成功!"
          });
        });
      },
      //打开前的回调，会暂停Dialog的打开function(done,type)，done用于关闭Dialog,type为当前窗口的类型
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getCode(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      //切换页面时触发该事件
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      //页面每页显示的条数触发该事件
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      //点击刷新按钮触发该事件
      refreshChange() {
        this.onLoad(this.page, this.query);//重新加载
      },
      onLoad(page, params = {}) {//重新加载
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style scoped  lang="scss">
  .none-border {
    border: 0;
    background-color: transparent !important;
  }
</style>
