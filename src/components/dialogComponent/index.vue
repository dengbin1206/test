<template>
  <el-dialog
    :visible.sync="dialogVisible"
    append-to-body
    modal-append-to-body
    :width="width"
    :fullscreen="fullscren"
    :close-on-click-modal="false"
    class="avue-dialog"
    ref="dialog"
    v-dialog
    top="8vh"
  >
    <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">{{ title }}</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
    <div style="height: 75vh; overflow-y: auto">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: "标题",
    },
    width: {
      type: String,
      default: "75%",
    },
    dragDom: null,
  },
  data() {
    return {
      dialogVisible: this.visible,
      fullscren: false,
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

  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },

    handleClose() {
      this.$emit("handleClose");
    },
  },
};
</script>


<style lang="scss" scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;

  .icon {
    margin-right: 10px;
  }
}
</style>
