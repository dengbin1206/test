<template>
  <div>
    <el-form-item label="默认文本">
      <el-input v-model="data.params.html" placeholder="输入默认文本"></el-input>
    </el-form-item>
    <el-form-item label="分隔线方向">
      <el-select v-model="data.direction" placeholder="选择分隔符类型">
        <el-option label="横向分割" value="horizontal"></el-option>
        <el-option label="纵向分割" value="vertical"></el-option>
        <!-- <el-option label="占位符" value=""></el-option> -->
      </el-select>
    </el-form-item>
    <el-form-item label="文本位置">
      <el-select v-model="data.params.contentPosition" placeholder="选择文本位置">
        <el-option label="左侧" value="left"></el-option>
        <el-option label="居中" value="center"></el-option>
        <el-option label="右侧" value="right"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="左边距">
      <el-input  v-model="data.labelWidth" placeholder="输入边距" value="0px">
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-divider",
  props: ["data"],
  data() {
    return {
        dividerType:"0",
        contentPosition:"left",
        
    };
  },
};
</script>