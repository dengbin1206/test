<template>
  <div>
    <h4 class="widget-form-group__head" v-show="column.label">
      <i
        :class="[
          column.icon && column.icon.includes('iconfont')
            ? `iconfont ${column.icon}`
            : column.icon,
        ]"
        v-show="column.icon"
        style="margin-right: 10px"
      ></i
      >{{ column.label }}
    </h4>
    <draggable
      class="widget-form-group__body"
      :list="column.children.column"
      :group="{ name: 'form' }"
      ghost-class="ghost"
      :animation="200"
      @add="handleWidgetGroupAdd($event, column)"
      @end="$emit('change')"
    >
      <template v-for="(item, groupIndex) in column.children.column">
        <div
          class="widget-form-table"
          v-if="item.type == 'dynamic'"
          :key="groupIndex"
          :class="{ active: selectWidget.prop == item.prop }"
          @click.stop="handleWidgetTableSelect(item)"
        >
          <widget-form-table
            :data="column.children"
            :column="item"
            :index="groupIndex"
            :select.sync="selectWidget"
            @change="$emit('change')"
          ></widget-form-table>
        </div>
        <el-col v-else :key="groupIndex" :md="size(item)" :xs="24">
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
    <div class="widget-view-action" v-if="selectWidget.prop == column.prop">
      <i
        class="el-icon-copy-document"
        @click.stop="handleWidgetCloneTable(index)"
      ></i>
      <i class="el-icon-brush" @click.stop="handleWidgetClear(index)"></i>
      <i class="el-icon-delete" @click.stop="handleWidgetDelete(index)"></i>
    </div>
  </div>
</template>
<script>
import WidgetFormItem from "./WidgetFormItem";
import WidgetFormTable from "./WidgetFormTable";
import draggable from "vuedraggable";

export default {
  name: "widget-form-group",
  props: ["data", "column", "select", "index"],
  components: { WidgetFormItem, WidgetFormTable, draggable },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.column[index];
    },
    handleWidgetClear(index) {
      this.data.column[index].children.column = [];
      this.selectWidget = this.data.column[index];

      this.$emit("change");
    },
    handleWidgetDelete(index) {
      if (this.data.column.length - 1 === index) {
        if (index === 0) this.selectWidget = {};
        else this.handleSelectWidget(index - 1);
      } else this.handleSelectWidget(index + 1);

      this.$nextTick(() => {
        this.data.column.splice(index, 1);
        this.$emit("change");
      });
    },
    handleWidgetCloneTable(index) {
      let cloneData = this.deepClone(this.data.column[index]);
      cloneData.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      cloneData.children.column.forEach((t) => {
        t.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      });
      this.data.column.splice(index, 0, cloneData);
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1);
        this.$emit("change");
      });
    },
    handleWidgetTableSelect(data) {
      this.selectWidget = data;
    },
    handleWidgetTableClone(column, item) {
      const data = this.deepClone(item);
      data.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      this.$set(column.children.column, column.children.column.length, {
        ...data,
      });
      this.$nextTick(() => {
        this.selectWidget =
          column.children.column[column.children.column.length - 1];
        this.$emit("change");
      });
    },
    handleWidgetTableDelete(column, index) {
      if (column.children.column.length - 1 == index) {
        if (index == 0) this.selectWidget = column;
        else this.selectWidget = column.children.column[index - 1];
      } else this.selectWidget = column.children.column[index + 1];
      this.$nextTick(() => {
        column.children.column.splice(index, 1);
        this.$emit("change");
      });
    },
    handleWidgetGroupAdd(evt, column) {
      let newIndex = evt.newIndex;
      const item = evt.item;
      if (newIndex == 1 && newIndex > column.children.column.length - 1)
        newIndex = 0;
      if (["分组"].includes(item.textContent)) {
        column.children.column.splice(newIndex, 1);
        return;
      }

      const data = this.deepClone(column.children.column[newIndex]);
      if (!data.prop)
        data.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      delete data.icon;
      if (data.type == "dynamic") data.span = 24;
      else data.span = 12;
      this.$set(column.children.column, newIndex, { ...data });
      this.selectWidget = column.children.column[newIndex];

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


<style lang="scss" scoped>
.widget-group-action-tool {
  position: absolute;
  right: 3px;
  bottom: 3px;
  border-bottom: none;
  border-right: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1001;
  padding: 3px;
  cursor: pointer;
}
</style>