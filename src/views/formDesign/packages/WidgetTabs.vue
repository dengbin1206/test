<template>
  <div class="widget-tabs-content">
    <avue-tabs :option="column.option" @change="handleChange"> </avue-tabs>

    <template
      class="widget-tabs-wrap"
      v-for="(tab, index) in column.option.column"
    >
      <draggable
        :key="index"
        class="widget-form-group__body"
        style="margin-top: 10px"
        v-if="prop === tab.prop"
        :list="tab.formColumn"
        :group="{ name: 'form' }"
        ghost-class="ghost"
        :animation="200"
        @add="handleWidgetGroupAdd($event, column)"
        @end="$emit('change')"
      >
        <template v-for="(item, groupIndex) in tab.formColumn">
          <el-col :key="groupIndex" :md="size(item)" :xs="24">
            <el-form-item
              class="widget-form-group__item"
              :label="item.label"
              :prop="item.prop"
              :class="{
                active: selectWidget.prop == item.prop,
                required: item.required,
              }"
              @click.native.stop="handleWidgetTableSelect(item)"
            >
              <widget-form-item
                :item="item"
                :params="column.params"
              ></widget-form-item>
              <div
                :class="[
                  'widget-view-action-item',
                  `${
                    item.type === 'upload' || item.type === 'imgUpload'
                      ? 'spec-item'
                      : ''
                  }`,
                ]"
                v-if="selectWidget.prop == item.prop"
              >
                <i
                  class="el-icon-copy-document"
                  @click.stop="handleWidgetTableClone(column, item)"
                ></i>
                <i
                  class="el-icon-delete"
                  @click.stop="handleWidgetTableDelete(column, groupIndex)"
                ></i>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </draggable>
    </template>
  </div>
</template>

<script>
import WidgetFormItem from "./WidgetFormItem";
import WidgetFormTable from "./WidgetFormTable";
import draggable from "vuedraggable";

export default {
  name: "widget-tabs",
  props: ["data", "column", "select", "index"],
  components: { WidgetFormItem, WidgetFormTable, draggable },
  data() {
    return {
      selectWidget: this.select,
      prop: "tab1",
      tabIndex: 0,
    };
  },
  methods: {
    handleSelectWidget(index) {},
    handleWidgetClear(index) {},
    handleWidgetDelete(index) {},
    handleWidgetCloneTable(index) {},
    handleWidgetTableSelect(data) {
      this.selectWidget = data;
    },
    handleWidgetTableClone(column, item) {
      const data = this.deepClone(item);
      data.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      this.$set(
        column.option.column[this.tabIndex].formColumn,
        column.option.column[this.tabIndex].formColumn.length,
        {
          ...data,
        }
      );
      this.$nextTick(() => {
        this.selectWidget =
          column.option.column[this.tabIndex].formColumn[
            column.option.column[this.tabIndex].formColumn.length - 1
          ];
        this.$emit("change");
      });
    },
    handleWidgetTableDelete(column, index) {
      if (column.option.column[this.tabIndex].formColumn.length - 1 == index) {
        if (index == 0) this.selectWidget = column;
        else
          this.selectWidget =
            column.option.column[this.tabIndex].formColumn[index - 1];
      } else
        this.selectWidget =
          column.option.column[this.tabIndex].formColumn[index + 1];
      this.$nextTick(() => {
        column.option.column[this.tabIndex].formColumn.splice(index, 1);
        this.$emit("change");
      });
    },
    handleWidgetGroupAdd(evt, column) {
      let newIndex = evt.newIndex;
      const item = evt.item;

      console.log();
      if (
        newIndex == 1 &&
        newIndex > column.option.column[this.tabIndex].formColumn.length - 1
      ) {
        newIndex = 0;
      }

      const data = this.deepClone(
        column.option.column[this.tabIndex].formColumn[newIndex]
      );

      if (!data.prop)
        data.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      delete data.icon;
      if (data.type == "dynamic") data.span = 24;
      else data.span = 12;
      this.$set(column.option.column[this.tabIndex].formColumn, newIndex, {
        ...data,
      });
      this.selectWidget =
        column.option.column[this.tabIndex].formColumn[newIndex];

      this.$emit("change");
    },

    size(item) {
      if (
        [
          "textarea",
          "upload",
          "imgUpload",
          "url",
          "array",
          "img",
          "map",
          "color",
          "ueditor",
        ].includes(item.type)
      ) {
        return 24;
      } else {
        return 12;
      }
    },

    handleChange(tab) {
      this.prop = tab.prop;
      let tabList = this.column.option.column;
      this.tabIndex = this._.findIndex(tabList, { prop: tab.prop });
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
  },
};
</script>
