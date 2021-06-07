<template>
  <div class="form-designer">
    <el-container>
      <el-aside class="widget-config-container" :width="rightWidth">
        <el-tabs v-model="layoutTab" stretch>
          <el-tab-pane label="布局控件" name="layout" style="padding: 0 10px">
            <div class="fields-list">
              <div v-for="(field, index) in fields" :key="index">
                <template
                  v-if="field.list.find((f) => includeFields.includes(f.type))"
                >
                  <div class="field-title">
                    <el-badge :value="field.list.length" type="danger">
                      <el-tag size="small" effect="plain">{{
                        `${field.title}`
                      }}</el-tag>
                    </el-badge>
                  </div>
                  <draggable
                    tag="ul"
                    :list="field.list"
                    :group="{ name: 'form', pull: 'clone', put: false }"
                    ghost-class="ghost"
                    :sort="false"
                  >
                    <template v-for="(item, index) in field.list">
                      <li
                        v-if="includeFields.includes(item.type)"
                        :key="index"
                        :class="[
                          `field-label ${
                            ['datetimerange'].includes(item.type)
                              ? 'field-label-full'
                              : ''
                          }`,
                        ]"
                      >
                        <el-tooltip
                          effect="dark"
                          :content="item.desc"
                          placement="right"
                          :enterable="false"
                          v-if="item.desc"
                        >
                          <a @click="handleFieldClick(item)">
                            <i class="icon iconfont" :class="item.icon"></i>
                            <span>{{ item.title || item.label }}</span>
                          </a>
                        </el-tooltip>
                        <a @click="handleFieldClick(item)" v-else>
                          <i class="icon iconfont" :class="item.icon"></i>
                          <span>{{ item.title || item.label }}</span>
                        </a>
                      </li>
                    </template>
                  </draggable>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="模型字段"
            name="model"
            lazy
            style="padding: 0 10px"
          >
            <div class="fields-list">
              <div>
                <template>
                  <div class="field-title">
                    <el-badge :value="modelFieldList.length" type="danger">
                      <el-tag size="small" effect="plain">{{
                        `模型字段`
                      }}</el-tag>
                    </el-badge>
                    <div style="margin-top: 10px">
                      <el-input
                        size="mini"
                        clearable
                        prefix-icon="el-icon-search"
                        placeholder="输入关键字搜索..."
                        v-model="modelField"
                        @input="searchModelField"
                      ></el-input>
                    </div>
                  </div>
                  <draggable
                    tag="ul"
                    :list="modelFieldList"
                    :group="{ name: 'form', pull: 'clone', put: false }"
                    ghost-class="ghost"
                    :sort="false"
                    v-if="modelField === ''"
                  >
                    <template v-for="(item, index) in modelFieldList">
                      <li
                        :key="index"
                        :class="[`field-label field-label-full`]"
                      >
                        <a @click="handleFieldClick(item)">
                          <span>{{ item.dbFieldRemark }}</span>
                          <br />
                          <span style="color: #909399">{{
                            item.modelAndField
                          }}</span>
                        </a>
                      </li>
                    </template>
                  </draggable>

                  <draggable
                    tag="ul"
                    :list="originList"
                    :group="{ name: 'form', pull: 'clone', put: false }"
                    ghost-class="ghost"
                    :sort="false"
                    v-if="modelField !== ''"
                  >
                    <template v-for="(item, index) in originList">
                      <li
                        :key="index"
                        :class="[`field-label field-label-full`]"
                      >
                        <a @click="handleFieldClick(item)">
                          <span>{{ item.dbFieldRemark }}</span>
                          <br />
                          <span style="color: #909399">{{
                            item.modelAndField
                          }}</span>
                        </a>
                      </li>
                    </template>
                  </draggable>
                </template>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>

      <el-container class="widget-container" direction="vertical">
        <el-header class="widget-container-header">
          <div class="btn-bar">
            <div
              v-for="(icon, index) in deviceList"
              :key="index"
              :class="[`icon ${index === currentIdx ? 'active' : ''}`]"
              @click="chooseDevice(icon, index)"
            >
              <el-tooltip effect="dark" :content="icon.desc" placement="right">
                <div :class="[`iconfont iconfont-${icon.name}`]"></div>
              </el-tooltip>
            </div>
            <div class="divider"></div>
            <div class="tools">
              <el-tooltip effect="dark" content="上一步" placement="right">
                <el-button
                  size="mini"
                  circle
                  plain
                  type="primary"
                  icon="el-icon-back"
                  :disabled="historySteps.index == 0"
                  @click="widgetForm = handleUndo()"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="重做" placement="right">
                <el-button
                  size="mini"
                  circle
                  plain
                  type="primary"
                  icon="el-icon-refresh"
                  :disabled="
                    historySteps.index == historySteps.steps.length - 1
                  "
                  @click="widgetForm = handleRedo()"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="清空" placement="right">
                <el-button
                  size="mini"
                  circle
                  plain
                  type="danger"
                  icon="el-icon-brush"
                  @click="handleClear"
                ></el-button>
              </el-tooltip>
            </div>
          </div>
          <div>
            <el-tooltip effect="dark" content="预览" placement="bottom">
              <el-button
                size="mini"
                plain
                circle
                type="primary"
                @click="handlePreview"
                icon="el-icon-view"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="生成JSON" placement="bottom">
              <el-button
                size="mini"
                plain
                circle
                type="primary"
                @click="handleGenerateJson"
                icon="el-icon-download"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="导入JSON" placement="bottom">
              <el-button
                size="mini"
                plain
                circle
                type="primary"
                @click="importJsonVisible = true"
                icon="el-icon-upload2"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="保存" placement="bottom">
              <el-button
                size="mini"
                plain
                circle
                type="success"
                @click="handleSubmit"
                icon="el-icon-check"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="关闭" placement="bottom">
              <el-button
                size="mini"
                plain
                circle
                type="danger"
                @click="$router.push('/formDesign/index')"
                icon="el-icon-close"
              ></el-button>
            </el-tooltip>
          </div>
        </el-header>
        <el-main class="canvas">
          <widget-form
            ref="widgetForm"
            :data="widgetForm"
            :select.sync="widgetFormSelect"
            @change="handleHistoryChange(widgetForm)"
          ></widget-form>
        </el-main>
      </el-container>

      <el-aside class="widget-config-container" width="320px">
        <el-tabs v-model="configTab" stretch>
          <el-tab-pane label="字段属性" name="widget" style="padding: 0 10px">
            <widget-config
              :data="widgetFormSelect"
              :fieldList="fieldList"
              :currentRow="currentRow"
            ></widget-config>
          </el-tab-pane>
          <el-tab-pane label="表单属性" name="form" style="padding: 0 10px">
            <form-config :data="widgetForm"></form-config>
          </el-tab-pane>
        </el-tabs>
      </el-aside>

      <el-drawer
        title="导入JSON"
        :visible.sync="importJsonVisible"
        size="50%"
        append-to-body
        destroy-on-close
      >
        <monaco-editor
          v-model="importJson"
          keyIndex="import"
          height="82%"
        ></monaco-editor>
        <div class="drawer-foot">
          <el-button
            size="medium"
            type="primary"
            @click="handleImportJsonSubmit"
            >确定</el-button
          >
          <el-button
            size="medium"
            type="danger"
            @click="importJsonVisible = false"
            >取消</el-button
          >
        </div>
      </el-drawer>

      <el-drawer
        title="生成JSON"
        :visible.sync="generateJsonVisible"
        size="50%"
        append-to-body
        destroy-on-close
      >
        <monaco-editor
          v-model="widgetFormPreview"
          keyIndex="generate"
          height="82%"
          :read-only="true"
          :options="{
            minimap: {
              enabled: false,
            },
          }"
        ></monaco-editor>
        <div class="drawer-foot">
          <el-button size="medium" type="primary" @click="handleGenerate"
            >生成</el-button
          >

          <el-popover placement="top" trigger="hover" width="350px">
            <el-form
              v-model="configOption"
              style="padding: 0 20px"
              label-suffix="："
              label-width="180px"
              label-position="left"
            >
              <el-form-item label="类型">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  content="复制json对象"
                  style="margin-right: 15px"
                >
                  <el-radio
                    slot="reference"
                    v-model="configOption.generateType"
                    label="json"
                    >json</el-radio
                  >
                </el-popover>
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  content="复制string字符串，可直接用于后端保存无需再次处理。"
                >
                  <el-radio
                    slot="reference"
                    v-model="configOption.generateType"
                    label="string"
                    >string</el-radio
                  >
                </el-popover>
              </el-form-item>
              <el-form-item label="缩进长度-空格数量">
                <el-slider
                  v-model="configOption.space"
                  show-stops
                  :marks="{ 1: '1', 2: '2', 3: '3', 4: '4' }"
                  :min="1"
                  :max="4"
                  :step="1"
                ></el-slider>
              </el-form-item>
              <el-form-item label="引号类型">
                <el-switch
                  v-model="configOption.quoteType"
                  active-value="single"
                  inactive-value="double"
                  active-text="单引号"
                  inactive-text="双引号"
                ></el-switch>
              </el-form-item>
              <el-form-item label="移除key的引号">
                <el-switch v-model="configOption.dropQuotesOnKeys"></el-switch>
              </el-form-item>
              <el-form-item label="移除数字字符串的引号">
                <el-switch
                  v-model="configOption.dropQuotesOnNumbers"
                ></el-switch>
              </el-form-item>
            </el-form>
            <el-button
              size="medium"
              type="primary"
              @click="handleCopy"
              slot="reference"
              style="margin-left: 10px"
              >复制</el-button
            >
          </el-popover>
        </div>
      </el-drawer>

      <el-drawer
        title="预览"
        :visible.sync="previewVisible"
        size="60%"
        append-to-body
        :before-close="handleBeforeClose"
      >
        <avue-form
          v-if="previewVisible"
          ref="form"
          class="preview-form"
          :option="widgetFormPreview"
          v-model="widgetModels"
          @submit="handlePreviewSubmit"
        >
        </avue-form>
        <div class="drawer-foot">
          <el-button size="medium" type="primary" @click="handlePreviewSubmit"
            >确定</el-button
          >
          <el-button size="medium" type="danger" @click="handleBeforeClose"
            >取消</el-button
          >
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import {
  saveFormDesigner,
  detailFormDesigner,
  getModelFieldsAndChildModels,
} from "@/api/tool/formDesigner";
import fields from "./fieldsConfig.js";
import beautifier from "./utils/json-beautifier";
import MonacoEditor from "./utils/monaco-editor";
import widgetEmpty from "./assets/widget-empty.png";
import history from "./mixins/history";
import { mapMutations } from "vuex";
import Draggable from "vuedraggable";
import WidgetForm from "./WidgetForm";
import FormConfig from "./FormConfig";
import WidgetConfig from "./WidgetConfig";
import func from "@/util/func";

export default {
  name: "FormDesign",
  components: { Draggable, MonacoEditor, WidgetForm, FormConfig, WidgetConfig },
  mixins: [history],
  props: {
    options: {
      type: [Object, String],
      default: () => {
        return {
          column: [],
        };
      },
    },
    storage: {
      type: Boolean,
      default: false,
    },
    asideLeftWidth: {
      type: [String, Number],
      default: "270px",
    },
    asideRightWidth: {
      type: [String, Number],
      default: "270px",
    },
    showGithubStar: {
      type: Boolean,
      default: true,
    },
    toolbar: {
      type: Array,
      default: () => {
        return ["import", "generate", "preview", "clear"];
      },
    },
    undoRedo: {
      type: Boolean,
      default: true,
    },
    includeFields: {
      type: Array,
      default: () => {
        const arr = [];
        fields.forEach((f) => {
          f.list.forEach((c) => {
            arr.push(c.type);
          });
        });
        return arr;
      },
    },
    customFields: {
      type: Array,
    },
    currentRow: Object,
  },
  watch: {
    options: {
      handler(val) {
        let options = val;
        if (typeof options == "string") {
          try {
            options = eval("(" + options + ")");
          } catch (e) {
            console.error("非法配置");
            options = { column: [] };
          }
        }
        this.transAvueOptionsToFormDesigner(options).then((res) => {
          this.widgetForm = { ...this.widgetForm, ...res };
        });
      },
      deep: true,
    },
  },
  computed: {
    leftWidth() {
      if (typeof this.asideLeftWidth == "string") {
        return this.asideLeftWidth;
      } else {
        return `${this.asideLeftWidth}px`;
      }
    },
    rightWidth() {
      if (typeof this.asideRightWidth == "string") {
        return this.asideRightWidth;
      } else {
        return `${this.asideRightWidth}px`;
      }
    },
  },
  data() {
    return {
      widgetEmpty,
      fields,
      originList: [],
      widgetForm: {
        column: [],
        mainModel: "",
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 120,
        gutter: 0,
        readonly: false,
        submitBtn: false,
        emptyBtn: false,
      },
      widgetFormPreview: {},
      configTab: "widget",
      layoutTab: "layout",
      widgetFormSelect: {},
      previewVisible: false,
      generateJsonVisible: false,
      importJsonVisible: false,
      importJson: {},
      widgetModels: {},
      configOption: {
        generateType: "json",
        space: 2,
        quoteType: "single",
        dropQuotesOnKeys: true,
      },
      history: {
        index: 0, // 当前下标
        maxStep: 20, // 最大记录步数
        steps: [], // 历史步数
      },
      currentIdx: 0,
      deviceList: [
        {
          name: "desktop",
          active: true,
          desc: "PC端",
        },
        {
          name: "mobile",
          active: false,
          desc: "移动端",
        },
      ],
      fieldList: [],
      modelFieldList: [],
      modelField: "",
    };
  },
  mounted() {
    this.handleLoadStorage();
  },

  created() {
    this.initFormDetailById();
  },
  methods: {
    ...mapMutations("FormDesign", ["SET_DEVICE"]),
    // 组件初始化时加载本地存储中的options(需开启storage),若不存在则读取用户配置的options

    // 根据ID获取 JSON
    async initFormDetailById() {
      const { data } = await detailFormDesigner(this.$route.query.id);
      let jsonText = data.data.formDesignerVO.jsonText;
      if (typeof jsonText == "string" && jsonText !== "") {
        this.transAvueOptionsToFormDesigner(jsonText).then((res) => {
          this.widgetForm = res;
        });
      }
      // this.widgetForm.mainModel = data.data.formDesignerVO.mainModel;

      setTimeout(() => {
        this.$set(
          this.widgetForm,
          "mainModel",
          data.data.formDesignerVO.mainModel
        );
      }, 100);

      console.log(data.data.formDesignerVO.mainModel, "mainModel");

      this.modelFieldList = [];

      getModelFieldsAndChildModels(data.data.formDesignerVO.mainModel).then(
        (res) => {
          this.fieldList = res.data.data;
          this.modelFieldList = [];

          let list = this.fields.map((e) => e.list);
          let flattenFieldsList = this._.flattenDeep(list);

          res.data.data.forEach((item) => {
            flattenFieldsList.forEach((e) => {

              if(item.formInputType === 'fileUpload'){
                item.formInputType = 'upload'
              }

              if (e.type === item.formInputType) {
                this.modelFieldList.push({
                  ...e,
                  type: item.formInputType,
                  prop: item.modelAndField,
                  dbFieldRemark: item.dbFieldRemark,
                  modelAndField: item.modelAndField,
                  label: item.dbFieldRemark,
                  precision: item.dbPointLength,
                  placeholder: item.formPlaceholder,
                });
              }
            });

            // console.log(item.dbFieldName);
            // this.fields[1].list.forEach((e) => {
            //   if (e.type === item.formInputType) {
            //     this.modelFieldList.push({
            //       ...e,
            //       type: item.formInputType,
            //       prop: item.modelAndField,
            //     });
            //   }
            // });
          });
        }
      );
    },

    async handleLoadStorage() {
      let options = this.options;
      if (typeof options == "string") {
        try {
          options = eval("(" + options + ")");
        } catch (e) {
          console.error("非法配置");
          options = { column: [] };
        }
      }
      if (!options.column) options.column = [];
      this.widgetForm = this.initHistory({
        index: 0,
        maxStep: 20,
        steps: [
          await this.transAvueOptionsToFormDesigner({
            ...this.widgetForm,
            ...options,
          }),
        ],
        storage: false,
      });

      if (this.undoRedo) {
        window.addEventListener(
          "keydown",
          (evt) => {
            // 监听 cmd + z / ctrl + z 撤销
            if (
              (evt.metaKey && !evt.shiftKey && evt.keyCode == 90) ||
              (evt.ctrlKey && !evt.shiftKey && evt.keyCode == 90)
            ) {
              this.widgetForm = this.handleUndo();
            }

            // 监听 cmd + shift + z / ctrl + shift + z / ctrl + y 重做
            if (
              (evt.metaKey && evt.shiftKey && evt.keyCode == 90) ||
              (evt.ctrlKey && evt.shiftKey && evt.keyCode == 90) ||
              (evt.ctrlKey && evt.keyCode == 89)
            ) {
              this.widgetForm = this.handleRedo();
            }
          },
          false
        );
      }
    },
    // 左侧字段点击
    handleFieldClick(item) {
      const activeIndex =
        this.widgetForm.column.findIndex(
          (c) => c.prop == this.widgetFormSelect.prop
        ) + 1;
      let newIndex = 0;
      if (activeIndex == -1) {
        this.widgetForm.column.push(item);
        newIndex = this.widgetForm.column.length - 1;
      } else {
        this.widgetForm.column.splice(activeIndex, 0, item);
        newIndex = activeIndex;
      }

      this.$refs.widgetForm.handleWidgetAdd({ newIndex });
    },
    // 预览 - 弹窗
    handlePreview() {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0)
        this.$notify.error({
          title: "没有需要展示的内容",
          showClose: false,
          duration: 2000,
        });
      else {
        this.transformToAvueOptions(this.widgetForm).then((data) => {
          console.log(data, "widgetFormPreview");
          this.widgetFormPreview = data;
          this.widgetFormPreview.column.forEach((col) => {
            this.avuecolTrans(col);
          });
          // 分组的转换
          (this.widgetFormPreview.group || []).forEach((group1) => {
            (group1.column || []).forEach((col) => {
              this.avuecolTrans(col);
            });
          });
          this.previewVisible = true;
          window.widgetForm = this.$refs.previewForm;
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
      delete col["addDisplay"];
      delete col["addDisabled"];
      delete col["editDisplay"];
      delete col["editDisabled"];
      delete col["viewDisplay"];
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
            this.widgetModels[col.prop] = colList;
          }
        }
        delete col.value;
      }
    },
    // 导入JSON - 弹窗 - 确定
    handleImportJsonSubmit() {
      try {
        this.transAvueOptionsToFormDesigner(this.importJson).then((res) => {
          this.widgetForm = res;
          this.importJsonVisible = false;
          this.handleHistoryChange(this.widgetForm);
        });
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    // 生成JSON - 弹窗
    handleGenerateJson() {
      this.transformToAvueOptions(this.widgetForm).then((data) => {
        this.widgetFormPreview = data;
        this.generateJsonVisible = true;
      });
    },
    // 生成JSON - 弹窗 - 确定
    handleGenerate() {
      this.transformToAvueOptions(this.widgetForm).then((data) => {
        if (
          this.configOption.generateType &&
          this.configOption.generateType == "string"
        )
          this.$emit(
            "submit",
            beautifier(data, {
              minify: true,
              ...this.configOption,
            })
          );
        else this.$emit("submit", data);
      });
    },
    // 生成JSON - 弹窗 - 拷贝
    handleCopy() {
      this.transformToAvueOptions(this.widgetForm).then((data) => {
        this.$Clipboard({
          text: beautifier(data, {
            minify: true,
            ...this.configOption,
          }),
        })
          .then(() => {
            this.$message.success("复制成功");
          })
          .catch(() => {
            this.$message.error("复制失败");
          });
      });
    },
    // 预览 - 弹窗 - 确定
    handlePreviewSubmit(form, done) {
      if (done) {
        this.$alert(this.widgetModels)
          .then(() => {
            done();
          })
          .catch(() => {
            done();
          });
      } else {
        this.$refs.form.validate((valid, done) => {
          if (valid)
            this.$alert(this.widgetModels)
              .then(() => {
                done();
              })
              .catch(() => {
                done();
              });
        });
      }
    },
    // 预览 - 弹窗 - 关闭前
    handleBeforeClose() {
      this.$refs.form.resetForm();
      this.widgetModels = {};
      this.previewVisible = false;
    },
    // 清空
    handleClear() {
      if (
        this.widgetForm &&
        this.widgetForm.column &&
        this.widgetForm.column.length > 0
      ) {
        this.$confirm("确定要清空吗？", "警告", {
          type: "warning",
        })
          .then(() => {
            this.$set(this.widgetForm, "column", []);
            this.$set(this, "widgetModels", {});
            this.$set(this, "widgetFormSelect", {});
            this.handleHistoryChange(this.widgetForm);
          })
          .catch(() => {});
      } else this.$message.error("没有需要清空的内容");
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
              [
                "checkbox",
                "radio",
                "tree",
                "cascader",
                "select",
                "userSelect",
                "multipleSelect",
              ].includes(col.type)
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
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
    // Avue配置项 转化为 表单设计器配置项
    transAvueOptionsToFormDesigner(obj) {
      if (typeof obj == "string") obj = eval("(" + obj + ")");
      const data = this.deepClone(obj);
      return new Promise((resolve, reject) => {
        try {
          if (data.column && data.column.length > 0) {
            data.column.forEach((col) => {
              if (
                col.type == "dynamic" &&
                col.children &&
                col.children.column &&
                col.children.column.length > 0
              ) {
                const c = col.children.column;
                c.forEach((item) => {
                  item.subfield = true;
                });
                this.transAvueOptionsToFormDesigner(col.children).then(
                  (res) => {
                    col.children = res;
                  }
                );
              } else if (
                ["checkbox", "radio", "tree", "cascader", "select"].includes(
                  col.type
                )
              ) {
                if (
                  !col.dicData &&
                  col.dicQuery &&
                  typeof col.dicQuery == "object"
                ) {
                  const arr = [];
                  for (let key in col.dicQuery) {
                    arr.push({
                      key,
                      value: col.dicQuery[key],
                      $cellEdit: true,
                    });
                  }
                  col.dicQueryConfig = arr;
                }
                if (col.dicUrl) col.dicOption = "remote";
                else col.dicOption = "static";
                if (!col.dicData) col.dicData = [];
              } else if (["upload"].includes(col.type)) {
                if (col.headers && typeof col.headers == "object") {
                  const arr = [];
                  for (let key in col.headers) {
                    arr.push({
                      key,
                      value: col.headers[key],
                      $cellEdit: true,
                    });
                  }
                  col.headersConfig = arr;
                } else col.headersConfig = [];

                if (col.data && typeof col.data == "object") {
                  const arr = [];
                  for (let key in col.data) {
                    arr.push({
                      key,
                      value: col.data[key],
                      $cellEdit: true,
                    });
                  }
                  col.dataConfig = arr;
                } else col.dataConfig = [];
              }
            });
          }
          if (data.group && data.group.length > 0) {
            for (let i = 0; i < data.group.length; i++) {
              if (!data.column) data.column = [];
              const col = data.group[i];

              const group = {
                type: "group",
                label: col.label,
                icon: col.icon,
                prop: col.prop,
                arrow: col.arrow,
                collapse: col.collapse,
                display: col.display,
              };
              this.transAvueOptionsToFormDesigner(col).then((res) => {
                group.children = res;
                data.column.push(group);
              });
            }
            delete data.group;
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
    async getData(type = "json") {
      if (type == "string")
        return beautifier(await this.transformToAvueOptions(this.widgetForm), {
          minify: true,
        });
      else return await this.transformToAvueOptions(this.widgetForm);
    },

    handleClose() {
      this.$emit("handleClose");
    },

    chooseDevice(icon, index) {
      this.currentIdx = index;
      this.SET_DEVICE(icon.name);
    },

    // 保存模型
    handleSubmit() {
      this.getData("string").then(async (res) => {
        const { data } = await saveFormDesigner({
          formDesignerVO: {
            id: this.$route.query.id,
            mainModel: this.widgetForm.mainModel,
            jsonText: res,
          },
        });
        if (data.code === 200) {
          this.$notify.success({
            title: data.msg,
            showClose: false,
            duration: 2000,
          });
        } else {
          this.$notify.error({
            title: data.msg,
            showClose: false,
            duration: 2000,
          });
        }
      });
    },

    uploadPreview(file, column, done) {
      console.log(file, column);
      done(); //默认执行打开方法
      this.$message.success("自定义查看方法,查看控制台");
    },

    // 搜索
    searchModelField() {
      let list = [];
      let search = this.modelField;
      if (search) {
        this.originList = this.modelFieldList.filter(function (item) {
          return Object.keys(item).some(function (key) {
            return String(item[key]).toLowerCase().indexOf(search) > -1;
          });
        });
      }
    },

    // 表单设计器配置项 转化为 Avue配置项
    transFormtoAvue(obj) {
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
              this.transFormtoAvue(col.children).then((res) => {
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
              this.transFormtoAvue(col.children).then((res) => {
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

            if (col.control) col.control = col.control;
            else delete col.control;

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
  },
};
</script>

<style lang="scss">
@import "./styles/index.scss";

.canvas {
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-bar {
  display: flex;
  align-items: center;

  .divider {
    border-left: 2px solid #eee;
    width: 1px;
    height: 25px;
    margin-left: 5px;
  }

  .tools {
    margin-left: 15px;
    display: flex;
    align-items: center;
    div {
      font-size: 20px;
      font-weight: 550;
    }
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #666;
    text-align: center;
    border-radius: 3px;
    margin-right: 5px;
    cursor: pointer;

    &.active {
      background: #e4e7ed;
      color: #409eff;
    }

    div {
      margin-left: 5px;
      font-size: 20px;
      font-weight: 550;
    }
  }
}

/deep/.el-notification > .el-notification__group > .el-notification__title {
  font-weight: 0 !important;
}
</style>
