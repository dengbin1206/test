<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder"
                placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="data.value"
                placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item label="最大数量">
      <el-input-number v-model="data.length"
                placeholder="最大数量"></el-input-number>
    </el-form-item>
    <el-form-item label="数据类型" >
      <el-select v-model="data.dataType" :min="1"  placeholder="数据类型" clearable>
        <el-option label="String" value="string"></el-option>
        <el-option label="Number" value="number"></el-option>
      </el-select>
    </el-form-item>
    
    <!-- <el-form-item label="尺寸">
      <el-radio-group v-model="data.size"
                      size="mini">
        <el-radio-button label="medium">正常</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="mini">超小</el-radio-button>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'config-array',
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
      if (val) this.validator.required = { required: true, message: `请输入${this.data.label}` }
      else this.validator.required = null

      this.generateRule()
    }
  }
}
</script>