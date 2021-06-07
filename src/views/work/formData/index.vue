<template>
  <basic-container>
    <avue-form ref="form" v-model="form" :option="option">
      <template v-for="(fileItem,index) in this.fileUpload" :slot="fileItem.prop">
       <file-upload
          :key="index"
          :prop="fileItem.prop"
          :disabled="fileItem.disabled"
          :modelName="fileItem.modelName"
          :fieldName="fileItem.prop"
          :data.sync="fileItem.data"
          :mainId="dataId"
        ></file-upload>
      </template>
      <template v-for="(imgItem,index) in this.imgUpload" :slot="imgItem.prop">
         <img-upload
          :key="index"
          :prop="imgItem.prop"
          :disabled="imgItem.disabled"
          :modelName="imgItem.modelName"
          :fieldName="imgItem.prop"
          :data.sync="imgItem.data"
          :mainId="dataId"
        ></img-upload>
      </template>
      <template slot="menuForm" >
        <div class="flowSaveBtn" style="text-align: right">
        <el-button type="primary" icon="el-icon-document" v-if="editFlag" @click="handleSubmit">保 存</el-button>
        </div>
      </template>
      <template v-for="(item,index) in this.userSelect" :slot="item.prop">
        <el-select
          :key="index"
          :disabled="item.disabled"
          v-model="form[item.prop]"
          value-key="id"
          filterable
          remote
          reserve-keyword
          :remote-method="(query)=>{userSelectSearch(query,item.prop)}"
          placeholder="请输入"
          :loading="userSelectLoading"
        >
          <el-option v-for="ele in item.data" :key="ele.id" :label="ele.realName" :value="ele.id"></el-option>
        </el-select>
      </template>
      <template
        :slot="Tableitem.group"
        slot-scope="scope"
        v-for="(Tableitem,index) in this.dynamicTable"
      >
        <el-tabs type="border-card" :key="index" v-if="Tableitem.group !=''">
          <el-tab-pane :label="item.modelTitle" v-for="(item,i) in Tableitem.groupModel" :key="i">
            <dynamic-table
              ref="dynamicTable"
              :data.sync="item.infoData"
              :delId.sync="item.delId"
              :id="formId"
              :type="formType"
              :fieldData="item.modelFields"
              :addEditView="editFlag ? 'edit' : 'view'"
              :modelName="item.modelName"
              :mainId="dataId"
            ></dynamic-table>
          </el-tab-pane>
        </el-tabs>
        <dynamic-table
          v-else
          v-for="(item,i) in Tableitem.groupModel"
          :key="i"
          ref="dynamicTable"
          :data.sync="item.infoData"
          :delId.sync="item.delId"
          :addEditView="editFlag ? 'edit' : 'view'"
          :modelTitle="item.modelTitle"
          :fieldData="item.modelFields"
          :modelName="item.modelName"
          :mainId="dataId"
        ></dynamic-table>
      </template>
    </avue-form>
  </basic-container>
</template>
<script>
import { queryForm, initData ,getUserName } from "@/api/work/work";
import { update } from "@/api/tool/dynamic";
import fileUpload from "@/components/fileUpload";
import imgUpload from "@/components/imgUpload";
import dynamicTable from "@/components/dynamicTable";
export default {
  props: [
    "dataId",
    "formType",
    "formId",
    "routeName",
    "dialog",
    "proDefId",
    "nodeCode",
    "editFlag"
  ],
  components: {
    fileUpload,
    imgUpload,
    dynamicTable
  },
  data() {
    return {
      userSelect: [], //用户选择器
      userSelectLoading: false,
      fileUpload: [], //文件上传
      imgUpload: [], //图片上传
      dynamicTable: [{ group: "", groupModel: [] }], // 动态子表
      //mainDataId:"", //主模型Id
      mainModelName: "", //主模型Name
      formDialog: this.dialog,
      form: {},
      option: {
        size: "small",
        // disabled:true,
        emptyBtn: false,
        submitBtn: false,
        labelWidth: 150,
        column: []
      },
      addObject: {},
      columnList: [],
    };
  },
  watch: {
    formDialog: {
      handler(newval, oldVal) {
        if (newval == true) {
          this.init();
        }
      },
      immediate: true
    },
    form: {
      handler(newVal, oldVal) {
        this.option.column.forEach(ele => {
          if (ele.formula) {
            let formula = ele.formula;
            for (let key in this.form) {
              if (formula.includes(key) && this.form[key]) {
                formula = formula.replace(new RegExp(key, "g"), this.form[key]);
                if (formula && formula.indexOf("#") == -1) {
                  this.$set(this.form, ele.prop, eval(formula));
                }
              }
            }
          }
        });
      },
      deep: true
    }
  },
  created() {},
  methods: {
    init() {
      if (this.dataId) {
        queryForm(
          this.formId,
          this.formType,
          this.proDefId,
          this.nodeCode
        ).then(res => {
          this.addObject = res.data.data;
          this.getData();
          this.mainModelName = res.data.data.tableName;
          let arr = res.data.data.mainModel;
          arr.forEach(ele => {
            let column = this.getColumnList(ele);
            if (this.editFlag) {
              // 编辑
              this.$set(column, "display", ele.editDisplay);
              this.$set(column, "disabled", ele.editDisabled);
              if (ele.editRequired) {
                column.rules = [
                  {
                    required: true,
                    message: `${column.label}必填`,
                    trigger: "blur"
                  }
                ];
              }
            } else {
              // 查看
              this.$set(column, "display", ele.viewDisplay);
              this.$set(column, "disabled", true);
            }
            this.$set(column, "dicData", ele.dicData);
            column.addDisabled = ele.addDisabled;
            column.editDisabled = ele.editDisabled;
            column.addDisplay = ele.addDisplay;
            column.editDisplay = ele.editDisplay;
            column.hide = ele.hide;
            column.addRequired = ele.addRequired;
            column.editRequired = ele.editRequired;
            column.viewDisplay = ele.viewDisplay;
            column.span = parseInt(ele.formSpan);
            let columnList = this.deepClone(column);
            this.columnList.push(columnList);

            //用户选择
            if (column.type == "userSelect") {
              this.userSelect.push({
                type: "select",
                prop: column.prop,
                disabled : column.disabled,
                display : column.display,
                url: "/api/blade-user/getUserInfoBySearch",
                data: []
              });
              this.$set(column, "formslot", true);
              this.$set(column, "type", "select");
            }
            // 多选复选框配置
            if (column.type == "checkbox") {
              this.$set(column, "dataType", "string");
            }
            // 单个复选框配置
            if (column.type == "singlecheckbox") {
              this.$set(column, "dicData", [
                {
                  value: 1
                }
              ]);
              this.$set(column, "slot", true);
              this.$set(column, "type", "checkbox");
            }
            // 开关配置
            if (column.type == "switch") {
              this.$set(column, "dicData", [
                {
                  value: 1
                }
              ]);
              this.$set(column, "slot", true);
            }
            // 单选框配置  （静态数据） （少个根据字典配置）
            if (column.type == "radio") {
              this.$set(column, "dataType", "string");
            }
            // 图标配置
            if (column.type == "icon") {
              this.$set(column, "type", "icon");
              this.$set(column, "iconList", iconList);
            }
            // 下拉多选配置
            if (column.type == "multipleSelect") {
              this.$set(column, "type", "select");
              this.$set(column, "multiple", true);
            }
            // 日期配置
            if (column.type == "date") {
              //this.$set(column, "type", "daterange");
              this.$set(column, "format", "yyyy-MM-dd");
              this.$set(column, "valueFormat", "yyyy-MM-dd");
              // this.$set(column,"rules",[{required: true, message: "请输入日期",}])
            }
            // 日期时间配置
            if (column.type == "datetime") {
              // this.$set(column, "type", "datetimerange");
              this.$set(column, "format", "yyyy-MM-dd HH:mm:ss");
              this.$set(column, "valueFormat", "yyyy-MM-dd HH:mm:ss");
              this.$set(column, "width", 100);
              this.$set(column, "show-overflow-tooltip", true);
            }
            // 时间配置
            if (column.type == "time") {
              // this.timeList.push({
              //   prop: column.prop,
              //   type: "time"
              // });
              // this.$set(column, "type", "timerange");
              this.$set(column, "format", "HH:mm:ss");
              this.$set(column, "valueFormat", "HH:mm:ss");
              this.$set(column, "slot", true);
            }
            // 下拉模糊搜索配置
            if (column.type == "fuzzySearch") {
              this.$set(column, "type", "select");
              this.$set(column, "remote", true);
              //this.$set(column, "multiple", true);
              this.$set(
                column,
                "dicUrl",
                `/api/blade-dynamic/dynamicConfig/selectSearch?fieldDictField=${ele.fieldDictField}&fieldDictRemark=${ele.fieldDictRemark}&fieldDictTable=${ele.fieldDictTable}&search={{key}}`
              );
              this.$set(column, "props", {
                label: "role_name",
                value: "role_alias"
              });
            }
            if (column.type == "fileUpload") {

              this.fileUpload.push({
                prop: column.prop,
                type: "fileUpload",
                disabled : column.disabled,
                display : column.display,
                label: column.label,
                modelName: this.mainModelName,
                data: []
              });

              this.$set(column, "span", 24);
              this.$set(column, "hide", true);
              this.$set(column, "formslot", true);
            }
            if (column.type == "imgUpload") {
              this.imgUpload.push({
                prop: column.prop,
                type: "imgUpload",
                label: column.label,
                disabled : column.disabled,
                display : column.display,
                modelName: this.mainModelName,
                data: []
              });
              this.$set(column, "span", 24);
              this.$set(column, "hide", true);
              this.$set(column, "formslot", true);
            }
            this.option.column.push(column);
            // if(ele.formIsShow == 1){
            //     this.option.column.push({
            //     label:ele.dbFieldRemark,
            //     prop:ele.dbFieldName,
            //     type:ele.formInputType
            // })
            // }
          });
          console.log(this.option.column);
          this.dynamicTable = [{ group: "", groupModel: [] }];
          if (res.data.data.childModel.length > 0) {
            let tab = []; //{group:"",groupModel:[]}
            res.data.data.childModel.forEach(ele => {
              let groupId = ele.modelGroup;
              let isExist = false;
              let index = 0;
              for (let i = 0; i < tab.length; i++) {
                // 判断分组相同,找到对应的index,找到分组相同的
                if (groupId == tab[i].group) {
                  isExist = true; //找到了分组相同的
                  index = i;
                }
              }
              if (!isExist || groupId == "") {
                tab[tab.length] = {
                  group: groupId,
                  groupModel: [
                    {
                      modelName: ele.relatedTableName,
                      modelFields: ele.modelFieldQueryVOList,
                      infoData: [],
                      delId: [],
                      type: "table",
                      prop: ele.relatedTableName,
                      modelTitle: ele.relatedModelTitle
                    }
                  ]
                };
              } else {
                let groupModel = tab[index].groupModel;
                groupModel[groupModel.length] = {
                  modelName: ele.relatedTableName,
                  modelFields: ele.modelFieldQueryVOList,
                  infoData: [],
                  delId: [],
                  type: "table",
                  prop: ele.relatedTableName,
                  modelTitle: ele.relatedModelTitle
                }; //相当于添加同一个分组的modelGroup
              }
            });
            this.dynamicTable = tab;
            this.dynamicTable.forEach(ele => {
              if (!ele.group) {
                ele.group = "0"; //不带tab页签的
              }
              let obj = {};
              obj.labelWidth = 0;
              obj.label = "";
              obj.prop = ele.group;
              obj.span = 24;
              obj.hide = true;
              obj.formslot = true;
              this.option.column.push(obj);
            });
          }
        });
      }
    },
    getData() {
      let row = {
        modelId: this.formId,
        modelType: this.formType,
        dataId: this.dataId,
        mainModel: this.addObject.mainModel,
        dbTableName: this.addObject.dbTableName
      };
      initData(row).then(res => {
        this.columnList.forEach(ele=>{
          if(ele.type == 'userSelect'){
              let feild = "$" + ele.prop;
              let arr = [];
              arr.push({
                id: res.data.data[ele.prop],
                realName: res.data.data[feild]
              });
              this.userSelect.forEach(el => {
                if (el.prop == ele.prop) {
                  el.data = arr;
                }
              });
          }
        })
        console.log(this.userSelect)
        this.form = res.data.data;
      });
    },
    handleSubmit() {
      this.$refs.form.validate(valid=>{
        if(valid){
           let formDTO = this.getFormData(this.form);
      update(formDTO).then(res => {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
        this.dynamicTable.forEach(ele => {
          ele.groupModel.forEach(el => {
            el.delId = [];
          });
        }); //修改后，将delId数组清空
      });
        }
      })
    },
    // 用户选择
    userSelectSearch(query, field) {
      if (query !== "") {
        this.userSelectLoading = true;
        getUserName(query).then(res => {
          this.userSelect.forEach(ele => {
            if (ele.prop == field) {
              ele.data = res.data.data;
            }
          });
          this.userSelectLoading = false;
        });
      } else {
        this.userSelect.forEach(ele => {
          if (ele.prop == field) {
            ele.data = [];
          }
        });
      }
    },
    getFormData(row) {
      let columnFields = this.columnList;
      // 点击保存之前需要特殊处理的控件值
      columnFields.forEach(ele => {
        if (ele.type == "singlecheckbox") {
          if (row[ele.prop].length > 0) {
            let string = row[ele.prop].join();
            row[ele.prop] = Number(string);
          } else {
            row[ele.prop] = 0;
          }
        }
        if (ele.type == "number") {
          if (row[ele.prop] === undefined) {
            row[ele.prop] = null;
          }
        }
        if (ele.type == "switch") {
          console.log(row[ele.prop]);
          if (row[ele.prop] == false) {
            row[ele.prop] = 0;
          } else {
            row[ele.prop] = 1;
          }
        }
      });
      let arr = [];
      let deleteId = [];
      this.fileUpload.forEach(ele => {
        row[ele.prop] = ele.data;
      });
      this.imgUpload.forEach(ele => {
        row[ele.prop] = ele.data;
      });
      this.dynamicTable.forEach(ele => {
        ele.groupModel.forEach(el => {
          let obj = {};
          obj.modelName = el.modelName;
          obj.modelFields = el.infoData;
          arr.push(obj);
          if (!el.delId || el.delId.length == 0) {
            return;
          }
          deleteId.push(el.delId);
        });
      });
      let formDTO = {
        dataId: this.formId,
        dataType: this.formType,
        mainModel: row,
        childModel: arr,
        deleteList: deleteId
      };
      return formDTO;
    }
  }
};
</script>

<style scoped  lang="scss">
</style>
