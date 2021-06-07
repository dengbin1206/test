<template>
  <div class="widget-config-inner">
    <el-form size="small">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="类型" v-if="data.type && !data.component">
            <el-select
              v-model="data.type"
              style="width: 100%"
              placeholder="请选择类型"
              @change="handleChangeType"
            >
              <el-option-group
                v-for="group in fields"
                :key="group.title"
                :label="group.title"
              >
                <el-option
                  v-for="item in group.list"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="模型字段">
            <el-select
              v-model="data.prop"
              placeholder="模型字段"
              clearable
              filterable
              @change="selectChange"
            >
              <el-option
                v-for="item in fieldList"
                :key="item.id"
                :label="item.fieldAndModelRemark"
                :value="item.modelAndField"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="标题">
            <el-input
              v-model="data.label"
              clearable
              placeholder="标题"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            label="表单栅格"
            v-if="!data.subfield && !['group'].includes(data.type)"
          >
            <el-input-number
              style="width: 100%"
              v-model="data.span"
              controls-position="right"
              placeholder="表单栅格"
              :min="8"
              :max="24"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="占位内容">
            <el-input
              v-model="data.placeholder"
              clearable
              placeholder="占位内容"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="默认值">
            <el-input
              v-model="data.value"
              clearable
              placeholder="默认值"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            label="数据类型"
            v-if="
              [
                'cascader',
                'checkbox',
                'radio',
                'select',
                'tree',
                'upload',
                'img',
                'array',
                'slider',
                'timerange',
                'daterange',
                'datetimerange',
              ].includes(data.type)
            "
          >
            <el-select v-model="data.dataType" placeholder="数据类型" clearable>
              <el-option label="字符串" value="string"></el-option>
              <el-option label="数字" value="number"></el-option>
              <el-option label="数组" value="array"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="标题提示">
            <el-input
              v-model="data.labelTip"
              clearable
              placeholder="标题提示"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="计算公式">
            <el-input
              v-model="data.calculate"
              clearable
              placeholder="计算公式"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            v-if="data.labelTip && !['upload'].includes(data.type)"
            label="标题提示位置"
          >
            <el-select
              v-model="data.labelTipPlacement"
              placeholder="标题提示位置"
              clearable
            >
              <el-option label="上" value="top"></el-option>
              <el-option label="下" value="bottom"></el-option>
              <el-option label="左" value="left"></el-option>
              <el-option label="右" value="right"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="字段提示">
            <el-input
              v-model="data.tip"
              clearable
              placeholder="字段提示"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            v-if="data.tip && !['upload'].includes(data.type)"
            label="字段提示位置"
          >
            <el-select
              v-model="data.tipPlacement"
              placeholder="字段提示位置"
              clearable
            >
              <el-option label="上" value="top"></el-option>
              <el-option label="下" value="bottom"></el-option>
              <el-option label="左" value="left"></el-option>
              <el-option label="右" value="right"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- crud -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="表格列宽" v-if="data.subfield">
            <div class="el-input">
              <el-input
                v-model="data.width"
                clearable
                placeholder="表格列宽"
              ></el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="表格列对齐方式" v-if="data.subfield">
            <el-select
              v-model="data.columnAlign"
              placeholder="表格列对齐方式"
              clearable
            >
              <el-option label="居左" value="left"></el-option>
              <el-option label="居中" value="center"></el-option>
              <el-option label="居右" value="right"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="是否可见">
            <div class="el-input">
              <el-checkbox v-model="data.display" size="mini"
                >全部可见</el-checkbox
              >
              <el-checkbox v-model="data.addDisplay" size="mini"
                >新增可见</el-checkbox
              >
              <el-checkbox v-model="data.editDisplay" size="mini"
                >修改可见</el-checkbox
              >
              <el-checkbox v-model="data.viewDisplay" size="mini"
                >显示可见</el-checkbox
              >
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="是否禁用">
            <div class="el-input">
              <el-checkbox v-model="data.disabled" size="mini"
                >全部禁用</el-checkbox
              >
              <el-checkbox v-model="data.addDisabled" size="mini"
                >新增禁用</el-checkbox
              >
              <el-checkbox v-model="data.editDisabled" size="mini"
                >修改禁用</el-checkbox
              >
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="是否必填">
            <el-switch v-model="data.required"></el-switch>
            <el-input
              v-if="data.required"
              style="margin-top: 3px"
              clearable
              v-model.lazy="data.pattern"
              placeholder="正则表达式"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="表格列固定" v-if="data.subfield">
            <el-switch v-model="data.fixed"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="表格列隐藏" v-if="data.subfield">
            <el-switch v-model="data.hide"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="表格列排序" v-if="data.subfield">
            <el-switch v-model="data.sortable"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="表格列筛选" v-if="data.subfield">
            <el-switch v-model="data.filters"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <slot></slot>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import _ from "lodash";
import fields from "./fieldsConfig";
import { deepClone } from "@/util/util";

export default {
  name: "default-config",
  props: ["data", "fieldList"],

  data() {
    return {
      fields,
      cloneData: this.data,
    };
  },

  methods: {
    // 模型字段自动填充标题
    selectChange(val) {
      this.data.label = _.filter(this.fieldList, {
        modelAndField: val,
      })[0].dbFieldRemark;

      if (this.data.type === "upload" || this.data.type === "imgUpload") {
        if (this.data.type === "upload") {
          this.$set(this.data, "accept", "");
          this.$set(this.data, "listType", "text");
        }

        if (this.data.type === "imgUpload") {
          this.$set(this.data, "listType", "picture");
          this.$set(this.data, "accept", " image/*");
        }
      }
    },

    async handleChangeType(type) {
      if (type) {
        let config = await this.getConfigByType(type)
        config.prop = this.data.prop;

      for (let key in config) {
        if (
          config &&
          Object.prototype.hasOwnProperty.call(config, key) &&
          !["icon", "label", "span"].includes(key)
        ) {

          if(['radio','checkbox'].includes(config.type)){
            const val = config[key];
            this.$set(this.data, key, val);
            this.$set(this.data, "dicData", [{
              label: "选项一",
              value: '1'
            },{
              label: "选项二",
              value: '2'
            }]);

          }else{
            const val = config[key];
            this.$set(this.data, key, val);
          }
        }
      }
    }

      if (type === "upload" || type === "imgUpload") {
        if (type === "upload") {
          this.$set(this.data, "accept", "");
          this.$set(this.data, "listType", "text");
        }

        if (type === "imgUpload") {
          this.$set(this.data, "listType", "picture");
          this.$set(this.data, "accept", " image/*");
        }
      }
    },

    getConfigByType(type) {
      return new Promise((resolve, reject) => {
        fields.forEach((field) => {
          field.list.forEach((config) => {
            if (config.type == type) resolve(config);
          });
        });
        reject();
      });
    },
  },
};
</script>