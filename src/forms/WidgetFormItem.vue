<template>
  <div>
    <i :class="item.icon" style="font-size: 18px;" v-if="item.type == 'title'"></i>
    <span v-if="item.type == 'title'"
          :style="item.styles"
          style="margin-left: 5px;">
      {{item.value}}
    </span>
    <el-row v-else-if="item.type == 'select'" 
      :span="item.span">
      <el-col>
        <avue-select v-model="form[item.prop]"
        :placeholder="item.placeholder || getPlaceholder(item)"
        type="tree" 
        :dic="item.dicData"></avue-select>
      </el-col>
    </el-row>
    <el-col v-else-if="item.type == 'input-table'" :key="index"
                    :md="item.span || 12"
                    :xs="24"
                    :offset="item.offset || 0"
                    @click="handleSelectWidget(index)">  
        <widget-input-table :item="item"></widget-input-table>            
        <!--<avue-input-table :props="column.children.column" :column="column" :on-load="column.onLoad" v-model="form" placeholder="请选择数据"></avue-input-table>-->
    </el-col>   
    <el-input v-else-if="item.type == 'table'" 
      :placeholder="item.placeholder || getPlaceholder(item)" 
      readonly 
      v-model="form[item.prop]">
      <el-button slot="append" icon="el-icon-search">选择</el-button>
    </el-input>
    <el-button v-else-if="item.type == 'button'"
               v-model="form[item.prop]"
               v-bind="Object.assign(deepClone(item), params, { size:item.size || 'small' })"
               :dic="item.dicData"
               :type="item.btnType"
               style="text-align:center" >{{item.title}}
    </el-button>
    <component v-else
               :is="getComponent(item.type, item.component)"
               v-model="form[item.prop]"
               v-bind="Object.assign(deepClone(item), params, { size:item.size || 'small' })"
               :placeholder="item.placeholder || getPlaceholder(item)"
               :dic="item.dicData">
      <span v-if="params.html" v-html="params.html"></span>
    </component>
  </div>
</template>
<script>
import WidgetInputTable from './WidgetInputTable'
export default {
  name: 'widget-form-item',
  components: {WidgetInputTable},
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      form: {}
    }
  },
  onLoad: function(){ 
    console.log('item-onLoad=>:')
  },
  created: function() {    
    console.log('item-create=>:' +JSON.stringify(this.item))
    /*this.form = {
      ...this.item,
      method: "",
      ruleType: "",
      ruleUrl: "",
      //assignType: this.item.assignType|'ass_static',//ass_static[静态赋值]、ass_rule[规则赋值] ass_remote[远程赋值]
      //assRuleCode: this.item.assRuleCode|""//规则编码，赋值为为规则时可用
    };*/
    if(this.item.hasOwnProperty('disabled')){
      this.item.disabled = (this.item.disabled==1)
    }
    if(this.item.hasOwnProperty('readonly')){
      this.item.readonly = (this.item.readonly==1)
    }
    if(this.item.hasOwnProperty('hideLabel')) {
      this.item.hideLable = (this.item.hideLable==1)
      if(this.item.hideLable){
        this.item.labelWidth = '0px';
        this.item.label = '';
      }
    }
    if(this.item.hasOwnProperty('value')){
      this.item.value = this.item.value
    }else{
       this.item.value=''
    }    
    console.log('item-create<=:' +JSON.stringify(this.item))
  },
  mounted() {
    console.log('item-create<=:' +JSON.stringify(this.form))
  },
  methods: {
    getComponent (type, component) {
      if(type.indexOf('-')>-1){
        console.log(type.substring(type.indexOf('-')))
      }      
      let KEY_COMPONENT_NAME = 'avue-';
      let result = 'input';
      if (component) return component
      else if (type === 'array') result = 'array';
      //else if (type === 'button') result = 'button';
      else if (['select', 'deptselect'].includes(type)) result = 'select';
      else if (type === 'radio') result = 'radio';
      else if (type === 'checkbox') result = 'checkbox';
      else if (['time', 'timerange'].includes(type)) result = 'time';
      else if (['dates', 'date', 'datetime', 'datetimerange', 'daterange', 'week', 'month', 'year'].includes(type))
        result = 'date';
      else if (type === 'cascader') result = 'cascader';
      else if (type === 'number') result = 'input-number';
      else if (type === 'password') result = 'input';
      else if (type === 'switch') result = 'switch';
      else if (type === 'rate') result = 'rate';
      else if (type === 'upload') result = 'upload';
      else if (type === 'imgupload') result = 'upload';
      else if (type === 'slider') result = 'slider';
      else if (type === 'dynamic') result = 'dynamic';
      else if (type === 'icon') result = 'input-icon';
      else if (type === 'color') result = 'input-color';
      else if (type === 'map') result = 'input-map';
      else if (type === 'crud') result = 'crud';
      // else if (type === 'tabs') result = 'tabs';
      if(result !== 'button') return KEY_COMPONENT_NAME + result;
      if(result == 'button') return 'el-' + result;
      // console.log("--------")
      
    },
    getPlaceholder (item) {
      const label = item.label;
      if (['select', 'checkbox', 'radio', 'tree', 'color', 'dates', 'date', 'datetime', 'datetimerange', 'daterange', 'week', 'month', 'year', 'map', 'icon','table'].includes(item.type))
        return `请选择 ${label}`;
      else return `请输入 ${label}`;
    },
  }
}
</script>
<style lang="css" scoped>

.el-input-number,
.el-input-number--small,
.el-select,
.el-cascader--small{
  width: 100%!important;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%!important;
}
</style>