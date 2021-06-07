<template>
  <div>
    <el-form-item label="尺寸">
      <el-radio-group v-model="data.size" size="mini">
        <el-radio-button label="medium">正常</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="mini">超小</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: "config-array",
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
          message: `请输入${this.data.label}`,
        };
      else this.validator.required = null;

      this.generateRule();
    },
  },
};
</script>