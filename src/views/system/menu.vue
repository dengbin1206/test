<template>
  <split-pane
    :min-percent="10"
    :default-percent="30"
    split="vertical"
    class="sx_dept_basic sx_meen"
  >
    <template slot="paneL">
      <div style="padding: 16px; height: 90%; overflow: auto">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          size="small"
          style="margin-bottom: 10px"
        />
        <el-tree
          :data="Treedata0"
          :props="defaultProps"
          node-key="id"
          :default-expanded-key="idArr"
          @node-click="selectOrganization"
          :filter-node-method="filterNode"
          ref="tree"
          :default-expanded-keys="unfold"
        >
          <span slot-scope="{ node, data }">
            <span>
              <i
                :class="
                  data.type == 'F'
                    ? 'iconfont icon-gongnengtubiao-26'
                    : 'iconfont icon-_caidan'
                "
              ></i
              >{{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
    </template>
    <template slot="paneR">
      <div class="sx_deptmain sx_show">
        <div class="sx_deptTop">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="add()"
            >新增</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="addlevel()"
            >新增下级</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="edit()"
            :disabled="editBut"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-setting"
            @click="handleRole()"
            >功能配置</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-sort"
            @click="sort()"
            >排序</el-button
          >
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            plain
            @click="dele()"
            >删除</el-button
          >
        </div>
        <avue-form :option="showOption" v-model="show_form"></avue-form>
      </div>
      <el-dialog
        title="排序"
        :visible.sync="drawer"
        :append-to-body="true"
        :modal-append-to-body="false"
        width="40%"
        :close-on-click-modal="false"
        op="10vh"
        :before-close="sortClose"
      >
        <el-row style="height: 60vh; overflow: auto">
          <el-col
            :class="{ active: nav_active == index }"
            v-for="(item, index) in sortList"
            :key="index"
            v-dragging="{ list: sortList, item: item, group: 'id' }"
            style="
              padding-left: 40px;
              margin-bottom: 0;
              height: 30px;
              lineheight: 30px;
            "
          >
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-link
                  type="primary"
                  :underline="false"
                  class="iconfont icon-caidan"
                  style="
                    margin-right: 30px;
                    font-size: 17px;
                    margin-bottom: 5px;
                  "
                ></el-link>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="moveUp(index)"
                  >上移</el-dropdown-item
                >
                <el-dropdown-item @click.native="moveDown(index)"
                  >下移</el-dropdown-item
                >
                <el-dropdown-item @click.native="moveTop(index)"
                  >置顶</el-dropdown-item
                >
                <el-dropdown-item @click.native="movebuttom(index)"
                  >置底</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <i
              :class="
                item.type == 'F'
                  ? 'iconfont icon-gongnengtubiao-26'
                  : 'iconfont icon-_caidan'
              "
            ></i
            >{{ item.menuName }}
          </el-col>
        </el-row>
        <span slot="footer">
          <el-button
            type="primary"
            @click="subSort"
            size="small"
            icon="el-icon-circle-plus-outline"
            >保 存</el-button
          >
          <el-button @click="sortClose" size="small" icon="el-icon-circle-close"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :title="title"
        v-dialog
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :modal-append-to-body="false"
        width="40%"
        :close-on-click-modal="false"
        op="10vh"
        :before-close="handleClose"
      >
        <avue-form :option="option" v-model="form" ref="addForm">
          <template slot="menuForm">
            <el-button
              type="primary"
              @click="handleSubmit"
              size="small"
              icon="el-icon-circle-plus-outline"
              >保 存</el-button
            >
            <el-button
              @click="handleClose"
              size="small"
              icon="el-icon-circle-close"
              >取 消</el-button
            >
          </template>
        </avue-form>
      </el-dialog>
      <el-dialog
        title="功能配置"
        :visible.sync="permission"
        :modal-append-to-body="false"
        width="50%"
        :close-on-click-modal="false"
        op="10vh"
        :before-close="shut"
      >
        <avue-form :option="dialogOption" v-model="dialog_form"> </avue-form>
        <span slot="footer" class="sx_dialog-footer">
          <el-button
            type="primary"
            @click="sub"
            size="small"
            icon="el-icon-circle-plus-outline"
            >保 存</el-button
          >
          <el-button @click="shut" size="small" icon="el-icon-circle-close"
            >取 消</el-button
          >
        </span>
      </el-dialog>
    </template>
  </split-pane>
</template>
<script>
import {
  getTree,
  detail,
  remove,
  add,
  menuAdd,
  getList,
  configure,
  topTree,
  menu_sort,
  subSort,
} from "@/api/system/menu";
import iconList from "@/config/iconList";
import "@/styles/icon/function/iconfont.css";
import "@/styles/icon/menu/iconfont.css";
import "@/styles/icon/menu2/iconfont.css";

function formatIcon(iconList) {
  let list = iconList.map((icon) => {
    let newIconList = icon.list.map((icons, index) => {
      let name;
      if (icons.includes("iconfont")) {
        name = icons.split("iconfont")[2].replace(/-/ig, ``).toUpperCase();
      }else if(icons.includes("el-icon")){
        name = icons.split("el-icon")[1].replace(/-/ig, ``).toUpperCase();
      }

      return {
        label: index+1,
        value: icons,
      };
    });

    return {
      label: icon.label,
      list: newIconList,
    };
  });

  console.log(list);

  return list;
}

export default {
  data() {
    return {
      sortList: [],
      drawer: false,
      direction: "rtl",
      topMenuId: 0,
      editBut: true,
      parentsId: "",
      funData: [],
      unfold: [],
      title: "",
      filterText: "",
      Treedata0: [],
      defaultProps: {
        children: "children",
        label: "name",
        type: "type",
      },
      idArr: [],
      permission: false,
      show_form: {
        parentId: "",
        menuName: "",
        menuCode: "",
        source: "",
        sort: "",
        remark: "",
        id: "",
      },
      form: {
        parentId: "",
        menuName: "",
        menuCode: "",
        source: "",
        sort: "",
        remark: "",
        id: null,
      },
      dialog_form: {
        id: "",
        functionList: [],
        sort: "",
      },
      dialogVisible: false,
      option: {
        labelWidth: 100,
        emptyBtn: false,
        submitBtn: false,
        menuPosition: "right",
        size: "mini",
        column: [
          {
            label: "上级菜单",
            prop: "parentId",
            type: "tree",
            span: 24,
            dicData: [],
            props: {
              label: "name",
              value: "id",
            },
          },
          {
            label: "菜单编码",
            prop: "menuCode",
            span: 24,
            rules: [
              {
                required: true,
                message: "菜单编码",
                trigger: "blur",
              },
            ],
          },
          {
            label: "菜单名称",
            prop: "menuName",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入菜单名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "图标",
            prop: "source",
            type: "icon",
            iconList: formatIcon(iconList),
            span: 24,
          },
          {
            label: "菜单排序",
            prop: "sort",
            type: "number",
            span: 24,
          },
          {
            label: "菜单备注",
            prop: "remark",
            type: "textarea",
            span: 24,
          },
        ],
      },
      showOption: {
        labelWidth: 100,
        menuBtn: false,
        size: "mini",
        column: [
          {
            label: "上级菜单",
            prop: "parentId",
            type: "tree",
            span: 13,
            dicData: [],
            disabled: true,
            props: {
              label: "name",
              value: "id",
            },
          },
          {
            label: "菜单编码",
            prop: "menuCode",
            disabled: true,
            span: 13,
          },
          {
            label: "菜单名称",
            prop: "menuName",
            disabled: true,
            span: 13,
          },
          {
            label: "图标",
            prop: "source",
            type: "icon",
            iconList: formatIcon(iconList),
            disabled: true,
            span: 13,
          },
          {
            label: "菜单排序",
            prop: "sort",
            type: "number",
            disabled: true,
            span: 13,
          },
          {
            label: "菜单备注",
            prop: "remark",
            type: "textarea",
            disabled: true,
            span: 13,
          },
        ],
      },
      dialogOption: {
        labelWidth: 100,
        menuBtn: false,
        size: "mini",
        column: [
          {
            label: "上级菜单",
            prop: "id",
            type: "tree",
            span: 24,
            dicData: [],
            props: {
              label: "name",
              value: "id",
            },
          },
          {
            label: "功能配置",
            prop: "functionList",
            type: "tree",
            multiple: true,
            span: 24,
            dicData: [],
            props: {
              label: "name",
              value: "id",
            },
          },
        ],
      },
    };
  },

  methods: {
    //上移
    moveUp(index) {
      if (index != 0) {
        this.sortList[index] = this.sortList.splice(
          index - 1,
          1,
          this.sortList[index]
        )[0];
      }
    },
    //下移
    moveDown(index) {
      if (index != this.sortList.length - 1) {
        this.sortList[index] = this.sortList.splice(
          index + 1,
          1,
          this.sortList[index]
        )[0];
      }
    },
    //置顶
    moveTop(index) {
      if (index != 0) {
        this.sortList.unshift(this.sortList.splice(index, 1)[0]);
      }
    },
    //置底
    movebuttom(index) {
      this.sortList.push(this.sortList.splice(index, 1)[0]);
    },
    //排序保存
    subSort() {
      this.sortList.forEach((item, index) => {
        item.sort = index;
      });
      const row = {
        sortList: this.sortList,
        id: this.show_form.id,
      };
      subSort(row).then(() => {
        this.getTreeDate();
        this.sortClose();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        if (this.show_form.parentId != null && this.show_form.parentId != "") {
          this.unfold = [this.show_form.id];
        }
      });
    },
    //排序弹框打开
    sort() {
      if (!this.show_form.id) {
        this.$message.warning("请选择一个菜单");
        return;
      }
      this.drawer = true;
      menu_sort(this.show_form.id).then((res) => {
        this.sortList = res.data.data;
      });
    },
    //排序弹框关闭
    sortClose() {
      this.drawer = false;
      this.sortList = [];
    },
    //过滤角色
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //清空数据
    clearForm() {
      (this.form.parentId = ""),
        (this.form.menuName = ""),
        (this.form.menuCode = ""),
        (this.form.source = ""),
        (this.form.sort = ""),
        (this.form.remark = ""),
        (this.form.id = null);
    },
    clearShowForm() {
      (this.show_form.parentId = ""),
        (this.show_form.menuName = ""),
        (this.show_form.menuCode = ""),
        (this.show_form.source = ""),
        (this.show_form.sort = ""),
        (this.show_form.remark = ""),
        (this.show_form.id = "");
    },
    clearDialogFrom() {
      (this.dialog_form.id = ""), (this.dialog_form.functionList = "");
    },
    //获取左数数据
    getTreeDate() {
      getTree(this.topMenuId).then((res) => {
        this.Treedata0 = res.data.data;
      });
    },
    //选中菜单
    selectOrganization(data) {
      this.editBut = false;
      this.parentsId = data.parentId;
      if (data.type == "M") {
        detail(data.id).then((res) => {
          this.show_form = res.data.data;
        });
      } else if (data.type == "F") {
        this.clearShowForm();
        this.$message({
          message: "功能不需要维护",
          type: "warning",
        });
      }
    },
    //新增弹框
    add() {
      this.title = "新增";
      this.clearForm();
      this.dialogVisible = true;
    },
    //新增下级弹框
    addlevel() {
      this.title = "新增";
      this.dialogVisible = true;
      this.clearForm();
      this.form.parentId = this.show_form.id;
    },
    //编辑弹框
    edit() {
      this.title = "编辑";
      this.dialogVisible = true;
      this.form = this.deepClone(this.show_form);
    },
    //功能配置弹框
    handleRole() {
      this.dialog_form.id = "";
      this.dialog_form.functionList = [];
      if (!this.show_form.id) {
        this.$message.warning("请选择一个菜单");
        return;
      }
      this.permission = true;
      configure(this.show_form.id).then((res) => {
        this.dialog_form.id = res.data.data.id;
        this.dialog_form.functionList = res.data.data.functionList;
      });

      topTree().then((res) => {
        const column = this.findObject(this.dialogOption.column, "id");
        column.dicData = res.data.data;
      });
      getList().then((res) => {
        const column = this.findObject(
          this.dialogOption.column,
          "functionList"
        );
        if (res.data.data && res.data.data.length > 0) {
          column.dicData = res.data.data;
          column.dicData.forEach(function (item) {
            if (item.showType) {
              if (item.showType == 2) {
                item.name = item.name + "(M)";
              }
              if (item.showType == 3) {
                item.name = item.name + "(PC+M)";
              }
            }
          });
        } else {
          column.dicData = [];
        }
      });
    },
    //权限弹框保存
    sub() {
      const row = this.dialog_form;
      row.parentId = this.parentsId;
      menuAdd(row).then(() => {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.permission = false;
        this.getTreeDate();
        if (row.parentId != null && row.parentId != "") {
          this.unfold = [row.id];
        }
        if (row.id != null && row.id != "") {
          this.selectOrganization(row);
        } else {
          this.clearForm();
          this.clearShowForm();
          this.clearDialogFrom();
        }
      });
    },
    //权限设置弹框取消
    shut() {
      this.permission = false;
      this.clearShowForm();
    },
    //删除
    dele() {
      if (!this.show_form.id) {
        this.$message.warning("请选中左边角色");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.show_form.id);
        })
        .then(() => {
          this.getTreeDate();
          this.columns(this.showOption.column);
          this.columns(this.option.column);
          if (
            this.show_form.parentId != null &&
            this.show_form.parentId != ""
          ) {
            this.unfold = [this.show_form.parentId];
          }
          this.clearForm();
          this.clearShowForm();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    //保存
    handleSubmit() {
      //this.$refs.addForm.validate((vaild)=>{
      // if(vaild){
      const row = this.form;
      add(row).then(() => {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.dialogVisible = false;
        this.getTreeDate();
        this.columns(this.showOption.column);
        this.columns(this.option.column);
        if (row.parentId != null && row.parentId != "") {
          this.unfold = [row.parentId];
        }
        if (row.id != null && row.id != "") {
          this.selectOrganization(row);
        } else {
          this.clearForm();
          this.clearShowForm();
        }
      });
      // }
      //})
    },
    //关闭弹框
    handleClose() {
      this.$refs.addForm.resetForm();
      this.dialogVisible = false;
    },
    //上级菜单
    columns(name) {
      topTree().then((res) => {
        const column = this.findObject(name, "parentId");
        column.dicData = res.data.data;
      });
    },
  },
  created() {
    //左边菜单树
    this.columns(this.showOption.column);
    this.columns(this.option.column);
    this.getTreeDate();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    "dialog_form.id"(newVal, oldVal) {
      if (oldVal != "" && newVal != oldVal && newVal != "") {
        this.dialog_form.functionList = [];
        configure(newVal).then((res) => {
          this.parentsId = res.data.data.parentId;
          this.dialog_form.id = newVal;
          this.dialog_form.functionList = res.data.data.functionList;
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
@import "../../styles/system/dept.scss";
.sx_meen {
  .avue-form {
    margin-top: 10px;
    .el-col {
      margin-bottom: 0 !important;
    }
  }
}
.el-select-dropdown__item.selected {
  font-weight: 400 !important;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

