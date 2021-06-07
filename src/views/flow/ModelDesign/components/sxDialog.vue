<!--
 * @Date: 2021-01-02 11:49:33
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-10 10:15:12
 * @FilePath: /SX-DTBF-VIEW/src/views/flow/ModelDesign/components/sxDialog.vue
 * @Description: 
-->
<template>
  <transition name="el-fade-in">
    <div class="sx_dialog" v-show="dialogVisible">
      <div class="sx_dialog_toolBar">
        <span class="sx_dialog_title">{{ titleName }}</span>
        <div class="sx_dialog_toolBarBtn">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-check"
            @click="submitFlowInfo"
            >保 存</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-circle-close"
            @click="dialogVisible = false"
            >关 闭</el-button
          >
        </div>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-date"></i>
            <span style="margin-left: 5px">表单</span>
          </span>
          <div class="formContent">
            <formDetail ref="formDetail" />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-turn-off"></i>
            <span style="margin-left: 5px">变量配置</span>
          </span>
          <div class="formContent">
            <approval ref="approvalDetail" :proDefId="proDefId" />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-set-up"></i>
            <span style="margin-left: 5px">节点配置</span>
          </span>
          <div class="formContent">
            <nodeSet ref="nodeDetail" />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-chat-dot-round"></i>
            <span style="margin-left: 5px">其他配置</span>
          </span>
          <div class="formContent">
            <otherConfig ref="otherConfigDetail" />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-picture-outline"></i>
            <span style="margin-left: 5px">流程图</span>
          </span>
          <div class="formContent">
            <el-image
              :src="'data:image/jpeg;base64,' + imgSrc"
              :preview-src-list="['data:image/jpeg;base64,' + imgSrc]"
            >
            </el-image>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>

<script>
import formDetail from "./formDetail";
import approval from "./approval";
import nodeSet from "./nodeSet";
import otherConfig from "./otherConfig";
import {
  saveFlowSet,
  processConfigList,
  flowImageByDef,
  flowMesConfig,
} from "@/api/flow/flow";
export default {
  components: {
    nodeSet,
    approval,
    formDetail,
    otherConfig,
  },
  props: {
    visible: Boolean,
    proDefId: String,
  },
  data() {
    return {
      dialogVisible: this.visible,
      tabsValue: "form",
      titleName: "",
      conFigForm: {},
      imgSrc: "",
    };
  },
  created() {},
  watch: {
    dialogVisible: function (val) {
      this.$emit("update:visible", val);
    },
    visible: function (val) {
      this.dialogVisible = val;
    },
    proDefId: function () {
      // console.log(this.proDefId, 98888);
    },
  },

  methods: {
    tabClick({ name }) {
      switch (name) {
        case "form":
          break;
        case "variable":
          // this.$nextTick(() => {
          //   this.$refs.approvalDetail.queryList();
          // });
          break;
      }
    },
    getName(row) {
      this.titleName = row.name + "  " + "v" + row.version;
    },
    getList(proDefId) {
      processConfigList(proDefId).then((res) => {
        this.$refs.otherConfigDetail.conFigForm = res.data.data;
      });

      flowMesConfig(proDefId).then((res) => {
        this.$refs.otherConfigDetail.data = res.data.data;
      });
    },
    getImg(proDefId) {
      flowImageByDef(proDefId).then((res) => {
        this.imgSrc = res.data.data;
      });
    },
    // 提交配置

    async submitFlowInfo() {
      let formDetail = this.$refs.formDetail.tableData;
      let delFlowVariableIds = this.$refs.approvalDetail.delFlowVariableIds;
      let delFlowMesConfigIds = this.$refs.otherConfigDetail
        .delFlowMesConfigIds;
      let flowMesConfigList = this.$refs.otherConfigDetail.data;
      let nodeDetail = this.$refs.nodeDetail.nodeTreeList;
      let otherConfigDetail = this.$refs.otherConfigDetail.conFigForm;
      this.conFigForm.formFieldName = this.$refs.formDetail.formFieldName;
      this.conFigForm.formFieldText = this.$refs.formDetail.formFieldText;
      let delFlowNodeFieldIds = this.$refs.formDetail.delFlowNodeFieldIds;
      formDetail.forEach((item) => {
        if (item.flowNodeFieldControlList.length > 0) {
          item.flowNodeFieldControlList.forEach((ele) => {
            if (ele.isFill == true) {
              ele.isFill = 1;
            } else {
              ele.isFill = 0;
            }
            if (ele.isUpdate == true) {
              ele.isUpdate = 1;
            } else {
              ele.isUpdate = 0;
            }
            if (ele.noVisible == true) {
              ele.noVisible = 1;
            } else {
              ele.noVisible = 0;
            }
          });
        }
      });
      let approvalDetail = this.$refs.approvalDetail.data;
      if (nodeDetail.length > 0) {
        nodeDetail.forEach((item) => {
          if (item.nodeStartEventFlag == true) {
            item.nodeStartEventFlag = 1;
          } else {
            item.nodeStartEventFlag = 0;
          }
          if (item.nodeEndEventFlag == true) {
            item.nodeEndEventFlag = 1;
          } else {
            item.nodeEndEventFlag = 0;
          }
          if (item.findUserLimitRules == true) {
            item.findUserLimitRules = 1;
          } else {
            item.findUserLimitRules = 0;
          }
        });
      }

      let flowProcessDto = {
        flowProcessFormList: formDetail,
        delFlowNodeFieldIds: delFlowNodeFieldIds,
        delFlowVariableIds: delFlowVariableIds,
        flowNodeVariableList: approvalDetail,
        flowNodeDtoList: nodeDetail,
        flowProcessConfig: otherConfigDetail,
        proDefId: this.proDefId,
        delFlowMesConfigIds: delFlowMesConfigIds,
        flowMesConfigList: flowMesConfigList,
      };

      const { data } = await saveFlowSet(flowProcessDto);
      const { code, msg } = data;

      if (code === 200) {
        this.$message.success(msg);
        this.$parent.$children[3]._props.visible = false;
        this.dialogVisible = false;
        this.$refs.formDetail.formFieldData = [];
        this.$refs.formDetail.addFalse = true;
        // console.log(this.$parent.$children[3]._props.visible);
      } else {
        this.$message.error(msg);
      }
      if (nodeDetail.length > 0) {
        nodeDetail.forEach((item) => {
          if (item.nodeStartEventFlag == 1) {
            item.nodeStartEventFlag = true;
          } else {
            item.nodeStartEventFlag = false;
          }
          if (item.nodeEndEventFlag == 1) {
            item.nodeEndEventFlag = true;
          } else {
            item.nodeEndEventFlag = false;
          }
          if (item.findUserLimitRules == 1) {
            item.findUserLimitRules = true;
          } else {
            item.findUserLimitRules = false;
          }
        });
      }
      if (this.conFigForm.completeEventFlag == 1) {
        this.conFigForm.completeEventFlag = true;
      } else {
        this.conFigForm.completeEventFlag = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

.formContent {
  height: 90vh;
  padding: 15px;
  overflow-y: auto;
}
</style>

