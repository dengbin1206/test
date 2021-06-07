<template>
  <div>
    <van-nav-bar
      title="授权查看"
      left-arrow
      @click-left="$parent.close()"
    ></van-nav-bar>
    <van-cell title="授权用户" label="123123" is-link @click="showUserSelect">
      <template #label>
        <van-tag
          plain
          type="primary"
          v-for="(item, index) in selectedList"
          :key="index"
          class="tag"
          >{{ item.realName }}</van-tag
        >
      </template>
    </van-cell>
    <van-goods-action>
      <van-goods-action-button text="确认" color="#409EFF" @click="onSubmit" />
    </van-goods-action>

    <!-- 用户选择 -->
    <van-popup
      v-model="showSelectUserList"
      get-container="body"
      class="popup"
      position="bottom"
    >
      <userSelect @onConfirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>
import userSelect from "./userSelect";

export default {
  components: {
    userSelect,
  },
  data() {
    return {
      showSelectUserList: false,
      selectedList: [],
    };
  },

  methods: {
    onConfirm(users) {
      this.selectedList = users;
    },

    showUserSelect() {
      this.showSelectUserList = true;
    },

    onSubmit() {
      let userIds = this.selectedList.map((e) => e.id);
      this.$emit("onSubmit", userIds);
    },
  },
};
</script>

<style lang="scss" scoped>
.tag {
  margin-top: 4px;
  margin-bottom: 4px;
  margin-right: 3px;
}
</style>