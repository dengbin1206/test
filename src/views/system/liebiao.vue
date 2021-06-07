<template>
  <basic-container>
    <avue-crud :data="data" ref="crud" :option="option">
      <template slot-scope="scope" slot="menuLeft">
        <el-button type="danger" icon="el-icon-plus" size="small" plain @click.stop="handleAdd()">新增</el-button>
      </template>
    </avue-crud>
      <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%"
  append-to-body
  :before-close="handleClose">
  <ceshi></ceshi>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" type="primary" @click="submitProcess">保存并提交流程</el-button>
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
  </span>
</el-dialog>
  </basic-container>
</template>

<script>
import ceshi from '../flow/ceshi';
export default {
    components:{
        ceshi
    },
  data() {
    return {
      dialogVisible:false,
      data: [
        {
          name: "张三",
          sex: "男",
          date: "1994-02-23 00:00:00"
        },
        {
          name: "李四",
          sex: "女",
          date: "1994-02-23 00:00:00"
        },
        {
          name: "王五",
          sex: "女",
          date: "1994-02-23 00:00:00"
        },
        {
          name: "赵六",
          sex: "男",
          date: "1994-02-23 00:00:00"
        }
      ],
      option: {
        addBtn:false,
        menu: false,
        tip: false,
        refreshBtn: false,
        columnBtn: false,
        title: "表格的标题",
        page: false,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "姓名",
            prop: "name"
          },
          {
            label: "性别",
            prop: "sex"
          },
          {
            label: "日期",
            prop: "date",
            type: "date",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss"
          }
        ]
      }
    };
  },
  methods:{
      handleAdd(){
           this.dialogVisible = true;
      }
  }
};
</script>

<style scoped>
</style>