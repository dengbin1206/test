<template>
        <div>
            <template>
               <el-button type="primary" size="small" icon="iconfont iconicon_setting" @click="fkjdOpen">配置付款阶段</el-button>
               <el-button type="primary" size="small" icon="iconfont iconicon_scan_namecard" @click="ygxxOpen">维护员工信息</el-button>
               <el-button type="primary" size="small" icon="iconfont iconicon_coinpurse_line" @click="xsddOpen" v-if='buttonList.crm_htps_xsdd.show'>创建销售订单</el-button>
               <el-button type="primary" size="small" icon="iconfont icon-wxbgongju">返厂维修</el-button>
            </template>
            <el-form :model="addList" :label-position="labelPosition"  :rules="rules" ref="ruleForm" label-width="130px"   class="sx_formItem">
                <el-row :gutter="20">
                    <h4>合同基本信息</h4>
                    <el-col :span="ispc">
                        <el-form-item label="合同所属:" prop="contractOf" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractOf')">
                            <el-radio-group v-model="addList.contractOf" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractOf')">
                                <el-radio label="1">营销合同</el-radio>
                                <el-radio label="2">售后维保合同</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="客户级别:" prop="clientClazz" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','clientClazz')">
                            <el-select size="small" v-model="addList.clientClazz"  placeholder="请选择客户级别"  style="width:100%"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','clientClazz',0)">
                                <el-option
                                    v-for="item in clientClazzs"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户合同号:" prop="clientContractNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','clientContractNum')">
                            <el-input v-model="addList.clientContractNum" size='small' placeholder="请输入客户合同号" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','projectScale')"></el-input>
                        </el-form-item>
                        <el-form-item label="关联项目报登:" prop="projectReportNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','projectReportNum')">
                            <el-select size="small" v-model="addList.projectReportNum" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="proNum"  style="width:100%" @change="numChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','projectScale')">
                                <el-option
                                    v-for="item in numOption"
                                    :key="item.id"
                                    :label="item.projectReportNum"
                                    :value="item.projectReportNum">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户名称:" prop="clientInfo" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','clientInfo')">
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="khName" style="width:100%" @change="clientChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','clientInfo')">
                                <el-option
                                    v-for="item in khOption"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                      <el-form-item label="合同类型:" prop="contractType" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractType')">
                            <el-radio-group v-model="addList.contractType" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractType')">
                                <el-radio label="1">正式</el-radio>
                                <el-radio label="2">特批</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="行业:" prop="industry" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','industry')">
                            <el-select size="small" v-model="addList.industry"  placeholder="请选择行业"  style="width:100%" clearable @change="industryChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','industry')">
                                <el-option
                                    v-for="item in industrys"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="细分行业:" prop="segmentIndustry" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','segmentIndustry')">
                            <el-select size="small" v-model="addList.segmentIndustry"  placeholder="请选择细分行业"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','segmentIndustry')">
                                <el-option
                                    v-for="item in segmentIndustrys"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同签约公司:" prop="contractSign" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractSign')">
                            <el-select size="small" v-model="addList.contractSign" clearable  placeholder="请选择合同签约公司"  style="width:100%" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractSign')">
                                <el-option
                                    v-for="item in contractSigns"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择产品线经理:" prop="productManager" v-if="this.nodeAlias=='8'&&this.addList.flowStatus=='1'">
                            <el-select size="small" v-model="addList.productManager" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getproductManager" style="width:100%">
                                <el-option
                                    v-for="item in productManagers"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择后续审批人:" prop="assignPerson" v-if="this.addList.flowStatus=='4'&&this.nodeAlias=='5'">
                            <el-select size="small" v-model="addList.assignPerson" value-key="id" multiple filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getassignPerson" style="width:100%">
                                <el-option
                                    v-for="item in assignPersons"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <h4>单据基本信息</h4>
                    <el-col :span="ispc">
                        <el-form-item label="创建人:" prop="createUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','createUserName')">
                            <el-input size="small" v-model="addList.createUserName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','createUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="申请号:" prop="signNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','signNum')">
                            <el-input size="small" v-model="addList.signNum"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','signNum',0)" placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="纸质合同号:" prop="paperContractNo" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','paperContractNo')">
                            <el-input size="small" v-model="addList.paperContractNo"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','paperContractNo',0)" placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="负责员工:" prop="chargePerson" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','chargePerson')">
                            <el-select size="small" v-model="addList.chargePerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="charge" style="width:100%" @change="chargeChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','chargePerson')">
                                <el-option
                                    v-for="item in charges"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="办事处:" prop="departmentName" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','departmentName')">
                            <el-input size="small" v-model="addList.departmentName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','departmentName',0)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="创建时间:" prop="createTime"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','createTime')">
                            <el-date-picker
                                 :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','createTime',0)"
                                v-model="addList.createTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择审创建时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="变更人:" prop="updateUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','updateUserName')">
                            <el-input size="small" v-model="addList.updateUserName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','updateUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="变更结束时间:" prop="updateTime"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','updateTime')">
                            <el-date-picker
                                v-model="addList.updateTime"
                                 :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','updateTime',0)"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择变更时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="审批状态:" prop="flowStatus" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','flowStatus')">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="请选择审批状态"  style="width:100%" clearable  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','flowStatus',0)">
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批结束时间:" prop="flowCompletedTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','flowCompletedTime')">
                            <el-date-picker
                                v-model="addList.flowCompletedTime"
                                type="datetime"
                                size='small'
                                 :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','flowCompletedTime',0)"
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择审批结束时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <h4>合同详细内容</h4>
                    <el-col :span="ispc">
                        <el-form-item label="合同生效日期:" prop="contractStart" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractStart')">
                                <el-date-picker
                                    :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractStart')"
                                    v-model="addList.contractStart"
                                    type="date"
                                    size='small'
                                    format='yyyy-MM-dd'
                                    value-format='yyyy-MM-dd'
                                    placeholder="选择合同生效日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="合同交货期:" prop="contractDelivery" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractDelivery')">
                            <li style="width:40%;float:left;list-style:none">
                                <el-select v-model="addList.contractDelivery" size="small" style="width:100%" placeholder="请选择合同交货期" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractDelivery')">
                                    <el-option
                                        v-for="item in contracts"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                            </li>
                            <li style="width:33%;float:left;list-style:none;margin-left:3%">
                                <el-date-picker
                                    :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','deliveryDate')"
                                    v-model="addList.deliveryDate"
                                    type="date"
                                    size='small'
                                    format='yyyy-MM-dd'
                                    value-format='yyyy-MM-dd'
                                    placeholder="选择合同生效日期">
                                </el-date-picker>
                            </li>
                            <li style="width:17%;float:left;list-style:none;margin-left:3%">
                                <el-input v-model="addList.deliveryDays" size="small" style="width:100%" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','deliveryDays')"></el-input>
                            </li>
                            <li style="width:3%;float:left;list-style:none">
                                天
                            </li>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="交货:省/直辖市" prop="provinceOfProject" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','provinceOfProject')">
                            <el-select size="small" v-model="addList.provinceOfProject"  placeholder="请选交货:省/直辖市"  style="width:100%" clearable @change="getCityLevels" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','provinceOfProject')">
                                <el-option
                                    v-for="item in countyOption"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="交货:地区市:" prop="cityLevel"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','cityLevel')">
                            <el-select size="small" v-model="addList.cityLevel"  placeholder="请选交货:地区市"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','cityLevel')">
                                <el-option
                                    v-for="item in cityLevels"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style='margin-top:5px;'>
                        <el-form-item label="交货说明:" prop="deliveryRemarks"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','deliveryRemarks')">
                            <el-input type="textarea" rows="3" size="small" v-model="addList.deliveryRemarks" placeholder="请输入交货说明" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','deliveryRemarks')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style='margin-top:5px;'>
                        <el-form-item label="合同备注:" prop="contractRemark"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractRemark')">
                            <el-input type="textarea" rows="3" size="small" v-model="addList.contractRemark" placeholder="请输入合同备注" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractRemark')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <h4>合同特殊要求</h4>
                    <el-col :span="24">
                        <el-form-item label="合同分配:" prop="contractAssign" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','contractAssign')">
                            <el-radio-group v-model="addList.contractAssign" size="small" @change="contractAssignChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','contractAssign')">
                                <el-radio label="1">不需要</el-radio>
                                <el-radio label="2">需要</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc" v-if="addList.contractAssign=='2'">
                        <el-form-item label="选择人员:" prop="selectPersonId" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','selectPersonId')">
                            <el-select size="small" v-model="addList.selectPersonId" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getselectPersonId" style="width:100%" @change="selectPersonIdChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','selectPersonId')">
                                <el-option
                                    v-for="item in selectPersonIds"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc" v-if="addList.contractAssign=='2'">
                        <el-form-item label="办事处:" prop="selectDeptName" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','selectDeptName')">
                              <el-input size="small" v-model="addList.selectDeptName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','selectDeptName',0)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="ispc">
                        <el-form-item label="合同等上传:">
                            <el-upload
                                    class="upload-demo"
                                    :http-request="uploadAction"
                                    action="aaa"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-remove="beforeRemove"
                                    :before-upload="beforeUpload"
                                    :on-success="uploadSuccessFile"
                                    :file-list="fileList"
                                >
                                    <el-button size="small" type="primary"  v-if='buttonList.crm_htps_upload.show'>上传文件</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <h4>核算内容</h4>
                    <el-col :span="ispc">
                        <el-form-item label="合同总金额(万元):" prop="totalAmount" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','totalAmount')">
                            <el-input size="small" v-model="addList.totalAmount" type="number"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','totalAmount',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="运输费(元):" prop="transportCost" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','transportCost')">
                            <el-input size="small" v-model="addList.transportCost"  type="number" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','transportCost')"></el-input>
                        </el-form-item>
                        <el-form-item label="中标服务费(元):" prop="serviceCost" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','serviceCost')">
                            <el-input size="small" v-model="addList.serviceCost" type="number" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','serviceCost')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                      <el-form-item label="货币:" prop="coinCategory" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','coinCategory')">
                            <el-select v-model="addList.coinCategory" size="small"  type="number" style="width:100%" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','coinCategory')">
                                <el-option
                                    v-for="item in coinCategorys"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="包装费(元):" prop="packingCost" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','packingCost')">
                            <el-input size="small" v-model="addList.packingCost"  type="number" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','packingCost')"></el-input>
                        </el-form-item>
                        <el-form-item label="成本(元):" prop="finalCost" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','finalCost')">
                            <el-input size="small" v-model="addList.finalCost" type="number" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','finalCost')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                         <el-table
                            class="sx_xmbdTable"
                            :data="addList.businessAccounts"
                            :header-cell-style="{'background':'rgb(250, 250, 250)'}"
                            :cell-style="{'text-align':'center'}"
                            border
                            size='small'
                            height="200"
                            style="width: 100%">
                            <el-table-column
                                prop="accountSchema"
                                label="核算方案">
                            </el-table-column>
                            <el-table-column
                                prop="bodyProfit"
                                label="整机毛利">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.bodyProfit" type="number"><template slot="append">%</template></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="mainProfit"
                                label="主机毛利">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.mainProfit" type="number"><template slot="append">%</template></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="mainProportion"
                                label="主机比例">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.mainProportion" type="number"><template slot="append">%</template></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <h4>开票与回款</h4>
                    <el-col :span="ispc">
                        <el-form-item label="付款方式:" prop="paymentMethod" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','paymentMethod')">
                            <el-select size="small" v-model="addList.paymentMethod"   placeholder="请选择行业"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','paymentMethod')">
                                <el-option
                                    v-for="item in paymentMethods"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="纳税人识别号:" prop="taxNum" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','taxNum')">
                            <el-input size="small" v-model="addList.taxNum"  placeholder="请输入" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','taxNum')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="开户行:" prop="bankName"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','bankName')">
                            <el-input size="small" v-model="addList.bankName" placeholder="请输入" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_HTSP','bankName')"></el-input>
                        </el-form-item>
                        <el-form-item label="开户账号:" prop="bankAndAccount" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','bankAndAccount')">
                            <el-input size="small" v-model="addList.bankAndAccount"  placeholder="请输入" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','bankAndAccount')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="电话:" prop="telephone" v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','telephone')">
                            <el-input size="small" v-model="addList.telephone"  placeholder="请输入" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','telephone')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="详细地址:" prop="detailAddress"  v-if="this.dynamicFieldShow(fieldPower,'CRM_HTSP','detailAddress')">
                            <el-input type="textarea" rows="3" size="small" v-model="addList.detailAddress" placeholder="请输入详细地址" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','detailAddress')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                                <h4>
                                    偏离项统计
                                </h4>
                                    <el-button type="primary" size="small" icon="el-icon-plus" @click="deflectAdd" style="margin-bottom:5px;"  v-if='buttonList.crm_htps_rowAdd.show'>插入行</el-button>
                                    <el-table
                                        :data="addList.deflectStatisticsVOS"
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        border
                                        max-height="370"
                                        size='small'
                                        style="width: 100%">
                                        <el-table-column
                                        type='index'
                                        width="55">
                                        </el-table-column>
                                        <el-table-column
                                        prop="bodyProfit"
                                        label="原文条款(含单一供方)">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.bodyProfit" size="small"  placeholder="请输入原文条款"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="putPerson"
                                        label="提出人">
                                            <template slot-scope="scope">
                                              <el-select size="small" v-model="scope.row.putPerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词"  :remote-method="(query)=>{getPutPersons(query,scope.row)}" style="width:100%">
                                                    <el-option
                                                        v-for="item in scope.row.putPersons"
                                                        :key="item.id"
                                                        :label="item.label"
                                                        :value="item.value">
                                                        <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="deflectAssign"
                                        label="偏离项评审意见">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.deflectAssign" size="small" placeholder="请输入偏离项评审意见"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="isDeflect"
                                        label="是否同意偏离">
                                            <template slot-scope="scope">
                                                <el-select size="small" v-model="scope.row.isDeflect" clearable>
                                                    <el-option
                                                        v-for="item in isDeflects"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="conclusion"
                                        label="结论说明">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.conclusion" size="small" placeholder="请输入结论说明"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80' fixed="right" v-if="buttonList.crm_htps_rowDel.show">
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="deflectDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                                </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-form-item label="附件上传:" >
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
                    <el-col :span="24">
                                <h4>
                                    合同分配给其他办事处
                                </h4>
                                    <el-button type="primary" size="small" icon="el-icon-plus" @click="distributeAdd" style="margin-bottom:5px;" v-if='buttonList.crm_htps_rowAdd.show'>插入行</el-button>
                                    <el-table
                                        :data="addList.contractDistributeVOS"
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        border
                                        max-height="370"
                                        size='small'
                                        style="width: 100%">
                                        <el-table-column
                                        type='index'
                                        width="55">
                                        </el-table-column>
                                        <el-table-column
                                        prop="chargePerson"
                                        label="负责员工 ">
                                            <template slot-scope="scope">
                                                <el-select size="small" v-model="scope.row.chargePerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="(query)=>{chargeStaff(query,scope.row)}" style="width:100%" @change="chargeStaffChange(scope.row)">
                                                    <el-option
                                                        v-for="item in scope.row.chargeStaffs"
                                                        :key="item.id"
                                                        :label="item.label"
                                                        :value="item.value">
                                                        <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="departmentName"
                                        label="办事处">
                                        </el-table-column>
                                        <el-table-column
                                        prop="distributeProportion"
                                        label="分配比例">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.distributeProportion" size="small" placeholder="请输入分配比例" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="distributeAmount"
                                        label="分配金额">
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80' fixed="right" v-if='buttonList.crm_htps_rowDel.show'>
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="distributeDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                                </template>
                                        </el-table-column>
                                    </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                                <h4>
                                    现金流计划
                                </h4>
                                    <el-button type="primary" size="small" icon="el-icon-plus" @click="xjljhAdd" style="margin-bottom:5px;" v-if='buttonList.crm_htps_rowAdd.show'>插入行</el-button>
                                    <el-table
                                        :data="addList.cashFlowPlanVOList"
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        border
                                        max-height="370"
                                        size='small'
                                        style="width: 100%;">
                                        <el-table-column
                                        type='index'
                                        width="55">
                                        </el-table-column>
                                        <el-table-column
                                        prop="paymentStageId"
                                        label="付款阶段 "
                                        width="120">
                                            <template slot-scope="scope">
                                                <span v-if="scope.$index==0">总价</span>
                                                <el-select size="small" v-model="scope.row.paymentStageId" clearable v-if="scope.$index!=0" @change="paymentStageIdChange(scope.row)">
                                                    <el-option
                                                        v-for="item in payments"
                                                        :key="item.id"
                                                        :label="item.stageRemarks"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="returnPercent"
                                        label="总价/回款比例"
                                        width="150"
                                        >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.returnPercent" size="small" placeholder="请输入回款" type="number"  v-if="scope.$index==0"></el-input>
                                                <el-input v-model="scope.row.returnPercent" size="small" placeholder="请输入回款比例" type="number"  v-if="scope.$index!=0" @input="PercentChange" :disabled="scope.row.disabled"><template slot="append">%</template></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="returnStartPoint"
                                        label="回款起始阶段"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-select size="small" v-model="scope.row.returnStartPoint" clearable  v-if="scope.$index!=0">
                                                    <el-option
                                                        v-for="item in payments"
                                                        :key="item.id"
                                                        :label="item.stageRemarks"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="afterGoodsTrim"
                                        label="发货后周期(天)"
                                        width="120">
                                            <template slot-scope="scope">
                                              <span ></span>
                                                <el-input v-model="scope.row.afterGoodsTrim" size="small" placeholder="请输入发货后周期" type="number"  v-if="scope.$index!=0" disabled></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="hostPayment"
                                        label="主机付款比例"
                                        width='150'>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.hostPayment" size="small" placeholder="请输入主机付款" type="number" v-if="scope.$index==0"></el-input>
                                                <el-input v-model="scope.row.hostPayment" size="small" placeholder="请输入主机付款比例" type="number"  v-if="scope.$index!=0" @input="hostmentChange" :disabled='scope.row.hostDis'><template slot="append">%</template></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="motorPayment"
                                        label="电机付款比例"
                                        width="150"
                                        >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.motorPayment" size="small" placeholder="请输入电机付款" type="number"  v-if="scope.$index==0"></el-input>
                                                <el-input v-model="scope.row.motorPayment" size="small" placeholder="请输入电机付款比例" type="number"  v-if="scope.$index!=0" @input="motomentChange" :disabled='scope.row.motoDis'><template slot="append">%</template></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="abnormalPayment"
                                        label="异常部件付款比例"
                                        width="150"
                                        >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.abnormalPayment" size="small" placeholder="请输入异常部件付款" type="number"  v-if="scope.$index==0"></el-input>
                                                <el-input v-model="scope.row.abnormalPayment" size="small" placeholder="请输入异常部件付款比例" type="number" v-if="scope.$index!=0"  @input="abnomentChange" :disabled='scope.row.abnoDis'><template slot="append">%</template></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="expenses"
                                        label="费用支出比例"
                                        width="150"
                                        >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.expenses" size="small" placeholder="请输入费用支出" type="number"  v-if="scope.$index==0"></el-input>
                                                <el-input v-model="scope.row.expenses" size="small" placeholder="请输入费用支出比例" type="number" v-if="scope.$index!=0" @input="expementChange" :disabled='scope.row.expeDis'><template slot="append">%</template></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="cashFLow"
                                        label="现金流(累计)"
                                        width="120">
                                            <template slot-scope="scope">
                                              <span v-if="scope.$index==0">{{scope.row.returnPercent-scope.row.hostPayment-scope.row.motorPayment-scope.row.abnormalPayment-scope.row.expenses}}</span>
                                              <span v-if="scope.$index!=0">{{(scope.row.returnPercent*addList.cashFlowPlanVOList[0].returnPercent/100-scope.row.hostPayment*addList.cashFlowPlanVOList[0].hostPayment/100-scope.row.motorPayment*addList.cashFlowPlanVOList[0].motorPayment/100-scope.row.abnormalPayment*addList.cashFlowPlanVOList[0].abnormalPayment/100-scope.row.expenses*addList.cashFlowPlanVOList[0].expenses/100).toFixed(2)}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80' fixed="right"  v-if="buttonList.crm_htps_rowDel.show">
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="xjljhDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                                </template>
                                        </el-table-column>
                                    </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                            <h4>
                                        产品信息
                                    </h4>
                                    <el-button type="primary" size="small" icon="el-icon-plus" @click="cpxxAdd" style="margin-bottom:5px;" v-if='buttonList.crm_htps_rowAdd.show'>插入行</el-button>
                                    <el-table
                                        class="sx_htps_cpxx"
                                        :data="addList.productContractInfoVOS"
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        border
                                        max-height="370"
                                        style="width:100%"
                                        size='small'>
                                        <el-table-column
                                        type='index'
                                        width="55">
                                        </el-table-column>
                                        <el-table-column
                                        prop="markerNum"
                                        label="标的号"
                                        width="150">
                                        </el-table-column>
                                        <el-table-column
                                        prop="modelNum"
                                        label="型号"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.modelNum" size="small" placeholder="请输入型号"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="machineNum"
                                        label="机号"
                                        width="150">
                                            <template slot-scope="scope">
                                              <el-input v-model="scope.row.machineNum" size="small" placeholder="请输入机号"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="standards"
                                        label="规格"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.standards" size="small" placeholder="请输入规格"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="bladeForm"
                                        label="叶片形式"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.bladeForm" size="small" placeholder="请输入叶片形式"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="direction"
                                        label="方向"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.direction" size="small" placeholder="请输入方向"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="speed"
                                        label="转速(r/min)"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.speed" size="small" placeholder="请输入转速(r/min)" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="airVolume"
                                        label="分量"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.airVolume" size="small" placeholder="请输入分量" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="totalPressure"
                                        label="全压(Pa)"
                                        width='150'>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.totalPressure" size="small" placeholder="请输入静压(Pa)" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="staticPressure"
                                        label="静压(Pa)"
                                        width='150'>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.staticPressure" size="small" placeholder="请输入静压(Pa)" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="temperature"
                                        label="温度(℃)"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.temperature" size="small" placeholder="请输入温度(℃)" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="density"
                                        label="密度(Kg/m³)"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.density" size="small" placeholder="请输入密度(Kg/m³)" type="number"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productLine"
                                        label="产品线">
                                            <template slot-scope="scope">
                                                
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="fanType"
                                        label="风机类型"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-select size="small" v-model="scope.row.fanType" clearable>
                                                    <el-option
                                                        v-for="item in fanTypes"
                                                        :key="item.dictKey"
                                                        :label="item.dictValue"
                                                        :value="item.dictKey">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productRemarks"
                                        label="产品描述"
                                        width="200">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.productRemarks" size="small" placeholder="请输入产品描述"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productNum"
                                        label="数量"
                                        width="150">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.productNum" size="small" placeholder="请输入数量" type="number" @input="blur"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="singlePrice"
                                        label="单价"
                                        width="200">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.singlePrice" size="small" placeholder="请输入单价" type="number" @input="blur"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="totalAmount"
                                        label="金额"
                                        width="250">
                                        </el-table-column>
                                        <el-table-column
                                        prop="rejectReason"
                                        label="拒绝原因"
                                        width="250">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.rejectReason" size="small" placeholder="请输入拒绝原因"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80' fixed="right"  v-if="buttonList.crm_htps_rowDel.show">
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="cpxxDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                                </template>
                                        </el-table-column>
                                    </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px"  v-if='ispc==12'>
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if='buttonList.crm_htps_save.show'>保存</el-button>
                <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if="buttonList.crm_htps_submit.show">保存并提交</el-button>
                <el-button @click="close('ruleForm')" size="small" icon="el-icon-close"  v-if='buttonList.crm_htps_cancel.show'>取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
                <el-button type="primary" @click="subBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check" v-if='buttonList.crm_htps_save.show'>保存</el-button>
            </div>
            <el-dialog
              title="配置付款阶段"
              :visible.sync="pzfkjd"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="70%">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="fkjdAdd" style="margin-bottom:5px;" v-if='buttonList.crm_htps_rowAdd.show'>插入行</el-button>
                  <el-table :data="fkjdData.paymentStageList" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%">
                      <el-table-column
                        type='index'
                        width="55">
                      </el-table-column>
                      <el-table-column
                        prop="stageNum"
                        label="编号">
                        <template  slot-scope="scope">
                               <el-input size="small" v-model="scope.row.stageNum" placeholder="请输入编号"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="stageRemarks"
                        label="付款阶段描述">
                            <template  slot-scope="scope">
                               <el-input size="small" v-model="scope.row.stageRemarks" placeholder="请输入付款描述阶段"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="paymentStartStage"
                        label="付款起始阶段">
                            <template  slot-scope="scope">
                               <el-input size="small" v-model="scope.row.paymentStartStage" placeholder="请输入付款起始阶段"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="paymentTrim"
                        label="周期(天数)">
                            <template  slot-scope="scope">
                               <el-input size="small" v-model="scope.row.paymentTrim" placeholder="请输入周期(天数)" type="number"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="validUntil"
                        label="有效截止日期"
                        width='150'>
                            <template  slot-scope="scope">
                               <el-date-picker
                                v-model="scope.row.validUntil"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择有效截止日期">
                            </el-date-picker>
                            </template>
                      </el-table-column>
                      <el-table-column label="操作"  width='80'  v-if='buttonList.crm_htps_rowDel.show'>
                            <template slot-scope="scope">
                                  <el-button icon='el-icon-delete' size="small" type="text"  @click="fkjdDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                            </template>
                      </el-table-column>
                  </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="fkjdSub" size="small" icon="el-icon-check" v-if='buttonList.crm_htps_save.show'>保 存</el-button>
                <el-button @click="pzfkjd = false" size="small" icon="el-icon-close" v-if='buttonList.crm_htps_cancel.show'>取 消</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="维护员工信息"
              :visible.sync="whygxx"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="70%">
                  <el-button type="primary" size="small" icon="el-icon-plus" @click="ygxxAdd" style="margin-bottom:5px;" v-if='buttonList.crm_htps_rowAdd.show'>插入行</el-button>
                  <el-table :data="ygxxData.employeeInfoVOS" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%">
                      <el-table-column
                        type='index'
                        width="55">
                      </el-table-column>
                      <el-table-column
                        prop="employeeNum"
                        label="员工号">
                        <template  slot-scope="scope">
                               <el-input size="small" v-model="scope.row.employeeNum" placeholder="请输入员工号"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="chargeCodes"
                        label="员工编码(编号)">
                            <template slot-scope="scope">
                                <el-select size="small" v-model="scope.row.chargeCodes" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="(query)=>{getChargePerson(query,scope.row)}" style="width:100%" @change="chargePersonChange(scope.row)">
                                    <el-option
                                        v-for="item in scope.row.chargePersons"
                                        :key="item.id"
                                        :label="item.account"
                                        :value="item.value">
                                        <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                    </el-option>
                                </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column
                        prop="chargeNames"
                        label="员工姓名">
                            <template slot-scope="scope">
                                <el-select size="small" v-model="scope.row.chargeNames" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="(query)=>{getChargePerson(query,scope.row)}" style="width:100%" @change="employeeNameChange(scope.row)">
                                    <el-option
                                        v-for="item in scope.row.chargePersons"
                                        :key="item.id"
                                        :label="item.realName"
                                        :value="item.value">
                                        <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                    </el-option>
                                </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column
                        prop="departmentName"
                        label="部门(办事处)">
                            <template  slot-scope="scope">
                               <el-input size="small" v-model="scope.row.departmentName" placeholder="请输入部门(办事处)"></el-input>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="isValid"
                        label="是否有效"
                        width="80">
                            <template  slot-scope="scope">
                               <el-select size="small" v-model="scope.row.isValid" placeholder="请选择是否有效" clearable>
                                 <el-option
                                    v-for="item in isDeflects"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                               </el-select>
                            </el-date-picker>
                            </template>
                      </el-table-column>
                      <el-table-column
                        prop="alterDate"
                        label="更改日期">
                      </el-table-column>
                      <el-table-column label="操作"  width='80'  v-if='buttonList.crm_htps_rowDel.show'>
                            <template slot-scope="scope">
                                  <el-button icon='el-icon-delete' size="small" type="text"  @click="ygxxDel(scope.row,scope.$index)" style="color:red" v-if='buttonList.crm_htps_rowDel.show'>删除</el-button> 
                            </template>
                      </el-table-column>
                  </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ygxxSub" size="small" icon="el-icon-check" v-if='buttonList.crm_htps_save.show'>保 存</el-button>
                <el-button @click="whygxx = false" size="small" icon="el-icon-close" v-if='buttonList.crm_htps_cancel.show'>取 消</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="创建销售订单"
              :visible.sync="cjxsdd"
              append-to-body
              top='30px'
              :close-on-click-modal='false'
              width="70%">
                  <el-button type="primary" @click="xsddSub" size="small" icon="el-icon-check" style="margin-bottom:5px;" v-if='buttonList.crm_htps_xsdd.show'>生成销售订单</el-button>
                  <el-table :data="xsddList" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}" border size='small' height="500" style="width: 100%" @selection-change="handleSelectionChange">
                      <el-table-column
                        type="selection"
                        width="55">
                      </el-table-column>
                      <el-table-column
                        type='index'
                        width="55">
                      </el-table-column>
                                        <el-table-column
                                        prop="markerNum"  
                                        label="标的号">
                                        </el-table-column>
                                        <el-table-column
                                        prop="modelNum"
                                        label="型号">
                                        </el-table-column>
                                        <el-table-column
                                        prop="availableQuantity"
                                        label="可用数量">
                                        </el-table-column>
                                        <el-table-column
                                        prop="releasedQuantity"
                                        label="已下达数量">
                                        </el-table-column>
                                        <el-table-column
                                        prop="totalQuantity"
                                        label="总数量">
                                        </el-table-column>
                                        <el-table-column
                                        prop="productLine"
                                        label="产品线">
                                        </el-table-column>
                                        <el-table-column
                                        prop="fanType"
                                        label="风机类型">
                                            <template slot-scope="scope">
                                                <el-select size="small" v-model="scope.row.fanType" disabled>
                                                    <el-option
                                                        v-for="item in fanTypes"
                                                        :key="item.dictKey"
                                                        :label="item.dictValue"
                                                        :value="item.dictKey">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="productRemarks"
                                        label="产品描述">
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
  getUserInfoBySearch,
  blurrySelect,
  state,
  addDefaultVaule,
  dictionary_group
} from "@/api/biz/crm/xmbd";
import { getProjectInfo } from "@/api/biz/crm/quote";
import {
  detail,
  saveAndUpdate,
  payment,
  saveOrUpdate,
  employeeSave,
  employeeList,
  saleList,
  getData
} from "@/api/biz/crm/htps";
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
      ispc:12,
      labelPosition:'right',
      btnLoading:false,
      buttonList:{crm_htps_xsdd:{show:true,action:[2,3]},crm_htps_upload:{show:true,action:[1,2,4]},crm_htps_rowAdd:{show:true,action:[1,2,4]},crm_htps_cancel:{show:true,action:[1,2]},crm_htps_save:{show:true,action:[1,2,4]},crm_htps_submit:{show:true,action:[1,2]},crm_htps_rowDel:{show:true,action:[1,2,4]}},
      rowId: "",
      fieldPower:{},
      fileList: [],
      dataList: [],
      fileListTwo: [],
      dataListTwo: [],
      dataSrcIdTwo: "CRM_HTPS",
      affixTypeTwo: "CRM_HTPS#DEFLECT_UPLOAD",
      dataId: "",
      addList: {},
      tabData: {},
      dataSrcId: "CRM_HTPS",
      affixType: "CRM_HTPS#AFFIX_UPLOAD",
      mainId: "",
      charges: [],
      selectSigns:[],
      industrys: [],
      segmentIndustrys: [],
      contractSigns: [],
      contracts: [],
      khOption: [],
      statusOption: [],
      quotation: [],
      coinOption: [],
      quotaTime: [],
      produceOption: [],
      numOption: [],
      countyOption: [],
      cityLevels: [],
      coinCategorys: [],
      paymentMethods: [],
      clientClazzs: [],
      payments: [],
      productManagers:[],
      assignPersons:[],
      selectPersonIds:[],
      isDeflects: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 2
        }
      ],
      chargeStaffs: [],
      selectionList: [],
      fkjdData: {
        paymentStageList: [],
        delPaymentStageIds: []
      },
      ygxxData: {
        employeeInfoVOS: [],
        delEmployeeIds: []
      },
      xsddList: [],
      whygxx: false,
      pzfkjd: false,
      cjxsdd: false,
      rules: {
        contractOf: [
          { required: true, message: "请选择合同所属", trigger: "blur" }
        ],
        chargePerson: [
          { required: true, message: "请选择负责员工", trigger: "blur" }
        ],
        clientInfo: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        industry: [{ required: true, message: "请选择行业", trigger: "blur" }],
        segmentIndustry: [
          { required: true, message: "请选择细分行业", trigger: "blur" }
        ],
        contractSign: [{ required: true, message: "请选择合同签订公司" }],
        contractAssign: [
          { required: true, message: "请选择合同分配", trigger: "blur" }
        ],
        contractDelivery: [{ required: true, message: "请选择合同交货期" }],
        provinceOfProject: [
          { required: true, message: "请选择交货:省/直辖市" }
        ],
        cityLevel: [{ required: true, message: "请选择交货:地区市" }],
        paymentMethod: [
          { required: true, message: "请选择付款方式", trigger: "blur" }
        ],
        taxNum: [
          { required: true, message: "请选择纳税人识别号", trigger: "blur" }
        ],
        detailAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        telephone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        bankAndAccount: [
          { required: true, message: "请输入开户账号", trigger: "blur" }
        ],
        bankName: [{ required: true, message: "请输入开户行", trigger: "blur" }],
        productManager:[
          {required: true, message: "请选择产品线经理", trigger: "blur"}
        ],
        assignPerson:[
          {required: true, message: "请选择后续审批人", trigger: "blur"}
        ],
        selectPersonId:[
          {required: true, message: "请选择人员", trigger: "blur"}
        ],
      }
    };
  },
  methods: {
    open(rowId, getId,diaType) {
      this.btnLoading=false;
      this.addList = {
        departmentName: "",
        chargePerson: {},
        segmentIndustry: "",
        industry: "",
        clientInfo: {},
        projectReportNum: "",
        createTime: "",
        createUserName: "",
        updateTime: "",
        updateUserName: "",
        contractOf: "",
        contractType: "",
        contractAssign: "",
        coinCategory: "",
        paymentMethod: "",
        flowStatus: "",
        businessAccounts: [
          {
            accountSchema: "实际毛利(单独权限)",
            bodyProfit: "",
            mainProfit: "",
            mainProportion: ""
          },
          {
            accountSchema: "去费用(单独权限)",
            bodyProfit: "",
            mainProfit: "",
            mainProportion: ""
          },
          {
            accountSchema: "去费用+非标",
            bodyProfit: "",
            mainProfit: "",
            mainProportion: ""
          }
        ],
        deflectStatisticsVOS: [],
        contractDistributeVOS: [],
        cashFlowPlanVOList: [],
        productContractInfoVOS: []
      };
      this.fileList = [];
      this.dataList = [];
      this.fileListTwo=[];
      this.dataListTwo=[];
      this.rowId = rowId;
      this.khOption = [];
      this.charges = [];
      this.segmentIndustrys = [];
      this.selectSigns=[];
      this.assignPersons=[];
      this.productManagers=[];
      this.selectPersonIds=[];
      // 读取字段权限和按钮权限
      this.viewInit(this.$route.fullPath,"CRM_HTSP",this.functionId,this.proDefId,this.nodeCode).then(res=>{
        // 动态处理字段和按钮
        this.dynamicView(this,"CRM_HTSP",null,this.buttonList,this.fieldPower,res.data.data);
        this.dynamicShow(this.fieldPower,diaType,null,this.buttonList);
      });
      if (rowId == "") {
        this.$refs["ruleForm"].resetFields();
        this.getDefaultVal();
        if (getId != "") {
          getData(getId).then(res => {
            this.addList.clientClazz = res.data.data.clientClazz;
            this.addList.projectReportNum = res.data.data.projectReportNum;
            this.addList.clientInfo = res.data.data.clientInfo;
            this.addList.industry = res.data.data.industry;
            this.addList.segmentIndustry = res.data.data.segmentIndustry;
            this.addList.chargePerson = res.data.data.chargePerson;
            this.addList.departmentName = res.data.data.departmentName;
            this.addList.departmentId=res.data.data.departmentId
            this.mainId = getId;
            this.init();
            this.initTwo();
            //客户名称
            if (this.addList.clientInfo != {}) {
              this.khOption.push(this.addList.clientInfo);
            }
            if (this.khOption.length > 0) {
              this.khOption.forEach(item => {
                item.label = item.customerName;
                item.value = { customerName: item.customerName, id: item.id };
              });
            }
            //负责员工
            if (this.addList.chargePerson != {}) {
              this.charges.push(this.addList.chargePerson);
            }
            if (this.charges.length > 0) {
              this.charges.forEach(item => {
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              });
            }
            //产品线经理
            if(this.addList.productManager&&this.addList.productManager!={}){
              this.productManagers.push(this.addList.productManager);
              this.productManagers.forEach(item=>{
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              })
            }
            //细分行业
            dictionary_group("industry", this.addList.industry).then(res => {
              this.segmentIndustrys = res.data.data;
            });
            if(this.addList.contractAssign=='2'){
              if(this.addList.selectPersonId!=''){
                this.selectPersonIds.push(this.addList.selectPerson)
              }
            }
          });
        }
      } else {
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.mainId = this.addList.id;
          this.init();
          this.initTwo();
          //客户名称
          if (this.addList.clientInfo != {}) {
            this.khOption.push(this.addList.clientInfo);
          }
          if (this.khOption.length > 0) {
            this.khOption.forEach(item => {
              item.label = item.customerName;
              item.value = { customerName: item.customerName, id: item.id };
            });
          }
          //负责员工
          if (this.addList.chargePerson != {}) {
            this.charges.push(this.addList.chargePerson);
          }
          if (this.charges.length > 0) {
            this.charges.forEach(item => {
              item.label = item.realName;
              item.value = {
                realName: item.realName,
                id: item.id
              };
            });
          }
          //产品线经理
            if(this.addList.productManager&&this.addList.productManager!={}){
              this.productManagers.push(this.addList.productManager);
              this.productManagers.forEach(item=>{
                item.label = item.realName;
                item.value = {
                  realName: item.realName,
                  id: item.id
                };
              })
            }
            //后续审批人
          if(this.addList.assignPerson&&this.addList.assignPerson.length>0){
            this.addList.assignPerson.forEach(item=>{
              this.assignPersons.push(item)
              this.assignPersons.forEach(ele=>{
                ele.label = ele.realName;
                ele.value = {
                  realName: ele.realName,
                  id: ele.id
                };
              })
            })
          }
          //行负责员工
          if (this.addList.contractDistributeVOS.length > 0) {
            this.addList.contractDistributeVOS.forEach(item => {
              item.chargeStaffs = [];
              if (item.chargePerson != {}) {
                item.chargeStaffs.push(item.chargePerson);
                item.chargeStaffs.forEach(ele => {
                  (ele.label = ele.realName),
                    (ele.value = { realName: ele.realName, id: ele.id });
                });
              }
            });
          }
          //提出人
          if (this.addList.deflectStatisticsVOS.length > 0) {
            this.addList.deflectStatisticsVOS.forEach(item => {
              item.putPersons = [];
              if (item.putPerson != {}) {
                item.putPersons.push(item.putPerson);
                item.putPersons.forEach(ele => {
                  (ele.label = ele.realName),
                    (ele.value = { realName: ele.realName, id: ele.id });
                });
              }
            });
          }
          //地级市
          state(this.addList.provinceOfProject).then(res => {
            this.cityLevels = res.data.data;
          });
          //细分行业
          dictionary_group("industry", this.addList.industry).then(res => {
            this.segmentIndustrys = res.data.data;
          });
          if(this.addList.contractAssign=='2'){
            if(this.addList.selectPersonId!=''){
              this.selectPersonIds.push(this.addList.selectPerson)
            }
          }
        });
      }
    },
    PercentChange() {
      let numPercent = 0;
      for (var i = 0; i < this.addList.cashFlowPlanVOList.length; i++) {
        if (i != 0) {
          numPercent =
            parseInt(this.addList.cashFlowPlanVOList[i].returnPercent) +
            parseInt(numPercent);
          if (numPercent > 100) {
            this.addList.cashFlowPlanVOList[i].returnPercent =
              parseInt(numPercent) - 100;
            this.addList.cashFlowPlanVOList[i].disabled = true;
            for (var p = i; p < this.addList.cashFlowPlanVOList.length; p++) {
              this.addList.cashFlowPlanVOList[p].disabled = true;
              this.addList.cashFlowPlanVOList[p].returnPercent = "";
            }
          }
        }
      }
    },
    hostmentChange() {
      let numPercent = 0;
      for (var i = 0; i < this.addList.cashFlowPlanVOList.length; i++) {
        if (i != 0) {
          numPercent =
            parseInt(this.addList.cashFlowPlanVOList[i].hostPayment) +
            parseInt(numPercent);
          if (numPercent > 100) {
            this.addList.cashFlowPlanVOList[i].hostPayment =
              parseInt(numPercent) - 100;
            this.addList.cashFlowPlanVOList[i].hostDis = true;
            for (var p = i; p < this.addList.cashFlowPlanVOList.length; p++) {
              this.addList.cashFlowPlanVOList[p].hostDis = true;
              this.addList.cashFlowPlanVOList[p].hostPayment = "";
            }
          }
        }
      }
    },
    motomentChange() {
      let numPercent = 0;
      for (var i = 0; i < this.addList.cashFlowPlanVOList.length; i++) {
        if (i != 0) {
          numPercent =
            parseInt(this.addList.cashFlowPlanVOList[i].motorPayment) +
            parseInt(numPercent);
          if (numPercent > 100) {
            this.addList.cashFlowPlanVOList[i].motorPayment =
              parseInt(numPercent) - 100;
            this.addList.cashFlowPlanVOList[i].motoDis = true;
            for (var p = i; p < this.addList.cashFlowPlanVOList.length; p++) {
              this.addList.cashFlowPlanVOList[p].motoDis = true;
              this.addList.cashFlowPlanVOList[p].motorPayment = "";
            }
          }
        }
      }
    },
    abnomentChange() {
      let numPercent = 0;
      for (var i = 0; i < this.addList.cashFlowPlanVOList.length; i++) {
        if (i != 0) {
          numPercent =
            parseInt(this.addList.cashFlowPlanVOList[i].abnormalPayment) +
            parseInt(numPercent);
          if (numPercent > 100) {
            this.addList.cashFlowPlanVOList[i].abnormalPayment =
              parseInt(numPercent) - 100;
            this.addList.cashFlowPlanVOList[i].abnoDis = true;
            for (var p = i; p < this.addList.cashFlowPlanVOList.length; p++) {
              this.addList.cashFlowPlanVOList[p].abnoDis = true;
              this.addList.cashFlowPlanVOList[p].abnormalPayment = "";
            }
          }
        }
      }
    },
    expementChange() {
      let numPercent = 0;
      for (var i = 0; i < this.addList.cashFlowPlanVOList.length; i++) {
        if (i != 0) {
          numPercent =
            parseInt(this.addList.cashFlowPlanVOList[i].expenses) +
            parseInt(numPercent);
          if (numPercent > 100) {
            this.addList.cashFlowPlanVOList[i].expenses =
              parseInt(numPercent) - 100;
            this.addList.cashFlowPlanVOList[i].expeDis = true;
            for (var p = i; p < this.addList.cashFlowPlanVOList.length; p++) {
              this.addList.cashFlowPlanVOList[p].expeDis = true;
              this.addList.cashFlowPlanVOList[p].expenses = "";
            }
          }
        }
      }
    },
    getDefaultVal() {
      addDefaultVaule("CRM_HTPS").then(res => {
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.updateUserName = res.data.data.UPDATE_USER_NAME;
        this.addList.updateTime = res.data.data.UPDATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.contractOf = res.data.data.CONTRACT_OF;
        this.addList.contractType = res.data.data.CONTRACT_TYPE;
        this.addList.contractAssign = res.data.data.CONTRACT_ASSIGN;
        this.addList.coinCategory = res.data.data.COIN_CATEGORY;
        this.addList.paymentMethod = res.data.data.PAYMENT_METHOD;
      });
    },
    //保存并提交
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true;
          this.addList.uploadFiles = this.fileList;
          this.addList.deflectUploadList=this.fileListTwo
          this.addList.processFlag = 1;
          saveAndUpdate(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("getId");
              this.getModel("CRM_HTPS");
              this.dataId = res.data.data;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //保存
    subBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.deflectUploadList=this.fileListTwo
          this.addList.uploadFiles = this.fileList;
          this.addList.processFlag = 0;
          saveAndUpdate(this.addList).then(res => {
            if (res.data.code == 200) {
              this.turnoff();
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              localStorage.removeItem("getId");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false;
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
      let flowKey=''
      if(this.addList.flowStatus==='0'){
        flowKey='CRM_HTPS_DART'
      }else if(this.addList.flowStatus==='2'||this.addList.flowStatus==='5'){
        flowKey='CRM_HTPS_ALTER_DART'
      }
      startFlow({
        flowKey: flowKey,
        formType: "S",
        modelId: id,
        dataId: this.dataId,
        variables: {
          functionPath:this.$route.fullPath
        }
      }).then(res => {
        this.turnoff();
        this.$message({
          type: "success",
          message: res.data.msg
        });
      });
    },
    //产品信息
    cpxxAdd() {
      this.addList.productContractInfoVOS.push({
        productNum: 0,
        singlePrice: 0,
        totalAmount: 0
      });
    },
    cpxxDel(row, index) {
      this.addList.productContractInfoVOS.splice(index, 1);
      if (row.id) {
        this.addList.delProductContractInfoIds.push();
      }
    },
    //现金流计划
    xjljhAdd() {
      this.addList.cashFlowPlanVOList.push({
        disabled: false,
        hostDis: false,
        abnoDis: false,
        expeDis: false,
        returnPercent:0,
        hostPayment:0,
        motorPayment:0,
        abnormalPayment:0,
        expenses:0
      });
      for (var i = 0; i < this.addList.cashFlowPlanVOList.length; i++) {
        if (this.addList.cashFlowPlanVOList[i].disabled == true) {
          this.addList.cashFlowPlanVOList[i + 1].disabled = true;
        }
        if (this.addList.cashFlowPlanVOList[i].hostDis == true) {
          this.addList.cashFlowPlanVOList[i + 1].hostDis = true;
        }
        if (this.addList.cashFlowPlanVOList[i].motoDis == true) {
          this.addList.cashFlowPlanVOList[i + 1].motoDis = true;
        }
        if (this.addList.cashFlowPlanVOList[i].abnoDis == true) {
          this.addList.cashFlowPlanVOList[i + 1].abnoDis = true;
        }
        if (this.addList.cashFlowPlanVOList[i].expeDis == true) {
          this.addList.cashFlowPlanVOList[i + 1].expeDis = true;
        }
      }
    },
    xjljhDel(row, index) {
      this.addList.cashFlowPlanVOList.splice(index, 1);
      if (row.id) {
        this.addList.delCashFlowPlanIds.push(row.id);
      }
    },
    //合同分配给其他办事处
    distributeAdd() {
      this.addList.contractDistributeVOS.push({});
    },
    distributeDel(row, index) {
      this.addList.contractDistributeVOS.splice(index, 1);
      if (row.id) {
        this.addList.delContractDistributeIds.push(row.id);
      }
    },
    //偏离项统计
    deflectAdd() {
      this.addList.deflectStatisticsVOS.push({});
    },
    deflectDel(row, index) {
      this.addList.deflectStatisticsVOS.splice(index, 1);
      if (row.id) {
        this.addList.delDeflectStatisticsIds.push(row.id);
      }
    },
    //合同总金额
    blur() {
      let num = 0;
      for (var i = 0; i < this.addList.productContractInfoVOS.length; i++) {
        this.addList.productContractInfoVOS[i].totalAmount = (
          Number(this.addList.productContractInfoVOS[i].productNum) *
          Number(this.addList.productContractInfoVOS[i].singlePrice)
        ).toFixed(2);
        num += Number(this.addList.productContractInfoVOS[i].totalAmount);
      }
      this.$set(this.addList, "totalAmount", (num * 0.0001).toFixed(6));
    },
    //风机类型
    getFanTypes() {
      getDictBizByCode("crm_product_type").then(res => {
        this.fanTypes = res.data.data;
      });
    },
    //付款方式
    getPaymentMethods() {
      getDictBizByCode("crm_payment_method").then(res => {
        this.paymentMethods = res.data.data;
      });
    },
    //客户等级
    getclientClazzs() {
      getDictBizByCode("crm_client-grade").then(res => {
        this.clientClazzs = res.data.data;
      });
    },
    //付款阶段
    getPayment() {
      payment().then(res => {
        this.payments = res.data.data;
      });
    },
    //货币
    getCoin() {
      getDictBizByCode("bill-coin").then(res => {
        this.coinCategorys = res.data.data;
      });
    },
    //项目报登号
    proNum(query) {
      if (query != "") {
        getProjectInfo(query).then(res => {
          this.numOption = res.data.data;
        });
      }
    },
    //省直辖市
    getCounty() {
      state("000").then(res => {
        this.countyOption = res.data.data;
      });
    },
    paymentStageIdChange(row) {
      this.payments.forEach(item => {
        if (row.paymentStageId == item.id) {
          row.afterGoodsTrim = item.paymentTrim;
        }
      });
    },
    //市地市区
    getCityLevels(val) {
      delete this.addList.cityLevel;
      state(val).then(res => {
        this.cityLevels = res.data.data;
      });
    },
    //合同交货期
    getContracts() {
      getDictBizByCode("crm_contract_delivery").then(res => {
        this.contracts = res.data.data;
      });
    },
    //合同签约公司
    getContractSigns() {
      getDictBizByCode("crm_design_company").then(res => {
        this.contractSigns = res.data.data;
      });
    },
    numChange() {
      //带出的数据
      if (this.rowId == "") {
        this.khOption = [];
        this.charges = [];
        this.numOption.forEach(item => {
          if (item.projectReportNum == this.addList.projectReportNum) {
            this.addList.clientInfo = item.clientInfo;
            this.addList.industry = item.industry;
            this.addList.segmentIndustry = item.segmentIndustry;
            this.addList.chargePerson = item.chargePerson;
            this.addList.departmentName = item.departmentName;
            this.addList.departmentId = item.deptId;
            this.addList.clientClazz=item.clientClazz;
            this.addList.departmentId=item.departmentId
            //细分行业
          dictionary_group("industry",this.addList.industry).then(res => {
            this.segmentIndustrys = res.data.data;
          });
          }
        });
        //客户名称
        if (this.addList.clientInfo != {}) {
          this.khOption.push(this.addList.clientInfo);
        }
        if (this.khOption.length > 0) {
          this.khOption.forEach(item => {
            item.label = item.customerName;
            item.value = { customerName: item.customerName, id: item.id };
          });
        }
        //负责员工
        if (this.addList.chargePerson != {}) {
          this.charges.push(this.addList.chargePerson);
        }
        if (this.charges.length > 0) {
          this.charges.forEach(item => {
            item.label = item.realName;
            item.value = {
              realName: item.realName,
              id: item.id
            };
          });
        }
      }
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    //行业
    getIndustrys() {
      dictionary_group("industry", "-1").then(res => {
        this.industrys = res.data.data;
      });
    },
    //细分行业
    industryChange() {
      delete this.addList.segmentIndustry;
      dictionary_group("industry", this.addList.industry).then(res => {
        this.segmentIndustrys = res.data.data;
      });
    },
    //客户名称
    khName(query) {
      if (query != "") {
        blurrySelect(query).then(res => {
          this.khOption = res.data.data;
          this.khOption.forEach(item => {
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
    clientChange() {
      this.khOption.forEach(item => {
        if (this.addList.clientInfo.id == item.id) {
          this.addList.clientClazz = item.customerLevel;
        }
      });
    },
    //提出人
    getPutPersons(query, row) {
      if (query != "") {
        delete row.putPersons;
        getUserInfoBySearch(query).then(res => {
          res.data.data.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
          this.$set(row, "putPersons", res.data.data);
        });
      } else {
        this.$set(row, "putPersons", []);
      }
    },
    getselectPersonId(query){
      if(query!=''){
        getUserInfoBySearch(query).then(res=>{
          this.selectPersonIds=res.data.data
        })
      }else{
        this.selectPersonIds=[]
      }
    },
    selectPersonIdChange(){
      this.selectPersonIds.forEach(item=>{
        if(this.addList.selectPersonId==item.id){
          this.addList.selectDeptName=item.deptName
          this.addList.selectDeptId=item.deptId
        }
      })
    },
    contractAssignChange(){
      delete this.addList.selectPersonId
      delete this.addList.selectDeptName
      delete this.addList.selectDeptId
    },
    getChargePerson(query, row) {
      if (query != "") {
        delete row.chargePersons;
        getUserInfoBySearch(query).then(res => {
          res.data.data.forEach(item => {
            let arr = {
              realName: item.realName,
              account: item.account,
              deptName: item.deptName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
          this.$set(row, "chargePersons", res.data.data);
        });
      } else {
        this.$set(row, "chargePersons", []);
      }
    },
    chargePersonChange(row) {
      row.chargeNames = row.chargeCodes;
      row.departmentName = row.chargeCodes.deptName;
      row.departmentId = row.chargeCodes.deptId;
    },
    employeeNameChange(row) {
      row.chargeCodes = row.chargeNames;
      row.departmentName = row.chargeNames.deptName;
      row.departmentId = row.chargeNames.deptId;
    },
    //行负责员工
    chargeStaff(query, row) {
      if (query != "") {
        delete row.chargeStaffs;
        getUserInfoBySearch(query).then(res => {
          res.data.data.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
          this.$set(row, "chargeStaffs", res.data.data);
        });
      } else {
        this.$set(row, "chargeStaffs", []);
      }
    },
    //行部门
    chargeStaffChange(row) {
      row.chargeStaffs.forEach(item => {
        if (item.id == row.chargePerson.id) {
          row.departmentName = item.deptName;
          row.departmentId = item.deptId;
        }
      });
    },
    //负责员工
    charge(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.charges = res.data.data;
          this.charges.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
        });
      } else {
        this.charges = [];
      }
    },
    //产品线经理
    getproductManager(query){
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.productManagers = res.data.data;
          this.productManagers.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
        });
      } else {
        this.productManagers = [];
      }
    },
    //后续审批人
    getassignPerson(query){
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.assignPersons = res.data.data;
          this.assignPersons.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
        });
      } else {
        this.assignPersons = [];
      }
    },
    //部门
    chargeChange() {
      this.charges.forEach(item => {
        if (item.id == this.addList.chargePerson.id) {
          this.addList.departmentName = item.deptName;
          this.addList.departmentId = item.deptId;
        }
      });
    },
    //关闭弹框
    close(formName) {
      this.turnoff();
      this.$refs[formName].resetFields();
      localStorage.removeItem("getId");
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
      this.loading = true;
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.loading = false;
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    },
    //付款阶段弹框
    fkjdOpen() {
      this.fkjdData={
        paymentStageList:[],
        delPaymentStageIds:[]
      }
      this.pzfkjd = true;
      payment().then(res => {
        if (res.data.code == 200) {
          this.fkjdData.paymentStageList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //付款阶段行新增
    fkjdAdd() {
      this.fkjdData.paymentStageList.push({});
    },
    //付款阶段行删除
    fkjdDel(row, index) {
      this.fkjdData.paymentStageList.splice(index, 1);
      if (row.id) {
        this.fkjdData.delPaymentStageIds.push(row.id);
      }
    },
    //付款阶段保存
    fkjdSub() {
      saveOrUpdate(this.fkjdData).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.pzfkjd = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //员工信息弹框
    ygxxOpen() {
      this.whygxx = true;
      this.ygxxData={
        employeeInfoVOS:[],
        delEmployeeIds:[]
      }
      employeeList().then(res => {
        if (res.data.code == 200) {
          this.ygxxData.employeeInfoVOS = res.data.data;
          if (this.ygxxData.employeeInfoVOS.length > 0) {
            this.ygxxData.employeeInfoVOS.forEach(item => {
              if (item.chargeCodes != {} && item.chargeNames != {}) {
                item.chargePersons = [];
                item.chargePersons.push(item.chargeCodes);
                item.chargePersons.forEach(ele => {
                  ele.value = {
                    realName: ele.realName,
                    account: ele.account,
                    deptName: ele.deptName,
                    id: ele.id
                  };
                });
              }
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //员工信息行新增
    ygxxAdd() {
      this.ygxxData.employeeInfoVOS.push({});
    },
    //员工信息行删除
    ygxxDel(row, index) {
      this.ygxxData.employeeInfoVOS.splice(index, 1);
      if (row.id) {
        this.ygxxData.delEmployeeIds.push(row.id);
      }
    },
    //员工信息保存
    ygxxSub() {
      employeeSave(this.ygxxData).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.whygxx = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //销售订单弹框
    xsddOpen() {
      this.cjxsdd = true;
      saleList(this.addList.id).then(res => {
        if (res.data.code == 200) {
          this.xsddList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.selectionList = val;
    },
    xsddSub() {
      if (this.selectionList.length < 1) {
        this.$message({
          message: "至少选中一条产品信息",
          type: "warning"
        });
      } else {
        this.cjxsdd = false;
        this.turnoff();
        this.xsddList = [];
        let htcp = {
          htId: this.rowId,
          selectionList: this.selectionList
        };
        this.$router.push("/biz/crm/xsdd");
        localStorage.removeItem("getId");
        localStorage.setItem("htcp", JSON.stringify(htcp));
      }
    },
    //偏离项附件上传
    initTwo() {
      let obj = {
        dataId: this.mainId,
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
    this.getIndustrys();
    this.getContractSigns();
    this.getContracts();
    this.getCounty();
    this.getCoin();
    this.getPaymentMethods();
    this.getPayment();
    this.getFanTypes();
    this.getStatus();
    this.getclientClazzs();
    if (this.detailId && this.detailId != "") {
      this.open(this.detailId, "",this.diaType);
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

