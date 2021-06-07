<template>
  <div class="listCard">
    <div class="loading" v-if="renderLoading">
      <!-- <van-loading color="#0094ff" /> -->
      <van-skeleton :row="5" :row-width="['80%', '90%', '100%', '80%']" />
    </div>

    <van-popup
      v-model="pickerVisible"
      position="bottom"
      class="popup"
      get-container="body"
      @open="openPopup"
    >
      <calanderTimePicker
        @click="(date) => onSelectDate(date, row)"
        :defaultDate="filedsValue[row.modelAndField]"
        :dateType="row.formInputType"
        :menuKey="dateTimeKey"
      />
    </van-popup>

    <!-- 下拉单选 -->
    <van-popup
      v-model="selectPicker"
      position="bottom"
      class="popup picker"
      get-container="body"
      @open="openPopup"
    >
      <selectPicker
        :columns="row.dicData"
        :title="row.dbFieldRemark"
        :defaultValue="filedsValue[row.modelAndField]"
        @onConfirm="onConfirmSelect"
        @onCancel="onCancel"
        :menuKey="selectKey"
      />
    </van-popup>

    <!-- 下拉多选 -->
    <van-popup
      v-model="multipleSelect"
      get-container="body"
      class="popup full"
      position="bottom"
      @open="openPopup"
    >
      <mutiSelect
        :title="row.dbFieldRemark"
        :dictList="row.dicData"
        :defaultValue="filedsValue[row.modelAndField]"
        :menuKey="multipleKey"
        @onConfirm="onConfirmSelect"
      />
    </van-popup>

    <!-- 模糊搜索 -->
    <van-popup
      v-model="fuzzySearch"
      get-container="body"
      class="popup full"
      position="bottom"
      @open="openPopup"
    >
      <fuzzySearch
        :title="row.dbFieldRemark"
        :defaultValue="filedsValue[row.modelAndField]"
        :menuKey="fuzzyKey"
        :fieldDictTable="row.fieldDictTable"
        :fieldDictField="row.fieldDictField"
        :fieldDictRemark="row.fieldDictRemark"
        @onConfirm="onConfirmSelect"
      />
    </van-popup>

    <!-- 用户搜索 -->

    <van-popup
      v-model="userSearch"
      get-container="body"
      class="popup full"
      position="bottom"
      @open="openPopup"
    >
      <userSearch
        :title="row.dbFieldRemark"
        :defaultValue="filedsValue[row.modelAndField]"
        :menuKey="userKey"
        @onConfirm="onConfirmSelect"
      />
    </van-popup>

    <!-- 部门选择 -->

    <van-popup
      v-model="deptSearch"
      get-container="body"
      class="popup full"
      position="bottom"
      @open="openPopup"
    >
      <deptSearch
        :title="row.dbFieldRemark"
        :defaultValue="filedsValue[row.modelAndField]"
        :menuKey="deptKey"
        @onConfirm="onConfirmSelect"
      />
    </van-popup>

    <van-form
      @submit="onSubmit"
      @failed="onFaile"
      :show-error="false"
      :show-error-message="false"
      ref="renderForm"
    >
      <div
        class="cells"
        v-for="(item, index) in mainModelShow"
        :key="index"
        v-show="item.display"
      >
        <van-field
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :readonly="item.readonly"
          :name="item.modelAndField"
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          :type="item.type"
          v-if="item.formInputType === 'radio'"
        >
          <template #input>
            <van-radio-group
              v-model="filedsValue[item.modelAndField]"
              direction="horizontal"
            >
              <radioSelect
                :dictData="item.dicData"
                :readonly="item.readonly"
                :activeValue="filedsValue[item.modelAndField]"
                @click="(val) => setValue(val, item)"
              />
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :readonly="item.readonly"
          :name="item.modelAndField"
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          :type="item.type"
          v-if="item.formInputType === 'checkbox'"
        >
          <template #input>
            <checkboxSelect
              :dictData="item.dicData"
              :readonly="item.readonly"
              :activeValue="filedsValue[item.modelAndField]"
              @click="(val) => setValue(val, item)"
            />
          </template>
        </van-field>

        <van-field
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :readonly="item.readonly"
          @blur="onBlur"
          :name="item.modelAndField"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          :type="item.type"
          v-if="
            item.formInputType === 'switch' ||
            item.formInputType === 'singlecheckbox'
          "
        >
          <template #input>
            <van-switch
              v-model="filedsValue[item.modelAndField]"
              active-value="1"
              inactive-value="0"
              size="1rem"
              :disabled="item.readonly"
            />
          </template>
        </van-field>

        <van-field
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          :readonly="item.readonly"
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          :type="item.type"
          v-if="
            item.formInputType === 'date' ||
            item.formInputType === 'datetime' ||
            item.formInputType === 'time'
          "
          @click="getRow(item)"
        >
          <template #input>
            {{ filedsValue[item.modelAndField] }}
          </template>
        </van-field>

        <van-field
          v-if="item.formInputType === 'select'"
          v-model="filedsValue[`$${item.modelAndField}`]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          readonly
          @blur="onBlur"
          colon
          :type="item.type"
          rows="1"
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          autosize
          @click="getSelectPicker(item)"
        />

        <van-field
          v-if="item.formInputType === 'multipleSelect'"
          v-model="filedsValue[`$${item.modelAndField}`]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          readonly
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          @click="getMultipleSelect(item)"
        >
          <template
            #input
            class="multipleSelect"
            v-if="filedsValue[`$${item.modelAndField}`].length > 0"
          >
            <van-tag
              v-for="(e, i) in filedsValue[`$${item.modelAndField}`].split(',')"
              :key="i"
              plain
              type="primary"
              size="small"
            >
              {{ e }}
            </van-tag>
          </template>
        </van-field>

        <van-field
          v-if="item.formInputType === 'fuzzySearch'"
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          readonly
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          @click="getFuzzySearch(item)"
        >
          <template
            #input
            v-if="filedsValue[`$${item.modelAndField}`].length > 0"
          >
            <van-tag
              v-for="(e, i) in filedsValue[`$${item.modelAndField}`].split(',')"
              :key="i"
              plain
              type="primary"
              size="small"
            >
              {{ e }}
            </van-tag>
          </template>
        </van-field>

        <van-field
          v-if="item.formInputType === 'userSelect'"
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          readonly
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          @click="getUserSearch(item)"
        >
          <template
            #input
            v-if="filedsValue[`$${item.modelAndField}`].length > 0"
          >
            <van-tag
              v-for="(e, i) in filedsValue[`$${item.modelAndField}`].split(',')"
              :key="i"
              plain
              type="primary"
              size="small"
            >
              {{ e }}
            </van-tag>
          </template>
        </van-field>

        <van-field
          v-if="item.formInputType === 'deptSelect'"
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          readonly
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          @click="getDeptSearch(item)"
        >
          <template
            #input
            v-if="filedsValue[`$${item.modelAndField}`].length > 0"
          >
            <van-tag
              v-for="(e, i) in filedsValue[`$${item.modelAndField}`].split(',')"
              :key="i"
              plain
              type="primary"
              size="small"
            >
              {{ e }}
            </van-tag>
          </template>
        </van-field>

        <van-field
          v-if="
            item.formInputType === 'fileUpload' ||
            item.formInputType === 'imgUpload'
          "
          v-model="item.modelAndField"
          :label="item.dbFieldRemark"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          :readonly="item.readonly"
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          :type="item.type"
          rows="1"
          autosize
        >
          <template #input>
            <div>
              <Uploader
                :getAllFile="filedsValue[item.modelAndField]"
                :dataSrcId="item.tableName"
                :affixType="item.modelAndField"
                :readonly="item.readonly"
                :item="item"
                :accept="item.formInputType === 'imgUpload' ? 'image' : 'all'"
                @uploadData="uploadData"
              />
            </div>
          </template>
        </van-field>
        <van-field
          v-if="
            item.formInputType === 'input' ||
            item.formInputType === 'number' ||
            item.formInputType === 'textarea'
          "
          v-model="filedsValue[item.modelAndField]"
          :label="item.dbFieldRemark"
          :placeholder="item.formPlaceholder"
          :required="item.required"
          :input-align="item.align"
          :name="item.modelAndField"
          :readonly="item.readonly"
          @blur="onBlur"
          colon
          :rules="[
            { required: item.required, message: `${item.dbFieldRemark} 必填` },
          ]"
          :type="item.type"
          rows="1"
          autosize
        />
      </div>
    </van-form>

    <div style="margin-top: 10px">
      <div v-for="(Tableitem, index) in dynamicTableData" :key="index">
        <el-tabs type="border-card" :key="index" v-if="Tableitem.group != ''">
          <el-tab-pane
            :label="item.modelTitle"
            v-for="(item, i) in Tableitem.groupModel"
            :key="i"
          >
            <dynamic-table
              ref="dynamicTable"
              :data.sync="item.infoData"
              :delId.sync="item.delId"
              :id="dataId"
              :type="dataType"
              :fieldData="item.modelFields"
              :addEditView="editFlag ? 'edit' : 'view'"
              :modelName="item.modelName"
              :modelTitle="item.modelTitle"
              :mainId="mainId"
            ></dynamic-table>
          </el-tab-pane>
        </el-tabs>
        <dynamic-table
          v-else
          v-for="(item, i) in Tableitem.groupModel"
          :key="i"
          ref="dynamicTable"
          :data.sync="item.infoData"
          :delId.sync="item.delId"
          :id="dataId"
          :type="dataType"
          :fieldData="item.modelFields"
          :addEditView="editFlag ? 'edit' : 'view'"
          :modelName="item.modelName"
          :modelTitle="item.modelTitle"
          :mainId="mainId"
        ></dynamic-table>
      </div>
    </div>

    <div style="margin: 16px">
      <van-button
        round
        block
        type="info"
        native-type="submit"
        size="small"
        color="#409EFF"
        @click="handleSubmitForm"
        v-if="editFlag"
        >保存</van-button
      >
    </div>
  </div>
</template>

<script>
import { Loading, Toast } from "vant";
import { queryForm, initData, testFn, update } from "@/api/mobileApi/flow";
import checkboxSelect from "./checkboxSelect";
import radioSelect from "./radioSelect";
import selectPicker from "./selectPicker";
import mutiSelect from "./mutiSelect";
import fuzzySearch from "./fuzzySearch";
import userSearch from "./userSearch";
import deptSearch from "./deptSearch";
import Uploader from "../../../MobileComponent/Uploader";
import dynamicTable from "@/components/dynamicTable";

let _ = require("lodash");

export default {
  props: {
    renderFormInfo: {
      type: Object,
    },
  },
  components: {
    radioSelect,
    checkboxSelect,
    selectPicker,
    mutiSelect,
    fuzzySearch,
    userSearch,
    deptSearch,
    Uploader,
    dynamicTable,
    calanderTimePicker: () => import("./calanderTimePicker"),
  },
  data() {
    return {
      renderLoading: false,
      mainModel: [],
      dbTableName: "",
      filedsValue: {},
      mainModelShow: [],
      numberKeyBoard: false,
      plain: false,
      pickerVisible: false,
      row: {},
      multipleKey: 1,
      dateTimeKey: 1,
      selectKey: 1,
      fuzzyKey: 1,
      userKey: 1,
      deptKey: 1,
      deptSearch: false,
      selectPicker: false,
      multipleSelect: false,
      fuzzySearch: false,
      userSearch: false,
      componentType: null,
      showtable: false,
      // 保存
      dataId: null,
      dataType: "",
      editFlag: false,
      mainId: "",
      dynamicTableData: [{ group: "", groupModel: [] }],
      fromValues: {},
    };
  },

  watch: {
    renderFormInfo: function (next, prev) {
      if (next) {
        this.queryFormFileds();
      }
    },
  },

  methods: {
    async queryFormFileds() {
      let {
        formId,
        formType,
        proDefId,
        nodeCode,
        dataId,
        editFlag,
      } = this.renderFormInfo;
      this.dataId = formId;
      this.editFlag = editFlag;
      this.dataType = formType;
      this.mainId = dataId;
      this.renderLoading = true;
      const { data } = await queryForm(formId, formType, proDefId, nodeCode);
      if (data.code === 200) {
        this.renderLoading = false;
        this.showtable = true;
        this.mainModel = data.data.mainModel;

        this.dbTableName = data.data.dbTableName;
        const { data: res } = await initData({
          modelId: formId,
          modelType: formType,
          dataId: dataId,
          mainModel: this.mainModel,
          dbTableName: this.dbTableName,
        });
        this.filedsValue = res.data;

        let _this = this;

        this.mainModel.forEach((e) => {
          if (editFlag) {
            this.mainModelShow.push({
              ...e,
              display: e.editDisplay,
              readonly: e.editDisabled,
              required: e.editRequired,
              align: _this.filedsAlign(e, e.editDisabled),
              type: _this.filedsType(e),
            });
          } else {
            this.mainModelShow.push({
              ...e,
              display: e.viewDisplay,
              readonly: true,
              required: false,
              align: _this.filedsAlign(e, true),
              type: _this.filedsType(e),
            });
          }
        });

        this.dynamicTableData = [{ group: "", groupModel: [] }];
        this.childModel = data.data.childModel;
        if (this.childModel.length > 0) {
          let tab = []; //{group:"",groupModel:[]}
          this.childModel.forEach((ele) => {
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
                    modelTitle: ele.relatedModelTitle,
                  },
                ],
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
                modelTitle: ele.relatedModelTitle,
              }; //相当于添加同一个分组的modelGroup
            }
            this.dynamicTableData = tab;
          });
          this.dynamicTableData.forEach((ele) => {
            let obj = {};
            obj.labelWidth = 0;
            obj.label = "";
            obj.prop = ele.group;
            obj.span = 24;
            obj.hide = true;
            obj.formslot = true;
            // this.option.column.push(obj);
          });
        }
      }
    },

    // 自定义label对齐方式
    filedsAlign(item, readonly) {
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
        ].includes(item.formInputType)
      ) {
        return "right";
      } else if (
        (item.formInputType === "input" || item.formInputType === "number") &&
        item.dbType === "Integer"
      ) {
        return "right";
      } else if (
        (item.formInputType === "input" || item.formInputType === "number") &&
        item.dbType === "Double"
      ) {
        return "right";
      } else if (item.formInputType === "textarea") {
        return "left";
      } else if (readonly) {
        return "right";
      }
    },

    // 自定义输入框类型
    filedsType(item) {
      if (
        (item.formInputType === "input" || item.formInputType === "number") &&
        item.dbType === "Integer"
      ) {
        return "digit";
      } else if (
        (item.formInputType === "input" || item.formInputType === "number") &&
        item.dbType === "Double"
      ) {
        return "number";
      } else if (item.formInputType === "textarea") {
        return "textarea";
      }
    },

    tagClick(item, index) {
      item.select = true;
    },

    setValue(val, item) {
      this.filedsValue[item.modelAndField] = val;
    },

    onSelectTime({ currentDate, currentTime }) {
      this.pickerVisible = false;
      console.log(currentDate, currentTime);
    },

    onSelectDate(date, item) {
      this.pickerVisible = false;
      this.filedsValue[item.modelAndField] = date;
    },

    getRow(row) {
      if (row.readonly) {
        return;
      }
      this.pickerVisible = true;
      this.row = row;
      this.dateTimeKey++;
    },

    openPopup() {
      this.menuKey++;
    },

    // 可选参数 value, label, valueList, labelList, objList
    onConfirmSelect({ value, label }) {
      this.selectPicker = false;
      this.fuzzySearch = false;
      this.userSearch = false;
      this.multipleSelect = false;
      this.filedsValue[this.row.modelAndField] = value;
      this.filedsValue[`$${this.row.modelAndField}`] = label;
    },

    onCancel() {
      this.selectPicker = false;
    },

    getSelectPicker(item) {
      if (item.readonly) {
        return;
      }
      this.selectPicker = true;
      this.row = item;
      this.selectKey++;
    },

    getMultipleSelect(item) {
      if (item.readonly) {
        return;
      }
      this.row = item;
      this.multipleSelect = true;
      this.multipleKey++;
    },

    getFuzzySearch(item) {
      if (item.readonly) {
        return;
      }
      this.row = item;
      this.fuzzySearch = true;
      this.fuzzyKey++;
    },

    getUserSearch(item) {
      console.log(item.readonly);
      if (item.readonly) {
        return;
      }
      this.row = item;
      this.userSearch = true;
      this.userKey++;
    },

    getDeptSearch(item) {
      if (item.readonly) {
        return;
      }
      this.row = item;
      this.deptSearch = true;
      this.deptKey++;
    },

    async onSubmit(values) {
      this.mainModelShow.forEach((item) => {
        Object.keys(values).forEach((e) => {
          if (item.modelAndField === e) {
            if (
              item.formInputType === "fileUpload" ||
              item.formInputType === "imgUpload"
            ) {
              values[item.modelAndField] = this.filedsValue[item.modelAndField];
            }
          }
        });
      });

      let arr = [];
      let deleteId = [];
      this.dynamicTableData.forEach((ele) => {
        ele.groupModel.forEach((el) => {
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

      const { data } = await update({
        dataId: this.dataId,
        dataType: this.dataType,
        mainModel: values,
        childModel: arr,
        deleteList: deleteId,
      });

      if (data.code === 200) {
        Toast("保存成功");
        this.dynamicTableData.forEach((ele) => {
          ele.groupModel.forEach((el) => {
            el.delId = [];
          });
        });
      }
    },

    handleSubmitForm() {
      this.$refs.renderForm.submit();
    },

    onFaile(errorInfo) {
      const { errors } = errorInfo;
      if (errors) {
        Toast({
          message: errors[0].message,
          position: "top",
        });
      }
    },

    onBlur(event) {
      this.mainModelShow.forEach((e) => {
        if (e.formExtendValue.includes("#")) {
          let inputVal = e.formExtendValue;
          let fromVals = this.$refs.renderForm.getValues();
          Object.keys(fromVals).forEach((i) => {
            inputVal = inputVal.replace(new RegExp(i, "g"), fromVals[i]);
            if (inputVal && inputVal.indexOf("#") == -1) {
              this.filedsValue[e.modelAndField] = eval(inputVal);
            }
          });
        }
      });
    },

    uploadData({ item, allFileList }) {
      this.filedsValue[item.modelAndField] = allFileList;
    },
  },
};
</script>

<style lang="scss" scoped>
.listCard {
  width: 90%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 3% auto;
  border-radius: 7px;
  padding: 10px 12px;
  background: #fff;
  position: relative;
  z-index: -0;

  .cells {
    position: relative;
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 7px;
      bottom: 0;
      left: 7px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }

    &:last-child {
      &::after {
        border-bottom: none;
      }
    }
  }

  .loading {
    margin: 0 auto;
    text-align: center;
  }

  .titled {
    font-size: 14px;
    color: #0079fe;
  }

  .tag {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
  }
}

.popup {
  width: 100%;
  height: 70%;
  background-color: #fff;
}

.picker {
  height: 50%;
}

.full {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.multipleSelect {
  display: flex;
  flex-wrap: wrap;
}

/deep/.van-field__label {
  width: unset;
}

/deep/.van-radio--horizontal {
  margin-right: 5px;
}

// /deep/.van-cell {
//   padding: 10px 7px;
// }

// /deep/.van-cell--required::before {
//   left: 0;
// }

/deep/.van-field__control--right {
  display: flex;
  flex-wrap: wrap;
  span {
    margin-right: 3px;
    margin-bottom: 3px;
  }
}
</style>
