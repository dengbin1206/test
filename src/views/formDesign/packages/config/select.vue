<template>
  <div>
    <el-form-item label="字典配置">
      <div class="el-input">
        <el-tabs v-model="data.dicOption" stretch @tab-click="handleTabClick">
          <el-tab-pane label="静态数据" name="static">
            <div style="border: 1px solid #dcdfe6; padding: 10px">
              <div style="margin-left: 26px">
                <el-button
                  size="mini"
                  icon="el-icon-circle-plus"
                  @click="handleAddFields"
                  >添加
                </el-button>
              </div>
              <draggable
                tag="ul"
                :list="data.dicData"
                :group="{ name: 'dic' }"
                ghost-class="ghost"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.dicData" :key="index">
                  <i
                    class="drag-item el-icon-s-operation"
                    style="font-size: 16px; margin: 0 5px; cursor: move"
                  ></i>
                  <el-input
                    style="margin-right: 5px"
                    size="mini"
                    clearable
                    v-model="item.label"
                    placeholder="label"
                  ></el-input>
                  <el-input
                    :style="{
                      'margin-right': data.type == 'select' ? '5px' : '0',
                    }"
                    size="mini"
                    clearable
                    v-model="item.value"
                    placeholder="value"
                  ></el-input>
                  <el-input
                    v-if="data.type == 'select'"
                    size="mini"
                    clearable
                    v-model="item.desc"
                    placeholder="描述"
                  ></el-input>
                  <el-button
                    @click="handleRemoveFields(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px; margin-left: 5px"
                  ></el-button>
                </li>
              </draggable>
            </div>
          </el-tab-pane>
          <el-tab-pane label="远端数据" name="remote">
            网址
            <el-input
              v-model="data.dicUrl"
              placeholder="远端数据字典网址"
            ></el-input>
            请求方法
            <el-select
              v-model="data.dicMethod"
              placeholder="请求方法"
              style="width: 100%"
            >
              <el-option label="POST" value="post"></el-option>
              <el-option label="GET" value="get"></el-option>
            </el-select>
            <p v-if="data.dicMethod == 'post'">
              请求参数
              <avue-dynamic
                v-model="data.dicQueryConfig"
                :children="option"
              ></avue-dynamic>
            </p>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form-item>
    <el-form-item label="字典Key配置">
      <div class="el-input">
        <ul>
          <li
            v-for="(value, key) in data.props"
            :key="key"
            style="margin-bottom: 2px"
          >
            <span style="width: 50px">{{ key }}</span>
            <el-input
              size="mini"
              v-model="data.props[key]"
              clearable
              placeholder="key配置"
            ></el-input>
          </li>
        </ul>
      </div>
    </el-form-item>
    <el-form-item v-if="data.dicOption == 'remote'" label="重新请求字典">
      <div class="el-input">
        <el-switch v-model="data.dicFlag"></el-switch>
      </div>
    </el-form-item>

    <template
      v-if="['select', 'multipleSelect', 'userSelect'].includes(data.type)"
    >
      <el-form-item label="是否多选">
        <div class="el-input">
          <el-switch v-model="data.multiple"></el-switch>
        </div>
      </el-form-item>
      <el-form-item label="是否可拖拽" v-if="data.multiple">
        <div class="el-input">
          <el-switch v-model="data.drag"></el-switch>
        </div>
      </el-form-item>
      <el-form-item label="多选数量限制" v-if="data.multiple">
        <el-input-number
          v-model="data.limit"
          controls-position="right"
          placeholder="多选限制"
          :min="0"
          :max="data.dicData && data.dicData.length"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="级联配置">
        <div class="el-input">
          <div style="border: 1px solid #dcdfe6; padding: 10px">
            <div style="margin-left: 26px">
              <el-button
                size="mini"
                icon="el-icon-circle-plus"
                @click="handleAddCascaderItemFields"
                >添加
              </el-button>
            </div>
            <draggable
              tag="ul"
              :list="data.cascaderItem"
              :group="{ name: 'cascaderItem' }"
              ghost-class="ghost"
              handle=".drag-item"
            >
              <li v-for="(item, index) in data.cascaderItem" :key="index">
                <i
                  class="drag-item el-icon-s-operation"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ></i>
                <el-input
                  size="mini"
                  v-model="data.cascaderItem[index]"
                  clearable
                  placeholder="级联属性值"
                ></el-input>
                <el-button
                  @click="handleRemoveCascaderItemFields(index)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                >
                </el-button>
              </li>
            </draggable>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="data.cascaderItem && data.cascaderItem.length > 0"
        label="级联默认选中"
      >
        <el-input-number
          v-model="data.cascaderIndex"
          controls-position="right"
          placeholder="级联默认选中"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="是否可清空">
        <div class="el-input">
          <el-switch v-model="data.clearable"></el-switch>
        </div>
      </el-form-item>
      <el-form-item label="是否可搜索">
        <div class="el-input">
          <el-switch v-model="data.filterable"></el-switch>
        </div>
      </el-form-item>
      <el-form-item label="是否可输入" v-if="data.filterable">
        <div class="el-input">
          <el-switch v-model="data.allowCreate"></el-switch>
        </div>
      </el-form-item>
      <el-form-item label="开启远程搜索">
        <div class="el-input">
          <el-switch v-model="data.remote"></el-switch>
        </div>
      </el-form-item>
    </template>
    <template v-if="['radio', 'checkbox'].includes(data.type)">
      <el-form-item label="边框" v-if="!data.button">
        <div class="el-input">
          <el-switch v-model="data.border"></el-switch>
        </div>
      </el-form-item>
      <el-form-item label="按钮" v-if="!data.border">
        <div class="el-input">
          <el-switch v-model="data.button"></el-switch>
        </div>
      </el-form-item>
    </template>
    <el-form-item label="尺寸" v-if="data.border || data.button">
      <div class="el-input">
        <el-radio-group v-model="data.size" size="mini">
          <el-radio-button label="medium">正常</el-radio-button>
          <el-radio-button label="small">小</el-radio-button>
          <el-radio-button label="mini">超小</el-radio-button>
        </el-radio-group>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  name: "config-select",
  props: ["data"],
  components: { Draggable },
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
      option: {
        column: [
          {
            type: "input",
            prop: "key",
            label: "key",
          },
          {
            type: "input",
            prop: "value",
            label: "value",
          },
        ],
      },
    };
  },
  methods: {
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) rules.push(this.validator[key]);
      });
      this.data.rules = rules;
    },
    handleRemoveFields(index) {
      this.data.dicData.splice(index, 1);
    },
    handleAddFields() {
      const i = Math.ceil(Math.random() * 99999);
      this.data.dicData.push({ label: `字段${i}`, value: `col_${i}` });
    },
    handleRemoveCascaderItemFields(index) {
      this.data.cascaderItem.splice(index, 1);
    },
    handleAddCascaderItemFields() {
      this.data.cascaderItem.push("");
    },
    handleTabClick({ name }) {
      if (name == "remote" && !this.data.dicQueryConfig)
        this.data.dicQueryConfig = [];
    },
  },
  watch: {
    "data.required": function (val) {
      if (val)
        this.validator.required = {
          required: true,
          message: `请选择${this.data.label}`,
        };
      else this.validator.required = null;

      this.generateRule();
    },
  },
};
</script>
