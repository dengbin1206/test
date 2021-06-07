<template>
  <van-goods-action>
    <van-goods-action-icon
      icon="chat-o"
      text="回退"
      @click="onClickButton('back')"
      v-if="backFlag === 1 && flowRoute === 'myTodoList'"
    >
      <template #icon>
        <van-icon
          class-prefix="iconfont"
          name="rollback"
          size="1rem"
          color="#0079fe"
          class="icon"
        />
      </template>
    </van-goods-action-icon>
    <van-goods-action-icon
      icon="chat-o"
      text="抄送"
      @click="onClickButton('copy')"
      v-if="flowRoute === 'myTodoList'"
    >
      <template #icon>
        <van-icon
          class-prefix="iconfont"
          name="send"
          size="1rem"
          color="#0079fe"
          class="icon"
        />
      </template>
    </van-goods-action-icon>
    <van-goods-action-icon
      icon="cart-o"
      text="转办"
      @click="onClickButton('transfer')"
      v-if="flowRoute === 'myTodoList'"
    >
      <template #icon>
        <van-icon
          class-prefix="iconfont"
          name="sync"
          size="1rem"
          color="#0079fe"
          class="icon"
        />
      </template>
    </van-goods-action-icon>
    <van-goods-action-icon
      icon="shop-o"
      text="签收"
      @click="onClickButton('singin')"
      v-if="signForFlag === 1 && flowRoute === 'myTodoList'"
    >
      <template #icon>
        <van-icon
          class-prefix="iconfont"
          name="safetycertificate"
          size="1rem"
          color="#0079fe"
          class="icon"
        />
      </template>
    </van-goods-action-icon>
    <van-goods-action-button
      type="danger"
      text="拒绝"
      color="#F56C6C"
      @click="onClickButton('reject')"
      v-if="flowRoute === 'myTodoList'"
    />
    <van-goods-action-button
      type="primary"
      text="同意"
      color="#409EFF"
      :loading="loading"
      @click="onClickButton('confirm')"
      v-if="flowRoute === 'myTodoList'"
    />

    <van-goods-action-button
      text="授权查看"
      color="#409EFF"
      v-if="flowRoute === 'myDoneList' || flowRoute === 'myInstanceList'"
      @click="onClickButton('rights')"
    />
    <van-goods-action-button
      text="作废"
      color="#F56C6C"
      v-if="
        (flowRoute === 'myDoneList' || flowRoute === 'myInstanceList') &&
        status === 1 &&
        myFlowFlag === 1
      "
      @click="onClickButton('trash')"
    />
    <van-goods-action-button
      text="取回"
      color="#ffc20e"
      @click="onClickButton('widthdrew')"
      v-if="
        (flowRoute === 'myDoneList' || flowRoute === 'myInstanceList') &&
        status === 1
      "
    />

    <van-goods-action-button
      text="保存"
      color="#409EFF"
      v-if="flowRoute === 'instCopyReplyList'"
      @click="onClickButton('copyReplySave')"
    />
  </van-goods-action>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: ["signForFlag", "backFlag", "loading", "status", "myFlowFlag"],
  data() {
    return {};
  },

  computed: {
    ...mapState("Flow", ["flowRoute"]),
  },

  methods: {
    onClickButton(type) {
      this.$emit("onClickButton", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin-top: 3px;
}

/deep/.van-goods-action {
  z-index: 99999;
}
</style>