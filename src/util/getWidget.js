 //控件属性
 const controlProp = {
   "input": ["type", "prop", "label", "placeholder"],
   "select": ["type", "prop", "label", "placeholder", "url"],
   "composeInput": ["type", "prop", {
     "option": ["label", "placeholder", "prop"]
   }],
   "composeSelect": ["type", "prop", {
     "option": ["label", "placeholder", "prop", "url"]
   }],
 }
 //映射关系
 const widgetMapping = {
   "type": "formInputType",
   "prop": "dbFieldName",
   "label": "dbFieldRemark",
   "placeholder": "dbFieldRemark"
 }
 export function getWidget(data) {
   let widgetProp = controlProp[data.formInputType];
   let widget = {};
   for (let index in widgetProp) {
     let prop = widgetProp[index];
     if (typeof (prop) == 'object') {
       let obj = {};
       for (let key in prop) { //prop = {option:[label,prop,placeholder]}
         let optionArr = prop[key];  // [label,prop,placeholder]
         for (let pindex in optionArr) {
           let item = prop[key][pindex]; //label ,prop , placeholder
           let propMapping = widgetMapping[item]; //找映射关系
           obj[item] = data[propMapping];  //将接口返回的数据给到obj
         }
         widget[key] = obj;  // key  为 option
       }
     } else {
       let propMapping = widgetMapping[prop];
       widget[prop] = data[propMapping];
     }
   }
   return widget;
 }
