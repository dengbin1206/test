<template>
  <div>
    <div class="formCard formCard-none">
      <div class="collapseConetent">
        <div class="item">
          <el-form
            size="small"
            label-width="120px"
            label-suffix=":"
            ref="searchForm"
            :rules="searchRules"
            :model="searchForm"
          >
            <el-row :gutter="10">
              <el-col
                :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12"
                style="display: none"
              >
                <el-form-item label="ID">
                  <el-input v-model="searchForm.id" size="small" disabled />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="模型名" prop="tableName">
                  <el-tooltip
                    content="不是使用关键字"
                    placement="top"
                    v-model="showErrorTableName"
                    :manual="true"
                  >
                    <el-input
                      v-model="searchForm.tableName"
                      placeholder="请输入 模型名(只能输入字母、数字、下划线)"
                      clearable
                      size="small"
                      maxlength="18"
                      class="fieldName"
                      ref="fieldNameColor"
                      @input="
                        (val) => fieldNameInput(val, 'tableName', searchForm)
                      "
                    />
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="模型描述" prop="tableRemark">
                  <el-input
                    v-model="searchForm.tableRemark"
                    placeholder="请输入 模型描述"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="模型分类">
                  <el-select
                    v-model="searchForm.tableType"
                    placeholder="请选择 模型分类"
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
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="同步数据库">
                  <el-checkbox
                    v-model="searchForm.isSync"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <div class="formCard formCard-top">
      <el-tabs v-model="activeName">
        <el-tab-pane label="字段属性" name="first" lazy>
          <div style="margin-top: 10px">
            <el-row :gutter="10">
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="left">
                  <div class="tool">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-plus"
                      @click="handleCreate"
                      >新增</el-button
                    >
                  </div>
                  <div class="listcontent">
                    <draggable
                      class="list"
                      tag="ul"
                      v-bind="dragOptions"
                      ghost-class="ghost"
                      v-model="data"
                      @start="startDrag"
                      @end="endDrag"
                    >
                      <transition-group
                        type="transition"
                        class="list-inner"
                        :name="!drag ? 'flip-list' : null"
                      >
                        <li
                          v-for="(item, index) in data"
                          :key="index + 1"
                          @click="handleSelect(item, index)"
                          :class="[index === active ? 'active' : '']"
                        >
                          <div>
                            <div style="text-transform: uppercase">
                              {{ item.dbFieldName }}
                            </div>
                            <div
                              style="color: rgb(144, 147, 153); font-size: 12px"
                            >
                              {{ item.dbFieldRemark }}
                            </div>
                          </div>
                          <div v-if="item.dbIsSystem !== 1">
                            <el-button
                              size="mini"
                              circle
                              icon="el-icon-delete"
                              type="danger"
                              :disabled="item.dbIsSystem == 1 ? true : false"
                              @click="handleDelete(item, index)"
                            ></el-button>
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </div>
                </div>
              </el-col>
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <div class="right">
                  <el-form
                    label-width="128px"
                    label-suffix=":"
                    size="mini"
                    :model="form"
                  >
                    <el-row :gutter="10">
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字段名">
                          <el-tooltip
                            content="不是使用关键字"
                            placement="top"
                            v-model="showError"
                            :manual="true"
                          >
                            <el-input
                              size="mini"
                              :disabled="form.dbIsSystem == 1 ? true : false"
                              v-model="form.dbFieldName"
                              class="fieldName"
                              ref="mycolor"
                              clearable
                              maxlength="30"
                              placeholder="请输入 字段名(只能输入字母、数字、下划线)"
                              @input="
                                (val) =>
                                  fieldNameInput(val, 'dbFieldName', form)
                              "
                            ></el-input>
                          </el-tooltip>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字段描述">
                          <el-input
                            size="mini"
                            v-model="form.dbFieldRemark"
                            clearable
                            placeholder="请输入 字段描述"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字段类型">
                          <el-select
                            size="mini"
                            v-model="form.dbType"
                            clearable
                            placeholder="请选择 字段类型"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                          >
                            <el-option
                              v-for="item in field_type"
                              :key="item.dictKey"
                              :label="item.dictValue"
                              :value="item.dictKey"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字段长度">
                          <el-input-number
                            size="mini"
                            v-model="form.dbLength"
                            clearable
                            :max="5000"
                            :min="1"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                            style="width: 100%"
                          ></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="小数位">
                          <el-input-number
                            size="mini"
                            v-model="form.dbPointLength"
                            clearable
                            :max="10"
                            :min="0"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                            style="width: 100%"
                          ></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="是否是数据库字段">
                          <div class="el-input el-input--mini">
                            <el-checkbox
                              v-model="form.dbIsField"
                              :true-label="1"
                              :false-label="0"
                              :disabled="form.dbIsSystem == 1 ? true : false"
                            ></el-checkbox>
                          </div>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="新增可见">
                          <el-checkbox
                            v-model="form.fieldShow"
                            :true-label="1"
                            :false-label="0"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="新增可改">
                          <el-checkbox
                            v-model="form.fieldAlter"
                            :true-label="1"
                            :false-label="0"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="新增必填">
                          <el-checkbox
                            v-model="form.isRequired"
                            :true-label="1"
                            :false-label="0"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="修改可见">
                          <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="form.updateFieldShow"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="修改可改">
                          <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="form.updateFieldAlter"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="修改必填">
                          <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="form.updateIsRequired"
                            :disabled="form.dbIsSystem == 1 ? true : false"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
                        <el-form-item label="显示可见">
                          <el-checkbox
                            :true-label="1"
                            :false-label="0"
                            v-model="form.displayVisible"
                          ></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="新建界面默认值">
                          <el-input
                            size="mini"
                            clearable
                            placeholder="默认值支持字符串、公式、编码规则"
                            v-model="form.formDefaultValue"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="保存默认值">
                          <el-input
                            size="mini"
                            clearable
                            placeholder="默认值支持字符串、公式、编码规则"
                            v-model="form.dbDefaultValue"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="控件类型">
                          <el-select
                            size="mini"
                            v-model="form.formInputType"
                            placeholder="请选择 控件类型"
                            clearable
                          >
                            <el-option
                              v-for="item in control_type"
                              :key="item.dictKey"
                              :label="item.dictValue"
                              :value="item.dictKey"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="控件宽度">
                          <el-select
                            size="mini"
                            v-model="form.formSpan"
                            clearable
                            placeholder="请选择 控件宽度"
                          >
                            <el-option label="25%" value="6"></el-option>
                            <el-option label="50%" value="12"></el-option>
                            <el-option label="75%" value="18"></el-option>
                            <el-option label="100%" value="24"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字典Table">
                          <el-select
                            v-model="form.fieldDictTable"
                            clearable
                            filterable
                            @change="fieldDictTableChange"
                            placeholder="请选择 字典Table"
                          >
                            <el-option
                              v-for="item in dictTable"
                              :key="item.id"
                              :label="item.tableRemark"
                              :value="item.dbTableName"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字典Code">
                          <el-select
                            size="mini"
                            v-model="form.fieldDictField"
                            clearable
                            filterable
                            placeholder="请选择 字典Code"
                          >
                            <el-option
                              v-for="item in fieldDictFields"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="字典Text">
                          <el-select
                            size="mini"
                            v-model="form.fieldDictRemark"
                            clearable
                            filterable
                            placeholder="请选择 字典Text"
                          >
                            <el-option
                              v-for="item in fieldDictRemarks"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="表单背景提示语">
                          <el-input
                            size="mini"
                            v-model="form.formPlaceholder"
                            clearable
                            placeholder="请输入 背景提示语"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="验证规则">
                          <el-select
                            size="mini"
                            v-model="form.formValidType"
                            placeholder="请选择 验证规则"
                            clearable
                          >
                            <el-option
                              v-for="item in formValidTypes"
                              :key="item.dictKey"
                              :label="item.dictValue"
                              :value="item.dictKey"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="名称写入字段">
                          <el-select
                            size="mini"
                            v-model="form.remarkFieldName"
                            clearable
                            filterable
                            placeholder="请选择 名称写入字段"
                          >
                            <el-option
                              v-for="(item, index) in data"
                              :key="index"
                              :label="item.dbFieldRemark"
                              :value="item.dbFieldName"
                            >
                              <span style="float: left">{{
                                item.dbFieldName
                              }}</span>
                              <span
                                style="
                                  float: right;
                                  color: #8492a6;
                                  font-size: 13px;
                                "
                                >{{ item.dbFieldRemark }}</span
                              >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="扩展参数">
                          <el-input
                            size="mini"
                            clearable
                            v-model="form.formExtendValue"
                            placeholder="支持计算公式等"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="控制其他字段脚本">
                          <el-input
                            size="mini"
                            clearable
                            type="textarea"
                            :rows="3"
                            v-model="form.controlOtherField"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="模型关系" name="second">
          <modelRelation ref="modelRelation"></modelRelation>
        </el-tab-pane>
        <el-tab-pane label="查询配置" name="third">
          <div style="margin-top: 10px">
            <el-row :gutter="10">
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <div class="left">
                  <div class="listcontent full">
                    <draggable
                      class="list"
                      tag="ul"
                      v-bind="dragOptions"
                      ghost-class="ghost"
                      v-model="data"
                      @start="startDrag"
                      @end="endDrag"
                    >
                      <transition-group
                        type="transition"
                        class="list-inner"
                        :name="!drag ? 'flip-list' : null"
                      >
                        <li
                          v-for="(item, index) in data"
                          :key="index + 1"
                          @click="handleSelect(item, index)"
                          :class="[index === active ? 'active' : '']"
                        >
                          <div>
                            <div style="text-transform: uppercase">
                              {{ item.dbFieldName }}
                            </div>
                            <div
                              style="color: rgb(144, 147, 153); font-size: 12px"
                            >
                              {{ item.dbFieldRemark }}
                            </div>
                          </div>
                          <div v-if="item.dbIsSystem !== 1">
                            <el-button
                              size="mini"
                              circle
                              icon="el-icon-delete"
                              type="danger"
                              :disabled="item.dbIsSystem == 1 ? true : false"
                              @click="handleDelete(item, index)"
                            ></el-button>
                          </div>
                        </li>
                      </transition-group>
                    </draggable>
                  </div>
                </div>
              </el-col>
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <div class="right">
                  <div class="from">
                    <el-form
                      label-width="150px"
                      label-suffix=":"
                      size="mini"
                      :model="subForm"
                    >
                      <el-row :gutter="10">
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="字段名">
                            <el-input
                              size="mini"
                              :disabled="form.dbIsSystem == 1 ? true : false"
                              v-model="form.dbFieldName"
                              class="fieldName"
                              clearable
                              maxlength="30"
                              placeholder="请输入 字段名(只能输入字母、数字、下划线)"
                              @input="
                                (val) =>
                                  fieldNameInput(val, 'dbFieldName', form)
                              "
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="查询字段描述">
                            <el-input
                              size="mini"
                              v-model="form.queryDbFieldRemark"
                              clearable
                              placeholder="请输入 查询字段描述"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="启用查询条件">
                            <el-checkbox
                              v-model="form.queryIsUse"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="显示查询条件">
                            <el-checkbox
                              v-model="form.queryIsShow"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="启用模糊查询">
                            <el-checkbox
                              v-model="form.queryFuzzySearch"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="查询界面排序">
                            <el-input-number
                              size="mini"
                              v-model="form.queryOrderNum"
                              clearable
                              :min="0"
                              style="width: 100%"
                              placeholder="请输入 查询条件排序"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="查询类型">
                            <el-select
                              v-model="form.queryType"
                              placeholder="请选择 查询类型"
                              clearable
                            >
                              <el-option label="普通查询" value="1"></el-option>
                              <el-option label="范围查询" value="2"></el-option>
                              <el-option label="组合查询" value="3"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="查询控件类型">
                            <el-select
                              v-model="form.queryControlType"
                              placeholder="请选择 查询控件类型"
                              clearable
                            >
                              <el-option
                                v-for="item in control_type"
                                :key="item.dictKey"
                                :label="item.dictValue"
                                :value="item.dictKey"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="列表显示">
                            <el-checkbox
                              v-model="form.listDisplay"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="冻结列">
                            <el-checkbox
                              v-model="form.columnFixed"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item>
                            <!-- 占位 -->
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="列表显示长度">
                            <el-input
                              size="mini"
                              clearable
                              v-model="form.columnLength"
                              placeholder="请输入 列表显示长度"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="列对齐方式">
                            <el-select
                              v-model="form.columnAlign"
                              placeholder="请选择 列对齐方式"
                              clearable
                            >
                              <el-option
                                label="左对齐"
                                value="left"
                              ></el-option>
                              <el-option
                                label="居中"
                                value="center"
                              ></el-option>
                              <el-option
                                label="右对齐"
                                value="right"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="查询默认值">
                            <el-input
                              size="mini"
                              clearable
                              v-model="form.queryDefaultValue"
                              placeholder="请输入 查询默认值"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                          <el-form-item label="查询条件背景提示语">
                            <el-input
                              size="mini"
                              clearable
                              v-model="form.queryPlaceholder"
                              placeholder="请输入 查询条件背景提示语"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="启用移动端查询">
                            <el-checkbox
                              v-model="form.mobileQuery"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item label="移动端列表显示">
                            <el-checkbox
                              v-model="form.mobileDisplay"
                              :true-label="1"
                              :false-label="0"
                            ></el-checkbox>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                          <el-form-item>
                            <!-- 占位 -->
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                  <el-table
                    :data="tableData"
                    ref="dragTable"
                    border
                    stripe
                    @cell-mouse-enter="cellMouseEnter"
                    @cell-mouse-leave="cellMouseLeave"
                    row-key="orderNum"
                  >
                    <el-table-column
                      type="index"
                      label="排序"
                      width="60"
                      align="center"
                    >
                      <template slot="header">
                        <el-button
                          type="primary"
                          circle
                          size="mini"
                          icon="el-icon-plus"
                          @click="handleCreateRow"
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
                          @click="handleDeleteRow(scope.row, scope.$index)"
                        ></el-button>
                        <span v-else>{{ scope.$index + 1 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="60"
                      align="center"
                      class="handler"
                    >
                      <template>
                        <i class="iconfont iconfont-menu handler"></i>
                      </template>
                    </el-table-column>
                    <el-table-column prop="id" label="字段名" align="center">
                      <template slot-scope="scope">
                        <el-select
                          size="mini"
                          clearable
                          placeholder="请选择字段名"
                          filterable
                          v-model="scope.row.fieldName"
                        >
                          <el-option
                            v-for="(item, index) in data"
                            :key="index"
                            :label="item.dbFieldRemark"
                            :value="item.dbFieldName"
                          >
                            <span style="float: left">{{
                              item.dbFieldName
                            }}</span>
                            <span
                              style="
                                float: right;
                                color: #8492a6;
                                font-size: 13px;
                              "
                              >{{ item.dbFieldRemark }}</span
                            >
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="排序方式"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.sortOrder"
                          placeholder="请选择顺序"
                          size="mini"
                        >
                          <el-option label="升序" value="0"></el-option>
                          <el-option label="降序" value="1"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
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
import { keyWord } from "@/utils/db_key_word.js";
import { getDictByCode } from "@/api/system/dict";
import { options } from "./index";
import modelRelation from "./modelRelation";
import draggable from "vuedraggable";
import Sortable from "sortablejs";

export default {
  name: "modelconfig",
  components: {
    draggable,
    modelRelation,
  },
  data() {
    return {
      options,
      active: null,
      activeName: "first",
      data: [],
      fieldOptions: [],
      form: {},
      subForm: {},
      dataInfo: {},
      drag: false,
      field_type: [],
      control_type: [],
      model_type: [],
      formValidTypes: [],
      fieldDictFields: [],
      fieldDictRemarks: [],
      activeNames: ["1"],
      tableData: [],
      show: false,
      searchForm: {
        tableName: "",
        tableRemark: "",
        tableType: "",
        isSync: 1,
      },
      searchRules: {
        tableName: [
          { required: true, message: "模型名 必填", trigger: "blur" },
        ],
        tableRemark: [
          { required: true, message: "模型描述 必填", trigger: "blur" },
        ],
      },
      dragOptions: {
        animation: 200,
        disabled: false,
        ghostClass: "ghost",
      },
      dictTable: [],
      deleteFieldIdList: [],
      deleteTabSortList: [],
      showError: false,
      showErrorTableName: false,
      hasId: false
    };
  },

  created() {

    this.$nextTick(() => {
      this.handleTableDrag();

      this.$refs.mycolor.$el.style.setProperty("--color", "#409EFF");
    });

    this.getValidType("form_valid_type");

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

    getDbModels().then((res) => {
      this.dictTable = res.data.data;
    });
  },

  methods: {
    handleCreate() {
      let item = {
        dbFieldName: `FIELD_${this._.random(100000, 999999)}`,
        dbFieldRemark: "描述",
        dbType: "String",
        dbLength: 50,
        orderNum: this.data.length + 1,
        dbIsSystem: 0,
        dbIsField: 1,
        fieldShow: 1,
        fieldAlter: 1,
        updateFieldShow: 1,
        updateFieldAlter: 1,
        displayVisible: 1,
      };

      this.data.push(item);

      this.form = item;
    },

    handleDelete(item, index) {
      this.data.splice(index, 1);
      this.data.forEach((e, i) => {
        e.orderNum = i + 1;
      });
      setTimeout(() => {
        this.form = this._.last(this.data);
        this.dictCode(this.form.fieldDictTable);
      }, 200);

      if (item.id) {
        this.deleteFieldIdList.push(item.id);
      }
    },

    handleSelect(item, index) {
      this.form = {};
      this.form = item;
      this.active = index;
      this.dictCode(this.form.fieldDictTable);
    },

    async onLoadBasicModelFields() {
      const { data } = await basicModelFields();
      this.data = data.data;
      this.form.fieldDictTable = "";

      setTimeout(() => {
        this.form = this._.head(this.data);
      }, 200);
    },

    startDrag(e) {
      this.drag = true;
    },

    endDrag(e) {
      this.drag = false;
      this.data = this.data.map((e, i) => {
        return {
          ...e,
          orderNum: i + 1,
        };
      });
      let newIndex = e.newIndex;
      this.form = this.data[newIndex];
    },

    fieldDictTableChange() {
      this.$set(this.form, "fieldDictField", "");
      this.$set(this.form, "fieldDictRemark", "");

      this.dictCode(this.form.fieldDictTable);
    },

    dictCode(fieldDictTable) {
      this.fieldDictFields = [];
      this.fieldDictRemarks = [];
      if (fieldDictTable) {
        getCodeAndValue(this.form.fieldDictTable).then((res) => {
          this.fieldDictFields = res.data.data;
          this.fieldDictRemarks = res.data.data;
        });
      }
    },

    getValidType(type) {
      getDictByCode(type).then((res) => {
        this.formValidTypes = res.data.data;
      });
    },

    handleTableDrag() {
      const table = this.$refs.dragTable;
      const el = table.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];

      Sortable.create(el, {
        disabled: false,
        ghostClass: "ghost",
        animation: 150,
        onEnd: (e) => {
          let arr = this.tableData;
          arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]); // 获取最新的数据
          this.$nextTick(() => {
            this.tableData = arr;
            console.log(this.tableData);
          });
          this.tableData = arr;
        },
      });
    },

    handleCreateRow() {
      this.tableData.push({
        orderNum: this.tableData.length,
        show: false,
      });
    },

    cellMouseEnter(row, column, cell, event) {
      this.$set(row, "show", true);
    },

    cellMouseLeave(row, column, cell, event) {
      this.$set(row, "show", false);
    },

    handleDeleteRow(row, index) {
      this.tableData.splice(index, 1);

      if (row.id) {
        this.deleteTabSortList.push(row.id);
      }
    },

    fieldNameInput(value, type, form) {
      let list = keyWord();
      let inputVal = value.replace(/[^\w\_\/]/gi, "").toUpperCase();
      this.showError = false;
      this.showErrorTableName = false;
      // css 使用 var 变量绑定改变
      this.$refs.mycolor.$el.style.setProperty("--color", "#409EFF");
      this.$refs.fieldNameColor.$el.style.setProperty("--color", "#409EFF");
      for (let key in list) {
        if (list[key] === inputVal) {
          if (type === "dbFieldName") {
            this.showError = true;
            this.$refs.mycolor.$el.style.setProperty("--color", "#f56c6c");
          }
          if (type === "tableName") {
            this.showErrorTableName = true;
            this.$refs.fieldNameColor.$el.style.setProperty(
              "--color",
              "#f56c6c"
            );
          }
          return;
        }
      }
      this.$set(form, type, value.replace(/[^\w\_\/]/gi, "").toUpperCase());
    },

    submitForm() {
      this.$refs["searchForm"].validate(async (valid) => {
        if (valid) {
          let payload = {
            modelTable: this.searchForm,
            modelFieldList: this.data,
            modelForeignList: this.$refs.modelRelation.parentData,
            modelQuerySortList: this.tableData,
            deleteFieldIdList: this.deleteFieldIdList,
            deleteForeignIdList: this.$refs.modelRelation.deleteForeignIdList,
            deleteForeignKeyIdList: this.$refs.modelRelation
              .deleteForeignKeyIdList,
            deleteTabSortList: this.deleteTabSortList,
          };

          const { data } = await add(payload);

          if (data.code === 200) {
            this.$message.success(data.msg);
            this.$parent.handleClose();
            this.$parent.close();

            this.deleteFieldIdList = [];
            this.$refs.modelRelation.deleteForeignIdList = [];
            this.$refs.modelRelation.deleteForeignKeyIdList = [];
            this.deleteTabSortList = [];
          } else {
            this.$message.success(data.msg);
          }
        } else {
          return false;
        }
      });
    },

    setParentData(data) {
      this.$refs.modelRelation.parentData = data;
    },

    setCurrentRowFromEdit() {
      this.$refs.modelRelation.setCurrentRowFromEdit();
    },
  },
};
</script>

<style lang="scss" scoped>
.formCard {
  .control {
    padding: 10px;
    i {
      font-size: 20px;
      cursor: pointer;
    }

    .roate {
      transform: rotate(90deg);
      transition: all 0.5s;
    }

    .roateBack {
      transform: rotate(0deg);
      transition: all 0.5s;
    }
  }

  .collapseConetent {
    .item {
      padding: 15px;
      padding-right: 55px;
      padding-top: 25px;

      /deep/.el-form {
        .el-row {
          div {
            .el-form-item {
              .el-form-item__content {
                .fieldName {
                  .el-input__inner {
                    text-transform: uppercase !important;
                    &:focus {
                      // border-color: #409EFF;
                      border-color: var(--color);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  &-none {
    border: 1px solid #dcdfe6;
    padding: 0;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  &-top {
    margin-top: 20px;
    overflow-y: auto;
  }

  .left {
    height: 620px;
    border: 1px solid #dcdfe6;

    .tool {
      background-color: #fff;
      display: flex;
      padding: 5px;
      align-items: center;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .listcontent {
      overflow-y: auto;
      padding: 10px;
      height: calc(620px - 45px);

      &::-webkit-scrollbar {
        width: 0;
      }

      .list {
        .list-inner {
          li {
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
              0 0 6px rgba(0, 0, 0, 0.04);
            padding: 0 10px;
            background: #f4f6fc;
            margin-bottom: 10px;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
          }

          .active {
            border: 2px solid #409eff;
          }
        }

        .ghost {
          background: white;
          border-top: 5px solid #f56c6c;
          box-sizing: border-box;
          font-size: 0;
          content: "";
          overflow: hidden;
          padding: 0 !important;
          position: relative;
          outline: none 0;
          height: 0 !important;
          width: 100%;
          margin: 2px 0;
        }
      }
    }

    .full {
      height: 610px;
    }

    .list-group {
      .listItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .showCase {
          width: 100%;
          margin-right: 5px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
          background-color: #f4f6fc;
          padding: 0 10px;

          &:hover {
            cursor: pointer;
            outline: 1px dashed #0079fe;
          }
        }

        &-left {
          justify-content: flex-start;
        }
      }
    }
  }

  .right {
    border: 1px solid #dcdfe6;
    height: 620px;
    overflow-y: auto;
    padding: 20px;

    .handler {
      cursor: move;
    }

    /deep/.el-form {
      .el-row {
        div {
          .el-form-item {
            .el-form-item__content {
              .fieldName {
                .el-input__inner {
                  text-transform: uppercase !important;

                  &:focus {
                    // border-color: #409EFF;
                    border-color: var(--color);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .ghost {
    background: white;
    border-top: 5px solid #f56c6c;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0 !important;
    position: relative;
    outline: none 0;
    height: 0 !important;
    width: 100%;
    margin: 2px 0;
  }
}
</style>
