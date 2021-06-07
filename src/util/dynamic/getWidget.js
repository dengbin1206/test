//控件属性
import func from "@/util/func";
const controlProp = {
  "input": ["type", "prop", "label", "queryType", "placeholder", "list"],
  "number": ["type", "prop", "label", "placeholder", "queryType", "list"],
  "select": ["type", "prop", "label", "placeholder", "key", "queryType", "list","dictType"],
  "multipleSelect": ["type", "prop", "label", "placeholder", "key", "queryType", "list","dictType"],
  "checkbox": ["type", "prop", "label", "list"],
  "singlecheckbox": ["type", "prop", "label", "queryType"],
  "date": ["type", "prop", "label", "queryType", "placeholder"],
  "switch": ["type", "prop", "label"],
  "radio": ["type", "prop", "label", "list"],
  "datetime": ["type", "prop", "label", "placeholder", "queryType"],
  "time": ["type", "prop", "label", "placeholder", "queryType"],
  "fuzzySearch": ["type", "prop", "label", "placeholder", "url", "data"]
}
//映射关系
const widgetMapping = {
  "type": "queryControlType",
  "queryType": 'queryType',
  "prop": "modelAndField",
  "label": "queryDbFieldRemark",
  "placeholder": "queryPlaceholder",
  "key": "fieldDictField",
  "dictType":"fieldDictTable",
  "list": "formExtendValue",
  "url": '/blade-modelform/model/selectSearch',
  "data": []
}
export function getWidget(data) {
  let widgetProp = controlProp[data.queryControlType];
  let widget = {};
  for (let index in widgetProp) {
    let prop = widgetProp[index];
    if (typeof (prop) == 'object') {
      let obj = {};
      for (let key in prop) { //prop = {option:[label,prop,placeholder]}
        let optionArr = prop[key]; // [label,prop,placeholder]
        for (let pindex in optionArr) {
          let item = prop[key][pindex]; //label ,prop , placeholder
          let propMapping = widgetMapping[item]; //找映射关系
          if (item == "label") {
            obj[item] = data[propMapping] + ":"
          } else {
            obj[item] = data[propMapping]; //将接口返回的数据给到obj
          }
        }
        widget[key] = obj; // key  为 option
      }
    } else {
      let propMapping = widgetMapping[prop];
      if (prop == "label") {
        widget[prop] = data[propMapping] + ":";
      } else if (prop == "list" && data[propMapping]) {
        let str = data[propMapping];
        if(func.isJSON(str)){
          widget[prop] = JSON.parse(str);
        }else{
          widget[prop] = str;
        }
      } else if (prop == "url") {
        widget[prop] = '/api/blade-modelform/model/selectSearch?fieldDictField=' + data.fieldDictField + '&fieldDictRemark=' + data.fieldDictRemark + '&fieldDictTable=' + data.fieldDictTable + '&search=';
      } else if (prop == "data") {
        widget[prop] = []
      } else {
        widget[prop] = data[propMapping];
      }
    }
  }
  return widget;
}
