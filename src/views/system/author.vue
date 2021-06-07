<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud :data="data" :option="option" :cell-style="cellStyle" :row-style="rowStyle">
            <template slot-scope="scope" slot="menuLeft">
                  <el-button type="primary" icon="el-icon-plus" size="small" @click='add()'>新增</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
                  <el-button type="text" size="small" icon="el-icon-edit" @click.stop="edit(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" style="color:red" icon="el-icon-delete" @click="rowDel(scope.row)" v-show="scope.row.status==1">撤销授权</el-button>
            </template>
            <template slot-scope="scope" slot="status">
                <el-tag type="success" v-if="scope.row.status === 1"
                >授权中</el-tag
                >
                <el-tag type="danger" v-if="scope.row.status === 0"
                >已取消</el-tag
                >
                <el-tag type="warning" v-if="scope.row.status === 2"
                >已过期</el-tag
                >
            </template>
        </avue-crud>
        <el-dialog
            :title="title"
            append-to-body
            :show-close='false'
            :close-on-click-modal='false'
            :visible.sync="dialogVisible"
            width="60%">
            <el-form :rules="rules" ref="ruleForm" :model="addForm">
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="被授权人:" label-width="90px" prop="impowerUserId">
                            <template>
                                <el-select
                                    v-model="addForm.impowerUserId"
                                    filterable
                                    clearable
                                    remote
                                    reserve-keyword
                                    size="small"
                                    style="width:100%"
                                    placeholder="请输入关键词"
                                    :remote-method="remoteMethod"
                                    :loading="loading">
                                    <el-option
                                    v-for="item in userOption"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="授权时间:" label-width="90px" prop="authorizeStartTime">
                            <template>
                                <el-date-picker
                                    v-model="addForm.authorizeStartTime"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    style="width:46%"
                                    placeholder="开始日期" >
                                </el-date-picker>
                                <span style="width:8%;text-align:center;display:inline-block">到</span>
                                <el-date-picker
                                    v-model="addForm.authorizeEndTime"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    style="width:46%"
                                    placeholder="结束日期">
                                </el-date-picker>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="授权组织:" label-width="90px">
                            <template>
                                <avue-input-tree default-expand-all size='small' clearable style="width:100%" v-model="addForm.authorizeDeptId" placeholder="请选择内容" type="tree" :dic="deptOption"></avue-input-tree>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="授权流程:" label-width="90px">
                            <template>
                                <avue-select multiple size='small' clearable style="width:100%" v-model="addForm.modelKeyList" placeholder="请选择内容" type="tree" :dic="modelList"></avue-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close('ruleForm')" size="small">取 消</el-button>
                <el-button type="primary" @click="submit('ruleForm')" size="small">保 存</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>
<script>
import {
  list,
  deptList,
  getAllFLow,
  saveOrUpdate,
  findById,
  undoAuthorize
} from "@/api/system/author";
import { user_code } from "@/api/system/group";
export default {
  data() {
    return {
      rules: {
        impowerUserId: [
          { required: true, message: "请选择被授权人", trigger: "blur" }
        ],
        authorizeStartTime: [
          { required: true, message: "请选择被授时间", trigger: "blur" }
        ]
      },
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "impowerUserName",
              label: "被授权人:",
              placeholder: "请输入被授权人"
            },
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "创建时间:",
              placeholder: "请选择创建时间"
            }
          ],
          [
            {
              type: "date",
              queryType: "2",
              prop: "authorizeStartTime",
              label: "授权开始时间:",
              placeholder: "请选择授权开始时间"
            },
            {
              type: "date",
              queryType: "2",
              prop: "authorizeEndTime",
              label: "授权结束时间:",
              placeholder: "请选择授权结束时间"
            }
          ],
          [
            {
              type: "select",
              queryType: "1",
              prop: "status",
              label: "事务状态:",
              list: [
                {
                  dictValue: "授权中",
                  dictKey: 1
                },
                {
                  dictValue: "已取消",
                  dictKey: 0
                },
                {
                  dictValue: "已过期",
                  dictKey: 2
                }
              ],
              placeholder: "请选择事务状态"
            }
          ]
        ]
      },
      data: [],
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
        searchBtn: false,
        stripe: true,
        indexLabel: "序号",
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        column: [
          {
            label: "授权人",
            prop: "createUserName",
            width: 80
          },
          {
            label: "被授权人",
            prop: "impowerUserName",
            width: 80
          },
          {
            label: "授权开始时间",
            prop: "authorizeStartTime",
            width: 150
          },
          {
            label: "授权结束时间",
            prop: "authorizeEndTime",
            width: 150
          },
          {
            label: "授权组织",
            prop: "authorizeDeptName"
          },
          {
            label: "授权流程",
            prop: "authorizeFlowName"
          },
          {
            label: "授权状态",
            prop: "status",
            slot: true,
            width: 80
          },
          {
            label: "创建时间",
            prop: "createTime",
            width: 150
          }
        ]
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      dialogVisible: false,
      title: "",
      userOption: [],
      addForm: {},
      deptOption: [],
      modelList: []
    };
  },
  methods: {
    //列表接口，获取数据
    api() {
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
    //递归组织
    deptAcc(children) {
      children.forEach(item => {
        (item.label = item.deptName), (item.value = item.id);
        if (item.children && item.children.length > 0) {
          this.deptAcc(item.children);
        }
      });
    },
    deptFlow() {
      deptList().then(res => {
        this.deptOption = res.data.data;
        this.deptOption.forEach(item => {
          (item.label = item.deptName), (item.value = item.id);
          if (item.children && item.children.length > 0) {
            this.deptAcc(item.children);
          }
        });
      });
      getAllFLow().then(res => {
        this.modelList = res.data.data;
        this.modelList.forEach(item => {
          (item.label = `${item.name} (${item.modelAlias})`), (item.value = item.modelKey);
        });
      });
    },
    //新增
    add() {
      this.dialogVisible = true;
      this.title = "新增";
      this.addForm = {};
      this.deptFlow();
    },
    //编辑
    edit(row) {
      this.dialogVisible = true;
      this.addForm = {};
      this.title = "编辑";
      findById(row.id).then(res => {
        if (res.data.code == "200") {
          this.addForm = res.data.data;
          this.userOption = [
            {
              realName: res.data.data.impowerUserName,
              id: res.data.data.impowerUserId
            }
          ];
          console.log(this.userOption);
        }
      });
      this.deptFlow();
    },
    //
    close(formName){
      this.dialogVisible = false
      this.$refs[formName].resetFields();
    },
    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 35px'
    },
    //保存
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          const row = this.addForm;
          if (row.id && row.id != "") {
            saveOrUpdate(row).then(res => {
              if (res.data.code == "200") {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.api();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            saveOrUpdate(row).then(res => {
              if (res.data.code == "200") {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.api();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        } else {
          this.$message({
            message: "被授权人跟授权时间不能为空",
            type: "warning"
          });
        }
      });
    },
    //取消授权
    rowDel(row) {
      this.$confirm("确定撤消授权吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          undoAuthorize(row.id).then(res => {
            if (res.data.code == "200") {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.api();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    remoteMethod(query) {
      if (query !== "") {
        user_code(query).then(res => {
          this.userOption = res.data.data;
        });
      }
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
            field: "createTime",
            expressionList: [
              {
                operator: "BT",
                lowerValue: val.createTime ? val.createTime[0] : "",
                upperValue: val.createTime ? val.createTime[1] : ""
              }
            ]
          },
          {
            field: "authorizeStartTime",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.authorizeStartTime
                  ? val.authorizeStartTime[0]
                  : "",
                upperValue: val.authorizeStartTime
                  ? val.authorizeStartTime[1]
                  : ""
              }
            ]
          },
          {
            field: "authorizeEndTime",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.authorizeEndTime ? val.authorizeEndTime[0] : "",
                upperValue: val.authorizeEndTime ? val.authorizeEndTime[1] : ""
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
          }
        ]
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    }
  },
  created() {
    this.api();
  }
};
</script>
<style lang='scss' scoped>
</style>
