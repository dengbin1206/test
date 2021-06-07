<template>
    <fullScreenDialog
            ref="dialog"
            :visible.sync="diaVisible"
             v-if='diaVisible'
            dialogTitle="流程环节"
            >
            <slot slot="toolBar">
                <el-button size="mini" type="info" icon="el-icon-printer"></el-button>
                <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-close"
                @click="diaVisible = false"
                >关 闭</el-button
                >
            </slot>
        <div class="content">
            <div class="top">
            <table class="gridtable">
                <tr>
                <td>事务编号:</td>
                <td>{{ BasicInfo.instId }}</td>
                <td>流程名称:</td>
                <td>{{ BasicInfo.flowName }}</td>
                <td>事务标题:</td>
                <td>{{ BasicInfo.title }}</td>
                <td>事务状态:</td>
                <td>
                    <el-tag type="warning" v-if="BasicInfo.status === 1"
                    >处理中</el-tag
                    >
                    <el-tag type="success" v-if="BasicInfo.status === 2"
                    >已完成</el-tag
                    >
                    <el-tag type="danger" v-if="BasicInfo.status === 3"
                    >已作废</el-tag
                    >
                </td>
                </tr>
                <tr>
                <td>申请人员:</td>
                <td>{{ BasicInfo.userName }}</td>
                <td>申请部门:</td>
                <td>{{ BasicInfo.deptName }}</td>
                <td>申请公司:</td>
                <td>{{ BasicInfo.companyName }}</td>
                <td>申请时间:</td>
                <td>{{ BasicInfo.createTime }}</td>
                </tr>
            </table>
            </div>
            <div class="middle">
            <el-tabs type="border-card">
                <el-tab-pane label="表单数据">
                <div class="form" style="height:100%;overflow-y:auto">
                  <sxForm v-if="formType=='M' || formType=='F'" :params="formParams"></sxForm>
                  <customPage  v-if="formType=='S'" :flowNode='flowKey' :nodeAlias='nodeAlias' :dataId='dataId' :editFlag="editFlag"  :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='5'></customPage>
                </div>
                </el-tab-pane>
            </el-tabs>
            </div>
            <div class="bottom">
            <el-tabs type="border-card">
                <el-tab-pane label="审批意见">
                <div class="process">
                    <table
                    class="gridtable"
                    style="margin-top: 5px"
                    v-for="(item, index) in flowActivityVOList"
                    :key="index"
                    >
                    <tr>
                        <td rowspan="3">{{ item.nodeName }}</td>
                        <td colspan="8" style="text-align: left;height:25px">
                        {{ item.assignComment }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" v-if="item.flowFileList.length !== 0">
                        <div class="file_list">
                            <li class="files" v-for="(file, index) in item.flowFileList" :key="index" @click="handlePreview(file)" style="color:#409eff">
                                <i class="el-icon-document" style="color:#409eff"></i>
                                    {{ file.fileName }}
                            </li>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:5%">处理人:</td>
                        <td style="width:20%">{{ item.userName }}</td>
                        <td style="width:10%">环节开始时间:</td>
                        <td style="width:15%">{{ item.startTime }}</td>
                        <td style="width:10%">环节处理时间:</td>
                        <td style="width:15%">{{ item.assignTime }}</td>
                        <td style="width:5%">处理状态:</td>
                        <td style="width:15%">
                        <el-tag type="success" v-if="item.status==1">同意</el-tag>
                        <el-tag type="primary" v-else-if="item.status==2">转办</el-tag>
                        <el-tag type="info" v-else-if="item.status==3">回退</el-tag>
                        <el-tag type="danger" v-else-if="item.status==4">拒绝</el-tag>
                        <el-tag type="danger" v-else-if="item.status==5">作废</el-tag>
                        <el-tag type="warning" v-else-if="item.status==''">待处理</el-tag>
                        </td>
                    </tr>
                    </table>
                </div>
                </el-tab-pane>
            </el-tabs>
            </div>

            <div class="copyInfo" v-show="this.flowInstanceCopyList.length>0">
            <el-tabs type="border-card">
                <el-tab-pane label="抄送信息">
                <table
                    class="gridtable"
                    style="margin-top: 5px"
                    v-for="(item, index) in flowInstanceCopyList"
                    :key="index"
                    >
                    <tr>
                        <td rowspan="4">{{ item.taskName }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="text-align:center;">留言</td>
                        <td colspan="20" style="text-align:left;">{{ item.memo }}</td>
                    </tr>
                        <td colspan="1" style="text-align:center;">回复</td>
                        <td colspan="20" style="text-align:left;">{{ item.reply }}</td>
                    <tr>
                        <td style="width:5%">被抄送人:</td>
                        <td style="width:20%">{{ item.delegateUserName }}</td>
                        <td style="width:10%">抄送人:</td>
                        <td style="width:15%">{{ item.createUserName }}</td>
                        <td style="width:10%">抄送时间:</td>
                        <td style="width:15%">{{ item.createTime }}</td>
                        <td style="width:5%">抄送状态:</td>
                        <td style="width:15%">
                        <el-tag type="danger" v-if="item.readStatus==0">未读</el-tag>
                        <el-tag type="success" v-else-if="item.readStatus==1">已读</el-tag>
                        </td>
                    </tr>
                    </table>
                </el-tab-pane>
            </el-tabs>
            </div>
            <div class="comment" v-show="copyShow==1||copyShow==2">
            <table class="gridtable">
                <tr>
                <td>{{title}}:</td>
                <td>
                    <el-input
                    type="textarea"
                    :rows="5"
                    clearable
                    placeholder='请输入'
                    v-model="comment"
                    >
                    </el-input>
                </td>
                </tr>
            </table>
            </div>
        </div>
        <slot slot="footerBar">
                <el-button
                v-show="copyShow==1||copyShow==2"
                size="small"
                @click="diaVisible = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="small" icon="el-icon-circle-check" @click="copySub"  v-show="copyShow==1||copyShow==2"
                >保 存</el-button
                >
            </slot>
        </fullScreenDialog>
</template>
<script>
import {historyInfo,updateInstCopy,updateInstCopys} from "@/api/work/todo";
import fileUpload from "@/components/fileUpload";
import { getToken } from "@/util/auth";
import website from "@/config/website";
import modelAnalysis from "@/views/modelAnalysis/modelForm"
import customPage from './biz/customPage'
import formTranslate from "@/views/formTranslate/index"
import sxForm from "@/views/modelAnalysis/sxForm"
export default {
    components:{
      fileUpload,
      modelAnalysis,
      customPage,
      formTranslate,
      sxForm
    },
    data () {
        return {
            nodeAlias:'',
            flowKey:'',
            dataId:'',
            formType:'',
            formId:'',
            proDefId:'',
            nodeCode:'',
            functionId:'',
            editFlag:false,
            formParams: {},
            routeName:'',
            diaVisible:false,
            BasicInfo:{},
            flowActivityVOList:[],
            flowInstanceCopyList:[],
            comment:'',
            fileItem:[],
            proInstId:'',
            taskId:'',
            copyShow:'',
            title:'',
            id:''
        }
    },
    methods: {
        confirmProcess(dialog,row,copyShow,title) {
          console.log(row)
            this.proInstId=row.proInstId
            this.copyShow=copyShow
            this.title=title
            this.id=row.id
            var params={
                proInstId:this.proInstId,
                taskId:this.taskId
            }
            historyInfo(params).then(res=>{
                this.BasicInfo = res.data.data.flowInstanceVo;
                this.flowActivityVOList=res.data.data.flowActivityVOList
                this.flowInstanceCopyList=res.data.data.flowInstanceCopyList
                this.dataId = res.data.data.flowInstanceVo.dataId;
                this.formType = res.data.data.flowProcessForm.formType;
                this.formId = res.data.data.flowProcessForm.formId;
                this.proDefId  = res.data.data.flowInstanceVo.proDefId;
                this.nodeCode = res.data.data.flowNodeVo.nodeCode;
                this.functionId=res.data.data.flowInstanceVo.functionId;
                this.editFlag = res.data.data.editFlag;
                this.routeName = res.data.data.flowProcessForm.routeName;
                this.flowKey=res.data.data.flowInstanceVo.flowKey
                this.nodeAlias=res.data.data.flowNodeVo.nodeAlias
                if(this.formType == "M"){
                  this.formParams = {
                    actionType: this.editFlag ? 'edit' : 'view',
                    formType: this.formType,
                    mainModelId: this.formId,
                    dataId: this.dataId,
                    functionId: this.functionId,
                    proDefId: this.proDefId,
                    nodeCode: this.nodeCode,
                  }
                } else if(this.formType == "F"){
                  this.formParams = {
                    actionType: this.editFlag ? 'edit' : 'view',
                    formType: this.formType,
                    formId: this.formId,
                    dataId: this.dataId,
                    functionId: this.functionId,
                    proDefId: this.proDefId,
                    nodeCode: this.nodeCode,
                  }
                }
                this.diaVisible=true
            });
        },
        handlePreview(file) {
           window.open(
                `/api/blade-resource/affix/singleDownload?${
                this.website.tokenHeader
                }=${getToken()}&affixId=${file.fileId || ""}`
            );
        },
        copySub(){
          if(this.copyShow==1){
            updateInstCopy(this.id,this.comment).then(res=>{
                if(res.data.code=='200'){
                  this.$message({
                          message: res.data.msg,
                          type: 'success'
                      });
                      this.diaVisible=false
                      this.id=''
                      this.comment=''
                      this.proInstId=''
                      this.taskId=''
                      this.copyShow=''
                      this.title=''
                      this.dataId = ''
                      this.formType = ''
                      this.formId = ''
                      this.routeName = ''
                      this.formParams = {}
                }else{
                  this.$message.error(res.data.msg);
                }
              })
          }else if(this.copyShow==2){
            updateInstCopys(this.id,this.comment,1).then(res=>{
                if(res.data.code=='200'){
                  this.$message({
                          message: res.data.msg,
                          type: 'success'
                      });
                      this.diaVisible=false
                      this.id=''
                      this.comment=''
                      this.proInstId=''
                      this.taskId=''
                      this.copyShow=''
                      this.title=''
                      this.dataId = ''
                      this.formType = ''
                      this.formId = ''
                      this.routeName = ''
                      this.formParams = {}
                }else{
                  this.$message.error(res.data.msg);
                }
              })
          }
        }
    },
}
</script>
<style lang="scss" scoped>
.searchBox {
  width: 100%;
}

@mixin tableStyle {
  table.gridtable {
    width: 100%;
    font-family: verdana, arial, sans-serif;
    font-size: 12px;
    color: #60626d;
    border-width: 1px;
    border-color: #ebeef5;
    border-collapse: collapse;
  }
  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    width: 100px;
    text-align: center;
    border-style: solid;
    border-color: #ebeef5;
    background-color: #ffffff;
  }

  table.gridtable td:nth-of-type(even) {
    width: 400px;
  }

  table.gridtable .file_list li {
    list-style: none !important;
    text-align: left;
    margin-top: 2px;

    a {
      color: #0079fe;
    }
  }
}

.top {
  border: 1px dashed #ccc;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  @include tableStyle;
}

.middle {
  margin-top: 10px;
}

.bottom {
  margin-top: 10px;
  .process {
    @include tableStyle;
  }
}

.copyInfo {
  margin-top: 10px;
  @include tableStyle;
}

.comment {
  @extend .top;
  margin-top: 10px;
  table.gridtable td:nth-of-type(odd) {
    width: 100px !important;
  }
}
</style>
