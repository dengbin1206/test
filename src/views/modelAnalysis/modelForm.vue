<template>
  <basic-container>
    <div v-if="functionScene === 1">
      <div class="avue-group__header avue-group" style="border-bottom: 1px solid #eee; margin-bottom: 10px">
        <h1 class="avue-group__title">新增 {{ mainModelRemark }}</h1>
      </div>
    </div>
    <avue-form
      ref="form"
      v-model="form"
      :option="option"
      v-if="option.column.length > 0"
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
  import { queryMainFields, addDefaultValue, add, findById, startFlow, update } from "@/api/tool/dynamic";
  import { getBtnByFunctionPath } from "@/api/system/function";

  export default {
    props: {
      // 模型ID
      modelId: String,
      // 模型名
      modelName: String,
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
      // 三种场景：
      // 监听路由变化
      $route: {
        handler(newVal, oldVal) {
          if (this.$route.path.indexOf("modelAnalysis/modelForm") != -1) {
            // 获取表单名
            let arr = [];
            arr = this.$route.path.split("/");
            arr.forEach((f) => {
              this.mainModelName = f;
            });
            this.mainModelId = "";
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
            this.mainModelId = this.modelId;
            this.mainModelName = this.modelName;
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
      // 监听值变化
      form: {
        handler(newVal, oldVal) {
          if(this.option && this.option.column && this.option.column.length > 0 && this.form){
            if(this.childModelList){
              // 表格数据公式处理
              (this.childModelList || []).forEach(el=>{
                // 表格值
                let tableValue = this.form[el.relatedTableName];
                if(el.modelFieldQueryVOList && tableValue){
                  (el.modelFieldQueryVOList || []).forEach(col=>{
                    if(col.formExtendValue && col.formExtendValue.includes("#")){
                      (tableValue || []).forEach(value => {
                        let calculate = col.formExtendValue;
                        let calculateUpper = col.formExtendValue.toUpperCase();
                        let newValue;
                        for(let key in value){
                          let keyUpper = key.toUpperCase();
                          if (calculateUpper.includes(keyUpper) && value[key]) {
                            calculate = calculate.replace(new RegExp(key, "gi"), value[key]);
                            if (calculate && calculate.indexOf("#") == -1) {
                              newValue = eval(calculate);
                            }
                          }
                        }
                        value[col.modelAndField] = newValue;
                      })
                      this.$set(this.form, el.relatedTableName, tableValue);
                    }
                    let values = tableValue.map(item => Number(item[col.modelAndField]));
                    let sumProp = `SUM(${col.modelAndField})`;
                    this.sumTableValue[sumProp.toUpperCase()] = values.reduce((perv, curr) => {
                      let value = Number(curr);
                      if (!isNaN(value)) {
                        return perv + curr;
                      } else {
                        return perv;
                      }
                    }, 0);
                  })
                }
              })
            }
            if(this.mainModelList){
              // 表单数据公式处理
              (this.mainModelList || []).forEach(col => {
                if (col.formExtendValue && col.formExtendValue.includes("#")) {
                  let calculate = col.formExtendValue;
                  let calculateUpper = col.formExtendValue.toUpperCase();
                  let newValue;
                  if(calculateUpper.includes("#") && this.sumTableValue){
                    for (let key in this.sumTableValue) {
                      let keyUpper = key.toUpperCase();
                      if (calculateUpper.includes(keyUpper)) {
                        let kk = key;
                        kk = kk.replace("\(","\\\(");
                        kk = kk.replace("\)","\\\)");
                        let temp = new RegExp(kk, "gi");
                        let dbPointLength = col.dbPointLength || 0;
                        let newValue = this.sumTableValue[key];
                        newValue = newValue.toFixed(dbPointLength);
                        calculate = calculate.replace(temp, newValue);
                      }
                    }
                  }
                  if(calculateUpper.includes("#") && this.form){
                    for (let key in this.form) {
                      let keyUpper = key.toUpperCase();
                      if (calculateUpper.includes(keyUpper) && this.form[key]) {
                        calculate = calculate.replace(new RegExp(key, "gi"), this.form[key]);
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
        // AVUE配置项
        option: {
          column: []
        },
        // 表单数据
        form: {},
        // 主模型ID
        mainModelId: "",
        // 主模型名
        mainModelName: "",
        // 主模型描述
        mainModelRemark: "",
        // 主模型字段
        mainModelList: [],
        // 子模型
        childModelList: [],
        // 全部模型字段
        allModel: {},
        // 按钮List
        buttonList: [],
        // 按钮loading
        btnLoading: false,
        // 删除表格数据
        delTableList: [],
        // 表格合计
        sumTableValue:{},
      };
    },

    methods: {
      initData() {
        // 清理组件
        this.option = {
          column: []
        };
        this.form = {};
        this.allModel = {};
        this.mainModelList = [];
        this.childModelList = [];
        this.delTableList = [];
        this.buttonList = [];
        this.btnLoading = false;
        this.sumTableValue = {};
        // 查询模型配置
        queryMainFields({
          paramType: "M",
          paramId: this.mainModelId,
          modelName: this.mainModelName,
          proDefId: this.proDefId,
          nodeCode: this.nodeCode,
          functionPath: this.thisRoutePath,
          functionId: this.functionId,
        })
          .then(res => {
            // 数据处理
            this.dataProcess(res);
          });
        // 获取按钮
        if (this.thisRoutePath) {
          getBtnByFunctionPath(this.thisRoutePath).then((res) => {
            this.buttonList = res.data.data;
          });
        }
      },
      // 数据处理
      dataProcess(res) {
        this.allModel = res.data.data;
        this.mainModelList = res.data.data.mainModel;
        this.childModelList = res.data.data.childModel;
        this.mainModelId = res.data.data.id;
        this.mainModelName = res.data.data.tableName;
        this.mainModelRemark = res.data.data.tableRemark;
        this.option.labelPosition = 'right';
        this.option.labelSuffix = '：';
        this.option.labelWidth =  150;
        this.option.gutter = 0;
        this.option.emptyBtn = false;
        this.option.submitBtn = false;
        this.option.tabs = true;
        this.option.column = [];
        (this.mainModelList || []).forEach(el=>{
          this.option.column.push(this.avuecolTrans(el));
        });
        let groupList = [];
        (this.childModelList || []).forEach(el=>{
          let group = {};
          group.label = el.relatedTableRemark;
          group.prop = el.relatedTableName + "99999999";
          group.arrow = false;
          group.collapse = true;
          group.display = true;
          group.column = [];
          let dynamic = {
            type: 'dynamic',
            label: '',
            span: 24,
            display: true,
            labelWidth: 1,
            children: {
              align: 'center',
              headerAlign: 'center',
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
            prop: el.relatedTableName
          };
          if (this.actionType === "add") {
            dynamic.disabled = false;
          } else if (this.actionType === "edit") {
            dynamic.disabled = false;
          } else if (this.actionType === "view") {
            dynamic.disabled = true;
          }
          (el.modelFieldQueryVOList || []).forEach(m=>{
            let tableCol = this.avuecolTrans(m);
            tableCol.fixed = m.fixed;
            tableCol.hide = m.hide;
            tableCol.align = m.columnAlign;
            tableCol.width = parseInt(m.columnLength);
            dynamic.children.column.push(tableCol);
          });
          group.column.push(dynamic);
          groupList.push(group);
        })
        if(groupList && groupList.length > 0){
          this.option.group = groupList;
        }
        (this.allModel.queryFields || []).forEach(el=>{
          delete el.controlOtherField;
        });
        (this.allModel.mainModel || []).forEach(el=>{
          delete el.controlOtherField;
        });
        (this.allModel.childModel || []).forEach(child=>{
          (child.modelFieldQueryVOList || []).forEach(el=>{
            delete el.controlOtherField;
          })
        });
        if (this.actionType === "add") {
          // 新增默认值转换
          addDefaultValue(this.allModel).then((resq) => {
            this.form = resq.data.data;
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
          });
        }
      },
      // AVUE列转换
      avuecolTrans(el) {
        let col = {};
        col.prop = el.modelAndField;
        col.label = el.dbFieldRemark;
        col.type = el.formInputType;
        col.span = parseInt(el.formSpan);
        if(el.dicData && el.dicData.length > 0){
          col.dicData = el.dicData;
        }
        if(el.formPlaceholder && el.formPlaceholder.length > 0){
          col.placeholder = el.formPlaceholder;
        }
        if(el.formExtendValue && el.formExtendValue.length > 0){
          col.calculate = el.formExtendValue;
        }
        if(el.controlOtherField){
          col.control = eval(el.controlOtherField);
        }
        if(col.type === "fuzzySearch") {
          col.remote = true;
          col.dicUrl = "/api/blade-modelform/model/selectSearch?search={{key}}"+"&fieldDictTable="+el.fieldDictTable+"&fieldDictField="+el.fieldDictField+"&fieldDictRemark="+el.fieldDictRemark;
          col.type = "select";
        }
        if (this.actionType === "add") {
          col["display"] = el["addDisplay"];
          col["disabled"] = el["addDisabled"];
          if(el.addRequired){
            col.rules = [
              {
                required: true,
                message: `${col.label}必填`
              }
            ]
          }
        } else if (this.actionType === "edit") {
          col["display"] = el["editDisplay"];
          col["disabled"] = el["editDisabled"];
          if(el.editRequired){
            col.rules = [
              {
                required: true,
                message: `${col.label}必填`
              }
            ]
          }
        } else if (this.actionType === "view") {
          col["display"] = el["viewDisplay"];
          col["disabled"] = true;
        }
        col = this.avueTypeTrans(col);
        return col;
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

      handelClose() {
        if (this.functionScene == 1) {
          // 路由进来，关闭Tag
          this.$router.$avueRouter.closeTag();
          this.$router.back();
        } else if (this.functionScene == 2) {
          // 弹窗进来，关闭弹框
          // this.$parent.$parent.handleClose();
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
          dataType: "M",
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
          dataType: "M",
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
          formType: "M",
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
          dataType: "M",
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
                formType: "M",
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
          dataType: "M",
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
                formType: "M",
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
