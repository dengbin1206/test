<template>
  <div class="widget-config">
    <default-config
      :data="data"
      :fieldList="fieldList"
      v-if="this.data && Object.keys(this.data).length > 0"
    >
      <component :is="getComponent" :data="data"></component>
      <el-form-item
        label="事件属性"
        v-if="!['group', 'dynamic'].includes(data.type)"
      >
        <div class="el-input" style="margin-top: 8px">
          <el-input
            v-model="data.change"
            type="textarea"
            placeholder="改变事件"
            rows="5"
            clearable
          ></el-input>
        </div>
        <div class="el-input" style="margin-top: 8px">
          <el-input
            v-model="data.click"
            type="textarea"
            placeholder="点击事件"
            rows="5"
          ></el-input>
        </div>
        <div class="el-input" style="margin-top: 8px">
          <el-input
            v-model="data.focus"
            type="textarea"
            placeholder="获取焦点事件"
            rows="5"
          ></el-input>
        </div>
        <div class="el-input" style="margin-top: 8px">
          <el-input
            v-model="data.blur"
            type="textarea"
            placeholder="失去焦点事件"
            rows="5"
          ></el-input>
        </div>
        <div class="el-input" style="margin-top: 8px">
          <el-input
            v-model="data.control"
            type="textarea"
            placeholder="控制其它字段事件"
            rows="5"
          ></el-input>
        </div>
      </el-form-item>
    </default-config>
    <avue-empty
      v-else
      desc="拖拽字段进行配置"
      style="margin-top: 100%"
    ></avue-empty>
  </div>
</template>

<script>
import fields from "./fieldsConfig.js";
import iconPicker from "../component/iconPicker";
import DefaultConfig from "./DefaultConfig";

const dateArr = [
  "year",
  "month",
  "week",
  "date",
  "datetime",
  "time",
  "daterange",
  "timerange",
  "datetimerange",
  "dates",
];

export default {
  name: "widget-config",
  components: {
    iconPicker,
    DefaultConfig,
  },
  props: ["data", "fieldList", "currentRow"],
  computed: {
    getComponent() {
      const prefix = "config-";
      const { type, component } = this.data;

      if (this.data.formInputType) {
        let result = "input";
        if (
          [undefined, "input", "password", "url"].includes(
            this.data.formInputType
          )
        )
          result = "input";
        else if (dateArr.includes(this.data.formInputType)) result = "date";
        else if (["array", "img"].includes(this.data.formInputType))
          result = "array";
        else if (
          ["tree", "cascader", "deptSelect"].includes(this.data.formInputType)
        )
          result = "tree";
        else if (this.data.formInputType === "imgUpload") result = "upload";
        else if (this.data.formInputType === "icon") result = "input";
        else if (
          [
            "radio",
            "checkbox",
            "select",
            "multipleSelect",
            "userSelect",
          ].includes(this.data.formInputType)
        )
          result = "select";
        else result = this.data.formInputType;

        return prefix + result;
      } else {
        if ((!type || component) && type != "ueditor") return prefix + "custom";
        let result = "input";
        if ([undefined, "input", "password", "url"].includes(type))
          result = "input";
        else if (dateArr.includes(type)) result = "date";
        else if (["array", "img"].includes(type)) result = "array";
        else if (["tree", "cascader", "deptSelect"].includes(type))
          result = "tree";
        else if (type === "imgUpload") result = "upload";
        else if (type === "icon") result = "input";
        else if (
          [
            "radio",
            "checkbox",
            "select",
            "multipleSelect",
            "userSelect",
          ].includes(type)
        )
          result = "select";
        else result = type;

        return prefix + result;
      }
    },
  },
  data() {
    return {
      fields,
      collapse: "1",
    };
  },
  methods: {},
};
</script>


<style lang="scss" scoped>
.widget-config {
  .widget-config-inner {
    width: 100%;
    margin-top: 10px;

    .iconPanel {
      width: 200px !important;
      height: 500px !important;
    }
  }
}
</style>
