<template>
  <basic-container style="height:100%">
      <van-nav-bar
        v-if="editFlag==undefined"
        title="礼品申请"
        fixed
        left-arrow
        :right-text="editFlag==undefined ? '提交流程' :''"
        placeholder
        @click-left="onClickLeft"
        @click-right="saveAndSubmit('ruleForm')"
    />
    <div class="dialog-body">
      <el-form
        :model="basicForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="130px"
        size="small"
        :disabled="editFlag !=undefined ? !editFlag : false"
      >
        <h4>来访基础信息</h4>
        <el-row :gutter="20">
            <el-form-item label="来访目的:" prop="visitPurpose">
              <el-select
              clearable
                v-model="basicForm.visitPurpose"
                placeholder="请选择来访目的"
                @change="selectVisitPurpose"
              >
                <el-option
                  v-for="item in visitPurpose"
                  :key="item.dictKey ? item.dictKey : item.value"
                  :label="item.dictValue? item.dictValue : item.label"
                  :value="item.dictKey ? item.dictKey : item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="纸质合同号:" prop="contractCode">
              <el-select
                v-model="basicForm.contractCode"
                filterable
                remote
                allow-create
                clearable
                reserve-keyword
                :remote-method="searchContractCode"
                placeholder="请输入纸质合同号"
                :loading="contractCodeLoading"
                @change="getCodeId"
              >
                <el-option
                  v-for="item in contractCodeList"
                  :key="item.id"
                  :label="item.paperContractNo"
                  :value="item.paperContractNo"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="customerName" label="客户名称:">
              <el-select
                v-model="basicForm.customerName"
                filterable
                remote
                clearable
                size="small"
                allow-create
                reserve-keyword
                :remote-method="(query)=>searchCustomerName(query)"
                placeholder="纸质合同号带出,可搜索修改"
                :loading="customerNameloading"
              >
                <el-option
                  v-for="item in customerNameList"
                  :key="item.id"
                  :label="item.customerName"
                  :value="item.customerName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划来访日期:" prop="plannedVisitDate">
              <el-date-picker
                v-model="basicForm.plannedVisitDate"
                type="date"
                placeholder="请选择计划来访日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="计划结束日期:" prop="plannedEndDate">
              <el-date-picker
                v-model="basicForm.plannedEndDate"
                type="date"
                :picker-options="pickerOptionsEnd"
                placeholder="请选择计划结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="来访人员:" prop="visitUserId">
              <el-select v-model="basicForm.visitUserId" clearable placeholder="请选择来访人员">
                <el-option
                  v-for="item in visitUserList"
                  :key="item.id"
                  :label="item.visitors"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="来访人数:" prop="visitNum">
              <el-input v-model="basicForm.visitNum" clearable placeholder="请输入来访人数"></el-input>
            </el-form-item>
            <el-form-item label="接待负责人:" >
              <el-select
                v-model="basicForm.receptionChargeId"
                filterable
                remote
                reserve-keyword
                clearable
                :remote-method="searchReceptionPerson"
                placeholder="请输入接待负责人"
                :loading="receptionPersonLoading"
                @change="getDeptId"
              >
                <el-option
                  v-for="item in receptionPersonList"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="经理室人员陪同:" prop="managerReception">
              <el-radio-group v-model="basicForm.managerReception">
                <el-radio label="1">不需要</el-radio>
                <el-radio label="2">需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="住宿安排:" prop="accommodationArrangement">
              <el-radio-group v-model="basicForm.accommodationArrangement">
                <el-radio label="1">不需要</el-radio>
                <el-radio label="2">需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="车辆安排:" prop="vehicleArrangement">
              <el-radio-group v-model="basicForm.vehicleArrangement">
                <el-radio label="1">不需要</el-radio>
                <el-radio label="2">需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否需要礼品:" prop="needGifts">
              <el-radio-group v-model="basicForm.needGifts">
                <el-radio label="1">不需要</el-radio>
                <el-radio label="2">需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="来访单号:">
              <el-input v-model="basicForm.visitCode" placeholder="自动带入" disabled></el-input>
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
                  v-for="item in createInfo"
                  :key="item.CREATE_USER"
                  :label="item.CREATE_USER_NAME"
                  :value="item.CREATE_USER"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间:">
              <el-date-picker
                v-model="basicForm.createTime"
                type="datetime"
                placeholder="自动带入"
                disabled
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="审批状态:">
              <el-select v-model="basicForm.flowStatus" disabled>
                <el-option
                  v-for="item in flowStatus"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审批结束时间:">
              <el-date-picker
                v-model="basicForm.flowCompletedTime"
                type="datetime"
                placeholder="自动带入"
                disabled
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="负责员工:" prop="userId">
              <el-select
                v-model="basicForm.userId"
                filterable
                remote
                clearable
                reserve-keyword
                :remote-method="dropFuzzySearch"
                placeholder="请输入负责员工"
                :loading="userLoading"
                @change="getDeptId"
              >
                <el-option
                  v-for="item in responsibleStaff"
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
                v-model="basicForm.deptId"
                filterable
                remote
                disabled
                reserve-keyword
                placeholder="自动带入"
              >
                <el-option
                  v-for="item in deptInfo"
                  :key="item.CREATE_DEPT"
                  :label="item.CREATE_DEPT_NAME"
                  :value="item.CREATE_DEPT"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="本次接待总费用(元):" >
              <el-input v-model="basicForm.receptionTotalCost" placeholder="接待专员填写" :disabled="this.nodeAlias != '4'"></el-input>
            </el-form-item> -->
            <el-form-item label="实际礼品费(元):">
              <el-input v-model="basicForm.actualGiftCost" placeholder="自动汇总" disabled></el-input>
            </el-form-item>
            <el-form-item label="电子屏欢迎标语:">
              <el-input
                v-model="basicForm.welcomeSlogan"
                :rows="3"
                clearable
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="资料准备及其他要求说明:" prop="otherRemark">
              <el-input
                v-model="basicForm.otherRemark"
                :rows="4"
                clearable
                type="textarea"
                placeholder="请输入资料准备及其他要求说明"
              ></el-input>
            </el-form-item>
            <el-form-item label="来访目的详细描述:">
              <el-input
                v-model="basicForm.detailedDescription"
                :rows="4"
                clearable
                type="textarea"
                placeholder="请输入来访目的详细描述"
              ></el-input>
            </el-form-item>
        </el-row>
        <h4>行程安排</h4>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="addtrip"
          v-if="editFlag!=undefined ? editFlag : true"
        >添加一行</el-button>
        <el-table
          :data="basicForm.customerReceptionTripEntityList"
          border
          max-height="500px"
          class="customerReception"
          style="width: 100%;margin-top:10px"
        >
          <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="toMatterRemark" label="接待事项描述" align="center" width="180px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.toMatterRemark'"
                label-width="0"
              >
                <el-input size="small" v-model="scope.row.toMatterRemark" clearable placeholder="请输入接待事项描述"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column 
                prop="toDate" 
                :sortable="true"
      
              	:sort-method="(a,b)=>{return Date.parse(a.toDate) - Date.parse(b.toDate)}"
                label="日期时间" 
                align="center" 
                width="220px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.toDate'" 
                label-width="0"
              >
                <el-date-picker
                  v-model="scope.row.toDate"
                  type="datetime"
                  size="small"
                  placeholder="请选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="itineraryLocation" label="行程地点" align="center" width="240px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.itineraryLocation'"
              
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.itineraryLocation" placeholder="请输入行程地点"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="assumePersonId" label="担当人" align="center" width="280px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.assumePersonId'"
                label-width="0"
              >
                <el-select
                  v-model="scope.row.assumePersonId"
                  filterable
                  remote
                  clearable
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchAssumePerson(query,scope.row)"
                  placeholder="请输入担当人"
                  :loading="assumePersonLoading"
                >
                  <el-option
                    v-for="item in scope.row.assumePersonList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="participantPerson" label="参与人员" align="center" width="280px">
            <!-- <template slot="header" slot-scope="scope">
              <span class="star">*</span>
              <span class="starName">参与人员</span>
            </template> -->
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.participantPerson'"
                
                label-width="0"
              >
                <el-select
                  v-model="scope.row.participantPerson"
                  filterable
                  remote
                  multiple
                  clearable
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchParticipant(query,scope.row)"
                  placeholder="请输入参与人员"
                  :loading="particpantLoading"
                >
                  <el-option
                    v-for="item in scope.row.participants"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="dataPreparerId" label="资料准备人" align="center" width="280px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.dataPreparerId'"
                label-width="0"
              >
                <el-select
                  v-model="scope.row.dataPreparerId"
                  filterable
                  remote
                  clearable
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchDataPreparer(query,scope.row)"
                  placeholder="请输入资料准备人"
                  :loading="dataPreparerLoading"
                >
                  <el-option
                    v-for="item in scope.row.dataPreparerList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="itineraryRequirements"
            label="具体行程和要求"
            align="center"
            width="240px"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionTripEntityList.' + scope.$index + '.itineraryRequirements'"
                label-width="0"
              >
                <el-input
                  size="small"
                  clearable
                  v-model="scope.row.itineraryRequirements"
                  placeholder="请输入具体行程和要求"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80px"
            fixed="right"
            v-if="editFlag!=undefined ? editFlag : true"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color:red"
                icon="el-icon-delete"
                @click="handelTripDelete(scope.row, scope.$index)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4>客户清单</h4>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="addCustomer"
          v-if="editFlag!=undefined ? editFlag : true"
        >添加一行</el-button>
        <el-table
          :data="basicForm.customerReceptionInventoryEntityList"
          border
          class="customerReception"
          style="width:100%;margin-top:10px"
        >
          <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="cusName" label="姓名" align="center">
             <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">姓名</span>
              </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionInventoryEntityList.' + scope.$index + '.cusName'"
                :rules="rules.cusName"
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.cusName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="cusSex" label="性别" align="center">
            <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">性别</span>
              </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionInventoryEntityList.' + scope.$index + '.cusSex'"
                :rules="rules.cusSex"
                label-width="0"
              >
                <el-select v-model="scope.row.cusSex" clearable size="small" placeholder="请选择性别">
                  <el-option
                    v-for="item in sex"
                    :key="item.dictKey ? item.dictKey : item.value"
                    :label="item.dictValue? item.dictValue : item.label"
                    :value="item.dictKey ? item.dictKey : item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="cusPost" label="职务" align="center">
            <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">职务</span>
              </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionInventoryEntityList.' + scope.$index + '.cusPost'"
                :rules="rules.cusPost"
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.cusPost" placeholder="请输入职务"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="cusPhone" label="联系电话" align="center">
            <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">联系电话</span>
              </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionInventoryEntityList.' + scope.$index + '.cusPhone'"
                :rules="rules.cusPhone"
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.cusPhone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="receptionAttention"
            label="接待注意事项(含少数名族的民风等说明)"
            align="center"
            width="260"
          >
          <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">接待注意事项(含少数名族的民风等说明)</span>
              </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionInventoryEntityList.' + scope.$index + '.receptionAttention'"
                :rules="rules.receptionAttention"
                label-width="0"
              >
                <el-input
                  size="small"
                  clearable
                  v-model="scope.row.receptionAttention"
                  placeholder="请输入接待注意事项"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80px"
            fixed="right"
            v-if="editFlag!=undefined ? editFlag : true"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color:red"
                icon="el-icon-delete"
                @click="handelCustomerDelete(scope.row, scope.$index)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4>礼品清单(接待专员填写)</h4>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="addGift"
          v-if="editFlag!=undefined ? editFlag : true"
        >添加一行</el-button>
        <el-table
          :data="basicForm.customerReceptionGiftEntityList"
          border
          max-height="500px"
          class="customerReception"
          style="width: 100%;margin-top:10px"
        >
          <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="giftName" label="礼品名称" align="center" width="160px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionGiftEntityList.' + scope.$index + '.giftName'"
                label-width="0"
              >
                <el-input size="small" v-model="scope.row.giftName" clearable placeholder="请输入礼品名称"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unitMeasurement" label="计量单位" align="center" width="120px">
              <!-- <template slot="header" slot-scope="scope">
                 <span class="star">*</span>
                 <span class="starName">计量单位</span>
              </template> -->
              <template slot-scope="scope">
                  <el-form-item :prop="'customerReceptionGiftEntityList.' + scope.$index + '.unitMeasurement'"  label-width="0" >
                <el-input size="small" clearable v-model="scope.row.unitMeasurement" placeholder="请输入计量单位"></el-input>
                  </el-form-item>
              </template>
            </el-table-column>
          <el-table-column prop="giftNumber" label="数量" align="center" width="140px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionGiftEntityList.' + scope.$index + '.giftNumber'"
                label-width="0"
              >
                <el-input
                  size="small"
                  clearable
                  v-model="scope.row.giftNumber"
                  placeholder="请输入数量"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="giftPrice" label="单价" align="center" width="140px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionGiftEntityList.' + scope.$index + '.giftPrice'"
                label-width="0"
              >
                <el-input
                  size="small"
                  clearable
                  v-model="scope.row.giftPrice"
                  placeholder="请输入单价"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="giftTotalAmount" label="总金额(元)" align="center" width="120px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionGiftEntityList.' + scope.$index + '.giftTotalAmount'"
                label-width="0"
              >
                <el-input
                  size="small"
                  v-model="scope.row.giftTotalAmount"
                  placeholder="自动计算"
                  disabled
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="giftRemark" label="备注" align="center" >
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionGiftEntityList.' + scope.$index + '.giftRemark'"
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.giftRemark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80px"
            fixed="right"
            v-if="editFlag!=undefined ? editFlag : true"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color:red"
                icon="el-icon-delete"
                @click="handleGiftDelete(scope.row, scope.$index)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <h4>行程纪要(接待负责人填写）</h4>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="addSummary"
          v-if="editFlag!=undefined ? editFlag : true"
        >添加一行</el-button>
        <el-table
          :data="basicForm.customerReceptionSummaryEntityList"
          border
          class="customerReception"
          style="width: 100%;margin-bottom:30px;margin-top:10px;height:100%;overflow:auto;"
        >
          <el-table-column type="index" width="50" align="center" fixed="left"></el-table-column>
          <el-table-column prop="toMatter" label="待办事项" align="center" width="240px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionSummaryEntityList.' + scope.$index + '.toMatter'"
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.toMatter" placeholder="请输入待办事项"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="chargePersonId" label="负责人" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionSummaryEntityList.' + scope.$index + '.chargePersonId'"
                label-width="0"
              >
                <el-select
                  v-model="scope.row.chargePersonId"
                  filterable
                  remote
                  clearable
                  size="small"
                  reserve-keyword
                  :remote-method="(query)=>searchSummaryPerson(query,scope.row)"
                  placeholder="请输入负责人"
                  :loading="summaryPersonLoading"
                >
                  <el-option
                    v-for="item in scope.row.summaryPersonList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="completeDate" label="要求完成日期" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionSummaryEntityList.' + scope.$index + '.completeDate'"
                label-width="0"
              >
                <el-date-picker
                  v-model="scope.row.completeDate"
                  type="date"
                  size="small"
                  placeholder="请选择要求完成日期"
                ></el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="toRemark" label="备注" align="center" width="200">
            <template slot-scope="scope">
              <el-form-item
                :prop="'customerReceptionSummaryEntityList.' + scope.$index + '.toRemark'"
                label-width="0"
              >
                <el-input size="small" clearable v-model="scope.row.toRemark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80px"
            fixed="right"
            v-if="editFlag!=undefined ? editFlag : true"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color:red"
                icon="el-icon-delete"
                @click="handleSummaryDelete(scope.row, scope.$index)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
            <el-form-item label="上传附件:" label-width="80px" prop="affixList">
              <file-upload
                ref="fileUpload"
                :data.sync="affixList"
                :mainId="mainDataId"
                :disabled="editFlag !=undefined ? !editFlag : false"
                modelName="CRM_KHJD"
                fieldName="CRM_KHJD#ANNEX"
              ></file-upload>
            </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div  style="margin-top:10px;text-align:right;margin-bottom:50px">
      <!-- <el-button
        type="primary"
        size="small"
        icon="el-icon-document"
        :loading="btnLoading"
        v-if="editFlag == undefined"
        @click="saveAndSubmit('ruleForm')"
      >保存并提交</el-button> -->
     <el-button
        type="primary"
        size="small"
        icon="el-icon-document"
        :loading="btnLoading"
        v-if="editFlag == true"
        @click="save('ruleForm')"
      >保 存</el-button>
      <!-- <el-button
        size="small"
        v-if="editFlag == undefined"
        @click="close()"
        icon="el-icon-circle-close"
      >取 消</el-button> -->
    </div>
  </basic-container>
</template>

<script>
import {
  submit,
  getList,
  getDetail,
  getFixedValue,
  getUserName,
  remove,
  getContractCode,
  getCustomerName,
  getVisitUser
} from "@/api/biz/crm/customerReception";
import { mapGetters } from "vuex";
import fileUpload from "@/components/fileUpload";
import { startFlow } from "@/api/tool/dynamic";
import { modelByName } from "@/api/biz/sbgl";
export default {
  components: {
    fileUpload
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    nodeAlias: {
      type: String,
      default: ""
    },
    editFlag: {
      type: Boolean,
      default: undefined
    },
    detailId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
       pickerOptionsEnd: {
           disabledDate: time => {
             let beginDateVal = this.basicForm.plannedVisitDate;
             if (beginDateVal) {
               return (time.getTime()<=new Date(beginDateVal).getTime()-1*24*60*60*1000
             );
           }
        }
       },
      btnLoading: false,
      addDefaultDate: {},
      affixList: [], //附件
      mainDataId: "", //主模型Id
      responsibleStaff: [], //负责员工
      userLoading: false, //负责员工loading
      contractCodeLoading: false, // 纸质合同号loading
      contractCodeList: [], // 纸质合同号
      customerNameList: [], // 客户名称option
      customerNameloading: false, // 客户名称loading
      receptionPersonLoading: false, // 接待负责人loading
      receptionPersonList: [], // 接待负责人
      assumePersonLoading:false, //担当人
      dataPreparerLoading:false,// 资料准备人
      particpantLoading: false, // 参与人员
      summaryPersonLoading: false, // 行程纪要负责人
      basicForm: {},
      rules: {
        visitPurpose: [
          { required: true, message: "请选择来访目的" }
        ],
        contractCode: [
          { required: false, message: "请选择纸质合同号" }
        ],
        customerName: [
          { required: true, message: "请输入客户名称"}
        ],
        plannedVisitDate: [
          { required: true, message: "请选择计划来访日期"}
        ],
        plannedEndDate: [
          { required: true, message: "请选择计划结束日期" }
        ],
        visitUserId: [
          { required: true, message: "请选择来访人员"}
        ],
        visitNum: [
          { required: true, message: "请输入来访人数"}
        ],
        receptionChargeId: [
          { required: true, message: "请输入接待负责人"}
        ],
        managerReception: [
          {
            required: true,
            message: "请选择是否需要经理室人员陪同",
            
          }
        ],
        otherRemark:[
          { required: true, message: "请输入资料准备及其他要求说明"}
        ],
        accommodationArrangement: [
          { required: true, message: "请选择是否需要住宿安排" }
        ],
        receptionTotalCost: [
          { required: true, message: "请输入本次接待总费用"}
        ],
        vehicleArrangement: [
          { required: true, message: "请选择是否需要车辆安排"}
        ],
        needGifts: [
          { required: true, message: "请选择是否需要礼品" }
        ],
        userId: [
          { required: true, message: "请选择负责员工"}
        ],
        toDate: [{ required: true, message: "请选择日期" }],
        startDate: [
          { required: true, message: "请选择开始时间"}
        ],
        endDate: [
          { required: true, message: "请选择结束时间" }
        ],
        itineraryLocation: [
          { required: true, message: "请输入行程地点" }
        ],
        participantPerson: [
          { required: true, message: "请选择参与人员" }
        ],
        cusName:[
          { required: true, message: "请输入姓名" }
        ],
        cusSex:[
          { required: true, message: "请选择性别" }
        ],
        cusPost:[
          { required: true, message: "请输入职务"}
        ],
        cusPhone:[
          { required: true, message: "请输入联系电话" }
        ],
        receptionAttention:[
           { required: true, message: "请输入注意事项" }
        ]
      },
      visitPurpose: [], //来访目的
      flowStatus: [], //审批状态,
      sex: [],
      deptInfo: [], // 办事处信息
      createInfo: [], // 创建人信息,
      visitUserList:[], // 来访人员
    }
  },
  created(){
    this.getmodels("flow_status").then(res => {
      this.flowStatus = res.data.data;
    });
    this.getmodels("sex").then(res => {
      this.sex = res.data.data;
    });
    this.getDicts("crm_visit_purpose").then(res => {
      this.visitPurpose = res.data.data;
    });
    getVisitUser().then(res=>{
      this.visitUserList = res.data.data;
    })
    if (this.detailId) {
      this.detail(this.detailId);
    }
  },
  methods: {
    add() {
      this.basicForm = {
        customerReceptionTripEntityList: [
          {
            toMatterRemark: "接站",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "迎宾人(5分钟)",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "展厅参观(15分钟)",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "公司介绍(30分钟)",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "参观车间(60分钟)",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "沟通交流(30分钟)",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "餐饮安排",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "酒店接送",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          },
          {
            toMatterRemark: "送站",
            toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
          }
        ],
        customerReceptionInventoryEntityList: [
          {
            cusName: "",
        cusSex: "",
        cusPost: "",
        cusPhone: "",
        receptionAttention: ""
          }
        ],
        customerReceptionGiftEntityList: [],
        customerReceptionSummaryEntityList: []
      };
      // this.$refs.fileUpload.add();
      this.affixList = [];
      this.mainDataId = "";
      this.responsibleStaff = [];
      this.contractCodeList = [];
      this.customerNameList = [];
      this.receptionPersonList = [];
      this.deptInfo = [];
      getFixedValue("CRM_KHJD").then(res => {
        this.addDefaultDate = res.data.data;
        this.responsibleStaff = [
          {
            realName: res.data.data.CREATE_USER_NAME,
            id: res.data.data.CREATE_USER,
            account: res.data.data.UPDATE_USER.account,
            deptName: res.data.data.CREATE_DEPT_NAME
          }
        ];
        this.deptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.CREATE_DEPT_NAME,
            CREATE_DEPT: res.data.data.CREATE_DEPT
          }
        ];
        this.createInfo = [
          {
            CREATE_USER_NAME: res.data.data.CREATE_USER_NAME,
            CREATE_USER: res.data.data.CREATE_USER
          }
        ];
        this.$set(this.basicForm, "createUser", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "userId", res.data.data.CREATE_USER);
        this.$set(this.basicForm, "deptId", res.data.data.CREATE_DEPT);
        this.$set(this.basicForm, "welcomeSlogan", '热烈欢迎XXX公司XX(职务)领导一行莅临指导');
        this.$set(this.basicForm, "createTime", res.data.data.CREATE_TIME);
        this.$set(this.basicForm, "flowStatus", res.data.data.FLOW_STATUS);
      });
    },
    close() {
      this.$emit("closeDialog");
    },
    closeValidate() {
      this.$refs.ruleForm.resetFields();
    },
    detail(id) {
      getDetail(id).then(res => {
        this.responsibleStaff = [
          {
            realName: res.data.data.userName,
            id: res.data.data.userId,
            account: res.data.data.account,
            deptName: res.data.data.deptName
          }
        ];
        this.deptInfo = [
          {
            CREATE_DEPT_NAME: res.data.data.deptName,
            CREATE_DEPT: res.data.data.deptId
          }
        ];
        this.createInfo = [
          {
            CREATE_USER_NAME: res.data.data.createUserName,
            CREATE_USER: res.data.data.createUser
          }
        ];
        this.contractCodeList = [
          {
            paperContractNo: res.data.data.contractCode,
            id: res.data.data.contractCodeId
          }
        ];
        this.customerNameList = [
          {
            customerName: res.data.data.customerName,
            id: res.data.data.customerId
          }
        ];
        this.receptionPersonList = [
          {
            realName: res.data.data.receptionCharge,
            id: res.data.data.receptionChargeId
          }
        ];
        res.data.data.customerReceptionSummaryEntityList.forEach(ele => {
          if(ele.chargePersonId){
           ele.summaryPersonList = [
            {
              realName: ele.chargePerson,
              id: ele.chargePersonId
            }
          ];
          }  
        });
        res.data.data.customerReceptionTripEntityList.forEach(ele => {
          ele.participants = ele.chargePerson;
          if(ele.assumePersonId){
           ele.assumePersonList = [{
            realName: ele.assumePerson,
              id: ele.assumePersonId
          }];
          }
          if(ele.dataPreparerId){
           ele.dataPreparerList = [{
            realName: ele.dataPreparer,
              id: ele.dataPreparerId
          }]
          }
        });
        this.basicForm = res.data.data;
        // this.basicForm.userId = res.data.data.userId;
        // this.basicForm.deptId = res.data.data.deptId;
        this.basicForm.createUser = res.data.data.createUser;
        this.mainDataId = res.data.data.id;
        this.$refs.fileUpload.init(this.mainDataId);
      });
    },
    // 保存
    save(formName) {
      // if (this.basicForm.managerReception == "2") {
      //   if (this.basicForm.customerReceptionTripEntityList.length == 0) {
      //     this.$message.warning("请填写行程安排信息");
      //     return;
      //   }
      // }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.basicForm.affixList = this.affixList;
          this.btnLoading = true;
          submit(this.basicForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.btnLoading = false;
              // this.close();
            }
          });
        } else {
          return false;
        }
      });
    },
    //保存并提交
    saveAndSubmit(formName) {
      // if (this.basicForm.managerReception == "2") {
      //   if (this.basicForm.customerReceptionTripEntityList.length == 0) {
      //     this.$message.warning("请填写行程安排信息");
      //     return;
      //   }
      // }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.basicForm.affixList = this.affixList;
          this.btnLoading = true;
          submit(this.basicForm)
            .then(res => {
              if (res.data.code == 200) {
                modelByName("CRM_KHJD").then(res1 => {
                  let obj = {
                    flowKey: "CRM_KHJD_DART",
                    formType: "S",
                    modelId: res1.data.data.id,
                    dataId: res.data.data.id,
                    variables: { functionPath: this.$route.fullPath }
                  };
                  startFlow(obj)
                    .then(res2 => {
                      if (res2.data.code == 200) {
                        this.$message.success(res2.data.msg);
                        this.btnLoading = false;
                        // this.close();
                      }
                    })
                    .catch(error => {
                      this.btnLoading = false;
                    });
                });
              }
            })
            .catch(error => {
              this.btnLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 选择来访目的
    selectVisitPurpose(value) {
      if (value == 1 || value == 2) {
        this.$set(this.rules.contractCode[0], "required", true);
        this.$set(this.basicForm, "userId", "");
        this.$set(this.basicForm, "deptId", "");
      } else {
        this.responsibleStaff = [
          {
            realName: this.addDefaultDate.CREATE_USER_NAME,
            id: this.addDefaultDate.CREATE_USER,
            account: this.addDefaultDate.UPDATE_USER.account,
            deptName: this.addDefaultDate.CREATE_DEPT_NAME
          }
        ];
        this.deptInfo = [
          {
            CREATE_DEPT_NAME: this.addDefaultDate.CREATE_DEPT_NAME,
            CREATE_DEPT: this.addDefaultDate.CREATE_DEPT
          }
        ];
        this.$set(this.basicForm, "userId", this.addDefaultDate.CREATE_USER);
        this.$set(this.basicForm, "deptId", this.addDefaultDate.CREATE_DEPT);
        this.$set(this.rules.contractCode[0], "required", false);
      }
    },
    // 搜索纸质合同号
    searchContractCode(query) {
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
    getCodeId(value) {
      this.contractCodeList.forEach(ele => {
        if (ele.id == value) {
          this.responsibleStaff = [ele.chargePerson];
          this.$set(this.basicForm, "userId", ele.chargeStaff);
          this.deptInfo = [
            {
              CREATE_DEPT_NAME: ele.departmentName,
              CREATE_DEPT: ele.departmentId
            }
          ];
          this.$set(this.basicForm, "deptId", ele.departmentId);
          this.customerNameList = [ele.clientInfo];
          this.$set(this.basicForm, "customerName", ele.clientId);
        }
      });
    },
    // 接待负责人
    searchReceptionPerson(query) {
      if (query !== "") {
        this.receptionPersonLoading = true;
        getUserName(query).then(res => {
          this.receptionPersonList = res.data.data;
          this.receptionPersonLoading = false;
        });
      } else {
        this.receptionPersonList = [];
      }
    },
    // 参与人员
    searchParticipant(query, row) {
      if (query !== "") {
        this.particpantLoading = true;
        getUserName(query).then(res => {
          row.participants = res.data.data;
          this.particpantLoading = false;
        });
      } else {
        row.participants = [];
      }
    },
    //行程纪要负责人
    searchSummaryPerson(query, row) {
      if (query !== "") {
        this.summaryPersonLoading = true;
        getUserName(query).then(res => {
          row.summaryPersonList = res.data.data;
          this.summaryPersonLoading = false;
        });
      } else {
        row.summaryPersonList = [];
      }
    },
    //负责员工
    dropFuzzySearch(query) {
      if (query !== "") {
        this.userLoading = true;
        getUserName(query).then(res => {
          this.responsibleStaff = res.data.data;
          this.userLoading = false;
        });
      } else {
        this.responsibleStaff = [];
      }
    },
    //担当人
    searchAssumePerson(query, row) {
      if (query !== "") {
        this.assumePersonLoading = true;
        getUserName(query).then(res => {
          row.assumePersonList = res.data.data;
          this.assumePersonLoading = false;
        });
      } else {
        row.assumePersonList = [];
      }
    },
    //资料准备人
    searchDataPreparer(query, row) {
      if (query !== "") {
        this.dataPreparerLoading = true;
        getUserName(query).then(res => {
          row.dataPreparerList = res.data.data;
          this.dataPreparerLoading = false;
        });
      } else {
        row.dataPreparerList = [];
      }
    },
    // 获取办事处
    getDeptId(value) {
      console.log(value);
      this.responsibleStaff.forEach(ele => {
        if (ele.id == value) {
          this.deptInfo = [
            {
              CREATE_DEPT_NAME: ele.deptName,
              CREATE_DEPT: ele.deptId
            }
          ];
          this.basicForm.deptId = ele.deptId;
        }
      });
    },
    //搜索客户名称
    searchCustomerName(query) {
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
    // 选择客户名称
    selectCustomerName(value) {
      this.customerNameList.forEach(ele => {
        if (value == ele.id) {
          this.basicForm.customerName = ele.customerName;
        }
      });
    },
    //添加行程
    addtrip() {
      let newValue = {
        toMatterRemark: "",
        toDate: "",
            itineraryLocation: "",
            assumePersonId:"",
            assumePersonList:[],
            participantPerson: "",
            participants: [],
            dataPreparerId:'',
            dataPreparerList:[],
            itineraryRequirements: ""
      };
      this.basicForm.customerReceptionTripEntityList.push(newValue);
      this.$nextTick(()=>{
         Array.from(document.getElementsByClassName('el-select')).forEach((item) => {
  item.children[0].children[0].removeAttribute('readOnly')
  item.children[0].children[0].onblur = function () {
    let _this = this
    setTimeout(() => {
      _this.removeAttribute('readOnly')
    }, 200)
  }
})
      })
    },
    //行程行内删除
    handelTripDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerReceptionTripEntityList.splice(index, 1);
      });
    },
    //添加客户清单
    addCustomer() {
      let newValue = {
        cusName: "",
        cusSex: "",
        cusPost: "",
        cusPhone: "",
        receptionAttention: ""
      };
      this.basicForm.customerReceptionInventoryEntityList.push(newValue);
    },
    //客户清单行内删除
    handelCustomerDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerReceptionInventoryEntityList.splice(index, 1);
      });
    },
    //添加礼品清单
    addGift() {
      let newValue = {
        giftName: "",
        unitMeasurement:'',
        giftNumber: "",
        giftPrice: "",
        giftTotalAmount: "",
        giftRemark: ""
      };
      this.basicForm.customerReceptionGiftEntityList.push(newValue);
    },
    //礼品清单行删除
    handleGiftDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerReceptionGiftEntityList.splice(index, 1);
      });
    },
    handleEdit(index, row) {
      if (row.giftNumber && row.giftPrice) {
        row.giftTotalAmount = (
          Number(row.giftNumber) * Number(row.giftPrice)
        ).toFixed(2);
        let total = 0;
        this.basicForm.customerReceptionGiftEntityList.forEach(ele => {
          total += Number(ele.giftTotalAmount);
        });
        // this.basicForm.actualGiftCost = total;
        this.$set(this.basicForm, "actualGiftCost", total);
      } else {
        row.giftTotalAmount = null;
        this.$set(this.basicForm, "actualGiftCost", null);
      }
    },
    //添加行程纪要
    addSummary() {
      let newValue = {
        toMatter: "",
        chargePersonId: "",
        summaryPersonList: [],
        completeDate: "",
        toRemark: ""
      };
      this.basicForm.customerReceptionSummaryEntityList.push(newValue);
      this.$nextTick(()=>{
         Array.from(document.getElementsByClassName('el-select')).forEach((item) => {
  item.children[0].children[0].removeAttribute('readOnly')
  item.children[0].children[0].onblur = function () {
    let _this = this
    setTimeout(() => {
      _this.removeAttribute('readOnly')
    }, 200)
  }
})
      })
    },
    //行程纪要行删除
    handleSummaryDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.basicForm.customerReceptionSummaryEntityList.splice(index, 1);
      });
    },
    sortMethod(obj1, obj2, column) {
　　var at = obj1[column]
　　var bt = obj2[column]
　　if (at > bt) {
    　　return -1
　　} else {
    　　return 1
　　}
}
  }
};
</script>

<style scoped>
.star {
  color: #f56c6c;
  /* font-size: 14px; */
  margin-right: 4px;
}
.customerReception .el-form-item {
  margin: 0;
}
</style>