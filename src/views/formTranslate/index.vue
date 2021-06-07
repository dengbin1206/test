<template>
  <basic-container>
    <div v-if="functionScene === 1">
      <div
        class="avue-group__header avue-group"
        style="border-bottom: 1px solid #eee; margin-bottom: 10px"
      >
        <h1 class="avue-group__title">新增 {{ mainModelRemark }}</h1>
      </div>
    </div>
    <avue-form
      ref="form"
      v-model="form"
      :option="option"
      v-if="!_.isEmpty(option)"
    >
    </avue-form>
    <div class="btn">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-tickets"
        @click="handelSubmit"
        :loading="btnLoading"
        :disabled="btnLoading"
        v-if="actionType != 'view' && !routePath"
        >保存</el-button
      >
      <template v-for="(buttonItem, index) in buttonList">
        <el-button
          v-if="showBtn(buttonItem) && functionScene != 3"
          :key="index"
          type="primary"
          size="small"
          :loading="btnLoading"
          :disabled="btnLoading"
          :icon="getIcon(buttonItem)"
          @click="formClick(buttonItem)"
          >{{ buttonItem.name }}</el-button
        >
      </template>
      <el-button
        size="small"
        icon="el-icon-circle-close"
        @click="handelClose"
        v-if="functionScene != 3"
        >取消</el-button
      >
    </div>
  </basic-container>
</template>

<script>
import {
  dataFormulaConversion,
  getFormByCode,
  getFormById,
} from "@/api/tool/formDesigner";
import beautifier from "../formDesign/packages/utils/json-beautifier";
import { add, findById, startFlow, update } from "@/api/tool/dynamic";
import { getBtnByFunctionPath } from "@/api/system/function";
import func from "@/util/func";

export default {
  props: {
    // 表单ID
    formId: String,
    // 表单CODE
    formCode: String,
    // 事件：add 新增 edit：编辑 view：显示
    actionType: {
      type: String,
      default: "add",
    },
    // 数据ID
    dataId: String,
    // 功能ID
    functionId: String,
    // 路由路径
    routePath: String,
    // 流程实例ID
    proDefId: String,
    // 流程节点
    nodeCode: String,
  },
  watch: {
    /*
    // 三种场景：
    // 监听路由变化
    $route: {
      handler(newVal, oldVal) {
        if (this.$route.path.indexOf("formTranslate/index") != -1) {
          // 获取表单名
          let arr = [];
          arr = this.$route.path.split("/");
          arr.forEach((f) => {
            this.thisFormCode = f;
          });
          this.functionScene = 1;
          this.thisRoutePath = this.$route.path;
          // 初始化查询模型配置
          this.initData();
        }
      },
      deep: true,
      immediate: true,
    },
    // 监听props变化
    props: {
      handler(newVal, oldVal) {
        if (this.functionScene != 1) {
          this.thisFormCode = this.formCode;
          if (this.proDefId) {
            this.functionScene = 3;
          } else {
            this.functionScene = 2;
          }
          this.thisRoutePath = this.routePath;
          // 初始化查询模型配置
          this.initData();
        }
      },
      deep: true,
      immediate: true,
    },
     */
    // 监听optionFlag变化
    optionFlag: {
      handler(newVal, oldVal) {
        if(this.optionFlag){
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
                      for (let key in value) {
                        let keyUpper = key.toUpperCase();
                        if (calculateUpper.includes(keyUpper) && value[key]) {
                          calculate = calculate.replace(
                            new RegExp(key, "gi"),
                            value[key]
                          );
                          if (calculate && calculate.indexOf("#") == -1) {
                            newValue = eval(calculate);
                          }
                        }
                      }
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
  data() {
    return {
      // 功能场景 1、路由打开 2、弹窗打开 3、流程中嵌入
      functionScene: 2,
      // 功能路径
      thisRoutePath: "",
      // 表单ID
      thisFormId: "",
      // 表单CODE
      thisFormCode: "",
      // AVUE配置项
      option: {},
      // 表单数据
      form: {},
      // 主模型ID
      mainModelId: "",
      // 主模型描述
      mainModelRemark: "",
      // 主模型字段
      mainModelList: [],
      // 子模型
      childModelList: [],
      // 按钮List
      buttonList: [],
      // 按钮loading
      btnLoading: false,
      // 删除表格数据
      delTableList: [],
      // 表格合计
      sumTableValue: {},
      // 新增默认值
      addDefault: {},
      // option执行完毕
      optionFlag: false,
    };
  },
  // 创建
  created() {
    if (this.formCode || this.formId) {
      this.thisFormCode = this.formCode;
      if (this.proDefId) {
        this.functionScene = 3;
      } else {
        this.functionScene = 2;
      }
      this.thisRoutePath = this.routePath;
    } else {
      // 获取表单名
      let arr = [];
      arr = this.$route.path.split("/");
      arr.forEach((f) => {
        this.thisFormCode = f;
      });
      this.functionScene = 1;
      this.thisRoutePath = this.$route.path;
    }
    // 初始化查询模型配置
    this.initColumn();
  },

  methods: {
    initColumn() {
      // 清理组件
      this.option = {};
      this.form = {};
      this.mainModelId = "";
      this.mainModelRemark = "";
      this.mainModelList = [];
      this.childModelList = [];
      this.delTableList = [];
      this.buttonList = [];
      this.btnLoading = false;
      this.sumTableValue = {};
      this.addDefault = {};
      this.optionFlag = false;
      // 查询表单数据
      if (this.formId) {
        getFormById(this.formId).then((res) => {
          this.dataProcess(res);
        });
      } else {
        getFormByCode(this.thisFormCode).then((res) => {
          this.dataProcess(res);
        });
      }
      // 获取按钮
      if (this.thisRoutePath) {
        getBtnByFunctionPath(this.thisRoutePath).then((res) => {
          this.buttonList = res.data.data;
        });
      }
    },
    // 数据处理
    dataProcess(res) {
      this.mainModelId = res.data.data.formDesignerVO.mainModelId;
      this.mainModelRemark = res.data.data.formDesignerVO.mainModelRemark;
      this.thisFormId = res.data.data.formDesignerVO.id;
      this.thisFormCode = res.data.data.formDesignerVO.formCode;
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
      });
    },
    // 查询数据
    findData(){
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

          (this.childModelList || []).forEach((e) => {
            if (e.type && e.type === "sxTable" && e.column) {
              (e.column || []).forEach((i) => {
                if (i.type && i.type === "select" && i.multiple) {
                  if (this.form[e.relatedTableName]) {
                    (this.form[e.relatedTableName] || []).forEach((j) => {
                      if (j[i.prop]) {
                        j[i.prop] = j[i.prop].split(",");
                      }
                    });
                  }
                }
              });
            }
          });
        });
      }
    },
    // AVUE列转换
    avuecolTrans(col) {
      if (this.actionType === "add") {
        col["display"] = col["display"] || col["addDisplay"];
        col["disabled"] = col["disabled"] || col["addDisabled"];
      } else if (this.actionType === "edit") {
        col["display"] = col["display"] || col["editDisplay"];
        col["disabled"] = col["disabled"] || col["editDisabled"];
      } else if (this.actionType === "view") {
        col["display"] = col["display"] || col["viewDisplay"];
        col["disabled"] = true;
      }
      delete col["addDisplay"];
      delete col["addDisabled"];
      delete col["editDisplay"];
      delete col["editDisabled"];
      delete col["viewDisplay"];
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
        if (col.required) {
          col.rules = [
            {
              required: true,
              message: "表格必填",
            },
          ];
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
            hide: true,
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
            });
          });
          this.childModelList.push({
            relatedTableName: col.prop,
            modelFieldQueryVOList: childFields,
            type: col.children.type,
            column: col.children.column,
          });
        }
      } else {
        this.mainModelList.push({
          modelAndField: col.prop,
          formInputType: col.type,
          formExtendValue: col.calculate,
          dbPointLength: col.precision,
        });
        if(col.value){
          this.addDefault[col.prop] = col.value;
        } else {
          this.addDefault[col.prop] = null;
        }
        delete col.value;
      }
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
      if (this.functionScene == 1) {
        // 路由进来，关闭Tag
        this.$router.$avueRouter.closeTag();
        this.$router.back();
      } else if (this.functionScene == 2) {
        // 弹窗进来，关闭弹框
        // this.$parent.close();
        // this.$parent.$parent.handleClose()
        this.$parent.$parent.$parent.$parent.handleClose()
      }
    },

    handelSubmit() {
      this.$refs.form.validate((valid, done, msg) => {
        if (valid) {
          if (this.form.ID) {
            this.editSave(done);
          } else {
            this.addSave(done);
          }
        }
        done();
      });
    },
    // 按钮点击事件
    formClick(item) {
      this.$refs.form.validate((valid, done, msg) => {
        if (valid) {
          if (item.triggerConditions == 5) {
            // 提交流程
            if (this.form.ID) {
              this.handleStartFlow(item.flowKey, done);
            } else {
              this.addSaveFlow(item.flowKey, done);
            }
          } else if (item.triggerConditions == 7) {
            // 保存提交流程
            if (this.form.ID) {
              this.editSaveFlow(item.flowKey, done);
            } else {
              this.addSaveFlow(item.flowKey, done);
            }
          } else if (item.triggerConditions == 6) {
            // 保存
            if (this.form.ID) {
              this.editSave(done);
            } else {
              this.addSave(done);
            }
          }
        }
        done();
      });
    },
    // 新增保存
    addSave(done) {
      this.btnLoading = true;
      add({
        dataId: this.mainModelId,
        dataType: "F",
        mainModel: this.form,
      })
        .then((res) => {
          if (res.data.code === 200) {
            done();
            this.btnLoading = false;
            this.$message.success(res.data.msg);
            this.handelClose();
          }
        })
        .catch((error) => {
          done();
          this.btnLoading = false;
          window.console.log(error);
        });
    },
    // 修改保存
    editSave(done) {
      this.btnLoading = true;
      update({
        dataId: this.mainModelId,
        dataType: "F",
        mainModel: this.form,
        deleteList: this.delTableList,
      })
        .then((res) => {
          if (res.data.code === 200) {
            done();
            this.delTableList = [];
            this.btnLoading = false;
            this.$message.success(res.data.msg);
            this.handelClose();
          }
        })
        .catch((error) => {
          done();
          this.btnLoading = false;
          window.console.log(error);
        });
    },
    handleStartFlow(flowKey, done) {
      if (flowKey.length == 0) {
        this.$message.warning("没有配置对应的流程");
        return;
      }
      this.btnLoading = true;
      // 启动流程
      startFlow({
        flowKey: flowKey,
        dataId: this.form.ID,
        formType: "F",
        formId: this.thisFormId,
        modelId: this.mainModelId,
        variables: {
          functionPath: this.thisRoutePath,
        },
      })
        .then((res1) => {
          this.$message({
            type: "success",
            message: res1.data.msg,
          });
          done();
          this.btnLoading = false;
          this.handelClose();
        })
        .catch((error) => {
          done();
          this.btnLoading = false;
          window.console.log(error);
        });
    },
    // 新增保存并提交流程
    addSaveFlow(flowKey, done) {
      if (flowKey.length == 0) {
        this.$message.warning("没有配置对应的流程");
        return false;
      }
      this.btnLoading = true;
      add({
        dataId: this.mainModelId,
        dataType: "F",
        mainModel: this.form,
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "新增成功!",
            });
            this.form.ID = res.data.data.id;
            // 启动流程
            startFlow({
              flowKey: flowKey,
              dataId: this.form.ID,
              formType: "F",
              formId: this.thisFormId,
              modelId: this.mainModelId,
              variables: {
                functionPath: this.thisRoutePath,
              },
            })
              .then((res1) => {
                this.$message({
                  type: "success",
                  message: res1.data.msg,
                });
                done();
                this.btnLoading = false;
                this.handelClose();
              })
              .catch((error) => {
                done();
                this.btnLoading = false;
                window.console.log(error);
              });
          }
        })
        .catch((error) => {
          done();
          this.btnLoading = false;
          window.console.log(error);
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
        dataType: "F",
        mainModel: this.form,
        deleteList: this.delTableList,
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            // 启动流程
            startFlow({
              flowKey: flowKey,
              dataId: this.form.ID,
              formType: "F",
              formId: this.thisFormId,
              modelId: this.mainModelId,
              variables: {
                functionPath: this.thisRoutePath,
              },
            })
              .then((res1) => {
                this.$message({
                  type: "success",
                  message: res1.data.msg,
                });
                done();
                this.delTableList = [];
                this.btnLoading = false;
                this.handelClose();
              })
              .catch((error) => {
                done();
                this.btnLoading = false;
                window.console.log(error);
              });
          }
        })
        .catch((error) => {
          done();
          this.btnLoading = false;
          window.console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  text-align: right;
  margin-bottom: 50px;
  margin-right: 20px;
}
</style>

