<template>
  <div class="listCard">
    <van-collapse v-model="activeNames" :border="false">
      <van-collapse-item
        v-for="(item, index) in flowInstanceCopyList"
        :key="index"
        :title="`${item.createUserName} 抄送给 ${item.delegateUserName}`"
        :name="index"
      >
        <div class="message">留言: {{ item.memo }}</div>
        <div class="reply">回复: {{ item.reply }}</div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  props: {
    flowInstanceCopyList: {
      type: Array,
    },
  },
  data() {
    return {
      activeNames: ['0'],
    };
  },
};
</script>

<style lang="scss" scoped>
.listCard {
  width: 90%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 3% auto;
  border-radius: 7px;
  padding: 10px 12px;
  background: #fff;

  .message, .reply{
      word-break: break-all;
  }
}
</style>