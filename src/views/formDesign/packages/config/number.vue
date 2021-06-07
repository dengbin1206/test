<template>
  <div>
    <el-form-item label="最小值">
      <el-input-number
        v-model="data.minRows"
        controls-position="right"
        placeholder="最小值"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number
        v-model="data.maxRows"
        controls-position="right"
        placeholder="最大值"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="步长">
      <el-input-number
        v-model="data.step"
        controls-position="right"
        placeholder="步长"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="数值精度">
      <el-input-number
        v-model="data.precision"
        controls-position="right"
        placeholder="数值精度"
        :min="0"
        :max="10"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="开启控制器">
      <div class="el-input">
        <el-switch v-model="data.controls"></el-switch>
      </div>
    </el-form-item>
    <el-form-item label="控制器位置" v-if="data.controls">
      <div class="el-input">
        <el-radio v-model="data.controlsPosition" label="">默认 </el-radio>
        <el-radio v-model="data.controlsPosition" label="right">右 </el-radio>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-number",
  props: ["data"],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
    };
  },
  methods: {
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) rules.push(this.validator[key]);
      });
      this.data.rules = rules;
    },
  },
  watch: {
    "data.required": function (val) {
      if (val)
        this.validator.required = {
          required: true,
          message: `${this.data.label}必须填写`,
        };
      else this.validator.required = null;

      this.generateRule();
    },
    "data.pattern": function (val) {
      if (val)
        this.validator.pattern = {
          pattern: new RegExp(val),
          message: `${this.data.label}格式不匹配`,
        };
      else this.validator.pattern = null;

      // delete this.data.pattern
      this.generateRule();
    },
  },
};
</script>
