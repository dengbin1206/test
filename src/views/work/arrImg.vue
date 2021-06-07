<template>
    <el-dialog
            title="流程监控图"
            width="60%"
            :show-close="false"
            :visible.sync="imgLod"
            append-to-body
            :close-on-click-modal="false"
            >
            <div style="width:100%;height:auto">
                <img :src="'data:image/jpeg;base64,'+imgSrc" alt="" style="width:100%;">
            </div>
            <span slot="footer">
                <el-button
                size="mini"
                @click="imgLod = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
            </span>
        </el-dialog>
</template>
<script>
import { flowImage } from "@/api/work/todo";
export default {
    data () {
        return {
            imgSrc:'',
            imgLod:false
        }
    },
    methods: {
        open(omgLod,row) {
            this.imgSrc=''
            this.imgLod=omgLod
            var params={
                proInstId:row.proInstId
             }
            flowImage(params).then(res=>{
                if(res.data.code=='200'){
                    this.imgSrc=res.data.data
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        }
    },
}
</script>