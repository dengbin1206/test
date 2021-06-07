<template>
  <basic-container>
    <form-view :data="option" v-if="option.id"></form-view>
  </basic-container>
</template>
<script>
import formView from "@/components/formView/formView";
 export default {
   props:['id'],
   components:{
     formView
   },
   data(){
     return {
        option:{
          id:""
        }
     }
   },
   created() {
    //  if(!this.$route.params.id){
    //    this.$alert("没有选择id");
    //    return
    //  }
     this.option  = {
       id: this.$route.params.id ? this.$route.params.id : this.id
     }
   },
   methods:{}
 }
</script>
<style  scoped>

</style>
