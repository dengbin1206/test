<template>
  <div class="wrap">
    <div class="header">
      <van-nav-bar
        :title="mainModelRemark"
        left-arrow
        :border="false"
        @click-left="onClickLeft"
      />
      <van-tabs
        v-model="tabActive"
        :line-width="22"
        color="#0079fe"
        title-active-color="#0079fe"
      >
        <van-tab :title="tabName['add']" name="add"></van-tab>
        <van-tab :title="tabName['list']" name="list"></van-tab>
      </van-tabs>
    </div>
    <div :class="['main', tabActive === 'add' ? 'none-top' : 'footer-top']">
      <van-search
        v-model="search"
        shape="round"
        placeholder="请输入搜索关键词"
        v-if="tabActive === 'list'"
        class="search"
        @input="handleSearch"
      />

      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        class="pullrefresh"
        v-if="tabActive === 'list'"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="queryList"
          :immediate-check="false"
          ref="list"
        >
          <listCard
            v-for="(item, index) in list"
            :key="index"
            :rowData="item"
            :mainModel="showColumns"
            @click="showEditPage(item)"
            @handleEdit="handleEdit(item)"
          />
        </van-list>
        <div class="placeholder"></div>
      </van-pull-refresh>
      <div v-show="tabActive === 'add'">
        <sxForm v-if="addFlag" :params="addFormParams" ref="sxForm"></sxForm>
      </div>
    </div>
    <div class="footerList" v-if="tabActive === 'list'">
      <van-goods-action>
        <van-goods-action-button
          text="新增"
          type="info"
          @click="activeChange"
        />
      </van-goods-action>
    </div>

    <van-popup
      v-model="viewVisible"
      get-container="body"
      position="bottom"
      style="width: 100%; height: 100%; padding: 60px 0"
    >
      <van-nav-bar
        :title="mainModelRemark"
        left-arrow
        @click-left="viewVisible = false"
        fixed
        :style="{ zIndex: 99999 }"
      />
      <sxForm v-if="viewVisible" :params="viewEditParams" ref="sxForm"></sxForm>
    </van-popup>
  </div>
</template>

<script>
import listCard from "../../MobileComponent/ListCard";
import renderForm from "./renderForm";
import { getBtnByFunctionPath } from "@/api/system/function";
import { queryMainFields, getList } from "@/api/tool/dynamic";
import sxForm from "./sxForm";
import { mapMutations, mapState } from "vuex";
import { setStore, getStore } from "@/util/store";

export default {
  components: {
    listCard,
    renderForm,
    sxForm,
  },
  data() {
    return {
      // tab名字
      tabName: {
        add: "新增数据",
        list: "查看数据",
      },
      // 当前激活的tab
      tabActive: "add",
      // 列表数据
      list: [],
      // 列表加载状态
      loading: false,
      // 列表数据全部加载完状态
      finished: false,
      // 列表刷新状态
      refreshing: false,
      // 列表当前页
      current: 1,
      // 列表分页条数
      size: 10,
      // 列表总条数
      total: 0,
      // 列表搜索值
      search: "",
      // 按钮
      buttonList: [],
      // 新增表单页面参数
      addFormParams: {},
      // 编辑表单页面参数
      editFormParams: {},
      // 显示表单页面参数
      viewFormParams: {},
      viewEditParams: {},
      // 列表显示字段
      showColumns: [],
      // 功能路由
      routhPath: "",
      // 主模型ID
      mainModelId: "",
      // 主模型名
      mainModelName: "",
      // 主模型描述
      mainModelRemark: "",
      // 模型配置参数
      mainModelConfig: {},
      // 新增参数加载完毕
      addFlag: false,
      // 显示界面
      viewVisible: false,
    };
  },

  watch: {
    // 监听路由变化
    $route: {
      handler(newVal, oldVal) {
        this.clearData();
        this.routhPath = this.$route.query.path;
        this.mainModelName = this.$route.query.params;
        this.initData();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState("Flow", ["proInstId"]),
  },
  methods: {
    ...mapMutations("Flow", [
      "SET_PROINSTID",
      "SET_FLOWROUTE",
      "SET_TASKID",
      "SET_DIATYPE",
    ]),
    onClickLeft() {
      this.$router.back()
    },
    // 初始化清空数据
    clearData() {
      // tab名字
      this.tabName = {
        add: "新增数据",
        list: "查看数据",
      };
      // 当前激活的tab
      this.tabActive = "add";
      // 列表数据
      this.list = [];
      // 列表加载状态
      this.loading = false;
      // 列表数据全部加载完状态
      this.finished = false;
      // 列表刷新状态
      this.refreshing = false;
      // 列表当前页
      this.current = 1;
      // 列表分页条数
      this.size = 10;
      // 列表总条数
      this.total = 0;
      // 列表搜索值
      this.search = "";
      // 按钮
      this.buttonList = [];
      // 新增页面参数
      this.addFormParams = {};
      // 编辑表单页面参数
      this.editFormParams = {};
      // 显示表单页面参数
      this.viewFormParams = {};
      // 列表显示字段
      this.showColumns = [];
      // 功能路由
      this.routhPath = "";
      // 主模型ID
      this.mainModelId = "";
      // 主模型名
      this.mainModelName = "";
      // 主模型描述
      this.mainModelRemark = "";
      // 模型配置参数
      this.mainModelConfig = {};
      // 新增参数加载完毕
      this.addFlag = false;
    },
    // 初始化查询模型配置以及查询数据
    initData() {
      // 按钮
      getBtnByFunctionPath(this.routhPath).then((res) => {
        this.buttonList = res.data.data;
        for (let i = 0; i < this.buttonList.length; i++) {
          const el = this.buttonList[i];
          if (el.triggerConditions == 1) {
            if (!this.addFlag) {
              this.addFormParams.routePath = this.routhPath;
              this.addFormParams.actionType = "add";
              if (el.things == 2) {
                this.addFormParams.formType = "F";
                this.addFormParams.formCode = el.modelFormName;
              } else {
                this.addFormParams.formType = "M";
                this.addFormParams.mainModelName = this.mainModelName;
              }
              this.addFlag = true;
            }
          } else if (el.triggerConditions == 2) {
            this.editFormParams.routePath = this.routhPath;
            this.editFormParams.actionType = "edit";
            if (el.things == 2) {
              this.editFormParams.formType = "F";
              this.editFormParams.formCode = el.modelFormName;
            } else {
              this.editFormParams.formType = "M";
              this.editFormParams.mainModelName = this.mainModelName;
            }
          } else if (el.triggerConditions == 3) {
            this.viewFormParams.routePath = this.routhPath;
            this.viewFormParams.actionType = "view";
            if (el.things == 2) {
              this.viewFormParams.formType = "F";
              this.viewFormParams.formCode = el.modelFormName;
            } else {
              this.viewFormParams.formType = "M";
              this.viewFormParams.mainModelName = this.mainModelName;
            }
          }
        }
        if (!this.viewFormParams.actionType) {
          this.viewFormParams = this.editFormParams;
          this.viewFormParams.actionType = "view";
        }
      });

      // 查询模型配置
      queryMainFields({
        paramType: "M",
        paramId: this.mainModelId,
        modelName: this.mainModelName,
      }).then((res) => {
        this.mainModelConfig = res.data.data;
        (this.mainModelConfig.mainModel || []).forEach((el) => {
          delete el.controlOtherField;
        });
        this.mainModelId = res.data.data.id;
        this.mainModelName = res.data.data.tableName;
        this.mainModelRemark = res.data.data.tableRemark;
        this.showColumns = res.data.data.mainModel;

        if (this.showColumns) {
          // 根据字段排序
          this.showColumns = this._.sortBy(this.showColumns, [
            "queryOrderNum",
            "id",
          ]);

          this.showColumns = this._.filter(this.showColumns, {
            mobileDisplay: 1,
          });

          if (this.showColumns.length == 0) {
            this.showColumns.push(res.data.data.mainModel[0]);
          }
        }

        this.queryList();
      });
    },

    // 查询数据
    async queryList() {
      let obj = {
        modelId: this.mainModelId,
        modelType: "M",
        search: this.search,
        queryPage: {
          current: this.current,
          size: this.size,
        },
        mainModel: this.mainModelConfig.mainModel,
      };

      const { data } = await getList(obj);
      if (this.refreshing) {
        this.list = [];
        this.current = 1;
        this.refreshing = false;
      }
      this.loading = false;
      this.list = this.list.concat(data.data.records);
      this.total = data.data.total;
      if (this.list.length < data.data.total) {
        this.current++;
      }
      if (this.list.length >= data.data.total) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },

    onRefresh() {
      this.list = [];
      this.current = 1;
      this.finished = true;
      this.queryList();
    },

    handleSearch() {
      this.list = [];
      this.current = 1;
      this.finished = true;
      this.queryList();
    },

    handleSubmitForm(item) {
      this.$refs.sxForm.formClick(item);
    },

    activeChange() {
      this.tabActive = "add";
    },

    handleEdit(item) {
      this.editFormParams.dataId = item["ID"];
      this.viewEditParams = this.editFormParams;
      this.viewEditParams.popupFlag = true;
      this.viewVisible = true;
    },

    showEditPage(item) {
      if (item["PRO_INST_ID"]) {
        this.getCurrentRow(item["PRO_INST_ID"]);
      } else {
        this.viewFormParams.dataId = item["ID"];
        this.viewEditParams = this.viewFormParams;
        this.viewEditParams.popupFlag = true;
        this.viewVisible = true;
      }

      /*
      this.$router.push({
        path: "/mobile/editModel",
        query: {
          dataId: ID,
          formType: "M",
          formId: this.mainModelId,
          title: this.mainModelRemark
        },
      });

       */
      // console.log(ID);
      // // 表单渲染的参数
      // this.renderFormInfoEdit = {
      //   dataId: ID,
      //   formType: "M",
      //   formId: this.mainModelId,
      // };

      // this.editVisible = true;
    },

    getCurrentRow(proInstId) {
      this.SET_PROINSTID(proInstId);
      this.SET_TASKID("");
      this.SET_FLOWROUTE(this.routhPath);
      this.SET_DIATYPE(5);

      // 持久存储 proInstId taskId 防止刷新页面 vuex 被清空
      setStore({
        name: "proInstId",
        content: proInstId,
      });

      setStore({
        name: "taskId",
        content: "",
      });

      setStore({
        name: "flowRoute",
        content: this.routhPath,
      });

      setStore({
        name: "diaType",
        content: 9,
      });

      this.$router.push("/mobile/flowDetail");
    },
  },
};
</script>


<style lang="scss" scoped>
.wrap {
  width: 100%;
  background-color: #f7f8fa;
}
.header,
.footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: unset;
  line-height: unset;
  z-index: 999;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  background-color: #fff;

  .btn {
    margin-right: 1px;
  }
}
.main {
  position: absolute;
  z-index: 1;
  top: 25px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: auto; /* winphone8和android4+ */
  -webkit-overflow-scrolling: touch; /* ios5+ */
  background-color: #f7f8fa;
  padding: 10px 0;
  margin-top: 54px;

  .search {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
  }
}

.none-top {
  margin-top: 10px;
  top: 80px;
  bottom: 50px;
}

.footer-top {
  bottom: 50px;
}

.footerList {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

/deep/.van-tabs--line .van-tabs__wrap {
  border-bottom: 1px solid #eee;
}
</style>

