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
                <el-button icon="el-icon-plus" size="small" type="primary"  @click="open()">新增</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
                <el-button icon="el-icon-view" size="small" type="text"  @click="look(scope.row)"  v-if="scope.row.flowStatus!=='0'">查看</el-button>
                <el-button icon="el-icon-edit" size="small" type="text"  @click="edit(scope.row)" v-if="scope.row.flowStatus==='0'">编辑</el-button>
                <el-button icon="el-icon-s-flag" size="small" type="text"  @click="check(scope.row)"  v-if="scope.row.flowStatus!=='0'">查看审批</el-button>
                <el-button icon="el-icon-s-tools" size="small" type="text"  @click="shouq(scope.row)"  v-if="scope.row.flowStatus=='2'">授权查看</el-button>
                <el-button icon="el-icon-delete" size="small" type="text"  @click="del(scope.row)" style="color:red" v-if="scope.row.flowStatus==='0'">删除</el-button>
            </template>
            <template slot-scope="scope" slot="projectScale">
                <span  v-if="scope.row.projectScale == 1">50万及以上</span>
                <span  v-if="scope.row.projectScale == 2">50万以下</span>
            </template>
        </avue-crud>
        <el-dialog
            v-dialog
            :fullscreen="fullscren"
            :title="bar"
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            class='avue-dialog'
            width="75%"
            top='8vh'
            ref="dialog"
            append-to-body
            :close-on-click-modal='false'
            :close-on-press-escape="false"
            >
            <div slot="title" class="avue-crud__dialog__header">
              <span class="el-dialog__title">{{ bar }}</span>
              <div class="avue-crud__dialog__menu">
                <i
                  @click="handleFullScreen"
                  class="el-dialog__close el-icon-full-screen"
                ></i>
              </div>
            </div>
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
                <addDialog ref="addLog" :api='api' :turnoff='turnoff'/>
            </div>
        </el-dialog>
        <diaVisLog ref="sonV"></diaVisLog>
        <el-dialog
            v-dialog
            title="授权查看"
            width="75%"
            top='8vh'
            :visible.sync="dialogshouq"
            append-to-body
            :close-on-click-modal='false'
            :close-on-press-escape="false"
            >
              <el-row>
                <el-col :span="2" style="text-align:right;padding-right:5px;line-height:32px">姓名:</el-col>
                <el-col :span="12">
                  <el-select size="small" v-model="sqData.authPerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getauthName"  style="width:100%">
                        <el-option
                          v-for="item in authNames"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value">
                          <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                        </el-option>
                    </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="2" style="text-align:right;padding-right:5px;line-height:32px">授权原因:</el-col>
                <el-col :span="12">
                  <el-select v-model="sqData.authReason" placeholder="请选择授权原因" size="small" style="width:100%" clearable>
                        <el-option v-for="item in reasonOption" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                    </el-select>
                </el-col>
              </el-row>
              <div style="margin-top:20px;text-align:right">
                <el-button type="primary" @click="savebtn" size="small" icon="el-icon-check">保存</el-button>
              </div>
        </el-dialog>
    </basic-container>
</template>
<script>
import diaVisLog from "../../work/dialog";
import addDialog from "./components/xmbdAdd";
import {
  report,
  deleteByIds,
  getUserInfoBySearch,
  saveSingle
} from "@/api/biz/crm/xmbd";
import { setTimeout } from "timers";
import { getDictBizByCode } from "@/api/system/dict";
export default {
  components: {
    addDialog,
    diaVisLog
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    check(row) {
      this.$refs.sonV.confirmProcess(true, row, 0, "");
    },
    open() {
      this.dialogVisible = true;
      this.bar = "新增 项目报登";
      setTimeout(() => {
        this.$refs.addLog.open(this.rowId, 1);
      }, 10);
    },
    edit(row) {
      this.dialogVisible = true;
      this.bar = "编辑 项目报登";
      setTimeout(() => {
        this.$refs.addLog.open(row.id, 2);
      }, 10);
    },
    look(row) {
      this.dialogVisible = true;
      this.bar = "查看 项目报登";
      setTimeout(() => {
        this.$refs.addLog.open(row.id, 3);
      }, 10);
    },
    turnoff() {
      this.dialogVisible = false;
      this.api();
    },
    shouq(row) {
      this.dialogshouq = true;
      this.sqData.authPerson = "";
      this.sqData.authReason = "";
      this.getauthReason();
      this.sqData.projectId=row.id;
    },
    getauthReason() {
      getDictBizByCode("crm_auth_reason").then(res => {
        this.reasonOption = res.data.data;
      });
    },
    getauthName(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          res.data.data.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
          this.$set(this, "authNames", res.data.data);
        });
      } else {
        this.$set(this, "authNames", []);
      }
    },
    savebtn() {
      if (this.sqData.authPerson == "") {
        this.$message({
          message: "请选择被授权人",
          type: "warning"
        });
      } else {
        saveSingle(this.sqData).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogshouq = false;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      }
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "projectName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.projectName,
                upperValue: ""
              }
            ]
          },
          {
            field: "projectReportNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.projectReportNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "clientId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.clientId,
                upperValue: ""
              }
            ]
          },
          {
            field: "chargeStaff",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.chargeStaff,
                upperValue: ""
              }
            ]
          },
          {
            field: "aboutAmount",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.aboutAmount,
                upperValue: ""
              }
            ]
          },
          {
            field: "departmentId",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.departmentId,
                upperValue: ""
              }
            ]
          }
        ]
      };
      report(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    api() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: []
      };
      report(obj).then(res => {
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
    rowStyle() {
      return "height: 35px";
    },
    cellStyle() {
      return "padding: 0";
    },
    del(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteByIds(row.id).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.api();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    industryChange() {
      if (this.data.length > 0) {
        this.data.forEach(item => {
          if (item.segmentIndustry != "") {
            dictionary_group("industry", item.industry).then(res => {
              this.$set(item, "segmentIndustrys", res.data.data);
            });
          }
        });
      }
    }
  },
  created() {
    this.api();
    this.industryChange();
  },
  data() {
    return {
      bar: "",
      fullscren: false,
      dialogshouq: false,
      sqData: {
        authPerson: "",
        authReason: "",
        projectId:''
      },
      reasonOption: [],
      authNames: [],
      rowId: "",
      dialogVisible: false,
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      data: [],
      selectQuery: "",
      clickquery: "",
      segmentIndustrys: [],
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "projectName",
              label: "项目名称:",
              placeholder: "请输入项目名称"
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "projectReportNum",
              label: "项目报登号:",
              placeholder: "请输入项目报登号",
              url: "api/blade-crm/project/reportNumByLabel?search="
            }
          ],
          [
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "clientId",
              label: "客户名称:",
              placeholder: "请输入关键字",
              url: "api/blade-crm/customer/blurrySelect?search="
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "chargeStaff",
              label: "负责员工:",
              placeholder: "请输入关键字",
              url: "api/blade-user/getUserInfoBySearch?search="
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "aboutAmount",
              label: "预计项目金额(元):",
              placeholder: "请输入预计项目金额(元)"
            },
            {
              type: "fuzzySearch",
              queryType: "1",
              prop: "departmentId",
              label: "部门:",
              placeholder: "请输入关键字",
              url: "api/blade-system/dept/deptByLabel?search="
            }
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 230,
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
            label: "项目报登号",
            prop: "projectReportNum",
            width: 130
          },
          {
            label: "项目名称",
            prop: "projectName",
            width: 200
          },
          {
            label: "客户名称",
            prop: "clientName",
            width: 200
          },
          {
            label: "预计项目金额(万元)",
            prop: "aboutAmount",
            width: 130
          },
          {
            label: "甲方项目进度",
            prop: "projectSchedule",
            width: 130,
            type: "select",
            dicUrl:
              "/api/blade-system/dict-biz/dictionary?code=crm_project_schedule",
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "预计招标日期",
            prop: "tenderDate",
            width: 150
          },
          {
            label: "负责员工",
            prop: "chargeStaffName"
          },
          {
            label: "部门",
            prop: "departmentName",
            width: 200
          },
          {
            label: "审批状态",
            prop: "flowStatus",
            width: 150,
            type: "select",
            dicUrl: `/api/blade-system/dict/dictionary?code=flow_status`,
            props: {
              label: "dictValue",
              value: "dictKey"
            }
          },
          {
            label: "审批结束时间",
            prop: "flowCompletedTime",
            width: 150
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
