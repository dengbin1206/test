<template>
  <basic-container>
        <el-upload
        :disabled="disabled"
        class="sx_upload"
        :http-request="uploadAction"
        :action="upLoadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        :on-success="uploadSuccessFile"
        list-type="picture"
        :file-list="fileList"
        >
        <el-button size="small" type="primary" :style="isShow(disabled)"  :disabled="disabled">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip"></div> -->
        </el-upload>
  </basic-container>
</template>
<script>
import website from '@/config/website';
import {getToken} from '@/util/auth';
import {
  asyncUploadAction,
   uploadList
} from "@/api/tool/dynamic";
  export default {
    props:["modelName","fieldName","data","mainId","disabled","prop","display"],
    data() {
      return {
        fileList: [],
        dataList:this.data,
        upLoadUrl:"/api/blade-resource/affix/asyncUpload",
        // uploadData:{
        //     dataSrcId:this.modelName,
        //     affixType:this.fieldName,
        //     file:""
        // }
      };
    },
    watch:{
        dataList:{
          handler(val){
              this.$emit('update:data',val)
          },
          deep:true
        },
    },
    mounted(){
        if(this.mainId){
             this.init();
        }
        if(this.disabled){
      this.$nextTick(() => {
      let uploadList =  document.querySelectorAll('.sx_upload .el-upload-list');
      uploadList.forEach(ele=>{
         ele.style.marginTop = "-40px"
      })
         });
    }
    },
    methods: {
        init(){
                let obj = {
                    dataId:this.mainId,
                    dataSrcId:this.modelName,
                    affixType:this.fieldName
                }
                this.fileList = [];
                this.dataList = []
                uploadList(obj).then(res=>{
                  if(res.data.data.length > 0 ){
                    res.data.data.forEach(ele=>{
                      this.fileList.push({
                        name:ele.originalFileName,
                        fileId:ele.id,
                        affixType:ele.affixType,
                        dataSrcId:ele.dataSrcId,
                        dataId:this.mainId,
                        isEdit:1,
                        url:`/api/blade-resource/affix/singleDownload?${this.website.tokenHeader}=${getToken()}&dataId=${this.mainId}&affixId=${ele.id}&dataSrcId=${ele.dataSrcId}&affixType=${ele.affixType}`
                      })
                      this.dataList.push({
                     fileId:ele.id,
                     isDel:0
                     })
                    })
                  }
             })
        },
      handleRemove(file, fileList) {
         this.dataList.forEach(ele=>{
          if(file.isEdit == 1) {
             if(ele.fileId == file.fileId){
                ele.isDel = 1;
            }
          }else{
             if(ele.fileId == file.raw.fileId){
                ele.isDel = 1;
            }
          }
        })
      },
     handlePreview(file) {
       window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${
          file.fileId || file.raw.fileId
        }&dataSrcId=${file.dataSrcId || ""}&affixType=${file.affixType || ""}`
      );
      //  if(this.disabled == true ){
      //   return false;
      // }else{
      //    window.open(
      //   `/api/blade-resource/affix/singleDownload?${
      //     this.website.tokenHeader
      //   }=${getToken()}&dataId=${file.dataId || ""}&affixId=${
      //     file.fileId || file.raw.fileId
      //   }&dataSrcId=${file.dataSrcId || ""}&affixType=${file.affixType || ""}`
      // );
      // }
        // window.open(`/api/blade-resource/affix/singleDownload?${this.website.tokenHeader}=${getToken()}&dataId=${file.dataId}&affixId=${file.fileId}&dataSrcId=${file.dataSrcId}&affixType=${file.affixType}`)
      },
      beforeRemove(file, fileList) {
      if(file.size/1024/1024 <30 || file.dataId) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },
    beforeUpload(file){
      this.loading = true;
        const imgSize = file.size/1024/1024 < 30;
        if(!imgSize){
          this.loading = false;
          this.$message.error('上传图片大小不能超过 30MB!');
        }
         return imgSize;
    },
    uploadSuccessFile(response, file, fileList) {
        console.log(response)
    },
    uploadAction(param){
        let  fileObj = param.file;
        let  form = new FormData();
        form.append("file", fileObj);
        form.append("dataSrcId", this.modelName);
        form.append("affixType", this.fieldName);
        asyncUploadAction(form).then(res=>{
             if(res.data.code == 200){
                 this.$message.success("上传成功")
                 this.dataList.push({
                     fileId:res.data.data.id,
                     isDel:0
                 })
                 param.file.fileId = res.data.data.id;
             }else{
               this.$message.error(res.data.msg)
             }
         }).catch((err)=>{
           param.onError(err)
         })
    },
    isShow(type){
      if(type == true){

        return "display:none";
      }
    }
    }
  }
</script>

<style>

</style>
