<template>
  <div>
    <el-select v-model="selectModel" :placeholder="config.placeholder" style="width:100%" :size="config.size"
               clearable @visible-change="findData($event)" @change="selectChange">
      <el-option v-for="item in findList" :key="item[optionMapping.value]"
        :label="item[optionMapping.label]"
        :value="item[optionMapping.value]">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import {dynamicSelect} from "@/api/components/select";

  export default {
    name: "selectWithFull.vue",
    props:[
      "config",
      "formData",
    ],
    components: {
    },
    data() {
      return {
        selectModel: this.config.initValue,
        findList: [],
        selectData:{},
        parentFormData:this.formData,
        optionMapping:{label:this.config.label,value:this.config.value},
        params :{ findField: this.config.findField,
          searchField:this.config.searchField,
          modelName:this.config.modelName,
          findType:this.config.findType,//F表单，M模型，S自定义
          size:10,
          search:""
        }
      }
    },
    methods: {
      findData: function (callback) {
        if (callback) {
          let that = this;
          dynamicSelect(this.config.url,this.params).then((res) => {
            if (res.data.data.records.length > 0) {
              that.findList = res.data.data.records;
            }
          });
        }
      },
      selectChange(data){
        for(let d in this.findList){
          if(this.findList[d][this.optionMapping.value]==data){
            this.selectData = this.findList[d];
            break;
          }
        }
        if(!this.selectData){
          return;
        }
        // 处理表单中组件自身字段
        this.parentFormData[this.config.name]=this.selectData[this.config.value];
        // 处理表单中其他字段
        if(this.config.fullField){
          for(let index in this.config.fullField){
              let field = this.config.fullField[index];
              for(let key in field){
                this.parentFormData[key]=this.selectData[field[key]];
              }
          }
        }
        //console.log("selectData=",this.selectData);
        //this.$emit('refreshList',this.selectData);
      }
    }
  }
</script>

<style scoped>

</style>
