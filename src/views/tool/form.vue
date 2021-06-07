<template>
  <basic-container>
    <!-- <el-form :inline="true" label-width="100px" class="sx_search-form" v-model="form">
  <el-row>
    <el-col :span="11">
      <el-form-item label="表单名称:">
         <el-input v-model="form.formName" placeholder="请输入表单名称" clearable size="small"/>
      </el-form-item>
    </el-col>
   <el-col :span="11">
      <el-form-item label="表单编码:">
         <el-input v-model="form.formCode" placeholder="请输入表单编码" clearable size="small"/>
      </el-form-item>
    </el-col>
  </el-row>
  <div class="sx_search-right">
    <el-button-group>
      <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      <el-dropdown @command="dropdownMenu">
        <el-button type="primary" size="small">
          <i class="el-icon-arrow-down"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="clear">清空</el-dropdown-item>
          <el-dropdown-item command="spread">{{isShow ? '收起' : '展开'}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-button-group>
  </div>
</el-form> -->
    <Search :option="searchOption" @search="search"></Search>
    <avue-crud :data="data"
               class="sx_form_delete"
               ref="crud"
               :option="option"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @current-change="currentChange"
               @size-change="sizeChange"
               @selection-change="selectionChange"
               :page.sync="page"
               :cell-style="{padding: '0'}"
               :row-style="{height: '40px'}"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger" size="small" plain icon='el-icon-delete' @click="batchDelete()">删除</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" icon='el-icon-setting' @click='displayer(scope.row)'>设计表单</el-button>
        <!-- <el-button :size="size" :type="type">表单数据</el-button> -->
        <!-- <el-button type="text" size="small">配置地址</el-button> -->
        <el-button type="text" size="small" @click="showView(scope.row)">解析</el-button>
        <!-- <el-button type="text" size="small" icon='el-icon-video-play' @click="showView(scope.row)">解析预览</el-button> -->
      </template>
    </avue-crud>
    <template>
      <div class='sx_form_box' v-show='show'>
        <Index ref="mychild" @close="close" :rowData="rowData" :formData="formRowData"/>
      </div>
    </template>
    <el-dialog width="70%" :append-to-body="true" :visible.sync="cmodel" :title= "itemOption.formName" :before-close="handleClose" modal-append-to-body="false">
      <form-view v-if="cmodel" :data="itemOption"></form-view>
    </el-dialog>
  </basic-container>
</template>
<script>
import Index from '@/forms/utils/index.vue';
import formView from "@/components/formView/formView";
import {mapGetters} from "vuex";
import {getformList, add, update, remove, formDetail} from '@/api/tool/form';
 
export default {
  components: {
    Index,
    formView
  },
  data() {
    return {
      itemOption:{},
      cmodel: false,
      searchOption: {
        rows: [
          [
            {
              type: "input",
              prop: "formCode",
              label: "表单编码:",
              placeholder: "请输入表单编码"
            },
            {
              type: "input",
              prop: "formName",
              label: "表单名称:",
              placeholder: "请输入表单名称"
            }
          ]
        ]
      },
      data: [],
      selectionList: [],
      rowData: {},
      show: false,
      formRowData: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        menuWidth: 380,
        menuAlign: 'center',
        //addBtn:true,
        border: true,
        tip: false,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        selection: true,
        loading: false,
        delBtn:false,
        align: 'center',
        column: [
 
          {
            label: '表单编码',
            prop: 'formCode',
          },
          {
            label: '表单名称',
            prop: 'formName',
          },
          {
            label: '移动视图',
            prop: 'view',
            editDisplay: false,
            addDisplay: false,
          }
        ]
      }
    }
  },
  created() {
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
  methods: {
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    async showView(row){
      console.log("showView-row:"+JSON.stringify(row));     
      this.itemOption = {
         id: row.id
      };
      //this.$router.push('/tool/analysis/'+row.id);
      this.cmodel = true;
    },
    //设计表单   初始化表单并显示表单后台控件
    displayer(row) {
      this.rowData = row;
      formDetail(row.id).then(res => {
        this.$nextTick(() => {
          if (res.data.data) {
            let data = res.data.data;
            if (data.formVO.jsonText) {
              let json = JSON.parse(data.formVO.jsonText);
              json.readonly = this.initBool(json.readonly)
              json.detail = this.initBool(json.detail);
              json.disabled = this.initBool(json.disabled);
              data.formVO.jsonText = JSON.stringify(json);
            }
            this.formRowData = this.deepClone(data);
            this.$refs.mychild.getList();
          }
        })
      })
      this.show = true;
    },
    initBool(data) {
      return data == '1'
    },
    //关闭
    close() {
      this.show = false;
    },
    //查询
    search(val) {
      this.form = val;
      let params = {}
      this.onLoad(this.page, params)
    },
    //新增
    rowSave(row, done, loading) {
      let formDTO = {
        "formVO": row
      }
      add(formDTO).then(() => {
        this.$message({
          type: "success",
          message: "新增成功!"
        });
        this.onLoad(this.page);
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    //行修改
    rowUpdate(row, index, done, loading) {
      let formDTO = {
        "formVO": row
      }
      update(formDTO).then(() => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.onLoad(this.page);
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    //行删除
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
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.onLoad(this.page);
        });
    },
    //批量删除
    batchDelete() {
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
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
          this.onLoad(this.page);
        });
    },
    //改变当前页码
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page)
    },
    // 改变表格条数
    sizeChange(pageSize) {
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.onLoad(this.page)
    },
    //表格多选事件
    selectionChange(list) {
      this.selectionList = list;
    },
    //获取数据列表
    onLoad(page, params = {}) {
      this.loading = true;
      getformList(page.currentPage, page.pageSize, Object.assign(params, this.form)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        //this.selectionClear();
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.el-dialog__body{
  padding: 30px;
  border-top: 1px solid #eee;
}
.sx_form_box {
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: #fff;
}
 
.sx_form_delete {
  .cell button:nth-child(2) {
    color: red;
  }
}
</style>