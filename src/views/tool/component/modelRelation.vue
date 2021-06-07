<template>
  <div class="relations">
    <el-row :gutter="10">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="left">
          <el-table
            ref="parentTable"
            border
            height="600"
            size="mini"
            :data="parentData"
            highlight-current-row
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            @cell-click="cellClick"
          >
            <el-table-column label="序号" width="60" align="center">
              <template slot="header">
                <el-button
                  type="primary"
                  circle
                  size="mini"
                  icon="el-icon-plus"
                  @click="handleCreate"
                >
                </el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  circle
                  size="mini"
                  icon="el-icon-delete"
                  v-if="scope.row.show"
                  @click="handleDelete(scope.row, scope.$index)"
                ></el-button>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关联关系"
              prop="relatedOperation"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.relatedOperation"
                  placeholder="请选择关联关系"
                  size="mini"
                  clearable
                >
                  <el-option label="一对一" :value="1"></el-option>
                  <el-option label="一对多" :value="2"></el-option>
                  <el-option label="多对多" :value="3"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="关联模型"
              prop="dbRelatedTable"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dbRelatedTable"
                  placeholder="请选择关联模型"
                  size="mini"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in rollModelInfoOptions"
                    :key="item.id"
                    :label="item.tableRemark"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="中间表" prop="dbMiddleTable" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dbMiddleTable"
                  placeholder="请选择中间表"
                  size="mini"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in rollModelInfoOptions"
                    :key="item.id"
                    :label="item.tableRemark"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="新建默认值表" prop="defaultTableId" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.defaultTableId"
                  placeholder="请选择新建默认值表"
                  size="mini"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in rollModelInfoOptions"
                    :key="item.id"
                    :label="item.tableRemark"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="分组" prop="modelGroup" align="center" width="120">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.modelGroup"
                  placeholder="请输入分组"
                  size="mini"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="right">
          <el-table
            border
            height="600"
            size="mini"
            :data="childData.data"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
          >
            <el-table-column label="序号" width="60" align="center">
              <template slot="header">
                <el-button
                  type="primary"
                  circle
                  size="mini"
                  icon="el-icon-plus"
                  @click="handleCreateChild"
                >
                </el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  circle
                  size="mini"
                  icon="el-icon-delete"
                  v-if="scope.row.show"
                  @click="handleDeleteChild(scope.row, scope.$index)"
                ></el-button>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="表名" prop="dbMainTable" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dbMainTable"
                  placeholder="请选择 表名"
                  size="mini"
                  clearable
                  filterable
                  @change="tableNameChange(scope.row)"
                >
                  <el-option
                    v-for="item in rollModelInfoOptions"
                    :key="item.id"
                    :label="item.tableRemark"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="表字段" prop="dbMainField" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dbMainField"
                  size="mini"
                  clearable
                  filterable
                  placeholder="请选择 表字段"
                >
                  <el-option
                    v-for="item in scope.row.dbMainFields"
                    :key="item.id"
                    :label="item.keyAndValue"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="关联类型" prop="relatedType" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.relatedType"
                  placeholder="请选择 关联类型"
                  size="mini"
                >
                  <el-option label="等于" value="EQ"></el-option>
                  <el-option label="常量" value="CN"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="关联表"
              prop="dbRelatedTable"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dbRelatedTable"
                  placeholder="请选择 关联表"
                  size="mini"
                  clearable
                  filterable
                  @change="dbRelatedTableChange(scope.row)"
                >
                  <el-option
                    v-for="item in rollModelInfoOptions"
                    :key="item.id"
                    :label="item.tableRemark"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="关联字段"
              prop="dbRelatedField"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  size="mini"
                  v-model="scope.row.dbRelatedField"
                  placeholder="请选择 关联字段"
                >
                  <el-option
                    v-for="item in scope.row.dbRelatedFields"
                    :key="item.id"
                    :label="item.keyAndValue"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="值" prop="fieldValue" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.fieldValue"
                  clearable
                  size="mini"
                  placeholder="请输入 值"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getList,
  add,
  remove,
  detail,
  update,
  basicModelFields,
  rollModelInfo,
  rollTableInfo,
  findTableNameBySearch,
  syncDb,
  getDbModels,
  getCodeAndValue,
  getCodeByDict,
} from "@/api/tool/model.js";
export default {
  data() {
    return {
      parentData: [],
      childData: {
        data: [],
      },
      rollModelInfoOptions: [],
      show: false,
      deleteForeignIdList: [],
      deleteForeignKeyIdList: [],
    };
  },

  created() {
    this.getRollModelInfo();
  },

  methods: {
    async getRollModelInfo() {
      const { data } = await rollModelInfo();
      this.rollModelInfoOptions = data.data;
    },

    handleCreate() {
      this.parentData.push({
        show: false,
        modelForeignKeyList: [],
      });

      // 设置左边的 data 值为添加行中的 modelForeignKeyList
      this.$set(
        this.childData,
        "data",
        this.parentData[this.parentData.length - 1].modelForeignKeyList
      );

      // 自动高亮当前行
      if (this.parentData.length > 0) {
        this.$refs.parentTable.setCurrentRow(
          this.parentData[this.parentData.length - 1]
        );
      }
    },

    handleDelete(row, index) {
      row.modelForeignKeyList = []; // 清空右边
      this.parentData.splice(index, 1); // 删除当前行

      setTimeout(() => {
        // 高亮当前最新行
        if (this.parentData.length > 0) {
          this.$refs.parentTable.setCurrentRow(
            this.parentData[this.parentData.length - 1]
          );
        }

        // 设置右边值
        if (
          this.parentData[this.parentData.length - 1] &&
          this.parentData[this.parentData.length - 1].modelForeignKeyList
        ) {
          this.$set(
            this.childData,
            "data",
            this.parentData[this.parentData.length - 1].modelForeignKeyList
          );
        }
      }, 100);

      if (row.id) {
        this.deleteForeignIdList.push(row.id);
      }

      this.dictData()
    },

    handleDeleteChild(row, index) {
      this.childData.data.splice(index, 1);

      if (row.id) {
        this.deleteForeignKeyIdList.push(row.id);
      }
    },

    cellClick(row, column, cell, event) {
      this.childData.data = row.modelForeignKeyList;
      this.dictData()
    },

    cellMouseEnter(row, column, cell, event) {
      this.$set(row, "show", true);
    },

    cellMouseLeave(row, column, cell, event) {
      this.$set(row, "show", false);
    },

    handleCreateChild() {
      if (this.parentData.length > 0) {
        this.childData.data.push({
          show: false,
        });
      }
    },

    tableNameChange(row) {
      row.dbMainFields = [];
      row.dbMainField = "";
      if (row.dbMainTable) {
        //关系模型表   表名下拉数据
        delete row.dbMainField;
        rollTableInfo(row.dbMainTable).then((res) => {
          this.$set(row, "dbMainFields", res.data.data);
        });
      }
    },

    dbRelatedTableChange(row) {
      row.dbRelatedFields = [];
      row.dbRelatedField = "";
      if (row.dbRelatedTable) {
        //关系模型表   关联表数据
        delete row.dbRelatedField;
        rollTableInfo(row.dbRelatedTable).then((res) => {
          this.$set(row, "dbRelatedFields", res.data.data);
        });
      }
    },

    setCurrentRowFromEdit() {
      this.childData.data = this.parentData[
        this.parentData.length - 1
      ] &&  this.parentData[
        this.parentData.length - 1
      ].modelForeignKeyList;

      this.dictData()
    },

    // 字典查询

    dictData() {
      (this.childData.data || []).forEach((item) => {

        if(item.dbMainTable){
           rollTableInfo(item.dbMainTable).then((res) => {
          item.dbMainFields = res.data.data;
        });
        }

        if(item.dbRelatedTable){
          rollTableInfo(item.dbRelatedTable).then((res) => {
          item.dbRelatedFields = res.data.data;
        });
        }

      });
    },
  },
};
</script>

<style lang="scss" scoped>
.relations {
  margin-top: 10px;
}

/deep/.el-table__body tr.current-row > td {
  background-color: #ecf5ff !important;
  color: #000;
}
</style>
