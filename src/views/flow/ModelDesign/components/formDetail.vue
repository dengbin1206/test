<!--
 * @Date: 2021-01-02 15:10:26
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-06 09:25:14
 * @FilePath: /SX-DTBF-VIEW/src/views/flow/ModelDesign/components/formDetail.vue
 * @Description:
-->
<template>
  <div class="sx_form_wrapper">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14">
        <div class="left">
          <el-table
            :data="tableData"
            style="width: 100%; margin-top: 44px"
            :header-cell-style="{
              background: 'rgb(250, 250, 250)',
              'text-align': 'center',
            }"
            highlight-current-row
            @current-change="handleCurrentChange"
            border
            height="80vh"
            stripe
          >
            <el-table-column
              label=""
              prop="ownerNum"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.ownerNum == 0">全局表单</span>
                <span v-if="scope.row.ownerNum == 1">开始表单</span>
                <span v-if="scope.row.ownerNum == 2">明细表单</span>
                <span v-if="scope.row.ownerNum == 3">节点表单</span>
              </template>
            </el-table-column>
            <el-table-column
              label="节点名称"
              prop="nodeName"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              label="表单类型"
              prop="formType"
              align="center"
              width="150"
            >
              <template slot-scope="scope">
                <el-select
                  size="small"
                  placeholder="请选择类型"
                  v-model="scope.row.formType"
                  @change="change($event, scope.row)"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in select"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="审批表单"
              prop="formId"
              align="center"
              width="250"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.formId"
                  size="small"
                  filterable
                  clearable
                  reserve-keyword
                  placeholder="搜索并选择审批表单"
                  @change="selectChange($event, scope.row)"
                  :loading="loading"
                  :disabled="scope.row.disabledForm"
                >
                  <el-option
                    v-for="item in scope.row.optionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="页面路由" prop="routeName" align="center">
              <template slot-scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.routeName"
                  placeholder="请输入页面路由"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="移动端页面路由" prop="mobileRouteName" align="center">
              <template slot-scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.mobileRouteName"
                  placeholder="请输入移动端页面路由"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
        <div class="right">
          <div class="tool">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addBtn"
              size="small"
              :disabled="addFalse"
              >新 增</el-button
            >
          </div>
          <div class="content">
            <el-table
              :data="formFieldData"
              :header-cell-style="{
                background: 'rgb(250, 250, 250)',
                'text-align': 'center',
              }"
              style="width: 100%"
              highlight-current-row
              border
              stripe
              height="80vh"
            >
              <el-table-column label="字段" prop="formField" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.formField"
                    placeholder="请选择字段"
                    clearable
                    filterable
                    size="small"
                    @change="formChange(scope.row.formField, scope.$index)"
                  >
                    <el-option
                      v-for="item in formFieldOption"
                      :key="item.id"
                      :label="item.fieldAndModelRemark"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="可见"
                prop="noVisible"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.noVisible"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="可改"
                prop="isUpdate"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isUpdate"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="必填"
                prop="isFill"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isFill"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-delete"
                    style="color: #f56c6c"
                    size="mini"
                    type="text"
                    @click="delBtn(scope.row, scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { formDetail as option } from "../options";
import { allFormList, getAllModelFieldsByFormId } from "@/api/tool/formDesigner";
import { rollModelInfo, getAllModelFieldsByModelId } from "@/api/tool/model";
import { mapMutations } from "vuex";
import {
  processform,
  findFieldInfoById,
} from "@/api/flow/flow";
export default {
  data() {
    return {
      option: option,
      data: [],
      page: {
        total: null,
        currentPage: 1,
        pageSize: 20,
      },
      loading: false,
      select: [
        { label: "模型", value: "M" },
        { label: "表单", value: "F" },
        { label: "自定义", value: "S" },
      ],
      value: "",
      tableData: [],
      optionList: [],
      allFormList:[],
      allModelList:[],
      formType: "",
      formFieldData: [],
      formFieldOption: [],
      addFalse: true,
      delFlowNodeFieldIds: [],
      formFieldName: "",
      formFieldText: "",
    };
  },

  created() {
    this.initTable();
    this.getModelFormList();
  },

  methods: {
    ...mapMutations("Home", ["SET_MODELFILED"]),
    queryList(proDefId) {
      this.formFieldData = [];
      processform(proDefId).then((res) => {
        res.data.data.forEach((item) => {
          if(item.formType == "M" || item.formType == "S"){
            this.$set(item, "optionList", this.allModelList);
          }else if(item.formType == "F"){
            this.$set(item, "optionList", this.allFormList);
          }
        });
        this.tableData = res.data.data;

        if (this.tableData.length > 0) {
          this.tableData.forEach(f=>{
            if(f.ownerNum == 0 && f.formId){
              if(f.formType === 'M' || f.formType === 'S'){
                getAllModelFieldsByModelId(f.formId).then((resp) => {
                  this.SET_MODELFILED(resp.data.data);
                });
              }else if(f.formType === 'F'){
                getAllModelFieldsByFormId(f.formId).then((resp) => {
                  this.SET_MODELFILED(resp.data.data);
                });
              }
              return;
            }
          })
        }
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.queryList(this.page);
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.queryList(this.page);
    },

    async initTable() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.tableData[i], "disabled", true);
        this.$set(this.tableData[i], "disabledForm", true);
      }
    },

    async getModelFormList(){
      const { data } = await allFormList();
      this.allFormList = data.data.map(form => {
        return {
          label: form.formName,
          value: form.id,
        }
      })
      const { data:data1 } = await rollModelInfo();
      this.allModelList = data1.data.map(model => {
        return {
          label: model.tableRemark,
          value: model.id,
        }
      })


    },

    async change(currentValue, row) {
      switch (currentValue) {
        case "M":
          this.$set(row, "formType", "M");
          this.$set(row, "formId", "");
          this.$set(row, "optionList", this.allModelList);
          break;
        case "F":
          this.$set(row, "formType", "F");
          this.$set(row, "formId", "");
          this.$set(row, "optionList", this.allFormList);
          break;
        case "S":
          this.$set(row, "formType", "S");
          this.$set(row, "formId", "");
          this.$set(row, "optionList", this.allModelList);
          break;
        default:
          break;
      }

      if(row.ownerNum == 0 && row.formId){
        if(row.formType === 'M' || row.formType === 'S'){
          const { data } = await getAllModelFieldsByModelId(row.formId);
          this.SET_MODELFILED(data.data);
        }else if(row.formType === 'F'){
          const { data } = await getAllModelFieldsByFormId(row.formId);
          this.SET_MODELFILED(data.data);
        }
        return;
      }
    },

    async selectChange(currentValue, row) {
      if(row.ownerNum == 0 && row.formId){
        if(row.formType === 'M' || row.formType === 'S'){
          const { data } = await getAllModelFieldsByModelId(row.formId);
          this.SET_MODELFILED(data.data);
        }else if(row.formType === 'F'){
          const { data } = await getAllModelFieldsByFormId(row.formId);
          this.SET_MODELFILED(data.data);
        }
        return;
      }
    },

    addBtn() {
      this.formFieldData.push({
        formField: "",
        isUpdate: false,
        isUpdate: false,
        isFill: false,
        formFieldName: "",
        formFieldText: "",
      });
    },
    formChange(a, b) {
      this.formFieldOption.forEach((item) => {
        if (a == item.id) {
          this.formFieldData[b].formFieldName = item.modelAndField;
          this.formFieldData[b].formFieldText = item.dbFieldRemark;
        }
      });
    },
    handleCurrentChange(currentRow) {
      this.addFalse = false;
      if (currentRow && currentRow.flowNodeFieldControlList) {
        this.formFieldData = currentRow.flowNodeFieldControlList;
        if (this.formFieldData.length > 0) {
          this.formFieldData.forEach((item) => {
            if (item.noVisible && item.noVisible == 1) {
              item.noVisible = true;
            } else {
              item.noVisible = false;
            }
            if (item.isUpdate && item.isUpdate == 1) {
              item.isUpdate = true;
            } else {
              item.isUpdate = false;
            }
            if (item.isFill && item.isFill == 1) {
              item.isFill = true;
            } else {
              item.isFill = false;
            }
          });
        }
      } else {
        this.formFieldData = [];
      }
      if(currentRow.formId){
        if(currentRow.formType === 'M' || currentRow.formType === 'S'){
          getAllModelFieldsByModelId(currentRow.formId).then((res) => {
            if (res.data.code == "200") {
              this.formFieldOption = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }else if(currentRow.formType === 'F'){
          getAllModelFieldsByFormId(currentRow.formId).then((res) => {
            if (res.data.code == "200") {
              this.formFieldOption = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
        return;
      }
    },
    delBtn(row, index) {
      this.formFieldData.splice(index, 1);
      if (row.id) {
        this.delFlowNodeFieldIds.push(row.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sx_form_wrapper {
  .left {
    padding: 10px;

    .button {
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
    }
  }

  .right {
    padding: 10px;

    .tool {
      height: 44px;
      display: flex;
      align-items: center;
    }
    .content {
      overflow-y: auto;
    }
  }

  .expand_board {
    border: 1px solid #ccc;
    height: 200px;
  }
}
</style>
