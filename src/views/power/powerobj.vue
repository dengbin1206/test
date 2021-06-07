<template>
    <basic-container class="sx_model_style">
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud :data="data"
                   :option="option"
                   :page.sync="page"
                   @row-del="rowDel"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @selection-change="selectionChange"
                   :cell-style="cellStyle"
                   :row-style="rowStyle">
            <template slot="menuLeft">
                <el-button type="primary"
                    size="small"
                    icon="el-icon-s-order"
                    v-if="permission.code_delete"
                    @click="openField">新增
                </el-button>
            </template>
            <template slot="menuLeft">
                <el-button type="danger"
                    size="small"
                    icon="el-icon-delete"
                    v-if="permission.code_delete"
                    plain
                    @click="handleDelete">删 除
                </el-button>
            </template>
            <template slot-scope="scope" slot="menu" >
                <el-button type="text"
                    size="small"
                    icon="el-icon-edit"
                    v-if="permission.code_delete"
                    @click="openEdit(scope.row)">编 辑
                </el-button>
                <el-button type="text"
                    size="small"
                    icon="el-icon-delete"
                    v-if="permission.code_delete"
                    @click="openDelete(scope.row)" style="color:red;">删 除
                </el-button>
            </template>
        </avue-crud>
        <div class="sx_power_dialog" v-show="dialogVisible">
          <div class="sx_power_header">
              <div class='sx_power_item1'>
                  <el-button type="primary" icon="el-icon-check" size="small" @click="submit('add_form.powerObjVO')">保存</el-button>
              </div>
              <div class='sx_power_item2' @click="handleClose('add_form.powerObjVO')"><i class="el-icon-close"></i></div>
              <div class='sx_power_item2'>{{title}}</div>
          </div>
          <div class="sx_power_main">
            <el-form :inline="true" label-width="110px" class="sx_power_form"  :rules="rules" :model='add_form.powerObjVO' ref="add_form.powerObjVO">
              <el-row>
                <el-col :span='12'>
                  <el-form-item label="权限对象:" prop='powerObjName'>
                    <el-input v-model="add_form.powerObjVO.powerObjName" placeholder="请输入权限对象" clearable size="small" maxlength="10" @keyup.enter.native="handleQuery"/>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="权限对象描述:" prop='powerObjRemark'>
                    <el-input v-model="add_form.powerObjVO.powerObjRemark" placeholder="请输入权限对象描述" clearable size="small" maxlength="10" @keyup.enter.native="handleQuery" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="sx_power_footer">
            <el-button type="primary" icon='el-icon-plus' @click='addFiled' size='small'>新增</el-button>
            <el-table :data="add_form.powerFieldList" border=true ref='editTable'  size='small' class="sx_power_table" style="width: 100%; margin-top:8px;height:85%;overflow: auto;border-bottom:1px solid #ccc" :header-cell-style="{background:'#FAFAFA'}">
                <el-table-column label='序号' type='index'></el-table-column>
                <el-table-column label="权限对象字段名"  prop='powerFieldName'>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.powerFieldName"  placeholder="请输入权限对象字段名"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="权限对象字段描述"  prop='powerFieldRemark'>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.powerFieldRemark"  placeholder="请输入权限对象字段描述"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="来源类型" prop='sourceCode'>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sourceCode" placeholder="请选择来源类型" @change='sourceCodeChange(scope.row)'>
                                    <el-option v-for="item in codes" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                            </el-select>
                        </template>
                </el-table-column>
                <el-table-column label="来源模型" prop='sourceModel'>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sourceModel" placeholder="请选择来源模型" @change='sourceModelChange(scope.row)'>
                                    <el-option v-for="item in scope.row.models" :key="item.id" :label="item.tableName" :value="item.id"></el-option>
                            </el-select>
                        </template>
                </el-table-column>
                <el-table-column label="来源名称" prop='sourceName'>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sourceName" placeholder="请选择来源名称" disabled=true>
                                    <el-option v-for="item in scope.row.models" :key="item.id" :label="item.tableRemark" :value="item.id"></el-option>
                            </el-select>
                        </template>
                </el-table-column>
                <el-table-column label="来源CODE字段" prop='sourceCodeField'>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sourceCodeField" placeholder="请选择来源CODE字段" clearable>
                                    <el-option v-for="item in scope.row.dictCodes" :key="item.id" :label="item.label" :value="item.value" ></el-option>
                            </el-select>
                        </template>
                </el-table-column>
                <el-table-column label="来源NAME字段" prop='sourceNameField'>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sourceNameField" placeholder="请选择来源NAME字段">
                                    <el-option v-for="item in scope.row.sourceNameFields" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button icon='el-icon-delete' style="color:red;" size="mini" type="text"  class="call" @click='sourceDelete(scope.row,scope.$index)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          </div>
        </div>
    </basic-container>
</template>
<script>
import {
  getList,
  add,
  remove,
  detail,
  getobjs,
  getModels,
  getCodes,
  getModelCode,
  getCodesBiz
} from "@/api/power/powerobj";
import { mapGetters } from "vuex";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      let aa = /^[a-zA-Z]+$/.test(value);
      if (!aa) {
        callback(new Error("请输入英文"));
      } else {
        callback();
      }
    };
    return {
      rules:{
        powerObjName:[{required: true, message: '请输入权限对象', trigger: 'blur'}],
        powerObjRemark:[{required: true, message: '请输入权限对象描述', trigger: 'blur'}],
        sourceCode:[{required: true, message: '请选择来源类型', trigger: 'blur'}]
      },
      sourceNameFields:[],
      dictCodes:[],
      models: [],
      title: "新增",
      codes: [],
      add_form: {
        delPowerFiledList:[],
        powerFieldList:[],
        powerObjVO:{
          powerObjName: "",
          powerObjRemark: ""
        }
      },
      objs: [],
      dialogVisible: false,
      selectionList: [],
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        totle: 0
      },
      search_form: {},
      data: [],
      searchOption: {
        rows: [
          [
            {
              type: "input",
              prop: "powerObjName",
              queryType :'1',
              label: "权限对象:",
              placeholder: "请输入权限对象"
            },
            {
              type: "input",
              prop: "powerObjRemark",
              queryType :'1',
              label: "权限对象描述:",
              placeholder: "请输入权限对象描述"
            }
          ]
        ]
      },
      option: {
        delBtn:false,
        editBtn:false,
        addBtn: false,
        tip: false,
        selection: true,
        align: "center",
        menuAlign: "center",
        index: true,
        labelWidth: 130,
        border: true,
        column: [
          {
            label: "权限对象名",
            prop: "powerObjName",
            span: 24,
            rules: [{ validator: validatePass, trigger: "blur" }]
          },
          {
            label: "权限对象名描述",
            prop: "powerObjRemark",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入权限对象名描述",
                trigger: "blur"
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    dropdownMenu(command) {
      //搜索下拉菜单
      switch (command) {
        case "clear":
          this.clearSearch();
          break;
      }
    },
    clearSearch() {
      this.search_form.powerObjName = "";
      this.search_form.powerObjRemark = "";
    },
    search(val) {
      this.loading = true;
      this.search_form = val;
      this.$nextTick(() => {
        let obj = {
          current: this.clickquery == 1 ? this.page.currentPage : 1,
          size: this.page.pageSize,
          extQueryList: [
            {
              field: "powerObjName",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.search_form.powerObjName,
                  upperValue: ""
                }
              ]
            },
            {
              field: "powerObjRemark",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.search_form.powerObjRemark,
                  upperValue: ""
                }
              ]
            }
          ]
        };
        getList(obj).then(res => {
          this.data = res.data.data.records;
          this.loading = false;
          this.page.total = res.data.data.total;
        });
        this.clickquery = "";
      });
    },
    //修改页码
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.search_form);
    },
    //修改页面数量
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.search(this.search_form);
    },
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
    rowSave(row) {
      let reg2 = /^[a-zA-Z]+$/;
      if(reg2.test(this.add_form.powerObjVO.powerObjName)){
        add(row).then(
        () => {
          this.dialogVisible=false
          this.api(); //从新加载
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.add_form.delPowerFiledList=[]
          this.add_form.powerFieldList=[]
          this.add_form.powerObjVO.powerObjName=''
          this.add_form.powerObjVO.powerObjRemark=''
        },
        error => {
          window.console.log(error);
        }
      );
      }else{
        this.$message({
              message: "对象名只能是英文",
              type: "warning"
            });
      }

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
          this.api();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    //当选择项发生变化时会触发该事件
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    //删除数据
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
          this.api(); //重新加载
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    getobj() {
      getobjs().then(res => {
        this.objs = res.data.data;
      });
    },
    //编辑弹框
    openEdit(row){
      this.openFullScreen2()
      this.title='编辑'
      this.dialogVisible = true;
      detail(row.id).then(res=>{
        this.add_form=res.data.data
        this.add_form.powerFieldList.forEach(item=>{
          if(item.sourceCode){
            if (item.sourceCode === "D") {
              item.sourceNameFields=[]
             getCodesBiz().then(res=>{
                let data=res.data.data.records
                data.forEach(item=>{
                  item.label=item.dictValue
                  item.value=item.id
                })
                this.$set(item,'dictCodes',data)
              })
            }
            if (item.sourceCode === "M") {
                getModels(item.sourceCode).then(res => {
                this.$set(item,'models',res.data.data)
              });
              getModelCode(item.sourceModel).then(res=>{
                let data=res.data.data
                data.forEach(item=>{
                  item.label=item.keyAndValue,
                  item.value=item.id
                })
                this.$set(item,'dictCodes',data)
                this.$set(item,'sourceNameFields',data)
              })
            }
            if (item.sourceCode === "Y") {
                item.sourceNameFields=[]
                getCodes().then(res=>{
                  let data=res.data.data.records
                  data.forEach(item=>{
                    item.label=item.dictValue
                    item.value=item.id
                  })
                  this.$set(item,'dictCodes',data)
                })
              }
          }
        })
      })
    },
    //新增弹框
    openField() {
      this.title='新增'
      this.dialogVisible = true;
      this.add_form.powerObjVO.powerObjName='',
      this.add_form.powerObjVO.powerFieldRemark=''
    },
    //关闭弹框
    handleClose(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    //删除
    openDelete(row){
      this.rowDel(row)
    },
    //下拉框获取数据
    sourceCodeChange(row) {
      if (row.sourceCode === "D") {
        delete row.sourceModel
        delete row.sourceName
        delete row.sourceCodeField
        delete row.sourceNameField
        this.$set(row,'dictCodes',[])
        this.$set(row,'models',[])
        this.$set(row,'sourceNameFields',[])
       getCodesBiz().then(res=>{
          let data=res.data.data.records
          data.forEach(item=>{
            item.label=item.dictValue
            item.value=item.id
          })
          this.$set(row,'dictCodes',data)
        })
      }
      if (row.sourceCode === "M") {
        delete row.sourceModel
        delete row.sourceName
        delete row.sourceCodeField
        delete row.sourceNameField
        this.$set(row,'dictCodes',[])
        this.$set(row,'models',[])
        this.$set(row,'sourceNameFields',[])
        getModels(row.sourceCode).then(res => {
        this.$set(row,'models',res.data.data)
      });
      }
      if (row.sourceCode === "Y") {
        delete row.sourceModel
        delete row.sourceName
        delete row.sourceCodeField
        delete row.sourceNameField
        this.$set(row,'dictCodes',[])
        this.$set(row,'models',[])
        this.$set(row,'sourceNameFields',[])
        getCodes().then(res=>{
          let data=res.data.data.records
          data.forEach(item=>{
            item.label=item.dictValue
            item.value=item.id
          })
          this.$set(row,'dictCodes',data)
        })
      }
    },
    sourceModelChange(row) {
        row.sourceName=row.sourceModel
        delete row.sourceCodeField
        delete row.sourceNameField
        getModelCode(row.sourceModel).then(res=>{
          let data=res.data.data
          data.forEach(item=>{
            item.label=item.keyAndValue,
            item.value=item.id
          })
          this.$set(row,'dictCodes',data)
          this.$set(row,'sourceNameFields',data)
        })
    },
    //保存
    submit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let row=this.add_form
            row.powerFieldList.forEach(item=>{
              if(item.sourceCode==='D'){
                item.sourceModel=''
                item.sourceName=''
                item.sourceNameField=''
              }
            })
            this.rowSave(row)
          } else {
            return false;
          }
        });
    },
    //行新增
    addFiled() {
      this.add_form.powerFieldList.push({});
      this.$nextTick(() => {
          this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      })
    },
    //行删除
    sourceDelete(row,index){
      this.add_form.powerFieldList.splice(index,1);
      if(row.id){
        this.add_form.delPowerFiledList.push(row.id)
      }
    },
    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 35px'
    },
    openFullScreen2() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(f, f, f, 0.8)'
        });
        setTimeout(() => {
          loading.close();
        }, 1600);
      }
  },
  created() {
    this.api();
    this.getobj();
    this.getmodels("sourceCode").then(res => {
      this.codes = res.data.data;
    });
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.code_add, false),
        viewBtn: this.vaildData(this.permission.code_view, false),
        delBtn: this.vaildData(this.permission.code_delete, false),
        editBtn: this.vaildData(this.permission.code_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  }
};
</script>
<style scoped  lang="scss">
  @import "../../styles/power/power.scss";
</style>
