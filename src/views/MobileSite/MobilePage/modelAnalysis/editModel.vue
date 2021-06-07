<template>
  <div class="wrap">
    <div class="header">
      <van-nav-bar
        :title="$route.query.title"
        left-arrow
        :border="false"
        @click-left="$router.back(-1)"
      />
    </div>
    <div class="main">
      <renderForm :renderFormInfo="renderFormInfo" ref="renderForm" />
    </div>
    <div class="footer">
      <van-goods-action>
        <van-goods-action-button text="保存" type="info" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import renderForm from "./renderForm";
export default {
  components: {
    renderForm,
  },

  data() {
    return {
      renderFormInfo: {},
    };
  },

  created() {
    this.renderFormInfo = {
      dataId: this.$route.query.dataId,
      formType: this.$route.query.formType,
      formId: this.$route.query.formId,
    };

    this.$nextTick(() => {
      this.$refs.renderForm.queryFormFileds();
    });
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
}
.header,
.footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: unset;
  line-height: unset;
  z-index: 999;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  background-color: #fff;

  .btn {
    margin-right: 1px;
  }
}
.main {
  position: absolute;
  z-index: 1;
  top: 50px;
  left: 0;
  bottom: 50px;
  width: 100%;
  overflow: auto; /* winphone8和android4+ */
  -webkit-overflow-scrolling: touch; /* ios5+ */
  background-color: #f7f8fa;
}
</style>