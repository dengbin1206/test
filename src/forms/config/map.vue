<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder" placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="data.value" placeholder="请输入[精度,纬度,'地址名称']"></el-input>
      <el-checkbox   v-model="data.defaultLocation">当前坐标</el-checkbox>
      <!-- <a href="https://avuejs.com/doc/plugins/map-plugins"
         target="_blank"
         style="color: #409EFF;">详细文档</a> -->
    </el-form-item>
    <!-- <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"></el-switch>
    </el-form-item> -->
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-map",
  props: ['data'],
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null
      }
    }
  },
  methods: {
    generateRule () {
      const rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) rules.push(this.validator[key])
      })
      this.data.rules = rules
    },
  },
  watch: {
    'data.required': function (val) {
      if (val) this.validator.required = { required: true, message: `${this.data.label}必须填写` }
      else this.validator.required = null

      this.generateRule()
    }
  }
}
</script>
