<template>
  <div>
    <el-form-item :label="option.label" :option="option" :prop="option.prop">
      <el-row>
        <el-col :span="11">
          <el-input
           type="number"
           @mousewheel.native.prevent
           controls-position="right"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              style="width:100%;"
            v-model="tableData[0].lowerValue"
            :placeholder="option.placeholder"
            clearable
            size="small"
            @change="changeLower"
            @keyup.enter.native="handleQuery"
          ></el-input>
        </el-col>
        <el-col :span="1" style="text-align:center">到</el-col>
        <el-col :span="11">
          <el-input
          type="number"
           @mousewheel.native.prevent
           controls-position="right"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              style="width:100%;"
            v-model="tableData[0].upperValue"
            :placeholder="option.placeholder"
            clearable
            size="small"
            @change="changeLower"
            @keyup.enter.native="handleQuery"
          ></el-input>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-menu" @click="open" style="color:blue;cursor:pointer;margin-left:5px"></i>
        </el-col>
      </el-row>
    </el-form-item>
    <el-dialog
      :visible.sync="Visible"
      title="选择"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
    >
      <div style="margin-bottom:15px">
        <el-button type="primary" size="small" icon="el-icon-document-copy">粘 贴</el-button>
        <el-button type="primary" size="small" @click="addLine" icon="el-icon-plus">加一行</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column prop="operator" label="操作符" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.operator" placeholder="请选择" filterable size="small">
              <el-option
                v-for="item in czf "
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="lowerValue" label="值小" align="center">
          <template slot-scope="scope">
            <el-input size="small" type="number"
           @mousewheel.native.prevent
           controls-position="right"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              style="width:100%;" class="ipt" v-model="scope.row.lowerValue" :placeholder="option.placeholder"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="upperValue" label="值大" align="center">
          <template slot-scope="scope">
            <el-input size="small" class="ipt" type="number"
           @mousewheel.native.prevent
           controls-position="right"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              style="width:100%;" v-model="scope.row.upperValue" :placeholder="option.placeholder"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="80" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleDelete1(scope.$index,tableData)"
              type="text"
              size="small"
              icon="el-icon-delete"
              style="color:red"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure" size="small" icon="el-icon-circle-plus-outline">确 定</el-button>
        <el-button @click="Visible = false" size="small" icon="el-icon-circle-close">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {
      Visible: false,
      lowerValue: "",
      upperValue: "",
      prop: this.option.prop,
      tableData: [
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        }
      ],
      value: "",
      multipleSelection: [],
      czf: []
    };
  },
  created() {
    this.getmodels("query_operator").then(res => {
      this.czf = res.data.data;
    });
  },
  methods: {
    open() {
      this.Visible = true;
      this.condition();
    },
    handleQuery() {
      this.$emit("handleQuery");
    },
    addLine() {
      //添加行数
      var newValue = {
        date: "",
        name: "",
        address: ""
      };
      //添加新的行数
      this.tableData.push(newValue);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //change事件
    changeLower() {
      this.condition();
      this.$emit("childGetValue", this.tableData, this.prop);
    },
    handleDelete1(index, rows) {
      //删除改行
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(index, rows);
        rows.splice(index, 1);
      });
    },
    sure() {
      this.Visible = false;
      this.$emit("childGetValue", this.tableData, this.prop);
    },
    //判断条件
    condition() {
      if (this.tableData[0].lowerValue && this.tableData[0].upperValue) {
        this.tableData[0].operator = "范围";
      }
      if (this.tableData[0].lowerValue && !this.tableData[0].upperValue) {
        this.tableData[0].operator = "等于";
      }
      if (!this.tableData[0].lowerValue && this.tableData[0].upperValue) {
        this.tableData[0].operator = "等于";
      }
    },
    clear() {
      this.tableData = [
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        },
        {
          operator: "",
          lowerValue: "",
          upperValue: ""
        }
      ];
    }
  }
};
</script>
<style  scoped>
</style>