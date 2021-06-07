<template>
  <div>
    <avue-input-table
      :props="column.children.column"
      :column="column"
      v-model="form"
      :on-load="onLoad"
      placeholder="请选择数据"
    ></avue-input-table>
  </div>
</template>
<script>
export default {
  name: "widget-form-item",
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      column: {
        children: {
          border: true,
          column: [
            {
              label: "姓名",
              width: 120,
              search: true,
              prop: "name",
            },
            {
              label: "性别",
              search: true,
              prop: "sex",
            },
          ],
        },
      },
      form: {},
      props: {
        label: "name",
        value: "code",
      },
      queryList:[]
    };
  },
  onLoad: function () {
    console.log("input-table-onLoad=>:");
  },
  created: function () {
    console.log("input-table-create=>:" + JSON.stringify(this.item));
  },
  mounted() {
    console.log("input-table-mounted<=:" + JSON.stringify(this.item));
  },
  methods: {/*
    formatter(row) {
      if (!row.name) return "";
      return row.name + "-" + row.sex;
    },
    onLoad({ page, value, data }, callback) {
        console.log("input-table-onLoad<=:");
      //首次加载去查询对应的值
      if (value) {
        console.log("input-table-data<=:首次查询");
        callback({
          id: "0",
          name: "张三",
          sex: "男",
        });
        return;
      }
      if (data) {
        console.log("input-table-data<=:" + data);
      }
      if (page) {
        console.log("input-table-page<=:" + page);
      }
      //分页查询信息
      callback({
        total: 2,
        data: [
          {
            id: "0",
            name: "张三",
            sex: "男",
          },
          {
            id: "1",
            name: "李四",
            sex: "女",
          },
        ],
      });
    },*/
  },
};
</script>