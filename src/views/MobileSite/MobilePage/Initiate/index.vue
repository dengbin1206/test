<template>
  <div class="done">
    <NavBar @handleSearch="handleSearch" />
    <Tabs :tabList="tabList" ref="tabs" @getCurrentRow="getCurrentRow" />
  </div>
</template>

<script>
import NavBar from "../../MobileComponent/NavBar";
import { setStore } from "@/util/store";
import Tabs from "./initiateTabs";
import { mapMutations } from "vuex";
import * as dd from "dingtalk-jsapi";

export default {
  components: {
    NavBar,
    Tabs,
  },
  data() {
    return {
      active: 0,
      tabList: [
        {
          title: "全部",
        },
        {
          title: "处理中",
        },
        {
          title: "已完成",
        },
        {
          title: "已作废",
        },
      ],
    };
  },
  created() {
    if (dd.env.platform != 'notInDingTalk') {
      dd.ready(function() {
        document.addEventListener('backbutton', function(e) {
          dd.biz.navigation.close();
        });
      });
    }
  },

  methods: {
    ...mapMutations("Flow", ["SET_PROINSTID", "SET_FLOWROUTE", "SET_TASKID"]),

    handleSearch(keyWords) {
      this.$refs.tabs.search = keyWords;
      this.$refs.tabs.onRefresh();
    },

    getCurrentRow({ proInstId }) {
      this.SET_PROINSTID(proInstId);
      this.SET_TASKID("");
      this.SET_FLOWROUTE("myInstanceList");

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
        content: "myInstanceList",
      });

      this.$router.push("/mobile/flowDetail");
    },
  },
};
</script>

<style lang="scss" scoped>
.done {
  height: 100vh;
  overflow-y: auto;
  background-color: #f7f8f9;
}
</style>
