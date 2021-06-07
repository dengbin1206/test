<template>
  <div>
      <avue-crud :table-loading="tableLoading" :data="tableData" :option="option" @current-change="currentChange"
      @size-change="sizeChange"  @selection-change="selectionChange" :page.sync="page"></avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          @click="submit"
        >确 定</el-button>
      </span>
  </div>
</template>

<script>
export default {
  props: ["data", "openTable"],
  data() {
    return {
      tableLoading: false,
      tableData: [],
      selectionList:[],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      option: {
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menu: false,
        border: true,
        tip: false,
        refreshBtn: false,
        columnBtn: false,
        index: true,
        selection: true,
        labelWidth: 120,
        loading: false,
        align: "center",
        dialogClickModal: false,
        column: []
      }
    };
  },
  watch: {
    data(val) {
      this.initData();
      this.getTableData()
    }
  },
  created() {
    console.log("select-table-created:"+JSON.stringify(data));
  },
  mounted() {},
  methods: {
    initData() {
      this.option.column= [];
      if (this.data.queryField.length > 0) {
        let arr = [
          { label: "名称", value: "name" },
          { label: "性别", value: "sex" },
          { label: "账号", value: "account" },
          { label: "员工编号", value: "code" }
        ];
        arr.forEach(ele => {
          this.data.queryField.forEach(el => {
            if (el == ele.value) {
              this.option.column.push({
                label: ele.label,
                search: true,
                prop: ele.value
              });
            }
          });
        });
      }
    },
     getTableData(){

        if(this.data.dicMethod && this.data.dicUrl){
            this.tableLoading = true;
            axios({
                url:this.data.dicUrl,
                methods:this.data.dicMethod
            }).then(res=>{
                if(res.data.code == 200){
                    this.tableData = res.data.data.records;
                    this.tableLoading = false;
                }
            })
        }
    },
    submit(){
       this.$emit("getQueryRow",this.selectionList)
    },
    //表格多选事件
    selectionChange(list) {
      this.selectionList = list;
    },
    cancel() {
      this.$emit("cancelQuery");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
