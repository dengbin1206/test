<!--
 * @Date: 2021-01-02 09:15:47
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-10 16:07:14
 * @FilePath: /SX-DTBF-VIEW/src/views/work/todo.vue
 * @Description: 
-->

<template>
  <basic-container>
    <div style="margin-top: 10px">
      <mysearch :option="searchOption"></mysearch>
    </div>
    <avue-crud :option="option" :data="tableData" :page="page">
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click="confirmProcess(scope.row)"
          >处理
        </el-button>
        <el-button type="text" size="small">流程监控图 </el-button>
        <el-button type="text" size="small">转办 </el-button>
      </template>
      <template slot-scope="scope" slot="processStatus">
        <el-tag type="warning" v-if="scope.row.processStatus === 1"
          >处理中</el-tag
        >
        <el-tag type="success" v-if="scope.row.processStatus === 2"
          >已完成</el-tag
        >
        <el-tag type="danger" v-if="scope.row.processStatus === 3"
          >已终止</el-tag
        >
      </template>
    </avue-crud>

    <!-- todo -->

    <fullScreenDialog
      ref="dialog"
      :visible.sync="visible"
      dialogTitle="流程环节"
    >
      <slot slot="toolBar">
        <el-button size="mini" type="info" icon="el-icon-printer"></el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-close"
          @click="visible = false"
          >关 闭</el-button
        >
      </slot>
      <div class="content">
        <div class="top">
          <table class="gridtable">
            <tr>
              <td>事务编号:</td>
              <td>{{ BasicInfo.processInstanceId }}</td>
              <td>流程名称:</td>
              <td>{{ BasicInfo.processDefinitionName }}</td>
              <td>事务标题:</td>
              <td>{{ BasicInfo.title }}</td>
              <td>事务状态:</td>
              <td>
                <el-tag type="warning" v-if="BasicInfo.processStatus === 1"
                  >处理中</el-tag
                >
                <el-tag type="success" v-if="BasicInfo.processStatus === 2"
                  >已完成</el-tag
                >
                <el-tag type="danger" v-if="BasicInfo.processStatus === 3"
                  >已终止</el-tag
                >
              </td>
            </tr>
            <tr>
              <td>申请人员:</td>
              <td>{{ BasicInfo.userName }}</td>
              <td>申请部门:</td>
              <td>{{ BasicInfo.deptName }}</td>
              <td>申请公司:</td>
              <td>{{ BasicInfo.companyName }}</td>
              <td>申请时间:</td>
              <td>{{ BasicInfo.createTime }}</td>
            </tr>
          </table>
        </div>
        <div class="middle">
          <el-tabs type="border-card">
            <el-tab-pane label="表单数据">
              <div class="form"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="bottom">
          <el-tabs type="border-card">
            <el-tab-pane label="审批意见">
              <div class="process">
                <table
                  class="gridtable"
                  style="margin-top: 5px"
                  v-for="(item, index) in ApprovalInfo"
                  :key="index"
                >
                  <tr>
                    <td rowspan="3">{{ item.taskName }}</td>
                    <td colspan="6" style="text-align: left">
                      {{ item.comment }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6" v-if="item.actFiles.length !== 0">
                      <div class="file_list">
                        <li class="files">
                          <a
                            href=""
                            v-for="(file, index) in item.actFiles"
                            :key="index"
                            ><i class="el-icon-document"></i>
                            {{ file.fileName }}</a
                          >
                        </li>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>处理人:</td>
                    <td>{{ item.assigneeName }}</td>
                    <td>处理时间:</td>
                    <td>{{ item.endTime }}</td>
                    <td>处理状态:</td>
                    <td>
                      <el-tag type="success" v-if="item.endTime">已处理</el-tag>
                      <el-tag type="danger" v-else>未处理</el-tag>
                    </td>
                  </tr>
                </table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="copyInfo">
          <el-tabs type="border-card">
            <el-tab-pane label="抄送信息">
              <table class="gridtable" style="margin-top: 5px">
                <tr>
                  <td>抄送于:</td>
                  <td style="width: 100px"></td>
                  <td>处理意见:</td>
                  <td></td>
                </tr>
              </table>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="comment">
          <table class="gridtable">
            <tr>
              <td>审批意见:</td>
              <td>
                <el-input
                  type="textarea"
                  :rows="5"
                  clearable
                  placeholder="请输入审批意见"
                  v-model="completeTask.comment"
                >
                </el-input>
              </td>
            </tr>
            <tr>
              <td>附件上传:</td>
              <td style="text-align: left" class="todoc">
                <fileUpload :data.sync="fileItem"></fileUpload>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <slot slot="footerBar">
        <el-popconfirm
          title="确定同意"
          placement="top"
          class="popconfirm"
          @confirm="passTask"
        >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            slot="reference"
            >同意</el-button
          >
        </el-popconfirm>
        <el-button
          size="mini"
          type="warning"
          icon="el-icon-back"
          class="popconfirm"
          @click="backTasks"
          >回退</el-button
        >
        <el-popconfirm
          title="确定拒绝"
          placement="top"
          class="popconfirm"
          @confirm="rejectTasks"
        >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-close"
            slot="reference"
            >拒绝</el-button
          >
        </el-popconfirm>
        <el-button
          size="mini"
          type="success"
          icon="el-icon-edit-outline"
          @click="copyTasks"
          >抄送</el-button
        >
      </slot>
    </fullScreenDialog>

    <!-- 回退 -->
    <el-dialog
      title="回退"
      width="60%"
      :show-close="false"
      :visible.sync="backVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-select size="small" v-model="backTask.nodeKey" placeholder="请选择回退节点" clearable>
        <el-option
          v-for="item in HistoryTask"
          :key="item.key"
          :label="item.name"
          :value="[item.key, item.assignee]"
        >
        </el-option>
      </el-select>
      <el-input
        type="textarea"
        :rows="5"
        clearable
        placeholder="请输入回退意见"
        style="margin-top: 5px"
        v-model="backTask.comment"
      >
      </el-input>
      <span slot="footer">
        <el-button
          size="mini"
          @click="backVisible = false"
          icon="el-icon-circle-close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-check"
          @click="getBackTask"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 抄送 -->
    <el-dialog
      title="抄送"
      width="60%"
      :show-close="false"
      :visible.sync="copyVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-select size="mini" v-model="copyTask.nodeKey"> </el-select>
      <el-input
        type="textarea"
        :rows="5"
        clearable
        placeholder="请输入抄送意见"
        style="margin-top: 5px"
        v-model="copyTask.comment"
      >
      </el-input>
      <span slot="footer">
        <el-button
          size="mini"
          @click="copyVisible = false"
          icon="el-icon-circle-close"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" icon="el-icon-circle-check"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { option } from "./todo";
import { todoList, flowInfo, getHistoryTaskBack, backToTask } from "@/api/work/todo";
import fileUpload from "@/components/fileUpload";

const confirmMessage = [
  {
    notice: "此操作将同意, 是否继续?",
  },
  {
    title: "提示",
  },
  {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    roundButton: true,
    closeOnClickModal: false,
    showClose: false,
  },
];

export default {
  components: {
    fileUpload,
  },
  data() {
    return {
      option: option,
      visible: false,
      backVisible: false,
      copyVisible: false,
      textarea: "",
      showFileColumns: true,
      tableData: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      fileItem: [],
      BasicInfo: {
        title: "",
        userName: "",
        deptName: "",
        companyName: "",
        createTime: "",
        processStatus: "",
        processInstanceId: "",
        processDefinitionName: "",
      },
      ApprovalInfo: [],
      completeTask: {
        taskId: "",
        actFiles: "",
        comment: "",
      },
      processInstanceId: "",
      copyTask: {},
      HistoryTask: [],
      backTask: {
        taskId: "",
        nodeKey: "",
        assignee: "",
        comment: "",
      },
      searchOption: {
        labelWidth: "100px",
        size: "small",
        column: [
          {
            label: "开始时间",
            prop: "",
            type: "date",
          },
          {
            label: "结束时间",
            prop: "",
            type: "date",
          },
          {
            label: "上一处理人",
            prop: "",
          },
          {
            label: "发起组织",
            prop: "",
          },
          {
            label: "事务编号",
            prop: "",
          },
          {
            label: "流程名称",
            prop: "",
          },
          {
            label: "发起人姓名",
            prop: "",
          },
        ],
      },
    };
  },

  created() {
    this.queryList(this.page);
  },

  methods: {
    async queryList(page, params = {}) {
      const { data: res } = await todoList(page.currentPage, page.pageSize, {
        ...params,
      });
      const { data } = res;
      this.tableData = data.records;
      this.page.total = data.total;
    },

    async confirmProcess(row) {
      this.visible = true;
      const { processInstanceId, taskId } = row;
      this.completeTask.taskId = taskId;
      this.processInstanceId = processInstanceId;
      // 获取抬头详情
      this.BasicInfo = { ...row };
      // 获取流程流转信息
      const { data: res } = await flowInfo(processInstanceId);
      const { code, msg, data } = res;
      this.ApprovalInfo = data;
    },

    // 同意
    passTask() {
      this.visible = false;
      console.log(this.fileItem);
    },

    // 回退
    backTasks() {
      this.backVisible = true;
      this.getHistoryTask();
      this.backTask = {}
    },

    async getBackTask() {
      let payload = {
        taskId: this.completeTask.taskId,
        nodeKey: this.backTask.nodeKey[0],
        assignee: this.backTask.nodeKey[1],
        comment: this.backTask.comment,
      };

      const { data } = await backToTask(payload)
    },

    // 拒绝
    rejectTasks() {
      this.visible = false;
    },

    // 抄送
    copyTasks() {
      this.copyVisible = true;
    },

    async getHistoryTask() {
      const { data: res } = await getHistoryTaskBack(this.processInstanceId);
      const { data, code, msg } = res;
      this.HistoryTask = data;
    },
  },
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

.popconfirm {
  margin-right: 10px;
}
@import url("../../styles/work/todoc.css");
</style>