<template>
  <div>
    <avue-input-table
      :props="item.children.column"
      :column="item"
      v-model="form"
      :on-load="onLoad"
      :formatter="formatter"
      placeholder="请选择数据"
    ></avue-input-table>
  </div>
</template>
<script>
import {getList} from "@/api/base/region";//国家
export default {
  name: "widget-input-table",
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
              label: "编码",
              prop: "code",
            },
            {
              label: "名称",
              width: 120,
              search: true,
              prop: "name",
            },            
          ],
        },
      },
      form: {},
      props: {
        label: "name",
        value: "code",
      },
      queryList: []
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
  methods: {
    formatter(row) {
      if(this.item.assRuleCode=='country'){
        console.log("input-table-formatter<=:"+JSON.stringify(row));
        if (!row.name) return "";
        return row.name + "-" + row.code;
      }
     return row;
    },
    onLoad({ page, value, data }, callback) {
      console.log("input-table-onLoad<=:");
      //首次加载去查询对应的值
      if (value) {
        console.log("input-table-data<=:首次查询");
        callback({
          name: "张三",
          code: "男",
        });
        return;
      }
      let query={
        //parentCode:'0' 
      }
     
      if (data) {
        console.log("input-table-data<=:" + JSON.stringify(data));
        if(this.item.assRuleCode=='country'){
          query.name=data.name
        }       
      }
      if (page) {
        console.log("input-table-page<=:" + JSON.stringify(page));
        console.log("input-table-page<=:" + JSON.stringify(this.item));
      }     
      if(this.item.assRuleCode=='country'){
        getList(page.currentPage,page.pageSize,query).then(res => {
          let arr = []
          console.log("input-table-getList<=:" + JSON.stringify(res.data.data.records));
          callback({
            total: res.data.data.records.length,
            data: res.data.data.records,
          });
        })
      }
      //分页查询信息
      
    },
  },
};
</script>