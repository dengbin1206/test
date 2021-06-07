<!--
 * @Date: 2021-01-02 11:19:13
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-10 10:03:48
 * @FilePath: /SX-DTBF-VIEW/src/views/flow/ModelDesign/index.vue
 * @Description:
-->
<template>
  <basic-container>
    <sxSearch :searchOption="searchOption" @search="search"></sxSearch>
    <avue-crud
      ref="model"
      :option="option"
      :data="data"
      :page="page"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleCreate"
          >创 建
        </el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          @click="handleDelete"
          :disabled="multiple"
          >删 除
        </el-button>
      </template>
      <template slot-scope="{ row }" slot="version">
        <el-tag>v{{ row.version }}</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-edit"
          @click.stop="handleEdit(scope.row, scope.index)"
          >编辑
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-brush"
          @click.stop="handleUpdate(scope.row, scope.index)"
          >设计
        </el-button>
        <el-popconfirm
          title="确定将选择数据部署"
          placement="top"
          class="popconfirm"
          @confirm="handleDeploy(scope.row)"
        >
          <el-button
            type="text"
            size="small"
            icon="el-icon-thumb"
            slot="reference"
            >部署
          </el-button>
        </el-popconfirm>
        <el-button
          type="text"
          size="small"
          icon="el-icon-upload2"
          class="popconfirm"
          @click.stop="handelDesign(scope.row, scope.index)"
          >配置
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-warning-outline"
          @click.stop="edit(scope.row)"
          >版本
        </el-button>
        <el-popconfirm
          title="确定将选择数据删除"
          placement="top"
          class="popconfirm"
          @confirm="handleDelete(scope.row)"
        >
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            slot="reference"
            style="color:red"
            >删除
          </el-button>
        </el-popconfirm>
      </template>
    </avue-crud>
    <sxDialog ref="sxDialog" :visible.sync="visible" :proDefId="proDefId" />
    <sxDesign
      ref="sxDesign"
      :flowVisible.sync="flowVisible"
      :flowUrl="flowUrl"
    />
    <el-dialog
      ref="dialogBox"
      :title="title"
      width="35%"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible"
    >
      <el-row :gutter="10">
        <el-form ref="processForm" :model="formList" :rules="rules">
          <el-col>
            <el-form-item label-width="100px" label="流程别名:" prop='modelAlias'>
              <el-input size="small" v-model="formList.modelAlias"  type="text" @keyup.native="toUp()" placeholder="请输入流程别名" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label-width="100px" label="流程名称:" prop="name">
              <el-input size="small" v-model="formList.name"   placeholder="请输入流程名称"></el-input>
            </el-form-item>
            <el-form-item label-width="100px" label="流程描述:">
              <el-input size="small" type="textarea" rows="2" placeholder="请输入流程描述" v-model="formList.description"></el-input>
            </el-form-item>
            <el-form-item label-width="100px" label="流程分类:">
              <el-select
                v-model="formList.modelCategory"
                size="small"
                style="width:100%"
                placeholder="请选择流程分类"
                clearable
              >
                <el-option
                  v-for="(e, i) in dict"
                  :key="i"
                  :label="e.label"
                  :value="e.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
          icon="el-icon-circle-close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="getSubmitForm"
          size="small"
          icon="el-icon-circle-check"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="流程历史版本"
      append-to-body
      :visible.sync="versionVis"
      width="30%"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
    >
        <el-table
          :data="versionData"
          border
          max-height="500px"
          style="width: 100%;">
          <el-table-column
            prop="codeName"
            label="流程版本号"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click='handelDesign(scope.row, scope.index)'>配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" versionVis= false" size="small">取 消</el-button>
        <el-button type="primary" @click="versionVis = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import website from "@/config/website";
import sxDialog from "./components/sxDialog";
import sxDesign from "./components/sxDesign";
import { saveModel, updateModel, showVersion, removeModel, deployModel, queryList } from "@/api/flow/flow";
import { formList, options } from "./options";
import { getDictBizList } from "@/api/system/dict";

const title = {
  UPDATE: [0, "修改流程"],
  INSERT: [1, "新建流程"],
};

export default {
  components: {
    sxDialog,
    sxDesign,
  },
  data() {
    let validateModelAlias = (rule, value, callback)=>{
      let re = /\w/g;

      if (value === '') {
        callback(new Error('请输入流程别名'));
      } else {
        if (!re.test(value)){
          callback(new Error('输入的流程别名只能为字符'));
        }else{
          callback();
        }
      }
    };
    return {
      option: options,
      visible: false,
      flowVisible: false,
      dialogVisible: false,
      data: [],
      idList: [],
      title: "",
      multiple: true,
      flowUrl:"",
      //查询参数
      searchOption: [
        {
          type: "input",
          queryType: "1",
          prop: "modelAlias",
          label: "流程别名",
          placeholder: "支持模糊搜索",
        },
        {
          type: "input",
          queryType: "1",
          prop: "name",
          label: "流程名称",
          placeholder: "支持模糊搜索",
        },
        {
          type: "multipleSelect",
          queryType: "1",
          prop: "modelCategory",
          label: "流程分类",
          placeholder: "请选择流程分类",
          dicData: this.dict,
        },
        {
          type: "input",
          queryType: "1",
          prop: "description",
          label: "流程描述",
          placeholder: "支持模糊搜索",
        },
        {
          type: "date",
          queryType: "2",
          prop: "createTime",
          label: "创建日期",
        },
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: null,
      },
      extQueryList: [],
      submitType: "",
      proDefId: "",
      formList:{
        modelAlias:'',
        name:'',
        modelKey: "",
        description:'',
        modelCategory:''
      },
      form: {
        name: "",
        modelAlias: "",
        modelKey: "",
        description: "",
        modelCategory: "",
      },
      dict: [],
      rules: {
        modelAlias: [{ validator:validateModelAlias, trigger: "blur" }],
        name: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
      },
      versionVis:false,
      versionData:[],
      disabled:false
    };
  },

  created() {
    this.initList();
    this.api();
  },

  methods: {
    //查询
    search(val) {
      this.extQueryList = val;
      this.api();
    },
    toUp(){
      if(this.formList.modelAlias){
        this.formList.modelAlias=this.formList.modelAlias.toUpperCase();
      }
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    //修改页码
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.api();
    },
    //修改页面数量
    sizeChange(pageSize) {
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.api();
    },
    // 表单列表接口，获取数据
    api() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: this.extQueryList,
      };
      queryList(obj).then((res) => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },
    handleCreate() {
      this.dialogVisible = true;
      this.title = title.INSERT[1];
      this.submitType = title.INSERT[0];
      this.disabled = false;
      this.resetForm();
      this.$nextTick(() => {
        this.$refs["processForm"].clearValidate();
      });
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.title = title.UPDATE[1];
      this.submitType = title.UPDATE[0];
      this.disabled = true;
      Object.keys(row).forEach((item) => {
        if (typeof row[item] !== "undefined" && !!row[item]) {
          this.formList[item] = row[item];
        }
      });
      this.$nextTick(() => {
        this.$refs["processForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.flowUrl = `${website.flowDesignUrl}/index.html#/editor/${row.id}`;
      this.flowVisible = true;
    },
    handleSelectionChange(selection) {
      this.idList = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
    async handleDelete(row) {
      const id = row.id || this.idList.join(",");
      const { data } = await removeModel(id);
      const { code, msg } = data;
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.api();
    },
    edit(row){
      this.versionVis=true
      showVersion(row.modelKey).then(res=>{
        if(res.data.code=='200'){
          this.versionData=res.data.data
          if(this.versionData.length>0){
            this.versionData.forEach(item=>{
              item.codeName=item.name +' '+'v'+item.version
            })
          }

        }
      })
    },
    async handleDeploy(row) {
      const { data } = await deployModel({ modelId: row.id });
      const { code, msg } = data;
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.api();
    },

    handelSubmit() {
      this.$refs["processForm"].validate(async (valid) => {
        if (valid) {
          if (this.submitType == 1) {
            const { data } = await saveModel(this.formList);
            this.useNotice(data);
          } else {
            const { data } = await updateModel(this.formList);
            this.useNotice(data);
          }
        } else {
          return false;
        }
      });
    },

    async initList() {

      const { data } = await getDictBizList("flow_type");
      this.dict = [];
      if(data.data instanceof Array){
        this.dict = data.data;
      };
      this.searchOption[2].dicData = this.dict;
      (this.option.column || []).forEach(e=>{
        if(e.prop === "modelCategory"){
          this.$set(e, "dicData", this.dict);
        }
      });
    },

    resetForm() {
      this.formList = {
        name: "",
        modelAlias: "",
        modelKey: "",
        description: "",
        modelCategory: "",
      };
    },

    useNotice(data) {
      const { code, msg } = data;
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.api();
      this.dialogVisible = false;
    },

    getSubmitForm() {
      this.handelSubmit();
    },

    handelDesign(row) {
      if (row.proDefId) {
        this.visible = true;
        this.versionVis=false
        this.proDefId = row.proDefId;
        this.$refs.sxDialog.getName(row)
        this.$refs.sxDialog.getList(row.proDefId)
        this.$refs.sxDialog.getImg(row.proDefId)
        this.$refs.sxDialog.$refs.formDetail.queryList(row.proDefId);
        this.$refs.sxDialog.$refs.approvalDetail.queryList(row.proDefId);
        this.$refs.sxDialog.$refs.approvalDetail.getBack(row.proDefId);
        this.$refs.sxDialog.$refs.nodeDetail.queryList(row.proDefId);
        this.$refs.sxDialog.$refs.nodeDetail.getBack(row.proDefId);
        this.$refs.sxDialog.$refs.nodeDetail.getUserList();
        this.$refs.sxDialog.$refs.nodeDetail.getAllList();
        this.$refs.sxDialog.$refs.nodeDetail.deptTree();
      } else {
        this.$message.error("流程未部署");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
