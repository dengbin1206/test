<template>
  <div class="listCard">
    <div class="waterMark">
      <img :src="mapWaterMark[status]" />
    </div>
    <div class="cellCard">
      <div class="left">
        <van-icon
          class-prefix="iconfont"
          name="Field-number"
          size="1rem"
          color="#0079fe"
        />
        <span>事务编号:</span>
      </div>
      <div class="right">{{ flowInstanceVo.instId }}</div>
    </div>
    <div class="cellCard">
      <div class="left">
        <van-icon
          class-prefix="iconfont"
          name="notification"
          size="1rem"
          color="#0079fe"
        />
        <span>事务标题:</span>
      </div>
      <div class="right">{{ flowInstanceVo.title }}</div>
    </div>
    <div class="cellCard">
      <div class="left">
        <van-icon
          class-prefix="iconfont"
          name="bank"
          size="1rem"
          color="#0079fe"
        />
        <span>申请部门:</span>
      </div>
      <div class="right">{{ flowInstanceVo.deptName }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flowInstanceVo: {
      type: Object,
      default: {},
    },
    status: {
      type: Number,
    },
  },
  data() {
    return {
      mapWaterMark: [
        require("../../../MobileAssets/image/todo.png"),
        require("../../../MobileAssets/image/done.png"),
        require("../../../MobileAssets/image/reject.png"),
        require("../../../MobileAssets/image/redo.png"),
      ],
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
  position: relative;

  .contentCard {
    .title {
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .time {
      display: flex;
      align-items: center;
    }

    .comment {
      margin-top: 3px;
      font-size: 12px;
      color: #969799;
    }

    .fileList {
      margin-top: 3px;
      font-size: 12px;
      box-sizing: border-box;
      color: #323233;
      font-size: 14px;
      line-height: 24px;
      background-color: #fff;
      display: flex;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .waterMark {
    width: 80px;
    height: 80px;
    position: absolute;
    right: 15px;
    bottom: 5px;

    img {
      width: 100%;
      height: 100%;
    }

    // src 没有时，设置border 空
    img[src=""],
    img:not([src]) {
      opacity: 0;
    }
  }

  .cellCard {
    box-sizing: border-box;
    padding: 5px;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      display: flex;
      align-items: center;
    }
    .right {
      width: 85%;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
    }
  }
}
</style>