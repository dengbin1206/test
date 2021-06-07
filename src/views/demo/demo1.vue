<template>
  <div>
    <h1>Hello Noah</h1>
    <el-row>
      <el-button type="primary" @click="showData">显示ww数1据</el-button>
    </el-row>
    <!--<selectWithFull :fieldList="fieldList" @refreshList="getDate"></selectWithFull>-->
    <el-alert title="下拉自动带出" type="error" :closable="false"> </el-alert>
    <selectSearchWithFull :config="selectWithFullConfig" :formData.sync="testData" ></selectSearchWithFull>
    <el-input v-model="testData.name0" placeholder="请输入内容0"></el-input>
    <el-input v-model="testData.name1" placeholder="请输入内容1"></el-input>
    <el-input v-model="testData.name2" placeholder="请输入内容2"></el-input>
    <el-input v-model="testData.name3" placeholder="请输入内容3"></el-input>
    <el-input v-model="testData.name4" placeholder="请输入内容3"></el-input>
    <!--<selectWithFull :selectWithFull="selectWithFull1" :formData.sync="testData" ></selectWithFull>-->
    <el-input v-model="testData.name5" placeholder="请输入内容3"></el-input>
  </div>
</template>

<script>
  import selectSearchWithFull from "@/components/selectSearchWithFull";

  export default {
    name: "demo1",
    data(){
      return {
        testData:{
          name0:"",
          name1:"",
          name2:"",
          name3:"",
          name4:"",
          name5:""
        },
        selectWithFullConfig:{
          placeholder:"请输入设备编号",
          size:"small",
          // 组件自身name字段名
          name:"name",
          // 查询的模型名
          modelName:"SBJC",
          searchField:["SBJC#equipNum"],
          // 查询的字段名
          findField:["SBJC#id","SBJC#equipNum","SBJC#equipName","SBJC#modelNum","SBJC#installPosition"],
          // select的label字段名
          label:"SBJC#equipNum",
          // select的value字段名
          value:"SBJC#id",
          // 填充字段名映射
          fullField:[{name1:"SBJC#id"},{name2:"SBJC#equipName"},{name3:"SBJC#modelNum"},{name4:"SBJC#installPosition"}],
          // 查询类型
          findType:"S",
          initValue:'123'
        },
        /*selectWithFull1:{
          // 组件自身name字段名
          name:"name5",
          // 查询的模型名
          modelName:"model_user",
          // 查询的字段名
          findField:["field1","field2","field3","field4"],
          // select的label字段名
          label:"field3",
          // select的value字段名
          value:"field4",
          // 填充字段名映射
          fullField:[{name5:"field4"}]
        }*/
      }
    },
    components: {
      selectSearchWithFull
    },
    methods:{
      showData(){
        let key = "6555333sum(a)99";
        let temp ="SUM\\(a\\)";
        let temp1 =new RegExp(temp,"ig");
        //let str = key.replace(/SUM\(a\)/gi,2);
        let str = key.replace(temp1,2);
        console.log(str);
      }
    }
  }
</script>
<style scoped>
</style>

