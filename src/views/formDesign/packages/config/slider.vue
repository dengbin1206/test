<template>
  <div>
    <el-form-item label="默认值">
      <el-input v-model="data.value" clearable placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item label="最小值">
      <el-input-number
        v-model="data.min"
        controls-position="right"
        placeholder="最小值"
        :max="data.max - 1"
        :min="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number
        v-model="data.max"
        controls-position="right"
        placeholder="最大值"
        :min="data.min + 1"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="步长">
      <el-input-number
        v-model="data.step"
        controls-position="right"
        placeholder="步长"
        :min="1"
        :max="data.max - data.min"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="显示间隔点">
      <div class="el-input">
        <el-switch v-model="data.showStops"></el-switch>
      </div>
    </el-form-item>
    <el-form-item label="显示输入框">
      <div class="el-input">
        <el-switch v-model="data.showInput"></el-switch>
      </div>
    </el-form-item>
    <el-form-item label="范围">
      <div class="el-input">
        <el-switch v-model="data.range"></el-switch>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-slider",
  props: ["data"],
};
</script>
