<template>
  <div>
    <el-input-number
      v-if="item.type === 'number'"
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
    ></el-input-number>
    <el-date-picker
      v-else-if="
        item.type === 'date' ||
        item.type === 'datetime' ||
        item.type === 'daterange' ||
        item.type === 'datetimerange'
      "
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
      :type="item.type"
      range-separator="到"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      :format="item.format"
      :value-format="item.valueFormat"
    ></el-date-picker>
    <el-time-picker
      v-else-if="item.type === 'time'"
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
    ></el-time-picker>
    <el-time-picker
      v-else-if="item.type === 'timerange'"
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
      is-range
      range-separator="到"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    ></el-time-picker>
    <el-select
      v-else-if="item.type === 'select' || item.type === 'multipleSelect'"
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
      filterable
      clearable
      :multiple="item.type === 'multipleSelect' ? true : false"
    >
      <el-option
        v-for="(dic, index) in item.dicData"
        :key="index"
        :label="dic[labelKey]"
        :value="dic[valueKey]"
      >
      </el-option>
    </el-select>
    <el-checkbox-group
      v-else-if="item.type === 'checkbox' || item.type === 'singlecheckbox'"
      v-model="text"
    >
      <el-checkbox
        v-for="(dic, index) in item.dicData"
        :key="index"
        :label="dic.value"
        >{{ dic.label }}</el-checkbox
      >
    </el-checkbox-group>
    <el-radio-group v-else-if="item.type === 'radio'" v-model="text">
      <el-radio
        v-for="(dic, index) in item.dicData"
        :key="index"
        :label="dic.value"
        >{{ dic.label }}</el-radio
      >
    </el-radio-group>
    <el-switch
      v-else-if="item.type === 'switch'"
      v-model="text"
      active-value="1"
      inactive-value="0"
    >
    </el-switch>
    <avue-input-tree
      v-else-if="item.type === 'deptSelect'"
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
      multiple
      type="tree"
      :dic="item.dicData"
    ></avue-input-tree>
    <el-select
      v-else-if="item.type === 'fuzzySearch' || item.type === 'userSelect'"
      v-model="text"
      style="width: 100%"
      multiple
      filterable
      remote
      :placeholder="item.placeholder"
      :remote-method="
        (query) => {
          remoteMethod(query, item);
        }
      "
      :loading="loading"
    >
      <el-option
        v-for="(dic, index) in item.dicData"
        :key="index"
        :label="dic[labelKey]"
        :value="dic[valueKey]"
      >
      </el-option>
    </el-select>
    <el-input
      v-else-if="item.type === 'textarea'"
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
    ></el-input>
    <el-input
      v-else
      v-model="text"
      style="width: 100%"
      :placeholder="item.placeholder"
    ></el-input>
  </div>
</template>

<script>
export default {
  props: ["item", "value", "flag"],
  data() {
    return {
      text: this.value,
      loading: false,
    };
  },
  computed: {
    labelKey() {
      if (this.item && this.item.props && this.item.props.label) {
        return this.item.props.label;
      } else {
        return "label";
      }
    },
    valueKey() {
      if (this.item && this.item.props && this.item.props.value) {
        return this.item.props.value;
      } else {
        return "value";
      }
    },
  },
  watch: {
    // 监听子件值变化
    text: {
      handler(val) {
        this.$emit("changeValue", this.item, val, this.flag);
      },
      deep: true,
      immediate: true,
    },
    // 监听父件值变化
    value: {
      handler() {
        let text = this.deepClone(this.value);
        if (["checkbox", "singlecheckbox"].includes(this.item.type)) {
          if (text) {
            if (Array.isArray(text)) {
              this.text = text;
            } else {
              this.text = text.split(",");
            }
          } else {
            this.text = [];
          }
        } else {
          this.text = text;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    remoteMethod(query, item) {
      if (query !== "") {
        this.loading = true;
        this.axios.get(item.dicUrl + `${query}`).then((res) => {
          item.dicData = res.data.data;
          this.loading = false;
        });
      } else {
        item.dicData = [];
      }
    },
  },
};
</script>

