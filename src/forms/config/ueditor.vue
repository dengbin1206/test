<template>
  <div>
   
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder" placeholder="占位内容"></el-input>
    </el-form-item>
    
    <el-form-item label="填值规则" v-if="data.type!='password'">
      <!-- <el-input  placeholder="变量/表达式"></el-input> -->
      <el-radio-group v-model="rules01" style="margin-bottom:15px;">
        <el-radio-button label="静态"></el-radio-button>
        <el-radio-button label="规则"></el-radio-button>
        <el-radio-button label="远程"></el-radio-button>
      </el-radio-group>
      <el-form-item
        v-if="rules01 == '静态'">
      <el-input
        @change="changeValue('静态')"
        v-model="data.value"
        placeholder="默认值"
      ></el-input>
    </el-form-item>
    <el-form-item
        v-if="rules01 == '规则'">
      <el-select
        v-model="data.myrule"
        @change="changeValue('规则')"
        placeholder="选择规则"
        clearable
      >
        <el-option
          v-for="(item, index) in ruleList"
          :label="item.dictValue"
          :key="index"
          :value="item.dictKey"
        >
        </el-option>
      </el-select>
      <el-input
        @change="changeValue('规则')"
        placeholder="自定义规则"
        type="textarea"
        v-model="data.myrule2"
        rows="5"
        style="margin-top: 10px"
      >
      </el-input>
    </el-form-item>
    <el-form-item v-if="rules01 == '远程'">
        <el-input
          v-model="data.ruleUrl"
          placeholder="请求地址"
        ></el-input>
        <el-select
          @change="changeValue('远程')"
          placeholder="选择请求方法"
          v-model="data.method"
          clearable
          style="margin-top: 10px"
        >
          <el-option
            v-for="(item, index) in ['GET', 'POST']"
            :label="item"
            :value="item"
            :key="index"
          ></el-option>
        </el-select>
        <!-- <span v-if="data.method == 'POST'">
          请求参数
         <avue-dynamic v-model="data.dicQueryConfig"
                      :children="option"></avue-dynamic>
        </span> -->
    </el-form-item>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-ueditor",
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
    },
    'data.options.oss': function (val) {
      if (val == 'ali') this.data.options.qiniu = {}
      else if (val == 'qiniu') this.data.options.ali = {}
    }
  }
}
</script>
