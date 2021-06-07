<!--
 * @Date: 2021-01-02 16:11:25
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-02 21:54:35
 * @FilePath: /SX-DTBF-VIEW/src/views/flow/ModelDesign/components/sxDesign.vue
 * @Description: 弹窗组件封装
-->

<template>
  <transition name="el-fade-in">
    <div class="sx_dialog" v-show="dialogVisible">
      <div class="sx_dialog_toolBar">
        <span class="sx_dialog_title">流程设计</span>
        <div class="sx_dialog_toolBarBtn">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-close"
            @click="dialogVisible = false"
            >关 闭</el-button
          >
        </div>
      </div>
      <div class="sketch">
        <iframe
          :src="flowUrl"
          width="100%"
          height="950px"
          border
          allowTransparency="yes"
        >
        </iframe>
      </div>
    </div>
  </transition>
</template>

<script>
import website from '@/config/website';

export default {
  props: {
    flowVisible: Boolean,
    flowUrl:{
        type: String
    }
  },
  data() {
    return {
      dialogVisible: this.flowVisible,
    };
  },
  watch: {
    dialogVisible: function (val) {
      this.$emit("update:flowVisible", val);
    },
    flowVisible: function (val) {
      this.dialogVisible = val;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>