import request from '@/router/axios';

export const getSystemFixedValue = () => {
  return request({
    url: 'api/blade-dynamic/assistant/fixedValue',
    method: 'get'
  })
};
export const modelByName = (modelName) => {
  return request({
    url: 'api/blade-modelform/model/modelByName',
    method: 'get',
    params:{
      modelName
    }
  })
};

export const startFlow = (data) =>{
  return request({
    url: '/api/blade-flow/task/start-process',
    method: 'post',
    data:data
  })
};


/**
 * 启动流程
 * @param modelName
 * @param formType
 * @param dataId
 */
export const startFlowByModelName = (modelName,flowKey,formType,dataId,functionPath) =>{
  return modelByName(modelName).then(res => {
    if (res.data.code == 200) {
      let params = {
        flowKey: flowKey,
        formType: formType,
        modelId: res.data.data.id,
        dataId: dataId,
        variables: {functionPath:functionPath}
      };
      //启动流程
      return startFlow(params);
    }
  });
};

/**
 * 显示按钮
 * 1、新增 2、修改 3、查看 4、审批 5、查看审批
 * @param fieldPower
 * @param action
 * @param buttonList
 * buttonList = {
 *   cpbj_add:{
 *     show:true,
 *     action:[1,2,3]
 *   },
 *   cpbj_edit:{
 *     show:true,
 *     action:[1,3]
 *   }
 * }
 */
export const dynamicShowButton = (fieldPower,action,option,buttonList) => {
  let functionButtonList = fieldPower.functionButtonList;
  if(!action||!buttonList){
    return ;
  }
  // 4、审批 5、查看审批 隐藏所有按钮 只留 保存按钮
  if(action==4||action==5){
    for(let key in buttonList){
      buttonList[key].show = false;
      let typeList = buttonList[key].action;
      for(let i in typeList){
        if(action==typeList[i]){
          buttonList[key].show=true;
        }
      }
    }
    return;
  }
  for(let key in buttonList){
    // 先全部隐藏
    buttonList[key].show = false;
    // 是否有权限显示
    let isShow = false;
    for(let index in functionButtonList){
      if(functionButtonList[index].code==key){
        isShow = true;
        break;
      }
    }
    if(isShow){
      // 是否在当前界面显示
      let typeList = buttonList[key].action;
      for(let i in typeList){
        if(action==typeList[i]){
          buttonList[key].show=true;
        }
      }
    }
  }
};

/**
 * 显示字段
 * 如果是查看，则所有都只读
 * @param fieldPower
 * @param action
 * @param fieldList
 */
export const dynamicShowField = (fieldPower,action) => {
  let fieldList = fieldPower.functionFieldList;
  if(!action||!fieldList){
    return ;
  }
  for(let key in fieldList){
    // fieldPower.functionButtonList中是对象
    if(typeof(fieldList[key]) == "object"){
      continue;
    }
    //如果 action=3 或者 action=5 禁用所有字段
    if(action==3||action==5){
      if(key.indexOf("$isEdit")>=0){
        fieldList[key]=1;
      }
      continue;
    }
  }
};

/**
 * 控制显示和隐藏
 * @param fieldPower
 * @param action
 */
export const dynamicShow = (fieldPower,action,option,buttonList) => {
  dynamicShowButton(fieldPower,action,option,buttonList);
  dynamicShowField(fieldPower,action,option,buttonList);
};

/**
 * 界面字段权限
 * @param functionPath  功能路由，#后面的部分
 * @param modelName     模型名
 * @param paramType     模型类型 S
 * @param functionId     功能Id 在流程中展示时有值
 * @param proDefId      流程Id
 * @param nodeCode      节点ID
 */
export const viewInit = (functionPath,modelName,functionId,proDefId,nodeCode) =>{
  let paramType = "S";
  let params = {
    functionPath:functionPath,
    modelName:modelName,
    paramType:paramType,
    functionId:functionId,
    proDefId:proDefId,
    nodeCode:nodeCode
  };
  return request({
    url: '/api/blade-dynamic/dynamicViewInit/viewInit',
    method: 'post',
    data:params
  })
};

/**
 * 采用Avue的界面form+crud
 * @param that
 * @param modelName
 * @param type
 * @param data
 * @param configData
 */
export const dynamicAvueViewField = (that,type,modelName,data,configData)=>{
  if(!data||!configData.functionFieldList){
    return;
  }
  let fieldList = configData.functionFieldList;
  if(type==1){
    // 使用avue的方式展示 data = this.option.column
    for(let i in data){
      let column = data[i];
      for(let j in fieldList){
        if(column.prop==fieldList[j].fieldName&&modelName==fieldList[j].modelName){
          // 先禁用
          that.$set(column, "addDisabled", true);
          that.$set(column, "editDisabled", true);
          // 不可见
          that.$set(column, "editDisplay", false);
          that.$set(column, "addDisplay", false);
          // 隐藏
          that.$set(column, "hide", true);
          if(fieldList[j].fieldShow==1){
            column.hide=false;
            column.editDisplay=true;
            column.addDisplay=true;
          }
          if(fieldList[j].fieldAlter==1){
            column.addDisabled=false;
            column.editDisabled=false;
          }
        }
      }
    }
    console.log(data);
  }
};

/**
 * 字段是否必填
 * 当是不可改，但表单上设置了必填，则返回不必填
 * @param fieldPower
 * @param modelName
 * @param fieldName
 */
export const dynamicFieldRequired = (fieldPower,modelName,fieldName) => {
  if(!dynamicFieldShow(fieldPower,modelName,fieldName)){
    return false;
  }
  // 不可改
  return !dynamicFieldEdit(fieldPower,modelName,fieldName);
};
/**
 * 字段或者表格是否显示
 * @param fieldPower
 * @param modelName
 * @param fieldName
 * @returns {boolean}
 */
export const dynamicFieldShow = (fieldPower,modelName,fieldName) => {
  let key = fieldKey(modelName,fieldName);
  key = key+"$isShow";
  return fieldPower[key]==undefined||fieldPower[key]==1;
};

/**
 * 字段是否可改
 * @param fieldPower
 * @param modelName
 * @param fieldName
 * @param defaultStatus   字段默认状态 0禁用，1可改
 * @returns {boolean} 默认都是可改的
 */
export const dynamicFieldEdit = (fieldPower,modelName,fieldName,defaultStatus) => {
  let key = fieldKey(modelName,fieldName);
  key = key+"$isEdit";
  if(defaultStatus!=undefined&&!fieldPower[key]){
      return defaultStatus==0;
  }
  return fieldPower[key]==0;
};

export const fieldKey = (modelName,fieldName)=>{
  let key = modelName;
  if(fieldName){
    key = key+"$"+fieldName;
  }
  return key;
};

/**
 * 入口
 * 动态处理界面
 *
 * @param that
 * @param mainModelName
 * @param option  avue的option
 * @param buttonList
 * @param fieldPower
 * @param configData
 */
export const dynamicView = (that,mainModelName,option,buttonList,fieldPower,configData)=>{
  that.$set(fieldPower, "functionFieldList", configData.functionFieldList);
  that.$set(fieldPower, "functionButtonList",configData.functionButtonList);
  dynamicViewField(that,mainModelName,option?option.column:null,fieldPower,configData);
  dynamicViewButton(that,mainModelName,buttonList,option,configData);
};
  /**
 * 动态处理界面的字段
 * @param modelName 模型名
 * @param type
 * @param data  this.option.column
 * @param fieldPower  界面定义权限的空对象
 * @param configData
 */
export const dynamicViewField = (that,mainModelName,data,fieldPower,configData)=>{
  if(!configData.functionFieldList){
    return;
  }
  let fieldList = configData.functionFieldList;
  for(let key in fieldList){
    let field = fieldList[key];
    if(field.fieldName){
      that.$set(fieldPower, field.modelName+"$"+field.fieldName+"$isShow", field.fieldShow);
      that.$set(fieldPower, field.modelName+"$"+field.fieldName+"$isEdit", field.fieldAlter);
    }else{
      that.$set(fieldPower, field.modelName+"$isShow", field.fieldShow);
      that.$set(fieldPower, field.modelName+"$isEdit", field.fieldAlter);
    }
  }
  // 处理列的不可见
  dynamicAvueViewField(that,1,mainModelName,data,configData);
};

/**
 * 动态处理界面的按钮
 * @param modelName
 * @param buttonList  所有自定义按钮 buttonList:{"sbjc_add":true,"sbjc_edit":true,"sbjc_qrcode":true},
 * @param option      avue的option
 * @param configData
 */
export const dynamicViewButton = (that,modelName,buttonList,option,configData)=>{
  let butList = configData.functionButtonList;
  if(!buttonList||buttonList.length==0||!butList||butList.length==0){
    return;
  }
  //自定义button
  for(let key in buttonList){
    for(let j in butList){
      if(key==butList[j].code){
        // 先隐藏
        buttonList[key].show = false;
        if(butList[j].isPower==1){
          buttonList[key].show=true;
        }
      }
    }
  }
  // 处理avue默认的按钮
  let defaultButList={"add":"addBtn","edit":"editBtn","del":"delBtn"};
  for(let j in butList){
    for(let key in defaultButList){
      if(butList[j].code == key){
        // 先隐藏
        that.$set(option, defaultButList[key], false);
        if(butList[j].isPower==1){
          that.$set(option, defaultButList[key], true);
        }
      }
    }
  }
};

