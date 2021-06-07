<template>
  <div>
    <basic-container>
      <el-form
        :inline="true"
        label-width="130px"
        class="sx_model_search sx_formItem"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="模型名:">
              <el-input
                v-model="search_form.tableName"
                placeholder="请输入模型名"
                clearable
                size="small"
                maxlength="18"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="模型描述:">
              <el-input
                v-model="search_form.tableRemark"
                placeholder="请输入模型描述"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="searchChange()"
                >查询</el-button
              >
              <el-dropdown @command="dropdownMenu">
                <el-button type="primary" size="small"
                  ><i class="el-icon-arrow-down"></i
                ></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="clear">清空</el-dropdown-item>
                  <el-dropdown-item command="spread">{{
                    isShow ? "收起" : "展开"
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </el-col>
        </el-row>
        <el-collapse v-show="isShow">
          <el-row>
            <el-col :span="11">
              <el-form-item label="模型分类:">
                <el-select
                  v-model="search_form.tableType"
                  placeholder="请选择"
                  size="small"
                  ref="selectReport"
                >
                  <el-option
                    v-for="item in model_type"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="同步数据库:">
                <el-checkbox v-model="search_form.isSync"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-row class="sx_model_time">
                <el-form-item label="创建时间:">
                  <el-col :span="10">
                    <el-date-picker
                      type="date"
                      placeholder="开始时间"
                      v-model="search_form.time1"
                      style="width: 100%; height: 32px"
                      size="small"
                    ></el-date-picker>
                  </el-col>
                  <el-col style="text-align: center" :span="2">到</el-col>
                  <el-col :span="10">
                    <el-date-picker
                      type="date"
                      placeholder="结束时间"
                      v-model="search_form.time2"
                      style="width: 100%; height: 32px"
                      size="small"
                    ></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </el-collapse>
      </el-form>
      <dialogs ref="sonV"></dialogs>
      <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        :table-loading="loading"
        :page="page"
        @on-load="onLoad"
        @row-del="rowDel"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        :cell-style="cellStyle"
        :row-style="rowStyle"
      >
        <template slot-scope="scope" slot="menuLeft">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handdleAdd"
            >新增</el-button
          >
          <el-button type="primary" icon="el-icon-download" size="small"
            >导入</el-button
          >
          <el-button type="primary" icon="el-icon-upload2" size="small"
            >导出</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delList()"
            >删除</el-button
          >
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            size="small"
            icon="el-icon-setting"
            @click.stop="open(scope.row)"
            >权限对象</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            @click.stop="handleEdit(scope.row, scope.index)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-refresh"
            @click.stop="sync(scope.row)"
            :disabled="scope.row.syncStatus == 0 ? false : true"
            >同步</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="rowDel(scope.row)"
            style="color: red"
            >删除</el-button
          >
        </template>
      </avue-crud>
      <el-dialog
        :title="title"
        :visible.sync="isBlock"
        fullscreen
        append-to-body
      >
        <el-form
          :inline="true"
          label-width="130px"
          :rules="rules"
          :model="add_form.modelTable"
          :show-message="messagese"
          ref="add_form.modelTable"
          class="sx_formItem sx_model_scss"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="模型名:" prop="tableName">
                <el-input
                  v-model="add_form.modelTable.tableName"
                  placeholder="请输入模型名"
                  clearable
                  size="small"
                  maxlength="18"
                  type="text"
                  :oninput="
                    inputFieldName(
                      add_form.modelTable,
                      'tableName',
                      add_form.modelTable.tableName
                    )
                  "
                  :disabled="disable"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型描述:" prop="tableRemark">
                <el-input
                  v-model="add_form.modelTable.tableRemark"
                  placeholder="请输入模型描述"
                  clearable
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="模型分类:" prop="tableType">
                <el-select
                  v-model="add_form.modelTable.tableType"
                  placeholder="请选择"
                  size="small"
                  ref="selectReport"
                >
                  <el-option
                    v-for="item in model_type"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否同步数据库:" prop="isSync">
                <el-checkbox v-model="add_form.modelTable.isSync"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-tabs v-model="activeName" class="sx_model_cell">
          <el-tab-pane label="字段属性" name="first">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addModelFieldList"
              size="small"
              style="margin-bottom: 5px"
              >新 增</el-button
            >
            <el-table
              :data="add_form.modelFieldList"
              class="sx_model_field"
              border="true"
              ref="FieldList"
              size="small"
              :height="tableHeight"
              style="width: 100%"
              :header-cell-style="{ background: '#FAFAFA' }"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column label="排序" prop="orderNum" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.orderNum"
                    placeholder="请输入排序"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="字段名" prop="dbFieldName" width="135">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbFieldName"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                    placeholder="请输入字段名"
                    type="text"
                    :oninput="
                      inputFieldName(
                        scope.row,
                        'dbFieldName',
                        scope.row.dbFieldName
                      )
                    "
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="字段描述"
                prop="dbFieldRemark"
                width="140"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbFieldRemark"
                    placeholder="请输入字段描述"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="字段类型" prop="dbType" width="120">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.dbType"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                    placeholder="请选择字段类型"
                  >
                    <el-option
                      v-for="item in field_type"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="字段长度" prop="dbLength" width="80">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbLength"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                    placeholder="请输入字段长度"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="小数位" prop="dbPointLength" width="80">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbPointLength"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                    placeholder="请输入小数位长度"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="是否数据库字段"
                prop="dbIsField"
                width="70"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.dbIsField"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="新增可见" prop="fieldShow" width="30">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.fieldShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="新增可改" prop="fieldAlter" width="30">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.fieldAlter"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="新增必填" prop="isRequired" width="30">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.isRequired"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="修改可见"
                prop="updateFieldShow"
                width="30"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.updateFieldShow"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="修改可改"
                prop="updateFieldAlter"
                width="30"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.updateFieldAlter"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="修改必填"
                prop="updateIsRequired"
                width="30"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.updateIsRequired"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="显示可见"
                prop="displayVisible"
                width="30"
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.displayVisible"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="新建界面默认值"
                prop="formDefaultValue"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.formDefaultValue"
                    placeholder="新建界面默认值"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="保存默认值"
                prop="dbDefaultValue"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbDefaultValue"
                    placeholder="请输入默认值"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="控件类型"
                prop="formInputType"
                width="105"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.formInputType"
                    placeholder="请选择控件类型"
                    clearable="true"
                  >
                    <el-option
                      v-for="item in control_type"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="控件宽度" prop="formSpan" width="100">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.formSpan"
                    placeholder="请选择列对齐方式"
                    clearable="true"
                  >
                    <el-option label="25%" value="6"></el-option>
                    <el-option label="50%" value="12"></el-option>
                    <el-option label="75%" value="18"></el-option>
                    <el-option label="100%" value="24"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="字典Table"
                prop="fieldDictTable"
                width="110"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.fieldDictTable"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="
                      (query) => {
                        remoteMethod(query, scope.row);
                      }
                    "
                    :loading="tabLoading"
                    @change="fieldDictTableChange(scope.row)"
                  >
                    <el-option
                      v-for="item in scope.row.dictTable"
                      :key="item.dbTableName"
                      :label="item.tableRemark"
                      :value="item.dbTableName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="字典Code"
                prop="fieldDictField"
                width="100"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.fieldDictField"
                    placeholder="请选择字典Code"
                  >
                    <el-option
                      v-for="item in scope.row.fieldDictFields"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="字典Text"
                prop="fieldDictRemark"
                width="115"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.fieldDictRemark"
                    placeholder="请选择字典Text"
                  >
                    <el-option
                      v-for="item in scope.row.fieldDictRemarks"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="表单输入框提示语"
                prop="formPlaceholder"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.formPlaceholder"
                    placeholder="请输入表单输入框提示语"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="验证规则"
                prop="fieldDictRemark"
                width="115"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.formValidType"
                    placeholder="请选择验证规则"
                    clearable="true"
                  >
                    <el-option
                      v-for="item in formValidTypes"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="名称写入字段"
                prop="remarkFieldName"
                width="120"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remarkFieldName"
                    placeholder="请输入名称写入字段"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="扩展参数"
                prop="formExtendValue"
                width="120"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.formExtendValue"
                    placeholder="请输入扩展参数"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    type="text"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                    @click="rowDelmodelFieldList(scope.row, scope.$index)"
                    style="color: red"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="模型关系" name="second">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addModelForeignList"
                    size="small"
                    style="margin-bottom: 5px"
                    >新 增</el-button
                  >
                  <el-table
                    :data="add_form.modelForeignList"
                    border="true"
                    size="small"
                    :height="tableHeight"
                    fit="true"
                    style="width: 100%"
                    :header-cell-style="{ background: '#FAFAFA' }"
                    @current-change="handdle"
                    highlight-current-row
                    ref="multipleTable"
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                      width="50"
                    ></el-table-column>
                    <el-table-column label="模型" prop="dbMainTable">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbMainTable"
                          placeholder="请选择"
                          filterable
                          :filter-method="dbMainTableChange"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.tableRemark"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="关联关系" prop="relatedOperation">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.relatedOperation"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in tions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="关联模型" prop="dbRelatedTable">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbRelatedTable"
                          placeholder="请选择"
                          filterable
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.tableRemark"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="中间表" prop="dbMiddleTable">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbMiddleTable"
                          placeholder="请选择"
                        >
                          <el-option
                            label="中间表一"
                            value="中间表一"
                          ></el-option>
                          <el-option
                            label="中间表二"
                            value="中间表二"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="分组" prop="modelGroup">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.modelGroup"
                          placeholder="请输入内容"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          type="text"
                          @click="
                            rowDelmodelForeignList(scope.row, scope.$index)
                          "
                          style="color: red"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addModelForeignKeyList"
                    size="small"
                    style="margin-bottom: 5px"
                    :disabled="sublistDisabled"
                    >新 增</el-button
                  >
                  <el-table
                    :data="arr"
                    border="true"
                    :height="tableHeight"
                    size="small"
                    fit="true"
                    style="width: 100%"
                    :header-cell-style="{ background: '#FAFAFA' }"
                    ref="ForeignKeyList"
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                      width="50"
                    ></el-table-column>
                    <el-table-column label="表名" prop="dbMainTable">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbMainTable"
                          placeholder="请选择"
                          @change="tableNameChange(scope.row)"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.tableRemark"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="表字段" prop="dbMainField">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbMainField"
                          placeholder="请选择"
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
                    <el-table-column label="关联类型" prop="relatedType">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.relatedType"
                          placeholder="请选择"
                        >
                          <el-option label="等于" value="EQ"></el-option>
                          <el-option label="常量" value="CN"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="关联表" prop="dbRelatedTable">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbRelatedTable"
                          placeholder="请选择"
                          @change="latedTableChange(scope.row)"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.tableRemark"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="关联表字段" prop="dbRelatedField">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.dbRelatedField"
                          placeholder="请选择"
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
                    <el-table-column label="值" prop="fieldValue">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.fieldValue"
                          placeholder="请输入内容"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          type="text"
                          @click="
                            rowDelmodelForeignKeyList(scope.row, scope.$index)
                          "
                          style="color: red"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="查询配置" name="third">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="reveal"
              size="small"
              style="margin-bottom: 5px"
              >查询列表顺序</el-button
            >
            <el-table
              :data="add_form.modelFieldList"
              row-key="orderNum"
              :height="tableHeight"
              border="true"
              size="small"
              fit="true"
              style="width: 100%"
              :header-cell-style="{ background: '#FAFAFA' }"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column label="字段名" prop="dbFieldName" width="200">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbFieldName"
                    :disabled="scope.row.dbIsSystem == 1 ? true : false"
                    placeholder="请输入字段名"
                    type="text"
                    :oninput="
                      inputFieldName(
                        scope.row,
                        'dbFieldName',
                        scope.row.dbFieldName
                      )
                    "
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="查询字段描述"
                prop="dbFieldRemark"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.dbFieldRemark"
                    placeholder="请输入字段描述"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否启用" prop="queryIsUse" width="30">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.queryIsUse"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="是否查询" prop="queryIsShow" width="30">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.queryIsShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="模糊查询"
                prop="queryFuzzySearch"
                width="30"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.queryFuzzySearch"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="查询条件排序"
                prop="queryOrderNum"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.queryOrderNum"
                    placeholder="请输入查询条件排序"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="查询类型" prop="queryType" width="200">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.queryType"
                    placeholder="请选择查询类型"
                    clearable="true"
                  >
                    <el-option label="普通查询" value="1"></el-option>
                    <el-option label="范围查询" value="2"></el-option>
                    <el-option label="组合查询" value="3"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="控件类型"
                prop="queryControlType"
                width="200"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.queryControlType"
                    placeholder="请选择控件类型"
                    clearable="true"
                  >
                    <el-option
                      v-for="item in control_type"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="列表显示" prop="listDisplay" width="30">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.listDisplay"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="冻结列" prop="columnFixed" width="30">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.columnFixed"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="列表显示长度"
                prop="columnLength"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.columnLength"
                    placeholder="请输入列表显示长度"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="列对齐方式"
                prop="columnAlign"
                width="100"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.columnAlign"
                    placeholder="请选择列对齐方式"
                    clearable="true"
                  >
                    <el-option label="左对齐" value="left"></el-option>
                    <el-option label="居中" value="center"></el-option>
                    <el-option label="右对齐" value="right"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="默认值"
                prop="queryDefaultValue"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.queryDefaultValue"
                    placeholder="请输入默认值"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="查询条件输入框提示词"
                prop="queryPlaceholder"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.queryPlaceholder"
                    placeholder="请输入查询条件输入框提示词"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="扩展参数"
                prop="queryExtendVar"
                width="213"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.queryExtendVar"
                    placeholder="请输入字典Code"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="查询列表顺序" name="forth"></el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="small"
            @click="submite('add_form.modelTable')"
            >保存</el-button
          >
          <el-button
            icon="el-icon-close"
            @click="none('add_form.modelTable')"
            size="small"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        title="查询列表顺序"
        :visible.sync="isShun"
        width="60%"
        append-to-body
        :close-on-click-modal="false"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addModelQuerySortList"
          size="small"
          style="margin-bottom: 5px"
          >新增</el-button
        >
        <el-table
          :data="add_form.modelQuerySortList"
          border="true"
          class="sx_model_cell"
          :height="tableHeight"
          size="small"
          ref="modelQuerySortList"
          fit="false"
          style="width: 100%"
          :header-cell-style="{ background: '#FAFAFA' }"
        >
          <el-table-column label="序号" type="index" width="50%">
          </el-table-column>
          <el-table-column label="字段名" prop="fieldName">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.fieldName"
                placeholder="请选择字段名"
              >
                <el-option
                  v-for="item in fieldNames"
                  :key="item.dbFieldName"
                  :label="item.dbFieldName"
                  :value="item.dbFieldName"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="排序方式" prop="sortOrder">
            <template slot-scope="scope">
              <el-select v-model="scope.row.sortOrder" placeholder="请选择顺序">
                <el-option label="升序" value="0"></el-option>
                <el-option label="降序" value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="顺序" prop="orderNum">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.orderNum"
                placeholder="请输入顺序"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="text"
                style="color: red"
                @click="rowDelmodelQuerySortList(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShun = false">取 消</el-button>
          <el-button type="primary" @click="isShun = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新增 -->
      <el-dialog class="avue-dialog" ref="dialog" fullscreen :visible.sync="visible" append-to-body :show-close="false">
        <div slot="title" class="avue-crud__dialog__header">
          <span class="el-dialog__title">{{dialogTitle}}</span>
          <div class="avue-dialog__menu">
            <el-button type="primary" size="mini" icon="el-icon-check" @click="handdleClick">保存</el-button>
            <el-button size="mini" @click="handdleClose" icon="el-icon-close">取消</el-button>
          </div>
        </div>
        <modelconfig ref="modelconfig" v-if="visible"></modelconfig>
      </el-dialog>
    </basic-container>
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
import Sortable from "sortablejs";

import {
  LazyList,
  getModelCode,
  getPowerObjById,
} from "@/api/power/formConfig";

import dialogs from "../power/formConfig2";
import {
  fieldList,
  fieldListNum,
  TableNum,
  TableSync,
  queryNum,
} from "@/util/model/model.js";
import { keyWord } from "@/utils/db_key_word.js";
import Data from "@/util/model/modelOption.js";
import { getDictByCode } from "@/api/system/dict";
import modelconfig from "./component/modelconfig";
export default {
  components: {
    dialogs,
    modelconfig,
  },
  data() {
    return {
      fullscreenLoading: false,
      modelId: "",
      byType: "M",
      dialogTitle: "",
      display: false,
      visible: false,
      dialogVisible: true,
      loading:false,
      modelTreeData: [],
      tableData: [],
      modelOptions: [],
      formValidTypes: [],
      codes: [],
      selection: "",
      addData: {},
      powerFormIds: [],
      tabLoading: false,
      sublistDisabled: true,
      tions: [
        {
          label: "一对一",
          value: 1,
        },
        {
          label: "一对多",
          value: 2,
        },
        {
          label: "多对多",
          value: 3,
        },
      ],
      messagese: false,
      disable: false,
      rules: Data.rules,
      model_type: [],
      field_type: [],
      control_type: [],
      tableHeight: 0,
      isShun: false,
      fieldNames: [],
      options: [],
      selectList: [],
      activeName: "first",
      query: {},
      title: "",
      search_form: {
        tableName: "",
        tableRemark: "",
        tableType: "",
        isSync: "",
        value: "",
        time1: "",
        time2: "",
      },
      add_form: {
        modelTable: {
          tableName: "",
          tableRemark: "",
          tableType: "",
          isSync: "",
        },
        modelFieldList: [],
        modelForeignList: [],
        modelQuerySortList: [],
        deleteFieldIdList: [],
        deleteForeignIdLis: [],
        deleteForeignKeyIdList: [],
        deleteTabSortList: [],
      },
      old: 0,
      arr: [],
      ass: [],
      isBlock: false,
      isShow: false,
      data: [],
      page: Data.page,
      option: Data.modelOption,
    };
  },
  watch: {
    "add_form.modelForeignList"(oldVal) {
      if (oldVal.length > 0) {
        this.sublistDisabled = false;
      } else if (oldVal.length < 1) {
        this.sublistDisabled = true;
      }
    },
  },
  mounted() {
    document.body.ondrop = function (event) {
      // 阻止默认行为
      event.preventDefault();
      event.stopPropagation();
    };
    //this.rowDrop();
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 230;
    });
  },
  methods: {
    inputFieldName(row, fieldName, value) {
      if (value) {
        let v = value.replace(/[^a-zA-Z0-9_]/g, "");
        row[fieldName] = v.toUpperCase();
      }
    },
    //每页条数
    sizeChange(val) {
      this.page.pageSize = val;
    },
    //当前页
    currentChange(val) {
      this.page.currentPage = val;
    },
    //模型权限
    open(row) {
      this.modelId = row.id;
      this.$refs.sonV.open(this.dialogVisible, this.modelId, this.byType);
    },

    //字典table模糊查询
    remoteMethod(query, row) {
      this.tabLoading = true;
      getDbModels(query).then((res) => {
        row.dictTable = res.data.data;
        this.tabLoading = false;
      });
    },
    fieldDictTableChange(row) {
      row.fieldDictField = "";
      row.fieldDictRemark = "";
      if (
        row.fieldDictTable == "blade_dict" ||
        row.fieldDictTable == "blade_dict_biz"
      ) {
        getCodeByDict(row.fieldDictTable).then((res) => {
          this.$set(row, "fieldDictFields", res.data.data);
          this.$set(row, "fieldDictRemarks", []);
        });
      } else {
        getCodeAndValue(row.fieldDictTable).then((res) => {
          this.$set(row, "fieldDictFields", res.data.data);
          this.$set(row, "fieldDictRemarks", res.data.data);
        });
      }
    },
    //验证规则
    getValidType(a) {
      getDictByCode(a).then((res) => {
        this.formValidTypes = res.data.data;
      });
    },
    reveal() {
      //查询顺序显示
      this.isShun = true;
    },
    hide() {
      //查询顺序隐藏
      this.isShun = false;

    },
    // rowDrop() {
    //   //行拖拽
    //   const tbody = document.querySelectorAll(".el-tab-pane tbody")[0];
    //   const tbodys = document.querySelectorAll(".el-tab-pane tbody")[3];
    //   const _this = this;
    //   sortable.create(tbody, {
    //     onEnd({ oldIndex, newIndex }) {
    //       const currRow = _this.add_form.modelFieldList.splice(oldIndex, 1)[0];
    //       _this.add_form.modelFieldList.splice(newIndex, 0, currRow);
    //     }
    //   });
    //   sortable.create(tbodys, {
    //     onEnd({ oldIndex, newIndex }) {
    //       const currRow = _this.add_form.modelQueryList.splice(oldIndex, 1)[0];
    //       _this.add_form.modelQueryList.splice(newIndex, 0, currRow);
    //     }
    //   });
    // },
    handdle(row) {
      //模型关系左边点击，右边显示
      if (row) {
        if (row.modelForeignKeyList) {
          this.arr = row.modelForeignKeyList;
          this.arr.forEach((item) => {
            if (item.dbMainTable && item.dbMainTable != "") {
              rollTableInfo(item.dbMainTable).then((res) => {
                this.$set(item, "dbMainFields", res.data.data);
              });
            }
            if (item.dbRelatedTable && item.dbRelatedTable != "") {
              rollTableInfo(item.dbRelatedTable).then((res) => {
                this.$set(item, "dbRelatedFields", res.data.data);
              });
            }
          });
        } else {
          row.modelForeignKeyList = [];
          this.arr = row.modelForeignKeyList;
        }
      }
    },
    none(formName) {
      this.isBlock = false;
      this.$refs[formName].resetFields();
    },
    dropdownMenu(command) {
      //搜索下拉菜单
      switch (command) {
        case "clear":
          this.clearSearch();
          break;
        case "spread":
          this.Doshow();
          break;
      }
    },
    //搜索的展开收起
    Doshow() {
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    clearList() {
      //清空数据
      this.add_form = {
        modelTable: {
          tableName: "",
          tableRemark: "",
          tableType: "",
          isSync: "",
        },
        modelFieldList: [],
        modelForeignList: [],
        modelQuerySortList: [],
        deleteFieldIdList: [],
        deleteForeignIdLis: [],
        deleteForeignKeyIdList: [],
        deleteTabSortList: [],
      };
      this.arr = [];
      this.formValidTypes = [];
    },
    add() {
      //新增弹框
      this.activeName = "first";
      this.disable = false;
      this.title = "新增";
      this.isBlock = true;
      this.clearList();
      this.add_form.modelTable.isSync = true;
      this.getValidType("form_valid_type");
      basicModelFields().then((res) => {
        res.data.data.forEach((item) => {
          item.formIsShow = 0;
          item.dbIsField = 1;
          item.updateFieldShow = 0;
          item.updateFieldAlter = 0;
          item.updateIsRequired = 0;
          item.displayVisible = 0;
          item.fieldShow = 0;
          item.queryIsShow = 0;
          item.queryIsUse = 0;
          item.listDisplay = 0;
          item.columnFixed = 0;
          item.columnFixed = 0;
          item.queryFuzzySearch = 0;
          if (item.dbFieldName == "CREATE_USER_NAME") {
            item.formInputType = "input";
          }
          if (item.dbFieldName == "CREATE_DEPT_NAME") {
            item.formInputType = "input";
          }
          if (item.dbFieldName == "CREATE_TIME") {
            item.formInputType = "datetime";
          }
        });
        this.add_form.modelFieldList = res.data.data;
        fieldList(this.add_form);
        this.fieldNames = res.data.data;
      });
      rollModelInfo().then((res) => {
        this.options = res.data.data;
      });
    },
    edit(row) {
      //编辑弹框
      //this.openFullScreen2();
      this.activeName = "first";
      this.disable = true;
      this.title = "编辑";
      this.isBlock = true;
      const id = row.id;
      this.getValidType("form_valid_type");
      detail(id).then((res) => {
        this.add_form = res.data.data;
        TableNum(this.add_form); //遍历数据,改后端传过来的1,0,true,false
        TableSync(this.add_form);
        this.add_form.modelFieldList.forEach((item) => {
          item.filedId = item.id;
          if (item.fieldDictTable || item.fieldDictTable != "") {
            if (
              item.fieldDictTable == "blade_dict" ||
              item.fieldDictTable == "blade_dict_biz"
            ) {
              getCodeByDict(item.fieldDictTable).then((res) => {
                this.$set(item, "fieldDictFields", res.data.data);
                this.$set(item, "fieldDictRemarks", []);
              });
            } else {
              getCodeAndValue(item.fieldDictTable).then((res) => {
                this.$set(item, "fieldDictFields", res.data.data);
                this.$set(item, "fieldDictRemarks", res.data.data);
              });
            }
          }
        });
        fieldList(this.add_form);
        this.arr = [];
        this.fieldNames = res.data.data.modelFieldList;
      });
      rollModelInfo().then((res) => {
        this.options = res.data.data;
      });
    },
    clearSearch() {
      //搜索模块的清空
      for (let i in this.search_form) {
        this.search_form[i] = "";
      }
    },
    onLoad(page, params = {}) {
      //加载页面
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },
    searchChange() {
      //查询
      const params = this.search_form;
      this.query = params;
      queryNum(this.query);
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
      if (this.search_form.isSync == 1) {
        this.search_form.isSync = true;
      }
    },
    submite(formName) {
      for (let index in this.add_form.modelFieldList) {
        let fieldName = this.add_form.modelFieldList[index];
        if (!fieldName.dbFieldName) {
          this.$message({
            message: "字段名不能为空",
            type: "warning",
          });
          return;
        }
        // 判断字段名不能为关键字
        let key = keyWord();
        for (let i in key) {
          if (key[i].toUpperCase() == fieldName.dbFieldName.toUpperCase()) {
            this.$message({
              message: "字段名" + fieldName.dbFieldName + "为关键字，不能使用",
              type: "warning",
            });
            return;
          }
        }
        let str = fieldName.dbFieldName.substr(0, 1);
        let reg = /[a-zA-Z]/;
        if (!reg.test(str)) {
          this.$message({
            message:
              "字段名" + fieldName.dbFieldName + "必须以字符开头不能为空",
            type: "warning",
          });
          return;
        }
      }
      /*this.$message({
        message: "正确名",
        type: "success"
      });
      return;*/
      TableNum(this.add_form); //modelTable 单选框true/false->1/0
      fieldListNum(this.add_form); //modelFieldList  单选框true/false->1/0
      //新增   编辑确认按钮
      const row = this.add_form;
      if (this.title === "新增") {
        add(row).then((res) => {
          if (res.data.code == "200") {
            this.onLoad(this.page); //从新加载
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.clearList();
            this.none("add_form.modelTable");
          } else {
            this.$message({
              type: "danger",
              message: res.data.msg,
            });
          }
        });
      } else if (this.title === "编辑") {
        update(row).then((res) => {
          if (res.data.code == 200) {
            this.onLoad(this.page); //重新加载
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.clearList();
            this.none("add_form.modelTable");
          } else {
            this.$message({
              type: "danger",
              message: res.data.msg,
            });
          }
        });
      }
    },
    deepClone(obj) {
      let newObj = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === "object") {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] =
              obj && typeof obj[key] === "object"
                ? this.deepClone(obj[key])
                : obj[key];
          }
        }
      }
      return newObj;
    },
    sync(row) {
      //同步
      this.$confirm("确认更改是否同步?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return syncDb(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    rowDel(row) {
      //删除
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.msg
                ? res.data.msg + " 模型已存在数据，不允许删除"
                : "操作成功!",
            });
          }
          this.onLoad(this.page);
        });
    },
    rowDelmodelFieldList(row, index) {
      //modelFieldList行删除
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.add_form.modelFieldList.splice(index, 1);
        if (row.id) {
          this.add_form.deleteFieldIdList.push(row.id);
          this.add_form.deleteTabConfigList.push(row.queryId);
        }
      });
      // this.add_form.modelFieldList.forEach((item, index) => {
      //   item.orderNum = index + 1;
      // });
    },
    rowDelmodelForeignList(row, index) {
      //modelForeignList行删除
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (index != 0) {
          this.$refs.multipleTable.setCurrentRow(
            this.add_form.modelForeignList[index - 1],
            true
          );
        } else {
          this.$refs.multipleTable.setCurrentRow();
        }

        row.modelForeignKeyList = [];
        this.add_form.modelForeignList.splice(index, 1);
        if (row.id) {
          this.add_form.deleteForeignIdList.push(row.id);
        }
      });
    },
    rowDelmodelForeignKeyList(row, index) {
      //modelForeignKeyList行删除
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.arr.splice(index, 1);
        if (row.id) {
          this.add_form.deleteForeignKeyIdList.push(row.id);
        }
      });
    },
    rowDelmodelQuerySortList(row) {
      //modelQuerySortList行删除
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.add_form.modelQuerySortList.splice(row.$index, 1);
        if (row.id) {
          this.add_form.deleteTabSortList.push(row.id);
        }
      });
    },
    selectionChange(list) {
      this.selectList = list;
    },
    delList() {
      //多选删除
      if (this.selectList.length === 0) {
        this.$message.warning("至少选中一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    addModelFieldList() {
      //行新增
      this.add_form.modelFieldList.push({
        formIsShow: true,
        dbIsField: true,
        fieldShow: true,
        fieldAlter: true,
        dbIsField: true,
        dbIsSystem: 0,
        fieldDictField: "",
        fieldDictRemark: "",
      });
      // this.add_form.modelFieldList.forEach((item, index) => {
      //   item.orderNum = index + 1;
      // });
      this.$nextTick(() => {
        this.$refs.FieldList.bodyWrapper.scrollTop = this.$refs.FieldList.bodyWrapper.scrollHeight;
      });
    },
    addModelForeignList() {
      this.add_form.modelForeignList.push({});
      this.$nextTick(() => {
        this.$refs.multipleTable.bodyWrapper.scrollTop = this.$refs.multipleTable.bodyWrapper.scrollHeight;
      });
      var aa = this.add_form.modelForeignList.length - 1;
      this.$refs.multipleTable.setCurrentRow(
        this.add_form.modelForeignList[aa],
        true
      );
      this.arr = this.add_form.modelForeignList[aa].modelForeignKeyList;
    },
    addModelForeignKeyList() {
      this.arr.push({});
      this.$nextTick(() => {
        this.$refs.ForeignKeyList.bodyWrapper.scrollTop = this.$refs.ForeignKeyList.bodyWrapper.scrollHeight;
      });
    },
    addModelQuerySortList() {
      this.add_form.modelQuerySortList.push({});
      this.$nextTick(() => {
        this.$refs.modelQuerySortList.bodyWrapper.scrollTop = this.$refs.modelQuerySortList.bodyWrapper.scrollHeight;
      });
    },
    tableNameChange(row) {
      //关系模型表   表名下拉数据
      delete row.dbMainField;
      rollTableInfo(row.dbMainTable).then((res) => {
        this.$set(row, "dbMainFields", res.data.data);
      });
    },
    latedTableChange(row) {
      //关系模型表   关联表数据
      delete row.dbRelatedField;
      rollTableInfo(row.dbRelatedTable).then((res) => {
        this.$set(row, "dbRelatedFields", res.data.data);
      });
    },
    dbMainTableChange(val) {
      //模型关系下拉
      findTableNameBySearch(val).then((res) => {
        this.options = res.data.data;
      });
    },
    openFullScreen2() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(f, f, f, 0.8)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },

    handdleClick(){
      this.$refs.modelconfig.submitForm()
      setTimeout(()=>{
        this.searchChange()
      },400)
    },

    handdleAdd(){
      this.visible = true
      this.dialogTitle = '新增'
      this.$nextTick(()=>{
        this.$refs.modelconfig.onLoadBasicModelFields()
      })
    },

    handleEdit(row,index){
      this.visible = true
      this.dialogTitle = '编辑'

      this.$nextTick( async ()=>{
        const { data: res } = await detail(row.id)
        this.$refs.modelconfig.searchForm = res.data.modelTable
        this.$refs.modelconfig.data = res.data.modelFieldList
        this.$refs.modelconfig.setParentData(res.data.modelForeignList)
        this.$refs.modelconfig.tableData = res.data.modelQuerySortList

        this.$refs.modelconfig.setCurrentRowFromEdit()

      })
    },

    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 35px'
    },

    handdleClose(){
      this.visible = false
    }

  },
  computed: {
    ids() {
      let ids = [];
      this.selectList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  created() {
    //获取系统字典
    this.getmodels("field_type").then((res) => {
      this.field_type = res.data.data;
    });
    this.getmodels("control_type").then((res) => {
      this.control_type = res.data.data;
    });
    this.getDicts("model_type").then((res) => {
      this.model_type = res.data.data;
    });
  },
};
</script>
<style lang='scss'>
@import "../../styles/power/formConfig.scss";
@import "../../styles/model/model.scss";
</style>

