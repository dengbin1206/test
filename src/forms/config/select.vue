<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder" placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="data.value" placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item label="是否可搜索">
      <el-switch v-model="data.filterable"></el-switch>
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch v-model="data.multiple"></el-switch>
    </el-form-item>
    <!-- <el-form-item label="是否可拖拽（需引入sortable.js）"
                  v-if="data.multiple">
      <el-switch v-model="data.drag"></el-switch>
    </el-form-item> -->
    <el-form-item label="多选数量限制" v-if="data.multiple">
      <el-input-number
        v-model="data.limit"
        controls-position="right"
        placeholder="多选限制"
        :min="0"
        :max="data.dicData.length"
      ></el-input-number>
    </el-form-item>
    <!-- <el-form-item label="">
      <span>字典配置</span>
    </el-form-item> -->
 
    <el-form-item label="数据选项">
      <el-radio-group v-model="data.assignType">
        <el-radio-button label="ass_static">静态</el-radio-button>
        <el-radio-button label="ass_rule">规则</el-radio-button>
        <el-radio-button label="ass_remote">后台</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="" v-if="data.assignType == 'ass_static'" name="static">
      <draggable
        tag="ul"
        :list="data.dicData"
        :group="{ name: 'dic' }"
        ghost-class="ghost"
        handle=".drag-item"
      >
        <li v-for="(item, index) in data.dicData" :key="index">
          <i
            class="drag-item el-icon-s-operation"
            style="font-size: 16px; margin: 0 5px; cursor: move"
          ></i>
          <el-input
            style="margin-right: 5px"
            size="mini"
            v-model="item.label"
            placeholder="label"
          ></el-input>
          <el-input
            size="mini"
            v-model="item.value"
            placeholder="value"
          ></el-input>
          <el-button
            @click="handleRemoveFields(index)"
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-minus"
            style="padding: 4px; margin-left: 5px"
          ></el-button>
        </li>
      </draggable>
      <div style="margin-left: 22px">
        <el-button type="text" @click="handleAddFields">添加列 </el-button>
      </div>
    </el-form-item>
    <el-form-item label="" v-if="data.assignType == 'ass_remote'" name="remote">
      <!-- 网址 -->
      <el-input v-model="data.dicUrl" placeholder="后台网址"></el-input>
      <!-- 请求方法 -->
      <el-select
        v-model="data.dicMethod"
        placeholder="请求方法"
        style="width: 100%; margin-top: 10px"
      >
        <el-option label="POST" value="post"></el-option>
        <el-option label="GET" value="get"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="请求参数"
      v-if="data.assignType == 'ass_remote' && data.dicMethod == 'post'"
    >
      <avue-dynamic
        v-model="data.dicQueryConfig"
        :children="option"
      ></avue-dynamic>
    </el-form-item>
    <el-form-item v-if="data.assignType == 'ass_rule'">
      <el-select
        v-model="data.assRuleCode"
        @change="changeRuleCode()"
        placeholder="选择规则"
        clearable
      >
        <el-option
          v-for="(item, index) in topRuleList"
          :label="item.name"
          :key="index"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <el-select
        style="margin-top: 10px"
        v-model="data.assRuleVal"
        @change="changeRuleCode()"
        placeholder="选择规则"
        clearable
      >
        <el-option
          v-for="(item) in data.subRuleList"
          :label="item.dictValue"
          :key="item.id"
          :value="item.code"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否可清空">
      <el-switch v-model="data.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
  </div>
</template>
 
<script>
import Draggable from "vuedraggable";
import { getDictList,getBizDictList } from "@/api/tool/form";
import { getDictByCode,getDictBizByCode } from "@/api/system/dict";
export default {
  name: "config-select",
  props: ["data"],
  components: { Draggable },
  data() {
    return {
      assignType: "ass_static",
      assRuleCode: "",
      assRuleVal:'',
      query:{},
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
      topRuleList: [
        {
          key: "sys-dict",
          name: "系统字典",
        },
        {
          key: "biz-dict",
          name: "业务字典",
        },
        {
          key: "sys-model-001",
          name: "模型001",
        },
      ],
      subRuleList: {},
      // option: {
      //   column: [{
      //     type: 'input',
      //     prop: 'key',
      //     label: 'key'
      //   }, {
      //     type: 'input',
      //     prop: 'value',
      //     label: 'value'
      //   }]
      // },
      option: {
        column: [
          {
            type: "select",
            prop: "key",
            label: "key",
          },
        ],
      },
    };
  },
  mounted: function() {
    console.log('select-mounted-data:' +JSON.stringify(this.data)+'=>')
    console.log('select-mounted:' +JSON.stringify(this.item)+'=>')
  },
  methods: {
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) rules.push(this.validator[key]);
      });
      this.data.rules = rules;
    },
    handleRemoveFields(index) {
      this.data.dicData.splice(index, 1);
    },
    handleAddFields() {
      const i = Math.ceil(Math.random() * 99999);
      this.data.dicData.push({ label: `字段${i}`, value: `col_${i}` });
    },
    handleRemoveCascaderItemFields(index) {
      this.data.cascaderItem.splice(index, 1);
    },
    handleAddCascaderItemFields() {
      this.data.cascaderItem.push("");
    },
    handleTabClick({ name }) {
      if (name == "remote" && !this.data.dicQueryConfig)
        this.data.dicQueryConfig = [];
    },
    //选中模型
    changeRuleCode() {
      console.log("changeRuleCode=>:");
      let params={parentId:0};
      if (this.data.assRuleCode == "sys-dict") {
        getDictList(
          Object.assign(params, this.query)
        ).then((res) => {
          console.log("getDictList=>:" + res);
          this.$set(this.data,'subRuleList',res.data.data)
          //this.data.subRuleList = res.data.data.records;
        });
      }
      if (this.data.assRuleCode == "biz-dict") {
        getBizDictList(
          Object.assign(params, this.query)
        ).then((res) => {
          console.log("getBizDictList=>:" + res);
          this.$set(this.data,'subRuleList',res.data.data)
          //this.data.subRuleList = res.data.data.records;
        });
      }
      console.log("getParent-assRuleCode=>:"+this.data.subRuleList);
      /*
         findFieldsById(id).then(res=>{
         let arr = []
         let arrId = []
         res.data.data.forEach(ele=>{
             arr.push({id:ele.id,combinationName:ele.combinationName})
             arrId.push(ele.id)
         })
        this.$set(this.data,'modelData',arr)
         if(this.data.column.length > 0 ){
             this.data.column.forEach(ele=>{
               if(ele.fieldId){
                 this.$nextTick(()=>{
              ele.fieldId = '';
            })
               }
         })
         }
      })*/
    },
  },
  watch: {
    "data.required": function (val) {
      if (val)
        this.validator.required = {
          required: true,
          message: `请选择${this.data.label}`,
        };
      else this.validator.required = null;
 
      this.generateRule();
    },
    "data.assRuleVal": function (val) {
      if (val){
        let params={code:val};
        console.log("assRuleVal=>:" + val);
        if (this.data.assRuleCode == "sys-dict") {
          getDictByCode(val).then((res) => {
            console.log("getDictByCode=>:" + JSON.stringify(res));
            let dicArr = []
            res.data.data.forEach(ele=>{
                dicArr.push({label:ele.dictValue,Value:ele.dictKey})
            })
            console.log("getDictByCode=>resArr:" + JSON.stringify(dicArr));
            this.$set(this.data,'dicData',dicArr)
            //this.data.subRuleList = res.data.data.records;
          });
        }
        if (this.data.assRuleCode == "biz-dict") {
          getDictBizByCode(val).then((res) => {
            console.log("getDictBizByCode=>:" + JSON.stringify(res));
            let dicArr = []
            res.data.data.forEach(ele=>{
                dicArr.push({label:ele.dictValue,Value:ele.dictKey})
            })
            console.log("getDictByCode=>resArr:" + JSON.stringify(dicArr));
            this.$set(this.data,'dicData',dicArr)
            //this.data.subRuleList = res.data.data.records;
          });
        }        
      } 
    },
  },
};
</script>