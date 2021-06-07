//控件属性
const controlProp = {
    "input": [ "prop", "label","type","cell","isShowColumn","value","formula"],
    "number":["prop", "label","type","formula"],
    "select": ["type", "prop", "label", "key","dicData","addDisplay","editDisplay","cell","dictType","isShowColumn","value"],
    "datetime":["type", "prop", "label","format","valueFormat","queryType","cell","isShowColumn","value"],
    "checkbox":["type","prop","label","cell","isShowColumn","value","key","dictType"],
    "singlecheckbox":["type","prop","label","addDisplay","editDisplay","cell","isShowColumn","value"],
    "date":["type","prop","label","queryType","cell","isShowColumn","value"],
    "switch":["type","prop","label","cell","isShowColumn","value"],
    "radio":["type","prop","label","cell","isShowColumn","value","key","dictType"],
    "icon":["type","prop","label","cell","isShowColumn","value"],
    "time":["type","prop","label","queryType","cell","isShowColumn","value"],
    "multipleSelect":["type","prop","label","dicData","addDisplay","editDisplay","cell","isShowColumn","value","key","dictType"],
    "fuzzySearch":["type","prop","label","cell","isShowColumn","value"],
    "fileUpload":["type","prop","label","value"],
    "imgUpload":["type","prop","label","value"],
    "userSelect":["type","prop","label","value"],
    "textarea": [ "prop", "label","type","cell","isShowColumn","value","span"]
  }
//映射关系
const Mapping = {
    // "disabled":"fieldAlter",
    "type": "formInputType",
    "queryType":"queryType",
    "prop": "modelAndField",
    "label": "dbFieldRemark",
    "key":"fieldDictField",
    "dicData":"formExtendValue",
    "format":"yyyy-MM-dd hh:mm:ss",
    "valueFormat": "yyyy-MM-dd hh:mm:ss",
    "placeholder":"formPlaceholder",
    "addDisplay":"addDisplay",
    "editDisplay":"editDisplay",
    // "isShowColumn":"formIsShowColumn",
    // "isShowForm":"formIsShow",
    "dictType":"fieldDictTable",
    "value":"formDefaultValue",
    "formula":"formExtendValue",
    "cell":true,
    "span":24,
    "$cellEdit":true

  }
  // 0，1  转成布尔的属性集合
  const toBoolean = ["addDisplay","editDisplay"];

export function getColumnList(data){
  let columnProp;
  if (data.formInputType == ""){
     columnProp = [ "prop", "label","type","cell"];
  }else{
     columnProp = controlProp[data.formInputType]; // 控件类型
  }
    let column = {}
    for (let index = 0 ; index < columnProp.length ; index++) {
        let prop = columnProp[index]; // column属性
        let propMapping = Mapping[prop]; //找映射关系
        if(data[propMapping] != undefined) {
            // if(prop == "dicUrl"){
            //   column["fieldDictField"] = data["fieldDictField"];
            //     column[prop] = '/api/blade-system/dict/dictionary?code='+data[propMapping];
            // }    // 0 1 转成布尔值
            // else if(toBoolean.includes(prop)){
            //   column[prop] = data[propMapping]==1;
            // }
            // else if(prop =="rules" && data[propMapping] ==1){
            //   column[prop] = [{
            //     required: true,
            //     message: `${data.dbFieldRemark}必填`,
            //     trigger: "blur"
            //     }]
            // }
             if(prop == "disabled"){
              column[prop] = data[propMapping]==1?0:1;
            } else {
              column[prop] = data[propMapping];
            }
      }else {
        column[prop] =  Mapping[prop];
      }
      }
     return column
}
