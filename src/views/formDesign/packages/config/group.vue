<template>
  <div>
    <el-form-item label="图标">
      <icon :data="data"></icon>
    </el-form-item>
    <el-form-item label="开启折叠">
      <el-switch v-model="data.arrow"></el-switch>
    </el-form-item>
    <el-form-item label="默认展开" v-if="data.arrow">
      <el-switch v-model="data.collapse"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
import icon from "../../component/iconPicker";
export default {
  name: "config-group",
  props: ["data"],
  components:{
    icon
  },
  data() {
    return {
      iconList: [
        {
          label: "element-ui",
          list: [
            "el-icon-info",
            "el-icon-error",
            "el-icon-success",
            "el-icon-warning",
            "el-icon-question",
          ],
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
</style>
