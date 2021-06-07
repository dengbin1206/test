<template>
    <div>
            <el-form :model="addList" :label-position='labelPosition' :rules="rules" ref="ruleForm" label-width="120px"   class="sx_formItem">
                <el-row :gutter="20">
                    <el-col :span="ispc">
                        <h4>发货基本信息</h4>
                        <el-form-item label="发货类型:" prop="deliveryType">
                            <el-radio-group v-model="addList.deliveryType" size="small">
                                <el-radio label="1">销售发货</el-radio>
                                <el-radio label="2">售后发货</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="纸质合同号:" prop="paperContractNo">
                            <el-select size="small" v-model="addList.paperContractNo" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="zzhth" style="width:100%" @change="zzhthChange">
                                <el-option
                                    v-for="item in paperContractNos"
                                    :key="item.id"
                                    :label="item.paperContractNo"
                                    :value="item.paperContractNo">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户名称:" prop="clientName">
                            <el-input size="small" v-model="addList.clientName"  disabled></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="客户名称:" prop="clientInfo" v-if="addList.deliveryType=='2'">
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="khmc" style="width:100%">
                                <el-option
                                    v-for="item in clientInfos"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="装运地点:" prop="shippingLocation">
                            <el-select size="small" v-model="addList.shippingLocation" placeholder="请选择装运地点" style="width:100%">
                                <el-option
                                    v-for="item in shippingLocations"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收货联系人:" prop="receiveContact">
                            <el-input size="small" v-model="addList.receiveContact" placeholder="请输入收货联系人"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话:" prop="telephone">
                            <el-input size="small" v-model="addList.telephone" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                        <el-form-item label="创建人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="审批状态:" prop="flowStatus">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="请选择审批状态"  style="width:100%" clearable disabled>
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <h4>单据基本信息</h4>
                        <el-form-item label="申请号:" prop="signNum">
                            <el-input size="small" v-model="addList.signNum" disabled  placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="ERP交货单:" prop="deliveryNum">
                            <el-input size="small" v-model="addList.deliveryNum" disabled placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="要求到货日期:" prop="requireDeliveryDate">
                            <el-date-picker
                                v-model="addList.requireDeliveryDate"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择要求到货日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="实际发货日期:" prop="actualDeliveryDate">
                            <el-date-picker
                                v-model="addList.actualDeliveryDate"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择实际发货日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="负责员工:" prop="chargePerson">
                            <el-select size="small" v-model="addList.chargePerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="fzyg" style="width:100%" @change="fzygChange">
                                <el-option
                                    v-for="item in chargePersons"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="办事处:" prop="departmentName">
                            <el-input size="small" v-model="addList.departmentName" disabled placeholder="负责员工带出"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="createTime">
                            <el-date-picker
                                disabled
                                v-model="addList.createTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择审创建时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="审批结束时间:" prop="flowCompletedTime">
                            <el-date-picker
                                v-model="addList.flowCompletedTime"
                                type="datetime"
                                size='small'
                                disabled
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="审批通过自动生成">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="详细地址:" prop="detailAddress">
                      <el-input type="textarea" rows="3" size="small" v-model="addList.detailAddress"  placeholder="请输入详细地址"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="特殊说明:" prop="specialRemarks">
                            <el-input type="textarea" rows="3" size="small" v-model="addList.specialRemarks"  placeholder="请输入特殊说明"></el-input>
                  </el-form-item>
                </el-row>
                <el-row v-if="nodeAlias=='2'">
                  <el-col :span="ispc">
                    <el-form-item label="货款是否到账:" prop="isPlace">
                      <el-select size="small" v-model="addList.isPlace"  placeholder="请选择货款是否到账"  style="width:100%" clearable>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" v-if="nodeAlias=='5'">
                    <h4>物流信息(<span style="color:red">发货员填写</span>)</h4>
                    <el-col :span="ispc">
                        <el-form-item label="合同运费(元):" prop="contractFreight">
                            <el-input size="small" v-model="addList.contractFreight" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="运费已支出(元):" prop="expenseFreight">
                            <el-input size="small" v-model="addList.expenseFreight" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="重量(T):" prop="weight">
                            <el-input size="small" v-model="addList.weight" placeholder="请输入重量" type="number" @input="priceChange"></el-input>
                        </el-form-item>
                        <el-form-item label="公里数:" prop="kilometers">
                            <el-input size="small" v-model="addList.kilometers" placeholder="请输入公里数" type="number" @input="priceChange"></el-input>
                        </el-form-item>
                        <el-form-item label="三超说明:" prop="tripleSuper">
                            <el-input type="textarea" rows="3" size="small" v-model="addList.tripleSuper" placeholder="请输入三超说明"></el-input>
                        </el-form-item>
                        <el-form-item label="货运类型:" prop="freightType">
                            <el-select size="small" v-model="addList.freightType"  placeholder="请选择货运类型"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in freightTypes"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上传附件:" >
                                <el-upload
                                    class="upload-demo"
                                    :http-request="uploadAction"
                                    action="upLoadUrl"
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
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="物流公司:" prop="logisticsCompany">
                            <el-input size="small" v-model="addList.logisticsCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="协议单价(元):" prop="agreementPrice">
                            <el-input size="small" v-model="addList.agreementPrice" placeholder="请输入协议单价" type="number" @input="priceChange"></el-input>
                        </el-form-item>
                        <el-form-item label="协议价(元):" prop="agreementNum">
                            <el-input size="small" v-model="addList.agreementNum" type="number" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="超出运费:" prop="extendFreight">
                            <el-input size="small" v-model="addList.extendFreight" type="number" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="费用承担部门:" prop="costBearDeptInfo">
                            <el-select size="small" v-model="addList.costBearDeptInfo" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="fycdbm" style="width:100%">
                                <el-option
                                    v-for="item in CostBearDeptIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="费用超出说明:" prop="extendRemarks">
                            <el-input type="textarea" rows="3" size="small" v-model="addList.extendRemarks" placeholder="请输入费用超出说明"></el-input>
                        </el-form-item>
                        <el-form-item label="发送清单上传:" >
                                <el-upload
                                    class="upload-demo"
                                    :http-request="uploadActionTwo"
                                    action="upLoadUrlTwo"
                                    :on-preview="handlePreviewTwo"
                                    :on-remove="handleRemoveTwo"
                                    :before-remove="beforeRemoveTwo"
                                    :before-upload="beforeUploadTwo"
                                    :on-success="uploadSuccessFileTwo"
                                    :file-list="fileListTwo"
                                    >
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <h4>产品信息</h4>
                    <el-col :span="24">
                        <el-button type="primary" size="small" icon="el-icon-plus" @click="cpxxAdd" style="margin-bottom:5px;" v-if='buttonList.crm_fhsq_rowAdd.show'>插入行</el-button>
                        <el-button type="primary" size="small"  style="margin-bottom:5px;" @click="sign"  v-if='buttonList.crm_fhsq_sign.show'>缺件发货标记</el-button>
                        <el-button type="primary" size="small"  style="margin-bottom:5px;" @click="unmark" v-if='buttonList.crm_fhsq_unmark.show'>取消缺件标记</el-button>
                        <el-button type="primary" size="small"  style="margin-bottom:5px;" @click="bfhOpen"  v-if='buttonList.crm_fhsq_bfh.show'>补发货</el-button>
                        <el-button type="primary" size="small"  style="margin-bottom:5px;" @click="zzfOpen" v-if='buttonList.crm_fhsq_zzf.show'>转直发</el-button>
                        <el-table
                            class="sx_htps_cpxx"
                            ref="multipleTable"
                            :data="addList.deliveryProductVOS"
                            :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                            :cell-style="{'text-align':'center'}"
                            border
                            @selection-change="deliverySelectChange"
                            max-height="370"
                            style="width:100%"
                            size='small'>
                            <el-table-column
                              type="selection"
                              width="55">
                            </el-table-column>
                            <el-table-column
                            type='index'
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="paperContractNo"
                            label="纸质合同号"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="orderReleaseDate"
                            label="订单下排日期"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="salesOrderNum"
                            label="销售订单号"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="rowProject"
                            label="行项目"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="materialNum"
                            label="物料号"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="materialRemarks"
                            label="物料描述"
                            width="200">
                            </el-table-column>
                            <el-table-column
                            prop="requestSum"
                            label="请求数量"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="outstandingSum"
                            label="未清数量"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="shippedSum"
                            label="已发货数量"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="deliveryFactory"
                            label="发货工厂"
                            width='120'>
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.deliveryFactory" size="small" placeholder="请输入发货工厂"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="warehouseLocation"
                            label="存货地点"
                            width="200">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.warehouseLocation" size="small" placeholder="请输入存货地点"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="deliveryFormNum"
                            label="直发单号"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="outShippingMark"
                            label="缺件发货标记"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="outCategoryNum"
                            label="缺件种类数"
                            width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.outCategoryNum" size="small" placeholder="请输入缺件种类数" type="number"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="replenishMark"
                            label="补货标记"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="deliveryRemarks"
                            label="发货说明"
                            width="300">
                            </el-table-column>
                            <el-table-column label="操作"  width='80' fixed="right" v-if='buttonList.crm_fhsq_rowDel.show'>
                                <template slot-scope="scope">
                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="cpxxDel(scope.row,scope.$index)" style="color:red">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px" v-if="ispc==12">
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if='buttonList.crm_fhsq_save.show'>保存</el-button>
                <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if='buttonList.crm_fhsq_submit.show'>保存并提交</el-button>
                <el-button @click="close('ruleForm')" size="small" icon="el-icon-close" v-if='buttonList.crm_fhsq_cancel.show'>取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if='buttonList.crm_fhsq_save.show'>保存</el-button>
            </div>
            <addDialog ref="addLog" :api='api'/>
            <zzfDialog ref="zzfLog" :api='api'/>
            <el-dialog
              title="创建交货申请"
              :visible.sync="jhsqDia"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="75%">
                    <el-row>
                      <el-col :span="2" style="line-height:32px;text-align:right;padding-right:5px">纸质合同号:</el-col>
                      <el-col :span="8">
                            <el-input size="small" v-model="searchForm.paperContractNo" style="60%"></el-input>
                      </el-col>
                      <el-col :span="2" style="line-height:32px;text-align:right;padding-right:5px">销售订单号:</el-col>
                      <el-col :span="8">
                            <el-input size="small" v-model="searchForm.salesOrderNum" style="60%"></el-input>
                      </el-col>
                      <el-col :span="4" style="text-align:center"><el-button type="primary" size="small" icon="el-icon-search" style="margin-bottom:5px;" @click="search">搜索</el-button></el-col>
                    </el-row>
                  <el-button type="primary"  size="small" icon="el-icon-check" style="margin-bottom:5px;" @click="jhsqAdd" v-if='buttonList.crm_fhsq_rowAdd.show'>确定</el-button>
                  <el-table :data="jhsqList" ref="multipleTables" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%" @selection-change="jhsqSelectChange">
                      <el-table-column
                        type="selection"
                        width="55">
                      </el-table-column>
                      <el-table-column
                        type='index'
                        width="55">
                      </el-table-column>
                      <el-table-column
                            prop="paperContractNo"
                            label="纸质合同号"
                            width="150">
                      </el-table-column>
                      <el-table-column
                            prop="orderReleaseDate"
                            label="订单下排日期"
                            width="150">
                      </el-table-column>
                      <el-table-column
                            prop="salesOrderNum"
                            label="销售订单号"
                            width="150">
                      </el-table-column>
                      <el-table-column
                            prop="rowProject"
                            label="行项目"
                            width="120">
                      </el-table-column>
                      <el-table-column
                            prop="materialNum"
                            label="物料号"
                            width="120">
                      </el-table-column>
                      <el-table-column
                            prop="materialRemarks"
                            label="物料描述"
                            width="200">
                      </el-table-column>
                      <el-table-column
                            prop="requestSum"
                            label="请求数量"
                            width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.requestSum" size="small" placeholder="请输入请求数量" type="number" @blur="sumChange(scope.row)"></el-input>
                                </template>
                      </el-table-column>
                      <el-table-column
                            prop="outstandingSum"
                            label="未清数量"
                            width="120">
                      </el-table-column>
                      <el-table-column
                            prop="shippedSum"
                            label="已发货数量"
                            width="120">
                      </el-table-column>
                      <el-table-column
                            prop="deliveryFactory"
                            label="发货工厂"
                            width='120'>
                      </el-table-column>
                      <el-table-column
                            prop="warehouseLocation"
                            label="存货地点"
                            width="200">
                      </el-table-column>
                  </el-table>
              <span slot="footer" class="dialog-footer">
              </span>
            </el-dialog>
        </div>
</template>
<script>
import zzfDialog from "./zzfAdd";
import addDialog from "./bfhAdd";
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import { getContractBySearch, createSalesDelivery } from "@/api/biz/crm/xsdd";
import {
  blurrySelect,
  getUserInfoBySearch,
  addDefaultVaule
} from "@/api/biz/crm/xmbd";
import { deptByLabel, submit, detail, getData } from "@/api/biz/crm/fhsq";
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
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
    diaType: {
      type: Number,
      default: null
    },
    proDefId:{type: String, default: null},
    functionId:{type: String, default: null},
    nodeCode:{type: String, default: null},
    diaType:{type: Number, default: null}
  },
  components: {
    addDialog,
    zzfDialog
  },
  data() {
    return {
      ispc:12,
      labelPosition:'right',
      btnLoading:false,
      fieldPower:{},
      buttonList:{crm_fhsq_bfh:{show:true,action:[3]},crm_fhsq_rowAdd:{show:true,action:[1,2,4]},crm_fhsq_rowDel:{show:true,action:[1,2,4]},crm_fhsq_zzf:{show:true,action:[3]},crm_fhsq_cancel:{show:true,action:[1,2]},crm_fhsq_save:{show:true,action:[1,2,4]},crm_fhsq_submit:{show:true,action:[1,2]},crm_fhsq_sign:{show:true,action:[1,2,4]},crm_fhsq_unmark:{show:true,action:[1,2,4]}},
      jhsqDia: false,
      deliverySelect:[],
      jhsqSelectList:[],
      addList: {},
      dialogBfh: true,
      dialogzzf: true,
      bar: "",
      jhsqList: [],
      searchForm: {
        paperContractNo: "",
        salesOrderNum: ""
      },
      xsddId: "",
      fileListTwo: [],
      fileList: [],
      dataList: [],
      dataListTwo: [],
      paperContractNos: [],
      clientInfos: [],
      shippingLocations: [],
      chargePersons: [],
      freightTypes: [],
      CostBearDeptIds: [],
      statusOption: [],
      selectionList: [],
      chargePerson: {},
      editBtn: true,
      departmentName: "",
      dataId: "",
      mainId: "",
      mainIdTwo: "",
      dataSrcId: "CRM_SALES_DELIVERY",
      affixType: "CRM_SALES_DELIVERY#AFFIX_UPLOAD",
      dataSrcIdTwo: "CRM_SALES_DELIVERY",
      affixTypeTwo: "CRM_SALES_DELIVERY#SHIPPING_UPLOAD",
      rules: {
        deliveryType: [
          { required: true, message: "请选择发货类型", trigger: "blur" }
        ],
        paperContractNo: [
          { required: true, message: "请选择纸质合同号", trigger: "blur" }
        ],
        shippingLocation: [
          { required: true, message: "请选择装运地点", trigger: "blur" }
        ],
        receiveContact: [
          { required: true, message: "请输入收货联系人", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        detailAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        requireDeliveryDate: [
          { required: true, message: "请选择要求到货日期", trigger: "blur" }
        ],
        actualDeliveryDate: [
          { required: true, message: "请选择实际发货日期", trigger: "blur" }
        ],
        chargePerson: [
          { required: true, message: "请选择负责员工", trigger: "blur" }
        ],
        weight: [{ required: true, message: "请输入重量", trigger: "blur" }],
        kilometers: [
          { required: true, message: "请输入公里数", trigger: "blur" }
        ],
        freightType: [
          { required: true, message: "请选择货运类型", trigger: "blur" }
        ],
        logisticsCompany: [
          { required: true, message: "请选择物流公司", trigger: "blur" }
        ],
        agreementPrice: [
          { required: true, message: "请输入协议单价(元)", trigger: "blur" }
        ],
        agreementNum: [
          { required: true, message: "请输入协议价", trigger: "blur" }
        ],
        isPlace:[
          { required: true, message: "请选择货款是否到账"}
        ]
      }
    };
  },
  methods: {
    bfhOpen() {
      if(this.deliverySelect.length<1){
        this.$message({
            message: '请至少选择一条产品信息',
            type: "warning"
          });
      }else if(this.deliverySelect.length>0){
          setTimeout(() => {
            this.$refs.addLog.open(this.dialogBfh, this.addList,this.deliverySelect,'');
          }, 10);
      }
    },
    zzfOpen() {
      if(this.deliverySelect.length<1){
        this.$message({
            message: '请至少选择一条产品信息',
            type: "warning"
          });
      }else if(this.deliverySelect.length>0){
          setTimeout(() => {
            this.$refs.zzfLog.open(this.dialogzzf, this.addList,this.deliverySelect,'');
          }, 10);
      }
    },
    open(rowId, xsddId, diaType) {
      this.btnLoading=false
      this.addList = {
        createTime: "",
        createUserName: "",
        updateTime: "",
        updateUserName: "",
        flowStatus: "",
        deliveryType: "",
        shippingLocation: "",
        deliveryProductVOS: [],
        deliveryProductIds: []
      };
      this.paperContractNos = [];
      this.clientInfos = [];
      this.chargePersons = [];
      this.CostBearDeptIds = [];
      this.dataList = [];
      this.dataListTwo = [];
      this.fileList = [];
      this.fileListTwo = [];
        // 读取字段权限和按钮权限
      this.viewInit(this.$route.fullPath,"CRM_FHSQ",this.functionId,this.proDefId,this.nodeCode).then(res=>{
        // 动态处理字段和按钮
        this.dynamicView(this,"CRM_FHSQ",null,this.buttonList,this.fieldPower,res.data.data);
        this.dynamicShow(this.fieldPower, diaType, null, this.buttonList);
      });
      if (rowId == "") {
        this.getDefaultVal();
        if (xsddId != "") {
          getData(xsddId).then(res => {
            this.addList.paperContractNo = res.data.data.paperContractNo;
            this.addList.clientInfo = res.data.data.clientInfo;
            this.addList.clientName = res.data.data.clientName;
            this.addList.requireDeliveryDate =res.data.data.requestDeliveryDate;
            this.addList.chargePerson = res.data.data.chargePerson;
            this.addList.departmentName = res.data.data.departmentName;
            this.addList.departmentId = res.data.data.departmentId;
            this.addList.contractFreight =res.data.data.contractInfo.transportCost;
            this.addList.expenseFreight=res.data.data.contractInfo.freightPaid
            this.addList.deliveryProductVOS = JSON.parse(
              localStorage.getItem("xsdd")
            ).selectionList;
            this.addList.deliveryProductVOS.forEach(item => {
              this.$set(item, "id", "");
            });
            //纸质合同号
            if (this.addList.paperContractNo != "") {
              this.paperContractNos = [
                { paperContractNo: this.addList.paperContractNo }
              ];
            }
            //客户名称
            if (this.addList.clientInfo && this.addList.clientInfo != {}) {
              this.clientInfos.push(this.addList.clientInfo);
              this.clientInfos.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            }
            //负责员工
            if (this.addList.chargePerson && this.addList.chargePerson != {}) {
              this.chargePersons.push(this.addList.chargePerson);
              this.chargePersons.forEach(item => {
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              });
            }
          });
        }
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.mainId = this.addList.id;
          this.mainIdTwo = this.addList.id;
          this.init();
          this.initTwo();
          //纸质合同号
          if (this.addList.paperContractNo != "") {
            this.paperContractNos = [
              { paperContractNo: this.addList.paperContractNo }
            ];
          }
          //客户名称
          if (this.addList.clientInfo && this.addList.clientInfo != {}) {
            this.clientInfos.push(this.addList.clientInfo);
            this.clientInfos.forEach(item => {
              item.label = item.customerName;
              item.value = { customerName: item.customerName, id: item.id };
            });
          }
          //负责员工
          if (this.addList.chargePerson && this.addList.chargePerson != {}) {
            this.chargePersons.push(this.addList.chargePerson);
            this.chargePersons.forEach(item => {
              item.label = item.realName;
              item.value = {
                realName: item.realName,
                id: item.id
              };
            });
          }
          //费用承担部门
          if (
            this.addList.costBearDeptInfo &&
            this.addList.costBearDeptInfo != {}
          ) {
            this.CostBearDeptIds.push(this.addList.costBearDeptInfo);
            this.CostBearDeptIds.forEach(item => {
              item.value = { label: item.label, id: item.id };
            });
          }
        });
      }
    },
    //纸质合同号
    zzhth(query) {
      if (query != "") {
        getContractBySearch(query).then(res => {
          this.paperContractNos = res.data.data;
        });
      }
    },
    zzhthChange() {
      this.paperContractNos.forEach(item => {
        if (this.addList.paperContractNo == item.paperContractNo) {
          this.addList.clientName = item.clientName;
          this.addList.departmentName = item.departmentName;
          this.addList.departmentId = item.departmentId;
          this.addList.contractType = item.contractType;
          this.addList.clientClazz = item.clientClazz;
          this.addList.requireDeliveryDate = item.contractStart;
          this.addList.contractFreight = item.transportCost;
          this.addList.expenseFreight=item.freightPaid
          if (item.chargePerson.realName) {
            this.addList.chargePerson = item.chargePerson;
            this.chargePersons.push(item.chargePerson);
            this.chargePersons.forEach(item => {
              (item.label = item.realName),
                (item.value = { realName: item.realName, id: item.id });
            });
          }
        }
      });
    },
    //客户名称
    khmc(query) {
      if (query != "") {
        blurrySelect(query).then(res => {
          this.clientInfos = res.data.data;
          this.clientInfos.forEach(item => {
            let arr = {
              customerName: item.customerName,
              id: item.id
            };
            item.label = item.customerName;
            item.value = arr;
          });
        });
      }
    },
    //装运地点
    getshippingLocations() {
      getDictBizByCode("crm_shipping_Location").then(res => {
        this.shippingLocations = res.data.data;
      });
    },
    //负责员工
    fzyg(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.chargePersons = res.data.data;
          this.chargePersons.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
        });
      } else {
        this.chargePersons = [];
      }
    },
    fzygChange() {
      this.chargePersons.forEach(item => {
        if (this.addList.chargePerson.id == item.id) {
          this.addList.departmentName = item.deptName;
          this.addList.departmentId = item.deptId;
        }
      });
    },
    //货运类型
    getfreightTypes() {
      getDictBizByCode("crm_freight_type").then(res => {
        this.freightTypes = res.data.data;
      });
    },
    //费用承担部门
    fycdbm(query) {
      if (query != "") {
        deptByLabel(query).then(res => {
          this.CostBearDeptIds = res.data.data;
          this.CostBearDeptIds.forEach(item => {
            item.value = { label: item.label, id: item.id };
          });
        });
      }
    },
    //默认值
    getDefaultVal() {
      addDefaultVaule("CRM_SALES_DELIVERY").then(res => {
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.updateUserName = res.data.data.UPDATE_USER_NAME;
        this.addList.updateTime = res.data.data.UPDATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.deliveryType = res.data.data.DELIVERY_TYPE;
        this.addList.shippingLocation = res.data.data.SHIPPING_LOCATION;
      });
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    //协议价
    priceChange(){
        delete this.addList.agreementNum
        if(this.addList.weight!==''&&this.addList.kilometers!==''&&this.addList.agreementPrice!==''&&this.addList.weight!==undefined&&this.addList.kilometers!==undefined&&this.addList.agreementPrice!==undefined){
            this.addList.agreementNum=this.addList.weight*this.addList.kilometers*this.addList.agreementPrice
            this.addList.extendFreight=this.addList.expenseFreight+this.addList.agreementNum-this.addList.contractFreight
        }
    },
    search() {
      let params = {
        saleOrderId: this.xsddId,
        paperNo: this.searchForm.paperContractNo,
        orderNum: this.searchForm.salesOrderNum
      };
      createSalesDelivery(params).then(res => {
        this.jhsqList = res.data.data;
        this.$nextTick(() => {
          this.jhsqSelectList=[]
          if(this.jhsqList.length>0&&this.addList.deliveryProductVOS.length>0){
            this.jhsqList.forEach(item=>{
              this.addList.deliveryProductVOS.forEach(ele=>{
                if(item.id==ele.id){
                  this.$refs.multipleTables.toggleRowSelection(item,true);
                }
              })
            })
          }
        })
      });
    },
    //插入行
    cpxxAdd() {
      this.jhsqDia = true;
      this.jhsqSelectList=[];
      this.jhsqList=[];
      this.searchForm.paperContractNo = this.addList.paperContractNo;
      this.searchForm.salesOrderNum = "";
      this.search();
    },
    //删除行
    cpxxDel(row, index) {
      this.addList.deliveryProductVOS.splice(index, 1);
      if (row.id) {
        this.addList.deliveryProductIds.push(row.id);
      }
    },
    //产品信息选中
    deliverySelectChange(val){
      this.deliverySelect=val
    },
    jhsqSelectChange(val){
      this.jhsqSelectList=val
    },
    jhsqAdd(){
      this.jhsqDia=false
      if(this.jhsqSelectList.length>0&&this.addList.deliveryProductVOS.length>0){
        this.jhsqSelectList.forEach(item=>{
          this.addList.deliveryProductVOS.push(item)
        })
        for(var i=0;i<this.addList.deliveryProductVOS.length;i++){
          for(var p=i+1;p<this.addList.deliveryProductVOS.length;p++){
            if(this.addList.deliveryProductVOS[i].id==this.addList.deliveryProductVOS[p].id){
              this.addList.deliveryProductVOS.splice(p,1)
            }
          }
        }
      }
    },
    sumChange(row) {
      if (Number(row.orderTotal) - Number(row.requestSum) - Number(row.shippedSum) <0) {
        row.requestSum = Number(row.orderTotal) - Number(row.shippedSum);
        row.outstandingSum = 0;
      } else {
        row.outstandingSum =Number(row.orderTotal) -Number(row.requestSum) -Number(row.shippedSum);
      }
    },
    //缺货标记
    sign(){
      if(this.deliverySelect.length<1){
        this.$message({
                message: '至少选中一条产品信息',
                type: "warning"
              });
      }else{
        for(var i=0;i<this.deliverySelect.length;i++){
          for(var p=0;p<this.addList.deliveryProductVOS.length;p++){
            if(this.deliverySelect[i].id==this.addList.deliveryProductVOS[p].id){
               this.addList.deliveryProductVOS[p].outShippingMark='A'
            }
          }
        }
        this.$refs.multipleTable.clearSelection()
      }
    },
    //取消缺货标记
    unmark(){
      if(this.deliverySelect.length<1){
        this.$message({
                message: '至少选中一条产品信息',
                type: "warning"
              });
      }else{
        for(var i=0;i<this.deliverySelect.length;i++){
          for(var p=0;p<this.addList.deliveryProductVOS.length;p++){
            if(this.deliverySelect[i].id==this.addList.deliveryProductVOS[p].id){
               this.addList.deliveryProductVOS[p].outShippingMark=''
            }
          }
        }
        this.$refs.multipleTable.clearSelection()
      }
    },
    //取消
    close(formName) {
      this.turnoff();
      this.$refs[formName].resetFields();
      localStorage.removeItem("xsdd");
    },
    //保存
    subBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.affixUploadList = this.fileList;
          this.addList.shippingUploadList = this.fileListTwo;
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.turnoff();
              localStorage.removeItem("xsdd");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
            }
          });
        }
      });
    },
    //保存并提交
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.affixUploadList = this.fileList;
          this.addList.shippingUploadList = this.fileListTwo;
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getModel("CRM_SALES_DELIVERY");
              this.dataId = res.data.data;
              localStorage.removeItem("xsdd");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
            }
          });
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
        flowKey: "CRM_FHSQ_DART",
        formType: "S",
        modelId: id,
        dataId: this.dataId,
        variables: {
          functionPath:this.$route.fullPath
        }
      }).then(res => {
        this.$message({
          type: "success",
          message: res.data.msg
        });
        this.turnoff();
      });
    },
    //上传附件
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
      const fileSize = file.size / 1024 / 1024 < 60;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 60MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
    },
    //发送清单上传
    initTwo() {
      let obj = {
        dataId: this.mainIdTwo,
        dataSrcId: this.dataSrcIdTwo,
        affixType: this.affixTypeTwo
      };
      this.fileListTwo = [];
      this.dataListTwo = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileListTwo.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainIdTwo,
              isEdit: 1
            });
            this.dataListTwo.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadActionTwo(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcIdTwo);
      form.append("affixType", this.affixTypeTwo);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileListTwo.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixTypeTwo,
              dataSrcId: this.dataSrcIdTwo,
              fileName: res.data.data.originalFileName
            });
            this.dataListTwo.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixTypeTwo,
              dataSrcId: this.dataSrcIdTwo
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemoveTwo(file, fileList) {
      this.fileListTwo.forEach(ele => {
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
    handlePreviewTwo(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
          file.raw.fileId}&dataSrcId=${file.dataSrcId ||
          ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemoveTwo(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUploadTwo(file) {
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFileTwo(response, file, fileList) {
    }
  },
  created() {
    this.getshippingLocations();
    this.getfreightTypes();
    this.getStatus();
    if (this.detailId && this.detailId != "") {
      this.open(this.detailId,'',this.diaType);
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
<style scoped>
@import "./xmbdStyle/htps.scss";
</style>
