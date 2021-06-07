<template>
  <div class="list-card">
    <div class="list-card-left" @click="handleClick">
      <li class="title">
        {{ `${mainModel[0]["dbFieldRemark"]}: ${valueChange(mainModel[0])}` }}
        <van-tag
          :type="flowStatusType[rowData['FLOW_STATUS']]"
          size="small"
          style="margin-left: 5px"
          >{{ flowStatusText[rowData["FLOW_STATUS"]] }}</van-tag
        >
      </li>
      <li
        class="content"
        v-for="(item, index) in mainModel.filter((e, i) => i !== 0)"
        :key="index"
      >
        {{ `${item["dbFieldRemark"]}: ${valueChange(item)}` }}
      </li>
    </div>
    <div
      class="list-card-right"
      @click="handleEdit"
      v-if="
        !rowData['FLOW_STATUS'] ||
        Object.is(rowData['FLOW_STATUS'], '') ||
        rowData['FLOW_STATUS'] == 0
      "
    >
      <van-icon name="edit" size="20" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
    mainModel: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    valueChange() {
      return function (obj) {
        if (this.rowData) {
          if (this.rowData[`$${obj.modelAndField}`]) {
            return this.rowData[`$${obj.modelAndField}`];
          } else {
            return this.rowData[obj.modelAndField];
          }
        }
      };
    },
  },

  methods: {
    handleClick() {
      this.$emit("click");
    },

    handleEdit() {
      this.$emit("handleEdit");
    },
  },

  data() {
    return {
      // 12、流程状态颜色
      flowStatusType: [
        "info",
        "warning",
        "success",
        "danger",
        "warning",
        "success",
        "danger",
        "info",
      ],
      // 13、流程状态文字
      flowStatusText: [
        "未提交审批",
        "审批中",
        "审批通过",
        "审批作废",
        "变更审批中",
        "变更审批通过",
        "变更审批作废",
        "待提交变更审批",
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.list-card {
  width: 95%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 10px;
  display: flex;

  &-left {
    width: 90%;
    li {
      list-style: none;
    }

    .title {
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
    }

    .content {
      font-size: 14px;
      color: #969799;
    }
  }

  &-right {
    width: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: unset;
    }

    span {
      font-size: 14px;
    }

    .title {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .small {
      color: #969799;
      font-size: 12px;
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: unset;
      }
    }

    .time {
      font-size: 14px;
    }

    .status {
      font-size: 14px;
      &-success {
        color: #07c160;
      }

      &-danger {
        color: #ee0a24;
      }
    }
  }

  .none-flex {
    display: unset;
  }

  .start {
    justify-content: flex-start;

    span {
      width: 60px;
      white-space: nowrap;
    }

    .content {
      font-size: 14px;

      p {
        display: inline;
      }
    }
  }
}
</style>