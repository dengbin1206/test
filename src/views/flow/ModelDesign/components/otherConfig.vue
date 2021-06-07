<template>
  <div>
    <el-card shadow="never">
      <el-form label-position="right" :model="conFigForm" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="开始回调事件名:">
              <el-input
                v-model="conFigForm.startCallbackUrl"
                size="mini"
                clearable
                placeholder="请输入开始回调事件名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成功回调事件名:">
              <el-input
                v-model="conFigForm.sucCallbackUrl"
                size="mini"
                clearable
                placeholder="请输入成功回调事件名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终止回调事件名:">
              <el-input
                v-model="conFigForm.errCallbackUrl"
                size="mini"
                clearable
                placeholder="请输入终止回调事件名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>消息推送表单字段配置</span>
      </div>
      <div class="buttons">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleCreate"
          >新增</el-button
        >
      </div>
      <el-table
        :data="data"
        border
        size="small"
        :header-cell-style="{
          background: 'rgb(250, 250, 250)',
          'text-align': 'center',
        }"
        highlight-current-row
        height="300"
      >
        <el-table-column label="推送字段标签" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.keyText"
              size="small"
              placeholder="请输入推送字段标签"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="推送表单字段" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.valueField"
              placeholder="请选择推送表单字段"
              style="width: 100%"
              size="small"
              clearable
            >
              <el-option
                v-for="item in modelFiled"
                :key="item.id"
                :label="item.fieldAndModelRemark"
                :value="item.modelAndField"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="推送固定内容" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.valueText"
              size="small"
              placeholder="请输入推送固定内容"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.orderNum"
              size="small"
              placeholder="请输入排序"
              clearable
              @input="(value) => regInput(value, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
              @click="handleDelete(scope.row, scope.$index)"
              style="color: #f56c6c"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      conFigForm: {},
      data: [],
      delFlowMesConfigIds: [],
    };
  },

  computed: {
    ...mapState("Home", ["modelFiled"]),
  },

  methods: {
    handleCreate() {
      if (this.data.length < 6) {
        this.data.push({});
      }
    },

    async handleDelete(row, index) {
      this.data.splice(index, 1);
      if (row.id) {
        this.delFlowMesConfigIds.push(row.id);
      }
    },

    regInput(value, row) {
      if (value.match(/[^\d]/g, "")) {
        this.$set(row, "orderNum", "");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.buttons {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
/deep/.el-card__body {
  padding: 20px !important;
}
</style>
