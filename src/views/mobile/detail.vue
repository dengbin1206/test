<template>
  <el-container
    style="width: 100%; height: 100%; background: rgb(248, 248, 248)"
  >
    <el-header>
      <el-row style="width: 100%; height: 100%">
        <el-col :span="3" style="text-align: center; font-size: 20px"
          ><i class="el-icon-arrow-left" @click="htts"></i
        ></el-col>
        <el-col :span="18" style="text-align: center; font-size: 20px"
          ><i class="el-icon-s-home" @click="home"></i
        ></el-col>
        <el-col :span="3" style="text-align: center; font-size: 20px"></el-col>
      </el-row>
    </el-header>
    <el-main style="background: #fff">
      <el-row style="text-align: center; border-bottom: 1px solid #ccc">
        <h3 style="margin: 10px 0">
          {{ bookList.createUserName }} 发起的 {{ bookList.flowName }}
        </h3>
      </el-row>
      <el-row style="width: 100%; height: auto" class="h3_style">
        <el-col style="border-bottom: 1px solid #ccc; padding: 0 10px"
          ><h3 style="width: 25%; display: inline-block">事务编号:</h3>
          {{ bookList.instId }}</el-col
        >
        <el-col style="border-bottom: 1px solid #ccc; padding: 0 10px"
          ><h3 style="width: 25%; display: inline-block">事务标题:</h3>
          {{ bookList.title }}</el-col
        >
        <el-col style="border-bottom: 1px solid #ccc; padding: 0 10px"
          ><h3 style="width: 25%; display: inline-block">申请部门:</h3>
          {{ bookList.createDeptName }}</el-col
        >
        <el-col style="border-bottom: 1px solid #ccc; padding: 0 10px">
          <h3 style="width: 25%; display: inline-block">事务状态:</h3>
          <el-tag type="warning" size="mini" v-if="bookList.status === 1"
            >处理中</el-tag
          >
          <el-tag type="success" size="mini" v-if="bookList.status === 2"
            >已完成</el-tag
          >
          <el-tag type="danger" size="mini" v-if="bookList.status === 3"
            >已作废</el-tag
          >
        </el-col>
      </el-row>
      <div class="renderDetail">
        <div class="inner">
          <renderDetail
            :dataId="dataId"
            :paramId="paramId"
            :paramType="paramType"
            :proDefId="proDefId"
            :nodeCode="nodeCode"
            :editFlag="editFlag"
            :visible="visibles"
          />
        </div>
        <!-- <formdata
          v-if="formType == 'M'"
          :dialog="visibles"
          :dataId="dataId"
          :formType="formType"
          :editFlag="editFlag"
          :proDefId="proDefId"
          :nodeCode="nodeCode"
          :formId="formId"
          :routeName="routeName"
        ></formdata> -->
        <customPage
          v-if="formType == 'S'"
          :flowNode="flowKey"
          :nodeAlias="nodeAlias"
          :dataId="dataId"
          :editFlag="editFlag"
        />
      </div>
      <div class="block" style="padding: 10px 10px 0 10px">
        <el-timeline>
          <el-timeline-item
            class="sx_item_stutes"
            :color="item.color"
            :icon="item.icon"
            v-for="(item, index) in activeList"
            :key="index"
          >
            <el-card class="sx_row_style">
              <el-row style="width: 100%">
                <el-col :span="16"
                  ><h3 style="margin: 0">{{ item.nodeName }}</h3></el-col
                >
                <el-col :span="8">
                  <el-tag
                    type="success"
                    v-if="item.status == 1"
                    style="float: right"
                    >同意</el-tag
                  >
                  <el-tag
                    type="primary"
                    v-else-if="item.status == 2"
                    style="float: right"
                    >转办</el-tag
                  >
                  <el-tag
                    type="info"
                    v-else-if="item.status == 3"
                    style="float: right"
                    >回退</el-tag
                  >
                  <el-tag
                    type="danger"
                    v-else-if="item.status == 4"
                    style="float: right"
                    >拒绝</el-tag
                  >
                  <el-tag
                    type="danger"
                    v-else-if="item.status == 5"
                    style="float: right"
                    >作废</el-tag
                  >
                  <el-tag
                    type="warning"
                    v-else-if="item.status == ''"
                    style="float: right"
                    >待处理</el-tag
                  >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24"
                  ><i
                    class="el-icon-time"
                    style="font-size: 16px; margin-right: 5px"
                  ></i
                  >{{ item.startTime }} 到 {{ item.assignTime }}</el-col
                >
              </el-row>
              <el-row>
                <el-col :span="24"
                  ><h3 style="margin: 0; display: inline-block">
                    {{ item.userName }}:
                  </h3>
                  {{ item.assignComment }}</el-col
                >
              </el-row>
              <el-row v-show="item.flowFileList.length > 0">
                <el-col :span="24">
                  <p
                    class="files"
                    v-for="(file, index) in item.flowFileList"
                    :key="index"
                    @click="handlePreview(file)"
                    style="color: #409eff; margin: 5px 0"
                  >
                    <i class="el-icon-document" style="color: #409eff"></i
                    >{{ file.fileName }}
                  </p>
                </el-col>
              </el-row>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="sx_copy_style" v-show="copyList.length > 0">
        <el-row
          class="sx_kp_style"
          v-for="(item, index) in copyList"
          :key='index'
          style="margin-top: 10px; background: #fff"
        >
          <el-col
            :span="24"
            style="
              padding-left: 10px;
              height: 32px;
              line-height: 32px;
              border-bottom: 1px solid #ccc;
            "
            ><h3 style="margin: 0; display: inline-block">
              {{ item.createUserName }}
            </h3>
            <h3 style="margin: 0; display: inline-block; margin: 0 5px">
              抄送给
            </h3>
            <h3 style="margin: 0; display: inline-block">
              {{ item.delegateUserName }}
            </h3></el-col
          >
          <el-col
            :span="24"
            style="padding-left: 10px; height: 32px; line-height: 32px"
            >留言:<span>{{ item.memo }}</span></el-col
          >
          <el-col
            :span="24"
            style="padding-left: 10px; height: 32px; line-height: 32px"
            >回复:<span>{{ item.reply }}</span></el-col
          >
        </el-row>
      </div>
      <div style="margin-top: 20px; padding: 0 10px">
        <el-row
          style="width: 100%; margin-top: 5px"
          v-for="(item,index) in nextNodeDTOList"
          :key="index"
        >
          <el-col
            :span="8"
            style="text-align: right; line-height: 28px; font-size: 13px"
            >{{ item.nodeName }}:</el-col
          >
          <el-col :span="16">
            <el-select
              style="width: 100%"
              v-model="item.userIds"
              multiple
              filterable
              remote
              size="small"
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in zbOption"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              >
                <p style="margin: 0px 10px">
                  {{ item.realName }}({{ item.account }}) — {{ item.deptName }}
                </p>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 10px; padding: 0 10px">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写审批意见"
          v-model="comment"
        >
        </el-input>
      </div>
      <div style="padding: 0 0 0 5px">
        <el-row>
          <el-col :span="24" style="height: 20px"
            ><fileUpload :data.sync="fileItem"></fileUpload
          ></el-col>
        </el-row>
      </div>
    </el-main>
    <!-- 回退 -->
    <el-dialog
      title="回退"
      width="60%"
      :show-close="false"
      :visible.sync="htAload"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row style="width: 100%">
        <el-col
          :span="24"
          style="text-align: left; line-height: 32px; padding: 0 10px 0 0"
          ><div>回退环节:</div></el-col
        >
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-select
            v-model="htvalue"
            placeholder="请选择"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in htoption"
              :key="item.nodeId"
              :label="item.nodeName"
              :value="item.nodeId"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col
          :span="24"
          style="text-align: left; line-height: 32px; padding: 0 10px 0 0"
          ><div>回退意见:</div></el-col
        >
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入回退意见"
            style="margin-top: 5px"
            v-model="htText"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="htAload = false"
          icon="el-icon-circle-close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-check"
          @click="htSub"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 抄送 -->
    <el-dialog
      title="抄送"
      width="60%"
      :show-close="false"
      :visible.sync="csVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row style="width: 100%">
        <el-col
          :span="24"
          style="text-align: left; line-height: 32px; padding: 0 10px 0 0"
          ><div>抄送人:</div></el-col
        >
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-select
            style="width: 100%"
            v-model="csState"
            multiple
            filterable
            remote
            size="small"
            popper-class="sx_flow_select"
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              style="height: 25px"
              v-for="item in zbOption"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
              <p style="margin: 0px 10px">
                {{ item.realName }}({{ item.account }}) — {{ item.deptName }}
              </p>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col
          :span="24"
          style="text-align: left; line-height: 32px; padding: 0 10px 0 0"
          ><div>留言:</div></el-col
        >
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-input
            type="textarea"
            :rows="5"
            clearable
            placeholder="请输入留言"
            style="margin-top: 5px"
            v-model="csText"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="csVisible = false"
          icon="el-icon-circle-close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-check"
          @click="csSub"
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
      <el-row style="width: 100%">
        <el-col
          :span="24"
          style="text-align: left; line-height: 32px; padding: 0 10px 0 0"
          ><div>转办人:</div></el-col
        >
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-select
            style="width: 100%"
            v-model="zbState"
            multiple
            filterable
            remote
            size="small"
            reserve-keyword
            popper-class="sx_flow_select"
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              style="height: 25px"
              v-for="item in zbOption"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
              <p style="margin: 0px 10px">
                {{ item.realName }}({{ item.account }}) — {{ item.deptName }}
              </p>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col
          :span="24"
          style="text-align: left; line-height: 32px; padding: 0 10px 0 0"
          ><div>转办意见:</div></el-col
        >
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-input
            type="textarea"
            :rows="5"
            clearable
            placeholder="请输入转办意见"
            style="margin-top: 5px"
            v-model="zbText"
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="zbAload = false"
          icon="el-icon-circle-close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-check"
          @click="zbSub"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-footer style="height: 50px">
      <el-row style="height: 100%; width: 100%">
        <el-col :span="13" style="height: 100%; display: flex; padding: 5px 0">
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 5px 0;
              width: 25%;
              text-align: center;
            "
            v-show="backFlag == 1"
            @click="backTasks"
          >
            <i class="el-icon-refresh-right" style="font-size: 18px"></i
            ><span style="height: 20px">回退</span>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 5px;
              width: 25%;
              text-align: center;
            "
            @click="copyTasks"
          >
            <i class="el-icon-position" style="font-size: 18px"></i
            ><span style="height: 20px">抄送</span>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 5px;
              width: 25%;
              text-align: center;
            "
            @click="manageTasks"
          >
            <i class="el-icon-refresh" style="font-size: 18px"></i
            ><span style="height: 20px">转办</span>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 5px;
              width: 25%;
              text-align: center;
            "
            v-show="signForFlag == 1"
            @click="signTasks"
          >
            <i class="el-icon-edit-outline" style="font-size: 18px"></i
            ><span style="height: 20px">签收</span>
          </div>
        </el-col>
        <el-col :span="11" style="height: 100%">
          <el-button-group
            style="margin-top: 7px; float: right; margin-right: 5px"
          >
            <el-button
              size="medium"
              round
              style="color: #f56c6c"
              @click="rejectTasks"
              >拒绝</el-button
            >
            <el-button size="medium" type="primary" @click="passTask" round
              >同意</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import {
  historyInfo,
  completeTask,
  getBackNode,
  backToTask,
  stopTask,
  getUserInfoBySearch,
  copyTask,
  delegateTask,
  claimTask,
} from "@/api/work/todo";
import { getToken } from "@/util/auth";
import fileUpload from "@/components/fileUpload";
import website from "@/config/website";
import formdata from "../work/formData/index";
import customPage from "../work/biz/customPage";
export default {
  components: {
    fileUpload,
    formdata,
    customPage,
    renderDetail: () => import('./RenderDetail/index'),
  },
  data() {
    return {
      pageStyle: {
        width: "100%",
        height: "500px",
      },
      paramType: "",
      paramId: "",
      nodeAlias: "",
      flowKey: "",
      proInstId: "",
      taskId: "",
      editFlag: false,
      type: "",
      comment: "",
      bookList: {
        createUserName: "",
        flowName: "",
        instId: "",
        title: "",
        createDeptName: "",
        status: "",
      },
      proDefId: "",
      nodeCode: "",
      activeList: [],
      copyList: [],
      nextNodeDTOList: [],
      backFlag: "",
      stopFlag: "",
      signForFlag: "",
      htAload: false,
      htvalue: "",
      htText: "",
      csVisible: false,
      zbOption: [],
      csState: "",
      loading: false,
      csText: "",
      taskName: "",
      actFiles: [],
      zbState: "",
      zbAload: false,
      zbText: "",
      fileItem: [],
      visibles: false,
      dataId: "",
      formType: "",
      formId: "",
      routeName: "",
      flag: false,
    };
  },
  methods: {
    getList() {
      var params = {
        proInstId: this.proInstId,
        taskId: this.taskId,
      };
      historyInfo(params).then((res) => {
        if (res.data.code == "200") {
          if (res.data.data.taskId == "") {
            this.$message.error("该流程已被处理");
            history.go(-1);
          }
          this.bookList = res.data.data.flowInstanceVo;
          this.activeList = res.data.data.flowActivityVOList;
          this.copyList = res.data.data.flowInstanceCopyList;
          this.signForFlag = res.data.data.signForFlag;
          this.backFlag = res.data.data.flowNodeVo.backFlag;
          this.actFiles = res.data.data.flowInstanceVo.actFiles;
          this.stopFlag = res.data.data.flowNodeVo.stopFlag;
          this.taskName = res.data.data.flowNodeVo.nodeName;
          this.dataId = res.data.data.flowInstanceVo.dataId;
          this.paramType = res.data.data.flowProcessForm.formType;
          this.paramId = res.data.data.flowProcessForm.formId;
          this.editFlag = res.data.data.editFlag;
          this.routeName = res.data.data.flowProcessForm.routeName;
          this.nextNodeDTOList = res.data.data.nextNodeDTOList;
          this.flowKey = res.data.data.flowInstanceVo.flowKey;
          this.nodeAlias = res.data.data.flowNodeVo.nodeAlias;
          this.proDefId = res.data.data.flowInstanceVo.proDefId;
          this.nodeCode = res.data.data.flowNodeVo.nodeCode;
          this.activeList.forEach((item) => {
            if (item.startTime != "") {
              item.startTime = item.startTime.slice(2, 16);
            }
            if (item.assignTime != "") {
              item.assignTime = item.assignTime.slice(2, 16);
            }
            if (item.status == 1) {
              item.icon = "el-icon-check";
              item.color = "#67c23a";
            } else if (item.status == 2) {
              item.icon = "el-icon-refresh";
              item.color = "rgb(64, 158, 255)";
            } else if (item.status == 3) {
              item.icon = "el-icon-refresh-right";
              item.color = "rgb(144, 147, 153)";
            } else if (item.status == 4) {
              item.icon = "el-icon-close";
              item.color = "#F56C6C";
            } else if (item.status == 5) {
              item.icon = "el-icon-folder-delete";
              item.color = "#F56C6C";
            } else if (item.status == "") {
              item.icon = "el-icon-edit-outline";
              item.color = "#E6A23C";
            }
            this.visibles = true;
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    home() {
      this.$router.push("/mobile/index");
    },
    htts() {
      this.$router.push("/mobile/backlog");
    },
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&affixId=${file.fileId || ""}`
      );
    },
    //同意
    passTask() {
      if (this.nextNodeDTOList.length > 0) {
        for (var i = 0; i < this.nextNodeDTOList.length; i++) {
          if (this.nextNodeDTOList[i].userIds.length < 1) {
            this.$message({
              message: "请选择下一环节处理人",
              type: "warning",
            });
            return;
          }
        }
        let payload = {
          taskId: this.taskId,
          actFiles: this.fileItem,
          comment: this.comment,
        };
        if(this.comment==""){
          this.$message({
            message: '请填写审批意见！',
            type: 'warning'
          });
          return ;
        }
        completeTask(payload).then((res) => {
          if (res.data.code == "200") {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.htts();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else if (this.nextNodeDTOList.length < 1) {
        let payload = {
          taskId: this.taskId,
          actFiles: this.fileItem,
          comment: this.comment,
        };
        completeTask(payload).then((res) => {
          if (res.data.code == "200") {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.htts();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    //回退
    backTasks() {
      (this.htvalue = ""), (this.htoption = []), (this.htText = "");
      var params = {
        taskId: this.taskId,
      };
      getBackNode(params).then((res) => {
        if (res.data.data.length < 1) {
          this.$message({
            message: "没有可回退环节",
            type: "warning",
          });
        } else {
          this.htoption = res.data.data;
          this.htAload = true;
        }
      });
    },
    //回退确认
    htSub() {
      backToTask(this.taskId, this.htvalue, this.htText).then((res) => {
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.htAload = false;
          this.htts();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 拒绝
    rejectTasks() {
      var params = {
        taskId: this.taskId,
        comment: this.comment,
      };
      this.$confirm("确定拒绝吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          stopTask(params).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.htts();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消删除",
          });
        });
    },
    // 抄送弹框
    copyTasks() {
      this.csVisible = true;
    },
    //抄送远程搜索
    remoteMethod(query) {
      if (query != "") {
        var params = {
          search: query,
        };
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          getUserInfoBySearch(params).then((res) => {
            this.zbOption = res.data.data;
          });
        }, 200);
      } else {
        this.zbOption = [];
      }
    },
    //抄送确定
    csSub() {
      var params = {
        taskId: this.taskId,
        actFiles: this.actFiles,
        comment: this.comment,
        userIds: this.csState,
        flowInstanceCopy: {
          proInstId: this.proInstId,
          taskId: this.taskId,
          taskName: this.taskName,
          memo: this.csText,
        },
      };
      copyTask(params).then((res) => {
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.csVisible = false;
          this.csState = [];
          this.csText = "";
          this.getList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //转办弹框
    manageTasks() {
      this.zbAload = true;
    },
    //转办确定
    zbSub() {
      var params = {
        taskId: this.taskId,
        comment: this.zbText,
        userIds: this.zbState,
        actFiles: this.actFiles,
      };
      delegateTask(params).then((res) => {
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.zbAload = false;
          this.htts();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //签收
    signTasks() {
      var params = {
        taskId: this.taskId,
      };
      claimTask(params).then((res) => {
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.getList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
  beforeMount() {
    this.proInstId = this.$route.query.proInstId;
    this.taskId = this.$route.query.taskId;
    this.getList();
  },


};
</script>
<style scoped>
@import "../../styles/mobile/detail.css";

.renderDetail {
  height: auto;
}
</style>
