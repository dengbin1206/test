<template>
  <el-container style="width:100%;height:100%;background-color: #fff">
    <h4 style="width:100%;text-align:center;margin:0">检验单</h4>
    <el-header style="padding-left:0;padding-right:10px;">
      <van-search
        v-model="search"
        placeholder="请输入搜索关键词"
        class="todoSearch"
        @search="handleSearch"
        clearable
      >
        <template #left>
          <van-icon
            name="arrow-left"
            size="1rem"
            color="#0079fe"
            class="arrowIcon"
            @click="$router.push('/mobile/home')"
          />
        </template>
      </van-search>
    </el-header>
    <el-main>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="pullrefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          ref="list"
        >
          <div
            class="list-item"
            :style="getBorderLeftColor(item)"
            :key="index"
            v-for="(item,index) in list"
            @click="getDetail(item)"
          >
            <div>
              <span style="color: #323233;font-weight: 700;font-size:14px">
                <span>检验单号:</span>
                <span>{{item.testListCode}}</span>
              </span>
              <span style="color: #969799;font-weight: 400;font-size:12px">{{item.finalJudgment}}</span>
            </div>
            <div>
              <span style="color: #969799;font-weight: 400;font-size:12px">
                <span>合同号:</span>
                <span>{{item.contractCode}}</span>
              </span>
              <span style="color: #969799;font-weight: 400;font-size:12px">{{item.createTime}}</span>
            </div>
            <div>
              <span style="color: #969799;font-weight: 400;font-size:12px">
                <span>检验单名称:</span>
                <span>{{item.produceName}}</span>
              </span>
              <span style="color: #969799;font-weight: 400;font-size:12px">{{item.testPersonName}}</span>
            </div>
          </div>
        </van-list>
        <div class="placeholder"></div>
      </van-pull-refresh>
    </el-main>
    <el-footer style="width:100%;">
      <el-button type="primary" style="width:100%" @click="addTest">新建检验单</el-button>
    </el-footer>
  </el-container>
</template>
<script>
import { getList } from "@/api/quality/testList_m";
export default {
  data() {
    return {
      search: "",
      loading: false,
      refreshing: false,
      finished: false,
      current: 1,
      size: 10,
      total: null,
      list: []
    };
  },
  created() {},
  mounted() {
    this.onLoad();
  },
  methods: {
    addTest() {
      this.$router.push("/quality/test");
    },
    async onLoad() {
      const { data } = await getList(this.search, this.current, this.size);
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
    getBorderLeftColor(item) {
      if (item.finalJudgmentCode == "1") {
        return "border-left:1px solid green ";
      }
      if (item.finalJudgmentCode == "2") {
        return "border-left:1px solid rgb(82, 193, 245) ";
      }
      if (item.finalJudgmentCode == "3") {
        return "border-left:1px solid red ";
      }
      if (item.finalJudgmentCode == "4") {
        return "border-left:1px solid #ccc ";
      }
    },
    handleSearch(value) {
      this.list = [];
      this.current = 1;
      this.onLoad();
    },
    onRefresh() {
      this.list = [];
      this.current = 1;
      this.finished = true;
      this.onLoad();
    },
    getDetail(item) {
      this.$router.push({
        path: "/quality/testRecord",
        query: { id: item.id }
      });
    }
  }
};
</script>

<style scoped>
.list-item {
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
  margin-top: 10px;
  width: 100%;
  height: 110px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
}
.list-item div {
  display: flex;
  justify-content: space-between;
}
</style>