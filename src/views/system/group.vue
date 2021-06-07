<template>
     <basic-container class="sx_group">
        <el-form :inline="true" label-width="130px" class="sx_model_search sx_formItem">
            <el-row>
                <el-col :span='10'>
                    <el-form-item label="群组编号:">
                        <el-input v-model="search_form.groupCode" placeholder="请输入群组编号" clearable size="small"  @keyup.enter.native="handleQuery"/>
                    </el-form-item>
                </el-col>
                <el-col :span='10'>
                    <el-form-item label="群组名称:">
                        <el-input v-model="search_form.groupName" placeholder="请输入群组名称" clearable size="small"  @keyup.enter.native="handleQuery"/>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                  <el-button-group>
                  <el-button type="primary" icon="el-icon-search" size="small" @click="searchChange()">查询</el-button>
                  <el-dropdown @command="dropdownMenu">
                        <el-button type="primary" size="small"><i class="el-icon-arrow-down"></i></el-button>
                        <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item command="clear">清空</el-dropdown-item >
                        <el-dropdown-item command="spread">{{isShow ? '收起' : '展开'}}</el-dropdown-item>
                        </el-dropdown-menu>
                  </el-dropdown>
                  </el-button-group>
               </el-col>
            </el-row>
            <collapse v-show='isShow'>
               <el-row>
                  <el-col :span="10">
                     <el-form-item label="群组描述:">
                        <el-input v-model="search_form.remark" placeholder="请输入群组描述" clearable size="small"  @keyup.enter.native="handleQuery"/>
                     </el-form-item>
                  </el-col>
               </el-row>
            </collapse>
        </el-form>
        <div class="table-space">
            <avue-crud  ref='crud'
                        :data='data'
                        :option='option'
                        :table-loading="loading"
                        :page="page"
                        @selection-change="selectionChange"
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        :cell-style="cellStyle"
                        :row-style="rowStyle">
                <template slot-scope="scope" slot="menuLeft">
                  <el-button type="primary" icon="el-icon-plus" size="small" @click='add'>新增</el-button>
                  <el-button type="primary" icon="el-icon-download" size="small">导入</el-button>
                  <el-button type="primary" icon="el-icon-upload2" size="small">导出</el-button>
                  <el-button type="danger" icon="el-icon-delete" plain size="small" @click='delList()'>删除</el-button>
                </template>
                <template slot-scope="scope" slot="menu">
                  <el-button type="text" size="small" icon="el-icon-view" @click.stop="look(scope.row)">查看</el-button>
                  <el-button type="text" size="small" icon="el-icon-edit" @click.stop="edit(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" icon="el-icon-delete" @click="rowDel(scope.row)">删除</el-button>
                </template>
            </avue-crud>
      </div>
      <template slot-scope="{row}"
         slot="poatName">
         <el-tag>{{row.poatName}}</el-tag>
      </template>
      <template slot-scope="{row}"
         slot="userName">
         <el-tag>{{row.userName}}</el-tag>
      </template>
      <el-dialog :title="title" :visible.sync="dialogFormVisible" append-to-body class="sx_dialog">
          <el-form :inline="true" label-width="130px" :show-message="showmessage"  :rules="rules" ref="ruleForm" :model="add_form"  class="sx_model_search sx_formItem">
             <el-row>
                <el-col :span='24'>
                   <el-form-item label="群组编号:" prop="groupCode">
                        <el-input v-model="add_form.groupCode" placeholder="请输入群组编号" clearable size="small"  @keyup.enter.native="handleQuery" :disabled="disabled"/>
                    </el-form-item>
                </el-col>
             </el-row>
             <el-row>
                <el-col :span='24'>
                   <el-form-item label="群组名称:" prop="groupName">
                        <el-input v-model="add_form.groupName" placeholder="请输入群组名称" clearable size="small"  @keyup.enter.native="handleQuery" :disabled="disabled"/>
                    </el-form-item>
                </el-col>
             </el-row>
             <el-row>
                  <el-col :span="24">
                     <el-form-item label="群组描述:">
                        <el-input v-model="add_form.remark" placeholder="请输入群组描述" clearable size="small"  @keyup.enter.native="handleQuery" :disabled="disabled"/>
                     </el-form-item>
                  </el-col>
               </el-row>
               <el-row>
                  <el-col :span="24">
                     <el-form-item label="组织:">
                        <avue-input-tree multiple size='small' v-model="add_form.deptList" placeholder="请选择组织" type="tree" :dic="dic" :disabled="disabled"></avue-input-tree>
                     </el-form-item>
                  </el-col>
               </el-row>
               <el-row>
                  <el-col :span="24">
                     <el-form-item label="岗位:">
                        <el-select v-model="add_form.postGroupList"  multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="postMethod" :loading="loading1" size='small' :disabled="disabled">
                              <el-option v-for='item in postGroups'
                                          :key='item.id'
                                          :label="item.label"
                                          :value="item.value">
                              </el-option>
                        </el-select>
                     </el-form-item>
                  </el-col>
               </el-row>
               <el-row>
                  <el-col :span="24">
                     <el-form-item label="用户:">
                        <el-select v-model="add_form.userGroupList"  multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="userMethod" :loading="loading2" size='small' :disabled="disabled">
                              <el-option
                                 v-for="item in userGroups"
                                 :key="item.id"
                                 :label="item.label"
                                 :value="item.value">
                              </el-option>
                           </el-select>
                     </el-form-item>
                  </el-col>
               </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
             <el-button type="primary" @click="submit('ruleForm')" size='small' class="el-icon-circle-plus-outline sx_group_btn">保 存</el-button>
             <el-button @click="abolish('ruleForm')" size='small' class="el-icon-circle-close">取 消</el-button>
          </div>
      </el-dialog>
    </basic-container>
</template>
<script>
import {getDeptTree} from "@/api/system/dept";
import {postDetail,user_code,getList,add,remove,detail} from '@/api/system/group'
export default {
   data() {
      return {
         rules:{
            groupCode: [{ required: true, trigger: "blur" }],
            groupName: [{ required: true, trigger: "blur" }]
         },
         clickquery:'',
         disabled:false,
         showmessage:false,
         title:'新增',
         dic:[],
         postGroups:[],
         userGroups:[],
         selectList:[],
         dialogFormVisible: false,
         page:{
            pageSize: 10,
            currentPage: 1,
            total: 0
         },
         search_form:{
            groupCode:'',
            groupName:'',
            remark:'',
         },
         add_form:{
            groupCode:'',
            groupName:'',
            remark:'',
            deptList:[],
            postList:[],
            userList:[],
            postGroupList:[],
            userGroupList:[]
         },
         loading:false,
         loading1:false,
         loading2:false,
         isShow: false,
         data:[],
         option:{
            refreshBtn:false,
            delBtn:false,
            editBtn:false,
            viewBtn:false,
            index:true,
            tip:false,
            indexLabel:'序号',
            align:'center',
            menuAlign:'center',
            headerAlign: "center",
            border:true,
            columnBtn:false,
            addBtn:false,
            selection: true,
            selectClearBtn: false,
            reserveSelection: true,
            column:[
               {
                  label:'编号',
                  prop:'groupCode'
               },
               {
                  label:'名称',
                  prop:'groupName'
               },
               {
                  label:'描述',
                  prop:'remark'
               }
            ]
         }
      }
   },
   methods: {
      //查看禁用
      disable(){
         if(this.title==='查看'){
            this.disabled=true
         }else{
            this.disabled=false
         }
      },
      //查看
      look(row){
       this.title='查看'
       this.disable()
       this.dialogFormVisible = true
       const id=row.id
       this.options(id)
       const btn=document.querySelector('.sx_group_btn')
       btn.style='display:none;'
      },
      dropdownMenu(command) {
      //搜索下拉菜单
      switch (command) {
        case "clear":
          this.clearSearch();
          break;
        case "spread":
          this.Doshow();
          break;
      }
      },
    //搜索的展开收起
    Doshow() {
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
   },
   //弹框的所有数据为空
    clearList(){
       this.add_form={
          groupCode:'',
          groupName:'',
          remark:'',
          deptList:[],
          postList:[],
          userList:[],
          postGroupList:[],
          userGroupList:[]
       }
    },
    clearSearch() {
      //搜索模块的清空
      for (let i in this.search_form) {
        this.search_form[i] = "";
      }
   },
   //当前页
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.searchChange();
    },
    //当前条数
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.searchChange();
    },
    //多选
    selectionChange(list) {
      this.selectList = list;
    },
    //多选删除
    delList() {
      //多选删除
      if (this.selectList.length === 0) {
        this.$message.warning("至少选中一条数据");
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
          this.searchChange()
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    //新增弹框
    add(){
       this.title='新增'
       this.disable()
       this.clearList()
       this.dialogFormVisible = true
       const btn=document.querySelector('.sx_group_btn')
       btn.style='display:inline-block;'
    },
    //编辑弹框
    edit(row){
       this.title='编辑'
       this.disable()
       const id=row.id
       this.options(id)
       this.dialogFormVisible = true
       const btn=document.querySelector('.sx_group_btn')
       btn.style='display:inline-block;'
    },
    //转option的label，value
      options(id){
       const that=this
       detail(id).then(res=>{
          this.add_form.postGroupList=[]
          this.add_form.userGroupList=[]
          that.postGroups=res.data.data.postList
          that.userGroups=res.data.data.userList
          res.data.data.postList.forEach(item=>{
             this.add_form.postGroupList.push(JSON.stringify(item))
          })
          res.data.data.userList.forEach(item=>{
             this.add_form.userGroupList.push(JSON.stringify(item))
          })
          that.postGroups.forEach(item=>{
             const arr={id:item.id,code:item.code,name:item.name}
             item.label=`${item.name}(${item.code})`
             item.value=JSON.stringify(arr)
          })
          that.userGroups.forEach(item=>{
             const arr={id:item.id,code:item.code,name:item.name}
             item.label=`${item.name}(${item.code})`
             item.value=JSON.stringify(arr)
          })
          this.add_form.groupName=res.data.data.groupName
          this.add_form.groupCode=res.data.data.groupCode
          this.add_form.remark=res.data.data.remark
          this.add_form.deptList=res.data.data.deptList
          this.add_form.id=res.data.data.id

       })
      },
    //取消
    abolish(ruleForm){
      this.$refs[ruleForm].resetFields();
      this.dialogFormVisible = false
      this.clearList()
    },
    //保存
    submit(ruleForm){
       this.$refs[ruleForm].validate(valid => {
          if (valid) {
            const row=this.add_form
            if(row.postGroupList){
               row.postGroupList.forEach(item=>{
                  row.postList.push(JSON.parse(item))
               })
            }
            if(row.userGroupList){
               row.userGroupList.forEach(item=>{
                  row.userList.push(JSON.parse(item))
               })
            }
            if(this.title==='新增'){
               add(row).then(()=>{
                  this.searchChange()
                  this.$message({
                     type:'success',
                     message:'操作成功!'
                  })
                  this.clearList()
                  this.dialogFormVisible=false
               })
            }else if(this.title==='编辑'){
                  add(row).then(()=>{
                  this.searchChange()
                  this.$message({
                     type:'success',
                     message:'操作成功!'
                  })
                  this.clearList()
                  this.dialogFormVisible=false
               })
            }else if(this.title==='查看'){
               this.dialogFormVisible=false
               this.clearList()
            }
          }else{
             return false;
          }
        });
    },
    //删除
    rowDel(row) {
      //删除
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.searchChange()
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    //查询
    searchChange(){
      this.loading = true;
      var obj = {
          current: this.clickquery == 1 ? this.page.currentPage : 1,
          size: this.page.pageSize,
          extQueryList: [
            {
              field: "groupCode",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.search_form.groupCode,
                  upperValue: ""
                }
              ]
            },
            {
              field: "groupName",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.search_form.groupName,
                  upperValue: ""
                }
              ]
            },
            {
              field: "remark",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.search_form.remark,
                  upperValue: ""
                }
              ]
            }
          ]
        }
        getList(obj).then(res => {
          this.data = res.data.data.records;
          this.loading = false;
          this.page.total = res.data.data.total;
        });
        this.clickquery = "";
    },
   //岗位下拉搜索
   postMethod(val){
      if (val !== '') {
         this.loading1 = true;
         postDetail(val).then(res=>{
            this.postGroups=res.data.data
            this.postGroups.forEach(item=>{
                  const arr={id:item.id,code:item.postCode,name:item.postName}
                  item.label=`${item.postName}(${item.postCode})`
                  item.value=JSON.stringify(arr)
            })
            this.loading1 = false;
         })
        } else {
          this.postGroups = [];
        }
   },
   cellStyle(){
     return 'padding: 0'
   },

   rowStyle(){
     return 'height: 35px'
   },
   //用户下拉搜索
   userMethod(val){
      if (val !== '') {
         this.loading2 = true;
         user_code(val).then(res=>{
            this.userGroups=res.data.data
            this.userGroups.forEach(item=>{
               const arr={id:item.id,code:item.account,name:item.realName}
               item.label=`${item.realName}(${item.account})`
               item.value=JSON.stringify(arr)
            })
            this.loading2 = false;
         })
        } else {
          this.userGroups = [];
        }
   },
   //组织树回调地狱
    TreeFor(children){
       children.forEach(item=>{
          item.label=item.title
          item.value=item.id
          if(item.children){
             this.TreeFor(item.children)
          }
       })
    }
   },
   created() {
     // 组织
     this.searchChange()
      getDeptTree().then(res=>{
         this.dic=res.data.data
         this.dic.forEach(item=>{
             item.label=item.title
             item.value=item.id
             if(item.children){
                this.TreeFor(item.children)
             }
         })
      })
   },
   computed:{
      ids() {
      let ids = [];
      this.selectList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
   }
}
</script>
<style scoped lang="scss">
  @import "../../styles/system/group.scss";
   @import "../../styles/model/model.css";
</style>
