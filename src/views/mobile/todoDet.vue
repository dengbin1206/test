<template>
    <el-container style="width:100%;height:100%;background: rgb(248, 248, 248);">
        <el-header>
            <el-row style="width:100%;height:100%">
                <el-col :span="3" style="text-align:center;font-size:20px;"><i class="el-icon-arrow-left" @click="htts"></i></el-col>
                <el-col :span="18" style="text-align:center;font-size:20px;"><i class="el-icon-s-home" @click="home"></i></el-col>
                <el-col :span="3" style="text-align:center;font-size:20px;"><i class="el-icon-more"></i></el-col>
            </el-row>
        </el-header>
        <el-main style="background:#fff">
            <el-row style="text-align:center;border-bottom:1px solid #ccc">
                <h3 style="margin:10px 0;">{{bookList.createUserName}} 发起的 {{bookList.flowName}}</h3>
            </el-row>
            <el-row style="width:100%;height:auto;" class="h3_style">
                <el-col style="border-bottom:1px solid #ccc;padding:0 10px"><h3 style="width:25%;display:inline-block">事务编号:</h3>{{bookList.instId}}</el-col>
                <el-col style="border-bottom:1px solid #ccc;padding:0 10px"><h3 style="width:25%;display:inline-block">事务标题:</h3>{{bookList.title}}</el-col>
                <el-col style="border-bottom:1px solid #ccc;padding:0 10px"><h3 style="width:25%;display:inline-block">申请部门:</h3>{{bookList.createDeptName}}</el-col>
                <el-col style="border-bottom:1px solid #ccc;padding:0 10px">
                    <h3 style="width:25%;display:inline-block">事务状态:</h3><el-tag type="warning" size="mini" v-if="bookList.status === 1">处理中</el-tag>
                            <el-tag type="success" size="mini" v-if="bookList.status === 2">已完成</el-tag>
                            <el-tag type="danger" size="mini" v-if="bookList.status === 3">已作废</el-tag>
                </el-col>
            </el-row>
            <div style="width:100%;height:auto;">
              <formdata v-if="formType=='M'" :dialog="visibles" :dataId="dataId" :formType="formType" :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :formId="formId" :routeName="routeName"></formdata>
              <customPage   v-if="formType=='S'" :flowNode='flowKey' :nodeAlias='nodeAlias' :dataId='dataId' :editFlag="editFlag"/>
            </div>
            <div class="block" style="padding:10px 10px 0 10px">
                <el-timeline>
                     <el-timeline-item  class="sx_item_stutes" :color='item.color' :icon='item.icon' v-for="(item,index) in activeList" :key="index">
                        <el-card class="sx_row_style" >
                            <el-row style="width:100%">
                                <el-col :span="16"><h3 style="margin:0">{{item.nodeName}}</h3></el-col>
                                <el-col :span="8">
                                    <el-tag type="success" v-if="item.status==1" style="float:right">同意</el-tag>
                                    <el-tag type="primary" v-else-if="item.status==2" style="float:right;">转办</el-tag>
                                    <el-tag type="info" v-else-if="item.status==3" style="float:right">回退</el-tag>
                                    <el-tag type="danger" v-else-if="item.status==4" style="float:right">拒绝</el-tag>
                                    <el-tag type="danger" v-else-if="item.status==5" style="float:right">作废</el-tag>
                                    <el-tag type="warning" v-else-if="item.status==''" style="float:right">待处理</el-tag>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24"><i class="el-icon-time" style="font-size:16px;margin-right:5px;"></i>{{item.startTime}} 到 {{item.assignTime}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24"><h3 style="margin:0;display:inline-block">{{item.userName}}:</h3>{{item.assignComment}}</el-col>
                            </el-row>
                            <el-row v-show="item.flowFileList.length>0">
                                <el-col :span="24">
                                    <p class="files" v-for="(file, index) in item.flowFileList" :key="index" @click="handlePreview(file)" style="color:#409eff;margin:5px 0;">
                                        <i class="el-icon-document" style="color:#409eff"></i>{{ file.fileName }}
                                    </p>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div class="sx_copy_style" v-show="copyList.length>0" style='margin-bottom:30px;'>
                <el-row class="sx_kp_style" v-for="(item,index) in copyList" style="margin-top:10px;background:#fff;" :key="index">
                        <el-col :span='24' style="padding-left:10px;height:32px;line-height:32px;border-bottom:1px solid #ccc"><h3 style="margin:0;display:inline-block;">{{item.createUserName}}</h3><h3 style="margin:0;display:inline-block;;margin:0 5px">抄送给</h3> <h3 style="margin:0;display:inline-block;">{{item.delegateUserName}}</h3></el-col>
                        <el-col :span='24' style="padding-left:10px;height:32px;line-height:32px;">留言:<span>{{item.memo}}</span></el-col>
                        <el-col :span='24' style="padding-left:10px;height:32px;line-height:32px;">回复:<span>{{item.reply}}</span></el-col>
                </el-row>
            </div>
            <div class="sx_copy_style" v-show="type==4">
                <el-row>
                  <el-col>回复意见:</el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      :rows="5"
                      style='margin-bottom:10px;margin-top:5px;'
                      placeholder="请输入回复意见"
                      v-model="hfValue">
                    </el-input>
                  </el-col>
                </el-row>
            </div>
        </el-main>
        <!-- 授权查看 -->
        <el-dialog
            title="授权"
            width="60%"
            :show-close="false"
            :visible.sync="accredit"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="24" style="text-align:left;line-height:32px;padding:0 10px 0 0"><div>授权用户:</div></el-col>
            </el-row>
            <el-row style="width:100%">
                <el-col :span="24">
                    <el-select
                        style="width:100%"
                        v-model="accreditDic"
                        multiple
                        filterable
                        remote
                        size="small"
                        reserve-keyword
                        popper-class="sx_flow_select"
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option style="height:25px"
                        v-for="item in accreditData"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                        <p style="margin:0px 10px">{{item.realName}}({{item.account}}) — {{item.deptName}}</p>
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                style="margin-right:5px"
                @click="accredit = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="accreditSub"
                >确 定</el-button
                >
            </span>
        </el-dialog>
        <el-footer style="height:50px">
            <el-row style="height:100%;width:100%;line-height:50px">
                            <el-button type="success" size="small" style="width:25%;margin-right:20px" @click="accredits"  v-show="type==2||type==3">授权查看</el-button>
                            <el-button type="warning" size="small" style="width:25%;margin-right:20px" @click="recaption" v-show="status==1&&type==2">取回</el-button>
                            <el-button type="danger " size="small" style="width:25%;margin-right:20px"  @click="cancell" v-show="status==1&&type==3">作废</el-button >
                            <el-button type="danger " size="small" style="width:25%;margin-right:20px"  @click="copySub" v-show="type==4">保存</el-button >
                    </el-row>
        </el-footer>
    </el-container>
</template>
<script>
import {
  historyInfo,
  completeTask,
  getBackNode,
  backToTask,
  stopTask,
  getUserInfoBySearch,
  copyTask,
  delegateTask,
  claimTask,
  updateInstCopy
} from "@/api/work/todo";
import { impowerProcess,retrieve,adminTask } from "@/api/work/work";
import { getToken } from "@/util/auth";
import fileUpload from "@/components/fileUpload";
import website from "@/config/website";
import formdata from "../work/formData/index"
import customPage from '../work/biz/customPage'
export default {
  components: {
    fileUpload,
    formdata,
    customPage
  },
  data() {
    return {
      nodeAlias:'',
      visibles:false,
      dataId:'',
      formType:'',
      formId:'',
      routeName:'',
      editFlag:false,
      flowKey:'',
      hfValue:'',
      proInstId: "",
      taskId: "",
      type: "",
      comment: "",
      bookList: {
        createUserName: "",
        flowName: "",
        instId: "",
        title: "",
        createDeptName: "",
        status: ""
      },
      activeList: [],
      copyList: [],
      backFlag: "",
      stopFlag: "",
      signForFlag: "",
      loading: false,
      taskName: "",
      actFiles: [],
      fileItem: [],
      accreditDic:'',
      accreditData:[],
      accredit:false,
      status:'',
      id:''
    };
  },
  methods: {
    getList() {
      var params = {
        proInstId: this.proInstId,
        taskId: this.taskId
      };
      historyInfo(params).then(res => {
        if (res.data.code == "200") {
          this.status=res.data.data.flowInstanceVo.status
          this.bookList = res.data.data.flowInstanceVo;
          this.activeList = res.data.data.flowActivityVOList;
          this.copyList = res.data.data.flowInstanceCopyList;
          this.signForFlag = res.data.data.signForFlag;
          this.backFlag = res.data.data.flowNodeVo.backFlag;
          this.actFiles = res.data.data.flowInstanceVo.actFiles;
          this.stopFlag = res.data.data.flowNodeVo.stopFlag;
          this.taskName = res.data.data.flowNodeVo.nodeName;
          this.dataId = res.data.data.flowInstanceVo.dataId;
          this.formType = res.data.data.flowInstanceVo.formType;
          this.formId = res.data.data.flowProcessForm.formId;
          this.editFlag = res.data.data.editFlag;
          this.routeName = res.data.data.flowProcessForm.routeName;
          this.flowKey=res.data.data.flowInstanceVo.flowKey
          this.nodeAlias=res.data.data.flowNodeVo.nodeAlias
          this.activeList.forEach(item => {
            if (item.startTime != "") {
              item.startTime = item.startTime.slice(2, 16);
            }
            if (item.assignTime != "") {
              item.assignTime = item.assignTime.slice(2, 16);
            }
            if (item.status == 1) {
              item.icon = "el-icon-check";
              item.color = "#67c23a";
            } else if (item.status == 2) {
              item.icon = "el-icon-refresh";
              item.color = "rgb(64, 158, 255)";
            } else if (item.status == 3) {
              item.icon = "el-icon-refresh-right";
              item.color = "rgb(144, 147, 153)";
            } else if (item.status == 4) {
              item.icon = "el-icon-close";
              item.color = "#F56C6C";
            } else if (item.status == 5) {
              item.icon = "el-icon-folder-delete";
              item.color = "#F56C6C";
            } else if (item.status == "") {
              item.icon = "el-icon-edit-outline";
              item.color = "#E6A23C";
            }
            this.visibles=true
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    home() {
      this.$router.push("/mobile/index");
    },
    htts() {
      if (this.type == 1) {
        this.$router.push("/mobile/backlog");
      } else if (this.type == 2) {
        this.$router.push("/mobile/done");
      } else if (this.type == 3) {
        this.$router.push("/mobile/affair");
      } else if (this.type == 4) {
        this.$router.push("/mobile/copy");
      }
    },
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&affixId=${file.fileId || ""}`
      );
    },
    //授权查看
    accredits(){
      this.accreditDic=''
      this.accreditData=[]
      this.accredit=true
    },
    remoteMethod(query){
        if(query!=''){
            var params={
               search:query
            }
            this.loading=true
            setTimeout(() => {
              this.loading = false;
              getUserInfoBySearch(params).then(res=>{
                    this.accreditData=res.data.data
              })
          }, 200);
        }else{
            this.accreditData=[]
        }
    },
    //授权查看确定
    accreditSub(){
      impowerProcess(this.proInstId,this.accreditDic).then(res=>{
        if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.accredit=false
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
      })
    },
    //取回
    recaption(){
      var params={
        proInstId:this.proInstId
      }
      this.$confirm('确认取回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          retrieve(params).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                type: 'success',
                message: '取回成功!'
              });
              this.getList()
            }else{
              this.$message.error(res.data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消取回'
          });
        });
    },
    //作废
    cancell(){
        var params={
            proInstId:this.proInstId
        }
         this.$confirm('确定是否作废', '提示', {
          confirmButtonText: '确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          adminTask(params).then(res=>{
                  if(res.data.code=='200'){
                       this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.getList()
                  }else{
                      this.$message.error(res.data.msg)
                  }
              })
        }).catch(()=>{
          this.$message({
                        type: 'warning',
                        message: '取消作废'
                    });
        })
    },
    //保存
    copySub(){
      updateInstCopy(this.id,this.hfValue).then(res=>{
        if(res.data.code=='200'){
                  this.$message({
                          message: '抄送回复成功',
                          type: 'success'
                      });
                  this.hfValue=''
                  this.getList()
                }else{
                  this.$message.error('抄送回复失败');
                }
      })
    }
  },
  created() {
    if(this.$route.query.type==4){
      this.id=this.$route.query.id
    }
    this.proInstId = this.$route.query.proInstId;
    this.taskId = this.$route.query.taskId;
    this.type = this.$route.query.type;
    this.getList();
  }
};
</script>
<style scoped>
  @import "../../styles/mobile/todoDet.css";
</style>
