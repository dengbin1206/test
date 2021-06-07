<template>
  <div>
    <h4 class="widget-form-group__head" v-show="column.label">
      <i
        :class="column.icon"
        v-show="column.icon"
        style="margin-right: 10px"
      ></i
      >{{ column.label }}
    </h4>
      <template v-for="(item, groupIndex) in column.children.column">
        <div
          class="widget-form-table"
          v-if="item.type == 'dynamic'"
          :key="groupIndex"
          :class="{ active: selectWidget.prop == item.prop }"
          @click.stop="handleWidgetTableSelect(item)"
        >
          <widget-table
            :data="column.children"
            :column="item"
            :index="groupIndex"
            :select.sync="selectWidget"
            @change="$emit('change')"
          ></widget-table>
        </div>
        <div
          class="widget-form-table"
          v-if="item.type == 'crud'"
          :key="groupIndex"
        >
          <widget-table
            :data="column.children"
            :column="item"
            :index="groupIndex"
          ></widget-table>
        </div>
        <el-col
          v-else-if="column.type == 'tabs'"
          :key="groupIndex"
          :md="column.span || 12"
          :xs="24"
          :offset="column.offset || 0"
        >
          <el-tabs
            type="border-card"
            :tab-position="column.params.option.position"
            :class="{ active: selectWidget.prop == column.prop }"
          >
            <el-tab-pane
              :label="tab.label"
              v-for="(tab, i) in column.params.option.column"
              :key="i"
            >
              <div
                class="widget-form-group"
                style="min-height: 100px"
              >
                <widget-form-tabs
                  :data="column.children"
                  :column="item"
                  :index="groupIndex"
                >
                </widget-form-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col
          v-else
          :key="groupIndex"
          :md="item.span || 12"
          :xs="24"
          :offset="item.offset || 0"
        >
          <el-form-item
            class="widget-form-group__item"
            :label="item.label"
            :prop="item.prop"
          >
            <widget-item :item="item" :user="user" :params="column.params"></widget-item>
          </el-form-item>
        </el-col>
      </template>
  </div>
</template>
<script>
import WidgetItem from "./widgetItem";
import WidgetTable from "./widgetTable";

export default {
  name: "widget-form-group",
  props: ["data", "column", "user", "select", "index"],
  components: { WidgetItem, WidgetTable },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  created() {
    console.log('crt-group-item=>:' +JSON.stringify(this.column))
  },
  mounted() {
    console.log('mnt-group-item<=:' +this.column)
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