<template>
  <div class="form-designer">
    <div class="sx_form_header">
      <div class="headerLeft">
        <el-button
          size="small"
          icon="el-icon-document"
          type="primary"
          @click="save"
          >保存</el-button
        >
      </div>
      <div class="headerRight">
        <span style="color: rgba(0, 0, 0, 0.85); font-weight: 800; font-size: 14px">设计表单</span>
        <i style="cursor: pointer; margin-left: 10px; font-size: 16px" class="el-icon-close" @click="hide"></i>
      </div>
    </div>
    <el-container style="height: 100%; flex: 1; overflow: auto">
      <!-- 左侧字段 -->
      <el-aside :width="leftWidth">
        <div class="fields-list">
          <el-tabs v-model="configTab1" stretch>
            <el-tab-pane label="布局&控件" style="padding: 0 10px; overflow: auto">
              <div v-for="(field, index) in fields" :key="index">
                <template v-if="field.list.find((f) => includeFields.includes(f.type))" >
                  <div class="field-title">{{ field.title }}</div>
                  <draggable tag="ul"
                    :list="field.list"
                    :group="{ name: 'form', pull: 'clone', put: false }"
                    ghost-class="ghost"
                    :sort="false"
                  >
                    <template v-for="(item, index) in field.list">
                      <li class="field-label"
                        v-if="includeFields.includes(item.type)"
                        :key="index"
                      >
                        <a @click="handleFieldClick(item)">
                          <i class="icon iconfont" :class="item.icon"></i>
                          <span>{{ item.title }}</span>
                        </a>
                      </li>
                    </template>
                  </draggable>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane label="模型字段" style="padding: 0 10px">
              <div v-for="(field, index) in fields" :key="index">
                <template
                  v-if="field.list.find((f) => includeFields.includes(f.type))"
                >
                  <draggable
                    tag="ul"
                    :list="field.list"
                    :group="{ name: 'form', pull: 'clone', put: false }"
                    ghost-class="ghost"
                    :sort="false"
                  >
                    <template v-for="(item, index) in field.list">
                      <li
                        class="field-label"
                        v-if="includeFields.includes(item.type)"
                        :key="index"
                      >
                        <a @click="handleFieldClick(item)">
                          <i class="icon iconfont" :class="item.icon"></i>
                          <span>模型字段</span>
                        </a>
                      </li>
                    </template>
                  </draggable>
                </template>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-aside>
      <!-- 中间主布局 -->
      <el-container class="widget-container" direction="vertical">
        <el-header class="widget-container-header">
          <div>
            <template v-if="undoRedo">
              <el-button
                type="text"
                size="medium"
                icon="el-icon-refresh-left"
                :disabled="historySteps.index == 0"
                @click="widgetForm = handleUndo()"
                >撤销</el-button
              >
              <el-button
                type="text"
                size="medium"
                icon="el-icon-refresh-right"
                :disabled="historySteps.index == historySteps.steps.length - 1"
                @click="widgetForm = handleRedo()"
                >重做</el-button
              >
            </template>
          </div>
          <div style="display: flex; align-items: center">
            <!-- <iframe src="https://ghbtns.com/github-btn.html?user=sscfaith&repo=avue-form-design&type=star&count=true"
                    frameborder="0"
                    scrolling="0"
                    width="100"
                    height="20"
                    title="GitHub"
                    v-if="showGithubStar"></iframe>
            <el-button v-if="showAvueDoc"
                       type="text"
                       size="medium"
                       icon="el-icon-document"
            @click="handleAvueDoc">Avue文档</el-button>-->
            <el-button
              type="text"
              size="medium"
              icon="el-icon-upload2"
              @click="importJsonVisible = true"
              >导入JSON</el-button
            >
            <el-button
              type="text"
              size="medium"
              icon="el-icon-download"
              @click="handleGenerateJson"
              >生成JSON</el-button
            >
            <el-button
              type="text"
              size="medium"
              icon="el-icon-view"
              @click="handlePreview"
              >预览</el-button
            >
            <el-button
              class="danger"
              type="text"
              size="medium"
              icon="el-icon-delete"
              @click="handleClear"
              >清空</el-button
            >
          </div>
        </el-header>
        <el-main :style="{background:widgetForm.column.length == 0 ? `url(${widgetEmpty}) no-repeat 50%` : '',}">
          <widget-form
            ref="widgetForm"
            :data="widgetForm"
            :del="deleteFormField"
            :select.sync="widgetFormSelect"
            @change="handleHistoryChange(widgetForm)"
          ></widget-form>
        </el-main>
      </el-container>
      <!-- 右侧配置 -->
      <el-aside class="widget-config-container" :width="rightWidth">
        <el-tabs v-model="configTab" stretch>
          <el-tab-pane label="字段属性" name="widget" style="padding: 0 10px">
            <widget-config
              :data="widgetFormSelect"
              :field="widgetForm"
            ></widget-config>
          </el-tab-pane>
          <el-tab-pane
            label="表单属性"
            name="form"
            lazy
            style="padding: 0 10px"
          >
            <form-config
              :data="widgetForm"
              :select="widgetFormSelect"
            ></form-config>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <!-- 弹窗 -->
      <!-- 导入JSON -->
      <el-drawer
        title="导入JSON"
        :visible.sync="importJsonVisible"
        size="50%"
        append-to-body
        destroy-on-close
      >
        <v-json-editor
          v-model="importJson"
          :options="{ mode: 'code' }"
          height="82vh"
        ></v-json-editor>
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
      <!-- 生成JSON -->
      <el-drawer
        title="生成JSON"
        :visible.sync="generateJsonVisible"
        size="50%"
        append-to-body
        destroy-on-close
      >
        <v-json-editor
          v-model="widgetFormPreview"
          :options="{ mode: 'code' }"
          height="82vh"
        ></v-json-editor>
        <div class="drawer-foot" style="display: none">
          <el-button size="medium" type="primary" @click="handleGenerate"
            >生成</el-button
          >
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="popper-bo"
            width="250px"
          >
            <el-button
              size="medium"
              type="primary"
              slot="reference"
              @click="handleCopy"
              style="margin-left: 10px"
              >复制</el-button
            >
            <div>
              <el-form label-width="180px" label-position="left">
                <el-alert :closable="false">
                  在没有开启美化的情况下，当前编辑器内可见的文本，就是复制得到的内容。
                  <br />如有需要，您可以开启美化，然后选取适合自己的美化配置。
                  <a
                    href="https://www.npmjs.com/package/csvjson-json_beautifier"
                    target="_blank"
                    >参考资料</a
                  >
                </el-alert>
                <el-form-item label="是否开启美化">
                  <el-switch v-model="beautifierOptions.enabled" />
                </el-form-item>
                <el-form-item label="缩进长度-空格数量">
                  <el-slider
                    v-model="beautifierOptions.space"
                    show-stops
                    :marks="{ 1: '1', 2: '2', 3: '3', 4: '4' }"
                    :min="1"
                    :max="4"
                    :step="1"
                  ></el-slider>
                </el-form-item>
                <el-form-item label="引号类型">
                  <el-switch
                    v-model="beautifierOptions.quoteType"
                    active-value="single"
                    inactive-value="double"
                    active-text="单引号"
                    inactive-text="双引号"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="移除key的引号">
                  <el-switch
                    v-model="beautifierOptions.dropQuotesOnKeys"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="移除数字字符串的引号">
                  <el-switch
                    v-model="beautifierOptions.dropQuotesOnNumbers"
                  ></el-switch>
                </el-form-item>
              </el-form>
            </div>
          </el-popover>
        </div>
      </el-drawer>
      <!-- 预览 -->
      <el-drawer
        title="预览"
        :visible.sync="previewVisible"
        size="60%"
        append-to-body
        :before-close="handleBeforeClose"
      >
          <form-view v-if="previewVisible" :data="widgetFormPreview"></form-view>
            <div class="drawer-foot">
              <el-button size="medium" type="primary" @click="handlePreviewSubmit"
              >确定</el-button
            >
              <el-button size="medium" type="danger" @click="handleBeforeClose"
              >取消</el-button
            >
          </div>
      </el-drawer>
      <!--
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
          class="preview-form "
          :custom-fields="customFields"
          :option="widgetFormPreview"
          v-model="widgetModels"
          @submit="handlePreviewSubmit"
        >
          <template slot-scope="scope" slot="tabs">
            <el-tabs @tab-click="changeTab(scope)" :tab-position="scope.column.params.option.position" type="border-card" v-model="scope.value" >
              <el-tab-pane v-for="item in scope.column.params.option.column" :label="item.label" :name="item.prop">
                <el-col v-for="data in item.children.column" :span="data.span" >
                  <el-form-item :label="data.label" :label-width="data.labelWidth">
                    <widget-form-item  :item="data" :params="data.params"></widget-form-item>
                  </el-form-item>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </template>
          <template slot-scope="scope" slot="title">
            <el-col :span="scope.column.span" :style="scope.column.styles">
              <div> <i :class="scope.column.icon"></i> {{scope.value}} </div>
            </el-col>
          </template>
          <template slot-scope="scope" slot="table">
            <el-input :placeholder="'请选择'+scope.column.label" readonly v-model="widgetModels[scope.column.prop]">
              <el-button
                    slot="append"
                    @click="open(scope.column)"
                  >选择</el-button>
            </el-input>-->
              <!-- <select-table  :data="scope.column" :open-table="openDialog" @cancelQuery="cancelQuery" @getQueryRow="getQueryRow"></select-table> -->
            <!-- <avue-input-table :props="propsTable" :column="scope.column.children"  :on-load="onLoadTable(scope.column.dicUrl,scope.column.dicMethod)" v-model="scope.column.prop" :placeholder="'请选择'+scope.column.label"></avue-input-table> -->
          <!--</template>
        </avue-form>
        <div class="drawer-foot">
          <el-button size="medium" type="primary" @click="handlePreviewSubmit"
            >确定</el-button
          >
          <el-button size="medium" type="danger" @click="handleBeforeClose"
            >取消</el-button
          >
        </div>
      </el-drawer>-->
     <select-table  ref="selectTable"  :data="selectData" :open-table="openDialog" @cancelQuery="cancelQuery" @getQueryRow="getQueryRow"></select-table>
    </el-container>
  </div>
</template>

<script>
import fields from "../fieldsConfig";
import { stringify } from "../utils";
import beautifier from "../utils/json-beautifier";
import widgetEmpty from "../assets/widget-empty.png";
import history from "../mixins/history";
import formView from "@/components/formView/formView";
import WidgetFormItem from '../WidgetFormItem'
import Draggable from "vuedraggable";
//import VJsonEditor from "v-jsoneditor";
import WidgetForm from "../WidgetForm";
import FormConfig from "../FormConfig";
import WidgetConfig from "../WidgetConfig";
import { saveOrUpdateDesign,getCity } from "@/api/tool/form";
import getLocation from "@/utils/getlocation";
import SelectTable from "./selectTable"
export default {
  name: "FormDesign",
  //components: { formView, Draggable, VJsonEditor, WidgetForm, FormConfig, WidgetConfig,WidgetFormItem,SelectTable },
  components: { formView, Draggable, WidgetForm, FormConfig, WidgetConfig,WidgetFormItem,SelectTable },
  mixins: [history],
  props: {
    options: {
      type: Object,
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
      default: "380px",
    },
    showAvueDoc: {
      type: Boolean,
      default: false,
    },
    showGithubStar: {
      type: Boolean,
      default: true,
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
    rowData: {
      type: Object,
    },
    formData: {
      type: Object,
    },
  },
  watch: {
    beautifierOptions: {
      handler(val) {
        if (this.storage) {
          localStorage.setItem(
            "avue-form-beautifier-options",
            JSON.stringify(val)
          );
        }
      },
      deep: true,
    },
    options: {
      handler(val) {
        this.transAvueOptionsToFormDesigner(val).then((res) => {
          this.widgetForm = { ...this.widgetForm, ...res };
          console.log(this.widgetForm);
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
      propsTable: {
          label: 'name',
          value: 'id'
        },
      showTable:false,
      openDialog:false,
      selectData:{},//用户选择器
      formModelList: [],
      widgetEmpty,
      customFields: [
        {
          component: 'el-alert',
          label: '警告',
          span: 24,
          icon: 'el-icon-search',
          params: { // 组件的属性
            title: '标题标题标题标题标题标题标题',
            type: 'success'
          },
          event: { // 组件的事件
            close: () => {
              console.log('111')
            }
          }
        }
      ],
      fields,
      deleteFormField: [],
      widgetForm: {
        column: [],
        detail: 0,
        disabled: 0,
        emptyBtn:1,
        emptyText: "清空",
        gutter: 0,
        labelPosition: "left",
        labelSuffix: "：",
        labelWidth: 100,
        menuBtn: 1,
        menuPosition: "center",
        modelId: "",
        modelData: [],
        modelIdData: [],
        readonly: 0,
        submitBtn:1,
        submitText: "提交",
        tabs: false
      },
      widgetFormPreview: {},
      configTab: "widget",
      widgetFormSelect: {},
      previewVisible: false,
      generateJsonVisible: false,
      importJsonVisible: false,
      importJson: {},
      widgetModels: {},
      configOption: {},
      beautifierOptions: {
        enabled: false,
        space: 2,
        quoteType: "single",
        dropQuotesOnKeys: Boolean,
        dropQuotesOnNumbers: Boolean,
      },
      history: {
        index: 0, // 当前下标
        maxStep: 20, //
        steps: [], // 历史步数
      },
    };
  },
  mounted() {
    this.handleLoadStorage();
    this.loadBeautifierOptions();
    this.handleLoadCss();
    window.$bus.$on('changeValue',(fn)=>{
      fn(this.widgetFormPreview.column,this.widgetModels,(obj)=>{
        this.widgetModels = obj;
      });
    })
  },
  beforeDestroy() {
    window.$bus.$off('changeValue');
  },
  methods: {
    open(row){
         this.selectData = row;
         this.openDialog = true;
    },
    cancelQuery() {
      this.openDialog = false;
    },
    getQueryRow(data){
      console.log(data)
      let arr = [];
      data.forEach(ele=>{
       arr.push(ele.name)
      })
      arr.join(",")
    let field = this.widgetFormSelect.prop;
    this.$set(this.widgetModels,field,arr)
       this.openDialog = false;
    },
    changeTab(col){
      col.column.change && col.column.change();
    },
    toBoole(num){
      return num == 1
    },
    // 组件初始化时加载本地存储中的options(需开启storage),若不存在则读取用户配置的options
    async handleLoadStorage() {
      this.widgetForm = this.initHistory({
        index: 0,
        maxStep: 20,
        steps: [
          await this.transAvueOptionsToFormDesigner({
            ...this.widgetForm,
            ...this.options,
            tabs: false,
          }),
        ],
        storage: this.storage,
      });
      // window.$bus.$emit('getFormData',this.widgetForm )

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
    // 获取JSON格式化属性
    loadBeautifierOptions() {
      const bo = localStorage.getItem("avue-form-beautifier-options");
      if (bo) this.beautifierOptions = JSON.parse(bo);
    },
    // 加载icon
    handleLoadCss() {
      const head = document.getElementsByTagName("head")[0];
      const script = document.createElement("link");
      script.rel = "stylesheet";
      script.type = "text/css";
      script.href = "https://at.alicdn.com/t/font_1254447_zc9iezc230c.css";
      head.appendChild(script);
      // this.loadScript('css', 'https://at.alicdn.com/t/font_1254447_zc9iezc230c.css')
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
        // console.log(this.widgetForm)

      // window.$bus.$emit('getFormData',this.widgetForm)

      this.$refs.widgetForm.handleWidgetAdd({ newIndex });
    },
    handlePreview() {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0)
        this.$message.error("没有需要展示的内容");
      else {
        this.transformToAvueOptions(this.widgetForm).then((data) => {
          let obj = this.deepClone(data);
          delete obj.modelData;
          delete obj.modelIdData;
          delete obj.modelId;

          obj.tabs = obj.tabs == 1;
          this.widgetFormPreview = obj;
          // 预览
          window.windowSelect = obj;
          console.log(obj)
          this.previewVisible = true;
        });
      }
    },
    // 预览 - 弹窗
    handlePreview1() {
      if (!this.widgetForm.column || this.widgetForm.column.length == 0)
        this.$message.error("没有需要展示的内容");
      else {
        // console.log("-------------------------");
        // console.log(this.widgetForm);
        this.transformToAvueOptions(this.widgetForm).then((data) => {
          let obj = this.deepClone(data);
          delete obj.modelData;
          delete obj.modelIdData;
          delete obj.modelId;
          // delete obj.detail;
          // delete obj.readonly;
          // delete obj.disabled;
          // obj.detail=false;
          // obj.readonly=false;
          // obj.disabled=false;
          obj.tabs = obj.tabs == 1;
          this.widgetFormPreview = obj;
          // 预览
          window.windowSelect = obj;
          console.log(obj)
          // console.log(window.windowSelect)
          this.previewVisible = true;
        });
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
        this.$emit("submit", data);
      });
    },
    // 生成JSON - 弹窗 - 拷贝
    handleCopy() {
      this.transformToAvueOptions(this.widgetForm).then((data) => {
        let text;
        if (this.beautifierOptions.enabled)
          text = beautifier(data, this.beautifierOptions);
        else text = stringify(data);

        this.$Clipboard({
          text,
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
          .catch(() => {});
      } else {
        this.$refs.form.validate((valid, done) => {
          if (valid)
            this.$alert(this.widgetModels)
              .then(() => {
                done();
              })
              .catch(() => {});
        });
      }
    },
    // 预览 - 弹窗 - 关闭前
    handleBeforeClose() {
      //this.$refs.form.resetForm();
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
            } else if (["upload"].includes(col.type)) {
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
            }else if(col.type == 'map'){
              if(col.value){
                let location = eval(col.value)
                this.$set(this.widgetModels,col.prop,location);
                col.value = location;
                col.params.params.center = location;
              }
              if(col.defaultLocation){
                getLocation((mydata)=>{
                  col.value = [mydata.position.R,mydata.position.Q,mydata.formattedAddress];
                  this.$set(this.widgetModels,col.prop,[mydata.position.R,mydata.position.Q,mydata.formattedAddress]);
                  this.widgetFormPreview.column[i].params.params.center = [mydata.position.R,mydata.position.Q]
                });
              }
            }else if(['tabs','button'].includes(col.type)) {
              col.event = {};
              if (col.change) {
                col.event.change = eval(col.change );
              }
              if (col.click){
                col.event.click = eval(col.click);
              }
              if(col.type == 'tabs'){
                 col.value = col.params.option.column[0].prop;
                 for(let j = 0;j < col.params.option.column.length;j++){
                   this.transformToAvueOptions(col.params.option.column[j].children).then(res=>{
                     col.params.option.column[j].children = res;
                     for(let k = 0;k < col.params.option.column[j].children.column.length;k++){
                       let demodata = col.params.option.column[j].children.column[k];
                       if(demodata.type2 && demodata.type2 == '省市级'){
                          setTimeout(()=>{
                            getCity({dataLevel:demodata.dataLevel}).then(res=>{
                              this.widgetFormPreview.column[i].params.option.column[j].children.column[k].dicData = res.data.data
                            })
                          },1000)
                       }
                     }
                   });
                 }
              }
            }
            if (col.change) col.change = eval(col.change);
            else delete col.change;

            if (col.click) col.click = eval(col.click);
            else delete col.click;

            if (col.focus) col.focus = eval(col.focus);
            else delete col.focus;

            if (col.blur) col.blur = eval(col.blur);
            else delete col.blur;
            if(col.hasOwnProperty('disabled')){
              col.disabled = this.toBoole(col.disabled)
            }
            if(col.hasOwnProperty('readonly')){
              col.readonly = this.toBoole(col.readonly)
            }
            if(col.hasOwnProperty('hideLabel')) {
              col.hideLable = this.toBoole(col.hideLable);
              if(col.hideLable){
                col.labelWidth = '0px';
                col.label = '';
              }
            }
            if(col.type2 && col.type2 == '省市级'){
              getCity({dataLevel:col.dataLevel}).then(res=>{
                col.dicData = res.data.data;
                this.widgetFormPreview.column[i].dicData = res.data.data
              })
            }
          }
          data.readonly = this.toBoole(data.readonly);
          data.disabled = this.toBoole(data.disabled);
          data.emptyBtn = this.toBoole(data.emptyBtn);
          data.detail = this.toBoole(data.detail);
          data.menuBtn = this.toBoole(data.menuBtn);
          data.submitBtn = this.toBoole(data.submitBtn);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
    // Avue配置项 转化为 表单设计器配置项
    transAvueOptionsToFormDesigner(obj) {
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
    //保存
    save() {
      let fieldArr = []
      console.log("save=>"+this.widgetForm.column);
      // console.log("this.widgetForm.modelId");
      // console.log(this.widgetForm.modelId + "--");
      if (!this.widgetForm.modelId) {
         this.$message.warning("请填写模型和模型字段");
         return;
      }
      for (let i = 0; i < this.widgetForm.column.length; i++) {
        let fieldItem={
          widgetLevel:1,
          type:this.widgetForm.column[i].type,
          fieldId:this.widgetForm.column[i].fieldId,
          editorId:this.widgetForm.column[i].prop
           //jsonText:JSON.stringify(this.widgetForm.column[i])
        };
        //处理group开始
        if(this.widgetForm.column[i].type=='group'){
          console.log("group:"+JSON.stringify(this.widgetForm.column[i]));
          //let subFieldArr = []
          if(this.widgetForm.column[i].children&&this.widgetForm.column[i].children!= undefined){
            let subFieldArr=this.deepClone(this.widgetForm.column[i].children);
            let subFieldRes = [];
            for(let j = 0; j < subFieldArr.column.length; j++){
              console.log("subField-type:"+subFieldArr.column[j].type);
              let subFieldItem={
                  widgetLevel:2,
                  parent:this.widgetForm.column[i].prop,
                  type:subFieldArr.column[j].type,
                  fieldId:subFieldArr.column[j].fieldId,
                  editorId:subFieldArr.column[j].prop
                };
                subFieldItem.fieldName= subFieldArr.column[j].fieldName
                subFieldItem.assignType=subFieldArr.column[j].assignType
                if(subFieldArr.column[j].assignType){
                  if (subFieldArr.column[j].assignType == "ass_static"){//静态赋值
                      subFieldItem.assRuleCode=''
                      subFieldItem.staticVal=subFieldArr.column[j].value
                  }else if (subFieldArr.column[j].assignType == "ass_rule"){//规则赋值
                      subFieldItem.assRuleCode=subFieldArr.column[j].assRuleCode
                  }
                }
                subFieldItem.jsonText=JSON.stringify(subFieldArr.column[j])
                subFieldRes.push(subFieldItem);
                if(!['省市级'].includes(subFieldArr.column[j].type2 || '') && !['group','tabs','crud','mybutton','title','warning','divider'].includes(this.widgetForm.column[i].type)&& !['el-button'].includes(this.widgetForm.column[i].component)){
                  if (
                    !subFieldArr.column[j].fieldId ||
                    subFieldArr.column[j].fieldId == undefined
                  ) {
                    this.$message.warning("["+this.widgetForm.column[i].type+"]请填写模型和模型字段");
                    return;
                  }
                }
            }
            fieldItem.children={};
            fieldItem.children.column=subFieldRes;
            fieldItem.jsonText=JSON.stringify(this.widgetForm.column[i])
            fieldArr.push(fieldItem);
          }
        }else{//处理group结束
         /*
         if(this.widgetForm.column[i].type=='button'){
          console.log("button-click:"+JSON.stringify(this.widgetForm.column[i].click));
          this.widgetForm.column[i].click='';
          this.widgetForm.column[i].params='';
         }else if(this.widgetForm.column[i].type=='tabs'){
          this.widgetForm.column[i].change='';
          this.widgetForm.column[i].params='';
         }*/
         fieldItem.fieldName= this.widgetForm.column[i].fieldName,
         fieldItem.assignType=this.widgetForm.column[i].assignType
          if(!fieldItem.assignType){
            if (fieldItem.assignType == "ass_static"){//静态赋值
                fieldItem.assRuleCode=''
                fieldItem.staticVal=fieldItem.value
            }else if (fieldItem.assignType == "ass_rule"){//规则赋值
                fieldItem.assRuleCode=this.widgetForm.column[i].assRuleCode
            }
          }
         fieldItem.jsonText=JSON.stringify(this.widgetForm.column[i])
         fieldArr.push(fieldItem);
         if(!['省市级'].includes(this.widgetForm.column[i].type2 || '') && !['group','tabs','crud','mybutton','title','warning','divider'].includes(this.widgetForm.column[i].type)&& !['el-button'].includes(this.widgetForm.column[i].component)){
           if (
             !this.widgetForm.column[i].fieldId ||
             this.widgetForm.column[i].fieldId == undefined
           ) {
             this.$message.warning("["+this.widgetForm.column[i].type+"]请填写模型和模型字段");
             return;
           }
         }
        }
      }
      //console.log("fieldArr:"+JSON.stringify(fieldArr));
      //this.widgetForm.jsonText = JSON.stringify(this.widgetForm);
      this.widgetForm.formCode = this.rowData.formCode;
      this.widgetForm.formName = this.rowData.formName;
      this.widgetForm.id = this.rowData.id;
      this.widgetForm.column.forEach((ele) => {
        ele.editorId = ele.prop;
        ele.editorType = ele.type;
      });
      const formVoObj = this.deepClone(this.widgetForm);
      formVoObj.column={};
      formVoObj.jsonText=JSON.stringify(this.widgetForm);
      let formConfigDTO = {
        delFormFieldVOList: this.deleteFormField,
        formModelVOList: [],
        formFieldVOList: fieldArr,//this.widgetForm.column,
        formVO: formVoObj,
      };
      //console.log("formConfigDTO:"+JSON.stringify(formConfigDTO));
      saveOrUpdateDesign(formConfigDTO).then((res) => {
        if (res.data.code == 200) {
          this.$nextTick(() => {
            this.$message.success("操作成功");
            this.hide();
          });
        }
      });
    },
    // 关闭设计表单弹框
    hide() {
      this.widgetForm.column = [];
      this.widgetFormSelect = {};
      this.deleteFormField = [];
      this.widgetForm.modelData = [];
      this.widgetForm.modelId = "";
      this.$emit("close");
    },
    //通过点击设计表单进入详情
    getList() {
      this.$nextTick(() => {
        const obj = this.formData;
        console.log(obj);
        Object.keys(this.widgetForm).forEach((key) => {
          if (key == "column") {
            if (obj.formVO.jsonText == "") {
              this.widgetForm[key] = [];
            } else {
              this.widgetForm[key] = JSON.parse(obj.formVO.jsonText).column;
            }
          } else {
            if (obj.formVO[key]) {
              this.widgetForm[key] = obj.formVO[key];
            }
          }
        });
        if (obj.formVO.modelId) {
          this.widgetForm.modelIdData = [
            { id: obj.formVO.modelId, tableRemark: obj.formVO.modelName },
          ];
        } else {
          this.widgetForm.modelIdData = [];
        }
        // console.log(this.widgetForm);
        if (this.widgetForm.modelId) {
          this.$refs.widgetForm.findFields(0);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "../../styles/form.scss";
.form-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sx_form_header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ccc;
  .headerLeft {
    float: left;
    line-height: 50px;
    padding: 0 30px;
  }
  .headerRight {
    float: right;
    line-height: 50px;
    padding: 0 30px;
  }
}

</style>
<style scoped >
  .form-designer .widget-config-container .el-tabs__header {
    width: 100%;
  }
</style>
