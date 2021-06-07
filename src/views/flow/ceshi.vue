<template>
   <basic-container>
       <el-form ref="form" :model="form" label-width="80px">
           <el-form-item label="活动名称">
              <el-input v-model="form.name" clearable></el-input>
           </el-form-item>
           <el-form-item label="即时配送">
              <el-input v-model="form.name" clearable></el-input>
           </el-form-item>
           <el-form-item label="即时配送">
              <el-input v-model="form.name" clearable></el-input>
           </el-form-item>
       </el-form>
   </basic-container>
</template>

<script>
export default {
      data(){
          return {
              form:{}
          }
      }
}
</script>

<style scoped  lang="scss">

</style>
