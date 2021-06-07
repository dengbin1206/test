export function fieldList(add_form){//modelFieldList 单选框1/0->true/false
    add_form.modelFieldList.forEach((item, index) => {
        if (item.dbIsField == 1) {
          item.dbIsField = true;
        } else if(!item.dbIsField||item.dbIsField!=1){
          item.dbIsField = false;
        }
        if (item.fieldShow == 1) {
          item.fieldShow = true;
        } else if(!item.fieldShow||item.fieldShow!=1){
          item.fieldShow = false;
        }
        if (item.fieldAlter == 1) {
          item.fieldAlter = true;
        } else if(!item.fieldAlter||item.fieldAlter!=1){
          item.fieldAlter = false;
        }
        if (item.formIsShow == 1) {
          item.formIsShow = true;
        } else if(!item.formIsShow||item.formIsShow!=1){
          item.formIsShow = false;
        }
        if (item.isRequired == 1) {
          item.isRequired = true;
        } else if(!item.isRequired||item.isRequired!=1){
          item.isRequired = false;
        }
        if (item.updateFieldShow == 1) {
          item.updateFieldShow = true;
        } else if(!item.updateFieldShow||item.updateFieldShow!=1){
          item.updateFieldShow = false;
        }
        if (item.updateFieldAlter == 1) {
          item.updateFieldAlter = true;
        } else if(!item.updateFieldAlter||item.updateFieldAlter!=1){
          item.updateFieldAlter = false;
        }
        if (item.updateIsRequired == 1) {
          item.updateIsRequired = true;
        } else if(!item.updateIsRequired||item.updateIsRequired!=1){
          item.updateIsRequired = false;
        }
        if (item.displayVisible == 1) {
          item.displayVisible = true;
        } else if(!item.displayVisible||item.displayVisible!=1){
          item.displayVisible = false;
        }
        if (item.queryIsShow == 1) {
          item.queryIsShow = true;
        } else if(!item.queryIsShow||item.queryIsShow!=1){
          item.queryIsShow = false;
        }
        if (item.queryIsUse == 1) {
          item.queryIsUse = true;
        } else if(!item.queryIsUse||item.queryIsUse!=1){
          item.queryIsUse = false;
        }
        if (item.listDisplay == 1) {
          item.listDisplay = true;
        } else if(!item.listDisplay||item.listDisplay!=1){
          item.listDisplay = false;
        }
        if (item.queryIsUse == 1) {
          item.queryIsUse = true;
        } else if(!item.queryIsUse||item.queryIsUse!=1){
          item.queryIsUse = false;
        }
        if (item.columnFixed == 1) {
          item.columnFixed = true;
        } else if(!item.columnFixed||item.columnFixed!=1){
          item.columnFixed = false;
        }
        if (item.queryFuzzySearch == 1) {
          item.queryFuzzySearch = true;
        } else if(!item.queryFuzzySearch||item.queryFuzzySearch!=1){
          item.queryFuzzySearch = false;
        }
        if (item.columnFixed == 1) {
          item.columnFixed = true;
        } else if(!item.columnFixed||item.columnFixed!=1){
          item.columnFixed = false;
        }
        if (item.queryFuzzySearch == 1) {
          item.queryFuzzySearch = true;
        } else if(!item.queryFuzzySearch||item.queryFuzzySearch!=1){
          item.queryFuzzySearch = false;
        }
      });
      return add_form
}

export function fieldListNum(add_form){//modelFieldList 单选框true/false->1/0
  add_form.modelFieldList.forEach(item => {
    if (item.dbIsField == true) {
      item.dbIsField = 1;
    } else {
      item.dbIsField = 0;
    }
    if (item.fieldShow == true) {
      item.fieldShow = 1;
    } else {
      item.fieldShow = 0;
    }
    if (item.fieldAlter == true) {
      item.fieldAlter = 1;
    } else {
      item.fieldAlter = 0;
    }
    if (item.formIsShow == true) {
      item.formIsShow = 1;
    } else {
      item.formIsShow = 0;
    }
    if (item.isRequired == true) {
      item.isRequired = 1;
    } else {
      item.isRequired = 0;
    }
    if (item.updateFieldShow == true) {
      item.updateFieldShow = 1;
    } else{
      item.updateFieldShow = 0;
    }
    if (item.updateFieldAlter == true) {
      item.updateFieldAlter = 1;
    } else{
      item.updateFieldAlter = 0;
    }
    if (item.updateIsRequired == true) {
      item.updateIsRequired = 1;
    } else {
      item.updateIsRequired = 0;
    }
    if (item.listDisplay == true) {
      item.listDisplay = 1;
    } else{
      item.listDisplay = 0;
    }
    if (item.updateFieldShow == true) {
      item.updateFieldShow = 1;
    } else{
      item.updateFieldShow = 0;
    }
    if (item.updateFieldAlter == true) {
      item.updateFieldAlter = 1;
    } else{
      item.updateFieldAlter = 0;
    }
    if (item.updateIsRequired == true) {
      item.updateIsRequired = 1;
    } else{
      item.updateIsRequired = 0;
    }
    if (item.displayVisible == true) {
      item.displayVisible = 1;
    } else{
      item.displayVisible = 0;
    }
    if (item.queryIsShow == true) {
      item.queryIsShow = 1;
    } else{
      item.queryIsShow = 0;
    }
    if (item.queryIsUse == true) {
      item.queryIsUse = 1;
    } else{
      item.queryIsUse = 0;
    }
    if (item.listDisplay == true) {
      item.listDisplay = 1;
    } else{
      item.listDisplay = 0;
    }
    if (item.queryIsUse == true) {
      item.queryIsUse = 1;
    } else{
      item.queryIsUse = 0;
    }
    if (item.columnFixed == true) {
      item.columnFixed = 1;
    } else{
      item.columnFixed = 0;
    }
    if (item.queryFuzzySearch == true) {
      item.queryFuzzySearch = 1;
    } else{
      item.queryFuzzySearch = 0;
    }
    if (item.columnFixed == true) {
      item.columnFixed = 1;
    } else{
      item.columnFixed = 0;
    }
    if (item.queryFuzzySearch == true) {
      item.queryFuzzySearch = 1;
    } else{
      item.queryFuzzySearch = 0;
    }
  });
    return add_form
}

export function TableNum(add_form){//modelTable 单选框true/false->1/0
  if (add_form.modelTable.isSync == true) {
    add_form.modelTable.isSync = 1;
  } else {
    add_form.modelTable.isSync = 0;
  }
  return add_form
}

export function TableSync(add_form){//modelTable 单选框true/false->1/0
  if (add_form.modelTable.isSync == 1) {
    add_form.modelTable.isSync = true;
  } else {
    add_form.modelTable.isSync = false;
  }
  return add_form
}

export function queryNum(query){
  if (query.isSync == true) {
    query.isSync = 1;
  } else {
    query.isSync = '';
  }
  return query
}

