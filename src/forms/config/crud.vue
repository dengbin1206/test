<template>
  <div>
    <el-form-item label="标题">
      <el-input v-model="data.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="占位内容">
      <el-input v-model="data.placeholder" placeholder="占位内容"></el-input>
    </el-form-item>   
    <el-form-item label="填充字段">
      <el-input v-model="data.placeholder" placeholder="填充字段"></el-input>
    </el-form-item>
    <el-form-item label="填充字段格式">
      <el-input v-model="data.placeholder" placeholder="返回文本格式"></el-input>
    </el-form-item>
    <el-form-item label="后台返回字段">
      <el-input v-model="data.placeholder" placeholder="后台返回字段"></el-input>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
    <el-form-item label="是否子表">
      <el-switch v-model="data.subCrud"></el-switch>      
    </el-form-item>
    <el-form-item label="关联主表" v-show='data.subCrud'>
      <el-select v-model="data.crud" placeholder="选择表格">
        <el-option
              v-for="(item, index) in data.modelList"
              :label="item"
              :key="index"
              :value="item"
            >
            </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="支持翻页">
      <el-switch v-model="data.pageTurning"></el-switch>
    </el-form-item>
    <el-form-item label="每页记录数">
      <el-input v-model.lazy="data.pageSize" placeholder="每页记录数"></el-input>
      <el-select
        placeholder="每页记录数"
        v-model="data.pageSize"
        style="margin-top: 10px"
      >
        <el-option
          v-for="(item, index) in [10, 20, 30, 40, 50, 100]"
          :label="item"
          :value="item"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="绑定模型">
      <el-select
        placeholder="选择模型"
        v-model="data.model"
        clearable
        style="margin-top: 10px"
      >
        <el-option
          v-for="(item, index) in data.modelList"
          :label="item.tableRemark"
          :value="item"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  name: "config-crud",
  props: ["data"],
  components: { Draggable },
  data() {
    return {
      inputRules: "静态",
      modelList:{},
      model:{},
      modelId:null,
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
      subCrud:false,
      pageTurning:false,//支持翻页
      pageSize: 10, // 每页显示多少条
      currentPage: 1,
      pageSizes: [10, 20, 30, 40, 50, 100],
      option: {
        column: [
          {
            type: "input",
            prop: "key",
            label: "key",
          },
          {
            type: "input",
            prop: "value",
            label: "value",
          },
        ],
      },
      /*
      column01: {
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
      },*/
      props01: {
        label: "name",
        value: "id",
      },
    };
  },
  created(){
    console.log('created:'); 
  },
  mounted() {
    console.log('mounted-crud')
    window.$bus.$on('setModelList', (modelList) => {
      console.log('crud-modelData:'+JSON.stringify(modelList))
      this.$set(this.data,'modelList',modelList)
      this.$set(this.data,'model',null)
      this.$set(this.data,'modelId',null)
    })    
    //console.log('mounted-end')
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
    /*
    onLoad({ page, value,data }, callback){
        //首次加载去查询对应的值
        if (value) {
          //this.$message.success('首次查询'+value)
          callback({
            id: '0',
            name: '张三',
            sex: '男'
          })
          return
        }
        if(data){
          //this.$message.success('搜索查询参数'+JSON.stringify(data))
        }
        if(page){
         // this.$message.success('分页参数'+JSON.stringify(page))
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
      }*/
  },
  watch: {
    "data.required": function (val) {
      if (val){
        this.validator.req
        uired = {
          required: true,
          message: `请选择${this.data.label}`,
        };
      }else{ this.validator.required = null;}

      this.generateRule();
    },
    "data.model": function (model) {
      if(model==""){
        model={}
      }else{
        this.$set(this.data,'modelId',model.id)
      }
      model.itemId=this.data.prop.
      console.log('crud-model:'+JSON.stringify(model));    
      window.$bus.$emit('crduSetModel',model)
    }
  },
};
</script>
