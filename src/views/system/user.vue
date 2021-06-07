<template>
  <el-row>
    <el-col :span="5">
      <div class="sx_user_style">
        <el-scrollbar>
          <basic-container>
            <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"/>
          </basic-container>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="19">
      <basic-container class="sx_user">
        <el-form :inline="true" label-width="130px" class="search-form">
          <el-row>
            <el-col :span="10">
              <el-form-item label="登陆账号:">
                <el-input v-model="search_form.account" placeholder="请输入登录账号" clearable size="small" maxlength="10" @keyup.enter.native="handleQuery"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="用户姓名:">
                <el-input v-model="search_form.realName" placeholder="请输入用户姓名" clearable size="small" maxlength="10" @keyup.enter.native="handleQuery"/>
              </el-form-item>
            </el-col>
            <el-col :span='4'>
              <el-button-group>
              <el-button type="primary" icon="el-icon-search" size="small" @click="searchChange()">查询</el-button>
              <el-dropdown @command="dropdownMenu">
                  <el-button type="primary" size="small"><i class="el-icon-arrow-down"></i></el-button>
                  <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item command="clear">清空</el-dropdown-item >
                  </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
            </el-col>
          </el-row>
        </el-form>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="data"
                   ref="crud"
                   v-model="form"
                   :permission="permissionList"
                   @row-del="rowDel"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   :before-open="beforeOpen"
                   :page="page"
                   @search-change="searchChange"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   @on-load="onLoad"
                   :cell-style="cellStyle"
                   :row-style="rowStyle">
          <template slot="menuLeft">
            <el-button type="primary"
                       size="small"
                       v-if="permission.user_role"
                       icon="el-icon-user"
                       @click="handleGrant">角色配置
            </el-button>
            <el-button size="small"
                        type="primary"
                       v-if="permission.user_reset"
                       icon="el-icon-refresh"
                       @click="handleReset">密码重置
            </el-button>
            <el-button type="primary"
                       size="small"

                       v-if="userInfo.role_name.includes('admin')"
                        icon="el-icon-download"

                       @click="handleImport">导入
            </el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-upload2"
                       v-if="userInfo.role_name.includes('admin')"

                       @click="handleExport">导出
            </el-button>
            <el-button type="primary"
                       size="small"
                       icon="el-icon-eleme"
                       v-if="userInfo.role_name.includes('admin')"

                       @click="handlePassword">密码转换
            </el-button>
            <el-button type="danger"
                       size="small"
                       plain
                       icon="el-icon-delete"
                       v-if="permission.user_delete"
                       @click="handleDelete">删 除
            </el-button>
          </template>
          <template slot-scope="{row}"
                    slot="tenantName">
            <el-tag>{{row.tenantName}}</el-tag>
          </template>
          <template slot-scope="{row}"
                    slot="roleName">
            <el-tag>{{row.roleName}}</el-tag>
          </template>
          <template slot-scope="{row}"
                    slot="deptName">
            <el-tag>{{row.deptName}}</el-tag>
          </template>
          <template slot-scope="{row}"
                    slot="concurrentDeptName">
            <el-tag>{{row.concurrentDeptName}}</el-tag>
          </template>
          <template slot-scope="{row}"
                    slot="concurrentPostName">
            <el-tag>{{row.concurrentPostName}}</el-tag>
          </template>
          <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-user"
            size="small"
            @click="personAuthZation(scope.row,scope.index)"
          >个性化授权</el-button>
        </template>
        </avue-crud>
        <el-dialog title="用户角色配置"
                   append-to-body
                   :visible.sync="roleBox"
                   width="345px">

          <el-tree :data="roleGrantList"
                   show-checkbox
                   check-strictly
                   default-expand-all
                   node-key="id"
                   ref="treeRole"
                   :default-checked-keys="roleTreeObj"
                   :props="props">
          </el-tree>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitRole" size="small">确 定</el-button>
            <el-button @click="roleBox = false" size="small">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog title="用户数据导入"
                   append-to-body
                   :visible.sync="excelBox"
                   width="555px">
          <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
            <template slot="excelTemplate">
              <el-button type="primary" @click="handleTemplate">
                点击下载<i class="el-icon-download el-icon--right"></i>
              </el-button>
            </template>
          </avue-form>
        </el-dialog>
        <el-dialog title="个性化授权"
                   append-to-body
                   :visible.sync="personAuth"
                   width="60%"
                  >
        <avue-crud :data="personData" :option="personOption" :table-loading="tableLoading" @selection-change="selectionPersonChange">
          <template slot-scope="scope" slot="menuLeft">
            <el-button type="danger" icon="el-icon-delete" size="small" plain @click.stop="PersonDelete">删除</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
           <el-checkbox v-model="scope.row.isUpdate" :checked="scope.row.isUpdate == 1 ? true :false" :true-label=1 :false-label=0>可 改</el-checkbox>
           <el-checkbox v-model="scope.row.isDelete" :checked="scope.row.isUpdate == 1 ? true :false" :true-label=1 :false-label=0>可 删</el-checkbox>
          </template>
          <template  slot="deptId" slot-scope="scope">
            <avue-input-tree  v-model="scope.row.deptId" placeholder="请选择内容" type="tree" :dic="depts"></avue-input-tree>
          </template>
          <template slot="includeDept" slot-scope="scope">
            <el-checkbox  v-model="scope.row.includeDept" :checked="scope.row.isUpdate == 1 ? true :false" :true-label=1 :false-label=0></el-checkbox>
          </template>
          <template slot="proxyUserIdList" slot-scope="scope">
           <el-select v-model="scope.row.proxyUserIdList" multiple filterable allow-create  default-first-option remote  placeholder="请输入人员"  :remote-method="(query)=>{selectPerson(query,scope.row)}" :loading="loading1" :disabled="!scope.row.deptId">
              <el-option v-for="item in scope.row.puinfo" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </avue-crud>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitPersonAuth" size="small">确 定</el-button>
            <el-button @click="personAuth = false" size="small">取 消</el-button>
          </span>
        </el-dialog>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
  import {
    getList,
    getUser,
    remove,
    update,
    add,
    grant,
    resetPassword,
    getLeader,
    getAuthTree,
    proxyPowerSubmit,
    getPersonAuth,
    personAuthDelete,
    toPassword
  } from "@/api/system/user";
  import {getDeptTree, getDeptLazyTree} from "@/api/system/dept";
  import {getRoleTree} from "@/api/system/role";
  import {getPostList} from "@/api/system/post";
  import {mapGetters} from "vuex";
  import website from '@/config/website';
  import {getToken} from '@/util/auth';
import { truncate } from 'fs';

  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        search_form:{
          realName:'',
          account:''
        },
        form: {},
        tableLoading:false,
        userId:'',
        loading1:false,//加载人员
        options1:[],
        depts: [],//授权部门
        roleBox: false,
        excelBox: false,
        personAuth:false,
        initFlag: true,
        selectionList: [],
        selectionPersonList:[],
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        init: {
          roleTree: [],
          deptTree: [],
        },
        props: {
          label: "title",
          value: "key"
        },
        roleGrantList: [],
        roleTreeObj: [],
        treeDeptId: '',
        treeData: [],
        treeOption: {
          nodeKey: 'id',
          lazy: true,
          treeLoad: function (node, resolve) {
            const parentId = (node.level === 0) ? 0 : node.data.id;
            getDeptLazyTree(parentId).then(res => {
              resolve(res.data.data.map(item => {
                return {
                  ...item,
                  leaf: !item.hasChildren
                }
              }))
            });
          },
          addBtn: false,
          menu: false,
          size: 'small',
          props: {
            labelText: '标题',
            label: 'title',
            value: 'value',
            children: 'children'
          }
        },
        //个性化授权
        personOption:{
            cancelBtn:false,
            editBtn:false,
            addBtn:false,
            viewBtn:false,
            addRowBtn:true,
            delBtn:false,
            menuWidth:180,
            tip: false,
            align: "center",
            border: true,
            refreshBtn: false,
            columnBtn: false,
            index: true,
            selection: true,
            dialogClickModal: false,
            column:[
              {
                label:"授权部门",
                prop:'deptId',
                slot:true,
              },
              {
                label:'包含子',
                prop:'includeDept',
                width:100,
                slot:true,
              },
              {
                label:'人员',
                prop:'proxyUserIdList',
                slot:true
              }
            ]
        },
        option: {
          height: 'auto',
          calcHeight: 5,
          menuWidth:300,
          tip: false,
          align:'center',
          searchShow: true,
          searchMenuSpan: 6,
          refreshBtn: false,
          columnBtn: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          //dialogType: 'drawer',
          dialogClickModal: false,
          column: [
            {
              sortable:true,
              label: "登录账号",
              prop: "account",
              display: false
            },
            {
              sortable:true,
              label: "所属租户",
              prop: "tenantName",
              slot: true,
              display: false
            },
            {
              sortable:true,
              label: "用户姓名",
              prop: "realName",
              display: false
            },
            {
              sortable:true,
              label: "所属角色",
              prop: "roleName",
              slot: true,
              display: false
            },
            {
              sortable:true,
              label: "所属部门",
              prop: "deptName",
              slot: true,
              display: false
            },
          ],
          group: [
            {
              label: '基础信息',
              prop: 'baseInfo',
              icon: 'el-icon-user-solid',
              column: [
                {
                  label: "登录账号",
                  prop: "account",
                  rules: [{
                    required: "true",
                    message:'请输入登录账号',
                    trigger: "blur"
                  }],
                  span: website.tenantMode ? 12 : 24,
                },
                {
                  label: "所属租户",
                  prop: "tenantId",
                  type: "tree",
                  dicUrl: "/api/blade-system/tenant/select",
                  props: {
                    label: "tenantName",
                    value: "tenantId"
                  },
                  hide: !website.tenantMode,
                  addDisplay: website.tenantMode,
                  editDisplay: website.tenantMode,
                  viewDisplay: website.tenantMode,
                  rules: [{
                    required: true,
                    message: "请选择所属租户",
                    trigger: "blur"
                  }]
                },
                {
                  label: "用户姓名",
                  prop: "realName",
                  rules: [{
                    required: true,
                    message: "请输入用户姓名",
                    trigger: "blur"
                  }, {
                    min: 2,
                    max: 5,
                    message: '姓名长度在2到5个字符'
                  }]
                },
                {
                  label: "用户昵称",
                  prop: "name",
                  hide: true,
                  rules: [{
                    required: true,
                    message: "请输入用户昵称",
                    trigger: "blur"
                  }]
                },
                {
                  label: '密码',
                  prop: 'password',
                  hide: true,
                  editDisplay: false,
                  viewDisplay: false,
                  rules: [{required: true, validator: validatePass, trigger: 'blur'}]
                },
                {
                  label: '确认密码',
                  prop: 'password2',
                  hide: true,
                  editDisplay: false,
                  viewDisplay: false,
                  rules: [{required: true, validator: validatePass2, trigger: 'blur'}]
                },
                {
                  label: "手机号码",
                  prop: "phone",
                  overHidden: true
                },
                {
                  label: "电子邮箱",
                  prop: "email",
                  hide: true,
                  overHidden: true
                },
                {
                  label: "用户性别",
                  prop: "sex",
                  type: "select",
                  dicData: [
                    {
                      label: "男",
                      value: 1
                    },
                    {
                      label: "女",
                      value: 2
                    },
                    {
                      label: "未知",
                      value: 3
                    }
                  ],
                  hide: true
                },
                {
                  label: "用户生日",
                  type: "date",
                  prop: "birthday",
                  format: "yyyy-MM-dd hh:mm:ss",
                  valueFormat: "yyyy-MM-dd hh:mm:ss",
                  hide: true
                },
                {
                  label: "用户编号",
                  prop: "code",
                }
              ]
            },
            {
              label: '职责信息',
              prop: 'dutyInfo',
              icon: 'el-icon-s-custom',
              column: [
                {
                  label: "所属角色",
                  prop: "roleId",
                  multiple: true,
                  type: "tree",
                  dicData: [],
                  props: {
                    label: "title"
                  },
                  checkStrictly: true,
                  slot: true,
                  rules: [{
                    required: false,
                    message: "请选择所属角色",
                    trigger: "click"
                  }],
                  span: website.tenantMode ? 24 : 24,
                },
                {
                  label: "主部门",
                  prop: "deptId",
                  type: "tree",
                  multiple: false,
                  dicData: [],
                  props: {
                    label: "title"
                  },
                  checkStrictly: true,
                  slot: true,
                  rules: [{
                    required: true,
                    message: "请选择所属部门",
                    trigger: "click"
                  }]
                },
                {
                  label: "兼职部门",
                  prop: "concurrentDeptId",
                  type: "tree",
                  multiple: true,
                  dicData: [],
                  props: {
                    label: "title"
                  },
                  checkStrictly: true,
                  slot: true,
                  rules: [{
                    required: false,
                    message: "请选择所属部门",
                    trigger: "click"
                  }]
                },
                {
                  label: "主岗位",
                  prop: "postId",
                  type: "tree",
                  multiple: false,
                  dicData: [],
                  props: {
                    label: "postName",
                    value: "id"
                  },
                  rules: [{
                    required: false,
                    message: "请选择所属岗位",
                    trigger: "click"
                  }],
                },
                {
                  label: "兼职岗位",
                  prop: "concurrentPostId",
                  type: "tree",
                  multiple: true,
                  dicData: [],
                  props: {
                    label: "postName",
                    value: "id"
                  },
                  rules: [{
                    required: false,
                    message: "请选择所属岗位",
                    trigger: "click"
                  }],
                },
              ]
            },
          ]
        },
        data: [],
        personData:[],
        excelForm: {},
        excelOption: {
          submitBtn: false,
          emptyBtn: false,
          column: [
            {
              label: '模板上传',
              prop: 'excelFile',
              type: 'upload',
              drag: true,
              loadText: '模板上传中，请稍等',
              span: 24,
              propsHttp: {
                res: 'data'
              },
              tip: '请上传 .xls,.xlsx 标准格式文件',
              action: "/api/blade-user/import-user"
            },
            {
              label: "数据覆盖",
              prop: "isCovered",
              type: "switch",
              align: "center",
              width: 80,
              dicData: [
                {
                  label: "否",
                  value: 0
                },
                {
                  label: "是",
                  value: 1
                }
              ],
              value: 0,
              slot: true,
              rules: [
                {
                  required: true,
                  message: "请选择是否覆盖",
                  trigger: "blur"
                }
              ]
            },
            {
              label: '模板下载',
              prop: 'excelTemplate',
              formslot: true,
              span: 24,
            }
          ]
        }
      };
    },
    watch: {
      'form.tenantId'() {
        if (this.form.tenantId !== '' && this.initFlag) {
          this.initData(this.form.tenantId);
        }
      },
      'excelForm.isCovered'() {
        if (this.excelForm.isCovered !== '') {
          const column = this.findObject(this.excelOption.column, "excelFile");
          column.action = `/api/blade-user/import-user?isCovered=${this.excelForm.isCovered}`;
        }
      }
    },
    computed: {
      ...mapGetters(["userInfo", "permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.user_add, false),
          viewBtn: this.vaildData(this.permission.user_view, false),
          delBtn: this.vaildData(this.permission.user_delete, false),
          editBtn: this.vaildData(this.permission.user_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },

    },
    created(){
      getAuthTree().then(res => {
      this.depts = res.data.data;
      this.depts.forEach(item => {
        item.label = item.title;
        item.value = item.id;
        if (item.children) {
          this.TreeFor(item.children);
        }
      });
    });
    },
    mounted() {
      // 非租户模式默认加载管理组数据
      if (!website.tenantMode) {
        this.initData(website.tenantId);
      }
    },
    methods: {
      //组织回调地狱
    TreeFor(children) {
      children.forEach(item => {
        item.label = item.title;
        item.value = item.id;
        if (item.children) {
          this.TreeFor(item.children);
        }
      });
    },
    //选择人员
    selectPerson(query,row) {
      console.log(row)
      if (query !== "") {
        this.loading1 = true;
        getLeader(query,row.deptId).then(res => {
          if(res.data.code == 200){

             row.puinfo = res.data.data;
            //this.changeLabel(this.options1)
          this.loading1 = false;
          }
        });
      } else {
        row.puinfo = [];
      }
    },
    //个性化授权提交
    submitPersonAuth(){
      let ProxyPowerDTO = {
        userId:this.userId,
        proxyPowerList:this.personData
      }
      proxyPowerSubmit(ProxyPowerDTO).then(res=>{
         console.log(res)
         if(res.data.code == 200){
           this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.personAuth = false;
         }
      })
    },
    //个性化删除
    PersonDelete(){
        if(this.selectionPersonList.length == 0){
           this.$message.warning('请至少选择一项')
           return ;
        }
        let arr = [];
        this.selectionPersonList.forEach(ele=>{
           arr.push(ele.id)
        })
        let string = arr.join(",")
        personAuthDelete(string).then(res=>{
             if(res.data.code == 200){
                this.$message.success('删除成功')
                this.tableLoading = true;
                getPersonAuth(this.userId).then(res=>{
                  if(res.data.code == 200){
                    // res.data.data.forEach(ele=>{
                    //   if(ele.proxyUserId){
                    //       ele.proxyUserIdList = ele.proxyUserId.split(",");
                    //   }
                    // })
                    this.personData = res.data.data;
                    this.tableLoading = false;
                  }
                })
             }
        })
    },
      nodeClick(data) {
        this.treeDeptId = data.id;
        this.page.currentPage = 1;
        this.onLoad(this.page);
      },
      initData(tenantId) {
        getRoleTree(tenantId).then(res => {
          const column = this.findObject(this.option.group, "roleId");
          column.dicData = res.data.data;
        });
        getDeptTree(tenantId).then(res => {
          const column = this.findObject(this.option.group, "deptId");
          column.dicData = res.data.data;
        });
        getDeptTree(tenantId).then(res => {
          const column = this.findObject(this.option.group, "concurrentDeptId");
          column.dicData = res.data.data;
        });
        getPostList(tenantId).then(res => {
          const column = this.findObject(this.option.group, "postId");
          column.dicData = res.data.data;
        });
        getPostList(tenantId).then(res => {
          const column = this.findObject(this.option.group, "concurrentPostId");
          column.dicData = res.data.data;
        });
      },
      submitRole() {
        const roleList = this.$refs.treeRole.getCheckedKeys().join(",");
        grant(this.ids, roleList).then(() => {
          this.roleBox = false;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.onLoad(this.page);
        });
      },
      rowSave(row, done, loading) {
        if(row.concurrentDeptId){
          row.concurrentDeptId=row.concurrentDeptId.join(",")
        }
        if(row.concurrentPostId){
          row.concurrentPostId=row.concurrentPostId.join(",")
        }
        if(row.roleId){
          row.roleId = row.roleId.join(",");
        }
        add(row).then(() => {
          this.initFlag = false;
          this.onLoad(this.page);
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
      rowUpdate(row, index, done, loading) {
        if(row.concurrentDeptId){
          row.concurrentDeptId=row.concurrentDeptId.join(",")
        }
        if(row.concurrentPostId){
          row.concurrentPostId=row.concurrentPostId.join(",")
        }
        if(row.roleId){
          row.roleId = row.roleId.join(",");
        }
        update(row).then(() => {
          this.initFlag = false;
          this.onLoad(this.page);
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
      dropdownMenu(command) {
      //搜索下拉菜单
      switch (command) {
        case "clear":
          this.clearSearch();
          break;
      }
      },
      clearSearch() {
      //搜索模块的清空
      for (let i in this.search_form) {
        this.search_form[i] = "";
      }
   },
   //个性化授权
   personAuthZation(row){
     console.log(row)
      this.personAuth = true;
      this.userId = row.id;
      this.tableLoading = true;
      getPersonAuth(row.id).then(res=>{
        if(res.data.code == 200){
          // res.data.data.forEach(ele=>{
          //   if(ele.proxyUserId){
          //     ele.proxyUserIdList = ele.proxyUserId.split(",");
          //    }
          // })
          this.personData = res.data.data;
          console.log(this.personData)
          this.tableLoading = false;
        }
      })
   },
   //改变option 的 label
    changeLabel(data){
        data.forEach(item => {
            if (item.type == 1) {
              item.value=JSON.stringify(item)
              item.label = `${item.name}-${item.code}(${item.userName})`
            } else {
              item.value= JSON.stringify(item)
              item.label = `${item.name}(${item.userName})`
            }
          });

    },
      searchChange() {
        this.query = this.search_form;
        this.page.currentPage = 1;
        this.onLoad(this.page, this.search_form);
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionPersonChange(list){
        this.selectionPersonList = list;
      },
      selectionClear() {
        this.selectionList = [];
      },
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
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleReset() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择账号密码重置为123456?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return resetPassword(this.ids);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });

          });
      },
      handleGrant() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.roleTreeObj = [];
        if (this.selectionList.length === 1) {
          this.roleTreeObj = this.selectionList[0].roleId.split(",");
        }
        getRoleTree().then(res => {
          this.roleGrantList = res.data.data;
          this.roleBox = true;
        });
      },
      handleImport() {
        this.excelBox = true;
      },
      uploadAfter(res, done) {
        this.excelBox = false;
        this.refreshChange();
        done();
      },
      handleExport() {
        this.$confirm("是否导出用户数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const searchForm = this.$refs.crud.searchForm;
          window.open(`/api/blade-user/export-user?${this.website.tokenHeader}=${getToken()}&account=${searchForm.account}&realName=${searchForm.realName}`);
        });
      },
      handlePassword() {
        toPassword().then(res=>{
          if(res.data.code == 200){
            this.$message.success("操作成功!");
          }else{
            this.$message.warning("操作失败");
          }
        })
      },
      handleTemplate() {
        window.open(`/api/blade-user/export-template?${this.website.tokenHeader}=${getToken()}`);
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getUser(this.form.id).then(res => {
            this.form = res.data.data;
            if(this.form.hasOwnProperty("concurrentDeptId")){
              this.form.concurrentDeptId = this.form.concurrentDeptId.split(",");
            }
            if(this.form.hasOwnProperty("concurrentPostId")){
              this.form.concurrentPostId = this.form.concurrentPostId.split(",");
            }
            if(this.form.hasOwnProperty("roleId")){
              this.form.roleId = this.form.roleId.split(",");
            }
          });
        }
        this.initFlag = true;
        done();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query), this.treeDeptId).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      cellStyle(){
        return 'padding: 0'
      },

      rowStyle(){
        return 'height: 35px'
      },
    }
  };
</script>

<style lang='scss' scoped>
.el-button-group{
  display: flex;
}
  .sx_user_style {
    height: auto;
  }
  .el-scrollbar {
    height: 100%;
  }

  .sx_user_style .el-scrollbar__wrap {
    overflow: scroll;
  }
  .sx_user .el-form-item{
    display: flex !important;
    margin-bottom: 0 !important;
    .el-form-item__content{
      width: 65% !important;
    }
  }
  .sx_user .cell{
    button:nth-child(3){
      color:red;
    }
  }
  .sx_user{
    .el-table__fixed-body-wrapper{
      height: auto !important;
    }
    .el-table__body-wrapper{
      height: auto !important;
    }
    .el-table{
      height: auto !important;
    }
  }
</style>
