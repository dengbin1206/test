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
            v-if="permission.post_delete"
            @click="handleDelete"
          >删 除</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-printer"
            v-if="permission.post_delete"
            @click="handlePrint"
          >打 印</el-button>
        </template>
        <template slot-scope="scope" slot="category">
          <span>{{scope.label}}</span>
        </template>
        <template slot-scope="{row}" slot="deptId">
          <!-- <el-tag v-if="`${row.deptName}`">{{row.deptName}}</el-tag>
          <span v-else>{{row.deptName}}</span>-->
          <span>{{row.deptName}}</span>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="postDelete(scope.row,scope.index)"
          >删 除</el-button>
        </template>
      </avue-crud>
    </div>
  </basic-container>
</template>
<script>
import { getList, add, remove } from "@/api/system/post";
import { getDeptTree } from "@/api/system/dept";
import { mapGetters } from "vuex";
//import website from "@/config/website";
export default {
  data() {
    return {
      //查询参数
      searchOption: {
        rows: [
          [
            {
              type: "tree",
              prop: "deptId",
              label: "组织:",
              dic: this.treedata,
              placeholder: "请输入组织"
            },
            {
              type: "input",
              queryType :'1',
              prop: "postName",
              label: "岗位名称:",
              placeholder: "请输入岗位名称"
            }
          ],
          [
            {
              type: "input",
              queryType:'3',
              prop: "postCode",
              label: "岗位编号:",
              placeholder: "请输入岗位编号",
            },
            {
              type: "select",
              queryType:'3',
              prop: "category",
              label: "岗位等级:",
              placeholder: "请输入岗位等级",
              list: this.gwlx
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType: "2",
              prop: "userName",
              label: "用户:",
              placeholder: "请输入用户",
              url: "/api/blade-user/userBySearch?search=",
              data: []
            }
          ]
        ]
      },
      tableHeight: 200,
      clickquery: "",
      selectQuery: {}, //查询条件
      gwlx: [],
      treedata: [],
      data: [], //表格数据
      loading: true, //表格加载
      selectionList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      option: {
        //printBtn:true,
        addBtn: true,
        delBtn: false,
        //height: "auto",
        //calcHeight: 30,
        tip: false,
        align: "center",
        //searchShow: true,
        //searchMenuSpan: 6,
        border: true,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        menuWidth:200,
        column: [
          // {
          //   label: "所属租户",
          //   prop: "tenantId",
          //   type: "tree",
          //   dicUrl: "/api/blade-system/tenant/select",
          //   addDisplay: false,
          //   editDisplay: false,
          //   viewDisplay: website.tenantMode,
          //   //span: 24,
          //   props: {
          //     label: "tenantName",
          //     value: "tenantId"
          //   },
          //   hide: !website.tenantMode,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入所属租户",
          //       trigger: "click"
          //     }
          //   ]
          // },
          {
            label: "岗位等级",
            prop: "categoryName",
            type: "input",
            width: 100,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择岗位类型",
                trigger: "blur"
              }
            ]
          },
          {
            label: "岗位编号",
            prop: "postCode",
            width: 80,
            viewDisplay: true,
            rules: [
              {
                required: true,
                message: "请输入岗位编号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "岗位名称",
            prop: "postName",
            width: 110,
            rules: [
              {
                required: true,
                message: "请输入岗位名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "用户",
            prop: "userName",
            //remote: true,
            //width: 300,
            addDisplay: false,
            editDisplay: false,
            type: "select",
            multiple: true,
            //dicUrl: `/api/blade-user/userBySearch?search={{key}}`,
            props: {
              label: "realName",
              value: "id"
            },
            rules: [
              {
                required: true,
                message: "请选择用户",
                trigger: "blur"
              }
            ]
          },
          {
            label: "岗位排序",
            prop: "sort",
            type: "number",
            width: 70
          },
          {
            label:'上级岗位',
            prop:'parentId',
            type:'select',
            span:12,
            filterable:true,
            dicUrl:'/api/blade-system/post/select',
            props:{
              label:'postName',
              value:'id'
            },
            width:110
          },
          {
            label: "所属部门",
            prop: "deptId",
            type: "tree",
            width: 160,
            dicUrl: "/api/blade-system/dept/tree",
            props: {
              label: "title",
              value: "id"
            },
            slot: true
          },

          {
            label: "岗位状态",
            prop: "status",
            type: "radio",
            width: 70,
            value: 1,
            dicData: [
              {
                label: "正常",
                value: 1
              },
              {
                label: "停用",
                value: 2
              }
            ]
          },
          {
            label: "备注",
            prop: "remark",
            type: "textarea",
            span: 24,
            minRows: 6,
            width:160
            //hide: true
          }
        ]
      }
    };
  },
  created() {
    //岗位类型
    this.getDicts("post_category").then(res => {
      // this.selectoption.options = this.gwlx = res.data.data;
      this.gwlx = res.data.data;
      this.searchOption.rows[1][1].list = this.gwlx;
    });
    //组织
    getDeptTree().then(res => {
      this.treedata = res.data.data;
      this.treedata.forEach(ele => {
        ele.label = ele.title;
        if (ele.children) {
          this.treeChildren(ele.children);
        }
      });
      this.searchOption.rows[0][0].dic = this.treedata;
    });
    this.api();
  },
  watch: {},
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
  mounted() {
    //固定表头
    //this.tableHeight = window.innerHeight - this.$refs.crud.$el.offsetTop - 50;
    // 监听窗口大小变化
    // let self = this;
    // window.onresize = function() {
    //   self.tableHeight =
    //     window.innerHeight - self.$refs.crud.$el.offsetTop - 50;
    // };
   document.querySelector('.el-table').setAttribute('ref', "table")

  },
  methods: {
    //查询
    search(val) {
      this.selectQuery = val;
      this.loading = true;
        let obj = {
          data: {
            userIds: val.userName
          },
          current: this.clickquery == 1 ? this.page.currentPage : 1,
          size: this.page.pageSize,
          extQueryList: [
            {
              field: "deptId",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: val.deptId,
                  upperValue: ""
                }
              ]
            },
            {
              field: "postName",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: val.postName,
                  upperValue: ""
                }
              ]
            },
            {
              field: "postCode",
              expressionList: val.postCode
            },
            {
              field: "category",
              expressionList: val.category
            }
          ]
        };
        getList(obj).then(res => {
          this.data = res.data.data.records;
          this.loading = false;
          this.page.total = res.data.data.total;
        });
        this.clickquery = "";

    },
    //新增保存
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          this.api();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    //编辑保存
    rowUpdate(row, index, done, loading) {
      add(row).then(
        () => {
          this.api();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    //行删除
    postDelete(row) {
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
    handlePrint(){
       console.log(this.$refs)
      // this.$print({
      //   printable: '',
      //   type: 'html',
      //   style: style,// 亦可使用引入的外部css;
      //   scanStyles: false
      // })
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
    // 岗位列表接口，获取数据
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
    //组织树回调地狱
    treeChildren(child) {
      if (child) {
        child.forEach(ele => {
          ele.label = ele.title;
          if (ele.children) {
            this.treeChildren(ele.children);
          }
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../styles/system/post.scss";
@media print{
.avue-crud__menu{
  display:none;
}
}
</style>
