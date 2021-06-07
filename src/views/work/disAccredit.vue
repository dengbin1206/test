<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud  ref='crud' :data='data' :option='option' :table-loading="loading" :page="page"   @selection-change="selectionChange"  @size-change="sizeChange"  @current-change="currentChange" :cell-style="cellStyle" :row-style="rowStyle">
            <template slot-scope="scope" slot="menu">
                  <el-button type="text" size="small" icon="el-icon-s-flag" @click.stop="open(scope.row)">查看审批意见</el-button>
            </template>
            <template slot-scope="scope" slot="instStatus">
                <el-tag type="warning" v-if="scope.row.instStatus === 1"
                >处理中</el-tag
                >
                <el-tag type="success" v-if="scope.row.instStatus === 2"
                >已完成</el-tag
                >
                <el-tag type="danger" v-if="scope.row.instStatus === 3"
                >已作废</el-tag
                >
            </template>
        </avue-crud>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>

<script>
import diaVisLog from './dialog'
import { getDeptTree } from "@/api/system/dept";
import { powerMeList,deleteInstCopy,updateInstCopy,historyInfo } from "@/api/work/todo";
export default {
  components:{
      diaVisLog
  },
  data() {
    return {
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "userName",
              label: "发起人姓名:",
              placeholder: "请输入发起人姓名"
            },
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "被授权日期:",
              placeholder: "被授权日期"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "instId",
              label: "事务编号:",
              placeholder: "请输入事务编号"
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "procAlias",
              label: "流程名称:",
              placeholder: "请输入流程名称",
              url: "/api/blade-flow/model/getFlowModelBySearch?search=",
              data: []
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "title",
              label: "事务标题:",
              placeholder: "请输入事务标题"
            },
            {
              type: "input",
              queryType: "1",
              prop: "impowerUserName",
              label: "授权人姓名:",
              placeholder: "请输入授权人姓名"
            },
          ],
          [
            {
              type: "tree",
              prop: "deptId",
              label: "发起部门:",
              dic: this.treedata,
              placeholder: "请输入发起部门"
            }
          ]
        ]
      },
      treedata: [],
      data: [],
      selectQuery: {},
      option: {
        menuWidth: 200,
        tip: false,
        addBtn: false,
        delBtn: false,
        page: true,
        index: true,
        refreshBtn: false,
        border: true,
        columnBtn: false,
        cancelBtn: false,
        editBtn: false,
        selection: true,
        searchBtn: false,
        stripe: true,
        selectClearBtn: false,
        reserveSelection: true,
        indexLabel: "序号",
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        column: [
          {
            label: "流程名称",
            prop: "flowName",
            width: 150
          },
          {
            label: "事务编号",
            prop: "instId",
            width: 80
          },
          {
            label: "事务标题",
            prop: "title",
            width: 250
          },
          {
            label: "授权人",
            prop: "impowerUserName",
            width: 80
          },
          {
            label: "被授权时间",
            prop: "createTime",
            width: 150
          },
          {
            label: "发起人",
            prop: "userName",
            width: 80
          },
          {
            label: "发起部门",
            prop: "deptName",
            width: 120
          },
          {
            label: "事务状态",
            prop: "instStatus",
            slot: true,
            width: 80
          }
        ]
      },
      loading: false,
      dialog:true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      clickquery: "",
      selectionList: [],
    };
  },
  methods: {
    //发起部门树回调地狱
    treeChildren(child) {
      if (child) {
        child.forEach(ele => {
          ele.label = ele.title;
          if (ele.children) {
            this.treeChildren(ele.children);
          }
        });
      }
    },
    //多选
    selectionChange(list) {
      this.selectionList = list;
    },
    //每页条数
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.search(this.selectQuery);
    },
    //当前页
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //列表接口，获取数据
    api() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: []
      };
      powerMeList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },
    //查询
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        data: {
          userIds: []
        },
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "createTime",
            expressionList: [
              {
                operator: "BT",
                lowerValue: val.createTime?val.createTime[0]:'',
                upperValue: val.createTime?val.createTime[1]:''
              }
            ]
          },
          {
            field: "instId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.instId,
                upperValue: ""
              }
            ]
          },
          {
            field: "procAlias",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.procAlias,
                upperValue: ""
              }
            ]
          },
          {
            field: "title",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.title,
                upperValue: ""
              }
            ]
          },
          {
            field: "userName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.userName,
                upperValue: ""
              }
            ]
          },
          {
            field: "impowerUserName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.impowerUserName,
                upperValue: ""
              }
            ]
          },
          {
            field: "deptId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.deptId,
                upperValue: ""
              }
            ]
          }
        ]
      };
      powerMeList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    open(row){
      this.$refs.sonV.confirmProcess(this.dialog,row,0,'')
    },
    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 35px'
    }
  },
  created() {
    //发起部门
    getDeptTree().then(res => {
      this.treedata = res.data.data;
      this.treedata.forEach(ele => {
        ele.label = ele.title;
        if (ele.children) {
          this.treeChildren(ele.children);
        }
      });
      this.searchOption.rows[3][0].dic = this.treedata;
    });
    this.api();
  },

};
</script>
<style lang="scss" scoped>
.searchBox {
  width: 100%;
}

@mixin tableStyle {
  table.gridtable {
    width: 100%;
    font-family: verdana, arial, sans-serif;
    font-size: 12px;
    color: #60626d;
    border-width: 1px;
    border-color: #ebeef5;
    border-collapse: collapse;
  }
  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    width: 100px;
    text-align: center;
    border-style: solid;
    border-color: #ebeef5;
    background-color: #ffffff;
  }

  table.gridtable td:nth-of-type(even) {
    width: 400px;
  }

  table.gridtable .file_list li {
    list-style: none !important;
    text-align: left;
    margin-top: 2px;

    a {
      color: #0079fe;
    }
  }
}

.top {
  border: 1px dashed #ccc;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  @include tableStyle;
}

.middle {
  margin-top: 10px;
  .form {
    height: 50vh;
  }
}

.bottom {
  margin-top: 10px;
  .process {
    @include tableStyle;
  }
}

.copyInfo {
  margin-top: 10px;
  @include tableStyle;
}

.comment {
  @extend .top;
  margin-top: 10px;
  table.gridtable td:nth-of-type(odd) {
    width: 100px !important;
  }
}
</style>
