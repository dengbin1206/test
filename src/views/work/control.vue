<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud  ref='crud' :data='data' :option='option' :table-loading="loading" :page="page"   @selection-change="selectionChange"  @size-change="sizeChange"  @current-change="currentChange" :cell-style="cellStyle" :row-style="rowStyle">
            <template slot-scope="scope" slot="menu">
                  <el-button type="text" size="small" icon="el-icon-s-flag" @click.stop="open(scope.row)">查看审批</el-button>
                  <el-button type="text" size="small" icon="el-icon-view" @click.stop="accredits(scope.row)">授权查看</el-button>
                  <el-button type="text" size="small" icon="el-icon-picture-outline" @click.stop="lookImg(scope.row)">流程监控图</el-button>
                  <el-button type="text" size="small" icon="el-icon-refresh-right" @click.stop="recaption(scope.row)" v-show="scope.row.status==1">强制转办</el-button>
                  <el-button type="text" size="small" icon="el-icon-delete" @click.stop="rowDel(scope.row)" v-show="scope.row.status==1" style="color:red">强制作废</el-button>
            </template>
            <template slot-scope="scope" slot="status">
                <el-tag type="warning" v-if="scope.row.status === 1"
                >处理中</el-tag
                >
                <el-tag type="success" v-if="scope.row.status === 2"
                >已完成</el-tag
                >
                <el-tag type="danger" v-if="scope.row.status === 3"
                >已作废</el-tag
                >
            </template>
            <template slot-scope="{ row }" slot="procDefVersion">
                <el-tag>v{{ row.procDefVersion }}</el-tag>
            </template>
        </avue-crud>
        <diaVisLog ref="sonV"></diaVisLog>
        <el-dialog
            title="授权"
            width="60%"
            :show-close="false"
            :visible.sync="accredit"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>授权用户:</div></el-col>
                <el-col :span="22">
                    <el-select
                        style="width:100%"
                        v-model="accreditDic"
                        multiple
                        filterable
                        remote
                        size="small"
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                        v-for="item in accreditData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                @click="accredit = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="accreditSub"
                >确 定</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="转办"
            width="60%"
            :show-close="false"
            :visible.sync="zbAload"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>转办人:</div></el-col>
                <el-col :span="22">
                    <el-select
                        style="width:100%"
                        v-model="zbState"
                        multiple
                        filterable
                        remote
                        size="small"
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                        v-for="item in zbOption"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                        <p style="margin:0px 10px">{{item.realName}}({{item.account}}) — {{item.deptName}}</p>
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                @click="zbAload = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="zbASub"
                >确 定</el-button
                >
            </span>
        </el-dialog>
        <arrImg ref="aImg"></arrImg>
    </basic-container>
</template>

<script>
import { getDeptTree } from "@/api/system/dept";
import { myToDoList,userBySearch,adminDelegateTask,getUserInfoBySearch } from "@/api/work/todo";
import { queryAllList,impowerProcess,retrieve,adminTask } from "@/api/work/work";
import diaVisLog from './dialog'
import arrImg from './arrImg'
export default {
  components:{
    diaVisLog,
    arrImg
  },
  data() {
    return {
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "instId",
              label: "事务编号:",
              placeholder: "请输入事务编号"
            },
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "流程发起日期:",
              placeholder: "环节到达日期"
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
              prop: "userName",
              label: "发起人姓名:",
              placeholder: "请输入发起人姓名"
            },
            {
              type: "fuzzySearch",
              queryType: "2",
              prop: "dbUserId",
              label: "待办处理人:",
              placeholder: "请输入待办处理人",
              url: "/api/blade-user/userBySearch?search=",
              data: []
            }
          ],
          [
            {
              type: "tree",
              prop: "deptId",
              label: "发起部门:",
              dic: this.treedata,
              placeholder: "请输入发起部门"
            },
            {
              type: "select",
              queryType: "1",
              prop: "status",
              label: "事务状态:",
              list: [
                {
                  dictValue:'处理中',
                  dictKey:1
                },{
                  dictValue:'已完成',
                  dictKey:2
                },{
                  dictValue:'已作废',
                  dictKey:3
                }
              ],
              placeholder: "请选择事务状态"
            },
          ]
        ]
      },
      treedata: [],
      data: [],
      selectQuery: {},
      option: {
        menuWidth: 450,
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
            prop: "procDefName",
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
            label: "发起人",
            prop: "userName",
            width: 80
          },
          {
            label: "发起人部门",
            prop: "deptName",
            width: 120
          },
          {
            label: "上一处理人",
            prop: "lastUserName",
            width: 90
          },
          {
            label: "事务状态",
            prop: "status",
            slot: true,
            width: 80
          },
          {
            label: "待办处理环节",
            prop: "taskName",
            width: 120
          },
          {
            label: "待办处理人",
            prop: "dbUserName",
            width: 100
          },
          {
            label: "流程发起时间",
            prop: "createTime",
            width: 150
          },
          {
            label: '发起公司',
            prop: 'companyName',
            width:180
          },
          {
            label: "版本",
            prop: "procDefVersion",
            slot: true,
            width: 60
          },
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
      accredit:false,
      accreditDic:[],
      accreditData:[],
      proInstId:'',
      zbAload:false,
      zbState:[],
      zbOption:[],
      zbText:'',
      zbARow:{
          proInstId:'',
      },
      imgLod:true,
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
      queryAllList(obj).then(res => {
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
          dbUserIds: val.dbUserId
        },
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
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
            field: "status",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.status,
                upperValue: ""
              }
            ]
          },
        ]
      };
      queryAllList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    open(row){
      this.$refs.sonV.confirmProcess(this.dialog,row,0,'')
    },
    //授权
    accredits(row){
      this.proInstId=row.proInstId,
      this.accreditDic=''
      this.accreditData=[]
      this.accredit=true

    },
    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 35px'
    },
    remoteMethod(query){
        if(query!=''){
            var params={
               search:query
            }
            this.zbloading=true
            setTimeout(() => {
              this.zbloading = false;
              getUserInfoBySearch(params).then(res=>{
                    this.zbOption=res.data.data
              })
          }, 200);
        }else{
            this.zbOption=[]
        }
    },
    accreditSub(){
      impowerProcess(this.proInstId,this.accreditDic).then(res=>{
        if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.accredit=false
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
      })
    },
    //强制转办
    recaption(row){
      this.zbState=[]
      this.zbOption=[]
      this.zbText=[]
      this.zbARow.proInstId=''
      this.zbAload=true
      this.zbARow.proInstId=row.proInstId
    },
    //确认强制转办
    zbASub(){
        var params={
            proInstId:this.zbARow.proInstId,
            userIds:this.zbState,
        }
        adminDelegateTask(params).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.zbAload = false;
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
        })
    },
    //强制作废
    rowDel(row){
        var params={
            proInstId:row.proInstId
        }
         this.$confirm('确定是否强制作废', '提示', {
          confirmButtonText: '确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          adminTask(params).then(res=>{
                  if(res.data.code=='200'){
                       this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.api()
                  }else{
                      this.$message.error(res.data.msg)
                  }
              })
        }).catch(()=>{
          this.$message({
                        type: 'warning',
                        message: '取消强制作废'
                    });
        })
    },
    //流程监控图
    lookImg(row){
            this.$refs.aImg.open(this.imgLod,row)
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
  }
};
</script>
