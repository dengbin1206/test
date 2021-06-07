<template>
  <div class="sx_variable_wrapper_code">
    <el-button
      size="small"
      icon="el-icon-plus"
      type="primary"
      style="margin-bottom: 5px"
      @click="handleCreate"
      >新增</el-button
    >
    <el-table :data="data" border size="small" :height="tableHeight">
      <el-table-column label="流程节点" prop="nodeCode" align="center">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.nodeCode"
            placeholder="请选择流程节点"
            style="width: 100%"
            size="small"
            clearable
          >
            <el-option
              v-for="item in htOption"
              :key="item.nodeCode"
              :label="item.nodeName"
              :value="item.nodeCode"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="流程变量名" prop="varKey" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.varKey" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column label="变量描述" prop="formName" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.formName" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column label="表单变量" prop="formKey" align="center">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.formKey"
            placeholder="请选择表单变量"
            size="small"
            clearable
            filterable
          >
            <el-option
              v-for="item in modelFiled"
              :key="item.id"
              :label="item.fieldAndModelRemark"
              :value="item.modelAndField"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="固定值" prop="formValue" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.formValue" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click="handleDelete(scope.row, scope.$index)"
            style="color: #f56c6c"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { variableList, getProcessNodesForDict } from "@/api/flow/flow";
import { mapState } from "vuex";
export default {
  data() {
    return {
      data: [],
      delFlowVariableIds: [],
      htOption: [],
      tableHeight: 0,
      page: {
        total: null,
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.tableHeight = window.innerHeight - 200;
  },
  props: {
    proDefId: String,
  },
  computed: {
    ...mapState("Home", ["modelFiled"]),
  },
  methods: {
    async queryList(proDefId) {
      const { data: res } = await variableList({ proDefId: proDefId });
      const { data, code, msg } = res;
      if (code === 200) {
        this.data = data;
      }
    },

    handelEdit(row) {
      row.$cellEdit = true;
      // this.$refs.variable.rowCell(this.data[index]);
      this.$refs.variable.rowCell(row);
      console.log(row);
    },

    handleCreate() {
      this.data.unshift({});
    },

    async handleDelete(row, index) {
      this.data.splice(index, 1);
      if (row.id) {
        this.delFlowVariableIds.push(row.id);
      }
    },
    async getBack(proDefId) {
      getProcessNodesForDict(proDefId).then((res) => {
        this.htOption = res.data.data;
        this.htOption.unshift(
          { nodeName: "流程发起变量", nodeCode: "1" },
          { nodeName: "流程全局变量", nodeCode: "2" }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sx_variable_wrapper_code {
  height: 86vh;

  .popconfirm {
    margin-left: 5px;
  }
}
.cell {
  text-align: center !important;
}
</style>
