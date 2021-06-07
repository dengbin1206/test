<template>
    <div style="width:100%;padding:0 20px;">
        <template>
            <el-button type="primary"  size="small" @click='fcjhOpen' v-if="btnList.pzwx_btn">配置维修步骤</el-button>
        </template>
        <el-form :model="addList"  :label-position='labelPosition' :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
            <el-row :gutter="20">
                <h3>返厂基本信息</h3>
                <el-col :span="ispc">
                    <el-form-item label="返厂类型:" prop="serviceType">
                            <el-radio-group v-model="addList.serviceType" size="small">
                                <el-radio label="1">保内返厂</el-radio>
                                <el-radio label="2">保外返厂</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关联单号:" prop="relateFormName">
                            <el-input size="small" v-model="addList.relateFormName"></el-input>
                    </el-form-item>
                    <el-form-item label="客户名称:" prop="clientInfo">
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="getClientId"  style="width:100%">
                                <el-option
                                    v-for="item in clientIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="客户联系人:" prop="contactPersonName">
                        <el-input size="small" v-model="addList.contactPersonName"></el-input>  
                    </el-form-item>
                    <el-form-item label="客户联系电话:" prop="telephone">
                        <el-input size="small" v-model="addList.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="负责员工:" prop="chargeStaff">
                            <el-select size="small" v-model="addList.chargeStaff" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getChargeStaff" style="width:100%" @change="chargeStaffChange">
                                <el-option
                                    v-for="item in chargeStaffs"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="部门:" prop="departmentName">
                            <el-input size="small" v-model="addList.departmentName" placeholder="自动带出" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='ispc'>
                    <el-form-item label="申请号:" prop="signNum">
                        <el-input size="small" v-model="addList.signNum" placeholder="自动生成" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间:" prop="createTime">
                            <el-input size="small" v-model="addList.createTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="审批状态:" prop="flowStatus">
                            <el-select size="small" v-model="addList.flowStatus" disabled  placeholder="请选择审批状态"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="审批结束时间:" prop="flowCompletedTime">
                            <el-input size="small" v-model="addList.flowCompletedTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="紧急程度:" prop="urgencyDegree">
                            <el-select size="small" v-model="addList.urgencyDegree"   placeholder="请选择紧急程度"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in urgencyDegrees"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="客户详细地址:" prop="detailAddress">
                        <el-input size="small" v-model="addList.detailAddress" placeholder="请输入客户详细地址" type="textarea" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="特殊说明:" prop="specialRemark">
                        <el-input size="small" v-model="addList.specialRemark" placeholder="请输入特殊说明" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <h3>物流信息</h3>
                <el-col :span="ispc">
                    <el-form-item label="物流:" prop="logistics">
                            <el-radio-group v-model="addList.logistics" size="small">
                                <el-radio label="1">现场物流</el-radio>
                                <el-radio label="2">公司安排物流</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="货运类型:" prop="freightType">
                            <el-select size="small" v-model="addList.freightType"   placeholder="请选择货运类型"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in freightTypes"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="物流公司:" prop="logisticsCompany">
                        <el-input size="small" v-model="addList.logisticsCompany" placeholder="请输入物流公司" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="ispc">
                    <el-form-item label="重量:" prop="weight">
                        <el-input size="small" v-model="addList.weight" placeholder="请输入重量" @input="zlgldj"></el-input>
                    </el-form-item>
                    <el-form-item label="公里数:" prop="kilometers">
                        <el-input size="small" v-model="addList.kilometers" placeholder="请输入公里数"  @input="zlgldj"></el-input>
                    </el-form-item>
                    <el-form-item label="协议单价:" prop="agreementPrice">
                        <el-input size="small" v-model="addList.agreementPrice" placeholder="请输入协议单价"  @input="zlgldj"></el-input>
                    </el-form-item>
                    <el-form-item label="协议价(元):" prop="agreementNum">
                        <el-input size="small" v-model="addList.agreementNum"  disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="三超说明:" prop="tripleSuper">
                        <el-input size="small" v-model="addList.tripleSuper" placeholder="请输入三超说明" type="textarea" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="物流内容备注:" prop="contentNote">
                        <el-input size="small" v-model="addList.contentNote" placeholder="请输入物流内容备注" type="textarea" rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <h3>产品信息</h3>
                <el-button type="primary" size="small" icon="el-icon-plus" @click="productAdd" style="margin-bottom:5px;"  v-if="btnList.rowAdd_btn">插入行</el-button>
                <el-table
                    :data="addList.returnProductInfoVOS"
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    max-height="370"
                    border
                    size='small'
                    style="width: 100%">
                    <el-table-column type='index' width="55"></el-table-column>
                    <el-table-column  prop="rowNumber" label="行号" width="70"></el-table-column>
                    <el-table-column prop="partName" label="返厂部件名称">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.partName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="totalNum" label="数量">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.totalNum" type="number"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="materialCode" label="物料号">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.materialCode"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="materialRemark" label="物料描述">
                        <template slot-scope="scope">
                            <el-input size="small" v-model="scope.row.materialRemark"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  width='80' fixed="right"  v-if="btnList.rowDel_btn">
                        <template slot-scope="scope">
                            <el-button icon='el-icon-delete' size="small" type="text"  @click="productDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <h3>返厂维修计划</h3>
                <el-button type="primary" size="small" icon="el-icon-plus" @click="pairPlanAdd" style="margin-bottom:5px;"  v-if="btnList.rowAdd_btn">插入行</el-button>
                <el-table
                    :data="addList.returnRepairPlanVOS"
                    :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    max-height="370"
                    border
                    size='small'
                    style="width: 100%">
                    <el-table-column type='index' width="55"></el-table-column>
                    <el-table-column  prop="rowNumber" label="行号" width="50"></el-table-column>
                    <el-table-column prop="itemId" label="事项">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.itemId" placeholder="请选择事项" size="small" style="width:100%" clearable @change="itemThingChange(scope.row)">
                                <el-option v-for="item in itemThings" :key="item.id" :label="item.planStep" :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="itemPost" label="岗位"></el-table-column>
                    <el-table-column  prop="requireTime" label="要求时长(H)" width='100'></el-table-column>
                    <el-table-column  prop="planStartDate" label="计划开始时间">
                        <template slot-scope="scope">
                          <el-date-picker
                            v-model="scope.row.planStartDate"
                            type="datetime"
                            format='yyyy-MM-dd HH:mm:ss'
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size='small'
                            placeholder="计划开始时间">
                          </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="planEndDate" label="计划完成时间">
                      <template slot-scope="scope">
                          <el-date-picker
                            v-model="scope.row.planEndDate"
                            type="datetime"
                            format='yyyy-MM-dd HH:mm:ss'
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size='small'
                            placeholder="计划完成时间">
                          </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="actualFinish" label="实际完成时间">
                      <template slot-scope="scope">
                          <el-date-picker
                            v-model="scope.row.actualFinish"
                            type="datetime"
                            format='yyyy-MM-dd HH:mm:ss'
                            size='small'
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="实际完成时间">
                          </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  width='80' fixed="right"  v-if="btnList.rowDel_btn">
                        <template slot-scope="scope">
                            <el-button icon='el-icon-delete' size="small" type="text"  @click="pairPlanDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;" v-if='ispc==12'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
            <el-button type="primary" @click="rowsub('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.sub_btn">保存并提交</el-button>
            <el-button type="primary" @click="close()"  size="small" icon="el-icon-close" v-if="btnList.close_btn">取消</el-button>
        </div>
        <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
            <el-button type="primary" @click="rowSave('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="btnList.save_btn">保存</el-button>
        </div>
        <el-dialog
              title="配置返厂计划"
              :visible.sync="fcjhDia"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="75%">
                <div>
                    <div>
                        <h3>产品信息</h3>
                        <el-button type="primary" @click="rowAdd" size="small" icon="el-icon-check" style="margin-bottom:5px;">插入行</el-button>
                        <el-table :data="dto.configPlanList" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="350" style="width: 100%">
                            <el-table-column type='index' width="55"></el-table-column>
                            <el-table-column prop="rowNumber" label="行号" width="55"></el-table-column>
                            <el-table-column prop="planStep" label="步骤"> 
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.planStep" size="small" placeholder="请输入步骤"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="itemPost" label="岗位">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.itemPost" size="small" placeholder="请输入岗位"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="requireTime" label="时长(H)">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.requireTime" size="small" placeholder="请输入时长" type="number"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="delFlag" label="删除标记">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.delFlag"  true-label="1" false-label="0" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作"  width='80' fixed="right">
                                <template slot-scope="scope">
                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="rowDel(scope.row,scope.$index)" style="color:red" :disabled="scope.row.isQuote=='2'">删除</el-button> 
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div slot="footer" class="dialog-footer" style="float:right;margin-top:5px;">
                            <el-button type="primary" @click="fcjhSave()" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
                            <el-button type="primary" @click="fcjhClose()"  size="small" icon="el-icon-close">取消</el-button>
                    </div>
                    <div style="margin-top:10px;">
                        <p>返厂流程:</p>
                        <p>1、物流课课长接到用车申请后配载48小时内安排到车，专车8个工作时到车;</p>
                        <p>2、到货后仓管员4小时内确认到货;</p>
                        <p>3、售后接到到货信息后4小时内通知大家到现场评审;</p>
                        <p>4、组织评审时无需拆卸检测的由通风机/压缩机研究所所长8工作时内完成技术通知单;</p>
                        <p>5、如需要拆卸后检测的：转子拆卸（总装车间主任），叶轮拆卸（铆焊车间主任）48小时内完成;</p>
                        <p>6、需要检测的由质量与流程IT质量工程师安排8工作时内完成并出具检测结果;</p>
                        <p>7、通风机/压缩机研究所所长按照检测结果8工作时内完成技术通知单;</p>
                    </div>
                </div>
            </el-dialog>
    </div>
</template>
<script>
import { getContractBySearch } from "@/api/biz/crm/xsdd";
import {
  blurrySelect,
  getUserInfoBySearch,
  addDefaultVaule
} from "@/api/biz/crm/xmbd";
import { getDictByCode, getDictBizByCode } from "@/api/system/dict";
import { save, detail, fcjhList, saveOrUpdate,azsqData,tssqData,wbsqData,getList } from "@/api/biz/cs/factory";
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
import { getData } from "@/api/biz/cs/shxsdd";
export default {
  props: {
    api: {
      type: Function,
      default: null
    },
    turnoff: {
      type: Function,
      default: null
    },
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
  data() {
    return {
      ispc:12,
      labelPosition:'right',
      btnList:{
        pzwx_btn:false,
        rowAdd_btn:false,
        rowDel_btn:false,
        save_btn:false,
        sub_btn:false,
        close_btn:false
      },
      fcjhDia: false,
      dto: {
        configPlanList: [],
        delConfigPlanIds: []
      },
      btnLoading: false,
      addList: {
        returnProductInfoVOS: [],
        returnRepairPlanVOS: [],
        delReturnProductInfoIds: [],
        delReturnRepairPlanIds: [],
        agreementPrice:'',
        kilometers:'',
        weight:''
      },
      contractIds: [],
      clientIds: [],
      chargeStaffs: [],
      statusOption: [],
      itemThings: [],
      urgencyDegrees: [],
      freightTypes: [],
      rules: {
        serviceType: [{ required: true, message: "请选择业务类型" }],
        paperContractNo: [{ required: true, message: "请选择合同号" }],
        clientInfo: [{ required: true, message: "请选择客户名称" }],
        chargeStaff: [{ required: true, message: "请选择负责员工" }],
        relateFormId: [{ required: true, message: "请选择关联单号" }],
        contactPersonName: [{ required: true, message: "请输入客户联系人" }],
        telephone: [{ required: true, message: "请输入客户联系电话" }],
        detailAddress: [{ required: true, message: "请输入客户详细地址" }],
        weight: [{ required: true, message: "请输入重量" }],
        kilometers: [{ required: true, message: "请输入公里数" }],
        agreementPrice: [{ required: true, message: "请输入协议单价" }],
        freightType: [{ required: true, message: "请选择货运类型" }],
        logisticsCompany: [{ required: true, message: "请输入物流公司" }],
        tripleSuper: [{ required: true, message: "请输入三超说明" }]
      }
    };
  },
  methods: {
    open(rowId, fcId, diaType) {
      this.addList = {
        returnProductInfoVOS: [],
        returnRepairPlanVOS: [],
        delReturnProductInfoIds: [],
        delReturnRepairPlanIds: [],
        agreementPrice:'',
        kilometers:'',
        weight:''
      };
      this.contractIds = [];
      this.clientIds = [];
      this.chargeStaffs = [];
      if(diaType==1||diaType==2){
        this.btnList={
          pzwx_btn:true,
          rowAdd_btn:true,
          rowDel_btn:true,
          save_btn:true,
          sub_btn:true,
          close_btn:true
        }
      }else{
        this.btnList={
          pzwx_btn:false,
          rowAdd_btn:false,
          rowDel_btn:false,
          save_btn:false,
          sub_btn:false,
          close_btn:false
        }
      }
      if (rowId == "") {
        this.getDefaultVal();
        if (fcId != "") {
          if (JSON.parse(localStorage.getItem("bnfc")).type == "azsq") {
            azsqData(fcId).then(res=>{
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.chargeStaff = res.data.data.chargeStaff;
              this.addList.departmentName = res.data.data.departmentName;
              this.addList.departmentId = res.data.data.departmentId;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.$set(this.addList, "serviceType", "2");
              this.chargeStaffs.push(res.data.data.chargePerson);
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            })
          } else if (JSON.parse(localStorage.getItem("bnfc")).type == "zlfk") {
            getData(fcId).then(res => {
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.chargeStaff = res.data.data.chargeStaff;
              this.addList.departmentName = res.data.data.departmentName;
              this.addList.departmentId = res.data.data.departmentId;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.$set(this.addList, "serviceType", "1");
              this.chargeStaffs.push(res.data.data.chargePerson);
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
              if (this.addList.blameProductInfoVOS.length > 0) {
                this.addList.blameProductInfoVOS.forEach((item, index) => {
                  item.fanType = item.productType;
                  item.id = "";
                });
              }
            });
          }else if(JSON.parse(localStorage.getItem("bnfc")).type == "tssq"){
            tssqData(fcId).then(res => {
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.chargeStaff = res.data.data.chargeStaff;
              this.addList.departmentName = res.data.data.departmentName;
              this.addList.departmentId = res.data.data.departmentId;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.$set(this.addList, "serviceType", "2");
              this.chargeStaffs.push(res.data.data.chargePerson);
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            });
          }else if(JSON.parse(localStorage.getItem("bnfc")).type == "wbsq"){
            wbsqData(fcId).then(res => {
              this.addList.relateFormName = res.data.data.relateFormName;
              this.addList.relateFormId = res.data.data.relateFormId;
              this.addList.detailAddress = res.data.data.detailAddress;
              this.addList.clientInfo = res.data.data.clientInfo;
              this.addList.chargeStaff = res.data.data.chargeStaff;
              this.addList.departmentName = res.data.data.departmentName;
              this.addList.departmentId = res.data.data.departmentId;
              this.addList.clientClazz = res.data.data.clientClazz;
              this.addList.paperContractNo = res.data.data.paperContractNo;
              this.addList.contactPersonName = res.data.data.contactPersonName;
              this.addList.telephone = res.data.data.telephone;
              this.$set(this.addList, "serviceType", "2");
              this.chargeStaffs.push(res.data.data.chargePerson);
              this.contractIds.push({
                paperContractNo: this.addList.paperContractNo
              });
              this.clientIds.push(res.data.data.clientInfo);
              this.clientIds.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            });
          }
        }
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.contractIds.push({
            paperContractNo: this.addList.paperContractNo
          });
          this.clientIds.push(this.addList.clientInfo);
          this.clientIds.forEach(item => {
            item.label = item.customerName;
            item.value = { customerName: item.customerName, id: item.id };
          });
          this.chargeStaffs.push(this.addList.chargePerson);
        });
      }
    },
    //合同号
    getContractId(query) {
      if (query != "") {
        getContractBySearch(query).then(res => {
          this.contractIds = res.data.data;
        });
      } else {
        this.contractIds = [];
      }
    },
    contractIdChange() {
      this.clientIds = [];
      this.chargeStaffs = [];
      this.contractIds.forEach(item => {
        if (item.paperContractNo == this.addList.paperContractNo) {
          this.$set(this.addList, "clientInfo", item.clientInfo);
          this.clientIds.push(item.clientInfo);
          this.clientIds.forEach(item => {
            item.label = item.customerName;
            item.value = { customerName: item.customerName, id: item.id };
          });
          this.$set(this.addList, "chargeStaff", item.chargeStaff);
          this.chargeStaffs.push(item.chargePerson);
          this.$set(this.addList, "departmentName", item.departmentName);
          this.$set(this.addList, "departmentId", item.departmentId);
          this.$set(
            this.addList,
            "returnProductInfoVOS",
            item.productContractInfoVOS
          );
          if (this.addList.returnProductInfoVOS.length > 0) {
            this.addList.returnProductInfoVOS.forEach((item, index) => {
              item.rowNumber = (index + 1) * 10;
              item.id = "";
            });
          }
        }
      });
    },
    //客户名称
    getClientId(query) {
      if (query != "") {
        blurrySelect(query).then(res => {
          this.clientIds = res.data.data;
          this.clientIds.forEach(item => {
            let arr = {
              customerName: item.customerName,
              id: item.id
            };
            item.label = item.customerName;
            item.value = arr;
          });
        });
      } else {
        this.clientIds = [];
      }
    },
    //负责员工
    getChargeStaff(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.chargeStaffs = res.data.data;
        });
      } else {
        this.chargeStaffs = [];
      }
    },
    chargeStaffChange() {
      this.chargeStaffs.forEach(item => {
        if (item.id == this.addList.chargeStaff) {
          this.$set(this.addList, "departmentName", item.deptName);
          this.$set(this.addList, "departmentId", item.deptId);
        }
      });
    },
    getDefaultVal() {
      addDefaultVaule("CS_FC").then(res => {
        this.$set(this.addList, "createTime", res.data.data.CREATE_TIME);
        this.$set(
          this.addList,
          "createUserName",
          res.data.data.CREATE_USER_NAME
        );
        this.$set(this.addList, "flowStatus", res.data.data.FLOW_STATUS);
      });
    },
    zlgldj(){
      this.addList.agreementNum=Number(this.addList.weight)*Number(this.addList.kilometers)*Number(this.addList.agreementPrice)
      if(this.addList.agreementNum==0){
        this.addList.agreementNum=''
      }
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    //紧急程度
    geturgencyDegrees() {
      getDictBizByCode("cs_urgency_degree").then(res => {
        this.urgencyDegrees = res.data.data;
      });
    },
    //货运类型
    getfreightType() {
      getDictBizByCode("crm_freight_type").then(res => {
        this.$set(this, "freightTypes", res.data.data);
      });
    },
    getitemThings(){
      getList().then(res=>{
        this.itemThings=res.data.data
      })
    },
    itemThingChange(row){
      this.itemThings.forEach(item=>{
        if(row.itemId==item.id){
          this.$set(row,'itemPost',item.itemPost)
          this.$set(row,'requireTime',item.requireTime)
        }
      })
    },
    //产品信息行新增
    productAdd() {
      this.addList.returnProductInfoVOS.push({});
      this.addList.returnProductInfoVOS.forEach((item, index) => {
        item.rowNumber = (index + 1) * 10;
      });
    },
    //产品信息行删除
    productDel(row, index) {
      this.addList.returnProductInfoVOS.splice(index, 1);
      this.addList.returnProductInfoVOS.forEach((item, index) => {
        item.rowNumber = (index + 1) * 10;
      });
      if (row.id) {
        this.addList.delReturnProductInfoIds.push(row.id);
      }
    },
    //维修计划行新增
    pairPlanAdd() {
      this.addList.returnRepairPlanVOS.push({});
      this.addList.returnRepairPlanVOS.forEach((item, index) => {
        item.rowNumber = (index + 1) * 10;
      });
    },
    //维修计划行删除
    pairPlanDel(row, index) {
      this.addList.returnRepairPlanVOS.splice(index, 1);
      this.addList.returnRepairPlanVOS.forEach((item, index) => {
        item.rowNumber = (index + 1) * 10;
      });
      if (row.id) {
        this.addList.delReturnRepairPlanIds.push(row.id);
      }
    },
    //保存
    rowSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.turnoff();
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("bnfc");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //保存并提交
    rowsub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("bnfc");
              this.getModel("CS_FC");
              this.dataId = res.data.data;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取模型Id
    getModel(modelName) {
      modelByName(modelName).then(res => {
        if (res.data.code == 200) {
          this.startFlow(res.data.data.id);
        }
      });
    },
    //启动流程
    startFlow(id) {
      startFlow({
        flowKey: "CS_FCWX_DART",
        formType: "S",
        modelId: id,
        dataId: this.dataId,
        variables: {
          functionPath: this.$route.fullPath
        }
      }).then(res => {
        if ((res.data.code = 200)) {
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.turnoff();
        }
      });
    },
    close() {
      this.turnoff();
      localStorage.removeItem("bnfc");
    },
    fcjhOpen() {
      this.dto = {
        configPlanList: [],
        delConfigPlanIds: []
      };
      this.fcjhDia = true;
      fcjhList().then(res => {
        this.dto.configPlanList = res.data.data;
        this.dto.configPlanList.forEach(item=>{
          if(item.isQuote=='2'){
            item.delFlag='1'
          }
        })
      });
    },
    rowAdd() {
      this.dto.configPlanList.push({});
      this.dto.configPlanList.forEach((item, index) => {
        item.rowNumber = (index + 1) * 10;
      });
    },
    rowDel(row, index) {
      this.dto.configPlanList.splice(index, 1);
      if (row.id) {
        this.dto.delConfigPlanIds.push(row.id);
      }
      if (this.dto.configPlanList.length > 0) {
        this.dto.configPlanList.forEach((item, index) => {
          item.rowNumber = (index + 1) * 10;
        });
      }
    },
    fcjhSave() {
      this.btnLoading = true;
      saveOrUpdate(this.dto).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.btnLoading = false;
          this.fcjhDia = false;
        }
      });
    },
    fcjhClose() {
      this.fcjhDia = false;
    }
  },
  created() {
    this.getStatus();
    this.geturgencyDegrees();
    this.getfreightType();
    this.getitemThings();
    if (this.detailId) {
      this.open(this.detailId, "", this.diaType);
    }
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.ispc = 24;
            this.labelPosition='left'
    } else {
            this.ispc = 12;
            this.labelPosition='right'
    }
  }
};
</script>
<style>
</style>

