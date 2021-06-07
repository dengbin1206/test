<!--
 * @Date: 2021-01-09 20:08:01
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-10 15:00:00
 * @FilePath: /SX-DTBF-VIEW/src/components/fullScreenDialog/index.vue
 * @Description: 
-->
<template>
  <transition name="el-fade-in">
    <div class="sx_dialog" v-show="dialogVisible">
      <div class="sx_dialog_toolBar">
        <span class="sx_dialog_title">{{ dialogTitle }}</span>
        <div class="sx_dialog_toolBarBtn">
          <slot name="toolBar"></slot>
        </div>
      </div>
      <div class="sx_dialog_content">
          <slot></slot>
      </div>
      <div class="sx_dialog_footer">
        <slot name="footerBar"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    dialogTitle: {
      type: String,
      default: "标题",
    },
    
  },
  data() {
    return {
      dialogVisible: this.visible,
    };
  },
  watch: {
    dialogVisible: function (val) {
      this.$emit("update:visible", val);
    },
    visible: function (val) {
      this.dialogVisible = val;
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>