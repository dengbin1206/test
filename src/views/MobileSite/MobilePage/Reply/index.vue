<template>
  <div class="done">
    <NavBar @handleSearch="handleSearch" />
    <Tabs :tabList="tabList" ref="tabs" @getCurrentRow="getCurrentRow" />
  </div>
</template>

<script>
import NavBar from "../../MobileComponent/NavBar";
import Tabs from "./replyTabs";
import { mapMutations } from "vuex";
import { setStore } from "@/util/store";
import { changeCopyStatus } from "@/api/mobileApi/flow.js";

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
          title: "未读",
        },
        {
          title: "已读",
        },
        {
          title: "全部",
        },
      ],
    };
  },

  methods: {
    ...mapMutations("Flow", [
      "SET_PROINSTID",
      "SET_FLOWROUTE",
      "SET_TASKID",
      "SET_COPYREPLYID",
    ]),

    handleSearch(keyWords) {
      this.$refs.tabs.search = keyWords;
      this.$refs.tabs.onRefresh();
    },

    async getCurrentRow({ proInstId, readStatus, id, reply }) {
      if (readStatus === 0) {
        const { data } = await changeCopyStatus(proInstId);
      }
      this.SET_COPYREPLYID(id);
      this.SET_PROINSTID(proInstId);
      this.SET_TASKID("");
      this.SET_FLOWROUTE("instCopyReplyList");

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
        name: "copyReplyId",
        content: id,
      });

      setStore({
        name: "flowRoute",
        content: "instCopyReplyList",
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