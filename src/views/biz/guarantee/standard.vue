<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud :option="option"
                    :data="data"
                    :page="page"
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    :cell-style="cellStyle"
                    :row-style="rowStyle">
                    <template slot-scope="scope" slot="menuLeft">
                        <el-button icon="el-icon-plus" size="small" type="primary"  @click="open">新增</el-button>
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button icon="el-icon-edit" size="small" type="text"  @click="edit(scope.row)">编辑</el-button>
                        <el-button icon="el-icon-delete" size="small" type="text"  @click="rowDel(scope.row)" style="color:red">删除</el-button>
                    </template>
        </avue-crud>
        <el-dialog
            v-dialog
            title="测试项目标准"
            top='8vh'
            :visible.sync="dialogVisible"
            append-to-body
            width="75%"
            :close-on-click-modal='false'>
            <el-form :model="addList"  :rules="rules" ref="ruleForm" label-width="120px"   class="sx_formItem">
                <el-row>
                    <el-col :span='12'>
                        <el-form-item label="报告名称:" prop="reportId">
                            <el-select size="small" v-model="addList.reportId"  filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getCheckProject" @change="reportChange">
                                <el-option
                                    v-for="item in checkProjectOption"
                                    :key="item.id"
                                    :label="item.reportName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="检测项目:" prop="checkProjectId">
                            <el-select size="small" v-model="addList.checkProjectId">
                              <el-option
                                    v-for="item in checkProjectIds"
                                    :key="item.id"
                                    :label="item.checkProject"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='12'>
                      <el-form-item label="测点位置:" prop="itemTitle">
                            <el-input size='small' v-model='addList.itemTitle' placeholder="请输入测点位置"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="测点位置明细:" prop="itemParam">
                            <el-input size='small' v-model='addList.itemParam' placeholder="请输入测点位置明细"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px">
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
                <el-button @click="close('ruleForm')" size="small" icon="el-icon-close">取 消</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>
<script>
import { list,submit,remove,detail,reportTypeBySearch } from "@/api/biz/guarantee/standard";
import { standardByReportId } from "@/api/biz/guarantee/orderTicket";
export default {
  methods: {
   rowStyle(){
      return 'height: 35px'
    },
    cellStyle(){
      return 'padding: 0'
    },
    open(){
        this.btnLoading=false
        this.dialogVisible=true
        this.addList={}
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "reportId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.reportId,
                upperValue: ""
              }
            ]
          },
          {
            field: "id",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.id,
                upperValue: ""
              }
            ]
          },
        ]
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    onLoad() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: []
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },
    //当前页
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //当前条数
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    reportChange(){
      delete this.addList.checkProjectId
      standardByReportId(this.addList.reportId).then(res=>{
        this.checkProjectIds=res.data.data
      })
    },
    subBtn(formName) {
      this.$refs[formName].validate(valid => {
        if(valid){
          this.btnLoading=true
        submit(this.addList).then(res => {
            if(res.data.code==200){
                this.onLoad();
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
                this.dialogVisible=false
            }else{
                this.$message({
                    type: "error",
                    message: res.data.msg
                });
                this.btnLoading=false
            }
        }, error => {
            console.log(res.data.msg)
        });
        }
        
      })
        
      },
    close(formName){
      this.$refs[formName].resetFields();
      this.dialogVisible=false
    },
    edit(row){
        this.addList={}
        this.checkProjectOption=[]
        this.dialogVisible=true
        this.btnLoading=false
        detail(row.id).then(res=>{
            this.addList=res.data.data
            this.checkProjectOption.push({checkProject:res.data.data.checkProject,reportName:res.data.data.reportName,id:res.data.data.reportId})
            standardByReportId(this.addList.reportId).then(res=>{
              this.checkProjectIds=res.data.data
            })
        })
    },
    rowDel(row){
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
    },
    getCheckProject(query){
        if(query!=''){
            reportTypeBySearch(query).then(res=>{
                this.checkProjectOption=res.data.data
            })
        }else{
            this.checkProjectOption=[]
        }
    }
  },
  created() {
    this.onLoad()
  },
  data() {
    return {
      addList:{},
      btnLoading:false,
      checkProjectOption:[],
      checkProjectIds:[],
      dialogVisible:false,
      loading: false,
      rules:{
        reportId: [
          { required: true, message: "请选择报告名称", trigger: "blur" }
        ],
        checkProjectId: [
          { required: true, message: "请选择检测项目", trigger: "blur" }
        ],
        itemTitle: [
          { required: true, message: "请输入测点位置", trigger: "blur" }
        ],
        itemParam: [
          { required: true, message: "请输入测点位置明细", trigger: "blur" }
        ],
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
      selectQuery: "",
      clickquery: "",
      segmentIndustrys:[],
      searchOption: {
        rows: [
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "reportId",
              label: "报告名称:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/report/reportTypeBySearch?search='
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "id",
              label: "测点位置:",
              placeholder: "请输入关键字",
              url:'api/blade-crm/checkItem/standardByTitle?search='
            },
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 200,
        tip: false,
        page: true,
        index: true,
        refreshBtn: false,
        border: true,
        columnBtn: false,
        cancelBtn: false,
        selection: true,
        searchBtn: false,
        deleteBtn: false,
        stripe: true,
        selectClearBtn: false,
        reserveSelection: true,
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        labelWidth: 120,
        column: [
            {
            label: '报告名称',
            prop: 'reportName',
            },
            {
              label: '检测项目',
              prop: 'checkProject',
            },
            {
            label: '测点位置',
            prop:'itemTitle'
            },
            {
            label: '测点位置明细',
            prop:'itemParam'
            }
        ],
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
