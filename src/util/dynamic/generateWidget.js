export function generteWidget(data){
    for (let i = 0; i < data.length; i++) {
        let data = data[i];
        let column = this.getColumnList(data);
// 单选下拉框（静态数据）配置
if (column.type == "select") {
    if (column.dicUrl) {
      this.getmodels(column.dicUrl).then(res => {
        this.$set(column, "dicData", res.data.data);
        this.$set(column, "props", {
          label: "dictValue",
          value: "dictKey"
        });
      });
    } else {
      let arr = [];
      JSON.parse(data.formExtendValue).forEach(ele => {
        arr.push({
          label: ele.dictValue,
          value: ele.dictKey
        });
      });
      this.$set(column, "dicData", arr);
    }
  }
  // 多选复选框配置
  if (column.type == "checkbox") {
    let arr = [];
    JSON.parse(data.formExtendValue).forEach(ele => {
      arr.push({
        label: ele.label,
        value: ele.value
      });
    });
    this.$set(column, "dicData", arr);
    this.$set(column, "dataType", "string");
  }
  // 单个复选框配置
  if (column.type == "singlecheckbox") {
    this.$set(column, "dicData", [
      {
        value: 1
      }
    ]);
    this.singleCheckbox.push({
      prop: column.prop,
      type: "singlecheckbox"
    }); //单个复选框slot 列显示
    this.$set(column, "slot", true);
    this.$set(column, "type", "checkbox");
  }
  // 开关配置
  if (column.type == "switch") {
    this.switchList.push({
      prop: column.prop,
      type: "switch"
    });
    this.$set(column, "dicData", [
      {
        value: 1
      }
    ]);
    this.$set(column, "slot", true);
  }
  // 单选框配置  （静态数据） （少个根据字典配置）
  if (column.type == "radio") {
    let arr = [];
    JSON.parse(data.formExtendValue).forEach(ele => {
      arr.push({
        label: ele.label,
        value: ele.value
      });
    });
    this.$set(column, "dicData", arr);
    this.$set(column, "dataType", "string");
  }
  // 图标配置
  if (column.type == "icon") {
    this.$set(column, "type", "icon");
    this.$set(column, "iconList", iconList);
  }
  // 下拉多选配置 
  if (column.type == "multipleSelect") {
    let arr = [];
    JSON.parse(data.formExtendValue).forEach(ele => {
      arr.push({
        label: ele.dictValue,
        value: ele.dictKey
      });
    });
    this.$set(column, "dicData", arr);
    this.$set(column, "type", "select");
    this.$set(column, "multiple", true);
  }
  // 日期配置
  if (column.type == "date") {
    //this.$set(column, "type", "daterange");
    this.$set(column, "format", "yyyy-MM-dd");
    this.$set(column, "valueFormat", "yyyy-MM-dd");
  }
  // 日期时间配置
  if (column.type == "datetime") {
    // this.$set(column, "type", "datetimerange");
    this.$set(column, "format", "yyyy-MM-dd HH:mm:ss");
    this.$set(column, "valueFormat", "yyyy-MM-dd HH:mm:ss");
    this.$set(column, "width", 100);
    this.$set(column, "show-overflow-tooltip", true);
  }
  // 时间配置
  if (column.type == "time") {
    this.timeList.push({
      prop: column.prop,
      type: "time"
    });
    // this.$set(column, "type", "timerange");
    this.$set(column, "format", "HH:mm:ss");
    this.$set(column, "valueFormat", "HH:mm:ss");
    this.$set(column, "slot", true);
  }
  // 下拉模糊搜索配置
  if (column.type == "fuzzySearch") {
    this.$set(column, "type", "select");
    this.$set(column, "remote", true);
    this.$set(column, "multiple", true);
    this.$set(
      column,
      "dicUrl",
      `/api/blade-dynamic/dynamicConfig/selectSearch?fieldDictField=${data.fieldDictField}&fieldDictRemark=${data.fieldDictRemark}&fieldDictTable=${data.fieldDictTable}&search={{key}}`
    );
    this.$set(column, "props", {
      label: "role_name",
      value: "role_alias"
    });
  } 
  this.option.column.push(column);
} 

}