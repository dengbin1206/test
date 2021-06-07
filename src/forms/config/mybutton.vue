<template>
  <div>
    <el-form-item label="按钮颜色">
      <el-select v-model="data.params.type" placeholder="选择按钮颜色">
          <el-option label="蓝色" value="primary"></el-option>
          <el-option label="红色" value="danger"></el-option>
          <el-option label="绿色" value="success"></el-option>
          <el-option label="橙色" value="warning"></el-option>
          <el-option label="灰色" value="info"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="跳转至">
      <el-select v-model="data.butTo">
        <el-option label="表单" value="form"></el-option>
        <el-option label="工作流" value="dd"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="表单" v-if="data.butTo=='form'">
      <el-select v-model="data.butTo">
        <el-option label="表单1" value="form"></el-option>
        <el-option label="表单2" value="dd"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工作流" v-if="data.butTo=='dd'">
      <el-select v-model="data.butTo">
        <el-option label="工作流1" value="form"></el-option>
        <el-option label="工作流2" value="dd"></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="图标">
      <avue-input-icon
        v-model="data.icon"
        :icon-list="iconList"
        placeholder="图标"
      ></avue-input-icon>
    </el-form-item> -->
  </div>
</template>
<script>
export default {
  name: "config-mybutton",
  props: ["data"],
  data() {
    return {
      type:'primary',
      butTo:'form',
    };
  },
};
</script>
<style lang="scss" scoped>
</style>
