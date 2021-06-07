<template>
  <div class="widget-config">
    <el-form
      label-suffix="："
      label-width="120px"
      label-position="left"
      v-if="this.data && Object.keys(this.data).length > 0"
      size="small"
    >
      <el-collapse v-model="collapse">
        <el-collapse-item name="1" title="基本属性">
          <el-form-item label="模型字段" v-if="!['group','dynamic','title','divider', 'warning','crud','tabs'].includes(data.type)&&data.component!='el-button'">
            <el-select
              v-model="data.fieldId"
              placeholder="请选择模型字段"
              @change="handleChangeModel"
            >
              <el-option
                v-for="item in field.modelData"
                :key="item.fieldName"
                :label="item.combinationName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型字段名称" style="display: none">
            <el-input v-model="data.fieldName"></el-input>
          </el-form-item>
          <el-form-item label="类型" v-if="!['divider', 'warning'].includes(data.type)">
            <!-- disabled -->
            <el-select
              v-model="data.type"
              placeholder="请选择类型"
              @change="handleChangeType"
            >
              <el-option-group
                v-for="group in fields"
                :key="group.title"
                :label="group.title"
              >
                <el-option
                  v-for="item in group.list"
                  :key="item.type"
                  :label="item.title"
                  :value="item.type"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="属性值" v-if="!['dynamic','divider', 'warning'].includes(data.type)">
            <el-input
              v-model="data.prop"
              placeholder="属性值"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="label宽度" v-if="!['title','divider', 'warning','tabs','crud'].includes(data.type)&& data.component !== 'el-button'">
            <el-input v-model="data.labelWidth"></el-input>
          </el-form-item> -->
          <el-form-item label="标题" v-if="!['input','title','divider', 'warning','tabs','crud'].includes(data.type)&& data.component !== 'el-button'">
            <el-input v-model="data.label" placeholder="标题" @change="init()"></el-input>
          </el-form-item>
          <el-form-item label="隐藏标题" v-if="!['input','group','title','divider', 'warning','tabs','crud'].includes(data.type)&& data.component !== 'el-button'">
            <!-- <el-switch v-model="data.labelDisplay" :active-value="false" :inactive-value="true" ></el-switch> -->
            <el-switch v-model="data.hideLable" :active-value="0" :inactive-value="1" @change="changeHideLable(data.hideLable)"></el-switch>
          </el-form-item>
          <!-- <el-form-item label="标题颜色" v-if="!['title','divider', 'warning','tabs','crud'].includes(data.type)&& data.component !== 'el-button'">
            <el-select v-model="data.lableColor" placeholder="选择标题颜色" clearable>
                <el-option label="红色" value="red"></el-option>
                <el-option label="蓝色" value="blue"></el-option>
                <el-option label="绿色" value="green"></el-option>
                <el-option label="橙色" value="orange"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="宽度" v-if="data.subfield">
            <el-input-number
              v-model="data.width"
              controls-position="right"
              placeholder="宽度"
              :min="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="表单栅格" >
            <el-input-number
              v-model="data.span"
              controls-position="right"
              placeholder="表单栅格"
              :min="1"
              :max="24"
            ></el-input-number>
          </el-form-item><!--
          <el-form-item label="绑定表格" v-show='this.data.showCrud' v-if="data.type == 'button'">
            <el-select v-model="data.crud" placeholder="选择表格">
              <el-option
                    v-for="(item, index) in data.crudList"
                    :label="item.title"
                    :key="index"
                    :value="item"
                  >
                  </el-option>
            </el-select>
          </el-form-item>-->
          <component :is="getComponent" :data="data" :item="data"></component>         
          <!-- <el-form-item label="css类名" v-if="!['title','divider', 'warning'].includes(data.type)&& data.component !== 'el-button'">
            <el-input type="textarea" v-model="data.className" placeholder="css类"></el-input>
          </el-form-item> -->
          <el-form-item label="关联上级" v-if="data.type == 'input'">
            <el-select v-model="data.inputParent" placeholder="关联上级" clearable @change="changeInput">
              <el-option v-for="(item,index) in inputList" :key="index" :label="item.label"
                         :value="item.prop"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="内容" v-if="data.component == 'elDivider'">
            <el-input v-model="data.params.html" placeholder="内容"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="数据类型" v-if="['cascader', 'checkbox', 'upload', 'img', 'array'].includes(data.type)">
            <el-select v-model="data.dataType" placeholder="数据类型" clearable>
              <el-option label="String" value="string"></el-option>
              <el-option label="Number" value="number"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="时间类型"
                        v-if="['year', 'month', 'week', 'date', 'time','datetime','daterange','timerange','datetimerange','datepick','timepick'].includes(data.type)">
            <el-select v-model="data.dtType" placeholder="时间类型" clearable @change="changeDate">
              <el-option v-for="(item,index) in timeType" :label="item.name" :value="item.value"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选项卡位置"  v-if="data.type == 'tabs'">
            <el-select   placeholder="位置" v-model="data.params.option.position" clearable>
              <el-option v-for="(item,index) in ['top','bottom','left','right']" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="data.type == 'crud' ? '编辑表格列' : '选项卡配置'" name="static" v-if="['crud','tabs'].includes(data.type)">
            <draggable tag="ul"
                       :list="data.params.option.column"
                       ghost-class="ghost"
                       handle=".drag-item">
              <li v-for="(item, index) in data.params.option.column"
                  :key="index">
                <i class="drag-item el-icon-s-operation"
                   style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                <el-input style="margin-right: 5px;"
                          size="mini"
                          v-model="item.label"
                          placeholder="label"></el-input>
                <!--<el-input size="mini"
                          v-model="item.prop"
                          placeholder="value"></el-input>-->
                <el-button @click="deleteTable(index)"
                           circle
                           plain
                           type="danger"
                           size="mini"
                           icon="el-icon-minus"
                           style="padding: 4px;margin-left: 5px;"></el-button>
              </li>
            </draggable>
            <div style="margin-left: 22px;">
              <el-select
                placeholder="添加列"
                @change="addRow"
              >
                <el-option
                  v-for="item in field.modelData"
                  :key="item.fieldName"
                  :label="item.fieldRemark"
                  :value="item"
                >
                </el-option>
            </el-select>
              <!--<el-button type="text" @click="addTable">添加列</el-button>-->
            </div>
          </el-form-item>
 
          <el-form-item label="数据选项" v-if="data.type == 'crud'" class="mycrud">
            <!-- <el-input  placeholder="变量/表达式"></el-input> -->
            <el-radio-group v-model="data.tableDataType" style="margin-bottom: 10px;">
              <el-radio-button label="静态"></el-radio-button>
              <!--<el-radio-button label="后台"></el-radio-button>-->
            </el-radio-group>
            <div v-if="data.tableDataType == '静态'" class="tableContainer">
              <div class="diyItem" style="padding: 0 26px;" >
                <el-input style="margin-right: 5px;"
                          v-for="(data,key) in data.params.option.column"
                          size="mini"
                          :key="key"
                          disabled
                          v-model="data.label"
                          :placeholder="data.label"></el-input>
              </div>
              <div v-for="(item, index) in data.params.data" :key="index" class="diyItem">
                <i class="drag-item el-icon-s-operation" style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                <el-input style="margin-right: 5px;"
                          v-for="(data,key) in data.params.option.column"
                          size="mini"
                          :key="key"
                          v-model="item[data.prop]"
                          :placeholder="data.prop"></el-input>
                <el-button @click="data.params.data.splice(index,1)"
                           circle
                           plain
                           type="danger"
                           size="mini"
                           icon="el-icon-minus"
                           style="padding: 4px;margin-left: 5px;"></el-button>
              </div>
              <el-button type="text" @click="addTableData" style="margin-left: 22px;">添加行</el-button>
            </div>
            <el-select v-if="data.tableDataType == '后台'" @change="changeValue('后台')" placeholder="选择请求方法" v-model="data.method" clearable>
              <el-option v-for="(item,index) in ['GET','POST']" :label="item" :value="item" :key="index"></el-option>
            </el-select>
            <el-input
              @change="data.params.data=[]"
              v-if="data.tableDataType == '后台'"
              v-model="data.dataUrl"
              placeholder="请求地址"
              style="margin-top: 10px"
            ></el-input>
          </el-form-item>
          <el-form-item label="新增按钮" v-if="data.type == 'crud'">
            <el-switch v-model="data.params.option.addBtn"></el-switch>
          </el-form-item>
          <el-form-item label="删除按钮" v-if="data.type == 'crud'">
            <el-switch v-model="data.params.option.delBtn"></el-switch>
          </el-form-item>
          <el-form-item label="编辑按钮" v-if="data.type == 'crud'">
            <el-switch v-model="data.params.option.editBtn"></el-switch>
          </el-form-item>
          <!-- <el-form-item label='处理规则' v-if="data.type === 'input'">
            <el-select v-model="data.change" placeholder="处理规则" clearable>
              <el-option  v-for="(item,index) in ruleList" :label="item.name" :key="index" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="关联上级" v-if="data.type == 'select'">
            <el-select v-model="data.setectValue" placeholder="关联上级" clearable @change="changeRelation">
              <el-option v-for="(item,index) in selectList" :key="index" :label="item.label"
                         :value="item.prop"></el-option>
            </el-select>
          </el-form-item>
          <!--
          <el-form-item label="关联table"  v-if="data.component == 'el-button'">
            <el-select v-model="data.setectValue" placeholder="关联上级" clearable @change="changeRelation">
              <el-option v-for="(item,index) in tableList" :key="index" :label="item.label" multiple :value="item.prop"></el-option>
            </el-select>
          </el-form-item>-->
 
          <el-form-item label="是否只读" v-if="!['group','dynamic','title','divider', 'warning'].includes(data.type)">
            <el-switch v-model="data.readonly" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
          <el-form-item label="是否禁用" v-if="!['group','dynamic','title','divider', 'warning'].includes(data.type)">
            <el-switch v-model="data.disabled" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
          <el-form-item label="是否可见" v-if="!['group','dynamic','title','divider', 'warning'].includes(data.type)">
            <el-switch v-model="data.display" :active-value="false" :inactive-value="true"></el-switch>
          </el-form-item>
          <el-form-item label="详情模式" v-if="!['group','dynamic','title','divider', 'warning'].includes(data.type)">
            <el-switch v-model="data.detail" :active-value="true" :inactive-value="false"></el-switch>
            <!-- <el-switch v-model="data.detail" ></el-switch> -->
          </el-form-item>
 
 
          <el-form-item label="权限控制" v-if="!['group','dynamic','title','divider', 'warning'].includes(data.type)">
            <el-switch v-model="data.on"></el-switch>
            <el-button v-if="data.on" type="primary" round size="mini" style="margin-left:15px;">权限分配</el-button>
          </el-form-item>
          <!-- <el-form-item label="权限分配" >
            <el-select placeholder="选择有权限的用户" >
 
            </el-select>
          </el-form-item>    -->
        </el-collapse-item>
        <el-collapse-item name="2" title="事件属性" v-if="!['group', 'dynamic'].includes(data.type)">
          <el-form-item label="change">
            <avue-input
              v-model="data.change"
              type="textarea"
              placeholder="改变事件"
              rows="5"
              clearable
            ></avue-input>
          </el-form-item>
          <el-form-item label="click">
            <el-input
              v-model="data.click"
              type="textarea"
              placeholder="点击事件"
              rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="focus">
            <el-input
              v-model="data.focus"
              type="textarea"
              placeholder="获取焦点事件"
              rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="blur">
            <el-input
              v-model="data.blur"
              type="textarea"
              placeholder="失去焦点事件"
              rows="5"
            ></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <avue-empty
      v-else
      desc="拖拽字段进行配置"
      style="margin-top: 100%"
    ></avue-empty>
  </div>
</template>
 
<script>
import fields from "./fieldsConfig.js";
// import configInput from "./config/input01.vue";
//import bus from "@/forms/utils/eventBus";
const dateArr = [
  "year",
  "month",
  "week",
  "date",
  "datetime",
  "time",
  "daterange",
  "timerange",
  "datetimerange",
  "dates",
];
export default {
  name: "widget-config",
  props: ["data", "field"],
 
  computed: {
    // configInput,
    getComponent() {
      console.log('config-getComponent:' +this.data.type+'-'+this.data.title)//JSON.stringify(this.data.title)+'=>')
      //(item.type, item.component)
      const prefix = "config-";
      const {type} = this.data;
      // console.log(this.$parent)
      let result = "input";
      if ([undefined, "input", "password", "url"].includes(type))
        result = "input";
      else if(['primary','danger','success','warning','info'].includes(type)) result='button'
      else if (dateArr.includes(type)) result = "date";
      else if (["array", "img"].includes(type)) result = "array";
      else result = type;
      // console.info(prefix + result)
      // console.log(this.data)
      // 筛选 不能关联自己为上级
      window.$bus.$emit('getFormData',this.field)
      console.log("..................."+result)
      return prefix + result;      
    },
  },
  watch: {
    'field':(vl)=>{
      console.log('watch')
      console.log(vl)
    },
    'data':(vl)=>{
      console.log('watch-data')
      console.log(vl)
    },
    'data.crud': function (val) {      
      if (val) {        
        console.log('data.crud=>:' +JSON.stringify(val))
        this.$set(this.data, "modelId", val.modelId);
      }
    }
  },
  data() {
    return {
      fields,
      collapse: "1",
      selectList: [],
      newSelectList: [],
      newInput: [],
      /*showCrud:false,
      crudList:{},
      crud:null,
      crudId:null,
      modelId:null,*/
      inputList: [],
      tableList:[],
      inputValue: '',
      setectValue: '',
      lableN:'',
      labelWidthN:'',
      timeType: [{name: '年', value: 'year'},
        {name: '月', value: 'month'},
        {name: '周', value: 'week'},
        {name: '日期', value: 'date'},
        {name: '时间', value: 'time'},
        {name: '日期时间', value: 'datetime'},
        {name: '日期范围', value: 'daterange'},
        {name: '时间范围', value: 'timerange'},
        {name: '日期时间范围', value: 'datetimerange'},
        // {name:'datepick',value:'datepick'},
        // {name:'timepick',value:'timepick'},
        // {name:'calendar',value:'calendar'}
      ],
      ruleList: [{name: "测试", value: `(event,target)=>{event.value=100;console.log(event);}`}]
 
    };
  },
  mounted() {
    /*
    window.$bus.$on('showCrud', (data) => {
      console.log('button-crudList:'+JSON.stringify(data))
      if(data.assFunc=='search'){
        this.$set(this.data,'showCrud',true)
      }      
    })*/
    //console.log('mounted-begin')
    this.init()
    //console.log('mounted-end')
  },
  beforeCreate() {
  },
  beforeDestroy() {
    // 清除全局方法 避免重复使用
    window.$bus.$off('getFormData')
  },
  methods: {    
    addTableData(){
      this.data.dataUrl = '';
      if(this.data.params.option.column.length === 0){
        this.$alert('列不能为空')
        return;
      }
      let obj = {};
      for(let i = 0;i <  this.data.params.option.column.legnth;i++){
        obj[this.data.params.option.column[i].prop] = ''; 
      }
      this.data.params.data.push(obj)
    },
    deleteTable(index){
      this.data.params.option.column.splice(index,1)
    },
    addRow(item){
      console.log('addRow-item:'+JSON.stringify(item))//JSON.stringify(data)); 
      this.data.params.option.column.push({label:item.fieldRemark,prop: item.fieldName})
    },
    addTable(){
      this.data.params.option.column.push({label:"",prop: ""})
    },
    changeDate(value) {
      if (value == 'year') {
        this.data.type = 'year',
          // this.data.label= '年',
          this.data.icon = 'icon-year',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'yyyy',
          this.data.valueFormat = 'yyyy'
      } else if (value == 'month') {
        this.data.type = 'month',
          // this.data.label= '月',
          this.data.icon = 'icon-month',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'MM',
          this.data.valueFormat = 'MM'
      } else if (value == 'week') {
        this.data.type = 'week',
          // this.data.label= '周',
          this.data.icon = 'icon-week',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'yyyy 第 WW 周'
      } else if (value == 'date') {
        this.data.type = 'date',
          // this.data.label= '日期',
          this.data.icon = 'icon-date',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'yyyy-MM-dd',
          this.data.valueFormat = 'yyyy-MM-dd'
      } else if (value == 'time') {
        this.data.type = 'time',
          // this.data.label= '时间',
          this.data.icon = 'icon-time',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'HH:mm:ss',
          this.data.valueFormat = 'HH:mm:ss'
      } else if (value == 'datetime') {
        this.data.type = 'datetime',
          // this.data.label= '日期时间',
          this.data.icon = 'icon-datetime',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'yyyy-MM-dd HH:mm:ss',
          this.data.valueFormat = 'yyyy-MM-dd HH:mm:ss'
      } else if (value == 'daterange') {
        this.data.type = 'daterange',
          // this.data.label= '日期范围',
          this.data.icon = 'icon-date-range',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'yyyy-MM-dd',
          this.data.valueFormat = 'yyyy-MM-dd'
      } else if (value == 'timerange') {
        this.data.type = 'timerange',
          // this.data.label= '时间范围',
          this.data.icon = 'icon-time-range',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'HH:mm:ss',
          this.data.valueFormat = 'HH:mm:ss'
      } else if (value = 'datetimerange') {
        this.data.type = 'datetimerange',
          // this.data.label= '日期时间范围',
          this.data.icon = 'icon-datetime-range',
          // this.data.span= 24,
          this.data.display = true,
          this.data.format = 'yyyy-MM-dd HH:mm:ss',
          this.data.valueFormat = 'yyyy-MM-dd HH:mm:ss'
      }
      // else if (value == 'datepick'){
      //     this.data.type= 'datepick',
      //     // this.data.label= '日期选择器',
      //     this.data.icon= 'icon-datetime-range',
      //     // this.data.span= 24,
      //     this.data.display= true,
      //     this.data.format= 'yyyy-MM-dd',
      //     this.data.valueFormat= 'yyyy-MM-dd'
      // }else if(value == 'timepick'){
      //     this.data.type= 'timepick',
      //     // this.data.label= '时间选择器',
      //     this.data.icon= 'icon-datetime-range',
      //     // this.data.span= 24,
      //     this.data.display= true,
      //     this.data.format= 'yyyy-MM-dd HH:mm:ss',
      //     this.data.valueFormat= 'yyyy-MM-dd HH:mm:ss'
      // }else if (value == 'calendar') {
      //     this.data.title= '日历',
      //     this.data.type= 'calendar',
      //     // this.data.labelWidth= '40',
      //     this.data.prop= 'calendar',
      //     this.data.icon= 'icon-map',
      //     this.data.component= 'elCalendar' //ele日期
      //     // this.data.span= 24
      // }
    },
    changeInput() {
      //input 关联
      for(let i = 0;i < this.data.inputParent.length;i++){
        let index = this.formData.column.findIndex((item)=>{
          return item.prop == this.data.inputParent[i];
        })
        this.formData.column[index].inputValue = this.data.prop;
        this.formData.column[index].change =  `(event)=>{
                  window.$bus.$emit('changeValue',(column,model,callback)=>{
                  for(let i = 0; i < column.length;i++){
                      if(column[i].prop == event.column.inputValue){
                        console.log(model[column[i].prop]);
                        model[column[i].prop] = model[column[i].prop]+''+event.value;
                      }
                   }
                   callback(model);
                  })
                }`
      }
    },
    // select 关联 链级
    changeRelation() {
      // console.log(12)
      // 选择父级筛选  触发子级更新  逻辑需处理
      this.formData.column.forEach((el, index) => {
        if (el.type == 'select') {
          if (el.setectValue) {
            this.formData.column.forEach((element, idx) => {
              if (el.setectValue == element.prop) {
                // console.log(element,idx)
                element.change = `(event)=>{
                  window.windowSelect.column.forEach((el,index)=>{
                      if(event.column.prop == el.setectValue ){
                        el.dicData=[{label:777,value:1}]
                      }
                  })
                }`
              }
            })
          }
          // if(el.selectValue){
 
          // }
        }
      })
      console.log(this.formData)
    },
    init() {
      // 设置关联上级  select 筛选数据 用leable做name
      window.$bus.$on('getFormData', (data) => {
        console.log('init:'+data.column.length)//JSON.stringify(data));        
        this.formData = data;
        if (data) {
          let arr = [];
          let arr2 = [];
          let arr3 = [];
          this.selectList = []
          data.column.forEach(el => {
            if (el.type == 'select') {
              arr.push(el)
            } else if (el.type == 'input') {
              arr2.push(el)
            }else if(el.type == 'crud'){
              arr3.push(el)
            }else if(el.type == 'group'){
              el.children.column.forEach(elItem => {
                if(elItem.type == 'crud'){
                  arr3.push(elItem)
                }
              })            
            }
          })
          this.tableList = arr3     
          //this.data.crudList = this.tableList
          window.$bus.$emit('setCrudList',this.tableList)
          this.newSelectList = arr;
          this.selectList = JSON.parse(JSON.stringify(arr))
          this.newInput = arr2;
          this.inputList = JSON.parse(JSON.stringify(arr2))
          this.selectList = this.newSelectList.filter((item) => {
            return this.data.prop != item.prop
          })
          this.inputList = this.newInput.filter((item) => {
            return this.data.prop != item.prop
          })
        }
      })
    },
    async handleChangeType(type) {
      if (type) {
        const config = await this.getConfigByType(type);
        config.prop = this.data.prop;
        for (let key in config) {
          if (
            config &&
            Object.prototype.hasOwnProperty.call(config, key) &&
            !["icon", "label", "span"].includes(key)
          ) {
            const val = config[key];
            this.$set(this.data, key, val);
          }
        }
      }
    },
    getConfigByType(type) {
      return new Promise((resolve, reject) => {
        fields.forEach((field) => {
          field.list.forEach((config) => {
            if (config.type == type) resolve(config);
          });
        });
        reject();
      });
    },
    handleChangeModel(fieldId) {     
      console.log('handleChangeModel-data:'+JSON.stringify(this.data));        
      let obj = {};
      obj = this.field.modelData.find((item)=>{
        return item.id === fieldId;
      });      
      //this.$set(data, "fieldName", obj.fieldName);
      this.data.fieldName = obj.fieldName;
      console.log('handleChangeModel-obj:'+JSON.stringify(obj)); 
    },
    changeHideLable(item){
        if(this.data.label!=''){
          this.lableN=this.deepClone(this.data.label)
          this.labelWidthN='120px'
        }
      // if(item==1){
      //   this.data.labelWidth="0px"
      //   this.data.label=""
      // }else{
      //   this.data.labelWidth=this.labelWidthN
      //   this.data.label=this.lableN
      // }
      item==0?(this.data.labelWidth="0px",this.data.label=""):(this.data.labelWidth='',this.data.label=this.lableN)
      item=!item
    }
  },
};
</script>
 
<style lang="scss" scoped>
.widget-config .el-form .el-select,
.widget-config .el-form .el-input-number {
  width: 100%;
}
/deep/.mycrud{
  /deep/.el-input__inner{
    padding: 0 2px !important;
    min-width: 30px !important;
    text-align: center;
  }
}
.tableContainer{
  width: 100%;
  display: block;
  overflow-x: auto;
}
/deep/.tableContainer::-webkit-scrollbar {
  width: 10px !important;
  height: 5px !important;
  background-color: #f1f1f1;
}
/deep/.tableContainer::-webkit-scrollbar-thumb {
  border-radius: 10px;
  width: 5px !important;
  height: 5px !important;
  background: #333 !important;
}
/deep/.tableContainer::-webkit-scrollbar-track {
  width: 10px !important;
  height: 10px;
  border-radius: 10px;
  background: #ededed;
}
.diyItem{
  white-space: nowrap;
  div{
    width: 40px;
    display: inline-block;
  }
  /deep/.el-input__inner{
    width: 40px;
  }
}
</style>