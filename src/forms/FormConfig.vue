<template>
  <div class="form-config-container">
    <el-form label-position="left" label-suffix="：" label-width="130px" size="small">
      <el-form-item label="模型">
        <el-select v-model="data.model" placeholder="请输入"   filterable remote :remote-method="searchModel" @change="selectModel" clearable>
          <el-option
            v-for="item in data.modelIdData"
            :key="item.id"
            :label="item.tableRemark"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签对齐方式">
        <el-select v-model="data.labelPosition" placeholder="标签对齐方式">
          <el-option label="左对齐" value="left"></el-option>
          <el-option label="右对齐" value="right"></el-option>
          <el-option label="顶部对齐" value="top"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签宽度">
        <el-input-number
          v-model="data.labelWidth"
          :min="100"
          :max="200"
          :step="10"
          controls-position="right"
          placeholder="标签宽度"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="标签后缀">
        <el-input v-model="data.labelSuffix" placeholder="标签后缀"></el-input>
      </el-form-item>
      <el-form-item label="项之间的间隔">
        <el-input-number
          v-model="data.gutter"
          :min="0"
          :max="60"
          :step="5"
          controls-position="right"
          placeholder="项之间的间隔"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="移动端表单">
        <el-switch v-model="data.isMobile" :active-value="1" :inactive-value="0" active-color="#409EFF"></el-switch>
      </el-form-item>
      <el-form-item label="多分组转标签">
        <el-switch v-model="data.tabs" active-value="1" inactive-value="0" active-color="#409EFF"></el-switch>
      </el-form-item>
      <el-form-item label="详情模式">
        <el-switch v-model="data.detail" :active-value="1" :inactive-value="0"></el-switch>
        <!-- <el-switch v-model="data.detail" ></el-switch> -->
      </el-form-item>
      <!-- <el-form-item label="标签样式"
                    v-if="data.tabs">
        <el-select v-model="data.tabsType">
          <el-option label="基础"
                     value=""></el-option>
          <el-option label="卡片"
                     value="card"></el-option>
          <el-option label="卡片2"
                     value="border-card"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="显示按钮">
        <el-switch v-model="data.menuBtn" :active-value="1" :inactive-value="0"  active-color="#409EFF"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="按钮位置"
                    v-if="data.menuBtn">
        <el-select v-model="data.menuPostion"
                   placeholder="按钮位置">
          <el-option label="居左"
                     value="left"></el-option>
          <el-option label="居中"
                     value="center"></el-option>
          <el-option label="居右"
                     value="right"></el-option>
        </el-select>
      </el-form-item>-->
      <!-- <el-form-item label="提交按钮的大小"
                    v-if="data.menuBtn && data.submitBtn">
        <el-select v-model="data.submitSize"
                   placeholder="提交按钮的大小">
          <el-option label="正常"
                     value="medium"></el-option>
          <el-option label="小"
                     value="small"></el-option>
          <el-option label="超小"
                     value="mini"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="显示提交按钮" v-if="data.menuBtn">
        <el-switch v-model="data.submitBtn" :active-value="1" :inactive-value="0" active-color="#409EFF"></el-switch>
      </el-form-item>
      
      <el-form-item label="提交按钮的文字" v-if="data.menuBtn && data.submitBtn">
        <el-input v-model="data.submitText" placeholder="提交按钮的文字"></el-input>
      </el-form-item>
      <!-- true false 需要在保存的时候  处理成 0 ，1 -->
      <el-form-item label="显示清空按钮" v-if="data.menuBtn">
        <el-switch v-model="data.emptyBtn" :active-value="1" :inactive-value="0" active-color="#409EFF"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="清空按钮的大小"
                    v-if="data.menuBtn && data.emptyBtn">
        <el-select v-model="data.emptySize"
                   placeholder="提交按钮的大小">
          <el-option label="正常"
                     value="medium"></el-option>
          <el-option label="小"
                     value="small"></el-option>
          <el-option label="超小"
                     value="mini"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="清空按钮的文字" v-if="data.menuBtn && data.emptyBtn">
        <el-input v-model="data.emptyText" placeholder="清空按钮的文字"></el-input>
      </el-form-item>
      <el-form-item label="全局只读">
        <!-- <el-switch v-model="data.readonly" :active-value="false" :inactive-value="true"></el-switch> -->
        <el-switch v-model="data.readonly" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="全局禁用">
        <!-- <el-switch v-model="data.disabled" :active-value="false" :inactive-value="true"></el-switch> -->
        <el-switch v-model="data.disabled" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="全局栅格">
        <el-input v-model="data.span"
                  placeholder="全局栅格"></el-input>
      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
import {findTableNameBySearch,findFieldsById} from "@/api/tool/form";
export default {
  name: "form-config",
  props: ["data","select"],
  data(){
    return{
         selectWidget: this.select,
         loading:false,
         model:null,
         options:[]
    }
  },
  methods:{
    //模型搜索
    searchModel(query){
        if (query !== '') {
          this.loading = true;
          findTableNameBySearch(query).then(res=>{
            this.$set(this.data,'modelIdData',res.data.data)
            /*
            let modelList = []
            modelList.push(res.data.data)
            window.$bus.$emit('setModelList',res.data.data)
            */
          })
        }else{
            this.data.modelIdData = [];
        }
    },
    //选中模型
    selectModel(item){
      console.log("selectModel:"+item);
      let modelList = []
      modelList.push(item)
      window.$bus.$emit('setModelList',modelList)
      this.data.modelId=item.id
      findFieldsById(this.data.modelId).then(res=>{
        let arr = []
        let arrId = []
        res.data.data.forEach(ele=>{
            arr.push({id:ele.id,fieldName:ele.fieldName,fieldRemark:ele.fieldRemark,combinationName:ele.combinationName})
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
      })
    }
  },
  watch: {
    "data.modelData": function (val) {
      if (val){
        console.log('watch-modelData:'+JSON.stringify(val))        
      }      
    },
  },
};
</script>
<style lang="scss" scoped>
    .form-config-container .el-form .el-select ,.form-config-container .el-form .el-input-number{
      width: 100%;
    }
</style>
