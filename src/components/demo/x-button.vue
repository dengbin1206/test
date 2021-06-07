<template>
  <div> <el-button type="primary" @click="handleSubmit">按钮点击</el-button> </div>
</template>

<script>
  import {getDetail} from '@/api/demo/demo';

  export default {
        name: "x-button",
        methods:{
            handleSubmit(){
              console.log("按钮点击了")
              getDetail().then(res=>{
                console.log(res)
              });
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
