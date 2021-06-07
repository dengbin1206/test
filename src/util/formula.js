/**
 * 前端公式处理
 * #VIEW_CHANGE$SUM#(YCRS*YCBZ=JHXFJE)
 */
const formulaList =[
  {formulaName:"SUM",formulaRemark:"求和"}
];

export function getFormula(expression) {
  let formula = {formulaName:"SUM",exp:"YCRS*YCBZ=JHXFJE"};
  return formula;
}
//that,column,currentColumn,value,formula.formulaName,formula.exp
export function processFormula(that,column,currentColumn,value,formulaName,expression) {
  //debugger;
  for(let i=0;i<formulaList.length;i++){
    if(formulaName=="SUM"){
      SUM(that,column,currentColumn,value,expression);
      //return Function('"use strict";return (' + formulaList[i].formulaName + ')')()(expression);
    }
  }
}

export function SUM(that,column,currentColumn,value,expression) {
  let expArr = expression.split("=");
  let exp = expArr[0];
  let form = that._data.form;
  for(let key in form ){
    let v = form[key];
    if(currentColumn.prop==key){
      // form中是旧的数据值
      v = value;
    }
    exp = exp.replace(key.toUpperCase(),v?v:0);
  }
  let result = eval(exp);
  console.log("processFormula=>>>>>>"+expression+"   "+result);
  form[expArr[1]]=result;
}
