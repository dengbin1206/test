<template>
  <div class="list-card">
    <avue-form
      ref="form"
      v-model="form"
      :option="option"
      v-if="option.column.length > 0"
    >
    </avue-form>
    <van-goods-action v-if="actionType != 'view' && routePath">
      <template v-for="(buttonItem, index) in buttonList">
        <van-goods-action-button
          v-if="showBtn(buttonItem) && functionScene != 3"
          :key="index"
          :text="buttonItem.name"
          type="info"
          class="btn"
          :loading="btnLoading"
          :disabled="btnLoading"
          @click="formClick(buttonItem)"
        />
      </template>
    </van-goods-action>
    <van-button
      block
      round
      type="info"
      :loading="btnLoading"
      :disabled="btnLoading"
      @click="handelSubmit"
      v-if="actionType != 'view' && !routePath"
    >
      保存
    </van-button>
  </div>
</template>

<script>
import {
  dataFormulaConversion,
  getFormByCode,
  getFormById,
} from "@/api/tool/formDesigner";
import beautifier from "@/views/formDesign/packages/utils/json-beautifier";
import {
  queryMainFields,
  add,
  findById,
  startFlow,
  update,
  viewInitField,
} from "@/api/tool/dynamic";
import { getBtnByFunctionPath } from "@/api/system/function";
import { Toast } from "vant";
import func from "@/util/func";

export default {
  props: {
    // 参数
    params: Object,
  },

  data() {
    return {
      // 功能场景 1、路由打开 2、弹窗打开 3、流程中嵌入
      functionScene: 2,
      // 事件：add 新增 edit：编辑 view：显示
      actionType: "add",
      // 类型 M:模型解析 F:表单解析
      formType: "",
      // 表单ID
      formId: "",
      // 表单CODE
      formCode: "",
      // 主模型ID
      mainModelId: "",
      // 主模型名
      mainModelName: "",
      // 主模型描述
      mainModelRemark: "",
      // 数据ID
      dataId: "",
      // 功能ID
      functionId: "",
      // 路由路径
      routePath: "",
      // 流程实例ID
      proDefId: "",
      // 流程节点
      nodeCode: "",
      // AVUE配置项
      option: {
        column: [],
      },
      // 表单数据
      form: {},
      // 主模型字段
      mainModelList: [],
      // 子模型
      childModelList: [],
      // 新增默认值
      addDefault: {},
      // 按钮List
      buttonList: [],
      // 按钮loading
      btnLoading: false,
      // 删除表格数据
      delTableList: [],
      // 表格合计
      sumTableValue: {},
      // option执行完毕
      optionFlag: false,
      // popup打开
      popupFlag: false,
      // 权限受控字段以及流程受控字段
      fieldAuthList: new Map(),
    };
  },

  watch: {
    // 监听optionFlag变化
    optionFlag: {
      handler(newVal, oldVal) {
        if (this.optionFlag) {
          // 查询数据
          this.findData();
        }
      },
      deep: true,
      immediate: true,
    },
    // 监听值变化
    form: {
      handler(newVal, oldVal) {
        if (
          this.option &&
          this.option.column &&
          this.option.column.length > 0 &&
          this.form
        ) {
          if (this.childModelList) {
            // 表格数据公式处理
            (this.childModelList || []).forEach((el) => {
              // 表格值
              let tableValue = this.form[el.relatedTableName];
              if (el.modelFieldQueryVOList && tableValue) {
                (el.modelFieldQueryVOList || []).forEach((col) => {
                  if (
                    col.formExtendValue &&
                    col.formExtendValue.includes("#")
                  ) {
                    (tableValue || []).forEach((value) => {
                      let calculate = col.formExtendValue;
                      let calculateUpper = col.formExtendValue.toUpperCase();
                      let newValue;
                      (el.modelFieldQueryVOList || []).forEach((col11) => {
                        let keyUpper = col11.modelAndField.toUpperCase();
                        if (calculateUpper.includes(keyUpper)) {
                          if (value[col11.modelAndField]) {
                            calculate = calculate.replace(
                              new RegExp(col11.modelAndField, "gi"),
                              value[col11.modelAndField]
                            );
                          } else {
                            if (
                              col11.formInputType &&
                              col11.formInputType === "number"
                            ) {
                              calculate = calculate.replace(
                                new RegExp(col11.modelAndField, "gi"),
                                0
                              );
                            }
                          }
                          if (calculate && calculate.indexOf("#") == -1) {
                            newValue = eval(calculate);
                          }
                        }
                      });
                      value[col.modelAndField] = newValue;
                    });
                    this.$set(this.form, el.relatedTableName, tableValue);
                  }
                  let values = tableValue.map((item) =>
                    Number(item[col.modelAndField])
                  );
                  let sumProp = `SUM(${col.modelAndField})`;
                  this.sumTableValue[sumProp.toUpperCase()] = values.reduce(
                    (perv, curr) => {
                      let value = Number(curr);
                      if (!isNaN(value)) {
                        return perv + curr;
                      } else {
                        return perv;
                      }
                    },
                    0
                  );
                });
              }
            });
          }
          if (this.mainModelList) {
            // 表单数据公式处理
            (this.mainModelList || []).forEach((col) => {
              if (col.formExtendValue && col.formExtendValue.includes("#")) {
                let calculate = col.formExtendValue;
                let calculateUpper = col.formExtendValue.toUpperCase();
                let newValue;
                if (calculateUpper.includes("#") && this.sumTableValue) {
                  for (let key in this.sumTableValue) {
                    let keyUpper = key.toUpperCase();
                    if (calculateUpper.includes(keyUpper)) {
                      let kk = key;
                      kk = kk.replace("(", "\\(");
                      kk = kk.replace(")", "\\)");
                      let temp = new RegExp(kk, "gi");
                      let dbPointLength = col.dbPointLength || 0;
                      let newValue = this.sumTableValue[key];
                      newValue = newValue.toFixed(dbPointLength);
                      calculate = calculate.replace(temp, newValue);
                    }
                  }
                }
                if (calculateUpper.includes("#") && this.form) {
                  for (let key in this.form) {
                    let keyUpper = key.toUpperCase();
                    if (calculateUpper.includes(keyUpper) && this.form[key]) {
                      calculate = calculate.replace(
                        new RegExp(key, "gi"),
                        this.form[key]
                      );
                    }
                  }
                }
                if (calculate && calculate.indexOf("#") == -1) {
                  newValue = eval(calculate);
                }
                this.$set(this.form, col.modelAndField, newValue);
              }
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },

  // 创建
  created() {
    // 初始化参数
    this.initData();
    // 场景判断
    if (this.formCode || this.formId) {
      if (this.proDefId) {
        this.functionScene = 3;
      } else {
        this.functionScene = 2;
      }
      if (!this.formType) {
        this.formType = "F";
      }
    } else if (this.mainModelName || this.mainModelId) {
      if (this.proDefId) {
        this.functionScene = 3;
      } else {
        this.functionScene = 2;
      }
      if (!this.formType) {
        this.formType = "M";
      }
    } else {
      // 获取表单名
      let arr = [];
      arr = this.$route.path.split("/");
      if (arr.length > 1) {
        if (arr[arr.length - 2] === "M") {
          this.formType = "M";
          this.mainModelName = arr[arr.length - 1];
        } else if (arr[arr.length - 2] === "F") {
          this.formType = "F";
          this.formCode = arr[arr.length - 1];
        }
        this.functionScene = 1;
        this.routePath = this.$route.path;
      }
    }
    // 初始化查询模型配置
    this.getOption();
  },

  methods: {
    // 初始化参数
    initData() {
      // 功能场景 1、路由打开 2、弹窗打开 3、流程中嵌入
      this.functionScene = 2;
      // 事件：add 新增 edit：编辑 view：显示
      this.actionType = "add";
      // 类型 M:模型解析 F:表单解析
      this.formType = "";
      // 表单ID
      this.formId = "";
      // 表单CODE
      this.formCode = "";
      // 主模型ID
      this.mainModelId = "";
      // 主模型名
      this.mainModelName = "";
      // 主模型描述
      this.mainModelRemark = "";
      // 数据ID
      this.dataId = "";
      // 功能ID
      this.functionId = "";
      // 路由路径
      this.routePath = "";
      // 流程实例ID
      this.proDefId = "";
      // 流程节点
      this.nodeCode = "";
      // AVUE配置项
      this.option = {
        column: [],
      };
      // 表单数据
      this.form = {};
      // 主模型字段
      this.mainModelList = [];
      // 子模型
      this.childModelList = [];
      // 新增默认值
      this.addDefault = {};
      // 按钮List
      this.buttonList = [];
      // 按钮loading
      this.btnLoading = false;
      // 删除表格数据
      this.delTableList = [];
      // 表格合计
      this.sumTableValue = {};
      // option执行完毕
      this.optionFlag = false;
      // popup打开
      this.popupFlag = false;
      // 权限受控字段以及流程受控字段
      this.fieldAuthList.clear();

      // 入参数据处理
      // 事件：add 新增 edit：编辑 view：显示
      if (this.params && this.params.actionType) {
        this.actionType = this.params.actionType;
      }
      // 类型 M:模型解析 F:表单解析
      if (this.params && this.params.formType) {
        this.formType = this.params.formType;
      }
      // 表单ID
      if (this.params && this.params.formId) {
        this.formId = this.params.formId;
      }
      // 表单CODE
      if (this.params && this.params.formCode) {
        this.formCode = this.params.formCode;
      }
      // 主模型ID
      if (this.params && this.params.mainModelId) {
        this.mainModelId = this.params.mainModelId;
      }
      // 主模型名
      if (this.params && this.params.mainModelName) {
        this.mainModelName = this.params.mainModelName;
      }
      // 数据ID
      if (this.params && this.params.dataId) {
        this.dataId = this.params.dataId;
      }
      // 功能ID
      if (this.params && this.params.functionId) {
        this.functionId = this.params.functionId;
      }
      // 路由路径
      if (this.params && this.params.routePath) {
        this.routePath = this.params.routePath;
      }
      // 流程实例ID
      if (this.params && this.params.proDefId) {
        this.proDefId = this.params.proDefId;
      }
      // 流程节点
      if (this.params && this.params.nodeCode) {
        this.nodeCode = this.params.nodeCode;
      }
      // popup打开
      if (this.params && this.params.popupFlag) {
        this.popupFlag = this.params.popupFlag;
      }
    },
    // 获取AVUE配置数据
    getOption() {
      // 查询表单数据
      if (this.formId) {
        getFormById(this.formId).then((res) => {
          // 获取权限受控字段以及流程节点受控字段
          viewInitField({
            functionId: this.functionId,
            functionPath: this.routePath,
            proDefId: this.proDefId,
            nodeCode: this.nodeCode,
          }).then((res1) => {
            (res1.data.data || []).forEach((f) => {
              this.fieldAuthList.set(f["modelAndField"], f);
            });
            // 表单转换成option
            this.fromToOption(res);
          });
        });
      } else if (this.formCode) {
        getFormByCode(this.formCode).then((res) => {
          // 获取权限受控字段以及流程节点受控字段
          viewInitField({
            functionId: this.functionId,
            functionPath: this.routePath,
            proDefId: this.proDefId,
            nodeCode: this.nodeCode,
          }).then((res1) => {
            (res1.data.data || []).forEach((f) => {
              this.fieldAuthList.set(f["modelAndField"], f);
            });
            // 表单转换成option
            this.fromToOption(res);
          });
        });
      } else if (this.mainModelId || this.mainModelName) {
        queryMainFields({
          paramType: this.formType,
          paramId: this.mainModelId,
          modelName: this.mainModelName,
          proDefId: this.proDefId,
          nodeCode: this.nodeCode,
          functionPath: this.routePath,
          functionId: this.functionId,
        }).then((res) => {
          // 模型转换成option
          this.modelToOption(res);
        });
      }
      // 获取按钮
      if (this.routePath) {
        getBtnByFunctionPath(this.routePath).then((res) => {
          this.buttonList = res.data.data;
        });
      }
    },
    // 表单转换成option
    fromToOption(res) {
      this.formId = res.data.data.formDesignerVO.id;
      this.formCode = res.data.data.formDesignerVO.formCode;
      this.mainModelId = res.data.data.formDesignerVO.mainModelId;
      this.mainModelName = res.data.data.formDesignerVO.mainModel;
      this.mainModelRemark = res.data.data.formDesignerVO.mainModelRemark;
      let obj = "(" + res.data.data.formDesignerVO.jsonText + ")";
      this.getData("", eval(obj)).then((res1) => {
        this.option = res1;

        // 默认添加主键
        this.option.column.push({
          prop: "ID",
          label: "主键",
          type: "input",
          display: false,
          addDisplay: false,
          editDisplay: false,
          viewDisplay: false,
          disabled: true,
        });
        // avue option处理
        this.optionProcess();
      });
    },
    // 模型转换成option
    modelToOption(res) {
      this.mainModelId = res.data.data.id;
      this.mainModelName = res.data.data.tableName;
      this.mainModelRemark = res.data.data.tableRemark;
      this.option.labelPosition = "right";
      this.option.labelSuffix = "：";
      this.option.labelWidth = 100;
      this.option.gutter = 0;
      this.option.emptyBtn = false;
      this.option.submitBtn = false;
      this.option.tabs = true;
      this.option.column = [];
      (res.data.data.mainModel || []).forEach((el) => {
        this.option.column.push(this.modelToAvueCol(el));
      });
      let groupList = [];
      (res.data.data.childModel || []).forEach((el) => {
        let group = {};
        group.label = el.relatedTableRemark;
        group.prop = el.relatedTableName + "99999999";
        group.arrow = false;
        group.collapse = true;
        group.display = true;
        group.column = [];
        let dynamic = {
          type: "dynamic",
          label: el.relatedTableRemark,
          span: 24,
          display: true,
          labelWidth: 1,
          children: {
            align: "center",
            headerAlign: "center",
            index: false,
            addBtn: true,
            delBtn: true,
            column: [],
            rowDel: (row, done) => {
              if (row.ID) {
                this.delTableList.push({
                  modelName: el.relatedTableName,
                  id: row.ID,
                });
              }
              done();
            },
          },
          prop: el.relatedTableName,
        };
        (el.modelFieldQueryVOList || []).forEach((m) => {
          let tableCol = this.modelToAvueCol(m);
          tableCol.fixed = m.fixed;
          tableCol.hide = m.hide;
          tableCol.align = m.columnAlign;
          tableCol.width = parseInt(m.columnLength);
          dynamic.children.column.push(tableCol);
        });
        group.column.push(dynamic);
        groupList.push(group);
      });
      if (groupList && groupList.length > 0) {
        this.option.group = groupList;
      }
      // avue option处理
      this.optionProcess();
    },
    // 模型转换为AVUE的属性
    modelToAvueCol(el) {
      let col = {};
      col.prop = el.modelAndField;
      col.label = el.dbFieldRemark;
      col.type = el.formInputType;
      col.addDisplay = el.addDisplay;
      col.addDisabled = el.addDisabled;
      col.addRequired = el.addRequired;
      col.editDisplay = el.editDisplay;
      col.editDisabled = el.editDisabled;
      col.editRequired = el.editRequired;
      col.viewDisplay = el.viewDisplay;
      col.value = el.formDefaultValue;

      col.span = parseInt(el.formSpan);
      if (el.dicData && el.dicData.length > 0) {
        col.dicData = el.dicData;
      }
      if (el.formPlaceholder && el.formPlaceholder.length > 0) {
        col.placeholder = el.formPlaceholder;
      }
      if (el.formExtendValue && el.formExtendValue.length > 0) {
        col.calculate = el.formExtendValue;
      }
      if (el.controlOtherField) {
        col.control = el.controlOtherField;
      }
      if (col.type === "fuzzySearch") {
        col.type = "select";
        col.multiple = true;
        col.remote = true;
        col.dicUrl =
          "/api/blade-modelform/model/selectSearch?search={{key}}" +
          "&fieldDictTable=" +
          el.fieldDictTable +
          "&fieldDictField=" +
          el.fieldDictField +
          "&fieldDictRemark=" +
          el.fieldDictRemark;
      }
      return col;
    },
    // AVUE OPTION处理
    optionProcess() {
      // option处理
      this.option.column.forEach((col) => {
        this.avuecolTrans(col);
      });
      // 分组的转换
      (this.option.group || []).forEach((group1) => {
        (group1.column || []).forEach((col) => {
          this.avuecolTrans(col);
        });
      });
      this.optionFlag = true;
    },
    // 查询数据
    findData() {
      if (this.actionType === "add") {
        // 新增默认值转换
        dataFormulaConversion({
          mainModelId: this.mainModelId,
          superValue: this.addDefault,
          childModel: this.childModelList,
        }).then((resq) => {
          for (let key in resq.data.data) {
            this.form[key] = resq.data.data[key];
          }
          // 思绪表格数据处理
          this.sxTableProcess();
        });
      } else if (this.dataId) {
        // 修改查询数据
        findById({
          modelType: "M",
          modelId: this.mainModelId,
          dataId: this.dataId,
          mainModel: this.mainModelList,
          childModel: this.childModelList,
        }).then((resq) => {
          this.form = resq.data.data;
          // 思绪表格数据处理
          this.sxTableProcess();
        });
      }
    },
    // AVUE列转换
    avuecolTrans(col) {
      if (this.actionType === "add") {
        col["display"] = col["display"] || col["addDisplay"];
        col["disabled"] = col["disabled"] || col["addDisabled"];
        if (col.addRequired) {
          col.rules = [{ required: true, message: `${col.label}必填` }];
        }
      } else if (this.actionType === "edit") {
        col["display"] = col["display"] || col["editDisplay"];
        col["disabled"] = col["disabled"] || col["editDisabled"];
        if (col.editRequired) {
          col.rules = [{ required: true, message: `${col.label}必填` }];
        }
      } else if (this.actionType === "view") {
        col["display"] = col["display"] || col["viewDisplay"];
        col["disabled"] = true;
      }
      if (
        !this._.isEmpty(this.fieldAuthList) &&
        this.fieldAuthList.has(col.prop)
      ) {
        let fieldAuth = this.fieldAuthList.get(col.prop);
        if (fieldAuth && fieldAuth.fieldShow && fieldAuth.fieldShow == 1) {
          col["display"] = true;
        } else {
          col["display"] = false;
        }
        if (
          fieldAuth &&
          fieldAuth.fieldAlter &&
          fieldAuth.fieldAlter == 1 &&
          this.actionType != "view"
        ) {
          col["display"] = true;
          col["disabled"] = false;
        } else {
          col["disabled"] = true;
        }
      }

      delete col["addDisplay"];
      delete col["addDisabled"];
      delete col["addRequired"];
      delete col["editDisplay"];
      delete col["editDisabled"];
      delete col["editRequired"];
      delete col["viewDisplay"];
      if (!col.labelWidth) {
        col.labelWidth = this.option.labelWidth;
      }
      col.hide = !col.display;
      col = this.avueTypeTrans(col);
      if (col.control) col.control = eval(col.control);
      else delete col.control;
      if (col.change) col.change = eval(col.change);
      else delete col.change;
      if (col.click) col.click = eval(col.click);
      else delete col.click;
      if (col.focus) col.focus = eval(col.focus);
      else delete col.focus;
      if (col.blur) col.blur = eval(col.blur);
      else delete col.blur;

      if (col.type && col.type === "dynamic") {
        col.labelWidth = 1;
        if (col.children.mobileType) {
          col.children.type = col.children.mobileType;
        }
        if (col.required) {
          col.rules = [{ required: true, message: "表格必填" }];
        }
        if (col.value) {
          if (func.isJSON(col.value)) {
            let colList = JSON.parse(col.value);
            col.children.column.map((element) => {
              colList.forEach((e) => {
                Object.keys(e).forEach((el) => {
                  if (el === element.prop) {
                    e[element.prop] = e[el];
                  } else {
                    e[element.prop] = "";
                  }
                });
              });
            });
            this.form[col.prop] = colList;
          }
        }
        delete col.value;
        // 表格删除事件添加
        col.children.rowDel = (row, done) => {
          if (row.ID) {
            this.delTableList.push({
              modelName: col.prop,
              id: row.ID,
            });
          }
          done();
        };
        if (
          col.children &&
          col.children.column &&
          col.children.column.length > 0
        ) {
          col.children.column.push({
            prop: "ID",
            label: "主键",
            type: "input",
            hide: true,
            display: false,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            disabled: true,
          });
          let childFields = [];
          col.children.column.forEach((col1) => {
            this.avuecolTrans(col1);

            if (col1.dicUrl && !col1.remote) {
              if (col1.dicMethod && col1.dicMethod === "post") {
                this.postAction(col1.dicUrl, col1.dicQuery).then((res) => {
                  this.$set(col1, "dicData", res.data.data);
                });
              } else {
                this.getAction(col1.dicUrl).then((res) => {
                  this.$set(col1, "dicData", res.data.data);
                });
              }
              delete col1.dicUrl;
              col1.dicOption = "static";
            }
            childFields.push({
              modelAndField: col1.prop,
              formInputType: col1.type,
              formExtendValue: col1.calculate,
              dbPointLength: col1.precision,
              isReq: col.required,
              label: col.label,
            });
          });
          this.childModelList.push({
            relatedTableName: col.prop,
            modelFieldQueryVOList: childFields,
            type: col.children.type,
            column: col.children.column,
            isReq: col.required,
            label: col.label,
          });
        }
        col.label = "";
      } else {
        this.mainModelList.push({
          modelAndField: col.prop,
          formInputType: col.type,
          formExtendValue: col.calculate,
          dbPointLength: col.precision,
          isReq: col.required,
          label: col.label,
        });
        if (col.value) {
          this.addDefault[col.prop] = col.value;
        } else {
          this.addDefault[col.prop] = null;
        }
        delete col.value;
      }
    },
    // 思绪表格数据处理
    sxTableProcess() {
      (this.childModelList || []).forEach((t) => {
        if (
          t.type &&
          t.type === "sxTable" &&
          t.column &&
          this.form[t.relatedTableName]
        ) {
          (t.column || []).forEach((col) => {
            (this.form[t.relatedTableName] || []).forEach((val) => {
              if (val[col.prop]) {
                if (col.type && col.type === "select" && col.multiple) {
                  val[col.prop] = val[col.prop].split(",");
                }
              } else {
                val[col.prop] = "";
              }
            });
          });
        }
      });
    },
    // 按钮是否显示
    showBtn(buttonItem) {
      if (
        buttonItem.btnShowInterface.includes("add_interface") &&
        this.actionType === "add"
      ) {
        return true;
      } else if (
        buttonItem.btnShowInterface.includes("update_interface") &&
        this.actionType === "edit"
      ) {
        return true;
      } else if (
        buttonItem.btnShowInterface.includes("select_interface") &&
        this.actionType === "view"
      ) {
        return true;
      }
      return false;
    },
    // 默认按钮图标
    getIcon(item) {
      if (item.source) {
        return item.source;
      } else if (item.triggerConditions == 1) {
        return "el-icon-plus";
      } else if (item.triggerConditions == 2) {
        return "el-icon-edit";
      } else if (item.triggerConditions == 3) {
        return "el-icon-view";
      } else if (item.triggerConditions == 4) {
        return "el-icon-delete";
      } else if (item.triggerConditions == 5) {
        return "el-icon-s-promotion";
      } else if (item.triggerConditions == 6) {
        return "el-icon-tickets";
      } else if (item.triggerConditions == 7) {
        return "el-icon-s-promotion";
      } else if (item.triggerConditions == 8) {
        return "el-icon-s-flag";
      } else if (item.triggerConditions == 9) {
        return "el-icon-picture-outline";
      }
    },
    // 表单设计器配置项 转化为 Avue配置项
    transformToAvueOptions(obj) {
      return new Promise((resolve, reject) => {
        try {
          const data = this.deepClone(obj);
          for (let i = 0; i < data.column.length; i++) {
            const col = data.column[i];
            if (
              col.type == "dynamic" &&
              col.children &&
              col.children.column &&
              col.children.column.length > 0
            ) {
              const c = col.children.column;
              c.forEach((item) => {
                delete item.subfield;
              });
              this.transformToAvueOptions(col.children).then((res) => {
                col.children = res;
              });
            } else if (col.type == "group") {
              if (!data.group) data.group = [];
              const group = {
                label: col.label,
                icon: col.icon,
                prop: col.prop,
                arrow: col.arrow,
                collapse: col.collapse,
                display: col.display,
              };
              this.transformToAvueOptions(col.children).then((res) => {
                group.column = res.column;
                data.group.push(group);
              });
              data.column.splice(i, 1);
              i--;
            } else if (
              ["checkbox", "radio", "tree", "cascader", "select"].includes(
                col.type
              )
            ) {
              if (col.dicOption == "static") {
                delete col.dicUrl;
                delete col.dicMethod;
                delete col.dicQuery;
                delete col.dicQueryConfig;
              } else if (col.dicOption == "remote") {
                delete col.dicData;
                if (col.dicQueryConfig && col.dicQueryConfig.length > 0) {
                  const query = {};
                  col.dicQueryConfig.forEach((q) => {
                    if (q.key && q.value) query[q.key] = q.value;
                  });
                  col.dicQuery = query;
                  delete col.dicQueryConfig;
                } else delete col.dicQueryConfig;
              }
              delete col.dicOption;
            } else if (["upload", "imgUpload"].includes(col.type)) {
              if (col.headersConfig && col.headersConfig.length > 0) {
                const headers = {};
                col.headersConfig.forEach((h) => {
                  if (h.key && h.value) headers[h.key] = h.value;
                });
                col.headers = headers;
              } else delete col.headers;
              delete col.headersConfig;

              if (col.dataConfig && col.dataConfig.length > 0) {
                const data = {};
                col.dataConfig.forEach((h) => {
                  if (h.key && h.value) data[h.key] = h.value;
                });
                col.data = data;
              } else delete col.data;
              delete col.dataConfig;
            }
            if (col.change) col.change = eval(col.change);
            else delete col.change;

            if (col.click) col.click = eval(col.click);
            else delete col.click;

            if (col.focus) col.focus = eval(col.focus);
            else delete col.focus;

            if (col.blur) col.blur = eval(col.blur);
            else delete col.blur;
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },

    async getData(type = "json", data) {
      if (type == "string")
        return beautifier(await this.transformToAvueOptions(data), {
          minify: true,
        });
      else return await this.transformToAvueOptions(data);
    },

    handelClose() {
      if (this.popupFlag) {
        this.$parent.close();
        this.$parent.$parent.onRefresh();
      } else {
        if (this.functionScene == 1) {
          this.$router.back();
        } else if (this.functionScene == 2) {
          this.$router.back();
        }
      }
    },

    handelSubmit() {
      this.$refs.form.$refs.form
        .validate()
        .then((_) => {
          if (this.form.ID) {
            this.editSave();
          } else {
            this.addSave();
          }
        })
        .catch((error) => {
          if (error) {
            Toast({
              message: error[0].message,
            });
          }
        });
    },
    // 按钮点击事件
    formClick(item) {
      this.$refs.form.$refs.form
        .validate()
        .then((_) => {
          if (item.triggerConditions == 5) {
            // 提交流程
            if (this.form.ID) {
              this.validateForm(() => this.handleStartFlow(item.flowKey));
            } else {
              this.validateForm(() => this.addSaveFlow(item.flowKey));
            }
          } else if (item.triggerConditions == 7) {
            // 保存提交流程
            if (this.form.ID) {
              this.validateForm(() => this.editSaveFlow(item.flowKey));
            } else {
              this.validateForm(() => this.addSaveFlow(item.flowKey));
            }
          } else if (item.triggerConditions == 6) {
            // 保存
            if (this.form.ID) {
              this.validateForm(() => this.editSave());
            } else {
              this.validateForm(() => this.addSave());
            }
          }
        })
        .catch((error) => {
          if (error) {
            Toast({
              message: error[0].message,
            });
          }
        });
    },
    // 新增保存
    addSave() {
      this.btnLoading = true;
      add({
        dataId: this.mainModelId,
        dataType: this.formType,
        mainModel: this.form,
      }).then((res) => {
        if (res.data.code === 200) {
          this.delTableList = [];
          this.btnLoading = false;
          Toast.success(res.data.msg);
          this.handelClose();
        } else {
          this.btnLoading = false;
          Toast.fail(res.data.msg);
        }
      });
    },
    // 修改保存
    editSave() {
      this.btnLoading = true;
      update({
        dataId: this.mainModelId,
        dataType: this.formType,
        mainModel: this.form,
        deleteList: this.delTableList,
      }).then((res) => {
        if (res.data.code === 200) {
          this.delTableList = [];
          this.btnLoading = false;
          Toast.success(res.data.msg);
          this.handelClose();
        } else {
          this.btnLoading = false;
          Toast.fail(res.data.msg);
        }
      });
    },
    handleStartFlow(flowKey) {
      if (flowKey.length == 0) {
        Toast.fail("没有配置对应的流程");
        return false;
      }
      this.btnLoading = true;
      // 启动流程
      startFlow({
        flowKey: flowKey,
        dataId: this.form.ID,
        formType: this.formType,
        formId: this.formId,
        modelId: this.mainModelId,
        variables: {
          functionPath: this.routePath,
        },
      }).then((res1) => {
        if (res1.data.code === 200) {
          this.delTableList = [];
          this.btnLoading = false;
          Toast.success(res1.data.msg);
          this.handelClose();
        } else {
          this.btnLoading = false;
          Toast.fail(res1.data.msg);
        }
      });
    },
    // 新增保存并提交流程
    addSaveFlow(flowKey) {
      if (flowKey.length == 0) {
        Toast.fail("没有配置对应的流程");
        return false;
      }
      this.btnLoading = true;
      add({
        dataId: this.mainModelId,
        dataType: this.formType,
        mainModel: this.form,
      }).then((res) => {
        if (res.data.code == 200) {
          Toast.success("新增成功!");
          this.form.ID = res.data.data.id;
          // 启动流程
          startFlow({
            flowKey: flowKey,
            dataId: this.form.ID,
            formType: this.formType,
            formId: this.formId,
            modelId: this.mainModelId,
            variables: {
              functionPath: this.routePath,
            },
          }).then((res1) => {
            if (res1.data.code === 200) {
              this.delTableList = [];
              this.btnLoading = false;
              Toast.success(res1.data.msg);
              this.handelClose();
            } else {
              this.btnLoading = false;
              Toast.fail(res1.data.msg);
            }
          });
        } else {
          this.btnLoading = false;
          Toast.fail(res.data.msg);
        }
      });
    },
    // 修改保存并提交流程
    editSaveFlow(flowKey, done) {
      if (flowKey.length == 0) {
        this.$message.warning("没有配置对应的流程");
        return false;
      }
      this.btnLoading = true;
      update({
        dataId: this.mainModelId,
        dataType: this.formType,
        mainModel: this.form,
        deleteList: this.delTableList,
      }).then((res) => {
        if (res.data.code == 200) {
          Toast.success("修改成功");
          // 启动流程
          startFlow({
            flowKey: flowKey,
            dataId: this.form.ID,
            formType: this.formType,
            formId: this.formId,
            modelId: this.mainModelId,
            variables: {
              functionPath: this.routePath,
            },
          }).then((res1) => {
            if (res1.data.code === 200) {
              this.delTableList = [];
              this.btnLoading = false;
              Toast.success(res1.data.msg);
              this.handelClose();
            } else {
              this.btnLoading = false;
              Toast.fail(res1.data.msg);
            }
          });
        } else {
          this.btnLoading = false;
          Toast.fail(res.data.msg);
        }
      });
    },

    // 验证必填项
    validateForm(callback) {
      for (let i = 0; i < this.mainModelList.length; i++) {
        const e = this.mainModelList[i];
        for (let j = 0; j < this.childModelList.length; j++) {
          const el = this.childModelList[j];
          if (el.isReq && this.form[el.relatedTableName].length == 0) {
            Toast(`${el.label}必填`);
            return;
          }
          for (let k = 0; k < el.column.length; k++) {
            const item = el.column[k];

            for (let n = 0; n < this.form[el.relatedTableName].length; n++) {
              const element = this.form[el.relatedTableName][n];

              if (
                item.required &&
                this._.isEmpty(element[item.modelAndField])
              ) {
                Toast(`${item.dbFieldRemark}必填`);
                return;
              }
            }
          }
        }
      }

      callback();
    },
  },
};
</script>


<style lang="scss" scoped>
.list-card {
  width: 95%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;

  .btn {
    margin-right: 1px;
  }

  .list-main {
    border: 1px solid;
  }
}
</style>

