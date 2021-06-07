<template>
  <div class="widget-form-container">

  </div>
</template>
<script>
import { getBizDictList,getDictList, getChildList,getBizChildList,getCity } from "@/api/tool/form";
import formView from "@/components/formView/formView";
import eventBus from '@/forms/utils/eventBus'
import { formById,formSave,formSearchNoPage } from "@/api/tool/analysis";
export default {
  name: "formView",
  props: ["data","option","srcFormId"],
  components: {
    formView
  },
  data() {
    return {
      form: {},
      options: {},
    };
  },
  watch: {
    data: function (vl) {
      this.data = vl;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    console.log("formView-mounted:"+JSON.stringify(this.options));
  },
  beforeDestroy() {

  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
// @import "../../styles/form.scss";
.container {
  width: 100%;
  height: 100%;
}
.form-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sx_form_header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ccc;
  .headerLeft {
    float: left;
    line-height: 50px;
    padding: 0 30px;
  }
  .headerRight {
    float: right;
    line-height: 50px;
    padding: 0 30px;
  }
}
.form-designer .widget-config-container .el-tabs__header {
  width: 100%;
}
</style>
