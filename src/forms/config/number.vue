<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder"
                placeholder="占位内容"></el-input>
    </el-form-item>
    <!-- <el-form-item label="默认值">
      <el-input v-model="data.value"
                placeholder="默认值"></el-input>
    </el-form-item>

    <el-form-item label="填值规则" >
        <el-radio-group v-model="inputRules">
          <el-radio-button label="默认值"></el-radio-button>
          <el-radio-button label="规则"></el-radio-button>
          <el-radio-button label="远程"></el-radio-button>
        </el-radio-group>
    </el-form-item>
    <el-form-item>
        <el-input v-if="inputRules=='默认值'" v-model="data.value" placeholder="输入默认值" ></el-input>

        <el-select v-if="inputRules=='规则'"  v-model="data.change" placeholder="选择已有规则" clearable>
            <el-option  v-for="(item,index) in ruleList" :label="item.name" :key="index" :value="item.value"></el-option>
        </el-select>
        <el-input v-if="inputRules=='规则'" placeholder="输入自定义规则" type="textarea" rows="5" style="margin-top:10px" ></el-input>

        <el-select v-if="inputRules=='远程'"  placeholder="选择请求方法" clearable>
            <el-option>GET</el-option>
            <el-option>POST</el-option>
        </el-select>
        <el-input v-if="inputRules=='远程'" placeholder="变量/表达式" style="margin-top:10px"></el-input>
    </el-form-item>
 -->
    <el-form-item label="最小值">
      <el-input-number v-model="data.minRows"
                       controls-position="right"
                       placeholder="最小值"></el-input-number>
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number v-model="data.maxRows"
                       controls-position="right"
                       placeholder="最大值"></el-input-number>
    </el-form-item>
    <el-form-item label="步长">
      <el-input-number v-model="data.step"
                       controls-position="right"
                       placeholder="步长"></el-input-number>
    </el-form-item>
    <el-form-item label="数值精度">
      <el-input-number v-model="data.precision"
                       controls-position="right"
                       placeholder="数值精度"
                       :min="0"
                       :max="10"></el-input-number>
    </el-form-item>
    <el-form-item label="开启控制器">
      <el-switch v-model="data.controls"></el-switch>
    </el-form-item>
    <el-form-item label="控制器位置"
                  v-if="data.controls">
      <el-radio v-model="data.controlsPosition"
                label="">默认
      </el-radio>
      <el-radio v-model="data.controlsPosition"
                label="right">右
      </el-radio>
    </el-form-item>
    <!-- <el-form-item label="是否只读">
      <el-switch v-model="data.readonly"></el-switch>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"></el-switch>
    </el-form-item>-->
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item> 
    <el-form-item label="校验规则">
      <el-select v-model="data.change" placeholder="选择已有规则" clearable>
          <el-option  v-for="(item,index) in ruleList" :label="item.name" :key="index" :value="item.value"></el-option>
      </el-select>
      <el-input v-model.lazy="data.pattern" placeholder="正则表达式" style="margin-top:10px" ></el-input>
    </el-form-item>
    <el-form-item label="校验提示内容">
      <el-input v-model.lazy="data.warning" placeholder="提示内容"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-number",
  props: ['data'],
  data () {
    return {
      inputRules:"默认值",
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
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
    },
    'data.pattern': function (val) {
      if (val) this.validator.pattern = { pattern: new RegExp(val), message: `${this.data.label}格式不匹配` }
      else this.validator.pattern = null

      // delete this.data.pattern
      this.generateRule()
    }
  }
}
</script>
