<template>
  <div class="check-form">
    <div class="header">
      <van-nav-bar title="检验单" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="main">
      <div class="card">
        <van-form
          ref="form"
          colon
          label-width="90px"
          :show-error-message="false"
          @submit="onSubmit"
          @failed="onFailed"
        >
          <van-field
            v-model="form.testListCode"
            name="testListCode"
            label="检验申请号"
            readonly
          />
          <van-field
            v-model="form.saleCode"
            name="saleCode"
            label="销售订单"
            placeholder="请输入销售订单"
          />
          <van-field
            v-model="form.lineNumber"
            name="lineNumber"
            label="行号"
            placeholder="请输入行号"
          />
          <van-field
            v-model="form.planDate"
            name="planDate"
            label="计划期"
            placeholder="请输入计划期"
            required
            readonly
            :rules="[{ required: true, message: '请输入计划期' }]"
            @click="showPicker = true"
          />
          <van-field
            v-model="form.contractCode"
            name="contractCode"
            label="合同号"
            placeholder="请输入合同号"
            required
            :rules="[{ required: true, message: '请输入合同号' }]"
          />
          <van-field
            v-model="form.produceName"
            name="produceName"
            label="产品名称"
            placeholder="请输入产品名称"
          />
          <van-field
            v-model="form.produceModel"
            name="produceModel"
            label="型号规格"
            placeholder="请输入型号规格"
          />
          <van-field
            v-model="form.testNum"
            name="testNum"
            label="申请数量"
            placeholder="请输入申请数量"
            required
            type="digit"
            :rules="[{ required: true, message: '请输入申请数量' }]"
          />
          <van-field
            v-model="form.createUserName"
            name="createUserName"
            label="申请人"
            placeholder="请输入申请人"
            readonly
          />
          <van-field
            v-model="form.createTime"
            name="createTime"
            label="申请时间"
            placeholder="请输入申请时间"
            readonly
          />
          <van-field
            v-model="form.flowStatusName"
            name="flowStatusName"
            label="审批状态"
            placeholder="请输入审批状态"
            readonly
          />
          <van-field
            v-model="form.flowCompletedTime"
            name="flowCompletedTime"
            label="审批结束时间"
            placeholder="自动带入"
            readonly
          />
        </van-form>
      </div>
    </div>
    <div class="footer">
      <van-button block round type="info" @click="$refs.form.submit()"
        >发起检验申请</van-button
      >
    </div>

    <!-- 日期选择 -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-datetime-picker
        v-model="form.date"
        type="date"
        title="计划期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showPicker = false"
        @confirm="onConfirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapMutations } from "vuex";
import { setStore } from "@/util/store";
import {
  getFixedValue,
  selectTestList,
  getContractCode,
  selectTestProcedure,
  submit,
} from "@/api/quality/test_m";
export default {
  data() {
    return {
      form: {
        createUser: "",
        createUserName: "",
        flowStatus: "",
        flowStatusName: "",
      },
      flowStatus: [],
      showPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2055, 10, 1),
    };
  },

  created() {
    this.getFlowStatus();
    this.defaultValue();
  },

  methods: {
    ...mapMutations("quality", ["SET_QUALITYROUTE"]),

    onClickLeft() {
      this.$router.push("/mobile/home");
    },

    onSubmit(form) {
      submit(this.form).then((res) => {
        this.SET_QUALITYROUTE(this.$route.path);
        setStore({
          name: "qualityPath",
          content: this.$route.path,
        });
        this.$router.push({
          path: "/quality/testRecord",
          query: { id: res.data.data.id },
        });
      });
    },

    onConfirmDate(date) {
      const value = this.dayjs(date).format("YYYY-MM-DD");
      this.form.planDate = value;
      this.showPicker = false;
    },

    onFailed({ errors }) {
      Toast({
        message: errors[0].message,
      });
    },

    // 流程状态获取
    async getFlowStatus() {
      const { data: res } = await this.getmodels("flow_status");
      if (res && res.code === 200) this.flowStatus = res.data;
    },

    // 默认值
    async defaultValue() {
      const { data: res } = await getFixedValue("CRM_QUALITY_JYD");
      if (res && res.code === 200) {
        const {
          CREATE_USER,
          CREATE_TIME,
          FLOW_STATUS,
          CREATE_USER_NAME,
        } = res.data;
        this.form.createUser = CREATE_USER;
        this.form.createUserName = CREATE_USER_NAME;
        this.form.createTime = CREATE_TIME;
        this.form.flowStatus = FLOW_STATUS;
        this.form.flowStatusName = this.flowStatus[FLOW_STATUS].dictValue;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.check-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .header {
    height: 46px;
    background-color: #fff;
  }

  .main {
    flex: 1;
    overflow-y: scroll;
    padding: 10px;
    background-color: #f7f8fa;

    .card {
      height: 100%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      background-color: #fff;
      overflow-y: scroll;
    }
  }

  .footer {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    background-color: #fff;
  }
}
</style>