export const avueTypeTrans = (col) => {
  let newCol = col;
  if (typeof newCol === 'undefined') {
    return newCol;
  }
  if (typeof newCol.type === 'undefined' || newCol.type.length == 0) {
    newCol.type = 'input';
  }
  if (newCol.type === "datetime" || newCol.type === "datetimerange") {
    newCol.format = 'yyyy-MM-dd HH:mm:ss';
    newCol.valueFormat = 'yyyy-MM-dd HH:mm:ss';
  } else if (newCol.type === "date" || newCol.type === "daterange") {
    newCol.format = 'yyyy-MM-dd';
    newCol.valueFormat = 'yyyy-MM-dd';
  } else if (newCol.type === "time" || newCol.type === "timerange") {
    newCol.format = 'HH:mm:ss';
    newCol.valueFormat = 'HH:mm:ss';
  } else if (newCol.type === "year") {
    newCol.format = 'yyyy';
    newCol.valueFormat = 'yyyy';
  } else if (newCol.type === "month") {
    newCol.format = 'MM';
    newCol.valueFormat = 'MM';
  } else if (newCol.type === "week") {
    newCol.format = 'yyyy 第 WW 周';
  } else if (newCol.type === "switch") {
    newCol.dicData = [
      {
        label: '',
        value: '0'
      },
      {
        label: '',
        value: '1'
      }
    ]
  } else if (newCol.type === "multipleSelect") {
    newCol.multiple = true;
    newCol.type = "select";
  } else if (newCol.type === "singlecheckbox") {
    newCol.dicData = [
      {
        label: '',
        value: '1'
      }
    ],
      newCol.type = "checkbox";
  } else if (newCol.type === "userSelect") {
    newCol.type = "select";
    newCol.remote = true;
    newCol.clearable = true;
    newCol.filterable = true;
    newCol.dicFlag = true;
    newCol.dicOption = 'remote';
    if (typeof newCol.multiple === 'undefined') {
      newCol.multiple = true;
    };
    if (typeof newCol.dicUrl === 'undefined' || newCol.dicUrl.length == 0) {
      //newCol.dicUrl = "/api/blade-user/getUserInfoBySearch";
      newCol.dicUrl = "/api/blade-user/getUserInfoBySearch?search={{key}}";
    };
    if (newCol.dicUrl.includes("getUserInfoBySearch")) {
      newCol.props = {
        label: 'realName',
        value: 'id',
        extendKey: 'account',
        extendDesc: 'deptName'
      };
    }
    delete newCol.dicData;
  } else if (newCol.type === "deptSelect") {
    newCol.type = "tree";
    if (typeof newCol.multiple === 'undefined') {
      newCol.multiple = true;
    };
    if (typeof newCol.dicUrl === 'undefined' || newCol.dicUrl.length == 0) {
      newCol.dicUrl = "/api/blade-system/dept/deptTree";
    };
    if (newCol.dicUrl.includes("deptTree")) {
      newCol.props = {
        label: 'title',
        value: 'id'
      };
    }
  } else if (newCol.type === "imgUpload" || newCol.type === "upload" || newCol.type === "fileUpload") {
    if (typeof newCol.action === 'undefined' || newCol.action.length == 0) {
      newCol.action = "/api/blade-resource/affix/asyncUploadExt";
    };
    if (newCol.action.includes("affix/asyncUpload")) {
      newCol.propsHttp = {
        res: "data",
        name: "fileName",
        url: "downloadUrl",
      };
      newCol.data = {
        dataSrcId: newCol.prop.includes("#")
          ? newCol.prop.split("#")[0]
          : newCol.prop,
        affixType: newCol.prop,
      };
    }
    if (newCol.type === "imgUpload") {
      if (typeof newCol.accept === 'undefined' || newCol.accept.length == 0) {
        newCol.accept = "image/*";
      };
      if (typeof newCol.listType === 'undefined' || newCol.listType.length == 0) {
        newCol.listType = "picture";
      };
    }
    newCol.limit = 10,
      newCol.type = "upload";
  }

  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    newCol.readonly	 = newCol.disabled;
    delete newCol.disabled;

    if (
      [
        "switch",
        "singlecheckbox",
        "radio",
        "checkbox",
        "date",
        "datetime",
        "time",
        "select",
        "multipleSelect",
        "fuzzySearch",
        "deptSelect",
        "userSelect",
        "number",
      ].includes(newCol.type)
    ) {
      newCol.inputAlign = "right";
    } else if (newCol.type === "textarea") {
      newCol.inputAlign =  "left";
    } else if (newCol.readonly) {
      newCol.inputAlign = "right";
    }
  }

  return newCol;
}
