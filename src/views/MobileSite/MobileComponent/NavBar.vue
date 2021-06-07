<template>
  <div>
    <van-search
      v-model="search"
      placeholder="请输入搜索关键词"
      class="todoSearch"
      @search="handleSearch"
      clearable
      show-action
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
      <template #action>
        <span class="text">{{ navBarTitle }}</span>
      </template>
    </van-search>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "navbar",
  data() {
    return {
      search: "",
    };
  },

  computed: {
    ...mapState("Home", ["navBarTitle"]),
  },

  methods: {
    handleSearch() {
      this.$emit("handleSearch", this.search);
    },
  },
};
</script>

<style lang="scss" scoped>
.todoSearch {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0;
  z-index: 9;
  border-bottom: 1px solid #f6f7f8;

  .arrowIcon {
    margin-right: 4px;
  }

  .text {
    color: #0079fe;
  }
}
</style>