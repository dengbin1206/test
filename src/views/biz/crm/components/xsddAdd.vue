<template>
    <div>
             <template>
               <el-button type="primary" size="small" icon="el-icon-tickets" @click="jhsq" v-show="pass"  v-if='buttonList.crm_xsdd_jhsq.show'>创建交货申请</el-button>
            </template>
            <el-form :model="addList" :label-position="labelPosition"  :rules="rules" ref="ruleForm" label-width="150px"   class="sx_formItem">
                <el-row :gutter="20">
                  <h4>销售订单基本信息</h4>
                    <el-col :span="ispc?12:24">
                        <el-form-item label="订单类型:" prop="orderType" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','orderType')">
                            <el-select v-model="addList.orderType" size="small" placeholder="请选择订单类型" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','orderType')">
                                    <el-option
                                        v-for="item in orderTypes"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="销售组织:" prop="saleGroup" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','saleGroup')">
                            <el-select v-model="addList.saleGroup" size="small" placeholder="请选择销售组织" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','saleGroup')">
                                    <el-option
                                        v-for="item in saleGroups"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="排单类型:" prop="billingType" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','billingType')">
                            <el-radio-group v-model="addList.billingType" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','billingType')">
                                <el-radio label="1">正式排产</el-radio>
                                <el-radio label="2">预排设计</el-radio>
                                <el-radio label="3">特批<span style="color:red">(预付款未到)</span></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="纸质合同号:" prop="paperContractNo" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','paperContractNo')">
                            <el-select size="small" v-model="addList.paperContractNo" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="zzhth" style="width:100%" @change="zzhthChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','paperContractNo')">
                                <el-option
                                    v-for="item in paperContractNos"
                                    :key="item.id"
                                    :label="item.paperContractNo"
                                    :value="item.paperContractNo">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="销售订单号:" prop="salesOrderNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','salesOrderNum')">
                            <el-input size="small" v-model="addList.salesOrderNum"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','salesOrderNum',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="合同类型:" prop="contractType" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','contractType')">
                            <el-select size="small" v-model="addList.contractType" style="width:100%"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','contractType',0)">
                                <el-option label="正式" value="1"></el-option>
                                <el-option label="特批" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc?12:24">
                        <el-form-item label="客户名称:" prop="clientName" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','clientName')">
                            <el-input size="small" v-model="addList.clientName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','clientName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="负责员工:" prop="chargePerson" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','chargePerson')">
                            <el-select size="small" v-model="addList.chargePerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="fzyg" style="width:100%" @change="fzygChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','chargePerson')">
                                <el-option
                                    v-for="item in chargePersons"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="办事处:" prop="departmentName" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','departmentName')">
                            <el-input size="small" v-model="addList.departmentName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','departmentName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="请求交货日期:" prop="requestDeliveryDate"  v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','requestDeliveryDate')">
                            <el-date-picker
                                :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','requestDeliveryDate')"
                                v-model="addList.requestDeliveryDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                @change="requestDate"
                                placeholder="选择请求交货日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="客户级别:" prop="clientClazz" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','clientClazz')">
                            <el-select size="small" v-model="addList.clientClazz"  placeholder="请选择行业"  style="width:100%"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','clientClazz',0)">
                                <el-option
                                    v-for="item in clientClazzs"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="订单要求:" prop="orderRequire"  v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','orderRequire')">
                            <el-input size="small" v-model="addList.orderRequire" placeholder="请输入订单要求" type="textarea" rows="3" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','orderRequire')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="变更要求:" prop="alterRequire" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','alterRequire')">
                            <el-input size="small" v-model="addList.alterRequire" placeholder="请输入订单要求" type="textarea" rows="3" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','alterRequire')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                  <h4>单据基本信息</h4>
                    <el-col :span="ispc?12:24">
                        <el-form-item label="申请号:" prop="signNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','signNum')">
                            <el-input size="small" v-model="addList.signNum"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','signNum',0)"  placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="创建人:" prop="createUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','createUserName')">
                            <el-input size="small" v-model="addList.createUserName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','createUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="createTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','createTime')">
                            <el-input size="small" v-model="addList.createTime"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','createTime',0)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc?12:24">
                        <el-form-item label="变更人:" prop="updateUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','updateUserName')">
                            <el-input size="small" v-model="addList.updateUserName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','updateUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="变更结束时间:" prop="updateTime"  v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','updateTime')">
                            <el-input size="small" v-model="addList.updateTime"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','updateTime',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="审批状态:" prop="flowStatus" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','flowStatus')">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="请选择审批状态"  style="width:100%" clearable  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','flowStatus',0)">
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批结束时间:" prop="flowCompletedTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','flowCompletedTime')">
                            <el-date-picker
                                v-model="addList.flowCompletedTime"
                                type="datetime"
                                size='small'
                                 :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','flowCompletedTime',0)"
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择审批结束时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                  <h4>财务信息(<span style="color:red">单独权限</span>)</h4>
                    <el-col :span="ispc?12:24">
                        <el-form-item label="净值(万元):" prop="netWorth" v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','netWorth')">
                            <el-input size="small" v-model="addList.netWorth" placeholder="自动生成"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','netWorth',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="税额(万元):" prop="taxAmount"  v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','taxAmount')">
                            <el-input size="small" v-model="addList.taxAmount" placeholder="自动生成"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','taxAmount',0)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc?12:24">
                        <el-form-item label="含税金额(万元):" prop="includeTaxAmount"  v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','includeTaxAmount')">
                            <span style="width:70%;float:left">
                                <el-input size="small" v-model="addList.includeTaxAmount" placeholder="自动生成"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','includeTaxAmount',0)"></el-input>
                            </span>
                            <span style="width:26%;float:left;margin-left:4%">
                                <el-select v-model="addList.coinCategory" size="small">
                                    <el-option
                                        v-for="item in coinOption"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                            </span>
                        </el-form-item>
                        <el-form-item label="订单原因:" prop="orderReason"  v-if="this.dynamicFieldShow(fieldPower,'CRM_SXDD','orderReason')">
                            <el-input size="small" v-model="addList.orderReason" placeholder="请输入订单原因"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XSDD','orderReason')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                  <h4>产品信息</h4>
                    <el-col :span="24">
                        <el-button type="primary" size="small" icon="el-icon-plus" @click="saleAdd" style="margin-bottom:5px;"  v-if='buttonList.crm_xsdd_rowAdd.show'>插入行</el-button>
                        <el-table
                            class="sx_htps_cpxx"
                            :data="addList.saleProductInfoVOS"
                            :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                            :cell-style="{'text-align':'center'}"
                            max-height="370"
                            border
                            size='small'
                            style="width: 100%">
                            <el-table-column type='index' width="55"></el-table-column>
                            <el-table-column  prop="rowNum" label="行号" width="70"></el-table-column>
                            <el-table-column prop="markerNum" label="合同标的" width="170">
                              <template slot-scope="scope">
                                <el-select size="small" v-model="scope.row.markerNum" filterable remote reserve-keyword placeholder="请输入关键词" clearable :remote-method="(query)=>{htbdh(query,scope.row)}" style="width:100%" @change="htbdhChange(scope.row)">
                                  <el-option
                                      v-for="item in scope.row.markerNums"
                                      :key="item.markerNum"
                                      :label="item.markerNum"
                                      :value="item.markerNum">
                                  </el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column  prop="fanType" label="风机类型" width="150">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.fanType" placeholder="请选择风机类型" size="small" style="width:100%" clearable>
                                        <el-option v-for="item in fanTypes" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                              <el-table-column  prop="materialCode" label="物料编码" width="150"></el-table-column>
                            <el-table-column  prop="materialRemarks" label="物料描述" width="150"></el-table-column>
                            <el-table-column  prop="modelNum" label="型号" width="150"></el-table-column>
                            <el-table-column  prop="machineNum" label="机号" width="150"></el-table-column>
                            <el-table-column  prop="standards" label="规格" width="150"></el-table-column>
                            <el-table-column  prop="bladeForm" label="叶片形式" width="150"></el-table-column>
                            <el-table-column  prop="direction" label="方向" width="150"></el-table-column>
                            <el-table-column  prop="speed" label="转速(r/min)" width="150"></el-table-column>
                            <el-table-column  prop="airVolume" label="风量" width="150"></el-table-column>
                            <el-table-column  prop="totalPressure" label="全压(Pa)" width="150"></el-table-column>
                            <el-table-column  prop="staticPressure" label="静压(Pa)" width="150"></el-table-column>
                            <el-table-column  prop="temperature" label="温度(℃)" width="150"></el-table-column>
                            <el-table-column  prop="density" label="密度(Kg/m³)" width="150"></el-table-column>
                            <el-table-column  prop="appointBusiness" label="指定供应商" width="150">
                                <template slot-scope="scope"><el-input v-model="scope.row.appointBusiness" size="small" placeholder="请输入指定供应商"></el-input></template>
                            </el-table-column>
                            <el-table-column  prop="productNum" label="数量" width="150">
                                <template slot-scope="scope"><el-input v-model="scope.row.productNum" size="small" placeholder="请输入数量" type="number" @blur="priceChange"></el-input></template>
                            </el-table-column>
                            <el-table-column  prop="goodsUnit" label="单位" width="150"></el-table-column>
                            <el-table-column  prop="saleRowTex" label="销项税" width="150">
                              <template slot-scope="scope">
                                    <el-select v-model="scope.row.saleRowTex" placeholder="请选择销项税" size="small" style="width:100%" clearable>
                                        <el-option v-for="item in saleRowTexs" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="includeTexPrice" label="含税单价" width="150">
                                <template slot-scope="scope"><el-input v-model="scope.row.includeTexPrice" size="small" placeholder="请输入含税单价" type="number"  @blur="priceChange"></el-input></template>
                            </el-table-column>
                            <el-table-column  prop="totalTexNum" label="含税总价(元)" width="150"></el-table-column>
                            <el-table-column  prop="deliverFactory" label="发货工厂" width="150">
                                <template slot-scope="scope"><el-input v-model="scope.row.deliverFactory" size="small" placeholder="请输入发货工厂" type="number"></el-input></template>
                            </el-table-column>
                            <el-table-column  prop="storageLocation" label="库存地点" width="150">
                                <template slot-scope="scope"><el-input v-model="scope.row.storageLocation" size="small" placeholder="请输入库存地点" type="number"></el-input></template>
                            </el-table-column>
                            <el-table-column  prop="requestDeliverDate" label="请求交货日期" width="150">
                                <template slot-scope="scope">
                                    <el-date-picker
                                        v-model="scope.row.requestDeliverDate"
                                        type="date"
                                        size='small'
                                        format='yyyy-MM-dd'
                                        value-format='yyyy-MM-dd'
                                        style="width:100%"
                                        placeholder="选择交货日期">
                                    </el-date-picker>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="rejectReason" label="拒绝原因" width="150">
                                <template slot-scope="scope"><el-input v-model="scope.row.rejectReason" size="small" placeholder="请输入拒绝原因" type="number"></el-input></template>
                            </el-table-column>
                            <el-table-column label="操作"  width='80' fixed="right"   v-if='buttonList.crm_xsdd_rowDel.show'>
                                <template slot-scope="scope">
                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="saleDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px" v-if="ispc">
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check"  v-if='buttonList.crm_xsdd_save.show'>保存</el-button>
                <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check"  v-if='buttonList.crm_xsdd_submit.show'>保存并提交</el-button>
                <el-button @click="close('ruleForm')" size="small" icon="el-icon-close"   v-if='buttonList.crm_xsdd_cancel.show'>取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='!ispc'>
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check"  v-if='buttonList.crm_xsdd_save.show'>保存</el-button>
            </div>
            <el-dialog
              title="创建交货申请"
              :visible.sync="jhsqDia"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="70%">
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
                  <el-button type="primary" @click="jhsqSub" size="small" icon="el-icon-check" style="margin-bottom:5px;">确定</el-button>
                  <el-table :data="jhsqList" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%" @selection-change="handleSelectionChange">
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
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import {
  getContractBySearch,
  detail,
  submit,
  getData,
  createSalesDelivery,
  markerNumBySearch
} from "@/api/biz/crm/xsdd";
import { getUserInfoBySearch, addDefaultVaule } from "@/api/biz/crm/xmbd";
import { validate } from "json-schema";
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
    proDefId:{type: String, default: null},
    functionId:{type: String, default: null},
    nodeCode:{type: String, default: null},
    diaType:{type: Number, default: null}
  },
  data() {
    return {
      ispc:true,
      labelPosition:'right',
      btnLoading:false,
      buttonList: {
        crm_xsdd_jhsq: { show: true, action: [3] },
        crm_xsdd_rowAdd: { show: true, action: [1, 2, 4] },
        crm_xsdd_rowDel: { show: true, action: [1, 2, 4] },
        crm_xsdd_cancel: { show: true, action: [1, 2] },
        crm_xsdd_save: { show: true, action: [1, 2, 4] },
        crm_xsdd_submit: { show: true, action: [1, 2] }
      },
      fieldPower: {},
      jhsqDia: false,
      pass: false,
      jhsqList: [],
      dataId: "",
      rowId: "",
      fileList: [],
      dataList: [],
      dataId: "",
      addList: {},
      searchForm: {
        paperContractNo: "",
        salesOrderNum: ""
      },
      clientClazzs: [],
      orderTypes: [],
      saleGroups: [],
      paperContractNos: [],
      chargePersons: [],
      coinOption: [],
      fanTypes: [],
      statusOption: [],
      rules: [],
      saleRowTexs: [],
      selectionList: [],
      selectCopyPerson: [],
      dataSrcId: "CRM_XSDD",
      affixType: "CRM_XSDD#AFFIX_UPLOAD",
      rules: {
        orderType: [
          { required: true, message: "请选择订单类型", trigger: "blur" }
        ],
        saleGroup: [
          { required: true, message: "请选择销售组织", trigger: "blur" }
        ],
        paperContractNo: [
          { required: true, message: "请选择纸质合同号", trigger: "blur" }
        ],
        clientName: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        chargePerson: [
          { required: true, message: "请选择负责员工", trigger: "blur" }
        ],
        requestDeliveryDate: [
          { required: true, message: "请选择请求交货日期", trigger: "blur" }
        ],
        orderReason: [
          { required: true, message: "请输入订单原因", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    open(rowId, htId, diaType) {
      this.btnLoading=false
      this.fileList = [];
      this.dataList = [];
      this.paperContractNos = [];
      this.chargePersons = [];
      this.selectCopyPerson = [];
      this.addList = {
        createTime: "",
        createUserName: "",
        updateTime: "",
        updateUserName: "",
        flowStatus: "",
        orderType: "",
        saleGroup: "",
        billingType: "",
        coinCategory: "",
        saleProductInfoVOS: []
      };
      this.rowId = rowId;
      // 读取字段权限和按钮权限
      this.viewInit(
        this.$route.fullPath,
        "CRM_XSDD",
        this.functionId,
        this.proDefId,
        this.nodeCode
      ).then(res => {
        // 动态处理字段和按钮
        this.dynamicView(
          this,
          "CRM_XSDD",
          null,
          this.buttonList,
          this.fieldPower,
          res.data.data
        );
        // 读取字段权限和按钮权限
        this.viewInit(
          this.$route.fullPath,
          "CRM_XSDD",
          this.functionId,
          this.proDefId,
          this.nodeCode
        ).then(res => {
          // 动态处理字段和按钮
          this.dynamicView(
            this,
            "CRM_XSDD",
            null,
            this.buttonList,
            this.fieldPower,
            res.data.data
          );
          this.dynamicShow(this.fieldPower, diaType, null, this.buttonList);
        });
      });
      if (rowId == "") {
        this.$refs["ruleForm"].resetFields();
        this.pass = false;
        this.getDefaultVal();
        if (htId != "") {
          getData(htId).then(res => {
            console.log(res.data.data.clientInfo)
            this.addList.clientName = res.data.data.clientName;
            this.addList.clientInfo = res.data.data.clientInfo;
            this.addList.chargePerson = res.data.data.chargePerson;
            this.addList.departmentName = res.data.data.departmentName;
            this.addList.departmentId = res.data.data.departmentId;
            this.addList.clientClazz = res.data.data.clientClazz;
            this.addList.contractType = res.data.data.contractType;
            this.addList.paperContractNo = res.data.data.paperContractNo;
            this.addList.saleProductInfoVOS = JSON.parse(
              localStorage.getItem("htcp")
            ).selectionList;
            if (this.addList.saleProductInfoVOS.length > 0) {
              this.addList.saleProductInfoVOS.forEach(item => {
                this.$set(item, "saleRowTex", "0.13");
                this.$set(item, "id", "");
                this.$set(item, "includeTexPrice", 0);
                this.$set(item, "markerNums", [{ markerNum: item.markerNum }]);
              });
            }
            //负责员工
            if (this.addList.chargePerson != {}) {
              this.chargePersons.push(this.addList.chargePerson);
            }
            if (this.chargePersons.length > 0) {
              this.chargePersons.forEach(item => {
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              });
            }
            //纸质合同号
            if (this.addList.paperContractNo != "") {
              this.paperContractNos.push({
                paperContractNo: this.addList.paperContractNo
              });
            }
          });
        }
      } else {
        this.pass = true;
        detail(rowId).then(res => {
          if (res.data.code == 200) {
            this.addList = res.data.data;
            //纸质合同号
            if (this.addList.paperContractNo != "") {
              this.paperContractNos.push({
                paperContractNo: this.addList.paperContractNo
              });
            }
            //负责员工
            if (this.addList.chargePerson != {}) {
              this.chargePersons.push(this.addList.chargePerson);
            }
            if (this.chargePersons.length > 0) {
              this.chargePersons.forEach(item => {
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              });
            }
          }
        });
      }
    },
    getDefaultVal() {
      addDefaultVaule("CRM_XSDD").then(res => {
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.updateUserName = res.data.data.UPDATE_USER_NAME;
        this.addList.updateTime = res.data.data.UPDATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.orderType = res.data.data.ORDER_TYPE;
        this.addList.saleGroup = res.data.data.SALE_GROUP;
        this.addList.billingType = res.data.data.BILLING_TYPE;
        this.addList.coinCategory = res.data.data.COIN_CATEGORY;
      });
    },
    search() {
      let params = {
        saleOrderId: this.addList.id,
        paperNo: this.searchForm.paperContractNo,
        orderNum: this.searchForm.salesOrderNum
      };
      createSalesDelivery(params).then(res => {
        this.jhsqList = res.data.data;
        if(this.jhsqList.length<1){
          this.$message({
            message: "没有发货需求",
            type: "warning"
          });
        }else if(this.jhsqList.length>0){
          this.jhsqDia = true;
        }
      });
    },
    jhsq() {
      this.searchForm.paperContractNo = "";
      this.searchForm.salesOrderNum = "";
      this.search();
    },
    handleSelectionChange(val) {
      this.selectionList = val;
    },
    jhsqSub() {
      if (this.selectionList.length < 1) {
        this.$message({
          message: "至少选中一条产品信息",
          type: "warning"
        });
      } else {
        this.jhsqDia = false;
        this.turnoff();
        this.$router.push("/biz/crm/fhsq");
        let cpData = {
          rowId: this.rowId,
          selectionList: this.selectionList
        };
        localStorage.setItem("xsdd", JSON.stringify(cpData));
        localStorage.removeItem("htcp");
      }
    },
    //保存
    subBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.uploadFiles = this.fileList;
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.turnoff();
              localStorage.removeItem("htcp");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
            }
          });
        } else {
          return false;
        }
      });
    },
    //保存并提交
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.uploadFiles = this.fileList;
          submit(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("htcp");
              this.dataId = res.data.data;
              let flowKey = "";
              if (this.addList.flowStatus == "0") {
                if (this.addList.orderType == "1") {
                  if (this.addList.billingType == "1") {
                    flowKey = "CRM_XSDD_ZC_DART";
                    this.getModel("CRM_XSDD", flowKey);
                  } else if (this.addList.billingType == "2") {
                    flowKey = "";
                    this.turnoff();
                  } else if (this.addList.billingType == "3") {
                    flowKey = "CRM_XSDD_TP_DART";
                    this.getModel("CRM_XSDD", flowKey);
                  }
                } else if (this.addList.orderType == "2") {
                  flowKey = "CRM_XSDD_SHDD_DART";
                  this.getModel("CRM_XSDD", flowKey);
                }
              } else if (this.addList.flowStatus == "2"||this.addList.flowStatus == "5") {
                flowKey = "CRM_XSDD_BG_DART";
                this.getModel("CRM_XSDD", flowKey);
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取模型Id
    getModel(modelName, flowKey) {
      modelByName(modelName).then(res => {
        if (res.data.code == 200) {
          this.startFlow(res.data.data.id, flowKey);
        }
      });
    },
    //启动流程
    startFlow(id, flowKey) {
      startFlow({
        flowKey: flowKey,
        formType: "S",
        modelId: id,
        dataId: this.dataId,
        variables: {
          functionPath: this.$route.fullPath
        }
      }).then(res => {
        this.$message({
          type: "success",
          message: res.data.msg
        });
        this.turnoff();
      });
    },
    htbdh(query, row) {
      if (query != "") {
        markerNumBySearch(query, this.addList.paperContractNo).then(res => {
          this.$set(row, "markerNums", res.data.data);
        });
      }
    },
    htbdhChange(row) {
      row.markerNums.forEach(item => {
        if (item.markerNum == row.markerNum) {
          row.fanType = item.fanType;
          row.materialCode = item.materialCode;
          row.modelNum = item.modelNum;
          row.machineNum = item.machineNum;
          row.standards = item.standards;
          row.bladeForm = item.bladeForm;
          row.direction = item.direction;
          row.speed = item.speed;
          row.airVolume = item.airVolume;
          row.totalPressure = item.totalPressure;
          row.staticPressure = item.staticPressure;
          row.density = item.density;
          row.goodsUnit = item.goodsUnit;
          row.storogeLocation = item.storogeLocation;
          row.requestDeliverDate = item.requestDeliverDate;
          row.temperature = item.temperature;
        }
      });
    },
    sumChange(row) {
      if (
        Number(row.orderTotal) -
          Number(row.requestSum) -
          Number(row.shippedSum) <
        0
      ) {
        row.requestSum = Number(row.orderTotal) - Number(row.shippedSum);
        row.outstandingSum = 0;
      } else {
        row.outstandingSum =
          Number(row.orderTotal) -
          Number(row.requestSum) -
          Number(row.shippedSum);
      }
    },
    close(formName) {
      this.turnoff();
      this.$refs[formName].resetFields();
      localStorage.removeItem("htcp");
    },
    //订单类型
    getOrderTypes() {
      getDictBizByCode("crm_order_type").then(res => {
        this.orderTypes = res.data.data;
      });
    },
    priceChange() {
      let num = 0,
        wor = 0;
      for (var i = 0; i < this.addList.saleProductInfoVOS.length; i++) {
        this.addList.saleProductInfoVOS[i].totalTexNum = (
          Number(this.addList.saleProductInfoVOS[i].includeTexPrice) *
          Number(this.addList.saleProductInfoVOS[i].productNum)
        ).toFixed(2);
        this.addList.saleProductInfoVOS[i].netWorth =
          this.addList.saleProductInfoVOS[i].totalTexNum /
          (1 + Number(this.addList.saleProductInfoVOS[i].saleRowTex));
        num += Number(this.addList.saleProductInfoVOS[i].totalTexNum);
        wor += Number(this.addList.saleProductInfoVOS[i].netWorth);
      }
      this.$set(this.addList, "includeTaxAmount", (num * 0.0001).toFixed(6));
      this.$set(this.addList, "netWorth", (wor * 0.0001).toFixed(6));
      this.$set(
        this.addList,
        "taxAmount",
        ((num * 0.0001).toFixed(6) - (wor * 0.0001).toFixed(6)).toFixed(6)
      );
    },
    requestDate() {
      this.addList.saleProductInfoVOS.forEach(item => {
        item.requestDeliverDate = this.addList.requestDeliveryDate;
      });
    },
    //销售组织
    getSaleGroups() {
      getDictBizByCode("crm_sale_group").then(res => {
        this.saleGroups = res.data.data;
      });
    },
    //货币
    getCoin() {
      getDictBizByCode("bill-coin").then(res => {
        this.coinOption = res.data.data;
      });
    },
    //客户等级
    getclientClazzs() {
      getDictBizByCode("crm_client-grade").then(res => {
        this.clientClazzs = res.data.data;
      });
    },
    getsaleRowTexs() {
      getDictBizByCode("crm_sale_row_tex").then(res => {
        this.saleRowTexs = res.data.data;
      });
    },
    //风机类型
    getFanTypes() {
      getDictBizByCode("crm_product_type").then(res => {
        this.fanTypes = res.data.data;
      });
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
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
          this.addList.clientInfo = item.clientInfo;
          this.addList.departmentName = item.departmentName;
          this.addList.departmentId = item.departmentId;
          this.addList.contractType = item.contractType;
          this.addList.clientClazz = item.clientClazz;
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
    saleAdd() {
      this.addList.saleProductInfoVOS.push({
        requestDeliverDate: this.addList.requestDeliveryDate,
        productNum: 0,
        includeTexPrice: 0,
        totalTexNum: 0,
        saleRowTex: "0.13",
      });
      this.addList.saleProductInfoVOS.forEach((item,index)=>{
        item.rowNum=(index+1)*10
      })
    },
    saleDel(row, index) {
      this.addList.saleProductInfoVOS.splice(index, 1);
      if (row.id) {
        this.addList.delSaleProductInfoIds.push(row.id);
      }
      this.addList.saleProductInfoVOS.forEach((item,index)=>{
        item.rowNum=(index+1)*10
      })
    }
  },
  created() {
    this.getStatus();
    this.getOrderTypes();
    this.getSaleGroups();
    this.getCoin();
    this.getFanTypes();
    this.getclientClazzs();
    this.getsaleRowTexs();
    if (this.detailId && this.detailId != "") {
      this.open(this.detailId, "", this.diaType);
    }
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.ispc = false;
            this.labelPosition='left'
    } else {
            this.ispc = true;
            this.labelPosition='right'
    }
  }
};
</script>
<style scoped>
@import "./xmbdStyle/htps.scss";
</style>

