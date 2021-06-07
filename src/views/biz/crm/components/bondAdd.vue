<template>
     <basic-container style="height:100%">
          <div v-if="basicForm.flowStatus == '2'">
        <el-button type="primary" size="small" icon="el-icon-attract" @click="turnPerformance"  v-if="editFlag!=undefined ? editFlag : true">转履约</el-button>
        <el-button type="primary" size="small" icon="el-icon-s-claim" @click="turnService"  v-if="editFlag!=undefined ? editFlag : true">转中标服务费</el-button>
        <el-button type="primary" size="small" icon="el-icon-s-fold" @click="returnDialog"   v-if="editFlag!=undefined ? editFlag : true">归还</el-button>
      </div>
      <el-form ref="bondForm" :model="basicForm"   :rules="bondRules" label-width="140px" size="small" :disabled="editFlag !=undefined ? !editFlag : false">
        <h4>保证金信息</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保证金类型:" prop="bondType">
              <el-radio-group v-model="basicForm.bondType">
                <el-radio label="1">投标保证金</el-radio>
                <el-radio label="2">履约保证金</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="投标单位:" prop="bidder">
              <el-select v-model="basicForm.bidder" size="small" placeholder="请选择投标单位">
                  <el-option
                    v-for="item in company"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目报登号:" prop="projectCode">
              <el-input v-model="basicForm.projectCode" placeholder="请输入项目报登号" clearable></el-input>
              <!-- <el-select v-model="basicForm.projectCode"  filterable remote reserve-keyword placeholder="请输入项目报登号" :remote-method="getProjectNewspaper" @change="getProjectInfo" :loading="projectNewspaperLoading">
              <el-option v-for="item in projectNewspaper" :key="item.projectReportNum" :label="item.projectReportNum" :value="item.projectReportNum"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="招标单位:">
              <el-input v-model="basicForm.biddingUnit" placeholder="请输入招标单位" clearable></el-input>
              <!-- <el-select
                  v-model="basicForm.biddingUnitId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchCustomerName(query)"
                  placeholder="项目报登带出可修改"
                  :loading="customerNameloading" 
                >
                  <el-option
                    v-for="item in customerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="项目名称:">
              <el-input v-model="basicForm.projectName" placeholder="请输入项目名称" ></el-input>
            </el-form-item>
            <el-form-item label="招标单位联系人:" prop="biddingUnitPerson">
              <el-input v-model="basicForm.biddingUnitPerson" placeholder="请输入招标单位联系人"></el-input>
            </el-form-item>
            <el-form-item label="招标单位联系电话:" prop="biddingUnitPhone">
              <el-input v-model="basicForm.biddingUnitPhone" placeholder="请输入招标单位联系电话"></el-input>
            </el-form-item>
            <el-form-item label="招标单位地址:" prop="biddingUnitAddress">
              <el-input v-model="basicForm.biddingUnitAddress" placeholder="请输入招标单位地址"></el-input>
            </el-form-item>
            <el-form-item label="要求公司支付日期:" prop="paymentDate">
              <el-date-picker v-model="basicForm.paymentDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="计划归还日期:" prop="plannedReturnDate">
              <el-date-picker v-model="basicForm.plannedReturnDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="特殊说明:">
              <el-input type="textarea" :rows="8" placeholder="请输入特殊说明" v-model="basicForm.specialInstructions"></el-input>
            </el-form-item>
            <el-form-item label="处理方式:" prop="treatmentMethod">
              <el-radio-group v-model="basicForm.treatmentMethod">
                <el-radio label="0">支付投标保证金</el-radio>
                <el-radio label="1">应收账款抵保证金</el-radio>
              </el-radio-group>
            </el-form-item>
             <el-form-item label="保证金状态:" prop="bondStatus">
              <el-select v-model="basicForm.bondStatus" size="small" disabled placeholder="自动带入">
                  <el-option
                    v-for="item in bondStatus"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            
            <el-form-item label="单号:">
              <el-input v-model="basicForm.bondCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="汇入单位或户名:" prop="remittanceUnit">
              <el-input v-model="basicForm.remittanceUnit" placeholder="请输入汇入单位"></el-input>
            </el-form-item>
            <el-form-item label="开户银行:" prop="bankName">
              <el-input v-model="basicForm.bankName" placeholder="请输入开户银行"></el-input>
            </el-form-item>
            <el-form-item label="银行账号:" prop="bankAccount">
              <el-input v-model="basicForm.bankAccount" placeholder="请输入银行账号"></el-input>
            </el-form-item>
            <el-form-item label="付款方式:" prop="paymentMethod" >
              <el-select v-model="basicForm.paymentMethod">
                <el-option v-for="item in paymentMethod" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请金额(元):" prop="applicationAmount">
              <el-input v-model="basicForm.applicationAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入申请金额"></el-input>
            </el-form-item>
            <el-form-item label="币种:">
              <el-select v-model="basicForm.currency" size="small" placeholder="请选择币种">
                <el-option
                  v-for="item in currency"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实际归还金额(元):">
              <el-input v-model="basicForm.actualReturnAmount" placeholder="归还带出" disabled></el-input>
            </el-form-item>
            <el-form-item label="实际归还日期:">
              <el-date-picker v-model="basicForm.actualReturnDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  placeholder="归还带出" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="负责员工:" prop="userId">
              <el-select v-model="basicForm.userId"  filterable remote reserve-keyword placeholder="请输入负责员工" :remote-method="selectPerson" @change="getDeptId" :loading="userLoading">
              <el-option v-for="item in userOption" :key="item.id" :label="item.realName" :value="item.id">
                  <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="部门:">
               <el-select
                  v-model="basicForm.deptId"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in bondDeptInfo"
                    :key="item.CREATE_DEPT"
                    :label="item.CREATE_DEPT_NAME"
                    :value="item.CREATE_DEPT"
                  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人:">
              <el-select
                  v-model="basicForm.createUser"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in bondCreateInfo"
                    :key="item.CREATE_USER"
                    :label="item.CREATE_USER_NAME"
                    :value="item.CREATE_USER"
                  ></el-option>
                </el-select>
            </el-form-item>
           
            <el-form-item label="创建时间:">
              <el-date-picker v-model="basicForm.createTime" type="datetime" placeholder="选择日期时间" disabled></el-date-picker>
            </el-form-item>
             <el-form-item label="审批状态:">
              <el-select v-model="basicForm.flowStatus" placeholder="请选择审批状态" disabled>
    <el-option
      v-for="item in flowStatus"
      :key="item.dictKey"
      :label="item.dictValue"
      :value="item.dictKey">
    </el-option>
  </el-select>
            </el-form-item>
            <el-form-item label="审批结束时间:">
              <el-date-picker v-model="basicForm.flowCompletedTime" type="datetime" placeholder="选择日期时间" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
        <el-form-item label="相关文件上传:" prop="affixList">
          <file-upload
            ref="fileUpload"
            :data.sync="bondAffixList"
            :disabled="editFlag !=undefined ? !editFlag : false"
            :mainId="mainDataId"
            modelName="CRM_TBBZJ"
            fieldName="CRM_TBBZJ#ANNEX"
          ></file-upload>
        </el-form-item>
        </el-col>
        </el-row>
      </el-form>
     <div  style="margin-top:10px;text-align:right;margin-bottom:50px">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
           :loading="btnLoading"
            v-if="editFlag==undefined && basicForm.flowStatus !='2'"
          @click="bondSaveAndSubmit('bondForm')"
        >保存并提交</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
           :loading="btnLoading"
             v-if="editFlag == true "
          @click="bondSave('bondForm')"
        >保 存</el-button>
        <el-button size="small" v-if="editFlag==undefined" @click="close()" icon="el-icon-circle-close">取 消</el-button>
      </div>
       <el-dialog 
        v-dialog
       :fullscreen="fullscren"
       v-if="returnDialogVisible"  
      :visible.sync="returnDialogVisible"
      class="avue-dialog"
       modal-append-to-body
      width="30%"
       top="8vh"
      ref="dialog" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">归还</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
      <el-form ref="returnForm" :model="returnForm" label-width="140px" size="small">
       <el-form-item label="累计实际归还金额:">
              <el-input v-model="returnForm.actualReturnAmount" placeholder="请输入累计实际归还金额"></el-input>
            </el-form-item>
            <el-form-item label="实际归还日期:">
              <el-date-picker v-model="returnForm.actualReturnDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          @click="bondReturnSave"
        >确 定</el-button>
        <el-button size="small" @click="returnDialogVisible = false" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog 
     v-dialog
       :fullscreen="fullscren"  
       v-if="performanceReturnDialogVisible"
      :visible.sync="performanceReturnDialogVisible"
      class="avue-dialog"
       modal-append-to-body
      width="30%"
       top="8vh"
      ref="dialog" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">归还</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
      <el-form ref="performanceReturnForm" :model="performanceReturnForm" label-width="140px" size="small">
       <el-form-item label="累计实际归还金额:">
              <el-input v-model="performanceReturnForm.actualReturnAmount" placeholder="请输入累计实际归还金额"></el-input>
            </el-form-item>
            <el-form-item label="实际归还日期:">
              <el-date-picker v-model="performanceReturnForm.actualReturnDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          @click="performanceReturnSave"
        >确 定</el-button>
        <el-button size="small" @click="performanceReturnDialogVisible = false" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog 
     v-dialog
       :fullscreen="fullscren"  
       v-if="performance"
      :visible.sync="performance"
       modal-append-to-body
      class="avue-dialog"
      width="75%"
      top="8vh"
      ref="dialog" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="performanceClose"
      >
      <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">转履约保证金</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
    <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:10px">
     <el-form ref="performanceForm" :rules="performanceRules" :model="performanceForm" label-width="160px" size="small">
       <el-button type="primary" size="small" icon="el-icon-s-fold" v-if="performanceForm.flowStatus=='2'" @click="performanceReturnDialog">归还</el-button>
        <h4>转履约保证金信息</h4> 
        <el-row :gutter="20">
          <el-col :span="12"> 
            <el-form-item label="项目报登号:" prop="projectCode">
               <el-input v-model="performanceForm.projectCode" placeholder="请输入项目报登号" disabled clearable></el-input>
              <!-- <el-select v-model="performanceForm.projectCode"  filterable remote reserve-keyword placeholder="请输入项目报登号" :remote-method="getPerformanceProjectNewspaper" @change="getPerfonmanceProjectInfo" :loading="performanceNewspaperLoading">
              <el-option v-for="item in performanceFormNewspaper" :key="item.projectReportNum" :label="item.projectReportNum" :value="item.projectReportNum"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="投标保证金单号:" prop="bidBondCode">
              <el-input v-model="performanceForm.bidBondCode" placeholder="自动带入" disabled></el-input>
            </el-form-item>
           <el-form-item label="纸质合同号:" prop="contractCode">
             <el-input v-model="performanceForm.contractCode" placeholder="请输入纸质合同号"  clearable></el-input>
              <!-- <el-select
                v-model="performanceForm.contractCodeId"
                filterable
                remote
                reserve-keyword
                :remote-method="searchContractCode"
                placeholder="项目报登带出,可修改"
                :loading="contractCodeLoading"
                @change="getCodeId"
              >
                <el-option
                  v-for="item in contractCodeList"
                  :key="item.id"
                  :label="item.paperContractNo"
                  :value="item.id"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="保证金申请金额(元):">
              <el-input v-model="performanceForm.bidBondAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="未归还投标保证金(元):">
              <el-input v-model="performanceForm.bondNotReturned" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="合同总金额(元):">
              <el-input v-model="performanceForm.contractAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="转履约金额(元):" prop="performanceAmount">
              <el-input  v-model="performanceForm.performanceAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入转履约金额"></el-input>
            </el-form-item>
            <el-form-item label="计划归还日期:" prop="plannedReturnDate">
              <el-date-picker v-model="performanceForm.plannedReturnDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="特殊说明:">
              <el-input type="textarea" :rows="8" placeholder="请输入特殊说明" v-model="performanceForm.specialInstructions"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
           
           
            <el-form-item label="单号:">
              <el-input v-model="performanceForm.performanceBondCode" disabled></el-input>
            </el-form-item>
             <el-form-item label="招标单位:">
                <el-input v-model="performanceForm.biddingUnit" placeholder="请输入招标单位" contractCode></el-input>
                 <!-- <el-select
                  v-model="performanceForm.biddingUnitId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchNyCustomerName(query)"
                  placeholder="项目报登带出可修改"
                  :loading="nycustomerNameloading"
                  
                >
                  <el-option
                    v-for="item in nycustomerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
              <!-- <el-input v-model="performanceForm.biddingUnit" placeholder="自动带出" disabled></el-input> -->
            </el-form-item>
            <el-form-item label="汇入单位或户名:" prop="remittanceUnit">
              <el-input v-model="performanceForm.remittanceUnit" placeholder="自动带出" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="币种:">
              <el-select v-model="performanceForm.currency" size="small" placeholder="请选择币种">
                <el-option
                  v-for="item in currency"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="实际归还金额(元):" disabled>
              <el-input v-model="performanceForm.actualReturnAmount" placeholder="自动带出" disabled></el-input>
            </el-form-item>
             <el-form-item label="实际归还日期:">
              <el-date-picker v-model="performanceForm.actualReturnDate" type="datetime" placeholder="自动带出" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="负责员工:" prop="userId">
              <el-select
                v-model="performanceForm.userId"
                filterable
                remote
                reserve-keyword
                :remote-method="performanceSelectPerson"
                placeholder="请输入负责员工"
                :loading="performanceUserLoading"
                @change="getPerformanceDeptId"
              >
                <el-option
                  v-for="item in performanceUserList"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门:">
                <el-select
                  v-model="performanceForm.deptId"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in performanceDeptInfo"
                    :key="item.CREATE_DEPT"
                    :label="item.CREATE_DEPT_NAME"
                    :value="item.CREATE_DEPT"
                  ></el-option>
                </el-select>
              <!-- <el-input v-model="performanceForm.deptId" placeholder="选择员工自动带入" disabled></el-input> -->
            </el-form-item>
            <el-form-item label="创建人:">
                <el-select
                  v-model="performanceForm.createUser"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in performanceCreateInfo"
                    :key="item.CREATE_USER"
                    :label="item.CREATE_USER_NAME"
                    :value="item.CREATE_USER"
                  ></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="创建时间:">
              <el-input v-model="performanceForm.createTime" placeholder="自动带出" disabled></el-input>
            </el-form-item>
           
            <el-form-item label="审批状态:">
              <el-select
                v-model="performanceForm.flowStatus"
                size="small"
                disabled
                placeholder="自动带出"
              >
                <el-option
                  v-for="item in flowStatus"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="审批结束时间:">
              <el-date-picker v-model="performanceForm.flowCompletedTime" type="datetime" placeholder="自动带出" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="相关文件上传:" prop="affixList">
          <file-upload
            v-if="performance"
            :data.sync="performanceAffixList"
            :mainId="performanceMainDataId"
            modelName="CRM_ZLYBZJ"
            fieldName="CRM_ZLYBZJ#ANNEX"
          ></file-upload>
        </el-form-item>
      <div  style="margin-top:10px;text-align:right;margin-bottom:30px">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          v-if="performanceForm.flowStatus =='0' || performanceForm.flowStatus ==''"
          :loading="performanceBtnLoading"
          @click="performanceSaveAndSubmit('performanceForm')"
        >保存并提交</el-button>
        <!-- <el-button
          type="primary"
          size="small"
          icon="el-icon-document"

          :loading="performanceBtnLoading"
          @click="performanceSave('performanceForm')"
        >保 存</el-button> -->
        <el-button size="small" @click="performance = false" icon="el-icon-circle-close">取 消</el-button>
      </div>
      </el-form>
      </div>
    </el-dialog>
     <el-dialog 
     v-dialog
       :fullscreen="fullscren"  
       v-if="invoiceVisible"
      :visible.sync="invoiceVisible"
      class="avue-dialog"
       modal-append-to-body
      width="30%"
       top="8vh"
      ref="dialog" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">发票收回</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
      <el-form ref="performanceReturnForm" :model="invoiceForm" label-width="140px" size="small">
            <el-form-item label="实际收回日期:">
              <el-date-picker v-model="invoiceForm.invoiceRecoveryDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          @click="invoiceSave"
        >确 定</el-button>
        <el-button size="small" @click="invoiceVisible = false" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog 
     v-dialog
     v-if="wtbService"
       :fullscreen="fullscren" 
      :visible.sync="wtbService"
     modal-append-to-body
      class="avue-dialog"
      width="75%"
      top="8vh"
      ref="dialog" 
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="wtbServiceClose"
      >
      <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">转中标服务费</span>
      <div class="avue-crud__dialog__menu">
        <i
          @click="handleFullScreen"
          class="el-dialog__close el-icon-full-screen"
        ></i>
      </div>
    </div>
    <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:10px">
     <el-form ref="serviceForm" :model="wtbServiceForm" :rules="wtbServiceRules" label-width="140px" size="small">
       <el-button type="primary" size="small" icon="el-icon-s-fold" v-if="wtbServiceForm.flowStatus=='2'"  @click="invoiceBack">发票收回</el-button>
        <h4>中标服务费信息</h4>
        <el-row :gutter="20">
          <el-col :span="12"> 
            <el-form-item label="项目报登号:" prop="projectCode">
              <el-input v-model="wtbServiceForm.projectCode" placeholder="请输入项目报登号" disabled clearable></el-input>
               <!-- <el-select v-model="wtbServiceForm.projectCode"  filterable remote reserve-keyword placeholder="请输入项目报登号" :remote-method="getwtbServiceProjectNewspaper" @change="getwtbServiceProjectInfo" :loading="wtbServiceNewspaperLoading">
              <el-option v-for="item in wtbServiceFormNewspaper" :key="item.projectReportNum" :label="item.projectReportNum" :value="item.projectReportNum"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="投标保证金单号:">
              <el-input v-model="wtbServiceForm.bidBondCode" placeholder="请输入投标保证金单号" disabled></el-input>
            </el-form-item>
           <el-form-item label="纸质合同号:"  prop="contractCode">
              <el-input v-model="wtbServiceForm.contractCode" placeholder="请输入纸质合同号"  clearable></el-input>
              <!-- <el-select
                v-model="wtbServiceForm.contractCodeId"
                filterable
                remote
                reserve-keyword
                :remote-method="searchZBContractCode"
                placeholder="项目报登带出,可修改"
                :loading="ZBContractCodeloading"
              >
                <el-option
                  v-for="item in ZBContractCodeList"
                  :key="item.id"
                  :label="item.paperContractNo"
                  :value="item.id"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="保证金申请金额(元):">
              <el-input v-model="wtbServiceForm.bidBondAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="未归还保证金:">
              <el-input v-model="wtbServiceForm.bondNotReturnedAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="计划归还日期:">
              <el-date-picker v-model="wtbServiceForm.plannedReturnDate"  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="合同总金额(元):">
              <el-input v-model="wtbServiceForm.contractAmount" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')" ></el-input>
            </el-form-item>
            <el-form-item label="中标服务费(元):" prop="bidServiceAmount">
              <el-input v-model="wtbServiceForm.bidServiceAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入中标服务费"></el-input>
            </el-form-item>
            <!-- <el-form-item label="财务支付(元):">
              <el-input v-model="wtbServiceForm.financialPayment" placeholder="自动带出" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="财务支付日期:">
              <el-date-picker v-model="wtbServiceForm.financialPaymentDate"  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="自动带出"></el-date-picker>
            </el-form-item> -->
            <el-form-item label="发票收回日期:">
              <el-date-picker v-model="wtbServiceForm.invoiceRecoveryDate" disabled type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="自动带出"></el-date-picker>
            </el-form-item>
            <el-form-item label="特殊说明:">
              <el-input type="textarea" :rows="8" placeholder="请输入特殊说明" v-model="wtbServiceForm.specialInstructions"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
           
            <!-- <el-form-item label="实际归还日期:">
              <el-date-picker v-model="wtbServiceForm.actualReturnAmount" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item> -->
            <el-form-item label="单号:">
              <el-input v-model="wtbServiceForm.bidServiceChargeCode" placeholder="自动带出" disabled></el-input>
            </el-form-item>
             <el-form-item label="招标单位:" prop="biddingUnit">
               <el-input v-model="wtbServiceForm.biddingUnit" placeholder="请输入招标单位"></el-input>
                  <!-- <el-select
                  v-model="wtbServiceForm.biddingUnitId"
                  filterable
                  remote
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchZBCustomerName(query)"
                  placeholder="项目报登带出可修改"
                  :loading="zbcustomerNameloading"
                >
                  <el-option
                    v-for="item in zbcustomerNameList"
                    :key="item.id"
                    :label="item.customerName"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
              <!-- <el-input v-model="wtbServiceForm.biddingUnit" placeholder="项目报登带出,可修改"></el-input> -->
            </el-form-item>
            <el-form-item label="汇入单位或户名:" prop="remittanceUnit">
              <el-input v-model="wtbServiceForm.remittanceUnit" placeholder="项目报登带出,可修改"></el-input>
            </el-form-item>
             <!-- <el-form-item label="币种:">
              <el-select v-model="wtbServiceForm.currency" size="small" placeholder="请选择币种">
                <el-option
                  v-for="item in currency"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="开户银行:" prop="bankName">
              <el-input v-model="wtbServiceForm.bankName" placeholder="项目报登带出,可修改"></el-input>
            </el-form-item>
            <el-form-item label="银行账号:" prop="bankAccount">
              <el-input v-model="wtbServiceForm.bankAccount" placeholder="项目报登带出,可修改"></el-input>
            </el-form-item>
            <!-- <el-form-item label="付款方式:" prop="paymentMethod">
              <el-select v-model="wtbServiceForm.paymentMethod" >
                <el-option v-for="item in paymentMethod" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="负责员工:" prop="userId">
              <el-select
                v-model="wtbServiceForm.userId"
                filterable
                remote
                reserve-keyword
                :remote-method="wtbServiceSelectPerson"
                placeholder="请输入负责员工"
                :loading="wtbServiceUserLoading"
                @change="getwtbServiceDeptId"
              >
                <el-option
                  v-for="item in wtbServiceUserList"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门:">
                 <el-select
                  v-model="wtbServiceForm.deptId"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in wtbServiceDeptInfo"
                    :key="item.CREATE_DEPT"
                    :label="item.CREATE_DEPT_NAME"
                    :value="item.CREATE_DEPT"
                  ></el-option>
                </el-select>
              <!-- <el-input v-model="wtbServiceForm.deptId" placeholder="选择员工自动带入" disabled></el-input> -->
            </el-form-item>
             <el-form-item label="创建人:">
                <el-select
                  v-model="wtbServiceForm.createUser"
                  filterable
                  remote
                  disabled
                  reserve-keyword
                  placeholder="自动带入"
                >
                  <el-option
                    v-for="item in wtbServiceCreateInfo"
                    :key="item.CREATE_USER"
                    :label="item.CREATE_USER_NAME"
                    :value="item.CREATE_USER"
                  ></el-option>
                </el-select>
              <!-- <el-input v-model="wtbServiceForm.createUser" placeholder="请输入创建人" disabled></el-input> -->
            </el-form-item>
             <el-form-item label="创建时间:">
              <el-input v-model="wtbServiceForm.createTime" placeholder="自动带出" disabled></el-input>
            </el-form-item>
           
            <el-form-item label="审批状态:">
              <el-select
                v-model="wtbServiceForm.flowStatus"
                size="small"
                disabled
                placeholder="审批状态"
              >
                <el-option
                  v-for="item in flowStatus"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="审批结束时间:">
              <el-date-picker v-model="wtbServiceForm.flowCompletedTime" type="datetime" disabled placeholder="自动带出"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="相关文件上传:" prop="affixList">
          <file-upload
            v-if="wtbService"
            :data.sync="wtbServiceAffixList"
            :mainId="wtbServiceMainDataId"
            
            modelName="CRM_ZBFW"
            fieldName="CRM_ZBFW#ANNEX"
          ></file-upload>
        </el-form-item>
      
      <div style="margin-top:10px;text-align:right;margin-bottom:30px">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-document"
          v-if="wtbServiceForm.flowStatus =='0' || wtbServiceForm.flowStatus ==''"
          :loading="wtbServiceBtnLoading"
          @click="serviceSaveAndSubmit('serviceForm')"
        >保存并提交</el-button>
        <!-- <el-button
          type="primary"
          
          size="small"
          icon="el-icon-document"
          :loading="wtbServiceBtnLoading"
          @click="serviceSave('serviceForm')"
        >保 存</el-button> -->
        <el-button size="small"  @click="wtbService = false" icon="el-icon-circle-close">取 消</el-button>
      </div>
      </el-form>
    </div>
    </el-dialog>
     </basic-container>
</template>

<script>
import fileUpload from "@/components/fileUpload";
import {
  getList,
  submit,
  getUserName,
  getProjectNumber,
  getFixedValue,
  getDetail,
  remove,
  turnDetailPerformance,
  performanceSubmit,
  serviceSubmit,
  turnDetailService,
  bondReturn,
  bondReturnSubmit,
  performanceReturn,
  performanceReturnSubmit,
  flowList,
  getContractCode,
  getCustomerName,
  invoiceBack,
  invoiceSubmit
} from "@/api/biz/crm/bond";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
export default {
   components: {
    fileUpload,
  },
  props:{
     dialogVisible:{
        type: Boolean,
        default: false
     },
     nodeAlias:{
      type: String,
      default: ''
    },
    editFlag:{
      type: Boolean,
      default: undefined
    },
    detailId:{
      type: String,
      default: ''
    },
  },
  data(){
      return {
        fullscren:false,
        bondStatus:[], // 保证金状态
          btnLoading:false,
          performanceBtnLoading:false,
          wtbServiceBtnLoading:false,
          bondDeptInfo:[], // 保证金部门
          bondCreateInfo:[] , // 保证金创建人
          performanceDeptInfo:[],
          performanceCreateInfo:[],
          wtbServiceDeptInfo:[],
          wtbServiceCreateInfo:[],
          projectNewspaperLoading:false, // 项目报登号loading
      projectNewspaper:[],//保证金项目报登号option
      customerNameloading:false, // 招标单位loading
      customerNameList:[], // 招标单位
      nycustomerNameloading:false,
      nycustomerNameList:[],
      zbcustomerNameloading:false,
      zbcustomerNameList:[],
      performanceFormNewspaper:[], // 履约项目报登号option
      performanceNewspaperLoading:false, // 履约项目报登loading
      contractCodeLoading:false, // 履约纸质合同号loading
      contractCodeList:[], // 履约纸质合同号
      ZBContractCodeloading:false, // 中标纸质合同号loading
      ZBContractCodeList:[], //中标纸质合同号
      wtbServiceNewspaperLoading:false, //中标项目报登loading
      wtbServiceFormNewspaper:[], // 中标项目报登号option
       userLoading:false, // 负责员工loading
      userOption:[], //保证金负责员工option
      selectDeptId: "", //保证金选中的负责员工
      performanceUserList:[], // 转履约负责员工option
      performanceUserLoading:false, //转履约负责员工loading
      performanceSelectDeptId:'', //转履约选中的负责员工
      wtbServiceSelectDeptId:'', //中标选中的负责员工
      wtbServiceUserList:[], // 中标负责员工option
      wtbServiceUserLoading:false, // 中标负责员工loading
    
      returnDialogVisible:false, //归还弹框
      performance:false,//转履约弹框
      performanceReturnDialogVisible:false, // 转履约归还弹框
      invoiceForm:{},
      invoiceVisible:false,
      wtbService:false, // 中标服务费弹框
      basicForm: {
        //基础信息
      },
      performanceData:{}, //后台返回履约保证金表单数据
      wtbServiceData:{}, //后台返回中标表单数据
      bondAffixList:[],// 保证金附件
      performanceAffixList:[],//转履约附件
      wtbServiceAffixList:[], // 中转服务费附件
      mainDataId: "", //主模型Id
      performanceMainDataId:'', //转履约模型Id
      wtbServiceMainDataId:'', // 中标服务费Id
      addDefaultValue:[], //新增默认值
      performanceForm:{},//转履约表单
      wtbServiceForm:{}, // 中标服务费表单
      returnForm:{}, //归还表单
      performanceReturnForm:{}, // 履约归还表单
      company:[],// 投标单位（公司）
      flowStatus:[], // 审批状态
      paymentMethod:[], //付款方式
      currency:[], //币种
      bondRules:{
        treatmentMethod:[
          { required: true, message: "请选择处理方式" }
        ],
        bondType: [
          { required: true, message: "请选择保证金类型"}
        ],
        bidder: [
          { required: true, message: "请选择投标单位" }
        ],
        projectCode: [
          { required: true, message: "请输入项目报登号"}
        ],
        biddingUnitPerson: [
          { required: true, message: "请输入联系人"}
        ],
        biddingUnitPhone: [
          { required: true, message: "请输入联系电话"}
        ],
        biddingUnitAddress: [
          { required: true, message: "请输入地址"}
        ],
        remittanceUnit: [
          { required: true, message: "请输入汇入单位"}
        ],
        bankName: [
          { required: true, message: "请输入开户行"}
        ],
        bankAccount: [
          { required: true, message: "请输入银行账号"}
        ],
        paymentMethod: [
          { required: true, message: "请选择付款类型"}
        ],
        applicationAmount: [
          { required: true, message: "请输入申请金额"}
        ],
        paymentDate: [
          { required: true, message: "请输入支付日期" }
        ],
        plannedReturnDate: [
          { required: true, message: "请输入归还日期"}
        ],
        userId: [
          { required: true, message: "请输入负责员工" }
        ],
    },
    performanceRules:{
        projectCode: [
          { required: true, message: "请输入项目报登号"}
        ],
        bidBondCode: [
          { required: true, message: "请输入投标保证金单号"}
        ],
        performanceAmount: [
          { required: true, message: "请输入转履约金额"}
        ],
        plannedReturnDate: [
          { required: true, message: "请选择计划归还日期"}
        ],
        remittanceUnit: [
          { required: true, message: "请输入汇入单位"}
        ],
        userId: [
          { required: true, message: "请输入负责员工"}
        ],
    },
    wtbServiceRules:{
         projectCode: [
          { required: true, message: "请输入项目报登号"}
        ],
        contractCode: [
          { required: true, message: "请输入纸质合同号"}
        ],
        bidServiceAmount: [
          { required: true,  message: "请输入中标服务费" }
        ],
        biddingUnit: [
          { required: true, message: "请输入招标单位"}
        ],
        remittanceUnit: [
          { required: true, message: "请输入汇入单位"}
        ],
        bankName: [
          { required: true, message: "请输入开户行"}
        ],
        bankAccount: [
          { required: true, message: "请输入银行账号"}
        ],
        paymentMethod: [
          { required: true, message: "请选择付款方式"}
        ],
        userId: [
          { required: true, message: "请输入负责员工"}
        ],
    }
      }
  },
  created(){
      this.getDicts("company").then(res => {
      this.company = res.data.data;
    });
    this.getDicts("crm_payment_method").then(res => {
      this.paymentMethod = res.data.data;
    });
    this.getDicts("bill-coin").then(res => {
      this.currency = res.data.data;
    });
    this.getDicts("crm_bond_status").then(res => {
      this.bondStatus = res.data.data;
    });
    this.getmodels('flow_status').then(res => {
      this.flowStatus = res.data.data;
    });
    if(this.detailId){
        this.detail(this.detailId)
    }
  },
  methods:{
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
      add(){
          this.basicForm = {};
      this.bondAffixList = [];
      this.mainDataId = "";
      this.userOption = [];
      this.basicForm.paymentMethod = '1';
      this.projectNewspaper = [];
      this.basicForm.currency = "RMB";
      getFixedValue('CRM_TBBZJ').then(res => {
        this.addDefaultValue = res.data.data;
        this.userOption = [
          {
            realName: res.data.data.CREATE_USER_NAME,
            id: res.data.data.CREATE_USER,
            account:res.data.data.UPDATE_USER.account,
            deptName:res.data.data.CREATE_DEPT_NAME
          }
        ];
        this.bondDeptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.CREATE_DEPT_NAME,
            CREATE_DEPT: res.data.data.CREATE_DEPT
          }
        ];
        this.bondCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.CREATE_USER_NAME,
            CREATE_USER: res.data.data.CREATE_USER
          }
        ];
        this.$set(this.basicForm, "createUser", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "userId", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "deptId", res.data.data.CREATE_DEPT);
        this.$set(this.basicForm, "createTime", res.data.data.CREATE_TIME);
        this.$set(this.basicForm, "flowStatus", res.data.data.FLOW_STATUS);
      });
      },
      close(){
         this.$emit("closeDialog")
      },
      closeValidate(){
         this.$refs.bondForm.resetFields();
      },
      detail(id){
          getDetail(id).then(res => {
              this.userOption = [
          {
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account:res.data.data.account,
            deptName:res.data.data.deptName
          }
        ];
        this.bondDeptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
          }
        ];
        this.bondCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
        this.customerNameList = [{
          customerName:res.data.data.biddingUnit,
          id:res.data.data.biddingUnitId
        }]
        this.basicForm = res.data.data;
        this.mainDataId = res.data.data.id;
        this.$refs.fileUpload.init(this.mainDataId);
      });
      },
     
    //关闭转履约保证金弹框
    performanceClose(){
      this.$refs.performanceForm.clearValidate();
    },
    // 关闭中标弹框
    wtbServiceClose(){
       this.$refs.serviceForm.clearValidate();
    },
    //保证金保存并提交
    bondSaveAndSubmit(formName){
        this.$refs[formName].validate(valid=>{
        if(valid){
           this.basicForm.affixList = this.bondAffixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_TBBZJ").then(res1 => {
                let obj = {
                  flowKey: "CRM_TBBZJ_DART",
                  formType: "S",
                  modelId: res1.data.data.id,
                  dataId: res.data.data.id,
                  variables: {functionPath:this.$route.fullPath}
                };
                startFlow(obj)
                  .then(res2 => {
                    if (res2.data.code == 200) {
                      this.$message.success(res2.data.msg);
                      this.btnLoading = false;
                      this.close();
                    }
                  })
                  .catch(error => {
                    this.btnLoading = false;
                  });
              });
            }
          });
        }
      })
    },
    // 保证金保存
    bondSave(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          this.basicForm.affixList = this.bondAffixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res=>{
              if (res.data.code == 200) {
                this.$message.success("操作成功");
                this.btnLoading = false;
              this.close()  
              }
          })
        }
      })
    },
    //转履约保存
    performanceSave(formName){
       this.$refs[formName].validate(valid=>{
        if(valid){
        //   this.performanceForm.createUser = this.performanceData.createUser;
        //   this.performanceForm.deptId = this.performanceSelectDeptId;
          this.performanceForm.affixList = this.performanceAffixList;
          this.performanceBtnLoading = true;
          performanceSubmit(this.performanceForm).then(res=>{
              if (res.data.code == 200) {
                this.$message.success("操作成功");
              this.performance = false; 
              this.performanceBtnLoading = false;
              }
          })
        }
      })
    },
    //转履约保存并提交
    performanceSaveAndSubmit(formName){
        this.$refs[formName].validate(valid=>{
        if(valid){
           this.performanceForm.affixList = this.performanceAffixList;
          this.performanceBtnLoading = true;
          performanceSubmit(this.performanceForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_ZLYBZJ").then(res1 => {
                let obj = {
                  flowKey: "CRM_ZLYBZJ_DART",
                  formType: "S",
                  modelId: res1.data.data.id,
                  dataId: res.data.data.id,
                  variables: {functionPath:this.$route.fullPath}
                };
                startFlow(obj)
                  .then(res2 => {
                    if (res2.data.code == 200) {
                      this.$message.success(res2.data.msg);
                      this.performanceBtnLoading = false;
                      this.performance = false; 
                    }
                  })
                  .catch(error => {
                    this.performanceBtnLoading = false;
                  });
              });
            }
          });
        }
      })
    },
    //中标保存
    serviceSave(formName){
         this.$refs[formName].validate(valid=>{
        if(valid){
          this.wtbServiceForm.affixList = this.wtbServiceAffixList;
         this.wtbServiceBtnLoading = true; 
          serviceSubmit(this.wtbServiceForm).then(res=>{
              if (res.data.code == 200) {
                this.$message.success("操作成功");
              this.wtbService = false; 
              this.wtbServiceBtnLoading = false;
              }
          })
        }
      })
    },
    // 中标保存并提交
    serviceSaveAndSubmit(formName){
         this.$refs[formName].validate(valid=>{
        if(valid){
           this.wtbServiceForm.affixList = this.wtbServiceAffixList;
          this.wtbServiceBtnLoading = true;
          serviceSubmit(this.wtbServiceForm).then(res => {
            if (res.data.code == 200) {
              modelByName("CRM_ZBFW").then(res1 => {
                let obj = {
                  flowKey: "CRM_ZBFW_DART",
                  formType: "S",
                  modelId: res1.data.data.id,
                  dataId: res.data.data.id,
                  variables: {functionPath:this.$route.fullPath}
                };
                startFlow(obj)
                  .then(res2 => {
                    if (res2.data.code == 200) {
                      this.$message.success(res2.data.msg);
                      this.wtbServiceBtnLoading = false;
                      this.wtbService = false; 
                    }
                  })
                  .catch(error => {
                    this.wtbServiceBtnLoading = false;
                  });
              });
            }
          });
        }
      })
    },
    //搜索招标单位
    searchCustomerName(query){
        if (query !== "") {
        this.customerNameloading = true;
        getCustomerName(query).then(res => {
          this.customerNameList = res.data.data;
          this.customerNameloading = false;
        });
      } else {
        this.customerNameList = [];
      }
    },
     //搜索招标单位
    searchNyCustomerName(query){
        if (query !== "") {
        this.nycustomerNameloading = true;
        getCustomerName(query).then(res => {
          this.nycustomerNameList = res.data.data;
          this.nycustomerNameloading = false;
        });
      } else {
        this.nycustomerNameList = [];
      }
    },
    //搜索招标单位
    searchZBCustomerName(query){
        if (query !== "") {
        this.zbcustomerNameloading = true;
        getCustomerName(query).then(res => {
          this.zbcustomerNameList = res.data.data;
          this.zbcustomerNameloading = false;
        });
      } else {
        this.zbcustomerNameList = [];
      }
    },
    //获取保证金项目报登号
    getProjectNewspaper(query){
        if(query !== ""){
          this.projectNewspaperLoading = true;
           getProjectNumber(query).then(res=>{
             this.projectNewspaper = res.data.data;
             this.projectNewspaperLoading = false;
           })
        }else{
          this.projectNewspaper = [];
        }
    },
    //获取保证金报登号下的信息
    getProjectInfo(value){
       this.projectNewspaper.forEach(ele => {
        if (ele.projectReportNum == value) {
            this.userOption = [ele.chargePerson]
            this.$set(this.basicForm, "userId", ele.chargeStaff);
            this.bondDeptInfo = [{
                CREATE_DEPT_NAME: ele.departmentName,
            CREATE_DEPT: ele.departmentId
            }]
            this.$set(this.basicForm, "deptId", ele.departmentId);
            this.customerNameList = [ele.clientInfo];
            this.$set(this.basicForm, "biddingUnitId", ele.clientId);
          this.$set(this.basicForm, "projectName", ele.projectName);
        }
      });
    },
    //获取履约保证金项目报登号
    getPerformanceProjectNewspaper(query){
    if(query !== ""){
          this.performanceNewspaperLoading = true;
           getProjectNumber(query).then(res=>{
             this.performanceFormNewspaper = res.data.data;
             this.performanceNewspaperLoading = false;
           })
        }else{
          this.performanceFormNewspaper = [];
        }

    },

    //获取履约保证金报登号下的信息
    getPerfonmanceProjectInfo(value){
       this.performanceFormNewspaper.forEach(ele => {
        if (ele.projectReportNum == value) {
          // this.basicForm.biddingUnit = ele.clientName;
          // this.basicForm.projectName = ele.projectName
          this.performanceUserList = [ele.chargePerson]
            this.$set(this.performanceForm, "userId", ele.chargeStaff);
            this.performanceDeptInfo = [{
                CREATE_DEPT_NAME: ele.departmentName,
            CREATE_DEPT: ele.departmentId
            }]
            this.$set(this.performanceForm, "deptId", ele.departmentId);
            this.nycustomerNameList = [ele.clientInfo];
            this.$set(this.performanceForm, "biddingUnitId", ele.clientId);
        //   this.$set(this.basicForm, "projectName", ele.projectName);
        }
      });
    },
    // 搜索纸质合同号
   searchContractCode(query){
       if (query !== "") {
        this.contractCodeLoading = true;
        getContractCode(query).then(res => {
          this.contractCodeList = res.data.data;
          this.contractCodeLoading = false;
        });
      } else {
        this.contractCodeList = [];
      }
   },
   // 选择纸质合同号
   getCodeId(value){
        this.contractCodeList.forEach(ele=>{
        if(ele.id == value){
             this.responsibleStaff = [ele.chargePerson];
             this.$set(this.basicForm,'userId',ele.chargeStaff);
             this.deptInfo = [
          {
            CREATE_DEPT_NAME: ele.departmentName,
            CREATE_DEPT: ele.departmentId
          }
        ];
             this.$set(this.basicForm,'deptId',ele.departmentId);
             this.customerNameList = [ele.clientInfo];
             this.$set(this.basicForm,'customerId',ele.clientId);
              
        }
    })
  
    
   },
   // 中标纸质合同号
   searchZBContractCode(query){
      if (query !== "") {
        this.ZBContractCodeloading = true;
        getContractCode(query).then(res => {
          this.ZBContractCodeList = res.data.data;
          this.ZBContractCodeloading = false;
        });
      } else {
        this.ZBContractCodeList = [];
      }
   },
    // 获取中标项目报登号
    getwtbServiceProjectNewspaper(query){
       if(query !== ""){
          this.wtbServiceNewspaperLoading = true;
           getProjectNumber(query).then(res=>{
             this.wtbServiceFormNewspaper = res.data.data;
             this.wtbServiceNewspaperLoading = false;
           })
        }else{
          this.wtbServiceFormNewspaper = [];
        }
    },
    //获取中标报登号下的信息
    getwtbServiceProjectInfo(value){
       this.wtbServiceFormNewspaper.forEach(ele => {
        if (ele.projectReportNum == value) {
          // this.basicForm.biddingUnit = ele.clientName;
          // this.basicForm.projectName = ele.projectName
          this.wtbServiceUserList = [ele.chargePerson]
            this.$set(this.wtbServiceForm, "userId", ele.chargeStaff);
            this.wtbServiceDeptInfo = [{
                CREATE_DEPT_NAME: ele.departmentName,
            CREATE_DEPT: ele.departmentId
            }]
            this.$set(this.wtbServiceForm, "deptId", ele.departmentId);
            this.zbcustomerNameList = [ele.clientInfo];
            this.$set(this.wtbServiceForm, "biddingUnitId", ele.clientId);
        }
      });
    },
    //选择保证金负责员工
    selectPerson(query) {
      if (query !== "") {
        this.userLoading = true;
        getUserName(query).then(res => {
          this.userOption = res.data.data;
          this.userLoading = false;
        });
      } else {
        this.userOption = [];
      }
    },
    // 获取保证金部门
    getDeptId(value) {
      console.log(value);
      this.userOption.forEach(ele => {
        if (ele.id == value) {
          this.bondDeptInfo = [
          {
            CREATE_DEPT_NAME: ele.deptName,
            CREATE_DEPT: ele.deptId
          }];
          this.basicForm.deptId = ele.deptId;
        }
      });
    },
    //选择转履约保证金负责员工
    performanceSelectPerson(query) {
      if (query !== "") {
        this.performanceUserLoading = true;
        getUserName(query).then(res => {
          this.performanceUserList = res.data.data;
          this.performanceUserLoading = false;
        });
      } else {
        this.performanceUserList = [];
      }
    },
    //获取转履约保证金部门
    getPerformanceDeptId(value) {
      console.log(value);
      this.performanceUserList.forEach(ele => {
        if (ele.id == value) {
          this.performanceDeptInfo = [
          {
            CREATE_DEPT_NAME: ele.deptName,
            CREATE_DEPT: ele.deptId
          }];
          this.performanceForm.deptId = ele.deptId;
        }
      });
    },
    //选择中标负责员工
    wtbServiceSelectPerson(query) {
      if (query !== "") {
        this.wtbServiceUserLoading = true;
        getUserName(query).then(res => {
          this.wtbServiceUserList = res.data.data;
          this.wtbServiceUserLoading = false;
        });
      } else {
        this.wtbServiceUserList = [];
      }
    },
    //获取中标部门
    getwtbServiceDeptId(value) {
      console.log(value);
      this.wtbServiceUserList.forEach(ele => {
        if (ele.id == value) {
           this.wtbServiceDeptInfo = [
          {
            CREATE_DEPT_NAME: ele.deptName,
            CREATE_DEPT: ele.deptId
          }];
          this.wtbServiceForm.deptId = ele.deptId;
        }
      });
    },
    //转履约
    turnPerformance(){
      // if(this.mainDataId =='2'){

      // }
     
      turnDetailPerformance(this.mainDataId).then(res=>{
        if(res.data.data.userId){
          this.performanceUserList = [{
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account:res.data.data.account,
            deptName:res.data.data.deptName
           }]
        }
           this.performanceDeptInfo = [{
               CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
           }]
           this.performanceCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
        this.nycustomerNameList = [{
           customerName:res.data.data.biddingUnit,
           id:res.data.data.biddingUnitId
       }]
        this.contractCodeList = [{
                     paperContractNo:res.data.data.contractCode,
                     id:res.data.data.contractCodeId,
                 }]
                   this.performanceForm = res.data.data;
                 if(res.data.data.flowStatus){
                    this.$set(this.performanceForm,"flowStatus",res.data.data.flowStatus)
                 }else{
                     getFixedValue('CRM_ZLYBZJ').then(res=>{
            this.$set(this.performanceForm,"flowStatus",res.data.data.FLOW_STATUS)
      })
                 }
         
        //    this.performanceData = this.deepClone(res.data.data);
        //    this.performanceForm.userId = res.data.data.userName;
        // this.performanceForm.deptId = res.data.data.deptName;
        // this.performanceForm.createUser = res.data.data.createUserName;
        this.performanceMainDataId = res.data.data.id;
        this.performance = true;
      })     
    },
    //转中标服务费
    turnService(){
      turnDetailService(this.mainDataId).then(res=>{
        if(res.data.data.userId){
           this.wtbServiceUserList = [{
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account:res.data.data.account,
            deptName:res.data.data.deptName
           }]
        } 
           this.wtbServiceDeptInfo = [{
               CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
           }]
           this.wtbServiceCreateInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
       this.zbcustomerNameList = [{
           customerName:res.data.data.biddingUnit,
           id:res.data.data.biddingUnitId
       }]
        this.wtbServiceForm = res.data.data;
         if(res.data.data.flowStatus){
                    this.$set(this.wtbServiceForm,"flowStatus",res.data.data.flowStatus)
                 }else{
                     getFixedValue('CRM_ZBFW').then(res=>{
            this.$set(this.wtbServiceForm,"flowStatus",res.data.data.FLOW_STATUS)
      })
                 }
        //    this.wtbServiceData = this.deepClone(res.data.data);
          //  this.wtbServiceForm.paymentMethod = '1';
        //    this.wtbServiceForm.userId = res.data.data.userName;
        // this.wtbServiceForm.deptId = res.data.data.deptName;
        // this.wtbServiceForm.createUser = res.data.data.createUserName;
        this.wtbServiceMainDataId = res.data.data.id;
         this.wtbService = true;
      })
     
    },
    //归还
    returnDialog(){
      bondReturn(this.mainDataId).then(res=>{
          this.returnForm = res.data.data;
           this.returnDialogVisible = true;
      })
    },
    // 履约归还
    performanceReturnDialog(){
         performanceReturn(this.performanceMainDataId).then(res=>{
          this.performanceReturnForm = res.data.data;
           this.performanceReturnDialogVisible = true;
      })
    },
    //保证金归还保存
    bondReturnSave(){
      bondReturnSubmit(this.returnForm).then(res=>{
            this.basicForm.actualReturnAmount = res.data.data.actualReturnAmount;
            this.basicForm.actualReturnDate = res.data.data.actualReturnDate;
            this.returnDialogVisible = false;
      })
    },
    //履约归还保存
    performanceReturnSave(){
      performanceReturnSubmit(this.performanceReturnForm).then(res=>{
            this.performanceForm.actualReturnAmount = res.data.data.actualReturnAmount;
            this.performanceForm.actualReturnDate = res.data.data.actualReturnDate;
            this.performanceReturnDialogVisible = false;
      })
    },
    invoiceBack(){
      invoiceBack(this.wtbServiceMainDataId).then(res=>{
          // this.invoiceForm.invoiceRecoveryDate = res.data.data.invoiceRecoveryDate;
          this.$set(this.invoiceForm,'invoiceRecoveryDate',res.data.data.invoiceRecoveryDate)
           this.invoiceVisible = true;
      })
    },
    //发票收回
    invoiceSave(){
      this.invoiceForm.id=this.wtbServiceMainDataId;
       invoiceSubmit(this.invoiceForm).then(res=>{
            this.wtbServiceForm.invoiceRecoveryDate = res.data.data.invoiceRecoveryDate;
            this.invoiceVisible = false;
      })
    }
  }
}
</script>

<style scoped>

</style>