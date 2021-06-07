<template>
  <div>
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
        <draggable class="widget-form-group__body"
               :list="tab.children.column"
               :group="{ name: 'form' }"
               ghost-class="ghost"
               :animation="200"
               @add="handleWidgetGroupAdd($event, tab)"
               @end="$emit('change')">
          <template v-for="(item, itemIndex) in tab.children.column">        
          <el-col :key="itemIndex"
                  :md="item.span || 12"
                  :xs="24"
                  :offset="item.offset || 0">
            <el-form-item class="widget-form-group__item"
                          :label-width="item.labelWidth"
                          :label="item.label"
                          :prop="item.prop"
                          :class="{ active: selectWidget.prop == item.prop, 'required': item.required }"
                          @click.native.stop="handleWidgetTableSelect(item)">
              <widget-form-item :item="item"
                                :params="column.params"></widget-form-item>
              <el-button title="删除"
                        @click.stop="handleWidgetTableDelete(column, groupIndex)"
                        class="widget-form-group__item--delete"
                        v-if="selectWidget.prop == item.prop"
                        circle
                        plain
                        type="danger">
                <i class="iconfont icon-delete"></i>
              </el-button>
              <el-button title="复制"
                        @click.stop="handleWidgetTableClone(column, groupIndex)"
                        class="widget-form-group__item--clone"
                        v-if="selectWidget.prop == item.prop"
                        circle
                        plain
                        type="primary">
                <i class="iconfont icon-copy"></i>
              </el-button>
            </el-form-item>
          </el-col>
          </template>
        </draggable>
      </el-tab-pane>
    </el-tabs> 
    
    <el-button title="删除"
               @click.stop="handleWidgetDelete(index)"
               class="widget-action-delete"
               v-if="selectWidget.prop == column.prop"
               circle
               plain
               size='small'
               type="danger">
      <i class="iconfont icon-delete"></i>
    </el-button>
    <el-button title="清空"
               @click.stop="handleWidgetClear(index)"
               class="widget-action-clear"
               v-if="selectWidget.prop == column.prop"
               circle
               plain
               size='small'
               type="warning">
      <i class="iconfont icon-clear"></i>
    </el-button>
    <el-button title="复制"
               @click.stop="handleWidgetCloneTable(index)"
               class="widget-action-clone"
               v-if="selectWidget.prop == column.prop"
               circle
               plain
               size='small'
               type="primary">
      <i class="iconfont icon-copy"></i>
    </el-button>
  </div>
</template>
<script>
import WidgetFormItem from "./WidgetFormItem";
import draggable from "vuedraggable";
export default {
  name: "widget-form-tabs",
  props: ["data", "column", "select", "index"],
  components: { WidgetFormItem,  draggable },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  created: function() {
    console.log('tabs-create=>:' +JSON.stringify(this.column))
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.column[index];
    },
    handleWidgetClear (index) {
      this.data.column[index].children.column = []
      this.selectWidget = this.data.column[index]
      this.$emit("change")
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
    handleWidgetTableSelect (data) {
      this.selectWidget = data
      console.log(this.selectWidget)
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