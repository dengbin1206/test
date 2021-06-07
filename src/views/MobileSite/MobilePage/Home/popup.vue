<template>
  <van-popup
    v-model="visible"
    get-container="body"
    position="bottom"
    class="popup"
    :close-on-click-overlay="false"
  >
    <van-nav-bar title="个人设置" left-arrow @click-left="onClickLeft" />
    <van-cell-group class="cellgroup">
      <van-cell title="个人资料" is-link @click="getInfo" />
    </van-cell-group>
    <div class="logout" @click="handleLogout">退出登录</div>

    <van-action-sheet
      v-model="actionsVisible"
      :actions="actionsLogout"
      cancel-text="取消"
      close-on-click-action
      :round="false"
      @select="handleSelect"
    />
  </van-popup>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { resetRouter } from "@/router/router";
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      actionsVisible: false,
    };
  },

  props: {
    showPopup: Boolean,
    default: false,
  },

  computed: {
    ...mapState("Home", ["popoupVisible", "actionsLogout"]),

    visible: {
      get() {
        return this.showPopup;
      },

      set(val) {
        this.$emit("update:showPopup", val);
      },
    },
  },

  methods: {
    onClickLeft() {
      this.visible = false;
    },

    handleLogout() {
      this.actionsVisible = true;
    },

    getInfo() {
      Toast("暂未开发...");
    },

    handleSelect(action, index) {
      let { name } = action;
      switch (name) {
        case "退出登录":
          Dialog.confirm({
            title: "提示",
            message: "是否确认退出?",
          })
            .then(() => {
              this.$store.dispatch("LogOut").then(() => {
                resetRouter();
                this.visible = false;
                this.$router.push({ path: "/login" });
              });
            })
            .catch(() => {});
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 100%;
  background-color: #f6f7f8;

  .cellgroup {
    margin-top: 10px;
  }

  .logout {
    background-color: #fff;
    margin-top: 10px;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    padding: 10px 16px;
    box-sizing: border-box;
    text-align: center;
  }
}
</style>