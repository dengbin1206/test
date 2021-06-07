<template>
    <div style="width:auto">
        <template>
               <el-button type="primary" size="small" icon="el-icon-s-check" @click="scht" v-if="buttonList.crm_xmbd_scht.show">生成合同</el-button>
               <el-button type="primary" size="small" icon="el-icon-tickets" @click="bjsq" v-if="buttonList.crm_xmbd_bjsq.show">报价申请</el-button>
            </template>
            <el-form :model="addList"  :label-position='labelPosition'  :rules="rulesList" ref="ruleForm" label-width="150px"   class="sx_formItem">
                <el-row :gutter="20">
                    <h3>项目报登基本信息</h3>
                    <el-col :span="ispc">
                        <el-form-item label="项目规模:" prop="projectScale" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','projectScale')">
                            <el-radio-group v-model="addList.projectScale" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','projectScale')">
                                <el-radio label="1">50万及以上</el-radio>
                                <el-radio label="2">50万及以下</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="项目报登号:" prop="projectReportNum"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','projectReportNum')">
                            <el-input size="small" v-model="addList.projectReportNum" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','projectReportNum',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="项目名称:" prop="projectName" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','projectName')">
                            <el-input size="small" v-model="addList.projectName" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','projectName')"></el-input>
                        </el-form-item>
                        <el-form-item label="客户名称:" prop="clientInfo" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','clientInfo')">
                            <el-select size="small" v-model="addList.clientInfo" filterable remote value-key="id"  reserve-keyword placeholder="请输入关键词" :remote-method="khName"  style="width:100%" @change="clientChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','clientInfo')">
                                <el-option
                                    v-for="item in khOption"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户联系人:" prop="contactPersonName" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','contactPersonName')">
                            <el-input size="small" v-model="addList.contactPersonName" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','contactPersonName')"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话:" prop="telephone" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','telephone')">
                            <el-input size="small" v-model="addList.telephone" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','telephone')"></el-input>
                        </el-form-item>
                        <el-form-item label="行业:" prop="industry" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','industry')">
                            <el-select size="small" v-model="addList.industry"  placeholder="请选择行业"  style="width:100%" clearable @change="industryChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','industry')">
                                <el-option
                                    v-for="item in industrys"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="细分行业:" prop="segmentIndustry" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','segmentIndustry')">
                            <el-select size="small" v-model="addList.segmentIndustry"  placeholder="请选择细分行业"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','segmentIndustry')">
                                <el-option
                                    v-for="item in segmentIndustrys"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预计项目金额(万元):" prop="aboutAmount"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','aboutAmount')">
                            <span style="width:70%;float:left">
                                <el-input size="small" v-model="addList.aboutAmount"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','aboutAmount',0)" ></el-input>
                            </span>
                            <span style="width:26%;float:left;margin-left:4%">
                                <el-select v-model="addList.coinCategory" size="small" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','coinCategory')">
                                    <el-option
                                        v-for="item in coinOption"
                                        :key="item.dictKey"
                                        :label="item.dictValue"
                                        :value="item.dictKey">
                                    </el-option>
                                </el-select>
                            </span>
                        </el-form-item>
                        <el-form-item label="甲方项目进度:" prop="projectSchedule" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','projectSchedule')">
                            <el-select size="small" v-model="addList.projectSchedule"  placeholder="请选择甲方项目进度"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','projectSchedule')">
                                <el-option
                                    v-for="item in projectSchedules"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预计招标日期:" prop="tenderDate" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','tenderDate')">
                            <el-date-picker
                                :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','tenderDate')"
                                v-model="addList.tenderDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择预计招标日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                      <el-form-item label="创建人:" prop="createUserName" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','createUserName')">
                            <el-input size="small" v-model="addList.createUserName"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','createUserName',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="createTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','createTime')">
                            <el-input size="small" v-model="addList.createTime"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','createTime',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="审批状态:" prop="flowStatus" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','flowStatus')">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="请选择审批状态"  style="width:100%" clearable  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','flowStatus',0)">
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批结束时间:" prop="flowCompletedTime" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','flowCompletedTime')">
                            <el-input size="small" v-model="addList.flowCompletedTime"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','flowCompletedTime',0)"></el-input>
                        </el-form-item>
                        <el-form-item label="负责员工:" prop="chargePerson" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','chargePerson')">
                            <el-select size="small" v-model="addList.chargePerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="charge"  style="width:100%" @change="chargeChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','chargePerson')">
                                <el-option
                                    v-for="item in charges"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门:" prop="departmentName" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','departmentName')">
                            <el-input size="small" v-model="addList.departmentName" disabled  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','departmentName')"></el-input>
                        </el-form-item>
                      <el-form-item label="是否跨区:" prop="isRegion" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','isRegion')">
                            <el-radio-group v-model="addList.isRegion" size="small"  :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','isRegion')">
                                <el-radio label="2">不跨区</el-radio>
                                <el-radio label="1">跨区</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="跨区部门1:" prop="deptOne" v-if='addList.isRegion==1'>
                            <el-select size="small" v-model="addList.deptOne" value-key="id" filterable remote  reserve-keyword placeholder="请输入关键词" :remote-method="regionOne"  style="width:100%" clearable>
                                <el-option
                                    v-for="item in deptOneOption"
                                    :key="item.id"
                                    :label="item.deptName"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="跨区部门2:" prop="deptTwo" v-if='addList.isRegion==1'>
                            <el-select size="small" v-model="addList.deptTwo" value-key="id" filterable remote  reserve-keyword placeholder="请输入关键词" :remote-method="regionTwo" style="width:100%" clearable>
                                <el-option
                                    v-for="item in deptTwoOption"
                                    :key="item.id"
                                    :label="item.deptName"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目所在国家:" prop="countryOfProject" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','countryOfProject')">
                            <el-select size="small" v-model="addList.countryOfProject" value-key="code" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="getCountry"  style="width:100%" @change="countryChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','countryOfProject')">
                                <el-option
                                    v-for="item in countrys"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目所在省/市/区域:" prop="provinceOfProject" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','provinceOfProject')">
                            <el-select size="small" v-model="addList.provinceOfProject"   placeholder="请选择项目所在省/市/区域"   style="width:100%" clearable @change="cityChange" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','provinceOfProject')">
                                <el-option
                                    v-for="item in cityOption"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目所在地级市:" prop="cityLevel"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','cityLevel')">
                            <el-select size="small" v-model="addList.cityLevel"   placeholder="请选择项目所在地级市"   style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','cityLevel')">
                                <el-option
                                    v-for="item in countyOption"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <h3>关键信息</h3>
                    <el-col :span="ispc">
                        <el-form-item label="关键决策人:" prop="kdm" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','kdm')">
                            <el-input size="small" v-model="addList.kdm" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','kdm')"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="付款方式:" prop="paymentStyle"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','paymentStyle')">
                            <el-select size="small" v-model="addList.paymentStyle"  placeholder="请选择付款方式"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','paymentStyle')">
                                <el-option
                                    v-for="item in paymentStyles"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="大额采购件:" prop="largeList"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','largeList')">
                            <el-select size="small" v-model="addList.largeList" multiple  placeholder="请选择大额采购件"  style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','largeList')">
                                <el-option
                                    v-for="item in largeOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ispc">
                        <el-form-item label="设计院:" prop="designYard"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','designYard')">
                            <el-input size="small" v-model="addList.designYard" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','designYard')"></el-input>
                        </el-form-item>
                        <el-form-item label="竞争对手:" prop="competitor" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','competitor')">
                            <el-input size="small" v-model="addList.competitor" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','competitor')"></el-input>
                        </el-form-item>
                        <el-form-item label="成功关键要素:" prop="successReasons"  v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','successReason')">
                            <el-select size="small" v-model="addList.successReasons" multiple style="width:100%" clearable :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','successReason')">
                                <el-option
                                    v-for="item in successOption"
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
                    <el-form-item label="大额采购件说明:" prop="purchaseRemarks" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','purchaseRemarks')">
                            <el-input size="small" type="textarea" rows="3" v-model="addList.purchaseRemarks" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','purchaseRemarks')"></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="关键要素说明:" prop="reasonRemarks" v-if="this.dynamicFieldShow(fieldPower,'CRM_XMBD','reasonRemarks')">
                            <el-input size="small" type="textarea" rows="3" v-model="addList.reasonRemarks" :disabled="this.dynamicFieldEdit(fieldPower,'CRM_XMBD','reasonRemarks')"></el-input>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                                <h3>产品信息</h3>
                                <el-button type="primary" size="small" icon="el-icon-plus" @click="producAdd" style="margin-bottom:5px" v-if='buttonList.crm_xmbd_rowAdd.show'>添加一行</el-button>
                                <el-table
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        :data="addList.productInfoVOList"
                                        border
                                        max-height="370"
                                        size='small'
                                        style="width: 100%;">
                                        <el-table-column
                                        type='index'
                                        width="55">
                                        </el-table-column>
                                        <el-table-column
                                        prop="produceCategory"
                                        label="产品类型">
                                            <template  slot-scope="scope">
                                                <el-select v-model="scope.row.produceCategory" placeholder="请选择产品类型" size="small" style="width:100%" clearable >
                                                    <el-option v-for="item in produceOption" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="produceModel"
                                        label="产品型号"
                                        width="120">
                                            <template slot-scope="scope">
                                                <el-input v-model='scope.row.produceModel' size='small' placeholder="请输入产品型号"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="threeStrategyList"
                                        label="三战略产品"
                                        width="350">
                                            <template slot-scope="scope">
                                                <el-cascader
                                                    size="small"
                                                    style="width:100%"
                                                    clearable
                                                    v-model="scope.row.threeStrategyList"
                                                    :options="threeOption">
                                                </el-cascader>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="aboutCount"
                                        label="预计数量"
                                        width="120">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.aboutCount"  placeholder="请输入预计数量" type="number" size="small" @blur="count"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="singlePrice"
                                        label="预计含税单价(元)"
                                        width="120">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.singlePrice"  placeholder="请输入预计含税单价" type="number" size="small"  @blur="count"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="aboutTotal"
                                        label="预计含税总额(元)"
                                        width="120">
                                        </el-table-column>
                                        <el-table-column
                                        prop="remarks"
                                        label="特殊说明"
                                        width="400">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.remarks"  placeholder="请输入特殊说明"  size="small"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80' fixed="right"  v-if='buttonList.crm_xmbd_rowDel.show'>
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="producDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                                </template>
                                        </el-table-column>
                                </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px">
                    <el-col :span="12">
                      <el-form-item label="上传附件:">
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
                                    <el-button size="small" type="primary" v-if="buttonList.crm_xmbd_upload.show">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                                <h3>项目授权查看</h3>
                                    <el-button type="primary" size="small" icon="el-icon-plus" @click="authorAdd" style="margin-bottom:5px;" v-if="buttonList.crm_xmbd_rowAdd.show">添加一行</el-button>
                                    <el-table
                                        class="sx_xmbdTable"
                                        :data="addList.authorizationViewVOList"
                                        :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                                        :cell-style="{'text-align':'center'}"
                                        border
                                        max-height="370"
                                        size='small'
                                        @selection-change="authorChange"
                                        style="width: 100%">
                                        <el-table-column
                                        type='index'
                                        width="55">
                                        </el-table-column>
                                        <el-table-column
                                        prop="authPerson"
                                        label="姓名">
                                            <template slot-scope="scope">
                                                <el-select size="small" v-model="scope.row.authPerson" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="(query)=>{authName(query,scope.row)}"  style="width:100%">
                                                    <el-option
                                                        v-for="item in scope.row.authNames"
                                                        :key="item.id"
                                                        :label="item.label"
                                                        :value="item.value">
                                                        <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        prop="authReason"
                                        label="授权原因">
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.authReason" placeholder="请选择授权原因" size="small" style="width:100%" clearable>
                                                    <el-option v-for="item in reasonOption" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  width='80'  v-if='buttonList.crm_xmbd_rowDel.show'>
                                                <template slot-scope="scope">
                                                    <el-button icon='el-icon-delete' size="small" type="text"  @click="authorDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                                                </template>
                                        </el-table-column>
                                    </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;" v-if='ispc==12'>
                    <el-button type="primary" @click="savebtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check"  v-if="buttonList.crm_xmbd_save.show">保存</el-button>
                    <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check"  v-if="buttonList.crm_xmbd_submit.show">保存并提交</el-button>
                    <el-button @click="close()" size="small" icon="el-icon-close"  v-if="buttonList.crm_xmbd_cancel.show">取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer" style="width:100%;height:50px;font-size:15px;margin-top:10px" v-if='ispc==24'>
                    <el-button style='width:100%' type="primary" @click="savebtn('ruleForm')" :loading="btnLoading" size="small"  v-if="buttonList.crm_xmbd_save.show">保存</el-button>
            </div>
    </div>
</template>
<script>
import { getDictBizByCode, getDictByCode } from "@/api/system/dict";
import {
  deptBySearch,
  getUserInfoBySearch,
  blurrySelect,
  state,
  detail,
  save,
  upDate,
  three_tree,
  addDefaultVaule,
  dictionary_group,
  getRegionBySearch
} from "@/api/biz/crm/xmbd";
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
    proDefId: { type: String, default: null },
    functionId: { type: String, default: null },
    nodeCode: { type: String, default: null },
    diaType: { type: Number, default: null }
  },
  data() {
    return {
      ispc:12,
      labelPosition:'right',
      fullPath:this.$route.fullPath,
      btnLoading: false,
      fieldPower: {},
      buttonList: {
        crm_xmbd_scht: { show: true, action: [3] },
        crm_xmbd_bjsq: { show: true, action: [3] },
        crm_xmbd_rowAdd: { show: true, action: [1, 2, 4] },
        crm_xmbd_upload: { show: true, action: [1, 2, 4] },
        crm_xmbd_cancel: { show: true, action: [1, 2] },
        crm_xmbd_save: { show: true, action: [4] },
        crm_xmbd_submit: { show: true, action: [1, 2] },
        crm_xmbd_rowDel: { show: true, action: [1, 2, 4] }
      },
      fileList: [],
      dataList: [],
      dataId: "",
      addList: {},
      clientNames: [],
      industrys: [],
      segmentIndustrys: [],
      projectSchedules: [],
      deptOneOption: [],
      deptTwoOption: [],
      charges: [],
      khOption: [],
      countrys: [],
      cityOption: [],
      countyOption: [],
      largeOption: [],
      successOption: [],
      reasonOption: [],
      rowId: "",
      bar: "",
      dialogVisible: false,
      produceOption: [],
      selectionList: [],
      coinOption: [],
      threeOption: [],
      paymentStyles: [],
      statusOption: [],
      dataSrcId: "CRM_XMBD",
      affixType: "CRM_XMBD#AFFIX_UPLOAD",
      mainId: ""
    };
  },
  methods: {
    scht() {
      this.turnoff();
      this.$router.push({ path: "/biz/crm/htps" });
      localStorage.setItem("getId", this.rowId);
    },
    bjsq() {
      this.turnoff();
      this.$router.push({ path: "/biz/crm/quote" });
      localStorage.setItem("getId", this.rowId);
    },
    open(rowId, diaType) {
      this.btnLoading = false;
      this.addList = {
        projectScale: "",
        isRegion: "",
        productInfoVOList: [],
        authorizationViewVOList: [],
        flowStatus: "",
        coinCategory: "",
        contactPersonName: "",
        telephone: "",
        paymentStyle: "",
        countryOfProject: "",
        departmentName: "",
        chargePerson: {}
      };
      this.fileList = [];
      this.dataList = [];
      this.deptOneOption = [];
      this.deptTwoOption = [];
      this.khOption = [];
      this.charges = [];
      this.countrys = [];
      this.cityOption = [];
      this.countyOption = [];
      this.rowId = rowId;
      // 读取字段权限和按钮权限
      this.viewInit(
        this.fullPath,
        "CRM_XMBD",
        this.functionId,
        this.proDefId,
        this.nodeCode
      ).then(res => {
        // 动态处理字段和按钮
        this.dynamicView(
          this,
          "CRM_XMBD",
          null,
          this.buttonList,
          this.fieldPower,
          res.data.data
        );
        this.dynamicShow(this.fieldPower, diaType, null, this.buttonList);
      });
      if (rowId == "") {
        this.$refs["ruleForm"].resetFields();
        this.getDefaultVal();
      } else {
        if (diaType === 3) {
          this.$refs["ruleForm"].resetFields();
        }
        detail(rowId).then(res => {
          this.addList = res.data.data;
          this.mainId = this.addList.id;
          this.init();
          //跨区部门1
          if (this.addList.deptOne != {}) {
            this.deptOneOption.push(this.addList.deptOne);
          }
          if (this.deptOneOption.length > 0) {
            this.deptOneOption.forEach(item => {
              item.label = item.deptName;
              item.value = { deptName: item.deptName, id: item.id };
            });
          }
          //跨区部门2
          if (this.addList.deptTwo != {}) {
            this.deptTwoOption.push(this.addList.deptTwo);
          }
          if (this.deptTwoOption.length > 0) {
            this.deptTwoOption.forEach(item => {
              item.label = item.deptName;
              item.value = { deptName: item.deptName, id: item.id };
            });
          }
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
          this.countrys.push({
            code: this.addList.countryOfProject,
            name: this.addList.countryName
          });
          //省市/区域
          if (this.addList.countryOfProject != "") {
            state(this.addList.countryOfProject).then(res => {
              this.cityOption = res.data.data;
            });
          }

          //地级市
          if (this.addList.provinceOfProject != "") {
            state(this.addList.provinceOfProject).then(res => {
              this.countyOption = res.data.data;
            });
          }
          //姓名
          if (this.addList.authorizationViewVOList.length > 0) {
            this.addList.authorizationViewVOList.forEach(item => {
              item.authNames = [];
              if (item.authPerson != {}) {
                item.authNames.push(item.authPerson);
                console.log(item.authNames);
                item.authNames.forEach(ele => {
                  this.$set(ele, "label", ele.realName);
                  this.$set(ele, "value", {
                    realName: ele.realName,
                    id: ele.id
                  });
                });
              }
            });
          }
          //细分行业
          dictionary_group("industry", this.addList.industry).then(res => {
            this.segmentIndustrys = res.data.data;
          });
        });
      }
    },
    getDefaultVal() {
      addDefaultVaule("CRM_XMBD").then(res => {
        this.addList.projectScale = res.data.data.PROJECT_SCALE;
        this.addList.isRegion = res.data.data.IS_REGION;
        this.addList.coinCategory = res.data.data.COIN_CATEGORY;
        this.addList.createTime = res.data.data.CREATE_TIME;
        this.addList.createUserName = res.data.data.CREATE_USER_NAME;
        this.addList.updateUserName = res.data.data.UPDATE_USER_NAME;
        this.addList.updateTime = res.data.data.UPDATE_TIME;
        this.addList.flowStatus = res.data.data.FLOW_STATUS;
        this.addList.paymentStyle = res.data.data.PAYMENT_STYLE;
        this.addList.countryOfProject = res.data.data.COUNTRY_OF_PROJECT;
        this.addList.departmentName = res.data.data.CREATE_DEPT_NAME;
        this.addList.departmentId = res.data.data.CREATE_DEPT;
        this.addList.chargePerson = {
          realName: res.data.data.CREATE_USER_NAME,
          deptName: res.data.data.CREATE_DEPT_NAME,
          id: res.data.data.CREATE_USER,
          account: res.data.data.UPDATE_USER.account
        };
        this.charges.push(this.addList.chargePerson);
        this.charges.forEach(item => {
          item.label = item.realName;
          item.value = {
            realName: item.realName,
            id: item.id
          };
        });
        this.countrys.push({
          code: this.addList.countryOfProject,
          name: "中国"
        });
        //省市/区域
        state(this.addList.countryOfProject).then(res => {
          this.cityOption = res.data.data;
        });
      });
    },
    getIndustrys() {
      dictionary_group("industry", "-1").then(res => {
        this.industrys = res.data.data;
      });
    },
    getfkfs() {
      getDictBizByCode("crm_payment_method").then(res => {
        this.paymentStyles = res.data.data;
      });
    },
    industryChange() {
      delete this.addList.segmentIndustry;
      dictionary_group("industry", this.addList.industry).then(res => {
        this.segmentIndustrys = res.data.data;
      });
    },
    getProjectSchedules() {
      getDictBizByCode("crm_project_schedule").then(res => {
        this.projectSchedules = res.data.data;
      });
    },
    getProduce() {
      getDictBizByCode("crm_product_type").then(res => {
        this.produceOption = res.data.data;
      });
    },
    getCoin() {
      getDictBizByCode("bill-coin").then(res => {
        this.coinOption = res.data.data;
      });
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    getTree() {
      three_tree().then(res => {
        this.threeOption = res.data.data;
        this.threeOption.forEach(item => {
          item.label = item.firstName;
          item.value = item.firstName;
          if (item.children) {
            this.three(item.children);
          }
        });
      });
    },
    three(children) {
      children.forEach(item => {
        item.label = item.firstName;
        item.value = item.firstName;
        if (item.children) {
          this.three(item.children);
        }
      });
    },
    regionOne(query) {
      if (query != "") {
        deptBySearch(query).then(res => {
          this.deptOneOption = res.data.data;
          this.deptOneOption.forEach(item => {
            let arr = {
              deptName: item.deptName,
              id: item.id
            };
            item.label = item.deptName;
            item.value = arr;
          });
        });
      } else {
        this.deptOneOption = [];
      }
    },
    regionTwo(query) {
      if (query != "") {
        deptBySearch(query).then(res => {
          this.deptTwoOption = res.data.data;
          this.deptTwoOption.forEach(item => {
            let arr = {
              deptName: item.deptName,
              id: item.id
            };
            item.label = item.deptName;
            item.value = arr;
          });
        });
      } else {
        this.deptTwoOption = [];
      }
    },
    authName(query, row) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          res.data.data.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
          this.$set(row, "authNames", res.data.data);
        });
      } else {
        this.$set(row, "authNames", []);
      }
    },
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
    chargeChange() {
      this.charges.forEach(item => {
        if (item.id == this.addList.chargePerson.id) {
          this.addList.departmentName = item.deptName;
          this.addList.departmentId = item.deptId;
        }
      });
    },
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
        if (item.id == this.addList.clientInfo.id) {
          this.addList.clientClazz = item.customerLevel;
          this.addList.contactPersonName = item.relation;
          this.addList.telephone = item.contactNumber;
        }
      });
    },
    getCountry(query) {
      if (query != "") {
        getRegionBySearch(query).then(res => {
          this.countrys = res.data.data;
        });
      }
    },
    countryChange() {
      delete this.addList.provinceOfProject;
      delete this.addList.cityLevel;
      this.cityOption = [];
      this.countyOption = [];
      state(this.addList.countryOfProject).then(res => {
        this.cityOption = res.data.data;
      });
    },
    cityChange() {
      delete this.addList.cityLevel;
      state(this.addList.provinceOfProject).then(res => {
        this.countyOption = res.data.data;
      });
    },
    getLargePurchase() {
      getDictBizByCode("crm_large_purchase").then(res => {
        this.largeOption = res.data.data;
      });
    },
    getSuccess() {
      getDictBizByCode("crm_success_reason").then(res => {
        this.successOption = res.data.data;
      });
    },
    getReason() {
      getDictBizByCode("crm_auth_reason").then(res => {
        this.reasonOption = res.data.data;
      });
    },
    count() {
      let num = 0;
      for (var i = 0; i < this.addList.productInfoVOList.length; i++) {
        this.addList.productInfoVOList[i].aboutTotal = (
          Number(this.addList.productInfoVOList[i].aboutCount) *
          Number(this.addList.productInfoVOList[i].singlePrice)
        ).toFixed(2);
        num += Number(this.addList.productInfoVOList[i].aboutTotal);
      }
      this.$set(this.addList, "aboutAmount", (num * 0.0001).toFixed(6));
    },
    producAdd() {
      this.addList.productInfoVOList.push({
        aboutCount: 0,
        singlePrice: 0,
        aboutTotal: 0
      });
    },
    authorAdd() {
      this.addList.authorizationViewVOList.push({});
    },
    producDel(row, index) {
      this.addList.productInfoVOList.splice(index, 1);
      if (row.id) {
        this.addList.productInfoIds.push(row.id);
      }
    },
    authorDel(row, index) {
      this.addList.authorizationViewVOList.splice(index, 1);
      if (row.id) {
        this.addList.authorizationViewIds.push(row.id);
      }
    },
    authorChange(val) {
      this.selectionList = val;
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
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    },
    savebtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.addList.uploadFiles = this.fileList;
          save(this.addList).then(res => {
            if (res.data.code == 200) {
              this.turnoff();
              this.$message({
                message: res.data.msg,
                type: "success"
              });
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
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addList.productInfoVOList.length < 1) {
            this.$message({
              message: "产品信息必填",
              type: "warning"
            });
          } else {
            this.btnLoading = true;
            this.addList.uploadFiles = this.fileList;
            save(this.addList).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.getModel("CRM_XMBD");
                this.dataId = res.data.data;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
                this.btnLoading = false;
              }
            });
          }
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
        flowKey: "CRM_XMBD_DART",
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
    }
  },
  computed: {
    rulesList() {
      let rules = {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        contactPersonName: [
          { required: true, message: "请输入客户联系人", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        industry: [{ required: true, message: "请选择行业" }],
        projectScale: [
          { required: true, message: "请选择项目规格", trigger: "blur" }
        ],
        clientInfo: [{ required: true, message: "请输入客户名称" }],
        chargePerson: [{ required: true, message: "请选择负责员工" }],
        isRegion: [
          { required: true, message: "请选择是否跨区", trigger: "blur" }
        ],
        deptOne: [
          { required: true, message: "请选择跨区部门1", trigger: "blur" }
        ],
        segmentIndustry: [{ required: true, message: "请选择细分行业" }],
        projectSchedule: [{ required: true, message: "请选择甲方项目进度" }],
        tenderDate: [
          { required: true, message: "请选择预计招标日期", trigger: "blur" }
        ],
        provinceOfProject: [
          { required: true, message: "请选择项目所在省/市/区域" }
        ],
        cityLevel: [{ required: true, message: "请选择项目所在地级市" }],
        kdm: [{ required: true, message: "请输入关键决策人", trigger: "blur" }],
        designYard: [
          { required: true, message: "请输入设计院", trigger: "blur" }
        ],
        paymentStyle: [{ required: true, message: "请输入付款方式" }],
        competitor: [
          { required: true, message: "请输入竞争对手", trigger: "blur" }
        ],
        largeList: [{ required: true, message: "请选择大额采购件" }],
        successReason: [{ required: true, message: "请选择成功关键要素" }],
        produceCategory: [
          { required: true, message: "请选择产品类型", trigger: "blur" }
        ]
      };
      return rules;
    }
  },
  created() {
    this.getIndustrys();
    this.getProjectSchedules();
    this.getfkfs();
    this.getLargePurchase();
    this.getSuccess();
    this.getProduce();
    this.getReason();
    this.getCoin();
    this.getTree();
    this.getStatus();
    if (this.detailId && this.detailId != "") {
      this.fullPath='/work/donec'
      this.open(this.detailId, this.diaType);
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
<style  scoped>
@import "./xmbdStyle/htps.scss";
</style>
