<template>
  <div>
    <h3 style="margin: 10px" v-show="column.label">{{ column.label }}</h3>
    <template v-if="column.params.option.column.length > 0">
      <div class="widget-form-table__item">
        <el-table
          ref="singleTable"
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="column.params.data"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            v-for="(item, tableIndex) in column.params.option.column"
            :key="tableIndex"
            :prop="item.prop"
            :label="item.label"
            :align="column.params.option.align"
            width="180"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration"></span>
          <el-pagination
            layout="prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5,10,15]"
            :page-size="pagesize"
            :total="column.params.data.length"
          >
          </el-pagination>
        </div>
      </div>
    </template>
    <template v-else>
      <avue-empty
        size="50"
        style="width: 100%"
        desc="拖拽字段至此"
      ></avue-empty>
    </template>
  </div>
</template>
<script>

export default {
  name: "widget-form-table",
  props: ["data", "column", "select", "index"],
  components: {  },
  data() {
    return {
      selectWidget: this.select,
      currentRow: null
    };
  },
  mounted() {
    console.log("mounted-crud<=::" + JSON.stringify(this.column));
  },
  methods: {
    handleCurrentChange(val) {
      console.log("crud-click<=::" + JSON.stringify(val));
      //this.currentRow = val;
      if(val){
        window.$bus.$emit("currentRow", val);
      }      
    },
    colClick (row, event) {
      console.log("crud-click<=::" + JSON.stringify(row));
      this.$refs.crud.rowEdit(row,row.$index);
    },
    handleSelectionChange(val) {
      console.log("crud-click<=::" + JSON.stringify(val));
      this.multipleSelection = val;
    },
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
    handleWidgetTableAdd(evt, column) {
      let newIndex = evt.newIndex;
      const item = evt.item;

      if (newIndex == 1 && newIndex > column.children.column.length - 1)
        newIndex = 0;
      if (
        ["子表单", "富文本", "坐标拾取器", "分组"].includes(item.textContent)
      ) {
        column.children.column.splice(newIndex, 1);
        return;
      }

      const data = this.deepClone(column.children.column[newIndex]);
      if (!data.prop)
        data.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      data.subfield = true;
      delete data.icon;
      this.$set(column.children.column, newIndex, { ...data });
      this.selectWidget = column.children.column[newIndex];

      this.$emit("change");
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
