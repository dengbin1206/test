<template>
  <div class="flowDetails">
    <van-nav-bar
      :title="flowInstanceVo | concatTitle"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <flowTitle :flowInstanceVo="flowInstanceVo" :status="status" />
    <!-- 表单渲染 -->
    <sxForm v-if="formParams.formType=='M' || formParams.formType=='F'" :params="formParams"></sxForm>
    <customPage
      v-if="renderFormInfo.formType == 'S' || renderFormInfo.mobileRouteName"
      :flowNode="flowKey"
      :nodeAlias="nodeAlias"
      :functionId="renderFormInfo.functionId"
      :proDefId ="renderFormInfo.proDefId"
      :dataId="renderFormInfo.dataId"
      :editFlag="editFlag"
      :diaType="diaType"
    />
    <flowTimeLine :flowActivityVOList="flowActivityVOList" />
    <flowComment
      :flowInstanceCopyList="flowInstanceCopyList"
      v-if="flowInstanceCopyList.length > 0"
    />
    <div class="listCard" v-if="flowRoute === 'myTodoList'">
      <van-notice-bar text="请输入审批意见" />
      <textarea rows="5" class="textarea" v-model="comment"></textarea>
    </div>
    <div class="listCard" v-if="flowRoute === 'myTodoList'">
      <van-notice-bar text="上传文件或图片" />
      <uploader
        class="uploader"
        :getAllFile="getAllFile"
        dataSrcId="FLOWACTIVITY"
        affixType="FLOWACTIVITY#FILE"
      />
    </div>
    <div
      class="listCard"
      v-if="flowRoute === 'myTodoList' && nextNodeDTOList.length > 0"
    >
      <van-notice-bar text="请选择下一环节审批人" />
      <div v-for="(item, index) of nextNodeDTOList" :key="index">
        <van-cell
          :title="item.nodeName"
          is-link
          center
          :required="item.isRequired"
          @click="selectUser(item)"
        >
          <template #label>
            <van-tag
              plain
              type="primary"
              v-for="user in item.userList"
              :key="user.id"
              class="tag"
              >{{ user.realName }}</van-tag
            >
          </template>
        </van-cell>
      </div>
    </div>
    <div class="listCard" v-if="flowRoute === 'instCopyReplyList'">
      <van-notice-bar text="请回复意见" />
      <textarea rows="5" class="textarea" v-model="comment"></textarea>
    </div>
    <div class="placeholder"></div>
    <actionBar
      :signForFlag="signForFlag"
      :backFlag="backFlag"
      :status="flowInstanceVo.status"
      :myFlowFlag="myFlowFlag"
      @onClickButton="onClickButton"
    />
    <!-- 用户选择 -->
    <van-popup
      v-model="showSelectUserList"
      get-container="body"
      class="popup"
      position="bottom"
    >
      <userSelect @onConfirm="onConfirm" />
    </van-popup>

    <!-- 回退，抄送，转办 -->
    <van-popup
      v-model="visible"
      get-container="body"
      class="popup"
      position="bottom"
    >
      <copyReplyTransfer
        :titleBar="titleBar"
        :subTitle="subTitle"
        @onHandlesubmit="onHandlesubmit"
        :columns="columns"
        ref="copyReply"
      />
    </van-popup>

    <!-- 授权查看 -->
    <van-popup
      v-model="rightsVisible"
      get-container="body"
      class="popup"
      position="bottom"
    >
      <hasPersionToView @onSubmit="hasPermissionToView" />
    </van-popup>
  </div>
</template>

<script>
import { filters } from "./index.js";
import { mapState, mapMutations } from "vuex";
import {
  historyInfo,
  completeTask,
  siginTask,
  stopTask,
  getBackNode,
  backToTask,
  copyTask,
  delegateTask,
  impowerProcess,
  retrieve,
  updateInstCopys,
  adminTask,
} from "@/api/mobileApi/flow";
import flowTitle from "./component/flowTitle";
import flowTimeLine from "./component/flowTimeLine";
import flowComment from "./component/flowComment";
import actionBar from "./component/actionBar";
import uploader from "../../MobileComponent/Uploader";
import userSelect from "./component/userSelect";
import copyReplyTransfer from "./component/copyReplyTransfer";
import hasPersionToView from "./component/hasPersionToView";
import renderForm from "./component/renderForm";
import customPage from "@/views/work/biz/customPage";
import formTranslate from "@/views/formTranslate/index"
import sxForm from "../modelAnalysis/sxForm";
import { Dialog, Notify, Toast } from "vant";
import history from "../../../../forms/mixins/history.js";
import * as dd from "dingtalk-jsapi";

export default {
  data() {
    return {
      status: null,
      flowInstanceVo: {},
      nextNodeDTOList: [],
      flowInstanceCopyList: [],
      flowActivityVOList: [],
      signForFlag: "",
      myFlowFlag: "",
      backFlag: "",
      comment: "",
      showSelectUserList: false,
      userRow: {},
      getAllFile: [],
      visible: false,
      rightsVisible: false,
      titleBar: "",
      subTitle: [],
      columns: [],
      renderFormInfo: {
        formType: "M",
      },
      editFlag: false,
      flowKey: "",
      nodeAlias: "",
      formParams:{},
    };
  },
  components: {
    flowTitle,
    flowTimeLine,
    flowComment,
    uploader,
    actionBar,
    userSelect,
    copyReplyTransfer,
    hasPersionToView,
    renderForm,
    customPage,
    formTranslate,
    sxForm,
  },
  filters: filters,
  computed: {
    ...mapState("Flow", ["proInstId", "taskId", "flowRoute", "copyReplyId","diaType"]),
    ...mapState("Todo", ["selectedList"]),
  },
  created() {
    if (dd.env.platform != 'notInDingTalk') {
      dd.ready(function() {
        document.addEventListener('backbutton', function(e) {
          dd.biz.navigation.close();
        });
      });
    }
    this.fetchDetail();
  },
  methods: {
    ...mapMutations("Todo", ["SET_SELECTEDLIST"]),
    async fetchDetail() {
      historyInfo({
        proInstId: this.proInstId,
        taskId: this.taskId,
      })
        .then((res) => {
          let {
            flowInstanceVo,
            flowInstanceCopyList,
            flowActivityVOList,
            signForFlag,
            flowNodeVo,
            myFlowFlag,
            nextNodeDTOList,
            taskId,
            flowProcessForm,
            editFlag,
          } = res.data.data;
          this.flowKey = flowInstanceVo.flowKey;
          this.nodeAlias = flowNodeVo && flowNodeVo.nodeAlias;
          this.editFlag = editFlag;
          this.flowInstanceVo = flowInstanceVo;
          this.flowInstanceCopyList = flowInstanceCopyList;
          this.flowActivityVOList = flowActivityVOList;
          this.nextNodeDTOList = nextNodeDTOList;
          this.signForFlag = signForFlag;
          let { backFlag } = flowNodeVo;
          this.backFlag = backFlag;
          this.myFlowFlag = myFlowFlag;
          // 表单渲染的参数
          this.renderFormInfo = {
            dataId: flowInstanceVo.dataId,
            formType: flowProcessForm.formType,
            formId: flowProcessForm.formId,
            proDefId: flowInstanceVo.proDefId,
            nodeCode: flowNodeVo.nodeCode,
            editFlag: editFlag,
            functionId: flowInstanceVo.functionId,
          };
          if(flowProcessForm.formType == "M"){
            this.formParams = {
              actionType: editFlag ? 'edit' : 'view',
              formType: flowProcessForm.formType,
              mainModelId: flowProcessForm.formId,
              dataId: flowInstanceVo.dataId,
              functionId: flowInstanceVo.functionId,
              proDefId: flowInstanceVo.proDefId,
              nodeCode: flowNodeVo.nodeCode,
            }
          } else if(flowProcessForm.formType == "F"){
            this.formParams = {
              actionType: editFlag ? 'edit' : 'view',
              formType: flowProcessForm.formType,
              formId: flowProcessForm.formId,
              dataId: flowInstanceVo.dataId,
              functionId: flowInstanceVo.functionId,
              proDefId: flowInstanceVo.proDefId,
              nodeCode: flowNodeVo.nodeCode,
            }
          }

          // 抄送回复回复意见回显
          if (
            this.flowRoute === "instCopyReplyList" &&
            this.copyReplyId !== ""
          ) {
            for (let index = 0; index < flowInstanceCopyList.length; index++) {
              const element = flowInstanceCopyList[index];
              if (element.id === this.copyReplyId) {
                this.comment = element.reply;
              }
            }
          }

          if (
            flowInstanceVo.status == 3 &&
            flowInstanceVo.userId == flowInstanceVo.updateUser
          ) {
            this.status = 3;
          } else if (
            flowInstanceVo.status == 3 &&
            flowInstanceVo.userId !== flowInstanceVo.updateUser
          ) {
            this.status = 2;
          } else {
            this.status = flowInstanceVo.status - 1;
          }
        })
        .catch((error) => {
          this.$router.push(`/mobile/${this.flowRoute}`);
        });
    },

    onClickLeft() {
      if(this.flowRoute && this.flowRoute.includes("modelList")){
        this.$router.back(-1);
      }else{
        this.$router.push(`/mobile/${this.flowRoute}`);
      }
    },

    selectUser(row) {
      this.showSelectUserList = true;
      this.SET_SELECTEDLIST(row.userList);
      this.userRow = row;
    },

    onConfirm(users) {
      this.$set(this.userRow, "userList", users);
    },

    // 按钮事件触发
    onClickButton(type) {
      switch (type) {
        case "confirm":
          this.agreeFlow();
          break;
        case "reject":
          this.rejectFlow();
          break;
        case "singin":
          this.singinFlow();
          break;
        case "back":
          this.titleBar = "回退";
          this.subTitle = ["回退环节", "回退意见"];
          this.resetCopyTranser();
          this.fetchDict();
          break;
        case "copy":
          this.titleBar = "抄送";
          this.subTitle = ["抄送人", "留言"];
          this.visible = true;
          this.resetCopyTranser();
          break;
        case "transfer":
          this.titleBar = "转办";
          this.subTitle = ["转办人", "转办意见"];
          this.visible = true;
          this.resetCopyTranser();
          break;
        case "rights":
          this.rightsVisible = true;
          break;
        case "widthdrew":
          this.widthDrewFlow();
          break;
        case "copyReplySave":
          this.copyReplySave();
          break;
        case "trash":
          this.trashFlow();
          break;
        default:
          break;
      }
    },

    // 回退判断
    async fetchDict() {
      const { data } = await getBackNode({
        taskId: this.taskId,
      });
      if (data.code === 200) {
        if (data.data.length > 0) {
          this.columns = data.data.map((item) => {
            return {
              text: item.nodeName,
              valueName: item.nodeId,
            };
          });
          this.visible = true;
        } else {
          Toast("没有可回退环节");
        }
      }
    },

    // reset 输入选择
    resetCopyTranser() {
      this.SET_SELECTEDLIST([]);
      if (this.$refs.copyReply) {
        this.$nextTick(() => {
          this.$refs.copyReply.selectedList = [];
          this.$refs.copyReply.comment = "";
          this.$refs.copyReply.label = "";
          this.$refs.copyReply.targetActivityId = "";
        });
      }
    },

    // 同意流程
    async agreeFlow() {
      let nextNoodeList = [];
      let errorFlag = false;
      this.nextNodeDTOList.forEach((e) => {
        if (e.isRequired && typeof e.userList === "undefined") {
          errorFlag = true;
          return Notify(`${e.nodeName}必须选择人员`);
        }
        nextNoodeList.push({
          isRequired: e.isRequired,
          nodeCode: e.nodeCode,
          nodeName: e.nodeName,
          userIds:
            e.userList &&
            e.userList.map((item) => {
              return item.id;
            }),
        });
      });

      if (!errorFlag) {
        const { data } = await completeTask({
          taskId: this.taskId,
          actFiles:
            this.getAllFile &&
            this.getAllFile.map((file) => {
              return {
                fileId: file.fileId,
                fileName: file.fileName,
                isDeleted: file.isDeleted,
                suffix: file.suffix,
              };
            }),
          nextNodeDTOList: nextNoodeList,
          comment: this.comment,
        });
        let { code, msg } = data && data;
        if (code === 200) {
          Toast(msg);
          this.$router.push(`/mobile/${this.flowRoute}`);
        } else {
          Notify(msg);
        }
      }
    },

    // 拒绝流程
    rejectFlow() {
      Dialog.confirm({
        message: "确定拒绝该流程？",
      })
        .then(() => {
          stopTask({
            taskId: this.taskId,
            comment: this.comment,
          }).then((res) => {
            if (res.data.code === 200) {
              Toast(res.data.msg);
              this.$router.push(`/mobile/${this.flowRoute}`);
            } else {
              Notify(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 签收流程
    singinFlow() {
      Dialog.confirm({
        message: "确定签收该流程？",
      })
        .then((_) => {
          siginTask({
            taskId: this.taskId,
          }).then((res) => {
            if (res.data.code === 200) {
              Toast(res.data.msg);
              this.fetchDetail();
            } else {
              Notify(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 提交回退，转办，抄送
    onHandlesubmit({ comment, targetActivityId, selectedList }) {
      switch (this.titleBar) {
        case "回退":
          this.onBackToTask(comment, targetActivityId);
          break;
        case "抄送":
          this.onCopyTask(comment, selectedList);
          break;
        case "转办":
          this.onDelegateTask(comment, selectedList);
          break;
        default:
          break;
      }
    },

    // back-to-task
    async onBackToTask(comment, targetActivityId) {
      const { data } = await backToTask({
        comment: comment,
        targetActivityId: targetActivityId,
        taskId: this.taskId,
      });

      if (data.code === 200) {
        Toast(data.msg);
        this.visible = false;
        this.$router.push("/mobile/myTodoList");
      } else {
        Notify(data.msg);
      }
    },

    // copyTask
    async onCopyTask(comment, selectedList) {
      const { data } = await copyTask({
        actFiles: this.getAllFile,
        flowInstanceCopy: {
          proInstId: this.proInstId,
          taskId: this.taskId,
          memo: comment,
        },
        userIds: selectedList.map((e) => e.id),
      });
      if (data.code === 200) {
        Toast(data.msg);
        this.visible = false;
        this.$router.push("/mobile/myTodoList");
      } else {
        Notify(data.msg);
      }
    },

    //delegateTask
    async onDelegateTask(comment, selectedList) {
      const { data } = await delegateTask({
        comment: comment,
        taskId: this.taskId,
        userIds: selectedList.map((e) => e.id),
      });

      if (data.code === 200) {
        Toast(data.msg);
        this.visible = false;
        this.$router.push("/mobile/myTodoList");
      } else {
        Notify(data.msg);
      }
    },

    // 授权查看
    async hasPermissionToView(userIds) {
      if (userIds.length > 0) {
        const { data } = await impowerProcess(this.proInstId, userIds);
        if (data.code === 200) {
          Toast(data.msg);
          this.visible = false;
          this.$router.push("/mobile/myInstanceList");
        } else {
          Notify(data.msg);
        }
      } else {
        Toast("授权用户必选");
      }
    },

    // 取回
    widthDrewFlow() {
      Dialog.confirm({
        message: "确认取回么？",
      })
        .then(() => {
          retrieve({
            proInstId: this.proInstId,
          }).then((res) => {
            if (res.data.code === 200) {
              Toast(res.data.msg);
              this.$router.push("/mobile/myInstanceList");
            } else {
              Notify(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 作废
    trashFlow() {
      Dialog.confirm({
        message: "确认作废么？",
      })
        .then(() => {
          adminTask({
            proInstId: this.proInstId,
          }).then((res) => {
            if (res.data.code === 200) {
              Toast(res.data.msg);
              this.$router.push("/mobile/myInstanceList");
            } else {
              Notify(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 抄送保存回复

    async copyReplySave() {
      const { data } = await updateInstCopys(this.copyReplyId, this.comment);
      if (data.code === 200) {
        Toast(data.msg);
        this.$router.push("/mobile/instCopyReplyList");
      } else {
        Notify(data.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

.textarea {
  width: 97.5%;
  border: none;
  resize: none;
  border: 1px dashed #ccc;
  color: #969799;
  font-size: 12px;
  margin-top: 15px;
}

.uploader {
  margin-top: 15px;
}

.placeholder {
  height: 120px;
}

.popup {
  width: 100%;
  height: 100%;
}
</style>
