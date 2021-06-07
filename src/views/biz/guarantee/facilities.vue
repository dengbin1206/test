<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud :option="option"
                    :table-loading="loading"
                    :data="data"
                    :page="page"
                    @row-del="rowDel"
                    ref="crud"
                    @row-update="rowUpdate"
                    @row-save="rowSave"
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    :cell-style="cellStyle"
                    :row-style="rowStyle">
                    <template slot-scope="scope" slot="menu">
                            <el-button icon="el-icon-delete" size="small" type="text"  @click="$refs.crud.rowDel(scope.row)" style="color:red">删除</el-button>
                    </template>
        </avue-crud>
    </basic-container>
</template>
<script>
import { list,submit,remove } from "@/api/biz/guarantee/facilities";
export default {
  methods: {
   rowStyle(){
      return 'height: 35px'
    },
    cellStyle(){
      return 'padding: 0'
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "facilityNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.facilityNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "facilityName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.facilityName,
                upperValue: ""
              }
            ]
          }
        ]
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    onLoad() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: []
      };
      list(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },
    //当前页
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //当前条数
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    rowSave(row, done, loading) {
        submit(row).then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        submit(row).then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          window.console.log(error);
          loading();
        });
      },
    rowDel(row){
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
    }
  },
  created() {
    this.onLoad()
  },
  data() {
    return {
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
      selectQuery: "",
      clickquery: "",
      segmentIndustrys:[],
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType:'1',
              prop: "facilityNum",
              label: "设施编号:",
              placeholder: "请输入设施编号"
            },
            {
              type: "input",
              queryType:'1',
              prop: "facilityName",
              label: "设施名称:",
              placeholder: "请输入设施名称"
            }
          ]
        ]
      },
      option: {
        viewBtn: false,
        editBtn: true,
        addBtn: true,
        delBtn: false,
        menuWidth: 200,
        tip: false,
        page: true,
        index: true,
        refreshBtn: false,
        border: true,
        columnBtn: false,
        cancelBtn: false,
        selection: true,
        searchBtn: false,
        deleteBtn: false,
        stripe: true,
        selectClearBtn: false,
        reserveSelection: true,
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        labelWidth: 120,
        labelPosition: 'right',
        labelSuffix: '：',
        gutter: 0,
        readonly: false,
        submitBtn: false,
        emptyBtn: false,
        mainModel: 'CRM_SYSS',
        column: [
            {
            type: 'input',
            label: '设施编号',
            span: 12,
            display: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            disabled: false,
            addDisabled: false,
            editDisabled: false,
            prop: 'facilityNum',
            tableRemark: '试验设施',
            required: true,
            rules: [
                {
                required: true,
                message: '设备编号必须填写'
                }
            ]
            },
            {
            type: 'input',
            label: '设施名称',
            span: 12,
            display: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            disabled: false,
            addDisabled: false,
            editDisabled: false,
            prop: 'facilityName',
            tableRemark: '试验设施',
            rules: [
                {
                required: true,
                message: '设备名称必须填写'
                }
            ],
            required: true
            },
            {
            type: 'input',
            label: '分类',
            span: 12,
            display: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            disabled: false,
            addDisabled: false,
            editDisabled: false,
            prop: 'facilityCategory',
            tableRemark: '试验设施',
            rules: [
                {
                required: true,
                message: '分类必须填写'
                }
            ],
            required: true
            },
            {
            type: 'select',
            label: '有效性',
            span: 12,
            display: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            disabled: false,
            addDisabled: false,
            editDisabled: false,
            prop: 'validity',
            tableRemark: '试验设施',
            rules: [
                {
                required: true,
                message: '有效性必须填写'
                }
            ],
            required: true,
            dicData: [
                {
                label: '有效',
                value: '1'
                },
                {
                label: '无效',
                value: '2'
                }
            ],
            cascaderItem: [],
            props: {
                label: 'label',
                value: 'value'
            },
            value: '1'
            },
            {
            type: 'input',
            label: '变更日期',
            span: 12,
            display: true,
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            disabled: true,
            addDisabled: false,
            editDisabled: false,
            prop: 'alterDate',
            tableRemark: '试验设施'
            }
        ],
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
