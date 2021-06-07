<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud  ref='crud' :data='data' :option='option' :table-loading="loading" :page="page"   @selection-change="selectionChange"  @size-change="sizeChange"  @current-change="currentChange" :cell-style="cellStyle" :row-style="rowStyle">
            <template slot-scope="scope" slot="menu">
                  <el-button type="text" size="small" icon="el-icon-chat-dot-round" @click.stop="reply(scope.row)">回复</el-button>
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
            <template slot-scope="scope" slot="readStatus">
                <el-tag type="warning" v-if="scope.row.readStatus === 0"
                >未读</el-tag
                >
                <el-tag type="success" v-if="scope.row.readStatus === 1"
                >已读</el-tag
                >
                <el-tag type="danger" v-if="scope.row.readStatus === ''"
                >全部</el-tag
                >
            </template>
        </avue-crud>
        <diaVisLog ref="sonV"></diaVisLog>
    </basic-container>
</template>

<script>
import diaVisLog from './dialog'
import { getDeptTree } from "@/api/system/dept";
import { myToDoList,historyInfo,updateInstCopys } from "@/api/work/todo";
import { instCopyReply } from "@/api/work/work";
import { changeCopyStatus } from "@/api/mobile";
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
              type: "radio",
              prop: "readStatus",
              label: "已读状态:",
              list:[{
                  label:'未读',
                  value:0
              },{
                  label:'已读',
                  value:1
              },{
                  label:'全部',
                  value:''
              }]
            },
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "抄送日期:",
              placeholder: "抄送日期"
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
              prop: "createUserName",
              label: "发起人姓名:",
              placeholder: "请输入发起人姓名"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "createUserName",
              label: "抄送人姓名:",
              placeholder: "请输入抄送人姓名"
            },
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
            label: "抄送人",
            prop: "createUserName",
            width: 80
          },
          {
            label: "抄送时间",
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
            label: "已读状态",
            prop: "readStatus",
            slot:true,
            width: 80
          },
          {
            label: "事务状态",
            prop: "instStatus",
            slot: true,
            width: 80
          },
          {
            label: '发起公司',
            prop: 'companyName',
            width:180
          },
        ]
      },
      loading: false,
      visible:false,
      dialog:true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      clickquery: "",
      selectionList: [],
      BasicInfo:{},
      flowActivityVOList:[],
      flowInstanceCopyList:[],
      taskName:'',
      comment:'',
      id:'',
      readStatus:''
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
      instCopyReply(obj).then(res => {
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
            field: "readStatus",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.readStatus,
                upperValue: ""
              }
            ]
          },
          {
            field: "createTime",
            expressionList: [
              {
                operator: "BT",
                lowerValue: val.createTime?val.createTime[0]:'',
                upperValue: val.createTime?val.createTime[1]:'',
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
            field: "createUserName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.createUserName,
                upperValue: ""
              }
            ]
          },
          {
            field: "createUserName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.createUserName,
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
      instCopyReply(obj).then(res => {
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
    },
    reply(row){
      this.$refs.sonV.confirmProcess(this.dialog,row,2,'回复意见')
      if(row.readStatus==0){
        changeCopyStatus(row.proInstId).then(res=>{
          if(res.data.code=='200'){
            this.api()
          }
        })
      }
    },
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
      this.searchOption.rows[3][1].dic = this.treedata;
    });
    this.api();
  }
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
