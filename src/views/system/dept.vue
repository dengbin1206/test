<template>
  <split-pane :min-percent="10" :default-percent="30" split="vertical" class="sx_dept_basic">
    <template slot="paneL">
      <div style="padding:16px">
        <el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom:10px"/>
        <el-tree :data="Treedata0" style="height:500px;overflow:auto" :props="defaultProps" node-key="id"    @node-click="selectOrganization" :filter-node-method="filterNode" ref="tree"></el-tree>
      </div>
    </template>
    <template slot="paneR">
      <div class="sx_deptmain">
        <div class="sx_deptTop">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addlevel()">新增下级</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="edit()">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" plain @click="dele()">删除</el-button>
        </div>
        <el-form
          ref="form" :model="form" :show-message="showmessage" :rules="rules" label-width="96px" class="sx_deptBottom" size="mini" disabled>
          <el-form-item label="上级组织:">
            <el-select v-model="form.parentName"  ref="selectReport" placeholder="">
              <el-option :value="form.parentName">
                <el-tree :data="treedata" :props="defaultProps"></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织代码:">
            <el-input v-model="form.deptCode"></el-input>
          </el-form-item>
          <el-form-item label="组织名称:" prop="deptName">
            <el-input v-model="form.deptName"></el-input>
          </el-form-item>
          <el-form-item label="组织全称:">
            <el-input v-model="form.fullName"></el-input>
          </el-form-item>
          <el-form-item label="部门负责人:">
            <el-select v-model="form.managerPerson1" multiple filterable remote reserve-keyword placeholder="">
              <el-option v-for="item in options1" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分管领导:">
            <el-select v-model="form.deptManage1" multiple filterable remote reserve-keyword placeholder="" >
              <el-option v-for="item in options2" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织类型:">
            <el-select v-model="form.deptCategory" placeholder="">
              <el-option v-for="item in options" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序码:">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="form.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog :title="title"  :visible.sync="dialogVisible" :modal-append-to-body="false" width="40%" :close-on-click-modal="false" top="10vh" class="sx_dept_dialog" :before-close="handleClose">
        <!-- <div style="width:100%;text-align:right;font-size:20px">
           <i class="el-icon-printer" style="cursor:pointer" @click="handlePrint"></i>
        </div> -->
         <div id="sx_dept_form" ref="print" style="padding:10px">
        <el-form ref="form" :model="formDialog" :show-message="showmessage" :rules="rules" label-width="96px" class="sx_deptBottomDialog" size="small" :disabled="disabled0" >
          <el-form-item label="上级组织:">
            <el-select v-model="formDialog.parentName" placeholder="请选择" ref="selectReport" :disabled="disabledtree" class="sx_dept_parentName">
              <el-option :value="formDialog.parentName" :label="formDialog.parentName">
                <el-tree :data="treedata" :props="defaultProps" @node-click="superOrganization"></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织代码:">
            <el-input v-model="formDialog.deptCode"></el-input>
          </el-form-item>
          <el-form-item label="组织名称:" prop="deptName">
            <el-input v-model="formDialog.deptName"></el-input>
          </el-form-item>
          <el-form-item label="组织全称:">
            <el-input v-model="formDialog.fullName"></el-input>
          </el-form-item>
          <el-form-item label="部门负责人:">
            <el-select v-model="formDialog.managerPerson1"  multiple filterable remote reserve-keyword placeholder="请输入关键字模糊搜索" :remote-method="selectPerson" :loading="loading1">
              <el-option v-for="item in options1" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分管领导:">
            <el-select v-model="formDialog.deptManage1" multiple filterable remote reserve-keyword placeholder="请输入关键字模糊搜索" :remote-method="selectLeader" :loading="loading2" >
              <el-option v-for="item in options2" :key="item.id"  :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织类型:">
            <el-select v-model="formDialog.deptCategory" placeholder="请选择">
              <el-option  v-for="item in options" :key="item.dictKey" :label="item.dictValue"  :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序码:">
            <el-input v-model="formDialog.sort"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="formDialog.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
         </div>
        <span slot="footer" class="sx_dialog-footer">
          <el-button  type="primary"  @click="save('form')"  size="small" icon="el-icon-circle-plus-outline" >保 存</el-button>
          <el-button @click="handleClose" size="small" icon="el-icon-circle-close">取 消</el-button>
        </span>
      </el-dialog>
    </template>
  </split-pane>
</template>
<script>
import {getDeptTree,getDept,addsave,getLeader,deptremove} from "@/api/system/dept";
import deptData from "@/util/system/dept";
import { mapGetters } from "vuex";
//import website from "@/config/website";
//import { getToken } from "@/util/auth";
export default {
  components: {},
  data() {
    return {
      title: "",
      dialogVisible: false,
      disabled0: true,
      disabledtree: false,
      Treedata0: [],
      breadList:[],
      defaultExpandKey:[],
      filterText: "",
      showmessage: false,
      options: [],
      options1: [],
      options2: [],
      loading1: false,
      loading2: false,
      managerList: [],
      treedata: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      form: deptData.form,
      formDialog: deptData.formDialog,
      managerPerson: [],
      parentData: {},
      type: null,
      rules: {
        deptName: [
          { required: true, message: "请输入组织名称", trigger: "blur" }
        ]
      },
      saveType: null
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
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
    }
  },
  created() {
    this.getDicts("org_category").then(res => {
      this.options = res.data.data;
    });
    this.getTreeData();
    this.$nextTick(()=>{
         this.form={}
    })
  },
  methods: {
    // 打印
    handlePrint(){
      this.$print(this.$refs.print) // 使用
    },
    //过滤组织
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    //选中组织
    selectOrganization(data,e) {
      this.breadList = [];
      this.getTreeNode(this.$refs.tree.getNode(e.key))
      this.parentData = data;
      let that = this;
      getDept(data.id).then(res => {
        if(res.data.code == 200) {
          this.form.managerPerson1 = [];
          this.form.deptManage1 = [];
          console.log(res.data.data.managerPerson)
          that.options1 = res.data.data.managerPerson;
          that.options2 = res.data.data.deptManage;
        res.data.data.managerPerson.forEach(item => {
          this.form.managerPerson1.push(JSON.stringify(item));
        });
        res.data.data.deptManage.forEach(item => {
          this.form.deptManage1.push(JSON.stringify(item));
        });
         this.changeLabel(that.options1)
         this.changeLabel(that.options2)
        this.form.parentName = res.data.data.parentName;
        this.form.deptCode = res.data.data.deptCode;
        this.form.parentId = res.data.data.parentId;
        this.form.id = res.data.data.id;
        this.form.deptCode = res.data.data.deptCode;
        this.form.deptName = res.data.data.deptName;
        this.form.fullName = res.data.data.fullName;
        this.form.deptCategory = res.data.data.deptCategoryName;
        this.form.sort = res.data.data.sort;
        this.form.remark = res.data.data.remark;
        this.disabled0 = true;
        }
      });
    },
    //选中上级组织
    superOrganization(data) {
      let that = this;
      that.$set(this.formDialog, "parentName", data.title);
      that.formDialog.parentId = data.id;
      that.parentData = data;
    },
    //弹框关闭前
    handleClose() {
      this.dialogVisible = false;
    },
    //编辑
    edit() {
      this.disabled0 = false;
      this.type = 2;
      this.dialogVisible = true;
      this.title = "修改组织";
      this.formDialog =  this.deepClone(this.form)
      this.disabledtree = false;
    },
    //新增
    add() {
      this.type = 1;
      this.addClearData();
      this.options1 = [];
      this.options2 = [];
      this.formDialog.parentName = "";
      this.dialogVisible = true;
      this.disabledtree = false;
      this.disabled0 = false;
      this.title = "新增组织";
    },
    //新增下级
    addlevel() {
      this.addClearData();
      this.type = 1;
      this.formDialog.parentName = this.form.deptName;
      this.formDialog.parentId = this.parentData.id;
      this.disabled0 = false;
      this.options1 = [];
      this.options2 = [];
      this.disabledtree = true;
      this.dialogVisible = true;
      this.title = "新增组织";
    },
    //删除
    dele() {
      if (!this.form.id) {
        this.$message.warning("请选中左边组织");
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
          deptremove(that.form.id)
            .then(() => {
              that.$message.success("删除成功");
              that.getTreeData();
              that.form = {}
            })
            .catch(function() {});
        });
    },
    //选择部门负责人
    selectPerson(query) {
      if (query !== "") {
        this.loading1 = true;
        getLeader(query).then(res => {
          this.options1 = res.data.data;
            this.changeLabel(this.options1)
          this.loading1 = false;
        });
      } else {
        this.options1 = [];
      }
    },
    //选择分管领导
    selectLeader(query) {
      if (query !== "") {
        this.loading2 = true;
        getLeader(query).then(res => {
          this.options2 = res.data.data;
          this.changeLabel(this.options2)
          this.loading2 = false;
        });
      } else {
        this.options2 = [];
      }
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
    //新增弹框数据清空
    addClearData() {
      (this.formDialog.deptCode = ""),
        (this.formDialog.deptName = ""),
        (this.formDialog.fullName = ""),
        (this.formDialog.managerPerson = []),
        (this.formDialog.managerPerson1 = []),
        (this.formDialog.deptManage = []),
        (this.formDialog.deptManage1 = []),
        (this.formDialog.deptCategory = ""),
        (this.formDialog.sort = ""),
        (this.formDialog.remark = "");
    },
    //保存
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formDialog.managerPerson = [];
          this.formDialog.deptManage = [];
          this.formDialog.managerPerson1.forEach(item => {
            this.formDialog.managerPerson.push(JSON.parse(item));
          });
          this.formDialog.deptManage1.forEach(item => {
            this.formDialog.deptManage.push(JSON.parse(item));
          });
          if (this.type == 1) {
            this.formDialog.id= "";
            addsave(this.formDialog).then(res => {
              if (res.data.code == 200) {
                this.$nextTick(() => {
                  this.$message.success("新增成功");
                  this.dialogVisible = false;
                  this.getTreeData();
                });
              }
            });
          } else {
            if(this.formDialog.deptCategory=='公司'){
             this.formDialog.deptCategory =1
           }
            if(this.formDialog.deptCategory=='部门'){
             this.formDialog.deptCategory =2
           }
            addsave(this.formDialog).then(res => {
              if (res.data.code == 200) {
                this.$nextTick(() => {
                  this.$message.success("修改成功");
                  this.form = JSON.parse(JSON.stringify(this.formDialog))
                  this.dialogVisible = false;
                  this.getTreeData();
                });
              }
            });
          }
        }
      });
    },
    getTreeData(){
      getDeptTree().then(res => {
        this.Treedata0 = res.data.data;
        this.treedata = res.data.data;
        this.$nextTick(()=>{
          this.breadList.forEach(ele=>{
          if(this.$refs.tree.store.nodesMap[ele] !== undefined){
            this.$refs.tree.store.nodesMap[ele].expanded = true;
          }
        })
        })
      });
    },
    getTreeNode(node){//获取当前树节点和其父级节点
      if(node){
         if(node.label !== undefined){
           this.breadList.unshift(node.key);
           this.getTreeNode(node.parent)
         }
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../styles/system/dept.scss";
</style>
