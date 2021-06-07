<template>
  <el-calendar v-model="value">
    <!-- 布局样式1 -->
    <template slot="dateCell" slot-scope="{ data }">
      <div class="custom-cell upBot" @contextmenu="contextmenu">
        <div>
          <el-badge :is-dot="data.isSelected">
            {{ data.day.split("-").slice(2).join("-") }}
          </el-badge>
        </div>
        <div class="date-lunar">{{ solarDate2lunar(data.day) }}</div>
      </div>
    </template>

    <!-- 布局样式2 -->
    <!-- <template slot="dateCell" slot-scope="{ data }">
      <div class="custom-cell">
        <div class="custom-cell-date">
          <el-badge :is-dot="data.isSelected">
            {{ data.day.split("-").slice(2).join("-") }}
          </el-badge>
        </div>
        <div class="custom-cell-content">
          <div class="date-lunar">
            {{ solarDate2lunar(data.day) }}
          </div>
          <el-popover placement="bottom" width="300" trigger="hover">
            <div class="schedule-list">
              <ul>
                <li class="schedule-list-line title">{{ data.day }}</li>
                <li
                  class="schedule-list-line"
                  v-for="(item, index) in plan"
                  :key="index"
                >
                  <div :class="[`left ${item.complete ? 'through' : ''}`]">
                    {{ item.desc }}
                  </div>
                  <div class="actions">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-check"
                      @click="handleCheck(item, index)"
                    />
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-delete"
                      @click="handleDelete(item, index)"
                    />
                  </div>
                </li>
              </ul>
            </div>
            <div slot="reference" class="schedule-row" v-if="plan.length > 0">
              {{ plan[0].desc }}
            </div>
            <div slot="reference" class="schedule-row" v-else>暂无日程</div>
          </el-popover>
        </div>
      </div>
    </template> -->
  </el-calendar>
</template>

<script>
import { calendar } from "./solarTolunar";
export default {
  name: "sxCalendarPro",
  data() {
    return {
      value: "",
      visible: false,
      plan: [
        {
          desc: "完成某个计划后开会汇报",
          complete: true,
        },
        {
          desc: "完成某个计划后开会汇报",
          complete: false,
        },
        {
          desc: "完成某个计划后开会汇报",
          complete: false,
        },
        {
          desc: "完成某个计划后开会汇报",
          complete: false,
        },
        {
          desc: "完成某个计划后开会汇报",
          complete: false,
        },
        {
          desc: "完成某个计划后开会汇报",
          complete: false,
        },
      ],
    };
  },

  computed: {},

  methods: {
    // 农历显示
    solarDate2lunar(solarDate) {
      var solar = solarDate.split("-");
      var lunar = calendar.solar2lunar(solar[0], solar[1], solar[2]);
      return lunar.IMonthCn + lunar.IDayCn;
    },

    handleCheck(item, index) {
      item.complete = !item.complete;
    },

    handleDelete(item, index) {
      this.plan.splice(index, 1);
    },

    contextmenu(event){
        event.preventDefault()
        event.stopPropagation()
    }
  },
};
</script>

<style lang="scss" scoped>
.custom-cell {
  height: 100%;
  display: flex;

  &-date {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  &-content {
    width: 60%;

    .date-lunar {
      font-size: 13px;
    }

    .schedule {
      font-size: 10px;
      color: #0079fe;

      &-row {
        font-size: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.upBot {
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .date-lunar {
    font-size: 12px;
  }
}

.schedule-list {
  height: 115px;
  overflow-y: scroll;

  &-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;

    .left {
      text-decoration: unset;
    }

    .through {
      text-decoration: line-through;
    }
  }
}

/deep/.el-calendar-day {
  padding: 3px;
}

/deep/.el-calendar-table thead {
  background-color: #409eff;
  border: 1px solid #ebeef5;
  border-bottom: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;

  th {
    color: #fff;
  }
}
</style>