<template>
  <div>
    <i
      :class="item.icon"
      style="font-size: 18px"
      v-if="item.type == 'title'"
    ></i>
    <span
      v-if="item.type == 'title'"
      :style="item.styles"
      style="margin-left: 5px"
    >
      {{ item.value }}
    </span>
    <el-input
      v-else-if="item.type == 'input'"
      type="text"
      :placeholder="item.placeholder || getPlaceholder(item)"
      :readonly="item.readonly"
      :disabled="item.disabled"
      v-model="item.value"
      maxlength="10"
      show-word-limit
    >
    </el-input>
    <el-input v-else-if="item.type == 'table'" 
      :placeholder="item.placeholder || getPlaceholder(item)" 
      readonly 
      v-model="form[item.prop]">
      <el-button slot="append" @click="open(item)" icon="el-icon-search">选择</el-button>
      <el-dialog v-if="openDialog" :data="selectData"></el-dialog>
    </el-input>
    <el-col
      v-else-if="item.type == 'input-table'"
      :key="index"
      :md="item.span || 12"
      :xs="24"
      :offset="item.offset || 0"
    >
      <widget-input-table :item="item"></widget-input-table>
      <!--<avue-input-table :props="column.children.column" :column="column" :on-load="column.onLoad" v-model="form" placeholder="请选择数据"></avue-input-table>-->
    </el-col>
    <el-col v-else-if="item.type == 'select'" :span="item.span || 6">
      <avue-select
        v-model="item.value"
        :placeholder="item.placeholder || getPlaceholder(item)"
        type="tree"
        :dic="item.dicData"
      ></avue-select>
    </el-col>
    <!--
  <el-col v-else-if="item.type == 'table'"
                    :md="item.span || 12"
                    :xs="24"
                    :offset="item.offset || 0">               
      <avue-input-table :props="item.children.column" :column="item" :on-load="onLoad" v-model="item.form" placeholder="请选择数据">

      </avue-input-table>      
  </el-col>  -->
    <avue-date
      v-else-if="item.type == 'date'"
      v-model="item.value"
      :type="item.dtType"
      format="item.format"
      :value-format="item.valueFormat"
      :placeholder="item.placeholder || getPlaceholder(item)"
    >
    </avue-date>
    <el-button
      v-else-if="item.type == 'button'"
      v-model="form[item.prop]"
      v-bind="
        Object.assign(deepClone(item), params, { size: item.size || 'small' })
      "
      :dic="item.dicData"
      :type="item.btnType"
      @click.native="btnButton(item)"
      style="text-align: center"
    >{{ item.title }}
    </el-button>
    <component
      v-else
      :is="getComponent(item.type, item.component)"
      v-model="item.value"
      v-bind="
        Object.assign(deepClone(item), params, { size: item.size || 'small' })
      "
      :placeholder="item.placeholder || getPlaceholder(item)"
      :dic="item.dicData"
    >
      <span v-if="params.html" v-html="params.html"></span>
    </component>    
  </div>
</template>
<script>
import WidgetInputTable from "./WidgetInputTable";
import SelectTable from "@/forms/utils/selectTable"
import eventBus from "@/forms/utils/eventBus";
import formView from "@/components/formView/formView";
import { getChildList, getBizChildList, getCity } from "@/api/tool/form";
export default {
  name: "widget-form-item",
  components: { WidgetInputTable, formView },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      newDialog: false,
      form: {},
      itemOption: {},
      val: {},
      openDialog:false,
      selectData:{},//用户选择器
    };
  },
  watch: {
    "item.value": function (vl) {
      //console.log("watch-item-value=>:" + JSON.stringify(vl));
      this.val.fieldName = this.item.fieldName;
      this.val.fieldVal = vl;
      eventBus.$emit("set-input-val", this.val);
    },
    "item.value": function (vl) {
      //console.log("watch-item-value=>:" + JSON.stringify(vl));
      this.val.fieldName = this.item.fieldName;
      this.val.fieldVal = vl;
      eventBus.$emit("set-item-value", this.val);
    },
    item: function (vl) {
      //console.log("watch-item=>:" + JSON.stringify(vl));
    },
    form: function (v2) {
      //console.log("watch-form=>:" + JSON.stringify(v2));
    },
  },
  created() {
    this.item.readonly = this.item.readonly == 1;
    this.item.disabled = this.item.disabled == 1;
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1;
    let day = nowDate.getDate();
    if (this.item.type == "date") {
      if (this.item.formDefault) {
        this.$set(this.item, "placeholder", year + "-" + month + "-" + day);
      }
    }
    if (this.item.type == "datetime") {
      if (this.item.formDefault) {
        this.$set(this.item, "placeholder", year + "-" + month + "-" + day);
      }
    }
    if (this.item.type == "input") {
      if (this.item.assignType) {
        if (this.item.assignType == "ass_rule") {
          if (this.item.assRuleCode) {
            if (this.item.assRuleCode == "gen-user-code") {
              this.$set(this.item, "value", "自动生成");
            }
            if (this.item.assRuleCode == "curr-user") {
              this.$set(this.item, "value", this.user.userName);
            }
            if (this.item.assRuleCode == "curr-dept") {
              this.$set(this.item, "value", this.user.deptName);
            }
          }
        }
      }
    }
    if (this.item.type == "button") {
      if (this.item.assFunc == "search") {
        eventBus.$emit("btnSearch", this.item);
      }
    }
    /*    
    if (this.item.type == "select") {
      if (this.item.assRuleCode == "biz-dict") {
        let params = {
          parentId: this.item.assRuleVal,
          size: 50,
        };
        getBizChildList(Object.assign(params, this.query)).then((res) => {
          let dicData = [];
          for (let i = 0; i < res.data.data.records.length; i++) {
            let params = {
              label: res.data.data.records[i].dictValue,
              value: res.data.data.records[i].id,
            };
            dicData.push(params);
          }
          this.$set(this.item, "dicData", dicData);
        });
      } else if (this.item.assRuleCode == "dict") {
        let params = {
          parentId: this.item.assRuleVal,
          size: 50,
        };
        getChildList(Object.assign(params, this.query)).then((res) => {
          let dicData = [];
          for (let i = 0; i < res.data.data.records.length; i++) {
            let params = {
              label: res.data.data.records[i].dictValue,
              value: res.data.data.records[i].id,
            };
            dicData.push(params);
          }
          this.$set(this.item, "dicData", dicData);
        });
      }
    }*/
  },
  mounted() {
    console.log("mounted-item<=::" + JSON.stringify(this.item));
  },
  methods: {
    open(row){
      this.selectData = row;
      this.openDialog = true;
    },
    btnButton(item) {
      //window.location.href = 'url'
      console.log("btn:" + JSON.stringify(this.item));
      //window.open('/tool/analysis/1328603518976696321', "_blank")
      //window.location.href = 'url'
      if (this.item.assFunc == "save") {
        window.$bus.$emit("btnSave", item);
      } else if (this.item.assFunc == "reset") {
        eventBus.$emit("btnReset", item);
      } else if (this.item.assFunc == "search") {
        eventBus.$emit("btnSearch", item);
      }else if(this.item.assFunc == "todo") {
        if (this.item.assignType == "ass_form") {
          //this.$router.push('/tool/analysis/'+this.item.assRuleCode);
          console.log("btnButton:"+JSON.stringify(this.item));
          this.itemOption = {
            id: this.item.assRuleCode,
          };
          eventBus.$emit("openView", item);
          //this.newDialog = true;
        }
      }
    },
    getComponent(type, component) {
      let KEY_COMPONENT_NAME = "avue-";
      let result = "input";
      if (component) return component;
      else if (type === "array") result = "array";
      else if (type === "button") result = "button";
      else if (["select", "deptselect"].includes(type)) result = "select";
      else if (type === "radio") result = "radio";
      else if (type === "checkbox") result = "checkbox";
      else if (["time", "timerange"].includes(type)) result = "time";
      else if (
        [
          "dates",
          "date",
          "datetime",
          "datetimerange",
          "daterange",
          "week",
          "month",
          "year",
        ].includes(type)
      )
        result = "date";
      else if (type === "cascader") result = "cascader";
      else if (type === "number") result = "input-number";
      else if (type === "password") result = "input";
      else if (type === "switch") result = "switch";
      else if (type === "rate") result = "rate";
      else if (type === "upload") result = "upload";
      else if (type === "imgupload") result = "upload";
      else if (type === "slider") result = "slider";
      else if (type === "dynamic") result = "dynamic";
      else if (type === "icon") result = "input-icon";
      else if (type === "color") result = "input-color";
      else if (type === "map") result = "input-map";
      else if (type === "crud") result = "crud";
      else if (type === "tabs") result = "tabs";
      // else if (type === 'subtable') result = 'radio';
      if (result !== "button") return KEY_COMPONENT_NAME + result;
      if (result == "button") return "el-" + result;
      // console.log("--------")
      console.log(result);
    },
    getPlaceholder(item) {
      const label = item.label;
      if (
        [
          "select",
          "checkbox",
          "radio",
          "tree",
          "color",
          "dates",
          "date",
          "datetime",
          "datetimerange",
          "daterange",
          "week",
          "month",
          "year",
          "map",
          "icon",
          "table",
        ].includes(item.type)
      )
        return `请选择 ${label}`;
      else return `请输入 ${label}`;
    },
  },
};
</script>
