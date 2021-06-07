<template>
  <div class="sx-search-form">
    <el-form
      ref="form"
      :model="form"
      label-position="right"
      label-width="130px"
      label-suffix=":"
      size="mini"
      @submit.native.prevent
    >
      <el-row :gutter="10">
        <el-col :span="20">
          <el-row :gutter="10">
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="12"
              :xl="12"
              v-for="(item, i) in searchList"
              :key="i"
              v-show="i > 1 ? isCollapse : true"
            >
              <el-form-item :label="item.label" style="margin-bottom: 5px">
                <div
                :class="
                  item.queryType === '2' || item.queryType === '3'
                    ? 'inline'
                    : ''
                "
              >
                <searchComponent
                  :item="item"
                  :value="form[`${item.prop}#lowerValue`]"
                  flag="lower"
                  @changeValue="changeValue"
                ></searchComponent>
                <span
                  v-if="item.queryType === '2' || item.queryType === '3'"
                  style="font-size: 14px"
                  >到</span
                >
                <template
                  v-if="item.queryType === '2' || item.queryType === '3'"
                >
                  <searchComponent
                    :item="item"
                    :value="form[`${item.prop}#upperValue`]"
                    flag="upper"
                    @changeValue="changeValue"
                  ></searchComponent>
                </template>
                <span
                  v-if="item.showBtn"
                  class="btn"
                  @click="combinedClick(item)"
                  ><i class="el-icon-menu" style="color: #409eff"
                /></span>
              </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" :xs="4" :md="4" :lg="4">
          <el-button-group>
            <el-button
              type="primary"
              native-type="submit"
              class="submit-btn"
              size="mini"
              @click="handleQuery"
              >查询
            </el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="primary" size="mini">
                <i class="el-icon-arrow-down"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="clear">清空</el-dropdown-item>
                <el-dropdown-item command="collapse">{{
                  isCollapse ? "收起" : "展开"
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
    <!--  弹出表单  -->
    <vxe-modal
      v-model="combinedVisible"
      :title="dialogTitle"
      show-zoom
      resize
      width="800px"
      height="500px"
      show-footer
    >
      <div>
        <combinedSearch
          v-if="combinedVisible"
          :column="combinedColumn"
          :value="form"
          @changeList="changeList"
          ref="combinedSearch"
        ></combinedSearch>
      </div>
      <template #footer>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-check"
          @click="changeList(combinedColumn, $refs.combinedSearch.form)"
          >确定
        </el-button>
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click="combinedVisible = false"
          >取消
        </el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import searchComponent from "./searchComponent";
import { getDeptTree } from "@/api/system/dept";
import combinedSearch from "./combinedSearch";

export default {
  name: "sxSearch",
  props: {
    searchOption: Array,
  },

  components: {
    searchComponent,
    combinedSearch,
  },

  data() {
    return {
      searchList: [],
      form: {},
      isCollapse: false,
      deptList: [],
      combinedVisible: false,
      dialogTitle: "",
      combinedColumn: {},
    };
  },

  watch: {
    // 监听路由变化
    searchOption: {
      handler(newVal, oldVal) {
        this.searchList = this.searchOption || [];
        this.searchList.forEach((e) => {
          if (!e.type) {
            e.type = "input";
          }
          if (!e.queryType) {
            e.queryType = "1";
          }
          if (e.type === "singlecheckbox") {
            e.dicData = [
              {
                label: "",
                value: "1",
              },
            ];
          }
          if (e.type === "deptSelect") {
            getDeptTree().then((res) => {
              this.deptList = res.data.data;
              this.deptList.forEach((ele) => {
                ele.label = ele.title;
                if (ele.children) {
                  this.treeChildren(ele.children);
                }
              });
              this.$set(e, "dicData", this.deptList);
            });
          } else if (e.type === "userSelect") {
            e.dicUrl = "/api/blade-user/getUserInfoBySearch?search=";
            e.props = {
              label: "realName",
              value: "id",
            };
          }
          if (e.queryType === "3") {
            e.showBtn = true;
          }
          if (e.queryType === "2" || e.queryType === "3") {
            if (
              e.type === "date" ||
              e.type === "datetime" ||
              e.type === "time"
            ) {
              e.type = e.type + "range";
              e.queryType = "1";
            } else if (
              [
                "multipleSelect",
                "checkbox",
                "singlecheckbox",
                "radio",
                "switch",
                "deptSelect",
              ].includes(e.type)
            ) {
              e.queryType = "1";
              e.showBtn = false;
            }
          }
          if (e.type === "date" || e.type === "daterange") {
            e.format = "yyyy-MM-dd";
            e.valueFormat = "yyyy-MM-dd";
          } else if (e.type === "datetime" || e.type === "datetimerange") {
            e.format = "yyyy-MM-dd hh:mm:ss";
            e.valueFormat = "yyyy-MM-dd hh:mm:ss";
          } else if (e.type === "time" || e.type === "timerange") {
            e.format = "hh:mm:ss";
            e.valueFormat = "hh:mm:ss";
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    //表单下拉菜单
    dropdownMenu(command) {
      switch (command) {
        case "clear":
          this.form = {};
          break;
        case "collapse":
          this.isCollapse = !this.isCollapse;
          break;
      }
    },
    // 查询数据
    handleQuery() {
      let ret = [];

      this.searchList.forEach((e) => {
        let formValue = this.form[e.prop] || [];
        let list = [];
        formValue.forEach((v) => {
          let arr = {
            operator: v.operator || "",
            lowerValue: v.lowerValue || "",
            upperValue: v.upperValue || "",
          };
          if (
            !this._.isEmpty(v.operator) ||
            !this._.isEmpty(v.lowerValue) ||
            !this._.isEmpty(v.upperValue)
          ) {
            list.push(arr);
          }
        });

        let valueFormat = e.valueFormat;

        if (e.dbType && e.dbType != "Date") {
          valueFormat = "";
        }

        if (list.length > 0) {
          ret.push({
            field: e.prop,
            dataFormat: valueFormat,
            expressionList: list,
          });
        }
      });

      this.$emit("search", ret);
    },
    changeValue(e, val, flag) {
      if (!this.form[e.prop]) {
        this.form[e.prop] = [
          {
            lowerValue: null,
            upperValue: null,
          },
        ];
      }
      if (
        e.type === "daterange" ||
        e.type === "datetimerange" ||
        e.type === "timerange"
      ) {
        if (val) {
          this.form[e.prop][0]["lowerValue"] = val[0];
          this.form[e.prop][0]["upperValue"] = val[1];
        } else {
          this.form[e.prop][0]["lowerValue"] = null;
          this.form[e.prop][0]["upperValue"] = null;
        }
      } else {
        if (flag === "lower") {
          this.form[e.prop][0]["lowerValue"] = val;
        }
        if (flag === "upper") {
          this.form[e.prop][0]["upperValue"] = val;
        }
      }
    },
    changeList(item, val) {
      this.form[item.prop] = val[item.prop];
      if (this.form[item.prop] && this.form[item.prop].length > 0) {
        this.form[`${item.prop}#lowerValue`] = this.form[item.prop][0][
          "lowerValue"
        ];
        this.form[`${item.prop}#upperValue`] = this.form[item.prop][0][
          "upperValue"
        ];
      } else {
        this.form[`${item.prop}#lowerValue`] = null;
        this.form[`${item.prop}#upperValue`] = null;
      }
      this.combinedVisible = false;
    },
    combinedClick(item) {
      this.combinedColumn = item;
      this.combinedVisible = true;
      this.dialogTitle = item.label + " 组合查询";
    },
    //组织树回调地狱
    treeChildren(child) {
      if (child) {
        child.forEach((ele) => {
          ele.label = ele.title;
          if (ele.children) {
            this.treeChildren(ele.children);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.inline {
  display: flex;

  span {
    flex: 10%;
    text-align: center;
  }
}

/deep/.el-form-item__content {
  font-size: unset;
}

/deep/.el-row {
  display: flex !important;
  flex-wrap: wrap !important;
}

</style>

