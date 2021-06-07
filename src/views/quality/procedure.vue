<template>
  <basic-container>
    <avue-crud
      ref="crud"
      @row-dblclick="dbclick"
      :data="data"
      :option="option"
      :table-loading="loading"
      @current-change="currentChange"
      @size-change="sizeChange"
      @selection-change="selectionChange"
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
      <!-- <template slot="componentCode" slot-scope="scope">
        <el-input
          v-if="scope.row.componentCode==''"
          size="mini"
          v-model="scope.row.componentCode"
          placeholder="请输入部件编码"
        ></el-input>
        <span v-else>{{scope.row.componentCode}}</span>
      </template>
      <template slot="componentName" slot-scope="scope">
        <el-input
          v-if="scope.row.componentName==''"
          size="mini"
          v-model="scope.row.componentName"
          placeholder="请输入部件检验记录名称"
        ></el-input>
        <span v-else>{{scope.row.componentName}}</span>
      </template>
      <template slot="componentRemark" slot-scope="scope">
        <el-input
          v-if="scope.row.componentRemark==''"
          size="mini"
          v-model="scope.row.componentRemark"
          placeholder="请输入英文描述"
        ></el-input>
        <span v-else>{{scope.row.componentRemark}}</span>
      </template> -->
      <template slot="deleteFlag" slot-scope="scope">
       <el-checkbox  v-model="scope.row.deleteFlag" :true-label="1"  :false-label="0"></el-checkbox>
       <!-- <el-checkbox ></el-checkbox> -->
      </template>
    </avue-crud>
  </basic-container>
</template>
<script>
import { getList, submit,remove} from "@/api/quality/procedure";
export default {
  data() {
    return {
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
      option: {
        border: true,
        menu: false,
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        tip: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        height: "57vh",
        selection: true,
        column: [
          {
            prop: "procedureCode",
            label: "工序编码",
            width:120,
            cell: true
          },
          {
            prop: "procedureRemark",
            label: "工序描述",
            cell: true
          },
          {
            prop: "procedureEnglishRemark",
            label: "英文描述",
            cell: true
          },
          {
            prop: "deleteFlag",
            label: "删除标记",
            width: 80,
            type:'checkbox',
            slot:true,
            // cell:true
          },
          {
            prop: "updateTime",
            type: "date",
             width: 160,
            label: "变更日期",
            // cell: true
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
    this.api();
  },
  methods: {
      // 增加
    newArr() {
      var newArr = {
        procedureCode: "",
        procedureRemark: "",
        procedureEnglishRemark: "",
        deleteFlag: "0",
        updateTime: ""
      };
      this.data.unshift(newArr);
      this.$refs.crud.rowCell(this.data[0], 0);
    //   this.newData.unshift(newArr);
    },
    //保存
    savePart(){
        let obj = {
            qualityProcedureEntityList:this.data
        }
       submit(obj).then(res=>{
            this.$message.success(res.data.msg);
            this.api();
       })
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
    dbclick(row){
        this.$refs.crud.rowCell(row, row.$index);
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
    }
  }
};
</script>

<style scoped>
</style>