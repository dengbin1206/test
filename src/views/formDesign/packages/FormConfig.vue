<template>
  <div class="form-config-container">
    <div class="form-config-inner">
      <el-form size="small">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="表单主模型">
              <el-select
                v-model="data.mainModel"
                filterable
                clearable
                placeholder="请选择"
                disabled
              >
                <el-option
                  v-for="item in mainModelOptions"
                  :key="item.id"
                  :label="item.tableRemark"
                  :value="item.tableName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="标签对齐方式">
              <el-radio-group v-model="data.labelPosition" size="mini">
                <el-radio-button label="left">左对齐</el-radio-button>
                <el-radio-button label="right">右对齐</el-radio-button>
                <el-radio-button label="top">顶部对齐</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="标签宽度">
              <el-input-number
                v-model="data.labelWidth"
                :min="80"
                :max="200"
                :step="10"
                clearable
                controls-position="right"
                placeholder="标签宽度"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="标签后缀">
              <el-input
                v-model="data.labelSuffix"
                clearable
                placeholder="标签后缀"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="项之间的间隔">
              <el-input-number
                v-model="data.gutter"
                clearable
                :min="0"
                :max="60"
                :step="5"
                controls-position="right"
                placeholder="项之间的间隔"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="全局只读">
              <div class="el-input">
                <el-switch v-model="data.readonly" clearable></el-switch>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="分组转标签">
              <div class="el-input">
                <el-switch v-model="data.tabs" clearable></el-switch>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { rollModelInfo } from "@/api/tool/model.js";
export default {
  name: "form-config",
  props: ["data"],
  data() {
    return {
      mainModel: {},
      mainModelOptions: [],
    };
  },

  created() {
    this.fetchRollModelInfo();
  },

  methods: {
    async fetchRollModelInfo() {
      const { data } = await rollModelInfo();
      this.mainModelOptions = data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-config-container {
  .form-config-inner {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
