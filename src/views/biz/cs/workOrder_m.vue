<template>
    <el-container style="background:rgb(249, 249, 249);width:100%;height:100%">
        <el-main>
            <div style="width:100%;height:auto;text-align:center;background:#fff;padding-bottom:15px;">
                <el-row>
                    <el-col :span="8">
                        <p style="color:#ccc;margin:8px 0 5px 0">工单号</p>
                        <p style="margin:0;font-size:13px;">{{addList.oddNum}}</p>
                    </el-col>
                    <el-col :span="8">
                        <p style="color:#ccc;margin:8px 0 5px 0">合同号</p>
                        <p style="margin:0;font-size:13px;">{{addList.paperContractNo}}</p>
                    </el-col>
                    <el-col :span="8">
                        <p style="color:#ccc;margin:8px 0 5px 0">服务类型</p>
                        <p style="margin:0;font-size:13px;" v-if="addList.serviceType=='0'">质量反馈</p>
                        <p style="margin:0;font-size:13px;" v-if="addList.serviceType=='1'">调试申请</p>
                        <p style="margin:0;font-size:13px;" v-if="addList.serviceType=='2'">维保申请</p>
                        <p style="margin:0;font-size:13px;" v-if="addList.serviceType=='3'">安装申请</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <p style="color:#ccc;margin:8px 0 5px 0">联系人</p>
                        <p style="margin:0;font-size:13px;">{{addList.contactPersonName}}</p>
                    </el-col>
                    <el-col :span="8">
                        <p style="color:#ccc;margin:8px 0 5px 0">联系电话</p>
                        <p style="margin:0;font-size:13px;">{{addList.telephone}}</p>
                    </el-col>
                    <el-col :span="8">
                        <p style="color:#ccc;margin:8px 0 5px 0">负责员工</p>
                        <p style="margin:0;font-size:13px;">{{addList.chargeStaffName}}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <p style="color:#ccc;margin:8px 0 5px 0">客户名称</p>
                        <p style="margin:0;font-size:13px;">{{addList.clientName}}</p>
                    </el-col>
                </el-row>
            </div>
            <div class="sx_tabs">
                <el-row class="sx_row">
                    <el-col :span="8"><el-button type="text" class='btn1 btn2' @click="getTabs('aqpx',0)"><span>1</span>安全培训</el-button></el-col>
                    <el-col :span="8"><el-button type="text" class="btn1" @click="getTabs('qdhw',1)"><span>2</span>清单货物</el-button></el-col>
                    <el-col :span="8"><el-button type="text" class="btn1" @click="getTabs('fwrw',2)"><span>3</span>服务任务</el-button></el-col>
                    <el-col :span="8"><el-button type="text" class="btn1" @click="getTabs('gzrz',3)"><span>4</span>工作日志</el-button></el-col>
                    <el-col :span="8"><el-button type="text" class="btn1" @click="getTabs('khqr',4)"><span>5</span>客户确认</el-button></el-col>
                    <el-col :span="8"><el-button type="text" class="btn1" @click="getTabs('jbxx',5)"><span>6</span>基本信息</el-button></el-col>
                </el-row>
            </div>
            <div style="margin-top:20px;padding:0px;font-size:13px;">
                    <div v-show="aqpx">
                        <van-radio-group v-model="addList.securityTrain"  direction="horizontal">
                                <van-radio name="1" shape="square">已合格</van-radio>
                                <van-radio name="2" shape="square">未培训</van-radio>
                            </van-radio-group>
                            <el-row style="margin-top:15px;">
                                <el-col :span="7" style="line-height:32px">上传培训成绩:</el-col>
                                <el-col :span="17">
                                    <el-upload
                                    class="upload-demo"
                                    action="aaa"
                                    :http-request="uploadAction"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-remove="beforeRemove"
                                    :before-upload="beforeUpload"
                                    :on-success="uploadSuccessFile"
                                    :file-list="fileList"
                                    >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip"></div>
                                    </el-upload>
                                </el-col>
                            </el-row>
                    </div>
                    <div v-show="qdhw">
                        <van-radio-group v-model="addList.goodsForm"  direction="horizontal">
                                <van-radio name="1" shape="square">完整且无损坏</van-radio>
                                <van-radio name="2" shape="square">缺件</van-radio>
                            </van-radio-group>
                            <el-input type="textarea" rows="4"  placeholder="缺件描述" v-model="addList.missRemark"  maxlength="100"  show-word-limit style="margin-top:10px;"></el-input>
                            <el-row style="margin-top:15px;">
                                <el-col :span="7" style="line-height:32px">上传货物图片:</el-col>
                                <el-col :span="17">
                                    <el-upload
                                    class="upload-demo"
                                    action="aaa"
                                    :http-request="uploadAction1"
                                    :on-preview="handlePreview1"
                                    :on-remove="handleRemove1"
                                    :before-remove="beforeRemove1"
                                    :before-upload="beforeUpload1"
                                    :on-success="uploadSuccessFile1"
                                    :file-list="fileList1"
                                    >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip"></div>
                                    </el-upload>
                                </el-col>
                            </el-row>
                            <el-row style="margin-top:10px;">
                                <el-button size="small" style="width:100%;margin-bottom:20px;" @click="showPopup">缺少部件的通知</el-button>
                            </el-row>
                            <van-popup v-model="popupDia" round close-icon="close" closeable position="bottom" :style="{ height: '30%' }">
                                <el-row style="margin-top:50px;padding:0 15px;">
                                    <el-col :span='20'>
                                        <el-select size="small" v-model="addList.chargeStaff" multiple value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getChargeStaff" style="width:100%">
                                            <el-option
                                                v-for="item in chargeStaffs"
                                                :key="item.id"
                                                :label="item.realName"
                                                :value="item.id">
                                                <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span='4' style='text-align:center'><el-button size="small" type="primary" @click="send">发送</el-button></el-col>
                                </el-row>
                            </van-popup>
                            <el-row>
                                <el-col>清单货物基本步骤:</el-col>
                                <el-col>1.按照系统中的发运清单结合总装图清点货物;</el-col>
                                <el-col>2.确认货物是否完好：破损、锈蚀等缺陷或者缺件，将点货时的设备状态拍照上传附件留底;</el-col>
                                <el-col>3.上传附件向公司汇报现场货物情况并文字说明;</el-col>
                            </el-row>
                    </div>
                    <div v-show="fwrw">
                        <el-input type="textarea" rows="4"  placeholder="任务描述" v-model="addList.taskRemarks"  maxlength="100"  show-word-limit></el-input>
                            <el-row style="background:#fff;border-left:2px solid blue;margin-top:10px;" v-for='(item,index) in addList.serviceTaskList' :key='index'>
                                <el-col :span="12">
                                    <p  style='size:12px;margin:3px 10px' v-if="item.productType=='1'">通风机</p>
                                    <p  style='size:12px;margin:3px 10px' v-if="item.productType=='2'">小通风机</p>
                                    <p  style='size:12px;margin:3px 10px' v-if="item.productType=='3'">单极高速鼓风机</p>
                                    <p  style='size:12px;margin:3px 10px'>{{item.startNum}}</p>
                                    <p  style='size:12px;margin:3px 10px'>{{item.productNum}}台</p>
                                </el-col>
                                <el-col :span="12">
                                    <p style='float:right;font-weight:600'>已完成数量<el-input style="width:30%" size="small" v-model='item.finishNum'></el-input></p>
                                </el-col>
                            </el-row>
                            <el-input type="textarea" rows="4"  placeholder="未完成描述" v-model="addList.noFinishDescribe" style="margin:10px 0"  maxlength="100"  show-word-limit></el-input>
                            <el-row>
                                <el-col>指导安装基本步骤:</el-col>
                                <el-col>1.确认现场是否具备安装条件：安装人员、安装工具、起吊设备、耗材等是否齐全;</el-col>
                                <el-col>2.确认风机基础是否符合条件;</el-col>
                                <el-col>3.风机部件安装并粗调就位;</el-col>
                                <el-col>4.风机粗调后对地脚螺栓灌浆;</el-col>
                                <el-col>5.按照图纸和说明书要求对风机精调;</el-col>
                                <el-col>6.按照总装图纸指导现场安装管道和仪表;</el-col>
                                <el-col>7.按照电气图纸指导现场接线;</el-col>
                                <el-col>8.确认现场安装是否满足技术协议要求;</el-col>
                                <el-col>9.风机二次灌浆找平;</el-col>
                            </el-row>
                    </div>
                    <div v-show="gzrz" style='height:500px;overflow:auto;'>
                        <el-button type="text" @click='txjhOpen' style="margin-bottom:10px;">填写计划</el-button>
                        <el-row v-for="(item,index) in addList.logPlanList" :key="index" style="margin-bottom:2px;">
                            <el-col :span="4" style="background:rgb(0, 121, 254);text-align:center;line-height:82.4px;color:#fff;font-weight:700;font-size:16px;" v-if="item.planFinish==''">计划</el-col>
                            <el-col :span="4" style="background:rgb(0, 128, 0);text-align:center;line-height:82.4px;color:#fff;font-weight:700;font-size:16px;" v-if="item.planFinish=='1'">实际</el-col>
                            <el-col :span="4" style="background:red;text-align:center;line-height:82.4px;color:#fff;font-weight:700;font-size:16px;" v-if="item.planFinish=='2'">实际</el-col>
                            <el-col :span="20" style="padding:0 10px 0px 10px;background:#fff"><h3>{{item.taskContent}}</h3><span  style='float:left'>{{item.logRecordDate}}</span><span style='float:right'><el-button type="text" size="small" @click="jhtxDetail(item.id)">详细</el-button></span></el-col>
                        </el-row>  
                        <van-popup v-model="txjhShow" class="sx_popup" position="bottom" :style="{ height: '100%' }" v-if='txjhShow'>
                            <van-nav-bar
                                title="填写计划"
                                right-text="保存"
                                left-arrow
                                @click-left="onClickLeft"
                                @click-right="onClickRight"
                            />
                            <van-form>
                                <el-row style='border-bottom:1px solid red;background:#fff;padding:0 10px;'>
                                    <van-field :label="wxjhList[0].logRecordDate" :value="wxjhList[0].cardSign=='1'?'未打卡':'已打卡'"  readonly/>
                                    <van-field label="计划内容" v-model="wxjhList[0].taskContent" placeholder="请输入计划内容" required/>
                                </el-row>
                                <el-row style='background:#fff;padding:0 10px;'>
                                    <van-field :label="wxjhList[1].logRecordDate" :value="wxjhList[1].cardSign=='1'?'未打卡':'已打卡'"  @click="visible = true" readonly/>
                                    <van-field label="计划内容" v-model="wxjhList[1].taskContent" placeholder="请输入计划内容" required/>
                                    <van-radio-group v-model="wxjhList[1].planFinish"  direction="horizontal" style="padding:10px 16px;">
                                            <van-radio name="1">计划完成</van-radio>
                                            <van-radio name="2">计划未完成</van-radio>
                                    </van-radio-group>
                                    <van-field label="未完原因" v-model="wxjhList[1].noFinishReason" placeholder="请输入未完原因" v-if="wxjhList[1].planFinish=='2'"  required/>
                                    <van-field label="食宿费用(元)" v-model="wxjhList[1].roomExpense" placeholder="请输入食宿费用" type='number' @input='penseInt'/>
                                    <van-field label="长途汽车(元)" v-model="wxjhList[1].busExpense" placeholder="请输入食宿费用" type='number'  @input='penseInt'/>
                                    <van-field label="火车票(元)" v-model="wxjhList[1].trainTicket" placeholder="请输入食宿费用" type='number'  @input='penseInt'/>
                                    <van-field label="材料费(元)" v-model="wxjhList[1].materialExpense" placeholder="请输入食宿费用" type='number'  @input='penseInt'/>
                                    <van-field label="其他费用(元)" v-model="wxjhList[1].otherExpense" placeholder="请输入食宿费用" type='number'  @input='penseInt'/>
                                    <van-field label="费用合计(元)" v-model="wxjhList[1].expenseTotal" readonly/>
                                </el-row>
                            </van-form>
                        </van-popup>
                    </div>
                    <div v-show="khqr">
                        <van-radio-group v-model="addList.customConfirm">
                                <van-radio name="1" shape="square" style='margin-bottom:3px;'>验收报告签字</van-radio>
                                <van-radio name="2" shape="square" style='margin-bottom:3px;'>具备调试条件</van-radio>
                                <van-radio name="3" shape="square" style='margin-bottom:3px;'>继续完成调试</van-radio>
                                <van-radio name="4" shape="square" style='margin-bottom:3px;'>离场</van-radio>
                        </van-radio-group>
                        <el-button size="samll" style="margin:10px 0;" plain>通知发起调试工单</el-button>
                        <el-input type="textarea" rows="4"  placeholder="说明" v-model="addList.remarks"  maxlength="100"  show-word-limit></el-input>
                        <el-row style="margin-top:15px;">
                                <el-col :span="7" style="line-height:32px">上传安装报告:</el-col>
                                <el-col :span="17">
                                    <el-upload
                                    class="upload-demo"
                                    action="aaa"
                                    :http-request="uploadAction2"
                                    :on-preview="handlePreview2"
                                    :on-remove="handleRemove2"
                                    :before-remove="beforeRemove2"
                                    :before-upload="beforeUpload2"
                                    :on-success="uploadSuccessFile2"
                                    :file-list="fileList2"
                                    >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip"></div>
                                    </el-upload>
                                </el-col>
                        </el-row>
                        <el-row>
                            <el-col>结果确认基本步骤:</el-col>
                            <el-col>1.确认现场安装台数，剩余台数;</el-col>
                            <el-col>2.客户确认签字安装报告;</el-col>
                            <el-col>3.确认现场是否具备调试条件;</el-col>
                            <el-col>4.确认现场是否继续调试还是离场;</el-col>
                        </el-row>
                    </div>
                    <div v-show="jbxx">
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">关联单号</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.relateOddNum}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">派工单号</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.oddNum}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">客户名称</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.clientName}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">计划期</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.planDate}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">合同号</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.paperContractNo}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">服务类型</el-col>
                                <el-col :span="12" style="text-align:right" v-if="addList.serviceType=='0'">质量反馈</el-col>
                                <el-col :span="12" style="text-align:right" v-if="addList.serviceType=='1'">调试申请</el-col>
                                <el-col :span="12" style="text-align:right" v-if="addList.serviceType=='2'">维保申请</el-col>
                                <el-col :span="12" style="text-align:right" v-if="addList.serviceType=='3'">安装申请</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">客户联系人</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.contactPersonName}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">联系电话</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.telephone}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">客户地址</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.detailAddress}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">任务说明</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.taskRemarks}}</el-col>
                            </el-row>
                            <el-row style='margin-bottom:1px;background:#fff;padding:0 10px;line-height:32px;'>
                                <el-col :span="12" style="text-align:left">服务工程师</el-col>
                                <el-col :span="12" style="text-align:right">{{addList.serviceEngineer}}</el-col>
                            </el-row>
                    </div>
            </div>
            <el-row style='margin-top:20px;background:#fff;padding:20px 10px;'>
                <div style='width:45%;float:left'><el-button type="primary" size='small' icon='el-icon-circle-check' style='width:100%;padding:15px;font-size:15px;' @click='addSave'>完工确认</el-button></div>
                <div style='width:45%;float:right'><el-button type="primary" size='small' icon='el-icon-location-outline' style='width:100%;padding:15px;font-size:15px;' @click="visible = true">现场签卡</el-button></div>
            </el-row>
        </el-main>
        <Sign :visible.sync="visible" @getLocation="getLocation"/>
    </el-container>
</template>
<script>
import { getUserInfoBySearch } from '@/api/biz/crm/xmbd'
import  Sign from '../../MobileSite/MobilePage/Sign/index'
import {detail,finish,submit,write,writeAdd,rzdetail} from '@/api/biz/cs/workOrder'
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
export default {
  props:{
      detailId: {
      type: String,
      default: null
    },
    nodeAlias: {
      type: String,
      default: null
    },
    editFlag: {
      type: Boolean,
      default: null
    },
    proDefId: { type: String, default: null },
    functionId: { type: String, default: null },
    nodeCode: { type: String, default: null },
    diaType: { type: Number, default: null }
  },
  components:{
    Sign
  },
  data() {
    return {
      txjhShow:false,
      visible:false,
      aqpx:true,
      qdhw:false,
      fwrw:false,
      gzrz:false,
      khqr:false,
      jbxx:false,
      tabs: 0,
      active:0,
      fileList: [],
      dataList: [],
      dataSrcId: "CS_PGD",
      affixType: "CS_PGD#AFFIX_SCORE",
      mainId: "",
      fileList1: [],
      dataList1: [],
      dataSrcId1: "CS_PGD",
      affixType1: "CS_PGD#AFFIX_GOODS",
      fileList2: [],
      dataList2: [],
      dataSrcId2: "CS_PGD",
      affixType2: "CS_PGD#AFFIX_REPORT",
      addList:{},
      wxjhList:[
          {logRecordDate:''},
          {logRecordDate:''}
      ],
      popupDia:false,
      chargeStaffs:[],
    };
  },
  methods: {
    //返回
    onClickLeft() {
        this.txjhShow=false
    },
    //保存
    onClickRight() {
        if(this.wxjhList[0].taskContent==''||this.wxjhList[1].taskContent==''){
            this.$message({
                    message: '请填写必填字段',
                    type: "warning"
                });
        }else{
            if(this.wxjhList[1].planFinish=='2'&&this.wxjhList[1].noFinishReason==''){
                this.$message({
                    message: '请填写必填字段',
                    type: "warning"
                });
            }else{
                this.wxjhList[0].sheetId=this.detailId
                this.wxjhList[1].sheetId=this.detailId
                writeAdd({logPlanList:this.wxjhList}).then(res=>{
                    if(res.data.code=='200'){
                        this.$message({
                            message: '保存成功',
                            type: "success"
                        });
                        this.txjhShow=false
                        detail(this.detailId).then(res=>{
                            this.addList=res.data.data
                        })
                    }
                })
            }
        }
    },
    //缺少部件的通知
    showPopup(){
        this.popupDia=true
    },
    getChargeStaff(query){
        if(query!=''){
            getUserInfoBySearch(query).then(res=>{
                this.chargeStaffs=res.data.data
            })
        }else{
          this.chargeStaffs=[]
        }
    },
    //发送
    send(){
        this.popupDia=false
    },
    //完工确认
    addSave(){
        this.addList.trainList=this.fileList
        this.addList.goodsList=this.fileList1
        this.addList.installList=this.fileList2
        finish(this.addList).then(res=>{
            if(res.data.code=='200'){
                this.$message({
                    message: res.data.msg,
                    type: "success"
                });
            }
        })
    },
    getLocation({ address, date }) {
        submit({sheetId:this.addList.id,signAddress:address,signTime:date}).then(res=>{
        })
    },
    getTabs(type,i){
        if(type=='aqpx'){
            this.aqpx=true
        }else{
            this.aqpx=false
        }
        if(type=='jbxx'){
            this.jbxx=true
        }else{
            this.jbxx=false
        }
        if(type=='qdhw'){
            this.qdhw=true
        }else{
            this.qdhw=false
        }
        if(type=='fwrw'){
            this.fwrw=true
        }else{
            this.fwrw=false
        }
        if(type=='gzrz'){
            this.gzrz=true
        }else{
            this.gzrz=false
        }
        if(type=='khqr'){
            this.khqr=true
        }else{
            this.khqr=false
        }
        let btns=document.getElementsByClassName('btn1')
        let btn2=document.querySelector('.btn2')
        btn2.classList.remove('btn2')
        btns[i].classList.add('btn2')
    },
    txjhOpen(){
        this.txjhShow=true
        write(this.detailId).then(res=>{
            this.wxjhList=res.data.data
        })
    },
    jhtxDetail(rowId){
        this.txjhShow=true
        rzdetail(rowId).then(res=>{
            this.wxjhList=res.data.data
        })
    },
    penseInt(){
        this.wxjhList[1].expenseTotal=Number(this.wxjhList[1].roomExpense)+Number(this.wxjhList[1].busExpense)+Number(this.wxjhList[1].trainTicket)+Number(this.wxjhList[1].materialExpense)+Number(this.wxjhList[1].otherExpense)
        if(this.wxjhList[1].expenseTotal==0){
            this.wxjhList[1].expenseTotal=''
        }
    },
    //上传培训成绩
    init() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId,
        affixType: this.affixType
      };
      this.fileList = [];
      this.dataList = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 1
            });
            this.dataList.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadAction(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId);
      form.append("affixType", this.affixType);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId,
              fileName: res.data.data.originalFileName
            });
            this.dataList.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemove(file, fileList) {
      this.fileList.forEach(ele => {
        if (file.isEdit == 1) {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        } else {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        }
      });
    },
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
          file.raw.fileId}&dataSrcId=${file.dataSrcId ||
          ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemove(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    },

    //上传货物图片
    init1() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId1,
        affixType: this.affixType1
      };
      this.fileList1 = [];
      this.dataList1 = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList1.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 1
            });
            this.dataList1.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadAction1(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId1);
      form.append("affixType", this.affixType1);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList1.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType1,
              dataSrcId: this.dataSrcId1,
              fileName: res.data.data.originalFileName
            });
            this.dataList1.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType1,
              dataSrcId: this.dataSrcId1
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemove1(file, fileList) {
      this.fileList1.forEach(ele => {
        if (file.isEdit == 1) {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        } else {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        }
      });
    },
    handlePreview1(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
          file.raw.fileId}&dataSrcId=${file.dataSrcId ||
          ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemove1(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload1(file) {
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile1(response, file, fileList) {
      console.log(response);
    },


    //上传安装报告
    init2() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId2,
        affixType: this.affixType2
      };
      this.fileList2 = [];
      this.dataList2 = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList2.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 1
            });
            this.dataList2.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadAction2(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId2);
      form.append("affixType", this.affixType2);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList2.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType2,
              dataSrcId: this.dataSrcId2,
              fileName: res.data.data.originalFileName
            });
            this.dataList2.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType2,
              dataSrcId: this.dataSrcId2
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemove2(file, fileList) {
      this.fileList2.forEach(ele => {
        if (file.isEdit == 1) {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        } else {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        }
      });
    },
    handlePreview2(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
          file.raw.fileId}&dataSrcId=${file.dataSrcId ||
          ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemove2(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload2(file) {
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile2(response, file, fileList) {
      console.log(response);
    }
  },
  created () {
      detail(this.detailId).then(res=>{
          this.addList=res.data.data
          this.mainId=this.detailId
          this.init()
          this.init1()
          this.init2()
      })
  }
};
</script>
<style lang="scss" scoped>
body{
    font-size: 14px;
}
.sx_tabs{
    margin: 10px 0px;
    border:1px solid #eee;
    text-align: center;
    background: #fff;
}
.btn1{
    color:#000;
}
.btn2{
    color:#409EFF;
}
.sx_tabs span{
    display: inline-block;width:16px;height:16px;border-radius: 50%;background:#000;color:#fff;line-height: 18px;text-align: center;margin-right:2px;
}
</style>

