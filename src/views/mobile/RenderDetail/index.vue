<template>
  <div>
    <div v-for="(item, index) in Detail.renderData" :key="index">
      <div class="item" v-if="item.show">
        <div class="title">{{ `${item.dbFieldRemark} :` }}</div>
        <div class="content">
          <div v-if="item.formInputType === 'input'">
            {{ item.filedsValue }}
          </div>
          <el-radio-group
            v-if="item.formInputType === 'radio'"
            v-model="item.filedsValue"
          >
            <el-radio
              v-for="radio in item.dicData"
              :label="radio.value"
              :key="radio"
              :disabled="item.canEdit"
              >{{ radio.label }}</el-radio
            >
          </el-radio-group>
          <el-checkbox-group
            v-if="item.formInputType === 'checkbox'"
            v-model="item.dictValue"
          >
            <el-checkbox
              v-for="checkbox in item.dicData"
              :label="checkbox.label"
              :key="checkbox"
              :disabled="item.canEdit"
            ></el-checkbox>
          </el-checkbox-group>
          <el-switch
            v-if="item.formInputType === 'switch'"
            v-model="item.filedsValue"
            :disabled="item.canEdit"
            active-value="1"
            inactive-value="0"
          ></el-switch>
          <div v-if="item.formInputType === 'singlecheckbox'">
            <el-checkbox
              :disabled="item.canEdit"
              v-model="item.filedsValue"
              true-label="1"
              false-label="0"
            ></el-checkbox>
          </div>
          <!-- date
            datetime
            time -->
          <el-date-picker
            v-if="item.formInputType === 'date'"
            v-model="item.filedsValue"
            type="date"
            :placeholder="item.formPlaceholder"
            size="mini"
          >
          </el-date-picker>
          <el-date-picker
            v-if="item.formInputType === 'datetime'"
            v-model="item.filedsValue"
            type="datetime"
            size="mini"
            :placeholder="item.formPlaceholder"
          >
          </el-date-picker>
          <el-time-picker
            size="mini"
            v-if="item.formInputType === 'time'"
            v-model="item.filedsValue"
            :placeholder="item.formPlaceholder"
          >
          </el-time-picker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { props } from "./index";
import Detail from "./index";
export default {
  props: props,
  data() {
    return {
      Detail: new Detail(),
    };
  },

  watch: {
    visible: function (news, old) {
      if (news === true) {
        this.Detail.init(
          this.paramId,
          this.paramType,
          this.proDefId,
          this.nodeCode,
          this.dataId,
          this.editFlag
        );
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.item {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 14px;
    color: #666;
    font-weight: 700;
  }

  .content {
    margin-left: 10px;
  }
}
</style>