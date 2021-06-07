<template>
    <div>
        <el-button type="primary"  @click="open"  size="small">表单配置权限对象</el-button>
        <dialogs ref="sonV"></dialogs>
    </div>
</template>
<script>
import dialogs from './formConfig2'
export default {
    components:{
        dialogs
    },
    data() {
        return {
            dialog:true,
            formId:'1326051094222729217',
            byType:'D'
        }
    },
    methods: {
        open(){
            this.$refs.sonV.open(this.dialog,this.formId,this.byType)
        },
    }
}
</script>
<style scoped lang='scss'>

</style>
