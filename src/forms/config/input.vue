<template>
  <div>
    <!-- <el-form-item label="默认值">
      <el-input v-model="data.value"
                placeholder="默认值"></el-input>
    </el-form-item> -->
    <el-form-item label="标题">
      <el-input v-model="data.label" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="隐藏标题">           
      <el-switch v-model="data.hideLable" :active-value="0" :inactive-value="1" @change="changeHideLable(data.hideLable)"></el-switch>
    </el-form-item>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder" placeholder="占位内容"></el-input>
    </el-form-item>
    <!-- <el-form-item label="前缀">
      <el-input v-model="data.prepend"
                placeholder="前缀"></el-input>
    </el-form-item>
    <el-form-item label="后缀">
      <el-input v-model="data.append"
                placeholder="后缀"></el-input>
    </el-form-item> -->
      <el-form-item label="默认值"  v-if="data.type=='password'">
      <el-input  v-model="data.value"
        placeholder="默认值"
      ></el-input>
    </el-form-item>
    <el-form-item label="填值规则" v-if="data.type!='password'">
      <!-- <el-input  placeholder="变量/表达式"></el-input> -->
      <el-radio-group v-model="data.assignType" style="margin-bottom:15px;">
        <el-radio-button label="ass_static">静态</el-radio-button>
        <el-radio-button label="ass_rule">规则</el-radio-button>
        <!--<el-radio-button label="ass_remote">远程</el-radio-button>-->
      </el-radio-group>
      <keep-alive>
        <el-form-item
          v-if="data.assignType == 'ass_static'">
          <el-input
            v-model="data.value"
            placeholder="默认值"
          ></el-input>
        </el-form-item>
      </keep-alive>
      <keep-alive>
        <el-form-item
          v-if="data.assignType == 'ass_rule'">
          <el-input
            v-model="data.assRuleCode"
            type="textarea"
            placeholder="输入规则"
            rows="5"
          ></el-input>
        <!--
      <el-select
        v-model="data.assRuleCode"
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
      </el-select>-->
      <!--
      <el-input
        @change="changeValue('ass_rule')"
        placeholder="自定义规则"
        type="textarea"
        v-model="data.assRuleCode"
        rows="5"
        style="margin-top: 10px"
      >
      </el-input>-->
    </el-form-item>
    </keep-alive>
    <keep-alive>
    <el-form-item v-if="data.assignType == 'ass_remote'">
        <el-input
          v-model="data.ruleUrl"
          placeholder="请求地址"
        ></el-input>
        <el-select
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
    </keep-alive>
    </el-form-item>
    
 
    <!-- <el-form-item label="最大长度">
      <el-input-number v-model="data.maxlength"
                       controls-position="right"
                       placeholder="最大长度"></el-input-number>
    </el-form-item> -->
    <!-- <el-form-item label="显示计数"
                  v-if="data.type != 'password'">
      <el-switch v-model="data.showWordLimit"></el-switch>
    </el-form-item> -->
 
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
    <el-form-item label="校验规则">
      <el-input v-model.lazy="data.pattern" placeholder="正则表达式"></el-input>
    </el-form-item>
    <el-form-item label="提示内容">
      <el-input
        v-model.lazy="data.warning"
        placeholder="提示内容"
      ></el-input>
    </el-form-item>
  </div>
</template>
 
<script>
import { getInputRule } from "@/api/tool/form";
 
export default {
  name: "config-input",
  props: ["data"],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
      // getList: ['GET','POST'],
      ruleList: [],
      value: '',
      assignType: '',//this.data.assignType|'ass_static'',ass_static[静态赋值]、ass_rule[规则赋值] ass_remote[远程赋值]
      assRuleCode: ''//this.data.assRuleCode|""//规则编码，赋值为为规则时可用
    };
  },
  mounted: function() {
    console.log('input-mounted-data:' +JSON.stringify(this.data)+'=>')
    console.log('input-mounted:' +JSON.stringify(this.item)+'=>')
  },
  created() {  
    this.data = {
      ...this.item,
      method: "",
      ruleType: "",
      ruleUrl: "",
      //assignType: this.item.assignType|'ass_static',//ass_static[静态赋值]、ass_rule[规则赋值] ass_remote[远程赋值]
      //assRuleCode: this.item.assRuleCode|""//规则编码，赋值为为规则时可用
    };
    /*
    if(this.item.hasOwnProperty('disabled')){
      this.data.disabled = (this.item.disabled==1)
    }
    if(this.item.hasOwnProperty('readonly')){
      this.data.readonly = (this.item.readonly==1)
    }
    if(this.item.hasOwnProperty('hideLabel')) {
      this.data.hideLable = (this.item.hideLable==1)
      if(this.item.hideLable){
        this.data.labelWidth = '0px';
        this.data.label = '';
      }
    }
    if(this.item.hasOwnProperty('value')){
      this.data.value = this.item.value
    }else{
       this.data.value=''
    }
    if(!this.data.assignType){
      this.data.assignType='ass_static'
    }
    if(!this.data.assRuleCode){
      this.data.assRuleCode=''
    }*/
    getInputRule().then((res) => {
      if (res.data.code == 200) {
        this.ruleList = res.data.data;
      }
    });
  },
  methods: {
    /*
    changeValue(type) {
      this.data.ruleType = type;
      this.data.assignType = type;
      if (type == "ass_static") {
        this.data.assRuleCode = "";
        this.data.method = "";
        this.data.value = "";
      } else if (type == "ass_remote") {
        this.data.assRuleCode = "";
        this.data.value = "";
      } else {
        this.data.ruleUrl = "";
        this.data.value = '';
        this.data.method = "";
      }
    },*/
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) rules.push(this.validator[key]);
      });
      console.log(this.data.rules);
      this.data.rules = rules;
    },
    changeHideLable(item){
      if(this.data.label!=''){
        this.lableN=this.deepClone(this.data.label)
        this.labelWidthN='120px'
      }
      item==0?(this.data.labelWidth="0px",this.data.label=""):(this.data.labelWidth='',this.data.label=this.lableN)
      item=!item
    }
  },
  watch: {
    'data':(vl)=>{
      console.log('input-watch'+JSON.stringify(vl))
    },
    "data.label": function (val) {
      if (val) this.title=val
    },
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