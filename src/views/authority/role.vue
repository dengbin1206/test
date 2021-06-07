<template>
  <split-pane :min-percent="10" :default-percent="30" split="vertical" class="sx_dept_basic" style="background:#fff">
    <template slot="paneL">
      <div style="padding:16px; height:600px;" >
        <el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom:10px"/>
        <el-tree :data="Treedata0" :props="defaultProps" node-key="id"  :default-expanded-key="idArr"  @node-click="selectOrganization" :filter-node-method="filterNode" ref="tree" :default-expanded-keys="unfold" style="height:90%;overflow:auto"></el-tree>
      </div>
    </template>
    <template slot="paneR">
      <div class="sx_deptmain">
        <div class="sx_deptTop">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addlevel()">新增下级</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="edit()" :disabled="editBut">编辑</el-button>
          <el-button size="small" type="primary" icon="el-icon-setting"  @click="handleRole()">权限设置</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" plain @click="dele()">删除</el-button>
        </div>
        <el-form
          ref="form" :model="show_form" :show-message="showmessage" :rules="rules" label-width="96px" class="sx_deptBottom" size="mini" disabled style="width:50%">
          <el-form-item label="上级角色:">
              <avue-input-tree default-expand-all v-model="show_form.parentId"  type="tree" :dic="parent" disabled></avue-input-tree>
          </el-form-item>
          <el-form-item label="角色编码:">
            <el-input v-model="show_form.roleAlias" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称:">
            <el-input v-model="show_form.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色排序:">
            <el-input v-model="show_form.sort" disabled></el-input>
          </el-form-item>
          <el-form-item label="授权组织:">
            <avue-input-tree multiple v-model="show_form.deptList"  type="tree" :dic="depts" disabled></avue-input-tree>
          </el-form-item>
          <el-form-item label="授权岗位:">
            <el-select v-model="show_form.rolePostList" multiple filterable remote reserve-keyword  :remote-method="getPost" :loading="loading1" disabled>
                <el-option v-for="item in posts" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权用户:">
            <el-select v-model="show_form.roleUserList" multiple filterable remote reserve-keyword  :remote-method="getUser" :loading="loading2" disabled>
                <el-option v-for="item in users" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权群组:">
            <el-select v-model="show_form.roleGroupList" multiple filterable remote reserve-keyword  :remote-method="getGroup" :loading="loading3" disabled>
                <el-option v-for="item in groups" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog :title="title" append-to-body :visible.sync="dialogVisible" :modal-append-to-body="false" width="40%" :close-on-click-modal="false" op="10vh" class="sx_dept_dialog sx_role_dialog" :before-close="handleClose">
        <el-form
          ref="form" :model="form" :show-message="showmessage" :rules="rules" label-width="96px" class="sx_role_form" size="mini">
          <el-form-item label="上级角色:">
              <avue-input-tree default-expand-all v-model="form.parentId" placeholder="请选择内容" type="tree" :dic="parent" :disabled='disabled'></avue-input-tree>
          </el-form-item>
          <el-form-item label="角色编码:" prop="roleAlias">
            <el-input v-model="form.roleAlias"></el-input>
          </el-form-item>
          <el-form-item label="角色名称:" prop="roleName">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色排序:">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="授权组织:">
            <avue-input-tree multiple v-model="form.deptList" placeholder="请选择内容" type="tree" :dic="depts"></avue-input-tree>
          </el-form-item>
          <el-form-item label="授权岗位:">
            <el-select v-model="form.rolePostList" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getPost" :loading="loading1">
                <el-option v-for="item in posts" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权用户:">
            <el-select v-model="form.roleUserList" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getUser" :loading="loading2">
                <el-option v-for="item in users" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权群组:">
            <el-select v-model="form.roleGroupList" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getGroup" :loading="loading3">
                <el-option v-for="item in groups" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="sx_dialog-footer">
          <el-button  type="primary"  @click="save('form')"  size="small" icon="el-icon-circle-plus-outline" >保 存</el-button>
          <el-button @click="handleClose" size="small" icon="el-icon-circle-close">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="'角色权限配置 '+this.show_form.roleName" append-to-body  :visible.sync="permission" :modal-append-to-body="false" width="70%" :close-on-click-modal="false" top="8vh"  :before-close="shut">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="菜单权限" name="first">
            <el-container>
              <el-aside width="200px" style='height:400px'>
                <el-tree  :data="menuData"  node-key="id"   show-checkbox  @node-click="menuClick" ref='menuTree'></el-tree>
              </el-aside>
              <el-main style="margin-left:30px">
                <h3 v-if="isCheck">按钮权限</h3>
                <el-row :span='24'>
                  <el-col :span="24">
                    <avue-checkbox  v-model="dialogData.buttonList" placeholder="请选择内容" v-if="isCheck" :dic="buttons"></avue-checkbox>
                  </el-col>
                </el-row>
                <h3 v-if="isCheck">字段权限</h3>
                <el-table :data="dialogData.roleFieldList" border style="width: 90%;" v-if="isCheck" size='small' max-height=400 class="sx_role_model">
                  <el-table-column type="index" width="50" label="序号"></el-table-column>
                  <el-table-column prop="modelId" label="模型" align="center">
                      <template slot-scope="scope">
                        <el-select size="small" v-model="scope.row.modelId" disabled>
                            <el-option
                                  v-for="item in scope.row.modelOption"
                                  :key="item.modelId"
                                  :label="item.modelRemark"
                                  :value="item.modelId">
                            </el-option>
                        </el-select>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fieldId" label="模型字段" align="center">
                      <template slot-scope="scope">
                        <el-select size="small" v-model="scope.row.fieldId" disabled>
                            <el-option
                                  v-for="item in scope.row.fieldOption"
                                  :key="item.fieldId"
                                  :label="item.fieldRemark"
                                  :value="item.fieldId">
                            </el-option>
                        </el-select>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fieldShow" label="可见" width="80" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.fieldShow" @change="(value)=>selectIsEdit(value,scope.row,0)"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="fieldAlter" label="可改" width="80" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.fieldAlter" @change="(value)=>selectIsEdit(value,scope.row,1)"></el-checkbox>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="权限对象" name="second">
            <el-button type="primary" size="small" icon="el-icon-plus"  @click="rowAdd" style="margin-bottom:5px;">新增</el-button>
            <el-dialog
                append-to-body
                title="新增"
                :visible.sync="display"
                width="25%"
                :before-close="displayClose">
                <span style="margin-left:30px;">权限对象: </span>
                    <avue-select v-model="selection" placeholder="请选择权限对象"  :dic="tableData" class="sx_formConfig_select"></avue-select>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="displaySubmit" size="small" icon="el-icon-check">确 定</el-button>
                    <el-button @click="displayClose" size="small" icon="el-icon-close">取 消</el-button>
                </span>
            </el-dialog>
            <el-table
                :data="dialogData.powerObjVOList"
                style="width: 100%;height:390px;overflow: auto;"
                row-key="randomId"
                border
                lazy
                default-expand-all
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}" class="sx_formConfig_table">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                prop="remark"
                label="权限对象">
                </el-table-column>
                <el-table-column
                prop="operator"
                label="运算符">
                    <template slot-scope="scope" v-if="(!scope.row.children)">
                        <el-select v-model="scope.row.operator" clearable slot="prepend" placeholder="请选择" size="small">
                            <el-option v-for="e in operators" :value="e.dictKey" :label="e.dictValue" :key="e.dictKey"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                prop="small"
                label="值小">
                    <template slot-scope="scope" v-if="(!scope.row.children)">
                        <el-input v-model="scope.row.valueLow" placeholder="请输入值小"></el-input>
                        <i class="el-icon-info" style="font-size:20px;" @click="open(scope.row,'S')"></i>
                    </template>
                </el-table-column>
                <el-table-column
                prop="large"
                label="值大">
                    <template slot-scope="scope" v-if="(!scope.row.children)">
                        <el-input v-model="scope.row.valueHigh" placeholder="请输入值大"></el-input>
                        <i class="el-icon-info" style="font-size:20px;" @click="open(scope.row,'M')"></i>
                    </template>
                </el-table-column>
                <el-table-column header-align="center"
                align="center"
                width="70"
                label="操作">
                    <template slot-scope="scope" v-if="(scope.row.children)">
                        <el-button size="small"  type="text" style="color:red;" @click="tableDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <btnSearch ref="sonV" @func='func'></btnSearch>
          </el-tab-pane>
          <el-tab-pane label="接口权限" name="third">接口权限</el-tab-pane>
        </el-tabs>
        <span slot="footer" class="sx_dialog-footer">
          <el-button  type="primary"  @click="sub"  size="small" icon="el-icon-circle-plus-outline">保 存</el-button>
          <el-button @click="shut" size="small" icon="el-icon-circle-close">取 消</el-button>
        </span>
      </el-dialog>
    </template>
  </split-pane>
</template>
<script>
import {
  add,
  getList,
  detail,
  remove,
  groupBySearch,
  grantTree,
  modelForm,
  submitField,
  checkTree,
  LazyList,
  getPowerObjById,
  buttonCheck,
  rolePowerList
} from "@/api/system/role";
import btnSearch from "./btnSearch";
import { getDeptTree } from "@/api/system/dept";
import { postDetail, user_code } from "@/api/system/group";
export default {
  components: {
    btnSearch
  },
  data() {
    return {
      justDiv: true,
      buttons: [],
      operators: [],
      tableData: [],
      editBut:true,
      selection: "",
      display: false,
      isCheck:false,//点击选择中菜单后
      menuData: [],
      checks: [],
      unfold: [],
      dialogData: {
        buttonList: [],
        powerObjVOList: [],
        menuList: [],
        roleFieldList: [],
        roleId: ""
      },
      activeName: "first",
      filterText: "",
      Treedata0: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      idArr: [],
      permission: false,
      showmessage: false,
      disabled: false,
      rules: {
        roleAlias: [{ required: true, trigger: "blur" }],
        roleName: [{ required: true, trigger: "blur" }]
      },
      title: "",
      show_form: {
        roleName: "",
        roleAlias: "",
        parentId: "",
        sort: "",
        id: "",
        userList: [],
        postList: [],
        deptList: [],
        groupList: [],
        rolePostList: [],
        roleUserList: [],
        roleGroupList: []
      },
      form: {
        id: null,
        roleName: "",
        roleAlias: "",
        parentId: "",
        sort: "",
        userList: [],
        postList: [],
        deptList: [],
        groupList: [],
        rolePostList: [],
        roleUserList: [],
        roleGroupList: []
      },
      dialogVisible: false,
      parent: [],
      depts: [],
      posts: [],
      users: [],
      groups: [],
      loading1: false,
      loading2: false,
      loading3: false,
      parentData: {},
      menuOption: {
        addBtn: false
      }
    };
  },
  methods: {
    //权限对象
    open(row, bytype) {
      this.$refs.sonV.open(this.justDiv, row, bytype);
    },
    func(val) {
      if (val.byType == "S") {
        val.row.valueLow = val.checkData;
      } else {
        val.row.valueHigh = val.checkData;
      }
    },

    getCheckedNodes() {
      let menuList = this.$refs.menuTree.getCheckedNodes();
      let arr = {};
      menuList.forEach(item => {
        if (item.type != "B") {
          arr = {
            type: item.type,
            id: item.id
          };
        } else {
          //如果type是B,就是按钮，不是B就是菜单跟功能
          arr = {
            type: item.type,
            id: item.butId
          };
        }
        this.dialogData.menuList.push(arr);
      });
    },
    //过滤角色
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    //清空数据
    clearForm() {
      (this.form.roleName = ""),
        (this.form.roleAlias = ""),
        (this.form.parentId = ""),
        (this.form.sort = ""),
        (this.form.userList = []),
        (this.form.postList = []),
        (this.form.deptList = []),
        (this.form.groupList = []),
        (this.form.rolePostList = []),
        (this.form.roleUserList = []),
        (this.form.roleGroupList = []);
    },
    clearShowForm() {
      (this.show_form.roleName = ""),
        (this.show_form.roleAlias = ""),
        (this.show_form.parentId = ""),
        (this.show_form.sort = ""),
        (this.show_form.id = ""),
        (this.show_form.userList = []),
        (this.show_form.postList = []),
        (this.show_form.deptList = []),
        (this.show_form.groupList = []),
        (this.show_form.rolePostList = []),
        (this.show_form.roleUserList = []),
        (this.show_form.roleGroupList = []);
    },
    //上级角色回调地狱
    getparent(children) {
      children.forEach(item => {
        item.label = item.title;
        if (item.children) {
          this.getparent(item.children);
        }
      });
    },
    //获取左数数据
    getTreeDate() {
      getList().then(res => {
        this.Treedata0 = res.data.data;
        this.parent = res.data.data;
        this.parent.forEach(item => {
          item.label = item.title;
          if (item.children) {
            this.getparent(item.children);
          }
        });
      });
    },
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
    //岗位
    getPost(val) {
      if (val !== "") {
        this.loading1 = true;
        postDetail(val).then(res => {
          this.posts = res.data.data;
          this.posts.forEach(item => {
            const arr = {
              id: item.id,
              code: item.postCode,
              name: item.postName
            };
            item.label = `${item.postName}(${item.postCode})`;
            item.value = JSON.stringify(arr);
          });
          this.loading1 = false;
        });
      } else {
        this.posts = [];
      }
    },
    //用户
    getUser(val) {
      if (val !== "") {
        this.loading2 = true;
        user_code(val).then(res => {
          this.users = res.data.data;
          this.users.forEach(item => {
            const arr = {
              id: item.id,
              code: item.account,
              name: item.realName
            };
            item.label = `${item.realName}(${item.account})`;
            item.value = JSON.stringify(arr);
          });
          this.loading2 = false;
        });
      } else {
        this.users = [];
      }
    },
    //群组
    getGroup(val) {
      if (val !== "") {
        this.loading3 = true;
        groupBySearch(val).then(res => {
          this.groups = res.data.data;
          this.groups.forEach(item => {
            const arr = {
              id: item.id,
              code: item.groupCode,
              name: item.groupName
            };
            item.label = `${item.groupName}(${item.groupCode})`;
            item.value = JSON.stringify(arr);
          });
          this.loading3 = false;
        });
      } else {
        this.groups = [];
      }
    },
    //选中组织
    selectOrganization(data) {
      this.dialogData.roleId = data.id;
      this.parentData = data;
      this.editBut = false;
      this.show_form.deptList = [];
      let that = this;
      detail(data.id).then(res => {
        (this.show_form.rolePostList = []),
          (this.show_form.roleUserList = []),
          (this.show_form.roleGroupList = []);
        this.posts = res.data.data.postList;
        this.users = res.data.data.userList;
        this.groups = res.data.data.groupList;
        this.strg(res.data.data.postList, that.show_form.rolePostList);
        this.strg(res.data.data.userList, that.show_form.roleUserList);
        this.strg(res.data.data.groupList, that.show_form.roleGroupList);
        this.deploy(this.posts);
        this.deploy(this.users);
        this.deploy(this.groups);
        this.show_form.deptList = res.data.data.deptList;
        this.show_form.roleName = res.data.data.roleName;
        this.show_form.roleAlias = res.data.data.roleAlias;
        this.show_form.parentId = res.data.data.parentId;
        this.show_form.sort = res.data.data.sort;
        this.show_form.id = res.data.data.id;
      });
    },
    //遍历数组，转换item
    strg(a, b) {
      a.forEach(item => {
        b.push(JSON.stringify(item));
      });
    },
    //配置label,value
    deploy(a) {
      a.forEach(item => {
        const arr = { id: item.id, code: item.code, name: item.name };
        item.label = `${item.name}(${item.code})`;
        item.value = JSON.stringify(arr);
      });
    },
    //新增弹框
    add() {
      this.title = "新增";
      this.clearForm();
      this.dialogVisible = true;
      this.disabled = false;
    },
    //新增下级弹框
    addlevel() {
      this.title = "新增";
      this.dialogVisible = true;
      this.disabled = true;
      this.form.parentId = this.show_form.id;
      (this.form.roleName = ""),
        (this.form.roleAlias = ""),
        (this.form.id = null),
        (this.form.sort = ""),
        (this.form.userList = []),
        (this.form.postList = []),
        (this.form.deptList = []),
        (this.form.groupList = []),
        (this.form.rolePostList = []),
        (this.form.roleUserList = []),
        (this.form.roleGroupList = []);
    },
    //编辑弹框
    edit() {
      this.title = "编辑";
      this.dialogVisible = true;
      this.disabled = false;
      console.log(this.show_form);
      this.form = this.deepClone(this.show_form);
    },
    //回调地狱菜单权限树
    forMenu(children) {
      children.forEach(item => {
        item.label = item.name;
        item.value = item.id;
        if (item.children) {
          this.forMenu(item.children);
        }
      });
    },
    //权限设置弹框
    handleRole() {
      if (!this.show_form.id) {
        this.$message.warning("请选择一条数据");
        return;
      }
      this.permission = true;
      this.isCheck=false;
      rolePowerList(this.show_form.id).then(res => {
        this.dialogData.powerObjVOList = res.data.data;
        this.dialogData.powerObjVOList.forEach((item, index) => {
          item.rowIndex = index;
        });
      });
      grantTree().then(res => {
        this.menuData = res.data.data;
        this.menuData.forEach(item => {
          (item.label = item.name), (item.value = item.id);
          if (item.children) {
            this.forMenu(item.children);
          }
        });
      });
      this.getmodels("query_operator").then(res => {
        this.operators = res.data.data;
      });
      checkTree(this.dialogData.roleId).then(res => {
        this.checks = res.data.data;
        this.$refs.menuTree.setCheckedKeys(this.checks);
      });
    },
    //判断是否为空对象
    judgeObj(obj) {
      for (var item in obj) {
        return true;
      }
      return false;
    },
    //菜单权限选中
    menuClick(data) {
      if (data.type === "M") {
        this.isCheck=false;
        this.$message.warning("请点击功能");
      } else {
        this.isCheck=true;
        modelForm(data.id, this.dialogData.roleId).then(res => {
          if (res.data.data.length > 0) {
            this.dialogData.roleFieldList = res.data.data;
            this.dialogData.menuSourceId = data.id;
            this.dialogData.roleFieldList.forEach(item => {
              item.modelOption=[{modelRemark:item.modelRemark,modelId:item.modelId}]
              item.fieldOption=[{fieldRemark:item.fieldRemark,fieldId:item.fieldId}]
              if (item.fieldAlter == 1) {
                item.fieldAlter = true;
              } else {
                item.fieldAlter = false;
              }
              if (item.fieldShow == 1) {
                item.fieldShow = true;
              } else {
                item.fieldShow = false;
              }
            });
          } else {
            this.dialogData.roleFieldList = [];
          }
        });
        buttonCheck(this.dialogData.roleId, data.id).then(res => {
          this.buttons = [];
          this.dialogData.buttonList = [];
          if (this.judgeObj(res.data.data)) {
            let arr = res.data.data;
            arr.forEach(ele => {
              this.buttons.push({
                label: ele.name,
                value: ele.id
              });
              if(ele.checked==1){
                this.dialogData.buttonList.push(ele.id);
              }
            });
          } else {
            this.buttons = [];
          }
        });
      }
    },
    //选中可改
    selectIsEdit(value,row,type){
      if(value&&type==1){
        row.fieldShow = true;
      }
      if(!value&&type==0){
        row.fieldAlter = false;
      }
    },
    //权限弹框保存
    sub() {
      this.getCheckedNodes();
      const row = this.dialogData;
      row.roleFieldList.forEach(item => {
        if (item.fieldAlter == true) {
          item.fieldAlter = 1;
        } else {
          item.fieldAlter = 0;
        }
        if (item.fieldShow == true) {
          item.fieldShow = 1;
        } else {
          item.fieldShow = 0;
        }
      });
      submitField(row).then(() => {
        this.dialogData.roleFieldList = [];
        this.dialogData.menuList = [];
        this.dialogData.powerObjVOList = [];
        this.permission = false;
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    //权限设置弹框取消
    shut() {
      this.permission = false;
    },
    //删除
    dele() {
      if (!this.show_form.id) {
        this.$message.warning("请选中左边角色");
        return;
      }
      let that = this;
      that
        .$confirm("是否确认删除?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(function() {
          remove(that.show_form.id)
            .then(() => {
              that.$message.success("删除成功");
              that.getTreeDate();
              that.clearForm();
              that.clearShowForm();
            })
            .catch(function() {});
        });
    },
    //保存
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const that = this;
          const row = that.form;
          if (row.rolePostList) {
            row.rolePostList.forEach(item => {
              row.postList.push(JSON.parse(item));
            });
          }
          if (row.roleUserList) {
            row.roleUserList.forEach(item => {
              row.userList.push(JSON.parse(item));
            });
          }
          if (row.roleGroupList) {
            row.roleGroupList.forEach(item => {
              row.groupList.push(JSON.parse(item));
            });
          }
          add(row).then(() => {
            this.dialogVisible = false;
            this.getTreeDate();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            if (row.parentId != null && row.parentId != "") {
              this.unfold = [row.parentId];
            }
            if (row.id != null && row.id != "") {
              this.selectOrganization(row);
            } else {
              this.clearForm();
              this.clearShowForm();
            }
          });
        } else {
          return false;
        }
      });
    },
    //关闭弹框
    handleClose() {
      this.dialogVisible = false;
      console.log(this.show_form);
    },

    ///////////////////角色权限
    //新增弹框
    rowAdd() {
      this.selection = "";
      this.display = true;
      LazyList().then(res => {
        this.tableData = res.data.data;
        this.tableData.forEach(item => {
          item.label = item.powerObjRemark;
          item.value = item.id;
        });
      });
    },
    //选择权限对象
    displaySubmit() {
      if (this.selection == "") {
        this.$message({
          message: "权限对象不能为空，请选择",
          type: "warning"
        });
      } else {
        getPowerObjById(this.selection).then(res => {
          this.addData = res.data.data;
          this.dialogData.powerObjVOList.push(this.addData);
          this.dialogData.powerObjVOList.forEach((item, index) => {
            item.rowIndex = index;
          });
        });
        this.display = false;
      }
    },
    //关闭弹框
    displayClose() {
      this.display = false;
    },
    //树懒加载
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(tree.children);
      }, 500);
    },
    //行删除
    tableDel(row) {
      this.dialogData.powerObjVOList.splice(row.rowIndex, 1);
      this.dialogData.powerObjVOList.forEach((item, index) => {
        item.rowIndex = index;
      });
    }
  },
  created() {
    //角色树
    this.getTreeDate();
    //组织树
    getDeptTree().then(res => {
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../styles/system/dept.scss";
@import "../../styles/authority/role.scss";
@import "../../styles/power/formConfig.scss";

.sx_formConfig_table tr {
  td:nth-child(4) {
    .cell .el-input {
      width: 90% !important;
    }
  }
  td:nth-child(5) {
    .cell .el-input {
      width: 90% !important;
    }
  }
}
</style>
