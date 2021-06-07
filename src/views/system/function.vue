<template>
  <basic-container class="sx_menu_style">
    <el-form :inline="true" label-width="130px" class="sx_model_search sx_formItem">
      <el-row>
        <el-col :span="10">
          <el-form-item label="功能名称:">
            <el-input
              v-model="search_form.name"
              placeholder="请输入功能名称"
              clearable
              size="small"
              @keyup.enter.native="searchChange()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="功能编号:">
            <el-input
              v-model="search_form.code"
              placeholder="请输入功能编号"
              clearable
              size="small"
              @keyup.enter.native="searchChange()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchChange()">查询</el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="primary" size="small">
                <i class="el-icon-arrow-down"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="clear">清空</el-dropdown-item>
                <el-dropdown-item command="spread">{{isShow ? '收起' : '展开'}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </el-col>
      </el-row>
      <el-collapse v-show="isShow">
        <el-row>
          <el-col :span="10">
            <el-form-item label="功能别名:">
              <el-input
                v-model="search_form.alias"
                placeholder="请输入功能别名"
                clearable
                size="small"
                maxlength="10"
                @keyup.enter.native="searchChange()"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse>
    </el-form>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      @row-del="rowDel"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @tree-load="treeLoad"
      :cell-style="cellStyle"
      :row-style="rowStyle"
    >
      <template slot="menuLeft">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增功能</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addBtn"
          :disabled="selectionList.length!=1"
        >新增按钮</el-button>
        <el-button type="primary" size="small" icon="el-icon-document-copy">复制到租户</el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="permission.menu_delete"
          plain
          @click="handleDelete"
        >删 除</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" icon="el-icon-view" size="small" @click.stop="view(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="small" @click.stop="edit(scope.row)">编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="handleDel(scope.row,scope.index)"
        >删除</el-button>
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="handleAdd(scope.row,scope.index)"
          v-if="userInfo.role_name.includes('admin')"
        >新增子项</el-button>
        <el-button
          type="text"
          icon="el-icon-setting"
          size="small"
          @click="permissionConfig(scope.row)"
        >权限配置</el-button>
      </template>
      <template slot-scope="{row}" slot="source">
        <div style="text-align:center">
          <i :class="row.source" />
        </div>
      </template>
    </avue-crud>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
      class="sx_dialog"
      :close-on-click-modal="close"
    >
      <el-form
        ref="add_form"
        :model="add_form"
        :show-message="show_message"
        :rules="rules"
        label-width="110px"
        class="sx_menu_form"
        size="mini"
      >
        <el-row>
          <!-- <el-col :span='12'>
            <el-form-item label="上级功能:">
              <avue-input-tree default-expand-all v-model="add_form.parentId" placeholder="请选择内容" type="tree" :dic="treeData"  :disabled="parentDisable"></avue-input-tree>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="功能编号:" prop="code">
              <el-input v-model="add_form.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能名称:" prop="name">
              <el-input v-model="add_form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功能别名:" prop="alias">
              <el-input v-model="add_form.alias"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能图标:" prop="source">
              <avue-input-icon v-model="add_form.source" placeholder="请选择图标" :icon-list="iconList"></avue-input-icon>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源:">
              <el-radio-group v-model="add_form.dataResource" @change="switchChange">
                <el-radio label="S">手工配置</el-radio>
                <el-radio label="F">表单</el-radio>
                <el-radio label="M">模型</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="aLabel">
              <el-select
                v-model="add_form.modelFormName"
                filterable
                clearable
                reserve-keyword
                placeholder="请输入关键词模糊搜索"
                :loading="loading5"
                :disabled="disabled"
                @change="getUrl"
              >
                <el-option
                  v-for="item in resources"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由地址:">
              <el-input v-model="add_form.path" :disabled="disabledes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能排序:" prop="sort">
              <el-input v-model="add_form.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首页界面:" prop="category">
              <el-radio-group v-model="add_form.category">
                <el-radio label="1">列表</el-radio>
                <el-radio label="2">新增</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单显示位置:" >
              <el-select v-model="add_form.showType"  placeholder="请选择">
                <el-option
                  v-for="item in menuViewList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功能备注:" prop="remark">
              <el-input type="textarea" v-model="add_form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submit('add_form')"
          size="small"
          icon="el-icon-circle-check"
        >确 定</el-button>
        <el-button @click="cancel('add_form')" size="small" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="btnTitle"
      :visible.sync="dialogButton"
      width="60%"
      append-to-body
      class="sx_dialog"
      :close-on-click-modal="close"
    >
      <el-form
        ref="addBtn_form"
        :model="addBtn_form"
        :show-message="show_message"
        :rules="btnRules"
        label-width="110px"
        class="sx_menu_form"
        size="mini"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级功能:">
              <avue-input-tree
                default-expand-all
                v-model="addBtn_form.parentId"
                placeholder="请选择内容"
                type="tree"
                :dic="treeData"
                disabled
              ></avue-input-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按钮名称:" prop="name">
              <el-input v-model="addBtn_form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮编号:" prop="code">
              <el-input v-model="addBtn_form.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按钮图标:">
              <avue-input-icon
                v-model="addBtn_form.source"
                placeholder="请选择图标"
                :icon-list="iconList"
              ></avue-input-icon>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮显示界面:">
              <el-select v-model="addBtn_form.btnShowList" multiple placeholder="请选择">
                <el-option
                  v-for="item in btnShow"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按钮显示条件">
              <el-input v-model="addBtn_form.btnShowCondition"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事件:">
              <el-select v-model="addBtn_form.things" clearable placeholder="请选择">
                <el-option
                  v-for="item in eventOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="触发事件:">
              <el-select v-model="addBtn_form.triggerConditions" clearable placeholder="请选择">
                <el-option
                  v-for="item in triggerEvent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否控制权限:">
              <el-checkbox
                v-model="addBtn_form.isPower"
                :checked="addBtn_form.isPower == 1 ? true :false"
                :true-label="1"
                :false-label="0"
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按钮排序:">
              <el-input v-model="addBtn_form.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按钮备注:">
              <el-input type="textarea" v-model="addBtn_form.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="addBtn_form.things == '2'">
            <el-form-item label="表单名:">
              <el-select
                v-model="addBtn_form.modelFormName"
                filterable
                clearable
                reserve-keyword
                placeholder="请输入关键词模糊搜索"
                :loading="loading6"
              >
                <el-option
                  v-for="item in allFormList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="addBtn_form.things == '4'">
            <el-form-item label="路由:">
              <el-input v-model="addBtn_form.path"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="addBtn_form.things == '3'">
            <el-form-item label="其他功能:">
              <el-select
                style="width:50% !important"
                v-model="addBtn_form.otherFunctionId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词模糊搜索"
                :remote-method="OtherFunc"
                :loading="loading5"
                @change="getOtherFuncBtn"
              >
                <el-option
                  v-for="item in OtherFunctionId"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="width:50% !important"
                v-model="addBtn_form.otherBtn"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in OtherFunctionBtn"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="addBtn_form.triggerConditions == '7' || addBtn_form.triggerConditions == '5' || addBtn_form.triggerConditions == '8'"
          >
            <el-form-item label="绑定流程:">
              <el-select
                style="width:100% !important"
                v-model="addBtn_form.flowKey"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词模糊搜索"
                :remote-method="flowFunc"
                :loading="loading6"
              >
                <el-option
                  v-for="item in flowKeyOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitBtn('addBtn_form')"
          size="small"
          icon="el-icon-circle-check"
        >确 定</el-button>
        <el-button @click="dialogButton = false" size="small" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="permissionForm.title"
      :visible.sync="permissDialogVisible"
      width="50%"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addPermission">插入行</el-button>
      <el-table
        :data="tabelPermissionList"
        border
        max-height="500px"
        style="width: 100%;margin-top:10px"
      >
        <el-table-column prop="modelId" label="模型" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.modelId"
              filterable
              remote
              size="small"
              reserve-keyword
              :remote-method="(query)=>searchModel(query,scope.row)"
              placeholder="请输入模型"
              :loading="modelIdLoading"
              @change="(value)=>selectModelId(value,scope.row)"
            >
              <el-option
                v-for="item in scope.row.model"
                :key="item.id"
                :label="item.tableRemark"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="modelFieldId" label="模型字段" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.modelFieldId"
              size="small"
              placeholder="请选择模型字段"
              clearable
            >
              <el-option
                v-for="item in scope.row.modelField"
                :key="item.id"
                :label="item.dbFieldRemark"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="isShow" label="可见" align="center" width="60px">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isShow"
              :true-label="1"
              :false-label="0"
              @change="(value)=>selectIsEdit(value,scope.row,0)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="isEdit" label="可改" align="center" width="60px">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isEdit"
              :true-label="1"
              :false-label="0"
              @change="(value)=>selectIsEdit(value,scope.row,1)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <template slot-scope="scope">
            <!-- <el-button
              type="text"
              size="small"
              @click="handelDesign(scope.row, scope.index)"
            >编 辑</el-button>-->
            <el-button
              type="text"
              size="small"
              style="color:red"
              icon="el-icon-delete"
              @click="handelPermissionDelete(scope.row, scope.$index)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" icon="el-icon-document" @click="permissionSave()">保 存</el-button>
        <el-button
          size="small"
          @click="permissDialogVisible = false"
          icon="el-icon-circle-close"
        >取 消</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>
<script>
import {
  getLazyList,
  getLazyNewList,
  remove,
  update,
  add,
  getMenu,
  getResource,
  otherFuncSearch,
  otherFuncBtn,
  getFormName,
  submitBtn,
  getFlowModelByKeySearch,
  getModelId,
  getModelFieldId,
  permissionSubmit,
  getPermissionList,
  permissionRemove
} from "@/api/system/function";
import { mapGetters } from "vuex";
import iconList from "@/config/iconList";
import { getMenuList } from "@/api/system/function";
import { allFormList } from "@/api/tool/formDesigner";
import { rollModelInfo } from "@/api/tool/model";
import label from "../../forms/config/label";

export default {
  data() {
    return {
      clickquery:"",
      btnDisabled: false, //新增按钮控制禁用否
      iconList: iconList,
      allFormList: [],
      allModelList: [],
      parentDisable: true,
      disabledes: false,
      aLabel: "功能来源",
      maps: new Map(),
      rules: {
        name: [{ required: true, trigger: "blur" }],
        code: [{ required: true, trigger: "blur" }],
        source: [{ required: true, trigger: "blur" }],
        alias: [{ required: true, trigger: "blur" }],
        category: [{ required: true, trigger: "blur" }],
        sort: [{ required: true, trigger: "blur" }]
      },
      btnRules: {
        name: [{ required: true, trigger: "blur" }],
        code: [{ required: true, trigger: "blur" }]
      },
      show_message: false,
      close: false,
      title: "",
      btnTitle: "",
      resources: [],
      treeData: [],
      disabled: true,
      search_form: {
        name: "",
        code: "",
        alias: ""
      },
      menuViewList:[{
        label:'PC端显示',
        value:1
      },
      {
        label:'移动端显示',
        value:2
      },
      {
        label:'PC+移动显示',
        value:3
      }],
      //新增功能表单
      add_form: {
        name: "",
        code: "",
        source: "",
        dataResource: "S",
        modelFormName: "",
        radio: "",
        select: "",
        alias: "",
        path: "",
        category: "1",
        sort: "",
        remark: ""
      },
      //新增按钮表单
      addBtn_form: {
        parentId: "",
        code: "",
        name: "",
        source: "",
        btnShowList: "",
        btnShowCondition: "",
        things: "",
        triggerConditions: "",
        isPower: "",
        path: "",
        modelFormName: "",
        sort: "",
        otherFunctionId: "",
        otherBtn: "",
        remark: "",
        category: "2",
        flowKey: ""
      },
      btnShow: [], //按钮显示界面
      OtherFunctionId: [], //其他功能Id
      OtherFunctionBtn: [], //其他功能按钮
      getFormName: [], //表单名
      flowKeyOption: [],
      dialogVisible: false,
      permissDialogVisible: false,
      modelIdLoading: false,
      modelFieldIdLoading: false,
      functionId: "",
      tabelPermissionList: [],
      permissionForm: {},
      dialogButton: false,
      form: {},
      query: {},
      isShow: false,
      loading: true,
      loading5: false,
      loading6: false,
      selectionList: [],
      parentId: 0,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: null
      },
      eventOption: [
        {
          value: "1",
          label: "本功能"
        },
        {
          value: "2",
          label: "表单"
        },
        {
          value: "3",
          label: "其他功能"
        },
        {
          value: "4",
          label: "自定义"
        }
      ],
      triggerEvent: [
        {
          value: "1",
          label: "新增"
        },
        {
          value: "2",
          label: "编辑"
        },
        {
          value: "3",
          label: "查看"
        },
        {
          value: "4",
          label: "删除"
        },
        {
          value: "5",
          label: "发起流程"
        },
        {
          value: "6",
          label: "保存"
        },
        {
          value: "7",
          label: "保存并发起流程"
        },
        {
          value: "8",
          label: "查看流程审批"
        },
        {
          value: "9",
          label: "流程图"
        },
        {
          value: "10",
          label: "导入"
        }
      ],
      option: {
        viewBtn: false,
        editBtn: false,
        refreshBtn: false,
        columnBtn: false,
        addBtn: false,
        delBtn: false,
        lazy: true,
        tip: false,
        simplePage: false,
        searchShow: false,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        tree: true,
        border: true,
        index: true,
        selection: true,
        align: "center",
        menuWidth: 350,
        dialogClickModal: false,
        headerAlign: "center",
        column: [
          {
            label: "上级菜单",
            prop: "parentId",
            type: "tree",
            dicData: [],
            hide: true,
            props: {
              label: "title"
            },
            rules: [
              {
                required: false,
                message: "请选择上级菜单",
                trigger: "click"
              }
            ]
          },
          {
            label: "功能名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入功能名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "功能编号",
            prop: "code",
            rules: [
              {
                required: true,
                message: "请输入功能编号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "功能图标",
            prop: "source",
            type: "icon-select",
            slot: true,
            iconList: this.iconList,
            rules: [
              {
                required: true,
                message: "请输入功能图标",
                trigger: "click"
              }
            ]
          },
          {
            label: "来源类型",
            prop: "dataResource",
            type: "radio",
            dicData: [
              {
                label: "手工配置",
                value: "S"
              },
              {
                label: "表单",
                value: "F"
              },
              {
                label: "模型",
                value: "M"
              }
            ],
            hide: true,
            rules: [
              {
                required: false,
                message: "请选择来源类型",
                trigger: "blur"
              }
            ]
          },
          {
            label: "功能来源",
            prop: "modelFormName",
            type: "select",
            filterable: true,
            clearable: true,
            dicData: this.resources,
            hide: true,
            rules: [
              {
                required: false,
                message: "请选择功能来源",
                trigger: "blur"
              }
            ]
          },
          {
            label: "功能别名",
            prop: "alias",
            rules: [
              {
                required: true,
                message: "请输入功能别名",
                trigger: "blur"
              }
            ]
          },
          {
            label: "路由地址",
            prop: "path",
            rules: [
              {
                required: true,
                message: "请输入路由地址",
                trigger: "blur"
              }
            ]
          },
          {
            label: "功能类型",
            prop: "category",
            type: "radio",
            dicData: [
              {
                label: "菜单",
                value: 1
              },
              {
                label: "按钮",
                value: 2
              }
            ],
            hide: true,
            rules: [
              {
                required: true,
                message: "请选择菜单类型",
                trigger: "blur"
              }
            ]
          },
          {
            width: 80,
            label: "功能排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入功能排序",
                trigger: "blur"
              }
            ]
          },
          {
            label: "功能备注",
            prop: "remark",
            type: "textarea",
            span: 24,
            minRows: 2,
            hide: true
          }
        ]
      },
      data: []
    };
  },
  created() {
    this.getmodels("btn_show").then(res => {
      this.btnShow = res.data.data;
    });
    allFormList().then(res => {
      this.allFormList = res.data.data.map(form => {
        return {
          label: form.formName,
          value: form.formCode
        };
      });
    });
    rollModelInfo().then(res => {
      this.allModelList = res.data.data.map(model => {
        return {
          label: model.tableRemark,
          value: model.tableName
        };
      });
    });
    this.onLoad();
  },
  watch: {
    "add_form.category"(newVal) {
      if (newVal === "2") {
        this.parentDisable = false;
      } else if (newVal === "1") {
        this.add_form.parentId = "0";
        this.parentDisable = true;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.menu_add, false),
        viewBtn: this.vaildData(this.permission.menu_view, false),
        delBtn: this.vaildData(this.permission.menu_delete, false),
        editBtn: this.vaildData(this.permission.menu_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    //新增功能弹框
    add() {
      this.clearAddForm();
      this.title = "新增功能";
      this.dialogVisible = true;
      this.initData();
      this.$set(this.add_form,"dataResource",'S');
      this.disabled = true;
      this.disabledes = false;
      this.$set(this.add_form,"category",'1');
      this.$set(this.add_form,"showType",1);
    },
    // 新增按钮弹框
    addBtn() {
      this.btnTitle = "新增按钮";
      this.addBtn_form = {};
      this.addBtn_form.category = "2";
      if (this.selectionList[0].category != 1) {
        this.$message.warning("请选择功能");
        return;
      } else {
        this.initData();
        console.log(this.selectionList[0]);
        this.addBtn_form.parentId = this.selectionList[0].id;
        this.dialogButton = true;
      }
    },
    OtherFunc(query) {
      if (query != "") {
        otherFuncSearch(query, this.addBtn_form.parentId).then(res => {
          this.OtherFunctionId = res.data.data;
        });
      } else {
        this.OtherFunctionId = [];
      }
    },
    //选中其他功能Id
    getOtherFuncBtn(value) {
      otherFuncBtn(value).then(res => {
        this.OtherFunctionBtn = res.data.data;
      });
    },
    //查询表单名
    searchFormName(query) {
      if (query != "") {
        getFormName(query).then(res => {
          this.getFormName = res.data.data;
        });
      } else {
        this.getFormName = [];
      }
    },
    //查看弹框
    view(row, index) {
      this.resources = [];
      if (row.dataResource === "M") {
        this.resources = this.allModelList;
      } else if (row.dataResource === "F") {
        this.resources = this.allFormList;
      }
      this.$refs.crud.rowView(row, index);
    },
    //编辑弹框
    edit(row) {
      if (row.category == 1) {
        this.title = "编辑功能";
        this.dialogVisible = true;
        getMenu(row.id).then(res => {
          this.resources = [];
          if (row.dataResource === "M") {
            this.resources = this.allModelList;
          } else if (row.dataResource === "F") {
            this.resources = this.allFormList;
          }
          this.add_form = res.data.data;
          this.add_form.category = String(this.add_form.category);
          if (this.add_form.dataResource == "S") {
            this.disabled = true;
            this.disabledes = false;
          } else if (this.add_form.dataResource == "F") {
            this.disabled = false;
            this.disabledes = true;
          } else if (this.add_form.dataResource == "M") {
            this.disabled = false;
            this.disabledes = true;
          }
          if (this.add_form.category == "1") {
            this.parentDisable = true;
          } else if (this.add_form.category == "2") {
            this.parentDisable = false;
          }
        });
      } else {
        this.btnTitle = "编辑按钮";
        this.dialogButton = true;
        getMenu(row.id).then(res => {
          this.$nextTick(() => {
            this.OtherFunctionId.push(res.data.data.otherFunObj);
            this.OtherFunctionBtn.push(res.data.data.otherBtnObj);
            this.addBtn_form = res.data.data;
          });
        });
      }
      this.initData();
    },
    //关闭弹框
    cancel(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 权限配置
    permissionConfig(row) {
      this.permissDialogVisible = true;
      this.permissionForm.functionId = row.name;
      this.permissionForm.title = row.name + "  权限配置";
      this.functionId = row.id;
      this.tabelPermissionList = [];
      getPermissionList(row.id).then(res => {
        this.tabelPermissionList = res.data.data;
      });
    },
    //添加权限
    addPermission() {
      let newValue = {
        modelId: "",
        model: [],
        modelFieldId: "",
        modelField: [],
        isShow: null,
        isEdit: null
      };
      this.tabelPermissionList.push(newValue);
    },
    //权限配置行内删除
    handelPermissionDelete(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return permissionRemove(this.functionId, row.id);
        })
        .then(() => {
          this.tabelPermissionList.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
    },
    //选中可改
    selectIsEdit(value, row, type) {
      console.log(row);
      if (value == 1 && type == 1) {
        row.isShow = 1;
      }
      if (value == 0 && type == 0) {
        row.isEdit = 0;
      }
    },
    //搜索模型
    searchModel(query, row) {
      if (query !== "") {
        this.modelIdLoading = true;
        getModelId(query).then(res => {
          row.model = res.data.data;
          this.modelIdLoading = false;
        });
      } else {
        row.model = [];
      }
    },
    // 选中模型
    selectModelId(value, row) {
      console.log(row);
      row.model.forEach(ele => {
        if (ele.id == value) {
          getModelFieldId(ele.id).then(res => {
            row.modelField = res.data.data;
          });
        }
      });
    },
    // 权限配置保存
    permissionSave() {
      this.permissionForm.functionId = this.functionId;
      this.permissionForm.functionFieldList = this.tabelPermissionList;
      permissionSubmit(this.permissionForm).then(res => {
        this.$message.success("操作成功");
        this.permissDialogVisible = false;
      });
    },
    //保存
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const row = this.add_form;
          if (row.dataResource != "S" && row.modelFormName == "") {
            this.$message.error("来源类型为表单或模型时,功能来源不能为空");
            return;
          }
          if (this.add_form.id) {
            update(row).then(() => {
              this.dialogVisible = false;
              this.parentId = 0;
              this.onLoad();
              this.maps.forEach((item, key) => {
                const { tree, treeNode, resolve } = this.maps.get(key);
                this.treeLoad(tree, treeNode, resolve);
              });
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
          } else {
            add(row).then(() => {
              this.dialogVisible = false;
              this.parentId = 0;
              this.onLoad();
              this.maps.forEach((item, key) => {
                const { tree, treeNode, resolve } = this.maps.get(key);
                this.treeLoad(tree, treeNode, resolve);
              });
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    //按钮保存
    submitBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addBtn_form.things == "2") {
            if (!this.addBtn_form.modelFormName) {
              this.$message.warning("表单名为必填项");
              return false;
            }
          }
          if (this.addBtn_form.things == "3") {
            if (!this.addBtn_form.otherFunctionId) {
              this.$message.warning("其他功能为必填项");
              return false;
            }
          }
          if (this.addBtn_form.things == "4") {
            if (!this.addBtn_form.path) {
              this.$message.warning("路由为必填项");
              return false;
            }
          }
          submitBtn(this.addBtn_form).then(res => {
            if (res.data.code == 200) {
              this.$message.success("操作成功");
              this.dialogButton = false;
              this.onLoad();
              this.maps.forEach((item, key) => {
                const { tree, treeNode, resolve } = this.maps.get(key);
                this.treeLoad(tree, treeNode, resolve);
              });
              for (let key in this.addBtn_form) {
                this.addBtn_form[key] = "";
              }
              this.addBtn_form.category = "2";
            }
          });
        } else {
          return false;
        }
      });
    },
    //获取path
    getUrl(val) {
      if (this.add_form.dataResource === "M") {
        this.add_form.path = "/modelAnalysis/modelList/" + val;
      } else if (this.add_form.dataResource === "F") {
        this.add_form.path = "/formTranslate/index/" + val;
      }
    },
    //回调地狱 上级菜单树
    Tree(children) {
      children.forEach(item => {
        item.label = item.name;
        item.value = item.id;
        if (item.children) {
          this.Tree(item.children);
        }
      });
    },
    //上级菜单树
    initData() {
      getMenuList().then(res => {
        this.treeData = res.data.data;
        this.treeData.forEach(item => {
          item.label = item.name;
          item.value = item.id;
          if (item.children) {
            this.Tree(item.children);
          }
        });
      });
    },
    //单选框选中事件
    switchChange(val) {
      this.add_form.modelFormName = "";
      this.add_form.path = "";
      this.resources = [];
      if (val === "S") {
        this.disabled = true;
        this.disabledes = false;
        this.aLabel = "功能来源";
      } else if (val === "F") {
        this.aLabel = "表单来源";
        this.disabled = false;
        this.disabledes = true;
        this.resources = this.allFormList;
      } else if (val === "M") {
        this.aLabel = "模型来源";
        this.disabled = false;
        this.disabledes = true;
        this.resources = this.allModelList;
      }
    },
    //清空数据
    clearAddForm() {
      for (let i in this.add_form) {
        this.add_form[i] = "";
      }
    },
    //新增子项
    handleAdd(row) {
      this.clearAddForm();
      this.title = "新增";
      this.dialogVisible = true;
      this.initData();
      this.add_form.dataResource = "S";
      this.disabled = true;
      this.disabledes = false;
      this.add_form.category = "1";
      this.add_form.parentId = row.id;
    },
    //删除
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index);
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.parentId = 0;
          this.$set(
            this.$refs.crud.$refs.table.store.states.lazyTreeNodeMap,
            row.parentId,
            []
          );
          this.onLoad();
          this.maps.forEach((item, key) => {
            const { tree, treeNode, resolve } = this.maps.get(key);
            this.treeLoad(tree, treeNode, resolve);
          });
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    //搜索下拉菜单
    dropdownMenu(command) {
      switch (command) {
        case "clear":
          this.clearSearch();
          break;
        case "spread":
          this.Doshow();
          break;
      }
    },
    //搜索模块清空
    clearSearch() {
      for (let i in this.search_form) {
        this.search_form[i] = "";
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
    //查询
    searchChange() {
       this.parentId = 0;
      this.page.currentPage = 1;
      this.onLoad();
      this.clickquery = "";
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          // 刷新表格数据并重载
          this.data = [];
          this.parentId = 0;
          this.$refs.crud.refreshTable();
          this.$refs.crud.toggleSelection();
          // 表格数据重载
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.onLoad();
    },
    sizeChange(pageSize) {
     this.clickquery = 1;
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.onLoad();
    },
    // refreshChange() {
    //   this.onLoad(this.page, this.query);
    // },
    onLoad() {
      this.loading = true;
      // let arr = this.getExtQueryList(this.search_form);

      let obj = {
        extQueryList: [
            {
              field: "name",
              expressionList: [
                {
                  operator: "LIKE",
                  lowerValue: this.search_form.name,
                  upperValue: ""
                }
              ]
            },
            {
              field: "code",
              expressionList: [
                {
                  operator: "LIKE",
                  lowerValue: this.search_form.code,
                  upperValue: ""
                }
              ]
            },
            {
              field: "alias",
              expressionList: [
                {
                  operator: "LIKE",
                  lowerValue: this.search_form.alias,
                  upperValue: ""
                }
              ]
            },
             {
              field: "parentId",
              expressionList: [
                {
                  operator: "EQ",
                  lowerValue: this.parentId,
                  upperValue: ""
                }
              ]
            },
          ]
      }
      getLazyList(Object.assign(
          {
            size: this.page.pageSize,
            current: this.page.currentPage
          },
          obj
        )).then(
        res => {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
          this.loading = false;
          this.selectionClear();
        }
      );
    },
    treeLoad(tree, treeNode, resolve) {
      const parentId = tree.id;
      this.maps.set(parentId, { tree, treeNode, resolve });
      getLazyNewList({parentId:parentId}).then(res => {
        resolve(res.data.data);
      });
    },
    //流程搜索下拉
    flowFunc(query) {
      if (query != "") {
        getFlowModelByKeySearch(query).then(res => {
          if (res.data.code == 200) {
            this.flowKeyOption = res.data.data;
          } else {
            this.flowKeyOption = [];
          }
        });
      }
    },
    cellStyle() {
      return "padding: 0";
    },

    rowStyle() {
      return "height: 35px";
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../styles/system/func/function.scss";
@import "../../styles/model/model.css";
</style>
