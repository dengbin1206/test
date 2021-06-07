<template>
  <div>
    <el-form-item label="数据类型">      
      <el-select v-model="data.dataType" placeholder="请输入" filterable clearable>
        <el-option
          v-for="item in dataTypeList"
          :key="item.key"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上传地址">
      <el-form-item>
        <avue-radio v-model="data.method" :dic="methodDic"></avue-radio>
        <!--
        <avue-switch v-model="data.method" :dic="methodDic" active-color="#13ce66" inactive-color="#ff4949" @change="methodChange">
        </avue-switch>-->
      </el-form-item>
      <el-input v-model="data.action"
                placeholder="上传地址">
        <el-button slot="append" @click="clickAction" icon="el-icon-search">选择</el-button>
      </el-input>
      <!--<avue-input-tree default-expand-all v-model="form" placeholder="请选择内容" type="tree" :dic="data.treeDic"></avue-input-tree>-->
    </el-form-item>
    <el-form-item label="占位内容dd">
      <el-input v-model="data.placeholder" placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="查询条件" name="static" >
      <draggable tag="ul"
                  :list="data.children.column"
                  ghost-class="ghost"
                  handle=".drag-item">
        <li v-for="(item, index) in data.children.column"
            :key="index">
          <i class="drag-item el-icon-s-operation"
              style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
          <el-input style="margin-right: 5px;"
                    size="mini"
                    v-model="item.label"
                    placeholder="label"></el-input>
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
          @change="addSearchRow"
        >
          <el-option
            v-for="item in resDic"
            :key="item.value"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <!--<div style="margin-left: 22px;">
        <el-button type="text" @click="addTable">添加列</el-button>
      </div>-->
    </el-form-item>
    <el-form-item label="编辑表格列" name="static" >
      <draggable tag="ul"
                  :list="data.children.column"
                  ghost-class="ghost"
                  handle=".drag-item">
        <li v-for="(item, index) in data.children.column"
            :key="index">
          <i class="drag-item el-icon-s-operation"
              style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
          <el-input style="margin-right: 5px;"
                    size="mini"
                    v-model="item.label"
                    placeholder="label"></el-input>
          <el-input size="mini"
                    v-model="item.prop"
                    placeholder="value"></el-input>
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
        <el-button type="text" @click="addTable">添加列</el-button>
      </div>
    </el-form-item>

    <el-form-item label="数据选项">
      <el-radio-group v-model="inputRules">
        <el-radio-button label="静态"></el-radio-button>
        <el-radio-button label="后台"></el-radio-button>
      </el-radio-group>      
      <div v-if="inputRules == '静态'" class="tableContainer">
        <div class="diyItem" style="padding: 15px 26px 0;" >
          <el-input style="margin-right: 5px;"
                    v-for="(item,index) in data.children.column"
                    size="mini"
                    :key="index"
                    disabled
                    v-model="item.label"
                    :placeholder="item.label"></el-input>
        </div>
        <div v-for="(item, index) in data.data" :key="index" class="diyItem">
          <i class="drag-item el-icon-s-operation" style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
          <el-input style="margin-right: 5px;"
                    v-for="(data,index) in data.children.column"
                    size="mini"
                    :key="index"
                    v-model="item[data.prop]"
                    :placeholder="data.prop"></el-input>
          <el-button @click="data.data.splice(index,1)"
                      circle
                      plain
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="padding: 4px;margin-left: 5px;"></el-button>
        </div>
        <el-button type="text" @click="addTableData" style="margin-left: 22px;">添加行</el-button>
      </div>
    </el-form-item>
    <!-- <el-form-item label="" v-if="inputRules == '静态'" name="static">
      <avue-input-table
        :props="props01"
        :column="column01"
        :on-load="onLoad"
        v-model="data.value"
        placeholder="请默认值"
      ></avue-input-table>
      <el-checkbox checked>当前用户</el-checkbox>      
    </el-form-item> -->
    <el-form-item label="" v-if="inputRules == '后台'" name="remote">
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
      v-if="inputRules == '后台' && data.dicMethod == 'post'"
    >
      <avue-dynamic
        v-model="data.dicQueryConfig"
        :children="option"
      ></avue-dynamic>
    </el-form-item>
    <el-form-item label="填充字段">
      <el-input v-model="data.fullField" placeholder="填充字段"></el-input>
    </el-form-item>
    <el-form-item label="填充字段格式">
      <el-input v-model="data.fullFieldFormat" placeholder="返回文本格式"></el-input>
    </el-form-item>
    <el-form-item label="后台返回字段">
      <!-- <el-input v-model="data.queryField" placeholder="后台返回字段"></el-input> -->
      <el-select v-model="data.queryField" multiple placeholder="后台返回字段" style="width:100%">
         <el-option label="名称" value="name"></el-option>
         <el-option label="性别" value="sex"></el-option>
         <el-option label="账号" value="account"></el-option>
         <el-option label="员工编号" value="code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import { getUserList } from "@/api/tool/form";
export default {
  name: "config-input-table",
  props: ["data"],
  components: { Draggable },
  data() {
    return {
      inputRules: "静态",
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
      methodDic:[{
          label:'GET',
          value:'GET'
        },{
          label:'POST',
          value:'POST'
      }],
      method:'GET',
      treeDic: [],
      resDic:null,
      option: {
        column: [
          {
            type: "select",
            prop: "key",
            label: "key",
          },
          // {
          //   type: "input",
          //   prop: "value",
          //   label: "value",
          // },
        ],
      },
      dataType:null,
      dataTypeList: [
        {
          key: "sys-dict",
          name: "预定义",
        },
        {
          key: "biz-dict",
          name: "远程",
        },
      ],
      column: {
        children: {
          border: true,
          column: [
            {
              label: "姓名",
              width: 120,
              search: true,
              prop: "name",
            },
            {
              label: "性别",
              search: true,
              prop: "sex",
            },
          ],
        },
      },
      props01: {
        label: "name",
        value: "id",
      },
    };
  },
  methods: {
    methodChange(val) {
      console.log('methodChange:'+val)
    },
    clickAction() {
      console.log('clickAction=>'+this.data.method+':'+this.data.action)
      var resDic= [];
      axios({
        url:this.data.action,
        methods:this.data.method
      }).then(res=>{
        if(res.data.code == 200){
          console.log('axios=res:'+JSON.stringify(res))
          //无翻页 data.records
          res.data.data.records.forEach((item) => {
            console.log('axios=key:'+JSON.stringify(item))  
            Object.keys(item).forEach(key => {
              var dicItem={
                label:key,
                value:item[key],
              };
              resDic.push(dicItem)
              console.log(key+':'+item[key]) 
            })         
          });
          //this.tableData = res.data.data.records;
          this.$set(this.data, "resDic", resDic);    
        }
      })
      var resDic1= [{
          label:'选项1',
          value:0,
          children:[{
             label:'选项3',
             value:2
          },{
             label:'选项4',
             value:3
          }]
        },{
          label:'选项2',
          value:1
      }]
      //添加行数
      
      //添加新的行数
      // this.tableData.push(newValue);
    },
    addTableData(){
      this.data.dataUrl = '';
      if(this.data.children.column.length === 0){
        this.$alert('列不能为空')
        return;
      }
      let obj = {};
      for(let i = 0;i <  this.data.children.column.legnth;i++){
        obj[this.data.children.column[i].prop] = '';
 
      }
      this.data.data.push(obj)
    },
    deleteTable(index){
      this.data.children.column.splice(index,1)
    },
    addTable(){
      this.data.children.column.push({label:"",prop: ""})
    },
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) rules.push(this.validator[key]);
      });
      this.data.rules = rules;
    },
    handleRemoveFields(index) {
      this.data.dic.splice(index, 1);
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
    onLoad({ page, value,data }, callback){
      console.log("input-table-onLoad=>init:"+value);
        //首次加载去查询对应的值
        if (value) {
          console.log("input-table-onLoad=>value:"+value);
          //this.$message.success('首次查询'+value)
          callback({
            id: '0',
            name: '张三',
            sex: '男'
          })
          return
        }
        if(data){
          console.log("input-table-onLoad=>data:"+data);
          //this.$message.success('搜索查询参数'+JSON.stringify(data))
        }
        if(page){
            console.log("input-table-onLoad=>page:"+page);
          //this.$message.success('分页参数'+JSON.stringify(page))
        }
        //分页查询信息
        callback({
          total: 2,
          data: [{
            id: '0',
            name: '张三',
            sex: '男'
          }, {
            id: '1',
            name: '李四',
            sex: '女'
          }]
        })
      }
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
  display: flex;
  align-items: center;
  div{
    // width: 40px;
    display: inline-block;
  }
  /deep/.el-input__inner{
    // width: 40px;
  }
}
</style>